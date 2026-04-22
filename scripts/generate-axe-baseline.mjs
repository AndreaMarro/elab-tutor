#!/usr/bin/env node
/**
 * Sprint 4 Day 26 (S4.2.2) — generate axe baseline JSON consumed by benchmark.
 *
 * Inputs (one of):
 *   --input <file>   JSON array of { route, summary } objects (from E2E spec)
 *   --from-env       read AXE_BASELINE_INPUT env var (JSON string, CI-friendly)
 *   --stub           emit a zero-violations baseline for smoke/test
 *
 * Output:
 *   docs/audit/axe-baseline-latest.json
 *   {
 *     generatedAt: ISO,
 *     version: 'day26-v1',
 *     totals: { violations, critical, serious, moderate, minor, passes },
 *     routes: [ { route, violations, critical, serious, moderate, minor, passes } ]
 *   }
 *
 * Exit codes: 0 ok, 1 bad input, 2 write failed.
 *
 * Logic exported for vitest. Run-once at module bottom only when executed directly.
 */

import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

export const VERSION = 'day26-v1';

const DEFAULT_OUT = 'docs/audit/axe-baseline-latest.json';

/** @typedef {{ violations: number, critical: number, serious: number, moderate: number, minor: number, passes: number }} AxeSummary */
/** @typedef {{ route: string, summary: AxeSummary }} RouteEntry */

/**
 * @param {unknown} entry
 * @returns {entry is RouteEntry}
 */
export function isValidRouteEntry(entry) {
  if (!entry || typeof entry !== 'object') return false;
  if (typeof entry.route !== 'string' || entry.route.length === 0) return false;
  const s = entry.summary;
  if (!s || typeof s !== 'object') return false;
  for (const k of ['violations', 'critical', 'serious', 'moderate', 'minor', 'passes']) {
    if (typeof s[k] !== 'number' || !Number.isFinite(s[k]) || s[k] < 0) return false;
  }
  return true;
}

/**
 * @param {unknown[]} input
 * @returns {{ ok: true, routes: RouteEntry[] } | { ok: false, error: string }}
 */
export function parseInputArray(input) {
  if (!Array.isArray(input)) {
    return { ok: false, error: 'input must be array' };
  }
  if (input.length === 0) {
    return { ok: false, error: 'input array empty' };
  }
  for (let i = 0; i < input.length; i++) {
    if (!isValidRouteEntry(input[i])) {
      return { ok: false, error: `entry[${i}] invalid shape` };
    }
  }
  return { ok: true, routes: /** @type {RouteEntry[]} */ (input) };
}

/**
 * @param {RouteEntry[]} routes
 * @returns {{ violations: number, critical: number, serious: number, moderate: number, minor: number, passes: number }}
 */
export function aggregateTotals(routes) {
  const totals = { violations: 0, critical: 0, serious: 0, moderate: 0, minor: 0, passes: 0 };
  for (const r of routes) {
    for (const k of Object.keys(totals)) {
      totals[k] += r.summary[k] || 0;
    }
  }
  return totals;
}

/**
 * @param {RouteEntry[]} routes
 * @param {string} [generatedAt]
 */
export function buildBaseline(routes, generatedAt) {
  return {
    generatedAt: generatedAt || new Date().toISOString(),
    version: VERSION,
    totals: aggregateTotals(routes),
    routes: routes.map(r => ({
      route: r.route,
      violations: r.summary.violations,
      critical: r.summary.critical,
      serious: r.summary.serious,
      moderate: r.summary.moderate,
      minor: r.summary.minor,
      passes: r.summary.passes,
    })),
  };
}

export function stubBaseline(generatedAt) {
  return buildBaseline(
    [
      {
        route: '/',
        summary: { violations: 0, critical: 0, serious: 0, moderate: 0, minor: 0, passes: 0 },
      },
    ],
    generatedAt,
  );
}

/**
 * CLI entry helper — pure function for tests + main runner.
 * @param {string[]} argv
 * @param {{ cwd: string, readFileSync: typeof fs.readFileSync, writeFileSync: typeof fs.writeFileSync, env: Record<string,string|undefined>, now?: () => string }} io
 * @returns {{ exitCode: number, outPath?: string, error?: string }}
 */
export function runCli(argv, io) {
  const args = new Map();
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--stub' || a === '--from-env') args.set(a, true);
    else if (a === '--input' || a === '--out') {
      args.set(a, argv[i + 1]);
      i += 1;
    }
  }

  const outRel = args.get('--out') || DEFAULT_OUT;
  const outPath = path.resolve(io.cwd, outRel);
  const generatedAt = io.now ? io.now() : undefined;

  let baseline;
  if (args.get('--stub')) {
    baseline = stubBaseline(generatedAt);
  } else if (args.get('--input')) {
    const inputPath = path.resolve(io.cwd, args.get('--input'));
    let raw;
    try {
      raw = io.readFileSync(inputPath, 'utf8');
    } catch (err) {
      return { exitCode: 1, error: `input read failed: ${String(err.message || err)}` };
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      return { exitCode: 1, error: `input JSON parse failed: ${String(err.message || err)}` };
    }
    const v = parseInputArray(parsed);
    if (!v.ok) return { exitCode: 1, error: v.error };
    baseline = buildBaseline(v.routes, generatedAt);
  } else if (args.get('--from-env')) {
    const envRaw = io.env.AXE_BASELINE_INPUT;
    if (!envRaw) return { exitCode: 1, error: 'AXE_BASELINE_INPUT env var unset' };
    let parsed;
    try {
      parsed = JSON.parse(envRaw);
    } catch (err) {
      return { exitCode: 1, error: `env JSON parse failed: ${String(err.message || err)}` };
    }
    const v = parseInputArray(parsed);
    if (!v.ok) return { exitCode: 1, error: v.error };
    baseline = buildBaseline(v.routes, generatedAt);
  } else {
    return { exitCode: 1, error: 'must pass one of --input <file> | --from-env | --stub' };
  }

  try {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    io.writeFileSync(outPath, JSON.stringify(baseline, null, 2));
  } catch (err) {
    return { exitCode: 2, error: `write failed: ${String(err.message || err)}` };
  }
  return { exitCode: 0, outPath };
}

// Run only when invoked directly (not imported by vitest)
function isDirectRun() {
  try {
    return (
      typeof process !== 'undefined' &&
      process.argv &&
      process.argv[1] &&
      path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
    );
  } catch {
    return false;
  }
}

if (isDirectRun()) {
  const result = runCli(process.argv.slice(2), {
    cwd: process.cwd(),
    readFileSync: fs.readFileSync,
    writeFileSync: fs.writeFileSync,
    env: process.env,
  });
  if (result.exitCode !== 0) {
    console.error(`[axe-baseline] ERROR: ${result.error}`);
    process.exit(result.exitCode);
  }
  console.log(`[axe-baseline] wrote ${result.outPath}`);
}
