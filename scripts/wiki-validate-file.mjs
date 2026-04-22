/**
 * wiki-validate-file.mjs — sett-4 S4.1.3 (Day 24)
 *
 * Validates a single UNLIM Wiki markdown file against SCHEMA v0.1.0.
 *
 * Checks:
 *   1. PZ v3 grep — no "Docente, leggi..." / "Insegnante, fai..."
 *   2. Front-matter YAML — present + required fields per SCHEMA §1.3
 *   3. Required body sections — by type (experiment/lesson/concept)
 *   4. Volume citation marker [volume:VolNpM] if volume_refs non-empty
 *
 * Output (stdout JSON):
 *   { path, type, pass, errors: [{ check, severity, message }] }
 *
 * Exit code: 0 if PASS, 1 if FAIL.
 *
 * Usage:
 *   node scripts/wiki-validate-file.mjs docs/unlim-wiki/experiments/v1-cap6-esp1.md
 *   cat file.md | node scripts/wiki-validate-file.mjs -
 *
 * @see docs/unlim-wiki/SCHEMA.md
 */

import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const PZ_V3_FORBIDDEN = /Docente,?\s*leggi|Insegnante,?\s*fai/i;

const REQUIRED_SECTIONS = {
  experiment: [
    '## Obiettivo',
    '## Testo dal volume',
    '## Componenti kit ELAB',
    '## Schema circuito',
    '## Concetti chiave',
    '## Errori comuni',
    '## Analogie vincenti',
  ],
  lesson: [
    '## Obiettivo lezione',
    '## Esperimenti raggruppati',
    '## Concetti copertura',
    '## Flusso narrativo libro',
  ],
  concept: [
    '## Definizione breve',
    '## Analogia principale',
    '## Fonti volumi',
    '## Analogie alternative',
    '## Concetti correlati',
  ],
};

const REQUIRED_FRONT_MATTER = ['id', 'type', 'created', 'updated', 'pz_v3_compliant'];

const VOLUME_CITATION_RE = /\[volume:Vol\d+p\d+\]/i;

/**
 * Split markdown into { frontMatter: Record<string, any>|null, body: string }.
 * Minimal YAML parser sufficient for flat scalars + arrays (no nested maps).
 */
export function parseMarkdown(text) {
  const fmMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!fmMatch) return { frontMatter: null, body: text };
  const fmRaw = fmMatch[1];
  const body = fmMatch[2] || '';
  const frontMatter = parseFrontMatter(fmRaw);
  return { frontMatter, body };
}

function parseFrontMatter(raw) {
  const out = {};
  const lines = raw.split(/\r?\n/);
  let currentKey = null;
  for (const rawLine of lines) {
    if (!rawLine.trim()) continue;
    if (rawLine.startsWith('  - ') || rawLine.startsWith('- ')) {
      if (currentKey && Array.isArray(out[currentKey])) {
        out[currentKey].push(stripQuotes(rawLine.replace(/^\s*-\s*/, '').trim()));
      }
      continue;
    }
    const m = rawLine.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    const valRaw = m[2].trim();
    currentKey = key;
    if (valRaw === '') {
      out[key] = [];
    } else if (valRaw.startsWith('[')) {
      out[key] = parseInlineArray(valRaw);
    } else if (valRaw === 'true' || valRaw === 'false') {
      out[key] = valRaw === 'true';
    } else if (/^-?\d+(\.\d+)?$/.test(valRaw)) {
      out[key] = Number(valRaw);
    } else {
      out[key] = stripQuotes(valRaw);
    }
  }
  return out;
}

function parseInlineArray(s) {
  const inner = s.replace(/^\[/, '').replace(/\]$/, '').trim();
  if (!inner) return [];
  return inner.split(',').map((x) => stripQuotes(x.trim()));
}

function stripQuotes(s) {
  if (s.length >= 2 && (s.startsWith('"') && s.endsWith('"') || s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

export function validate(text, { path = '<stdin>' } = {}) {
  const errors = [];

  if (PZ_V3_FORBIDDEN.test(text)) {
    errors.push({
      check: 'pz_v3_grep',
      severity: 'error',
      message: 'Principio Zero v3 violation: found "Docente, leggi" or "Insegnante, fai"',
    });
  }

  const { frontMatter, body } = parseMarkdown(text);

  if (!frontMatter) {
    errors.push({
      check: 'front_matter_present',
      severity: 'error',
      message: 'Missing front-matter (expected leading --- ... --- YAML block)',
    });
    return { path, type: null, pass: false, errors };
  }

  for (const key of REQUIRED_FRONT_MATTER) {
    if (!(key in frontMatter)) {
      errors.push({
        check: 'front_matter_field',
        severity: 'error',
        message: `Missing required front-matter field: ${key}`,
      });
    }
  }

  const type = frontMatter.type;
  if (!type || !(type in REQUIRED_SECTIONS)) {
    errors.push({
      check: 'type_valid',
      severity: 'error',
      message: `Invalid or unknown type: ${JSON.stringify(type)}. Expected one of: ${Object.keys(REQUIRED_SECTIONS).join(', ')}`,
    });
  } else {
    for (const section of REQUIRED_SECTIONS[type]) {
      const re = new RegExp('^' + section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'm');
      if (!re.test(body)) {
        errors.push({
          check: 'required_section',
          severity: 'error',
          message: `Missing required section for type "${type}": ${section}`,
        });
      }
    }
  }

  const volumeRefs = Array.isArray(frontMatter.volume_refs) ? frontMatter.volume_refs : [];
  if (volumeRefs.length > 0 && !VOLUME_CITATION_RE.test(body)) {
    errors.push({
      check: 'volume_citation',
      severity: 'error',
      message: 'volume_refs declared but no [volume:VolNpM] citation marker found in body',
    });
  }

  const pass = errors.length === 0;
  return { path, type: type || null, pass, errors };
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

async function main() {
  const arg = process.argv[2];
  if (!arg || arg === '--help' || arg === '-h') {
    console.error('Usage: wiki-validate-file.mjs <path | ->');
    process.exit(2);
  }
  const text = arg === '-' ? await readStdin() : await readFile(arg, 'utf8');
  const report = validate(text, { path: arg === '-' ? '<stdin>' : arg });
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  process.exit(report.pass ? 0 : 1);
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  main().catch((err) => {
    console.error('[wiki-validate-file] FAILED:', err);
    process.exit(2);
  });
}
