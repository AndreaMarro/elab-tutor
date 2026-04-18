# 🚀 LAUNCH INSTRUCTIONS (v2 — GitHub Actions, Mac chiuso OK)

**Data**: 18/04/2026
**Per**: Andrea Marro
**Stima tempo tuo attivo**: ~20 min, poi Mac chiuso

---

## 📋 Perché GitHub Actions (onestà)

La prima versione LAUNCH prevedeva Claude Code Channels + Routines CLI. Verificato in session live:
- `/telegram:configure` → **Unknown command** in CLI 2.1.114
- `CronCreate` → fire solo quando REPL attivo (Mac deve stare acceso)

Strada reale che permette Mac chiuso: **GitHub Actions** con:
- Cron schedule (GitHub runner gira indipendentemente)
- `anthropics/claude-code-action@v1` esegue PDR con API key
- Telegram notifications via Bot API diretta
- Commit+push da runner

Costo API stimato: ~€15-50/weekend a seconda di quante routine girano.

---

## ⏱ Step 1 — Crea Anthropic API Key (5 min)

**Serve una API key separata dal Max subscription** (Max non permette headless automation).

1. Vai su https://console.anthropic.com/
2. Login (stesso account Max)
3. Settings → API Keys → Create Key
4. Nome: `elab-github-actions`
5. Spending limit: **€50/mese hard cap** (scegli un limit)
6. Copia la key: `sk-ant-api03-...` ← **SALVA**

## ⏱ Step 2 — Crea Telegram Bot (5 min)

1. Apri Telegram
2. Cerca `@BotFather`
3. `/newbot`
4. Nome: `ElabOpsBot` (o altro disponibile)
5. Copia token: `1234567890:ABC...` ← **SALVA**
6. Scrivi al tuo bot (cerca username) e premi START
7. Trova il tuo chat_id:
   - Apri: `https://api.telegram.org/bot<TOKEN>/getUpdates` (sostituisci TOKEN)
   - Nel JSON cerca `"chat":{"id": XXXXXX`
   - Copia chat_id ← **SALVA**

## ⏱ Step 3 — Configura 3 GitHub Secrets (5 min)

Nel tuo Mac terminale:

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"

# 3 comandi, sostituisci i valori ovviamente
gh secret set ANTHROPIC_API_KEY
# → incolla la key sk-ant-api03-... e INVIO

gh secret set TELEGRAM_BOT_TOKEN
# → incolla token bot 1234567890:ABC... e INVIO

gh secret set TELEGRAM_CHAT_ID
# → incolla chat_id numerico e INVIO
```

Verifica:
```bash
gh secret list
# Deve mostrare 3 secrets
```

## ⏱ Step 4 — Abilita GitHub Actions schedule (2 min)

Il workflow `.github/workflows/routines-orchestrator.yml` è già committato. 
Vai su GitHub:

1. https://github.com/AndreaMarro/elab-tutor/actions
2. Menu sinistro → "Routines Orchestrator"
3. Se vedi banner "This scheduled workflow is disabled because there hasn't been activity in this repository for 60 days" → click **Enable**
4. Verifica schedule lista (8 cron entries visibili)

## ⏱ Step 5 — Primo test manuale (3 min)

Lancia manualmente una routine per verificare tutto funziona:

```bash
gh workflow run routines-orchestrator.yml \
  --field routine=regression-hunter
```

Verifica:
```bash
gh run list --workflow=routines-orchestrator.yml --limit 3
# Atteso: in_progress o queued
```

Attendi 2-3 min. Telegram dovrebbe ricevere messaggio tipo:
```
OK Routine: regression-hunter
Branch: main
Status: success
https://github.com/AndreaMarro/elab-tutor/actions/runs/NNNN
```

**Se arriva Telegram** → sistema operativo.
**Se niente** → check secrets (`gh secret list`) e logs GitHub Action.

## ⏱ Step 6 — Chiudi Mac

Sistema gira autonomo. Ogni cron fire:
- GitHub runner Ubuntu si accende
- Esegue Claude Code Action con PDR specifico
- Commit/PR su branch dedicato
- Notifica Telegram
- Runner si spegne (pay-per-run)

---

## 📱 Comandi utili da telefono

```bash
# Da Termux Android o SSH da phone al Mac
gh workflow run routines-orchestrator.yml --field routine=pdr1-unlim-core  # lancia manuale
gh run list --workflow=routines-orchestrator.yml --limit 10                # ultimi run
gh run view <RUN_ID>                                                       # dettaglio
gh pr list                                                                 # PR aperte
gh pr view 74                                                              # review PR
gh pr merge 74 --squash                                                    # merge da phone
```

Telegram notifiche arrivano da sole ad ogni job completato (success o fail).

---

## 🎯 Schedule attivo (locale UTC nel workflow)

| Schedule | Routine | Fire frequency |
|----------|---------|----------------|
| `15 */6 * * *` | PDR3 VPS RunPod | ogni 6h :15 |
| `0 */4 * * *` | PDR1 UNLIM Core | ogni 4h |
| `30 */4 * * *` | PDR2 OpenClaw Infra | ogni 4h :30 |
| `45 */6 * * *` | PDR4 Lesson Reader | ogni 6h :45 |
| `0 */8 * * *` | Test Multiplier | ogni 8h |
| `*/30 * * * *` | Regression Hunter | ogni 30 min |
| `7 * * * *` | Cost Tracker | ogni ora :07 |
| `0 18 * * 5` | Stress Chaos | venerdì 18:00 |

Fire totali/giorno stimati: ~100-120
Costo API stimato: €2-5/giorno con Claude Sonnet 4.6 (€60-150/mese)

---

## 💰 Budget realistico

**Con GitHub Actions**:
- GitHub Actions runner gratis (public repo, under 2000 min/mese)
- **ANTHROPIC_API_KEY consumo**: €60-150/mese a regime
- Telegram bot: gratis
- Total: **€60-150/mese sopra Max**

**Alternative più economiche** (futuro):
- Hetzner CX52 + claude-code CLI headless: €32/mese ma più complesso setup OAuth
- Mac Mini M4 always-on: €849 one-time, poi €0 (ma serve setup)

---

## ⚠️ Limit check importante

- Workflow `timeout-minutes: 45` per job → no runaway
- `max_turns: 30` per Claude Code → no loop infinito
- GitHub free tier 2000 min/mese → OK per 100 run × 5-10 min/run
- Spending limit Anthropic Console → stop automatico se superato

## 🆘 Emergency kill

```bash
# Disabilita workflow
gh workflow disable routines-orchestrator.yml

# Cancella run in corso
gh run cancel <RUN_ID>

# Ri-abilita quando vuoi
gh workflow enable routines-orchestrator.yml
```

## 🎯 KPI weekend atteso

Al tuo rientro (lunedì):
- 2-3 PR aperte per review
- Baseline test stabile o crescente
- Zero regressioni (Regression Hunter auto-revert)
- Costo totale: €15-50

Se tutto verde → merge PR, prosegui sviluppo.
Se qualcosa rosso → Telegram già te l'ha detto, fix + re-run.

---

**Non pretendo che sia perfetto al primo tentativo**. GitHub Actions + Claude Code Action è pattern noto, ma il tuo use case è specifico. Primo weekend è anche stress test del sistema stesso. Iterate dopo.
