# Mac Mini Persona "Professore Inesperto Elettronica" — Atomic Checklist Iter 31

**Date**: 2026-05-02
**Version**: 1.0 (PROPOSED iter 31 entrance)
**Mode**: docs-only iter 30, deploy iter 31+ post Andrea ratify decisione #1 priority matrix
**Source persona**: Mac Mini USER-SIM CURRICULUM iter 36 LIVE (L1 5min + L2 30min + L3 2h + aggregator 15min) extended con persona-prof comprehensive
**Cross-link**: master plan `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`, gap analysis `docs/audits/2026-05-02-iter30-mac-mini-audit-script-gap-analysis.md`
**Anti-inflation**: G45 cap. NO claim "Mac Mini persona LIVE" senza 24h soak. NO compiacenza findings.

---

## §1. Persona definition — "Professore Inesperto Elettronica"

### §1.1 Profilo

- **Età**: 35-50 anni
- **Materia insegnata**: Tecnologia / Scienze (NOT informatica nativa)
- **Background elettronica**: ZERO. Mai usato Arduino. Mai costruito breadboard. Conosce concetti scuola superiore (corrente, tensione, resistenza Ohm) ma non oltre
- **Background digitale**: medio. Usa Google Classroom + Microsoft Teams + Office Suite. NON conosce GitHub, NON conosce JSON, NON conosce CSS
- **Pressioni esterne**: PNRR scadenza giugno 2026 → DEVE attivare laboratorio robotica. MePA listing già ratificato. Ha ricevuto kit ELAB Omaric + 3 volumi cartacei Davide. Deve preparare lezione classe 3ª media (12-13 anni)
- **Tempo disponibile**: 30 min preparazione + 60 min lezione effettiva
- **Aspettativa**: piattaforma DEVE guidarlo passo-passo SENZA conoscenze pregresse, deve poter leggere VERBATIM dai volumi al ragazzi, deve poter rispondere a domande ragazzi via UNLIM
- **Anti-pattern fail**: docente apre piattaforma → confusione → chiude → torna a metodo cartaceo OR YouTube tutorial

### §1.2 Persona stress test obiettivi

Ogni cycle Mac Mini 65-min simulazione DEVE testare:
1. **Onboarding senza guida** — può un docente entrare senza prior knowledge + capire cosa fare?
2. **Workflow lineare** — flusso preparazione lezione → spiega ragazzi → ragazzi costruiscono → diagnosi errore → conclusione → report fumetto è chiaro?
3. **PRINCIPIO ZERO compliance** — UNLIM parla plurale "Ragazzi" + cita Vol/pag verbatim + menziona kit ELAB + analogie comprensibili?
4. **Morfismo Sense 2** — software palette/iconografia/font/SVG matchano kit Omaric + volumi cartacei a colpo d'occhio?
5. **Funzionalità complete** — drag&drop simulator + Arduino compile + Scratch blocks + Vision + TTS + STT + wake word funzionano?
6. **Estetica LIM-projection** — schermata leggibile da ragazzi 5m distance LIM 1080p? font ≥14px? contrasto WCAG AA?
7. **Recovery error path** — quando UNLIM hallucina OR componente phantom OR latenza >5s, persona-prof come reagisce?

---

## §2. Atomic checklist mappatura ALL elementi UI (200+ items)

### §2.1 Stage 1 — First impression (5 min)

#### A1. WelcomePage entry

- [ ] **A1.1** Render WelcomePage senza class_key salvato
- [ ] **A1.2** Logo ELAB Tutor visibile + posizione header
- [ ] **A1.3** Tagline / claim chiaro per docente neofita?
- [ ] **A1.4** Input class_key field — placeholder testo guida?
- [ ] **A1.5** Bottone "Entra" — touch target ≥44px? colore Lime visibile?
- [ ] **A1.6** Link "Cosa è ELAB Tutor?" presente per docente neofita?
- [ ] **A1.7** Footer credits Andrea + Tea + Davide + Omaric + Giovanni leggibile?
- [ ] **A1.8** Audit: console errors? network errors? load time <3s 4G slow?

#### A2. HomePage post-login

- [ ] **A2.1** HomePage hero chiarezza
- [ ] **A2.2** Mascotte UNLIM visibile + speech bubble plurale "Ragazzi,"
- [ ] **A2.3** 4 CARDS principali visibili: Lavagna / ChatbotOnly / Cronologia / About-Easter (iter 36 A13b A6 ChatbotOnly + EasterModal)
- [ ] **A2.4** Cards font ≥14px + spacing ≥16px
- [ ] **A2.5** Cards emoji 🧠📚⚡🐒 explicit-allowed Andrea iter 36 OK
- [ ] **A2.6** Hover state visible per docente senza touch screen
- [ ] **A2.7** Audit estetica: palette Navy/Lime/Orange/Red rispettata? font Oswald (titoli) + Open Sans (body)?
- [ ] **A2.8** Audit fruibilità: docente può guess "Lavagna" = aula proiezione? "ChatbotOnly" = chat puro?

#### A3. 4 modalità switch test

- [ ] **A3.1** Click Lavagna → mount LavagnaShell → ModalitaSwitch component rendered
- [ ] **A3.2** 4 modalità visibili: Percorso (default) / Libero / Già Montato / Guida Errore
- [ ] **A3.3** Default modalità "Percorso" = data-default + Lime drop-shadow border accent (iter 36 A4 fix)
- [ ] **A3.4** Click "Libero" → cambio mode + persistence localStorage
- [ ] **A3.5** Click "Già Montato" → mount esperimento pre-built (iter 36 A4 GiaMontato.jsx)
- [ ] **A3.6** Click back to "Percorso" → restore default
- [ ] **A3.7** Refresh page → modalità persisted via localStorage
- [ ] **A3.8** Audit: 4 modalità nomi chiari per docente neofita?

### §2.2 Stage 2 — Lavagna mount (10 min)

#### A4. Toolbar 4 strumenti core

- [ ] **A4.1** FloatingToolbar visibile post-mount
- [ ] **A4.2** Pen icon + tooltip "Disegna a mano libera"
- [ ] **A4.3** Wire icon + tooltip "Connetti componenti"
- [ ] **A4.4** Select icon + tooltip "Seleziona / sposta"
- [ ] **A4.5** Delete icon + tooltip "Elimina selezione"
- [ ] **A4.6** Undo button + Redo button (iter S19 connected via __ELAB_API)
- [ ] **A4.7** Play / Pause button + state indicator
- [ ] **A4.8** Audit: Pen tool drawing mode toggle works?
- [ ] **A4.9** Audit: Wire tool can connect 2 component pins?
- [ ] **A4.10** Audit: Select tool drag & drop component existing?
- [ ] **A4.11** Audit: Delete tool removes selected component?

#### A5. AI command bar UNLIM

- [ ] **A5.1** Bottom command bar visible
- [ ] **A5.2** Placeholder testo "Chiedi a UNLIM..."
- [ ] **A5.3** Microphone icon button — wake word "Ehi UNLIM" trigger
- [ ] **A5.4** Send button — touch target ≥44px
- [ ] **A5.5** Type "Aiutami con la lezione" + Send → ChatOverlay appears
- [ ] **A5.6** UNLIM response plurale "Ragazzi" + Vol/pag verbatim + analogia
- [ ] **A5.7** Latency p95 <2500ms target (PDR)
- [ ] **A5.8** Audit: response truncated <60 parole (PDR brevita`)?

### §2.3 Stage 3 — Drag & drop simulator (15 min)

#### A6. RetractablePanel left 8 componenti

- [ ] **A6.1** Panel left visibile + retractable button
- [ ] **A6.2** 8 componenti quick-add visibili:
  - Breadboard 400-tie (Omaric standard)
  - Arduino Nano R4 (kit Omaric specifico)
  - LED rosso / giallo / verde (3 colors)
  - Resistore 220Ω + 1kΩ + 10kΩ
  - Pushbutton tactile
  - Pulsante slide
  - Buzzer piezo
  - Sensore (BMP180 / DHT11 / HC-SR04)
- [ ] **A6.3** Componenti SVG = palette identica kit Omaric (Test Morfismo Sense 2)
- [ ] **A6.4** Click componente → quick-add via __ELAB_API.unlim.addComponent
- [ ] **A6.5** Audit: drag-and-drop reale o solo quick-add click? (iter S19 limit honest)
- [ ] **A6.6** Audit: componente snap-to-grid breadboard hole pitch 7.5px?
- [ ] **A6.7** Audit: NanoR4Board SCALE=1.8 verified?

#### A7. Connect wire workflow

- [ ] **A7.1** Click Wire tool → mode active
- [ ] **A7.2** Click pin Arduino D13 → wire start
- [ ] **A7.3** Drag to LED anode → wire complete
- [ ] **A7.4** Wire color visible (BUS_BOTTOM_PLUS naming `bus-bot-plus` NOT `bus-bottom-plus`)
- [ ] **A7.5** Click GND pin Arduino → wire start GND
- [ ] **A7.6** Drag to LED cathode via R 220Ω → wire chain
- [ ] **A7.7** Audit: snap threshold 4.5px works?
- [ ] **A7.8** Audit: docente può capire D13 vs A0 vs GND naming visibile sul board?

#### A8. Esegui circuit

- [ ] **A8.1** Click Play button → CircuitSolver MNA/KCL solve
- [ ] **A8.2** AVRBridge avr8js cycle ATmega328p emulation start
- [ ] **A8.3** LED blink visibile post sketch upload (default blink esperimento mounted)
- [ ] **A8.4** Audit: latency mount-to-blink <5s?
- [ ] **A8.5** Audit: console errors AVRBridge GPIO/ADC/PWM/USART?

### §2.4 Stage 4 — Code Arduino + Scratch (15 min)

#### A9. Arduino C++ panel

- [ ] **A9.1** Code panel button visible
- [ ] **A9.2** Click → CodeMirror editor opens
- [ ] **A9.3** Default sketch loaded (blink standard)
- [ ] **A9.4** Modify `delay(1000)` → `delay(500)` → blink faster
- [ ] **A9.5** Compile button + result HEX shown
- [ ] **A9.6** Upload to AVRBridge → emulation cycle restart
- [ ] **A9.7** LED blink rate observable change
- [ ] **A9.8** Audit: latency compile <3s? n8n compiler https://n8n.srv1022317.hstgr.cloud/compile
- [ ] **A9.9** Audit: error messages comprehensible per docente neofita?
- [ ] **A9.10** Audit: NO emoji as icon (ElabIcons SVG only)?

#### A10. Scratch / Blockly panel

- [ ] **A10.1** Scratch panel button visible
- [ ] **A10.2** Click → Blockly canvas opens
- [ ] **A10.3** Drag block "ripeti per sempre"
- [ ] **A10.4** Drag block "accendi LED" + select pin D13
- [ ] **A10.5** Drag block "aspetta 1 secondo"
- [ ] **A10.6** Drag block "spegni LED"
- [ ] **A10.7** Drag block "aspetta 1 secondo"
- [ ] **A10.8** Click "Esegui" → Scratch compile to Arduino C++ → AVRBridge cycle
- [ ] **A10.9** LED blink visible
- [ ] **A10.10** Audit: Scratch palette identica kit Omaric (NON generic blue)?
- [ ] **A10.11** Audit: italiano localizzazione blocks? "ripeti per sempre" NOT "forever"?

### §2.5 Stage 5 — UNLIM interaction (10 min)

#### A11. ChatOverlay UNLIM

- [ ] **A11.1** Click mascotte UNLIM bottom-right → ChatOverlay open
- [ ] **A11.2** Type "Spiega questo esperimento ai ragazzi" + Send
- [ ] **A11.3** Response received <2500ms p95
- [ ] **A11.4** Plurale "Ragazzi," presente prima parola? (G+2 PZ skill gate)
- [ ] **A11.5** Vol/pag verbatim citation? "Vol.X cap.Y pag.Z" formato? (G+1 PZ skill gate)
- [ ] **A11.6** Kit ELAB mention? "kit ELAB", "breadboard", "Omaric", "kit fisico"? (G+3 PZ skill gate)
- [ ] **A11.7** Analogia presente? "come un...", "pensate...", "immaginate...", "paragone..."?
- [ ] **A11.8** Risposta ≤60 parole (PDR brevita`)?
- [ ] **A11.9** Tag `[AZIONE:...]` rispettato non visibile testo?
- [ ] **A11.10** Tag `[INTENT:{}]` rispettato + executed via intentsDispatcher whitelist 12 actions?
- [ ] **A11.11** Cronologia messaggi salvata Supabase post-session
- [ ] **A11.12** Audit: TTS auto-play disponibile per docente proietta LIM?

#### A12. Wake word "Ehi UNLIM"

- [ ] **A12.1** Click microphone icon → mic permission prompt
- [ ] **A12.2** MicPermissionNudge.jsx shown se permission state non granted (iter 38 A11)
- [ ] **A12.3** Permission granted → wake word listener active
- [ ] **A12.4** Speak "Ehi UNLIM" → UNLIM activated tone
- [ ] **A12.5** Speak "Mostra blink ai ragazzi" → INTENT executed via __ELAB_API
- [ ] **A12.6** LED blink demo visualization
- [ ] **A12.7** Audit: STT engine working? CF Whisper? local STT? plurale "Ragazzi" prepend (iter 41+ pending)?
- [ ] **A12.8** Audit: 9-cell STT matrix 9/9 PASS (iter 41 spec `tests/e2e/sprint-t-iter41-wake-word-9-cell.spec.js`)?

### §2.6 Stage 6 — Vision + Fumetto (5 min)

#### A13. Vision Pixtral

- [ ] **A13.1** Click "guarda il mio circuito" command UNLIM
- [ ] **A13.2** captureScreenshot via __ELAB_API
- [ ] **A13.3** Pixtral Vision EU FR call
- [ ] **A13.4** Diagnosis response: kit fisico riferimento ("controllate la breadboard fila E pin 13")?
- [ ] **A13.5** Latency Pixtral first-byte <3500ms
- [ ] **A13.6** Audit: Vision engine deployed? Decisione Andrea Vision Gemini Flash deploy iter 41+ pending

#### A14. Fumetto session-end report

- [ ] **A14.1** Session-end button visible? (Fumetto wire-up Lavagna route iter 36 carryover NOT shipped)
- [ ] **A14.2** Click → Fumetto MVP iter S19 loaded? OR DOM placeholder solo?
- [ ] **A14.3** 4-pannelli generated: setup ragazzi attorno breadboard / errore tipico / docente legge Vol/pag / circuito funzionante celebration?
- [ ] **A14.4** FLUX schnell CF Workers AI imagegen call (status quo Andrea Path A iter 30 ADR-040 PROPOSED)
- [ ] **A14.5** Audit: imagegen latency <2500ms 1024² 4-step?
- [ ] **A14.6** Audit: text rendering balloon italiano leggibile?

### §2.7 Stage 7 — Persona-prof critical eval (5 min)

#### A15. Eval workflow linearity

- [ ] **A15.1** Docente neofita può completare esperimento senza prior knowledge? Y/N
- [ ] **A15.2** Quanti dropdown / menu "nascosti" trova confondenti?
- [ ] **A15.3** Quante volte chiede aiuto UNLIM per capire prossimo step?
- [ ] **A15.4** Documenti volumi cartacei + software allineati? (Test Morfismo Sense 2)
- [ ] **A15.5** Dopo completion 1 esperimento, docente può iniziare il prossimo da solo?

#### A16. Eval design + estetica

- [ ] **A16.1** Palette consistency var(--elab-{navy|lime|orange|red}) ≥80%?
- [ ] **A16.2** NanoR4Board SVG identità kit fisico Omaric verified?
- [ ] **A16.3** Iconografia coerente volumi (NO Material Design SaaS)?
- [ ] **A16.4** Font usage Oswald + Open Sans + Fira Code rispettato?
- [ ] **A16.5** Spacing ≥16px tra elementi cards?
- [ ] **A16.6** Touch target ≥44px tutti bottoni interattivi?
- [ ] **A16.7** Contrasto WCAG AA 4.5:1 testo / 3:1 grafici?
- [ ] **A16.8** LIM-projection 5m readable ≥14px font min?

#### A17. Eval funzionalità complete

- [ ] **A17.1** Drag & drop simulator funziona reale OR quick-add only?
- [ ] **A17.2** Arduino compile end-to-end (n8n compiler) <3s?
- [ ] **A17.3** Scratch → Arduino converter funziona?
- [ ] **A17.4** Vision Pixtral funziona prod?
- [ ] **A17.5** TTS Voxtral funziona prod (voice clone Andrea iter 31)?
- [ ] **A17.6** STT CF Whisper Turbo funziona post-fix iter 38 P0.1?
- [ ] **A17.7** Wake word 9-cell matrix PASS?
- [ ] **A17.8** Fumetto session-end LIVE OR MVP only?
- [ ] **A17.9** Cronologia sessioni Google-style (iter 41+ pending)?
- [ ] **A17.10** Glossario integration main app (Tea T5 brief)?

#### A18. Eval recovery error path

- [ ] **A18.1** UNLIM hallucina componente phantom → anti-absurd flag triggered?
- [ ] **A18.2** UNLIM cita Vol/pag wrong → PZ V3 validator post-LLM rewrite?
- [ ] **A18.3** Latency p95 >5s LIM UX bad → cron warmup mitigates?
- [ ] **A18.4** Componente dropped fuori breadboard → snap-back animation?
- [ ] **A18.5** Wire connect wrong pin → diagnostic message comprehensible?
- [ ] **A18.6** Compile error C++ → docente capisce error message?
- [ ] **A18.7** STT permission denied → MicPermissionNudge alternativo path?
- [ ] **A18.8** Network offline → service worker cache hit?

---

## §3. 94 esperimenti loop — sweep architecture

### §3.1 Lista esperimenti

Per `src/data/lesson-paths/v{1,2,3}-cap*-esp*.json`:

- **Vol1 38 esperimenti** (capitolo 6 LED + capitolo 7 sensori + ...)
- **Vol2 27 esperimenti** (capitolo 8 PWM + capitolo 9 servo + ...)
- **Vol3 29 esperimenti** (capitolo 6 multitasking + capitolo 7 mini-projects + capitolo 8 serial + ...)

5 missing reali (iter 36 D3 Mac Mini): da identificare + creare iter 41+ Decisione #4 priority matrix.

### §3.2 Sweep cycle protocol

Per ogni esperimento `v{1,2,3}-cap*-esp*`:

1. **Setup**: cron tick → wrapper script `mac-mini-audit-experiment.sh v$VOL-cap$CAP-esp$ESP`
2. **Execution**: 65 min persona-prof checklist applicata (Stages 1-7)
3. **Output**: `docs/audits/auto-mac-mini/_persona-prof/$EXP_ID/$DATE-$CYCLE.json` + screenshots `01-A1.png` ... `18-A18.png`
4. **Aggregator**: `scripts/mac-mini-render-persona-prof-md.mjs` produces `_dashboard-persona-prof.html`
5. **Trend**: diff prev cycle vs current cycle → arrows ↗ ↘
6. **Issue auto-flag**: HIGH/MEDIUM/LOW per Stage 1-7 separate buckets

### §3.3 Cron schedule

```bash
# crontab Mac Mini side
*/10 * * * * cd $HOME/elab-builder-audit && bash scripts/mac-mini-audit-experiment.sh $(cat /tmp/audit-next-exp.txt) >> /tmp/audit-cron.log 2>&1
0 */4 * * * cd $HOME/elab-builder-audit && bash scripts/mac-mini-rotate-next-exp.sh
0 0 * * * cd $HOME/elab-builder-audit && bash scripts/mac-mini-audit-experiment.sh --all >> /tmp/audit-fullsweep.log 2>&1
0 6 * * * cd $HOME/elab-builder-audit && bash scripts/mac-mini-aggregate-dashboard.sh
0 7 * * * cd $HOME/elab-builder-audit && bash scripts/mac-mini-audit-commit.sh
```

State rotation `/tmp/audit-next-exp.txt` advances 1/94 every 10min → full sweep 940min ≈ 15.6h.

---

## §4. CoV mandate ogni cycle

Ogni Mac Mini cycle DEVE produce CoV evidence:

1. **CoV-1 page load**: `audit.opening.load_ms` <5000ms gate (HIGH issue se >5s)
2. **CoV-2 console errors**: `audit.opening.console_errors_count` = 0 gate (MEDIUM se >0)
3. **CoV-3 __ELAB_API mounted**: `audit.components.not_loaded === false` (HIGH se true)
4. **CoV-4 components count**: `audit.components.components > 0` (MEDIUM se 0)
5. **CoV-5 UNLIM smoke**: `audit.unlim_smoke.status === 200` (HIGH se non 200)
6. **CoV-6 plurale Ragazzi**: `audit.unlim_smoke.plurale_ragazzi === true` (HIGH PZ violation se false POST-defect-2 fix)
7. **CoV-7 Vol/pag citation**: `audit.unlim_smoke.citation_vol_pag === true` (MEDIUM se false POST-Phase-4 close)
8. **CoV-8 kit ELAB**: `audit.unlim_smoke.kit_elab === true` (MEDIUM se false POST-deploy v73)
9. **CoV-9 analogia**: `audit.unlim_smoke.analogia === true` (LOW se false)
10. **CoV-10 latency p95**: `audit.unlim_smoke.latency_ms` <2500ms (HIGH se >5s, MEDIUM se >3s)

---

## §5. Anti-pattern checklist

- ❌ NO claim "Mac Mini persona LIVE" senza 24h soak + Andrea verify GitHub mobile branch updates
- ❌ NO claim "94 esperimenti audit complete" senza full sweep ≥1 cycle (~15.6h)
- ❌ NO claim "all CoV gates PASS" senza precondition gate fix defect 3 (cascade false-positives)
- ❌ NO claim "auto-commit working" senza SSH key Mac Mini → GitHub deploy key + first push success
- ❌ NO claim "trend arrows accurate" senza prev-cycle.json diff verified
- ❌ NO claim "estetica G16 PASS" senza Tea visual review (Andrea-confirmed iter 36 Tea is creative+UX feedback role)
- ❌ NO claim "funzionalità G17 ALL works" senza prod-live verify + R5+R6+R7 stress

---

## §6. Acceptance gates iter 31+

### §6.1 Gate Mac Mini cron LIVE

- [ ] All 4 audit script defects fixed (iter 30 gap analysis §3-5-6)
- [ ] Wrapper bash `scripts/mac-mini-audit-experiment.sh` + `mac-mini-rotate-next-exp.sh` + `mac-mini-aggregate-dashboard.sh` + `mac-mini-audit-commit.sh` shipped
- [ ] SSH key Mac Mini → GitHub deploy key configured
- [ ] Cron 5 entries `*/10 * * * *` + 4-hour rotate + daily fullsweep + dashboard + commit active
- [ ] First 24h soak: 144 cycles produced + ≥1 fullsweep + ≥1 dashboard updated + ≥1 git push success
- [ ] Andrea verify GitHub mobile branch list `mac-mini/audit-*`

### §6.2 Gate Persona-prof spec atomic checklist 200+ items

- [ ] `tests/e2e/mac-mini-persona-professore-inesperto.spec.js` shipped covering Stages 1-7 atomic checklist
- [ ] Mappatura UI elements 200+ items implemented as Playwright assertions
- [ ] Aggregator script produce HTML dashboard published GitHub Pages OR `docs/audits/auto-mac-mini/_persona-prof/`
- [ ] CoV 10 gates per cycle reportable

### §6.3 Gate first 24h soak findings

- [ ] HIGH issue count realistic <10 (NOT all 18 spuriously triggered)
- [ ] MEDIUM issue count <30
- [ ] LOW issue count <50
- [ ] Trend arrows accurate (diff prev cycle valid)
- [ ] Tea T7 weekly review scheduled

---

## §7. Skills cross-link

Mac Mini persona-prof simulazione runs against 5 metric skills:
- `elab-principio-zero-validator` extended (G+1 Vol/pag + G+2 plurale + G+3 kit ELAB)
- `elab-morfismo-validator` (G1-G10 palette + SVG + font + ToolSpec + lesson-paths)
- `elab-onniscenza-measure` (G1-G8 7-layer + classifier + RAG + wiki + recall@5)
- `elab-velocita-latenze-tracker` (G1-G9 R5 p95 + cold start + 4G LIM realistic)
- `elab-onnipotenza-coverage` (G1-G9 L0/L1/L2/L3 + INTENT + canary)

Per-cycle invoke 5 skills via `Skill` tool → output aggregato dashboard per stage.

---

## §8. Cross-link

- Master plan iter 31: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
- Mac Mini gap analysis: `docs/audits/2026-05-02-iter30-mac-mini-audit-script-gap-analysis.md`
- 13 decisioni priority matrix: `docs/audits/2026-05-02-iter30-andrea-13-decisioni-priority-matrix.md`
- ADR-040 fumetto: `docs/adrs/ADR-040-fumetto-imagegen-provider-decision.md`
- Tea brief iter 31: `docs/handoff/2026-05-02-tea-iter-31-brief.md`
- Tools+plugins inventory: `docs/audits/2026-05-02-iter-31-tools-plugins-inventory.md`
- Mac Mini autonomous plan iter 39+: `docs/superpowers/plans/2026-05-01-mac-mini-autonomous-iter-39-sprint-T-close.md`
- Mac Mini USER-SIM CURRICULUM iter 36: CLAUDE.md sprint history "Atom A10"
- Spec test iter 29: `tests/e2e/mac-mini-audit-experiment.spec.js`

---

**Status**: PROPOSED iter 31 entrance. Mac Mini deploy gated atoms 3.1-3.2 master plan + Andrea ratify Decisione #1 priority matrix iter 30. Estimated wall-clock first 24h soak gate ≈ 24h post-deploy + Andrea verify Sunday 2026-05-04 checkpoint.

**Anti-inflation G45 cap mandate enforced**: NO claim "Mac Mini persona LIVE" senza first 24h soak verified + Tea T7 weekly review + Andrea Opus G45 indipendente review iter 31 close (Phase 7 master plan).
