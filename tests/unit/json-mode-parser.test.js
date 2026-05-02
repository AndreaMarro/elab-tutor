// Iter 41 Phase C Task C1 — Robust Mistral JSON-mode parser 6-stage multi-shape.
// Pre-req for re-wire widened shouldUseIntentSchema (iter 40 v73 regression cause).
// Plan §Phase C Task C1 + ADR-036.

import { describe, it, expect } from 'vitest';
import { parseJsonMode } from '../../supabase/functions/_shared/json-mode-parser.ts';

describe('Mistral JSON-mode parser multi-shape (iter 41 C1)', () => {
  // ── Stage 1: pure object ──
  it('parses pure object directly', () => {
    expect(parseJsonMode('{"text":"hi","intents":[]}')).toEqual({
      text: 'hi', intents: [], source: 'pure'
    });
  });

  it('parses pure object with intents populated', () => {
    expect(parseJsonMode('{"text":"Ragazzi","intents":[{"tool":"highlight","args":{"id":"led1"}}]}')).toEqual({
      text: 'Ragazzi',
      intents: [{ tool: 'highlight', args: { id: 'led1' } }],
      source: 'pure'
    });
  });

  // ── Stage 2: whitespace strip ──
  it('strips leading whitespace', () => {
    expect(parseJsonMode('  \n{"text":"hi","intents":[]}')).toMatchObject({
      text: 'hi', intents: [], source: 'whitespace_strip'
    });
  });

  it('strips trailing whitespace + newline', () => {
    expect(parseJsonMode('{"text":"hi","intents":[]}\n  ')).toMatchObject({
      text: 'hi', source: 'whitespace_strip'
    });
  });

  // ── Stage 3: code-fence strip ──
  it('strips code-fence wrapper json language', () => {
    expect(parseJsonMode('```json\n{"text":"hi","intents":[]}\n```')).toMatchObject({
      text: 'hi', source: 'code_fence_strip'
    });
  });

  it('strips code-fence wrapper no language hint', () => {
    expect(parseJsonMode('```\n{"text":"hi","intents":[]}\n```')).toMatchObject({
      text: 'hi', source: 'code_fence_strip'
    });
  });

  // ── Stage 4: unescape ──
  it('unescapes double-escaped quotes', () => {
    const input = '{\\"text\\": \\"hi\\", \\"intents\\": []}';
    expect(parseJsonMode(input).source).toMatch(/unescape|regex_extract/);
    expect(parseJsonMode(input).text).toBe('hi');
  });

  // ── Stage 5: regex-extract largest JSON ──
  it('extracts largest JSON substring from mixed text prefix+suffix', () => {
    expect(parseJsonMode('Some prefix {"text":"hi","intents":[]} suffix')).toMatchObject({
      text: 'hi', source: 'regex_extract'
    });
  });

  it('extracts JSON when text contains [INTENT:...] inline mixed', () => {
    const input = 'Ragazzi, ecco. {"text":"Ragazzi, il LED","intents":[]} extra';
    expect(parseJsonMode(input).text).toBe('Ragazzi, il LED');
  });

  it('picks largest valid JSON when multiple candidates', () => {
    const input = 'Some {"a":1} text and {"text":"main","intents":[]} done';
    expect(parseJsonMode(input).text).toBe('main');
  });

  // ── Stage 6: legacy [INTENT:...] regex fallback ──
  it('falls back to legacy [INTENT:...] regex on parse fail', () => {
    const input = 'Ragazzi, vediamo. [INTENT:{"tool":"highlightComponent","args":{"id":"led1"}}]';
    const result = parseJsonMode(input);
    expect(result.source).toBe('legacy_regex_fallback');
    expect(result.intents).toHaveLength(1);
    expect(result.intents[0].tool).toBe('highlightComponent');
    expect(result.text).toBe(input);
  });

  it('falls back to legacy with multiple [INTENT:...] tags', () => {
    const input = '[INTENT:{"tool":"a","args":{}}] mid [INTENT:{"tool":"b","args":{}}]';
    const result = parseJsonMode(input);
    expect(result.source).toBe('legacy_regex_fallback');
    expect(result.intents.map((i) => i.tool)).toEqual(['a', 'b']);
  });

  // ── Edge: failure ──
  it('returns failed source when no JSON or [INTENT:] found', () => {
    const input = 'Ragazzi, plain text response no JSON no intents';
    const result = parseJsonMode(input);
    expect(result.source).toBe('failed');
    expect(result.text).toBe(input);
    expect(result.intents).toEqual([]);
  });

  it('returns failed for empty string input', () => {
    const result = parseJsonMode('');
    expect(result.source).toBe('failed');
    expect(result.text).toBe('');
    expect(result.intents).toEqual([]);
  });

  it('returns failed for whitespace-only input', () => {
    const result = parseJsonMode('   \n\t  ');
    expect(result.source).toBe('failed');
  });

  // ── Edge: malformed JSON ──
  it('handles truncated JSON object gracefully', () => {
    const input = '{"text":"Ragazzi, il LED'; // truncated max_tokens cut
    const result = parseJsonMode(input);
    expect(result.source).toBe('failed');
    expect(result.text).toBe(input);
  });

  it('handles JSON with extra trailing comma (invalid)', () => {
    const input = '{"text":"hi","intents":[],}'; // trailing comma — invalid JSON
    const result = parseJsonMode(input);
    // Stage 5 regex_extract may still find {"text":"hi","intents":[]}
    // OR fail entirely. Either outcome acceptable.
    expect(['regex_extract', 'failed']).toContain(result.source);
  });

  // ── Filter: intents non-array ──
  it('returns empty intents array when intents field is non-array', () => {
    expect(parseJsonMode('{"text":"hi","intents":"not-array"}').intents).toEqual([]);
  });

  it('returns empty intents array when intents field missing', () => {
    expect(parseJsonMode('{"text":"hi"}').intents).toEqual([]);
  });

  // ── Filter: text non-string ──
  it('falls through stages when parsed object lacks text field as string', () => {
    // {"foo":42} parses but .text is undefined → fallback chain
    const result = parseJsonMode('{"foo":42}');
    expect(result.source).toMatch(/regex_extract|failed/);
  });

  // ── Edge: nested JSON in text ──
  it('preserves nested JSON-as-text within text field', () => {
    const input = '{"text":"Ragazzi {\\"a\\":1}","intents":[]}';
    const result = parseJsonMode(input);
    expect(result.text).toBe('Ragazzi {"a":1}');
  });

  // ── Edge: very large input ──
  it('handles long text within JSON gracefully', () => {
    const longText = 'A'.repeat(5000);
    const input = `{"text":"${longText}","intents":[]}`;
    const result = parseJsonMode(input);
    expect(result.text).toBe(longText);
    expect(result.source).toBe('pure');
  });

  // ── Edge: special chars ──
  it('handles unicode + emoji in text field', () => {
    const input = '{"text":"Ragazzi! 🚀 Vol.1 €","intents":[]}';
    expect(parseJsonMode(input).text).toBe('Ragazzi! 🚀 Vol.1 €');
  });

  // ── Edge: code-fence with language hint variations ──
  it('handles ```js language hint variations', () => {
    expect(parseJsonMode('```js\n{"text":"hi","intents":[]}\n```').text).toBe('hi');
  });

  // ── Schema: non-object intents filter (defensive) ──
  it('intents must be objects with tool field — schema preserved', () => {
    // The parser returns whatever is in intents array; downstream filter uses CANONICAL_INTENT_TOOLS
    const input = '{"text":"hi","intents":[{"tool":"foo"},{"not_tool":"bar"}]}';
    expect(parseJsonMode(input).intents).toHaveLength(2); // raw, downstream filters
  });
});
