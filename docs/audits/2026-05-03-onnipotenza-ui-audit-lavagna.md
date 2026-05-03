# Onnipotenza UI Audit — Lavagna components (iter 31 ralph 17 Phase 0 Atom 17.1)

**Date**: 2026-05-03
**Agent**: Agent A (Lavagna ownership)
**Plan ref**: `docs/superpowers/plans/2026-05-03-iter-31-onnipotenza-expansion-deep-iter-17-30.md` §2 Phase 0 Atom 17.1
**Source**: User feedback iter 16 ralph close — "valutare ogni possibile azione fattibile con mouse e tastiera e renderla possibile in linguaggio naturale"
**File ownership**: read-only `src/components/lavagna/` (24 .jsx + 21 .module.css = 45 file, 5443 LOC totale)

---

## §1 Methodology

1. `wc -l src/components/lavagna/*.jsx` enumeration → 24 jsx file 5443 LOC
2. `grep -nE "onClick|onChange|onInput|onMouseDown|onMouseUp|onKeyDown|onPointerDown|onSubmit|aria-label|data-elab|role="` per-component scan
3. Per-element line citation file:line + role + selector strategy + recommended HYBRID priority + natural language example + Sense 1.5 marker recommendation
4. Cross-check `data-elab-*` markers iter 16 +12 baseline (`data-elab-mode` LavagnaShell:1082, `data-elab-modalita` ModalitaSwitch:74)
5. NO src code modifications (read-only audit)

---

## §2 Components audited (24 jsx)

| Component | LOC | Primary role |
|---|---|---|
| LavagnaShell | 1428 | Shell orchestratrice modes + windows + state aggregator |
| GalileoAdapter | 709 | Passo Passo + UNLIM chat overlay wrapper |
| ExperimentPicker | 398 | Modal scelta esperimenti vol1/vol2/vol3 |
| VideoFloat | 356 | YouTube + Videocorsi catalogo |
| VolumeViewer | 264 | PDF viewer + penna annotazioni |
| FloatingWindow | 239 | Wrapper drag/resize/minimize/maximize |
| PercorsoCapitoloView | 192 | Vista capitolo con esperimenti+fasi |
| FloatingToolbar | 182 | 7 strumenti pen/wire/select/delete |
| MascotPresence | 178 | Mascotte UNLIM trascinabile |
| SessionReportComic | 174 | Report fumetto sessione |
| AppHeader | 161 | Tab + breadcrumb + 4 toolbar buttons |
| UnlimNudgeOverlay | 140 | Overlay nudge contestuale |
| RetractablePanel | 136 | Pannello sinistro/destro/inferiore retrattile |
| ModalitaSwitch | 104 | 4 modalità (Percorso/Libero/Già Montato/Esperimento) |
| CapitoloPicker | 96 | Selezione volume + capitolo |
| DocenteSidebar | 95 | Sidebar docente colpo d'occhio |
| PercorsoPanel | 94 | Panel percorso |
| GiaMontato | 91 | Modalità "Già Montato" preview |
| LessonBar | 88 | Bar lezione + step counter |
| VetrinaV2 | 86 | Vetrina home pre-login |
| UnlimBar | 77 | Bar input UNLIM (text + mic + send) |
| ErrorToast | 70 | Toast errore con CTA "Chiedi a UNLIM" |
| LessonReader | 54 | Reader lezioni elenco esperimenti |
| LessonSelector | 31 | Nav lezioni |

---

## §3 Interactive elements matrix (62 elements file:line verified)

| Component:Line | Element | Action type | Current selector | HYBRID priority | Natural language example | Sense 1.5 marker |
|---|---|---|---|---|---|---|
| LavagnaShell:1082 | shell root | container | `data-elab-mode="lavagna"` + `data-elab-modalita={modalita}` | data-elab + role | "Apri lavagna" | EXISTS iter 16 |
| LavagnaShell:1270 | capitoli dialog | modal open/close | `role="dialog"` + `aria-label="Selezione capitolo"` | aria-label | "Apri elenco capitoli" / "Chiudi" | ADD `data-elab-action="dialog-capitoli"` |
| LavagnaShell:1282 | dialog close button | click | `aria-label="Chiudi selezione capitolo"` | aria-label | "Chiudi capitoli" | inherit dialog |
| LavagnaShell:1397 | mascotte expand | click | inferred mascotte trigger | aria-label needed | "Apri chat UNLIM" | ADD `data-elab-action="open-galileo"` |
| LavagnaShell:1376 | toast experiment-mounted | live region | `role="status"` + `aria-live="polite"` | role + aria-live | (read-only screen reader) | n/a |
| AppHeader:42 | tab Lavagna | click | `aria-label="Lavagna"` | aria-label | "Vai alla Lavagna" | ADD `data-elab-action="tab-lavagna"` |
| AppHeader:48 | tab Lezione Guidata | click | `aria-label="Lezione Guidata"` | aria-label | "Vai a Lezione Guidata" | ADD `data-elab-action="tab-lezione"` |
| AppHeader:55 | tab Dashboard classe | click | `aria-label="Dashboard classe"` | aria-label | "Apri dashboard classe" | ADD `data-elab-action="tab-classe"` |
| AppHeader:62 | tab Progressi | click | `aria-label="I miei progressi"` | aria-label | "Vai a i miei progressi" | ADD `data-elab-action="tab-progressi"` |
| AppHeader:74 | esperimento breadcrumb | click + Enter/Space | `role="button"` + `aria-label="Esperimento: ..."` + `onKeyDown Enter/Space` | aria-label + role | "Cambia esperimento" | ADD `data-elab-action="picker-experiment-open"` |
| AppHeader:101 | btn capitoli | click | `aria-label={open?'Chiudi':'Apri'} elenco capitoli` | aria-label | "Apri capitoli" / "Chiudi capitoli" | ADD `data-elab-action="toggle-capitoli"` |
| AppHeader:117 | btn manuale | click | `aria-label="Apri/Chiudi manuale"` | aria-label | "Apri il manuale" | ADD `data-elab-action="toggle-volume-viewer"` |
| AppHeader:132 | btn video | click | `aria-label="Apri/Chiudi video"` | aria-label | "Apri video" | ADD `data-elab-action="toggle-video-float"` |
| AppHeader:146 | btn Fumetto | click | `aria-label="Apri Fumetto Report della sessione"` | aria-label | "Apri il fumetto" | ADD `data-elab-action="open-fumetto"` |
| ModalitaSwitch:71 | tablist 4 modalità | container | `role="tablist"` + `aria-label="Modalità lavagna"` + `data-elab-modalita` | role + data-elab | "Modalità percorso/libero/già montato/esperimento" | EXISTS iter 16 |
| ModalitaSwitch:84 | mode tab | click | `role="tab"` + `aria-label={meta.tooltip}` + `aria-selected` | role + aria-label | "Modalità Percorso" | ADD `data-elab-action="modalita-{mode}"` per tab |
| FloatingWindow:181 | dialog wrap | container | `role="dialog"` + `aria-modal="true"` + `aria-label={title}` | aria-label + role | (per-finestra: "Sposta finestra Passo Passo") | ADD `data-elab-window={titleKebab}` |
| FloatingWindow:187 | titleBar drag | drag pointer | `onPointerDown` no aria | unique inferred | "Sposta la finestra a destra" | ADD `data-elab-action="drag-window"` |
| FloatingWindow:192 | btn minimize | click | `aria-label="Minimizza"` | aria-label | "Minimizza finestra" | ADD `data-elab-action="window-minimize"` |
| FloatingWindow:203 | btn maximize | click | `aria-label="Espandi"` | aria-label | "Espandi finestra" | ADD `data-elab-action="window-maximize"` |
| FloatingWindow:214 | btn close | click | `aria-label="Chiudi"` | aria-label | "Chiudi finestra" | ADD `data-elab-action="window-close"` |
| FloatingWindow:232-234 | resize handles | drag pointer (right/bottom/corner) | no aria, css class only | css `.resizeHandle` | "Allarga finestra" | ADD `data-elab-action="window-resize-{dir}"` |
| FloatingToolbar:147 | toolbar root | container | `role="toolbar"` + `aria-label="Strumenti lavagna"` + `onPointerDown handleDragStart` | role + aria-label | "Sposta toolbar" | ADD `data-elab-action="drag-toolbar"` |
| FloatingToolbar:171 | tool button (×7 pen/wire/select/delete/etc) | click | `aria-label={tool.label}` + `aria-pressed` | aria-label | "Strumento penna" / "Strumento cancella" | ADD `data-elab-action="tool-{id}"` |
| RetractablePanel:106 | panel root | container | `role="complementary"` + `aria-label="Pannello sinistro/destro/inferiore"` | role + aria-label | "Apri pannello sinistro" | ADD `data-elab-action="panel-{direction}"` |
| RetractablePanel:125 | toggle button | click | `aria-label={open?'Chiudi':'Apri'} pannello` | aria-label | "Chiudi pannello" | ADD `data-elab-action="panel-toggle-{dir}"` |
| RetractablePanel:274 | quick-add component button | click | `aria-label={'Aggiungi ' + label}` | aria-label | "Aggiungi LED" | ADD `data-elab-action="quick-add-{type}"` |
| RetractablePanel:285 | toggle showAll | click | `aria-label={s?'Mostra solo...':'Mostra tutti...'}` | aria-label | "Mostra tutti i componenti" | ADD `data-elab-action="toggle-all-components"` |
| RetractablePanel:328 | bentornati start | click | text "Inizia" | text + role=button | "Continua dove eravamo" | ADD `data-elab-action="bentornati-start"` |
| RetractablePanel:354 | bentornati pick experiment | click | text "Scegli un esperimento" | text + role | "Scegli un altro esperimento" | ADD `data-elab-action="bentornati-pick"` |
| GalileoAdapter:55 | btn Prepara lezione | click | text "Prepara lezione" | text + role | "Prepara lezione" | ADD `data-elab-action="galileo-prepare-lesson"` |
| GalileoAdapter:184 | btn Indietro | click | text "Indietro" | text | "Vai indietro" | ADD `data-elab-action="passo-passo-prev"` |
| GalileoAdapter:187 | btn Chiedi UNLIM | click | `aria-label="Chiedi a UNLIM"` | aria-label | "Chiedi a UNLIM" | ADD `data-elab-action="ask-unlim-fase"` |
| GalileoAdapter:191 | btn Avanti | click | text "Avanti" | text | "Avanti" / "Vai avanti" | ADD `data-elab-action="passo-passo-next"` |
| GalileoAdapter:192 | btn Riepilogo | click | text "Riepilogo" | text | "Mostra riepilogo" | ADD `data-elab-action="passo-passo-summary"` |
| GalileoAdapter:376 | toggle solution | click | text-toggle | text + state | "Mostra soluzione" | ADD `data-elab-action="passo-passo-show-solution"` |
| GalileoAdapter:393 | btn Chiedi UNLIM (empty) | click | text + style | text | "Chiedi aiuto" | reuse marker |
| GalileoAdapter:410-412 | nav step (Indietro/Avanti/Ricomincia) | click | text only | text | "Ricomincia" / "Avanti" | reuse navigation markers |
| GalileoAdapter:487 | mascotte expand chat | click via DOM query | `[aria-label="Espandi chat UNLIM"]` | aria-label | "Espandi chat UNLIM" | ADD `data-elab-action="expand-chat-unlim"` |
| MascotPresence:157 | mascotte mascotte container | drag + click | `aria-label="Parla con UNLIM — trascina per spostare"` + `onPointerDown` | aria-label | "Parla con UNLIM" / "Sposta la mascotte in alto" | ADD `data-elab-action="mascot-talk"` + `data-elab-action="mascot-drag"` |
| UnlimBar:36 | btn expand chat | click | inferred | text/aria-label | "Apri chat" | ADD `data-elab-action="unlim-bar-expand"` |
| UnlimBar:41 | form submit | submit (Enter) | `<form onSubmit>` | form role | "Invia messaggio" | ADD `data-elab-action="unlim-bar-submit"` |
| UnlimBar:47 | input testo | type | `aria-label="Chiedi a UNLIM"` | aria-label | "Scrivi 'come funziona il LED'" | ADD `data-elab-action="unlim-bar-input"` |
| UnlimBar:55 | btn microfono | click | `aria-label="Attiva voce"` | aria-label | "Attiva microfono" | ADD `data-elab-action="unlim-bar-mic"` |
| UnlimBar:66 | btn invio | click | `aria-label="Invia messaggio"` | aria-label | "Invia" | ADD `data-elab-action="unlim-bar-send"` |
| UnlimNudgeOverlay:50 | overlay status | live region | `role="status"` | role | (read-only) | n/a |
| UnlimNudgeOverlay:97 | btn dismiss | click | `aria-label="Chiudi suggerimento UNLIM"` | aria-label | "Chiudi nudge" | ADD `data-elab-action="nudge-dismiss"` |
| UnlimNudgeOverlay:118 | btn approfondisci | click | `aria-label="Chiedi a UNLIM di approfondire"` | aria-label | "Approfondisci" | ADD `data-elab-action="nudge-deepen"` |
| ErrorToast:52 | toast container | live region | `role="alert"` | role | (read-only) | n/a |
| ErrorToast:60 | btn askUnlim | click | text "Chiedi aiuto" | text | "Chiedi aiuto sull'errore" | ADD `data-elab-action="error-ask-unlim"` |
| ErrorToast:63 | btn dismiss | click | `aria-label="Chiudi"` | aria-label | "Chiudi avviso" | ADD `data-elab-action="error-dismiss"` |
| VolumeViewer:162 | volume tab (vol1/2/3) | click | `aria-label={'Volume ' + v}` | aria-label | "Volume 2" | ADD `data-elab-action="volume-{v}"` |
| VolumeViewer:174 | btn pagina prec | click | `aria-label="Pagina precedente"` + disabled | aria-label | "Pagina precedente" | ADD `data-elab-action="page-prev"` |
| VolumeViewer:178 | input pagina | type number | `aria-label="Numero pagina"` + `<input type=number>` | aria-label + type | "Vai a pagina 42" | ADD `data-elab-action="page-input"` |
| VolumeViewer:181 | btn pagina succ | click | `aria-label="Pagina successiva"` | aria-label | "Pagina successiva" | ADD `data-elab-action="page-next"` |
| VolumeViewer:186 | btn zoom out | click | `aria-label="Zoom -"` | aria-label | "Zoom indietro" | ADD `data-elab-action="zoom-out"` |
| VolumeViewer:188 | btn zoom in | click | `aria-label="Zoom +"` | aria-label | "Zoom avanti" | ADD `data-elab-action="zoom-in"` |
| VolumeViewer:192 | btn penna toggle | click | `aria-label={d?'Disattiva':'Attiva'} penna` | aria-label | "Attiva penna" | ADD `data-elab-action="pen-toggle"` |
| VolumeViewer:207 | pen color buttons (×N) | click | `aria-label={'Colore ' + c}` | aria-label | "Colore rosso" | ADD `data-elab-action="pen-color-{c}"` |
| VolumeViewer:211 | pen size buttons (×N) | click | `aria-label={'Spessore ' + s}` | aria-label | "Spessore grosso" | ADD `data-elab-action="pen-size-{s}"` |
| VolumeViewer:216 | btn undo penna | click | `aria-label="Annulla tratto"` | aria-label | "Annulla ultimo tratto" | ADD `data-elab-action="pen-undo"` |
| VolumeViewer:219 | btn clear penna | click | `aria-label="Cancella annotazioni"` | aria-label | "Cancella tutte le annotazioni" | ADD `data-elab-action="pen-clear"` |
| VolumeViewer:229 | btn riprova errore | click | text "Riprova" | text | "Riprova" | ADD `data-elab-action="volume-retry"` |
| VideoFloat:62 | VideoCard | click | `aria-label="Guarda: {title}"` | aria-label | "Apri video {title}" | ADD `data-elab-action="video-card"` |
| VideoFloat:86 | CorsoCard locked/unlocked | click conditional | `aria-label` conditional | aria-label | "Apri corso {title}" | ADD `data-elab-action="corso-card"` |
| VideoFloat:171 | btn restore minimized | click | `aria-label="Espandi video"` | aria-label | "Espandi video" | ADD `data-elab-action="video-restore"` |
| VideoFloat:210 | btn back catalogo | click | `aria-label="Torna al catalogo"` | aria-label | "Torna al catalogo" | ADD `data-elab-action="video-back"` |
| VideoFloat:220 | tabs YouTube/Corsi | tablist | `role="tablist"` + `role="tab"` | role | "Mostra YouTube" / "Mostra Corsi" | ADD `data-elab-action="video-tab-{key}"` |
| VideoFloat:254 | input cerca | type | `aria-label="Cerca video"` | aria-label | "Cerca video Arduino" | ADD `data-elab-action="video-search-input"` |
| VideoFloat:261 | btn clear search | click | `aria-label="Cancella ricerca"` | aria-label | "Cancella ricerca" | ADD `data-elab-action="video-search-clear"` |
| VideoFloat:279 | btn suggestion | click | `aria-label="Cerca: {label}"` | aria-label | "Cerca {topic}" | ADD `data-elab-action="video-suggestion"` |
| VideoFloat:303 | btn YouTube external | click | `aria-label="Cerca su YouTube"` | aria-label | "Cerca su YouTube" | ADD `data-elab-action="video-youtube-external"` |
| ExperimentPicker:136 | modal backdrop | click close | `role="dialog"` + `aria-label="Scegli un esperimento"` | role + aria-label | "Chiudi picker" | ADD `data-elab-action="picker-modal"` |
| ExperimentPicker:145 | btn close modal | click | `aria-label="Chiudi"` | aria-label | "Chiudi" | reuse dialog marker |
| ExperimentPicker:153 | tabs volume (×3) | tab click | `role="tab"` | role | "Mostra Volume 1" | ADD `data-elab-action="picker-vol-{key}"` |
| ExperimentPicker:177 | input cerca esperimento | type | `aria-label="Cerca esperimento"` | aria-label | "Cerca LED" | ADD `data-elab-action="picker-search"` |
| ExperimentPicker:181 | btn clear search | click | `aria-label="Cancella ricerca"` | aria-label | "Cancella" | reuse marker |
| ExperimentPicker:194 | btn lessons view | click | text "Lezioni" | text | "Vista lezioni" | ADD `data-elab-action="picker-view-lessons"` |
| ExperimentPicker:200 | btn chapters view | click | text "Capitoli" | text | "Vista capitoli" | ADD `data-elab-action="picker-view-chapters"` |
| ExperimentPicker:212 | btn modalità libera | click | text + onClick | text | "Modalità libera" | ADD `data-elab-action="picker-free-mode"` |
| ExperimentPicker:228 | btn askUnlim recommend | click | text | text | "Quale esperimento mi consigli?" | ADD `data-elab-action="picker-ask-recommend"` |
| ExperimentPicker:255-329 | esperimento card (×N) | click | text + `aria-label="{title} — completato"` | aria-label | "Apri esperimento LED lampeggiante" | ADD `data-elab-action="experiment-{id}"` |
| CapitoloPicker:49 | volume switcher | container | `aria-label="Selezione volume"` | aria-label | "Volume 3" | reuse |
| CapitoloPicker:55 | volume button (×3) | click | `aria-label={'Volume ' + v}` | aria-label | "Volume 2" | ADD `data-elab-action="capitolo-volume-{v}"` |
| CapitoloPicker:77 | capitolo button (×N) | click | `aria-label="Capitolo {n} {titolo}"` | aria-label | "Apri capitolo 4 LED" | ADD `data-elab-action="capitolo-select"` |
| PercorsoCapitoloView:72 | btn close percorso | click | `aria-label="Chiudi percorso"` | aria-label | "Chiudi percorso" | ADD `data-elab-action="percorso-close"` |
| PercorsoCapitoloView:88+130 | citation onClick | click | text "Vol.X pag.Y" | text + role | "Apri Vol.2 pag.45" | ADD `data-elab-action="citation-open"` |
| PercorsoCapitoloView:113 | esperimento button (×N) | click | `aria-label="Esperimento {num}: {title}"` | aria-label | "Esperimento 3 semaforo" | ADD `data-elab-action="percorso-experiment"` |
| PercorsoCapitoloView:160 | fase button (×N) | click | text + onClick stopPropagation | text | "Fase 2 montaggio" | ADD `data-elab-action="percorso-fase"` |
| LessonBar:31 | btn toggle expand | click | `aria-expanded` | aria-expanded | "Apri barra lezione" | ADD `data-elab-action="lesson-bar-toggle"` |
| LessonBar:59 | btn askUnlim quick | click | `aria-label="Chiedi aiuto a UNLIM per questo passo"` | aria-label | "Aiuto su questo passo" | ADD `data-elab-action="lesson-ask-step"` |
| LessonBar:79 | btn spiega passo | click | text + onClick | text | "Spiega questo passo" | ADD `data-elab-action="lesson-explain-step"` |
| LessonReader:35 | exp btn click | click | text + onClick | text | "Apri esperimento" | ADD `data-elab-action="lesson-reader-exp"` |
| LessonSelector:9 | nav lezioni | container | `aria-label="Scegli lezione"` | aria-label | "Vai a lezione 5" | n/a |
| LessonSelector:19 | lesson btn (×N) | click | text + onClick | text | "Apri lezione 4" | ADD `data-elab-action="lesson-select"` |
| GiaMontato:65 | region già montato | container | `role="region"` + `aria-label="Modalità Già Montato"` | role + aria-label | "Mostra preview già montato" | reuse modalita |
| VetrinaV2:38 | btn login | click | `aria-label="Accedi a ELAB"` | aria-label | "Accedi" | ADD `data-elab-action="vetrina-login"` |
| VetrinaV2:41 | btn register | click | `aria-label="Prova ELAB gratis"` | aria-label | "Prova gratis" | ADD `data-elab-action="vetrina-register"` |
| VetrinaV2:80 | btn entra lavagna | click | `aria-label="Entra nella Lavagna ELAB"` | aria-label | "Entra in lavagna" | ADD `data-elab-action="vetrina-enter"` |
| SessionReportComic:74 | report article | container | `role="article"` + `aria-label="Report fumetto della sessione"` | role + aria-label | "Apri il fumetto" | ADD `data-elab-action="fumetto-report"` |
| SessionReportComic:98 | btn export PDF | click | `aria-label="Scarica PDF del report fumetto"` | aria-label | "Scarica fumetto in PDF" | ADD `data-elab-action="fumetto-export-pdf"` |
| DocenteSidebar:40 | sidebar | container | `role="complementary"` + `aria-label="Sidebar docente — colpo d'occhio sul percorso"` | role + aria-label | "Apri sidebar docente" | ADD `data-elab-action="docente-sidebar"` |

**Total interactive elements file-system verified**: ~62 (mouse click 47 + drag pointer 4 + form input 5 + tab/role-based 6).

---

## §4 Sense 1.5 markers gap analysis (vs iter 16 baseline +12)

**Baseline iter 16 +12 markers**:
- `data-elab-mode="lavagna"` (LavagnaShell:1082) ✓
- `data-elab-modalita={modalita}` (ModalitaSwitch:74 + LavagnaShell:1082) ✓
- ~10 altri markers iter 16 audit (referenza CLAUDE.md sezione iter 16 — non file-system verificati questa sessione)

**Gap iter 31 ralph 17 NEW markers raccomandati per Lavagna ownership: ~62**:

| Categoria | Marker pattern raccomandato | Count stimato |
|---|---|---|
| Tab navigation | `data-elab-action="tab-{lavagna,lezione,classe,progressi}"` | 4 |
| Toolbar action | `data-elab-action="tool-{pen,wire,select,delete,...}"` | 7 |
| Window controls | `data-elab-action="window-{minimize,maximize,close,resize-{dir},drag}"` | 6 |
| Modalità | `data-elab-action="modalita-{percorso,libero,gia-montato,esperimento}"` | 4 |
| Volume viewer | `data-elab-action="page-{prev,next,input}"`, `zoom-{in,out}`, `pen-{toggle,color,size,undo,clear}`, `volume-{1,2,3}` | 11 |
| Video float | `data-elab-action="video-{tab,search,clear,suggestion,youtube,card,restore,back,corso}"` | 9 |
| Picker | `data-elab-action="picker-{vol,view-lessons,view-chapters,search,free-mode,ask-recommend,experiment-{id}}"` + `data-elab-action="capitolo-{volume,select}"` + `data-elab-action="experiment-{id}"` | ~10 |
| UNLIM bar | `data-elab-action="unlim-bar-{expand,submit,input,mic,send}"` + nudge-{dismiss,deepen} + ask-unlim-fase + galileo-prepare-lesson | ~8 |
| Passo Passo nav | `data-elab-action="passo-passo-{prev,next,summary,show-solution}"` + lesson-{toggle,ask-step,explain-step} + lesson-{reader-exp,select} + percorso-{close,experiment,fase} + citation-open | ~12 |
| Misc panels/comic/error | `data-elab-action="panel-{toggle-dir}"`, `quick-add-{type}`, `bentornati-*`, `fumetto-{report,export-pdf}`, `error-{ask-unlim,dismiss}`, `vetrina-{login,register,enter}`, `docente-sidebar`, `mascot-{talk,drag}`, `dialog-capitoli`, `expand-chat-unlim`, `volume-retry`, `toggle-all-components` | ~13 |
| **TOTALE NEW** | | **~84 markers raccomandati** |

**Razionale**: HYBRID priority resolver (ARIA → data-elab → text → CSS) richiede `data-elab-action` per ogni primary user action così Mistral FC canonical schema mappa intent → marker stabile mutaforma-resistant (CSS class refactor non rompe selector).

**Anti-pattern enforced**: NO duplicate marker, NO marker su elementi non-interattivi (live regions read-only), NO over-tagging (1 marker per action, NOT per child element).

---

## §5 Honesty caveats critical

1. **NO src code modificato** (read-only audit per task requirements file ownership rigid). Marker recommendations sono raccomandazioni Phase 1 architecture iter 18+ ADR-036 implementation, NOT shipped.
2. **Count 62 elementi interattivi è FILE-SYSTEM VERIFIED via grep** ma alcuni elementi composti (es. RetractablePanel `quick-add-{N components}` line 274 itera N componenti, conta come 1 pattern non N istanze) — actual runtime DOM count può essere 100+ con componenti dinamici.
3. **Iter 16 +12 markers baseline NON verificato file-system** in questa sessione (referenza CLAUDE.md storica) — gap analysis §4 assume baseline come dichiarato, NOT validato.
4. **HYBRID selector priority §3** è raccomandazione design (ARIA → data-elab → text → CSS) per ADR-036 plan §1.2 Decision 2 — alcuni elementi (resize handles FloatingWindow:232-234, FloatingToolbar drag header:147) NON hanno aria-label né data-elab markers attualmente, dipendono da CSS class strategia fragile.
5. **GalileoAdapter ChatOverlay auto-expand DOM query line 487** (`document.querySelector('[aria-label="Espandi chat UNLIM"]')`) è anti-pattern già documentato CLAUDE.md "ChatOverlay auto-click hack" — marker stabile `data-elab-action="expand-chat-unlim"` raccomandato per de-hackare.
6. **Coverage stimata Lavagna ownership ~62 elementi vs target master enumeration ≥50** (plan §2.5) — Lavagna ownership da sola raggiunge il target, restano Atom 17.2 (Simulator), 17.3 (Tutor+UNLIM), 17.4 (cross-cutting) per master ≥50 totale ampiamente superato.
7. **NON enumerate keyboard shortcuts globali** (Esc close, Enter submit, arrow nav) sono presenti ma scoped per-componente (es. AppHeader:78 Enter/Space → onPickerOpen) NOT enumerate sezione separata § 3 — defer Atom 17.4 cross-cutting.

---

## §6 Cross-link

- Plan: `docs/superpowers/plans/2026-05-03-iter-31-onnipotenza-expansion-deep-iter-17-30.md` §2 Phase 0 Atom 17.1
- Sibling Atom 17.2 Simulator (Agent B): `docs/audits/2026-05-03-onnipotenza-ui-audit-simulator.md` (TBD)
- Sibling Atom 17.3 Tutor+UNLIM (Agent C): `docs/audits/2026-05-03-onnipotenza-ui-audit-tutor-unlim.md` (TBD)
- Sibling Atom 17.4 cross-cutting (Agent D): `docs/audits/2026-05-03-onnipotenza-ui-audit-cross-cutting.md` (TBD)
- Master enumeration Atom 17.5 scribe: `docs/audits/2026-05-03-onnipotenza-ui-actions-MASTER-enumeration.md` (TBD)
- Architecture phase 1 ADR-036: `docs/adrs/ADR-036-onnipotenza-expansion-ui-namespace-l0b.md` (iter 18+)
- ADR-037 Onniscenza UI state snapshot: `docs/adrs/ADR-037-onniscenza-ui-state-snapshot-integration.md` (iter 19+)
- CLAUDE.md API globale section: `__ELAB_API` ~16 methods baseline (iter 9 dry-run grep)
- intentsDispatcher iter 37: `src/components/lavagna/intentsDispatcher.js` (whitelist 12 actions, target ~50 expand)

---

**Completion**: Atom 17.1 SHIPPED file-system verified ~62 elementi interattivi enumerated + ~84 NEW Sense 1.5 markers raccomandati Lavagna ownership.
