# Ralph Loop — Next Task Consensus

**Status:** PENDING (nessun task assegnato — builder sceglie autonomamente)
**Updated by:** ralph-auditor (o ralph-builder al primo fire)
**Updated at:** 2026-04-18 (iterazione 1)

## Task disponibili (PDR v3 DEFINITIVO)

Completati in precedenza:
- [x] TASK 1 — Drawing persistence per experimentId (commit 59e8fce)
- [x] TASK 2 — FloatingToolbar drag fix (commit 62c9702)
- [x] TASK 6 — useUnlimNudge integration (commit 62c9702)
- [x] TASK 7 — ensureBookCitation post-processing (commit 8293e3f)
- [x] TASK 10 — Vercel /api/tts proxy (commit 927cdbd)
- [x] TASK 11b — Ricerca web validata 2026 (commit 59e8fce)

Rimanenti (ordine consigliato dal PDR):
- [ ] TASK 3 — Allinea v3-cap6-esp1 a libro p.56 (LED + digitalWrite + 470Ω)
- [ ] TASK 4 — Allinea v3-cap7-esp1 a libro p.65 (pulsante + digitalRead + if/else)
- [ ] TASK 5 — Allinea v3-cap7-esp5 a libro p.77 (analogRead + Serial)
- [ ] TASK 11a — OpenClaw valutazione doc
- [ ] TASK 11 — Dashboard docente dati reali Supabase
- [ ] TASK 8 — E2E Vision test (Playwright MCP)
- [ ] TASK 9 — E2E Voice test (Playwright MCP)
- [ ] TASK 12 — Handoff doc

## Istruzione al builder

Se questo file dice `Status: PENDING` → scegli il TASK con checkbox `[ ]`
più in alto nella lista "Rimanenti" che sia realistico in 30 min di lavoro.

Se dice `Status: ASSIGNED: TASK X` → fai quel task specifico.

Se dice `Status: REVERT: <commit>` → git revert quel commit (dopo OK auditor)
e torna a PENDING.

Se dice `Status: FIX-FORWARD: <detail>` → correggi il problema descritto.
