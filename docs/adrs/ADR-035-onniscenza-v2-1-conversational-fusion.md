---
id: ADR-035 (onniscenza-v2-1-conversational-fusion)
title: Onniscenza V2.1 — RRF k=60 + 4 weighted boost factors (conversation-grounded)
status: PROPOSED
date: 2026-05-02
authors:
  - Andrea Marro
  - Architect Opus subagent (iter 41 ralph loop iter 3)
sprint: T close — Phase B Onniscenza supreme conversational
context-tags:
  - onniscenza
  - rag-fusion
  - conversation-history
  - hallucination-prevention
  - morfismo-sense-1-5
supersedes: ADR-033 onniscenza-v2-cross-attention-budget (REVERTED iter 39 V1 active prod)
---

## Status

PROPOSED 2026-05-02 — replaces V2 cross-attention design REJECTED iter 39 due
regression -1.0pp PZ V3 + 36% slower (bench `iter-39-A4-Onniscenza-V2-REGRESSION-revert.md`,
commit `02b5c03`). V2.1 minimal-risk path preserves V1 RRF k=60 base + adds 4
weighted boost factors. Andrea ratify queue iter 41+.

## Context

Iter 39 V2 cross-attention attempt: layer multipliers + dense cross-attention
re-rank. Net effect: -1.0pp PZ V3 quality + 36% latency overhead. Reverted
via env `ONNISCENZA_VERSION=v1` rollback. V2 design archived ADR-033 (NOT V2.1).

V1 baseline (LIVE prod iter 31): RRF k=60 fusion across 7 layers (L1 RAG +
L2 Wiki + L3 Glossario merged + L4 Class memory + L5 Lesson + L6 Chat history +
L7 Analogia). Layer fetch parallelized 200ms timeout each. Quality: PZ V3 91.45%.
Hallucination rate: undocumented (Phase 0 baseline §11 anti-pattern flagged).

User mandate iter 41 (paste): "anche velocizzazzione interazione Ai api veloci
lavorare su suprema onniscenza mischiata a contesto conversazione (no risposte
assurde) massima velocità e onnipotenza totale".

Translation:
- Suprema onniscenza ≡ retrieve all relevant signals across 7 layers
- Mischiata a contesto conversazione ≡ fuse conversation history embed
- No risposte assurde ≡ hallucination guard <2%
- Massima velocità ≡ overhead ≤100ms vs V1
- Onnipotenza totale ≡ INTENT dispatcher fire-rate (handled separately Phase C)

## Decision drivers

1. **Latency-neutral or +<100ms** — V2 +36% latency rejected, V2.1 must lift quality without overhead
2. **Quality lift +0.5pp PZ V3** vs V1 baseline (target ≥91.95%)
3. **Hallucination <2%** manual review post canary 100%
4. **No breakage V1 baseline** — env gate default false, instant rollback
5. **Conversation continuity grounded** — retrieve ranking factors in recent dialogue context
6. **Morfismo Sense 1.5 anchored** — per-docente memoria + per-classe context boost factors

## Decision

Implement `aggregateOnniscenzaV21(opts)` in NEW
`supabase/functions/_shared/onniscenza-conversational-fusion.ts`. Preserves
RRF k=60 base from V1, adds 4 weighted boost factors applied per-chunk:

| Factor | Weight | Trigger condition |
|--------|--------|-------------------|
| **experiment-anchor** | +0.15 | `chunk.experimentId === query.experimentId` |
| **kit-mention** | +0.10 | `chunk.content` regex matches kit Omaric component (LED \| breadboard \| nano \| Arduino \| resistore \| condensatore \| MOSFET \| diodo \| pulsante \| potenziometro) |
| **recent-history** | +0.20 × cosineSim | Cosine similarity vs Voyage embed of last 10 conversation messages > 0.6 |
| **docente-stylistic** | +0.05 | Match docente memoria style preference (es. esperto Arduino → spunti avanzati boost; primo anno → analogie boost) |

**Cap total boost +0.50** to prevent runaway scoring. Reordered output sorted by
`finalScore = rrfScore + cappedBoost` descending.

## Architecture

```typescript
// supabase/functions/_shared/onniscenza-conversational-fusion.ts

import { embedConversationHistory } from './conversation-history-embed.ts';
import { cosineSimilarity } from './math.ts';

const KIT_OMARIC_REGEX = /\b(LED(?:\s+\w+)?|breadboard|arduino\s*nano|nano|resistore|condensatore|mosfet|diodo|pulsante|potenziometro|buzzer)\b/i;
const COSINE_THRESHOLD = 0.6;
const BOOST_CAP = 0.50;

export async function aggregateOnniscenzaV21(opts: {
  ragChunks: Array<{ id: string; score: number; content: string; experimentId?: string; metadata?: { embedding?: number[] } }>;
  query: string;
  experimentId?: string;
  conversationMessages?: Array<{ role: string; content: string }>;
  classKey?: string;
  docenteStyle?: { esperto?: boolean; primoAnno?: boolean };
}): Promise<Array<{ id: string; finalScore: number; boostBreakdown: Record<string, number> }>> {
  const historyEmbed = opts.conversationMessages?.length
    ? await embedConversationHistory(opts.conversationMessages)
    : null;

  return opts.ragChunks
    .map((chunk) => {
      const breakdown: Record<string, number> = { rrf_base: chunk.score };
      let boost = 0;

      // +0.15 experiment-anchor
      if (opts.experimentId && chunk.experimentId === opts.experimentId) {
        boost += 0.15;
        breakdown.experiment_anchor = 0.15;
      }

      // +0.10 kit-mention
      if (KIT_OMARIC_REGEX.test(chunk.content)) {
        boost += 0.10;
        breakdown.kit_mention = 0.10;
      }

      // +0.20 × cosineSim recent-history
      if (historyEmbed && chunk.metadata?.embedding) {
        const sim = cosineSimilarity(historyEmbed.vector, chunk.metadata.embedding);
        if (sim > COSINE_THRESHOLD) {
          const histBoost = 0.20 * sim;
          boost += histBoost;
          breakdown.recent_history = histBoost;
        }
      }

      // +0.05 docente-stylistic
      if (opts.docenteStyle?.esperto && /avanzato|approfondimento|bonus/i.test(chunk.content)) {
        boost += 0.05;
        breakdown.docente_stylistic = 0.05;
      } else if (opts.docenteStyle?.primoAnno && /analogia|come un|esempio semplice/i.test(chunk.content)) {
        boost += 0.05;
        breakdown.docente_stylistic = 0.05;
      }

      // Cap total
      boost = Math.min(boost, BOOST_CAP);
      breakdown.cap_applied = boost === BOOST_CAP ? 1 : 0;

      return {
        id: chunk.id,
        finalScore: chunk.score + boost,
        boostBreakdown: breakdown,
      };
    })
    .sort((a, b) => b.finalScore - a.finalScore);
}
```

## Phased rollout

**Phase A — standalone module** (this iter): Ship `onniscenza-conversational-fusion.ts`
+ `conversation-history-embed.ts` + tests. NOT wired into aggregateOnniscenza yet.

**Phase B — env gate canary 5%**: Wire into onniscenza-bridge.ts gated env
`ENABLE_ONNISCENZA_V21=true CANARY_ONNISCENZA_V21_PERCENT=5`. Default false safe.

**Phase C — soak 4-8h**: Monitor `onniscenza_v21_applied` telemetry events + R5
50-prompt re-bench + manual hallucination review 50 prompts.

**Phase D — canary 25% → 100%**: 24h soak each stage. Rollback if PZ V3 drops <91.45%
OR hallucination >2%.

## Test strategy

`tests/unit/onniscenza-conversational-fusion.test.js` (30+ tests target):

- experiment-anchor +0.15 boost when experimentId matches
- kit-mention +0.10 boost when chunk content has Omaric component
- recent-history +0.20 × cosineSim when history embed similar
- docente-stylistic +0.05 esperto/primoAnno branches
- Cap total boost at +0.50 prevent runaway
- Preserve RRF k=60 base for chunks without boost factors
- Sort descending by finalScore
- Empty conversationMessages skips history boost
- Missing chunk.metadata.embedding skips history boost
- Returns same shape as V1 (id + score)

Hallucination guard test (manual 50-prompt review post canary 100%):
- 50 diverse prompts (10 deep + 10 sintesi + 10 safety + 10 plurale + 10 citation)
- Check NER component refs vs RAG chunk content (anti-absurd-validator B4 task)
- Check Vol/pag citation matches RAG metadata page (post Voyage re-ingest E)

## Risk + mitigations

1. **V2 regression repeat** — V2 layer multipliers caused -1.0pp PZ V3. Mitigation:
   V2.1 keeps RRF k=60 base UNCHANGED, only adds boosts. Boosts capped +0.50.
   Canary 5%→25%→100% with rollback gate.
2. **Latency overhead from history embed** — Voyage embed call adds ~100ms.
   Mitigation: cache history embed per session (5min TTL similar to onniscenza-cache),
   skip if conversationMessages empty.
3. **Boost gaming by adversarial prompts** — kit-mention regex could be triggered by
   off-topic user input. Mitigation: regex strict + cap +0.10 small contribution.
4. **Docente memoria cold-start** — first session no docente style data. Mitigation:
   `docenteStyle` optional param, skip stylistic boost when undefined.

## Acceptance gates

- ADR-035 status PROPOSED → ACCEPTED post Andrea ratify
- `onniscenza-conversational-fusion.ts` shipped + 30+ tests PASS
- `conversation-history-embed.ts` shipped (Voyage embed wrapper Task B2)
- Env `ENABLE_ONNISCENZA_V21=true CANARY_ONNISCENZA_V21_PERCENT=5` deploy + soak 4h
- R5 50-prompt re-bench PZ V3 ≥91.45% maintained
- Hallucination manual review <2%
- Latency overhead ≤100ms vs V1
- Canary 100% post 24h soak green

## Cross-references

- Plan: `docs/superpowers/plans/2026-05-02-iter-41-velocita-onniscenza-onnipotenza-wake-word.md` §Phase B Task B1
- ADR-033 onniscenza-v2-cross-attention-budget (REJECTED iter 39, retained historical)
- Iter 39 V2 regression bench: `iter-39-A4-Onniscenza-V2-REGRESSION-revert.md`
- Iter 31 V1 LIVE prod (commit Onniscenza wired): CLAUDE.md sprint history "Sprint T iter 31-32 close"
- ADR-021 RAG coverage redefine (page metadata gap)

## Iter 42+ deferred enhancements

- Adaptive boost weights tuning per-class (rolling A/B test)
- L7 Analogia graph integration as 5th boost factor (concept-graph.json link)
- Stylistic memoria persistence schema (Sense 1.5 docente memoria runtime)
- Multi-turn dialogue grounding deeper than last 10 messages (full-session embed)
