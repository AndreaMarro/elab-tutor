/**
 * Nanobot V2 — UNLIM Wiki Query Edge Function (Sprint 4 Day 26 scaffold)
 *
 * Retrieval endpoint for Karpathy LLM Wiki POC: takes a student/teacher query
 * and returns top-K wiki entries ranked by relevance.
 *
 * Day 26 (S4.1.5): skeleton + request validation + CORS + mock retrieval.
 * Day 27 (S4.1.6): real retrieval wired to data/wiki/*.md post Together ingest.
 *
 * Contract:
 *   POST /unlim-wiki-query
 *   Body: { query: string, topK?: number (default 5, max 20), filter?: { volume?: 1|2|3 } }
 *   Resp: { results, metrics: { latency_ms, source, source_count }, version, query }
 *
 * Logic lives in scripts/wiki-query-core.mjs (shared with Node vitest).
 *
 * (c) Andrea Marro — Sprint 4 Day 26 (2026-04-22 logical)
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { getCorsHeaders, getSecurityHeaders, checkBodySize } from '../_shared/guards.ts';
import {
  validateRequest,
  retrieveWikiEntries,
  buildResponse,
} from '../../../scripts/wiki-query-core.mjs';

async function handleRequest(req: Request): Promise<Response> {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const securityHeaders = getSecurityHeaders(req);

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method not allowed' }), {
      status: 405,
      headers: securityHeaders,
    });
  }

  const sizeErr = checkBodySize(req);
  if (sizeErr) return sizeErr;

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return new Response(JSON.stringify({ error: 'body read failed' }), {
      status: 400,
      headers: securityHeaders,
    });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: 'invalid JSON' }), {
      status: 400,
      headers: securityHeaders,
    });
  }

  const validation = validateRequest(parsed);
  if (!validation.ok) {
    return new Response(JSON.stringify({ error: validation.error }), {
      status: 400,
      headers: securityHeaders,
    });
  }

  const startedAt = Date.now();
  try {
    const entries = await retrieveWikiEntries(validation.data);
    const resp = buildResponse(validation.data, entries, startedAt);
    return new Response(JSON.stringify(resp), { status: 200, headers: securityHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: 'retrieval_error', detail: message.slice(0, 200) }),
      { status: 500, headers: securityHeaders },
    );
  }
}

serve(handleRequest);

export { handleRequest };
