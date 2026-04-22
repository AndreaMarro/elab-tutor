/**
 * wiki-dispatch-batch.mjs — Together AI Batch API dispatcher (native fetch, zero deps)
 *
 * DRY-RUN DEFAULT. `--execute` flag required for actual paid POST.
 * Requires `TOGETHER_API_KEY` env var when `--execute` is set.
 *
 * Usage:
 *   node scripts/wiki-dispatch-batch.mjs --input /tmp/wiki-batch-all.jsonl            # dry-run
 *   node scripts/wiki-dispatch-batch.mjs --input /tmp/wiki-batch-all.jsonl --execute  # LIVE
 *
 * Exit codes: 0 PASS, 1 FAIL, 2 DRY_RUN_ONLY (no actual dispatch).
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOGETHER_API = 'https://api.together.xyz/v1';

const BATCH_PRICING_USD_PER_1M_TOKENS = {
  input: 0.44,
  output: 0.44,
};

const ERROR_CODE_MAP = {
  400: 'BadRequest — JSONL payload malformed or missing required field',
  401: 'Authentication — TOGETHER_API_KEY invalid or missing',
  403: 'PermissionDenied — account does not have Batch API access',
  404: 'NotFound — batch/file id does not exist',
  422: 'UnprocessableEntity — request validation failed (check custom_id uniqueness)',
  429: 'RateLimit — too many batch jobs; wait and retry',
  500: 'InternalServerError — Together infra; retry with backoff',
  502: 'InternalServerError — upstream gateway; retry with backoff',
  503: 'InternalServerError — service unavailable; retry with backoff',
};

export function mapErrorCode(status) {
  if (status >= 500) return ERROR_CODE_MAP[500] || `InternalServerError(${status})`;
  return ERROR_CODE_MAP[status] || `UnknownError(${status})`;
}

export function estimateInputTokens(messageContent) {
  if (typeof messageContent !== 'string') return 0;
  return Math.ceil(messageContent.length / 4);
}

export function estimateCostUsd(records) {
  let inputTokens = 0;
  let outputTokens = 0;
  for (const rec of records) {
    const messages = rec?.body?.messages || [];
    for (const m of messages) {
      inputTokens += estimateInputTokens(m?.content || '');
    }
    outputTokens += rec?.body?.max_tokens || 0;
  }
  const inputCost = (inputTokens / 1_000_000) * BATCH_PRICING_USD_PER_1M_TOKENS.input;
  const outputCost = (outputTokens / 1_000_000) * BATCH_PRICING_USD_PER_1M_TOKENS.output;
  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    inputCostUsd: Number(inputCost.toFixed(4)),
    outputCostUsd: Number(outputCost.toFixed(4)),
    totalCostUsd: Number((inputCost + outputCost).toFixed(4)),
  };
}

export function validateLine(line, lineNumber) {
  const errors = [];
  let parsed;
  try {
    parsed = JSON.parse(line);
  } catch (e) {
    errors.push({ line: lineNumber, check: 'json', message: `malformed JSON: ${e.message}` });
    return { valid: false, errors, parsed: null };
  }
  if (!parsed.custom_id || typeof parsed.custom_id !== 'string') {
    errors.push({ line: lineNumber, check: 'custom_id', message: 'missing or non-string custom_id' });
  }
  if (!parsed.body || typeof parsed.body !== 'object') {
    errors.push({ line: lineNumber, check: 'body', message: 'missing body object' });
    return { valid: false, errors, parsed };
  }
  if (!parsed.body.model) {
    errors.push({ line: lineNumber, check: 'body.model', message: 'missing body.model' });
  }
  if (!Array.isArray(parsed.body.messages) || parsed.body.messages.length === 0) {
    errors.push({ line: lineNumber, check: 'body.messages', message: 'missing or empty body.messages' });
  }
  return { valid: errors.length === 0, errors, parsed };
}

export function validateJsonlContent(content) {
  const lines = content.split('\n').filter((l) => l.trim().length > 0);
  const records = [];
  const allErrors = [];
  const customIds = new Set();
  const duplicateCustomIds = [];
  lines.forEach((line, idx) => {
    const result = validateLine(line, idx + 1);
    if (!result.valid) allErrors.push(...result.errors);
    if (result.parsed) {
      records.push(result.parsed);
      if (result.parsed.custom_id) {
        if (customIds.has(result.parsed.custom_id)) {
          duplicateCustomIds.push(result.parsed.custom_id);
        }
        customIds.add(result.parsed.custom_id);
      }
    }
  });
  return {
    lineCount: lines.length,
    records,
    errors: allErrors,
    duplicateCustomIds,
    valid: allErrors.length === 0 && duplicateCustomIds.length === 0,
  };
}

function parseArgs(argv) {
  const args = { input: '/tmp/wiki-batch-all.jsonl', execute: false, pollIntervalSec: 30, out: '/tmp/wiki-batch-output.jsonl' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--input' || a === '--in') args.input = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--execute') args.execute = true;
    else if (a === '--poll-interval') args.pollIntervalSec = Number(argv[++i]);
    else if (a === '--help' || a === '-h') {
      console.log('usage: node scripts/wiki-dispatch-batch.mjs [--input PATH] [--out PATH] [--execute] [--poll-interval SECONDS]');
      process.exit(0);
    }
  }
  return args;
}

async function httpPost(path, body, apiKey, contentType = 'application/json') {
  const res = await fetch(`${TOGETHER_API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': contentType,
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${mapErrorCode(res.status)} — ${text.slice(0, 300)}`);
  }
  return res.json();
}

async function httpGet(path, apiKey) {
  const res = await fetch(`${TOGETHER_API}${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${mapErrorCode(res.status)} — ${text.slice(0, 300)}`);
  }
  return res;
}

async function executeLive({ jsonlContent, apiKey, pollIntervalSec, outPath }) {
  console.log('[LIVE] uploading JSONL to /v1/files...');
  const formData = new FormData();
  const blob = new Blob([jsonlContent], { type: 'application/jsonl' });
  formData.append('file', blob, 'wiki-batch.jsonl');
  formData.append('purpose', 'batch-api');
  const fileRes = await fetch(`${TOGETHER_API}/files`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  });
  if (!fileRes.ok) {
    const text = await fileRes.text().catch(() => '');
    throw new Error(`file upload failed: ${fileRes.status} ${mapErrorCode(fileRes.status)} — ${text.slice(0, 300)}`);
  }
  const fileJson = await fileRes.json();
  console.log(`[LIVE] file uploaded id=${fileJson.id}`);

  console.log('[LIVE] creating batch...');
  const batchJson = await httpPost('/batches', JSON.stringify({
    input_file_id: fileJson.id,
    endpoint: '/v1/chat/completions',
    completion_window: '24h',
  }), apiKey);
  console.log(`[LIVE] batch created id=${batchJson.id} status=${batchJson.status}`);

  let status = batchJson.status;
  let current = batchJson;
  const terminalStates = new Set(['completed', 'failed', 'expired', 'cancelled']);
  while (!terminalStates.has(status)) {
    await new Promise((r) => setTimeout(r, pollIntervalSec * 1000));
    const pollRes = await httpGet(`/batches/${batchJson.id}`, apiKey);
    current = await pollRes.json();
    status = current.status;
    console.log(`[LIVE] poll status=${status} completed=${current.request_counts?.completed ?? '?'}/${current.request_counts?.total ?? '?'}`);
  }

  if (status !== 'completed') {
    throw new Error(`batch ended in non-success state: ${status}`);
  }

  const outputFileId = current.output_file_id;
  if (!outputFileId) throw new Error('completed batch missing output_file_id');

  console.log(`[LIVE] downloading output file id=${outputFileId}...`);
  const contentRes = await httpGet(`/files/${outputFileId}/content`, apiKey);
  const text = await contentRes.text();
  writeFileSync(outPath, text, 'utf8');
  console.log(`[LIVE] output written to ${outPath} (${text.length} bytes)`);
  return { status, outputFileId, outputBytes: text.length, outPath };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputAbs = resolve(args.input);
  if (!existsSync(inputAbs)) {
    console.error(`ERROR: input file not found: ${inputAbs}`);
    process.exit(1);
  }

  const content = readFileSync(inputAbs, 'utf8');
  const validation = validateJsonlContent(content);

  console.log(`input: ${inputAbs}`);
  console.log(`lines: ${validation.lineCount}`);
  console.log(`valid records: ${validation.records.length}`);
  console.log(`errors: ${validation.errors.length}`);
  console.log(`duplicate custom_ids: ${validation.duplicateCustomIds.length}`);

  if (!validation.valid) {
    console.error('VALIDATION FAILED — aborting.');
    console.error(JSON.stringify(validation.errors.slice(0, 10), null, 2));
    if (validation.duplicateCustomIds.length > 0) {
      console.error(`duplicate custom_ids sample: ${validation.duplicateCustomIds.slice(0, 5).join(', ')}`);
    }
    process.exit(1);
  }

  const cost = estimateCostUsd(validation.records);
  console.log('\n--- Cost estimate (Together AI Batch API, Llama 3.3 70B Instruct Turbo batch pricing) ---');
  console.log(`input tokens (est): ${cost.inputTokens.toLocaleString()}`);
  console.log(`output tokens (cap): ${cost.outputTokens.toLocaleString()}`);
  console.log(`input cost: $${cost.inputCostUsd}`);
  console.log(`output cost (max): $${cost.outputCostUsd}`);
  console.log(`total estimate: $${cost.totalCostUsd}`);

  const sample = validation.records[0];
  console.log('\n--- Sample record (first line, redacted) ---');
  console.log(JSON.stringify({
    custom_id: sample?.custom_id,
    model: sample?.body?.model,
    temperature: sample?.body?.temperature,
    max_tokens: sample?.body?.max_tokens,
    message_count: sample?.body?.messages?.length,
    first_message_role: sample?.body?.messages?.[0]?.role,
    first_message_chars: sample?.body?.messages?.[0]?.content?.length,
  }, null, 2));

  if (!args.execute) {
    console.log('\nDRY-RUN complete. Use --execute with TOGETHER_API_KEY set to perform live dispatch.');
    process.exit(2);
  }

  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) {
    console.error('ERROR: --execute requires TOGETHER_API_KEY env var.');
    process.exit(1);
  }

  try {
    const result = await executeLive({
      jsonlContent: content,
      apiKey,
      pollIntervalSec: args.pollIntervalSec,
      outPath: resolve(args.out),
    });
    console.log('\nLIVE dispatch complete:', JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (e) {
    console.error('LIVE dispatch FAILED:', e.message);
    process.exit(1);
  }
}

const isDirectRun = import.meta.url.startsWith('file:') &&
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isDirectRun) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
