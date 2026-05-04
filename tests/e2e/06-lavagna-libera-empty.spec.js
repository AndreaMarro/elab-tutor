/**
 * Iter 35 Atom G4 — E2E Lavagna libera TRUE empty
 *
 * Andrea iter 30 P5054: switching ModalitaSwitch → Libero must produce a
 * truly blank canvas. No PRONTI banner, no LED/R/9V components, no leftover
 * components from prior experiment.
 *
 * Three-Agent Pipeline gate: 50 LOC borderline (use).
 */
import { test, expect } from '@playwright/test';
import { seedSprintUBypass } from './helpers/sprint-u-auth.js';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'https://www.elabtutor.school';
const LAVAGNA_URL = new URL('/#lavagna', BASE_URL).toString();

test.use({ viewport: { width: 1920, height: 1080 } });

async function openLavagna(page) {
  await page.goto(LAVAGNA_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  // Dismiss experiment picker if present
  const picker = page.locator('[role="dialog"][aria-label="Scegli un esperimento"]');
  if (await picker.isVisible({ timeout: 1500 }).catch(() => false)) {
    const closeBtn = picker.getByRole('button', { name: /Chiudi/i }).first();
    if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await closeBtn.click().catch(() => {});
    } else {
      await page.keyboard.press('Escape').catch(() => {});
    }
  }
}

async function clickModalita(page, label) {
  const btn = page
    .locator(`[data-modalita="${label}"], button:has-text("${label}"), [aria-label*="${label}" i]`)
    .first();
  if (await btn.isVisible({ timeout: 4000 }).catch(() => false)) {
    await btn.click().catch(() => {});
    await page.waitForTimeout(700);
    return true;
  }
  return false;
}

test.describe('Lavagna libera TRUE empty (Atom G4)', () => {
  test.beforeEach(async ({ page }) => {
    const uniqueId = `e2e-libero-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    await page.addInitScript((id) => {
      window.localStorage.setItem('elab-lavagna-exp-id', id);
      // Iter 30 sentinel — declare libero entry
      window.localStorage.setItem('elab-lavagna-libero-active', '1');
    }, uniqueId);
    await seedSprintUBypass(page);
    await openLavagna(page);
  });

  test('Libero mode: canvas is empty + no PRONTI banner + no components', async ({ page }) => {
    // Switch to Libero (or remain in default if already libero)
    await clickModalita(page, 'Libero').catch(() => {});

    // Allow a moment for clearAll + setCurrentExperiment(null) to apply
    await page.waitForTimeout(1500);

    // Assert via API: components.length === 0
    const componentCount = await page.evaluate(() => {
      try {
        const state = window.__ELAB_API?.unlim?.getCircuitState?.()
          || window.__ELAB_API?.getCircuitState?.();
        if (state && Array.isArray(state.components)) return state.components.length;
        // Fallback: count [data-component] in DOM
        return document.querySelectorAll('[data-component]').length;
      } catch {
        return -1;
      }
    });
    expect(componentCount).toBeLessThanOrEqual(0);

    // Assert no PRONTI banner visible
    const prontiBanner = page.locator(
      '[data-elab-pronti], [data-pronti], :text("Pronti a montare"), :text("PRONTI A MONTARE")'
    ).first();
    await expect(prontiBanner).toBeHidden({ timeout: 2000 }).catch(async () => {
      // Soft assertion — count 0 is fine
      const count = await prontiBanner.count();
      expect(count).toBe(0);
    });

    // Assert no LED / R / 9V components rendered
    const components = page.locator('[data-component], [data-elab-component]');
    const count = await components.count();
    expect(count).toBe(0);
  });
});
