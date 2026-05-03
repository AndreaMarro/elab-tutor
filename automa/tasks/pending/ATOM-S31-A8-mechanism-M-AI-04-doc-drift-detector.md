---
atom_id: ATOM-S31-A8
sprint: T
iter: 31
phase: 1
priority: P0
assigned_to: maker-2-caveman
depends_on: []
provides:
  - scripts/mechanisms/M-AI-04-doc-drift-detector.mjs
  - scripts/mechanisms/M-AI-04-README.md
acceptance_criteria:
  - node mjs script NEW ~120 LOC
  - cross-references claim CLAUDE.md vs file-system reality
  - 5 drift checks minimum:
    - DC1 ToolSpec count claim docs vs `grep -cE "name: ['\"]" scripts/openclaw/tools-registry.ts` (iter 28 inflated 62 vs reality 57 corrected iter 37)
    - DC2 lesson-paths count claim vs `ls src/data/lesson-paths/v*-cap*-esp*.json | wc -l` (iter 36 D3 5 missing reali)
    - DC3 RAG chunks claim vs SQL `SELECT COUNT(*) FROM rag_chunks` (1881 ingested vs 6000 target)
    - DC4 wiki concepts claim vs `ls docs/unlim-wiki/concepts/*.md | wc -l` (126 vs claimed 100)
    - DC5 vitest baseline claim vs file `automa/baseline-tests.txt` (iter 18 12718 unsync flagged)
  - emit drift report `docs/audits/iter-31-doc-drift-{timestamp}.md` per ognuna detection
  - exit code 1 se drift detected ≥3 instances
  - exit code 0 se all sync
  - README ~30 LOC usage + cron integration suggestion weekly
  - vitest 13474 baseline preserve (no test changes Phase 1)
  - commit atomic locale `feat(mechanisms/iter-31): M-AI-04 doc drift detector NEW` (push Phase 7)
estimate_hours: 0.5
ownership: maker-2 caveman writes ONLY scripts/mechanisms/M-AI-04-* + automa/team-state/messages/maker-2-*.md
phase1_budget_cumulative_hours: 3.75
---

## Task

Mechanism M-AI-04 Doc drift detector. CLAUDE.md + handoff docs sprint history claim vs file-system reality cross-validation. Anti-inflation FERREA + non compiacenza mandate.

## Scope

- Implement 5 drift checks DC1-DC5 minimum
- Read CLAUDE.md sprint history footer per claim extraction (regex per metric)
- Read file-system + run grep/find/ls + SQL for reality
- Compare claim vs reality
- Emit drift report markdown per detection
- Cron integration suggestion weekly

## Deliverables

- `scripts/mechanisms/M-AI-04-doc-drift-detector.mjs` (~120 LOC node ESM)
- `scripts/mechanisms/M-AI-04-README.md` (~30 LOC)
- `automa/team-state/messages/maker-2-iter31-A8-completed.md` (completion msg PRE Phase 2)

## Hard rules

- NO destructive ops
- NO modify CLAUDE.md (read-only)
- Caveman ON
- 3x CoV before claim done

## Iter 31 link

Master plan §1 §2 Phase 1 mechanism. Iter 28 ToolSpec count drift 62 vs 57 reality + iter 18 vitest baseline 12718 vs 12290 unsync = REAL examples drift già occorsi. Mechanical detector previene regressione iter 41-43 Sprint T close.

## File ownership disjoint

Maker-2 owns ~/.claude/skills/elab-onniscenza-measure/ + scripts/mechanisms/M-AI-04. NO write conflict con Maker-1 né Tester-1 né Architect.
