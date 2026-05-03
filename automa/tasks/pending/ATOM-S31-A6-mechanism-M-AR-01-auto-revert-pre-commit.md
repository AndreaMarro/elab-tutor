---
atom_id: ATOM-S31-A6
sprint: T
iter: 31
phase: 1
priority: P0
assigned_to: maker-1-caveman
depends_on: []
provides:
  - scripts/mechanisms/M-AR-01-auto-revert-pre-commit.sh
  - scripts/mechanisms/M-AR-01-README.md
acceptance_criteria:
  - shell script bash NEW ~80 LOC
  - integration con pre-commit hook existing (NO bypass `--no-verify`)
  - logica auto-revert se vitest baseline scende vs `automa/baseline-tests.txt`
  - logica auto-revert se build PASS fail
  - log emit `automa/state/auto-revert-log.jsonl` (timestamp + commit SHA + reason + delta)
  - dry-run mode flag `--dry-run` per test pre integration
  - exit code 1 se revert triggered (block commit)
  - exit code 0 se baseline preserve
  - README ~30 LOC: usage + integration steps + rollback procedure
  - NO destructive ops (NO `git reset --hard`, NO `git clean -f`, NO `rm -rf` outside tmp/)
  - vitest 13474 baseline preserve (no test changes Phase 1)
  - commit atomic locale `feat(mechanisms/iter-31): M-AR-01 auto-revert pre-commit ENHANCED` (push Phase 7)
estimate_hours: 0.5
ownership: maker-1 caveman writes ONLY scripts/mechanisms/M-AR-01-* + automa/team-state/messages/maker-1-*.md
phase1_budget_cumulative_hours: 2.75
---

## Task

Mechanism M-AR-01 Auto-revert pre-commit ENHANCED. Anti-regressione FERREA mandate CLAUDE.md "BASELINE: `npx vitest run` PRIMA e DOPO ogni modifica — se test scendono → REVERT IMMEDIATO".

## Scope

- Read existing pre-commit hook setup (`.git/hooks/pre-commit` if exists OR `.husky/pre-commit`)
- Read existing baseline file `automa/baseline-tests.txt` format
- Implement auto-revert logic:
  - Run `npx vitest run --reporter=json` capture PASS count
  - Compare vs baseline file
  - If delta < 0 (regression) AND NOT explicit `feat(refactor):` commit → log + exit 1 (block commit)
  - If build fails → log + exit 1 (block commit)
- Implement `--dry-run` flag per integration test sicuro
- Emit JSONL log per audit trail
- README integration steps Andrea ratify

## Deliverables

- `scripts/mechanisms/M-AR-01-auto-revert-pre-commit.sh` (~80 LOC bash)
- `scripts/mechanisms/M-AR-01-README.md` (~30 LOC)
- `automa/team-state/messages/maker-1-iter31-A6-completed.md` (completion msg PRE Phase 2)

## Hard rules

- NO destructive ops (NO `git reset --hard`, NO `git clean -f`, NO `rm -rf` outside tmp/)
- NO bypass `--no-verify`
- Caveman ON
- 3x CoV before claim done

## Iter 31 link

Master plan §1 §2 Phase 1 mechanism. Anti-regressione mandate CLAUDE.md. Iter 41-43 Sprint T close ZERO test scendere.

## File ownership disjoint

Maker-1 owns scripts/mechanisms/M-AR-* + M-AI-01 + M-AR-05. NO write conflict con Maker-2 né Tester-1 né Architect.
