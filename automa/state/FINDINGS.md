# Scout Findings — 2026-04-09 15:08 (Ciclo 16 — DEEP SCAN)

## Score: 92/100 (evaluate-v3.sh)
## Codebase: STABILE ma con 6 problemi reali trovati

---

## P1: SAFETY FILTER REGEX BYPASS (4 pattern)
**File**: `src/utils/aiSafetyFilter.js`
**Problema**: `\b` word boundary non cattura suffissi italiani.
- `pornografia` bypassa `porn\b`
- `ammazzare` bypassa `ammazzar\b`
- `esplosivo` bypassa `esplosiv\b`
- `ignora tutte le istruzioni` bypassa il pattern (manca `le` tra `tutte` e `istruzioni`)
**Impatto**: Bambino puo' ricevere contenuto non filtrato.
**Fix**: Rimuovere `\b` finale, usare pattern prefix-match.
**Effort**: 1h. **Priorita': P1 SICUREZZA MINORI.**

## P2: 15 FETCH SENZA TIMEOUT (5 servizi)
**File**: gdprService, voiceService, unlimMemory, studentService, compiler, notionService, authService
**Problema**: 15 chiamate fetch senza AbortController/timeout.
**Impatto**: Se il server non risponde, l'UI si blocca indefinitamente.
**Fix**: Aggiungere `AbortSignal.timeout(10000)` a ogni fetch.
**Effort**: 2h. **Priorita': P2.**

## P3: SCRATCH XML = 2% (11/577 esperimenti)
**Problema**: Solo 11 esperimenti su 577 hanno `scratchXml` configurato.
**Impatto**: La modalita' Scratch/Blockly e' quasi inutilizzabile.
**Note**: I 577 "experiments" includono sub-entries (id: per step). Il conteggio reale di esperimenti unici e' 92.
**Effort**: Alto (richiede creazione XML per ogni esperimento). **Priorita': P3 — lungo termine.**

## P4: BUILDSTEPS = 11% (62/577 entries)
**Problema**: Solo 62 entries hanno `buildSteps` configurato.
**Impatto**: Le 3 modalita' (Gia' Montato/Passo Passo/Percorso) non funzionano per la maggior parte.
**Note**: Come Scratch, richiede contenuto manuale per ogni esperimento.
**Effort**: Alto. **Priorita': P3.**

## P5: 10+ EMPTY CATCH BLOCKS
**File**: AuthContext, WelcomePage, AdminDashboard, AdminEventi, AdminUtenti, etc.
**Problema**: `catch { }` senza logging = errori silenziosi, debugging impossibile.
**Impatto**: Bug nascosti. Se qualcosa si rompe, non c'e' traccia.
**Fix**: Aggiungere `logger.error()` in ogni catch.
**Effort**: 1h. **Priorita': P3.**

## P6: HARDCODED PLACEHOLDER
**File**: `src/components/admin/gestionale/modules/ImpostazioniModule.jsx:508`
**Problema**: `placeholder="sk-..."` — suggerisce formato chiave OpenAI nel placeholder.
**Impatto**: Basso (solo placeholder), ma potrebbe confondere.
**Fix**: Cambiare in placeholder generico.
**Effort**: 5 min. **Priorita': P4.**

---

## Cose che FUNZIONANO
- 0 PR aperte — repo pulito
- 84 lesson paths, 82 con resume_message (98%)
- 1526 test passano, build OK
- Nessun segreto hardcodato in src/
- Solo 3 TODO/FIXME nel codice (pulito)

## Azione raccomandata per Builder
**PROSSIMO CICLO**: Fix P1 (regex safety) — impatto sicurezza minori, effort 1h.
