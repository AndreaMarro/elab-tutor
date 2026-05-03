/**
 * Intent tag parser — Sprint T iter 36 Phase 1 — Atom A1.
 *
 * Parses `[INTENT:{tool:"...",args:{...}}]` tags emitted by the LLM in its
 * response text, returns a structured list of `IntentTag` for downstream
 * dispatch (browser-side via `__ELAB_API`), and produces a "clean" version
 * of the response text with all intent tags stripped (for display + TTS).
 *
 * Design notes:
 *   - The LLM is instructed to emit JSON-shaped intent tags. We use a
 *     brace-counting scan instead of a single regex because args can contain
 *     nested objects (e.g. `args:{filter:{type:"led"}}`). A non-greedy regex
 *     would terminate at the first inner `}`.
 *   - All parsing is defensive: malformed JSON inside a tag is logged via
 *     `_lastParseErrors` (test hook) but never throws. Bad tags fall through
 *     to `stripIntentTags` so the user-facing text stays clean.
 *   - JSON.parse with a tolerant pre-pass: LLMs sometimes emit single-quoted
 *     strings or unquoted keys. We normalize the most common cases before
 *     handing to JSON.parse, falling back to a permissive parse via
 *     `Function('return ' + s)` only as a last resort and only when no
 *     suspicious sigils ($, `, eval, fetch, import) are present.
 *
 * Wire-up in `unlim-chat/index.ts`:
 *   import { parseIntentTags, stripIntentTags } from '../_shared/intent-parser.ts';
 *   const intents = parseIntentTags(llmText);
 *   const cleanText = stripIntentTags(llmText);
 *   // dispatch each intent (or surface to client to dispatch via __ELAB_API)
 *
 * (c) Andrea Marro — 2026-04-30
 */

export interface IntentTag {
  /** Original raw substring including `[INTENT:...]` wrappers. */
  raw: string;
  /** Tool name (e.g. `"highlightComponent"`). */
  tool: string;
  /** Tool arguments object (already parsed from JSON). */
  args: Record<string, unknown>;
  /** Index of the `[` opening bracket in the source string. */
  startIdx: number;
  /** Index immediately past the `]` closing bracket. */
  endIdx: number;
}

/** Optional debug surface for tests — last batch of parse errors. */
const _lastParseErrors: string[] = [];

/**
 * Internal: locate `[INTENT:{...}]` spans using a brace-balanced scan.
 * Returns each match's outer span and the inner JSON-ish substring.
 */
function findIntentSpans(text: string): Array<{
  startIdx: number;
  endIdx: number;
  jsonRaw: string;
}> {
  const out: Array<{ startIdx: number; endIdx: number; jsonRaw: string }> = [];
  if (!text) return out;

  const marker = '[INTENT:';
  let i = 0;

  while (i < text.length) {
    const start = text.indexOf(marker, i);
    if (start < 0) break;

    const jsonStart = start + marker.length;
    if (text[jsonStart] !== '{') {
      // Malformed — `[INTENT:` not followed by `{`. Skip past to avoid loop.
      i = jsonStart + 1;
      continue;
    }

    // Brace-balanced scan, ignore braces inside strings.
    let depth = 0;
    let inString = false;
    let stringQuote = '';
    let escaped = false;
    let jsonEnd = -1;

    for (let j = jsonStart; j < text.length; j++) {
      const ch = text[j];

      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (ch === '\\') {
          escaped = true;
        } else if (ch === stringQuote) {
          inString = false;
          stringQuote = '';
        }
        continue;
      }

      if (ch === '"' || ch === "'") {
        inString = true;
        stringQuote = ch;
        continue;
      }

      if (ch === '{') {
        depth++;
      } else if (ch === '}') {
        depth--;
        if (depth === 0) {
          jsonEnd = j;
          break;
        }
      }
    }

    if (jsonEnd < 0) {
      // Unterminated `{...}` — abandon, advance past `[INTENT:` to keep scanning.
      _lastParseErrors.push(`unterminated_brace_at_${start}`);
      i = jsonStart;
      continue;
    }

    // Expect `]` immediately after the closing `}`. Allow optional whitespace
    // for tolerance, then require `]`.
    let k = jsonEnd + 1;
    while (k < text.length && /\s/.test(text[k])) k++;
    if (text[k] !== ']') {
      _lastParseErrors.push(`missing_close_bracket_at_${start}`);
      i = jsonEnd + 1;
      continue;
    }

    out.push({
      startIdx: start,
      endIdx: k + 1,
      jsonRaw: text.slice(jsonStart, jsonEnd + 1),
    });
    i = k + 1;
  }

  return out;
}

/**
 * Parse a JSON-ish object string defensively. LLMs sometimes emit lax JSON
 * (single quotes, unquoted keys). We try strict JSON.parse first, then a
 * single normalization pass, then bail.
 */
function tolerantParseObject(jsonRaw: string): Record<string, unknown> | null {
  // 1. Strict JSON.
  try {
    const v = JSON.parse(jsonRaw);
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return v as Record<string, unknown>;
    }
    return null;
  } catch {
    // fall through
  }

  // 2. Normalize: single→double quotes (only outside existing double-quoted strings),
  //    quote unquoted keys (`{tool:"x"}` → `{"tool":"x"}`).
  // Conservative single-pass normalization; only applied when no double quotes found
  // (to avoid corrupting valid JSON-with-string-payload).
  let normalized = jsonRaw;

  // Quote unquoted bare-word keys: `{key: ...}` or `, key: ...`
  normalized = normalized.replace(
    /([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:)/g,
    '$1"$2"$3',
  );

  // Convert single-quoted string literals to double-quoted, escaping inner doubles.
  normalized = normalized.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_m, inner: string) => {
    const escaped = inner.replace(/"/g, '\\"');
    return `"${escaped}"`;
  });

  try {
    const v = JSON.parse(normalized);
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return v as Record<string, unknown>;
    }
    return null;
  } catch (err) {
    _lastParseErrors.push(
      `parse_failed: ${err instanceof Error ? err.message : 'unknown'}`,
    );
    return null;
  }
}

/**
 * Parse all `[INTENT:{...}]` tags from a response text.
 *
 * Tolerant of:
 *   - multiple intent tags in one response
 *   - intents at start/middle/end of text
 *   - nested objects/arrays in `args`
 *   - whitespace inside the JSON
 *   - unicode + Italian text mixed with intents
 *
 * Returns intents in source order. Malformed tags are silently dropped
 * (not thrown) — they are still removed from `stripIntentTags` output via
 * the same regex.
 */
export function parseIntentTags(text: string): IntentTag[] {
  _lastParseErrors.length = 0;
  if (typeof text !== 'string' || text.length === 0) return [];

  const spans = findIntentSpans(text);
  const out: IntentTag[] = [];

  for (const span of spans) {
    const parsed = tolerantParseObject(span.jsonRaw);
    if (!parsed) continue;

    // iter 37 Phase 3 fix: accept both `tool` (canonical) and `action` (alias)
    // for LLM-emitted intents. Tester-5 R7 found 100% drop when LLM emitted
    // `{"action":"...","params":{...}}` per system-prompt iter 37 amend.
    // Parser is now LLM-forgiving on key naming.
    const tool = typeof parsed.tool === 'string'
      ? parsed.tool
      : typeof parsed.action === 'string'
        ? parsed.action
        : null;
    if (!tool) {
      _lastParseErrors.push(`missing_tool_or_action_field`);
      continue;
    }

    // iter 37 Phase 3 fix: accept both `args` (canonical) and `params` (alias).
    const argsSource = parsed.args ?? parsed.params;
    const args =
      argsSource && typeof argsSource === 'object' && !Array.isArray(argsSource)
        ? (argsSource as Record<string, unknown>)
        : {};

    out.push({
      raw: text.slice(span.startIdx, span.endIdx),
      tool,
      args,
      startIdx: span.startIdx,
      endIdx: span.endIdx,
    });
  }

  return out;
}

/**
 * Remove all `[INTENT:{...}]` tags from a response text, collapse extra
 * whitespace, and trim. Used for the user-facing `text` returned to the
 * client (and for TTS — see `principio-zero-validator.ts:51` which strips
 * the same shape).
 *
 * Implementation uses brace-balanced span detection so nested-args tags are
 * stripped correctly (a flat regex would leak partial JSON for nested `}`).
 */
export function stripIntentTags(text: string): string {
  if (typeof text !== 'string' || text.length === 0) return '';

  const spans = findIntentSpans(text);
  if (spans.length === 0) return text.replace(/\s+/g, ' ').trim();

  let cur = 0;
  let out = '';
  for (const span of spans) {
    out += text.slice(cur, span.startIdx);
    cur = span.endIdx;
  }
  out += text.slice(cur);

  return out.replace(/\s+/g, ' ').trim();
}

/**
 * Test-only hook — exposes the last batch of parse errors. Consumers should
 * not depend on this in production code.
 */
export function _getLastParseErrors(): string[] {
  return [..._lastParseErrors];
}

// ═══════════════════════════════════════════════════════════════════════════
// Sprint T iter 31 ralph 20.1 — Server-side pre-dispatch security extensions
//
// Per ADR-041 §5 Security boundary + §6 Stop conditions. These guards run
// AFTER `parseIntentTags` (above) and BEFORE the response is forwarded to the
// browser-side dispatcher (`useGalileoChat.js` → `intentsDispatcher.js`). The
// browser dispatcher remains the second line of defense (defense-in-depth);
// these server-side checks catch malformed/destructive/PII intents at the
// source so the LLM cannot leak them to the client even if the client
// dispatcher were compromised.
//
// File ownership rigid (per task contract):
//   - intentsDispatcher.js (Maker-2 iter 20.2 parallel) MUST mirror
//     ALLOWED_UI_ACTIONS_SET below as its browser-side whitelist source.
//   - Edge Function `unlim-chat/index.ts` consumes `validateIntents()` post-
//     `parseIntentTags()` (wire-up Atom 22.x downstream).
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 50-action whitelist mirror of `CANONICAL_INTENT_TOOLS` (intent-tools-schema.ts).
 * Kept in sync manually — Atom 20.1 Maker-1 ownership.
 *
 * Iter 38 baseline 12 + iter 31 ralph 20.1 NEW 38 = 50 canonical tools.
 */
export const ALLOWED_UI_ACTIONS_SET = new Set<string>([
  // baseline 12 (iter 38)
  'highlightComponent', 'mountExperiment', 'captureScreenshot', 'highlightPin',
  'clearHighlights', 'clearCircuit', 'getCircuitState', 'getCircuitDescription',
  'setComponentValue', 'toggleDrawing', 'serialWrite', 'clearHighlightPins',
  // §3.1 mouse + keyboard (10)
  'click', 'doubleClick', 'rightClick', 'hover', 'scroll',
  'type', 'key', 'keyDown', 'keyUp', 'drag',
  // §3.2 window + nav (8)
  'openModal', 'closeModal', 'minimizeWindow', 'maximizeWindow', 'closeWindow',
  'navigate', 'back', 'forward',
  // §3.3 modalita + lesson (7)
  'toggleModalita', 'highlightStep', 'nextStep', 'prevStep',
  'nextExperiment', 'prevExperiment', 'restartLessonPath',
  // §3.4 voice (6)
  'voicePlayback', 'voiceSetVolume', 'voiceSetMode',
  'startWakeWord', 'stopWakeWord', 'speak',
  // §3.5 simulator (4 most-used)
  'zoom', 'pan', 'centerOn', 'selectComponent',
  // §3.6 lavagna chat (3 most-used)
  'expandChatUnlim', 'switchTab', 'togglePanel',
]);

/**
 * 18-action FORBIDDEN destructive set per ADR-041 §5.2. These actions MUST
 * NEVER be dispatched even if LLM hallucinates them. Server-side hard reject.
 *
 * Categories per Phase 0 audits Findings 4+5+7:
 *   - admin CRUD (9)
 *   - manual/notebook destructive (2)
 *   - teacher class management (2)
 *   - voice/memory destructive (5)
 */
export const FORBIDDEN_DESTRUCTIVE_ACTIONS_SET = new Set<string>([
  // admin CRUD (Finding 4)
  'admin-license-clear', 'admin-license-create', 'admin-license-modify',
  'admin-license-export', 'admin-license-update',
  'admin-class-delete', 'admin-student-delete', 'admin-audit-clear',
  'admin-settings-reset',
  // manual/notebook destructive (Finding 5)
  'manual-doc-remove', 'notebook-delete',
  // teacher class management (Finding 5)
  'teacher-class-delete', 'teacher-student-delete',
  // voice/memory destructive (Finding 7) + dispatcher iter 37 explicit excludes
  'resetMemory', 'cronologia-delete-session',
  'stopSync', 'deleteAll', 'submitForm', 'fetchExternalUrl',
]);

/**
 * 6-action confirmation-gate set per ADR-041 §5.3. These actions are allowed
 * (NOT forbidden) BUT require voice "sì conferma" gate before execution.
 * Server-side flags them with `requires_confirm=true` in validation result;
 * the actual confirmation flow is implemented browser-side (TTS prompt + STT
 * 5s window) per ADR-041 §5.3 steps 1-6.
 */
export const DESTRUCTIVE_LIKE_REQUIRES_CONFIRM_SET = new Set<string>([
  'clearCircuit',                  // voiceCommands.js:140 (Finding 7)
  'navigate',                      // route change (loses unsaved session)
  'closeSession',                  // session abandon (not in whitelist but reserved)
  'cronologia-select-session',     // context switch (loses unsaved)
  'manual-fullscreen-exit',        // exits viewer modal (reserved)
  'modalita-back-percorso',        // exits Passo Passo modal (reserved)
]);

/**
 * PII regex set per ADR-041 §5.4. Matched against input field `name` or
 * `aria-label` attributes in `type` action `target` value, OR `text` value
 * for `type` action when target unknown.
 *
 * - HARD BLOCK: password, credentials, token, secret, api_key, private_key
 * - WARNING (proceed but audit): email, phone, address, tax, ssn, cc-number
 *
 * Intent: NEVER auto-fill secrets even if LLM tries; for less-sensitive PII
 * fields (email/phone) emit warning audit but allow (educational platform
 * may legitimately ask student to type their email for onboarding etc).
 */
const PII_HARD_BLOCK_RE =
  /\b(password|passwd|credential[s]?|token|secret|api[_-]?key|private[_-]?key|csrf|bearer|otp|2fa|cvv|cvc)\b/i;

const PII_WARNING_RE =
  /\b(email|e-mail|phone|telefono|address|indirizzo|tax|ssn|cc[-_]?number|carta[_-]?credito|iban|codice[_-]?fiscale)\b/i;

export type IntentValidationStatus =
  | 'ok'
  | 'forbidden_destructive'
  | 'not_in_whitelist'
  | 'pii_blocked_password'
  | 'pii_blocked_credit_card'
  | 'pii_blocked_secret'
  | 'pii_warning_field'
  | 'selector_too_broad'
  | 'selector_not_found_pre_check'
  | 'rate_limit_exceeded_pre_check'
  | 'truncated_max_consecutive'
  | 'requires_confirm';

export interface IntentValidationResult {
  /** Original parsed intent (echoed for caller convenience). */
  intent: IntentTag;
  /** Outcome status — `'ok'` means safe to dispatch (or after confirm gate). */
  status: IntentValidationStatus;
  /** Optional human-readable reason for non-ok statuses. */
  reason?: string;
  /** Set when status is `'requires_confirm'` — browser-side gate per §5.3. */
  requiresConfirm?: boolean;
  /** Set when status is `'pii_warning_field'` — proceed but audit. */
  warning?: boolean;
}

/** Per ADR-041 §6.1 — max consecutive UI actions per LLM response. */
export const MAX_CONSECUTIVE_UI_ACTIONS = 5;

/**
 * Per ADR-041 §5.5 — rate limit max actions per session per minute.
 * Real implementation lives in `src/services/elab-ui-rate-limit.js`
 * (Maker-2 dispatcher iter 20.2 parallel). This server-side const is a
 * placeholder echo so Edge Function can echo the policy in audit logs.
 */
export const RATE_LIMIT_MAX_PER_MINUTE = 10;
export const RATE_LIMIT_WINDOW_MS = 60_000;

/**
 * Anti-absurd selector ambiguity check per ADR-041 §4.2. Server-side cannot
 * actually query the DOM (Edge runtime has no document), so the "real" match
 * count check happens browser-side in the resolver. Server-side performs
 * cheap structural sanity:
 *   - empty target string → `selector_not_found_pre_check`
 *   - target containing `*` or `body`/`html` raw → `selector_too_broad`
 *     (catastrophic catch-alls).
 *   - target equals one of `button`/`input`/`a` un-qualified → `selector_too_broad`.
 *
 * Browser-side dispatcher additionally rejects >10 OR 0 OR (text-only) >3
 * matches per §4.2.
 */
function checkSelectorSanity(target: unknown): IntentValidationStatus | null {
  if (target === null || target === undefined) return null;
  if (typeof target !== 'string') return null;
  const t = target.trim();
  if (t.length === 0) return 'selector_not_found_pre_check';
  // Catch-all selectors: bare `*`, `body`, `html`, or unqualified tag names
  if (t === '*' || t === 'body' || t === 'html') return 'selector_too_broad';
  // Bare tag name (no attribute/class/id) — unsafe broad match
  if (/^(button|input|a|div|span|p|li|tr|td)$/i.test(t)) return 'selector_too_broad';
  return null;
}

/**
 * Detect PII risk in a `type` action. Checks both `target` (field selector)
 * and `text` (value being typed) — though text checking is conservative
 * (only blocks if text obviously matches a credential pattern, e.g. high
 * entropy random string, not implemented v1).
 */
function checkPiiRisk(args: Record<string, unknown>): IntentValidationStatus | null {
  const target = typeof args.target === 'string' ? args.target : '';
  const text = typeof args.text === 'string' ? args.text : '';

  // HARD BLOCK on password/secret/token/api_key field references
  if (PII_HARD_BLOCK_RE.test(target)) return 'pii_blocked_password';
  if (PII_HARD_BLOCK_RE.test(text)) return 'pii_blocked_secret';

  // Credit card field detection (autocomplete hint convention)
  if (/cc[-_]?(number|csc|cvv|cvc)|carta[_-]?credito|credit[_-]?card/i.test(target)) {
    return 'pii_blocked_credit_card';
  }

  // WARNING (proceed) for email/phone/address/tax fields
  if (PII_WARNING_RE.test(target)) return 'pii_warning_field';

  return null;
}

/**
 * Validate a single parsed intent against ADR-041 §5 security boundary +
 * §6 stop conditions. Pure function (no Supabase I/O); returns a result the
 * caller (Edge Function) uses to decide whether to forward to browser, hard
 * reject, or flag for confirm gate.
 *
 * Order of checks (fail-fast):
 *   1. Forbidden destructive (hard reject — ADR-041 §5.2)
 *   2. Whitelist membership (hard reject — ADR-041 §5.1)
 *   3. PII risk (hard reject for password/secret, warn for email/phone — §5.4)
 *   4. Selector sanity pre-check (anti-absurd — §4.2 reduced server-side)
 *   5. Confirmation gate flag (no reject, set `requiresConfirm=true` — §5.3)
 *   6. Otherwise → `ok`.
 */
export function validateIntent(intent: IntentTag): IntentValidationResult {
  // 1. Forbidden destructive
  if (FORBIDDEN_DESTRUCTIVE_ACTIONS_SET.has(intent.tool)) {
    return {
      intent,
      status: 'forbidden_destructive',
      reason: `Action "${intent.tool}" is in FORBIDDEN destructive set (ADR-041 §5.2).`,
    };
  }

  // 2. Whitelist
  if (!ALLOWED_UI_ACTIONS_SET.has(intent.tool)) {
    return {
      intent,
      status: 'not_in_whitelist',
      reason: `Action "${intent.tool}" not in canonical 50-action whitelist (ADR-041 §5.1).`,
    };
  }

  // 3. PII risk (only relevant for `type` action; other actions don't accept text input)
  if (intent.tool === 'type') {
    const piiStatus = checkPiiRisk(intent.args);
    if (piiStatus === 'pii_blocked_password' || piiStatus === 'pii_blocked_secret' ||
        piiStatus === 'pii_blocked_credit_card') {
      return {
        intent,
        status: piiStatus,
        reason: `PII protection: blocked dispatch for sensitive field/value (ADR-041 §5.4).`,
      };
    }
    if (piiStatus === 'pii_warning_field') {
      // Continue to other checks but mark warning
      const selectorStatus = checkSelectorSanity(intent.args.target);
      if (selectorStatus) {
        return {
          intent,
          status: selectorStatus,
          reason: `Selector sanity pre-check failed: "${String(intent.args.target).slice(0, 80)}" (ADR-041 §4.2).`,
        };
      }
      return {
        intent,
        status: 'pii_warning_field',
        warning: true,
        reason: `PII warning: target field matches email/phone/address pattern (ADR-041 §5.4 — proceed with audit).`,
      };
    }
  }

  // 4. Selector sanity (for actions that take a target/from selector)
  const targetCandidates = ['target', 'from', 'to', 'componentId', 'id'];
  for (const key of targetCandidates) {
    if (key in intent.args) {
      const sel = (intent.args as Record<string, unknown>)[key];
      const status = checkSelectorSanity(sel);
      if (status) {
        return {
          intent,
          status,
          reason: `Selector sanity pre-check on field "${key}": "${String(sel).slice(0, 80)}" (ADR-041 §4.2).`,
        };
      }
    }
  }

  // 5. Confirmation gate flag
  if (DESTRUCTIVE_LIKE_REQUIRES_CONFIRM_SET.has(intent.tool)) {
    return {
      intent,
      status: 'requires_confirm',
      requiresConfirm: true,
      reason: `Action "${intent.tool}" requires voice "sì conferma" gate (ADR-041 §5.3).`,
    };
  }

  // 6. OK
  return { intent, status: 'ok' };
}

/**
 * Validate a batch of parsed intents (typically the output of
 * `parseIntentTags(llmText)`). Applies §6.1 truncation cap (max 5 consecutive),
 * then per-intent `validateIntent`. Returns:
 *   - `validated`: results for each intent (caller iterates, dispatching `ok`
 *     entries and either rejecting or prompting for `requires_confirm`).
 *   - `truncated`: how many intents beyond cap were dropped (for audit log).
 *
 * Pure function — no I/O.
 */
export function validateIntents(intents: IntentTag[]): {
  validated: IntentValidationResult[];
  truncated: number;
} {
  if (!Array.isArray(intents)) return { validated: [], truncated: 0 };

  let truncated = 0;
  let working = intents;
  if (intents.length > MAX_CONSECUTIVE_UI_ACTIONS) {
    truncated = intents.length - MAX_CONSECUTIVE_UI_ACTIONS;
    working = intents.slice(0, MAX_CONSECUTIVE_UI_ACTIONS);
  }

  const validated = working.map(validateIntent);
  return { validated, truncated };
}
