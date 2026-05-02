/**
 * Nanobot V2 — UNLIM Chat Edge Function
 * Handles POST /tutor-chat (text) and POST /chat (vision)
 * Routes to Gemini 3.x with student memory and circuit context.
 * Falls back to Galileo Brain on VPS if Gemini is unavailable.
 * (c) Andrea Marro — 02/04/2026
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { callLLM, callBrainFallback, getMetrics } from '../_shared/llm-client.ts';
import { routeModel, modelDisplayName } from '../_shared/router.ts';
import { buildSystemPrompt } from '../_shared/system-prompt.ts';
import { loadStudentContext, saveInteraction, checkConsent } from '../_shared/memory.ts';
import { checkRateLimitPersistent, validateChatInput, sanitizeMessage, sanitizeCircuitState, validateExperimentId, validateMimeType, getCorsHeaders, getSecurityHeaders, checkBodySize, validateSessionId, verifyElabApiKey } from '../_shared/guards.ts';
import type { ChatRequest, ChatResponse, CircuitState } from '../_shared/types.ts';
import { retrieveVolumeContext, hybridRetrieve, formatHybridContext } from '../_shared/rag.ts';
import { getCapitoloByExperimentId, buildCapitoloPromptFragment } from '../_shared/capitoli-loader.ts';
import { validatePrincipioZero, validateVolPagCitation } from '../_shared/principio-zero-validator.ts';
import { selectTemplate, executeTemplate } from '../_shared/clawbot-template-router.ts';
import { aggregateOnniscenza, aggregateOnniscenzaV2 } from '../_shared/onniscenza-bridge.ts';
// iter 37 Phase 1 Atom A2 — pre-LLM regex classifier drives ENABLE_ONNISCENZA
// conditional path: chit_chat skips aggregator (~500-1000ms saved), deep
// questions / safety / citations preserve top-3, plurale ragazzi top-2.
import { classifyPrompt } from '../_shared/onniscenza-classifier.ts';
// iter 36 Phase 1 Atom A1 — Onnipotenza dispatcher 62-tool wire post-LLM.
// Parses `[INTENT:{...}]` tags from LLM response, returns parsed intents in
// the API response so the client (browser-side __ELAB_API) can dispatch.
// `cleanText` strips the tags before TTS / display (Principio Zero V3
// preservation: tags don't pollute the user-facing line count / Vol/pag check).
import { parseIntentTags, stripIntentTags, type IntentTag } from '../_shared/intent-parser.ts';
// iter 39 ralph A3 — Onnipotenza Deno port 12-tool server-safe per ADR-032.
// Canary CANARY_DENO_DISPATCH_PERCENT env (0-100) hash-bucket sessionId gate.
import { dispatchIntentsServerSide, inCanaryBucket } from '../_shared/clawbot-dispatcher-deno.ts';
// iter 38 A7 — Mistral function calling (structured output) opt-in for action prompts.
// Replaces legacy `[INTENT:{...}]` regex parsing path on a heuristic match.
// Falls through to legacy regex when ENABLE_INTENT_TOOLS_SCHEMA != true OR
// when the model didn't return parseable JSON (defensive).
import { INTENT_TOOLS_SCHEMA, shouldUseIntentSchema, CANONICAL_INTENT_TOOLS } from '../_shared/intent-tools-schema.ts';
// iter 40 Phase 2 Maker-1 wire-up REVERTED post v73 smoke regression — widened heuristic
// caused Mistral JSON-mode misparse (response wrapped JSON visible to user). Restore narrow
// shouldUseIntentSchema from intent-tools-schema.ts. Widened version remains in
// clawbot-template-router.ts for future iter when post-LLM JSON parser hardened.
// iter 39 Tier 1 T1.1 — semantic prompt cache (in-isolate LRU, ~5ms p95 hit)
import { lookupCache, storeCache, digestSystemPrompt, getCacheStats } from '../_shared/semantic-cache.ts';
// iter 39 A1 SSE — Mistral chat streaming (TTFB perceived <500ms).
// Branch fires when body.stream === true AND ENABLE_SSE env true (canary gate).
import { callMistralChatStream, type MistralStreamChunk } from '../_shared/mistral-client.ts';

// CORS headers dynamically generated per-request via getCorsHeaders(req)

// Voxtral TTS endpoint on VPS
const VPS_TTS_URL = Deno.env.get('VPS_TTS_URL') || 'http://72.60.129.50:8880/tts';

/**
 * Request TTS audio from Voxtral on VPS.
 * Non-blocking — returns URL or null.
 */
async function requestTTS(text: string): Promise<string | null> {
  try {
    // Strip action tags from TTS text
    const cleanText = text
      .replace(/\[azione:[^\]]+\]/gi, '')
      .replace(/\[AZIONE:[^\]]+\]/gi, '')
      .replace(/\[INTENT:\{[^}]+\}\]/g, '')
      .replace(/\n{2,}/g, ' ')
      .trim();

    if (!cleanText || cleanText.length < 5) return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(VPS_TTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleanText,
        voice: 'unlim-tutor',
        language: 'it',
        speed: 0.95,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) return null;

    // Return audio as base64 data URL
    const audioBuffer = await res.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
    return `data:audio/mpeg;base64,${base64}`;
  } catch {
    // TTS failure is non-critical — text response still works
    return null;
  }
}

/**
 * Cap response to ~150 words (ELAB brevity rule, iter 39 relaxed
 * per Andrea mandate "le risposte UNLIM possono anche essere più lunghe").
 * Was 60 iter 31-38 — too short for proper Vol/pag verbatim citations + analogie + orchestration RAG/Wiki/Glossario.
 */
function capWords(text: string, maxWords = 150): string {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  const truncated = words.slice(0, maxWords).join(' ');
  const lastSentence = truncated.search(/[.!?][^.!?]*$/);
  return lastSentence > 20
    ? truncated.substring(0, lastSentence + 1)
    : truncated + '\u2026';
}

// Uptime tracking
const START_TIME = Date.now();
const VERSION = '2.1.0';

// Iter 41 Phase C Task C2 — Telemetry rate counter for parse_fallback events.
// Tracks parse_fallback / total ratio per 100-prompt rolling window.
// Pre-req for C3 widened heuristic re-wire canary (gate threshold <5%).
let parseFallbackCounter = { hits: 0, total: 0 };
function trackParseRate(isFallback: boolean): void {
  parseFallbackCounter.total++;
  if (isFallback) parseFallbackCounter.hits++;
  if (parseFallbackCounter.total >= 100) {
    const ratePct = (parseFallbackCounter.hits / parseFallbackCounter.total) * 100;
    try {
      console.info(JSON.stringify({
        level: 'info', event: 'parse_fallback_rate_window',
        rate_pct: Number(ratePct.toFixed(2)),
        window_size: parseFallbackCounter.total,
        fallback_count: parseFallbackCounter.hits,
        timestamp: new Date().toISOString(),
      }));
    } catch (_) { /* ignore log errors */ }
    parseFallbackCounter = { hits: 0, total: 0 };
  }
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: getCorsHeaders(req) });
  }

  // Health check — GET returns status, uptime, version, metrics
  if (req.method === 'GET') {
    const uptime = Math.floor((Date.now() - START_TIME) / 1000);
    return new Response(JSON.stringify({
      status: 'ok',
      version: VERSION,
      uptimeSeconds: uptime,
      metrics: getMetrics(),
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: getSecurityHeaders(req),
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: getSecurityHeaders(req),
    });
  }

  // ── Defense-in-depth: custom ELAB API key check ──
  // Supabase anon JWT is shipped in the browser bundle and therefore scrapeable;
  // the X-Elab-Api-Key header gates the Edge Function with a server-only secret
  // that only legitimate ELAB builds carry. Fail-open when ELAB_API_KEY isn't
  // set so the deployment stays backward-compatible during rollout.
  const apiKeyCheck = verifyElabApiKey(req);
  if (!apiKeyCheck.ok) {
    return new Response(JSON.stringify({ success: false, error: 'unauthorized', reason: apiKeyCheck.reason }), {
      status: 401,
      headers: getSecurityHeaders(req),
    });
  }

  // Body size check (DoS protection)
  const bodyCheck = checkBodySize(req);
  if (bodyCheck) return bodyCheck;

  try {
    const body = await req.json() as ChatRequest & {
      debug_retrieval?: boolean;
      retrieval_mode?: 'hybrid' | 'dense' | 'auto';
      top_k?: number;
    };
    const { message, sessionId, circuitState, experimentId, simulatorContext, images } = body;
    // Iter 10 P0 debug: surface retrieved chunks when bench/dev requests debug_retrieval=true
    const debugRetrieval = body.debug_retrieval === true;
    const retrievalModeReq = body.retrieval_mode;
    const topKReq = typeof body.top_k === 'number' && body.top_k > 0 && body.top_k <= 20 ? body.top_k : 5;

    // SessionId format validation
    if (!validateSessionId(sessionId)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid sessionId format' }), {
        status: 400,
        headers: getSecurityHeaders(req),
      });
    }

    // Input validation
    const validation = validateChatInput(message, sessionId, images);
    if (!validation.valid) {
      return new Response(JSON.stringify({ success: false, error: validation.error }), {
        status: 400,
        headers: getSecurityHeaders(req),
      });
    }

    // Rate limiting — persistent DB with in-memory fallback (30 req/min per session)
    const rateLimitAllowed = await checkRateLimitPersistent(sessionId);
    if (!rateLimitAllowed) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Stai andando troppo veloce! Aspetta qualche secondo.',
      }), {
        status: 429,
        headers: getSecurityHeaders(req),
      });
    }

    // Prompt injection guard
    const { safe, cleaned: safeMessage } = sanitizeMessage(message);
    if (!safe) {
      return new Response(JSON.stringify({
        success: true,
        response: safeMessage,
        source: 'guard',
      }), {
        status: 200,
        headers: getSecurityHeaders(req),
      });
    }

    // Sanitize inputs against injection
    const safeCircuitState = sanitizeCircuitState(circuitState);
    const safeExperimentId = validateExperimentId(experimentId);
    const safeImages = images?.map(img => ({
      ...img,
      mimeType: validateMimeType(img.mimeType),
    }));

    // Consent check — configurable enforcement level via CONSENT_MODE env var:
    // 'strict' = block if consent not explicitly granted (requires Supabase Auth)
    // 'soft' = block if revoked, warn if unknown (default)
    // 'off' = no consent check
    const consentMode = Deno.env.get('CONSENT_MODE') || 'soft';
    if (consentMode !== 'off') {
      const consentStatus = await checkConsent(sessionId);
      if (consentStatus === 'revoked') {
        return new Response(JSON.stringify({
          success: false,
          error: 'Il consenso genitoriale è stato revocato. Chiedi al tuo insegnante.',
        } satisfies ChatResponse), {
          status: 403,
          headers: getSecurityHeaders(req),
        });
      }
      if (consentMode === 'strict' && consentStatus !== 'granted') {
        return new Response(JSON.stringify({
          success: false,
          error: 'Serve il consenso genitoriale per usare il tutor AI. Chiedi al tuo insegnante.',
        } satisfies ChatResponse), {
          status: 403,
          headers: getSecurityHeaders(req),
        });
      }
      if (consentStatus === 'unknown') {
        console.info(JSON.stringify({
          level: 'info', event: 'consent_unknown',
          sessionPrefix: sessionId.slice(0, 8),
          timestamp: new Date().toISOString(),
        }));
      }
    }

    // 1+2. Parallelize student memory load + RAG retrieval — Sprint T iter 38 Atom A3.
    //
    // Pre-iter-38 these were sequential awaits (~600ms loadStudentContext +
    // ~600-1200ms hybrid/dense retrieval). Both calls are independent: student
    // memory is per-sessionId DB read, RAG retrieval is embedding+vector search
    // and never reads the student row. Running them in parallel via Promise.all
    // saves ~800-1200ms p95 on cold-cache requests (PDR §3 A3 acceptance).
    //
    // Defensive: each branch keeps its own try/catch internally (loadStudentContext
    // already returns null on DB failure; hybrid path falls back to dense; dense
    // path itself catches downstream). Promise.all therefore cannot reject here
    // unless something synchronous throws before the promises start, which is
    // why we still leave the surrounding try/catch on the outer route handler.
    //
    // Sprint S iter 8 ATOM-S8-A2: optional hybrid retrieval (BM25+dense+RRF) gated
    // by env RAG_HYBRID_ENABLED=true. Default false → preserves iter 7 dense-only path.
    // Iter 10: request param retrieval_mode='hybrid' overrides env to force hybrid (debug/bench).
    const envHybrid = (Deno.env.get('RAG_HYBRID_ENABLED') || 'false').toLowerCase() === 'true';
    const useHybrid = retrievalModeReq === 'hybrid' || (retrievalModeReq !== 'dense' && envHybrid);

    // Launch both independent fetches in parallel.
    const studentContextPromise = loadStudentContext(sessionId);
    const ragRetrievePromise = useHybrid
      ? hybridRetrieve(safeMessage, topKReq, {}).then(
          (chunks): { kind: 'hybrid'; chunks: typeof chunks } => ({ kind: 'hybrid', chunks }),
          // Hybrid threw — defensively fall back to dense at the same await
          async (): Promise<{ kind: 'fallback'; text: string }> => ({
            kind: 'fallback',
            text: await retrieveVolumeContext(safeMessage, safeExperimentId, 3),
          }),
        )
      : retrieveVolumeContext(safeMessage, safeExperimentId, 3).then(
          (text): { kind: 'dense'; text: string } => ({ kind: 'dense', text }),
        );

    const [studentContext, ragResult] = await Promise.all([
      studentContextPromise,
      ragRetrievePromise,
    ]);

    let ragContext: string;
    let retrievedChunksDebug: Array<Record<string, unknown>> = [];
    let retrievalModeUsed: 'hybrid' | 'dense' | 'fallback' = 'dense';

    if (ragResult.kind === 'hybrid') {
      const chunks = ragResult.chunks;
      if (chunks.length > 0) {
        ragContext = formatHybridContext(chunks);
        retrievedChunksDebug = chunks.map(c => {
          const cr = c as Record<string, unknown>;
          const rrf = typeof cr.rrf_score === 'number' ? cr.rrf_score : null;
          const sim = typeof cr.similarity === 'number' ? cr.similarity : null;
          const contentStr = typeof cr.content === 'string' ? cr.content as string : '';
          return {
            // Iter 12 ATOM-S12-A4: surface unified score + chunk_id alias + content_preview (60 chars).
            // Preserve legacy fields (id, content) for backward compat with iter 10 bench scripts.
            chunk_id: cr.id ?? null,
            id: cr.id ?? null,
            score: rrf !== null ? rrf : sim,
            source: cr.source ?? null,
            // Iter 13 U3: corpus tag — 'rag' (volumi) | 'wiki' (concept).
            corpus: cr.corpus ?? null,
            chapter: cr.chapter ?? null,
            page: cr.page ?? null,
            figure_id: cr.figure_id ?? null,
            section_title: cr.section_title ?? null,
            content_preview: contentStr.slice(0, 60),
            content: contentStr.slice(0, 240),
            rrf_score: rrf,
            similarity: sim,
          };
        });
        retrievalModeUsed = 'hybrid';
      } else {
        // Hybrid returned empty — defensive fallback to dense (preserves iter 7
        // pre-A3 behavior: empty hybrid result should not produce empty context).
        ragContext = await retrieveVolumeContext(safeMessage, safeExperimentId, 3);
        retrievalModeUsed = 'fallback';
      }
    } else if (ragResult.kind === 'fallback') {
      ragContext = ragResult.text;
      retrievalModeUsed = 'fallback';
    } else {
      ragContext = ragResult.text;
      retrievalModeUsed = 'dense';
    }

    // Iter 30 P0.6 — Onniscenza 7-layer aggregator wire-up (opt-in env flag).
    // ENABLE_ONNISCENZA=true activates aggregateOnniscenza in parallel to RAG.
    // Augments ragContext with L4 class memory + L6 chat history + L7 analogia
    // when supabase client + history provided (non-blocking, defensive try/catch).
    //
    // iter 37 Atom A2 — conditional aggregator path (latency lift).
    // Pre-LLM regex classifier decides:
    //   chit_chat        => skip aggregator entirely (~500-1000ms saved)
    //   citation_vol_pag => onniscenza top-2 focused fetch (volume-anchored)
    //   plurale_ragazzi  => onniscenza top-2 (docente narrating, concise)
    //   deep_question    => onniscenza top-3 (full RRF context)
    //   safety_warning   => onniscenza top-3 (mandatory safety)
    //   default fallback => onniscenza top-3 (safer default)
    const promptClass = classifyPrompt(safeMessage);
    let onniscenzaSnapshot: unknown = null;
    let onniTopK = 3; // top-K used for prompt injection (default keeps existing behavior)
    if ((Deno.env.get('ENABLE_ONNISCENZA') || 'false').toLowerCase() === 'true' && !promptClass.skipOnniscenza) {
      onniTopK = promptClass.topK;
      try {
        const supaUrl = (Deno.env.get('SUPABASE_URL') || '').trim();
        const supaKey = (Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '').trim();
        // Lightweight inline supabase adapter (avoids extra import bloat)
        let supaClient: unknown = null;
        if (supaUrl && supaKey) {
          // Minimal fetch-based adapter compatible with onniscenza-bridge expectations
          supaClient = {
            from: (table: string) => ({
              select: (cols: string) => ({
                eq: (col: string, val: unknown) => ({
                  limit: (n: number) => fetch(
                    `${supaUrl}/rest/v1/${table}?select=${cols}&${col}=eq.${val}&limit=${n}`,
                    { headers: { 'apikey': supaKey, 'Authorization': `Bearer ${supaKey}` } },
                  ).then((r) => r.ok ? r.json() : []),
                  order: () => ({
                    limit: (n: number) => fetch(
                      `${supaUrl}/rest/v1/${table}?select=${cols}&${col}=eq.${val}&limit=${n}`,
                      { headers: { 'apikey': supaKey, 'Authorization': `Bearer ${supaKey}` } },
                    ).then((r) => r.ok ? r.json() : []),
                  }),
                }),
              }),
            }),
          };
        }
        // iter 39 ralph A4 — Onniscenza V2 cross-attention per ADR-033 opt-in.
        // ONNISCENZA_VERSION='v2' env → cross-attention scoring + budget 8 chunks +
        // experiment-anchor +0.15 + kit-mention +0.10 + layer-specific RRF k.
        // Default 'v1' (legacy uniform RRF k=60) preserved for safety canary.
        const onniscenzaVersion = (Deno.env.get('ONNISCENZA_VERSION') || 'v1').toLowerCase();
        const aggregator = onniscenzaVersion === 'v2' ? aggregateOnniscenzaV2 : aggregateOnniscenza;
        onniscenzaSnapshot = await aggregator({
          query: safeMessage,
          experiment_id: safeExperimentId,
          session_id: sessionId, // iter 35 fix Agent C audit: was undefined ref `safeSessionId` masked while ENABLE_ONNISCENZA off
          history: [], // caller history injection iter 31+
          supabase: supaClient,
          enable: { L1_rag: false /* already done above */, L3_glossario: false },
        });
      } catch (onniErr) {
        console.warn(JSON.stringify({
          level: 'warn', event: 'onniscenza_bridge_error',
          error: onniErr instanceof Error ? onniErr.message : 'unknown',
        }));
        onniscenzaSnapshot = null;
      }
    }

    // 3. Build system prompt with all context
    const hasImages = (safeImages?.length ?? 0) > 0;
    const experimentContext = safeExperimentId
      ? `Esperimento attivo: ${safeExperimentId}`
      : null;

    // Sprint S iter 2 — Task A4: resolve Capitolo from experimentId (defensive).
    // Legacy experimentId not yet in 37-Capitoli mapping → returns null → fragment empty.
    // buildSystemPrompt skips empty fragment, preserving legacy behavior (Task A5).
    let capitoloFragment = '';
    if (safeExperimentId) {
      try {
        const match = getCapitoloByExperimentId(safeExperimentId);
        capitoloFragment = buildCapitoloPromptFragment(match?.capitolo ?? null, safeExperimentId);
      } catch (capErr) {
        console.warn(JSON.stringify({
          level: 'warn', event: 'capitolo_fragment_error',
          experimentId: safeExperimentId,
          error: capErr instanceof Error ? capErr.message : 'unknown',
        }));
        capitoloFragment = '';
      }
    }

    // RAG rule is already in BASE_PROMPT; just append retrieved context
    // Image PII guard: instruct AI to ignore personal info in images
    const imagePiiGuard = hasImages
      ? '\n\nREGOLA IMMAGINI: Se l\'immagine contiene volti, nomi, indirizzi o dati personali, IGNORA queste informazioni. Analizza SOLO i componenti elettronici visibili. MAI menzionare persone o dati personali nelle risposte.'
      : '';

    // Iter 31 P0 Andrea mandate: Onniscenza snapshot inject prompt LLM.
    // 7-layer aggregator (RAG + Wiki + Glossario + Sessione + Vision + LLM-knowledge
    // + Analogia) fused via RRF k=60. Inject top-3 fused hits as additional context
    // to enable cross-layer reasoning ("incrociare tutto"). Defensive — only when
    // ENABLE_ONNISCENZA=true env flag set + snapshot non-null.
    let onniscenzaContext = '';
    if (onniscenzaSnapshot && typeof onniscenzaSnapshot === 'object') {
      const snap = onniscenzaSnapshot as { fused?: Array<{ layer?: string; text?: string; source?: string }> };
      // iter 37 A2: dynamic top-K from classifier (top-2 for citation/plurale, top-3 otherwise).
      const top3 = (snap.fused || []).slice(0, Math.max(0, onniTopK));
      if (top3.length > 0) {
        const onniLines = top3.map((h, i) => {
          const src = h.source || h.layer || 'onniscenza';
          const txt = (h.text || '').slice(0, 200).replace(/\n/g, ' ');
          return `${i + 1}. [${src}] ${txt}`;
        }).join('\n');
        onniscenzaContext = `\n\nCONTESTO ONNISCENZA (incrocio 7-layer RRF top-3 — usa per coerenza risposta):\n${onniLines}`;
      }
    }

    // iter 38 A7 — Mistral structured output gate (computed early so the
    // system prompt can include the schema override). Heuristic: action-verb
    // detector + env opt-in. When true, BASE_PROMPT's legacy [INTENT:...]
    // block is superseded by a JSON output instruction (see system-prompt.ts).
    const intentSchemaEnabled =
      (Deno.env.get('ENABLE_INTENT_TOOLS_SCHEMA') || 'false').toLowerCase() === 'true';
    const useIntentSchema = intentSchemaEnabled && shouldUseIntentSchema(safeMessage);

    const systemPrompt = buildSystemPrompt(
      studentContext,
      safeCircuitState as CircuitState | null,
      experimentContext,
      capitoloFragment,
      useIntentSchema,
    )
      + (ragContext ? `\n\n${ragContext}` : '')
      + onniscenzaContext
      + imagePiiGuard;

    // 3.5 ClawBot L2 template short-circuit (Sprint T iter 26).
    // Try keyword/category match BEFORE invoking the LLM. If a template fits,
    // execute it server-side, return [AZIONE:...] tags + speakTTS text. This
    // gives a deterministic morphic path for the 20 documented patterns
    // (introduce/explain/diagnose/guide/celebrate/recap/critique/debug/
    // reroute) and falls back to the LLM otherwise.
    try {
      const tpl = selectTemplate(safeMessage, {
        experimentId: safeExperimentId ?? undefined,
      });
      if (tpl) {
        const exec = await executeTemplate(tpl, { experimentId: safeExperimentId ?? undefined }, {
          ragRetrieve: async (q: string, k: number) => {
            try {
              return await hybridRetrieve(q, k, {});
            } catch {
              return [];
            }
          },
        });
        const tplText = exec.responseText;
        // Iter 34 P0 latency fix Andrea "troppo lento":
        // PREVIOUSLY blocked chat response up to 3s waiting TTS render.
        // NOW return chat text IMMEDIATELY + frontend fetches TTS audio async
        // via separate /unlim-tts call when needed (audio decoupled from text).
        // Effect: -3s perceived latency template path.
        const tplAudio: string | null = null;
        // Save short audit row to student memory (non-blocking)
        const topicCategory = safeExperimentId || tpl.category;
        saveInteraction(sessionId, safeExperimentId || null, topicCategory, `tpl:${tpl.id}`, 'clawbot-l2')
          .catch(err => console.warn('[Nanobot V2] Memory save error:', err));

        const tplResponse: ChatResponse & {
          template_id?: string;
          template_category?: string;
          template_latency_ms?: number;
        } = {
          success: true,
          response: tplText,
          source: `clawbot-l2-${tpl.id}`,
          audio: tplAudio || undefined,
          dataProcessing: 'local-template',
          template_id: tpl.id,
          template_category: tpl.category,
          template_latency_ms: exec.latencyMs,
        };
        return new Response(JSON.stringify(tplResponse), {
          status: 200,
          headers: getSecurityHeaders(req),
        });
      }
    } catch (tplErr) {
      // Template router must NEVER break chat flow — fall through to LLM
      console.warn(JSON.stringify({
        level: 'warn', event: 'clawbot_template_error',
        error: tplErr instanceof Error ? tplErr.message : 'unknown',
      }));
    }

    // iter 39 Tier 1 T1.1 — semantic cache lookup AFTER L2 miss, BEFORE LLM call.
    // Class scenario: same prompt by different students within 30min → ~5ms p95 hit
    // vs ~2200ms p50 / ~5500ms p95 LLM. Defensive: cache miss falls through to LLM.
    let cachedSystemPromptDigest: string | undefined;
    try {
      cachedSystemPromptDigest = await digestSystemPrompt(systemPrompt);
      const cached = await lookupCache({
        experimentId: safeExperimentId,
        safeMessage,
        systemPromptDigest: cachedSystemPromptDigest,
        topK: classification?.topK ?? 3,
        classId: (req.headers.get('x-elab-class-id') || null),
      });
      if (cached) {
        console.info(JSON.stringify({
          level: 'info', event: 'semantic_cache_hit',
          source: cached.source,
          hit_count: cached.hitCount,
          stats: getCacheStats(),
          timestamp: new Date().toISOString(),
        }));
        const cachedResponse: ChatResponse & {
          cache_hit?: boolean;
          source: string;
        } = {
          success: true,
          response: cached.text,
          source: `semantic-cache-${cached.source}`,
          dataProcessing: 'in-isolate-cache',
          cache_hit: true,
        };
        // Surface canonical intents if cached
        if (cached.intentsParsed && Array.isArray(cached.intentsParsed) && cached.intentsParsed.length > 0) {
          (cachedResponse as Record<string, unknown>).intents_parsed = cached.intentsParsed;
        }
        return new Response(JSON.stringify(cachedResponse), {
          status: 200,
          headers: getSecurityHeaders(req),
        });
      }
    } catch (cacheErr) {
      // Cache must NEVER break chat flow
      console.warn(JSON.stringify({
        level: 'warn', event: 'semantic_cache_lookup_error',
        error: cacheErr instanceof Error ? cacheErr.message : 'unknown',
      }));
    }

    // 4. Route to optimal model
    const model = routeModel(safeMessage, hasImages, safeCircuitState as CircuitState | null);

    // 4. Determine thinking level for Pro model
    const thinkingLevel = model === 'gemini-2.5-pro' ? 'medium' : undefined;

    // iter 39 A1 SSE — Mistral streaming branch (TTFB perceived <500ms).
    // Gates:
    //   - body.stream === true (client opt-in per-request)
    //   - ENABLE_SSE env true (canary 5%→25%→100% rollout per ADR-029 §7)
    //   - !useIntentSchema (Mistral function calling JSON-mode incompatible w/ stream)
    //   - !hasImages (Pixtral vision SSE not benchmarked yet — defer iter 40+)
    // Defensive: any sseStream error falls through to existing callLLM flow.
    const sseEnabled = (Deno.env.get('ENABLE_SSE') || 'false').toLowerCase() === 'true';
    const wantStream = (body as { stream?: boolean }).stream === true
      && sseEnabled
      && !useIntentSchema
      && !hasImages;
    if (wantStream) {
      try {
        const mistralStream = await callMistralChatStream({
          systemPrompt,
          message: safeMessage,
          maxOutputTokens: 120,
          temperature: 0.7,
        });
        const cacheDigest = cachedSystemPromptDigest;
        const sseStream = new ReadableStream<Uint8Array>({
          async start(controller) {
            const encoder = new TextEncoder();
            const reader = mistralStream.getReader();
            let fullText = '';
            let latencyMs = 0;
            let modelUsed = '';
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value && typeof value.token === 'string') {
                  fullText += value.token;
                  controller.enqueue(encoder.encode(
                    `data: ${JSON.stringify({ token: value.token })}\n\n`,
                  ));
                }
                if (value && value.done) {
                  latencyMs = value.latencyMs ?? 0;
                  modelUsed = value.model ?? 'mistral-stream';
                }
              }
              // Post-stream: cap + parse intents + clean text on accumulated fullText
              const cappedText = capWords(fullText);
              const parsedTags = parseIntentTags(cappedText);
              const cleanText = stripIntentTags(cappedText);
              // Final metadata SSE chunk — client commits these to UI on done:true
              controller.enqueue(encoder.encode(
                `data: ${JSON.stringify({
                  done: true,
                  clean_text: cleanText,
                  intents_parsed: parsedTags,
                  latency_ms: latencyMs,
                  model: modelUsed,
                  source: 'mistral-stream',
                  full_text: cappedText,
                })}\n\n`,
              ));
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              // Cache write-through (best effort, non-blocking)
              if (cacheDigest && cleanText) {
                try {
                  await storeCache({
                    experimentId: safeExperimentId,
                    safeMessage,
                    systemPromptDigest: cacheDigest,
                    topK: onniTopK,
                    classId: (req.headers.get('x-elab-class-id') || null),
                    text: cleanText,
                    intentsParsed: parsedTags,
                  });
                } catch { /* defensive */ }
              }
              // Save short audit row to student memory (non-blocking)
              saveInteraction(sessionId, safeExperimentId || null,
                safeExperimentId || 'sse-stream', 'sse-mistral', 'clawbot-l2-sse')
                .catch(err => console.warn('[Nanobot V2 SSE] Memory save error:', err));
              controller.close();
            } catch (e) {
              try {
                controller.enqueue(encoder.encode(
                  `data: ${JSON.stringify({ error: 'stream_failed', detail: e instanceof Error ? e.message : 'unknown' })}\n\n`,
                ));
              } catch { /* no-op */ }
              controller.error(e);
            }
          },
        });
        return new Response(sseStream, {
          status: 200,
          headers: {
            ...getSecurityHeaders(req),
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'X-Accel-Buffering': 'no',
            Connection: 'keep-alive',
          },
        });
      } catch (sseErr) {
        // Stream init failed (Mistral down, env missing, etc) — fall through to existing flow
        console.warn(JSON.stringify({
          level: 'warn',
          event: 'sse_stream_init_failed_fallback',
          error: sseErr instanceof Error ? sseErr.message : 'unknown',
          timestamp: new Date().toISOString(),
        }));
      }
    }

    // 5. Call LLM (Together default, Gemini fallback, Brain last resort)
    // Sprint S iter 5: Andrea decision — Together AI primary, Gemini fallback
    // (R5 49/50 PASS Llama 3.3 70B, audit docs/audits/2026-04-26-sprint-s-iter4-r5-together-direct-RESULT.md)
    // callLLM respects LLM_PROVIDER env (defaults to 'together' in llm-client.ts:192).
    //
    // iter 37 Phase 3 latency p95 mitigation:
    //   - Promise.race 8s timeout kills tail outliers (R5 max 17971ms = 18s).
    //   - On timeout, throws 'llm_timeout_8s' → caught by existing catch → callBrainFallback.
    //   - maxOutputTokens reduced 256→120 per iter 31 close mandate (sync llm-client.ts:311 default).
    // iter 38 A7 — Mistral structured-output flow.
    // `useIntentSchema` already computed earlier (BEFORE buildSystemPrompt) so
    // the system prompt could conditionally include the JSON output override.
    // Schema only takes effect when:
    //   1. env flag ENABLE_INTENT_TOOLS_SCHEMA enabled
    //   2. heuristic shouldUseIntentSchema(message) detects an action verb
    //   3. provider routing lands on Mistral (other providers ignore field)
    // When all three hold, Mistral returns a JSON object {text, intents?[]}
    // that we project to cappedText + parsed intents (replacing regex parse).
    let result;
    let preparsedIntents: unknown[] | null = null;
    try {
      const llmCallPromise = callLLM({
        model,
        systemPrompt,
        message: safeMessage,
        images: safeImages,
        maxOutputTokens: 120,
        temperature: 0.7,
        thinkingLevel,
        // Iter 38 A7: structured output for Mistral when opt-in. Defensive:
        // other providers ignore this field; Mistral validates server-side.
        ...(useIntentSchema ? { responseFormat: INTENT_TOOLS_SCHEMA } : {}),
      });
      const timeoutPromise = new Promise<never>((_, rej) => {
        setTimeout(() => rej(new Error('llm_timeout_8s')), 8000);
      });
      result = await Promise.race([llmCallPromise, timeoutPromise]);

      // iter 38 A7 — when schema mode used + provider is Mistral, parse the
      // JSON object out of result.text and project text/intents back into
      // the legacy flow shape. If parse fails for any reason (provider
      // didn't honor schema, or Gemini fallback ran), we leave the original
      // text intact and rely on the legacy `parseIntentTags` regex below.
      // Iter 41 fix post v75 smoke: removed provider==='mistral' gate. Gemini Flash-Lite
      // when schema enabled may ALSO return JSON-mode output. Parser handles non-Mistral
      // providers gracefully (Stage 6 legacy fallback when input not JSON).
      if (useIntentSchema && result && typeof result.text === 'string') {
        // Iter 41 Phase C Task C1 — robust 6-stage JSON-mode parser (ADR-036).
        // Gate: INTENT_SCHEMA_PARSER_V2=true env (default false safe).
        // Replaces single JSON.parse with multi-shape waterfall (pure / whitespace_strip /
        // code_fence_strip / unescape / regex_extract / legacy_regex_fallback / failed).
        const useParserV2 = (Deno.env.get('INTENT_SCHEMA_PARSER_V2') || 'false').toLowerCase() === 'true';
        if (useParserV2) {
          const { parseJsonMode } = await import('../_shared/json-mode-parser.ts');
          const parsed = parseJsonMode(result.text);
          if (parsed.source !== 'failed' && parsed.text.trim()) {
            result = { ...result, text: parsed.text };
            if (parsed.intents.length > 0) {
              preparsedIntents = parsed.intents.filter((i) => {
                const t = i?.tool;
                return typeof t === 'string' && (CANONICAL_INTENT_TOOLS as readonly string[]).includes(t);
              });
            }
            console.info(JSON.stringify({
              level: 'info', event: 'json_mode_parsed',
              source: parsed.source,
              intent_count: parsed.intents.length,
              filtered_count: preparsedIntents?.length ?? 0,
              timestamp: new Date().toISOString(),
            }));
            trackParseRate(false); // C2 — parse success
          } else {
            console.info(JSON.stringify({
              level: 'info', event: 'intent_schema_parse_fallback',
              parser_version: 'v2', source: parsed.source,
              timestamp: new Date().toISOString(),
            }));
            trackParseRate(true); // C2 — parse fallback
          }
        } else {
          // Legacy single-stage parser (iter 38 baseline).
          try {
            const parsed = JSON.parse(result.text) as { text?: string; intents?: unknown[] };
            if (parsed && typeof parsed.text === 'string' && parsed.text.trim()) {
              result = { ...result, text: parsed.text };
              if (Array.isArray(parsed.intents) && parsed.intents.length > 0) {
                preparsedIntents = parsed.intents.filter((i) => {
                  const t = (i as { tool?: string })?.tool;
                  return typeof t === 'string' && (CANONICAL_INTENT_TOOLS as readonly string[]).includes(t);
                });
              }
              trackParseRate(false); // C2 — legacy parse success
            } else {
              trackParseRate(true); // C2 — legacy parse no text field
            }
          } catch (_parseErr) {
            console.info(JSON.stringify({
              level: 'info', event: 'intent_schema_parse_fallback',
              parser_version: 'v1',
              timestamp: new Date().toISOString(),
            }));
            trackParseRate(true); // C2 — legacy parse failed
          }
        }
      }
    } catch (llmError) {
      // Both Together + Gemini failed — try Brain fallback
      console.warn(JSON.stringify({
        level: 'warn', event: 'llm_fallback_brain',
        error: llmError instanceof Error ? llmError.message : 'unknown',
        timestamp: new Date().toISOString(),
      }));
      result = await callBrainFallback(safeMessage, systemPrompt);
      if (!result) {
        return new Response(JSON.stringify({
          success: false,
          error: 'AI temporaneamente non disponibile. Riprova tra qualche secondo.',
        } satisfies ChatResponse), {
          status: 503,
          headers: getSecurityHeaders(req),
        });
      }
    }

    // 6. Cap response length
    const cappedText = capWords(result.text);

    // Iter 41 Phase B Task B4 wire-up — anti-absurd validator (telemetry only iter 41).
    // Gate ANTI_ABSURD_TELEMETRY=true env (default false safe). NER component cross-ref
    // RAG chunks + Arduino Nano pin validity check. NEVER blocks response iter 41.
    if ((Deno.env.get('ANTI_ABSURD_TELEMETRY') || 'false').toLowerCase() === 'true') {
      try {
        const { validateAbsurd } = await import('../_shared/anti-absurd-validator.ts');
        // Iter 41 fix iter 11 cycle ralph: use retrievedChunksDebug (in-scope, declared L322)
        // instead of undeclared ragHits. Pass content_preview (60 char) — sufficient for NER
        // root-component cross-ref (iter 42+ extend full content if needed).
        const ragChunksForValidation = Array.isArray(retrievedChunksDebug)
          ? retrievedChunksDebug.map((h: Record<string, unknown>) => ({
              content: typeof h.content_preview === 'string' ? h.content_preview as string : '',
            }))
          : [];
        const absurd = validateAbsurd({
          response: cappedText,
          ragChunks: ragChunksForValidation,
          experimentId: safeExperimentId || undefined,
        });
        if (absurd.suspicious) {
          console.warn(JSON.stringify({
            level: 'warn', event: 'anti_absurd_flag',
            reasons: absurd.reasons,
            score: absurd.score,
            experimentId: safeExperimentId || null,
            timestamp: new Date().toISOString(),
          }));
        }
      } catch (_err) { /* defensive: never break response on validator error */ }
    }

    // 6a. Sprint T iter 36 Phase 1 — Atom A1 — Onnipotenza dispatcher wire-up.
    // Parse `[INTENT:{tool:"...",args:{...}}]` tags from the LLM response and
    // surface them as `intents_parsed` for the client (browser `__ELAB_API`)
    // to dispatch. Server-side dispatch is NOT performed here because the
    // 62-tool registry handlers live in the browser context (see
    // `scripts/openclaw/dispatcher.ts` which resolves `globalThis.__ELAB_API`).
    // Defensive: never throws — empty array on any error / no tags.
    let parsedIntents: IntentTag[] = [];
    let cleanText = cappedText;
    try {
      // iter 38 A7: when Mistral structured-output produced intents, prefer
      // them (already validated against canonical schema). Otherwise fall
      // back to legacy regex parse on capped text.
      if (preparsedIntents && preparsedIntents.length > 0) {
        parsedIntents = preparsedIntents
          .map((i) => {
            const o = i as { tool?: unknown; args?: unknown };
            const tool = typeof o.tool === 'string' ? o.tool : '';
            const args = (o.args && typeof o.args === 'object' && !Array.isArray(o.args))
              ? (o.args as Record<string, unknown>)
              : {};
            return tool ? ({ tool, args } as IntentTag) : null;
          })
          .filter((x): x is IntentTag => x !== null);
        cleanText = cappedText; // schema mode already returned clean prose
        if (parsedIntents.length > 0) {
          console.info(JSON.stringify({
            level: 'info', event: 'intents_parsed_schema',
            count: parsedIntents.length,
            tools: parsedIntents.map(i => i.tool),
            experimentId: safeExperimentId || null,
            timestamp: new Date().toISOString(),
          }));
        }
      } else {
        parsedIntents = parseIntentTags(cappedText);
        cleanText = stripIntentTags(cappedText);
        if (parsedIntents.length > 0) {
          console.info(JSON.stringify({
            level: 'info', event: 'intents_parsed',
            count: parsedIntents.length,
            tools: parsedIntents.map(i => i.tool),
            experimentId: safeExperimentId || null,
            timestamp: new Date().toISOString(),
          }));
        }
      }
    } catch (intentErr) {
      // Parser must NEVER break chat flow.
      console.warn('[Nanobot V2] intent-parser error (non-blocking):', intentErr);
      parsedIntents = [];
      cleanText = cappedText;
    }

    // iter 39 ralph A3 — server-side dispatch canary per ADR-032.
    // CANARY_DENO_DISPATCH_PERCENT env (0-100) gates server-side dispatch.
    // Hash-bucket sessionId determinism = same session always same path.
    // 12-tool subset executed server-side; remaining surface to browser as iter 36.
    let dispatcherResults: unknown[] = [];
    try {
      const canaryPct = parseInt(Deno.env.get('CANARY_DENO_DISPATCH_PERCENT') || '0', 10);
      if (canaryPct > 0 && parsedIntents.length > 0 && inCanaryBucket(sessionId, canaryPct)) {
        const results = await dispatchIntentsServerSide(parsedIntents, {
          sessionId,
          experimentId: safeExperimentId,
        });
        dispatcherResults = results;
        const serverExecuted = results.filter(r => r.server_executed).length;
        console.info(JSON.stringify({
          level: 'info', event: 'clawbot_deno_dispatch',
          canary_pct: canaryPct,
          intents_count: parsedIntents.length,
          server_executed: serverExecuted,
          surface_to_browser: results.length - serverExecuted,
          timestamp: new Date().toISOString(),
        }));
      }
    } catch (dispatchErr) {
      // Dispatcher must NEVER break chat flow — fall through with empty results.
      console.warn('[Nanobot V2] clawbot-deno-dispatcher error (non-blocking):', dispatchErr);
      dispatcherResults = [];
    }

    // 6b. Sprint S iter 2 — Task A4: post-LLM PRINCIPIO ZERO validation.
    // Append-warning pattern: log violations, NEVER reject/modify response.
    // CRITICAL severity → console.error; lower → no-op (telemetry future).
    try {
      const isConceptIntro = false; // best-guess; future: derive from experimentContext metadata
      const pzValidation = validatePrincipioZero(cleanText, { isConceptIntro });
      if (pzValidation.severity === 'CRITICAL') {
        console.error(JSON.stringify({
          level: 'error', event: 'pz_critical_violation',
          violations: pzValidation.violations,
          experimentId: safeExperimentId || null,
          model: result.model,
          sample: cleanText.slice(0, 200),
          timestamp: new Date().toISOString(),
        }));
      } else if (pzValidation.violations.length > 0) {
        console.info(JSON.stringify({
          level: 'info', event: 'pz_violations',
          severity: pzValidation.severity,
          count: pzValidation.violations.length,
          rules: pzValidation.violations.map(v => v.rule),
          experimentId: safeExperimentId || null,
        }));
      }

      // BASE_PROMPT v3.2 — Sprint T close iter 40 — Vol/pag citation validator.
      // Telemetry-only iter 40 (NOT response-blocking, gate later iter 41+).
      // Logs `pz_v3_vol_pag_match` boolean per response for canary observability.
      const volPagResult = validateVolPagCitation(cleanText, { required: false, acceptLoose: true });
      console.info(JSON.stringify({
        level: 'info',
        event: 'pz_v3_vol_pag_match',
        passes: volPagResult.passes,
        canonical_match: volPagResult.canonical_match,
        loose_match: volPagResult.loose_match,
        regex_match_count: volPagResult.regex_match_count,
        violations: volPagResult.violations,
        matched_text: volPagResult.matched_text || null,
        experimentId: safeExperimentId || null,
        model: result.model,
      }));
    } catch (pzErr) {
      // Validator must NEVER break chat flow.
      console.warn('[Nanobot V2] PZ validator error (non-blocking):', pzErr);
    }

    // Iter 34 P0 latency fix Andrea "troppo lento":
    // PREVIOUSLY blocked chat response up to 3s waiting TTS render (Promise.race).
    // NOW return chat text IMMEDIATELY + frontend fetches TTS audio async via
    // separate /unlim-tts call when needed. Effect: -3s perceived latency.
    // 7. Save interaction to memory (async, non-blocking)
    const topicCategory = safeExperimentId || 'general';
    saveInteraction(sessionId, safeExperimentId || null, topicCategory, cleanText.slice(0, 100), result.model)
      .catch(err => console.warn('[Nanobot V2] Memory save error:', err));

    const audioUrl: string | null = null; // decoupled — frontend fetches separately

    // iter 39 Tier 1 T1.1 — store successful response in semantic cache.
    // Fire-and-forget: NEVER blocks response. Cache module gates on pzScore +
    // text length defensively (see semantic-cache.ts). LRU eviction at 100 entries.
    try {
      const sourceLabel = result.provider === 'mistral' ? result.model
        : result.provider === 'together' ? `together-${result.model}`
        : result.provider === 'brain' ? 'brain'
        : modelDisplayName(model) || result.model;
      storeCache(
        {
          experimentId: safeExperimentId,
          safeMessage,
          systemPromptDigest: cachedSystemPromptDigest,
          topK: classification?.topK ?? 3,
          classId: (req.headers.get('x-elab-class-id') || null),
        },
        {
          text: cleanText,
          intentsParsed: parsedIntents.map(i => ({ tool: i.tool, args: i.args })),
          source: sourceLabel,
        },
      ).catch((cacheStoreErr) => {
        console.warn(JSON.stringify({
          level: 'warn', event: 'semantic_cache_store_error',
          error: cacheStoreErr instanceof Error ? cacheStoreErr.message : 'unknown',
        }));
      });
    } catch (_e) {
      // Defensive — never break flow on cache store
    }

    // 10. Return response — include data processing transparency (GDPR)
    const response: ChatResponse & {
      debug_retrieval?: Array<Record<string, unknown>>;
      retrieval_mode?: string;
      intents_parsed?: Array<{ tool: string; args: Record<string, unknown> }>;
      // iter 37 A2: telemetry for benchmark/debug. Omitted unless debug_retrieval=true to keep payload minimal.
      prompt_class?: { category: string; skipOnniscenza: boolean; topK: number; wordCount: number };
    } = {
      success: true,
      response: cleanText,
      // iter 24: use result.model (actual provider model) when provider != gemini
      source: result.provider === 'mistral' ? result.model
        : result.provider === 'together' ? `together-${result.model}`
        : result.provider === 'brain' ? 'brain'
        : modelDisplayName(model) || result.model,
      audio: audioUrl || undefined,
      dataProcessing: result.provider === 'mistral' ? 'mistral-eu'
        : result.provider === 'together' ? 'together-ai'
        : result.provider === 'brain' ? 'local-brain'
        : 'google-gemini',
    };
    // Iter 10 P0: surface retrieved chunks for bench (B2 hybrid RAG eval)
    if (debugRetrieval) {
      response.debug_retrieval = retrievedChunksDebug;
      response.retrieval_mode = retrievalModeUsed;
      // iter 37 A2: surface classifier verdict for bench R5 latency measurement.
      response.prompt_class = {
        category: promptClass.category,
        skipOnniscenza: promptClass.skipOnniscenza,
        topK: promptClass.topK,
        wordCount: promptClass.wordCount,
      };
    }

    // iter 36 Phase 1 Atom A1: surface parsed intents for client-side dispatch
    // via window.__ELAB_API. Empty array omitted to keep payload minimal.
    if (parsedIntents.length > 0) {
      response.intents_parsed = parsedIntents.map(i => ({ tool: i.tool, args: i.args }));
    }

    // iter 39 ralph A3: surface dispatcher_results when canary fired server-side.
    // Browser inspects each result; if server_executed=true, skips redundant
    // browser dispatch. If surface_to_browser=true, browser executes via __ELAB_API.
    if (Array.isArray(dispatcherResults) && dispatcherResults.length > 0) {
      (response as Record<string, unknown>).dispatcher_results = dispatcherResults;
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: getSecurityHeaders(req),
    });

  } catch (err) {
    // Structured logging — no internal details to client
    console.error(JSON.stringify({
      level: 'error',
      event: 'chat_error',
      error: err instanceof Error ? err.message : 'unknown',
      timestamp: new Date().toISOString(),
    }));
    return new Response(JSON.stringify({
      success: false,
      error: 'Errore interno. Riprova.',
    } satisfies ChatResponse), {
      status: 500,
      headers: getSecurityHeaders(req),
    });
  }
});
