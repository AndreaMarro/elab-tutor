/**
 * ELAB — Firma automatica nel codice sorgente
 * Inserisce "© Andrea Marro — DD/MM/YYYY" ogni 200 righe
 * in tutti i file .js, .jsx, .css sotto src/
 *
 * Uso: node scripts/add-signatures.js
 * Aggiunto come prebuild in package.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.resolve(__dirname, '..', 'src');
const INTERVAL = 200;
const DATE = new Date().toLocaleDateString('it-IT');

const JS_SIGNATURE = `// © Andrea Marro — ${DATE} — ELAB Tutor — Tutti i diritti riservati`;
const CSS_SIGNATURE = `/* © Andrea Marro — ${DATE} — ELAB Tutor — Tutti i diritti riservati */`;

// Marker to avoid duplicate signatures on repeated runs
const MARKER = '© Andrea Marro';

// .jsx excluded: // comments inside JSX return() render as visible text in the UI
const EXTENSIONS = ['.js', '.css'];

function walkDir(dir) {
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            // Skip node_modules, dist, .git
            if (['node_modules', 'dist', '.git', 'nanobot'].includes(entry.name)) continue;
            results.push(...walkDir(fullPath));
        } else if (EXTENSIONS.includes(path.extname(entry.name))) {
            results.push(fullPath);
        }
    }
    return results;
}

function addSignatures(filePath) {
    const ext = path.extname(filePath);
    const signature = ext === '.css' ? CSS_SIGNATURE : JS_SIGNATURE;

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // Remove old auto-signatures first (lines that are EXACTLY the signature pattern)
    const cleaned = lines.filter(line => {
        const trimmed = line.trim();
        // Keep lines that contain © Andrea Marro if they're the ORIGINAL file header (first 10 lines)
        // Remove only the auto-inserted ones (which match the full pattern)
        return !(
            trimmed.startsWith('// © Andrea Marro') &&
            trimmed.includes('ELAB Tutor') &&
            trimmed.includes('Tutti i diritti riservati')
        ) && !(
            trimmed.startsWith('/* © Andrea Marro') &&
            trimmed.includes('ELAB Tutor') &&
            trimmed.includes('Tutti i diritti riservati */')
        );
    });

    // Insert signature every INTERVAL lines
    const result = [];
    for (let i = 0; i < cleaned.length; i++) {
        result.push(cleaned[i]);
        // Every 200 lines (line 200, 400, 600...), insert signature
        if ((i + 1) % INTERVAL === 0 && i + 1 < cleaned.length) {
            result.push(signature);
        }
    }

    const newContent = result.join('\n');
    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        return true;
    }
    return false;
}

// Main
const files = walkDir(SRC_DIR);
let modified = 0;

for (const file of files) {
    if (addSignatures(file)) {
        modified++;
    }
}

const rel = (f) => path.relative(path.resolve(__dirname, '..'), f);
if (modified > 0) {
    process.stdout.write(`[add-signatures] ${modified}/${files.length} files signed (${DATE})\n`);
} else {
    process.stdout.write(`[add-signatures] All ${files.length} files already signed\n`);
}
