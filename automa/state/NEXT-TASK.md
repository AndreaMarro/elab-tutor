# Next Task — 2026-04-09 04:17 (Ciclo 5)

## TASK
Scrivi 15+ test per studentService.js (servizio studente, zero test dedicati)

## PERCHE'
- 9 servizi gia' coperti stanotte. studentService e' il 10°
- Gestisce profilo studente, sessioni, reflections
- Ha _pruneIfNeeded() per bounded localStorage — testabile
- Zero rischio (solo tests/)

## FILE
- tests/unit/studentService.test.js (NUOVO)

## APPROACH
1. Leggi src/services/studentService.js
2. Testa: _getReflections, _pruneIfNeeded, saveReflection, getStudentProfile
3. Edge case: localStorage vuoto, pieno, JSON corrotto, zero reflections

## SUCCESS
npm test passa, +15 test
