# Sprint Contract — Day 26 (sett-4 Day 05 local) — Harness 2.0

**Sprint**: sett-4-intelligence-foundations (Option B Karpathy LLM Wiki POC)
**Logical date**: 2026-04-22 (cumulative day 26, local sett-4 day 05)
**Committed SP**: 4 (wiki-query scaffold 2 SP + accessibility metric wire 1 SP + axe baseline generator 1 SP)

## Pre-Implementation Acceptance Criteria

### Story S4.1.5 — Edge Function `unlim-wiki-query` scaffold (2 SP)
- [x] `supabase/functions/unlim-wiki-query/index.ts` exists, Deno serve handler
- [x] POST contract: `{ query, topK?, filter? }` → `{ results, metrics, version, query }`
- [x] Validation: query required non-empty string ≤500 chars, topK ∈ [1,20] integer, filter.volume ∈ {1,2,3}
- [x] CORS + security headers reused from `_shared/guards.ts`
- [x] Mock retrieval over 3-entry seed corpus covering Vol 1/2/3
- [x] Deterministic scorer (TF-ish, stop-word aware, Italian)
- [x] Pure core logic extracted to `scripts/wiki-query-core.mjs` (Deno + Node shared)
- [x] Unit tests vitest ≥20 cases covering validation, scoring, ranking, filtering, envelope

### Story S4.2.2 — `accessibility_wcag` benchmark metric live wire (1 SP)
- [x] `scripts/benchmark-metrics/accessibility.cjs` module extracted from monolith
- [x] Reads `docs/audit/axe-baseline-latest.json` when present
- [x] Aggregates violations across routes (critical/serious/moderate/minor)
- [x] Scoring model: `score = max(0, 1 - (5c + 2s + m) / 30)` documented inline
- [x] Fallback to devDep probe (0.5) when baseline absent
- [x] Fallback to 0 when parse error
- [x] Unit tests vitest ≥10 cases covering scoring model + both branches + error path
- [x] `scripts/benchmark.cjs` refactor preserves full output (verified --fast run)

### Story S4.2.2b — `scripts/generate-axe-baseline.mjs` generator (1 SP)
- [x] CLI modes: `--input <file>` | `--from-env` | `--stub`
- [x] `--out` overrides default path
- [x] Exit codes: 0 ok / 1 bad input / 2 write failed
- [x] Validates input shape (route string + summary with 6 non-negative numeric fields)
- [x] Aggregates totals across routes in output envelope
- [x] Unit tests vitest ≥20 cases covering parse, aggregate, build, stub, CLI happy/sad paths
- [x] Direct-run detection via `fileURLToPath` (space-in-path safe)

## Test Strategy
- Vitest unit: minimum +50 new tests (target achieved: +61 — 24 wiki-query, 25 axe-gen, 12 a11y metric)
- CoV 3x full vitest suite: identical PASS count across 3 runs (achieved: 12328 × 3)
- No regression: baseline ratchet 12267 → 12328 (+61)
- Benchmark --fast regenerate after refactor (no score regression)
- Day 27: browser E2E run of `16-wiki-smoke-axe.spec.js` against deployed preview + generate real baseline (deferred, zero-violations stub NOT committed)

## Rollback Plan
- Each story in atomic commit — revert single commit if regression detected
- Benchmark metric extraction is pure refactor: `git revert` restores inline version
- Edge Function never deployed Day 26 (scaffold only), no prod impact
- Generator + core .mjs files are new-file additions — safe delete if needed

## 4-Grading Targets (Harness 2.0)
- Design Quality: ≥ 8.0 (clean module extraction, shared core pattern, pure validation)
- Originality: ≥ 7.0 (deno+node shared-logic pattern, scoped seed corpus)
- Craft: ≥ 8.5 (61 unit tests with edge cases, exit-code discipline, deterministic scorer)
- Functionality: ≥ 8.0 (all three stories contract-complete, end-to-end verified via stub)

## Success Metrics
- 12328 test passing (CoV 3x zero flaky)
- Accessibility metric live-wired (0.5 devDep fallback preserved until Day 27 real scan)
- Wiki query endpoint scaffold ready for Day 27 corpus wire
- Zero src/ touches: engine + UI untouched (contract-safe)

## Carry-Over Blockers (P3)
- ADR-003 env vars deferred sprint-5 (unchanged)
- S4.1.4c Together live dispatch awaiting Andrea gate (unchanged Day 26)

## Gap Deliberately Deferred
- Real axe browser scan → Day 27 (needs dev server or BASE_URL=prod playwright run, chromium install verify)
- Edge Function deployment → Day 27 (retrieval needs real corpus, currently mock)
- supabase/functions deploy step → Day 27 after wiki ingest
