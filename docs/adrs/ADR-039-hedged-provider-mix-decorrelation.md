---
id: ADR-039 (hedged-provider-mix-decorrelation)
title: Provider-mix hedged Mistral primary + Gemini Flash hedged — decorrelate upstream tail
status: PROPOSED
date: 2026-05-02
authors:
  - Andrea Marro
  - Maker-1 Opus subagent (iter 41 ralph loop iter 11)
sprint: T close — Phase A latency Tier 1 enhancement
context-tags:
  - latency
  - hedged-call
  - provider-mix
  - tail-decorrelation
amends: ADR-038 (hedged-mistral-100ms-stagger)
---

## Status

PROPOSED 2026-05-02. Active prod canary via env `ENABLE_HEDGED_PROVIDER_MIX=true`
ON TOP OF `ENABLE_HEDGED_LLM=true`. Default false safe.

## Context

Iter 41 v76 R5 50-prompt evidence (commit `8318ceb` audit):
- avg 2377ms ✅ MET ≤2500ms
- p95 4879ms ❌ FAIL ≤2500ms target

Root cause p95 elevated: ADR-038 hedged design fires 2 parallel **Mistral** calls
100ms stagger. When Mistral upstream queue depth high OR network correlated, BOTH
calls hit slow tail. Single-provider hedged cannot decorrelate upstream variance.

User mandate iter 41: "massima velocità ... no risposte assurde". Velocity gate
p95 ≤2500ms not achievable Mistral-only hedged.

## Decision drivers

1. **Tail decorrelation** — different upstream provider, different network path,
   different queue depth → independent latency distribution
2. **Cost-neutral or reduce** — Gemini Flash-Lite cheaper than Mistral Small
3. **Quality preservation** — Gemini Flash-Lite p50 typically 1.5-2s observed prod
4. **Backward compat** — env-gated layered on top of ADR-038

## Decision

Implement provider-mix hedged via env `ENABLE_HEDGED_PROVIDER_MIX=true`:

**Behavior matrix**:

| `ENABLE_HEDGED_LLM` | `ENABLE_HEDGED_PROVIDER_MIX` | Behavior |
|---------------------|------------------------------|----------|
| false | (any) | Single Mistral call (default safe) |
| true | false | 2x Mistral hedged (ADR-038 iter 41 baseline) |
| true | **true** | **Mistral primary + Gemini Flash-Lite hedged** (this ADR) |

Wire-up `callMistral` in `llm-client.ts`:

```typescript
const callHedged = hedgedProviderMix
  ? async () => {
      const g = await callGemini({ ...options, model: 'gemini-2.5-flash-lite' });
      return { text: g.text, latencyMs: g.latencyMs ?? 0, tokensUsed: g.tokensUsed };
    }
  : callMistralOnce;

const r = hedgedEnabled
  ? await callMistralChatHedged({ primary: callMistralOnce, hedged: callHedged, staggerMs: 100 })
  : await callMistralChat({ ... });
```

## Impact estimate

R5 50-prompt v76 iter 41:
- avg 2377ms / p95 4879ms / PZ V3 96.30% / 50/50 success

Provider-mix projection iter 42 env=true:
- avg ~1800-2200ms (-15-25%)
- **p95 ~2200-2800ms (-43-55%)** — likely Phase A close gate met or near
- PZ V3 maintained ≥91.45% (Gemini K-12 Italian comparable Mistral Small)
- Cost neutral or -20% (Gemini Flash-Lite cheaper Mistral Small)

## Risk + mitigations

1. **responseFormat ignored by Gemini** — when `useIntentSchema=true` (Mistral schema
   mode) and Gemini hedged wins race, Gemini returns plain text without intents
   structured output. Result: ~50% chance no intents extracted when schema-mode
   prompts use provider-mix. Mitigation: defer C3 widened canary to iter 42+ AFTER
   provider-mix soak. Iter 42 schema-mode + hedged-mix interaction monitor required
   before enabling both simultaneously.
2. **Provider hardcoded telemetry** — `callMistral` returns `provider: 'mistral'`
   even when Gemini wins race. Observability bug: telemetry distribution of winners
   may attribute Gemini wins to Mistral. Mitigation: ADR-039 §iter 42+ amend wraps
   result with actual provider field per winner detection.
3. **Quality drift Gemini K-12 Italian** — Gemini Flash-Lite quality on Italian
   K-12 prompts not benchmarked extensively vs Mistral Small. Mitigation: R5
   re-bench post-deploy verifies PZ V3 ≥91.45% gate. If drift detected, env=false
   instant rollback.
4. **Cost split unclear** — provider-mix may save (Gemini cheaper) or add (both
   fire, sum). Mitigation: telemetry `mistral_hedged_winner` event tracks ratio.

## Acceptance gates

- ADR-039 status PROPOSED → ACCEPTED
- env `ENABLE_HEDGED_PROVIDER_MIX=true` deploy
- R5 50-prompt re-bench post-deploy: p95 ≤2500ms target Phase A FULL CLOSE
- PZ V3 ≥91.45% maintained (NO regression)
- Cost telemetry `mistral_hedged_winner` distribution measured 100-prompt window
- Phase A audit close iter 42 con evidence

## Iter 42+ deferred enhancements

- Lazy-fire hedged with AbortController (cost -50% if primary fast under stagger)
- Provider field per actual winner (telemetry accuracy)
- Adaptive staggerMs tuning based on rolling p50
- Schema-mode + hedged-mix conditional gate (skip provider-mix when useIntentSchema=true)
- Multi-provider hedged: Mistral + Gemini + DeepSeek 3-way race for ultra-aggressive p95

## Cross-references

- Plan: `docs/superpowers/plans/2026-05-02-iter-41-velocita-onniscenza-onnipotenza-wake-word.md` §Phase A Task A4
- ADR-038 hedged Mistral 100ms stagger (this amend)
- Phase A close audit: `docs/audits/2026-05-02-iter41-phase-A-close.md` (3/4 gate MET, p95 FAIL)
- Tier 1 latency research: `docs/audits/iter-39-api-latency-optimization-research.md` §Top-3 ROI

## "Tail at scale" reference

Dean+Barroso 2013 — hedged requests cut p95 30-50% in literature. Provider-mix
extends to cross-provider decorrelation (different upstream entirely vs same
provider 2-instance hedged).
