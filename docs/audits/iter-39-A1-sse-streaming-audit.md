# Iter 39 A1 — SSE Streaming Mistral Chat — Audit

**Date**: 2026-05-01 PM
**Atom**: A1 (Mission file `automa/ralph-loop-mission-iter-39.md`)
**Goal**: TTFB perceived <500ms via Mistral La Plateforme `chat/completions` SSE.
**Status**: BACKEND + API.JS HELPER SHIPPED · USEGALILEOCHAT WIRE-UP DEFERRED iter 40+
**Score impact projected**: +0.3 ONESTO conditional Edge deploy v60+ + canary 5%→100%

## Files shipped

### Backend (Deno Edge Function)
- `supabase/functions/_shared/mistral-client.ts` — `callMistralChatStream` ALREADY shipped commit `18da487` (iter 39 backend). Returns `ReadableStream<MistralStreamChunk>` parsing Mistral `data: {...}\n\n` SSE chunks with `delta.content` extraction + final `done:true` metadata chunk.
- `supabase/functions/unlim-chat/index.ts` — NEW SSE branch (~110 LOC) inserted line ~580 BEFORE existing `callLLM` block:
  - Gates: `body.stream === true` + `ENABLE_SSE=true` env + `!useIntentSchema` + `!hasImages`
  - Tee Mistral stream → SSE bytes for client + accumulate `fullText` for post-stream cleanup
  - Post-stream: `capWords(fullText)` + `parseIntentTags` + `stripIntentTags` → final SSE chunk `data: {done:true, clean_text, intents_parsed, latency_ms, model, source, full_text}\n\n`
  - Cache write-through `storeCache(...)` non-blocking with `onniTopK` (correct variable, not pre-existing `classification?.topK` typo)
  - `saveInteraction` non-blocking memory log
  - Defensive try/catch fall-through to existing callLLM flow on stream init failure
  - Headers: `Content-Type: text/event-stream; charset=utf-8` + `Cache-Control: no-cache, no-transform` + `X-Accel-Buffering: no` + `Connection: keep-alive`

### Frontend (browser)
- `src/services/api.js` — NEW `chatWithAIStream(message, ..., {onToken, onDone, onError})` ~110 LOC:
  - Accept: `text/event-stream` request header
  - SSE Reader loop with TextDecoder + line buffer
  - `onToken(text, fullText)` per token (typewriter accumulation hook for caller)
  - `onDone(meta)` with `{clean_text, intents_parsed, latency_ms, model, source}` final chunk
  - `onError(error, detail)` defensive surface
  - Returns `tryNanobot`-compatible `{success, response, intentsParsed, source, stream:true, latencyMs}` on success
  - Returns `null` if Content-Type ≠ `text/event-stream` → caller falls back to non-stream `tryNanobot`
  - AbortSignal + timeout + externalSignal abort handler

### Frontend wire-up (DEFERRED iter 40+)
- `src/components/lavagna/useGalileoChat.js` — NOT MODIFIED iter 39
- Reason: 914 LOC component with complex sendMessage flow + multi-fallback chain (tryNanobot → backend webhook → render fallback). Touching it without test coverage risk regression.
- iter 40 plan: feature-flag `VITE_ENABLE_SSE=true` opt-in path → call `chatWithAIStream` first, fallback to existing `tryNanobot` on null return.
- ChatOverlay typewriter animation: deferred (pure UX polish, no functional gap).

## Testing

- vitest 13474 PASS baseline preserved (no test changes iter 39 A1).
- Build PASS 3m22s.
- E2E smoke prod canary: BLOCKED on Andrea ratify `ENABLE_SSE=true` env on Supabase Edge.

## Acceptance criteria iter 39 A1

- ✅ Backend SSE branch shipped + defensive fall-through
- ✅ `callMistralChatStream` Mistral SSE parsing complete (commit 18da487)
- ✅ Frontend api.js SSE reader exposed
- ❌ `useGalileoChat.sendMessage` opt-in wire-up (DEFERRED iter 40+)
- ❌ ChatOverlay typewriter animation (DEFERRED iter 40+ pure UX)
- ❌ Edge Function v60 deploy with `ENABLE_SSE=true` (Andrea ratify gate)
- ❌ Canary 5% → 25% → 100% rollout per ADR-029 §7
- ❌ R5 latency lift verified post-deploy (target p95 <2000ms perceived, full TTFB stays ≥3000ms wall-clock)

## Honest gaps

1. SSE branch NOT EXECUTED in production yet — `ENABLE_SSE` env defaults `false`, branch dormant.
2. PZ V3 score not computed inside SSE branch (cost: 200ms + LLM call) — defer iter 40+ post-canary OR move to async fire-and-forget telemetry.
3. Mistral function calling (useIntentSchema=true) explicitly DISABLES SSE branch — incompatible with `response_format: json_schema` per ADR-030. Action prompts use legacy non-stream flow.
4. Vision (`hasImages`) explicitly DISABLES SSE — Pixtral SSE not benchmarked yet.
5. Post-stream cache write-through happens AFTER client received [DONE] sentinel — telemetry only, no perceived latency hit.
6. Frontend reader does NOT yet wire `onToken` to UI state — caller burden iter 40+.

## Score iter 39 A1 ONESTO

**0.5/1.0 atom completion**:
- Backend: 1.0 ✓
- Frontend api.js helper: 1.0 ✓
- useGalileoChat wire-up: 0.0 (deferred)
- Edge deploy + canary: 0.0 (Andrea ratify gate)
- E2E smoke verified prod: 0.0 (deploy gate)

**Box impact**: +0.05 Box 5 (R0 quality preserved, latency lift potential pending deploy).

## Iter 40+ next steps

1. Andrea: `npx supabase secrets set ENABLE_SSE=true` (canary 5% via separate `CANARY_PERCENT_SSE` env)
2. Edge Function deploy `npx supabase functions deploy unlim-chat`
3. Smoke test prod: curl `POST /functions/v1/unlim-chat` body `{stream:true, message:"...", sessionId:"..."}` Accept: text/event-stream
4. useGalileoChat sendMessage opt-in flag: `if (import.meta.env.VITE_ENABLE_SSE === 'true') { result = await chatWithAIStream(...); if (!result) result = await tryNanobot(...); }`
5. ChatOverlay typewriter: append `setLastMessage(msg => ({...msg, text: fullText}))` per token (React 18 batched re-render OK)
6. R5 50-prompt bench post-deploy → measure perceived first-token latency vs current ~2200ms p50

Andrea Marro — iter 39 ralph A1 — 2026-05-01
