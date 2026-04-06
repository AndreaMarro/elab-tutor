# PDR V3 — ELAB Tutor: Parita Definitiva Kit/Volumi/App

> Versione: 3.0 | Data: 05/04/2026
> Prerequisito: Post-PDR Session 2 completata (27 bug fixati totali, 1430/1430 test, deploy LIVE)
> Durata: Ralph Loop max 100 iterazioni
> Obiettivo: Score composito >= 8.5/10 con 95/100 benchmark PASS con EVIDENZA screenshot

---

## META-CONTESTO FONDAMENTALE

**Cos'e ELAB**: Un UNICO prodotto — Kit fisico + 3 Volumi stampati + Tutor digitale. L'estetica del tutor DEVE richiamare i volumi. Se sembra "progetto di studente" = FALLIMENTO. Se sembra "prodotto venduto a scuole" = SUCCESSO.

**IL DOCENTE E INESPERTO**: Il docente che usa ELAB non e un tecnico. Non sa programmare, non sa di elettronica. UNLIM deve essere un SUPPORTO INVISIBILE che lo guida senza farlo sentire incapace. L'interfaccia deve essere cosi intuitiva che un docente di lettere puo usarla.

**UNLIM = supporto invisibile**: NON un chatbot. Una guida contestuale che anticipa i bisogni del docente. Suggerisce senza invadere. Prepara le lezioni dal contesto precedente + curriculum volumi. Il docente parla alla LIM e UNLIM esegue silenziosamente.

**La Lavagna e il concetto centrale**: 95% workspace, 5% chrome. Pannelli flottanti. NON un sito web con pagine.

**Target bambini 8-14**: Linguaggio SEMPRE per loro. Touch first 48px. LIM 1024x768.

**Score attuale onesto**: 6.9-7.5/10. I self-score precedenti erano inflati di ~2 punti. NON credere ai self-score.

---

## 8 PRINCIPI IMMUTABILI (violazione = REVERT immediato)

1. **PRINCIPIO ZERO**: Solo il docente usa ELAB davanti alla classe. Ogni scelta UX serve il docente INESPERTO che spiega.
2. **ZERO REGRESSIONI**: `npx vitest run` + `npm run build` DOPO OGNI singolo fix. Se falliscono, REVERT.
3. **ENGINE INTOCCABILE**: MAI modificare CircuitSolver.js, AVRBridge.js, SimulationManager.js, avrWorker.js.
4. **ZERO DEMO/MOCK**: Tutto con dati reali. Mai dati finti.
5. **ONESTA BRUTALE**: Mai score >7 senza screenshot/log come prova. Anti-inflazione attiva.
6. **PARITA VOLUMI**: Esperimenti app = IDENTICI ai libri fisici. No frammenti, no duplicati.
7. **COV OBBLIGATORIA**: Chain of Verification dopo OGNI ciclo. Quality audit ogni 5 cicli.
8. **UNLIM INVISIBILE**: UNLIM non deve MAI richiedere competenze tecniche al docente. Deve funzionare come un assistente che capisce dal contesto.

---

## TUTTI I BUG APERTI (20, prioritizzati)

### P0 — Bloccanti
| # | Bug | File/Area |
|---|-----|-----------|
| 1 | 21/27 esperimenti Vol3 senza buildSteps | experiments-vol3.js |
| 2 | Scratch: solo 10/92 esperimenti hanno scratchXml | experiments-vol*.js |
| 3 | PercorsoPanel non si apre come FloatingWindow separata | LavagnaShell.jsx |
| 4 | Esperimenti frammentati vs libri (91 app vs ~88 libri) | experiments-vol*.js |
| 5 | UNLIM backend non emette sempre tag AZIONE/INTENT | nanobot/post-processing |
| 6 | Lavagna non salva pagine, non cambia pagina | LavagnaShell.jsx |
| 7 | Impossibile scaricare il fumetto (report PDF) | UnlimReport.jsx |

### P1 — Importanti
| # | Bug | File/Area |
|---|-----|-----------|
| 8 | Barra componenti visibile in Libero (deve sparire) | LavagnaShell.jsx |
| 9 | Pannelli inline non ridimensionabili | FloatingWindow.jsx |
| 10 | Touch difficile su iPad (drag impreciso) | SimulatorCanvas.jsx |
| 11 | Lesson path con testi mancanti | lesson-paths/*.json |
| 12 | Dashboard #teacher richiede login | TeacherDashboard.jsx |
| 13 | Nomi studenti = UUID troncati | TeacherDashboard.jsx |
| 14 | Tabella classes vuota su Supabase | SQL |
| 15 | Giochi ancora presenti — ELIMINARE | 4 componenti giochi |

### P2 — Miglioramenti
| # | Bug | File/Area |
|---|-----|-----------|
| 16 | Hooks order violation (dev-only) | NewElabSimulator.jsx |
| 17 | Nanobot 500 su circuitState complesso | nanobot |
| 18 | CSP unsafe-inline | index.html |
| 19 | Lavagna non carica documenti esterni | Non implementato |
| 20 | Supabase 401 quando class_key null | supabaseSync.js |

---

## FASE 0 — BOOTSTRAP (1 sola volta)

### 0.1 Leggi TUTTO il contesto (IN ORDINE)
```
1. CLAUDE.md
2. Memory MEMORY.md
3. docs/MAPPING-VOLUMI-APP.md
4. docs/BUG-LIST-COMPLETA.md
5. docs/BENCHMARK-100-PARAMETRI.md
6. docs/STRESS-TEST-RISULTATI.md
7. Memory G45-audit-brutale.md
8. Memory pdr-livello-successivo-04apr2026.md
9. Memory unlim-vision-core.md
10. Memory simulator-notes.md
```

### 0.2 Leggi i 3 volumi SORGENTE dalla cartella TRES JOLIE (FONTE DI VERITA DEFINITIVA)
```
PDF Vol1: "/Users/andreamarro/VOLUME 3/ELAB - TRES JOLIE/1 ELAB VOLUME UNO/2 MANUALE VOLUME 1/MANUALE VOLUME 1 ITALIANO.pdf"
PDF Vol2: "/Users/andreamarro/VOLUME 3/ELAB - TRES JOLIE/2 ELAB VOLUME DUE/2 MANUALE VOLUME  2/MANUALE VOLUME 2 ITALIANO.pdf"
ODT Vol3: "/Users/andreamarro/VOLUME 3/ELAB - TRES JOLIE/3 ELAB VOLUME TRE/2 MANUALE VOLUME 3/MANUALE VOLUME 3 WORD.odt"
PDF Vol3 (copia app): "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/public/volumes/volume3.pdf"
```
NOTA: Vol3 in Tres Jolie e un .odt (Word). Usa il PDF in public/volumes/ come riferimento secondario.
La cartella Tres Jolie e la FONTE DEFINITIVA per titoli, esperimenti, componenti, schemi.
Per OGNI volume: conta gli esperimenti REALI (non le fasi). Un esperimento = una cosa da costruire/fare.

### 0.3 Anti-regressione baseline
```bash
npx vitest run                    # DEVE essere 1430+
npm run build                     # DEVE passare, 30+ precache
find src -type f | wc -l          # DEVE essere >= 347
git diff --name-only | grep -E "CircuitSolver|AVRBridge|SimulationManager|avrWorker"  # DEVE essere vuoto
```

### 0.4 Verifica live
Usa Control Chrome su https://www.elabtutor.school:
```
1. Login con ELAB2026
2. Carica un esperimento Vol1
3. Carica un esperimento Vol3 con codice
4. Clicca Play
5. Clicca Penna (deve apparire overlay disegno)
6. Chiudi UNLIM → clicca mascotte → UNLIM si riapre
7. Apri Manuale → cambia volume (tab Vol1/Vol2/Vol3)
8. Apri Percorso Lezione
9. Trascina pannello UNLIM (deve muoversi)
10. Resize pannello UNLIM da angolo basso-destra (deve allargarsi)
```
OGNI test fallito = BUG P0 da fixare PRIMA di continuare.

---

## FASE 1 — PARITA VOLUMI (Critica, ~20 iterazioni)

### Problema
L'app ha 91 esperimenti ma molti sono FRAMMENTI dello stesso esperimento del libro.
Il libro e la FONTE DI VERITA. L'app deve avere SOLO gli esperimenti del libro.

### Metodo
1. Apri OGNI PDF volume con il tool PDF/Acrobat
2. Elenca TUTTI gli esperimenti REALI per capitolo (un esperimento = un circuito da costruire)
3. Confronta con `experiments-vol1.js`, `experiments-vol2.js`, `experiments-vol3.js`
4. Per ogni esperimento nell'app:
   - Se e un FRAMMENTO di un esperimento del libro → UNISCI nell'esperimento padre (come step interno)
   - Se e un esperimento SEPARATO nel libro → MANTIENI
   - Se NON ESISTE nel libro → marca come "bonus" (non rimuovere, ma separa)
5. Per ogni esperimento nel libro NON presente nell'app → AGGIUNGILO
6. Verifica TITOLO identico al libro, COMPONENTI identici, SCHEMA identico, CODICE identico (Vol3)

### Risultato atteso
- Vol1: numero esperimenti = numero nel libro
- Vol2: numero esperimenti = numero nel libro
- Vol3: numero esperimenti = numero nel libro + eventuali extra marcati
- Ogni esperimento ha: title, components, connections, layout, steps, quiz, concept, code (Vol3)

### CoV Fase 1
```bash
npx vitest run  # Aggiorna test se numero esperimenti cambia
npm run build
```

---

## FASE 2 — ELIMINA GIOCHI + FIX FUMETTO (~5 iterazioni)

### 2.1 Elimina i 4 giochi didattici
Andrea li vuole ELIMINATI. Rimuovi COMPLETAMENTE:
- Circuit Detective (CircuitDetective.jsx)
- POE / Predict Observe Explain (PredictObserveExplain.jsx)
- Reverse Engineering Lab (ReverseEngineeringLab.jsx)
- Circuit Review (CircuitReview.jsx)
Rimuovi componenti, route, import, riferimenti. Zero dead code.

### 2.2 Fix download fumetto
Il report fumetto (UnlimReport.jsx / SessionReportPDF.jsx) non si scarica come PDF.
1. Apri report nell'app → clicca "Scarica PDF" → DEVE scaricare
2. Se fallisce: root cause + fix
3. Il PDF deve essere A4, leggibile, con pannelli fumetto

### CoV: vitest + build

---

## FASE 3 — SIMULATORE PERFETTO (Debug sistematico, ~20 iterazioni)
### NOTA: rinumerata da Fase 2 originale

### 2.1 Test OGNI esperimento con Control Chrome
Per OGNI esperimento (tutti e 3 i volumi):
```
1. Naviga a https://www.elabtutor.school
2. Carica l'esperimento
3. VERIFICA: componenti montati correttamente (screenshot)
4. VERIFICA: fili collegati ai pin giusti
5. Se Vol3: clicca Play → LED/Buzzer/Servo/LCD DEVONO rispondere
6. Se Vol3: Serial Monitor → output corretto
7. VERIFICA: trascina componente → fili seguono
8. VERIFICA: undo/redo funziona
9. VERIFICA: zoom in/out → layout coerente
10. Se FAIL: root cause + fix + ri-test
```

### 2.2 Compilatore C++ (Vol3)
Per OGNI esperimento Vol3 con code !== null:
```
1. Apri tab Arduino C++ → codice presente
2. Clicca Compila → DEVE compilare senza errori
3. Codice SBAGLIATO → DEVE mostrare errore bambino-friendly in italiano
4. Retry dopo errore → funziona senza reload
```

### 2.3 Scratch/Blockly (Vol3)
```
1. Passa a tab Blocchi
2. 12 categorie visibili in italiano kid-friendly
3. Crea programma Blink con blocchi
4. Compila da Blocchi → codice C++ generato CORRETTO
5. Compilazione DEVE avere successo
6. LED DEVE lampeggiare
7. Blocchi sbagliati → errore chiaro, NO crash
```

### 2.4 Fisica oggetti — Stress test severo
```
Per 5 esperimenti rappresentativi (1 semplice, 1 medio, 1 complesso per volume):
1. Trascina componente dalla palette → snap ai buchi breadboard
2. Sposta componente → TUTTI i fili collegati seguono
3. Collega filo tra due pin → contatto funzionante
4. Filo nel punto SBAGLIATO → NON funziona
5. Rimuovi filo → circuito aggiornato
6. Undo/Redo 10 operazioni → stato perfetto
7. Zoom in/out → layout coerente
8. 15 componenti contemporanei → nessun rallentamento
9. Play/Stop → transizione pulita
10. Snap tolerance: buco piu vicino, non millimetrico
11. Pin cliccabili facilmente (min 44px)
12. Su touch: drag funziona con il dito
```

---

## FASE 3 — UX LAVAGNA PERFETTA (~15 iterazioni)

### 3.1 Pannelli FloatingWindow — TUTTI devono essere:
- Draggabili (trascinamento dalla title bar)
- Ridimensionabili (handle angolo basso-destra INTUITIVO, non nascosto)
- Minimizzabili (bottone -)
- Massimizzabili (bottone quadrato)
- Chiudibili (bottone X)
- Riapribili (da bottone nell'header o mascotte)

Pannelli da verificare:
1. **UNLIM** (GalileoAdapter in FloatingWindow) — gia OK?
2. **Percorso Lezione** (PercorsoPanel in FloatingWindow) — gia OK?
3. **Manuale PDF** (VolumeViewer in FloatingWindow) — con tab Vol1/2/3
4. **Video** (VideoFloat) — deve embeddare YouTube, non redirect
5. **Passo Passo** (LessonPathPanel) — ATTUALMENTE NON e FloatingWindow! Fix necessario.

### 3.2 Mascotte fluttuante
- DEVE essere visibile come bottone fisso (position: fixed)
- DEVE essere draggabile
- Click DEVE riaprire UNLIM (verificato con pointerup fix)
- Immagine DEVE caricarsi (PNG fallback a SVG inline)

### 3.3 Penna
- Click penna nella toolbar → DrawingOverlay fullscreen appare
- Toolbar colori visibile in alto
- Puoi disegnare sul canvas
- Click penna di nuovo → disattiva
- Altri tool (Select, Wire, Delete) disattivano la penna

### 3.4 Video YouTube
- Finestra Video DEVE embeddare un iframe YouTube (non redirect)
- Ricerca video per argomento
- Video si guarda DENTRO la finestra, non apre un'altra tab

### 3.5 Responsive
Per OGNI pannello, su OGNI risoluzione:
| Risoluzione | Cosa verificare |
|-------------|----------------|
| LIM 1024x768 | Tutto visibile, font >= 14px, nessun overflow |
| iPad 768x1024 | Touch targets >= 44px, sidebar retrattile |
| PC 1920x1080 | Canvas auto-fit, sidebar aperta |

---

## FASE 4 — MODALITA PROGETTO (~15 iterazioni)

### Architettura
La Modalita Progetto e il cuore pedagogico:
1. Generata dai dati dell'esperimento + lesson-paths/*.json + volumi
2. Si ADATTA in tempo reale: rallenta se l'insegnante ha difficolta, accelera se va bene
3. Pannello FloatingWindow: drag, resize, minimize, close
4. 5 fasi: PREPARA / MOSTRA / CHIEDI / OSSERVA / CONCLUDI
5. Font >= 16px (leggibile dalla classe a 3 metri)
6. Nessun overlay cognitivo (mai coprire il circuito senza permesso)
7. Conosce le sessioni precedenti (unlimMemory.js)

### Step-by-step Monta Tu
1. Pannello laterale con istruzioni per step
2. Ogni step: componente da piazzare, posizione suggerita
3. Step completato → prossimo si illumina
4. Feedback: corretto = verde, sbagliato = arancione (MAI rosso)
5. Se esperimento senza lesson-path → modalita non crasha

### Verifica
- Apri Percorso Lezione per 5 esperimenti diversi
- Verifica 5 fasi visibili
- Verifica font >= 16px
- Verifica pannello draggabile + ridimensionabile
- Verifica che non copre il circuito

---

## FASE 5 — BENCHMARK 100 DIMENSIONI

### Protocollo
DOPO OGNI ciclo di fix, misura con EVIDENZA RUNTIME (screenshot/console/curl).
Target: media >= 8.5/10 con ZERO dimensioni < 5.

### A. SIMULATORE CORE (15)
1. Tutti gli esperimenti caricano senza crash
2. Tutti i Vol3 con codice compilano
3. Play/Stop funziona su tutti
4. Drag → snap a buco breadboard piu vicino
5. Sposta componente → fili seguono
6. Filo tra due pin → contatto elettrico verificabile
7. Filo sbagliato → circuito NON funziona
8. Rimuovi filo → circuito aggiornato
9. Undo/Redo 10x → stato perfetto
10. Zoom → layout coerente, nulla sparisce
11. 15 componenti → nessun rallentamento
12. LED acceso → colore corretto
13. Potenziometro → overlay rotazione funzionante
14. LDR → slider luce funzionante
15. Serial Monitor → output Arduino corretto

### B. SCRATCH/BLOCKLY (10)
16. 12 categorie visibili e funzionanti
17. Drag blocco da palette → inserimento workspace
18. Blink compila da Scratch (accendi D13, attendi, spegni, attendi)
19. C++ generato → sintatticamente corretto
20. Scratch → HEX → simulazione funziona
21. Blocchi sbagliati → errore chiaro, NO crash
22. Switch Arduino↔Scratch preserva stato
23. Scratch fullscreen funziona
24. Categorie italiano kid-friendly
25. Palette colori ELAB (Navy/Lime/Orange/Red)

### C. COMPILATORE C++ (5)
26. Codice corretto → OK + flash size mostrata
27. Errore sintattico → tradotto italiano bambino-friendly
28. Warning → separato da errori
29. Errore con riga → evidenziazione nell'editor
30. Retry dopo errore → funziona senza reload

### D. UNLIM AI (15)
31. "Monta il LED" → componenti appaiono (INTENT eseguito)
32. "Aggiungi buzzer" → buzzer appare
33. "Rimuovi buzzer" → scompare
34. "Pulisci tutto" → canvas vuoto
35. "Monta semaforo" → circuito caricato
36. "Compila" → compilazione avviata
37. "Mostra Scratch" → tab attiva
38. "Apri Serial Monitor" → aperto
39. "Vai capitolo 7" → picker aperto
40. "Spiega Ohm" → analogia kid-friendly
41. "Cosa abbiamo fatto?" → memoria cross-sessione
42. "Prepara lezione" → lesson prep RAG
43. Risposta < 30s (incluso cold start Render)
44. 3 comandi rapidi → tutti eseguiti senza crash
45. Input vuoto o vago → risposta garbata no crash

### E. PERCORSO / MONTA TU (10)
46. PercorsoPanel = FloatingWindow (drag, resize, minimize)
47. 5 fasi visibili (Introduzione/Monta/Programma/Esperimenta/Rifletti)
48. Font >= 16px
49. NON sovrappone canvas
50. Nascondibile con 1 click
51. Allargabile con drag handle
52. Step-by-step con componente evidenziato
53. Step completato → prossimo illuminato
54. Feedback verde (ok) / arancione (errore) — MAI rosso
55. Senza lesson-path → no crash

### F. ESPERIMENTI / DATI (10)
56. Numero esperimenti corrisponde ai libri (Vol1:~37 Vol2:~25 Vol3:~26)
57. Titoli IDENTICI ai libri fisici
58. Componenti IDENTICI ai libri
59. Schema circuitale IDENTICO
60. Codice Arduino (Vol3) IDENTICO ai libri
61. BuildSteps presenti per TUTTI i Vol3
62. Quiz presente per ogni esperimento
63. Difficolta (1-5) assegnata
64. Concept graph presente
65. Lesson path JSON presente

### G. UX LAVAGNA (10)
66. AppHeader glassmorphism con nome esperimento visibile
67. FloatingToolbar 7 icone funzionanti
68. Select tool → seleziona componente
69. Filo tool → disegna filo tra 2 pin
70. Elimina tool → cancella componente
71. Annulla/Ripeti sincronizzato con simulatore
72. Barra componenti NASCOSTA in Libero
73. Experiment Picker ricerca + filtro volume
74. 3 modalita (Gia Montato/Passo Passo/Libero) switch senza crash
75. UNLIM mascotte cliccabile → apre chat

### H. RESPONSIVE (10)
76. LIM 1024x768: ZERO overflow
77. LIM: font >= 14px su TUTTI gli elementi
78. LIM: toolbar e sidebar accessibili
79. iPad 768x1024: touch targets >= 44px
80. iPad: swipe sidebar funzionante
81. iPad: drag componenti col dito
82. PC 1920x1080: canvas auto-fit centrato
83. PC: sidebar aperta di default
84. Nessun elemento tagliato a nessuna risoluzione
85. Rotazione iPad landscape↔portrait → adatta

### I. PERFORMANCE (5)
86. Build < 60 secondi
87. Bundle precache < 3000 KiB
88. Precache entries >= 30
89. First Contentful Paint < 3s
90. Nessun chunk > 2MB

### J. SICUREZZA / GDPR (5)
91. Consent banner al primo accesso
92. Dati in localStorage non esposti in URL
93. API keys solo in .env (non nel codice)
94. Supabase RLS attivo
95. No dati personali a terzi senza consenso

### K. INTEGRITA / ANTI-REGRESSIONE (5)
96. npx vitest run → 1430+ PASS
97. npm run build → PASS
98. curl https://www.elabtutor.school → HTTP 200
99. curl nanobot /health → status:ok
100. git diff → SOLO file intenzionalmente modificati

---

## PROTOCOLLO ANTI-REGRESSIONE (DOPO OGNI fix)

```bash
# STEP 1: Test (BLOCCANTE)
npx vitest run
# STEP 2: Build (BLOCCANTE)
npm run build
# STEP 3: File count >= 347
find src -type f | wc -l
# STEP 4: Engine check (BLOCCANTE)
git diff --name-only | grep -E "CircuitSolver|AVRBridge|SimulationManager|avrWorker"
# STEP 5: Console errors via Control Chrome (INFORMATIVO)
```

## PROTOCOLLO CoV (dopo OGNI ciclo)
```
1. Rileggi cosa hai modificato
2. Fix MINIMALE (un cambio alla volta)
3. Risolve il problema segnalato?
4. Side effects?
5. Test passano?
6. > 50 righe? Overengineering?
7. Documenta: file, riga, cosa, perche
```

## PROTOCOLLO QUALITY AUDIT (ogni 5 cicli)
```
3 agenti in parallelo:
1. SECURITY: CSP, API keys, RLS, consent
2. WCAG: font, contrast, touch, focus, ARIA
3. EXPERIMENTS: 5 esperimenti random, montaggio + compilazione
Score composito = media. Se < 7 → prioritizza fix.
```

---

## SKILLS OBBLIGATORIE
```
/systematic-debugging   — Per ogni bug
/debug                  — Debug strutturato
/architecture           — Decisioni architetturali
/frontend-design        — UX design
/elab-quality-gate      — Gate pre/post
/ricerca-bug            — Bug sistematici
/analisi-simulatore     — Debug simulatore
/lim-simulator          — Test LIM
/impersonatore-utente   — Simula docente
/code-review            — Review codice
/quality-audit          — Audit qualita
```

## TOOLS TASSATIVI
```
- Control Chrome — navigare il sito LIVE
- Playwright via Bash — test E2E automatizzati
- curl — verifiche API
- Preview tools — screenshot, click, fill
- PDF tool — leggere i volumi sorgente
- OGNI test deve avere PROVA (screenshot/log)
```

---

## STATO ATTUALE POST-SESSIONE PDR (04/04/2026)

### Score: ~7.5/10
| Area | Score |
|------|-------|
| Simulatore core | 7.5 |
| Lavagna UX | 7.2 |
| UNLIM AI | 7.0 |
| Pedagogico | 7.2 |
| Dashboard/GDPR | 5.7 |
| Performance | 6.7 |
| Responsive | 7.0 |
| Security | 6.5 |
| Visual | 7.0 |
| Build/Test | 8.5 |
| Dati/Esperimenti | 8.4 |

### Fix della sessione corrente (verificati)
- Galileo state machine: galileo:true in TUTTI gli stati
- Mascotte: onClickRef fix per riaprire UNLIM
- Penna: DrawingOverlay fullscreen nella Lavagna
- CSP con cdnjs + youtube frame-src
- Volume tabs nel PDF viewer
- WCAG: 20 contrasto + 5 font + 5 touch
- 18 lesson paths Vol3 (100% coverage)

### Bug ANCORA aperti (onesti)
1. LessonPathPanel NON e FloatingWindow (inline nel simulatore)
2. Video fa redirect invece di embeddare YouTube
3. Pannelli resize handle poco intuitivo (troppo piccolo?)
4. Esperimenti frammentati vs libri (parita non verificata)
5. Scratch: errori GCC non tradotti in tutti i casi
6. Dashboard senza Supabase = shell vuota
7. Nanobot 500 su circuitState complesso

### Build
- 1430/1430 test | Build PASS | 30 precache 2384 KiB
- Engine INTOCCATO
- Deploy live su Vercel

---

## REGOLE RALPH LOOP

```
MAX ITERAZIONI: 100
COMPLETAMENTO: Score >= 8.5 E 95% benchmark PASS

Ogni iterazione:
1. Identifica problema PIU GRAVE (score piu basso)
2. Root cause analysis
3. Fix MINIMALE
4. npx vitest run → DEVE passare
5. npm run build → DEVE passare
6. Verifica via Control Chrome sul sito LIVE
7. CoV: rileggi, verifica coerenza

Ogni 3 iterazioni:
- CoV completa
- Aggiorna docs/BUG-LIST-COMPLETA.md

Ogni 5 iterazioni:
- Quality audit 3 agenti
- Benchmark 20 dimensioni con screenshot

Ogni 10 iterazioni:
- Benchmark COMPLETO 100 dimensioni
- Screenshot di OGNI area
- Aggiorna docs/BENCHMARK-100-PARAMETRI.md

CONDIZIONE DI USCITA:
- 95% benchmark PASS
- Media >= 8.5/10
- UNLIM 28/30 azioni
- Zero crash
- Parita volumi verificata
- Scratch compila e funziona
- Fisica oggetti supera 15 test
- Tutti pannelli FloatingWindow funzionanti
- Video YouTube embedded
- Responsive LIM/iPad/PC verificato
```
