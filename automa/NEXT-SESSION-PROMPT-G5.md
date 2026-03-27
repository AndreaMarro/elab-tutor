# SESSIONE GIORNO 5 — COMPLETARE VOLUME 1 CAPITOLI 6-10

```
cd "VOLUME 3/PRODOTTO/elab-builder"

SEI ELAB-TUTOR-LOOP-MASTER. Giorno 5 del piano 2 settimane per UNLIM Mode.

## STATO VERIFICATO (27/03/2026 fine G4)
- Build: ✅ PASSA (26s)
- Deploy: ✅ HTTP 200 su elabtutor.school
- Git: pulito, ultimo commit 2e19e41 (fix vocab)
- Lesson paths: 13/67 totali, 13/38 Volume 1
- Capitoli COMPLETI (con lesson paths): 6 ✅, 7 ✅
- Capitoli PARZIALI: 8 (2/5), 9 (1/9), 10 (1/6)
- Bug critici: 0 (tutti fixati G4)
- Vocab check automatico: 0 violazioni reali
- Audit indipendente G4: 0 bug runtime, 0 data mismatch
- Rapporto commit feat/fix:docs = 2:0 (G4 invertito il trend)

## OBIETTIVO G5: COMPLETARE CAPITOLI 8-10

Target: generare i 16 lesson paths rimanenti per cap 8-10.
Da 13 a 29 lesson paths. Volume 1 cap 6-10 = 100% completo.
Questo chiude l'arco narrativo "circuiti DC senza Arduino".

### Perché questo è il lavoro più impattante
1. Cap 6-10 = tutta l'elettronica di base (LED → RGB → pulsante → pot → LDR)
2. Un insegnante può fare 10 lezioni COMPLETE con percorsi strutturati
3. Demo a Giovanni: "Ecco i primi 5 capitoli completi, 29 esperimenti guidati"
4. Cap 11-14 (buzzer, reed switch, condensatore, Arduino) richiedono vocabolario diverso → sessione separata
5. Al ritmo G4 (10/sessione), 16 è ambizioso ma fattibile perché i circuiti cap8-10 sono variazioni dello stesso pattern

## CONTESTO IMMUTABILE
- Giovanni Fagherazzi = ex Global Sales Director ARDUINO
- PNRR deadline 30/06/2026 — 93 giorni
- Palette: Navy #1E4D8C, Lime #558B2F
- NON toccare: CircuitSolver, AVRBridge, evaluate.py, checks.py

## PIANO SESSIONE — 3 BLOCCHI

### BLOCCO 1: BATCH 16 LESSON PATHS (120 min)

#### Cap 8 — Pulsante (3 rimanenti)
| # | ID | Titolo | Note |
|---|---|--------|------|
| 1 | v1-cap8-esp3 | RGB + pulsante = viola | RGB + pulsante, combo cap7+cap8 |
| 2 | v1-cap8-esp4 | 3 pulsanti → 3 colori RGB | 3 pulsanti separati |
| 3 | v1-cap8-esp5 | Mix avanzato con resistori diversi | combo resistori + pulsanti |

#### Cap 9 — Potenziometro (8 rimanenti)
| # | ID | Titolo | Note |
|---|---|--------|------|
| 4 | v1-cap9-esp2 | Inverti la rotazione | pot al contrario |
| 5 | v1-cap9-esp3 | LED di colore diverso con pot | pot + LED colorato |
| 6 | v1-cap9-esp4 | Dimmer RGB azzurrino | pot regola RGB |
| 7 | v1-cap9-esp5 | Pot miscelatore blu rosso | pot sceglie tra R e B |
| 8 | v1-cap9-esp6 | Lampada RGB con 3 pot | 3 pot × 3 canali |
| 9 | v1-cap9-esp7 | Sfida: aggiungi pulsanti alla lampada | pot + pulsanti |
| 10 | v1-cap9-esp8 | Sfida: combina esp 5+6 | combo |
| 11 | v1-cap9-esp9 | Sfida: aggiungi pulsante all'esp 8 | combo avanzata |

#### Cap 10 — Fotoresistenza (5 rimanenti)
| # | ID | Titolo | Note |
|---|---|--------|------|
| 12 | v1-cap10-esp2 | LED diverso colore con LDR | variazione colore |
| 13 | v1-cap10-esp3 | 3 LDR controllano RGB | 3 sensori × 3 canali |
| 14 | v1-cap10-esp4 | LED bianco illumina LDR → LED blu | LDR luce artificiale |
| 15 | v1-cap10-esp5 | Aggiungi pot per controllare LED bianco | LDR + pot combo |
| 16 | v1-cap10-esp6 | Aggiungi pulsante al circuito LDR | LDR + pulsante combo |

#### Vocabolario per capitolo (REGOLE):
- Cap 8: permesso "pulsante", "circuito aperto/chiuso", "LED RGB", "catodo comune", "resistore"
  VIETATO: ohm, volt, tensione, parallelo, serie, condensatore, potenziometro, Arduino
- Cap 9: come Cap 8 + permesso "potenziometro", "resistenza variabile", "manopola", "dimmer"
  VIETATO: ohm, volt, tensione, parallelo, serie, condensatore, Arduino, partitore
- Cap 10: come Cap 9 + permesso "fotoresistenza", "sensore", "LDR"
  VIETATO: ohm, volt, tensione, parallelo, serie, condensatore, Arduino, partitore

#### Processo per ogni JSON (veloce — no curriculum data per questi):
1. Leggi dati da experiments-vol1.js (components, connections, steps, observe, concept, unlimPrompt)
2. Genera JSON 5 fasi: PREPARA→MOSTRA→CHIEDI→OSSERVA→CONCLUDI
3. build_circuit.intent: copia components + connections dall'esperimento
4. Analogie: genera dal concept + unlimPrompt dell'esperimento
5. Aggiungi a index.js
6. VERIFICA VOCABOLARIO con lo script automatico (vedi BLOCCO 3)

### BLOCCO 2: BUILD + DEPLOY (15 min)
1. `npm run build` — DEVE passare
2. `npx vercel --prod --yes`
3. `curl -s -o /dev/null -w "%{http_code}" https://www.elabtutor.school` → 200

### BLOCCO 3: CHAIN OF VERIFICATION (15 min)

Eseguire TUTTE queste verifiche, riportare risultato PASS/FAIL:

| # | Verifica | Comando/Azione | Evidenza attesa |
|---|----------|----------------|-----------------|
| V1 | Build passa | `npm run build` | Exit 0 |
| V2 | Lesson paths in index.js | `grep "import" src/data/lesson-paths/index.js \| wc -l` | ≥ 29 |
| V3 | Deploy OK | `curl -s -o /dev/null -w "%{http_code}" https://www.elabtutor.school` | 200 |
| V4 | Cap 8 completo | Tutti 5 esp in index.js | v1-cap8-esp1..esp5 |
| V5 | Cap 9 completo | Tutti 9 esp in index.js | v1-cap9-esp1..esp9 |
| V6 | Cap 10 completo | Tutti 6 esp in index.js | v1-cap10-esp1..esp6 |
| V7 | Vocab check automatico | Script Python (sotto) | 0 violazioni reali |
| V8 | JSON schema consistency | Script Python | Tutte stesse chiavi top-level |
| V9 | Circuit data match | Per ogni JSON: intent.components = experiments-vol1 components | 100% match |
| V10 | Console errors | preview_console_logs level=error | Solo borderColor pre-esistente |
| V11 | Git commit feat | `git log -1 --oneline` | Commit feat, 16+ nuovi file |

### Script vocab check (V7) — ESEGUIRE DOPO AVER GENERATO I JSON:
```python
python3 -c "
import json, glob, re
violations = []
for f in sorted(glob.glob('src/data/lesson-paths/v1-*.json')):
    d = json.load(open(f))
    forbidden = set(w.lower() for w in d.get('vocabulary', {}).get('forbidden', []))
    eid = d['experiment_id']
    for pi, phase in enumerate(d.get('phases', [])):
        for field in ['teacher_message','teacher_tip','class_hook','provocative_question','observation_prompt','summary_for_class']:
            text = (phase.get(field) or '').lower()
            for fw in forbidden:
                if re.search(r'\b' + re.escape(fw) + r'\b', text):
                    context = re.search(r'non\s+(dire|introdurre|usare)\b.*\b' + re.escape(fw), text)
                    if not context:
                        violations.append(f'VIOLATION: {eid} phase[{pi}].{field}: \"{fw}\"')
        for mi, m in enumerate(phase.get('common_mistakes', [])):
            for mf in ['mistake','teacher_response','analogy']:
                text = (m.get(mf) or '').lower()
                for fw in forbidden:
                    if re.search(r'\b' + re.escape(fw) + r'\b', text):
                        violations.append(f'VIOLATION: {eid} phase[{pi}].mistakes[{mi}].{mf}: \"{fw}\"')
if violations:
    print(f'FAIL: {len(violations)} violations'); [print(f'  {v}') for v in violations]
else:
    print(f'PASS: 0 vocabulary violations')
"
```

### Script circuit data match (V9):
```python
python3 -c "
import json, glob, re
with open('src/data/experiments-vol1.js') as f:
    content = f.read()
mismatches = []
for f in sorted(glob.glob('src/data/lesson-paths/v1-*.json')):
    d = json.load(open(f))
    eid = d['experiment_id']
    for phase in d.get('phases', []):
        bc = phase.get('build_circuit')
        if not bc: continue
        intent_comps = bc.get('intent', {}).get('components', [])
        intent_wires = bc.get('intent', {}).get('wires', [])
        # Quick check: number of components and wires
        exp_match = re.search(rf'id:\s*\"{eid}\".*?components:\s*\[(.*?)\]', content, re.DOTALL)
        conn_match = re.search(rf'id:\s*\"{eid}\".*?connections:\s*\[(.*?)\]', content, re.DOTALL)
        if exp_match:
            exp_comp_count = len(re.findall(r'type:', exp_match.group(1)))
            if len(intent_comps) != exp_comp_count:
                mismatches.append(f'{eid}: {len(intent_comps)} intent comps vs {exp_comp_count} exp comps')
        if conn_match:
            exp_wire_count = len(re.findall(r'from:', conn_match.group(1)))
            if len(intent_wires) != exp_wire_count:
                mismatches.append(f'{eid}: {len(intent_wires)} intent wires vs {exp_wire_count} exp wires')
if mismatches:
    print(f'FAIL: {len(mismatches)} mismatches'); [print(f'  {m}') for m in mismatches]
else:
    print('PASS: all circuit data matches')
"
```

## FILE DA LEGGERE (MAX 8 file)

### Obbligatori prima di scrivere codice (4 file)
1. `src/data/lesson-paths/v1-cap6-esp1.json` — TEMPLATE (170 righe)
2. `src/data/experiments-vol1.js` — righe per cap8-10 (vedi tabella sopra)
3. `src/data/lesson-paths/index.js` — per aggiornare import
4. `src/data/curriculumData.js` — ha curriculum per v1-cap8-esp1, v1-cap9-esp1, v1-cap10-esp1 (già usati)

### Se serve
5. `src/data/lesson-paths/v1-cap8-esp1.json` — template cap8 (già fatto G4)
6. `src/data/lesson-paths/v1-cap9-esp1.json` — template cap9 (già fatto G4)
7. `src/data/lesson-paths/v1-cap10-esp1.json` — template cap10 (già fatto G4)

### NON leggere
- CLAUDE.md (già nel contesto)
- Contesto business (già nel prompt)
- File automa/context/
- I 5 componenti UNLIM
- TeacherDashboard (1774 righe — NON toccare oggi)

## REGOLE SESSIONE
1. ❌ ZERO commit `docs:` — solo `feat:` e `fix:`
2. ❌ ZERO agenti di ricerca/audit prima di aver scritto codice
3. ❌ ZERO handoff >50 righe
4. ✅ CODICE FIRST — batch genera JSON
5. ✅ Build dopo ogni blocco
6. ✅ Deploy una volta alla fine
7. ✅ CoV obbligatoria con le 11 verifiche sopra
8. ✅ Vocab check automatico PRIMA del commit
9. ✅ Se un JSON è dubbio, leggi l'esperimento originale prima

## ANTI-PATTERN (da G1-G4)
- ❌ Spendere 30min+ su audit prima di scrivere codice
- ❌ 10 commit docs per 3 commit feat
- ❌ Rileggere 43 file di contesto
- ❌ Handoff da 200+ righe
- ❌ Usare parole proibite nelle istruzioni per l'insegnante (audit G4 trovò 5 violazioni)

## OUTPUT ATTESO
- 16 lesson paths nuovi (da 13 a 29 totali)
- Cap 6-10 COMPLETI al 100% (29/29 esperimenti coperti)
- Build ✅ + Deploy ✅
- CoV con 11 verifiche PASS
- Vocab check: 0 violazioni reali
- Handoff ≤50 righe

## REFERENCE
- Build: `export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH" && npm run build`
- Deploy: `export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH" && npx vercel --prod --yes`
- Sito: https://www.elabtutor.school
- Palette: Navy #1E4D8C, Lime #558B2F

## VALUTAZIONE ONESTA DEL PERCORSO

### Ritmo attuale (dopo G4)
- G1-G3: 3 lesson paths in 3 giorni (1/giorno) → LENTO
- G4: 10 lesson paths + 4 bug fix + vocab fix → SVOLTA
- G5 target: 16 lesson paths → se riuscita, Vol 1 cap6-10 completo
- Al ritmo G4-G5: Vol 1 completabile in G6 (cap11-14 = 9 rimanenti)

### Cosa manca dopo G5 (onestamente)
- Vol 1 cap 11-14: 9 esperimenti (buzzer, reed switch, condensatore, Arduino base)
- Vol 2: 18 esperimenti (tutti Arduino)
- Vol 3: 11 esperimenti (Arduino avanzato)
- Teacher Dashboard: 1774 righe esistenti ma ZERO collegamento con lesson paths
- Demo-ready: manca integrazione lesson paths ↔ teacher view

### Priorità post-G5
1. G6: Completare Vol 1 (9 esp cap11-14) → Vol 1 = 38/38 = 100%
2. G7: Collegare lesson paths a TeacherDashboard (lista esperimenti con percorsi, progress)
3. G8-G9: Vol 2 lesson paths (18 esp Arduino)
4. G10: Vol 3 lesson paths (11 esp Arduino avanzato)
5. G11-G14: Polish, demo prep, Teacher Dashboard features
```
