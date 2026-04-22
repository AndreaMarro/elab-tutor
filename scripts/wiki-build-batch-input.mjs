/**
 * wiki-build-batch-input.mjs — sett-4 S4.1.3 (Day 24)
 *
 * Emits Together AI Batch API JSONL from VOLUME_REFERENCES + LESSON_GROUPS.
 * Zero LLM invocation; purely deterministic JSONL emission for offline review
 * + subsequent `/v1/batches` upload.
 *
 * Inputs:
 *   - src/data/volume-references.js (92 experiments w/ bookText, bookInstructions, etc.)
 *   - src/data/lesson-groups.js     (27 lessons w/ concept, experiments[])
 *
 * Output:
 *   JSONL where each line is: { custom_id, body: { model, messages, max_tokens, temperature } }
 *
 * PZ v3 enforcement: system prompt mandates zero meta-istruzioni "Docente, leggi" + citation
 * `[volume:VolNpM]` marker + front-matter schema per SCHEMA.md §1.3.
 *
 * Idempotent: keys sorted lexicographically; JSON stringified deterministically.
 *
 * CLI:
 *   node scripts/wiki-build-batch-input.mjs --type experiments --out /tmp/wiki-batch.jsonl
 *   node scripts/wiki-build-batch-input.mjs --type lessons --limit 5
 *   node scripts/wiki-build-batch-input.mjs --type all --out /tmp/wiki-batch.jsonl
 *
 * @see docs/unlim-wiki/SCHEMA.md
 * @see docs/architectures/ADR-006-karpathy-llm-wiki-three-layer.md
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const MODEL = 'meta-llama/Llama-3.3-70B-Instruct-Turbo';
const MAX_TOKENS = 2048;
const TEMPERATURE = 0.3;

const PZ_V3_RULES = [
  'MAI scrivere "Docente, leggi..." o "Insegnante, fai..." — zero meta-istruzioni imperative',
  'SEMPRE linguaggio utile al docente per parlare ai ragazzi con le parole del libro',
  'SEMPRE citazione pagina volume come [volume:VolNpM] (es. [volume:Vol1p29])',
  'MAI inventare componenti assenti dai kit ELAB fisici',
  'SEMPRE accessibile a bambini 8-14 anni: max 3 frasi + 1 analogia, ~60 parole',
];

const EXPERIMENT_SECTIONS = [
  '## Obiettivo',
  '## Testo dal volume',
  '## Componenti kit ELAB',
  '## Schema circuito',
  '## Concetti chiave',
  '## Errori comuni',
  '## Analogie vincenti',
];

const LESSON_SECTIONS = [
  '## Obiettivo lezione',
  '## Esperimenti raggruppati',
  '## Concetti copertura',
  '## Flusso narrativo libro',
];

export function buildSystemPrompt({ type }) {
  const sections = type === 'experiment' ? EXPERIMENT_SECTIONS : LESSON_SECTIONS;
  return [
    'Sei un redattore del wiki UNLIM per ELAB Tutor (bambini 8-14, elettronica Arduino).',
    '',
    'PRINCIPIO ZERO v3 (vincolante):',
    ...PZ_V3_RULES.map((rule, i) => `  ${i + 1}. ${rule}`),
    '',
    `Devi produrre un file markdown valido secondo lo SCHEMA UNLIM v0.1.0 per tipo "${type}".`,
    '',
    'Struttura obbligatoria:',
    '1. Front-matter YAML con campi: id, type, created, updated, volume_refs, kit_components, difficulty, concepts, lessons, ingest_cost_usd, ingest_model, pz_v3_compliant',
    '2. Body con sezioni nell\'ordine esatto:',
    ...sections.map((s) => `   ${s}`),
    '',
    'Vincoli extra:',
    '- Citazione letterale bookText dal volume (non parafrasare)',
    '- Componenti SOLO da lista kit fornita (niente inventato)',
    '- Cross-ref concetti: formato [Nome](../concepts/slug.md)',
    '- Marker [volume:VolNpM] OGNI volta che citi una pagina',
    '- NO emoji nel corpo (eccetto ✅❌⚠️ se necessario)',
    '',
    'Output: SOLO il markdown, inizia direttamente con "---" del front-matter. Nessun commento extra.',
  ].join('\n');
}

export function buildExperimentUserPrompt(id, ref, lessonMeta) {
  const { volume, bookPage, chapter, bookText, bookInstructions = [], bookQuote, bookContext } = ref;
  const lessonLink = lessonMeta ? lessonMeta.lessonId : null;
  const nowIso = '2026-04-24T00:00:00Z';

  return [
    `Genera il file esperimento \`experiments/${id}.md\`.`,
    '',
    'METADATA FRONT-MATTER (usa questi valori esatti):',
    `  id: ${id}`,
    `  type: experiment`,
    `  created: ${nowIso}`,
    `  updated: ${nowIso}`,
    `  volume_refs: ["Vol${volume}:p.${bookPage}"]`,
    `  difficulty: 1`,
    `  ingest_cost_usd: 0.02`,
    `  ingest_model: "${MODEL}"`,
    `  pz_v3_compliant: true`,
    lessonLink ? `  lessons: ["${lessonLink}"]` : `  lessons: []`,
    '',
    'FONTE LIBRO (citare letteralmente in ## Testo dal volume):',
    `  Volume: ${volume}, pagina: ${bookPage}, capitolo: ${chapter}`,
    `  bookText: "${escapeQuotes(bookText)}"`,
    bookQuote ? `  bookQuote: "${escapeQuotes(bookQuote)}"` : '',
    bookContext ? `  bookContext: "${escapeQuotes(bookContext)}"` : '',
    '',
    'ISTRUZIONI LIBRO (rielabora come narrativa, NON copiare):',
    ...bookInstructions.map((step, i) => `  ${i + 1}. ${step}`),
    '',
    'Inferisci kit_components dalle istruzioni e da bookText (solo componenti esplicitamente menzionati).',
    'Inferisci concepts (slug minuscolo kebab) dalle istruzioni: es. ["led", "legge-ohm"].',
    '',
    `Marker citazione: [volume:Vol${volume}p${bookPage}]`,
  ].filter(Boolean).join('\n');
}

export function buildLessonUserPrompt(id, lesson) {
  const { title, concept, volume, chapter, experiments = [] } = lesson;
  const nowIso = '2026-04-24T00:00:00Z';

  return [
    `Genera il file lezione \`lessons/${id}.md\`.`,
    '',
    'METADATA FRONT-MATTER (usa questi valori esatti):',
    `  id: ${id}`,
    `  type: lesson`,
    `  created: ${nowIso}`,
    `  updated: ${nowIso}`,
    `  volume_refs: ["Vol${volume}:cap.${chapter}"]`,
    `  difficulty: 1`,
    `  ingest_cost_usd: 0.02`,
    `  ingest_model: "${MODEL}"`,
    `  pz_v3_compliant: true`,
    `  experiments: ${JSON.stringify(experiments)}`,
    '',
    'CONTENUTO LEZIONE:',
    `  Titolo: ${title}`,
    `  Concetto: ${concept}`,
    `  Volume ${volume}, capitolo ${chapter}`,
    `  Esperimenti raggruppati: ${experiments.join(', ')}`,
    '',
    'In ## Flusso narrativo libro descrivi come il libro introduce il concetto (narrativa continua, non card).',
    'In ## Concetti copertura usa formato [Nome](../concepts/slug.md).',
  ].join('\n');
}

function escapeQuotes(s = '') {
  return String(s).replace(/"/g, '\\"');
}

function deterministicStringify(obj) {
  const sortedKeys = (o) => {
    if (Array.isArray(o)) return o.map(sortedKeys);
    if (o && typeof o === 'object') {
      return Object.keys(o).sort().reduce((acc, k) => {
        acc[k] = sortedKeys(o[k]);
        return acc;
      }, {});
    }
    return o;
  };
  return JSON.stringify(sortedKeys(obj));
}

export function buildExperimentRecords(volumeRefs, lessonGroups) {
  const expToLesson = new Map();
  for (const [lessonId, lesson] of Object.entries(lessonGroups)) {
    for (const expId of lesson.experiments || []) {
      expToLesson.set(expId, { lessonId, lesson });
    }
  }

  const ids = Object.keys(volumeRefs).sort();
  return ids.map((id) => {
    const ref = volumeRefs[id];
    const lessonMeta = expToLesson.get(id) || null;
    return {
      custom_id: `experiment-${id}`,
      body: {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        messages: [
          { role: 'system', content: buildSystemPrompt({ type: 'experiment' }) },
          { role: 'user', content: buildExperimentUserPrompt(id, ref, lessonMeta) },
        ],
      },
    };
  });
}

export function buildLessonRecords(lessonGroups) {
  const ids = Object.keys(lessonGroups).sort();
  return ids.map((id) => {
    const lesson = lessonGroups[id];
    return {
      custom_id: `lesson-${id}`,
      body: {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        messages: [
          { role: 'system', content: buildSystemPrompt({ type: 'lesson' }) },
          { role: 'user', content: buildLessonUserPrompt(id, lesson) },
        ],
      },
    };
  });
}

export async function loadData(root) {
  const volumeRefsUrl = pathToFileURL(resolve(root, 'src/data/volume-references.js')).href;
  const lessonGroupsUrl = pathToFileURL(resolve(root, 'src/data/lesson-groups.js')).href;
  const [{ default: volumeRefs }, { default: lessonGroups }] = await Promise.all([
    import(volumeRefsUrl),
    import(lessonGroupsUrl),
  ]);
  return { volumeRefs, lessonGroups };
}

function parseArgs(argv) {
  const args = { type: 'all', out: null, limit: null };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--type') args.type = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--limit') args.limit = Number.parseInt(argv[++i], 10);
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

export async function buildBatch({ type = 'all', limit = null, volumeRefs, lessonGroups }) {
  let records = [];
  if (type === 'experiments' || type === 'all') {
    records = records.concat(buildExperimentRecords(volumeRefs, lessonGroups));
  }
  if (type === 'lessons' || type === 'all') {
    records = records.concat(buildLessonRecords(lessonGroups));
  }
  if (limit != null && Number.isFinite(limit) && limit > 0) {
    records = records.slice(0, limit);
  }
  return records;
}

export function serialize(records) {
  return records.map((r) => deterministicStringify(r)).join('\n') + '\n';
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log('Usage: wiki-build-batch-input.mjs [--type experiments|lessons|all] [--out path] [--limit N]');
    process.exit(0);
  }

  const here = dirname(fileURLToPath(import.meta.url));
  const root = resolve(here, '..');
  const { volumeRefs, lessonGroups } = await loadData(root);
  const records = await buildBatch({ type: args.type, limit: args.limit, volumeRefs, lessonGroups });
  const payload = serialize(records);

  if (args.out) {
    await mkdir(dirname(resolve(args.out)), { recursive: true });
    await writeFile(args.out, payload, 'utf8');
    console.error(`[wiki-build-batch-input] wrote ${records.length} records → ${args.out}`);
  } else {
    process.stdout.write(payload);
  }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  main().catch((err) => {
    console.error('[wiki-build-batch-input] FAILED:', err);
    process.exit(1);
  });
}
