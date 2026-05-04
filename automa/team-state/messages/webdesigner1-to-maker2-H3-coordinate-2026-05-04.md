# WebDesigner-1 → Maker-2 — Coordination atoms H1 + H3 + N3

**Date**: 2026-05-04
**From**: WebDesigner-1 (HomePage SVG + Cronologia + PercorsoPanel)
**To**: Maker-2 (LavagnaShell + ComponentDrawer + drawingSync)
**Atoms**: H1 (lavagna-solo route), H3 (default focus pen tool), N3 (z-index)

## H1 — Lavagna libera launch flag

App.jsx VALID_HASHES strict whitelist (`['home','tutor','lavagna',...]`)
non include `#lavagna-solo`. Per evitare di rompere il routing global,
**non ho aggiunto** un hash dedicato. Soluzione iter 35 lato
WebDesigner-1 (`src/components/HomePage.jsx`):

- Card `lavagna` mantiene `href: '#lavagna'`.
- Aggiunto campo `launchMode: 'solo'` sull'oggetto card.
- `HomeCard.handle()` su click setta `localStorage.elab_lavagna_launch_mode = 'solo'`
  PRIMA di chiamare `onActivate(href)`.

### Action item Maker-2 (H1 + H3 wire-up):

1. In `LavagnaShell.jsx` su mount:
   ```js
   const launchMode = (() => {
     try {
       const v = localStorage.getItem('elab_lavagna_launch_mode');
       localStorage.removeItem('elab_lavagna_launch_mode'); // consume one-shot
       return v;
     } catch { return null; }
   })();
   ```
2. Se `launchMode === 'solo'`:
   - Settare `data-elab-mode="lavagna-solo"` su root LavagnaShell
   - Default focus pen tool (atom H3): `setActiveTool('pen')` o equivalente
   - Nascondi Percorso/UNLIM auto-aperti iniziali (utente decide se aprirli)
3. Altrimenti comportamento default invariato (Percorso/UNLIM autoaperti).

## H3 — Pen tool default focus

Solo applicato quando `launchMode === 'solo'`. Vedi sopra.

## N3 — Z-index PercorsoPanel vs UNLIM

`FloatingWindow` (in `src/components/lavagna/FloatingWindow.jsx`) usa
un z-counter modulo statico (start 1010, increment on bringToFront).
Ogni nuovo focus → z++ → finestra ultima cliccata davanti.

PercorsoPanel iter 35 N2:
- Posizione iniziale **left-top** ~4% margin sx, ~10% top
- Width 30vw (max 420px), height 55vh (max 620px)
- UNLIM panel default position deve essere **right-side** per evitare
  overlap su 1920×1080 LIM (default GalileoAdapter già rispetta — verify).

### Action item Maker-2 (N3):

1. Verifica in `GalileoAdapter.jsx` che la posizione default UNLIM
   `defaultPosition` sia `x ≥ 50vw` (right-half schermo) per
   evitare collision con PercorsoPanel left-top.
2. Se non già così: aggiornare GalileoAdapter `defaultPosition` a:
   ```js
   x: Math.round(window.innerWidth * 0.65),
   y: Math.round(window.innerHeight * 0.10),
   ```
3. **NO need** per fissare z-index hardcoded (10000 vs 10001) —
   il pattern bringToFront di FloatingWindow gestisce già il layering
   runtime correttamente.

## Caveats

- Atom H1 lato WebDesigner-1 (HomePage) SHIPPED iter 35.
- Atom H3 + parte runtime di H1 (consume flag + apply data-elab-mode +
  default pen tool) richiede edit di LavagnaShell.jsx → **OWNED Maker-2**.
- Atom N3 verifica GalileoAdapter default position → **OWNED Maker-2**.
- Coordinamento via filesystem barrier `automa/team-state/messages/`
  (race-cond fix Pattern S r3 — questo file presente PRE Maker-2 spawn).

## Files touched lato WebDesigner-1

- `src/components/HomePage.jsx` CARDS array `lavagna` entry +
  `HomeCard.handle()` setta launchMode flag.
- `src/components/lavagna/PercorsoPanel.jsx` REWRITE iter 35 N2+J3
  con left-top default position + Vol switcher + memory class fallback.

— WebDesigner-1, iter 35 Phase 2
