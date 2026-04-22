/**
 * Axe-core Playwright helper — sett-4 S4.2.1 stub
 *
 * Scope Day 24 (S4.2.1): install devDep + expose `runAxeScan(page, options)` signature.
 * Day 25+ (S4.2.2): wire to benchmark `accessibility_wcag` metric.
 *
 * Usage:
 *   import { runAxeScan } from './helpers/axe-helper.js';
 *   const report = await runAxeScan(page, { tags: ['wcag2aa'] });
 *
 * @see docs/architectures/ADR-006-karpathy-llm-wiki-three-layer.md — sprint-4 scope
 * @see automa/team-state/sprint-contracts/sett-4-sprint-contract.md — Epic 4.2
 */

import AxeBuilder from '@axe-core/playwright';

const DEFAULT_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/**
 * Run axe-core accessibility scan on a Playwright page.
 *
 * @param {import('@playwright/test').Page} page - Playwright page instance
 * @param {{ tags?: string[], disableRules?: string[], include?: string[] }} [options]
 * @returns {Promise<import('axe-core').AxeResults>}
 */
export async function runAxeScan(page, options = {}) {
  const { tags = DEFAULT_TAGS, disableRules = [], include = [] } = options;

  let builder = new AxeBuilder({ page }).withTags(tags);
  if (disableRules.length > 0) builder = builder.disableRules(disableRules);
  for (const selector of include) builder = builder.include(selector);

  return builder.analyze();
}

/**
 * Summarise axe results to compact metric shape.
 *
 * @param {import('axe-core').AxeResults} results
 * @returns {{ violations: number, critical: number, serious: number, moderate: number, minor: number, passes: number }}
 */
export function summariseAxeResults(results) {
  const summary = {
    violations: results.violations.length,
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
    passes: results.passes.length,
  };
  for (const v of results.violations) {
    if (v.impact && summary[v.impact] !== undefined) summary[v.impact] += 1;
  }
  return summary;
}
