/**
 * Shared test data and helpers for E2E specs.
 */

export const PROD_URL = 'https://www.elabtutor.school';

export const SELECTORS = {
  simulatorCanvas: '[data-testid="simulator-canvas"], .simulator-canvas, svg.circuit-board',
  breadboard: '[data-testid="breadboard"], .breadboard, .bb-container',
  chatInput: '[data-testid="chat-input"], .chat-input, textarea[placeholder*="messaggio"], input[placeholder*="messaggio"]',
  chatSend: '[data-testid="chat-send"], .chat-send, button[aria-label*="invia"], button[aria-label*="send"]',
  chatResponse: '[data-testid="chat-response"], .chat-response, .chat-message, .unlim-response',
  experimentPicker: '[data-testid="experiment-picker"], .experiment-picker',
  lavagnaCanvas: '[data-testid="lavagna-canvas"], .lavagna-canvas, canvas.drawing',
  drawingToggle: '[data-testid="drawing-toggle"], .drawing-toggle, button[aria-label*="disegna"]',
};

export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  wide: { width: 1920, height: 1080 },
};

export const TIMEOUTS = {
  pageLoad: 15000,
  networkIdle: 10000,
  animation: 1000,
  chatResponse: 20000,
};

export const EXPERIMENTS = {
  first: 'v1-cap1-esp1',
  ledBasic: 'v1-cap6-esp1',
  arduino: 'v2-cap1-esp1',
};

/**
 * Wait for page to be fully loaded (no pending network requests).
 */
export async function waitForPageReady(page) {
  await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.networkIdle }).catch(() => {});
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Check that no console errors occurred during page load.
 * Returns array of error messages.
 */
export function collectConsoleErrors(page) {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  return errors;
}
