# Ralph Loop Mission — iter 39 5 NOT shipped + max quality

**Activated**: 2026-05-01 evening
**Stop condition**: 5/5 atoms shipped LIVE prod + smoke verified + audit doc + Andrea Opus indipendente review G45

## Atoms

### A1. SSE Streaming Mistral chat (TTFB perceived less than 500ms)

**Backend**:
- `supabase/functions/_shared/llm-client.ts`: add `callMistralStream(options)` returns ReadableStream
- `supabase/functions/_shared/mistral-client.ts`: parse SSE chunks `data: {...}\n\n` with delta.content extraction
- `supabase/functions/unlim-chat/index.ts`: when `stream: true` body flag, forward Mistral stream to client + post-stream final chunk with PZ V3 score + parsed intents + clean_text

**Frontend**:
- `src/components/lavagna/useGalileoChat.js`: replace `fetch().then(json)` with `fetch().then(reader)` + SSE parser loop
- ChatOverlay: typewriter animation appending tokens
- Done chunk handler: PZ score badge + intents dispatch via `__ELAB_API` + TTS request clean_text

**Trade-offs**:
- Perceived TTFB 900ms (vs 3000ms current) = -70%
- Wall-clock total identical 3-9s
- PZ V3 + INTENT post-stream metadata in final SSE chunk (NEVER blocks response per Andrea iter 21 mandate)

**ENV flag**: `ENABLE_SSE=true` opt-in canary 5% then 25% then 100%

### A2. Voice clone frontend bug fix

**Server confirmed working**: curl smoke HTTP 200 audio/opus 31KB voxtral-mini-tts-2603 sha256 voice_id match `9234f1b6-766a-485f-acc4-e2cf6dc42327`.

**Frontend hypotheses ranked**:
1. Browser audio element doesn't decode opus (Safari edge case) — fix: server returns mp3 instead via `format: 'mp3'` body param (already pushed `8ffb728`)
2. Frontend doesn't pass `voice_id` body — fix in `8ffb728` commit
3. Rate limit 429 swallowed silent — fix add user-visible toast
4. Audio element NOT attached DOM OR autoplay policy block — investigate
5. Service Worker intercepts audio requests — exclude `/functions/v1/unlim-tts` from precache

**Investigation steps**:
- Open https://www.elabtutor.school in Chrome DevTools
- Trigger UNLIM voice response
- Network tab: filter `unlim-tts` check status + response headers + body type
- Console: `audio.canPlayType('audio/mpeg')`
- Search `[multimodalRouter]` or `[useTTS]` events
- DOM inspector: audio element render + src attribute

**Implementation**:
- Verify `8ffb728` commit deployed prod (Vercel re-deploy needed)
- Add error toast on TTS 429
- Add fallback `audio.canPlayType()` check + base64 data URL fallback

### A3. OpenClaw 62-tool dispatcher prod wire

**Goal**: server-side Deno port 12-tool subset per ADR-028 §7.

**12-tool subset** (server-safe, no browser DOM dep):
1. highlightComponent (state tracking, browser renders)
2. mountExperiment (Edge Function loads lesson-path JSON)
3. captureScreenshot (browser-only, surface)
4. getCircuitState (browser context, surface)
5. getCircuitDescription (browser context)
6. clearCircuit (server validates)
7. highlightPin (state tracking)
8. clearHighlights (state tracking)
9. setComponentValue (server validates)
10. connectWire (server validates)
11. ragRetrieve (server-side direct returns chunks)
12. searchVolume (server-side hybrid RAG)

**Files**:
- NEW `supabase/functions/_shared/clawbot-dispatcher-deno.ts` (~600 LOC)
- NEW `supabase/functions/_shared/clawbot-dispatcher-deno.test.ts` (24+ tests TDD)
- Modify `supabase/functions/unlim-chat/index.ts`: post-LLM `useServerDispatch = canaryPercent > 0 && hashBucket(sessionId, canaryPercent)` branch
- NEW `docs/adrs/ADR-032-onnipotenza-deno-12-tool-server-safe.md` (~400 LOC)

**Canary rollout**:
- Stage 1: `CANARY_DENO_DISPATCH_PERCENT=5` (4-8h soak)
- Stage 2: 25% (4-8h soak post telemetry verify)
- Stage 3: 100% (24-48h final soak)

### A4. Onniscenza 7-layer algorithm refinement

**Current state** (iter 31 prod opt-in `ENABLE_ONNISCENZA=true`):
- L1 RAG retrieval top-3 RRF k=60
- L2 Wiki concepts kebab-case 126
- L3 Glossario rag-chunks subset
- L4 Class memory Supabase
- L5 Circuit state browser surface
- L6 Chat history recent 5 messages
- L7 Analogia pre-trained LLM

**Refinement V2** (`_shared/onniscenza-bridge.ts aggregateOnniscenzaV2`):
- Cross-attention scoring per layer (relevance to user message + experimentId)
- Budget allocation 8 chunks total:
  - 35% L1 RAG (3 chunks)
  - 20% L2 Wiki (2 chunks)
  - 15% L3 Glossario (1 chunk)
  - 15% L6 History (1 chunk)
  - 10% L7 Analogia (1 chunk)
  - 5% L4+L5 metadata only (system prompt context)
- RRF k=60 tuning per layer-specific relevance weights

**Acceptance**: R5 PZ V3 score lift +5pp + Vol/pag verbatim ≥95% post Mistral function calling re-deploy.

### A5. Wake word Safari iOS fallback Voxtral STT continuous

**Current**: `webkitSpeechRecognition` Chrome/Edge only. Safari/iOS dead.

**Fix**: Voxtral STT continuous server-side migration per ADR-031.

**Files**:
- NEW `supabase/functions/_shared/voxtral-stt-client.ts` (~250 LOC, Mistral REST `https://api.mistral.ai/v1/audio/transcriptions`)
- Modify `supabase/functions/unlim-stt/index.ts`: Voxtral primary + CF Whisper fallback (gradual migration safety)
- Frontend `src/services/wakeWord.js`: detect Safari/iOS + fallback to MediaRecorder + Voxtral STT continuous

**Acceptance**: Tester-4 9-cell matrix Voxtral primary 9/9 PASS + latency <500ms (vs CF Whisper 1071-2200ms).

## Mandates

- VELOCITÀ UNLIM (perceived <500ms first token via SSE A1)
- Contesto ELAB iniettato sempre al meglio (Onniscenza 7-layer A4 + Capitolo loader + circuit_state)
- CoV periodici (vitest 13474+ NEVER scendere, build PASS)
- /audit + /quality-audit periodici ogni completion atom
- Deploy periodici (Edge Function unlim-chat + Vercel www.elabtutor.school)
- /systematic-debugging fine ogni obiettivo
- Plugin: Vercel MCP + Supabase CLI + Playwright MCP + Claude in Chrome + claude-mem + WebSearch/WebFetch
- Mac Mini connettori SSH `progettibelli@100.124.198.59` (HALT signal pendente — verify prima di delegate)
- NO compiacenza onestà massima
- Anti-regressione vitest 13474+ FERREA, NO --no-verify, NO push main
- G45 anti-inflation cap NEVER claim non verificato

## Stop conditions

1. 5/5 atoms shipped LIVE prod (Edge Function v60+ + Vercel deploy verified)
2. Smoke verify ogni atom (curl + Playwright)
3. Audit doc per atom (docs/audits/iter-39-{atom}-audit.md)
4. Cumulative session audit close (docs/audits/iter-39-ralph-loop-CLOSE.md)
5. Andrea Opus indipendente review G45 mandate met (separate session)

## Path realistico

24-48h wall-clock work iter 39+. Ralph loop continua finché stop condition met. Andrea verifica periodically via heartbeat `automa/state/heartbeat`.

## Dependencies

- Production rollback `fv22ymvq8` stable (palette regression issue separate)
- Mac Mini HALT pending verifica
- main branch HEAD post PR #57 merge HAS palette regressions 913 undefined `--elab-hex-*` vars (DO NOT deploy main without revert OR fix)
- Sprint U cherry-picks safe on `e2e-bypass-preview` HEAD `8ffb728` ready re-deploy quando palette risolto

## Score iter 39 target progression

- Pre-ralph 8.0/10 ONESTO (post-rollback)
- A1 SSE LIVE → +0.3 (perceived UX -70%)
- A2 Voice fix LIVE → +0.2 (Andrea voice clone playback)
- A3 OpenClaw 12-tool LIVE canary 5% → +0.1 (Onnipotenza partial)
- A3 canary 100% post-soak → +0.1 (Onnipotenza full)
- A4 Onniscenza V2 → +0.2 (cross-attention quality lift)
- A5 STT Voxtral migration → +0.1 (Safari/iOS support)
- Total projected: 8.0 → 9.0/10 ONESTO conditional all atoms shipped + Opus review

Sprint T close 9.5 path: iter 41-43 con A10 + Lighthouse + R6 ≥0.55 + Davide ADR-027 + Opus review G45.
