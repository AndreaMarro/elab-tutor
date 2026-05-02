// Iter 41 Phase B Task B2 — Voyage conversation history embed wrapper.
// Used by ADR-035 V2.1 conversational fusion §recent-history boost factor.
// Embeds last 10 messages concatenated as "role: content\n..." into Voyage 1024-dim vector.
// 5min TTL LRU cache to amortize cost across repeat session interactions.

const TTL_MS = 5 * 60 * 1000;
const MAX_CONCAT_CHARS = 16000; // ~4000 token Voyage limit
const MAX_HISTORY_MESSAGES = 10;
const CACHE_MAX_ENTRIES = 50;
const VOYAGE_TIMEOUT_MS = 5000;

interface ConversationMessage {
  role: string;
  content: string;
}

interface CacheEntry {
  vector: number[];
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
let hits = 0;
let misses = 0;

/**
 * FNV-1a 64-bit hash for cache key (deterministic + portable Deno+Node+vitest).
 * Same as onniscenza-cache.ts; kept inline to avoid cross-module dep.
 */
function fnv1a64(input: string): string {
  let h1 = 0xcbf29ce4 | 0;
  let h2 = 0x84222325 | 0;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = (h1 ^ c) >>> 0;
    const m1 = Math.imul(h1, 0x000001b3);
    const m2 = Math.imul(h2, 0x000001b3);
    h1 = m1 >>> 0;
    h2 = (m2 + Math.imul(h1, 0x100)) >>> 0;
  }
  return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
}

function getEnv(key: string): string {
  const denoEnv = (globalThis as { Deno?: { env: { get: (k: string) => string | undefined } } }).Deno?.env;
  return (denoEnv?.get(key) ?? '').trim();
}

export interface EmbedResult {
  vector: number[] | null;
  tokenCount: number;
}

/**
 * Embed last N=10 conversation messages via Voyage AI voyage-3 (1024-dim).
 * Cached 5min TTL by message sequence FNV1a hash.
 *
 * Returns {vector: null, tokenCount: 0} when:
 *   - messages array empty
 *   - VOYAGE_API_KEY env absent
 *   - Voyage API errors (4xx/5xx) or timeouts
 *
 * Used by aggregateOnniscenzaV21 (ADR-035) for +0.20 × cosineSim recent-history boost.
 */
export async function embedConversationHistory(messages: ConversationMessage[]): Promise<EmbedResult> {
  if (!messages || messages.length === 0) {
    return { vector: null, tokenCount: 0 };
  }

  const apiKey = getEnv('VOYAGE_API_KEY');
  if (!apiKey) {
    return { vector: null, tokenCount: 0 };
  }

  const last10 = messages.slice(-MAX_HISTORY_MESSAGES);
  const concat = last10.map((m) => `${m.role}: ${m.content}`).join('\n').slice(0, MAX_CONCAT_CHARS);
  const cacheKey = fnv1a64(concat);

  // Cache lookup
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    cache.delete(cacheKey);
    cache.set(cacheKey, cached); // LRU touch
    hits++;
    return { vector: cached.vector, tokenCount: -1 };
  }
  misses++;

  // Voyage API call
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), VOYAGE_TIMEOUT_MS);
  try {
    const res = await fetch('https://api.voyageai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: [concat],
        model: 'voyage-3',
        input_type: 'query',
      }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      return { vector: null, tokenCount: 0 };
    }
    const data = await res.json() as { data?: Array<{ embedding?: number[] }>; usage?: { total_tokens?: number } };
    const vector = data?.data?.[0]?.embedding ?? null;
    if (!vector) {
      return { vector: null, tokenCount: 0 };
    }
    const tokenCount = data.usage?.total_tokens ?? 0;

    // LRU cache store
    if (cache.size >= CACHE_MAX_ENTRIES && !cache.has(cacheKey)) {
      const oldest = cache.keys().next().value;
      if (oldest !== undefined) cache.delete(oldest);
    }
    cache.set(cacheKey, { vector, expiresAt: Date.now() + TTL_MS });

    return { vector, tokenCount };
  } catch (_err) {
    clearTimeout(timer);
    return { vector: null, tokenCount: 0 };
  }
}

export function getHistoryCacheStats(): { size: number; hits: number; misses: number; total: number; hitRate: number } {
  const total = hits + misses;
  return {
    size: cache.size,
    hits,
    misses,
    total,
    hitRate: total > 0 ? hits / total : 0,
  };
}

export function resetHistoryCache(): void {
  cache.clear();
  hits = 0;
  misses = 0;
}
