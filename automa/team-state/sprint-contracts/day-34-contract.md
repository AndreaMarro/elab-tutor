# Day 34 Sprint Contract — Sprint 5 Day 06 bridge

**Date**: 2026-04-22 (cumulative Day 34, Sprint 5 Day 06)
**Branch**: `feature/sett-4-intelligence-foundations`
**Andrea gates**: 3 STILL OPEN
**Strategy**: Peer-flag-1 remediation + context-budget-aware minimal scope

---

## Goal

Address peer review Flag 1 (TASK-30-03b dropped) via formal recovery note. No code-write this day. Doc-only, minimal cycle.

## Deliverables (1)

1. **`docs/audit/task-30-03b-recovery-note.md`** — Formal acknowledgment + disposition. Three options to present:
   - Option A: schedule 15 unit tests in Day 35+ contract (post-sett-gate, would exceed bridge scope)
   - Option B: write minimal subset (5 tests) as Day 34 extension
   - Option C: formally remove TASK-30-03b from Day 30 scope with rationale (watchdog-suppression already covered by `scripts/test-watchdog-suppression.sh` integration-level 16/16 assertions)
   - Recommendation + rationale.

## Scope firewall

- No code change.
- No test file creation.
- No state mutation beyond recovery note + handoff + state-persist.
- No ADR status change.
- No push to main, no new deps.

## Acceptance criteria

- [ ] Recovery note cites peer-review doc + Day 30 contract + actual test coverage delta (integration vs unit).
- [ ] 3 options enumerated with pros/cons.
- [ ] Recommendation stated with honest rationale.
- [ ] Andrea-gate-respecting disposition (no decision taken, only options presented).

## Budget

0.3 SP. Doc-only, minimal.

## Rationale

Context-budget conservation (5th consecutive bridge day). Peer flag 1 is oldest open flag. Formal disposition closes it without requiring 15-test implementation in bridge window.

## Stop conditions check (Day 34 start)

- sett gate? No (Day 35 next).
- 429? No.
- Context compact? 1-2× estimated. Tightening.
- Blocker? No.

**Proceed minimal**.
