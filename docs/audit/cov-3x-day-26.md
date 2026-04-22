# CoV 3x Evidence — Day 26 (sett-4 Day 05)

**Date**: 2026-04-22 logical (GMT+8 wall-clock 11:08-11:11)
**Sprint**: sett-4-intelligence-foundations
**Scope**: post refactor of benchmark metric + new unit test files

## Runs

| Run | Tests | Files | Duration | Notes |
|-----|-------|-------|----------|-------|
| 1   | 12328 passed | — | 56.28s | zero flaky |
| 2   | 12328 passed | — | 57.95s | zero flaky |
| 3   | 12328 passed | — | 60.63s | zero flaky |

**Consistent**: 3/3 identical PASS count.
**Ratchet**: 12267 → 12328 (+61) — zero regression vs Day 25 baseline.

## Delta composition

- +24 `tests/unit/wiki-query-core.test.js` (Story S4.1.5 coverage)
- +25 `tests/unit/generate-axe-baseline.test.js` (Story S4.2.2b coverage)
- +12 `tests/unit/benchmark-accessibility.test.js` (Story S4.2.2 coverage)

## Changes tested (src/ untouched, scripts + supabase touched)

| File | Kind |
|------|------|
| `scripts/benchmark.cjs` | refactor — extract metric impl to module |
| `scripts/benchmark-metrics/accessibility.cjs` | new module |
| `scripts/wiki-query-core.mjs` | new shared logic |
| `scripts/generate-axe-baseline.mjs` | new CLI |
| `supabase/functions/unlim-wiki-query/index.ts` | new Edge Function (not deployed) |

## Verification

- Benchmark `--fast` regenerated: 5.31 → 5.32 (+0.01), test_count 12328 reflected.
- `accessibility_wcag` fallback behavior preserved (0.5 devDep-probe), stub deleted to avoid inflation.
- No `src/` modifications — engine safety rule maintained.

## Command log

```bash
for i in 1 2 3; do npx vitest run --reporter=dot 2>&1 | tail -4; done
# → 12328/12328/12328 all PASS
```
