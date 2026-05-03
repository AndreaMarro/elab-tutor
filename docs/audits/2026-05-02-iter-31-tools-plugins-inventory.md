# Iter 31 Tools + Plugins + Connectors Inventory — MacBook + Mac Mini

**Date**: 2026-05-02
**Mode**: docs-only iter 30
**Scope**: complete inventory tools available MacBook (Andrea + Tea + orchestrator) + Mac Mini (autonomous H24 cron + persona-prof simulation)
**Cross-link**: master plan `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
**Anti-inflation**: G45 cap. NO claim "tool LIVE" senza prod-verify. Catalog + recommendations.

---

## §1. Executive summary

ELAB Tutor stack iter 30 utilizza:
- **2 host primari**: MacBook (development + orchestration) + Mac Mini Strambino (autonomous persona simulation H24)
- **3 ambienti runtime**: Claude Code CLI + Vite dev server + Vercel preview/prod
- **5 categorie tools**:
  1. Claude Code plugins (~13 active superpowers + caveman + ultrathink + ultrareview + skill-creator + writing-plans + executing-plans + systematic-debugging + quality-audit + claude-mem + agent-orchestration + accessibility-review)
  2. MCP server connectors (~67 deferred + control-chrome + control-macos)
  3. Custom skills (~13 ELAB-specific in `~/.claude/skills/` + 4 NEW iter 31)
  4. Subagent specialists (~30+ via Agent tool)
  5. External services (Supabase + Vercel + Cloudflare + Mistral + Voyage + GitHub + Notion + Figma + Sentry + PostHog)

Total estimated active tools count: **~150 tools surface** (deferred + active + custom).

---

## §2. MacBook tools inventory

### §2.1 Claude Code core tools (always-on)

| Tool | Purpose | Notes |
|---|---|---|
| **Bash** | shell execution | git + npm + node + supabase CLI |
| **Read** | file reading | absolute paths required |
| **Write** | file creation | NEW files only |
| **Edit** | precise edit existing | requires Read first |
| **Glob** | file pattern match | fast structural search |
| **Grep** | regex content search | code search |
| **Skill** | invoke skill | from .claude/skills/ + ~/.claude/skills/ |
| **Agent** | dispatch subagent | specialized roles |
| **TodoWrite** | task tracker | session progress |

### §2.2 Plugin claude-plugins-official ecosystem

Active plugins detected via system context iter 30:

| Plugin | Skills | Purpose |
|---|---|---|
| **superpowers** v5.0.7 | writing-plans, executing-plans, subagent-driven-development, brainstorming, systematic-debugging, test-driven-development, verification-before-completion, using-superpowers, **skill-creator**, writing-skills | Core process skills |
| **agent-orchestration** | improve-agent, multi-agent-optimize, **context-manager** | Multi-agent coordination |
| **caveman** | caveman lite/full/ultra | Terse output mode (current ACTIVE full) |
| **ultrathink** | ultrathink | Deep reasoning mode |
| **ultrareview** | ultrareview | Multi-agent cloud review (user-triggered, billed) |
| **claude-mem** | mem-search, smart-search, smart-outline, smart-unfold, timeline, get_observations | Memory persistence cross-session |
| **systematic-debugging** | systematic-debugging, root-cause-tracing, defense-in-depth, condition-based-waiting | Hypothesis-driven debugging |
| **quality-audit** | quality-audit | Code quality multi-dimensional review |
| **accessibility-review** | accessibility-review | WCAG AA + LIM-projection compliance |
| **brand-voice** | discover-brand, generate-content, conversation-analysis, document-analysis, quality-assurance | Brand voice content generation |
| **claude-code-guide** | (built-in agent) | Q&A Claude Code features |
| **debugging-toolkit** | debugger, dx-optimizer | Tool/workflow debugging |
| **distributed-debugging** | devops-troubleshooter, error-detective | Production incident response |
| **pr-review-toolkit** | code-reviewer, code-simplifier, comment-analyzer, pr-test-analyzer, silent-failure-hunter, type-design-analyzer | PR review specialists |
| **plugin-dev** | agent-creator, plugin-validator, skill-reviewer | Plugin/skill development |
| **hookify** | conversation-analyzer | Hook from frustrations |
| **statusline-setup** | (config) | Statusline configuration |
| **vercel** | ai-architect, deployment-expert, performance-optimizer | Vercel-specific specialists |
| **application-performance** | frontend-developer, observability-engineer, performance-engineer | Frontend/backend perf |
| **backend-development** | backend-architect, event-sourcing-architect, graphql-architect, performance-engineer, security-auditor, tdd-orchestrator, temporal-python-pro, test-automator | Backend specialists |
| **full-stack-orchestration** | deployment-engineer, performance-engineer, security-auditor, test-automator | Full-stack ops |
| **feature-dev** | code-architect, code-explorer, code-reviewer | Feature development chain |
| **agent-teams** | team-debugger, team-implementer, team-lead, team-reviewer | Multi-agent team patterns |
| **bio-research** | biorxiv, c-trials, chembl | (NOT applicable ELAB) |
| **context7** | query-docs, resolve-library-id | Library docs fetch |

### §2.3 MCP server connectors (deferred via ToolSearch)

Available MCPs surface via system context iter 30 (~67 deferred tools):

#### Browser + Desktop control

| MCP | Tools count | Use case ELAB |
|---|---|---|
| **Claude in Chrome** | ~30 (browser_batch, computer, navigate, find, form_input, find/get_page_text, javascript_tool, list_browsers, read_console, read_network, read_page, resize_window, screenshot, switch_browser, tabs_close/context/create, upload_image) | Andrea browser control + Mac Mini simulator (deferred Mac Mini side) |
| **Control Chrome** | close_tab, execute_javascript, get_current_tab, get_page_content, go_back/forward, list_tabs, open_url, reload_tab, switch_to_tab | MacBook Andrea browser quick-control alternative |
| **computer-use** (mcp__computer-use__*) | request_access, screenshot, click, type, key, scroll, drag, hold_key, wait, list_granted_applications, computer_batch, teach_step, teach_batch | macOS desktop control MacBook |
| **Macos** (mcp__Macos__*) | App, Click, Move, Scrape, Scroll, Shell, Shortcut, Snapshot, Type, Wait | macOS UI automation alternative |
| **Control your Mac** (osascript) | osascript | AppleScript execution Mac Mini SSH |

#### Development + Cloud

| MCP | Tools | Use case ELAB |
|---|---|---|
| **Supabase** | authenticate, complete-authentication | Supabase project management |
| **Vercel** | deploy_to_vercel, get_deployment, get_deployment_build_logs, get_runtime_logs, get_project, list_deployments, list_projects, list_teams, search_vercel_documentation, web_fetch_vercel_url | Vercel deploy + monitoring |
| **Cloudflare** | accounts_list, d1_databases, hyperdrive, kv_namespaces, r2_buckets, search_cloudflare_documentation, set_active_account, workers_list, workers_get_worker_code | CF Workers AI + edge config |
| **Sentry** | authenticate | Error monitoring (potential) |
| **PostHog** | authenticate | Analytics (potential) |
| **Stripe** | authenticate | Payment (Sprint U+ scale) |
| **GitHub** | authenticate | Git platform integration |
| **GitLab** | authenticate | Alternative git (NOT used ELAB) |

#### AI services

| MCP | Tools | Use case ELAB |
|---|---|---|
| **Galileo** | galileo_chat, galileo_health, galileo_diagnose, galileo_memory, galileo_batch_test, galileo_hints | Galileo AI testing (NOT confused con Brain V13 deprecated) |
| **ToolUniverse** | execute_tool, find_tools, get_tool_info, grep_tools, list_tools | Generic tool universe |
| **mcp-registry** | list_connectors, search_mcp_registry, suggest_connectors | Discovery NEW MCPs |
| **biorxiv / chembl / c-trials** | research APIs | NOT applicable ELAB |

#### Productivity

| MCP | Tools | Use case ELAB |
|---|---|---|
| **Notion** | notion-search, notion-fetch, notion-create-pages, notion-update-page, notion-create-comment, notion-get-users, notion-get-teams, notion-duplicate-page, notion-move-pages, notion-create-database, notion-update-data-source, notion-create-view, notion-update-view, notion-get-comments | Tea documentation legacy + shared workspace |
| **Linear** | get_issue, list_issues, list_projects, list_teams, list_milestones, list_documents, save_issue, save_milestone, save_document, list_comments, save_comment, search_documentation, list_users | Issue tracking (NOT primary ELAB, GitHub Issues used) |
| **Asana** | authenticate, create_project, create_tasks, get_tasks, search_tasks, update_tasks, get_users, search_objects, get_attachments, etc. | Project mgmt alternative |
| **Fireflies** | fireflies_search, fireflies_get_transcript, fireflies_get_summary, fireflies_get_user, fireflies_get_analytics | Meeting transcripts (NOT used ELAB iter 30) |
| **Asana / Canva** | search/create/etc | Design + project tools |
| **Figma** | get_design_context, get_metadata, get_screenshot, get_variable_defs, create_design_system_rules, add/get_code_connect_map, send_code_connect_mappings, generate_diagram, search_design_system, upload_assets, get_libraries, whoami | Tea mockup workflow + design system |
| **Canva** | get-design, generate-design, generate-design-structured, perform-editing-operations, export-design, list-folder-items, search-designs, comment-on-design, etc. | Tea visual content (alternative Figma) |

#### Browser preview Claude

| MCP | Tools | Use case ELAB |
|---|---|---|
| **Claude Preview** | preview_start, preview_stop, preview_list, preview_eval, preview_screenshot, preview_snapshot, preview_logs, preview_console_logs, preview_network, preview_resize, preview_inspect, preview_click, preview_fill | Frontend dev verify + UI testing inline |

#### Mermaid + diagrams

| MCP | Tools | Use case ELAB |
|---|---|---|
| **Mermaid renderer** | validate_and_render_mermaid_diagram | Architecture diagrams docs |

#### Acrobat + PDF

| MCP | Tools | Use case ELAB |
|---|---|---|
| **acrobat** | doc_open/save/close/append/merge/split, page_extract/insert/delete/rotate, text_extract/find, ocr_run, form_fill/get/list, annot_*, attachment_*, bookmark_*, etc. | Davide volumes PDF processing + RAG ingest |
| **pdf-viewer** | display_pdf, interact, list_pdfs | View Davide volumi cartacei |

#### Apollo / Sales tools (NOT applicable ELAB iter 30)

apollo, common-room, hubspot, klaviyo, ahrefs, similarweb, supermetrics, close, clay, zoominfo — defer Sprint U+ marketing scale.

#### Customer support

guru, hubspot — defer Sprint U+ scale.

#### Data + Analytics

bigquery, definite, hex, amplitude — defer Sprint U+ scale.

### §2.4 Custom skills ELAB-specific

Existing in `~/.claude/skills/`:

| Skill | Purpose |
|---|---|
| **elab-benchmark** | Benchmark scoring 10-metric weighted |
| **elab-competitor-analyzer** | Competitor analysis (Tinkercad, Wokwi, LabsLand) |
| **elab-harness-real-runner** | E2E harness Playwright runner |
| **elab-macmini-controller** | Mac Mini SSH automation |
| **elab-principio-zero-validator** | PRINCIPIO ZERO §1 runtime check (extend iter 31) |
| **elab-runpod-orchestrator** | RunPod GPU on/off (Path A decommissioned iter 5 P3) |
| **elab-session-orchestrator** | Multi-iter session orchestration |
| **galileo-brain-dataset-factory** | Brain V13 training (deprecated, replaced Mistral) |
| (loose md files) breadboard-hole-test, parent-child-test, simulator-antigravity-test, wire-visual-test, automa-manager | Misc test utilities |

NEW iter 31 (Phase 1):
- **elab-morfismo-validator** (NEW) — Sense 1+1.5+2 measure
- **elab-onniscenza-measure** (NEW) — 7-layer + classifier + RAG + recall@5
- **elab-velocita-latenze-tracker** (NEW) — p50/p95/p99 + cold start + 4G LIM realistic
- **elab-onnipotenza-coverage** (NEW) — L0/L1/L2/L3 + INTENT + canary

### §2.5 Subagent specialists (~30+)

| Agent | Purpose ELAB |
|---|---|
| **agent-orchestration:context-manager** | Multi-agent context |
| **application-performance:frontend-developer** | React 19 component dev |
| **application-performance:observability-engineer** | Monitoring + SLI/SLO |
| **application-performance:performance-engineer** | OpenTelemetry + caching |
| **backend-development:backend-architect** | API design + microservices |
| **backend-development:event-sourcing-architect** | Event sourcing patterns |
| **backend-development:graphql-architect** | GraphQL (NOT used ELAB REST primary) |
| **backend-development:performance-engineer** | Backend perf tuning |
| **backend-development:security-auditor** | OWASP + auth flaws |
| **backend-development:tdd-orchestrator** | TDD enforcement |
| **backend-development:test-automator** | Test suite creation |
| **debugging-toolkit:debugger** | Errors + test failures |
| **debugging-toolkit:dx-optimizer** | Tooling + workflow |
| **distributed-debugging:devops-troubleshooter** | Production incident |
| **distributed-debugging:error-detective** | Log analysis |
| **feature-dev:code-architect** | Feature blueprint |
| **feature-dev:code-explorer** | Codebase analysis |
| **feature-dev:code-reviewer** | High-priority bugs only |
| **full-stack-orchestration:deployment-engineer** | CI/CD + GitOps |
| **full-stack-orchestration:security-auditor** | DevSecOps + GDPR/SOC2 |
| **full-stack-orchestration:test-automator** | AI-powered tests |
| **pr-review-toolkit:code-reviewer** | Project guidelines review |
| **pr-review-toolkit:code-simplifier** | Code simplification |
| **pr-review-toolkit:comment-analyzer** | Documentation comments |
| **pr-review-toolkit:pr-test-analyzer** | Test coverage thoroughness |
| **pr-review-toolkit:silent-failure-hunter** | Catch silent error swallow |
| **pr-review-toolkit:type-design-analyzer** | Type design quality |
| **plugin-dev:agent-creator** | Create new agents |
| **plugin-dev:plugin-validator** | Plugin structure check |
| **plugin-dev:skill-reviewer** | Skill quality review |
| **superpowers:code-reviewer** | Major step review |
| **vercel:ai-architect** | AI patterns Vercel |
| **vercel:deployment-expert** | Vercel deployment |
| **vercel:performance-optimizer** | Vercel perf |
| **agent-teams:team-lead** | Team orchestration |
| **agent-teams:team-implementer** | Parallel implementation |
| **agent-teams:team-debugger** | Hypothesis investigation |
| **agent-teams:team-reviewer** | Multi-dimensional review |

---

## §3. Mac Mini tools inventory

### §3.1 Hardware + OS

- **Hardware**: Mac Mini M4 16GB always-on Strambino
- **OS**: macOS (verify version)
- **Network**: Tailscale (UDP works post-reboot iter 41+) + Ethernet local

### §3.2 SSH access

- **Public IP**: `100.124.198.59` (Tailscale)
- **Hostname**: `progettibelli@strambino.local` (mDNS unreachable post-reboot, IP fallback)
- **Auth**: `~/.ssh/id_ed25519_elab` MacBook side → `authorized_keys` Mac Mini side
- **Mac Mini → GitHub**: deploy key `id_ed25519_github_audit` NOT yet generated (iter 31+ atom 3.1.6)

### §3.3 Software stack

- **Node**: 22.13.1 direct tar download (no brew, no sudo)
- **Playwright**: headless Chromium installed iter 29
- **No brew**: explicit choice (avoid sudo)
- **cron**: `*/10 * * * *` NOT yet activated (iter 31+ atom 3.1.7 post Decisione #1 ratify)

### §3.4 ELAB scripts

- `~/elab-builder-audit/` git checkout
- `tests/e2e/mac-mini-audit-experiment.spec.js` ~180 LOC iter 29
- `playwright.mac-mini-audit.config.js` Mac Mini side
- `tests/e2e/mac-mini-persona-professore-inesperto.spec.js` (NEW iter 31 Phase 3)
- `scripts/mac-mini-audit-experiment.sh` wrapper (NEW iter 31 atom 3.1.5)
- `scripts/mac-mini-rotate-next-exp.sh` state rotation (NEW iter 31)
- `scripts/mac-mini-aggregate-dashboard.sh` HTML dashboard (NEW iter 31)
- `scripts/mac-mini-audit-commit.sh` auto-commit + push (NEW iter 31)

### §3.5 Mac Mini USER-SIM CURRICULUM iter 36 LIVE

- L1 5min cycle (persona p1-docente-primaria, 5/5 PASS)
- L2 30min cycle (3 cycles)
- L3 2h cycle (0 cycles, gating)
- Aggregator 15min cycle (5 commits)
- Pattern: branch `mac-mini/iter36-user-sim-lN-YYYYMMDDTHHmm00Z`

### §3.6 Mac Mini Claude Code (potential)

Mac Mini può runnare Claude Code locally se Claude desktop installed:
- Stessa Claude API key shared MacBook
- Stessa Claude-mem data
- Stessa custom skills (sync via dotfiles repo)
- Defer iter 31+ se Mac Mini autonomous loop dies (currently SSH-driven from MacBook)

---

## §4. External services connectors

### §4.1 Supabase project `euqpdueopmlllqjmqnyb`

- **URL**: `https://euqpdueopmlllqjmqnyb.supabase.co`
- **Edge Functions**: unlim-chat v72, unlim-tts v39, unlim-stt v23, unlim-vision v18, unlim-imagegen v18
- **Tables**: 8 core tables (sessions, students, classes, lessons, lesson_contexts, nudges, rag_chunks, openclaw_tool_memory, together_audit_log)
- **Migrations**: 4/4 SYNC iter 7 close + 2 NEW iter 38 carryover (warmup_cron + rag_chunks_metadata_backfill)
- **Auth**: ANON key + SERVICE_ROLE key + class_key localStorage pattern
- **CLI**: `SUPABASE_ACCESS_TOKEN=sbp_... npx supabase functions deploy --project-ref euqpdueopmlllqjmqnyb`

### §4.2 Vercel project `elab-tutor`

- **Production URL**: `https://www.elabtutor.school`
- **Branch deploy**: `e2e-bypass-preview` auto-preview
- **Env vars**: ELAB_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY (3 envs prod/preview/dev)
- **Deploy command**: `npm run build && npx vercel --prod --yes` OR auto via GitHub Actions

### §4.3 Cloudflare Workers AI

- **API token**: hardcoded `account_id 31b0f72e...`
- **Models active**: FLUX.1-schnell (imagegen) + Whisper Turbo (STT) + MeloTTS (alt TTS) + BGE-M3 (embed alt)
- **Edge EU**: Frankfurt + Amsterdam + Paris + Dublin

### §4.4 Mistral La Plateforme (PRIMARY post iter 26)

- **Endpoint**: `https://api.mistral.ai/v1/chat/completions`
- **Models**: mistral-small-latest + mistral-large-latest + mistral-embed (1024-dim) + Voxtral mini-tts-2603 (TTS clone Andrea) + Pixtral 12B (Vision Italian K-12)
- **Routing**: 65/25/10 LIVE prod (84% Mistral hit verified 25 calls iter 26+)
- **GDPR**: EU FR clean residency
- **Voice clone**: `voice_id 9234f1b6-766a-485f-acc4-e2cf6dc42327` Andrea Italiano LIVE iter 31
- **Tier**: Mistral Scale €18/mese attivato iter 31

### §4.5 Voyage AI (PARTIAL — pivot)

- **Original use**: embed 1024-dim RAG chunks ingestion
- **Issue**: page=0% blocker iter 38+ (ingest gap pipeline didn't store metadata.page)
- **Pivot iter 39**: Mistral mistral-embed re-ingest via `scripts/rag-ingest-mistral-batch-v2.mjs` 718 chunks 0 errors $0.018

### §4.6 Together AI (Gated fallback)

- **Use**: ADR-010 batch_ingest + teacher_context + emergency_anonymized
- **Block**: student runtime SEMPRE bloccato per GDPR minori
- **Audit log**: `together_audit_log` table per call
- **Token**: TOGETHER_API_KEY (set ~/.zshrc + Supabase secrets iter 29)

### §4.7 GitHub

- **Repo**: `e2e-bypass-preview` branch primary iter 30
- **Branch protection**: main protected (NO direct push)
- **CI**: GitHub Actions (potential, NOT explicit verified iter 30)
- **Issue tracker**: GitHub Issues primary (NOT Linear)
- **Mobile**: GitHub Mobile per Andrea branch updates visibility

### §4.8 N8n Hostinger compiler

- **URL**: `https://n8n.srv1022317.hstgr.cloud/compile`
- **Use**: Arduino C++ → HEX → AVRBridge upload
- **Status**: OK iter 30

### §4.9 Brain V13 VPS (DEPRECATED)

- **URL**: `http://72.60.129.50:11434` (provider 72.60.129.50)
- **Model**: Qwen3.5-2B Q5_K_M
- **Status**: ALIVE ma DEPRECATED (Gemini Flash-Lite più capace + economico)
- **NOT in critical path** iter 30

### §4.10 Edge TTS VPS (DOWN)

- **URL**: `http://72.60.129.50:8880` (provider 72.60.129.50)
- **Status**: ❌ DOWN (verify 26/04 timeout 5s, HTTP 000)
- **Decommissioning candidate** se Coqui RunPod copre TTS prod (Path A pod TERMINATED iter 5 P3)

### §4.11 Other services

- **Notion**: Tea documentation legacy
- **Figma** (potential): mockup Cronologia + Glossario
- **Sentry** (potential): error monitoring
- **PostHog** (potential): analytics

---

## §5. Skill creator recommendation iter 31

For 4 NEW skills creation, use:

```
Skill: superpowers:skill-creator
```

Pattern reference:
- `~/.claude/skills/elab-principio-zero-validator/SKILL.md` (existing template)
- `superpowers:writing-skills` patterns

Frontmatter required:
```yaml
---
name: <skill-name>
description: <when to use this skill>
---
```

Body structure:
- §1 Definition (link CLAUDE.md "DUE PAROLE D'ORDINE")
- §2 Measurement gates (numbered G1-GN)
- §3 Bash commands embedded
- §4 Output format (table + summary)
- §5 CoV mandate
- §6 Cross-link

---

## §6. MCP control flow MacBook + Mac Mini

### §6.1 MacBook control flow

```
User Andrea
   ↓
Claude Code CLI MacBook
   ↓
Skill / Agent / MCP tools
   ↓
Application targets:
   - Browser (Chrome/Safari) via Control Chrome MCP / claude-in-chrome
   - macOS apps (Finder/Calendar/Notion) via computer-use MCP
   - SSH Mac Mini via Bash tool
   - Supabase / Vercel / GitHub via Bash + dedicated MCPs
```

### §6.2 Mac Mini control flow

```
Cron `*/10 * * * *` Mac Mini
   ↓
wrapper script `mac-mini-audit-experiment.sh`
   ↓
Playwright headless Chromium
   ↓
Production https://www.elabtutor.school
   ↓
__ELAB_API.unlim.* + Edge Function calls
   ↓
Output JSON + screenshots → docs/audits/auto-mac-mini/
   ↓
Auto-commit + push GitHub origin
   ↓
Andrea verify GitHub mobile branch updates
```

### §6.3 Cross-host coordination

- **Mac Mini → MacBook**: git pull every cycle (sync NEW commits)
- **MacBook → Mac Mini**: SSH push commands (deploy script updates)
- **Both → GitHub**: pull/push origin shared remote
- **Both → Supabase Edge Functions**: deploy via CLI (only Andrea MacBook authorized)

---

## §7. Recommended tools NEW iter 31+

### §7.1 Setup priority HIGH

1. **GitHub deploy key Mac Mini** — atom 3.1.6 master plan (~30min)
2. **Mac Mini cron `*/10 * * * *` activation** — atom 3.1.7 master plan (~30min post atoms 1-6)
3. **Skill creator 4 NEW skills** — Phase 1 master plan (~4h)
4. **Aggregator HTML dashboard GitHub Pages** — Phase 3 master plan (~3h)

### §7.2 Setup priority MEDIUM iter 32+

5. **Sentry integration** — error monitoring prod
6. **PostHog analytics** — usage tracking docente metrics
7. **Figma integration Tea workflow** — Cronologia + Glossario mockup
8. **Notion shared workspace ELAB Tutor** — Tea documentation
9. **Linear issue tracker** (alternative GitHub Issues) — Sprint U+ scale

### §7.3 Setup priority LOW iter 33+

10. **Stripe** — Sprint U+ payment flow scuole
11. **Galileo MCP testing** — alternative bench tool
12. **Hubspot CRM** — Sprint U+ commercial pipeline
13. **Mailchimp / Klaviyo** — newsletter scuole

---

## §8. Tools NOT applicable ELAB

- bigquery / hex / amplitude — analytics scale Sprint U++
- bio-research (biorxiv / chembl / c-trials) — wrong domain
- gitlab — GitHub primary
- apollo / clay / zoominfo — sales scale Sprint V+
- ToolUniverse — generic, ELAB-specific skills better
- mcp-registry — discovery only

---

## §9. Anti-pattern checklist

- ❌ NO claim "MCP server LIVE" senza authenticate + first call success
- ❌ NO claim "skill measured" senza CoV dry-run
- ❌ NO claim "Mac Mini cron LIVE" senza atoms 1-6 fixed + 24h soak
- ❌ NO claim "GitHub deploy key" senza first push success Mac Mini side
- ❌ NO claim "GitHub Pages dashboard" senza Andrea verify mobile
- ❌ NO claim "Tea Figma integration" senza Tea explicit ratify
- ❌ NO claim "Sentry / PostHog LIVE" senza GDPR review (K-12 minori)
- ❌ NO claim "control-chrome works Mac Mini" — applicable solo MacBook (Andrea browser context)
- ❌ NO claim "computer-use LIVE Mac Mini" — Mac Mini headless, NO desktop interaction needed (Playwright covers)

---

## §10. Cross-link

- Master plan iter 31: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
- Mac Mini persona-prof: `docs/handoff/2026-05-02-mac-mini-professore-inesperto-persona-iter-31.md`
- Tea brief: `docs/handoff/2026-05-02-tea-iter-31-brief.md`
- Mac Mini gap analysis: `docs/audits/2026-05-02-iter30-mac-mini-audit-script-gap-analysis.md`
- 13 decisioni priority matrix: `docs/audits/2026-05-02-iter30-andrea-13-decisioni-priority-matrix.md`
- ADR-040 fumetto: `docs/adrs/ADR-040-fumetto-imagegen-provider-decision.md`
- Skill PZ validator existing: `~/.claude/skills/elab-principio-zero-validator/SKILL.md`
- Claude plugins official cache: `~/.claude/plugins/cache/claude-plugins-official/superpowers/5.0.7/skills/`

---

**Status**: PROPOSED iter 31 entrance inventory complete. Tools count ~150 surface (deferred + active + custom). Setup priority HIGH 4 atoms iter 31 entrance + MEDIUM 5 atoms iter 32+ + LOW 4 atoms iter 33+.

**Anti-inflation G45 cap mandate enforced**: NO claim "tool LIVE" senza prod-verify + CoV dry-run.
