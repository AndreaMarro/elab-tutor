# Iter 37 close audit ONESTO — 2026-05-04 PM

**Score iter 37 close ricalibrato G45**: **8.55/10** (iter 36 baseline 8.50 + 0.05 P0.5 shipped, raw lift cap mechanical: 1/5 P0 atomi + 0/5 4-vendor cycle success; **NO inflate >8.65 senza Opus indipendente review G45 Sprint T close iter 41-43 cumulative**).

**Pattern**: inline single-agent execution + Phase 0 verify state. NO BG agent spawn iter 37 (context budget tight + Mistral key missing degrade 4-vendor → 3-vendor).

---

## §1 Deliverables iter 37 (1/7 P0 atomi shipped)

### P0.5 SHIPPED ✓ (commit `20302d7`)

**File**: `src/components/lavagna/LavagnaShell.jsx:426` (5 LOC change)

**Fix surgical**: `useState(false)` → `useState(readLavagnaSolo)` lazy init. Pattern stessa lazy init `lavagnaSoloMode` line 402.

**Effect**:
- Normal lavagna mode: galileoOpen=false default preservato (iter 36 P0 baseline minimizzato — docente vede prima il circuito)
- lavagnaSoloMode (hash `#lavagna-solo` OR localStorage `elab_lavagna_launch_mode='solo'`): galileoOpen=true default = UNLIM auto-show per Andrea explicit "lavagna solo = lavagna + UNLIM + volumi visible"

**Vitest narrow scope**: tests/unit/lavagna 22 file / 199 PASS post-edit zero regressioni.

**Pre-commit hook**: 13887 PASS (≥11958 baseline gate).

**Visual verify Chrome MCP POST-DEPLOY VERIFIED ✓** (2026-05-04 PM session 3 close):
- Vercel deploy `dpl_GDKryZkj2qiiJJhfHTxqDDaxHMrx` (`a1noij2zm`) Ready prod LIVE www.elabtutor.school
- Chunk LIVE `index-B5fu_q9W.js` (NEW vs OLD `index-B_SoxLfV.js` pre-deploy)
- Probe state: `galileoAdapterPresent: true` + `galileoVisibleNow: true` + `lavagnaMode: "lavagna-solo"` + `launchModeFlag: "solo"` + `hash: "#lavagna"`
- Screenshot evidence ID `ss_1694xwqmb`: UNLIM panel auto-shown right side + chat history visible + input "Chiedi a UNLIM..." + ModalitaSwitch HIDDEN + Simulator HIDDEN
- BONUS UNLIM prod LIVE quality: pompa d'acqua analogia + "Nel kit ELAB usiamo" plurale + Vol/pag style narrator IT register PRINCIPIO ZERO + MORFISMO Sense 2 visually compliant
- Andrea spec "lavagna solo = lavagna + UNLIM + volumi visible" ACHIEVED prod LIVE

### P0.1 verify SHIPPED iter 36 (NO separate iter 37 atom)

**Codex iter 2 brief 5 fixes status verify in tests/e2e/05-esci-persistence.spec.js**:
- Fix 1 HIGH waitForResponse network deterministic ✓ line 263
- Fix 2 HIGH unique exp ID per test ✓ line 275 beforeEach
- Fix 3 MEDIUM viewport 1920x1080 fixed ✓ line 8 test.use
- Fix 4 MEDIUM Esci selectors expand 5 selectors ✓ line 206-209
- Fix 5 LOW page.close runBeforeUnload ✓ line 373

**Onesto finding**: ALL 5 fixes ALREADY integrated iter 36 dirty work (waitForDrawingSurface helper widen +69 LOC). Iter 37 P0.1 atom revised: NO separate work needed, ship as iter 36 progress finalize commit `20302d7`.

**E2E exec prod chromium 3/3 PASS**: deferred iter 38 (Playwright config gate `--project chromium-prod-iter37` non visible local exec).

---

## §2 Defer iter 38 carryover (6/7 P0 atomi)

### P0.2 NewElabSimulator hideSimulatorBoard internal impl (~50 LOC)

**Status**: prop pass shipped iter 36 commit `632b0c0` MA internal gate breadboard SVG NOT impl. NewElabSimulator line ~876-918 conditional render mancante.

**Defer rationale**: 4-vendor cycle MANDATORY atomi >50 LOC + Mistral key missing degrade. iter 38 entrance Andrea export `MISTRAL_API_KEY` ~/.zshrc → 4-vendor cycle compliance.

### P0.3 /impeccable:bolder simboli redesign 4 ElabIcons (~150 LOC)

**Status**: NOT started.

**Defer rationale**: Design heavy + 4-vendor cycle critical (visual quality + Italian K-12 verify + anti-bias). iter 38 con WebDesigner-1 + 4-vendor full.

### P0.4 #17 Video YouTube Data API search inline (~120 LOC)

**Status**: NOT started.

**Defer rationale**: Andrea action gate — Data API key signup free 10k req/giorno. Andrea ratify queue iter 38 entrance.

### P0.6 Mac Mini SSH retry + Aider Kimi backend prep

**Status**: SSH FAIL "Too many authentication failures" iter 37 entrance test.

**Defer rationale**: Auth issue. Andrea action: reset SSH key OR Mac Mini physical reboot. iter 38 P0.6 retry conditional Andrea fix.

### P0.7 Andrea ratify queue 8 entries

**Status**: NOT triggered.

**Defer rationale**: Andrea sequential ~1h work post-iter-37-close (env enable + Edge deploy v81+ + R5+R6+R7 re-bench). iter 38 entrance gate.

---

## §3 Drift onesto flag

**baseline-tests.txt sync drift**: file claimed 13752 (stale), reality 13887 (pre-commit hook output verified). Synced iter 37 close — 13887 corrected.

**Iter 37 prompt vitest baseline claim**: 13887 PASS preserve (CORRECT, my Phase 0 misflag drift).

**Iter 37 prompt P0.1 brief lost /tmp**: `/tmp/be77bu0vb` ephemeral cleanup, MA `/tmp/L4-codex-iter2-fixes.md` exists + Codex iter 2 fixes ALREADY integrated iter 36 work (verify Fix 1-5 status spec lines).

---

## §4 Caveats critici onesti (G45 anti-inflation)

1. **Mistral key location RESOLVED via Andrea hint "/search mem"** — saved iter 24 `~/.elab-credentials/sprint-s-tokens.env` (directory NOT single file `.elab-credentials.env`). Source pattern `set -a; source ~/.elab-credentials/sprint-s-tokens.env; set +a` loads `MISTRAL_API_KEY` (len=32) + 3 backup + `CLOUDFLARE_API_TOKEN` (len=53) + `CLOUDFLARE_ACCOUNT_OR_ZONE_ID`. Memory file shipped `~/.claude/projects/.../memory/mistral-cloudflare-credentials.md` per future session bootstrap. 4-vendor cycle UNBLOCKED iter 38+. Iter 37 ship 1/5 atomi cap honest 8.55 unchanged (pivot late-session, no atomi >50 LOC time remaining).
2. **Mac Mini SSH FAIL iter 37 entrance** "Too many authentication failures" — autonomous loop probabilmente DEAD post 23-day uptime + auth lockout. Andrea fisico Mac Mini Strambino reboot OR SSH key fresh ssh-copy-id MacBook → Mac Mini.
3. **1/7 P0 atomi shipped iter 37** (P0.5 only) — iter 37 prompt §5 acceptance gate "≥4 atomi shipped 4-vendor cycle" NOT met. Score cap honest 8.55 (NOT 8.65 target).
4. **0 esperimenti audit Andrea iter 21+ mandate carryover** (94 broken Playwright UNO PER UNO sweep) — defer Sprint T close iter 41-43.
5. **180 narrative violations Andrea iter 21 carryover** (linguaggio singolare→plurale narrative analogies preserved Sense 2) — defer Sprint U+.
6. **Tech-debt cleanup Phase 3 SKIP iter 37** — context budget tight + minimal P0 atom shipped. iter 38 mandatory `/codebase-cleanup:tech-debt` scan + `/code-refactoring:tech-debt` resolve (Andrea explicit "non accumuliamo debito").
7. **NO Build pre-commit run iter 37** (~14min heavy) — pre-commit hook ran vitest only. iter 38 entrance pre-flight CoV mandatory `npm run build`.

---

## §5 Files iter 37 close

**Commits e2e-bypass-preview**:
- `20302d7` feat(iter-37-P0.5): UNLIM auto-show in lavagnaSoloMode + Codex iter 2 L4 helper finalize

**Files modified**:
- `src/components/lavagna/LavagnaShell.jsx` (+5 -2 P0.5)
- `tests/e2e/05-esci-persistence.spec.js` (+69 -6 iter 36 Codex iter 2 fixes finalize)
- `automa/baseline-tests.txt` (13752→13887 sync drift onesto)

**Cross-link**:
- Iter 37 prompt: `docs/handoff/2026-05-04-iter-37-PROMPT-PASTE-READY.md`
- Master plan iter 35: `docs/superpowers/plans/2026-05-04-iter-35-andrea-13-mandate-three-agent-master-plan.md`
- Codex iter 2 brief: `/tmp/L4-codex-iter2-fixes.md`

---

## §6 Iter 38 priorities P0 (cascade lift target 8.55→8.85 ONESTO)

1. **Andrea export MISTRAL_API_KEY** ~/.zshrc (5 min) — gate 4-vendor cycle compliance iter 38+
2. **P0.2 hideSimulatorBoard internal impl** (~50 LOC, 4-vendor cycle Codex+Gemini+Mistral+Kimi)
3. **P0.3 /impeccable:bolder 4 ElabIcons redesign** (~150 LOC, WebDesigner-1 + 4-vendor)
4. **P0.4 YouTube Data API search inline** (~120 LOC, Andrea Data API key gate)
5. **P0.6 Mac Mini SSH retry** (Andrea action 30 min — physical reboot OR SSH key reset)
6. **P0.7 Andrea ratify queue 8 entries** (sequential ~1h)
7. **Phase 3 tech-debt cleanup** `/codebase-cleanup:tech-debt` scan + 2-3 mechanisms M-AR-06 + M-AI-05 expand
8. **Build pre-flight CoV** iter 38 entrance `npm run build` (~14min) verify
9. **Chrome MCP visual verify P0.5** UNLIM auto-show lavagnaSoloMode prod LIVE post-deploy

**Iter 38 score target ONESTO**: 8.55 → **8.85/10** conditional 4 atomi shipped + 4-vendor cycle compliance + Mac Mini SSH unblock + Andrea ratify queue close.

**Sprint T close projection iter 41-43**: 9.5/10 ONESTO cumulative + Andrea Opus indipendente review G45 mandate (NOT iter 38 single-shot).

---

## §7 Anti-pattern G45 enforced iter 37

- ✅ NO claim "Sprint T close achieved" (iter 41-43 + Opus review)
- ✅ NO claim ">8.65 senza Opus review" (cap 8.55 honest, 1/5 atomi shipped)
- ✅ NO `--no-verify` (pre-commit hook 13887 PASS verify)
- ✅ NO push diretto main (e2e-bypass-preview branch)
- ✅ NO compiacenza Three-Agent (Mistral missing flag onesto, 4-vendor degraded 3-vendor admit)
- ✅ NO env keys printed conversation (~/.elab-credentials.env source subshell only, key length verify)
- ✅ NO destructive ops (NO `git reset --hard`, NO `rm -rf`, NO `DROP TABLE`)
- ✅ NO debito tecnico nascosto (caveat §4 7 entries explicit + tech-debt cleanup mandate iter 38)

End iter 37 close audit ONESTO.
