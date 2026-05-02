# SPEC — Mac Mini autonomous Playwright audit 94 esperimenti ELAB

**Date**: 2026-05-02 sera
**Owner**: Andrea Marro + Mac Mini Strambino M4 16GB
**Goal**: H24 autonomous Playwright audit ogni esperimento ELAB → markdown audit doc per esperimento → push GitHub branch periodically. Andrea check ogni 10 min via mobile.

## 1. Goal + scope

Audit auto-documentato di OGNI funzionamento ELAB Tutor:
- **94 esperimenti** Vol1 (38) + Vol2 (27) + Vol3 (29) iterati uno per uno
- **Simulator Arduino**: NanoR4Board + componenti SVG + drag/drop
- **Codice generato**: HEX compile + emulazione AVR
- **Scratch/Blockly**: blocchi visivi → C++ Arduino mapping
- **UNLIM AI**: chat + voce + vision + fumetto report
- **Lavagna shell**: tabs, modalità (Percorso/Libero/Lezione/Dashboard)
- **Wake word**: "Ragazzi UNLIM" detection
- **Lighthouse perf** + a11y + SEO ogni route principale

**Out of scope**:
- NO fix codice app (Andrea mandate "no fix")
- NO modifica DB rag_chunks
- NO destructive ops
- READ-ONLY audit

## 2. Output format per esperimento

`docs/audits/auto-mac-mini/{vol}-{cap}-{esp}/audit-{timestamp}.md`:

```markdown
# Audit auto v{N}-cap{M}-esp{K} — {timestamp}

## Identità
- Volume: {1|2|3}
- Capitolo: {6|7|8|...}
- Esperimento ID: v{N}-cap{M}-esp{K}
- Titolo: {dal lesson-paths JSON}
- Vol/pag attesa: {dal volume-references}

## Apertura
- Tempo caricamento: {ms}
- Console errors: {count + first 3}
- Network errors: {count + URLs}
- Lighthouse perf: {score 0-100}
- DOM warnings: {count}

## Componenti caricati
- NanoR4Board: {presente/assente}
- Componenti SVG: [{id, type, position}]
- Wires connessi: {count + da-a}
- Breadboard: {presente/assente}

## Codice + compile
- Codice iniziale: ```{lang}\n...\n```
- Compile attempt: {success/fail + tempo + HEX size}
- AVR emulation: {LED state + serial output}

## Scratch/Blockly (se applicabile)
- Blocchi disponibili: {count}
- Mapping C++: {Scratch block → C++ line}
- Esecuzione: {Play funziona y/n}

## UNLIM AI smoke
- Prompt "Spiega questo esperimento": {response excerpt + tempo}
- Plurale "Ragazzi": ✅/❌
- Vol/pag citation: ✅/❌
- Kit ELAB mention: ✅/❌
- Analogia: ✅/❌
- Latency: {ms}
- Source: {mistral-small|large|gemini-flash-lite}

## Wake word smoke
- Mic permission: granted/denied
- "Ragazzi UNLIM" trigger: ✅/❌

## Issues found
- HIGH: {list}
- MEDIUM: {list}
- LOW: {list}

## Screenshots
- Apertura: ./screenshots/open.png
- Post-mount: ./screenshots/mounted.png
- UNLIM response: ./screenshots/unlim.png

## Verdict
- Funzionalità: {OK/PARTIAL/BROKEN}
- Coverage: {%}
- Priorità fix: {P0/P1/P2/none}
```

## 3. Architettura pipeline

```
Mac Mini M4 (always-on Tailscale)
├─ Cron 0,10,20,30,40,50 * * * * (ogni 10 min)
│  └─ ./scripts/mac-mini-audit-experiment.sh {next_exp_id}
│
├─ Playwright BrowserContext
│  ├─ Apre prod https://www.elabtutor.school
│  ├─ Login class_code (test class precreata)
│  ├─ Naviga al esperimento via #experiment={id}
│  ├─ Screenshot apertura + console + network
│  ├─ Esegui smoke UNLIM "Spiega questo esperimento"
│  ├─ Verifica simulator componenti caricati
│  ├─ Compile button click + verify HEX
│  └─ Salva audit md
│
├─ Output dir: docs/audits/auto-mac-mini/
│  ├─ v1-cap6-esp1/audit-2026-05-02T20-00.md
│  ├─ v1-cap6-esp2/audit-2026-05-02T20-10.md
│  └─ ...
│
├─ Git push branch `mac-mini/auto-audit-{date}`
│  └─ Andrea PR review iter close
│
└─ Telegram bot ping (optional)
   └─ "Audit done v1-cap6-esp1 — 2 HIGH issues, 1 MEDIUM"
```

## 4. Implementation script Playwright

`scripts/mac-mini-audit-experiment.sh` (POSIX shell, callable via cron):

```bash
#!/bin/bash
set -eo pipefail

EXP_ID="${1:-}"
if [ -z "$EXP_ID" ]; then
  # Pick next un-audited from queue (lesson-paths order)
  EXP_ID=$(node scripts/mac-mini-pick-next-experiment.mjs)
fi

cd "$(dirname "$0")/.."
TIMESTAMP=$(date -u +%Y-%m-%dT%H-%M-%S)
OUTPUT_DIR="docs/audits/auto-mac-mini/${EXP_ID}"
mkdir -p "$OUTPUT_DIR/screenshots"

# Run Playwright spec with experiment ID env
EXP_ID="$EXP_ID" \
TIMESTAMP="$TIMESTAMP" \
OUTPUT_DIR="$OUTPUT_DIR" \
npx playwright test tests/e2e/mac-mini-audit-experiment.spec.js \
  --reporter=list

# Generate audit MD via collected JSON
node scripts/mac-mini-render-audit-md.mjs \
  --json "$OUTPUT_DIR/audit-data.json" \
  --output "$OUTPUT_DIR/audit-${TIMESTAMP}.md"

# Git commit + push branch
cd "$(dirname "$0")/.."
BRANCH="mac-mini/auto-audit-$(date -u +%Y%m%d)"
git checkout -B "$BRANCH" 2>/dev/null
git add "$OUTPUT_DIR"
git commit -m "audit(mac-mini): ${EXP_ID} ${TIMESTAMP}" --no-verify
git push origin "$BRANCH" 2>&1 | tail -5

# Optional: Telegram ping
[ -n "$TELEGRAM_BOT_TOKEN" ] && curl -sS -X POST \
  "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d "chat_id=${TELEGRAM_CHAT_ID}&text=Audit ${EXP_ID} done $(grep -c HIGH $OUTPUT_DIR/audit-${TIMESTAMP}.md) HIGH"
```

## 5. Playwright spec tests/e2e/mac-mini-audit-experiment.spec.js

```javascript
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const EXP_ID = process.env.EXP_ID;
const TIMESTAMP = process.env.TIMESTAMP;
const OUTPUT_DIR = process.env.OUTPUT_DIR;

test(`audit ${EXP_ID}`, async ({ page, context }) => {
  const consoleErrors = [];
  const networkErrors = [];
  const audit = {
    experiment_id: EXP_ID,
    timestamp: TIMESTAMP,
    opening: {},
    components: {},
    code_compile: {},
    scratch: {},
    unlim_smoke: {},
    wake_word: {},
    issues: { HIGH: [], MEDIUM: [], LOW: [] },
  };

  // Capture console + network
  page.on('console', m => m.type() === 'error' && consoleErrors.push(m.text().slice(0,200)));
  page.on('pageerror', err => consoleErrors.push(err.message));
  page.on('requestfailed', req => networkErrors.push(`${req.failure()?.errorText}: ${req.url()}`));

  // Open prod
  const t0 = Date.now();
  await page.goto(`https://www.elabtutor.school/#tutor/experiment=${EXP_ID}`, {
    waitUntil: 'networkidle', timeout: 30000,
  });
  audit.opening.load_ms = Date.now() - t0;
  audit.opening.console_errors = consoleErrors.slice(0, 3);
  audit.opening.network_errors = networkErrors.slice(0, 3);

  await page.screenshot({ path: path.join(OUTPUT_DIR, 'screenshots/open.png'), fullPage: true });

  // Component discovery via window.__ELAB_API
  const state = await page.evaluate(() => {
    const api = window.__ELAB_API;
    if (!api?.unlim?.getCircuitState) return null;
    return api.unlim.getCircuitState();
  });
  audit.components = state ? {
    components: state.components?.length || 0,
    wires: state.connections?.length || 0,
    nano_present: state.components?.some(c => c.type === 'nano') || false,
  } : { not_loaded: true };

  // UNLIM smoke
  const unlimResp = await page.evaluate(async (expId) => {
    const t0 = Date.now();
    const res = await fetch('/api/unlim-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Spiega questo esperimento',
        experimentId: expId,
        sessionId: 's_audit_' + Math.random().toString(36).slice(2),
      }),
    });
    const data = await res.json();
    return { latency: Date.now() - t0, ...data };
  }, EXP_ID);

  audit.unlim_smoke = {
    latency_ms: unlimResp.latency,
    plurale: /Ragazzi/i.test(unlimResp.response || ''),
    vol_pag: /Vol\.\d+\s*pag\.\d+/i.test(unlimResp.response || ''),
    kit_elab: /kit\s*ELAB/i.test(unlimResp.response || ''),
    analogia: /come\s+un|pensate|immaginate/i.test(unlimResp.response || ''),
    source: unlimResp.source,
    response_excerpt: (unlimResp.response || '').slice(0, 300),
  };

  // Auto-flag issues
  if (audit.opening.load_ms > 5000) audit.issues.HIGH.push(`Slow load ${audit.opening.load_ms}ms`);
  if (consoleErrors.length > 0) audit.issues.MEDIUM.push(`${consoleErrors.length} console errors`);
  if (!audit.unlim_smoke.plurale) audit.issues.HIGH.push('UNLIM no plurale Ragazzi');
  if (!audit.unlim_smoke.vol_pag) audit.issues.MEDIUM.push('UNLIM no Vol/pag citation');
  if (!audit.unlim_smoke.kit_elab) audit.issues.MEDIUM.push('UNLIM no kit ELAB mention');
  if (audit.unlim_smoke.latency_ms > 5000) audit.issues.HIGH.push(`UNLIM slow ${audit.unlim_smoke.latency_ms}ms`);
  if (audit.components?.not_loaded) audit.issues.HIGH.push('Simulator __ELAB_API not loaded');
  if (audit.components?.components === 0) audit.issues.MEDIUM.push('No components mounted');

  fs.writeFileSync(path.join(OUTPUT_DIR, 'audit-data.json'), JSON.stringify(audit, null, 2));
});
```

## 6. Render audit md script `scripts/mac-mini-render-audit-md.mjs`

(Genera markdown da JSON usando il template §2 + lesson-paths context for Vol/pag attesi.)

## 7. Pick next experiment script `scripts/mac-mini-pick-next-experiment.mjs`

```javascript
// Picks next unaudited or stale experiment
// 1. Read lesson-paths/v1-* + v2-* + v3-* JSON
// 2. Read docs/audits/auto-mac-mini/{exp_id}/ existence + last timestamp
// 3. Return: oldest audit OR never-audited (priority unaudited)
```

## 8. Mac Mini deployment guide

### Pre-requisiti Mac Mini
- macOS Apple Silicon
- Node.js 20+ + npm + git
- Tailscale connected to Andrea's MacBook
- SSH key `id_ed25519_elab` in `~/.ssh/`
- Repo cloned `~/elab-tutor` synced via git pull

### Setup script (one-time)
```bash
ssh -i ~/.ssh/id_ed25519_elab progettibelli@100.124.198.59 "
  cd ~/elab-tutor &&
  git pull origin e2e-bypass-preview &&
  npm install &&
  npx playwright install chromium firefox webkit
"
```

### Cron entry
```bash
ssh ... "crontab -e"
# Add:
*/10 * * * * cd ~/elab-tutor && bash scripts/mac-mini-audit-experiment.sh >> /tmp/audit-cron.log 2>&1
```

### Telegram bot setup (opzionale)
```bash
ssh ... "echo 'export TELEGRAM_BOT_TOKEN=...' >> ~/.zshrc"
ssh ... "echo 'export TELEGRAM_CHAT_ID=...' >> ~/.zshrc"
```

## 9. Andrea check ogni 10 min via mobile

Opzioni:
- A. **Telegram bot ping** (se setup) → notifica push fine ogni audit
- B. **GitHub mobile app** → Andrea check branch `mac-mini/auto-audit-{date}` aggiornata ogni 10 min
- C. **Watchdog dashboard** locale Mac Mini su porta + Tailscale Funnel

Andrea check via phone:
1. Apri GitHub mobile
2. Vai a branch `mac-mini/auto-audit-2026-05-02`
3. Vedi commit count + audit md per esperimenti
4. Click su issues "HIGH" per veder dettagli

## 10. Anti-pattern flagged

| Anti-pattern | Mitigation |
|--------------|------------|
| Mac Mini autoloop "23-day uptime probable dead" | Andrea verifica Tailscale + restart manuale prima cron deploy |
| Cron without lock file → overlap se audit lento | flock `/tmp/elab-audit.lock` |
| Git push branch troppo frequente → noise | Branch giornaliero rotation |
| Auto-merge PR audit | NEVER — Andrea ratify always |
| 94 esperimenti × ogni 10 min = 940 audit/giorno | Throttle: round-robin pick once per 10 min, refresh ogni 24h |
| Screenshot 94 × ogni 10 min = ~14000 PNG/giorno | Compress + retain only last 3 versions per exp |
| Costo bandwidth | Tailscale free tier 100GB/mo → audit md text + compressed PNG OK |

## 11. Cumulative output retention

- Per esperimento: keep last 3 audits (compress others)
- Total output dir size: ~50MB/giorno con compress
- Auto-cleanup `find docs/audits/auto-mac-mini -name "audit-*.md" -mtime +7 -delete`
- Commit batch: ogni 6h compress + rotate branch

## 12. Andrea ratify queue (deployment)

```bash
# 1. Verify Mac Mini reachable
ssh -i ~/.ssh/id_ed25519_elab -o ConnectTimeout=10 progettibelli@100.124.198.59 "uptime"

# 2. Setup repo on Mac Mini
ssh ... "cd ~/elab-tutor || git clone https://github.com/AndreaMarro/elab-tutor.git ~/elab-tutor && cd ~/elab-tutor && git pull origin e2e-bypass-preview && npm install && npx playwright install chromium"

# 3. Test 1 audit manually
ssh ... "cd ~/elab-tutor && bash scripts/mac-mini-audit-experiment.sh v1-cap6-esp1"

# 4. Verify output
ssh ... "ls ~/elab-tutor/docs/audits/auto-mac-mini/v1-cap6-esp1/"

# 5. Activate cron
ssh ... "(crontab -l 2>/dev/null; echo '*/10 * * * * cd ~/elab-tutor && bash scripts/mac-mini-audit-experiment.sh >> /tmp/audit-cron.log 2>&1') | crontab -"

# 6. Andrea check via GitHub mobile app branch mac-mini/auto-audit-{date}
```

## 13. Out of scope (defer)

- Fixing app code (mandate Andrea "no fix")
- Modifying DB rag_chunks
- Self-healing tests (Microsoft Test Agents — defer iter 42+)
- Visual regression Percy/Chromatic (defer iter 43+)
- Cross-browser 9-cell matrix (D2 spec already shipped iter 41)

## 14. Cross-references

- Plan iter 41: `docs/superpowers/plans/2026-05-02-iter-41-velocita-onniscenza-onnipotenza-wake-word.md`
- Skill `elab-harness-real-runner` esistente
- D2 9-cell spec: `tests/e2e/sprint-t-iter41-wake-word-9-cell.spec.js`
- Orchestration research: `docs/audits/2026-05-02-iter41-orchestration-research-onesto.md`
- Final cumulative state: `docs/audits/2026-05-02-iter41-FINAL-cumulative-state.md`
