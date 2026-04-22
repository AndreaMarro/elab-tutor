import { describe, it, expect } from 'vitest';
import {
  mapErrorCode,
  estimateInputTokens,
  estimateCostUsd,
  validateLine,
  validateJsonlContent,
} from '../../scripts/wiki-dispatch-batch.mjs';

describe('wiki-dispatch-batch error mapping', () => {
  it('maps 401 to Authentication', () => {
    expect(mapErrorCode(401)).toMatch(/Authentication/);
  });
  it('maps 429 to RateLimit', () => {
    expect(mapErrorCode(429)).toMatch(/RateLimit/);
  });
  it('maps 502 to InternalServerError (>=500)', () => {
    expect(mapErrorCode(502)).toMatch(/InternalServerError/);
  });
  it('maps 400 to BadRequest', () => {
    expect(mapErrorCode(400)).toMatch(/BadRequest/);
  });
  it('maps 422 to UnprocessableEntity', () => {
    expect(mapErrorCode(422)).toMatch(/UnprocessableEntity/);
  });
  it('maps unknown code to UnknownError', () => {
    expect(mapErrorCode(418)).toMatch(/UnknownError/);
  });
});

describe('wiki-dispatch-batch token estimator', () => {
  it('returns 0 for non-string', () => {
    expect(estimateInputTokens(null)).toBe(0);
    expect(estimateInputTokens(undefined)).toBe(0);
    expect(estimateInputTokens(42)).toBe(0);
  });
  it('uses ~1 token per 4 chars (ceil)', () => {
    expect(estimateInputTokens('')).toBe(0);
    expect(estimateInputTokens('abcd')).toBe(1);
    expect(estimateInputTokens('abcdefgh')).toBe(2);
    expect(estimateInputTokens('abcde')).toBe(2);
  });
});

describe('wiki-dispatch-batch cost estimator', () => {
  it('returns zeros for empty records', () => {
    const c = estimateCostUsd([]);
    expect(c.inputTokens).toBe(0);
    expect(c.outputTokens).toBe(0);
    expect(c.totalCostUsd).toBe(0);
  });
  it('computes cost for 1 record with known content', () => {
    const rec = { body: { max_tokens: 1000, messages: [{ content: 'a'.repeat(4000) }] } };
    const c = estimateCostUsd([rec]);
    expect(c.inputTokens).toBe(1000);
    expect(c.outputTokens).toBe(1000);
    expect(c.totalTokens).toBe(2000);
    expect(c.totalCostUsd).toBeGreaterThan(0);
  });
  it('aggregates across multiple records', () => {
    const rec = { body: { max_tokens: 100, messages: [{ content: 'a'.repeat(400) }] } };
    const c = estimateCostUsd([rec, rec, rec]);
    expect(c.inputTokens).toBe(300);
    expect(c.outputTokens).toBe(300);
  });
});

describe('wiki-dispatch-batch line validator', () => {
  it('flags malformed JSON', () => {
    const r = validateLine('{not json', 1);
    expect(r.valid).toBe(false);
    expect(r.errors[0].check).toBe('json');
  });
  it('flags missing custom_id', () => {
    const r = validateLine(JSON.stringify({ body: { model: 'x', messages: [{ role: 'user', content: 'hi' }] } }), 1);
    expect(r.valid).toBe(false);
    expect(r.errors.find((e) => e.check === 'custom_id')).toBeTruthy();
  });
  it('flags missing body', () => {
    const r = validateLine(JSON.stringify({ custom_id: 'x' }), 1);
    expect(r.valid).toBe(false);
    expect(r.errors.find((e) => e.check === 'body')).toBeTruthy();
  });
  it('flags missing messages', () => {
    const r = validateLine(JSON.stringify({ custom_id: 'x', body: { model: 'm', messages: [] } }), 1);
    expect(r.valid).toBe(false);
    expect(r.errors.find((e) => e.check === 'body.messages')).toBeTruthy();
  });
  it('accepts valid record', () => {
    const r = validateLine(JSON.stringify({
      custom_id: 'exp-1',
      body: { model: 'llama', messages: [{ role: 'user', content: 'hi' }] },
    }), 1);
    expect(r.valid).toBe(true);
    expect(r.errors).toEqual([]);
  });
});

describe('wiki-dispatch-batch JSONL content validator', () => {
  it('counts lines and flags duplicates', () => {
    const content = [
      JSON.stringify({ custom_id: 'a', body: { model: 'm', messages: [{ role: 'user', content: 'x' }] } }),
      JSON.stringify({ custom_id: 'a', body: { model: 'm', messages: [{ role: 'user', content: 'y' }] } }),
    ].join('\n');
    const r = validateJsonlContent(content);
    expect(r.lineCount).toBe(2);
    expect(r.duplicateCustomIds).toContain('a');
    expect(r.valid).toBe(false);
  });
  it('ignores blank lines', () => {
    const content = '\n' + JSON.stringify({
      custom_id: 'a',
      body: { model: 'm', messages: [{ role: 'user', content: 'x' }] },
    }) + '\n\n';
    const r = validateJsonlContent(content);
    expect(r.lineCount).toBe(1);
    expect(r.valid).toBe(true);
  });
  it('reports all errors across lines', () => {
    const content = [
      '{bad json',
      JSON.stringify({ body: {} }),
      JSON.stringify({ custom_id: 'c', body: { model: 'm', messages: [{ role: 'user', content: 'x' }] } }),
    ].join('\n');
    const r = validateJsonlContent(content);
    expect(r.lineCount).toBe(3);
    expect(r.errors.length).toBeGreaterThanOrEqual(2);
    expect(r.valid).toBe(false);
  });
});
