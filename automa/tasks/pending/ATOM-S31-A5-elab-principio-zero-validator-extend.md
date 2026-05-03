---
atom_id: ATOM-S31-A5
sprint: T
iter: 31
phase: 1
priority: P0
assigned_to: maker-1-caveman-second
depends_on: [ATOM-S31-A1]
provides:
  - ~/.claude/skills/elab-principio-zero-validator/SKILL.md (EXTENDED +50 LOC)
acceptance_criteria:
  - file existing extended +50 LOC (NOT rewrite, surgical add)
  - 3 NEW measurement gates G+1 G+2 G+3 added per master plan §1 Phase 1 Skill 5
  - G+1 Vol/pag verbatim ≥95% bench R5 50-prompt regex `Vol\.\s*\d+\s*cap\.?\s*\d+\s*pag\.?\s*\d+` target ≥95%
  - G+2 plurale "Ragazzi" ≥95% bench R5 50-prompt regex `\bRagazzi[,\s]` target ≥95%
  - G+3 kit ELAB mention ≥80% bench R5 50-prompt regex `kit\s*ELAB|breadboard|Omaric|kit\s*fisico` target ≥80%
  - body bash regex commands measure embedded ognuno gate
  - existing gates preserved NO regression
  - CoV dry-run produce table includes 3 NEW rows
  - vitest 13474 baseline preserve (no test changes Phase 1)
  - commit atomic locale `feat(skills/iter-31): elab-principio-zero-validator extend +3 gates` (push Phase 7)
estimate_hours: 0.25
ownership: maker-1 caveman second pass writes ONLY ~/.claude/skills/elab-principio-zero-validator/ + automa/team-state/messages/maker-1-*.md
phase1_budget_cumulative_hours: 2.25
---

## Task

Skill 5 EXTEND existing elab-principio-zero-validator. Add 3 NEW gates per Andrea PZ V3 mandate iter 33+ (Vol/pag verbatim quality lift) + Sprint T close target Phase 4 ≥95% achievement.

## Scope

- Read existing ~/.claude/skills/elab-principio-zero-validator/SKILL.md FIRST (full content)
- Surgical Edit add 3 NEW gates section preserving existing structure
- Embed 3 bash regex commands per master plan §1 Phase 1 Skill 5 Step 1.5.2:
  - G+1: `grep -cE "Vol\.\s*[0-9]+\s*cap\.?\s*[0-9]+\s*pag\.?\s*[0-9]+" output.txt`
  - G+2: `grep -cE "\bRagazzi[,\s]" output.txt`
  - G+3: `grep -cE "kit\s*ELAB|breadboard|Omaric|kit\s*fisico" output.txt`
- Update CoV dry-run output expected table includes 3 NEW rows alongside existing
- NO regression existing gates

## Deliverables

- `~/.claude/skills/elab-principio-zero-validator/SKILL.md` EXTENDED +50 LOC
- `automa/team-state/messages/maker-1-iter31-A5-completed.md` (completion msg PRE Phase 2)

## Hard rules

- NO rewrite, surgical add only
- NO writes outside ~/.claude/skills/elab-principio-zero-validator/ + messages
- NO code changes src/ tests/ supabase/
- Caveman ON
- 3x CoV before claim done

## Iter 31 link

Master plan §1 §2 Phase 1 + Phase 4 Andrea actions sequential queue ~90min Vol/pag verbatim 95% target. Skill used Phase 7 finale audit aggregate score. Sprint T close gate iter 41-43.

## File ownership disjoint

Maker-1 owns: ~/.claude/skills/elab-morfismo-validator/ + ~/.claude/skills/elab-principio-zero-validator/ (extend) + scripts/mechanisms/M-AR-01 + M-AI-01 + M-AR-05. NO write conflict con Maker-2 né Tester-1 né Architect.
