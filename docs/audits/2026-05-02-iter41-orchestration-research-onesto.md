# Iter 41 Research onesto — Orchestrazione Mac Mini autonomous H24 ELAB

**Date**: 2026-05-02 PM
**Mandato**: Andrea NON compiacenza. Cerca strumenti reali. Flagga abandoned/marketing slop.
**Output**: Top-3 raccomandati + scartati + architettura proposta + anti-pattern.

## Top-10 comparativa

| Tool | What | Stars | Active 2026 | Mac M4 | Cost | Claude | ELAB fit |
|------|------|-------|-------------|--------|------|--------|----------|
| **Claude Code Channels Telegram MCP** | Anthropic ufficiale: phone control CC | Plugin | Mar 2026 | ✅ | Pro/Max | Native | ✅ TOP |
| **Ralph Loop** (snarktank) | Autonomous loop CC fresh-context iter | few k | Apr 2026 | ✅ | Free | Native | ✅ già in stack |
| **Playwright Test Agents** (Microsoft) | planner+generator+healer plain-language | Official | 2026 | ✅ | Free | via MCP | ✅ user-sim K-12 |
| OpenHands (ex OpenDevin) | Coding agent self-hosted Docker | 70k+ | Mar 2026 | ✅ Docker | Free OSS | LiteLLM | ⚠️ duplica CC |
| Cline VSCode | IDE coding agent 17+ providers | ~40k | Apr 2026 | ✅ | Free | OK | ❌ duplica CC |
| Aider | Pair-programmer terminal git-native | 39k | active | ✅ | Free | OK | ❌ meno potente CC |
| AutoClaw Z.AI | Desktop browser automation GLM bundled | Closed | Mar 2026 | ✅ macOS | BYOK | ❌ GLM only | ❌ lock-in cinese |
| CrewAI / LangGraph / AG2 | Framework Python multi-agent | 30-50k | Active | ✅ | Free + API | OK SDK | ❌ ricostruisce CC |
| AutoGPT | Visual workflow builder Docker | 184k | Apr 2026 | ✅ | Free | Custom blocks | ❌ overkill generalista |
| Kimi K2.6 + Kimi Code CLI | Modello agentic coding 12h horizon | Mod-MIT | Apr 2026 | Cloud only | OpenRouter | ❌ alt to Claude | ⚠️ alt economica notturna |

## Top-3 RACCOMANDATI ELAB onesto

### 1. Claude Code Channels Telegram MCP — DEPLOY SUBITO

Plugin ufficiale Anthropic Marzo 2026. Risolve esattamente caso Andrea: Mac Mini M4 always-on con CC, Andrea controlla da phone, approva permission inline, riceve notifiche fine task.

**Setup ~30 min**:
- Install plugin via `claude plugin add channels-telegram`
- Crea Telegram bot via @BotFather → ottieni token
- Config plugin con bot token + Andrea Telegram user ID
- Test: chat al bot "Status" → vedi running tasks

**Sostituisce design v4**: Cowork+OpenClaw+AutoResearchClaw+9-componenti stack memoria → semplificato a 1 plugin ufficiale.

### 2. Ralph Loop (già in stack ELAB) — MANTENERE

Andrea cita in memoria. Approccio fresh-context per iter è onestamente superiore ai persistent agents per task lunghi. Memory via git log + automa/state/heartbeat è anti-fragile.

Combinato con Channels MCP = supervisione mobile gratis senza nuovo codice.

### 3. Playwright Test Agents — user-sim docente LIM K-12

Microsoft ufficiale OSS 2026. Skill `elab-harness-real-runner` esistente già usa Playwright base. Nuovo Test Agents stack genera test da plain-language ("docente apre LIM, clicca esperimento 4, sbaglia componente"), self-heals selettori. Read AOM > DOM scraping = 10x più stabile.

**Setup ~1h**:
- `npm install @playwright/test-agents`
- Estendi skill `elab-harness-real-runner` con planner role
- Plain-language scenarios: 10 personas docente (esperto, primo anno, restio tech, etc.)
- Run continuous H24 BG via cron Mac Mini

## Scartati e perché

| Tool | Reason scartato |
|------|-----------------|
| AutoGPT 184k stars | Visual builder marketplace = generalista. Setup Docker overhead non giustificato vs Ralph+CC. |
| CrewAI/LangGraph/AG2/AutoGen/MetaGPT/OpenManus/BabyAGI/CAMEL | Framework Python multi-agent. Andrea ricostruirebbe da zero ciò che CC orchestrator + sub-agents (wshobson/agents) fa nativamente. AutoGen MS = maintenance mode. |
| AutoClaw Z.AI | Locale + no API key MA centrato browser automation con GLM proprietario. No Claude integration nativa. Privacy claims MA ecosystem cinese, supporto IT-K-12 nullo, supply-chain risk. |
| OpenHands / Cline / Aider | Tutti coding agents autonomi solidi. Per Andrea con Claude Code + Ralph attivi = duplicati. Cline solo per fallback se Anthropic alza prezzi. |
| Devin ($500/mo) | Sales call enterprise. Skip. |
| n8n / Pipedream / Make | Workflow automation. Adatti glue tra servizi MA non a "user-sim continuous testing" né "improve loop on codebase". Overkill per ELAB. |
| Kimi K2.6 | Score SWE-Bench Pro 58.6 batte Opus 4.6 53.4 onestamente. Solo cloud API. Considera secondary loop notturno OpenRouter task batch low-cost MA NON primary (no CC CLI nativo). |

## Architettura proposta Mac Mini Autonomous H24

```
Mac Mini M4 16GB Strambino (always-on)
├─ Claude Code (Pro/Max) PRIMARY orchestrator
│  ├─ Ralph Loop (snarktank) — autonomous improvement cycles su PRD ELAB
│  ├─ Sub-agents (wshobson/agents) — specialized roles
│  └─ MCP servers
│     ├─ Claude Code Channels Telegram ← Andrea phone control
│     ├─ Playwright MCP ← user-sim docente LIM K-12
│     ├─ Supabase MCP ← read-only RLS sandbox
│     └─ GitHub MCP ← PR review da phone
├─ Playwright Test Agents (planner/generator/healer)
│  └─ Suite continua "docente non-tech apre 94 esperimenti"
├─ Ralph progress.txt + git log = memory persistente
└─ HOOKS già attivi (.claude/settings.local.json):
   ├─ Block git reset --hard / rm -rf
   ├─ Block .env / .git access
   └─ Block stop se npm run build fail

GATE ANDREA (mobile via Telegram):
- ANY destructive change → permission inline button
- Deploy Vercel/Supabase → richiede /approve esplicito
- Merge PR → solo via gh CLI sotto supervisione
- Auto-merge MAI (rispetta mandate memoria)
```

**Costo realistico**: Claude Max $200/mese + zero infra extra.

Design v4 in memoria con Cowork+OpenClaw+AutoResearchClaw è sovra-ingegnerizzato — Channels MCP ufficiale lo sostituisce gratis.

## Anti-pattern (sembrano OK ma NO production-ready)

1. **"Mac Mini local LLM (Ollama Qwen3.5)" come primary brain**
   16GB RAM = max 14B model decente. Quality SWE gap >2x vs Claude Sonnet 4.5. Adatto solo a embeddings/classifier ausiliari, non a coding loop. Brain V13 Qwen3.5-2B su VPS è giusto per Tutor-AI runtime, NON per dev-loop.

2. **CrewAI/AG2 per coordinare Claude Code instances**
   Aggiungere layer Python sopra CC = bug surface inutile. CC ha già sub-agents nativi.

3. **AutoGPT visual builder per ELAB pipeline**
   Marketplace blocks = false productivity. Single-dev rebuild custom in 1 settimana sarebbe più veloce e auditabile.

4. **Devin / OpenHands cloud SaaS**
   Sales call, billing opaco, nessuna integrazione con stack Supabase Edge Functions Deno specifico ELAB.

5. **n8n cloud "AI agent nodes" per orchestrare il dev**
   Marketing slop. Va bene per integrazioni Slack/Sheets, NON per continuous improvement codebase.

6. **OpenManus / BabyAGI / CAMEL**
   Hobby/research projects. Stars salgono, commit production reali pochi. Skip.

7. **AutoClaw Z.AI per user-sim ELAB**
   Browser automation OK MA GDPR + lock-in GLM + no Italian K-12 corpus = preferisci Playwright Test Agents.

## Verdetto sintesi onesta

Andrea ha già **80% architettura giusta** in memoria (Claude Code + Ralph + Playwright skill `elab-harness-real-runner` + hooks safety).

**Manca solo**:
- Claude Code Channels Telegram MCP (rilasciato Mar 2026, ufficiale, gratis)
- Playwright Test Agents per user-sim docente realistica

**Tutto il resto** del design v4 (Cowork+OpenClaw+AutoResearchClaw+claude-mem 9-componenti) è da semplificare drasticamente.

**Budget reale**: Claude Max $200/mese, zero altro.

## Cross-references

- Plan iter 41: `docs/superpowers/plans/2026-05-02-iter-41-velocita-onniscenza-onnipotenza-wake-word.md`
- Andrea memory: `mac-mini-autonomous-design.md` (design v4 da semplificare)
- AutoClaw Z.AI: https://autoglm.z.ai/autoclaw/
- Kimi K2.6: https://kimi-k2.org/blog/24-kimi-k2-6-release
- Claude Code Channels docs: https://code.claude.com/docs/en/channels
- Ralph snarktank: https://github.com/snarktank/ralph
- Playwright Test Agents: https://playwright.dev/docs/test-agents
- Anthropic Computer Use: https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool
