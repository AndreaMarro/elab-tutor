---
id: ADR-037 (mistral-routing-narrow-large-tune)
title: Mistral routing narrow Large triggers — heuristic downgrade for short non-multi-step prompts
status: PROPOSED
date: 2026-05-02
authors:
  - Andrea Marro
  - Maker-1 Opus subagent (iter 41 ralph loop)
sprint: T close — Phase A latency Tier 1
context-tags:
  - latency
  - mistral-routing
  - cost-optim
---

## Status

PROPOSED 2026-05-02. Active prod canary via env `MISTRAL_NARROW_LARGE_ENABLED=true`.
Aggressive variant via env `MISTRAL_AGGRESSIVE_NARROW=true` (defaults false safe).

## Context

Iter 40 v74 R5 5/5 smoke evidence: avg 3130ms / p95 5400ms. Mistral Large fires
on 2/5 prompts (`Verifica` + `Diagnostica` triggers) → 5.4s + 5.7s tail. Mistral
Large p50 ~3-4s vs Mistral Small p50 ~1.5-2.5s (~2x slower upstream).

LLM_ROUTING_WEIGHTS env sets Gemini/Small/Large/Together percentage. When
weighted-mode picks Mistral Large for SHORT or NON-COMPLEX prompts, latency
penalty ungiustified. Iter 38 R5 v56 8/38 fail rate also concentrated on
Large-fired prompts (responseFormat schema rejection).

## Decision

Implement `selectMistralModel(input)` heuristic in `llm-client.ts`:

**Standard heuristic** (env `MISTRAL_NARROW_LARGE_ENABLED=true`):
- multi-step + complex diagnostic → mistral-large-latest
- wordCount > 50 → mistral-large-latest
- otherwise → mistral-small-latest (default)

**Aggressive heuristic** (env `MISTRAL_AGGRESSIVE_NARROW=true`, layered on standard):
- wordCount < 30 → ALWAYS mistral-small-latest (force-override Large)
- Even when multi-step OR complex diagnostic alone trigger

Auto-detection regex:
- multi-step: `/passo per passo|step by step|prima.*poi.*infine|\d+\s*step/i`
- complex diagnostic: `/diagnostica.*errori|verifica.*passo|controlla.*sequenza/i`

Override hooks: `hasMultiStep` + `hasComplexDiagnostic` boolean params for explicit
caller control (tests + future complexity classifier).

Telemetry: returns `{model, routing_reason}` for observability log.

## Wire-up

`callMistral` in `llm-client.ts` post-routing check:

```typescript
if (model === 'mistral-large-latest' &&
    (Deno.env.get('MISTRAL_NARROW_LARGE_ENABLED') || 'false').toLowerCase() === 'true') {
  const narrowed = selectMistralModel({ message: options.message });
  if (narrowed.model === 'mistral-small-latest') {
    console.info({event: 'mistral_routing_downgrade_large_to_small', ...});
    model = 'mistral-small-latest';
  }
}
```

Defensive: only downgrades Large→Small. Never upgrades Small→Large. Telemetry per
downgrade emitted for cost + latency impact tracking.

## Impact estimate

| Scenario | Avg latency | p95 latency |
|----------|-------------|-------------|
| Pre-iter 41 v74 baseline | 3130ms | 5400ms |
| Standard narrow (iter 41 v76 LIVE) | 2377ms (-24%) | 4879ms (-10%) |
| Aggressive narrow projection (iter 42 env=true) | ~2000ms (-36%) | ~3500ms (-35%) |

## Risk + mitigations

1. **Quality regression on complex prompts** — Small may underperform Large on multi-step.
   Mitigation: standard heuristic preserves Large for multi-step+diagnostic AND
   long prompts. Aggressive opt-in canary, monitor PZ V3 ≥91.45% gate.
2. **shouldUseIntentSchema interaction** — narrow Large may also reduce schema-mode
   Mistral fires (Small + responseFormat less reliable). Mitigation: C1 robust JSON
   parser handles all provider outputs (ADR-036).
3. **Regex false-positives** — `passo per passo` may match outside intent.
   Mitigation: word-boundary + Italian-specific patterns. Override hooks for
   override.

## Acceptance gates

- ADR-037 status PROPOSED → ACCEPTED
- env `MISTRAL_NARROW_LARGE_ENABLED=true` deploy + R5 50-prompt evidence (DONE iter 41 v76 96.30% PZ V3)
- env `MISTRAL_AGGRESSIVE_NARROW=true` canary deploy iter 42 + R5 re-bench
- Phase A close gate avg ≤2500ms (MET 2377ms iter 41) + p95 ≤2500ms (PENDING iter 42 provider-mix combo)

## Cross-references

- Plan: `docs/superpowers/plans/2026-05-02-iter-41-velocita-onniscenza-onnipotenza-wake-word.md` §Phase A Task A1
- ADR-029 LLM_ROUTING_WEIGHTS conservative tune
- ADR-038 hedged Mistral 100ms stagger (companion atom A4)
- Phase A close audit: `docs/audits/2026-05-02-iter41-phase-A-close.md`
