# Day 33 Sprint Contract — Sprint 5 Day 05 bridge

**Date**: 2026-04-22 (cumulative Day 33, Sprint 5 Day 05)
**Branch**: `feature/sett-4-intelligence-foundations`
**Andrea gates**: 3 STILL OPEN (Sprint 5 theme + ADR-008 Ajv dep + worker-probe URL change)
**Strategy**: Theme-agnostic tech-debt bridge — peer audit + ADR-005 POC observational

---

## Goal

Two-deliverable day: (1) team-reviewer peer audit of Day 30-32 bridge work + (2) ADR-005 POC shadow observation kickoff (run 1/5). Zero prod-adjacent config change. Zero new npm deps.

## Deliverables (2)

1. **`docs/audit/peer-review-day-30-32.md`** — Independent peer review (team-reviewer dispatch) of Day 30, 31, 32 commits. Dimensions: scope adherence, anti-regression, honesty, documentation quality, Andrea-gate respect. Verdict: APPROVE / REQUEST_CHANGES / REJECT per day. Target: independent voice, no self-review bias.

2. **`docs/operations/adr-005-poc-run-1.md`** — First of 5 shadow observation runs for ADR-005 acceptance POC (per ADR-005 §7 POC gate). Runs `scripts/watchdog-run.sh` twice: once with suppression enabled (baseline), once with `--no-suppress` control. Captures: issues-created count, noise-ratio delta, ops-guide criterion coverage. Data only, no change to suppression logic.

## Scope firewall

- No code change to `scripts/watchdog-run.sh`, `scripts/validate-tasks-board.sh`, `scripts/worker-probe.sh`, `scripts/benchmark.cjs` (all prod-adjacent or recently shipped — change freeze).
- No ADR status transitions (ADR-005 stays ACCEPTED, ADR-008 stays PROPOSED).
- No tasks-board.json content edits (77 drift preserved intact for Phase 2 plan).
- No package.json edits.
- No push to main.
- Documentation + observational data only.

## Acceptance criteria

- [ ] Peer review doc covers all 7 Day 30-32 commits (ea73423, d52ee87, ed23d9b, c672bca, 4a05303, cdf5b1c, 14ca313, 8e0650d).
- [ ] Peer review assigns per-day verdict with citation evidence.
- [ ] ADR-005 POC run 1 doc captures both control + treatment watchdog runs.
- [ ] ADR-005 POC run 1 tallies noise-ratio baseline (runs 2-5 will extend).
- [ ] CoV 3x vitest: baseline 12371 unchanged (no code = no regression).

## Budget

1.5 SP (peer review 1.0 + POC observational 0.5). Theme-agnostic.

## Rationale

Day 32 was minimal diagnostic (9.35/10, 5 gaps). Day 33 widens to peer audit (independent quality signal) + ADR-005 POC gate progress (unblocks eventual closure). Both deliverables create artifacts Andrea can review when gate opens. Still theme-agnostic: works identically under Sprint 5 Option A or B.

## Stop conditions check (Day 33 start)

- sett gate? No (next = Day 35).
- Quota 429? No.
- Context compact? 1× so far (budget healthy).
- Blocker hard 5-retry? No.

**Proceed**.
