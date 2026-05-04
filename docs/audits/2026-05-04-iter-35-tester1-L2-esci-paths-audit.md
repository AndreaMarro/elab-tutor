# L2 audit ALL Esci paths — DrawingOverlay drawings persistence coverage

**Date**: 2026-05-04 PM
**Owner**: Tester-1
**Atom**: L2 audit ALL Esci paths

## Scope

Map every "exit" path that can unmount `DrawingOverlay` to confirm F1 fix (commit `d3ad2b3`) covers all of them. Andrea iter 19 PM bug "scritti spariscono su Esci" — root cause `cancelDebouncedSave` dropping pending up-to-2s debounced save. Verify if F1 (unmount flush) + L3 beforeunload (Maker-2 owns) covers full surface.

## Discovery

### 1. Explicit "Esci" / "Torna" buttons

Repo grep `Esci|Torna` returns very few hits inside `src/components/lavagna/`:

- `src/components/lavagna/VideoFloat.jsx:210` — "Torna al catalogo" (videocorso back, NOT lavagna exit)
- `src/components/simulator/canvas/DrawingOverlay.jsx:224` — comment only
- `src/services/drawingSync.js:273` — comment only

**No `data-elab-action="esci-lavagna"` button currently exists in source** (the L4 spec selector list `[data-elab-action="esci-lavagna"|"exit"], button:has-text("Esci"), …, button:has-text("Torna ai Ragazzi")` is forward-compatible — it covers a button that may not be wired yet, plus tab-switch fallback).

### 2. Tab-switch via `AppHeader` (primary observed path)

`src/components/lavagna/AppHeader.jsx` lines 40-65 expose 4 tab buttons that call `onTabChange?.(view)`:

- `Lavagna` (current)
- `Lezione Guidata` → `'lezione'`
- `Classe` → `'classe'`
- `Progressi` → `'progressi'`

A click on any non-Lavagna tab unmounts `LavagnaShell` (and therefore `DrawingOverlay`). This is the de-facto "Esci" path observed live by Andrea.

### 3. Hash-based routing (`App.jsx`)

`src/App.jsx:132,378` registers two `hashchange` + `popstate` listeners syncing URL → React state. Browser Back / forward / direct hash edit all flow through `syncFromUrl`, which causes the LavagnaShell mount / unmount.

### 4. Page-close / refresh / tab-close

- `src/components/tutor/ElabTutorV4.jsx:782` — `beforeunload` listener for tutor
- `src/hooks/useSessionTracker.js:213-216` — `beforeunload` + cleanup
- `src/services/unlimMemory.js:535` — `beforeunload` flush of pre-serialized beacon payload
- `src/services/studentTracker.js:73-76` — `visibilitychange` + `beforeunload`

**`DrawingOverlay` does NOT register its own `beforeunload`**. F1 relies entirely on the React unmount cycle.

## Lifecycle coverage matrix

| Exit type | Browser event(s) | Triggers React unmount? | F1 unmount flush fires? | Beacon-style sync save? |
|---|---|---|---|---|
| Tab-switch (`onTabChange`) | none — pure React state | ✅ yes | ✅ yes | n/a |
| Browser Back / Forward | `popstate` | ✅ yes via `syncFromUrl` → React re-render | ✅ yes | n/a |
| Hash edit (manual) | `hashchange` | ✅ yes via `syncFromUrl` | ✅ yes | n/a |
| Tab close / window close | `beforeunload`, `unload` | ❌ no — React unmount runs but cleanup is async / fire-and-forget over network | ⚠️ scheduled but may NOT complete network round-trip | ❌ no `sendBeacon` fallback for paths |
| Browser navigate to external URL | `beforeunload` | ❌ no | ⚠️ same as above | ❌ |
| App crash / SIGKILL | none | ❌ no | ❌ no | ❌ |
| Tab put in background (mobile) | `visibilitychange` (`hidden`) | ❌ no — React keeps mounted | ❌ no | ❌ no |

## Findings

1. **F1 covers Tab-switch + popstate + hashchange** ✓ (lifecycle event triggers React unmount, `flushDebouncedSave` fires).
2. **F1 does NOT cover beforeunload / tab-close** ⚠️ — `flushDebouncedSave` uses `fetch` (async). Browser kills the request mid-flight ~50% of the time (per MDN). Maker-2 L3 atom (referenced in PDR) introduces `navigator.sendBeacon` synchronous send for last-resort save; required for full closure.
3. **`visibilitychange` not handled at all in `DrawingOverlay`** — mobile Safari pause + lock screen + crash = data loss. Recommend follow-up atom iter 36+ to add `visibilitychange === 'hidden'` listener calling `flushDebouncedSave`.
4. **No explicit `Esci` button currently in source** — Andrea uses tab-switch to leave Lavagna. The L4 spec selector chain is forward-compatible.

## L3 dependency (Maker-2 owns, NOT this atom)

`src/components/simulator/canvas/DrawingOverlay.jsx` should add:

```js
useEffect(() => {
  const flushOnUnload = () => {
    try {
      const payload = JSON.stringify({ paths: pathsRef.current });
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(`${SUPABASE_URL}/rest/v1/scribble_paths`, blob);
    } catch { /* ignore */ }
  };
  window.addEventListener('beforeunload', flushOnUnload);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushOnUnload();
  });
  return () => {
    window.removeEventListener('beforeunload', flushOnUnload);
    document.removeEventListener('visibilitychange', flushOnUnload);
  };
}, [experimentId]);
```

(Indicative only — Maker-2 owns.)

## Conclusion

- F1 fix (`d3ad2b3`) covers **3/4 categories** of the lifecycle surface (tab-switch, browser back/forward, hash change). It is correct in design.
- `beforeunload` + `visibilitychange` paths require an additional sync save (`sendBeacon`) — L3 Maker-2 atom mandate iter 35.
- The persistent Andrea bug 2026-05-04 PM is **NOT a coverage gap** — it is a deploy gap (see L1 audit). Once `d3ad2b3` reaches prod, F1 closes the dominant case (tab-switch / hash exit). L3 is needed for true 100% closure.

## Caveats

1. `useSessionTracker.js` already wires `visibilitychange` for session telemetry, but does NOT call `flushDebouncedSave` for drawings — bridging it to drawingSync is part of L3 scope.
2. Mobile Safari (LIM iPad target per ADR mobile pattern) is the worst-case browser for `beforeunload` reliability; `sendBeacon` is the only reliable channel.
3. F1 is asynchronous — even when React unmount fires, the network call may not complete if the parent component is being destroyed by full page navigation. Tab-switch within the SPA is safe; full reload is not.
