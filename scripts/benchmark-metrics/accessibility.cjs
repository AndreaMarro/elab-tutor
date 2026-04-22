/**
 * Sprint 4 Day 26 (S4.2.2) — accessibility_wcag metric.
 *
 * Reads docs/audit/axe-baseline-latest.json (emitted by scripts/generate-axe-baseline.mjs)
 * and returns a benchmark metric object. Falls back to devDep probe when file absent.
 *
 * Extracted from scripts/benchmark.cjs for direct unit testing.
 */

const fs = require('fs');
const path = require('path');

const AXE_BASELINE_FILENAME = 'axe-baseline-latest.json';

/**
 * Score model: violations penalise proportional to severity.
 *   weighted = 5*critical + 2*serious + 1*moderate
 *   score    = clamp01(1 - weighted / 30)
 * Rationale: 6 crits == 0, 15 serious == 0, 30 moderate == 0.
 * Minor is tracked but not penalised (decorative contrast, etc).
 *
 * @param {{ critical: number, serious: number, moderate: number }} counts
 * @returns {number} score in [0, 1]
 */
function scoreFromViolations(counts) {
  const crit = Number(counts.critical || 0);
  const ser = Number(counts.serious || 0);
  const mod = Number(counts.moderate || 0);
  const weighted = 5 * crit + 2 * ser + 1 * mod;
  const score = 1 - weighted / 30;
  return Math.max(0, Math.min(1, score));
}

/**
 * @param {{ rootDir: string, readFileSync?: typeof fs.readFileSync, existsSync?: typeof fs.existsSync, readJson?: (p: string) => any }} opts
 */
function metricAccessibility(opts) {
  const rootDir = opts.rootDir;
  const readFileSync = opts.readFileSync || fs.readFileSync;
  const existsSync = opts.existsSync || fs.existsSync;
  const readJson = opts.readJson || ((p) => {
    if (!existsSync(p)) return null;
    try {
      return JSON.parse(readFileSync(p, 'utf8'));
    } catch {
      return null;
    }
  });

  const baselinePath = path.join(rootDir, 'docs', 'audit', AXE_BASELINE_FILENAME);

  if (existsSync(baselinePath)) {
    try {
      const raw = readFileSync(baselinePath, 'utf8').trim();
      const data = JSON.parse(raw);
      const routes = Array.isArray(data.routes) ? data.routes : [];
      let critical = 0, serious = 0, moderate = 0, minor = 0;
      for (const r of routes) {
        critical += Number(r.critical || 0);
        serious += Number(r.serious || 0);
        moderate += Number(r.moderate || 0);
        minor += Number(r.minor || 0);
      }
      const score = scoreFromViolations({ critical, serious, moderate });
      const totalViol = critical + serious + moderate + minor;
      return {
        value: score,
        observed: totalViol,
        critical,
        serious,
        moderate,
        minor,
        routes: routes.length,
        source: AXE_BASELINE_FILENAME,
        generatedAt: data.generatedAt || null,
        notes: `axe live: ${critical}c/${serious}s/${moderate}m/${minor}mi across ${routes.length} route(s)`,
      };
    } catch (err) {
      return {
        value: 0,
        observed: 0,
        source: AXE_BASELINE_FILENAME,
        notes: `axe baseline parse error: ${String(err.message || err).slice(0, 120)}`,
      };
    }
  }

  const pkg = readJson(path.join(rootDir, 'package.json'));
  if (!pkg) return { value: 0, observed: 0, notes: 'no package.json' };
  const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const hasAxe = Object.keys(allDeps).some((k) => k.includes('axe'));
  return {
    value: hasAxe ? 0.5 : 0,
    observed: hasAxe,
    source: 'devDep-probe',
    notes: hasAxe ? 'axe installed (baseline not yet generated)' : 'no a11y tooling',
  };
}

module.exports = { metricAccessibility, scoreFromViolations, AXE_BASELINE_FILENAME };
