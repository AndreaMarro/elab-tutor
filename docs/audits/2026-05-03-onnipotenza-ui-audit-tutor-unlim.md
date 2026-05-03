# Onnipotenza UI Audit — Tutor + UNLIM + common + chatbot + easter + teacher + student + admin + dashboard (iter 31 ralph 18 Phase 0 Atom 17.3)

**Date**: 2026-05-03
**Agent**: Agent C (Tutor + UNLIM + common + chatbot + easter + teacher + student + admin + dashboard ownership)
**Plan ref**: `docs/superpowers/plans/2026-05-03-iter-31-onnipotenza-expansion-deep-iter-17-30.md` §2 Phase 0 Atom 17.3
**Sibling refs**: `docs/audits/2026-05-03-onnipotenza-ui-audit-lavagna.md` (Atom 17.1, ~62 elements) + `docs/audits/2026-05-03-onnipotenza-ui-audit-simulator.md` (Atom 17.2)
**File ownership**: read-only `src/components/{tutor,unlim,common,chatbot,easter,teacher,student,admin,dashboard}/` (35 .jsx + 16 .module.css)

---

## §1 Methodology

1. `wc -l` enumeration jsx files per directory → 35 jsx ~14512 LOC totale
2. `grep -nE "onClick|onChange|onInput|onSubmit|onKeyDown|onPointerDown|aria-label|data-elab|role=|data-testid"` per-component scan
3. Per-element line citation file:line + role + selector strategy + recommended HYBRID priority + natural language example + Sense 1.5 marker recommendation
4. Cross-check `data-elab-*` markers iter 16+36 baseline (es. `data-elab-mode="teacher-dashboard"` TeacherDashboard:620, `data-elab-mode={CHATBOT_MODE_MARKER}` ChatbotOnly:436, `data-elab-easter` EasterModal:190)
5. NO src code modifications (read-only audit)
6. Matrix format consistency con sibling Atom 17.1 Lavagna

---

## §2 Components audited (35 jsx)

| Group | Component | LOC | Primary role |
|---|---|---|---|
| tutor | ElabTutorV4 | 2759 | Shell tutor V4 orchestratrice principale (tab + modali + UNLIM mount) |
| tutor | ChatOverlay | 621 | Chat UNLIM overlay (input + voice + screenshot + suggestion + minimize) |
| tutor | CanvasTab | 449 | Canvas disegno (brush/text/eraser/undo/redo/colori/upload/slides) |
| tutor | ReverseEngineeringLab | 400 | Gioco reverse engineering circuito |
| tutor | PredictObserveExplain | 361 | Gioco POE 3-step |
| tutor | CircuitReview | 342 | Gioco code review circuito |
| tutor | CircuitDetective | 338 | Gioco detective fault-finding |
| tutor | TutorLayout | 329 | Layout welcome modal + fullscreen |
| tutor | TutorSidebar | 284 | Sidebar nav tab + giochi expand + collapse |
| tutor | ManualTab | 258 | Manuale PDF + carica file + zoom + page nav |
| tutor | TutorTopBar | 149 | Topbar volume + chat toggle + fullscreen + export |
| tutor | VolumeChooser | 148 | Modal scelta volume vol1/vol2/vol3 |
| tutor | VideosTab | 147 | Video YouTube + Google Meet |
| tutor | ContextualHints | 144 | Toast nudge contestuale |
| tutor | KeyboardManager | 126 | Overlay shortcuts keybindings |
| tutor | NotebooksTab | 84 | Taccuini docente note |
| tutor | VisionButton | 59 | Trigger vision UNLIM (capture+ask) |
| tutor | PresentationModal | 51 | Modal slide presentation |
| unlim | UnlimWrapper | 814 | Wrapper UNLIM mode (mascotte + nudge + offline banner + chat) |
| unlim | UnlimReport | 631 | Report fumetto sessione (export PDF) |
| unlim | UnlimOverlay | 360 | Overlay messaggi/nudge contestuale |
| unlim | UnlimInputBar | 227 | Bar input UNLIM (text + mic + tts + send + report + overflow menu) |
| unlim | UnlimMascot | 133 | Mascotte trascinabile (click + long-press tts toggle) |
| unlim | UnlimModeSwitch | 60 | Toggle UNLIM ↔ Classic |
| common | PrivacyPolicy | 1509 | Privacy policy GDPR (1500+ LOC) |
| common | ElabIcons | 370 | SVG icons library (no interactive markup) |
| common | ConsentBanner | 350 | Banner GDPR consenso minori + parental |
| common | UpdatePrompt | 322 | PWA SW update toast |
| common | MicPermissionNudge | 317 | Nudge permesso microfono (CTA + dismiss) |
| common | FloatingWindow | 226 | Wrapper drag/close (riusato Lavagna) |
| common | ConfirmModal | 177 | Modal conferma generico (cancel/confirm) |
| common | ErrorBoundary | 144 | Boundary errori React (no interactive) |
| common | Toast | 80 | Toast generico aria-live |
| common | VolumeCitation | 50 | Badge citazione Vol/pag clickable |
| chatbot | ChatbotOnly | 499 | Chatbot-only route (sidebar Cronologia 4 buckets + 5 tools palette + chat) |
| easter | EasterModal | 264 | Modal easter "Chi siamo" (4 GIF + 5-click banana mode) |
| teacher | TeacherDashboard | 3484 | Dashboard docente (5 tab + sub-tab + tabelle + grafici + nudge + export CSV/JSON + class management + giochi) |
| student | StudentDashboard | 1053 | Dashboard studente (mood + diario + meraviglia + class join + nudge ricevuti) |
| admin | AdminPage | 564 | AdminPage CRUD (Crea/Modifica/Esporta/Aggiorna licenze + tab admin) |
| dashboard | DashboardShell | 119 | Shell dashboard (loading + error retry) |

---

## §3 Interactive elements matrix (~95 elements file:line verified)

| Component:Line | Element | Action type | Current selector | HYBRID priority | Natural language example | Sense 1.5 marker |
|---|---|---|---|---|---|---|
| **TUTOR** | | | | | | |
| TutorTopBar:44 | btn toggle sidebar | click | `aria-label="Apri/chiudi menu"` | aria-label | "Apri il menu laterale" | ADD `data-elab-action="topbar-sidebar-toggle"` |
| TutorTopBar:80 | btn change volume | click | text "Cambia volume" inferred | text + role | "Cambia volume" | ADD `data-elab-action="topbar-change-volume"` |
| TutorTopBar:106 | btn export session | click | `aria-label="Esporta sessione"` | aria-label | "Esporta la sessione" | ADD `data-elab-action="topbar-export-session"` |
| TutorTopBar:117 | btn toggle chat UNLIM | click | `aria-label={showChat?'Nascondi':'Mostra'} Chat UNLIM` | aria-label | "Mostra chat UNLIM" / "Nascondi chat UNLIM" | ADD `data-elab-action="topbar-toggle-chat"` |
| TutorTopBar:129 | btn toggle fullscreen | click | `aria-label={isFullscreen?'Esci fullscreen':'Fullscreen'}` | aria-label | "Vai a tutto schermo" / "Esci da fullscreen" | ADD `data-elab-action="topbar-fullscreen"` |
| TutorSidebar:117 | nav navigation | container | `role="navigation"` + `aria-label="Navigazione principale"` | role + aria-label | "Apri navigazione" | n/a |
| TutorSidebar:128 | btn giochi expand | click | `aria-label="Giochi didattici"` | aria-label | "Apri giochi didattici" | ADD `data-elab-action="sidebar-games-toggle"` |
| TutorSidebar:161/193 | btn tab nav (×N) | click | `aria-label={item.label}` | aria-label | "Vai alla scheda Manuale" | ADD `data-elab-action="sidebar-tab-{id}"` |
| TutorSidebar:211 | btn collapse sidebar | click | `aria-label={collapsed?'Espandi':'Comprimi'} barra laterale` | aria-label | "Comprimi barra laterale" | ADD `data-elab-action="sidebar-collapse"` |
| TutorSidebar:266 | tablist mobile bottom | container | `role="tablist"` + `aria-label="Navigazione rapida"` | role + aria-label | "Vai alle schede mobile" | n/a |
| TutorSidebar:273 | tab btn (×N) | click | `role="tab"` + `aria-label={tab.label}` | role + aria-label | "Vai a {tab}" | ADD `data-elab-action="sidebar-tab-mobile-{id}"` |
| TutorLayout:53 | welcome dialog | modal | `role="dialog"` + `aria-modal="true"` + `aria-label="Benvenuto..."` | role + aria-label | "Apri benvenuto" / "Chiudi benvenuto" | ADD `data-elab-action="welcome-modal"` |
| TutorLayout:66 | btn salta intro | click | `aria-label="Salta introduzione"` | aria-label | "Salta introduzione" | ADD `data-elab-action="welcome-skip"` |
| TutorLayout:89 | btn welcome card (×N) | click | text+icon | text + role | "Inizia con il manuale" | ADD `data-elab-action="welcome-action-{key}"` |
| TutorLayout:259 | btn fullscreen exit | click | text "Esci fullscreen" | text | "Esci da fullscreen" | ADD `data-elab-action="fullscreen-exit"` |
| VolumeChooser:75 | dialog | modal | `role="dialog"` + `aria-modal="true"` + `aria-label="Scegli il volume"` | role + aria-label | "Apri scelta volume" | ADD `data-elab-action="volume-chooser-modal"` |
| VolumeChooser:103 | btn last volume | click | text "Continua con Volume X" | text | "Continua con il volume" | ADD `data-elab-action="volume-continue-last"` |
| VolumeChooser:110 | btn change mode | click | text "Cambia volume" | text | "Cambia volume" | ADD `data-elab-action="volume-change-mode"` |
| VolumeChooser:131 | btn volume card (×3) | click | text+image | text + image | "Apri Volume 2" | ADD `data-elab-action="volume-card-{key}"` |
| ManualTab:65 | toggle group view mode | container | `role="group"` + `aria-label="Modalità visualizzazione"` | role + aria-label | "Modalità manuale" / "Modalità documento" | ADD `data-elab-action="manual-view-mode"` |
| ManualTab:66-67 | btn Manuali/Documenti | click | text + `aria-pressed` | text + aria-pressed | "Mostra manuali" | ADD `data-elab-action="manual-mode-{manual\|document}"` |
| ManualTab:70-71 | input file upload | type=file (hidden) + btn | `aria-label="Carica file"` | aria-label + type=file | "Carica un documento" | ADD `data-elab-action="manual-upload"` |
| ManualTab:72 | btn spiega pagina | click | `aria-label="Invia questa pagina a UNLIM..."` | aria-label | "Spiega questa pagina" | ADD `data-elab-action="manual-explain-page"` |
| ManualTab:76 | btn fullscreen | click | `aria-label={isFullscreen?'Esci...':'Fullscreen'}` + `aria-pressed` | aria-label | "Fullscreen manuale" | ADD `data-elab-action="manual-fullscreen"` |
| ManualTab:88 | btn volume select (×3) | click | text + state | text | "Apri Volume 1" | ADD `data-elab-action="manual-volume-{v}"` |
| ManualTab:118+121 | btn page prev/next | click | `aria-label="Pagina precedente/successiva"` | aria-label | "Pagina precedente" | ADD `data-elab-action="manual-page-{prev\|next}"` |
| ManualTab:119 | input page number | type number | `aria-label="Numero pagina"` | aria-label + type=number | "Vai a pagina 42" | ADD `data-elab-action="manual-page-input"` |
| ManualTab:166 | doc card click (×N) | click | text title + onClick | text | "Apri documento {nome}" | ADD `data-elab-action="manual-doc-card"` |
| ManualTab:175 | btn rimuovi doc | click | `aria-label="Rimuovi documento"` | aria-label | "Rimuovi documento" | ADD `data-elab-action="manual-doc-remove"` ⚠ destructive |
| ManualTab:243 | select fit mode | change | `aria-label="Modalità visualizzazione"` | aria-label + role=combobox | "Adatta alla larghezza" | ADD `data-elab-action="manual-fit-mode"` |
| ManualTab:251+253 | btn zoom -/+ | click | `aria-label="Riduci/Aumenta zoom"` | aria-label | "Riduci zoom" | ADD `data-elab-action="manual-zoom-{out\|in}"` |
| VideosTab:33-34 | toggle Video/Videochiamata | click | text + state | text | "Vai a videochiamata" | ADD `data-elab-action="videos-mode-{video\|meet}"` |
| VideosTab:48 | btn carica YouTube | click | text "Carica" | text | "Carica video YouTube" | ADD `data-elab-action="videos-upload-yt"` |
| VideosTab:67 | btn ask UNLIM video | click | text + onClick | text | "Chiedi a UNLIM su questo video" | ADD `data-elab-action="videos-ask-unlim"` |
| VideosTab:92 | btn select video (×N) | click | text title | text | "Apri video {titolo}" | ADD `data-elab-action="videos-select"` |
| VideosTab:114+125+132+135 | btn meet start/stop/join/copy | click | text only | text | "Avvia videochiamata" / "Termina" / "Entra" / "Copia link" | ADD `data-elab-action="meet-{start\|stop\|join\|copy}"` |
| NotebooksTab:28 | btn back | click | text "← Indietro" | text | "Torna ai taccuini" | ADD `data-elab-action="notebook-back"` |
| NotebooksTab:33 | btn ask UNLIM riassumi | click | text+onSendToUNLIM | text | "Riassumi questo taccuino" | ADD `data-elab-action="notebook-ask-summary"` |
| NotebooksTab:42 | page thumb (×N) | click + Enter/Space | `role="button"` + tabIndex | role + index | "Vai a pagina {n}" | ADD `data-elab-action="notebook-page-{i}"` |
| NotebooksTab:47 | btn add page | click | text "+" | text | "Aggiungi pagina" | ADD `data-elab-action="notebook-add-page"` |
| NotebooksTab:56+73 | btn crea/apri notebook | click | text "Crea" / "Apri" | text | "Crea taccuino" / "Apri taccuino" | ADD `data-elab-action="notebook-{create\|open}"` |
| NotebooksTab:74 | btn elimina notebook | click | text "Elimina" + class del | text | "Elimina taccuino" | ADD `data-elab-action="notebook-delete"` ⚠ destructive |
| CanvasTab:338-385 | btn tool (brush/text/eraser/undo/redo/upload/slides/clear) | click | `title="..."` (manca aria-label) | title + text | "Strumento pennello" | ADD `data-elab-action="canvas-tool-{brush\|text\|eraser\|undo\|redo\|upload\|slides\|clear}"` |
| CanvasTab:363 | btn color (×N) | click | onClick + style | inferred + onClick | "Colore rosso" | ADD `data-elab-action="canvas-color-{c}"` |
| CanvasTab:391 | btn ask UNLIM canvas | click | onClick | text | "Chiedi a UNLIM sul disegno" | ADD `data-elab-action="canvas-ask-unlim"` |
| CanvasTab:412-413 | btn text confirm/cancel | click | text "✓" / "✗" | text | "Conferma testo" / "Annulla testo" | ADD `data-elab-action="canvas-text-{confirm\|cancel}"` |
| CanvasTab:436 | btn presenta | click | text "Presenta" | text | "Avvia presentazione" | ADD `data-elab-action="canvas-present"` |
| CanvasTab:442+444 | btn page prev/next | click | text ←/→ | text | "Pagina precedente disegno" | ADD `data-elab-action="canvas-page-{prev\|next}"` |
| VisionButton:48 | btn vision | click | `aria-label="Guarda il mio circuito..."` | aria-label | "Guarda il mio circuito" | ADD `data-elab-action="vision-trigger"` |
| ContextualHints:126 | btn dismiss hint | click | `aria-label="Chiudi suggerimento"` | aria-label | "Chiudi suggerimento" | ADD `data-elab-action="hint-dismiss"` |
| KeyboardManager:100 | shortcuts overlay | click outside close | onClick={onClose} | role | "Chiudi shortcuts" | ADD `data-elab-action="shortcuts-overlay"` |
| KeyboardManager:104 | btn close shortcuts | click | `aria-label="Chiudi"` | aria-label | "Chiudi shortcut" | ADD `data-elab-action="shortcuts-close"` |
| PresentationModal:21 | btn exit presentation | click | text "✕ Esci" | text | "Esci dalla presentazione" | ADD `data-elab-action="presentation-exit"` |
| PresentationModal:41+47 | btn slide prev/next | click | text "Precedente" / "Successiva" | text | "Slide successiva" | ADD `data-elab-action="presentation-{prev\|next}"` |
| PresentationModal:44 | btn slide dot (×N) | click | onClick + class active | inferred + index | "Vai a slide {n}" | ADD `data-elab-action="presentation-dot-{i}"` |
| ChatOverlay:38 | suggestion chip | click | text + onClick | text | "Suggerimento: {testo}" | ADD `data-elab-action="chat-suggestion"` |
| ChatOverlay:201 | minimized header expand | click + Enter/Space | `aria-label="Espandi chat UNLIM"` + `role="button"` | aria-label | "Espandi chat UNLIM" | ADD `data-elab-action="chat-expand"` |
| ChatOverlay:241 | panel dialog | container | `role="dialog"` + `aria-modal={isFullscreen}` + `aria-label="Chat UNLIM"` | role + aria-label | "Apri pannello chat" | n/a |
| ChatOverlay:266 | btn fullscreen toggle | click | `title` + onClick | title | "Chat fullscreen" / "Esci fullscreen chat" | ADD `data-elab-action="chat-fullscreen"` |
| ChatOverlay:283 | btn minimizza | click | title="Riduci a barra" | title | "Minimizza chat" | ADD `data-elab-action="chat-minimize"` |
| ChatOverlay:289 | btn expand width | click | title={expanded?'Comprimi':'Espandi'} | title | "Espandi larghezza chat" | ADD `data-elab-action="chat-expand-width"` |
| ChatOverlay:303 | btn close chat | click | title="Chiudi chat (Esc)" | title | "Chiudi chat" | ADD `data-elab-action="chat-close"` |
| ChatOverlay:345 | btn nuovi messaggi | click | `aria-label="Vai ai nuovi messaggi"` | aria-label | "Vai ai nuovi messaggi" | ADD `data-elab-action="chat-jump-new"` |
| ChatOverlay:368 | btn quick actions expand | click | onClick + state | inferred | "Mostra altre azioni" | ADD `data-elab-action="chat-actions-expand"` |
| ChatOverlay:392 | input messaggio | type | `aria-label="Scrivi messaggio a UNLIM"` | aria-label | "Scrivi 'come funziona il LED'" | ADD `data-elab-action="chat-input"` |
| ChatOverlay:402 | btn screenshot | click | `aria-label="Cattura screenshot e chiedi a UNLIM"` | aria-label | "Cattura screenshot" | ADD `data-elab-action="chat-screenshot"` |
| ChatOverlay:419 | btn voice toggle | click | `aria-label={voiceEnabled?'Disattiva':'Attiva'} modalità vocale` | aria-label | "Attiva voce" | ADD `data-elab-action="chat-voice-toggle"` |
| ChatOverlay:450 | btn voice record | click | `aria-label={voiceRecording?'Ferma':'Parla'} con UNLIM` | aria-label | "Parla con UNLIM" | ADD `data-elab-action="chat-voice-record"` |
| ChatOverlay:482 | btn invio | click | `aria-label="Invia messaggio"` | aria-label | "Invia" | ADD `data-elab-action="chat-send"` |
| ChatOverlay:609 | btn retry message | click | text "Riprova" | text | "Riprova invio" | ADD `data-elab-action="chat-retry"` |
| **UNLIM** | | | | | | |
| UnlimInputBar:104 | form submit | submit (Enter) | `<form onSubmit>` | form role | "Invia messaggio" | ADD `data-elab-action="unlim-bar-form"` |
| UnlimInputBar:109 | btn microfono | click | `aria-label={isListening?'Ferma':'Parla con UNLIM'}` | aria-label | "Attiva microfono" | ADD `data-elab-action="unlim-bar-mic"` |
| UnlimInputBar:122 | btn mute TTS | click | `aria-label={isMuted?'Attiva':'Disattiva'} lettura risposte` | aria-label | "Attiva lettura risposte" | ADD `data-elab-action="unlim-bar-tts-toggle"` |
| UnlimInputBar:137 | input testo | type + Enter | `aria-label="Messaggio per UNLIM"` | aria-label | "Scrivi 'come funziona il transistor'" | ADD `data-elab-action="unlim-bar-input"` |
| UnlimInputBar:150 | btn report fumetto | click | `aria-label="Crea report della sessione"` | aria-label | "Crea il report fumetto" | ADD `data-elab-action="unlim-bar-report"` |
| UnlimInputBar:165 | btn overflow menu | click | `aria-label="Altre opzioni"` | aria-label | "Mostra altre opzioni" | ADD `data-elab-action="unlim-bar-menu"` |
| UnlimInputBar:174 | menu role | container | `role="menu"` | role | (container) | n/a |
| UnlimInputBar:178/188/198 | menuitem (mic/tts/report) | click | `role="menuitem"` + onClick | role + text | "Crea report" via menu | ADD `data-elab-action="unlim-menu-{mic\|tts\|report}"` |
| UnlimInputBar:214 | btn invio | click | `aria-label="Invia messaggio"` | aria-label | "Invia" | ADD `data-elab-action="unlim-bar-send"` |
| UnlimMascot:109 | mascotte container | click + long-press + drag | `aria-label="UNLIM — clicca per parlare..."` + `onPointerDown` | aria-label + onPointerDown | "Parla con UNLIM" / "Tieni premuto per disattivare voce" | ADD `data-elab-action="mascot-{click\|longpress}"` |
| UnlimModeSwitch:49 | btn toggle UNLIM/Classic | click | `aria-label={isUnlim?'Passa a Classic':'Passa a UNLIM'}` | aria-label | "Passa alla modalità UNLIM" | ADD `data-elab-action="unlim-mode-toggle"` |
| UnlimOverlay:283 | overlay status | live region click | `role="status"` + onClick | role | "Apri overlay messaggio" | ADD `data-elab-action="unlim-overlay"` |
| UnlimOverlay:318 | btn dismiss overlay | click | `aria-label="Chiudi messaggio"` | aria-label | "Chiudi messaggio UNLIM" | ADD `data-elab-action="unlim-overlay-dismiss"` |
| UnlimOverlay:347 | mascot container UNLIM | container | `aria-label="Messaggi UNLIM"` | aria-label | "Apri messaggi UNLIM" | ADD `data-elab-action="unlim-overlay-container"` |
| UnlimWrapper:721 | offline banner | live region | `role="alert"` | role | (read-only) | n/a |
| UnlimWrapper:726 | btn dismiss offline | click | `aria-label="Chiudi avviso connessione"` | aria-label | "Chiudi avviso offline" | ADD `data-elab-action="unlim-offline-dismiss"` |
| UnlimWrapper:738 | nudge backdrop | click close | `role="presentation"` + onClick | role | "Chiudi nudge" | ADD `data-elab-action="unlim-nudge-backdrop"` |
| UnlimWrapper:745 | nudge dialog | container | `role="dialog"` + `aria-labelledby="nudge-title"` | role + aria-labelledby | "Apri nudge insegnante" | ADD `data-elab-action="unlim-nudge-dialog"` |
| UnlimWrapper:761 | btn close nudge | click | `aria-label="Chiudi messaggio insegnante"` | aria-label | "Chiudi nudge" | ADD `data-elab-action="unlim-nudge-close"` |
| UnlimWrapper:776 | mascot click handler | click | onClick={handleMascotClick} | inferred | "Parla con UNLIM dal wrapper" | ADD `data-elab-action="unlim-wrapper-mascot"` |
| UnlimReport (composite ~631 LOC) | btn export PDF + close + share + retry | click | mix text + aria-label inferred | aria-label preferred | "Scarica fumetto in PDF" / "Chiudi report" | ADD `data-elab-action="report-{export\|close\|share\|retry}"` |
| **COMMON** | | | | | | |
| ConfirmModal:119 | dialog overlay | click outside cancel | `role="dialog"` + `aria-modal="true"` + `aria-label={title}` | role + aria-label | "Chiudi modal conferma" | ADD `data-elab-action="confirm-modal"` |
| ConfirmModal:124 | btn cancel | click | text {cancelLabel} | text | "Annulla" | ADD `data-elab-action="confirm-cancel"` |
| ConfirmModal:125 | btn confirm | click | text {confirmLabel} | text | "Conferma" | ADD `data-elab-action="confirm-action"` ⚠ contextual destructive |
| ConsentBanner:205 | dialog | container | `role="dialog"` + `aria-label="Consenso privacy"` + `aria-modal="true"` | role + aria-label | "Apri consenso privacy" | ADD `data-elab-action="consent-dialog"` |
| ConsentBanner:221 | input age | change | onChange e.target.value | inferred + role | "Inserisci età 12" | ADD `data-elab-action="consent-age-input"` |
| ConsentBanner:234 | btn age confirm | click | text + onClick | text | "Conferma età" | ADD `data-elab-action="consent-age-confirm"` |
| ConsentBanner:275 | btn accept all | click | text "Accetta" | text | "Accetto tutto" | ADD `data-elab-action="consent-accept"` |
| ConsentBanner:278 | btn reject all | click | text "Rifiuta" | text | "Rifiuta tutto" | ADD `data-elab-action="consent-reject"` |
| ConsentBanner:307 | input parent email | change | onChange | inferred + type=email | "Email genitore..." | ADD `data-elab-action="consent-parent-email"` |
| ConsentBanner:318 | btn parental request | click | text + onClick | text | "Richiedi consenso genitore" | ADD `data-elab-action="consent-parental-request"` |
| MicPermissionNudge:281 | region nudge | container | `role="region"` + `aria-label="Autorizza il microfono per UNLIM"` | role + aria-label | "Mostra nudge microfono" | ADD `data-elab-action="mic-nudge"` |
| MicPermissionNudge:296 | btn CTA autorizza | click | `aria-label={ctaLabel} microfono per UNLIM` | aria-label | "Autorizza microfono" | ADD `data-elab-action="mic-nudge-cta"` |
| MicPermissionNudge:306 | btn dismiss nudge | click | `aria-label="Chiudi banner microfono..."` | aria-label | "Chiudi nudge microfono" | ADD `data-elab-action="mic-nudge-dismiss"` |
| FloatingWindow:184 | dialog wrap | container | `role="dialog"` + `aria-label={title}` | role + aria-label | "Apri finestra {title}" | ADD `data-elab-window={titleKebab}` (re-use Lavagna marker) |
| FloatingWindow:193 | drag header | drag | `aria-label="Trascina ${title}"` | aria-label | "Sposta finestra" | ADD `data-elab-action="window-drag"` (re-use Lavagna marker) |
| FloatingWindow:199 | btn close window | click | `aria-label="Chiudi ${title}"` | aria-label | "Chiudi finestra" | ADD `data-elab-action="window-close"` (re-use Lavagna marker) |
| FloatingWindow:221 | resize handle | drag | `role="presentation"` (no aria) | css class | "Allarga finestra" | ADD `data-elab-action="window-resize"` |
| Toast:51 | toast container | live region | `role="status"` + `aria-live="polite"` | role | (read-only screen reader) | n/a |
| UpdatePrompt:280 | toast PWA | container | `role="status"` + `aria-label="Aggiornamento ELAB Tutor disponibile"` | role + aria-label | "Mostra aggiornamento" | ADD `data-elab-action="update-prompt"` |
| UpdatePrompt:301 | btn ricarica | click | `aria-label="Ricarica adesso ELAB Tutor con la nuova versione"` | aria-label | "Ricarica per aggiornare" | ADD `data-elab-action="update-reload"` |
| UpdatePrompt:311 | btn dismiss update | click | `aria-label="Rimanda aggiornamento ELAB Tutor"` | aria-label | "Rimanda aggiornamento" | ADD `data-elab-action="update-dismiss"` |
| VolumeCitation:35 | badge link Vol/pag | click | `aria-label={ariaLabel}` (es. "Vol.2 pag.45") | aria-label | "Apri Vol.2 pag.45" | ADD `data-elab-action="volume-citation"` |
| **CHATBOT** | | | | | | |
| ChatbotOnly:141 | session item Cronologia | click | `aria-label={'Sessione: ' + title}` | aria-label | "Apri sessione {titolo}" | ADD `data-elab-action="cronologia-session"` |
| ChatbotOnly:174 | btn back home | click | `aria-label="Torna alla home ELAB"` | aria-label | "Torna alla home" | ADD `data-elab-action="chatbot-back-home"` |
| ChatbotOnly:185 | btn nuova chat | click | `aria-label="Iniziate una nuova chat con UNLIM"` | aria-label | "Inizia nuova chat" | ADD `data-elab-action="chatbot-new-chat"` |
| ChatbotOnly:193 | nav Cronologia | container | `aria-label="Cronologia chat"` | aria-label | "Apri cronologia" | n/a |
| ChatbotOnly:201-204 | bucket sezione (oggi/ieri/settimana/piuVecchie) | container (×4) | text "Oggi" / "Ieri" / "Settimana" / "Più vecchie" | text | "Vai alle sessioni di Oggi" | ADD `data-elab-bucket={key}` |
| ChatbotOnly:266 | tools palette | container | `data-testid="chatbot-tools-palette"` + `aria-label="Strumenti UNLIM"` | data-testid + aria-label | "Apri strumenti UNLIM" | data-testid EXISTS |
| ChatbotOnly:267-275 | btn tool (×5: 📷 vision + ⚙️ compile + 📔 fumetto + 🎨 lavagna + 🔄 reset) | click | `aria-label={tip}` (es. "Vision", "Compile", "Fumetto", "Lavagna", "Reset") | aria-label | "Apri strumento Vision" | ADD `data-elab-action="chatbot-tool-{id}"` |
| ChatbotOnly:436 | shell root | container | `data-testid="chatbot-only-shell"` + `data-elab-mode={CHATBOT_MODE_MARKER}` | data-elab-mode | "Apri chatbot" | EXISTS iter 37 |
| ChatbotOnly:445 | main conversation | container | `aria-label="Conversazione UNLIM"` | aria-label | (container) | n/a |
| ChatbotOnly:467 | input chat | type + Enter | `aria-label="Scrivete il vostro messaggio per UNLIM"` | aria-label | "Scrivi 'come funziona il sensore'" | ADD `data-elab-action="chatbot-input"` |
| ChatbotOnly:478 | btn invia | click | `aria-label="Invia messaggio a UNLIM"` | aria-label | "Invia" | ADD `data-elab-action="chatbot-send"` |
| **EASTER** | | | | | | |
| EasterModal:188 | overlay backdrop | click close | onClick={handleOverlayClick} + `data-elab-easter={...}` | data-elab-easter | "Chiudi modal Chi siamo" | EXISTS iter 37 |
| EasterModal:195 | dialog | container | `role="dialog"` + `aria-labelledby="easter-modal-title"` + `aria-label="Chi siamo — il team ELAB"` | role + aria-label | "Apri Chi siamo" | ADD `data-elab-action="easter-dialog"` |
| EasterModal:209 | btn close | click | `aria-label="Chiudi finestra Chi siamo"` | aria-label | "Chiudi Chi siamo" | ADD `data-elab-action="easter-close"` |
| EasterModal:221 | scimpanze GIF | click (5-click banana mode) | `aria-label={imgError ? ... : ...}` + counter localStorage | aria-label + counter | "Clicca scimpanze" / "Attiva modalità banana" | ADD `data-elab-action="easter-scimpanze-click"` |
| **TEACHER** | | | | | | |
| TeacherDashboard:620 | container root | container | `data-elab-mode="teacher-dashboard"` | data-elab-mode | "Apri dashboard docente" | EXISTS iter 36+ |
| TeacherDashboard:712 | tabBar | container | `role="tablist"` + `aria-label="Sezioni dashboard docente"` | role + aria-label | "Apri sezioni dashboard" | n/a |
| TeacherDashboard:716 | tab btn (×N: classe/report/impostazioni/giochi/audit) | click | `role="tab"` + onClick | role + text | "Vai alla scheda Classe" | ADD `data-elab-action="teacher-tab-{id}"` |
| TeacherDashboard:751+807+843 | sub-tab btn (×N) | click | text + state | text + state | "Vai a {sub-tab}" | ADD `data-elab-action="teacher-subtab-{id}"` |
| TeacherDashboard:879+895 | btn pagina prec/succ | click | `aria-label="Pagina precedente/successiva"` | aria-label | "Pagina precedente" | ADD `data-elab-action="teacher-page-{prev\|next}"` |
| TeacherDashboard:939 | input search filter | type | onChange | inferred + role=searchbox | "Cerca studente Mario" | ADD `data-elab-action="teacher-search"` |
| TeacherDashboard:945 | select volume filter | change | onChange | inferred + role=combobox | "Filtra Volume 2" | ADD `data-elab-action="teacher-filter-volume"` |
| TeacherDashboard:971 | btn select student | click | onClick + text | text | "Apri studente {nome}" | ADD `data-elab-action="teacher-select-student"` |
| TeacherDashboard:1130 | select volume filter alt | change | onChange | inferred | "Filtra Volume 1" | ADD `data-elab-action="teacher-filter-volume-2"` |
| TeacherDashboard:1139 | btn export students CSV | click | text + onClick | text | "Esporta studenti in CSV" | ADD `data-elab-action="teacher-export-students-csv"` |
| TeacherDashboard:1259 | select student | change | onChange | inferred | "Seleziona studente Mario" | ADD `data-elab-action="teacher-select-student-dropdown"` |
| TeacherDashboard:1458 | select student nudge | change | `aria-label="Seleziona studente per messaggio"` | aria-label | "Seleziona studente per nudge" | ADD `data-elab-action="teacher-nudge-select"` |
| TeacherDashboard:1470 | textarea nudge | type | `aria-label="Messaggio per lo studente"` | aria-label | "Scrivi nudge: 'Bravo Mario'" | ADD `data-elab-action="teacher-nudge-text"` |
| TeacherDashboard:1478 | btn invia nudge | click | text "Invia" | text | "Invia nudge" | ADD `data-elab-action="teacher-nudge-send"` |
| TeacherDashboard:1526 | btn nudge idea suggestion | click | text idea | text | "Usa suggerimento" | ADD `data-elab-action="teacher-nudge-idea"` |
| TeacherDashboard:1682 | input new class name | type | onChange | inferred | "Nome classe '3A'" | ADD `data-elab-action="teacher-class-name"` |
| TeacherDashboard:1688 | btn crea classe | click | text "Crea" | text | "Crea classe" | ADD `data-elab-action="teacher-class-create"` ⚠ destructive-candidate |
| TeacherDashboard:1817 | btn class action | click | onClick (context dipendente) | inferred | "Apri classe" | ADD `data-elab-action="teacher-class-action"` |
| TeacherDashboard:1868 | btn toggle game | click | text + onClick | text | "Attiva gioco Detective" | ADD `data-elab-action="teacher-game-toggle"` |
| TeacherDashboard:1897 | btn expand details | click | text + state | text | "Mostra dettagli" | ADD `data-elab-action="teacher-expand-details"` |
| TeacherDashboard:2083+2089+2095 | btn export JSON/CSV/print | click | text "Esporta JSON" / "CSV" / "Stampa" | text | "Esporta in JSON" | ADD `data-elab-action="teacher-export-{json\|csv\|print}"` |
| TeacherDashboard:2197+2207 | filter volume + matrix toggle | change/click | aria-label + text | aria-label + text | "Filtra per volume 3" / "Mostra matrice" | ADD `data-elab-action="teacher-{filter\|matrix-toggle}"` |
| TeacherDashboard:2238+2454 | matrix cell | click | `title={...}` + `aria-label={...}` | aria-label | "Apri esperimento {titolo}" | ADD `data-elab-action="teacher-matrix-cell"` |
| TeacherDashboard:2937+2947 | btn export report CSV/print | click | text + onClick | text | "Esporta report CSV" | ADD `data-elab-action="teacher-report-{export-csv\|print}"` |
| TeacherDashboard:2987+3019+3048 | chart container (×3 trend/top/mood) | container | `role="img"` + `aria-label={...}` | role + aria-label | "Mostra grafico trend" | ADD `data-elab-action="teacher-chart-{trend\|top\|mood}"` (drill-down click TBD) |
| TeacherDashboard:3229+3235 | input userId + btn fetch audit | change/click | onChange + onClick | inferred | "Cerca audit utente {id}" | ADD `data-elab-action="teacher-audit-{user-input\|fetch}"` |
| **STUDENT** | | | | | | |
| StudentDashboard:173 | btn navigate tutor | click | onClick onNavigate('tutor') | inferred + text | "Torna al tutor" | ADD `data-elab-action="student-back-tutor"` |
| StudentDashboard:185 | tab btn (×N) | click | onClick + text | text | "Vai alla scheda {tab}" | ADD `data-elab-action="student-tab-{id}"` |
| StudentDashboard:235 | nudge backdrop | click close | `role="presentation"` + onClick | role | "Chiudi nudge insegnante" | ADD `data-elab-action="student-nudge-backdrop"` |
| StudentDashboard:242 | nudge dialog | container | `role="dialog"` + `aria-labelledby="nudge-title-dash"` | role + aria-labelledby | "Apri nudge insegnante" | n/a |
| StudentDashboard:264 | btn close nudge | click | `aria-label="Chiudi messaggio insegnante"` | aria-label | "Chiudi nudge" | ADD `data-elab-action="student-nudge-close"` |
| StudentDashboard:434 | btn mood (×N) | click | onClick + emoji | inferred + text | "Imposta mood felice" | ADD `data-elab-action="student-mood-{m}"` |
| StudentDashboard:451+462 | input/textarea mood/diario | change | onChange | inferred | "Scrivi mood..." / "Scrivi diario..." | ADD `data-elab-action="student-{mood-input\|diario-input}"` |
| StudentDashboard:468 | btn salva diario | click | text + onClick | text | "Salva diario" | ADD `data-elab-action="student-diario-save"` |
| StudentDashboard:546+552 | input/btn meraviglia | change/click | onChange + text | inferred + text | "Scrivi meraviglia: 'Stupore!'" | ADD `data-elab-action="student-meraviglia-{input\|save}"` |
| StudentDashboard:857 | input class code | type uppercase 6char | onChange | inferred + maxlength | "Inserisci codice classe ELAB22" | ADD `data-elab-action="student-class-code"` |
| StudentDashboard:873 | btn join classe | click | text + onClick | text | "Entra in classe" | ADD `data-elab-action="student-class-join"` |
| **ADMIN (CRUD destructive WHITELIST EXCLUSION per ADR-036 §1.2 Decision 3)** | | | | | | |
| AdminPage:128 | form admin login | submit | `<form onSubmit={handleAdminLogin}>` | form role | "Accedi admin" | ⚠ destructive-candidate AVOID auto-dispatch (login flow) |
| AdminPage:132 | input password admin | type=password | onChange | inferred + type=password | (NEVER dispatchable per security boundary §1.2 Decision 3 PII protection) | n/a |
| AdminPage:140 | btn back to tutor | click | text + onClick | text | "Torna al tutor" | ADD `data-elab-action="admin-back-tutor"` (safe) |
| AdminPage:226 | input license code | type | onChange | inferred | "Inserisci codice licenza X1Y2..." | ⚠ destructive-candidate (license validation) |
| AdminPage:231 | btn check license | click | text + disabled | text | "Verifica licenza" | ⚠ destructive-candidate (license check side-effect) |
| AdminPage:293 | btn clear license history | click | onClick + localStorage.removeItem | inferred | "Cancella cronologia licenze" | ⚠ DESTRUCTIVE (localStorage clear, conferma user explicit required) |
| AdminPage:365+433 | tab btn (×N admin tab) | click | onClick + text | text | "Vai a tab {id}" | ADD `data-elab-action="admin-tab-{id}"` (safe nav) |
| AdminPage CRUD literal labels | btn Crea/Modifica/Esporta/Aggiorna (presenti dentro AdminDashboard / sub-component non grep'ed) | click | text Italian admin convention | text | (NOT enumerate naturally — security boundary) | ⚠ DESTRUCTIVE WHITELIST EXCLUSION (per CLAUDE.md iter 38 carryover A14 round 2 SKIP rationale: "admin CRUD button labels follow standard Italian admin UI convention single-user admin tool, NOT PRINCIPIO ZERO §1 violations") |
| **DASHBOARD** | | | | | | |
| DashboardShell:48 | region root | container | `role="region"` + `aria-label="Dashboard Docente"` + `aria-live="polite"` + `aria-busy` | role + aria-label | "Apri dashboard" | ADD `data-elab-mode="dashboard-shell"` |
| DashboardShell:70 | alert error | live region | `role="alert"` | role | (read-only) | n/a |
| DashboardShell:78 | btn refetch | click | onClick={refetch} + text | text | "Riprova caricamento" | ADD `data-elab-action="dashboard-retry"` |

**Total interactive elements file-system verified**: ~95 (mouse click ~70 + drag pointer 2 + form input ~15 + tab/role-based ~8). Esclusi: live regions read-only + container nav senza azione propria + AdminPage CRUD destructive (whitelist exclusion §5).

---

## §4 Sense 1.5 markers gap analysis (vs iter 16+36+37 baseline)

**Baseline iter 16+36+37 markers presenti in questo set**:
- `data-elab-mode="teacher-dashboard"` (TeacherDashboard:620) ✓ iter 36
- `data-elab-mode={CHATBOT_MODE_MARKER}` (ChatbotOnly:436) ✓ iter 37
- `data-elab-easter={state}` (EasterModal:190) ✓ iter 37
- `data-testid="chatbot-tools-palette"` (ChatbotOnly:266) ✓ iter 37
- `data-testid="chatbot-only-shell"` (ChatbotOnly:436) ✓ iter 37

**Gap iter 31 ralph 18 NEW markers raccomandati per Tutor+UNLIM ownership: ~95 elementi → ~95 NEW markers raccomandati**:

| Categoria | Marker pattern raccomandato | Count stimato |
|---|---|---|
| Tutor topbar/sidebar/layout | `data-elab-action="topbar-{...}"`, `sidebar-{...}`, `welcome-{...}`, `fullscreen-exit` | ~13 |
| Volume + manual + videos + notebooks tab | `data-elab-action="volume-{...}"`, `manual-{...}`, `videos-{...}`, `meet-{...}`, `notebook-{...}` | ~22 |
| Canvas tab tools | `data-elab-action="canvas-{tool\|color\|ask-unlim\|page-prev\|page-next\|present\|text-confirm\|text-cancel}"` | ~12 |
| Vision + hints + shortcuts + presentation | `data-elab-action="vision-trigger"`, `hint-dismiss`, `shortcuts-{overlay\|close}`, `presentation-{exit\|prev\|next\|dot}` | ~7 |
| Tutor ChatOverlay UNLIM | `data-elab-action="chat-{suggestion\|expand\|fullscreen\|minimize\|expand-width\|close\|jump-new\|actions-expand\|input\|screenshot\|voice-toggle\|voice-record\|send\|retry}"` | ~14 |
| UNLIM input bar + mascot + overlay + wrapper | `data-elab-action="unlim-bar-{...}"`, `mascot-{click\|longpress}`, `unlim-overlay-{...}`, `unlim-mode-toggle`, `unlim-{offline\|nudge}-...`, `report-{...}` | ~18 |
| Common (modal + consent + mic + window + update + citation) | `data-elab-action="confirm-{cancel\|action}"`, `consent-{age\|accept\|reject\|parental}`, `mic-nudge-{cta\|dismiss}`, `window-{drag\|close\|resize}`, `update-{reload\|dismiss}`, `volume-citation` | ~12 |
| Chatbot | `data-elab-bucket={key}`, `data-elab-action="chatbot-tool-{id}"`, `chatbot-{back-home\|new-chat\|input\|send}`, `cronologia-session` | ~10 |
| Easter | `data-elab-action="easter-{dialog\|close\|scimpanze-click}"` | 3 |
| Teacher dashboard tabs + nudge + export + class + chart | `data-elab-action="teacher-{tab\|subtab\|search\|filter\|select-student\|export-students-csv\|nudge\|class\|game\|matrix-cell\|chart\|audit}"` | ~22 |
| Student dashboard | `data-elab-action="student-{tab\|nudge\|mood\|diario\|meraviglia\|class-code\|class-join\|back-tutor}"` | ~10 |
| Admin (safe nav only) | `data-elab-action="admin-{back-tutor\|tab}"` (CRUD destructive EXCLUDED) | 3 |
| Dashboard shell | `data-elab-mode="dashboard-shell"`, `dashboard-retry` | 2 |
| **TOTALE NEW raccomandati** | | **~148 markers** |

**Razionale**: HYBRID priority resolver (ARIA → data-elab → text → CSS) per Tutor+UNLIM richiede `data-elab-action` per ogni primary user action. Markers già presenti (`data-elab-mode`, `data-elab-easter`, `data-testid`) vanno preservati come baseline. Anti-pattern: NO duplicate marker tra Lavagna+Tutor (es. `window-close` riusato da `FloatingWindow.jsx` common è OK, è lo stesso componente).

**Nota Tutor V4 ElabTutorV4.jsx 2759 LOC**: solo 4 grep match `aria-label/role`/`data-elab` perché utilizza pattern legacy CSS class + button text senza ARIA strutturato. Iter 31+ refactor raccomandato per ElabTutorV4 markup ARIA + data-elab-action sweep (ownership specifica iter futuro, NOT in scope Phase 0 Atom 17.3).

---

## §5 Honesty caveats critical (admin CRUD destructive flag awareness)

1. **NO src code modificato** (read-only audit per task requirements file ownership rigid). Marker recommendations sono raccomandazioni Phase 1 architecture iter 18+ ADR-036 implementation, NOT shipped.

2. **Count ~95 elementi interattivi è FILE-SYSTEM VERIFIED via grep** ma alcuni elementi composti (es. TeacherDashboard:1817 `btn class action` itera N classi runtime, conta come 1 pattern non N istanze; CanvasTab:363 `btn color` ×~7 colors palette conta come 1 pattern; tab buttons TutorSidebar/TeacherDashboard iterano N tab) — actual runtime DOM count può essere 200+ con elementi dinamici.

3. **AdminPage CRUD operations FLAGGED destructive-candidate (whitelist exclusion per ADR-036 §1.2 Decision 3 security boundary)**:
   - **Login form** (AdminPage:128) → password input MAI dispatchable per PII protection mandate
   - **License check + clear history** (AdminPage:231+293) → side-effect destructive (`localStorage.removeItem`), require explicit user voice confirm "sì conferma" per ADR-036 §1.2 Decision 4 stop conditions
   - **CRUD literal labels Crea/Modifica/Esporta/Aggiorna/Elimina** in sub-component AdminDashboard (NOT grep'ed iter 31 ralph 18 — out of scope file ownership per CLAUDE.md iter 38 carryover A14 round 2 SKIP rationale: standard Italian admin UI convention single-user admin tool, NOT PRINCIPIO ZERO §1 violations)
   - **Whitelist EXCLUDED**: deleteAll, submitForm with pwd field, fetchExternalUrl, license CRUD ops, class delete, student delete, audit log clear, settings reset
   - **Whitelist INCLUDED safe nav**: `admin-back-tutor`, `admin-tab-{id}` (only navigation between admin tabs, no side-effect)

4. **ManualTab:175 doc-remove + NotebooksTab:74 notebook-delete + TeacherDashboard:1688 class-create + StudentDashboard:1259 select-student dropdown** sono destructive-candidate (rimuovono dati utente o creano risorse persistenti) — require ADR-036 §1.2 Decision 4 confirmation (voice "sì conferma").

5. **HYBRID selector priority §3** è raccomandazione design (ARIA → data-elab → text → CSS) per ADR-036 plan §1.2 Decision 2 — molti elementi tutor/* (CanvasTab tools 338-385, ChatOverlay HeaderButton 509, NotebooksTab page-thumb 42) usano `title=` o testo only senza aria-label né data-elab markers attualmente, dipendono da CSS class strategia fragile.

6. **PrivacyPolicy.jsx 1509 LOC NON enumerato §3** — è documento legale GDPR statico (no interactive elements significativi oltre potenziali link interni section nav). Out of scope dispatcher Onnipotenza.

7. **ErrorBoundary.jsx 144 LOC NO interactive markup** — React boundary class component, NOT user-interactive.

8. **ElabIcons.jsx 370 LOC è SVG icons library** — NO interactive markup (rendering only). Out of scope dispatcher.

9. **Coverage stimata Tutor+UNLIM+ownership ~95 elementi vs target master enumeration ≥50** (plan §2.5) — ownership da sola raggiunge il target abbondantemente. Cumulative con Atom 17.1 Lavagna (~62) + Atom 17.2 Simulator (TBD) → master ≥50 superato ampiamente. Realistic master enumeration ~250+ elementi totali.

10. **NON enumerate keyboard shortcuts globali** (Esc close, Enter submit, Ctrl+Z undo CanvasTab, Ctrl+Y redo, Tab focus trap ConfirmModal/ConsentBanner/FloatingWindow) — defer Atom 17.4 cross-cutting.

11. **TeacherDashboard chart drill-down** (lines 2987/3019/3048) hanno `role="img"` + descriptive aria-label MA click drill-down NOT verified in scan — recharts containers richiedono custom `onClick={(data, index) => ...}` callback, iter 18+ adapter ADR-036 §1.2 Decision 2 chart-cell selector pattern.

---

## §6 Cross-link

- Plan: `docs/superpowers/plans/2026-05-03-iter-31-onnipotenza-expansion-deep-iter-17-30.md` §2 Phase 0 Atom 17.3
- Sibling Atom 17.1 Lavagna (Agent A): `docs/audits/2026-05-03-onnipotenza-ui-audit-lavagna.md` (~62 elements + ~84 markers raccomandati)
- Sibling Atom 17.2 Simulator (Agent B): `docs/audits/2026-05-03-onnipotenza-ui-audit-simulator.md`
- Sibling Atom 17.4 cross-cutting (Agent D): `docs/audits/2026-05-03-onnipotenza-ui-audit-cross-cutting.md` (TBD)
- Master enumeration Atom 17.5 scribe: `docs/audits/2026-05-03-onnipotenza-ui-actions-MASTER-enumeration.md` (TBD)
- Architecture phase 1 ADR-036: `docs/adrs/ADR-036-onnipotenza-expansion-ui-namespace-l0b.md` (iter 18+)
- ADR-037 Onniscenza UI state snapshot: `docs/adrs/ADR-037-onniscenza-ui-state-snapshot-integration.md` (iter 19+)
- Security boundary: ADR-036 §1.2 Decision 3 (PII + destructive whitelist) + Decision 4 (stop conditions confirmation)
- CLAUDE.md iter 38 carryover A14 round 2 SKIP rationale per AdminPage CRUD esclusione
- intentsDispatcher iter 37: `src/components/lavagna/intentsDispatcher.js` (whitelist 12 actions, target ~50 expand)

---

**Completion**: Atom 17.3 SHIPPED file-system verified ~95 elementi interattivi enumerated + ~148 NEW Sense 1.5 markers raccomandati Tutor+UNLIM+common+chatbot+easter+teacher+student+admin+dashboard ownership + AdminPage CRUD destructive flagged whitelist exclusion per ADR-036 §1.2 Decision 3.
