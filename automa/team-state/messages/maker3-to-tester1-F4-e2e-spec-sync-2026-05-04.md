# Coordination msg: Maker-3 → Tester-1 — E2E spec WAKE_PHRASES sync drift

**From**: Maker-3 (Wake word + Voxtral diagnostic, iter 35 Phase 2)
**To**: Tester-1 (E2E spec owner — `tests/e2e/`)
**Date**: 2026-05-04
**Iter**: 35 Phase 2

## Sync drift introduced (intentional, requires Tester-1 fix)

F4 atom this iter expanded `src/services/wakeWord.js` `WAKE_PHRASES` array
from 14 → 16 entries (added 'ok unlim' + 'okay unlim' for pronunciation
varianti coverage per Andrea diagnostic mandate).

The E2E spec `tests/e2e/sprint-t-iter41-wake-word-9-cell.spec.js` lines 87-92
contains an **inline copy** of `WAKE_PHRASES` (per Tester-1 iter 12 caveat
about single-source-of-truth divergence). The equivalence test
`tests/unit/services/wakeWord-spec-prod-equivalence.test.js` now fails:

```
Expected: [...prod with 'ok unlim','okay unlim'...]
Received: [...spec without 'ok unlim','okay unlim'...]
```

## Action requested Tester-1

Update `tests/e2e/sprint-t-iter41-wake-word-9-cell.spec.js` lines 87-92 to
add `'ok unlim'` + `'okay unlim'` to the inline `WAKE_PHRASES` array.

### Patch suggestion

```diff
-          const WAKE_PHRASES = [
-            'ehi unlim', 'hey unlim', 'ei unlim', 'ehi un lim',
-            'hey un lim', 'ei un lim', 'e unlim', 'ehi anelim',
-            'hey anelim', 'ehi online', 'hey online',
-            'ragazzi unlim', 'ragazzi un lim', 'ragazzi anelim',
-          ];
+          const WAKE_PHRASES = [
+            'ehi unlim', 'hey unlim', 'ei unlim', 'ehi un lim',
+            'hey un lim', 'ei un lim', 'e unlim', 'ehi anelim',
+            'hey anelim', 'ehi online', 'hey online',
+            'ragazzi unlim', 'ragazzi un lim', 'ragazzi anelim',
+            // Iter 35 Phase 2 F4 — pronunciation varianti
+            'ok unlim', 'okay unlim',
+          ];
```

### Verification

After patch, run:
```bash
npx vitest run tests/unit/services/wakeWord-spec-prod-equivalence.test.js
```

Expected: 3/3 PASS (currently 2/3 — `positive: prod and spec WAKE_PHRASES
are identical (sorted equality)` fails).

### Why E2E spec inline copy exists

Per Tester-1 iter 12 caveat: Playwright `page.evaluate` runs in browser
context where the prod source isn't directly importable, so the array is
duplicated inline. The equivalence test was added precisely to detect this
sync drift early. It's working as designed — flagging this F4 expansion
that needs your follow-up.

## Honesty caveats

1. **Maker-3 cannot edit `tests/e2e/`** — file ownership rigid per iter 35
   Phase 2 5-agent OPUS Pattern S r3 PHASE-PHASE rules. This is the correct
   coordination path.
2. **F4 atom shipped intentionally before E2E sync** — F4 unit test
   coverage in `tests/unit/services/wakeWord.test.js` (mine) already verifies
   new phrases trigger detection (6/6 PASS). E2E sync is hygiene + future
   regression guard, not a deploy blocker.
3. **No iter 35 Phase 2 deploy until E2E sync lands** — prod can deploy F4
   (functional behavior tested) but the equivalence test failure should be
   resolved before next iter pre-flight CoV gate.

## Reference

- Prod source: `src/services/wakeWord.js` lines 26-39
- E2E spec inline: `tests/e2e/sprint-t-iter41-wake-word-9-cell.spec.js` lines 87-92
- Equivalence test (FAIL post-F4): `tests/unit/services/wakeWord-spec-prod-equivalence.test.js`
- F4 unit tests (PASS post-F4): `tests/unit/services/wakeWord.test.js` lines 137-202
- F2 browser audit (Andrea Chrome 147 mac granted): `docs/audits/2026-05-04-iter-35-maker3-F2-browser-audit.md`
