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

/**
 * Mistral La Plateforme `response_format` parameter — JSON schema mode.
 *
 * When set, Mistral returns a JSON object that conforms to the supplied
 * schema. Used by Sprint T iter 38 Atom A7 to replace the legacy
 * `[INTENT:{...}]` regex parsing with structured outputs (eliminates
 * Tester-6 R7 v53 4-way schema drift: canonical 12.5%, 17/200 params_fail).
 *
 * Reference: https://docs.mistral.ai/capabilities/structured-output/json_schema/
 *
 * Type: 'json_schema' wraps a strict subset (Mistral validates server-side).
 */
export type MistralResponseFormat =
  | { type: 'json_schema'; json_schema: { name?: string; strict?: boolean; schema: Record<string, unknown> } }
  | { type: 'json_object' };

export interface MistralChatOptions {
  model?: MistralChatModel;
  systemPrompt: string;
  message: string;
  images?: ImageData[];          // Pixtral when present
  maxOutputTokens?: number;
  temperature?: number;
  /** Iter 38 A7: optional JSON schema constraint on the model output. */
  responseFormat?: MistralResponseFormat;
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

  // Build base body. response_format is optional and only emitted when the
  // caller explicitly opts in (iter 38 A7). When present, Mistral La Plateforme
  // returns a JSON object that matches the supplied schema; we still consume
  // it as `content` (string) and let the caller JSON.parse — this keeps the
  // contract identical to the regex-based legacy path for downstream code.
  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: 'system', content: opts.systemPrompt },
      { role: 'user', content: userContent },
    ],
    // Iter 36 P0 Mandate 1 E1: fallback 120→350 align con llm-client callTogether.
    // Caller fornisce maxOutputTokens via onniscenza-classifier per category.
    max_tokens: opts.maxOutputTokens ?? 350,
    temperature: opts.temperature ?? 0.7,
  };
  if (opts.responseFormat) {
    body.response_format = opts.responseFormat;
  }

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

/**
 * iter 39 A1 SSE — Mistral chat streaming (TTFB perceived <500ms).
 *
 * Mistral La Plateforme `chat/completions` supports `stream: true` per
 * https://docs.mistral.ai/api/#tag/chat. Server emits `data: {...}\n\n`
 * SSE chunks with `choices[0].delta.content` token-by-token, ending with
 * `data: [DONE]\n\n` sentinel.
 *
 * Returns a `ReadableStream<{token: string} | {done: true, model, latencyMs, tokensUsed}>`
 * that the caller can forward to client OR collect as fullText.
 *
 * Wall-clock total IDENTICAL to non-stream (Mistral generation invariata).
 * UX win: first token visible in browser ~200-500ms after pre-stream (RAG +
 * Onniscenza) completes, vs full-response 2200ms p50 wait current.
 *
 * `chunkBuffer` accumulates partial multi-byte UTF-8 sequences across reads.
 *
 * Iter 39 wire-up: `unlim-chat/index.ts` reads `body.stream === true`,
 * invokes `callMistralChatStream`, forwards chunks to client via
 * `text/event-stream` Response, then emits final metadata chunk with
 * PZ V3 score + parsed intents + clean_text post-stream.
 */
export interface MistralStreamChunk {
  token?: string;
  done?: boolean;
  model?: string;
  latencyMs?: number;
  tokensUsed?: { input: number; output: number };
  fullText?: string;
}

export async function callMistralChatStream(
  opts: MistralChatOptions,
): Promise<ReadableStream<MistralStreamChunk>> {
  const apiKey = (Deno.env.get('MISTRAL_API_KEY') || '').trim();
  if (!apiKey) {
    throw new GeminiError(ErrorCode.SERVICE_UNAVAILABLE, 'MISTRAL_API_KEY not configured');
  }
  const model = pickDefaultModel(opts);
  const hasImages = (opts.images?.length ?? 0) > 0;
  const userContent = hasImages
    ? buildVisionContent(opts.message, opts.images!)
    : opts.message;

  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: 'system', content: opts.systemPrompt },
      { role: 'user', content: userContent },
    ],
    // Iter 36 P0 Mandate 1 E1: fallback streaming 120→350 align consistency.
    max_tokens: opts.maxOutputTokens ?? 350,
    temperature: opts.temperature ?? 0.7,
    stream: true,
  };
  if (opts.responseFormat) {
    body.response_format = opts.responseFormat;
  }

  const start = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS * 2); // longer for stream

  let response: Response;
  try {
    response = await fetch(`${MISTRAL_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e) {
    clearTimeout(timeout);
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new GeminiError(ErrorCode.TIMEOUT, 'Mistral stream connect timed out');
    }
    throw new GeminiError(ErrorCode.API_ERROR, `Mistral stream connect failed: ${e}`);
  }

  if (!response.ok || !response.body) {
    clearTimeout(timeout);
    const text = await response.text().catch(() => '');
    const code = response.status === 429
      ? ErrorCode.SERVICE_RATE_LIMITED
      : response.status >= 500
        ? ErrorCode.SERVICE_UNAVAILABLE
        : ErrorCode.API_ERROR;
    throw new GeminiError(code, `Mistral stream ${response.status}: ${text.slice(0, 200)}`);
  }

  // Transform Mistral SSE bytes → MistralStreamChunk objects
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';
  let promptTokens = 0;
  let completionTokens = 0;

  return new ReadableStream<MistralStreamChunk>({
    async start(streamController) {
      const reader = response.body!.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // keep incomplete line for next read

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const token = parsed?.choices?.[0]?.delta?.content;
              if (typeof token === 'string' && token.length > 0) {
                fullText += token;
                streamController.enqueue({ token });
              }
              // Mistral emits usage in final chunk
              if (parsed?.usage) {
                promptTokens = parsed.usage.prompt_tokens ?? 0;
                completionTokens = parsed.usage.completion_tokens ?? 0;
              }
            } catch (_e) {
              // Skip malformed line — defensive
            }
          }
        }
        // Final chunk with metadata
        clearTimeout(timeout);
        streamController.enqueue({
          done: true,
          model,
          latencyMs: Date.now() - start,
          tokensUsed: { input: promptTokens, output: completionTokens },
          fullText,
        });
        streamController.close();
      } catch (e) {
        clearTimeout(timeout);
        streamController.error(e);
      }
    },
    cancel() {
      controller.abort();
      clearTimeout(timeout);
    },
  });
}

export const MISTRAL_CLIENT_VERSION = '1.1-iter39-sse';
