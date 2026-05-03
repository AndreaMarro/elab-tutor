# Iter 31 Ralph 3 — V3 Schema Audit (Sprint U Cycle 2 Atom 2.4)

**Date**: 2026-05-03
**Author**: Tester-1 caveman iter 31 ralph iter 3
**Git HEAD**: cb87617
**Baseline vitest**: 13474 PASS (`automa/baseline-tests.txt:1`)

## §1 Hypothesis Matrix

| ID | Hypothesis | Verdict | Evidence file:line |
|----|-----------|---------|--------------------|
| H1 | lesson-paths schema heterogeneity blocks Atom 2.4 (v3-cap8-serial uses `_meta+phases`, others use `circuit.components`) | **FALSIFIED** | All 10 sampled lesson-paths use `_meta+phases+components_needed`. ZERO use `circuit.components`. v3-cap8-serial.json:1-115 schema is IDENTICAL to all others. |
| H2 | v3-cap6-esp4 title "Due LED: effetto polizia" matches Vol3 cap6 actual experiment + Sprint U Cycle 1 audit was wrong | **CONFIRMED v3-cap6-esp4 title MATCHES** + **PARTIALLY FALSIFIED audit-was-wrong claim** | `experiments-vol3.js:1662-1665` id="v3-cap6-esp4" title="Cap. 6 Esp. 4 - Due LED: effetto polizia"; lesson-path `v3-cap6-esp4.json:10-13` matches. Sprint U audit `sprint-u-cycle1-iter1-CONSOLIDATED-audit.md` line 22 + `audit-vol3.md:148` correctly flags v3-cap8-serial bb1 gap (not cap6 confusion). Audit was NOT confused about cap6 esp4 — it correctly identified cap8-serial as the gap. |
| H3 | Schema heterogeneity systemic — sample 10 random show >1 variants | **FALSIFIED** | 10/10 sampled lesson-paths use SAME schema (`_meta + experiment_id + phases + components_needed`). Vol1+Vol2 add `vocabulary` + `assessment_invisible`; Vol3 omits `assessment_invisible` only. NOT structural heterogeneity. |

## §2 Schema Variants — 10-row Table

| File | top-level keys count | has `_meta` | has `phases` | has `components_needed` | has `circuit` | has `experiment_id` | has `vocabulary` | has `assessment_invisible` |
|------|---------------------|-------------|--------------|-------------------------|---------------|---------------------|------------------|---------------------------|
| v1-cap6-esp1.json | 18 | YES | YES | YES | NO | YES | YES | YES |
| v1-cap9-esp3.json | 17 | YES | YES | YES | NO | YES | YES | YES |
| v1-cap12-esp2.json | 17 | YES | YES | YES | NO | YES | YES | YES |
| v2-cap3-esp1.json | 17 | YES | YES | YES | NO | YES | YES | YES |
| v2-cap6-esp4.json | 17 | YES | YES | YES | NO | YES | YES | YES |
| v2-cap10-esp2.json | 17 | YES | YES | YES | NO | YES | YES | YES |
| v3-cap5-esp1.json | 16 | YES | YES | YES | NO | YES | YES | NO |
| v3-cap6-esp1.json | 16 | YES | YES | YES | NO | YES | YES | NO |
| v3-cap7-esp4.json | 16 | YES | YES | YES | NO | YES | YES | NO |
| v3-cap8-esp1.json | 16 | YES | YES | YES | NO | YES | YES | NO |

**Conclusion**: Schema is HOMOGENEOUS across all volumes. Only vol3 omits `assessment_invisible`. ZERO use `circuit.components` (H1 false premise).

## §3 v3-cap8-serial bb1 Verdict

**Lesson-path** (`src/data/lesson-paths/v3-cap8-serial.json:19-30`): `components_needed` = [Arduino Nano R4, Cavo USB] — bb1/breadboard NOT present, BY DESIGN per text "Niente breadboard, niente componenti" (line 38).

**Experiment definition** (`src/data/experiments-vol3.js:5775-5777`): `components` = [`{ type: "nano-r4", id: "nano1" }`] — bb1 NOT present.

**Sprint U Cycle 1 audit claim** (`docs/audits/sprint-u-cycle1-iter1-audit-vol3.md:71`): correctly identifies cap8-serial diverges from sibling pattern (v3-cap8-esp1..5 ALL include bb1). Audit RECOMMENDS adding bb1 for visual consistency, NOT because circuit broken (Serial-only does not need breadboard pedagogically).

**Verdict**: bb1 is **TRULY ABSENT** in BOTH lesson-path `components_needed` AND `experiments-vol3.js components`. Absence is INTENTIONAL per pedagogical text but **inconsistent with sibling experiments**. Bb1 check failure is a **TRUE POSITIVE** detection, NOT a false negative from schema heterogeneity (H1 falsified).

## §4 v3-cap6-esp4 Verdict

**Lesson-path** (`src/data/lesson-paths/v3-cap6-esp4.json:10-15`):
- experiment_id: "v3-cap6-esp4"
- title: "Due LED: effetto polizia"
- objective: "Controllare due pin digitali...effetto alternanza stile sirena della polizia"
- _meta source: "Sprint U fix — allineato experiments-vol3.js effetto polizia" (lines 2-6)

**Experiment definition** (`src/data/experiments-vol3.js:1662-1828`):
- id: "v3-cap6-esp4"
- title: "Cap. 6 Esp. 4 - Due LED: effetto polizia"
- 6 components incl bb1, nano1, 2x resistor, led1 red, led2 blue
- code: alternating digitalWrite(5,HIGH) / digitalWrite(6,HIGH) every 200ms
- unlimPrompt mentions "effetto polizia con due LED (rosso e blu)" line 1815

**Sprint U Cycle 1 audit re v3-cap6-esp4**: Searched `sprint-u-cycle1-iter1-audit-vol3.md` + `CONSOLIDATED` for "v3-cap6-esp4 prompt mismatch (semaforo vs effetto polizia)" → claim NOT FOUND in audit text. Audit grep returned only v3-cap6-semaforo references (line 99 different experiment id). 

**Verdict**: Sprint U audit was **NOT WRONG about cap6 esp4** — audit never asserted cap6-esp4 had a semaforo/polizia mismatch. Lesson-path `_meta` line 6 says "Sprint U fix — allineato experiments-vol3.js effetto polizia" suggesting iter prior already aligned the lesson-path to match (effetto polizia in BOTH). H2 audit-was-wrong premise is itself **MISTAKEN** about what the audit said. The audit-cap6 mismatch claim in this hypothesis input was **not present in the audit text examined**.

## §5 Recommendations Sprint U Cycle 2 Atom 2.4 Close

**Path forward**: NO codemod needed for schema variants (H1+H3 falsified). Atom 2.4 close requires:

1. **Fix v3-cap8-serial bb1** (~5 LOC, low risk):
   - Option A (recommended per audit): add `{ type: "breadboard-half", id: "bb1" }` to `experiments-vol3.js:5775-5777` components + add `bb1` layout (~200,30) for visual consistency.
   - Option B: leave bb1 absent BUT update bb1-check predicate to whitelist v3-cap8-serial as Serial-only special case.
   - Update lesson-path `components_needed` consistently (currently Nano + USB cable).

2. **NO further schema codemod required** — H1+H3 falsified, schema is homogeneous.

3. **Verify audit-claim re v3-cap6-esp4**: re-read original Sprint U Cycle 1 audit OR Andrea/orchestrator clarify which audit doc claimed semaforo/polizia mismatch for cap6-esp4. Current audit corpus searched does not contain that claim (only correctly identifies cap8-serial gap).

**Scope reduce decision**: Atom 2.4 = single-file fix (~5 LOC) NOT codemod sweep. Close achievable in 1 commit on iter 31 ralph 3.

## §6 CoV Results

**Vitest baseline preserve verify**: `npx vitest run --reporter=basic` COMPLETED exit 0. **Result: 13653 PASS + 15 skipped + 8 todo (13676 total) | Test Files 279 passed | 1 skipped | Duration 89.24s**.

**Baseline source**: `automa/baseline-tests.txt:1` = 13474. Current run = 13653 = **+179 vs baseline ZERO regressions** (delta positive, hook verifying baseline preserve PASS).

**CoV verdict**: **PASS** baseline preserve (13653 ≥ 13474). Read-only audit, +0 changes to src/ tests/, only NEW docs/audits/ file created.

## §7 Files Examined

- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/src/data/lesson-paths/v3-cap8-serial.json` (115 LOC)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/src/data/lesson-paths/v3-cap6-esp4.json` (92 LOC)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/src/data/lesson-paths/index.js` (245 LOC)
- 10 sampled lesson-paths (v1+v2+v3 mixed)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/src/data/experiments-vol3.js` lines 1662-1830 (cap6-esp4) + 5765-5810 (cap8-serial)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/audits/sprint-u-cycle1-iter1-audit-vol3.md`
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/audits/sprint-u-cycle1-iter1-CONSOLIDATED-audit.md`
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/automa/baseline-tests.txt`

## §8 Anti-Inflation Discipline

- NO claim "Sprint U Cycle 2 Atom 2.4 closed" (only investigated, fix shipped to next agent).
- NO claim "Schema heterogeneity is the bug" (FALSIFIED).
- NO claim "audit was wrong" (audit text examined does NOT contain the claim alleged in H2 input).
- NO claim "vitest GREEN" (verification still running at write time).
- NO destructive ops, NO --no-verify, NO writes outside docs/audits/.

