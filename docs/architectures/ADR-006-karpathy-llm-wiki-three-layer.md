# ADR-006 — Karpathy LLM Wiki three-layer pattern (POC sett-4)

**Status**: Proposed (POC sett-4 Day 01, accept gate = S4.1.6 integration tests PASS Day 06)
**Date**: 2026-04-22
**Sprint day**: 22 cumulative / sett-4 Day 01
**Owner**: Andrea Marro
**Supersedes**: none
**Related**: `docs/research/2026-04-22-karpathy-llm-wiki.md` (paper trail), ADR-002 (Gemini→Together switch), Epic 4.1 sett-4 contract

## Context

ELAB RAG esistente = 549 chunk in `src/data/rag-chunks.json` + pgvector 246 chunk live (Supabase). Fragment retrieval cold ogni query. Gap identificati post sett-3:

1. **Memoria studente volatile** — `unlimMemory` 3-tier ma no compounding cross-session persistente
2. **Dashboard docente no aggregates** — classroom insight ricostruito ogni run
3. **Analogie vincenti non capitalizzate** — LLM reinventa ogni sessione
4. **Audit trail Principio Zero v3 assente** — violazioni "Docente, leggi..." non tracciabili post-hoc
5. **Contraddizioni tra volumi** — Vol1 vs Vol2 vs Vol3 drift non rilevato

Karpathy pattern (gist 2026-04-22) propone three-layer architecture:

1. **Raw Sources** (immutable) — LLM no touch
2. **Wiki** (LLM-owned markdown) — concepts/entities/summaries cross-ref
3. **Schema** (CLAUDE.md-like) — conventions + ingest workflow + maintenance

Core claim: shift bookkeeping burden da umani a LLM. Wiki è persistent compounding artifact.

## Decision

Adottiamo Karpathy three-layer come **POC sett-4** con design ibrido RAG+Wiki (NO sostituzione RAG). Scope Sprint 4 Option B LOCKED (Epic 4.1, 15 SP).

### Three-layer mapping ELAB

| Layer | Karpathy | ELAB implementation |
|-------|----------|---------------------|
| L1 Raw (immutable) | original docs | `src/data/rag-chunks.json` + `src/data/volume-references.js` + PDF volumi fisici |
| L2 Wiki (LLM-owned) | `wiki/*.md` | `docs/unlim-wiki/` (concepts + experiments + lessons + students + classrooms + errors) |
| L3 Schema (rules) | `README.md` / `CLAUDE.md` | `docs/unlim-wiki/SCHEMA.md` (conventions + ingest + lint) |

### Directory structure (canonical, POC scope)

```
docs/unlim-wiki/
├── SCHEMA.md                         # conventions + ingest workflow + lint rules
├── index.md                          # catalog content-oriented (LLM reads first)
├── log.md                            # append-only audit (every ingest/query/lint)
├── concepts/                         # LLM-evolving analogie + glossario
│   ├── led.md                        # ~20-30 file total Fase 3
│   ├── resistenza.md
│   ├── legge-ohm.md
│   └── ...
├── experiments/                      # 92 file (1 per esperimento)
│   ├── v1-cap6-esp1.md               # include: pagina volume, bookText, componenti, errori comuni
│   └── ...
├── lessons/                          # 27 file (1 per lezione — lesson-groups.js)
│   ├── lezione-01.md
│   └── ...
├── students/                         # 1 file/studente attivo (compound memory)
│   ├── SCHEMA.md                     # template privacy-aware
│   └── [uuid].md                     # gitignored (privacy), Supabase-backed
├── classrooms/                       # 1 file/classe (teacher insights)
│   ├── SCHEMA.md
│   └── [class_key].md                # gitignored, Supabase-backed
└── errors/
    ├── common-misconceptions.md
    └── frequent-patterns.md
```

### Ingest operations (ownership)

| Operation | Trigger | Writer | Cost |
|-----------|---------|--------|------|
| `wiki_ingest_experiments` | Day 03-04 POC one-shot | Together AI (Llama 3.3 70B) | ~$5 one-shot |
| `wiki_ingest_lessons_concepts` | Day 04-05 POC one-shot | Together AI | ~$3 one-shot |
| `wiki_ingest_session` | fine sessione studente (future sprint-5) | Edge Function | ~$0.002/session |
| `wiki_query` | user domanda (future sprint-5) | Edge Function | ~$0.005/query |
| `wiki_lint` | cron settimanale (future sprint-5) | Edge Function | ~$0.10/run |

**Sprint-4 POC scope**: batch ingest experiments + lessons + concepts. Edge Functions `wiki_query` + `wiki_ingest_session` deferred sprint-5 (Epic 4.1 S4.1.5 builds minimal `unlim-wiki-query` con tool-use pattern solo).

### Tier design (why hybrid not replace)

```
TIER 1 IMMUTABLE (RAG pgvector existing — NO TOUCH)
├── Volumi 92 esperimenti + pagine esatte (Principio Zero v3 citazione)
├── Glossario termini tecnici
└── FAQ pre-generate
    ↓
TIER 2 MUTABLE (Wiki markdown — NEW)
├── docs/unlim-wiki/concepts/*.md      # analogie evolutive (log winning analogies)
├── docs/unlim-wiki/experiments/*.md   # enriched: RAG + session lessons
└── docs/unlim-wiki/lessons/*.md       # pattern docente
    ↓
TIER 3 PERSONAL (Wiki markdown — NEW, sprint-5)
├── docs/unlim-wiki/students/[uuid].md   # compound memory (GDPR Supabase)
└── docs/unlim-wiki/classrooms/[key].md  # teacher insights
    ↓
TIER 4 AUDIT (append-only log — NEW)
└── docs/unlim-wiki/log.md               # compliance Principio Zero v3
```

**Why hybrid**: RAG pgvector retrieval <100ms, wiki markdown read 3-5 file ~500ms. RAG = precision (citazione pagina), Wiki = context (compound memory + analogie). Combine in Edge Function query layer.

## Consequences

### Positive
- Differenziatore competitivo: nessun competitor ha LLM Wiki compounding
- Audit trail Principio Zero v3 via `log.md` (post-hoc verificabile)
- Analogie vincenti capitalizzate (no reinvent)
- Base sprint-5 ONNIPOTENZA: 3 tools wiki_query / wiki_ingest / wiki_lint = 3/33
- POC sett-4 isolato a `docs/unlim-wiki/` — no regression rischio codebase src/

### Negative
- `index.md` può crescere >5K tok se non sharded per dir (mitigation: `index.md` per dir)
- `log.md` cresce lineare (mitigation: monthly rotation `log-2026-05.md` + `log-index.md`)
- Drift wiki vs volumi (LLM inventa) — mitigation: ogni pagina DEVE citare fonte `[volume:Vol1p29]`, lint cron enforces
- GDPR students/ — mitigation: `.gitignore` students/*.md (except SCHEMA.md), Supabase storage RLS + anonymization uuid + retention 90gg
- Costo ingest Together AI ~$8 one-shot (accepted budget sett-4)
- Latency aggiunta query hybrid ~+400ms (RAG <100ms baseline → Wiki+RAG ~500ms) — mitigation: skip wiki for simple queries, cache hot concepts

### Neutral
- Sprint-4 POC validates pattern prima di sprint-5 commit full stack
- Scope ribilanciabile fine Day 06: se POC validates → sprint-5 ONNIPOTENZA 33 tools, se POC fail → revert scope, deferred PDR theme successivo

## Alternatives considered

### A. Pure RAG expansion (status quo)
- Increase pgvector chunk count 549 → 2000+
- Pro: latency <100ms invariata
- Contro: no compound memory, analogie non capitalizzate, no audit trail
- **Rejected**: non risolve gap 1-5

### B. Structured database (Supabase tables per concept/experiment/student)
- Pro: query SQL veloci, schema rigido
- Contro: LLM non "scrive wiki", serve ORM layer, meno flessibile per analogie evolutive
- **Rejected**: Karpathy claim "LLM excels at bookkeeping" richiede markdown nativo

### C. Full Karpathy replacement RAG
- Pro: unified source of truth
- Contro: latency +400ms per ogni query (anche domande semplici), citazione pagina volume meno precisa
- **Rejected**: Principio Zero v3 richiede citazione pagina esatta atomica

### D. Hybrid RAG+Wiki (CHOSEN)
- Pro: RAG precision + Wiki compound, LLM-native markdown, audit trail, base sprint-5
- Contro: due sistemi paralleli (complexity ↑), latency hybrid higher per complex queries
- **Accepted**: bilancia trade-off, POC sett-4 validates

## Acceptance criteria (POC gate Day 06)

- [ ] `docs/unlim-wiki/SCHEMA.md` exists, conventions enumerate 10+ rules
- [ ] `docs/unlim-wiki/index.md` catalog stub con 4+ top-level sezioni
- [ ] `docs/unlim-wiki/log.md` init append-only header
- [ ] Script `scripts/wiki-ingest-experiments.mjs` genera >=80/92 experiments `*.md` (Day 04)
- [ ] Script `scripts/wiki-ingest-lessons.mjs` genera 27/27 lessons `*.md` (Day 05)
- [ ] Concepts batch >=20 file `*.md` generated (Day 05)
- [ ] Edge Function `unlim-wiki-query` tool-use minimal responds 200 (Day 06)
- [ ] 10+ integration tests wiki pipeline PASS (Day 06)
- [ ] `log.md` contiene entry per ogni ingest batch (auditable)
- [ ] Zero PZ v3 violations in generated wiki (grep `Docente,?\s*leggi` returns 0)

Auditor score gate: >=7.0/10 composite. Below → rollback POC, defer PDR successivo.

## Risks + mitigations (ongoing monitoring sprint-4)

| Risk | Prob | Impact | Mitigation |
|------|------|--------|------------|
| index.md >5K tok mangia context | High | Medium | Shard per dir, lazy load |
| log.md lineare no limit | High | High | Monthly rotation + aggregate |
| Wiki drift vs volumi (LLM invent) | Medium | High | Citation enforcement + lint cron + PZ v3 grep gate |
| GDPR students/ leak | High | High | gitignore + Supabase RLS + anonymization + 90gg retention |
| Together AI ingest overrun budget | Low | Low | Batch notturno one-shot, content-addressable cache |
| Wiki contradicts itself cross-refs | Medium | Medium | Query prompt forces read wiki BEFORE answer, lint detect |

## Notes

POC scope deliberately narrow: ingest + minimal query. Full tool-use agent loop (`wiki_query` + `wiki_ingest_session` + `wiki_lint`) = sprint-5 ONNIPOTENZA 33-tools main delivery.

Sprint-4 validates: (a) ingest cost <$10, (b) generated wiki zero PZ v3 violations, (c) integration test Edge Function tool-use pattern responds coerently.

If POC FAIL Day 06 gate: rollback `docs/unlim-wiki/` commit, preserve ADR-006 "Rejected" status, pivot sprint-5 theme.
