# ELAB Tutor — Governance del processo di sviluppo

**Versione**: 1.0 — 18/04/2026
**Autore**: Andrea Marro + Claude Opus 4.7
**Scope**: ogni task di sviluppo ELAB Tutor (commit, PR, merge, release)

---

## 🛡 Le 5 regole ferree (embedded in ogni task)

Queste regole sono **non-negoziabili** e sono enforced da GitHub Action `governance-gate.yml`.
Se anche solo UNA delle 5 è violata, la PR è **bloccata** al merge.

### 1. Pre-Audit obbligatorio

Prima di iniziare qualsiasi task:

- `git status` pulito (no modifiche pendenti)
- `npx vitest run` baseline verificato (≥ 12056 test PASS al 18/04/2026)
- Commit SHA registrato in `docs/tasks/TASK-XXX-start.md`
- `npm run build` deve passare prima di toccare codice

### 2. TDD — Test Driven Development obbligatorio

Prima di scrivere codice di implementazione:

- Scrivi il test che **FALLISCE** (vitest unit/integration + Playwright E2E se UI)
- Commit separato: `test(area): fallimento atteso per TASK-XXX`
- Solo dopo il test failing, scrivi l'implementazione
- Commit separato: `feat(area): implementazione TASK-XXX verde`

### 3. CoV — Chain of Verification 3× obbligatoria

Prima di dichiarare "task done":

- Esegui il test critico **3 volte consecutive indipendenti** (`npx vitest run` per 3 volte)
- Risultati in `docs/reports/TASK-XXX-cov.md`:
  - **3/3 pass** → task done ✅
  - **2/3 pass** → flaky, debug obbligatorio (no merge)
  - **1/3 o 0/3** → broken, rifai from scratch
- No eccezioni. Anche se "sembra passare", 3 esecuzioni.

### 4. Audit indipendente (Auditor agent)

Prima del merge:

- L'agent **Auditor** (Managed Agent persistente su Max #2) fa review della PR
- Report in `docs/audits/TASK-XXX-audit.md`
- Verdetto: **APPROVE** | **REQUEST_CHANGES** | **BLOCK**
- Self-review non vale. L'Auditor è indipendente e scettico calibrato.

### 5. Doc-as-code obbligatoria

Nella stessa PR (non dopo):

- `CLAUDE.md` aggiornato se le regole del progetto cambiano
- `docs/features/FEATURE.md` aggiornato se la feature è nuova o cambia
- `CHANGELOG.md` entry con categoria + descrizione + issue/PR
- Se la PR tocca pubblici API, `docs/architecture/API.md` aggiornato

---

## 🔒 GitHub Action Governance Gate

File: `.github/workflows/governance-gate.yml`

Blocca merge se:

- Manca `docs/tasks/TASK-XXX-start.md` (Pre-Audit)
- Manca `test(area)` commit precedente a `feat(area)` commit (TDD)
- Manca `docs/reports/TASK-XXX-cov.md` con 3/3 PASS (CoV)
- Manca `docs/audits/TASK-XXX-audit.md` con verdetto APPROVE (Auditor)
- Manca update a `CLAUDE.md` + `docs/features/` + `CHANGELOG.md` se PR cambia feature (Doc)

Override: **solo Andrea Marro** può bypassare con commit `[GOVERNANCE-OVERRIDE: motivo]` + approvazione esplicita Telegram.

---

## 🔁 Pattern 8-step per ogni task

Ogni task segue questo ciclo, enforced da CI:

```
[1] PRE-AUDIT   → docs/tasks/TASK-XXX-start.md (git sha, baseline count, env)
                  commit: "chore(task): start TASK-XXX"

[2] TDD FAIL    → test fallimento atteso
                  commit: "test(area): TDD fail per TASK-XXX"

[3] IMPLEMENT   → codice minimo per passare test
                  commit: "feat(area): implementa TASK-XXX"

[4] COV 3×      → docs/reports/TASK-XXX-cov.md con 3/3 pass verificato

[5] AUDIT       → docs/audits/TASK-XXX-audit.md con verdetto Auditor
                  (se REJECT → iterate from [3])

[6] DOC         → CLAUDE.md + docs/features/ + CHANGELOG.md
                  commit: "docs(area): aggiorna doc per TASK-XXX"

[7] POST-AUDIT  → verifica: baseline test ≥ pre-task + benchmark ≥ pre-task
                  Report: docs/audits/TASK-XXX-post.md

[8] MERGE       → governance-gate.yml verifica 7 step precedenti
                  Merge main + tag
                  Telegram notify Andrea
```

---

## 📊 Metriche di qualità

**Baseline da preservare/aumentare**:

- `npx vitest run` ≥ 12056 test PASS (18/04/2026)
- `node scripts/benchmark.cjs` score ≥ valore pre-task
- Bundle size ≤ 90000 KB (precache ≤ 5000 KB)
- Playwright smoke ≥ baseline

**Target post PDR-Test-Multiplier**:

- 15660+ test (incluso 3604 non-triviali: Playwright E2E 150, chaos 30, property-based 200, visual regression 80, accessibility 60, performance 20, multilingue 350, contract 40, security 50, integration 100)
- Benchmark score ≥ 8.0/10
- Coverage critici modules ≥ 90%

---

## 🚨 Emergency override (solo Andrea)

In situazioni critiche (bug produzione bloccante, deadline fisica):

```bash
# Da Claude CLI (solo se accesso Max Andrea)
/override-governance TASK-XXX "motivo chiaro"

# Registra in docs/overrides/2026-XX-XX.md
```

Ogni override è loggato su Supabase `governance_overrides` table e notificato su Telegram.
Requisiti: piano di rimedio entro 48h, audit retrospettivo entro 1 settimana.

---

## 📚 Riferimenti

- Andrej Karpathy principles: [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)
- Chain of Verification: metodologia interna ELAB, vedi `docs/coV-methodology.md`
- TDD Red-Green-Refactor: pattern classico Kent Beck
- Self-healing systems AIOps: [Techstrong IT 2026](https://techstrong.it/features/from-aiops-hype-to-reality-building-self-healing-infrastructure-in-2026/)

---

**Firma**: questa governance è parte integrante del contratto di sviluppo ELAB.
Ogni PR che la viola sarà bloccata indipendentemente da urgenza o importanza.
L'unica eccezione è `/override-governance` esplicito di Andrea Marro.

Ultimo update: 18/04/2026
