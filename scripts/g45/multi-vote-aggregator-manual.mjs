#!/usr/bin/env node
/**
 * Multi-vote G45 manual aggregator (Step 2 Atom 2.3 prerequisite scaffold)
 *
 * Reads N vote files from disk, computes consensus + spread + bias correction.
 * NO API call. Manual workflow: Andrea collects votes from CLI agents (Claude/Codex/Gemini),
 * pastes each vote into vote-*.md, runs this aggregator, gets consensus decision.
 *
 * Usage:
 *   node scripts/g45/multi-vote-aggregator-manual.mjs <vote-dir>
 *
 * Vote file format (1 file per vendor):
 *   docs/audits/g45-multi-vote-iter-{N}/vote-{vendor}.md
 *   With YAML frontmatter:
 *     ---
 *     vendor: claude|codex|gemini|kimi|mistral|deepseek
 *     score: 8.5
 *     rationale: |
 *       ...
 *     ---
 *     [vote body markdown]
 *
 * Bias correction matrix: applies per-vendor delta correction (provider-bias-matrix.json)
 *
 * Output: stdout JSON consensus + decision (PASS/RE-PROMPT/ESCALATE)
 *   exit 0 = consensus PASS spread <= 1.5
 *   exit 2 = re-prompt required spread > 1.5 <= 2.5
 *   exit 1 = escalate Andrea spread > 2.5 OR <4 vendor present
 *
 * Anti-pattern G45 enforced:
 *   - REJECT IF <4 vendor present (multi-vote mandate Step 3 Atom 3.3)
 *   - APPLY bias correction per-vendor (NOT raw vote consensus)
 *   - SPREAD enforce <=1.5 mandate (re-prompt context disagreement)
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const REQUIRED_VENDORS_MIN = 4; // Step 3 Atom 3.3 mandate
const SPREAD_CONSENSUS_MAX = 1.5;
const SPREAD_REPROMPT_MAX = 2.5;

const BIAS_MATRIX_PATH = 'automa/state/provider-bias-matrix.json';

const DEFAULT_BIAS_MATRIX = {
  version: 1,
  biases: {
    anthropic_claude: { delta_correction: -0.3, rationale: 'Same model paradigm self-review inflate' },
    openai_codex:     { delta_correction: +0.2, rationale: 'Codex --adversarial pessimistic' },
    google_gemini:    { delta_correction:  0.0, rationale: 'Balanced corpus baseline' },
    moonshot_kimi:    { delta_correction:  0.0, rationale: 'Open weights distinct independent' },
    mistral_large:    { delta_correction: -0.1, rationale: 'Italian corpus optimistic' },
    deepseek_r1:      { delta_correction: +0.1, rationale: 'R1 reasoning depth catches subtle gaps' },
  },
};

function loadBiasMatrix() {
  if (!existsSync(BIAS_MATRIX_PATH)) {
    process.stderr.write(`[INFO] bias matrix ${BIAS_MATRIX_PATH} missing → use defaults\n`);
    return DEFAULT_BIAS_MATRIX;
  }
  try {
    return JSON.parse(readFileSync(BIAS_MATRIX_PATH, 'utf8'));
  } catch (err) {
    process.stderr.write(`[ERROR] bias matrix parse fail: ${err.message}\n`);
    return DEFAULT_BIAS_MATRIX;
  }
}

function parseVoteFile(filepath) {
  const content = readFileSync(filepath, 'utf8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    throw new Error(`No YAML frontmatter in ${filepath}`);
  }
  const fm = fmMatch[1];
  const vendor = fm.match(/vendor:\s*(\S+)/)?.[1];
  const score = parseFloat(fm.match(/score:\s*([\d.]+)/)?.[1]);
  const rationaleMatch = fm.match(/rationale:\s*\|([\s\S]*?)(?:\n\w+:|$)/);
  const rationale = rationaleMatch ? rationaleMatch[1].trim() : '(none)';
  if (!vendor || isNaN(score)) {
    throw new Error(`Invalid frontmatter in ${filepath}: vendor=${vendor} score=${score}`);
  }
  return { vendor, score, rationale, filepath };
}

function applyBiasCorrection(votes, biasMatrix) {
  return votes.map((vote) => {
    const vendorKey = `${vote.vendor === 'claude' ? 'anthropic_claude' : ''}${vote.vendor === 'codex' ? 'openai_codex' : ''}${vote.vendor === 'gemini' ? 'google_gemini' : ''}${vote.vendor === 'kimi' ? 'moonshot_kimi' : ''}${vote.vendor === 'mistral' ? 'mistral_large' : ''}${vote.vendor === 'deepseek' ? 'deepseek_r1' : ''}`;
    const correction = biasMatrix.biases[vendorKey]?.delta_correction ?? 0;
    return { ...vote, raw_score: vote.score, corrected_score: vote.score + correction, correction_applied: correction, vendor_key: vendorKey };
  });
}

function aggregate(votes) {
  if (votes.length < REQUIRED_VENDORS_MIN) {
    return {
      decision: 'ESCALATE',
      reason: `<${REQUIRED_VENDORS_MIN} vendor votes present (got ${votes.length})`,
      consensus_score: null,
      spread: null,
    };
  }
  const correctedScores = votes.map((v) => v.corrected_score);
  const max = Math.max(...correctedScores);
  const min = Math.min(...correctedScores);
  const spread = max - min;
  const mean = correctedScores.reduce((a, b) => a + b, 0) / correctedScores.length;

  if (spread <= SPREAD_CONSENSUS_MAX) {
    return { decision: 'PASS', reason: `consensus spread ${spread.toFixed(2)} <= ${SPREAD_CONSENSUS_MAX}`, consensus_score: parseFloat(mean.toFixed(2)), spread: parseFloat(spread.toFixed(2)) };
  }
  if (spread <= SPREAD_REPROMPT_MAX) {
    return { decision: 'RE-PROMPT', reason: `spread ${spread.toFixed(2)} > ${SPREAD_CONSENSUS_MAX} requires disagreement context re-prompt`, consensus_score: parseFloat(mean.toFixed(2)), spread: parseFloat(spread.toFixed(2)) };
  }
  return { decision: 'ESCALATE', reason: `severe disagreement spread ${spread.toFixed(2)} > ${SPREAD_REPROMPT_MAX}`, consensus_score: parseFloat(mean.toFixed(2)), spread: parseFloat(spread.toFixed(2)) };
}

function main() {
  const voteDir = process.argv[2];
  if (!voteDir) {
    process.stderr.write('Usage: node scripts/g45/multi-vote-aggregator-manual.mjs <vote-dir>\n');
    process.exit(1);
  }
  if (!existsSync(voteDir)) {
    process.stderr.write(`[ERROR] vote dir ${voteDir} not found\n`);
    process.exit(1);
  }

  const voteFiles = readdirSync(voteDir).filter((f) => f.startsWith('vote-') && f.endsWith('.md')).map((f) => join(voteDir, f));
  if (voteFiles.length === 0) {
    process.stderr.write(`[ERROR] no vote-*.md files in ${voteDir}\n`);
    process.exit(1);
  }

  const biasMatrix = loadBiasMatrix();
  const votes = voteFiles.map(parseVoteFile);
  const correctedVotes = applyBiasCorrection(votes, biasMatrix);
  const result = aggregate(correctedVotes);

  const output = {
    timestamp: new Date().toISOString(),
    vote_dir: voteDir,
    vendors_present: votes.map((v) => v.vendor),
    vendors_count: votes.length,
    bias_matrix_version: biasMatrix.version,
    votes_raw: votes.map((v) => ({ vendor: v.vendor, score: v.score })),
    votes_corrected: correctedVotes.map((v) => ({ vendor: v.vendor, raw: v.raw_score, corrected: v.corrected_score, delta: v.correction_applied })),
    aggregate: result,
  };

  console.log(JSON.stringify(output, null, 2));

  if (result.decision === 'PASS') process.exit(0);
  if (result.decision === 'RE-PROMPT') process.exit(2);
  process.exit(1); // ESCALATE
}

main();
