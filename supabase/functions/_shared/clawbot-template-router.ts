/**
 * ClawBot L2 Template Router — keyword/category match + arg interpolation.
 *
 * Sprint T iter 26 — agent gen-app — 2026-04-28.
 *
 * `selectTemplate(query, context)` → best-match `ClawBotTemplate` or `null`
 *   when no template scores above threshold (caller falls back to LLM).
 *
 * `executeTemplate(template, inputs, env?)` → returns the resolved sequence
 *   plus an aggregated text response that wire-up code can return to the
 *   client. We DO NOT actually invoke `__ELAB_API` (browser-only) from Deno;
 *   instead we emit `[AZIONE:<tool>:<json-args>]` tags that the client-side
 *   composite handler relays. RAG retrieval IS executed server-side via
 *   `hybridRetrieve` so the citation in the speakTTS step gets a real
 *   Vol/pag pair.
 */

import { TEMPLATES_L2, type ClawBotTemplate, type ClawBotStep, type ClawBotCategory } from './clawbot-templates.ts';

// ─── Selection ──────────────────────────────────────────────────────────────

/**
 * Lightweight Italian stopword list — keeps signal words.
 */
const STOPWORDS = new Set([
  'il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'una', 'uno', 'di', 'a', 'da', 'in',
  'con', 'su', 'per', 'tra', 'fra', 'e', 'o', 'ma', 'che', 'come', 'cosa',
  'cos', 'è', 'sono', 'sei', 'siamo', 'siete', 'mi', 'ti', 'ci', 'vi', 'si',
  'al', 'del', 'dal', 'nel', 'sul', 'col', 'allo', 'dello', 'dallo',
  'quando', 'dove', 'perche', 'perché', 'fa', 'fare', 'fatto',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));
}

export interface SelectContext {
  category_hint?: ClawBotCategory;
  experimentId?: string | null;
  /**
   * Score floor for a match. Defaults to 2 (must share ≥2 keywords with the
   * template description+id). Lower → more recall, more false positives.
   */
  threshold?: number;
}

interface ScoredTemplate {
  template: ClawBotTemplate;
  score: number;
}

/**
 * Score a template against query tokens by counting overlapping tokens with
 * its description+id+name+analogia. Adds bonuses for category hint match
 * and tool-name keywords (e.g. "spiega" → "explain").
 */
function scoreTemplate(template: ClawBotTemplate, queryTokens: Set<string>, context?: SelectContext): number {
  const haystack = [
    template.id,
    template.name,
    template.description,
    template.principio_zero?.analogia ?? '',
    template.principio_zero?.vol_pag ?? '',
  ].join(' ');
  const tplTokens = new Set(tokenize(haystack));

  let score = 0;
  for (const qt of queryTokens) {
    if (tplTokens.has(qt)) score += 1;
  }

  // Category hint bonus
  if (context?.category_hint && template.category === context.category_hint) {
    score += 2;
  }

  // Verb keyword → category alignment heuristic
  const verbMap: Array<[string, ClawBotCategory[]]> = [
    ['spieg', ['lesson-explain']],
    ['intro', ['lesson-introduce']],
    ['diagnos', ['diagnose', 'diagnose-error', 'diagnose-vision', 'lesson-diagnose']],
    ['rovesc', ['diagnose-vision']],
    ['fioco', ['lesson-diagnose']],
    ['cortocirc', ['diagnose-error']],
    ['corto', ['diagnose-error']],
    ['guid', ['guide-action', 'guide-build', 'lesson-guide']],
    ['compil', ['guide-action']],
    ['serial', ['lesson-guide']],
    ['mont', ['guide-build']],
    ['celebr', ['lesson-celebrate', 'feedback-positive']],
    ['critic', ['critique-vision']],
    ['recap', ['lesson-recap']],
    ['ricap', ['lesson-recap']],
    ['error', ['error-recovery']],
    ['errat', ['error-recovery']],
    ['scratc', ['lesson-program-first']],
    ['blockl', ['lesson-program-first']],
  ];
  for (const [stem, cats] of verbMap) {
    for (const qt of queryTokens) {
      if (qt.startsWith(stem) && cats.includes(template.category)) {
        score += 1;
        break;
      }
    }
  }

  return score;
}

/**
 * Pick best L2 template for a free-form Italian query. Returns null if no
 * template clears the threshold.
 */
export function selectTemplate(query: string, context: SelectContext = {}): ClawBotTemplate | null {
  if (!query || typeof query !== 'string') return null;
  const tokens = new Set(tokenize(query));
  if (tokens.size === 0) return null;

  const threshold = context.threshold ?? 2;

  const scored: ScoredTemplate[] = TEMPLATES_L2.map(t => ({ template: t, score: scoreTemplate(t, tokens, context) }));
  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best || best.score < threshold) return null;

  // Tie-breaker: if top two within 1 point, prefer category_hint match,
  // otherwise the more specific (longer description) wins.
  if (scored.length >= 2 && scored[1].score === best.score) {
    if (context.category_hint) {
      const hinted = scored.find(s => s.template.category === context.category_hint && s.score === best.score);
      if (hinted) return hinted.template;
    }
  }

  // Sprint U fix: lesson-explain templates are experiment-specific.
  // Only serve a lesson-explain template when the query's experimentId
  // exactly matches the template's own inputs.experimentId. All other
  // lesson-explain queries fall through to LLM+RAG (return null).
  if (best.template.category === 'lesson-explain' && context.experimentId !== undefined) {
    const tplExpId = (best.template.inputs as Record<string, unknown> | undefined)?.experimentId;
    if (tplExpId !== context.experimentId) return null;
  }

  return best.template;
}

// ─── Argument interpolation ─────────────────────────────────────────────────

/**
 * Replace `${inputs.X}`, `${prev.Y}`, `${citation.Z}` tokens inside `args`
 * with concrete values. Unknown tokens are left untouched (best-effort).
 *
 * Recursively walks objects + arrays. Preserves non-string scalars.
 */
export function interpolateArgs(
  args: Record<string, unknown>,
  inputs: Record<string, unknown>,
  prev: Record<string, unknown> = {},
  citation: Record<string, unknown> = {},
): Record<string, unknown> {
  function visit(node: unknown): unknown {
    if (node === null || node === undefined) return node;
    if (typeof node === 'string') {
      return node.replace(/\$\{(inputs|prev|citation)\.([a-zA-Z0-9_]+)\}/g, (_full, scope, key) => {
        const src = scope === 'inputs' ? inputs : scope === 'prev' ? prev : citation;
        const v = src?.[key];
        if (v === undefined || v === null) return '';
        if (typeof v === 'object') return JSON.stringify(v);
        return String(v);
      });
    }
    if (Array.isArray(node)) return node.map(visit);
    if (typeof node === 'object') {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
        out[k] = visit(v);
      }
      return out;
    }
    return node;
  }
  return visit(args) as Record<string, unknown>;
}

// ─── Execution ──────────────────────────────────────────────────────────────

export interface ExecuteEnv {
  /**
   * Optional async retriever for the rag-retrieve step. Signature mirrors
   * `hybridRetrieve(query, topK)` from `./rag.ts`. Caller wires this in to
   * keep the router free of import-time side effects in unit tests.
   */
  ragRetrieve?: (query: string, topK: number) => Promise<Array<Record<string, unknown>>>;
  /**
   * Default citation when RAG retrieval fails or returns empty. Falls back
   * to `template.principio_zero.vol_pag` if available.
   */
  fallbackCitation?: { vol?: string; page?: string | number; verbatim?: string };
}

export interface ExecuteResult {
  templateId: string;
  resolvedSequence: ClawBotStep[];
  /**
   * Plain-text response with [AZIONE:<tool>:<args>] tags that the
   * client-side composite handler interprets. The final `speakTTS` text is
   * surfaced verbatim so the chat UI shows the docente-facing message.
   */
  responseText: string;
  citation: { vol?: string; page?: string | number; verbatim?: string } | null;
  latencyMs: number;
}

/**
 * Execute an L2 template by interpolating args and (optionally) invoking
 * the RAG retriever for a real citation. Tool dispatch is NOT performed
 * here — instead each step is encoded as `[AZIONE:tool:args]` for the
 * client to relay. This keeps the router Deno-pure.
 */
export async function executeTemplate(
  template: ClawBotTemplate,
  inputs: Record<string, unknown> = {},
  env: ExecuteEnv = {},
): Promise<ExecuteResult> {
  const t0 = Date.now();
  // Merge defaults from template.inputs for any keys not provided
  const mergedInputs: Record<string, unknown> = { ...template.inputs, ...inputs };

  let citation = env.fallbackCitation ?? null;
  if (!citation && template.principio_zero?.vol_pag) {
    // Parse "Vol.1 pag.156" into structured form for interpolation
    const m = template.principio_zero.vol_pag.match(/Vol\.(\d+)\s*pag\.(\d+)/i);
    if (m) {
      citation = { vol: m[1], page: m[2], verbatim: '' };
    }
  }

  const prev: Record<string, unknown> = {};
  const resolvedSequence: ClawBotStep[] = [];

  for (const step of template.sequence) {
    let args = interpolateArgs(step.args, mergedInputs, prev, (citation ?? {}) as Record<string, unknown>);

    // Side-effect: execute ragRetrieve server-side to get real citation
    if (step.tool === 'ragRetrieve' && env.ragRetrieve) {
      try {
        const queryArg = typeof args.query === 'string' ? args.query : '';
        const topK = typeof args.topK === 'number' ? args.topK : 3;
        const chunks = await env.ragRetrieve(queryArg, topK);
        prev.chunks = chunks;
        const top = chunks?.[0];
        if (top) {
          const vol = (top.vol as string) ?? (top.volume_id as string) ?? citation?.vol ?? '';
          const page = (top.page as string | number) ?? (top.page_number as string | number) ?? citation?.page ?? '';
          const content = typeof top.content === 'string' ? (top.content as string).slice(0, 120) : '';
          citation = { vol: String(vol), page, verbatim: content };
          // Re-interpolate the rest of args (in case query referenced citation)
          args = interpolateArgs(step.args, mergedInputs, prev, citation as unknown as Record<string, unknown>);
        }
      } catch (_err) {
        // RAG failure is non-fatal — keep fallback citation.
      }
    }

    resolvedSequence.push({ step: step.step, tool: step.tool, args, expected_status: 'ok' });

    if (template.fallback_strategy === 'halt-on-error') {
      // No actual error possible here (we don't dispatch), but honour the
      // contract for future client relays.
    }
  }

  // Build response text: pull last speakTTS step text verbatim, append AZIONE
  // tags for the other tools. This matches existing `[AZIONE:...]` UNLIM
  // convention used by useGalileoChat.
  const speakStep = [...resolvedSequence].reverse().find(s => s.tool === 'speakTTS');
  const speakText = (speakStep?.args?.text as string | undefined) ?? '';

  const actionTags = resolvedSequence
    .filter(s => s.tool !== 'speakTTS')
    .map(s => `[AZIONE:${s.tool}:${safeJson(s.args)}]`)
    .join(' ');

  const responseText = [speakText, actionTags].filter(Boolean).join('\n\n');

  return {
    templateId: template.id,
    resolvedSequence,
    responseText,
    citation,
    latencyMs: Date.now() - t0,
  };
}

function safeJson(o: unknown): string {
  try {
    return JSON.stringify(o);
  } catch {
    return '{}';
  }
}

// ─── shouldUseIntentSchema widening — iter 40 Phase 2 Maker-1 ─────────────
//
// Sprint U Cycle 1 evidence (`docs/audits/PHASE-0-discovery-2026-05-02.md` §5
// + R7 fixture v53 Tester-6 iter 37): the canonical narrow heuristic in
// `_shared/intent-tools-schema.ts:133` (ACTION_TRIGGER_RE) only fires on
// 12 specific action verbs (mostra/evidenzia/carica/monta/screenshot/cattura/
// foto/scatta/pulisci/cancella/connect/collega/cambia/imposta), causing
// `shouldUseIntentSchema=true` on <5% of typical UNLIM prompts.
//
// Result: 95%+ R7 fixture passes WITHOUT the schema mode being engaged —
// Mistral function calling (json_schema response_format) provides far higher
// canonical INTENT capture, but only when triggered. Phase 2 widening adds
// 5+ NEW heuristic categories per Sprint U Cycle 1 finding:
//
//   1. EXPLANATION requests: spiega, spiegami, descrivi, descrivimi, illustra
//   2. DIAGNOSTIC requests: diagnos[ti], controlla, controlliamo, verifica,
//      verifichiamo, cosa-non-funziona, perche-non, errore
//   3. CIRCUIT VERIFICATION: guarda, osserva, esamina, ispeziona
//   4. STEP-BY-STEP requests: passo passo, step by step, mostrami come,
//      come si fa, come faccio
//   5. INTERACTIVE: prova, proviamo, testa, testiamo, simula, simuliamo
//
// All 5 categories overlap with browser-dispatchable INTENT outcomes
// (highlight + getCircuitState + captureScreenshot + getCircuitDescription).
//
// Backward compat: original ACTION_TRIGGER_RE narrow patterns from
// `intent-tools-schema.ts` PRESERVED (caller still imports the canonical
// narrow check; this widened export is the NEW recommended path post-iter-40).
//
// Iter 40 widen Phase 2 BASE_PROMPT v3.2 lift R7 ≥80% target (NOT yet verified
// post-deploy; gate Tester-2 R7 re-bench Phase 2 step 7).

/**
 * Widened heuristic patterns (iter 40 Phase 2). Each pattern listed below
 * adds a NEW category vs the canonical narrow ACTION_TRIGGER_RE.
 *
 * Maintains backward compat: superset of `_shared/intent-tools-schema.ts`
 * ACTION_TRIGGER_RE — i.e. anything that triggered narrow ALSO triggers
 * widened (no false negatives introduced).
 */
const WIDENED_INTENT_TRIGGERS: RegExp[] = [
  // CATEGORY 0 — Original narrow (backward compat, copied from intent-tools-schema.ts)
  /\b(mostra|mostrami|evidenzi[ai]|highlight|carica|monta|montami|montiamo|screenshot|cattura|foto|scatta|pulisci|cancella|connect[ai]?|collega|cambia|imposta)\b/i,
  // CATEGORY 1 — Explanation requests (likely highlight+description)
  // Match base + common suffixes (spiega/spiegami/spiegare/spieghi/spieghiamo etc).
  /\bspieg(?:a|ami|are|hi|hiamo|ate|ano)?\b/i,
  /\bdescriv(?:i|imi|ere|ono|iamo|ete)?\b/i,
  /\billustr(?:a|ami|are|i|iamo|ate)?\b/i,
  // CATEGORY 2 — Diagnostic requests (likely getCircuitState + highlight)
  /\bdiagnos[ti]/i,
  /\bcontrolla\b/i,
  /\bverific[ai]?\b/i,
  /\bcontrolliamo\b/i,
  /\bverifichiamo\b/i,
  /\b(cosa\s+non\s+funziona|perch[eé]\s+non)\b/i,
  /\berror[ei]?\b/i,
  // CATEGORY 3 — Circuit verification (visual inspection)
  /\bguard[ai]?\b/i,
  /\bosserv[ai]?\b/i,
  /\besamin[ai]?\b/i,
  /\bispezion[ai]?\b/i,
  // CATEGORY 4 — Step-by-step requests
  /\bpasso\s+passo\b/i,
  /\bstep\s+by\s+step\b/i,
  /\bcome\s+(si\s+fa|faccio|posso)\b/i,
  // CATEGORY 5 — Interactive verbs (simulation / try)
  /\bprov[ai]?\b/i,
  /\bproviamo\b/i,
  /\btest[ai]?\b/i,
  /\btestiamo\b/i,
  /\bsimul[ai]?\b/i,
  /\bsimuliamo\b/i,
];

/**
 * Detector heuristic — should the caller request structured Mistral output?
 *
 * WIDENED version per Sprint U Cycle 1 evidence (Phase 2 BASE_PROMPT v3.2).
 * Returns `true` when the message is a plausible candidate for browser-
 * dispatchable INTENT generation (action / explanation / diagnostic /
 * verification / step-by-step / interactive request).
 *
 * Use this in preference to the narrow `intent-tools-schema.ts:shouldUseIntentSchema`
 * for higher canonical INTENT capture on R7 fixture (target ≥80% post-deploy).
 *
 * @param message User message text (can be null/undefined).
 * @returns true if any widened heuristic pattern matches.
 */
export function shouldUseIntentSchema(message: string | null | undefined): boolean {
  if (!message || typeof message !== 'string') return false;
  for (const re of WIDENED_INTENT_TRIGGERS) {
    if (re.test(message)) return true;
  }
  return false;
}

/**
 * Widened heuristic categorization — exposes which category a message
 * matches (for telemetry / debugging). Returns array of category names that
 * matched, OR empty array if no match.
 */
export function categorizeIntentTriggers(message: string | null | undefined): string[] {
  if (!message || typeof message !== 'string') return [];
  const categories: string[] = [];
  const labels = ['narrow_action', 'explanation', 'explanation', 'explanation',
    'diagnostic', 'diagnostic', 'diagnostic', 'diagnostic', 'diagnostic',
    'diagnostic', 'diagnostic',
    'verification', 'verification', 'verification', 'verification',
    'step_by_step', 'step_by_step', 'step_by_step',
    'interactive', 'interactive', 'interactive', 'interactive', 'interactive', 'interactive'];
  WIDENED_INTENT_TRIGGERS.forEach((re, idx) => {
    if (re.test(message) && labels[idx] && !categories.includes(labels[idx])) {
      categories.push(labels[idx]);
    }
  });
  return categories;
}

export const SHOULD_USE_INTENT_SCHEMA_VERSION = '2.0-iter40-widened';
