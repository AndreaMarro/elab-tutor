# Iter 38 INTERIM audit ONESTO — 2026-05-04 → 2026-05-05 PM session 4

**Score iter 38 interim ricalibrato G45**: **8.65/10** (cap honest, +0.10 vs iter 37 close 8.55, conditional ≥1 atom prod LIVE verified post-deploy + 1 mechanism shipped + 4-vendor pipeline FULL UNLOCK).

---

## §1 Deliverables iter 38 (2 atomi shipped + 1 mechanism NEW)

### Atom 1 — M-AI-06 prompt-state-validator NEW mechanism (commit `a57f4d5`)

**File**: `scripts/mechanisms/M-AI-06-prompt-state-validator.mjs` (~190 LOC NEW)

**Purpose**: Anti-inflation gate — prevents future iter prompt drift catching claims like "P0.X NOT impl" / "atom NOT shipped" / "carryover" / "MA NOT impl" / "NON-existent" against file system + git log reality.

**Self-verify**: caught 1 HIGH drift in iter 37→iter 38 handoff §3 priorities table — P0.2 hideSimulatorBoard claim carries forward but commit `632b0c0` (iter 36) already shipped.

**Outputs**: JSON `automa/state/prompt-state-{date}.json` + console table. Exit 2 if HIGH drift count >= threshold 5.

**Iter 39+ usage**: pre-publish gate — run on every iter close prompt PRE author next session prompt.

### Atom 2 — P0.3 ElabIcons /impeccable:bolder ENHANCE (commit `2ab2433`)

**File**: `src/components/common/ElabIcons.jsx` (+55 -30 LOC delta = ~30 LOC effective net)

**Iter 37 prompt §3 P0.3 corrected scope**: prompt claimed "redesign NON-existent" — reality 4 icons GIÀ esistono iter 36 baseline (LavagnaCardIcon:435 + TutorCardIcon:469 + UNLIMCardIcon:499 + GlossarioCardIcon:529). True work: ENHANCE existing ~30 LOC delta NOT redesign 150 LOC.

**Enhancements applied 4 icons batch**:
- Stroke 2.5→3 (bolder outlines)
- Drop-shadow filter inline style (subtle elevation)
- LavagnaCardIcon: chalk pen rotated 8deg asymmetry break + stroke 2→2.5
- TutorCardIcon: bookmark ribbon Red asymmetric detail + LED glow halo opacity 0.25
- UNLIMCardIcon: LED eye glow halos + speech-bubble pulse outer ring + antenna circle stroke
- GlossarioCardIcon: book cover stroke bolder

**Preservation onesto**:
- Morfismo Sense 2 kit Omaric breadboard identico (Lime + Navy palette preserved)
- Triplet coerenza esterna preservata (UNLIM brand Navy + Vol1 Lime + Vol2 Orange + Vol3 Red)
- aria-hidden="true" + role="img" accessibility preserved
- Size 48 default + props spread compatible

**4-vendor cycle**: NOT mandatory (~30 LOC delta < 50 LOC threshold). Single-vendor inline acceptable per CLAUDE.md "Surgical: tocca minimo necessario".

---

## §2 Mechanism retroactive integration

**M-AI-03 claim-reality-gap-detector** (iter 37 close run):
- 6 vitest_pass historical drift findings
- Output: `automa/state/claim-reality-gap-2026-05-04.json`

**M-AI-04 doc-drift-detector** (iter 37 close run):
- 293 files scanned + 6 findings (3 HIGH + 3 MEDIUM)
- Output: `automa/state/doc-drift-report-2026-05-04.json`

**M-AI-02 mechanical-cap-enforcer** (iter 37 + iter 38 dry-run):
- iter 37 score 8.55: no caps triggered (above 8.5 floor)
- iter 38 score 8.65: caps would trigger if RAG_PAGE_COVERAGE OR BUNDLE_SIZE evidence missing — defer iter 39+ data collection

**M-AI-06 prompt-state-validator** (iter 38 NEW + self-test):
- iter 37 prompt scan: 5 raw HIGH drift findings → 1 dedup'd by commit SHA
- iter 38 handoff §3: 1 HIGH drift carryover P0.2 (corrected post-detection)
- Master plan iter 35: 0 findings (authored pre-iter-36 → no drift baseline)

**M-AI-01 score-history-validator**: pending iter 38 score entry append (post-deploy verify).

**M-AR-01 auto-revert-pre-commit**: pre-commit hooks gate verified all 6 commits this session (13887 PASS preserve).

---

## §3 4-vendor pipeline FULL UNLOCK iter 37 close

**Codex CLI v0.128.0** ✓ (vendor #1 implement)

**Gemini CLI v0.40.1** ✓ (vendor #2 review primary)

**Mistral CLI** `mistral-review.sh` ✓ smoke PASS valid JSON `{HIGH,MEDIUM,LOW}`:
- Path: `~/.elab-credentials/sprint-s-tokens.env` (DIRECTORY not single file)
- Andrea Scale tier €18/mese subscription attivo iter 24+
- Memory file shipped `mistral-cloudflare-credentials.md`

**Kimi K2.6** ✓ post-fix smoke PASS `content:"OK"` `stop:end_turn` `model:kimi-k2.6`:
- Cause FAIL: KIMI_BASE_URL=`api.moonshot.cn` (Cina) wrong region — Andrea key registrata `api.moonshot.ai` (international)
- Model legacy `kimi-k2-0905-preview` non esiste, corretto `kimi-k2.6` (256K + multimodal + reasoning)
- Fix regex replace `cn→ai` env file (chmod 600 preservato)
- Memory file `kimi-api-reference.md` updated

**4-vendor pipeline iter 38+ atomi >50 LOC compliance**: ALL vendors operational.

---

## §4 Commits iter 38 session

| Commit | Description |
|---|---|
| `20302d7` | iter 37 P0.5 UNLIM auto-show lavagnaSoloMode (LavagnaShell.jsx:426 readLavagnaSolo lazy) |
| `eed4bc5` | iter 37 audit + handoff iter 38 + baseline sync 13752→13887 |
| `8dcce92` | iter 37 Vercel deploy a1noij2zm + Chrome MCP P0.5 LIVE prod verify |
| `c53f5cc` | iter 37 close retroactive M-AI-03+04 mechanism findings + 4 claim/reality gaps + Kimi auth fix |
| `a57f4d5` | iter 38 M-AI-06 prompt-state-validator NEW + iter 38 priorities corrected drift |
| `2ab2433` | iter 38 P0.3 ElabIcons /impeccable:bolder ENHANCE 4 home cards (~30 LOC delta) |

**Pre-commit + pre-push hooks**: ALL 6 commits 13887 PASS gate verified. NO `--no-verify` used.

**Build prod**: 6m29s PASS (post-iter-38 P0.3 build). Bundle ~4821 KiB precache.

**Push origin**: All 6 commits on `e2e-bypass-preview` remote `2ab24333e7a47c80ed461a88caa62f4b6d1c4668`.

---

## §5 Honesty caveats critical iter 38

1. **Vercel deploy P0.3 in flight** at audit write time (BG bhn3f4oms). Score 8.65 conditional on deploy Ready + Chrome MCP visual verify icons enhance prod LIVE. If deploy fails → score reverts 8.55.

2. **5 claim/reality gaps total iter 37+38** caught onesto (4 retroactive M-AI-03 + 1 self-detected M-AI-06):
   - P0.2 hideSimulatorBoard (iter 36 commit 632b0c0)
   - shouldUseIntentSchema widen (iter 40 v2.0)
   - G3 PRONTI gate (iter 35 P2)
   - Wake word "Ragazzi" plurale (iter 41 D1)
   - P0.3 redesign 150 LOC (reality enhance 30 LOC, icons exist iter 36)

3. **Pattern emergente**: iter close prompts soffrono outdated state map drift. Mandate iter 39+: M-AI-06 pre-publish gate run on every iter close prompt PRE author next session.

4. **4-vendor cycle NOT applied iter 38 P0.3** (delta 30 LOC < 50 LOC threshold). Acceptable per CLAUDE.md "Surgical" + "Don't add features beyond task requires" guidance. Single-vendor inline.

5. **NO prod LIVE verify iter 38 P0.3** until Vercel deploy Ready + Chrome MCP screenshot post-deploy. Defer score finalization Phase 5 verification.

6. **Andrea ratify queue 8 entries** (iter 36 carryover) NOT triggered iter 38. Defer iter 39+ Andrea sequential ~1h.

7. **Mac Mini SSH still FAIL** "Too many auth failures" iter 38 entrance — Andrea action mandatory ssh-copy-id reset OR fisico reboot.

8. **L2 router catch-all SCALE fix Sprint T close gate** 93/94 esperimenti broken — defer iter 39+ (4-vendor cycle MANDATORY 100 LOC scope).

9. **Lighthouse perf 26+23 FAIL** ≥90 target carryover — defer iter 39+ Atom 42-A modulePreload + lazy mount + chunking.

---

## §6 Iter 39+ priorities cascade target 8.85/10 ONESTO

1. **P0** Andrea ssh-copy-id Mac Mini OR fisico reboot — unlock Mac Mini autonomous swarm
2. **P0** Andrea ratify queue 8 entries sequential ~1h (env enable + Edge deploy v81+)
3. **P0** Andrea Data API key signup YouTube → P0.4 Video search inline (~120 LOC)
4. **P0** L2 router catch-all SCALE narrow heuristic widen (~100 LOC, 4-vendor MANDATORY, Sprint T close gate)
5. **P1** Lighthouse perf optim Atom 42-A modulePreload (~100 LOC, 4-vendor)
6. **P1** Tech-debt cleanup `/codebase-cleanup:tech-debt` scan + 2 mechanisms expand (M-AR-06 vercel-deploy-verifier + M-AI-07 atomi-shipped-vs-claimed)
7. **P1** Sprint U Cycle 2 fix L2 routing + 73-file linguaggio codemod + 94 unlimPrompts docente framing batch
8. **P1** 92 esperimenti Playwright UNO PER UNO sweep (Andrea iter 21+ carryover)
9. **P2** Vol3 narrative refactor (ADR-027 Davide co-author Sprint U+)

**Iter 39 score target**: 8.65 → **8.85/10** ONESTO conditional 4 atomi shipped + Mac Mini SSH unblock + Andrea ratify queue close + R7 lift post canary.

**Sprint T close projection iter 41-43**: 9.5/10 ONESTO cumulative + Andrea Opus indipendente review G45 mandate.

---

## §7 Anti-pattern G45 enforced iter 38

- ✅ Pre-commit + pre-push hooks 13887 PASS verify ALL 6 commits this session
- ✅ NO `--no-verify`
- ✅ NO push diretto main (e2e-bypass-preview branch)
- ✅ NO destructive ops
- ✅ NO env keys printed (length only verified, source subshell isolated)
- ✅ NO compiacenza atomi shipped (5 claim/reality gaps caught onesto)
- ✅ Score 8.65 cap mechanic (NO inflate >8.85 senza Opus indipendente Sprint T close iter 41-43)
- ✅ M-AI-06 anti-inflation infrastructure shipped (preventive iter 39+ prompts)
- ✅ Caveat §5 9 entries explicit + tech-debt §6 9 entries iter 39+ priorities

---

## §8 GAP CRITICO ONESTO post-deploy verify (Andrea action mandatory iter 39)

**Diagnosi finale post-deploy verify Chrome MCP iter 38 P0.3**:

Branch divergence detected file-system + git log:
- `e2e-bypass-preview` (HEAD `2ab2433`) 263 commits ahead vs `origin/main`
- `origin/main` (HEAD `1951f55`) 122 commits NOT in HEAD — watchdog auto-commits + parallel work
- `origin/main:src/components/HomePage.jsx` titles: "Chatbot UNLIM" / "Glossario" / "Lavagna ELAB Tutor" / "Chi siamo"
- `e2e-bypass-preview:src/components/HomePage.jsx` titles: "Lavagna libera" / "ELAB Tutor completo" / "UNLIM (solo chat)" / "Glossario"

Vercel deploy chain:
- `npx vercel --prod --yes --archive=tgz` completed exit 0 successivi (iter 37 P0.5 LIVE prod verified) MA per iter 38 P0.3:
  - Deployment URL `bvlf0vs0f` Ready 3m ago
  - Deployment URL `9nh9urb55` aliased to `www.elabtutor.school` (created 2m ago, target production)
  - LIVE chunk `index-CrysHmIe.js` shows main-branch HomePage (4 cards with "CHI SIAMO")

**Honest interpretation**: Vercel project configured "Production Branch = main" → my `--prod` archive uploads dist MA Vercel auto-build cycle from main branch (watchdog commits) overrides alias. iter 37 P0.5 verified iter 37 close on `/lavagna` route (LavagnaShell shared between branches OR my changes accidentally applied) — but iter 38 P0.3 modifica HomePage.jsx on e2e-bypass-preview NON visible prod.

**Andrea action mandatory iter 39 entrance** (NON COMPIACENZA — DO NOT bypass autonomously):
1. Decide branch strategy: PR `e2e-bypass-preview` → `main` OR adjust Vercel "Production Branch" config
2. Sync 263 e2e-bypass-preview commits → main via PR (CI gate + merge)
3. OR explicit alias swap `vercel alias set elab-tutor-{my-deploy}-andreas-projects-6d4e9791.vercel.app www.elabtutor.school` (risky — overrides Vercel auto-deploy logic)
4. Verify iter 38 P0.3 4 ElabIcons enhance LIVE prod post-merge

**iter 37 P0.5 LIVE PROD verify ATTRIBUTION CORRECTION**:
- iter 37 close audit §1 claimed "P0.5 LIVE PROD verified Chrome MCP" — this is TRUE for `/lavagna` route specifically (galileoAdapter rendered correctly)
- /lavagna route uses `LavagnaShell.jsx` which IS shared between branches (single import)
- Main branch ALSO has the LavagnaShell modifications via similar commit OR is using older LavagnaShell version
- BUT homepage-specific changes (ElabIcons + HomePage.jsx) DIVERGE between branches
- ATTRIBUTION HONEST: P0.5 lavagnaSoloMode UNLIM auto-show may be in main branch path OR may be via shared LavagnaShell — needs verify post Andrea decision

**Score impact iter 38 honest**:
- Before this gap finding: 8.65/10 (P0.3 + M-AI-06 + Kimi auth + Mistral key resolve + 4 retroactive findings + audit + handoff)
- After honest gap: **8.50/10 cap** (deploy chain to prod broken — iter 38 P0.3 not verified prod LIVE — same level iter 36 baseline before any forward motion)

**Non puoi fare passi avanti senza prima sincronizzare e2e-bypass-preview ↔ main**. iter 39+ entrance MUST start with this resolution.

**M-AR-06 NEW mechanism candidate post-incident**: `vercel-deploy-branch-verifier.sh` — checks Vercel project Production Branch config + compares latest deploy commit SHA vs current HEAD push branch. Alerts if mismatch (prod alias built from different branch than expected).

End iter 38 INTERIM audit ONESTO + GAP CRITICO Andrea action mandatory.
