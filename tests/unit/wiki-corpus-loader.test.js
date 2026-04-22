import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  parseSimpleYaml,
  parseWikiMarkdown,
  normaliseEntry,
  collectMarkdownFiles,
  loadCorpus,
} from '../../scripts/wiki-corpus-loader.mjs';

let tmpRoot;

beforeEach(async () => {
  tmpRoot = await mkdtemp(join(tmpdir(), 'wiki-corpus-'));
});

afterEach(async () => {
  if (tmpRoot) await rm(tmpRoot, { recursive: true, force: true });
  tmpRoot = undefined;
});

describe('parseSimpleYaml', () => {
  it('parses bare scalar strings', () => {
    expect(parseSimpleYaml('id: v1-cap6-esp1\ntitle: LED rosso')).toEqual({
      id: 'v1-cap6-esp1',
      title: 'LED rosso',
    });
  });

  it('parses double-quoted strings preserving colons', () => {
    expect(parseSimpleYaml('chapter: "Capitolo 6: LED"')).toEqual({
      chapter: 'Capitolo 6: LED',
    });
  });

  it('parses single-quoted strings', () => {
    expect(parseSimpleYaml("title: 'Pulsante'\nid: x"))
      .toEqual({ title: 'Pulsante', id: 'x' });
  });

  it('parses integers', () => {
    expect(parseSimpleYaml('page: 29\nvolume: 1')).toEqual({ page: 29, volume: 1 });
  });

  it('parses booleans', () => {
    expect(parseSimpleYaml('pz_v3_compliant: true\ndraft: false'))
      .toEqual({ pz_v3_compliant: true, draft: false });
  });

  it('ignores comment lines and blank lines', () => {
    const yaml = '# top comment\n\nid: a\n# mid\ntitle: b\n';
    expect(parseSimpleYaml(yaml)).toEqual({ id: 'a', title: 'b' });
  });

  it('strips inline comments from unquoted values', () => {
    expect(parseSimpleYaml('page: 29 # page number')).toEqual({ page: 29 });
  });

  it('returns empty object for empty input', () => {
    expect(parseSimpleYaml('')).toEqual({});
  });
});

describe('parseWikiMarkdown', () => {
  it('extracts front-matter and body', () => {
    const raw = '---\nid: a\ntitle: b\n---\nBody text here';
    const { frontMatter, body } = parseWikiMarkdown(raw);
    expect(frontMatter).toEqual({ id: 'a', title: 'b' });
    expect(body).toBe('Body text here');
  });

  it('handles CRLF line endings', () => {
    const raw = '---\r\nid: a\r\ntitle: b\r\n---\r\nContent';
    const { frontMatter, body } = parseWikiMarkdown(raw);
    expect(frontMatter.id).toBe('a');
    expect(body).toBe('Content');
  });

  it('throws when front-matter delimiter is missing', () => {
    expect(() => parseWikiMarkdown('no front matter here'))
      .toThrow(/front-matter/);
  });

  it('throws on non-string input', () => {
    expect(() => parseWikiMarkdown(null)).toThrow(TypeError);
    expect(() => parseWikiMarkdown(42)).toThrow(TypeError);
  });

  it('returns empty body when only front-matter present', () => {
    const raw = '---\nid: a\ntitle: b\n---\n';
    const { body } = parseWikiMarkdown(raw);
    expect(body).toBe('');
  });
});

describe('normaliseEntry', () => {
  it('builds entry from full front-matter', () => {
    const parsed = {
      frontMatter: { id: 'x', title: 't', volume: 2, chapter: 'Cap 3', page: 10 },
      body: 'body',
    };
    const entry = normaliseEntry(parsed, '/tmp/x.md');
    expect(entry).toEqual({
      id: 'x',
      title: 't',
      volume: 2,
      chapter: 'Cap 3',
      page: 10,
      content: 'body',
      source: '/tmp/x.md',
    });
  });

  it('returns null when id missing', () => {
    expect(normaliseEntry({ frontMatter: { title: 't' }, body: '' }, '/x')).toBeNull();
  });

  it('returns null when title missing', () => {
    expect(normaliseEntry({ frontMatter: { id: 'x' }, body: '' }, '/x')).toBeNull();
  });

  it('drops invalid volume values', () => {
    const parsed = { frontMatter: { id: 'x', title: 't', volume: 7 }, body: '' };
    expect(normaliseEntry(parsed, '/x').volume).toBeUndefined();
  });

  it('drops non-integer page values', () => {
    const parsed = { frontMatter: { id: 'x', title: 't', page: 'twelve' }, body: '' };
    expect(normaliseEntry(parsed, '/x').page).toBeUndefined();
  });
});

describe('collectMarkdownFiles', () => {
  it('returns [] for missing directory', async () => {
    const files = await collectMarkdownFiles(join(tmpRoot, 'does-not-exist'));
    expect(files).toEqual([]);
  });

  it('returns [] when path is a file, not a directory', async () => {
    const p = join(tmpRoot, 'not-a-dir.md');
    await writeFile(p, 'stub');
    expect(await collectMarkdownFiles(p)).toEqual([]);
  });

  it('collects md files at root level', async () => {
    await writeFile(join(tmpRoot, 'a.md'), 'x');
    await writeFile(join(tmpRoot, 'b.md'), 'y');
    await writeFile(join(tmpRoot, 'ignore.txt'), 'z');
    const files = await collectMarkdownFiles(tmpRoot);
    expect(files).toHaveLength(2);
    expect(files.every((f) => f.endsWith('.md'))).toBe(true);
  });

  it('walks nested directories', async () => {
    await mkdir(join(tmpRoot, 'sub', 'deep'), { recursive: true });
    await writeFile(join(tmpRoot, 'sub', 'deep', 'nested.md'), 'x');
    await writeFile(join(tmpRoot, 'root.md'), 'y');
    const files = await collectMarkdownFiles(tmpRoot);
    expect(files).toHaveLength(2);
  });

  it('returns sorted paths deterministically', async () => {
    await writeFile(join(tmpRoot, 'z.md'), 'x');
    await writeFile(join(tmpRoot, 'a.md'), 'x');
    await writeFile(join(tmpRoot, 'm.md'), 'x');
    const files = await collectMarkdownFiles(tmpRoot);
    expect(files[0].endsWith('a.md')).toBe(true);
    expect(files[2].endsWith('z.md')).toBe(true);
  });
});

describe('loadCorpus', () => {
  const fallback = [{ id: 'fb', title: 'Fallback', content: 'x' }];

  it('returns fallback when dir missing', async () => {
    const out = await loadCorpus({ dir: join(tmpRoot, 'nope'), fallback });
    expect(out).toBe(fallback);
  });

  it('returns fallback when dir empty', async () => {
    const out = await loadCorpus({ dir: tmpRoot, fallback });
    expect(out).toBe(fallback);
  });

  it('returns fallback when dir arg missing', async () => {
    const out = await loadCorpus({ fallback });
    expect(out).toBe(fallback);
  });

  it('parses well-formed files and returns entries', async () => {
    await writeFile(
      join(tmpRoot, 'a.md'),
      '---\nid: a\ntitle: LED\nvolume: 1\npage: 29\n---\nLED rosso con resistenza',
    );
    await writeFile(
      join(tmpRoot, 'b.md'),
      '---\nid: b\ntitle: Pulsante\nvolume: 2\n---\nIl pulsante legge HIGH',
    );
    const out = await loadCorpus({ dir: tmpRoot, fallback });
    expect(out).toHaveLength(2);
    expect(out[0].id).toBe('a');
    expect(out[0].page).toBe(29);
    expect(out[1].volume).toBe(2);
  });

  it('skips malformed files and keeps valid ones', async () => {
    const warnings = [];
    await writeFile(join(tmpRoot, 'good.md'), '---\nid: g\ntitle: Good\n---\nok');
    await writeFile(join(tmpRoot, 'bad.md'), 'no front-matter at all');
    await writeFile(join(tmpRoot, 'partial.md'), '---\nid: p\n---\nmissing title');
    const out = await loadCorpus({
      dir: tmpRoot,
      fallback,
      onWarn: (m) => warnings.push(m),
    });
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('g');
    expect(warnings.some((w) => w.includes('parse failed'))).toBe(true);
    expect(warnings.some((w) => w.includes('missing id/title'))).toBe(true);
  });

  it('returns fallback when all files invalid', async () => {
    await writeFile(join(tmpRoot, 'bad.md'), 'garbage');
    const out = await loadCorpus({ dir: tmpRoot, fallback, onWarn: () => {} });
    expect(out).toBe(fallback);
  });
});
