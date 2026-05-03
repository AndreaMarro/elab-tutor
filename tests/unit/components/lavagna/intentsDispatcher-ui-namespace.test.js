/**
 * Unit tests — iter 31 ralph 21 Atom 21.1 (Tester-1).
 *
 * Validates `intentsDispatcher.js` post iter 20.2 expansion (12 → 62 whitelist)
 * per ADR-041 §3-§6 (L0b API namespace + HYBRID resolver + rate limit + audit
 * stub + stop conditions + confirmation gate + destructive exclusion).
 *
 * Cross-link: existing `useGalileoChat-intents-parsed.test.js` (22 baseline
 * iter 37) covers the dispatcher contract semantics. This file expands coverage
 * to the 50 NEW L0b actions (38 spec) + 12 dispatcher-only extras (drift) +
 * resolver/rate-limit/audit/stop/destructive-exclusion edge cases (~80 tests).
 *
 * SYNC DRIFT NOTE (file-system verified Atom 21.1):
 *   - Schema CANONICAL_INTENT_TOOLS (intent-tools-schema.ts:53-123) = 50
 *     (12 baseline + 38 NEW per ADR-041 §3.1-§3.6)
 *   - Dispatcher ALLOWED_INTENT_ACTIONS (intentsDispatcher.js:55-133) = 62
 *     (12 baseline + 38 NEW + 12 EXTRA dispatcher-only:
 *       deselectAll, setSlider, penTool, setCode, minimizeChat, closeChat,
 *       toggleSidebar, pageNav, volumeSelect, videoTabSelect,
 *       cronologiaSelectSession, cronologiaNewChat)
 *   - Plus 1 baseline asymmetry: schema has `clearHighlightPins`,
 *     dispatcher has `connectWire` instead.
 *   - DO NOT auto-fix (Architect ownership iter 32+ refactor canonical SoT).
 *   - Tests assert dispatcher's 62-set as ground truth (browser-side authority).
 *
 * (c) Andrea Marro 2026-05-03 — ELAB Tutor.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock logger so warnings don't spam test output but ARE assertable.
vi.mock('../../../../src/utils/logger', () => ({
  default: { warn: vi.fn(), info: vi.fn(), error: vi.fn() },
}));

import {
  ALLOWED_INTENT_ACTIONS,
  DESTRUCTIVE_LIKE_REQUIRES_CONFIRM,
  checkRateLimit,
  _resetRateLimit,
  truncateIntentsPerResponse,
  resolveSelector,
  logUiAction,
  requiresConfirmation,
  executeServerIntents,
  isAllowedIntent,
  resolveIntentFn,
  INTENTS_DISPATCHER_VERSION,
} from '../../../../src/components/lavagna/intentsDispatcher';

import logger from '../../../../src/utils/logger';

beforeEach(() => {
  vi.clearAllMocks();
  _resetRateLimit();
});

afterEach(() => {
  _resetRateLimit();
});

// ───────────────────────────────────────────────────────────────────────────
// Section 1 — 50 PER-ACTION WHITELIST PRESENCE (iter 20.2 expansion verify)
// Covers: 38 NEW L0b actions + 12 dispatcher-only extras = 50 cases
// (12 baseline iter 37 already covered by existing intents-parsed tests)
// ───────────────────────────────────────────────────────────────────────────

describe('intentsDispatcher — iter 20.2 whitelist expansion (50 NEW per-action presence)', () => {
  // §3.1 Mouse + keyboard primitives (10)
  it('whitelists §3.1 click', () => { expect(ALLOWED_INTENT_ACTIONS.has('click')).toBe(true); });
  it('whitelists §3.1 doubleClick', () => { expect(ALLOWED_INTENT_ACTIONS.has('doubleClick')).toBe(true); });
  it('whitelists §3.1 rightClick', () => { expect(ALLOWED_INTENT_ACTIONS.has('rightClick')).toBe(true); });
  it('whitelists §3.1 hover', () => { expect(ALLOWED_INTENT_ACTIONS.has('hover')).toBe(true); });
  it('whitelists §3.1 scroll', () => { expect(ALLOWED_INTENT_ACTIONS.has('scroll')).toBe(true); });
  it('whitelists §3.1 type', () => { expect(ALLOWED_INTENT_ACTIONS.has('type')).toBe(true); });
  it('whitelists §3.1 key', () => { expect(ALLOWED_INTENT_ACTIONS.has('key')).toBe(true); });
  it('whitelists §3.1 keyDown', () => { expect(ALLOWED_INTENT_ACTIONS.has('keyDown')).toBe(true); });
  it('whitelists §3.1 keyUp', () => { expect(ALLOWED_INTENT_ACTIONS.has('keyUp')).toBe(true); });
  it('whitelists §3.1 drag', () => { expect(ALLOWED_INTENT_ACTIONS.has('drag')).toBe(true); });

  // §3.2 Window + modal + navigation (8)
  it('whitelists §3.2 openModal', () => { expect(ALLOWED_INTENT_ACTIONS.has('openModal')).toBe(true); });
  it('whitelists §3.2 closeModal', () => { expect(ALLOWED_INTENT_ACTIONS.has('closeModal')).toBe(true); });
  it('whitelists §3.2 minimizeWindow', () => { expect(ALLOWED_INTENT_ACTIONS.has('minimizeWindow')).toBe(true); });
  it('whitelists §3.2 maximizeWindow', () => { expect(ALLOWED_INTENT_ACTIONS.has('maximizeWindow')).toBe(true); });
  it('whitelists §3.2 closeWindow', () => { expect(ALLOWED_INTENT_ACTIONS.has('closeWindow')).toBe(true); });
  it('whitelists §3.2 navigate', () => { expect(ALLOWED_INTENT_ACTIONS.has('navigate')).toBe(true); });
  it('whitelists §3.2 back', () => { expect(ALLOWED_INTENT_ACTIONS.has('back')).toBe(true); });
  it('whitelists §3.2 forward', () => { expect(ALLOWED_INTENT_ACTIONS.has('forward')).toBe(true); });

  // §3.3 Modalità 4 + lesson-paths (7)
  it('whitelists §3.3 toggleModalita', () => { expect(ALLOWED_INTENT_ACTIONS.has('toggleModalita')).toBe(true); });
  it('whitelists §3.3 highlightStep', () => { expect(ALLOWED_INTENT_ACTIONS.has('highlightStep')).toBe(true); });
  it('whitelists §3.3 nextStep', () => { expect(ALLOWED_INTENT_ACTIONS.has('nextStep')).toBe(true); });
  it('whitelists §3.3 prevStep', () => { expect(ALLOWED_INTENT_ACTIONS.has('prevStep')).toBe(true); });
  it('whitelists §3.3 nextExperiment', () => { expect(ALLOWED_INTENT_ACTIONS.has('nextExperiment')).toBe(true); });
  it('whitelists §3.3 prevExperiment', () => { expect(ALLOWED_INTENT_ACTIONS.has('prevExperiment')).toBe(true); });
  it('whitelists §3.3 restartLessonPath', () => { expect(ALLOWED_INTENT_ACTIONS.has('restartLessonPath')).toBe(true); });

  // §3.4 Voice + TTS playback (6)
  it('whitelists §3.4 voicePlayback', () => { expect(ALLOWED_INTENT_ACTIONS.has('voicePlayback')).toBe(true); });
  it('whitelists §3.4 voiceSetVolume', () => { expect(ALLOWED_INTENT_ACTIONS.has('voiceSetVolume')).toBe(true); });
  it('whitelists §3.4 voiceSetMode', () => { expect(ALLOWED_INTENT_ACTIONS.has('voiceSetMode')).toBe(true); });
  it('whitelists §3.4 startWakeWord', () => { expect(ALLOWED_INTENT_ACTIONS.has('startWakeWord')).toBe(true); });
  it('whitelists §3.4 stopWakeWord', () => { expect(ALLOWED_INTENT_ACTIONS.has('stopWakeWord')).toBe(true); });
  it('whitelists §3.4 speak', () => { expect(ALLOWED_INTENT_ACTIONS.has('speak')).toBe(true); });

  // §3.5 Simulator-specific (8 — dispatcher includes 4 EXTRA vs schema 4)
  it('whitelists §3.5 zoom', () => { expect(ALLOWED_INTENT_ACTIONS.has('zoom')).toBe(true); });
  it('whitelists §3.5 pan', () => { expect(ALLOWED_INTENT_ACTIONS.has('pan')).toBe(true); });
  it('whitelists §3.5 centerOn', () => { expect(ALLOWED_INTENT_ACTIONS.has('centerOn')).toBe(true); });
  it('whitelists §3.5 selectComponent', () => { expect(ALLOWED_INTENT_ACTIONS.has('selectComponent')).toBe(true); });
  it('whitelists §3.5 deselectAll (dispatcher EXTRA — drift)', () => { expect(ALLOWED_INTENT_ACTIONS.has('deselectAll')).toBe(true); });
  it('whitelists §3.5 setSlider (dispatcher EXTRA — drift)', () => { expect(ALLOWED_INTENT_ACTIONS.has('setSlider')).toBe(true); });
  it('whitelists §3.5 penTool (dispatcher EXTRA — drift)', () => { expect(ALLOWED_INTENT_ACTIONS.has('penTool')).toBe(true); });
  it('whitelists §3.5 setCode (dispatcher EXTRA — drift)', () => { expect(ALLOWED_INTENT_ACTIONS.has('setCode')).toBe(true); });

  // §3.6 Lavagna + chatbot + chat (6 — dispatcher includes 3 EXTRA vs schema 3)
  it('whitelists §3.6 expandChatUnlim', () => { expect(ALLOWED_INTENT_ACTIONS.has('expandChatUnlim')).toBe(true); });
  it('whitelists §3.6 switchTab', () => { expect(ALLOWED_INTENT_ACTIONS.has('switchTab')).toBe(true); });
  it('whitelists §3.6 togglePanel', () => { expect(ALLOWED_INTENT_ACTIONS.has('togglePanel')).toBe(true); });
  it('whitelists §3.6 minimizeChat (dispatcher EXTRA — drift)', () => { expect(ALLOWED_INTENT_ACTIONS.has('minimizeChat')).toBe(true); });
  it('whitelists §3.6 closeChat (dispatcher EXTRA — drift)', () => { expect(ALLOWED_INTENT_ACTIONS.has('closeChat')).toBe(true); });
  it('whitelists §3.6 toggleSidebar (dispatcher EXTRA — drift)', () => { expect(ALLOWED_INTENT_ACTIONS.has('toggleSidebar')).toBe(true); });

  // §3.7 Volumi + manuale + cronologia (5 — dispatcher EXTRA NOT in schema 50)
  it('whitelists §3.7 pageNav (dispatcher EXTRA — drift)', () => { expect(ALLOWED_INTENT_ACTIONS.has('pageNav')).toBe(true); });
  it('whitelists §3.7 volumeSelect (dispatcher EXTRA — drift)', () => { expect(ALLOWED_INTENT_ACTIONS.has('volumeSelect')).toBe(true); });
  it('whitelists §3.7 videoTabSelect (dispatcher EXTRA — drift)', () => { expect(ALLOWED_INTENT_ACTIONS.has('videoTabSelect')).toBe(true); });
  it('whitelists §3.7 cronologiaSelectSession (dispatcher EXTRA — drift)', () => { expect(ALLOWED_INTENT_ACTIONS.has('cronologiaSelectSession')).toBe(true); });
  it('whitelists §3.7 cronologiaNewChat (dispatcher EXTRA — drift)', () => { expect(ALLOWED_INTENT_ACTIONS.has('cronologiaNewChat')).toBe(true); });

  // Whitelist size invariant
  it('whitelist size = 62 entries (12 baseline + 38 NEW + 12 EXTRA dispatcher-only)', () => {
    expect(ALLOWED_INTENT_ACTIONS.size).toBe(62);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// Section 2 — HYBRID resolver (5 tests per ADR-041 §4.1 priority chain)
// ───────────────────────────────────────────────────────────────────────────

describe('intentsDispatcher — HYBRID resolver (ADR-041 §4)', () => {
  function makeDoc(html) {
    if (typeof DOMParser === 'undefined') return null;
    const parser = new DOMParser();
    return parser.parseFromString(`<!DOCTYPE html><html><body>${html}</body></html>`, 'text/html');
  }

  it('priority 1 ARIA — matches [aria-label="..."] ahead of text/css', () => {
    const doc = makeDoc('<button aria-label="Avvia">Play</button><div data-elab-action="Avvia"></div>');
    const r = resolveSelector({ ariaLabel: 'Avvia' }, { doc });
    expect(r.strategy).toBe('aria');
    expect(r.status).toBe('ok');
    expect(r.matchCount).toBe(1);
    expect(r.elements).toHaveLength(1);
  });

  it('priority 2 data-elab — matches when ARIA absent', () => {
    const doc = makeDoc('<button data-elab-action="mountExperiment" data-elab-target="led-blink">Monta</button>');
    const r = resolveSelector(
      { dataElabAction: 'mountExperiment', dataElabTarget: 'led-blink' },
      { doc }
    );
    expect(r.strategy).toBe('data-elab');
    expect(r.status).toBe('ok');
    expect(r.matchCount).toBe(1);
  });

  it('priority 3 text content — matches via XPath normalize-space', () => {
    const doc = makeDoc('<button>Avvia esperimento</button>');
    const r = resolveSelector({ text: 'Avvia esperimento' }, { doc });
    expect(r.strategy).toBe('text');
    expect(r.status).toBe('ok');
    expect(r.matchCount).toBeGreaterThanOrEqual(1);
  });

  it('priority 4 CSS fallback — used when higher priorities fail', () => {
    const doc = makeDoc('<button id="play-btn">Play</button>');
    const r = resolveSelector({ cssSelector: '#play-btn' }, { doc });
    expect(r.strategy).toBe('css');
    expect(r.status).toBe('ok');
    expect(r.matchCount).toBe(1);
  });

  it('anti-absurd — >10 matches returns selector_too_broad and empty elements', () => {
    const buttons = Array.from({ length: 12 }, () => '<button class="x">B</button>').join('');
    const doc = makeDoc(buttons);
    const r = resolveSelector({ cssSelector: '.x' }, { doc });
    expect(r.status).toBe('selector_too_broad');
    expect(r.elements).toEqual([]);
    expect(r.matchCount).toBeGreaterThan(10);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// Section 3 — Rate limit (5 tests per ADR-041 §5.5 + §6.5)
// ───────────────────────────────────────────────────────────────────────────

describe('intentsDispatcher — rate limit (ADR-041 §5.5 sliding window 10/60s)', () => {
  it('under limit — 5 calls in fresh window all allowed', () => {
    for (let i = 0; i < 5; i++) {
      const r = checkRateLimit('sess-A');
      expect(r.allowed).toBe(true);
    }
  });

  it('at limit — 10th call still allowed, 11th refused', () => {
    for (let i = 0; i < 10; i++) {
      expect(checkRateLimit('sess-B').allowed).toBe(true);
    }
    const r = checkRateLimit('sess-B');
    expect(r.allowed).toBe(false);
    expect(r.reason).toMatch(/rate_limit_exceeded/);
  });

  it('over limit — repeated calls past cap remain refused', () => {
    for (let i = 0; i < 10; i++) checkRateLimit('sess-C');
    for (let i = 0; i < 5; i++) {
      const r = checkRateLimit('sess-C');
      expect(r.allowed).toBe(false);
    }
  });

  it('window reset — synthetic Date.now advance lets new bucket open', () => {
    const realNow = Date.now;
    let t = 1_000_000;
    Date.now = () => t;
    try {
      for (let i = 0; i < 10; i++) checkRateLimit('sess-D');
      expect(checkRateLimit('sess-D').allowed).toBe(false);
      // Advance > 60s
      t += 61_000;
      const r = checkRateLimit('sess-D');
      expect(r.allowed).toBe(true);
    } finally {
      Date.now = realNow;
    }
  });

  it('concurrent sessions — buckets isolated per sessionId', () => {
    for (let i = 0; i < 10; i++) checkRateLimit('sess-E');
    expect(checkRateLimit('sess-E').allowed).toBe(false);
    // Different session has fresh bucket
    expect(checkRateLimit('sess-F').allowed).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// Section 4 — Audit log stub (5 tests per ADR-041 §5.6 contract)
// ───────────────────────────────────────────────────────────────────────────

describe('intentsDispatcher — audit log stub (ADR-041 §5.6)', () => {
  it('returns Promise.resolve with stub shape on valid input', async () => {
    const r = await logUiAction('click', { ariaLabel: 'Avvia' }, { ok: true, status: 'ok' });
    expect(r).toEqual({ logged: false, reason: 'stub' });
  });

  it('returns invalid_action when action is non-string', async () => {
    const r = await logUiAction(null, {}, { ok: false });
    expect(r).toEqual({ logged: false, reason: 'invalid_action' });
  });

  it('NEVER throws — defensive even on garbage result payload', async () => {
    await expect(logUiAction('click', undefined, undefined)).resolves.toBeDefined();
    await expect(logUiAction('click', { x: 1 }, { ok: true })).resolves.toBeDefined();
  });

  it('emits structured logger.info call with action + ok + status', async () => {
    await logUiAction('mountExperiment', { id: 'v1-cap6-esp1' }, { ok: true, status: 'ok' });
    expect(logger.info).toHaveBeenCalledWith(
      '[ui-audit-stub]',
      expect.objectContaining({ action: 'mountExperiment', ok: true, status: 'ok' })
    );
  });

  it('returns a thenable Promise (fire-and-forget contract preserved)', () => {
    const p = logUiAction('hover', null, { ok: true });
    expect(p).toBeInstanceOf(Promise);
    expect(typeof p.then).toBe('function');
  });
});

// ───────────────────────────────────────────────────────────────────────────
// Section 5 — Stop conditions (5 tests per ADR-041 §6 max consecutive)
// ───────────────────────────────────────────────────────────────────────────

describe('intentsDispatcher — stop conditions (ADR-041 §6.1 max 5 consecutive)', () => {
  it('truncate — 6 intents kept to 5, originalCount=6, truncated=true', () => {
    const intents = Array.from({ length: 6 }, () => ({ tool: 'click' }));
    const r = truncateIntentsPerResponse(intents);
    expect(r.kept).toHaveLength(5);
    expect(r.truncated).toBe(true);
    expect(r.originalCount).toBe(6);
  });

  it('truncate — 5 intents preserved, truncated=false', () => {
    const intents = Array.from({ length: 5 }, () => ({ tool: 'hover' }));
    const r = truncateIntentsPerResponse(intents);
    expect(r.kept).toHaveLength(5);
    expect(r.truncated).toBe(false);
    expect(r.originalCount).toBe(5);
  });

  it('truncate — empty array returns empty kept, truncated=false, count=0', () => {
    const r = truncateIntentsPerResponse([]);
    expect(r.kept).toEqual([]);
    expect(r.truncated).toBe(false);
    expect(r.originalCount).toBe(0);
  });

  it('reset on response boundary — separate executeServerIntents calls have independent budgets', async () => {
    const fn = vi.fn(() => 'ok');
    const api = { ui: { click: fn }, click: fn };
    // First call: 3 intents
    await executeServerIntents(
      [{ tool: 'click' }, { tool: 'click' }, { tool: 'click' }],
      { api, sessionId: 'sess-G' }
    );
    expect(fn).toHaveBeenCalledTimes(3);
    fn.mockClear();
    _resetRateLimit();
    // Second call: 2 intents — independent counter, all dispatch
    await executeServerIntents(
      [{ tool: 'click' }, { tool: 'click' }],
      { api, sessionId: 'sess-G' }
    );
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('truncation marker appended as final result row when triggered', async () => {
    const fn = vi.fn(() => 'ok');
    const api = { ui: { hover: fn }, hover: fn };
    const intents = Array.from({ length: 7 }, () => ({ tool: 'hover' }));
    const r = await executeServerIntents(intents, { api, sessionId: 'sess-H' });
    // 5 dispatched + 1 truncation marker = 6 rows
    expect(r).toHaveLength(6);
    expect(r[5]).toMatchObject({ ok: false, action: null, error: 'truncated_max_consecutive' });
  });
});

// ───────────────────────────────────────────────────────────────────────────
// Section 6 — Destructive whitelist exclusion (5 tests per ADR-041 §5.2)
// 18 FORBIDDEN actions REJECT (executeServerIntents → not_whitelisted)
// ───────────────────────────────────────────────────────────────────────────

describe('intentsDispatcher — destructive exclusion (ADR-041 §5.2 18 FORBIDDEN)', () => {
  const ADMIN_DESTRUCTIVE = [
    'admin-license-clear', 'admin-license-create', 'admin-license-modify',
    'admin-license-export', 'admin-license-update',
    'admin-class-delete', 'admin-student-delete', 'admin-audit-clear',
    'admin-settings-reset',
  ];
  const MANUAL_NOTEBOOK_DESTRUCTIVE = ['manual-doc-remove', 'notebook-delete'];
  const TEACHER_DESTRUCTIVE = ['teacher-class-delete', 'teacher-student-delete'];
  const VOICE_MEMORY_DESTRUCTIVE = [
    'resetMemory', 'cronologia-delete-session',
    'stopSync', 'deleteAll', 'submitForm', 'fetchExternalUrl',
  ];

  it('all 9 admin-* destructive actions NOT whitelisted', () => {
    for (const a of ADMIN_DESTRUCTIVE) {
      expect(ALLOWED_INTENT_ACTIONS.has(a)).toBe(false);
    }
  });

  it('all 2 manual/notebook destructive actions NOT whitelisted', () => {
    for (const a of MANUAL_NOTEBOOK_DESTRUCTIVE) {
      expect(ALLOWED_INTENT_ACTIONS.has(a)).toBe(false);
    }
  });

  it('all 2 teacher destructive actions NOT whitelisted', () => {
    for (const a of TEACHER_DESTRUCTIVE) {
      expect(ALLOWED_INTENT_ACTIONS.has(a)).toBe(false);
    }
  });

  it('all 6 voice/memory destructive actions NOT whitelisted', () => {
    for (const a of VOICE_MEMORY_DESTRUCTIVE) {
      expect(ALLOWED_INTENT_ACTIONS.has(a)).toBe(false);
    }
  });

  it('FORBIDDEN action dispatched → REJECT not_whitelisted + console.warn + handler NEVER invoked', async () => {
    const handler = vi.fn();
    const api = { ui: { 'admin-license-clear': handler }, 'admin-license-clear': handler };
    const r = await executeServerIntents(
      [{ tool: 'admin-license-clear', args: {} }],
      { api, sessionId: 'sess-DEST' }
    );
    expect(handler).not.toHaveBeenCalled();
    expect(r[0]).toEqual({ ok: false, action: 'admin-license-clear', error: 'not_whitelisted' });
    expect(logger.warn).toHaveBeenCalled();
  });
});

// ───────────────────────────────────────────────────────────────────────────
// Section 7 — Confirmation gate (5 tests per ADR-041 §5.3)
// 6 destructive-like return {needsConfirm:true} NOT execute
// ───────────────────────────────────────────────────────────────────────────

describe('intentsDispatcher — confirmation gate (ADR-041 §5.3 6 destructive-like)', () => {
  it('DESTRUCTIVE_LIKE_REQUIRES_CONFIRM has 6 entries', () => {
    expect(DESTRUCTIVE_LIKE_REQUIRES_CONFIRM.size).toBe(6);
  });

  it('clearCircuit triggers confirm gate, handler NOT invoked', async () => {
    const handler = vi.fn();
    const api = { ui: { clearCircuit: handler }, clearCircuit: handler };
    const r = await executeServerIntents(
      [{ tool: 'clearCircuit', args: {} }],
      { api, sessionId: 'sess-CONF1' }
    );
    expect(handler).not.toHaveBeenCalled();
    expect(r[0]).toMatchObject({
      ok: false,
      action: 'clearCircuit',
      needsConfirm: true,
      error: 'confirm_required',
    });
  });

  it('navigate + cronologiaSelectSession + restartLessonPath all flagged needsConfirm', () => {
    expect(requiresConfirmation({ tool: 'navigate' })).toBe(true);
    expect(requiresConfirmation({ tool: 'cronologiaSelectSession' })).toBe(true);
    expect(requiresConfirmation({ tool: 'restartLessonPath' })).toBe(true);
  });

  it('closeModal + closeWindow flagged needsConfirm (per ADR §5.3)', async () => {
    const handler = vi.fn();
    const api = { ui: { closeModal: handler, closeWindow: handler } };
    const r = await executeServerIntents(
      [{ tool: 'closeModal' }, { tool: 'closeWindow' }],
      { api, sessionId: 'sess-CONF2' }
    );
    expect(handler).not.toHaveBeenCalled();
    expect(r[0]).toMatchObject({ needsConfirm: true });
    expect(r[1]).toMatchObject({ needsConfirm: true });
  });

  it('non-destructive actions (click/hover/scroll) NEVER flagged needsConfirm', () => {
    expect(requiresConfirmation({ tool: 'click' })).toBe(false);
    expect(requiresConfirmation({ tool: 'hover' })).toBe(false);
    expect(requiresConfirmation({ tool: 'scroll' })).toBe(false);
    expect(requiresConfirmation({ tool: 'highlightComponent' })).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// Section 8 — Misc invariants (extra hardening, not counted toward 80 plan)
// ───────────────────────────────────────────────────────────────────────────

describe('intentsDispatcher — misc invariants', () => {
  it('version marker present and includes iter 20.2 atom suffix', () => {
    expect(INTENTS_DISPATCHER_VERSION).toMatch(/iter37/);
    expect(INTENTS_DISPATCHER_VERSION).toMatch(/atom20\.2/);
  });

  it('isAllowedIntent ↔ ALLOWED_INTENT_ACTIONS set membership consistent', () => {
    // Sample 5 random whitelisted actions
    const sample = ['click', 'navigate', 'voicePlayback', 'pageNav', 'expandChatUnlim'];
    for (const a of sample) {
      expect(isAllowedIntent({ tool: a })).toBe(true);
    }
  });

  it('resolveIntentFn prefers api.unlim over api.ui over api top-level', () => {
    const unlimFn = () => 'unlim';
    const uiFn = () => 'ui';
    const topFn = () => 'top';
    expect(resolveIntentFn({ unlim: { click: unlimFn }, ui: { click: uiFn }, click: topFn }, 'click')).toBe(unlimFn);
    expect(resolveIntentFn({ ui: { click: uiFn }, click: topFn }, 'click')).toBe(uiFn);
    expect(resolveIntentFn({ click: topFn }, 'click')).toBe(topFn);
  });
});
