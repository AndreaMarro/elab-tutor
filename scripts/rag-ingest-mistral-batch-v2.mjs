#!/usr/bin/env node
// Iter 41 Phase E ADR-034 — RAG re-ingest Mistral embed (replaces Voyage)
//
// Why Mistral over Voyage:
// - MISTRAL_API_KEY already prod (no Andrea signup voyageai.com)
// - mistral-embed 1024-dim matches existing rag_chunks.embedding column
// - EU GDPR-clean (Mistral La Plateforme FR vs Voyage US)
// - Cost ~$0.10/M tok similar Voyage paid tier
// - Higher rate limit than Voyage 3 RPM free
//
// Pipeline:
//   1. Read per-page text files from scripts/bench/output/rag-pages/{vol}_pdf{N}_p{M}.txt
//   2. Chunk per-page (preserves page metadata)
//   3. Mistral mistral-embed batch embed (8 chunks/call)
//   4. Together AI Llama 3.3 70B contextual summary (existing pattern)
//   5. UPSERT rag_chunks with metadata.page populated ≥80%
//
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY=<sb_secret> \
//   MISTRAL_API_KEY=<existing> \
//   TOGETHER_API_KEY=<existing> \
//   node scripts/rag-ingest-mistral-batch-v2.mjs
//
// Note: TOGETHER contextualization optional — set SKIP_CONTEXTUAL=true to skip
// (faster + cheaper, slightly lower retrieval recall).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const PAGES_DIR = path.join(REPO_ROOT, 'scripts', 'bench', 'output', 'rag-pages');

const MISTRAL_API_KEY = (process.env.MISTRAL_API_KEY || '').trim();
const TOGETHER_API_KEY = (process.env.TOGETHER_API_KEY || '').trim();
const SUPABASE_URL = (process.env.SUPABASE_URL || 'https://euqpdueopmlllqjmqnyb.supabase.co').trim();
const SUPABASE_SERVICE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
const SKIP_CONTEXTUAL = (process.env.SKIP_CONTEXTUAL || 'false').toLowerCase() === 'true';

if (!MISTRAL_API_KEY || !SUPABASE_SERVICE_KEY) {
  console.error('ERROR: MISTRAL_API_KEY + SUPABASE_SERVICE_ROLE_KEY required');
  console.error('TOGETHER_API_KEY optional (skip with SKIP_CONTEXTUAL=true)');
  process.exit(1);
}
if (!SKIP_CONTEXTUAL && !TOGETHER_API_KEY) {
  console.error('ERROR: TOGETHER_API_KEY required for contextual mode (or set SKIP_CONTEXTUAL=true)');
  process.exit(1);
}

if (!fs.existsSync(PAGES_DIR)) {
  console.error(`ERROR: pages dir not found ${PAGES_DIR}`);
  console.error('Run scripts/rag-extract-pdf-pages-pdftotext.sh first');
  process.exit(1);
}

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 100;
const EMBED_BATCH_SIZE = 8;
const RATE_DELAY_MS = 1500;  // Mistral paid tier ~30 RPM = 1.5s/req
const MAX_ERRORS = 12;

// Parse filename → {vol, pdf_page, printed_page}
function parsePageFile(filename) {
  const m = filename.match(/^(vol\d)_pdf(\d+)_(?:p(\d+)|pre)\.txt$/);
  if (!m) return null;
  return {
    volume: m[1],
    pdf_page: parseInt(m[2], 10),
    printed_page: m[3] ? parseInt(m[3], 10) : null,
  };
}

function chunkPageText(text, meta) {
  const out = [];
  const trimmed = text.trim();
  if (trimmed.length < 80) return out;  // skip near-empty pages

  for (let i = 0; i < trimmed.length; i += (CHUNK_SIZE - CHUNK_OVERLAP)) {
    const piece = trimmed.slice(i, i + CHUNK_SIZE).trim();
    if (piece.length < 100) continue;
    out.push({
      content: piece,
      char_start: i,
      char_end: Math.min(i + CHUNK_SIZE, trimmed.length),
      ...meta,
    });
  }
  return out;
}

async function embedMistralBatch(texts) {
  const res = await fetch('https://api.mistral.ai/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: texts,
      model: 'mistral-embed',
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Mistral embed ${res.status}: ${errText.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.data.map((d) => d.embedding);
}

async function contextualize(fullPage, chunkContent) {
  if (SKIP_CONTEXTUAL) return '';
  const res = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${TOGETHER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      max_tokens: 60,
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'Genera descrizioni contestuali brevi (max 30 parole) per chunk italiani volume Arduino K-12. Solo descrizione.' },
        { role: 'user', content: `<pagina>\n${fullPage.slice(0, 3000)}\n</pagina>\n\n<chunk>\n${chunkContent}\n</chunk>\n\nDescrizione contesto chunk dentro pagina (max 30 parole):` },
      ],
    }),
  });
  if (!res.ok) return '';  // non-fatal
  return (await res.json()).choices[0].message.content.trim();
}

async function storeChunk(chunk, contextual, embedding) {
  const metadata = {
    chunk_index: chunk.chunk_index,
    char_start: chunk.char_start,
    char_end: chunk.char_end,
    source_type: 'volume',
    pdf_page: chunk.pdf_page,
  };
  if (chunk.printed_page !== null) {
    metadata.page = chunk.printed_page;  // PRIMARY: ADR-034 page metadata target ≥80%
  }
  const finalContent = contextual ? `${contextual}\n\n${chunk.content}` : chunk.content;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rag_chunks`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal,resolution=merge-duplicates',
    },
    body: JSON.stringify({
      content: finalContent,
      content_raw: chunk.content,
      embedding,
      source: chunk.volume,
      contextual_summary: contextual || null,
      metadata,
    }),
  });
  if (!res.ok && res.status !== 409) {
    const errText = await res.text();
    throw new Error(`Supabase ${res.status}: ${errText.slice(0, 150)}`);
  }
}

async function main() {
  console.log('=== RAG Re-ingest Mistral embed (Phase E ADR-034) ===');
  console.log(`Pages dir: ${PAGES_DIR}`);
  console.log(`Embed batch ${EMBED_BATCH_SIZE} chunks/call, sleep ${RATE_DELAY_MS}ms`);
  console.log(`Contextual: ${SKIP_CONTEXTUAL ? 'SKIPPED (no Together)' : 'ENABLED via Together AI Llama 3.3 70B'}`);
  console.log();

  // Read all page files + parse metadata
  const allFiles = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.txt')).sort();
  let allChunks = [];
  for (const f of allFiles) {
    const meta = parsePageFile(f);
    if (!meta) continue;
    const text = fs.readFileSync(path.join(PAGES_DIR, f), 'utf8');
    const chunks = chunkPageText(text, meta).map((c, idx) => ({ ...c, chunk_index: idx, page_text: text }));
    allChunks = allChunks.concat(chunks);
  }
  console.log(`Loaded ${allChunks.length} chunks from ${allFiles.length} page files`);
  console.log();

  let processed = 0, errors = 0;
  for (let i = 0; i < allChunks.length; i += EMBED_BATCH_SIZE) {
    const batch = allChunks.slice(i, i + EMBED_BATCH_SIZE);
    const ctxs = [];
    for (const c of batch) {
      try { ctxs.push(await contextualize(c.page_text, c.content)); }
      catch (_) { ctxs.push(''); }
    }
    let embs;
    try {
      const texts = batch.map((c, j) => `${ctxs[j] || ''}\n\n${c.content}`.trim());
      embs = await embedMistralBatch(texts);
    } catch (e) {
      errors++;
      console.error(`\n[batch ${i}] EMBED FAIL: ${e.message.slice(0, 150)}`);
      if (errors > MAX_ERRORS) {
        console.error('HALT — too many errors');
        break;
      }
      await new Promise((r) => setTimeout(r, RATE_DELAY_MS * 2));
      continue;
    }
    for (let j = 0; j < batch.length; j++) {
      try { await storeChunk(batch[j], ctxs[j], embs[j]); processed++; }
      catch (e) { errors++; console.error(`\n[chunk ${i+j}] STORE FAIL: ${e.message.slice(0, 100)}`); }
    }
    process.stdout.write(`Progress: ${processed}/${allChunks.length} (errors ${errors})  \r`);
    if (i + EMBED_BATCH_SIZE < allChunks.length) {
      await new Promise((r) => setTimeout(r, RATE_DELAY_MS));
    }
  }
  console.log();
  console.log(`\n=== TOTAL: ${processed} chunks ingested, ${errors} errors ===`);
  console.log(`Cost Mistral embed est: ~$${((allChunks.length * 250 / 1_000_000) * 0.10).toFixed(3)} (250 tok/chunk avg @ $0.10/M)`);
  if (!SKIP_CONTEXTUAL) {
    console.log(`Cost Together est: ~$${((allChunks.length * 200 / 1_000_000) * 0.18).toFixed(3)} (200 tok/contextual @ $0.18/M)`);
  }

  // Verify SQL
  console.log('\n--- Page coverage verification ---');
  console.log(`Run: npx supabase db query --linked "SELECT COUNT(*) FILTER (WHERE metadata->>'page' IS NOT NULL) * 100.0 / NULLIF(COUNT(*),0) AS page_pct FROM rag_chunks WHERE source IN ('vol1','vol2','vol3');"`);
  console.log(`Target: ≥80%`);
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
