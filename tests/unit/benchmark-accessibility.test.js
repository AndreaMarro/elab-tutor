/**
 * Sprint 4 Day 26 — benchmark accessibility_wcag metric unit tests.
 *
 * Covers scoring model + two branches:
 *   A) axe-baseline-latest.json present (read + aggregate + score)
 *   B) absent → devDep probe fallback
 */

import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  metricAccessibility,
  scoreFromViolations,
  AXE_BASELINE_FILENAME,
} = require('../../scripts/benchmark-metrics/accessibility.cjs');

function makeMockIO({ baseline, pkgHasAxe = true }) {
  const axePath = /docs\/audit\/axe-baseline-latest\.json$/;
  const pkgPath = /package\.json$/;
  return {
    rootDir: '/tmp/root',
    existsSync: (p) => {
      if (baseline !== null && axePath.test(p)) return true;
      if (pkgPath.test(p)) return true;
      return false;
    },
    readFileSync: (p, _enc) => {
      if (axePath.test(p)) return JSON.stringify(baseline);
      throw new Error(`unexpected read ${p}`);
    },
    readJson: (p) => {
      if (pkgPath.test(p)) {
        return pkgHasAxe
          ? { devDependencies: { '@axe-core/playwright': '1.0.0' } }
          : { devDependencies: {} };
      }
      return null;
    },
  };
}

describe('scoreFromViolations', () => {
  it('0 violations → 1.0', () => {
    expect(scoreFromViolations({ critical: 0, serious: 0, moderate: 0 })).toBe(1);
  });
  it('1 critical → ~0.833', () => {
    const s = scoreFromViolations({ critical: 1, serious: 0, moderate: 0 });
    expect(s).toBeCloseTo(1 - 5 / 30, 3);
  });
  it('6 criticals saturates to 0', () => {
    expect(scoreFromViolations({ critical: 6, serious: 0, moderate: 0 })).toBe(0);
  });
  it('15 serious saturates to 0', () => {
    expect(scoreFromViolations({ critical: 0, serious: 15, moderate: 0 })).toBe(0);
  });
  it('blend: 1c + 2s + 3m → 1 - (5+4+3)/30 = 0.6', () => {
    const s = scoreFromViolations({ critical: 1, serious: 2, moderate: 3 });
    expect(s).toBeCloseTo(0.6, 3);
  });
  it('ignores extra fields', () => {
    const s = scoreFromViolations({ critical: 0, serious: 0, moderate: 0, minor: 100 });
    expect(s).toBe(1);
  });
});

describe('metricAccessibility — baseline file present', () => {
  it('aggregates multi-route totals and returns full envelope', () => {
    const baseline = {
      generatedAt: '2026-04-22T10:00:00Z',
      version: 'day26-v1',
      totals: { violations: 3, critical: 1, serious: 1, moderate: 1, minor: 0, passes: 40 },
      routes: [
        { route: '/', violations: 2, critical: 1, serious: 1, moderate: 0, minor: 0, passes: 20 },
        { route: '/lezioni', violations: 1, critical: 0, serious: 0, moderate: 1, minor: 0, passes: 20 },
      ],
    };
    const io = makeMockIO({ baseline });
    const m = metricAccessibility(io);
    expect(m.source).toBe(AXE_BASELINE_FILENAME);
    expect(m.routes).toBe(2);
    expect(m.critical).toBe(1);
    expect(m.serious).toBe(1);
    expect(m.moderate).toBe(1);
    expect(m.observed).toBe(3);
    expect(m.generatedAt).toBe('2026-04-22T10:00:00Z');
    // score = 1 - (5+2+1)/30 = 1 - 8/30 ≈ 0.7333
    expect(m.value).toBeCloseTo(1 - 8 / 30, 3);
  });

  it('zero-violation baseline → perfect score', () => {
    const baseline = {
      generatedAt: '2026-04-22T10:00:00Z',
      version: 'day26-v1',
      totals: { violations: 0, critical: 0, serious: 0, moderate: 0, minor: 0, passes: 50 },
      routes: [
        { route: '/', violations: 0, critical: 0, serious: 0, moderate: 0, minor: 0, passes: 50 },
      ],
    };
    const io = makeMockIO({ baseline });
    const m = metricAccessibility(io);
    expect(m.value).toBe(1);
    expect(m.observed).toBe(0);
  });

  it('missing routes array → empty aggregation, score 1 (no violations)', () => {
    const baseline = { generatedAt: '2026-04-22T10:00:00Z' };
    const io = makeMockIO({ baseline });
    const m = metricAccessibility(io);
    expect(m.routes).toBe(0);
    expect(m.critical).toBe(0);
    expect(m.value).toBe(1);
  });
});

describe('metricAccessibility — baseline file absent', () => {
  it('axe installed → 0.5 placeholder', () => {
    const io = makeMockIO({ baseline: null, pkgHasAxe: true });
    const m = metricAccessibility(io);
    expect(m.source).toBe('devDep-probe');
    expect(m.value).toBe(0.5);
    expect(m.notes).toMatch(/not yet generated/);
  });

  it('axe not installed → 0', () => {
    const io = makeMockIO({ baseline: null, pkgHasAxe: false });
    const m = metricAccessibility(io);
    expect(m.source).toBe('devDep-probe');
    expect(m.value).toBe(0);
    expect(m.notes).toMatch(/no a11y tooling/);
  });
});

describe('metricAccessibility — parse error', () => {
  it('malformed JSON → value 0 with error note', () => {
    const io = {
      rootDir: '/tmp/root',
      existsSync: () => true,
      readFileSync: () => '{not json',
      readJson: () => ({ devDependencies: {} }),
    };
    const m = metricAccessibility(io);
    expect(m.value).toBe(0);
    expect(m.notes).toMatch(/parse error/);
  });
});
