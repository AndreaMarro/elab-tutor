# ADR-033 — Onniscenza V2 Cross-Attention 8-Chunk Budget

**Status**: PROPOSED (Andrea ratify queue iter 40+)
**Date**: 2026-05-01
**Sprint**: T iter 39 ralph (atom A4)
**Depends on**: ADR-023 (Onniscenza 7-layer aggregator), iter 31 wire-up `aggregateOnniscenza` opt-in `ENABLE_ONNISCENZA=true`

## Context

Onniscenza V1 (iter 24+, fully wired iter 31) aggregates 7 layers of context (RAG + Wiki + Glossario + Class memory + Lesson active + Chat history + Analogia) into the LLM system prompt. V1 fetches all layers in parallel and concatenates with hardcoded budget allocation — but doesn't differentiate **relevance per layer per query**.

Iter 37 R5 measurement showed `plurale_ragazzi: 100%` and `citation_vol_pag: 100%` PASS, but iter 38 R7 canonical INTENT extraction stuck at 12.5% — weakness in **how Onniscenza chunks rank-fuse against current user message**. Cross-attention scoring per layer (relevance to user message + experimentId) closes this gap.

## Decision

Implement `aggregateOnniscenzaV2(input)` in `supabase/functions/_shared/onniscenza-bridge.ts` with:

### Cross-attention scoring

For each chunk retrieved across L1-L7 layers:
1. Compute **relevance score** = cosine similarity between chunk embedding (precomputed at ingest) AND user-message embedding (computed via Voyage `voyage-3` 1024-dim, cached per request).
2. Apply **layer-specific weight multiplier**:
   - L1 RAG dense: 1.0 (canonical)
   - L2 Wiki kebab-case: 0.85 (concept reinforcement, not narrative)
   - L3 Glossario: 0.75 (vocabulary enrichment)
   - L4 Class memory: 0.95 (continuity high)
   - L5 Lesson active: 0.90 (experiment-anchored)
   - L6 Chat history: 0.70 (recency bias not always relevant)
   - L7 Analogia: 0.65 (creative association, lower confidence)
3. Apply **experiment-anchor boost** +0.15 if chunk has `experiment_id === input.experiment_id`.
4. Apply **kit_mention boost** +0.10 if chunk text contains `breadboard|kit ELAB|componente fisico` (Morfismo Sense 2 kit grounding).

### Budget allocation 8 chunks total

Replace V1 hardcoded slot allocation with **dynamic budget driven by cross-attention scores**:

| Slot | Source layer (default) | Min | Max | Notes |
|------|----------------------|-----|-----|-------|
| 1-3  | L1 RAG               | 1   | 3   | always at least 1 RAG chunk for Vol/pag verbatim |
| 4-5  | L2 Wiki              | 0   | 2   | concept reinforcement (skip if scores all <0.4) |
| 6    | L3 Glossario         | 0   | 1   | vocabulary anchor (skip if no glossary term in query) |
| 7    | L6 History           | 0   | 1   | recent context (skip if first message) |
| 8    | L7 Analogia          | 0   | 1   | creative analogy (skip for safety_warning prompts) |
| meta | L4+L5                | 0   | 0   | metadata-only injection to system prompt header (not chunk slot) |

**Reallocation rule**: if a slot is skipped (score below threshold OR layer empty), the slot moves to L1 RAG up to max=5 chunks, OR to L2 Wiki up to max=3 chunks.

### RRF k=60 layer-specific weights

V1 uses RRF k=60 uniform across layers. V2 tunes per layer:
- L1 RAG dense + L1 RAG sparse (BM25): k=60 (canonical)
- L2 Wiki: k=80 (lower weight — wiki is supplementary)
- L3 Glossario: k=100 (vocabulary chunks short, distance noisy)
- L6 History: k=40 (recency boost)

### Fast-path for chit_chat

`onniscenza-classifier.classifyPrompt(message)` per iter 37 returns `{category, skipOnniscenza, topK}`. V2 honors:
- `chit_chat` → return empty snapshot immediately (~5ms saved vs V1 ~500-1000ms aggregator overhead)
- `safety_warning` → top-3 forced (mandatory safety context)
- `citation_vol_pag` → top-2 RAG-focused (volume-anchored)
- `plurale_ragazzi` → top-2 (docente narrating, concise)
- `deep_question` → top-3 (full RRF context)
- `default` → top-3 (safer default)

## Implementation plan

### Files

- MODIFY `supabase/functions/_shared/onniscenza-bridge.ts` (~388 LOC → ~550 LOC)
  - NEW `aggregateOnniscenzaV2(input: OnniscenzaInput): Promise<OnniscenzaSnapshotV2>` function
  - NEW `crossAttentionScore(chunkEmbed, queryEmbed): number` cosine similarity helper
  - NEW `applyLayerWeights(rawScore, layer): number`
  - NEW `allocateBudget(scoredChunks, classification): SelectedChunk[]`
  - KEEP `aggregateOnniscenza` V1 as legacy fallback (env `ONNISCENZA_VERSION=v1` default)
- NEW `supabase/functions/_shared/onniscenza-bridge-v2.test.ts` (~30 unit tests TDD)
- MODIFY `supabase/functions/unlim-chat/index.ts` line ~355: gate V1 vs V2 via `ONNISCENZA_VERSION=v2` env
- NEW `docs/adrs/ADR-033-onniscenza-v2-cross-attention-budget.md` (THIS FILE)

### Acceptance criteria

- **R5 PZ V3 score**: V2 ≥ V1 (no regression)
- **R5 Vol/pag verbatim**: ≥95% (current V1 R5 v56 100% → V2 must maintain)
- **R7 canonical INTENT extraction**: ≥80% post Mistral function calling re-deploy (current V1 R7 v56 12.5%)
- **Latency**: V2 p95 ≤ V1 p95 +100ms (cross-attention compute budget)
- **Tests**: 30 unit tests TDD PASS + 8 R6 integration tests PASS

### Canary rollout

- Stage 1 — `ONNISCENZA_VERSION=v2` env opt-in 5% sessions (hash bucket)
- Stage 2 — 25% post Stage 1 telemetry verify (PZ V3 + R7 score lift confirmed)
- Stage 3 — 100% post 24-48h soak + Andrea Opus indipendente review G45

## Consequences

### Positive

- **Quality lift**: cross-attention selects *relevant* context per query, not generic top-K dump
- **R7 lift projected**: 12.5% → ≥80% post-deploy (Mistral function calling finds canonical intents better with focused context)
- **Latency-aware**: chit_chat fast-path skip saves 500-1000ms p95
- **Box 11 ceiling**: 0.85 → 0.95 conditional 100% rollout

### Negative

- **Complexity**: cross-attention compute budget adds ~50-100ms per request
- **Voyage embedding cost**: per-request query embedding (Voyage `voyage-3` ~$0.00006 per call) — affordable scale
- **Test surface**: 30 unit tests + 8 integration tests = 38 NEW tests (vitest 13474 + 38 = 13512+)

### Mitigations

- Voyage embedding cache (in-isolate LRU 5min TTL) reduces cost ~80% for repeated queries
- Defensive: V2 errors fall through to V1 (no regression risk during canary)
- Andrea Opus review G45 before Stage 3 100% rollout

## Rejected alternatives

- **Skip cross-attention, just expand budget V1 → 12 chunks**: REJECTED — context window pressure + LLM still confused by irrelevant chunks. Quality > quantity.
- **Replace V1 entirely without canary**: REJECTED — anti-regressione FERREA (CLAUDE.md mandate). Canary direction matters.
- **Compute cross-attention CLIENT-side**: REJECTED — student browser context too constrained, server-side embed compute is the right place.

Andrea Marro — iter 39 ralph A4 — 2026-05-01
