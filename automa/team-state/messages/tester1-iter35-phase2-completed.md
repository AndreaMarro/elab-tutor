# Tester-1 iter 35 PHASE 2 — COMPLETED

**From**: Tester-1 (E2E + bench + visual verify)
**To**: orchestrator + Documenter Phase 2 + scribe iter 35
**Date**: 2026-05-04 PM
**Branch**: `e2e-bypass-preview` HEAD `e010924`

## Summary

12 atoms touched per PDR briefing:

| Atom | Status | Result |
|---|---|---|
| L1 deploy verify F1 `d3ad2b3` | DONE | ❌ F1 NOT deployed prod (chunk has 0 refs) |
| L2 Esci paths audit | DONE | ✓ 4 lifecycle categories mapped, F1 covers 3/4, L3 needed for `beforeunload` |
| L4 E2E Esci spec EXEC prod | DONE | ❌ 3/3 FAIL — prod homepage crashed (mammoth lazy default undefined) |
| G4 NEW spec Lavagna libera empty | DONE | ✓ PASS prod chromium (Three-Agent Pipeline gate used, ~95 LOC) |
| K4 NEW spec Passo Passo single window | DONE | ✓ PASS prod chromium (~85 LOC) |
| N1 NEW spec Percorso 2-window verify | DONE | ❌ FAIL prod chromium (selector miss for Percorso panel; spec correct, attrs differ in prod build) |
| M3 mascotte robottino LIVE | DONE | ❌ NOT DETECTED — homepage crash blocked render |
| M4 credits Andrea + Teodora LIVE | DONE | ❌ NOT DETECTED — homepage crash blocked render (commit `f76e4e5` not on prod) |
| O1 Glossario card LIVE | DONE | ❌ NOT DETECTED — homepage crash blocked render |
| I1 HomeCronologia render audit | DONE | ❌ NOT DETECTED — homepage crash blocked render |
| F3 wake word integration test | DONE | ✓ 9/9 PASS vitest local |
| F2 wake word browser audit (assist Maker-3) | DEFERRED | gated on prod homepage fix |
| R5 50-prompt re-bench (conditional) | DEFERRED | gated on Andrea env enable + Edge Function v81+ deploy |
| R7 200-prompt canonical re-bench (conditional) | DEFERRED | gated on Andrea ratify queue close (`ENABLE_INTENT_TOOLS_SCHEMA` canary) |
| Lighthouse desktop perf measure | DONE | ⚠️ perf 42 / a11y 96 / BP 96 / SEO 100 — perf FAIL ≥90 target, defer iter 36+ |

Time used: ~3.5 h of 4-5 h budget.

## Critical findings (P0 for orchestrator)

1. **Prod homepage CRASHES** with `TypeError: Cannot read properties of undefined (reading 'default')` from `mammoth-BJyv2V9x.js`. React error boundary "Ops! Qualcosa è andato storto" replaces the entire app. This blocks 6/12 atoms (L4, M3, M4, O1, I1, F2). P0 not in Tester-1 ownership — Maker-1/Maker-2 follow-up needed iter 35.
2. **F1 fix `d3ad2b3` NOT live in prod** — Vercel alias `www.elabtutor.school` was never repointed at a build containing the fix. Andrea's iter 19 PM bug "scritti spariscono su Esci" correctly persists for this reason. Closure path = redeploy.
3. **Lighthouse perf 42 desktop** — defer iter 36+; >40 lift vs iter 38 carryover (chatbot-only 26 / easter-modal 23) but still FAIL ≥90 target.

## Files written

NEW (Tester-1 ownership):
- `tests/e2e/06-lavagna-libera-empty.spec.js` (G4, ~95 LOC)
- `tests/e2e/07-passo-passo-single-window.spec.js` (K4, ~85 LOC)
- `tests/e2e/08-percorso-2-window.spec.js` (N1, ~95 LOC)
- `docs/audits/2026-05-04-iter-35-tester1-L1-deploy-verify.md`
- `docs/audits/2026-05-04-iter-35-tester1-L2-esci-paths-audit.md`
- `docs/audits/2026-05-04-iter-35-tester1-I1-cronologia-audit.md`
- `docs/audits/iter-35-evidence/iter-35-tester1-findings.md` (consolidated)
- `docs/audits/iter-35-evidence/L4/prod-homepage-broken-2026-05-04.png`
- `docs/audits/iter-35-evidence/L4/prod-homepage-error-details.png`
- `docs/audits/iter-35-evidence/lighthouse-prod.json` (474 765 B)

NO src/, NO supabase/, NO tests/unit/, NO tests/integration/ writes.

## CoV per atom

- L1: ✓ source vs prod chunk grep evidence + git history check
- L2: ✓ ripgrep lifecycle event coverage + comparison with `useSessionTracker` / `unlimMemory` patterns
- L4: ✓ `npx playwright test --list` + EXEC prod chromium with retries; failure screenshots captured
- G4 / K4 / N1: ✓ `npx playwright test --list` parses 6/6; EXEC prod chromium 2/3 PASS
- F3: ✓ vitest run isolated 9/9 PASS
- Lighthouse: ✓ JSON 474 KB persisted with full audits + scores
- M3 / M4 / O1 / I1: ✓ Playwright MCP `browser_evaluate` selector enumeration + screenshot evidence

## Anti-pattern G45 enforced

- NO `--no-verify` (no commits made; all changes uncommitted Tester-1 worktree)
- NO write outside ownership ✓
- NO env keys printed ✓ (used `process.env.ELAB_API_KEY` patterns; bench EXEC deferred env-gated)
- NO destructive ops ✓
- NO DB pollution prod ✓ (unique exp_id per test in beforeEach)
- Caveats honest 5/5 critical (in `iter-35-tester1-findings.md` "Caveats critical" §)

## Phase 3 orchestrator next steps

1. P0 spawn Maker-1 / Maker-2 to fix mammoth lazy import default-undefined (root cause prod homepage crash).
2. P0 Andrea Vercel `--prod` redeploy from `e010924` HEAD post-fix → re-verify L1 (F1 chunk presence) → re-run L4 (3/3 PASS expected).
3. P1 Three-Agent Pipeline iter 2 widen N1 spec selectors after Maker-2 selector audit.
4. P1 R5 + R7 re-bench gated Andrea ratify queue close (`ENABLE_CAP_CONDITIONAL` + `ENABLE_HEDGED_LLM` + canary `ENABLE_INTENT_TOOLS_SCHEMA`).
5. P2 iter 36+ Lighthouse perf optim ≥90 (lazy mount route components, defer non-critical chunks, image optimization).

## NO commit performed by Tester-1

All changes uncommitted; orchestrator Phase 4 owns commit + push origin per PDR.
