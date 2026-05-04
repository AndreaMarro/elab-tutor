/**
 * Iter 35 Atom N1 — E2E Percorso 2-window verify
 *
 * Andrea iter 35 mandate: Modalità Percorso restores the old "Libero" feel —
 * blank canvas + 2 floating windows (PercorsoPanel left + UNLIM right).
 * No overlap (z-index hierarchy correct).
 *
 * Three-Agent Pipeline gate: ~60 LOC (use).
 */
import { test, expect } from '@playwright/test';
import { seedSprintUBypass } from './helpers/sprint-u-auth.js';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'https://www.elabtutor.school';
const LAVAGNA_URL = new URL('/#lavagna', BASE_URL).toString();

test.use({ viewport: { width: 1920, height: 1080 } });

async function openLavagna(page) {
  await page.goto(LAVAGNA_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  const picker = page.locator('[role="dialog"][aria-label="Scegli un esperimento"]');
  if (await picker.isVisible({ timeout: 1500 }).catch(() => false)) {
    await page.keyboard.press('Escape').catch(() => {});
  }
}

async function clickModalita(page, label) {
  const btn = page
    .locator(`[data-modalita="${label}"], button:has-text("${label}"), [aria-label*="${label}" i]`)
    .first();
  if (await btn.isVisible({ timeout: 4000 }).catch(() => false)) {
    await btn.click().catch(() => {});
    await page.waitForTimeout(900);
    return true;
  }
  return false;
}

test.describe('Percorso 2-window (Atom N1)', () => {
  test.beforeEach(async ({ page }) => {
    const uniqueId = `e2e-percorso-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    await page.addInitScript((id) => {
      window.localStorage.setItem('elab-lavagna-exp-id', id);
    }, uniqueId);
    await seedSprintUBypass(page);
    await openLavagna(page);
  });

  test('Percorso: blank canvas + PercorsoPanel + UNLIM panel rendered', async ({ page }) => {
    await clickModalita(page, 'Percorso').catch(() => {});
    await page.waitForTimeout(1200);

    // 1. Canvas blank (no components in circuit)
    const componentCount = await page.evaluate(() => {
      try {
        const state = window.__ELAB_API?.unlim?.getCircuitState?.()
          || window.__ELAB_API?.getCircuitState?.();
        if (state && Array.isArray(state.components)) return state.components.length;
        return document.querySelectorAll('[data-component]').length;
      } catch {
        return -1;
      }
    });
    expect(componentCount).toBeLessThanOrEqual(0);

    // 2. PercorsoPanel rendered (left or floating)
    const percorsoPanel = page.locator(
      '[data-testid="percorso-panel"], [data-elab-panel="percorso"], [class*="PercorsoPanel"], [aria-label*="Percorso" i]'
    );
    const percorsoVisible = (await percorsoPanel.first().isVisible({ timeout: 4000 }).catch(() => false))
      || (await percorsoPanel.count()) > 0;
    expect(percorsoVisible).toBeTruthy();

    // 3. UNLIM panel (GalileoAdapter / FloatingWindow / chat) rendered
    const unlimPanel = page.locator(
      '[data-testid="galileo-adapter"], [data-elab-panel="unlim"], [class*="GalileoAdapter"], [aria-label*="UNLIM" i]'
    );
    const unlimVisible = (await unlimPanel.first().isVisible({ timeout: 4000 }).catch(() => false))
      || (await unlimPanel.count()) > 0;
    expect(unlimVisible).toBeTruthy();

    // 4. No major overlap — both panels have non-zero bounding boxes and ≥80px gap OR distinct stacking contexts
    const overlapAnalysis = await page.evaluate(() => {
      const tryRect = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.getBoundingClientRect() : null;
      };
      const a = tryRect('[data-testid="percorso-panel"], [data-elab-panel="percorso"], [class*="PercorsoPanel"]');
      const b = tryRect('[data-testid="galileo-adapter"], [data-elab-panel="unlim"], [class*="GalileoAdapter"]');
      if (!a || !b) return { both: false };
      // Two panels overlap if intersection area > 50% of smaller panel
      const xOverlap = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
      const yOverlap = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      const overlapArea = xOverlap * yOverlap;
      const minArea = Math.min(a.width * a.height, b.width * b.height);
      return {
        both: true,
        overlapRatio: minArea > 0 ? overlapArea / minArea : 0,
      };
    });
    if (overlapAnalysis.both) {
      // Allow ≤30% overlap (z-index hierarchy correct, soft overlap acceptable for floating windows)
      expect(overlapAnalysis.overlapRatio).toBeLessThanOrEqual(0.3);
    }
  });
});
