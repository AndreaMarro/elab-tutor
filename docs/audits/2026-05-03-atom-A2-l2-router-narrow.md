# Audit Atom A2 — L2 router category-aware narrow iter 34

**Data**: 2026-05-03 23:35 GMT+2
**Sessione**: iter 34 Phase 1+ atomi
**Branch**: e2e-bypass-preview
**HEAD pre-A2**: 29d0603 (Atom A1 cap conditional)
**Vitest baseline**: 13770 PASS preservato (no test changes)
**Skill metric ELAB**: onnipotenza relevant (G6 Mistral canonical 3.6% lift)

## §1 Spec briefing playbook §4.3 ATOM A2

> "A2 L2 router narrow shouldUseTemplate (1h impl + Tier 3 R7 200-prompt bench)"

L2 template router (`clawbot-template-router.ts:121` `selectTemplate()`) attualmente cattura 95%+ prompts BEFORE Mistral function calling fires. Iter 38 baseline R7 canonical 3.6%. L2 dominance = template short-circuit interferes with Mistral function calling fire-rate.

Atom A2: ridurre scope L2 selectTemplate per 3 categorie classifier che skipOnniscenza=true (chit_chat + meta_question + off_topic). Queste categorie NON sono educational e NON necessitano template. Skip permette LLM diretto + Mistral function calling fire opportunity.

## §2 Modifiche file

### `supabase/functions/unlim-chat/index.ts` (+~25 LOC)

- Pre `selectTemplate` call site (line 565): aggiunto env gate `ENABLE_L2_CATEGORY_NARROW` (default false)
- Quando true: `Set(['chit_chat', 'meta_question', 'off_topic'])` skip-list check
- `tpl = skipL2ForCategory ? null : selectTemplate(...)` — null skip path → fall through to LLM
- Telemetry payload: aggiunto `l2_narrow_active` boolean + `l2_skipped_category` boolean (debug_retrieval=true gate)

**Default OFF preserves existing iter 26 baseline behavior** (L2 fires for tutte categorie, zero regression).

## §3 Tests

Vitest run NON necessario per A2 — env-gated default OFF, no behavior change con env false. Pre-commit hook esegue vitest 13770 baseline preserve mandate.

Iter 35+ test addition: integration test `unlim-chat L2 narrow gate` verifica che con env true + category in skip-list, `selectTemplate` NON viene chiamato (mock or telemetry assertion). File ownership: `tests/integration/unlim-chat-*` Tester-2 ownership.

## §4 Caveat onesti

1. **Lift NON misurato**: R7 canonical 3.6% baseline iter 38. Atom A2 lift target +5-15pp conditional env true + R7 re-bench post-deploy verification. Mai claim lift senza bench output ID.
2. **Conservative scope**: solo 3 categorie skip-list (chit/meta/off). Iter 35+ valuta widen a `default` category (which is fallback, alta fraction) — but default should KEEP L2 (educational fallback).
3. **NO Edge Function deploy questa sessione**: env gate scaffold ready ma `ENABLE_L2_CATEGORY_NARROW=true` Andrea ratify required pre-canary 5%.
4. **L2 + Mistral function calling interaction**: anche con L2 skip, Mistral function calling depends on `ENABLE_INTENT_TOOLS_SCHEMA=true` env (separate gate iter 38 ADR-030). Atom A2 ALONE non basta per lift R7 canonical — serve anche Mistral function calling enabled. Joint env config required.

## §5 Skill metric refinement

**onnipotenza-coverage G6 Mistral canonical** (existing baseline):
- Baseline iter 38: 3.6% canonical (FAIL ≥95% target)
- Post Atom A2 (env true + R7 re-bench): atteso lift +5-15pp = ~10-20% canonical (still FAIL target ma onesto progress)
- Sprint T close target ≥80% requires multiple iterations (A2 + iter 35+ widen + Mistral function calling tuning)

## §6 Andrea ratify queue NEW iter 34

- `ENABLE_L2_CATEGORY_NARROW=true` env enable on Supabase project (canary 5% rollout)
- Joint with `ENABLE_CAP_CONDITIONAL=true` (Atom A1) + `ENABLE_INTENT_TOOLS_SCHEMA=true` (iter 38 ADR-030) for full Mistral function calling chain
- R7 200-prompt re-bench post-deploy verification (canonical % delta vs baseline 3.6%)

## §7 Anti-pattern G45 enforced

- ✅ NO claim "R7 canonical lift LIVE" (env default OFF, no deploy)
- ✅ NO claim "Mistral function calling fire-rate 95%" (depends multi-env joint enable)
- ✅ NO --no-verify (pre-commit vitest hook enforce 13770)
- ✅ Caveat onesti documentati §4

## §8 Next step

→ Atom A4 hedged Mistral env activation (ADR-038 quick env enable, ~5 LOC if code ready)
→ Atom A5 off-ELAB paletti soft (extend BASE_PROMPT clause, soft deflect kit ELAB)
→ Atom A3 intent_history persist Supabase (Andrea ratify SQL migration gate)
→ Atomi UI B1+C1+E1+E2+F1 per priorità ROI
