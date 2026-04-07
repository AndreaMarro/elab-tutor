/**
 * gamificationService.test.js — Test per gamification ELAB
 * Target: points, streak, badges, orchestration, teardown
 * 25+ test: state management, edge cases, boundary values
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import gamification from '../../src/services/gamificationService';

// Mock localStorage
const store = {};
const mockLocalStorage = {
  getItem: vi.fn(k => store[k] || null),
  setItem: vi.fn((k, v) => { store[k] = v; }),
  removeItem: vi.fn(k => { delete store[k]; }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage, writable: true });

// Mock AudioContext
const mockOsc = { type: '', frequency: { value: 0 }, connect: vi.fn(), start: vi.fn(), stop: vi.fn() };
const mockGain = { gain: { value: 0, exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn() };
window.AudioContext = vi.fn(() => ({
  currentTime: 0, state: 'running', resume: vi.fn(() => Promise.resolve()),
  createOscillator: vi.fn(() => ({ ...mockOsc })),
  createGain: vi.fn(() => ({ ...mockGain })),
  destination: {}, close: vi.fn(() => Promise.resolve()),
}));

beforeEach(() => {
  mockLocalStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  gamification.teardown();
});

// ═══════════════════════════════════════════
// POINTS
// ═══════════════════════════════════════════

describe('points system', () => {
  it('starts at 0', () => {
    expect(gamification.getTotalPoints()).toBe(0);
  });

  it('adds points and returns total', () => {
    const total = gamification.addPoints(10, 'test');
    expect(total).toBe(10);
  });

  it('accumulates points', () => {
    gamification.addPoints(10, 'a');
    gamification.addPoints(5, 'b');
    expect(gamification.getTotalPoints()).toBe(15);
  });

  it('records history', () => {
    gamification.addPoints(10, 'Esperimento test1');
    const data = gamification.getPoints();
    expect(data.history.length).toBe(1);
    expect(data.history[0].amount).toBe(10);
    expect(data.history[0].reason).toBe('Esperimento test1');
    expect(data.history[0].ts).toBeGreaterThan(0);
  });

  it('caps history at 200', () => {
    for (let i = 0; i < 210; i++) {
      gamification.addPoints(1, `item${i}`);
    }
    const data = gamification.getPoints();
    expect(data.history.length).toBeLessThanOrEqual(200);
  });

  it('POINT_VALUES are defined', () => {
    expect(gamification.POINT_VALUES.experimentCompleted).toBe(10);
    expect(gamification.POINT_VALUES.quizCorrect).toBe(5);
    expect(gamification.POINT_VALUES.firstExperiment).toBe(20);
    expect(gamification.POINT_VALUES.gameWon).toBe(8);
  });

  it('handles corrupted localStorage', () => {
    store['elab_gamification_points'] = 'NOT JSON';
    expect(gamification.getTotalPoints()).toBe(0);
  });
});

// ═══════════════════════════════════════════
// STREAK
// ═══════════════════════════════════════════

describe('streak system', () => {
  it('starts at 0', () => {
    const streak = gamification.getStreak();
    expect(streak.current).toBe(0);
    expect(streak.lastDate).toBeNull();
  });

  it('first update sets streak to 1', () => {
    const streak = gamification.updateStreak();
    expect(streak.current).toBe(1);
    expect(streak.lastDate).toBe(new Date().toISOString().slice(0, 10));
  });

  it('same day does not increase streak', () => {
    gamification.updateStreak();
    const streak = gamification.updateStreak();
    expect(streak.current).toBe(1); // still 1
  });

  it('tracks best streak', () => {
    const streak = gamification.updateStreak();
    expect(streak.best).toBe(1);
  });

  it('handles corrupted localStorage', () => {
    store['elab_gamification_streak'] = '{broken';
    const streak = gamification.getStreak();
    expect(streak.current).toBe(0);
  });
});

// ═══════════════════════════════════════════
// BADGES
// ═══════════════════════════════════════════

describe('badge system', () => {
  it('BADGE_DEFS has 8 badges', () => {
    expect(gamification.BADGE_DEFS.length).toBe(8);
  });

  it('all badges have required fields', () => {
    for (const b of gamification.BADGE_DEFS) {
      expect(b.id).toBeTruthy();
      expect(b.name).toBeTruthy();
      expect(b.desc).toBeTruthy();
      expect(typeof b.check).toBe('function');
    }
  });

  it('starts with no unlocked badges', () => {
    expect(gamification.getUnlockedBadges()).toEqual([]);
  });

  it('unlocks first-experiment badge', () => {
    const newBadges = gamification.checkAndUnlockBadges({ experiments: 1, streak: 0, quizzes: 0 });
    expect(newBadges.length).toBe(1);
    expect(newBadges[0].id).toBe('first-experiment');
  });

  it('does not double-unlock', () => {
    gamification.checkAndUnlockBadges({ experiments: 1, streak: 0, quizzes: 0 });
    const second = gamification.checkAndUnlockBadges({ experiments: 1, streak: 0, quizzes: 0 });
    expect(second.length).toBe(0);
  });

  it('unlocks multiple badges at once', () => {
    const newBadges = gamification.checkAndUnlockBadges({ experiments: 10, streak: 3, quizzes: 10 });
    expect(newBadges.length).toBeGreaterThanOrEqual(4); // first, exp-5, exp-10, streak-3, quiz-master
  });

  it('getAllBadges returns all with unlocked flag', () => {
    gamification.checkAndUnlockBadges({ experiments: 1, streak: 0, quizzes: 0 });
    const all = gamification.getAllBadges();
    expect(all.length).toBe(8);
    const first = all.find(b => b.id === 'first-experiment');
    expect(first.unlocked).toBe(true);
    const exp5 = all.find(b => b.id === 'exp-5');
    expect(exp5.unlocked).toBe(false);
  });

  it('handles corrupted localStorage', () => {
    store['elab_gamification_badges'] = 'broken';
    expect(gamification.getUnlockedBadges()).toEqual([]);
  });
});

// ═══════════════════════════════════════════
// ORCHESTRATION
// ═══════════════════════════════════════════

describe('orchestration', () => {
  it('onExperimentCompleted returns total + newBadges + streak', () => {
    const result = gamification.onExperimentCompleted('v1-cap1-esp1', true);
    expect(result.total).toBe(20); // firstExperiment = 20
    expect(result.newBadges).toBeDefined();
    expect(result.streak).toBeDefined();
  });

  it('onExperimentCompleted non-first gives 10 points', () => {
    const result = gamification.onExperimentCompleted('v1-cap1-esp2', false);
    expect(result.total).toBe(10);
  });

  it('onQuizCorrect gives 5 points', () => {
    const total = gamification.onQuizCorrect('v1-cap1-esp1');
    expect(total).toBe(5);
  });

  it('onGameWon gives 8 points', () => {
    const total = gamification.onGameWon('detective-1');
    expect(total).toBe(8);
  });

  it('onQuizWrong does not crash', () => {
    expect(() => gamification.onQuizWrong()).not.toThrow();
  });
});

// ═══════════════════════════════════════════
// TEARDOWN
// ═══════════════════════════════════════════

describe('teardown', () => {
  it('does not crash when called with nothing active', () => {
    expect(() => gamification.teardown()).not.toThrow();
  });

  it('double teardown does not crash', () => {
    gamification.teardown();
    expect(() => gamification.teardown()).not.toThrow();
  });
});
