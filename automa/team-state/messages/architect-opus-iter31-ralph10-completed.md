---
agent: architect-opus
iter: 31
ralph: 10
phase: 3 (plan iter 10-11 per master plan iter 31 §Phase 3)
sprint: T close — design ADR-035 Onniscenza V2.1 conversational fusion fair comparison protocol
date: 2026-05-03
status: COMPLETED
---

## Deliverables shipped (file-system verified)

1. **`docs/adrs/ADR-035-onniscenza-v2-1-conversational-fusion.md`** — REPLACED with 9-section fair comparison protocol (iter 10 design, NOT impl, NOT bench)
   - LOC: ~430 lines (within ~400-500 target)
   - 9 sections per task mandate: §1 Context + §2 Decision + §3 V2.1 architecture + §4 Bench protocol + §5 Decision matrix + §6 Acceptance gate + §7 Risks + mitigations + §8 Rollback plan + §9 Cross-link
   - Status: PROPOSED (Andrea ratify queue iter 11+, design only iter 10, bench gated)
   - Supersedes: previous ADR-035 design iter 41 ralph iter 3 (preserved as iter 41 commit `2abe26d` historical)
   - Architecture detail §3 references `aggregateOnniscenzaV21` already shipped iter 41 (`onniscenza-conversational-fusion.ts` 142 LOC verified file-system this iter)

2. **`automa/team-state/messages/architect-opus-iter31-ralph10-completed.md`** — this completion msg

## ADR-035 9-section summary

- **§1 Context**: V1 baseline LIVE prod (94.2% PZ V3 / 1607ms / 3380ms p95) vs V2 REJECTED iter 39 (-1.0pp PZ V3 + 36% slower) + V2.1 hypothesis minimal-risk conversational fusion preserving RRF k=60
- **§2 Decision**: Adopt fair comparison protocol R5 V1 baseline + V2.1 canary 5% gating mechanism for `ONNISCENZA_VERSION` env flip
- **§3 V2.1 architecture**: 4 weighted boost factors capped +0.50 (experiment-anchor +0.15 / kit-mention +0.10 / recent-history +0.20 × cosineSim / docente-stylistic +0.05) + RRF k=60 base UNCHANGED + cache hit ≥40% target + anti-absurd flag <5% target
- **§4 Bench protocol**: R5 V1 baseline re-run iter 11 entrance + V2.1 canary 5% R5 re-bench post env flip; R6 100-prompt RAG-aware fixture deferred iter 12+ (runner not shipped per Phase 0 §5)
- **§5 Decision matrix**: 3 exit paths (RAMP 25% / STAY canary 5% / REVERT) with quantitative thresholds (PZ V3 + latency p95 ± 5/10% + anti_absurd_flag <5%)
- **§6 Acceptance gate**: 6 sequenced gates (R5 V1 PASS → Andrea ratify → canary 5% deploy → 24h soak → ramp → manual review)
- **§7 Risks + mitigations**: 8 risks tabulated (latency overhead / cache miss cold start / PZ V3 regression repeat / boost gaming / docente cold-start / history dominance / Voyage rate limit / telemetry flood)
- **§8 Rollback plan**: `ONNISCENZA_VERSION=v1` immediate env flip + audit log entry `automa/state/inflation-flags.jsonl` schema + post-revert iter 12+ redesign options
- **§9 Cross-link**: G45 Opus baseline + V2 regression bench + master plan iter 31 + iter 5 dry-run + iter 7 plan iter 8-20 + ADR-033 historical + ADR-014 R6 fixture + ADR-021 RAG coverage + canonical exports `onniscenza-bridge.ts:404,416`

## Anti-pattern enforced (task mandate iter 31 ralph 10)

- ✅ NO claim "V2.1 LIVE" — ADR explicit "design only iter 10, bench gated Andrea iter 11+"
- ✅ NO override `ONNISCENZA_VERSION=v1` env — ADR §8 explicit "without V2.1 bench PASS + Andrea ratify"
- ✅ NO inflate score — ADR §2 explicit "does NOT auto-promote V2.1 to production"
- ✅ NO write outside `docs/adrs/` + `automa/team-state/messages/` — only 2 files written this iter
- ✅ NO `--no-verify` — no commits by this iter (orchestrator commits Phase 3)
- ✅ NO commit by design iter — orchestrator commits Phase 3 per task mandate
- ✅ Modalità normale (NOT caveman) — full prose ADR

## Honesty caveats critical (NO COMPIACENZA)

1. **Master plan §2 Phase 5 reference to `state-snapshot-aggregator.ts`**: file NOT FOUND in `supabase/functions/_shared/` per Bash scan iter 10. The 7-layer aggregator referenced in plan is `aggregateOnniscenza` in `onniscenza-bridge.ts:299` (V1) — plan reference may have been stale; ADR-035 §9 documents the canonical exports actually present in repo.
2. **R6 100-prompt fixture runner NOT shipped** per Phase 0 §5 (G45 Opus §3 Box 6 0.85 reflects R6 fixture absent). ADR §4 deferred R6 to ramp 25%→100% gate iter 12+; iter 11 canary uses R5 50-prompt as gate.
3. **"R6 100-prompt RAG-aware" task wording** vs ADR-014 spec (already proposed) cross-referenced; runner author iter 12+ Tester-1 (~3h, NOT this iter scope).
4. **R5 latest 0/8 BROKEN flag** per Phase 0 §3 (2026-05-02T07:28 latest run). ADR §6 acceptance gate #1 requires R5 V1 baseline PASS pre-bench (50/50 + PZ V3 ≥90% + p95 ≤4000ms sanity); if R5 still 0/8 BROKEN iter 11 entrance, bisect by env flag per G45 Opus §6 root cause investigation recommendation BEFORE V2.1 canary flip.
5. **"RRF k=60 fuse conversation_history_embed + RAG hits" framing** in master plan §2 Phase 5 Atom 5.1.2: ADR §3 interprets this as **additive boost** (not alternate-list RRF over two ranked lists). Rationale documented §3 Architecture detail (preserves V1 RRF k=60 base + avoids V2 mistake of replacing baseline ordering). True alternate-list RRF deferred future iter if additive boost insufficient.
6. **`aggregateOnniscenzaV21` shipped iter 41 commit `2abe26d`** verified file-system (142 LOC `onniscenza-conversational-fusion.ts`) but **NOT executed prod** per current `ONNISCENZA_VERSION=v1` env active (G45 Opus §3 inflation flag #1). ADR §6 acceptance gate sequences explicitly require V1 baseline R5 PASS BEFORE V2.1 canary flip.
7. **Speculative quality gain V2.1**: ADR §1 explicit "speculative gains (untested live)" — plurale Ragazzi + kit_mention + recent-history boosts may align responses with PRINCIPIO ZERO mandate, but real bench TBD iter 11+. NO claim V2.1 outperforms V1 without bench evidence.

## Files cited (canonical paths)

- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/adrs/ADR-035-onniscenza-v2-1-conversational-fusion.md` (this iter REPLACED, ~430 LOC, 9 sections)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md` (Phase 1 baseline iter 39 G45 indipendente)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/audits/iter-39-A4-Onniscenza-V2-REGRESSION-revert.md` (V2 -1.0pp PZ V3 + 36% slower regression bench)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/supabase/functions/_shared/onniscenza-bridge.ts` (V1 line 299 + V2 line 608 + V2.1 selector lines 404-416)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/supabase/functions/_shared/onniscenza-classifier.ts` (6 categorie pre-LLM topK 0/2/3 iter 37 wired prod, preserved unchanged for V2.1)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/supabase/functions/_shared/onniscenza-conversational-fusion.ts` (V2.1 impl iter 41 commit `2abe26d`, 142 LOC)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md` (master plan §2 Phase 5)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/superpowers/plans/2026-05-03-iter-31-ralph-iter-8-to-20-make-plan.md` (iter 7 plan iter 8-20 §Phase 3)

## Next phase handoff (iter 11+ orchestrator)

- Phase 3 orchestrator commits ADR-035 + this completion msg (NO `--no-verify`, NO destructive ops)
- Andrea ratify queue iter 11 entrance: ADR-035 PROPOSED → ACCEPTED gates V2.1 canary 5% bench
- Andrea env provision iter 11+: SUPABASE_SERVICE_ROLE_KEY + VOYAGE_API_KEY (~5min)
- Iter 11 P0: R5 V1 baseline re-bench MANDATORY (per ADR §6 gate #1) — if 0/8 BROKEN persists, bisect env flags before V2.1 canary
- Iter 11+ V2.1 canary 5% deploy gated Andrea ratify + R5 V1 PASS + decision matrix §5 evaluate
