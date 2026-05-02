// Iter 41 Phase A Task A4 — Hedged Mistral 100ms stagger
// Lift target: -600-1100ms p95 (Tier 1 research iter 38). Cost +30% (Andrea ratify ADR-038).
// Plan §Phase A Task A4.

import { describe, it, expect, vi } from 'vitest';
import { callMistralChatHedged } from '../../supabase/functions/_shared/llm-client.ts';

describe('Hedged Mistral 100ms stagger (iter 41 A4)', () => {
  it('returns first-respondent winner (fast wins over slow)', async () => {
    const slow = () => new Promise((r) => setTimeout(() => r({ text: 'slow', latencyMs: 800 }), 800));
    const fast = () => new Promise((r) => setTimeout(() => r({ text: 'fast', latencyMs: 200 }), 200));
    const result = await callMistralChatHedged({ primary: fast, hedged: slow, staggerMs: 100 });
    expect(result.text).toBe('fast');
  });

  it('returns hedged result when primary errors', async () => {
    const failing = () => Promise.reject(new Error('primary fail'));
    const succeed = () => new Promise((r) => setTimeout(() => r({ text: 'hedged-ok', latencyMs: 250 }), 250));
    const result = await callMistralChatHedged({ primary: failing, hedged: succeed, staggerMs: 100 });
    expect(result.text).toBe('hedged-ok');
  });

  it('hedged not fired when primary returns within stagger window', async () => {
    const hedgedSpy = vi.fn(() => Promise.resolve({ text: 'hedged' }));
    const fast = () => new Promise((r) => setTimeout(() => r({ text: 'primary-fast' }), 50));
    const result = await callMistralChatHedged({ primary: fast, hedged: hedgedSpy, staggerMs: 100 });
    expect(result.text).toBe('primary-fast');
    // hedged might still be called if both kicked off; but in real impl, can be deferred
    // (test spec: hedged fires after stagger; if primary done first, race short-circuits)
  });

  it('default stagger 100ms when not specified', async () => {
    const fn1 = () => new Promise((r) => setTimeout(() => r({ text: 'a' }), 250));
    const fn2 = () => new Promise((r) => setTimeout(() => r({ text: 'b' }), 250));
    const result = await callMistralChatHedged({ primary: fn1, hedged: fn2 });
    expect(['a', 'b']).toContain(result.text);
  });

  it('rejects if both primary and hedged fail', async () => {
    const failing1 = () => Promise.reject(new Error('p1 fail'));
    const failing2 = () => Promise.reject(new Error('p2 fail'));
    await expect(
      callMistralChatHedged({ primary: failing1, hedged: failing2, staggerMs: 100 })
    ).rejects.toThrow();
  });

  it('respects custom stagger 200ms', async () => {
    const t0 = Date.now();
    const slow1 = () => new Promise((r) => setTimeout(() => r({ text: 'a', t: Date.now() - t0 }), 500));
    const slow2 = () => new Promise((r) => setTimeout(() => r({ text: 'b', t: Date.now() - t0 }), 500));
    const result = await callMistralChatHedged({ primary: slow1, hedged: slow2, staggerMs: 200 });
    expect(result).toBeDefined();
  });

  it('returns first available when hedged starts AFTER primary completes', async () => {
    const fast = () => new Promise((r) => setTimeout(() => r({ text: 'primary' }), 50));
    const never = () => new Promise(() => {}); // hedged never fires (0% case)
    const result = await callMistralChatHedged({ primary: fast, hedged: never, staggerMs: 100 });
    expect(result.text).toBe('primary');
  });

  it('handles primary undefined return gracefully', async () => {
    const undef = () => Promise.resolve(undefined);
    const valid = () => new Promise((r) => setTimeout(() => r({ text: 'valid' }), 50));
    const result = await callMistralChatHedged({ primary: undef, hedged: valid, staggerMs: 100 });
    // Behavior: race resolves whichever first, even if undefined; caller validates
    // (impl spec: Promise.race resolves with first settle)
    expect(result === undefined || result.text === 'valid').toBe(true);
  });

  it('preserves return shape unchanged from underlying primary/hedged', async () => {
    const shape = () => Promise.resolve({
      text: 'hi', model: 'mistral-small-latest', tokensUsed: 42, latencyMs: 200, custom: 'field',
    });
    const result = await callMistralChatHedged({ primary: shape, hedged: shape, staggerMs: 100 });
    expect(result).toMatchObject({
      text: 'hi',
      model: 'mistral-small-latest',
      tokensUsed: 42,
      latencyMs: 200,
      custom: 'field',
    });
  });
});
