/**
 * sett-4 Day 25 (S4.2 track) — wiki smoke + axe-helper baseline integration.
 *
 * Spec 1: homepage smoke (title + product identity — subset of 01-homepage-load).
 * Spec 2: axe accessibility baseline on homepage, reports summary without failing
 *         (baseline captures current state; future sprint tightens threshold).
 *
 * Uses helpers/axe-helper.js (Day 24 S4.2.1 stub wired live).
 */

import { test, expect } from '@playwright/test';
import { waitForPageReady, TIMEOUTS } from './fixtures.js';
import { runAxeScan, summariseAxeResults } from './helpers/axe-helper.js';

test.describe('Wiki Smoke + Axe Baseline (sett-4 Day 25)', () => {
  test('homepage loads with ELAB product identity', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title.toLowerCase()).toMatch(/elab|tutor/);

    const bodyText = (await page.textContent('body')) || '';
    expect(bodyText.length).toBeGreaterThan(100);
    expect(bodyText.toLowerCase()).toMatch(/elab/);
  });

  test('axe baseline — homepage WCAG 2.1 AA scan reports summary', async ({ page }) => {
    test.setTimeout(TIMEOUTS.pageLoad * 3);
    await page.goto('/');
    await waitForPageReady(page);

    const results = await runAxeScan(page, { tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] });
    const summary = summariseAxeResults(results);

    // Baseline: capture state, log for telemetry. Do NOT fail on violations yet —
    // Day 25 intent is to measure the current surface before Epic 4.2 tightens.
    console.log('[axe-baseline]', JSON.stringify(summary));

    expect(summary.passes).toBeGreaterThanOrEqual(0);
    expect(summary.violations).toBeGreaterThanOrEqual(0);
    // Hard floor: no critical violations allowed to grow unnoticed.
    // If this trips, either the app regressed or the bar needs updating.
    expect(summary.critical).toBeLessThanOrEqual(10);
  });
});
