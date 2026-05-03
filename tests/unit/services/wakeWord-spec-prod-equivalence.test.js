/**
 * Maker-1 iter 31 ralph iter 13 — Wake word prod-spec WAKE_PHRASES equivalence test.
 *
 * Background:
 * - Tester-1 iter 12 caveat onesto: tests/e2e/sprint-t-iter41-wake-word-9-cell.spec.js
 *   lines 87-92 declares an INLINE WAKE_PHRASES constant inside page.evaluate(),
 *   instead of importing from src/services/wakeWord.js (single-source-of-truth divergence).
 * - This test guards against silent divergence: if prod adds/removes wake phrases,
 *   the spec inline copy must be updated in lockstep — otherwise the 9-cell spec
 *   tests a stale array and false-passes (or false-fails) wake detection.
 *
 * Strategy:
 * - Read both files via fs.readFileSync (since spec doesn't export the inline array).
 * - Extract WAKE_PHRASES array literal via regex from each source.
 * - Parse string entries and assert equality (sorted JSON) + diagnostic on mismatch.
 *
 * Iter 13 result: arrays IDENTICAL (14 entries each, same order). This test
 * locks the invariant for future iterations.
 */

import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../..');

const PROD_PATH = path.join(REPO_ROOT, 'src/services/wakeWord.js');
const SPEC_PATH = path.join(
  REPO_ROOT,
  'tests/e2e/sprint-t-iter41-wake-word-9-cell.spec.js',
);

/**
 * Extract a WAKE_PHRASES array literal from JS source text.
 * Returns array of string entries in declaration order, or null if not found.
 */
function extractWakePhrases(sourceText) {
  // Match: const WAKE_PHRASES = [ ... ];  (multi-line, non-greedy up to first ]; )
  const match = sourceText.match(/WAKE_PHRASES\s*=\s*\[([\s\S]*?)\]/);
  if (!match) return null;
  const body = match[1];
  // Extract single-quoted string literals. Spec + prod both use single quotes.
  const entries = [...body.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  return entries;
}

describe('Wake word prod-spec WAKE_PHRASES equivalence (iter 13)', () => {
  const prodSource = fs.readFileSync(PROD_PATH, 'utf8');
  const specSource = fs.readFileSync(SPEC_PATH, 'utf8');
  const prodPhrases = extractWakePhrases(prodSource);
  const specPhrases = extractWakePhrases(specSource);

  it('positive: extracts non-empty WAKE_PHRASES from both sources', () => {
    expect(prodPhrases).not.toBeNull();
    expect(specPhrases).not.toBeNull();
    expect(prodPhrases.length).toBeGreaterThan(0);
    expect(specPhrases.length).toBeGreaterThan(0);
  });

  it('positive: prod and spec WAKE_PHRASES are identical (sorted equality)', () => {
    const prodSorted = [...prodPhrases].sort();
    const specSorted = [...specPhrases].sort();

    // Diagnostic: compute symmetric difference for caveat onesto on failure.
    const prodSet = new Set(prodPhrases);
    const specSet = new Set(specPhrases);
    const onlyInProd = prodPhrases.filter((p) => !specSet.has(p));
    const onlyInSpec = specPhrases.filter((p) => !prodSet.has(p));

    if (onlyInProd.length > 0 || onlyInSpec.length > 0) {
      // eslint-disable-next-line no-console
      console.error('[wakeWord-equivalence] DIVERGENCE detected:', {
        onlyInProd,
        onlyInSpec,
        prodCount: prodPhrases.length,
        specCount: specPhrases.length,
      });
    }

    expect(JSON.stringify(specSorted)).toBe(JSON.stringify(prodSorted));
  });

  it('negative guard: detects synthetic divergence (extra entry in synthetic spec)', () => {
    // Simulates the future scenario where prod adds a phrase but spec is not updated.
    // The extractor must surface the diff so the assertion above catches it.
    const synthSpec = "const WAKE_PHRASES = ['ehi unlim', 'hey unlim'];";
    const synthProd = "const WAKE_PHRASES = ['ehi unlim', 'hey unlim', 'NEW PHRASE'];";
    const a = extractWakePhrases(synthSpec);
    const b = extractWakePhrases(synthProd);
    expect(a).toEqual(['ehi unlim', 'hey unlim']);
    expect(b).toEqual(['ehi unlim', 'hey unlim', 'NEW PHRASE']);
    // Sorted equality MUST detect the divergence.
    expect(JSON.stringify([...a].sort())).not.toBe(
      JSON.stringify([...b].sort()),
    );
  });
});
