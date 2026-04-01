# LAVAGNA CURRENT STATE
**Sessione**: S4/8 — ExperimentPicker + Stato-Driven Panels
**Iterazione Ralph Loop**: 1
**Ultimo aggiornamento**: 02/04/2026

## Task S4 Completati
- [x] 4.1: ExperimentPicker.jsx + .module.css creati e wired in LavagnaShell
  - Modal con backdrop, 3 tab volume, card esperimenti, ricerca, animazioni
  - onSelect wired a __ELAB_API.loadExperiment
  - onPickerOpen wired da AppHeader

## Task S4 In Corso
- [ ] 4.2: Colori volume + lucchetti + progress badge (INTEGRATO in 4.1)
- [ ] 4.3: Stress test click esperimento = carica nella Lavagna
- [ ] 4.4: AUDIT 1/3
- [ ] 4.5: LavagnaStateManager.js
- [ ] 4.6: Auto-apertura/chiusura pannelli
- [ ] 4.7: AUDIT 1/2
- [ ] 4.8: 3 modalita nella header
- [ ] 4.9: Integration test
- [ ] 4.10: AUDIT FINALE

## Metriche
- Build: PASS (33 precache, 4009KB)
- Test: 1008/1008 PASS
- #tutor: non verificato visivamente (serve preview)

## File Lavagna Creati (S1-S4)
- AppShell nesting non presente (LavagnaShell e il shell)
- AppHeader.jsx + .module.css
- FloatingWindow.jsx + .module.css
- FloatingToolbar.jsx + .module.css
- RetractablePanel.jsx + .module.css
- GalileoAdapter.jsx + .module.css
- VideoFloat.jsx + .module.css
- useGalileoChat.js
- ExperimentPicker.jsx + .module.css (NEW S4)
- LavagnaShell.jsx + .module.css (modified S4 - added picker)

## Debiti Tecnici
- FloatingToolbar Select/Wire/Pen non controllano tool mode simulatore
- RetractablePanel left: quick-add solo, no drag-and-drop reale
- ChatOverlay auto-click hack per UNLIM
- Welcome screen simulatore visibile sotto lavagna
- Video catalogo: videoId placeholder
