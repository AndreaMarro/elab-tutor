// Iter 41 Phase B Task B2 — Voyage conversation history embed
// Plan §Phase B Task B2 + ADR-035 §recent-history boost factor.

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Conversation history Voyage embed (iter 41 B2)', () => {
  let module;

  beforeEach(async () => {
    vi.resetModules();
    vi.unstubAllGlobals();
    module = await import('../../supabase/functions/_shared/conversation-history-embed.ts');
    module.resetHistoryCache();
  });

  it('exports embedConversationHistory + resetHistoryCache + getHistoryCacheStats', () => {
    expect(typeof module.embedConversationHistory).toBe('function');
    expect(typeof module.resetHistoryCache).toBe('function');
    expect(typeof module.getHistoryCacheStats).toBe('function');
  });

  it('returns null vector when messages empty', async () => {
    const result = await module.embedConversationHistory([]);
    expect(result.vector).toBeNull();
    expect(result.tokenCount).toBe(0);
  });

  it('returns null vector when VOYAGE_API_KEY env absent', async () => {
    vi.stubGlobal('Deno', { env: { get: () => '' } });
    const result = await module.embedConversationHistory([
      { role: 'user', content: 'Spiega LED' },
    ]);
    expect(result.vector).toBeNull();
  });

  it('mocks fetch + returns 1024-dim vector for happy path', async () => {
    vi.stubGlobal('Deno', { env: { get: (k) => k === 'VOYAGE_API_KEY' ? 'test-key' : '' } });
    const fakeVector = Array.from({ length: 1024 }, (_, i) => i / 1024);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ embedding: fakeVector }] }),
    }));

    const result = await module.embedConversationHistory([
      { role: 'user', content: 'Spiega LED' },
      { role: 'assistant', content: 'Ragazzi, il LED è...' },
    ]);
    expect(result.vector).toEqual(fakeVector);
    expect(result.vector.length).toBe(1024);
  });

  it('truncates to last 10 messages when more provided', async () => {
    vi.stubGlobal('Deno', { env: { get: (k) => k === 'VOYAGE_API_KEY' ? 'test-key' : '' } });
    let capturedBody = null;
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url, opts) => {
      capturedBody = JSON.parse(opts.body);
      return Promise.resolve({
        ok: true,
        json: async () => ({ data: [{ embedding: new Array(1024).fill(0.1) }] }),
      });
    }));

    const messages = Array.from({ length: 15 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `message-${i}`,
    }));
    await module.embedConversationHistory(messages);
    // Last 10 = messages 5-14
    expect(capturedBody.input[0]).toContain('message-5');
    expect(capturedBody.input[0]).toContain('message-14');
    expect(capturedBody.input[0]).not.toContain('message-0');
    expect(capturedBody.input[0]).not.toContain('message-4');
  });

  it('caches embed for identical message sequence (TTL 5min)', async () => {
    vi.stubGlobal('Deno', { env: { get: (k) => k === 'VOYAGE_API_KEY' ? 'test-key' : '' } });
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ embedding: new Array(1024).fill(0.5) }] }),
    });
    vi.stubGlobal('fetch', fetchSpy);

    const messages = [{ role: 'user', content: 'cached query' }];
    await module.embedConversationHistory(messages);
    await module.embedConversationHistory(messages);
    expect(fetchSpy).toHaveBeenCalledTimes(1); // 2nd call cache hit
    const stats = module.getHistoryCacheStats();
    expect(stats.hits).toBe(1);
  });

  it('returns null when Voyage API errors (5xx)', async () => {
    vi.stubGlobal('Deno', { env: { get: (k) => k === 'VOYAGE_API_KEY' ? 'test-key' : '' } });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    }));
    const result = await module.embedConversationHistory([
      { role: 'user', content: 'fail' },
    ]);
    expect(result.vector).toBeNull();
  });

  it('handles Voyage timeout (AbortError) gracefully', async () => {
    vi.stubGlobal('Deno', { env: { get: (k) => k === 'VOYAGE_API_KEY' ? 'test-key' : '' } });
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('AbortError')));
    const result = await module.embedConversationHistory([
      { role: 'user', content: 'timeout' },
    ]);
    expect(result.vector).toBeNull();
  });

  it('truncates concat at 16000 chars to fit Voyage 4000 token limit', async () => {
    vi.stubGlobal('Deno', { env: { get: (k) => k === 'VOYAGE_API_KEY' ? 'test-key' : '' } });
    let capturedBody = null;
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url, opts) => {
      capturedBody = JSON.parse(opts.body);
      return Promise.resolve({
        ok: true,
        json: async () => ({ data: [{ embedding: new Array(1024).fill(0) }] }),
      });
    }));
    const veryLong = 'x'.repeat(20000);
    await module.embedConversationHistory([{ role: 'user', content: veryLong }]);
    expect(capturedBody.input[0].length).toBeLessThanOrEqual(16000);
  });

  it('formats messages as "role: content" concatenated newline', async () => {
    vi.stubGlobal('Deno', { env: { get: (k) => k === 'VOYAGE_API_KEY' ? 'test-key' : '' } });
    let capturedBody = null;
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url, opts) => {
      capturedBody = JSON.parse(opts.body);
      return Promise.resolve({
        ok: true,
        json: async () => ({ data: [{ embedding: new Array(1024).fill(0) }] }),
      });
    }));
    await module.embedConversationHistory([
      { role: 'user', content: 'Spiega LED' },
      { role: 'assistant', content: 'Ragazzi, il LED' },
    ]);
    expect(capturedBody.input[0]).toBe('user: Spiega LED\nassistant: Ragazzi, il LED');
  });

  it('different message sequences produce distinct cache keys', async () => {
    vi.stubGlobal('Deno', { env: { get: (k) => k === 'VOYAGE_API_KEY' ? 'test-key' : '' } });
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ embedding: new Array(1024).fill(0) }] }),
    });
    vi.stubGlobal('fetch', fetchSpy);

    await module.embedConversationHistory([{ role: 'user', content: 'A' }]);
    await module.embedConversationHistory([{ role: 'user', content: 'B' }]);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('tracks hits + misses + total in stats', async () => {
    vi.stubGlobal('Deno', { env: { get: (k) => k === 'VOYAGE_API_KEY' ? 'test-key' : '' } });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ embedding: new Array(1024).fill(0) }] }),
    }));
    const messages = [{ role: 'user', content: 'tracked' }];
    await module.embedConversationHistory(messages); // miss
    await module.embedConversationHistory(messages); // hit
    const stats = module.getHistoryCacheStats();
    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(1);
    expect(stats.total).toBe(2);
  });
});
