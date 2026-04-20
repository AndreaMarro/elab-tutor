// @ts-check
/**
 * Vision E2E — VisionButton → __ELAB_API.captureScreenshot → UNLIM analyzeImage.
 * Stub analyzeImage at network level (no real Supabase call).
 * Claude Opus 4.7 — Andrea Marro — 19/04/2026
 */
import { test, expect } from '@playwright/test';
import { setupUser, setTeacherUser } from './helpers.js';

const TINY_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
const TINY_PNG_DATA_URL = `data:image/png;base64,${TINY_PNG_BASE64}`;

async function goToLavagna(page) {
  await page.goto('/#lavagna');
  const freeBtn = page.getByRole('button', { name: /Lavagna libera/i });
  await expect(freeBtn).toBeVisible({ timeout: 15000 });
  await freeBtn.click();
}

async function stubVisionInfra(page) {
  // Stub captureScreenshot on __ELAB_API once it exists.
  await page.addInitScript((dataUrl) => {
    const tryPatch = () => {
      const api = window.__ELAB_API;
      if (api && typeof api.captureScreenshot !== 'function') {
        api.captureScreenshot = async () => dataUrl;
      } else if (api && typeof api.captureScreenshot === 'function') {
        api.captureScreenshot = async () => dataUrl;
      }
    };
    tryPatch();
    const interval = setInterval(() => {
      if (window.__ELAB_API) { tryPatch(); clearInterval(interval); }
    }, 100);
    setTimeout(() => clearInterval(interval), 20000);
  }, TINY_PNG_DATA_URL);

  // Stub Supabase unlim-chat edge function response to avoid real AI call.
  // Body shape must include `success: true` and `response` — tryNanobot() in
  // src/services/api.js returns null otherwise (causing fallback cascade).
  const stubBody = JSON.stringify({
    success: true,
    response: 'Ragazzi, il circuito sembra in ordine! LED collegato bene come spiega il Vol. 1.',
    model: 'stub',
    tokens: 0,
  });
  await page.route(/.*functions\/v1\/unlim-chat.*/, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: stubBody });
  });
  // Defensive: also stub Render fallback /chat and local server probe so the
  // response cascade lands on our stub deterministically.
  await page.route(/elab-galileo\.onrender\.com\/.*/, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: stubBody });
  });
  await page.route(/localhost:8000\/.*/, async (route) => {
    await route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
  });
}

test.describe('Vision E2E — VisionButton → UNLIM', () => {
  test.beforeEach(async ({ page }) => {
    await setupUser(page);
    await setTeacherUser(page);
    await stubVisionInfra(page);
  });

  test('VisionButton visible with label "Guarda il mio circuito"', async ({ page }) => {
    await goToLavagna(page);
    const btn = page.getByRole('button', { name: /Guarda il mio circuito/i });
    await expect(btn).toBeVisible({ timeout: 15000 });
  });

  test('clicking VisionButton dispatches elab-vision-capture event', async ({ page }) => {
    await goToLavagna(page);
    await page.evaluate(() => {
      window.__visionEvents = [];
      window.addEventListener('elab-vision-capture', (e) => {
        window.__visionEvents.push(e.detail || {});
      });
    });
    const btn = page.getByRole('button', { name: /Guarda il mio circuito/i });
    await expect(btn).toBeVisible({ timeout: 15000 });
    await btn.click();
    await expect.poll(
      async () => page.evaluate(() => (window.__visionEvents || []).length),
      { timeout: 5000 }
    ).toBeGreaterThan(0);
    const event = await page.evaluate(() => window.__visionEvents[0]);
    expect(event.base64).toContain('iVBOR');
    expect(event.mimeType).toBe('image/png');
  });

  test('Principio Zero v3: button label uses plural Italian, no "Docente leggi"', async ({ page }) => {
    await goToLavagna(page);
    const btn = page.getByRole('button', { name: /Guarda il mio circuito/i });
    await expect(btn).toBeVisible({ timeout: 15000 });
    const ariaLabel = await btn.getAttribute('aria-label');
    expect(ariaLabel).toMatch(/Guarda il mio circuito/i);
    expect(ariaLabel).not.toMatch(/Docente,\s*leggi/i);
    expect(ariaLabel).not.toMatch(/Insegnante,\s*leggi/i);
  });

  test('captureScreenshot contract: returns data URL or null', async ({ page }) => {
    await goToLavagna(page);
    // Ensure VisionButton is mounted so __ELAB_API presence was already confirmed by the other specs
    const btn = page.getByRole('button', { name: /Guarda il mio circuito/i });
    await expect(btn).toBeVisible({ timeout: 15000 });
    // Click dispatches capture (populates state), then we invoke captureScreenshot directly
    await btn.click();
    const result = await page.evaluate(async () => {
      const api = window.__ELAB_API;
      if (!api || typeof api.captureScreenshot !== 'function') return '__missing__';
      try {
        const out = await api.captureScreenshot();
        return out === null || out === undefined ? null : String(out);
      } catch {
        return '__threw__';
      }
    });
    // Documented contract: either a data URL string or null
    if (result === null) {
      expect(result).toBeNull();
    } else {
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^data:image\//);
    }
  });

  test('mocked UNLIM response body renders in chat UI', async ({ page }) => {
    await goToLavagna(page);
    const btn = page.getByRole('button', { name: /Guarda il mio circuito/i });
    await expect(btn).toBeVisible({ timeout: 15000 });
    // Click triggers: capture event → useGalileoChat listener → analyzeImage → /unlim-chat (stubbed).
    // LavagnaShell.handleVisionResult also opens the galileo panel so the ChatOverlay mounts.
    await btn.click();
    // Response text from stubVisionInfra L44 must surface in DOM within 10s
    // If the current UI does not render the mocked response (backend/feature gap), this will
    // fail with a clear Playwright timeout — we do NOT relax the assertion to fake green.
    await expect(
      page.getByText(/Ragazzi, il circuito/i).first()
    ).toBeVisible({ timeout: 10000 });
  });
});
