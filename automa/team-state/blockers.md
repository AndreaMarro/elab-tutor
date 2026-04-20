# Blockers — Open + Closed

Append-only log. Mai cancellare (storico).

---

## OPEN (aperti) — reconcile 2026-04-23 Day 04

## BLOCKER-001 — 2026-04-20 — JWT 401 Edge Function CLI

**Status**: OPEN (Day 04 ADR planned)
**Severity**: P0
**Owner**: inline TPM
**Impacted tasks**: T1-005 Dashboard, PZ v3 live curl verification
**Description**: `curl https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat -H "apikey: $KEY"` ritorna 401 JWT invalid. Prod funziona (frontend OK), solo CLI bloccato.
**Investigation**: header `apikey` solo non basta. Necessario anche `Authorization: Bearer <ANON_KEY>`.
**Resolution**: (Day 04 in corso) scrivere ADR + script `scripts/cli-autonomous/verify-edge-function.sh` con entrambi header.
**Learned**: Supabase Edge Function richiede dual-header anche per ANON calls se JWT verify enforced.

## BLOCKER-002 — 2026-04-21 — Velocity tracking day 3 entry missing

**Status**: OPEN (Day 04 fix inline)
**Severity**: P1
**Owner**: inline TPM
**Impacted tasks**: audit Harness 2.0
**Description**: `automa/state/velocity-tracking.json` ha entries Day 01+Day 02 ma Day 03 absent
**Investigation**: TPM Day 03 scrisse standup ma non velocity
**Resolution**: append entry Day 03 inline this turn
**Learned**: TPM checklist includere velocity entry obbligatorio end-of-day

## BLOCKER-003 — 2026-04-20 — 152 dirty files carry-over

**Status**: OPEN (deferred sett-2)
**Severity**: P2
**Owner**: Andrea decision
**Impacted tasks**: nessuno (non blocca feature work)
**Description**: 152 file modificati unstaged da sessioni precedenti (mix CSS module + engine + hooks)
**Investigation**: mix include engine file NON autorizzato modify + CSS legit + data file
**Resolution**: (deferred) triage sett-2 — commit selettivo OR git stash + revert
**Learned**: baseline pulito ogni fine sprint mandatory

## BLOCKER-004 — 2026-04-21 — Product backlog gerarchico non formalizzato

**Status**: OPEN (deferred sett-2)
**Severity**: P2
**Owner**: TPM
**Impacted tasks**: scrum process compliance
**Description**: DoR/DoD enforcement richiede backlog Epic→Story→Task ma file assente
**Investigation**: AGILE-METHODOLOGY-ELAB.md lo prescrive ma mai scritto
**Resolution**: (sett-2) scrivere `automa/team-state/product-backlog.md` con 8 Epic (56-day)
**Learned**: process doc → implementation deve seguire entro 1 sprint

## BLOCKER-005 — 2026-04-21 — no-regression-guard.sh --dry-run flag missing

**Status**: OPEN (deferred sett-2)
**Severity**: P3
**Owner**: DEV
**Impacted tasks**: CI dry-run validation
**Description**: Script no --dry-run → CI test non può validare senza run reale
**Investigation**: trivial 10-min fix
**Resolution**: (sett-2) add parsing `$1 == "--dry-run"` → exit 0
**Learned**: dry-run mandatory per tutti script CI

## BLOCKER-006 — 2026-04-20 — Daily standup Day 01 formal retroactive

**Status**: CLOSED 2026-04-23 (Day 04 standup formal retroactive scritto)
**Severity**: P3
**Owner**: TPM
**Description**: Day 01 standup iniziale in file ma formato non-standard
**Resolution**: Day 04 standup update ha formalizzato retroactive Day 02+Day 03 entries
**Learned**: formato standard template enforced da sett-1

## BLOCKER-007 — 2026-04-22 — CI run workflow render-warmup.yml first run verify

**Status**: OPEN (post-merge check)
**Severity**: P2
**Owner**: DEV
**Impacted tasks**: T1-003 render warmup cron verify live
**Description**: Workflow `.github/workflows/render-warmup.yml` committed Day 02 `4a48138` ma first scheduled run non verified (cron 10min)
**Investigation**: branch feature non merged main → workflow su feature inactive
**Resolution**: post-merge sett-1 gate verificare gh run list workflow=render-warmup
**Learned**: GitHub Actions scheduled workflows solo main branch → verify post-merge obbligatorio

## BLOCKER-008 — 2026-04-22 — grep canonical invariant on main

**Status**: OPEN (post-merge check)
**Severity**: P2
**Owner**: TPM
**Impacted tasks**: zero-regression post-merge sett-1 gate
**Description**: post-merge main verify `grep -r euqpdueopmlllqjmqnyb src/` count invariant vs feature branch
**Investigation**: dual-Supabase resolve Day 02 → canonical euqpdueopmlllqjmqnyb documentato
**Resolution**: end-week-gate script verify grep count
**Learned**: invariant check post-merge obbligatorio per config-critical files

---

## CLOSED (chiusi)

## BLOCKER-000 — 2026-04-21 — Dual Supabase project ref

**Status**: CLOSED 2026-04-21 (Day 02)
**Severity**: P0
**Owner**: DEV
**Resolution**: MCP verify → canonical `euqpdueopmlllqjmqnyb`. Documentato ADR-003.
**Learned**: config ambiguity resolve pre-feature work mandatory.

## BLOCKER-006 — (vedi OPEN sez sopra, ora CLOSED)

---

## Template nuovo blocker

```
## BLOCKER-NNN — YYYY-MM-DD HH:MM — <Titolo>

**Status**: OPEN / CLOSED (data chiusura)
**Severity**: P0 / P1 / P2
**Owner**: <ruolo o persona>
**Impacted tasks**: T1-XXX, T1-YYY
**Description**: <sintomo + impatto>
**Investigation**: <indagine fatta>
**Resolution**: <se chiuso>
**Learned**: <lesson per sett future>
```
