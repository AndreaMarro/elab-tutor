import { test, expect } from '@playwright/test';
import { seedSprintUBypass } from './helpers/sprint-u-auth.js';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'https://www.elabtutor.school';
const LAVAGNA_URL = new URL('/lavagna#libero', BASE_URL).toString();
const FALLBACK_LAVAGNA_URL = new URL('/#lavagna', BASE_URL).toString();

test.use({ viewport: { width: 1920, height: 1080 } });

async function installFlushProbe(page) {
  await page.addInitScript(() => {
    if (window.__ELAB_FLUSH_PROBE__) return;

    const probe = {
      writes: [],
      exitAt: null,
    };

    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args) => {
      try {
        const input = args[0];
        const init = args[1] || {};
        const method = String(
          init.method || (typeof input !== 'string' && input?.method) || 'GET'
        ).toUpperCase();
        const url = typeof input === 'string' ? input : String(input?.url || '');
        if (url.includes('scribble_paths') && method !== 'GET') {
          probe.writes.push({ ts: performance.now(), method, url });
        }
      } catch {
        // no-op
      }
      return originalFetch(...args);
    };

    window.__ELAB_FLUSH_PROBE__ = probe;
  });
}

async function clearDrawingStorage(page) {
  await page.evaluate(() => {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (key && key.startsWith('elab-drawing-')) keys.push(key);
      }
      for (const key of keys) localStorage.removeItem(key);
      localStorage.removeItem('elab-lavagna-last-expId');
      localStorage.removeItem('elab-lavagna-exp-id');
      localStorage.removeItem('elab-lavagna-libero-active');
    } catch {
      // no-op
    }
  });
}

async function openLavagna(page) {
  await page.goto(LAVAGNA_URL, { waitUntil: 'domcontentloaded' });
  const landedOnLavagna = /#lavagna|#libero/i.test(page.url());
  if (!landedOnLavagna) {
    await page.goto(FALLBACK_LAVAGNA_URL, { waitUntil: 'domcontentloaded' });
  }
  await dismissExperimentPickerIfPresent(page);
  await page.waitForTimeout(600);
}

async function dismissExperimentPickerIfPresent(page) {
  const picker = page.locator('[role="dialog"][aria-label="Scegli un esperimento"]');
  const visible = await picker.isVisible({ timeout: 1500 }).catch(() => false);
  if (!visible) return;

  const freeBtn = picker.getByText(/Lavagna libera/i).first();
  if (await freeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await freeBtn.click().catch(() => {});
    return;
  }

  const closeBtn = picker.getByRole('button', { name: /Chiudi/i }).first();
  if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await closeBtn.click().catch(() => {});
    return;
  }

  await page.keyboard.press('Escape').catch(() => {});
}

async function ensurePenActive(page) {
  const penBtn = page
    .locator('[aria-label="Pen tool"], button:has-text("Penna"), [data-tool="pen"], [aria-label*="penna" i]')
    .first();

  if (await penBtn.isVisible({ timeout: 2500 }).catch(() => false)) {
    await penBtn.click().catch(() => {});
  } else {
    await page.evaluate(() => {
      try {
        window.__ELAB_API?.toggleDrawing?.(true);
      } catch {
        // no-op
      }
    });
  }
}

async function waitForDrawingSurface(page) {
  const preferred = page.locator('canvas[data-testid="drawing-overlay"]').first();
  const preferredVisible = await preferred.isVisible({ timeout: 3000 }).catch(() => false);
  if (preferredVisible) return preferred;

  const fallback = page.locator('svg[xmlns="http://www.w3.org/2000/svg"], canvas').first();
  await expect(fallback).toBeVisible({ timeout: 10000 });
  return fallback;
}

async function drawStroke(page, surface, startX, startY, endX, endY) {
  const box = await surface.boundingBox();
  expect(box).toBeTruthy();

  const x1 = box.x + startX;
  const y1 = box.y + startY;
  const x2 = box.x + endX;
  const y2 = box.y + endY;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  await page.mouse.move(x1, y1);
  await page.mouse.down();
  await page.mouse.move(mx, my);
  await page.mouse.move(x2, y2);
  await page.mouse.up();
}

async function clickEsciAndConfirm(page) {
  await page.evaluate(() => {
    if (window.__ELAB_FLUSH_PROBE__) {
      window.__ELAB_FLUSH_PROBE__.exitAt = performance.now();
    }
  });

  const esciBtn = page.locator([
    'button[data-elab-action="esci-lavagna"]',
    'button[data-elab-action="exit"]',
    'button:has-text("Esci")',
    'button:has-text("Esci dalla lavagna")',
    'button:has-text("Torna ai Ragazzi")',
  ].join(', ')).first();

  if (await esciBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await esciBtn.click().catch(() => {});
  } else {
    await page.evaluate(() => {
      window.location.hash = '#tutor';
    });
  }

  const confirmBtn = page
    .locator('[role="dialog"] button:has-text("Conferma"), [role="dialog"] button:has-text("Esci"), [role="dialog"] button:has-text("Sì"), [role="dialog"] button:has-text("Si")')
    .first();

  if (await confirmBtn.isVisible({ timeout: 1200 }).catch(() => false)) {
    await confirmBtn.click().catch(() => {});
  }
}

async function getPersistedPathsCount(page) {
  return page.evaluate(() => {
    try {
      const apiPaths = window.__ELAB_API?.unlim?.getCircuitState?.()?.paths;
      if (Array.isArray(apiPaths)) return apiPaths.length;
    } catch {
      // no-op
    }

    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (key && key.startsWith('elab-drawing-')) keys.push(key);
      }
      let maxLen = 0;
      for (const key of keys) {
        const parsed = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(parsed) && parsed.length > maxLen) maxLen = parsed.length;
      }
      return maxLen;
    } catch {
      return 0;
    }
  });
}

async function getWriteCount(page) {
  return page.evaluate(() => window.__ELAB_FLUSH_PROBE__?.writes?.length || 0);
}

function waitForPersistWrite(page, { method = null, tolerateMissing = true } = {}) {
  const responsePromise = page
    .waitForResponse(
      (r) => r.url().includes('scribble_paths')
        && r.request().method() !== 'GET'
        && (!method || r.request().method() === method),
      { timeout: 15000 }
    );

  if (!tolerateMissing) return responsePromise;
  return responsePromise.catch(() => null);
}

test.describe('Esci persistence L4', () => {
  test.beforeEach(async ({ page }) => {
    const uniqueId = `e2e-persistence-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    await page.addInitScript((id) => {
      window.localStorage.setItem('elab-lavagna-exp-id', id);
      window.__ELAB_E2E_TEST_EXP_ID__ = id;
    }, uniqueId);

    await seedSprintUBypass(page);
    await installFlushProbe(page);
    await openLavagna(page);
    await clearDrawingStorage(page);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await dismissExperimentPickerIfPresent(page);
  });

  test.afterEach(async ({ page }) => {
    await clearDrawingStorage(page).catch(() => {});
  });

  test('Test 1: draw 3 strokes + Esci + reopen + assert 3 paths restored', async ({ page }) => {
    await waitForDrawingSurface(page);
    await ensurePenActive(page);
    const surface = await waitForDrawingSurface(page);

    await drawStroke(page, surface, 120, 110, 220, 150);
    await drawStroke(page, surface, 150, 190, 260, 230);
    await drawStroke(page, surface, 180, 270, 290, 320);

    const savePromise = waitForPersistWrite(page);
    await clickEsciAndConfirm(page);
    await savePromise;

    await openLavagna(page);
    await ensurePenActive(page);
    await waitForDrawingSurface(page);

    await expect
      .poll(async () => getPersistedPathsCount(page), { timeout: 10000 })
      .toBe(3);
  });

  test('Test 2: immediate Esci before debounce + verify flush fired', async ({ page }) => {
    await waitForDrawingSurface(page);
    await ensurePenActive(page);
    const surface = await waitForDrawingSurface(page);

    const writesBefore = await getWriteCount(page);

    await drawStroke(page, surface, 130, 130, 250, 190);

    const [response] = await Promise.all([
      waitForPersistWrite(page, { method: 'POST', tolerateMissing: false }),
      clickEsciAndConfirm(page),
    ]);

    expect([200, 201, 204]).toContain(response.status());

    const flushFired = await page
      .waitForFunction(
        (baseline) => {
          const probe = window.__ELAB_FLUSH_PROBE__;
          if (!probe || typeof probe.exitAt !== 'number') return false;
          return probe.writes
            .slice(baseline)
            .some((w) => typeof w.ts === 'number' && (w.ts - probe.exitAt) < 1800);
        },
        writesBefore,
        { timeout: 4000 }
      )
      .then(() => true)
      .catch(() => false);

    expect(flushFired).toBe(true);

    await openLavagna(page);
    await ensurePenActive(page);
    await waitForDrawingSurface(page);

    await expect
      .poll(async () => getPersistedPathsCount(page), { timeout: 10000 })
      .toBe(1);
  });

  test('Test 3: beforeunload close + verify persistence', async ({ page, context }) => {
    await waitForDrawingSurface(page);
    await ensurePenActive(page);
    const surface = await waitForDrawingSurface(page);

    await drawStroke(page, surface, 140, 140, 260, 200);

    const expId = await page.evaluate(
      () => window.__ELAB_E2E_TEST_EXP_ID__
        || localStorage.getItem('elab-lavagna-exp-id')
        || localStorage.getItem('elab-lavagna-last-expId')
    );
    const resumeExpId = expId || `e2e-persistence-reopen-${Date.now()}`;

    const savePromise = waitForPersistWrite(page);
    await page.close({ runBeforeUnload: true });
    await savePromise;

    const newPage = await context.newPage();
    await newPage.addInitScript((id) => {
      window.localStorage.setItem('elab-lavagna-exp-id', id);
      window.__ELAB_E2E_TEST_EXP_ID__ = id;
    }, resumeExpId);

    await seedSprintUBypass(newPage);
    await installFlushProbe(newPage);

    await openLavagna(newPage);
    await ensurePenActive(newPage);
    await waitForDrawingSurface(newPage);

    await expect
      .poll(async () => getPersistedPathsCount(newPage), { timeout: 10000 })
      .toBe(1);

    await newPage.close().catch(() => {});
  });
});
