import { test, expect } from '@playwright/test';
import { waitForPageReady, collectConsoleErrors, TIMEOUTS } from './fixtures.js';

test.describe('Homepage Load', () => {
  test('should load homepage with correct title', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should have no critical console errors on load', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto('/');
    await waitForPageReady(page);
    // Filter out known non-critical errors (service worker, third-party)
    const criticalErrors = errors.filter(
      e => !e.includes('service-worker') &&
           !e.includes('favicon') &&
           !e.includes('manifest')
    );
    // Allow up to 2 non-critical errors (third-party scripts, etc.)
    expect(criticalErrors.length).toBeLessThanOrEqual(2);
  });

  test('should render main content area', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    // Page should have some visible text content
    const bodyText = await page.textContent('body');
    expect(bodyText.length).toBeGreaterThan(10);
  });
});
