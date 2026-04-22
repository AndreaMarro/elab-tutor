# ELAB UNLIM Wiki — SCHEMA

**Versione**: 0.1.0 POC (sett-4 Day 01)
**Status**: Draft → stabilizza fine sett-4
**Owner**: Andrea Marro + LLM (Together AI Llama 3.3 70B ingest)
**Related ADR**: `docs/architectures/ADR-006-karpathy-llm-wiki-three-layer.md`

---

## Principio Zero (vincolante su TUTTO il wiki)

Il docente è il tramite. UNLIM è lo strumento del docente. Gli studenti lavorano sui kit fisici ELAB.

**REGOLE WIKI che derivano da Principio Zero v3**:

1. **MAI** il wiki scrive "Docente, leggi..." o "Insegnante, fai..." — zero meta-istruzioni imperative al docente
2. **SEMPRE** il wiki parla in linguaggio utile al docente per costruire discorso con i ragazzi
3. **SEMPRE** citazione pagina volume esatta `[volume:Vol1p29]` quando disponibile
4. **MAI** il wiki inventa esperimenti o componenti non presenti nei kit ELAB fisici
5. **SEMPRE** linguaggio accessibile bambini 8-14 (max 3 frasi + 1 analogia tipico, 60 parole)

Verifica automatica: grep `Docente,?\s*leggi` or `Insegnante,?\s*fai` sul wiki intero = 0 match sempre. Integrato in CI pre-merge.

---

## 1. File conventions

### 1.1 Naming

| Category | Pattern | Example |
|----------|---------|---------|
| Experiment | `experiments/v{N}-cap{M}-esp{X}.md` | `v1-cap6-esp1.md` |
| Lesson | `lessons/lezione-{NN}.md` | `lessons/lezione-01.md` |
| Concept | `concepts/{kebab-case}.md` | `concepts/legge-ohm.md` |
| Student (gitignored) | `students/{uuid-v4}.md` | `students/550e8400-...md` |
| Classroom (gitignored) | `classrooms/{class_key}.md` | `classrooms/3A-liceo-galileo.md` |
| Error | `errors/{kebab-case}.md` | `errors/common-misconceptions.md` |

### 1.2 Markdown flavor

- CommonMark + GFM (tables, task lists, fenced code)
- NO HTML inline eccetto `<details>` per collapsible sections
- NO emoji salvo `✅`/`❌`/`⚠️` in status checkboxes
- Line length soft 120 char, no hard wrap dentro paragrafi

### 1.3 Front-matter YAML (obbligatorio per tutti eccetto log.md e index.md)

```yaml
---
id: v1-cap6-esp1                    # stable identifier
type: experiment                     # experiment|lesson|concept|student|classroom|error
created: 2026-04-22T08:00:00Z        # ISO 8601 UTC
updated: 2026-04-22T08:00:00Z
volume_refs:                         # array citazioni fonte (Principio Zero v3)
  - "Vol1:p.29"
kit_components:                      # SOLO componenti kit ELAB fisici
  - "LED rosso 5mm"
  - "Resistenza 470Ω"
  - "Nano R4"
difficulty: 1                        # 1-5 Tea analysis scale
concepts:                            # cross-refs to concepts/*.md
  - "led"
  - "legge-ohm"
lessons:                             # cross-refs to lessons/*.md
  - "lezione-01"
ingest_cost_usd: 0.02                # tracking Together AI cost per file
ingest_model: "meta-llama/Llama-3.3-70B-Instruct-Turbo"
pz_v3_compliant: true                # grep-verified boolean
---
```

### 1.4 Required body sections per type

**experiments/*.md**:
1. `## Obiettivo` (1-2 frasi per docente)
2. `## Testo dal volume` (citazione LETTERALE `bookText` dal `volume-references.js`)
3. `## Componenti kit ELAB`
4. `## Schema circuito` (descrizione testuale + riferimento SVG se esiste)
5. `## Concetti chiave` (links `[concepts/led.md]`)
6. `## Errori comuni` (da `errors/*.md` + session log)
7. `## Analogie vincenti` (da session log, growth over time)

**lessons/*.md**:
1. `## Obiettivo lezione`
2. `## Esperimenti raggruppati` (links `[experiments/*.md]`)
3. `## Concetti copertur` (links)
4. `## Flusso narrativo libro` (come presentato nel volume fisico)

**concepts/*.md**:
1. `## Definizione breve` (1 frase bambino 8-14)
2. `## Analogia principale`
3. `## Fonti volumi` (citazioni)
4. `## Analogie alternative` (append-only, session log)
5. `## Concetti correlati` (links)

---

## 2. Cross-reference format

### 2.1 Internal wiki links

```markdown
Vedi [concetto LED](concepts/led.md) e [esperimento Vol1 cap6](experiments/v1-cap6-esp1.md).
```

### 2.2 Volume citations (Principio Zero v3 enforcement)

```markdown
Come spiega il Vol. 1 a pagina 29, [citazione letterale dal `bookText`]. [volume:Vol1p29]
```

Machine-readable marker `[volume:VolNpM]` required ovunque c'è citazione pagina. Lint enforces.

### 2.3 RAG chunk references

```markdown
[rag:chunk-a3f2] evidenzia che LED in polarizzazione inversa non conduce.
```

Chunk IDs from `src/data/rag-chunks.json`. Bridge pattern durante hybrid RAG+Wiki queries.

---

## 3. Ingest workflow

### 3.1 Batch ingest experiments (Day 03-04 sprint-4)

Script `scripts/wiki-ingest-experiments.mjs`:

```
FOR each experiment in src/data/volume-references.js:
  1. Load bookText + components + volume page
  2. LLM call Together AI (Llama 3.3 70B):
     - System prompt: SCHEMA conventions + PZ v3 rules
     - User prompt: generate experiments/{id}.md with required sections
  3. Validate PZ v3 grep (no "Docente, leggi")
  4. Validate required sections present
  5. Validate front-matter schema
  6. Write file if PASS, skip + log if FAIL
  7. Append log.md entry: {timestamp, file, status, cost_usd, model}
```

Budget: ~$5 total (92 files × ~$0.05 avg).

### 3.2 Batch ingest lessons + concepts (Day 04-05)

Same pattern, input = `src/data/lesson-groups.js` for lessons, extracted concept list from ingested experiments for concepts.

### 3.3 Incremental ingest session (sprint-5, NOT sett-4)

Triggered end-session student. Reads session transcript + student file + touched experiments. Writes enriched files. Append log.

---

## 4. Query workflow

### 4.1 Hybrid RAG+Wiki query (sprint-5 minimal POC sett-4 Day 06)

```
Input: user_query + student_uuid? + class_key?

1. RAG retrieve top-3 chunks (pgvector, <100ms)
2. Read docs/unlim-wiki/index.md (top-level catalog)
3. Identify relevant wiki files (concept, experiment, student, classroom)
4. Read 3-5 identified wiki files (cache hot files)
5. LLM call with RAG chunks + Wiki pages + context collector output
6. Response must include:
   - Answer (3 frasi + 1 analogia, <60 parole)
   - Citations: [volume:VolNpM] + [wiki:file.md]
7. Append log.md entry: {timestamp, query, files_read, rag_chunks_used, cost_usd}
```

### 4.2 Minimal POC `unlim-wiki-query` (sett-4 S4.1.5)

Solo Wiki, no hybrid. Tool-use pattern Anthropic-style: LLM decides which wiki file(s) to read via tool calls. Validates pattern before sprint-5 full integration.

---

## 5. Lint workflow (sprint-5 cron, sett-4 manual)

### 5.1 Checks

1. **PZ v3 compliance**: grep `Docente,?\s*leggi` → 0
2. **Front-matter schema**: YAML valid, required fields present
3. **Volume citations**: ogni experiment file has `volume_refs` non-empty
4. **Cross-refs integrity**: every link `[file.md]` resolves
5. **Stale detection**: `updated` >90gg ago → flag
6. **Orphan detection**: no file links TO it → flag (excluding index.md, log.md, SCHEMA.md)
7. **Contradictions**: same concept defined differently across files → flag (semantic, sprint-5 LLM lint)
8. **Kit component validation**: listed components exist in BOM kit ELAB (manual Tea approval sprint-5)

### 5.2 Output

`docs/unlim-wiki/lint-report-YYYY-MM-DD.md` with PASS/WARN/FAIL per check + suggested fixes.

---

## 6. Maintenance rules

### 6.1 Rotation

- `log.md` rotation monthly: `log-2026-04.md`, `log-2026-05.md`, ..., summary `log-index.md`
- Students 90gg retention (GDPR): cron delete `students/[uuid].md` if last access >90gg

### 6.2 Privacy + GDPR

- `students/*.md` gitignored EXCEPT `students/SCHEMA.md`
- `classrooms/*.md` gitignored EXCEPT `classrooms/SCHEMA.md`
- Supabase storage RLS teacher-only access + anonymized uuid
- Retention 90gg enforced via cron Supabase

### 6.3 Backup + recovery

- Git history = wiki versioning (public wiki)
- Supabase backup daily (private tiers)
- Rollback pattern: `git revert` wiki commit + Supabase point-in-time restore

---

## 7. File ownership + authority

| Who | Can write |
|-----|-----------|
| LLM ingest scripts | experiments/*.md, lessons/*.md, concepts/*.md (generate + enrich) |
| LLM query runtime | log.md (append only) |
| LLM session ingest | students/[uuid].md, classrooms/[key].md, experiments/*.md (append lessons) |
| Human (Andrea + Tea) | SCHEMA.md, index.md, errors/*.md, ADR updates |
| Lint cron | lint-report-YYYY-MM-DD.md |

**Never** LLM writes: SCHEMA.md, index.md top structure, volume-references.js (Tier 1 immutable).

---

## 8. Versioning + compat

- SCHEMA version bump when breaking changes (major.minor.patch)
- Front-matter `schema_version` field (future)
- Migration scripts `scripts/wiki-migrate-{from}-to-{to}.mjs` per major bump

Current version: **0.1.0 POC**.

---

## 9. Examples

### 9.1 Valid experiments/v1-cap6-esp1.md skeleton

```markdown
---
id: v1-cap6-esp1
type: experiment
created: 2026-04-22T08:00:00Z
updated: 2026-04-22T08:00:00Z
volume_refs:
  - "Vol1:p.29"
kit_components:
  - "LED rosso 5mm"
  - "Resistenza 470Ω"
  - "Breadboard"
  - "Nano R4"
difficulty: 1
concepts:
  - "led"
  - "legge-ohm"
lessons:
  - "lezione-01"
ingest_cost_usd: 0.02
ingest_model: "meta-llama/Llama-3.3-70B-Instruct-Turbo"
pz_v3_compliant: true
---

## Obiettivo
Accendere un LED con una resistenza di protezione, introducendo la legge di Ohm con l'analogia della ricetta speciale. [volume:Vol1p29]

## Testo dal volume
[citazione letterale bookText da src/data/volume-references.js]

## Componenti kit ELAB
- LED rosso 5mm
- Resistenza 470Ω
- Breadboard
- Nano R4

## Schema circuito
Nano D13 → Resistenza 470Ω → LED anodo (lato lungo) → LED catodo → GND Nano.

## Concetti chiave
- [LED](../concepts/led.md)
- [Legge di Ohm](../concepts/legge-ohm.md)

## Errori comuni
- LED al contrario (anodo/catodo invertiti) — vedi [errors/common-misconceptions.md]
- Resistenza omessa → LED brucia in 2 secondi

## Analogie vincenti
- Ricetta speciale: la resistenza è la "dose giusta" di ingrediente elettrico (Vol1 p.29 letterale)
```

### 9.2 Valid concepts/led.md skeleton

```markdown
---
id: led
type: concept
created: 2026-04-22T08:00:00Z
updated: 2026-04-22T08:00:00Z
volume_refs:
  - "Vol1:p.29"
  - "Vol1:p.30"
related_concepts:
  - "polarita"
  - "legge-ohm"
used_in_experiments:
  - "v1-cap6-esp1"
  - "v1-cap6-esp2"
pz_v3_compliant: true
---

## Definizione breve
Il LED è una lucina che si accende quando la corrente passa nel verso giusto.

## Analogia principale
Come una porta: si apre solo in una direzione. Se provi dall'altra parte, resta chiusa. [volume:Vol1p29]

## Fonti volumi
- Vol. 1 p. 29: introduzione LED
- Vol. 1 p. 30: polarità anodo/catodo

## Analogie alternative
- (session 2026-04-22 — analogia vincente classe 3A) "Il LED è come un cancelletto elettrico: si apre solo se la spingi dal lato giusto"

## Concetti correlati
- [Polarità](polarita.md)
- [Legge di Ohm](legge-ohm.md)
```

---

## 10. Glossary SCHEMA-local

- **POC**: Proof of Concept (sett-4 scope)
- **PZ v3**: Principio Zero versione 3 (no meta-istruzioni al docente, docente tramite)
- **Hybrid RAG+Wiki**: query combina pgvector retrieval + wiki markdown reads
- **Ingest**: batch generazione wiki files da fonti esistenti (volumi + session transcript)
- **Lint**: health check periodico wiki (contradictions, stale, orphan, PZ v3)
- **Tier 1-4**: architecture layers (Raw/Wiki/Personal/Audit)
