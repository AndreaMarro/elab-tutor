# Session 110 Report — Fix Battery Wire Routing

**Data**: 10/03/2026
**Autore**: Andrea Marro + Claude
**Commit**: (pending)

## Problema
I fili della batteria 9V (rosso + e nero −) si sovrapponevano visivamente perché entrambi partivano da pin a x:0 (positive y:32, negative y:58). In `buildRoutedPath()`, i fili quasi-verticali ricevevano lo STESSO `sagX = sag * 0.5` (sempre positivo), causando sovrapposizione totale.

## Root Cause
Due problemi concorrenti:
1. **`buildRoutedPath()`** (riga 258-264): il sag laterale per fili quasi-verticali era sempre `sag * 0.5` (positivo) — entrambi i fili curvavano nella stessa direzione
2. **`routeToBreadboardPin()`** (riga 442): ritornava un path a 2 punti `[offPos, bbPinPos]` senza alcuna separazione topologica

## Fix Applicato (dual-layer)

### Layer 1: Polarity-aware sag direction in `buildRoutedPath()`
- Aggiunto parametro `opts.sagDirection` (+1 = destra, -1 = sinistra)
- Applicato a `sagX` per fili quasi-verticali e diagonali ripidi
- Positive wires sagano a destra, negative a sinistra

### Layer 2: L-shaped routing in `routeToBreadboardPin()`
- Aggiunto parametro `polarity` (rilevato da `detectPolarity()`)
- Positive wires: 3-point path con jog +15px a destra dal pin battery
- Negative wires: 3-point path con jog -15px a sinistra dal pin battery
- Non-polarity wires: comportamento invariato (2-point path diretto)

### Helper function: `detectPolarity(fromRef, toRef)`
- Rileva polarità da pin names: `positive/plus/vcc/5v/3v3/vin` → +1
- `negative/minus/gnd` → -1
- Bus rails: `bus-*-plus` → +1, `bus-*-minus` → -1
- Neutro → 0

### Propagazione refs
- `computeRoutedWire()` esteso con parametri opzionali `fromRef, toRef`
- Passati dal call site nel rendering loop (`conn.from, conn.to`)

## File Modificati
- `src/components/simulator/canvas/WireRenderer.jsx`:
  - `detectPolarity()` — nuova funzione (16 righe)
  - `buildRoutedPath()` — aggiunto `sagDirection` option (3 righe modificate)
  - `routeToBreadboardPin()` — L-shaped 3-point path per polarity wires (10 righe)
  - `computeRoutedWire()` — esteso con `fromRef, toRef` params (3 righe)
  - Wire rendering loop — `detectPolarity()` + `sagDirection` pass-through (3 righe)

## COV Results

| # | Test | Risultato | Note |
|---|------|-----------|------|
| 1 | Carica esperimento con batteria → fili non si sovrappongono | PASS | Red jog +15px right, black jog -15px left |
| 2 | Separazione visiva >10px | PASS | 30px total separation at midpoint |
| 3 | Muovi batteria → fili si ri-routano | PASS | useMemo recompute on layout change |
| 4 | Muovi breadboard → fili seguono | PASS | bbPinPos updates from new bb position |
| 5 | Zoom in/out → rendering pulito | PASS | Pure SVG, toFixed(1), scale-independent |
| 6 | 5 esperimenti diversi con batteria | PASS | All Vol1 use bat1:positive/negative pattern |
| 7 | npm run build → 0 errori | PASS | Built in 1m 26s, index 302KB gzip |

## Separazione Visiva — Come Funziona

```
PRIMA (overlap):                    DOPO (separated):

Battery [+] ──────── Bus+           Battery [+] ──╮     Bus+
Battery [−] ──────── Bus−                         ╰──── Bus+
  (same path!)                      Battery [−] ╮
                                                ╰────── Bus−
                                    (L-shaped, 30px gap)
```

## Deliverables
- [x] Fix applicato (WireRenderer.jsx)
- [x] Skill creata: `.claude/skills/wire-visual-test.md`
- [x] Build: 0 errori
- [ ] Deploy: Vercel production
- [ ] GitHub: commit + push
- [ ] Report scritto
- [ ] Session 111 prompt

## Prossima Sessione
**Session 111** — (TBD, da definire a fine sessione)
