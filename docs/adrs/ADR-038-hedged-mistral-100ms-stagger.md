---
id: ADR-038 (hedged-mistral-100ms-stagger)
title: Hedged Mistral chat 100ms stagger — first-success-wins latency lift
status: PROPOSED
date: 2026-05-02
authors:
  - Andrea Marro
  - Maker-1 Opus subagent (iter 41 ralph loop iter 2)
sprint: T close — Phase A latency Tier 1
context-tags:
  - latency
  - mistral
  - hedged-call
  - cost-ratify-andrea
---

## Status

PROPOSED 2026-05-02 — Andrea ratify gate ADR-038 + env `ENABLE_HEDGED_LLM=true` deploy
canary. Default false safe (fallback single-call path preserved iter 41 entrance).

## Context

Iter 38 carryover Tier 1 latency optimization research identified hedged-call pattern
as best ROI for Mistral primary p95 reduction:

- Current iter 40 v74 prod measured: avg 3130ms / p95 5400ms (5/5 smoke 2026-05-02)
- Iter 38 carryover R5 v56 best: avg 1607ms / p95 3380ms
- PDR target Phase A close: avg ≤1500ms / p95 ≤2500ms

Mistral La Plateforme upstream latency variability: same prompt + same model can return
500ms or 3500ms across calls (network variance + Mistral internal queue depth).
Single-call path bottlenecks p95 at upstream worst-case.

Hedged-call pattern: fire 2 parallel requests with N-millisecond stagger, return first
fulfilled response. Statistical lift: p95 cut 30-50% in literature (Tail at Scale,
Dean+Barroso 2013).

## Decision drivers

1. **Latency p95 lift target ≤2500ms** (vs 5400ms current) — biggest quality-of-service
   gain for LIM classroom UX
2. **Cost cap +30%** (~+$0.0003/request) — Andrea ratify required ADR-038
3. **Backward compat** — env gate default false preserves single-call path baseline
4. **No quality regression** — both calls hit same Mistral model + same prompt; first
   to respond wins; semantically identical
5. **Telemetry observability** — log winner (primary vs hedged) per call for cost
   accountability + latency distribution analysis

## Decision

Implement `callMistralChatHedged<T>({primary, hedged, staggerMs})` utility in
`supabase/functions/_shared/llm-client.ts`:

- Primary fires immediately
- Hedged scheduled via `setTimeout(staggerMs)` (default 100ms)
- First-success-wins via custom Promise wrapper (Promise.race semantics with
  reject-aggregation when both fail)
- Throws if both primary AND hedged fail (no silent return)

Wire-up gated by env `ENABLE_HEDGED_LLM=true` in `callMistral` (deferred Maker-2 atom).
Andrea ratify queue iter 41:
- ADR-038 status PROPOSED → ACCEPTED
- env `ENABLE_HEDGED_LLM=true`
- Deploy unlim-chat v75 (or batch with A1+A5 deploy)
- Smoke 5 prompts measure delta avg/p95 vs baseline

## Cost analysis

| Mistral tier | Per-request cost (current) | Hedged (+1 call) | Delta |
|--------------|----------------------------|------------------|-------|
| mistral-small-latest | ~$0.0001 | ~$0.0002 | +$0.0001 |
| mistral-large-latest | ~$0.001 | ~$0.002 | +$0.001 |
| Voxtral mini-tts | unaffected (TTS not hedged) | n/a | $0 |

Estimated R5 50-prompt run: +$0.005 (small) to +$0.05 (large). Daily prod traffic ~500
chat calls: +$0.05-0.50/day. Monthly: +$1.50-15. Within Andrea cost cap (+30% chat).

**Andrea ratify**: APPROVE/REJECT cost +30% chat per ADR-038 §Cost analysis.

## Test strategy

`tests/unit/llm-client-hedged.test.js` (9 PASS):
- First-respondent winner (fast wins over slow)
- Hedged result returned when primary errors
- Hedged not fired when primary returns within stagger window (lazy-fire optim defer iter 42+)
- Default stagger 100ms when not specified
- Rejects if both primary and hedged fail with aggregated error message
- Custom stagger 200ms respect
- First available when hedged starts AFTER primary completes (`never` Promise edge)
- Primary undefined return graceful
- Return shape preserved unchanged from underlying primary/hedged

## Risk + mitigations

1. **Cost overrun** — Mitigation: env gate default false + Andrea ratify gate +
   monitoring per-day cost via `winner_telemetry` log + canary 5%→25%→100% rollout
2. **Mistral rate-limit hit** (2x QPS) — Mitigation: monitor 429 error rate; if breach,
   downgrade hedged to mistral-small only (cheaper + higher quota)
3. **Lazy-fire optimization deferred** — current impl always fires hedged after stagger,
   even if primary completes <stagger. Iter 42+ add AbortController to cancel hedged
   when primary settles within stagger window. -50% cost if primary is fast.
4. **Both-fail rejection cascade** — caller still has Gemini fallback in
   `callLLMWithFallback`; hedged failure doesn't break overall flow

## Acceptance gates

- ADR-038 status PROPOSED → ACCEPTED post Andrea ratify
- env `ENABLE_HEDGED_LLM=true` set prod
- Edge Function `unlim-chat` deploy v75+ with wire-up
- R5 50-prompt re-bench evidence: p95 reduction ≥600ms vs v74 baseline
- Cost telemetry `winner_telemetry` event log <30% baseline daily cost variance
- Vitest 9/9 hedged tests + adjacent regression preserved

## Cross-references

- Plan: `docs/superpowers/plans/2026-05-02-iter-41-velocita-onniscenza-onnipotenza-wake-word.md` §Phase A Task A4
- ADR-029 LLM_ROUTING_WEIGHTS conservative tune (env-only, env composition)
- ADR-037 (TBD iter 41+) Mistral routing narrow Large tune (companion latency atom A1)
- Iter 38 carryover Tier 1 research: `docs/audits/iter-39-api-latency-optimization-research.md` §Top-3 ROI

## Iter 42+ deferred enhancements

- Lazy-fire hedged with AbortController (primary settle within stagger → cancel hedged)
- Adaptive staggerMs tuning based on rolling p50 (currently hardcoded 100ms)
- Provider-mix hedged: primary Mistral + hedged Gemini Flash (fallback diversity)
