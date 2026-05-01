# Mac Mini Autonomous iter 39+ → Sprint T Close Implementation Plan

> **For agentic workers (Mac Mini Claude desktop Opus 4.7 1M):** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Read FIRST before any action**: §1 Bootstrap + §2 Anti-conflict + §3 CoV protocol + §4 Quality metrics. Then execute Task queue §6 in order.

**Goal:** Continue iter 38 carryover work autonomously without MacBook session supervision until Andrea returns. Drive Sprint T close target 9.5/10 ONESTO via prioritized atom queue, periodic CoV gates, and quality audit metrics.

**Architecture:** Single-agent autonomous loop on Mac Mini Claude desktop with Opus 4.7 1M context. Each cycle = 1 atom end-to-end (CoV pre-flight → implement → CoV post → audit → commit → push) with explicit stop conditions and judgment formulas. NO multi-agent spawn (org limit risk). NO Mac Mini delegation TO other Mac Minis (single-host).

**Tech Stack:** React 19 + Vite 7 PWA frontend, Supabase Edge Functions (Deno) backend, Mistral La Plateforme primary LLM, Voyage AI embeddings, Voxtral TTS (voice clone Andrea), Pixtral Vision, CF Whisper STT, pgvector hybrid RAG. Skills: superpowers:* + elab-* custom marketplace.

**Anti-inflation G45 mandate:** cap 9.5 ONESTO Opus indipendente review mandatory. NEVER claim "Sprint T close achieved" without all PDR §4 cap conditions met. NO `--no-verify`. NO push main. NO debito tecnico — explicit defer iter 40+ documented per atom skipped.

---

## §1 Bootstrap — Mac Mini environment setup (run FIRST, ~10 min)

### 1.1 Repo path + worktree

Mac Mini already has `~/Projects/elab-tutor` cloned (per Sprint U PDR commit `7b28c71`). Verify or pull latest:

```bash
cd ~/Projects/elab-tutor
git fetch origin
git checkout e2e-bypass-preview
git pull origin e2e-bypass-preview
git log --oneline -5
# Expected top: 792acf8 feat(iter-38-carryover): A14 codemod TRUE 14 + R6 SQL backfill + A2 Fumetto spec fix
```

### 1.2 Keys provisioning (MUST be set before any deploy/bench)

| Key | Source | How to set on Mac Mini |
|-----|--------|------------------------|
| `SUPABASE_ACCESS_TOKEN` | MacBook `~/.zshrc` line `export SUPABASE_ACCESS_TOKEN="sbp_..."` | Andrea: `scp ~/.zshrc progettibelli@100.124.198.59:~/.zshrc.elab-keys` then on Mac Mini `source ~/.zshrc.elab-keys` |
| `SUPABASE_ANON_KEY` | Same as above | Same |
| `TOGETHER_API_KEY` | Same as above | Same |
| `VITE_ELAB_API_KEY` | Repo `.env` line 55 `VITE_ELAB_API_KEY=0909e4b4...` | `git pull` brings .env if not gitignored — if missing, Andrea: `scp .env` |
| `VITE_SUPABASE_EDGE_KEY` | Repo `.env` line 18 | Same |
| Vercel auth | `npx vercel login` cached session | Andrea: run `npx vercel login` on Mac Mini once before autonomous start |
| GEMINI_API_KEY / MISTRAL_API_KEY / VOYAGE_API_KEY / SUPABASE_SERVICE_ROLE_KEY / CLOUDFLARE_API_TOKEN | Server-side only (Supabase secrets, Edge Function reads) | NO local export needed — Edge Function deploy via `supabase functions deploy` is enough |

Verify on Mac Mini:
```bash
echo "SUPABASE_ACCESS_TOKEN: ${SUPABASE_ACCESS_TOKEN:0:10}..."
echo "SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY:0:30}..."
echo "TOGETHER_API_KEY: ${TOGETHER_API_KEY:0:8}..."
[ -f ~/Projects/elab-tutor/.env ] && grep -c "VITE_ELAB_API_KEY=" ~/Projects/elab-tutor/.env || echo ".env MISSING - request Andrea"
npx vercel whoami
# Expected: andreamarro
```

If ANY key fails: STOP. Write blocker doc `docs/audits/iter-39-mac-mini-bootstrap-blocker-{timestamp}.md` and HALT autonomous loop. Andrea must provision before retry.

### 1.3 Tooling verify

```bash
node -v   # Expected: v25.9.0+
npm -v    # Expected: 11.12.1+
npx vitest --version    # Expected: 3.x
npx playwright --version # Expected: 1.x
node -e "console.log('OK')" # smoke node OK
which gh || echo "gh CLI missing"
which jq || brew install jq
```

### 1.4 Skills available verify

Mac Mini Claude desktop bare install. Verify these skills loaded (per `claude --version` 2.1.119+):

Required skills to invoke during execution:
- `superpowers:using-superpowers` (auto-loaded)
- `superpowers:executing-plans` or `superpowers:subagent-driven-development`
- `superpowers:test-driven-development`
- `superpowers:verification-before-completion`
- `superpowers:requesting-code-review`
- `elab-quality-gate` (custom skill, use after each atom)
- `elab-principio-zero-validator` (PZ V3 12-rule scorer)
- `elab-benchmark` (R5/R6/R7 runner)
- `elab-harness-real-runner` (94 esperimenti Playwright)

If any skill missing: `claude /skill list` and document gaps. Continue without if non-blocking; STOP if `superpowers:executing-plans` missing.

### 1.5 Memory boot — read these files BEFORE first task

Read in order (all paths relative to repo root):

1. `CLAUDE.md` — project context + DUE PAROLE D'ORDINE (PRINCIPIO ZERO + MORFISMO) + iter 38 close section
2. `docs/audits/2026-05-01-iter-38-deploy-chain-and-tier1-final-audit.md` — last MacBook session work
3. `docs/audits/iter-39-api-latency-optimization-research.md` — Tier 1+2+3 latency research (462 LOC)
4. `docs/audits/iter-39-rag-metadata-backfill-coverage.md` — R6 page=0% blocker rationale
5. `docs/audits/iter-38-linguaggio-codemod.md` — A14 honest 14 TRUE scope rationale
6. `docs/audits/2026-05-01-iter-38-PHASE3-CLOSE-audit.md` — iter 38 close ONESTO 8.0/10
7. `docs/handoff/2026-05-01-iter-38-to-iter-39-handoff.md` — iter 39 priorities
8. `docs/handoff/2026-05-01-iter-39-andrea-ratify-queue-paste-ready.md` — Andrea queue
9. `docs/pdr/PDR-ITER-38-SPRINT-T-CLOSE-CARRYOVER-COMPLETE.md` — original PDR cap rules
10. `.impeccable.md` — design source of truth (Brand + 5 principles + Test Morfismo 10-check)

Total reading ~3000 LOC. Budget 30 min absorption.

---

## §2 Anti-conflict with parallel /mem-search session

MacBook session is running `/mem-search` skill on different repo or scope. Mac Mini MUST NOT:
- Write to `~/.claude-mem/` directory
- Invoke `/mem-search` or `/claude-mem:*` skills
- Modify `automa/state/heartbeat` (used by Mac Mini cron, READ-only here)
- Touch `automa/team-state/messages/` files older than 24h (MacBook may be reading them)

Mac Mini ALLOWED to:
- Read any file in repo
- Write NEW files in `docs/audits/`, `docs/handoff/`, `docs/superpowers/plans/`, `automa/team-state/messages/macmini-iter39-*.md`
- Modify source code in `src/`, `supabase/functions/`, `tests/`, `scripts/` per atom scope
- Apply migrations via `supabase db push --linked`
- Deploy Edge Functions via `supabase functions deploy`
- Vercel deploy via `vercel --prod --yes --archive=tgz`
- Commit + push to branch `e2e-bypass-preview` (NEVER main)

Conflict detection: before each commit, run:
```bash
git fetch origin
git status -uno
git log origin/e2e-bypass-preview..HEAD --oneline
git log HEAD..origin/e2e-bypass-preview --oneline
# If origin has new commits, rebase first: git pull --rebase origin e2e-bypass-preview
```

If rebase produces conflicts in `CLAUDE.md`, `automa/state/heartbeat`, or shared bench output: **HALT**. Write `automa/team-state/messages/macmini-iter39-rebase-conflict-{timestamp}.md` + STOP autonomous loop until Andrea resolves.

---

## §3 CoV protocol — run on EVERY cycle entry + exit

### 3.1 Pre-cycle entry (4 commands)

```bash
cd ~/Projects/elab-tutor

# 1. Vitest baseline preserve
npx vitest run --reporter=basic 2>&1 | tail -5
# Expected: Tests 13474 passed | 15 skipped | 8 todo (13497)
# If <13474 → STOP, investigate flake or regression, fix before atom start

# 2. Edge Function status
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase functions list --project-ref euqpdueopmlllqjmqnyb 2>&1 | grep -E "unlim-(chat|stt|vision|tts)"
# Expected: unlim-chat v56+ ACTIVE, others ACTIVE

# 3. Vercel prod live
curl -sI "https://www.elabtutor.school" | grep -E "HTTP|last-modified" | head -3
# Expected: HTTP/2 200 + last-modified within last 24h

# 4. Git state clean (no uncommitted from prior cycle)
git status --short
# Expected: empty OR only files this cycle plans to touch
```

### 3.2 Post-cycle exit (5 commands)

```bash
# 1. Vitest 13474+ preserved (NEVER scendere)
npx vitest run --reporter=basic 2>&1 | tail -5

# 2. Build PASS (only if src/ touched)
npm run build 2>&1 | tail -10
# Expected: ✓ built in <14min + dist/sw.js + 32 precache entries

# 3. Pre-commit hook will run on commit (vitest + build delta)
git add <specific files only, NO git add -A>
git commit -m "feat/fix/docs(iter-39-atom-N): description"
# If pre-commit fails → fix root cause, NEW commit. NEVER --no-verify.

# 4. Push origin (pre-push hook also runs)
git push origin e2e-bypass-preview

# 5. Audit doc + score recalculation (see §4)
```

### 3.3 Smoke prod after EVERY Edge Function deploy

```bash
SUPABASE_ANON_KEY=$(grep "^export SUPABASE_ANON_KEY" ~/.zshrc | cut -d= -f2- | tr -d '"\047 ')
ELAB_API_KEY=$(grep "^VITE_ELAB_API_KEY=" .env | cut -d= -f2 | tr -d '"\047 ')

curl -s -X POST "https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "x-elab-api-key: $ELAB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message":"Spiegate ai ragazzi cosa è un LED, citando il volume","sessionId":"smoke-iter39-cycle-N","experimentId":"v1-cap6-esp1"}' \
  | python3 -c "import sys,json; d=json.load(sys.stdin); txt=d.get('response') or ''; print('source:', d.get('source')); print('words:', len(txt.split())); print('has_ragazzi:', 'agazz' in txt.lower()); print('has_vol_pag:', 'Vol.' in txt or 'pag.' in txt); print('has_kit:', 'kit' in txt.lower())"
```

Expected: `has_ragazzi: True`, `has_vol_pag: True`, `has_kit: True`, words ≤80.

If smoke FAIL post-deploy: revert deploy via `git revert HEAD` + redeploy previous version. Document in audit.

---

## §4 Quality audit metrics + judgment formulas

### 4.1 Box-by-box scoring (PDR iter 38 §4 ricalibrato post-this-session)

| Box | Definition | Current | Target Sprint T close | Lift potential iter 39+ |
|-----|------------|---------|------------------------|--------------------------|
| 1 VPS GPU | Path A pod TERMINATED | 0.4 | 0.4 | none (decommissioned) |
| 2 stack | CF Workers AI multimodal | 0.7 | 0.8 | A8 Vision smoke +0.1 |
| 3 RAG | 1881 chunks, 8.7% chapter / 0% page | 0.7 | 1.0 | Voyage re-ingest with page metadata +0.3 |
| 4 Wiki | 126/100 concepts | 1.0 | 1.0 | none |
| 5 R0 | 91.80% PASS | 1.0 | 1.0 | none |
| 6 Hybrid RAG | recall@5 0.067 (page=0% block) | 0.85 | 1.0 | Voyage re-ingest +0.15 OR fixture v3 +0.10 |
| 7 Vision | Pixtral live, Gemini deploy unverified | 0.75 | 0.9 | A8 smoke +0.15 |
| 8 TTS | Voxtral primary + voice clone Andrea | 0.95 | 1.0 | A9 STT migration Voxtral Transcribe 2 +0.05 |
| 9 R5 ≥85% | 94.2% PASS / 1607ms / 3380ms | 1.0 | 1.0 | preserve |
| 10 ClawBot | L2 templates 20/20 LIVE | 1.0 | 1.0 | A10 Deno port 12-tool +0.05 capped |
| 11 Onniscenza | 7-layer wired + classifier + Cron warmup | 0.9 | 1.0 | canary 100% rollout +0.1 |
| 12 GDPR | 4 docs DRAFT | 0.75 | 0.85 | sub-processor sign +0.1 |
| 13 UI/UX | Modalità + Floating + A14 14 + Fumetto fix | 0.85 | 1.0 | A6 Lighthouse perf optim +0.15 |
| 14 INTENT exec | T1.1 cache + canary ON, R7 canonical 3.6% | 0.95 | 1.0 | R7 ≥95% canonical (need L2 reduce + heuristic widen) +0.05 |

Box subtotal current: 13.10/14 → 9.36/10. **Cap Sprint T close 9.5 conditional**:
1. R6 ≥0.55 recall@5 ACHIEVED (+0.15 Box 6)
2. R7 ≥95% canonical ACHIEVED (+0.05 Box 14)
3. A10 Onnipotenza Deno port LIVE prod (+0.05 Box 10 ceiling)
4. Lighthouse perf ≥90 BOTH routes ChatbotOnly + EasterModal (+0.15 Box 13)
5. A15 94 esperimenti broken count REAL ≤10 documented (no box, but cap removal)
6. Opus indipendente review G45 mandate

### 4.2 Bench thresholds

| Bench | Pass threshold | Cap if fail |
|-------|----------------|-------------|
| vitest baseline | ≥13474 NEVER scendere | cap 7.5 mechanical |
| Build | PASS pre-commit | cap 6.0 mechanical |
| R5 50-prompt avg | <3000ms | cap 8.5 |
| R5 50-prompt p95 | <6000ms | cap 8.5 |
| R5 PZ V3 | ≥85% | cap 8.0 |
| R6 100-prompt recall@5 | ≥0.55 | cap 9.0 |
| R7 200-prompt canonical | ≥80% (≥95% target) | cap 8.5 |
| Tester-4 STT 9-cell | 9/9 PASS <500ms | cap 9.0 |
| Lighthouse perf | ≥90 | cap 9.0 |
| Lighthouse a11y | ≥95 | cap 9.5 |
| Lighthouse SEO | ≥100 | cap 9.5 |
| 94 esperimenti broken | ≤10 | cap 9.0 |

### 4.3 Score formula iter 39+

```
score_raw = (atoms_passed / atoms_attempted) * 8.0
          + (carryover_closed / 24) * 1.5
          + bonus_anti_inflation_max_0.5

score_final = MIN(score_raw, G45_cap_dynamic)
```

`G45_cap_dynamic` = MIN of all triggered cap conditions §4.2 + §4.1 box conditions.

### 4.4 Per-cycle audit doc template

After each atom completion, write `docs/audits/iter-39-cycle-{N}-{atom_id}-audit.md`:

```markdown
# iter 39 cycle {N} — atom {atom_id} audit

**Date**: {ISO timestamp}
**Atom**: {atom_id} {atom_name}
**Status**: {SHIPPED | PARTIAL | DEFERRED | BLOCKED}

## Pre-cycle CoV
- vitest: {N PASS}
- Edge Function: {version + status}
- Vercel: {HTTP 200 + last-modified}

## Implementation
{summary 5-10 lines what done + LOC delta + files touched}

## Post-cycle CoV
- vitest: {N PASS — preserved? regress?}
- Build: {PASS/FAIL + duration}
- Smoke prod: {Italian + Vol/pag + kit_mention verdict}
- Bench delta (if applicable): R5 / R6 / R7 / Lighthouse

## Box updates
{box N: from X.Y → from W.Z, rationale}

## Honesty caveats
{1-3 critical caveats — what was inflated, what didn't work, what defers}

## Commit
{commit SHA + message}

## Next atom
{atom_id from §6 queue OR HALT condition met}
```

---

## §5 Stop conditions — HALT autonomous loop

Stop loop + write blocker doc + ping Andrea via `automa/team-state/messages/macmini-iter39-HALT-{reason}-{timestamp}.md` if ANY:

1. vitest <13474 PASS post-cycle (regression introduced)
2. Build FAIL post-cycle
3. Pre-commit hook fails 3x consecutive (real bug, not flake)
4. Smoke prod returns non-200 OR no Italian "Ragazzi" OR no Vol/pag verbatim
5. Edge Function deploy fails 2x consecutive
6. Vercel deploy fails 2x consecutive
7. Mistral / Voyage / Together / CF API rate limit hit (HTTP 429) >3 retries
8. Disk space <2GB (cleanup `rm -rf node_modules && npm install` workaround OR HALT)
9. Mac Mini RAM <500MB free (kill chrome/playwright + retry, OR HALT)
10. Atom requires Andrea decision (D1+D2+D3+D4 ratify queue) — write `automa/team-state/messages/macmini-iter39-andrea-ratify-needed-{atom}.md` + skip to next atom
11. Atom requires Tea/Davide presence — defer + skip
12. Cumulative cycle count >40 OR cumulative wall-clock >24h — HALT, request Andrea review
13. Repo size >5GB OR git pack >1GB — `git gc --aggressive` OR HALT
14. ANY uncertain destructive operation (rm -rf outside dist/, git reset --hard, supabase db reset) — HALT, never execute

---

## §6 Atom queue — execute in this order, ONE at a time

Each atom = one Task. Execute end-to-end: pre-CoV → implement → post-CoV → audit → commit → push → next.

### Task 1: A8 Vision Gemini Flash deploy verify (~1h, ROI: Box 7 +0.15)

**Files:**
- Read: `supabase/functions/unlim-vision/index.ts:1-100` (verify Gemini primary path code present)
- Modify: NONE expected (deploy + smoke verify only)
- Audit: `docs/audits/iter-39-a8-vision-gemini-smoke.md` NEW

- [ ] **Step 1: Pre-cycle CoV** (run §3.1 commands; verify GREEN)

- [ ] **Step 2: Verify Gemini primary code path**

```bash
grep -nE "GEMINI_API_KEY|gemini-2.5-flash|provider:.*gemini" supabase/functions/unlim-vision/index.ts | head -10
```

Expected: lines showing `model: 'gemini-2.5-flash'` + `provider: 'gemini-2.5-flash'`. Code already supports per iter 36 A2.

- [ ] **Step 3: Verify Supabase secret GEMINI_API_KEY set**

```bash
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase secrets list --project-ref euqpdueopmlllqjmqnyb | grep -E "GEMINI"
```

Expected: `GEMINI_API_KEY` listed with digest hash. If missing, write blocker doc + ratify Andrea.

- [ ] **Step 4: Smoke unlim-vision Gemini path**

```bash
SUPABASE_ANON_KEY=$(grep "^export SUPABASE_ANON_KEY" ~/.zshrc | cut -d= -f2- | tr -d '"\047 ')
ELAB_API_KEY=$(grep "^VITE_ELAB_API_KEY=" .env | cut -d= -f2 | tr -d '"\047 ')

# Use a small base64 image (10x10 red PNG) for smoke
B64=$(printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\x08\x02\x00\x00\x00\x02PX\xea\x00\x00\x00\x16IDATx\x9cc\xfc\xcf\xc0\x00\x06\x18\x80\x80\x18\x18\x18\x18\x18\x00\x07\x84\x01\x80n\xb0\xd8\xa1\x00\x00\x00\x00IEND\xaeB`\x82' | base64)

curl -s -i -X POST "https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-vision" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "x-elab-api-key: $ELAB_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Cosa vedi nel circuito?\",\"image\":\"data:image/png;base64,$B64\",\"sessionId\":\"smoke-vision\"}" 2>&1 | head -30
```

Expected: HTTP 200 + header `X-Vision-Provider: gemini-2.5-flash` (NOT `pixtral-12b` fallback).

- [ ] **Step 5: Document result + commit audit doc**

If Gemini PRIMARY confirmed → Box 7 0.75 → 0.9. If Pixtral fallback fired → write rationale (Gemini quota exhausted? key invalid?) + box stays 0.75.

```bash
git add docs/audits/iter-39-a8-vision-gemini-smoke.md
git commit -m "docs(iter-39-a8): Vision Gemini Flash smoke verify"
git push origin e2e-bypass-preview
```

---

### Task 2: A6 Lighthouse perf optim ChatbotOnly + EasterModal (~3h, ROI: Box 13 +0.15)

**Goal:** lift Lighthouse perf 26+23 FAIL → ≥90 PASS. Per iter 38 audit research, root causes likely: aggressive PWA precache (32 entries 4816 KiB), heavy initial bundle (LavagnaShell 2381KB, index 2237KB, react-pdf 1911KB), no lazy mount route components, no image optim.

**Files:**
- Modify: `vite.config.js` (chunking strategy + PWA precache entries reduce)
- Modify: `src/main.jsx` or `src/App.jsx` (lazy import EasterModal + ChatbotOnly + LavagnaShell)
- Modify: `src/components/HomePage.jsx` (remove sync imports of heavy components)
- Audit: `docs/audits/iter-39-a6-lighthouse-perf-optim.md` NEW
- Lighthouse re-run reports: `docs/audits/iter-39-lighthouse-{chatbot-only,easter-modal}-post-optim.json`

- [ ] **Step 1: Pre-cycle CoV** (§3.1)

- [ ] **Step 2: Audit current bundle**

```bash
npm run build 2>&1 | tail -25 > /tmp/build-pre.log
grep -E "kB.*gzip" /tmp/build-pre.log | sort -k2 -h -r | head -10
```

Document top 10 chunks + sizes in audit.

- [ ] **Step 3: Optim 1 — lazy mount EasterModal + ChatbotOnly**

Find current imports in `src/components/HomePage.jsx`. Replace sync imports with `React.lazy`:

```jsx
// Before
import EasterModal from './easter/EasterModal.jsx';
import ChatbotOnly from './chatbot/ChatbotOnly.jsx';

// After
const EasterModal = React.lazy(() => import('./easter/EasterModal.jsx'));
const ChatbotOnly = React.lazy(() => import('./chatbot/ChatbotOnly.jsx'));
```

Wrap usage in `<Suspense fallback={<div>Caricamento…</div>}>`.

- [ ] **Step 4: Optim 2 — vite.config.js manualChunks**

Add to `vite.config.js` rollupOptions:

```js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'codemirror': ['@codemirror/state', '@codemirror/view', '@codemirror/lang-cpp'],
        'recharts': ['recharts'],
        'mammoth': ['mammoth'],
        'react-pdf': ['react-pdf', 'pdfjs-dist'],
        // Heavy lavagna split
        'lavagna-shell': ['./src/components/lavagna/LavagnaShell.jsx'],
        'simulator': ['./src/components/simulator/NewElabSimulator.jsx'],
      },
    },
  },
},
```

- [ ] **Step 5: Optim 3 — PWA precache reduce**

Edit `vite.config.js` VitePWA config: limit precache to critical routes only (NOT all chunks).

```js
workbox: {
  globPatterns: ['**/*.{js,css,html}'],
  globIgnores: [
    '**/lavagna-shell-*.js',
    '**/simulator-*.js',
    '**/recharts-*.js',
    '**/mammoth-*.js',
    '**/react-pdf-*.js',
    '**/codemirror-*.js',
  ],
  maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB cap
}
```

- [ ] **Step 6: Build + verify**

```bash
npm run build 2>&1 | tail -25 > /tmp/build-post.log
diff <(grep -E "kB.*gzip" /tmp/build-pre.log | sort) <(grep -E "kB.*gzip" /tmp/build-post.log | sort)
```

Expected: `index.html` chunk size reduced + lazy chunks separated.

- [ ] **Step 7: Vitest 13474 preserved**

```bash
npx vitest run --reporter=basic 2>&1 | tail -5
```

- [ ] **Step 8: Vercel deploy + Lighthouse re-test**

```bash
npx vercel --prod --yes --archive=tgz
# wait for ready
curl -sI "https://www.elabtutor.school" | grep last-modified

npx lighthouse "https://www.elabtutor.school/#chatbot-only" --output=json --output-path=docs/audits/iter-39-lighthouse-chatbot-only-post-optim.json --chrome-flags="--headless" --only-categories=performance,accessibility,seo
npx lighthouse "https://www.elabtutor.school/#about-easter" --output=json --output-path=docs/audits/iter-39-lighthouse-easter-modal-post-optim.json --chrome-flags="--headless" --only-categories=performance,accessibility,seo

jq '.categories.performance.score, .categories.accessibility.score, .categories.seo.score' docs/audits/iter-39-lighthouse-*post-optim.json
```

Expected: perf ≥0.90, a11y ≥0.95, seo ≥1.00.

- [ ] **Step 9: Audit + commit**

If perf ≥0.90 BOTH routes → Box 13 +0.15. Else document residual bottleneck + defer iter 40+.

```bash
git add vite.config.js src/components/HomePage.jsx docs/audits/iter-39-a6-lighthouse-perf-optim.md docs/audits/iter-39-lighthouse-*post-optim.json
git commit -m "perf(iter-39-a6): Lighthouse perf optim — lazy mount + chunking + PWA precache reduce"
git push origin e2e-bypass-preview
```

---

### Task 3: A15 Playwright 94 esperimenti UNO PER UNO sweep (~3h headless, ROI: documented broken count, cap removal)

**Files:**
- Use: `tests/e2e/29-92-esperimenti-audit.spec.js` (396 LOC, iter 29 P0 task D)
- Use: `tests/e2e/playwright.iter29.config.js`
- Output: `tests/e2e/output/29-92-esperimenti-audit/` (NEW dir)
- Audit: `docs/audits/iter-39-a15-94-esperimenti-broken-real.md` NEW

- [ ] **Step 1: Pre-cycle CoV** (§3.1)

- [ ] **Step 2: Run Playwright spec headless against prod**

```bash
ELAB_PROD_URL="https://www.elabtutor.school" \
  npx playwright test tests/e2e/29-92-esperimenti-audit.spec.js \
  --config tests/e2e/playwright.iter29.config.js \
  --reporter=list,json \
  --reporter-output-dir=tests/e2e/output/29-92-esperimenti-audit \
  2>&1 | tee tests/e2e/output/29-92-esperimenti-audit/run.log
```

Wall-clock ~3h. STOP gate: if first 10 esperimenti all FAIL → spec broken (env issue), HALT + audit blocker.

- [ ] **Step 3: Parse results**

```bash
python3 - <<'EOF'
import json, glob
results = json.load(open(glob.glob('tests/e2e/output/29-92-esperimenti-audit/*.json')[0]))
working = sum(1 for s in results['suites'] for t in s.get('specs', []) if t.get('ok'))
broken = sum(1 for s in results['suites'] for t in s.get('specs', []) if not t.get('ok'))
print(f'WORKING: {working}, BROKEN: {broken}, TOTAL: {working+broken}')
EOF
```

Document broken count REAL. Target: ≤10.

- [ ] **Step 4: Generate audit doc**

For each BROKEN, document:
- experimentId
- failure category (mount fail / SVG=0 / page errors / components mismatch)
- root cause hypothesis (from spec output)

- [ ] **Step 5: Commit audit + screenshots**

```bash
git add tests/e2e/output/29-92-esperimenti-audit/ docs/audits/iter-39-a15-94-esperimenti-broken-real.md
git commit -m "test(iter-39-a15): 94 esperimenti broken count REAL audit"
git push origin e2e-bypass-preview
```

If broken ≤10 → cap 9.0 condition removed. If broken >10 → document priority fix list iter 40+ (top 5 broken to fix).

---

### Task 4: C7 Tea Glossario port main app (~4h, ROI: Box 13 +0.05 + Tea iter 33+ carryover closed)

**Source apps (Tea-built):**
- https://elab-tutor-glossario.vercel.app
- https://elab-tutor-glossario-2oe3tdaoq-teodoradevenere26-9979s-projects.vercel.app

**Files:**
- Create: `src/components/glossario/Glossario.jsx` (main component)
- Create: `src/components/glossario/Glossario.module.css` (styles)
- Create: `src/components/glossario/glossarioData.js` (term data — port from Tea Vercel deploy)
- Create: `src/components/glossario/GlossarioSearch.jsx` (search input + filter)
- Create: `tests/unit/components/glossario/Glossario.test.jsx` (unit tests ≥10)
- Modify: `src/components/HomePage.jsx` (add hash route `#glossario`)
- Audit: `docs/audits/iter-39-c7-glossario-port.md`

- [ ] **Step 1: Fetch Tea Vercel deploy source code via HTML scraping**

```bash
mkdir -p /tmp/tea-glossario-fetch
curl -sL "https://elab-tutor-glossario.vercel.app" -o /tmp/tea-glossario-fetch/index.html
# Find chunk URLs in HTML
grep -oE '"/_next/static/chunks/[^"]+\.js"' /tmp/tea-glossario-fetch/index.html | head -5
# Fetch each chunk
# OR use WebFetch tool
```

Use WebFetch tool to fetch HTML source + chunk URLs. Extract glossary term list (likely JSON in chunk).

If Tea Vercel returns 401/403 (private deploy), document and request Andrea share source repo URL.

- [ ] **Step 2: Write Glossario component scaffold**

```jsx
// src/components/glossario/Glossario.jsx
import React, { useState, useMemo } from 'react';
import css from './Glossario.module.css';
import { GLOSSARY_TERMS } from './glossarioData.js';
import GlossarioSearch from './GlossarioSearch.jsx';

export default function Glossario({ onClose }) {
  const [search, setSearch] = useState('');
  const [letter, setLetter] = useState('A');

  const filtered = useMemo(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return GLOSSARY_TERMS.filter(t =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q)
      );
    }
    return GLOSSARY_TERMS.filter(t => t.term[0].toUpperCase() === letter);
  }, [search, letter]);

  const letters = ['A','B','C','D','E','F','G','H','I','L','M','N','O','P','Q','R','S','T','U','V','Z'];

  return (
    <div className={css.glossario}>
      <header className={css.header}>
        <h1>Glossario ELAB</h1>
        <p>Ragazzi, scegliete una lettera o cercate un termine.</p>
        {onClose && <button onClick={onClose} aria-label="Chiudi">×</button>}
      </header>
      <GlossarioSearch value={search} onChange={setSearch} />
      <nav className={css.alphabet}>
        {letters.map(l => (
          <button
            key={l}
            className={letter === l ? css.active : ''}
            onClick={() => { setLetter(l); setSearch(''); }}
            aria-pressed={letter === l}
          >
            {l}
          </button>
        ))}
      </nav>
      <ul className={css.terms}>
        {filtered.map(t => (
          <li key={t.term} className={css.term}>
            <strong>{t.term}</strong>
            <p>{t.definition}</p>
            {t.volRef && <small>Vol.{t.volRef.vol} pag.{t.volRef.pag}</small>}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Glossario data** — port from Tea Vercel OR build from `src/data/rag-chunks.json` glossary subset

If Tea source unavailable: extract `source: 'glossary'` chunks from `src/data/rag-chunks.json`:

```bash
node -e "
const chunks = require('./src/data/rag-chunks.json');
const glossary = chunks.filter(c => c.source === 'glossary' || c.source === 'glossario');
console.log(JSON.stringify(glossary.map(c => ({
  term: c.section_title || c.metadata?.term || 'unknown',
  definition: c.content_raw || c.content || '',
  volRef: c.metadata?.volRef || null,
})), null, 2));
" > src/components/glossario/glossarioData.json

# Convert to ESM module
echo "export const GLOSSARY_TERMS = $(cat src/components/glossario/glossarioData.json);" > src/components/glossario/glossarioData.js
```

- [ ] **Step 4: Write unit tests (TDD)**

```jsx
// tests/unit/components/glossario/Glossario.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Glossario from '../../../../src/components/glossario/Glossario.jsx';

describe('Glossario', () => {
  it('renders header with plurale Ragazzi', () => {
    render(<Glossario />);
    expect(screen.getByText(/Ragazzi/i)).toBeInTheDocument();
  });

  it('shows alphabet navigation', () => {
    render(<Glossario />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('Z')).toBeInTheDocument();
  });

  it('filters by letter', () => {
    render(<Glossario />);
    fireEvent.click(screen.getByText('B'));
    // assert at least 1 term starting with B (depends on data)
  });

  it('search filters across terms', () => {
    render(<Glossario />);
    const input = screen.getByPlaceholderText(/cerca/i);
    fireEvent.change(input, { target: { value: 'led' } });
    expect(screen.queryAllByText(/LED/i).length).toBeGreaterThan(0);
  });

  // Add ≥6 more tests
});
```

- [ ] **Step 5: Wire into HomePage hash route**

```jsx
// In src/components/HomePage.jsx — find existing hash route handler (#chatbot-only / #about-easter)
// Add similar:
const Glossario = React.lazy(() => import('./glossario/Glossario.jsx'));

// Inside render, hash check:
if (route === '#glossario') {
  return <Suspense fallback={null}><Glossario onClose={() => window.location.hash = ''} /></Suspense>;
}
```

- [ ] **Step 6: Vitest verify ≥10 NEW tests PASS + 13474+ baseline preserved**

```bash
npx vitest run tests/unit/components/glossario/ --reporter=basic
# Expected: 10+ PASS
npx vitest run --reporter=basic 2>&1 | tail -5
# Expected: 13484+ PASS (baseline + NEW)
```

- [ ] **Step 7: Build + Vercel deploy + smoke**

```bash
npm run build && npx vercel --prod --yes --archive=tgz
# Browser smoke: open https://www.elabtutor.school/#glossario manually OR via Playwright
```

- [ ] **Step 8: Audit + commit**

```bash
git add src/components/glossario/ src/components/HomePage.jsx tests/unit/components/glossario/ docs/audits/iter-39-c7-glossario-port.md
git commit -m "feat(iter-39-c7): Tea Glossario port main app + alphabet nav + search"
git push origin e2e-bypass-preview
```

---

### Task 5: Cronologia Google Chrome style enhancement ChatbotOnly (~2h, ROI: Tea iter 33+ carryover closed, Box 13 +0.05)

**Goal:** Replace current ChatbotOnly sidebar Cronologia with Google Chrome–style history pattern: search bar + group by date (Oggi / Ieri / Settimana scorsa / Più vecchie) + bulk select + clear/export.

**Files:**
- Modify: `src/components/chatbot/ChatbotOnly.jsx` (Sidebar Cronologia rebuild)
- Modify: `src/components/chatbot/ChatbotOnly.module.css` (new history styles)
- Test: `tests/unit/components/chatbot/ChatbotOnly.test.jsx` (extend existing)
- Audit: `docs/audits/iter-39-cronologia-google-chrome-style.md`

- [ ] **Step 1: Pre-cycle CoV** (§3.1)

- [ ] **Step 2: Read existing ChatbotOnly Cronologia code**

```bash
grep -nE "Cronologia|sessions|history" src/components/chatbot/ChatbotOnly.jsx | head -20
```

Identify current sidebar implementation block.

- [ ] **Step 3: Implement date grouping helper**

Add to ChatbotOnly.jsx (or new helper file):

```jsx
function groupSessionsByDate(sessions) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  return sessions.reduce((acc, s) => {
    const d = new Date(s.updated_at || s.created_at);
    if (d >= today) acc.oggi.push(s);
    else if (d >= yesterday) acc.ieri.push(s);
    else if (d >= weekAgo) acc.settimana.push(s);
    else acc.vecchie.push(s);
    return acc;
  }, { oggi: [], ieri: [], settimana: [], vecchie: [] });
}
```

- [ ] **Step 4: Render history sections**

```jsx
<div className={css.cronologiaSidebar}>
  <header>
    <h3>Cronologia</h3>
    <input
      type="search"
      placeholder="Ragazzi, cercate una lezione..."
      value={historySearch}
      onChange={e => setHistorySearch(e.target.value)}
      aria-label="Cerca cronologia"
    />
    {selectedIds.size > 0 && (
      <div className={css.bulkActions}>
        <button onClick={handleBulkExport}>Esporta {selectedIds.size}</button>
        <button onClick={handleBulkClear}>Cancella {selectedIds.size}</button>
      </div>
    )}
  </header>
  {Object.entries(grouped).map(([bucket, sessions]) => (
    sessions.length > 0 && (
      <section key={bucket} className={css.bucket}>
        <h4>{bucketLabel(bucket)}</h4>
        <ul>
          {sessions.map(s => (
            <li key={s.id} className={css.sessionItem}>
              <input
                type="checkbox"
                checked={selectedIds.has(s.id)}
                onChange={() => toggleSelect(s.id)}
              />
              <button onClick={() => loadSession(s.id)} className={css.sessionBtn}>
                <strong>{s.title || 'Lezione senza titolo'}</strong>
                <small>{s.description || s.preview}</small>
                <time>{formatRelative(s.updated_at)}</time>
              </button>
            </li>
          ))}
        </ul>
      </section>
    )
  ))}
</div>
```

- [ ] **Step 5: Bucket label helper + relative time**

```jsx
function bucketLabel(b) {
  return { oggi: 'Oggi', ieri: 'Ieri', settimana: 'Settimana scorsa', vecchie: 'Più vecchie' }[b] || b;
}

function formatRelative(d) {
  const date = new Date(d);
  const now = new Date();
  const diff = (now - date) / 1000;
  if (diff < 60) return 'adesso';
  if (diff < 3600) return `${Math.floor(diff / 60)} min fa`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h fa`;
  return date.toLocaleDateString('it-IT');
}
```

- [ ] **Step 6: Write 6+ NEW tests**

Test groupSessionsByDate, bucket rendering, search filter, bulk select, bulk export, bulk clear.

- [ ] **Step 7: Vitest 13474+ preserve + build**

- [ ] **Step 8: Vercel deploy + manual browser smoke**

Open `https://www.elabtutor.school/#chatbot-only`, verify Cronologia sidebar Google-Chrome style.

- [ ] **Step 9: Commit + audit**

```bash
git add src/components/chatbot/ChatbotOnly.{jsx,module.css} tests/unit/components/chatbot/ChatbotOnly.test.jsx docs/audits/iter-39-cronologia-google-chrome-style.md
git commit -m "feat(iter-39): Cronologia ChatGPT/Google-Chrome style sidebar with date groups + bulk"
git push origin e2e-bypass-preview
```

---

### Task 6: A10 Onnipotenza Deno port 12-tool subset server-safe (~6-8h, ROI: Box 10 ceiling +0.05, A10 cap removed)

**Goal:** Port subset of 62-tool ToolSpec registry to Deno-compatible Edge Function dispatcher, focused on 12 server-safe tools (no browser DOM dependencies). Per ADR-028 §7 canary 5%→25%→100% rollout.

**12-tool subset (per PDR §3 ATOM-S38-A10):**
1. highlightComponent (state tracking, browser renders)
2. mountExperiment (Edge Function loads lesson-path JSON, browser renders)
3. captureScreenshot (browser-only, surface to browser)
4. getCircuitState (browser context, surface to browser)
5. getCircuitDescription (browser context)
6. clearCircuit (server validates, browser executes)
7. highlightPin (state tracking)
8. clearHighlights (state tracking)
9. setComponentValue (server validates)
10. connectWire (server validates)
11. ragRetrieve (server-side direct, returns chunks)
12. searchVolume (server-side hybrid RAG search)

**Files:**
- Create: `supabase/functions/_shared/clawbot-dispatcher-deno.ts` (~600 LOC)
- Create: `supabase/functions/_shared/clawbot-dispatcher-deno.test.ts` (≥24 tests)
- Modify: `supabase/functions/unlim-chat/index.ts` (post-LLM dispatch via Deno dispatcher when canary fires)
- ADR: `docs/adrs/ADR-032-onnipotenza-deno-12-tool-server-safe.md` (~400 LOC)
- Audit: `docs/audits/iter-39-a10-onnipotenza-deno-port.md`

- [ ] **Step 1: Pre-cycle CoV** (§3.1)

- [ ] **Step 2: Read existing 62-tool registry + browser dispatcher**

```bash
wc -l scripts/openclaw/tools-registry.ts scripts/openclaw/dispatcher.ts scripts/openclaw/composite-handler.ts
grep -nE "^  name: ['\"]" scripts/openclaw/tools-registry.ts | head -15
```

- [ ] **Step 3: Design Deno dispatcher signature**

Write ADR-032 first (~400 LOC) covering:
- Why server-side subset 12-tool only
- Browser surface-to-browser path (existing iter 36 surface-to-browser pivot ADR-028 §14)
- Canary hash bucket sessionId
- Telemetry intent_dispatch_path metric
- Failure modes + fallback to legacy AZIONE regex parse

- [ ] **Step 4: TDD — write 24 failing tests first**

```typescript
// supabase/functions/_shared/clawbot-dispatcher-deno.test.ts
import { assertEquals } from 'https://deno.land/std@0.208.0/testing/asserts.ts';
import { dispatchTool } from './clawbot-dispatcher-deno.ts';

Deno.test('dispatchTool highlightComponent returns state tracking object', async () => {
  const result = await dispatchTool('highlightComponent', { ids: ['led1', 'r1'] });
  assertEquals(result.tool, 'highlightComponent');
  assertEquals(result.surface_to_browser, true);
  assertEquals(result.args.ids, ['led1', 'r1']);
});

// ... 23 more tests for each tool + edge cases
```

Run + verify all FAIL:
```bash
cd supabase/functions/_shared
deno test clawbot-dispatcher-deno.test.ts
```

- [ ] **Step 5: Implement dispatcher**

```typescript
// supabase/functions/_shared/clawbot-dispatcher-deno.ts
export const SERVER_SAFE_TOOLS = [
  'highlightComponent',
  'mountExperiment',
  'captureScreenshot',
  'getCircuitState',
  'getCircuitDescription',
  'clearCircuit',
  'highlightPin',
  'clearHighlights',
  'setComponentValue',
  'connectWire',
  'ragRetrieve',
  'searchVolume',
] as const;

export type ServerSafeTool = typeof SERVER_SAFE_TOOLS[number];

export interface DispatchResult {
  tool: ServerSafeTool | string;
  args: Record<string, unknown>;
  surface_to_browser: boolean;
  server_executed: boolean;
  result?: unknown;
  error?: string;
  latencyMs: number;
}

export async function dispatchTool(
  tool: string,
  args: Record<string, unknown>,
  context?: { sessionId?: string; experimentId?: string },
): Promise<DispatchResult> {
  const start = Date.now();
  if (!SERVER_SAFE_TOOLS.includes(tool as ServerSafeTool)) {
    return {
      tool,
      args,
      surface_to_browser: true,
      server_executed: false,
      error: 'tool_not_server_safe',
      latencyMs: Date.now() - start,
    };
  }

  // Tool implementations...
  switch (tool) {
    case 'mountExperiment':
      // Server-side validate experimentId + load lesson-path JSON
      // Surface to browser for actual mount
      return {
        tool,
        args,
        surface_to_browser: true,
        server_executed: true,
        result: { experimentId: args.experimentId, validated: true },
        latencyMs: Date.now() - start,
      };
    // ... others
  }
  return {
    tool,
    args,
    surface_to_browser: true,
    server_executed: false,
    latencyMs: Date.now() - start,
  };
}

export function hashBucket(sessionId: string, percent: number): boolean {
  // Deterministic hash bucket per ADR-028 §7 canary
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) {
    hash = ((hash << 5) - hash) + sessionId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 100 < percent;
}
```

- [ ] **Step 6: Re-run tests — all 24 PASS**

- [ ] **Step 7: Wire into unlim-chat/index.ts post-LLM dispatch**

After LLM response + parsedIntents extraction (around line 700+), add:

```typescript
// iter 39 A10 — server-side dispatch for canary bucket
const canaryPercent = parseInt(Deno.env.get('CANARY_DENO_DISPATCH_PERCENT') || '0', 10);
const useServerDispatch = canaryPercent > 0 && hashBucket(sessionId, canaryPercent);
const serverDispatchResults: DispatchResult[] = [];

if (useServerDispatch && parsedIntents.length > 0) {
  for (const intent of parsedIntents) {
    const result = await dispatchTool(intent.tool, intent.args, { sessionId, experimentId: safeExperimentId });
    serverDispatchResults.push(result);
  }
  console.info(JSON.stringify({
    level: 'info', event: 'intent_dispatch_path',
    path: 'deno-server',
    canary_percent: canaryPercent,
    intents_dispatched: serverDispatchResults.length,
    timestamp: new Date().toISOString(),
  }));
}
```

Surface `serverDispatchResults` in response when `debug_retrieval=true`.

- [ ] **Step 8: Vitest 13474+ preserve + Deno tests PASS**

- [ ] **Step 9: Deploy Edge Function + canary 5% set**

```bash
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase functions deploy unlim-chat --project-ref euqpdueopmlllqjmqnyb
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase secrets set CANARY_DENO_DISPATCH_PERCENT=5 --project-ref euqpdueopmlllqjmqnyb
```

- [ ] **Step 10: Smoke prod 5x with debug_retrieval=true**

Verify `intent_dispatch_path: { deno: N, browser: M }` ratio matches 5%.

- [ ] **Step 11: Audit + commit**

```bash
git add supabase/functions/_shared/clawbot-dispatcher-deno.{ts,test.ts} supabase/functions/unlim-chat/index.ts docs/adrs/ADR-032-onnipotenza-deno-12-tool-server-safe.md docs/audits/iter-39-a10-onnipotenza-deno-port.md
git commit -m "feat(iter-39-a10): Onnipotenza Deno port 12-tool subset server-safe + canary 5%"
git push origin e2e-bypass-preview
```

If A10 LIVE prod canary 5% → PDR §4 cap A10 not shipped condition REMOVED. Box 10 +0.05 ceiling realized.

---

### Task 7: A13 canary rollout 5%→25%→100% per ADR-028 §7 (~3h spread over 24-48h soak)

**Goal:** progressive rollout server-side dispatch from canary 5% to 100%, with telemetry monitoring and rollback gate.

This task is multi-stage with WAITS between increments. Mac Mini executes increment + waits + measures + advances.

**Files:**
- Modify: env via `supabase secrets set CANARY_DENO_DISPATCH_PERCENT={N}`
- Audit per stage: `docs/audits/iter-39-a13-canary-{percent}.md`

- [ ] **Step 1: Stage 1 (5%) — already from Task 6 Step 9**

After Task 6 deploy, observe 4-8h. Telemetry:
```bash
# Read PostHog OR Sentry for `intent_dispatch_path` events
# OR query Supabase Edge logs:
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase functions logs unlim-chat --project-ref euqpdueopmlllqjmqnyb | grep "intent_dispatch_path" | head -20
```

Acceptance: error rate <2% in `serverDispatchResults`. If OK → advance.

- [ ] **Step 2: Stage 2 (25%)**

```bash
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase secrets set CANARY_DENO_DISPATCH_PERCENT=25 --project-ref euqpdueopmlllqjmqnyb
```

Wait 4-8h. Re-measure.

- [ ] **Step 3: Stage 3 (100%)**

```bash
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase secrets set CANARY_DENO_DISPATCH_PERCENT=100 --project-ref euqpdueopmlllqjmqnyb
```

Wait 4-8h soak. Final acceptance: Box 11 Onniscenza 0.9 → 1.0 + Sprint T close cap removal.

- [ ] **Step 4: Audit + commit final stage**

```bash
git add docs/audits/iter-39-a13-canary-100.md
git commit -m "ops(iter-39-a13): canary 100% rollout Deno dispatcher LIVE prod"
git push origin e2e-bypass-preview
```

---

### Task 8: Voyage re-ingest with page metadata (~50min, ROI: Box 6 +0.15, R6 unblock)

**Goal:** Re-ingest 1881 RAG chunks with proper `metadata.page` populated → unblock R6 ≥0.55 recall@5.

**Pre-requisite:** VOYAGE_API_KEY must be in env (server-side Supabase secret OR local). Cost ~$1.

**Files:**
- Modify: `scripts/rag-ingest-voyage-batch.mjs` (extract page from PDF position OR markdown anchors)
- Audit: `docs/audits/iter-39-voyage-reingest-page-metadata.md`

- [ ] **Step 1: Pre-cycle CoV** (§3.1) + verify VOYAGE_API_KEY available

```bash
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase secrets list --project-ref euqpdueopmlllqjmqnyb | grep VOYAGE
# If only server-side: need export VOYAGE_API_KEY locally for ingest script
```

If VOYAGE_API_KEY NOT in MacBook ~/.zshrc: HALT, write `automa/team-state/messages/macmini-iter39-voyage-key-needed.md`, skip to next task.

- [ ] **Step 2: Read current ingest script + page extraction strategy**

```bash
head -50 scripts/rag-ingest-voyage-batch.mjs
```

Identify chunking + metadata population logic.

- [ ] **Step 3: Modify chunker to emit page**

Vol1/Vol2/Vol3 PDFs in `/Users/andreamarro/VOLUME 3/CONTENUTI/volumi-pdf/` (MacBook path) OR `~/Projects/elab-tutor/CONTENUTI/volumi-pdf/` if synced. Use `pdftotext -layout` and parse page markers.

```bash
pdftotext -layout "CONTENUTI/volumi-pdf/Vol1.pdf" /tmp/vol1.txt
# Page boundaries: ^L (form feed) char between pages
# Count pages: grep -c $'\f' /tmp/vol1.txt
```

Modify chunker to track `currentPage` increment on `\f` char.

- [ ] **Step 4: Run re-ingest**

```bash
SUPABASE_SERVICE_ROLE_KEY=<from supabase dashboard> \
  VOYAGE_API_KEY=<from MacBook ~/.zshrc OR Andrea> \
  TOGETHER_API_KEY="$TOGETHER_API_KEY" \
  node scripts/rag-ingest-voyage-batch.mjs --rebuild --with-page-metadata 2>&1 | tee /tmp/voyage-reingest.log
```

Expected: ~50min, $1, 1881 chunks re-ingested with page populated.

- [ ] **Step 5: Verify coverage post-reingest**

```sql
SELECT source, COUNT(*) AS total, COUNT(page) AS page_filled,
       ROUND(COUNT(page)::numeric / NULLIF(COUNT(*), 0)::numeric * 100, 1) AS pct
  FROM rag_chunks GROUP BY source ORDER BY source;
```

Expected: vol1/vol2/vol3 page_pct ≥80%. Wiki page NULL OK.

- [ ] **Step 6: R6 100-prompt re-bench**

```bash
export SUPABASE_ANON_KEY=$(grep "^export SUPABASE_ANON_KEY" ~/.zshrc | cut -d= -f2- | tr -d '"\047 ')
export ELAB_API_KEY=$(grep "^VITE_ELAB_API_KEY=" .env | cut -d= -f2 | tr -d '"\047 ')
node scripts/bench/run-sprint-r6-stress.mjs
```

Expected: avg recall@5 ≥0.55. Box 6 0.85 → 1.0 if achieved.

- [ ] **Step 7: Audit + commit**

If R6 ≥0.55: Sprint T close cap R6 removed. Document.

```bash
git add scripts/rag-ingest-voyage-batch.mjs scripts/bench/output/r6-stress-* docs/audits/iter-39-voyage-reingest-page-metadata.md
git commit -m "feat(iter-39): Voyage re-ingest with page metadata + R6 ≥0.55 PASS"
git push origin e2e-bypass-preview
```

---

### Task 9: A4 Mistral streaming SSE (Tier 2 latency, defer if R5 already PASS) (~4h, ROI: TTFB <500ms perceived)

**Note:** R5 v56 already PASSES <3000ms / <6000ms targets. SSE primary value is PERCEIVED latency (first chunk <500ms). Skip if Andrea decision says iter 40+.

**Files:**
- Modify: `supabase/functions/_shared/llm-client.ts` (add `stream: true` support)
- Modify: `supabase/functions/_shared/mistral-client.ts` (SSE chunk parsing)
- Modify: `supabase/functions/unlim-chat/index.ts` (forward SSE to client)
- Modify: `src/components/lavagna/useGalileoChat.js` (consume SSE stream)
- ADR: `docs/adrs/ADR-033-mistral-streaming-sse.md` (~600 LOC)

(If undertaking, follow same TDD pattern as Task 6 — write failing tests, implement, deploy, smoke, audit.)

---

### Task 10: A9 STT Voxtral Transcribe 2 migration (~6h, ROI: Box 8 +0.05 ceiling)

**Note:** unlim-stt currently CF Whisper (per iter 32 fix). Voxtral Transcribe 2 = $0.003/min Italian K-12 4% WER FLEURS, EU GDPR-clean France, completes 100% Mistral stack Sense 2.

**Files per ADR-031** (already designed iter 38):
- Create: `supabase/functions/_shared/voxtral-stt-client.ts` (~250 LOC)
- Modify: `supabase/functions/unlim-stt/index.ts` (Voxtral primary + CF Whisper fallback)
- Test: 9-cell matrix Tester-4 (3 audio formats × 3 sample lengths)

(Skip detail here — follow ADR-031 implementation block + same TDD pattern.)

---

### Task 11: Per-cycle quality audit closing each task

Mandatory after each task above:

- [ ] **Run `elab-quality-gate` skill**

```
/elab-quality-gate
```

Skill runs PZ V3 score + smoke prod + verify cap conditions.

- [ ] **Run `elab-principio-zero-validator` skill on smoke output**

```
/elab-principio-zero-validator
```

Score 12 PZ V3 rules: plurale_ragazzi, citation_vol_pag, max_words, analogia, no_imperativo_docente, no_verbatim_3plus_frasi, linguaggio_bambino, action_tags_when_expected, synthesis_not_verbatim, off_topic_recognition, humble_admission, no_chatbot_preamble.

- [ ] **Update audit doc + score**

Append to running session audit `docs/audits/iter-39-mac-mini-autonomous-session-{date}.md`:

```markdown
## Cycle {N} — atom {atom_id}

- **Status**: {SHIPPED/PARTIAL/DEFERRED}
- **vitest**: {N} (delta {+/-})
- **PZ V3**: {score}%
- **Box updates**: {box_id from X.Y → W.Z}
- **Cumulative score**: {raw} → {G45 cap} ONESTO
- **Honesty caveats**: {1-3 critical}
- **Commit**: {SHA + msg}
```

---

## §7 Final session close — Mac Mini autonomous loop end

When loop reaches stop condition OR all atoms attempted OR 24h elapsed:

- [ ] **Final CoV** (§3.1 + §3.2)

- [ ] **Cumulative audit doc**

```bash
cat > docs/audits/iter-39-mac-mini-autonomous-session-{date}-CLOSE.md <<'EOF'
# iter 39 Mac Mini autonomous session close — {date}

## Atoms shipped {N}/{M}
{list each completed task with status}

## Atoms deferred {K}
{list each deferred task with rationale}

## Bench deltas
- R5: {pre} → {post}
- R6: {pre} → {post}
- R7: {pre} → {post}
- Lighthouse: {pre} → {post}
- 94 esperimenti: {pre count} → {post count}

## Box updates cumulative
{table 14 boxes pre/post}

## Score recalibrated
- Pre-session: 8.0/10 ONESTO
- Post-session: {N}/10 ONESTO (G45 cap {cap_reason})

## Sprint T close projection
{cap conditions remaining + iter 40+ atoms needed}

## Cross-link
- Plan: docs/superpowers/plans/2026-05-01-mac-mini-autonomous-iter-39-sprint-T-close.md
- Per-cycle audits: docs/audits/iter-39-cycle-*-audit.md
- Final this: this file

## ACTIVATION STRING for Andrea iter 40+

\`\`\`
{paste-ready next-session prompt}
\`\`\`
EOF
```

- [ ] **Push final commit + signal Andrea**

```bash
git add docs/audits/iter-39-mac-mini-autonomous-session-*-CLOSE.md
git commit -m "docs(iter-39-close): Mac Mini autonomous session close audit"
git push origin e2e-bypass-preview

# Signal via filesystem barrier (Andrea reads this on resume)
cat > automa/team-state/messages/macmini-iter39-SESSION-COMPLETE-{timestamp}.md <<EOF
Mac Mini autonomous iter 39 session COMPLETE.
- Atoms shipped: N/M
- Final score: X/10 ONESTO
- Final commit: {SHA}
- Final audit: docs/audits/iter-39-mac-mini-autonomous-session-{date}-CLOSE.md
- Sprint T close path: iter 40+ atoms remaining {list}
EOF
git add automa/team-state/messages/macmini-iter39-SESSION-COMPLETE-*.md
git commit -m "ops(iter-39-close): Mac Mini autonomous session signal Andrea resume"
git push origin e2e-bypass-preview
```

---

## §8 PRINCIPIO ZERO + MORFISMO compliance gate (mandatory each cycle)

Per CLAUDE.md "DUE PAROLE D'ORDINE" §1+§2 and `.impeccable.md` Test Morfismo 10-check, every code change MUST pass:

1. Linguaggio plurale "Ragazzi" + Vol/pag verbatim ≤60 parole + analogia
2. Kit fisico mention ogni response/tooltip/empty state
3. Palette CSS var Navy #1E4D8C / Lime #4A7A25 / Orange #E8941C / Red #E54B3D (NO hard-coded hex)
4. Iconografia ElabIcons SVG (NO material-design generic, NO emoji as icons except Andrea-OK)
5. Morphic runtime (NO static config)
6. Cross-pollination Onniscenza L1+L4+L7 minimum
7. Triplet coerenza kit Omaric SVG + volumi cartacei + software (Sense 2)
8. Multimodale Voxtral voice clone Andrea + Vision Pixtral EU + STT migration

Per atom audit doc, include compliance gate 8/8 verdict.

---

## §9 Plugin/MCP usage policy

| Plugin/MCP | Use case | Caveat |
|------------|----------|--------|
| Supabase CLI | migrations apply + Edge Function deploy | Token ✓ in zshrc |
| Vercel CLI | Vercel deploy --archive=tgz | Auth ✓ andreamarro |
| Playwright | A15 94 esperimenti + UI smoke | Headless mode mandatory (no display) |
| Lighthouse | A6 Lighthouse score | Chrome DevTools headless |
| WebFetch | Tea Glossario source fetch + Mistral docs | Rate limit awareness |
| WebSearch | Latency research deep-dive | Already absorbed iter 39 research doc |
| comby/ast-grep | A14 round 2 codemod IF revisited | Skip per honest finding admin convention |
| jq | JSON parsing bench output | Required, install via brew if missing |
| `elab-quality-gate` | Per-cycle audit | Custom skill |
| `elab-principio-zero-validator` | PZ V3 12-rule scorer | Custom skill |
| `elab-benchmark` | R5/R6/R7 alternative scoring | Optional |
| `elab-harness-real-runner` | A15 spec exec | Optional |

NOT to use:
- claude-mem `/mem-search` — conflict with parallel MacBook session
- Mac Mini SSH commands — Mac Mini IS the Mac Mini, no SSH out
- BG agent spawn (Task tool) — org limit risk; single-agent autonomous

---

## §10 Self-Review checklist (Mac Mini reads before starting)

1. ✅ Plan covers iter 38 carryover + Sprint T close path?
2. ✅ Each task has bite-sized steps (2-5 min each)?
3. ✅ No placeholders (TBD/TODO/etc)?
4. ✅ Exact file paths + commands?
5. ✅ CoV protocol + commit pattern + push pattern explicit?
6. ✅ Stop conditions enumerated?
7. ✅ Score formulas + cap conditions explicit?
8. ✅ Anti-conflict with parallel /mem-search documented?
9. ✅ Keys provisioning explicit?
10. ✅ Skills required listed + verify command?

---

## §11 Kickstart prompt for Andrea — paste verbatim into Mac Mini Claude desktop

```
Sono il Mac Mini Claude desktop Opus 4.7 1M con autonomia tempo indefinito sul progetto ELAB Tutor. Andrea NON supervisiona ma riprenderà più tardi.

PRIMA AZIONE OBBLIGATORIA: leggi e segui esattamente

  docs/superpowers/plans/2026-05-01-mac-mini-autonomous-iter-39-sprint-T-close.md

Pre-condizioni:
- Working dir: ~/Projects/elab-tutor (branch e2e-bypass-preview)
- Keys provisioned via ~/.zshrc + .env (vedi §1.2 plan)
- Vercel auth cached (`npx vercel whoami` = andreamarro)
- Skills loaded: superpowers:* + elab-* custom

Mandate:
- Esegui Task 1..N in ordine §6 plan
- NESSUNA scelta compiacente — anti-inflation G45 cap mandate
- CoV §3.1 + §3.2 ogni cycle entry/exit
- Stop conditions §5 — HALT se condizione triggered
- Anti-conflict §2 — NO mem-search, NO Mac Mini delegation, NO BG agent
- PRINCIPIO ZERO + MORFISMO compliance gate ogni atom (§8)

Quality bar:
- Per ogni atom: max quality realistica nel budget tempo, NO inflazione score
- Se atom richiede >8h o >50k token output: split in sub-task + commit incrementale
- Se decisione ambigua: scegli opzione PIÙ ONESTA (audit gap, NO mock, NO --no-verify)

Documenta TUTTO:
- Audit doc per cycle: docs/audits/iter-39-cycle-{N}-{atom_id}-audit.md
- Session running audit: docs/audits/iter-39-mac-mini-autonomous-session-{date}.md
- Filesystem barrier per Andrea: automa/team-state/messages/macmini-iter39-*.md

Resume protocol se Andrea torna mid-task:
- Trova ultimo audit cycle scritto
- Leggi automa/team-state/messages/macmini-iter39-RESUMING-* se presente
- Se nessun blocker, continua da Task corrente Step incompleto
- Andrea può forzare HALT scrivendo automa/team-state/messages/andrea-HALT-{timestamp}.md → Mac Mini deve checkare ad ogni cycle entry

Inizia ORA. Buon lavoro.
```

---

## §12 Mac Mini quality bar per task — onesto, NON compiacente

Per ogni atom, definire:

| Criterio | "Buono abbastanza" (defer iter 40+) | "Massima qualità" (push completion) |
|----------|-------------------------------------|-------------------------------------|
| Tempo | <2h budget | <8h, split se >8h |
| Test coverage NEW | ≥6 tests | ≥15 tests con edge cases |
| Audit doc | 100 LOC + 1 honesty caveat | 250 LOC + 3+ honesty caveats + cross-link |
| Smoke verify | Curl HTTP 200 + presence checks | + Playwright browser test + console errors check |
| PZ V3 score | ≥85% | ≥92% |
| LOC delta | unbounded | bounded + DRY refactor |

Se un task non raggiunge "buono abbastanza" → DEFER iter 40+ con audit gap doc + skip al task successivo. NON forzare completion compiacente.

Se un task raggiunge "buono abbastanza" ma NON "massima qualità" → SHIP con audit honesty caveat documentando residuo. Non bloccare progresso per perfezione.

Se task richiede strumento/key/decisione mancante → HALT con blocker doc. NON inventare workaround silente.

---

## §13 Resource budgets onesti

**Per cycle:**
- Wall-clock: 2-8h (Tasks 4 + 6 + 8 + 9 + 10 sopra 4h ciascuno)
- Token budget Opus 1M: ~200k per cycle (2 read CLAUDE.md + 5 read audit + edits)
- Build time: ~5 min ogni post-cycle
- Vitest time: ~1 min ogni CoV
- Vercel deploy: ~16-30 min con --archive=tgz
- Edge Function deploy: ~15 sec
- Bench R5: ~3 min, R6: ~5 min, R7: ~10 min

**Per session totale (sotto 24h Mac Mini):**
- 3-5 atom completed onesto
- 5-10 audit doc shipped
- 1 session close audit
- Vitest 13474 NEVER scendere
- ≥2 commit + push origin

**Stop se exceed:**
- 24h wall-clock cumulativo
- 40 cycle attempts cumulativi
- Repo size >5GB
- Disk free <2GB

---

## §14 Honesty caveats critical — NON COMPIACENZA

Aspetti del plan che possono fallire onestamente:

1. **Tea Glossario fetch (Task 4)**: Vercel deploy può essere private (401) → fallback a rag-chunks.json glossary subset. Se anche quello vuoto: HALT, audit gap, request Andrea.

2. **A10 Deno port complexity (Task 6)**: 6-8h può sforare. Opzione split: Task 6a = ADR-032 + 24 tests TDD (3h, separate commit). Task 6b = impl dispatcher + canary 5% (4h, separate commit). Mac Mini DEVE splittare se >5h continuous.

3. **Voyage re-ingest (Task 8)**: requires VOYAGE_API_KEY local. Server-side only può non bastare se ingest script reads `process.env.VOYAGE_API_KEY` directly. HALT + Andrea ratify se key missing.

4. **A15 Playwright 94 esperimenti (Task 3)**: 3h headless può crashare metà run. Implement per-esperimento checkpoint + resume. Se broken count > 30 → spec issue probabile, HALT + audit.

5. **Canary rollout 24-48h soak (Task 7)**: Mac Mini NON dovrebbe restare attivo 48h continuous. Spezza in 3 sub-task: setup 5% → setup 25% (8h dopo) → setup 100% (16h dopo). Document timestamp per ratify Andrea increment.

6. **R7 ≥95% canonical UNREACHABLE inline**: L2 template router catches most prompts. Per lift R7 serve disabilitare L2 template router OR widen `shouldUseIntentSchema` heuristic — ma questo rischia regressione. Defer iter 40+ careful review. R7 cap 8.5 stays.

7. **Lighthouse perf ≥90 può non raggiungere target**: PWA precache reduce + chunking + lazy mount = lift ma initial bundle 2.2MB index probabilmente troppo. Se post-optim perf <70: defer iter 40+ con piano "split index.js in 5 chunks via route-based code splitting".

8. **Cap 9.5 Sprint T close inline UNREACHABLE**: Anche con tutti task completati, Opus indipendente review G45 mandate richiede Andrea action. Mac Mini può raggiungere score raw 9.3-9.4 cap 9.0 senza review. Score 9.5 SOLO con Andrea Opus indipendente verifica.

Mac Mini deve documentare ESATTAMENTE quale di questi 8 caveat è realizzato in audit close.

---

**Status**: PROPOSED iter 39 Mac Mini autonomous plan ready execute. Andrea: review + approve + start Mac Mini Claude desktop Opus 4.7 1M con kickstart prompt §11.

**Sprint T close projection ONESTO**: cumulative iter 39 atoms Tasks 1-7 shipped → score lift 8.5 → **9.0-9.3 ONESTO** (NON 9.5 — caveat #8 sopra). Tasks 8-10 lift iter 40+ se completati. Sprint T close 9.5 finale richiede Opus indipendente review separata G45 mandate.

**Anti-inflation FERREA non compiacente**: NO claim Sprint T close 9.5 senza Opus indipendente review G45. NO --no-verify. NO push main. Mac Mini autonomous = stesso G45 cap MacBook session. NO scelte compiacenti — caveat #1-8 documentati, defer iter 40+ ammesso.
