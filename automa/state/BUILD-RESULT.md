# Build Result — 2026-04-09 16:32

## TASK: FIX P2 — AbortSignal.timeout for 3 high-risk services
## FILES: authService.js (2), compiler.js (1), licenseService.js (2)
## TEST PRIMA: 1554
## TEST DOPO: 1554 (zero regressions — no new tests needed, existing tests verify)
## BUILD: PASS (47.88s, 2413 KiB)
## STATUS: COMPLETATO — 5/5 fetch calls now have timeout

## Fix applicato
| File | Line | Timeout | Context |
|------|------|---------|---------|
| authService.js | ~122 | 10s | apiCall (login, register, all API) |
| authService.js | ~362 | 10s | token refresh (auto-refresh timer) |
| compiler.js | ~295 | 30s | fetchHexFile (precompiled HEX cache) |
| licenseService.js | ~80 | 10s | verifyLicense (blocks app access) |
| licenseService.js | ~157 | 10s | releaseLicense (logout cleanup) |

## Impatto
- Login non puo' piu' bloccare l'UI indefinitamente
- Compilazione ha timeout 30s (sufficiente per cold start)
- Verifica licenza non puo' piu' bloccare l'accesso all'app
- Tutti i timeout generano AbortError catturato dai catch esistenti
