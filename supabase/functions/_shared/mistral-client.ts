/**
 * Mistral AI client — Sprint T iter 24
 *
 * Provider: Mistral AI (FR, EU GDPR-friendly).
 * Models supported:
 *   - chat:    `mistral-small-latest` (primary) + `mistral-large-latest` (premium)
 *   - vision:  `pixtral-12b-2409` (Pixtral 12B)
 *   - embed:   `mistral-embed` (1024-dim)
 *
 * API base: https://api.mistral.ai/v1
 * Endpoints:
 *   POST /chat/completions  — chat + vision (OpenAI-compatible)
 *   POST /embeddings        — embeddings
 *
 * Auth: `Bearer ${MISTRAL_API_KEY}` (env).
 *
 * Iter 24 scope: implement `callMistralChat` (text+vision) + `callMistralEmbed`.
 * Wired into `llm-client.ts` callLLMWithFallback chain (defer iter 25 routing
 * decisions: chat 70% Small / 25% Large / 5% Together fallback).
 *
 * (c) Andrea Marro 2026-04-29 — ELAB Tutor
 */

import { GeminiError, ErrorCode } from './gemini.ts';
import type { GeminiModel, ImageData } from './types.ts';

const MISTRAL_BASE = 'https://api.mistral.ai/v1';
const TIMEOUT_MS = 15000;

export type MistralChatModel =
  | 'mistral-small-latest'
  | 'mistral-large-latest'
  | 'pixtral-12b-2409';

export interface MistralChatOptions {
  model?: MistralChatModel;
  systemPrompt: string;
  message: string;
  images?: ImageData[];          // Pixtral when present
  maxOutputTokens?: number;
  temperature?: number;
}

export interface MistralChatResult {
  text: string;
  model: string;
  provider: 'mistral';
  tokensUsed: { input: number; output: number };
  latencyMs: number;
}

/**
 * Pick default model:
 *   - images present → pixtral-12b-2409
 *   - else           → mistral-small-latest (cheap primary)
 * Caller can override via options.model.
 */
function pickDefaultModel(opts: MistralChatOptions): MistralChatModel {
  if (opts.model) return opts.model;
  if (opts.images && opts.images.length > 0) return 'pixtral-12b-2409';
  return 'mistral-small-latest';
}

/** Build OpenAI-compatible content array for vision (text + image_url). */
function buildVisionContent(text: string, images: ImageData[]): unknown[] {
  const out: unknown[] = [{ type: 'text', text }];
  for (const img of images) {
    // ImageData expects either dataUrl or base64+mime
    // deno-lint-ignore no-explicit-any
    const anyImg = img as any;
    const dataUrl = anyImg.dataUrl
      || (anyImg.base64 ? `data:${anyImg.mimeType || 'image/png'};base64,${anyImg.base64}` : null);
    if (dataUrl) out.push({ type: 'image_url', image_url: dataUrl });
  }
  return out;
}

/**
 * Call Mistral chat completions (text + optional vision via Pixtral).
 */
export async function callMistralChat(opts: MistralChatOptions): Promise<MistralChatResult> {
  const apiKey = (Deno.env.get('MISTRAL_API_KEY') || '').trim();
  if (!apiKey) {
    throw new GeminiError(ErrorCode.SERVICE_UNAVAILABLE, 'MISTRAL_API_KEY not configured');
  }
  const model = pickDefaultModel(opts);
  const hasImages = (opts.images?.length ?? 0) > 0;

  const userContent = hasImages
    ? buildVisionContent(opts.message, opts.images!)
    : opts.message;

  const body = {
    model,
    messages: [
      { role: 'system', content: opts.systemPrompt },
      { role: 'user', content: userContent },
    ],
    max_tokens: opts.maxOutputTokens ?? 256,
    temperature: opts.temperature ?? 0.7,
  };

  const start = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${MISTRAL_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const code = res.status === 429
        ? ErrorCode.SERVICE_RATE_LIMITED
        : res.status >= 500
          ? ErrorCode.SERVICE_UNAVAILABLE
          : ErrorCode.API_ERROR;
      throw new GeminiError(code, `Mistral ${res.status}: ${text.slice(0, 200)}`);
    }
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? '';
    if (!content) throw new GeminiError(ErrorCode.EMPTY_RESPONSE, 'Mistral empty response');

    return {
      text: content,
      model,
      provider: 'mistral',
      tokensUsed: {
        input: data?.usage?.prompt_tokens ?? 0,
        output: data?.usage?.completion_tokens ?? 0,
      },
      latencyMs: Date.now() - start,
    };
  } catch (e) {
    clearTimeout(timeout);
    if (e instanceof GeminiError) throw e;
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new GeminiError(ErrorCode.TIMEOUT, 'Mistral request timed out');
    }
    throw new GeminiError(ErrorCode.API_ERROR, `Mistral failed: ${e}`);
  }
}

/**
 * Embeddings via `mistral-embed` (1024-dim, EU).
 */
export async function callMistralEmbed(texts: string[]): Promise<number[][]> {
  const apiKey = (Deno.env.get('MISTRAL_API_KEY') || '').trim();
  if (!apiKey) {
    throw new GeminiError(ErrorCode.SERVICE_UNAVAILABLE, 'MISTRAL_API_KEY not configured');
  }
  if (!Array.isArray(texts) || texts.length === 0) return [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${MISTRAL_BASE}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: 'mistral-embed', input: texts }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new GeminiError(ErrorCode.API_ERROR, `Mistral embed ${res.status}: ${text.slice(0, 200)}`);
    }
    const data = await res.json();
    const items: Array<{ embedding: number[] }> = data?.data ?? [];
    return items.map((it) => it.embedding);
  } catch (e) {
    clearTimeout(timeout);
    if (e instanceof GeminiError) throw e;
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new GeminiError(ErrorCode.TIMEOUT, 'Mistral embed timed out');
    }
    throw new GeminiError(ErrorCode.API_ERROR, `Mistral embed failed: ${e}`);
  }
}

/** Tier mapper compatible with llm-client `callLLM` signature. */
export function mistralModelFromTier(_tier: GeminiModel, premium = false): MistralChatModel {
  return premium ? 'mistral-large-latest' : 'mistral-small-latest';
}

export const MISTRAL_CLIENT_VERSION = '1.0-iter24';
