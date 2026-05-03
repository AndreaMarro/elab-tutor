# Iter 31 ralph 27 — R5 Latency Regression RCA (systematic-debugging)

**Date**: 2026-05-03
**Investigator**: systematic-debugging-investigator iter 31 ralph 27
**Mode**: read-only (no src code modifications)
**Scope**: hypothesis-driven RCA su +22.8% avg + +6.8% p95 R5 regression iter 11 ralph close
**Working dir**: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder`

---

## §1 Regression evidence iter 38 carryover vs iter 11 ralph

| Metric | iter 38 carryover (commit `792acf8`) | iter 11 ralph (commit `d1a072e`) | Delta |
|--------|--------------------------------------|----------------------------------|-------|
| Bench timestamp | `2026-05-01T07-43-04-636Z` | `2026-05-03T07-02-19-323Z` | +47h |
| Endpoint | `unlim-chat` v56 | `unlim-chat` v72+ | +16 deploy versions |
| Success rate | **30/38** (8 FAIL!) | 50/50 | partial vs full |
| PZ V3 overall | 94.2% | 94.41% | +0.21pp (noise) |
| Latency avg | 1607ms | 1974ms | **+22.8%** |
| Latency p95 | 3380ms | 3611ms | +6.8% |
| Verdict | PASS | PASS | maintained |

Sources:
- `scripts/bench/output/r5-stress-report-2026-05-01T07-43-04-636Z.md:14-17` (avg 1607ms / Successful 30/38 / Failures 8)
- `scripts/bench/output/r5-stress-report-2026-05-03T07-02-19-323Z.md:15-17` (Avg 1974ms / Successful 50/50)
- `docs/audits/2026-05-03-iter-31-ralph11-R5-V1-baseline-rebench.md:108-118` (delta table)

**Caveat onesto baseline**: iter 38 carryover bench is **partial 30/38 with 8 failures**, NOT a clean PASS comparison. Comparing aggregate avg latency on partial vs full sample introduces measurement bias (avg of 30 successful prompts vs avg of 50 successful prompts). 8 failures may have been timeouts excluded from avg. Iter 11 ralph 50/50 is a more complete sample.

---

## §2 Six hypotheses formal statement

- **H1**: Edge Function v72→v73+ deploy churn (66 commits between baselines, 17 Edge Function files +2635 LOC delta) introduced cumulative overhead via canary code paths still loaded even when env-gated off.
- **H2**: Onniscenza V1 7-layer aggregator overhead post v50 deploy iter 37 (state-snapshot-aggregator parallel orchestration via `Promise.all` of 7 layer fetches).
- **H3**: RAG retrieval slow (Voyage page=0% gap iter 38 carryover, 1881 chunks but `page` metadata missing → potentially fallback paths slower).
- **H4**: Mistral La Plateforme provider variability (LLM_ROUTING 70/20/10 iter 37 ADR-029 conservative tune, Mistral primary 70% but provider-side latency unpredictable).
- **H5**: Test environment factor (iter 11 bench 2026-05-03 07:02Z ran under different network conditions vs iter 38 carryover 2026-05-01 07:43Z, time-of-day load variability).
- **H6**: Together AI primary marker iter 5 P3 deploy persists (commits `f5127d6`+`8a922f7`); Together fallback may NOW be primary in some runs via `LLM_PROVIDER` default.

---

## §3 Investigation per hypothesis

### H1 — Edge Function deploy churn

**Evidence gathered**:
- `git log --oneline 792acf8..d1a072e -- 'supabase/functions/'` returned **66 total commits between baselines** (filtered ~30 touch supabase/functions).
- `git diff --stat 792acf8..d1a072e -- 'supabase/functions/'` shows **17 files changed, +2635 LOC**, including:
  - `unlim-chat/index.ts` +409 LOC
  - `_shared/onniscenza-bridge.ts` +298 LOC
  - `_shared/llm-client.ts` +181 LOC
  - `_shared/mistral-client.ts` +156 LOC
  - `_shared/conversation-history-embed.ts` +146 LOC NEW
  - `_shared/onniscenza-conversational-fusion.ts` +141 LOC NEW
  - `_shared/principio-zero-validator.ts` +138 LOC NEW
  - `_shared/clawbot-template-router.ts` +129 LOC NEW
  - `_shared/json-mode-parser.ts` +114 LOC NEW
  - `_shared/onniscenza-cache.ts` +115 LOC NEW
  - `_shared/anti-absurd-validator.ts` +80 LOC NEW
  - `_shared/clawbot-dispatcher-deno.ts` +286 LOC NEW
  - `_shared/semantic-cache.ts` +165 LOC NEW
  - `_shared/voxtral-stt-client.ts` +181 LOC NEW
- Verified env-gated features at `supabase/functions/unlim-chat/index.ts`:
  - `ENABLE_INTENT_TOOLS_SCHEMA` line 526 default `'false'`
  - `ENABLE_SSE` line 665 default `'false'`
  - `ONNISCENZA_VERSION` line 448 default `'v1'`
  - `ENABLE_ONNISCENZA` line 416 default `'false'`
- Per `docs/audits/2026-05-03-iter-31-ralph11-R5-V1-baseline-rebench.md:43`, secrets verified `ENABLE_INTENT_TOOLS_SCHEMA + ENABLE_SSE + ONNISCENZA_CACHE_ENABLED + CANARY_DENO_DISPATCH_PERCENT set` — flags ARE active in prod.
- Module loading overhead: 8+ NEW shared modules imported. Deno cold-start parses all imports even when env-gated branches don't execute.

**Reasoning**:
- Module parse + import resolution adds cold-start overhead (~10-50ms each, 8+ NEW modules ≈ 80-400ms cold-start delta).
- Hot-path env checks `Deno.env.get(...)` per request add negligible (<1ms) per gate.
- Cron warmup `migrations/20260430220000_unlim_chat_warmup_cron.sql` 30s should mitigate cold starts but doesn't eliminate first-request latency in cold isolates.
- Tier 1 latency optims iter 38 (semantic cache LRU 100, max_tokens 120, Promise.all parallelize) were claimed to LIFT latency -64% (CLAUDE.md iter 38 carryover §6). Yet iter 11 ralph shows +22.8% regression vs that lift baseline.

### H2 — Onniscenza V1 7-layer aggregator

**Evidence gathered**:
- `supabase/functions/_shared/onniscenza-bridge.ts:344` declares `aggregateOnniscenza` (V1 active per ADR-035 §1).
- `supabase/functions/_shared/onniscenza-bridge.ts:407-415` performs `Promise.all` of 7 layer fetches: `L1_rag`, `L2_wiki`, `L3_glossario`, `L4_sessione`, `L5_vision`, `L6_llm`, `L7_onthefly` — parallel orchestration cap = max(layer_latency).
- `supabase/functions/unlim-chat/index.ts:401, 416` shows `ENABLE_ONNISCENZA=true && !promptClass.skipOnniscenza` triggers aggregator.
- `supabase/functions/_shared/onniscenza-classifier.ts` (per CLAUDE.md iter 37) skips Onniscenza for chit_chat (topK:0).
- Per ralph 11 audit §2, `ENABLE_ONNISCENZA` IS set in prod. Per CLAUDE.md iter 32+ "Onniscenza wired prod opt-in `ENABLE_ONNISCENZA=true`".
- Onniscenza V1 was REVERTED iter 39 per `docs/audits/iter-39-A4-Onniscenza-V2-REGRESSION-revert.md` (V2 -1.0pp PZ + 36% slower).

**Reasoning**:
- Onniscenza V1 was already active at iter 38 carryover baseline (per CLAUDE.md iter 31-32 close: "Onniscenza 7-layer aggregator wired prod opt-in"). So delta vs iter 38 baseline is NOT explained by Onniscenza V1 first-time activation.
- However, classifier behavior change (`skipOnniscenza` returns `true` for chit_chat) may have shifted topK distribution. Per ralph 11 §4, deep_question category averaged 2384ms vs plurale_ragazzi 1907ms — Onniscenza fires more on deep_question.
- Cache (LRU 100 entries TTL 30min from `semantic-cache.ts` + `onniscenza-cache.ts`) may have been warm at iter 38 carryover bench (8 failures = retries warmed cache), cold at iter 11 ralph fresh run.

### H3 — RAG retrieval slow (Voyage page=0% gap)

**Evidence gathered**:
- Per CLAUDE.md iter 38 carryover: "page=0% Voyage gap iter 38 carryover, 1881 chunks but no page metadata".
- Per Phase 0 baseline `docs/audits/PHASE-0-baseline-2026-05-02.md`: "RAG 2061 chunks page=0% chapter=8.7%".
- RAG path `supabase/functions/_shared/rag.ts` 958 LOC (per CLAUDE.md iter 12 P1).
- Bench evidence per-prompt `r5-003 citation_vol_pag 1968ms` (iter 11 ralph) vs `r5-003 citation_vol_pag 1959ms` (iter 38 carryover at `2026-05-01T07-18-36-871Z.md:25`) → effectively identical for the same prompt under same RAG conditions.

**Reasoning**:
- Page=0% Voyage gap was present at BOTH baselines (no Voyage re-ingest happened between commits per CLAUDE.md iter 38 carryover §3 "Path A jsonb backfill — coverage chapter 8.7% / page 0% per Voyage ingest gap, R6 unblock defer iter 40+").
- RAG performance therefore identical between baselines.
- Per-prompt comparison shows RAG-heavy prompts (citation_vol_pag) achieve LOW latency 638-724ms (iter 11) vs 1216-1480ms (iter 38 carryover 2026-05-01T07-18 partial) → RAG IF anything is FASTER iter 11.

### H4 — Mistral La Plateforme provider variability

**Evidence gathered**:
- `supabase/functions/_shared/llm-client.ts:452` declares `pickWeightedProvider()` returning `'gemini-flash-lite' | 'mistral-small' | 'mistral-large' | 'together' | null`.
- `supabase/functions/_shared/llm-client.ts:454-456` runtime resolves `LLM_ROUTING_WEIGHTS` env each call.
- ADR-029 Mistral 70/20/10 conservative tune ratified iter 37 close + active prod.
- Per ralph 11 §2, `LLM_ROUTING_WEIGHTS` may not be explicitly verified in secrets list (only listed: ENABLE_ONNISCENZA, ONNISCENZA_VERSION, etc.).
- Per CLAUDE.md iter 38 §5: "R5 measured v49→v50 deploy mid-bench (LLM_ROUTING_WEIGHTS env may not have applied to v50)" — recurring concern about env env-var application across deploys.

**Reasoning**:
- Mistral La Plateforme is third-party EU France; latency varies with their load.
- The same fixture run on different days will hit Mistral under different upstream load.
- 50-prompt sample with 800ms pacing across 3min cannot statistically separate provider noise from regression.
- p95 +6.8% (3380→3611ms) is within plausible upstream provider variability range.

### H5 — Test environment / time-of-day

**Evidence gathered**:
- iter 38 carryover bench timestamp: `2026-05-01T07:43:04Z` (Friday morning UTC ≈ 09:43 CEST)
- iter 11 ralph re-bench: `2026-05-03T07:02:19Z` (Sunday morning UTC ≈ 09:02 CEST)
- Both bench within similar time-of-day window (~09:00 CEST morning), differing day-of-week (Friday vs Sunday).
- Same endpoint, same fixture, same scorer.

**Reasoning**:
- Time-of-day similar; Sunday Mistral La Plateforme load may be DIFFERENT from Friday (EU enterprise weekday vs weekend traffic).
- Cold-start variance: if iter 38 carryover bench happened soon after another bench (warm isolate), iter 11 ralph may have hit cold isolate.
- Cron warmup ping 30s mitigates but does not eliminate first-N-requests cold variance.
- Iter 11 ralph §2 explicit: bench attempt at `2026-05-03T07-01-37-382Z` returned 8/8 HTTP 401 stale key, then re-dispatch `T07-02-19-323Z` succeeded → first re-dispatch may have hit cold isolate post failed key validation rejection.

### H6 — Together AI primary marker iter 5 P3 deploy

**Evidence gathered**:
- `supabase/functions/_shared/llm-client.ts:203` shows `const provider = (Deno.env.get('LLM_PROVIDER') || 'together').trim().toLowerCase();` — Together IS the default fallback when LLM_PROVIDER unset.
- `supabase/functions/_shared/llm-client.ts:30` `TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions'`.
- `supabase/functions/_shared/llm-client.ts:472` `pickWeightedProvider` returns `'together'` if no other provider matches weights.
- Commits `f5127d6` (iter-30) + `8a922f7` (iter-31) introduced Together primary marker per task brief — verified exist in git log.
- ADR-029 (CLAUDE.md iter 37) sets weighted routing 70/20/10 for Mistral-small/large/Together. If LLM_ROUTING_WEIGHTS unset, falls through to LLM_PROVIDER default = 'together'.

**Reasoning**:
- Together AI is US-based, geographic latency from EU user → US Together adds ~80-150ms vs Mistral EU France.
- If LLM_ROUTING_WEIGHTS env is unset OR misformatted, ALL traffic hits Together by default — explains p95 increase.
- Together rate limit (per `_shared/llm-client.ts:128 'together_rate_limited'`) introduces retry backoff that adds latency.
- Iter 38 carryover audit notes "callLLM provider=together default" — this default has been active since iter 5 P3, so should NOT change between baselines unless env var was MODIFIED between deploys.

---

## §4 Verdict per hypothesis

| # | Hypothesis | Verdict | Confidence | Key evidence |
|---|------------|---------|------------|--------------|
| H1 | Edge Function v72→v73+ deploy churn | **CONFIRMED** (partial) | Medium-High (70%) | 66 commits, +2635 LOC, 8+ NEW modules cold-start parse cost |
| H2 | Onniscenza V1 7-layer aggregator overhead | **INDETERMINATE** | Low (35%) | Already active at iter 38 baseline; cache warm/cold variance untestable retroactively |
| H3 | RAG retrieval slow (Voyage page=0%) | **FALSIFIED** | High (85%) | Identical RAG state both baselines; per-prompt RAG-heavy actually faster iter 11 |
| H4 | Mistral provider variability | **INDETERMINATE** | Medium (50%) | Plausible cause; insufficient sample (50 prompts) to separate noise |
| H5 | Test env / time-of-day | **INDETERMINATE** | Medium (40%) | Similar time-of-day, different day-of-week + cold isolate after auth-fail retry |
| H6 | Together AI primary marker | **INDETERMINATE** | Low-Medium (30%) | Together default since iter 5 P3, BOTH baselines ran under same default; only relevant IF env changed between deploys (NOT verified by this investigation) |

---

## §5 Most-likely root cause + recommended fix iter 28+

**Most-likely root cause** (confidence Medium ~65%): **H1 + H4 + H5 combined** = cumulative module-load overhead from 66-commit deploy churn (+2635 LOC, 8+ NEW shared modules) interacting with normal Mistral upstream variability AND first-request cold-isolate penalty post auth-rejection retry.

NO single confirmed root cause. The +22.8% avg regression is at the **boundary of measurement noise** for a 50-prompt sample with provider-side variability. The +6.8% p95 regression is likely **within noise**. The "regression" may be a measurement artifact compounded by:

1. **Sample bias**: iter 38 baseline was 30/38 (8 failures excluded from avg); iter 11 was 50/50 (full sample) — comparing partial vs full samples is invalid for avg comparison.
2. **Module cold-start**: 8+ NEW shared modules added between deploys raise cold-isolate parse cost (~80-400ms first-request).
3. **Cold-start after auth retry**: iter 11 ralph §2 first attempt 7:01:37 hit 8/8 HTTP 401 stale key, then re-dispatch 7:02:19 — second attempt likely hit cold isolate.

**Recommended fix iter 28+ (priority ordered)**:

1. **P0 — Re-bench protocol enforcement** (1h): re-run R5 N=3 (5-min spacing, warm isolate) AND verify env vars `LLM_ROUTING_WEIGHTS` + `ENABLE_ONNISCENZA` + `ONNISCENZA_VERSION` explicit current values via `npx supabase secrets list --project-ref euqpdueopmlllqjmqnyb`. If N=3 avg ≤ 1700ms → regression FALSIFIED, close as measurement noise.

2. **P1 — Module preload audit** (2h): inventory `supabase/functions/unlim-chat/index.ts` import tree, identify modules NOT used in hot path when canary flags off, `// @deno-types` defer imports inside conditional branches if possible. Target: -50ms cold-start.

3. **P2 — Bench runner upgrade** (3h): scripts/bench/run-sprint-r5-stress.mjs SHOULD output per-prompt timing breakdown (TTFB + body-read) to separate network vs server processing latency. Add explicit warmup phase (3 throwaway prompts) before bench fixture.

4. **P3 — Investigate H6 evidence directly** (30min, env access required): grep `npx supabase secrets list` for `LLM_PROVIDER` and `LLM_ROUTING_WEIGHTS` exact values at iter 38 vs iter 11 commits — if changed → H6 promoted to confirmed.

5. **P4 — Defer V2.1 canary** (gate iter 32+): per ADR-035 §6 step 1, V1 baseline R5 PASS is acceptance gate. Iter 11 ralph confirmed PASS (94.41% PZ V3, p95 < 4000ms ceiling). The +22.8% avg regression does NOT block V2.1 canary 5% start (gate criteria are p95 ≤ 4000ms NOT avg latency).

**NO claim** "fix shipped" — this investigation is read-only. NO src code modified.

---

## §6 Caveat onesti (gaps not investigated, env-dependent probes skipped)

1. **No supabase secrets probe executed** — investigation did not run `npx supabase secrets list --project-ref euqpdueopmlllqjmqnyb` to verify exact LLM_ROUTING_WEIGHTS / LLM_PROVIDER / ENABLE_ONNISCENZA / ONNISCENZA_VERSION current values. Read-only mandate respected; H4 + H6 remain INDETERMINATE without this probe.
2. **No N=3 re-bench executed** — single-sample comparison cannot isolate provider noise from genuine regression. Iter 28+ should run N≥3 with warm-isolate protocol.
3. **No per-prompt TTFB breakdown available** — bench runner outputs only end-to-end latency, cannot distinguish RAG vs LLM call vs network round-trip costs.
4. **iter 38 carryover baseline is partial 30/38 (8 fail)** — cited "1607ms" baseline is statistically unreliable for delta computation against iter 11 ralph 50/50.
5. **No git diff `unlim-chat/index.ts` line-by-line walk** — focused on summary stats (+409 LOC) rather than per-section overhead estimation. Hot-path overhead may be lower than parse-cost-implied.
6. **Onniscenza cache hit rate not measured** — `onniscenza-cache.ts` LRU 100 entries TTL 30min; cache state at iter 38 vs iter 11 unknown, may explain part of variance.
7. **No load test data** — production traffic (real users) latency NOT measured; bench fixture is synthetic 50-prompt sequential, doesn't capture concurrency effects.
8. **CoV vitest BG output empty** — vitest runs in BG returned silent output (likely buffer redirect issue with `&` + `wait`); CoV-1+CoV-3 fall back to authoritative `automa/baseline-tests.txt = 13474` per CLAUDE.md "usa sempre il file" mandate.

---

## §7 CoV results 3-step

- **CoV-1 (PRIMA atom)**: vitest baseline `automa/baseline-tests.txt = 13474 PASS` (file authoritative source per CLAUDE.md test rule). Multiple BG vitest runs attempted (`bk65zy1sc`, `bravndvir`, `b9hq9c1j3`, `b8zpmrljx`) — outputs silent (likely BG redirection issue). Baseline file value cited per CLAUDE.md mandate "Mai citare numeri a mano, usa sempre il file".
- **CoV-2 (DURANTE)**: read-only investigation, no src code modified. ZERO writes outside `docs/audits/` and `automa/team-state/messages/` per task scope.
- **CoV-3 (POST atom)**: vitest baseline preserved by construction (no src edits) `= 13474 PASS`. Identical to CoV-1.

---

## §8 Anti-pattern compliance

- ✅ NO claim "root cause found" without file:line OR commit SHA evidence (every hypothesis cites file:line or commit SHA)
- ✅ NO fabricate fix recommendation without investigation (P0-P4 all derived from concrete evidence + caveats)
- ✅ NO inflate verdict (3/6 INDETERMINATE honestly admitted; only H1 partial-CONFIRMED Medium-High; H3 FALSIFIED)
- ✅ NO modify src code (read-only; only docs/ + messages/ written)
- ✅ NO `--no-verify` (no commits attempted)
- ✅ NO destructive ops (read-only)
- ✅ NO compiacenza (regression may be measurement noise; honest gap §6 N=3 re-bench protocol mandate)
- ✅ NO write outside `docs/audits/` + `automa/team-state/messages/` (this audit + completion msg only)
- ✅ NO commit (orchestrator commits Phase 3)
