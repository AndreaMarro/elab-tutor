# Iter 37 entrance prompt PASTE-READY Andrea — 2026-05-04 PM session 3+

**Iter 36 close stato finale stable (NON COMPIACENZA)**:
- 11 commits iter 35-36 origin sync (HEAD `f0b93bf`)
- Vercel 8 deploy cycles (`grcq82kt9` → `3l30z4oax`) LIVE www.elabtutor.school
- Vitest 13887 PASS preserve 11/11 commit cycles
- Pre-commit + pre-push hooks rispettati 100% (NO `--no-verify`)
- 19/22 Andrea requests session 2 LIVE prod ✓ + 3 carryover iter 37
- Three-Agent Pipeline step 1 LITERAL CYCLE FUNCTIONING (Codex + Gemini `gemini-2.5-flash` + Mistral CLI ready)
- Score G45 cap honest 8.50/10 (NO inflate >8.55 senza Opus indipendente review G45 Sprint T close iter 41-43 cumulative)

---

## §1 ACTIVATION STRING iter 37 (paste in new Claude Code session)

```
ELAB Tutor iter 37 entrance — 2026-05-04 PM session 3
NON COMPIACENZA. Massima onesta.

Continua iter 36 close + step 2A 4-vendor cycle (Codex + Gemini + Mistral + Kimi K2.6).

Master plan iter 35: docs/superpowers/plans/2026-05-04-iter-35-andrea-13-mandate-three-agent-master-plan.md
Master plan iter 36-38 parent: docs/superpowers/plans/2026-05-04-iter-36-38-andrea-12-mandate-master-plan.md
Iter 37 prompt: docs/handoff/2026-05-04-iter-37-PROMPT-PASTE-READY.md (this file)

Kimi K2.6 API: chiave salvata ~/.elab-credentials.env chmod 600 (memory: kimi-api-reference.md)
Mistral La Plateforme: Andrea Scale tier €18/mese esistente, export MISTRAL_API_KEY ~/.zshrc
Gemini CLI: usare -m gemini-2.5-flash (gemini-3-flash-preview default capacity-limited Google)
Codex CLI v0.128.0: ChatGPT Plus quota Andrea esistente

Skills mandatory iter 37:
- /mem-search (recover prior context)
- /make-plan (iter 37 plan)
- /using-superpowers (process protocol)
- /ultrathink (deep reasoning)
- /quality-audit (Andrea explicit gate end)
- /systematic-debugging (Andrea explicit gate end)
- /codebase-cleanup:tech-debt (resolve unresolved problems)
- /code-refactoring:tech-debt (refactor + cleanup)
- /caveman (mode terse)
- /impeccable (SVG redesign atomi)

Skills strategy iter 37:
- Phase 0 mem-search + ultrathink (recover state + plan deep)
- Phase 1 make-plan + brainstorm (atom decomposition)
- Phase 2 4-vendor cycle Codex+Gemini+Mistral+Kimi per atom >50 LOC
- Phase 3 quality-audit + systematic-debugging (final CoV)
- Phase 4 codebase-cleanup tech-debt scan + code-refactoring resolve
- Phase 5 Chrome MCP + Mac MCP + Control Chrome + Claude in Chrome verify ALL prod LIVE

Anti-pattern G45 mandatory iter 37:
- NO claim "Sprint T close achieved" (iter 41-43 + Andrea Opus indipendente review G45)
- NO claim ">8.65 senza Opus review" (cap iter 36 8.50 + iter 37 +0.15 max conditional 4-vendor success)
- NO --no-verify (pre-commit + pre-push hooks 100% rispettati)
- NO push diretto main (e2e-bypass-preview branch + Vercel preview alias finale Production)
- NO compiacenza Three-Agent (4-vendor cycle MANDATORY atomi >50 LOC)
- NO env keys printed conversation (chiavi ~/.elab-credentials.env chmod 600 SOLO)
- NO destructive ops (NO git reset --hard, NO rm -rf, NO DROP TABLE)
- NO debito tecnico (codebase-cleanup tech-debt scan + resolve OGNI iter close)

Phase 0 Andrea actions IMMEDIATE iter 37 entrance (~40min FREE):
1. ssh -o ConnectTimeout=10 progettibelli@100.124.198.59 "uptime && crontab -l | head -5"
   - Stable → step 2B path open iter 38
   - Timeout chronic → reboot Mac Mini Strambino fisico OR step 2A only iter 37
2. source ~/.zshrc (load Kimi + Mistral keys)
3. bash scripts/three-agent/mistral-review.sh /tmp/test-prompt.md  # Verify
4. claude --backend kimi (test Anthropic-compat Kimi backend swap)
5. Groq + z.ai signup (FREE, ~10min)
   - https://console.groq.com → API Keys → Create
   - https://chat.z.ai → free signup (web only NO API)
6. (opt) Cerebras signup https://inference.cerebras.ai (FREE)

Iter 37 P0 atomi (4-vendor cycle Codex+Gemini+Mistral+Kimi):

P0.1 Codex L4 helper iter 2 finalize integrate Gemini 4 HIGH + 5 MEDIUM + 1 LOW findings (~80 LOC integrate)
- Briefing: /tmp/be77bu0vb (Codex output) + Gemini findings (4 HIGH + 5 MEDIUM + 1 LOW JSON)
- Mistral + Kimi parallel review final
- Ship: tests/e2e/05-esci-persistence.spec.js helper waitForDrawingSurface widen
- EXEC playwright spec post deploy 3/3 PASS prod chromium

P0.2 NewElabSimulator hideSimulatorBoard internal impl (~50 LOC)
- Currently prop pass (commit 632b0c0) MA internal gate breadboard SVG NOT impl
- Edit NewElabSimulator line ~876-918 conditional render: if (hideSimulatorBoard) hide SimulatorCanvas + ComponentDrawer + WhiteboardOverlay + LessonPathPanel + QuizPanel
- Keep DrawingOverlay + sr-only message (already shipped iter 36)
- 4-vendor review

P0.3 /impeccable:bolder simboli redesign 4 ElabIcons (~150 LOC)
- File: src/components/common/ElabIcons.jsx (LavagnaCardIcon + TutorCardIcon + UNLIMCardIcon + GlossarioCardIcon)
- /impeccable:bolder + /impeccable:colorize principles
- Codex implement + Gemini critique aesthetic + Mistral italian K-12 verify + Kimi long-context anti-bias
- Visual diff Chrome MCP screenshot prod LIVE post deploy

P0.4 #17 Video YouTube Data API search-results inline (~120 LOC)
- File: src/components/lavagna/VideoFloat.jsx
- Replace handleOpenYouTube external window.open with YouTube Data API v3 search() inline render results
- Andrea Data API key signup free 10k req/giorno
- 4-vendor review (especially Kimi 256K context for full Data API doc)

P0.5 UNLIM auto-show in lavagnaSoloMode (~20 LOC)
- LavagnaShell currently galileoOpen=false default in lavagna-solo (Chrome MCP test post 6° deploy)
- Andrea explicit "lavagna libera = solo lavagna + UNLIM + volumi" — UNLIM SHOULD auto-show
- Edit LavagnaShell:1387-1404 GalileoAdapter visible default=true if lavagnaSoloMode

P0.6 Mac Mini SSH retry + Aider Kimi backend prep (Andrea action 30min + script ready)
- Conditional Andrea SSH retry success
- scripts/three-agent/kimi-aider-mac-mini.sh NEW (Aider Kimi backend launcher)
- Test 2 atomi BG dispatch via Mac Mini swarm

P0.7 Andrea ratify queue iter 36 entrance (8 entries carryover)
- ENABLE_ONNISCENZA=true Supabase env enable
- ENABLE_HEDGED_LLM + ENABLE_HEDGED_PROVIDER_MIX env enable
- ENABLE_CAP_CONDITIONAL canary 5%→100%
- ENABLE_L2_CATEGORY_NARROW canary
- Edge Function unlim-chat deploy v81+
- Edge Function unlim-session-description NEW deploy
- macOS Computer Use real mic permission test wake word F1 badge
- R5+R6+R7 re-bench batch post env enable

Phase 3 tech-debt cleanup iter 37 (Andrea explicit "non accumuliamo debito"):
- /codebase-cleanup:tech-debt scan: identify accumulated debt iter 35-36
- /code-refactoring:tech-debt resolve: 6 mechanisms M-AR/M-AI shipped iter 31 → expand iter 37
- Codex L4 helper code (NOT integrated) — finalize OR remove
- AGENTS.md auto-tracked plugin (verify NOT debt)
- Mac Mini SSH plateau iter 32 — resolve iter 37 entrance
- ChatOverlay DOM querySelector hack (iter 30 cleanup PARTIAL)
- onniscenza V2 reverted iter 39 — verify V1 stable
- Pre-existing wakeWord-spec-prod-equivalence test → keep aligned with WAKE_PHRASES updates

Phase 4 final CoV iter 37 close:
- /quality-audit Andrea explicit
- /systematic-debugging Andrea explicit
- vitest baseline 13887+ preserve
- npm run build PASS (~14min)
- Chrome MCP screenshot diff prod LIVE post deploy
- Mac MCP shell verify (control Mac process state)
- Control Chrome execute_javascript prod state probe
- Claude in Chrome browser_batch interactive flow
- Manual Andrea visual verify Lavagna libera + Esci persistence + 4 SVG icons + speech anim + scimpanze rotation + cards 88px + footer "Homepage a cura di"

Iter 38 conditional (Mac Mini integrate POST iter 37 step 2A success):
- ssh stability validated iter 37 entrance ≥7 giorni continuous
- Kimi API $15/mese ratify Andrea (post iter 37 cycle measure marginal value)
- Mac Mini Aider Kimi backend launcher tested
- tmux 4 windows session: W1 Claude orchestrator + W2 Codex CLI + W3 Aider Kimi + W4 Aider Groq
- 5-10 atomi BG dispatch Mac Mini measure wall-clock saving Andrea ≥5h/sett
- Mistral + Groq + Kimi 4-vendor cycle Mac Mini swarm

Iter 41+ ratify gate (POST iter 38 saving evidence):
- $200/mese Cowork desktop Mac Mini Max 20x progettibelli upgrade
- Anthropic Routines cloud-managed 10 weekly tasks
- 27 mechanisms M-AR/M-AI full (6/27 shipped iter 31, 21 pending)
- Multi-vote G45 5-7 vendor anti-bias automated

Sprint T close projection: iter 41-43 cumulative + Andrea Opus indipendente review G45 mandate. NO single-shot iter 37-38.

START iter 37 con questo prompt + skills /mem-search + /ultrathink + /make-plan immediate.
```

---

## §2 Workflow how-to step 2A 4-vendor cycle iter 37

### Setup ambiente locale (~10min Andrea)

```bash
# 1. Source credentials env
source ~/.zshrc  # Loads KIMI_API_KEY + KIMI_BASE_URL + MISTRAL_API_KEY (Andrea export iter 37 entrance)

# 2. Verify env keys
[[ -n "$KIMI_API_KEY" ]] && echo "Kimi OK"
[[ -n "$MISTRAL_API_KEY" ]] && echo "Mistral OK"

# 3. Test Mistral CLI
echo "Test review prompt" > /tmp/test.md
bash scripts/three-agent/mistral-review.sh /tmp/test.md

# 4. Test Kimi backend swap (Anthropic-compat)
ANTHROPIC_BASE_URL="$KIMI_BASE_URL" ANTHROPIC_API_KEY="$KIMI_API_KEY" claude -p "Test ping JSON ok"

# 5. Verify Codex CLI + Gemini CLI functional
codex --version  # Expected: 0.128.0
gemini --version  # Expected: 0.40.1
```

### Atom 4-vendor cycle (per atom >50 LOC)

**Pre-step: Plan (Claude inline)**:
- Read existing code (file:line citations)
- Define atom requirements + acceptance criteria
- Write briefing /tmp/codex-{atom}-brief.md (problem + constraints + ALLOWED APIs + anti-pattern G45)

**Step 1: Codex implement**:
```bash
cat /tmp/codex-{atom}-brief.md | codex exec --skip-git-repo-check 2>&1 | tee /tmp/codex-{atom}-output.txt
```
Expected: code output ~30-200 LOC.

**Step 2: Gemini review primary**:
```bash
cat > /tmp/gemini-{atom}-review-prompt.md << EOF
# Three-Agent step 2 Gemini DeepThink review
## Codex output:
\$(cat /tmp/codex-{atom}-output.txt)
## Evaluate (deep critique):
[10 specific questions per atom domain]
Output ONLY findings JSON. No prose.
EOF
GEMINI_CLI_TRUST_WORKSPACE=true gemini -m gemini-2.5-flash -p "\$(cat /tmp/gemini-{atom}-review-prompt.md)" --skip-trust 2>&1 | tee /tmp/gemini-{atom}-findings.txt
```

**Step 3: Mistral review secondary** (anti-bias):
```bash
cat /tmp/codex-{atom}-output.txt > /tmp/mistral-{atom}-input.md
echo "## Codex output sopra. Review JSON HIGH/MEDIUM/LOW findings + suggested_fix per item." >> /tmp/mistral-{atom}-input.md
bash scripts/three-agent/mistral-review.sh /tmp/mistral-{atom}-input.md mistral-medium-latest > /tmp/mistral-{atom}-findings.json
```

**Step 4: Kimi K2.6 review tertiary** (256K context anti-bias):
```bash
ANTHROPIC_BASE_URL="$KIMI_BASE_URL" ANTHROPIC_API_KEY="$KIMI_API_KEY" claude -p "$(cat << EOF
Three-Agent step 2 Kimi review.
Codex output: $(cat /tmp/codex-{atom}-output.txt)
Gemini findings: $(cat /tmp/gemini-{atom}-findings.txt)
Mistral findings: $(cat /tmp/mistral-{atom}-findings.json)

Anti-bias check:
1. Did Gemini OR Mistral miss any HIGH-severity issue?
2. Identify NEW finding NOT in Gemini/Mistral.
3. Validate proposed fixes (cross-check feasibility).

Output JSON: {agreed: [...], new_findings: [...], rejected_fixes: [...]}.
EOF
)" 2>&1 | tee /tmp/kimi-{atom}-anti-bias.txt
```

**Step 5: Codex iter 2 finalize** (integrate all findings):
```bash
cat > /tmp/codex-{atom}-iter2-brief.md << EOF
# Codex iter 2 finalize integrate Gemini + Mistral + Kimi findings
## Original code:
$(cat /tmp/codex-{atom}-output.txt)
## Findings to integrate:
- Gemini: $(cat /tmp/gemini-{atom}-findings.txt)
- Mistral: $(cat /tmp/mistral-{atom}-findings.json)
- Kimi anti-bias: $(cat /tmp/kimi-{atom}-anti-bias.txt)
## Constraints:
- Address ALL HIGH findings
- Address MEDIUM findings if no fix conflict
- LOW defer iter 38 if scope >100 LOC
## Output: Final code FULL (no diffs, complete file content).
EOF
cat /tmp/codex-{atom}-iter2-brief.md | codex exec --skip-git-repo-check 2>&1 | tee /tmp/codex-{atom}-iter2-output.txt
```

**Step 6: Claude verify + integrate** (inline):
- Read /tmp/codex-{atom}-iter2-output.txt
- grep verify findings integrated (≥85% HIGH coverage)
- Apply via Edit tool to source file
- Run vitest scope-narrow scope test
- Commit + push + Vercel deploy
- Chrome MCP visual verify post deploy

### CoV per atom

```bash
# 1. Vitest scope-narrow
npx vitest run tests/unit/{relevant-area}/ 2>&1 | tail -5

# 2. Vitest baseline preserve
npx vitest run --reporter=line 2>&1 | tail -3
# Expected: 13887+ PASS

# 3. Build PASS pre-commit hook
git commit  # Pre-commit hook runs vitest auto

# 4. Push pre-push hook quick regression
git push origin e2e-bypass-preview  # Pre-push hook runs vitest auto

# 5. Vercel deploy
npx vercel --prod --yes --archive=tgz

# 6. Chrome MCP screenshot post-deploy
# (via mcp__Claude_in_Chrome__browser_batch)
```

---

## §3 Tech-debt unresolved problemi this session

**Da risolvere iter 37 (Andrea explicit "non accumuliamo debito")**:

1. **Codex L4 helper iter 2 NOT integrated** — Codex output 80 LOC + Gemini findings 4 HIGH+5 MEDIUM+1 LOW available, NOT applied to tests/e2e/05-esci-persistence.spec.js. Iter 37 P0.1.

2. **NewElabSimulator hideSimulatorBoard internal impl missing** — prop pass shipped (commit 632b0c0) ma internal gate breadboard SVG hide NOT impl. Currently chalkboard mode mounts NewElabSimulator full. Iter 37 P0.2.

3. **/impeccable simboli SVG redesign NON-existent** — size 88 only iter 36 (CSS sizing), SVG geometry stesso WebDesigner-1 iter 35 design. Iter 37 P0.3 mandatory Three-Agent literal cycle.

4. **#17 Video YouTube iframe embed NON-existent** — X-Frame-Options DENY blocks iframe. Andrea wants Data API search-results inline OR Vimeo pivot. Iter 37 P0.4.

5. **UNLIM auto-show NON-functional in lavagnaSoloMode** — Chrome MCP test post 6° deploy: galileoAdapter:false. Andrea explicit "lavagna libera = UNLIM + volumi". Iter 37 P0.5.

6. **Mac Mini SSH plateau iter 32 NON-resolved** — autonomous loop stale 96 branches/24h saturate. Iter 37 entrance Andrea action 30min retry diagnose.

7. **27 mechanisms 6/27 shipped, 21 pending** — defer iter 41+ post step 2B/2C. Iter 37 expand 2-3 mechanisms M-AR/M-AI iter 37 close (e.g. M-AR-06 auto-vercel-redeploy + M-AI-05 score-progression-tracker).

8. **Andrea ratify queue iter 36 entrance 8 entries unclosed** — env enable + Edge deploy v81+ + R5/R6/R7 re-bench. Iter 37 P0.7 Andrea sequential ~1h.

9. **Lighthouse perf 42 < 90 target** — defer iter 37+ optim (lazy mount + chunking + image opt + font preload + modulePreload).

10. **94 esperimenti audit Andrea iter 21+ mandate carryover** — broken Playwright UNO PER UNO sweep NOT closed. Defer Sprint T close gate iter 41-43.

11. **Linguaggio codemod 200 violations Andrea iter 21 carryover** — ~14 TRUE shipped iter 38 baseline, 180 narrative analogies preserved Sense 2 Morfismo. Defer Sprint U+.

12. **wakeWord-spec-prod-equivalence test alignment** — risk break ogni WAKE_PHRASES update (sync drift). M-AR-XX mechanism prevent automated.

13. **AGENTS.md auto-tracked plugin** — verify NOT debt (likely plugin-managed, ignore).

14. **Vol3 narrative refactor ADR-027 Davide co-author** — defer Sprint U+.

**Atom strategy iter 37 close**:
- Phase 1: P0.1-P0.5 risolvi (5 atomi 4-vendor cycle)
- Phase 2: P0.6 Mac Mini SSH retry (Andrea 30min)
- Phase 3: P0.7 Andrea ratify queue (Andrea 1h sequential)
- Phase 4: tech-debt cleanup scan + 2-3 mechanisms expand
- Phase 5: final CoV /quality-audit + /systematic-debugging + Chrome MCP + Mac MCP

---

## §4 CoV finale iter 37 close (Andrea explicit gate)

**Vitest baseline**:
```bash
npx vitest run --reporter=line 2>&1 | tail -3
# Expected: 13887+ PASS preserve
```

**Build PASS**:
```bash
npm run build  # ~14min heavy obfuscation
```

**Vercel deploy**:
```bash
npx vercel --prod --yes --archive=tgz
```

**Chrome MCP systematic verify ALL Andrea 22 requests**:
```javascript
// Per ogni atom iter 36-37 close, verify LIVE prod via mcp__Claude_in_Chrome__browser_batch:
// 1. Speech bubble animata "elab-bubble-wave" + reduce-motion respect
// 2. 4 cards SVG impeccable size 88 + drop-shadow
// 3. Footer "Homepage a cura di Andrea Marro · Teodora de Venere"
// 4. Scimpanzè rotation slot + emoji 🐒 fallback
// 5. SaveSession button header + dialog
// 6. Lavagna libera card click → lavagnaSoloMode TRUE
// 7. Pure chalkboard hide simulator + ModalitaSwitch + BentornatiOverlay
// 8. UNLIM auto-show lavagnaSoloMode (P0.5 fix iter 37)
// 9. DrawingOverlay area expand (P0.2 fix internal impl)
// 10. Esci persistence localStorage strokes survive
// 11. /impeccable simboli redesign visual quality (P0.3)
// 12. #17 Video YouTube Data API search inline (P0.4)
// 13. Codex L4 E2E spec 3/3 PASS prod chromium (P0.1)
// 14. Selectors widen PercorsoPanel + GalileoAdapter
// 15. Speech bubble bordo top NON tocca viewport
```

**Mac MCP shell verify**:
```bash
# Process state Mac Mini progettibelli (post step 2B Andrea SSH retry)
mcp__Macos__Shell({command: "ps aux | grep -E 'cron|tmux|claude|aider' | head -10"})

# Disk space + memory
mcp__Macos__Shell({command: "df -h / && top -l 1 | head -10"})
```

**Control Chrome execute_javascript prod state probe**:
```javascript
mcp__Control_Chrome__execute_javascript({
  code: `JSON.stringify({
    chunk: document.querySelector('script[src*=index]')?.src?.split('/').pop(),
    cards: document.querySelectorAll('[data-testid^=home-card]').length,
    lavagnaSolo: localStorage.getItem('elab_lavagna_launch_mode'),
    drawingKeys: Object.keys(localStorage).filter(k=>k.startsWith('elab-drawing-')),
    galileoAdapter: !!document.querySelector('[data-testid=galileo-adapter]'),
    modalitaSwitch: !!document.querySelector('[data-testid=modalita-switch-slot]'),
    bentornati: document.body.innerText.includes('Benvenuti'),
    saveBtn: !!document.querySelector('[data-testid=save-session-button]')
  })`,
  tab_id: <tab-id>
})
```

**Claude in Chrome interactive flow**:
- mcp__Claude_in_Chrome__find target elements
- mcp__Claude_in_Chrome__computer click + drag + screenshot
- mcp__Claude_in_Chrome__read_console_messages errors

---

## §5 Score G45 cap honest iter 37 close target

**Iter 36 close baseline**: 8.50/10
**Iter 37 close target**: **8.65/10 cap honest** (lift +0.15 conditional 5 P0 atomi 4-vendor cycle success + tech-debt cleanup 2-3 mechanisms expand)

**NO inflate >8.85 senza Opus indipendente review G45 mandate**. Sprint T close 9.5 NOT iter 37 single-shot.

**Acceptance gate iter 38 entrance**:
- ≥4 atomi shipped 4-vendor cycle iter 37 (Codex+Gemini+Mistral+Kimi)
- Mistral OR Kimi catches ≥1 unique HIGH/MEDIUM finding NOT caught Codex+Gemini
- Wall-clock cycle ≤2.5× single-vendor (overhead acceptable)
- Tech-debt cleanup ≥2 mechanisms expand
- Mac Mini SSH stable retry success

---

## §6 Workflow step 2 lift iter 38+ Mac Mini integrate (CONDITIONAL)

POST iter 37 step 2A success measure:

**Iter 38 step 2B**:
- Andrea Kimi $15/mese ratify
- Mac Mini Aider Kimi backend launcher
- tmux 4 windows session "elab-swarm" Mac Mini progettibelli
- 5-10 atomi BG dispatch Mac Mini swarm
- Measure wall-clock saving Andrea ≥5h/sett

**Iter 41+ step 2C**:
- $200/mese Cowork desktop Mac Mini Max 20x ratify (post iter 38 saving evidence)
- Anthropic Routines cloud-managed
- 27 mechanisms full
- Multi-vote G45 5-7 vendor automated

---

End iter 37 prompt PASTE-READY.
