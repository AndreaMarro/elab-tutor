# Debugger iter 31 ralph 27 — completion message

**From**: systematic-debugging-investigator iter 31 ralph 27
**To**: orchestrator iter 31 ralph 27
**Date**: 2026-05-03
**Status**: COMPLETED (read-only investigation)

## Deliverable

- `docs/audits/2026-05-03-iter-31-ralph27-r5-latency-regression-rca.md` (222 LOC, 8 sezioni)

## Verdict per hypothesis

| # | Hypothesis | Verdict | Confidence |
|---|------------|---------|------------|
| H1 | Edge Function v72→v73+ deploy churn | CONFIRMED (partial) | 70% Medium-High |
| H2 | Onniscenza V1 7-layer aggregator | INDETERMINATE | 35% Low |
| H3 | RAG retrieval (Voyage page=0%) | FALSIFIED | 85% High |
| H4 | Mistral provider variability | INDETERMINATE | 50% Medium |
| H5 | Test env / time-of-day | INDETERMINATE | 40% Medium |
| H6 | Together AI primary marker | INDETERMINATE | 30% Low-Medium |

## Most-likely root cause

H1 + H4 + H5 combined: 66-commit deploy churn (+2635 LOC, 8+ NEW shared modules cold-start parse cost) interacting with normal Mistral upstream variability + cold-isolate post auth-fail retry.

NO single confirmed root cause. The +22.8% avg may be measurement artifact: iter 38 baseline = partial 30/38 (8 fail) vs iter 11 = full 50/50 — invalid avg comparison.

## Recommended fix iter 28+ (priority ordered)

1. P0 Re-bench N=3 with warm-isolate + verify env vars (1h)
2. P1 Module preload audit defer imports inside conditional branches (2h)
3. P2 Bench runner upgrade per-prompt TTFB breakdown + warmup phase (3h)
4. P3 Probe `npx supabase secrets list` LLM_PROVIDER + LLM_ROUTING_WEIGHTS (30min)
5. P4 Defer V2.1 canary NOT blocked by avg regression (gate is p95 ≤ 4000ms ADR-035 §6)

## CoV 3-step

- CoV-1: baseline 13474 PASS (`automa/baseline-tests.txt` authoritative file source per CLAUDE.md). BG vitest runs silent buffer.
- CoV-2: read-only, ZERO src edits.
- CoV-3: 13474 PASS preserved by construction.

## Anti-pattern compliance

- NO claim "fix shipped" senza code change (read-only)
- NO src modify
- NO --no-verify
- NO destructive
- NO compiacenza (3/6 INDETERMINATE explicit + 8 caveats §6)
- NO write outside docs/audits/ + automa/team-state/messages/

## Honesty caveats critical

8 caveats §6 audit: no supabase secrets probe, no N=3 re-bench, no per-prompt TTFB, iter 38 baseline partial 30/38, no diff line-by-line walk, no Onniscenza cache hit-rate, no load test, BG vitest silent.

## Files

- Audit: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/audits/2026-05-03-iter-31-ralph27-r5-latency-regression-rca.md`
- Bench evidence iter 11 ralph: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/scripts/bench/output/r5-stress-report-2026-05-03T07-02-19-323Z.md`
- Bench evidence iter 38 carryover: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/scripts/bench/output/r5-stress-report-2026-05-01T07-43-04-636Z.md`
- ralph 11 audit: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/audits/2026-05-03-iter-31-ralph11-R5-V1-baseline-rebench.md`
- Edge Function impl: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/supabase/functions/unlim-chat/index.ts` + `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/supabase/functions/_shared/onniscenza-bridge.ts` + `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/supabase/functions/_shared/llm-client.ts`
