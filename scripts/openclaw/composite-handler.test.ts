/**
 * Sprint S iter 6 — ClawBot composite-handler tests (Task A6).
 *
 * Generator: gen-test-opus iter 6 PHASE 1.
 *
 * Scope: 5 unit cases against the new `executeComposite` impl that gen-app
 * iter 6 will ship in `scripts/openclaw/composite-handler.ts` per ADR-013
 * (architect-opus iter 6).
 *
 * TDD red phase: this test file MAY fail on initial run if gen-app has not
 * yet landed composite-handler.ts. Orchestrator coordinates parallel land.
 *
 * Expected new contract (per ADR-013):
 *
 *   import { executeComposite, type CompositeResult } from './composite-handler.ts';
 *
 *   const r = await executeComposite('analyzeImage', args, {
 *     api: window.__ELAB_API,
 *     dispatch: dispatchFn,             // injectable for testing
 *     memory: memoryAdapter,            // injectable; null disables cache
 *     pz_mode: 'warn' | 'block',
 *     timeout_ms: 5000,
 *   });
 *
 *   r.status:
 *     'ok'           → all sub-dispatches succeeded → r.data = aggregated result
 *     'error'        → a sub-dispatch failed → r.error + r.failed_sub_stage
 *     'blocked_pz'   → PZ block mode + sensitive sub-tool detected
 *     'cache_hit'    → memory cache returned previous result
 *     'timeout'      → timeout_ms exceeded across the chain
 *     'unknown_tool' → toolId not composite or not in registry
 *
 * Composite spec under test: `analyzeImage`
 *   composite_of: ['captureScreenshot', 'postToVisionEndpoint']
 *
 * Note: `postToVisionEndpoint` is conceptually defined in ADR-013; the iter 6
 * gen-app impl may add it to the registry as part of composite L1 wire-up.
 * Tests use a stubbed dispatcher to remain independent of registry surface.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// We import lazily inside each test to allow gen-app to land the impl in
// parallel without blocking the test file from loading at module level.
async function loadCompositeHandler() {
  const mod = await import('./composite-handler.ts');
  return mod;
}

interface DispatchStub {
  status: string;
  data?: unknown;
  error?: string;
  pz_warnings?: string[];
  latency_ms: number;
}

function makeDispatchSequence(seq: DispatchStub[]) {
  let idx = 0;
  return vi.fn(async (_toolId: string, _args: unknown, _ctx: unknown) => {
    const r = seq[idx] || { status: 'error', error: 'sequence exhausted', latency_ms: 0 };
    idx += 1;
    return r;
  });
}

describe('composite-handler — successful chain', () => {
  beforeEach(() => { vi.restoreAllMocks(); });

  it('case 1: all sub-dispatches succeed → status=ok with aggregated result', async () => {
    const handler = await loadCompositeHandler();
    if (typeof handler.executeComposite !== 'function') {
      // TDD red phase signal — gen-app has not landed impl yet.
      expect.fail('executeComposite not yet exported by composite-handler.ts (gen-app iter 6 pending)');
    }

    const dispatch = makeDispatchSequence([
      { status: 'ok', data: 'data:image/png;base64,xyz', latency_ms: 12 },
      { status: 'ok', data: { analysis: 'circuito OK ragazzi' }, latency_ms: 850 },
    ]);

    const r = await handler.executeComposite('analyzeImage', { image: null }, {
      api: { unlim: { captureScreenshot: () => 'data:image/png;base64,xyz' } },
      dispatch,
      memory: null,
      pz_mode: 'warn',
      timeout_ms: 10000,
    });

    expect(r.status).toBe('ok');
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(r.data).toBeDefined();
    // Aggregated result must surface vision analysis text from final sub-dispatch
    const aggregated = JSON.stringify(r.data);
    expect(aggregated).toMatch(/circuito OK ragazzi/);
  });
});

describe('composite-handler — error halt', () => {
  beforeEach(() => { vi.restoreAllMocks(); });

  it('case 2: sub-dispatch failure halts chain + returns error with sub-stage', async () => {
    const handler = await loadCompositeHandler();
    if (typeof handler.executeComposite !== 'function') {
      expect.fail('executeComposite not yet exported (gen-app iter 6 pending)');
    }

    const dispatch = makeDispatchSequence([
      { status: 'ok', data: 'data:image/png;base64,xyz', latency_ms: 10 },
      { status: 'error', error: 'Vision endpoint 503', latency_ms: 30 },
    ]);

    const r = await handler.executeComposite('analyzeImage', { image: null }, {
      api: { unlim: { captureScreenshot: () => 'data:image/png;base64,xyz' } },
      dispatch,
      memory: null,
      pz_mode: 'warn',
      timeout_ms: 10000,
    });

    expect(r.status).toBe('error');
    expect(r.error).toMatch(/Vision endpoint 503|503/);
    // Either failed_sub_stage or meta.failed_at must localize the failure
    const stage = (r as Record<string, unknown>).failed_sub_stage
      ?? ((r as Record<string, Record<string, unknown>>).meta?.failed_at);
    expect(stage).toBeDefined();
  });
});

describe('composite-handler — PZ v3 block mode', () => {
  beforeEach(() => { vi.restoreAllMocks(); });

  it('case 3: PZ block + sensitive sub-tool → status=blocked_pz', async () => {
    const handler = await loadCompositeHandler();
    if (typeof handler.executeComposite !== 'function') {
      expect.fail('executeComposite not yet exported (gen-app iter 6 pending)');
    }

    // First sub-dispatch surfaces a PZ warning + non-sensitive tool ok.
    // Second sub-dispatch is PZ-sensitive and dispatcher returns blocked_pz.
    const dispatch = makeDispatchSequence([
      { status: 'ok', data: 'screenshot', pz_warnings: [], latency_ms: 5 },
      { status: 'blocked_pz', error: 'PZ v3 block: sensitive tool needs speakTTS pairing', pz_warnings: ['needs speakTTS'], latency_ms: 1 },
    ]);

    const r = await handler.executeComposite('analyzeImage', {}, {
      api: { unlim: { captureScreenshot: () => 'screenshot' } },
      dispatch,
      memory: null,
      pz_mode: 'block',
      timeout_ms: 10000,
    });

    expect(r.status).toBe('blocked_pz');
    expect(r.error).toMatch(/PZ v3 block|sensitive/i);
  });
});

describe('composite-handler — memory cache hit', () => {
  beforeEach(() => { vi.restoreAllMocks(); });

  it('case 4: memory cache hit → return cached result without dispatch', async () => {
    const handler = await loadCompositeHandler();
    if (typeof handler.executeComposite !== 'function') {
      expect.fail('executeComposite not yet exported (gen-app iter 6 pending)');
    }

    const dispatch = vi.fn(async () => ({
      status: 'ok', data: 'should-not-be-called', latency_ms: 999,
    }));

    const memory = {
      lookup: vi.fn(async (_key: string) => ({
        hit: true,
        value: { cached_analysis: 'cached vision result ragazzi' },
        cached_at: '2026-04-26T20:00:00Z',
      })),
      store: vi.fn(async () => ({ ok: true })),
    };

    const r = await handler.executeComposite('analyzeImage', { image: 'fixed-key' }, {
      api: { unlim: { captureScreenshot: () => 'data:image/png;base64,fixed' } },
      dispatch,
      memory,
      pz_mode: 'warn',
      timeout_ms: 10000,
    });

    expect(['cache_hit', 'ok']).toContain(r.status);
    expect(memory.lookup).toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
    const serialized = JSON.stringify(r);
    expect(serialized).toMatch(/cached vision result ragazzi/);
  });
});

describe('composite-handler — timeout', () => {
  beforeEach(() => { vi.restoreAllMocks(); });

  it('case 5: timeout exceeded → status=timeout', async () => {
    const handler = await loadCompositeHandler();
    if (typeof handler.executeComposite !== 'function') {
      expect.fail('executeComposite not yet exported (gen-app iter 6 pending)');
    }

    const dispatch = vi.fn(async () => {
      // Simulate slow sub-dispatch by waiting longer than timeout_ms
      await new Promise(r => setTimeout(r, 200));
      return { status: 'ok', data: 'too-late', latency_ms: 200 };
    });

    const r = await handler.executeComposite('analyzeImage', {}, {
      api: { unlim: { captureScreenshot: () => 'x' } },
      dispatch,
      memory: null,
      pz_mode: 'warn',
      timeout_ms: 50, // Below dispatch latency
    });

    expect(r.status).toBe('timeout');
    expect(typeof r.error).toBe('string');
    expect(r.error).toMatch(/timeout|exceeded|deadline/i);
  });
});
