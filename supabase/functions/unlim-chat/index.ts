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
import { validatePrincipioZero } from '../_shared/principio-zero-validator.ts';
import { selectTemplate, executeTemplate } from '../_shared/clawbot-template-router.ts';
import { aggregateOnniscenza } from '../_shared/onniscenza-bridge.ts';
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
 * Cap response to ~60 words (ELAB brevity rule)
 */
function capWords(text: string, maxWords = 60): string {
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

    // 1. Load student memory (non-blocking if DB unavailable)
    const studentContext = await loadStudentContext(sessionId);

    // 2. Retrieve RAG context from volumes
    // Sprint S iter 8 ATOM-S8-A2: optional hybrid retrieval (BM25+dense+RRF) gated
    // by env RAG_HYBRID_ENABLED=true. Default false → preserves iter 7 dense-only path.
    // Iter 10: request param retrieval_mode='hybrid' overrides env to force hybrid (debug/bench).
    const envHybrid = (Deno.env.get('RAG_HYBRID_ENABLED') || 'false').toLowerCase() === 'true';
    const useHybrid = retrievalModeReq === 'hybrid' || (retrievalModeReq !== 'dense' && envHybrid);
    let ragContext: string;
    let retrievedChunksDebug: Array<Record<string, unknown>> = [];
    let retrievalModeUsed: 'hybrid' | 'dense' | 'fallback' = 'dense';
    if (useHybrid) {
      try {
        const chunks = await hybridRetrieve(safeMessage, topKReq, {});
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
          ragContext = await retrieveVolumeContext(safeMessage, safeExperimentId, 3);
          retrievalModeUsed = 'fallback';
        }
      } catch (_err) {
        // Defensive fallback to dense-only path if hybrid fails for any reason
        ragContext = await retrieveVolumeContext(safeMessage, safeExperimentId, 3);
        retrievalModeUsed = 'fallback';
      }
    } else {
      ragContext = await retrieveVolumeContext(safeMessage, safeExperimentId, 3);
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
        onniscenzaSnapshot = await aggregateOnniscenza({
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

    const systemPrompt = buildSystemPrompt(studentContext, safeCircuitState as CircuitState | null, experimentContext, capitoloFragment)
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

    // 4. Route to optimal model
    const model = routeModel(safeMessage, hasImages, safeCircuitState as CircuitState | null);

    // 4. Determine thinking level for Pro model
    const thinkingLevel = model === 'gemini-2.5-pro' ? 'medium' : undefined;

    // 5. Call LLM (Together default, Gemini fallback, Brain last resort)
    // Sprint S iter 5: Andrea decision — Together AI primary, Gemini fallback
    // (R5 49/50 PASS Llama 3.3 70B, audit docs/audits/2026-04-26-sprint-s-iter4-r5-together-direct-RESULT.md)
    // callLLM respects LLM_PROVIDER env (defaults to 'together' in llm-client.ts:192).
    //
    // iter 37 Phase 3 latency p95 mitigation:
    //   - Promise.race 8s timeout kills tail outliers (R5 max 17971ms = 18s).
    //   - On timeout, throws 'llm_timeout_8s' → caught by existing catch → callBrainFallback.
    //   - maxOutputTokens reduced 256→120 per iter 31 close mandate (sync llm-client.ts:311 default).
    let result;
    try {
      const llmCallPromise = callLLM({
        model,
        systemPrompt,
        message: safeMessage,
        images: safeImages,
        maxOutputTokens: 120,
        temperature: 0.7,
        thinkingLevel,
      });
      const timeoutPromise = new Promise<never>((_, rej) => {
        setTimeout(() => rej(new Error('llm_timeout_8s')), 8000);
      });
      result = await Promise.race([llmCallPromise, timeoutPromise]);
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
    } catch (intentErr) {
      // Parser must NEVER break chat flow.
      console.warn('[Nanobot V2] intent-parser error (non-blocking):', intentErr);
      parsedIntents = [];
      cleanText = cappedText;
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
