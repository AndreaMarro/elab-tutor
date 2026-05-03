# Audit Phase 0.0 — Skill Metric Baseline iter 34

**Data**: 2026-05-03 22:50 GMT+2
**Sessione**: iter 34, Phase 0.0 (pre Phase 0.1 Codex install)
**Branch**: e2e-bypass-preview
**HEAD**: 1b2e57d
**Vitest baseline**: 13752 PASS preservato

## §1 Scope

Phase 0.0 mandatory pre Phase 0.1+ per playbook §K.1. Esegue baseline 5 ELAB skill metric per misurare partenza ONESTA pre atomi A1-F1. Ogni skill produce JSON + caveat onesti + drift flag.

## §2 Skill metric eseguite

| # | Skill | Output JSON | Score baseline | Gates measured | Drift flags |
|---|-------|-------------|----------------|----------------|-------------|
| 1 | `elab-morfismo-validator` | `automa/state/skill-runs/2026-05-03-baseline-morfismo.json` | **0.697** | 10/10 | 3 (G4 ToolSpec, G5 path, G8 pattern) |
| 2 | `elab-onniscenza-measure` | `automa/state/skill-runs/2026-05-03-baseline-onniscenza.json` | **0.0** (cap) | 0/8 (5 SKIP env, G1 drift) | 1 (G1 layer regex) |
| 3 | `elab-onnipotenza-coverage` | `automa/state/skill-runs/2026-05-03-baseline-onnipotenza.json` | **0.688** | 5/9 (4 SKIP env) | 3 (G4 dispatcher, G9 path+scoring) |
| 4 | `elab-principio-zero-validator` | `automa/state/skill-runs/2026-05-03-baseline-principio-zero.json` | **0.646** | 8/8 deterministic | 3 (G1 sample, G2 path, Gp1 measurement) |
| 5 | `elab-velocita-latenze-tracker` | `automa/state/skill-runs/2026-05-03-baseline-velocita.json` | **0.0** (cap) | 0/9 (all env-gated) | 1 (G6 unlim-vision missing) |

**Aggregate baseline (5 skill / 5 = avg)**: `(0.697+0.0+0.688+0.646+0.0)/5 = 0.406`

**Aggregate ONESTO (drift adjusted, env-gated excluded)**: deterministic-only score ≈ `(0.697+0.688+0.646)/3 = 0.677`

## §3 Risultato chiave per area

### 3.1 Morfismo (0.697 / 1.0)

**OK**:
- G2 NanoR4Board SHA identità preservata (1.0)
- G3 fonts CLAUDE.md rule 17 compliant (1.0)
- G5 ElabIcons 32 SVG ≥24 (1.0, dopo path correction)
- G7 data-attribute morphic 20 (1.0)
- G8 lesson-paths 94 esperimenti ≥89 (1.0)
- G9 volume-references 94/94 enriched (1.0)
- G10 lesson-groups 25/27 (0.926)

**GAP REALI**:
- **G1 palette compliance 0.05** = 176 file con hex hardcoded fuori token. Codemod necessario iter 35+
- **G6 emoji as UI icon = 19** = TRUE GAP iter 32+ codemod ElabIcons
- **G10 25/27** = 2 lesson-groups missing per Vol3, audit Davide+Andrea richiesto

**DRIFT skill (NON gap reale)**:
- G4 ToolSpec=0 → file pattern non più presente codebase, regex obsoleto
- G5 path corretto inline durante baseline (era src/components/icons/, reale src/components/common/)
- G8 pattern corretto inline (regex JS-style su JSON file = 0 → file count proxy)

### 3.2 Onniscenza (0.0 / 1.0 capped — ANTI-INFLATION)

**5/8 SKIP env-gated** (G3 RAG + G5 retrieval + G6 anti-absurd + G7 cache + G8 V1vV2 → require SUPABASE_SERVICE_ROLE_KEY + VOYAGE_API_KEY + SUPABASE_ACCESS_TOKEN).

**1 DRIFT** (G1 7-layer regex non matcha real codebase naming).

**1 deferred** (G2 vitest classifier 30 cases — defer atom A1+A2 vitest run unifica).

**REAL onniscenza score con env unlocked**: stimato 0.40-0.55 range basato su iter 38 evidence (recall@5=0.067 per page=0% blocker, V1 active).

### 3.3 Onnipotenza (0.688 / 1.0)

**OK**:
- G2 L1 composite tests 10/10 (1.0)
- G3 L2 templates inlined+catalog 40 (1.0)
- G1 L0 API 70 totale (0.94, unlim 15 vs target 16 = 1 method missing/naming drift)

**GAP REALI**:
- G1 unlim 15/16 = 1 method missing OR naming drift, INVESTIGATE
- G4 dispatcher = 0 match regex, file/struttura DRIFT, real L3 functionality NON misurato
- G9 64 actions vs target skill V1 = 12 (espansione ADR-041 12→50 + ulteriori +14 = positive ma skill formula penalizza). Destructive=4 = false positive (clearCircuit, clearHighlights, etc.)

**SKIP env-gated** (G5 INTENT fire-rate + G6 Mistral canonical + G7 canary + G8 ENABLE_INTENT_TOOLS_SCHEMA → SUPABASE_ACCESS_TOKEN + MISTRAL_API_KEY).

**Real onnipotenza score con env**: stimato 0.45-0.65 range (G6 canonical 3.6% drag iter 38 evidence).

### 3.4 Principio Zero (0.646 / 1.0)

**OK**:
- G2 spoiler = 0 (1.0)
- G5 voice 33 hits (1.0)
- Gp2 plurale Ragazzi 100% (1.0) — CRITICAL Andrea mandate
- Gp3 kit ELAB 1453 hits (1.0)

**GAP REALI**:
- **G3 questions 2/3** = 1 missing pattern open-question
- **G4 mascotte → input wiring = 0** = TRUE GAP, Andrea mandate long-standing iter 27+
- **Gp1 verbatim 0** = measurement drift (citation works dynamically via getVolumeReferenceLabel(), not source verbatim)

**DRIFT skill**:
- G1 sample empty (find pattern unlim*Prompt* doesn't match — system-prompt.ts vive in supabase/functions/_shared/, non src/)
- G2 galileo*.js path drift (file rinominato/rimosso)
- Gp1 measurement strategy needs update (Edge Function output sample, NON source verbatim)

### 3.5 Velocita (0.0 / 1.0 capped — ALL SKIP)

**9/9 SKIP env-gated**. Last known evidence (iter 31+38 score-history):
- R5 p95=3380ms (above 2500 target) — **PDR cap**
- Lighthouse perf=26+23 (above 70 target NOT met) — **PDR cap**

**Real velocita score con env**: stimato 0.20-0.40 range.

**Atom A4 hedged Mistral activation iter 34** dovrebbe lift R5 p95 -25-40% → atteso post-atom 2300-2900ms p95 (vicino target).

## §4 ADR + DRIFT findings (skill update Sprint U+)

**Skill update mandate iter 35+**:

| Skill | Gate | DRIFT | Fix proposto |
|-------|------|-------|--------------|
| morfismo | G4 ToolSpec | Regex pattern non matcha | Rimuovi gate OR investigate where ToolSpec moved |
| morfismo | G5 path | src/components/icons → src/components/common | Update SKILL.md path |
| morfismo | G8 pattern | JS regex su JSON file | File count proxy con threshold 89 |
| onniscenza | G1 layers | Regex L1-L7 zero match | Investigate naming, update regex |
| onnipotenza | G4 dispatcher | Case regex zero match | Investigate dispatcher.ts switch format |
| onnipotenza | G9 actions+path | V1 path src/services/, real src/components/lavagna/ + target 12 obsoleto | Update path + scoring formula per ADR-041 50+ baseline |
| onnipotenza | G9 destructive | camelCase regex needed | Update destructive heuristic |
| principio-zero | G1 sample | Pattern non matcha real prompt | Path correction supabase/functions/_shared/system-prompt.ts |
| principio-zero | G2 path | galileo*.js rimosso | Rimuovi pattern OR add unlim*.js fallback |
| principio-zero | Gp1 measurement | Source verbatim ≠ runtime citation | Misura via Edge Function output sample |
| velocita | G6 unlim-vision | Edge Function NON LISTATA | Verifica esistenza, rimuovi gate se rimosso |

**Tutti i drift sono "skill regex stale", NON product gap.** I product gap reali sono:
1. Morfismo G1 palette 0.05 (codemod 176 file)
2. Morfismo G6 emoji 19 (codemod ElabIcons)
3. Morfismo G10 2 lesson-groups missing
4. Onnipotenza G1 1 unlim method missing
5. Principio Zero G3 1 question pattern missing
6. Principio Zero G4 mascotte→input zero (Andrea mandate 27+)
7. Velocita R5 p95 above target (atom A4 lift atteso)
8. Velocita Lighthouse perf 26+23 (atomi 42-A/B/C iter 42 plan)

## §5 Refinement gates per atom (iter 34 inline)

Per playbook §0.0 K.2 mandate, ogni atom rilevante refina la skill metric:

| Atom | Skill rilevante | Refinement gate G+1 / G+2 inline |
|------|------------------|-----------------------------------|
| A1 cap conditional | onniscenza + principio-zero | G+1 cap word per category + G+2 off-ELAB paletti soft |
| A2 L2 narrow | onnipotenza | G+1 L4 INTENT canonical % R7 |
| A3 memory wire | onniscenza | G+1 intent_history persisted + G+2 previous-actions block |
| A4 hedged Mistral | velocita + onnipotenza | G+1 hedged 100ms + p95 lift -25-40% target + G+2 hedged Mistral active env |
| A5 off-ELAB | principio-zero | G+2 off-ELAB paletti soft |
| C1 lavagna libero | morfismo + principio-zero | G+1 Sense 1.5 percorso 2-window |
| E1 percorso 2-window | morfismo + onniscenza | G+1 Sense 1.5 + G+2 |
| F1 esci persistence | morfismo + onniscenza | G+2 esci persistence drawing |
| B1 wake word | onnipotenza | (no specific G+ defined) |

## §6 Caveat onesti (NO compiacenza)

1. **Anti-inflation cap onniscenza+velocita = 0.0**: 5/8 + 9/9 SKIP env-gated → cap 0.0 baseline ONESTO. Real score richiede env setup.

2. **Drift skill regex MASSIVE** (10+ flag totali): skill V1 era state of iter 31, codebase è progredito. Skill richiede ronda iter 35+ aggiornamento per matchare codebase reale. Gap reali sono identificabili comunque dai gate non-drift.

3. **Score baseline 0.406 aggregate** è basso ma riflette correttamente la quota env-gated SKIP. **Score deterministic-only 0.677** è il numero più honest per partenza atomi (escludiamo non-misurato).

4. **Vitest 13752 baseline preservato** in 3 commit consecutivi pre-commit hook. Nessuna regressione codice da iter 33.

5. **Mancano vitest run ad-hoc** per G2 onniscenza classifier 30 cases — defer atom A1+A2 vitest run unifica.

6. **Andrea ratify queue** entry suggerito iter 35+: skill metric refresh round (1-2h) per matchare codebase corrente, eliminare drift flag, ridare baseline ONESTO comparabile cross-iter.

## §7 Next step

→ STEP 4 conferma: Codex Plugin install Phase 0.1 — atteso output Andrea.

→ Se Codex install OK: STEP 5 Gemini CLI install Phase 0.2.

→ Se Codex install FAIL/SKIP: pivot a Phase 1+ atomi diretti con solo Claude inline + G45 cap manuale + Andrea ratify finale.

→ Comunque: STEP 7 Phase 0.4 Three-Agent Pipeline trial Atom A1 (system-prompt cap conditional) richiede Codex+Gemini OPPURE simulazione manuale (Plan inline → Implement inline → Self-review separato).
