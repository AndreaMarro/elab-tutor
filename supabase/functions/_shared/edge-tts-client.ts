/**
 * edge-tts-client — Microsoft Edge Read Aloud TTS wrapper (Deno)
 *
 * Sprint S iter 6 — Task A3 (Isabella Neural support, no GPU, no VPS dep).
 *
 * Why Microsoft edge-tts:
 *   - it-IT-IsabellaNeural voice (approvato Andrea 2026-04-26 per UNLIM)
 *   - free public Trusted Client Token endpoint (used by JaVi7864/edge-tts-py-deno + rany2/edge-tts)
 *   - SSML rate/pitch tuning (rate '-5%' default per ragazzi 8-14)
 *   - returns audio/mpeg stream (<24kHz mp3 ~ small for Edge Function payload)
 *
 * Reference impls:
 *   - rany2/edge-tts (python) — websocket protocol audio.24khz-48kbitrate-mono-mp3
 *   - JaVi7864/edge-tts-py-deno (deno) — same protocol Deno port
 *
 * This module uses the lower-friction REST-style synthesis endpoint that the
 * Edge browser READ-ALOUD feature uses. Authentication via TRUSTED_CLIENT_TOKEN
 * (public, rotated by MS — same one rany2/edge-tts uses).
 *
 * Fallback: if endpoint returns non-2xx OR network fails, function returns
 * { ok: false, errorReason } and unlim-tts/index.ts falls back to browser TTS
 * (graceful degradation pattern preserved iter 1-5).
 *
 * (c) Andrea Marro — 26/04/2026 — ELAB Tutor
 */

export interface IsabellaTTSRequest {
  text: string;
  /** SSML voice short name; default 'it-IT-IsabellaNeural' */
  voice?: string;
  /** SSML rate, e.g. '-5%' '0%' '+10%'; default '-5%' (ragazzi) */
  rate?: string;
  /** SSML pitch, e.g. 'default' '-2Hz' '+2Hz'; default 'default' */
  pitch?: string;
}

export interface IsabellaTTSResult {
  ok: boolean;
  audio?: ArrayBuffer;
  contentType?: string;
  errorReason?: string;
  latencyMs: number;
}

// Public Trusted Client Token used by Microsoft Edge Read-Aloud feature.
// Documented in rany2/edge-tts (MIT). Not a secret per se — rotated server-side.
const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';

const SYNTH_BASE = 'https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1';

const DEFAULT_VOICE = 'it-IT-IsabellaNeural';
const DEFAULT_RATE = '-5%';
const DEFAULT_PITCH = 'default';

/** Output audio format. mp3 24kHz 48kbps mono — small + standard for browser playback. */
const OUTPUT_FORMAT = 'audio-24khz-48kbitrate-mono-mp3';

/** Hard cap text per request (Microsoft endpoint refuses huge SSML). */
const MAX_TEXT_LEN = 500;

/** XML escape for SSML body (text injected between tags). */
function escapeForSsml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Build SSML envelope identical to Edge Read-Aloud payload. */
export function buildIsabellaSsml(text: string, voice: string, rate: string, pitch: string): string {
  const safe = escapeForSsml(text.slice(0, MAX_TEXT_LEN));
  return [
    `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='it-IT'>`,
    `<voice name='${voice}'>`,
    `<prosody rate='${rate}' pitch='${pitch}'>${safe}</prosody>`,
    `</voice>`,
    `</speak>`,
  ].join('');
}

/**
 * Synthesize speech via Microsoft Edge Read-Aloud endpoint.
 * Returns ArrayBuffer mp3 on success, error reason on failure.
 *
 * NOTE: this uses a non-websocket REST surface. If MS removes it, switch to
 * the websocket variant from rany2/edge-tts (port to Deno via WebSocket API).
 */
export async function synthesizeIsabella(req: IsabellaTTSRequest): Promise<IsabellaTTSResult> {
  const start = Date.now();
  const text = (req.text || '').trim();
  if (!text) {
    return { ok: false, errorReason: 'empty text', latencyMs: 0 };
  }
  const voice = (req.voice || DEFAULT_VOICE).trim();
  const rate = (req.rate || DEFAULT_RATE).trim();
  const pitch = (req.pitch || DEFAULT_PITCH).trim();
  const ssml = buildIsabellaSsml(text, voice, rate, pitch);

  const url = `${SYNTH_BASE}?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': OUTPUT_FORMAT,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      },
      body: ssml,
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      const bodyText = await safeReadText(res);
      return {
        ok: false,
        errorReason: `edge-tts http ${res.status}: ${bodyText.slice(0, 120)}`,
        latencyMs: Date.now() - start,
      };
    }

    const audio = await res.arrayBuffer();
    if (!audio || audio.byteLength < 64) {
      return {
        ok: false,
        errorReason: `edge-tts empty audio (bytes=${audio ? audio.byteLength : 0})`,
        latencyMs: Date.now() - start,
      };
    }
    return {
      ok: true,
      audio,
      contentType: 'audio/mpeg',
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    clearTimeout(timer);
    const msg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      errorReason: `edge-tts fetch failed: ${msg.slice(0, 120)}`,
      latencyMs: Date.now() - start,
    };
  }
}

async function safeReadText(res: Response): Promise<string> {
  try { return await res.text(); } catch { return ''; }
}

export const ISABELLA_DEFAULTS = {
  voice: DEFAULT_VOICE,
  rate: DEFAULT_RATE,
  pitch: DEFAULT_PITCH,
  outputFormat: OUTPUT_FORMAT,
};
