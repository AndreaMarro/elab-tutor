# Tea Brief Iter 31 — Sprint T close + Sprint U Cycle 2 + UAT manuale

**Date**: 2026-05-02
**Da**: Andrea + orchestrator iter 30 docs-only
**A**: Tea
**Mode**: ralph deep iter 31 entrance
**Cross-link**: master plan `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`

---

## §1. Allineamento — 4 parole chiave

Prima di iniziare ogni task Tea, ricorda queste 4 definizioni canoniche:

1. **PRINCIPIO ZERO** — docente=tramite, UNLIM=strumento, ragazzi=kit fisici Omaric. Plurale "Ragazzi," + Vol/pag verbatim + kit ELAB mention OBBLIGATORI.
2. **MORFISMO** — software ↔ kit Omaric ↔ volumi Davide cartacei lockstep. Palette Navy #1E4D8C / Lime #4A7A25 / Orange #E8941C / Red #E54B3D. Font Oswald (titoli) + Open Sans (body) + Fira Code (codice). NanoR4Board SVG identico Arduino Nano kit. Iconografia derivata disegni volumi (NO icone stock).
3. **ONNISCENZA** — UNLIM sa tutto contesto attivo + storia + volumi + sessioni. 7-layer aggregator V1 prod.
4. **ONNIPOTENZA** — UNLIM esegue qualunque azione su simulatore + Arduino + Scratch via linguaggio naturale. INTENT parser surface-to-browser.

**Mandate**: ogni Tea contribution must respect Sense 2 triplet (kit Omaric + volumi cartacei + software lockstep) + PRINCIPIO ZERO §1 (linguaggio plurale).

---

## §2. Stato attuale prod (commit `69c9453`)

- **Sprint T iter 38 carryover** chiuso 2026-05-01 score 8.5/10 ONESTO G45 cap
- **Sprint T iter 39 close + Phase 0+1 Andrea ratify** chiuso 2026-05-02 score 8.0/10 ONESTO ricalibrato post Opus indipendente review (3 inflation flags)
- **Sprint U Cycle 1** audit close — 7 agents dispatched, top finding L2 catch-all blocker `selectTemplate:121-153` 93/94 esperimenti broken (fix iter 39 commit `430659a` already landed)
- **Iter 30 docs-only** chiuso 2026-05-02: ADR-040 Leonardo + Mac Mini gap analysis + 13 decisioni priority matrix
- **Iter 31 entrance**: ralph deep session 7-Phase 6-agent OPUS Pattern S r3 caveman pending Andrea ratify Phase 0

### §2.1 Vital signs

- vitest 13474 PASS baseline preserve
- build PASS 1m1s + 32 PWA precache 4825KB
- Edge Function unlim-chat v72 LIVE prod
- Voxtral TTS clone Andrea Italiano LIVE prod
- Pixtral Vision Mistral EU FR LIVE prod
- Mistral routing 65/25/10 LIVE prod (84% Mistral hit)
- 1881 RAG chunks ingested (page=0% blocker iter 38+ → Phase E pivot Mistral mistral-embed iter 39 commit `c575aa2`, 718 chunks 0 errors $0.018)
- Wiki 126 concepts (50 verified Tea T2 audit + 70 HIGH issues + 76 NON-auditati spot-check 45-55% hallucination rate)
- 89/94 lesson-paths reali (5 missing iter 36 D3)
- 87 lesson-paths singolare imperative violations + 91 missing "Ragazzi," + 94 unlimPrompts "studente" framing (Sprint U Cycle 2 fix iter 31 Phase 2)
- Lighthouse perf 26+23 FAIL (Atom 42-A modulePreload shipped commit `69c9453`, Vercel deploy verify pending Andrea Decisione #10)

---

## §3. 8 task Tea iter 31 (priority order)

### T1 — Wiki cleanup batch (priority HIGH, ~6h)

#### T1.1 — 70 HIGH issues T2 audit cleanup (~4h)

- Source: T2 SUMMARY.md + concepts-inventory.csv + issues.csv (Tea sent iter 30 PM)
- Action: per ogni HIGH issue, decide: regenerate concept Mac Mini batch OR delete orphan OR manual edit
- Output: `docs/unlim-wiki/log.md` cleanup entries + cleanup batch commit message
- CoV: post-cleanup, run skill `elab-onniscenza-measure` G4 wiki count + verify ≥126 OR new total
- Coordinazione Andrea: shared spreadsheet decisions log

#### T1.2 — 76 NON-auditati Top-10 priority spot-check expansion (~2h)

- Top-10: hc-sr04, keypad, eeprom, tmp36, rfid, gps, bluetooth, mpu6050, stepper, shift-register
- Spot-check iter 30 PM: 45-55% hallucination rate confirmed (hc-sr04 cites p.130 vol3 max p.114 phantom)
- Action: verify Vol/pag citations against Davide volumes physical PDFs
- Output: 10 audit md files `docs/unlim-wiki/audits/{concept}.md` con verdict + razionale
- Coordinazione Davide: cross-check page numbers verified physical

### T2 — UAT manuale 94 esperimenti checklist (priority HIGH, ~12h split 3 settimane)

#### T2.1 — Setup UAT environment (~30min)

- Read `docs/handoff/2026-05-02-mac-mini-professore-inesperto-persona-iter-31.md` Stages 1-7 atomic checklist
- Replicate persona-prof workflow MacBook con Tea-as-tester
- Output: `docs/uat/tea-checklist-template.md` shared template

#### T2.2 — Vol1 38 esperimenti UAT (~5h split 1 settimana)

- Per ogni esperimento, run Stages 1-7 (~65 min/esperimento total ~40h Tea OR split 1h/giorno × 5 settimane realistic)
- Bucket: design issues / estetica issues / funzionalità issues
- Output: `docs/uat/vol1/v1-cap*-esp*-tea.md`

#### T2.3 — Vol2 27 esperimenti UAT (~3h split 1 settimana)

- Output: `docs/uat/vol2/v2-cap*-esp*-tea.md`

#### T2.4 — Vol3 29 esperimenti UAT (~3h split 1 settimana)

- Vol3 5 missing reali identificare (iter 36 D3 Mac Mini finding) — Andrea coordination
- Output: `docs/uat/vol3/v3-cap*-esp*-tea.md`

#### T2.5 — Aggregator + comparison Mac Mini persona-prof (~30min)

- Output: `docs/uat/_aggregator-vs-mac-mini-persona-prof.md`
- Compare findings: Tea-as-tester vs Mac Mini persona-prof spec → identify gaps

### T3 — Tres Jolie volumi parallelismo audit (priority MEDIUM, ~8h)

- Source: `[elab-tres-jolie.md](http://elab-tres-jolie.md)` Cartella materiale ELAB completo
- Action: parallelismo software ↔ volumi Davide cartacei capitolo-per-capitolo
- Per Vol1 cap6 LED, Vol1 cap7 sensori, Vol2 cap8 PWM, ecc:
  - Mockup confronto schermata software vs pagina volume
  - Table 600 LOC per cap: pagina | testo | software-equivalent | mismatch flag
- Output: `docs/audits/tres-jolie-parallelismo-{vol}-cap{N}.md`
- Coordinazione Davide: identifica drift narrativa che richiede ADR-027 Vol3 narrative refactor (Sprint U Cycle 5+)

### T4 — Cronologia ChatGPT-style sidebar prototype (priority MEDIUM, ~4h)

- Source: Mac Mini Task 5 in autonomous plan iter 39+
- Reference design: ChatGPT sidebar 4 buckets (Oggi/Ieri/Settimana/Più vecchie)
- Mockup:
  - Bucket per UNLIM-generated session description (existing `unlim-session-description` Edge Function iter 35)
  - Badge stato (sospesa / cap raggiunto / vecchia)
  - Bulk select + delete + archive
  - Search query
- Output: `docs/design/cronologia-chatgpt-style-mockup.{md,figma}` con 5 frames + interaction flow
- Coordinazione WebDesigner-1 caveman iter 32+: Tea mockup → WebDesigner implements

### T5 — Glossario port main app (priority MEDIUM, ~3h)

- Source: Tea homepage Glossario iter 31-32 close carryover (CLAUDE.md)
- Reference: `https://elab-tutor-glossario.vercel.app` separate deployment
- Action: port content + design + interactivity main app `src/components/glossario/Glossario.jsx`
- Hash route `#glossario` con `lazy mount` (Atom 42-A modulePreload filter compatible)
- Touch target ≥44px + WCAG AA contrast + LIM-projection font ≥14px
- Output: PR pull-request to `e2e-bypass-preview` branch
- Coordinazione Andrea: code review pre-merge

### T6 — 4 GIF scimpanze + ScimpanzeFallback SVG audit (priority LOW, ~2h)

- Source: iter 36 A6 EasterModal `public/easter/scimpanze-{1,2,3,4}.gif` placeholder
- Action: create or curate 4 GIF rotation scimpanze + ScimpanzeFallback SVG
- Estetica: LIM-projection contrast + child-safe content + Brand voice "Affidabile / Didattico / Accogliente"
- Output: 4 GIF ottimizzate + 1 SVG fallback assets
- Coordinazione: Andrea brand voice approval

### T7 — Persona-prof Mac Mini cycle review settimanale (priority HIGH, ~2h × N settimane)

- Source: Mac Mini cron `*/10 * * * *` LIVE iter 31+ post Decisione #1 ratify
- Action: weekly review of `docs/audits/auto-mac-mini/_persona-prof/_dashboard-persona-prof.html`
- Validate findings: hallucinated vs real issues
- Flag for Andrea: critical findings need immediate attention
- Output: `docs/uat/tea-weekly-review-{date}.md`

### T8 — Brand voice content generation /scuole + onboarding (priority MEDIUM, ~4h)

- Source: iter S19+ landing /scuole + onboarding 3-click iter G39+
- Action: review existing content + suggest brand voice improvements per "Affidabile / Didattico / Accogliente"
- Plurale "Ragazzi," consistency NOT singular "ragazzo/studente"
- Vol/pag verbatim citation NON parafrasi
- Kit ELAB Omaric explicit menzioni
- Davide co-authorship credit
- Output: `docs/marketing/brand-voice-content-tea-{section}.md`

---

## §4. CoV mandate Tea contributions

Ogni Tea task DEVE produce CoV evidence:

1. **CoV-1 baseline**: leggi `automa/baseline-tests.txt` → preserve count post-PR
2. **CoV-2 sense 2 triplet**: ogni decisione visiva DEVE rispettare palette + font + iconografia volumi (Test Morfismo §C)
3. **CoV-3 PRINCIPIO ZERO**: ogni testo aggiunto DEVE plurale "Ragazzi" + Vol/pag verbatim quando applicable + kit ELAB mention quando contesto fisico
4. **CoV-4 anti-fake**: NO mock data + NO demo data (Andrea iter 21 mandate `feedback_no_demo.md`)
5. **CoV-5 LIM-readability**: ogni schermata 1080p ≥14px font + contrasto WCAG AA + 5m distance verifiable

Failure ANY CoV → revert + Andrea coordination.

---

## §5. Anti-pattern checklist Tea

- ❌ NO claim "wiki cleanup done" senza Mac Mini batch regenerate verify
- ❌ NO claim "UAT 94 esperimenti complete" senza all 3 Vol files shipped
- ❌ NO claim "Glossario LIVE main app" senza PR merged + Andrea review
- ❌ NO claim "Cronologia mockup ratified" senza Andrea + Tea joint review
- ❌ NO claim "Tres Jolie parallelismo OK" senza Davide cross-check signature
- ❌ NO push direct main mai (PR sempre)
- ❌ NO bypass `--no-verify` mai
- ❌ NO emoji icons fuori HomePage cards Andrea-OK iter 36
- ❌ NO singolare "ragazzo / studente" — sempre plurale "Ragazzi"
- ❌ NO parafrasi volumi Davide — sempre verbatim citation

---

## §6. Tools Tea uses

- **Claude Code**: stesso tool di Andrea (Tea già usa per dev parallel iter 26+)
- **GitHub web**: review dashboard Mac Mini persona-prof + PR review
- **Notion**: documentation legacy spec
- **Figma** (potential): mockup Cronologia + Glossario design
- **Figma plugin Code Connect**: design system mapping (vedi tools inventory)
- **Volumi cartacei** Davide PDF: `/VOLUME 3/CONTENUTI/volumi-pdf/` Vol1+2+3
- **Skill `elab-principio-zero-validator`**: validate testi Tea generated against PZ V3 ≥95%

---

## §7. Coordination Andrea + Tea + Davide

### §7.1 Andrea ↔ Tea sync

- **Daily standup async** via shared note `docs/coordination/andrea-tea-{date}.md`
- **Weekly review live** Sunday 30min via WhatsApp / Notion call
- **PR review SLA** Andrea ≤24h response

### §7.2 Tea ↔ Davide sync

- **Wiki concept verification** task T1.2 — Davide cross-check page numbers
- **Tres Jolie parallelismo** task T3 — Davide identify narrative drift
- **Brand voice content** task T8 — Davide review terminology Volumi

### §7.3 Tea ↔ Mac Mini

- **Persona-prof weekly review** task T7 — Tea valida findings critical iter 31+
- **UAT vs persona-prof comparison** task T2.5 — gap identification

---

## §8. Communication channels

- **Notion shared workspace**: ELAB Tutor → Iter 31 Tea
- **GitHub branch `tea/iter-31-{task-name}`** per task (Tea pushes to own branches NOT main)
- **WhatsApp emergency**: solo critical blocker
- **Claude Code conversation log**: shared via `~/.claude/projects/` plus `claude-mem` integration

---

## §9. Iter 31 close gates Tea

- [ ] T1 wiki cleanup ≥50 HIGH issues resolved
- [ ] T2 UAT ≥30 esperimenti audited (subset Vol1+Vol2 5/wk realistic)
- [ ] T3 Tres Jolie ≥3 capitoli parallelismo audit
- [ ] T4 Cronologia mockup shipped + Andrea review
- [ ] T5 Glossario PR merged
- [ ] T6 4 GIF + SVG fallback shipped
- [ ] T7 ≥1 weekly review Mac Mini persona-prof
- [ ] T8 ≥1 brand voice content section shipped

Estimated Tea wall-clock iter 31: ~25h split 5 settimane = ~5h/settimana realistic.

---

## §10. Cross-link

- Master plan iter 31: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
- Mac Mini persona-prof: `docs/handoff/2026-05-02-mac-mini-professore-inesperto-persona-iter-31.md`
- 13 decisioni priority matrix: `docs/audits/2026-05-02-iter30-andrea-13-decisioni-priority-matrix.md`
- Mac Mini gap analysis: `docs/audits/2026-05-02-iter30-mac-mini-audit-script-gap-analysis.md`
- Tools+plugins inventory: `docs/audits/2026-05-02-iter-31-tools-plugins-inventory.md`
- ADR-040 fumetto: `docs/adrs/ADR-040-fumetto-imagegen-provider-decision.md`
- ELAB tres-jolie: `[elab-tres-jolie.md](http://elab-tres-jolie.md)`
- Sprint U Cycle 1 audit: `docs/audits/sprint-u-cycle1-iter1-CONSOLIDATED-audit.md`
- Sprint U Cycle 2 handoff: `docs/handoff/sprint-u-cycle2-iter1-handoff.md`

---

**Status**: PROPOSED iter 31 entrance. Tea ratify task priority order. Andrea coordination scheduled. Davide cross-check tasks T1.2 + T3 + T8.

**Anti-inflation G45 cap mandate enforced**: NO claim "Tea task LIVE" senza CoV evidence + PR merged + Andrea review approval.
