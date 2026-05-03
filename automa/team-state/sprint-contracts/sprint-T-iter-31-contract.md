# Sprint T iter 31 contract — Pattern S r3 6-agent OPUS PHASE-PHASE

**Date**: 2026-05-02
**Status**: ACTIVE Phase 1 entrance
**Master plan**: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
**Baseline iter 30**: vitest 13474 + git HEAD `69c9453` + 8 G45 defaults applied `automa/state/iter-31-andrea-flags.jsonl`
**Phase 0+1 done**: discovery + measured baseline + Opus G45 indipendente score 8.0/10 ONESTO
**Sprint T close target**: iter 41-43 cumulative 9.5/10 ONESTO post Andrea Opus G45 final ratify Phase 7

---

## §1. 6-agent file ownership matrix DISJOINT (NO write conflict)

| Agent | Phase | File ownership scope (rigid disjoint) | Atoms |
|---|---|---|---|
| **Planner-opus** | 0 (prep) + 1 (orchestrate) | `automa/team-state/sprint-contracts/sprint-T-iter-31-contract.md` + `automa/team-state/messages/planner-opus-iter31-*.md` + `automa/tasks/pending/ATOM-S31-A*.md` | A12 (this contract) + 12 ATOM creation + dispatch msgs |
| **Architect-opus** | 1 (parallel) | `scripts/mechanisms/M-AI-02-*` + `automa/team-state/messages/architect-iter31-*.md` (read-only `docs/adrs/` + `docs/superpowers/plans/`) | A11 |
| **Maker-1 caveman** | 1 (parallel) | `~/.claude/skills/elab-morfismo-validator/` + `~/.claude/skills/elab-principio-zero-validator/` (extend) + `scripts/mechanisms/M-AR-01-*` + `scripts/mechanisms/M-AR-05-*` + `scripts/mechanisms/M-AI-01-*` + `automa/state/score-history-registry.jsonl` + `automa/team-state/messages/maker-1-iter31-*.md` | A1 + A5 + A6 + A7 + A10 (5 atoms) |
| **Maker-2 caveman** | 1 (parallel) | `~/.claude/skills/elab-onniscenza-measure/` + `scripts/mechanisms/M-AI-04-*` + `automa/team-state/messages/maker-2-iter31-*.md` | A2 + A8 (2 atoms) |
| **Tester-1 caveman** | 1 (parallel) | `~/.claude/skills/elab-velocita-latenze-tracker/` + `~/.claude/skills/elab-onnipotenza-coverage/` + `scripts/mechanisms/M-AI-03-*` + `automa/team-state/messages/tester-1-iter31-*.md` | A3 + A4 + A9 (3 atoms) |
| **Scribe-opus** | 2 (sequential POST 5/5 completion msgs) | `docs/audits/iter-31-quality-audit-1.md` + `docs/audits/iter-31-systematic-debug-1.md` + `docs/handoff/2026-05-02-iter-31-to-iter-32-handoff.md` + CLAUDE.md APPEND + `automa/team-state/messages/scribe-iter31-phase2-*.md` | Phase 2 audit + handoff + CLAUDE.md update |

**Race-cond fix mandate**: 5/5 maker+tester+architect completion msgs PRE scribe Phase 2 spawn (filesystem barrier). Scribe SOLO post 5/5 confirmation. NO write conflict between agents (rigid file ownership disjoint).

---

## §2. Filesystem barrier protocol Pattern S r3

```
Phase 1 (parallel ~5.25h max):
  Maker-1 → 5 atoms → emits maker-1-iter31-{A1,A5,A6,A7,A10}-completed.md
  Maker-2 → 2 atoms → emits maker-2-iter31-{A2,A8}-completed.md
  Tester-1 → 3 atoms → emits tester-1-iter31-{A3,A4,A9}-completed.md
  Architect → 1 atom → emits architect-iter31-A11-completed.md

Filesystem barrier check: orchestrator polls `ls automa/team-state/messages/{agent}-iter31-*-completed.md` count = 11 (5+2+3+1)

Phase 2 (sequential SCRIBE post barrier):
  Scribe → audit + handoff + CLAUDE.md APPEND → emits scribe-iter31-phase2-completed.md

Phase 3 (orchestrator post Phase 2):
  vitest full + build PASS verify + commit atomic + push origin (NOT main, NOT --no-verify)
```

**Pattern S r3 validated 9× consecutive**: iter 5 P1+P2, iter 6 P1, iter 8 r2, iter 11, iter 12 r2, iter 19, iter 36, iter 37, iter 38 (degraded). Iter 31 = **10th consecutive**.

---

## §3. 12 ATOM cross-reference map

| Atom ID | Title | Assignee | Est h | Provides |
|---|---|---|---|---|
| A1 | elab-morfismo-validator NEW | Maker-1 | 0.5 | ~/.claude/skills/elab-morfismo-validator/SKILL.md (10 gates G1-G10) |
| A2 | elab-onniscenza-measure NEW | Maker-2 | 0.5 | ~/.claude/skills/elab-onniscenza-measure/SKILL.md (8 gates G1-G8) |
| A3 | elab-velocita-latenze-tracker NEW | Tester-1 | 0.5 | ~/.claude/skills/elab-velocita-latenze-tracker/SKILL.md (9 gates G1-G9) |
| A4 | elab-onnipotenza-coverage NEW | Tester-1 (2nd) | 0.5 | ~/.claude/skills/elab-onnipotenza-coverage/SKILL.md (9 gates G1-G9) |
| A5 | elab-principio-zero-validator EXTEND | Maker-1 (2nd) | 0.25 | ~/.claude/skills/elab-principio-zero-validator/SKILL.md +50 LOC (3 NEW gates G+1 G+2 G+3) |
| A6 | M-AR-01 auto-revert pre-commit ENHANCED | Maker-1 | 0.5 | scripts/mechanisms/M-AR-01-auto-revert-pre-commit.sh ~80 LOC |
| A7 | M-AI-01 score history registry validator | Maker-1 | 0.5 | scripts/mechanisms/M-AI-01-score-history-validator.mjs ~100 LOC |
| A8 | M-AI-04 doc drift detector | Maker-2 | 0.5 | scripts/mechanisms/M-AI-04-doc-drift-detector.mjs ~120 LOC (5 drift checks DC1-DC5) |
| A9 | M-AI-03 claim-reality gap detector | Tester-1 | 0.5 | scripts/mechanisms/M-AI-03-claim-reality-gap-detector.mjs ~120 LOC (5 checks CR1-CR5) |
| A10 | M-AR-05 smart rollback machinery | Maker-1 | 0.5 | scripts/mechanisms/M-AR-05-smart-rollback.sh ~100 LOC (6 features F1-F6) |
| A11 | M-AI-02 mechanical cap enforcer | Architect | 0.5 | scripts/mechanisms/M-AI-02-mechanical-cap-enforcer.mjs ~150 LOC (6 cap rules CAP-1 through CAP-6) |
| A12 | Sprint T iter 31 contract (this doc) | Planner | 0.5 | automa/team-state/sprint-contracts/sprint-T-iter-31-contract.md ~250 LOC |

**Total Phase 1 budget cumulative**: 5.75h ≤6h Phase 1 target master plan §2.

---

## §4. Completion msg protocol mandatory

Each agent MUST emit completion msg PRE Phase 2 scribe spawn:

```markdown
# {agent} iter 31 Phase 1 atom {A_ID} completed

**Date**: 2026-05-02 HH:MM CEST
**Atom**: ATOM-S31-{A_ID}-{title}
**Status**: COMPLETED ✅
**Files written**: {file_list}
**LOC delta**: +{n} NEW / +{m} MODIFIED
**CoV 3-step**: ✅ vitest baseline 13474 PRESERVE / ✅ build PASS / ✅ dry-run output table OK
**Honesty caveats**: {explicit limitations}
**Next**: PHASE 2 scribe sequential post 5/5 completion msgs barrier
```

---

## §5. CoV mandate 3-step ognuno atom

Per master plan §8:
1. **CoV-1 baseline preserve**: `npx vitest run` PRIMA atom MUST PASS 13474 baseline
2. **CoV-2 incremental**: `npx vitest run tests/unit/{newscope}` post atom (if applicable, Phase 1 SKILLS+MECHANISMS no test changes)
3. **CoV-3 finale**: `npx vitest run` POST atom MUST PASS baseline + delta tests

Failure CoV ANY step → REVERT IMMEDIATO + investigation root cause via `superpowers:systematic-debugging`.

NO `--no-verify`. NO `git push --force`. NO `git reset --hard`. NO `rm -rf` outside tmp/.

---

## §6. Anti-pattern checklist iter 31 explicit

Per master plan §12:

- ❌ NO atom shipped senza CoV 3-step
- ❌ NO Phase close senza systematic-debug + quality-audit (Phase 7 mandate)
- ❌ NO commit senza pre-commit hook GREEN
- ❌ NO push senza pre-push hook GREEN
- ❌ NO claim score senza Opus G45 indipendente Phase 7
- ❌ NO bypass `--no-verify` mai
- ❌ NO push main mai
- ❌ NO destructive ops mai (NO `git reset --hard`, NO `git clean -f`, NO `rm -rf` outside tmp/)
- ❌ NO claim "Andrea ratified" senza explicit chat reply
- ❌ NO claim "Mac Mini autonomous LIVE" senza 24h soak verified
- ❌ NO compiacenza score inflato (G45 cap mandate enforced via M-AI-02 mechanical iter 31)

---

## §7. Phase 7 finale audit aggregation

Per master plan §2 Phase 7 acceptance gate:

- All 5 skills (A1-A5) measured + dashboard aggregated `docs/audits/iter-31-FINAL-audit.md`
- M-AI-02 mechanical cap enforcer (A11) invoked per Skill output → capped score ONESTO output
- vitest 13474+ baseline preserve (no Phase 1 test changes; iter 32+ test additions trigger M-AR-01 baseline update)
- Build PASS pre-push hook NOT bypassed
- Andrea Opus G45 indipendente review session context-zero (≤8.5 OR justified ≥ con razionale concreto)
- Score Opus ≤8.5 (Sprint T close target ONESTO 10gg per Decisione #7) OR justified ≥ con cap-rule explicit
- CLAUDE.md sprint history footer recalibrate post Opus

---

## §8. Cross-link

- Master plan: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
- Phase 0 discovery: `docs/audits/PHASE-0-discovery-2026-05-02.md`
- Phase 0 baseline: `docs/audits/PHASE-0-baseline-2026-05-02.md`
- Phase 1 G45 Opus indipendente: `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md`
- 12 ATOM-S31-A* files: `automa/tasks/pending/ATOM-S31-A{1..12}-*.md`
- PIANO Sprint T close: `docs/superpowers/plans/PIANO-ANDREA-SOLO-SPRINT-T-CLOSE-2026-05-02.md`
- Iter 30 priority matrix: `docs/audits/2026-05-02-iter30-andrea-13-decisioni-priority-matrix.md`
- Iter 30 Mac Mini gap analysis: `docs/audits/2026-05-02-iter30-mac-mini-audit-script-gap-analysis.md`

---

**Status**: Phase 1 entrance ACTIVE. Awaiting Maker-1 + Maker-2 + Tester-1 + Architect agent dispatch parallel. Scribe Phase 2 sequential gated 5/5 completion msgs filesystem barrier.
