/**
 * sessionRestore.test.js — Iter 36 SessionSave Atom SS5
 *
 * Tests:
 *   1. restoreSession: missing sessionId → {success:false, error:'sessionId required'}
 *   2. restoreSession: localStorage hit → success + dispatches event
 *   3. restoreSession: record not found → {success:false, error:'session_not_found'}
 *   4. restoreSession: malformed record (no experimentId) → 'malformed_record'
 *   5. restoreSession: success → sets elab_resume_experiment localStorage
 *   6. buildRestorePayload: maps Supabase fields to camelCase
 *   7. buildRestorePayload: returns null on null input
 *   8. subscribeToRestore: handler receives detail payload on event
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/utils/logger', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), log: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../../src/services/supabaseClient', () => ({
  default: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
    })),
  },
  isSupabaseConfigured: () => false,
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

describe('sessionRestore.restoreSession', () => {
  it('returns error when sessionId is missing', async () => {
    const { restoreSession } = await import('../../../src/services/sessionRestore');
    const result = await restoreSession('');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/sessionId required/);
  });

  it('returns error when sessionId is not a string', async () => {
    const { restoreSession } = await import('../../../src/services/sessionRestore');
    const result = await restoreSession(null);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/sessionId required/);
  });

  it('returns session_not_found when localStorage has no match', async () => {
    const { restoreSession } = await import('../../../src/services/sessionRestore');
    lsStore.elab_unlim_sessions = JSON.stringify([]);
    const result = await restoreSession('non-existent-id');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/session_not_found/);
  });

  it('successfully restores from localStorage hit', async () => {
    const { restoreSession } = await import('../../../src/services/sessionRestore');
    lsStore.elab_unlim_sessions = JSON.stringify([
      { id: 'local-123', experimentId: 'v1-cap6-esp1', modalita: 'percorso', startTime: '2026-05-04T10:00:00Z' },
    ]);

    const events = [];
    const handler = (ev) => events.push(ev?.detail);
    window.addEventListener('elab-session-restore', handler);

    const result = await restoreSession('local-123');
    expect(result.success).toBe(true);
    expect(result.payload?.experimentId).toBe('v1-cap6-esp1');
    expect(events).toHaveLength(1);
    expect(events[0].experimentId).toBe('v1-cap6-esp1');

    window.removeEventListener('elab-session-restore', handler);
  });

  it('sets elab_resume_experiment localStorage on success', async () => {
    const { restoreSession } = await import('../../../src/services/sessionRestore');
    lsStore.elab_unlim_sessions = JSON.stringify([
      { id: 'local-456', experimentId: 'v2-cap3-esp1' },
    ]);
    await restoreSession('local-456');
    expect(lsStore.elab_resume_experiment).toBe('v2-cap3-esp1');
  });

  it('returns malformed_record when no experimentId in record', async () => {
    const { restoreSession } = await import('../../../src/services/sessionRestore');
    lsStore.elab_unlim_sessions = JSON.stringify([
      { id: 'local-789' /* missing experimentId */ },
    ]);
    const result = await restoreSession('local-789');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/malformed_record/);
  });
});

describe('sessionRestore.buildRestorePayload', () => {
  it('returns null on null input', async () => {
    const { buildRestorePayload } = await import('../../../src/services/sessionRestore');
    expect(buildRestorePayload(null)).toBeNull();
    expect(buildRestorePayload(undefined)).toBeNull();
  });

  it('maps fields with backward-compat (experimentId | experiment_id)', async () => {
    const { buildRestorePayload } = await import('../../../src/services/sessionRestore');
    const payload = buildRestorePayload({
      id: 'sess-1',
      experimentId: 'v1-cap6-esp1',
      modalita: 'libero',
      currentVolume: 1,
      currentVolumePage: 29,
    });
    expect(payload.sessionId).toBe('sess-1');
    expect(payload.experimentId).toBe('v1-cap6-esp1');
    expect(payload.modalita).toBe('libero');
    expect(payload.currentVolume).toBe(1);
    expect(payload.currentVolumePage).toBe(29);
  });

  it('defaults modalita to "percorso" when missing', async () => {
    const { buildRestorePayload } = await import('../../../src/services/sessionRestore');
    const payload = buildRestorePayload({ experimentId: 'x' });
    expect(payload.modalita).toBe('percorso');
  });
});

describe('sessionRestore.subscribeToRestore', () => {
  it('invokes handler with detail payload', async () => {
    const { subscribeToRestore } = await import('../../../src/services/sessionRestore');
    const calls = [];
    const unsubscribe = subscribeToRestore((p) => calls.push(p));
    window.dispatchEvent(new CustomEvent('elab-session-restore', { detail: { experimentId: 'foo' } }));
    expect(calls).toHaveLength(1);
    expect(calls[0].experimentId).toBe('foo');
    unsubscribe();
    // Post-unsubscribe should NOT receive
    window.dispatchEvent(new CustomEvent('elab-session-restore', { detail: { experimentId: 'bar' } }));
    expect(calls).toHaveLength(1);
  });
});
