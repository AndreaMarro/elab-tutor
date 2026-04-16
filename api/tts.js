/**
 * ELAB — /api/tts serverless proxy
 *
 * Problem: the production site elabtutor.school is served over HTTPS but the
 * Edge TTS engine runs on a plain HTTP VPS (http://72.60.129.50:8880).
 * Browsers block HTTPS→HTTP as mixed content, so UNLIM's voice never plays
 * in production. This Vercel Edge Function provides a same-origin HTTPS
 * endpoint that relays the request to the VPS server-side.
 *
 * Contract
 * ────────
 *   GET /api/tts?text=<uri-encoded-text>[&voice=<voice-id>]
 *     → 200 audio/* with the raw TTS bytes
 *     → 400 when the text parameter is missing or too long
 *     → 502 when the upstream VPS is unreachable or errors out
 *     → 405 for non-GET methods
 *
 * Notes
 * ─────
 *  - GET is intentional so the PWA service worker can cache replies and the
 *    browser can stream directly into an `<audio>` element with `new Audio()`.
 *  - Text is capped at 500 characters — Edge TTS latency grows linearly with
 *    input length; longer replies are truncated upstream anyway. This also
 *    bounds any possible abuse of the proxy.
 *  - Timeout is 15s — long enough for a cold Edge TTS process, short enough
 *    to fall through to the browser's `speechSynthesis` fallback in the UI.
 *
 * © Andrea Marro — 18/04/2026 — Ralph Loop iteration 1 (PDR v3 TASK 10)
 */

const UPSTREAM_BASE = process.env.EDGE_TTS_URL || 'http://72.60.129.50:8880';
const MAX_TEXT_LENGTH = 500;
const REQUEST_TIMEOUT_MS = 15000;

export default async function handler(req, res) {
  // Only GET — the PWA service worker can cache replies, and `<audio src>`
  // only issues GETs. POST would force us to lose cache-ability.
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed — use GET' });
  }

  const rawText = typeof req.query?.text === 'string' ? req.query.text : '';
  const voice = typeof req.query?.voice === 'string' ? req.query.voice : '';

  if (!rawText || rawText.trim().length === 0) {
    return res.status(400).json({ error: 'Missing "text" query parameter' });
  }

  // Defensive: cap length to avoid abuse / runaway latency
  const text = rawText.slice(0, MAX_TEXT_LENGTH);

  const upstreamUrl = new URL('/tts', UPSTREAM_BASE);
  upstreamUrl.searchParams.set('text', text);
  if (voice) upstreamUrl.searchParams.set('voice', voice);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const upstream = await fetch(upstreamUrl.toString(), {
      method: 'GET',
      signal: controller.signal,
      headers: {
        // Identify ourselves so the VPS access log is meaningful
        'User-Agent': 'ELAB-Tutor-TTS-Proxy/1.0',
      },
    });

    if (!upstream.ok) {
      return res.status(502).json({
        error: 'Upstream TTS returned non-2xx',
        status: upstream.status,
      });
    }

    // Preserve the upstream content type so the browser picks the right
    // decoder (audio/wav, audio/mpeg, audio/ogg).
    const contentType = upstream.headers.get('content-type') || 'audio/wav';
    res.setHeader('Content-Type', contentType);

    // Cache for 1 day — identical text produces identical audio, and we've
    // clamped text length so the cache key space stays small. Publicly
    // cacheable because there's nothing PII in a TTS render.
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');

    const buffer = Buffer.from(await upstream.arrayBuffer());
    return res.status(200).send(buffer);
  } catch (err) {
    const isAbort = err?.name === 'AbortError';
    return res.status(502).json({
      error: isAbort ? 'Upstream TTS timeout' : 'Upstream TTS unreachable',
      detail: err?.message || String(err),
    });
  } finally {
    clearTimeout(timer);
  }
}
