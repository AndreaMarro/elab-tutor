#!/usr/bin/env node
/**
 * Codemod #12 — prepend "Ragazzi, " phase 1 (PREPARA) teacher_message
 * for lesson-paths missing "Ragazzi," opener anywhere in file.
 *
 * Usage:
 *   node scripts/codemod-ragazzi-opener.mjs --dry-run    # preview
 *   node scripts/codemod-ragazzi-opener.mjs --apply      # write changes
 *
 * Scope: 65 file Sprint U Cycle 1 audit BLOCKER PRINCIPIO ZERO 33%→100%.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const LP_DIR = path.join(ROOT, 'src/data/lesson-paths');
const APPLY = process.argv.includes('--apply');
const DRY = !APPLY;

const files = fs.readdirSync(LP_DIR).filter(f => f.endsWith('.json'));
const targets = [];

for (const f of files) {
  const fp = path.join(LP_DIR, f);
  const raw = fs.readFileSync(fp, 'utf8');
  if (raw.match(/"teacher_message"\s*:\s*"[^"]*Ragazzi/)) continue; // already has

  let lp;
  try { lp = JSON.parse(raw); } catch { continue; }
  const phase0 = lp?.phases?.[0];
  if (!phase0?.teacher_message) continue;

  const orig = phase0.teacher_message;
  if (orig.startsWith('Ragazzi,')) continue; // safety

  // Lowercase first char, prepend "Ragazzi, "
  const newMsg = `Ragazzi, ${orig.charAt(0).toLowerCase()}${orig.slice(1)}`;
  targets.push({ file: f, phase: phase0.name || 'phase[0]', orig, newMsg });
}

console.log(`Found ${targets.length} files missing "Ragazzi," opener.\n`);
console.log(`Mode: ${APPLY ? 'APPLY (write)' : 'DRY-RUN (preview)'}\n`);
console.log('=== SAMPLE 3 ===\n');
for (const t of targets.slice(0, 3)) {
  console.log(`FILE: ${t.file} (phase ${t.phase})`);
  console.log(`  - ${t.orig.slice(0, 120)}${t.orig.length > 120 ? '...' : ''}`);
  console.log(`  + ${t.newMsg.slice(0, 120)}${t.newMsg.length > 120 ? '...' : ''}\n`);
}

if (APPLY) {
  let written = 0;
  for (const t of targets) {
    const fp = path.join(LP_DIR, t.file);
    const lp = JSON.parse(fs.readFileSync(fp, 'utf8'));
    lp.phases[0].teacher_message = t.newMsg;
    fs.writeFileSync(fp, JSON.stringify(lp, null, 2) + '\n');
    written++;
  }
  console.log(`\n✓ Applied ${written} files.`);
} else {
  console.log(`\nRun with --apply to write ${targets.length} files.`);
}
