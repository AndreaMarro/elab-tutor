# I1 HomeCronologia render audit

**Date**: 2026-05-04 PM
**Owner**: Tester-1
**Atom**: I1 HomeCronologia render audit (15 min budget)

## Result

❌ NOT VERIFIABLE iter 35 — prod homepage CRASHED with React error boundary; HomeCronologia component never reached mount.

## Method

1. `mcp__plugin_playwright_playwright__browser_navigate` https://www.elabtutor.school/
2. Selectors probed: `[data-elab-cronologia]`, `[data-testid*="cronologia"]`, `[class*="HomeCronologia"]`, `[class*="Cronologia"]`
3. Body innerText scanned for `/cronologia/i`

## Findings

| Selector | Match count |
|---|---|
| `[data-elab-cronologia]` | 0 |
| `[data-testid*="cronologia"]` | 0 |
| `[class*="HomeCronologia"]` | 0 |
| `[class*="Cronologia"]` | 0 |
| innerText `/cronologia/i` | 0 |

Prod body innerText (164 chars total): `"ELAB / Ops! Qualcosa è andato storto / Non preoccuparti! Prova a ricaricare la pagina. Se il problema continua, contattaci. / Ricarica la pagina / Mostra dettagli tecnici"`.

## Root cause (NOT this atom — upstream blocker)

The lazy import of HomePage / HomeCronologia chunks is gated by Suspense; the boundary `mammoth-BJyv2V9x.js` throws `TypeError: Cannot read properties of undefined (reading 'default')` because a dynamic chunk dependency exports `undefined` from its module shape — likely a Vite chunk-splitting regression where `mammoth.browser` ESM `default` is consumed but the bundle alias points to a CJS variant.

Stack (excerpt from prod error boundary "Mostra dettagli tecnici"):

```
TypeError: Cannot read properties of undefined (reading 'default')
    at q (https://www.elabtutor.school/assets/react-vendor-KIHy-Drs.js:2:4685)
    at Lazy / Suspense
    at https://www.elabtutor.school/assets/mammoth-BJyv2V9x.js:193:90463
```

## Recommendation iter 35+

1. Andrea action: open prod in browser locally → "Mostra dettagli" → copy stack → assign to Maker-1 P0.
2. Likely fix: `import * as mammoth from 'mammoth/mammoth.browser'` instead of default import; OR Vite externalize override.
3. Re-run I1 audit post fix: navigate prod → expect HomeCronologia mounted with empty / loaded state UI.

## Caveats

1. Source contains commit `e90a07d` iter 36 M1+Q1+O1+workflow1 ("HomePage 5 NEW SVG impeccable + Glossario 4° card") + commit `f76e4e5` iter 36 ("Footer credits Teodora") — both on `e2e-bypass-preview` branch, neither verified live.
2. Same prod crash also blocks M3 (mascotte) + M4 (credits) + O1 (Glossario) + browser visual M-series as documented in `iter-35-tester1-findings.md`.
