# Iter 39 Persistenza drawing across experiments INVESTIGATION (Andrea bug carryover)

**Status**: PARTIAL investigation — file:line evidence + hypothesis enumerated. Live React DevTools debug richiesta iter 39+ next session per definitive root cause.

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
- Receives `experimentId` prop from NewElabSimulator (line 922 NewElabSimulator)
- NewElabSimulator passes `currentExperiment?.id || null`
- LavagnaShell sets currentExperiment via __ELAB_API events

**State management DrawingOverlay**:
- Line 111: `const [paths, setPaths] = useState(() => loadDrawingPaths(experimentId))` — initial load
- Line 139-156: useEffect on experimentId change handles migration sandbox→experiment
- Line 313/324/334/345/365: `saveDrawingPaths(_, experimentId)` calls in event handlers

---

## §2 Hypothesis enumerate

**H1: Stale closure in event handlers** (most likely):
- Lines 313/324/334/345/365 use `experimentId` from component prop
- If event handler is wrapped in `useCallback([])` or `useCallback([dependencies missing experimentId])` → closure captures STALE experimentId
- Switch experiment → user draws → save fires with OLD experimentId → drawing leaks to OLD bucket
- **Verify iter 39+**: read useCallback deps for handler functions calling saveDrawingPaths

**H2: useEffect race-cond migration logic**:
- Line 143: `if (prevId === null && newId && paths.length > 0)` migration condition
- Edge case: user opens exp1 directly (no null sandbox state) → never migrates → state correct
- Edge case: user with stale `prevExpIdRef.current` after fast switches → potential miss
- **Verify iter 39+**: log prevId vs newId vs paths.length on transition

**H3: Multiple DrawingOverlay instances** (LavagnaShell hideSimulatorBoard branches):
- NewElabSimulator.jsx line 881 (lavagnaSoloMode branch) + line 915 (full simulator branch)
- Both render DrawingOverlay with experimentId
- If both mount simultaneously → state divergence
- **Verify iter 39+**: probe `document.querySelectorAll('canvas[data-testid=drawing-overlay]')` count

**H4: NewElabSimulator currentExperiment vs LavagnaShell currentExperiment drift**:
- LavagnaShell.currentExperiment state separate from NewElabSimulator.currentExperiment
- Sync via __ELAB_API events
- If one updates without other → mismatch
- **Verify iter 39+**: probe state consistency post-switch

---

## §3 Concrete iter 39+ debug steps

1. **Inspect useCallback deps** for handlers calling saveDrawingPaths:
   ```bash
   grep -B5 "saveDrawingPaths.*experimentId" src/components/simulator/canvas/DrawingOverlay.jsx
   ```
2. **Live test scenario reproduction**:
   - Mount exp1, draw 3 paths
   - Switch to exp2, draw 2 paths
   - Switch back exp1
   - Verify exp1 has 3 paths (not 5)
   - Switch to exp2, verify 2 paths (not 0 OR 5)
3. **localStorage probe** post-switch:
   ```javascript
   Object.keys(localStorage).filter(k => k.startsWith('elab-drawing-'))
   ```
4. **React DevTools** trace component re-render on experimentId change

---

## §4 Pre-existing investigation references

- `docs/audits/2026-04-29-iter-25-LAVAGNA-PERSISTENCE-investigation.md` (Bug 1) — Andrea iter 25 mandate
- Iter 28 Bug 3 (DrawingOverlay.jsx:128 lastLocalSaveAtRef) — race-cond echoes own writes
- Iter 34 P0 fix Andrea bug "Lavagna persistence: premi Esci scritti spariscono" (lines 169-179)
- Past memory observation #80 (2026-04-20) "Drawing overlay architecture investigation Lavagna bugs T1-001 T1-002"

Existing infrastructure addresses subset bugs MA Andrea report iter 39 indica regression OR new edge case NON coperto.

---

## §5 Defer iter 39+ live debug + 4-vendor cycle application

Optimal forward action: apply M-AI-07 4-vendor cycle on this investigation atom (utilizzo reale Step 1 close):
1. Codex Round 1 propose fix (closure deps update OR migration logic widen)
2. Gemini Round 2 critique architecture
3. Mistral Round 3a Italian K-12 docente UX impact
4. Kimi Round 3b 256K full-file diff anti-bias
5. Codex Round 5 finalize
6. Claude Round 6 LAST WORD apply selectively + Andrea ratify

Cost: ~$0.005 + 75s wall-clock per cycle.

End persistenza investigation iter 39 partial — concrete iter 39+ steps shipped.
