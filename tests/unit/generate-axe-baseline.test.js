/**
 * Sprint 4 Day 26 — generate-axe-baseline unit tests.
 *
 * Covers parseInputArray validation, aggregateTotals math,
 * buildBaseline envelope, stubBaseline, and runCli happy+sad paths.
 */

import { describe, it, expect, vi } from 'vitest';
import {
  VERSION,
  isValidRouteEntry,
  parseInputArray,
  aggregateTotals,
  buildBaseline,
  stubBaseline,
  runCli,
} from '../../scripts/generate-axe-baseline.mjs';

const sampleRoute = (route, over = {}) => ({
  route,
  summary: {
    violations: 0,
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
    passes: 0,
    ...over,
  },
});

describe('generate-axe-baseline constants', () => {
  it('exports VERSION', () => {
    expect(VERSION).toBe('day26-v1');
  });
});

describe('isValidRouteEntry', () => {
  it('accepts well-formed entries', () => {
    expect(isValidRouteEntry(sampleRoute('/', { passes: 10 }))).toBe(true);
  });
  it('rejects missing route', () => {
    expect(isValidRouteEntry({ summary: sampleRoute('/').summary })).toBe(false);
  });
  it('rejects empty route string', () => {
    expect(isValidRouteEntry(sampleRoute(''))).toBe(false);
  });
  it('rejects missing summary field', () => {
    const e = sampleRoute('/');
    delete e.summary.passes;
    expect(isValidRouteEntry(e)).toBe(false);
  });
  it('rejects negative counts', () => {
    expect(isValidRouteEntry(sampleRoute('/', { violations: -1 }))).toBe(false);
  });
  it('rejects non-numeric counts', () => {
    expect(isValidRouteEntry(sampleRoute('/', { violations: 'many' }))).toBe(false);
  });
});

describe('parseInputArray', () => {
  it('rejects non-array', () => {
    expect(parseInputArray(null).ok).toBe(false);
    expect(parseInputArray({}).ok).toBe(false);
    expect(parseInputArray('[]').ok).toBe(false);
  });
  it('rejects empty array', () => {
    expect(parseInputArray([]).ok).toBe(false);
  });
  it('reports index of malformed entry', () => {
    const r = parseInputArray([sampleRoute('/'), { route: '/broken' }]);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/entry\[1\]/);
  });
  it('accepts list of valid entries', () => {
    const r = parseInputArray([sampleRoute('/'), sampleRoute('/lezioni')]);
    expect(r.ok).toBe(true);
    expect(r.routes.length).toBe(2);
  });
});

describe('aggregateTotals', () => {
  it('sums all per-severity counts across routes', () => {
    const routes = [
      sampleRoute('/', { violations: 3, critical: 1, serious: 2, passes: 50 }),
      sampleRoute('/lezioni', { violations: 2, serious: 1, moderate: 1, passes: 40 }),
    ];
    const t = aggregateTotals(routes);
    expect(t.violations).toBe(5);
    expect(t.critical).toBe(1);
    expect(t.serious).toBe(3);
    expect(t.moderate).toBe(1);
    expect(t.passes).toBe(90);
  });

  it('returns zeros for empty input', () => {
    const t = aggregateTotals([]);
    expect(t).toEqual({ violations: 0, critical: 0, serious: 0, moderate: 0, minor: 0, passes: 0 });
  });
});

describe('buildBaseline', () => {
  it('produces envelope with totals + routes + version', () => {
    const bl = buildBaseline([sampleRoute('/', { passes: 10 })], '2026-04-22T10:00:00Z');
    expect(bl.version).toBe('day26-v1');
    expect(bl.generatedAt).toBe('2026-04-22T10:00:00Z');
    expect(bl.totals.passes).toBe(10);
    expect(bl.routes).toHaveLength(1);
    expect(bl.routes[0].route).toBe('/');
    expect(bl.routes[0].passes).toBe(10);
  });

  it('defaults generatedAt to ISO string when absent', () => {
    const bl = buildBaseline([sampleRoute('/')]);
    expect(bl.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

describe('stubBaseline', () => {
  it('emits zero-violation baseline with / route', () => {
    const bl = stubBaseline('2026-04-22T00:00:00Z');
    expect(bl.routes).toHaveLength(1);
    expect(bl.routes[0].route).toBe('/');
    expect(bl.totals.violations).toBe(0);
    expect(bl.totals.critical).toBe(0);
  });
});

describe('runCli', () => {
  function makeIO(env = {}) {
    const writes = new Map();
    const reads = new Map();
    return {
      writes,
      reads,
      io: {
        cwd: '/tmp/axe-test',
        readFileSync: (p) => {
          if (reads.has(p)) return reads.get(p);
          throw new Error(`ENOENT ${p}`);
        },
        writeFileSync: (p, data) => {
          writes.set(p, data);
        },
        env,
        now: () => '2026-04-22T10:00:00Z',
      },
    };
  }

  it('exits 1 when no mode flag provided', () => {
    const { io } = makeIO();
    const r = runCli([], io);
    expect(r.exitCode).toBe(1);
    expect(r.error).toMatch(/must pass one of/);
  });

  it('--stub writes zero-violations baseline', () => {
    const { io, writes } = makeIO();
    const r = runCli(['--stub'], io);
    expect(r.exitCode).toBe(0);
    const written = JSON.parse(writes.get(r.outPath));
    expect(written.totals.violations).toBe(0);
    expect(written.version).toBe('day26-v1');
  });

  it('--input parses a JSON file + writes baseline', () => {
    const { io, writes, reads } = makeIO();
    const inputPath = '/tmp/axe-test/in.json';
    reads.set(inputPath, JSON.stringify([sampleRoute('/', { passes: 20, critical: 1 })]));
    const r = runCli(['--input', 'in.json'], io);
    expect(r.exitCode).toBe(0);
    const written = JSON.parse(writes.get(r.outPath));
    expect(written.totals.critical).toBe(1);
    expect(written.totals.passes).toBe(20);
  });

  it('--input fails 1 on malformed JSON', () => {
    const { io, reads } = makeIO();
    reads.set('/tmp/axe-test/bad.json', '{not json');
    const r = runCli(['--input', 'bad.json'], io);
    expect(r.exitCode).toBe(1);
    expect(r.error).toMatch(/JSON parse failed/);
  });

  it('--input fails 1 on missing file', () => {
    const { io } = makeIO();
    const r = runCli(['--input', 'ghost.json'], io);
    expect(r.exitCode).toBe(1);
    expect(r.error).toMatch(/read failed/);
  });

  it('--input fails 1 on invalid shape', () => {
    const { io, reads } = makeIO();
    reads.set('/tmp/axe-test/empty.json', '[]');
    const r = runCli(['--input', 'empty.json'], io);
    expect(r.exitCode).toBe(1);
    expect(r.error).toMatch(/empty/);
  });

  it('--from-env reads AXE_BASELINE_INPUT', () => {
    const { io, writes } = makeIO({
      AXE_BASELINE_INPUT: JSON.stringify([sampleRoute('/foo', { violations: 2, serious: 2 })]),
    });
    const r = runCli(['--from-env'], io);
    expect(r.exitCode).toBe(0);
    const written = JSON.parse(writes.get(r.outPath));
    expect(written.totals.serious).toBe(2);
  });

  it('--from-env fails when env var unset', () => {
    const { io } = makeIO();
    const r = runCli(['--from-env'], io);
    expect(r.exitCode).toBe(1);
    expect(r.error).toMatch(/unset/);
  });

  it('--out overrides default output path', () => {
    const { io, writes } = makeIO();
    const r = runCli(['--stub', '--out', 'custom/out.json'], io);
    expect(r.exitCode).toBe(0);
    expect(r.outPath).toContain('custom/out.json');
    expect(writes.has(r.outPath)).toBe(true);
  });
});
