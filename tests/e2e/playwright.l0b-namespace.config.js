// playwright.l0b-namespace.config.js — Sprint T iter 31 ralph 24 Phase 3 Atom 24.1 close
//
// Tester-1 ownership. ADR-041 §3 L0b API surface 38 methods + §12 Implementation block
// E2E verification per `__ELAB_API.ui.*` namespace post iter 22 elab-ui-api.js (1003 LOC).
//
// Chromium-only project (per iter 12 caveat — firefox + webkit binaries MISSING locally
// `~/Library/Caches/ms-playwright/{webkit-2248,firefox-N}/` not installed). Defer
// firefox + webkit Andrea install iter 25+ verify.
//
// Run:
//   npx playwright test tests/e2e/onnipotenza-l0b-namespace-50-cells.spec.js \
//     --config tests/e2e/playwright.l0b-namespace.config.js --reporter=list
//
// (c) Andrea Marro 2026-05-03 — ELAB Tutor — iter 31 Sprint T close

import { defineConfig } from '@playwright/test';

const BASE_URL = (
  process.env.PLAYWRIGHT_BASE_URL ||
  process.env.BASE_URL ||
  'https://www.elabtutor.school'
).replace(/\/$/, '');

export default defineConfig({
  testDir: '.',
  testMatch: /onnipotenza-l0b-namespace-50-cells\.spec\.js$/,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  // Sequential execution preserves window state predictability across cells
  // (each test resets via beforeEach reload, but parallelism risks shared cache races).
  fullyParallel: false,
  workers: 1,
  retries: 0,
  maxFailures: 0,
  reporter: [
    ['list'],
    ['json', { outputFile: '../../automa/state/iter-31-l0b-namespace-50-cells/playwright-report.json' }],
  ],
  use: {
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    trace: 'off',
    video: 'off',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      // Chromium-only iter 24 caveat — firefox + webkit defer Andrea install iter 25+
      name: 'chromium-l0b',
      use: { browserName: 'chromium' },
    },
  ],
});
