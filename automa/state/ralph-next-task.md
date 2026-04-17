# Ralph Loop — Next Task Consensus

**Status:** PENDING
**Updated by:** seed interactive session
**Updated at:** 2026-04-18T08:55Z

## Regole di scelta (lette dal builder)

Il builder sceglie un TASK solo se soddisfa TUTTE queste condizioni:

1. È in `## Rimanenti` qui sotto con checkbox `[ ]`
2. Non richiede modifiche a file critici (vedi lista sotto) — altrimenti ESCALATE ad Andrea
3. Ha un criterio di "fatto" esprimibile in ≥3 test comportamentali misurabili
4. Si completa in <25 minuti di lavoro focalizzato (se serve più tempo: spezza)
5. Non ha dipendenze da infrastruttura non verificata (es. Kokoro TTS locale se non gira)

## File critici — intoccabili senza ESCALATE

- src/components/simulator/engine/CircuitSolver.js
- src/components/simulator/engine/AVRBridge.js
- src/components/simulator/engine/PlacementEngine.js
- src/components/simulator/canvas/SimulatorCanvas.jsx
- src/components/simulator/NewElabSimulator.jsx
- src/services/api.js (eccetto bug fix mirati <30 righe diff)
- package.json (niente npm install autonomo)
- vite.config.js
- vercel.json (solo con evidenza che serve per il TASK)

## Completati (verificare con git log prima di riassegnare)

- [x] TASK 1 — Drawing persistence per experimentId → commit 59e8fce
- [x] TASK 2 — FloatingToolbar drag fix → commit 62c9702
- [x] TASK 6 — useUnlimNudge integration → commit 62c9702
- [x] TASK 7 — ensureBookCitation → commit 8293e3f
- [x] TASK 10 — Vercel /api/tts proxy → commit 927cdbd
- [x] TASK 11b — Ricerca web validata 2026 → commit 59e8fce

## Rimanenti (priorità top-down)

- [ ] TASK 11a — OpenClaw valutazione doc
  - Output: docs/strategia/2026-04-18-openclaw-valutazione.md
  - Criteri fatto: (a) ≥3 use case ELAB valutati con fattibilità/costo/alternative (b) decisione SÌ/NO motivata per ogni use case (c) almeno 2 WebSearch references (d) ≥5 test su un nuovo openclawAdvisor.js che decide se un use case e' adatto
  - NON richiede file critici — SAFE

- [ ] TASK 12 — Handoff doc
  - Output: docs/plans/2026-04-19-next-session-plan.md
  - Criteri fatto: (a) elenca TASK completati con SHA (b) elenca TASK rimanenti con effort stimato (c) include baseline test count verificato con comando (d) include score 30 criteri da commercial-readiness.json se esiste
  - NON richiede codice — SAFE

- [ ] TASK 3 — Allinea v3-cap6-esp1 a libro p.56 (LED + digitalWrite + 470Ω)
  - Output: modifica src/data/experiments-vol3.js + eventuale lesson-paths JSON
  - Criteri fatto: (a) components include nano-r4 + led-red + resistor-470 + breadboard (b) connections collegano D13 → anodo + catodo → resistenza → GND (c) unlimPrompt cita "pagina 56" (d) ≥5 test nuovi in tests/unit/v3Cap6Esp1ParityLibro.test.js
  - RISCHIO: tocca data ma i CircuitSolver test potrebbero dipendere — ESCALATE se test CircuitSolver rompono

- [ ] TASK 4 — Allinea v3-cap7-esp1 a libro p.65 (pulsante + digitalRead + if/else)
  - Come TASK 3 ma pulsante + INPUT_PULLUP

- [ ] TASK 5 — Allinea v3-cap7-esp5 a libro p.77 (analogRead + Serial)
  - Come TASK 3 ma potenziometro + Serial.begin(9600)

- [ ] TASK 11 — Dashboard docente dati Supabase reali — RICHIEDE Andrea per schema + auth, ESCALATE primo ciclo
- [ ] TASK 8 — E2E Vision via Playwright MCP — RICHIEDE Andrea pre-approval tool
- [ ] TASK 9 — E2E Voice via Playwright MCP — RICHIEDE Andrea pre-approval tool

## Status machine

- **PENDING** → builder sceglie autonomo dalla lista `[ ]` alta
- **ASSIGNED: TASK X** → builder fa solo quello, senza scelta
- **REVERT: <sha>** → builder esegue `git revert --no-edit <sha>`, niente altro
- **FIX-FORWARD: <descrizione>** → builder corregge il problema e commit come "fix(ralph): <desc>"
- **ESCALATE: <motivo>** → builder NON lavora, solo scrive log "waiting Andrea"
- **BLOCKED-BY-AUDITOR** → builder ha avuto 2 REVERT consecutivi, aspetta Andrea

## Storico Status (append-only dall'auditor)

- 2026-04-18T08:55Z: PENDING (seed interactive)
