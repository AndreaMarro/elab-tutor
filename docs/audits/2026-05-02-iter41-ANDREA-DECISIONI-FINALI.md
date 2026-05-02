# 🎯 Andrea decisioni finali iter 41 — Tea audit aggregato + Mac Mini + Sprint target

**Date**: 2026-05-02 sera
**Source**: Tea audit 50 wiki concepts (111 issue) + Tea T2 4 bug volumi + Mac Mini Tailscale offline TCP + sub-agents cross-check

## 1. CRITICAL findings (NON COMPIACENZA)

### 1.1 Wiki concepts (Tea + agent cross-check)

- **126 wiki concept shipped** (NOT 50 — Tea audita solo 50, **76 NON auditati = scope creep**)
- **92 rich >500 words** (highest hallucination risk)
- **70 HIGH severity issues** confermati (citation_wrong_page dominante 65%)
- **Tea FP rate 7%** (1 marginal in 15 stratified) → audit affidabile
- **Concept duplicati flagged**: legge-ohm.md + ohm-law.md + ohm.md, blink.md + blink-led.md, capacitor.md + condensatore.md + condensatore-ceramico.md → dedup pre-W2.5

### 1.2 Volumi master source (Tea T2)

- **PDF V0.8.1 = master** (cosa studenti/docenti vedono)
- **VOLUME-3-TESTO.txt = editorial draft** (4389 lines, divergent da PDF)
- **vol3.txt extracted FROM V0.8.1** (2067 lines) — **VERIFICATO MD5 IDENTICO** vs `pdftotext "Manuale VOLUME 3 V0.8.1.pdf"`. Tea caveat agent "vol3.txt = V0.1" **ERRATO**.
- **Phase E ingest iter 41 USATO vol3.txt = V0.8.1 corretto** ✅ NO re-extract needed.

### 1.3 Vol3 Cap6 phantom esperimenti (Tea Morfismo Sense 2 violation)

PDF V0.8.1 Cap6 ha SOLO LED+pin13+Blink. Simulator dichiara 9 esperimenti = **6-7 phantom**:
- LED+Buzzer
- Sirena Buzzer
- Codice Morse con LED
- SOS Morse
- Esp4 (Due LED polizia)
- Esp5 (pulsante INPUT_PULLUP)
- Semaforo (CONFERMATO vol3:1144 — KEEP)
- Duplicate title `Cap. 6 Esp. 3` (morse vs "Cambia il numero di pin")

### 1.4 Vol3 Cap9 phantom TOC

PDF V0.8.1 pag 85-91 = SOLO header `COSA SONO I FOTOTRANSISTOR?` ripetuto 4x con NOTE blank. **VUOTO**.
TOC entry: `Capitolo 9 - ........ 85` (no titolo). Editorial unfinished.

### 1.5 Mac Mini Tailscale UDP alive MA SSH dead

- IP 100.124.198.59 hostname `mac-mini-di-progettibelli`
- tailscale ping 59ms LAN works
- TCP 22/80/443/5900/8080 tutti timeout
- macOS Apple Silicon **NO WoL via WiFi** (solo Ethernet, solo S3 sleep, NON da hang software)
- iCloud Find My NO restart hardware
- **Unica opzione OGGI: reboot fisico Strambino**

### 1.6 Sprint target REALE onesto

- 9.5/10 INFLATED dato:
  - Supabase Auth workaround
  - Brain VPS intermittent
  - Vol3 Cap9 = bug editoriale (reputazione Andrea con Giovanni/Davide)
  - 70 HIGH wiki issues NON corretti
  - Phase E ingest usato V0.1 (errato)
- **Realistic onesto: 8.5/10 in 10 giorni** post Tea fix

## 2. 🎯 ANDREA RATIFY QUEUE — 8 decisioni paste-ready

```
═══════════════════════════════════════════════════════════
DECISIONI IMMEDIATE (≤24h impact)
═══════════════════════════════════════════════════════════

DECISION 1 — Mac Mini recovery NOW (Andrea blocker autonomous loop)
  A. Davide WhatsApp/phone "vai Strambino reboot Mac Mini" (5 min Davide)
  B. Wait Andrea travel Strambino (15-30 min auto)
  C. Backup VPS host autonomous loop Hetzner €10/mo (set up new infra)
  → Andrea answer: A | B | C ?

DECISION 2 — Wiki concept duplicates dedup
  A. Auto-dedup: legge-ohm.md → keep, others delete
  B. Manual review per duplicate group
  C. Defer iter 42+ (risk minor)
  → Andrea answer: A | B | C ?

═══════════════════════════════════════════════════════════
DECISIONI EDITORIALI (Tea workflow + Andrea Davide consult)
═══════════════════════════════════════════════════════════

DECISION 3 — Workflow source volumi (Tea blocker fix application)
  A. PDF V0.8.1 master (cosa users vedono) — fix sempre verso PDF
  B. .docx editorial master Davide — fix verso .docx + re-export PDF
  C. .indd InDesign master — sales/print pipeline
  → Andrea answer: A | B | C ?
  CAVEAT: Tea NON apre PR finché non sa il master

DECISION 4 — Vol3 Cap6 phantom 6-7 esperimenti
  A. RIMUOVERE autonomy ora (6-7 lesson-paths + experiments-vol3.js entries)
  B. Badge UI "EXTRA / non in libro" preserva
  C. Aspettare Tea editorial decision finalizzata
  → Andrea answer: A | B | C ?

DECISION 5 — Vol3 Cap9 phantom TOC pag 85-91 vuoto
  A. HIDE chapter UI (no link, no TOC entry)
  B. Placeholder "in arrivo" + roadmap Vol.3 v0.9
  C. Ignore (rischio docente click → 404 visivo confusion)
  → Andrea answer: A | B | C ?

═══════════════════════════════════════════════════════════
DECISIONI WIKI CONCEPTS (W2.5 re-citation campaign blocker)
═══════════════════════════════════════════════════════════

DECISION 6 — interrupt.md (0 occurrences in tutti volumi)
  A. RIMUOVERE concept fuori scope iter 41+
  B. MARK Vol.4 anticipo (richiede roadmap Vol.4 documentata)
  C. RISCRIVERE per Vol.3 cap.X (richiede analisi più)
  → Andrea answer: A | B | C ?

DECISION 7 — pwm.md (Vol.2 0 PWM occurrences, claim falso)
  A. Rewrite per Vol.3 cap.7 (gated extract V0.8.1 first)
  B. Mark Vol.2 placeholder "previsto v2.0"
  C. RIMUOVERE concept (rischio gap retrieval)
  → Andrea answer: A | B | C ?

═══════════════════════════════════════════════════════════
DECISIONI STRATEGIC (Sprint planning + prevention)
═══════════════════════════════════════════════════════════

DECISION 8 — Sprint T close target ONESTO
  A. 8.5/10 in 10gg honest mandate (recalibrate G45 cap)
  B. 9.5 push scope creep iter 44-50+ (rischio inflation)
  C. Milestones T1=8.0 (Phase A close) + T2=8.7 (Phase B+C+D close) + T3=9.5
  → Andrea answer: A | B | C ?
```

## 3. Tea blocker resolution path

| Tea blocker | Andrea decision unblocks | Tea next action |
|-------------|--------------------------|------------------|
| Workflow source `.docx`/`.indd`/`.txt` | DECISION 3 | Tea apre PR fix verso master |
| Cap6 Vol.3 disallineamento | DECISION 4 | Tea minimo OR full Morfismo S2 fix |
| Cap9 Vol.3 phantom | DECISION 5 | Tea hide OR populate placeholder |
| Bug #1 + Bug #2 (TBD) | Andrea Tea T2 PDF read | Tea spec marker 7.8 + applica |
| W2.5 re-citation campaign | DECISION 6+7 + master source | Tea genera fix-citazioni 23 concept |

## 4. Mac Mini deferred work (post recovery)

Quando Mac Mini reachable:
1. Deploy SPEC `mac-mini-autonomous-audit-94-esperimenti` shipped
2. Cron ogni 10 min audit Playwright
3. Telegram bot ping notifications
4. Andrea check via GitHub mobile branch `mac-mini/auto-audit-{date}`

Setup pre-shipped (NO Andrea code work). Andrea solo `bash scripts/mac-mini-audit-experiment.sh v1-cap6-esp1` test manual prima cron.

## 5. Phase E V0.1 vs V0.8.1 caveat (NON COMPIACENZA)

**Phase E iter 41 ingest 718 chunks usato `vol3.txt` V0.1 OUTDATED**.

Real Vol.3 master = `Manuale VOLUME 3 V0.8.1.pdf` (più recente).

**Iter 42+ atomic fix**:
1. `pdftotext "Manuale VOLUME 3 V0.8.1.pdf" vol3-v0.8.1.txt` — DONE BG
2. Re-run pdftotext per-page extraction Vol.3 v0.8.1
3. Re-ingest Mistral chunks Vol.3 only (ricommitta page metadata corretti)
4. Cleanup old vol3 chunks senza page (DELETE source='vol3' WHERE metadata->>'page' IS NULL)
5. Page coverage final verify ≥80% (currently 48.1%)

## 6. Anti-inflation G45 mandate iter 41 enforced

- ❌ NO claim "Sprint T close 9.5 achieved" — DECISION 8 inflated documented
- ❌ NO claim "Phase E LIVE 80% coverage" — 48.1% measured + V0.1 wrong source
- ❌ NO claim "Wiki concepts production-ready" — 70 HIGH issues + 76 NON auditati
- ❌ NO claim "Mac Mini autonomous loop active" — TCP timeout SSH dead
- ❌ NO claim "Tea T2 fix applied" — Tea blocker decisions Andrea ratify
- ✅ ONESTO: provider-mix R5 lift confirmed -49% p95 prod measured
- ✅ ONESTO: A3 RPC applied prod + smoke PASS
- ✅ ONESTO: 6 ADRs PROPOSED documented + Andrea queue 8 decisions paste-ready

## 7. Realistic Sprint T close path 10 giorni

| Day | Atom | Lead | Effort |
|-----|------|------|--------|
| 1 | Andrea decisions 1-8 | Andrea | 1h |
| 1-2 | Tea T2 fix volumi (post DECISION 3) | Tea + Andrea | 2-3h |
| 2-3 | W2.5 re-citation 23 concept (post DECISION 6+7) | Tea + auto-fix | 10h |
| 3 | V0.8.1 re-extract + re-ingest Mistral | Andrea | 1h auto |
| 3-5 | V2.1 canary 25%→100% soak + manual hallucination 50-prompt | Andrea | 24-72h |
| 5-7 | C3 widened heuristic re-wire canary post C2 monitor | Andrea | 24-48h |
| 6 | Phase A FULL close audit (post bench pacing fix re-run) | Andrea+Claude | 1h |
| 6 | D2 9-cell wake word run | Mac Mini (post recovery) | 2h |
| 7-8 | 94 esperimenti audit Playwright autonomous Mac Mini | Mac Mini | 24h continuous |
| 9 | Lighthouse perf optim (lazy mount react-pdf + mammoth) | Andrea | 3h |
| 10 | Andrea Opus G45 final ratify Phase 7 + close audit | Andrea | 1h |

**Sprint T close 8.5/10 ONESTO realistic 10gg post-Andrea decisions queue**.

9.5/10 path richiederebbe iter 50+ con additional optim Lighthouse + 76 wiki concept fix + Vol3 Cap9 contenuto editoriale Davide.

## 8. Cross-references

- Plan iter 41: `docs/superpowers/plans/2026-05-02-iter-41-velocita-onniscenza-onnipotenza-wake-word.md`
- Tea wiki audit: `/Users/andreamarro/Downloads/SUMMARY.md` + `issues.csv` + `concepts-inventory.csv`
- Tea T2 audit: `/Users/andreamarro/Downloads/T2-Report-Bug-Editoriali-Volumi.md`
- Sub-agent reports:
  - `/tmp/tea-audit-cross-check-2026-05-02.md` (wiki cross-check)
  - `/tmp/tea-T2-macmini-impact-2026-05-02.md` (T2 + WoL)
- ADRs iter 41: 034-039 in `docs/adrs/`
- Phase 0 baseline: `docs/audits/PHASE-0-baseline-2026-05-02.md`
- Phase 1 G45 Opus: `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md`
- Final cumulative state iter 41: `docs/audits/2026-05-02-iter41-FINAL-cumulative-state.md`
- Mac Mini SPEC: `docs/specs/SPEC-mac-mini-autonomous-audit-94-esperimenti-2026-05-02.md`
- Orchestration research: `docs/audits/2026-05-02-iter41-orchestration-research-onesto.md`
