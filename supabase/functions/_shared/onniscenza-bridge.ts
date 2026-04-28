/**
 * onniscenza-bridge — Sprint T iter 19 STUB (active impl iter 22+)
 *
 * Aggregator for the 7-layer Onniscenza snapshot per ADR-023 §5.
 *
 * ITER 19 SCOPE = STUB:
 *   - Layer interfaces + OnniscenzaSnapshot schema FROZEN
 *   - L1 RAG existing (rag-chunks.json) + L4 sessione Supabase + L7 on-the-fly = mock impl
 *   - L2 Wiki filesystem = mock list (production reads docs/unlim-wiki/concepts/*.md)
 *   - L3 Glossario / L5 Vision / L6 LLM-on-demand = TODO iter 22+ markers (return empty)
 *   - Promise.all parallel fetch wired
 *   - RRF k=60 fusion stub (ranks already-scored layers, no live re-rank)
 *
 * ITER 22+ ACTIVE: replace stub fetchers with live calls to:
 *   - state-snapshot-aggregator.ts (existing, sister module)
 *   - hybrid RAG retriever (BM25+dense+RRF k=60)
 *   - vision Edge Function unlim-vision
 *   - LLM on-demand fallback (Gemini Flash-Lite EU)
 *
 * (c) Andrea Marro 2026-04-28 — ELAB Tutor
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
  /** Optional precomputed circuit state (caller can inject when running client-side). */
  circuit_state?: unknown;
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
  // STUB: in iter 22+ → call hybrid retriever (rag.ts BM25+dense+RRF)
  // Iter 19 returns deterministic mock for downstream test fixtures
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
  // STUB: in iter 22+ → read docs/unlim-wiki/concepts/*.md filesystem
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
  // STUB: in iter 22+ → query Supabase `unlim_sessions` filter session_id
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

async function fetchL5Vision(_input: OnniscenzaInput): Promise<LayerHit[]> {
  // TODO iter 22+: invoke unlim-vision Edge Function with screenshot dataURL
  return [];
}

async function fetchL6Llm(_input: OnniscenzaInput): Promise<LayerHit[]> {
  // TODO iter 22+: on-demand LLM fallback (Gemini Flash-Lite EU)
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
  const enable = {
    L1_rag: true, L2_wiki: true, L3_glossario: false,
    L4_sessione: true, L5_vision: false, L6_llm: false, L7_onthefly: true,
    ...(input.enable || {}),
  };

  async function timed(layer: LayerName, fetcher: () => Promise<LayerHit[]>): Promise<{ layer: LayerName; status: LayerStatus; hits: LayerHit[] }> {
    if (!enable[layer]) {
      return { layer, status: { ok: true, latency_ms: 0, hits_count: 0, is_stub: true }, hits: [] };
    }
    const t0 = Date.now();
    try {
      const hits = await fetcher();
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

  const fused = rrfFuse(raw, 60);

  return {
    fetched_at: new Date().toISOString(),
    total_latency_ms: Date.now() - startedAt,
    query: input.query,
    layers,
    fused,
    raw,
  };
}

/** Iter 22+ marker: live wire-up flag. */
export const ONNISCENZA_BRIDGE_ITER = 19;
export const ONNISCENZA_BRIDGE_IS_STUB = true;
