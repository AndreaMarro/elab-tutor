# Onnipotenza UI Audit — Simulator components (Agent B Phase 0 Atom 17.2)

**Date**: 2026-05-03
**Iter**: iter 31 ralph iter 17 — Onnipotenza expansion DEEP
**Plan ref**: `docs/superpowers/plans/2026-05-03-iter-31-onnipotenza-expansion-deep-iter-17-30.md` §2.2
**Sprint T close target advanced**: 9.0/10 ONESTO
**Agent**: B (Simulator components — read-only audit)

---

## §1 Methodology

- File ownership read-only: `src/components/simulator/{NewElabSimulator.jsx, IncrementalBuildHint.jsx, ElabSimulator.css, canvas/, components/, panels/, overlays/, hooks/, utils/, api/}`.
- Engine excluded per critical-files coordination (CLAUDE.md): `src/components/simulator/engine/{CircuitSolver.js, AVRBridge.js, PlacementEngine.js}` NOT audited (no UI surface — DC solver + AVR bridge + auto-placement headless).
- Selector resolution priority HYBRID per master plan §1.2: ARIA → data-elab- → text → CSS.
- Sense 1.5 marker recommendation: `data-elab-action="<verb-noun-kebab>"` per primary action + `data-elab-target="<canonical-id>"` per scoped element when role/aria insufficient.
- Natural language examples Italian docente register, plurale "Ragazzi" preserved where pedagogically appropriate (PRINCIPIO ZERO).
- Grep evidence: `grep -nE "onClick|onPointer|onMouse|onKey|onDrag|onDrop|onTouch|onWheel|onChange|aria-label|role=|data-elab-|data-testid"` su 21 file `panels/`, 4 file `canvas/`, 4 file `overlays/`, 21 file `components/`.
- Honesty: matrix below cites file:line; HYBRID priority recommended (NOT shipped); engine ownership respect per CLAUDE.md critical files.

---

## §2 Components audited

**Read-only file inventory** (38 .jsx + 5 .css/.module.css totale):

- **Shell**: `NewElabSimulator.jsx` (1022 LOC) + `IncrementalBuildHint.jsx`
- **Canvas (4)**: `SimulatorCanvas.jsx` (3149 LOC) + `PinOverlay.jsx` + `WireRenderer.jsx` + `DrawingOverlay.jsx`
- **Panels (21)**: `BomPanel.jsx`, `BuildModeGuide.jsx`, `CodeEditorCM6.jsx`, `ComponentDrawer.jsx`, `ComponentPalette.jsx`, `ControlBar.jsx`, `ExperimentGuide.jsx`, `ExperimentPicker.jsx`, `GalileoResponsePanel.jsx`, `LessonPathPanel.jsx`, `MinimalControlBar.jsx`, `NotesPanel.jsx`, `PropertiesPanel.jsx`, `QuizPanel.jsx`, `ScratchCompileBar.jsx`, `ScratchEditor.jsx`, `SerialMonitor.jsx`, `SerialPlotter.jsx`, `ShortcutsPanel.jsx`, `WhiteboardOverlay.jsx`
- **Overlays (4)**: `LdrOverlay.jsx`, `PotOverlay.jsx`, `RotateDeviceOverlay.jsx`, `RotationHandle.jsx`
- **Components (21)**: `Annotation.jsx`, `Battery9V.jsx`, `BreadboardFull.jsx`, `BreadboardHalf.jsx`, `BuzzerPiezo.jsx`, `Capacitor.jsx`, `Diode.jsx`, `LCD16x2.jsx`, `Led.jsx`, `MosfetN.jsx`, `MotorDC.jsx`, `Multimeter.jsx`, `NanoR4Board.jsx`, `PhotoResistor.jsx`, `Phototransistor.jsx`, `Potentiometer.jsx`, `PushButton.jsx`, `ReedSwitch.jsx`, `Resistor.jsx`, `RgbLed.jsx`, `Servo.jsx`, `Wire.jsx` + `registry.js` (registry, no UI)
- **Hooks (7)** + **Utils (8)** + **api (1)**: headless logic, NO UI surface — excluded matrix

**Engine NOT audited** (critical files coordination CLAUDE.md): `engine/CircuitSolver.js` (2486 LOC), `engine/AVRBridge.js` (1242 LOC), `engine/PlacementEngine.js` (822 LOC) — solver/CPU/auto-placement headless.

---

## §3 Interactive elements matrix

Legend: `T1`=ARIA (preferred), `T2`=data-elab-action recommended, `T3`=text, `T4`=CSS fallback. Sense 1.5 marker = `data-elab-action="<kebab-verb-noun>"` to add (NOT yet present unless noted "EXISTS").

### Toolbar / control bar (ControlBar + MinimalControlBar)

| File | Line | Role | Current selector | HYBRID priority | NL example | Sense 1.5 marker |
|------|------|------|------------------|-----------------|------------|------------------|
| panels/MinimalControlBar.jsx | 114 | btn Strumenti menu toggle | aria-label="Strumenti e opzioni" | T1 ARIA | "Apri il menu strumenti" | `data-elab-action="open-tools-menu"` |
| panels/MinimalControlBar.jsx | 215 | btn Pausa | aria-label="Pausa" | T1 | "Metti in pausa la simulazione" | `data-elab-action="sim-pause"` |
| panels/MinimalControlBar.jsx | 224 | btn Avvia | aria-label="Avvia" | T1 | "Avvia la simulazione" | `data-elab-action="sim-play"` |
| panels/MinimalControlBar.jsx | 236 | btn Azzera | aria-label="Azzera" | T1 | "Azzera lo stato del simulatore" | `data-elab-action="sim-reset"` |
| panels/MinimalControlBar.jsx | 247 | btn Compila | aria-label="Compila" | T1 | "Compila il codice" | `data-elab-action="code-compile"` |
| panels/MinimalControlBar.jsx | 269 | btn Esperimento back | aria-label dinamico | T1 | "Cambia esperimento" | `data-elab-action="experiment-change"` |
| panels/MinimalControlBar.jsx | 287 | btn Chiedi UNLIM | aria-label="Chiedi a UNLIM" | T1 | "Chiedi aiuto a UNLIM" | `data-elab-action="ask-unlim"` |
| panels/ControlBar.jsx | 342 | btn Toggle sidebar | onClick onToggleSidebar (no aria) | T2 add | "Apri la barra laterale" | `data-elab-action="toggle-sidebar"` |
| panels/ControlBar.jsx | 372/381 | btn Pause/Play | onClick (no aria literal verified) | T2 add | "Pausa simulazione" | `data-elab-action="sim-toggle-run"` |
| panels/ControlBar.jsx | 390 | btn Reset | onClick onReset | T2 add | "Resetta lo stato" | `data-elab-action="sim-reset"` |
| panels/ControlBar.jsx | 410 | btn Wire mode toggle | onClick onToggleWireMode | T2 add | "Attiva la modalità collegamento fili" | `data-elab-action="toggle-wire-mode"` |
| panels/ControlBar.jsx | 426 | btn Toggle palette | onClick onTogglePalette | T2 add | "Mostra la tavolozza componenti" | `data-elab-action="toggle-palette"` |
| panels/ControlBar.jsx | 435 | btn Toggle code editor | onClick onToggleCodeEditor | T2 add | "Apri l'editor codice" | `data-elab-action="toggle-code-editor"` |
| panels/ControlBar.jsx | 452 | btn Toggle lesson path | onClick onToggleLessonPath | T2 add | "Mostra il percorso lezione" | `data-elab-action="toggle-lesson-path"` |
| panels/ControlBar.jsx | 467 | btn Toggle quiz | onClick onToggleQuiz | T2 add | "Apri il quiz" | `data-elab-action="toggle-quiz"` |
| panels/ControlBar.jsx | 484 | btn Compila | aria-label="Compila" | T1 | "Compila e carica" | `data-elab-action="code-compile"` |
| panels/ControlBar.jsx | 504 | btn Toggle bottom panel | onClick (no aria) | T2 add | "Apri il monitor seriale" | `data-elab-action="toggle-bottom-panel"` |
| panels/ControlBar.jsx | 593 | btn Delete component | onClick onComponentDelete (no aria) | T2 add | "Elimina il componente selezionato" | `data-elab-action="component-delete"` |
| panels/ControlBar.jsx | 603 | btn Rotate component | onClick onComponentRotate | T2 add | "Ruota il componente selezionato" | `data-elab-action="component-rotate"` |
| panels/ControlBar.jsx | 611 | btn Show properties | onClick onShowProperties | T2 add | "Apri le proprietà del componente" | `data-elab-action="component-properties"` |
| panels/ControlBar.jsx | 625 | btn Chiedi UNLIM | aria-label="Chiedi a UNLIM" | T1 | "Chiedi a UNLIM" | `data-elab-action="ask-unlim"` |

### Canvas SVG (SimulatorCanvas + PinOverlay + WireRenderer + DrawingOverlay)

| File | Line | Role | Current selector | HYBRID priority | NL example | Sense 1.5 marker |
|------|------|------|------------------|-----------------|------------|------------------|
| canvas/SimulatorCanvas.jsx | 2517-2519 | svg drag-target wrapper | onDragOver/onDrop/onDragLeave | T2 add | "Aggiungi un LED al breadboard" → drop event sintetizzato | `data-elab-action="canvas-drop-target"` |
| canvas/SimulatorCanvas.jsx | 2532-2541 | svg pointer + click bg | onPointerDown/Move/Up/Cancel + onClick | T2 add | "Deseleziona tutto" (background click) | `data-elab-action="canvas-bg"` |
| canvas/SimulatorCanvas.jsx | 2245-2246 | g component shell | aria-label `${type} ${id}` + onPointerDown | T1 | "Seleziona il LED led1" | `data-elab-action="component-select"` data-elab-target="${id}" |
| canvas/SimulatorCanvas.jsx | 2319, 2338 | g pin handle (drag/select) | onPointerDown nested | T2 add | "Trascina il pin D13" | `data-elab-action="pin-drag"` data-elab-target="${pinId}" |
| canvas/SimulatorCanvas.jsx | 2916-2934 | menu contestuale azioni | aria-label="Menu azioni componente" + items aria-label | T1 | "Apri il menu azioni del componente" | `data-elab-action="component-context-menu"` |
| canvas/SimulatorCanvas.jsx | 2969 | btn annulla piazzamento | aria-label="Annulla piazzamento" | T1 | "Annulla il piazzamento" | `data-elab-action="placement-cancel"` |
| canvas/SimulatorCanvas.jsx | 2989-3014 | btn wire mode toggle (overlay zoom) | title "Filo / Filo ON" (NO aria) | T3+T2 add | "Attiva modalità filo" | `data-elab-action="toggle-wire-mode"` |
| canvas/SimulatorCanvas.jsx | 3016-3033 | btn Zoom in (+) | title="Ingrandisci" (NO aria) | T2 add | "Ingrandisci la vista" | `data-elab-action="zoom-in"` |
| canvas/SimulatorCanvas.jsx | 3034-3038 | btn Reset/center view | title="Centra e adatta" (NO aria) | T2 add | "Centra la vista" / "Ripristina lo zoom" | `data-elab-action="zoom-reset"` |
| canvas/SimulatorCanvas.jsx | 3039-3056 | btn Zoom out (−) | title="Riduci" (NO aria) | T2 add | "Riduci la vista" | `data-elab-action="zoom-out"` |
| canvas/SimulatorCanvas.jsx | 3146 | hover pin tooltip | aria-label dinamico | T1 | n/a (passive feedback) | `data-elab-action="pin-hover-tooltip"` |
| canvas/PinOverlay.jsx | 68 | circle pin click | onClick (no aria) | T2 add | "Collega il pin D13" | `data-elab-action="pin-click"` data-elab-target="${pinId}" |
| canvas/WireRenderer.jsx | 1052-1057 | path wire click+hover | onClick + onMouseEnter/Leave | T2 add | "Seleziona il filo da D13 a R1.A" | `data-elab-action="wire-select"` data-elab-target="${wireId}" |
| canvas/WireRenderer.jsx | 1350-1355 | midpoint handle click+touch | onClick + onTouchEnd | T2 add | "Aggiungi un punto al filo" | `data-elab-action="wire-add-midpoint"` |
| canvas/DrawingOverlay.jsx | 407-410 | svg pen pointer area | onPointerDown/Move/Up/Leave | T2 add | "Disegna sulla lavagna del simulatore" | `data-elab-action="pen-draw"` |
| canvas/DrawingOverlay.jsx | 448-450 | btn color swatch | aria-label dinamico | T1 | "Usa il colore rosso" | `data-elab-action="pen-color"` data-elab-target="${color}" |
| canvas/DrawingOverlay.jsx | 472-474 | btn pen size | aria-label dinamico | T1 | "Usa pennarello spesso" | `data-elab-action="pen-size"` |
| canvas/DrawingOverlay.jsx | 501 | btn Gomma | aria-label="Gomma" | T1 | "Usa la gomma" | `data-elab-action="pen-eraser"` |
| canvas/DrawingOverlay.jsx | 506 | btn Annulla (Ctrl+Z) | aria-label="Annulla" | T1+kbd | "Annulla l'ultimo tratto" | `data-elab-action="pen-undo"` |
| canvas/DrawingOverlay.jsx | 511 | btn Ripristina (Ctrl+Y) | aria-label="Ripristina" | T1+kbd | "Ripeti il tratto annullato" | `data-elab-action="pen-redo"` |
| canvas/DrawingOverlay.jsx | 516 | btn Cancella tutto | aria-label="Cancella" | T1 | "Cancella tutti i disegni" | `data-elab-action="pen-clear-all"` |
| canvas/DrawingOverlay.jsx | 524 | btn Esci penna | aria-label="Esci dalla modalità penna" | T1 | "Esci dalla modalità penna" | `data-elab-action="pen-exit"` |
| canvas/DrawingOverlay.jsx | 554 | btn Mostra toolbar | aria-label="Mostra barra strumenti disegno" | T1 | "Mostra la barra disegno" | `data-elab-action="pen-show-toolbar"` |

### Component palette + Drawer (ComponentPalette + ComponentDrawer)

| File | Line | Role | Current selector | HYBRID priority | NL example | Sense 1.5 marker |
|------|------|------|------------------|-----------------|------------|------------------|
| panels/ComponentPalette.jsx | 53-62 | div role=button drag source | role="button" + aria-label `Aggiungi ${label}` + onDragStart/End/Click + Enter/Space kbd | T1 | "Aggiungi un LED al circuito" | `data-elab-action="palette-add"` data-elab-target="${type}" |
| panels/ComponentPalette.jsx | 138 | container palette | EXISTS data-elab-palette="true" | T2 EXISTS | "Apri la tavolozza" | already present |
| panels/ComponentPalette.jsx | 175 | btn Mostra tutto / esperimento | aria-label dinamico | T1 | "Mostra tutti i componenti" | `data-elab-action="palette-show-all-toggle"` |
| panels/ComponentPalette.jsx | 187 | btn Wire mode toggle | onClick onWireModeToggle | T2 add | "Attiva modalità filo" | `data-elab-action="toggle-wire-mode"` |
| panels/ComponentDrawer.jsx | 111-125 | item tap select component | aria-label `Aggiungi ${label} al circuito` | T1 | "Aggiungi una resistenza" | `data-elab-action="drawer-add"` data-elab-target="${type}" |
| panels/ComponentDrawer.jsx | 294 | btn collapsed badge | aria-label dinamico stato passo | T1 | "Espandi la guida passo passo" | `data-elab-action="drawer-expand-badge"` |
| panels/ComponentDrawer.jsx | 305 | btn collapsed bar | aria-label="Espandi pannello componenti" | T1 | "Apri il pannello componenti" | `data-elab-action="drawer-expand"` |
| panels/ComponentDrawer.jsx | 323-339 | div panel + drag handle | role="region" + aria-label + onPointerDown/Move/Up/Cancel | T1 | "Sposta il pannello" | `data-elab-action="drawer-drag"` |
| panels/ComponentDrawer.jsx | 347 | btn collapse | onClick (no aria literal) | T2 add | "Chiudi il pannello componenti" | `data-elab-action="drawer-collapse"` |
| panels/ComponentDrawer.jsx | 399 | btn compile + play | onClick onCompileAndPlay | T2 add | "Compila e avvia" | `data-elab-action="compile-and-play"` |
| panels/ComponentDrawer.jsx | 454/497 | btn Prev/Next step | onClick handlePrev/handleNext | T2 add | "Passo successivo" / "Passo precedente" | `data-elab-action="drawer-step-next"` / `drawer-step-prev` |
| panels/ComponentDrawer.jsx | 469/482 | btn start Scratch / Arduino | onClick handleStartCode | T2 add | "Inizia con Scratch" / "Inizia con Arduino" | `data-elab-action="drawer-start-code"` data-elab-target="scratch|arduino" |

### Experiment picker + lesson path + guides

| File | Line | Role | Current selector | HYBRID priority | NL example | Sense 1.5 marker |
|------|------|------|------------------|-----------------|------------|------------------|
| panels/ExperimentPicker.jsx | 93-107 | btn volume tile | onClick + onMouseEnter/Leave (no aria) | T2 add | "Apri Volume 1" | `data-elab-action="picker-volume-select"` data-elab-target="vol${N}" |
| panels/ExperimentPicker.jsx | 135 | btn back to volumes | onClick (no aria) | T2 add | "Torna ai volumi" | `data-elab-action="picker-back-volumes"` |
| panels/ExperimentPicker.jsx | 152 | btn chapter tile | onClick (no aria) | T2 add | "Apri il Capitolo 6" | `data-elab-action="picker-chapter-select"` data-elab-target="${capId}" |
| panels/ExperimentPicker.jsx | 180 | btn back to chapters | onClick (no aria) | T2 add | "Torna ai capitoli" | `data-elab-action="picker-back-chapters"` |
| panels/ExperimentPicker.jsx | 201-202 | btn experiment select | aria-label `Carica esperimento: ${title}` | T1 | "Carica l'esperimento LED Blink" | `data-elab-action="picker-experiment-load"` data-elab-target="${expId}" |
| panels/LessonPathPanel.jsx | 222 | btn expand phase | onClick onExpandPhase (no aria) | T2 add | "Espandi la fase 2" | `data-elab-action="lesson-phase-expand"` data-elab-target="${idx}" |
| panels/LessonPathPanel.jsx | 317/471/801 | btn load next experiment | onClick onLoadExperiment (no aria) | T2 add | "Carica il prossimo esperimento" | `data-elab-action="lesson-load-next"` |
| panels/LessonPathPanel.jsx | 399-410 | div root + close + collapse | role/aria-label dinamico | T1 | "Riduci il percorso lezione" | `data-elab-action="lesson-collapse"` / `lesson-close` |
| panels/LessonPathPanel.jsx | 816 | container lesson path | EXISTS data-elab-lesson-path="true" | T2 EXISTS | "Apri il percorso" | already present |
| panels/LessonPathPanel.jsx | 860 | btn invia a UNLIM | onClick onSendToUNLIM (no aria) | T2 add | "Manda la fase corrente a UNLIM" | `data-elab-action="lesson-send-unlim"` |
| panels/ExperimentGuide.jsx | 32-46 | div root expandable | EXISTS data-elab-guide="true" | T2 EXISTS | "Apri la guida esperimento" | already present |
| panels/ExperimentGuide.jsx | 52/57 | btn comprimi/chiudi | title only (no aria) | T2 add | "Chiudi la guida esperimento" | `data-elab-action="guide-close"` |
| panels/ExperimentGuide.jsx | 107 | btn invia a UNLIM | onClick onSendToUNLIM | T2 add | "Chiedi a UNLIM di spiegare" | `data-elab-action="guide-explain-unlim"` |
| panels/BuildModeGuide.jsx | 77-119 | btn expand/collapse/close + drag handle resize | onClick + onPointerDown handleResizeStart | T2 add | "Espandi la guida costruzione" | `data-elab-action="build-guide-expand"` / `build-guide-resize` |
| panels/BuildModeGuide.jsx | 173/184 | btn Prev/Next step build | onClick handlePrev/handleNext | T2 add | "Passo successivo costruzione" | `data-elab-action="build-step-next"` / `build-step-prev` |

### Code editor + Scratch + Compile bar

| File | Line | Role | Current selector | HYBRID priority | NL example | Sense 1.5 marker |
|------|------|------|------------------|-----------------|------------|------------------|
| panels/CodeEditorCM6.jsx | 315/345 | CM6 textarea typing + onChange | CodeMirror EditorView (no aria) | T4 CSS | "Scrivi `digitalWrite(LED_BUILTIN, HIGH);`" → set value via API | `data-elab-action="code-type"` (host wrapper) |
| panels/CodeEditorCM6.jsx | 486/492 | btn font size −/+ | onClick (no aria) | T2 add | "Aumenta la dimensione del codice" | `data-elab-action="code-font-inc"` / `code-font-dec` |
| panels/CodeEditorCM6.jsx | 499-509 | btn Spiega codice | aria-label="Spiega il codice" | T1 | "Spiega il mio codice" | `data-elab-action="code-explain"` |
| panels/CodeEditorCM6.jsx | 546-549 | btn Chiudi pannello errori | aria-label="Chiudi pannello errori" | T1 | "Chiudi gli errori" | `data-elab-action="code-errors-close"` |
| panels/CodeEditorCM6.jsx | 563 | btn Compila | onClick onCompile (no aria literal here) | T2 add | "Compila il codice" | `data-elab-action="code-compile"` |
| panels/CodeEditorCM6.jsx | n/a | kbd Ctrl+S/Z/Y/A inside CM6 | CM6 keymap default | KBD | "Annulla l'ultima modifica" / "Salva" | exposed via `__ELAB_API.ui.key("ctrl+z")` |
| panels/ScratchEditor.jsx | 416-451 | Blockly workspace addChangeListener | Blockly Workspace ID | T4 | "Aggiungi un blocco quando si preme il bottone" | `data-elab-action="scratch-add-block"` (wrapper) |
| panels/ScratchCompileBar.jsx | 41/114/116 | btn retry / chiudi errori | onClick + aria-label="Chiudi pannello errori" | T1 | "Riprova compilazione Scratch" | `data-elab-action="scratch-retry"` / `scratch-errors-close` |
| panels/ScratchCompileBar.jsx | 130 | btn Compila Scratch | onClick onCompile | T2 add | "Compila lo Scratch" | `data-elab-action="scratch-compile"` |

### Properties / Notes / Quiz / BOM / Shortcuts / Galileo response

| File | Line | Role | Current selector | HYBRID priority | NL example | Sense 1.5 marker |
|------|------|------|------------------|-----------------|------------|------------------|
| panels/PropertiesPanel.jsx | 121-129 | div drag header (panel reposition) | onPointerDown/Move/Up/Cancel | T2 add | "Sposta il pannello proprietà" | `data-elab-action="properties-drag"` |
| panels/PropertiesPanel.jsx | 135 | btn close | onClick onClose (no aria) | T2 add | "Chiudi le proprietà" | `data-elab-action="properties-close"` |
| panels/PropertiesPanel.jsx | 153/186/220 | input value + Enter commit | onChange + onKeyDown Enter | T4 CSS+T2 | "Imposta la resistenza a 220 ohm" | `data-elab-action="properties-set-value"` data-elab-target="${param}" |
| panels/PropertiesPanel.jsx | 161/193 | select unit (Ω/kΩ/MΩ etc) | onChange | T2 add | "Cambia unità in kilo-ohm" | `data-elab-action="properties-set-unit"` |
| panels/PropertiesPanel.jsx | 238/265 | btn color swatch | onClick → onValueChange(id,'color',c) | T2 add | "Cambia il LED in rosso" | `data-elab-action="properties-set-color"` data-elab-target="${color}" |
| panels/NotesPanel.jsx | 71 | btn close | onClick onClose | T2 add | "Chiudi le note" | `data-elab-action="notes-close"` |
| panels/NotesPanel.jsx | 80/95 | btn color/weight selector | onClick + activeColor/Weight | T2 add | "Penna spessa nera" | `data-elab-action="notes-set-color"` / `notes-set-weight` |
| panels/NotesPanel.jsx | 115 | textarea content | onChange handleChange | T4 CSS | "Scrivi una nota: ricordare di…" | `data-elab-action="notes-type"` |
| panels/QuizPanel.jsx | 77/100/114 | btn close header | onClick onClose | T2 add | "Chiudi il quiz" | `data-elab-action="quiz-close"` |
| panels/QuizPanel.jsx | 98 | btn Riprova | onClick handleRetry | T3 text | "Riprova il quiz" | `data-elab-action="quiz-retry"` |
| panels/QuizPanel.jsx | 147 | btn answer option | onClick handleSelect(i) | T3 text | "Risposta B" | `data-elab-action="quiz-select"` data-elab-target="${optionIdx}" |
| panels/QuizPanel.jsx | 179 | btn Chiedi a UNLIM | onClick onSendToUNLIM | T3 text | "Chiedi a UNLIM perché ho sbagliato" | `data-elab-action="quiz-ask-unlim"` |
| panels/QuizPanel.jsx | 188 | btn Avanti | onClick handleNext | T3 text | "Domanda successiva" | `data-elab-action="quiz-next"` |
| panels/BomPanel.jsx | 98 | btn close | onClick onClose | T2 add | "Chiudi la lista materiali" | `data-elab-action="bom-close"` |
| panels/ShortcutsPanel.jsx | 63-74 | div backdrop + btn close | role="button" + aria-label="Chiudi" | T1 | "Chiudi le scorciatoie" | `data-elab-action="shortcuts-close"` |
| panels/GalileoResponsePanel.jsx | 26/44 | div backdrop + btn close | role="button" + aria-label="Chiudi risposta UNLIM" | T1 | "Chiudi la risposta di UNLIM" | `data-elab-action="unlim-response-close"` |
| panels/GalileoResponsePanel.jsx | 77 | btn Ask again | onClick onAskAgain (no aria) | T2 add | "Chiedi di nuovo a UNLIM" | `data-elab-action="unlim-ask-again"` |

### Serial Monitor + Plotter

| File | Line | Role | Current selector | HYBRID priority | NL example | Sense 1.5 marker |
|------|------|------|------------------|-----------------|------------|------------------|
| panels/SerialMonitor.jsx | 60 | select baud rate | onChange | T2 add | "Imposta baud a 9600" | `data-elab-action="serial-set-baud"` |
| panels/SerialMonitor.jsx | 79 | select line ending | onChange setLineEnding | T2 add | "Imposta line ending a Newline" | `data-elab-action="serial-set-line-ending"` |
| panels/SerialMonitor.jsx | 91 | btn timestamps toggle | onClick onToggleTimestamps | T2 add | "Mostra i timestamp del seriale" | `data-elab-action="serial-toggle-timestamps"` |
| panels/SerialMonitor.jsx | 109 | btn auto-scroll toggle | onClick setAutoScroll | T2 add | "Scorrimento automatico" | `data-elab-action="serial-toggle-autoscroll"` |
| panels/SerialMonitor.jsx | 124 | btn Cancella output | title="Cancella output" | T3 add T2 | "Cancella l'output del monitor seriale" | `data-elab-action="serial-clear"` |
| panels/SerialMonitor.jsx | 133 | btn Invia ultimi N a UNLIM | onClick onSendToUNLIM | T2 add | "Manda gli ultimi 500 caratteri a UNLIM" | `data-elab-action="serial-send-unlim"` |
| panels/SerialMonitor.jsx | 190-197 | input text + Send | onChange + onKeyDown Enter + onClick handleSend | T4 CSS + T2 | "Manda 'ON' al monitor seriale" | `data-elab-action="serial-input-send"` |
| panels/SerialPlotter.jsx | 225 | btn Pausa plotter | onClick setPaused | T2 add | "Metti in pausa il grafico" | `data-elab-action="plotter-pause"` |
| panels/SerialPlotter.jsx | 247 | btn Cancella dati plotter | title="Cancella dati" | T3+T2 add | "Cancella il grafico" | `data-elab-action="plotter-clear"` |

### Whiteboard overlay (lavagna disegno simulatore)

| File | Line | Role | Current selector | HYBRID priority | NL example | Sense 1.5 marker |
|------|------|------|------------------|-----------------|------------|------------------|
| panels/WhiteboardOverlay.jsx | 770-787 | canvas pointer (draw + click) | EXISTS data-elab-whiteboard-canvas + onPointerDown/Move/Up/Leave/Cancel + onClick | T2 EXISTS | "Disegna sulla lavagna" | already present |
| panels/WhiteboardOverlay.jsx | 816-839 | btn tool select/pencil/eraser/text/rect/circle/arrow/line | label + onClick | T3 text + T2 add | "Usa il rettangolo" | `data-elab-action="whiteboard-tool"` data-elab-target="${tool}" |
| panels/WhiteboardOverlay.jsx | 844 | btn color picker | aria-label `Colore ${c}` | T1 | "Cambia colore in blu" | `data-elab-action="whiteboard-color"` |
| panels/WhiteboardOverlay.jsx | 872 | btn thickness | aria-label `Spessore ${t}px` | T1 | "Spessore 5 pixel" | `data-elab-action="whiteboard-thickness"` |
| panels/WhiteboardOverlay.jsx | 878-879 | btn Annulla / Ripeti | label "Annulla (Ctrl+Z)" / "Ripeti (Ctrl+Y)" | T3+kbd | "Annulla l'ultimo tratto" | `data-elab-action="whiteboard-undo"` / `whiteboard-redo` |
| panels/WhiteboardOverlay.jsx | 881/885/886 | btn Zoom out/in + griglia toggle | label dinamico | T3+T2 add | "Zoom indietro" / "Mostra griglia" | `data-elab-action="whiteboard-zoom-out"` / `whiteboard-zoom-in` / `whiteboard-grid-toggle` |
| panels/WhiteboardOverlay.jsx | 888-891 | btn Salva PNG / Invia UNLIM / Cancella tutto / Chiudi | label dinamico | T3+T2 add | "Salva la lavagna come PNG" | `data-elab-action="whiteboard-export-png"` / `whiteboard-send-unlim` / `whiteboard-clear-all` / `whiteboard-close` |

### Overlays (Pot + LDR + Rotation + RotateDevice)

| File | Line | Role | Current selector | HYBRID priority | NL example | Sense 1.5 marker |
|------|------|------|------------------|-----------------|------------|------------------|
| overlays/PotOverlay.jsx | 51-64 | div backdrop close + slider pointer | onClick + onPointerDown/Move/Up | T2 add | "Chiudi l'overlay potenziometro" | `data-elab-action="pot-overlay-close"` |
| overlays/PotOverlay.jsx | 93 | input range slider | aria-label="Regola posizione potenziometro" | T1 | "Imposta il potenziometro al 50%" | `data-elab-action="pot-set-position"` |
| overlays/LdrOverlay.jsx | 20-24 | div backdrop close + btn close | onClick + close button | T2 add | "Chiudi l'overlay luce" | `data-elab-action="ldr-overlay-close"` |
| overlays/LdrOverlay.jsx | 59 | input range light level | aria-label="Regola livello luce fotoresistore" | T1 | "Imposta la luce al 70%" | `data-elab-action="ldr-set-light"` |
| overlays/RotationHandle.jsx | 77-112 | g rotation handle + 4 quadrant btns | data-testid="rotation-handle" + aria-label `Ruota a ${rot} gradi` | T1 | "Ruota il LED a 90 gradi" | `data-elab-action="rotate-component"` data-elab-target="${rot}" |
| overlays/RotateDeviceOverlay.jsx | 43/58 | div backdrop dismiss + btn dismiss | onClick handleDismiss | T2 add | "Chiudi l'avviso ruota dispositivo" | `data-elab-action="rotate-device-dismiss"` |

### Components SVG interactive (component-level handlers)

| File | Line | Role | Current selector | HYBRID priority | NL example | Sense 1.5 marker |
|------|------|------|------------------|-----------------|------------|------------------|
| components/PushButton.jsx | 16-19 | g press/release | aria-label `Pulsante ${id}` + onPointerDown/Up/Leave | T1 | "Premi il pulsante btn1" | `data-elab-action="push-button-press"` data-elab-target="${id}" |
| components/Potentiometer.jsx | 19 | g aria | aria-label `Potenziometro ${id}: ${pct}%` | T1 | "Apri il potenziometro pot1" (apre overlay) | `data-elab-action="open-pot-overlay"` |
| components/Servo.jsx | 18-19 | rect onClick | aria-label `Servo ${id}: ${angle}°` + rect onClick | T1 | "Cambia l'angolo del servo" | `data-elab-action="servo-toggle"` |
| components/Multimeter.jsx | 34-87 | g + onClick mode toggle | aria-label `Multimetro ${id}: ${value}${unit}` + onClick | T1 | "Cambia modalità multimetro a Ω" | `data-elab-action="multimeter-mode"` |
| components/MotorDC.jsx | 21-22 | rect onClick | aria-label `Motore DC ${id}` + onClick | T1 | "Avvia il motore m1" | `data-elab-action="motor-dc-toggle"` |

---

## §4 Drag-drop + canvas-specific recommendations (HYBRID selector challenges)

**Problema**: drag-drop palette → canvas non è un singolo "click su selettore" ma una sequenza dragstart → dragover → drop con coordinate sintetiche. ARIA + data-elab- da soli non risolvono.

**Recommendation 1 — Palette → Canvas drop intent**: esporre `__ELAB_API.ui.dropComponent({ type, x, y, target?: 'breadboard1' })` che internamente:
1. Risolve `palette item` via `data-elab-action="palette-add"` data-elab-target=type
2. Sintetizza DragEvent OR (preferito) chiama direttamente `__ELAB_API.simulator.placeComponent(type, x, y)` bypassando DOM event simulation
3. Anti-absurd: `isValidDropPosition` (SimulatorCanvas.jsx:73) già check overlap → propagare boolean al dispatcher

NL example: "Aggiungi un LED sopra al breadboard" → resolver capisce `type=led` + `target=bb1` + chiama placement helper headless.

**Recommendation 2 — Wire pin-to-pin connection**: esporre `__ELAB_API.ui.connectWire(fromPinId, toPinId)` (già esiste partial in `__ELAB_API.connectWire` per CLAUDE.md API globale). Ampliare con resolution simbolica:
- "Collega D13 al positivo del LED1" → resolver mappa `D13` → `nano:D13`, `LED1.+` → `led1.A`
- HYBRID priority: pin label aria first (`aria-label="Pin: ${label}"` SimulatorCanvas.jsx:3146) → fallback `data-elab-target="${pinId}"` → fallback CSS pin coord lookup via `resolvePinPosition` (WireRenderer.jsx)

**Recommendation 3 — Canvas pan/zoom natural language**:
- Zoom: `__ELAB_API.ui.zoom('in'|'out'|'fit'|<percent>)` mappato ai 3 button SimulatorCanvas.jsx:3016/3034/3039
- Pan: `__ELAB_API.ui.pan(dx, dy)` o semantic `__ELAB_API.ui.centerOn('led1')` (ricalcola viewBox per centrare componente)
- Anti-absurd: clamp `[MIN_ZOOM, MAX_ZOOM]` 0.3..3.0 (SimulatorCanvas.jsx:40-41)

**Recommendation 4 — Component select/multi-select**:
- Single: `__ELAB_API.ui.selectComponent(id)` → riusa onPointerDown handler component shell (SimulatorCanvas.jsx:2245-2246)
- Multi-select drag (rubber band): non visto in SimulatorCanvas (verifica iter 18+); proporre `__ELAB_API.ui.selectMultiple([id1, id2])`
- Deselect: click background `handleBackgroundClick` (SimulatorCanvas.jsx:2541) → `__ELAB_API.ui.deselectAll()`

**Recommendation 5 — Code editor headless (CodeMirror 6)**:
- CM6 textarea NON ha aria-label utilizzabile per docente — è un editor complesso
- Esporre `__ELAB_API.ui.setCode(text)` che chiama `viewRef.current.dispatch({ changes: ... })` direttamente
- Keyboard shortcuts (`Ctrl+S/Z/Y/A`) gestiti da CM6 keymap default — esporre via `__ELAB_API.ui.codeShortcut('save'|'undo'|'redo'|'select-all')`

**Recommendation 6 — Drawing pen (canvas SVG path)**:
- Pen draw è pointer-stream continuo (DrawingOverlay.jsx:407-410) — natural language non può sintetizzare un tratto
- Esporre solo controlli alti: `__ELAB_API.ui.penTool('color'|'size'|'eraser'|'undo'|'redo'|'clear-all'|'exit')`
- Disegno effettivo resta manuale docente

**Recommendation 7 — Range slider (Pot/LDR overlay + thickness/font)**:
- Tutti slider hanno aria-label (PotOverlay:93, LdrOverlay:59) — facile target T1
- Esporre `__ELAB_API.ui.setSlider(targetSelector, value)` che gestisce dispatch input event correttamente (React controlled input requires native setter trick).

**Recommendation 8 — Confirmation gate destructive**:
- `whiteboard-clear-all` (WhiteboardOverlay:890), `pen-clear-all` (DrawingOverlay:516), `serial-clear` (SerialMonitor:124), `code-errors-close` post errori → richiedere voice confirm "sì conferma" per `clear-all` operations (master plan §1.2 Decision 4).
- `clearCircuit` already exists in `__ELAB_API` (CLAUDE.md API globale) — confermare gate sul wrapper UI.

---

## §5 Honesty caveats

1. **Engine NOT audited** per critical-files coordination CLAUDE.md (`engine/CircuitSolver.js` 2486 LOC + `engine/AVRBridge.js` 1242 LOC + `engine/PlacementEngine.js` 822 LOC). Headless logic, no UI surface, ma le funzioni `__ELAB_API.simulator.*` (placement + solve) potrebbero essere indirettamente esposte tramite `ui.dropComponent` recommendation §4 (1) — verificare iter 18+ ADR-036 design.
2. **Hooks (7) + Utils (8) + api/AnalyticsWebhook NOT audited** per matrix UI: zero JSX rendering, solo logica. `useUndoRedo` espone `undo()/redo()` programmatic — esporre via `__ELAB_API.ui.codeShortcut('undo')` raccomandato.
3. **Multi-select rubber-band drag NON verificato** sorgente — recommendation §4 (4) speculativa, da convalidare leggendo `handlePointerDown` SimulatorCanvas.jsx:2532 in iter 18 dettaglio.
4. **PropertiesPanel value commit asincrono** (Enter key) — natural language `__ELAB_API.ui.setSlider("data-elab-action='properties-set-value'", 220)` deve dispatch Enter event OR chiamare `commitValue(localValue, localUnit)` direttamente. Verificare iter 18+.
5. **CodeMirror 6 editor non standard textarea** — `data-elab-action="code-type"` su wrapper non sufficiente; `__ELAB_API.ui.setCode(text)` deve usare `viewRef.current.dispatch` OR risk perdere undo history. CM6 EditorView API documentation → architect-opus iter 18+.
6. **Scratch/Blockly workspace headless typing impossibile** — `__ELAB_API.ui.scratchAddBlock(type)` deve usare Blockly `Workspace.create*Block()` API direttamente, NON sintetizzare drag-drop blocks. Out of scope natural language puro per UI mechanical, considerare LLM-only highlight/load XML (`scratchEditor` initialCode prop).
7. **Wire midpoint touchEnd vs click** (WireRenderer.jsx:1350-1355) — duplicato per touch device support. Single dispatcher `__ELAB_API.ui.wireAddMidpoint(wireId, x, y)` astrae entrambi.
8. **Data-elab markers EXISTS solo 5/40+** (palette + guide + lesson-path + whiteboard-canvas + rotation-handle data-testid). 35+ aggiunte raccomandate iter 22 per coverage HYBRID T2 stable selector.
9. **aria-label gap stimato ~25 button senza aria-label** (vedi T2-add count §3 above) — coverage attuale ~50%. Iter 22 + iter 16 +12 baseline → +35 ulteriori = ~50 markers totale per primary action coverage.
10. **Annotation.jsx component non analizzato dettaglio** — usato sia in `components/` che `NewElabSimulator.jsx` (importato), text edit potential interaction (double-click rename) — verificare iter 18 dettaglio.
11. **NewElabSimulator.jsx 1022 LOC top-level UI shell NON dettagliata in matrice** — pannelli importati (PropertiesPanel, GalileoResponsePanel, ExperimentGuide, BuildModeGuide, ComponentDrawer, NotesPanel, BomPanel, LessonPathPanel, ShortcutsPanel, WhiteboardOverlay, QuizPanel, RotateDeviceOverlay) tutti già coperti above. Tab change `onTabChange` callback prop (line 101) NOT covered → potenziale `ui.switchTab(name)`. Sidebar toggle stored localStorage `elab-sidebar-pref` (line 133-135) → potenziale `ui.toggleSidebar()`.

**No compiacenza**: matrice ~95 righe interactive elements documentate; NON shipped data-elab markers ~35 → richiede atom Maker iter 22 per add markers + ADR-036 §1 schema canonical action names + dispatcher whitelist expansion 12 → ~45 actions (post canvas/drag-drop/code/whiteboard mechanical actions).

---

## §6 Cross-link

- Master plan: `docs/superpowers/plans/2026-05-03-iter-31-onnipotenza-expansion-deep-iter-17-30.md` §2.2 (this atom 17.2)
- Sibling audits Phase 0 expected (parallel agents):
  - Agent A Lavagna: `docs/audits/2026-05-XX-onnipotenza-ui-audit-lavagna.md` (atom 17.1)
  - Agent C Tutor + UNLIM: `docs/audits/2026-05-XX-onnipotenza-ui-audit-tutor-unlim.md` (atom 17.3)
  - Agent D Cross-cutting: `docs/audits/2026-05-XX-onnipotenza-ui-audit-cross-cutting.md` (atom 17.4)
  - Scribe consolidate: `docs/audits/2026-05-XX-onnipotenza-ui-actions-MASTER-enumeration.md` (atom 17.5)
- Critical files coordination: `CLAUDE.md` § "File critici" (engine/ NOT touched)
- Existing ELAB_API surface ref: `CLAUDE.md` § "API globale simulatore" (`__ELAB_API.unlim.*` + `__ELAB_API.connectWire/clearCircuit/setComponentValue/mountExperiment/captureScreenshot`)
- Architect input ADR-036 (iter 18+): NEW namespace `__ELAB_API.ui.*` separato from `unlim.*` per mechanical UI ops (master plan §1.2 Decision 1+2+3)
- Sense 1.5 morfismo iter 16 baseline +12 markers → iter 22 +35 (questo audit count) = ~50 markers totale per primary UI action coverage stable HYBRID selector

**Phase 0 Atom 17.2 acceptance gate**: ~95 interactive elements matrix shipped (target ≥50 master plan §2.5 surpassed) + 5 caveats critical (target met) + cross-link master plan + sibling agents output dirs.
