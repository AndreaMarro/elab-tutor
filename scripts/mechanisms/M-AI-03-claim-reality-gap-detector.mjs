#!/usr/bin/env node
// M-AI-03 Claim-Reality Gap Detector (iter 31 RALPH DEEP, Sprint T close)
// Scans docs/audits/*.md + CLAUDE.md for claims like "deployed prod", "LIVE", "enforced",
// "Edge Function vNN deployed", "vitest NNNN PASS", "ToolSpec count NN",
// "Voyage RAG NN chunks", "canary CANARY_DENO_DISPATCH_PERCENT=NN".
// Cross-references each claim against actual reality.
// Outputs JSON gap report to automa/state/claim-reality-gap-{date}.json + console table.
// Exit 0 = report written (gaps may exist), exit 1 = scan error.
//
// Usage:
//   node scripts/mechanisms/M-AI-03-claim-reality-gap-detector.mjs

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { exit, cwd, env } from 'node:process';

const REPO_ROOT = cwd();
const AUDITS_DIR = resolve(REPO_ROOT, 'docs/audits');
const CLAUDE_MD = resolve(REPO_ROOT, 'CLAUDE.md');
const BASELINE_TESTS = resolve(REPO_ROOT, 'automa/baseline-tests.txt');
const TOOLS_REGISTRY = resolve(REPO_ROOT, 'scripts/openclaw/tools-registry.ts');
const TODAY = new Date().toISOString().slice(0, 10);
const OUT_PATH = resolve(REPO_ROOT, `automa/state/claim-reality-gap-${TODAY}.json`);

// Safe wrapper around execFileSync (no shell, no injection).
// Args MUST be array; never string concatenation.
function safeRun(file, args = [], opts = {}) {
  try {
    return execFileSync(file, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      ...opts,
    }).trim();
  } catch {
    return '';
  }
}

function readSafe(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return '';
  }
}

// Reality probes
function realityEdgeFunctionVersion(name) {
  if (!env.SUPABASE_ACCESS_TOKEN) return { skipped: true, reason: 'SUPABASE_ACCESS_TOKEN missing' };
  const out = safeRun('npx', [
    'supabase',
    'functions',
    'list',
    '--project-ref',
    'euqpdueopmlllqjmqnyb',
  ]);
  if (!out) return { skipped: true, reason: 'supabase CLI no output' };
  const line = out.split('\n').find((l) => l.includes(name));
  if (!line) return { value: null, note: `function ${name} not in list` };
  const m = line.match(/v?(\d+)/);
  return { value: m ? parseInt(m[1], 10) : null };
}

function realityVitestCount() {
  const txt = readSafe(BASELINE_TESTS).trim();
  const n = parseInt(txt, 10);
  return Number.isFinite(n) ? { value: n } : { value: null, note: 'baseline-tests.txt unreadable' };
}

function realityToolSpecCount() {
  if (!existsSync(TOOLS_REGISTRY)) return { value: null, note: 'tools-registry.ts missing' };
  const txt = readFileSync(TOOLS_REGISTRY, 'utf8');
  const matches = txt.match(/name:\s*['"][a-zA-Z0-9_-]+['"]/g) || [];
  return { value: matches.length };
}

function realityRagChunks() {
  if (!env.SUPABASE_ACCESS_TOKEN) return { skipped: true, reason: 'SUPABASE_ACCESS_TOKEN missing' };
  const out = safeRun('npx', [
    'supabase',
    'db',
    'query',
    '--linked',
    'SELECT count(*) FROM elab_rag_chunks;',
  ]);
  const m = out.match(/(\d+)/);
  return m ? { value: parseInt(m[1], 10) } : { value: null, note: 'query returned no rows' };
}

function realityCanaryPercent() {
  if (!env.SUPABASE_ACCESS_TOKEN) return { skipped: true, reason: 'SUPABASE_ACCESS_TOKEN missing' };
  const out = safeRun('npx', [
    'supabase',
    'secrets',
    'list',
    '--project-ref',
    'euqpdueopmlllqjmqnyb',
  ]);
  const line = out.split('\n').find((l) => l.includes('CANARY_DENO_DISPATCH_PERCENT'));
  if (!line) return { value: null, note: 'secret not found or hidden' };
  const m = line.match(/(\d+)\s*$/);
  return m ? { value: parseInt(m[1], 10) } : { value: null, note: 'secret value masked' };
}

// Claim extractors (regex on text, no shell)
const CLAIM_PATTERNS = [
  {
    kind: 'edge_function_version',
    re: /(unlim-[a-z]+|warmup)\s+v?(\d+)\s+(?:deployed|LIVE|prod)/gi,
    parse: (m) => ({ name: m[1], version: parseInt(m[2], 10) }),
  },
  {
    kind: 'vitest_pass',
    re: /vitest\s+(\d{3,5})\s+(?:PASS|baseline)/gi,
    parse: (m) => ({ count: parseInt(m[1], 10) }),
  },
  {
    kind: 'toolspec_count',
    re: /ToolSpec\s+count\s+(\d+)/gi,
    parse: (m) => ({ count: parseInt(m[1], 10) }),
  },
  {
    kind: 'voyage_rag_chunks',
    re: /Voyage\s+RAG\s+(\d+)\s+chunks?/gi,
    parse: (m) => ({ count: parseInt(m[1], 10) }),
  },
  {
    kind: 'canary_percent',
    re: /CANARY_DENO_DISPATCH_PERCENT\s*=\s*(\d+)/gi,
    parse: (m) => ({ percent: parseInt(m[1], 10) }),
  },
];

function extractClaims(text, source) {
  const claims = [];
  for (const { kind, re, parse } of CLAIM_PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      claims.push({ kind, source, parsed: parse(m), raw: m[0] });
    }
  }
  return claims;
}

function gatherSources() {
  const sources = [];
  if (existsSync(AUDITS_DIR)) {
    for (const f of readdirSync(AUDITS_DIR)) {
      if (f.endsWith('.md')) sources.push({ path: join(AUDITS_DIR, f), tag: `audits/${f}` });
    }
  }
  if (existsSync(CLAUDE_MD)) sources.push({ path: CLAUDE_MD, tag: 'CLAUDE.md' });
  return sources;
}

function compareClaim(claim, realityCache) {
  let actual = null;
  let skipped = false;
  let reason = null;
  switch (claim.kind) {
    case 'edge_function_version': {
      const key = `efv:${claim.parsed.name}`;
      realityCache[key] ||= realityEdgeFunctionVersion(claim.parsed.name);
      const r = realityCache[key];
      if (r.skipped) { skipped = true; reason = r.reason; break; }
      actual = r.value;
      break;
    }
    case 'vitest_pass': {
      realityCache.vitest ||= realityVitestCount();
      actual = realityCache.vitest.value;
      break;
    }
    case 'toolspec_count': {
      realityCache.toolspec ||= realityToolSpecCount();
      actual = realityCache.toolspec.value;
      break;
    }
    case 'voyage_rag_chunks': {
      realityCache.rag ||= realityRagChunks();
      const r = realityCache.rag;
      if (r.skipped) { skipped = true; reason = r.reason; break; }
      actual = r.value;
      break;
    }
    case 'canary_percent': {
      realityCache.canary ||= realityCanaryPercent();
      const r = realityCache.canary;
      if (r.skipped) { skipped = true; reason = r.reason; break; }
      actual = r.value;
      break;
    }
  }
  const claimedVal = claim.parsed.version ?? claim.parsed.count ?? claim.parsed.percent ?? null;
  const gap = !skipped && actual !== null && claimedVal !== null && actual !== claimedVal;
  return { ...claim, actual, claimed: claimedVal, gap, skipped, reason };
}

function main() {
  const sources = gatherSources();
  const allClaims = [];
  for (const { path, tag } of sources) {
    const txt = readSafe(path);
    if (!txt) continue;
    allClaims.push(...extractClaims(txt, tag));
  }

  const realityCache = {};
  const compared = allClaims.map((c) => compareClaim(c, realityCache));

  const gaps = compared.filter((c) => c.gap);
  const skipped = compared.filter((c) => c.skipped);

  const report = {
    generated_at: new Date().toISOString(),
    repo_root: REPO_ROOT,
    sources_scanned: sources.length,
    claims_total: compared.length,
    claims_with_gap: gaps.length,
    claims_skipped: skipped.length,
    claims: compared,
  };

  writeFileSync(OUT_PATH, JSON.stringify(report, null, 2));
  console.log(`Report written: ${OUT_PATH}`);
  console.log('');
  console.log('Kind                  | Source                              | Claimed | Actual  | Gap');
  console.log('----------------------|-------------------------------------|---------|---------|----');
  for (const c of compared.slice(0, 40)) {
    const k = (c.kind || '').padEnd(21);
    const s = (c.source || '').slice(0, 35).padEnd(35);
    const cl = String(c.claimed ?? '-').padEnd(7);
    const ac = String(c.skipped ? 'SKIP' : (c.actual ?? '-')).padEnd(7);
    const gp = c.skipped ? 'skip' : (c.gap ? 'YES' : 'no');
    console.log(`${k} | ${s} | ${cl} | ${ac} | ${gp}`);
  }
  if (compared.length > 40) console.log(`... (${compared.length - 40} more in JSON)`);
  console.log('');
  console.log(`Summary: ${gaps.length} gaps, ${skipped.length} skipped, ${compared.length - gaps.length - skipped.length} match.`);

  exit(0);
}

main();
