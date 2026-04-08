# Next Task — 2026-04-09 03:17 (Ciclo 4)

## TASK
Scrivi 20+ test per classProfile.js (zero coverage, usato da Teacher Dashboard)

## PERCHE'
- classProfile.js ha 0% test coverage
- E' il servizio che costruisce il profilo classe per il dashboard docente
- Dashboard e' area con gap 5→7 (maggiore gap)
- Codebase pulito (Scout non ha trovato bug P0/P1)
- Scrivere test e' la cosa piu' produttiva ora

## FILE
- tests/unit/classProfile.test.js (NUOVO)

## APPROACH
1. Leggi src/services/classProfile.js
2. Testa buildClassProfile, buildClassContext, getWelcomeMessage, getNextLessonSuggestion
3. Edge case: classe vuota, 1 studente, 30 studenti, dati mancanti
4. Memoizzazione: verifica cache TTL

## SUCCESS
- npm test passa, +20 test

## RISK
Zero (solo tests/)
