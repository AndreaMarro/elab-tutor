// Iter 41 Phase A Task A5 — Onniscenza V1 cache TTL 5min LRU 100 entries.
// Standalone module (separable from onniscenza-bridge.ts) for testability.
// Caches aggregated snapshots keyed by (query, topK, experimentId, classKey).
// Lift target: -100-200ms repeat queries within session.
// Plan §Phase A Task A5.

const TTL_MS = 5 * 60 * 1000; // 5 min
const MAX_ENTRIES = 100;

interface CacheEntry {
  snapshot: unknown;
  expiresAt: number;
}

let enabled = true;
const cache = new Map<string, CacheEntry>();
let hits = 0;
let misses = 0;

export interface OnniscenzaCacheKeyParts {
  query: string;
  topK?: number;
  experimentId?: string | null;
  classKey?: string | null;
}

/**
 * FNV-1a 64-bit hash — deterministic, fast, collision-safe enough for cache keys
 * (NOT cryptographic). Works in Deno + Node + vitest jsdom without crypto.subtle.
 */
function fnv1a64(input: string): string {
  // FNV-1a 64-bit constants (split into 32-bit halves for JS BigInt-free impl)
  let h1 = 0xcbf29ce4 | 0;
  let h2 = 0x84222325 | 0;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = (h1 ^ c) >>> 0;
    // Multiply by FNV prime 0x100000001b3 in 32-bit halves
    const m1 = Math.imul(h1, 0x000001b3);
    const m2 = Math.imul(h2, 0x000001b3);
    h1 = m1 >>> 0;
    h2 = (m2 + Math.imul(h1, 0x100)) >>> 0;
  }
  return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
}

export function computeKey(parts: OnniscenzaCacheKeyParts): Promise<string> {
  const raw = [
    (parts.query ?? '').trim().toLowerCase(),
    String(parts.topK ?? 3),
    parts.experimentId ?? 'NA',
    parts.classKey ?? 'NA',
  ].join('|');
  return Promise.resolve(fnv1a64(raw));
}

export function lookupOnniscenzaCache(key: string): unknown | null {
  if (!enabled) return null;
  const entry = cache.get(key);
  if (!entry) {
    misses++;
    return null;
  }
  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    misses++;
    return null;
  }
  // LRU touch: re-insert to mark as most-recently-used
  cache.delete(key);
  cache.set(key, entry);
  hits++;
  return entry.snapshot;
}

export function storeOnniscenzaCache(key: string, snapshot: unknown): void {
  if (!enabled) return;
  // Evict oldest if at capacity
  if (cache.size >= MAX_ENTRIES && !cache.has(key)) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) cache.delete(oldestKey);
  }
  cache.set(key, {
    snapshot,
    expiresAt: Date.now() + TTL_MS,
  });
}

export function getOnniscenzaCacheStats(): {
  size: number;
  hits: number;
  misses: number;
  total: number;
  hitRate: number;
} {
  const total = hits + misses;
  return {
    size: cache.size,
    hits,
    misses,
    total,
    hitRate: total > 0 ? hits / total : 0,
  };
}

export function resetCache(): void {
  cache.clear();
  hits = 0;
  misses = 0;
  enabled = true;
}

export function setCacheEnabled(value: boolean): void {
  enabled = value;
}
