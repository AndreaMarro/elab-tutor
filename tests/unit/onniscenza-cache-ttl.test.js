// Iter 41 Phase A Task A5 — Onniscenza V1 cache TTL 5min LRU 100 entries
// Lift target: -100-200ms repeat queries. Plan §Phase A Task A5.

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Onniscenza V1 cache TTL (iter 41 A5)', () => {
  let cache;

  beforeEach(async () => {
    vi.resetModules();
    cache = await import('../../supabase/functions/_shared/onniscenza-cache.ts');
    cache.resetCache();
  });

  it('exports cache module with lookup/store/stats/reset', () => {
    expect(typeof cache.lookupOnniscenzaCache).toBe('function');
    expect(typeof cache.storeOnniscenzaCache).toBe('function');
    expect(typeof cache.getOnniscenzaCacheStats).toBe('function');
    expect(typeof cache.resetCache).toBe('function');
  });

  it('returns cached snapshot for repeated identical query within 5min', async () => {
    const key = await cache.computeKey({ query: 'LED Vol.1', topK: 3, experimentId: 'v1-cap6-esp1' });
    const snapshot = { totalHits: 5, layers: ['L1_rag'], aggregatedHits: [{ id: 'c1' }] };
    cache.storeOnniscenzaCache(key, snapshot);
    const hit = cache.lookupOnniscenzaCache(key);
    expect(hit).toEqual(snapshot);
  });

  it('returns null for missing key', () => {
    expect(cache.lookupOnniscenzaCache('nonexistent_key_xyz')).toBeNull();
  });

  it('expires entries after 5min TTL', async () => {
    const key = await cache.computeKey({ query: 'test', topK: 3 });
    cache.storeOnniscenzaCache(key, { totalHits: 1 });
    expect(cache.lookupOnniscenzaCache(key)).toBeTruthy();

    const NOW = Date.now();
    vi.setSystemTime(NOW + 5 * 60 * 1000 + 1);
    expect(cache.lookupOnniscenzaCache(key)).toBeNull();
    vi.useRealTimers();
  });

  it('LRU evicts oldest when capacity 100 reached', async () => {
    for (let i = 0; i < 105; i++) {
      const k = await cache.computeKey({ query: `q${i}`, topK: 3 });
      cache.storeOnniscenzaCache(k, { totalHits: i });
    }
    const stats = cache.getOnniscenzaCacheStats();
    expect(stats.size).toBeLessThanOrEqual(100);
    // First entries should be evicted
    const k0 = await cache.computeKey({ query: 'q0', topK: 3 });
    expect(cache.lookupOnniscenzaCache(k0)).toBeNull();
  });

  it('tracks hits/misses/total in stats', async () => {
    const key = await cache.computeKey({ query: 'tracked', topK: 3 });
    cache.lookupOnniscenzaCache(key); // miss
    cache.storeOnniscenzaCache(key, { totalHits: 1 });
    cache.lookupOnniscenzaCache(key); // hit
    cache.lookupOnniscenzaCache(key); // hit
    const stats = cache.getOnniscenzaCacheStats();
    expect(stats.hits).toBe(2);
    expect(stats.misses).toBe(1);
    expect(stats.total).toBe(3);
  });

  it('computeKey returns distinct keys for different inputs', async () => {
    const k1 = await cache.computeKey({ query: 'A', topK: 3 });
    const k2 = await cache.computeKey({ query: 'B', topK: 3 });
    const k3 = await cache.computeKey({ query: 'A', topK: 5 });
    const k4 = await cache.computeKey({ query: 'A', topK: 3, experimentId: 'v1' });
    expect(k1).not.toBe(k2);
    expect(k1).not.toBe(k3);
    expect(k1).not.toBe(k4);
  });

  it('computeKey returns same key for identical inputs (deterministic)', async () => {
    const k1 = await cache.computeKey({ query: 'same', topK: 3, experimentId: 'v1' });
    const k2 = await cache.computeKey({ query: 'same', topK: 3, experimentId: 'v1' });
    expect(k1).toBe(k2);
  });

  it('respects ENABLED env gate (returns null when disabled)', async () => {
    cache.setCacheEnabled(false);
    const key = await cache.computeKey({ query: 'gated', topK: 3 });
    cache.storeOnniscenzaCache(key, { totalHits: 1 });
    expect(cache.lookupOnniscenzaCache(key)).toBeNull();
    cache.setCacheEnabled(true);
  });

  it('handles concurrent stores without corruption', async () => {
    const promises = Array.from({ length: 50 }, async (_, i) => {
      const k = await cache.computeKey({ query: `concurrent${i}`, topK: 3 });
      cache.storeOnniscenzaCache(k, { totalHits: i });
    });
    await Promise.all(promises);
    const stats = cache.getOnniscenzaCacheStats();
    expect(stats.size).toBeGreaterThan(0);
    expect(stats.size).toBeLessThanOrEqual(100);
  });
});
