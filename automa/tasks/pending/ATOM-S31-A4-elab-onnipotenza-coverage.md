---
atom_id: ATOM-S31-A4
sprint: T
iter: 31
phase: 1
priority: P0
assigned_to: tester-1-caveman-second
depends_on: [ATOM-S31-A3]
provides:
  - ~/.claude/skills/elab-onnipotenza-coverage/SKILL.md
acceptance_criteria:
  - file ~250 LOC SKILL.md NEW
  - YAML frontmatter (name, description) per superpowers:skill-creator
  - 9 measurement gates G1-G9 defined per master plan §1 Phase 1 Skill 4
  - G1 L0 direct API count grep -E "window.__ELAB_API.unlim.\\w+" src/services/simulator-api.js ≥26
  - G2 L1 composite handler tests composite-handler.test.ts PASS 10/10
  - G3 L2 template router count clawbot-templates.ts inlined 20 + JSON catalog 22 (drift +2 iter 36 D2)
  - G4 L3 Deno 12-tool subset count scripts/openclaw/postToVisionEndpoint.ts + dispatcher 12-tool entries
  - G5 INTENT parser fire-rate prod query Supabase Edge logs intents_parsed.length>0 rate ≥30%
  - G6 Mistral function calling canonical R7 200-prompt args.id canonical schema rate ≥95% (current 3.6% iter 38)
  - G7 canary CANARY_DENO_DISPATCH_PERCENT env value + actual fire-rate measure expected env=5 OR widen
  - G8 ENABLE_INTENT_TOOLS_SCHEMA env prod expected `true` post deploy v73+
  - G9 whitelist 12 actions intentsDispatcher.js ALLOWED_INTENT_ACTIONS array length=12 + NO destructive verify
  - body bash + grep + SQL commands measure embedded ognuno gate
  - CoV dry-run produce 9-line table
  - vitest 13474 baseline preserve (no test changes Phase 1)
  - commit atomic locale `feat(skills/iter-31): elab-onnipotenza-coverage NEW` (push Phase 7)
estimate_hours: 0.5
ownership: tester-1 caveman second pass writes ONLY ~/.claude/skills/elab-onnipotenza-coverage/ + automa/team-state/messages/tester-1-*.md
phase1_budget_cumulative_hours: 2.0
---

## Task

Skill 4 NEW elab-onnipotenza-coverage. Misura tool coverage L0 direct API + L1 composite handler + L2 template router + L3 Deno 12-tool dispatcher + INTENT parser fire-rate + canary stage tracking + Mistral function calling canonical rate.

## Scope

- Read superpowers:skill-creator FIRST
- Define YAML frontmatter:
  ```yaml
  ---
  name: elab-onnipotenza-coverage
  description: Use when measuring UNLIM Onnipotenza L0 direct API + L1 composite + L2 template router + L3 Deno 12-tool + INTENT parser + Mistral function calling canonical + canary stage. Output 9-row table CoV gate ognuno.
  ---
  ```
- Embed 9 bash + grep + SQL commands measure ognuno gate (see master plan §1 Phase 1 Skill 4 Step 1.4.2)
- Output formula scoring + table 9 rows ognuno run

## Deliverables

- `~/.claude/skills/elab-onnipotenza-coverage/SKILL.md` (~250 LOC)
- `automa/team-state/messages/tester-1-iter31-A4-completed.md` (completion msg PRE Phase 2)

## Hard rules

- NO writes outside ~/.claude/skills/elab-onnipotenza-coverage/ + messages
- NO code changes src/ tests/ supabase/
- Caveman ON
- 3x CoV before claim done

## Iter 31 link

Master plan §1 §2 Phase 1. Skill measures Box 10 ClawBot + Box 14 INTENT exec end-to-end progression. Used Phase 7 finale audit aggregate score. Iter 38 R7 canonical 3.6% baseline pre Mistral function calling deploy v73+ post Phase 4.

## File ownership disjoint

Tester-1 owns: ~/.claude/skills/elab-velocita-latenze-tracker/ + ~/.claude/skills/elab-onnipotenza-coverage/ + scripts/mechanisms/M-AI-03. NO write conflict con Maker-1 (elab-morfismo-validator + elab-principio-zero-validator extend + M-AR-01 + M-AI-01 + M-AR-05) né Maker-2 (elab-onniscenza-measure + M-AI-04) né Architect (M-AI-02).
