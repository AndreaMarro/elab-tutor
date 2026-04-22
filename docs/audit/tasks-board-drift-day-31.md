# tasks-board.json drift report — Day 31 (2026-04-22)

**Validator**: `scripts/validate-tasks-board.sh` (ADR-008 Phase 1 jq+bash fallback, no Ajv dep)
**Target file**: `automa/team-state/tasks-board.json`
**Result**: FAIL — **77 violation(s)** found against ADR-008 draft-07 schema

---

## Violation categories

| Count | Category | Severity |
|-------|----------|----------|
| 21 | missing `story_points` on task | high (enum fibonacci required) |
| 21 | missing `owner` on task | high (enum role required) |
| 19 | missing `status` on task | high (enum kanban required) |
| 10 | id pattern mismatch (e.g. `DAY02-*`, `FOUNDATIONS-*`) | medium (violates `^(T\|S\|A)-?[0-9]+`) |
| 2 | status enum violation (`false_blocker_resolved`, `BLOCKED-ANDREA`) | medium |
| 1 | root key `sprint_ref` missing (flat `sprint` used instead) | high (structural) |
| 1 | `columns.done` missing (legacy `merged` column used) | high (structural) |
| 1 | `owner` type mismatch: string vs object | high (structural) |
| 1 | `current_day` type mismatch: string `day-07` vs object | high (structural) |

---

## Root causes

1. **File frozen at Sprint 1 end** (`current_day: day-07`, `branch: feature/pdr-ambizioso-8-settimane`, `test_count: 12149`). File has not been updated across Sprints 2-5 — 4 sprints of drift invisible to agents.
2. **Legacy ID prefixes** (`DAY02-*`, `FOUNDATIONS-*`) predate the `^(T\|S\|A)` convention formalized in ADR-008. Migration needed.
3. **Free-form status values** (`false_blocker_resolved`, `BLOCKED-ANDREA`) never normalized.
4. **Task objects** in backlog/todo/merged columns lack the 3 mandatory fields (status, owner, story_points). Authors added ad-hoc keys (priority, estimated_hours, files_impacted, depends_on) instead.
5. **Column naming drift**: schema expects `done`, file uses `merged`. Also has `todo` column not in schema (schema uses `in_progress`).

---

## Phase 2 migration scope (Day 32+)

Migration script `scripts/migrate-tasks-board.js` must:

1. Rewrite root to `sprint_ref` object pointing to Sprint 5 contract.
2. Rewrite `current_day` string `day-07` → object with `sprint_day: 3, cumulative_day: 31, date: 2026-04-22`.
3. Rewrite `owner` string → object `{primary: "andrea", collaborators: ["tea"]}`.
4. Rename column `merged` → `done`, `todo` → `in_progress`.
5. For each task: infer `status` from column membership, `owner` from author (fallback `andrea`), `story_points` from `estimated_hours` heuristic (≤2h → 1, 3-4h → 2, 5-8h → 3, >8h → 5).
6. Replace non-compliant status values: `false_blocker_resolved` → `done`, `BLOCKED-ANDREA` → `blocked`.
7. Renormalize legacy IDs: `DAY02-DIRTY-TRIAGE` → `T2-001`, `FOUNDATIONS-CLI` → `T0-002` (author mapping table required).
8. Backup to `automa/team-state/backup/tasks-board.pre-migration.json` before overwrite.

Estimated effort: 3-4h (Andrea approval gate on destructive rename).

---

## Validator evidence

- Exit code 1 on live file (77 violations).
- Exit code 0 on `tests/fixtures/tasks-board/valid-minimal.json`.
- Exit code 1 on `tests/fixtures/tasks-board/invalid-task-enum.json` (bad status/owner/SP/id).
- Exit code 0 with `SKIP_SCHEMA=1` env var (emergency escape hatch).
- Exit code 1 on missing file.

Test harness: `tests/shell/test-validate-tasks-board.sh` — **4/4 PASS**.

---

## Honest limitations

1. jq validator is **less precise** than full Ajv: does not enforce `format: date`, `format: date-time`, `maxLength`, `additionalProperties: false`. Good enough for Phase 1 gate, Phase 3 blocking will need Ajv or equivalent.
2. **Validator tested on 2 fixtures + live file only**. Edge cases possible: deeply nested additional columns, malformed JSON at specific line offsets, unicode identifiers.
3. **No CI integration yet**. Validator must be called manually (`bash scripts/validate-tasks-board.sh`). Phase 2 adds pre-commit + CI hooks.
4. **Migration script not written this Day 31** — only drift enumeration. Phase 2 is Day 32 work.
5. **ID mapping table for renames is not yet designed** — legacy prefixes DAY02-*, FOUNDATIONS-* need human-curated mapping before automation can safely rewrite.

---

**Next day (Day 32) candidate**: Either start Phase 2 migration draft (if Andrea approves Ajv or confirms jq is sufficient long-term), or address other ADR-005 POC gate work (5-run shadow observation).
