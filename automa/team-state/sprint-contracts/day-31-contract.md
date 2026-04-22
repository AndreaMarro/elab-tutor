# Day 31 Sprint Contract — Sprint 5 Day 03 bridge

**Date**: 2026-04-22 (cumulative Day 31, Sprint 5 Day 03)
**Branch**: `feature/sett-4-intelligence-foundations`
**Andrea gate**: STILL OPEN (Sprint 5 theme + ADR-008 Ajv dep)
**Strategy**: Theme-agnostic tech-debt bridge — safe under any Option A/B pick

---

## Goal

Advance ADR-005 + ADR-008 acceptance criteria without blocking on Andrea approval.

## Deliverables (3, atomic commits)

1. **`scripts/validate-tasks-board.sh`** — jq+bash fallback validator for ADR-008 schema (bypasses Ajv dep lock). Enforces enum ranges + required fields on `automa/team-state/tasks-board.json`. Exit 0 on pass, non-zero on drift.
2. **Drift enumeration run** — execute validator against current file, commit gap report to `docs/audit/tasks-board-drift-day-31.md`.
3. **`docs/operations/watchdog-guide.md`** — ADR-005 §5 unchecked criterion. Documents severity taxonomy + state file semantics + debugging recipes.

## Scope firewall

- No Ajv dep addition (gated on Andrea).
- No `tasks-board.json` content edits (observation only, migration script is Day 32 work).
- No ADR-008 status promotion PROPOSED → ACCEPTED until schema proved useful on real drift.
- No Sprint 5 theme-specific features.

## Acceptance criteria

- [ ] `validate-tasks-board.sh` exit 0 on synthetic valid fixture, non-zero on synthetic invalid.
- [ ] Drift report enumerates N ≥ 0 violations honestly (zero inflation).
- [ ] `watchdog-guide.md` cross-linked from README automation hooks section.
- [ ] CoV 3x = 12371 PASS.
- [ ] Build PASS.
- [ ] Zero benchmark regression (floor 5.30).

## Risk

- Validator may find zero drift (schema too loose or file already compliant) — still value: baseline for Phase 2 CI integration.
- Watchdog-guide is Markdown-only, low risk.

## Budget

2 SP within Day 31. Hard stop: if validator impl exceeds 60 min, commit what works + continue.
