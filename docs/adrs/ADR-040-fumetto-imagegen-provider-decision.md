# ADR-040 — Fumetto Image Generation Provider Decision (Reject Leonardo.AI, Stay FLUX schnell, Path B Imagen 3 EU)

**Status**: PROPOSED — Andrea ratify Phase 7 Sprint T close iter 41+
**Date**: 2026-05-02
**Author**: orchestrator iter 30 (Sprint T docs-only ralph)
**Context**: Leonardo AI fumetti research BG agent `a47037f97cc63a7b2` completed 2026-05-02 PM, synthesized into formal decision per Andrea direct request "leonardo ai per fumetti??"
**Anti-inflation**: G45 cap. NO claim "Leonardo accepted" / "Imagen 3 deployed" / "fumetto LIVE". Status PROPOSED.

---

## §1. Decision summary (TL;DR)

| Decision | Outcome | Why |
|---|---|---|
| **Leonardo.AI Phoenix 2.0 adoption** | ❌ **REJECT** | GDPR fail K-12 minori IT (US+AU residency), pricing trap PAYG opaque, 40-100x more expensive vs status quo, no decisive quality delta |
| **Status quo Cloudflare Workers AI FLUX schnell** | ✅ **MAINTAIN** | Already integrated, frugal (~€0.50/mese 1000 sessioni), edge EU available, 4-step 1024px <1s latency, comic prompt structurable 4-panel single image |
| **Future upgrade path** | 🟡 **Path B Imagen 3 Vertex AI europe-west4** (NOT Leonardo) | GDPR clean EU residency, best text-in-image (speech bubbles balloon Italian), $0.04/img sostenibile (~€38/mese 1000 sessioni), `imageProvider` astrazione already in place `unlim-imagegen` Edge Function |
| **A/B test prerequisite** | 🔍 **20-fumetti blind preference test** docenti+ragazzi reali | Decide on data (NOT marketing claims) before any provider switch |

**Bottom line ONESTO**: status quo FLUX schnell vince frugalità + GDPR compliance + integration complete. Leonardo.AI è prodotto consumer buono ma NON la scelta giusta per ELAB K-12 italiano. Se davvero serve upgrade qualità fumetto, Imagen 3 EU è il path corretto.

---

## §2. Context — Cosa è il fumetto in ELAB

### §2.1 Fumetto session-end report (PRINCIPIO ZERO + MORFISMO)

UNLIM genera a fine sessione un **report fumetto 4-pannelli** che racconta la lezione svolta dai ragazzi sulla LIM:
- **Pannello 1**: Ragazzi attorno alla breadboard, kit ELAB Omaric protagonista
- **Pannello 2**: Errore tipico fatto durante la sessione (es. resistenza sbagliata)
- **Pannello 3**: Insight pedagogico — il docente legge dal Vol/pag verbatim
- **Pannello 4**: Circuito funzionante celebration — analogia con fenomeno fisico-naturale ("come l'acqua nel tubo")

### §2.2 Morfismo Sense 2 implications

Il fumetto è **artefatto morfico kit-coupled**:
- Componenti SVG fumetto = identici alla palette Omaric (LED rosso/giallo/verde, breadboard 400-tie, Arduino Nano R4 colors-exact)
- Mascotte UNLIM = **NON Galileo, NON robot generico** — character consistency richiede same model character cross-fumetti
- Linguaggio bubble plurale "Ragazzi," + Vol/pag verbatim citation
- Estetica didattica volumi cartacei (NO Disney cartoon, NO Material Design illustrations, NO enterprise B2B)

### §2.3 Stato attuale prod iter 30

- **Edge Function `unlim-imagegen`** v18 LIVE prod (Cloudflare Workers AI FLUX schnell)
- **Iter 26 deploy verified**: 503KB image 2.19s latency 1024×1024
- **`imageProvider` abstraction** in place — provider swap zero-friction
- **Fumetto E2E spec** `tests/e2e/03-fumetto-flow.spec.js` shipped iter 36 (2 specs Playwright)
- **Fumetto component** `src/components/lavagna/Fumetto.jsx` MVP iter S19 PR #6 merged (NOT wire-up Lavagna route iter 36 carryover)

---

## §3. Provider comparison matrix (4 candidati onesto)

| Provider | Costo/img 1024² | GDPR EU | Comic quality | Text-in-image (balloon) | Latency | Lock-in | Verdict |
|---|---|---|---|---|---|---|---|
| **Cloudflare Workers AI FLUX.1-schnell** (status quo) | ~$0.0005 (4-step) | ✅ Edge EU | 🟢 Buona | 🟡 Media (FLUX schnell limit text rendering) | <1s | 🟢 Astrazione + EU edge + portable | ✅ **TIENI** |
| **Leonardo Phoenix 2.0** (PAYG) | ~$0.02-0.05 token-based | ❌ US + AU only | 🟢 Eccellente char consistency comic native | 🟢 Buona | 5-15s peggior tier | 🔴 Token PAYG opaque + custom API + lock-in scale | ❌ **SKIP** |
| **Google Imagen 3 (Vertex AI europe-west4)** | $0.04/img | ✅ EU residency | 🟢 Eccellente | 🟢 **MIGLIORE** text rendering balloon Italian K-12 | 2-4s | 🟡 Vertex AI managed (portable via abstraction) | 🟡 **CANDIDATO #1** Path B |
| **Recraft v3 API (via fal.ai)** | $0.04/img | 🟡 EU server fal.ai opzionale | 🟢 Vector + comic style nativo, hand-drawn presets | 🟡 Buona | 2-3s | 🟡 fal.ai routing layer | 🟡 **CANDIDATO #2** Path B alt |

### §3.1 Excluded providers

- **Midjourney**: NO API ufficiale (Discord-only) → blocker integrazione enterprise
- **DALL-E 3 / GPT Image 1.5**: US-only OpenAI residency, GDPR K-12 minori IT problematic
- **ComicCrafter / Storyboard.AI**: marketing slop SaaS B2B vendor lock-in cloud-only, no real differentiation

---

## §4. Cost analysis 1000 sessioni/mese (1 fumetto/sessione)

| Provider | Costo/mese | Delta vs status quo | Note |
|---|---|---|---|
| **FLUX schnell CF Workers AI** | **~€0.50** | baseline | Già nel piano CF |
| **Leonardo Phoenix 2.0 PAYG** | **~€20-50** | +40-100× | API Basic $9 non basta + credits extra |
| **Imagen 3 Vertex AI EU** | **~€38** | +76× | $0.04/img, GDPR clean |
| **Recraft v3 API** | **~€38** | +76× | $0.04/img, comic style nativo |

### §4.1 Frugal verdict

**FLUX schnell vince 40-100× sul costo** vs alternatives. Per 1000 sessioni/mese delta vs Imagen 3 ≈ €37/mese — accettabile SE qualità fumetto è bottleneck reale UX (gate via §6 A/B test 20-fumetti preference docenti+ragazzi reali).

### §4.2 Scale projection 5000 sessioni/mese (Sprint U scale 50 scuole proiezione)

- FLUX schnell: ~€2.50/mese (still negligible)
- Imagen 3 EU: ~€190/mese (significant ma sostenibile su revenue €20/classe/mese × 50 classi = €1000/mese)
- Leonardo Phoenix: ~€100-250/mese (cost/value prohibitive, opaque PAYG)

---

## §5. GDPR analysis K-12 minori IT (BLOCKER Leonardo)

### §5.1 Leonardo.AI privacy stack ⚠️

- **Data residency**: Leonardo Interactive Pty Ltd (Australia) + Leonardo.AI Inc (USA) per [Privacy Policy](https://leonardo.ai/privacy-policy)
- **DPA available**: SCC + DPA via [Data Processing Addendum](https://leonardo.ai/data-processing-addendum/) ma **NON EU residency**
- **Sub-processor list**: not transparent come Cloudflare/Google Vertex
- **Schrems II compliance**: SCC sufficiente solo se Garante Privacy NON contesta — rischio K-12 ragazzi italiani concreto
- **PNRR/MePA gate**: capitolati pubblici scuole IT richiedono spesso EU residency stretta → Leonardo escluso a priori

### §5.2 Imagen 3 Vertex AI europe-west4 ✅

- **Data residency**: regione `europe-west4` (Eemshaven, NL) — clean EU
- **Sub-processor**: Google Ireland Limited (Dublin) — Standard Contractual Clauses + EU SCC 2021
- **Existing GDPR docs**: ELAB sub-processors list includes Google Cloud iter 31 4 docs DRAFT
- **K-12 minori safe**: data processing per Google Vertex AI EU regions Schrems II compliant

### §5.3 Cloudflare Workers AI ✅

- **Already in stack**: CF Whisper STT + FLUX schnell EU edge + Hyperdrive prod
- **Edge EU residency**: requests routed EU edge servers (Frankfurt, Amsterdam, Paris, Dublin)
- **Existing DPA**: Cloudflare DPA signed (existing GDPR sub-processor doc iter 31)
- **K-12 safe**: zero new sub-processor onboarding required

---

## §6. Acceptance gate Andrea ratify queue Phase 7

### §6.1 Mandatory pre-decision actions

1. **A/B test 20-fumetti blind preference**:
   - Generate 20 fumetti same session FLUX schnell vs Imagen 3 Vertex EU (10/10 split)
   - Measure preference docenti + ragazzi reali (NON auto-score)
   - Decide on data, NOT marketing claims
   - **Budget**: ~€0.80 Imagen 3 (20 × $0.04) + €0.01 FLUX = €0.81 total

2. **GDPR sign-off Davide**:
   - If PNRR/MePA capitolati richiedono DPA con clausole EU residency stretta → **escludi Leonardo a priori**, vai Imagen 3 europe-west4
   - Davide procurement MePA already validated current stack iter 32 sub-processors list

3. **Latency budget**:
   - Fumetto fine-sessione NON time-critical (1-3s ok)
   - FLUX schnell <1s (status quo)
   - Imagen 3 ~2-4s (acceptable)
   - Leonardo 5-15s (worst tier — UX bad)

4. **Lock-in mitigation**:
   - Mantieni `imageProvider` astrazione `unlim-imagegen` Edge Function (already in place iter 18+)
   - Provider swap zero-friction (pattern già `_shared/cloudflare-client.ts` + future `_shared/vertex-imagen-client.ts`)

### §6.2 Andrea decision tree

```
START
  │
  ▼
PNRR/MePA require strict EU residency? ─── YES ──▶ Reject Leonardo → A/B FLUX vs Imagen 3 EU
  │
  NO
  │
  ▼
A/B 20-fumetti blind preference statistically significant for upgrade? ─── YES ──▶ Imagen 3 EU
  │                                                                               (Path B raccomandato)
  NO
  │
  ▼
TIENI FLUX schnell (default) ✅ Status quo wins
```

---

## §7. Anti-pattern checklist iter 30 PROPOSED gate

- ❌ NO claim "Leonardo accepted" — REJECTED §3 + §5
- ❌ NO claim "Imagen 3 deployed" — Path B candidate, A/B test required §6.1
- ❌ NO claim "fumetto LIVE" — Component MVP iter S19, NOT wire-up Lavagna route iter 36 carryover
- ❌ NO claim "Andrea ratified" — Status PROPOSED, queue Phase 7 Sprint T close iter 41+
- ❌ NO claim "Cost matrix verified" — projection 1000 sessioni/mese teorica, ELAB not yet at 1000 sessioni MAU
- ❌ NO claim "GDPR Schrems II Imagen 3 SAFE" senza DPA review Davide MePA + capitolati attuali
- ❌ NO claim "FLUX schnell text rendering ENOUGH" senza A/B blind preference docenti+ragazzi
- ❌ NO claim "Char consistency mascotte UNLIM SOLVED" — Morfismo Sense 2 deferred Sprint U+

---

## §8. Implementation deferred Sprint U+

### §8.1 Iter 41+ entrance (post Sprint T close ratify)

If Andrea Path B approve post A/B + GDPR review:
1. **Architect ADR-040 STATUS PROPOSED → ACCEPTED** (ratify queue Phase 7)
2. **Maker-1 implementation** (~3h):
   - Create `_shared/vertex-imagen-client.ts` adapter (REST API Vertex AI europe-west4)
   - Wire-up `unlim-imagegen/index.ts` provider router (`IMAGEGEN_PROVIDER=vertex-imagen-3` env flag canary 5% → 25% → 100%)
   - Cost telemetry + GDPR audit log per call
3. **A/B test execution** (~2h): 20-fumetti same session FLUX vs Imagen 3 + UX preference form docenti+ragazzi reali
4. **Docs update**: `docs/audits/iter-41-fumetto-A-B-results.md` + `docs/audits/iter-41-fumetto-cost-projection-actuals.md`

### §8.2 Char consistency Morfismo Sense 2 (Sprint U+)

UNLIM mascotte cross-fumetti consistency richiede:
- **FLUX schnell limit**: 4-step rapid no LoRA fine-tuning → mascotte drift cross-image
- **Imagen 3 limit**: char consistency without reference image input
- **Solution Sprint U+**: ELAB mascotte canonical reference image (Tea creative + Andrea SVG) + Imagen 3 reference-image-conditioning (or FLUX dev with custom LoRA)
- **Defer**: Sprint U Cycle 4-5 task estesa, NOT iter 41 single-shot

---

## §9. References

### §9.1 Research sources (BG agent `a47037f97cc63a7b2`)

- [Leonardo.Ai Pricing](https://leonardo.ai/pricing)
- [Leonardo.AI API Plans](https://leonardo.ai/api)
- [Leonardo.Ai Privacy Policy (data US+AU)](https://leonardo.ai/privacy-policy)
- [Leonardo Data Processing Addendum](https://leonardo.ai/data-processing-addendum/)
- [Leonardo Phoenix model docs](https://docs.leonardo.ai/docs/phoenix)
- [Cloudflare Workers AI Pricing (FLUX schnell)](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [AI Image Models 2026 comparison](https://www.gradually.ai/en/ai-image-models/)
- [Recraft API](https://www.recraft.ai/api)
- [GDPR-Compliant AI: EU Data Residency](https://www.cortexiva.com/blog/gdpr-compliant-ai-eu-data-residency)

### §9.2 ELAB cross-link

- `supabase/functions/unlim-imagegen/index.ts` — Edge Function v18 LIVE FLUX schnell
- `supabase/functions/_shared/cloudflare-client.ts` — CF Workers AI client (FLUX + Whisper)
- `tests/e2e/03-fumetto-flow.spec.js` — Playwright E2E spec iter 36
- `src/components/lavagna/Fumetto.jsx` — Component MVP iter S19
- `docs/handoff/2026-04-30-iter-36-to-iter-37-handoff.md` §3 P0.1 — Fumetto wire-up carryover
- `public/policies/sub-processors.md` — GDPR sub-processors iter 31 4 docs DRAFT

### §9.3 Sister ADRs

- ADR-029 LLM_ROUTING weights conservative tune (provider routing pattern)
- ADR-031 STT migration Voxtral Transcribe 2 (provider migration GDPR EU pattern)
- ADR-037 Mistral routing narrow large tune (provider tier selection pattern)

---

## §10. Decision (PROPOSED iter 30)

**REJECT Leonardo.AI Phoenix 2.0 for ELAB K-12 italiano fumetti**.

**MAINTAIN status quo Cloudflare Workers AI FLUX.1-schnell** as default provider.

**Path B candidate Imagen 3 Vertex AI europe-west4** for future upgrade gated A/B 20-fumetti blind preference test + Davide GDPR MePA sign-off.

**Andrea ratify required Phase 7 Sprint T close iter 41+** before any implementation step.

---

**Status finale iter 30**: PROPOSED. Anti-inflation G45 cap mandate enforced. Provider rejection documented + alternative path B specified + acceptance gate explicit + cost+GDPR+latency analysis ONESTO.
