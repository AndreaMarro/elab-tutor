# ADR-039 — ComponentDrawer scope gate modalita !== 'libero'

**Status**: ACCEPTED iter 35 (Andrea iter 30 P5054 + 2026-05-04 PM mandate 3)
**Date**: 2026-05-04
**Iter**: 35 mandate 3 (G2+G3)
**Deciders**: Andrea Marro
**Author**: Claude Opus 4.7

---

## Context

Andrea iter 30 PM (#P5054 mem 2026-04-30 13:21): "se premo lavagna libera il circuito rimane. la modalità v..." Bug persistent: Libero mode does NOT actually clear circuit.

Andrea iter 35 PM 2026-05-04: "La modalità lavagna libera deve essere davvero libera senza nessun circuito".

Root cause analyzed (CLAUDE.md iter 34 P1 fix iter 35 P1 fix):
1. `handleModalitaChange('libero')` LavagnaShell:641-650 → `setCurrentExperiment(null)` + `clearAll()` + remove localStorage exp ids + set sentinel `elab-lavagna-libero-active=true` ✓ (works at handler level)
2. Mount poll effect LavagnaShell:692-700 re-loads `elab-lavagna-last-expId` IF `liberoActive` sentinel false at mount time ✓ (sentinel correctly checked)
3. **GAP**: `ComponentDrawer.jsx:355` renders "PRONTI A MONTARE!" banner when `mode === 'guided'` REGARDLESS of `modalita` value → banner visible Libero mode if currentExperiment.buildMode === 'guided' from previous experiment in memory
4. **GAP**: ComponentDrawer overall guided UI elements render when `mode === 'guided'`, not gated by `modalita`

Andrea pain: Libero mode shows "PRONTI A MONTARE" banner = NOT empty + cluttered UI.

## Decision

**Add `modalita !== 'libero'` gate to ComponentDrawer guided mode rendering**:

1. **G2** ComponentDrawer guided UI gate (5 LOC):
```jsx
const showGuidedUI = mode === 'guided' && modalita !== 'libero';
```
Applies to all guided-mode UI elements (component palette filter, experiment name banner, etc.).

2. **G3** PRONTI banner gate (5 LOC):
```jsx
{currentExperiment?.buildMode === 'guided' && modalita !== 'libero' && (
  <div className="pronti-banner">PRONTI A MONTARE!</div>
)}
```

3. **Prop drill** (`modalita` from LavagnaShell to ComponentDrawer): if not already, pass via existing prop chain or NewElabSimulator → ComponentDrawer.

Pair with **G1** Libero entry event dispatch (60 LOC architectural Maker-2):
- `window.dispatchEvent(new CustomEvent('elab-lavagna-libero-enter'))` on Libero entry
- NewElabSimulator listens → reset `buildMode` state → ComponentDrawer re-renders with sandbox UI

## Alternatives considered

### A. Reset buildMode unconditionally on Libero entry (rejected)
- Set `buildMode='sandbox'` regardless of source experiment
- Pros: aggressive clear
- Cons: breaks Già Montato flow (which intentionally uses buildMode='guided' assembled)
- **Rejected** — conditional gate per modalita is more surgical

### B. Refactor ComponentDrawer to fully separate guided/sandbox renderers (rejected)
- Split ComponentDrawer into ComponentDrawerGuided.jsx + ComponentDrawerSandbox.jsx
- Pros: clean architecture
- Cons: ~150 LOC refactor + risks regression Già Montato
- **Rejected** — surgical conditional gate sufficient

### C. Always force `mode='sandbox'` when modalita='libero' via parent prop (chosen complementary G1)
- LavagnaShell sends `mode='sandbox'` to ComponentDrawer when modalita='libero'
- Pair with G2+G3 inside-component gate as defensive defense
- **Chosen as G1** companion architectural fix

## Consequences

### Positive
- Libero mode TRUE empty canvas (no PRONTI banner, no guided UI cruft)
- Andrea pain resolved
- Surgical 10 LOC ComponentDrawer gates + 60 LOC Maker-2 G1 event dispatch architecture
- Già Montato + Passo Passo + Percorso modes unaffected (still render guided UI when applicable)

### Negative
- ComponentDrawer prop surface adds `modalita` (NEW prop drill)
- LavagnaShell→NewElabSimulator→ComponentDrawer prop chain depth 3 (acceptable)
- Mitigation: existing prop chain pattern preserved (NO refactor)

### Neutral
- E2E spec G4 NEW asserts canvas count=0 + no PRONTI in Libero mode
- Existing tests guarda-da-errore (`mode='guided'` unconditional) may need update — Andrea iter 34 P0 already removed that mode

## Verification

Testing:
1. **G4 E2E spec** `tests/e2e/06-lavagna-libera-empty.spec.js` NEW (Tester-1 50 LOC, Three-Agent gate):
   - Navigate `/lavagna`
   - Click ModalitaSwitch → Libero
   - Assert `getCircuitState().components.length === 0`
   - Assert `[data-elab-pronti]` count=0
   - Assert `[data-component]` count=0
   - Assert canvas truly empty
2. **Unit test** `tests/unit/lavagna/lavagna-libero.test.jsx` (Maker-2 G4 unit version):
   - Mock LavagnaShell + ComponentDrawer + render Libero mode
   - Assert no PRONTI banner present
   - Assert ComponentDrawer guided UI elements absent
3. **Integration test**: existing `lavagna-handleModalitaChange.test.jsx` extend con Libero gate verification

## File changes

- `src/components/lavagna/ComponentDrawer.jsx` — add `modalita !== 'libero'` gate (10 LOC G2+G3)
- `src/components/lavagna/LavagnaShell.jsx` — Libero entry event dispatch (60 LOC G1, Maker-2 owns)
- `src/components/simulator/NewElabSimulator.jsx` — listen `elab-lavagna-libero-enter` event + reset buildMode (Maker-2 read-only, defer iter 36 IF complex)
- `tests/e2e/06-lavagna-libera-empty.spec.js` NEW (Tester-1 G4)
- `tests/unit/lavagna/lavagna-libero.test.jsx` NEW (Maker-2 G4 unit)

## Cross-link

- Andrea iter 30 PM #P5054 (mem-search recovered): "se premo lavagna libera il circuito rimane"
- Andrea iter 35 PM 2026-05-04: mandate 3 explicit
- Master plan iter 35: §1 mandate 3 + §3 + §8 G1+G2+G3+G4 atoms
- F1 Esci persistence iter 34 commit `d3ad2b3` (drawingSync.js + DrawingOverlay.jsx) — orthogonal but related (Esci vs Libero entry both clear state)

## Open questions

1. Should Libero also clear drawing strokes? (Drawing persistence iter 19 PM Andrea bug — F1 fix preserves strokes by exp_id; Libero has no exp_id → drawings auto-clear)
2. Should Già Montato mode have `mode='guided'` unconditional? (iter 26 ADR-025 simplification keeps Già Montato as guided assembled, Libero as sandbox)
3. NewElabSimulator buildMode reset on Libero entry — defer iter 36 if requires deep refactor
