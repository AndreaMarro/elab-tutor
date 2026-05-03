/**
 * intentsDispatcher — iter 37 Atom B-NEW (Maker-1 backend-architect).
 * iter 31 ralph 20 Atom 20.2 — ADR-041 §4-§6 expansion (Maker-2).
 *
 * Browser-side dispatcher for server-parsed `intents_parsed` returned by the
 * Edge Function `unlim-chat` (iter 36 A1 INTENT parser, ADR-028 §14
 * surface-to-browser amend). Each entry has shape `{ tool, args }` (canonical)
 * or `{ action, params }` (alias). The dispatcher iterates the array, whitelists
 * the tool against ALLOWED_INTENT_ACTIONS, and invokes the corresponding
 * handler on `window.__ELAB_API` with error isolation per intent.
 *
 * Reference: PDR-ITER-37-LATENCY-LIFT-DEPLOY-VERIFY.md Atom B-NEW.
 *           ADR-041 §4 HYBRID selector + §5 Security boundary + §6 Stop conditions
 *           (iter 31 ralph 20 Atom 20.2 expansion 12 → 50 actions).
 *
 * SECURITY GATE — only whitelisted tool actions can be invoked. The 62-tool
 * registry is server-side; the browser-safe subset is curated below. Any
 * action not on the list is logged + skipped (refused, never errored).
 *
 * Error isolation — a failure in one intent NEVER prevents the next one from
 * dispatching. Each result row is `{ ok, action, ... }` for telemetry / UI.
 *
 * iter 31 ralph 20 Atom 20.2 additions (ADR-041 §3-§6):
 *   - WHITELIST 12 → 50 entries (ADR-041 §3 L0b namespace surface enumeration)
 *   - HYBRID selector resolver (ADR-041 §4 priority ARIA → data-elab → text → CSS)
 *   - Anti-absurd validation (ADR-041 §4.2 reject >10 OR 0 OR (text only) >3)
 *   - Rate limit per session (ADR-041 §5.5 max 10 actions per minute)
 *   - Stop conditions (ADR-041 §6 max 5 consecutive UI per LLM response)
 *   - Confirmation gate (ADR-041 §5.3 destructive-like 6 actions)
 *   - Audit log placeholder (ADR-041 §5.6 Supabase wire-up DEFERRED iter 22+)
 *
 * NO DOM event execution this iter (only resolver + whitelist + rate limit +
 * audit stub) — full L0b API surface impl deferred Atom 22.1 Phase 3.
 *
 * (c) Andrea Marro 2026-04-30 — ELAB Tutor
 */

import logger from '../../utils/logger';

// ---------------------------------------------------------------------------
// §3 WHITELIST — ALLOWED_INTENT_ACTIONS 12 → 50 entries (ADR-041 §3 + §5.1)
// ---------------------------------------------------------------------------

/**
 * Whitelist of intent actions the server may request the browser to invoke.
 * Curated subset of the 62-tool registry (`scripts/openclaw/tools-registry.ts`)
 * plus L0b namespace `__ELAB_API.ui.*` 38 NEW actions per ADR-041 §3.
 *
 * Excludes destructive / sensitive ops (deleteAll, submitForm, fetchExternalUrl,
 * admin-* CRUD, manual-doc-remove, notebook-delete, teacher-class-delete, etc.)
 * per ADR-041 §5.2 FORBIDDEN_DESTRUCTIVE_ACTIONS.
 *
 * Total entries (iter 31 ralph 20 Atom 20.2): 50 (12 baseline iter 37 + 38 NEW L0b).
 */
export const ALLOWED_INTENT_ACTIONS = new Set([
  // Iter 37 baseline 12 (preserve, do NOT touch)
  'highlightComponent',
  'highlightPin',
  'clearHighlights',
  'mountExperiment',
  'getCircuitState',
  'getCircuitDescription',
  'captureScreenshot',
  'serialWrite',
  'setComponentValue',
  'connectWire',
  'clearCircuit',
  'toggleDrawing',

  // L0b NEW core mechanical primitives (ADR-041 §3.1 — 10 entries)
  'click',
  'doubleClick',
  'rightClick',
  'hover',
  'scroll',
  'type',
  'key',
  'keyDown',
  'keyUp',
  'drag',

  // L0b window + modal + navigation (ADR-041 §3.2 — 8 entries)
  'openModal',
  'closeModal',
  'minimizeWindow',
  'maximizeWindow',
  'closeWindow',
  'navigate',
  'back',
  'forward',

  // L0b modalita + lesson-paths (ADR-041 §3.3 — 7 entries)
  'toggleModalita',
  'highlightStep',
  'nextStep',
  'prevStep',
  'nextExperiment',
  'prevExperiment',
  'restartLessonPath',

  // L0b voice + TTS playback (ADR-041 §3.4 — 6 entries)
  'voicePlayback',
  'voiceSetVolume',
  'voiceSetMode',
  'startWakeWord',
  'stopWakeWord',
  'speak',

  // L0b simulator-specific (ADR-041 §3.5 — 8 entries, partial overlap iter 37 baseline)
  'zoom',
  'pan',
  'centerOn',
  'selectComponent',
  'deselectAll',
  'setSlider',
  'penTool',
  'setCode',

  // L0b lavagna + chatbot + chat (ADR-041 §3.6 — 6 entries)
  'expandChatUnlim',
  'minimizeChat',
  'closeChat',
  'switchTab',
  'toggleSidebar',
  'togglePanel',

  // L0b volumi + manuale + video + cronologia (ADR-041 §3.7 — 5 entries)
  'pageNav',
  'volumeSelect',
  'videoTabSelect',
  'cronologiaSelectSession',
  'cronologiaNewChat',
]);

/**
 * Destructive-like actions requiring voice "sì conferma" gate per ADR-041 §5.3.
 * Returns `{ needsConfirm: true }` instead of executing immediately.
 *
 * Cross-link: confirmation flow handled by caller (UNLIM TTS prompt + STT
 * listener 5s window). Dispatcher only flags the intent.
 */
export const DESTRUCTIVE_LIKE_REQUIRES_CONFIRM = new Set([
  'clearCircuit',                    // voiceCommands.js:140 (Phase 0 Finding 7)
  'navigate',                        // navigate to home/away from session
  'cronologiaSelectSession',         // switching context (loses unsaved)
  'restartLessonPath',               // exits Passo Passo modal flow
  'closeModal',                      // exits modal viewer (loses scroll position)
  'closeWindow',                     // closes floating window
]);

// ---------------------------------------------------------------------------
// §6.5 + §5.5 RATE LIMIT — per-session sliding window 10 actions / 60s
// ---------------------------------------------------------------------------

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

/** in-memory Map<sessionId, timestamps[]> per-session sliding window. */
const sessionRateLimitMap = new Map();

/**
 * Check + register an attempted dispatch under the rate limit budget.
 * Returns `{ allowed: true }` if within budget, else `{ allowed: false, reason }`.
 *
 * Uses sliding window: drops timestamps older than RATE_LIMIT_WINDOW_MS
 * before counting. Honest call ALSO appends current timestamp on allow.
 */
export function checkRateLimit(sessionId) {
  if (!sessionId || typeof sessionId !== 'string') {
    // Defensive: missing sessionId → treat as anonymous bucket (still bounded)
    sessionId = '__anon__';
  }
  const now = Date.now();
  const prior = sessionRateLimitMap.get(sessionId) || [];
  const live = prior.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (live.length >= RATE_LIMIT_MAX) {
    sessionRateLimitMap.set(sessionId, live);
    return {
      allowed: false,
      reason: `rate_limit_exceeded (${live.length}/${RATE_LIMIT_MAX} per min)`,
    };
  }
  live.push(now);
  sessionRateLimitMap.set(sessionId, live);
  return { allowed: true };
}

/** Test-only helper to reset rate-limit state between assertions. */
export function _resetRateLimit() {
  sessionRateLimitMap.clear();
}

// ---------------------------------------------------------------------------
// §6.1 STOP CONDITION — max 5 consecutive UI actions per LLM response
// ---------------------------------------------------------------------------

const MAX_CONSECUTIVE_UI_ACTIONS = 5;

/**
 * Truncate intents array to MAX_CONSECUTIVE_UI_ACTIONS per LLM response (ADR-041 §6.1).
// © Andrea Marro — 03/05/2026 — ELAB Tutor — Tutti i diritti riservati
 * Returns `{ kept, truncated, originalCount }` for telemetry.
 *
 * NOTE: counter resets on response boundary — dispatcher caller invokes
 * `executeServerIntents(intents)` once per LLM response so per-response
 * truncation is naturally bounded.
 */
export function truncateIntentsPerResponse(intents) {
  if (!Array.isArray(intents)) return { kept: [], truncated: false, originalCount: 0 };
  if (intents.length <= MAX_CONSECUTIVE_UI_ACTIONS) {
    return { kept: intents, truncated: false, originalCount: intents.length };
  }
  return {
    kept: intents.slice(0, MAX_CONSECUTIVE_UI_ACTIONS),
    truncated: true,
    originalCount: intents.length,
  };
}

// ---------------------------------------------------------------------------
// §4 HYBRID SELECTOR RESOLVER (ADR-041 §4.1 priority ARIA → data-elab → text → CSS)
// ---------------------------------------------------------------------------

/**
 * Escape an attribute value for inclusion in a CSS attribute selector. Avoids
 * injection / breakage on quoted values. Conservative: only escapes the
 * delimiter quote + backslash (CSS attr selectors don't honor full HTML
 * entity escapes).
 */
function escapeAttr(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * Anti-absurd validation thresholds (ADR-041 §4.2).
 *   - >10 elements → selector_too_broad (likely catastrophic selector)
 *   - 0 elements → selector_not_found (typo or DOM changed)
 *   - >3 for text-only intent → text_intent_ambiguous (per §4.1 priority 3 guard)
 */
const ANTI_ABSURD_MAX_TOTAL = 10;
const ANTI_ABSURD_MAX_TEXT_ONLY = 3;

/**
 * Hybrid selector resolver per ADR-041 §4.
 *
 * Resolves a `target` (string CSS selector OR UiIntent object) into a list of
 * matching DOM elements following priority order:
 *   1. ARIA — `ariaLabel` (+ optional `role` composite)
 *   2. data-elab-action / data-elab-target markers (Sense 1.5 morfismo)
 *   3. Text content (anti-ambiguity ≤3 matches via XPath normalize-space)
 *   4. CSS selector fallback
 *
 * Anti-absurd: rejects if total matches >10 OR 0 elements OR (text intent only)
 * >3 matches. Returns `{ elements, strategy, status }` with status enum:
 *   - 'ok'                       — resolved 1..10 elements (≤3 if text-only)
 *   - 'selector_not_found'       — 0 matches across all priorities
 *   - 'selector_too_broad'       — >10 matches (likely catastrophic)
 *   - 'text_intent_ambiguous'    — text intent matched 4..10 elements
 *   - 'no_target'                — target was null/undefined/empty
 *
 * Strategy enum tracks which priority matched: 'aria' | 'data-elab' | 'text' |
 * 'css' | 'none'.
 *
 * @param {string | { ariaLabel?: string, role?: string, dataElabAction?: string, dataElabTarget?: string, text?: string, cssSelector?: string }} target
 * @param {object} [opts]
 * @param {Document} [opts.doc]   Override `document` (test injection).
 * @returns {{ elements: Element[], strategy: string, status: string, matchCount: number }}
 */
export function resolveSelector(target, opts = {}) {
  const doc = opts.doc !== undefined
    ? opts.doc
    : (typeof document !== 'undefined' ? document : null);

  if (!doc) {
    return { elements: [], strategy: 'none', status: 'no_target', matchCount: 0 };
  }

  // Empty / null / undefined target
  if (!target) {
    return { elements: [], strategy: 'none', status: 'no_target', matchCount: 0 };
  }

  // String target → treat as raw CSS selector OR plain-text intent.
  // Heuristic: if it starts with `.`, `#`, `[`, or contains `>`, it's CSS.
  // Otherwise, attempt aria-label → text content → CSS as fallback chain.
  let intent = target;
  if (typeof target === 'string') {
    const trimmed = target.trim();
    if (!trimmed) {
      return { elements: [], strategy: 'none', status: 'no_target', matchCount: 0 };
    }
    // Heuristic CSS detection: leading sigil OR contains structural combinators
    const looksCss = /^[#.\[]|[>~+]|::|:\w+\(/.test(trimmed);
    if (looksCss) {
      intent = { cssSelector: trimmed };
    } else {
      // Plain string → try ariaLabel first then text content
      intent = { ariaLabel: trimmed, text: trimmed };
    }
  }

  if (!intent || typeof intent !== 'object') {
    return { elements: [], strategy: 'none', status: 'no_target', matchCount: 0 };
  }

  // Priority 1: ARIA label (most stable, semantic)
  if (intent.ariaLabel) {
    let selector = `[aria-label="${escapeAttr(intent.ariaLabel)}"]`;
    if (intent.role) {
      selector = `[role="${escapeAttr(intent.role)}"]${selector}`;
    }
    let elements = [];
    try {
      elements = Array.from(doc.querySelectorAll(selector));
    } catch (err) {
      logger.warn('[resolveSelector] aria selector threw:', err);
    }
    if (elements.length > 0) {
      const status = _statusFromMatchCount(elements.length, false);
      return {
        elements: status === 'ok' ? elements : [],
        strategy: 'aria',
        status,
        matchCount: elements.length,
      };
    }
  }

  // Priority 2: data-elab-action / data-elab-* markers (Sense 1.5 morfismo)
  if (intent.dataElabAction) {
    let selector = `[data-elab-action="${escapeAttr(intent.dataElabAction)}"]`;
    if (intent.dataElabTarget) {
      selector += `[data-elab-target="${escapeAttr(intent.dataElabTarget)}"]`;
    }
    let elements = [];
    try {
      elements = Array.from(doc.querySelectorAll(selector));
    } catch (err) {
      logger.warn('[resolveSelector] data-elab selector threw:', err);
    }
    if (elements.length > 0) {
      const status = _statusFromMatchCount(elements.length, false);
      return {
        elements: status === 'ok' ? elements : [],
        strategy: 'data-elab',
        status,
        matchCount: elements.length,
      };
    }
  }

  // Priority 3: Text content (natural language-aligned, anti-ambiguity ≤3)
  if (intent.text) {
    const elements = _resolveByText(doc, intent.text);
    if (elements.length > 0) {
      const status = _statusFromMatchCount(elements.length, true);
      return {
        elements: status === 'ok' ? elements : [],
        strategy: 'text',
        status,
        matchCount: elements.length,
      };
    }
  }

  // Priority 4: Raw CSS selector (fallback only)
  if (intent.cssSelector) {
    let elements = [];
    try {
      elements = Array.from(doc.querySelectorAll(intent.cssSelector));
    } catch (err) {
      logger.warn('[resolveSelector] css selector threw:', err);
    }
    if (elements.length > 0) {
      const status = _statusFromMatchCount(elements.length, false);
      return {
        elements: status === 'ok' ? elements : [],
        strategy: 'css',
        status,
        matchCount: elements.length,
      };
    }
  }

  return { elements: [], strategy: 'none', status: 'selector_not_found', matchCount: 0 };
}

/**
 * Resolve a text intent via XPath `normalize-space` exact match plus aria-label
 * + title attribute fallback. Caps at 10 matches for anti-absurd.
 */
function _resolveByText(doc, text) {
  const safe = String(text).replace(/"/g, '\\"');
  const xpath = `//*[normalize-space(text())="${safe}" or @aria-label="${safe}" or @title="${safe}"]`;
  const elements = [];
  try {
    if (typeof doc.evaluate !== 'function') return elements;
    const result = doc.evaluate(
      xpath,
      doc,
// © Andrea Marro — 03/05/2026 — ELAB Tutor — Tutti i diritti riservati
      null,
      // XPathResult.ORDERED_NODE_SNAPSHOT_TYPE = 7 — hardcode for env safety
      typeof XPathResult !== 'undefined' ? XPathResult.ORDERED_NODE_SNAPSHOT_TYPE : 7,
      null
    );
    const cap = Math.min(result.snapshotLength, ANTI_ABSURD_MAX_TOTAL + 1);
    for (let i = 0; i < cap; i++) {
      const node = result.snapshotItem(i);
      if (node) elements.push(node);
    }
  } catch (err) {
    logger.warn('[resolveSelector] xpath text resolve threw:', err);
  }
  return elements;
}

/**
 * Map raw match count to anti-absurd status enum (ADR-041 §4.2).
 */
function _statusFromMatchCount(count, isTextOnly) {
  if (count === 0) return 'selector_not_found';
  if (count > ANTI_ABSURD_MAX_TOTAL) return 'selector_too_broad';
  if (isTextOnly && count > ANTI_ABSURD_MAX_TEXT_ONLY) return 'text_intent_ambiguous';
  return 'ok';
}

// ---------------------------------------------------------------------------
// §5.6 AUDIT LOG PLACEHOLDER (Supabase insert wire-up DEFERRED iter 22+ Maker-1)
// ---------------------------------------------------------------------------

/**
 * Audit log helper stub for `unlim_ui_actions_log` Supabase table per ADR-041
 * §5.6. Real Supabase client wire-up DEFERRED iter 22+ (Maker-1 ownership).
 *
 * Current behavior: returns `Promise.resolve({ logged: false, reason: 'stub' })`.
 * Caller does not await for fire-and-forget pattern (audit-first invariant
 * preserves dispatch latency).
 *
 * Future contract (iter 22+):
 *   - INSERT INTO unlim_ui_actions_log (session_id, action_name,
 *     intent_payload, resolution_strategy, match_count, result_status,
 *     result_payload, error_message, latency_ms, ...)
 *   - Async fire-and-forget (no await blocking dispatcher)
 *   - Retry on transient failure (max 3 attempts exponential backoff)
 *
 * @param {string} action       The intent action name (whitelisted or not).
 * @param {*}      target       The selector / intent target (for telemetry).
 * @param {object} result       Dispatch result row { ok, status, ... }.
 * @returns {Promise<{logged: boolean, reason?: string}>}
 */
export function logUiAction(action, target, result) {
  // Stub iter 31 ralph 20 Atom 20.2 — real impl iter 22+ Maker-1.
  // Cross-ref ADR-041 §5.6 schema definition.
  if (typeof action !== 'string') {
    return Promise.resolve({ logged: false, reason: 'invalid_action' });
  }
  // Defensive: log structured payload for future integration even if stub.
  try {
    logger.info('[ui-audit-stub]', {
      action,
      targetType: typeof target,
      ok: result && result.ok === true,
      status: result && result.status,
    });
  } catch (err) {
    // Silent — audit log MUST NOT break dispatcher
  }
  return Promise.resolve({ logged: false, reason: 'stub' });
}

// ---------------------------------------------------------------------------
// EXISTING API — getIntentAction / getIntentParams / isAllowedIntent /
//                resolveIntentFn / executeServerIntents (PRESERVED)
// ---------------------------------------------------------------------------

/**
 * Extract the canonical action name from an intent record. The Edge Function
 * emits `tool` (canonical iter 36 IntentTag); legacy / alternate clients may
 * use `action`. Both are accepted to keep the contract permissive.
 */
export function getIntentAction(intent) {
  if (!intent || typeof intent !== 'object') return null;
  if (typeof intent.action === 'string') return intent.action;
  if (typeof intent.tool === 'string') return intent.tool;
  return null;
}

/**
 * Extract the parameters object from an intent record. Edge Function emits
 * `args`; legacy alternate is `params`. Returns empty object when neither
 * present (safer than null — handlers can spread without guard).
 */
export function getIntentParams(intent) {
  if (!intent || typeof intent !== 'object') return {};
  if (intent.params && typeof intent.params === 'object') return intent.params;
  if (intent.args && typeof intent.args === 'object') return intent.args;
  return {};
}

/**
 * Whitelist gate — returns true only when the intent's action is in
 * ALLOWED_INTENT_ACTIONS. Defensive on shape (null / non-object / non-string
 * action all return false).
 */
export function isAllowedIntent(intent) {
  const action = getIntentAction(intent);
  return action !== null && ALLOWED_INTENT_ACTIONS.has(action);
}

/**
 * Returns true when the intent action requires voice "sì conferma" gate per
 * ADR-041 §5.3 DESTRUCTIVE_LIKE_REQUIRES_CONFIRM.
 */
export function requiresConfirmation(intent) {
  const action = getIntentAction(intent);
  return action !== null && DESTRUCTIVE_LIKE_REQUIRES_CONFIRM.has(action);
}

/**
 * Resolve the dispatch function on a __ELAB_API surface. Tries `api.unlim[action]`
 * first (highlight* family per CLAUDE.md API contract), falls back to
 * `api[action]` (top-level handlers like `mountExperiment`, `captureScreenshot`).
 * Also tries `api.ui[action]` for L0b namespace (ADR-041 §3 surface).
 * Returns null when neither path resolves to a function.
 */
export function resolveIntentFn(api, action) {
  if (!api || typeof action !== 'string') return null;
  if (api.unlim && typeof api.unlim[action] === 'function') return api.unlim[action];
  if (api.ui && typeof api.ui[action] === 'function') return api.ui[action];
  if (typeof api[action] === 'function') return api[action];
  return null;
}

/**
 * Dispatch server-parsed intents to the browser __ELAB_API with whitelist gate
 * + error isolation + iter 20.2 NEW: rate limit + truncation + confirmation gate.
 *
 * Per-intent outcomes:
 *   { ok: true, action, result }                     — handler invoked successfully
 *   { ok: false, action, error: 'not_whitelisted' }  — action not in whitelist
 *   { ok: false, action, error: 'api_unavailable' }  — __ELAB_API absent
 *   { ok: false, action, error: 'fn_not_found' }     — handler missing on api
 *   { ok: false, action, error: 'rate_limit_exceeded', detail } — §5.5 budget exhausted
 *   { ok: false, action, error: 'truncated_max_consecutive', detail } — §6.1 cap
 *   { ok: false, action, needsConfirm: true }        — §5.3 destructive-like gate
 *   { ok: false, action, error: '<message>' }        — handler threw
 *
 * @param {Array<{tool?: string, action?: string, args?: object, params?: object}>} intents
 * @param {object} [opts]
 * @param {object} [opts.api]        Override the __ELAB_API resolution (used by tests).
 * @param {string} [opts.sessionId]  Session identifier for rate-limit bucket.
 * @returns {Promise<Array<{ok: boolean, action: string|null, result?: any, error?: string, needsConfirm?: boolean}>>}
 */
export async function executeServerIntents(intents, opts = {}) {
  if (!Array.isArray(intents) || intents.length === 0) return [];

  const api = opts.api !== undefined
    ? opts.api
    : (typeof window !== 'undefined' ? window.__ELAB_API : null);
  const sessionId = typeof opts.sessionId === 'string' && opts.sessionId
    ? opts.sessionId
    : '__anon__';

  // §6.1 STOP CONDITION — truncate to MAX_CONSECUTIVE_UI_ACTIONS per response.
  const { kept, truncated, originalCount } = truncateIntentsPerResponse(intents);
  const results = [];

  if (truncated) {
    logger.warn(
      '[intentsDispatcher] truncated_max_consecutive',
      `${originalCount} → ${MAX_CONSECUTIVE_UI_ACTIONS}`
    );
  }

  for (const intent of kept) {
    const action = getIntentAction(intent);

    if (!isAllowedIntent(intent)) {
      logger.warn('[intentsDispatcher] action not whitelisted, skipped:', action);
      const row = { ok: false, action, error: 'not_whitelisted' };
      results.push(row);
      logUiAction(action || 'unknown', intent, { ok: false, status: 'not_in_whitelist' });
      continue;
    }

    // §5.3 CONFIRMATION GATE — destructive-like require "sì conferma" voice.
    if (requiresConfirmation(intent)) {
      const row = { ok: false, action, needsConfirm: true, error: 'confirm_required' };
      results.push(row);
      logUiAction(action, intent, { ok: false, status: 'confirm_required' });
      continue;
    }

    // §5.5 RATE LIMIT — per-session sliding window 10 actions / 60s.
    const rate = checkRateLimit(sessionId);
    if (!rate.allowed) {
      logger.warn('[intentsDispatcher] rate_limit_exceeded:', sessionId, rate.reason);
      const row = { ok: false, action, error: 'rate_limit_exceeded', detail: rate.reason };
      results.push(row);
      logUiAction(action, intent, { ok: false, status: 'rate_limit_exceeded' });
// © Andrea Marro — 03/05/2026 — ELAB Tutor — Tutti i diritti riservati
      continue;
    }

    if (!api) {
      const row = { ok: false, action, error: 'api_unavailable' };
      results.push(row);
      logUiAction(action, intent, { ok: false, status: 'dispatch_throw' });
      continue;
    }

    const fn = resolveIntentFn(api, action);
    if (!fn) {
      const row = { ok: false, action, error: 'fn_not_found' };
      results.push(row);
      logUiAction(action, intent, { ok: false, status: 'dispatch_throw' });
      continue;
    }

    try {
      const params = getIntentParams(intent);
      const result = await Promise.resolve(fn(params));
      const row = { ok: true, action, result };
      results.push(row);
      logUiAction(action, intent, { ok: true, status: 'ok' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.warn('[intentsDispatcher] dispatch failed:', action, msg);
      const row = { ok: false, action, error: msg };
      results.push(row);
      logUiAction(action, intent, { ok: false, status: 'dispatch_throw' });
    }
  }

  // Append truncation marker as final result row (telemetry, not blocking).
  if (truncated) {
    results.push({
      ok: false,
      action: null,
      error: 'truncated_max_consecutive',
      detail: `${originalCount} intents → ${MAX_CONSECUTIVE_UI_ACTIONS} kept`,
    });
  }

  return results;
}

export const INTENTS_DISPATCHER_VERSION = '2.0-iter37-baseline+iter31-ralph20-atom20.2';
