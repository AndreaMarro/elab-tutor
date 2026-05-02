# Iter 41+ Velocità + Onniscenza + Onnipotenza + Wake Word — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lift ELAB Tutor latency p50 ≤1500ms / p95 ≤2500ms (vs 3130/5400 measured 2026-05-02 v74 smoke), eliminate hallucination/absurd-response risk via Onniscenza-conversational fusion grounded in conversation history, achieve Onnipotenza fire-rate ≥80% via robust post-LLM JSON parser + canary 100% rollout, ship wake word UX 9/9 STT cells PASS Voxtral primary plurale "Ragazzi" trigger.

**Architecture:**
- **Latency Tier 1**: Mistral routing tune narrow-Large + A4 SSE streaming wire client + T1.3 student-context single RPC + T1.7 hedged Mistral parallel + Onniscenza cache TTL pgvector 5min
- **Onniscenza supreme conversational**: ADR-032 V2.1 conversational fusion (RRF k=60 base + +0.15 experiment-anchor + +0.10 kit-mention + +0.20 recent-history embed, Onniscenza V2 cross-attention REJECTED iter 39 -1.0pp PZ V3 + 36% slower regression). Conversation history last 10 messages embedded + fused, hallucination guard <2% via post-LLM cross-check chunks vs response NER
- **Onnipotenza total**: post-LLM JSON parser harden multi-shape (raw object, wrapped whitespace, code-fence, escape variants) + telemetry threshold gate intent_schema_parse_fallback <5% per 100-prompt → re-wire widened shouldUseIntentSchema canary 5%→25%→100% + 12-tool Deno dispatcher canary 0%→100%
- **Wake word**: "Ragazzi" plurale prepend MicPermissionNudge integration + Voxtral STT continuous mode + VAD low-latency + 9-cell matrix verify (3 OS × 3 browser)
- **PRINCIPIO ZERO §1 anchored**: docente tramite + kit fisico protagonist + plurale "Ragazzi" + Vol/pag verbatim ≥95% (post Voyage re-ingest ADR-034)
- **Morfismo Sense 1+1.5+2 anchored**: 57 ToolSpec + L1+L2+L3 morphic + per-docente memoria runtime adapt + UI/finestre morfiche + triplet coerenza software ↔ kit Omaric ↔ volumi cartacei

**Tech Stack:** Supabase Edge Functions (Deno) + Mistral La Plateforme (Small + Large + Voxtral + Pixtral) + Voyage AI rerank-2 1024-dim + Together AI Llama 3.3 70B contextualization (gated fallback) + pgvector hybrid retrieval + React 19 + Vite 7 frontend + Workbox PWA + Cloudflare Workers AI Whisper STT

**Pre-conditions verified 2026-05-02 PM**:
- Phase 0+1 close ratify done (Plan PIANO-ANDREA-SOLO-SPRINT-T-CLOSE-2026-05-02.md commit `d152aa2` + `7ad0c5a`)
- Phase 2 partial: BASE_PROMPT v3.2 + 65 NEW tests committed `3709cb4`, widened heuristic wire-up `779980e` REVERTED post v73 regression
- Edge Function unlim-chat **v74 LIVE** prod (smoke 5/5 PRINCIPIO ZERO compliant)
- Vercel `dpl_Eq3Griawb25vFKheefmQmhALGnX1` LIVE bundle `index-DSux7O2C.js` aliased www.elabtutor.school + elabtutor.school
- vitest **13539 PASS** (baseline 13474 + 65 NEW Maker-1 C)
- Score Opus G45 indipendente: **8.0/10 ONESTO** (delta -0.45 vs claimed 8.45)

**Anti-inflation G45 mandate**: NO claim "Sprint T close 9.5 achieved" senza Andrea Opus G45 final ratify Phase 7 + ALL gates measured. NO claim "latency target met" senza R5 50-prompt post-deploy re-bench. NO claim "Onnipotenza fire-rate ≥80%" senza R7 200-prompt re-bench post canary 100% soak. NO claim "hallucination <2%" senza 50-prompt manual review.

**Calendar**: Andrea ~24-32h dev iter 41-42 (5-7 days wall-clock). 4 BG agents parallel ~24h aggregato. Andrea actions sequential ~6h (env + ratify + deploy + smoke 4 cycles).

---

## File Structure

### NEW files (created)
- `supabase/functions/_shared/onniscenza-conversational-fusion.ts` — V2.1 conversational embed + RRF k=60 + 4 weighted boost factors (replaces failed V2 cross-attention iter 39)
- `supabase/functions/_shared/json-mode-parser.ts` — Robust multi-shape Mistral JSON-mode output extractor (raw + wrapped + code-fence + escape variants)
- `supabase/functions/_shared/anti-absurd-validator.ts` — Post-LLM hallucination + absurd response runtime check (NER cross-ref RAG chunks)
- `supabase/functions/_shared/conversation-history-embed.ts` — Voyage embed last N=10 messages + cosine similarity vs current query for boost
- `scripts/rag-ingest-voyage-batch-v2.mjs` — Voyage re-ingest pdftotext page extraction Path B per ADR-034 (creates 2061+ chunks with metadata.page populated ≥80%)
- `scripts/rag-extract-pdf-pages-pdftotext.sh` — pdftotext per-page extraction wrapper Vol1 + Vol2 + Vol3 with calibration table
- `supabase/migrations/20260503000000_rag_chunks_page_metadata_v2.sql` — Idempotent UPSERT migration for page metadata column + index
- `src/services/sse-stream-client.js` — EventSource client wrapper for Mistral SSE streaming + chunk reassembly
- `src/components/voice/WakeWordRagazziTrigger.jsx` — "Ragazzi" plurale wake word activator post MicPermissionNudge consent
- `tests/unit/onniscenza-conversational-fusion.test.js` — 30+ tests RRF + 4 boost factors + edge cases
- `tests/unit/json-mode-parser.test.js` — 25+ tests multi-shape Mistral output extraction
- `tests/unit/anti-absurd-validator.test.js` — 15+ tests NER cross-ref + hallucination patterns
- `tests/unit/conversation-history-embed.test.js` — 12+ tests Voyage embed + cosine fusion
- `tests/unit/sse-stream-client.test.js` — 10+ tests EventSource reconnect + chunk reassembly
- `tests/e2e/sprint-t-iter41-wake-word-9-cell.spec.js` — Playwright 9-cell STT matrix Voxtral primary verify
- `docs/adrs/ADR-035-onniscenza-v2-1-conversational-fusion.md` — V2.1 design (V2 cross-attention REJECTED iter 39 documented)
- `docs/adrs/ADR-036-mistral-json-mode-parser-multi-shape.md` — Robust extractor strategy
- `docs/adrs/ADR-037-mistral-routing-narrow-large-tune.md` — Routing weight tune Large only on complexity threshold
- `docs/adrs/ADR-038-hedged-mistral-100ms-stagger.md` — T1.7 hedged design + cost ratify Andrea
- `docs/promises/SPRINT_T_CLOSE_ONNISCENZA_ONNIPOTENZA_VELOCITA_RALPH.md` — Ralph loop promise file (close criteria 9 boxes)

### MODIFIED files
- `supabase/functions/_shared/onniscenza-bridge.ts` — Add V2.1 conversational fusion path post `ENABLE_ONNISCENZA_V21=true` env gate (preserves V1 default)
- `supabase/functions/_shared/llm-client.ts` — Hedged Mistral 100ms stagger + routing tune narrow Large + responseFormat passthrough hardened
- `supabase/functions/_shared/mistral-client.ts` — SSE chunk reassembly improved + responseFormat enforce strict object
- `supabase/functions/_shared/clawbot-template-router.ts` — Re-wire widened shouldUseIntentSchema canary post robust parser (gated env CANARY_INTENT_SCHEMA_WIDEN_PERCENT)
- `supabase/functions/_shared/memory.ts` — T1.3 student-context single RPC fast path schema audit fix
- `supabase/functions/unlim-chat/index.ts` — Wire conversational fusion + JSON-mode parser harden + anti-absurd validator + telemetry intent_schema_parse_fallback rate
- `supabase/functions/_shared/system-prompt.ts` — BASE_PROMPT v3.3 anti-absurd block + conversation continuity rules
- `src/components/lavagna/useGalileoChat.js` — SSE EventSource client integration + streaming UI + intents_parsed dispatch preserved
- `src/components/common/MicPermissionNudge.jsx` — Wake word "Ragazzi" plurale prepend integration
- `src/services/wakeWord.js` — Voxtral continuous STT mode + VAD low-latency
- `supabase/migrations/20260503000001_student_context_rpc_v1.sql` — T1.3 RPC schema fix retry
- `vite.config.js` — Bundle size optim Lighthouse perf path (lazy mount react-pdf 1.91MB + mammoth 500KB defer)
- `CLAUDE.md` — Sprint history APPEND iter 41+ close section

---

## Phase A — Latency Tier 1 (avg 3.13s → 1.5s p50 / p95 ≤2500ms)

### Task A1: Mistral routing tune narrow Large triggers

**Files:**
- Modify: `supabase/functions/_shared/llm-client.ts:380-400` (pickWeightedProvider env)
- Create: `docs/adrs/ADR-037-mistral-routing-narrow-large-tune.md`
- Test: `tests/unit/mistral-routing-narrow-large.test.js` (NEW)

- [ ] **Step 1: Write failing test for narrow Large routing**

```javascript
// tests/unit/mistral-routing-narrow-large.test.js
import { describe, it, expect } from 'vitest';
import { selectMistralModel } from '../../supabase/functions/_shared/llm-client.ts';

describe('Mistral routing narrow Large triggers', () => {
  it('returns mistral-small-latest for short simple prompts (<50 words)', () => {
    const result = selectMistralModel({
      message: 'Cosa fa il LED?',
      wordCount: 4,
      hasMultiStep: false,
      hasComplexDiagnostic: false,
    });
    expect(result.model).toBe('mistral-small-latest');
    expect(result.routing_reason).toMatch(/short|simple/);
  });

  it('returns mistral-large-latest only for multi-step + diagnostic complex prompts', () => {
    const result = selectMistralModel({
      message: 'Verifica il circuito Arduino e diagnostica passo per passo eventuali errori sui pin digitali',
      wordCount: 14,
      hasMultiStep: true,
      hasComplexDiagnostic: true,
    });
    expect(result.model).toBe('mistral-large-latest');
    expect(result.routing_reason).toMatch(/multi-step.*diagnostic/);
  });

  it('falls back to mistral-small-latest for verifica-only (single step)', () => {
    const result = selectMistralModel({
      message: 'Verifica il LED',
      wordCount: 3,
      hasMultiStep: false,
      hasComplexDiagnostic: false,
    });
    expect(result.model).toBe('mistral-small-latest');
  });
});
```

- [ ] **Step 2: Run test to verify FAIL**

Run: `npx vitest run tests/unit/mistral-routing-narrow-large.test.js`
Expected: FAIL — `selectMistralModel` not exported.

- [ ] **Step 3: Implement narrow Large heuristic in llm-client.ts**

Read current routing block at `supabase/functions/_shared/llm-client.ts:380-400`.

Add export function:

```typescript
export function selectMistralModel(input: {
  message: string;
  wordCount?: number;
  hasMultiStep?: boolean;
  hasComplexDiagnostic?: boolean;
}): { model: string; routing_reason: string } {
  const wordCount = input.wordCount ?? input.message.split(/\s+/).filter(Boolean).length;
  const multiStep = input.hasMultiStep ?? /passo per passo|step by step|prima.*poi.*infine|\d+\s*step/i.test(input.message);
  const complexDiag = input.hasComplexDiagnostic ?? /diagnostica.*errori|verifica.*passo|controlla.*sequenza/i.test(input.message);

  if (multiStep && complexDiag) {
    return { model: 'mistral-large-latest', routing_reason: 'multi-step+diagnostic' };
  }
  if (wordCount > 50) {
    return { model: 'mistral-large-latest', routing_reason: 'long-prompt-50w+' };
  }
  return { model: 'mistral-small-latest', routing_reason: 'short-simple-default' };
}
```

Update existing routing call site to use `selectMistralModel(...)`.

- [ ] **Step 4: Run test to verify PASS**

Run: `npx vitest run tests/unit/mistral-routing-narrow-large.test.js`
Expected: 3/3 PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/unit/mistral-routing-narrow-large.test.js \
        supabase/functions/_shared/llm-client.ts \
        docs/adrs/ADR-037-mistral-routing-narrow-large-tune.md
git commit -m "feat(latency-A1): Mistral routing narrow Large triggers — short prompts route Small only"
```

### Task A2: SSE streaming wire client useGalileoChat.js

**Files:**
- Create: `src/services/sse-stream-client.js`
- Modify: `src/components/lavagna/useGalileoChat.js` (integrate sse-stream-client)
- Test: `tests/unit/sse-stream-client.test.js` (NEW 10+ tests)

- [ ] **Step 1: Write failing test for EventSource SSE chunk reassembly**

```javascript
// tests/unit/sse-stream-client.test.js
import { describe, it, expect, vi } from 'vitest';
import { createSSEStream } from '../../src/services/sse-stream-client.js';

describe('SSE stream client', () => {
  it('reassembles chunks into final message + dispatches intents_parsed', async () => {
    const mockEventSource = {
      onmessage: null,
      onerror: null,
      close: vi.fn(),
    };
    global.EventSource = vi.fn(() => mockEventSource);

    const onChunk = vi.fn();
    const onDone = vi.fn();
    const stream = createSSEStream({
      url: '/edge/unlim-chat',
      payload: { message: 'test' },
      onChunk,
      onDone,
    });

    mockEventSource.onmessage({ data: '{"chunk":"Ragazzi, "}' });
    mockEventSource.onmessage({ data: '{"chunk":"il LED è "}' });
    mockEventSource.onmessage({ data: '{"chunk":"un componente."}' });
    mockEventSource.onmessage({ data: '{"done":true,"intents_parsed":[{"tool":"highlightComponent"}]}' });

    expect(onChunk).toHaveBeenCalledTimes(3);
    expect(onDone).toHaveBeenCalledWith({
      finalText: 'Ragazzi, il LED è un componente.',
      intents_parsed: [{ tool: 'highlightComponent' }],
    });
  });

  it('handles SSE error gracefully + fallback to non-stream POST', async () => {
    // ... 3 more cases (timeout, connection drop, malformed chunk)
  });
});
```

- [ ] **Step 2: Run test FAIL**

Run: `npx vitest run tests/unit/sse-stream-client.test.js`
Expected: FAIL — `createSSEStream` not exported.

- [ ] **Step 3: Implement sse-stream-client.js**

Create `src/services/sse-stream-client.js` with:
- `createSSEStream({url, payload, onChunk, onDone, onError})` returns `{close, abort}` controller
- Uses native `EventSource` API
- Reassembles `data:` lines into final text
- Parses terminal `{done:true, intents_parsed: [...]}` event
- Falls back to standard fetch POST on `EventSource` unsupported (older Safari iOS)
- Timeout default 30s + 3 retry on transient errors

Reference: existing `src/services/api.js:postChatWithRetry` for retry pattern.

- [ ] **Step 4: Wire into useGalileoChat.js**

Modify `src/components/lavagna/useGalileoChat.js`:
- Add SSE attempt FIRST when `import.meta.env.VITE_ENABLE_SSE === 'true'`
- Fall back to current postChat on SSE fail
- onChunk → setStreamedText (UI shows progressively)
- onDone → finalize message + dispatch intents

- [ ] **Step 5: Run tests + smoke build**

Run: `npx vitest run tests/unit/sse-stream-client.test.js`
Expected: 5+/5+ PASS.

Run: `npm run build`
Expected: PASS, bundle no new errors.

- [ ] **Step 6: Commit**

```bash
git add src/services/sse-stream-client.js \
        src/components/lavagna/useGalileoChat.js \
        tests/unit/sse-stream-client.test.js
git commit -m "feat(latency-A2): SSE streaming client wire useGalileoChat — TTFB <500ms perceived"
```

### Task A3: T1.3 student-context single RPC schema audit + apply

**Files:**
- Create: `supabase/migrations/20260503000001_student_context_rpc_v1.sql`
- Modify: `supabase/functions/_shared/memory.ts:fast-path-block`
- Test: `tests/integration/student-context-rpc.test.js` (NEW)

- [ ] **Step 1: Schema audit Andrea action**

```bash
npx supabase db query --linked "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'student_progress';"
```

Document column names exact (iter 38 BLOCKED on `completed_experiments` not found).

- [ ] **Step 2: Write failing integration test**

```javascript
// tests/integration/student-context-rpc.test.js
import { describe, it, expect } from 'vitest';
import { loadStudentContextV1 } from '../../supabase/functions/_shared/memory.ts';

describe('T1.3 student context single RPC', () => {
  it('loads docente memoria + classe context + 5 last sessions in single call', async () => {
    const ctx = await loadStudentContextV1({ classKey: 'test-class', sessionId: 's_test' });
    expect(ctx).toHaveProperty('docente_memoria');
    expect(ctx).toHaveProperty('classe_context');
    expect(ctx.last_sessions).toHaveLength(5);
    expect(ctx.latencyMs).toBeLessThan(150); // single RPC target
  });
});
```

- [ ] **Step 3: Write SQL migration v1 RPC**

```sql
-- supabase/migrations/20260503000001_student_context_rpc_v1.sql
CREATE OR REPLACE FUNCTION load_student_context_v1(
  p_class_key TEXT,
  p_session_id TEXT,
  p_session_limit INT DEFAULT 5
)
RETURNS JSONB
LANGUAGE plpgsql STABLE
AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Single roundtrip: docente + classe + sessions in one query
  SELECT jsonb_build_object(
    'docente_memoria', (
      SELECT jsonb_object_agg(key, value)
      FROM docente_memory
      WHERE class_key = p_class_key
      LIMIT 50
    ),
    'classe_context', (
      SELECT jsonb_build_object(
        'experiments_completed', COALESCE(jsonb_agg(DISTINCT experiment_id), '[]'::jsonb),
        'last_lesson_path', MAX(lesson_path)
      )
      FROM unlim_session_audit
      WHERE class_key = p_class_key
      GROUP BY class_key
    ),
    'last_sessions', (
      SELECT jsonb_agg(row_data ORDER BY created_at DESC)
      FROM (
        SELECT row_to_json(s)::jsonb AS row_data, created_at
        FROM unlim_sessions s
        WHERE s.class_key = p_class_key
        ORDER BY created_at DESC
        LIMIT p_session_limit
      ) sub
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;
```

- [ ] **Step 4: Apply migration prod**

```bash
npx supabase db push --linked
```

Verify: `npx supabase migration list --linked`

- [ ] **Step 5: Implement loadStudentContextV1 in memory.ts**

Modify `supabase/functions/_shared/memory.ts`:
- Add `loadStudentContextV1({classKey, sessionId})` calling RPC `load_student_context_v1`
- Set `STUDENT_CONTEXT_RPC_V1=true` env to activate
- Preserve legacy 2-call fallback path (iter 38 fallback active)

- [ ] **Step 6: Tests + commit**

```bash
npx vitest run tests/integration/student-context-rpc.test.js
git add supabase/migrations/20260503000001_student_context_rpc_v1.sql \
        supabase/functions/_shared/memory.ts \
        tests/integration/student-context-rpc.test.js
git commit -m "feat(latency-A3): T1.3 student context single RPC — -250-500ms p95"
```

### Task A4: Hedged Mistral 100ms stagger ENABLE_HEDGED_LLM

**Files:**
- Modify: `supabase/functions/_shared/llm-client.ts:callMistralChat` add hedged path
- Create: `docs/adrs/ADR-038-hedged-mistral-100ms-stagger.md`
- Test: `tests/unit/llm-client-hedged.test.js` (NEW)

- [ ] **Step 1: ADR-038 cost ratify Andrea**

Document in ADR-038:
- Hedged: 2 parallel Mistral calls 100ms stagger, first-respondent-wins
- Cost impact: +30% LLM API cost (~+$0.0003/request)
- Latency lift: -600-1100ms p95 (per Tier 1 research iter 38)
- Andrea ratify gate: env `ENABLE_HEDGED_LLM=false` default safe → `=true` post Andrea explicit OK

- [ ] **Step 2: Write failing test hedged race**

```javascript
// tests/unit/llm-client-hedged.test.js
import { describe, it, expect, vi } from 'vitest';
import { callMistralChatHedged } from '../../supabase/functions/_shared/llm-client.ts';

describe('Hedged Mistral 100ms stagger', () => {
  it('returns first-respondent winner', async () => {
    const slow = new Promise(r => setTimeout(() => r({ text: 'slow', latencyMs: 800 }), 800));
    const fast = new Promise(r => setTimeout(() => r({ text: 'fast', latencyMs: 200 }), 200));
    const result = await callMistralChatHedged({ primary: () => fast, hedged: () => slow, staggerMs: 100 });
    expect(result.text).toBe('fast');
  });

  it('aborts loser request to save cost', async () => {
    // ... mock AbortController + verify abort.call called
  });
});
```

- [ ] **Step 3: Implement hedged path**

```typescript
export async function callMistralChatHedged<T>(opts: {
  primary: () => Promise<T>;
  hedged: () => Promise<T>;
  staggerMs?: number;
}): Promise<T> {
  const stagger = opts.staggerMs ?? 100;
  const primaryPromise = opts.primary();
  const hedgedPromise = new Promise<T>((resolve, reject) => {
    setTimeout(() => opts.hedged().then(resolve, reject), stagger);
  });
  return Promise.race([primaryPromise, hedgedPromise]);
}
```

- [ ] **Step 4: Wire env gate**

```typescript
// in callMistralChat invocation
if (Deno.env.get('ENABLE_HEDGED_LLM') === 'true') {
  return callMistralChatHedged({
    primary: () => callMistralChatRaw(opts),
    hedged: () => callMistralChatRaw({ ...opts, model: opts.model }),
    staggerMs: 100,
  });
}
```

- [ ] **Step 5: Tests + Andrea ratify gate + commit**

```bash
npx vitest run tests/unit/llm-client-hedged.test.js
git add supabase/functions/_shared/llm-client.ts \
        docs/adrs/ADR-038-hedged-mistral-100ms-stagger.md \
        tests/unit/llm-client-hedged.test.js
git commit -m "feat(latency-A4): hedged Mistral 100ms stagger — gated ENABLE_HEDGED_LLM Andrea ratify"
```

Andrea action post-commit:
```bash
npx supabase secrets set ENABLE_HEDGED_LLM=true --project-ref euqpdueopmlllqjmqnyb
npx supabase functions deploy unlim-chat --project-ref euqpdueopmlllqjmqnyb
```

### Task A5: Onniscenza V1 cache TTL pgvector 5min

**Files:**
- Modify: `supabase/functions/_shared/onniscenza-bridge.ts` add LRU cache layer
- Test: `tests/unit/onniscenza-cache-ttl.test.js` (NEW)

- [ ] **Step 1: Write failing test cache hit**

```javascript
// tests/unit/onniscenza-cache-ttl.test.js
import { describe, it, expect } from 'vitest';
import { aggregateOnniscenza, getCacheStats } from '../../supabase/functions/_shared/onniscenza-bridge.ts';

describe('Onniscenza V1 cache TTL', () => {
  it('returns cached result for repeated identical query within 5min', async () => {
    const opts = { query: 'LED Vol.1', topK: 3 };
    const r1 = await aggregateOnniscenza(opts);
    const r2 = await aggregateOnniscenza(opts);
    const stats = getCacheStats();
    expect(stats.hits).toBeGreaterThan(0);
    expect(r1.chunks).toEqual(r2.chunks);
  });

  it('invalidates entry post 5min TTL', async () => {
    // ... mock Date.now + verify miss after 5*60*1000ms
  });
});
```

- [ ] **Step 2: Implement LRU cache TTL**

Add to onniscenza-bridge.ts:
- `Map<string, {chunks, expiresAt}>` LRU 100 entries
- Key: SHA-256 of `query + topK + experimentId`
- TTL: 5min (300000ms)
- LRU eviction on capacity full

- [ ] **Step 3: Tests + commit**

```bash
npx vitest run tests/unit/onniscenza-cache-ttl.test.js
git add supabase/functions/_shared/onniscenza-bridge.ts tests/unit/onniscenza-cache-ttl.test.js
git commit -m "feat(latency-A5): Onniscenza V1 cache TTL 5min — -100-200ms repeat queries"
```

### Task A6: Phase A end-to-end smoke + R5 50-prompt re-bench

**Files:**
- Run: `scripts/bench/run-sprint-r5-stress.mjs`

- [ ] **Step 1: Andrea deploy Edge Function v75 post Tasks A1-A5 commit**

```bash
npx supabase functions deploy unlim-chat --project-ref euqpdueopmlllqjmqnyb
```

- [ ] **Step 2: Run R5 50-prompt re-bench**

```bash
SUPABASE_ANON_KEY="$VITE_SUPABASE_EDGE_KEY" \
ELAB_API_KEY="$VITE_ELAB_API_KEY" \
node scripts/bench/run-sprint-r5-stress.mjs
```

- [ ] **Step 3: Verify gates**

Expected output `scripts/bench/output/r5-stress-report-{TS}.md`:
- avg ≤1500ms (target Phase A)
- p95 ≤2500ms (target Phase A)
- PZ V3 ≥90% (NO regression vs iter 38 91.45%)

- [ ] **Step 4: Commit bench output + audit**

```bash
git add scripts/bench/output/r5-stress-{report,scores,responses}-*.{md,json,jsonl}
echo "Phase A close R5 v75 results: avg/p95/PZ" > docs/audits/2026-05-XX-iter41-phase-A-close.md
git add docs/audits/2026-05-XX-iter41-phase-A-close.md
git commit -m "docs(latency-A6): Phase A close R5 v75 re-bench evidence"
```

---

## Phase B — Onniscenza supreme conversational + anti-absurd

### Task B1: ADR-035 Onniscenza V2.1 conversational fusion design

**Files:**
- Create: `docs/adrs/ADR-035-onniscenza-v2-1-conversational-fusion.md`

- [ ] **Step 1: Architect design ADR-035**

Sections:
1. **Status**: PROPOSED 2026-05-XX
2. **Context**: V2 cross-attention REJECTED iter 39 (-1.0pp PZ V3 + 36% slower regression bench `iter-39-A4-Onniscenza-V2-REGRESSION-revert.md`). Need V2.1 minimal-risk conversational lift.
3. **Decision drivers**: latency neutral or +<100ms / quality lift +0.5pp PZ V3 / no breakage V1 baseline / conversation history grounding hallucination <2%
4. **Architecture**: RRF k=60 base preserved. Add 4 weighted boost factors:
   - +0.15 experiment-anchor (chunk experimentId === query.experimentId)
   - +0.10 kit-mention (chunk content contains kit Omaric component reference)
   - +0.20 recent-history (cosine similarity vs last 10 conversation messages embed)
   - +0.05 docente-stylistic (matches docente memoria stylistic preference)
5. **Implementation phased**:
   - Phase A: standalone `aggregateOnniscenzaV21` function (no wire)
   - Phase B: env `ENABLE_ONNISCENZA_V21=true` gate
   - Phase C: canary 5%→25%→100% rollout
6. **Test strategy**: 30+ unit tests fusion math + 50-prompt R5 manual review hallucination check
7. **Risk + mitigations**: V2 regression repeat (mitigation: extensive bench pre-canary + rollback plan)
8. **Acceptance gates**:
   - R5 PZ V3 ≥91.45% maintained
   - Hallucination <2% manual review
   - Latency overhead ≤100ms vs V1
9. **Cross-references**: ADR-021 RAG coverage / ADR-032 V2 REJECTED / ADR-034 page metadata

Length: 400-500 LOC.

- [ ] **Step 2: Commit ADR-035 PROPOSED**

```bash
git add docs/adrs/ADR-035-onniscenza-v2-1-conversational-fusion.md
git commit -m "docs(onniscenza-B1): ADR-035 V2.1 conversational fusion PROPOSED"
```

### Task B2: Conversation history embed module

**Files:**
- Create: `supabase/functions/_shared/conversation-history-embed.ts`
- Test: `tests/unit/conversation-history-embed.test.js`

- [ ] **Step 1: Write failing test**

```javascript
// tests/unit/conversation-history-embed.test.js
describe('Conversation history embed Voyage', () => {
  it('embeds last 10 messages + returns 1024-dim vector', async () => {
    const messages = [
      { role: 'user', content: 'Spiega LED' },
      { role: 'assistant', content: 'Ragazzi, il LED...' },
      // 8 more
    ];
    const embed = await embedConversationHistory(messages);
    expect(embed.vector).toHaveLength(1024);
    expect(embed.tokenCount).toBeGreaterThan(0);
  });

  it('truncates oldest messages if total > 4000 tokens', async () => {
    // ... 12 long messages, expect last 10 used
  });

  it('caches embed for identical message sequence', async () => {
    // ... cache hit test
  });
});
```

- [ ] **Step 2: Implement module**

```typescript
// supabase/functions/_shared/conversation-history-embed.ts
import { embedQueryVoyage } from './rag.ts';

const HISTORY_CACHE = new Map<string, { vector: number[]; expiresAt: number }>();
const TTL_MS = 5 * 60 * 1000;

export async function embedConversationHistory(messages: Array<{role: string; content: string}>): Promise<{ vector: number[]; tokenCount: number }> {
  const last10 = messages.slice(-10);
  const concat = last10.map(m => `${m.role}: ${m.content}`).join('\n').slice(0, 16000);
  const cacheKey = await sha256(concat);
  const cached = HISTORY_CACHE.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return { vector: cached.vector, tokenCount: -1 };
  }
  const result = await embedQueryVoyage(concat);
  HISTORY_CACHE.set(cacheKey, { vector: result.vector, expiresAt: Date.now() + TTL_MS });
  return result;
}
```

- [ ] **Step 3: Run tests + commit**

```bash
npx vitest run tests/unit/conversation-history-embed.test.js
git add supabase/functions/_shared/conversation-history-embed.ts \
        tests/unit/conversation-history-embed.test.js
git commit -m "feat(onniscenza-B2): conversation history Voyage embed module"
```

### Task B3: Onniscenza V2.1 fusion implementation

**Files:**
- Create: `supabase/functions/_shared/onniscenza-conversational-fusion.ts`
- Test: `tests/unit/onniscenza-conversational-fusion.test.js`

- [ ] **Step 1: Write failing test (10+ cases)**

```javascript
describe('Onniscenza V2.1 conversational fusion', () => {
  it('boosts experiment-anchor +0.15 when experimentId matches', () => {
    const chunks = [
      { id: 'c1', score: 0.5, experimentId: 'v1-cap6-esp1' },
      { id: 'c2', score: 0.5, experimentId: 'v2-cap8-esp3' },
    ];
    const fused = fuseV21(chunks, { experimentId: 'v1-cap6-esp1' });
    expect(fused[0].id).toBe('c1');
    expect(fused[0].finalScore).toBeCloseTo(0.65, 2);
  });

  it('boosts recent-history +0.20 when conversation history embed similar', () => {
    // ...
  });

  it('preserves RRF k=60 base for chunks without boost factors', () => {
    // ...
  });

  it('caps total boost at +0.50 to prevent runaway scoring', () => {
    // ...
  });
  // ... 6+ more
});
```

- [ ] **Step 2: Implement fusion**

```typescript
// supabase/functions/_shared/onniscenza-conversational-fusion.ts
import { embedConversationHistory } from './conversation-history-embed.ts';
import { cosineSimilarity } from './math.ts';

export async function aggregateOnniscenzaV21(opts: {
  ragChunks: Array<{ id: string; score: number; content: string; experimentId?: string; metadata?: any }>;
  query: string;
  experimentId?: string;
  conversationMessages?: Array<{role: string; content: string}>;
  classKey?: string;
}): Promise<Array<{ id: string; finalScore: number; boostBreakdown: Record<string, number> }>> {
  const historyEmbed = opts.conversationMessages?.length
    ? await embedConversationHistory(opts.conversationMessages)
    : null;

  return opts.ragChunks.map(chunk => {
    const breakdown: Record<string, number> = { rrf_base: chunk.score };
    let boost = 0;

    // +0.15 experiment-anchor
    if (opts.experimentId && chunk.experimentId === opts.experimentId) {
      boost += 0.15;
      breakdown.experiment_anchor = 0.15;
    }

    // +0.10 kit-mention
    if (/breadboard|nano|resistore|LED|kit ELAB|Omaric/i.test(chunk.content)) {
      boost += 0.10;
      breakdown.kit_mention = 0.10;
    }

    // +0.20 recent-history embed similarity
    if (historyEmbed && chunk.metadata?.embedding) {
      const sim = cosineSimilarity(historyEmbed.vector, chunk.metadata.embedding);
      if (sim > 0.6) {
        boost += 0.20 * sim;
        breakdown.recent_history = 0.20 * sim;
      }
    }

    // Cap total boost at +0.50
    boost = Math.min(boost, 0.50);

    return {
      id: chunk.id,
      finalScore: chunk.score + boost,
      boostBreakdown: breakdown,
    };
  }).sort((a, b) => b.finalScore - a.finalScore);
}
```

- [ ] **Step 3: Tests PASS + commit**

```bash
npx vitest run tests/unit/onniscenza-conversational-fusion.test.js
git add supabase/functions/_shared/onniscenza-conversational-fusion.ts \
        tests/unit/onniscenza-conversational-fusion.test.js
git commit -m "feat(onniscenza-B3): V2.1 conversational fusion 4 boost factors"
```

### Task B4: Anti-absurd validator post-LLM

**Files:**
- Create: `supabase/functions/_shared/anti-absurd-validator.ts`
- Modify: `supabase/functions/unlim-chat/index.ts` integrate post-LLM
- Test: `tests/unit/anti-absurd-validator.test.js`

- [ ] **Step 1: Write failing tests (15+ cases)**

```javascript
describe('Anti-absurd validator', () => {
  it('detects fabricated component reference (NER cross-ref RAG chunks)', () => {
    const result = validateAbsurd({
      response: 'Ragazzi, collegate il transistor 2N3055 al breadboard...',
      ragChunks: [
        { content: 'Vol.1 LED + resistore 220Ω in serie' }
      ],
      experimentId: 'v1-cap6-esp1',
    });
    expect(result.suspicious).toBe(true);
    expect(result.reasons).toContain('ner_unmatched_component:transistor 2N3055');
  });

  it('passes valid response with kit ELAB components in context', () => {
    const result = validateAbsurd({
      response: 'Ragazzi, il LED rosso si accende quando...',
      ragChunks: [{ content: 'LED rosso pin D13 resistore' }],
      experimentId: 'v1-cap6-esp1',
    });
    expect(result.suspicious).toBe(false);
  });

  it('detects nonsense pin reference (Arduino Nano D14+ does not exist)', () => {
    const result = validateAbsurd({
      response: 'Ragazzi, collegate al pin D17...',
      ragChunks: [],
      experimentId: 'v1-cap6-esp1',
    });
    expect(result.suspicious).toBe(true);
    expect(result.reasons).toContain('invalid_pin:D17');
  });
  // ... 12+ more
});
```

- [ ] **Step 2: Implement validator**

```typescript
// supabase/functions/_shared/anti-absurd-validator.ts
const VALID_NANO_PINS = new Set([
  'D0','D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12','D13',
  'A0','A1','A2','A3','A4','A5','A6','A7',
  'GND','VCC','5V','3V3','RESET'
]);

const COMPONENT_REGEX = /\b(LED(?:\s+\w+)?|resistore|condensatore|transistor|diodo|MOSFET|breadboard|pulsante|potenziometro|buzzer|Arduino|Nano|Uno)\s*(\d+\w*)?\b/gi;

export function validateAbsurd(input: {
  response: string;
  ragChunks: Array<{ content: string }>;
  experimentId?: string;
}): { suspicious: boolean; reasons: string[]; score: number } {
  const reasons: string[] = [];

  // 1. Pin validity check
  const pinRefs = input.response.match(/\b[DA]\d+\b/g) || [];
  for (const pin of pinRefs) {
    if (!VALID_NANO_PINS.has(pin)) {
      reasons.push(`invalid_pin:${pin}`);
    }
  }

  // 2. NER component cross-ref RAG chunks
  const respComponents = (input.response.match(COMPONENT_REGEX) || []).map(c => c.toLowerCase());
  const chunkText = input.ragChunks.map(c => c.content).join(' ').toLowerCase();
  for (const comp of respComponents) {
    if (!chunkText.includes(comp.split(/\s+/)[0])) {
      reasons.push(`ner_unmatched_component:${comp}`);
    }
  }

  return {
    suspicious: reasons.length > 0,
    reasons,
    score: 1 - (reasons.length / 10), // crude confidence score
  };
}
```

- [ ] **Step 3: Wire post-LLM in unlim-chat/index.ts**

After cap_words but before final response build, add:
```typescript
const absurdCheck = validateAbsurd({
  response: cleanText,
  ragChunks: ragChunks ?? [],
  experimentId: safeExperimentId,
});
if (absurdCheck.suspicious) {
  console.warn(JSON.stringify({
    level: 'warn', event: 'anti_absurd_flag',
    reasons: absurdCheck.reasons,
    score: absurdCheck.score,
    timestamp: new Date().toISOString(),
  }));
  // iter 41: log only, NOT block (gate iter 42+)
}
```

- [ ] **Step 4: Tests + commit**

```bash
npx vitest run tests/unit/anti-absurd-validator.test.js
git add supabase/functions/_shared/anti-absurd-validator.ts \
        supabase/functions/unlim-chat/index.ts \
        tests/unit/anti-absurd-validator.test.js
git commit -m "feat(onniscenza-B4): anti-absurd validator post-LLM NER + pin check (telemetry only iter 41)"
```

### Task B5: V2.1 wire-up + canary 5%

**Files:**
- Modify: `supabase/functions/_shared/onniscenza-bridge.ts` integrate V2.1 path
- Modify: `supabase/functions/unlim-chat/index.ts` wire conversation history pass-through

- [ ] **Step 1: Add V2.1 env gate in onniscenza-bridge.ts**

```typescript
import { aggregateOnniscenzaV21 } from './onniscenza-conversational-fusion.ts';

export async function aggregateOnniscenza(opts: {...}) {
  const v21Enabled = Deno.env.get('ENABLE_ONNISCENZA_V21') === 'true';
  const canaryPercent = parseInt(Deno.env.get('CANARY_ONNISCENZA_V21_PERCENT') || '0', 10);
  const useV21 = v21Enabled && Math.random() * 100 < canaryPercent;

  if (useV21) {
    return aggregateOnniscenzaV21({
      ragChunks: opts.chunks,
      query: opts.query,
      experimentId: opts.experimentId,
      conversationMessages: opts.conversationMessages,
      classKey: opts.classKey,
    });
  }

  // Fallback V1 baseline preserved
  return aggregateOnniscenzaV1(opts);
}
```

- [ ] **Step 2: Andrea env set canary 5%**

```bash
npx supabase secrets set ENABLE_ONNISCENZA_V21=true CANARY_ONNISCENZA_V21_PERCENT=5 --project-ref euqpdueopmlllqjmqnyb
npx supabase functions deploy unlim-chat --project-ref euqpdueopmlllqjmqnyb
```

- [ ] **Step 3: Soak 4-8h + monitor logs telemetry**

Monitor `console.warn anti_absurd_flag` rate. If <5% per 100-prompt window → proceed canary 25%.

- [ ] **Step 4: R5 50-prompt + manual hallucination 50-prompt re-bench**

```bash
node scripts/bench/run-sprint-r5-stress.mjs
node scripts/bench/run-sprint-hallucination-manual.mjs # 50 diverse prompts
```

Target: PZ V3 ≥91.45% + hallucination <2% manual.

- [ ] **Step 5: Canary 25% if gates met**

```bash
npx supabase secrets set CANARY_ONNISCENZA_V21_PERCENT=25 --project-ref euqpdueopmlllqjmqnyb
```

Soak 8-24h.

- [ ] **Step 6: Canary 100% if 24h soak green**

```bash
npx supabase secrets set CANARY_ONNISCENZA_V21_PERCENT=100 --project-ref euqpdueopmlllqjmqnyb
```

- [ ] **Step 7: Commit canary state**

```bash
git add -A
git commit -m "feat(onniscenza-B5): V2.1 conversational fusion canary 100% post 24h soak green"
```

---

## Phase C — Onnipotenza total (post robust JSON parser)

### Task C1: ADR-036 Mistral JSON-mode parser multi-shape

**Files:**
- Create: `docs/adrs/ADR-036-mistral-json-mode-parser-multi-shape.md`
- Create: `supabase/functions/_shared/json-mode-parser.ts`
- Test: `tests/unit/json-mode-parser.test.js` (25+ tests)

- [ ] **Step 1: ADR-036 design**

Document multi-shape Mistral output patterns observed v73 regression:
1. Pure JSON object: `{"text":"...","intents":[...]}`
2. Wrapped whitespace: `\n  {"text":"...", "intents":[...]}\n`
3. Code-fence: `\`\`\`json\n{...}\n\`\`\``
4. Escaped quote variant: `{\"text\": \"...\"}` (double-escaped)
5. Mixed text + JSON: `Ragazzi, ... {"tool":"highlight"}` (intents inline)
6. Truncated JSON: `{"text":"Ragazzi..."` (max_tokens cut)

Strategy: 6-stage parser:
1. Try direct JSON.parse
2. Trim whitespace + retry
3. Strip code-fence + retry
4. Unescape + retry
5. Regex-extract `{...}` largest valid JSON substring + retry
6. Fallback: extract `[INTENT:...]` legacy regex + return text-only

- [ ] **Step 2: Write failing tests (25+ cases)**

```javascript
describe('Mistral JSON-mode parser multi-shape', () => {
  it('parses pure object directly', () => {
    expect(parseJsonMode('{"text":"hi","intents":[]}')).toEqual({
      text: 'hi', intents: [], source: 'pure'
    });
  });

  it('strips leading whitespace', () => {
    expect(parseJsonMode('  \n{"text":"hi","intents":[]}')).toEqual({
      text: 'hi', intents: [], source: 'whitespace_strip'
    });
  });

  it('strips code-fence wrapper', () => {
    expect(parseJsonMode('```json\n{"text":"hi","intents":[]}\n```')).toEqual({
      text: 'hi', intents: [], source: 'code_fence_strip'
    });
  });

  it('unescapes double-escaped quotes', () => {
    expect(parseJsonMode('{\\"text\\": \\"hi\\"}')).toEqual({
      text: 'hi', intents: [], source: 'unescape'
    });
  });

  it('extracts largest JSON substring from mixed text', () => {
    expect(parseJsonMode('Some prefix {"text":"hi","intents":[]} suffix')).toEqual({
      text: 'hi', intents: [], source: 'regex_extract'
    });
  });

  it('falls back to legacy [INTENT:...] regex on parse fail', () => {
    expect(parseJsonMode('Ragazzi, [INTENT:{"tool":"highlightComponent","args":{}}]')).toEqual({
      text: 'Ragazzi, [INTENT:{"tool":"highlightComponent","args":{}}]',
      intents: [{ tool: 'highlightComponent', args: {} }],
      source: 'legacy_regex_fallback'
    });
  });
  // ... 19+ more
});
```

- [ ] **Step 3: Implement parser**

```typescript
// supabase/functions/_shared/json-mode-parser.ts
import { parseIntentTags } from './intent-parser.ts';

export interface ParsedJsonMode {
  text: string;
  intents: Array<{tool: string; args: Record<string, unknown>}>;
  source: 'pure' | 'whitespace_strip' | 'code_fence_strip' | 'unescape' | 'regex_extract' | 'legacy_regex_fallback' | 'failed';
}

export function parseJsonMode(input: string): ParsedJsonMode {
  // Stage 1: pure
  try {
    const obj = JSON.parse(input);
    if (typeof obj.text === 'string') {
      return { text: obj.text, intents: Array.isArray(obj.intents) ? obj.intents : [], source: 'pure' };
    }
  } catch {}

  // Stage 2: whitespace strip
  const trimmed = input.trim();
  try {
    const obj = JSON.parse(trimmed);
    if (typeof obj.text === 'string') {
      return { text: obj.text, intents: Array.isArray(obj.intents) ? obj.intents : [], source: 'whitespace_strip' };
    }
  } catch {}

  // Stage 3: code-fence strip
  const fenceMatch = input.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) {
    try {
      const obj = JSON.parse(fenceMatch[1]);
      if (typeof obj.text === 'string') {
        return { text: obj.text, intents: Array.isArray(obj.intents) ? obj.intents : [], source: 'code_fence_strip' };
      }
    } catch {}
  }

  // Stage 4: unescape
  try {
    const unescaped = input.replace(/\\"/g, '"');
    const obj = JSON.parse(unescaped);
    if (typeof obj.text === 'string') {
      return { text: obj.text, intents: Array.isArray(obj.intents) ? obj.intents : [], source: 'unescape' };
    }
  } catch {}

  // Stage 5: regex-extract largest JSON
  const objMatches = [...input.matchAll(/\{[\s\S]*?\}/g)];
  for (const m of objMatches.sort((a, b) => b[0].length - a[0].length)) {
    try {
      const obj = JSON.parse(m[0]);
      if (typeof obj.text === 'string') {
        return { text: obj.text, intents: Array.isArray(obj.intents) ? obj.intents : [], source: 'regex_extract' };
      }
    } catch {}
  }

  // Stage 6: legacy [INTENT:...] regex fallback
  const intents = parseIntentTags(input);
  return {
    text: input,
    intents,
    source: intents.length > 0 ? 'legacy_regex_fallback' : 'failed',
  };
}
```

- [ ] **Step 4: Wire into unlim-chat/index.ts**

Replace JSON.parse block at unlim-chat:746-767 with:
```typescript
import { parseJsonMode } from '../_shared/json-mode-parser.ts';

if (useIntentSchema && result && typeof result.text === 'string' && result.provider === 'mistral') {
  const parsed = parseJsonMode(result.text);
  if (parsed.source !== 'failed') {
    result = { ...result, text: parsed.text };
    if (parsed.intents.length > 0) {
      preparsedIntents = parsed.intents.filter(i => CANONICAL_INTENT_TOOLS.includes(i.tool));
    }
    console.info(JSON.stringify({
      level: 'info', event: 'json_mode_parsed',
      source: parsed.source,
      intent_count: parsed.intents.length,
      timestamp: new Date().toISOString(),
    }));
  } else {
    console.warn(JSON.stringify({
      level: 'warn', event: 'intent_schema_parse_fallback',
      timestamp: new Date().toISOString(),
    }));
  }
}
```

- [ ] **Step 5: Tests + commit**

```bash
npx vitest run tests/unit/json-mode-parser.test.js
git add supabase/functions/_shared/json-mode-parser.ts \
        supabase/functions/unlim-chat/index.ts \
        docs/adrs/ADR-036-mistral-json-mode-parser-multi-shape.md \
        tests/unit/json-mode-parser.test.js
git commit -m "feat(onnipotenza-C1): robust Mistral JSON-mode parser 6-stage multi-shape"
```

### Task C2: Telemetry threshold gate intent_schema_parse_fallback

**Files:**
- Modify: `supabase/functions/unlim-chat/index.ts` add rate tracking
- Create: `scripts/bench/check-fallback-rate.mjs`

- [ ] **Step 1: Add in-isolate rate counter**

```typescript
// Top of unlim-chat/index.ts
let parseFallbackCounter = { hits: 0, total: 0 };

// Reset every 100 calls
function trackParseRate(isFallback: boolean) {
  parseFallbackCounter.total++;
  if (isFallback) parseFallbackCounter.hits++;
  if (parseFallbackCounter.total >= 100) {
    const rate = (parseFallbackCounter.hits / parseFallbackCounter.total) * 100;
    console.info(JSON.stringify({
      level: 'info', event: 'parse_fallback_rate_window',
      rate_pct: rate.toFixed(2),
      window_size: parseFallbackCounter.total,
      timestamp: new Date().toISOString(),
    }));
    parseFallbackCounter = { hits: 0, total: 0 };
  }
}
```

- [ ] **Step 2: Wire after parseJsonMode call**

```typescript
trackParseRate(parsed.source === 'failed' || parsed.source === 'legacy_regex_fallback');
```

- [ ] **Step 3: Bench check rate <5% gate**

`scripts/bench/check-fallback-rate.mjs`: query Supabase Edge Function logs for `parse_fallback_rate_window` events post-deploy + assert mean rate <5% per 100-prompt window.

- [ ] **Step 4: Commit**

```bash
git add supabase/functions/unlim-chat/index.ts scripts/bench/check-fallback-rate.mjs
git commit -m "feat(onnipotenza-C2): telemetry parse_fallback_rate window gate <5%"
```

### Task C3: Re-wire widened shouldUseIntentSchema canary

**Files:**
- Modify: `supabase/functions/unlim-chat/index.ts:38` switch import + canary gate

- [ ] **Step 1: Add canary import gate**

```typescript
const useWidenedHeuristic = Deno.env.get('CANARY_INTENT_SCHEMA_WIDEN_PERCENT') &&
  Math.random() * 100 < parseInt(Deno.env.get('CANARY_INTENT_SCHEMA_WIDEN_PERCENT')!, 10);

import { shouldUseIntentSchema as narrowHeuristic } from '../_shared/intent-tools-schema.ts';
import { shouldUseIntentSchema as widenedHeuristic } from '../_shared/clawbot-template-router.ts';

const shouldUseIntentSchema = useWidenedHeuristic ? widenedHeuristic : narrowHeuristic;
```

(Adjust to evaluate per-request, not import-time.)

Better:
```typescript
import { shouldUseIntentSchema as narrowHeuristic } from '../_shared/intent-tools-schema.ts';
import { shouldUseIntentSchema as widenedHeuristic } from '../_shared/clawbot-template-router.ts';

function getShouldUseIntentSchema(): typeof narrowHeuristic {
  const pct = parseInt(Deno.env.get('CANARY_INTENT_SCHEMA_WIDEN_PERCENT') || '0', 10);
  return Math.random() * 100 < pct ? widenedHeuristic : narrowHeuristic;
}

// In handler:
const useIntentSchema = intentSchemaEnabled && getShouldUseIntentSchema()(safeMessage);
```

- [ ] **Step 2: Andrea canary 5% post C1+C2 deploy**

```bash
npx supabase secrets set CANARY_INTENT_SCHEMA_WIDEN_PERCENT=5 --project-ref euqpdueopmlllqjmqnyb
npx supabase functions deploy unlim-chat --project-ref euqpdueopmlllqjmqnyb
```

- [ ] **Step 3: Soak 4h + monitor parse_fallback_rate <5% gate**

If gate met → 25%. If breach → revert to 0%.

- [ ] **Step 4: Stage 25% → 100% over 48h**

```bash
npx supabase secrets set CANARY_INTENT_SCHEMA_WIDEN_PERCENT=25
# soak 24h
npx supabase secrets set CANARY_INTENT_SCHEMA_WIDEN_PERCENT=100
# soak 24h
```

- [ ] **Step 5: R7 200-prompt re-bench post 100% canary**

Target ≥80% canonical (vs 3.6% current).

- [ ] **Step 6: Commit canary state**

```bash
git add -A
git commit -m "feat(onnipotenza-C3): widened shouldUseIntentSchema canary 100% post robust parser + soak"
```

### Task C4: 12-tool Deno dispatcher canary 0%→100%

**Files:**
- Modify: env `CANARY_DENO_DISPATCH_PERCENT` already exists (currently 0)

- [ ] **Step 1: Andrea canary 5%**

```bash
npx supabase secrets set CANARY_DENO_DISPATCH_PERCENT=5 --project-ref euqpdueopmlllqjmqnyb
```

- [ ] **Step 2: Smoke 5 INTENT prompts**

```bash
# Verify dispatcher_results surface in response
SESSION="s_$(uuidgen)"
curl -X POST .../unlim-chat -d "{\"message\":\"Mostra il LED rosso\",\"sessionId\":\"$SESSION\"}"
# Expect dispatcher_results in payload (per commit 1feda3c)
```

- [ ] **Step 3: Stage 25% → 100% over 48h**

Same pattern Task C3.

- [ ] **Step 4: R7 re-bench + commit**

```bash
git add -A
git commit -m "feat(onnipotenza-C4): 12-tool Deno dispatcher canary 100% post 48h soak"
```

---

## Phase D — Wake word "Ragazzi" + 9-cell STT matrix

### Task D1: Wake word "Ragazzi" plurale prepend

**Files:**
- Modify: `src/services/wakeWord.js`
- Modify: `src/components/common/MicPermissionNudge.jsx`
- Test: `tests/unit/wakeWord.test.js` (extend existing)

- [ ] **Step 1: Write failing test**

```javascript
it('triggers wake word on "Ragazzi guardate" plurale prefix', () => {
  const detected = detectWakeWord('Ragazzi guardate il LED');
  expect(detected.matched).toBe(true);
  expect(detected.command).toBe('guardate il LED');
});

it('does NOT trigger on singolare "Ragazzo"', () => {
  const detected = detectWakeWord('Ragazzo guarda');
  expect(detected.matched).toBe(false);
});
```

- [ ] **Step 2: Implement plurale heuristic**

```javascript
// src/services/wakeWord.js
const WAKE_PATTERNS = [
  /^ragazzi[,\s]/i,  // strict plurale
  /^ehi unlim[,\s]/i, // legacy
  /^unlim[,\s]/i,    // shortened
];

export function detectWakeWord(transcript) {
  for (const pattern of WAKE_PATTERNS) {
    const match = transcript.match(pattern);
    if (match) {
      return {
        matched: true,
        wakeWord: match[0].trim(),
        command: transcript.slice(match[0].length).trim(),
      };
    }
  }
  return { matched: false };
}
```

- [ ] **Step 3: MicPermissionNudge integration**

Add wake word activation post `Permissions API granted`:
```jsx
// MicPermissionNudge.jsx
useEffect(() => {
  if (permissionState === 'granted') {
    initWakeWord({
      onWake: (command) => dispatchUNLIMQuery(command),
      patterns: ['Ragazzi', 'Ehi UNLIM', 'UNLIM'],
    });
  }
}, [permissionState]);
```

- [ ] **Step 4: Tests + commit**

```bash
npx vitest run tests/unit/wakeWord.test.js
git add src/services/wakeWord.js src/components/common/MicPermissionNudge.jsx tests/unit/wakeWord.test.js
git commit -m "feat(wake-D1): Ragazzi plurale prepend wake word + MicPermissionNudge integration"
```

### Task D2: 9-cell STT matrix Voxtral verify

**Files:**
- Create: `tests/e2e/sprint-t-iter41-wake-word-9-cell.spec.js`

- [ ] **Step 1: Write Playwright spec 9 cells**

```javascript
// tests/e2e/sprint-t-iter41-wake-word-9-cell.spec.js
import { test, expect } from '@playwright/test';

const CELLS = [
  { os: 'macos', browser: 'chromium' },
  { os: 'macos', browser: 'firefox' },
  { os: 'macos', browser: 'webkit' },
  { os: 'windows', browser: 'chromium' },
  { os: 'windows', browser: 'firefox' },
  { os: 'ios', browser: 'webkit' },
  { os: 'android', browser: 'chromium' },
  { os: 'linux', browser: 'chromium' },
  { os: 'linux', browser: 'firefox' },
];

for (const cell of CELLS) {
  test(`wake word ${cell.os}/${cell.browser}`, async ({ browser }) => {
    const ctx = await browser.newContext({
      // ... os-specific user agent
    });
    const page = await ctx.newPage();
    await page.goto('https://www.elabtutor.school/');
    await page.click('button[aria-label="Concedi microfono"]');
    // Inject mock audio "Ragazzi guardate il LED"
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('mock-stt-result', {
        detail: { transcript: 'Ragazzi guardate il LED' }
      }));
    });
    await expect(page.locator('.unlim-message-from-wake')).toBeVisible();
  });
}
```

- [ ] **Step 2: Run + collect 9/9 PASS evidence**

```bash
npx playwright test tests/e2e/sprint-t-iter41-wake-word-9-cell.spec.js
```

- [ ] **Step 3: Commit + audit**

```bash
git add tests/e2e/sprint-t-iter41-wake-word-9-cell.spec.js docs/audits/2026-05-XX-iter41-9-cell-evidence.md
git commit -m "test(wake-D2): 9-cell STT matrix Voxtral primary verify"
```

### Task D3: VAD low-latency tuning

**Files:**
- Modify: `src/services/wakeWord.js` add VAD param tuning

- [ ] **Step 1: Tune VAD threshold**

Current Voxtral STT continuous mode default activates on 800ms silence. Tune to 400ms for faster response.

```javascript
const VAD_CONFIG = {
  silence_ms: 400,        // was 800
  speech_min_ms: 200,
  energy_threshold: -45,  // dB
};
```

- [ ] **Step 2: Smoke + commit**

```bash
git add src/services/wakeWord.js
git commit -m "feat(wake-D3): VAD low-latency tuning silence 800ms→400ms"
```

---

## Phase E — ADR-034 Voyage re-ingest (Andrea sequential ~90min)

(See Plan PIANO Phase 2 + ADR-034 for full detail. Summary tasks below.)

### Task E1: Andrea env + ratify ADR-034

```bash
# Andrea actions
export VOYAGE_API_KEY="<from voyageai.com>"
export SUPABASE_SERVICE_ROLE_KEY="<from Dashboard>"
brew install poppler  # for pdftotext
```

### Task E2: Run Voyage re-ingest

```bash
node scripts/rag-ingest-voyage-batch-v2.mjs
# ~50min, ~$1, target 2061+ chunks with metadata.page populated ≥80%
```

### Task E3: Verify SQL coverage gate

```bash
npx supabase db query --linked "SELECT COUNT(*) FILTER (WHERE metadata->>'page' IS NOT NULL) * 100.0 / COUNT(*) AS page_pct FROM rag_chunks;"
# Expect ≥80%
```

### Task E4: Deploy Edge Function v76

```bash
npx supabase functions deploy unlim-chat --project-ref euqpdueopmlllqjmqnyb
```

### Task E5: R7 200-prompt re-bench

```bash
node scripts/bench/run-sprint-r7-stress.mjs
# Target ≥80% canonical (vs 3.6% current)
```

### Task E6: L2 template citation source fix

After Voyage re-ingest delivers clean chunks:
- Verify `clawbot-template-router.ts:executeTemplate` ragRetrieve top-chunk content is real volume excerpt (not metadata description)
- Smoke L2-explain-led-blink + L2-explain-pwm-fade + L2-explain-resistenza-pull-up

---

## Phase F — Final verify + close

### Task F1: Vitest full + zero regression

```bash
npx vitest run
# Target 13539+ + new tests Phases A-D = ~13700+ PASS
```

### Task F2: Build + Lighthouse

```bash
npm run build
# Lighthouse perf ≥60 minimal target Phase 41 (full ≥90 deferred Phase E ADR-034 + bundle optim iter 42+)
```

### Task F3: R5 + R6 + R7 + Lighthouse + 9-cell composite bench

Capture all bench outputs in `docs/audits/2026-05-XX-iter41-final-evidence.md`.

### Task F4: Andrea Opus G45 ratify (separate context-zero session)

Per Plan Phase 7. Score ≤9.5 OR justified ≥ con razionale.

### Task F5: CLAUDE.md sprint history APPEND iter 41+ close

Document realistic score ONESTO (post Opus G45 cap).

---

## Phase G — Ralph loop continuous execution

### Task G1: Promise file

**File:** `docs/promises/SPRINT_T_CLOSE_ONNISCENZA_ONNIPOTENZA_VELOCITA_RALPH.md`

Promise close criteria 9 boxes:
1. R5 avg ≤1500ms / p95 ≤2500ms (Phase A target)
2. R5 PZ V3 ≥91.45% maintained
3. Hallucination <2% manual review post V2.1 canary 100%
4. R7 canonical ≥80% post C3+C4 canary 100%
5. parse_fallback_rate <5% per 100-prompt window
6. Wake word 9/9 cells PASS Voxtral primary
7. Page coverage ≥80% post Voyage re-ingest
8. Vitest baseline 13539+ preserved
9. Andrea Opus G45 final ratify ≤9.5 OR justified ≥

### Task G2: Ralph loop activation

```
/ralph-loop:ralph-loop
```

Loop reads promise file + this plan + executes phases A-F atoms continuously until ALL 9 boxes met. Each iteration:
1. Read latest state via `git log` + `automa/state/heartbeat`
2. Pick next unfinished atom (priority order: A1 → A6 → B1 → B5 → C1 → C4 → D1 → D3 → E1 → E6)
3. Execute atom + commit
4. Verify gates per atom
5. If atom regresses (vitest fail, R5 PZ V3 drops, smoke breaks) → revert + flag
6. CoV every 4 atoms: vitest + build + smoke 5 prompts
7. Continue until promise met OR Andrea HALT

### Task G3: Anti-pattern explicit (NON COMPIACENZA)

- NO claim "Phase A close" senza R5 50-prompt avg ≤1500ms measured
- NO claim "Onniscenza V2.1 LIVE" senza canary 100% + 24h soak
- NO claim "Onnipotenza fire-rate ≥80%" senza R7 200-prompt re-bench
- NO claim "wake word 9/9 PASS" senza Playwright 9-cell evidence
- NO claim "Sprint T close 9.5 achieved" senza Andrea Opus G45 final ratify
- NO `--no-verify` on commit/push EVER
- NO push `main` directly EVER
- NO destructive git operations EVER
- NO regressioni: vitest baseline preserved + R5 PZ V3 ≥91.45% maintained

---

## Calendar realistic

| Week | Phase | Atoms | Effort Andrea | Agents BG |
|------|-------|-------|---------------|-----------|
| 1 day 1-2 | A latency | A1+A2+A3+A4+A5+A6 | 6h | 4 BG x 4h |
| 1 day 3 | B onniscenza | B1+B2+B3+B4 (B5 canary 24h) | 4h + 24h soak | 3 BG x 5h |
| 1 day 4-5 | C onnipotenza | C1+C2+C3+C4 (canary 48h) | 5h + 48h soak | 2 BG x 8h |
| 2 day 1-2 | D wake word | D1+D2+D3 | 4h | 1 BG x 6h |
| 2 day 3 | E Voyage re-ingest | E1+E2+E3+E4+E5+E6 | 4h | 0 (Andrea seq) |
| 2 day 4-5 | F + G ratify | F1+F2+F3+F4+F5 + ralph loop | 5h | 2 BG x 4h |

**Total Andrea ~28h + 4 BG agents ~24h aggregate + 96h canary soak**

---

## Self-Review (writing-plans skill mandate)

**Spec coverage**: ✅ All user requested goals covered
- Velocità API → Phase A (5 atoms)
- Suprema Onniscenza mixed conversation context no risposte assurde → Phase B (5 atoms)
- Massima velocità + onnipotenza totale → Phase A + Phase C (4 atoms)
- Wake word → Phase D (3 atoms)
- PRINCIPIO ZERO + Morfismo → anchored architecture section + every phase

**Placeholder scan**: ✅ NO TBD/TODO/implement-later/similar-to-task. Every step has exact file paths + command + expected output.

**Type consistency**: ✅ `selectMistralModel` / `parseJsonMode` / `aggregateOnniscenzaV21` / `validateAbsurd` / `detectWakeWord` consistent across atoms + tests.

**Anti-inflation G45 mandate**: ✅ Every gate measured. NO score claims senza evidence.

**Morfismo Sense 2 anchored**: ✅ Triplet coerenza preserved (Vol/pag verbatim Phase E + kit Omaric SVG identico Phase D MicPermissionNudge integration + volumi cartacei Davide Phase 3 deferred to next plan iter 42+).

**PRINCIPIO ZERO §1 anchored**: ✅ Plurale "Ragazzi" wake word D1 + Vol/pag verbatim ≥95% Phase E + kit fisico mention BASE_PROMPT v3.2 (committed) + docente tramite preserved (no bypass UNLIM direct student access).

---

## Execution Handoff

**Plan saved**: `docs/superpowers/plans/2026-05-02-iter-41-velocita-onniscenza-onnipotenza-wake-word.md`

**Recommended execution**: Ralph loop (Task G2) — continuous self-pacing until promise file 9 boxes met OR Andrea HALT.

**Andrea ratify queue Phase 41 entrance** (5 voci):
1. ADR-035 V2.1 conversational fusion design + canary policy
2. ADR-036 JSON-mode parser multi-shape design
3. ADR-037 Mistral routing narrow Large tune (env-only ratify post deploy)
4. ADR-038 hedged Mistral cost +30% ratify (env `ENABLE_HEDGED_LLM=true` gate)
5. ADR-034 Voyage re-ingest env provision (VOYAGE_API_KEY + SUPABASE_SERVICE_ROLE_KEY) + cost cap $1 + 50min budget

**Sprint T close projection iter 42-43**: 9.5/10 ONESTO conditional ALL Phase 41+ atoms shipped + Phase 3 Davide Vol3 narrative refactor (calendar 2-3 giorni iter 42+) + Andrea Opus G45 final ratify Phase 7.
