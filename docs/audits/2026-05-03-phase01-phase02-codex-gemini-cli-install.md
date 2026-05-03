# Audit Phase 0.1 + 0.2 — Codex + Gemini CLI install (PIVOTED)

**Data**: 2026-05-03 23:10 GMT+2
**Sessione**: iter 34, Phase 0.1+0.2
**Branch**: e2e-bypass-preview
**HEAD post-baseline**: 0d8b8cf

## §1 Briefing path vs realtà

### 1.1 Briefing playbook §0.1+§0.2 prescriveva

```
Phase 0.1 (15min): Codex Plugin install
  /plugin marketplace add openai/codex-plugin-cc
  /plugin install codex-plugin-cc@codex-plugin-cc
  Verify /codex --help

Phase 0.2 (15min): Gemini CLI install
  npm install -g @google/gemini-cli
  First run OAuth
  Extensions: conductor + code-review + security
```

### 1.2 Realtà osservata

**Andrea ha tentato** `/plugin marketplace add openai/codex-plugin-cc` → sistema risponde `/plugin isn't available in this environment.`

**Causa**: `/plugin` slash command NON disponibile in questo env Claude Code (forse versione CLI vs IDE vs sandbox config). Plugin manager non esposto.

**Validazione GitHub repo** `openai/codex-plugin-cc` ESISTE (200 OK):
- Plugin marketplace entry per Claude Code
- Wrapper sopra Codex CLI (`@openai/codex` npm)
- Aggiunge slash command `/codex:review`, `/codex:rescue`, `/codex:adversarial-review`, `/codex:status`, `/codex:result`, `/codex:cancel`
- Richiede `/plugin marketplace add` per installazione → stessa stessa rotta che fallisce

## §2 Pivot decision: CLI standalone npm install

### 2.1 Rationale

- Il plugin è solo wrapper sopra `@openai/codex` CLI (npm package ufficiale OpenAI v0.128.0).
- CLI standalone fornisce TUTTE le funzionalità del wrapper:
  - `codex exec "task"` → non-interactive run (~ `/codex:rescue`)
  - `codex exec review` → code review (~ `/codex:review`)
  - `codex sandbox macos <cmd>` → Seatbelt isolation
  - `codex login` → OAuth ChatGPT Plus
  - `codex resume` → session continuation
- Andrea può invocare via Bash da Claude Code → orchestrazione Three-Agent Pipeline funziona identico.

### 2.2 Eseguito

```bash
npm install -g @openai/codex
# → added 2 packages in 12s
# → ~/.npm-global/bin/codex symlink → @openai/codex/bin/codex.js
# → version: codex-cli 0.128.0

npm install -g @google/gemini-cli
# → changed 7 packages in 6s (after re-install)
# → ~/.npm-global/bin/gemini symlink → @google/gemini-cli/bundle/gemini.js
# → version: 0.40.1
```

### 2.3 PATH config

`~/.zshrc` GIÀ contiene `export PATH="$HOME/.npm-global/bin:$PATH"`. Dentro Bash spawn da Claude Code, prepend manuale `PATH="$HOME/.npm-global/bin:$PATH" && codex ...` funziona immediatamente. Nessun restart shell necessario.

## §3 Verifica install (file:line evidence)

```bash
# Direct binary verify
$ which codex
/Users/andreamarro/.npm-global/bin/codex
$ codex --version
codex-cli 0.128.0

$ which gemini
/Users/andreamarro/.npm-global/bin/gemini
$ gemini --version
0.40.1
```

Ambedue funzionanti. CLI subcommand inspect:

**Codex CLI subcommand**:
- `exec` (non-interactive run)
- `review` (code review)
- `login` (OAuth manage)
- `mcp` (MCP server bridge)
- `sandbox` (Seatbelt isolation)
- `cloud` (EXPERIMENTAL Codex Cloud browse)
- `resume` / `fork` / `apply`

**Gemini CLI subcommand**:
- Default interactive REPL
- `--prompt`/`-p` non-interactive headless
- `mcp` (MCP server manage)
- `extensions` / `skills` / `hooks`
- `--sandbox`, `--yolo`, `--approval-mode plan/auto_edit/yolo`
- Worktree mode `-w`

## §4 Three-Agent Pipeline architecture (CLI-based)

Trial Atom A1 Phase 0.4 usa pipeline 3-step:

```
Step 1 PLAN (Claude inline):
  Write spec docs/audits/2026-05-03-phase04-trial-A1-spec.md
  Define exact diff scope (system-prompt.ts cap conditional 6→8 categories)

Step 2 IMPLEMENT (Codex via Bash):
  cat docs/audits/2026-05-03-phase04-trial-A1-spec.md | \
    codex exec --sandbox macos --output-diff > /tmp/codex-impl-A1.diff
  Andrea ratify diff before apply
  codex apply /tmp/codex-impl-A1.diff

Step 3 REVIEW (Gemini via Bash):
  git diff HEAD~1 | gemini --prompt "Review this diff for: PRINCIPIO ZERO §1 compliance, Morfismo Sense 1.5 docente-adapt, edge cases off-topic prompts, vitest preserve 13752" \
    > docs/audits/2026-05-03-phase04-trial-A1-review.md

Step 4 FIX (Claude inline):
  Read review findings
  Apply fix if needed via Edit tool

Step 5 CoV (Bash):
  npx vitest run tests/unit/onniscenza-classifier.test.js
  bash scripts/g45/multi-vote-aggregator-manual.mjs

Step 6 AUDIT (Claude inline):
  Write docs/audits/2026-05-03-phase04-trial-A1-execution.md
```

## §5 OAuth pending

**Andrea ratify gate**: `codex login` + `gemini -p "test"` (first run) richiedono OAuth interattivo browser. NON eseguibili da Claude Code Bash spawn (no UI).

Andrea esegue UNA VOLTA in terminale Mac separato:
```bash
codex login              # ChatGPT Plus browser OAuth
codex login status       # Verify
gemini -p "test"         # Google account browser OAuth (first run)
```

Stato salvato in `~/.codex/auth.json` + `~/.gemini/credentials` → persistente cross-session.

**Quota implicate**:
- Codex via ChatGPT Plus: $20/mese (incluso in subscription esistente Andrea, quota condivisa con uso normale ChatGPT)
- Gemini via Google Pro: quota Google account standard (free tier ampio per uso CLI)

## §6 Caveat onesti

1. **Plugin Claude Code wrapper NON installato** = perdiamo `/codex:*` slash command tighlty integrated. Compenso: invocazione `codex exec` da Bash funziona identico, solo verbosità maggiore.

2. **`/plugin` env limitation root cause sconosciuta**: non chiaro se è versione Claude Code, sandbox config, o feature flag. Investigation iter 35+ se serve plugin install.

3. **OAuth NON automatizzabile** = ratify gate Andrea inevitabile. Tempo ~5 min (browser flow x2).

4. **Gemini install warning** "removed 635 packages" durante install è suspicious (re-install successivo ha "changed 7 packages in 6s" più normale). Possible npm cache state issue, ma binary funziona.

5. **Codex Cloud subcommand `EXPERIMENTAL`** — usabile ma non production-ready. Three-Agent Pipeline locale solo, no Cloud delegation.

6. **Briefing playbook va aggiornato** per future sessioni: path `openai/codex-plugin-cc` slash command, sostituire con CLI npm install standard.

## §7 Score impact

Phase 0.1+0.2 acceptance gate del briefing §0.5:
- ✅ H1 anti-bias possibile (Codex+Gemini disponibili come 2nd+3rd opinion)
- ⏸️ H2 wall-clock measurement defer Phase 0.4 trial
- ⏸️ H3 debito tecnico measurement defer Phase 0.4 trial  
- ⏸️ H4 cost measurement defer Phase 0.4 trial

3/4 ipotesi verificabili in trial Phase 0.4. Phase 0.5 retrospective deciderà PASS/PIVOT/STOP.

## §8 Next step

→ STEP 5.5: Andrea OAuth Codex + Gemini (5 min)
→ STEP 7: Phase 0.4 Three-Agent Pipeline trial Atom A1 spec write
→ STEP 8: Phase 0.5 retrospective + Andrea ratify Phase 1+
