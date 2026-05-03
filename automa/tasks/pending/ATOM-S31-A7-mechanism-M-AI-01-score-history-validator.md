---
atom_id: ATOM-S31-A7
sprint: T
iter: 31
phase: 1
priority: P0
assigned_to: maker-1-caveman
depends_on: []
provides:
  - scripts/mechanisms/M-AI-01-score-history-validator.mjs
  - scripts/mechanisms/M-AI-01-README.md
  - automa/state/score-history-registry.jsonl (NEW init empty if not exists)
acceptance_criteria:
  - node mjs script NEW ~100 LOC
  - parses CLAUDE.md sprint history footer + extract score per iter (regex `iter (\d+).*?score.*?(\d+\.\d+)/10`)
  - validates monotonic anti-inflation: score iter N+1 > iter N requires explicit Opus G45 review citation
  - flag suspicious jumps >+0.5 single iter without justification doc
  - cross-ref `docs/audits/G45-OPUS-INDIPENDENTE-*.md` per validation
  - write registry `automa/state/score-history-registry.jsonl` (one line per iter: timestamp + iter + score + cap + justification_doc)
  - exit code 1 se inflation flag detected (block claim)
  - exit code 0 se all scores justified
  - README ~30 LOC usage + cron integration suggestion daily
  - vitest 13474 baseline preserve (no test changes Phase 1)
  - commit atomic locale `feat(mechanisms/iter-31): M-AI-01 score history registry validator NEW` (push Phase 7)
estimate_hours: 0.5
ownership: maker-1 caveman writes ONLY scripts/mechanisms/M-AI-01-* + automa/state/score-history-registry.jsonl + automa/team-state/messages/maker-1-*.md
phase1_budget_cumulative_hours: 3.25
---

## Task

Mechanism M-AI-01 Score history registry validator. G45 anti-inflation mandate enforced mechanical: score progression cross-iter MUST justified Opus G45 review OR explicit cap doc.

## Scope

- Parse CLAUDE.md sprint history footer iter 1-N existing
- Extract score per iter via regex
- Validate monotonic + flag suspicious jumps
- Cross-ref existing G45 docs in docs/audits/
- Write JSONL registry per audit trail
- Integration suggestion cron daily

## Deliverables

- `scripts/mechanisms/M-AI-01-score-history-validator.mjs` (~100 LOC node ESM)
- `scripts/mechanisms/M-AI-01-README.md` (~30 LOC)
- `automa/state/score-history-registry.jsonl` (init empty if not exists)
- `automa/team-state/messages/maker-1-iter31-A7-completed.md` (completion msg PRE Phase 2)

## Hard rules

- NO destructive ops
- NO modify CLAUDE.md (read-only)
- Caveman ON
- 3x CoV before claim done

## Iter 31 link

Master plan §1 §2 Phase 1 mechanism. G45 anti-inflation mandate enforced mechanical Phase 7 close score Opus 8.0/10 max iter 31 baseline iter 30 G45 Opus indipendente.

## File ownership disjoint

Maker-1 owns scripts/mechanisms/M-AR-01 + M-AR-05 + M-AI-01. NO write conflict con Maker-2 (M-AI-04) né Tester-1 (M-AI-03) né Architect (M-AI-02).
