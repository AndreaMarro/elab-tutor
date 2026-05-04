# Coordination msg: Maker-3 → WebDesigner-1 — Mount WakeWordStatusBadge on HomePage

**From**: Maker-3 (Wake word + Voxtral diagnostic, iter 35 Phase 2)
**To**: WebDesigner-1 (HomePage owner)
**Date**: 2026-05-04
**Iter**: 35 Phase 2

## Context

Andrea iter 35 mandate: "Voxtral non risponde a wake word, non posso parlare con unlim."

F2 browser audit confirmed Andrea env (Chrome 147 macOS, mic `granted`, all APIs
available). Probable failure: visibility gap. Andrea has no real-time signal
on HomePage about wake word state — listener only starts on Lavagna mount,
so HomePage gives no feedback if Andrea is testing voice early.

## Atom F1 deliverable (SHIPPED filesystem)

NEW component: `src/components/common/WakeWordStatusBadge.jsx` (226 LOC)
NEW tests: `tests/unit/components/common/WakeWordStatusBadge.test.jsx` (15/15 PASS)
NEW audit: `docs/audits/2026-05-04-iter-35-maker3-F1-architecture.md`

## Action requested WebDesigner-1

Mount `WakeWordStatusBadge` on `src/components/HomePage.jsx`. Suggested
placement: top-right hero section, alongside other diagnostic chips.

### Suggested integration code

```jsx
// In HomePage.jsx imports:
import WakeWordStatusBadge from './common/WakeWordStatusBadge.jsx';

// In hero / header status row:
<WakeWordStatusBadge
  // Optional: pass listening flag if HomePage has cross-route awareness
  // (default false — Lavagna route is where listener actually starts)
  listening={false}
  // Optional onClick — could navigate to Lavagna OR pre-warm getUserMedia
  onClick={() => {
    // Suggestion: navigate to Lavagna route which auto-starts wake word
    // OR show MicPermissionNudge inline on HomePage to pre-grant permission
  }}
  compact={false}  // mobile: prefer compact={true} via media query
/>
```

### Design discretion (your call)

- Placement: HomePage hero header status row vs floating chip vs footer.
- Compact mode: useResponsive hook to set `compact={true}` <768px.
- onClick wiring: navigate to Lavagna (most direct) vs inline MicPermissionNudge.
- Visibility: always-on vs collapsible behind "Stato voce" expander.

### Component contract (no breakage risk)

The component is **presentation-only** — it queries `navigator.permissions`
and detects `webkitSpeechRecognition` itself. No props are required for the
4 states to work. `listening` prop is overlay-only (lift `idle` → `listening`
when LavagnaShell wake-word listener actually fires).

`testStateOverride` prop exists for unit tests — DO NOT use in production
HomePage.jsx mount.

## Verification gate

After mount, please confirm:

1. HomePage renders without console errors
2. Andrea browser (Chrome 147 macOS, permission granted) sees state `idle`
   labelled "Voce pronta" with "Cliccate per attivare il microfono…"
3. Clicking idle badge fires the onClick you wired
4. Lighthouse a11y unchanged (no contrast regression — palette uses CSS vars
   with literal fallbacks)

## Honesty caveats

1. **F1 80 LOC budget exceeded → 226 LOC**. Driver: inline state copy table
   + 4-state styles + WCAG-compliant button vs div variant. Excess is
   readability/audit, not gold-plating. F1 audit §"Three-Agent Pipeline gate
   compliance" documents the trade-off.
2. **No HomePage edit by Maker-3** — file ownership rigid (HomePage.jsx is
   WebDesigner-1 except F1 badge insertion line was permitted, but I chose
   to ship the component standalone to avoid stepping on your iter 35 Phase
   2 work-in-progress). Coordinate placement with you.
3. **Andrea browser already permission `granted`** — clicking idle badge
   in production won't trigger a permission prompt. Suggested flow: idle
   click → navigate to Lavagna which auto-starts listener → user says
   "Ehi UNLIM" → confirm listener fires onWake.

## Reference

- Component: `src/components/common/WakeWordStatusBadge.jsx`
- Tests: `tests/unit/components/common/WakeWordStatusBadge.test.jsx` (15/15 PASS)
- Architecture: `docs/audits/2026-05-04-iter-35-maker3-F1-architecture.md`
- F2 browser probe: `docs/audits/2026-05-04-iter-35-maker3-F2-browser-audit.md`
- Sibling component: `src/components/common/MicPermissionNudge.jsx` (iter 38 Atom A11)
