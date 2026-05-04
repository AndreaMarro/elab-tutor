#!/usr/bin/env node
// M-AI-06 Prompt State Validator (iter 38, anti-inflation gate)
//
// Scans iter close prompts (docs/handoff/*PROMPT*.md, docs/handoff/*-handoff.md,
// docs/superpowers/plans/*master-plan*.md) for atom claims like:
//   "P0.X NOT impl" | "atom NOT shipped" | "carryover P0.X" | "MA NOT impl"
//   "internal gate ... NOT impl" | "shipped MA ... NOT" | "still NOT" | "non ancora"
// then cross-references each claim against file system reality:
//   - If claim cites file:line → grep target file for expected absence/presence
//   - If claim cites function name / component → grep src/ + supabase/ for definition
//   - If claim cites commit SHA → verify git log shows post-iter commit
//
// Catches iter 37 close pattern: 4 atomi already shipped past iter were claimed
// "NOT impl" in iter 37 prompt § (P0.2 + shouldUseIntentSchema + G3 + wake word).
//
// Outputs JSON to automa/state/prompt-state-{date}.json + console table.
// Exit 0 = scan complete (drift may exist), exit 2 = HIGH drift count >= threshold.
//
// Usage:
//   node scripts/mechanisms/M-AI-06-prompt-state-validator.mjs [path-to-prompt-md]
//   (default: scans most recent docs/handoff/*PROMPT*.md AND docs/handoff/*-handoff.md)

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { exit, cwd, argv } from 'node:process';

const REPO_ROOT = cwd();
const HANDOFF_DIR = resolve(REPO_ROOT, 'docs/handoff');
const PLANS_DIR = resolve(REPO_ROOT, 'docs/superpowers/plans');
const TODAY = new Date().toISOString().slice(0, 10);
const OUT_PATH = resolve(REPO_ROOT, `automa/state/prompt-state-${TODAY}.json`);
const HIGH_DRIFT_EXIT_THRESHOLD = 5;

const NEGATIVE_CLAIM_PATTERNS = [
  /\b(P0\.\d+)\b[\s\S]{0,300}?\b(NOT impl|MA NOT|MA internal gate[\s\S]{0,60}?NOT impl|MA internal[\s\S]{0,40}?NOT)\b/gi,
  /\b(P0\.\d+)\b[\s\S]{0,300}?\b(carryover|deferred iter|pending iter|NON-existent|still NOT)\b/gi,
  /\b(atom\s+\w+)[\s\S]{0,200}?\b(NOT impl|NOT shipped|still NOT|non ancora|NON-existent)\b/gi,
  /\b(NON-existent|NOT yet impl|MA internal NOT|hide NOT impl)\b[\s\S]{0,80}/gi,
  /\b(currently prop pass|prop pass[\s\S]{0,80}?(?:internal|breadboard)[\s\S]{0,40}?NOT impl)\b/gi,
];

// Heuristic file-name patterns inside claims
const FILE_REFERENCE_PATTERN = /\b([A-Za-z][A-Za-z0-9_-]+\.(jsx?|tsx?|js|ts|mjs|md))(:\d+(?:-\d+)?)?\b/g;
const FUNCTION_REFERENCE_PATTERN = /\b(?:function|export function|const|let)\s+([A-Z][A-Za-z0-9_]+)/g;
const COMMIT_SHA_PATTERN = /\b([0-9a-f]{7,40})\b/g;

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
    return null;
  }
}

function findRecentPrompts() {
  const candidates = [];
  for (const dir of [HANDOFF_DIR, PLANS_DIR]) {
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir)) {
      if (!/\.md$/.test(file)) continue;
      if (!/PROMPT|handoff|master-plan/i.test(file)) continue;
      const full = join(dir, file);
      const stat = statSync(full);
      candidates.push({ path: full, mtime: stat.mtimeMs });
    }
  }
  candidates.sort((a, b) => b.mtime - a.mtime);
  return candidates.slice(0, 4).map(c => c.path);
}

function locateFile(filename) {
  // Search src/, supabase/, scripts/, tests/
  const dirs = ['src', 'supabase', 'scripts', 'tests', 'docs'];
  for (const d of dirs) {
    const findOut = safeRun('find', [d, '-name', filename, '-type', 'f']);
    if (findOut) {
      return findOut.split('\n')[0];
    }
  }
  return null;
}

function checkClaim(claim, sourceFile) {
  const findings = [];
  const fileRefs = [...claim.matchAll(FILE_REFERENCE_PATTERN)];
  const fnRefs = [...claim.matchAll(FUNCTION_REFERENCE_PATTERN)];
  const shaRefs = [...claim.matchAll(COMMIT_SHA_PATTERN)];

  // Check file references for actual existence + relevant content
  for (const m of fileRefs) {
    const filename = m[1];
    if (filename.endsWith('.md')) continue;
    const located = locateFile(filename);
    if (!located) continue;
    const content = readSafe(resolve(REPO_ROOT, located)) || '';
    // Heuristic: if claim says "NOT impl" but file has substantial code (>100 LOC),
    // flag potential drift
    const loc = content.split('\n').length;
    if (/NOT impl|NOT shipped|carryover|MA NOT|still NOT|NON-existent|NOT yet impl/i.test(claim) && loc > 100) {
      findings.push({
        severity: 'HIGH',
        kind: 'file_substantive_but_claimed_not_impl',
        claim_excerpt: claim.slice(0, 200),
        file: located,
        loc,
        source: sourceFile,
        rationale: `File ${filename} has ${loc} LOC but claim says NOT impl. Verify reality vs claim.`,
      });
    }
  }

  // Check commit SHA references
  for (const m of shaRefs) {
    const sha = m[1];
    if (sha.length < 7) continue;
    const logOut = safeRun('git', ['log', '--oneline', '-1', sha]);
    if (logOut) {
      // Commit exists → if claim says NOT shipped, that's drift
      if (/NOT shipped|MA NOT|still NOT|NOT impl|NON-existent|MA internal/i.test(claim)) {
        findings.push({
          severity: 'HIGH',
          kind: 'commit_exists_but_claimed_not_shipped',
          claim_excerpt: claim.slice(0, 200),
          commit_sha: sha,
          commit_msg: logOut.slice(0, 120),
          source: sourceFile,
          rationale: `Commit ${sha} exists in git log but claim says NOT shipped.`,
        });
      }
    }
  }

  // Check function references — look in src/ + supabase/ for definition
  for (const m of fnRefs.slice(0, 3)) {
    const fnName = m[1];
    const grepOut = safeRun('grep', ['-rln', `${fnName}`, 'src', 'supabase']);
    if (grepOut && /NOT impl|MA NOT|still NOT/i.test(claim)) {
      findings.push({
        severity: 'MEDIUM',
        kind: 'function_defined_but_claimed_not_impl',
        claim_excerpt: claim.slice(0, 200),
        function: fnName,
        files: grepOut.split('\n').slice(0, 3),
        source: sourceFile,
        rationale: `Function ${fnName} defined in repo but claim says NOT impl.`,
      });
    }
  }

  return findings;
}

function scanPrompt(promptPath) {
  const content = readSafe(promptPath);
  if (!content) return [];
  const findings = [];
  const sourceRel = promptPath.replace(`${REPO_ROOT}/`, '');
  for (const re of NEGATIVE_CLAIM_PATTERNS) {
    const matches = content.matchAll(re);
    for (const m of matches) {
      // Extract surrounding context window ±200 chars
      const idx = m.index ?? 0;
      const start = Math.max(0, idx - 100);
      const end = Math.min(content.length, idx + 250);
      const window = content.slice(start, end);
      findings.push(...checkClaim(window, sourceRel));
    }
  }
  return findings;
}

function main() {
  const userArg = argv[2];
  const targets = userArg && existsSync(userArg) ? [resolve(userArg)] : findRecentPrompts();
  const allFindings = [];
  for (const t of targets) {
    allFindings.push(...scanPrompt(t));
  }
  // Dedup by claim_excerpt + kind
  const seen = new Set();
  const dedup = allFindings.filter(f => {
    // Dedup by (kind, target identity) — collapse same commit/function/file across windows
    const target = f.commit_sha || f.function || f.file || f.claim_excerpt.slice(0, 80);
    const key = `${f.kind}::${target}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const high = dedup.filter(f => f.severity === 'HIGH').length;
  const medium = dedup.filter(f => f.severity === 'MEDIUM').length;
  const report = {
    date: TODAY,
    git_head: safeRun('git', ['rev-parse', 'HEAD']),
    targets_scanned: targets.map(t => t.replace(`${REPO_ROOT}/`, '')),
    summary: {
      total: dedup.length,
      HIGH: high,
      MEDIUM: medium,
    },
    findings: dedup,
    enforcer_version: 1,
    enforcer_source: 'M-AI-06-prompt-state-validator.mjs',
  };
  writeFileSync(OUT_PATH, JSON.stringify(report, null, 2));
  console.log(`M-AI-06 Prompt State Validator report`);
  console.log(`==================================`);
  console.log(`date: ${TODAY}`);
  console.log(`git_head: ${report.git_head}`);
  console.log(`targets scanned: ${targets.length}`);
  console.log(`total findings: ${dedup.length}`);
  console.log(`HIGH: ${high} | MEDIUM: ${medium}`);
  for (const f of dedup.slice(0, 10)) {
    console.log(`---`);
    console.log(`[${f.severity}] ${f.kind}`);
    console.log(`  source: ${f.source}`);
    console.log(`  claim: ${f.claim_excerpt.replace(/\s+/g, ' ').slice(0, 150)}`);
    if (f.file) console.log(`  file: ${f.file} (${f.loc} LOC)`);
    if (f.commit_sha) console.log(`  commit: ${f.commit_sha} (${f.commit_msg})`);
    if (f.function) console.log(`  function: ${f.function} in ${f.files?.join(', ')}`);
  }
  console.log(`---`);
  console.log(`report written: ${OUT_PATH}`);
  if (high >= HIGH_DRIFT_EXIT_THRESHOLD) {
    console.error(`EXIT 2: HIGH drift ${high} >= threshold ${HIGH_DRIFT_EXIT_THRESHOLD}.`);
    exit(2);
  }
  exit(0);
}

main();
