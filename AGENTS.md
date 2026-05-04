# AGENTS.md — Shared State File Multi-Provider Workflow

**Purpose**: shared state file pattern (§3.2.4 plan doc), prevent context loss handoff Claude/Codex/Gemini/Kimi/Mistral CLI.
**Created**: 2026-05-03 iter 31 ralph 32 close (Step 1 prerequisite scaffold)
**Status**: SCAFFOLD — gated Andrea Step 1 ratify entrance

---

## Active task (current sprint)

| Field | Value |
|---|---|
| Active task ID | `none` |
| Lead agent | `none` |
| Implementer agent | `none` |
| Reviewer agent | `none` |
| Status | `awaiting-andrea-ratify-step1-multi-provider-workflow` |
| Last update | 2026-05-03 16:30Z |
| Blocking | Andrea ratify Step 1 entrance (plan doc §15.1 5 questions) |

---

## Workflow protocol

### Pre-task

1. Lead agent (planner) writes spec → `docs/specs/ATOM-{ID}-spec.md`
2. Update AGENTS.md `Active task ID` + `Lead agent` + `Status: planning`

### Phase Implement

1. Implementer agent reads spec.md
2. Update AGENTS.md `Implementer agent` + `Status: implementing`
3. Implementer commits changes
4. Update AGENTS.md `Status: review-pending`

### Phase Review

1. Reviewer agent reads diff HEAD~1..HEAD
2. Update AGENTS.md `Reviewer agent` + `Status: reviewing`
3. Reviewer outputs findings → `docs/audits/ATOM-{ID}-review.md`
4. Update AGENTS.md `Status: fix-pending` OR `Status: approved`

### Phase Close

1. Lead agent applies fixes (if any) → final commit
2. Update AGENTS.md `Status: completed` + `Active task ID: none`
3. Archive entry → `docs/agents-history/ATOM-{ID}-history.md`

---

## File ownership matrix

| Agent | Read | Write |
|---|---|---|
| Lead (Claude planner) | tutto | `docs/specs/`, `docs/plans/`, AGENTS.md |
| Implementer (Codex/Claude generator) | tutto | `src/`, `supabase/functions/`, `tests/` |
| Reviewer (Gemini DeepThink/Kimi) | tutto + diff | `docs/audits/`, AGENTS.md (review fields) |
| Verifier (multi-vote G45) | iter close | `docs/audits/g45-vote-*` |

---

## Conflict resolution

- 2 agents claim same file → Lead decides
- Lead uncertain → Reviewer veto
- Reviewer 2× FAIL consecutive → Andrea escalation

---

## Audit log (append only)

```
2026-05-03 16:30Z | scaffold | system | initial AGENTS.md created iter 31 ralph 32 close (multi-provider workflow plan §15.1 prerequisite) | NO active task
```


<claude-mem-context>
# Memory Context

# [elab-builder] recent context, 2026-05-04 9:56am GMT+2

No previous sessions found.
</claude-mem-context>