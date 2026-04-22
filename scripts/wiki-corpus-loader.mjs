/**
 * wiki-corpus-loader.mjs — Sprint 4 Day 27 (S4.1.5b)
 *
 * File-based loader for the UNLIM wiki corpus. Walks a directory recursively,
 * parses markdown files with YAML front-matter, returns an array of entries
 * compatible with wiki-query-core.mjs makeRetriever(corpus).
 *
 * Pure ESM, no runtime deps, Node+Deno shared — follows ADR-007 module
 * extraction pattern.
 *
 * @see docs/architectures/ADR-007-module-extraction-pattern.md
 * @see scripts/wiki-query-core.mjs
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const FRONT_MATTER_RE = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/;

/**
 * Parse a minimal subset of YAML suitable for flat key:value front-matter.
 *
 * @param {string} yaml
 * @returns {Record<string, string|number|boolean>}
 */
export function parseSimpleYaml(yaml) {
  const out = {};
  const lines = yaml.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const sep = line.indexOf(':');
    if (sep <= 0) continue;
    const key = line.slice(0, sep).trim();
    let value = line.slice(sep + 1).trim();
    if (!key) continue;

    if (!value.startsWith('"') && !value.startsWith("'")) {
      const hashIdx = value.indexOf(' #');
      if (hashIdx >= 0) value = value.slice(0, hashIdx).trim();
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      out[key] = value.slice(1, -1);
      continue;
    }

    if (/^-?\d+$/.test(value)) {
      out[key] = parseInt(value, 10);
      continue;
    }

    if (value === 'true' || value === 'false') {
      out[key] = value === 'true';
      continue;
    }

    out[key] = value;
  }
  return out;
}

/**
 * Parse a wiki markdown string into front-matter + body.
 *
 * @param {string} raw
 * @returns {{ frontMatter: Record<string, any>, body: string }}
 */
export function parseWikiMarkdown(raw) {
  if (typeof raw !== 'string') {
    throw new TypeError('parseWikiMarkdown expects string');
  }
  const match = FRONT_MATTER_RE.exec(raw);
  if (!match) {
    throw new Error('missing YAML front-matter');
  }
  const frontMatter = parseSimpleYaml(match[1]);
  const body = (match[2] || '').trim();
  return { frontMatter, body };
}

/**
 * @param {{ frontMatter: Record<string, any>, body: string }} parsed
 * @param {string} sourcePath
 * @returns {object | null}
 */
export function normaliseEntry(parsed, sourcePath) {
  const fm = parsed.frontMatter || {};
  if (!fm.id || typeof fm.id !== 'string') return null;
  if (!fm.title || typeof fm.title !== 'string') return null;
  const volume = [1, 2, 3].includes(fm.volume) ? fm.volume : undefined;
  return {
    id: fm.id,
    title: fm.title,
    volume,
    chapter: typeof fm.chapter === 'string' ? fm.chapter : undefined,
    page: Number.isInteger(fm.page) ? fm.page : undefined,
    content: parsed.body || '',
    source: sourcePath,
  };
}

/**
 * Walk a directory recursively, collecting absolute paths of markdown files.
 *
 * @param {string} rootDir
 * @returns {Promise<string[]>}
 */
export async function collectMarkdownFiles(rootDir) {
  let rootStat;
  try {
    rootStat = await stat(rootDir);
  } catch {
    return [];
  }
  if (!rootStat.isDirectory()) return [];

  const results = [];
  async function walk(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      const full = join(dir, ent.name);
      if (ent.isDirectory()) {
        await walk(full);
      } else if (ent.isFile() && extname(ent.name).toLowerCase() === '.md') {
        results.push(full);
      }
    }
  }
  await walk(rootDir);
  return results.sort();
}

/**
 * Load the wiki corpus from disk. Empty/missing dir -> fallback array.
 *
 * @param {{ dir: string, fallback?: Array, onWarn?: (msg: string) => void }} opts
 * @returns {Promise<Array>}
 */
export async function loadCorpus({ dir, fallback = [], onWarn } = {}) {
  if (typeof dir !== 'string' || dir.length === 0) {
    return fallback;
  }
  const warn = typeof onWarn === 'function'
    ? onWarn
    : (msg) => { try { process.stderr.write(`[wiki-corpus-loader] ${msg}\n`); } catch {} };

  const files = await collectMarkdownFiles(dir);
  if (files.length === 0) return fallback;

  const entries = [];
  for (const file of files) {
    let raw;
    try {
      raw = await readFile(file, 'utf8');
    } catch (err) {
      warn(`read failed: ${file} (${err.message})`);
      continue;
    }
    let parsed;
    try {
      parsed = parseWikiMarkdown(raw);
    } catch (err) {
      warn(`parse failed: ${file} (${err.message})`);
      continue;
    }
    const entry = normaliseEntry(parsed, file);
    if (!entry) {
      warn(`skip (missing id/title): ${file}`);
      continue;
    }
    entries.push(entry);
  }
  return entries.length === 0 ? fallback : entries;
}
