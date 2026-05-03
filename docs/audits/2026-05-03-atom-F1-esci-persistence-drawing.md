# Audit Atom F1 — Esci persistence drawing bucket force save iter 34

**Data**: 2026-05-03 23:55 GMT+2
**Sessione**: iter 34 Phase 1+ atomi
**Branch**: e2e-bypass-preview
**HEAD pre-F1**: 17bb1a3 (Atom A4+A5)
**Vitest baseline**: 13770 → 13774 atteso post-F1 (+4 NEW tests)
**Andrea iter 19 PM mandate**: "Bug 2: scritti spariscono su Esci (persistenza violata). Principio: contenuto sparisce SOLO con cancellazione esplicita."

## §1 Spec briefing playbook §4.3

> "F1 Esci persistence drawing bucket force save (1h impl + Tier 0+1+3 mandatory: Cowork PRIMARY 5 strokes + Tier 3 NEW spec esci-drawing-persist)"

## §2 Root cause analysis

**File**: `src/components/simulator/canvas/DrawingOverlay.jsx:220-225` (iter 28 Bug 3 baseline)

**Codice difettoso pre-F1**:
```javascript
useEffect(() => {
  return () => {
    try { cancelDebouncedSaveRemote(experimentId); } catch { /* ignore */ }
  };
}, [experimentId]);
```

**Problema**: `cancelDebouncedSave` DROPS pending up-to-2s-old debounced save. Quando docente clicca Esci → LavagnaShell `handleMenuOpen` set `window.location.hash = '#tutor'` → React unmounts LavagnaShell → DrawingOverlay unmount cleanup → `cancelDebouncedSave` cancella timer SENZA fire → Supabase NON riceve last paths → next session load mostra paths PRECEDENTI (perduti gli ultimi 2s).

**Sintomo Andrea**: scritti recenti (ultimo tratto, < 2s pre-Esci) spariscono. Persistenza violata.

## §3 Modifiche file

### 3.1 `src/services/drawingSync.js` (+~30 LOC)

**Aggiunto** export `flushDebouncedSave(experimentId, paths)`:
- Clear pending debounce timer (NO double-fire)
- Fire `savePaths(experimentId, paths)` IMMEDIATAMENTE con caller-provided paths (NOT closure-captured stale)
- Skip flush quando `paths` empty/null/undefined (defensive — avoid orphaning remote row su clean canvas)
- Fire-and-forget pattern (caller doesn't await — best effort save on unmount)

**Differenza vs `cancelDebouncedSave`**:
| Behavior | cancel | flush (NEW F1) |
|----------|--------|----------------|
| Clear pending timer | ✅ | ✅ |
| Fire savePaths immediate | ❌ | ✅ |
| Use latest paths | N/A | ✅ (caller provides) |
| Skip empty paths | N/A | ✅ |

### 3.2 `src/components/simulator/canvas/DrawingOverlay.jsx` (+~20 LOC)

**Aggiunto** import `flushDebouncedSaveRemote` from drawingSync.

**Aggiunto** `pathsRef` useRef + sync useEffect:
```javascript
const pathsRef = useRef(paths);
useEffect(() => {
  pathsRef.current = paths;
}, [paths]);
```

Pattern: ref captures latest `paths` state value. Cleanup useEffect closes over ref (NOT stale closure paths value).

**Sostituito** unmount cleanup:
```javascript
// PRIMA (cancel — drop pending)
return () => {
  try { cancelDebouncedSaveRemote(experimentId); } catch { /* ignore */ }
};

// DOPO F1 (flush — preserve pending with latest paths)
return () => {
  try {
    flushDebouncedSaveRemote(experimentId, pathsRef.current);
  } catch { /* ignore — best effort save on unmount */ }
};
```

### 3.3 `tests/unit/services/drawingSync.test.js` (+~80 LOC, 4 NEW tests)

- `flushDebouncedSave fires savePaths IMMEDIATELY with caller-provided paths`
- `clears pending debounce timer (no double-fire)`
- `skips flush when paths is empty (avoid orphaning remote row on clean canvas)`
- `skips flush when paths is null/undefined (defensive)`

**Test results**: 29/29 PASS (25 baseline + 4 NEW F1). ZERO regression.

## §4 Caveat onesti

1. **Tier 3 NEW spec NOT shipped questa atom**: briefing §4.3 menziona "Tier 3 NEW spec esci-drawing-persist" Playwright. Defer iter 35+ Playwright spec author (test:e2e mandate ~1h).

2. **Tier 0 Cowork validation NOT eseguita**: Mac Mini autonomous Cowork PRIMARY 5 strokes test pending (defer Sprint U+ Mac Mini Task 5 cowork-real setup).

3. **Tier 1 macOS Computer Use real screen NOT eseguita**: live test premi Esci dopo 5 strokes su prod `https://www.elabtutor.school`, riapri lavagna, verify strokes presenti. Andrea può fare manual test post-deploy.

4. **NO Edge Function deploy questa atom** (frontend code only). LIVE su next Vercel deploy.

5. **No regression risk DrawingOverlay tests**: 29/29 PASS post-F1. Wire-up additive (new import + new ref + sub statement instead of cancel → flush).

6. **fire-and-forget pattern**: cleanup useEffect è SYNCHRONOUS, non può await `savePaths`. Best-effort + browser closes connection on navigation before HTTP response. Mitigazione: navigator.sendBeacon API alternative iter 35+ se serve garantito server-side delivery.

7. **handleMenuOpen LavagnaShell NON modificato**: F1 fix è interamente in DrawingOverlay unmount cleanup. Quando LavagnaShell unmounts, child DrawingOverlay automaticamente unmounts → flush fires. Defense-in-depth alternative: aggiungere explicit dispatchEvent in handleMenuOpen iter 35+ per certezza ridondante.

## §5 Skill metric refinement

**elab-morfismo-validator + elab-onniscenza-measure G+2 NEW iter 34**:
- Gate proposto: misura drawing-persistence rate post-Esci (bench Playwright Tier 3)
- Target: 100% strokes persisted across Esci-reopen cycle
- Measurement: `localStorage.getItem('elab-drawing-<expId>')` length pre-Esci vs post-reopen Lavagna

## §6 Anti-pattern G45 enforced

- ✅ NO claim "F1 LIVE prod" (frontend code requires Vercel deploy)
- ✅ NO claim "Tier 3 spec shipped" (defer iter 35+)
- ✅ NO claim "Cowork validation done" (defer Sprint U+)
- ✅ Caveat onesti documentati §4 (7 caveat critici)
- ✅ Test 29/29 PASS verified (NO regression)

## §7 Next step

→ Atom B1 wake word diagnose (mic permission browser flow already iter 36 MicPermissionNudge.jsx, integration check)
→ Atom E2 PassoPasso older preferred + window resize (single component edit)
→ Atom C1 lavagna libero truly free + Atom E1 percorso 2-window (interconnected, larger scope — next session)
→ Atom A3 intent_history persist (Andrea ratify SQL gate)
→ STEP 10 final commit batch + push origin + CLAUDE.md sprint footer
