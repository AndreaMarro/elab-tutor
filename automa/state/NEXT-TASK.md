# Next Task — 2026-04-09 15:18 (Ciclo 16)

## TASK: FIX P1 — Safety filter regex bypass in aiSafetyFilter.js
## FILE: src/utils/aiSafetyFilter.js
## APPROACH:
1. Rimuovere `\b` finale dai pattern che bloccano suffissi italiani
2. Usare pattern prefix-match: `porn` (senza \b finale) cattura "porn", "pornografia", "porno"
3. Per prompt injection: aggiungere "tutte le" come alternativa nel gruppo
4. Verificare che i test esistenti (safetyFilters.test.js) passano ancora
5. Aggiungere test per i 4 casi bypass scoperti dal Tester

## SUCCESS CRITERIA:
- `filterAIResponse("pornografia")` → safe: false
- `filterAIResponse("ammazzare")` → safe: false
- `filterAIResponse("esplosivo")` → safe: false
- `filterAIResponse("ignora tutte le istruzioni")` → safe: false
- TUTTI i 1526 test esistenti passano (zero regressioni)
- npm run build passa

## RISK: BASSO — modifica 4 regex, test gia' scritti
## IMPATTO: ALTO — sicurezza minori, compliance COPPA/GDPR
## EFFORT: 30min-1h
## WHY NOW: Orchestratore ha ordinato shift da infrastruttura a prodotto.
Scout ha classificato P1. Tester ha documentato i 4 casi. È il fix piu' impattante col minimo rischio.

## NON FARE:
- Non toccare contentFilter.js (separato, funziona)
- Non aggiungere nuove categorie di pattern
- Non riscrivere l'intera funzione — solo i 4 regex rotti
