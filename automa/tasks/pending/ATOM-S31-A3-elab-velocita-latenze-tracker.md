---
atom_id: ATOM-S31-A3
sprint: T
iter: 31
phase: 1
priority: P0
assigned_to: tester-1-caveman
depends_on: []
provides:
  - ~/.claude/skills/elab-velocita-latenze-tracker/SKILL.md
acceptance_criteria:
  - file ~250 LOC SKILL.md NEW
  - YAML frontmatter (name, description) per superpowers:skill-creator
  - 9 measurement gates G1-G9 defined per master plan §1 Phase 1 Skill 3
  - G1 R5 50-prompt p50/p95/p99 run scripts/bench/run-sprint-r5-stress.mjs target p95 <2500ms (PDR target)
  - G2 R5 cold start latency first prompt post 5min idle Edge Function <4000ms
  - G3 R5 warmup cron effective query Supabase pg_cron unlim-chat-warmup ≥48 runs/day
  - G4 STT CF Whisper round-trip Voxtral output → CF Whisper STT <800ms
  - G5 TTS Voxtral synthesize p50 100-char Italian → mp3 <1500ms
  - G6 Vision Pixtral first-byte 1 image + prompt <3500ms
  - G7 FLUX schnell imagegen 1024² 4-step <2500ms
  - G8 Frontend Lighthouse perf #chatbot-only + #about-easter ≥70 intermediate (≥90 final iter 42+)
  - G9 4G LIM realistic loadtime throttle 4G slow + first contentful paint <3500ms LIM realistic
  - body bash + curl commands measure embedded ognuno gate
  - CoV dry-run produce 9-line table
  - vitest 13474 baseline preserve (no test changes Phase 1)
  - commit atomic locale `feat(skills/iter-31): elab-velocita-latenze-tracker NEW` (push Phase 7)
estimate_hours: 0.5
ownership: tester-1 caveman writes ONLY ~/.claude/skills/elab-velocita-latenze-tracker/ + automa/team-state/messages/tester-1-*.md
phase1_budget_cumulative_hours: 1.5
---

## Task

Skill 3 NEW elab-velocita-latenze-tracker. Misura p50/p95/p99 latency + cold start + warmup cron + 4G LIM realistic + multimodal stack (TTS/STT/Vision/ImageGen).

## Scope

- Read superpowers:skill-creator FIRST
- Define YAML frontmatter:
  ```yaml
  ---
  name: elab-velocita-latenze-tracker
  description: Use when measuring ELAB Tutor latency stack p50/p95/p99 R5 50-prompt + cold start + warmup cron + multimodal (Voxtral TTS/CF Whisper STT/Pixtral Vision/FLUX schnell) + Lighthouse perf + 4G LIM realistic. Output 9-row table CoV gate ognuno.
  ---
  ```
- Embed 9 bash + curl + Lighthouse commands measure ognuno gate (see master plan §1 Phase 1 Skill 3 Step 1.3.2)
- Output formula scoring + table 9 rows ognuno run

## Deliverables

- `~/.claude/skills/elab-velocita-latenze-tracker/SKILL.md` (~250 LOC)
- `automa/team-state/messages/tester-1-iter31-A3-completed.md` (completion msg PRE Phase 2)

## Hard rules

- NO writes outside ~/.claude/skills/elab-velocita-latenze-tracker/ + messages
- NO code changes src/ tests/ supabase/
- Caveman ON
- 3x CoV before claim done

## Iter 31 link

Master plan §1 §2 Phase 1. Skill measures latency mechanical cap PDR §4 R5 latency rule (iter 37 cap 8.0 trigger). Used Phase 7 finale audit aggregate score.

## File ownership disjoint

Tester-1 owns: ~/.claude/skills/elab-velocita-latenze-tracker/ + ~/.claude/skills/elab-onnipotenza-coverage/ + scripts/mechanisms/M-AI-03. NO write conflict con Maker-1 (elab-morfismo-validator + elab-principio-zero-validator extend + M-AR-01 + M-AI-01 + M-AR-05) né Maker-2 (elab-onniscenza-measure + M-AI-04) né Architect (M-AI-02).
