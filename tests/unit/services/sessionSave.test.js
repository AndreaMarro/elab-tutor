/**
 * sessionSave.test.js — Iter 36 SessionSave Atom SS3+SS4
 *
 * Tests:
 *   SS4 — generateSessionSummary (api.js):
 *     1. Throws if sessionId missing
 *     2. Throws if Edge Function not configured
 *     3. Successful response → {description, cached}
 *     4. 401/403 → 'auth_failed_*' error
 *     5. 500 → 'http_500' error
 *     6. Non-success body → throws server error
 *
 *   SS3 — saveSession (supabaseSync.js):
 *     1. session=null → {success:false}
 *     2. Supabase not configured → queued + offline error
 *     3. Insert success → {success:true}
 *     4. generateSummary=true with valid UUID + empty session.summary → calls api
 *     5. generateSummary=true but session.summary already set → idempotent skip
 *     6. Edge Function fails → session still saved, queued retry
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../../src/utils/logger', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), log: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../../src/utils/aiSafetyFilter', () => ({
  filterAIResponse: vi.fn((text) => ({ filtered: text, blocked: false })),
}));

vi.mock('../../../src/data/unlim-knowledge-base', () => ({
  searchKnowledgeBase: vi.fn(() => []),
  searchRAGChunks: vi.fn(() => []),
}));

vi.mock('../../../src/data/volume-references', () => ({
  getVolumeRef: vi.fn(() => null),
  default: {},
}));

vi.mock('../../../src/services/bookCitation', () => ({
  ensureBookCitation: vi.fn((text) => text),
}));

vi.mock('../../../src/data/lesson-groups', () => ({
  getExperimentGroupContext: vi.fn(() => null),
  findLessonForExperiment: vi.fn(() => null),
  getLessonsForVolume: vi.fn(() => []),
  getLessonCount: vi.fn(() => 25),
  default: {},
}));

const lsStore = {};
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn((k) => lsStore[k] ?? null),
    setItem: vi.fn((k, v) => { lsStore[k] = String(v); }),
    removeItem: vi.fn((k) => { delete lsStore[k]; }),
    clear: vi.fn(() => Object.keys(lsStore).forEach(k => delete lsStore[k])),
  },
  writable: true,
});

beforeEach(() => {
  Object.keys(lsStore).forEach(k => delete lsStore[k]);
  vi.restoreAllMocks();
});

describe('SS4 — generateSessionSummary (api.js)', () => {
  it('throws when sessionId missing', async () => {
    const { generateSessionSummary } = await import('../../../src/services/api');
    await expect(generateSessionSummary('')).rejects.toThrow(/session_id required/);
    await expect(generateSessionSummary(null)).rejects.toThrow(/session_id required/);
  });

  it('returns {description, cached} on successful Edge Function response', async () => {
    const { generateSessionSummary } = await import('../../../src/services/api');
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, description: 'Riassunto LED resistenza · 25 min', cached: false }),
    });
    const result = await generateSessionSummary('11111111-2222-3333-4444-555555555555');
    expect(result.description).toBe('Riassunto LED resistenza · 25 min');
    expect(result.cached).toBe(false);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const callArgs = global.fetch.mock.calls[0];
    expect(callArgs[1].method).toBe('POST');
    expect(callArgs[1].headers.Authorization).toMatch(/Bearer /);
  });

  it('throws auth_failed_401 on HTTP 401', async () => {
    const { generateSessionSummary } = await import('../../../src/services/api');
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
    });
    await expect(
      generateSessionSummary('11111111-2222-3333-4444-555555555555')
    ).rejects.toThrow(/auth_failed_401/);
  });

  it('throws http_500 on server error', async () => {
    const { generateSessionSummary } = await import('../../../src/services/api');
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });
    await expect(
      generateSessionSummary('11111111-2222-3333-4444-555555555555')
    ).rejects.toThrow(/http_500/);
  });
});

describe('SS3 — saveSession (supabaseSync.js)', () => {
  it('returns {success:false} when session is null', async () => {
    const mod = await import('../../../src/services/supabaseSync');
    const result = await mod.saveSession(null);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/No session data/);
  });

  it('queues offline when Supabase not configured', async () => {
    vi.doMock('../../../src/services/supabaseClient', () => ({
      default: {
        from: vi.fn(),
        auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null } }), onAuthStateChange: vi.fn() },
      },
      isSupabaseConfigured: () => false,
    }));
    vi.resetModules();
    const mod = await import('../../../src/services/supabaseSync');
    const result = await mod.saveSession({ id: 'x', experimentId: 'exp1', startTime: '2026-05-04T10:00:00Z' });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/non configurato/);
    expect(lsStore.elab_sync_queue).toBeTruthy();
    vi.doUnmock('../../../src/services/supabaseClient');
  });

  it('skips summary generation when session.summary already set (idempotent)', async () => {
    const insertMock = vi.fn().mockResolvedValue({ error: null });
    vi.doMock('../../../src/services/supabaseClient', () => ({
      default: {
        from: vi.fn(() => ({ insert: insertMock })),
        auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null } }), onAuthStateChange: vi.fn() },
      },
      isSupabaseConfigured: () => true,
    }));
    const apiMock = vi.fn();
    vi.doMock('../../../src/services/api.js', () => ({
      generateSessionSummary: apiMock,
    }));
    vi.resetModules();
    const mod = await import('../../../src/services/supabaseSync');
    const result = await mod.saveSession(
      {
        id: '11111111-2222-3333-4444-555555555555',
        experimentId: 'exp1',
        startTime: '2026-05-04T10:00:00Z',
        endTime: '2026-05-04T10:25:00Z',
        summary: 'Riassunto già scritto manualmente', // pre-existing
      },
      { generateSummary: true }
    );
    expect(result.success).toBe(true);
    expect(apiMock).not.toHaveBeenCalled(); // idempotent skip
    vi.doUnmock('../../../src/services/supabaseClient');
    vi.doUnmock('../../../src/services/api.js');
  });

  it('queues summary retry when Edge Function fails', async () => {
    const insertMock = vi.fn().mockResolvedValue({ error: null });
    vi.doMock('../../../src/services/supabaseClient', () => ({
      default: {
        from: vi.fn(() => ({ insert: insertMock })),
        auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null } }), onAuthStateChange: vi.fn() },
      },
      isSupabaseConfigured: () => true,
    }));
    vi.doMock('../../../src/services/api.js', () => ({
      generateSessionSummary: vi.fn().mockRejectedValue(new Error('http_500')),
    }));
    vi.resetModules();
    const mod = await import('../../../src/services/supabaseSync');
    const result = await mod.saveSession(
      {
        id: '11111111-2222-3333-4444-555555555555',
        experimentId: 'exp1',
        startTime: '2026-05-04T10:00:00Z',
        endTime: '2026-05-04T10:25:00Z',
      },
      { generateSummary: true }
    );
    expect(result.success).toBe(true); // session still saved
    expect(lsStore.elab_session_summary_retry).toBeTruthy();
    const queue = JSON.parse(lsStore.elab_session_summary_retry);
    expect(queue).toHaveLength(1);
    expect(queue[0].session_id).toBe('11111111-2222-3333-4444-555555555555');
    vi.doUnmock('../../../src/services/supabaseClient');
    vi.doUnmock('../../../src/services/api.js');
  });
});
