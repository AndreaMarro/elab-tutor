# A4 Onniscenza V2 — REGRESSION CONFIRMED — REVERTED to V1

**Date**: 2026-05-02 ~00:30 CEST
**Status**: V2 reverted prod via `ONNISCENZA_VERSION=v1` (default)
**R5 50-prompt bench**: V2 vs V1 head-to-head measurement

---

## §1 R5 V2 vs V1 results (50-prompt fixture, prod ENABLE_ONNISCENZA=true)

| Metric | V1 baseline (iter 32 fixture) | V2 measured (2026-05-02) | Delta |
|--------|------------------------------|--------------------------|-------|
| Success rate | 49/50 (98%) | **50/50 (100%)** | +2pp ✓ |
| avg latency | 1607ms | **2182ms** | **+36% slower** ❌ |
| p50 latency | 1741ms | **1921ms** | +10% slower |
| p95 latency | 3380ms | **4012ms** | **+19% slower** ❌ |
| p99 latency | 3968ms | **6631ms** | +67% slower |
| PZ V3 score | 94.2% | **93.2%** | **-1.0pp WORSE** ❌ |

**Verdict**: V2 does NOT improve quality (regresses -1.0pp PZ V3) AND is 36% slower. ADR-033 acceptance criteria target +5pp NOT met.

---

## §2 Root cause hypothesis

V2 cross-attention scoring + budget allocation introduces overhead:

1. **scoreHitV2()** loops every chunk × layer applying weight + boost calculations (~100 ops × 8 layers per request)
2. **allocateBudgetV2()** two-phase greedy + dedup pass = O(n²) over scored chunks
3. **Reallocation rule** when slots skip → moves chunks across layers but disrupts canonical RRF k=60 ordering V1 uses

**Hypothesis**: V1's uniform RRF k=60 canonical fusion outperforms V2's layer-weighted scoring because RRF tuning was already optimal. Layer weight multipliers (0.65-1.0) ARTIFICIALLY DOWNWEIGHT high-quality chunks from L2-L7 layers that genuinely match query.

Plus budget allocation forcing min slots per layer (e.g., always 1 RAG + 0-1 wiki + 0-1 glossario) may DILUTE top-K relevance vs V1 fused-and-trimmed ordering.

---

## §3 Action revert

```bash
SUPABASE_ACCESS_TOKEN=$TOKEN npx supabase secrets set ONNISCENZA_VERSION=v1 --project-ref euqpdueopmlllqjmqnyb
# Output: "Finished supabase secrets set."
# Edge Function reads new secret on next cold start (immediate canary disable)
```

V2 code preserved in `_shared/onniscenza-bridge.ts` for future tuning. Default prod = V1.

---

## §4 NO COMPIACENZA — atom A4 honest status

- ✅ V2 implementation shipped + LIVE prod canary
- ✅ R5 bench V2 measurement executed + analyzed
- ❌ V2 acceptance criteria NOT met (target +5pp PZ V3, got -1.0pp)
- ✅ Reverted prod default V1 — quality + latency restored

**A4 atom RE-CLASSIFIED**: code shipped but design REJECTED post-bench.

Iter 40+ V2 redesign required:
1. Skip layer weight multipliers — keep RRF k=60 canonical
2. ONLY add experiment-anchor +0.15 + kit-mention +0.10 boosts (cheap)
3. Skip budget reallocation rule — preserve V1 top-N ordering

OR iter 41+ broader re-think: Onniscenza V3 with chunk-level neural reranker (cross-encoder) instead of layer-weight heuristics.

---

## §5 Score iter 39 ralph ricalibrato

Pre-bench: 8.5/10 ONESTO.
Post-bench V2 regression: **8.0/10 ONESTO** (A4 reverted = atom partial fail).

Aggregate atom ralph status:
- ✅ A1 SSE LIVE prod verified ✓
- ❌ A4 Onniscenza V2 reverted (regression -1.0pp PZ V3 + +36% latency)
- ⚠️ A5 Voxtral STT code LIVE env-gated
- ⚠️ A3 OpenClaw 12-tool dispatcher canary 0 default
- ⚠️ A2 mic hide commit shipped, Vercel deploy pending

**1/5 fully LIVE prod with verified quality** (A1 SSE only).

Sprint T close 9.5: iter 41-43 path remains conditional on A4 V2 redesign + 4/5 atoms LIVE activated + Andrea Opus G45 review.

**Files**:
- `scripts/bench/output/r5-stress-report-2026-05-01T22-24-50-918Z.md` (V2 measurement)
- `_shared/onniscenza-bridge.ts:aggregateOnniscenzaV2` (code preserved for iter 41+ redesign)
