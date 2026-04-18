# PDR #2 — OpenClaw Infrastructure (scheletro UNLIM in produzione)

**Target agent**: Claude Opus 4.7 via Managed Agent (Max #1)
**Durata stimata**: 60-80h autonome
**Branch**: `feature/openclaw-infra-v1`
**Dipendenze**: PDR3 VPS RunPod Deploy (endpoint URL disponibili)
**Governance**: `docs/GOVERNANCE.md` regole 0-5 obbligatorie

---

## 🎯 Obiettivo supremo

OpenClaw è il **cervello di UNLIM in produzione**: intercetta richieste da Supabase Edge Function, gestisce memoria persistente cross-session, decide quale modello RunPod chiamare, parla con docenti via Telegram, esegue azioni autonome. NON orchestrator sviluppo.

**Ref**: `CLAUDE.md` + `docs/audits/2026-04-18-cov-principio-zero-v3.md` + feedback Andrea "openclaw scheletro UNLIM, parte infrastruttura ELAB Tutor".

---

## ⚖️ Regola 0 applicata — riuso esistente

**Codice esistente da riusare/potenziare**:
- `src/services/unlimMemory.js` → estendi per multi-livello class/teacher/school
- `src/services/unlimProactivity.js` → collegati con OpenClaw proactive logic
- `supabase/functions/_shared/memory.ts` → pattern memoria Supabase da portare in OpenClaw
- `supabase/functions/_shared/rag.ts` → pattern retrieval da portare in OpenClaw
- `supabase/functions/unlim-chat/index.ts` → questo diventa il **bridge** che chiama OpenClaw
- `src/data/rag-chunks.json` (549 chunk) → **RIUSA**, espandi a 5000+

**Nuovo (perché OpenClaw è componente separato self-hosted)**:
- Container Docker OpenClaw su Hetzner CX52 dedicato
- API HTTP tra Supabase Edge Function e OpenClaw
- Neo4j embedded per knowledge graph
- Telegram bot ufficiale ELAB (per docenti)

---

## 📋 Task suddivisi (8 macro-task)

### Task 2.1 — Provisioning Hetzner CX52

**Obiettivo**: VPS dedicato Germania GDPR compliant 16GB RAM.

**Action**:
- Account Hetzner (via hetzner.cloud) — Andrea autorizza, OpenClaw provisioning script
- Server: CX52 (€32/mese, 16GB RAM, 8 vCPU, 320GB SSD, Germania Falkenstein)
- OS: Ubuntu 24.04 LTS
- SSH: solo key-based, port custom (non 22)
- User: `openclaw` non-privileged, sudo solo per specific commands
- UFW firewall: allow 443 (HTTPS), 22-custom (SSH da IP Andrea only), deny all else
- Fail2ban + CrowdSec
- Unattended upgrades per security patch

**Deliverable**:
- `docs/infra/hetzner-cx52-setup.md` con procedure + firewall rules
- Ansible playbook `infrastructure/hetzner/provision.yml` per reproducibilità
- Secret storage in GitHub Actions secrets (non in repo)

**Exit criteria**:
- [ ] VPS up, pingable
- [ ] SSH key auth only (password fail)
- [ ] UFW deny default, allow whitelist
- [ ] Fail2ban attivo
- [ ] CIS benchmark score > 80%
- [ ] `nmap` scan: solo porta 443 + SSH custom expost

### Task 2.2 — Docker rootless + network config

**Obiettivo**: container isolation per OpenClaw senza privilegi root.

**Action**:
- Install Docker rootless mode (user `openclaw`)
- Docker network `unlim-internal` bridge
- Docker Compose file `docker-compose.yml` con OpenClaw + Neo4j + Prometheus + Grafana

**Deliverable**:
- `infrastructure/hetzner/docker-compose.yml`
- `docs/infra/docker-setup.md`

**Exit criteria**:
- [ ] `docker info` senza errori da user `openclaw`
- [ ] Container isolati, no host-network
- [ ] Volumes montati con restricted permissions

### Task 2.3 — Deploy OpenClaw container hardened

**Obiettivo**: OpenClaw istance sicura (138 CVE mitigation).

**Action**:
- Pull image OpenClaw latest (verificare SHA signed)
- Config `config.toml`:
  - No anonymous access
  - API key richiesta (stored in Supabase Vault)
  - Rate limit 60 req/min
  - Log level INFO, no debug in prod
  - CORS restricted a Supabase Edge Function + elabtutor.school
- Integration Telegram bot `@ElabUnlimBot` (BotFather token)
- Webhook callback per Supabase (action execution)

**Deliverable**:
- `openclaw/config.toml` (template, senza secret)
- `openclaw/Dockerfile.hardened` (multi-stage build, minimal)
- `docs/infra/openclaw-security.md` con checklist 138 CVE

**Exit criteria**:
- [ ] OpenClaw responde a `/health` endpoint
- [ ] Penetration test base (sqlmap, nikto) zero findings critici
- [ ] Weekly auto-update image attivo
- [ ] Audit log su Supabase `openclaw_audit` table

### Task 2.4 — API bridge Edge Function ↔ OpenClaw

**Obiettivo**: quando Supabase Edge Function riceve chat da frontend, inoltra a OpenClaw che decide/orchestra.

**Action**:
- **MODIFY** `supabase/functions/unlim-chat/index.ts`:
  - Invece di chiamare Gemini direttamente, chiama OpenClaw `/unlim/chat` endpoint
  - Passa message + sessionId + experimentId + circuitState + context collector output
  - Riceve risposta UNLIM + action tags
  - Forward audio TTS generato da OpenClaw → RunPod F5-TTS
- OpenClaw decide quale LLM RunPod endpoint chiamare (Llama 70B primary, Qwen small fast, vision se image)
- OpenClaw fallback chain: RunPod → Brain V13 VPS → degraded mode

**Deliverable**:
- Edge Function aggiornata
- `openclaw/api_router.py` (logic routing)
- `docs/architecture/edge-openclaw-bridge.md`

**Exit criteria**:
- [ ] 100 chat test end-to-end via Edge → OpenClaw → RunPod
- [ ] Latency p50 < 2s
- [ ] Fallback test: kill RunPod → Brain V13 risponde < 30s switchover
- [ ] Test live da elabtutor.school: risposta Principio Zero v3 preservata

### Task 2.5 — Memoria multi-livello (4 tabelle Supabase)

**Obiettivo**: UNLIM ricorda la classe, il docente, la scuola cross-session.

**Action**:
- **MODIFY** `supabase/functions/_shared/memory.ts`: aggiungi 3 funzioni per livelli
- **NEW Supabase tables** (migration SQL):
  - `student_memory` (GIÀ ESISTE) — riusa
  - `class_memory` (pattern classe: errori frequenti, concetti masterati)
  - `teacher_preferences` (stile docente, lingua preferita, ritmo)
  - `school_context` (nome scuola, regione, indirizzo; privacy-safe)
- OpenClaw carica tutti 4 livelli pre-prompt
- Prompt injection: include riassunto memoria long-term nel system prompt

**Deliverable**:
- `supabase/migrations/2026-04-18-memory-multilevel.sql`
- `supabase/functions/_shared/memory.ts` aggiornato
- `openclaw/memory_loader.py`
- `docs/features/unlim-memory-multilevel.md`

**Exit criteria**:
- [ ] 4 tabelle create con RLS policies
- [ ] Test cross-session: "Ti ricordi quando 3 giorni fa..." funziona
- [ ] GDPR: right-to-delete cancella da tutti 4 livelli

### Task 2.6 — Neo4j Knowledge Graph (onniscienza concetti)

**Obiettivo**: grafo concetti elettronica con prerequisites + correlations.

**Action**:
- Deploy Neo4j Community in docker-compose (su Hetzner CX52)
- Script `openclaw/kg_seed.py`: carica 200+ concetti da volumi ELAB (LED, resistore, corrente, tensione, PWM, ADC, etc.)
- Edge: `PREREQUISITE_OF`, `RELATED_TO`, `APPEARS_IN_EXP`, `TAUGHT_IN_CHAPTER`
- OpenClaw query KG pre-prompt per scaffolding: se studente chiede "PWM" e non ha visto "corrente" → UNLIM ripassa corrente prima

**Deliverable**:
- `infrastructure/hetzner/neo4j-compose.yml`
- `openclaw/kg_seed.py` + cypher queries
- `docs/features/knowledge-graph.md`

**Exit criteria**:
- [ ] 200+ nodi + 500+ edges caricati
- [ ] Query test 10 prerequisites traversal < 100ms
- [ ] UNLIM prompt include "prerequisiti: X, Y" quando rilevante

### Task 2.7 — Telegram bot docenti + comandi

**Obiettivo**: docente può chiedere a UNLIM via Telegram stato classe, report, nudge.

**Action**:
- Bot `@ElabUnlimBot` (BotFather)
- Comandi:
  - `/classe <codice>` → stato classe corrente
  - `/report <classe>` → PDF ultima sessione
  - `/nudge <studente>` → invia nudge motivazionale
  - `/lingua <it/en/fr/de/es/ar/zh>` → cambia lingua classe
  - `/pausa <classe>` → ferma UNLIM per quella classe (break)
  - `/report settimanale` → aggregato
- Auth: docente si lega a OpenClaw via code pairing one-time

**Deliverable**:
- `openclaw/telegram_bot.py`
- `docs/features/telegram-teachers.md`

**Exit criteria**:
- [ ] 6 comandi test verdi
- [ ] Auth secure (no abuse da ragazzi)
- [ ] Rate limit per user

### Task 2.8 — Monitoring Prometheus + Grafana + alerting

**Obiettivo**: observability completa infra UNLIM.

**Action**:
- Prometheus scrape OpenClaw + RunPod endpoints + Supabase Edge + Neo4j
- Grafana Cloud Free dashboards (5 dashboard: uptime, latency, cost, errors, usage)
- Alert rules:
  - Latency p95 > 5s → Telegram alert
  - Error rate > 1% → Telegram alert
  - RunPod cost > €50/gg → Telegram alert + auto-throttle
  - OpenClaw down → Telegram alert + attempt auto-restart
- Sentry per errors frontend + backend

**Deliverable**:
- `infrastructure/monitoring/prometheus.yml`
- `infrastructure/monitoring/grafana-dashboards/`
- `docs/observability/setup-complete.md`

**Exit criteria**:
- [ ] 5 dashboard attive con dati reali
- [ ] 4 alert rules test verified (trigger manuale)
- [ ] Sentry riceve events

---

## 🔬 Gate finale PDR #2

- [ ] OpenClaw VPS Hetzner CX52 up, hardened, GDPR
- [ ] 8 task completati con pattern 8-step
- [ ] Edge Function bridge funziona end-to-end
- [ ] Memoria multi-livello test verdi
- [ ] KG Neo4j operativo
- [ ] Telegram bot `@ElabUnlimBot` live
- [ ] Monitoring attivo 24/7
- [ ] Zero regressione baseline 12056
- [ ] Auditor APPROVE
- [ ] Documentation completa `docs/infra/` + `docs/features/` + `docs/observability/`

## 🚨 Rischi PDR #2

| Rischio | Probabilità | Mitigation |
|---------|-------------|------------|
| OpenClaw CVE zero-day | Bassa | Auto-update weekly + Prometheus anomaly detection |
| Hetzner CX52 waitlist | Media | Alternative Hyperstack / Scaleway FR / Nebius |
| Telegram bot abuse da studenti | Media | Auth docente + rate limit per chat_id |
| Neo4j memory footprint | Bassa | Neo4j Community gira in <2GB RAM, CX52 16GB margine |
| Migration memoria esistente → multi-livello | Alta | Backward compatibility layer 30gg |

---

**Governance compliance**: rispetta `docs/GOVERNANCE.md` Regola 0 + 5 regole ferree.
