---
id: ADR-036 (mistral-json-mode-parser-multi-shape)
title: Robust Mistral JSON-mode parser 6-stage multi-shape extractor
status: PROPOSED
date: 2026-05-02
authors:
  - Andrea Marro
  - Maker-1 Opus subagent (iter 41 ralph loop iter 2)
sprint: T close — Phase C Onnipotenza pre-req
context-tags:
  - onnipotenza
  - mistral-json-mode
  - intent-parser
  - regression-prevention
---

## Status

PROPOSED 2026-05-02. Pre-req for re-wire widened `shouldUseIntentSchema` (iter 40 v73
deploy regression cause documented in commit `779980e` revert + Phase 1 G45 Opus
indipendente audit).

## Context

Iter 40 Phase 2 v73 deploy enabled widened `shouldUseIntentSchema` heuristic firing
Mistral function calling responseFormat on diagnostic + verification + step-by-step
prompts. Post-LLM JSON parser at `unlim-chat:746-767` (current production v74) handles
ONLY pure object shape via single `JSON.parse(result.text)` attempt. Mistral
responseFormat returns multiple emission shapes:

1. **Pure object**: `{"text":"Ragazzi","intents":[]}`
2. **Wrapped whitespace**: `\n  {"text":"Ragazzi","intents":[]}\n`
3. **Code-fence**: ` ```json\n{...}\n``` ` OR ` ```js\n{...}\n``` `
4. **Escaped quote variant**: `{\"text\": \"Ragazzi\"}` (double-escaped from interpolation)
5. **Mixed text + JSON inline**: `Some prefix {"text":"main","intents":[]} suffix`
6. **Truncated**: `{"text":"Ragazzi, il LED` (max_tokens 120 cut)

Single-stage parser fails 30%+ of widened-trigger prompts, falling back to legacy
`[INTENT:...]` regex which doesn't match JSON-mode output → response shipped with raw
JSON literal visible to user (smoke 2026-05-02 v73 evidence: "Diagnostica MOSFET" →
response field contained `{"text":"Ragazzi...","intents":[...]}` not extracted).

## Decision drivers

1. **Anti-regression**: handle ALL 6 emission shapes without breaking pure-object path
2. **Defensive fallback**: never throw; failed parse returns original text + empty intents
3. **Backward compat**: legacy `[INTENT:...]` regex path preserved for non-JSON-mode prompts
4. **Order safety**: stages ordered most-specific → least-specific (pure → whitespace → fence → unescape → regex-extract → legacy)
5. **Telemetry**: `source` field returned for observability (which stage matched)

## Decision

Implement `parseJsonMode(input: string): ParsedJsonMode` in
`supabase/functions/_shared/json-mode-parser.ts`:

```typescript
export interface ParsedJsonMode {
  text: string;
  intents: Array<{ tool: string; args: Record<string, unknown> }>;
  source: 'pure' | 'whitespace_strip' | 'code_fence_strip' | 'unescape'
        | 'regex_extract' | 'legacy_regex_fallback' | 'failed';
}
```

6-stage waterfall:

**Stage 1 — pure**: Input has no surrounding whitespace + JSON.parse succeeds + obj.text is string → return.

**Stage 2 — whitespace_strip**: Input has surrounding whitespace + JSON.parse(trimmed) succeeds → return.

**Stage 3 — code_fence_strip**: Match ` ```(?:\w+)?\s*\n?([\s\S]*?)\n?``` ` → JSON.parse(captured) → return.

**Stage 4 — unescape**: Input contains `\\"` → replace with `"` → JSON.parse(unescaped) → return.

**Stage 5 — regex_extract**: All `\{[\s\S]*?\}` substrings, sorted longest-first, try each → return on first valid + obj.text is string.

**Stage 6 — legacy_regex_fallback**: `parseIntentTags(input)` from `intent-parser.ts` (existing) → if any [INTENT:...] tags found, return text=original input + intents=parsed tags.

**Failed**: No stage matched → return text=input, intents=[], source='failed'.

## Implementation

File: `supabase/functions/_shared/json-mode-parser.ts` (~85 LOC).

Wire-up integration (deferred separate atom, not this commit):
- `supabase/functions/unlim-chat/index.ts:746-767` block REPLACE with
  `parseJsonMode(result.text)` call
- Telemetry: emit `event: 'json_mode_parsed', source: parsed.source` per call
- Andrea ratify gate: env `INTENT_SCHEMA_PARSER_V2=true` deploy canary (default false safe)

## Test strategy

`tests/unit/json-mode-parser.test.js` (25 PASS):

- Stage 1 pure: object directly + intents populated
- Stage 2 whitespace_strip: leading + trailing
- Stage 3 code_fence_strip: ```json + ```js + bare ```
- Stage 4 unescape: double-escaped quotes
- Stage 5 regex_extract: prefix+suffix + inline mixed + multiple candidates largest-wins
- Stage 6 legacy_regex_fallback: single + multiple [INTENT:...]
- Edge: failed (no JSON no [INTENT:]) + empty + whitespace-only + truncated + trailing comma
- Filter: intents non-array → empty + intents missing → empty + parsed obj lacks text field
- Edge: nested JSON in text + long text + unicode + emoji + special chars

## Risk + mitigations

1. **Stage 5 regex-extract false positive** — could match unintended JSON-like fragments.
   Mitigation: `tryParseObject` validates `obj.text is string` so non-conforming candidates filtered.
2. **Stage 4 unescape over-aggressive** — replacing `\"` could break embedded escape sequences.
   Mitigation: only fires if `\\"` present + JSON.parse runs after; failure falls through.
3. **Stage 1 vs Stage 2 ordering** — JSON.parse natively tolerates whitespace, so naive
   Stage 1 would succeed for whitespace-padded inputs. Mitigation: explicit `hasWhitespacePadding`
   guard ensures correct telemetry source attribution.
4. **Performance overhead** — multi-stage adds ~2-5ms per call vs single JSON.parse.
   Acceptable for non-critical-path post-LLM block; cap budget 10ms.

## Acceptance gates

- ADR-036 status PROPOSED → ACCEPTED post Andrea ratify
- 25/25 tests PASS (current)
- Wire-up deferred separate commit gated env `INTENT_SCHEMA_PARSER_V2=true`
- Post-deploy v75+ smoke: 5 widened-trigger prompts (Diagnostica + Verifica + Mostra +
  Spiega passo + Controlla) all return clean prose (no raw JSON visible)
- Telemetry log `json_mode_parsed source` distribution measured 100-prompt window
- Parse fallback rate `failed` source < 5% per 100-prompt window (pre-req for C3 widened
  re-wire canary)

## Cross-references

- Plan: `docs/superpowers/plans/2026-05-02-iter-41-velocita-onniscenza-onnipotenza-wake-word.md` §Phase C Task C1
- Phase 1 G45 Opus indipendente: `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md` (iter 39 inflation flag #2 dispatcher canary 0%)
- Iter 40 v73 regression revert: commit `779980e` (Phase 2 single-line revert)
- Iter 38 caveat #1: R5 v56 8/38 failures Mistral schema rejection on non-action prompts

## Iter 42+ deferred enhancements

- Stage 7: handle Mistral output with Markdown bold/italic wrapping (`**{...}**`)
- Stage 8: handle multi-object emission (`{...}\n{...}`) — pick last/best
- Adaptive parse strategy: log most-common source, reorder stages by frequency
- Schema validation: assert `intents[].tool ∈ CANONICAL_INTENT_TOOLS` at parse time (currently downstream filter)
