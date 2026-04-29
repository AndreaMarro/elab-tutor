/**
 * unlim-vision — Edge Function (Sprint T iter 25)
 *
 * Vision-language analysis via Mistral Pixtral 12B (FR EU GDPR).
 * Used for analyzing kit photos, breadboard verification, circuit diagnostics.
 *
 * POST /unlim-vision
 * Body: { prompt: string, images: string[] (base64 or URL), sessionId: string }
 * Returns: { success: true, response: string, model: 'pixtral-12b-2409' }
 *
 * (c) Andrea Marro — 2026-04-29
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { getCorsHeaders, getSecurityHeaders, checkBodySize, BODY_SIZE_MULTIMODAL } from '../_shared/guards.ts';
import { callMistralChat } from '../_shared/mistral-client.ts';

interface VisionRequest {
  prompt: string;
  images: string[]; // base64 data URI OR https URL
  sessionId: string;
}

const SYSTEM_PROMPT = `Sei UNLIM, tutor visivo ELAB Tutor Italian K-12 8-14yo. Analizzi foto del kit fisico (breadboard, componenti, circuito Arduino).

REGOLE:
- INIZIA risposta con "Ragazzi,"
- Massimo 60 parole
- Identifica componenti visibili (LED, resistore, breadboard, fili colore, batteria)
- Diagnosi se circuito errato (LED contrario, fili sbagliati, breadboard mal collegata)
- Linguaggio 10-14 anni, analogie quotidiano
- Cita kit fisico, NON simulatore`;

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: getCorsHeaders(req) });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405, headers: getSecurityHeaders(req),
    });
  }

  const bodyCheck = checkBodySize(req, BODY_SIZE_MULTIMODAL);
  if (bodyCheck) return bodyCheck;

  try {
    const body: VisionRequest = await req.json();

    if (!body.prompt || !body.images || !Array.isArray(body.images) || body.images.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'prompt + images[] required' }), {
        status: 400, headers: getSecurityHeaders(req),
      });
    }

    if (!body.sessionId) {
      return new Response(JSON.stringify({ success: false, error: 'sessionId required' }), {
        status: 400, headers: getSecurityHeaders(req),
      });
    }

    if (body.images.length > 4) {
      return new Response(JSON.stringify({ success: false, error: 'max 4 images per request' }), {
        status: 400, headers: getSecurityHeaders(req),
      });
    }

    const images = body.images.map((src) => ({ source: src }));

    const result = await callMistralChat({
      model: 'pixtral-12b-2409',
      systemPrompt: SYSTEM_PROMPT,
      message: body.prompt.slice(0, 1000),
      images,
      maxOutputTokens: 200,
      temperature: 0.3,
    });

    return new Response(JSON.stringify({
      success: true,
      response: result.text,
      model: 'pixtral-12b-2409',
      provider: 'mistral-eu',
      latencyMs: result.latencyMs,
    }), {
      status: 200, headers: getSecurityHeaders(req),
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    console.error(JSON.stringify({
      level: 'error', event: 'unlim_vision_error', error: msg,
      timestamp: new Date().toISOString(),
    }));
    return new Response(JSON.stringify({
      success: false, error: 'Vision analysis failed', details: msg.slice(0, 200),
    }), {
      status: 500, headers: getSecurityHeaders(req),
    });
  }
});
