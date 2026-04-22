# Claude-mem Observation Automation

**Status**: Active (Sprint 5 Day 01 / cumulative Day 29, A-502 delivered 2026-04-22)
**Owner**: DEV (inline)
**Retro source**: Sprint 4 Retrospective START #4 — "Ad-hoc claude-mem saves Sprint 4 missed 3 decisions (Day 22 afternoon, Day 24 audit, Day 27 ADR-007)"
**Acceptance**: `.githooks/post-commit` auto-writes claude-mem observation payload on every commit, zero reject rate, zero commit failure.

---

## Flow

```
git commit                                    (developer action)
      │
      ▼
.githooks/pre-commit                          (quick-regression-check.sh ~60s)
      │
      ▼
commit recorded in git object db
      │
      ▼
.githooks/post-commit                         (THIS HOOK — A-502)
      │
      ▼
scripts/cli-autonomous/claude-mem-save.sh commit
      │
      ▼
automa/state/claude-mem-pending/commit-<TS>.json   (JSON payload)
      │
      │   (next Claude CLI turn reads pending dir)
      ▼
Claude CLI dispatches mcp__plugin_claude-mem_mcp-search__* save observation
      │
      ▼
cross-session memory searchable via smart_search / timeline
```

The hook does NOT directly call MCP — MCP tools are client-side (Claude CLI). Hook prepares canonical payload; next Claude turn consumes pending dir and dispatches.

---

## Install

```bash
bash scripts/hooks/install-git-hooks.sh
```

What it does:
- `git config core.hooksPath .githooks`
- `chmod +x .githooks/*`

Verify:
```bash
bash scripts/hooks/install-git-hooks.sh --status
# expected output:
# [install-git-hooks] core.hooksPath = .githooks
# [install-git-hooks] tracked hooks:
#   post-commit
#   pre-commit
#   pre-push
```

---

## Uninstall

```bash
bash scripts/hooks/install-git-hooks.sh --uninstall
```

Reverts `core.hooksPath` to default `.git/hooks/`. Tracked `.githooks/` remains in repo but dormant.

---

## Payload schema (commit event)

```json
{
  "event": "commit",
  "timestamp": "2026-04-22T13:06:54+08:00",
  "title": "Commit <sha7> on <branch>",
  "content": "Commit SHA: <full sha>\nBranch: <branch>\nMessage: <subject>\nStats: <F> files, +<I>/-<D>\nTest count baseline: <N>\nSprint: <sprint> day <day>",
  "tags": "commit,sprint-<sprint>,day-<day>,post-commit-hook",
  "sha": "<full sha>",
  "branch": "<branch>",
  "subject": "<commit subject JSON-safe>",
  "sprint": "<sprint name>",
  "sprint_day": "<cumulative day>",
  "test_count_baseline": "<N>",
  "stats": {
    "files_changed": <int>,
    "insertions": <int>,
    "deletions": <int>
  }
}
```

---

## Non-invasive guarantee

`.githooks/post-commit` invariants:

1. `set +e` (NOT `-e`) — script may error, but hook **always** exits 0
2. If `claude-mem-save.sh` is missing or not executable, hook logs warning and returns 0
3. Output redirected to `automa/state/claude-mem-pending/post-commit-hook.log` (keeps git output clean)
4. No assertion about repository state — hook tolerates detached HEAD, empty commits, rebase

**Commit path never blocked by hook failure.**

---

## Empty-commit handling

Empty commits (e.g. `git commit --allow-empty`) produce empty shortstat. `claude-mem-save.sh` guards against pipefail abort via `{ ... } || true` wrappers on each grep extraction. Verified smoke test Day 29: 5 empty commits → 5 payloads with `"files_changed": 0, "insertions": 0, "deletions": 0`.

---

## Test coverage

`scripts/cli-autonomous/test-claude-mem-save.sh`:

- 36 checks all PASS (Day 29 baseline)
- Covers: script executable, invalid/missing event rejection, payload write for 6 event types, tags propagation, stats numeric typing, subject field presence, hook tracked + executable, hook non-blocking when save script missing, installer present + executable + --status runs

Run:
```bash
bash scripts/cli-autonomous/test-claude-mem-save.sh
```

---

## Smoke test pattern (reproducing acceptance)

```bash
# Install
bash scripts/hooks/install-git-hooks.sh

# Pre-count
PRE=$(ls automa/state/claude-mem-pending/commit-*.json 2>/dev/null | wc -l)

# 5 empty commits (skip pre-commit test gate with documented env var)
for i in 1 2 3 4 5; do
  ELAB_SKIP_PRECOMMIT=1 git commit --allow-empty -m "smoke $i"
  sleep 1  # avoid filename TS_SAFE collision
done

# Verify
POST=$(ls automa/state/claude-mem-pending/commit-*.json 2>/dev/null | wc -l)
echo "delta: $((POST - PRE))"
# expect: 5

# Rollback
git reset --soft HEAD~5
rm -f automa/state/claude-mem-pending/commit-20*.json  # smoke payloads
```

---

## Rationale — why not Husky

CLAUDE.md rule 13: "MAI aggiungere dipendenze npm senza approvazione di Andrea". Husky adds `husky` devDep + `.husky/` dir. `.githooks/` + `core.hooksPath` achieves the same per-clone semantics with zero dependencies — just git + bash, already present.

Trade-off: requires manual `install-git-hooks.sh` invocation once per clone (vs Husky automatic via `npm install` + `prepare` script). Documented in `CONTRIBUTING.md` clone step.

---

## Evidence paths

- Hook: `.githooks/post-commit`
- Installer: `scripts/hooks/install-git-hooks.sh`
- Save script: `scripts/cli-autonomous/claude-mem-save.sh`
- Tests: `scripts/cli-autonomous/test-claude-mem-save.sh`
- This doc: `docs/workflows/claude-mem-automation.md`
- Pending dir: `automa/state/claude-mem-pending/`
- Hook log: `automa/state/claude-mem-pending/post-commit-hook.log`
- Action tracker: `automa/team-state/sprint-5-actions-tracker.json` (A-502 entry)
- Retro source: `docs/retrospectives/sprint-4-retrospective.md` action A-502

---

## Future work

- **A-401 aggregator**: next-turn Claude CLI reads `automa/state/claude-mem-pending/*.json` + dispatches `mcp__plugin_claude-mem_mcp-search__*` save in batch. Currently manual per pending file. Sprint 5 Day 02+ backlog.
- **Rotation policy**: prevent unbounded pending dir growth. Add `scripts/cli-autonomous/claude-mem-rotate.sh` that archives payloads >7 days into `automa/state/claude-mem-archive/YYYY-MM/`. Sprint 5 Day 03+ backlog.
- **MCP payload dispatch tool**: wrapper that reads pending file + calls MCP + moves to archive on success. Future backlog.
