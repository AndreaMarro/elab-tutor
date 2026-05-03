# Audit Atom A4 + A5 — Hedged Mistral env activation + Off-ELAB paletti soft iter 34

**Data**: 2026-05-03 23:45 GMT+2
**Sessione**: iter 34 Phase 1+ atomi
**Branch**: e2e-bypass-preview
**HEAD pre-A4-A5**: e733ccc (Atom A2)
**Vitest baseline**: 13770 PASS preservato (no test changes)
**Skill metric**: velocita G1 R5 latency relevant + principio-zero G3 questions relevant

## §1 Atom A4 — ADR-038 hedged Mistral LIVE env activation

### 1.1 Spec briefing playbook §4.3

> "A4 ADR-038 hedged Mistral LIVE env activation (0.5h + Tier 2 latency 10 prompts)"

### 1.2 Reality check

**Code GIÀ shipped iter 41 Phase A** in `supabase/functions/_shared/llm-client.ts:390-431`:
- Gate `ENABLE_HEDGED_LLM=true` (default false safe) → hedged 100ms stagger
- Gate `ENABLE_HEDGED_PROVIDER_MIX=true` (default false) → primary Mistral + hedged Gemini Flash-Lite (decorrelates upstream queue variance)
- Lift target: -600-1100ms p95 per ADR-038 §3
- Cost: +30% per chat call (acceptable trade-off latency)
- Phase A iter 41 R5 v76 evidence: p95 4879ms hedged-both-Mistral baseline

### 1.3 Atom A4 questa sessione

**Nessun code change** — A4 = ENV ACTIVATION on Supabase project (Andrea action, requires `SUPABASE_ACCESS_TOKEN` + linked project).

**Andrea action paste-ready**:
```bash
SUPABASE_ACCESS_TOKEN=sbp_... npx supabase secrets set \
  ENABLE_HEDGED_LLM=true \
  ENABLE_HEDGED_PROVIDER_MIX=true \
  --project-ref euqpdueopmlllqjmqnyb
```

**Verify post-set**:
```bash
SUPABASE_ACCESS_TOKEN=sbp_... npx supabase secrets list --project-ref euqpdueopmlllqjmqnyb | grep HEDGED
# Expected output: ENABLE_HEDGED_LLM=true + ENABLE_HEDGED_PROVIDER_MIX=true
```

**Bench post-activation** (Tier 2 spec):
```bash
node scripts/bench/run-sprint-r5-stress.mjs 2>&1 | tee /tmp/r5-hedged.log
# Compare p95 vs iter 41 baseline 4879ms — atteso lift -600-1100ms = ~3700-4200ms p95
```

### 1.4 Caveat onesti A4

1. **NO env activation eseguita questa sessione**: Andrea ratify required (productions secrets edit).
2. **Cost +30%**: ogni chat call hedged invoca 2 provider (Mistral + Gemini Flash-Lite). Acceptable per Sprint T close target latency, monitora budget mensile.
3. **Hedged provider-mix dipende Gemini Flash-Lite available**: GEMINI_API_KEY env required (verificare presenza Supabase secrets post-activation).
4. **Lift NON garantito**: ADR-038 §3 evidence 22 prompt sample. Real lift R5 50-prompt re-bench post-activation. Mai claim "p95 ≤2500ms" senza bench output ID.

## §2 Atom A5 — Off-ELAB paletti soft system-prompt clause

### 2.1 Spec briefing playbook §4.3

> "A5 Off-ELAB paletti soft system-prompt clause (0.5h + Tier 2 3 off-topic prompts)"

### 2.2 Modifica `supabase/functions/_shared/system-prompt.ts` BASE_PROMPT rule §6

**PRIMA**:
```
6. Se l'utente chiede cose fuori tema, rispondi: "Sono specializzato in elettronica! Chiedimi dei circuiti."
```

**DOPO** (+~6 LOC):
```
6. Se l'utente chiede cose fuori tema (calcio, gaming, social, politica, meteo), USA SOFT DEFLECT educational PIVOT a kit ELAB:
   NON rifiutare seccamente, MA tono caldo + 1 frase + invito a esperimento concreto sul kit. Esempi:
   - "Ragazzi, oggi mi specializzo in elettronica. Vediamo insieme un esperimento sul vostro kit ELAB? C'è il LED che vi piacerà!"
   - "Ragazzi, sport e elettronica si incontrano nei sensori! Avete mai visto un orologio digitale dello stadio? Costruiamone uno semplice sul vostro kit?"
   Mai dire solo "Sono specializzato in elettronica" senza pivot kit (Sense 2 Morfismo: tutto → kit fisico).
```

### 2.3 Behavior change

- Vecchia rule: hard deflect "Sono specializzato in elettronica! Chiedimi dei circuiti."
- Nuova rule: soft deflect + plurale "Ragazzi" opener + kit ELAB mention + invito esperimento concreto + analogia educational pivot

### 2.4 Joint con Atom A1

A1 `getCategoryCapWordsBlock(category='off_topic', capWords=40)` produce instruction simile:
> "1 frase + soft deflect a kit ELAB / circuiti / volumi (Sense 2 Morfismo). Tono caldo, NON sgridare. Suggerisci alternativa educational."

A5 estende BASE_PROMPT rule §6 esplicitamente — applies anche quando ENABLE_CAP_CONDITIONAL=false (default OFF). Ridondanza desiderata: defense-in-depth (BASE_PROMPT clause + A1 helper) ensures soft deflect happens regardless of env flag state.

### 2.5 Caveat onesti A5

1. **NO bench measurement**: 3 off-topic prompt manual test pending Andrea (Atom A5 spec Tier 2 evidence).
2. **LIVE on next Edge Function deploy**: BASE_PROMPT change applies SEMPRE (no env gate). Compatible con Atom A1 helper (additive).
3. **Examples may overlap**: BASE_PROMPT example 1 ("Ragazzi, oggi mi specializzo... C'è il LED che vi piacerà!") è LO STESSO di A1 helper off_topic example. Intentional consistency.
4. **No regression risk**: rule §6 stays with same goal (deflect off-topic), only enriches HOW to deflect. Mistral/Gemini follow rule §6 sentence-by-sentence — change is text expansion not contradiction.

## §3 Skill metric refinement

### 3.1 elab-velocita-latenze-tracker G1 R5 p95 (post A4 env true)

- Baseline iter 41: p95 4879ms hedged-both-Mistral
- Post A4 hedged-provider-mix env true: stima p95 3700-4200ms (-600-1100ms)
- Sprint T close target: p95 ≤2500ms (gap residuo 1200-1700ms requires further A4+iter 35+ optims)

### 3.2 elab-principio-zero-validator G3 questions / Gp3 kit ELAB (post A5 deploy)

- G3 baseline iter 34: 2 questions (1 missing) → A5 esempi adds ≥3 question patterns "Avete mai visto", "Costruiamone uno"
- Gp3 baseline iter 34: 1453 hits (over-cover) → A5 BASE_PROMPT explicit kit pivot raddoppia coverage system-wide

## §4 Andrea ratify queue iter 34 entries NEW

1. **A4 ENV activation Supabase**: `ENABLE_HEDGED_LLM=true` + `ENABLE_HEDGED_PROVIDER_MIX=true` (verify GEMINI_API_KEY presente)
2. **A4 R5 50-prompt re-bench post-activation**: p95 lift verification baseline 4879ms → atteso 3700-4200ms
3. **A5 deploy Edge Function v81+**: BASE_PROMPT v3.2 → v3.3 (rule §6 soft-deflect extension) requires deploy gate
4. **A5 manual test 3 off-topic prompt**: "parliamo di calcio" + "Fortnite" + "TikTok trend" → verify soft deflect + plurale Ragazzi + kit pivot

## §5 Anti-pattern G45 enforced

- ✅ NO claim "Hedged Mistral LIVE prod" (env default OFF, Andrea ratify required)
- ✅ NO claim "Off-ELAB soft deflect LIVE" (BASE_PROMPT change requires deploy)
- ✅ NO claim "p95 ≤2500ms achievable iter 34" (gap 1200-1700ms requires multi-iter optim)
- ✅ Caveat onesti documentati §1.4 + §2.5

## §6 Next step

→ Atom A3 intent_history persist Supabase (Andrea ratify SQL migration gate ALTER TABLE student_progress)
→ Atomi UI B1 wake word + C1 lavagna libero + E1 percorso 2-window + E2 PassoPasso + F1 esci persistence (frontend React, larger scope)
→ STEP 10 final commit batch + push origin + CLAUDE.md sprint footer
