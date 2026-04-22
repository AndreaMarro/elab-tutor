# Together AI batch ingest — patterns for UNLIM Wiki POC

**Date**: 2026-04-23 (sett-4 Day 02 / cumulative Day 23)
**Scope**: S4.1.3 + S4.1.4 ingest experiments + lessons + concepts via Together AI
**Model target**: `meta-llama/Llama-3.3-70B-Instruct-Turbo` (official SDK `/togethercomputer/together-py`)
**Budget guard**: $10 total sett-4 (verified ADR-006 estimate: ~$4.60 at 92×$0.05)
**Source**: context7 query-docs (plugin-context7) + Together AI public docs
**Status**: RESEARCH (pre-implementation, Day 03-05 ingest window)

---

## 1. Three API modes — which one fits UNLIM Wiki?

Together AI exposes three relevant completion paths. Trade-off matrix:

| Mode | Latency | Cost | Throughput | Best for |
|------|---------|------|------------|----------|
| **Sync chat completions** | 1-4s/req | base | 1 req/call | query-time UNLIM response (Edge Function) |
| **Async chat completions** | same | same + polling | N parallel via task queue | mid-batch (10-50 items) |
| **Batch API** (`client.batches.create`) | hours-to-24h | **-50% discount** | thousands/job | **sett-4 ingest** (92 experiments + 27 lessons + 20 concepts = 139 files) |

### Decision: **Batch API for ingest, Sync for runtime queries.**

Rationale:
- Batch 50% discount cuts budget from $4.60 → ~$2.30 for 139 files ingest.
- Ingest is latency-insensitive (notturno one-shot).
- Runtime Edge Function (`unlim-wiki-query`) needs sub-second → sync SDK.

---

## 2. Batch API pattern (canonical Python)

```python
from together import Together

client = Together()

# Step 1: upload JSONL input file
file_resp = client.files.upload(
    file="wiki-ingest-2026-04-25.jsonl",
    purpose="batch-api",
)
input_file_id = file_resp.id

# Step 2: create batch
batch = client.batches.create(
    input_file_id=input_file_id,
    endpoint="/v1/chat/completions",
    completion_window="24h",
    metadata={"sprint": "sett-4", "type": "wiki-ingest"},
)
# batch.id → poll status

# Step 3: poll until terminal (completed/failed/expired/cancelled)
import time
while True:
    status = client.batches.retrieve(batch.id).status
    if status in ("completed", "failed", "expired", "cancelled"):
        break
    time.sleep(60)

# Step 4: download output
output_file_id = client.batches.retrieve(batch.id).output_file_id
content = client.files.content(output_file_id).read()
# → JSONL: one line per input with custom_id + response.body.choices[0].message.content
```

### JSONL input schema (per-line)

```json
{"custom_id":"v1-cap6-esp1","body":{"model":"meta-llama/Llama-3.3-70B-Instruct-Turbo","messages":[{"role":"system","content":"<SCHEMA.md + Principio Zero + volume excerpt>"},{"role":"user","content":"Generate wiki markdown for experiment v1-cap6-esp1 per SCHEMA.md. Cite [volume:Vol1p29]. Max 400 words body."}],"temperature":0.3,"response_format":{"type":"json_object"},"max_tokens":1500}}
```

- `custom_id` ← our experiment/lesson/concept id, used to map back to `docs/unlim-wiki/<type>/<id>.md`.
- `response_format: json_object` guarantees parseable output with fields {`front_matter`, `body_md`}.
- `temperature=0.3` balances determinism (wiki must be stable across runs) vs variation.

---

## 3. Rate limits and error handling

From `together/_exceptions.py` (context7 lookup):

| Exception | Status | Action |
|-----------|--------|--------|
| `AuthenticationError` | 401 | Hard stop — env var `TOGETHER_API_KEY` missing/invalid |
| `PermissionDeniedError` | 403 | Hard stop — account tier issue |
| `RateLimitError` | 429 | Exponential backoff, respect `Retry-After` header |
| `APIConnectionError` | n/a | Retry 3x with 2^n backoff |
| `BadRequestError` | 400 | Log + skip file (malformed prompt, do not retry) |
| `InternalServerError` | 5xx | Retry 2x then fail-loud |

### Backoff pattern for sync path (runtime Edge Function)

```python
from together import Together
import time, random

def call_with_backoff(client, messages, max_attempts=5):
    for attempt in range(max_attempts):
        try:
            return client.chat.completions.create(
                model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
                messages=messages,
                max_tokens=800,
            )
        except RateLimitError as e:
            if attempt == max_attempts - 1:
                raise
            delay = min(2 ** attempt + random.random(), 60)
            time.sleep(delay)
        except APIConnectionError:
            if attempt == max_attempts - 1:
                raise
            time.sleep(2 ** attempt)
```

Note: ELAB runtime is Deno (Supabase Edge Function), not Python. Use native `fetch` with retry wrapper — Together AI REST endpoint is OpenAI-compatible (`/v1/chat/completions` with Bearer auth).

---

## 4. Content-addressable caching (cost guard)

Wiki ingest is deterministic: same input prompt + same model + same temperature → near-identical output. Cache key:

```
sha256(model || input_prompt || temperature || schema_version)
```

Store in `automa/state/ingest-cache/<hash>.json`. On re-run:
- Cache hit → skip Together AI call, reuse prior output. **$0 cost.**
- Cache miss → call API, persist result.

Expected hit rate on iterative dev: 80-90% after first full run. Keeps cost under budget across Day 03-05 iterations.

### Invalidation triggers
- SCHEMA version bump → invalidate all (expected rare).
- Volume text change (rag-chunks.json diff) → invalidate affected experiments only.
- Temperature change → invalidate all.

---

## 5. Principio Zero v3 gate — pre-ingest and post-ingest

### Pre-ingest (prompt construction)

System prompt MUST include:
1. `docs/unlim-wiki/SCHEMA.md` body (conventions + front-matter schema).
2. Principio Zero v3 summary (docente tramite, no meta-istruzioni).
3. Volume excerpt (pdftotext window ±500 words around page).
4. Forbidden-words list: "Docente, leggi", "Docente, dì", "Dire al docente".

### Post-ingest (output validation)

`scripts/wiki-validate-file.mjs` (pending Day 03 creation):

```
1. Parse YAML front-matter — must match SCHEMA fields.
2. grep -E "Docente,? (leggi|dì|spiega)" → fail if match.
3. grep -E "\[volume:Vol[123]p[0-9]+\]" → fail if 0 citations.
4. Word count body > 100 and < 800 → fail outside.
5. Confirm required sections exist per type (experiments: Setup/Passi/Spiegazione/Debug/Domande).
```

Files that fail validation: moved to `docs/unlim-wiki/_quarantine/<id>.md` + logged in `docs/unlim-wiki/log.md` with reason. NOT committed to main wiki tree. Manual review by Andrea.

---

## 6. Estimated cost sheet (sett-4)

| Item | Count | Tokens in/out avg | $/1M in | $/1M out | Est. |
|------|-------|-------------------|---------|----------|------|
| Experiments batch | 92 | 2000 / 1200 | 0.88 | 0.88 | $0.26 |
| Lessons batch | 27 | 1500 / 1500 | 0.88 | 0.88 | $0.07 |
| Concepts batch | 20 | 800 / 1000 | 0.88 | 0.88 | $0.03 |
| Batch API discount (-50%) | — | — | — | — | **~$0.18 total** |
| Runtime queries (est 500/mo) | 500 | 1500 / 400 | 0.88 | 0.88 | $0.84/mo |

Note: Llama-3.3-70B-Instruct-Turbo list price as of 2026-04 Together docs = $0.88/1M tokens (blended). Total sett-4 ingest cost projection **well under $10 budget** (headroom 55x).

Reconciliation vs ADR-006 estimate ($4.60): ADR-006 used older $0.05/file heuristic from sett-2 Groq pricing era. New Together AI pricing is ~10x cheaper for Llama-3.3-70B vs older Llama-2-70B. Updated estimate: $0.18 batch + ~$1/mo runtime.

---

## 7. Open questions for Day 03 implementation

1. **Supabase Edge Function runtime**: Deno stdlib `fetch` vs OpenAI JS SDK vs together-typescript? → Prefer raw `fetch` to minimize bundle size on Edge.
2. **JSONL assembly**: where to generate? → `scripts/wiki-build-batch-input.mjs` reads `src/data/volume-references.js` + `src/data/lesson-groups.js` + SCHEMA, emits JSONL ready for upload.
3. **Polling cadence**: 60s interval adequate for batch window? → Per Together docs `completion_window=24h` is typical async; 60s is safe polling floor without rate-limit concern.
4. **Batch failure partial recovery**: if 5/139 items fail, re-batch only failures or full re-run? → Read output JSONL, collect `custom_id` of failed items, construct fresh batch with those only.
5. **Rate limit tier**: free vs paid tier limits? → Andrea decision: upgrade to paid tier if free tier blocks > 10 rpm (check account dashboard pre-ingest).

---

## 8. Next actions

- Day 03: implement `scripts/wiki-build-batch-input.mjs` + `scripts/wiki-validate-file.mjs`.
- Day 03 late: dry-run build-batch on 3 sample experiments, inspect JSONL.
- Day 04: production batch submit (92 experiments), poll + download + validate.
- Day 04 late: commit wiki files under `docs/unlim-wiki/experiments/`, update `log.md`.
- Day 05: repeat for lessons (27) + concepts (20).
- Day 05 late: run `scripts/wiki-validate-file.mjs` full-tree, quarantine any PZ v3 violators.

---

## 9. References

- context7 id: `/togethercomputer/together-py` (85.5 trust benchmark).
- Together AI docs: Batch Processing, Async Chat Completions, Error Handling.
- ADR-006 §3 (three-layer) and §6 (POC acceptance gate).
- `docs/unlim-wiki/SCHEMA.md` v0.1.0 (output contract).
- `scripts/wiki-validate-file.mjs` (pending Day 03).
