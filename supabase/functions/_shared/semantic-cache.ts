/**
 * iter 39 Tier 1 T1.1 — Semantic Prompt Cache (in-isolate LRU)
 *
 * Goal: short-circuit identical requests across students/sessions.
 * Class scenario realistic: same volume + experiment + prompt asked many times
 * within 30min by different students → cache hit ≥30% projected.
 *
 * Design:
 * - In-isolate Map<string, CacheEntry> (RAM-only, NO disk persist)
 * - Key = SHA-256(experimentId + safeMessage + systemPromptHash + topK + classId)
 * - Value = { text, intentsParsed, latencyMs (cached), createdAt }
 * - LRU eviction at MAX_ENTRIES (default 100)
 * - TTL 30min default (env SEMANTIC_CACHE_TTL_MS override)
 * - Cron warmup (iter 38 A5) keeps isolate hot → cache survives between requests
 *
 * Risk: cache poisoning if response is bad. Mitigation: TTL short + invalidation
 * on PRINCIPIO ZERO score < 0.85. Disabled when `SEMANTIC_CACHE_ENABLED=false`.
 */

const MAX_ENTRIES = parseInt(Deno.env.get('SEMANTIC_CACHE_MAX_ENTRIES') || '100', 10);
const TTL_MS = parseInt(Deno.env.get('SEMANTIC_CACHE_TTL_MS') || '1800000', 10); // 30min
const ENABLED = (Deno.env.get('SEMANTIC_CACHE_ENABLED') || 'true').toLowerCase() === 'true';

export interface CacheEntry {
  text: string;
  intentsParsed?: unknown[];
  pzScore?: number;
  source: string; // model used or 'L2-template' etc
  createdAt: number;
  hitCount: number;
}

// Module-level Map = in-isolate LRU. Persists across requests within same Edge worker.
const cache = new Map<string, CacheEntry>();

// Lightweight stats for telemetry
let hits = 0;
let misses = 0;
let evictions = 0;

/**
 * Compute deterministic cache key. Web Crypto SHA-256 (Deno-compat).
 */
async function computeKey(parts: {
  experimentId?: string | null;
  safeMessage: string;
  systemPromptDigest?: string;
  topK?: number;
  classId?: string | null;
}): Promise<string> {
  const raw = [
    parts.experimentId || 'NA',
    parts.safeMessage.trim().toLowerCase(),
    parts.systemPromptDigest || 'v3.1',
    String(parts.topK ?? 3),
    parts.classId || 'NA',
  ].join('|');
  const buf = new TextEncoder().encode(raw);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Lookup. Returns entry if fresh hit, null otherwise.
 * On stale hit, removes entry + counts as miss.
 */
export async function lookupCache(parts: {
  experimentId?: string | null;
  safeMessage: string;
  systemPromptDigest?: string;
  topK?: number;
  classId?: string | null;
}): Promise<CacheEntry | null> {
  if (!ENABLED) return null;
  const key = await computeKey(parts);
  const entry = cache.get(key);
  if (!entry) {
    misses++;
    return null;
  }
  const age = Date.now() - entry.createdAt;
  if (age > TTL_MS) {
    cache.delete(key);
    misses++;
    return null;
  }
  // LRU touch — re-insert to move to end
  cache.delete(key);
  cache.set(key, entry);
  entry.hitCount++;
  hits++;
  return entry;
}

/**
 * Insert. Skips if pzScore < 0.85 (don't cache low-quality responses).
 * LRU eviction on MAX_ENTRIES exceeded.
 */
export async function storeCache(
  parts: {
    experimentId?: string | null;
    safeMessage: string;
    systemPromptDigest?: string;
    topK?: number;
    classId?: string | null;
  },
  entry: Omit<CacheEntry, 'createdAt' | 'hitCount'>,
): Promise<void> {
  if (!ENABLED) return;
  // Don't cache low-quality responses
  if (entry.pzScore !== undefined && entry.pzScore < 0.85) return;
  // Don't cache empty / error responses
  if (!entry.text || entry.text.length < 20) return;

  const key = await computeKey(parts);
  const fullEntry: CacheEntry = {
    ...entry,
    createdAt: Date.now(),
    hitCount: 0,
  };

  // LRU eviction: if at capacity, remove oldest (first inserted)
  if (cache.size >= MAX_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) {
      cache.delete(oldestKey);
      evictions++;
    }
  }
  cache.set(key, fullEntry);
}

/**
 * Telemetry snapshot. Surface in response for monitoring.
 */
export function getCacheStats(): { hits: number; misses: number; size: number; evictions: number; hitRate: number } {
  const total = hits + misses;
  return {
    hits,
    misses,
    size: cache.size,
    evictions,
    hitRate: total > 0 ? hits / total : 0,
  };
}

/**
 * Clear cache. For testing or admin reset.
 */
export function clearCache(): void {
  cache.clear();
  hits = 0;
  misses = 0;
  evictions = 0;
}

/**
 * Cheap digest of system prompt for key composition.
 * NOT cryptographic — just a stable short ID for prompt versioning.
 */
export async function digestSystemPrompt(prompt: string): Promise<string> {
  const buf = new TextEncoder().encode(prompt);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
}
