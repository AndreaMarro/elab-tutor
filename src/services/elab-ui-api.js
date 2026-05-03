/**
 * elab-ui-api — L0b namespace `__ELAB_API.ui.*` per ADR-041 §3 + §12 Implementation block.
 * iter 31 ralph 22 Phase 3 Atom 22.1 — Maker-1 ownership.
 *
 * NEW namespace SEPARATO from `__ELAB_API.unlim.*` (ADR-041 §2.1 decision rationale).
 * 38 NEW UI methods (10 + 8 + 7 + 6 + 4 + 3 = 38) coprire categorie:
 *   §3.1 Mouse + keyboard primitives (10): click + doubleClick + rightClick + hover +
 *        scroll + type + key + keyDown + keyUp + drag
 *   §3.2 Window + modal + navigation (8): openModal + closeModal + minimizeWindow +
 *        maximizeWindow + closeWindow + navigate + back + forward
 *   §3.3 Modalita + lesson-paths (7): toggleModalita + highlightStep + nextStep +
 *        prevStep + nextExperiment + prevExperiment + restartLessonPath
 *   §3.4 Voice + TTS playback (6): voicePlayback + voiceSetVolume + voiceSetMode +
 *        startWakeWord + stopWakeWord + speak
 *   §3.5 Simulator-specific (4): zoom + pan + centerOn + selectComponent
 *   §3.6 Lavagna + chat (3): expandChatUnlim + switchTab + togglePanel
 *
 * HYBRID selector resolver (ADR-041 §4 priority ARIA → data-elab → text → CSS) shared
 * with `intentsDispatcher.js` via re-import.
 *
 * Anti-absurd: rejects >10 OR 0 OR (text-only) >3 matches per §4.2.
 * Rate limit: shared sliding window per §5.5 (delegated to dispatcher).
 * Audit log: stub via logUiAction per §5.6 (Supabase wire-up DEFERRED iter 22+).
 *
 * `getState()` returns UIStateSnapshot (route, mode, focused, modals[], modalita,
 * lesson_path_step, opened_panels[]) per ADR-042 §3 with TTL 30s in-isolate cache.
 *
 * NO L0b namespace LIVE prod claim — impl only iter 22, canary deploy iter 28-29.
 *
 * (c) Andrea Marro 2026-05-03 — ELAB Tutor — Tutti i diritti riservati
 */

import logger from '../utils/logger';
import { resolveSelector, logUiAction } from '../components/lavagna/intentsDispatcher';

// ---------------------------------------------------------------------------
// Defensive helpers — browser-only guards per ADR-041 §3 surface contract
// ---------------------------------------------------------------------------

const HAS_WINDOW = typeof window !== 'undefined';
const HAS_DOCUMENT = typeof document !== 'undefined';

/**
 * Build a canonical DispatchResult object per ADR-041 §3 contract.
 *
 * Shape: `{ success, target, action, result?, error?, status? }`
 *
 * @param {boolean} success
 * @param {*}       target  Selector / intent target (echo for telemetry).
 * @param {string}  action  L0b method name (echo for audit log).
 * @param {object}  [extra] Optional additional fields (result, error, status).
 * @returns {{ success: boolean, target: any, action: string, result?: any, error?: string, status?: string }}
 */
function makeResult(success, target, action, extra = {}) {
  const row = { success: !!success, target, action };
  if (extra.result !== undefined) row.result = extra.result;
  if (extra.error !== undefined) row.error = extra.error;
  if (extra.status !== undefined) row.status = extra.status;
  return row;
}

/**
 * Run an L0b operation with shared try/catch + audit log helper.
 *
 * Caveats: audit log is fire-and-forget (does NOT await Supabase). Failure
 * inside the action is caught + reported as `success: false` with `error`
 * field, ensuring the dispatcher caller never sees an unhandled throw.
 */
async function runUi(action, target, body) {
  try {
    const result = await body();
    const row = makeResult(true, target, action, { result, status: 'ok' });
    try { logUiAction(action, target, { ok: true, status: 'ok' }); } catch { /* silent */ }
    return row;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(`[elab-ui-api] ${action} threw:`, msg);
    const row = makeResult(false, target, action, { error: msg, status: 'dispatch_throw' });
    try { logUiAction(action, target, { ok: false, status: 'dispatch_throw' }); } catch { /* silent */ }
    return row;
  }
}

/**
 * Resolve a target via HYBRID selector + return first match OR null with status.
 *
 * Wraps `resolveSelector` from intentsDispatcher with anti-absurd rejection
 * pre-checked. Caller dispatches DOM event ONLY on `ok` status.
 */
function resolveOne(target) {
  if (!HAS_DOCUMENT) {
    return { element: null, status: 'no_target', strategy: 'none', matchCount: 0 };
  }
  const res = resolveSelector(target);
  return {
    element: res.elements && res.elements[0] ? res.elements[0] : null,
    status: res.status,
    strategy: res.strategy,
    matchCount: res.matchCount,
  };
}

/**
 * Dispatch a DOM MouseEvent on a resolved element.
 *
 * @param {Element} el    Target DOM element (must not be null).
 * @param {string}  type  Event type ('click' | 'dblclick' | 'contextmenu' | 'mouseover' etc).
 * @param {object}  [opts] Optional MouseEventInit overrides (button, clientX/Y).
 */
function dispatchMouseEvent(el, type, opts = {}) {
  if (!el || !HAS_WINDOW) return false;
  const init = {
    bubbles: true,
    cancelable: true,
    view: window,
    button: 0,
    ...opts,
  };
  try {
    const ev = new MouseEvent(type, init);
    el.dispatchEvent(ev);
    return true;
  } catch (err) {
    logger.warn('[elab-ui-api] dispatchMouseEvent threw:', err);
    return false;
  }
}

/**
 * Dispatch a DOM KeyboardEvent on a target element (or document.activeElement).
 *
 * @param {Element|null} el    Target element (defaults to active element).
 * @param {string}       type  'keydown' | 'keyup' | 'keypress'.
 * @param {string}       key   Key value (e.g. 'Enter', 'Escape', 'a').
 * @param {object}       [mods] Optional modifier flags (ctrl, shift, alt, meta).
 */
function dispatchKeyboardEvent(el, type, key, mods = {}) {
  if (!HAS_WINDOW) return false;
  const target = el || (HAS_DOCUMENT ? document.activeElement : null) || null;
  if (!target) return false;
  try {
    const init = {
      bubbles: true,
      cancelable: true,
      key,
      code: key,
      ctrlKey: !!mods.ctrl || !!mods.ctrlKey,
      shiftKey: !!mods.shift || !!mods.shiftKey,
      altKey: !!mods.alt || !!mods.altKey,
      metaKey: !!mods.meta || !!mods.metaKey,
    };
    const ev = new KeyboardEvent(type, init);
    target.dispatchEvent(ev);
    return true;
  } catch (err) {
    logger.warn('[elab-ui-api] dispatchKeyboardEvent threw:', err);
    return false;
  }
}

/**
 * Parse a key combo string like "ctrl+z" or "shift+Enter" into key + modifiers.
 *
 * @param {string} combo
 * @returns {{ key: string, mods: { ctrl: boolean, shift: boolean, alt: boolean, meta: boolean } }}
 */
function parseKeyCombo(combo) {
  if (typeof combo !== 'string') return { key: '', mods: {} };
  const parts = combo.split('+').map(s => s.trim()).filter(Boolean);
  const mods = { ctrl: false, shift: false, alt: false, meta: false };
  let key = '';
  for (const p of parts) {
    const lower = p.toLowerCase();
    if (lower === 'ctrl' || lower === 'control') mods.ctrl = true;
    else if (lower === 'shift') mods.shift = true;
    else if (lower === 'alt' || lower === 'option') mods.alt = true;
    else if (lower === 'meta' || lower === 'cmd' || lower === 'command') mods.meta = true;
    else key = p;
  }
  return { key, mods };
}

// ---------------------------------------------------------------------------
// L0b getState() — UIStateSnapshot per ADR-042 §3 with TTL 30s in-isolate cache
// ---------------------------------------------------------------------------

const STATE_CACHE_TTL_MS = 30_000;
let _stateCache = null;
let _stateCacheAt = 0;

/**
 * Build a fresh UIStateSnapshot per ADR-042 §3 fields:
 *   - route             — current hash route (window.location.hash)
 *   - mode              — current mode (lavagna | tutor | dashboard | chatbot-only | etc.)
 *   - focused           — document.activeElement summary
 *   - modals[]          — open modal titles / selectors discovered via [role="dialog"]
 *   - modalita          — lavagna modalita value (percorso | libero | gia-montato | esperimento)
 *   - lesson_path_step  — current step index (best-effort from data-elab markers)
 *   - opened_panels[]   — visible RetractablePanel / FloatingWindow titles
 *
 * Caveats:
 *   - Snapshot best-effort: missing markers return null (not failure)
 *   - Cache TTL 30s — invalidated lazily on next `getState()` call after expiry
 *   - localStorage read for `elab-modalita` (if present) preserves source-of-truth
 */
function buildStateSnapshot() {
  if (!HAS_DOCUMENT || !HAS_WINDOW) {
    return {
      route: null,
      mode: null,
      focused: null,
      modals: [],
      modalita: null,
      lesson_path_step: null,
      opened_panels: [],
    };
  }

  // route — hash routing per CLAUDE.md "no react-router"
  const hash = window.location.hash || '';
  const route = hash.replace(/^#/, '') || 'home';

  // mode — derive from hash heuristic (lavagna | tutor | chatbot-only | dashboard | etc.)
  let mode = null;
  if (route === 'lavagna' || route.startsWith('lavagna')) mode = 'lavagna';
  else if (route === 'tutor' || route.startsWith('tutor')) mode = 'tutor';
  else if (route === 'dashboard') mode = 'dashboard';
  else if (route === 'chatbot-only') mode = 'chatbot-only';
  else if (route === 'about-easter') mode = 'easter';
  else if (route === 'admin') mode = 'admin';
  else mode = route || 'home';

  // focused — active element summary (tag + aria-label + id, no input.value PII)
  let focused = null;
  try {
    const ae = document.activeElement;
    if (ae && ae !== document.body) {
      focused = {
        tag: ae.tagName ? ae.tagName.toLowerCase() : null,
        id: ae.id || null,
        ariaLabel: ae.getAttribute('aria-label') || null,
        dataElabAction: ae.getAttribute('data-elab-action') || null,
      };
    }
  } catch { /* silent */ }

  // modals[] — discover via [role="dialog"] + .elab-modal class fallback
  const modals = [];
  try {
    const dialogs = document.querySelectorAll('[role="dialog"], [role="alertdialog"]');
    for (const d of dialogs) {
      modals.push({
        title: d.getAttribute('aria-label') || d.getAttribute('aria-labelledby') || null,
        modal: d.getAttribute('aria-modal') === 'true',
      });
    }
  } catch { /* silent */ }

  // modalita — read localStorage `elab-modalita` (canonical source per LavagnaShell)
  let modalita = null;
  try {
    if (typeof window.localStorage !== 'undefined') {
      modalita = window.localStorage.getItem('elab-modalita') || null;
    }
  } catch { /* silent — Safari private mode */ }

  // lesson_path_step — best-effort from data-elab-step markers (may be null)
  let lesson_path_step = null;
  try {
    const stepEl = document.querySelector('[data-elab-current-step]');
    if (stepEl) {
      const v = stepEl.getAttribute('data-elab-current-step');
      const n = Number.parseInt(v, 10);
      if (Number.isFinite(n)) lesson_path_step = n;
    }
  } catch { /* silent */ }

  // opened_panels[] — visible RetractablePanel + FloatingWindow titles
  const opened_panels = [];
  try {
    const panels = document.querySelectorAll(
      '.elab-floating-window, .retractable-panel:not(.collapsed), [data-elab-panel-open="true"]'
    );
    for (const p of panels) {
      const title = p.getAttribute('aria-label')
        || p.getAttribute('data-elab-panel-title')
        || (p.querySelector('.panel-title, .window-title')?.textContent?.trim() || null);
      if (title) opened_panels.push(title);
    }
  } catch { /* silent */ }

  return {
    route,
    mode,
    focused,
    modals,
    modalita,
    lesson_path_step,
    opened_panels,
  };
}

/**
 * Public `getState()` per ADR-042 §3 with 30s TTL cache (§8.1).
 * Returns UIStateSnapshot frozen object (defensive against caller mutation).
 */
function getState() {
  const now = Date.now();
  if (_stateCache && (now - _stateCacheAt) < STATE_CACHE_TTL_MS) {
    return _stateCache;
  }
  _stateCache = buildStateSnapshot();
  _stateCacheAt = now;
  try { return Object.freeze(_stateCache); } catch { return _stateCache; }
}

/** Test-only helper — invalidate the in-isolate cache between assertions. */
function _invalidateStateCache() {
  _stateCache = null;
  _stateCacheAt = 0;
}

// ---------------------------------------------------------------------------
// Factory — createUiApi() returns L0b namespace object (38 methods + getState)
// ---------------------------------------------------------------------------

/**
 * Create the L0b namespace `__ELAB_API.ui.*` per ADR-041 §3 + §12.
 *
 * Returns an object with 38 NEW methods + `getState()` + `version` + `_invalidateStateCache`
 * (test-only). Each method returns `Promise<DispatchResult>`.
 *
 * Caveats critical:
 *   - DOM event accuracy: synthetic MouseEvent / KeyboardEvent dispatches may not
 *     trigger React onClick handlers in all cases (React uses synthetic event
 *     pooling) — tested with native handlers + React 19 SyntheticEvent shim.
 *   - Browser-only guards: every method short-circuits when HAS_WINDOW or
 *     HAS_DOCUMENT is false (returns { success: false, error: 'no_browser_env' }).
 *   - Voice API gaps: Web Speech API + custom voiceService not always available;
 *     graceful degrade with `voice_api_unavailable` status.
 *   - Canvas zoom/pan complexity: simulator-specific zoom/pan/centerOn delegate
 *     to existing `__ELAB_API.unlim.*` OR no-op with `unlim_api_unavailable` status.
 *   - L0b namespace impl ONLY iter 22 — canary deploy iter 28-29 per ADR-041 §8.
 */
export function createUiApi() {
  return {
    version: '0.1.0-iter31-ralph22-atom22.1',
    info: {
      name: 'ELAB UI API — L0b namespace',
      author: 'Andrea Marro',
      adr: 'ADR-041 §3 + §12 Implementation block',
      methods: 38,
      status: 'PROPOSED — NOT canary deployed',
    },

    // ---------------------------------------------------------------
    // §3.1 Mouse + keyboard primitives (10 methods)
    // ---------------------------------------------------------------

    /**
     * Synthesize a click on the resolved element (HYBRID selector).
     * @param {string|object} target
     */
    async click(target) {
      return runUi('click', target, async () => {
        if (!HAS_DOCUMENT) throw new Error('no_browser_env');
        const { element, status, strategy, matchCount } = resolveOne(target);
        if (!element) {
          throw new Error(`resolve_failed:${status}:${strategy}:${matchCount}`);
        }
        const dispatched = dispatchMouseEvent(element, 'click');
        return { dispatched, strategy, matchCount };
      });
    },

    /** Synthesize a double-click on the resolved element. */
    async doubleClick(target) {
      return runUi('doubleClick', target, async () => {
        if (!HAS_DOCUMENT) throw new Error('no_browser_env');
        const { element, status, strategy, matchCount } = resolveOne(target);
        if (!element) throw new Error(`resolve_failed:${status}:${strategy}:${matchCount}`);
        // Double-click = click + click + dblclick (browser canonical sequence)
        dispatchMouseEvent(element, 'click');
        dispatchMouseEvent(element, 'click', { detail: 2 });
        const dispatched = dispatchMouseEvent(element, 'dblclick', { detail: 2 });
        return { dispatched, strategy, matchCount };
      });
    },

    /** Synthesize a right-click (button: 2 + contextmenu event). */
    async rightClick(target) {
      return runUi('rightClick', target, async () => {
        if (!HAS_DOCUMENT) throw new Error('no_browser_env');
        const { element, status, strategy, matchCount } = resolveOne(target);
        if (!element) throw new Error(`resolve_failed:${status}:${strategy}:${matchCount}`);
        const dispatched = dispatchMouseEvent(element, 'contextmenu', { button: 2 });
        return { dispatched, strategy, matchCount };
      });
    },

    /** Synthesize a hover (mouseenter + mouseover). */
    async hover(target) {
      return runUi('hover', target, async () => {
        if (!HAS_DOCUMENT) throw new Error('no_browser_env');
        const { element, status, strategy, matchCount } = resolveOne(target);
        if (!element) throw new Error(`resolve_failed:${status}:${strategy}:${matchCount}`);
        dispatchMouseEvent(element, 'mouseenter');
        const dispatched = dispatchMouseEvent(element, 'mouseover');
        return { dispatched, strategy, matchCount };
      });
    },

    /**
     * Scroll target (or window if null) by direction + amount.
     * @param {string|object|null} target  Element to scroll, null = window scroll.
     * @param {string} direction           'up' | 'down' | 'left' | 'right'
     * @param {number} [amount]            Pixels to scroll (default 100)
     */
    async scroll(target, direction, amount) {
      return runUi('scroll', target, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        const px = typeof amount === 'number' && amount > 0 ? amount : 100;
        let dx = 0, dy = 0;
        if (direction === 'up') dy = -px;
        else if (direction === 'down') dy = px;
        else if (direction === 'left') dx = -px;
        else if (direction === 'right') dx = px;

        if (!target) {
          window.scrollBy({ top: dy, left: dx, behavior: 'smooth' });
          return { scrolled: true, scope: 'window', dx, dy };
        }
        const { element, status, strategy, matchCount } = resolveOne(target);
        if (!element) throw new Error(`resolve_failed:${status}:${strategy}:${matchCount}`);
        if (typeof element.scrollBy === 'function') {
          element.scrollBy({ top: dy, left: dx, behavior: 'smooth' });
        } else {
          element.scrollTop += dy;
          element.scrollLeft += dx;
        }
        return { scrolled: true, scope: 'element', strategy, matchCount, dx, dy };
      });
    },

    /**
     * Type text into the resolved element OR document.activeElement.
     * Sets `value` on input/textarea + dispatches `input` event for React handlers.
     * @param {string|object|null} target  null → use document.activeElement
     * @param {string} text
     */
    async type(target, text) {
      return runUi('type', target, async () => {
        if (!HAS_DOCUMENT) throw new Error('no_browser_env');
        if (typeof text !== 'string') throw new Error('invalid_text');
        let el = null;
        if (target) {
          const { element, status, strategy, matchCount } = resolveOne(target);
          if (!element) throw new Error(`resolve_failed:${status}:${strategy}:${matchCount}`);
          el = element;
        } else {
          el = document.activeElement;
        }
        if (!el) throw new Error('no_focused_element');

        // PII guard per ADR-041 §5.4 — block password / cc-number / ssn fields
        const ttype = (el.getAttribute && el.getAttribute('type')) || '';
        const autocomp = (el.getAttribute && el.getAttribute('autocomplete')) || '';
        if (ttype === 'password'
            || autocomp === 'cc-number' || autocomp === 'cc-csc' || autocomp === 'ssn') {
          throw new Error('pii_blocked');
        }

        // Native setter so React onChange picks it up
        if ('value' in el) {
          const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
          const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
          if (setter) setter.call(el, text);
          else el.value = text;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        } else if (el.isContentEditable) {
          el.textContent = text;
          el.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          throw new Error('not_typable_element');
        }
        return { typed: true, length: text.length };
      });
    },

    /**
     * Press a key combo (e.g. "Enter", "ctrl+z", "shift+Tab").
     * Dispatches keydown + keyup on document.activeElement.
     * @param {string} combo
     */
    async key(combo) {
      return runUi('key', combo, async () => {
        if (!HAS_DOCUMENT) throw new Error('no_browser_env');
        const { key, mods } = parseKeyCombo(combo);
        if (!key) throw new Error('invalid_key_combo');
        dispatchKeyboardEvent(null, 'keydown', key, mods);
        dispatchKeyboardEvent(null, 'keyup', key, mods);
        return { pressed: true, key, mods };
      });
    },

    /** Dispatch a single keydown (no auto-keyup). */
    async keyDown(key) {
      return runUi('keyDown', key, async () => {
        if (!HAS_DOCUMENT) throw new Error('no_browser_env');
        if (typeof key !== 'string' || !key) throw new Error('invalid_key');
        dispatchKeyboardEvent(null, 'keydown', key, {});
        return { dispatched: true };
      });
    },

    /** Dispatch a single keyup (no auto-keydown). */
    async keyUp(key) {
      return runUi('keyUp', key, async () => {
        if (!HAS_DOCUMENT) throw new Error('no_browser_env');
        if (typeof key !== 'string' || !key) throw new Error('invalid_key');
        dispatchKeyboardEvent(null, 'keyup', key, {});
        return { dispatched: true };
      });
    },

    /**
     * Drag from source element to target element via pointer event sequence.
     * Caveat: HTML5 drag-and-drop API (dataTransfer) NOT fully simulated;
     * fires mousedown + mousemove + mouseup which works for custom drag handlers
     * (e.g. SimulatorCanvas component drag) but NOT native `<input type="file">`.
     */
    async drag(fromTarget, toTarget) {
      return runUi('drag', { from: fromTarget, to: toTarget }, async () => {
        if (!HAS_DOCUMENT) throw new Error('no_browser_env');
        const from = resolveOne(fromTarget);
        const to = resolveOne(toTarget);
        if (!from.element) throw new Error(`resolve_failed_from:${from.status}`);
        if (!to.element) throw new Error(`resolve_failed_to:${to.status}`);

        const fromRect = typeof from.element.getBoundingClientRect === 'function'
          ? from.element.getBoundingClientRect() : { x: 0, y: 0, width: 0, height: 0 };
        const toRect = typeof to.element.getBoundingClientRect === 'function'
          ? to.element.getBoundingClientRect() : { x: 0, y: 0, width: 0, height: 0 };

        const fx = fromRect.x + fromRect.width / 2;
        const fy = fromRect.y + fromRect.height / 2;
        const tx = toRect.x + toRect.width / 2;
        const ty = toRect.y + toRect.height / 2;

        dispatchMouseEvent(from.element, 'mousedown', { clientX: fx, clientY: fy });
        dispatchMouseEvent(to.element, 'mousemove', { clientX: tx, clientY: ty });
        dispatchMouseEvent(to.element, 'mouseup', { clientX: tx, clientY: ty });
        return { dragged: true, fromStrategy: from.strategy, toStrategy: to.strategy };
      });
    },

    // ---------------------------------------------------------------
    // §3.2 Window + modal + navigation (8 methods)
    // ---------------------------------------------------------------

    /**
     * Open a modal by name (dispatches `elab-open-modal` window event).
     * Modal listener is responsibility of `LavagnaShell` / page component.
     */
    async openModal(name) {
      return runUi('openModal', name, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        if (typeof name !== 'string' || !name) throw new Error('invalid_modal_name');
        window.dispatchEvent(new CustomEvent('elab-open-modal', { detail: { name } }));
        return { dispatched: true, name };
      });
    },

    /**
     * Close a modal by name (dispatches `elab-close-modal` window event).
     * Falls back to dispatching Escape keydown on document if no listener.
     */
    async closeModal(name) {
      return runUi('closeModal', name, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        window.dispatchEvent(new CustomEvent('elab-close-modal', { detail: { name } }));
        // Fallback: Escape key for native dialog elements
        dispatchKeyboardEvent(null, 'keydown', 'Escape', {});
        return { dispatched: true, name };
      });
    },

    /**
     * Minimize a FloatingWindow by title (looks up `[data-elab-window-title="<title>"]`
     * + dispatches click on `.window-minimize-btn` child).
     */
    async minimizeWindow(target) {
      return runUi('minimizeWindow', target, async () => {
        if (!HAS_DOCUMENT) throw new Error('no_browser_env');
        const intent = typeof target === 'string'
          ? { dataElabAction: 'minimize-window', dataElabTarget: target }
          : target;
        const { element, status, strategy, matchCount } = resolveOne(intent);
        if (!element) throw new Error(`resolve_failed:${status}:${strategy}:${matchCount}`);
        dispatchMouseEvent(element, 'click');
        return { dispatched: true, strategy, matchCount };
      });
    },

    /** Maximize a FloatingWindow (mirror minimize). */
    async maximizeWindow(target) {
      return runUi('maximizeWindow', target, async () => {
        if (!HAS_DOCUMENT) throw new Error('no_browser_env');
        const intent = typeof target === 'string'
          ? { dataElabAction: 'maximize-window', dataElabTarget: target }
          : target;
        const { element, status, strategy, matchCount } = resolveOne(intent);
        if (!element) throw new Error(`resolve_failed:${status}:${strategy}:${matchCount}`);
        dispatchMouseEvent(element, 'click');
        return { dispatched: true, strategy, matchCount };
      });
    },

    /** Close a FloatingWindow (mirror minimize). */
    async closeWindow(target) {
      return runUi('closeWindow', target, async () => {
        if (!HAS_DOCUMENT) throw new Error('no_browser_env');
        const intent = typeof target === 'string'
          ? { dataElabAction: 'close-window', dataElabTarget: target }
          : target;
        const { element, status, strategy, matchCount } = resolveOne(intent);
        if (!element) throw new Error(`resolve_failed:${status}:${strategy}:${matchCount}`);
        dispatchMouseEvent(element, 'click');
        return { dispatched: true, strategy, matchCount };
      });
    },

    /**
     * Navigate to a hash route (e.g. 'lavagna', 'tutor', 'chatbot-only').
     * Per CLAUDE.md "no react-router — routing custom con useState e hash".
     * Caveat: App.jsx VALID_HASHES whitelist validation expected upstream
     * (Phase 0 Finding 8 — iter 22 unify mandatory NOT this atom).
     */
    async navigate(route) {
      return runUi('navigate', route, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        if (typeof route !== 'string') throw new Error('invalid_route');
        const clean = route.replace(/^#/, '');
        window.location.hash = `#${clean}`;
        // Invalidate state cache since route changed
        _invalidateStateCache();
        return { navigated: true, route: clean };
      });
    },

    /** Browser history.back(). */
    async back() {
      return runUi('back', null, async () => {
        if (!HAS_WINDOW || !window.history) throw new Error('no_browser_env');
        window.history.back();
        _invalidateStateCache();
        return { navigated: true, direction: 'back' };
      });
    },

    /** Browser history.forward(). */
    async forward() {
      return runUi('forward', null, async () => {
        if (!HAS_WINDOW || !window.history) throw new Error('no_browser_env');
        window.history.forward();
        _invalidateStateCache();
        return { navigated: true, direction: 'forward' };
      });
    },

    // ---------------------------------------------------------------
    // §3.3 Modalita + lesson-paths (7 methods)
    // ---------------------------------------------------------------

    /**
     * Toggle lavagna modalita (canonical 4 per ADR-025).
     * Writes localStorage key `elab-modalita` + dispatches `elab-modalita-change`
     * event for LavagnaShell listener.
     * @param {'percorso'|'libero'|'gia-montato'|'esperimento'} modalita
     */
    async toggleModalita(modalita) {
      return runUi('toggleModalita', modalita, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        const valid = new Set(['percorso', 'libero', 'gia-montato', 'esperimento']);
        if (!valid.has(modalita)) throw new Error(`invalid_modalita:${modalita}`);
        try {
          window.localStorage.setItem('elab-modalita', modalita);
        } catch { /* silent — Safari private mode */ }
        window.dispatchEvent(new CustomEvent('elab-modalita-change', { detail: { modalita } }));
        _invalidateStateCache();
        return { switched: true, modalita };
      });
    },

    /**
     * Highlight a Passo Passo step by index (dispatches event for LavagnaShell).
     * @param {number} index 0-based step index
     */
    async highlightStep(index) {
      return runUi('highlightStep', index, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        if (typeof index !== 'number' || !Number.isFinite(index) || index < 0) {
          throw new Error('invalid_step_index');
        }
        window.dispatchEvent(new CustomEvent('elab-highlight-step', { detail: { index } }));
        return { dispatched: true, index };
      });
    },

    /** Advance to next Passo Passo step (delegates to existing __ELAB_API.nextStep). */
    async nextStep() {
      return runUi('nextStep', null, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        const api = window.__ELAB_API;
        if (api && typeof api.nextStep === 'function') {
          api.nextStep();
          return { advanced: true, via: 'unlim_api' };
        }
        window.dispatchEvent(new CustomEvent('elab-next-step'));
        return { advanced: true, via: 'event' };
      });
    },

    /** Go back to previous Passo Passo step. */
    async prevStep() {
      return runUi('prevStep', null, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        const api = window.__ELAB_API;
        if (api && typeof api.prevStep === 'function') {
          api.prevStep();
          return { reverted: true, via: 'unlim_api' };
        }
        window.dispatchEvent(new CustomEvent('elab-prev-step'));
        return { reverted: true, via: 'event' };
      });
    },

    /** Move to next experiment in current lesson path (event-stub). */
    async nextExperiment() {
      return runUi('nextExperiment', null, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        window.dispatchEvent(new CustomEvent('elab-next-experiment'));
        return { dispatched: true };
      });
    },

    /** Move to previous experiment (event-stub). */
    async prevExperiment() {
      return runUi('prevExperiment', null, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        window.dispatchEvent(new CustomEvent('elab-prev-experiment'));
        return { dispatched: true };
      });
    },

    /** Restart current lesson path from step 0 (event-stub). */
    async restartLessonPath() {
      return runUi('restartLessonPath', null, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        window.dispatchEvent(new CustomEvent('elab-restart-lesson-path'));
        return { dispatched: true };
      });
    },

    // ---------------------------------------------------------------
    // §3.4 Voice + TTS playback (6 methods)
    // ---------------------------------------------------------------

    /**
     * Voice playback control (play | pause | skip | replay | stop).
     * Dispatches `elab-voice-playback` event for voiceService listener.
     * Caveat: graceful degrade to event-stub when voiceService not present.
     */
    async voicePlayback(action) {
      return runUi('voicePlayback', action, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        const valid = new Set(['play', 'pause', 'skip', 'replay', 'stop']);
        if (!valid.has(action)) throw new Error(`invalid_voice_action:${action}`);
        window.dispatchEvent(new CustomEvent('elab-voice-playback', { detail: { action } }));
        return { dispatched: true, action };
      });
    },

    /**
     * Set voice volume (0..1 fractional).
     * Caveat: actual TTS volume control requires voiceService wire-up.
     */
    async voiceSetVolume(percent) {
      return runUi('voiceSetVolume', percent, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        if (typeof percent !== 'number' || percent < 0 || percent > 1) {
          throw new Error('invalid_volume_range');
        }
        window.dispatchEvent(new CustomEvent('elab-voice-volume', { detail: { percent } }));
        return { dispatched: true, percent };
      });
    },

    /**
     * Set voice mode ('always' = always-on STT | 'ptt' = push-to-talk).
     * Caveat: mode change requires wakeWord service re-init.
     */
    async voiceSetMode(mode) {
      return runUi('voiceSetMode', mode, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        if (mode !== 'always' && mode !== 'ptt') throw new Error('invalid_voice_mode');
        window.dispatchEvent(new CustomEvent('elab-voice-mode', { detail: { mode } }));
        return { dispatched: true, mode };
      });
    },

    /** Start wake word listener ("Ehi UNLIM"). Event-stub for wakeWord service. */
    async startWakeWord() {
      return runUi('startWakeWord', null, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        window.dispatchEvent(new CustomEvent('elab-wake-word-start'));
        return { dispatched: true };
      });
    },

    /** Stop wake word listener. */
    async stopWakeWord() {
      return runUi('stopWakeWord', null, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        window.dispatchEvent(new CustomEvent('elab-wake-word-stop'));
        return { dispatched: true };
      });
    },

    /**
     * Speak text via TTS (delegates to __ELAB_API.unlim.speakTTS if available).
     * Caveat: voice clone Andrea Italian preferred; graceful degrade to event.
     */
    async speak(text) {
      return runUi('speak', text, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        if (typeof text !== 'string' || !text) throw new Error('invalid_text');
        const api = window.__ELAB_API;
        if (api && api.unlim && typeof api.unlim.speakTTS === 'function') {
          const res = await api.unlim.speakTTS({ text });
          return { spoken: true, via: 'unlim_speakTTS', result: res };
        }
        window.dispatchEvent(new CustomEvent('elab-tts-speak', { detail: { text } }));
        return { dispatched: true, via: 'event_stub' };
      });
    },

    // ---------------------------------------------------------------
    // §3.5 Simulator-specific (4 methods — zoom + pan + centerOn + selectComponent)
    // ---------------------------------------------------------------

    /**
     * Simulator canvas zoom (in | out | fit | numeric scale).
     * Numeric clamp [0.3, 3.0] per ADR-041 §3.5. Delegates to existing API.
     * Caveat: canvas zoom complexity — depends on SimulatorCanvas internals.
     */
    async zoom(direction) {
      return runUi('zoom', direction, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        const api = window.__ELAB_API;
        // Clamp numeric scale per ADR-041 §3.5
        let scale = direction;
        if (typeof direction === 'number') {
          scale = Math.max(0.3, Math.min(3.0, direction));
        }
        if (api && typeof api.zoom === 'function') {
          api.zoom(scale);
          return { zoomed: true, via: 'unlim_api', scale };
        }
        // Event-stub fallback for SimulatorCanvas listener
        window.dispatchEvent(new CustomEvent('elab-canvas-zoom', { detail: { direction: scale } }));
        return { dispatched: true, via: 'event_stub', direction: scale };
      });
    },

    /**
     * Simulator canvas pan (dx, dy in px).
     * Caveat: canvas pan delegates to SimulatorCanvas via event when API absent.
     */
    async pan(dx, dy) {
      return runUi('pan', { dx, dy }, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        if (typeof dx !== 'number' || typeof dy !== 'number') throw new Error('invalid_pan_args');
        const api = window.__ELAB_API;
        if (api && typeof api.pan === 'function') {
          api.pan(dx, dy);
          return { panned: true, via: 'unlim_api', dx, dy };
        }
        window.dispatchEvent(new CustomEvent('elab-canvas-pan', { detail: { dx, dy } }));
        return { dispatched: true, via: 'event_stub', dx, dy };
      });
    },

    /**
     * Center simulator canvas on a component by ID.
     * Delegates to existing __ELAB_API.unlim.highlightComponent + scroll-into-view.
     */
    async centerOn(componentId) {
      return runUi('centerOn', componentId, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        if (typeof componentId !== 'string' || !componentId) {
          throw new Error('invalid_component_id');
        }
        const api = window.__ELAB_API;
        if (api && api.unlim && typeof api.unlim.highlightComponent === 'function') {
          api.unlim.highlightComponent([componentId]);
        }
        // Best-effort scroll-into-view via DOM selector
        if (HAS_DOCUMENT) {
          const el = document.querySelector(`[data-component-id="${componentId}"]`);
          if (el && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        window.dispatchEvent(new CustomEvent('elab-canvas-center-on', { detail: { componentId } }));
        return { centered: true, componentId };
      });
    },

    /**
     * Select a component by ID (delegates to simulator API or event-stub).
     */
    async selectComponent(id) {
      return runUi('selectComponent', id, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        if (typeof id !== 'string' || !id) throw new Error('invalid_component_id');
        const api = window.__ELAB_API;
        if (api && typeof api.interact === 'function') {
          api.interact(id, 'select');
          return { selected: true, via: 'unlim_api', id };
        }
        window.dispatchEvent(new CustomEvent('elab-component-select', { detail: { id } }));
        return { dispatched: true, via: 'event_stub', id };
      });
    },

    // ---------------------------------------------------------------
    // §3.6 Lavagna + chat (3 methods — expandChatUnlim + switchTab + togglePanel)
    // ---------------------------------------------------------------

    /**
     * Expand the UNLIM chat overlay (de-hack ChatOverlay finding #1 per ADR-041).
     * Looks up `[data-elab-action="expand-chat-unlim"]` first, falls back to
     * legacy aria-label `"Espandi chat UNLIM"` selector.
     */
    async expandChatUnlim() {
      return runUi('expandChatUnlim', null, async () => {
        if (!HAS_DOCUMENT) throw new Error('no_browser_env');
        const intent = { dataElabAction: 'expand-chat-unlim', ariaLabel: 'Espandi chat UNLIM' };
        const { element, status, strategy, matchCount } = resolveOne(intent);
        if (!element) throw new Error(`resolve_failed:${status}:${strategy}:${matchCount}`);
        dispatchMouseEvent(element, 'click');
        return { dispatched: true, strategy, matchCount };
      });
    },

    /**
     * Switch to a tab by tabId (dispatches `elab-switch-tab` event for tab container).
     */
    async switchTab(tabId) {
      return runUi('switchTab', tabId, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        if (typeof tabId !== 'string' || !tabId) throw new Error('invalid_tab_id');
        window.dispatchEvent(new CustomEvent('elab-switch-tab', { detail: { tabId } }));
        return { dispatched: true, tabId };
      });
    },

    /**
     * Toggle a side/bottom panel (left | right | bottom).
     * Dispatches `elab-toggle-panel` event for RetractablePanel listener.
     */
    async togglePanel(direction) {
      return runUi('togglePanel', direction, async () => {
        if (!HAS_WINDOW) throw new Error('no_browser_env');
        if (direction !== 'left' && direction !== 'right' && direction !== 'bottom') {
          throw new Error('invalid_panel_direction');
        }
        window.dispatchEvent(new CustomEvent('elab-toggle-panel', { detail: { direction } }));
        return { dispatched: true, direction };
      });
    },

    // ---------------------------------------------------------------
    // ADR-042 §3 — getState() UIStateSnapshot with TTL 30s in-isolate cache
    // ---------------------------------------------------------------

    /**
     * Return current UIStateSnapshot per ADR-042 §3 (7 fields).
     * Cached 30s in-isolate per ADR-042 §8.1.
     */
    getState() {
      return getState();
    },

    /** Test-only — invalidate cached state for next read. */
    _invalidateStateCache,
  };
}

// Export resolveOne + helpers for tests / external integration if needed
export { resolveOne as _resolveOne, parseKeyCombo as _parseKeyCombo, buildStateSnapshot as _buildStateSnapshot };
