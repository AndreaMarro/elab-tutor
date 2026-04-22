# UNLIM Wiki — Audit Log (append-only)

**Format**: ogni entry = una riga `| timestamp | operation | target | status | metadata |`.

**Rules**:
- APPEND only (never edit past entries, never reorder)
- Monthly rotation: fine mese → sposta in `log-YYYY-MM.md` + `log-index.md` updated
- CI pre-merge blocks if entries deleted/reordered (content-addressable check)
- Machine-parseable markdown table

---

## 2026-04

| Timestamp | Operation | Target | Status | Metadata |
|-----------|-----------|--------|--------|----------|
| 2026-04-22T08:15:00Z | init | wiki skeleton | OK | `ADR-006 created, SCHEMA 0.1.0, index stub, 6 dirs created, sett-4 Day 01` |
