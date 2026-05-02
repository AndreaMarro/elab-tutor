/**
 * principio-zero-validator — Sprint S iter 2 Task A2
 * Andrea Marro 2026-04-26
 *
 * Runtime middleware: post-LLM check su Principio Zero compliance.
 * Latency budget <50ms total — solo regex-based rules, no LLM nested call.
 *
 * Sister script `scripts/bench/score-unlim-quality.mjs` ha 12 rules complete
 * (con fixture metadata: requireWhenFlag, expectedActions, scenario).
 * Qui implementiamo le 6 rules che NON necessitano fixture metadata,
 * ovvero check intrinseci sulla risposta. Le altre 6 restano bench-time only.
 *
 * Decision per ADR-009 (default — architect-opus ADR not yet available):
 * - Severity gate: ritorna violations + severity max, NON rigetta risposta
 * - Caller decide se loggare CRITICAL+ a Supabase audit log
 * - Append-warning pattern (no rejection on student runtime)
 */

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Violation {
  rule: string;
  severity: Severity;
  matched?: string;
  suggestion?: string;
}

export interface ValidationResult {
  violations: Violation[];
  severity: Severity | null;
  passes: boolean;
}

export interface ValidationContext {
  isConceptIntro?: boolean; // se true → enforce citation rule
}

const SEVERITY_RANK: Record<Severity, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

/**
 * Strip [AZIONE:...] and [INTENT:...] tags from text for word-count.
 */
function stripTags(text: string): string {
  return text
    .replace(/\[AZIONE:[^\]]+\]/gi, '')
    .replace(/\[INTENT:\{[^}]+\}\]/g, '')
    .trim();
}

function countWords(text: string): number {
  return stripTags(text).split(/\s+/).filter(Boolean).length;
}

/**
 * Validate response against Principio Zero rules.
 * Latency: <5ms typical (regex-only).
 *
 * Implements 6 runtime rules:
 *   1. imperativo_docente (HIGH)
 *   2. singolare_studente (HIGH)
 *   3. max_words_60 (MEDIUM)
 *   4. no_citation_concept_intro (LOW, conditional)
 *   5. english_filler (LOW)
 *   6. chatbot_preamble (LOW)
 *
 * Defers 6 more rules to scripts/bench/score-unlim-quality.mjs (bench-time only):
 *   - plurale_ragazzi (positive presence, fixture-dependent)
 *   - citation_vol_pag (fixture flag-based)
 *   - analogia (fixture flag-based)
 *   - no_verbatim_3plus_frasi (need RAG source diff)
 *   - synthesis_not_verbatim (need RAG sources)
 *   - off_topic_recognition (fixture scenario-based)
 *   - humble_admission (fixture scenario-based)
 *   - action_tags_when_expected (fixture metadata-based)
 */
export function validatePrincipioZero(
  response: string,
  ctx: ValidationContext = {},
): ValidationResult {
  const violations: Violation[] = [];

  // Rule 1: imperativo_docente (HIGH)
  // Frasi che iniziano con verbo imperativo singolare diretto al docente.
  // Match line-start (multiline) per coprire anche risposte multi-paragrafo.
  const impDocenteRe = /^(Distribuisci|Togli|Chiedi|Mostra|Spiega)\s/im;
  const m1 = response.match(impDocenteRe);
  if (m1) {
    violations.push({
      rule: 'imperativo_docente',
      severity: 'HIGH',
      matched: m1[0],
      suggestion: 'Usa plurale inclusivo: "Vediamo insieme...", "Distribuiamo i kit..."',
    });
  }

  // Rule 2: singolare_studente (HIGH)
  // Catches direct singular addressing student. Skip matches inside «...» (citazione fedele libro).
  const responseSansQuotes = response.replace(/«[^»]*»/g, ' ');
  const singStudenteRe = /\b(devi|hai sbagliato|prova(?!te)|guarda(?!te))\b/i;
  const m2 = responseSansQuotes.match(singStudenteRe);
  if (m2) {
    violations.push({
      rule: 'singolare_studente',
      severity: 'HIGH',
      matched: m2[0],
      suggestion: 'Usa plurale inclusivo: "dovete", "provate", "guardate"',
    });
  }

  // Rule 3: max_words_60 (MEDIUM)
  const wc = countWords(response);
  if (wc > 60) {
    violations.push({
      rule: 'max_words_60',
      severity: 'MEDIUM',
      matched: `${wc} parole`,
      suggestion: 'Riduci a max 60 parole + 1 analogia',
    });
  }

  // Rule 4: no_citation_concept_intro (LOW, conditional)
  // Solo se siamo in introduzione concetto E non c'è citazione Vol.N pag.X
  if (ctx.isConceptIntro) {
    const hasCitation = /Vol\.\s*[1-3]\s*pag\.\s*\d+/i.test(response);
    if (!hasCitation) {
      violations.push({
        rule: 'no_citation_concept_intro',
        severity: 'LOW',
        suggestion: 'Aggiungi riferimento volume per concetto cardine: «...» Vol.N pag.X',
      });
    }
  }

  // Rule 5: english_filler (LOW)
  // Frasi tipiche LLM generic anglosassone fuori posto in contenuto IT bambini.
  const enFillerRe = /\b(let me|please|sure|of course|happy to)\b/i;
  const m5 = response.match(enFillerRe);
  if (m5) {
    violations.push({
      rule: 'english_filler',
      severity: 'LOW',
      matched: m5[0],
      suggestion: 'Rimuovi filler inglese, usa solo italiano',
    });
  }

  // Rule 6: chatbot_preamble (LOW)
  // UNLIM è invisibile, non si presenta. Rifiuta preamboli chatbot generic.
  const preambleRe = /^(Certo|Volentieri|Ottima domanda|Bella domanda|Sicuramente)\b/i;
  const m6 = response.match(preambleRe);
  if (m6) {
    violations.push({
      rule: 'chatbot_preamble',
      severity: 'LOW',
      matched: m6[0],
      suggestion: 'Vai dritto al contenuto, no preamboli chatbot',
    });
  }

  // Compute max severity
  let maxSeverity: Severity | null = null;
  let maxRank = 0;
  for (const v of violations) {
    const r = SEVERITY_RANK[v.severity];
    if (r > maxRank) {
      maxRank = r;
      maxSeverity = v.severity;
    }
  }

  return {
    violations,
    severity: maxSeverity,
    passes: violations.length === 0,
  };
}

/**
 * Vol/pag citation validator — Sprint T close iter 40 BASE_PROMPT v3.2.
 *
 * Validates that a response contains a Vol/pag citation in canonical or
 * loose format. Designed to drive `pz_v3_vol_pag_match` telemetry log
 * (canary observability, NOT response-blocking iter 40 — gate later iter 41+).
 *
 * Strict canonical match (preferred):
 *   /\bVol\.[123]\s*pag\.\d{1,3}\b/g
 *   Examples: "Vol.1 pag.156", "Vol.2 pag.89", "Vol.3 pag.134", "Vol.1 pag. 12"
 *
 * Loose accepted (with warning flag):
 *   - "Vol.[123]\s*p\.?\s*\d"      → "Vol.1 p.156" or "Vol.1 p 156"
 *   - "Volume [123],?\s*pagina \d" → "Volume 1, pagina 156"
 *
 * Failure cases:
 *   - No Vol/pag at all → passes=false
 *   - Only "Vol.X" without page → passes=false
 *   - Only "pagina X" without Vol prefix → passes=false (anti-pattern)
 *   - "cap.X" alone without Vol+pag → passes=false (insufficient citation)
 *
 * Latency: <1ms typical (regex-only).
 */
export interface VolPagValidationResult {
  passes: boolean;
  violations: string[];
  regex_match_count: number;
  /** True when canonical strict format matched. */
  canonical_match: boolean;
  /** True when only loose format matched (canary warning flag). */
  loose_match: boolean;
  /** First match string (debugging / telemetry). */
  matched_text?: string;
}

export interface VolPagValidationOptions {
  /**
   * When true, response is REQUIRED to have a citation. When false (default),
   * absence is reported but not flagged as critical (e.g. RAG context empty
   * cases — model may correctly refuse). Iter 40 default false (canary obs).
   */
  required?: boolean;
  /**
   * When true, accept loose format (Vol.[123] p.X, Volume [123], pagina X).
   * Default true. When false, only canonical strict format passes.
   */
  acceptLoose?: boolean;
}

/**
 * Validate Vol/pag citation per BASE_PROMPT v3.2 strict rule.
 *
 * Returns structured result for telemetry. NEVER throws.
 *
 * @param text Response text to validate (caller should pass post-strip text
 *             with [AZIONE:...] / [INTENT:...] tags removed; this function
 *             ALSO strips them defensively).
 * @param options Validation options.
 */
export function validateVolPagCitation(
  text: string | null | undefined,
  options: VolPagValidationOptions = {},
): VolPagValidationResult {
  const violations: string[] = [];

  if (!text || typeof text !== 'string') {
    return {
      passes: false,
      violations: ['empty_text'],
      regex_match_count: 0,
      canonical_match: false,
      loose_match: false,
    };
  }

  const required = options.required ?? false;
  const acceptLoose = options.acceptLoose ?? true;

  // Strip action tags defensively (so "Vol.1 pag.42 [AZIONE:...]" still matches)
  const stripped = stripTags(text);

  // Strict canonical regex: Vol.[123] pag.\d{1,3}
  // Allows optional "cap.N esp.M " or " cap.N " between Vol and pag (book spine pattern).
  const STRICT_RE = /\bVol\.[123](?:\s+cap\.\d{1,2}(?:\s+esp\.\d{1,2})?)?\s*pag\.\s*\d{1,3}\b/g;
  // Loose 1: Vol.[123] p.\d (allows "p." or "p ")
  const LOOSE_P_RE = /\bVol\.[123](?:\s+cap\.\d{1,2}(?:\s+esp\.\d{1,2})?)?\s*p\.?\s*\d{1,3}\b/g;
  // Loose 2: Volume [123], pagina \d (extended verbose form)
  const LOOSE_VERBOSE_RE = /\bVolume\s+[123],?\s*pagina\s*\d{1,3}\b/gi;

  const strictMatches = stripped.match(STRICT_RE) || [];
  const looseMatches = stripped.match(LOOSE_P_RE) || [];
  const verboseMatches = stripped.match(LOOSE_VERBOSE_RE) || [];

  // Filter loose matches: drop any that already counted as strict
  const looseUnique = looseMatches.filter(m => !strictMatches.includes(m));

  const totalMatches = strictMatches.length + looseUnique.length + verboseMatches.length;
  const canonical_match = strictMatches.length > 0;
  const loose_match = !canonical_match && (looseUnique.length > 0 || verboseMatches.length > 0);

  // Anti-pattern: "Vol.X" alone without pag (e.g. "come dice Vol. 1")
  // Matches Vol.[123] not followed by pag/p/cap+digits
  const VOL_ALONE_RE = /\bVol\.\s*[123]\b(?!\s*(?:pag|p\.?|cap))/gi;
  const volAloneMatches = stripped.match(VOL_ALONE_RE) || [];

  // Anti-pattern: "pagina X" without Vol prefix (loose check — must NOT
  // be preceded by Vol.[123] or Volume [123] within ~30 chars)
  const PAGINA_ALONE_RE = /(?<!Vol\.[123]\s|Volume\s[123],?\s)\bpagina\s+\d{1,3}\b/gi;
  const paginaAloneMatches = stripped.match(PAGINA_ALONE_RE) || [];

  if (totalMatches === 0) {
    if (required) {
      violations.push('missing_vol_pag_citation');
    }
    if (volAloneMatches.length > 0) {
      violations.push(`vol_without_pag:${volAloneMatches[0]}`);
    }
    if (paginaAloneMatches.length > 0) {
      violations.push(`pagina_without_vol:${paginaAloneMatches[0]}`);
    }
  }

  if (loose_match && !canonical_match) {
    violations.push('loose_format_only_prefer_canonical');
  }

  const passes = canonical_match || (acceptLoose && loose_match) || (!required && totalMatches === 0 && volAloneMatches.length === 0 && paginaAloneMatches.length === 0);

  return {
    passes,
    violations,
    regex_match_count: totalMatches,
    canonical_match,
    loose_match,
    matched_text: strictMatches[0] || looseUnique[0] || verboseMatches[0],
  };
}
