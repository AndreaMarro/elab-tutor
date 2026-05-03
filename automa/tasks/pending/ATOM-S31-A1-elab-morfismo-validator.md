---
atom_id: ATOM-S31-A1
sprint: T
iter: 31
phase: 1
priority: P0
assigned_to: maker-1-caveman
depends_on: []
provides:
  - ~/.claude/skills/elab-morfismo-validator/SKILL.md
acceptance_criteria:
  - file ~250 LOC SKILL.md NEW
  - YAML frontmatter (name, description) per superpowers:skill-creator
  - 10 measurement gates G1-G10 defined per master plan §1 Phase 1 Skill 1
  - G1 palette compliance regex var(--elab-{navy|lime|orange|red}) ≥80% var usage src/components/
  - G2 NanoR4Board SVG identity SHA-256 vs canonical iter S19 baseline
  - G3 font usage Oswald|Open Sans|Fira Code grep src/styles/
  - G4 ToolSpec count grep -cE "name: ['\"]" scripts/openclaw/tools-registry.ts expected 57 (sync ADR-028 §3 corrected iter 37)
  - G5 lesson-paths coverage src/data/lesson-paths/v{1,2,3}-cap*-esp*.json expected 89 (5 missing iter 36 D3)
  - G6 volume references coverage 94/94 enriched
  - G7 27 Lezioni grouping src/data/lesson-groups.js
  - G8 ElabIcons SVG ≥24
  - G9 NO emoji icon (HomePage cards Andrea-explicit OK)
  - G10 data-attribute morphic ≥10 markers
  - body bash commands measure embedded ognuno gate
  - CoV dry-run via Skill tool produces 10-line table
  - vitest 13474 baseline preserve (no test changes Phase 1)
  - commit atomic locale `feat(skills/iter-31): elab-morfismo-validator NEW` (push Phase 7)
estimate_hours: 0.5
ownership: maker-1 caveman writes ONLY ~/.claude/skills/elab-morfismo-validator/ + automa/team-state/messages/maker-1-*.md
phase1_budget_cumulative_hours: 0.5
---

## Task

Skill 1 NEW elab-morfismo-validator. Misura Morfismo Sense 1 (technical runtime) + Sense 1.5 (per-docente/classe/UI) + Sense 2 (triplet kit Omaric ↔ volumi Davide ↔ software).

## Scope

- Read superpowers:skill-creator + superpowers:writing-skills patterns FIRST
- Read existing template ~/.claude/skills/elab-principio-zero-validator/SKILL.md per format reference
- Define YAML frontmatter:
  ```yaml
  ---
  name: elab-morfismo-validator
  description: Use when validating ELAB Tutor Morfismo Sense 1 (technical runtime) + Sense 1.5 (per-docente/classe/UI) + Sense 2 (triplet kit Omaric ↔ volumi Davide ↔ software). Measures palette compliance, NanoR4Board SVG identity, font usage, ToolSpec count drift, lesson-paths coverage.
  ---
  ```
- Embed 10 bash measure commands per gate G1-G10 (see master plan §1 Phase 1 Skill 1 Step 1.1.4)
- Output formula scoring + table 10 rows ognuno run

## Deliverables

- `~/.claude/skills/elab-morfismo-validator/SKILL.md` (~250 LOC)
- `automa/team-state/messages/maker-1-iter31-A1-completed.md` (completion msg PRE Phase 2)

## Hard rules

- NO writes outside ~/.claude/skills/elab-morfismo-validator/ + messages
- NO code changes src/ tests/ supabase/
- Caveman ON
- 3x CoV before claim done (vitest baseline + build PASS + dry-run table output)

## Iter 31 link

Master plan §1 §2 Phase 1. Skill measures Box 13 UI/UX + Sense 2 triplet coerenza. Used Phase 7 finale audit aggregate score.

## File ownership disjoint

Maker-1 owns: ~/.claude/skills/elab-morfismo-validator/ + ~/.claude/skills/elab-principio-zero-validator/ (extend A5) + scripts/mechanisms/M-AR-* + scripts/mechanisms/M-AI-01 + scripts/mechanisms/M-AR-05. NO write conflict con Maker-2 (elab-onniscenza-measure + M-AI-04) né Tester-1 (elab-velocita-* + elab-onnipotenza-* + M-AI-03) né Architect (M-AI-02).
