/**
 * unlim-stt — Edge Function (Sprint T iter 25)
 *
 * Speech-to-text via Cloudflare Workers AI Whisper Large v3 Turbo.
 * Italian K-12 voice transcription for ELAB Tutor docente input.
 *
 * POST /unlim-stt
 * Body: multipart/form-data with 'audio' file (.mp3/.wav/.webm/.flac)
 *   OR JSON { audio_base64: string, sessionId: string, language?: 'it'|'en' }
 * Returns: { success: true, text: string, language: string, model: '@cf/openai/whisper-large-v3-turbo' }
 *
 * (c) Andrea Marro — 2026-04-29
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { getCorsHeaders, getSecurityHeaders, checkBodySize, BODY_SIZE_MULTIMODAL } from '../_shared/guards.ts';
import { cfWhisperSTT } from '../_shared/cloudflare-client.ts';
// iter 39 ralph A5 — Voxtral Transcribe 2 STT migration per ADR-031.
// Voxtral primary (4% WER FLEURS Italian + EU FR GDPR + $0.003/min) + CF Whisper fallback.
import { transcribeVoxtral, isVoxtralSTTEnabled, getVoxtralSTTModel } from '../_shared/voxtral-stt-client.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: getCorsHeaders(req) });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405, headers: getSecurityHeaders(req),
    });
  }

  const bodyCheck = checkBodySize(req, BODY_SIZE_MULTIMODAL);
  if (bodyCheck) return bodyCheck;

  try {
    let audioBytes: Uint8Array;
    let language = 'it';
    let sessionId = '';

    const contentType = req.headers.get('content-type') || '';

    // Iter 32 P0 fix — handle 3 input shapes:
    //   1. multipart/form-data (audio File field)
    //   2. application/json {audio_base64, sessionId, language}
    //   3. audio/* (audio/mpeg, audio/wav, audio/mp4, audio/x-m4a, audio/webm, ...) raw binary
    // Previous iter 30 fix only handled 1+2; massive E2E test iter 31 (Batch E)
    // confirmed harness sent audio/mpeg directly → JSON parse error "Unexpected token I".
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const audioFile = formData.get('audio') as File | null;
      if (!audioFile) {
        return new Response(JSON.stringify({ success: false, error: 'audio file required' }), {
          status: 400, headers: getSecurityHeaders(req),
        });
      }
      audioBytes = new Uint8Array(await audioFile.arrayBuffer());
      language = (formData.get('language') as string) || 'it';
      sessionId = (formData.get('sessionId') as string) || '';
    } else if (contentType.startsWith('audio/')) {
      // Raw audio binary upload (audio/mpeg, audio/wav, audio/mp4, audio/x-m4a, etc.)
      const buf = await req.arrayBuffer();
      audioBytes = new Uint8Array(buf);
      language = (req.headers.get('x-language') as string) || 'it';
      sessionId = (req.headers.get('x-session-id') as string) || '';
    } else {
      // application/json path
      const body = await req.json();
      if (!body.audio_base64 || typeof body.audio_base64 !== 'string') {
        return new Response(JSON.stringify({ success: false, error: 'audio_base64 OR multipart audio OR audio/* binary required' }), {
          status: 400, headers: getSecurityHeaders(req),
        });
      }
      const binStr = atob(body.audio_base64);
      audioBytes = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) audioBytes[i] = binStr.charCodeAt(i);
      language = body.language || 'it';
      sessionId = body.sessionId || '';
    }

    if (!sessionId) {
      return new Response(JSON.stringify({ success: false, error: 'sessionId required (UUID)' }), {
        status: 400, headers: getSecurityHeaders(req),
      });
    }

    // Cap audio size 10MB
    if (audioBytes.length > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ success: false, error: 'audio too large (>10MB)' }), {
        status: 413, headers: getSecurityHeaders(req),
      });
    }

    // iter 39 ralph A5 — Voxtral primary + CF Whisper fallback per ADR-031.
    // STT_PROVIDER='voxtral' env activates Mistral path. Default 'cf-whisper'
    // preserves incumbent CF Whisper Turbo for safe canary rollout.
    const useVoxtral = isVoxtralSTTEnabled();
    let result: { text: string; language?: string; latencyMs: number };
    let provider = 'cloudflare-workers-ai';
    let model = '@cf/openai/whisper-large-v3-turbo';
    let voxtralFailed: string | null = null;

    if (useVoxtral) {
      try {
        const v = await transcribeVoxtral({
          audioBytes,
          mimeType: contentType || 'audio/mp3',
          language,
        });
        result = { text: v.text, language: v.language, latencyMs: v.latencyMs };
        provider = 'voxtral-transcribe-2';
        model = getVoxtralSTTModel();
      } catch (voxErr) {
        voxtralFailed = voxErr instanceof Error ? voxErr.message : String(voxErr);
        console.warn(JSON.stringify({
          level: 'warn', event: 'voxtral_stt_fallback_to_cf',
          error: voxtralFailed,
          timestamp: new Date().toISOString(),
        }));
        // Fall through to CF Whisper fallback
        const cfRes = await cfWhisperSTT({ audio: audioBytes, language });
        result = cfRes;
        provider = 'cloudflare-workers-ai-fallback';
      }
    } else {
      // CF Whisper primary path (legacy, default)
      result = await cfWhisperSTT({ audio: audioBytes, language });
    }

    return new Response(JSON.stringify({
      success: true,
      text: result.text,
      language: result.language || language,
      model,
      provider,
      latencyMs: result.latencyMs,
      voxtral_fallback_reason: voxtralFailed || undefined,
    }), {
      status: 200, headers: getSecurityHeaders(req),
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    console.error(JSON.stringify({
      level: 'error', event: 'unlim_stt_error', error: msg,
      timestamp: new Date().toISOString(),
    }));
    return new Response(JSON.stringify({
      success: false, error: 'Transcription failed', details: msg.slice(0, 200),
    }), {
      status: 500, headers: getSecurityHeaders(req),
    });
  }
});
