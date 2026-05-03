# Maker-1 iter 31 ralph 20 Phase 2 Atom 20.1 — COMPLETED

**Date**: 2026-05-03
**Agent**: Maker-1 (intent-parser + intent-tools-schema)
**Atom**: 20.1 (per ADR-041 §3 L0b API surface schema expansion + §5 security pre-dispatch)
**Mode**: normale (NOT caveman)
**Phase**: 2 of 3 (Phase 3 = orchestrator commit)

---

## §1 Files modified (full absolute paths + LOC delta)

| File | LOC before | LOC after | Delta | Notes |
|---|---|---|---|---|
| `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/supabase/functions/_shared/intent-tools-schema.ts` | 142 | 583 | **+441** | 38 NEW action schemas + per-action `INTENT_TOOL_ARGS_SCHEMAS` lookup table + ACTION_TRIGGER_RE widened (target +400) |
| `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/supabase/functions/_shared/intent-parser.ts` | 280 | 595 | **+315** | Server-side pre-dispatch validation: `validateIntent` + `validateIntents` + 50-action whitelist + 18 destructive forbidden + 6 confirm-gate + PII regex hard-block & warning + selector sanity anti-absurd + truncation cap (target +200, exceeded with comprehensive validation surface) |

**Total NEW LOC**: +756 (target +600 met).

**File ownership respected**:
- ✓ Modified ONLY 2 files in scope
- ✓ NO modify `intentsDispatcher.js` (Maker-2 ownership iter 20.2 parallel)
- ✓ NO modify Edge Function `unlim-chat/index.ts` (out of scope iter 20)

---

## §2 38 NEW actions list per category (per ADR-041 §3 L0b)

### §3.1 Mouse + keyboard primitives (10)
1. `click` (target, modifiers[])
2. `doubleClick` (target)
3. `rightClick` (target)
4. `hover` (target)
5. `scroll` (target, direction[up|down|left|right], amount?)
6. `type` (target?, text)
7. `key` (combo) — e.g. "Enter", "ctrl+z", "Escape", "Tab"
8. `keyDown` (key)
9. `keyUp` (key)
10. `drag` (from, to)

### §3.2 Window + modal + navigation (8)
11. `openModal` (name)
12. `closeModal` (name)
13. `minimizeWindow` (title)
14. `maximizeWindow` (title)
15. `closeWindow` (title)
16. `navigate` (route) — REQUIRES voice "sì conferma" gate (§5.3)
17. `back` ()
18. `forward` ()

### §3.3 Modalità 4 + lesson-paths (7)
19. `toggleModalita` (modalita[percorso|libero|gia-montato|esperimento])
20. `highlightStep` (index ≥0)
21. `nextStep` ()
22. `prevStep` ()
23. `nextExperiment` ()
24. `prevExperiment` ()
25. `restartLessonPath` ()

### §3.4 Voice + TTS playback (6)
26. `voicePlayback` (action[play|pause|skip|replay|stop])
27. `voiceSetVolume` (percent 0..1)
28. `voiceSetMode` (mode[always|ptt])
29. `startWakeWord` ()
30. `stopWakeWord` ()
31. `speak` (text)

### §3.5 Simulator-specific (4 most-used)
32. `zoom` (direction[in|out|fit|number])
33. `pan` (dx, dy)
34. `centerOn` (componentId)
35. `selectComponent` (id)

### §3.6 Lavagna + chatbot + chat (3 most-used)
36. `expandChatUnlim` ()
37. `switchTab` (tabId)
38. `togglePanel` (direction[left|right|bottom])

**Category totals**: 10 mouse/keyboard + 8 window/nav + 7 modalita/lesson + 6 voice/TTS + 4 simulator + 3 lavagna = **38 NEW** ✓

**Coverage vs ADR-041 §3 50 enumerated**: 38/50 = 76%. Deferred 12 methods (§3.5 deselectAll/setSlider/penTool/setCode + §3.6 minimizeChat/closeChat/toggleSidebar + §3.7 5 volumi/cronologia methods) — Maker-2 dispatcher iter 20.2 may extend OR reserve for Atom 22.x downstream.

**Total whitelist post Atom 20.1**: 12 baseline (iter 38) + 38 NEW = **50 canonical actions**.

---

## §3 Security boundary deliverables (per ADR-041 §5)

### Exports added to `intent-parser.ts`:

- `ALLOWED_UI_ACTIONS_SET: Set<string>` — 50-action canonical whitelist (mirror `CANONICAL_INTENT_TOOLS` from schema)
- `FORBIDDEN_DESTRUCTIVE_ACTIONS_SET: Set<string>` — 18-action hard reject set per §5.2 (admin CRUD 9 + manual/notebook 2 + teacher class 2 + voice/memory 5)
- `DESTRUCTIVE_LIKE_REQUIRES_CONFIRM_SET: Set<string>` — 6-action voice "sì conferma" gate flag set per §5.3 (clearCircuit, navigate, closeSession, cronologia-select-session, manual-fullscreen-exit, modalita-back-percorso)
- `validateIntent(intent: IntentTag): IntentValidationResult` — per-intent 5-step check (forbidden→whitelist→PII→selector sanity→confirm-gate→ok)
- `validateIntents(intents: IntentTag[]): { validated, truncated }` — batch + §6.1 max consecutive cap (5)
- `MAX_CONSECUTIVE_UI_ACTIONS = 5` (per §6.1)
- `RATE_LIMIT_MAX_PER_MINUTE = 10` + `RATE_LIMIT_WINDOW_MS = 60_000` (placeholder echo, real impl Maker-2 §5.5)
- `IntentValidationStatus` + `IntentValidationResult` TypeScript types

### Security checks per `validateIntent`:

1. **WHITELIST verify** — 50 canonical actions ALLOWED, anything else → `not_in_whitelist`
2. **18 destructive FORBIDDEN** — hard reject `forbidden_destructive`
3. **PII detection regex**:
   - Hard-block: password, passwd, credentials, token, secret, api_key, private_key, csrf, bearer, otp, 2fa, cvv, cvc → `pii_blocked_password` / `pii_blocked_secret`
   - Hard-block: cc-number, cc-csc, cc-cvv, carta-credito, credit-card → `pii_blocked_credit_card`
   - Warning: email, phone, address, tax, ssn, iban, codice-fiscale → `pii_warning_field` (proceed + audit)
4. **Selector ambiguity (anti-absurd reduced server-side)**:
   - Empty target → `selector_not_found_pre_check`
   - Catch-all `*`, `body`, `html`, bare tag (`button|input|a|div|span|p|li|tr|td`) → `selector_too_broad`
   - Real DOM match count check (>10/0/text>3) deferred browser-side per ADR-041 §4.2
5. **Rate limit pre-check** — placeholder constants only; real per-session sliding window in `src/services/elab-ui-rate-limit.js` (Maker-2 iter 20.2)
6. **Confirmation gate flag** — `requiresConfirm=true` for 6 destructive-like actions (browser TTS prompts user, STT 5s window per §5.3 steps 1-6)

---

## §4 CoV results 3-step

### CoV-1: vitest 13668 PASS PRIMA atom
```
Test Files  281 passed | 1 skipped (282)
     Tests  13668 passed | 15 skipped | 8 todo (13691)
   Duration  558.85s
```
**PASS** — baseline matches expected post iter 16 (13668).

### CoV-2: incremental relevant unit tests
- `tests/unit/intent-parser.test.js`: **24/24 PASS** (51ms) — backward compat preserved
- `tests/unit/components/lavagna/useGalileoChat-intents-parsed.test.js`: **22/22 PASS** (88ms) — dispatcher integration unchanged
- `tests/unit/clawbot-template-router-shouldUseIntentSchema-widen.test.js`: **42/42 PASS** (53ms) — schema heuristic widening compatible with existing `shouldUseIntentSchema` widening tests

### CoV-3: vitest finale POST atom
**Status**: RUNNING (background task `b9snm4w7f`). Expected 13668 PASS preserved (only impl additions, no test changes per task spec). Result will be reported in Phase 3 orchestrator commit message.

---

## §5 Caveat onesti (NON COMPIACENZA)

1. **Schema args validation kept permissive for baseline 12** — `additionalProperties: true` retained for `highlightComponent`, `captureScreenshot`, `highlightPin`, `toggleDrawing` to preserve iter 36-38 LLM prompt heterogeneity. Strict `additionalProperties: false` applied only to NEW 38 actions where canonical args are well-defined per ADR-041 §3. Drift risk: LLM may emit extras for new actions and Mistral FC will reject; mitigation = browser dispatcher second-line defense already in place (intentsDispatcher iter 37 whitelist).

2. **38 NEW actions cover 76% of ADR-041 §3 enumerated 50** — 12 deferred (§3.5 `deselectAll`/`setSlider`/`penTool`/`setCode` + §3.6 `minimizeChat`/`closeChat`/`toggleSidebar` + §3.7 5 volumi/cronologia methods). Reason: keeping schema LOC delta close to target +400 (achieved +441) and respecting "+38 NEW" task spec literal. Atom 22.x downstream OR Maker-2 iter 20.2 may extend.

3. **PII detection is regex-only on `target` + `text`** — does NOT detect high-entropy random strings (e.g. raw API keys typed without sigil context) and does NOT inspect args of other actions (e.g. `serialWrite.text` may contain credentials). Browser-side input.value reading guard NOT in scope iter 20.1; that's a separate Atom downstream (per ADR-041 §5.4 read-protection).

4. **Server-side selector sanity is reduced vs §4.2 spec** — Edge runtime cannot query DOM, so >10/0/text>3 match count check is deferred to browser-side resolver. Server-side does cheap structural check (bare tag, catch-all) only. False negatives expected on legitimate-looking-but-broad selectors (e.g. `.elab-button` matching 50 elements); browser side catches.

5. **`validateIntents` is NOT yet wired into Edge Function `unlim-chat/index.ts`** — that's Phase 3 orchestrator scope OR Atom 22.x. iter 20.1 ships pure functions only; caller integration is a separate change.

6. **Schema version bump `1.0-iter38` → `2.0-iter31-ralph20.1`** — breaking change for any downstream consumer that pinned to v1.0 schema (none identified in codebase grep, but flagging). Mistral FC schema name `unlim_response_with_intents` unchanged so prod deploy is non-breaking at the protocol level.

7. **Whitelist mirror is manual (NOT auto-derived from schema)** — `ALLOWED_UI_ACTIONS_SET` in parser hardcodes 50 names; if `CANONICAL_INTENT_TOOLS` in schema diverges, drift bug possible. Future Atom should refactor to import + spread (`new Set([...CANONICAL_INTENT_TOOLS])`) — deferred to avoid Edge bundle dep cycle risk this iter.

8. **`ACTION_TRIGGER_RE` widening may increase false positive trigger rate** — added verbs `apri|chiudi|vai|naviga|clicca|premi|scrivi|digita|ingrandisci|riduci|zoom|sposta|seleziona|prossim[oa]|precedente|riavvia|modalita|modalità|passo|esperimento|parla|leggi|silenzia|alza|abbassa|attiva|disattiva|finestra|pannello|tab|scheda` may cause `shouldUseIntentSchema` to fire on chit-chat ("clicca le foto", "apri la finestra di casa") incurring +50-150ms latency vs old regex. Mitigation: existing `clawbot-template-router` L2 short-circuits before LLM call for matched templates, AND R7 bench Phase 4 will measure actual fire-rate delta (Tester-2 iter 20.4 scope).

9. **Build NOT re-run iter 20.1** (~14min heavy). Schema and parser are pure TS additions (no syntax errors verified by vitest test passes); build likely PASS. Phase 3 orchestrator should run `npm run build` pre-commit per anti-regression mandate.

10. **No new tests written this Atom** — task spec §3 says "no test changes, only impl". Pre-existing intent-parser.test.js (24 tests) covers backward compat. NEW validation surface (`validateIntent`/`validateIntents`/whitelist/forbidden/PII) is NOT tested by new test cases this Atom — Tester-1 iter 20.4 OR Atom 21.1 should add coverage (~30 NEW unit tests targeting the 5-step check matrix + 18 destructive + 50 whitelist + PII regex).

11. **Dispatcher iter 20.2 (Maker-2) coordination dependency** — `intentsDispatcher.js` whitelist 12 → 50 update + browser-side resolver wire-up MUST happen before any prod-deployed LLM emits NEW 38 actions, else those intents will be silently dropped browser-side (server returns OK, browser whitelist-rejects). Phase 3 orchestrator MUST coordinate joint deploy or feature-flag (`ENABLE_UI_DISPATCH=false` rollback per §10).

---

## §6 Anti-pattern compliance enforced

- ✓ NO add destructive actions (whitelist EXCLUDES the 18 forbidden per §5.2, including admin CRUD, deleteAll, submitForm, fetchExternalUrl, resetMemory, cronologia-delete-session, stopSync, manual-doc-remove, notebook-delete, teacher-class-delete, teacher-student-delete)
- ✓ NO PII handling — `type` action `text` argument NEVER auto-filled by Edge; PII regex hard-blocks password/secret/credit-card field references
- ✓ NO `--no-verify` (no commit attempted; orchestrator commits Phase 3)
- ✓ NO destructive ops (only file Edits via tool, no rm/git/db ops)
- ✓ NO compiacenza (11 honest caveats §5 above)
- ✓ NO scope creep — only schema + parser modified; dispatcher (Maker-2 iter 20.2) untouched, Edge Function (out of scope iter 20) untouched
- ✓ NO commit (orchestrator Phase 3 ownership)

---

## §7 Phase 3 orchestrator handoff

**Status**: Atom 20.1 COMPLETE pending CoV-3 finale verify.

**Phase 3 actions**:
1. Wait CoV-3 background task `b9snm4w7f` complete; verify 13668 PASS preserved
2. Run `npm run build` pre-commit (~14min heavy)
3. Coordinate Maker-2 iter 20.2 dispatcher whitelist sync (50 actions)
4. Commit (HEREDOC msg, NO `--no-verify`, NO destructive)
5. Defer `validateIntents` wire-up in `unlim-chat/index.ts` to Atom 22.x downstream

**Score impact projection iter 31 ralph 20.1 close**: +0.05-0.10 onesto (impl only, no live deploy/bench). Sprint T close 9.5/10 path remains conditional on Atom 22.x dispatcher live + canary 5% → 100% rollout per §8 decision matrix + Andrea Opus G45 indipendente review iter 41+.

---

## §8 Cross-link

- **ADR-041** `docs/adrs/ADR-041-onnipotenza-expansion-ui-namespace-l0b.md` §3 (L0b API surface) + §5 (security boundary) + §6 (stop conditions) + §12 (implementation block)
- **ADR-042** `docs/adrs/ADR-042-onniscenza-ui-state-snapshot-integration.md` §3 (UIStateSnapshot schema) — companion onniscenza ui state
- **ADR-030** `docs/adrs/ADR-030-mistral-function-calling-intent-canonical.md` (PROPOSED iter 38) — schema baseline, this Atom extends
- **ADR-028** `docs/adrs/ADR-028-onnipotenza-intent-dispatcher-server-side.md` §14 (surface-to-browser amend iter 36) — dispatcher pattern
- **CLAUDE.md** §"DUE PAROLE D'ORDINE" §1 PRINCIPIO ZERO + §2 MORFISMO Sense 1.5
- **Phase 0 audits** `docs/audits/2026-05-03-onnipotenza-ui-audit-{lavagna,simulator,tutor-unlim,cross-cutting}.md`

---

**End Maker-1 iter 31 ralph 20.1 completion message.**
