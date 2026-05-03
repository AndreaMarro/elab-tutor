# Agent B Simulator iter 31 ralph 17 — Phase 0 Atom 17.2 COMPLETED

**Date**: 2026-05-03
**Iter**: 31 ralph 17 — Onnipotenza expansion DEEP Phase 0
**Atom**: 17.2 — Simulator UI interactions enumeration
**File ownership**: read-only `src/components/simulator/` (engine/ EXCLUDED per critical-files coordination CLAUDE.md)
**Sprint T close target**: 9.0/10 ONESTO

## Deliverable

Audit doc shipped: `docs/audits/2026-05-03-onnipotenza-ui-audit-simulator.md` (~245 LOC, 6 sezioni complete).

## Summary count

- **Components audited**: 38 .jsx file (1 shell + 4 canvas + 21 panels + 4 overlays + 21 components SVG + 1 IncrementalBuildHint) — engine/ NOT audited (3 file 4550 LOC totali, headless, critical-files coordination CLAUDE.md)
- **Hooks (7) + utils (8) + api/AnalyticsWebhook NOT audited** — zero JSX UI surface
- **Interactive elements totale matrix**: ~95 righe (target ≥50 master plan §2.5 — SURPASSED)
- **Categorie matrix coverage**:
  - Toolbar (ControlBar + MinimalControlBar): 21 elements
  - Canvas SVG (SimulatorCanvas + PinOverlay + WireRenderer + DrawingOverlay): 22 elements
  - Component palette + drawer: 13 elements
  - Experiment picker + lesson path + guides: 14 elements
  - Code editor + Scratch + compile bar: 9 elements
  - Properties + notes + quiz + BOM + shortcuts + galileo response: 16 elements
  - Serial monitor + plotter: 9 elements
  - Whiteboard overlay: 14 elements
  - Overlays Pot/LDR/Rotation/RotateDevice: 7 elements
  - Components SVG component-level: 5 elements
- **HYBRID priority coverage current**:
  - T1 ARIA semantic preferred: ~50 elements (palette items + Pot/LDR sliders + RotationHandle + most icon buttons)
  - T2 data-elab-* recommended add: ~35 elements (toolbar buttons + canvas zoom/wire mode + drawer + Properties)
  - T3 text fallback: ~5 elements (Whiteboard tool buttons by label, picker tiles)
  - T4 CSS fallback: ~5 elements (CodeMirror EditorView, Blockly Workspace, range inputs)
  - data-elab markers EXISTS solo 5/40+ (palette + guide + lesson-path + whiteboard-canvas + rotation-handle data-testid) — gap ~35 markers raccomandata iter 22
- **Drag-drop + canvas-specific recommendations**: 8 sub-recommendations §4 (palette→canvas drop intent, wire pin-to-pin, zoom/pan natural language, multi-select, code editor headless CM6, drawing pen high-level controls, slider value dispatch, confirmation gate destructive)
- **Honesty caveats critical**: 11 caveats §5 (engine NOT audited + hooks NOT audited + multi-select unverified + CM6 EditorView complexity + Blockly Scratch headless impossible + wire midpoint touch/click duplicate + data-elab markers gap + aria-label gap ~50% + Annotation.jsx not detailed + NewElabSimulator shell tabs/sidebar not in matrix)

## CoV verification

- File system verified: doc exists `docs/audits/2026-05-03-onnipotenza-ui-audit-simulator.md` 6 sezioni — confirmed via Write tool success
- Read-only mandate respected: ZERO write to `src/components/simulator/` (audit-only)
- Engine/ NOT touched: ZERO grep/Read of `engine/CircuitSolver.js, AVRBridge.js, PlacementEngine.js`
- Sibling agents file ownership respected: this audit only `simulator/`, did NOT write to `lavagna/` `tutor/` `unlim/` `dashboard/`
- Output paths respected: only `docs/audits/` + `automa/team-state/messages/`

## Anti-pattern compliance

- ✅ NO modify src code (read-only audit)
- ✅ NO touch `src/components/simulator/engine/` (critical files coordination CLAUDE.md)
- ✅ NO compiacenza (95 elements + 11 caveats critical + gap markers ~35 + aria gap ~50% explicit)
- ✅ NO inflate (T1 coverage ~50 honest, NOT claim "100% ARIA-clean")
- ✅ NO `--no-verify` (audit doc only, no commit attempted)
- ✅ NO write outside `docs/audits/` + `automa/team-state/messages/`

## Honest gaps + iter 18+ followup mandate

1. ADR-036 (iter 18+): definire schema canonical `data-elab-action` namespace + dispatcher whitelist expansion 12 → ~45 actions
2. Maker iter 22+: add ~35 data-elab markers ai T2 elements identified in matrix §3 (per Sense 1.5 morfismo +35)
3. Architect iter 18+: design `__ELAB_API.ui.*` namespace per CLAUDE.md API globale extension (drop component, connect wire symbolic, zoom/pan, set code, set slider, confirmation gate destructive)
4. Tester iter 19+ R7 fixture: include UI mechanical fixtures (zoom in, click compile, drag palette item, select component, rotate, properties value commit) ≥30 prompts UI category
5. Verify iter 18+: multi-select rubber-band drag SimulatorCanvas.jsx:2532 dettaglio + Annotation.jsx text edit double-click rename + NewElabSimulator tab change/sidebar toggle (line 101, 133)

## Cross-link

- Master plan: `docs/superpowers/plans/2026-05-03-iter-31-onnipotenza-expansion-deep-iter-17-30.md` §2.2
- Audit output: `docs/audits/2026-05-03-onnipotenza-ui-audit-simulator.md`
- Sibling agents Phase 0 expected:
  - Agent A Lavagna: atom 17.1 → `docs/audits/2026-05-XX-onnipotenza-ui-audit-lavagna.md`
  - Agent C Tutor + UNLIM: atom 17.3 → `docs/audits/2026-05-XX-onnipotenza-ui-audit-tutor-unlim.md`
  - Agent D Cross-cutting: atom 17.4 → `docs/audits/2026-05-XX-onnipotenza-ui-audit-cross-cutting.md`
  - Scribe consolidate: atom 17.5 → `docs/audits/2026-05-XX-onnipotenza-ui-actions-MASTER-enumeration.md`

## Status

**Phase 0 Atom 17.2 COMPLETED** — Agent B simulator audit shipped, ready for scribe consolidation atom 17.5 + ADR-036 architect iter 18+.

NO compiacenza. NO inflation. NO src/ code modified. Engine/ NOT touched.
