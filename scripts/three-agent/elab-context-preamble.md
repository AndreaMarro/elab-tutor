# ELAB Tutor — Context preamble PRINCIPI FONDAMENTALI (vendor brief mandatory)

**Inietta questo preamble PRIMA di OGNI prompt vendor (Codex + Gemini + Mistral + Kimi K2.6)**.
Ogni vendor DEVE essere aware contesto + principi fondamentali ELAB per anti-bias review valido.

## DUE PAROLE D'ORDINE — coppia inseparabile (CLAUDE.md immutabile)

### 1. PRINCIPIO ZERO (regola pedagogica)

**Il docente è il tramite. UNLIM è strumento del docente. Gli studenti lavorano sui kit fisici ELAB.**

- UNLIM prepara lezioni personalizzate basate su volumi fisici + sessioni passate
- **Studenti NON interagiscono direttamente con UNLIM ne con ELAB Tutor** — vedono tutto sulla LIM proiettata dal docente
- Linguaggio UNLIM NO direct "fai questo" all'insegnante — gli FA CAPIRE cosa fare e cosa dire ai ragazzi
- Studenti lavorano kit ELAB fisici (breadboard, componenti, batterie) seguendo istruzioni docente che legge dal Volume + schermata UNLIM
- CHIUNQUE accendendo ELAB Tutor deve poter giostrarsi + spiegare ai ragazzi SENZA conoscenze pregresse
- Testo volumi è CITATO + USATO per lettura — stesse parole, NO parafrasi
- Differenziatore competitivo: nessun competitor prepara lezioni personalizzate basate su sessioni precedenti + contenuto specifico volumi

**Anti-pattern Principio Zero (vietato in TUTTE decisioni)**:
- Card paritaria homepage che permette student-facing AI direct entry
- Linguaggio singolare "tu fai" invece plurale "Ragazzi, vediamo"
- Esercizi software che NON esistono nel volume fisico
- UNLIM che parafrasa il libro invece di citarlo VERBATIM

### 2. MORFISMO (DUE SENSI — duale moat)

**Sense 1 — Tecnico-architetturale: piattaforma MORFICA + MUTAFORMA runtime**

Software ELAB Tutor è MORFICO runtime. Adatta forma + comportamento per-classe / per-docente / per-kit / per-livello-studente in tempo reale.

- 57 ToolSpec declarative + L1 composition + L2 template + L3 flag DEV
- Mutaforma: UNLIM compone tools dinamicamente (classe primaria vs secondaria, kit basic vs avanzato, capitolo iniziale vs capstone)
- Sintesi runtime: prompt + RAG + Wiki + memoria classe + stato live → risposta adattiva NON pre-compilata
- Adattamento progressivo: stesso UNLIM diverse classi = comportamento diverso (memoria classe Supabase + analisi sessioni)

**Sense 1.5 — Adattabilità docente + classe + UI/funzioni**:

- Per docente specifico (linguaggio plurale "Ragazzi" INVARIANTE, dettagli adattati esperienza)
- Per contesto classe (età studenti rilevata + livello competenza + kit specifico Omaric + capitolo corrente + dispositivi LIM)
- Funzioni morfiche (highlight grosso colorato LIM 5m vs subtle inline Dashboard)
- Finestre morfiche (LIM 1080p vs 4K + mode Lezione/Lavagna/Dashboard/Esperimento + touch/mouse/voice)

**Sense 2 — Strategico-competitivo: triplet coerenza esterna**

Software ELAB Tutor è MORFICO al kit fisico + volumi cartacei. **Stessa forma. Stessi nomi. Stesse pagine. Stesso ordine. Stessa estetica.**

In mesi chiunque potrà generare software via LLM. Differenziatore non sarà più "abbiamo software". Sarà la **coerenza esatta tra software ↔ kit fisico Omaric ↔ volumi cartacei** = singola esperienza unificata. Moat NON copiabile senza kit fisico + volumi originali.

**Implicazioni morfiche IMMUTABILI**:
- Visivo: ogni elemento UI deriva dal kit/volumi (NanoR4Board SVG identico Arduino Nano kit, palette ELAB = stampa volumi, iconografia derivata disegni volumi)
- Linguistico: testo volumi è CANONE (UNLIM cita VERBATIM Vol.X pag.Y, nomi capitoli software = nomi capitoli libro, NO "Lesson 1" usa "Capitolo 6 — I LED")
- Strutturale: ordine = ordine libro (Volume 1 → 6 capitoli software stesso ordine fisico)
- Pedagogico: kit fisico SEMPRE protagonista (UNLIM mai sostituisce kit, simulatore = compagno NON sostituto, diagnosi UNLIM riferisce SEMPRE kit fisico)
- Multimodale: voce + visione + tatto (Voxtral Italiana Andrea cloned voice = registro narratore volumi)

**Anti-pattern Morfismo (vietati)**:
- Componenti SVG con palette generica (es. blu/rosso standard) invece kit Omaric
- UNLIM che parafrasa libro invece di citarlo
- Capitoli software con titoli inventati (NO "Cap. 1: Introduzione")
- Esperimenti software che esistono SOLO nel software (NON nel libro)
- Icone material-design generiche invece icone derivate volumi
- Layout simulatore non riconducibile a setup fisico kit

## Stack tecnico vincoli (CLAUDE.md)

- React 19 + Vite 7 (NO react-router — routing custom hash + useState)
- Vitest baseline `automa/baseline-tests.txt` unica fonte verità
- Vercel frontend + Supabase backend DB + Render Nanobot AI + n8n compilatore + avr8js CPU emulation
- Palette ELAB: Navy #1E4D8C / Lime #4A7A25 / Orange #E8941C / Red #E54B3D
- Font: Oswald (titoli) + Open Sans (body) + Fira Code (codice)

## Linguaggio mandatory (Andrea iter 21 mandate)

- **Plurale "Ragazzi"** (mai singolare imperativo "tu fai")
- **Cita VERBATIM Vol.X pag.Y** (mai parafrasi)
- **Italian K-12 8-14 anni** registro
- **Kit ELAB fisico** sempre protagonista ("Nel kit ELAB usiamo la batteria 9V...")
- **Mai mock / dati finti / demo** — tutto reale

## Team ELAB

- **Andrea Marro** — founder + software dev primario
- **Tea** — co-dev + tester + creativa (USA CLAUDE CODE come Andrea, dev parallelo + QA + UX/idee)
- **Davide Fagherazzi** — autore VOLUMI CARTACEI Vol1+2+3 + procurement MePA
- **Giovanni Fagherazzi** — ex Arduino global sales, network commerciale
- **Omaric Elettronica** — kit hardware Strambino (TO)

## Anti-pattern G45 (anti-inflation MUST RESPECT)

- NO claim "Sprint T close achieved" senza Opus indipendente review G45 mandate cumulative iter 41-43
- NO inflate score senza file:line evidence
- NO compiacenza past work al costo di Principio Zero violation
- NO destructive ops (NO `git reset --hard`, NO `rm -rf`, NO `DROP TABLE`)
- NO `--no-verify`, NO push diretto main
- NO env keys printed conversation
- NO regression Andrea iter past work senza explicit ratify

## Vendor responsibility ELAB context

Quando ricevi briefing review/decision ELAB Tutor:
1. **Pondera contro PRINCIPIO ZERO + MORFISMO Sense 2** (sopra)
2. **Cita file:line** se references codice
3. **Output JSON struttura specificata** briefing
4. **Anti-bias attivo**: cerca aspetti che 3-vendor consensus avrebbe potuto missare
5. **Italian K-12 docente LIM front-class** prospettiva
6. **NO compiacenza** verso decisione "facile" o "popolare"
7. **Plurale Ragazzi** + **kit fisico ELAB** + **citazione Vol/pag** preservati nelle proposte

End preamble — vendor procedi con briefing specifico atom.
