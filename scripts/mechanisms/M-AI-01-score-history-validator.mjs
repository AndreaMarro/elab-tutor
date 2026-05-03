#!/usr/bin/env node
// M-AI-01 Score History Validator (iter 31 RALPH DEEP)
// Reads automa/state/score-history.jsonl
// Validates JSONL schema per entry.
// REJECTS append if score_capped > score_opus_review (anti-inflation invariant).
// Outputs JSON validation report to stdout.
// Exit 0 = all entries valid, exit 1 = at least one violation.
//
// Usage:
//   node scripts/mechanisms/M-AI-01-score-history-validator.mjs           # validate full file
//   node scripts/mechanisms/M-AI-01-score-history-validator.mjs --entry='{"...":...}'  # validate candidate entry pre-append

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { argv, exit, cwd } from 'node:process';

const REPO_ROOT = cwd();
const HISTORY_PATH = resolve(REPO_ROOT, 'automa/state/score-history.jsonl');

const REQUIRED_FIELDS = [
  'iter',
  'date',
  'commit',
  'score_claim',
  'score_opus_review',
  'score_capped',
  'box_subtotal',
  'bonus',
  'cap_reason',
  'gates_pass',
  'gates_fail',
  'triggered_caps',
  'evidence',
  'status',
];

function validateEntry(entry, lineNum) {
  const errors = [];
  const warnings = [];

  // Schema: required fields
  for (const f of REQUIRED_FIELDS) {
    if (!(f in entry)) errors.push(`line ${lineNum}: missing field '${f}'`);
  }

  // Type checks
  if (typeof entry.iter !== 'number') errors.push(`line ${lineNum}: iter must be number`);
  if (typeof entry.score_claim !== 'number') errors.push(`line ${lineNum}: score_claim must be number`);
  if (typeof entry.score_opus_review !== 'number') errors.push(`line ${lineNum}: score_opus_review must be number`);
  if (typeof entry.score_capped !== 'number') errors.push(`line ${lineNum}: score_capped must be number`);
  if (typeof entry.box_subtotal !== 'number') errors.push(`line ${lineNum}: box_subtotal must be number`);
  if (typeof entry.bonus !== 'number') errors.push(`line ${lineNum}: bonus must be number`);
  if (!Array.isArray(entry.triggered_caps)) errors.push(`line ${lineNum}: triggered_caps must be array`);
  if (typeof entry.evidence !== 'object' || entry.evidence === null) errors.push(`line ${lineNum}: evidence must be object`);

  // ANTI-INFLATION INVARIANT: score_capped MUST NOT exceed score_opus_review
  if (
    typeof entry.score_capped === 'number' &&
    typeof entry.score_opus_review === 'number' &&
    entry.score_capped > entry.score_opus_review
  ) {
    errors.push(
      `line ${lineNum}: ANTI-INFLATION VIOLATION score_capped=${entry.score_capped} > score_opus_review=${entry.score_opus_review}`,
    );
  }

  // Sanity: score_claim should be >= score_opus_review (claim before review)
  if (
    typeof entry.score_claim === 'number' &&
    typeof entry.score_opus_review === 'number' &&
    entry.score_claim < entry.score_opus_review
  ) {
    warnings.push(`line ${lineNum}: score_claim < score_opus_review (unusual but allowed)`);
  }

  // status enum
  const validStatuses = ['pending', 'reviewed', 'approved', 'rejected', 'capped'];
  if (entry.status && !validStatuses.includes(entry.status)) {
    warnings.push(`line ${lineNum}: status '${entry.status}' not in ${validStatuses.join('|')}`);
  }

  // commit hash format
  if (entry.commit && !/^[a-f0-9]{7,40}$/.test(entry.commit)) {
    warnings.push(`line ${lineNum}: commit '${entry.commit}' not git SHA format`);
  }

  return { errors, warnings };
}

function main() {
  const candidateArg = argv.find((a) => a.startsWith('--entry='));

  if (candidateArg) {
    const raw = candidateArg.slice('--entry='.length);
    let entry;
    try {
      entry = JSON.parse(raw);
    } catch (e) {
      console.log(JSON.stringify({ ok: false, mode: 'candidate', errors: [`JSON parse: ${e.message}`] }, null, 2));
      exit(1);
    }
    const { errors, warnings } = validateEntry(entry, 0);
    const ok = errors.length === 0;
    console.log(JSON.stringify({ ok, mode: 'candidate', errors, warnings, entry }, null, 2));
    exit(ok ? 0 : 1);
  }

  if (!existsSync(HISTORY_PATH)) {
    console.log(JSON.stringify({ ok: true, mode: 'file', message: 'no history yet', path: HISTORY_PATH }, null, 2));
    exit(0);
  }

  const lines = readFileSync(HISTORY_PATH, 'utf8').split('\n').filter((l) => l.trim().length > 0);
  let allErrors = [];
  let allWarnings = [];
  let validCount = 0;

  lines.forEach((line, idx) => {
    let entry;
    try {
      entry = JSON.parse(line);
    } catch (e) {
      allErrors.push(`line ${idx + 1}: JSON parse failed: ${e.message}`);
      return;
    }
    const { errors, warnings } = validateEntry(entry, idx + 1);
    allErrors = allErrors.concat(errors);
    allWarnings = allWarnings.concat(warnings);
    if (errors.length === 0) validCount += 1;
  });

  const report = {
    ok: allErrors.length === 0,
    mode: 'file',
    path: HISTORY_PATH,
    total_entries: lines.length,
    valid_entries: validCount,
    errors: allErrors,
    warnings: allWarnings,
  };
  console.log(JSON.stringify(report, null, 2));
  exit(allErrors.length === 0 ? 0 : 1);
}

main();
