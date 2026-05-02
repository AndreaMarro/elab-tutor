/**
 * Nanobot V2 — Unified LLM Client
 * Single entry point for all LLM calls. Routes between Together AI and Gemini
 * based on LLM_PROVIDER env var. Gemini is always used for vision (images).
 * Auto-fallback: Together failure → Gemini → Brain.
 * (c) Andrea Marro — 20/04/2026
 */

import type { GeminiModel, ImageData } from './types.ts';
import { callGemini, callBrainFallback, GeminiError, ErrorCode } from './gemini.ts';
import {
  canUseTogether,
  anonymizePayload,
  logTogetherCall,
  isTogetherFallbackEnabled,
  type TogetherContext,
  type SupabaseClientLike,
} from './together-fallback.ts';
import { callMistralChat, type MistralChatModel, type MistralResponseFormat } from './mistral-client.ts';
export type { MistralResponseFormat };

// Re-export for consumers that need error handling
export { GeminiError, ErrorCode, callBrainFallback };
// Re-export getMetrics so health endpoints still work
export { getMetrics } from './gemini.ts';
// Re-export gate helpers for callers that want the same predicate
export { canUseTogether, anonymizePayload, isTogetherFallbackEnabled };
export type { TogetherContext };

const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';
const TOGETHER_TIMEOUT_MS = 15000;

/**
 * LLMOptions — identical to GeminiOptions so callers don't change signature.
 *
 * Iter 38 A7: optional `responseFormat` (JSON schema) for Mistral structured
 * output. When set, only Mistral honors it; Gemini/Together/RunPod ignore
 * (defensive fall-through preserves backward compatibility).
 */
export interface LLMOptions {
  model: GeminiModel;
  systemPrompt: string;
  message: string;
  images?: ImageData[];
  maxOutputTokens?: number;
  temperature?: number;
  thinkingLevel?: 'minimal' | 'low' | 'medium' | 'high'; // Ignored by Together
  /** Iter 38 A7: JSON schema constraint forwarded only to Mistral. */
  responseFormat?: MistralResponseFormat;
}

/**
 * LLMResult — same shape as GeminiResult for zero-change downstream.
 */
export interface LLMResult {
  text: string;
  model: string;
  provider: string; // 'together' | 'gemini' | 'brain' — for GDPR dataProcessing
  tokensUsed: { input: number; output: number };
  latencyMs: number;
}

/**
 * Map any Gemini tier to the Together model.
 * All tiers use the same model — Together has no tier distinction.
 */
function togetherModelFromTier(_tier: GeminiModel): string {
  return 'meta-llama/Llama-3.3-70B-Instruct-Turbo';
}

/**
 * Call Together AI (OpenAI-compatible API).
 * Retry 1x on 429 with 2s delay. Timeout 15s.
 */
async function callTogether(options: LLMOptions): Promise<LLMResult> {
  const apiKey = Deno.env.get('TOGETHER_API_KEY');
  if (!apiKey) {
    throw new GeminiError(ErrorCode.SERVICE_UNAVAILABLE, 'TOGETHER_API_KEY not configured');
  }

  const {
    model,
    systemPrompt,
    message,
    // Iter 31 P0 latency fix: cap output ~120 token (≈90 parole, fits ≤60 mandate
    // PZ V3 + 50% safety) — was 256 = 192 parole = oltre limite + lento. Riduce
    // output time ~40% (LLM gen ~50 token/s, 256→120 = 5s→2.4s).
    maxOutputTokens = 120,
    temperature = 0.7,
  } = options;

  const togetherModel = togetherModelFromTier(model);

  const requestBody = {
    model: togetherModel,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
    max_tokens: maxOutputTokens,
    temperature,
  };

  const startTime = Date.now();

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TOGETHER_TIMEOUT_MS);

      const response = await fetch(TOGETHER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const latency = Date.now() - startTime;

        if (response.status === 429 && attempt === 0) {
          console.warn(JSON.stringify({
            level: 'warn', event: 'together_rate_limited',
            model: togetherModel, attempt, latencyMs: latency,
          }));
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }

        const errorBody = await response.text().catch(() => '');
        console.error(JSON.stringify({
          level: 'error', event: 'together_api_error',
          model: togetherModel, status: response.status, attempt, latencyMs: latency,
          details: errorBody.slice(0, 200),
        }));

        if (response.status === 429) {
          throw new GeminiError(ErrorCode.SERVICE_RATE_LIMITED, 'Rate limited by Together');
        }
        if (response.status >= 500) {
          throw new GeminiError(ErrorCode.SERVICE_UNAVAILABLE, `Together ${response.status}`);
        }
        throw new GeminiError(ErrorCode.API_ERROR, `Together API error ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        const latency = Date.now() - startTime;
        throw new GeminiError(ErrorCode.EMPTY_RESPONSE, 'Empty response from Together');
      }

      const usage = data.usage || {};
      const latency = Date.now() - startTime;

      console.info(JSON.stringify({
        level: 'info', event: 'together_call',
        model: togetherModel,
        tokensIn: usage.prompt_tokens || 0,
        tokensOut: usage.completion_tokens || 0,
        latencyMs: latency,
      }));

      return {
        text: content,
        model: model, // Return the tier label (same as Gemini behavior)
        provider: 'together',
        tokensUsed: {
          input: usage.prompt_tokens || 0,
          output: usage.completion_tokens || 0,
        },
        latencyMs: latency,
      };
    } catch (err) {
      if (err instanceof GeminiError) throw err;
      if (attempt === 1) {
        const latency = Date.now() - startTime;
        if (err instanceof DOMException && err.name === 'AbortError') {
          throw new GeminiError(ErrorCode.TIMEOUT, 'Together request timed out');
        }
        throw new GeminiError(ErrorCode.API_ERROR, `Together call failed: ${err}`);
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  throw new GeminiError(ErrorCode.SERVICE_UNAVAILABLE, 'Together: all retries exhausted');
}

/**
 * Unified LLM dispatcher.
 * Routes to Together or Gemini based on LLM_PROVIDER env var.
 * Vision requests (images) ALWAYS go to Gemini (Llama has no vision).
 * On Together failure, auto-fallback to Gemini.
 */
export async function callLLM(options: LLMOptions): Promise<LLMResult> {
  const provider = (Deno.env.get('LLM_PROVIDER') || 'together').trim().toLowerCase();
  const hasImages = (options.images?.length ?? 0) > 0;

  // Vision: ALWAYS Gemini (Mistral Pixtral fallback iter 25+)
  if (hasImages) {
    const r = await callGemini(options);
    return {
      text: r.text,
      model: r.model,
      provider: r.model === 'galileo-brain-v13' ? 'brain' : 'gemini',
      tokensUsed: { input: r.tokensUsed?.input ?? 0, output: r.tokensUsed?.output ?? 0 },
      latencyMs: r.latencyMs,
    };
  }

  // Iter 24 + 35 NEW: weighted routing for text-only chat
  // iter 35 default 50/15/15/20 (Gemini Flash-Lite primary fast EU; Andrea: "Mistral lento")
  // Active when LLM_ROUTING_WEIGHTS env set (default if ROUTING_MODE=weighted).
  const routingMode = (Deno.env.get('ROUTING_MODE') || 'weighted').toLowerCase();
  if (routingMode === 'weighted') {
    const pick = pickWeightedProvider();
    if (pick === 'gemini-flash-lite') {
      try {
        const r = await callGemini({ ...options, model: 'gemini-2.5-flash-lite' });
        return {
          text: r.text,
          model: r.model,
          provider: r.model === 'galileo-brain-v13' ? 'brain' : 'gemini',
          tokensUsed: { input: r.tokensUsed?.input ?? 0, output: r.tokensUsed?.output ?? 0 },
          latencyMs: r.latencyMs,
        };
      } catch (e) {
        console.info(JSON.stringify({ level: 'info', event: 'weighted_gemini_flash_lite_down', error: e instanceof Error ? e.message : String(e) }));
      }
    } else if (pick === 'mistral-small') {
      try { return await callMistral(options, 'mistral-small-latest'); }
      catch (e) { console.info(JSON.stringify({ level: 'info', event: 'weighted_mistral_small_down', error: e instanceof Error ? e.message : String(e) })); }
    } else if (pick === 'mistral-large') {
      try { return await callMistral(options, 'mistral-large-latest'); }
      catch (e) { console.info(JSON.stringify({ level: 'info', event: 'weighted_mistral_large_down', error: e instanceof Error ? e.message : String(e) })); }
    }
    // For 'together' pick OR provider failure, fall through to legacy chain below
  }

  // Reviewer issue #5 (Day 01): explicit LLMResult mapping for strict TS safety.
  // callGemini returns a GeminiResult-shaped object; we coerce to LLMResult by
  // mapping each field explicitly (text, model, tokensUsed, latencyMs) and
  // overriding provider. This avoids relying on ...spread duck-typing which
  // would silently break if GeminiResult gains incompatible fields.
  const withGeminiProvider = (result: LLMResult): LLMResult => {
    const provider: string = result.model === 'galileo-brain-v13' ? 'brain' : 'gemini';
    const mapped: LLMResult = {
      text: result.text,
      model: result.model,
      provider,
      tokensUsed: {
        input: result.tokensUsed?.input ?? 0,
        output: result.tokensUsed?.output ?? 0,
      },
      latencyMs: result.latencyMs,
    };
    return mapped;
  };

  // Gemini provider: direct call, no Together involved
  if (provider === 'gemini') {
    return withGeminiProvider(await callGemini(options));
  }

  // Together provider (default): call Together, fallback to Gemini on failure
  try {
    return await callTogether(options);
  } catch (togetherError) {
    console.warn(JSON.stringify({
      level: 'warn', event: 'together_fallback_to_gemini',
      error: togetherError instanceof Error ? togetherError.message : 'unknown',
      timestamp: new Date().toISOString(),
    }));
    // Auto-fallback to Gemini
    return withGeminiProvider(await callGemini(options));
  }
}

// ════════════════════════════════════════════════════════════════════
// Sprint S iter 3 — Gated fallback chain (RunPod → Gemini EU → Together)
// ════════════════════════════════════════════════════════════════════

/**
 * RunPod / Hetzner EU GPU stub — Sprint S iter 4+ wires the real call.
 * For now we just emit "not configured" if no env URL is set so the chain
 * gracefully proceeds to Gemini.
 */
async function callRunPod(options: LLMOptions): Promise<LLMResult> {
  const url = (Deno.env.get('VPS_GPU_URL') || '').trim();
  if (!url) {
    throw new GeminiError(ErrorCode.SERVICE_UNAVAILABLE, 'VPS_GPU_URL not configured');
  }
  const apiKey = (Deno.env.get('ELAB_GPU_API_KEY') || '').trim();
  const start = Date.now();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${url}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'X-Elab-Api-Key': apiKey } : {}),
      },
      body: JSON.stringify({
        model: 'qwen2.5vl:7b',
        messages: [
          { role: 'system', content: options.systemPrompt },
          { role: 'user', content: options.message },
        ],
        max_tokens: options.maxOutputTokens ?? 120,
        temperature: options.temperature ?? 0.7,
        stream: false,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new GeminiError(ErrorCode.SERVICE_UNAVAILABLE, `RunPod ${res.status}`);
    }
    const data = await res.json();
    const text: string = data?.choices?.[0]?.message?.content ?? '';
    if (!text) throw new GeminiError(ErrorCode.EMPTY_RESPONSE, 'RunPod empty response');
    return {
      text,
      model: options.model,
      provider: 'runpod',
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
      throw new GeminiError(ErrorCode.TIMEOUT, 'RunPod request timed out');
    }
    throw new GeminiError(ErrorCode.API_ERROR, `RunPod failed: ${e}`);
  }
}

/**
 * Mistral EU adapter — Sprint T iter 24.
 *
 * Picks `mistral-small-latest` by default (cheap primary).
 * Premium tier (`mistral-large-latest`) selectable via env
 * `MISTRAL_PREMIUM_TIERS=large` per request tier (caller maps).
 *
 * Returns the same LLMResult shape as the rest of the chain.
 */
async function callMistral(options: LLMOptions, forceModel?: MistralChatModel): Promise<LLMResult> {
  let model: MistralChatModel;
  if (forceModel) {
    model = forceModel;
  } else {
    const premiumTiers = (Deno.env.get('MISTRAL_PREMIUM_TIERS') || '').split(',').map((s) => s.trim()).filter(Boolean);
    const wantsPremium = premiumTiers.includes(String(options.model));
    model = wantsPremium ? 'mistral-large-latest' : 'mistral-small-latest';

    // Iter 41 Phase A Task A1 — narrow Large triggers: downgrade Large→Small for
    // short simple non-multi-step prompts. Saves 2-3s avg latency on non-complex.
    // Gate: MISTRAL_NARROW_LARGE_ENABLED=true (canary off by default for safety).
    if (model === 'mistral-large-latest' &&
        (Deno.env.get('MISTRAL_NARROW_LARGE_ENABLED') || 'false').toLowerCase() === 'true') {
      const narrowed = selectMistralModel({ message: options.message });
      if (narrowed.model === 'mistral-small-latest') {
        console.info(JSON.stringify({
          level: 'info', event: 'mistral_routing_downgrade_large_to_small',
          original_model: 'mistral-large-latest',
          narrowed_model: 'mistral-small-latest',
          routing_reason: narrowed.routing_reason,
          word_count: options.message.split(/\s+/).filter(Boolean).length,
          timestamp: new Date().toISOString(),
        }));
        model = 'mistral-small-latest';
      }
    }
  }

  const r = await callMistralChat({
    model,
    systemPrompt: options.systemPrompt,
    message: options.message,
    images: options.images,
    maxOutputTokens: options.maxOutputTokens,
    temperature: options.temperature,
    // Iter 38 A7: forward responseFormat (json_schema) only to Mistral.
    // Other providers' branches do not read this field; defensive ignore.
    responseFormat: options.responseFormat,
  });
  return {
    text: r.text,
    model: model,
    provider: 'mistral',
    tokensUsed: r.tokensUsed,
    latencyMs: r.latencyMs,
  };
}

/**
 * Weighted random provider picker iter 35+ (Andrea: "Mistral lento vs Gemini/DeepSeek/Nanobot era veloce"):
 * Default iter 35 (LLM_ROUTING_WEIGHTS env): 50,15,15,20 = Gemini Flash-Lite primary fast EU
 * - 50% Gemini Flash-Lite (primary fast EU, p50 ~1.5s)
 * - 15% Mistral Small (cheap fallback)
 * - 15% Mistral Large (premium complex)
 * - 20% Together Llama 70B Turbo (high quality, gated)
 * Backward compatible: 3-value weight strings (Mistral Small / Large / Together)
 * still parse and gemini weight = 0 (legacy iter 24 behavior).
 * Returns null if env override (ROUTING_MODE=legacy) or weighted-mode disabled.
 */
function pickWeightedProvider(): 'gemini-flash-lite' | 'mistral-small' | 'mistral-large' | 'together' | null {
  if ((Deno.env.get('ROUTING_MODE') || '').toLowerCase() === 'legacy') return null;
  // iter 35: weighted routing solo se LLM_ROUTING_WEIGHTS è impostato esplicitamente
  // (backward compat con test integrazione che usano LLM_PROVIDER=together puro).
  const weightsEnv = (Deno.env.get('LLM_ROUTING_WEIGHTS') || '').trim();
  if (!weightsEnv) return null;
  const raw = weightsEnv.split(',').map((n) => parseInt(n.trim(), 10) || 0);
  // 4-value: gemini, small, large, together — 3-value: small, large, together (legacy)
  let wGemini = 0, wSmall = 0, wLarge = 0, wTogether = 0;
  if (raw.length >= 4) {
    [wGemini, wSmall, wLarge, wTogether] = [raw[0] ?? 0, raw[1] ?? 0, raw[2] ?? 0, raw[3] ?? 0];
  } else {
    [wSmall, wLarge, wTogether] = [raw[0] ?? 65, raw[1] ?? 20, raw[2] ?? 15];
  }
  const total = wGemini + wSmall + wLarge + wTogether;
  if (total <= 0) return null;
  const r = Math.random() * total;
  if (r < wGemini) return 'gemini-flash-lite';
  if (r < wGemini + wSmall) return 'mistral-small';
  if (r < wGemini + wSmall + wLarge) return 'mistral-large';
  return 'together';
}

/**
 * Sprint S iter 3 fallback chain (extended Sprint T iter 24):
 *
 *   RunPod / Hetzner EU GPU
 *     ↓ (down or not configured)
 *   Mistral EU (FR)  ← NEW iter 24, gated by MISTRAL_API_KEY presence
 *     ↓ (down)
 *   Gemini EU
 *     ↓ (down)
 *   Together AI  ← only if `canUseTogether(ctx)` AND env flag enabled
 *
 * If the chain reaches Together AI:
 *   - payload is anonymized via `anonymizePayload()` (caller must mark
 *     ctx.anonymized=true; gate enforces it for batch/emergency)
 *   - one row is appended to `together_audit_log` per call
 *
 * For student runtime the gate ALWAYS returns false → Together step is
 * skipped and the original Gemini error is rethrown so the caller can
 * surface the offline message to the LIM.
 */
/**
 * Iter 41 Phase A Task A4 — Hedged Mistral 100ms stagger.
 *
 * Goal: -600-1100ms p95 latency lift (Tier 1 research iter 38). Two parallel
 * Mistral calls, hedged starts after staggerMs delay; first-respondent wins.
 * Cost +30% (~+$0.0003/request) — Andrea ratify gate ADR-038 + env
 * `ENABLE_HEDGED_LLM=true` default false safe.
 *
 * Returns: same shape as underlying primary/hedged callable. Throws if both fail.
 *
 * Race semantics:
 *   - Primary fires immediately
 *   - Hedged scheduled via setTimeout(staggerMs)
 *   - Promise.allSettled gathers both → first fulfilled wins
 *   - If primary settles before stagger fires, hedged Promise still pending
 *     (lazy: hedged callable invoked only after stagger timeout)
 */
export async function callMistralChatHedged<T>(opts: {
  primary: () => Promise<T>;
  hedged: () => Promise<T>;
  staggerMs?: number;
}): Promise<T> {
  const stagger = opts.staggerMs ?? 100;
  const primaryPromise = opts.primary();

  // Hedged starts after staggerMs delay
  const hedgedPromise = new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      opts.hedged().then(resolve, reject);
    }, stagger);
  });

  // First-success-wins semantics:
  // - Wrap each promise to track its outcome individually.
  // - If either fulfills → return immediately (don't wait for the other).
  // - If both reject → throw aggregated error.
  return new Promise<T>((resolve, reject) => {
    let pending = 2;
    const errors: unknown[] = [];
    let resolved = false;

    const handle = (p: Promise<T>) => {
      p.then(
        (value) => {
          if (!resolved) {
            resolved = true;
            resolve(value);
          }
        },
        (err) => {
          errors.push(err);
          pending--;
          if (pending === 0 && !resolved) {
            const msg = errors
              .map((e) => (e instanceof Error ? e.message : String(e)))
              .join(' | ');
            reject(new Error(`Both primary + hedged failed: ${msg}`));
          }
        },
      );
    };

    handle(primaryPromise);
    handle(hedgedPromise);
  });
}

/**
 * Iter 41 Phase A Task A1 — narrow Large triggers heuristic.
 *
 * Goal: Mistral Large fires only on multi-step + complex diagnostic prompts.
 * Short simple prompts (<50 words) route to Small. Saves 2-3s avg latency on
 * non-complex prompts (Large 5.4s observed v74 → Small 2-3s).
 *
 * Auto-detection from message content:
 *   - hasMultiStep: /passo per passo|step by step|prima.*poi.*infine|\d+\s*step/i
 *   - hasComplexDiagnostic: /diagnostica.*errori|verifica.*passo|controlla.*sequenza/i
 *
 * Override hooks for explicit caller control (e.g. SystemSmokeTest).
 *
 * Returns { model, routing_reason } where routing_reason is telemetry-friendly string.
 */
export function selectMistralModel(input: {
  message: string;
  hasMultiStep?: boolean;
  hasComplexDiagnostic?: boolean;
}): { model: 'mistral-small-latest' | 'mistral-large-latest'; routing_reason: string } {
  const msg = input.message ?? '';
  const wordCount = msg.split(/\s+/).filter(Boolean).length;
  const multiStep = input.hasMultiStep ?? /passo per passo|step by step|prima.*poi.*infine|\d+\s*step/i.test(msg);
  const complexDiag = input.hasComplexDiagnostic ?? /diagnostica.*errori|verifica.*passo|controlla.*sequenza/i.test(msg);

  if (multiStep && complexDiag) {
    return { model: 'mistral-large-latest', routing_reason: 'multi-step+diagnostic' };
  }
  if (wordCount > 50) {
    return { model: 'mistral-large-latest', routing_reason: 'long-prompt-50w+' };
  }
  return { model: 'mistral-small-latest', routing_reason: 'short-simple-default' };
}

export async function callLLMWithFallback(
  options: LLMOptions,
  context: TogetherContext,
  supabase?: SupabaseClientLike | null,
): Promise<LLMResult> {
  const providersDown: string[] = [];
  const reqId = context.request_id ?? cryptoRandomId();

  // Iter 24 + 35 NEW: weighted routing 50/15/15/20 (iter 35 Gemini Flash-Lite primary fast EU)
  // Andrea iter 34: "Mistral lento vs Gemini/DeepSeek/Nanobot era veloce"
  const pick = pickWeightedProvider();
  if (pick === 'gemini-flash-lite') {
    try {
      const r = await callGemini({ ...options, modelOverride: 'gemini-2.5-flash-lite' });
      return {
        text: r.text,
        model: r.model,
        provider: r.model === 'galileo-brain-v13' ? 'brain' : 'gemini',
        tokensUsed: { input: r.tokensUsed?.input ?? 0, output: r.tokensUsed?.output ?? 0 },
        latencyMs: r.latencyMs,
      };
    } catch (e) {
      providersDown.push('gemini-flash-lite-weighted');
      console.info(JSON.stringify({ level: 'info', event: 'gemini_flash_lite_weighted_down', request_id: reqId, error: e instanceof Error ? e.message : String(e) }));
    }
  } else if (pick === 'mistral-small') {
    try {
      return await callMistral(options, 'mistral-small-latest');
    } catch (e) {
      providersDown.push('mistral-small-weighted');
      console.info(JSON.stringify({ level: 'info', event: 'mistral_small_weighted_down', request_id: reqId, error: e instanceof Error ? e.message : String(e) }));
    }
  } else if (pick === 'mistral-large') {
    try {
      return await callMistral(options, 'mistral-large-latest');
    } catch (e) {
      providersDown.push('mistral-large-weighted');
      console.info(JSON.stringify({ level: 'info', event: 'mistral_large_weighted_down', request_id: reqId, error: e instanceof Error ? e.message : String(e) }));
    }
  } else if (pick === 'together') {
    // Try Together first (still gated by env + canUseTogether check)
    if (isTogetherFallbackEnabled() && canUseTogether(context)) {
      const safeMessages = anonymizePayload([
        { role: 'system', content: options.systemPrompt },
        { role: 'user', content: options.message },
      ]);
      const safeOptions: LLMOptions = {
        ...options,
        systemPrompt: safeMessages[0]?.content ?? options.systemPrompt,
        message: safeMessages[1]?.content ?? options.message,
      };
      try {
        const r = await callTogether(safeOptions);
        await logTogetherCall(supabase, {
          request_kind: 'weighted_primary',
          anonymized_payload: { messages: safeMessages, model: r.model },
          user_role: context.runtime,
          consent_id: context.consent_id,
          latency_ms: r.latencyMs ?? 0,
          status: 'ok',
        });
        return r;
      } catch (e) {
        providersDown.push('together-weighted');
        console.info(JSON.stringify({ level: 'info', event: 'together_weighted_down', request_id: reqId, error: e instanceof Error ? e.message : String(e) }));
      }
    } else {
      providersDown.push('together-gated');
    }
  }

  // 1. RunPod EU (legacy fallback chain start)
  try {
    return await callRunPod(options);
  } catch (e) {
    providersDown.push('runpod');
    console.info(JSON.stringify({
      level: 'info', event: 'runpod_down', request_id: reqId,
      error: e instanceof Error ? e.message : String(e),
    }));
  }

  // 1.5. Mistral EU fallback (default Small if weighted pick wasn't Mistral)
  try {
    return await callMistral(options);
  } catch (e) {
    providersDown.push('mistral');
    console.info(JSON.stringify({
      level: 'info', event: 'mistral_down', request_id: reqId,
      error: e instanceof Error ? e.message : String(e),
    }));
  }

  // 2. Gemini EU (existing)
  let lastError: unknown = null;
  try {
    const r = await callGemini(options);
    return {
      text: r.text,
      model: r.model,
      provider: r.model === 'galileo-brain-v13' ? 'brain' : 'gemini',
      tokensUsed: { input: r.tokensUsed?.input ?? 0, output: r.tokensUsed?.output ?? 0 },
      latencyMs: r.latencyMs,
    };
  } catch (e) {
    providersDown.push('gemini');
    lastError = e;
    console.warn(JSON.stringify({
      level: 'warn', event: 'gemini_down', request_id: reqId,
      error: e instanceof Error ? e.message : String(e),
    }));
  }

  // 3. Together AI gated
  const envEnabled = isTogetherFallbackEnabled();
  const gateOk = canUseTogether(context);
  const eligible = envEnabled && gateOk && providersDown.length >= 2;

  if (!eligible) {
    // Audit the BLOCKED decision so we can prove gate enforcement
    await logTogetherCall(supabase, {
      request_kind: 'fallback',
      anonymized_payload: null,
      user_role: context.runtime,
      consent_id: context.consent_id,
      latency_ms: 0,
      status: !envEnabled ? 'blocked_env_disabled' :
              !gateOk ? `blocked_gate_${context.runtime}` :
              'blocked_only_one_provider_down',
    });
    throw lastError instanceof Error
      ? lastError
      : new GeminiError(ErrorCode.SERVICE_UNAVAILABLE, `chain failed: ${providersDown.join(',')}`);
  }

  // Anonymize before US transit
  const safeMessages = anonymizePayload([
    { role: 'system', content: options.systemPrompt },
    { role: 'user', content: options.message },
  ]);
  const safeOptions: LLMOptions = {
    ...options,
    systemPrompt: safeMessages[0]?.content ?? options.systemPrompt,
    message: safeMessages[1]?.content ?? options.message,
  };

  const start = Date.now();
  try {
    const r = await callTogether(safeOptions);
    await logTogetherCall(supabase, {
      request_kind: 'fallback',
      anonymized_payload: { messages: safeMessages, model: r.model },
      user_role: context.runtime,
      consent_id: context.consent_id,
      latency_ms: r.latencyMs ?? (Date.now() - start),
      status: 'ok',
    });
    return r;
  } catch (e) {
    const latency = Date.now() - start;
    const status = e instanceof GeminiError ? `error_${e.code}` : 'error';
    await logTogetherCall(supabase, {
      request_kind: 'fallback',
      anonymized_payload: { messages: safeMessages },
      user_role: context.runtime,
      consent_id: context.consent_id,
      latency_ms: latency,
      status,
    });
    throw e;
  }
}

// Tiny request-id helper (no crypto.randomUUID dep on older Deno)
function cryptoRandomId(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch { /* noop */ }
  return `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
