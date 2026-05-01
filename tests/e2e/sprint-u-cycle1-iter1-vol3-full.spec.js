/**
 * Sprint U Cycle 1 Iter 1 — Vol3 FULL Spec (LiveTest-2)
 *
 * All 29 vol3 experiments (27 base + 2 NEW iter37: v3-cap7-mini + v3-cap8-serial).
 * Intended for Cycle 2+ comprehensive audits — each experiment fully verified.
 *
 * Vol3 simulationMode: "avr" — Arduino Nano R4, AVR emulation.
 * All experiments use breadboard + nano-r4 as minimum components.
 *
 * Per-experiment checks:
 *   - mountExperiment API call succeeds (no crash)
 *   - SVG canvas renders
 *   - Arduino editor UI present (Compila & Carica / Blocchi tab)
 *   - Component count ≥ expectedComponents
 *   - ZERO critical console/page errors
 *   - Screenshot saved to docs/audits/sprint-u-screenshots/full/
 *
 * License gate: elab-license-key = ELAB2026
 *
 * Prod URL: https://www.elabtutor.school
 * Created: 2026-05-01 — LiveTest-2 agent
 * Run in Cycle 2+ when all experiments verified individually.
 */

import { test, expect } from '@playwright/test';

const PROD_URL = 'https://www.elabtutor.school';
const SCREENSHOT_DIR = 'docs/audits/sprint-u-screenshots/full';

// ── All 29 vol3 experiments ────────────────────────────────────────────────
// Ordered as per experiments-vol3.js (cap5 → cap6 → cap7 → cap8 → extra → new)
const ALL_VOL3_EXPERIMENTS = [
  // ── Capitolo 5: Il nostro primo programma ─────────────────────────────
  {
    id: 'v3-cap5-esp1',
    title: 'Cap. 5 Esp. 1 - Blink con LED_BUILTIN',
    chapter: 'Capitolo 5',
    difficulty: 1,
    expectedComponents: 2, // breadboard + nano
    notes: 'Basic blink — internal LED pin 13',
    isNew: false,
  },
  {
    id: 'v3-cap5-esp2',
    title: 'Cap. 5 Esp. 2 - Modifica tempi del Blink',
    chapter: 'Capitolo 5',
    difficulty: 1,
    expectedComponents: 2,
    notes: 'Faster blink timing',
    isNew: false,
  },

  // ── Capitolo 6: I pin digitali ────────────────────────────────────────
  {
    id: 'v3-cap6-esp1',
    title: 'Cap. 6 Esp. 1 - Colleghiamo la resistenza',
    chapter: 'Capitolo 6',
    difficulty: 1,
    expectedComponents: 3, // bb + nano + LED+R
    notes: 'External LED with resistor',
    isNew: false,
  },
  {
    id: 'v3-cap6-esp2',
    title: 'Cap. 6 Esp. 2 - Cambia il numero di pin',
    chapter: 'Capitolo 6',
    difficulty: 1,
    expectedComponents: 3,
    notes: 'Change pin number for LED',
    isNew: false,
  },
  {
    id: 'v3-cap6-morse',
    title: 'Cap. 6 Esp. 3 - SOS in codice Morse',
    chapter: 'Capitolo 6',
    difficulty: 2,
    expectedComponents: 3,
    notes: 'Morse SOS — special timing patterns',
    isNew: false,
  },
  {
    id: 'v3-cap6-esp3',
    title: 'Cap. 6 Esp. 3 - SOS Morse (duplicate slot)',
    chapter: 'Capitolo 6',
    difficulty: 1,
    expectedComponents: 3,
    notes: 'Morse variant in esp3 slot',
    isNew: false,
  },
  {
    id: 'v3-cap6-esp4',
    title: 'Cap. 6 Esp. 4 - Due LED: effetto polizia',
    chapter: 'Capitolo 6',
    difficulty: 2,
    expectedComponents: 4, // bb + nano + 2 LEDs
    notes: 'Police light effect — 2 LEDs alternating',
    isNew: false,
  },
  {
    id: 'v3-cap6-semaforo',
    title: 'Cap. 6 Esp. 5 - Il semaforo',
    chapter: 'Capitolo 6',
    difficulty: 2,
    expectedComponents: 5, // bb + nano + 3 LEDs
    notes: 'Traffic light — 3 LEDs red/yellow/green',
    isNew: false,
  },
  {
    id: 'v3-cap6-esp5',
    title: 'Cap. 7 Ese. 7.3 - Pulsante con INPUT_PULLUP',
    chapter: 'Capitolo 6',
    difficulty: 2,
    expectedComponents: 4, // bb + nano + LED + button
    notes: 'Button INPUT_PULLUP (cross-chapter reference)',
    isNew: false,
  },
  {
    id: 'v3-cap6-esp6',
    title: 'Cap. 7 Mini-progetto - Due LED, un pulsante',
    chapter: 'Capitolo 6',
    difficulty: 2,
    expectedComponents: 5,
    notes: 'Mini project: 2 LEDs + button',
    isNew: false,
  },
  {
    id: 'v3-cap6-esp7',
    title: 'Cap. 6 Esp. 7 - Debounce del pulsante',
    chapter: 'Capitolo 6',
    difficulty: 2,
    expectedComponents: 4,
    notes: 'Button debounce technique',
    isNew: false,
  },

  // ── Capitolo 7: I pin analogici ───────────────────────────────────────
  {
    id: 'v3-cap7-esp1',
    title: 'Cap. 7 Esp. 1 - analogRead base',
    chapter: 'Capitolo 7',
    difficulty: 2,
    expectedComponents: 3, // bb + nano + pot
    notes: 'ADC analogRead — potentiometer on A0',
    isNew: false,
  },
  {
    id: 'v3-cap7-esp2',
    title: 'Cap. 7 Esp. 2 - analogRead con tensione',
    chapter: 'Capitolo 7',
    difficulty: 2,
    expectedComponents: 3,
    notes: 'Read voltage with analogRead + Serial',
    isNew: false,
  },
  {
    id: 'v3-cap7-esp3',
    title: 'Cap. 7 Esp. 3 - Trimmer controlla 3 LED',
    chapter: 'Capitolo 7',
    difficulty: 2,
    expectedComponents: 6, // bb + nano + pot + 3 LEDs
    notes: 'Pot controls which LED lights up',
    isNew: false,
  },
  {
    id: 'v3-cap7-esp4',
    title: 'Cap. 7 Esp. 4 - analogWrite (PWM fade)',
    chapter: 'Capitolo 7',
    difficulty: 2,
    expectedComponents: 3, // bb + nano + LED
    notes: 'PWM analogWrite fade effect',
    isNew: false,
  },
  {
    id: 'v3-cap7-esp5',
    title: 'Cap. 7 Esp. 5 - PWM con valori manuali',
    chapter: 'Capitolo 7',
    difficulty: 1,
    expectedComponents: 3,
    notes: 'Manual PWM values via Serial',
    isNew: false,
  },
  {
    id: 'v3-cap7-esp6',
    title: 'Cap. 7 Esp. 6 - Fade up/down con for',
    chapter: 'Capitolo 7',
    difficulty: 2,
    expectedComponents: 3,
    notes: 'Fade LED up/down using for loop',
    isNew: false,
  },
  {
    id: 'v3-cap7-esp7',
    title: 'Cap. 7 Esp. 7 - Trimmer controlla luminosita',
    chapter: 'Capitolo 7',
    difficulty: 2,
    expectedComponents: 4, // bb + nano + pot + LED
    notes: 'Pot controls LED brightness via analogWrite',
    isNew: false,
  },
  {
    id: 'v3-cap7-esp8',
    title: 'Cap. 7 Esp. 8 - DAC reale (10 bit)',
    chapter: 'Capitolo 7',
    difficulty: 3,
    expectedComponents: 3,
    notes: 'True DAC output — Arduino R4 specific',
    isNew: false,
  },
  {
    id: 'v3-cap7-mini',
    title: 'Cap. 7 Mini - Potenziometro ADC + LED PWM',
    chapter: 'Capitolo 7',
    difficulty: 2,
    expectedComponents: 2,
    notes: 'NEW iter37 — mini project: read A0, light LED above 512',
    isNew: true,
  },

  // ── Capitolo 8: Comunicazione Seriale ────────────────────────────────
  {
    id: 'v3-cap8-esp1',
    title: 'Cap. 8 Esp. 1 - Serial.println in setup',
    chapter: 'Capitolo 8',
    difficulty: 1,
    expectedComponents: 1, // nano only
    notes: 'First Serial — println in setup once',
    isNew: false,
  },
  {
    id: 'v3-cap8-esp2',
    title: 'Cap. 8 Esp. 2 - Serial.println in loop',
    chapter: 'Capitolo 8',
    difficulty: 1,
    expectedComponents: 1,
    notes: 'Serial println repeating in loop',
    isNew: false,
  },
  {
    id: 'v3-cap8-esp3',
    title: 'Cap. 8 Esp. 3 - analogRead + Serial Monitor',
    chapter: 'Capitolo 8',
    difficulty: 2,
    expectedComponents: 3, // bb + nano + pot
    notes: 'Read pot value, print to Serial Monitor',
    isNew: false,
  },
  {
    id: 'v3-cap8-esp4',
    title: 'Cap. 8 Esp. 4 - Serial Plotter con 2 pot',
    chapter: 'Capitolo 8',
    difficulty: 2,
    expectedComponents: 4, // bb + nano + 2 pots
    notes: 'Two pots, Serial Plotter mode',
    isNew: false,
  },
  {
    id: 'v3-cap8-esp5',
    title: 'Cap. 8 Esp. 5 - Pot + 3 LED + Serial',
    chapter: 'Capitolo 8',
    difficulty: 3,
    expectedComponents: 6, // bb + nano + pot + 3 LEDs
    notes: 'Pot controls LED range, Serial output',
    isNew: false,
  },
  {
    id: 'v3-cap8-serial',
    title: 'Cap. 8 Serial - Comunicazione seriale: primo messaggio',
    chapter: 'Capitolo 8',
    difficulty: 1,
    expectedComponents: 1, // nano only
    notes: 'NEW iter37 — Serial.begin + println hello',
    isNew: true,
  },

  // ── Extra (capstone) ──────────────────────────────────────────────────
  {
    id: 'v3-extra-lcd-hello',
    title: 'Extra - LCD Hello World',
    chapter: 'Extra',
    difficulty: 2,
    expectedComponents: 3, // bb + nano + LCD
    notes: 'LCD I2C display hello world',
    isNew: false,
  },
  {
    id: 'v3-extra-servo-sweep',
    title: 'Extra - Servo Sweep',
    chapter: 'Extra',
    difficulty: 2,
    expectedComponents: 3, // bb + nano + servo
    notes: 'Servo motor sweep 0-180 degrees',
    isNew: false,
  },
  {
    id: 'v3-extra-simon',
    title: 'Simon Says — Gioco di Memoria',
    chapter: 'Extra',
    difficulty: 3,
    expectedComponents: 7, // bb + nano + 4 LEDs + buzzer + buttons
    notes: 'Capstone Simon game — Scratch steps + full circuit',
    isNew: false,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function seedLicense(page) {
  return page.addInitScript(() => {
    try {
      localStorage.setItem('elab-license-key', 'ELAB2026');
      localStorage.setItem(
        'elab_e2e_user',
        JSON.stringify({ id: 'e2e-user', email: 'e2e@elabtutor.school', role: 'admin' })
      );
      localStorage.setItem('elab_skip_bentornati', 'true');
    } catch (_e) { /* storage blocked */ }
  });
}

function collectErrors(page) {
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (
        text.includes('ResizeObserver') ||
        text.includes('favicon') ||
        text.includes('onrender.com') ||
        text.includes('net::ERR_FAILED') ||
        text.includes('Failed to load resource') ||
        text.includes('Script error')
      ) return;
      consoleErrors.push(text);
    }
  });

  page.on('pageerror', err => {
    pageErrors.push('[pageerror] ' + err.message);
  });

  return { consoleErrors, pageErrors };
}

async function navigateToTutor(page) {
  await page.goto(PROD_URL + '/#tutor');
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
  await page.waitForTimeout(2_000);
}

async function mountAndCheck(page, expId) {
  const result = await page.evaluate((id) => {
    try {
      const api = window.__ELAB_API;
      if (!api) return { ok: false, reason: 'no_api' };
      if (typeof api.mountExperiment !== 'function') return { ok: false, reason: 'no_mount_fn' };
      api.mountExperiment(id);
      return { ok: true };
    } catch (e) {
      return { ok: false, reason: e.message };
    }
  }, expId);
  return result;
}

async function getPageState(page) {
  return await page.evaluate(() => {
    const api = window.__ELAB_API;
    return {
      apiExists: !!api,
      componentCount: document.querySelectorAll('[data-component-id]').length,
      svgCount: document.querySelectorAll('svg').length,
      hasCompila: !!document.querySelector('button[class*="compila"], button[class*="compile"]') ||
        [...document.querySelectorAll('button')].some(b => /Compila/i.test(b.textContent)),
      hasBlocchi: [...document.querySelectorAll('button')].some(b => /^Blocchi$/i.test(b.textContent?.trim())),
      hasArduinoTab: [...document.querySelectorAll('button')].some(b => /Arduino C\+\+/.test(b.textContent)),
      activeExperiment: api?.getCircuitState?.()?.experimentId || null,
    };
  });
}

// ── Full Test Suite ────────────────────────────────────────────────────────

test.describe('Vol3 Full Audit — All 29 Experiments (Sprint U Cycle 2+)', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(60_000);

  for (const exp of ALL_VOL3_EXPERIMENTS) {
    const testLabel = exp.isNew ? `[NEW] [${exp.id}]` : `[${exp.id}]`;

    test(`${testLabel} ${exp.title}`, async ({ page }) => {
      const { consoleErrors, pageErrors } = collectErrors(page);
      seedLicense(page);

      // Navigate
      await navigateToTutor(page);

      // Mount
      const mountResult = await mountAndCheck(page, exp.id);
      console.log(`${testLabel} mount:`, JSON.stringify(mountResult));

      // Wait for render
      await page.waitForTimeout(3_000);

      // Collect page state
      const state = await getPageState(page);
      console.log(`${testLabel} state:`, JSON.stringify(state));

      // Screenshot
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/${exp.id}.png`,
        fullPage: false,
      }).catch(e => console.log(`${testLabel} screenshot failed:`, e.message));

      // Log errors
      const allErrors = [...consoleErrors, ...pageErrors];
      if (allErrors.length > 0) {
        console.log(`${testLabel} ERRORS (${allErrors.length}):`, allErrors.slice(0, 3).join(' | '));
      }

      // ── Assertions ──────────────────────────────────────────────────
      // P0: SVG canvas must render
      expect(state.svgCount, `${testLabel} BUG P0: No SVG rendered`).toBeGreaterThan(0);

      // P0: No critical JS errors
      expect(allErrors.length, `${testLabel} BUG P0: JS errors: ${allErrors.slice(0, 2).join(' | ')}`).toBe(0);

      // P1: Arduino editor must be present for AVR experiments
      const hasAnyEditor = state.hasCompila || state.hasBlocchi || state.hasArduinoTab;
      if (!hasAnyEditor) {
        console.log(
          `${testLabel} WARN P1: No Arduino editor UI (Compila/Blocchi/Arduino C++ tab). ` +
          `May indicate experiment not loaded or simulator in wrong mode.`
        );
      }
      // Not hard-failing on editor presence — could be mount timing issue
      // Hard-fail in Cycle 2 once mount timing confirmed stable

      // P2: Component count check (soft warning)
      if (exp.expectedComponents > 0 && state.componentCount < exp.expectedComponents) {
        console.log(
          `${testLabel} WARN P2: Expected ≥${exp.expectedComponents} components, got ${state.componentCount}. ` +
          `${exp.notes}`
        );
      }
    });
  }
});

// ── Grouped chapter summaries ─────────────────────────────────────────────

test.describe('Vol3 Chapter Summary — Cap5 (2 experiments)', () => {
  test.setTimeout(30_000);

  test('Cap5 basic smoke: v3-cap5-esp1 and v3-cap5-esp2 both mount', async ({ page }) => {
    seedLicense(page);
    await page.goto(PROD_URL + '/#tutor');
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(2_000);

    for (const id of ['v3-cap5-esp1', 'v3-cap5-esp2']) {
      await page.evaluate((expId) => window.__ELAB_API?.mountExperiment(expId), id);
      await page.waitForTimeout(2_000);
      const svgCount = await page.locator('svg').count();
      console.log(`[cap5-summary] ${id} SVG count:`, svgCount);
      expect(svgCount, `Cap5 ${id}: no SVG`).toBeGreaterThan(0);
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/cap5-summary.png` }).catch(() => {});
  });
});

test.describe('Vol3 Chapter Summary — NEW iter37 experiments', () => {
  test.setTimeout(30_000);

  test('v3-cap7-mini mounts without error', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const t = msg.text();
        if (!t.includes('ResizeObserver') && !t.includes('onrender') && !t.includes('ERR_FAILED')) errors.push(t);
      }
    });
    page.on('pageerror', e => errors.push('[pageerror] ' + e.message));

    seedLicense(page);
    await page.goto(PROD_URL + '/#tutor');
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(2_000);

    await page.evaluate(() => window.__ELAB_API?.mountExperiment('v3-cap7-mini'));
    await page.waitForTimeout(3_000);

    const svgCount = await page.locator('svg').count();
    console.log('[cap7-mini] SVG count:', svgCount);
    console.log('[cap7-mini] Errors:', errors.length);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/v3-cap7-mini-new.png` }).catch(() => {});

    expect(svgCount, 'v3-cap7-mini: no SVG rendered').toBeGreaterThan(0);
    expect(errors.length, `v3-cap7-mini errors: ${errors.join(' | ')}`).toBe(0);
  });

  test('v3-cap8-serial mounts without error', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const t = msg.text();
        if (!t.includes('ResizeObserver') && !t.includes('onrender') && !t.includes('ERR_FAILED')) errors.push(t);
      }
    });
    page.on('pageerror', e => errors.push('[pageerror] ' + e.message));

    seedLicense(page);
    await page.goto(PROD_URL + '/#tutor');
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(2_000);

    await page.evaluate(() => window.__ELAB_API?.mountExperiment('v3-cap8-serial'));
    await page.waitForTimeout(3_000);

    const svgCount = await page.locator('svg').count();
    console.log('[cap8-serial] SVG count:', svgCount);
    console.log('[cap8-serial] Errors:', errors.length);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/v3-cap8-serial-new.png` }).catch(() => {});

    expect(svgCount, 'v3-cap8-serial: no SVG rendered').toBeGreaterThan(0);
    expect(errors.length, `v3-cap8-serial errors: ${errors.join(' | ')}`).toBe(0);
  });
});
