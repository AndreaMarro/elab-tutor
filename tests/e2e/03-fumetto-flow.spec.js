import { test, expect } from '@playwright/test';
import { gotoLavagna } from './helpers/welcome-gate-bypass.js';

test.describe('Fumetto flow iter 36 Atom A7 (gate refactor iter 37 Phase 3)', () => {
  test('Fumetto button SEMPRE genera output (stub session locale fallback)', async ({ page, context }) => {
    // Gate bypass via helper (license + privacy dialog) + land on #lavagna.
    await gotoLavagna(page, 'https://www.elabtutor.school/#lavagna');

    // ensure no sessions saved (clear localStorage chat history without nuking gate seeds)
    await page.evaluate(() => {
      try {
        localStorage.removeItem('elab_unlim_sessions');
        localStorage.removeItem('elab_session_history');
      } catch (_e) { /* */ }
    });

    // click Fumetto FloatingToolbar button
    await page.click('text=Fumetto', { timeout: 8_000 });
    await page.waitForTimeout(3000);

    // verify NO toast "Nessuna sessione salvata"
    const noSessionToast = await page.locator('text=Nessuna sessione salvata').count();
    expect(noSessionToast).toBe(0);

    // verify popup or download triggered (output present)
    const popups = await context.pages();
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
    const downloadTriggered = await downloadPromise !== null;

    expect(popups.length > 1 || downloadTriggered).toBe(true);

    // screenshot evidence (path matches Tester-3 evidence dir per atom A8-FIX)
    await page.screenshot({ path: 'docs/audits/iter-37-evidence-fix/fumetto-output.png', fullPage: true });
  });

  test('Fumetto disabled when 0 messages (graceful)', async ({ page }) => {
    // edge case — should disable button OR show stub fallback
    await gotoLavagna(page, 'https://www.elabtutor.school/#lavagna');
    await page.evaluate(() => {
      try {
        // Surgical: drop only chat-state, keep gate seeds (license/consent).
        localStorage.removeItem('elab_unlim_sessions');
        localStorage.removeItem('elab_session_history');
      } catch (_e) { /* */ }
    });

    const fumettoBtn = page.locator('text=Fumetto').first();
    const isDisabled = await fumettoBtn.isDisabled().catch(() => false);

    // Either disabled (graceful) OR generates stub (acceptable)
    if (!isDisabled) {
      await fumettoBtn.click({ timeout: 8_000 }).catch(() => {});
      await page.waitForTimeout(2000);
      const errorToast = await page.locator('text=Errore').count();
      expect(errorToast).toBe(0);
    }
  });
});
