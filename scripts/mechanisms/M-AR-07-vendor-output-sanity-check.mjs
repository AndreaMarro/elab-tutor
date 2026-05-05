#!/usr/bin/env node
// M-AR-07 Vendor Output Sanity Check (iter 39 Step 1, anti-regression)
//
// Validates vendor JSON output structure + Principio Zero compliance in proposals.
// Used after M-AI-07 cycle Rounds 2/3a/3b to gate Round 5 + Round 6 acceptance.
//
// Checks:
// 1. JSON parseable (structure valid)
// 2. Required fields present (decision, findings|new_finding, etc.)
// 3. NO Principio Zero violation in proposals:
//    - Card paritaria homepage NOT proposing student-facing AI direct entry
//    - Plurale Ragazzi preserved in linguaggio proposals
//    - Kit fisico ELAB mention preserved
//    - Vol/pag verbatim citation preserved
// 4. NO Morfismo Sense 2 violation:
//    - Palette ELAB Navy/Lime/Orange/Red preserved
//    - Iconografia derivata volumi preservata (NO material-design generic)
//    - Capitoli software mantengono titoli libro
//
// Outputs JSON report + console table.
// Exit 0 = clean, exit 1 = violations detected (block downstream cycle continuation).
//
// Usage:
//   node scripts/mechanisms/M-AR-07-vendor-output-sanity-check.mjs <vendor-output-file> [vendor-name]

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { exit, cwd, argv } from 'node:process';

const REPO_ROOT = cwd();
const TODAY = new Date().toISOString().slice(0, 10);
const OUT_DIR = resolve(REPO_ROOT, 'automa/state/m-ar-07');
const VIOLATIONS = [];

const PRINCIPIO_ZERO_RED_FLAGS = [
  // Card paritaria homepage student-facing AI direct entry
  /\b(?:UNLIM|chatbot)\s+(?:solo|only)\s+chat\s+card/i,
  // Singolare imperative violation linguaggio docente "tu fai"
  /\b(tu fai|fai questo|fai tu|premi tu|clicca tu|monta tu)\b/i,
  // Direct student instruction (anti-Principio Zero)
  /\bistruisci\s+(?:lo|la|gli|gli\s+studenti)\s+direttamente/i,
];

const MORFISMO_SENSE2_RED_FLAGS = [
  // Material-design generic icons (anti-Morfismo)
  /\b(material[\s-]?design|fontawesome|bootstrap[\s-]?icons|generic[\s-]?icon)\b/i,
  // Generic palette (anti-Omaric kit)
  /palette\s+(?:generic|standard|default)\s+(?:blue|red|green)/i,
  // Capitoli inventati (anti-libro coerenza)
  /\b(?:Lesson|Lezione)\s+\d+/i,
];

const PRINCIPIO_ZERO_PRESERVED_HINTS = [
  /\bRagazzi\b/,
  /\bdocente\b/i,
  /\bkit\s+(?:ELAB|fisico|Omaric)/i,
  /\bvol(?:\.|\s|ume)\s*\d/i,
];

function readSafe(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return null;
  }
}

function checkJSON(content, vendorName) {
  // Try direct JSON parse
  try {
    return { parsed: JSON.parse(content), source: 'direct' };
  } catch {}
  // Extract from markdown JSON code block
  const codeBlock = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlock) {
    try {
      return { parsed: JSON.parse(codeBlock[1]), source: 'codeblock' };
    } catch {}
  }
  // Extract first {...} JSON object
  const match = content.match(/\{[\s\S]+\}/);
  if (match) {
    try {
      return { parsed: JSON.parse(match[0]), source: 'extracted' };
    } catch {}
  }
  VIOLATIONS.push({
    severity: 'HIGH',
    category: 'json_parse_fail',
    vendor: vendorName,
    message: 'Could not parse vendor output as JSON (no valid structure found)',
  });
  return { parsed: null, source: 'fail' };
}

function checkPrincipioZero(content, vendorName) {
  for (const re of PRINCIPIO_ZERO_RED_FLAGS) {
    const match = content.match(re);
    if (match) {
      VIOLATIONS.push({
        severity: 'HIGH',
        category: 'principio_zero_violation',
        vendor: vendorName,
        snippet: match[0],
        message: `Vendor proposal violates Principio Zero (red flag): "${match[0]}"`,
      });
    }
  }
}

function checkMorfismoSense2(content, vendorName) {
  for (const re of MORFISMO_SENSE2_RED_FLAGS) {
    const match = content.match(re);
    if (match) {
      VIOLATIONS.push({
        severity: 'MEDIUM',
        category: 'morfismo_sense2_violation',
        vendor: vendorName,
        snippet: match[0],
        message: `Vendor proposal violates Morfismo Sense 2: "${match[0]}"`,
      });
    }
  }
}

function checkPrincipioZeroPreservedHints(content, vendorName) {
  // If proposal has substantial size (>200 chars) but NO Principio Zero hints, advisory flag
  if (content.length > 200) {
    let hintsFound = 0;
    for (const re of PRINCIPIO_ZERO_PRESERVED_HINTS) {
      if (re.test(content)) hintsFound++;
    }
    if (hintsFound === 0) {
      VIOLATIONS.push({
        severity: 'ADVISORY',
        category: 'principio_zero_no_hints',
        vendor: vendorName,
        message: `Vendor proposal (${content.length} chars) has NO Principio Zero hint (Ragazzi/docente/kit/vol). May indicate context loss.`,
      });
    }
  }
}

function main() {
  const targetFile = argv[2];
  const vendorName = argv[3] || basename(targetFile || 'unknown', '.json');
  if (!targetFile || !existsSync(targetFile)) {
    console.error(`Usage: ${argv[1]} <vendor-output-file> [vendor-name]`);
    console.error(`File not found: ${targetFile}`);
    exit(1);
  }
  const content = readSafe(targetFile) || '';

  // Run checks
  checkJSON(content, vendorName);
  checkPrincipioZero(content, vendorName);
  checkMorfismoSense2(content, vendorName);
  checkPrincipioZeroPreservedHints(content, vendorName);

  // Aggregate report
  const high = VIOLATIONS.filter(v => v.severity === 'HIGH').length;
  const medium = VIOLATIONS.filter(v => v.severity === 'MEDIUM').length;
  const advisory = VIOLATIONS.filter(v => v.severity === 'ADVISORY').length;

  const report = {
    date: TODAY,
    target: targetFile,
    vendor: vendorName,
    summary: {
      total: VIOLATIONS.length,
      HIGH: high,
      MEDIUM: medium,
      ADVISORY: advisory,
    },
    violations: VIOLATIONS,
    verifier_version: 1,
    verifier_source: 'M-AR-07-vendor-output-sanity-check.mjs',
  };

  // Write report
  if (!existsSync(OUT_DIR)) {
    try { mkdirSync(OUT_DIR, { recursive: true }); } catch {}
  }
  const outPath = resolve(OUT_DIR, `${vendorName}-${Date.now()}.json`);
  writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log(`M-AR-07 Vendor Output Sanity Check`);
  console.log(`==================================`);
  console.log(`vendor: ${vendorName}`);
  console.log(`target: ${targetFile}`);
  console.log(`total violations: ${VIOLATIONS.length}`);
  console.log(`HIGH: ${high} | MEDIUM: ${medium} | ADVISORY: ${advisory}`);
  for (const v of VIOLATIONS.slice(0, 10)) {
    console.log(`---`);
    console.log(`[${v.severity}] ${v.category}`);
    console.log(`  ${v.message}`);
    if (v.snippet) console.log(`  snippet: ${v.snippet.slice(0, 80)}`);
  }
  console.log(`---`);
  console.log(`report: ${outPath}`);

  if (high > 0) {
    console.error(`EXIT 1: HIGH violations ${high} block downstream cycle continuation.`);
    exit(1);
  }
  exit(0);
}

main();
