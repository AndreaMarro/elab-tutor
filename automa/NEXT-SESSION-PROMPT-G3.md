# PROMPT PROSSIMA SESSIONE — Copia TUTTO qui sotto in una nuova sessione Claude Code

```
cd "VOLUME 3/PRODOTTO/elab-builder"

SEI ELAB-TUTOR-LOOP-MASTER. Giorno 3 del piano 2 settimane per UNLIM Mode.

## TASK
Continua dal Giorno 2 (27/03/2026). InputBar→Galileo connesso. LessonPathPanel ricco.
Ora: deploy nanobot brevità, verificare "Monta circuito" end-to-end, generare percorsi lezione,
progress bar sopra simulatore, UNLIM proattivo.

Prima leggi SOLO i file nella sezione CONTEXT FILES.
Poi verifica stato (build, deploy, nanobot, automa).
Poi lavora sugli obiettivi del Giorno 3.
Massima onestà. Usa superpowers.

## CONTEXT FILES — LEGGI PRIMA DI TUTTO (in ordine)

### A. Handoff e stato
1. automa/SESSION-HANDOFF-20260327-G2.md — cosa è stato fatto nel Giorno 2
2. automa/MASTER-PLAN.md — piano 2 settimane con Fasi 0-4

### B. Componenti UNLIM (Giorno 1+2)
3. src/components/unlim/UnlimWrapper.jsx — wrapper con handleSend→sendChat()
4. src/components/simulator/panels/LessonPathPanel.jsx — RichLessonPath + fallback
5. src/data/lesson-paths/v1-cap6-esp1.json — template JSON perfetto
6. src/data/lesson-paths/index.js — registry percorsi

### C. API e servizi
7. src/services/api.js — sendChat(), riga 517
8. nanobot/server.py — /gdpr-status, brevità (DA DEPLOYARE su Render)

### D. Contesto immutabile
9. automa/context/PRODUCT-VISION.md
10. automa/context/UNLIM-BRAIN-DESIGN.md

## OBIETTIVI GIORNO 3

### 1. Deploy nanobot su Render (P0)
- cd nanobot && git push render main
- Verificare /health, /gdpr-status
- Test 3 domande brevità: risposte <60 parole
- Se serve, modificare prompts/shared-optimized.yml per forzare brevità

### 2. Verificare "Monta il circuito" end-to-end (P0)
- **BUG FIXATO G2**: ora usa `loadExperiment(experimentId)` invece di broken addComponent
- L'esperimento v1-cap6-esp1 GIÀ definisce componenti+layout+wires in experiments-vol1.js
- Aprire simulatore → aprire LessonPathPanel → fase MOSTRA → click bottone
- Verificare nel browser che l'esperimento si carichi correttamente
- Se l'esperimento è già caricato, il bottone è un noop (corretto)

### 3. Generare 2-3 percorsi lezione (P1)
- v1-cap6-esp2.json (LED senza resistore)
- v1-cap7-esp1.json (Resistore protegge il LED)
- Copiare struttura da v1-cap6-esp1.json, adattare contenuto
- Aggiungere import in index.js
- Build DEVE passare

### 4. Progress bar 5-step sopra il simulatore (P1)
- Componente React: barra orizzontale sotto toolbar
- ● PREPARA ○ MOSTRA ○ CHIEDI ○ OSSERVA ○ CONCLUDI
- Sincronizzata con LessonPathPanel
- Visibile solo in UNLIM Mode quando c'è un percorso lezione

### 5. UNLIM proattivo al caricamento (P1)
- Quando si apre un esperimento con percorso lezione
- Mostra automaticamente "Oggi facciamo: [titolo]" + class_hook
- Già parzialmente implementato in UnlimWrapper (useEffect con class_hook)
- Testare e affinare

## BUGS GIÀ FIXATI (Giorno 1-2 — NON rifare)
- [x] Memory leak UnlimOverlay — FIXATO
- [x] Stale closure UnlimWrapper — FIXATO
- [x] Touch target 56px — FIXATO
- [x] Font input 24px — FIXATO
- [x] Switch position top:52px — FIXATO
- [x] <style> in <button> — FIXATO
- [x] handleSend placeholder → sendChat() — FIXATO
- [x] LessonPathPanel → RichLessonPath — FIXATO
- [x] "Monta il circuito" → loadExperiment() — FIXATO (era addComponent broken)
- [x] Failed queue svuotata (6→0 task)
- [x] 25 research generici archiviati da pending

## CONTESTO BUSINESS
- Giovanni Fagherazzi = ex Global Sales Director di ARDUINO
- Omaric Elettronica = filiera hardware Arduino
- PNRR deadline 30/06/2026
- Teacher Dashboard MVP OBBLIGATORIA per vendere
- Il prodotto deve essere all'altezza di chi ha gestito vendite globali Arduino

## REFERENCE
- Build: `export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH" && npm run build`
- Deploy Vercel: `npx vercel --prod --yes`
- Sito: https://www.elabtutor.school
- Nanobot: https://elab-galileo.onrender.com/health
- Nanobot repo: `cd nanobot && git push render main`
- Score: 0.946 (composite)
- Test: "La Prof.ssa Rossi lo capirebbe in 5 secondi?"

## RULES
1. Leggi SESSION-HANDOFF-G2 prima di tutto
2. Non toccare CircuitSolver, AVRBridge, evaluate.py, checks.py
3. Build DEVE passare dopo ogni modifica
4. Massima onestà
5. Committi e pusha spesso
6. Il test è: "La Prof.ssa Rossi lo capirebbe in 5 secondi?"
7. Deploy Vercel dopo ogni gruppo di fix significativo

## OUTPUT
Alla fine della sessione:
- Nanobot deployato con brevità (risposte <60 parole)
- "Monta il circuito" verificato end-to-end
- 2-3 percorsi lezione generati
- Progress bar 5-step visibile (se tempo)
- Tutto committato e pushato
- SESSION-HANDOFF scritto per Giorno 4
```
