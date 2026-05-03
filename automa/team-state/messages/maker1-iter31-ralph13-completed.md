# Maker-1 iter 31 ralph iter 13 — Wake word prod-spec equivalence atom COMPLETED

**Date**: 2026-05-03
**Atom size**: small (~5 min, single test file ~108 LOC)
**Mode**: Modalità normale (NOT caveman)
**Branch**: working tree (no commit, orchestrator owns Phase 3)

---

## Files modified

- **NEW**: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/tests/unit/services/wakeWord-spec-prod-equivalence.test.js` (108 LOC, 3 tests)
- **NEW**: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/automa/team-state/messages/maker1-iter31-ralph13-completed.md` (this file)

NO modifications to:
- `src/services/wakeWord.js` (Maker-2 ownership Sprint U closing) — read-only
- `tests/e2e/sprint-t-iter41-wake-word-9-cell.spec.js` (Tester-1 ownership) — read-only

---

## Comparison result table — prod vs spec WAKE_PHRASES

| # | Prod (`src/services/wakeWord.js:21-28`) | Spec inline (`tests/e2e/sprint-t-iter41-wake-word-9-cell.spec.js:87-92`) | Match |
|---|------------------------------------------|---------------------------------------------------------------------------|-------|
| 1 | `ehi unlim`        | `ehi unlim`        | ✓ |
| 2 | `hey unlim`        | `hey unlim`        | ✓ |
| 3 | `ei unlim`         | `ei unlim`         | ✓ |
| 4 | `ehi un lim`       | `ehi un lim`       | ✓ |
| 5 | `hey un lim`       | `hey un lim`       | ✓ |
| 6 | `ei un lim`        | `ei un lim`        | ✓ |
| 7 | `e unlim`          | `e unlim`          | ✓ |
| 8 | `ehi anelim`       | `ehi anelim`       | ✓ |
| 9 | `hey anelim`       | `hey anelim`       | ✓ |
| 10 | `ehi online`      | `ehi online`      | ✓ |
| 11 | `hey online`      | `hey online`      | ✓ |
| 12 | `ragazzi unlim`   | `ragazzi unlim`   | ✓ |
| 13 | `ragazzi un lim`  | `ragazzi un lim`  | ✓ |
| 14 | `ragazzi anelim`  | `ragazzi anelim`  | ✓ |

**Verdict**: **IDENTICAL** (14/14 entries equal, same declaration order, same single-quote string literals). Sorted-JSON equality assertion PASSES.

Tester-1 iter 12 caveat onesto risk (silent divergence between spec inline copy and prod array) is **not currently materialized** — but the equivalence test now LOCKS the invariant and will fail loudly the next time prod adds/removes a phrase without a spec update (and vice-versa).

---

## CoV results

| CoV | When | Command | Result |
|-----|------|---------|--------|
| CoV-1 | PRE atom | `npx vitest run --reporter=basic` | **13665 passed** + 15 skipped + 8 todo (13688 total) — 91.78s, 280 files passed, 1 skipped |
| CoV-2 | NEW test only | `npx vitest run tests/unit/services/wakeWord-spec-prod-equivalence.test.js` | **3 passed** (positive extract + positive equality + negative synthetic divergence guard) — 1.08s |
| CoV-3 | POST atom | `npx vitest run --reporter=basic` | **13668 passed** + 15 skipped + 8 todo (13691 total) — 118.67s, 281 files passed, 1 skipped |

**Delta**: 13665 → 13668 = **+3 NEW tests** (matches CoV-2 count). Zero regressions. Test files 280 → 281 (+1 NEW file).

---

## Caveats onesti

1. **Regex-based extractor is intentionally simple**. It matches `WAKE_PHRASES = [ ... ]` (non-greedy to first `]`) and pulls single-quoted string literals via `/'([^']+)'/g`. If a future entry contains a single quote (e.g. `it's unlim`) the regex will mis-extract — but spec + prod both currently use single-quote literals exclusively (no escapes), so this is fine for iter 13.
2. **Spec inline `WAKE_PHRASES` lives inside `page.evaluate()` callback**, not at module scope, and is not exported. The fs.readFileSync + regex approach is the only way to compare without modifying spec ownership boundary. Direct import would require Tester-1 ownership change to refactor spec to import from prod (recommended canonical fix iter 14+, see §below).
3. **Negative test uses synthetic strings**, not file mutation. It validates the extractor + equality assertion would catch a real divergence, without touching real source files.
4. **No commit issued** per atom contract — orchestrator owns Phase 3 commit.
5. **Pattern S race-cond fix not applicable** (single-agent atom, no parallel writes).
6. **Canonical source fix proposal iter 14+ (NOT executed iter 13)**: refactor `tests/e2e/sprint-t-iter41-wake-word-9-cell.spec.js:87-92` to either (a) import `WAKE_PHRASES` via Playwright `page.addScriptTag` injecting `src/services/wakeWord.js` exports, or (b) export `WAKE_PHRASES` from prod (currently const, not exported) and refactor spec to read it via fixture. Either approach removes the inline duplication entirely. Option (b) is the simpler single-source-of-truth fix but requires Maker-2 ownership of `wakeWord.js` to add the export (Sprint U closing window).
7. **No `--no-verify`, no destructive ops, no writes outside ownership**. CLAUDE.md anti-regression mandate respected.
8. **NO compiacenza**: arrays were genuinely IDENTICAL — no inflated finding manufactured. The test serves as a forward-guard, not a regression catch this iter.

---

## Summary one-liner

`tests/unit/services/wakeWord-spec-prod-equivalence.test.js` (108 LOC, 3 tests) added — verdict IDENTICAL 14/14 — vitest 13665 → 13668 (+3 NEW, zero regression).
