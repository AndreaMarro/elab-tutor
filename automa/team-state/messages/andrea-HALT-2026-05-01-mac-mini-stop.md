# Andrea HALT signal — Mac Mini autonomous iter 39 STOP

**Date**: 2026-05-01
**Source**: Andrea explicit instruction "blocca macmini" via MacBook session
**Target**: Mac Mini autonomous loop reading plan `docs/superpowers/plans/2026-05-01-mac-mini-autonomous-iter-39-sprint-T-close.md`

## Action required

Mac Mini Claude desktop Opus 4.7 1M MUST:

1. **Stop current cycle immediately** at next CoV checkpoint (do NOT mid-edit a file — finish in-flight write/commit then HALT)
2. **Do NOT start new Task** from §6 queue
3. **Do NOT spawn any background process** OR deploy
4. **Do NOT modify ANY file** post-HALT-detection
5. **Write final session close** doc summarizing whatever was completed pre-HALT:
   - `docs/audits/iter-39-mac-mini-autonomous-session-{date}-HALTED.md`
   - List atoms shipped (status, commits)
   - List atoms in-flight (state, partial work)
   - List atoms NOT started (queue position)
6. **Commit + push origin** the close doc only (NO other pending changes)
7. **Wait** for Andrea to provide next instructions via direct conversation OR new plan file

## Reason for HALT

Andrea wants control back. NOT a quality issue with plan. NOT a regression. Plan remains valid for future re-activation.

## Resume protocol

When Andrea wants Mac Mini to resume:
- Andrea will delete this file OR write `automa/team-state/messages/andrea-RESUME-{timestamp}.md`
- Mac Mini reads new signal + restarts from §6 queue at next pending Task
- Mac Mini reads CLOSE audit + audit-cycle docs to understand state

## Anti-conflict mandate

If Mac Mini is in middle of:
- Vercel deploy (BG) → let it complete, then HALT
- Edge Function deploy → let it complete, then HALT
- Migration apply → let it complete (idempotent), then HALT
- Bench script BG → let it finish OR kill via `kill -TERM <pid>`, then HALT
- Git commit (pre-commit hook running) → let hook finish, then HALT (NEVER --no-verify)

NO destructive operations during HALT transition. NO `git reset` NO `git revert` NO `supabase db reset`.

## Logged

This file = canonical HALT signal per plan §11 resume protocol.
