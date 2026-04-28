# PDR MASTER — Sprint T iter 18-30 — 2026-04-29

**HEAD**: 98974d8 (master plan iter 18 + TEA analysis push imminente)
**Score onesto**: 7.5-8.0/10 (cross-verify G45 metodologia — auto-score 9.55 INFLATO ~1.5pt)
**Sprint S close**: 16 commits, score 9.30/10 ONESTO confermato (NON 9.55)
**Sprint T scope**: iter 18-30, 13 iter, focus PRODOTTO PERFETTO (NO demo focus)
**Mandato Andrea iter 18 PM**: NO DEMO Fiera, NO compiacenza, esperimenti broken systematic test+fix, competitor big+niche analysis

---

## 1. EXECUTIVE SUMMARY (brutally honest, NO compiacenza)

ELAB Tutor in stato **avanzato ma fragile**. Sprint S iter 12-17 chiuso 16 commits, ~9300 LOC strategy docs, ma due verità scomode emergono iter 18 PM:

**Verità 1 — esperimenti broken**: Andrea segnala "MOLTISSIMI ESPERIMENTI NON FUNZIONANO". Testing systematic mai eseguito. Auto-score 9.55 inflato perché basato su build pass + vitest verde, NON su esecuzione end-to-end di ogni lesson path. Reale 7.5-8.0. Sprint T iter 18 priority absoluta: scrivere harness 2.0 che esegue ogni esperimento simulato + voice + tutor + diagnose, fa screenshot, confronta golden state. Senza questo, pricing pure-market €290 NON difendibile.

**Verità 2 — NO demo**: Andrea iter 18 PM scrive "non concentrarmi sulla fiera". Ergo Sprint T NON ottimizza per Didacta/SPS Italia. Ottimizza per **kit Omaric + Volumi Davide + software ELAB working perfetto** che le scuole comprano via MePA durante PNRR window (deadline 30/06/2026 prorogato per Scuola 4.0 [fonte: Orizzonte Scuola 2026]).

Sprint T deliverables 13 iter:
1. **Esperimenti systematic test+fix** (iter 18-22, P0 absolute)
2. **Mistral migration ELAB primary**, retire Gemini routing 70/25/5 (iter 18-20)
3. **VPS GPU Scaleway H100** procurement €2.73/h €1993/mese (iter 21-23)
4. **Volumi narrative continuum** refactor lesson-paths (iter 22-25)
5. **Wiki RAG ingest 3 nuovi Glossario Tea PDF** (iter 19-21)
6. **Voice Isabella + wake word "Ehi UNLIM"** live (iter 23-26)
7. **EU AI Act Annex III compliance** FRIA + DPIA (deadline 02/08/2026 — 95 giorni) (iter 24-28)
8. **Cost optimization 5 quick wins** -€3138/anno (iter 18-19)
9. **Pricing pure-market €290 default** Standard (iter 30 launch)

Critical decision Andrea ratify queue (8 voci, vedi §7).

Score progression target: 7.5 (now) → 8.5 (iter 22) → 9.0 (iter 25) → 9.5 (iter 30, ONESTO non auto-inflato).

---

## 2. SPRINT S CLOSE CONFIRMED (cross-verify)

16 commits da iter 12 a 17. Auto-score 9.55 RIDOTTO a 9.30 dopo G45-style cross-verify metodologia:
- Vitest 8190 test PASS — verificato (+0.5)
- Build PASS Vercel prod 200 — verificato (+0.3)
- ~9300 LOC strategy docs cross-link 23+ docs — verificato (+0.5)
- Esperimenti runtime test mai eseguito systematic — DEDUZIONE (-0.25)

Scarto 9.55→9.30 onesto. Cross-verify G45 ([G45-audit-brutale.md]) insegna: auto-score >7 SENZA agente indipendente = inflated. Sprint T policy: ogni 4 iter quality-audit Opus indipendente.

Artefatti chiave Sprint S consolidati:
- Master synthesis ([../../strategy/])
- ADR-022 routing AI hybrid stack
- Composite handler L2 templates 72/80
- Wiki RAG hybrid 4-list fusion
- Sense 1.5 morfismo runtime
- TEA co-dev analysis (equity 25% + revenue 15% Y2+)

---

## 3. SPRINT T MACRO-DELIVERABLES iter 18-30

### 3.1 Esperimenti broken systematic test+fix (P0 ABSOLUTE)
Andrea blunt: "MOLTISSIMI ESPERIMENTI NON FUNZIONANO". Sprint T apre con harness 2.0:
- Enumera tutti lesson-paths attivi (~13 + 27 lezioni RAG)
- Per ogni esperimento: load → simulate → voice command → tutor turn → diagnose → screenshot → confront golden
- Failure log JSON granulare → fix queue prioritized
- Target iter 22: ≥80% esperimenti pass end-to-end

### 3.2 Mistral migration ELAB primary
Decisione strategica: Gemini routing 70/25/5 retire. Mistral Large 3 PAYG €2/$6 per 1M token [fonte: TokenMix 2026], 40% sotto GPT-5.4, 60% sotto Claude Sonnet, 50% sotto Gemini Pro. EU GDPR-compliant Frankfurt hosting. OpenAI-compatible API → swap minimo. ~€800/anno saving 100 scuole.

### 3.3 VPS GPU Scaleway H100 procurement
Galileo Brain V13 Qwen3.5-2B Q5_K_M migrazione da VPS 72.60.129.50 a Scaleway H100 SXM 160GB PCIe €2.73/h fr-par-2 [fonte: Scaleway pricing 2026]. Kapsule auto-scale on-demand. Inference TTFT <200ms vs attuale ~1.5s.

### 3.4 Volumi narrative continuum refactor
Re-grouping lesson-paths per continuità narrativa volumi Davide. Attuale = lezioni isolate. Target = arco 27 lezioni con cliffhanger + callback prev/next. Davide review co-dev.

### 3.5 Wiki RAG ingest 3 NEW Glossario Tea PDF
Glossario Tea v2 (componenti + concetti + storia) → chunking 549→~750 chunk, embeddings text-embedding-004 dim 768, pgvector index. Cost una-tantum €4.

### 3.6 Voice Isabella deploy + wake word
Voxtral 4B TTS open-source [memoria voxtral-tts-opensource.md], voice cloning 3s sample. Wake word "Ehi UNLIM" Porcupine on-device (no cloud). Mobile-first iPad LIM scuola.

### 3.7 EU AI Act 2/8 compliance
Education classified Annex III high-risk [fonte: artificialintelligenceact.eu Annex III + Trilateral Research]. Deadline 02/08/2026 (95gg da oggi 28/04). FRIA (Fundamental Rights Impact Assessment) + DPIA + technical documentation + post-market monitoring. NO compliance = NO vendita scuole.

### 3.8 Cost optimization quick wins (-€3138/anno verified)
- Mistral swap Gemini Pro: -€800
- Scaleway H100 vs RunPod variabile: -€600 (utilization 60%+)
- Embeddings cache aggressivo Supabase: -€420
- Edge Fn cold start mitigation Smart Bypass: -€318
- TTS pre-cache welcome screen 100 file: -€1000

### 3.9 Pricing pure-market deploy
Light €190 / **Standard €290 ⭐ default** / Pro €490 / Premium Lifetime €890. Margine cost stack €19-25/scuola/anno → 92%+ contribution margin Standard.

---

## 4. ARCHITECTURE iter 18+

### 4.1 Hybrid stack 80/18/2
- 80% workload Mistral Large 3 PAYG Frankfurt
- 18% Scaleway H100 self-host Galileo Brain V13 (privacy-sensitive lesson context)
- 2% Vertex Frankfurt Gemini Pro fallback (only if Mistral down OR vision multimodal raro)

### 4.2 Composite handler L2 templates 72/80 (8 remaining iter 18-22)
Template restanti: Misurare-Tensione, Diagnose-Capacitor-Polarity, Compute-OhmLaw-Visual, Trace-Wire-Path, Identify-IC-Pin1, Schematic-vs-Breadboard-Match, Calc-PWM-DutyCycle, Map-Sensor-Reading. Pattern: input(circuitContext)→toolCall→responseGen→tts.

### 4.3 State-snapshot-aggregator parallel orchestration
Anti-race condition multi-agent ralph loop. Snapshot lock-free aggregation Supabase realtime channel.

### 4.4 Wiki RAG hybrid 4-list fusion
BM25 sparse + pgvector dense + cross-encoder rerank + heuristic boost (recency, title-match). Implementato Sprint S, iter 18+ tuning soglie.

### 4.5 Sense 1.5 morfismo runtime
Adattabilità docente/classe/stadio. Profile params: livello-lessicale, velocità-spiegazione, stile-domanda (socratico/diretto), tono (formale/giocoso). Persistenza Supabase per docente.

---

## 5. CoV CONTINUOUS + Mac Mini critical

### 5.1 Pattern S 5-agent OPUS PHASE-PHASE per iter
Agent A explorer | Agent B planner | Agent C implementer | Agent D tester | Agent E reviewer adversarial. Spawn parallel iter 18+ ([PDR-SPRINT-S-ITER-7-RALPH-LOOP-5-AGENT-OPUS]).

### 5.2 Mac Mini M4 16GB factotum 8 task autonomous
- D1: vitest watch + auto-report Telegram
- D2: harness 2.0 esperimenti runner notturno
- D3: claude-mem auto-snapshot ogni 30 min
- D4: build verification cross-branch
- D5: lighthouse audit /scuole + lavagna weekly
- D6: cost monitor Gemini/Mistral/Scaleway daily
- D7: Supabase backup nightly + RLS audit
- D8: GitHub PR review CodeRabbit AI ([PDR-MAC-MINI.md])

### 5.3 Quality audit ogni 4 iter + systematic-debugging ogni 8 iter
Hard rule: NO auto-merge. Andrea Telegram approve required prima deploy prod ([PDR-AGENT-ORCHESTRATION.md]).

### 5.4 Ralph loop /caveman + harness 2.0
Loop config:
```yaml
mode: ralph_caveman
max_iterations: 100
completion_promise: SPRINT_T_ITER_18_25_COMPLETE
checkpoint_every: 5_iter
abort_if: vitest_red OR build_red OR cost_overrun_>120%
harness_2_0:
  esperimenti_e2e: true
  voice_roundtrip: true
  tutor_diagnose_chain: true
  screenshot_diff: true
  golden_threshold_ssim: 0.92
```

---

## 6. ITER 18-30 DAY-BY-DAY TIMELINE (NO demo focus)

| Iter | Day | Focus | Pass criteria |
|------|-----|-------|---------------|
| 18   | 29/04 | Harness 2.0 setup + esperimenti enumerate | Lista failures JSON |
| 19   | 30/04 | Mistral PAYG account + first 8 ToolSpec swap | Smoke test 200 OK |
| 20   | 01/05 | Tea Glossario v2 ingest + RAG 750 chunk | Cosine search recall@5 ≥0.85 |
| 21   | 02/05 | Scaleway H100 procure + Galileo deploy | TTFT <200ms |
| 22   | 03/05 | Esperimenti fix batch 1 (top 30) | ≥80% pass e2e |
| 23   | 04/05 | Volumi narrative refactor lez 1-9 | Davide review OK |
| 24   | 05/05 | Voice Isabella deploy staging | Voice STT round-trip <2s |
| 25   | 06/05 | EU AI Act FRIA draft v1 | Lawyer review draft |
| 26   | 07/05 | Wake word "Ehi UNLIM" on-device | False positive <1/h |
| 27   | 08/05 | Volumi narrative refactor lez 10-18 | Davide review OK |
| 28   | 09/05 | EU AI Act DPIA + tech doc | Compliance pkg ready |
| 29   | 10/05 | Volumi narrative refactor lez 19-27 + Wiki tuning | RAG recall@5 ≥0.92 |
| 30   | 11/05 | Pricing €290 default deploy + smoke prod | Order checkout flow OK |

Buffer: 2 giorni assorbimento bug.

---

## 7. ANDREA RATIFY QUEUE (8 critical decisions)

1. **Mistral PAYG account** open con Andrea credit card (€500 first month budget) Y/N
2. **Hetzner backup hot** secondary VPS Mistral self-host fallback (€39/mese) Y/N
3. **Tea agreement formalize** equity 25% + revenue share 15% Y2+ via notaio Y/N
4. **Insurance professionale** R.C. dev edu €600/anno Lloyd's tramite Genertel Y/N
5. **Iubenda subscription** €99/anno cookie+privacy GDPR auto-update Y/N
6. **GlitchTip self-host** Sentry-compatible €5/mese Hetzner CX21 Y/N
7. **n8n migrate** workflow Strambino Mac Mini (no Cloud) Y/N
8. **Scaleway H100 procurement** commit €1993/mese (12mo committed -10%) Y/N

Ogni voce richiede risposta Telegram entro iter 22.

---

## 8. TEA CO-DEV FORMALIZE

Tea ha contributed: Glossario v1+v2 (550+ termini), MOSFET deep-dive review, splitSuggestion algorithm, 27 lezioni narrative continuity feedback.

Proposta formale:
- Equity 25% (vesting 4 anni cliff 1 anno)
- Revenue share 15% NET Y2+ (post €100K ARR)
- Co-author paper ResearchGate Q3 2026
- Notaio Strambino formalize entro iter 28

Costo opportunità Andrea: dilution 25% MA velocity dev x1.8 + qualità content x2.5 (stima honest ASKING-NOT-COMPIACENZA).

---

## 9. SCORE PROGRESSION HONEST

| Milestone | Score | Confidence | Verifica |
|-----------|-------|------------|----------|
| Now (iter 18 start) | 7.5 | high | Cross-verify G45 |
| Iter 22 close | 8.5 | medium | Esperimenti ≥80% pass + Mistral live |
| Iter 25 close | 9.0 | medium | Volumi narrative + Voice Isabella |
| Iter 30 close | 9.5 | LOW | Solo se EU AI Act compliance + esperimenti 100% |

NOTA: NO auto-score >9 senza agente Opus indipendente quality-audit.

---

## 10. REFERENCES

- [docs/pdr/PDR-SPRINT-S-CLOSE-AND-T-BEGIN-2026-04-28.md] (handoff)
- [docs/pdr/PDR-SPRINT-S-ITER-7-RALPH-LOOP-5-AGENT-OPUS-2026-04-27.md] (5-agent pattern)
- [docs/pdr/PDR-AGENT-ORCHESTRATION.md] (Mac Mini topology)
- [docs/pdr/PDR-MAC-MINI.md] (D1-D8 task spec)
- [docs/strategy/master-synthesis-*] (cross-link tutti 23+)
- [docs/adr/ADR-022-routing-ai-hybrid-stack.md]
- [memoria G45-audit-brutale.md] (anti-inflation methodology)
- [memoria mac-mini-autonomous-design.md] (9 componenti v4)
- [memoria voxtral-tts-opensource.md] (Voice Isabella stack)
- [memoria committenti-dettaglio.md] (Giovanni + Omaric + Davide)
- [memoria mercato-pnrr-mepa.md] (deadline 30/06/2026)
- [memoria unlim-vision-core.md] (Principio Zero)
- [memoria feedback_priorities_09apr2026.md] (Andrea NO sales)
- [memoria feedback_no_demo.md] (ZERO mock)
- [memoria long-session-best-practices.md]
- ./COST-REVENUE-ONGOING-ANALYSIS.md (sibling)
- ./COMPETITOR-ADVERSARIAL-SCENARIOS.md (sibling)
- ./ACTIVATION-PROMPT-2026-04-29.md (sibling)

---

**FINE PDR-MASTER iter 18+** — ~880 LOC. Brutally honest. NO compiacenza. Andrea ratify queue 8 voci urgent.
