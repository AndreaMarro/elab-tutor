# Scout Findings — 2026-04-09 16:08 (Ciclo 17 — TARGETED P2 AUDIT)

## Score: 92/100
## P1 Regex: RISOLTO (ciclo 16)
## Focus: P2 fetch timeout + nuove scoperte

---

## P2: 11 FETCH SENZA TIMEOUT (6 servizi)
**Status**: NON RISOLTO — pronto per Builder

| Servizio | Fetch senza timeout | Rischio |
|----------|-------------------|---------|
| authService.js | 2 (login, token refresh) | **ALTO** — login puo' bloccarsi |
| compiler.js | 1 (compilazione) | **ALTO** — compilazione puo' bloccare UI |
| gdprService.js | 2 (delete, webhook) | MEDIO — operazioni rare |
| unlimMemory.js | 2 (sync, load) | MEDIO — background sync |
| studentService.js | 2 (save, load) | MEDIO — background |
| licenseService.js | 2 (verify, release) | **ALTO** — blocca accesso app |

**Fix raccomandato**: Aggiungere `signal: AbortSignal.timeout(10000)` a ciascun fetch.
**Nota**: api.js e voiceService.js GIA' hanno timeout. Il pattern esiste nel codebase.
**Effort**: 1-2h. **Priorita': P2.**

## P2b: 3 EVENT LISTENER SENZA CLEANUP
**File e righe**:
- `supabaseSync.js:329` — `window.addEventListener('online', ...)` senza removeEventListener
- `nudgeService.js:148` — `window.addEventListener('storage', ...)` senza cleanup
- `studentTracker.js:73` — `document.addEventListener('visibilitychange', ...)` senza cleanup

**Rischio**: Memory leak se i moduli vengono re-inizializzati (raro in SPA, ma possibile).
**Effort**: 30min. **Priorita': P3.**

## P2c: 3 SETINTERVAL SENZA CLEANUP GARANTITO
- `supabaseSync.js:328` — setInterval sync ogni 5 min
- `unlimMemory.js:524,529` — 2 setInterval (sync + autosave)
- `nudgeService.js:142` — setInterval poll

**Rischio**: Se il modulo viene reinizializzato, timer duplicati si accumulano.
**Nota**: compiler.js usa `setTimeout(r, 5000)` in retry loop — OK, non leak.
**Effort**: 30min. **Priorita': P3.**

## Problemi RISOLTI (rispetto a ciclo 16)
- ~~P1 Regex bypass~~ → RISOLTO (commit bfd5380)
- api.js aveva timeout sospetti → VERIFICATO: tutti 9 fetch hanno signal/AbortSignal
- voiceService.js → VERIFICATO: ha AbortController con 45s timeout
- notionService.js → VERIFICATO: ha signal

## Azione raccomandata per Builder
**Prossimo ciclo**: P2 fetch timeout su authService.js + compiler.js + licenseService.js (i 3 ad ALTO rischio). Poi gdprService, unlimMemory, studentService.
