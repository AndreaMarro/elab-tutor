# A4 Onniscenza V2 — LIVE PROD smoke verified (canary v2)

**Date**: 2026-05-01 ~20:30 CEST
**Edge Function**: unlim-chat **v61** ACTIVE (deployed post V2 impl)
**Env**: `ONNISCENZA_VERSION=v2` LIVE canary
**Commit**: `027d04f` pushed origin/e2e-bypass-preview

## Smoke result
- prompt: "Spiegate ai ragazzi come funziona un partitore di tensione con due resistori"
- source: `flash` (LLM path, V2 cross-attention scoring active)
- words: 55 (<150 cap)
- ✓ Ragazzi plurale
- ✓ analogia "slalom"
- ✓ linguaggio K-12 friendly
- ⚠️ Vol/pag citation absent (need R5 bench vs V1 baseline)

## Acceptance criteria

| Criterion | V1 baseline | V2 target | Status |
|-----------|-------------|-----------|--------|
| R5 PZ V3 score | 94.2% (iter 39) | +5pp ≥99% | ⏳ R5 bench iter 5+ |
| Vol/pag verbatim | smoke 100% template / variable LLM | ≥95% | ⏳ R5 bench |
| 8-chunk budget | uniform RRF k=60 | min/max per layer | ✓ impl shipped |
| Experiment-anchor boost | none | +0.15 if exp_id match | ✓ impl shipped |
| Kit-mention boost | none | +0.10 Morfismo Sense 2 | ✓ impl shipped |

## Ship status
- ✓ aggregateOnniscenzaV2 in onniscenza-bridge.ts (~180 LOC NEW)
- ✓ unlim-chat env flag ONNISCENZA_VERSION='v2'
- ✓ Edge Function v61 deploy + secrets canary v2
- ✓ vitest 13474 PASS preserved
- ⏳ R5 50-prompt bench V2 vs V1 deferred iter 5+

## NO COMPIACENZA
- V2 LIVE prod canary mode (NOT all sessions, hash bucket would gate)
- Vol/pag absence on smoke = NEED BENCH (single anecdote insufficient)
- ADR-033 acceptance criteria NOT all met inline (R5 bench required)

