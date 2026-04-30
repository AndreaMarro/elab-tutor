import { test, expect } from '@playwright/test';

test.describe('Fumetto flow iter 36 Atom A7', () => {
  test('Fumetto button SEMPRE genera output (stub session locale fallback)', async ({ page, context }) => {
    await page.goto('https://www.elabtutor.school');
    await page.waitForLoadState('networkidle');

    // ensure no sessions saved (clear localStorage)
    await page.evaluate(() => {
      localStorage.removeItem('elab_unlim_sessions');
      localStorage.removeItem('elab_session_history');
    });

    // navigate to Lavagna
    await page.click('text=Lavagna');
    await page.waitForTimeout(2000);

    // click Fumetto FloatingToolbar button
    await page.click('text=Fumetto');
    await page.waitForTimeout(3000);

    // verify NO toast "Nessuna sessione salvata"
    const noSessionToast = await page.locator('text=Nessuna sessione salvata').count();
    expect(noSessionToast).toBe(0);

    // verify popup or download triggered (output present)
    const popups = await context.pages();
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
    const downloadTriggered = await downloadPromise !== null;

    expect(popups.length > 1 || downloadTriggered).toBe(true);

    // screenshot evidence
    await page.screenshot({ path: 'docs/audits/iter-36-evidence/fumetto-output.png', fullPage: true });
  });

  test('Fumetto disabled when 0 messages (graceful)', async ({ page }) => {
    // edge case — should disable button OR show stub fallback
    await page.goto('https://www.elabtutor.school');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => localStorage.clear());
    await page.click('text=Lavagna');
    await page.waitForTimeout(1500);

    const fumettoBtn = page.locator('text=Fumetto');
    const isDisabled = await fumettoBtn.isDisabled().catch(() => false);

    // Either disabled (graceful) OR generates stub (acceptable)
    if (!isDisabled) {
      await fumettoBtn.click();
      await page.waitForTimeout(2000);
      const errorToast = await page.locator('text=Errore').count();
      expect(errorToast).toBe(0);
    }
  });
});
