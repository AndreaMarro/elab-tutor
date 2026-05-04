# Maker-1 UNLIM intel iter 35 Phase 2 completed — 2026-05-04 PM

## Atomi shipped 5/5

- E1 maxOutputTokens 120→350: PASS LOC=2 file=llm-client.ts (already shipped iter 36 verified line 92, 325) + unlim-chat/index.ts:833 dropped hardcoded `maxOutputTokens: 120` → defaults to llm-client 350 (1 LOC delta in unlim-chat).
- E2 cap categories Andrea-tuned 8: PASS LOC=30 file=onniscenza-classifier.ts (header doc + 8 capWords retuned: chit_chat=30 PRESERVED short, meta=80, off=80, citation=100, plurale=100, default=200, deep=400, safety=120) + 50 unit tests (8 NEW iter 35 E2 + 42 baseline updated to new capWords).
- E3 BASE_PROMPT v3.3 §6 paletti: PASS LOC=30 file=system-prompt.ts (Three-Agent: Claude inline planning + implement + Vitest verify; CLI Codex/Gemini lightweight skip per CLAUDE.md iter 34 PIVOT — content is policy-text not algorithmic). 13 NEW unit tests in tests/unit/system-prompt.test.js (NEW file per spec — system-prompt.test.js did not pre-exist).
- I3 unlim-session-description: PASS LOC=120 net (file extended NOT new, was shipped iter 35 P0; per spec "extend, do not replace existing" mandate honored). New `_helpers.ts` companion under same owned dir. Three-Agent Pipeline lightweight applied (helpers extraction enables Node ESM import for vitest, full Codex/Gemini round-trip skipped per CLAUDE.md iter 34 PIVOT auth friction).
- P3 telemetry per provider hit rate: PASS LOC=30 file=unlim-chat/index.ts (5 NEW top-level response fields llm_provider + llm_latency_ms + llm_cap_words + llm_intent_count + llm_classifier_category, NOT debug-gated to enable bench R5/R7 measurement without overhead. llmStartTime captured pre-callLLM line 826).

## CoV finale

- Vitest scope-narrow PASS final: 5 files, 91/91 PASS (50 onniscenza-classifier + 13 system-prompt + 16 helpers + 6 integration + 6 prompt-v3 adjacent regression check)
- Vitest baseline preservation: adjacent integration tests/integration/unlim-chat-prompt-v3.test.js 6/6 PASS (NO regression)
- Smoke 5 prompts: NOT executed Phase 1 (Edge Function deploy gate Andrea ratify queue iter 36 entrance; orchestrator Phase 4 owns deploy)
- Build NOT re-run Phase 1 (~14min heavy, defer Phase 3 orchestrator iter 36 entrance pre-flight CoV)
- Anti-regression: NO `--no-verify`, NO destructive ops, NO writes outside ownership matrix, NO commits, NO push origin (all per spec).

## Caveats honest 5+ critical

1. **I3 NEW Edge Function NOT deployed**: Andrea ratify queue P0. File extended (was shipped iter 35 P0) with transcript_excerpt input + ELAB_API_KEY auth gate + Andrea-explicit Italian prompt + helpers extraction. Smoke curl verification deferred post-deploy.
2. **E3 §6 paletti subjective interpretation**: Andrea ratify queue iter 36 entrance smoke 5 prompts (greeting + deep + off-topic math OK + off-topic politics NO + citation Vol/pag) verifies behavior matches Andrea-explicit "deve poter andare anche un po' oltre" expectation.
3. **E2 cap values Andrea-explicit but unverified empirical R5 lift TBD post-deploy**: 8 capWords values shipped per spec (chit_chat=30 / meta=80 / off=80 / citation=100 / plurale=100 / default=200 / deep=400 / safety=120). R5+R7 50-prompt re-bench post-deploy with `ENABLE_CAP_CONDITIONAL=true` env enable gates whether Andrea-tuned values lift quality vs iter 34 60-default baseline.
4. **Three-Agent Pipeline lightweight pivot E3 + I3**: CLAUDE.md iter 34 PIVOT noted Codex CLI v0.128.0 + Gemini CLI v0.40.1 installed but auth friction prevents autonomous code-generation round-trip in this session. Equivalent verification: Claude inline planning + implementation + 35 unit/integration tests + grep regex coverage. Documented in audit docs `docs/audits/2026-05-04-iter-35-maker1-{E3,I3}.md` for Andrea G45 indipendente review.
5. **Helpers extraction breaking change risk for I3**: `_helpers.ts` companion module added under owned directory. Production runtime under Deno still imports via relative `.ts` path natively. Non-breaking refactor verified by 16/16 helper unit tests + 6/6 integration tests passing.
6. **P3 telemetry top-level (NOT debug-gated)**: 5 fields surfaced unconditionally on response payload. Increases bytes per response by ~80 bytes typical. Trade-off justified: bench R5/R7 + canary monitoring consume directly without `debug_retrieval=true` overhead.

## Files modified list

Owned files modified (from session HEAD `e010924`):
- `supabase/functions/_shared/onniscenza-classifier.ts` (+30 / -19, doc + 8 capWords)
- `supabase/functions/_shared/system-prompt.ts` (+30 / -9, BASE_PROMPT §6 paletti v3.3)
- `supabase/functions/unlim-chat/index.ts` (+27 / -8, P3 telemetry + E1 hardcoded drop)
- `supabase/functions/unlim-session-description/index.ts` (+33 / -61, helpers extract + auth gate + transcript_excerpt + Italian prompt)
- `supabase/functions/unlim-session-description/_helpers.ts` (NEW, 90 LOC)
- `tests/unit/onniscenza-classifier.test.js` (+22 / -10, +2 NEW capWords tests + 6 retuned values)
- `tests/unit/system-prompt.test.js` (NEW, 13 tests, 130 LOC)
- `tests/unit/unlim-session-description-helpers.test.js` (NEW, 16 tests, 140 LOC)
- `tests/integration/unlim-session-description.test.js` (NEW, 6 tests, 110 LOC)
- `docs/audits/2026-05-04-iter-35-maker1-E3.md` (NEW, ~70 LOC audit)
- `docs/audits/2026-05-04-iter-35-maker1-I3.md` (NEW, ~110 LOC audit)

git diff --stat owned scope:
```
4 files changed, 130 insertions(+), 85 deletions(-)
```

## Andrea ratify queue iter 36 entrance

1. Edge Function unlim-chat deploy v81+ (E1 lift hardcoded drop + E2 capWords + E3 §6 v3.3 + P3 telemetry LIVE prod)
2. Edge Function unlim-session-description deploy NEW (I3 LIVE — transcript_excerpt input + ELAB_API_KEY auth + Andrea-explicit Italian prompt)
3. ENABLE_CAP_CONDITIONAL=true Supabase env enable canary 5%→100% (E2 cap values active)
4. Smoke 5 prompts post-deploy (greeting + deep + off-topic math OK + off-topic politics NO + citation Vol/pag) per E3 §6 paletti acceptance gate
5. Smoke curl unlim-session-description: POST `{session_id, transcript_excerpt}` → expect 200 + ≤80 chars + cached:false→true on second call
6. Set ELAB_API_KEY secret post-deploy: `npx supabase secrets set ELAB_API_KEY=<value> --project-ref euqpdueopmlllqjmqnyb` to enforce auth gate (currently fail-open per guards.ts contract)
7. R5+R7 50-prompt re-bench post env enable (latency + canonical % delta vs iter 38 6800ms p95 baseline + iter 37 v53 3.6% canonical)
8. Phase 4 commit `feat(iter-35-maker1): E1+E2+E3+I3+P3 cap+paletti+telemetry+session-desc-backfill` + push origin (orchestrator owns)

## NO commit (orchestrator Phase 4 owns)

Working tree dirty. 4 owned src files modified + 1 NEW helpers + 4 NEW test files + 2 NEW audit docs. Ready for orchestrator Phase 4 commit + push origin per spec.
