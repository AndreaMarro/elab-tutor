# SYSTEMATIC OVERNIGHT SPRINT — ELAB Perfection Protocol

## STRINGA DI ATTIVAZIONE

```
Esegui il prompt systematic-sprint. Obiettivo: portare il simulatore ELAB alla perfezione assoluta per l'allenamento di Qwen. Segui OGNI fase in ordine, applica CoV dopo ogni step, testa visivamente con Chrome, MAI regredire. Se un build fallisce, FERMA e correggi. Scrivi ragionamenti in .claude/prompts/overnight-sprint/ragionamenti/. Usa Ralph Loop per sviluppo incrementale.
```

---

## PROTOCOLLO CONTEXT MAINTENANCE

### Tecnica 1: Checkpoint State
Prima di ogni fase, scrivi un file `ragionamenti/FASE-N-checkpoint.md` con:
- Stato attuale del sistema (build OK? errori?)
- Cosa e stato fatto fin qui
- Cosa resta da fare
- Rischi identificati

### Tecnica 2: CoV Tracking Live
Dopo OGNI modifica, aggiorna `cov-tracking.md` con lo stato REALE.
Se un check fallisce, STOP e correggi prima di procedere.

### Tecnica 3: Ralph Loop
Per ogni fix: **Load -> Test -> Verify -> Next**
1. LOAD: Apri l'esperimento/componente in Chrome
2. TEST: Interagisci (click, drag, compile, run)
3. VERIFY: Screenshot + console errors + CoV checklist
4. NEXT: Solo se 100% pass, altrimenti fix e ripeti

### Tecnica 4: Git Breadcrumb
Commit dopo OGNI fase completata con messaggio descrittivo.
Se qualcosa si rompe, `git diff` per trovare la causa.

### Tecnica 5: Brainstorming Before Action
Prima di toccare codice, scrivi in `ragionamenti/`:
- Cosa voglio ottenere
- 3 approcci possibili
- Rischi di ogni approccio
- Approccio scelto e perche

---

## FASE 0 — BUILD HEALTH & BASELINE (5 min)

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
npm run build
```

**CoV:**
- [ ] Build 0 errori
- [ ] Main chunk < 350KB gzip
- [ ] ScratchEditor < 250KB gzip
- [ ] 0 warning critici

**Action:** Scrivi `ragionamenti/FASE-0-checkpoint.md`

---

## FASE 1 — SCRATCH C++ COMPILATION PERFECTION (30 min)

### Bug noti (RISOLTI in sessione precedente):
- [x] `variables_set` / `variables_get` generators aggiunti
- [x] `math_modulo`, `math_constrain`, `math_random_int` aggiunti
- [x] `controls_flow_statements` (break/continue) aggiunto
- [x] `procedures_def*` / `procedures_call*` aggiunti
- [x] `_declaredVars` Set con reset in `arduino_base`

### Verifiche da fare con Chrome:
1. Apri ogni esperimento Vol3 AVR (12 su 14)
2. Clicca tab "Blocchi"
3. Verifica layout side-by-side (Blockly 60% + Codice Generato 40%)
4. Verifica che il codice C++ generato sia valido
5. Clicca "Compila & Carica" e verifica output
6. Verifica che modifica blocchi → aggiornamento codice real-time

### Test specifici:
- v3-cap6-blink: verifica default code brackets
- v3-extra-simon: verifica SIMON_SCRATCH_FULL genera C++ completo
- v3-cap7-pulsante: pulsante + LED, INPUT_PULLUP
- v3-cap8-semaforo: 3 LED sequenza temporizzata
- Tutti: 3 modalita (Gia Montato, Passo Passo, Libero)

**CoV FASE 1:**
- [ ] Side-by-side layout visibile su TUTTI i 12 AVR
- [ ] Compilazione produce output su almeno 10/12
- [ ] v3-cap6-blink codice C++ valido
- [ ] v3-extra-simon Scratch genera C++ completo
- [ ] Build 0 errori

---

## FASE 2 — DRAG & DROP LIBERO MODE FIX (20 min)

### Bug segnalato:
"Su alcuni componenti in modalita libera non funziona il drag and drop"

### Investigazione:
1. Apri simulatore in Chrome
2. Seleziona "Libero" mode
3. Testa OGNI componente dalla palette:
   - LED (rosso, verde, giallo, blu)
   - Resistor (220, 330, 1k, 10k)
   - Pulsante
   - Buzzer
   - Potenziometro
   - Fotoresistenza
   - Diodo
   - MOSFET-N
   - RGB LED
   - Motor DC
   - Servo
   - Reed Switch
   - Fototransistor
   - Condensatore
   - LCD
4. Per ogni componente:
   - Click sulla palette per aggiungere
   - Drag sulla breadboard
   - Verifica snap ai fori
   - Verifica drag per spostare dopo piazzamento
   - Verifica delete/undo

### File coinvolti:
- `NewElabSimulator.jsx` — drag handlers
- `parentChild.js` — parent-child drag system
- `breadboardSnap.js` — pin-to-hole snapping
- `SimulatorCanvas.jsx` — SVG container events

### Fix approach:
- Verifica `onPointerDown`/`onPointerMove`/`onPointerUp` handlers
- Verifica che `COMP_SIZES` abbia entry per TUTTI i componenti
- Verifica `parentChild.js` relationships

**CoV FASE 2:**
- [ ] TUTTI i componenti draggabili dalla palette
- [ ] TUTTI i componenti piazzabili sulla breadboard
- [ ] TUTTI i componenti spostabili dopo piazzamento
- [ ] Snap ai fori funzionante
- [ ] Nessun componente "bloccato"
- [ ] Build 0 errori

---

## FASE 3 — NANO R4 BOARD VISUAL PERFECTION (30 min)

### Riferimento: 5 foto hardware fisico

### Checklist visiva:
1. Semicerchio PCB con nano slot interno
2. Wing tab con angoli arrotondati (R=4-5)
3. "ELAB" verticale sul semicerchio (ruotato -90)
4. "Electronics Laboratory" sotto ELAB
5. Barrel jack VIN (5-20V) sul wing
6. 3 LED blu sul breakout
7. Silkscreen "ELAB Nano Breakout V1.1 GP" sul wing
8. Arduino Nano R4 dettagliato (MCU, USB-C, WiFi, pin headers)
9. Wing connector housing scuro con pin wells
10. 4 power bus pads (+/-/+/-)
11. 15 top + 15 bottom + 17 wing pins con label
12. Status LEDs funzionali (PWR, D13, TX, RX)
13. Reset button interattivo
14. Running indicator
15. LED glow

### Pin position IMMUTABILI (47 pin):
```
Header:  PIN_START_X=20, PIN_PITCH=7.5, TOP_PIN_Y=35, BOTTOM_PIN_Y=64
Wing:    WING_PIN_START_X=62, WING_PIN_PITCH=5.0, WING_PIN_Y=78
```

**CoV FASE 3:**
- [ ] Build 0 errori
- [ ] SVG rendering match con foto hardware
- [ ] 47 pin positions immutate
- [ ] Reset button funziona
- [ ] Status LEDs funzionano
- [ ] Running indicator funziona
- [ ] LED glow funziona

---

## FASE 4 — SIMON GAME PERFECTION (30 min)

### Regole Simon Says ufficiali:
1. La macchina illumina un LED a caso
2. Il giocatore deve premere il pulsante corrispondente
3. Se corretto, la macchina ripete la sequenza + 1 LED nuovo
4. Se sbagliato, game over con feedback sonoro
5. Ogni LED ha un tono diverso (freq: 262, 330, 392, 523 Hz circa)
6. La velocita aumenta con la difficolta

### Verifica con Chrome:
1. Carica v3-extra-simon
2. "Gia Montato": 4 LED + 4 pulsanti + buzzer piazzati correttamente
3. "Passo Passo": guida step-by-step con buildSteps
4. "Libero": piazzamento manuale funziona
5. Wiring: wing pins → breadboard corretti
6. Scratch XML: genera C++ valido
7. Default C++ code: compila senza errori

### Componenti Simon (da experiments-vol3.js):
- LED rosso D9, LED verde D10, LED blu D11, LED giallo D12
- Pulsante D3, Pulsante D5, Pulsante D6, Pulsante D13
- Buzzer D8
- Resistenze 220 ohm per ogni LED
- Wiring wing → breadboard

**CoV FASE 4:**
- [ ] Simon carica senza errori
- [ ] 4 LED visibili e posizionati
- [ ] 4 pulsanti visibili e posizionati
- [ ] Buzzer presente
- [ ] Wiring corretto
- [ ] Scratch genera C++ valido
- [ ] Default C++ compila
- [ ] 3 modalita funzionano
- [ ] Build 0 errori

---

## FASE 5 — TUTTI GLI ESPERIMENTI VERIFICATI (45 min)

### Chrome Test per OGNI esperimento:

#### Vol1 (38 esperimenti v1-*)
Per ognuno:
- [ ] Carica senza errori console
- [ ] Componenti visibili e posizionati correttamente
- [ ] "Gia Montato" funziona
- [ ] "Passo Passo" funziona
- [ ] "Libero" funziona
- [ ] Wiring corretto

#### Vol2 (18 esperimenti v2-*)
Per ognuno:
- [ ] Stessi check di Vol1
- [ ] Componenti specifici Vol2 renderizzati

#### Vol3 (14 esperimenti v3-*)
Per ognuno:
- [ ] Carica senza errori
- [ ] Scratch tab presente (12/14 AVR, 2 circuit-only esclusi)
- [ ] Scratch genera C++ valido
- [ ] 3 modalita funzionano
- [ ] Arduino C++ compila

**CoV FASE 5:**
- [ ] 38/38 Vol1 caricano
- [ ] 18/18 Vol2 caricano
- [ ] 14/14 Vol3 caricano
- [ ] Scratch su 12/14 AVR
- [ ] 3 modalita su tutti
- [ ] Build 0 errori

---

## FASE 6 — CIRCUIT SOLVER RESPONSIVE (20 min)

### Breakpoints da testare:
- Mobile: 375px (iPhone SE)
- Tablet portrait: 768px (iPad)
- Tablet landscape: 1024px (iPad)
- Desktop: 1280px
- Wide: 1920px

### Per ogni breakpoint:
1. Resize Chrome window
2. Verifica NanoR4Board visibile e leggibile
3. Verifica breadboard visibile
4. Verifica toolbar non overflow
5. Verifica pin positions coerenti dopo resize
6. Verifica pulsanti touch-friendly (>= 44px)
7. Verifica text leggibile

**CoV FASE 6:**
- [ ] Visibile a 375px
- [ ] Visibile a 768px
- [ ] Visibile a 1024px
- [ ] Visibile a 1280px
- [ ] Pin coerenti dopo resize
- [ ] Pulsanti >= 44px
- [ ] Build 0 errori

---

## FASE 7 — GALILEO INTEGRATION CHECK (15 min)

### Verifica:
1. Chat Galileo apre senza errori
2. Testo contextuale (descrizione esperimento corrente)
3. Action tags funzionano:
   - play/pause/reset
   - loadexp
   - addcomponent
   - compile
   - openeditor/closeeditor
   - switcheditor:scratch/arduino
4. Vision: screenshot cattura canvas/simulator
5. Quiz: genera domande contestuali

**CoV FASE 7:**
- [ ] Chat funziona
- [ ] Action tags 5/5 testati
- [ ] Contesto esperimento visibile
- [ ] Build 0 errori

---

## FASE 8 — SKILL CREATION & DOCUMENTATION (20 min)

### Skills da creare/aggiornare:
1. `nano-breakout` — Pin positions, layout constants, DWG reference
2. Verifica skill esistenti: `arduino-simulator`, `tinkercad-simulator`, `volume-replication`

### Documentazione:
1. Aggiorna PDR con stato attuale
2. Crea `ragionamenti/SESSION-FINAL-REPORT.md`
3. Aggiorna `cov-tracking.md` con tutti i check finali

**CoV FASE 8:**
- [ ] nano-breakout SKILL.md aggiornato
- [ ] PDR aggiornato
- [ ] Report finale scritto
- [ ] Build 0 errori

---

## FASE 9 — DEPLOY & PUSH (10 min)

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
npm run build
npx vercel --prod --yes
git add -A
git commit -m "S114: Systematic sprint — Scratch fix + drag fix + visual perfection + all experiments verified"
git push origin main
```

**CoV FINALE:**
- [ ] Build 0 errori
- [ ] Deploy Vercel OK
- [ ] Git push OK
- [ ] Tutti i file committati
- [ ] Nessuna regressione
- [ ] Sistema pronto per allenamento Qwen

---

## VOICE INTEGRATION DESIGN (documentazione, non implementazione)

### Architettura pipeline:
```
microfono LIM → VAD (Silero) → STT (whisper.cpp/faster-whisper)
    → Nanobot → DeepSeek Chat/R1
    → comando simulatore + risposta
    → Piper TTS → speaker LIM
```

### 7 abilita vocali:
1. Domande circuito ("Perche il LED non si accende?")
2. Comandi simulatore ("Aumenta R1 a 1k")
3. Guida passaggi ("Iniziamo il passaggio 2")
4. Adattamento spiegazione ("Spiegalo piu semplice")
5. Domande alla classe ("Cosa succede senza resistenza?")
6. Riassunti ("Riassumi questo esperimento")
7. Ritmo lezione ("Fermiamoci un attimo")

### Stack gratuito:
- STT: whisper.cpp o faster-whisper
- VAD: Silero VAD (<1ms per chunk)
- TTS: Piper (fast, local neural TTS)
- AI: DeepSeek via Nanobot (gia in stack)
- Wake word: Porcupine "ELAB" (opzionale)
- Noise: RNNoise (noise suppression)
- Echo: WebRTC APM (AEC, AGC)

### Fasi implementazione:
- Fase 1: whisper.cpp + Piper + DeepSeek + 4 intenti base
- Fase 2: Silero VAD + RNNoise + explain levels
- Fase 3: domande classe + wake word + echo cancellation

**File:** Creare `ragionamenti/voice-integration-design.md` con dettagli completi

---

## REGOLE ASSOLUTE

1. **MAI REGREDIRE** — se un fix rompe qualcosa, annullalo
2. **CoV dopo OGNI fase** — non procedere senza verificare TUTTO
3. **Build check** — `npm run build` DEVE passare con 0 errori
4. **Pin positions IMMUTABILI** — i 47 pin non si toccano MAI
5. **Ralph Loop** — Load → Test → Verify → Next
6. **Git commit** dopo ogni fase completata
7. **Ragionamenti** — documenta decisioni in `ragionamenti/`
8. **Chrome test** — testa VISIVAMENTE in produzione
9. **Drag & Drop** — verifica su TUTTI i componenti
10. **3 modalita** — SEMPRE verificare Gia Montato + Passo Passo + Libero

---

## RIFERIMENTI

| Risorsa | Path |
|---------|------|
| NanoR4Board.jsx | `src/components/simulator/components/NanoR4Board.jsx` |
| scratchGenerator.js | `src/components/simulator/panels/scratchGenerator.js` |
| experiments-vol3.js | `src/data/experiments-vol3.js` |
| experiments-vol2.js | `src/data/experiments-vol2.js` |
| experiments-vol1.js | `src/data/experiments-vol1.js` |
| NewElabSimulator.jsx | `src/components/simulator/NewElabSimulator.jsx` |
| CircuitSolver.js | `src/components/simulator/engine/CircuitSolver.js` |
| parentChild.js | `src/components/simulator/utils/parentChild.js` |
| breadboardSnap.js | `src/components/simulator/utils/breadboardSnap.js` |
| SimulatorCanvas.jsx | `src/components/simulator/SimulatorCanvas.jsx` |
| PDR | `sessioni/PDR-ATTUALE-03-03-2026.md` |
| Fritzing Parts | https://github.com/fritzing/fritzing-parts |
| SparkFun Parts | https://github.com/sparkfun/Fritzing_Parts |
