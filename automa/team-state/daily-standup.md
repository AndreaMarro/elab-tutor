# Daily Standup — Team ELAB

Prossimo standup: **Venerdi 24/04/2026 ore 9:00** (Day 05 sett-1)

---

## Standup 2026-04-23 MATTINA — Day 04/56 (gio 23/04 — Sprint sett-1 day 4/7)

**Baseline**: test 12164 PASS | build PASS | benchmark 4.07/10 | 1 unpushed e197d37 | branch `feature/t1-003-render-warmup`
**Sprint Contract**: `automa/team-state/sprint-contracts/day-04-contract.md`
**Dispatch cap**: 3 (headless loop economico)

### Ieri Day 03 mer 22/04 (done verificato)
- 3 commit: `8c9a0eb` TPM+velocity + `f5b071a` Vision skeleton + `2a0efb3` revert duplicate
- Test 12164 stable (skeleton reverted honest, zero inflation)
- E2E 12 spec confermati. CoV 3/3 PASS
- Auditor 7.0/10 post-fix (6.8 initial NOT READY → fix same-session)
- Reviewer APPROVE pre-revert f5b071a
- Discovery: dual playwright config (tests/e2e vs e2e) + duplicate spec → revert
- Handoff `docs/handoff/2026-04-22-end-day.md`

### Oggi Day 04 (3 task P0, ~2.5h stima, inline lavoro)
- **INLINE TPM**: sprint contract day-04 + blockers reconcile + velocity day 3 entry
- **INLINE/DEV**: ATOM-002 Dashboard a11y WCAG 2.1 AA P0+P1 (90min)
- **INLINE**: audit 20 metrics + CoV 5x + stress test post-deploy
- **INLINE**: JWT 401 ADR + MCP Supabase verify (20min)
- **18:00**: Tea onboarding Zoom (info only, not code)

### Blocker aperti carry-over
- P0 JWT 401 Edge CLI curl → ADR inline + MCP verify
- P1 velocity day 3 missing → fix inline
- P2 152 dirty files → decision: carry sett 2 (no blocco sprint)
- P2 Product backlog gerarchico non formal → carry sett 2
- P3 no-regression-guard.sh --dry-run → sett 2

### Note
- Branch feature/t1-003-render-warmup ha 1 unpushed (e197d37 ancora su origin — verifica CI)
- Sett gate Day 7 (dom 26/04) → 3 day ancora (Day 05 ven + Day 06 sab + Day 07 dom)
- Benchmark target sett 1 = 6.0/10 → serve +1.93 in 3 day (+0.64/day realistic ma alto)

---

## Standup 2026-04-22 SERA — Chiusura Day 03 (retroactive formal)

**Test count**: 12164 stable (0 net)
**Build**: PASS
**Benchmark**: 4.07/10 (+0.01 vs day 02)
**Commits sessione**: 3 (feature branch, 1 unpushed alla fine)
**Reviewer**: APPROVE (f5b071a pre-revert)
**Auditor**: 7.0/10 post-fix (6.8 iniziale corretto same-session)

### Fatto oggi (Day 03 mer 22/04)
- TPM `8c9a0eb`: standup entry + velocity tracking day 2 populated + baseline 12164 committed
- TESTER `f5b071a`: E2E skeleton Vision T1-004 3 case (fail-gracefully)
- DISCOVERY: 22-vision-flow.spec.js duplicato con scope T1-004 → decisione revert
- REVERT `2a0efb3`: rimozione duplicate Vision E2E skeleton (zero inflation)
- AUDITOR brutale: iniziale 6.8 NOT READY (dual config + duplicate) → fix same-session → 7.0 READY
- Handoff scritto `docs/handoff/2026-04-22-end-day.md`

### Domani Day 04 gio 23/04
- ATOM-002 Dashboard a11y WCAG (src work real)
- Blockers reconcile (velocity, backlog)
- JWT 401 ADR
- Audit + stress test aumentato

### Blocker aperti
- 1 unpushed (e197d37) → push-safe in STEP 5
- JWT 401 Edge curl (carry-over)
- Benchmark target sett 1 at-risk: 4.07 vs target 6.0 (+1.93 in 3 day)

---

## Standup 2026-04-22 MATTINA — Day 02 START

**Baseline**: test 12149 | build PASS 77s | benchmark 4.06/10 | 0 unpushed (verified) | SHA 109cb33
**Sprint Contract**: ratificato retroattivo `docs/sprints/sprint-1-contract.md`
**Dispatch cap oggi**: 5 (rigoroso, Day 01 era 7 overflow)

### Ieri Day 01 (done verificato)
- T1-001, T1-002, T1-009 merged (3 bug T1 P0 chiusi)
- FOUNDATIONS-CLI + FOUNDATIONS-TOGETHER merged (12 commits)
- REVIEWER APPROVE, AUDITOR 6.5/10 zero inflation
- Test +33, benchmark +1.29, PZ v3 preserved

### Oggi Day 02 (5 task P0-P1, 5h estimate + 3h buffer)
- DEV P0: T1-003 Render cold start warmup cron (2h)
- DEV P0: DAY02-SUPABASE-REF canonicalize vxvqalmxqtezvgiboxyv (10 min carry-over)
- DEV P1: DAY02-JWT-401 resolve (30 min, dep DAY02-SUPABASE-REF)
- DEV P1: DAY02-BENCH-WRITE persist + E2E assertions tighten (1h)
- DEV P1: DAY02-REVIEWER-MINOR batch 5 issues (1h)
- TPM P1: DAY02-VELOCITY seed velocity-tracking.json (done con questo standup)

### Blocker aperti
- P0: dual-supabase-ref (Andrea conferma vxvqalmxqtezvgiboxyv canonical)
- P1: JWT 401 edge functions
- P2: 152 dirty files carry-over (triage DAY02-DIRTY-TRIAGE)
- P3: no-regression-guard.sh --dry-run reale

### Note
- Day 03 mer 23/04 18:00 Tea onboarding Zoom 1h
- Next STEP 2 dependency: DAY02-SUPABASE-REF chiuso sblocca T1-005 dashboard

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
