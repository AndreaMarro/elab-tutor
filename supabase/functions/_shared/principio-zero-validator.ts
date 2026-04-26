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
