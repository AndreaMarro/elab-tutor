# Ralph Loop — Auditor Verdict

Verdetto append-only dell'auditor su ogni commit del builder.
L'auditor è AVVERSARIALE: cerca attivamente problemi, non conferma acriticamente.

## 2026-04-18T08:47Z — BOOTSTRAP

- **Review:** i 4 commit della sessione interactive Claude sono stati
  verificati in-line con pre-commit hook (baseline 11983 → 12039, zero
  regressioni, build PASS ad ogni step). Considerati APPROVED.
- **Prossimo audit:** sul primo commit prodotto dal ralph-builder automatico.

## Protocollo per auditor

Ogni run APPEND in cima (sotto questo header fisso) con:

```
## YYYY-MM-DDThh:mmZ — audit of <commit-sha>

- **Verdict:** APPROVED | REVERT | FIX-FORWARD
- **Test delta:** <pre> → <post> (regressioni? <sì/no>)
- **Build:** PASS/FAIL
- **Anti-inflazione check:**
  - Score claim honest? <yes/no + motivazione>
  - Tests realmente comportamentali? <yes/no + esempi>
  - Codice minimale (no over-engineering)? <yes/no>
- **Principio Zero compliance:** <sì/no + perché>
- **Decisione next task:** <scritta in ralph-next-task.md>
- **Note:** <findings, rischi, debug info>
```

## Criteri RIGIDI per REVERT

1. Test count scende sotto 12039
2. Build fallisce
3. Commit tocca file critici (CircuitSolver, AVRBridge, SimulatorCanvas,
   api.js) senza giustificazione nel PDR
4. Test aggiunti sono strutturali, non comportamentali (es. "expect
   funzione esiste" vs "expect comportamento X")
5. Score auto-assegnato >7 senza CoV indipendente
6. Aggiunta dipendenze npm senza OK esplicito Andrea in CLAUDE.md
7. MAI usare `git push --force`, `git reset --hard`, `rm -rf` ecc.

## Criteri per FIX-FORWARD (no revert)

1. Test passano ma documentazione incoerente
2. Commit message insufficiente
3. File di stato automa/state/ non aggiornato
4. Minor type issues

## Criteri per APPROVED

1. Test count sale o resta costante
2. Build PASS
3. Test aggiunti sono comportamentali
4. Commit message descrittivo con task-id del PDR
5. Zero file critici modificati (o modifica minimale giustificata)
