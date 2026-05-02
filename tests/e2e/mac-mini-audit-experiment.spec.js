// Iter 41 SPEC mac-mini autonomous audit — Playwright per-experiment audit
// Plan: docs/specs/SPEC-mac-mini-autonomous-audit-94-esperimenti-2026-05-02.md
//
// Usage:
//   EXP_ID=v1-cap6-esp1 \
//   TIMESTAMP=2026-05-02T20-00 \
//   OUTPUT_DIR=docs/audits/auto-mac-mini/v1-cap6-esp1 \
//   PLAYWRIGHT_BASE_URL=https://www.elabtutor.school \
//   ELAB_TEST_CLASS_KEY=test-class-2026 \
//   npx playwright test tests/e2e/mac-mini-audit-experiment.spec.js
//
// Output: ${OUTPUT_DIR}/audit-data.json + screenshots/*.png
// Render → md via scripts/mac-mini-render-audit-md.mjs

import { test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const EXP_ID = process.env.EXP_ID || 'v1-cap6-esp1';
const TIMESTAMP = process.env.TIMESTAMP || new Date().toISOString().replace(/[:.]/g, '-');
const OUTPUT_DIR = process.env.OUTPUT_DIR || `/tmp/audit-${EXP_ID}`;
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'https://www.elabtutor.school';
const TEST_CLASS_KEY = process.env.ELAB_TEST_CLASS_KEY || 'test-mac-mini-audit';

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(path.join(OUTPUT_DIR, 'screenshots'))) {
  fs.mkdirSync(path.join(OUTPUT_DIR, 'screenshots'), { recursive: true });
}

test.describe.configure({ mode: 'serial' });

test(`audit ${EXP_ID}`, async ({ page }) => {
  test.setTimeout(120000); // 2min cap per audit

  const consoleErrors = [];
  const consoleWarnings = [];
  const networkErrors = [];

  const audit = {
    experiment_id: EXP_ID,
    timestamp: TIMESTAMP,
    base_url: BASE_URL,
    opening: {},
    components: {},
    code_compile: {},
    scratch_blockly: {},
    unlim_smoke: {},
    issues: { HIGH: [], MEDIUM: [], LOW: [] },
  };

  // Capture console + network
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200));
    else if (m.type() === 'warning') consoleWarnings.push(m.text().slice(0, 100));
  });
  page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));
  page.on('requestfailed', (req) => networkErrors.push(`${req.failure()?.errorText}: ${req.url().slice(0, 120)}`));

  // 1. Open prod with experiment hash
  const t0 = Date.now();
  try {
    await page.goto(`${BASE_URL}/#tutor/experiment=${EXP_ID}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
  } catch (e) {
    audit.issues.HIGH.push(`Page load failed: ${e.message.slice(0, 100)}`);
  }
  audit.opening.load_ms = Date.now() - t0;
  audit.opening.console_errors_count = consoleErrors.length;
  audit.opening.console_errors_first_3 = consoleErrors.slice(0, 3);
  audit.opening.console_warnings_count = consoleWarnings.length;
  audit.opening.network_errors_count = networkErrors.length;
  audit.opening.network_errors_first_3 = networkErrors.slice(0, 3);

  // Inject test class_key for bypass WelcomePage gate
  await page.evaluate((classKey) => {
    try { localStorage.setItem('elab_class_key', classKey); } catch (_) {}
  }, TEST_CLASS_KEY);

  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'screenshots/01-open.png'),
    fullPage: false,
  }).catch(() => {});

  // 2. Component discovery via __ELAB_API
  await page.waitForTimeout(2000); // settle simulator
  const state = await page.evaluate(() => {
    const api = (window).__ELAB_API;
    if (!api?.unlim?.getCircuitState) return { not_loaded: true };
    try {
      const s = api.unlim.getCircuitState();
      return {
        components: s.components?.length || 0,
        connections: s.connections?.length || s.wires?.length || 0,
        nano_present: s.components?.some((c) => /nano/i.test(c.type || c.id || '')) || false,
        component_types: [...new Set((s.components || []).map((c) => c.type).filter(Boolean))].slice(0, 10),
      };
    } catch (e) {
      return { error: e.message.slice(0, 100) };
    }
  });
  audit.components = state;

  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'screenshots/02-mounted.png'),
    fullPage: false,
  }).catch(() => {});

  // 3. UNLIM smoke "Spiega questo esperimento"
  let unlimResp = { error: 'not_attempted' };
  try {
    unlimResp = await page.evaluate(async (expId) => {
      const t0 = Date.now();
      // Use __ELAB_API or direct fetch. Path varies by deploy.
      const supabaseUrl = (window).__ELAB_SUPABASE_URL || 'https://euqpdueopmlllqjmqnyb.supabase.co';
      const supabaseKey = (window).__ELAB_SUPABASE_KEY ||
        (document.querySelector('meta[name="elab-supabase-edge-key"]')?.getAttribute('content') || '');
      const elabKey = (window).__ELAB_API_KEY ||
        (document.querySelector('meta[name="elab-api-key"]')?.getAttribute('content') || '');
      try {
        const res = await fetch(`${supabaseUrl}/functions/v1/unlim-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
            'x-elab-api-key': elabKey,
          },
          body: JSON.stringify({
            message: 'Spiega questo esperimento',
            experimentId: expId,
            sessionId: 's_audit_' + Math.random().toString(36).slice(2, 10),
          }),
        });
        const data = await res.json();
        return { latency_ms: Date.now() - t0, status: res.status, ...data };
      } catch (e) {
        return { latency_ms: Date.now() - t0, error: e.message };
      }
    }, EXP_ID);
  } catch (e) {
    unlimResp.error = e.message;
  }

  audit.unlim_smoke = {
    latency_ms: unlimResp.latency_ms,
    status: unlimResp.status,
    plurale_ragazzi: /Ragazzi/i.test(unlimResp.response || ''),
    citation_vol_pag: /Vol\.\s*\d+\s*(?:cap\.?\d+\s*)?(?:pag\.?\s*\d+)/i.test(unlimResp.response || ''),
    kit_elab: /kit\s*ELAB|breadboard|Omaric/i.test(unlimResp.response || ''),
    analogia: /come\s+un|pensate|immaginate|paragone/i.test(unlimResp.response || ''),
    source: unlimResp.source,
    response_excerpt: (unlimResp.response || '').slice(0, 300),
    error: unlimResp.error,
  };

  // 4. Auto-flag issues
  if (audit.opening.load_ms > 5000) {
    audit.issues.HIGH.push(`Slow page load ${audit.opening.load_ms}ms (>5s)`);
  }
  if (consoleErrors.length > 0) {
    audit.issues.MEDIUM.push(`${consoleErrors.length} console errors`);
  }
  if (audit.components?.not_loaded) {
    audit.issues.HIGH.push('Simulator __ELAB_API not loaded — page route mismatch?');
  }
  if (audit.components?.components === 0) {
    audit.issues.MEDIUM.push('Zero components mounted — esperimento auto-mount failed');
  }
  if (!audit.unlim_smoke.plurale_ragazzi) {
    audit.issues.HIGH.push('UNLIM response missing plurale "Ragazzi" — PRINCIPIO ZERO violation');
  }
  if (!audit.unlim_smoke.citation_vol_pag) {
    audit.issues.MEDIUM.push('UNLIM response missing Vol/pag citation');
  }
  if (!audit.unlim_smoke.kit_elab) {
    audit.issues.MEDIUM.push('UNLIM response missing kit ELAB mention');
  }
  if (!audit.unlim_smoke.analogia) {
    audit.issues.LOW.push('UNLIM response missing analogia');
  }
  if (audit.unlim_smoke.latency_ms > 5000) {
    audit.issues.HIGH.push(`UNLIM latency ${audit.unlim_smoke.latency_ms}ms (>5s LIM UX bad)`);
  } else if (audit.unlim_smoke.latency_ms > 3000) {
    audit.issues.MEDIUM.push(`UNLIM latency ${audit.unlim_smoke.latency_ms}ms (>3s noticeable)`);
  }

  // 5. Save audit JSON
  fs.writeFileSync(path.join(OUTPUT_DIR, 'audit-data.json'), JSON.stringify(audit, null, 2));

  // 6. Save raw console + network logs
  fs.writeFileSync(path.join(OUTPUT_DIR, 'console-errors.log'), consoleErrors.join('\n'));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'network-errors.log'), networkErrors.join('\n'));

  console.log(`[AUDIT ${EXP_ID}] ${audit.issues.HIGH.length} HIGH / ${audit.issues.MEDIUM.length} MEDIUM / ${audit.issues.LOW.length} LOW`);
  console.log(`[AUDIT ${EXP_ID}] Output: ${OUTPUT_DIR}`);
});
