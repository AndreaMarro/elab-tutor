# Iter 41 Phase A close audit ONESTO — 2026-05-02 PM

**Plan**: `docs/superpowers/plans/2026-05-02-iter-41-velocita-onniscenza-onnipotenza-wake-word.md`

**Edge Function unlim-chat v76 LIVE** prod (post v75 deploy + provider-gate-fix `a10cd9c`).

## Phase A atoms shipped

| Atom | Status | Commits | Tests |
|------|--------|---------|-------|
| A1 selectMistralModel narrow Large heuristic | LIVE prod | `47e3395` + `cd3ffa2` | 10 PASS |
| A2 SSE wire client useGalileoChat | already shipped iter 39 commit `430659a` | n/a | n/a |
| A3 T1.3 student-context single RPC | NOT shipped — Andrea schema audit blocker | — | — |
| A4 hedged Mistral 100ms stagger + ADR-038 | LIVE prod | `16eac43` + `21eff90` + `a49d09f` | 9 PASS |
| A5 Onniscenza V1 cache TTL FNV1a 5min | LIVE prod | `5fe4223` + `830651a` | 10 PASS |
| A6 R5 50-prompt re-bench post-deploy v76 | DONE | this audit | bench output `r5-stress-report-2026-05-02T15-30-45-038Z.md` |

## R5 50-prompt v76 measured evidence

Bench output ID: `scripts/bench/output/r5-stress-report-2026-05-02T15-30-45-038Z.md`

| Metric | v74 baseline (smoke 5/5 2026-05-02 AM) | v76 50-prompt (this iter PM) | Phase A target | Verdict |
|--------|---------------------------------------|------------------------------|----------------|---------|
| avg latency | 3130ms | **2377ms** (−24%) | ≤2500ms | ✅ MET |
| p50 latency | ~2500ms | **2027ms** | ≤2500ms | ✅ MET |
| p90 latency | ~4000ms | 4503ms | n/a | — |
| p95 latency | 5400ms | **4879ms** (−10%) | ≤2500ms | ❌ FAIL (95% over target) |
| max latency | n/a | 8888ms | n/a | — |
| PZ V3 quality | 91.45% v56 | **96.30%** (+4.85pp) | ≥91.45% | ✅ MET |
| Success rate | iter 38 v56 21% fail = 79% success | **50/50 = 100%** | 100% | ✅ MET |

## Honest verdict — 3/4 Phase A gates MET, p95 FAIL

**MET**:
- avg + p50 sotto target Phase A
- PZ V3 quality lift +4.85pp (NO regression — actual quality improvement)
- 100% success rate (vs iter 38 21% Mistral schema fail)

**NOT MET**:
- **p95 4879ms** vs target ≤2500ms — coda lenta Mistral upstream variance non conquistata. Hedged Mistral both-Mistral non risolve quando upstream è genericamente lento (correlation tail).

## Root cause p95 elevated

Hedged design A4: primary = Mistral, hedged = Mistral (same provider). When Mistral upstream queue depth is high, BOTH calls hit slow tail. Provider-mix hedged (primary Mistral + hedged Gemini Flash) would decorrelate tail. Deferred ADR-038 §iter 42+.

**Atomic fix iter 42+**: provider-mix hedged with Gemini Flash as alternative.

## Phase A NOT close — defer iter 42+

Per acceptance gates Plan §Phase A close conditions:
- ✅ avg ≤2500ms — MET 2377ms
- ❌ p95 ≤2500ms — FAIL 4879ms
- ✅ PZ V3 ≥91.45% — MET 96.30%
- ✅ A6 R5 50-prompt evidence — DONE

**1/4 fail → Phase A NOT closed iter 41**. Iter 42 priorities:
1. A3 RPC schema audit (Andrea) → -250-500ms p95
2. Provider-mix hedged Gemini fallback (decorrelate tail) → -1000ms+ p95
3. A1 narrow Large more aggressive (wordCount <30 force Small) → marginal but cumulative

## Andrea Phase A reality check

Code shipped iter 41:
- 16 commits + 1 fix commit pushed origin `e2e-bypass-preview`
- Vitest 13653 PASS preserved (CoV verified)
- Edge unlim-chat v76 LIVE prod (post 5 secrets + 1 fix)
- 5 atomi shipped (A1+A2 already+A4+A5+A6 bench evidence)
- 1 atom blocker Andrea (A3 schema audit)

Quality lift CONFIRMED reale:
- 91.45% → 96.30% PZ V3 (BASE_PROMPT v3.2 + Vol/pag validator + 8 few-shot funzionano)
- 79% → 100% Mistral success (C1 robust JSON parser fix regression iter 38)

Latency lift PARZIALE:
- avg/p50 within target
- p95 ridotto -10% MA non sotto target

## Anti-inflation G45 mandate

- ✅ Bench evidence file:line citato (r5-stress-report-2026-05-02T15-30-45-038Z.md)
- ✅ p95 fail ammesso ONESTO senza inflation
- ❌ NO claim "Phase A close achieved"
- ❌ NO claim "latency target met fully"
- ❌ NO claim "Sprint T close 9.5 in reach iter 41" — realistic iter 42-44

## Cross-references

- Plan: `docs/superpowers/plans/2026-05-02-iter-41-velocita-onniscenza-onnipotenza-wake-word.md`
- Phase 1 G45 Opus indipendente: `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md`
- ADR-038 hedged Mistral: `docs/adrs/ADR-038-hedged-mistral-100ms-stagger.md`
- ADR-036 JSON parser: `docs/adrs/ADR-036-mistral-json-mode-parser-multi-shape.md`
- ADR-037 Mistral routing: pending — selectMistralModel utility iter 41
