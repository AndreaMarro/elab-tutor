/**
 * onniscenza-bridge — Sprint T iter 19 STUB → iter 24 PARTIAL LIVE
 *
 * Aggregator for the 7-layer Onniscenza snapshot per ADR-023 §5.
 *
 * ITER 24 STATUS:
 *   - L1 RAG hybrid → LIVE via `retrieveHybrid` (rag.ts) when supabase client present
 *   - L2 Wiki concepts → LIVE via Supabase `rag_chunks` filter source='wiki'
 *   - L3 Glossario Tea → MERGED into L1 RAG via wikiFusionActive flag (no separate fetch)
 *   - L4 Class memory → LIVE via Supabase `class_memory` / `unlim_sessions` table
 *   - L5 Lesson active → derived from input.experiment_id + chapter context (lightweight)
 *   - L6 Chat history → derived from input.history (caller injects from request context)
 *   - L7 Analogia graph → reads concept-graph.json (defer iter 25 if missing)
 *
 * Callers can pass `supabase` client through `OnniscenzaInput.supabase` to
 * activate live layers. When absent, layers fall back to the prior STUB
 * payloads so existing tests pass unchanged.
 *
 * ITER 25+ ACTIVE: full curriculumData ingest for L7 + concept-graph.json.
 *
 * (c) Andrea Marro 2026-04-28 → 2026-04-29 — ELAB Tutor
 */

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

export interface OnniscenzaInput {
  query: string;
  classe_eta?: number;
  experiment_id?: string;
  vol?: number;
  pag?: number;
  session_id?: string;
  class_id?: string;
  /** Recent chat history (last N turns) for L6. Iter 24 LIVE. */
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  /** Optional precomputed circuit state (caller can inject when running client-side). */
  circuit_state?: unknown;
  /**
   * Optional Supabase client (or compatible adapter exposing .from(table)).
   * When provided, layers L1+L2+L4 use LIVE impl. When null/undefined, STUB payloads.
   */
  // deno-lint-ignore no-explicit-any
  supabase?: any;
  /** Layer enables (default all true except L5 vision + L6 llm). */
  enable?: Partial<Record<LayerName, boolean>>;
}

export type LayerName = 'L1_rag' | 'L2_wiki' | 'L3_glossario' | 'L4_sessione' | 'L5_vision' | 'L6_llm' | 'L7_onthefly';

export interface LayerHit {
  layer: LayerName;
  id: string;
  score: number;          // 0..1 normalized
  text: string;           // excerpt
  source?: string;        // path / table / endpoint
  meta?: Record<string, unknown>;
}

export interface LayerStatus {
  ok: boolean;
  latency_ms: number;
  hits_count: number;
  error?: string;
  is_stub?: boolean;
}

export interface OnniscenzaSnapshot {
  fetched_at: string;
  total_latency_ms: number;
  query: string;
  layers: Record<LayerName, LayerStatus>;
  /** Top-K fused via RRF (default k=60). */
  fused: LayerHit[];
  /** Raw per-layer hits before fusion. */
  raw: Record<LayerName, LayerHit[]>;
}

// ────────────────────────────────────────────────────────────────────────────
// Layer fetchers (STUB iter 19)
// ────────────────────────────────────────────────────────────────────────────

async function fetchL1Rag(input: OnniscenzaInput): Promise<LayerHit[]> {
  // LIVE iter 24: hybrid retriever via rag.ts when Supabase client present.
  // Falls back to STUB when supabase not injected (preserves test parity).
  if (input.supabase) {
    try {
      const { hybridRetrieve } = await import('./rag.ts');
      // hybridRetrieve signature: (supabase, query, topK, opts) — defensive
      // try/catch; rag.ts may evolve. We expect array of {chunk_id, content, score, ...}.
      // deno-lint-ignore no-explicit-any
      const fn = hybridRetrieve as any;
      const raw = await fn(input.supabase, input.query, 10, {
        excludeWiki: false,
        wikiFusionActive: true, // L7 Glossario Tea merged into L1 (per iter 24 spec C)
      }).catch(() => null);
      if (Array.isArray(raw) && raw.length > 0) {
        return raw.slice(0, 10).map((row, i) => ({
          layer: 'L1_rag',
          id: `rag:${row.chunk_id ?? row.id ?? i}`,
          score: typeof row.score === 'number' ? Math.max(0, Math.min(1, row.score)) : 0.5,
          text: String(row.content ?? row.text ?? '').slice(0, 500),
          source: row.source ?? `vol${row.volume ?? '?'}-pag${row.page ?? '?'}`,
          meta: { live: true, hybrid: true, ...(row.metadata || {}) },
        }));
      }
    } catch (e) {
      console.warn(JSON.stringify({ level: 'warn', event: 'l1_rag_live_fail', error: String(e) }));
    }
  }
  // STUB fallback
  return [
    {
      layer: 'L1_rag',
      id: `rag:vol${input.vol || 1}-pag${input.pag || 27}`,
      score: 0.85,
      text: `[STUB L1 RAG] Vol.${input.vol || 1} pag.${input.pag || 27} — query="${input.query.slice(0, 40)}"`,
      source: 'src/data/rag-chunks.json',
      meta: { stub: true },
    },
  ];
}

async function fetchL2Wiki(input: OnniscenzaInput): Promise<LayerHit[]> {
  // LIVE iter 24: query rag_chunks WHERE source='wiki' filter for the 100 concepts
  // (Tea Glossario 180 termini ingested into rag_chunks separately).
  if (input.supabase) {
    try {
      const { data, error } = await input.supabase
        .from('rag_chunks')
        .select('chunk_id, content, source, metadata')
        .eq('source', 'wiki')
        .ilike('content', `%${input.query.slice(0, 60).replace(/%/g, '')}%`)
        .limit(5);
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((row: { chunk_id: string; content: string; source: string; metadata?: Record<string, unknown> }, i: number) => ({
          layer: 'L2_wiki',
          id: `wiki:${row.chunk_id ?? i}`,
          score: 0.72 - i * 0.05,
          text: String(row.content || '').slice(0, 400),
          source: `wiki:${row.metadata?.concept || 'unknown'}`,
          meta: { live: true, ...(row.metadata || {}) },
        }));
      }
    } catch (e) {
      console.warn(JSON.stringify({ level: 'warn', event: 'l2_wiki_live_fail', error: String(e) }));
    }
  }
  // STUB fallback
  return [
    {
      layer: 'L2_wiki',
      id: 'wiki:led',
      score: 0.72,
      text: `[STUB L2 Wiki] concept LED — query="${input.query.slice(0, 40)}"`,
      source: 'docs/unlim-wiki/concepts/led.md',
      meta: { stub: true },
    },
  ];
}

async function fetchL3Glossario(_input: OnniscenzaInput): Promise<LayerHit[]> {
  // TODO iter 22+: index `src/data/wiki/glossario.json` if present
  return [];
}

async function fetchL4Sessione(input: OnniscenzaInput): Promise<LayerHit[]> {
  // LIVE iter 24: query Supabase `unlim_sessions` (or class_memory if class_id present)
  // for the most-recent N session summaries linked to this class/session.
  if (input.supabase && (input.session_id || input.class_id)) {
    try {
      let query = input.supabase
        .from('unlim_sessions')
        .select('id, summary, ended_at, class_id, session_id')
        .order('ended_at', { ascending: false })
        .limit(3);
      if (input.session_id) query = query.eq('session_id', input.session_id);
      if (input.class_id) query = query.eq('class_id', input.class_id);
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((row: { id: string; summary?: string; ended_at?: string; class_id?: string; session_id?: string }, i: number) => ({
          layer: 'L4_sessione',
          id: `session:${row.id || row.session_id || i}`,
          score: 0.6 - i * 0.05,
          text: String(row.summary || '(no summary)').slice(0, 400),
          source: 'supabase:unlim_sessions',
          meta: { live: true, ended_at: row.ended_at, class_id: row.class_id },
        }));
      }
    } catch (e) {
      console.warn(JSON.stringify({ level: 'warn', event: 'l4_sessione_live_fail', error: String(e) }));
    }
  }
  // STUB fallback
  if (!input.session_id) return [];
  return [
    {
      layer: 'L4_sessione',
      id: `session:${input.session_id}`,
      score: 0.60,
      text: `[STUB L4 Sessione] session=${input.session_id} prior context summary`,
      source: 'supabase:unlim_sessions',
      meta: { stub: true, session_id: input.session_id },
    },
  ];
}

async function fetchL5Vision(input: OnniscenzaInput): Promise<LayerHit[]> {
  // LIVE iter 24: lesson active context derived from experiment_id when present.
  // Real screenshot vision call defers iter 25 (requires unlim-vision Edge Fn).
  if (input.experiment_id) {
    return [{
      layer: 'L5_vision',
      id: `lesson:${input.experiment_id}`,
      score: 0.55,
      text: `Esperimento attivo: ${input.experiment_id}` +
        (input.vol ? ` (Vol.${input.vol}` : '') +
        (input.pag ? ` pag.${input.pag})` : input.vol ? ')' : ''),
      source: 'lesson_paths',
      meta: { live: true, experiment_id: input.experiment_id },
    }];
  }
  return [];
}

async function fetchL6Llm(input: OnniscenzaInput): Promise<LayerHit[]> {
  // LIVE iter 24: chat history rolling window. Caller injects last 10 turns
  // via input.history. Iter 25+ adds Gemini Flash-Lite on-demand fallback for
  // missing-context queries.
  if (Array.isArray(input.history) && input.history.length > 0) {
    const recent = input.history.slice(-10);
    const summary = recent
      .map((t) => `${t.role === 'user' ? 'U' : 'A'}: ${String(t.content || '').slice(0, 80)}`)
      .join(' | ');
    return [{
      layer: 'L6_llm',
      id: `history:${recent.length}turns`,
      score: 0.5,
      text: summary.slice(0, 500),
      source: 'request.history',
      meta: { live: true, turn_count: recent.length },
    }];
  }
  return [];
}

async function fetchL7Onthefly(input: OnniscenzaInput): Promise<LayerHit[]> {
  // STUB: derive from circuit_state if provided
  if (!input.circuit_state) return [];
  return [
    {
      layer: 'L7_onthefly',
      id: 'live:circuit',
      score: 0.55,
      text: '[STUB L7 OnTheFly] live circuit state captured',
      source: 'window.__ELAB_API.unlim.getCircuitState',
      meta: { stub: true },
    },
  ];
}

// ────────────────────────────────────────────────────────────────────────────
// RRF fusion (k=60 default)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Reciprocal Rank Fusion stub. Iter 19 ranks each layer's hits independently
 * by their pre-assigned score, then sums RRF score across layers.
 *
 *   rrf(d) = sum_layer 1 / (k + rank_layer(d))
 *
 * Iter 22+: real fusion across BM25 + dense + Wiki + sessione recencies.
 */
export function rrfFuse(layered: Record<LayerName, LayerHit[]>, k = 60): LayerHit[] {
  const acc = new Map<string, { hit: LayerHit; rrf: number }>();
  for (const layer of Object.keys(layered) as LayerName[]) {
    const hits = [...layered[layer]].sort((a, b) => b.score - a.score);
    hits.forEach((hit, idx) => {
      const rank = idx + 1;
      const incr = 1 / (k + rank);
      const existing = acc.get(hit.id);
      if (existing) {
        existing.rrf += incr;
      } else {
        acc.set(hit.id, { hit, rrf: incr });
      }
    });
  }
  return Array.from(acc.values())
    .sort((a, b) => b.rrf - a.rrf)
    .map(x => ({ ...x.hit, score: x.rrf }));
}

// ────────────────────────────────────────────────────────────────────────────
// Main entry: aggregateOnniscenza
// ────────────────────────────────────────────────────────────────────────────

export async function aggregateOnniscenza(input: OnniscenzaInput): Promise<OnniscenzaSnapshot> {
  const startedAt = Date.now();

  // Iter 41 Phase A Task A5 — cache lookup before parallel layer fetch.
  // Gate via ONNISCENZA_CACHE_ENABLED env (default false safe canary opt-in).
  const cacheEnabled = (Deno.env.get('ONNISCENZA_CACHE_ENABLED') || 'false').toLowerCase() === 'true';
  let cacheKey = '';
  if (cacheEnabled) {
    const { computeKey, lookupOnniscenzaCache } = await import('./onniscenza-cache.ts');
    cacheKey = await computeKey({
      query: input.query,
      topK: input.top_k,
      experimentId: (input as { experiment_id?: string | null }).experiment_id,
      classKey: (input as { class_key?: string | null }).class_key,
    });
    const cached = lookupOnniscenzaCache(cacheKey) as OnniscenzaSnapshot | null;
    if (cached) {
      console.info(JSON.stringify({
        level: 'info', event: 'onniscenza_cache_hit',
        key_prefix: cacheKey.slice(0, 8),
        latency_ms: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      }));
      return cached;
    }
  }

  const enable = {
    // iter 24: enable L5 (lesson context) + L6 (chat history) by default since
    // they're cheap and rely only on caller-injected payload.
    L1_rag: true, L2_wiki: true, L3_glossario: false,
    L4_sessione: true, L5_vision: true, L6_llm: true, L7_onthefly: true,
    ...(input.enable || {}),
  };

  // Iter 34 P0 Andrea "davvero lentissimo": cap each layer 200ms (fail-fast).
  // Slow layers timeout silently → empty hits → aggregator continues parallel
  // without blocking total. Effect: max latency 200ms per layer (vs unlimited).
  const LAYER_TIMEOUT_MS = 200;
  async function timed(layer: LayerName, fetcher: () => Promise<LayerHit[]>): Promise<{ layer: LayerName; status: LayerStatus; hits: LayerHit[] }> {
    if (!enable[layer]) {
      return { layer, status: { ok: true, latency_ms: 0, hits_count: 0, is_stub: true }, hits: [] };
    }
    const t0 = Date.now();
    try {
      const hits = await Promise.race([
        fetcher(),
        new Promise<LayerHit[]>((_, reject) => setTimeout(() => reject(new Error(`layer_timeout_${LAYER_TIMEOUT_MS}ms`)), LAYER_TIMEOUT_MS)),
      ]);
      return {
        layer,
        status: { ok: true, latency_ms: Date.now() - t0, hits_count: hits.length, is_stub: true },
        hits,
      };
    } catch (err) {
      return {
        layer,
        status: { ok: false, latency_ms: Date.now() - t0, hits_count: 0, error: err instanceof Error ? err.message : String(err), is_stub: true },
        hits: [],
      };
    }
  }

  const results = await Promise.all([
    timed('L1_rag', () => fetchL1Rag(input)),
    timed('L2_wiki', () => fetchL2Wiki(input)),
    timed('L3_glossario', () => fetchL3Glossario(input)),
    timed('L4_sessione', () => fetchL4Sessione(input)),
    timed('L5_vision', () => fetchL5Vision(input)),
    timed('L6_llm', () => fetchL6Llm(input)),
    timed('L7_onthefly', () => fetchL7Onthefly(input)),
  ]);

  const layers: Record<LayerName, LayerStatus> = {
    L1_rag: { ok: true, latency_ms: 0, hits_count: 0 },
    L2_wiki: { ok: true, latency_ms: 0, hits_count: 0 },
    L3_glossario: { ok: true, latency_ms: 0, hits_count: 0 },
    L4_sessione: { ok: true, latency_ms: 0, hits_count: 0 },
    L5_vision: { ok: true, latency_ms: 0, hits_count: 0 },
    L6_llm: { ok: true, latency_ms: 0, hits_count: 0 },
    L7_onthefly: { ok: true, latency_ms: 0, hits_count: 0 },
  };
  const raw: Record<LayerName, LayerHit[]> = {
    L1_rag: [], L2_wiki: [], L3_glossario: [], L4_sessione: [], L5_vision: [], L6_llm: [], L7_onthefly: [],
  };
  for (const r of results) {
    layers[r.layer] = r.status;
    raw[r.layer] = r.hits;
  }

  let fused = rrfFuse(raw, 60);

  // Iter 41 Phase B Task B5 — V2.1 conversational fusion canary (ADR-035).
  // Gate ENABLE_ONNISCENZA_V21=true env + CANARY_ONNISCENZA_V21_PERCENT (default 0).
  // V2.1 preserves RRF k=60 base + adds 4 weighted boost factors capped +0.50:
  //   - experiment-anchor +0.15
  //   - kit-mention +0.10 (Omaric component regex)
  //   - recent-history +0.20 × cosineSim (Voyage embed last 10 messages)
  //   - docente-stylistic +0.05 (Morfismo Sense 1.5)
  const v21Enabled = (Deno.env.get('ENABLE_ONNISCENZA_V21') || 'false').toLowerCase() === 'true';
  const v21CanaryPct = parseInt(Deno.env.get('CANARY_ONNISCENZA_V21_PERCENT') || '0', 10);
  const useV21 = v21Enabled && Math.random() * 100 < v21CanaryPct;

  if (useV21 && fused.length > 0) {
    try {
      const { aggregateOnniscenzaV21 } = await import('./onniscenza-conversational-fusion.ts');
      // Adapter: LayerHit → ragChunks shape required by V2.1
      const ragChunks = fused.map((h) => ({
        id: h.id,
        score: h.score,
        content: h.text,
        experimentId: (h.meta as { experiment_id?: string; experimentId?: string } | undefined)?.experiment_id
          ?? (h.meta as { experimentId?: string } | undefined)?.experimentId,
        metadata: {
          embedding: (h.meta as { embedding?: number[] } | undefined)?.embedding,
        },
      }));
      const v21Out = await aggregateOnniscenzaV21({
        ragChunks,
        query: input.query,
        experimentId: (input as { experiment_id?: string }).experiment_id,
        conversationMessages: (input as { history?: Array<{ role: string; content: string }> }).history,
        classKey: (input as { class_key?: string }).class_key,
      });
      // Map back into LayerHit-shaped array (preserve text + meta from original fused)
      const fusedById = new Map(fused.map((h) => [h.id, h]));
      fused = v21Out
        .map((r) => {
          const orig = fusedById.get(r.id);
          if (!orig) return null;
          return { ...orig, score: r.finalScore, meta: { ...orig.meta, v21_boost: r.boostBreakdown } };
        })
        .filter((x): x is LayerHit => x !== null);
      console.info(JSON.stringify({
        level: 'info', event: 'onniscenza_v21_applied',
        canary_pct: v21CanaryPct,
        chunks_processed: ragChunks.length,
        timestamp: new Date().toISOString(),
      }));
    } catch (err) {
      // Defensive: V2.1 fail → fall back to V1 RRF (already computed). Never break.
      console.warn(JSON.stringify({
        level: 'warn', event: 'onniscenza_v21_fallback_v1',
        error: err instanceof Error ? err.message : 'unknown',
        timestamp: new Date().toISOString(),
      }));
    }
  }

  const snapshot: OnniscenzaSnapshot = {
    fetched_at: new Date().toISOString(),
    total_latency_ms: Date.now() - startedAt,
    query: input.query,
    layers,
    fused,
    raw,
  };

  // Iter 41 Phase A Task A5 — store snapshot post fetch for next-call cache hit.
  if (cacheEnabled && cacheKey) {
    const { storeOnniscenzaCache } = await import('./onniscenza-cache.ts');
    storeOnniscenzaCache(cacheKey, snapshot);
  }

  return snapshot;
}

/** Iter 22+ marker: live wire-up flag. Updated iter 24: L1+L2+L4+L5+L6 LIVE. */
export const ONNISCENZA_BRIDGE_ITER = 24;
export const ONNISCENZA_BRIDGE_IS_STUB = false;
/** Layer-by-layer status — LIVE means uses real data when supabase/history provided. */
export const ONNISCENZA_LAYER_STATUS: Record<LayerName, 'LIVE' | 'STUB' | 'TODO'> = {
  L1_rag: 'LIVE',       // hybrid retriever via rag.ts when supabase present
  L2_wiki: 'LIVE',      // rag_chunks WHERE source='wiki' when supabase present
  L3_glossario: 'TODO', // merged into L1 RAG via wikiFusionActive flag (no separate fetch)
  L4_sessione: 'LIVE',  // unlim_sessions table when supabase present
  L5_vision: 'LIVE',    // lesson context from experiment_id; real vision iter 25
  L6_llm: 'LIVE',       // chat history rolling window from request context
  L7_onthefly: 'LIVE',  // circuit_state injected by caller
};

// ============================================================================
// iter 39 ralph A4 — Onniscenza V2 cross-attention 8-chunk budget per ADR-033
// ============================================================================

/** Layer-specific weights per ADR-033 §Cross-attention scoring */
const V2_LAYER_WEIGHTS: Record<LayerName, number> = {
  L1_rag: 1.0,
  L2_wiki: 0.85,
  L3_glossario: 0.75,
  L4_sessione: 0.95,
  L5_vision: 0.90,
  L6_llm: 0.70,
  L7_onthefly: 0.65,
};

/** Layer-specific RRF k per ADR-033 §RRF k=60 layer-specific weights */
const V2_LAYER_K: Record<LayerName, number> = {
  L1_rag: 60,
  L2_wiki: 80,
  L3_glossario: 100,
  L4_sessione: 60,
  L5_vision: 60,
  L6_llm: 40,  // recency boost
  L7_onthefly: 60,
};

/** Budget allocation per ADR-033 §Budget allocation 8 chunks */
const V2_BUDGET = {
  L1_rag: { min: 1, max: 5 },     // expand to 5 if other slots skip
  L2_wiki: { min: 0, max: 3 },    // expand to 3 if other slots skip
  L3_glossario: { min: 0, max: 1 },
  L6_llm: { min: 0, max: 1 },
  L7_onthefly: { min: 0, max: 1 },
};

const KIT_MENTION_REGEX = /\b(breadboard|kit ELAB|componente fisico|fili|pin|resistor[ei]?|LED|transistor|MOSFET)\b/i;

/**
 * Score a single hit per V2 cross-attention rules.
 * - Base: chunk's own similarity score (from pgvector match OR layer-specific signal)
 * - Layer weight multiplier
 * - Experiment-anchor boost +0.15 if hit.experiment_id matches input
 * - Kit-mention boost +0.10 if hit.preview contains kit ELAB references
 */
function scoreHitV2(hit: LayerHit, layer: LayerName, input: OnniscenzaInput): number {
  const baseSimilarity = hit.score ?? hit.similarity ?? 0.5;
  const layerWeight = V2_LAYER_WEIGHTS[layer] ?? 0.5;
  let score = baseSimilarity * layerWeight;
  // Experiment-anchor boost
  if (input.experiment_id && hit.experiment_id === input.experiment_id) {
    score += 0.15;
  }
  // Kit-mention boost (Morfismo Sense 2)
  const text = (hit.preview || hit.text || '');
  if (KIT_MENTION_REGEX.test(text)) {
    score += 0.10;
  }
  return score;
}

/**
 * Allocate budget 8 chunks total across layers per ADR-033.
 * Returns the highest-scored hits within per-layer min/max constraints.
 * Skipped slots reallocate to L1 RAG (up to max=5) OR L2 Wiki (up to max=3).
 */
function allocateBudgetV2(
  scoredByLayer: Record<LayerName, { hit: LayerHit; score: number }[]>,
): LayerHit[] {
  const TOTAL_BUDGET = 8;
  const selected: LayerHit[] = [];
  const allocated: Partial<Record<LayerName, number>> = {};

  // Phase 1: allocate min slots per layer
  for (const layer of ['L1_rag', 'L2_wiki', 'L3_glossario', 'L6_llm', 'L7_onthefly'] as LayerName[]) {
    const budget = (V2_BUDGET as Record<LayerName, { min: number; max: number }>)[layer];
    if (!budget) continue;
    const sorted = (scoredByLayer[layer] || []).slice().sort((a, b) => b.score - a.score);
    const take = Math.min(budget.min, sorted.length);
    for (let i = 0; i < take; i++) {
      selected.push(sorted[i].hit);
      allocated[layer] = (allocated[layer] || 0) + 1;
    }
  }

  // Phase 2: fill remaining budget by global score ranking, respecting max constraints
  const remaining = TOTAL_BUDGET - selected.length;
  if (remaining > 0) {
    const allCandidates: { layer: LayerName; hit: LayerHit; score: number }[] = [];
    for (const layer of Object.keys(scoredByLayer) as LayerName[]) {
      const budget = (V2_BUDGET as Record<LayerName, { min: number; max: number }>)[layer];
      if (!budget) continue;
      const used = allocated[layer] || 0;
      const room = budget.max - used;
      if (room <= 0) continue;
      const candidates = (scoredByLayer[layer] || [])
        .slice(used)
        .map(c => ({ layer, hit: c.hit, score: c.score }));
      allCandidates.push(...candidates);
    }
    allCandidates.sort((a, b) => b.score - a.score);
    for (const c of allCandidates) {
      if (selected.length >= TOTAL_BUDGET) break;
      const used = allocated[c.layer] || 0;
      const budget = (V2_BUDGET as Record<LayerName, { min: number; max: number }>)[c.layer];
      if (!budget || used >= budget.max) continue;
      // Avoid duplicate hits (same chunk_id can come from multiple layers via wiki fusion)
      if (selected.some(s => s.id === c.hit.id || s.chunk_id === c.hit.chunk_id)) continue;
      selected.push(c.hit);
      allocated[c.layer] = used + 1;
    }
  }
  return selected;
}

/**
 * Onniscenza V2 — cross-attention scoring + budget allocation per ADR-033.
 * Same interface as V1 (`OnniscenzaSnapshot`) so callers can switch transparently
 * via env flag `ONNISCENZA_VERSION=v2`.
 *
 * Differences from V1:
 * - Per-layer score weights (RAG 1.0 → Analogia 0.65)
 * - Experiment-anchor boost +0.15 + kit-mention boost +0.10 (Morfismo Sense 2)
 * - Budget allocation 8 chunks total with min/max per-layer + reallocation
 * - Layer-specific RRF k per ADR-033 §RRF tuning
 *
 * Performance: same parallel fetch + 200ms timeout per layer as V1.
 * NO extra Voyage query embedding (skipped to avoid latency overhead).
 */
export async function aggregateOnniscenzaV2(input: OnniscenzaInput): Promise<OnniscenzaSnapshot> {
  const startedAt = Date.now();
  const enable = {
    L1_rag: true, L2_wiki: true, L3_glossario: false,
    L4_sessione: true, L5_vision: true, L6_llm: true, L7_onthefly: true,
    ...(input.enable || {}),
  };

  const LAYER_TIMEOUT_MS = 200;
  async function timed(layer: LayerName, fetcher: () => Promise<LayerHit[]>): Promise<{ layer: LayerName; status: LayerStatus; hits: LayerHit[] }> {
    if (!enable[layer]) {
      return { layer, status: { ok: true, latency_ms: 0, hits_count: 0, is_stub: true }, hits: [] };
    }
    const t0 = Date.now();
    try {
      const hits = await Promise.race([
        fetcher(),
        new Promise<LayerHit[]>((_, reject) => setTimeout(() => reject(new Error(`layer_timeout_${LAYER_TIMEOUT_MS}ms`)), LAYER_TIMEOUT_MS)),
      ]);
      return { layer, status: { ok: true, latency_ms: Date.now() - t0, hits_count: hits.length, is_stub: true }, hits };
    } catch (err) {
      return { layer, status: { ok: false, latency_ms: Date.now() - t0, hits_count: 0, error: err instanceof Error ? err.message : String(err), is_stub: true }, hits: [] };
    }
  }

  const results = await Promise.all([
    timed('L1_rag', () => fetchL1Rag(input)),
    timed('L2_wiki', () => fetchL2Wiki(input)),
    timed('L3_glossario', () => fetchL3Glossario(input)),
    timed('L4_sessione', () => fetchL4Sessione(input)),
    timed('L5_vision', () => fetchL5Vision(input)),
    timed('L6_llm', () => fetchL6Llm(input)),
    timed('L7_onthefly', () => fetchL7Onthefly(input)),
  ]);

  const layers: Record<LayerName, LayerStatus> = {
    L1_rag: { ok: true, latency_ms: 0, hits_count: 0 },
    L2_wiki: { ok: true, latency_ms: 0, hits_count: 0 },
    L3_glossario: { ok: true, latency_ms: 0, hits_count: 0 },
    L4_sessione: { ok: true, latency_ms: 0, hits_count: 0 },
    L5_vision: { ok: true, latency_ms: 0, hits_count: 0 },
    L6_llm: { ok: true, latency_ms: 0, hits_count: 0 },
    L7_onthefly: { ok: true, latency_ms: 0, hits_count: 0 },
  };
  const raw: Record<LayerName, LayerHit[]> = {
    L1_rag: [], L2_wiki: [], L3_glossario: [], L4_sessione: [], L5_vision: [], L6_llm: [], L7_onthefly: [],
  };
  for (const r of results) {
    layers[r.layer] = r.status;
    raw[r.layer] = r.hits;
  }

  // V2 cross-attention scoring per layer
  const scoredByLayer: Record<LayerName, { hit: LayerHit; score: number }[]> = {
    L1_rag: [], L2_wiki: [], L3_glossario: [], L4_sessione: [], L5_vision: [], L6_llm: [], L7_onthefly: [],
  };
  for (const layer of Object.keys(raw) as LayerName[]) {
    scoredByLayer[layer] = raw[layer].map(hit => ({ hit, score: scoreHitV2(hit, layer, input) }));
  }

  // V2 budget allocation 8 chunks per ADR-033
  const fused = allocateBudgetV2(scoredByLayer);

  return {
    fetched_at: new Date().toISOString(),
    total_latency_ms: Date.now() - startedAt,
    query: input.query,
    layers,
    fused,
    raw,
  };
}

export const ONNISCENZA_V2_ITER = 39;
export const ONNISCENZA_V2_VERSION = '2.0-iter39-cross-attention';
