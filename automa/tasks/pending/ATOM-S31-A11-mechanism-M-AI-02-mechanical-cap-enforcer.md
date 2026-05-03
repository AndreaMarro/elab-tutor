---
atom_id: ATOM-S31-A11
sprint: T
iter: 31
phase: 1
priority: P0
assigned_to: architect-opus
depends_on: []
provides:
  - scripts/mechanisms/M-AI-02-mechanical-cap-enforcer.mjs
  - scripts/mechanisms/M-AI-02-README.md
acceptance_criteria:
  - node mjs script NEW ~150 LOC
  - mechanical cap enforcement per PDR §4 cap rules iter 37+ established (R5 latency cap 8.5 trigger, A10 Onnipotenza cap 8.5 ceiling)
  - input: claim score + raw metrics from skills A1-A5 + bench output
  - output: capped score ONESTO with explicit cap rationale per cap rule violated
  - 6 cap rules implemented:
    - CAP-1 R5 latency p95 >2500ms → cap 8.0
    - CAP-2 R7 canonical <80% → cap 8.5
    - CAP-3 Onnipotenza Deno port not LIVE → cap 8.5
    - CAP-4 Lighthouse perf <90 → −0.10 onesti penalty
    - CAP-5 Onniscenza V2 reverted (env=v1) → Box 11 contribution=0 (not 0.7+)
    - CAP-6 INTENT canonical fire-rate 0% (canary OFF default safe) → Box 14 ceiling 0.85
  - cross-ref skill output (A1-A5) per measured metrics input
  - emit capped score report `docs/audits/iter-31-mechanical-cap-{timestamp}.md`
  - exit code 0 always (informational, NOT block)
  - README ~50 LOC: cap rules + when invoked + integration Phase 7 finale audit
  - vitest 13474 baseline preserve (no test changes Phase 1)
  - commit atomic locale `feat(mechanisms/iter-31): M-AI-02 mechanical cap enforcer NEW` (push Phase 7)
estimate_hours: 0.5
ownership: architect writes ONLY scripts/mechanisms/M-AI-02-* + automa/team-state/messages/architect-*.md
phase1_budget_cumulative_hours: 5.25
---

## Task

Mechanism M-AI-02 Mechanical cap enforcer. PDR §4 cap rules iter 37+ established mechanical enforcement. G45 anti-inflation mandate enforced via cap rules NOT subjective override.

## Scope

- Implement 6 cap rules CAP-1 through CAP-6 per Phase 1 G45 Opus indipendente baseline `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md` 3 inflation flags + iter 37+ established cap precedents
- Input: raw score claim + metrics from Skills A1-A5 + latest bench output
- Output: capped ONESTO score + per-cap rationale
- Cross-ref skill output (cap dependency on A1-A5 measurement)
- Emit capped score report markdown per Phase 7 audit aggregation
- Informational exit code (NOT block, advisory mechanism)

## Deliverables

- `scripts/mechanisms/M-AI-02-mechanical-cap-enforcer.mjs` (~150 LOC node ESM)
- `scripts/mechanisms/M-AI-02-README.md` (~50 LOC)
- `automa/team-state/messages/architect-iter31-A11-completed.md` (completion msg PRE Phase 2)

## Hard rules

- Architect role: design + implement mechanical rules (NOT subjective override)
- NO destructive ops
- NO modify CLAUDE.md (read-only)
- Caveman ON
- 3x CoV before claim done

## Iter 31 link

Master plan §1 §2 Phase 1 mechanism + Phase 7 finale audit aggregation. Cap rules baseline iter 37 (R5 latency cap 8.0) + iter 38 (A10 cap 8.5) + iter 39+ (Onniscenza V2 reverted Box 11 contribution=0). Sprint T close iter 41-43 mechanical enforcement.

## File ownership disjoint

Architect owns scripts/mechanisms/M-AI-02. NO write conflict con Maker-1 (M-AR-01 + M-AR-05 + M-AI-01) né Maker-2 (M-AI-04) né Tester-1 (M-AI-03).
