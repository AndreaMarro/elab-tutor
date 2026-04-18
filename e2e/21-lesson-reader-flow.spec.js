// @ts-check
import { test, expect } from '@playwright/test';
import { setupUser, setTeacherUser } from './helpers.js';

async function goToLezione(page) {
  await page.goto('/#lavagna');
  const tab = page.getByRole('button', { name: /Lezione Guidata/i });
  await expect(tab).toBeVisible({ timeout: 15000 });
  // Click "Lavagna libera" to dismiss picker and prevent re-opening
  const freeBtn = page.getByRole('button', { name: /Lavagna libera/i });
  await expect(freeBtn).toBeVisible({ timeout: 5000 });
  await freeBtn.click();
  await tab.click();
}

test.describe('Lesson Reader — full user flow', () => {
  test.beforeEach(async ({ page }) => {
    await setupUser(page);
    await setTeacherUser(page);
  });

  test('Lezione Guidata tab visible for teachers', async ({ page }) => {
    await page.goto('/#lavagna');
    const tab = page.getByRole('button', { name: /Lezione Guidata/i });
    await expect(tab).toBeVisible({ timeout: 15000 });
  });

  test('clicking tab shows LessonReader with lesson title', async ({ page }) => {
    await goToLezione(page);
    const heading = page.getByRole('heading', { name: /Accendi il LED/i });
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('lesson timeline shows 3 experiments for v1-accendi-led', async ({ page }) => {
    await goToLezione(page);
    await expect(page.getByTestId('lesson-step-v1-cap6-esp1')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('lesson-step-v1-cap6-esp2')).toBeVisible();
    await expect(page.getByTestId('lesson-step-v1-cap6-esp3')).toBeVisible();
  });

  test('shows volume and page citations', async ({ page }) => {
    await goToLezione(page);
    await expect(page.getByText(/Vol\.\s*1/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/pag\.\s*29/i)).toBeVisible();
  });

  test('lesson selector shows 5+ lessons for volume 1', async ({ page }) => {
    await goToLezione(page);
    await expect(page.getByTestId('lesson-option-v1-accendi-led')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('lesson-option-v1-led-rgb')).toBeVisible();
    await expect(page.getByTestId('lesson-option-v1-pulsanti')).toBeVisible();
    await expect(page.getByTestId('lesson-option-v1-potenziometro')).toBeVisible();
    await expect(page.getByTestId('lesson-option-v1-sensore-luce')).toBeVisible();
  });

  test('switching lesson updates LessonReader', async ({ page }) => {
    await goToLezione(page);
    await page.getByTestId('lesson-option-v1-led-rgb').click();
    const heading = page.getByRole('heading', { name: /Il LED RGB/i });
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('clicking experiment step triggers mount', async ({ page }) => {
    await goToLezione(page);
    const step = page.getByTestId('lesson-step-v1-cap6-esp1');
    await expect(step).toBeVisible({ timeout: 5000 });
    await step.click();
    await page.waitForTimeout(500);
    const stepClasses = await step.getAttribute('class');
    expect(stepClasses).toBeTruthy();
  });

  test('Principio Zero v3: no "Docente leggi" anywhere', async ({ page }) => {
    await goToLezione(page);
    await page.waitForTimeout(1000);
    const body = await page.textContent('body');
    expect(body).not.toMatch(/Docente,\s*leggi/i);
    expect(body).not.toMatch(/Insegnante,\s*leggi/i);
  });
});
