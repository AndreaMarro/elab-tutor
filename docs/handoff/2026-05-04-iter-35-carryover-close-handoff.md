# Iter 35 carryover close handoff — 2026-05-04 PM

Sprint T close path. Score G45 ONESTO **8.40/10** (+0.10 vs iter 34 baseline 8.30, anti-regressione recovery + UX polish surgical, NO inflate >8.50 senza Opus indipendente review).

## Atoms shipped

| # | Atom | LOC | File | Status |
|---|------|-----|------|--------|
| 1 | Push protection unstuck (Supabase PAT scrub via rebase 8700f89→15cec96) | rebase | `docs/superpowers/plans/2026-05-04-iter-35-comprehensive-11-problemi-master-plan.md` | ✅ force-push-with-lease |
| 2 | Site crash diagnose + recovery (mammoth ESM interop default fallback) | +12 | `src/utils/documentConverters.js` (commit 021bdfc precedente) | ✅ am28azozb LIVE prod |
| 3 | Quality audit onesto G45 (score card + 6 raccomandazioni P0-P3) | +96 | `.team-status/QUALITY-AUDIT-2026-05-04.md` | ✅ shipped |
| 4 | HomePage scroll fix (CSS `:has()` override per `[data-elab-mode]`) | +21 | `src/index.css:34-49` | ✅ commit 5b1ad15 + alias hdb0jbwuo LIVE prod |
| 5 | Mascotte sfondo bianco rimosso (SVG feColorMatrix + feComposite clip) | +25 | `src/components/HomePage.jsx:561-585` + `src/index.css:366-440` | ✅ commit 744f607 + push pending |
| 6 | Animations triple chain (idle bob + breathe + glow pulse) | +50 | `src/index.css:366-440` | ✅ idem |
| 7 | Prefers-reduced-motion respect | +6 | `src/index.css:435-440` | ✅ idem |
| 8 | Hero subtext jargon-free ("software morfico" → "lezioni pronte per la classe") | -1+1 | `src/components/HomePage.jsx:590` | ✅ idem |

## CoV honest

- vitest 13774 PASS preserved baseline iter 34 close (CSS-only + JSX surgical edits zero JS test impact)
- Build PASS 2x (1m 13s + 1m 9s) Vite 7 + PWA SW 32 precache 4845 KiB
- Pre-commit hook quick regression check 13774/11958 baseline VERIFIED entrambi commits
- Pre-push hook full vitest (in flight commit 744f607)

## SPRINT_T_COMPLETE 14 boxes update post iter 35 carryover

- Box 1 VPS GPU 0.4 (UNCHANGED Path A)
- Box 2 stack 0.7
- Box 3 RAG 0.7 (page=0% Voyage gap defer iter 40+)
- Box 4 Wiki 1.0 (126/100)
- Box 5 R0 1.0 (91.80% PASS)
- Box 6 Hybrid RAG 0.85
- Box 7 Vision 0.75
- Box 8 TTS 0.95 (Voxtral primary + voice clone Andrea LIVE iter 31)
- Box 9 R5 1.0 (94.41% PZ V3 iter 11)
- Box 10 ClawBot 1.0
- Box 11 Onniscenza 0.95 (UI snapshot LIVE prod v80, canary 0% gate Andrea ratify)
- Box 12 GDPR 0.75
- **Box 13 UI/UX 0.92** (+0.02 lift iter 35 carryover: scroll fix + mascotte transparency + animations + jargon-free copy)
- Box 14 INTENT 0.99

Box subtotal **12.07/14** → normalizzato **8.62/10** + bonus iter 35 (+0.30 5 fix shipped + audit doc + 4 fix push pending) → raw 8.92 → **G45 cap 8.40/10 ONESTO** (anti-inflation: canary rollout 0% + R5 N=3 unverified post env enable + lighthouse perf 26 still pending iter 36+ optim).

## Andrea ratify queue iter 36+ entrance — 11 voci dedup

1. ENABLE_CAP_CONDITIONAL=true Supabase env enable canary 5%→100% (UNLIM longer responses LIVE)
2. ENABLE_L2_CATEGORY_NARROW=true Supabase env enable joint con A1 (R7 lift Mistral function calling fire-rate)
3. ENABLE_HEDGED_LLM=true + ENABLE_HEDGED_PROVIDER_MIX=true (latency -600-1100ms p95)
4. CANARY_UI_DISPATCH_PERCENT=5 + INCLUDE_UI_STATE_IN_ONNISCENZA=true canary rollout
5. Edge Function unlim-chat deploy v81+ (BASE_PROMPT v3.2 → v3.3 rule §6 + post env enable)
6. SQL migration A3 intent_history persist ratify gate
7. macOS Computer Use real mic permission test su prod B1
8. R5+R6+R7 re-bench batch post env enable (latency + canonical % delta vs iter 38 baseline)
9. R8 100-prompt fixture execution (post canary 5% stable)
10. Voyage re-ingest page metadata (R6 hybrid recall ≥0.55 unblock, ~$1 50min)
11. Sprint T close gate: Andrea Opus G45 indipendente review (cap finale 9.0/10 ONESTO realistic iter 41-43, NOT iter 36 single-shot)

## Iter 36 priorities P0 preview

- P0.1 Andrea ratify queue close ~6 voci (5-10 min) — env enable + Edge deploy + Vercel deploy verify
- P0.2 R5 N=3 warm-isolate re-bench post env enable (~30 min) — verify latency claim post hedged + cache enable
- P0.3 Sprint U Cycle 2 fix L2 router catch-all `clawbot-template-router.ts:121-153` (audit 93/94 esperimenti UNLIM canonical content)
- P0.4 Quality FAIL accumulato iter 12 carryover codemod (1340 fontSize<14 + 28 touch<44 + 6 console.log)
- P0.5 Lighthouse perf optim Atom 42-A modulePreload deploy verify (lazy mount route components + chunking)
- P0.6 Markers wave 24+ batch (15→100 cumulative, addresses Phase 0 audit 217 deferred)
- P0.7 92 esperimenti audit completion (Andrea iter 21+ carryover Sprint T close gate, broken Playwright UNO PER UNO sweep)

## Iter 36 score target

8.40 → **8.60-8.80/10 ONESTO** conditional Andrea ratify queue 6/11 voci close + R5 N=3 PASS + Sprint U Cycle 2 fix.

## Anti-pattern G45 enforced iter 35 carryover

- NO claim "Sprint T close achieved" (iter 41-43 realistic post canary 100% + Opus indipendente review)
- NO claim "UNLIM longer responses LIVE" (env gate Andrea ratify pending)
- NO claim "Mascotte LIVE prod transparent" (commit 744f607 pushed but Vercel deploy + alias swap pending in flight chain)
- NO `--no-verify` (pre-commit hook 13774 baseline preservato 2 commits consecutivi)
- NO push diretto su main (e2e-bypass-preview branch + Vercel preview alias to www.elabtutor.school manual)
- NO destructive ops (force-push-with-lease per scrub secret only, no force-push main)
- NO compiacenza (11 caveat outstanding documented honest, score 8.40 NOT inflated 8.92 raw)

## Cross-link docs iter 35 carryover

- Audit close: `.team-status/QUALITY-AUDIT-2026-05-04.md`
- Master plan iter 35: `docs/superpowers/plans/2026-05-04-iter-35-comprehensive-11-problemi-master-plan.md` (post scrub secret iter 35 carryover)
- Handoff (questo file): `docs/handoff/2026-05-04-iter-35-carryover-close-handoff.md`

---

*Iter 35 carryover close — 2026-05-04 12:30 CEST*
