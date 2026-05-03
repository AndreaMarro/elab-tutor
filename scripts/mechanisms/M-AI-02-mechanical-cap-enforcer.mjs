#!/usr/bin/env node
// M-AI-02 Mechanical Cap Enforcer (iter 31 RALPH DEEP Sprint T close)
// Reads automa/state/mechanical-caps.json + score-history entry + automa/baseline-tests.txt
// Evaluates 8 caps trigger conditions vs evidence fields.
// Lower cap wins (most restrictive). Multiple triggers OK, all logged as triggered_caps[].
// Outputs JSON enforcement report to stdout.
// Exit 0 = no caps triggered or claim already <= cap, exit 1 = cap enforced (claim > cap).
//
// Anti-pattern enforced (per mechanical-caps.json line 5):
//   - NO override cap manually senza Andrea Opus G45 review + ADR ratify
//   - NO retroactive edit append-only score-history.jsonl
//   - NO compiacenza score_capped > score_opus_review (M-AI-01 invariant)
//
// Usage CLI:
//   node scripts/mechanisms/M-AI-02-mechanical-cap-enforcer.mjs \
//     --iter 39 --score 8.45 --evidence path/to/evidence.json
//   node scripts/mechanisms/M-AI-02-mechanical-cap-enforcer.mjs \
//     --iter 39 --score 8.45 --evidence-inline '{"r5_p95_ms":3380,"r7_canonical_pct":3.6,"vitest_count":13474}'
//   node scripts/mechanisms/M-AI-02-mechanical-cap-enforcer.mjs --latest    # read tail of score-history.jsonl
//
// Usage Library:
//   import { enforceCap, loadCapsConfig, loadBaselineTests } from '...';
//   const result = enforceCap({iter, score_claim, evidence}, capsConfig, baselineTests);

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { argv, exit, cwd, stdout, stderr } from 'node:process';

const REPO_ROOT = cwd();
const CAPS_PATH = resolve(REPO_ROOT, 'automa/state/mechanical-caps.json');
const HISTORY_PATH = resolve(REPO_ROOT, 'automa/state/score-history.jsonl');
const BASELINE_PATH = resolve(REPO_ROOT, 'automa/baseline-tests.txt');

// ---------------------------------------------------------------------------
// Cap evaluators map: name -> (evidence, baseline) => {triggered: bool, observed: any}
// Mirrors mechanical-caps.json trigger_condition strings as executable JS.
// ---------------------------------------------------------------------------
const CAP_EVALUATORS = {
  R5_LATENCY: (ev) => {
    const v = Number(ev.r5_p95_ms);
    return {
      triggered: Number.isFinite(v) && v > 2500,
      observed: { r5_p95_ms: Number.isFinite(v) ? v : null },
      missing_evidence: !Number.isFinite(v),
    };
  },
  R7_CANONICAL: (ev) => {
    const v = Number(ev.r7_canonical_pct);
    return {
      triggered: Number.isFinite(v) && v < 80,
      observed: { r7_canonical_pct: Number.isFinite(v) ? v : null },
      missing_evidence: !Number.isFinite(v),
    };
  },
  LIGHTHOUSE_PERF: (ev) => {
    const a = Number(ev.lighthouse_perf_chatbot);
    const b = Number(ev.lighthouse_perf_easter);
    const finiteA = Number.isFinite(a);
    const finiteB = Number.isFinite(b);
    if (!finiteA && !finiteB) {
      return { triggered: false, observed: { min: null }, missing_evidence: true };
    }
    const candidates = [finiteA ? a : Infinity, finiteB ? b : Infinity];
    const min = Math.min(...candidates);
    return {
      triggered: min < 70,
      observed: {
        lighthouse_perf_chatbot: finiteA ? a : null,
        lighthouse_perf_easter: finiteB ? b : null,
        min,
      },
      missing_evidence: false,
    };
  },
  ESPERIMENTI_BROKEN: (ev) => {
    const v = Number(ev.esperimenti_broken_count);
    return {
      triggered: Number.isFinite(v) && v > 10,
      observed: { esperimenti_broken_count: Number.isFinite(v) ? v : null },
      missing_evidence: !Number.isFinite(v),
    };
  },
  VITEST_REGRESSION: (ev, baseline) => {
    const v = Number(ev.vitest_count);
    const b = Number(baseline);
    if (!Number.isFinite(v) || !Number.isFinite(b)) {
      return { triggered: false, observed: { vitest_count: Number.isFinite(v) ? v : null, baseline: Number.isFinite(b) ? b : null }, missing_evidence: true };
    }
    return {
      triggered: v < b,
      observed: { vitest_count: v, baseline: b },
      missing_evidence: false,
    };
  },
  PZ_V3_VOL_PAG: (ev) => {
    const v = Number(ev.r5_pz_v3_pct);
    return {
      triggered: Number.isFinite(v) && v < 90,
      observed: { r5_pz_v3_pct: Number.isFinite(v) ? v : null },
      missing_evidence: !Number.isFinite(v),
    };
  },
  RAG_PAGE_COVERAGE: (ev) => {
    const v = Number(ev.rag_page_coverage_pct);
    return {
      triggered: Number.isFinite(v) && v < 80,
      observed: { rag_page_coverage_pct: Number.isFinite(v) ? v : null },
      missing_evidence: !Number.isFinite(v),
    };
  },
  BUNDLE_SIZE: (ev) => {
    const v = Number(ev.bundle_size_kb);
    return {
      triggered: Number.isFinite(v) && v > 4900,
      observed: { bundle_size_kb: Number.isFinite(v) ? v : null },
      missing_evidence: !Number.isFinite(v),
    };
  },
};

// ---------------------------------------------------------------------------
// Loaders (library-mode exports)
// ---------------------------------------------------------------------------
export function loadCapsConfig(path = CAPS_PATH) {
  if (!existsSync(path)) {
    throw new Error(`mechanical-caps.json not found at ${path}`);
  }
  const raw = readFileSync(path, 'utf-8');
  const json = JSON.parse(raw);
  if (!Array.isArray(json.caps)) {
    throw new Error(`mechanical-caps.json missing 'caps' array`);
  }
  return json;
}

export function loadBaselineTests(path = BASELINE_PATH) {
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, 'utf-8').trim().split('\n')[0].trim();
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function loadLatestScoreEntry(path = HISTORY_PATH) {
  if (!existsSync(path)) {
    throw new Error(`score-history.jsonl not found at ${path}`);
  }
  const lines = readFileSync(path, 'utf-8').trim().split('\n').filter(Boolean);
  if (lines.length === 0) throw new Error('score-history.jsonl is empty');
  const last = lines[lines.length - 1];
  return JSON.parse(last);
}

// ---------------------------------------------------------------------------
// Core: enforceCap(scoreEntry, capsConfig, baselineTests) -> enforcement report
// ---------------------------------------------------------------------------
export function enforceCap(scoreEntry, capsConfig, baselineTests) {
  const { iter, score_claim, evidence = {} } = scoreEntry;

  if (typeof score_claim !== 'number') {
    throw new Error(`score_claim must be number, got ${typeof score_claim}`);
  }

  const triggered = [];
  const evaluated = {};

  for (const cap of capsConfig.caps) {
    const evaluator = CAP_EVALUATORS[cap.name];
    if (!evaluator) {
      evaluated[cap.name] = { error: `no evaluator implemented for cap '${cap.name}'` };
      continue;
    }
    const result = evaluator(evidence, baselineTests);
    evaluated[cap.name] = {
      triggered: result.triggered,
      observed: result.observed,
      missing_evidence: result.missing_evidence,
      cap_score: cap.cap_score,
      rationale: cap.rationale,
    };
    if (result.triggered) {
      triggered.push({
        name: cap.name,
        cap_score: cap.cap_score,
        observed: result.observed,
        rationale: cap.rationale,
      });
    }
  }

  // Lower cap wins (most restrictive). Multiple triggers OK, all logged.
  let score_capped = score_claim;
  let cap_reason = null;
  if (triggered.length > 0) {
    const minCap = triggered.reduce((acc, c) => (c.cap_score < acc.cap_score ? c : acc));
    if (score_claim > minCap.cap_score) {
      score_capped = minCap.cap_score;
      cap_reason = `G45 mechanical cap ${minCap.name} (${minCap.cap_score}) — ${minCap.rationale}`;
    } else {
      cap_reason = `caps triggered but score_claim=${score_claim} <= min cap=${minCap.cap_score} (no enforcement needed)`;
    }
  }

  const anti_pattern_detected = score_claim > score_capped;

  return {
    iter,
    score_claim,
    score_capped,
    triggered_caps: triggered.map((t) => t.name),
    triggered_caps_detail: triggered,
    cap_reason,
    evidence_evaluated: evaluated,
    anti_pattern_detected,
    enforcer_version: 1,
    enforcer_source: 'M-AI-02-mechanical-cap-enforcer.mjs',
  };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
function parseArgs(args) {
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--iter') out.iter = Number(args[++i]);
    else if (a === '--score') out.score = Number(args[++i]);
    else if (a === '--evidence') out.evidencePath = args[++i];
    else if (a === '--evidence-inline') out.evidenceInline = args[++i];
    else if (a === '--latest') out.latest = true;
    else if (a === '--help' || a === '-h') out.help = true;
  }
  return out;
}

function printHelp() {
  stdout.write(`M-AI-02 Mechanical Cap Enforcer

CLI:
  --iter N                    iteration number (required unless --latest)
  --score X.XX                score_claim (required unless --latest)
  --evidence PATH             path to evidence JSON file
  --evidence-inline JSON      inline evidence JSON string
  --latest                    read latest entry from automa/state/score-history.jsonl
  --help, -h                  this help

Examples:
  node scripts/mechanisms/M-AI-02-mechanical-cap-enforcer.mjs --latest
  node scripts/mechanisms/M-AI-02-mechanical-cap-enforcer.mjs \\
    --iter 39 --score 8.45 \\
    --evidence-inline '{"r5_p95_ms":3380,"r7_canonical_pct":3.6,"vitest_count":13474}'

Exit codes:
  0 = no enforcement needed (no caps triggered OR claim <= min cap)
  1 = cap enforced (anti_pattern_detected: true)
`);
}

function main() {
  const args = parseArgs(argv.slice(2));
  if (args.help) {
    printHelp();
    exit(0);
  }

  let capsConfig;
  let baselineTests;
  try {
    capsConfig = loadCapsConfig();
    baselineTests = loadBaselineTests();
  } catch (e) {
    stderr.write(`ERROR loading config: ${e.message}\n`);
    exit(2);
  }

  let scoreEntry;
  if (args.latest) {
    try {
      scoreEntry = loadLatestScoreEntry();
    } catch (e) {
      stderr.write(`ERROR loading latest score entry: ${e.message}\n`);
      exit(2);
    }
  } else {
    if (!Number.isFinite(args.iter) || !Number.isFinite(args.score)) {
      stderr.write(`ERROR: --iter and --score required (or use --latest)\n\n`);
      printHelp();
      exit(2);
    }
    let evidence = {};
    if (args.evidencePath) {
      if (!existsSync(args.evidencePath)) {
        stderr.write(`ERROR: evidence path not found: ${args.evidencePath}\n`);
        exit(2);
      }
      evidence = JSON.parse(readFileSync(args.evidencePath, 'utf-8'));
    } else if (args.evidenceInline) {
      try {
        evidence = JSON.parse(args.evidenceInline);
      } catch (e) {
        stderr.write(`ERROR parsing --evidence-inline JSON: ${e.message}\n`);
        exit(2);
      }
    }
    scoreEntry = { iter: args.iter, score_claim: args.score, evidence };
  }

  let report;
  try {
    report = enforceCap(scoreEntry, capsConfig, baselineTests);
  } catch (e) {
    stderr.write(`ERROR enforcing cap: ${e.message}\n`);
    exit(2);
  }

  stdout.write(JSON.stringify(report, null, 2) + '\n');
  exit(report.anti_pattern_detected ? 1 : 0);
}

// Detect direct execution vs import (ESM, handles paths with spaces)
const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  main();
}
