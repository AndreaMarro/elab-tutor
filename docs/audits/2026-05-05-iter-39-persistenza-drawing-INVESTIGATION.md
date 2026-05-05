# Iter 39 Persistenza drawing across experiments INVESTIGATION (Andrea bug carryover)

**Status**: REVISED after 4-vendor cycle — root cause corretto + fix operativo + test coverage estesa.

**Andrea problema**: "persiste il problema di persistenza della lavagna sullo specifico esperimento rimanendo salvata sullo specifico esperimento su tutta la sessione con la possibilità di scrivere anche su altri esperimenti"

---

## §1 Architecture trace

**Storage layer** (`src/utils/drawingStorage.js`):
- ✅ Per-experiment isolation enforced: `elab-drawing-<experimentId>` localStorage key
- ✅ Fallback `elab-drawing-paths` for null experimentId (sandbox)
- ✅ Functions: `loadDrawingPaths`, `saveDrawingPaths`, `clearDrawingPaths`, `getDrawingStorageKey`

**Sync layer** (`src/services/drawingSync.js`):
- ✅ Per-experiment Supabase rows: function-level isolation
- ✅ Functions: `loadPaths`, `savePaths`, `subscribePaths`, `debouncedSave`, `flushDebouncedSave`, `flushDebouncedSaveSync`

**Component layer** (`src/components/simulator/canvas/DrawingOverlay.jsx`):
- Receives `experimentId` prop from NewElabSimulator (line 924 NewElabSimulator)
- NewElabSimulator passes `currentExperiment?.id || null` + `key={\`dwo-\${currentExperiment?.id || 'sandbox'}\`}` (line 917) per remount forzato
- LavagnaShell sets currentExperiment via __ELAB_API events

**State management DrawingOverlay**:
- Line 111: `const [paths, setPaths] = useState(() => loadDrawingPaths(experimentId))` — initial load
- Line 139-156: useEffect on experimentId change handles migration sandbox→experiment
- Line 313/324/334/345/365: `saveDrawingPaths(_, experimentId)` calls in event handlers

---

## §2 Hypothesis validate (post review)

**H1: Stale closure in event handlers** (FALSIFICATA):
- I callback che salvano includono già `experimentId` nelle dependency:
  - `handlePointerUp` line 318
  - `handleUndo` line 328
  - `handleRedo` line 338
  - `handleClearAll` line 350
  - `handleClose` line 384
- Conclusione: H1 NON è root cause principale.

**H2: migration useEffect race** (secondaria):
- La migration null→exp resta valida (`prevId === null && newId && paths.length > 0`) e coperta da test unitari iter 25.

**H3: doppia istanza DrawingOverlay** (non evidenza di mount simultaneo):
- Le branch `hideSimulatorBoard` e `currentExperiment` sono mutualmente esclusive in render tree.

**H4: drift/timing su currentExperiment** (ROOT CAUSE più probabile):
- Il problema reale è timing/disallineamento parent-state durante switch esperimento.
- `key` dinamico su `DrawingOverlay` (line 917 `NewElabSimulator.jsx`) è guardrail operativo: forza unmount/mount e resetta closure/stato volatile sul cambio esperimento.

---

## §3 Concrete verify steps (aggiornato)

1. **Conferma H1 falsificata** (deps complete):
   ```bash
   grep -B5 "saveDrawingPaths.*experimentId" src/components/simulator/canvas/DrawingOverlay.jsx
   ```
2. **Scenario critico inter-esperimento**:
   - Mount exp1, draw 3 paths
   - Switch to exp2, draw 2 paths
   - Switch back exp1
   - Verify exp1 has 3 paths (not 5)
   - Switch to exp2, verify 2 paths (not 0 OR 5)
3. **Probe localStorage** post-switch:
   ```javascript
   Object.keys(localStorage).filter(k => k.startsWith('elab-drawing-'))
   ```
4. **React DevTools** trace `currentExperiment` update order parent→child
5. **Mid-stroke switch check**: pointerdown/move su exp1 + switch immediato a exp2 (no pointerup) => stroke deve salvarsi in bucket exp1

---

## §4 Pre-existing investigation references

- `docs/audits/2026-04-29-iter-25-LAVAGNA-PERSISTENCE-investigation.md` (Bug 1) — Andrea iter 25 mandate
- Iter 28 Bug 3 (DrawingOverlay.jsx:128 lastLocalSaveAtRef) — race-cond echoes own writes
- Iter 34 P0 fix Andrea bug "Lavagna persistence: premi Esci scritti spariscono" (lines 169-179)
- Past memory observation #80 (2026-04-20) "Drawing overlay architecture investigation Lavagna bugs T1-001 T1-002"

Existing infrastructure addresses subset bugs MA Andrea report iter 39 indica regression OR new edge case NON coperto.

---

## §5 Applied outcome (Round 5 finalize)

1. `DrawingOverlay` keyed by experiment in `NewElabSimulator` (`src/components/simulator/NewElabSimulator.jsx:917`).
2. Edge-case fix: su cleanup, stroke in corso viene persistito anche senza `pointerup` (`src/components/simulator/canvas/DrawingOverlay.jsx`).
3. Test unitari estesi:
   - isolamento reale expA↔expB con disegno su entrambi
   - switch esperimento durante stroke attivo (no pointerup) con salvataggio su bucket precedente
   (`tests/unit/DrawingOverlay-iter25-migration.test.jsx`).

End investigation iter 39 revised — root cause allineato + fix/test integrati.
