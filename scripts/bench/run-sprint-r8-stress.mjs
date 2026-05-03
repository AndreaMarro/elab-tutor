#!/usr/bin/env node
// ELAB Sprint T iter 31 ralph 26 Phase 4 Atom 27.1 — R8 Stress Bench Runner
// Tester-1 | 2026-05-03
//
// Sprint T close target ADVANCED 9.0/10 ONESTO. Bench fixture per ADR-042 §6
// (R8 100-prompt UI action context awareness — 5 categories x 20 prompts each):
//   1. state_query        — answers requiring UI state context (route/mode/modalita/modals/opened_panels/lesson_path_step/focused)
//   2. ui_action_propose  — UNLIM should propose UI action (closeModal/openModal/togglePanel/navigate)
//   3. voice_control      — voice/TTS playback + volume + rate + voice selection
//   4. navigation         — route/modalita switch (#chatbot/#lavagna/#dashboard/...)
//   5. lesson_path_step   — step navigation (next/prev/restart/highlight)
//
// Per ADR-042 §6.2 scoring rubric (per-prompt 0-1):
//   - UI context accuracy   (0.5 weight): does response reference correct ui.*
//                                         field from injected snapshot? Binary
//                                         per facet, average 5-7 facets.
//   - PRINCIPIO ZERO V3     (0.3 weight): plurale "Ragazzi" + Vol/pag citation
//                                         + kit ELAB mention preserved.
//   - No-hallucination      (0.2 weight): LLM does NOT invent UI state not
//                                         present in snapshot.
// Aggregate per prompt: 0.5*ui_acc + 0.3*pz_v3 + 0.2*no_hall.
//
// Targets per ADR-042 §6.3:
//   - R8 UI context accuracy ≥80% (80/100 prompts pass score ≥0.8)
//   - R5 PZ V3 (re-run post-deploy) ≥V1 baseline 94.2% (NO regression)
//   - Latency overhead p95 <100ms vs V1 baseline 3380ms
//
// Endpoint: prod elab-unlim Edge Function (same auth as run-sprint-r5/r6/r7).
//
// HONESTY CAVEAT — fixture+runner only iter 26. Live execution deferred iter
// 28+ canary stage post Andrea env provision (SUPABASE_ANON_KEY + ELAB_API_KEY
// + INCLUDE_UI_STATE_IN_ONNISCENZA env flag opt-in canary 5%). NO claim "R8
// >=80% UI context accuracy LIVE" until Andrea verify post-deploy.
//
// HONESTY CAVEAT 2 — UI state injection in this runner is SYNTHETIC mock per
// fixture category (varied permutations covering 5 categories). REAL UI state
// via Playwright bootstrap deferred iter 28+ Tester-2 ownership iter 32 +
// Maker-1 frontend `__ELAB_API.ui.getState()` impl per ADR-036 + ADR-042 §4.1.
//
// Usage:
//   SUPABASE_ANON_KEY="<anon>" ELAB_API_KEY="<key>" \
//     node scripts/bench/run-sprint-r8-stress.mjs
//
// Output:
//   - scripts/bench/output/r8-stress-responses-<TS>.jsonl
//   - scripts/bench/output/r8-stress-scores-<TS>.json
//   - scripts/bench/output/r8-stress-report-<TS>.md

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');

const UNLIM_EDGE_URL = (process.env.UNLIM_EDGE_URL || 'https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat').trim();
const SUPABASE_ANON_KEY = (process.env.SUPABASE_ANON_KEY || '').trim();
const ELAB_API_KEY = (process.env.ELAB_API_KEY || '').trim();
const FIXTURE = process.env.FIXTURE || path.join(__dirname, 'r8-fixture.jsonl');
const OUT_DIR = path.join(__dirname, 'output');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const RESPONSES_OUT = path.join(OUT_DIR, `r8-stress-responses-${TIMESTAMP}.jsonl`);
const REPORT_OUT = path.join(OUT_DIR, `r8-stress-report-${TIMESTAMP}.md`);
const SCORES_OUT = path.join(OUT_DIR, `r8-stress-scores-${TIMESTAMP}.json`);

const REQUEST_TIMEOUT_MS = 45000;
const COLD_START_RETRY_DELAY_MS = 15000;
const MAX_TOTAL_FAILURES = 30;

const R8_TARGET_PROMPTS = 100;
const R8_PASS_THRESHOLD = 0.80;        // ≥80% prompts score ≥0.8 aggregate
const R8_PER_PROMPT_PASS_THRESHOLD = 0.80;
const PACING_DELAY_MS = parseInt(process.env.R8_PACING_DELAY_MS || '800', 10);

// ---------------------------------------------------------------------------
// Synthetic UI state mock per category — varied permutations covering all 5
// fixture categories per ADR-042 §6.4 spec ("synthetic UI state injection").
// Real Playwright bootstrap deferred iter 28+.
// ---------------------------------------------------------------------------
const VALID_HASHES = ['#home', '#lavagna', '#tutor', '#chatbot-only', '#about-easter', '#dashboard', '#simulator'];
const MODE_BY_HASH = {
  '#home': 'home',
  '#lavagna': 'lavagna',
  '#tutor': 'tutor',
  '#chatbot-only': 'chatbot',
  '#about-easter': 'easter',
  '#dashboard': 'dashboard',
  '#simulator': 'simulator',
};

function makeSyntheticUIState(category, idx) {
  // Vary state across 4 buckets per category (idx % 4) to cover combinations
  // of (route, modalita, modals, opened_panels, lesson_path_step, focused).
  const variant = idx % 4;
  let route, modalita, lessonPathStep, modals, openedPanels, focused;

  if (category === 'state_query') {
    // route varies across all 7 hashes; modalita populated on lavagna
    const hashes = VALID_HASHES;
    route = hashes[idx % hashes.length];
    modalita = route === '#lavagna' ? ['percorso','libero','gia-montato','guida-errore'][variant] : null;
    lessonPathStep = (route === '#lavagna' && modalita === 'percorso') ? variant * 2 : null;
    modals = variant === 1 ? [{ id: 'passo-passo', title: 'Passo Passo', type: 'floating' }] : [];
    openedPanels = [
      { id: 'panel-left', open: variant === 0 },
      { id: 'panel-right', open: variant === 2 },
      { id: 'chat-overlay', open: variant !== 3 },
    ];
    focused = variant === 3 ? '[role="textbox"][aria-label="Chat input"]' : null;
  } else if (category === 'ui_action_propose') {
    // Lavagna context with various modal/panel state to test ambiguity resolve
    route = '#lavagna';
    modalita = ['percorso','libero','gia-montato','guida-errore'][variant];
    lessonPathStep = modalita === 'percorso' ? variant + 1 : null;
    modals = variant === 0
      ? [{ id: 'passo-passo', title: 'Passo Passo', type: 'floating' }]
      : variant === 1
      ? [{ id: 'fumetto-report', title: 'Fumetto Report', type: 'modal' }]
      : variant === 2
      ? [{ id: 'cronologia', title: 'Cronologia', type: 'floating' }]
      : [];
    openedPanels = [
      { id: 'panel-left', open: variant !== 0 },
      { id: 'panel-right', open: variant === 1 },
      { id: 'panel-bottom', open: variant === 3 },
      { id: 'chat-overlay', open: true },
      { id: 'docente-sidebar', open: variant === 2 },
    ];
    focused = null;
  } else if (category === 'voice_control') {
    // voice control mostly route-agnostic; lavagna OR chatbot-only typical
    route = variant < 2 ? '#lavagna' : '#chatbot-only';
    modalita = route === '#lavagna' ? 'percorso' : null;
    lessonPathStep = route === '#lavagna' ? variant * 3 : null;
    modals = [];
    openedPanels = [{ id: 'chat-overlay', open: true }];
    focused = null;
  } else if (category === 'navigation') {
    // navigation queries from various source routes
    const sourceHashes = ['#home', '#lavagna', '#tutor', '#dashboard'];
    route = sourceHashes[variant];
    modalita = route === '#lavagna' ? 'libero' : null;
    lessonPathStep = null;
    modals = [];
    openedPanels = [
      { id: 'panel-left', open: false },
      { id: 'chat-overlay', open: variant > 1 },
    ];
    focused = null;
  } else if (category === 'lesson_path_step') {
    // lesson_path_step assumes lavagna + modalita Percorso + active path
    route = '#lavagna';
    modalita = 'percorso';
    lessonPathStep = [0, 3, 7, 9][variant]; // first/middle/late/end
    modals = [];
    openedPanels = [
      { id: 'panel-left', open: true },
      { id: 'chat-overlay', open: true },
      { id: 'docente-sidebar', open: false },
    ];
    focused = null;
  } else {
    route = '#home';
    modalita = null;
    lessonPathStep = null;
    modals = [];
    openedPanels = [];
    focused = null;
  }

  return {
    captured_at: new Date().toISOString(),
    route,
    mode: MODE_BY_HASH[route] || 'home',
    focused,
    modals,
    modalita,
    lesson_path_step: lessonPathStep,
    opened_panels: openedPanels,
  };
}

// ---------------------------------------------------------------------------
// Scoring rubric per ADR-042 §6.2
// ---------------------------------------------------------------------------

/**
 * UI context accuracy: does response reference fields from injected snapshot?
 * Binary 0/1 per facet, average across applicable facets.
 */
function scoreUIContextAccuracy(responseText, uiState, fx) {
  if (!responseText || typeof responseText !== 'string') return 0;
  const text = responseText.toLowerCase();
  const facets = [];

  // Facet: route mention
  const routeName = (uiState.route || '').replace('#','');
  if (routeName) {
    facets.push(text.includes(routeName) || text.includes(uiState.mode) ? 1 : 0);
  }

  // Facet: modalita mention when present
  if (uiState.modalita) {
    facets.push(text.includes(uiState.modalita) || text.includes('modalit') ? 1 : 0);
  }

  // Facet: modals reference when modals not empty
  if (Array.isArray(uiState.modals) && uiState.modals.length > 0) {
    const anyModalReferenced = uiState.modals.some(m =>
      text.includes((m.title || '').toLowerCase()) ||
      text.includes((m.id || '').toLowerCase().replace('-',' '))
    );
    facets.push(anyModalReferenced || text.includes('finestr') || text.includes('modal') ? 1 : 0);
  }

  // Facet: opened_panels reference when any panel open
  const openPanels = (uiState.opened_panels || []).filter(p => p.open);
  if (openPanels.length > 0) {
    facets.push(text.includes('pannell') || text.includes('chat') ? 1 : 0);
  }

  // Facet: lesson_path_step reference when set
  if (uiState.lesson_path_step !== null && uiState.lesson_path_step !== undefined) {
    const stepStr = String(uiState.lesson_path_step + 1);
    facets.push(text.includes('passo') || text.includes(stepStr) ? 1 : 0);
  }

  // Facet: expected_target alignment
  if (fx.expected_target && fx.expected_target !== 'none') {
    const targets = fx.expected_target.toLowerCase().split('+');
    const anyTargetMentioned = targets.some(t =>
      text.includes(t.replace('_',' ')) ||
      text.includes(t.replace('-',' ')) ||
      text.includes(t)
    );
    facets.push(anyTargetMentioned ? 1 : 0);
  }

  // Facet: expected_action mention
  if (fx.expected_action && fx.expected_action !== 'none') {
    facets.push(text.includes(fx.expected_action.toLowerCase()) ? 1 : 0);
  }

  if (facets.length === 0) return 0.5; // no facets to evaluate => neutral
  return facets.reduce((a,b) => a + b, 0) / facets.length;
}

/**
 * PRINCIPIO ZERO V3 score per existing 12-rule scorer simplified subset:
 * +0.4 plurale "Ragazzi" + 0.3 Vol/pag citation + 0.3 kit ELAB mention.
 */
function scorePrincipioZeroV3(responseText) {
  if (!responseText || typeof responseText !== 'string') return 0;
  const text = responseText;
  let score = 0;
  if (/\bragazz[ie]\b/i.test(text)) score += 0.4;
  if (/Vol\.?\s*\d+|pag\.?\s*\d+|Volume\s+\d+|pagina\s+\d+/i.test(text)) score += 0.3;
  if (/kit\s+ELAB|kit\s+fisic|breadboard|Arduino\s+Nano|componente|componenti/i.test(text)) score += 0.3;
  return Math.min(1, score);
}

/**
 * No-hallucination check: when ui_state.modals is empty, response must not
 * reference specific modal names. When uiState.opened_panels all closed,
 * response must not say a panel "is open".
 */
function scoreNoHallucination(responseText, uiState) {
  if (!responseText || typeof responseText !== 'string') return 1;
  const text = responseText.toLowerCase();

  // If no modals open, response shouldn't claim specific modal is open
  if ((!uiState.modals || uiState.modals.length === 0) &&
      /(?:passo passo|fumetto|cronologia)\s+(?:e|sono)?\s*apert/i.test(text)) {
    return 0;
  }

  // If all panels closed, response shouldn't claim panel is open
  const allPanelsClosed = (uiState.opened_panels || []).every(p => !p.open);
  if (allPanelsClosed && uiState.opened_panels && uiState.opened_panels.length > 0) {
    if (/pannello\s+\w+\s+(?:e|sono)?\s*apert/i.test(text)) return 0;
  }

  // If lesson_path_step null, response shouldn't reference specific step number
  if (uiState.lesson_path_step === null && /passo\s+\d+/i.test(text)) {
    return 0.5; // soft hit (could be talking generically)
  }

  return 1;
}

function aggregateScore(uiAcc, pzV3, noHall) {
  return 0.5 * uiAcc + 0.3 * pzV3 + 0.2 * noHall;
}

// ---------------------------------------------------------------------------
// Edge Function call (same auth pattern as r5/r6/r7 stress)
// ---------------------------------------------------------------------------

if (!SUPABASE_ANON_KEY) {
  console.error('ERROR: SUPABASE_ANON_KEY env var REQUIRED for Edge Function R8 stress.');
  console.error('       Re-run: SUPABASE_ANON_KEY=<key> ELAB_API_KEY=<key> node scripts/bench/run-sprint-r8-stress.mjs');
  console.error('');
  console.error('       NOTE iter 26: live execution deferred iter 28+ canary stage');
  console.error('       per ADR-042 §6 + §7 (Andrea env provision + INCLUDE_UI_STATE_IN_ONNISCENZA');
  console.error('       opt-in flag canary 5%). This runner is fixture+runner shipping only.');
  process.exit(1);
}

if (!fs.existsSync(FIXTURE)) {
  console.error(`ERROR: Fixture ${FIXTURE} not found.`);
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const fixture = fs.readFileSync(FIXTURE, 'utf-8').trim().split('\n').filter(Boolean).map(JSON.parse);
console.log(`[R8-stress] Loaded ${fixture.length} fixtures from ${path.relative(REPO_ROOT, FIXTURE)}`);
console.log(`[R8-stress] Endpoint: ${UNLIM_EDGE_URL}`);
console.log(`[R8-stress] Auth: apikey + Authorization Bearer (anon JWT)${ELAB_API_KEY ? ' + X-Elab-Api-Key' : ' (NO X-Elab-Api-Key — fail-open server-side)'}`);
console.log(`[R8-stress] Timestamp: ${TIMESTAMP}`);

const byCategory = {};
for (const fx of fixture) {
  const cat = fx.category || 'uncategorized';
  byCategory[cat] = (byCategory[cat] || 0) + 1;
}
console.log(`[R8-stress] Categories:`, byCategory);

const responsesStream = fs.createWriteStream(RESPONSES_OUT);
const results = [];
let failures = 0;

function makeSessionId() {
  return `s_r8_${TIMESTAMP.replace(/-/g,'').slice(0,12)}_${crypto.randomUUID().slice(0,8)}`;
}

function buildHeaders() {
  const h = {
    'Content-Type': 'application/json',
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  };
  if (ELAB_API_KEY) h['X-Elab-Api-Key'] = ELAB_API_KEY;
  return h;
}

async function callEdge(userMessage, uiState, sessionId, attempt = 1) {
  const start = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(UNLIM_EDGE_URL, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({
        message: userMessage,
        sessionId,
        experimentId: null,
        circuitState: null,
        simulatorContext: null,
        // NEW per ADR-042 §4.2: pass UI state snapshot in request body.
        // Edge Function reads + injects in BASE_PROMPT v3.3 when env
        // INCLUDE_UI_STATE_IN_ONNISCENZA=true (canary opt-in).
        ui_state: uiState,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const latency = Date.now() - start;
    if (!res.ok) {
      const txt = await res.text();
      const isCold = res.status === 503 || res.status === 502 || res.status === 504;
      if (isCold && attempt === 1) {
        console.log(`  ↳ HTTP ${res.status} (cold start), waiting ${COLD_START_RETRY_DELAY_MS / 1000}s and retrying...`);
        await new Promise(r => setTimeout(r, COLD_START_RETRY_DELAY_MS));
        return callEdge(userMessage, uiState, sessionId, attempt + 1);
      }
      throw new Error(`HTTP ${res.status}: ${txt.slice(0, 300)}`);
    }
    const json = await res.json();
    return { latency, raw: json };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError' && attempt === 1) {
      console.log(`  ↳ timeout after ${REQUEST_TIMEOUT_MS}ms, retrying once...`);
      await new Promise(r => setTimeout(r, 5000));
      return callEdge(userMessage, uiState, sessionId, attempt + 1);
    }
    throw err;
  }
}

async function main() {
  console.log('\n=== Running R8 stress fixture against prod Edge Function unlim-chat ===\n');

  for (let idx = 0; idx < fixture.length; idx++) {
    const fx = fixture[idx];
    const sessionId = makeSessionId();
    const uiState = makeSyntheticUIState(fx.category, idx);
    process.stdout.write(`[${(idx + 1).toString().padStart(3)}/${fixture.length}] ${fx.id} (${(fx.category || '?').padEnd(20)}): `);
    try {
      const { latency, raw } = await callEdge(fx.prompt, uiState, sessionId);
      const responseText = raw.response || raw.message || raw.text || '';

      const uiAcc = scoreUIContextAccuracy(responseText, uiState, fx);
      const pzV3 = scorePrincipioZeroV3(responseText);
      const noHall = scoreNoHallucination(responseText, uiState);
      const aggregate = aggregateScore(uiAcc, pzV3, noHall);
      const passPrompt = aggregate >= R8_PER_PROMPT_PASS_THRESHOLD;

      const row = {
        fixture_id: fx.id,
        category: fx.category,
        prompt: fx.prompt,
        expected_action: fx.expected_action,
        expected_target: fx.expected_target,
        ui_state_required: fx.ui_state_required,
        ui_state_injected: uiState,
        latency_ms: latency,
        source: raw.source || null,
        response_text_excerpt: responseText.slice(0, 300),
        scores: {
          ui_context_accuracy: uiAcc,
          principio_zero_v3: pzV3,
          no_hallucination: noHall,
          aggregate,
        },
        verdict: passPrompt ? 'PASS' : 'FAIL',
      };
      console.log(`${latency}ms ui_acc=${uiAcc.toFixed(2)} pz=${pzV3.toFixed(2)} no_hall=${noHall.toFixed(2)} agg=${aggregate.toFixed(2)} (${passPrompt ? 'PASS' : 'FAIL'})`);
      results.push(row);
      responsesStream.write(JSON.stringify(row) + '\n');
    } catch (err) {
      failures++;
      console.log(`FAIL: ${err.message}`);
      const row = {
        fixture_id: fx.id,
        category: fx.category,
        error: err.message,
      };
      results.push(row);
      responsesStream.write(JSON.stringify(row) + '\n');
      if (failures >= MAX_TOTAL_FAILURES) {
        console.error(`\n[R8-stress] HALT: ${failures} failures reached threshold. Endpoint likely degraded.`);
        break;
      }
    }
    if (PACING_DELAY_MS > 0 && idx < fixture.length - 1) {
      await new Promise(r => setTimeout(r, PACING_DELAY_MS));
    }
  }
  responsesStream.end();
  await new Promise(r => responsesStream.on('finish', r));

  console.log(`\n[R8-stress] Responses written: ${path.relative(REPO_ROOT, RESPONSES_OUT)}`);

  const successful = results.filter(r => !r.error);
  const passing = successful.filter(r => r.verdict === 'PASS');

  // Aggregate accuracy across categories
  const passRate = successful.length === 0 ? 0 : passing.length / successful.length;
  const avgUiAcc = successful.length === 0 ? 0
    : successful.reduce((s, r) => s + (r.scores?.ui_context_accuracy || 0), 0) / successful.length;
  const avgPz = successful.length === 0 ? 0
    : successful.reduce((s, r) => s + (r.scores?.principio_zero_v3 || 0), 0) / successful.length;
  const avgNoHall = successful.length === 0 ? 0
    : successful.reduce((s, r) => s + (r.scores?.no_hallucination || 0), 0) / successful.length;
  const avgAggregate = successful.length === 0 ? 0
    : successful.reduce((s, r) => s + (r.scores?.aggregate || 0), 0) / successful.length;

  // Latency
  const lats = successful.map(r => r.latency_ms).sort((a, b) => a - b);
  const pct = (p) => lats.length === 0 ? 0 : lats[Math.min(lats.length - 1, Math.floor(p * lats.length))];
  const avgLatency = successful.length
    ? Math.round(successful.reduce((s, r) => s + r.latency_ms, 0) / successful.length) : 0;

  // Per-category breakdown
  const byCat = {};
  for (const r of successful) {
    const cat = r.category || 'uncategorized';
    if (!byCat[cat]) byCat[cat] = { total: 0, pass: 0, fail: 0, avgUiAcc: 0, avgPz: 0, avgNoHall: 0, avgAggregate: 0, sumUi: 0, sumPz: 0, sumNoHall: 0, sumAgg: 0 };
    byCat[cat].total += 1;
    if (r.verdict === 'PASS') byCat[cat].pass += 1;
    else byCat[cat].fail += 1;
    byCat[cat].sumUi += (r.scores?.ui_context_accuracy || 0);
    byCat[cat].sumPz += (r.scores?.principio_zero_v3 || 0);
    byCat[cat].sumNoHall += (r.scores?.no_hallucination || 0);
    byCat[cat].sumAgg += (r.scores?.aggregate || 0);
  }
  for (const cat of Object.keys(byCat)) {
    const b = byCat[cat];
    b.avgUiAcc = b.total > 0 ? b.sumUi / b.total : 0;
    b.avgPz = b.total > 0 ? b.sumPz / b.total : 0;
    b.avgNoHall = b.total > 0 ? b.sumNoHall / b.total : 0;
    b.avgAggregate = b.total > 0 ? b.sumAgg / b.total : 0;
    b.passRate = b.total > 0 ? b.pass / b.total : 0;
    delete b.sumUi; delete b.sumPz; delete b.sumNoHall; delete b.sumAgg;
  }

  const verdict = passRate >= R8_PASS_THRESHOLD ? 'PASS' : 'FAIL';

  const scoresJson = {
    bench: 'R8-stress',
    timestamp: TIMESTAMP,
    fixture: path.relative(REPO_ROOT, FIXTURE),
    fixture_count: fixture.length,
    endpoint: UNLIM_EDGE_URL,
    success_count: successful.length,
    failure_count: failures,
    passing_count: passing.length,
    pass_rate: passRate,
    pass_threshold: R8_PASS_THRESHOLD,
    per_prompt_threshold: R8_PER_PROMPT_PASS_THRESHOLD,
    verdict,
    aggregate_scores: {
      avg_ui_context_accuracy: avgUiAcc,
      avg_principio_zero_v3: avgPz,
      avg_no_hallucination: avgNoHall,
      avg_aggregate: avgAggregate,
    },
    latency_avg_ms: avgLatency,
    latency_p50_ms: pct(0.5),
    latency_p95_ms: pct(0.95),
    latency_p99_ms: pct(0.99),
    by_category: byCat,
  };
  fs.writeFileSync(SCORES_OUT, JSON.stringify(scoresJson, null, 2));

  const catRows = Object.entries(byCat).map(([cat, b]) =>
    `| ${cat} | ${b.total} | ${b.pass} | ${b.fail} | ${(b.passRate * 100).toFixed(1)}% | ${(b.avgUiAcc * 100).toFixed(1)}% | ${(b.avgPz * 100).toFixed(1)}% | ${(b.avgNoHall * 100).toFixed(1)}% | ${(b.avgAggregate * 100).toFixed(1)}% |`).join('\n');

  const report = `# Sprint T iter 31 ralph 26 Atom 27.1 — R8 Stress (UI action context awareness) ${TIMESTAMP}

> Per ADR-042 §6 R8 100-prompt UI action context awareness fixture (5
> categories x 20 prompts each). Synthetic UI state injection iter 26
> (real Playwright bootstrap deferred iter 28+).

## Setup

- **Endpoint**: \`${UNLIM_EDGE_URL}\`
- **Fixture**: ${path.relative(REPO_ROOT, FIXTURE)} (${fixture.length} prompts)
- **Generator**: scripts/bench/run-sprint-r8-stress.mjs
- **Scoring rubric** (per ADR-042 §6.2):
  - 0.5 × UI context accuracy (per-facet binary, average 5-7 facets)
  - 0.3 × PRINCIPIO ZERO V3 (Ragazzi + Vol/pag + kit ELAB)
  - 0.2 × No-hallucination (no fake modals/panels/steps)

## Aggregate

| Metric | Value | Threshold | Verdict |
|--------|-------|-----------|---------|
| Successful | ${successful.length}/${fixture.length} | — | — |
| Failures | ${failures} | — | — |
| Passing prompts (aggregate ≥${R8_PER_PROMPT_PASS_THRESHOLD}) | ${passing.length} | — | — |
| **Pass rate** | **${(passRate * 100).toFixed(1)}%** | ≥${(R8_PASS_THRESHOLD * 100).toFixed(0)}% | **${verdict}** |

## Per-rubric averages

| Rubric facet | Average | Weight | Contribution |
|--------------|---------|--------|--------------|
| UI context accuracy | ${(avgUiAcc * 100).toFixed(1)}% | 0.5 | ${(avgUiAcc * 0.5 * 100).toFixed(1)}% |
| PRINCIPIO ZERO V3 | ${(avgPz * 100).toFixed(1)}% | 0.3 | ${(avgPz * 0.3 * 100).toFixed(1)}% |
| No-hallucination | ${(avgNoHall * 100).toFixed(1)}% | 0.2 | ${(avgNoHall * 0.2 * 100).toFixed(1)}% |
| **Aggregate** | **${(avgAggregate * 100).toFixed(1)}%** | — | — |

## Latency

| Metric | Value |
|--------|-------|
| Avg | ${avgLatency}ms |
| p50 | ${pct(0.5)}ms |
| p95 | ${pct(0.95)}ms |
| p99 | ${pct(0.99)}ms |

## Per-category breakdown

| Category | Total | Pass | Fail | Pass % | Avg UI Acc | Avg PZ V3 | Avg NoHall | Avg Aggregate |
|----------|-------|------|------|--------|------------|-----------|------------|----------------|
${catRows}

## Honesty caveats

1. **Fixture+runner only iter 26** — live execution deferred iter 28+ canary
   stage post Andrea env provision (SUPABASE_ANON_KEY + ELAB_API_KEY +
   INCLUDE_UI_STATE_IN_ONNISCENZA=true canary 5% opt-in per ADR-042 §7).
   NO claim "R8 ≥80% UI context accuracy LIVE" until Andrea verify post-deploy.
2. **Synthetic UI state injection** — \`makeSyntheticUIState(category, idx)\`
   generates 4 variants per category covering route/modalita/modals/
   opened_panels/lesson_path_step/focused permutations. REAL UI state via
   Playwright bootstrap + \`window.__ELAB_API.ui.getState()\` (per ADR-036 +
   ADR-042 §4.1) deferred iter 28+ Tester-2 + Maker-1 scope.
3. **PRINCIPIO ZERO V3 simplified subset** — full 12-rule scoring requires
   \`scripts/bench/score-unlim-quality.mjs\` integration (defer iter 28+).
   This runner uses 3-rule shortcut (Ragazzi + Vol/pag + kit ELAB).
4. **Latency overhead measurement** — vs V1 baseline 3380ms (per ADR-042 §6.3
   target <100ms overhead) requires R5 paired re-run. This runner reports
   absolute latency; comparison to V1 baseline deferred iter 28+ Tester-1
   ownership.
5. **No-hallucination heuristic loose** — regex-based detection of "modal
   X is open" patterns when \`ui.modals\` empty. Production deploy needs
   stricter LLM-as-judge or NER-based hallucination detection (defer iter 30+).

## Verdict

- **Pass rate**: ${(passRate * 100).toFixed(1)}% (target ≥${(R8_PASS_THRESHOLD * 100).toFixed(0)}%)
- **Avg aggregate**: ${(avgAggregate * 100).toFixed(1)}%
- **Verdict**: ${verdict}

## Files

- Raw responses: ${path.relative(REPO_ROOT, RESPONSES_OUT)}
- Scorer JSON: ${path.relative(REPO_ROOT, SCORES_OUT)}
- This report: ${path.relative(REPO_ROOT, REPORT_OUT)}
`;
  fs.writeFileSync(REPORT_OUT, report);
  console.log(`\n[R8-stress] Report: ${path.relative(REPO_ROOT, REPORT_OUT)}`);
  console.log(`[R8-stress] Verdict: ${verdict} (pass=${(passRate * 100).toFixed(1)}%, avg=${(avgAggregate * 100).toFixed(1)}%)`);
}

main().catch(err => {
  console.error('[R8-stress] FATAL:', err);
  process.exit(1);
});
