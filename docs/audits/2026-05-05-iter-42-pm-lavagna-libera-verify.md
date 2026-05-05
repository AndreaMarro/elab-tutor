# Iter 42 PM Bug 6 — Lavagna libera access verify (FASE 2 Maker-1 atom)

**Date**: 2026-05-05
**Atom**: FASE 2 Maker-1 carryover — verify Bug 6 carryover Andrea iter 42
**Mode**: read-only verify (NO src/ Edit, NO Write outside docs/audits/, NO commit, NO push, NO npm run dev)
**Verdict**: **OPEN — partial wire-up shipped iter 35, Maker-2 consumer side never landed**

---

## §1 — Andrea original report (literal Italian)

> "Lavagna libera manco si puo' accedere"

Reported during iter 42 PM session. Bug 6 carryover from Andrea bug feedback batch
(see `feedback_lavagna_ux_bugs_19apr.md` lineage).

Pre-flight assumption (this atom): "HomePage.jsx ALREADY contains 'Lavagna libera'
card at line 316 → bug closed". Verify shows **assumption WRONG** — card exists +
launchMode flag is set on click, but the consumer side that should read the flag
and skip the experiment picker on mount is **NOT IMPLEMENTED**.

---

## §2 — Card existence verify

Card config exists in HomePage CARDS array.

[See: src/components/HomePage.jsx:310-329]

```
const CARDS = [
  {
    id: 'lavagna',
    emoji: '⚡',
    IconComponent: LavagnaCardIcon,
    accent: PALETTE.navy,
    title: 'Lavagna libera',
    text: 'Lavagna pulita per scrivere e parlare con UNLIM. Volumi sempre a portata. Niente circuiti.',
    cta: 'Entra in Lavagna',
    href: '#lavagna',
    launchMode: 'solo',
    target: 'internal',
    ...
  },
```

Comment in source acknowledges the workaround pattern + dependency on Maker-2:

> [See: src/components/HomePage.jsx:319-324]
> "Iter 35 H1 — Lavagna libera entry. App.jsx VALID_HASHES strict
> ['home','tutor','lavagna',...] — `#lavagna-solo` would fail route.
> Workaround: keep `#lavagna` href + set localStorage flag
> `elab_lavagna_launch_mode='solo'` su click (read by Maker-2
> LavagnaShell on mount; clear after consume → solo first launch).
> Pattern coordina con `data-elab-mode='lavagna-solo'` Maker-2 H2."

**Verdict §2**: card present, visible, click-bound (verified §3). PASS.

---

## §3 — Routing verify

App.jsx `VALID_HASHES` accepts `'lavagna'` route + `currentPage === 'lavagna'`
mounts `<LavagnaShell />` lazy via Suspense.

[See: src/App.jsx:62]

```
const VALID_HASHES = ['home', 'tutor', 'admin', 'teacher', 'vetrina', 'vetrina2',
  'login', 'register', 'dashboard', 'dashboard-v2', 'showcase', 'prova', 'lavagna'];
```

[See: src/App.jsx:225-232]

```
// Lavagna — nuova esperienza workspace
if (currentPage === 'lavagna' || currentPage === 'tutor') {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <LavagnaShell />
        </Suspense>
    );
}
```

Click handler in HomePage `Card` component sets the localStorage flag BEFORE
calling onActivate (which navigates).

[See: src/components/HomePage.jsx:386-394]

```
e.preventDefault();
// Iter 35 H1 — set `elab_lavagna_launch_mode` localStorage flag if
// card declares launchMode (Lavagna libera = 'solo'). LavagnaShell
// reads + consumes (clears) on mount → applies data-elab-mode.
if (card.launchMode) {
  try { localStorage.setItem('elab_lavagna_launch_mode', card.launchMode); } catch {}
}
if (typeof onActivate === 'function') onActivate(card.href);
```

**Verdict §3**: routing valid, hash + flag set OK at producer side. PASS.

---

## §4 — LavagnaShell launchMode='solo' handling

**Critical finding**: the Maker-2 consumer side that the HomePage comment
references (`read by Maker-2 LavagnaShell on mount; clear after consume`) is
**NOT IMPLEMENTED in the LavagnaShell file**.

Verification commands (read-only):

```
grep -rn "elab_lavagna_launch_mode\|launchMode\|launch_mode" \
  src/components/lavagna/LavagnaShell.jsx
# Returns: 0 matches
grep -rn "elab_lavagna_launch_mode\|data-elab-mode" \
  src/components/lavagna/
# Returns: 0 matches
```

What LavagnaShell actually does on mount (no `launchMode` consumption):

[See: src/components/lavagna/LavagnaShell.jsx:404]

```
const [freeMode, setFreeMode] = useState(false); // Lavagna libera — no experiment loaded
```

`freeMode` defaults to `false`. The picker auto-opens after 400ms unless an
experiment is already loaded:

[See: src/components/lavagna/LavagnaShell.jsx:660-665]

```
useEffect(() => {
    if (!hasExperiment && !bentornatiVisible && !pickerOpen && !freeMode) {
      const timer = setTimeout(() => setPickerOpen(true), 400);
      return () => clearTimeout(timer);
    }
  }, [hasExperiment, bentornatiVisible, pickerOpen, freeMode]);
```

Since `freeMode` is never set from the localStorage flag at mount, the docente
who clicked "Lavagna libera" on HomePage lands in LavagnaShell + within 400ms
sees the **ExperimentPicker overlay forced open**, blocking the empty canvas
the card promised. The user must then find the "Lavagna libera" button INSIDE
the picker to actually reach the empty canvas.

[See: src/components/lavagna/ExperimentPicker.jsx:209-218]

```
{onFreeMode && (
  <button
    onClick={() => { onFreeMode(); onClose(); }}
    ...
  >
    <span><strong>Lavagna libera</strong> — breadboard vuota, costruisci quello che vuoi</span>
```

The `onFreeMode` callback inside LavagnaShell is what actually triggers
`setFreeMode(true) + clearCircuit() + setHasExperiment(false)`:

[See: src/components/lavagna/LavagnaShell.jsx:1419-1424]

```
onFreeMode={() => {
  const api = typeof window !== 'undefined' && window.__ELAB_API;
  if (api?.clearCircuit) api.clearCircuit();
  setHasExperiment(false);
  setFreeMode(true);
}}
```

**Verdict §4**: producer→consumer chain BROKEN. Flag is written, never read. FAIL.

---

## §5 — Diagnosis

**Bug status: OPEN**.

**Root cause hypothesis** (high confidence):
The iter 35 H1 plan staged work across two agents:

1. **Maker-1** (HomePage producer side) — shipped: `launchMode: 'solo'` config +
   click handler `localStorage.setItem('elab_lavagna_launch_mode', 'solo')`.
2. **Maker-2** (LavagnaShell consumer side) — **NEVER LANDED**: no `useEffect`
   on mount reads + clears the flag, no auto-set `freeMode = true` when flag is
   `'solo'`, no `data-elab-mode='lavagna-solo'` attribute on the shell root.

User-visible effect (matches Andrea's literal complaint):
- Click "Lavagna libera" card on HomePage → URL becomes `/#lavagna` → flag set
- LavagnaShell mounts → ExperimentPicker forced open after 400ms
- Docente sees experiment list, NOT empty canvas → "manco si puo' accedere"
- Docente must scroll picker + find tucked-away "Lavagna libera" button +
  click it → only THEN reaches empty canvas

This is two-step access, not one-step as the card promises.

Secondary finding: the `BentornatiOverlay` returning-user flow (referenced
[See: src/components/lavagna/LavagnaShell.jsx:657-659]) provides another path
for docenti who already loaded an experiment in a prior session — but this is
orthogonal to first-time Lavagna libera access.

---

## §6 — Test coverage for Lavagna libera access

Verification commands (read-only):

```
ls tests/unit/components/lavagna/
# Returns: CapitoloPicker.test.jsx, DocenteSidebar.test.jsx,
#          PercorsoCapitoloView.test.jsx, useGalileoChat-intents-parsed.test.js
grep -rn "elab_lavagna_launch_mode\|launchMode" tests/
# Returns: 0 matches
grep -rn "Lavagna libera\|home-card-lavagna" tests/unit/
# Returns: 0 matches
```

**Result**: ZERO unit tests cover the Lavagna libera access flow.

The only references in `tests/` are E2E helper scaffolding for tests that
prefer entering Lavagna libera mode via the picker button:
- `tests/e2e/helpers/welcome-gate-bypass.js:191,214,238-239` — picker `onFreeMode`
  button helper (matches Fumetto + persistence test intent: empty board)

E2E coverage exists for the workaround path (picker → libera button) but NOT
for the direct HomePage card → empty canvas one-step intent that Andrea expects.

**Test gap iter 43+**: add unit tests covering:
1. HomePage `Card` click writes localStorage flag for `launchMode: 'solo'`.
2. LavagnaShell on mount reads + clears `elab_lavagna_launch_mode` and sets
   `freeMode = true` when value is `'solo'`.
3. ExperimentPicker auto-open is suppressed when `freeMode` is true at mount.

---

## §7 — Recommended action iter 43+

**Estimated effort**: 1-2h (small, surgical).

**Fix steps** (read-only this atom, NO Edit):

1. **LavagnaShell consumer mount effect** — add early `useEffect` before the
   picker auto-open effect (line ~660):

   ```
   useEffect(() => {
     try {
       const flag = localStorage.getItem('elab_lavagna_launch_mode');
       if (flag === 'solo') {
         localStorage.removeItem('elab_lavagna_launch_mode'); // consume once
         setFreeMode(true);
         setHasExperiment(false);
       }
     } catch { /* noop */ }
   }, []);
   ```

2. **Optional shell root attribute** (per HomePage comment §2, may aid CSS or
   E2E selectors):

   ```
   <div data-elab-mode={freeMode ? 'lavagna-solo' : 'lavagna-default'} ...>
   ```

3. **Unit test (NEW)** in `tests/unit/components/lavagna/LavagnaShell-launch-mode.test.jsx`
   covering the 3 cases listed §6.

4. **E2E spec (NEW)** in `tests/e2e/lavagna-libera-direct-access.spec.js`
   covering: HomePage card click → URL #lavagna → empty canvas visible within
   2s, NO picker overlay.

**ADR ratify**:
- Frame as ADR-XXX-lavagna-libera-direct-access (small ADR, ~150 LOC).
- Document the two-step current state vs one-step intent.
- Lock the contract: HomePage writes flag, LavagnaShell consumes on mount,
  flag is single-shot (cleared after read).

**Anti-regression**:
- Existing picker → onFreeMode path MUST keep working (returning docenti).
- Existing BentornatiOverlay flow MUST keep working.
- `elab-lavagna-last-expId` restore [See: src/components/lavagna/LavagnaShell.jsx:677-684]
  MUST not collide with the new `freeMode = true` mount path (`launchMode: solo`
  should win over saved expId).

---

## §8 — Honest caveats

- **NO live prod browser verify**: claude-in-chrome MCP not authorized this
  session. Cannot confirm the user-visible flow on www.elabtutor.school.
  Verdict §5 derives from static file-system analysis only.
- **NO npm run dev verify**: skipped to avoid competing with running vitest
  loop (pre-push regression check active).
- **File-system read only**: file content checked via `Read` tool + `grep`.
  Code paths NOT runtime executed. Edge cases (e.g. localStorage disabled,
  iframe, race between BentornatiOverlay + freeMode mount effect) not
  exercised.
- **No coverage tool run**: §6 test count derives from `ls` + `grep`, not from
  `npx vitest --coverage` output. There may be related integration tests not
  matched by the patterns used.
- **Iter 35 H1 plan reference is a comment-only claim**: did NOT find an ADR
  or PDR atom file confirming the H1 plan was scoped + dispatched. Cannot
  rule out that Maker-2 was deliberately deferred + the comment is stale.
  Iter 43+ should locate the H1 PDR or absorb the work into a fresh ADR.
