#!/usr/bin/env node
/**
 * patch-blockly.js — Safe disposal patch for Blockly 12.4.1
 *
 * Blockly 12.4.1 has an InsertionMarkerPreviewer bug: during workspace
 * disposal or React DOM removal, block.dispose() calls removeTypedBlock()
 * and removeTopBlock() on insertion marker blocks whose type entries
 * have already been cleaned from typedBlocksDB. This causes:
 *   - TypeError: Cannot read properties of undefined (reading 'indexOf')
 *   - Error: Block not present in workspace's list of top-most blocks
 *
 * This script patches the two methods to be safe (guard + no-throw).
 * Run automatically via postinstall, or manually: node scripts/patch-blockly.js
 *
 * © Andrea Marro — ELAB Tutor — Sprint 161.5
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOCKLY_PATH = resolve(__dirname, '../node_modules/blockly/blockly_compressed.js');

// Sentinel to detect if patch was already applied
const PATCH_SENTINEL = '/* ELAB-PATCHED:safe-disposal */';

try {
    let code = readFileSync(BLOCKLY_PATH, 'utf8');

    // Already patched?
    if (code.includes(PATCH_SENTINEL)) {
        console.log('[patch-blockly] Already patched — skipping.');
        process.exit(0);
    }

    let patchCount = 0;

    // ── Patch 1: removeTypedBlock — guard against undefined type map ──
    const OLD_RTB =
        'removeTypedBlock(a){removeElem$$module$build$src$core$utils$array(this.typedBlocksDB.get(a.type),a);this.typedBlocksDB.get(a.type).length||this.typedBlocksDB.delete(a.type)}';
    const NEW_RTB =
        'removeTypedBlock(a){const _a=this.typedBlocksDB.get(a.type);if(!_a)return;removeElem$$module$build$src$core$utils$array(_a,a);this.typedBlocksDB.get(a.type)?.length||this.typedBlocksDB.delete(a.type)}';

    if (code.includes(OLD_RTB)) {
        code = code.replace(OLD_RTB, NEW_RTB);
        patchCount++;
        console.log('[patch-blockly] ✅ Patched removeTypedBlock (guard undefined type map)');
    } else {
        console.warn('[patch-blockly] ⚠️  removeTypedBlock pattern not found — may already be patched or Blockly version changed');
    }

    // ── Patch 2: removeTopBlock — remove throw, silent no-op ──
    const OLD_RTOB =
        `removeTopBlock(a){if(!removeElem$$module$build$src$core$utils$array(this.topBlocks,a))throw Error("Block not present in workspace's list of top-most blocks.");}`;
    const NEW_RTOB =
        'removeTopBlock(a){removeElem$$module$build$src$core$utils$array(this.topBlocks,a);}';

    if (code.includes(OLD_RTOB)) {
        code = code.replace(OLD_RTOB, NEW_RTOB);
        patchCount++;
        console.log('[patch-blockly] ✅ Patched removeTopBlock (silent no-op instead of throw)');
    } else {
        console.warn('[patch-blockly] ⚠️  removeTopBlock pattern not found — may already be patched or Blockly version changed');
    }

    if (patchCount > 0) {
        // Add sentinel at top
        code = PATCH_SENTINEL + '\n' + code;
        writeFileSync(BLOCKLY_PATH, code, 'utf8');
        console.log(`[patch-blockly] ✅ ${patchCount}/2 patches applied to blockly_compressed.js`);
    } else {
        console.log('[patch-blockly] No patches applied.');
    }
} catch (err) {
    // Don't fail npm install if blockly isn't installed yet
    if (err.code === 'ENOENT') {
        console.log('[patch-blockly] blockly_compressed.js not found — skipping (pre-install?)');
    } else {
        console.error('[patch-blockly] Error:', err.message);
        process.exit(1);
    }
}
