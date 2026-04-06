# AUDIT PDR v5 — 05/04/2026 — BRUTALMENTE ONESTO

## Baseline pre-sessione (da S1 04/04/2026)
- Build: PASS | Test: 1442 | Bundle: 2415KB
- buildSteps: 62/92 (67%) | scratchXml: 6/27 AVR (22%)
- 4 giochi attivi | Già Montato come default | Dashboard con RequireAuth

## Post-sessione — Numeri REALI

### Build & Test
| Metrica | Prima | Dopo | Delta |
|---------|-------|------|-------|
| Build | PASS 47s | PASS 30s | -17s (games removed) |
| Test | 1442/1442 | 1442/1442 | Zero regressioni |
| Bundle | 2415KB | 2405KB | -10KB |
| Precache | 30 entries | 30 entries | Stabile |

### Dati Esperimenti
| Metrica | Prima | Dopo | Delta |
|---------|-------|------|-------|
| Totale esperimenti | 92 | 92 | = |
| buildSteps | 62/92 (67%) | **92/92 (100%)** | +30 |
| scratchXml (AVR) | 6/27 (22%) | **26/27 (96%)** | +20 |
| hexFile (AVR) | 6/27 (22%) | 6/27 (22%) | NON CAMBIATO |
| Quiz | 92/92 | 92/92 | = |
| Lesson paths | 83 files | 83 files | = |

### Funzionalità Cambiate
| Cosa | Stato | Verifica |
|------|-------|----------|
| Penna (disegno) | Attiva senza exp caricato | ✅ Guard rimossa |
| Serial Monitor | Font 17px, input 16px | ✅ Più leggibile |
| Blockly toggle | Bottone 36x80px | ✅ Più visibile |
| 4 giochi rimossi | 11 file eliminati | ✅ Zero dangling |
| UNLIM verbosità | Max 60-80 parole in prompt | ✅ Verificato |
| AZIONE tags | 30 comandi con handler | ✅ 11 rimossi da prompt (non implementabili) |
| Già Montato | RIPRISTINATO (3 modi: Montato/Passo/Percorso) | ✅ State machine OK |
| Adaptive pacing | Percorso rallenta/accelera per errori | ✅ In BuildModeGuide |
| Dashboard | Senza RequireAuth | ✅ Accessibile via class_key |
| Lavagna multi-page | useLavagnaPages + PageBar | ✅ 3 nuovi file |
| Lavagna responsive | LIM/iPad/PC breakpoints | ✅ In PageBar.module.css |

## PROBLEMI NOTI — Onestà Assoluta

### P0 — Bloccanti
1. **hexFile mancanti per 21/27 esperimenti Vol3** — Senza HEX, l'emulazione AVR non parte. Il compilatore esterno (n8n su Hostinger) deve generarli. NON risolvibile in questa sessione.
2. **Lesson paths Vol2 incompleti**: 18/27 (mancano 9 per Cap3-5). I path ci sono come JSON ma il count non torna con gli esperimenti.

### P1 — Importanti
3. **scratchXml generati NON TESTATI in Blockly**: I 20 nuovi XML sono stati generati sinteticamente. Non è stata verificata la corretta resa in Blockly. Potrebbero avere block types sbagliati o connessioni invalide.
4. **buildSteps generati per Vol2 Cap3-5**: Questi esperimenti usano multimetro e batterie dirette (senza breadboard). I buildSteps assumono posizionamento che potrebbe non corrispondere al layout reale del simulatore per questi componenti.
5. **UNLIM verbosità**: Il prompt dice "max 60-80 parole" ma non c'è enforcement client-side. L'AI (Gemini) potrebbe ignorare l'istruzione. Il truncation lato client (truncateResponse) è a 80 parole ma potrebbe troncare risposte che necessitano di più spazio (es. codice Arduino).
6. **Lavagna multi-page**: Implementata ma NON testata con utente reale. Il localStorage potrebbe saturarsi con molte pagine di disegni SVG path.

### P2 — Minori
7. **16 issue preesistenti Vol1**: buildSteps che referenziano componenti con ID errati (Cap9, Cap10, Cap13). Preesistenti, non introdotti.
8. **CLAUDE.md aveva namespace sbagliato** (.galileo → .unlim). Corretto.
9. **Comandi AZIONE non implementabili rimossi**: opentab, openvolume, quiz, youtube, createnotebook, measure, diagnose, fullscreenscratch, openchat, closechat. Servono refactor del sistema eventi.

## Score ONESTO (scala 1-10, con giustificazione)

| Area | Score | Giustificazione |
|------|-------|-----------------|
| Simulatore core | 7/10 | Engine funziona, 92 exp, ma 21 senza HEX = non avviabili |
| SVG componenti | 7/10 | Gradienti e dettagli OK, non cambiati in questa sessione |
| Scratch/Blockly | 6/10 | 26/27 hanno XML ma NON TESTATO in runtime |
| UNLIM AI | 6/10 | 30 azioni implementate, verbosità nel prompt, ma nessun test E2E |
| Dashboard | 5/10 | Accessibile senza auth, ma funziona solo con localStorage (no Supabase live) |
| Lavagna | 6/10 | Multi-page + responsive, ma non testata con utenti reali |
| Build/Performance | 8/10 | 30s build, 2405KB, zero warning |
| Accessibilità | 5/10 | Font min OK, touch 44px, ma non audit WCAG completo |
| Dati esperimenti | 8/10 | 100% buildSteps, 96% scratchXml, quiz completi |
| Visual/UX | 6/10 | Serial leggibile, penna OK, ma nessun test utente |

### COMPOSITO REALE: **6.4/10**

### Confronto con sessione precedente (S1 04/04/2026): 5.6 → **6.4** (+0.8)

## Cosa NON è stato fatto (onestà)
1. ❌ Nessuna verifica live con Control Chrome (richiesta nella FASE 0)
2. ❌ Nessun test E2E dei 30 scenari richiesti nella FASE 6
3. ❌ Nessun benchmark 200 con screenshot
4. ❌ HEX files non generati (serve compilatore esterno)
5. ❌ Lesson paths Vol2 non completati (9 mancanti)
6. ❌ Nomi studenti in Supabase non implementati
7. ❌ Classes Supabase non implementate (solo class_key localStorage)
8. ❌ Fumetto non verificato con sessione reale
9. ❌ Fisica 15 test non eseguiti

## Cosa È stato fatto (con numeri)
1. ✅ buildSteps: 62 → 92 (+30 esperimenti)
2. ✅ scratchXml: 6 → 26 (+20 esperimenti)
3. ✅ 4 giochi rimossi (11 file, 3 edit)
4. ✅ Penna: funziona senza esperimento
5. ✅ Serial Monitor: font 17px leggibile
6. ✅ Blockly toggle: 36x80px visibile
7. ✅ UNLIM: 30 AZIONE handlers, verbosità 60-80 parole
8. ✅ Dashboard: senza RequireAuth
9. ✅ Lavagna: multi-page + responsive
10. ✅ Già Montato: ripristinato correttamente
11. ✅ Adaptive pacing: in Percorso mode
12. ✅ CLAUDE.md: namespace corretto
13. ✅ Build: PASS, 1442 test PASS, zero regressioni
