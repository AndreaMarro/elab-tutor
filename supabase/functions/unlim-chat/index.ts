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
import { retrieveVolumeContext } from '../_shared/rag.ts';
import { getCapitoloByExperimentId, buildCapitoloPromptFragment } from '../_shared/capitoli-loader.ts';
import { validatePrincipioZero } from '../_shared/principio-zero-validator.ts';

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
    const body: ChatRequest = await req.json();
    const { message, sessionId, circuitState, experimentId, simulatorContext, images } = body;

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

    // 2. Retrieve RAG context from volumes (semantic + keyword)
    const ragContext = await retrieveVolumeContext(safeMessage, safeExperimentId, 3);

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
    const systemPrompt = buildSystemPrompt(studentContext, safeCircuitState as CircuitState | null, experimentContext, capitoloFragment)
      + (ragContext ? `\n\n${ragContext}` : '')
      + imagePiiGuard;

    // 4. Route to optimal model
    const model = routeModel(safeMessage, hasImages, safeCircuitState as CircuitState | null);

    // 4. Determine thinking level for Pro model
    const thinkingLevel = model === 'gemini-2.5-pro' ? 'medium' : undefined;

    // 5. Call LLM (Together default, Gemini fallback, Brain last resort)
    let result;
    try {
      result = await callLLM({
        model,
        systemPrompt,
        message: safeMessage,
        images: safeImages,
        maxOutputTokens: 256,
        temperature: 0.7,
        thinkingLevel,
      });
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

    // 6b. Sprint S iter 2 — Task A4: post-LLM PRINCIPIO ZERO validation.
    // Append-warning pattern: log violations, NEVER reject/modify response.
    // CRITICAL severity → console.error; lower → no-op (telemetry future).
    try {
      const isConceptIntro = false; // best-guess; future: derive from experimentContext metadata
      const pzValidation = validatePrincipioZero(cappedText, { isConceptIntro });
      if (pzValidation.severity === 'CRITICAL') {
        console.error(JSON.stringify({
          level: 'error', event: 'pz_critical_violation',
          violations: pzValidation.violations,
          experimentId: safeExperimentId || null,
          model: result.model,
          sample: cappedText.slice(0, 200),
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

    // 7. Request TTS audio (parallel, non-blocking)
    const audioPromise = requestTTS(cappedText);

    // 8. Save interaction to memory (async, non-blocking)
    // GDPR: pass topic category instead of raw message to avoid storing PII
    const topicCategory = safeExperimentId || 'general';
    saveInteraction(sessionId, safeExperimentId || null, topicCategory, cappedText.slice(0, 100), result.model)
      .catch(err => console.warn('[Nanobot V2] Memory save error:', err));

    // 9. Wait for TTS (with timeout — don't delay text response too long)
    let audioUrl: string | null = null;
    try {
      audioUrl = await Promise.race([
        audioPromise,
        new Promise<null>(resolve => setTimeout(() => resolve(null), 3000)),
      ]);
    } catch {
      audioUrl = null;
    }

    // 10. Return response — include data processing transparency (GDPR)
    const response: ChatResponse = {
      success: true,
      response: cappedText,
      source: modelDisplayName(model) || result.model,
      audio: audioUrl || undefined,
      dataProcessing: result.provider === 'together' ? 'together-ai'
        : result.provider === 'brain' ? 'local-brain'
        : 'google-gemini',
    };

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
