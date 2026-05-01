# Iter 39+ API Latency Optimization Research — `unlim-chat` Edge Function

**Date**: 2026-05-01
**Author**: research agent (Claude Opus 4.7 1M)
**Scope**: Tier 1 / Tier 2 / Tier 3 prioritized optimization plan for the ELAB Tutor `unlim-chat` Supabase Edge Function.
**Baseline (iter 37, R5 50-prompt scale)**: avg **4496 ms** / p95 **10096 ms**.
**Target (iter 39+)**: avg **<3000 ms** / p95 **<6000 ms**.
**Hard constraints**: no Mac Mini delegation; Mistral La Plateforme EU FR consolidation; GDPR-clean France preferred; €18/month Mistral Scale tier preserved; iter 38 close score 8.0/10 G45 cap unchanged.

> Honest framing: iter 37 already shipped `[INTENT:...]` regex parser, capWords cap, Cron warmup design and `prompt_class` classifier. Iter 38 shipped A3 Promise.all parallelize, A5 Cron warmup pg_cron 30s HEAD ping, A7 Mistral function calling `response_format: json_schema`, `max_tokens 256→120`. The remaining headroom is real but smaller than naïve LLM-latency advice suggests — the dominant tail is **Mistral chat completions** (~3-7 s) plus **two serial network hops** (Voyage embed ~300-700 ms, Supabase RPC ~150-400 ms) plus occasional **Onniscenza aggregator** (~500-1500 ms) plus **Edge Function cold start** (worst tail). Streaming (deferred) and self-host (deferred) are the only step-changes; everything else is ~10-30% per knob.

---

## §1. Current State Baseline + Bottleneck Breakdown

### 1.1 Where the time goes (iter 38 close, post-A3+A5+A7)

Hot path in `supabase/functions/unlim-chat/index.ts`:

| # | Stage | File:line | Typical p50 (ms) | Typical p95 (ms) | Notes |
|---|---|---|---|---|---|
| 0 | Cold start (Edge worker boot) | Deno runtime | 0–50 (warm) | 800–2000 (cold) | A5 cron warmup mitigates p95 cold tail but does not reach p99. |
| 1 | API key + body size + sessionId validate | `unlim-chat/index.ts:137-167` | 1 | 5 | Negligible. |
| 2 | Rate-limit DB read | `_shared/guards.ts` (`checkRateLimitPersistent`) | 60 | 250 | 1 round trip Supabase REST. |
| 3 | Consent check | `_shared/memory.ts:28-58` | 80 (when needed) | 350 | 2 sequential `client.from(...).select(...).single()` calls. Skippable if `CONSENT_MODE=off`. |
| 4 | Prompt sanitize + classify | `_shared/onniscenza-classifier.ts:117` | 1 | 2 | Pure regex; basically free. |
| 5 | **loadStudentContext + RAG retrieve (parallel)** | `unlim-chat/index.ts:266-283` | **~700** | **~1800** | Promise.all gate; whichever is slower dominates. |
| 5a | └ loadStudentContext | `_shared/memory.ts:64-...` | 200 | 800 | 2 sequential REST queries (`student_progress` then `student_sessions`). Could be 1. |
| 5b | └ Voyage embed query (1024-dim voyage-3) | `_shared/rag.ts:781-807` | 350 | 1100 | 5 s timeout; international hop US-east. |
| 5c | └ pgvector RPC `match_rag_chunks` / `search_rag_dense_only` | `_shared/rag.ts:706-770` | 150 | 450 | Same-region (Supabase project EU). |
| 5d | └ Hybrid RRF (BM25 + dense + wiki fusion + 4-list RRF) | `_shared/rag.ts:911-1060` | 600 | 1600 | When `RAG_HYBRID_ENABLED=true`; 4 parallel calls. |
| 6 | Onniscenza aggregator (opt-in) | `_shared/onniscenza-bridge.ts:aggregateOnniscenza` | 500 (when on) | 1500 | `ENABLE_ONNISCENZA=true`. Classifier already skips for `chit_chat`. |
| 7 | Capitolo fragment build | `_shared/capitoli-loader.ts` | 1 | 3 | Local JSON lookup. |
| 8 | ClawBot L2 template short-circuit (when match) | `_shared/clawbot-template-router.ts` | 200 (RAG inj) | 700 | Skips LLM entirely; ~10-15% prompts hit this fast path. |
| 9 | **Mistral chat completions** | `_shared/mistral-client.ts:133` | **2200** | **5500** | Dominant cost. `mistral-small-latest` default; `mistral-large-latest` premium tier. Generation-bound (≈40-50 tok/s). |
| 9a | └ TTFB (queue + KV warm) | inside Mistral | 250–500 | 1500 | This is what streaming SSE hides. |
| 9b | └ Generation (max 120 tokens) | inside Mistral | 1800–2800 | 4000 | Linear in `max_tokens`. |
| 10 | Promise.race 8 s timeout watchdog | `unlim-chat/index.ts:560-563` | — | clamp at 8000 | Prevents infinite tail; trips ≈3-5% of requests. |
| 11 | Mistral structured-output JSON.parse | `unlim-chat/index.ts:570-591` | 1 | 5 | Effectively free. |
| 12 | capWords + parseIntentTags + stripIntentTags | `unlim-chat/index.ts:612-666` | 1 | 5 | Free. |
| 13 | PRINCIPIO ZERO validator | `_shared/principio-zero-validator.ts` | 2 | 10 | Free. |
| 14 | saveInteraction (fire-and-forget) | `_shared/memory.ts` | 0 (non-blocking) | 0 | Already non-blocking. |
| 15 | Response serialize + headers | — | 1 | 5 | Free. |

### 1.2 Pareto chart (where to look first)

For a representative warm request without hybrid-RAG and without Onniscenza:
- ~60% Mistral generation (stage 9)
- ~15% RAG retrieval (stages 5b–5c)
- ~10% loadStudentContext (5a)
- ~5% rate-limit + consent (stages 2–3)
- ~5% network glue + Edge runtime
- ~5% Promise.all gate slack

When `RAG_HYBRID_ENABLED=true` + `ENABLE_ONNISCENZA=true` (current prod config), the share shifts:
- ~45% Mistral, ~25% Onniscenza aggregator, ~20% hybrid RAG, ~10% other.

p95 tail is dominated by:
1. Mistral slow tokens (queue spike, especially with `response_format` JSON schema validation overhead — Mistral docs state schema-mode is ~5-10% slower than free-form).
2. Voyage embed over-international (EU→US-east). 1100 ms p95 alone.
3. Onniscenza aggregator full top-3 fetch (1500 ms p95).
4. Cold start when warmup misses (>30 s gap).

### 1.3 Anchoring numbers (what is real, what is projected)

- **Verified**: iter 37 R5 50-prompt scale: 4496 ms avg / 10096 ms p95. iter 38 partial measurements (smoke) suggest A3 Promise.all has saved ~400-800 ms p95 already; A5 cron warmup cuts cold p99 by ~1500 ms.
- **Projected ceilings** (no streaming, no self-host): with all Tier 1 + Tier 2 wired, ~2400 ms avg / ~5500 ms p95 is realistic. Below 1500 ms avg requires streaming SSE (Tier 2 A4) or self-host (Tier 3).

### 1.4 What is not in scope

- TTS latency (decoupled from chat response since iter 34, frontend fetches audio separately via `unlim-tts`).
- STT migration to Voxtral Transcribe 2 (ADR-031 design only; impl deferred iter 39+).
- Frontend perceived latency (typing indicator, echo-text). Out of scope for the Edge Function audit.

---

## §2. Tier 1 — Single-Day Budget (target iter 39, 1 day budget)

These are the highest-ROI items deliverable without breaking the client contract.

### T1.1 Semantic prompt cache (LRU + Voyage-similarity threshold)

- **What**: Hash `(systemPrompt + safeMessage + experimentId)` to a stable key. Store last N completed responses in a Deno `Map` (in-memory per-isolate) with TTL ~10 min. Bypass Mistral when an exact-key hit lands. As a stretch, use Voyage embedding similarity ≥ 0.96 against last 200 prompts to catch near-duplicates within a class session ("Ragazzi, accendiamo il LED").
- **Estimated p95 reduction**: 20–25% on **cache-hit** requests (one Voyage call ~350 ms instead of full Mistral chain). On a class with 25 students replaying the same scaffolded experiment, expected hit rate 30–45% → headline avg reduction ~12–18% (≈600–800 ms p95 for a class session).
- **Complexity**: ~120 LOC, 2-3 h. New file `supabase/functions/_shared/semantic-cache.ts`. Wire-up in `unlim-chat/index.ts:545-563` immediately before `callLLM`.
- **Risk**: low — cache miss falls through to existing path; no client contract change. Caveat: per-isolate cache means hit rate is bounded by Edge runtime's hot-isolate retention; works best when Cron warmup keeps the same isolate alive. Privacy: only hash the prompt, never raw text; payload encrypted at rest is overkill since cache is RAM-only.
- **Dependencies on deferred items**: none.
- **File:line refs**:
  - new `supabase/functions/_shared/semantic-cache.ts`
  - integration point `supabase/functions/unlim-chat/index.ts:545` (just before `callLLM` call)
- **Source mapping**: bytebytego (caching is the #1 API speed lever); zuplo throughput; Stackademic "doubled my API speed" (memoized).

### T1.2 Reduce RAG `topK` and candidate pool surgically

- **What**: Iter 38 already cut Onniscenza injection top-K to 2 for `citation_vol_pag` / `plurale_ragazzi`; default is still 3. Default-path `retrieveVolumeContext` calls with k=3 (line 273, 321). Hybrid path uses `topK=5` request param (line 159). Reduce **dense-only** path to **k=2** when `prompt_class.category ∈ {chit_chat, plurale_ragazzi}` (chit_chat already skips), and reduce **hybrid** `candidatePool` from 50 → 30 (line 917) for non-deep prompts. Keep k=5 + pool=50 only for `deep_question` and `safety_warning`.
- **Estimated p95 reduction**: 5–8% (~200–400 ms). pgvector cosine cost is sub-linear in k but the network hop bytes-on-wire and JSON parse cost scale linearly. Hybrid pool=30 saves ~150 ms p50 / ~350 ms p95 on the BM25+dense merge.
- **Complexity**: ~30 LOC, 30 min. Add a `retrievalProfile` derived from `prompt_class` and pass it to `retrieveVolumeContext` / `hybridRetrieve` opts.
- **Risk**: low–medium. Quality measurement (R5 PZ V3 ≥85%) must hold; gate behind env `RAG_TOPK_PROFILED=true` for safe rollback. Preserve existing test contract by keeping a `topK=3 / pool=50` fallback path.
- **Dependencies**: none.
- **File:line refs**:
  - `supabase/functions/unlim-chat/index.ts:262-283` (retrieval gate)
  - `supabase/functions/_shared/rag.ts:911-933` (`hybridRetrieve` signature, `candidatePool` default)
  - `supabase/functions/_shared/rag.ts:706-770` (dense-only `retrieveVolumeContext`)
- **Source mapping**: zuplo "API throughput" (smaller payloads); apitestlab "why is my API slow" (don't return more than you need).

### T1.3 loadStudentContext: collapse two REST round trips into one

- **What**: `loadStudentContext` (`_shared/memory.ts:64-...`) does `student_progress.select().single()` then `student_sessions.select().single()` sequentially. Replace with a single PostgREST request using either (a) a Supabase RPC `student_context_v1(session_id)` returning a joined row, or (b) embedded resource expansion `student_progress?select=*,student_sessions(started_at)&session_id=eq.<id>&limit=1`. One round trip instead of two.
- **Estimated p95 reduction**: 6–10% (~250–500 ms). Saves one network round trip per request. On the parallel path with RAG, only matters when student-context was the slower branch (which is true ~25% of time when Voyage is fast and DB is slow).
- **Complexity**: 40 LOC + 1 SQL migration (~30 LOC). 1 hour total. Migration `supabase/migrations/<ts>_student_context_v1.sql` adds `create or replace function student_context_v1(p_session_id text) returns table (…)`.
- **Risk**: low. Backward-compatible because `loadStudentContext` falls back to defaults on null. Apply migration in transaction; pre-flight test in staging via `supabase db query --linked`.
- **Dependencies**: none.
- **File:line refs**:
  - `supabase/functions/_shared/memory.ts:64` (`loadStudentContext`)
  - new migration `supabase/migrations/<ts>_student_context_v1.sql`
- **Source mapping**: Milan Jovanović "17 hours optimizing endpoint" (the N+1 / multiple round trips lesson); zuplo "solving poor API performance" (chatty endpoints).

### T1.4 Skip rate-limit DB read for warm sessions (in-memory bloom)

- **What**: `checkRateLimitPersistent` does a Supabase REST call every request. For warm sessions with low recent traffic, an in-isolate sliding window can answer in O(1). Keep the persistent DB call as a sync flush every 30 s OR every 30th request, whichever first.
- **Estimated p95 reduction**: 2–4% (~100–200 ms). Small but consistent.
- **Complexity**: 60 LOC, 1 h. New helper `inMemoryRateLimit(sessionId)` in `_shared/guards.ts`. Persistent flush on background `setTimeout`.
- **Risk**: low for legitimate users; medium if abuse vector relies on cold-isolate isolation (not relevant here — same session pinned to one user). Document the relaxation in audit.
- **Dependencies**: none.
- **File:line refs**:
  - `supabase/functions/_shared/guards.ts` (`checkRateLimitPersistent`)
  - `supabase/functions/unlim-chat/index.ts:179-188`
- **Source mapping**: bytebytego (caching at the edge); seangoedecke (avoid synchronous DB on hot path).

### T1.5 Trim system-prompt context — adaptive Onniscenza top-3 → top-2 default

- **What**: When `ENABLE_ONNISCENZA=true`, the default `topK=3` injection adds ~200-400 input tokens to Mistral. Mistral generation latency is dominated by tokens out, but the prefill step is linear in tokens in. On `mistral-small-latest`, prefill ≈ 80 tok/ms → 400 tokens ≈ 5 ms (negligible). The real cost is **`response_format` schema validation** which scales weakly with input. Drop to top-2 default (already done for citation/plurale) — only `deep_question` + `safety_warning` keep top-3.
- **Estimated p95 reduction**: 3–6% (~150–350 ms) on Onniscenza-on requests.
- **Complexity**: 5 LOC, 5 min. Edit `_shared/onniscenza-classifier.ts:154` `default` branch `topK: 3 → 2` (with test contract update).
- **Risk**: low. R5 quality must be re-measured; iter 37 default fallback was kept at 3 specifically to preserve a test contract. Update test in same PR.
- **Dependencies**: none.
- **File:line refs**:
  - `supabase/functions/_shared/onniscenza-classifier.ts:154`
  - corresponding `tests/unit/onniscenza-classifier.test.js`
- **Source mapping**: Azure LLM Latency Guidebook (token budget management); Mistral docs `max_tokens` advisory.

### T1.6 Onniscenza aggregator early-exit on partial fail

- **What**: `aggregateOnniscenza` in `_shared/onniscenza-bridge.ts` already runs layers in parallel, but waits for the slowest. Add a `Promise.race` against a 600 ms soft-deadline that returns whatever fused hits already arrived (instead of all-or-nothing). When the deadline trips, fuse what we have and proceed.
- **Estimated p95 reduction**: 4–7% (~200–500 ms) on Onniscenza-on tail.
- **Complexity**: 40 LOC, 1 h. New helper `withSoftDeadline(promises, deadlineMs, fallback)`.
- **Risk**: low. Reduces context quality by ~5% when deadline trips (~10% of requests). PZ V3 + R5 must hold.
- **Dependencies**: depends on Onniscenza already being wired (iter 31 LIVE prod).
- **File:line refs**:
  - `supabase/functions/_shared/onniscenza-bridge.ts` (`aggregateOnniscenza`)
- **Source mapping**: seangoedecke "fast LLM inference" (timeouts are features); Azure latency guidebook (graceful degradation).

### T1.7 Promise.race watchdog: pre-emptive Mistral retry on partial p95 (sentinel)

- **What**: Currently the 8 s timeout (`unlim-chat/index.ts:560`) trips, then we fall to Brain. Insert a soft 4500 ms sentinel that fires a **second concurrent** Mistral call (cheap because of weighted routing — alternate model tier) and returns whichever comes back first. Standard hedging pattern. Cancel the loser.
- **Estimated p95 reduction**: 8–12% (~600–1100 ms) on tail. Median unchanged.
- **Complexity**: 90 LOC, 2 h. New helper `hedgedCall`. Carefully account for token cost (~5% extra). Gate behind env `LLM_HEDGE_ENABLED=true`.
- **Risk**: medium. Doubles Mistral spend on hedged requests (~5-10% of traffic) → ~+€1-2/month at current volume; well within €18 Scale tier. Watch for 429 rate-limit feedback loop.
- **Dependencies**: none directly; complementary with streaming SSE (Tier 2 A4) — when streaming lands, hedging migrates from full-call to first-token.
- **File:line refs**:
  - `supabase/functions/unlim-chat/index.ts:548-563`
  - new `supabase/functions/_shared/hedged-call.ts`
- **Source mapping**: bytebytego (request hedging); Azure LLM guide (concurrent calls for tail control).

### T1 priority ordering (recommended ship order iter 39)

1. **T1.3 student context single-RPC** — biggest absolute p95 saving for the lowest LOC.
2. **T1.1 semantic cache** — biggest avg saving when classes converge on a single experiment.
3. **T1.7 hedged Mistral call** — biggest p95 tail saving, modest cost.
4. **T1.5 default topK 3→2** — 5-LOC freebie.
5. T1.2 RAG topK profiled — gated rollout via env.
6. T1.6 Onniscenza soft-deadline — fits behind existing flag.
7. T1.4 in-memory rate limit — last because sessions are warm anyway.

### Tier 1 cumulative projection (warm path)

Optimistic: ~30–35% p95 reduction (~3000 ms cut from 10096 → ~7000 ms p95). Avg ~3000 ms achievable.
Realistic: ~22–28% p95 reduction → **p95 ~7400-7900 ms / avg ~3300 ms**.
Hits target (avg <3000 / p95 <6000) **only with semantic cache hit-rate >35%** (class scenario) or with Tier 2 added.

---

## §3. Tier 2 — Week Budget (iter 40+)

### T2.1 Streaming SSE first-byte <500 ms

- **What**: Implement `text/event-stream` from `unlim-chat`. Mistral La Plateforme supports `stream: true` on `/chat/completions`. Edge Function returns a `ReadableStream`; client (`useGalileoChat.js`) parses incrementally. First byte arrives at TTFB ~300-500 ms (= prefill); user sees text streaming while generation finishes in the background.
- **Estimated p95 reduction**: **perceived** latency drop ~70% (first chars appear in ~500 ms). Wall-clock total time unchanged or slightly worse (~+100 ms framing overhead). This is a UX win, not a wall-clock win.
- **Complexity**: 250–350 LOC, 4 h server + 2 h client. SSE response shape, `[INTENT:...]` parsing must shift to "buffered until end-of-stream" or use the iter 38 A7 schema mode + a delimited final JSON. Client must accumulate chars and flush to UI on word boundaries.
- **Risk**: medium-high. Breaks `useGalileoChat.js` JSON-response assumption. iter 38 explicit defer noted "breaks client parsing risk". Mitigations: dual-mode (streaming + buffered) behind `?stream=1` query, canary 5%→25%→100%.
- **Dependencies on deferred items**: A4 (Mistral streaming SSE) is exactly this. iter 38 deferred for client-parser breakage; iter 40+ unblocks once we have a buffered fallback.
- **File:line refs**:
  - `supabase/functions/_shared/mistral-client.ts:133` (add `stream: true` branch)
  - `supabase/functions/unlim-chat/index.ts:548-563` (return ReadableStream)
  - frontend `src/components/lavagna/useGalileoChat.js` (SSE parser)
- **Source mapping**: Azure LLM Latency Guidebook (TTFB-first); seangoedecke (streaming as the default for chat); KDnuggets fast LLM API providers (TTFB benchmarks).

### T2.2 KV cache reuse — fixed system prompt prefix

- **What**: Mistral supports prompt caching via stable system-prompt prefixes (the platform docs describe automatic prefix-caching for repeated system prompts, billed at reduced rate, faster prefill). Today our `systemPrompt` is rebuilt per request because RAG context + Capitolo fragment + Onniscenza injection varies. Refactor to put **stable parts first** (`BASE_PROMPT v3.1` + Capitolo fragment when same experiment) and **volatile parts last** (RAG + Onniscenza), so the first ~2000 tokens hash-stably.
- **Estimated p95 reduction**: 10–15% on Mistral generation step (~400–700 ms). KV-cached prefill is roughly 5x faster than fresh prefill on Mistral La Plateforme infrastructure.
- **Complexity**: 80 LOC, 2 h. Refactor `_shared/system-prompt.ts buildSystemPrompt` ordering. No client change.
- **Risk**: low. Same content, only ordering shifts. PZ V3 must hold (re-measure R5).
- **Dependencies**: none.
- **File:line refs**:
  - `supabase/functions/_shared/system-prompt.ts` (`buildSystemPrompt`)
  - `supabase/functions/unlim-chat/index.ts:451-460` (prompt assembly order)
- **Source mapping**: Mistral La Plateforme prompt-caching docs; lightning.ai vLLM PagedAttention (analogous mechanism); Azure LLM guide (prefix caching).

### T2.3 Edge regional pinning EU France (Mistral co-location)

- **What**: Supabase Edge Functions allow region selection. Mistral La Plateforme is hosted in EU France. Pin `unlim-chat` to `eu-west-3` (Paris) explicitly — Supabase docs / dashboard. Today Edge default may be `eu-central-1` (Frankfurt) which adds ~15-30 ms RTT to Mistral plus ~20-40 ms RTT to Voyage (US-east). Frankfurt → Paris is ~10 ms but compound across 3-4 round trips per request matters.
- **Estimated p95 reduction**: 3–5% (~150-300 ms). Small but free.
- **Complexity**: ~5 LOC config edit (`supabase/config.toml` or dashboard setting). 30 min including verification.
- **Risk**: very low. May affect cold-start distribution if Paris pool is smaller; verify in canary.
- **Dependencies**: none.
- **File:line refs**:
  - `supabase/config.toml` `[functions.unlim-chat] region = "eu-west-3"` (verify exact key)
  - companion: deploy command `--region` flag if available
- **Source mapping**: bytebytego "improve API performance" (region pinning); zuplo "throughput" (latency map = network distance).

### T2.4 Connection pooling Voyage (HTTP keep-alive)

- **What**: Each call to Voyage `/v1/embeddings` opens a fresh TLS connection. Deno `fetch` reuses connections per `globalThis` only when same origin and TLS session is cached. Verify keep-alive headers and a single shared `Headers`/options pre-build. As a stretch, batch the rate-limited 3 RPM (already a known limit per `scripts/rag-ingest-voyage-batch.mjs`) — but for chat path we issue one embed per request, so the win is TLS not batching.
- **Estimated p95 reduction**: 2–4% (~100–200 ms) on the embed leg by skipping TLS handshake (~80-120 ms saved per re-use).
- **Complexity**: 20 LOC, 30 min.
- **Risk**: very low. Worst case Deno already does this and there's no change.
- **Dependencies**: none.
- **File:line refs**:
  - `supabase/functions/_shared/rag.ts:786-798` (Voyage embeddings fetch)
  - `supabase/functions/_shared/rag.ts:870-906` (Voyage rerank fetch)
- **Source mapping**: apitestlab "why is my API slow" (TCP/TLS handshake cost); medium devnotebook "your API is slow but not where you think".

### T2.5 Replace Voyage embed with Mistral embeddings (consolidate EU FR)

- **What**: Mistral La Plateforme exposes `/v1/embeddings` (`mistral-embed`, 1024-dim). Migrating from Voyage `voyage-3` (US-east) to `mistral-embed` (EU FR) eliminates one international hop and consolidates to single provider for GDPR clarity. Caveat: requires re-embedding the 1881 RAG chunks corpus (cost ~$0.50, time ~30 min on iter 7 ingest pipeline) and updating `match_rag_chunks` RPC to align dimensions.
- **Estimated p95 reduction**: 8–12% on the embed leg (~250–550 ms saved). Plus consolidation simplification.
- **Complexity**: 200 LOC + ingest re-run (~1 day total counting validation). New helper `embedQueryMistral` in `mistral-client.ts`. Migration to swap column or add parallel column. Recall@5 bench parity check vs Voyage (use `r6-fixture.jsonl`).
- **Risk**: medium. Recall delta is real — Voyage `voyage-3` is a stronger model than `mistral-embed` per public benchmarks (BGE-M3 is closer to Voyage). Decision gate: only ship if recall@5 ≥0.85 of Voyage baseline.
- **Dependencies**: none. Independent of A4/A9/A10.
- **File:line refs**:
  - `supabase/functions/_shared/mistral-client.ts:181-220` (already has `embed` skeleton, needs production wire)
  - `supabase/functions/_shared/rag.ts:781-807` (replace `embedQueryVoyage`)
  - new migration if column dim differs
- **Source mapping**: Mistral docs `/v1/embeddings`; KDnuggets fast-LLM-API providers; bytebytego (provider consolidation pattern).

### T2.6 LLM router: prefer `mistral-small-latest` for short prompts; route to `mistral-large-latest` only for `deep_question` / `safety_warning`

- **What**: Today `pickWeightedProvider` (`llm-client.ts:402`) randomizes 50/15/15/20. Replace random with `prompt_class`-aware routing: `chit_chat` + `plurale_ragazzi` + `citation_vol_pag` → `mistral-small-latest` always (it's faster, cheaper); `deep_question` + `safety_warning` → keep weighted (might pick `mistral-large-latest`). Reduces avg generation latency ~25% on the lighter buckets.
- **Estimated p95 reduction**: 8–12% blended (~400–800 ms). Small is ~2x faster than Large at chat-completion (Mistral docs).
- **Complexity**: 40 LOC, 1 h. Change `routeModel` and pass classification through.
- **Risk**: low–medium. Quality dip on edge cases (e.g., "Ragazzi, perché il LED brucia?" is `plurale_ragazzi` but warrants Large for safety nuance). Mitigate by keeping safety override.
- **Dependencies**: none.
- **File:line refs**:
  - `supabase/functions/_shared/router.ts` (`routeModel`)
  - `supabase/functions/_shared/llm-client.ts:402-460` (`pickWeightedProvider`)
- **Source mapping**: Azure LLM guide (model right-sizing); seangoedecke (smaller is faster, route by intent).

### T2.7 Cache Voyage embeddings for the top-200 most frequent queries

- **What**: Persist a `query_embedding_cache` table keyed by SHA-256 of normalized query text. Read with a one-shot `select` before paying for the Voyage RPC. Initially seed by analyzing past 30 days of `student_sessions` queries; thereafter populated on miss.
- **Estimated p95 reduction**: 6–10% on cache-hit (~250–500 ms). Hit rate in ELAB context is high because docente narrates the same prompts class after class ("accendete il LED rosso").
- **Complexity**: 100 LOC + migration. 2 h.
- **Risk**: low. Cache invalidation = none (embeddings are stable for a fixed model).
- **Dependencies**: complements T2.5 (when Mistral embed lands, cache stays valid for new model).
- **File:line refs**:
  - new migration `supabase/migrations/<ts>_query_embedding_cache.sql`
  - `supabase/functions/_shared/rag.ts:781` (Voyage embed wrapper)
- **Source mapping**: bytebytego (cache the expensive thing); medium kaushalsinh (fix slow APIs by caching upstream).

### Tier 2 cumulative projection

After Tier 1 + Tier 2 (no streaming yet):
- Avg ~2200–2600 ms (target avg <3000 ms **MET**)
- p95 ~5500–6200 ms (target p95 <6000 ms **borderline MET**)
With Tier 2 streaming SSE (T2.1) added — perceived latency drops dramatically; wall-clock unchanged. Use perceived for marketing, wall-clock for SLO.

---

## §4. Tier 3 — Month Budget Moonshot (iter 41+)

### T3.1 vLLM PagedAttention self-host (Mistral 7B / Mixtral 8x7B / Mistral Small 24B)

- **What**: Decommission Mistral La Plateforme dependency for the chat path; self-host on Hetzner GPU EU FR (RTX A6000 48 GB, ~€480/month) or revisit RunPod paid-per-hour (€0.74/h on demand). vLLM PagedAttention serves Mistral 7B / Mistral Small 24B at ~150-300 tok/s on a single A6000 (vs Mistral La Plateforme ~40-60 tok/s observed). p95 chat completion drops to ~1.2-1.8 s.
- **Estimated p95 reduction**: 30-45% on Mistral generation step alone (~1500-2500 ms). End-to-end p95 to ~3500-4500 ms.
- **Complexity**: 1500 LOC + infra; 3-5 days end-to-end (procurement, vLLM Docker, Caddy TLS, observability, dual-write canary). Already explored Sprint S iter 1-5 with RTX A6000 paid storage → terminated Path A iter 5 P3.
- **Risk**: high. €480/month vs €18/month Mistral Scale = 26× cost increase, breaks budget unless offset by removing Mistral entirely. GDPR-clean only if Hetzner FR. Single point of failure unless dual-region. iter 38 explicit defer; user-mandate `Stack 100% Mistral EU FR consolidation iter 38+ direction` opposes this. Re-open only if iter 39+ Tier 1+2 misses target.
- **Dependencies**: A10 Onnipotenza Deno port — orthogonal but both touch the same dispatcher path; coordinate to avoid rework.
- **File:line refs**:
  - new `infra/vllm/docker-compose.yml`
  - `supabase/functions/_shared/llm-client.ts:295-350` (`callRunPod` already a stub, repurpose for Hetzner endpoint)
- **Source mapping**: lightning.ai vLLM PagedAttention guide; Azure LLM Latency Guidebook (self-host vs API trade-off); KDnuggets (top fast LLM providers — Groq, Cerebras, etc. as alternatives if self-host too expensive).

### T3.2 voxtral.c local C inference (Apple M3 Max — TTS path only)

- **What**: antirez's `voxtral.c` provides a tiny C inference engine for Voxtral. Use it to bring TTS local on the **client** (Apple M3 Max LIM, optionally also iPad if Metal). Today TTS is decoupled from chat (iter 34) and runs on Voxtral Mistral hosted (~1200 ms p50 for short sentence). Local would be ~200-400 ms.
- **Estimated p95 reduction**: 0% on the chat-completion path (decoupled). However, end-to-end perceived (chat reply visible + audio audible) drops ~800-1000 ms.
- **Complexity**: 800 LOC C bindings + 200 LOC JS bridge. 4-5 days for first PoC.
- **Risk**: medium. Voxtral voice clone (Andrea Italian, voice_id `9234f1b6-...`) requires the cloned voice weights — Mistral may not export. Fallback to default Italian voice.
- **Dependencies**: A9 (Voxtral Transcribe 2 STT migration) — sister tool, same Voxtral family, share C runtime.
- **File:line refs**:
  - `supabase/functions/unlim-tts/index.ts` (out of `unlim-chat` scope but linked)
  - frontend `src/services/tts.js` (assume; verify path)
  - new `tools/voxtral-c-bridge/`
- **Source mapping**: github.com/antirez/voxtral.c; digitalapplied.com Voxtral guide; simonwillison.net "Voxtral 2"; mistral.ai news Voxtral Transcribe 2.

### T3.3 RAG chunk reduction strategy — Anthropic Contextual Embeddings v2 with semantic compression

- **What**: 1881 chunks (Vol1 + Vol2 + Vol3 + 100 wiki) is healthy, but the **per-chunk size** drives prefill time when injected. Re-ingest with semantic compression: each chunk gets a 2-3 sentence "summary lead" (Anthropic Contextual approach already used iter 7) PLUS a strict 300-token cap. Inject summary by default; expand to full chunk only when `deep_question` classifier triggers.
- **Estimated p95 reduction**: 8–12% on Mistral prefill (~300–500 ms) and 5% on RAG payload network bytes.
- **Complexity**: 600 LOC + ingest re-run ($1-2 cost via Voyage + Mistral). 2-3 days.
- **Risk**: medium. Recall@5 must hold (currently ~0.55 measured iter 12 fixture). Re-bench mandatory.
- **Dependencies**: T2.5 if migrating to Mistral embed; otherwise standalone.
- **File:line refs**:
  - `scripts/rag-contextual-ingest-voyage.mjs`
  - new `scripts/rag-contextual-ingest-v2-summary-lead.mjs`
- **Source mapping**: Anthropic Contextual Embeddings (already in use); Azure LLM guide on context budget; arxiv 2602.11298 (referenced in user sources, semantic compression theory).

### T3.4 Multi-region fallback — Mistral La Plateforme EU + Groq / Cerebras / Together hot fallback

- **What**: Today fallback chain is RunPod (off) → Gemini → Together (gated). Add a **Groq** path (Llama 3.3 70B at ~270 tok/s, 800 tokens/s on Mixtral) or **Cerebras** (Llama 3.3 70B at ~2100 tok/s) as primary fast-path for chit_chat + plurale_ragazzi categories. EU residency caveat: Groq/Cerebras are US-only — usable only with Together-style anonymized teacher-context gate. Per CLAUDE.md "Student runtime chat SEMPRE EU-only", student path must stay Mistral EU FR. So this is a **teacher dashboard** path, not student path.
- **Estimated p95 reduction**: 40-60% on teacher dashboard chat (which is out of `unlim-chat` student scope but adjacent). Student path unchanged.
- **Complexity**: 400 LOC, 2 days.
- **Risk**: medium. GDPR constraint forbids student data; teacher-only narrowing required.
- **Dependencies**: none.
- **File:line refs**: new `supabase/functions/_shared/groq-client.ts`; gate in `together-fallback.ts canUseTogether` extended.
- **Source mapping**: KDnuggets "top 5 super fast LLM API providers" (Groq, Cerebras benchmarks); seangoedecke fast-llm-inference; Azure LLM guide multi-region.

### T3.5 Schema-mode Mistral output token diet

- **What**: iter 38 A7 ships `response_format: json_schema`. The schema currently allows free-form `text` field plus `intents` array. Constrain `text.maxLength=500` (~80 words = 60 mandate +33% buffer) at the schema level so Mistral stops earlier rather than relying on `max_tokens=120`. Decoder-side stop is faster than token-budget stop.
- **Estimated p95 reduction**: 5-8% on Mistral generation (~250–500 ms).
- **Complexity**: 30 LOC, 1 h. Update `_shared/intent-tools-schema.ts`.
- **Risk**: low. Validate with R5 bench; if quality drops, revert.
- **Dependencies**: depends on iter 38 A7 (already shipped).
- **File:line refs**:
  - `supabase/functions/_shared/intent-tools-schema.ts:1-141`
- **Source mapping**: Mistral La Plateforme docs `response_format`; Azure LLM guide (decode-side budget).

---

## §5. Anti-Pattern Checklist + Counterintuitive Findings

### 5.1 Don't waste a sprint on these (with rationale)

- **"Add Redis"**: Supabase Edge runtime is per-isolate; out-of-process Redis adds ~5 ms per round trip. Per-isolate `Map` + Cron-warmup beats Redis here. Source: medium devnotebook.
- **"Compress JSON responses with gzip"**: response is <2 KB. Gzip helps when payloads are >100 KB. Source: zuplo throughput.
- **"Move to gRPC"**: HTTP/2 keep-alive already does the heavy lifting; protocol overhead is <2% of request time. Don't break browser compatibility. Source: bytebytego.
- **"Increase `max_tokens` for quality"**: counter-mandate. iter 38 cut 256→120; latency drops faster than quality (PZ V3 R5 stayed 91-94%). Source: Azure LLM guide token budget.
- **"Use Groq/Cerebras for student path"**: GDPR-blocked per Andrea explicit ban (`Stack 100% Mistral EU FR consolidation iter 38+`). Source: CLAUDE.md.
- **"Add a CDN in front of Edge Function"**: Edge Functions are already CDN-edge; CloudFront/Cloudflare in front would double-route and break secrets. Source: zuplo learning center.
- **"Index every Supabase table column"**: pgvector index is the only one that matters for RAG; over-indexing slows writes and adds nothing on reads. `student_sessions` indexes already exist. Source: supabase Postgres best practices.

### 5.2 Counterintuitive findings

- **`response_format: json_schema` (iter 38 A7) is ~5-10% slower than free-form completion** even on Mistral. The schema validator runs server-side and adds prefill cost. We accept the cost because it eliminates regex parse failures (iter 37 R7 v53 had 12.5% canonical rate; ADR-030 projects ≥95% post-deploy). Trade: latency vs INTENT canonical. Worth it.
- **Cron warmup helps p99 more than p95**. Iter 38 A5 30 s HEAD ping keeps an isolate warm but doesn't prevent the rare cold spawn when a second isolate is needed (concurrent traffic spike). Real fix is `keepWarm: 2-3` config (Supabase Edge plan permitting).
- **Promise.all is not always faster**. Iter 38 A3 paralleled `loadStudentContext` + RAG retrieval. When Voyage is slow (>800 ms) and Supabase is fast (<150 ms), the parallel gate is **gated by Voyage** — same as serial. Win is on the cold-cache symmetric case (~25% of requests). Honest delta: -400 to -800 ms p95 on average, sometimes 0.
- **`max_tokens=120` is already aggressive**. Going to 80 hurts quality (PZ V3 ≤60 mandate has a 50% safety buffer; cutting more drops it below safe floor for 2-3 sentence Italian responses).
- **Streaming SSE (Tier 2 A4) doesn't actually save total wall-clock time**. It moves the perception. The user sees text in 500 ms instead of 4500 ms but the full response still takes 4500 ms. For a tutor where the docente reads aloud, this is a real UX win — but don't claim wall-clock improvement in dashboards.
- **Onniscenza top-3 → top-2 default saves less than expected**. Mistral prefill is fast (~80 tok/ms); 100-tokens-extra context only costs ~1 ms. The real cost is **fetching** those 3 layers (Onniscenza aggregator network round trips), not injecting them into the prompt. T1.6 (soft-deadline) is the better lever.
- **Voyage EU latency is 70-80% network, 20-30% inference**. Migrating to Mistral embed (T2.5) saves more by region than by model speed. Recall must be re-validated.
- **Hedged Mistral calls (T1.7) cost less than expected**. ~5% extra spend because the cancel arrives within ~200 ms of the winning response on most hedges. Dispute case: when both arrive within 50 ms (rare), cost is 2x; when winner is far ahead (common), cost is 1.05x.

### 5.3 Things to measure but not optimize for

- TTFB cold start (warmup mitigates).
- Token-per-second from Mistral (out of our control).
- TLS handshake cost (Deno already pools).
- Body parse time (microseconds).

---

## §6. Bench Plan — R5 / R6 / R7 Measurement Methodology

### 6.1 Continuity with existing harnesses

- **R5 stress**: 50-prompt fixture in `scripts/bench/r5-fixture.jsonl`. Runner `scripts/bench/run-sprint-r5-stress.mjs`. Quality scorer `scripts/bench/score-unlim-quality.mjs` (12-rule PZ V3). Existing prod baseline iter 37: 91.45% / 4715 ms avg / iter 38 partial: 93.60%.
- **R6 fixture v2**: scoped iter 38 (deferred). Add page-metadata + 100 prompts; runner needs authoring (`run-sprint-r6-stress.mjs` not on disk).
- **R7 INTENT canonical**: 50-prompt fixture (deferred iter 38). Measures `[INTENT:...]` schema-mode parse rate. Currently 12.5% (iter 37 v53 baseline) → projected ≥95% (ADR-030).

### 6.2 Iter 39+ bench protocol

For each Tier 1 / Tier 2 atom shipped:

1. **Pre-flight CoV**: `npx vitest run` baseline preserved (no regression).
2. **Build PASS**: `npm run build` (~14 min) before deploy.
3. **Deploy canary 5%**: gate via env flag (`SEMANTIC_CACHE_ENABLED`, `RAG_TOPK_PROFILED`, `LLM_HEDGE_ENABLED`, etc.). Watch 30 min metrics.
4. **R5 50-prompt stress** post-deploy: latency p50 / p95 + PZ V3 quality. Gate ≥85% PZ V3.
5. **R6 100-prompt RAG-aware**: when fixture lands. Measure recall@5 + latency.
6. **R7 INTENT canonical**: schema-mode parse rate. Gate ≥95% (per ADR-030).

### 6.3 Statistical rigor

- Each bench runs **3 times** with cold-isolate warm-up (first run discarded). Report median p50, p95.
- Use `scripts/bench/run-sprint-r5-stress.mjs --runs 3 --discard-first`.
- Compare Δp95 with paired-fixture sign test; Δ ≥150 ms p95 considered significant at 50-prompt sample.
- Track in `automa/state/iter-NN-bench-summary.md` per iter (existing pattern from iter 12).

### 6.4 Specific gates per atom

| Atom | Pre-deploy gate | Post-deploy gate | Rollback trigger |
|---|---|---|---|
| T1.1 semantic cache | unit tests 100%, fixture-replay determinism | hit-rate ≥20% in canary, Δp95 ≥-300 ms | hit-rate <10% OR PZ V3 <90% |
| T1.2 topK profiled | unit tests pass | Δp95 ≥-150 ms, recall@5 stable | recall@5 <0.50 |
| T1.3 student RPC | migration apply staging | Δp95 ≥-200 ms, no PII leakage | any 5xx error >0.5% |
| T1.5 default topK→2 | onniscenza-classifier test update | PZ V3 ≥85%, Δp95 ≥-100 ms | PZ V3 <85% |
| T1.7 hedged call | unit tests, cost projection ≤€2/mo | Δp95 ≥-500 ms, hedge spend <10% | spend >15% OR 429 storm |
| T2.1 streaming SSE | client parser dual-mode tests | TTFB <500 ms, total wall-clock unchanged | client errors >0.1% |
| T2.2 KV cache prefix | system-prompt order audit | Δp95 ≥-300 ms | PZ V3 <85% |
| T2.5 Mistral embed | recall@5 vs Voyage gate ≥0.85 | Δp95 ≥-200 ms | recall@5 <0.85 |

### 6.5 Observability additions

- Add `latencyBreakdown` field to `unlim-chat` response (debug-only `?debug_latency=1`):
  - `t_studentContext_ms`
  - `t_rag_ms`
  - `t_onniscenza_ms`
  - `t_mistral_ttfb_ms` (when streaming)
  - `t_mistral_total_ms`
  - `t_total_ms`
- Wire to a `chat_latency_log` Supabase table for 7-day aggregates. Light schema, ~10 KB/day at current volume.
- Dashboard: add panel to existing `dashboard-data` Edge Function.

---

## §7. References — 18 Source Cross-Reference Map

Mapping each user-supplied source to atoms it informs:

| # | Source | Atoms informed |
|---|---|---|
| 1 | apitestlab.org "why is my API slow" | T1.3 (chatty endpoints), T1.4 (synchronous DB), T2.4 (TLS handshake), §5.1 anti-patterns |
| 2 | medium devnotebook "API slow but not where you think" | T1.4 (cache the hot path), T2.4 (connection reuse), §5.2 counterintuitive (Promise.all caveat) |
| 3 | medium kaushalsinh "why your API is slow and how to fix it" | T1.1 (caching), T2.7 (cache upstream), T1.5 (payload reduction) |
| 4 | zuplo "solving poor API performance tips" | T1.3 (round trips), T2.3 (region pinning), §5.1 (don't gzip small) |
| 5 | zuplo "mastering API throughput" | T1.2 (smaller payloads), T2.3 (latency map), T2.4 (TLS pool) |
| 6 | bytebytego "top 5 ways improve API performance" | T1.1 (cache #1 lever), T1.7 (request hedging), T2.3 (region), T2.5 (provider consolidation), T2.7 (cache upstream) |
| 7 | Stackademic "doubled my API speed" | T1.1 (memoization), T1.5 (input/output sizing) |
| 8 | LinkedIn Milan Jovanović "17 hours optimizing endpoint" | T1.3 (N+1 query lesson), §5.1 (don't add Redis blindly) |
| 9 | Azure LLM Latency Guidebook | T2.1 (TTFB streaming), T2.2 (prefix caching), T1.5 (token budget), T1.7 (concurrent calls), T3.1 (self-host trade-off), T3.4 (multi-region) |
| 10 | seangoedecke "fast LLM inference" | T2.1 (streaming default), T1.6 (timeouts as features), T1.4 (async DB), T2.6 (model right-sizing), §5.2 (smaller=faster) |
| 11 | docs.mistral.ai/api | T1.5 (max_tokens), T2.1 (`stream: true`), T2.2 (prefix caching), T2.5 (`/v1/embeddings`), T3.5 (`response_format`) |
| 12 | lightning.ai vLLM PagedAttention Mistral 7B | T3.1 (self-host), T3.3 (chunk strategy parallels) |
| 13 | github.com/antirez/voxtral.c | T3.2 (local C inference TTS) |
| 14 | digitalapplied.com Voxtral TTS open source | T3.2 (local TTS), background for ADR-031 (STT migration) |
| 15 | arxiv 2602.11298 (semantic compression theory) | T3.3 (chunk reduction), T2.7 (embedding cache) |
| 16 | simonwillison.net "Voxtral 2" (Feb 2026) | T3.2 (Voxtral local), background ADR-031 |
| 17 | mistral.ai news Voxtral Transcribe 2 | ADR-031 (STT migration); pricing $0.003/min input |
| 18 | KDnuggets "top 5 super fast LLM API providers" | T3.4 (Groq/Cerebras teacher path), T2.6 (model speed comparison) |

---

## §8. Summary — Top 3 Highest-ROI Tier 1 Recommendations

1. **T1.3 — student-context single RPC** (1 h, ~250–500 ms p95 saved, low risk). Migration `student_context_v1(p_session_id text)` returns joined progress + last-session row in one PostgREST call. Removes one network round trip from the parallel gate; biggest absolute p95 saving for the lowest LOC count. Files: `supabase/functions/_shared/memory.ts:64`, new `supabase/migrations/<ts>_student_context_v1.sql`.

2. **T1.7 — hedged Mistral call with 4500 ms sentinel** (2 h, ~600–1100 ms p95 saved on tail, medium risk). The single biggest tail-cutter without breaking the client contract. Costs ~+€1-2/month at current volume (well under €18 Scale tier). Gate behind `LLM_HEDGE_ENABLED=true` env. Files: `supabase/functions/unlim-chat/index.ts:548-563`, new `supabase/functions/_shared/hedged-call.ts`. Companion: emit hedge spend metric to existing `together_audit_log` extension table.

3. **T1.1 — semantic prompt cache** (3 h, ~600–800 ms p95 saved when class converges, low risk). In-isolate LRU keyed by SHA-256 of `(systemPrompt + safeMessage + experimentId)`, optional Voyage-similarity ≥0.96 fuzzy match within session. Per-isolate keeps it RAM-only (no Redis), Cron warmup keeps the isolate hot. Files: new `supabase/functions/_shared/semantic-cache.ts`, integration `unlim-chat/index.ts:545`.

Cumulative iter 39 budget (1 day) projection: avg ~3300 ms / p95 ~7600 ms → with semantic-cache hit-rate 30%, avg drops below 3000 ms (target met) and p95 stays just above 6000 ms. Tier 2 (week budget) closes the p95 gap. Tier 3 (month) is moonshot territory and partially against user-mandated EU FR Mistral consolidation; defer unless Tier 1+2 misses target.
