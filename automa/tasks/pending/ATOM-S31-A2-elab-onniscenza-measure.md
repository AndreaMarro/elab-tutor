---
atom_id: ATOM-S31-A2
sprint: T
iter: 31
phase: 1
priority: P0
assigned_to: maker-2-caveman
depends_on: []
provides:
  - ~/.claude/skills/elab-onniscenza-measure/SKILL.md
acceptance_criteria:
  - file ~250 LOC SKILL.md NEW
  - YAML frontmatter (name, description) per superpowers:skill-creator
  - 8 measurement gates G1-G8 defined per master plan §1 Phase 1 Skill 2
  - G1 7-layer coverage count layers wired _shared/onniscenza-bridge.ts + state-snapshot-aggregator.ts target 7/7
  - G2 classifier accuracy 6-cat regex _shared/onniscenza-classifier.ts test 30/30 PASS verify
  - G3 RAG chunks count + page coverage SQL SELECT COUNT + AVG page metadata target 1881+ + page≥80%
  - G4 wiki concepts count `ls docs/unlim-wiki/concepts/*.md | wc -l` ≥126
  - G5 hybrid retriever recall@5 r6-fixture.jsonl 100-prompt cfBgeM3Embed + RRF k=60 ≥0.55
  - G6 anti-absurd flag rate query Edge logs anti_absurd_flag <5%
  - G7 conversation history embed cache hit rate telemetry conversation_history_embed_cache_hit ≥40%
  - G8 V1 vs V2 ratio env ONNISCENZA_VERSION=v1 confirm + zero V2 calls last 24h
  - body bash + SQL commands measure embedded ognuno gate
  - CoV dry-run produce 8-line table
  - vitest 13474 baseline preserve (no test changes Phase 1)
  - commit atomic locale `feat(skills/iter-31): elab-onniscenza-measure NEW` (push Phase 7)
estimate_hours: 0.5
ownership: maker-2 caveman writes ONLY ~/.claude/skills/elab-onniscenza-measure/ + automa/team-state/messages/maker-2-*.md
phase1_budget_cumulative_hours: 1.0
---

## Task

Skill 2 NEW elab-onniscenza-measure. Misura Onniscenza 7-layer aggregator V1 active prod (`ONNISCENZA_VERSION=v1`) + classifier 6 categorie pre-LLM topK 0/2/3 + anti-absurd validator post-LLM NER + pin check.

## Scope

- Read superpowers:skill-creator FIRST
- Define YAML frontmatter:
  ```yaml
  ---
  name: elab-onniscenza-measure
  description: Use when measuring UNLIM Onniscenza 7-layer coverage + classifier accuracy 6-cat + RAG page coverage + Wiki concepts count + hybrid recall@5 + anti-absurd flag rate + conversation cache hit + V1/V2 ratio. Output 8-row table per CoV gate ognuno.
  ---
  ```
- Embed 8 bash + SQL measure commands per gate G1-G8 (see master plan §1 Phase 1 Skill 2 Step 1.2.2)
- Output formula scoring + table 8 rows ognuno run

## Deliverables

- `~/.claude/skills/elab-onniscenza-measure/SKILL.md` (~250 LOC)
- `automa/team-state/messages/maker-2-iter31-A2-completed.md` (completion msg PRE Phase 2)

## Hard rules

- NO writes outside ~/.claude/skills/elab-onniscenza-measure/ + messages
- NO code changes src/ tests/ supabase/
- Caveman ON
- 3x CoV before claim done

## Iter 31 link

Master plan §1 §2 Phase 1. Skill measures Box 11 Onniscenza progression. Used Phase 7 finale audit aggregate score.

## File ownership disjoint

Maker-2 owns: ~/.claude/skills/elab-onniscenza-measure/ + scripts/mechanisms/M-AI-04. NO write conflict con Maker-1 (elab-morfismo-validator + elab-principio-zero-validator extend + M-AR-01 + M-AI-01 + M-AR-05) né Tester-1 (elab-velocita-* + elab-onnipotenza-* + M-AI-03) né Architect (M-AI-02).
