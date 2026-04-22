# CoV 3x — Day 25 (sett-4 Day 04)

**Date**: 2026-04-25
**Baseline pre-commit**: 12248 (carry Day 24)
**Baseline post-commit**: **12267** (+19 from `tests/unit/wiki-dispatch-batch.test.js`)
**Branch**: `feature/sett-4-intelligence-foundations`

## Runs

| # | Time | Tests passed | Files | Duration | Consistent |
|---|------|--------------|-------|----------|------------|
| 1 | 09:25:04 | 12267 | 214 | 336.96s | — |
| 2 | 09:30:45 | 12267 | 214 | 365.70s | ✅ |
| 3 | 09:36:57 | 12267 | 214 | 338.40s | ✅ |

**Verdict**: 3/3 runs identical 12267 PASS, zero flaky, deterministic. Run durations 336.96s / 365.70s / 338.40s (mean 347s).

## Delta vs Day 24

- Day 24 baseline 12248 (CoV 3/3 deterministic)
- Day 25 baseline 12267 (+19 unit tests from `tests/unit/wiki-dispatch-batch.test.js`)
- Test files 213 → 214 (+1)
- Ratchet discipline met: +19 above +15/day Harness 2.0 floor (just above)

## Coverage of new script

Tests cover:
- `wiki-dispatch-batch.mjs` — 19 cases:
  - mapErrorCode (6): 401/429/502/400/422/unknown
  - estimateInputTokens (2): non-string handling, ~1 token per 4 chars
  - estimateCostUsd (3): zeros, known-content 1-record, multi-record aggregation
  - validateLine (5): malformed JSON, missing custom_id, missing body, empty messages, valid
  - validateJsonlContent (3): duplicate detection, blank-line ignore, multi-error aggregation

No src/ touched (isolation preserved — engine lock intact).

## Notes

- PTC code_execution container still deferred Day 26+ (GAP-DAY24-03 carry); serial bash remains semantically identical.
- Single-run wall-clock ~340s (up vs Day 24 ~80s due to extra test files + CI caching differences post audit-fix).
