# Errors log 2026-04

**Project**: ELAB Tutor
**Source**: watchdog-elab

## Entries

### 2026-04-19T03:54:00Z — routines_orchestrator_secret_missing

**Detail**: GitHub Actions workflow "Routines Orchestrator (ELAB Tutor autonomous development)" failing repeatedly because `ANTHROPIC_API_KEY` secret is empty in env. Last 2 runs (24620362784, 24620319361) failed at "Run Claude Code Action" step. Workflow runs every 30 min via `*/30 * * * *` cron — wasting CI minutes + missing autonomous PDR work.

**Pattern hint**: Add `ANTHROPIC_API_KEY` repository secret OR temporarily disable workflow until key restored. Verify with `gh secret list --repo AndreaMarro/elab-tutor`.

**Run**: pre-deploy manual investigation | **Source**: watchdog-elab

---

### 2026-04-19T03:32:00Z — branch_switching_within_cli_session

**Detail**: CLI #1 (PID 31857, claude --permission-mode bypassPermissions --model opus) reflog shows 3 forced branch switches between `feature/vision-e2e-live` ↔ `main` ↔ `feature/watchdog-system` ↔ `feature/watchdog-draft` between 11:32-11:45. CLI #1 reported it as "concurrent autonomous session" but ps aux shows only one claude PID. Likely caused by sub-agent or hook within CLI #1 itself.

**Pattern hint**: When running parallel work, isolate via `git worktree add` instead of branch switching in shared working tree. Document in CLAUDE.md.

**Run**: pre-deploy manual investigation | **Source**: watchdog-elab

---

### 2026-04-19T03:32:00Z — prebuild_signature_noise

**Detail**: 35+ files (CSS modules, simulator engines, services) showed as "modified" in WD without intentional edits. Cause: `scripts/add-signatures.js` prebuild rewrites file headers with today's date, producing diff noise that contaminates `git status` and confuses CoV runs. Documented in postmortem item #8 (`docs/audits/2026-04-19-postmortem-caveman-session.md`).

**Pattern hint**: Either make `add-signatures.js` deterministic (only insert signature once on file create, never rewrite) OR add modified-by-prebuild files to `.gitattributes` with `merge=ours` strategy. CLI #1 worked around via `git stash push -u` before CoV.

**Run**: pre-deploy manual investigation | **Source**: watchdog-elab

### 2026-04-19T04:21:20Z — ci_failure_burst

**Detail**: 10 CI failures in last 2h

**Pattern hint**: Check workflow logs for common root cause (missing secret, dep change)

**Run**: test | **Source**: watchdog-elab

### 2026-04-19T04:21:27Z — ci_failure_burst

**Detail**: 10 CI failures in last 2h

**Pattern hint**: Check workflow logs for common root cause (missing secret, dep change)

**Run**: test | **Source**: watchdog-elab

### 2026-04-19T04:21:34Z — ci_failure_burst

**Detail**: 10 CI failures in last 2h

**Pattern hint**: Check workflow logs for common root cause (missing secret, dep change)

**Run**: test | **Source**: watchdog-elab

---

### 2026-04-19T04:24:00Z — secret_elab_anon_key_missing

**Detail**: GitHub repository secret `ELAB_ANON_KEY` not set. Watchdog Edge Function content + Principio Zero v3 tone check disabled (CORS preflight still works). Verified via `gh secret list -R AndreaMarro/elab-tutor` — only VERCEL_* secrets present.

**Pattern hint**: Andrea adds via `gh secret set ELAB_ANON_KEY -R AndreaMarro/elab-tutor` (paste value in interactive prompt, NEVER in chat). After add, watchdog auto-detects and starts checking content + tone on next `*/15` cron.

**Run**: post-deploy investigation | **Source**: watchdog-elab

---

### 2026-04-19T04:24:00Z — secret_anthropic_api_key_missing_root_cause_confirmed

**Detail**: GitHub repository secret `ANTHROPIC_API_KEY` confirmed not set via `gh secret list`. This is the ROOT CAUSE of the recurring "Routines Orchestrator" workflow failures noted earlier. Each `*/30` cron firing triggers Claude Code Action which immediately fails at OAuth/API key step. CI minutes wasted ~15 min per run × 48 runs/day = 12h compute/day.

**Pattern hint**: Two options:
1. Andrea adds key: `gh secret set ANTHROPIC_API_KEY -R AndreaMarro/elab-tutor`
2. OR temporarily disable workflow: rename `.github/workflows/routines-orchestrator.yml` to `.disabled` or set `if: false` on jobs

Recommend option 2 first (immediate stop of failures), then option 1 when ready to use autonomous PDR runner.

**Run**: post-deploy investigation | **Source**: watchdog-elab

---

### 2026-04-19T04:42:00Z — lightningcss_native_dep_missing_recurring

**Detail**: GitHub Actions Build steps in `governance-gate.yml` and `quality-gate.yml` consistently fail with:
```
Cannot find module '../lightningcss.linux-x64-gnu.node'
Require stack: lightningcss/node/index.js
```
Affects PR #4 (vision-e2e-live) + PR #5 (watchdog-monitor). Both fail same way at Build step, ~200ms after vite starts.

**Pattern hint**: 4th occurrence of this issue (postmortem #5 documented 3 prior failed fixes: Node 20→22, npm rebuild, explicit install). Current workflow does:
```yaml
npm rebuild lightningcss @tailwindcss/oxide 2>/dev/null || true
```
The `2>/dev/null || true` SILENTLY swallows rebuild errors. Need either:
1. Explicit install: `npm install lightningcss-linux-x64-gnu --no-save` before build
2. Use Bun instead of npm in CI (oven-sh/setup-bun used elsewhere — check if works)
3. Pin npm version that handles optional deps correctly

This is a recurring blocker (≥3 PRs affected). Tag `watchdog-pattern`.

**Run**: post-deploy investigation | **Source**: watchdog-elab

---

### 2026-04-19T04:43:00Z — coverage_comment_403_token_permissions

**Detail**: `coverage-comment` job in CI/CD Pipeline workflow fails with `HTTP 403: Resource not accessible by integration` when posting coverage comment to PR #5. Same issue affects PR #4. Endpoint: `POST /repos/AndreaMarro/elab-tutor/issues/5/comments`.

**Pattern hint**: Likely cause: workflow's `permissions:` block missing `pull-requests: write` for fork PRs OR branch-protection ruleset preventing PR comments from GitHub Actions. Check `.github/workflows/test.yml` permissions block. Non-blocking (informational comment, not gate).

**Run**: post-deploy investigation | **Source**: watchdog-elab

### 2026-04-20T02:55:26Z — edge_unlim-hints_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"hints":"Assicurati che il tuo dispositivo sia correttamente collegato e alimentato prima di iniziare. Verifica che tutti i cavi siano inseriti saldamente nelle porte corrette.","sourc

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: test | **Source**: watchdog-elab

### 2026-04-20T02:55:26Z — edge_unlim-diagnose_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"diagnosis":"[ERRORE:highlight:id]: LED senza alimentazione.\n[PERCHÉ:highlight:id]: Un LED richiede una fonte di energia (tensione e corrente) per emettere luce.\n[COME CORREGGI:high

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: test | **Source**: watchdog-elab

### 2026-04-20T02:55:26Z — ci_failure_burst

**Detail**: 7 CI failures in last 2h

**Pattern hint**: Check workflow logs for common root cause (missing secret, dep change)

**Run**: test | **Source**: watchdog-elab

### 2026-04-20T05:29:45Z — edge_unlim-hints_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"hints":"Assicurati che tutti i componenti siano collegati correttamente prima di iniziare. Controlla che la corrente sia attiva e che i LED si accendano come previsto.","source":"flas

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T05:29:45Z — edge_unlim-diagnose_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"diagnosis":"Il circuito è incompleto e non funzionante.\n\n1.  **Cosa sbagliato:** Manca una fonte di alimentazione.\n    **Perché:** Un LED, come qualsiasi componente elettronico, 

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T05:29:45Z — ci_failure_burst

**Detail**: 5 CI failures in last 2h

**Pattern hint**: Check workflow logs for common root cause (missing secret, dep change)

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T07:30:15Z — edge_unlim-chat_content_failed

**Detail**: Response success=false or empty. Raw: {"success":false,"error":"AI temporaneamente non disponibile. Riprova tra qualche secondo."}

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T07:30:15Z — edge_unlim-hints_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"hints":"Assicurati che il tuo sistema sia configurato correttamente prima di iniziare la procedura. Verifica la presenza di eventuali errori o avvisi nel registro di sistema.","source

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T07:30:15Z — edge_unlim-diagnose_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"diagnosis":"[ERRORE:highlight:id]: led1 non è collegato.\n[PERCHÉ:highlight:id]: Un LED necessita di alimentazione per funzionare.\n[COME CORREGGERE:highlight:id]: Collega led1 a un

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T07:30:15Z — pr_draft_stuck

**Detail**: Draft PRs older than 2h: #12 docs(audit): live verify T1 2026-04-20 — 6 prod bugs

**Pattern hint**: Review and either ready-for-review or close

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T07:30:15Z — ci_failure_burst

**Detail**: 4 CI failures in last 2h

**Pattern hint**: Check workflow logs for common root cause (missing secret, dep change)

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T09:28:55Z — edge_unlim-hints_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"hints":"Assicurati che tutti i componenti siano collegati correttamente prima di iniziare. Controlla attentamente i cablaggi per evitare errori.","source":"flash-lite"}

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T09:28:55Z — edge_unlim-diagnose_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"diagnosis":"[ERRORE:highlight:id]: LED senza alimentazione.\n[PERCHÉ:highlight:id]: Un LED richiede una fonte di energia (tensione e corrente) per emettere luce.\n[CORREZIONE:highlig

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T09:28:55Z — pr_draft_stuck

**Detail**: Draft PRs older than 2h: #12 docs(audit): live verify T1 2026-04-20 — 6 prod bugs

**Pattern hint**: Review and either ready-for-review or close

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T09:28:55Z — ci_failure_burst

**Detail**: 5 CI failures in last 2h

**Pattern hint**: Check workflow logs for common root cause (missing secret, dep change)

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T11:06:35Z — edge_unlim-chat_content_failed

**Detail**: Response success=false or empty. Raw: {"success":false,"error":"AI temporaneamente non disponibile. Riprova tra qualche secondo."}

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T11:06:35Z — edge_unlim-hints_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"hints":"Per il passo 1, assicurati di aver preparato correttamente tutti i materiali necessari. Una corretta preparazione iniziale è fondamentale per il successo dell'esperimento.","

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T11:06:35Z — edge_unlim-diagnose_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"diagnosis":"[ERRORE:highlight:id]: LED senza alimentazione.\n[PERCHE':highlight:id]: Un LED richiede una tensione e una corrente per accendersi.\n[CORREZIONE:highlight:id]: Aggiungi u

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T11:06:35Z — pr_draft_stuck

**Detail**: Draft PRs older than 2h: #12 docs(audit): live verify T1 2026-04-20 — 6 prod bugs

**Pattern hint**: Review and either ready-for-review or close

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T11:06:35Z — ci_failure_burst

**Detail**: 5 CI failures in last 2h

**Pattern hint**: Check workflow logs for common root cause (missing secret, dep change)

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T12:14:44Z — edge_unlim-hints_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"hints":"Assicurati che tutti i componenti siano collegati correttamente seguendo lo schema fornito. Verifica di aver isolato correttamente le due parti del circuito prima di procedere

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T12:14:44Z — edge_unlim-diagnose_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"diagnosis":"[ERRORE 1:highlight:id]: LED non collegato.\n[PERCHÉ:highlight:id]: Un LED, per funzionare, necessita di essere alimentato.\n[COME CORREGGERE:highlight:id]: Aggiungi una 

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T12:14:44Z — pr_draft_stuck

**Detail**: Draft PRs older than 2h: #12 docs(audit): live verify T1 2026-04-20 — 6 prod bugs

**Pattern hint**: Review and either ready-for-review or close

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T12:14:44Z — ci_failure_burst

**Detail**: 4 CI failures in last 2h

**Pattern hint**: Check workflow logs for common root cause (missing secret, dep change)

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T14:16:37Z — edge_unlim-chat_content_failed

**Detail**: Response success=false or empty. Raw: {"error":"curl_failed"}

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T14:16:37Z — edge_unlim-hints_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"hints":"Assicurati che il tuo dispositivo sia connesso a una rete Wi-Fi stabile. Verifica che il software del tuo dispositivo sia aggiornato all'ultima versione disponibile.","source"

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T14:16:37Z — edge_unlim-diagnose_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"diagnosis":"Analisi circuito:\n\n1.  **Cosa sbagliato:** Il LED non è collegato a nulla.\n    **Perché:** Un LED necessita di una sorgente di alimentazione (come una batteria o un a

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T14:16:37Z — pr_draft_stuck

**Detail**: Draft PRs older than 2h: #12 docs(audit): live verify T1 2026-04-20 — 6 prod bugs

**Pattern hint**: Review and either ready-for-review or close

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T15:54:48Z — edge_unlim-hints_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"hints":"Assicurati che tutti i componenti siano collegati correttamente prima di iniziare. Controlla due volte i collegamenti per evitare errori.","source":"flash-lite"}

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T15:54:48Z — edge_unlim-diagnose_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"diagnosis":"[ERRORE:highlight:id]: led1 non è collegato.\n[PERCHÈ:highlight:id]: Un LED richiede una connessione ad un circuito per funzionare.\n[COME CORREGGERE:highlight:id]: Coll

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T15:54:48Z — pr_draft_stuck

**Detail**: Draft PRs older than 2h: #12 docs(audit): live verify T1 2026-04-20 — 6 prod bugs

**Pattern hint**: Review and either ready-for-review or close

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T15:54:48Z — ci_failure_burst

**Detail**: 5 CI failures in last 2h

**Pattern hint**: Check workflow logs for common root cause (missing secret, dep change)

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T17:15:13Z — edge_unlim-chat_content_failed

**Detail**: Response success=false or empty. Raw: {"success":false,"error":"AI temporaneamente non disponibile. Riprova tra qualche secondo."}

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T17:15:13Z — edge_unlim-hints_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"hints":"Assicurati che tutti i componenti siano collegati correttamente prima di iniziare. Verifica che l'alimentazione sia stabile e che non ci siano cortocircuiti.","source":"flash-

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T17:15:13Z — edge_unlim-diagnose_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"diagnosis":"Analisi circuito:\n\n1.  **Cosa sbagliato:** Il LED [AZIONE:highlight:led1] è presente ma non è collegato a nulla.\n2.  **Perché:** Un LED, per funzionare, necessita di

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T17:15:13Z — pr_draft_stuck

**Detail**: Draft PRs older than 2h: #12 docs(audit): live verify T1 2026-04-20 — 6 prod bugs

**Pattern hint**: Review and either ready-for-review or close

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T17:15:13Z — ci_failure_burst

**Detail**: 5 CI failures in last 2h

**Pattern hint**: Check workflow logs for common root cause (missing secret, dep change)

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T18:36:03Z — edge_unlim-hints_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"hints":"Assicurati che la tua squadra sia composta da personaggi con abilità complementari. Considera di assegnare ruoli specifici a ciascun membro per ottimizzare le sinergie.","sou

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T18:36:03Z — edge_unlim-diagnose_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"diagnosis":"[ERRORE:highlight:id]: LED senza alimentazione.\n[PERCHÉ:highlight:id]: Un LED richiede corrente per accendersi, ma non ci sono fili collegati.\n[COME CORREGGERE:highligh

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T18:36:03Z — pr_draft_stuck

**Detail**: Draft PRs older than 2h: #12 docs(audit): live verify T1 2026-04-20 — 6 prod bugs

**Pattern hint**: Review and either ready-for-review or close

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T18:36:03Z — ci_failure_burst

**Detail**: 6 CI failures in last 2h

**Pattern hint**: Check workflow logs for common root cause (missing secret, dep change)

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T19:47:27Z — edge_unlim-hints_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"hints":"Assicurati che tutti i componenti siano correttamente collegati tra loro e che la fonte di alimentazione sia stabile. Presta attenzione ai dettagli delle istruzioni per evitar

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T19:47:27Z — edge_unlim-diagnose_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"diagnosis":"Il circuito è incompleto.\n\n1.  **Manca alimentazione:** Un LED necessita di una sorgente di tensione per funzionare.\n2.  **Manca resistenza:** Un LED necessita di una 

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T19:47:27Z — pr_draft_stuck

**Detail**: Draft PRs older than 2h: #12 docs(audit): live verify T1 2026-04-20 — 6 prod bugs

**Pattern hint**: Review and either ready-for-review or close

**Run**: regular | **Source**: watchdog-elab

### 2026-04-20T19:47:27Z — ci_failure_burst

**Detail**: 4 CI failures in last 2h

**Pattern hint**: Check workflow logs for common root cause (missing secret, dep change)

**Run**: regular | **Source**: watchdog-elab
