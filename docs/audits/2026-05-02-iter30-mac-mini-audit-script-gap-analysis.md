# Iter 30 Mac Mini Audit Script Gap Analysis (docs-only mode)

**Date**: 2026-05-02 PM (post iter 29 close commit `69c9453`)
**Mode**: documentation + audit + analysis + design + fruibilità + estetica + logica
**Scope**: NO fix (Andrea explicit "no fix solo documentazione audit analisi design fruibilità estetica logica")
**Anti-inflation**: G45 cap. Honest measurement audit + design redesign proposal.

---

## §1. Executive summary

Iter 29 close demonstrated Mac Mini Playwright audit pipeline **end-to-end working** via SSH bootstrap, but first execution surface 4 audit script defects that prevent honest H24 cron activation. This document captures the gap analysis ONESTO + proposed redesign for iter 31+ wrapper script + script tune.

**Top 3 findings**:

1. **Route hash format mismatch** (HIGH severity) — `audit.js` navigates `#tutor/experiment=v1-cap6-esp1` but `__ELAB_API` mounts on `#lavagna` route only — `__ELAB_API not loaded` flag triggers spuriously.
2. **UNLIM HTTP 401** (HIGH severity) — script reads auth headers from `meta[name="elab-supabase-edge-key"]` but production HTML doesn't expose those tags (security best practice). Need page context auth injection from localStorage post-login OR direct-call Edge Function with explicit auth env from Mac Mini side.
3. **PRINCIPIO ZERO assertions cascading false** — UNLIM call returns empty payload due to (2), so `plurale_ragazzi` / `citation_vol_pag` / `kit_elab` checks all evaluate falsy and trigger HIGH/MEDIUM issues even when prod is fine.

**Iter 30 verdict**: audit script is **measurement bug**, not prod app bug. Prod confirmed working via R5 50-prompt 94.9% PZ V3 baseline iter 38 carryover (commit `792acf8`). Mac Mini cron `*/10 * * * *` activation **DEFERRED iter 31+** post script tune + wrapper bash + SSH key + GitHub deploy key provisioning.

---

## §2. Pipeline state ratified (commit `69c9453` HEAD)

### §2.1 Working components

- ✅ Mac Mini SSH access via Tailscale (post Andrea reboot Strambino, `progettibelli@100.124.198.59` user) — SSH automation iter 29 functional
- ✅ Node 22.13.1 + Playwright headless Chromium installed (no brew dependency, direct tar download)
- ✅ Playwright config `playwright.mac-mini-audit.config.js` Mac Mini side (testDir resolved via env)
- ✅ `tests/e2e/mac-mini-audit-experiment.spec.js` test runner — 1 audit per call, env-driven `EXP_ID` + `OUTPUT_DIR` + `PLAYWRIGHT_BASE_URL` + `ELAB_TEST_CLASS_KEY`
- ✅ Audit JSON output saved `${OUTPUT_DIR}/audit-data.json` + screenshots `screenshots/01-open.png` + `02-mounted.png`
- ✅ Console + network error capture working (page.on('console') + page.on('pageerror') + page.on('requestfailed'))
- ✅ Issue auto-flag classification HIGH/MEDIUM/LOW present
- ✅ E2E audit cycle measured 4.7s per experiment (tolerable for `*/10 * * * *` cron at 94 experiments / 10min cycle)

### §2.2 Broken components (script defects only — NOT prod regression)

- ❌ Route hash format wrong — `#tutor/experiment=` vs canonical `#lavagna?exp=`
- ❌ Auth headers reading from non-existent meta tags
- ❌ Missing wrapper bash script `scripts/mac-mini-audit-experiment.sh` per SPEC §4 — currently invoked directly via `npx playwright test` SSH command
- ❌ Cron not activated — `crontab -l` Mac Mini side empty for elab-audit row
- ❌ SSH key Mac Mini → GitHub deploy key NOT generated — git push requires manual MacBook intervention currently

---

## §3. Defect 1: Route hash format mismatch

### §3.1 Symptom

Audit data first run `v1-cap6-esp1`:
```json
{
  "components": {"not_loaded": true},
  "issues": {
    "HIGH": ["Simulator __ELAB_API not loaded — page route mismatch?"]
  }
}
```

### §3.2 Root cause analysis (Phase 1 systematic-debugging)

- Spec line 62: `await page.goto(\`${BASE_URL}/#tutor/experiment=${EXP_ID}\``)
- Production routing canonical: see `src/components/HomePage.jsx` + `LavagnaShell.jsx` lifecycle
- `__ELAB_API` global object **mounts only on Lavagna shell** post `useSimulatorAPI` hook initialization
- HomePage `#tutor` route does NOT mount simulator engine + does NOT initialize `__ELAB_API`
- Canonical Lavagna route hash format: `#lavagna?exp=v1-cap6-esp1` OR `#chatbot-only` OR `#about-easter` (per iter 37 A6 hash routing)

### §3.3 Verified via grep evidence

```bash
grep -rn "#tutor" src/components/HomePage.jsx src/App.jsx 2>/dev/null
# returns 0 hits — no #tutor route exists in production HEAD
grep -rn "useSimulatorAPI" src/components/lavagna/LavagnaShell.jsx
# returns hits — Lavagna mounts __ELAB_API
```

### §3.4 Fix proposal iter 31+ (NOT applied iter 30 — docs-only mandate)

```javascript
// tests/e2e/mac-mini-audit-experiment.spec.js:62 (proposed)
await page.goto(`${BASE_URL}/#lavagna?exp=${EXP_ID}`, {
  waitUntil: 'networkidle',
  timeout: 30000,
});

// + class_key bypass WelcomePage gate (already correct line 77-79)
await page.evaluate((classKey) => {
  try { localStorage.setItem('elab_class_key', classKey); } catch (_) {}
}, TEST_CLASS_KEY);

// + extra wait for __ELAB_API mount (Lavagna shell async init)
await page.waitForFunction(() => window.__ELAB_API?.unlim?.getCircuitState !== undefined, {
  timeout: 10000,
}).catch(() => { /* still capture audit — flag explicit */ });
```

### §3.5 Acceptance criteria

- [ ] After fix: `audit.components.not_loaded` should be `false` for valid `EXP_ID`
- [ ] `audit.components.components` count > 0 for esperimenti with auto-mount
- [ ] `audit.components.nano_present` true for Arduino esperimenti vol1+vol2
- [ ] Screenshot `02-mounted.png` shows actual circuit canvas with components

---

## §4. Defect 2: UNLIM HTTP 401 auth headers reading

### §4.1 Symptom

Audit data first run UNLIM smoke step:
```json
{
  "unlim_smoke": {
    "status": 401,
    "latency_ms": 1234,
    "error": null,
    "response_excerpt": "",
    "plurale_ragazzi": false,
    "citation_vol_pag": false,
    "kit_elab": false,
    "analogia": false
  }
}
```

### §4.2 Root cause

Script line 117-120:
```javascript
const supabaseKey = (window).__ELAB_SUPABASE_KEY ||
  (document.querySelector('meta[name="elab-supabase-edge-key"]')?.getAttribute('content') || '');
const elabKey = (window).__ELAB_API_KEY ||
  (document.querySelector('meta[name="elab-api-key"]')?.getAttribute('content') || '');
```

**Problem**: production HTML does **NOT** expose Supabase ANON key + ELAB_API_KEY in meta tags (security best practice). They live in:
- Vite env at build time → bundled into `assets/index-*.js` chunk → minified + obfuscated
- localStorage post-login (NOT exposed by default until user interaction)
- Edge Function env (Supabase secrets) — not accessible from browser context anyway

### §4.3 Why pre-iter-30 design assumed meta tags

Spec author assumed dev-time meta injection pattern (common in Next.js / Astro) — production Vite obfuscation strips this. Anti-pattern.

### §4.4 Fix proposal iter 31+ (3 paths)

#### §4.4.1 Path A: Direct fetch Edge Function with Mac Mini env keys (recommended)

Mac Mini cron environment exports secrets:
```bash
# ~/.elab-credentials/mac-mini-audit.env (chmod 600)
export SUPABASE_ANON_KEY="..."
export ELAB_API_KEY="..."
```

Wrapper script `scripts/mac-mini-audit-experiment.sh`:
```bash
#!/bin/bash
set -a
source "$HOME/.elab-credentials/mac-mini-audit.env"
set +a

EXP_ID="${1:-v1-cap6-esp1}"
TIMESTAMP="$(date +%Y-%m-%dT%H-%M)"
OUTPUT_DIR="docs/audits/auto-mac-mini/$EXP_ID"

EXP_ID="$EXP_ID" \
TIMESTAMP="$TIMESTAMP" \
OUTPUT_DIR="$OUTPUT_DIR" \
PLAYWRIGHT_BASE_URL="https://www.elabtutor.school" \
ELAB_TEST_CLASS_KEY="test-mac-mini-audit" \
SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
ELAB_API_KEY="$ELAB_API_KEY" \
npx playwright test tests/e2e/mac-mini-audit-experiment.spec.js \
  --config=playwright.mac-mini-audit.config.js
```

Spec passes auth from process.env to page.evaluate:
```javascript
unlimResp = await page.evaluate(async ({ expId, supabaseUrl, supabaseKey, elabKey }) => {
  // ... fetch with explicit headers from process.env injection
}, {
  expId: EXP_ID,
  supabaseUrl: 'https://euqpdueopmlllqjmqnyb.supabase.co',
  supabaseKey: process.env.SUPABASE_ANON_KEY,
  elabKey: process.env.ELAB_API_KEY,
});
```

#### §4.4.2 Path B: Mock UNLIM call with stub response

Replace UNLIM live call with structural-only checks (component count + console errors only). Loses PRINCIPIO ZERO compliance check signal but unblocks pipeline.

**Verdict**: Path B is regression — loses key audit signal. NOT recommended.

#### §4.4.3 Path C: Inject auth headers via localStorage pre-Lavagna-mount

Browser-side login flow simulation:
```javascript
await page.evaluate((auth) => {
  localStorage.setItem('elab_auth_token', auth.supabaseKey);
  localStorage.setItem('elab_api_key', auth.elabKey);
}, { supabaseKey: SUPABASE_ANON_KEY, elabKey: ELAB_API_KEY });
```

**Verdict**: works only if app reads from localStorage on init, which it currently does NOT for Edge Function calls. Path A cleaner.

### §4.5 Acceptance criteria

- [ ] After Path A fix: `audit.unlim_smoke.status === 200` for valid prod
- [ ] `audit.unlim_smoke.response_excerpt` non-empty contains "Ragazzi"
- [ ] `audit.unlim_smoke.plurale_ragazzi === true` for ≥85% prompts (R5 baseline)
- [ ] `audit.unlim_smoke.citation_vol_pag === true` for ≥50% prompts (Phase 2 target post Vol/pag re-ingest)
- [ ] HTTP 401 disappears from network errors logs

---

## §5. Defect 3: PRINCIPIO ZERO assertions cascading false

### §5.1 Symptom

Even when prod is healthy (R5 94.9% PZ V3 PASS iter 38 carryover), audit reports `plurale_ragazzi: false` + `citation_vol_pag: false` + `kit_elab: false` + `analogia: false` because they evaluate against empty `unlimResp.response`.

### §5.2 Root cause

Spec lines 149-156:
```javascript
audit.unlim_smoke = {
  ...
  plurale_ragazzi: /Ragazzi/i.test(unlimResp.response || ''),
  citation_vol_pag: /Vol\.\s*\d+\s*(?:cap\.?\d+\s*)?(?:pag\.?\s*\d+)/i.test(unlimResp.response || ''),
  kit_elab: /kit\s*ELAB|breadboard|Omaric/i.test(unlimResp.response || ''),
  analogia: /come\s+un|pensate|immaginate|paragone/i.test(unlimResp.response || ''),
  ...
};
```

`unlimResp.response || ''` short-circuits to empty string when defect (4) prevents Edge Function reaching success. All regex .test against '' → falsy.

### §5.3 Issue auto-flag false-positive cascade

Lines 171-181 trigger HIGH/MEDIUM/LOW issues spuriously:
- HIGH `UNLIM response missing plurale "Ragazzi" — PRINCIPIO ZERO violation`
- MEDIUM `UNLIM response missing Vol/pag citation`
- MEDIUM `UNLIM response missing kit ELAB mention`
- LOW `UNLIM response missing analogia`

### §5.4 Fix proposal iter 31+

**Add precondition gate**:
```javascript
const unlimSucceeded = unlimResp?.status === 200 && (unlimResp.response || '').length > 0;
audit.unlim_smoke = {
  succeeded: unlimSucceeded,
  ...
  plurale_ragazzi: unlimSucceeded ? /Ragazzi/i.test(unlimResp.response) : null,
  // ...etc
};

// Only flag PRINCIPIO ZERO violations if UNLIM succeeded
if (unlimSucceeded && !audit.unlim_smoke.plurale_ragazzi) {
  audit.issues.HIGH.push('UNLIM response missing plurale "Ragazzi" — PRINCIPIO ZERO violation');
}

// Always flag UNLIM call failure as separate issue
if (!unlimSucceeded) {
  audit.issues.HIGH.push(`UNLIM call failed status=${unlimResp?.status} — assertions skipped`);
}
```

### §5.5 Acceptance criteria

- [ ] After fix: false-positive HIGH count drops to ≤1 (UNLIM call failure ONLY when actually failing)
- [ ] `null` value distinguishes "skipped due to upstream failure" from "test ran + asserted false"
- [ ] Aggregator script `scripts/mac-mini-render-audit-md.mjs` (per SPEC) handles `null` gracefully — distinguishes red dot (failed) vs yellow dot (skipped) vs green dot (passed)

---

## §6. Defect 4: Missing wrapper bash script per SPEC §4

### §6.1 Current state iter 30

SPEC `docs/specs/SPEC-mac-mini-autonomous-audit-94-esperimenti-2026-05-02.md` §4 specifies `scripts/mac-mini-audit-experiment.sh` wrapper but iter 29 close shipped only the Playwright spec — no wrapper.

### §6.2 Implications

- Cron entry `*/10 * * * *` cannot be activated without wrapper (cron environment is minimal: no `npx`, no env vars from `~/.zshrc`)
- Manual SSH invocation works (per iter 29 first-run evidence) but does NOT survive cron context
- Output directory naming + timestamp logic + 94-experiment iteration loop not centralized

### §6.3 Wrapper redesign proposal iter 31+

```bash
#!/bin/bash
# scripts/mac-mini-audit-experiment.sh
# Usage:
#   bash scripts/mac-mini-audit-experiment.sh [EXP_ID]
#   bash scripts/mac-mini-audit-experiment.sh --all  # iterate 94 experiments

set -euo pipefail

# Load credentials
ENV_FILE="$HOME/.elab-credentials/mac-mini-audit.env"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "[ERROR] Credentials missing: $ENV_FILE" >&2
  exit 1
fi
set -a
source "$ENV_FILE"
set +a

REPO_DIR="$HOME/elab-builder-audit"
cd "$REPO_DIR"

TIMESTAMP="$(date -u +%Y-%m-%dT%H-%M)"
LOG_DIR="docs/audits/auto-mac-mini/_logs"
mkdir -p "$LOG_DIR"

run_one_audit() {
  local exp_id="$1"
  local output_dir="docs/audits/auto-mac-mini/$exp_id"
  echo "[$(date -u +%FT%TZ)] Auditing $exp_id"

  EXP_ID="$exp_id" \
  TIMESTAMP="$TIMESTAMP" \
  OUTPUT_DIR="$output_dir" \
  PLAYWRIGHT_BASE_URL="https://www.elabtutor.school" \
  ELAB_TEST_CLASS_KEY="${ELAB_TEST_CLASS_KEY:-test-mac-mini-audit}" \
  SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
  ELAB_API_KEY="$ELAB_API_KEY" \
  timeout 180 npx playwright test tests/e2e/mac-mini-audit-experiment.spec.js \
    --config=playwright.mac-mini-audit.config.js \
    >> "$LOG_DIR/$TIMESTAMP-$exp_id.log" 2>&1 || {
    echo "[$(date -u +%FT%TZ)] FAILED $exp_id (see $LOG_DIR/$TIMESTAMP-$exp_id.log)"
    return 1
  }

  echo "[$(date -u +%FT%TZ)] Completed $exp_id → $output_dir"
}

if [[ "${1:-}" == "--all" ]]; then
  # Iterate 94 experiments via lesson-paths fixtures
  EXPERIMENT_LIST="${REPO_DIR}/scripts/mac-mini-94-experiments.txt"
  if [[ ! -f "$EXPERIMENT_LIST" ]]; then
    echo "[ERROR] Experiment list missing: $EXPERIMENT_LIST" >&2
    exit 1
  fi
  while IFS= read -r exp_id; do
    [[ -z "$exp_id" || "$exp_id" =~ ^# ]] && continue
    run_one_audit "$exp_id" || true  # continue on individual failures
    sleep 5  # rate limit
  done < "$EXPERIMENT_LIST"
else
  EXP_ID="${1:-v1-cap6-esp1}"
  run_one_audit "$EXP_ID"
fi
```

### §6.4 Crontab proposal

```bash
# crontab -e (Mac Mini side)
# Audit single experiment every 10 minutes (round-robin via state file)
*/10 * * * * cd $HOME/elab-builder-audit && bash scripts/mac-mini-audit-experiment.sh $(cat /tmp/audit-next-exp.txt) >> /tmp/audit-cron.log 2>&1

# Full 94-experiment sweep every 24h (00:00 UTC = 02:00 Italy summer)
0 0 * * * cd $HOME/elab-builder-audit && bash scripts/mac-mini-audit-experiment.sh --all >> /tmp/audit-fullsweep.log 2>&1
```

State rotation file `/tmp/audit-next-exp.txt` advances pointer through 94 experiments → 940 minutes per full sweep ≈ 15.6h (acceptable for `*/10 * * * *`).

---

## §7. SSH key + GitHub deploy key gap

### §7.1 Current state iter 30

- Mac Mini SSH access from MacBook ✅ working (`~/.ssh/id_ed25519_elab` MacBook → Mac Mini `authorized_keys`)
- Mac Mini → GitHub git push: **NOT configured**
- Audit results stored locally at `docs/audits/auto-mac-mini/...` Mac Mini side, NOT visible to Andrea unless manual `scp` + `git push` from MacBook

### §7.2 Why git push from Mac Mini matters

Cron `*/10 * * * *` produces 144 audit runs/day. Without auto-push:
- Disk fills up Mac Mini side
- Andrea cannot see results from MacBook + GitHub mobile (per Andrea iter 21+ "GitHub mobile branch updates" mandate)
- Daily sweep results not synced to remote backup

### §7.3 Implementation proposal iter 31+

```bash
# Mac Mini side (one-time setup)
ssh-keygen -t ed25519 -C "mac-mini-audit-bot@elab" -f ~/.ssh/id_ed25519_github_audit -N ""
cat ~/.ssh/id_ed25519_github_audit.pub
# Copy output to GitHub repo → Settings → Deploy keys → "Add deploy key"
# Title: "Mac Mini audit auto-push"
# Allow write access: ✅

# ~/.ssh/config Mac Mini side
Host github-audit
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github_audit

# Repo remote
cd $HOME/elab-builder-audit
git remote set-url origin git@github-audit:USER/elab-builder.git
```

### §7.4 Auto-commit + push wrapper

```bash
# scripts/mac-mini-audit-commit.sh
#!/bin/bash
set -euo pipefail
REPO_DIR="$HOME/elab-builder-audit"
cd "$REPO_DIR"

git checkout -B "mac-mini/audit-$(date -u +%Y%m%d-%H%M)" 2>/dev/null
git add docs/audits/auto-mac-mini/
if git diff --cached --quiet; then
  echo "No changes — skip commit"
  exit 0
fi

git -c user.email="mac-mini-audit@elab" \
    -c user.name="Mac Mini Audit Bot" \
    commit -m "audit(mac-mini): auto-sweep $(date -u +%Y-%m-%dT%H:%M:%S)" || true

git push -u origin HEAD
```

### §7.5 Andrea visibility check

After cron `*/10 * * * *` activation + auto-push, Andrea sees:
- GitHub web/mobile branch list `mac-mini/audit-*` (one branch per cron tick → consider squash daily via separate sweep)
- `docs/audits/auto-mac-mini/v1-cap6-esp1/audit-data.json` updates per experiment
- HIGH/MEDIUM/LOW issue counts aggregated by `scripts/mac-mini-render-audit-md.mjs` (per SPEC)

---

## §8. Design analysis — Mac Mini audit script fruibilità + estetica + logica

### §8.1 Fruibilità (usability)

**For Andrea (decision-maker reviewing daily sweep)**:
- ✅ JSON structure tabular — easy `jq` filter
- ❌ NO aggregate dashboard — must read 94 JSON files manually
- ❌ NO trend over time — single snapshot per experiment, no diff vs previous run
- ❌ NO LIM-readable HTML report — requires Andrea to be at MacBook

**Iter 31+ improvements (proposal)**:
- Aggregate via `scripts/mac-mini-render-audit-md.mjs` → markdown table sortable
- Diff renderer: `audit-data-prev.json` vs `audit-data.json` per experiment → trend arrows ↗ ↘
- HTML dashboard `docs/audits/auto-mac-mini/_dashboard.html` published GitHub Pages

### §8.2 Estetica (aesthetic)

**Current screenshots**:
- `01-open.png` — landing page (could be WelcomePage gate if class_key bypass fails)
- `02-mounted.png` — should be Lavagna canvas with components mounted (currently broken due to defect 1)

**Iter 31+ improvements**:
- Add `03-unlim-response.png` — ChatOverlay UNLIM bubble with Vol/pag citation visible
- Add `04-fumetto.png` — fumetto report fine-sessione (post fumetto wire-up iter 41+)
- Standard viewport 1920×1080 LIM-realistic (not default 1280×720)
- Dark mode toggle for LIM-projection contrast verification

### §8.3 Logica (logic)

**Current flow**:
1. Load page (broken route)
2. Wait 2s settle (arbitrary timeout, no condition)
3. Read __ELAB_API state (fails)
4. Direct fetch UNLIM Edge (auth fails)
5. Auto-flag issues (cascading false-positives)

**Iter 31+ flow proposal** (condition-based-waiting per `superpowers:systematic-debugging`):

```javascript
// Phase 1: Load + wait for Lavagna mount
await page.goto(`${BASE_URL}/#lavagna?exp=${EXP_ID}`);
await page.waitForFunction(() => window.__ELAB_API?.unlim?.getCircuitState !== undefined, { timeout: 15000 });

// Phase 2: Auto-mount experiment (if hash routing alone insufficient)
await page.evaluate((expId) => window.__ELAB_API?.mountExperiment(expId), EXP_ID);
await page.waitForFunction(() => {
  const s = window.__ELAB_API?.unlim?.getCircuitState();
  return s?.components?.length > 0;
}, { timeout: 10000 });

// Phase 3: UNLIM smoke via injected auth from process.env
const unlimResp = await page.evaluate(async ({ expId, supabaseUrl, supabaseKey, elabKey }) => {
  // ... explicit auth headers from Mac Mini env injection
}, { expId: EXP_ID, supabaseUrl: '...', supabaseKey: process.env.SUPABASE_ANON_KEY, elabKey: process.env.ELAB_API_KEY });

// Phase 4: Conditional assertions (skip cascade on upstream failure)
const unlimSucceeded = unlimResp?.status === 200 && unlimResp.response;
audit.unlim_smoke = {
  succeeded: unlimSucceeded,
  // ... conditional flags
};
```

---

## §9. Acceptance gates iter 31+ (post script tune + wrapper + SSH key)

- [ ] **Defect 1**: `audit.components.not_loaded === false` on `v1-cap6-esp1` (LED blink)
- [ ] **Defect 2**: `audit.unlim_smoke.status === 200` on `v1-cap6-esp1`
- [ ] **Defect 3**: `audit.issues.HIGH.length === 0` for valid prod state (only flag real regressions)
- [ ] **Defect 4**: `bash scripts/mac-mini-audit-experiment.sh v1-cap6-esp1` runs end-to-end without manual env exports
- [ ] **SSH key**: `git push -u origin mac-mini/audit-test` succeeds Mac Mini side
- [ ] **Cron**: `*/10 * * * *` activated + 6 audit runs in last hour (`/tmp/audit-cron.log` non-empty)
- [ ] **GitHub mobile**: Andrea sees `mac-mini/audit-*` branches GitHub mobile within 24h soak
- [ ] **Dashboard**: `docs/audits/auto-mac-mini/_dashboard.html` aggregates 94 experiments + trend arrows

---

## §10. Anti-pattern checklist iter 30 docs-only

- ❌ NO claim "Mac Mini audit pipeline H24 LIVE" — cron NOT activated, defects 1-4 not yet fixed
- ❌ NO claim "audit findings reflect prod" — measurement bug not prod bug, R5 94.9% PZ V3 baseline (iter 38 carryover) confirms prod healthy
- ❌ NO claim "94 experiments audit running" — only 1 experiment audit attempted iter 29, with measurement defects
- ❌ NO claim "Andrea ratify queue 13 decisions impacted" — Mac Mini Task 1 in queue, deferred iter 31+ no decisions changed iter 30
- ❌ NO claim "fix shipped iter 30" — explicit Andrea constraint "no fix solo documentazione"
- ❌ NO claim "wrapper script LIVE" — proposed §6, deferred iter 31+
- ❌ NO claim "SSH key configured" — proposed §7, deferred iter 31+

---

## §11. Iter 31+ priority queue (Mac Mini autonomous track)

Per Andrea explicit "no fix" iter 30, iter 31+ entrance gates per priority:

| # | Atom | Estimate | Blocker chain | ROI |
|---|------|----------|---------------|-----|
| 1 | Defect 1 fix (route hash + class_key bypass + waitForFunction) | 30min | None | 🟢 HIGH — unblocks audit |
| 2 | Defect 2 fix (Path A explicit auth env injection) | 45min | Defect 1 | 🟢 HIGH — unblocks UNLIM smoke |
| 3 | Defect 3 fix (precondition gate + null state) | 20min | Defect 2 | 🟢 HIGH — unblocks honest signal |
| 4 | Wrapper script `scripts/mac-mini-audit-experiment.sh` | 1h | Defects 1+2+3 | 🟢 HIGH — unblocks cron |
| 5 | SSH key Mac Mini → GitHub deploy key | 30min Andrea + 15min auto | None (parallel) | 🟢 HIGH — unblocks Andrea visibility |
| 6 | Cron activation `*/10 * * * *` + state rotation | 30min | Atoms 4+5 | 🟡 MEDIUM — H24 sweep |
| 7 | Aggregator `scripts/mac-mini-render-audit-md.mjs` | 2h | Atom 6 | 🟡 MEDIUM — fruibilità |
| 8 | HTML dashboard GitHub Pages | 3h | Atom 7 | 🟢 HIGH — LIM-readable + trend |
| 9 | 94-experiment list `scripts/mac-mini-94-experiments.txt` | 30min | Atom 1 | 🟡 MEDIUM — full sweep |
| 10 | Diff renderer trend arrows | 2h | Atom 7 | 🟢 LOW — nice-to-have |

**Total estimate**: ~12h Mac Mini autonomous track iter 31+ (3-4 agent paralleli o sequential single-shot session)

---

## §12. Cross-link

- Plan: `docs/superpowers/plans/2026-05-01-mac-mini-autonomous-iter-39-sprint-T-close.md`
- SPEC: `docs/specs/SPEC-mac-mini-autonomous-audit-94-esperimenti-2026-05-02.md`
- Spec test: `tests/e2e/mac-mini-audit-experiment.spec.js` (iter 29 NEW, ~180 LOC)
- Iter 29 close: CLAUDE.md sprint history "Sprint T iter 38 carryover deploy chain..." section
- ADR-040 fumetto provider decision: `docs/adrs/ADR-040-fumetto-imagegen-provider-decision.md` (parallel iter 30 doc)
- Andrea decisioni queue: `docs/audits/2026-05-02-iter41-ANDREA-DECISIONI-FINALI.md`

---

**Status iter 30 docs-only**: gap analysis ONESTO complete. NO fix shipped (Andrea mandate). Iter 31+ entrance: 10-atom priority queue + wrapper script proposal + SSH key procedure + cron activation gate. Anti-inflation G45 cap mandate enforced — NO claim "Mac Mini cron LIVE" senza atoms 1-6 verified.
