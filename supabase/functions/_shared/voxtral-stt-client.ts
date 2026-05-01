/**
 * voxtral-stt-client — Mistral Voxtral Transcribe 2 STT (iter 39 ralph A5)
 *
 * Sibling to voxtral-client.ts (TTS). Same MISTRAL_API_KEY.
 *
 * Endpoint: POST https://api.mistral.ai/v1/audio/transcriptions
 * Pricing:  $0.003/min Mini (vs CF Whisper free-shared-10k/day)
 * WER:      ~4% FLEURS Italian K-12
 * GDPR:     EU France Mistral La Plateforme (vs CF Workers AI US/EU edge)
 * Latency:  <500ms target vs CF Whisper 1071-2200ms iter 37 measured
 *
 * Per ADR-031 §4 Architecture. Implements design verbatim.
 *
 * (c) iter 39 ralph A5 — Onnipotenza migration STT 100% Mistral stack
 */

import { GeminiError, ErrorCode } from './gemini.ts';

const VOXTRAL_STT_URL = 'https://api.mistral.ai/v1/audio/transcriptions';
// Model ID per ADR-031 §4 — verified at Mistral docs https://docs.mistral.ai/api/
// Voxtral Mini v2 (2503 release) is the current production transcription model.
const VOXTRAL_STT_MODEL = (Deno.env.get('VOXTRAL_STT_MODEL') || 'voxtral-mini-v2-2503').trim();
// ELAB domain context bias improves WER on Italian K-12 electronics terminology
// (Arduino, breadboard, MOSFET, etc — non-trivial for general-purpose Whisper models).
const ELAB_CONTEXT_BIAS = 'Arduino breadboard MOSFET LED resistenza condensatore circuito esperimento kit ELAB volumi pin GND digitalWrite analogRead servomotore';
const STT_TIMEOUT_MS = 10000;  // 10s — generous, accommodates Mistral cold start + 30s audio upload

export type VoxtralSTTMimeType = 'audio/mp3' | 'audio/mpeg' | 'audio/wav' | 'audio/x-wav' | 'audio/m4a' | 'audio/mp4' | 'audio/flac' | 'audio/ogg' | 'audio/webm';

export interface VoxtralSTTOptions {
  audioBytes: Uint8Array;
  mimeType: VoxtralSTTMimeType | string;
  language?: string;       // 'it' default for ELAB Italian K-12
  diarize?: boolean;       // false default (teacher single speaker)
  contextBias?: string;    // defaults to ELAB_CONTEXT_BIAS
}

export interface VoxtralSTTSegment {
  speaker?: string;
  start: number;
  end: number;
  text: string;
}

export interface VoxtralSTTResult {
  text: string;
  language: string;
  model: string;
  provider: 'voxtral-transcribe-2';
  diarization?: VoxtralSTTSegment[];
  latencyMs: number;
}

/**
 * Map MIME type to file extension for FormData filename.
 * Mistral STT relies on extension hint when content-type is generic.
 */
function mimeToExt(mimeType: string): string {
  const lower = mimeType.toLowerCase();
  if (lower.includes('mp3') || lower.includes('mpeg')) return 'mp3';
  if (lower.includes('wav')) return 'wav';
  if (lower.includes('m4a') || lower.includes('mp4')) return 'm4a';
  if (lower.includes('flac')) return 'flac';
  if (lower.includes('ogg')) return 'ogg';
  if (lower.includes('webm')) return 'webm';
  return 'mp3'; // default fallback
}

/**
 * Transcribe audio via Mistral Voxtral Transcribe 2.
 *
 * Multipart/form-data POST with audio file + Italian context bias.
 * Throws GeminiError on non-200 HTTP (compatible with existing error chain
 * in cloudflare-client.ts + voxtral-client.ts sibling pattern).
 *
 * Caller (`unlim-stt/index.ts`) handles fallback to CF Whisper Turbo on
 * Voxtral failure (gradual safety migration per ADR-031 §3).
 */
export async function transcribeVoxtral(
  opts: VoxtralSTTOptions,
): Promise<VoxtralSTTResult> {
  const apiKey = (Deno.env.get('MISTRAL_API_KEY') || '').trim();
  if (!apiKey) {
    throw new GeminiError(ErrorCode.SERVICE_UNAVAILABLE, 'MISTRAL_API_KEY not configured');
  }

  const t0 = Date.now();
  const {
    audioBytes,
    mimeType,
    language = 'it',
    diarize = false,
    contextBias = ELAB_CONTEXT_BIAS,
  } = opts;

  if (!audioBytes || audioBytes.byteLength === 0) {
    throw new GeminiError(ErrorCode.API_ERROR, 'voxtral-stt: empty audioBytes');
  }
  // Mistral docs cap: 1GB per file. Reject early to avoid 413.
  if (audioBytes.byteLength > 1024 * 1024 * 1024) {
    throw new GeminiError(ErrorCode.API_ERROR, `voxtral-stt: audio too large ${audioBytes.byteLength} bytes (max 1GB)`);
  }

  // Build multipart form data per Mistral spec
  const formData = new FormData();
  formData.append('model', VOXTRAL_STT_MODEL);
  formData.append('language', language);
  if (contextBias) formData.append('context_bias', contextBias);
  if (diarize) formData.append('diarize', 'true');
  const ext = mimeToExt(mimeType);
  const audioBlob = new Blob([audioBytes], { type: mimeType });
  formData.append('file', audioBlob, `audio.${ext}`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), STT_TIMEOUT_MS);

  try {
    const res = await fetch(VOXTRAL_STT_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const errBody = await res.text().catch(() => 'no body');
      const code = res.status === 429
        ? ErrorCode.SERVICE_RATE_LIMITED
        : res.status >= 500
          ? ErrorCode.SERVICE_UNAVAILABLE
          : ErrorCode.API_ERROR;
      throw new GeminiError(code, `Voxtral STT ${res.status}: ${errBody.slice(0, 200)}`);
    }

    const data = await res.json() as {
      text?: string;
      language?: string;
      segments?: VoxtralSTTSegment[];
    };

    const text = (data.text ?? '').trim();
    if (!text) {
      throw new GeminiError(ErrorCode.EMPTY_RESPONSE, 'Voxtral STT empty transcription');
    }

    return {
      text,
      language: data.language ?? language,
      model: VOXTRAL_STT_MODEL,
      provider: 'voxtral-transcribe-2',
      diarization: diarize ? data.segments : undefined,
      latencyMs: Date.now() - t0,
    };
  } catch (e) {
    clearTimeout(timeout);
    if (e instanceof GeminiError) throw e;
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new GeminiError(ErrorCode.TIMEOUT, `Voxtral STT request timed out after ${STT_TIMEOUT_MS}ms`);
    }
    throw new GeminiError(ErrorCode.API_ERROR, `Voxtral STT failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

/**
 * Quick env-flag gate. Caller checks before invoking transcribeVoxtral.
 * Default: Voxtral disabled (CF Whisper primary preserved as safe canary).
 * Toggle via supabase secrets set STT_PROVIDER=voxtral.
 */
export function isVoxtralSTTEnabled(): boolean {
  return (Deno.env.get('STT_PROVIDER') || 'cf-whisper').toLowerCase() === 'voxtral';
}

/**
 * Get current Voxtral STT model identifier (for telemetry/logging).
 */
export function getVoxtralSTTModel(): string {
  return VOXTRAL_STT_MODEL;
}

export const VOXTRAL_STT_VERSION = '1.0-iter39-ralph-A5';
