# ATOM-A2b-TRIAL spec — widen shouldUseIntentSchema (Three-Agent Pipeline trial iter 34 carryover)

**Data**: 2026-05-04 ~08:50 GMT+2
**Branch**: e2e-bypass-preview HEAD `22e22f4`
**Atom**: A2.b widen Mistral function calling fire heuristic
**Trial purpose**: validate Three-Agent Pipeline (Claude Plan → Codex Implement → Gemini Review → Claude Fix → CoV) end-to-end

## §1 Behavior change

**File target**: `supabase/functions/unlim-chat/index.ts:525-527`

**State pre-A2b** (iter 38 ADR-030 + iter 34 A2 carryover):
```typescript
const intentSchemaEnabled =
  (Deno.env.get('ENABLE_INTENT_TOOLS_SCHEMA') || 'false').toLowerCase() === 'true';
const useIntentSchema = intentSchemaEnabled && shouldUseIntentSchema(safeMessage);
```

`shouldUseIntentSchema(safeMessage)` is currently **conservative** — fires only on message keywords matching action verbs (es. "monta", "highlight", "carica"). Result: R7 200-prompt v56 canonical 3.6% (baseline iter 38 carryover, L2 template router catches 95%+ before Mistral function calling fires).

**State post-A2b**: widen heuristic to include ALSO classifier output category. Fire intent schema when:
- `shouldUseIntentSchema(safeMessage) === true` (existing keyword heuristic)
- **OR** `promptClass.category in ['plurale_ragazzi', 'deep_question', 'default']` (NEW iter 34 widen — categories likely to need actions)
- **AND NOT** `promptClass.category in ['chit_chat', 'meta_question', 'off_topic', 'safety_warning', 'citation_vol_pag']` (skip categories where Mistral schema overhead is wasted)

Wire-up via env gate: `ENABLE_INTENT_SCHEMA_WIDEN=false` default OFF (zero regression default).

## §2 Acceptance criteria

1. **Vitest 13774 baseline preserved** (no regression src/ tests/ existing)
2. **Telemetry surface NEW**: `intent_schema_widen_active` boolean + `intent_schema_widen_triggered` boolean in response payload (debug_retrieval=true gate)
3. **Smoke prod 3 prompt verify** post Edge Function deploy v82+:
   - `"Spiega in dettaglio cosa fa la breadboard nei nostri esperimenti?"` (deep_question, ≥20 words + `?`) → `useIntentSchema=true` quando widen enabled
   - `"parliamo di calcio Juventus"` (off_topic) → `useIntentSchema=false` (skip-list)
   - `"Pericolo brucia"` (safety_warning) → `useIntentSchema=false` (skip-list)
4. **R7 re-bench post-deploy** (defer iter 35+ for actual canonical lift measure)
5. **Anti-pattern G45 enforced**: env gate default OFF + audit doc + caveat onesti

## §3 PRINCIPIO ZERO + Morfismo invariants

- ✅ NO behavior change quando env false (zero regression)
- ✅ Plurale Ragazzi NOT impacted (text response unchanged, only Mistral schema fire heuristic widens)
- ✅ Vol/pag verbatim NOT impacted (schema only adds structured intents extraction post-LLM)
- ✅ Kit ELAB mention NOT impacted (BASE_PROMPT unchanged)
- ✅ Morfismo Sense 1.5 docente-adapt: classifier output already drives behavior (A1 capWords + A2 L2 narrow), this widens consistency
- ✅ Sense 2 triplet kit-volumi: schema canonical args.id pattern preserves Vol/cap mapping (ADR-030)

## §4 Anti-pattern G45 enforced

- NO claim "R7 lift achieved" (re-bench post-deploy required)
- NO --no-verify
- NO push diretto su main (e2e-bypass-preview only)
- NO destructive ops
- NO Mac Mini Tier 0 Cowork pretense (NOT setup)
- NO Three-Agent Pipeline multi-vote pretense (manual G45 cap mechanical only)

## §5 Implementation steps (Step 1 plan §4.3 mapping)

- **Step 1 PLAN** (this doc): scrivere spec ✓
- **Step 2 IMPLEMENT (Codex exec)**:
  ```bash
  cat docs/audits/2026-05-04-atom-A2b-trial-3agent-spec.md | \
    PATH="$HOME/.local/bin:$PATH" codex exec --sandbox=workspace-write \
    "Read the spec doc above and implement the changes in supabase/functions/unlim-chat/index.ts. Apply only the surgical edit to widen shouldUseIntentSchema with classifier category logic + env gate ENABLE_INTENT_SCHEMA_WIDEN. Add telemetry fields. Output diff."
  ```
- **Step 3 REVIEW (Gemini)**:
  ```bash
  git diff HEAD | PATH="$HOME/.npm-global/bin:$PATH" gemini --skip-trust -p "Review this ELAB Tutor diff for: PRINCIPIO ZERO §1 Ragazzi+Vol/pag+kit + Morfismo Sense 1.5 docente-adapt + edge cases (null promptClass, missing category, env false default safe) + vitest 13774 preserve + anti-pattern G45. Output findings priority-rated CRITICAL/HIGH/MEDIUM/LOW."
  ```
- **Step 4 FIX (Claude inline)**: read review findings + Edit fix critical only
- **Step 5 CoV**:
  - `npx vitest run` baseline preserve verify
  - `node scripts/g45/multi-vote-aggregator-manual.mjs` (if exists)
- **Step 6 AUDIT** auto-fill template: `docs/audits/2026-05-04-atom-A2b-trial-3agent-EXECUTION.md`

## §6 Trial output expected

- Diff `unlim-chat/index.ts` ~15 LOC changes (env gate + widen logic + telemetry)
- Vitest 13774 PASS preservato
- Codex execution success (no error)
- Gemini review findings (CRITICAL/HIGH/MEDIUM/LOW classification)
- Claude fix iteration if critical findings
- Audit doc execution con honesty caveats per ogni step

## §7 Trial success criteria

- ✅ Three-Agent Pipeline exercitato end-to-end (Plan + Implement + Review + Fix + CoV + Audit)
- ✅ Codex CLI working non-interactive con prompt input
- ✅ Gemini CLI working headless review
- ✅ Anti-bias evidence: ≥1 finding catched by Codex OR Gemini that Claude inline missed
- ✅ Wall-clock measured: trial step-by-step latency
- ✅ Audit doc compliance step 1 workflow §4.3 confirmed
