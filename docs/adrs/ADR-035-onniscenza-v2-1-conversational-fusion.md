---
id: ADR-035 (onniscenza-v2-1-conversational-fusion-fair-comparison-protocol)
title: Onniscenza V2.1 — Conversational fusion fair comparison protocol vs V1 baseline
status: PROPOSED (Andrea ratify queue iter 11+ — design only iter 10, bench gated)
date: 2026-05-03
authors:
  - Andrea Marro
  - Architect Opus iter 31 ralph iter 10 (subagent context-zero baseline G45 Opus iter 39)
sprint: T close — iter 31 ralph iter 10 (Phase 3 plan iter 10-11 from `docs/superpowers/plans/2026-05-03-iter-31-ralph-iter-8-to-20-make-plan.md`)
context-tags:
  - onniscenza
  - conversational-fusion
  - rrf-k60
  - canary-bench-protocol
  - anti-inflation-g45
  - v1-baseline-protected
supersedes: ADR-033 onniscenza-v2-cross-attention-budget (REVERTED iter 39 V1 active prod)
extends: previous ADR-035 design (iter 41 ralph iter 3) — replaces with fair comparison protocol structure
---

## Status

PROPOSED 2026-05-03 — design only iter 10. Bench gated Andrea iter 11+ ratify
+ env provision (SUPABASE_SERVICE_ROLE_KEY + VOYAGE_API_KEY required for re-bench
runner R5 + R6). NO override `ONNISCENZA_VERSION=v1` env in production until V2.1
canary 5% bench PASS + Andrea explicit ratify.

V2.1 implementation `aggregateOnniscenzaV21` already shipped iter 41 commit
`2abe26d` per master plan §2 Phase 5 Atom 5.1.2 cross-ref (file:
`supabase/functions/_shared/onniscenza-conversational-fusion.ts`, 142 LOC).
This ADR formalizes the **fair comparison protocol** that gates ramp/revert
decisions, not the implementation itself.

---

## §1 Context

### V1 baseline (LIVE prod, `ONNISCENZA_VERSION=v1` env iter 39)

- 7-layer aggregator `aggregateOnniscenza` in `supabase/functions/_shared/onniscenza-bridge.ts:299`
- Pre-LLM classifier `onniscenza-classifier.ts` 6 categorie iter 37 wired prod (chit_chat / safety_warning / citation_vol_pag / plurale_ragazzi / deep_question / default → topK 0 / 3 / 2 / 2 / 3 / 3)
- RRF k=60 canonical fusion across L1-L7 (RAG + Wiki + Glossario + Class memory + Lesson + Chat history + Analogia)
- Layer fetch parallelized via `Promise.all` 200ms timeout each (iter 38 carryover Tier 1 T1.3 design)
- Cron warmup HEAD ping 30s (iter 38 A5 SQL `20260430220000_unlim_chat_warmup_cron.sql` applied iter 38 carryover)
- Last documented quality measurement: PZ V3 **94.2%** / R5 50-prompt 1607ms avg / p95 3380ms (iter 38 carryover commit `792acf8`, bench `r5-stress-report-2026-05-01T07-43-04-636Z.md`)
- Classifier-driven topK reduces aggregator cost on chit_chat (~30% of fixture)

### V2 cross-attention REJECTED + REVERTED iter 39 (commit `eb4a11b` LIVE → `02b5c03` REVERTED)

Per `docs/audits/iter-39-A4-Onniscenza-V2-REGRESSION-revert.md` §1:

| Metric | V1 baseline | V2 measured | Delta |
|--------|-------------|-------------|-------|
| Success rate | 49/50 (98%) | 50/50 (100%) | +2pp |
| avg latency | 1607ms | **2182ms** | **+36% slower** |
| p95 latency | 3380ms | **4012ms** | +19% slower |
| PZ V3 score | 94.2% | **93.2%** | **-1.0pp WORSE** |

Root cause hypothesis (audit §2): V2 layer-weighted scoring + budget
reallocation **disrupts canonical RRF k=60 ordering** (V1's uniform fusion
already optimal). Layer weight multipliers 0.65-1.0 ARTIFICIALLY DOWNWEIGHT
high-quality chunks from L2-L7 layers that genuinely match query.

V2 reverted via `SUPABASE_ACCESS_TOKEN=$TOKEN npx supabase secrets set
ONNISCENZA_VERSION=v1 --project-ref euqpdueopmlllqjmqnyb`. V2 code preserved in
`onniscenza-bridge.ts:608` for archival (NOT for re-attempt).

### V2.1 hypothesis (this ADR)

V2.1 = **minimal-risk conversational fusion**:
- Preserve V1 RRF k=60 canonical fusion **UNCHANGED** (do NOT repeat V2 mistake of replacing baseline ordering)
- Add 4 weighted boost factors capped +0.50 per chunk: experiment-anchor +0.15 / kit-mention +0.10 / recent-history +0.20 × cosineSim / docente-stylistic +0.05
- Conversational grounding via Voyage embed of last 10 conversation messages → cosineSim vs chunk embedding in `chunk.metadata.embedding`
- Implementation already shipped iter 41 `aggregateOnniscenzaV21` (142 LOC, 30+ unit tests target per ADR-035 previous version §Test strategy)

**Hypothesis**: V2.1 conversational fusion may yield better PZ V3 quality
(grounded ranking aligned with conversation context) MA needs **fair bench**
to avoid V2 regression repeat. Speculative gains (untested live):
- Plurale "Ragazzi," + kit_mention boost may align responses with PRINCIPIO ZERO mandate
- Recent-history boost may reduce off-topic redirects when conversation has clear topic anchor

---

## §2 Decision

Adopt **fair comparison protocol R5 V1 baseline + V2.1 canary 5%** as gating
mechanism for `ONNISCENZA_VERSION` env flip iter 11+. This ADR governs:

1. **Bench fixture** R6 100-prompt RAG-aware (per ADR-014 spec, fixture path TBD §4)
2. **Wire-up status**: `aggregateOnniscenzaV21` ALREADY shipped iter 41 commit `2abe26d` + env-gated `ONNISCENZA_VERSION=v2_1` selector path in `onniscenza-bridge.ts` (verify file:line iter 11 entrance pre-bench, currently `ONNISCENZA_VERSION=v1` env active)
3. **Decision matrix** (§5): V2.1 stays canary 5% OR ramp 25%→100% OR revert
4. **Acceptance gate** (§6): 24h soak no false-positive anti-absurd flag rate <5%
5. **Rollback plan** (§8): `ONNISCENZA_VERSION=v1` immediate env flip (no DB schema changes V2.1)

This ADR does **NOT** auto-promote V2.1 to production. V2.1 ramp 25%→100%
requires Andrea explicit ratify post bench PASS + 24h canary 5% soak telemetry
clean.

---

## §3 V2.1 architecture detail

### Conversational fusion mechanism

Implementation in `supabase/functions/_shared/onniscenza-conversational-fusion.ts`
already shipped iter 41 (verified file-system this iter, 142 LOC, exports
`aggregateOnniscenzaV21` + `cosineSimilarity` helpers):

```typescript
// Pseudo-code summary (full impl iter 41 commit 2abe26d)
async function aggregateOnniscenzaV21(input: FusionInput): Promise<FusionResult[]> {
  const historyEmbed = input.conversationMessages?.length
    ? await embedConversationHistory(input.conversationMessages)  // Voyage embed last 10 messages
    : null;

  return input.ragChunks
    .map((chunk) => {
      const breakdown = { rrf_base: chunk.score };
      let boost = 0;

      if (input.experimentId && chunk.experimentId === input.experimentId) {
        boost += 0.15; breakdown.experiment_anchor = 0.15;
      }
      if (KIT_OMARIC_REGEX.test(chunk.content)) {
        boost += 0.10; breakdown.kit_mention = 0.10;
      }
      if (historyEmbed?.vector && chunk.metadata?.embedding) {
        const sim = cosineSimilarity(historyEmbed.vector, chunk.metadata.embedding);
        if (sim > 0.6) {
          const histBoost = 0.20 * sim;
          boost += histBoost;
          breakdown.recent_history = histBoost;
        }
      }
      if (input.docenteStyle?.esperto && ESPERTO_REGEX.test(chunk.content)) {
        boost += 0.05; breakdown.docente_stylistic = 0.05;
      } else if (input.docenteStyle?.primoAnno && PRIMO_ANNO_REGEX.test(chunk.content)) {
        boost += 0.05; breakdown.docente_stylistic = 0.05;
      }
      const capped = Math.min(boost, 0.50);
      return { id: chunk.id, finalScore: chunk.score + capped, boostBreakdown: breakdown };
    })
    .sort((a, b) => b.finalScore - a.finalScore);
}
```

### RRF k=60 conversational fusion design notes

The "RRF k=60 fuse conversation_history_embed + RAG hits" framing in the master
plan iter 31 §2 Phase 5 Atom 5.1.2 is **interpreted in V2.1 as additive boost**
(not as alternate-list fusion). Rationale:
- True RRF over two separately-ranked lists (conversation embed top-K vs RAG top-K) requires emitting the conversation embed as a synthetic ranked list → adds complexity + extra Voyage call cost
- Additive boost preserves V1 RRF k=60 base ordering exactly (anti-V2-regression mandate)
- Boost cap +0.50 keeps boost magnitude below typical RRF k=60 spread (top chunk score ≈ 1/(60+1) ≈ 0.0164 base, but accumulated across layers spreads larger)

### Cache hit rate target ≥40% (G7 onniscenza-measure skill gate)

V2.1 conversational embed cache:
- In-isolate LRU 100 entries TTL 30min, SHA-256 keyed on `JSON.stringify(conversationMessages.slice(-10))`
- Reuses iter 38 carryover `_shared/semantic-cache.ts` 158 LOC pattern (in-isolate LRU)
- Warmup cron pre-fetch top-100 conversational embeds (Phase D candidate iter 12+, NOT shipped iter 11 bench)
- Target ≥40% hit rate measured via `onniscenza_v21_cache_hit` telemetry event count over 100-prompt fixture

### Anti-absurd flag rate target <5% (G6 gate)

Anti-absurd validator (B4 task per master plan iter 31 §2 Phase 5 Atom 5.1.4 cross-ref):
- NER component refs in LLM response vs RAG chunks content (Levenshtein ≤2)
- Vol/pag citation vs RAG chunk metadata.page (post Voyage re-ingest E)
- Plurale "Ragazzi," opener present (PRINCIPIO ZERO §1)

Telemetry event `anti_absurd_flag` emitted per LLM response when validator
detects regression. Target rate <5% over 100-prompt fixture (5 flags / 100
responses max).

---

## §4 Bench protocol

### R5 V1 baseline re-run (iter 11 entrance)

```bash
# Andrea provision env (~5min):
export SUPABASE_URL=https://euqpdueopmlllqjmqnyb.supabase.co
export SUPABASE_ANON_KEY=<from Supabase Dashboard>
export ELAB_API_KEY=<from .env, post iter 32 rotation>

# Verify V1 active:
SUPABASE_ACCESS_TOKEN=$TOKEN npx supabase secrets list --project-ref euqpdueopmlllqjmqnyb | grep ONNISCENZA_VERSION
# Expect: ONNISCENZA_VERSION = v1

# Run R5 50-prompt against current Edge Function v72:
node scripts/bench/run-sprint-r5-stress.mjs

# Expected output: scripts/bench/output/r5-stress-report-<timestamp>.md
# Capture metrics: avg latency, p95 latency, PZ V3 %, success rate
```

V1 baseline expected (per iter 38 carryover bench `r5-stress-report-2026-05-01T07-43-04-636Z.md`):
- Success rate: 49/50 (98%)
- avg latency: ~1607ms
- p95 latency: ~3380ms
- PZ V3: ~94.2%

If R5 returns 0/8 BROKEN (per Phase 0 §3 latest 2026-05-02T07:28 finding),
bisect by env flag (ENABLE_SSE off + ENABLE_INTENT_TOOLS_SCHEMA off +
ONNISCENZA_VERSION=v1 + CANARY_DENO_DISPATCH_PERCENT=0) per G45 Opus §6
recommendation. R5 PASS pre-bench is **MANDATORY** before V2.1 canary flip.

### V2.1 canary 5% bench (iter 11+ post Andrea ratify)

```bash
# Andrea env flip canary 5%:
SUPABASE_ACCESS_TOKEN=$TOKEN npx supabase secrets set \
  ONNISCENZA_VERSION=v2_1 \
  CANARY_ONNISCENZA_V21_PERCENT=5 \
  --project-ref euqpdueopmlllqjmqnyb

# Edge Function reads new secrets next cold start (~30s warmup cron picks up)

# Re-run R5 50-prompt (subset 5% requests will hit V2.1 path):
node scripts/bench/run-sprint-r5-stress.mjs

# Capture metrics + diff vs V1 baseline
```

### R6 100-prompt RAG-aware fixture

R6 fixture spec per ADR-014 (`docs/adrs/ADR-014-r6-stress-fixture-100-prompts-rag-aware-2026-04-26.md`):
- 100 prompts spanning 10 categories × 10 prompts each
- Each prompt has expected RAG chunk IDs (recall@5 ground truth)
- Categories: deep_question / sintesi / safety / off_topic / plurale_ragazzi / citation_vol_pag / chit_chat / experiment-anchored / kit-mention / docente-style

**Status iter 11 entrance**: R6 runner `scripts/bench/run-sprint-r6-stress.mjs`
NOT shipped per Phase 0 §5 (G45 Opus §3 Box 6 0.85 reflects R6 fixture absent).
R6 author iter 12+ ~3h Tester-1 (NOT this iter 10 design scope). For iter 11
canary, R5 50-prompt is sufficient gate; R6 deferred to ramp 25%→100% gate.

Same R6 100-prompt fixture re-used as historical V1 + V2 baselines (when R6
runner shipped) for apples-to-apples comparison. Until then, R5 50-prompt
fixture serves as canary 5% gate per §5 decision matrix.

---

## §5 Decision matrix

Compare V2.1 canary 5% R5 metrics vs V1 baseline R5 metrics. Three exit paths:

| Condition | Action | Rationale |
|-----------|--------|-----------|
| V2.1 PZ V3 ≥ V1 PZ V3 **AND** V2.1 latency p95 ≤ V1 + 10% **AND** anti_absurd_flag <5% | **RAMP 25%** → 24h soak → ramp 100% post 24h soak clean | Quality preserved + latency acceptable + no hallucination regression |
| V2.1 PZ V3 ≥ V1 PZ V3 − 0.5pp **AND** V2.1 latency p95 ≤ V1 + 5% **AND** anti_absurd_flag <5% | **STAY canary 5%** + iterate boost weights or cache strategy iter 12+ | Marginal gain/loss, more soak data needed before ramp |
| **ANY OF**: V2.1 PZ V3 < V1 PZ V3 − 0.5pp **OR** V2.1 latency p95 > V1 + 10% **OR** anti_absurd_flag ≥5% | **REVERT** V2.1 → `ONNISCENZA_VERSION=v1` env immediate flip + document regression iter 31+ `automa/state/inflation-flags.jsonl` append entry | Clear regression matching V2 pattern, do not repeat iter 39 mistake |

### Quantitative thresholds rationale

- **PZ V3 ≥ V1**: V1 94.2% baseline, V2.1 must not regress quality (V2 -1.0pp regression direct cause for revert)
- **Latency p95 ≤ V1 + 10%**: V1 3380ms baseline, V2.1 ramp gate p95 ≤ 3718ms (V2 was +19% p95 = 4012ms, clearly over gate)
- **Latency p95 ≤ V1 + 5%**: V1 3380ms baseline, V2.1 stay-canary gate p95 ≤ 3549ms
- **anti_absurd_flag <5%**: 5/100 max false positives over 100-prompt fixture (G6 onniscenza-measure skill gate)

### Decision sample analysis (synthetic, illustrative)

Hypothetical V2.1 R5 result post canary 5%:

| Metric | V1 baseline | V2.1 hypothetical | Verdict |
|--------|-------------|-------------------|---------|
| PZ V3 | 94.2% | 94.5% | +0.3pp → ≥ V1 ✓ |
| latency p95 | 3380ms | 3520ms | +4.1% → ≤ +10% ✓ |
| anti_absurd_flag | undocumented | 3/100 | <5% ✓ |
| **Verdict** | — | **RAMP 25%** | All gates met |

Counter-example V2.1 regression:

| Metric | V1 baseline | V2.1 hypothetical | Verdict |
|--------|-------------|-------------------|---------|
| PZ V3 | 94.2% | 92.8% | -1.4pp → < V1 - 0.5pp ✗ |
| latency p95 | 3380ms | 3650ms | +8.0% → ≤ +10% ✓ |
| anti_absurd_flag | undocumented | 4/100 | <5% ✓ |
| **Verdict** | — | **REVERT** | PZ V3 regression triggers immediate revert |

---

## §6 Acceptance gate

Sequenced gates (each must PASS before next progression):

1. **R5 V1 baseline PASS pre-bench** (iter 11 entrance) — 50/50 success + PZ V3 ≥90% + latency p95 ≤4000ms (sanity ceiling vs iter 38 carryover 3380ms)
2. **Andrea explicit ratify ADR-035** + env provision SUPABASE_SERVICE_ROLE_KEY + VOYAGE_API_KEY
3. **V2.1 canary 5% deploy** + R5 50-prompt re-bench + decision matrix §5 evaluate
4. **24h soak canary 5%** post first ramp condition match — telemetry monitor:
   - `anti_absurd_flag` rate < 5% sustained
   - `onniscenza_v21_applied` event count proportional to canary %
   - `onniscenza_v21_cache_hit` rate ≥ 40%
   - No spike in `onniscenza_v21_error` events
   - No spike in Edge Function `unlim-chat` 5xx rate
5. **Ramp 25%** post soak clean → 24h soak each 25%→50%→75%→100%
6. **Manual hallucination review 50 prompts** post canary 100% — manual verification PZ V3 quality + factual consistency vs RAG chunks (10 deep + 10 sintesi + 10 safety + 10 plurale + 10 citation)

Failure at any gate → revert per §5 decision matrix REVERT row.

---

## §7 Risks + mitigations

| # | Risk | Probability | Impact | Mitigation |
|---|------|-------------|--------|------------|
| 1 | V2.1 conversational fusion adds latency RRF k=60 fusion overhead via Voyage embed call | Medium | Medium (+50-150ms) | In-isolate cache TTL 30min SHA-256 keyed on conversationMessages.slice(-10). Skip fusion if conversationMessages empty (chit_chat path). Warmup cron pre-fetch top-100 deferred iter 12+ |
| 2 | Cache miss cold start latency spike | Medium | Low (+200ms first call per session) | Warmup cron pre-fetch top-100 conversational embeds (Phase D iter 12+). 5-minute TTL similar to onniscenza-cache.ts pattern |
| 3 | PZ V3 regression similar V2 pattern | Medium | High (revert + iter loss) | Canary 5% gradual ramp with revert trigger §5. Boost cap +0.50 prevents runaway scoring. RRF k=60 base UNCHANGED (anti-V2-regression mandate) |
| 4 | Boost gaming by adversarial prompts (kit-mention regex triggered off-topic) | Low | Low | Regex strict word-boundary `\b...\b` + cap +0.10 per factor + total cap +0.50 |
| 5 | Docente memoria cold-start (first session no docente style data) | High | Low | `docenteStyle` optional param, skip stylistic boost when undefined. Default to V1-equivalent ranking when no signals |
| 6 | recent-history boost dominates ranking when conversation drifts | Low | Medium | cosineSim threshold 0.6 floor + cap 0.20 × 1.0 max = 0.20 contribution (within +0.50 total cap) |
| 7 | Voyage API rate limit during bench burst | Medium | Low (cached after first hit) | In-isolate cache + bench runner sleep between requests (per existing R5 runner pattern) |
| 8 | Telemetry event flood (every onniscenza call emits boost breakdown) | Low | Low | Sample telemetry 1/10 onniscenza_v21_applied events post canary 25% |

---

## §8 Rollback plan

### Immediate revert (matches V2 iter 39 revert pattern, audit `iter-39-A4-Onniscenza-V2-REGRESSION-revert.md` §3)

```bash
SUPABASE_ACCESS_TOKEN=$TOKEN npx supabase secrets set \
  ONNISCENZA_VERSION=v1 \
  --project-ref euqpdueopmlllqjmqnyb
# Output: "Finished supabase secrets set."
# Edge Function reads new secret on next cold start (immediate canary disable)
```

### Properties

- **No DB schema changes V2.1** — env flag swap only, no migration required
- **In-place reversibility** — V1 code path always present (V1 active default)
- **Zero downtime** — Edge Function cold start ~30s warmup cron picks up
- **V2.1 code preserved** in `onniscenza-conversational-fusion.ts` for iter 12+ tuning
- **No client-side change** — `unlim-chat` Edge Function transparent to frontend

### Audit log entry

Per ADR-035 acceptance gate §6 step 4, on any REVERT trigger:

```bash
# Append entry automa/state/inflation-flags.jsonl:
{
  "timestamp": "<ISO 8601>",
  "iter": "31",
  "atom": "ADR-035-v2-1-revert",
  "regression": {
    "metric": "PZ V3 | latency_p95 | anti_absurd_flag",
    "v1_baseline": "<value>",
    "v2_1_measured": "<value>",
    "delta": "<value>",
    "threshold_violated": "<§5 condition>"
  },
  "evidence_files": [
    "scripts/bench/output/r5-stress-report-<v1-baseline-timestamp>.md",
    "scripts/bench/output/r5-stress-report-<v2-1-canary-timestamp>.md"
  ],
  "revert_command": "SUPABASE_ACCESS_TOKEN=$TOKEN npx supabase secrets set ONNISCENZA_VERSION=v1 --project-ref euqpdueopmlllqjmqnyb",
  "revert_timestamp": "<ISO 8601 of revert>",
  "iter_loss_estimate": "<hours>"
}
```

This audit log entry preserves anti-inflation traceability per G45 mandate
(no claim "V2.1 LIVE" without bench evidence + ratify, no silent revert).

### Post-revert iteration

Iter 12+ V2.1 redesign options (gated next ralph iteration):

1. Skip recent-history boost (highest cost factor, drop to V1 + 3 boosts only)
2. Lower boost cap from +0.50 to +0.30 (more conservative scoring)
3. Replace Voyage embed with cheaper local cosine over RAG-cache embeddings
4. Investigate L7 Analogia graph as 5th factor (concept-graph.json link, NEW)

---

## §9 Cross-link

- **G45 Opus baseline iter 39**: `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md` §3 inflation flag #1 (V2 reverted commit `eb4a11b`, V2 -1.0pp PZ V3 + 36% slower vs V1)
- **V2 regression bench**: `docs/audits/iter-39-A4-Onniscenza-V2-REGRESSION-revert.md` (V2 50/50 PZ V3 93.2% / latency 2182ms vs V1 49/50 94.2% / 1607ms)
- **Master plan iter 31**: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md` §2 Phase 5 (V2.1 wire-up shipped iter 41 commit `2abe26d`)
- **Iter 5 dry-run findings skills V1**: `docs/audits/2026-05-02-iter-31-PHASE1-CLOSE-audit.md` (5 skills + 6 mechanisms scaffold, M-AI-02 mechanical cap enforcer dry-run iter 39 synthetic 8.45→8.0 verified)
- **Iter 7 plan iter 8-20 §Phase 3**: `docs/superpowers/plans/2026-05-03-iter-31-ralph-iter-8-to-20-make-plan.md` §Phase 3 ADR-035 design ADR + bench protocol
- **ADR-033 onniscenza-v2-cross-attention-budget**: REJECTED iter 39, retained historical (NOT this ADR's design)
- **ADR-014 r6-stress-fixture**: spec referenced §4 R6 100-prompt fixture (runner author iter 12+)
- **ADR-021 box-3-rag-1881-full-coverage-redefine**: page metadata gap blocks R6 recall@5 measure (Voyage re-ingest deferred iter 12+)
- **`onniscenza-conversational-fusion.ts`**: 142 LOC iter 41 commit `2abe26d`, exports `aggregateOnniscenzaV21` + `cosineSimilarity`
- **`onniscenza-bridge.ts:404,416`**: V2.1 selector path (verify file:line iter 11 entrance, currently env-gated `ONNISCENZA_VERSION=v2_1`)
- **`onniscenza-classifier.ts`**: 6 categorie pre-LLM topK 0/2/3 iter 37 wired prod (preserved unchanged for V2.1)
- **`state-snapshot-aggregator.ts`** (master plan §2 reference): NOT FOUND in `_shared/` per Bash scan iter 10. The 7-layer aggregator referenced in plan is `aggregateOnniscenza` in `onniscenza-bridge.ts:299` (V1) + `aggregateOnniscenzaV2` line 608 (V2 archived) + V2.1 invocation lines 404-416 dynamic import. Plan reference may have been stale; this ADR uses the bridge.ts canonical exports

### Anti-pattern enforced (per task mandate iter 31 ralph 10)

- **NO claim "V2.1 LIVE"** — design only iter 10, bench gated Andrea iter 11+ ratify
- **NO override `ONNISCENZA_VERSION=v1` env** without V2.1 bench PASS (R5 V1 baseline + V2.1 canary 5% R5) + Andrea explicit ratify
- **NO inflate score** — ADR-035 design contributes 0 production behavior change iter 10 (architectural design only); V2.1 ramp/revert decision deferred §5 decision matrix
- **NO write outside `docs/adrs/` + `automa/team-state/messages/`** per task mandate
- **NO `--no-verify` commits** — orchestrator commits Phase 3 (this iter 10 ADR + completion msg only)
- **NO commit by this design iter** — orchestrator commits Phase 3 per task mandate
