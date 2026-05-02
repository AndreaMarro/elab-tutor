# Item #20 — Mac Mini HALT signal IGNORED investigation 2026-05-02

**Date**: 2026-05-02 ~09:30 CEST inline diagnostic
**Trigger**: Andrea ratify queue item #20 "Mac Mini HALT enforcement investigation"
**Scope**: Diagnostic locale read-only (no SSH commands per Andrea pacing).

---

## §1 Evidence

| Artefact | Evidence |
|---|---|
| HALT signal file | `automa/team-state/messages/andrea-HALT-2026-05-01-mac-mini-stop.md` mtime **2026-05-01 16:44:19** |
| Mac Mini autoloop branches origin | **53 totali** `origin/mac-mini/*` |
| First branch POST-HALT | `mac-mini/iter36-user-sim-20260501-1645` (timestamp 16:45 = 1 min post-HALT) |
| Last branch POST-HALT | `mac-mini/iter36-user-sim-20260501-2115` (timestamp 21:15 = **4h31min post-HALT**) |
| Last aggregate commit | `b0eb1de` 2026-05-01 23:15 = **6h31min post-HALT** |
| Aggregate commits frequency | Ogni 15 min cron L4 aggregator |
| L1 user-sim cycles | Ogni 5 min cron, persistent loop |

**Verdict**: HALT signal completely ignored 2026-05-01 16:44 → 23:15+ (autoloop ran 6h31min uncontested).

---

## §2 Root cause analysis

**HALT signal designed for**: `docs/superpowers/plans/2026-05-01-mac-mini-autonomous-iter-39-sprint-T-close.md` (iter 39 V2.1 redesign + Lighthouse + 94 esperimenti audit + Voyage re-ingest plan).

**Mac Mini actually executing**: `iter36-user-sim curriculum` (per CLAUDE.md iter 36 close §10):

```
Mac Mini USER-SIM CURRICULUM 3-livelli LIVE
4 crontab entries LIVE:
  L1 5min  user-sim simulate persona
  L2 30min user-sim deep flow
  L3 2h    user-sim long session
  L4 15min aggregator commits
```

**Cron entry awareness gap**: Standard `crontab -l` schedules execute commands on schedule **regardless** of any filesystem signal. Cron has no introspection of `automa/team-state/messages/andrea-HALT-*.md`. Each L1/L2/L3/L4 cron fire spawns Claude Code session → reads its own task script → ignores HALT signal because task script doesn't grep for HALT files.

**HALT signal protocol violation**: Specifico per "Mac Mini Claude desktop Opus 4.7 1M reading plan iter-39-sprint-T-close.md" (per HALT doc §1-7). Doesn't apply to scheduled cron user-sim curriculum unless cron command pre-check explicit.

---

## §3 Remediation paths (Andrea action required SSH)

Andrea has SSH access `progettibelli@100.124.198.59` via `~/.ssh/id_ed25519_elab` (MacBook only). Candidate actions:

### Path A — Remove cron entries (cleanest)

```bash
ssh progettibelli@100.124.198.59 -i ~/.ssh/id_ed25519_elab
crontab -l > /tmp/cron-backup-$(date +%Y%m%d).txt
crontab -e   # remove L1+L2+L3+L4 entries manually
# OR full disable:
crontab -r
```

Pro: definitive stop. Con: full remove also kills future legitimate scheduled tasks.

### Path B — Universal HALT pre-check wrapper

Modify each cron command to grep HALT signal first:

```bash
# Original cron entry
*/5 * * * * cd /path/elab-builder && bash scripts/mac-mini-user-sim-l1.sh

# Hardened version
*/5 * * * * cd /path/elab-builder && [ ! -f automa/team-state/messages/andrea-HALT-*.md ] && bash scripts/mac-mini-user-sim-l1.sh
```

Pro: HALT signal honored cleanly. Con: requires Andrea SSH edit.

### Path C — launchctl unload (alternative scheduler)

If Mac Mini uses launchctl plist instead of cron:
```bash
launchctl list | grep elab
launchctl unload ~/Library/LaunchAgents/com.elab.mac-mini-autonomous-loop.plist
```

Per CLAUDE.md Sprint S iter 1: `launchctl com.elab.mac-mini-autonomous-loop PID 23944` references launchctl. Plist may persist post-reboot.

### Path D — Tea/Operator manual stop (nuclear)

```bash
ssh progettibelli@100.124.198.59 -i ~/.ssh/id_ed25519_elab
killall claude   # kill all Claude Code processes
launchctl bootout user/$(id -u) com.elab.mac-mini-autonomous-loop
crontab -r
```

Definitive but heavy.

---

## §4 Continued autoloop activity 2026-05-02 verification

Latest aggregate commit `b0eb1de` timestamp 2026-05-01 23:15. NO commits 2026-05-02 visible in `git log --since` query.

**Hypothesis**: autoloop **stopped naturally** between 23:15 e 2026-05-02 morning. Possible reasons:
- Mac Mini sleep/hibernation overnight (default macOS power management)
- Cron job hit error + exit
- launchctl plist exit code
- Resource exhaustion

**Status uncertain**: Mac Mini may be sleeping OR may resume on wake. Andrea SSH check `crontab -l` + `launchctl list | grep elab` for definitive state.

---

## §5 Quality lift assessment

**Item #20 quality lift**: Process integrity (NOT product feature lift).

Score impact: 0 onesto (no product Box lift). MA prevents future autoloop regression cycles + Mac Mini Tasks 1-7 unblock per CLAUDE.md iter 38 carryover plan §11.

**Andrea action priority**: Path A (crontab -r) raccomandato — risolve definitivamente, Mac Mini Task plan re-introduce manualmente via Andrea quando ready.

---

## §6 NO COMPIACENZA — onesta finale

- ✅ HALT signal ignored 6h31min post-mtime confermato evidence filesystem + git log
- ✅ Root cause cron schedule lacks HALT pre-check identified
- ✅ 4 remediation paths documented Andrea SSH action
- ❌ Live SSH check Mac Mini state NOT executed (Andrea pacing "blocca macmini" + non SSH delegation autonomously inline)
- ❌ launchctl/cron actual config NOT inspected (require SSH)
- ❌ Mac Mini Task 1-7 plan re-activation NOT scheduled (depend HALT enforcement working)

**Iter 41+ recommendation**: ratify queue add explicit "Andrea SSH Mac Mini crontab -r OR add HALT pre-check wrapper" carryover voce per Sprint T close iter 43+ Mac Mini autonomous Tasks 1-7 unblock.

---

**Files this investigation**:
- `automa/team-state/messages/andrea-HALT-2026-05-01-mac-mini-stop.md` (HALT signal source)
- `git branch -r | grep mac-mini` evidence (53 branches)
- `git log --since="2026-05-01 16:44"` evidence (28+ aggregate commits post-HALT)
- `docs/audits/iter-39-mac-mini-HALT-IGNORED-investigation-2026-05-02.md` (this doc)
