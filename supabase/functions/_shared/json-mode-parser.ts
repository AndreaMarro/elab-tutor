// Iter 41 Phase C Task C1 — Robust Mistral JSON-mode parser 6-stage multi-shape.
//
// Pre-req for re-wire widened shouldUseIntentSchema (iter 40 v73 regression cause).
// Mistral La Plateforme responseFormat json_schema may emit JSON-mode output with
// multiple shapes (pure object, leading whitespace, code-fence wrapper, escape variants,
// inline mixed text + JSON, truncated max_tokens cut). This parser handles all
// observed shapes without breaking the legacy `[INTENT:...]` regex fallback path.
//
// Plan: docs/superpowers/plans/2026-05-02-iter-41-velocita-onniscenza-onnipotenza-wake-word.md
// ADR: docs/adrs/ADR-036 (TBD this commit batch)

import { parseIntentTags } from './intent-parser.ts';

export interface ParsedJsonMode {
  text: string;
  intents: Array<{ tool: string; args: Record<string, unknown> }>;
  source:
    | 'pure'
    | 'whitespace_strip'
    | 'code_fence_strip'
    | 'unescape'
    | 'regex_extract'
    | 'legacy_regex_fallback'
    | 'failed';
}

interface MaybeParsed {
  text?: unknown;
  intents?: unknown;
}

function tryParseObject(s: string): { text: string; intents: ParsedJsonMode['intents'] } | null {
  try {
    const obj = JSON.parse(s) as MaybeParsed;
    if (obj && typeof obj.text === 'string') {
      const intents = Array.isArray(obj.intents)
        ? (obj.intents as ParsedJsonMode['intents'])
        : [];
      return { text: obj.text, intents };
    }
  } catch {
    // fall through
  }
  return null;
}

export function parseJsonMode(input: string): ParsedJsonMode {
  const trimmed = input.trim();
  const hasWhitespacePadding = trimmed !== input;

  // ── Stage 1: pure direct parse (input has no surrounding whitespace) ──
  if (!hasWhitespacePadding) {
    const direct = tryParseObject(input);
    if (direct) {
      return { ...direct, source: 'pure' };
    }
  }

  // ── Stage 2: whitespace strip (input had surrounding whitespace) ──
  if (hasWhitespacePadding) {
    const r = tryParseObject(trimmed);
    if (r) return { ...r, source: 'whitespace_strip' };
  }

  // ── Stage 3: code-fence strip ── (```json ... ``` OR ```js ... ``` OR ``` ... ```)
  const fenceMatch = input.match(/```(?:\w+)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) {
    const r = tryParseObject(fenceMatch[1].trim());
    if (r) return { ...r, source: 'code_fence_strip' };
  }

  // ── Stage 4: unescape double-escaped quotes ──
  if (input.includes('\\"')) {
    const unescaped = input.replace(/\\"/g, '"');
    const r = tryParseObject(unescaped.trim());
    if (r) return { ...r, source: 'unescape' };
  }

  // ── Stage 5: regex-extract largest valid JSON substring ──
  // Match all balanced { ... } substrings (greedy); try largest first.
  const objCandidates = [...input.matchAll(/\{[\s\S]*?\}/g)]
    .map((m) => m[0])
    .sort((a, b) => b.length - a.length); // longest first

  for (const candidate of objCandidates) {
    const r = tryParseObject(candidate);
    if (r) return { ...r, source: 'regex_extract' };
  }

  // ── Stage 6: legacy [INTENT:...] regex fallback ──
  // intent-parser.ts handles `[INTENT:{tool:"...",args:{...}}]` shape.
  try {
    const intents = parseIntentTags(input);
    if (intents.length > 0) {
      return {
        text: input,
        intents: intents.map((i) => ({
          tool: i.tool,
          args: (i.args as Record<string, unknown>) || {},
        })),
        source: 'legacy_regex_fallback',
      };
    }
  } catch {
    // intent-parser threw (defensive)
  }

  // ── Failed: no JSON, no [INTENT:], return original text + empty intents ──
  return {
    text: input,
    intents: [],
    source: 'failed',
  };
}
