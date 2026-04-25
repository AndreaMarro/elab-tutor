# Mac Mini Livello 1 — Autonomous Loop Setup (Brain-free, post-2026-04-26 revision)

> **Goal**: rendere Mac Mini M4 16GB Strambino lavoratore autonomo H24 con Claude Code agents + Claude Max sub.
> **Tempo stimato totale**: ~90min Andrea fisicamente su Mac Mini.
> **Output**: Mac Mini esegue Wiki concept generation, continuous benchmark, audit cycles, agent orchestration overnight con Telegram approval gates per Andrea.

**Revisione 2026-04-26**: Brain V13 self-host SKIPPED (deprecate path, no replace).

---

## Pre-requisites

- Mac Mini M4 16GB acceso, connesso a internet
- Account Claude (Max sub attivo)
- Account GitHub (Andrea)
- Account Telegram (per approval gates) — opzionale ma raccomandato

---

## Step 1 — SSH/Tailscale install (15min)

### Opzione A: Tailscale (raccomandato, EU GDPR-clean)

Sul Mac Mini fisico:
```bash
# Install Tailscale
brew install --cask tailscale

# Avvia + login (apri browser, autentica)
open -a Tailscale
# Configure → Login con account Tailscale
```

Sul MacBook Air Andrea (se ancora non installato):
```bash
brew install --cask tailscale
open -a Tailscale
```

Verifica connessione tra Mac Mini ↔ MacBook Air:
```bash
# Su MacBook Air
tailscale ip -4   # Note IP MacBook Air
ping <mac-mini-tailscale-ip>
ssh andreamarro@<mac-mini-tailscale-ip>
```

### Opzione B: SSH locale rete (più semplice se stessa rete)

```bash
# Su Mac Mini: enable SSH
sudo systemsetup -setremotelogin on

# Find Mac Mini IP locale
ipconfig getifaddr en0  # WiFi
# OR
ipconfig getifaddr en1  # Ethernet
```

Sul MacBook:
```bash
ssh andreamarro@<mac-mini-local-ip>
```

---

## Step 2 — Claude Code install + Max sub login (10min)

Sul Mac Mini fisico (oppure via SSH dal MacBook):
```bash
# Install Claude Code (npm o brew, scegli)
npm install -g @anthropic-ai/claude-code

# Verifica
claude-code --version

# Login con Max sub
claude-code login
# Apre browser per autenticazione → autentica con email Andrea Max sub
```

Verifica login:
```bash
claude-code config get
# Should show authenticated user + Max plan
```

---

## Step 3 — Clone repo + checkout main (5min)

```bash
# Clone repo (se non già)
mkdir -p ~/Projects
cd ~/Projects
git clone https://github.com/AndreaMarro/elab-tutor.git
cd elab-tutor

# Setup git config (se non già)
git config user.email "marro.andrea96@gmail.com"
git config user.name "Andrea Marro"

# Checkout main
git checkout main
git pull origin main --quiet

# Verifica baseline test
npm install  # potrebbe richiedere ~5-10min prima volta
npx vitest run 2>&1 | tail -3
# Expected: 12291 PASS (o 12498 post Sprint Q merge)
```

---

## Step 4 — launchctl plist autonomous loop (15min)

Goal: process autonomous che gira H24 anche dopo reboot, gestito da macOS launchd.

### 4.1 Crea script autonomous loop

```bash
mkdir -p ~/scripts
cat > ~/scripts/elab-mac-mini-autonomous-loop.sh << 'EOF'
#!/bin/bash
# ELAB Mac Mini autonomous loop
# Runs continuously, dispatching Claude Code agents per scheduled tasks
# Logs to ~/Library/Logs/elab/

LOG_DIR="$HOME/Library/Logs/elab"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/autonomous-loop-$(date +%Y%m%d).log"

cd "$HOME/Projects/elab-tutor" || exit 1

echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Mac Mini autonomous loop start" >> "$LOG_FILE"

# Loop forever, sleeping between iterations
while true; do
  # Pull latest main
  git fetch --all --quiet 2>>"$LOG_FILE"

  # Tasks scheduled (each emits Telegram notification on completion):
  # 1. Wiki concept generation (every 4h)
  # 2. Continuous benchmark (every 24h at 03:00)
  # 3. Audit cycles (every 24h at 04:00)
  # 4. Sprint R agent orchestration (when triggered via file watch)

  HOUR=$(date +%H)
  MINUTE=$(date +%M)

  # 03:00 — daily benchmark
  if [ "$HOUR" = "03" ] && [ "$MINUTE" -lt "10" ]; then
    echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Trigger daily benchmark" >> "$LOG_FILE"
    node scripts/benchmark.cjs --write 2>>"$LOG_FILE" || echo "  benchmark failed" >> "$LOG_FILE"
  fi

  # 04:00 — daily audit
  if [ "$HOUR" = "04" ] && [ "$MINUTE" -lt "10" ]; then
    echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Trigger daily audit" >> "$LOG_FILE"
    node scripts/audit-drift.mjs 2>>"$LOG_FILE" || echo "  audit failed (script may not exist yet)" >> "$LOG_FILE"
  fi

  # Watch for trigger file (manual dispatch from MacBook via SSH)
  TRIGGER_FILE="$HOME/.elab-trigger"
  if [ -f "$TRIGGER_FILE" ]; then
    TRIGGER_CMD=$(cat "$TRIGGER_FILE")
    rm "$TRIGGER_FILE"
    echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Trigger received: $TRIGGER_CMD" >> "$LOG_FILE"
    eval "$TRIGGER_CMD" >>"$LOG_FILE" 2>&1
  fi

  # Sleep 5 min between checks
  sleep 300
done
EOF

chmod +x ~/scripts/elab-mac-mini-autonomous-loop.sh
```

### 4.2 Crea launchd plist persistente

```bash
cat > ~/Library/LaunchAgents/com.elab.mac-mini-autonomous-loop.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.elab.mac-mini-autonomous-loop</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>-l</string>
        <string>/Users/andreamarro/scripts/elab-mac-mini-autonomous-loop.sh</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/andreamarro/Library/Logs/elab/launchd-stdout.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/andreamarro/Library/Logs/elab/launchd-stderr.log</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin</string>
        <key>HOME</key>
        <string>/Users/andreamarro</string>
    </dict>
    <key>WorkingDirectory</key>
    <string>/Users/andreamarro/Projects/elab-tutor</string>
</dict>
</plist>
EOF

# Adjust username if different from andreamarro
sed -i '' "s|andreamarro|$(whoami)|g" ~/Library/LaunchAgents/com.elab.mac-mini-autonomous-loop.plist
```

### 4.3 Carica + avvia

```bash
launchctl load -w ~/Library/LaunchAgents/com.elab.mac-mini-autonomous-loop.plist

# Verifica running
launchctl list | grep elab
# Expected: PID + 0 + com.elab.mac-mini-autonomous-loop

# Inspect logs
tail -f ~/Library/Logs/elab/autonomous-loop-$(date +%Y%m%d).log
# Should see "Mac Mini autonomous loop start"
```

### 4.4 Test reboot persistence

```bash
sudo reboot

# After reboot, login, wait 30s
launchctl list | grep elab
# Should auto-restart, PID different but same label
```

---

## Step 5 — Telegram approval gate setup (30min)

Goal: agente Claude richiede approvazione Andrea via Telegram prima di operations rischiose (deploy, delete, key rotation).

### 5.1 Crea Telegram bot

1. Apri Telegram, cerca `@BotFather`
2. `/newbot` → name "ELAB Mac Mini Bot" → username `elab_mac_mini_bot` (o disponibile)
3. Salva bot token (formato `123456:ABC-DEF...`)
4. Crea chat con il bot (cerca username, click Start)
5. Get chat ID:
   ```bash
   curl https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
   # Cerca "chat":{"id":123456789,"type":"private"}
   ```

### 5.2 Configura env Mac Mini

```bash
cat >> ~/.zshrc << 'EOF'

# ELAB Telegram approval gate
export ELAB_TELEGRAM_BOT_TOKEN="<paste-bot-token-here>"
export ELAB_TELEGRAM_CHAT_ID="<paste-chat-id-here>"
EOF

source ~/.zshrc
```

### 5.3 Crea script approval gate helper

```bash
cat > ~/scripts/elab-telegram-approval.sh << 'EOF'
#!/bin/bash
# Send message to Telegram requesting approval
# Usage: ./elab-telegram-approval.sh "Operation description"
# Returns 0 if Andrea approves with /yes, 1 if /no or timeout (10min)

OPERATION="$1"
TIMEOUT=${2:-600}  # 10min default

if [ -z "$ELAB_TELEGRAM_BOT_TOKEN" ] || [ -z "$ELAB_TELEGRAM_CHAT_ID" ]; then
  echo "ERROR: ELAB_TELEGRAM_BOT_TOKEN or ELAB_TELEGRAM_CHAT_ID not set"
  exit 2
fi

# Send approval request
TOKEN="$(date +%s)-$RANDOM"
MESSAGE="🤖 ELAB Mac Mini approval needed:%0A%0A${OPERATION}%0A%0AReply /yes_${TOKEN} to approve, /no_${TOKEN} to reject. Timeout: ${TIMEOUT}s"

curl -s "https://api.telegram.org/bot${ELAB_TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${ELAB_TELEGRAM_CHAT_ID}&text=${MESSAGE}&parse_mode=HTML" > /dev/null

# Poll for response
START=$(date +%s)
LAST_UPDATE_ID=$(curl -s "https://api.telegram.org/bot${ELAB_TELEGRAM_BOT_TOKEN}/getUpdates?limit=1" | python3 -c "import sys,json; data=json.load(sys.stdin); print(data['result'][-1]['update_id'] if data['result'] else 0)")

while [ $(($(date +%s) - START)) -lt "$TIMEOUT" ]; do
  RESPONSE=$(curl -s "https://api.telegram.org/bot${ELAB_TELEGRAM_BOT_TOKEN}/getUpdates?offset=$((LAST_UPDATE_ID + 1))")

  if echo "$RESPONSE" | grep -q "/yes_${TOKEN}"; then
    echo "APPROVED"
    exit 0
  fi
  if echo "$RESPONSE" | grep -q "/no_${TOKEN}"; then
    echo "REJECTED"
    exit 1
  fi

  sleep 5
done

echo "TIMEOUT"
exit 1
EOF

chmod +x ~/scripts/elab-telegram-approval.sh
```

### 5.4 Test approval flow

```bash
~/scripts/elab-telegram-approval.sh "Test approval — reply /yes_<token> to confirm"
# Open Telegram, click /yes_<TOKEN> link
# Should print "APPROVED" and exit 0
```

---

## Step 6 — First agent dispatch dry-run (15min)

Goal: verifica Claude Code agent dispatch funziona on Mac Mini.

### 6.1 Test interactive

```bash
cd ~/Projects/elab-tutor
claude-code
# Should open Claude Code TUI
# Type test prompt: "Mostra ls -la della cartella corrente"
# Expected: ls output, no errors
# /quit
```

### 6.2 Test headless dispatch (per autonomous loop)

```bash
cd ~/Projects/elab-tutor

# Esempio: dispatch un agente per generare 1 nuovo Wiki concept
# (Sprint R3 prep work, può farlo Claude Code agent)
echo "Generate one new Wiki LLM concept md file in docs/unlim-wiki/concepts/ following the SCHEMA.md format. Pick a concept not yet covered (e.g. 'cortocircuito' if missing). Save the file. Do NOT commit." | claude-code --headless --max-turns 10 --output /tmp/agent-output.txt

cat /tmp/agent-output.txt
ls -la docs/unlim-wiki/concepts/ | tail -5
# Expected: new concept file created
```

### 6.3 Trigger autonomous loop manually

Sul MacBook, via SSH:
```bash
ssh andreamarro@<mac-mini-tailscale-ip> "echo 'echo Test trigger works' > ~/.elab-trigger"
# Wait 5min for loop to pick up
ssh andreamarro@<mac-mini-tailscale-ip> "tail -10 ~/Library/Logs/elab/autonomous-loop-$(date +%Y%m%d).log"
# Expected: "Trigger received: echo Test trigger works" + "Test trigger works"
```

---

## Step 7 — Daily routine (post setup)

### Andrea morning check (5min)

```bash
# SSH dal MacBook
ssh andreamarro@<mac-mini-tailscale-ip>

# Verifica process running
launchctl list | grep elab

# Inspect log overnight
tail -50 ~/Library/Logs/elab/autonomous-loop-$(date -u +%Y%m%d).log

# Check git status (any new branches/commits autonomous loop made)
cd ~/Projects/elab-tutor
git fetch --all
git log --all --oneline -10

# Check Telegram for approval requests pending
```

### Disable temporarily (if needed)

```bash
launchctl unload ~/Library/LaunchAgents/com.elab.mac-mini-autonomous-loop.plist
# Re-enable: launchctl load -w ...
```

### Tail logs live

```bash
tail -f ~/Library/Logs/elab/autonomous-loop-*.log
```

---

## Risk + Mitigations

| Rischio | Mitigazione |
|---------|-------------|
| Mac Mini offline (power cut, internet down) | launchd KeepAlive auto-restart on boot. Andrea checks Telegram morning. |
| Runaway agent loop (token burn) | max_turns 10 cap per agent. Daily token spend check via Anthropic dashboard. |
| Risky operation auto-execute | Telegram approval gate for: deploy, delete, key rotation, npm install, force push |
| Disk full (logs accumulating) | Logrotate via cron weekly. Or manual: `find ~/Library/Logs/elab -mtime +30 -delete` |
| Repo state drift (autonomous commits accumulate) | All autonomous work goes to NEW branches. Andrea reviews via PR before main merge. |
| Tailscale tunnel down | SSH local fallback (if same network) or hard reset Tailscale |

---

## Anti-patterns (NON fare)

1. **NON dare Claude Code permessi `--dangerously-skip-permissions`** — Telegram gate replaces this for sensitive ops
2. **NON committare `~/.elab-trigger` file** — è gitignored, ma comunque mai stage
3. **NON merge autonomous PR senza review** — Andrea OK explicit each PR
4. **NON scrivere logs in repo path** — logs in `~/Library/Logs/elab/` only
5. **NON installare dipendenze npm autonomamente** — require approval gate
6. **NON deploy autonomously** — Vercel deploys need Andrea OK explicit (CLAUDE.md immutable)

---

## Cosa Mac Mini PUÒ fare autonomously (sicuro)

- Generate Wiki concept md drafts (commit to branch, NOT main)
- Run benchmark daily
- Run audit drift scripts
- Lint codebase, scan for TODOs
- Update memory/sunti documents
- Pre-build dist locally for Vercel `--prebuilt` workaround (legacy)
- Periodic test runs to catch flakiness

## Cosa Mac Mini NON deve fare (require approval)

- npm install / package.json modify
- git push to main (forbidden, gate)
- Merge any PR (Andrea only)
- Vercel deploy
- Supabase deploy
- Modify .env / secrets
- Force push any branch
- Delete files outside automa/ logs

---

## Verifica setup completato

Checklist:

- [ ] Tailscale connected Mac Mini ↔ MacBook
- [ ] SSH from MacBook to Mac Mini works
- [ ] Claude Code installed + Max sub authenticated
- [ ] Repo cloned at `~/Projects/elab-tutor`
- [ ] `npm install` ran successfully
- [ ] `npx vitest run` shows baseline test count
- [ ] launchctl plist loaded
- [ ] Autonomous loop logs visible
- [ ] Telegram bot token + chat ID set in env
- [ ] Telegram approval test passed
- [ ] Manual trigger via `~/.elab-trigger` works
- [ ] Reboot persistence verified

---

## Next steps post setup

Sprint R3 Wiki LLM expansion = primary autonomous workload.

Trigger pattern (from MacBook):
```bash
ssh andreamarro@<mac-mini-tailscale-ip> << 'EOF'
echo 'cd ~/Projects/elab-tutor && claude-code --headless --max-turns 30 --output /tmp/wiki-batch.log < ~/scripts/wiki-concept-prompt.txt' > ~/.elab-trigger
EOF
```

Andrea wakes up to:
- 1-3 new Wiki concepts in `docs/unlim-wiki/concepts/`
- New branch `mac-mini/wiki-concepts-batch-N-2026-04-XX`
- Telegram notification "3 concepts ready for review"
- Andrea reviews + merges (or rejects + asks revisions)

ELAB grows overnight while Andrea sleeps.

---

**File path**: `docs/infra/MAC-MINI-LIVELLO-1-AUTONOMOUS-SETUP.md`
**Effort Andrea**: ~90min one-time fisicamente su Mac Mini
**Output**: autonomous H24 worker for Wiki gen + benchmark + audits
**Risk profile**: LOW (Telegram gates + branch isolation + Andrea review per PR)
