# ADR-008 — tasks-board.json JSON Schema formalization

**Status**: PROPOSED (Day 30 Sprint 5 Day 02 bridge, 2026-04-22)
**Supersedes**: none
**Related**: AGILE-METHODOLOGY-ELAB.md (Product Backlog hierarchy), ADR-007 (module extraction pattern — analogous formalization for code)
**Tracker ref**: A-503 in `automa/team-state/sprint-5-actions-tracker.json`

---

## 1. Context

`automa/team-state/tasks-board.json` has grown organically across ~5 sprints. Current state (verified 2026-04-22):

- Root keys: `sprint`, `sprint_period`, `updated_at`, `current_day`, `owner`, `goal`, `baseline`, `sprint_contract_ref`, `columns`, `notes`, `day02_plan`.
- `columns` sub-structure: free-form arrays (`backlog`, `in_progress`, `done`, possibly others) — each item is an ad-hoc object with varying keys.
- `current_day` pattern inconsistent: older snapshots use `"day-07"`, newer files reference cumulative counters (`day-29`, `day-30`) — confusion.
- `owner` field mixes user names, agent labels (e.g., `team-dev`), and free-text.
- No validation script exists; ad-hoc edits happen via text editor or shell redirect.
- Reviewer and Auditor agents **hallucinated statuses multiple times** in prior sprints (BLOCKER-004 retro: "dashboard shown in-progress but file said backlog") because keys drift across snapshots.

Evidence:

- Day 04 BLOCKER-004 note: "product backlog hierarchy non formalizzato". Closed Day 09 with a Markdown companion file — but `tasks-board.json` itself never schema-gated.
- Day 29 Sprint 4 Retrospective (`docs/retrospectives/sprint-4-retrospective.md`) lists "board schema drift" in STOP items.
- Sprint 5 A-503 explicitly carved from the retro action list.

---

## 2. Decision

Introduce a JSON Schema (draft-07) contract for `automa/team-state/tasks-board.json`, backed by a Node validation script and a CI hook (non-blocking first, blocking after 1 sprint soak).

### 2.1 Schema location

`docs/architectures/schemas/tasks-board.schema.json` (new file, to be created in next task when this ADR is accepted).

### 2.2 Schema shape (draft)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://elab-builder/schemas/tasks-board.json",
  "title": "ELAB tasks-board",
  "type": "object",
  "required": ["sprint_ref", "updated_at", "current_day", "columns"],
  "additionalProperties": false,
  "properties": {
    "sprint_ref": {
      "type": "object",
      "required": ["number", "name", "period_start", "period_end", "contract_path"],
      "properties": {
        "number": { "type": "integer", "minimum": 1 },
        "name": { "type": "string", "pattern": "^sett-[0-9]+(-.*)?$" },
        "period_start": { "type": "string", "format": "date" },
        "period_end": { "type": "string", "format": "date" },
        "contract_path": { "type": "string", "pattern": "\\.md$" }
      }
    },
    "current_day": {
      "type": "object",
      "required": ["sprint_day", "cumulative_day", "date"],
      "properties": {
        "sprint_day": { "type": "integer", "minimum": 1, "maximum": 7 },
        "cumulative_day": { "type": "integer", "minimum": 1 },
        "date": { "type": "string", "format": "date" },
        "label": { "type": "string" }
      }
    },
    "updated_at": { "type": "string", "format": "date-time" },
    "owner": {
      "type": "object",
      "required": ["primary"],
      "properties": {
        "primary": { "type": "string" },
        "collaborators": { "type": "array", "items": { "type": "string" } }
      }
    },
    "goal": { "type": "string", "maxLength": 500 },
    "baseline": {
      "type": "object",
      "required": ["test_count", "benchmark_score", "branch", "last_commit"],
      "properties": {
        "test_count": { "type": "integer", "minimum": 0 },
        "benchmark_score": { "type": "number", "minimum": 0, "maximum": 10 },
        "build_status": { "enum": ["PASS", "FAIL", "UNKNOWN"] },
        "branch": { "type": "string" },
        "last_commit": { "type": "string", "pattern": "^[0-9a-f]{7,40}$" },
        "unpushed_commits": { "type": "integer", "minimum": 0 }
      }
    },
    "columns": {
      "type": "object",
      "required": ["backlog", "in_progress", "done"],
      "properties": {
        "backlog":     { "type": "array", "items": { "$ref": "#/$defs/task" } },
        "in_progress": { "type": "array", "items": { "$ref": "#/$defs/task" } },
        "done":        { "type": "array", "items": { "$ref": "#/$defs/task" } },
        "blocked":     { "type": "array", "items": { "$ref": "#/$defs/task" } }
      }
    },
    "notes": { "type": "string" }
  },
  "$defs": {
    "task": {
      "type": "object",
      "required": ["id", "title", "status", "owner", "story_points"],
      "additionalProperties": false,
      "properties": {
        "id": { "type": "string", "pattern": "^(T|S|A)-?[0-9]+(-[0-9]+)*$" },
        "title": { "type": "string", "maxLength": 140 },
        "status": { "enum": ["backlog", "in_progress", "blocked", "review", "done"] },
        "owner": { "enum": ["team-architect", "team-dev", "team-tester", "team-reviewer", "team-auditor", "team-tpm", "andrea", "tea"] },
        "story_points": { "enum": [1, 2, 3, 5, 8, 13, 21] },
        "acceptance_criteria": { "type": "array", "items": { "type": "string" }, "minItems": 1 },
        "blockers": { "type": "array", "items": { "type": "string" } },
        "linked_adr": { "type": "string", "pattern": "^ADR-[0-9]+" },
        "linked_commit": { "type": "string", "pattern": "^[0-9a-f]{7,40}$" },
        "started_at": { "type": "string", "format": "date-time" },
        "completed_at": { "type": "string", "format": "date-time" }
      }
    }
  }
}
```

### 2.3 Validation script

`scripts/validate-tasks-board.js` (new file, Day 31 task):

```javascript
#!/usr/bin/env node
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';

const schema = JSON.parse(readFileSync('docs/architectures/schemas/tasks-board.schema.json', 'utf8'));
const data   = JSON.parse(readFileSync('automa/team-state/tasks-board.json', 'utf8'));

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const valid = ajv.validate(schema, data);

if (!valid) {
  console.error('tasks-board.json invalid:');
  console.error(ajv.errors);
  process.exit(1);
}
console.log('tasks-board.json OK');
```

Dependency: `ajv` + `ajv-formats` (both tiny, already in ecosystem of dev tools).

### 2.4 Deprecation path (current free-form → schema-compliant)

| Phase | Target day | Action |
|-------|-----------|--------|
| 0 | Day 30 (today) | ADR-008 drafted (this file). No file change. |
| 1 | Day 31-32 | Author `tasks-board.schema.json`. Run validator against current file — expect fail. Document gap. Author migration script `scripts/migrate-tasks-board.js` that maps legacy → schema shape. |
| 2 | Day 33 | Run migration on a branch, commit new schema-compliant file + schema + validator. Validator runs in CI as warn-only (`|| true`). |
| 3 | Day 35 (Sprint 5 end gate) | Promote validator to blocking in pre-commit + CI. Remove `|| true`. |
| 4 | Sprint 6 Day 01 | Retrospective item: confirm zero drift, measure "time spent fighting schema" vs "time saved by less hallucination". |

### 2.5 Enum rationale

- `status`: mirrors kanban column names used in existing `columns` object (backlog/in_progress/done) + 2 additions (`blocked`, `review`) observed in ad-hoc notes but never formalized.
- `owner`: restricts to known agent roles + 2 humans (Andrea, Tea). Rejects free-text owner strings that caused past confusion (e.g., `"owner": "DEV"` vs `"team-dev"` vs `"Andrea Marro + Tea"`).
- `story_points`: Fibonacci classical Scrum scale (per AGILE-METHODOLOGY-ELAB.md sez 3.4).

---

## 3. Consequences

### Positive

- Auditor/Reviewer agents can cross-reference task state without hallucinating (schema gives them a contract to read).
- Migration script produces a clean canonical file — "one source of truth" for sprint state.
- CI blocks accidental drift (Phase 3).
- Enum normalization closes 3 prior audit complaints (owner strings, status naming, date format).

### Negative

- Short-term friction: every ad-hoc edit now requires passing validation. First day post-Phase-3 will likely produce CI-fail PRs until authors adapt.
- Migration script risk: free-form data may have no clean mapping (e.g., a task with two owners). Requires manual reconciliation for ~5-10 legacy entries.
- Ajv dependency addition requires Andrea approval per CLAUDE.md "MAI aggiungere dipendenze npm senza approvazione".

### Neutral

- Schema lives in `docs/architectures/schemas/` — discoverable via existing ADR doc conventions.
- Validator run time negligible (<100ms).

---

## 4. Alternatives considered

1. **Keep free-form, rely on code review** — rejected: has failed for 5 sprints, reviewer hallucination documented.
2. **TypeScript types + runtime guard** — rejected: tasks-board.json is consumed by bash scripts and agents, not JS code. JSON Schema is more universal.
3. **Zod schema** — rejected: Zod requires JS-only consumers. Schema draft-07 is tool-agnostic (bash + jq schema-validators exist).
4. **Switch format to YAML** — rejected: higher parsing fragility in bash ecosystem; JSON already works.
5. **Move to a database** (SQLite local) — rejected: over-engineering for <50 entries at peak; diff-ability in git lost.

---

## 5. Acceptance criteria (ADR-008 impl Day 31+)

- [ ] `docs/architectures/schemas/tasks-board.schema.json` exists and is draft-07 compliant (validate via `ajv compile`).
- [ ] `scripts/validate-tasks-board.js` exits 0 on schema-compliant file, non-zero on drift.
- [ ] Migration script `scripts/migrate-tasks-board.js` produces schema-compliant output from current free-form input without data loss (manual audit of top-5 fields).
- [ ] One sprint of CI warn-only observations with zero false-positive before flipping to blocking.
- [ ] Retrospective Day 35 documents drift count + time saved vs time spent.

---

## 6. Risks

| Risk | Prob | Impact | Mitigation |
|------|------|--------|------------|
| Ajv dep rejected by Andrea | Low | High (blocks entire ADR) | Fallback: hand-rolled validator in bash+jq (see sez 7 alternative) |
| Migration loses data for malformed legacy tasks | Medium | Medium | Migration writes `backup/tasks-board.pre-migration.json` + manual diff check |
| Agents write to file bypassing validator | Medium | Low | Pre-commit hook catches pre-push; CI catches at merge |
| Schema too strict forces real-work pauses | Medium | Medium | Phase 2 warn-only period + explicit escape hatch `SKIP_SCHEMA=1` env for emergencies |

---

## 7. Fallback: hand-rolled validator (no Ajv)

If Andrea rejects Ajv:

```bash
# scripts/validate-tasks-board.sh
set -e
FILE=automa/team-state/tasks-board.json
jq -e '.sprint_ref.number and .updated_at and .current_day.cumulative_day and (.columns | has("backlog") and has("in_progress") and has("done"))' "$FILE" > /dev/null
jq -e '[.columns[] | .[] | (.id | test("^(T|S|A)[0-9]+")) and (.status | IN("backlog","in_progress","blocked","review","done")) and (.owner | IN("team-architect","team-dev","team-tester","team-reviewer","team-auditor","team-tpm","andrea","tea")) and (.story_points | IN(1,2,3,5,8,13,21))] | all' "$FILE" > /dev/null
echo "OK"
```

Less precise errors but zero dependencies. Acceptable degraded mode.

---

## 8. POC gate

ADR-008 succeeds if Sprint 5 closure (Day 35) shows:

- Zero schema-drift related audit entries.
- Reviewer/Auditor hallucination count about tasks-board reaches 0.
- Migration from free-form to schema occurred with <2h total manual reconciliation.

---

**Drafted Day 30 (sett-5 Day 02 bridge, 2026-04-22)** — Andrea approval gate: ADR body + Ajv dep before Day 31 implementation.
