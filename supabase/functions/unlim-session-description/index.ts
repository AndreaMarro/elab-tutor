/**
 * unlim-session-description — iter 35 P0 + iter 35 Phase 2 Atom I3 backfill
 *
 * POST { session_id, transcript_excerpt? }  →  { description: string ≤80 chars }
 *
 * Genera (e cache su `unlim_sessions.description_unlim`) una descrizione
 * breve UNLIM-style di una sessione passata, da mostrare nella cronologia
 * homepage Google-style.
 *
 * Iter 35 Phase 2 Atom I3 — backfill input contract extension:
 *   - body.session_id (required, uuid)
 *   - body.transcript_excerpt (optional, string ≤500 chars) — when present
 *     supplements `events` with verbatim user/UNLIM transcript snippet for
 *     better LLM context. Useful for backfilling sessions where `events`
 *     array is sparse but transcript history is rich.
 *   - X-Elab-Api-Key header gate (verifyElabApiKey, fail-open when secret
 *     not configured per guards.ts:67).
 *
 * Output: stringa fattuale ≤80 char, plurale "Ragazzi" non si addice qui
 * (è metadato lista, non istruzione docente). Es:
 *   "Esplorato circuito LED con resistenza · 25 min · 6 interazioni"
 *
 * Cache: prima di chiamare LLM controlla `description_unlim` non null. Se
 * presente, ritorna direttamente. Update con UPDATE ... WHERE id=$1.
 *
 * Andrea Marro — 30/04/2026 + iter 35 Phase 2 (2026-05-04)
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { getCorsHeaders, getSecurityHeaders, checkBodySize, verifyElabApiKey } from '../_shared/guards.ts';
import { callLLM } from '../_shared/llm-client.ts';
// iter 35 Phase 2 Atom I3 — pure helpers extracted to companion module so
// vitest unit tests (Node) can import without resolving deno.land https URLs.
import { buildPrompt, fallbackSummary, MAX_CHARS, type SessionRow } from './_helpers.ts';
// Re-export for documentation discoverability + integration test scope.
export { buildPrompt, fallbackSummary, MAX_CHARS } from './_helpers.ts';
export type { SessionRow } from './_helpers.ts';

// iter 35 Phase 2 Atom I3 — buildPrompt + fallbackSummary + MAX_CHARS +
// SessionRow imported from ./_helpers.ts above (re-exported for discoverability
// + integration test scope). Helpers extracted to enable Node vitest import.

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: getCorsHeaders(req) });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405, headers: getSecurityHeaders(req),
    });
  }

  const bodyCheck = checkBodySize(req);
  if (bodyCheck) return bodyCheck;

  // iter 35 Phase 2 Atom I3 — ELAB_API_KEY auth gate (defense-in-depth).
  // verifyElabApiKey is fail-open when secret not configured, so this is
  // safe to add even before secret is rolled out across all environments.
  const apiKeyCheck = verifyElabApiKey(req);
  if (!apiKeyCheck.ok) {
    return new Response(JSON.stringify({ success: false, error: apiKeyCheck.reason || 'unauthorized' }), {
      status: 401, headers: getSecurityHeaders(req),
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const sessionId = typeof body?.session_id === 'string' ? body.session_id.trim() : '';
    // iter 35 Phase 2 Atom I3 — optional transcript_excerpt input (≤500 chars
    // enforced by buildPrompt MAX_TRANSCRIPT_CHARS slice). Defensive: non-string
    // values are coerced to empty (no leak into prompt).
    const transcriptExcerpt = typeof body?.transcript_excerpt === 'string'
      ? body.transcript_excerpt
      : '';
    if (!sessionId) {
      return new Response(JSON.stringify({ success: false, error: 'session_id required' }), {
        status: 400, headers: getSecurityHeaders(req),
      });
    }

    const supabaseUrl = (Deno.env.get('SUPABASE_URL') || '').trim();
    const supabaseKey = (Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '').trim();
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ success: false, error: 'Supabase not configured' }), {
        status: 503, headers: getSecurityHeaders(req),
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1) Fetch session row
    const { data: row, error: fetchErr } = await supabase
      .from('unlim_sessions')
      .select('id, experiment_id, modalita, started_at, ended_at, events, description_unlim')
      .eq('id', sessionId)
      .single();

    if (fetchErr || !row) {
      return new Response(JSON.stringify({ success: false, error: 'session not found' }), {
        status: 404, headers: getSecurityHeaders(req),
      });
    }

    // 2) Cache hit: return existing description without LLM call
    if (row.description_unlim && row.description_unlim.trim().length > 0) {
      return new Response(JSON.stringify({ success: true, description: row.description_unlim, cached: true }), {
        status: 200, headers: getSecurityHeaders(req),
      });
    }

    // 3) Generate via LLM (weighted routing — fast Gemini Flash-Lite primary post iter 35)
    let description = '';
    try {
      const { systemPrompt, message } = buildPrompt(row as SessionRow, transcriptExcerpt);
      const result = await callLLM({
        model: 'gemini-2.5-flash-lite',
        systemPrompt,
        message,
        maxOutputTokens: 80,
        temperature: 0.4,
      });
      description = (result.text || '').trim().replace(/^["']|["']$/g, '').slice(0, MAX_CHARS);
    } catch (llmErr) {
      console.info(JSON.stringify({ level: 'info', event: 'session_description_llm_down', error: llmErr instanceof Error ? llmErr.message : String(llmErr) }));
    }

    if (!description) {
      description = fallbackSummary(row as SessionRow);
    }

    // 4) Cache write (best effort, non-blocking on response)
    try {
      await supabase
        .from('unlim_sessions')
        .update({ description_unlim: description })
        .eq('id', sessionId);
    } catch (updErr) {
      console.info(JSON.stringify({ level: 'info', event: 'session_description_cache_write_failed', error: updErr instanceof Error ? updErr.message : String(updErr) }));
    }

    return new Response(JSON.stringify({ success: true, description, cached: false }), {
      status: 200, headers: getSecurityHeaders(req),
    });
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', event: 'session_description_unhandled', error: err instanceof Error ? err.message : String(err) }));
    return new Response(JSON.stringify({ success: false, error: 'unhandled' }), {
      status: 500, headers: getSecurityHeaders(req),
    });
  }
});
