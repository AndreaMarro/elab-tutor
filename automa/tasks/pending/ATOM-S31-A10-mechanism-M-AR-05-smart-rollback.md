---
atom_id: ATOM-S31-A10
sprint: T
iter: 31
phase: 1
priority: P0
assigned_to: maker-1-caveman
depends_on: [ATOM-S31-A6]
provides:
  - scripts/mechanisms/M-AR-05-smart-rollback.sh
  - scripts/mechanisms/M-AR-05-README.md
acceptance_criteria:
  - shell script bash NEW ~100 LOC
  - smart rollback machinery integrates con M-AR-01 auto-revert (chain dependency)
  - features:
    - F1 detect rollback trigger (vitest regression OR build fail OR claim-reality gap M-AI-03)
    - F2 identify last-known-good commit (search backwards `git log --first-parent` for tag `baseline-iter*`)
    - F3 dry-run preview rollback diff (`git diff HEAD..baseline-tag`)
    - F4 require explicit confirmation flag `--confirm` (NO auto rollback prod)
    - F5 emit rollback log `automa/state/rollback-log.jsonl` (timestamp + from_sha + to_sha + reason + cov_delta)
    - F6 post-rollback CoV trigger automatic vitest + build verify
  - NO destructive ops without `--confirm` flag
  - NO `git reset --hard` (use `git revert` reversible)
  - dry-run default ON
  - README ~40 LOC: when use + integration M-AR-01 + safety procedures
  - vitest 13474 baseline preserve (no test changes Phase 1)
  - commit atomic locale `feat(mechanisms/iter-31): M-AR-05 smart rollback machinery NEW` (push Phase 7)
estimate_hours: 0.5
ownership: maker-1 caveman writes ONLY scripts/mechanisms/M-AR-05-* + automa/team-state/messages/maker-1-*.md
phase1_budget_cumulative_hours: 4.75
---

## Task

Mechanism M-AR-05 Smart rollback machinery. Chain dependency con M-AR-01 auto-revert. Reversible rollback via `git revert` (NO `git reset --hard`). Anti-regressione FERREA + safety mandate "NO destructive ops senza explicit user confirm".

## Scope

- Implement 6 features F1-F6
- Detect rollback triggers (vitest regression / build fail / claim-reality gap)
- Identify last-known-good baseline tag
- Dry-run preview default ON
- Explicit `--confirm` flag required
- Reversible `git revert` only
- Emit rollback log JSONL
- Post-rollback CoV automatic verify

## Deliverables

- `scripts/mechanisms/M-AR-05-smart-rollback.sh` (~100 LOC bash)
- `scripts/mechanisms/M-AR-05-README.md` (~40 LOC)
- `automa/team-state/messages/maker-1-iter31-A10-completed.md` (completion msg PRE Phase 2)

## Hard rules

- NO `git reset --hard` (only `git revert`)
- NO `git push --force`
- NO destructive ops without `--confirm`
- NO bypass pre-commit hooks
- Caveman ON
- 3x CoV before claim done

## Iter 31 link

Master plan §1 §2 Phase 1 mechanism. Chain con M-AR-01 (A6). Anti-regressione mandate FERREA per Sprint T close iter 41-43 ZERO regression.

## File ownership disjoint

Maker-1 owns scripts/mechanisms/M-AR-01 + M-AR-05 + M-AI-01. NO write conflict con Maker-2 (M-AI-04) né Tester-1 (M-AI-03) né Architect (M-AI-02).
