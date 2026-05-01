/**
 * clawbot-dispatcher-deno — Onnipotenza 12-tool server-safe subset (iter 39 ralph A3)
 *
 * Per ADR-032 §Decision. Ports server-safe subset of OpenClaw 62-tool registry
 * to Deno Edge Function dispatch. Browser-side surface preserved for 50 unsafe
 * DOM-bound tools (captureScreenshot, getCircuitState, etc) per ADR-028 §14.
 *
 * 12-tool subset:
 *   - 4 fully server-side: ragRetrieve, searchVolume, mountExperiment (validate),
 *                          setComponentValue (validate)
 *   - 8 hybrid: highlightComponent, captureScreenshot (surface), getCircuitState (surface),
 *               getCircuitDescription, clearCircuit, highlightPin, clearHighlights, connectWire
 *
 * Canary rollout via `CANARY_DENO_DISPATCH_PERCENT` env (0-100) + hash-bucket
 * deterministic per sessionId. Default 0 (surface-to-browser status quo iter 36).
 *
 * (c) iter 39 ralph A3 — Onnipotenza Deno port minimal-viable
 */

import { hybridRetrieve } from './rag.ts';

export const SERVER_SAFE_TOOLS = [
  'highlightComponent',
  'mountExperiment',
  'captureScreenshot',
  'getCircuitState',
  'getCircuitDescription',
  'clearCircuit',
  'highlightPin',
  'clearHighlights',
  'setComponentValue',
  'connectWire',
  'ragRetrieve',
  'searchVolume',
] as const;

export type ServerSafeTool = typeof SERVER_SAFE_TOOLS[number];

export interface IntentTag {
  tool: string;
  args: Record<string, unknown>;
}

export interface DispatchContext {
  sessionId?: string;
  experimentId?: string | null;
  supabase?: unknown; // SupabaseClient (avoid hard import dep)
}

export interface DispatchResult {
  tool: string;
  args: Record<string, unknown>;
  /** server_executed=true when handler ran fully server-side. */
  server_executed: boolean;
  /** surface_to_browser=true when handler validated/staged but browser must complete. */
  surface_to_browser: boolean;
  /** Optional payload for browser to consume (validated values, fetched chunks). */
  result?: unknown;
  error?: string;
  latencyMs: number;
}

/**
 * Hash-bucket deterministic per sessionId.
 * Same sessionId → same bucket across requests = canary stickiness.
 * Returns true if sessionId falls in canary percent.
 */
export function inCanaryBucket(sessionId: string, percent: number): boolean {
  if (percent <= 0) return false;
  if (percent >= 100) return true;
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) {
    hash = ((hash << 5) - hash) + sessionId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 100 < percent;
}

/**
 * Validate component value range per tool spec (resistor 1-1M Ohm, LED color hex, etc).
 * Returns {ok, value, reason} discriminated.
 */
function validateComponentValue(
  componentType: string,
  param: string,
  value: unknown,
): { ok: true; value: unknown } | { ok: false; reason: string } {
  if (componentType === 'resistor' && param === 'value') {
    const n = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(n) || n < 1 || n > 1_000_000) {
      return { ok: false, reason: `resistor value out of range [1, 1M] Ohm: ${value}` };
    }
    return { ok: true, value: n };
  }
  if (componentType === 'led' && param === 'color') {
    if (typeof value !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(value)) {
      return { ok: false, reason: `led color must be hex #RRGGBB: ${value}` };
    }
    return { ok: true, value };
  }
  if (componentType === 'capacitor' && param === 'value') {
    const n = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(n) || n <= 0) {
      return { ok: false, reason: `capacitor value must be positive: ${value}` };
    }
    return { ok: true, value: n };
  }
  // Permissive default for unrecognized component/param combos
  return { ok: true, value };
}

/**
 * Execute single intent tag server-side IF in server-safe subset.
 * Returns DispatchResult with server_executed/surface_to_browser flags.
 * NEVER throws — wraps errors as result.error.
 */
export async function executeServerSafeTool(
  intent: IntentTag,
  ctx: DispatchContext,
): Promise<DispatchResult> {
  const start = Date.now();
  const tool = intent.tool;
  const args = intent.args || {};

  if (!SERVER_SAFE_TOOLS.includes(tool as ServerSafeTool)) {
    return {
      tool,
      args,
      server_executed: false,
      surface_to_browser: true,
      error: 'tool_not_in_server_safe_subset',
      latencyMs: Date.now() - start,
    };
  }

  try {
    switch (tool) {
      case 'ragRetrieve': {
        // Fully server-side: hybrid retriever returns chunks
        const query = String(args.query || '');
        const topK = typeof args.topK === 'number' ? args.topK : 3;
        if (!query.trim()) {
          return {
            tool, args, server_executed: false, surface_to_browser: false,
            error: 'ragRetrieve: empty query', latencyMs: Date.now() - start,
          };
        }
        const chunks = await hybridRetrieve(query, topK, {});
        return {
          tool, args,
          server_executed: true, surface_to_browser: false,
          result: { chunks_count: chunks.length, top_chunks: chunks.slice(0, topK) },
          latencyMs: Date.now() - start,
        };
      }

      case 'searchVolume': {
        // Fully server-side: filter rag_chunks by source vol
        const query = String(args.query || '');
        const vol = String(args.vol || args.volume || '');
        const topK = typeof args.topK === 'number' ? args.topK : 5;
        if (!query.trim() || !vol.match(/^vol[123]$/)) {
          return {
            tool, args, server_executed: false, surface_to_browser: false,
            error: `searchVolume: invalid query or vol (expected vol1|vol2|vol3): ${vol}`,
            latencyMs: Date.now() - start,
          };
        }
        // Hybrid retrieve filtered by source = vol
        const chunks = await hybridRetrieve(query, topK, { source: vol });
        return {
          tool, args,
          server_executed: true, surface_to_browser: false,
          result: { chunks_count: chunks.length, top_chunks: chunks.slice(0, topK), vol },
          latencyMs: Date.now() - start,
        };
      }

      case 'setComponentValue': {
        // Validate range server-side, surface validated value to browser
        const componentType = String(args.componentType || args.type || '');
        const param = String(args.param || 'value');
        const v = validateComponentValue(componentType, param, args.value);
        if (!v.ok) {
          return {
            tool, args, server_executed: false, surface_to_browser: false,
            error: v.reason, latencyMs: Date.now() - start,
          };
        }
        return {
          tool, args: { ...args, value: v.value },
          server_executed: true, surface_to_browser: true,
          result: { validated_value: v.value, componentType, param },
          latencyMs: Date.now() - start,
        };
      }

      case 'mountExperiment': {
        // Server validates experimentId format, surface to browser for actual mount
        const experimentId = String(args.experimentId || args.id || '');
        if (!/^v[1-3]-(cap\d+-esp\d+|extra-[a-z0-9-]+)$/i.test(experimentId)) {
          return {
            tool, args, server_executed: false, surface_to_browser: false,
            error: `mountExperiment: invalid experimentId format: ${experimentId}`,
            latencyMs: Date.now() - start,
          };
        }
        return {
          tool, args: { experimentId },
          server_executed: true, surface_to_browser: true,
          result: { validated_experimentId: experimentId },
          latencyMs: Date.now() - start,
        };
      }

      case 'connectWire': {
        // Server validates pin format, surface to browser for canvas draw
        const from = String(args.from || '');
        const to = String(args.to || '');
        const pinFmt = /^[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+$/;
        if (!pinFmt.test(from) || !pinFmt.test(to)) {
          return {
            tool, args, server_executed: false, surface_to_browser: false,
            error: `connectWire: invalid pin format (expected component:pin): from=${from} to=${to}`,
            latencyMs: Date.now() - start,
          };
        }
        return {
          tool, args: { from, to },
          server_executed: true, surface_to_browser: true,
          result: { validated_from: from, validated_to: to },
          latencyMs: Date.now() - start,
        };
      }

      // 8 hybrid tools: server tracks state intent, surface to browser for render
      case 'highlightComponent':
      case 'highlightPin':
      case 'clearHighlights':
      case 'clearCircuit':
      case 'getCircuitState':
      case 'getCircuitDescription':
      case 'captureScreenshot':
        return {
          tool, args,
          server_executed: false,
          surface_to_browser: true,
          result: { tool_class: 'hybrid_browser_rendered' },
          latencyMs: Date.now() - start,
        };

      default:
        return {
          tool, args, server_executed: false, surface_to_browser: true,
          error: 'unknown_server_safe_tool',
          latencyMs: Date.now() - start,
        };
    }
  } catch (err) {
    return {
      tool, args,
      server_executed: false, surface_to_browser: true,
      error: err instanceof Error ? err.message : String(err),
      latencyMs: Date.now() - start,
    };
  }
}

/**
 * Batch dispatch all parsed intents through server-safe handler.
 * Caller decides via `inCanaryBucket(sessionId, percent)` whether to invoke.
 */
export async function dispatchIntentsServerSide(
  intents: IntentTag[],
  ctx: DispatchContext,
): Promise<DispatchResult[]> {
  if (!Array.isArray(intents) || intents.length === 0) return [];
  const results: DispatchResult[] = [];
  for (const intent of intents) {
    const r = await executeServerSafeTool(intent, ctx);
    results.push(r);
  }
  return results;
}

export const CLAWBOT_DENO_DISPATCHER_VERSION = '1.0-iter39-ralph-A3-mvp';
