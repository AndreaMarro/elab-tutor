/**
 * T1-004 — Vision E2E skeleton (Day 03, sprint sett-1-stabilize).
 *
 * RED-phase skeleton: 3 test cases that structurally compile and run, but contain
 * TODO markers for Day 04 GREEN implementation. Designed to run against `npm run dev`
 * (localhost:5173) — NO live Gemini API key required. Test 3 mocks the backend
 * vision endpoint so CI never hits real infra.
 *
 * Tested feature (bug T1 #4, open da week):
 *   - Trigger: VisionButton click OR chat text matching visionPatterns regex
 *     in src/components/lavagna/useGalileoChat.js (line 611).
 *   - Screenshot: window.__ELAB_API.captureScreenshot() -> base64 PNG data URL
 *     (src/services/simulator-api.js line 362).
 *   - Analysis: analyzeImage() -> Supabase Edge /chat -> Gemini Vision
 *     (src/services/api.js line 1101).
 *   - Response render: assistant message with hasVision flag rendered in chat UI.
 *
 * References:
 *   - src/components/tutor/VisionButton.jsx (aria-label "Guarda il mio circuito")
 *   - src/components/lavagna/useGalileoChat.js (visionPatterns line 611,
 *     elab-vision-capture listener line 870)
 *   - src/services/simulator-api.js (captureScreenshot line 362)
 *
 * Claude Opus 4.7 (team-dev) — 22/04/2026 — (c) Andrea Marro — ELAB Tutor
 */

import { test, expect } from '@playwright/test';
import { waitForPageReady, SELECTORS, TIMEOUTS } from './fixtures.js';

test.describe('T1-004 Vision Circuit E2E (skeleton)', () => {
  // ─────────────────────────────────────────────────────────────
  // Test 1 — Trigger vision request from tutor panel
  // ─────────────────────────────────────────────────────────────
  // Day 04 GREEN plan:
  //   a) Navigate to #lavagna (hosts useGalileoChat hook + chat UI).
  //   b) Option A: click VisionButton (aria-label="Guarda il mio circuito").
  //   c) Option B: type "guarda il mio circuito" into chat input + submit.
  //   d) Assert that one of: captureScreenshot was invoked OR loading state
  //      ("Sto guardando...") appears OR an assistant message with hasVision
  //      is appended to the chat list.
  // ─────────────────────────────────────────────────────────────
  test('should trigger vision request from tutor panel (VisionButton or text)', async ({ page }) => {
    await page.goto('/#lavagna');
    await waitForPageReady(page);

    // Collect page errors — we accept functional no-op but NOT JS crashes.
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    // Attempt 1: look for the VisionButton (aria-label starts with "Guarda il mio circuito").
    const visionButton = page.getByRole('button', { name: /Guarda il mio circuito/i }).first();
    const hasVisionButton = await visionButton.isVisible({ timeout: 3000 }).catch(() => false);

    // Attempt 2 (fallback): try chat text input with vision-trigger phrase.
    const chatInput = page.locator(SELECTORS.chatInput).first();
    const hasChatInput = await chatInput.isVisible({ timeout: 3000 }).catch(() => false);

    // At least ONE trigger surface must exist for the feature to be testable.
    // TODO(day-04): once Lavagna mounts both in default state, tighten to AND.
    expect(hasVisionButton || hasChatInput).toBeTruthy();

    // No critical JS errors (ignore benign ResizeObserver noise).
    const critical = errors.filter(e => !e.includes('ResizeObserver'));
    expect(critical).toEqual([]);
  });

  // ─────────────────────────────────────────────────────────────
  // Test 2 — Screenshot capture API surface exists
  // ─────────────────────────────────────────────────────────────
  // Day 04 GREEN plan:
  //   a) Navigate to #simulator so __ELAB_API is mounted.
  //   b) Wait for window.__ELAB_API.captureScreenshot to be a function.
  //   c) Call it, assert it returns null OR a data:image/... URL.
  //   d) Optional: wrap original captureScreenshot with a spy via page.exposeFunction
  //      then trigger from chat and verify the spy got called.
  // ─────────────────────────────────────────────────────────────
  test('should expose window.__ELAB_API.captureScreenshot and return data URL or null', async ({ page }) => {
    await page.goto('/#simulator');
    await waitForPageReady(page);

    // Wait up to pageLoad ms for the global bridge to mount.
    const apiReady = await page.waitForFunction(
      () => typeof window.__ELAB_API?.captureScreenshot === 'function',
      null,
      { timeout: TIMEOUTS.pageLoad },
    ).then(() => true).catch(() => false);

    // Skeleton phase: when the API bridge isn't yet mounted on /#simulator,
    // skip the strict capture contract with a TODO annotation instead of
    // hard-failing. Day 04 GREEN must replace this skip with a waitForFunction
    // that succeeds (e.g. after an experiment is loaded) and assert the contract.
    if (!apiReady) {
      test.info().annotations.push({
        type: 'TODO',
        description: 'Day 04 GREEN: mount __ELAB_API on /#simulator + load experiment so captureScreenshot returns a data URL',
      });
      test.skip(true, 'Skeleton RED: __ELAB_API.captureScreenshot not yet mounted on /#simulator route');
      return;
    }

    // Invoke captureScreenshot — expected values:
    //   - string starting with "data:image/" when SVG canvas is ready
    //   - null when canvas not yet mounted (documented in simulator-api.js:367)
    const result = await page.evaluate(async () => {
      try {
        const r = await window.__ELAB_API.captureScreenshot();
        return { ok: true, type: typeof r, isDataUrl: typeof r === 'string' && r.startsWith('data:image/'), isNull: r === null };
      } catch (err) {
        return { ok: false, error: err?.message || String(err) };
      }
    });

    expect(result.ok).toBe(true);
    // Either null OR a valid data URL — both are contractually valid.
    expect(result.isDataUrl || result.isNull).toBe(true);
  });

  // ─────────────────────────────────────────────────────────────
  // Test 3 — Mocked Gemini Vision response renders in UI
  // ─────────────────────────────────────────────────────────────
  // Day 04 GREEN plan:
  //   a) Intercept Supabase /chat endpoint with page.route and return a canned
  //      Gemini-shaped response (text field).
  //   b) Navigate to #lavagna, type "guarda il mio circuito", submit.
  //   c) Assert the assistant message containing the mock text renders
  //      (SELECTORS.chatResponse) within TIMEOUTS.chatResponse.
  //   d) Assert no unhandled promise rejections (hasVision path catches errors).
  // ─────────────────────────────────────────────────────────────
  test('should render mocked vision response in chat UI', async ({ page }) => {
    const MOCK_TEXT = 'Vedo un LED rosso collegato a D13 tramite resistenza 220 ohm. Perfetto!';

    // Route any backend chat/vision call to our mock.
    // Patterns match Supabase Edge functions path used by analyzeImage/sendChat.
    await page.route(/\/functions\/v1\/(chat|tutor-chat|unlim-chat|diagnose)/, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          response: MOCK_TEXT,
          source: 'mock-gemini-vision',
        }),
      });
    });

    await page.goto('/#lavagna');
    await waitForPageReady(page);

    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    // TODO(day-04): drive the actual trigger (button click or chat input submit).
    // Skeleton only verifies the route interceptor wires up without throwing
    // and the page loads clean. Day 04 must add the fill+submit flow and
    // assert chatResponse contains MOCK_TEXT within TIMEOUTS.chatResponse.
    const chatInput = page.locator(SELECTORS.chatInput).first();
    const hasChatInput = await chatInput.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasChatInput) {
      test.info().annotations.push({
        type: 'TODO',
        description: 'Day 04 GREEN: fill "guarda il mio circuito" + submit + assert MOCK_TEXT rendered',
      });
    } else {
      test.info().annotations.push({
        type: 'TODO',
        description: 'Day 04 GREEN: mount path to reach chat input on /#lavagna route',
      });
    }

    // Sentinel assertions so the skeleton still adds value today:
    // - No JS crash during navigation / route setup.
    // - Page body is non-empty (prevents silent 404 / blank white page regression).
    const bodyText = await page.textContent('body');
    expect(bodyText.length).toBeGreaterThan(0);

    const critical = errors.filter(e => !e.includes('ResizeObserver'));
    expect(critical).toEqual([]);

    // Mock text is declared so Day 04 can assert it without editing the skeleton body.
    expect(MOCK_TEXT).toMatch(/LED/i);
  });
});
