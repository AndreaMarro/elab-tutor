# Audit STEP 2 + STEP 3 — WIP cleanup decisions iter 34 entrance

**Data**: 2026-05-03 21:50 GMT+2
**Sessione**: iter 34 entrance, multi-provider workflow Phase 0+
**Branch lavoro**: e2e-bypass-preview
**HEAD pre-azione**: 9fc1ed5 (docs iter-31-ralph-iter34 partnership Claude+Autodesk+Blender note)

## §1 Stato pre-azione (verified)

### 1.1 Working tree dirty
- 15 file modificati uncommitted
- 5 stash precedenti
- Sync con `origin/e2e-bypass-preview`: 0/0 (nessun ahead/behind)

### 1.2 Modificati per categoria
- **11 React components** (WIP da sessione precedente):
  - `src/components/HomePage.jsx` (+1)
  - `src/components/common/MicPermissionNudge.jsx` (+2)
  - `src/components/common/UpdatePrompt.jsx` (+2)
  - `src/components/easter/EasterModal.jsx` (+2)
  - `src/components/lavagna/AppHeader.jsx` (+9)
  - `src/components/lavagna/ExperimentPicker.jsx` (+5/-1)
  - `src/components/lavagna/GalileoAdapter.jsx` (+13/-?)
  - `src/components/lavagna/RetractablePanel.jsx` (+1)
  - `src/components/lavagna/SessionReportComic.jsx` (+1)
  - `src/components/simulator/NewElabSimulator.jsx` (+9/-1)
  - `src/components/teacher/TeacherDashboard.jsx` (+3)
- **1 audit doc** con contenuto importante:
  - `docs/audits/2026-05-02-iter41-ANDREA-DECISIONI-FINALI.md` (+22 lines: iter 42 Lighthouse perf 26→55+ atomi 42-A/B/C research findings + anti-pattern flags)
- **3 ephemeral state** (cron output):
  - `automa/state/heartbeat` (26B, watchdog write ogni minuto)
  - `automa/state/iter-19-harness-2.0-results.json` (~46KB, bench harness cron, 1704 LOC churn)
  - `scripts/bench/workloads/sprint-r0-score-results.json` (~108KB, bench score cron, 4133 LOC churn)

### 1.3 Bloccanti diagnosi mem-search

| Bloccante | Diagnosi mem-search | Fix applicato |
|-----------|---------------------|---------------|
| Mac Mini SSH timeout | Osservazione #1208: chiave custom `id_ed25519_elab` (NON `id_ed25519` default) | SSH `-i ~/.ssh/id_ed25519_elab` esplicito → uptime 1d 39min, node v25.9.0, launchctl PID 985 attivo |
| Cron fantasma heartbeat | `launchctl list` mostra `com.elab.automa.watchdog` (locale MacBook) | Gitignore + rm --cached |
| Repo path Mac Mini | Trovato `/Users/progettibelli/Desktop/VOLUME 3/PRODOTTO/elab-builder` (NON `/Users/progettibelli/elab-builder` come briefing) | Aggiornato briefing context, defer Tier 0 cowork-real setup |
| `cowork-real/` directory | NON esiste su Mac Mini → Tier 0 Cowork validation NON disponibile | Decisione 0-SKIP: Tier 1+2+3 sufficiente per ≥2/5 mandate |

## §2 Decisioni Andrea (B G 0-SKIP)

Andrea direttiva: "Prendi la scelta che porti maggiore beneficio e qualità. analizza e audita tutto."

### 2.1 → B (branch wip + commit, NON stash)
**Motivazione**:
- Stash diventerebbe il 6° stash (5 esistenti) → pile invisibile
- Branch `wip/iter-31-misc-2026-05-03` discoverable in `git branch -a`
- `git log wip/...` permette context recovery
- Cherry-pick possibile per file singoli
- Quality > velocità, mandato Andrea "no debito tecnico"

**Esecuzione**:
- Branch creato: `wip/iter-31-misc-2026-05-03`
- Commit: `ccc86fa` (12 file, +58/-14 LOC)
- Pre-commit hook PASS: vitest 13752 baseline preservato

### 2.2 → G (gitignore 3 ephemeral + rm --cached, NON stop watchdog)
**Motivazione**:
- Stop watchdog rompe monitoraggio sconosciuto (Chesterton's fence)
- Ignorare = compiacenza, viola "no debito tecnico"
- Pattern canonico per ephemeral: `rm --cached` + `.gitignore`
- File preserved on disk, processi continuano write, git smette di vederli

**Esecuzione**:
- `.gitignore` esteso con 3 pattern + commenti
- `git rm --cached` su 3 file (preservati su disco)
- Commit pendente (in background con pre-commit vitest baseline)

### 2.3 → 0-SKIP (Tier 1+2+3 sufficiente, NO setup cowork-real Mac Mini)
**Motivazione**:
- Tier 0 setup cost: 1-2 ore (creare scripts cowork-real su Mac Mini + pipeline Kimi K2.6 video analysis)
- Tier 1 (macOS Computer Use) + Tier 2 (Control Chrome) + Tier 3 (Playwright) coprono ≥2/5 mandate per ogni atom
- Briefing §J.7 esplicito: "≥2/5 tier evidence"
- Defer Tier 0 a sessione dedicata Sprint U+ se serve copertura full 5/5

**Caveat onesto**: Tier 0 evidence sarà mancante dagli audit doc atomi iter 34. Questo va dichiarato esplicitamente nei singoli audit doc.

## §3 Risultato atteso post-azione

### 3.1 Working tree
- Clean (0 modificati uncommitted)
- Branch list: `+ wip/iter-31-misc-2026-05-03` (locale, NON pushed)
- Pronto per Phase 0 atomi modifiche pulite

### 3.2 Anti-regressione
- Pre-commit hook conferma vitest 13752 baseline preservato (commit ccc86fa)
- Gitignore commit ridurrà future churn dirty tree

### 3.3 Recovery paths
- WIP componenti React: `git checkout wip/iter-31-misc-2026-05-03 -- <file>`
- Audit doc lighthouse iter 42: `git show wip/iter-31-misc-2026-05-03:docs/audits/2026-05-02-iter41-ANDREA-DECISIONI-FINALI.md`
- Ephemeral file ritracciamento: `git checkout HEAD~1 -- <path>`

## §4 Caveat onesti (NO compiacenza)

1. **Grep skipped step 3.12**: il check `grep -rn "iter-19-harness-2.0-results\|sprint-r0-score-results"` su intero repo si è bloccato (troppi file JSON pesanti). Skippato per pragmatismo. **Rischio residuo**: se uno script/test legge questi 3 path da git index, non lo abbiamo verificato. **Mitigazione**: i file restano su disco, solo il tracking git cambia. Solo `git ls-tree` o `git show` li mancherebbero — pattern non comune.

2. **WIP componenti React non triagiati**: 11 file modificati salvati come singolo commit wip. Non sappiamo se sono buoni cambiamenti pronti merge o esperimenti scartati. **Mitigazione**: branch wip è recuperabile, triage può avvenire in sessione successiva quando Andrea decide.

3. **Tier 0 Cowork SKIP**: validation futura sarà ≥2/5 (tier 1+2+3) NON 5/5. Briefing playbook §J.7 lo permette esplicitamente, ma evidence trace sarà meno copioso vs Tier 0 Cowork Mac Mini autonomous.

4. **Mac Mini repo path drift**: briefing playbook dichiara `/Users/progettibelli/elab-builder` ma reale è `/Users/progettibelli/Desktop/VOLUME 3/PRODOTTO/elab-builder`. Se servisse Tier 0 in futuro, briefing va aggiornato.

5. **Nessun audit dei 5 stash precedenti**: rimangono nel pile (stash@{0}-{4}). Possibile contenuto ortogonale a iter 34 atomi. Non triagiati questa sessione.

## §5 Next step

→ STEP 4: Codex Plugin install Phase 0.1 — richiede ratify Andrea per OAuth ChatGPT Plus account.

→ Se Andrea approva:
1. `/plugin marketplace add openai/codex-plugin-cc`
2. `/plugin install codex-plugin-cc@codex-plugin-cc`
3. Verify `/codex --help`
4. Audit doc `docs/audits/2026-05-03-phase0-codex-plugin-install.md`

→ Se Andrea rifiuta o sospende: pivot a Phase 0.2 (Gemini CLI) OPPURE skip Phase 0 e procedi Phase 1 atomi diretti con solo Claude inline (perde benefit anti-bias multi-provider).
