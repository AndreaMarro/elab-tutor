# Tester-1 iter 31 ralph 11 — completion msg

**Date**: 2026-05-03 ~09:06 CEST
**Agent**: Tester-1 iter 31 ralph iter 11
**Task**: R5 V1 baseline re-bench Onniscenza V1 prod measurement (ADR-035 §4 fair comparison protocol)
**Git HEAD**: `ae4d24a`
**Status**: COMPLETED PASS

## Deliverables shipped

- `docs/audits/2026-05-03-iter-31-ralph11-R5-V1-baseline-rebench.md` (194 LOC, 9 sezioni)
- `scripts/bench/output/r5-stress-{report,responses,scores}-2026-05-03T07-02-19-323Z.{md,jsonl,json}` (3 file)
- `automa/team-state/messages/tester1-iter31-ralph11-completed.md` (this msg)

## Bench result summary

- **Verdict**: PASS (≥85% gate met)
- **Success rate**: 50/50 (100%)
- **PZ V3 overall**: 94.41% (vs iter 38 carryover 94.2%, +0.21pp)
- **Latency avg**: 1974ms (vs iter 38 1607ms, **+22.8% slower**)
- **Latency p50**: 1968ms
- **Latency p95**: 3611ms (vs iter 38 3380ms, +6.8% slower)

## Per-category PZ V3 PASS rate

- plurale_ragazzi: 8/10 (91.8% avg)
- citation_vol_pag: 10/10 (96.9%)
- sintesi_60_parole: 8/8 (97.0%)
- safety_warning: 6/6 (95.3%)
- off_topic_redirect: 6/6 (91.5%)
- deep_question: 9/10 (93.8%)

## Iter 38 carryover §1 caveat verification

R5 v56 21% failure rate iter 38 carryover **DOES NOT persist iter 11**: failure rate dropped to 6% (3/50). Per-category sintesi/safety/off_topic 100% PASS. Edge Function v72+ stabilized.

## CoV preserved

- CoV-1 vitest pre-bench: 13665 PASS (1 skip + 8 todo)
- CoV-3 vitest post-bench: 13665 PASS (1 skip + 8 todo)
- ZERO regression

## Acceptance gates ADR-035 §6 step 1 — all met

- ✓ 50/50 success
- ✓ PZ V3 94.41% ≥ 90% sanity
- ✓ Latency p95 3611ms ≤ 4000ms sanity ceiling

## Decision iter 12+ next

Per ADR-035 §5 decision matrix, V2.1 ramp gate ceilings established:
- RAMP 25% if V2.1: PZ V3 ≥ 94.41% AND p95 ≤ 3972ms AND anti_absurd <5%
- STAY 5% if V2.1: PZ V3 ≥ 93.91% AND p95 ≤ 3791ms AND anti_absurd <5%
- REVERT if V2.1: PZ V3 < 93.91% OR p95 > 3972ms OR anti_absurd ≥5%

## Caveat blocker iter 12+ Andrea sync action (5 min)

`~/.elab-credentials/sprint-s-tokens.env` ELAB_API_KEY field stale (`f673b9a0ba...`). Sync to `.env VITE_ELAB_API_KEY` rotated value (`0909e4b4...`). Initial bench attempt iter 11 HALTED 8/8 HTTP 401, recovered with manual override.

## Anti-pattern enforced

- NO claim "V2.1 LIVE"
- NO inflate score (raw measurements)
- NO modify Edge Function deploy
- NO write outside allowed paths
- NO --no-verify
- NO destructive ops
- NO commit (orchestrator Phase 3)
