# Daily Standup — Team ELAB

Prossimo standup: **Martedi 22/04/2026 ore 9:00**

---

## Standup 2026-04-21 SERA — Chiusura Day 01

**Test count**: 12149 (delta +33 vs baseline 12116)
**Build**: PASS (77s)
**Benchmark**: 4.06/10 (up from 2.77)
**Commits sessione**: 12 (9 unpushed)
**Reviewer**: APPROVE
**Auditor**: 6.5/10 (corrected, zero inflation detected)

### Fatto oggi (Day 01)
- DEV: T1-001 lavagna toggleDrawing fix (commit 1c753c3)
- DEV: T1-002 whiteboard persistenza sandbox + auto-save (commit 4d512b7)
- DEV: T1-009 Tea autoflow CODEOWNERS + GH Action (commit 129f37c)
- DEV: 9 CLI autonomous scripts (no-regression-guard, verify-llm-switch, etc.)
- DEV: 12 E2E Playwright specs (31 tests, 3/3 verified running)
- DEV: llm-client.ts dispatcher Together AI (20/20 PZ v3 PASS)
- DEV: Gemini -> Together AI provider switch (system prompt untouched)
- REVIEWER: foundations-reviewer-verdict.md — APPROVE with 5 minor issues
- AUDITOR: foundations-brutal-audit — 6.5/10, zero inflation, GO for Tuesday

### Domani mar 22/04 (Day 02, 3 task)
- **P0**: git push 9 unpushed commits + CI watch (30min, MUST FIRST)
- **P0**: T1-003 Render cold start warmup cron (2h, dev)
- **P1**: Benchmark --write persist + tighten E2E homepage assertions (1h, dev)
- Note: Tea onboarding mer 23/04 18:00 Zoom

### Blocker aperti
- 9 unpushed commits — work at risk if machine fails
- JWT 401 on Supabase edge functions — cannot verify PZ v3 live via CLI
- Dual Supabase project refs (euqpdueopmlllqjmqnyb vs vxvqalmxqtezvgiboxyv) unresolved

---

## Standup 2026-04-21 (Day 01/56 — Sprint START)

**Owner**: Andrea solo (Tea onboarding mer 23/04)
**Capacity**: 8h (09:00-18:00, pausa 13-14)
**Baseline**: 12103 test PASS, build PASS, benchmark 2.77/10

### Ieri (prep day 20/04)
- TPM: 12 harness file creati, 6 ADR scritte, baseline verificata 12103 test
- TPM: setup automa/team-state/ (5 file), .claude/agents/ (6 file), tools-config.json
- TPM: T0-001 completato e chiuso

### Oggi (3 task P0, 8h totali)
- ARCHITECT: T1-001 lavagna vuota non selezionabile (3h, blueprint state machine)
- ARCHITECT: T1-002 scritti spariscono su Esci/persistenza (3h, batch con T1-001 stesso blueprint)
- DEV: T1-009 Tea autoflow CODEOWNERS + GH Action auto-merge (2h, infra, deadline mer 23/04)
- TESTER: test paralleli per T1-001 e T1-002 dopo blueprint (assegnato post-blueprint)

### Blocker
- Working tree dirty 60+ file (CSS + engine unstaged da sessioni precedenti) — non blocca sprint, carry-over deliberato
- Supabase potenzialmente PAUSED (401) — non blocca day 01 (nessun task DB oggi)

### Quota dispatch stima
- Mattina (09-13): 3 dispatch Opus (architect x2 batch, dev x1)
- Pomeriggio (14-18): 2 dispatch Opus (tester x1, review x1)
- Totale: ~5 dispatch, sotto cap 5/giorno

---

## Standup 2026-04-20 (Prep Day — domenica)

**Owner**: Andrea solo (Tea onboarding mer 23/04)

### Ieri
- (sabato recovery, no sessione)

### Oggi (prep day)
- Andrea: lettura 7 file pre-flight PDR (AUDIT + GENERALE + SETT_1 + GIORNO_01 + MULTI_AGENT + PTC + HARNESS)
- Andrea: verifica tooling (claude 2.1.114, node 22, npm 10.9, gh 2.89) OK
- Andrea: setup `.claude/agents/team-*.md` 6 file Opus
- Andrea: setup `automa/team-state/` 5 file (tasks-board, standup, decisions, blockers, roster)
- Andrea: setup `.claude/tools-config.json` PTC enabled
- Andrea: scrive handoff `docs/handoff/2026-04-20-prep-day-end.md`

### Blocker
- Nessuno (prep day strutturale, no impl)

### Note
- Working tree dirty da sessioni precedenti (CSS + engine unstaged) - NON committare, lasciare per sett 1 review
- Stop entro 21:00 recovery serale
- Sprint START official lun 21/04 9:00 via `PDR_GIORNO_01_LUN_21APR.md`

---

## Template standup prossimi giorni

```
## Standup YYYY-MM-DD

### Ieri
- TPM: [task done]
- ARCHITECT: [blueprint done]
- DEV: [PR aperte/mergiate]
- TESTER: [test scritti]
- REVIEWER: [review fatte]
- AUDITOR: [audit report]

### Oggi
- TPM: [assegnazioni]
- ARCHITECT: [design]
- DEV: [task in progress]
- TESTER: [test to write]
- REVIEWER: [PR to review]

### Blocker
- [...]
```
