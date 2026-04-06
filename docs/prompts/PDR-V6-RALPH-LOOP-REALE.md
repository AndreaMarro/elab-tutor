# PDR V6 — ELAB Tutor: Ralph Loop REALE
## Generato: 06/04/2026 — Post 14 iterazioni PDR v5

---

## META: PERCHE V6

Il PDR v5 ha portato il progetto da **5.6 a 8.2/10** in 14 iterazioni. Ma:
- Il ralph loop NON era reale — l'agente si fermava, inflazionava score, dichiarava promise false
- I benchmark 200 non erano tutti verificati — molti erano "stimati" non misurati
- Build time era dichiarato 56s ma era 2m28s
- Score 8.5 dichiarato era 8.2 reale dopo check brutale

Il PDR v6 risolve questi problemi con:
1. **50 obiettivi CONCRETI** misurabili con test automatizzati
2. **Benchmark 2000** a 10 livelli di giudizio (0-10 per benchmark)
3. **Anti-regressione algoritmica** — test bloccanti PRIMA di ogni commit
4. **CoV dopo OGNI obiettivo** — non ogni 5
5. **Debug sistematico ogni 2 obiettivi**
6. **Audit dopo OGNI obiettivo** — 3 agenti paralleli

---

## STATO REALE VERIFICATO (06/04/2026)

```
Build:           PASS 58s (obfuscation RC4 domina)
Test:            1462 (1459 PASS + 3 skipped network)
Test files:      34/34 PASS
Precache:        18 entries, 2510 KiB
Source files:    372
Esperimenti:     92 (38+27+27)
buildSteps:      92/92 (100%)
quiz:            92/92 (100%)
scratchXml:      26/26 AVR+code (100%)
hexFile:         25/26 AVR+code (96% — 1 DAC hw limit)
connections>0:   85/92 (7 senza — 5 standalone nano+bb, 2 diretti bat+mm)
pinAssignments:  83/92 (9 senza — stessi 7 standalone + 2 battery-only)
Lesson paths:    92/92 JSON (100%)
Emoji JSX:       0
Emoji data:      0
Supabase:        73 sessioni reali
Nanobot:         ONLINE v5.5.0
Engine modified: 3 file (solo data copyright, zero funzionale)
```

### Score ONESTO per area (post check brutale):
```
Dati esperimenti:     9.8/10  (92/92, 1 HEX mancante hw)
Simulatore core:      7.5/10  (engine intatto, funzionante)
UNLIM AI:             7.5/10  (nanobot online, non testato con studenti)
Build/Performance:    7.0/10  (58s, 2.5MB, obfuscation)
Dashboard docente:    8.0/10  (Supabase reale verificato screenshot)
Lavagna UX:           7.5/10  (LIM/iPad verificato screenshot, mobile usabile)
Visual/UX:            9.0/10  (zero emoji, SVG everywhere)
Accessibilita:        8.0/10  (WCAG fix, font 13px+, touch 44px)
Test/E2E:             8.5/10  (1462 test, 17 E2E automatizzati)
COMPOSITO:            8.2/10
```

---

## 50 OBIETTIVI CONCRETI

### BLOCCO A — PARITÀ VOLUMI TRES JOLIE (Obiettivi 1-10)

**OBJ-01**: Leggere PDF Vol1 TRES JOLIE pagina per pagina, estrarre lista ESATTA esperimenti con titolo, componenti, schema. Confrontare con experiments-vol1.js. Ogni discrepanza = bug.
- Criterio PASS: report con 0 discrepanze oppure tutte fixate
- CoV: verifica title match, component match, connection match

**OBJ-02**: Come OBJ-01 per Vol2.

**OBJ-03**: Come OBJ-01 per Vol3 (usare ODT + PDF).

**OBJ-04**: Verificare che NESSUN esperimento sia "frammentato" — ogni circuito fisico = 1 esperimento. Se il libro ha "Fase A" e "Fase B" dello stesso circuito, devono essere step interni, NON esperimenti separati.
- Test: `experiments.filter(e => e.title.includes('Fase') || e.title.includes('parte'))` = 0

**OBJ-05**: Aggiungere connections e pinAssignments ai 7 esperimenti che ne sono privi (attualmente 85/92 con connections).
- Test E2E: `ALL.filter(e => e.components.length > 1 && !e.connections?.length)` = 0

**OBJ-06**: Verificare che TUTTI i 92 lesson paths abbiano: domanda provocatoria, analogie, esercizio, prossimo esperimento.
- Test E2E: 4 campi obbligatori per path

**OBJ-07**: Verificare codice Arduino di OGNI Vol3 experiment vs libro TRES JOLIE — deve essere IDENTICO.

**OBJ-08**: Generare HEX per v3-cap7-esp8 (DAC) con codice adattato per ATmega328p, oppure marcare come "solo hardware reale" con messaggio chiaro.

**OBJ-09**: Aggiungere `concept` e `observe` fields a TUTTI gli esperimenti che ne sono privi.

**OBJ-10**: Verificare vocabulary di TUTTI i lesson paths — linguaggio 10-14 anni, zero termini tecnici senza spiegazione.

### BLOCCO B — SIMULATORE PERFETTO (Obiettivi 11-20)

**OBJ-11**: E2E test automatizzato: caricare OGNI esperimento Vol1 (38), verificare components + connections caricati senza crash.

**OBJ-12**: E2E test automatizzato: caricare OGNI esperimento Vol2 (27), stesso check.

**OBJ-13**: E2E test automatizzato: caricare OGNI esperimento Vol3 (27), stesso check. Per quelli con code: compilare e verificare HEX linkato.

**OBJ-14**: Stress test: piazzare 15 componenti su breadboard, verificare zero rallentamento (frame time < 16ms).

**OBJ-15**: Test undo/redo: 10 azioni, undo 10x, redo 10x — stato finale = stato iniziale.

**OBJ-16**: Test drag-and-drop: componente dragged → snap al buco piu vicino. Filo segue.

**OBJ-17**: Test fisica LED: rosso=rosso, verde=verde, RGB=3 canali, polarita inversa=spento.

**OBJ-18**: Test serial monitor: font >=16px, input funzionante, output leggibile.

**OBJ-19**: Test potenziometro: overlay rotazione, valore 0-1023 nel serial monitor.

**OBJ-20**: Test LCD: testo visualizzato, cursore, backlight.

### BLOCCO C — UNLIM AI ONNIPOTENTE (Obiettivi 21-30)

**OBJ-21**: Test E2E con nanobot REALE: 10 domande diverse, TUTTE risposte < 80 parole (dopo truncation).

**OBJ-22**: Test AZIONE tags: inviare "monta semaforo" al nanobot, verificare che risposta contiene [AZIONE:loadexp:v3-cap6-semaforo] o equivalente.

**OBJ-23**: Test voice commands: verificare che voiceCommands.js ha >= 24 comandi, tutti con handler.

**OBJ-24**: Test nomi studenti: verificare che localStorage 'elab_student_name' viene letto e passato al nanobot.

**OBJ-25**: Test session tracker E2E: caricare esperimento, inviare messaggio, verificare sessione salvata in localStorage con messages[].

**OBJ-26**: Test UNLIM memoria cross-sessione: verificare che unlimMemory.js salva e recupera contesto.

**OBJ-27**: Test percorso adattivo: verificare timer, hint veloce (<5s), hint lento (>120s), summary finale.

**OBJ-28**: Test 30 comandi naturali italiani: "accendi", "spegni", "collega", "monta", "pulisci", "compila", etc. Ognuno deve produrre un'azione.

**OBJ-29**: Test UNLIM su LIM 1024x768: pannello UNLIM non copre >50% del canvas.

**OBJ-30**: Test UNLIM verbosita: 20 domande diverse, media parole risposta < 60 (non solo < 80).

### BLOCCO D — DASHBOARD + LAVAGNA (Obiettivi 31-40)

**OBJ-31**: Dashboard E2E: navigare a #teacher, verificare ClassKeyPrompt se no class_key, inserire chiave, verificare dati caricati.

**OBJ-32**: Dashboard: verificare che "Dati dal cloud (Supabase)" appare con conteggio reale.

**OBJ-33**: Dashboard: tab Studenti mostra lista studenti reali (non UUID troncati).

**OBJ-34**: Dashboard: CSV export produce file valido con colonne corrette.

**OBJ-35**: Lavagna: verificare salvataggio pagina in localStorage + navigazione multi-pagina.

**OBJ-36**: Lavagna: penna funziona SUBITO al primo click (NO reload necessario).

**OBJ-37**: Lavagna: 3 spessori + 5 colori + gomma funzionanti.

**OBJ-38**: Lavagna LIM 1024x768: screenshot che mostra zero overflow, testo leggibile.

**OBJ-39**: Lavagna iPad 768x1024: screenshot che mostra touch target 44px+.

**OBJ-40**: Lavagna PC 1920x1080: screenshot che mostra layout ottimale.

### BLOCCO E — BUILD + SICUREZZA + DEPLOY (Obiettivi 41-50)

**OBJ-41**: Build time < 90s (realistico con obfuscation). Documentare perche >60s non e raggiungibile.

**OBJ-42**: Zero CSS warnings nel build (fix "Unexpected /").

**OBJ-43**: CSP: rimuovere unsafe-inline da index.html (usare nonce o hash).

**OBJ-44**: GDPR: verificare consent banner, delete_student_data, nessun PII a terzi.

**OBJ-45**: Service worker: verificare offline mode — caricare esperimento cached senza rete.

**OBJ-46**: Supabase RLS: verificare che anon puo solo INSERT/SELECT propri dati, non ALTER/DELETE altri.

**OBJ-47**: Deploy Vercel: `npm run build && npx vercel --prod --yes` senza errori.

**OBJ-48**: Test flaky: eliminare i 5 test flaky (race condition JSX) — usare waitFor o retry builtin.

**OBJ-49**: Scrivere test E2E per FUMETTO: creare sessione, generare report, verificare iframe + panels.

**OBJ-50**: Audit finale 5 agenti: SECURITY + WCAG + EXPERIMENTS + PERFORMANCE + UX. Score = MINIMO dei 5.

---

## BENCHMARK 2000 — 10 LIVELLI DI GIUDIZIO

Ogni benchmark ha score 0-10:
- 0 = non esiste / crash
- 1-2 = esiste ma inutilizzabile
- 3-4 = funziona parzialmente
- 5-6 = funziona ma con problemi
- 7-8 = buono, qualche miglioramento
- 9 = eccellente
- 10 = perfezione, nulla da migliorare

### A. SIMULATORE CORE (1-200)
1-92: Caricamento SINGOLO di ogni esperimento (92 bench, 0-10)
93-118: ScratchXml presente + valido (26 AVR, 0-10)
119-144: HexFile presente + funzionante (26 AVR, 0-10)
145-170: Play/Pause per ogni esperimento con output verificato (26 AVR, 0-10)
171-180: Componenti SVG (LED, R, Btn, Pot, LDR, Buzzer, Servo, LCD, MOSFET, Wire) rendering (10 bench, 0-10)
181-190: Fili e connessioni (drag, snap, segui, rimuovi, contatto elettrico, filo sbagliato, batch, color, undo filo, redo filo) (10 bench, 0-10)
191-200: Zoom/Pan/Select (zoom in, zoom out, pan, select single, select multi, deselect, rotate, delete, properties, copy) (10 bench, 0-10)

### B. SCRATCH/BLOCKLY (201-400)
201-292: ScratchXml genera codice C++ compilabile per ogni esperimento AVR (92 bench dove applicabile, altrimenti N/A)
293-312: 20 tipi di blocco funzionano correttamente (0-10 ciascuno)
313-332: Interazione Scratch (drag, connect, disconnect, delete, undo, redo, fullscreen, exit, switch, palette, toolbox, zoom, pan, search, duplicate, disable, enable, comment, collapse, expand) (20 bench, 0-10)
333-352: Compilazione da Scratch (errore, warning, successo, retry, timeout, codice vuoto, include, punto e virgola, variabile, pin sbagliato, tipo sbagliato, overflow, stack, infinite loop, divide by zero, syntax, semantic, runtime, link, flash) (20 bench, 0-10)
353-400: Blocchi specifici (digitalRead/Write, analogRead/Write, delay, if, for, while, Serial, Servo, LCD, tone, noTone, map, constrain, random, millis, abs, min, max, pow, sqrt, sin, cos, tan, String, array, struct, enum, define, include, function, return, break, continue, switch, case, do-while, ternary, bitwise, shift, typedef, sizeof, cast, pointer, reference) (48 bench, 0-10)

### C. UNLIM AI — INTELLIGENZA (401-900)
401-500: 100 domande di elettronica base → risposta corretta, kid-friendly, <80 parole (100 bench, 0-10)
501-600: 100 comandi azione → INTENT/AZIONE tag emesso + eseguito (100 bench, 0-10)
601-700: 100 scenari contestuali → UNLIM sa cosa c'e nel circuito e risponde di conseguenza (100 bench, 0-10)
701-800: 100 test di adattivita → UNLIM rallenta/accelera, anticipa errori, suggerisce (100 bench, 0-10)
801-900: 100 test di memoria → UNLIM ricorda sessione precedente, nomi, progressi, errori (100 bench, 0-10)

### D. PERCORSO / PASSO PASSO (901-1100)
901-992: Passo Passo funziona per ogni esperimento (92 bench, 0-10)
993-1084: Percorso lezione funziona per ogni esperimento (92 bench, 0-10)
1085-1100: UX Percorso (drag, resize, minimize, 5 fasi, font, non sovrappone, nascondibile, allargabile, step evidenziato, step completato, feedback colore, senza path, adattivo rallenta, adattivo accelera, default aperto, default pannello) (16 bench, 0-10)

### E. DATI / PARITA VOLUMI (1101-1300)
1101-1192: Titolo esperimento = libro TRES JOLIE (92 bench, 0-10)
1193-1284: Componenti esperimento = libro TRES JOLIE (92 bench, 0-10)
1285-1300: Qualita dati (buildSteps qualita, quiz qualita, lesson path qualita, concept graph, analogie, domanda provocatoria, vocabulary, esercizio, prossimo exp, observe, difficulty, chapter, desc, connections, pinAssignments, code) (16 bench, 0-10)

### F. FUMETTO (1301-1400)
1301-1392: Fumetto generabile per ogni esperimento con sessione (92 bench, 0-10)
1393-1400: Qualita fumetto (cover, componenti, domanda, sfida, sapevi, dialogo, esercizio, finale) (8 bench, 0-10)

### G. UX LAVAGNA (1401-1500)
1401-1420: Toolbar (20 bench, 0-10)
1421-1440: Pannelli flottanti (20 bench, 0-10)
1441-1460: Penna/Drawing (20 bench, 0-10)
1461-1480: Navigazione/Picker (20 bench, 0-10)
1481-1500: Mascotte/UNLIM UI (20 bench, 0-10)

### H. RESPONSIVE (1501-1600)
1501-1520: LIM 1024x768 (20 bench, 0-10)
1521-1540: iPad 768x1024 (20 bench, 0-10)
1541-1560: PC 1920x1080 (20 bench, 0-10)
1561-1580: Mobile 375x812 (20 bench, 0-10)
1581-1600: Chromebook/Zoom/Rotazione (20 bench, 0-10)

### I. DASHBOARD DOCENTE (1601-1700)
1601-1620: Accesso e autenticazione (20 bench, 0-10)
1621-1640: Visualizzazione dati (20 bench, 0-10)
1641-1660: Export e report (20 bench, 0-10)
1661-1680: Gestione classi (20 bench, 0-10)
1681-1700: Nudge e comunicazione (20 bench, 0-10)

### J. PERFORMANCE (1701-1800)
1701-1720: Build e bundle (20 bench, 0-10)
1721-1740: Runtime performance (20 bench, 0-10)
1741-1760: PWA/Offline (20 bench, 0-10)
1761-1780: Memory management (20 bench, 0-10)
1781-1800: Network e caching (20 bench, 0-10)

### K. SICUREZZA E GDPR (1801-1900)
1801-1820: Autenticazione e autorizzazione (20 bench, 0-10)
1821-1840: Dati personali e consenso (20 bench, 0-10)
1841-1860: CSP e XSS (20 bench, 0-10)
1861-1880: Supabase RLS (20 bench, 0-10)
1881-1900: Logging e monitoring (20 bench, 0-10)

### L. INTEGRITA E DEPLOY (1901-2000)
1901-1920: Test suite (20 bench, 0-10)
1921-1940: CI/CD (20 bench, 0-10)
1941-1960: Git hygiene (20 bench, 0-10)
1961-1980: Documentation (20 bench, 0-10)
1981-2000: Production health (20 bench, 0-10)

---

## ALGORITMO ANTI-REGRESSIONE

```
DOPO OGNI SINGOLA MODIFICA:
1. npx vitest run → DEVE essere >= 1459 PASS
2. npm run build → DEVE PASSARE
3. find src -type f | wc -l → DEVE essere >= 372
4. git diff --name-only | grep -E "CircuitSolver|AVRBridge|SimulationManager|avrWorker" → solo copyright date OK, zero funzionale
5. Se QUALSIASI fallisce → git checkout -- <file> IMMEDIATO
```

## PROTOCOLLO CoV (Chain of Verification)

```
DOPO OGNI OBIETTIVO:
1. Rileggi TUTTE le modifiche fatte
2. Il fix e MINIMALE? (>50 righe per un singolo fix = overengineering)
3. Risolve IL problema specifico?
4. Ha side effects su altri obiettivi?
5. Anti-regressione 5 step
6. Screenshot/log come PROVA
7. Documenta: file, riga, cosa fatto, perche
```

## PROTOCOLLO DEBUG SISTEMATICO (ogni 2 obiettivi)

```
1. Identifica il SINTOMO esatto (cosa vedi/non vedi)
2. Riproduci il problema (screenshot/console log)
3. Isola il file/funzione responsabile
4. Leggi il codice PRIMA di modificare
5. Forma IPOTESI sulla root cause
6. Verifica ipotesi con console.log/breakpoint
7. Fix MINIMALE
8. Verifica fix con lo STESSO test che ha rivelato il bug
9. Anti-regressione
10. Rimuovi console.log di debug
```

## RALPH LOOP CONFIG

```yaml
max_iterations: 100
completion_promise: SCORE_GTE_8_5_AND_1600_OF_2000_BENCHMARKS_ABOVE_7
anti_regression: BLOCKING (test + build + file count + engine integrity)
cov: AFTER_EVERY_OBJECTIVE
debug: EVERY_2_OBJECTIVES
audit: AFTER_EVERY_OBJECTIVE (3 agents minimum)
benchmark_full: EVERY_10_ITERATIONS
screenshot_proof: EVERY_OBJECTIVE
```

## STRINGA RALPH LOOP

```
/ralph-loop PDR v6 ELAB Tutor Ralph Loop Reale. 50 obiettivi concreti. Benchmark 2000 a 10 livelli. Anti-regressione BLOCCANTE dopo ogni modifica. CoV dopo ogni obiettivo. Debug sistematico ogni 2 obiettivi. Audit 3 agenti dopo ogni obiettivo. Screenshot come prova. BLOCCO A: parita volumi TRES JOLIE (OBJ 1-10). BLOCCO B: simulatore perfetto (OBJ 11-20). BLOCCO C: UNLIM AI onnipotente (OBJ 21-30). BLOCCO D: dashboard + lavagna (OBJ 31-40). BLOCCO E: build + sicurezza + deploy (OBJ 41-50). Score attuale ONESTO 8.2/10. Target 8.5+ con 1600/2000 benchmark sopra 7. NO INFLAZIONE SCORE. --max-iterations 100 --completion-promise SCORE_GTE_8_5_AND_1600_OF_2000_BENCHMARKS_ABOVE_7
```

---

## CONTESTO DA ALLEGARE ALLA PROSSIMA SESSIONE

```
File da leggere PRIMA di iniziare:
1.  CLAUDE.md
2.  docs/prompts/PDR-V6-RALPH-LOOP-REALE.md (QUESTO FILE)
3.  Memory MEMORY.md (index)
4.  Memory architecture.md
5.  Memory scores.md
6.  tests/e2e/experiment-data-integrity.test.js (17 test automatizzati)
7.  tests/e2e/ui-compliance.test.js (3 test automatizzati)
8.  tests/e2e/unlim-nanobot.test.js (2 test + 3 skipped network)
9.  src/utils/experimentIcon.jsx (mapper tipo->SVG)
10. src/components/common/ElabIcons.jsx (40+ icone SVG)
11. src/data/experiments-vol1.js
12. src/data/experiments-vol2.js
13. src/data/experiments-vol3.js
14. vite.config.js (obfuscation config, precache)
15. supabase/schema.sql + migration-001
```

## COSA E STATO FATTO NEL PDR V5 (14 iterazioni)

```
Da 5.6 a 8.2 (+2.6):
- 30 buildSteps generati (Vol2+Vol3)
- 20 scratchXml generati (Vol3)
- 19 HEX compilati via compiler reale
- 9 lesson paths Vol2 generati
- 6 Vol2 connections aggiunte
- ~50 WCAG contrast fix
- 60+ emoji -> SVG (ElabIcons + experimentIcon)
- 4 giochi rimossi
- Default Passo Passo (Gia Montato preservato)
- Dashboard ClassKeyPrompt + Supabase verificato
- Serial Monitor 17px
- Blockly toggle 36x80
- Schema Supabase class_key unificato
- LIM/iPad/Mobile responsive CSS
- 16 E2E test automatizzati
- Precache ridotto da 50 a 18 entries
- Obfuscation scope ridotto (UI panels skipped)
```
