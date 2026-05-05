# Mac Mini Empowerment Totale — iter 42 PM

**Data**: 2026-05-05 PM (post PR #62 + #63 merged main, deploy LIVE prod `dc15d85`)
**Mandate Andrea**: pieni poteri progettibelli + contesto totale + sync bidirezionale main session ↔ Mac Mini + max sistematicità + zero regressione

## §1 Stato corrente PROD LIVE (verified)

| Atom | Status | Evidence |
|------|--------|----------|
| main HEAD | `dc15d85` | `[Run: git log origin/main]` PR #63 mascotte fix squash-merged |
| HomePage 4 cards | LIVE | Lavagna libera / ELAB Tutor completo / Glossario / Videolezioni |
| Mascotte asset | 200 OK | `[Run: fetch /assets/mascot/elab-mascot-vera.png]` `[See: 200]` |
| HomeCronologia search | PRESENT | `<input type="search" placeholder="Cerca tra le sessioni…">` + buckets Oggi/Ieri/Settimana/Più vecchie |
| Edge Function unlim-chat | v84 ACTIVE | Step-Back HIDDEN CoT system-prompt.ts:167 LIVE |
| Env vars Bug 1+2 fix | LIVE | INCLUDE_UI_STATE_IN_ONNISCENZA=true + CANARY_DENO_DISPATCH_PERCENT=100 + ONNISCENZA_VERSION=v1 |
| Vitest baseline | 13474 | preserved via 2 PR pre-commit hook + pre-push hook |

## §2 Mac Mini setup operations Andrea

### §2.1 Tools install (Andrea action 5-15 min, richiede sudo)

```bash
# SSH Mac Mini
ssh -i ~/.ssh/id_ed25519_elab progettibelli@100.124.198.59

# Install Homebrew (Andrea sudo password required)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add brew to PATH (Apple Silicon)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Install GitHub CLI + Node
brew install gh node

# Verify
gh --version && node --version && npm --version
```

### §2.2 Git auth + repo clone (Andrea action ~5 min)

```bash
# GitHub auth (device flow)
gh auth login
# select: GitHub.com → HTTPS → Y (auth git ops) → Login with web browser → copy code

# Clone repo target ~/Projects/elab-builder
mkdir -p ~/Projects
cd ~/Projects
gh repo clone AndreaMarro/elab-tutor elab-builder
cd elab-builder
git remote -v
git checkout e2e-bypass-preview
git pull origin e2e-bypass-preview
git log --oneline -3
```

### §2.3 Tokens env file (already copied via scp)

```bash
ls -la ~/elab-credentials.env
# -rw-------  1 progettibelli  staff  1311  May  5 20:06
chmod 600 ~/elab-credentials.env  # already chmod 600 onesto
```

Source quando serve (NO eval in shell startup, use only on demand):
```bash
source ~/elab-credentials.env
echo $SUPABASE_ACCESS_TOKEN | head -c 20  # verify present
```

### §2.4 Vitest baseline preserve

```bash
cd ~/Projects/elab-builder
npm install  # ~3-5 min (no engines warning ignore)
npx vitest run --reporter=dot 2>&1 | tail -5
# Expected: 13474 PASS (baseline preserve)
cat automa/baseline-tests.txt  # 13474 OR 13887 drift
```

### §2.5 Claude Code desktop install (Andrea action via Anthropic site)

Mac Mini `~/.config/claude` NOT exist post probe iter 42 PM. Andrea must:
1. Download Claude Code desktop https://claude.ai/download (macOS arm64)
2. Install + login Anthropic account
3. Aprire `~/Projects/elab-builder` come working directory

Andrea può poi:
```bash
ssh -i ~/.ssh/id_ed25519_elab progettibelli@100.124.198.59
cd ~/Projects/elab-builder
# Open Claude Code session OR via desktop icon
```

## §3 Sync bidirezionale MacBook ↔ Mac Mini

### §3.1 Pattern recommend git-based sync

MacBook session → branch e2e-bypass-preview push origin → Mac Mini `git pull origin e2e-bypass-preview` resume context.

Mac Mini session → branch `mac-mini/iter-N-task-T` push origin → MacBook session `git fetch + branch checkout` resume.

NO worktree shared (filesystem isolated). NO SSH tmux shared (cmux defer iter 43 ratify).

### §3.2 Cowork file barrier (Pattern S r3 esteso)

`automa/team-state/cowork/macbook-handoff.md` (MacBook writes) ↔ `automa/team-state/cowork/macmini-critique.md` (Mac Mini writes). Filesystem barrier git-tracked + commit + push entrambi.

ADR-043 v2 design iter 43+ ship.

## §4 Anti-regression mandate FERREO

```
✅ vitest 13474 PASS baseline preserve (pre-commit hook checks)
✅ npm run build PASS (pre-push hook ratchet 11958→13474)
✅ NO --no-verify (security urgency only Andrea explicit)
✅ NO push diretto main (PR #62 + #63 via gh pr create + squash merge)
✅ NO destructive ops (rm -rf, git reset --hard, drop table — hook block)
✅ NO git add -A (file-specific only, security .env leak prevention)
✅ Hook verification-evidence-gate.sh WIRED .claude/settings.local.json Stop block
✅ Connettori massiccio: claude-in-chrome smoke + screenshot + javascript fetch verify post deploy
✅ Mem-search per ogni task carryover
✅ Onestà persistente: NO claim score >7 senza inline [Run:][See:] evidence
```

## §5 Andrea ratify queue iter 43+ (P1 carryover)

| # | Item | Effort | Gate |
|---|------|--------|------|
| 1 | ADR-043 v2 Morfismo Orchestrator UNLIM Proactive Lesson Assistant | 10 min ratify | Andrea read+ratify deadline iter 43 entrance |
| 2 | UNLIM Bug 1+2 LIVE chat smoke prod (post env-set v84 + post-merge) | 30 min | claude-in-chrome Tester batch |
| 3 | Tea Glossario URL clone IDENTICAL inside main app `#glossario` | 4-6h | Andrea repo URL? |
| 4 | ELAB_API_KEY rotate + 3-env sync (Vercel + Supabase + .env local) | 5-30 min | localizza/rotate? |
| 5 | tmux session elab-iter43 5-window setup | 5 min | autonomous OK? |
| 6 | cmux install `sst/cmux` Tailscale shared session | 5 min | conferma `sst/cmux`? |
| 7 | Mac Mini cowork sincrono R1+R2+R3 (cowork-trigger script + Anthropic Max 2-session + cmux) | 30 min | ratify 3 voci |
| 8 | repomix install + cegis-plus-orchestrator.sh ship | 30 min | autonomous OK? |
| 9 | iter 43 stack ratify (ReAct + ToT-Hulbert + Generated-Knowledge gated) | 1h | ratify? |
| 10 | claude-mem ingest pipeline diagnose + restart (corpus broken Apr 23+) | 2h | priority? |
| 11 | Lavagna libera fix LavagnaShell launchMode useEffect (verdict OPEN audit) | 1-2h | iter 43 P0.3 |
| 12 | SSE streaming Edge Function impl + sub-ADR | 4h batch | iter 43 P0.4 |
| 13 | 92→94 esperimenti audit Playwright UNO PER UNO (Andrea iter 21+ carryover) | 8h+ | Sprint T close gate |
| 14 | Linguaggio codemod 200 violations singolare→plurale | 4h | Andrea iter 21+ carryover |
| 15 | Vol3 narrative refactor ADR-027 (Davide co-author) | iter 33+ deferred | Sprint U |
| 16 | Mac Mini autonomous loop diagnose + recovery (iter 36 user-sim curriculum status) | 1h | iter 43 P0.8 |

## §6 G45 cap iter 42 PM ONESTO finale

**7.5/10** (NON 8.5 inflated). Sprint T close 9.5/10 NON achievable iter 42-43 single-shot. Realistic **iter 45+** post:
- ADR-043 v2 Layer 1+2 ship (8h+6h Maker batch)
- Canary 5%→100% rollout stable
- Andrea Opus G45 indipendente review

## §7 Files refs iter 42 PM

- ADR-043 v2 design: `docs/adrs/ADR-043-morfismo-orchestrator-unlim-proactive-v2.md` (622 LOC)
- Phase3 audit close: `docs/audits/2026-05-05-iter-42-pm-PHASE3-CLOSE-audit.md` (188 LOC)
- Lavagna libera audit: `docs/audits/2026-05-05-iter-42-pm-lavagna-libera-verify.md` (309 LOC)
- Handoff iter 43: `docs/handoff/2026-05-05-iter-42-pm-to-iter-43-handoff.md` (146 LOC)
- Mac Mini empowerment (this file): `docs/handoff/2026-05-05-iter-42-pm-mac-mini-empowerment-totale.md`
- Sprint contract iter 42: `automa/team-state/sprint-contracts/sprint-T-iter-42-contract.md`
- CHANGELOG iter 42 PM: top of `CHANGELOG.md`
- 4 NEW memorie feedback: `feedback_unlim_chat_broken_iter42.md` + `feedback_orchestrator_architecture_iter42.md` + `feedback_unlim_proactive_lesson_assistant_iter42.md` + `feedback_connettori_test_validation.md`

## §8 Commits iter 42 PM

- `00d5b7c` feat(iter-42-sprint-contract) sprint contract iter 42
- `e6a0f6a` docs(iter-42-pm) ADR-043 + Phase3 audit + Lavagna libera + handoff iter 43
- `0c66146` fix(iter-42) HomePage prod regression revert main (PR #62 squash)
- `dc15d85` fix(iter-42-pm) missing mascotte asset 404 (PR #63 squash)

## §9 Cronologia ricerca verify (Andrea critica "manca cronologia oggi")

ONESTÀ: cronologia + search bar + buckets PRESENT prod LIVE post-merge `dc15d85`. Andrea screenshot precedente era PRE-mascotte-fix viewport top solo. Scroll significativo richiesto per vedere cronologia (sotto fold, ~2 viewport down).

`[Run: javascript_tool fetch /]` `[See: searchInput placeholder "Cerca tra le sessioni…", buckets Oggi/Ieri/Settimana/Più vecchie ordinati, 15 sessioni reali listed]`

NESSUNA REGRESSION cronologia. ZERO fix necessario.

End handoff Mac Mini empowerment totale iter 42 PM.
