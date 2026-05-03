# Maker-1 iter 31 ralph 22 Phase 3 Atom 22.1 — COMPLETED

**Date**: 2026-05-03
**Owner**: Maker-1
**Atom**: 22.1 — L0b namespace `__ELAB_API.ui.*` impl per ADR-041 §3 + §12
**Mode**: NORMALE (NOT caveman)

---

## File ownership respected

- `src/services/elab-ui-api.js` (NEW)
- `src/services/simulator-api.js` (MODIFY +13 LOC)
- `automa/team-state/messages/maker1-iter31-ralph22-completed.md` (NEW)

NO modifications to React components (Maker-2 ownership iter 23 markers). NO
modifications to `intent-parser.ts`/`dispatcher.ts` (Phase 2 closed iter 20-21).
NO test files added (Tester-1 ownership iter 24 E2E + Maker-2 ownership iter 23).

---

## Files delivered

### NEW — `src/services/elab-ui-api.js`

**Path**: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/src/services/elab-ui-api.js`
**LOC**: **1003 LOC** (target ~700, +43% over budget — readability + JSDoc + 7-field
state snapshot + 6 dispatch helpers + 38 methods exhaustive contracts justification;
NO compiacenza, raw count reported).

### MODIFIED — `src/services/simulator-api.js`

**Path**: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/src/services/simulator-api.js`
**LOC delta**: **+13 LOC** (969 → 983 line count). Two surgical edits:
1. Import line `import { createUiApi } from './elab-ui-api';` + 2 comment lines (+3 LOC)
2. `registerSimulatorInstance` body: defensive try/catch + `window.__ELAB_API.ui = createUiApi()` post existing init (+10 LOC)

Init guards:
- `typeof window !== 'undefined'` (browser-only)
- `!window.__ELAB_API.ui` (idempotent re-register safe)
- `try/catch` silent (L0b init MUST NOT break existing surface)

---

## 38 methods enumerated (verify match ADR-041 §3)

### §3.1 Mouse + keyboard primitives — **10 methods**
1. `click(target)` — synthesize click via MouseEvent('click')
2. `doubleClick(target)` — click + click + dblclick canonical sequence
3. `rightClick(target)` — contextmenu event with button:2
4. `hover(target)` — mouseenter + mouseover sequence
5. `scroll(target, direction, amount)` — window.scrollBy or element.scrollBy with smooth behavior
6. `type(target, text)` — native value setter for React onChange + PII guard (password/cc-number/ssn blocked per §5.4)
7. `key(combo)` — parseKeyCombo + keydown + keyup (e.g. "ctrl+z", "shift+Tab")
8. `keyDown(key)` — single keydown (no auto-keyup)
9. `keyUp(key)` — single keyup (no auto-keydown)
10. `drag(fromTarget, toTarget)` — mousedown + mousemove + mouseup pointer sequence

### §3.2 Window + modal + navigation — **8 methods**
11. `openModal(name)` — dispatch `elab-open-modal` window event
12. `closeModal(name)` — dispatch `elab-close-modal` event + Escape key fallback
13. `minimizeWindow(target)` — auto-resolves `[data-elab-action="minimize-window"]`
14. `maximizeWindow(target)` — auto-resolves `[data-elab-action="maximize-window"]`
15. `closeWindow(target)` — auto-resolves `[data-elab-action="close-window"]`
16. `navigate(route)` — sets `window.location.hash = '#<route>'` + invalidate state cache
17. `back()` — `window.history.back()` + invalidate cache
18. `forward()` — `window.history.forward()` + invalidate cache

### §3.3 Modalita + lesson-paths — **7 methods**
19. `toggleModalita(modalita)` — write localStorage `elab-modalita` + dispatch `elab-modalita-change` (validates 'percorso'|'libero'|'gia-montato'|'esperimento')
20. `highlightStep(index)` — dispatch `elab-highlight-step`
21. `nextStep()` — delegates `__ELAB_API.nextStep` or event-stub
22. `prevStep()` — delegates `__ELAB_API.prevStep` or event-stub
23. `nextExperiment()` — dispatch `elab-next-experiment` event-stub
24. `prevExperiment()` — dispatch `elab-prev-experiment` event-stub
25. `restartLessonPath()` — dispatch `elab-restart-lesson-path` event-stub

### §3.4 Voice + TTS playback — **6 methods**
26. `voicePlayback(action)` — dispatch `elab-voice-playback` (validates play|pause|skip|replay|stop)
27. `voiceSetVolume(percent)` — dispatch `elab-voice-volume` (validates 0..1 range)
28. `voiceSetMode(mode)` — dispatch `elab-voice-mode` (validates 'always'|'ptt')
29. `startWakeWord()` — dispatch `elab-wake-word-start`
30. `stopWakeWord()` — dispatch `elab-wake-word-stop`
31. `speak(text)` — delegates `__ELAB_API.unlim.speakTTS({text})` or event-stub fallback

### §3.5 Simulator-specific — **4 methods**
32. `zoom(direction)` — clamps numeric to [0.3, 3.0] + delegates `__ELAB_API.zoom` or event-stub
33. `pan(dx, dy)` — delegates `__ELAB_API.pan` or event-stub
34. `centerOn(componentId)` — highlightComponent + scrollIntoView via `[data-component-id]`
35. `selectComponent(id)` — delegates `__ELAB_API.interact(id, 'select')` or event-stub

### §3.6 Lavagna + chat — **3 methods**
36. `expandChatUnlim()` — HYBRID intent `{dataElabAction:'expand-chat-unlim', ariaLabel:'Espandi chat UNLIM'}` (de-hack ChatOverlay finding #1)
37. `switchTab(tabId)` — dispatch `elab-switch-tab`
38. `togglePanel(direction)` — dispatch `elab-toggle-panel` (validates left|right|bottom)

**Total: 10 + 8 + 7 + 6 + 4 + 3 = 38 NEW methods** (matches task spec exactly).

NOTA scopo: ADR-041 §3 enumera 50 totali (incluso §3.5 deselectAll/setSlider/penTool/setCode +
§3.6 minimizeChat/closeChat/toggleSidebar + §3.7 pageNav/volumeSelect/videoTabSelect/cronologiaSelectSession/cronologiaNewChat).
Task assignment iter 22 Atom 22.1 specifica subset 38 methods (10+8+7+6+4+3) per ADR-041 §3
ridotto. Restante 12 methods §3.5 §3.6 §3.7 deferred iter 23+ (Maker-2 ownership markers
expansion + restanti L0b methods complete).

---

## HYBRID resolver impl summary

**Verdict**: SHARED via re-import from `intentsDispatcher.js` (no duplication).

`resolveSelector(target)` from `src/components/lavagna/intentsDispatcher.js` (port iter 20.2)
imported and wrapped via local `resolveOne(target)` helper that returns `{ element, status,
strategy, matchCount }` (first match + telemetry). Priority order preserved per ADR-041 §4.1:

1. **ARIA** — `[aria-label="..."]` (+ optional `[role="..."]` composite)
2. **data-elab** — `[data-elab-action="..."]` (+ optional `[data-elab-target="..."]`)
3. **Text** — XPath `//*[normalize-space(text())="..." or @aria-label="..." or @title="..."]` (anti-ambiguity ≤3 matches per priority 3 guard)
4. **CSS** — raw `cssSelector` fallback only

Anti-absurd rejection per §4.2:
- `>10 elements` → `selector_too_broad` status (likely catastrophic selector)
- `0 elements` → `selector_not_found` status
- `>3 for text-only` → `text_intent_ambiguous` status

Each L0b method dispatching to a DOM target uses `resolveOne(target)` and throws
`resolve_failed:<status>:<strategy>:<matchCount>` if `element === null`. The
runUi wrapper catches + reports via DispatchResult with `success: false` + `error`
field + audit log helper call.

---

## L0b getState() impl summary (UIStateSnapshot 7 fields)

**Verdict**: ALL 7 fields per ADR-042 §3 implemented + 30s TTL in-isolate cache per §8.1.

```js
buildStateSnapshot() returns {
  route,            // window.location.hash → 'home'|'lavagna'|'tutor'|'chatbot-only'|...
  mode,             // derived heuristic from route ('lavagna'|'tutor'|'easter'|'admin'|'home'|...)
  focused,          // {tag, id, ariaLabel, dataElabAction} of document.activeElement (NO input.value PII)
  modals: [],       // discovered via [role="dialog"] + [role="alertdialog"] (title + modal flag)
  modalita,         // localStorage 'elab-modalita' (canonical source per LavagnaShell)
  lesson_path_step, // best-effort from [data-elab-current-step] (Number.parseInt or null)
  opened_panels: [] // .elab-floating-window + .retractable-panel:not(.collapsed) + [data-elab-panel-open="true"]
}
```

Cache mechanics:
- `_stateCache` + `_stateCacheAt` module-private state
- TTL 30_000 ms — second call within window returns cached + frozen object
- `_invalidateStateCache()` test helper exposed
- Auto-invalidated on `navigate()` + `back()` + `forward()` + `toggleModalita()` (route/state mutations)
- Object.freeze() on cached snapshot (defensive against caller mutation)

Defensive: every field wrapped in try/catch (Safari private mode localStorage,
missing DOM elements, no document.activeElement). Returns null for unavailable
fields (NOT failure / throw).

---

## CoV results 3-step

### CoV-1 (PRE-atom baseline verification)
**Command**: `npx vitest run --reporter=basic` (full suite)
**Result**: **13752 PASS** + 15 skipped + 8 todo (13775 total) | 282 passed | 1 skipped
**Duration**: 532.88s
**Verdict**: PASS (matches task baseline 13752 exactly)

### CoV-2 (incremental — focused lavagna namespace tests)
**Command**: `npx vitest run tests/unit/components/lavagna/ tests/unit/intent-parser.test.js tests/unit/lavagna/`
**Result**: **349 PASS** | 25 test files
**Duration**: 33.21s
**Subset breakdown**:
- intentsDispatcher (22 + 84 = 106) + intent-parser (24) + useGalileoChat (22) + lavagna sub-suite (197) = 349 PASS
- Zero regressions in any lavagna namespace test
**Verdict**: PASS

### CoV-3 (POST-atom full suite preservation)
**Command**: `npx vitest run --reporter=basic` (full suite)
**Result**: **13752 PASS** + 15 skipped + 8 todo (13775 total) | 282 passed | 1 skipped
**Duration**: 310.08s
**Verdict**: PASS — baseline 13752 preserved exactly (zero regression, additive impl
NO test changes per task spec — Tester-1 ownership iter 24)

---

## Caveats onesti (NO compiacenza)

### 1. DOM event accuracy
Synthetic `MouseEvent` and `KeyboardEvent` dispatches may NOT trigger React `onClick`/`onKeyDown`
handlers in all cases. React 19 uses synthetic event pooling; native dispatchEvent on a real
DOM element typically works for delegated React handlers but edge cases exist (e.g. ref
forwarding through multiple wrappers). The `type()` method uses the native `value` property
descriptor setter trick (`Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set`)
to ensure React `onChange` fires correctly — but typed in tests against jsdom only, NOT
against real browser React 19 + Vite HMR runtime. **No E2E Playwright validation iter 22**
(Tester-1 ownership iter 24).

### 2. Browser-only guards
Every method short-circuits with `throw new Error('no_browser_env')` when `typeof window`
or `typeof document` is undefined (Node SSR / Edge runtime). This is correct defensively
but masks SSR/Edge call attempts as failures rather than no-ops. Caller (server-side render
context if any) will see `success: false, error: 'no_browser_env'` rather than silently
ignored.

### 3. Voice API gaps
`voicePlayback`, `voiceSetVolume`, `voiceSetMode`, `startWakeWord`, `stopWakeWord` all
dispatch event-stubs (`elab-voice-*` CustomEvents). Real audio control requires the
`voiceService` module + Web Speech API listener wire-up which does NOT exist for some of
these events yet. **Graceful degrade: events fire but may have NO listener** — caller sees
`success: true, dispatched: true` but no audio actually changes. Iter 23+ Maker-2 wires
listeners in voiceService.js.

The `speak(text)` method correctly delegates to `__ELAB_API.unlim.speakTTS` (which calls
real Voxtral primary TTS chain via voiceService.synthesizeSpeech + playAudio) when
`__ELAB_API` is mounted. Falls back to event-stub when not (e.g. during component init
race).

### 4. Canvas zoom/pan/centerOn complexity
`zoom()`, `pan()`, `centerOn()`, `selectComponent()` all delegate to existing
`__ELAB_API.{zoom,pan,interact}` methods — but these methods do NOT exist on the current
`createPublicAPI()` surface (verified: only `addWire`, `addComponent`, `interact`,
`moveComponent`, `clearAll` exist for canvas manipulation). **Graceful degrade**: when
`__ELAB_API.zoom` is undefined, dispatches `elab-canvas-zoom` event-stub which has NO
listener wired in `SimulatorCanvas.jsx`. Caller sees `success: true, via: 'event_stub'`
but canvas doesn't actually zoom. Iter 23+ Maker-2 needs to either:
(a) Add `zoom`/`pan` methods to `_simulatorRef` and surface via `simulator-api.js` createPublicAPI
(b) Wire `elab-canvas-*` event listeners in SimulatorCanvas.jsx

`centerOn(componentId)` does best-effort `scrollIntoView` via `[data-component-id="<id>"]`
DOM selector + calls existing `unlim.highlightComponent([id])` — partial functionality
verified, but `scrollIntoView` only works if SimulatorCanvas renders components with
`data-component-id` attribute (NOT verified file-system this iter).

### 5. Anti-absurd thresholds inherited
`resolveSelector` is re-imported from `intentsDispatcher.js` so the anti-absurd thresholds
(MAX_TOTAL=10, MAX_TEXT_ONLY=3) are SHARED. If iter 23+ tunes those thresholds in
intentsDispatcher, L0b namespace methods inherit the change automatically — both correct
and a coupling risk to flag.

### 6. PII guard limited to type/system attrs
The `type()` method blocks `password` / `cc-number` / `cc-csc` / `ssn` autocomplete fields
per ADR-041 §5.4. Does NOT block fields matching regex `/email|phone|address|tax/i` per
§5.4 WARNING (proceed but warn) — that warning level NOT implemented this atom.

### 7. LOC over budget +43%
1003 LOC vs target ~700 LOC (+303 LOC over). Justification: 38 methods × ~15-25 LOC each
(JSDoc + try/catch wrapper + browser guard + selector resolve + dispatch + audit) +
buildStateSnapshot 7 fields ~75 LOC + 6 dispatch helpers ~120 LOC + factory boilerplate
~50 LOC. NO inflation: raw `wc -l` output reported. Could compress via macro abstraction
but readability + audit trail prioritized.

### 8. Audit log Supabase wire NOT impl
Per ADR-041 §5.6, audit log is fire-and-forget Supabase insert into `unlim_ui_actions_log`
table. **This atom uses `logUiAction` STUB from intentsDispatcher.js** which only
`logger.info('[ui-audit-stub]')` — Supabase real wire-up DEFERRED iter 22+ Maker-1 (per
intentsDispatcher inline comment line 437). All L0b methods call `logUiAction(action,
target, {ok, status})` correctly so the wire-up is the only missing piece.

### 9. NO L0b namespace LIVE prod claim
Impl ONLY iter 22 Atom 22.1. Canary deploy gated Phase 5 (iter 28-29) per ADR-041 §8
decision matrix. NO claim "L0b LIVE prod". NO claim "Onnipotenza Expansion FULL LIVE"
(per ADR-041 §13 anti-inflation invariant — requires R7 ≥80% canonical AND R8 ≥80% UI
context awareness AND canary 100% AND Andrea Opus G45 indipendente review).

### 10. Init order race
`registerSimulatorInstance(instance)` mounts both `__ELAB_API` (primary) AND `__ELAB_API.ui`
(L0b) on first call. If multiple simulator instances mount in StrictMode double-mount or
HMR refresh, the guard `!window.__ELAB_API.ui` ensures L0b is idempotent — but if some
external code reads `window.__ELAB_API.ui` BEFORE `registerSimulatorInstance` runs (e.g.
during App.jsx mount before SimulatorCanvas mounts), it gets `undefined`. Caller must
defensively check `window.__ELAB_API?.ui` before invoking. Documented in elab-ui-api.js
factory caveats block.

### 11. Test coverage = ZERO this atom
Per task spec: "NO new tests this atom (Tester-1 ownership iter 24 E2E + Maker-2 ownership
iter 23 markers)". L0b namespace impl is currently UNTESTED beyond manual review +
existing 349 lavagna namespace tests preserve (verified). Iter 24 Tester-1 ownership
expands E2E + Atom 22.x companion tests TBD.

---

## Anti-pattern enforced ✓

- ✓ NO claim "L0b namespace LIVE prod" (impl only iter 22, canary deploy iter 28-29)
- ✓ NO destructive methods added (no deleteUser/submitForm/fetchExternal — whitelist
  exclusion ADR §5.2 respected, only event-stubs and existing `__ELAB_API` delegations)
- ✓ NO PII handling (type() blocks password/cc-number/cc-csc/ssn per §5.4)
- ✓ NO real DOM events for unsupported APIs (voice methods event-stub when listener
  absent — graceful degrade with caveat documented)
- ✓ NO `--no-verify` (this atom does not commit)
- ✓ NO destructive ops
- ✓ NO compiacenza (raw 1003 LOC reported + 11 caveats documented + LOC over budget
  flagged + DOM event accuracy + browser guards + voice API gaps + canvas complexity
  honest)
- ✓ NO commit (orchestrator commits Phase 3)

---

## Summary

**2 file paths**:
- NEW: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/src/services/elab-ui-api.js` (1003 LOC)
- MODIFIED: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/src/services/simulator-api.js` (+13 LOC, 969 → 983)

**LOC delta**: +1016 LOC totale (+1003 NEW + +13 MODIFIED).

**38 methods**: VERIFIED match task spec (10 mouse/key + 8 window/nav + 7 modalita/lesson + 6 voice/TTS + 4 simulator + 3 lavagna chat).

**HYBRID resolver verdict**: SHARED via re-import from intentsDispatcher.js (no duplication, priority ARIA → data-elab → text → CSS preserved).

**getState() verdict**: 7-field UIStateSnapshot (route + mode + focused + modals[] + modalita + lesson_path_step + opened_panels[]) + 30s TTL in-isolate cache + auto-invalidate on route/state mutation.

**CoV-3 vitest count**: **13752 PASS preserved** (full suite verify post atom; baseline 13752 → 13752 zero regression).

**Caveat principale**: L0b namespace impl iter 22 Atom 22.1 ONLY — NO production claim. Voice + canvas event-stubs degrade gracefully when listeners absent (Maker-2 wires iter 23+). DOM event accuracy NOT E2E validated (Tester-1 iter 24 ownership). Audit log Supabase real wire-up DEFERRED iter 22+ (intentsDispatcher.js stub used). LOC +43% over budget (1003 vs ~700) raw reported NO compression for audit trail.
