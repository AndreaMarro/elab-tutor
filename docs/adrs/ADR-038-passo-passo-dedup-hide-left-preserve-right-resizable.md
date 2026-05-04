# ADR-038 — Passo Passo dedup hide LEFT preserve RIGHT resizable

**Status**: ACCEPTED iter 35 (Andrea screenshot evidence 2026-05-04 PM)
**Date**: 2026-05-04
**Iter**: 35 mandate 7 K1
**Deciders**: Andrea Marro (founder)
**Author**: Claude Opus 4.7 (orchestrator inline architect)

---

## Context

Andrea screenshot 2026-05-04 PM shows simultaneous render dual Passo Passo panels in Lavagna mode:

1. **LEFT**: `PercorsoCapitoloView` overlay side panel (LavagnaShell.jsx:1317-1332). Sprint S iter 2 chapter overview component. Shows "Vol. 1 — Capitolo 6" + esperimenti list (v1-cap6-esp1, v1-cap6-esp2, v1-cap6-esp3). Fixed sidebar 25% viewport width.

2. **RIGHT**: `FloatingWindowCommon` LessonReader (LavagnaShell.jsx:1337-1368). Atom A5 iter 36 — resizable + draggable + zIndex 10001. Shows "PRONTI A MONTARE!" step instruction.

Both render conditions OVERLAP:
- LEFT: `activeCapitoloId !== null`
- RIGHT: `modalita === 'passo-passo'`

When user enters Passo Passo mode + has activeCapitoloId set, both visible simultaneously → Andrea pain "qui ci sono sovrapposizioni".

Andrea explicit feedback 2026-05-04 PM: **"tipo qui dovrebbe esserci solo quello a destra resizabile"** — RIGHT FloatingWindowCommon resizable preferito, LEFT side panel da nascondere.

## Decision

**Hide LEFT PercorsoCapitoloView when modalita === 'passo-passo'**.

Implementazione (orchestrator inline iter 35 K1):
```jsx
{activeCapitoloId && modalita !== 'passo-passo' && (
  <div className={css.percorsoCapitoloOverlay} ...>
    <PercorsoCapitoloView ... />
  </div>
)}
```

**Preserve RIGHT FloatingWindowCommon** unchanged (resizable + draggable + zIndex 10001 stay).

## Alternatives considered

### A. Hide RIGHT, preserve LEFT (rejected)
- Master plan iter 36-38 K1 originale interpretazione
- Pros: PercorsoCapitoloView already wraps LessonReader (tutorial nested)
- Cons: violates Andrea explicit screenshot feedback "solo quello a destra resizabile"
- **Rejected** — Andrea preferenza UX RIGHT FloatingWindow resizable + draggable

### B. Hide both, render unified component (rejected)
- Refactor PercorsoCapitoloView + LessonReader into single FloatingWindow
- Pros: cleaner architecture
- Cons: ~200 LOC refactor + breaks Sprint S iter 2 contract + risks regression
- **Rejected** — surgical 5-LOC fix safer than refactor

### C. Toggle button user-controlled (deferred K3)
- Add collapse/expand button on LEFT panel
- User chooses to show/hide
- **Deferred** to K3 iter 35 WebDesigner-1 atom (~40 LOC, P1 priority)

## Consequences

### Positive
- Andrea immediate pain resolved (visual sovrapposizione gone)
- Surgical 5-LOC change zero regression risk
- LEFT PercorsoCapitoloView still accessible Percorso mode (NOT hidden globally)
- RIGHT FloatingWindowCommon resizable + draggable user-friendly UX preserved

### Negative
- LEFT chapter overview disappears when user switches Passo Passo (loses context overview)
- Mitigation K3 WebDesigner-1 toggle button iter 35 (collapse/expand opt-in)
- Mitigation: RIGHT FloatingWindowCommon empty state plurale "Ragazzi, scegliete un esperimento dalla lista" + "Aprite il kit ELAB e trovate l'esperimento nel volume" already exists line 1349-1359 (iter 36 A5 PRINCIPIO ZERO + kit mention)

### Neutral
- Sprint S iter 2 PercorsoCapitoloView rendering rule changes (ALWAYS → conditional) — existing E2E specs may need update if they assert presence in Passo Passo
- Tester-1 K4 E2E spec NEW asserts ONE Passo Passo window visible

## Verification

Testing:
1. **Manual smoke** (Andrea Chrome MCP): navigate `/lavagna` → Percorso → activeCapitoloId set → switch Passo Passo → assert LEFT PercorsoCapitoloView NOT visible + RIGHT FloatingWindowCommon visible
2. **E2E spec** `tests/e2e/07-passo-passo-single-window.spec.js` NEW (Tester-1 K4 50 LOC):
   - Step 1 navigate `/lavagna`
   - Step 2 click ModalitaSwitch → Passo Passo
   - Step 3 assert `[data-testid="percorso-capitolo-view"]` count=0 (LEFT hidden)
   - Step 4 assert FloatingWindowCommon count=1 (RIGHT only)
3. **Vitest unit** test `tests/unit/lavagna/lavagna-passo-passo-dedup.test.jsx` mock activeCapitoloId + modalita assert conditional render

## File changes

- `src/components/lavagna/LavagnaShell.jsx:1317` — add gate `&& modalita !== 'passo-passo'` (5 LOC)
- `tests/e2e/07-passo-passo-single-window.spec.js` NEW (Tester-1 K4 owns)
- `tests/unit/lavagna/lavagna-passo-passo-dedup.test.jsx` NEW (Maker-2 K1 owns)

## Cross-link

- Andrea screenshot evidence: this turn 2026-05-04 PM (image attached)
- Master plan iter 35: `docs/superpowers/plans/2026-05-04-iter-35-andrea-13-mandate-three-agent-master-plan.md` mandate 7
- Master plan iter 36-38 K1 (inverted): `docs/superpowers/plans/2026-05-04-iter-36-38-andrea-12-mandate-master-plan.md` (was hide RIGHT, corrected iter 35 hide LEFT)
- LavagnaShell render logic iter 36 A5: `src/components/lavagna/LavagnaShell.jsx:1334-1368` FloatingWindowCommon resizable + zIndex 10001

## Open questions

1. K3 PercorsoCapitoloView toggle button (collapse/expand) iter 35 P1 priority — Andrea ratify shape (icon position, label, animation)?
2. Should LEFT also be hidden in Già Montato mode? (Andrea ratify iter 36 entrance)
3. Should LEFT also be hidden in Libero mode? (Likely YES — Libero = empty canvas, capitolo overview redundant)
