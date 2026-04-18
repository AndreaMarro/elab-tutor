# 🚀 LAUNCH INSTRUCTIONS — Sessione autonoma multi-routine ELAB Tutor

**Data**: 18/04/2026
**Per**: Andrea Marro
**Stima tempo tuo attivo**: 35-45 minuti, poi Mac chiuso

Segui i passi in ordine. Ogni passo ha tempo stimato.

---

## ⏱ Step 1 — Pre-flight check (5 min)

Apri un terminale sul Mac:

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"

# Verifica git state
git status  # deve essere clean (o solo auto-copyright noise)
git log --oneline -5
# Atteso: 250364a fix(unlim): Principio Zero v3 + ultimi commit

# Verifica baseline
npx vitest run --reporter=dot 2>&1 | tail -3
# Atteso: 12056 test PASS

# Verifica Supabase Edge Function live
curl -sS https://vxvqalmxqtezvgiboxyv.supabase.co/functions/v1/unlim-chat | jq
# Atteso: {"status":"ok","version":"2.1.0",...}
```

Se tutto verde → passo 2.

---

## ⏱ Step 2 — Install/update Claude Code CLI (5 min)

```bash
# Update a latest (serve >=1.8 per Managed Agents)
npm install -g @anthropic-ai/claude-code
claude --version
# Atteso: 1.8.x o successiva

# Login Max #1
claude login
# Segui browser flow, seleziona Max #1
```

---

## ⏱ Step 3 — Setup Telegram Channels (10 min)

### 3a. Crea bot Telegram

Apri Telegram, cerca `@BotFather`:

```
/newbot
ElabOpsBot          # nome
ElabOpsBot_bot      # username (o altro disponibile)
```

BotFather ti dà un **token** (es `1234567890:ABCdef...`). **SALVA**.

### 3b. Configura Claude Code Channels

Nel terminale, dentro Claude CLI:

```bash
claude
```

Poi dentro Claude:
```
/telegram:configure
```

Segui:
- Incolla token BotFather
- Ricevi `pairing code` su schermo
- Apri Telegram, scrivi al bot `/pair <code>`
- Conferma su Claude CLI

Test:
```
/telegram:send "Test ELAB bot live"
```

Deve arrivare messaggio su Telegram.

---

## ⏱ Step 4 — Lancio 7 Routine su Max #1 (10 min)

Nel Claude CLI ancora aperto (Max #1):

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
```

Lancia le 7 routine (scaglionate nel tempo, 15 al giorno cap Max):

```
/routine create pdr1-unlim-core \
  --prompt-file docs/plans/2026-04-18-pdr1-unlim-core-design.md \
  --repo AndreaMarro/elab-tutor \
  --branch feature/unlim-core-v1 \
  --schedule "0 */4 * * *"

/routine create pdr2-openclaw-infra \
  --prompt-file docs/plans/2026-04-18-pdr2-openclaw-infra-design.md \
  --repo AndreaMarro/elab-tutor \
  --branch feature/openclaw-infra-v1 \
  --schedule "30 */4 * * *"

/routine create pdr3-vps-runpod \
  --prompt-file docs/plans/2026-04-18-pdr3-vps-runpod-deploy-design.md \
  --repo AndreaMarro/elab-tutor \
  --branch feature/vps-runpod-deploy-v1 \
  --schedule "15 */4 * * *"

/routine create pdr4-lesson-reader \
  --prompt-file docs/plans/2026-04-18-pdr4-lesson-reader-design.md \
  --repo AndreaMarro/elab-tutor \
  --branch feature/lesson-reader-v1 \
  --schedule "45 */4 * * *"

/routine create pdr-test-multiplier \
  --prompt-file docs/plans/2026-04-18-pdr-test-multiplier-design.md \
  --repo AndreaMarro/elab-tutor \
  --branch feature/test-multiplier-v1 \
  --schedule "0 */6 * * *"

# PDR Stress Chaos (schedulato venerdì 18:00)
/routine create pdr-stress-chaos \
  --prompt-file docs/plans/2026-04-18-pdr-stress-chaos-design.md \
  --schedule "0 18 * * 5"

# PDR Commercial
/routine create pdr-commercial \
  --prompt-file docs/plans/2026-04-18-pdr-commercial-pacchetti-design.md \
  --repo AndreaMarro/elab-tutor \
  --branch feature/commercial-v1 \
  --schedule "0 */8 * * *"
```

Verifica routines attive:
```
/routine list
```

Aspetta 2-3 min → Telegram dovresti ricevere 7 notifiche "Routine X started".

---

## ⏱ Step 5 — Lancio 5 Routine su Max #2 (10 min)

Switch a Max #2:

```bash
/logout
claude login  # seleziona Max #2
```

Lancia routine di governance/monitoring/auditor:

```
/routine create auditor \
  --prompt-file docs/plans/2026-04-18-routine-auditor-prompt.md \
  --trigger github-pr \
  --repo AndreaMarro/elab-tutor

/routine create regression-hunter \
  --prompt-file docs/plans/2026-04-18-routine-regression-hunter-prompt.md \
  --schedule "*/10 * * * *"

/routine create docs-keeper \
  --trigger github-merge \
  --repo AndreaMarro/elab-tutor

/routine create cost-tracker \
  --schedule "*/30 * * * *" \
  --task "check RunPod + Supabase + Vercel cost; if hourly burn > €2, Telegram alert; daily cap €50"

/routine create reality-check \
  --prompt-file docs/plans/2026-04-18-pdr-reality-check-design.md \
  --trigger manual  # Andrea triggera quando v1.0 candidate pronto
```

Verifica:
```
/routine list
```

Telegram: 5 notifiche "Max#2 routines started".

---

## ⏱ Step 6 — Verifica Telegram comandi base (2 min)

Su Telegram, scrivi al bot:

```
/status
```

Deve risponderti:
```
ELAB Routines Status:
🟢 pdr1-unlim-core: IDLE (next 2026-04-18 20:00)
🟢 pdr2-openclaw-infra: IDLE
🟢 pdr3-vps-runpod: IDLE
🟢 pdr4-lesson-reader: IDLE
🟢 pdr-test-multiplier: IDLE
🟢 pdr-stress-chaos: SCHEDULED Fri 18:00
🟢 pdr-commercial: IDLE
🟢 auditor: LISTENING github-pr
🟢 regression-hunter: ACTIVE (last run 2 min ago OK)
🟢 docs-keeper: LISTENING github-merge
🟢 cost-tracker: ACTIVE (€0.0/h)
🟢 reality-check: MANUAL
```

Se tutto OK → **puoi chiudere Mac**.

---

## ⏱ Step 7 — Chiudi Mac (0 min tuo tempo)

Sistema continua autonomo.

---

## 📱 Comandi Telegram utili mentre Mac chiuso

| Comando | Cosa fa |
|---------|---------|
| `/status` | Stato 12 routines |
| `/pr` | Lista PR aperte con link |
| `/bench` | Ultimo benchmark score |
| `/regressions` | Ultime 24h regression alerts |
| `/cost` | Spend totale 24h + breakdown |
| `/audit-log pr-XX` | Ultimo audit per PR |
| `/kill <routine>` | Emergency stop routine |
| `/approve pr-XX` | Approva merge PR (da phone) |
| `/override-governance TASK-XX "motivo"` | Bypass governance (emergency only) |
| `/maintenance-mode on/off` | Sospende auto-revert |
| `/report-daily` | PDF riassuntivo ultima sessione |

---

## 🎯 Scenario tipo Sabato 19/04 → Lunedì 21/04

### Sabato 19 ore 14:45 (dopo tutti step 1-6)

Chiudi Mac, vai.

### Sabato 19 ore 18:00

Telegram ping:
```
✅ PDR1 UNLIM Core: started on feature/unlim-core-v1
📝 First commits ready: tests/unit/lavagna/LessonReader.test.jsx (failing TDD)
📊 Baseline: 12056 (unchanged)
```

### Domenica 20 ore 10:00

Telegram:
```
🎉 PR #74 OPENED: feature/unlim-core-v1
Auditor R4: APPROVE
Preview: https://elab-builder-git-feature-unlim-core-v1.vercel.app
Reviewer: tap to approve merge
```

### Lunedì 21 ore 08:00

Telegram summary weekend:
```
📊 Weekend summary
✅ 3 PR opened + 1 merged
📈 Baseline: 12056 → 12890 (+834)
📈 Benchmark: 6.2 → 7.0
💰 Cost: €17.30 (RunPod + Supabase)
🔴 0 regressioni rilevate
🟢 Uptime 99.9%
👉 Review PR #75, #76 su github.com/...
```

### Lunedì 21 riapri Mac

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
git fetch origin

# Review PR
gh pr list
gh pr view 74
gh pr view 75
gh pr view 76

# Merge se OK
gh pr merge 74 --squash
```

---

## ⚠️ Emergency procedures

### Tutte le routines ferme

```bash
# Telegram
/status
# Se tutte DOWN:
/restart-all
```

Se non funziona:
1. Login Claude CLI
2. `/routine logs --tail 50`
3. Identifica errore, fix local, push, `/routine restart <nome>`

### Baseline regressione grave

```bash
# Regression hunter già auto-reverted probabilmente
# Verifica:
git log --oneline origin/main -10
# Cerca commit "chore(revert): auto-revert"
```

### Cost burn sopra budget

```bash
# Telegram
/kill pdr-test-multiplier  # se è quello che consuma
/cost-cap 50  # limit daily
```

### OpenClaw down

```bash
# SSH Hetzner CX52 (credentials in GitHub Actions secrets)
ssh openclaw@openclaw.elabtutor.school
cd ~/openclaw
docker compose restart openclaw
```

---

## 📋 Checklist pre-chiusura Mac

Prima di chiudere:
- [ ] 12 routines attive su `/status`
- [ ] Telegram riceve primo messaggio da ognuna
- [ ] Baseline 12056 confermato
- [ ] Build OK
- [ ] Deploy Supabase recent OK
- [ ] Push origin recent OK
- [ ] GitHub Actions governance-gate.yml configurato
- [ ] Claude CLI entrambi Max loggati
- [ ] Documenti PDR tutti committati

Se tutti ✅ → chiudi. Se 1 no → risolvi prima.

---

## 🎯 KPI successo sessione 2-3 giorni

Al tuo rientro, deve essere vero:
- [ ] Almeno 2 PR mergeabili per review
- [ ] Baseline test +500 minimo (target +3604 in 2 settimane)
- [ ] Benchmark score invariato o salito
- [ ] Uptime >99% tutto weekend
- [ ] Costo totale <€30
- [ ] Zero incidenti sicurezza
- [ ] Telegram ricevuti ≥50 aggiornamenti (routine activity)

Se KPI no → analisi retrospective, iterare prompt PDR.

---

**Domande prima del launch?** Chiedi su Telegram `/help` dopo step 3.

**Buon weekend. Sistema lavora per te.**
