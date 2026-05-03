#!/usr/bin/env node
// M-AI-04 Doc Drift Detector (iter 31 RALPH DEEP Sprint T close)
// Scans docs/audits/ + docs/handoff/ + docs/adrs/ for claim patterns and cross-refs to file system / Supabase truth.
// Outputs JSON drift report to automa/state/doc-drift-report-{date}.json + console table summary.
//
// Patterns checked:
//   - "iter NN close score X/10" → score-history.jsonl entry exists matching iter
//   - "ToolSpec count NN"        → grep "name: ['\"]" scripts/openclaw/tools-registry.ts actual
//   - "RAG chunks NN"            → Supabase SQL count (skip if SUPABASE_SERVICE_ROLE_KEY missing)
//   - "lesson-paths NN"          → ls src/data/lesson-paths/v*.json wc -l actual
//
// Exit 0 = report generated, exit 1 = drift detected severity HIGH.
//
// Usage:
//   node scripts/mechanisms/M-AI-04-doc-drift-detector.mjs           # scan all + write report
//   node scripts/mechanisms/M-AI-04-doc-drift-detector.mjs --dry-run # scan + stdout JSON only

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { argv, exit, cwd, env } from 'node:process';

const REPO_ROOT = cwd();
const SCAN_DIRS = ['docs/audits', 'docs/handoff', 'docs/adrs'];
const HISTORY_PATH = resolve(REPO_ROOT, 'automa/state/score-history.jsonl');
const TOOLS_REGISTRY_PATH = resolve(REPO_ROOT, 'scripts/openclaw/tools-registry.ts');
const LESSON_PATHS_DIR = resolve(REPO_ROOT, 'src/data/lesson-paths');
const DRY_RUN = argv.includes('--dry-run');

const PATTERNS = {
  iter_score: /iter\s+(\d+)\s+close\s+score\s+([0-9.]+)\s*\/\s*10/gi,
  toolspec_count: /ToolSpec count\s+(\d+)/gi,
  rag_chunks: /RAG chunks\s+(\d+)/gi,
  lesson_paths: /lesson-paths?\s+(\d+)/gi,
};

function listFilesRecursive(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...listFilesRecursive(full));
    else if (name.endsWith('.md')) out.push(full);
  }
  return out;
}

function loadScoreHistory() {
  if (!existsSync(HISTORY_PATH)) return new Map();
  const lines = readFileSync(HISTORY_PATH, 'utf8').split('\n').filter(Boolean);
  const map = new Map();
  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (typeof entry.iter === 'number') map.set(entry.iter, entry);
    } catch {
      // skip malformed line
    }
  }
  return map;
}

function actualToolSpecCount() {
  if (!existsSync(TOOLS_REGISTRY_PATH)) return null;
  try {
    const content = readFileSync(TOOLS_REGISTRY_PATH, 'utf8');
    const matches = content.match(/name:\s*['"]/g);
    return matches ? matches.length : 0;
  } catch {
    return null;
  }
}

function actualLessonPathsCount() {
  if (!existsSync(LESSON_PATHS_DIR)) return null;
  try {
    const files = readdirSync(LESSON_PATHS_DIR).filter((n) => /^v\d.*\.json$/.test(n));
    return files.length;
  } catch {
    return null;
  }
}

function actualRagChunksCount() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    return { value: null, skipped: true, reason: 'SUPABASE_SERVICE_ROLE_KEY missing (advisory)' };
  }
  try {
    const out = execFileSync('npx', ['supabase', 'db', 'query', '--linked', 'SELECT COUNT(*)::int AS total FROM rag_chunks'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const match = out.match(/(\d+)/);
    return { value: match ? parseInt(match[1], 10) : null, skipped: false };
  } catch (e) {
    return { value: null, skipped: true, reason: `supabase query failed: ${e.message}` };
  }
}

function gitHead() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function scanFile(filePath, scoreHistory, actuals) {
  const content = readFileSync(filePath, 'utf8');
  const findings = [];
  const rel = filePath.replace(REPO_ROOT + '/', '');

  // iter score claims
  for (const m of content.matchAll(PATTERNS.iter_score)) {
    const iter = parseInt(m[1], 10);
    const claimedScore = parseFloat(m[2]);
    const histEntry = scoreHistory.get(iter);
    if (!histEntry) {
      findings.push({
        type: 'iter_score',
        severity: 'MEDIUM',
        iter,
        claimed: claimedScore,
        actual: null,
        message: `iter ${iter} score ${claimedScore} claimed but no entry in score-history.jsonl`,
      });
    } else if (histEntry.score_capped !== null && Math.abs(histEntry.score_capped - claimedScore) > 0.05) {
      findings.push({
        type: 'iter_score',
        severity: 'HIGH',
        iter,
        claimed: claimedScore,
        actual: histEntry.score_capped,
        message: `iter ${iter} score drift: doc claims ${claimedScore} vs history score_capped ${histEntry.score_capped}`,
      });
    }
  }

  // ToolSpec count claims
  for (const m of content.matchAll(PATTERNS.toolspec_count)) {
    const claimed = parseInt(m[1], 10);
    if (actuals.toolspec !== null && claimed !== actuals.toolspec) {
      findings.push({
        type: 'toolspec_count',
        severity: Math.abs(claimed - actuals.toolspec) >= 5 ? 'HIGH' : 'MEDIUM',
        claimed,
        actual: actuals.toolspec,
        message: `ToolSpec count drift: doc claims ${claimed} vs actual ${actuals.toolspec}`,
      });
    }
  }

  // RAG chunks claims
  for (const m of content.matchAll(PATTERNS.rag_chunks)) {
    const claimed = parseInt(m[1], 10);
    if (actuals.rag.skipped) {
      findings.push({
        type: 'rag_chunks',
        severity: 'ADVISORY',
        claimed,
        actual: null,
        message: `RAG chunks ${claimed} claimed (verify SKIP: ${actuals.rag.reason})`,
      });
    } else if (actuals.rag.value !== null && Math.abs(claimed - actuals.rag.value) > 50) {
      findings.push({
        type: 'rag_chunks',
        severity: Math.abs(claimed - actuals.rag.value) >= 500 ? 'HIGH' : 'MEDIUM',
        claimed,
        actual: actuals.rag.value,
        message: `RAG chunks drift: doc claims ${claimed} vs actual ${actuals.rag.value}`,
      });
    }
  }

  // lesson-paths claims
  for (const m of content.matchAll(PATTERNS.lesson_paths)) {
    const claimed = parseInt(m[1], 10);
    if (actuals.lessonPaths !== null && Math.abs(claimed - actuals.lessonPaths) > 2) {
      findings.push({
        type: 'lesson_paths',
        severity: Math.abs(claimed - actuals.lessonPaths) >= 10 ? 'HIGH' : 'MEDIUM',
        claimed,
        actual: actuals.lessonPaths,
        message: `lesson-paths drift: doc claims ${claimed} vs actual ${actuals.lessonPaths}`,
      });
    }
  }

  if (findings.length === 0) return null;
  return { file: rel, findings };
}

function main() {
  const scoreHistory = loadScoreHistory();
  const actuals = {
    toolspec: actualToolSpecCount(),
    lessonPaths: actualLessonPathsCount(),
    rag: actualRagChunksCount(),
  };

  const allFiles = [];
  for (const dir of SCAN_DIRS) {
    allFiles.push(...listFilesRecursive(resolve(REPO_ROOT, dir)));
  }

  const results = [];
  for (const file of allFiles) {
    const r = scanFile(file, scoreHistory, actuals);
    if (r) results.push(r);
  }

  const totalFindings = results.reduce((sum, r) => sum + r.findings.length, 0);
  const highCount = results.reduce((sum, r) => sum + r.findings.filter((f) => f.severity === 'HIGH').length, 0);
  const mediumCount = results.reduce((sum, r) => sum + r.findings.filter((f) => f.severity === 'MEDIUM').length, 0);
  const advisoryCount = results.reduce((sum, r) => sum + r.findings.filter((f) => f.severity === 'ADVISORY').length, 0);

  const today = new Date().toISOString().slice(0, 10);
  const report = {
    date: today,
    git_head: gitHead(),
    actuals_baseline: {
      toolspec_count: actuals.toolspec,
      lesson_paths_count: actuals.lessonPaths,
      rag_chunks_count: actuals.rag.value,
      rag_chunks_skipped: actuals.rag.skipped,
      rag_chunks_skip_reason: actuals.rag.reason || null,
    },
    files_scanned: allFiles.length,
    files_with_drift: results.length,
    total_findings: totalFindings,
    severity_breakdown: { HIGH: highCount, MEDIUM: mediumCount, ADVISORY: advisoryCount },
    results,
  };

  // Console table summary
  console.log('M-AI-04 Doc Drift Detector report');
  console.log('=================================');
  console.log(`date: ${report.date}`);
  console.log(`git_head: ${report.git_head}`);
  console.log(`files scanned: ${report.files_scanned}`);
  console.log(`files with drift: ${report.files_with_drift}`);
  console.log(`total findings: ${report.total_findings}`);
  console.log(`HIGH: ${highCount} | MEDIUM: ${mediumCount} | ADVISORY: ${advisoryCount}`);
  console.log('---');
  console.log(`actuals: toolspec=${actuals.toolspec} | lesson-paths=${actuals.lessonPaths} | rag=${actuals.rag.value ?? 'SKIP'}`);

  if (DRY_RUN) {
    console.log('--- DRY RUN: report JSON (not written) ---');
    console.log(JSON.stringify(report, null, 2));
  } else {
    const outPath = resolve(REPO_ROOT, `automa/state/doc-drift-report-${today}.json`);
    writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');
    console.log(`report written: ${outPath}`);
  }

  exit(highCount > 0 ? 1 : 0);
}

main();
