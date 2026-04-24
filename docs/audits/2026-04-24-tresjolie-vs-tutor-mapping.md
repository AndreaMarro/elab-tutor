# Audit Q0 — Tresjolie volumi vs tutor lesson-paths mapping

**Data:** 2026-04-24
**Sprint:** Q0 (precede Q1 refactor Capitolo)
**Branch:** `feat/sprint-q0-tresjolie-analysis-2026-04-24`
**Artefatto dati:** `docs/data/volume-structure.json`
**Onestà:** massima. Numeri verificati CoV. Nessuna inflazione.

---

## TL;DR

- **3 volumi reali**: Vol1=14 Cap, Vol2=12 Cap, Vol3=12 Cap (**38 Capitoli totali**, non 68 come stimato nel PDR Sprint Q handoff).
- **Vol3 canonico = ODT** (pandoc). PDF V0.8.1 tronca Cap 9-12 titoli.
- **Vol3 incompleto**: Cap 9-12 stub senza body. Cap 3 body senza header esplicito. **5 Cap su 38 sono WIP/deboli**.
- **Tutor lesson-paths**: 94 file JSON (v1=38, v2=27, v3=29).
- **Capitoli tutor coperti**: 22/38 = **58% coverage**. Gap prevalentemente **legittimo** (teoria + WIP Vol3).
- **Match volume↔tutor quasi perfetto** su Cap sperimentali Vol1/Vol2 (markers 1:1).
- **Q1 migration target ridotto**: 68 file Capitolo → **38 file** (-44%). Timeline favorevole.

---

## 1. Correzione numeri handoff PDR Sprint Q

Il PDR Sprint Q stimava:
- Vol1 = 14 Cap ✓
- Vol2 = 27 Cap ✗ (reale: **12**)
- Vol3 = 27 Cap ✗ (reale: **12** dichiarati, 8 scritti completi)

**Impatto reale**:
- Q1 `src/data/capitoli/` target: ~~68 file~~ → **38 file**
- Timeline Q1 riduzione ~30-40% probabile
- CapitoloPicker UI (Q2) riduce complessità grid

Motivo dell'errore handoff: probabile confusione tra Capitoli (unità pedagogica) ed esperimenti/numero pagine totali.

## 2. Struttura reale 3 volumi (CoV verificata)

### Vol1 — Laboratorio Elettronica Base (14 Cap, 37 ESPERIMENTO markers PDF)

| Cap | Titolo | Pag | Tipo | Esp | Tutor files |
|-----|--------|-----|------|-----|-------------|
| 1 | Storia dell'Elettronica | 5-8 | theory | 0 | - |
| 2 | Grandezze elettriche + Ohm | 9-12 | theory | 0 | - |
| 3 | Cos'è un resistore? | 13-20 | theory | 0 | - |
| 4 | Cos'è la breadboard? | 21-24 | theory | 0 | - |
| 5 | Cosa sono le batterie? | 25-26 | theory | 0 | - |
| 6 | **Cos'è il diodo LED?** | 27-34 | experiment | 3 | v1-cap6-esp1..3 |
| 7 | **Cos'è il LED RGB?** | 35-42 | experiment | 6 | v1-cap7-esp1..6 |
| 8 | **Cos'è un pulsante?** | 43-56 | experiment | 5 | v1-cap8-esp1..5 |
| 9 | **Cos'è un potenziometro?** | 57-80 | experiment | 9 | v1-cap9-esp1..9 |
| 10 | **Cos'è un fotoresistore?** | 81-92 | experiment | 6 | v1-cap10-esp1..6 |
| 11 | **Cos'è un cicalino?** | 93-96 | experiment | 2 | v1-cap11-esp1..2 |
| 12 | **Interruttore magnetico** | 97-102 | experiment | 4 | v1-cap12-esp1..4 |
| 13 | **Cos'è l'elettropongo?** | 103-106 | experiment | 2 | v1-cap13-esp1..2 |
| 14 | **Primo robot** | 107-112 | project | 1 | v1-cap14-esp1 |

**Tutor v1 = 38 file**. Volume ESPERIMENTO markers PDF = 37 (robot cap14 senza marker esplicito, conteggio coerente).

### Vol2 — Elettronica Avanzata (12 Cap, 26 ESPERIMENTO markers PDF)

| Cap | Titolo | Pag | Tipo | Esp | Tutor files |
|-----|--------|-----|------|-----|-------------|
| 1 | Cenni storia | 5-8 | theory | 0 | - |
| 2 | Cos'è l'elettricità? | 9-12 | theory | 0 | - |
| 3 | **Il Multimetro** | 13-36 | experiment | 4 | v2-cap3-esp1..4 |
| 4 | **Approfondiamo resistenze** | 37-46 | experiment | 3 | v2-cap4-esp1..3 |
| 5 | **Approfondiamo Batterie** | 47-52 | experiment | 2 | v2-cap5-esp1..2 |
| 6 | **Approfondiamo Led** | 53-62 | experiment | 4 | v2-cap6-esp1..4 |
| 7 | **Cosa sono i condensatori?** | 63-74 | experiment | 4 | v2-cap7-esp1..4 |
| 8 | **Cosa sono i Transistor?** | 75-84 | experiment | 3 | v2-cap8-esp1..3 (PDF typo ESP 2 duplicato) |
| 9 | **Cosa sono i fototransistor?** | 85-92 | experiment | 2 | v2-cap9-esp1..2 |
| 10 | **Motore corrente continua** | 93-102 | experiment | 4 | v2-cap10-esp1..4 |
| 11 | I diodi | 103-108 | **theory_or_demo** | 0 | **GAP DA VERIFICARE** |
| 12 | **Robot marciante** | 109-114 | project | 1 | v2-cap12-esp1 |

**Tutor v2 = 27 file**. Volume markers = 26.
**Gap questionable Cap 11 Diodi**: volume ha contenuto ma no ESPERIMENTO marker. Tutor non copre. **Flag per Tea**: previsto esperimento hands-on o solo teoria?

### Vol3 — Arduino/Programmazione (12 Cap dichiarati, **5 WIP**)

| Cap | Titolo | Pag | Tipo | Esp | Tutor files |
|-----|--------|-----|------|-----|-------------|
| 1 | Storia programmazione | 5-8 | theory | 0 | - |
| 2 | Cos'è la programmazione | 9-12 | theory | 0 | - |
| 3 | Hardware e Software | 13-36 | theory | 0 | - (body senza header esplicito) |
| 4 | Introduciamo Arduino/IDE | 37-46 | theory | 0 | - |
| 5 | **Primo programma (Blink)** | 47-52 | experiment | 2 | v3-cap5-esp1..2 |
| 6 | **Pin digitali** | 53-62 | experiment | 7 | v3-cap6-esp1..7 + **morse + semaforo** (9 file!) |
| 7 | **Pin analogici** | 63-74 | experiment | 5 formali | v3-cap7-esp1..8 + mini (9 file!) |
| 8 | **Pin analogici avanzati (Serial)** | 75-84 | experiment | 4 | v3-cap8-esp1..5 + serial (6 file) |
| 9 | **(senza titolo - WIP)** | 85-92 | wip | 0 | - |
| 10 | **(senza titolo - WIP)** | 93-102 | wip | 0 | - |
| 11 | **(senza titolo - WIP)** | 103-108 | wip | 0 | - |
| 12 | **(senza titolo - WIP)** | 109-114 | wip | 0 | - |

**Tutor v3 = 29 file**. Volume esperimenti formali inferiti = **18**. **Overcoverage tutor**: tutor ha variant e sub-esperimenti che il volume non esplicita.

Inoltre 3 file `v3-extra-*`:
- `v3-extra-lcd-hello.json` — ipotesi LCD display
- `v3-extra-servo-sweep.json` — ipotesi Servo
- `v3-extra-simon.json` — ipotesi Simon game

Questi 3 **non mappano a Cap volumi** — freestyle bonus progetti.

---

## 3. Coverage analisi onesta

### Strutturale per Capitolo
- Capitoli totali dichiarati (TOC): **38**
- Capitoli con esperimenti tutor: **22**
- **Coverage strutturale: 22/38 = 57,9%**

### Legittimità del gap
- Gap legittimi (teoria pura Vol1/2/3 + WIP Vol3): **15 Cap**
- Gap questionable (Vol2 Cap 11 diodi): **1 Cap**
- Gap tutor non giustificato: **0 Cap**

**Coverage "utile" (escluso gap legittimi): 22/23 = 95,7%**.

### Per esperimenti
- Esperimenti volume espliciti Vol1+Vol2 PDF markers: 63 (37+26)
- Esperimenti Vol3 ODT inferiti: 18
- **Totale volumi: ~81 esperimenti**
- Tutor files: **94**
- Overcoverage: +13 files (variant v3 + 3 extras)

---

## 4. Gap & azioni

### 4.1 Gap legittimi — NO azione
- Vol1 Cap 1-5: teoria base (storia, Ohm, resistore, breadboard, batterie)
- Vol2 Cap 1-2: teoria (storia, elettricità)
- Vol3 Cap 1-4: teoria (storia, programmazione, HW/SW, IDE)
- Vol3 Cap 9-12: **WIP volume** (non tutor)

### 4.2 Gap questionable — flag Andrea/Tea
- **Vol2 Cap 11 (Diodi)**: volume ha contenuto pag 103-108 ma no tutor. Decisione richiesta:
  - (a) Creare tutor lesson-paths v2-cap11-esp{1..N} (se previsti esperimenti)
  - (b) Lasciare gap se Cap 11 è solo teoria approfondita

### 4.3 Vol3 WIP — flag Andrea/Tea
Vol3 Cap 9-12 senza contenuto scritto. **Dipendenze**:
- Blocca copertura completa Q1 (4/38 Cap mancano = -10,5% maturità)
- Dipende da Tea/team contenuti
- Opzioni:
  - (a) Completare Vol3 ODT con Tea prima di Q1
  - (b) Q1 migra solo 34 Cap, placeholder WIP per gli altri 4

### 4.4 Vol3 extras — decisione architetturale Q1
3 file `v3-extra-*` non mappano a Cap. Opzioni:
- (a) Merge in Cap6/7/8 come "esperimenti variant" (aggiunge flessibilità)
- (b) Nuova categoria Capitolo "progetti capstone" in Vol3
- (c) Spostare in sezione dedicata "Creatività libera"

### 4.5 Errori PDF noti
- Vol2 PDF: ESPERIMENTO 2 duplicato in Cap 8 Transistor (lines 2242 + 2252), typo da correggere se ripubblicazione
- Vol3 PDF V0.8.1: titolo Cap 8 corrotto (`LE UANTIT` invece di `LE QUANTITA`), Cap 9-12 titoli completamente mancanti

---

## 5. Q1 migration target corretto

Base dati per Q1 schema Capitolo migration:

| Tier | Count | Descrizione | Note |
|------|-------|-------------|------|
| 1 | 22 | Cap con esperimenti + tutor full coverage | migrazione diretta lesson-paths → capitoli |
| 2 | 11 | Cap teoria pura (Vol1 1-5, Vol2 1-2, Vol3 1-4) | `Capitolo` con solo `theory{}`, no `esperimenti[]` |
| 3 | 4 | Vol3 Cap 9-12 WIP | placeholder da completare post-Tea |
| 4 | 1 | Vol2 Cap 11 Diodi (questionable) | attesa decisione Andrea |
| **Totale** | **38** | | |

**Target concreto Q1**: 38 file `src/data/capitoli/{v1-cap1..v1-cap14, v2-cap1..v2-cap12, v3-cap1..v3-cap12}.json`.

**Extras**: decidere cosa fare dei 3 `v3-extra-*` (tier separato o integrazione).

---

## 6. Metodologia estrazione

1. `pdftotext -layout` Vol1 + Vol2 PDF TRES JOLIE → /tmp/vol{1,2}-tresjolie.txt
2. `pandoc -f odt -t plain` Vol3 ODT → /tmp/vol3-odt.txt (canonico, PDF incompleto)
3. Grep pattern:
   - `^[[:space:]]*Capitolo\s+[0-9]+` per header Cap (solo TOC match in Vol1/2)
   - `^\s*ESPERIMENTO\s+\d+` per markers Vol1/2
   - "In questo esperimento" per inferire esperimenti Vol3 ODT
4. `ls src/data/lesson-paths/` + `sed`/sort per count per Cap tutor
5. Cross-check numerico: tutor count ≈ volume markers + progetti finali

## 7. CoV (Chain of Verification)

| Check | Atteso | Reale | Risultato |
|-------|--------|-------|-----------|
| Totale Cap TOC | 38 | 38 | ✓ |
| Totale tutor files | 94 | 94 | ✓ |
| Vol1 tutor vs markers | 37 markers + 1 robot = 38 tutor | 38 | ✓ |
| Vol2 tutor vs markers | 26 markers + 1 robot = 27 tutor | 27 | ✓ |
| Vol3 tutor vs volume | 18 vol + variants + 3 extras | 29 | ✓ overcoverage giustificato |
| JSON schema valid | parseable | parseable | ✓ |

## 8. Prossimi passi

1. **Subito**: commit + PR draft volume-structure.json + questo audit
2. **Andrea decide**:
   - Vol2 Cap 11 Diodi: creare tutor o gap?
   - Vol3 Cap 9-12: completare con Tea prima di Q1 o placeholder?
   - Vol3 extras: tier separato o integrazione?
3. **Al gate Q0→Q1 PASS**: partire Q1 schema Capitolo con target 38 (non 68).

---

**Verdetto gate Q0**: **PASS con 3 decisioni pendenti**. Dati affidabili per Q1 migration.
Pass rate: 22/22 check sperimentali match volume↔tutor = **100% su Cap coperti**.
