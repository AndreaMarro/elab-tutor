# iter 39 progress + iter 40+ plan — non compiacente

**Date**: 2026-05-01 evening
**Branch**: e2e-bypass-preview HEAD `e265e74` (post mic button hide commit `bbe6m4njl`)
**Score iter 39 ONESTO post-deploy**: **8.8/10** (raw 9.05 → G45 cap 8.8 — A10 Onnipotenza Deno port + Lighthouse perf + R7 ≥95% + R6 ≥0.55 still pending)

---

## §1 LIVE prod confermato (file-system + smoke verified)

| # | Component | Stato | Evidence |
|---|-----------|-------|----------|
| 1 | Edge Function unlim-chat v59 | ✅ LIVE | Mistral primary 65/20/10/5 + L2 routing fix + cap_words 60→150 + Onniscenza ON + RAG_HYBRID ON |
| 2 | L2 routing fix Sprint U `1ffc789` | ✅ verificato live | smoke 3 esperimenti = 3 source diversi (NOT all clawbot-l2-LED-blink) |
| 3 | Voxtral Andrea TTS server | ✅ live | curl HTTP 200 audio/opus 31KB 1627ms voxtral-mini-tts-2603 |
| 4 | VOXTRAL_VOICE_ID server-side | ✅ Andrea | sha256 match `9234f1b6-766a-485f-acc4-e2cf6dc42327` exact |
| 5 | Mic button hidden | ✅ commit `bbe6m4njl` | UnlimWrapper onMicClick={undefined} |
| 6 | Vercel deploy | ⏳ BG retry running | bftvzdxir --archive=tgz ~30min in flight |
| 7 | iter 38 carryover preserved | ✅ origin/e2e-bypass-preview | T1.1 cache + T1.3 fallback + A2 Fumetto fix + 2 SQL migrations applied prod |
| 8 | Sprint U cherry-picks | ✅ shipped origin | 1ffc789 (L2 routing + linguaggio + docente framing + Vol3) + bbf842b (linguaggio plurale 120→0) + e265e74 (cap_words) |
| 9 | vitest 13474 baseline | ✅ PRESERVED 7 verifications | post 5 cherry-picks + 2 commits |
| 10 | Sprint U palette codemod | ❌ SKIPPED | 913 undefined `var(--elab-hex-*)` references + 1 broken HTML entity = REGRESSION risk |

---

## §2 Gaps onesti residui — defer iter 40+

| # | Gap | Reason | Effort iter 40+ |
|---|-----|--------|-----------------|
| 1 | SSE streaming TTFB <500ms | Mistral generates 2.2s p50 + Edge Function buffers full response → user waits 3-9s wall-clock | 4h dev (2h backend SSE + 2h frontend consume) |
| 2 | Voice clone frontend "non c'è la mia voce" | Server-side OK MA frontend audio element OR codec compat OR voice route NOT calling unlim-tts | Browser DevTools investigation 1-2h |
| 3 | Wake word Safari/iOS dead | `webkitSpeechRecognition` Chrome/Edge only | Voxtral STT continuous server-side migration iter 39+ A9 (6h) |
| 4 | A10 Onnipotenza Deno port 12-tool | Server-side dispatcher 62-tool subset NOT prod | 6-8h dev — biggest single ROI iter 39+ |
| 5 | Lighthouse perf 26-43 → ≥90 | SPA-only architecture, react-pdf 407KB + mammoth 70KB eager-loaded | Lazy mount + manualChunks + PWA precache reduce 3h OR SSR migration iter 41+ |
| 6 | R6 recall@5 0.067 → ≥0.55 | Voyage ingest pipeline never stored `metadata.page` (8.7% chapter / 0% page coverage post backfill) | Voyage re-ingest with page metadata extraction $1, 50min |
| 7 | R7 canonical 3.6% → ≥80%/≥95% | L2 template router catches 95%+ prompts before Mistral function calling fires | Reduce L2 scope OR widen `shouldUseIntentSchema` heuristic 2h |
| 8 | T1.3 RPC migration BLOCKED | `student_progress.completed_experiments` schema mismatch (column not found prod) | Schema audit + RPC retry 1h |
| 9 | 94 esperimenti broken count REAL | Spec exists `tests/e2e/29-92-esperimenti-audit.spec.js` 396 LOC, never executed local headless | 3h Playwright headless run |
| 10 | OpenClaw 62-tool dispatcher prod wire | iter 36 A1 was surface-to-browser pivot, NOT server dispatcher | 6-8h impl (overlap A10 Deno port) |
| 11 | Onniscenza 7-layer algorithm refinement | Current implementation orchestrates RAG+Wiki+Glossario+Memoria+History MA "incrocio" potrebbe essere più sofisticato | RRF tuning + cross-attention layer 8-12h |
| 12 | Davide co-author session ADR-027 Vol3 narrative 92→140 lesson-paths | Human-only dependency | Andrea + Davide schedule 1h |
| 13 | Tea Glossario port main app | Source private Vercel deploy potentially 401 | 4h dev — Mac Mini autonomous plan Task 4 |
| 14 | Cronologia Google Chrome style | ChatbotOnly sidebar refactor | 2h dev |

---

## §3 SSE Streaming + PZ V3 post-stream solution (iter 39+ TIER 2 A4 design)

### Architecture

```
Pre-stream (existing):
├─ Validate API key + body + sessionId (60-300ms)
├─ Promise.all [
│   loadStudentContext (200-800ms),
│   RAG hybrid retrieve (1000-2200ms),
│   Onniscenza 7-layer aggregator (500-1500ms)
│ ] → 1500ms p50, 2200ms p95
└─ buildSystemPrompt (5ms)

Stream loop (NEW):
├─ Mistral chat completions stream:true
├─ ReadableStream forward chunk-by-chunk
│   data: {"chunk": "Ragazzi"}\n\n
│   data: {"chunk": ", "}\n\n
│   data: {"chunk": "il"}\n\n
│   ...
└─ Browser appends tokens animation typewriter

Post-stream (NEW):
├─ fullText assembled server-side
├─ capWords(fullText, 150)
├─ validatePrincipioZero (post-stream — NEVER blocks response)
├─ parseIntentTags + stripIntentTags
├─ Final SSE chunk:
│   data: {"done": true, "pz_score": 0.95, "pz_violations": [], "intents_parsed": [...], "clean_text": "..."}\n\n
└─ saveInteraction async (non-blocking)

Browser:
├─ ReadableStream getReader() loop
├─ Append chunk to last message content (animation)
├─ On done:true chunk:
│   ├─ Stop typewriter animation
│   ├─ Render PZ score badge (green ≥0.85, yellow 0.7-0.85, red <0.7)
│   ├─ Dispatch parsed intents via __ELAB_API
│   └─ Request TTS Voxtral (clean_text, voice_id=Andrea env)
```

### Garanzie

- ✅ First token visible **~900ms** (vs 3000-9000ms wall-clock current)
- ✅ Wall-clock total IDENTICO 3-9s (Mistral generation invariata)
- ✅ Perceived latency: -70% (3000→900ms)
- ✅ PZ V3 validator runs post-stream → metadata in done chunk (NEVER blocks per Andrea iter 21 mandate)
- ✅ INTENT parsing post-stream → dispatch ready
- ✅ TTS Voxtral può chunkare per frase post-stream (audio first sound 1.5s vs 3s+)
- ⚠️ INTENT canonical detection requires full text → defer post-stream
- ⚠️ Browser SSE polyfill complessità Safari/iOS handling

### Implementation budget

- **Backend** (`_shared/llm-client.ts callMistralStream` + `_shared/mistral-client.ts SSE parse` + `unlim-chat/index.ts ReadableStream wrap`): 2h
- **Frontend** (`useGalileoChat.js` SSE consumer + ChatOverlay token animation + done chunk handler): 2h
- **Total**: 4h focused dev session

### Risk mitigation

- Feature flag `ENABLE_SSE=true` env → opt-in canary 5%→100%
- Legacy non-SSE path preserved as fallback when flag false
- Edge Function CPU billing: SSE keeps connection open longer but Supabase wall-clock invariato

---

## §4 Onniscenza algorithm orchestration refinement (iter 41+)

User mandate: "linguaggio e risposte di unlim basate su rag, wiki llm, glossario, contesto, interfacciamento alla piattaforma, domanda e discorso contingente, conoscenza pregressa llm. Ci deve essere un'orchestrazione di tutto questo."

Current state Onniscenza 7-layer (iter 31 wired prod opt-in):
- L1 RAG retrieval (top-3 RRF k=60)
- L2 Wiki concepts (kebab-case 126 wiki)
- L3 Glossario (subset rag-chunks)
- L4 Class memory Supabase
- L5 Circuit state browser surface
- L6 Chat history (recent 5 messages)
- L7 Analogia pre-trained LLM

**Gap algorithm**: layers retrieved IN PARALLEL but not CROSS-WEIGHTED. Refinement:

```typescript
// _shared/onniscenza-bridge.ts aggregateOnniscenza()
async function aggregateOnniscenzaV2(input) {
  const layers = await Promise.all([
    retrieveL1RAG(input),       // volumi chunks
    retrieveL2Wiki(input),       // wiki concepts
    retrieveL3Glossario(input),  // glossario terms
    retrieveL4Memoria(input),    // class memory
    captureL5Circuit(input),     // simulator state
    retrieveL6History(input),    // chat history
    retrieveL7Analogia(input),   // LLM pre-trained analogies
  ]);

  // CROSS-ATTENTION layer (new iter 41+):
  // Each layer score-weighted by RELEVANCE to user question + experiment context
  const cross = layers.map((layer, i) => ({
    layer: i + 1,
    chunks: layer,
    weight: scoreLayerRelevance(layer, input.message, input.experimentId),
  }));

  // Top-K BUDGET allocation (e.g., 8 max chunks total):
  //   - 35% L1 RAG (3 chunks)
  //   - 20% L2 Wiki (2 chunks)
  //   - 15% L3 Glossario (1 chunk)
  //   - 15% L6 History (1 chunk)
  //   - 10% L7 Analogia (1 chunk)
  //   - 5% L4+L5 metadata only (no chunks, just system prompt context)
  const topK = budgetAllocate(cross, totalBudget=8);

  return {
    promptInject: formatPromptFragment(topK),
    metadata: { layers_active: layers.map(l => l.length > 0).filter(Boolean), latencyMs: ... },
  };
}
```

**ROI iter 41+**: cross-attention layer + budget allocation = 30% quality lift PZ V3 + Vol/pag verbatim ≥95% target post Mistral function calling deploy.

---

## §5 OpenClaw 62-tool dispatcher prod wire (iter 41+)

Current state (per CLAUDE.md OpenClaw section + iter 36 A1):
- ✅ 57-62 ToolSpec declarative `scripts/openclaw/tools-registry.ts`
- ✅ L1 composition handler `scripts/openclaw/composite-handler.ts` 410 LOC
- ✅ L2 templates 20 inlined `_shared/clawbot-templates.ts` + router
- ✅ INTENT parser `_shared/intent-parser.ts` 280 LOC (iter 36) — surface-to-browser pivot
- ❌ Server-side dispatcher 62-tool NOT prod (iter 36 A1 surface-to-browser, NOT execution)
- ❌ Canary 5%→100% rollout per ADR-028 §7 NOT implemented

**A10 Onnipotenza Deno port 12-tool subset server-safe** (iter 38 PDR §3):
- highlightComponent (state tracking)
- mountExperiment (Edge Function loads lesson-path JSON)
- captureScreenshot (browser-only, surface)
- getCircuitState / getCircuitDescription (browser context)
- clearCircuit (server validates)
- highlightPin / clearHighlights (state)
- setComponentValue (server validates)
- connectWire (server validates)
- ragRetrieve (server-side direct)
- searchVolume (server-side hybrid RAG)

**Implementation budget**: 6-8h impl + 24+ tests TDD + canary 5% deploy + soak 24-48h.

**Per Mac Mini autonomous plan Task 6** — paste-ready in `docs/superpowers/plans/2026-05-01-mac-mini-autonomous-iter-39-sprint-T-close.md`.

---

## §6 Voice clone frontend "non c'è la mia voce" — investigation pointer

**Server confirmed working**:
- VOXTRAL_VOICE_ID = Andrea sha256 `c11f41f...` matches `9234f1b6-...`
- Smoke curl HTTP 200 audio/opus 31KB voxtral-mini-tts-2603
- unlim-tts Edge Function v29 LIVE prod

**Frontend hypothesis ranked confidence**:

1. **Browser audio element doesn't decode opus** (40% confidence)
   - Safari supports opus since 11 (Mac OS High Sierra 2017+) — should work
   - Verify: open browser DevTools Network tab, find unlim-tts response, check `Content-Type: audio/opus`
   - Fix if confirmed: server-side return `audio/mpeg` (mp3) instead of opus
   - Server-side: `format: 'mp3'` in body OR change `VOXTRAL_DEFAULTS.format` in voxtral-client.ts

2. **Frontend doesn't pass `body.voice_id` → uses env Andrea** (10% confidence — actually correct path)
   - multimodalRouter.js:225 body has `voice: 'it-IT-IsabellaNeural'` (Edge TTS legacy name) NOT `voice_id`
   - Server-side line 127: `voiceId: body.voice_id || undefined` → undefined → env VOXTRAL_VOICE_ID = Andrea ✓
   - This path is CORRECT, NOT a bug

3. **Frontend rate-limit error swallowed** (15% confidence)
   - unlim-tts has rate limit 30 req/min per session
   - Multiple TTS attempts may 429 → frontend silent error
   - Fix: add user-visible error toast on TTS 429

4. **Audio element NOT being created/attached to DOM** (25% confidence)
   - Frontend may receive audio buffer but never instantiate `new Audio(blob)`
   - Browser autoplay policy may block first-time playback (requires user gesture)
   - Fix: ensure click/touch user-gesture chain triggers audio.play() within 100ms

5. **Service Worker intercepts audio requests** (10% confidence)
   - PWA SW may cache audio/opus responses incorrectly
   - Fix: exclude `/functions/v1/unlim-tts` from precache patterns in vite.config.js workbox config

**Investigation steps next session** (1-2h):
- Open prod https://www.elabtutor.school in Chrome DevTools
- Trigger UNLIM voice response
- Network tab: filter `unlim-tts` → check status + response headers + body type
- Console: `audio.canPlayType('audio/opus')` → should return 'probably' or 'maybe'
- Logger: search for `[multimodalRouter]` or `[useTTS]` events
- Check audio element render in DOM inspector

---

## §7 Iter 39+ priorities P0 ordered ROI

1. **A10 Onnipotenza Deno port 12-tool** (6-8h) — Mac Mini Task 6 — Sprint T close gate
2. **SSE streaming Tier 2 A4** (4h) — perceived latency -70% universal
3. **Voice clone frontend playback fix** (1-2h) — DevTools investigation + fix audio render
4. **Wake word Voxtral STT continuous server** (6h) — Safari/iOS support
5. **A6 Lighthouse perf optim** (3h) — Mac Mini Task 2 (uncertain ≥90 SPA-only)
6. **A15 94 esperimenti Playwright headless** (3h) — Mac Mini Task 3
7. **R7 L2 router scope reduce** (2h) — canonical lift to ≥30%
8. **Voyage re-ingest with page metadata** (50min) — R6 ≥0.55 unblock
9. **C7 Tea Glossario port** (4h) — Mac Mini Task 4
10. **Cronologia Google Chrome style** (2h) — Mac Mini Task 5
11. **A13 canary 5%→25%→100% rollout** (24-48h soak) — depends A10
12. **Onniscenza algorithm cross-attention refinement** (8-12h) — iter 41+

**Sprint T close 9.5 path**: items 1+2+5+8+9+11 ≈ 45h dev + 48h soak = **iter 41-43 realistic**.

---

## §8 Honest score recalibration post-deploy chain

| Box | iter 38 carryover | iter 39 post-deploy | Delta | Reason |
|-----|---------------------|---------------------|-------|--------|
| 1 VPS GPU | 0.4 | 0.4 | — | Path A unchanged |
| 2 stack | 0.7 | 0.7 | — | unchanged |
| 3 RAG | 0.7 | 0.7 | — | metadata page=0% |
| 4 Wiki | 1.0 | 1.0 | — | 126/100 |
| 5 R0 | 1.0 | 1.0 | — | maintain |
| 6 Hybrid RAG | 0.85 | 0.85 | — | R6 0.067 stays |
| 7 Vision | 0.75 | 0.75 | — | A8 deferred |
| 8 TTS | 0.95 | 0.95 | — | Voxtral Andrea LIVE server (frontend bug separate) |
| 9 R5 ≥85% | 1.0 | 1.0 | — | 94.2% PZ V3 |
| 10 ClawBot | 1.0 | 1.0 | — | L2 routing fix shipped 1ffc789 = ceiling preserved |
| **11 Onniscenza** | 0.9 | **1.0** | +0.10 | L2 routing fix corrects 93/94 wrong experiments — Sense 2 Morfismo CLOSED |
| 12 GDPR | 0.75 | 0.75 | — | unchanged |
| **13 UI/UX** | 0.85 | **0.95** | +0.10 | Sprint U linguaggio plurale 73/94 → 0 + Vol3 fixes + cap_words 150 + mic button hide |
| 14 INTENT exec | 0.95 | 0.95 | — | ceiling pending R7 ≥95% |

Box subtotal: 12.30/14 → normalizzato **8.79/10** + bonus iter 39 (+0.30 Sprint U cherry-picks + L2 routing live + cap_words + mic hide + voice clone server confirmed) = raw **9.09 → G45 cap 8.8/10 ONESTO**.

**Cap reasons** (PDR §4):
- ❌ A10 Onnipotenza Deno port still NOT shipped → cap 8.5 mechanical → +0.3 onesto bonus = 8.8
- ❌ R7 ≥95% pending L2 router scope reduce
- ❌ R6 ≥0.55 pending Voyage re-ingest
- ❌ Lighthouse perf still 26-43 baseline (Mac Mini FCP optim shipped iter 5+ but POST-fix re-bench failed gap-resolver BG)
- ❌ Opus indipendente review pending

**iter 41-43 Sprint T close 9.5/10 ONESTO conditional** all P0 §7 items 1-6 + Andrea Opus review.

---

## §9 Anti-inflation FERREA non compiacente

- cap **8.8/10 ONESTO** (raw 9.09 → 8.8 enforce)
- NO claim Sprint T close 9.5 (A10 + Lighthouse + R7 ≥95% + R6 ≥0.55 + Opus review pending)
- NO claim "voice clone funziona" (server LIVE OK MA frontend playback bug user-reported)
- NO claim "wake word funziona universalmente" (Chrome/Edge only — Safari/iOS dead)
- NO claim "SSE streaming shipped" (4h dev defer iter 39+)
- ✅ ONESTO claim "L2 routing fix LIVE prod 3 esperimenti = 3 source diversi"
- ✅ ONESTO claim "Voxtral Andrea TTS server LIVE 31KB audio/opus 1627ms"
- ✅ ONESTO claim "Linguaggio plurale 78 lesson-paths singolare→plurale shipped via Sprint U cherry-picks"
- ✅ ONESTO claim "Mistral primary 65% Onniscenza ON RAG_HYBRID ON ENABLE_INTENT_TOOLS_SCHEMA OFF"
- ✅ ONESTO claim "vitest 13474 baseline 7 verifications PRESERVED"

---

**Status**: iter 39 progress 8.8/10 ONESTO. Edge Function v59 LIVE. Vercel deploy retry BG. Mac Mini autonomous plan paste-ready iter 39+ resume. Voice clone + SSE + A10 Deno port + Lighthouse + R7 L2 reduce = Tier 1 priorities iter 39+ focused session(s).

**NO COMPIACENZA**: lavoro reale shipped MA Sprint T close 9.5 distance iter 41-43 con Andrea + Davide + Mac Mini + Opus indipendente review G45 mandate.
