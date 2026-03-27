# PROMPT PROSSIMA SESSIONE — Copia TUTTO qui sotto

```
cd "VOLUME 3/PRODOTTO/elab-builder"

SEI ELAB-TUTOR-LOOP-MASTER. Giorno 1 del piano 2 settimane per UNLIM Mode.

## TASK
Continua il lavoro dalla sessione 27/03/2026. La Fase 0 (fix UX) è COMPLETATA.
Ora inizia la costruzione di UNLIM Mode: il layer sopra il prodotto esistente.

## CONTEXT FILES — LEGGI PRIMA DI TUTTO
1. automa/SESSION-HANDOFF-20260327.md — cosa è stato fatto ieri, stato verificato, cosa non funziona
2. automa/MASTER-PLAN.md — piano 2 settimane con Fasi 0-4
3. automa/context/PRODUCT-VISION.md — bussola definitiva del prodotto
4. automa/context/UNLIM-BRAIN-DESIGN.md — design cervello pedagogico, 3 pezzi, sequenza
5. docs/plans/2026-03-27-unlim-brain-design.md — design doc approvato con componenti e architettura
6. automa/knowledge/competitor-lesson-structures.md — come PhET/Tinkercad/Arduino fanno le lezioni
7. automa/knowledge/gemini-lesson-template-v1-cap6-esp1.json — template percorso lezione da perfezionare
8. automa/CONTEXT-PROTOCOL.md — protocollo contesto per tutti gli agenti
9. automa/context/ELAB-COMPLETE-CONTEXT.md — committenti, Principio Zero, storia

## OBIETTIVI GIORNO 1-2

### 1. Template percorso lezione PERFETTO (v1-cap6-esp1)
- Prendi il template Gemini, perfezionalo
- 5 fasi: PREPARA → MOSTRA → CHIEDI → OSSERVA → CONCLUDI
- Vocabolario corretto per Cap 6 (NO "resistenza", si introduce al Cap 7)
- Suggerimento docente concreto, domanda provocatoria per la classe
- Questo diventa il modello per l'automa per gli altri 66 esperimenti

### 2. Scheletro componenti React UNLIM Mode
Crea i file base (scheletro funzionante, non completo):
- src/components/unlim/UnlimWrapper.jsx — wrapper che nasconde/mostra UI classica
- src/components/unlim/UnlimMascot.jsx — mascotte ELAB nell'angolo (immagine statica + CSS glow)
- src/components/unlim/UnlimOverlay.jsx — messaggi contestuali (posizione + testo + fade)
- src/components/unlim/UnlimInputBar.jsx — barra input (testo + mic + invio)
- src/components/unlim/UnlimModeSwitch.jsx — bottone switch + localStorage

### 3. Deploy nanobot su Render
Le modifiche Mistral + Galileo brevità + /gdpr-status sono nel repo, servono in produzione.

### 4. L'automa genera percorsi lezione
Verifica che l'automa sia vivo (watchdog lo rilancia).
Dagli task YAML specifici per generare percorsi lezione usando il template perfetto.

## REFERENCE
- Il prodotto ha un motore 8/10 (simulatore funziona) e UX 3/10 (troppa complessità)
- UNLIM Mode è un LAYER SOPRA il prodotto, non un rifacimento
- Le funzionalità restano circa le stesse — cambia fruizione ed estetica
- Nessun competitor ha AI dentro il simulatore (PhET=sandbox, Tinkercad=no AI, Arduino CTC=€1830)
- Palette: Navy #1E4D8C, Lime #7CB342, Vol1 verde, Vol2 arancione, Vol3 rosso
- La Prof.ssa Rossi (52 anni, zero esperienza) è il test di ogni modifica

## RULES
1. Leggi SESSION-HANDOFF prima di tutto — non ripetere lavoro già fatto
2. Leggi MASTER-PLAN per sapere cosa fare oggi
3. Non toccare CircuitSolver, AVRBridge, evaluate.py — funzionano
4. Build DEVE passare dopo ogni modifica
5. Massima onestà — se qualcosa non funziona, dillo
6. Committi e pusha spesso — il lavoro non committato si perde
7. Usa superpowers per audit e CoV

## PLAN
1. Leggi i 9 file di contesto (10 min)
2. Verifica stato: automa vivo? build passa? deploy aggiornato? (5 min)
3. Perfeziona template percorso lezione v1-cap6-esp1 (30 min)
4. Crea scheletro 5 componenti React UNLIM Mode (2-3 ore)
5. Integra UnlimWrapper in ElabTutorV4 + switch funzionante (1 ora)
6. Deploy nanobot su Render (15 min)
7. Dai all'automa task per generare percorsi lezione (15 min)
8. Audit + CoV (15 min)

## OUTPUT
Alla fine della sessione:
- Template percorso lezione perfetto e testato
- 5 componenti React funzionanti (scheletro)
- Switch UNLIM/Classic funzionante
- Nanobot deployato con Mistral + brevità
- L'automa sta generando percorsi lezione
- Tutto committato e pushato
```
