# UNLIM Wiki — Index (LLM reads first)

**Versione**: 0.1.0 POC (sett-4 Day 01)
**Last updated**: 2026-04-22
**Related**: `SCHEMA.md` (conventions) · `log.md` (audit trail) · `docs/architectures/ADR-006-karpathy-llm-wiki-three-layer.md`

---

## Scope

Questo file è il **catalog content-oriented** letto dal LLM prima di ogni query. Non ripete contenuto: elenca dove trovarlo + crosswalk fra directory.

Sett-4 POC status: **SKELETON** (pre-ingest). Contenuto arriva Day 03-05 via batch ingest Together AI.

---

## Struttura directory

```
docs/unlim-wiki/
├── SCHEMA.md           # REGOLE + conventions (leggere prima di ogni ingest/query/write)
├── index.md            # QUESTO FILE (catalog)
├── log.md              # AUDIT append-only (ingest/query/lint)
├── concepts/           # 20-30 file concetti evolutivi
├── experiments/        # 92 file (1 per esperimento)
├── lessons/            # 27 file (1 per lezione)
├── students/           # N file per studente (gitignored, Supabase-backed)
├── classrooms/         # N file per classe (gitignored, Supabase-backed)
└── errors/             # pattern errori comuni + misconceptions
```

---

## 1. Concepts (docs/unlim-wiki/concepts/)

**Purpose**: analogie evolutive + glossario + cross-ref. Crescono con session log.

**POC sett-4 target** (Day 05): >=20 file

**Stato attuale**: 0/20+ (skeleton, pre-ingest)

Elenco previsto (da volume analysis + glossario RAG):

### Elettronica base
- led · resistenza · tensione · corrente · polarita · legge-ohm · cortocircuito · massa

### Componenti kit
- breadboard · nano-r4 · led-rgb · buzzer · pulsante · potenziometro · fotoresistenza · servo · motore-dc

### Arduino concepts
- digital-pin · analog-pin · pwm · adc · variabile · loop-setup · serial-monitor · led-builtin

---

## 2. Experiments (docs/unlim-wiki/experiments/)

**Purpose**: 1 file per esperimento con testo letterale volume + componenti + concetti correlati + errori + analogie vincenti.

**POC sett-4 target** (Day 04): >=80/92 file

**Stato attuale**: 0/92 (skeleton, pre-ingest)

Fonte verità: `src/data/volume-references.js` (92 esperimenti enriched con bookText).

Volume breakdown:
- Vol1: 38 esperimenti (cap1-cap10, intro + LED + Ohm + digital)
- Vol2: 27 esperimenti (analog + sensor + PWM + servo)
- Vol3: 27 esperimenti (integrazione + capstone + robot)

---

## 3. Lessons (docs/unlim-wiki/lessons/)

**Purpose**: 1 file per lezione del libro (non card separate, narrativa continua).

**POC sett-4 target** (Day 05): 27/27 file

**Stato attuale**: 0/27 (skeleton, pre-ingest)

Fonte verità: `src/data/lesson-groups.js` (27 Lezioni raggruppate per concetto).

---

## 4. Students (docs/unlim-wiki/students/)

**Purpose**: compound memory per studente. GDPR-aware: gitignored + Supabase RLS + 90gg retention.

**POC sett-4 scope**: NOT in scope — deferred sprint-5 (Tea onboard 30/04).

**Stato attuale**: SCHEMA.md only, no student files.

---

## 5. Classrooms (docs/unlim-wiki/classrooms/)

**Purpose**: teacher insights per classe. GDPR-aware (same rules students).

**POC sett-4 scope**: NOT in scope — deferred sprint-5.

**Stato attuale**: SCHEMA.md only.

---

## 6. Errors (docs/unlim-wiki/errors/)

**Purpose**: pattern errori comuni + misconceptions frequenti.

**POC sett-4 target** (Day 06 opt): >=2 file seed (`common-misconceptions.md` + `frequent-patterns.md`)

**Stato attuale**: 0 file.

---

## Entry points per use case

### Use case A: docente prepara lezione N
1. Read `lessons/lezione-NN.md`
2. Follow links to `experiments/*.md`
3. Read `concepts/*.md` referenced
4. Optional: `classrooms/<class_key>.md` for class context

### Use case B: studente in sessione fa domanda
1. Read `students/<uuid>.md` (progress context)
2. Read touched `experiments/<id>.md` + `concepts/<name>.md`
3. Append analogia vincente to `concepts/*.md` if applicable
4. Append session summary to `students/<uuid>.md` (end session)

### Use case C: audit Principio Zero v3 compliance
1. Grep `docs/unlim-wiki/**/*.md` for `Docente,?\s*leggi|Insegnante,?\s*fai` → expect 0
2. Read `log.md` for query/ingest history
3. Run lint cron (sprint-5)

### Use case D: LLM tool-use query (sprint-4 S4.1.5 minimal)
1. Read this `index.md`
2. LLM tool_use `read_wiki_file(path)` selecting 3-5 files
3. LLM answer with citations
4. Append `log.md` entry

---

## Cross-cutting concerns

### Principio Zero v3 enforcement
Ogni file DEVE passare grep `Docente,?\s*leggi|Insegnante,?\s*fai` = 0. CI gate pre-merge.

### Citation requirement
Ogni contenuto da volume richiede `[volume:VolNpM]` marker. Lint detects missing.

### Compound growth
Wiki cresce con sessioni. `students/*.md` + `classrooms/*.md` + `concepts/*.md` analogie alternative = principale differenziatore vs RAG statico.

---

## Version history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-04-22 | Skeleton init sett-4 Day 01 (ADR-006 POC) |
