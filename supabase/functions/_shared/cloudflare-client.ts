/**
 * Cloudflare Workers AI client — Sprint T iter 24
 *
 * Provider: Cloudflare Workers AI (free tier 10k req/day shared).
 * Models supported:
 *   - imageGen: `@cf/black-forest-labs/flux-1-schnell` (FLUX schnell)
 *   - stt:      `@cf/openai/whisper-large-v3-turbo`
 *   - embed:    `@cf/baai/bge-m3` (1024-dim)
 *
 * API: POST https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${MODEL}
 * Auth: `Bearer ${CLOUDFLARE_API_TOKEN}` (env).
 * Account ID hardcoded fallback: 31b0f72ef02445f6a9987c994fe17b56 (override
 * via env CLOUDFLARE_ACCOUNT_OR_ZONE_ID per CLAUDE.md infra).
 *
 * Iter 24 scope: implement `cfImageGen`, `cfWhisperSTT`, `cfBgeM3Embed`.
 * Wired into `multimodalRouter.routeImageGen` (replaces stub).
 *
 * (c) Andrea Marro 2026-04-29 — ELAB Tutor
 */

import { GeminiError, ErrorCode } from './gemini.ts';

const CF_DEFAULT_ACCOUNT = '31b0f72ef02445f6a9987c994fe17b56';
const TIMEOUT_MS = 30_000; // imageGen can be slow

function cfBaseUrl(): string {
  const acct = (Deno.env.get('CLOUDFLARE_ACCOUNT_OR_ZONE_ID') || CF_DEFAULT_ACCOUNT).trim();
  return `https://api.cloudflare.com/client/v4/accounts/${acct}/ai/run`;
}

function cfHeaders(): Record<string, string> {
  const token = (Deno.env.get('CLOUDFLARE_API_TOKEN') || '').trim();
  if (!token) throw new GeminiError(ErrorCode.SERVICE_UNAVAILABLE, 'CLOUDFLARE_API_TOKEN not configured');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function cfFetch(model: string, body: unknown): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${cfBaseUrl()}/${model}`, {
      method: 'POST',
      headers: cfHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res;
  } catch (e) {
    clearTimeout(timeout);
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new GeminiError(ErrorCode.TIMEOUT, `Cloudflare ${model} timed out`);
    }
    throw e;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Image generation — FLUX schnell
// ────────────────────────────────────────────────────────────────────────────

export interface CfImageGenOptions {
  prompt: string;
  numSteps?: number;        // default 4 (schnell), max 8
  width?: number;           // default 1024
  height?: number;          // default 1024
}

export interface CfImageGenResult {
  imageBase64: string;      // PNG base64 (no data:URL prefix)
  model: string;
  provider: 'cloudflare';
  latencyMs: number;
}

export async function cfImageGen(opts: CfImageGenOptions): Promise<CfImageGenResult> {
  const start = Date.now();
  const body = {
    prompt: opts.prompt,
    num_steps: opts.numSteps ?? 4,
    width: opts.width ?? 1024,
    height: opts.height ?? 1024,
  };
  const res = await cfFetch('@cf/black-forest-labs/flux-1-schnell', body);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new GeminiError(ErrorCode.API_ERROR, `CF FLUX ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  // CF returns { result: { image: '<base64>' }, success: true, errors, messages }
  const imageBase64: string = data?.result?.image ?? '';
  if (!imageBase64) {
    throw new GeminiError(ErrorCode.EMPTY_RESPONSE, 'CF FLUX empty image');
  }
  return {
    imageBase64,
    model: '@cf/black-forest-labs/flux-1-schnell',
    provider: 'cloudflare',
    latencyMs: Date.now() - start,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// STT — Whisper Turbo
// ────────────────────────────────────────────────────────────────────────────

export interface CfWhisperOptions {
  /** Audio bytes (raw, base64, or Uint8Array). CF expects raw byte array. */
  audio: Uint8Array | number[];
  language?: string; // e.g. 'it', 'en'
}

export interface CfWhisperResult {
  text: string;
  model: string;
  provider: 'cloudflare';
  latencyMs: number;
  meta?: Record<string, unknown>;
}

export async function cfWhisperSTT(opts: CfWhisperOptions): Promise<CfWhisperResult> {
  const start = Date.now();
  // Iter 30 fix: Whisper Turbo expects raw octet-stream bytes, NOT JSON array.
  // Previous JSON {audio: [bytes]} path returned "Type mismatch '/audio',
  // 'string' not in 'array','binary'" because CF newer Whisper variant
  // deprecated JSON-wrapped array path in favor of raw binary upload.
  const audioBytes = opts.audio instanceof Uint8Array
    ? opts.audio
    : new Uint8Array(opts.audio as number[]);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const url = `${cfBaseUrl()}/@cf/openai/whisper-large-v3-turbo`;
  const token = (Deno.env.get('CLOUDFLARE_API_TOKEN') || '').trim();
  if (!token) throw new GeminiError(ErrorCode.SERVICE_UNAVAILABLE, 'CLOUDFLARE_API_TOKEN not configured');

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/octet-stream',
      },
      body: audioBytes,
      signal: controller.signal,
    });
    clearTimeout(timeout);
  } catch (e) {
    clearTimeout(timeout);
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new GeminiError(ErrorCode.TIMEOUT, `Cloudflare Whisper timed out`);
    }
    throw e;
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new GeminiError(ErrorCode.API_ERROR, `CF Whisper ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  const text: string = data?.result?.text ?? '';
  if (!text) throw new GeminiError(ErrorCode.EMPTY_RESPONSE, 'CF Whisper empty text');
  return {
    text,
    model: '@cf/openai/whisper-large-v3-turbo',
    provider: 'cloudflare',
    latencyMs: Date.now() - start,
    meta: data?.result || {},
  };
}

// ────────────────────────────────────────────────────────────────────────────
// TTS — MeloTTS (MyShell, Italian native, female voice, 200-500 ms latency)
// Iter 31 P0 PIVOT: Voxtral cross-lingual EN→IT troppo lento + accent inglese.
// MeloTTS @cf/myshell-ai/melotts native Italian, female natural tone, free tier.
// ────────────────────────────────────────────────────────────────────────────

export interface CfMeloTtsOptions {
  text: string;
  lang?: string; // 'IT' | 'EN_NEWEST' | 'EN' | 'ES' | 'FR' | 'JP' | 'KR' | 'ZH'
  speaker?: string; // language-specific speaker id
}

export interface CfMeloTtsResult {
  audioBase64: string;     // MP3 base64 no prefix
  audio: Uint8Array;       // decoded bytes
  contentType: string;     // 'audio/mpeg'
  model: string;
  provider: 'cloudflare';
  latencyMs: number;
}

/**
 * Synthesize Italian audio via Cloudflare MeloTTS (native IT speaker, NOT cross-lingual).
 * Returns binary audio Uint8Array + base64. Never throws — error surfaced via reject.
 */
export async function cfMeloTtsSynthesize(opts: CfMeloTtsOptions): Promise<CfMeloTtsResult> {
  const start = Date.now();
  const body = {
    prompt: opts.text,
    lang: opts.lang || 'IT',
  };
  const res = await cfFetch('@cf/myshell-ai/melotts', body);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new GeminiError(ErrorCode.API_ERROR, `CF MeloTTS ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  // CF returns { result: { audio: '<base64>' }, success: true }
  const audioBase64: string = data?.result?.audio ?? '';
  if (!audioBase64) {
    throw new GeminiError(ErrorCode.EMPTY_RESPONSE, 'CF MeloTTS empty audio');
  }
  // Decode base64 → Uint8Array
  const binary = atob(audioBase64);
  const audio = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) audio[i] = binary.charCodeAt(i);
  return {
    audioBase64,
    audio,
    contentType: 'audio/mpeg',
    model: '@cf/myshell-ai/melotts',
    provider: 'cloudflare',
    latencyMs: Date.now() - start,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Embeddings — BGE-M3 (1024-dim, multilingual)
// ────────────────────────────────────────────────────────────────────────────

export async function cfBgeM3Embed(texts: string[]): Promise<number[][]> {
  if (!Array.isArray(texts) || texts.length === 0) return [];
  const res = await cfFetch('@cf/baai/bge-m3', { text: texts });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new GeminiError(ErrorCode.API_ERROR, `CF BGE-M3 ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  const arr: number[][] = data?.result?.data ?? [];
  return arr;
}

export const CLOUDFLARE_CLIENT_VERSION = '1.0-iter24';
