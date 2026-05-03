---
atom_id: ATOM-S31-A12
sprint: T
iter: 31
phase: 1
priority: P0
assigned_to: planner-opus
depends_on: []
provides:
  - automa/team-state/sprint-contracts/sprint-T-iter-31-contract.md
acceptance_criteria:
  - sprint contract markdown NEW ~250 LOC
  - 6-agent file ownership matrix table (planner + architect + maker-1 + maker-2 + tester-1 + scribe)
  - filesystem barrier protocol Pattern S r3 (Phase 1 parallel + Phase 2 sequential scribe + Phase 3 orchestrator)
  - 12 ATOM-S31-A1..A12 cross-reference map (atom → assignee → file ownership)
  - completion msg protocol `automa/team-state/messages/{agent}-iter31-phase{N}-completed.md` mandatory
  - CoV mandate 3-step ognuno atom (vitest baseline + build PASS + dry-run output)
  - Phase 1 budget cumulative ≤6h (5.25h estimated A1-A11)
  - Phase 7 finale audit aggregation Skills A1-A5 + Mechanism M-AI-02 cap enforcer trigger
  - anti-pattern checklist iter 31 explicit (NO compiacenza, NO bypass --no-verify, NO destructive ops, NO score >7 senza Opus G45)
  - cross-link master plan `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
  - cross-link Phase 0 baseline `docs/audits/PHASE-0-baseline-2026-05-02.md`
  - cross-link Phase 1 G45 Opus `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md`
estimate_hours: 0.5
ownership: planner-opus writes ONLY automa/team-state/sprint-contracts/sprint-T-iter-31-contract.md + automa/team-state/messages/planner-opus-iter31-*.md
phase1_budget_cumulative_hours: 5.75
---

## Task

Sprint T iter 31 contract orchestration document. 6-agent file ownership matrix + filesystem barrier protocol Pattern S r3 (validated 9× consecutive iter 5+6+8+11+12+19+36+37+38) + 12 ATOM cross-reference map.

## Scope

- Define file ownership matrix table 6-agent disjoint (Maker-1 / Maker-2 / Tester-1 / Architect / Planner / Scribe)
- Filesystem barrier protocol Pattern S r3
- 12 ATOM cross-reference (A1-A12)
- Completion msg protocol PRE Phase 2 spawn
- CoV mandate 3-step ognuno
- Phase budget ≤6h Phase 1
- Anti-pattern checklist iter 31 explicit

## Deliverables

- `automa/team-state/sprint-contracts/sprint-T-iter-31-contract.md` (~250 LOC)
- `automa/team-state/messages/planner-opus-iter31-A12-completed.md` (completion msg)

## Hard rules

- NO bypass --no-verify
- NO destructive ops
- NO push main
- Caveman ON
- 3x CoV before claim done

## Iter 31 link

Master plan §7 multi-agent optimize Pattern S r3. Sprint contract iter 31 orchestration document Pattern S validated 9× consecutive iter 5 P1+P2 + iter 6 P1 + iter 8 r2 + iter 11 + iter 12 r2 + iter 19 + iter 36 + iter 37 + iter 38 (degraded). Phase 7 finale audit aggregation chain.

## File ownership disjoint

Planner owns automa/team-state/sprint-contracts/. NO write conflict con altri 5 agenti.
