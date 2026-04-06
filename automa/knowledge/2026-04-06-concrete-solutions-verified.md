# Soluzioni Concrete Verificate per Sviluppo Autonomo 20 Giorni
> Data: 2026-04-06 | Agente ricerca dedicato | Solo tool VERIFICATI funzionanti

## Scoperte Chiave (cambiano il piano)

### 1. Typst > LaTeX per report PDF
- `brew install typst` → singolo binario Rust 15MB
- Compila in millisecondi (vs minuti LaTeX)
- Zero dipendenze (vs texlive 4GB+)
- `typst compile report.typ report.pdf`
- Fonte: github.com/typst/typst

### 2. CodeScene MCP Server per anti-degradazione
- `claude mcp add codescene -- cs-mcp`
- Misura CodeHealth in tempo reale durante il lavoro
- Agenti guidati: 2-5x piu miglioramenti code health
- 30+ linguaggi supportati, corre localmente
- Fonte: github.com/codescene-oss/codescene-mcp-server

### 3. DeepSeek R1 come MCP Server
- github.com/66julienmartin/MCP-server-Deepseek_R1
- Si aggiunge alla config MCP di Claude Code
- Il worker chiama DeepSeek per reasoning/review durante il lavoro
- Zero script custom, integrazione nativa
- Costo: $0.14/M input (cache), $2.19/M output

### 4. Desktop Scheduled Tasks (meglio di cron)
- Claude Code Desktop ha scheduled tasks nativi
- Sopravvivono ai restart
- Accesso a file locali
- Worktree isolation toggle
- Intervallo minimo: 1 minuto
- Fonte: code.claude.com/docs/en/desktop-scheduled-tasks

### 5. CodeRabbit Free per repo privati
- Genuinamente gratuito: unlimited repo privati + pubblici
- 200 file/ora, 4 PR review/ora
- Setup: github.com/marketplace/coderabbitai → installa → automatico
- Fonte: coderabbit.ai/pricing

## Stack Consigliata (aggiornata)

| Componente | Soluzione | Confidenza |
|-----------|----------|------------|
| Scheduling | Desktop Scheduled Tasks + Ralph | ALTA |
| Anti-sleep | pmset + caffeinate (belt-and-suspenders) | ALTA |
| Permessi | Auto Mode (Team plan) o Ralph ALLOWED_TOOLS | ALTA |
| Memoria | claude-mem (SQLite locale, WARNING: security risk su network) | MEDIA |
| Code review AI | CodeRabbit Free + Qwen3 8B locale | ALTA |
| Secondo reviewer | DeepSeek R1 via MCP Server | ALTA |
| Anti-degradazione | CodeScene MCP Server | ALTA |
| Auto-format | PostToolUse hooks con Prettier | ALTA |
| Coverage ratchet | Vitest autoUpdate (config semplice, bug con mergeConfig) | MEDIA |
| Branch protection | GitHub API PUT (richiede GitHub Pro per repo privati) | ALTA |
| RAG locale | ChromaDB + nomic-embed-text via Ollama | ALTA |
| Report PDF | Typst (NON LaTeX) | ALTA |
| Delivery report | python-telegram-bot v22.7 | ALTA |

## Comandi Setup Rapido

```bash
# Typst
brew install typst

# CodeScene MCP
claude mcp add codescene -- cs-mcp

# DeepSeek R1 MCP
git clone https://github.com/66julienmartin/MCP-server-Deepseek_R1.git
cd MCP-server-Deepseek_R1 && npm install

# CodeRabbit
# → github.com/marketplace/coderabbitai (installa dal browser)

# Anti-sleep (Mac Mini)
sudo pmset -a sleep 0 disksleep 0 displaysleep 0 powernap 0
caffeinate -dims -t 1728000 &

# Ollama + modello review
ollama pull qwen3:8b
ollama pull nomic-embed-text
```

## WARNING claude-mem
Security risk ALTO: HTTP API porta 37777 senza autenticazione, bind 0.0.0.0.
Solo su macchine personali, MAI su cloud o reti condivise.
