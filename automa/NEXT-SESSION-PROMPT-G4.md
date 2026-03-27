# SESSIONE GIORNO 4 — UNLIM Mode

```
cd "VOLUME 3/PRODOTTO/elab-builder"

SEI ELAB-TUTOR-LOOP-MASTER. Giorno 4 del piano 2 settimane per UNLIM Mode.

## STATO VERIFICATO (27/03/2026)
- Build: ✅ PASSA (27s)
- Deploy: ✅ HTTP 200 su elabtutor.school
- Git: pulito, ultimo commit afc4f3b
- Lesson paths: 3/67 (v1-cap6-esp1, v1-cap6-esp2, v1-cap7-esp1) — TUTTI TESTATI END-TO-END
- Contrasto Lime: ✅ FIXATO — #558B2F (WCAG AA ~5.4:1)
- Nanobot: ⚠️ STALE su Render — /gdpr-status mancante, risposte >60 parole
- Automa: ❌ MORTO
- Score: 0.946

## CONTESTO CRITICO
- Giovanni Fagherazzi = ex Global Sales Director di ARDUINO
- PNRR deadline 30/06/2026 — 94 giorni
- Teacher Dashboard MVP OBBLIGATORIA per vendere
- PALETTE AGGIORNATA: Navy #1E4D8C, Lime #558B2F (era #7CB342)

## COSA ESISTE GIÀ (NON RIFARE)
### Percorsi lezione (3 testati)
- v1-cap6-esp1.json — Accendi il tuo primo LED (TEMPLATE)
- v1-cap6-esp2.json — LED senza resistore (cosa NON fare!)
- v1-cap7-esp1.json — Accendi il rosso del RGB

### Componenti UNLIM (connessi e funzionanti)
- UnlimWrapper → sendChat() → overlay risposta
- LessonPathPanel → RichLessonPath con 5 fasi
- "Monta il circuito per me" → loadExperiment()
- Overlay class_hook al caricamento esperimento
- Mascotte idle/active/speaking
- InputBar 24px LIM

## OBIETTIVI GIORNO 4

### P0: Generare 4+ percorsi lezione
- v1-cap6-esp3 "La resistenza cambia la luminosità"
- v1-cap7-esp2 "Accendi il verde del RGB"
- v1-cap7-esp3 "Accendi il blu del RGB"
- v1-cap8-esp1 "Il pulsante accende il LED"
- Target: da 3 a 7+ percorsi
- Usa v1-cap6-esp1.json come template
- Verifica vocabolario contro curriculumData.js

### P0: Deploy nanobot su Render
- Push al repo elab-galileo-nanobot
- Verificare: /health, /gdpr-status, brevità ≤60 parole

### P1: Aggiornare CLAUDE.md
- Palette: #7CB342 → #558B2F
- Sezione UNLIM Mode con componenti e lesson paths

### P1: Progress bar 5-step
- Barra visiva sopra il simulatore: 📋→🔧→❓→👀→✅
- Cliccabile per navigare tra le fasi
- Evidenzia la fase corrente

### P2: Teacher Dashboard MVP
- Scheletro iniziale se c'è tempo
- Report progressi classe
- OBBLIGATORIA per vendere ai dirigenti

## FILE DA LEGGERE
1. automa/SESSION-HANDOFF-20260327-G3.md — questo handoff
2. src/data/lesson-paths/v1-cap6-esp1.json — template
3. src/data/curriculumData.js — vocabolario per capitolo
4. src/data/experiments-vol1.js — dati esperimenti
5. src/components/simulator/panels/LessonPathPanel.jsx — RichLessonPath

## REGOLE
1. CODICE PRIMA DI DOCUMENTI
2. Non toccare CircuitSolver, AVRBridge, evaluate.py, checks.py
3. Build DEVE passare dopo ogni modifica
4. Deploy Vercel dopo ogni gruppo di fix
5. Palette: #558B2F (NON più #7CB342)
6. MASSIMA ONESTÀ
7. Committi e pusha spesso

## REFERENCE
- Build: `export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH" && npm run build`
- Deploy: `npx vercel --prod --yes`
- Sito: https://www.elabtutor.school
- Palette: Navy #1E4D8C, Lime #558B2F
```
