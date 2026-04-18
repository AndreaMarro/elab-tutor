/**
 * ELAB — ensureBookCitation
 *
 * Post-processing helper that guarantees UNLIM's reply references the
 * physical ELAB book whenever the student is working on a known experiment.
 *
 * This is a *belt and suspenders* safeguard: the system prompt already
 * instructs UNLIM to cite the book, but the routine audit `a2-unlim.json`
 * (17/04/2026) found 0 citations across 20 test questions. When the LLM
 * forgets, this helper appends a short reference line so the Principio Zero
 * (il libro e' sempre al centro) is preserved in every reply.
 *
 * Behaviour:
 *  - If there is no experimentId or no volume reference → return unchanged.
 *  - If the reply already mentions "pagina N", "Vol. N", "volume N" or
 *    "pag. N" (case-insensitive) → return unchanged to avoid duplicates.
 *  - Otherwise append "(Riferimento: Vol. X, pag. Y del libro ELAB.)"
 *    with a sensible separator based on the reply's final punctuation.
 *
 * © Andrea Marro — 18/04/2026 — Ralph Loop iteration 1
 */

import { getVolumeRef } from '../data/volume-references';

// Match "pagina 29", "pag. 29", "Vol. 1", "Volume 2", "V1P45", case-insensitive
const CITATION_REGEX = /\b(pagina\s*\d|pag\.\s*\d|vol\.\s*\d|volume\s*\d|V\d+P\d+)/i;

export function alreadyCitesBook(text) {
  if (typeof text !== 'string') return false;
  return CITATION_REGEX.test(text);
}

export function buildCitationSuffix(experimentId) {
  const volRef = getVolumeRef(experimentId);
  if (!volRef || typeof volRef.volume !== 'number' || typeof volRef.bookPage !== 'number') {
    return null;
  }
  return `(Riferimento: Vol. ${volRef.volume}, pag. ${volRef.bookPage} del libro ELAB.)`;
}

export function ensureBookCitation(responseText, experimentId) {
  if (typeof responseText !== 'string') return responseText;
  if (!experimentId) return responseText;
  if (alreadyCitesBook(responseText)) return responseText;

  const suffix = buildCitationSuffix(experimentId);
  if (!suffix) return responseText;

  const trimmed = responseText.trimEnd();
  // Sensible separator: if the reply ends with sentence-final punctuation we
  // join with a single space, otherwise add a period first so the appended
  // reference reads as its own sentence.
  const endsClean = /[.!?…»")\]]$/.test(trimmed);
  const joiner = endsClean ? ' ' : '. ';
  return `${trimmed}${joiner}${suffix}`;
}
