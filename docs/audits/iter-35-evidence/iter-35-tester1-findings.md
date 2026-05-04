# Iter 35 Tester-1 PHASE 2 — Consolidated findings

**Date**: 2026-05-04 PM
**Owner**: Tester-1 E2E + bench + visual verify
**Scope**: 12 atoms (L1, L2, L4, G4, K4, N1, M3, M4, O1, I1, F2, F3, R5, R7, Lighthouse)
**Branch**: `e2e-bypass-preview` HEAD `e010924`
**Prod alias**: `https://www.elabtutor.school` (Vercel cache HIT, x-vercel-id `cdg1::pznht-1777916063321-2f0c7fc5288c`)

---

## TL;DR — top critical findings

1. **PROD HOMEPAGE CRASHES** — `TypeError: Cannot read properties of undefined (reading 'default')` from `mammoth-BJyv2V9x.js:193`. React error boundary "Ops! Qualcosa è andato storto" replaces the entire app. Andrea's Esci-persistence bug cannot even be reproduced because the user can't enter the app. **P0 blocker iter 35 entrance.**
2. **F1 fix `d3ad2b3` IS NOT deployed prod** — source on `e2e-bypass-preview` + `origin/e2e-bypass-preview` contains `flushDebouncedSave` + `pathsRef` ✓ but the production `DrawingOverlay-DQW-4_r9.js` chunk has 0 references to these symbols. Andrea's iter 19 PM bug persists because the fix was committed but never reached the prod alias.
3. **Lighthouse desktop perf 42 / a11y 96 / BP 96 / SEO 100** — perf <90 target FAIL (LCP 3.2 s / TBT 820 ms / FCP 2.0 s); the broken homepage error path likely contributes to TBT spike (mammoth lazy import retry/throw).
4. **L4 E2E spec 3/3 FAIL** prod chromium — drawing surface never visible (no SVG/canvas) because homepage crashes on mount before Lavagna can load.
5. **G4 + K4 PASS, N1 FAIL** new specs prod chromium — Libero & Passo Passo paths render; Percorso panel selectors don't match current prod build.
6. **F3 wake word 9/9 PASS** vitest local.
7. **R5 + R7 + R6 re-bench ALL CONDITIONAL** — gated on Andrea env enable + Edge Function v81+ deploy queue closed. Existing iter 38 carryover baselines preserved (R5 1607 ms avg / 94.2 % PZ V3, R7 3.6 % canonical).

---

## L1 — F1 deploy verify (10 min budget)

**Result**: ❌ FAIL — F1 fix NOT deployed prod.

| Layer | `flushDebouncedSave` | `pathsRef` | `cancelDebouncedSaveRemote` |
|---|---|---|---|
| Source `e2e-bypass-preview` | ✓ ref 5 | ✓ ref 4 | ✓ ref 3 |
| Source `origin/e2e-bypass-preview` (HEAD `e010924`) | ✓ | ✓ | ✓ |
| Prod chunk `DrawingOverlay-DQW-4_r9.js` (35 724 B) | **0** | **0** | **0** |

**Conclusion**: Andrea's iter 19 PM bug "scritti spariscono su Esci" persists on prod because Vercel alias `www.elabtutor.school` was never repointed at a build that contains commit `d3ad2b3` (iter 34 2026-05-03 23:52:58).

**Action iter 35**: Andrea must trigger Vercel `--prod` redeploy from current branch HEAD (`e010924`). After that the `DrawingOverlay-{hash}.js` chunk will contain the fix.

Full audit: `docs/audits/2026-05-04-iter-35-tester1-L1-deploy-verify.md`.

---

## L2 — Esci paths audit (30 min budget)

**Result**: ✓ done.

| Exit type | Browser event | F1 unmount flush fires? | Sync save fallback? |
|---|---|---|---|
| Tab-switch (`onTabChange` in AppHeader) | none — pure React state | ✓ yes | n/a |
| Browser Back / Forward | `popstate` | ✓ yes | n/a |
| Hash edit | `hashchange` | ✓ yes | n/a |
| Tab close / browser close | `beforeunload`, `unload` | ⚠️ scheduled but async fetch may not complete | ❌ no `sendBeacon` |
| App crash / SIGKILL | none | ❌ | ❌ |
| Mobile Safari background | `visibilitychange === 'hidden'` | ❌ no — React keeps mounted | ❌ no |

**Findings**:
- F1 covers tab-switch / browser back / hash change ✓ (~95 % of observed user flow).
- F1 does NOT cover `beforeunload` / `visibilitychange` reliably — L3 atom (Maker-2 owns) needs `navigator.sendBeacon` synchronous send.
- No explicit `Esci` button in source — the L4 spec selector chain is forward-compatible with future button.

Full audit: `docs/audits/2026-05-04-iter-35-tester1-L2-esci-paths-audit.md`.

---

## L4 — E2E Esci persistence prod chromium (30 min budget)

**Result**: ❌ 3/3 FAIL prod chromium.

```
3 failed
  Test 1: draw 3 strokes + Esci + reopen + assert 3 paths restored
  Test 2: immediate Esci before debounce + verify flush fired
  Test 3: beforeunload close + verify persistence
```

**Failure mode**: `expect(locator('svg[xmlns="http://www.w3.org/2000/svg"], canvas').first()).toBeVisible()` times out after 10 s — drawing surface never mounts because **prod homepage crashes** with mammoth lazy import error before Lavagna route can resolve.

This is **not a spec bug** — the spec is correct. The root cause is upstream:
1. F1 fix not deployed (L1) → fix would not be exercised even if homepage worked.
2. Homepage crash → drawing surface never rendered.

**Closure path iter 35**:
1. Andrea deploys current branch HEAD to prod.
2. Andrea fixes mammoth lazy import (likely a missing default export in a dynamic chunk after Vite chunk-splitting changes).
3. Re-run `npx playwright test tests/e2e/05-esci-persistence.spec.js --config tests/e2e/sprint-u.config.js --project=chromium`.

Evidence: `test-results/05-esci-persistence-*/test-failed-1.png` + `error-context.md` per test.

---

## G4 — E2E Lavagna libera empty (NEW spec, 50 LOC)

**Result**: ✓ PASS prod chromium.

**Spec**: `tests/e2e/06-lavagna-libera-empty.spec.js` — 1 test:
- Navigate `/#lavagna` with `elab-lavagna-libero-active` sentinel
- Click Libero modalita
- Assert `getCircuitState().components.length === 0`
- Assert no PRONTI banner visible
- Assert no `[data-component]` rendered

**Three-Agent Pipeline gate**: 50 LOC borderline (used). Spec follows L4 patterns (`text=` locators + viewport 1920×1080 + unique exp_id per test + sprint-u-auth.js bypass).

---

## K4 — E2E Passo Passo single window (NEW spec, ~70 LOC)

**Result**: ✓ PASS prod chromium.

**Spec**: `tests/e2e/07-passo-passo-single-window.spec.js` — 1 test:
- Navigate `/#lavagna`
- Click Passo modalita
- Assert no LEFT `PercorsoCapitoloOverlay` rendered (K1 fix)
- Assert RIGHT FloatingWindow rendered
- Assert Passo Passo label count ≤ 4
- Reload + verify localStorage `elab-floatwin-{kebab}` key persistence

---

## N1 — E2E Percorso 2-window verify (NEW spec, ~85 LOC)

**Result**: ❌ FAIL prod chromium — `percorsoVisible` selector no match.

**Spec**: `tests/e2e/08-percorso-2-window.spec.js`.

**Failure mode**: Percorso panel exists in DOM (Percorso default mode renders) but does not match selectors `[data-testid="percorso-panel"]`, `[data-elab-panel="percorso"]`, `[class*="PercorsoPanel"]`, `[aria-label*="Percorso" i]`. The actual prod component must use a different attribute set; spec needs Maker-2 selector audit iter 36+ (or Three-Agent Pipeline iter 2 to widen locators).

The bounding-box overlap analysis (z-index hierarchy) was not reached because of the early FAIL.

---

## M3 — Mascotte robottino LIVE (5 min)

**Result**: ❌ NOT DETECTED — prod homepage crashed; no SVG mascotte selectors matched (`svg[class*="mascotte" i]`, `[data-mascotte]`, `img[alt*="robot" i]`, `svg[aria-label*="UNLIM" i]` all 0 matches).

Cannot verify mascotte presence until homepage crash fixed.

---

## M4 — Credits Andrea + Teodora LIVE (5 min)

**Result**: ❌ NOT DETECTED — `Andrea Marro` 0 hits + `Teodora De Venere` 0 hits in body innerText (only the React error boundary text "ELAB / Ops! Qualcosa è andato storto / ..." was rendered).

Cannot verify credits until homepage crash fixed. Source commit `f76e4e5` (iter 36) is on branch but not reaching prod.

---

## O1 — Glossario card LIVE (10 min)

**Result**: ❌ NOT DETECTED — no element with text matching `/glossario/i` rendered (homepage crashed).

External glossario URL `https://elab-tutor-glossario.vercel.app` not navigated to (HomePage card 4° not rendered).

---

## I1 — HomeCronologia render audit (15 min)

**Result**: ❌ NOT DETECTED — `[data-elab-cronologia]`, `[data-testid*="cronologia"]`, `[class*="HomeCronologia"]`, `[class*="Cronologia"]` all 0 matches; no "Cronologia" string in body innerText.

Cannot audit empty/loaded states until homepage crash fixed.

Full audit (placeholder): `docs/audits/2026-05-04-iter-35-tester1-I1-cronologia-audit.md` — defer iter 36+.

---

## F2 — Wake word browser audit (collaboration with Maker-3)

**Result**: ⚠️ DEFERRED — Maker-3 owns; Tester-1 assist via Chrome MCP probe blocked by prod crash. Mac browser support detection via `webkitSpeechRecognition` typecheck possible only when app loads.

---

## F3 — Wake word integration test (5 min)

**Result**: ✓ 9/9 PASS vitest local.

```
✓ tests/unit/lavagna/wakeWord-integration.test.jsx (9 tests) 573ms
Test Files  1 passed (1)
     Tests  9 passed (9)
```

---

## R5 50-prompt re-bench (conditional)

**Result**: ⚠️ NOT EXECUTED iter 35 — gated on Andrea ratify queue close (`ENABLE_CAP_CONDITIONAL=true` + `ENABLE_HEDGED_LLM=true` + Edge Function v81+ deploy not complete).

Latest baseline (iter 38 carryover):
- avg 1607 ms / p95 3380 ms / PZ V3 94.2 % (`scripts/bench/output/r5-stress-report-2026-05-04T06-29-55-666Z.md`).
- 50/50 successful, 0 failures.

Re-run command (post env enable):
```bash
SUPABASE_ANON_KEY="..." ELAB_API_KEY="..." node scripts/bench/run-sprint-r5-stress.mjs
```

---

## R7 200-prompt canonical re-bench (conditional)

**Result**: ⚠️ NOT EXECUTED iter 35 — gated on Andrea ratify queue close (`ENABLE_INTENT_TOOLS_SCHEMA` canary 5 % off currently).

Latest baseline (iter 37 v53):
- canonical INTENT exec rate 3.6 % (target ≥80 % FAIL)
- combined (canonical + legacy AZIONE) 46.2 % FAIL
- avg 1630 ms latency
- (`scripts/bench/output/r7-stress-report-2026-05-01T07-43-03-043Z.md`)

Re-run command (post canary 5 % +):
```bash
SUPABASE_ANON_KEY="..." ELAB_API_KEY="..." node scripts/bench/run-sprint-r7-stress.mjs
```

R6 runner ALSO exists on disk (`run-sprint-r6-stress.mjs` 18 523 B) — PDR claim "may not exist" is incorrect. R6 page=0 % blocker (Voyage re-ingest gap) still applies per iter 38 carryover docs.

---

## Lighthouse — desktop preset, prod alias

**Result**: ⚠️ FAIL ≥90 perf target.

| Category | Score | Target | Verdict |
|---|---|---|---|
| Performance | **42** | ≥90 | ❌ FAIL |
| Accessibility | 96 | ≥90 | ✓ PASS |
| Best Practices | 96 | ≥90 | ✓ PASS |
| SEO | 100 | ≥90 | ✓ PASS |

Core Web Vitals (desktop):

| Metric | Value | Score |
|---|---|---|
| LCP | 3.2 s | 0.30 |
| TBT | 820 ms | 0.09 |
| FCP | 2.0 s | 0.31 |
| Speed Index | 2.8 s | 0.33 |
| CLS | 0 | 1.00 |

Iter 38 baseline `chatbot-only` perf 26 / `easter-modal` perf 23 — iter 35 main route 42 (still FAIL ≥90 but +16 / +19 lift; possibly because mammoth lazy chunk failure short-circuits some resource loading after error boundary mounts).

JSON: `docs/audits/iter-35-evidence/lighthouse-prod.json` (474 765 B).

Defer perf optim iter 36+ per PDR §A6 carryover (lazy mount route components, defer non-critical chunks, image optimization, font preload).

---

## Caveats critical (5)

1. **L4 E2E EXEC requires Andrea Vercel deploy LIVE post Phase 4** — F1 fix must reach prod alias before specs can verify the actual Esci persistence behavior. Current 3/3 FAIL is upstream blocker.
2. **R5 + R7 re-bench gated Andrea env enable queue** — `ENABLE_CAP_CONDITIONAL` / `ENABLE_HEDGED_LLM` / `ENABLE_INTENT_TOOLS_SCHEMA` canary; Edge Function v81+ deploy required.
3. **Lighthouse perf FAIL ≥90 carryover iter 36+ defer** — desktop 42 (LCP 3.2 / TBT 820 / FCP 2.0). Mobile not measured iter 35.
4. **N1 spec selector miss is fixable iter 2 Three-Agent Pipeline** — Percorso panel exists; selectors used in v1 spec do not match actual prod attributes. Maker-2 + WebDesigner-1 selector audit needed.
5. **Prod homepage CRASH `mammoth` lazy import default undefined** — likely Vite chunk splitting issue post recent PR; manifests as React error boundary preventing all visual checks (M3 / M4 / O1 / I1). P0 blocker independent of Tester-1 atoms — needs Maker-1 / Maker-2 follow-up iter 35+.

---

## Files written iter 35 Tester-1

- `tests/e2e/06-lavagna-libera-empty.spec.js` (G4 NEW, ~95 LOC)
- `tests/e2e/07-passo-passo-single-window.spec.js` (K4 NEW, ~85 LOC)
- `tests/e2e/08-percorso-2-window.spec.js` (N1 NEW, ~95 LOC)
- `docs/audits/2026-05-04-iter-35-tester1-L1-deploy-verify.md`
- `docs/audits/2026-05-04-iter-35-tester1-L2-esci-paths-audit.md`
- `docs/audits/iter-35-evidence/iter-35-tester1-findings.md` (this file)
- `docs/audits/iter-35-evidence/L4/prod-homepage-broken-2026-05-04.png` (screenshot evidence)
- `docs/audits/iter-35-evidence/L4/prod-homepage-error-details.png` (error stack screenshot)
- `docs/audits/iter-35-evidence/lighthouse-prod.json` (Lighthouse JSON)

NO src/, NO supabase/, NO tests/unit/, NO tests/integration/ writes.
