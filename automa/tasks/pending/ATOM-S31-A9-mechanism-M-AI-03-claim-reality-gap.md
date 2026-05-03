---
atom_id: ATOM-S31-A9
sprint: T
iter: 31
phase: 1
priority: P0
assigned_to: tester-1-caveman
depends_on: []
provides:
  - scripts/mechanisms/M-AI-03-claim-reality-gap-detector.mjs
  - scripts/mechanisms/M-AI-03-README.md
acceptance_criteria:
  - node mjs script NEW ~120 LOC
  - validates "LIVE prod" claims via HTTP curl + bench output cross-ref
  - 5 claim-reality checks minimum:
    - CR1 "Edge Function vN deployed prod" claim vs curl HEAD `https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat` HTTP 200/204 verify + version header
    - CR2 "R5 latency p95 <2500ms" claim vs latest `scripts/bench/output/r5-stress-*.{json,md}` parse latest p95
    - CR3 "R7 canonical ≥95%" claim vs latest `scripts/bench/output/r7-stress-*.json` parse canonical rate
    - CR4 "Vercel deploy LIVE" claim vs curl `https://www.elabtutor.school` last-modified header + commit SHA via `__BUILD_SHA` window
    - CR5 "Onniscenza V1 active" claim vs Supabase env query `ONNISCENZA_VERSION` (Edge Function logs cross-ref)
  - emit claim-reality report `docs/audits/iter-31-claim-reality-{timestamp}.md`
  - exit code 1 se gap detected ≥1 critical claim
  - exit code 0 se all claims verified
  - README ~30 LOC usage + integration suggestion pre-commit + post-deploy
  - vitest 13474 baseline preserve (no test changes Phase 1)
  - commit atomic locale `feat(mechanisms/iter-31): M-AI-03 claim-reality gap detector NEW` (push Phase 7)
estimate_hours: 0.5
ownership: tester-1 caveman writes ONLY scripts/mechanisms/M-AI-03-* + automa/team-state/messages/tester-1-*.md
phase1_budget_cumulative_hours: 4.25
---

## Task

Mechanism M-AI-03 Claim-reality gap detector. Phase 1 G45 Opus indipendente identified 3 inflation flags real (Onniscenza V2 LIVE → REVERTED, Deno dispatcher fire-rate 0%, R5 cap removed claim). Mechanical detector previene future inflation iter 41-43 Sprint T close.

## Scope

- Implement 5 claim-reality checks CR1-CR5 minimum
- Use curl + jq + parse bench output JSON
- Emit claim-reality report markdown per detection
- Integration suggestion pre-commit + post-deploy

## Deliverables

- `scripts/mechanisms/M-AI-03-claim-reality-gap-detector.mjs` (~120 LOC node ESM)
- `scripts/mechanisms/M-AI-03-README.md` (~30 LOC)
- `automa/team-state/messages/tester-1-iter31-A9-completed.md` (completion msg PRE Phase 2)

## Hard rules

- NO destructive ops
- NO modify production env (read-only checks)
- Caveman ON
- 3x CoV before claim done

## Iter 31 link

Master plan §1 §2 Phase 1 mechanism + Phase 1 G45 Opus indipendente baseline (`docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md` 3 inflation flags concrete). Mechanical detector enforce non compiacenza iter 41-43.

## File ownership disjoint

Tester-1 owns ~/.claude/skills/elab-velocita-* + elab-onnipotenza-* + scripts/mechanisms/M-AI-03. NO write conflict con Maker-1 (M-AR-01 + M-AI-01 + M-AR-05) né Maker-2 (M-AI-04) né Architect (M-AI-02).
