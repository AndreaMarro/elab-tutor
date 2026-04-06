/**
 * Test unlimMemory.js — verifica persistence tier 1 (localStorage).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const store = {};
const localStorageMock = {
  getItem: vi.fn(key => store[key] || null),
  setItem: vi.fn((key, val) => { store[key] = val; }),
  removeItem: vi.fn(key => { delete store[key]; }),
  clear: vi.fn(() => Object.keys(store).forEach(k => delete store[k])),
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });

// Mock supabaseClient
vi.mock('../../src/services/supabaseClient', () => ({
  default: null,
  isSupabaseConfigured: () => false,
}));

// Mock logger
vi.mock('../../src/utils/logger', () => ({
  default: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// Mock navigator.sendBeacon
globalThis.navigator = { sendBeacon: vi.fn() };

import { unlimMemory } from '../../src/services/unlimMemory';

describe('unlimMemory — Tier 1 localStorage', () => {
  beforeEach(() => {
    Object.keys(store).forEach(k => delete store[k]);
    vi.clearAllMocks();
  });

  it('getProfile returns empty object when no data', () => {
    const profile = unlimMemory.getProfile();
    expect(profile).toEqual(expect.any(Object));
  });

  it('updateProfile merges data and sets lastUpdated', () => {
    unlimMemory.updateProfile({ studentName: 'Marco' });
    const profile = unlimMemory.getProfile();
    expect(profile.studentName).toBe('Marco');
    expect(profile.lastUpdated).toBeGreaterThan(0);
  });

  it('trackExperimentCompletion records experiment', () => {
    unlimMemory.trackExperimentCompletion('v1-cap6-esp1');
    const profile = unlimMemory.getProfile();
    expect(profile.experiments).toBeDefined();
    const exp = profile.experiments['v1-cap6-esp1'];
    expect(exp).toBeTruthy();
    expect(exp.completed).toBe(true);
    expect(exp.attempts).toBeGreaterThanOrEqual(1);
  });

  it('trackQuizResult records score', () => {
    unlimMemory.trackQuizResult('v1-cap6-esp1', 3, 4);
    const profile = unlimMemory.getProfile();
    expect(profile.quizzes).toBeDefined();
    expect(profile.quizzes['v1-cap6-esp1'].correct).toBe(3);
    expect(profile.quizzes['v1-cap6-esp1'].percentage).toBe(75);
  });

  it('trackMistake records mistake with category', () => {
    unlimMemory.trackMistake('polarity', 'LED inserted backwards');
    const profile = unlimMemory.getProfile();
    expect(profile.mistakes).toBeDefined();
    expect(profile.mistakes.length).toBeGreaterThanOrEqual(1);
    expect(profile.mistakes[0].category).toBe('polarity');
  });

  it('trackMistake caps at MAX_MISTAKES (50)', () => {
    for (let i = 0; i < 60; i++) {
      unlimMemory.trackMistake('test', `mistake ${i}`);
    }
    const profile = unlimMemory.getProfile();
    expect(profile.mistakes.length).toBeLessThanOrEqual(50);
  });

  it('saveSessionSummary records session', () => {
    unlimMemory.saveSessionSummary({
      experimentId: 'v1-cap6-esp1',
      duration: 300,
      messages: 5,
    });
    const profile = unlimMemory.getProfile();
    expect(profile.sessionSummaries).toBeDefined();
    expect(profile.sessionSummaries.length).toBeGreaterThanOrEqual(1);
  });

  it('saveSessionSummary caps at MAX_HISTORY_SESSIONS (10)', () => {
    for (let i = 0; i < 15; i++) {
      unlimMemory.saveSessionSummary({ experimentId: `exp-${i}`, duration: 60 });
    }
    const profile = unlimMemory.getProfile();
    expect(profile.sessionSummaries.length).toBeLessThanOrEqual(10);
  });

  it('buildMemoryContext returns string', () => {
    unlimMemory.updateProfile({ studentName: 'Luca' });
    unlimMemory.trackExperimentCompletion('v1-cap6-esp1');
    const ctx = unlimMemory.buildMemoryContext();
    expect(typeof ctx).toBe('string');
    expect(ctx.length).toBeGreaterThan(0);
  });

  it('resetMemory clears all data', () => {
    unlimMemory.updateProfile({ studentName: 'Test' });
    unlimMemory.resetMemory();
    const profile = unlimMemory.getProfile();
    expect(profile.studentName).toBeUndefined();
  });
});
