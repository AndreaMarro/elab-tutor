# UNLIM Wiki — Append-only audit log

Format: `ISO-8601 | agent | file | action | note`

```
2026-04-23T10:00Z | architect | SCHEMA.md                | create | L3 schema + conventions
2026-04-23T10:01Z | architect | index.md                 | create | catalog seed
2026-04-23T10:02Z | architect | concepts/led.md          | create | LED concept base Vol.1 pag.27
2026-04-23T10:03Z | architect | concepts/resistenza.md   | create | resistenza concept Vol.1 pag.35
2026-04-23T10:04Z | architect | concepts/legge-ohm.md    | create | legge di Ohm Vol.1 pag.45
```

NOTE: append-only. Non modificare righe precedenti. Se correzione serve, append nuova riga con action="correct:<file>".
