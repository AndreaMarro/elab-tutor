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
