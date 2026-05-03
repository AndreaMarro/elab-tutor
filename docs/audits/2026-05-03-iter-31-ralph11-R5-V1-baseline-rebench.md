# Iter 31 ralph 11 — R5 V1 baseline re-bench (Onniscenza V1 prod measurement)

**Date**: 2026-05-03 ~09:00 CEST
**Tester**: Tester-1 iter 31 ralph iter 11
**Sprint**: T close — fair comparison protocol gate ADR-035 §4
**Git HEAD pre-bench**: `ae4d24a` (post iter 10 ADR-035 design)
**Verdict**: PASS — V1 baseline confirmed prod LIVE

---

## §1 Context

Cross-link: `docs/adrs/ADR-035-onniscenza-v2-1-conversational-fusion.md` §4 bench protocol.

Per ADR-035 §6 acceptance gate step 1 ("R5 V1 baseline PASS pre-bench"), this iter 11 ralph executes the R5 50-prompt stress fixture against the production Edge Function `unlim-chat` v72+ con `ENABLE_ONNISCENZA=true` + `ONNISCENZA_VERSION=v1` (V1 7-layer aggregator `aggregateOnniscenza` `supabase/functions/_shared/onniscenza-bridge.ts:299` LIVE since iter 39 V2 revert per `docs/audits/iter-39-A4-Onniscenza-V2-REGRESSION-revert.md`).

Re-bench mandate: V1 baseline measurement is the **fair comparison protocol gate** that must PASS before V2.1 canary 5% bench iter 12+ per ADR-035 §5 decision matrix.

Iter 38 carryover R5 v56 baseline (CLAUDE.md sprint history): PZ V3 94.2% / avg 1607ms / p95 3380ms (commit `792acf8`, bench `r5-stress-report-2026-05-01T07-43-04-636Z.md`).

---

## §2 Env provision (verified 7 keys)

All 7 keys verified present pre-bench:
- ELAB_API_KEY ✓ (rotated `0909e4b4...` per CLAUDE.md iter 32; SHA-256 `a04b4398...` MATCH Edge Function expected hash)
- SUPABASE_SERVICE_ROLE_KEY ✓
- VOYAGE_API_KEY ✓
- MISTRAL_API_KEY ✓
- CLOUDFLARE_API_TOKEN ✓
- SUPABASE_ANON_KEY ✓ (~/.zshrc fallback `eyJhbGc...`)
- TOGETHER_API_KEY ✓ (~/.zshrc fallback `tgp_v1_...`)

**Caveat env discovery**: `~/.elab-credentials/sprint-s-tokens.env` contains stale ELAB_API_KEY `f673b9a0ba...` (pre-iter-32 rotation). Initial bench attempt at `2026-05-03T07-01-37-382Z` returned 8/8 HTTP 401 "bad api key" → HALT. Re-dispatch with rotated `.env` key `0909e4b4e690...` SHA-256 verified MATCH `a04b4398a8188f1be77cea91ecbcc25395df14b5a9f853da449d92af6705e089` Edge Function hash → PASS.

Recommendation iter 12+: Andrea sync `~/.elab-credentials/sprint-s-tokens.env` ELAB_API_KEY field to `.env VITE_ELAB_API_KEY` rotated value (5 min, blocks future bench iter without rotation reminder).

Edge Function secrets verified `npx supabase secrets list --project-ref euqpdueopmlllqjmqnyb`:
- `ENABLE_ONNISCENZA` set
- `ONNISCENZA_VERSION` set (V1 active per ADR-035 §1)
- `ENABLE_ONNISCENZA_V21` set (V2.1 selector path env-gated, currently V1 default)
- `CANARY_ONNISCENZA_V21_PERCENT` set
- `ENABLE_INTENT_TOOLS_SCHEMA` + `ENABLE_SSE` + `ONNISCENZA_CACHE_ENABLED` + `CANARY_DENO_DISPATCH_PERCENT` set

---

## §3 Bench execution

- **Timestamp**: `2026-05-03T07-02-19-323Z`
- **Endpoint**: `https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat` (Edge Function v72+ LIVE prod)
- **Fixture**: `scripts/bench/r5-fixture.jsonl` 50 prompts (6 categories: 10 plurale_ragazzi + 10 citation_vol_pag + 8 sintesi_60_parole + 6 safety_warning + 6 off_topic_redirect + 10 deep_question)
- **Runner**: `scripts/bench/run-sprint-r5-stress.mjs` (322 LOC)
- **Scorer**: `scripts/bench/score-unlim-quality.mjs` 12 PZ V3 rules official
- **Auth**: apikey + Authorization Bearer (anon JWT) + X-Elab-Api-Key
- **Pacing**: 800ms between requests
- **Duration**: ~3min (50 sequential prompts ~1.4s avg/prompt + 800ms pacing)
- **Completion status**: 50/50 success, 0 failures

Output files (`scripts/bench/output/`):
- `r5-stress-report-2026-05-03T07-02-19-323Z.md` (12075 B, 100+ LOC)
- `r5-stress-scores-2026-05-03T07-02-19-323Z.json` (108338 B, 12-rule per-fixture breakdown)
- `r5-stress-responses-2026-05-03T07-02-19-323Z.jsonl` (33329 B, 50 entries)

---

## §4 R5 V1 baseline metrics

### Aggregate

| Metric | Value | Status |
|--------|-------|--------|
| Success rate | 50/50 (100%) | PASS |
| PZ V3 overall | **94.41%** | PASS (≥85% gate) |
| Verdict | PASS | PASS (≥90% R5 hard gate) |
| Latency avg | 1974ms | — |
| Latency p50 | 1968ms | — |
| Latency p95 | 3611ms | — |
| Latency min | 609ms | — |
| Latency max | 5060ms | — |
| Avg word count | 44 (target ≤60) | PASS |

### Per-category breakdown

| Category | n | avg score | pass ≥85% | latency avg |
|----------|---|-----------|-----------|-------------|
| plurale_ragazzi | 10 | 91.8% | 8/10 | 1907ms |
| citation_vol_pag | 10 | 96.9% | 10/10 | 1258ms |
| sintesi_60_parole | 8 | 97.0% | 8/8 | 1821ms |
| safety_warning | 6 | 95.3% | 6/6 | 2070ms |
| off_topic_redirect | 6 | 91.5% | 6/6 | 2702ms |
| deep_question | 10 | 93.8% | 9/10 | 2384ms |

Per-fixture scores categories:
- plurale_ragazzi: [83, 100, 100, 93, 89, 100, 89, 82, 93, 89]
- citation_vol_pag: [92, 100, 100, 100, 100, 89, 89, 100, 100, 100]
- sintesi_60_parole: [93, 100, 92, 100, 100, 100, 92, 100]
- safety_warning: [100, 92, 100, 89, 91, 100]
- off_topic_redirect: [100, 87, 87, 87, 100, 87]
- deep_question: [93, 89, 82, 100, 100, 93, 100, 89, 100, 93]

**Failed fixtures (score <85%)**: 3/50 = **6% failure rate**
- r5-001 plurale_ragazzi 83% (FAIL citation_vol_pag MEDIUM + analogia MEDIUM)
- r5-016 plurale_ragazzi 82% (per scores)
- r5-013 deep_question 82% (per scores)

---

## §5 Comparison vs iter 38 carryover baseline

| Metric | iter 38 carryover (commit `792acf8`) | iter 11 ralph (this iter) | Delta |
|--------|--------------------------------------|---------------------------|-------|
| Success rate | 49/50 (98%) | 50/50 (100%) | +2pp |
| PZ V3 overall | 94.2% | 94.41% | +0.21pp |
| Latency avg | 1607ms | 1974ms | **+22.8% slower** |
| Latency p95 | 3380ms | 3611ms | +6.8% slower |
| Verdict | PASS | PASS | maintained |

**Observation**: PZ V3 quality preserved (+0.21pp marginal lift, within scoring noise). Latency avg +22.8% regression vs iter 38 carryover baseline. p95 +6.8% modest regression.

**Latency regression hypothesis** (NOT verified, requires iter 12+ investigation):
1. Edge Function additional layers landed iter 39+ (cap_words 150 logic, dispatcher canary 0% but code path overhead, SSE wire-up `unlim-chat/index.ts:43,591-684` ENABLE_SSE gate 598)
2. Cron warmup HEAD ping 30s may have cooled between bench runs (cold starts)
3. ENABLE_ONNISCENZA + ENABLE_ONNISCENZA_V21 dual-gate runtime cost (env check overhead per request, marginal)
4. Mistral/Together routing latency variability (provider-side, network conditions)

**Latency p95 vs ADR-035 §5 V2.1 ramp gate**: V1 baseline 3611ms < projected V2.1 ramp gate p95 ≤ V1 + 10% = 3611 × 1.10 = **3972ms ceiling iter 12+ V2.1 canary bench gate**.

---

## §6 Decision iter 12+ ratify ADR-035 §5 decision matrix paths

V1 baseline R5 measurements iter 11 ralph **PASS all ADR-035 §6 acceptance gates step 1**:
- ✓ 50/50 success (gate met)
- ✓ PZ V3 94.41% ≥ 90% (sanity gate met)
- ✓ Latency p95 3611ms ≤ 4000ms (sanity ceiling met)

**Andrea ratify queue iter 12+ entrance** (per ADR-035 §6 step 2):
1. ADR-035 design ratify (PROPOSED → ACCEPTED status flip, 5 min review master plan §6)
2. Env provision SUPABASE_SERVICE_ROLE_KEY + VOYAGE_API_KEY shell active (already ✓ this iter)
3. V2.1 canary 5% deploy `ONNISCENZA_VERSION=v2_1` + `CANARY_ONNISCENZA_V21_PERCENT=5` (Andrea env flip command per ADR-035 §4 line 213-215)
4. Re-execute R5 50-prompt iter 12 entrance (this iter 11 ralph framework re-usable)
5. Compare R5 V2.1 canary metrics vs this iter 11 V1 baseline per ADR-035 §5 decision matrix three exit paths:
   - **RAMP 25%** if V2.1 PZ V3 ≥ 94.41% AND p95 ≤ 3972ms AND anti_absurd <5%
   - **STAY canary 5%** if V2.1 PZ V3 ≥ 93.91% AND p95 ≤ 3791ms AND anti_absurd <5%
   - **REVERT** if V2.1 PZ V3 < 93.91% OR p95 > 3972ms OR anti_absurd ≥5%

**Iter 11 ralph anti-pattern enforced**: V2.1 implementation `aggregateOnniscenzaV21` shipped iter 41 commit `2abe26d` (file `_shared/onniscenza-conversational-fusion.ts` 142 LOC verified iter 10 design) — **NOT activated production this iter 11**. V1 baseline measurement only iter 11.

---

## §7 Caveat onesti

1. **R5 v56 8/38 failures rate 21% iter 38 carryover §1 caveat**: Iter 38 carryover bench `r5-stress-report-2026-05-01T07-43-04-636Z` reported 8/38 (~21%) failures in r5-031..038 (sintesi_60_parole + safety_warning + off_topic_redirect categories). **Iter 11 ralph this re-bench**: failure rate dropped to **3/50 = 6%** (3 fixtures <85%, 47 fixtures ≥85%). Per-category sintesi_60_parole 8/8 PASS (100%), safety_warning 6/6 PASS (100%), off_topic_redirect 6/6 PASS (100%). Iter 38 carryover §1 caveat 21% rate **DOES NOT persist** iter 11. Hypothesis: Edge Function v72+ has stabilized between iter 38 carryover (v56) and iter 11 ralph (current LIVE) — Mistral function calling shouldUseIntentSchema heuristic may have reduced rejection rate on non-action prompts.

2. **Latency +22.8% regression vs iter 38 carryover**: NOT investigated this iter 11 (root cause hypotheses §5 above). Iter 12+ Andrea verify cron warmup status + re-bench during low-traffic window for steady-state measurement.

3. **3 failed fixtures detail** NOT root-caused this iter 11:
   - r5-001 plurale_ragazzi 83% — citation_vol_pag MEDIUM + analogia MEDIUM (LED prompt missing Vol/pag)
   - r5-016 plurale_ragazzi 82% — sub-rule failures unverified (need scores JSON inspection)
   - r5-013 deep_question 82% — sub-rule failures unverified

4. **No build re-run iter 11 ralph** (~14min heavy, defer iter 12+ entrance pre-flight CoV mandate).

5. **CoV-1+CoV-3 baseline preserved**: vitest 13665 PASS pre+post bench (zero regression). Test count matches CLAUDE.md current baseline (NOT 12290 file `automa/baseline-tests.txt` which appears stale documentation, not blocker).

6. **No commits this iter 11 ralph** (orchestrator commits Phase 3 per task mandate).

7. **Stale ELAB_API_KEY tokens env file**: discovered iter 11 entrance, Andrea sync mandate iter 12+ (Phase 0 safety prevent future bench HALT pattern).

---

## §8 Files refs

- Bench output: `scripts/bench/output/r5-stress-{report,responses,scores}-2026-05-03T07-02-19-323Z.{md,jsonl,json}`
- Bench runner: `scripts/bench/run-sprint-r5-stress.mjs`
- Bench scorer: `scripts/bench/score-unlim-quality.mjs` (12 PZ V3 rules)
- Bench fixture: `scripts/bench/r5-fixture.jsonl` (50 prompts)
- ADR cross-link: `docs/adrs/ADR-035-onniscenza-v2-1-conversational-fusion.md`
- V1 baseline ref: `docs/audits/iter-39-A4-Onniscenza-V2-REGRESSION-revert.md`
- Iter 38 carryover R5 v56 ref: `scripts/bench/output/r5-stress-report-2026-05-01T07-43-04-636Z.md`
- Stale tokens env (Andrea sync iter 12+): `~/.elab-credentials/sprint-s-tokens.env`
- This audit: `docs/audits/2026-05-03-iter-31-ralph11-R5-V1-baseline-rebench.md`

---

## §9 Anti-pattern enforced (per task mandate iter 31 ralph 11)

- ✓ NO claim "V2.1 LIVE" (V1 baseline only iter 11, V2.1 implementation deferred iter 12+)
- ✓ NO inflate score (raw measurements reported: 94.41% / 1974ms avg / 3611ms p95 / 50/50 success)
- ✓ NO modify Edge Function deploy this iter (env secrets verified read-only)
- ✓ NO write outside `docs/audits/` + `automa/team-state/messages/` + `scripts/bench/output/`
- ✓ NO --no-verify (pre-commit hook respected — no commits this iter)
- ✓ NO destructive ops
- ✓ NO commit (orchestrator commits Phase 3)
