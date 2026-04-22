# Sprint 5 Day 01 (cumulative Day 29) Contract — Harness 2.0

**Date**: 2026-04-22 (continued autonomous session post Day 28 ceremony)
**Branch**: `feature/sett-4-intelligence-foundations` (Sprint 4 carry, Sprint 5 branch pending Andrea main merge)
**Contract type**: **Bridge day — theme-independent carry-over**. Sprint 5 theme TBD (Andrea 5-question gate). Scope limited to carry work that doesn't require theme choice.

---

## Rationale — why bridge, not full Sprint 5 Day 01

Per `automa/state/claude-progress.txt` line `sprint_status: SETT4_DAY07_END_WEEK_GATE_13_OF_13_PASS_CEREMONY_COMPLETE_AWAITING_ANDREA_MAIN_MERGE`, Sprint 4 ceremony closed but:

1. **Sprint 4 NOT merged to main** — PR not opened, Andrea decision gate
2. **Sprint 5 theme NOT chosen** — Option A / B / A+B pending 5 Andrea questions
3. **Prod deploy NOT executed** — last prod = dpl_9ocrgUWYkpwm1MmHGQeQ3kSJqVYe Day 22

Autonomous headless should not auto-merge main + deploy prod without Andrea (production-safety memory — never auto-modify prod without confirmation). Autonomous CAN execute carry-over work on feature branch that is theme-independent.

---

## Scope Day 29 (1 task P0, bridge work)

### Task: A-502 — Automate claude-mem observation save on post-commit hook (1 SP)

**Source**: Sprint 4 Retrospective action item A-502 (DEV, due Day 29)
**Owner**: inline DEV (autonomous)
**Theme independence**: ✅ infrastructure, not tied Option A or B

### Acceptance Criteria

1. `.githooks/post-commit` tracked + invokes `scripts/cli-autonomous/claude-mem-save.sh commit` with commit sha + subject + stats (files/insertions/deletions)
2. Installer script `scripts/hooks/install-git-hooks.sh` sets `git config core.hooksPath .githooks` (no npm dep per CLAUDE rule 13)
3. Documented in `docs/workflows/claude-mem-automation.md` (flow, install steps, uninstall steps, rationale)
4. Smoke test: 5 sample commits trigger payload write 0 rejects (fire rate 100%)
5. `automa/state/claude-mem-pending/commit-*.json` payloads contain sha + subject + stats + branch + sprint + day
6. Non-invasive: hook NEVER fails commit (set +e pattern, silent fallback)
7. `automa/team-state/sprint-5-actions-tracker.json` entry A-502 DONE with evidence paths

### Test Strategy

- TDD: test script extension `scripts/cli-autonomous/test-claude-mem-save.sh` add case `commit` with stats fields
- Smoke test hook: 5 × `git commit --allow-empty -m "A-502 smoke N"` + verify payloads, then `git reset --hard HEAD~5` to revert
- Hook non-blocking: force claude-mem-save.sh fail (rename script) + commit → verify commit succeeds

### Rollback Plan

- Uninstall: `git config --unset core.hooksPath`
- Remove tracked files: `git rm -r .githooks scripts/hooks docs/workflows/claude-mem-automation.md` + revert tracker entry

### Success Metrics (Harness 2.0 4-grading)

| Dim | Target Day 29 |
|-----|---------------|
| Design (hook non-invasive, installable) | 7.5 |
| Originality (shared .githooks pattern) | 7.0 |
| Craft (TDD + smoke + docs) | 8.0 |
| Functionality (5/5 smoke pass) | 8.0 |
| **Composite** | **7.63** |

---

## Stop Conditions Day 29

- If hook fire rate < 100% on smoke → investigate + fix max 3 retry → if still fail STOP + blocker
- If Vitest baseline drops < 12371 → **REVERT IMMEDIATE**
- If Andrea posts decision mid-session → pause + re-read + pivot

---

## Explicit Non-Scope Day 29

- ❌ NOT opening Sprint 4 PR (Andrea gate)
- ❌ NOT merging to main (Andrea gate)
- ❌ NOT deploying prod (Andrea gate)
- ❌ NOT starting Sprint 5 theme work (5 questions pending)
- ❌ NOT A-501 Playwright chromium install (due Day 30, separate session scope)
- ❌ NOT Together AI live dispatch (Andrea auth)

---

## Artifacts expected end Day 29

1. `.githooks/post-commit` (tracked)
2. `scripts/hooks/install-git-hooks.sh` (tracked, executable)
3. `scripts/cli-autonomous/claude-mem-save.sh` (edited — add stats to commit event)
4. `scripts/cli-autonomous/test-claude-mem-save.sh` (edited — extended coverage)
5. `docs/workflows/claude-mem-automation.md` (new, ~100 lines)
6. `automa/team-state/sprint-5-actions-tracker.json` (new — A-502/A-501/A-503 tracker)
7. `docs/audit/day-29-audit.md` (20-dim matrix)
8. `docs/handoff/2026-04-22-day-29-bridge-end.md`
9. `automa/state/claude-progress.txt` update
10. 1 atomic commit (feature branch, not main)
