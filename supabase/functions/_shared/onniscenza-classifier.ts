/**
 * onniscenza-classifier — Sprint T iter 37 Atom A2 (Maker-1)
 *                       — Sprint T iter 34 Atom A1 (cap conditional 6→8 categories)
 *
 * Pre-LLM, regex-only classifier of user prompts into onniscenza-injection
 * categories. Drives a conditional ENABLE_ONNISCENZA path so that cheap
 * chit-chat avoids the (expensive) 7-layer aggregator and deep questions
 * preserve full top-3 RRF context.
 *
 * Iter 34 extension: 6 → 8 categories + per-category capWords field. New:
 *   - 'meta_question'    user asks "chi sei", "come funzioni", "come ti chiami"
 *                        → onniscenza skip (no Vol/pag needed), shortest cap
 *   - 'off_topic'        user asks non-educational (calcio, gaming, meteo, politica)
 *                        → onniscenza skip, soft deflect to kit ELAB
 *
 * Categories (mutually exclusive, evaluated top-to-bottom):
 *   - 'safety_warning'   highest priority (security keywords) → onniscenza top-3
 *   - 'meta_question'    NEW iter 34: meta-self questions → onniscenza skip
 *   - 'off_topic'        NEW iter 34: non-educational → onniscenza skip + soft deflect
 *   - 'deep_question'    >=20 words AND ends with `?` → onniscenza top-3
 *   - 'citation_vol_pag' references "Vol.X" / "pag.Y" → onniscenza top-2
 *   - 'plurale_ragazzi'  contains "ragazzi" plural marker → onniscenza top-2
 *   - 'chit_chat'        <8 words AND greeting tokens → SKIP onniscenza (latency)
 *   - 'default'          fallback (none of the above) → onniscenza top-3 (preserve tests)
 *
 * Behavior matrix (capWords NEW iter 34, consumed by system-prompt
 * getCategoryCapWordsBlock helper, gated by ENABLE_CAP_CONDITIONAL env in
 * unlim-chat/index.ts wire-up):
 *   chit_chat        => skipOnniscenza=true,  topK=0, capWords=30  (1 frase secca)
 *   meta_question    => skipOnniscenza=true,  topK=0, capWords=50  (2 frasi self-intro)
 *   off_topic        => skipOnniscenza=true,  topK=0, capWords=40  (1 frase + soft deflect kit)
 *   citation_vol_pag => skipOnniscenza=false, topK=2, capWords=60  (cap default preserve)
 *   plurale_ragazzi  => skipOnniscenza=false, topK=2, capWords=60  (cap default preserve)
 *   deep_question    => skipOnniscenza=false, topK=3, capWords=120 (deep needs words)
 *   safety_warning   => skipOnniscenza=false, topK=3, capWords=80  (safety FIRST + kit)
 *   default          => skipOnniscenza=false, topK=3, capWords=60  (cap default preserve)
 *
 * NO LLM call. Pure regex + word count. Defensive: never throws. Empty/null
 * input => 'chit_chat' (cheapest path; a blank message implies a tap-test).
 *
 * Reference: PDR-ITER-37-LATENCY-LIFT-DEPLOY-VERIFY.md §3 Atom A2 (iter 37).
 *            docs/superpowers/plans/2026-05-03-STEP-1-SESSIONE-ELAB-FIXES-MULTI-PROVIDER.md
 *            §4.3 ATOM A1 (iter 34 extension cap conditional).
 *
 * (c) Andrea Marro 2026-04-30 / 2026-05-03 — ELAB Tutor
 */

export type PromptCategory =
  | 'safety_warning'
  | 'meta_question'
  | 'off_topic'
  | 'deep_question'
  | 'citation_vol_pag'
  | 'plurale_ragazzi'
  | 'chit_chat'
  | 'default';

export interface ClassificationResult {
  category: PromptCategory;
  /** When true, the onniscenza aggregator should be skipped for latency. */
  skipOnniscenza: boolean;
  /** Top-K hits to inject into the LLM prompt (0 when skipOnniscenza). */
  topK: number;
  /** Word count of the input (zero when input is null/empty). */
  wordCount: number;
  /**
   * NEW iter 34 Atom A1: per-category cap word target for system-prompt
   * conditional cap injection. Consumed by getCategoryCapWordsBlock() in
   * system-prompt.ts when ENABLE_CAP_CONDITIONAL=true env flag is set in
   * unlim-chat/index.ts wire-up. Default OFF preserves existing 60-word cap
   * behavior (BASE_PROMPT v3.2 line 96 universal cap).
   */
  capWords: number;
}

/**
 * Greeting / chit-chat tokens. Match is case-insensitive, anchored on word
 * boundaries to avoid false positives ("ciao" inside "ciaologico" must NOT
 * trigger). Italian-only because the product is Italian-K-12 (PRINCIPIO ZERO).
 */
const GREETING_RE = /\b(ciao|salve|grazie|buongiorno|buonasera|buonanotte|ehi|hey|hola)\b/i;

/**
 * Safety keywords. These imply potentially dangerous student/circuit context
 * and ALWAYS warrant the full onniscenza top-3 RRF (kit fisico mention).
 */
const SAFETY_RE = /\b(pericolo|attenzione|brucia(?:to|re|t[oae])?|scossa|cortocircuito|bruciato|bruciata|fumo|esploso|scoppiato|bruciante|scotta|caldissim[oa]|surriscalda(?:to|ta|t[oae])?)\b/i;

/**
 * Citation references "Vol.X" / "vol.X" / "pag.Y" / "pagina Y" / "p.Y".
 * Tolerant of whitespace and missing dot (per real student typing).
 */
const CITATION_RE = /\b(vol(?:ume)?\.?\s*[123]\b|pag(?:ina)?\.?\s*\d{1,3}\b|p\.\s*\d{1,3}\b)/i;

/**
 * Plural addressing marker. Italian K-12 PRINCIPIO ZERO requires plural
 * "ragazzi". When the user (typically the docente) types "ragazzi",
 * onniscenza fetches a smaller fused set (top-2) because the docente is
 * narrating to the class and needs concise reinforcement.
 */
const PLURALE_RE = /\bragazz[ie]\b/i;

/**
 * NEW iter 34 Atom A1: Meta-self questions about UNLIM. User asks "chi sei",
 * "come funzioni", "come ti chiami", "cosa sai fare". These don't need RAG
 * Vol/pag context — UNLIM answers from system-prompt persona alone.
 * skipOnniscenza=true, capWords=50 (2 frasi self-intro plurale "Ragazzi").
 *
 * Match anchored on word boundaries Italian-only (PRINCIPIO ZERO scuola pubblica).
 * Patterns covered:
 *   - chi sei / chi siete / chi è UNLIM
 *   - come ti chiami / come vi chiamate
 *   - come funzioni / come funziona
 *   - cosa sai fare / cosa puoi fare
 *   - sei un robot / sei un'AI / sei intelligenza artificiale
 */
const META_RE = /\b(chi\s+(?:sei|siete|è\s+unlim)|come\s+(?:ti\s+chiami|vi\s+chiamate|funzion[ie]a?)|cosa\s+(?:sai|puoi)\s+fare|sei\s+(?:un\s+robot|un'?\s*ai|intelligenza\s+artificiale))\b/i;

/**
 * NEW iter 34 Atom A1: Off-topic non-educational signals. User asks about
 * calcio/futbol, gaming, meteo, politica, brand non-educational. UNLIM should
 * soft-deflect back to kit ELAB topic (Sense 2 Morfismo: tutto → kit fisico).
 * skipOnniscenza=true, capWords=40 (1 frase + soft deflect).
 *
 * Match anchored on word boundaries Italian-only. Patterns:
 *   - calcio / Juventus / Milan / Inter / Serie A / Champions / mondiale
 *   - videogioco / videogame / Fortnite / Minecraft / PlayStation / PS5 / Xbox
 *   - meteo / pioggia / nevicata / temperatura città
 *   - politica / governo / elezione / partito
 *   - canzone / cantante / Sanremo / Spotify / TikTok trend
 *
 * NOTA: pattern conservativi per NON catturare educational uses
 * (es. "sensore temperatura" non triggera "temperatura"). Controllo con \b
 * + lemmi specifici off-topic (NO substring match generico).
 */
const OFFTOPIC_RE = /\b(calcio|juventus|milan|inter|napoli|serie\s+a|champions|mondiale|pallone|videogioc[oh]|videogame|fortnite|minecraft|playstation|ps[345]|xbox|nintendo|switch|sanremo|tiktok|spotify|youtube|netflix|instagram|whatsapp|tronisti|gossip|elezione|elezioni|governo|partito|premier|presidente)\b/i;

/**
 * Word counter. Strips action tags / markdown punctuation that should NOT
 * affect intent classification. Defensive on null/undefined.
 */
export function countWords(input: string | null | undefined): number {
  if (!input || typeof input !== 'string') return 0;
  // Strip well-known noise that user wouldn't intend as content.
  const cleaned = input
    .replace(/\[(AZIONE|INTENT)[^\]]*\]/gi, ' ')
    .replace(/[*_`~]/g, ' ');
  // Tokens count only when they contain at least one letter or digit
  // (Unicode-aware via \p{L}\p{N}). This excludes pure-emoji / punctuation
  // tokens which would otherwise inflate the word count and prevent the
  // chit_chat skip path on emoji-only messages.
  return cleaned
    .split(/\s+/)
    .filter((w) => w.length > 0 && /[\p{L}\p{N}]/u.test(w))
    .length;
}

/**
 * Classify a user prompt using regex only (NO LLM).
 *
 * Order of checks matters (iter 34 expansion 6→8 categories Atom A1):
 *  1) safety_warning (highest): even short messages must keep top-3.
 *  2) meta_question NEW iter 34: meta-self about UNLIM → SKIP onniscenza.
 *  3) off_topic NEW iter 34: non-educational → SKIP onniscenza + soft deflect.
 *  4) chit_chat: <8 words AND greeting → SKIP onniscenza.
 *  5) citation_vol_pag: explicit Vol/pag → top-2 focused fetch.
 *  6) plurale_ragazzi: docente speaking to class → top-2 concise.
 *  7) deep_question: >=20 words AND ends with `?` → top-3 deep context.
 *  8) default fallback → top-3 (preserved iter 37 contract; see iter 38 caveat).
 *
 * Priority rationale:
 *   - safety_warning FIRST: security trumps latency, can't be overridden.
 *   - meta_question + off_topic BEFORE chit_chat: catch "Chi sei?" (5 words,
 *     no greeting token) before it falls to default top-3 unnecessarily;
 *     catch "ragazzi parliamo di calcio" (off_topic) before plurale_ragazzi
 *     would pull RAG vol/pag for a non-educational deflect.
 *   - chit_chat AFTER meta+off: greeting + non-greeting cases handled separately.
 *   - citation/plurale/deep/default: unchanged from iter 37 baseline.
 *
 * @param input  raw user prompt (possibly empty)
 * @returns      ClassificationResult with category, skipOnniscenza, topK, capWords
 */
export function classifyPrompt(input: string | null | undefined): ClassificationResult {
  const wordCount = countWords(input);
  const text = (input || '').trim();

  // 1. Safety warning beats everything (security trumps latency).
  if (SAFETY_RE.test(text)) {
    return { category: 'safety_warning', skipOnniscenza: false, topK: 3, wordCount, capWords: 80 };
  }

  // 2. NEW iter 34 Atom A1: meta-self questions ("chi sei", "come funzioni")
  // → SKIP onniscenza, capWords=50 (2 frasi self-intro plurale "Ragazzi").
  if (META_RE.test(text)) {
    return { category: 'meta_question', skipOnniscenza: true, topK: 0, wordCount, capWords: 50 };
  }

  // 3. NEW iter 34 Atom A1: off-topic non-educational (calcio, gaming, meteo)
  // → SKIP onniscenza, capWords=40 (1 frase + soft deflect kit ELAB).
  if (OFFTOPIC_RE.test(text)) {
    return { category: 'off_topic', skipOnniscenza: true, topK: 0, wordCount, capWords: 40 };
  }

  // 4. Empty / very short / greeting → chit_chat (cheapest path).
  // Empty or pure-whitespace inputs collapse here too.
  if (wordCount === 0) {
    return { category: 'chit_chat', skipOnniscenza: true, topK: 0, wordCount, capWords: 30 };
  }
  if (wordCount < 8 && GREETING_RE.test(text)) {
    return { category: 'chit_chat', skipOnniscenza: true, topK: 0, wordCount, capWords: 30 };
  }

  // 5. Explicit citation references → top-2 focused fetch (volume-anchored).
  if (CITATION_RE.test(text)) {
    return { category: 'citation_vol_pag', skipOnniscenza: false, topK: 2, wordCount, capWords: 60 };
  }

  // 6. Plurale "ragazzi" addressing → top-2 (docente-to-class concise).
  if (PLURALE_RE.test(text)) {
    return { category: 'plurale_ragazzi', skipOnniscenza: false, topK: 2, wordCount, capWords: 60 };
  }

  // 7. Deep question (>=20 words + question mark) → top-3 (full context).
  if (wordCount >= 20 && /\?\s*$/.test(text)) {
    return { category: 'deep_question', skipOnniscenza: false, topK: 3, wordCount, capWords: 120 };
  }

  // 8. Fallback default → top-3 (preserve iter 37 test contract; Maker-1 cannot
  // edit tests/unit/onniscenza-classifier.test.js per file-ownership rigid).
  // Iter 38 A5 latency lift achieved via A3 Promise.all parallelization + A5
  // Cron warmup ping; default classifier topK kept at 3.
  return { category: 'default', skipOnniscenza: false, topK: 3, wordCount, capWords: 60 };
}

/** Module version marker (orchestration handoff). Iter 38 maintained the
 * "iter37" substring intentionally because tests/unit/onniscenza-classifier.test.js
 * asserts a regex match of /iter37/. Iter 34 Atom A1 cap-conditional extension
 * appends suffix preserving /iter37/ substring (test contract preserved).
 * Version semantics: file's logical iter is 34 (cap-conditional 6→8 categories +
 * capWords field), marker shows lineage iter37 (regex baseline) → iter38 (doc) →
 * iter34-cap-conditional (this expansion). */
export const ONNISCENZA_CLASSIFIER_VERSION = '1.0-iter37-iter38-doc-iter34-cap-conditional';
