#!/usr/bin/env python3
"""
Galileo Brain v6 — "Onnipotenza" Dataset Generator
====================================================
Genera dataset JSONL per fine-tuning Qwen3-4B come router di messaggi
per ELAB Tutor, un simulatore educativo di elettronica per ragazzi 10-14 anni.

5 layer di generazione:
  1. REPLAY    — riformulazioni fedeli dal dataset v3/20k esistente
  2. ACTION    — tutte le 42 azioni dirette con varianti
  3. CONTEXT   — esempi context-aware (tab, esperimento, stato simulazione)
  4. ADVERSARIAL — negazioni, off-topic, ambiguita', edge case
  5. EVAL      — set di valutazione bilanciato

Uso:
    python3 scripts/generate-brain-v6.py --layer all                  # genera tutto
    python3 scripts/generate-brain-v6.py --layer action --count 5000  # solo azioni
    python3 scripts/generate-brain-v6.py --stats                      # mostra statistiche
    python3 scripts/generate-brain-v6.py --validate                   # valida formato
    python3 scripts/generate-brain-v6.py --eval                       # genera eval set

Output: datasets/galileo-brain-v6.jsonl (o --output PATH)
"""

import json
import random
import argparse
import os
import sys
import re
import hashlib
from pathlib import Path
from datetime import datetime
from collections import Counter

# ============================================================
# SYSTEM PROMPT V6 — Completo con tutti i 7 intent, 42 azioni,
# 21 componenti, 10 tab, pin map, wing pins, context fields
# ============================================================

SYSTEM_PROMPT_V6 = """Sei il Galileo Brain, il cervello di routing dell'assistente AI ELAB Tutor.
Ricevi il messaggio dello studente + contesto del simulatore.
Rispondi SOLO in JSON valido con questa struttura esatta:
{
  "intent": "action|circuit|code|tutor|vision|navigation|teacher",
  "entities": ["componente1", "pin1"],
  "actions": ["[AZIONE:tag1]", "[AZIONE:tag2]"],
  "needs_llm": true/false,
  "response": "risposta breve se needs_llm=false, null altrimenti",
  "llm_hint": "contesto per il modello grande se needs_llm=true, null altrimenti"
}

REGOLE:
1. "intent" classifica il tipo di richiesta:
   - "action": comandi simulazione (play/pause/reset/clearall/compile/undo/redo/quiz)
   - "circuit": piazzamento componenti, cablaggio, diagnosi circuiti
   - "code": scrittura/modifica codice Arduino, Scratch, editor
   - "tutor": domande teoriche, spiegazioni, concetti di elettronica
   - "vision": analisi visiva dello screenshot (parole chiave: guarda, vedi, foto, screenshot, immagine)
   - "navigation": caricamento esperimenti, cambio tab/volume, navigazione step
   - "teacher": richieste pedagogiche avanzate (quiz, notebook, youtube, valutazione)
2. "entities": lista di componenti, pin, esperimenti menzionati (ID tecnici, non alias)
3. "actions": array di action tag nel formato esatto [AZIONE:...] o [INTENT:{...}]
   AZIONI DISPONIBILI (42 totali):
   --- Simulation Control (6) ---
   [AZIONE:play] [AZIONE:pause] [AZIONE:reset] [AZIONE:clearall] [AZIONE:undo] [AZIONE:redo]
   --- Compilation & Code (7) ---
   [AZIONE:compile] [AZIONE:openeditor] [AZIONE:closeeditor]
   [AZIONE:switcheditor:scratch] [AZIONE:switcheditor:arduino]
   [AZIONE:resetcode] [AZIONE:getcode]
   --- Navigation (5) ---
   [AZIONE:loadexp:ID] [AZIONE:opentab:NOME] [AZIONE:openvolume:N]
   [AZIONE:nextstep] [AZIONE:prevstep]
   --- Component Manipulation (6) ---
   [INTENT:place_and_wire] [AZIONE:removecomponent:ID]
   [AZIONE:movecomponent:ID:DIR] [AZIONE:setvalue:ID:PARAM:VAL]
   [AZIONE:highlight:ID] [AZIONE:highlightpin:COMP:PIN]
   --- Wiring (2) ---
   [AZIONE:addwire:FROM:TO] [AZIONE:removewire:DESC]
   --- Interaction & Diagnosis (4) ---
   [AZIONE:interact:ID:ACTION:VAL] [AZIONE:measure:ID]
   [AZIONE:diagnose] [AZIONE:getstate]
   --- UI Panels (5) ---
   [AZIONE:showbom] [AZIONE:showserial] [AZIONE:showshortcuts]
   [AZIONE:fullscreenscratch] [AZIONE:exitscratchfullscreen]
   --- Educational (3) ---
   [AZIONE:quiz] [AZIONE:youtube:QUERY] [AZIONE:createnotebook:TITOLO]
   --- Serial & Code (3) ---
   [AZIONE:serialwrite:TEXT] [AZIONE:setcode:CODE] [AZIONE:appendcode:CODE]
   --- Build Mode (1) ---
   [AZIONE:setbuildmode:MODE]  (MODE = passopasso|completo|sandbox|guided)
4. "needs_llm": false se la risposta e' deterministica (azioni dirette), true se serve ragionamento LLM
5. "response": risposta breve per l'utente se needs_llm=false. null se needs_llm=true
6. "llm_hint": contesto/istruzioni per il modello grande se needs_llm=true. null se needs_llm=false

FILOSOFIA: needs_llm=false per OGNI azione deterministica. Il Brain deve risolvere
il piu' possibile senza chiamare il modello grande. needs_llm=true SOLO quando serve
ragionamento, spiegazioni, analisi, creativita'.

COMPONENTI VALIDI (21): led, resistor, push-button, buzzer-piezo, capacitor, potentiometer,
photo-resistor, diode, mosfet-n, rgb-led, motor-dc, servo, reed-switch, phototransistor,
battery9v, multimeter, lcd16x2, nano-r4-board, breadboard-half, breadboard-full, wire

PIN MAP:
LED: anode, cathode | Resistor: pin1, pin2 | PushButton: pin1, pin2
BuzzerPiezo: positive, negative | Potentiometer: vcc, signal, gnd
Capacitor: positive, negative | RGB-LED: red, common, green, blue
Diode: anode, cathode | Mosfet-N: gate, drain, source
PhotoResistor: pin1, pin2 | Phototransistor: collector, emitter
MotorDC: positive, negative | Servo: signal, vcc, gnd | ReedSwitch: pin1, pin2
LCD16x2: VSS, VDD, V0, RS, RW, E, D4, D5, D6, D7, A, K
Battery9V: positive, negative

TAB VALIDI (10): simulator, manual, video, canvas, editor, taccuini, detective, poe, reverse, review
WING PINS: W_A0, W_A1, W_A2, W_A3, W_D3, W_D5, W_D6, W_D9, W_D10, W_D11, W_D12, W_D13,
W_A4/SDA, W_A5/SCL, W_D0/RX, W_D1/TX

CONTESTO: Il messaggio utente arriva con campi contesto:
tab, esperimento, componenti, fili, volume_attivo, simulazione (running/paused/stopped),
build_mode (passopasso/completo/sandbox/guided), step_corrente, editor_mode (arduino/scratch),
codice_presente (true/false)"""


# ============================================================
# ACTIONS — Tutte le 42 azioni come dati strutturati
# ============================================================

ACTIONS = {
    # --- Simulation Control (6) ---
    "play": {
        "tag": "[AZIONE:play]",
        "intent": "action",
        "category": "simulation",
        "responses": [
            "Simulazione avviata! ▶", "Play! ▶", "Si parte!", "Via!",
            "Avvio!", "Simulazione in corso.", "Eccoci, si parte! ▶",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "pause": {
        "tag": "[AZIONE:pause]",
        "intent": "action",
        "category": "simulation",
        "responses": [
            "Simulazione in pausa. ⏸", "Fermato. ⏸", "Pausa! ⏸",
            "In pausa.", "Stop! ⏸", "Simulazione fermata.",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "reset": {
        "tag": "[AZIONE:reset]",
        "intent": "action",
        "category": "simulation",
        "responses": [
            "Circuito resettato.", "Reset!", "Tutto dall'inizio.",
            "Ripristinato.", "Torno allo stato iniziale.",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "clearall": {
        "tag": "[AZIONE:clearall]",
        "intent": "action",
        "category": "simulation",
        "responses": [
            "Breadboard svuotata!", "Tutto rimosso.", "Pulito!",
            "Sgomberato!", "Via tutto, breadboard vuota!",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "undo": {
        "tag": "[AZIONE:undo]",
        "intent": "action",
        "category": "simulation",
        "responses": [
            "Annullato!", "Undo!", "Torno indietro.",
            "Fatto, ho annullato.", "Ultima azione annullata.",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "redo": {
        "tag": "[AZIONE:redo]",
        "intent": "action",
        "category": "simulation",
        "responses": [
            "Ripetuto!", "Redo!", "Rifatto.",
            "Ripristinato.", "Azione ripetuta.",
        ],
        "entities": [],
        "needs_llm": False,
    },

    # --- Compilation & Code (7) ---
    "compile": {
        "tag": "[AZIONE:compile]",
        "intent": "action",
        "category": "code",
        "responses": [
            "Compilazione avviata.", "Compilo...", "Build!",
            "Verifico il codice.", "Compilazione in corso...",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "openeditor": {
        "tag": "[AZIONE:openeditor]",
        "intent": "action",
        "category": "code",
        "responses": [
            "Editor aperto!", "Ecco l'editor.", "Apro l'editor codice.",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "closeeditor": {
        "tag": "[AZIONE:closeeditor]",
        "intent": "action",
        "category": "code",
        "responses": [
            "Editor chiuso.", "Chiudo l'editor.", "Editor nascosto.",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "switcheditor_scratch": {
        "tag": "[AZIONE:switcheditor:scratch]",
        "intent": "action",
        "category": "code",
        "responses": [
            "Passa a Scratch! 🧩", "Modalita' blocchi attiva!",
            "Ecco Scratch!", "Editor Scratch aperto!",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "switcheditor_arduino": {
        "tag": "[AZIONE:switcheditor:arduino]",
        "intent": "action",
        "category": "code",
        "responses": [
            "Passa ad Arduino C++!", "Modalita' codice attiva!",
            "Ecco l'editor Arduino!", "Editor testuale aperto!",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "resetcode": {
        "tag": "[AZIONE:resetcode]",
        "intent": "action",
        "category": "code",
        "responses": [
            "Codice resettato!", "Codice originale ripristinato.",
            "Rimesso il codice di default.",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "getcode": {
        "tag": "[AZIONE:getcode]",
        "intent": "action",
        "category": "code",
        "responses": [
            "Ecco il codice attuale.", "Recupero il codice...",
            "Codice corrente recuperato.",
        ],
        "entities": [],
        "needs_llm": False,
    },

    # --- Navigation (5) ---
    "loadexp": {
        "tag": "[AZIONE:loadexp:{id}]",
        "intent": "navigation",
        "category": "navigation",
        "responses": [
            "Carico l'esperimento!", "Ecco l'esperimento!",
            "Esperimento caricato!", "Apro l'esperimento!",
        ],
        "entities": ["{id}"],
        "needs_llm": False,
        "parametric": True,
        "param_name": "id",
    },
    "opentab": {
        "tag": "[AZIONE:opentab:{name}]",
        "intent": "navigation",
        "category": "navigation",
        "responses": [
            "Apro la scheda!", "Ecco!", "Tab aperto!",
        ],
        "entities": ["{name}"],
        "needs_llm": False,
        "parametric": True,
        "param_name": "name",
    },
    "openvolume": {
        "tag": "[AZIONE:openvolume:{n}]",
        "intent": "navigation",
        "category": "navigation",
        "responses": [
            "Apro il Volume {n}!", "Volume {n} caricato!",
            "Ecco il Volume {n}!",
        ],
        "entities": [],
        "needs_llm": False,
        "parametric": True,
        "param_name": "n",
    },
    "nextstep": {
        "tag": "[AZIONE:nextstep]",
        "intent": "navigation",
        "category": "navigation",
        "responses": [
            "Prossimo passo!", "Avanti!", "Step successivo.",
            "Ecco il prossimo passo.", "Avanzamento!",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "prevstep": {
        "tag": "[AZIONE:prevstep]",
        "intent": "navigation",
        "category": "navigation",
        "responses": [
            "Passo precedente.", "Indietro!", "Torno allo step prima.",
            "Step precedente.", "Ecco lo step di prima.",
        ],
        "entities": [],
        "needs_llm": False,
    },

    # --- Component Manipulation (6) ---
    "place_and_wire": {
        "tag": "[INTENT:place_and_wire]",
        "intent": "circuit",
        "category": "component",
        "responses": [
            "Componente piazzato! ✅", "Ecco, piazzato sulla breadboard!",
            "Aggiunto al circuito! ✅", "Posizionato!",
        ],
        "entities": ["{components}"],
        "needs_llm": False,
        "parametric": True,
        "param_name": "components",
    },
    "removecomponent": {
        "tag": "[AZIONE:removecomponent:{id}]",
        "intent": "circuit",
        "category": "component",
        "responses": [
            "Componente rimosso!", "Tolto!", "Eliminato dal circuito.",
            "Via!", "Rimosso! ✅",
        ],
        "entities": ["{id}"],
        "needs_llm": False,
        "parametric": True,
        "param_name": "id",
    },
    "movecomponent": {
        "tag": "[AZIONE:movecomponent:{id}:{dir}]",
        "intent": "circuit",
        "category": "component",
        "responses": [
            "Spostato!", "Componente spostato.", "Ecco, spostato!",
        ],
        "entities": ["{id}"],
        "needs_llm": False,
        "parametric": True,
        "param_name": "id",
    },
    "setvalue": {
        "tag": "[AZIONE:setvalue:{id}:{param}:{val}]",
        "intent": "circuit",
        "category": "component",
        "responses": [
            "Valore impostato!", "Modificato!", "Parametro aggiornato.",
        ],
        "entities": ["{id}"],
        "needs_llm": False,
        "parametric": True,
        "param_name": "id",
    },
    "highlight": {
        "tag": "[AZIONE:highlight:{id}]",
        "intent": "circuit",
        "category": "component",
        "responses": [
            "Evidenziato!", "Ecco, lo vedi?", "Componente evidenziato.",
        ],
        "entities": ["{id}"],
        "needs_llm": False,
        "parametric": True,
        "param_name": "id",
    },
    "highlightpin": {
        "tag": "[AZIONE:highlightpin:{comp}:{pin}]",
        "intent": "circuit",
        "category": "component",
        "responses": [
            "Pin evidenziato!", "Ecco il pin!", "Lo vedi il pin?",
        ],
        "entities": ["{comp}", "{pin}"],
        "needs_llm": False,
        "parametric": True,
        "param_name": "comp",
    },

    # --- Wiring (2) ---
    "addwire": {
        "tag": "[AZIONE:addwire:{from_pin}:{to_pin}]",
        "intent": "circuit",
        "category": "wiring",
        "responses": [
            "Filo collegato! ✅", "Collegamento fatto!",
            "Connesso!", "Ecco il filo! ✅",
        ],
        "entities": ["{from_pin}", "{to_pin}"],
        "needs_llm": False,
        "parametric": True,
        "param_name": "from_pin",
    },
    "removewire": {
        "tag": "[AZIONE:removewire:{desc}]",
        "intent": "circuit",
        "category": "wiring",
        "responses": [
            "Filo rimosso!", "Collegamento tolto.", "Scollegato!",
        ],
        "entities": ["{desc}"],
        "needs_llm": False,
        "parametric": True,
        "param_name": "desc",
    },

    # --- Interaction & Diagnosis (4) ---
    "interact": {
        "tag": "[AZIONE:interact:{id}:{action}:{val}]",
        "intent": "circuit",
        "category": "interaction",
        "responses": [
            "Interazione eseguita!", "Fatto!", "Ecco!",
        ],
        "entities": ["{id}"],
        "needs_llm": False,
        "parametric": True,
        "param_name": "id",
    },
    "measure": {
        "tag": "[AZIONE:measure:{id}]",
        "intent": "circuit",
        "category": "interaction",
        "responses": [
            "Misura in corso...", "Ecco la misura!", "Misurazione avviata.",
        ],
        "entities": ["{id}"],
        "needs_llm": False,
        "parametric": True,
        "param_name": "id",
    },
    "diagnose": {
        "tag": "[AZIONE:diagnose]",
        "intent": "circuit",
        "category": "interaction",
        "responses": [
            "Analizzo il circuito...", "Cerco il problema.",
            "Controllo...", "Diagnostica in corso.",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "getstate": {
        "tag": "[AZIONE:getstate]",
        "intent": "circuit",
        "category": "interaction",
        "responses": [
            "Stato del circuito recuperato.", "Ecco lo stato attuale.",
            "Analizzo lo stato...",
        ],
        "entities": [],
        "needs_llm": False,
    },

    # --- UI Panels (5) ---
    "showbom": {
        "tag": "[AZIONE:showbom]",
        "intent": "action",
        "category": "ui",
        "responses": [
            "Ecco la lista componenti!", "BOM aperto.",
            "Ecco cosa serve.", "Lista materiali!",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "showserial": {
        "tag": "[AZIONE:showserial]",
        "intent": "action",
        "category": "ui",
        "responses": [
            "Monitor seriale aperto!", "Ecco la seriale.",
            "Serial Monitor attivo.", "Apro il monitor seriale.",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "showshortcuts": {
        "tag": "[AZIONE:showshortcuts]",
        "intent": "action",
        "category": "ui",
        "responses": [
            "Ecco le scorciatoie!", "Shortcuts aperti.",
            "Lista tasti rapidi.", "Ecco i comandi da tastiera.",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "fullscreenscratch": {
        "tag": "[AZIONE:fullscreenscratch]",
        "intent": "action",
        "category": "ui",
        "responses": [
            "Scratch a schermo intero!", "Fullscreen Scratch attivo!",
            "Editor Scratch ingrandito!",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "exitscratchfullscreen": {
        "tag": "[AZIONE:exitscratchfullscreen]",
        "intent": "action",
        "category": "ui",
        "responses": [
            "Uscita da fullscreen.", "Scratch rimpicciolito.",
            "Torno alla vista normale.",
        ],
        "entities": [],
        "needs_llm": False,
    },

    # --- Educational (3) ---
    "quiz": {
        "tag": "[AZIONE:quiz]",
        "intent": "teacher",
        "category": "educational",
        "responses": [
            "Quiz in arrivo!", "Ecco il quiz!",
            "Vediamo cosa sai!", "Quiz time! 🧠",
        ],
        "entities": [],
        "needs_llm": False,
    },
    "youtube": {
        "tag": "[AZIONE:youtube:{query}]",
        "intent": "teacher",
        "category": "educational",
        "responses": [
            "Cerco un video!", "Ecco un video utile!",
            "Video trovato!", "Guarda questo video!",
        ],
        "entities": ["{query}"],
        "needs_llm": False,
        "parametric": True,
        "param_name": "query",
    },
    "createnotebook": {
        "tag": "[AZIONE:createnotebook:{titolo}]",
        "intent": "teacher",
        "category": "educational",
        "responses": [
            "Taccuino creato!", "Ecco il tuo taccuino!",
            "Notebook pronto!", "Apro il taccuino!",
        ],
        "entities": ["{titolo}"],
        "needs_llm": False,
        "parametric": True,
        "param_name": "titolo",
    },

    # --- Serial & Code (3) ---
    "serialwrite": {
        "tag": "[AZIONE:serialwrite:{text}]",
        "intent": "code",
        "category": "serial",
        "responses": [
            "Scritto sulla seriale!", "Testo inviato alla seriale.",
            "Messaggio seriale inviato.",
        ],
        "entities": ["{text}"],
        "needs_llm": False,
        "parametric": True,
        "param_name": "text",
    },
    "setcode": {
        "tag": "[AZIONE:setcode:{code}]",
        "intent": "code",
        "category": "serial",
        "responses": [
            "Codice impostato!", "Ecco il codice!",
            "Codice caricato nell'editor.",
        ],
        "entities": [],
        "needs_llm": False,
        "parametric": True,
        "param_name": "code",
    },
    "appendcode": {
        "tag": "[AZIONE:appendcode:{code}]",
        "intent": "code",
        "category": "serial",
        "responses": [
            "Codice aggiunto!", "Righe aggiunte al codice.",
            "Codice appendato.",
        ],
        "entities": [],
        "needs_llm": False,
        "parametric": True,
        "param_name": "code",
    },

    # --- Build Mode (1) ---
    "setbuildmode": {
        "tag": "[AZIONE:setbuildmode:{mode}]",
        "intent": "action",
        "category": "buildmode",
        "responses": [
            "Modalita' di costruzione cambiata!", "Build mode aggiornato!",
            "Cambio modalita'!", "Ecco la nuova modalita'!",
        ],
        "entities": [],
        "needs_llm": False,
        "parametric": True,
        "param_name": "mode",
    },
}


# ============================================================
# COMPONENTI, PIN, BREADBOARD DATA
# ============================================================

COMPONENTS = [
    "led", "resistor", "push-button", "buzzer-piezo", "capacitor",
    "potentiometer", "photo-resistor", "diode", "mosfet-n", "rgb-led",
    "motor-dc", "servo", "reed-switch", "phototransistor", "battery9v",
    "multimeter", "lcd16x2", "nano-r4-board", "breadboard-half",
    "breadboard-full", "wire",
]

PLACEABLE = [
    "led", "resistor", "push-button", "buzzer-piezo", "capacitor",
    "potentiometer", "photo-resistor", "diode", "mosfet-n", "rgb-led",
    "motor-dc", "servo", "reed-switch", "phototransistor", "lcd16x2",
]

PIN_MAP = {
    "led": ["anode", "cathode"],
    "resistor": ["pin1", "pin2"],
    "push-button": ["pin1", "pin2"],
    "buzzer-piezo": ["positive", "negative"],
    "capacitor": ["positive", "negative"],
    "potentiometer": ["vcc", "signal", "gnd"],
    "photo-resistor": ["pin1", "pin2"],
    "diode": ["anode", "cathode"],
    "mosfet-n": ["gate", "drain", "source"],
    "rgb-led": ["red", "common", "green", "blue"],
    "motor-dc": ["positive", "negative"],
    "servo": ["signal", "vcc", "gnd"],
    "reed-switch": ["pin1", "pin2"],
    "phototransistor": ["collector", "emitter"],
    "battery9v": ["positive", "negative"],
    "lcd16x2": ["VSS", "VDD", "V0", "RS", "RW", "E", "D4", "D5", "D6", "D7", "A", "K"],
}

WING_PINS = [
    "W_A0", "W_A1", "W_A2", "W_A3",
    "W_D3", "W_D5", "W_D6", "W_D9", "W_D10", "W_D11", "W_D12", "W_D13",
]
WING_PINS_EXTENDED = WING_PINS + ["W_A4/SDA", "W_A5/SCL", "W_D0/RX", "W_D1/TX"]

DIGITAL_PINS = ["D3", "D5", "D6", "D9", "D10", "D11", "D12", "D13"]
ANALOG_PINS = ["A0", "A1", "A2", "A3"]


# ============================================================
# TAB, ALIAS, GIOCHI
# ============================================================

TABS = ["simulator", "manual", "video", "canvas", "editor",
        "taccuini", "detective", "poe", "reverse", "review"]

TAB_ALIASES = {
    "simulator": ["simulatore", "sim", "circuito", "breadboard", "la breadboard"],
    "manual": ["manuale", "libro", "guida", "istruzioni", "il manuale", "il libro"],
    "video": ["video", "filmato", "tutorial video", "il video"],
    "canvas": ["lavagna", "canvas", "disegno", "foglio", "la lavagna"],
    "editor": ["editor", "codice", "programma", "code", "l'editor", "il codice"],
    "taccuini": ["taccuino", "quaderno", "appunti", "note", "notebook", "il taccuino"],
    "detective": ["detective", "trova il guasto", "gioco detective", "il detective"],
    "poe": ["prevedi e spiega", "previsione", "poe", "il gioco poe"],
    "reverse": ["circuito misterioso", "reverse", "mistero", "il mistero"],
    "review": ["controlla circuito", "review", "verifica", "il review"],
}

GAME_TABS = ["detective", "poe", "reverse", "review"]


# ============================================================
# ESPERIMENTI (69 totali: 38 vol1 + 18 vol2 + 13 vol3)
# ============================================================

EXPERIMENTS = [
    # Volume 1 (38 esperimenti)
    "v1-cap1-esp1", "v1-cap2-esp1", "v1-cap2-esp2", "v1-cap3-esp1", "v1-cap3-esp2",
    "v1-cap4-esp1", "v1-cap4-esp2", "v1-cap5-esp1", "v1-cap5-esp2", "v1-cap5-esp3",
    "v1-cap6-esp1", "v1-cap6-esp2", "v1-cap7-esp1", "v1-cap7-esp2", "v1-cap7-esp3",
    "v1-cap8-esp1", "v1-cap8-esp2", "v1-cap8-esp3", "v1-cap9-esp1", "v1-cap9-esp2",
    "v1-cap9-esp3", "v1-cap9-esp4", "v1-cap9-esp5", "v1-cap9-esp6", "v1-cap9-esp7",
    "v1-cap9-esp8", "v1-cap10-esp1", "v1-cap10-esp2", "v1-cap11-esp1", "v1-cap11-esp2",
    "v1-cap12-esp1", "v1-cap12-esp2", "v1-cap12-esp3", "v1-cap13-esp1", "v1-cap13-esp2",
    "v1-cap14-esp1", "v1-cap14-esp2", "v1-cap14-esp3",
    # Volume 2 (18 esperimenti)
    "v2-cap1-esp1", "v2-cap1-esp2", "v2-cap2-esp1", "v2-cap2-esp2", "v2-cap3-esp1",
    "v2-cap3-esp2", "v2-cap4-esp1", "v2-cap4-esp2", "v2-cap5-esp1", "v2-cap5-esp2",
    "v2-cap6-esp1", "v2-cap6-esp2", "v2-cap7-esp1", "v2-cap7-esp2", "v2-cap8-esp1",
    "v2-cap8-esp2", "v2-cap9-esp1", "v2-cap10-esp1",
    # Volume 3 (13 esperimenti AVR)
    "v3-cap1-esp1", "v3-cap2-esp1", "v3-cap3-esp1", "v3-cap4-esp1", "v3-cap5-esp1",
    "v3-cap6-esp1", "v3-cap7-esp1", "v3-cap8-esp1", "v3-cap9-esp1", "v3-cap10-esp1",
    "v3-cap11-esp1", "v3-cap12-esp1", "v3-cap13-esp1",
]

EXP_NAMES = {
    "v1-cap1-esp1": "Cos'e' l'Elettricita'",
    "v1-cap2-esp1": "Il Primo Circuito",
    "v1-cap2-esp2": "Il Primo Circuito - Variante",
    "v1-cap3-esp1": "LED e Resistenze",
    "v1-cap3-esp2": "LED e Resistenze - Variante",
    "v1-cap4-esp1": "Circuiti in Serie",
    "v1-cap4-esp2": "Circuiti in Serie - Variante",
    "v1-cap5-esp1": "Circuiti in Parallelo",
    "v1-cap5-esp2": "Circuiti in Parallelo - Variante",
    "v1-cap5-esp3": "Circuiti in Parallelo - Challenge",
    "v1-cap6-esp1": "Il Pulsante",
    "v1-cap6-esp2": "Il Pulsante - Variante",
    "v1-cap7-esp1": "Il Buzzer",
    "v1-cap7-esp2": "Il Buzzer - Variante",
    "v1-cap7-esp3": "Il Buzzer - Challenge",
    "v1-cap8-esp1": "Il Potenziometro",
    "v1-cap8-esp2": "Il Potenziometro - Variante",
    "v1-cap8-esp3": "Il Potenziometro - Challenge",
    "v1-cap9-esp1": "Il Condensatore",
    "v1-cap9-esp2": "Il Condensatore - Variante",
    "v1-cap10-esp1": "Il Diodo",
    "v1-cap10-esp2": "Il Diodo - Variante",
    "v1-cap11-esp1": "Il Transistor",
    "v1-cap11-esp2": "Il Transistor - Variante",
    "v1-cap12-esp1": "Il Motore DC",
    "v1-cap12-esp2": "Il Motore DC - Variante",
    "v1-cap12-esp3": "Il Motore DC - Challenge",
    "v1-cap13-esp1": "Il Sensore di Luce",
    "v1-cap13-esp2": "Il Sensore di Luce - Variante",
    "v1-cap14-esp1": "Il Primo Robot",
    "v1-cap14-esp2": "Il Primo Robot - Variante",
    "v1-cap14-esp3": "Il Primo Robot - Challenge",
    "v2-cap1-esp1": "Circuiti Avanzati",
    "v2-cap1-esp2": "Circuiti Avanzati - Variante",
    "v2-cap2-esp1": "Sensori Multipli",
    "v2-cap2-esp2": "Sensori Multipli - Variante",
    "v2-cap3-esp1": "Logica Digitale",
    "v2-cap3-esp2": "Logica Digitale - Variante",
    "v2-cap4-esp1": "Il Condensatore Avanzato",
    "v2-cap4-esp2": "Il Condensatore Avanzato - Variante",
    "v2-cap5-esp1": "RGB LED",
    "v2-cap5-esp2": "RGB LED - Variante",
    "v2-cap6-esp1": "Il Reed Switch",
    "v2-cap6-esp2": "Il Reed Switch - Variante",
    "v2-cap7-esp1": "Il Fototransistor",
    "v2-cap7-esp2": "Il Fototransistor - Variante",
    "v2-cap8-esp1": "Il Servo",
    "v2-cap8-esp2": "Il Servo - Variante",
    "v2-cap9-esp1": "Il MOSFET",
    "v2-cap10-esp1": "Progetto Libero",
    "v3-cap1-esp1": "Hello Arduino",
    "v3-cap2-esp1": "Blink LED",
    "v3-cap3-esp1": "Semaforo",
    "v3-cap4-esp1": "Buzzer Melodia",
    "v3-cap5-esp1": "Sensore Luce Arduino",
    "v3-cap6-esp1": "Servo Arduino",
    "v3-cap7-esp1": "LCD Display",
    "v3-cap8-esp1": "Comunicazione Seriale",
    "v3-cap9-esp1": "SOS Morse",
    "v3-cap10-esp1": "Simon Says",
    "v3-cap11-esp1": "Stazione Meteo",
    "v3-cap12-esp1": "Piano Elettronico",
    "v3-cap13-esp1": "Domotica Base",
}


# ============================================================
# COMPONENT ALIASES (come li chiamano i ragazzi 10-14)
# ============================================================

COMPONENT_ALIASES = {
    "led": [
        "LED", "led", "lucina", "lucetta", "lampadina", "luce",
        "diodo luminoso", "ledino", "lucciola", "la lucina", "il led",
        "lampadina LED", "il LED", "un LED", "una lucina",
    ],
    "resistor": [
        "resistenza", "resistore", "res", "la resistenza", "una resistenza",
        "il resistore", "ohm", "la res", "quella cosa a strisce",
    ],
    "push-button": [
        "pulsante", "bottone", "tasto", "il pulsante", "pushbutton",
        "switch", "interruttore", "tastino", "pulsantino", "button",
        "il bottone", "il tasto", "push button",
    ],
    "buzzer-piezo": [
        "buzzer", "cicalino", "il buzzer", "altoparlante", "speaker",
        "suoneria", "beeper", "il cicalino", "piezo", "ronzatore",
        "buzzerino", "la cosa che suona",
    ],
    "capacitor": [
        "condensatore", "capacitore", "il condensatore", "cap",
        "il cap", "capacitor", "il barilotto",
    ],
    "potentiometer": [
        "potenziometro", "pot", "il pot", "il potenziometro",
        "manopola", "la manopola", "rotella", "trimmer",
    ],
    "photo-resistor": [
        "fotoresistenza", "fotoresistore", "sensore di luce",
        "LDR", "il fotoresistore", "la fotoresistenza",
        "sensore luminoso", "il sensore di luce",
    ],
    "diode": [
        "diodo", "il diodo", "la diode", "un diodo",
    ],
    "mosfet-n": [
        "mosfet", "il mosfet", "transistor", "il transistor",
        "MOSFET", "mosfet N", "il MOSFET",
    ],
    "rgb-led": [
        "LED RGB", "led rgb", "RGB", "il led RGB", "led colorato",
        "LED multicolore", "led a tre colori", "rgb", "il RGB",
    ],
    "motor-dc": [
        "motore", "motorino", "il motore", "motore DC", "il motorino",
        "motore elettrico", "motor", "il motor",
    ],
    "servo": [
        "servo", "servomotore", "il servo", "il servomotore",
        "servo motore", "braccetto", "il braccetto",
    ],
    "reed-switch": [
        "reed switch", "il reed", "sensore magnetico",
        "interruttore magnetico", "reed", "il sensore magnetico",
    ],
    "phototransistor": [
        "fototransistor", "il fototransistor", "sensore ottico",
        "il sensore ottico", "phototransistor",
    ],
    "battery9v": [
        "batteria", "pila", "la batteria", "batteria 9V", "la pila",
        "9 volt", "pila 9V",
    ],
    "multimeter": [
        "multimetro", "tester", "il multimetro", "il tester",
        "voltmetro", "strumento di misura",
    ],
    "lcd16x2": [
        "display", "LCD", "schermo", "il display", "lo schermo",
        "display LCD", "LCD 16x2", "il monitor",
    ],
}


# ============================================================
# KID NAMES, EMOTIONS, OFF-TOPIC, NEGATIONS
# ============================================================

KID_NAMES = [
    "Marco", "Sofia", "Luca", "Giulia", "Alessandro", "Emma", "Francesco",
    "Alice", "Lorenzo", "Chiara", "Matteo", "Sara", "Andrea", "Giorgia",
    "Leonardo", "Anna", "Davide", "Martina", "Tommaso", "Elena", "Nicolo'",
    "Camilla", "Gabriele", "Greta", "Riccardo", "Beatrice", "Federico",
    "Valentina", "Pietro", "Aurora", "Filippo", "Vittoria", "Diego",
    "Elisa", "Christian", "Noemi",
]

EMOTION_POSITIVE = [
    "Bellissimo!", "Wow!", "Fantastico!", "Troppo forte!", "Che bello!",
    "Funziona!", "Evvai!", "Si'!!", "Grande!", "Figata!", "Amazing!",
    "Ce l'ho fatta!", "Finalmente!", "Mitico!", "Super!",
    "Spacca!", "Top!", "Perfetto!", "Che spettacolo!",
]

EMOTION_NEGATIVE = [
    "Non capisco niente!", "Aiuto!", "Non funziona!", "Sono confuso",
    "E' troppo difficile", "Non ci riesco", "Che palle", "Boh",
    "Mi sono perso", "Non ho capito", "Che schifo", "Odio sto circuito",
    "Non ne posso piu'", "Ma che cavolo", "Help me", "SOS",
    "Non ci capisco nulla", "Che casino", "E' impossibile",
    "Uffa", "Ma come si fa?!", "Non va niente!",
]

EMOTION_CURIOUS = [
    "Come mai?", "Davvero?", "Ma e' vero che...?", "E se...?",
    "Pero' mi chiedo...", "Ah interessante, e...?", "Figo! E poi?",
    "Wow, come funziona?", "Ma perche'?", "E se faccio al contrario?",
    "Che succede se...?", "Ma tipo...?",
]

OFFTOPIC_MESSAGES = [
    "Che ore sono?", "Mi piace il calcio", "Cosa mangi a pranzo?",
    "Hai visto Minecraft?", "Giochi a Fortnite?", "Quanti anni hai?",
    "Dove abiti?", "Mi racconti una barzelletta?", "Chi sei?",
    "Sei un robot?", "Sei vero?", "Puoi fare i compiti di matematica?",
    "Qual e' il tuo colore preferito?", "Ti piace la pizza?",
    "Cosa fai nel tempo libero?", "Sai cantare?", "Parlami di te",
    "Conosci ChatGPT?", "Sei meglio di Siri?", "Mi annoio",
    "Non ho voglia di studiare", "Posso giocare?", "Che giorno e' oggi?",
    "Mi aiuti con la tesina?", "Sai giocare a scacchi?",
    "Quanto fa 2+2?", "Chi ha inventato il telefono?",
    "Come si chiama il presidente?", "Che tempo fa domani?",
]

NEGATION_TEMPLATES = [
    "Non avviare la simulazione", "Non togliere {comp}",
    "Non compilare", "Non cancellare niente", "Non resettare",
    "Aspetta, non fare nulla", "Fermo, non ho ancora finito",
    "No, non quello", "Non volevo dire quello",
    "Non toccare {comp}", "Lascia tutto cosi'", "Non cambiare niente",
    "No stop, non era quello che volevo", "Non mettere {comp}",
    "Non avviare ancora", "Fermati, non ho chiesto io",
    "Non spostare niente", "Non eliminare {comp}",
]


# ============================================================
# BUILD MODES
# ============================================================

BUILD_MODES = ["passopasso", "completo", "sandbox", "guided"]

BUILD_MODE_PHRASES = {
    "passopasso": [
        "Voglio il passo passo", "Modalita' passo passo", "Step by step",
        "Fammi costruire passo passo", "Guida passo passo",
        "Costruzione guidata", "Voglio fare uno step alla volta",
    ],
    "completo": [
        "Montaggio completo", "Metti tutto gia' montato",
        "Gia' montato", "Tutto subito", "Completo",
        "Fammi vedere il circuito completo", "Montami tutto",
    ],
    "sandbox": [
        "Modalita' libera", "Sandbox", "Voglio costruire da solo",
        "Fammi fare a me", "Modalita' sandbox", "Libero",
        "Lasciatemi costruire", "Voglio sperimentare",
    ],
    "guided": [
        "Modalita' guidata", "Guided", "Guidami nella costruzione",
        "Aiutami a costruire", "Mi guidi tu?",
    ],
}


# ============================================================
# TYPO ENGINE
# ============================================================

def apply_typo(text, probability=0.3):
    """Applica errori di battitura realistici con probabilita' data."""
    if random.random() > probability:
        return text

    words = text.split()
    if not words:
        return text

    idx = random.randint(0, len(words) - 1)
    word = words[idx]
    if len(word) < 3:
        return text

    typo_type = random.choice([
        "swap", "drop", "double", "adjacent", "space_drop", "accent",
    ])

    if typo_type == "swap" and len(word) > 3:
        pos = random.randint(1, len(word) - 2)
        word = word[:pos] + word[pos + 1] + word[pos] + word[pos + 2:]
    elif typo_type == "drop":
        pos = random.randint(1, len(word) - 1)
        word = word[:pos] + word[pos + 1:]
    elif typo_type == "double":
        pos = random.randint(0, len(word) - 1)
        word = word[:pos] + word[pos] + word[pos:]
    elif typo_type == "adjacent":
        adj = {
            "a": "s", "s": "d", "d": "f", "e": "r", "r": "t",
            "i": "o", "o": "p", "n": "m", "l": "k", "v": "b", "c": "x",
        }
        pos = random.randint(0, len(word) - 1)
        ch = word[pos].lower()
        if ch in adj:
            rep = adj[ch]
            word = word[:pos] + (rep.upper() if word[pos].isupper() else rep) + word[pos + 1:]
    elif typo_type == "space_drop" and len(words) > 2:
        if idx < len(words) - 1:
            words[idx] = words[idx] + words[idx + 1]
            words.pop(idx + 1)
            return " ".join(words)
    elif typo_type == "accent":
        accent_map = {
            "e'": "è", "a'": "à", "o'": "ò", "u'": "ù",
            "perche'": "xke", "perche": "xke",
        }
        for old, new in accent_map.items():
            if old in word.lower() and random.random() < 0.5:
                word = word.replace(old, new)
                break

    words[idx] = word
    return " ".join(words)


def augment_phrase(phrase):
    """Aggiunge variazioni naturali: prefissi, suffissi, filler, case."""
    result = phrase

    # 20% prefisso
    if random.random() < 0.20:
        prefix = random.choice([
            "Galileo, ", "Ehi, ", "Dai, ", "Ok ", "Senti, ", "Per favore ",
            "Puoi ", "Mi ", "Allora ", "Dunque ", "Ehm... ", "Scusa, ",
            "Aspetta, ", "Oh, ", "Ah, ", "Hmm ", "Ehi Galileo, ", "Ciao, ",
            "Gali, ", "Gali ", "Galileo ",
        ])
        result = prefix + result[0].lower() + result[1:] if result else result

    # 15% suffisso
    if random.random() < 0.15:
        suffix = random.choice([
            " per favore", " grazie", " dai", " va bene?", " ok?",
            " si?", " eh", " perfavore", " pf", " plz", " thx",
            "!", " :)", " :D",
        ])
        result = result.rstrip("!?.") + suffix

    # 8% tutto maiuscolo
    if random.random() < 0.08:
        result = result.upper()
    # 10% tutto minuscolo
    elif random.random() < 0.10:
        result = result.lower()

    return result


# ============================================================
# CONTEXT GENERATION (v6 — esteso)
# ============================================================

def random_context_v6(
    tab=None, comps=None, vol=None, exp=None, wires=None,
    step=None, sim_state=None, build_mode=None,
    editor_mode=None, code_present=None,
):
    """Genera un blocco [CONTESTO] realistico con tutti i campi v6."""
    tab = tab or random.choice(TABS[:5])  # main tabs by default
    vol = vol or random.randint(1, 3)

    if comps is None:
        n = random.randint(0, 6)
        comps = []
        for _ in range(n):
            c = random.choice(PLACEABLE)
            cid = c.replace("-", "") + str(len([x for x in comps if x.startswith(c.replace("-", ""))]) + 1)
            comps.append(cid)

    wires = wires if wires is not None else random.randint(0, min(len(comps) * 2, 10))
    exp = exp if exp is not None else (random.choice(EXPERIMENTS) if random.random() < 0.35 else None)
    sim_state = sim_state or random.choice(["stopped", "running", "paused"])
    build_mode = build_mode or random.choice(BUILD_MODES)
    editor_mode = editor_mode or random.choice(["arduino", "scratch"])
    code_present = code_present if code_present is not None else random.choice([True, False])

    ctx = f"[CONTESTO]\ntab: {tab}\n"
    if exp:
        ctx += f"esperimento: {exp}\n"
    ctx += f"componenti: [{', '.join(comps)}]\n"
    ctx += f"fili: {wires}\n"
    ctx += f"volume_attivo: {vol}\n"
    ctx += f"simulazione: {sim_state}\n"
    ctx += f"build_mode: {build_mode}"

    if step is not None:
        ctx += f"\nstep_corrente: {step}"
    if vol == 3 or editor_mode:
        ctx += f"\neditor_mode: {editor_mode}"
    ctx += f"\ncodice_presente: {'true' if code_present else 'false'}"

    return ctx


# ============================================================
# EXAMPLE BUILDERS
# ============================================================

def make_example(user_msg, intent, entities, actions, needs_llm,
                 response, llm_hint, ctx=None):
    """Build a single-turn ChatML example."""
    ctx = ctx or random_context_v6()
    full_user = f"{ctx}\n\n[MESSAGGIO]\n{user_msg}"
    assistant_json = json.dumps({
        "intent": intent,
        "entities": entities,
        "actions": actions,
        "needs_llm": needs_llm,
        "response": response,
        "llm_hint": llm_hint,
    }, ensure_ascii=False)
    return {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT_V6},
            {"role": "user", "content": full_user},
            {"role": "assistant", "content": assistant_json},
        ]
    }


def make_multi_turn(turns, base_ctx=None):
    """Build a multi-turn ChatML example.

    turns = list of tuples:
        (user_msg, intent, entities, actions, needs_llm, response, llm_hint[, ctx_override])
    """
    messages = [{"role": "system", "content": SYSTEM_PROMPT_V6}]
    for t in turns:
        user_msg, intent, entities, actions, needs_llm, response, llm_hint = t[:7]
        ctx = t[7] if len(t) > 7 else (base_ctx or random_context_v6())
        full_user = f"{ctx}\n\n[MESSAGGIO]\n{user_msg}"
        assistant_json = json.dumps({
            "intent": intent,
            "entities": entities,
            "actions": actions,
            "needs_llm": needs_llm,
            "response": response,
            "llm_hint": llm_hint,
        }, ensure_ascii=False)
        messages.append({"role": "user", "content": full_user})
        messages.append({"role": "assistant", "content": assistant_json})
    return {"messages": messages}


# ============================================================
# LAYER GENERATORS (placeholder — Tasks 2-5 will implement)
# ============================================================

def gen_layer_replay(n):
    """Layer 1: Riformulazioni fedeli dal dataset esistente.
    Prende esempi v3/20k e li rigenera con SYSTEM_PROMPT_V6 e contesto esteso.
    ~3000 examples covering ALL intents to prevent catastrophic forgetting.
    """

    # ================================================================
    # PHRASE TEMPLATES (rich Italian variants: formal, informal, slang)
    # ================================================================

    # --- Action phrases per type ---
    REPLAY_PLAY_PHRASES = [
        "Avvia", "Avvia la simulazione", "Play", "Start", "Vai", "Fai partire",
        "Accendi", "Fai partire il circuito", "Lancia la simulazione", "Metti in moto",
        "Premi play", "Fallo andare", "Daje!", "Via!", "Parti!", "Accendilo",
        "Fai girare", "Attiva", "Dai che si parte", "Andiamo!", "Proviamo",
        "Testiamo il circuito", "Facciamo andare", "OK avvia", "Si parte", "Go!",
        "Run it", "Let's go", "Fire it up", "Ho finito di montare, avvia",
        "Pronto, fai partire", "Il circuito e' pronto, avvia", "Dai vai",
        "Forza avvia", "Fammelo vedere in azione", "Aziona il circuito",
        "Metti in funzione", "Fammi vedere come va", "Partiamo!", "Iniziamo!",
        "Mandalo", "Prova!", "Vediamo se funziona", "Fallo funzionare",
        "voglio vederlo in azione", "accendi tutto", "manda avanti",
    ]
    REPLAY_PAUSE_PHRASES = [
        "Stop", "Ferma", "Pausa", "Metti in pausa", "Ferma tutto", "Fermalo",
        "Stoppa", "Blocca", "Fermati", "Basta", "Stop la simulazione", "Premi stop",
        "Spegni", "Alt", "Aspetta", "Fermo!", "Stoppalo!", "Basta cosi'",
        "Ok basta", "Fermati un attimo", "Frena", "Stoppami tutto", "Blocca tutto",
        "Tieni fermo", "Pause", "Hold", "Halt", "Stop it", "Fermami tutto",
        "Un attimo", "Wait", "No no ferma!", "Blocca blocca!", "Stai fermo",
        "Aspe'", "Ferma un secondo", "fermala", "basta fermati", "stop stop",
        "ferma la simulazione", "spegni tutto",
    ]
    REPLAY_RESET_PHRASES = [
        "Reset", "Resetta", "Resetta il circuito", "Ripristina", "Ricomincia",
        "Ricomincia da capo", "Resetta tutto", "Rimetti a zero", "Reimposta",
        "Da capo", "Daccapo", "Dall'inizio", "Ricominciamo", "Azzera",
        "Azzera tutto", "Fai reset", "Premi reset", "Resettiamo", "Come prima",
        "Rifai da capo", "Riportami alla situazione iniziale",
        "Torna allo stato originale", "riparti da zero",
        "rimetti tutto a posto", "restart",
    ]
    REPLAY_CLEARALL_PHRASES = [
        "Cancella tutto", "Pulisci tutto", "Svuota", "Svuota tutto", "Togli tutto",
        "Rimuovi tutto", "Elimina tutto", "Pulisci la breadboard",
        "Svuota la breadboard", "Via tutto", "Butta via tutto", "Sgombra",
        "Fai piazza pulita", "Tabula rasa", "Leva tutto", "Spazza via",
        "Sparecchia", "Ripulisci", "Togli tutta sta roba",
        "Voglio ricominciare da zero", "Voglio una breadboard vuota",
        "Toglimi tutto di mezzo", "Via via tutto", "Clear all",
        "pulisci", "cancella", "elimina tutto quanto",
    ]
    REPLAY_COMPILE_PHRASES = [
        "Compila", "Compila il codice", "Compila lo sketch", "Verifica il codice",
        "Controlla il codice", "Build", "Prova a compilare", "Lancia la compilazione",
        "Vedi se il codice e' giusto", "Testami il codice", "Compilalo",
        "Fai il build", "Manda in compilazione", "Verifica lo sketch",
        "compile", "compilazione",
    ]
    REPLAY_QUIZ_PHRASES = [
        "Quiz", "Fammi un quiz", "Domanda", "Fammi una domanda",
        "Prova a interrogarmi", "Verificami", "Test", "Fammi un test",
        "Mettimi alla prova", "Interrogami", "Challenge", "Sfidami",
        "Sparami un quiz", "Facciamo un quiz", "Quiz!", "Interrogazione!",
        "Testami", "Daje col quiz", "Voglio mettermi alla prova",
        "Vediamo se ho capito", "Prova a farmi qualche domanda",
    ]
    REPLAY_DIAGNOSE_PHRASES = [
        "Diagnosi", "Diagnostica", "Cosa c'e' che non va?", "Trova l'errore",
        "Controlla cosa non funziona", "Perche' non funziona?", "Debug",
        "Cerca il problema", "Cosa non va?", "Analizza il circuito",
        "Verifica il mio circuito", "C'e' qualcosa di sbagliato?",
    ]
    REPLAY_UNDO_PHRASES = [
        "Annulla", "Undo", "Torna indietro", "Ctrl Z",
        "annulla l'ultima cosa", "indietro", "torna come prima",
    ]
    REPLAY_REDO_PHRASES = [
        "Rifai", "Redo", "Ripeti", "rimetti quello che ho tolto",
        "Ctrl Y", "ripristina", "rimetti",
    ]
    REPLAY_NEXTSTEP_PHRASES = [
        "Avanti", "Prossimo passo", "Prossimo step", "Vai avanti",
        "Next", "next step", "continua", "andiamo avanti",
        "passo successivo", "step dopo",
    ]
    REPLAY_PREVSTEP_PHRASES = [
        "Indietro", "Passo precedente", "Step precedente",
        "Torna indietro", "Previous", "back", "passo prima",
        "step prima", "vai indietro",
    ]
    REPLAY_SHOWBOM_PHRASES = [
        "Mostra i componenti", "BOM", "Lista componenti", "Cosa mi serve?",
        "Quali pezzi servono?", "materiali", "mostra la lista",
        "che componenti ci sono?", "bill of materials",
    ]
    REPLAY_SHOWSERIAL_PHRASES = [
        "Monitor seriale", "Serial monitor", "Apri la seriale",
        "Mostra output", "Mostra seriale", "serial",
        "fammi vedere la seriale", "output seriale",
    ]
    REPLAY_RESETCODE_PHRASES = [
        "Resetta il codice", "Codice originale",
        "Rimetti il codice di default", "codice iniziale", "reset code",
        "rimetti il codice originale", "codice di partenza",
    ]

    REPLAY_ACTION_PHRASES = {
        "play": REPLAY_PLAY_PHRASES,
        "pause": REPLAY_PAUSE_PHRASES,
        "reset": REPLAY_RESET_PHRASES,
        "clearall": REPLAY_CLEARALL_PHRASES,
        "undo": REPLAY_UNDO_PHRASES,
        "redo": REPLAY_REDO_PHRASES,
        "compile": REPLAY_COMPILE_PHRASES,
        "quiz": REPLAY_QUIZ_PHRASES,
        "diagnose": REPLAY_DIAGNOSE_PHRASES,
        "nextstep": REPLAY_NEXTSTEP_PHRASES,
        "prevstep": REPLAY_PREVSTEP_PHRASES,
        "showbom": REPLAY_SHOWBOM_PHRASES,
        "showserial": REPLAY_SHOWSERIAL_PHRASES,
        "resetcode": REPLAY_RESETCODE_PHRASES,
    }

    # --- Placement templates ---
    REPLAY_PLACE_TEMPLATES = [
        "Metti {comp}", "Aggiungi {comp}", "Piazza {comp}", "Mettimi {comp}",
        "Voglio {comp}", "Dammi {comp}", "Mi serve {comp}", "Ho bisogno di {comp}",
        "Metti {comp} sulla breadboard", "Aggiungi {comp} al circuito",
        "Piazzami {comp}", "Posiziona {comp}", "Inserisci {comp}",
        "Ci metti {comp}?", "Puoi mettere {comp}?", "Aggiungimi {comp}",
        "Manca {comp}, aggiungilo", "Serve {comp}", "Ci vuole {comp}",
        "Mettici {comp}", "Daje metti {comp}", "Su metti {comp}",
    ]

    REPLAY_PLACE_MULTI_TEMPLATES = [
        "Metti {list}", "Aggiungi {list}", "Mi servono {list}",
        "Piazza {list}", "Costruisci un circuito con {list}",
        "Voglio {list} sulla breadboard", "Ho bisogno di {list}",
        "Mettimi {list}", "Dammi {list}", "Prepara {list}",
        "Piazzami {list} per favore", "Costruiscimi {list}",
    ]

    # --- Wiring templates ---
    REPLAY_WIRE_P2P = [
        "Collega {c1} a {c2}", "Metti un filo da {c1} a {c2}",
        "Connetti {c1} con {c2}", "Fai un collegamento tra {c1} e {c2}",
        "Cabla {c1} a {c2}", "Wire da {c1} a {c2}",
        "Collega il pin {p1} di {c1} al pin {p2} di {c2}",
        "Metti un filo tra {c1} pin {p1} e {c2} pin {p2}",
        "Unisci {c1} e {c2}", "Fai un filo tra {c1} e {c2}",
    ]
    REPLAY_WIRE_BUS = [
        "Collega {comp} al bus positivo", "Collega {comp} al bus negativo",
        "Metti {comp} a massa", "Collega {comp} al GND",
        "Collega {comp} al 5V", "Collega {comp} a VCC",
        "Collega {comp} al bus-bot-plus", "Connetti {comp} al bus-bot-minus",
        "Porta {comp} al positivo", "Metti {comp} sul bus GND",
        "{comp} al positivo", "{comp} al negativo", "{comp} a GND",
    ]
    REPLAY_WIRE_WING = [
        "Collega {comp} al pin {wing}", "Metti un filo da {comp} a {wing}",
        "Connetti {comp} al pin digitale {pin}", "Collega {comp} all'analogico {pin}",
        "Fai un filo tra {comp} e il pin {wing}",
        "Porta {comp} al pin {wing} della board",
        "Collega {comp} a {wing}",
    ]

    # --- Navigation templates ---
    REPLAY_LOADEXP_TEMPLATES = [
        "Carica l'esperimento {name}", "Apri {name}", "Vai a {name}",
        "Voglio fare {name}", "Fammi fare {name}", "Carica {name}",
        "Portami a {name}", "Apri l'esperimento {name}", "Mostra {name}",
        "Seleziona {name}", "Facciamo {name}", "Andiamo a {name}",
    ]
    REPLAY_TAB_TEMPLATES = [
        "Apri il {tab}", "Vai al {tab}", "Mostra il {tab}", "Passa al {tab}",
        "Fammi vedere il {tab}", "Apri la scheda {tab}", "Portami al {tab}",
        "Voglio il {tab}", "Vai sulla scheda {tab}",
    ]
    REPLAY_VOLUME_TEMPLATES = [
        "Apri il Volume {n}", "Vai al Volume {n}", "Volume {n}",
        "Mostra il Volume {n}", "Passa al Volume {n}",
        "Voglio il Volume {n}", "Carica il Volume {n}",
    ]
    REPLAY_EDITOR_SWITCH = {
        "scratch": [
            "Passa a Scratch", "Usa Scratch", "Voglio programmare con i blocchi",
            "Apri l'editor Scratch", "Modalita' blocchi", "Passa ai blocchi",
            "Blocchi", "Voglio i blocchi", "Fammi usare Scratch",
            "Metti Scratch", "Apri Scratch", "Blocchetti",
        ],
        "arduino": [
            "Torna ad Arduino", "Usa Arduino C++", "Codice testuale",
            "Passa all'editor Arduino", "Modalita' codice", "Torna al codice",
            "Arduino", "Voglio scrivere il codice", "Fammi usare Arduino",
            "Metti Arduino", "Apri l'editor codice", "C++",
        ],
    }

    # --- Code question templates ---
    REPLAY_CODE_QUESTIONS = [
        "Come si fa a {action}?", "Scrivi il codice per {action}",
        "Programmami {action}", "Codice per {action}",
        "Mi aiuti con il codice per {action}?",
        "Come faccio a {action} con Arduino?", "Voglio {action}",
        "Scrivimi lo sketch per {action}", "Fammi il programma per {action}",
        "Mi scrivi il codice per {action}?", "Come posso {action}?",
    ]
    REPLAY_CODE_ACTIONS = [
        "far lampeggiare un LED", "accendere un LED con il pulsante",
        "leggere il potenziometro", "controllare la luminosita' del LED",
        "suonare una melodia con il buzzer", "muovere il servo",
        "leggere il sensore di luce", "scrivere sul display LCD",
        "usare il Serial Monitor", "fare un semaforo",
        "fare il gioco SOS Morse", "far lampeggiare 3 LED in sequenza",
        "leggere un valore analogico", "usare il PWM per controllare un motore",
        "usare un if-else", "usare un ciclo for", "definire una funzione",
        "usare una variabile", "fare un conto alla rovescia",
        "creare un allarme con il buzzer",
        "controllare il servo con il potenziometro",
        "usare millis invece di delay", "leggere la temperatura",
        "fare un Simon Says", "usare map()",
    ]
    REPLAY_SCRATCH_QUESTIONS = [
        "Come faccio con i blocchi a {action}?",
        "Quale blocco uso per {action}?",
        "In Scratch come si fa {action}?",
        "Con i blocchi posso {action}?",
        "Programmami {action} con Scratch",
        "Blocchi per {action}",
        "Fammi il codice a blocchi per {action}",
    ]
    REPLAY_SCRATCH_ACTIONS = [
        "far lampeggiare un LED", "leggere un sensore",
        "muovere il servo", "accendere un LED",
        "suonare il buzzer", "leggere il potenziometro",
        "controllare un motore", "fare un ciclo",
        "usare una variabile", "aspettare un secondo",
        "scrivere sulla seriale", "usare un if",
    ]

    # --- Tutor: theory topics ---
    REPLAY_THEORY_TEMPLATES = [
        "Cos'e' {topic}?", "Spiegami {topic}", "Come funziona {topic}?",
        "A cosa serve {topic}?", "Cosa fa {topic}?", "Perche' si usa {topic}?",
        "Mi spieghi {topic}?", "Non capisco {topic}", "Che cos'e' {topic}?",
        "Parlami di {topic}", "Vorrei sapere di piu' su {topic}",
    ]
    REPLAY_THEORY_TOPICS = [
        "una resistenza", "un LED", "un condensatore", "un diodo",
        "un transistor", "un potenziometro", "un buzzer", "un motore DC",
        "un servo", "un LED RGB", "la legge di Ohm", "la corrente elettrica",
        "la tensione", "il voltaggio", "la resistenza",
        "i circuiti in serie", "i circuiti in parallelo",
        "la breadboard", "il GND", "il 5V", "il bus positivo", "il bus negativo",
        "il pin digitale", "il pin analogico", "il PWM", "Arduino",
        "il codice Arduino", "la funzione setup", "la funzione loop",
        "digitalWrite", "analogRead", "analogWrite", "delay",
        "il Serial Monitor", "la corrente continua", "gli ampere",
        "i volt", "gli ohm", "i watt", "il cortocircuito", "la polarita'",
        "l'anodo", "il catodo", "la capacita'", "i farad", "la frequenza",
        "il duty cycle", "Scratch", "Blockly", "i blocchi di programmazione",
        "il compilatore", "la fotoresistenza", "il fototransistor",
        "il reed switch", "il display LCD", "la comunicazione seriale",
        "il baud rate",
    ]

    # --- Tutor: comparison pairs ---
    REPLAY_COMPARE_TEMPLATES = [
        "Qual e' la differenza tra {a} e {b}?",
        "Cosa cambia tra {a} e {b}?",
        "Meglio usare {a} o {b}?",
        "{a} e {b} sono la stessa cosa?",
        "Quando uso {a} e quando {b}?",
        "In cosa differiscono {a} e {b}?",
    ]
    REPLAY_COMPARE_PAIRS = [
        ("serie", "parallelo"), ("LED", "buzzer"),
        ("resistenza", "potenziometro"), ("digitale", "analogico"),
        ("input", "output"), ("5V", "3.3V"), ("diodo", "LED"),
        ("motore DC", "servo"), ("Scratch", "Arduino C++"),
        ("corrente", "tensione"), ("condensatore", "resistenza"),
        ("setup", "loop"), ("digitalRead", "analogRead"),
        ("delay", "millis"), ("HIGH", "LOW"),
        ("fotoresistenza", "fototransistor"), ("volt", "ampere"),
        ("PWM", "digitale"), ("anodo", "catodo"),
    ]

    # --- Tutor: debug templates ---
    REPLAY_DEBUG_TEMPLATES = [
        "Il LED non si accende, cosa sbaglio?", "Il circuito non funziona",
        "Non succede niente quando premo play", "Il buzzer non suona",
        "Il motore non gira", "Il codice non compila", "Errore di compilazione",
        "Il servo non si muove", "Il display e' vuoto",
        "Non leggo valori dal sensore", "La resistenza e' troppo alta?",
        "Ho collegato tutto ma non va", "Il LED lampeggia strano",
        "Il serial monitor non mostra nulla", "Il pulsante non risponde",
        "Qualcosa non funziona, aiutami", "Ho un problema con il circuito",
        "C'e' un errore da qualche parte", "Il LED e' collegato al contrario?",
        "Non capisco perche' non va", "Mi da' errore nel codice",
        "Il sensore da' sempre lo stesso valore",
        "Ho sbagliato qualcosa nei collegamenti",
        "Perche' si scalda la resistenza?",
        "Il condensatore e' al contrario?",
        "Il diodo non fa passare corrente",
        "Il LED si accende ma non lampeggia",
        "Il potenziometro non cambia niente",
        "Il motore gira al contrario", "Il circuito fa cortocircuito",
    ]

    # --- Vision templates ---
    REPLAY_VISION_TEMPLATES = [
        "Guarda il mio circuito", "Cosa c'e' di sbagliato?",
        "Controlla se e' collegato bene", "Analizza lo screenshot",
        "Guarda cosa ho fatto", "Vedi se va bene",
        "Dai un'occhiata al circuito", "Dimmi cosa vedi",
        "Controlla il mio lavoro", "Guarda se e' giusto",
        "Foto del circuito, controllala", "Cosa ne pensi del circuito?",
        "Verifica i collegamenti dalla foto", "Guarda questa immagine",
        "Analizza il mio circuito", "Vedi il mio progetto",
        "E' corretto il circuito?", "Controlla dalla foto",
        "Guarda e dimmi se va bene", "Osserva il circuito",
        "Guarda la breadboard", "Cos'e' che non va? Guarda",
        "Verifica dalla foto se manca qualcosa", "Guarda se ho collegato bene",
        "Riesci a vedere il circuito?", "Analizzi la foto?",
        "Controlla i fili dalla foto", "Guarda l'immagine e dimmi",
        "Fammi un check visivo", "Guarda se e' tutto a posto",
        "Osserva bene e dimmi se manca qualcosa",
        "Controllo visivo del circuito", "Vedi qualcosa che non va?",
        "Analizza questa foto del mio circuito",
    ]

    # --- Teacher templates ---
    REPLAY_TEACHER_TEMPLATES = [
        "Mostra i risultati della classe", "Come stanno andando i miei studenti?",
        "Report del quiz", "Statistiche della classe",
        "Quanti hanno fatto il quiz?", "Chi ha preso il voto migliore?",
        "Mostra i progressi degli studenti", "Andamento della classe",
        "Risultati degli esperimenti", "Quanto tempo hanno impiegato?",
        "Mostra le statistiche", "Fammi vedere i risultati",
        "Report di {name}", "Come va {name}?", "Progressi di {name}",
        "Quanto ha fatto {name}?", "Voti del quiz", "Classifica della classe",
        "Media dei voti", "Chi e' rimasto indietro?",
        "Quali studenti hanno finito?", "Mostra il report completo",
        "Andamento quiz per capitolo", "Statistiche per esperimento",
        "Fammi un riassunto dei risultati", "Dashboard della classe",
        "Risultati del test di oggi", "Mostrami gli errori comuni",
        "Chi ha bisogno di aiuto?", "Evidenzia i punti deboli della classe",
    ]

    # --- Off-topic/negation ---
    REPLAY_OFFTOPIC = [
        "Che ore sono?", "Mi piace il calcio", "Cosa mangi a pranzo?",
        "Hai visto Minecraft?", "Giochi a Fortnite?", "Quanti anni hai?",
        "Dove abiti?", "Mi racconti una barzelletta?", "Chi sei?",
        "Sei un robot?", "Sei vero?", "Puoi fare i compiti di matematica?",
        "Qual e' il tuo colore preferito?", "Ti piace la pizza?",
        "Cosa fai nel tempo libero?", "Sai cantare?", "Parlami di te",
        "Conosci ChatGPT?", "Sei meglio di Siri?", "Mi annoio",
        "Non ho voglia di studiare", "Posso giocare?", "Che giorno e' oggi?",
        "Mi aiuti con la tesina?", "Sai giocare a scacchi?",
        "Quanto fa 2+2?", "Chi ha inventato il telefono?",
        "Come si chiama il presidente?", "Che tempo fa domani?",
        "Raccontami una storia", "Dimmi una battuta", "Ciao come stai?",
    ]
    REPLAY_NEGATION_TEMPLATES = [
        "Non avviare la simulazione", "Non compilare", "Non cancellare niente",
        "Non resettare", "Aspetta, non fare nulla", "Fermo, non ho ancora finito",
        "No, non quello", "Non volevo dire quello", "Lascia tutto cosi'",
        "Non cambiare niente", "No stop, non era quello che volevo",
        "Non avviare ancora", "Fermati, non ho chiesto io",
        "Non spostare niente", "Non toccare nulla", "Aspetta, fermo",
        "Stop, non intendevo quello", "Annulla, non era quello",
        "Fermo, aspetta un momento", "No, lascia stare",
    ]

    # ================================================================
    # SUB-GENERATORS
    # ================================================================

    def _replay_actions(count):
        """Generate action command examples for all 14 basic action types."""
        examples = []
        action_types = list(REPLAY_ACTION_PHRASES.keys())
        per_type = max(1, count // len(action_types))
        remainder = count - per_type * len(action_types)

        for act_key in action_types:
            phrases = REPLAY_ACTION_PHRASES[act_key]
            act_data = ACTIONS[act_key]
            num = per_type + (1 if remainder > 0 else 0)
            if remainder > 0:
                remainder -= 1

            for i in range(num):
                phrase = random.choice(phrases)
                phrase = augment_phrase(phrase)
                phrase = apply_typo(phrase, 0.3)

                response = random.choice(act_data["responses"])
                tag = act_data["tag"]
                intent = act_data["intent"]
                entities = list(act_data["entities"])

                examples.append(make_example(
                    user_msg=phrase,
                    intent=intent,
                    entities=entities,
                    actions=[tag],
                    needs_llm=False,
                    response=response,
                    llm_hint=None,
                    ctx=random_context_v6(),
                ))
        random.shuffle(examples)
        return examples[:count]

    def _replay_circuit(count):
        """Generate circuit placement examples: single + multi-component."""
        examples = []
        n_single = count // 2
        n_multi = count - n_single

        # --- Single component placement ---
        for _ in range(n_single):
            comp = random.choice(PLACEABLE)
            aliases = COMPONENT_ALIASES.get(comp, [comp])
            alias = random.choice(aliases)
            tpl = random.choice(REPLAY_PLACE_TEMPLATES)
            phrase = tpl.replace("{comp}", alias)
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            intent_obj = json.dumps(
                {"action": "place_and_wire", "components": [{"type": comp}], "wires": "auto"},
                ensure_ascii=False,
            )
            action_tag = f"[INTENT:{intent_obj}]"
            response = random.choice(ACTIONS["place_and_wire"]["responses"])

            examples.append(make_example(
                user_msg=phrase,
                intent="circuit",
                entities=[comp],
                actions=[action_tag],
                needs_llm=False,
                response=response,
                llm_hint=None,
                ctx=random_context_v6(),
            ))

        # --- Multi-component placement (2-5 components) ---
        for _ in range(n_multi):
            num_comps = random.randint(2, 5)
            comps = random.sample(PLACEABLE, min(num_comps, len(PLACEABLE)))
            comp_aliases = []
            comp_types = []
            for c in comps:
                aliases = COMPONENT_ALIASES.get(c, [c])
                comp_aliases.append(random.choice(aliases))
                comp_types.append({"type": c})

            # Build human-readable list
            if len(comp_aliases) == 2:
                list_str = f"{comp_aliases[0]} e {comp_aliases[1]}"
            else:
                list_str = ", ".join(comp_aliases[:-1]) + f" e {comp_aliases[-1]}"

            tpl = random.choice(REPLAY_PLACE_MULTI_TEMPLATES)
            phrase = tpl.replace("{list}", list_str)
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            intent_obj = json.dumps(
                {"action": "place_and_wire", "components": comp_types, "wires": "auto"},
                ensure_ascii=False,
            )
            action_tag = f"[INTENT:{intent_obj}]"
            response = random.choice(ACTIONS["place_and_wire"]["responses"])

            examples.append(make_example(
                user_msg=phrase,
                intent="circuit",
                entities=[c["type"] for c in comp_types],
                actions=[action_tag],
                needs_llm=False,
                response=response,
                llm_hint=None,
                ctx=random_context_v6(),
            ))

        random.shuffle(examples)
        return examples[:count]

    def _replay_wiring(count):
        """Generate wiring examples: pin-to-pin, bus, wing."""
        examples = []
        n_p2p = count // 3
        n_bus = count // 3
        n_wing = count - n_p2p - n_bus

        bus_targets = {
            "bus positivo": "bus-bot-plus",
            "bus negativo": "bus-bot-minus",
            "massa": "bus-bot-minus",
            "GND": "bus-bot-minus",
            "5V": "bus-bot-plus",
            "VCC": "bus-bot-plus",
            "bus-bot-plus": "bus-bot-plus",
            "bus-bot-minus": "bus-bot-minus",
        }

        # --- Pin-to-pin ---
        for _ in range(n_p2p):
            c1, c2 = random.sample(PLACEABLE, 2)
            p1 = random.choice(PIN_MAP.get(c1, ["pin1"]))
            p2 = random.choice(PIN_MAP.get(c2, ["pin1"]))
            a1 = random.choice(COMPONENT_ALIASES.get(c1, [c1]))
            a2 = random.choice(COMPONENT_ALIASES.get(c2, [c2]))

            tpl = random.choice(REPLAY_WIRE_P2P)
            phrase = tpl.replace("{c1}", a1).replace("{c2}", a2)
            phrase = phrase.replace("{p1}", p1).replace("{p2}", p2)
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            from_pin = f"{c1}:{p1}"
            to_pin = f"{c2}:{p2}"
            wire_tag = f"[AZIONE:addwire:{from_pin}:{to_pin}]"
            response = random.choice(ACTIONS["addwire"]["responses"])

            examples.append(make_example(
                user_msg=phrase,
                intent="circuit",
                entities=[c1, c2],
                actions=[wire_tag],
                needs_llm=False,
                response=response,
                llm_hint=None,
                ctx=random_context_v6(),
            ))

        # --- Bus connections ---
        for _ in range(n_bus):
            comp = random.choice(PLACEABLE)
            alias = random.choice(COMPONENT_ALIASES.get(comp, [comp]))
            pin = random.choice(PIN_MAP.get(comp, ["pin1"]))

            tpl = random.choice(REPLAY_WIRE_BUS)
            # Extract bus target from template
            phrase = tpl.replace("{comp}", alias)
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            # Determine bus target
            bus_key = random.choice(["bus-bot-plus", "bus-bot-minus"])
            from_pin = f"{comp}:{pin}"
            wire_tag = f"[AZIONE:addwire:{from_pin}:{bus_key}]"
            response = random.choice(ACTIONS["addwire"]["responses"])

            examples.append(make_example(
                user_msg=phrase,
                intent="circuit",
                entities=[comp],
                actions=[wire_tag],
                needs_llm=False,
                response=response,
                llm_hint=None,
                ctx=random_context_v6(),
            ))

        # --- Wing pin connections ---
        for _ in range(n_wing):
            comp = random.choice(PLACEABLE)
            alias = random.choice(COMPONENT_ALIASES.get(comp, [comp]))
            pin = random.choice(PIN_MAP.get(comp, ["pin1"]))
            wing = random.choice(WING_PINS)
            dig_pin = wing.replace("W_", "")

            tpl = random.choice(REPLAY_WIRE_WING)
            phrase = tpl.replace("{comp}", alias).replace("{wing}", wing).replace("{pin}", dig_pin)
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            from_pin = f"{comp}:{pin}"
            wire_tag = f"[AZIONE:addwire:{from_pin}:{wing}]"
            response = random.choice(ACTIONS["addwire"]["responses"])

            examples.append(make_example(
                user_msg=phrase,
                intent="circuit",
                entities=[comp],
                actions=[wire_tag],
                needs_llm=False,
                response=response,
                llm_hint=None,
                ctx=random_context_v6(),
            ))

        random.shuffle(examples)
        return examples[:count]

    def _replay_navigation(count):
        """Generate navigation examples: loadexp, opentab, openvolume, editor switch."""
        examples = []
        n_loadexp = int(count * 100 / 300)
        n_opentab = int(count * 100 / 300)
        n_volume = int(count * 50 / 300)
        n_editor = count - n_loadexp - n_opentab - n_volume

        # --- Load experiment ---
        for _ in range(n_loadexp):
            exp_id = random.choice(EXPERIMENTS)
            exp_name = EXP_NAMES.get(exp_id, exp_id)
            tpl = random.choice(REPLAY_LOADEXP_TEMPLATES)
            phrase = tpl.replace("{name}", exp_name)
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            tag = f"[AZIONE:loadexp:{exp_id}]"
            response = random.choice(ACTIONS["loadexp"]["responses"])

            examples.append(make_example(
                user_msg=phrase,
                intent="navigation",
                entities=[exp_id],
                actions=[tag],
                needs_llm=False,
                response=response,
                llm_hint=None,
                ctx=random_context_v6(),
            ))

        # --- Open tab ---
        for _ in range(n_opentab):
            tab = random.choice(TABS)
            aliases = TAB_ALIASES.get(tab, [tab])
            alias = random.choice(aliases)
            tpl = random.choice(REPLAY_TAB_TEMPLATES)
            phrase = tpl.replace("{tab}", alias)
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            tag = f"[AZIONE:opentab:{tab}]"
            response = random.choice(ACTIONS["opentab"]["responses"])

            examples.append(make_example(
                user_msg=phrase,
                intent="navigation",
                entities=[tab],
                actions=[tag],
                needs_llm=False,
                response=response,
                llm_hint=None,
                ctx=random_context_v6(),
            ))

        # --- Open volume ---
        for _ in range(n_volume):
            vol = random.randint(1, 3)
            tpl = random.choice(REPLAY_VOLUME_TEMPLATES)
            phrase = tpl.replace("{n}", str(vol))
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            tag = f"[AZIONE:openvolume:{vol}]"
            response = random.choice(ACTIONS["openvolume"]["responses"]).replace("{n}", str(vol))

            examples.append(make_example(
                user_msg=phrase,
                intent="navigation",
                entities=[],
                actions=[tag],
                needs_llm=False,
                response=response,
                llm_hint=None,
                ctx=random_context_v6(),
            ))

        # --- Editor switching ---
        for _ in range(n_editor):
            mode = random.choice(["scratch", "arduino"])
            phrase = random.choice(REPLAY_EDITOR_SWITCH[mode])
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            act_key = f"switcheditor_{mode}"
            tag = f"[AZIONE:switcheditor:{mode}]"
            response = random.choice(ACTIONS[act_key]["responses"])

            examples.append(make_example(
                user_msg=phrase,
                intent="action",
                entities=[],
                actions=[tag],
                needs_llm=False,
                response=response,
                llm_hint=None,
                ctx=random_context_v6(editor_mode="scratch" if mode == "arduino" else "arduino"),
            ))

        random.shuffle(examples)
        return examples[:count]

    def _replay_code(count):
        """Generate code question examples (Arduino + Scratch). All needs_llm=true."""
        examples = []
        n_arduino = int(count * 0.65)
        n_scratch = count - n_arduino

        # --- Arduino code questions ---
        for _ in range(n_arduino):
            action = random.choice(REPLAY_CODE_ACTIONS)
            tpl = random.choice(REPLAY_CODE_QUESTIONS)
            phrase = tpl.replace("{action}", action)
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            examples.append(make_example(
                user_msg=phrase,
                intent="code",
                entities=[],
                actions=[],
                needs_llm=True,
                response=None,
                llm_hint=f"Lo studente chiede codice Arduino per: {action}",
                ctx=random_context_v6(editor_mode="arduino"),
            ))

        # --- Scratch code questions ---
        for _ in range(n_scratch):
            action = random.choice(REPLAY_SCRATCH_ACTIONS)
            tpl = random.choice(REPLAY_SCRATCH_QUESTIONS)
            phrase = tpl.replace("{action}", action)
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            examples.append(make_example(
                user_msg=phrase,
                intent="code",
                entities=[],
                actions=[],
                needs_llm=True,
                response=None,
                llm_hint=f"Lo studente chiede codice Scratch/Blockly per: {action}",
                ctx=random_context_v6(editor_mode="scratch"),
            ))

        random.shuffle(examples)
        return examples[:count]

    def _replay_tutor(count):
        """Generate tutor question examples: theory, comparison, debug. All needs_llm=true."""
        examples = []
        n_theory = int(count * 250 / 600)
        n_compare = int(count * 150 / 600)
        n_debug = count - n_theory - n_compare

        # --- Theory questions ---
        for _ in range(n_theory):
            topic = random.choice(REPLAY_THEORY_TOPICS)
            tpl = random.choice(REPLAY_THEORY_TEMPLATES)
            phrase = tpl.replace("{topic}", topic)
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            examples.append(make_example(
                user_msg=phrase,
                intent="tutor",
                entities=[],
                actions=[],
                needs_llm=True,
                response=None,
                llm_hint=f"Lo studente chiede una spiegazione su: {topic}",
                ctx=random_context_v6(),
            ))

        # --- Comparison questions ---
        for _ in range(n_compare):
            a, b = random.choice(REPLAY_COMPARE_PAIRS)
            tpl = random.choice(REPLAY_COMPARE_TEMPLATES)
            phrase = tpl.replace("{a}", a).replace("{b}", b)
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            examples.append(make_example(
                user_msg=phrase,
                intent="tutor",
                entities=[],
                actions=[],
                needs_llm=True,
                response=None,
                llm_hint=f"Lo studente chiede un confronto tra {a} e {b}",
                ctx=random_context_v6(),
            ))

        # --- Debug questions ---
        for _ in range(n_debug):
            phrase = random.choice(REPLAY_DEBUG_TEMPLATES)
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            examples.append(make_example(
                user_msg=phrase,
                intent="tutor",
                entities=[],
                actions=[],
                needs_llm=True,
                response=None,
                llm_hint="Lo studente ha un problema col circuito e chiede aiuto per il debug",
                ctx=random_context_v6(),
            ))

        random.shuffle(examples)
        return examples[:count]

    def _replay_vision(count):
        """Generate vision request examples. All needs_llm=true, intent=vision."""
        examples = []
        for _ in range(count):
            phrase = random.choice(REPLAY_VISION_TEMPLATES)
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            examples.append(make_example(
                user_msg=phrase,
                intent="vision",
                entities=[],
                actions=[],
                needs_llm=True,
                response=None,
                llm_hint="Lo studente chiede analisi visiva del circuito/screenshot",
                ctx=random_context_v6(),
            ))
        return examples

    def _replay_teacher(count):
        """Generate teacher request examples. All needs_llm=true, intent=teacher."""
        examples = []
        for _ in range(count):
            tpl = random.choice(REPLAY_TEACHER_TEMPLATES)
            # Fill {name} if present
            if "{name}" in tpl:
                name = random.choice(KID_NAMES)
                phrase = tpl.replace("{name}", name)
            else:
                phrase = tpl
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            examples.append(make_example(
                user_msg=phrase,
                intent="teacher",
                entities=[],
                actions=[],
                needs_llm=True,
                response=None,
                llm_hint="Richiesta pedagogica: statistiche, report, progressi studenti",
                ctx=random_context_v6(),
            ))
        return examples

    def _replay_offtopic(count):
        """Generate off-topic and negation examples."""
        examples = []
        n_offtopic = count // 2
        n_negation = count - n_offtopic

        # --- Off-topic (needs_llm=true, intent=tutor) ---
        for _ in range(n_offtopic):
            phrase = random.choice(REPLAY_OFFTOPIC)
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            examples.append(make_example(
                user_msg=phrase,
                intent="tutor",
                entities=[],
                actions=[],
                needs_llm=True,
                response=None,
                llm_hint="Messaggio off-topic. Rispondi brevemente e riporta lo studente all'elettronica.",
                ctx=random_context_v6(),
            ))

        # --- Negations (needs_llm=false, intent=action) ---
        for _ in range(n_negation):
            tpl = random.choice(REPLAY_NEGATION_TEMPLATES)
            if "{comp}" in tpl:
                comp = random.choice(PLACEABLE)
                alias = random.choice(COMPONENT_ALIASES.get(comp, [comp]))
                phrase = tpl.replace("{comp}", alias)
            else:
                phrase = tpl
            phrase = augment_phrase(phrase)
            phrase = apply_typo(phrase, 0.3)

            examples.append(make_example(
                user_msg=phrase,
                intent="action",
                entities=[],
                actions=[],
                needs_llm=False,
                response="Ok, non faccio nulla.",
                llm_hint=None,
                ctx=random_context_v6(),
            ))

        random.shuffle(examples)
        return examples[:count]

    # ================================================================
    # MAIN REPLAY ORCHESTRATION
    # ================================================================

    # Target distribution (proportional to n, base is 3000)
    scale = n / 3000.0
    targets = {
        "actions":    int(420 * scale),
        "circuit":    int(400 * scale),
        "wiring":     int(300 * scale),
        "navigation": int(300 * scale),
        "code":       int(400 * scale),
        "tutor":      int(600 * scale),
        "vision":     int(200 * scale),
        "teacher":    int(200 * scale),
        "offtopic":   int(180 * scale),
    }

    # Adjust to hit exact n
    total_targeted = sum(targets.values())
    diff = n - total_targeted
    if diff != 0:
        # Add/subtract from the largest category (tutor)
        targets["tutor"] += diff

    # Generate all sub-layers
    all_examples = []
    all_examples.extend(_replay_actions(targets["actions"]))
    all_examples.extend(_replay_circuit(targets["circuit"]))
    all_examples.extend(_replay_wiring(targets["wiring"]))
    all_examples.extend(_replay_navigation(targets["navigation"]))
    all_examples.extend(_replay_code(targets["code"]))
    all_examples.extend(_replay_tutor(targets["tutor"]))
    all_examples.extend(_replay_vision(targets["vision"]))
    all_examples.extend(_replay_teacher(targets["teacher"]))
    all_examples.extend(_replay_offtopic(targets["offtopic"]))

    # Shuffle and trim to exact n
    random.shuffle(all_examples)
    return all_examples[:n]


def gen_layer_direct_action(n):
    """Layer 2: Tutte le 42 azioni dirette con varianti massive.
    Per ogni azione: frasi base, typo, augmentation, kid slang.
    """
    # TODO: Task 3 — implementare
    return []


def gen_layer_context_aware(n):
    """Layer 3: Esempi context-aware.
    Il contesto (tab, esperimento, stato sim, editor mode) influenza il routing.
    Es: "compila" su tab canvas → tutor, "compila" su tab editor → action.
    """
    # TODO: Task 4 — implementare
    return []


def gen_layer_adversarial(n):
    """Layer 4: Negazioni, off-topic, ambiguita', edge case.
    - "Non avviare" → no action
    - "Che ore sono?" → tutor (off-topic redirect)
    - "Metti il led... anzi no, il buzzer" → correction handling
    """
    # TODO: Task 5 — implementare
    return []


def gen_eval_set(n):
    """Evaluation set bilanciato.
    ~N/7 per intent, mix di facile/medio/difficile.
    Non deve sovrapporsi al training set.
    """
    # TODO: Task 5 — implementare
    return []


# ============================================================
# STATISTICS
# ============================================================

def compute_stats(examples):
    """Calcola e stampa statistiche del dataset."""
    if not examples:
        print("Dataset vuoto — nessuna statistica da mostrare.")
        print(f"\nACTIONS definite: {len(ACTIONS)}")
        print(f"COMPONENTS: {len(COMPONENTS)}")
        print(f"PLACEABLE: {len(PLACEABLE)}")
        print(f"EXPERIMENTS: {len(EXPERIMENTS)}")
        print(f"TABS: {len(TABS)}")
        print(f"EXP_NAMES: {len(EXP_NAMES)}")
        print(f"COMPONENT_ALIASES: {len(COMPONENT_ALIASES)} componenti, "
              f"{sum(len(v) for v in COMPONENT_ALIASES.values())} alias totali")
        print(f"KID_NAMES: {len(KID_NAMES)}")
        print(f"BUILD_MODES: {len(BUILD_MODES)}")
        print(f"\nCategorie azioni:")
        cats = Counter()
        for a in ACTIONS.values():
            cats[a["category"]] += 1
        for cat, cnt in cats.most_common():
            print(f"  {cat}: {cnt}")
        return

    intent_dist = Counter()
    action_dist = Counter()
    needs_llm_dist = Counter()
    total_turns = 0

    for ex in examples:
        msgs = ex["messages"]
        for msg in msgs:
            if msg["role"] == "assistant":
                total_turns += 1
                try:
                    data = json.loads(msg["content"])
                    intent_dist[data.get("intent", "unknown")] += 1
                    needs_llm_dist[data.get("needs_llm", "unknown")] += 1
                    for act in data.get("actions", []):
                        # Normalize parametric actions
                        base = re.sub(r":.*?\]", "]", act) if ":" in act else act
                        action_dist[base] += 1
                except json.JSONDecodeError:
                    intent_dist["INVALID_JSON"] += 1

    print(f"\n{'='*60}")
    print(f"GALILEO BRAIN V6 — DATASET STATISTICS")
    print(f"{'='*60}")
    print(f"Total examples: {len(examples)}")
    print(f"Total assistant turns: {total_turns}")
    print(f"\nIntent distribution:")
    for intent, cnt in intent_dist.most_common():
        pct = 100.0 * cnt / total_turns if total_turns else 0
        print(f"  {intent:20s}: {cnt:5d} ({pct:5.1f}%)")
    print(f"\nneeds_llm distribution:")
    for k, cnt in needs_llm_dist.most_common():
        pct = 100.0 * cnt / total_turns if total_turns else 0
        print(f"  {str(k):20s}: {cnt:5d} ({pct:5.1f}%)")
    print(f"\nTop 20 actions:")
    for act, cnt in action_dist.most_common(20):
        print(f"  {act:40s}: {cnt:5d}")
    print(f"{'='*60}")


# ============================================================
# VALIDATION
# ============================================================

def validate_dataset(filepath):
    """Valida formato JSONL del dataset."""
    if not filepath.exists():
        print(f"File non trovato: {filepath}")
        return False

    errors = 0
    warnings = 0
    total = 0
    valid_intents = {"action", "circuit", "code", "tutor", "vision", "navigation", "teacher"}

    with open(filepath, "r", encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            total += 1
            try:
                obj = json.loads(line)
            except json.JSONDecodeError as e:
                print(f"  ERRORE riga {i}: JSON invalido — {e}")
                errors += 1
                continue

            if "messages" not in obj:
                print(f"  ERRORE riga {i}: manca 'messages'")
                errors += 1
                continue

            msgs = obj["messages"]
            if not msgs or msgs[0]["role"] != "system":
                print(f"  ERRORE riga {i}: primo messaggio non e' system")
                errors += 1
                continue

            for msg in msgs:
                if msg["role"] == "assistant":
                    try:
                        data = json.loads(msg["content"])
                        if data.get("intent") not in valid_intents:
                            print(f"  WARNING riga {i}: intent sconosciuto '{data.get('intent')}'")
                            warnings += 1
                    except json.JSONDecodeError:
                        print(f"  ERRORE riga {i}: assistant content non e' JSON valido")
                        errors += 1

    print(f"\nValidazione completata: {total} righe")
    print(f"  Errori: {errors}")
    print(f"  Warning: {warnings}")
    print(f"  Valide: {total - errors}")
    return errors == 0


# ============================================================
# MAIN
# ============================================================

DEFAULT_COUNTS = {
    "replay": 5000,
    "action": 8000,
    "context": 5000,
    "adversarial": 2000,
    "all": 20000,
}

LAYER_GENERATORS = {
    "replay": gen_layer_replay,
    "action": gen_layer_direct_action,
    "context": gen_layer_context_aware,
    "adversarial": gen_layer_adversarial,
}


def main():
    parser = argparse.ArgumentParser(
        description="Galileo Brain v6 — Onnipotenza Dataset Generator"
    )
    parser.add_argument(
        "--layer",
        choices=["replay", "action", "context", "adversarial", "all"],
        default="all",
        help="Quale layer generare (default: all)",
    )
    parser.add_argument(
        "--count", "-n",
        type=int,
        default=None,
        help="Numero di esempi da generare (default varia per layer)",
    )
    parser.add_argument(
        "--seed", "-s",
        type=int,
        default=42,
        help="Seed per riproducibilita' (default: 42)",
    )
    parser.add_argument(
        "--eval",
        action="store_true",
        help="Genera eval dataset invece del training",
    )
    parser.add_argument(
        "--stats",
        action="store_true",
        help="Mostra solo statistiche (non genera)",
    )
    parser.add_argument(
        "--validate",
        action="store_true",
        help="Valida formato del file output",
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        default=None,
        help="Path output personalizzato",
    )

    args = parser.parse_args()

    # Seed
    random.seed(args.seed)

    # Determine output path
    script_dir = Path(__file__).resolve().parent
    project_dir = script_dir.parent
    datasets_dir = project_dir / "datasets"
    datasets_dir.mkdir(exist_ok=True)

    if args.output:
        output_path = Path(args.output)
    elif args.eval:
        output_path = datasets_dir / "galileo-brain-v6-eval.jsonl"
    else:
        output_path = datasets_dir / "galileo-brain-v6.jsonl"

    # Stats-only mode
    if args.stats:
        if output_path.exists():
            print(f"Statistiche di: {output_path}")
            examples = []
            with open(output_path, "r", encoding="utf-8") as f:
                for line in f:
                    try:
                        examples.append(json.loads(line))
                    except json.JSONDecodeError:
                        pass
            compute_stats(examples)
        else:
            print(f"File non trovato: {output_path}")
            print("Mostro statistiche delle costanti definite:\n")
            compute_stats([])
        return

    # Validate mode
    if args.validate:
        ok = validate_dataset(output_path)
        sys.exit(0 if ok else 1)

    # Determine count
    count = args.count or DEFAULT_COUNTS.get(args.layer, 20000)

    # Generate
    if args.eval:
        print(f"Generazione eval set: {count} esempi...")
        examples = gen_eval_set(count)
    elif args.layer == "all":
        print(f"Generazione completa v6: ~{count} esempi...")
        # Distribuzione tra layer: 25% replay, 40% action, 25% context, 10% adversarial
        n_replay = int(count * 0.25)
        n_action = int(count * 0.40)
        n_context = int(count * 0.25)
        n_adversarial = count - n_replay - n_action - n_context

        examples = []
        for layer_name, layer_count in [
            ("replay", n_replay),
            ("action", n_action),
            ("context", n_context),
            ("adversarial", n_adversarial),
        ]:
            print(f"  Layer {layer_name}: {layer_count}...")
            layer_examples = LAYER_GENERATORS[layer_name](layer_count)
            examples.extend(layer_examples)
            print(f"    -> {len(layer_examples)} generati")
    else:
        print(f"Generazione layer '{args.layer}': {count} esempi...")
        examples = LAYER_GENERATORS[args.layer](count)

    # Shuffle
    random.shuffle(examples)

    # Write
    if examples:
        with open(output_path, "w", encoding="utf-8") as f:
            for ex in examples:
                f.write(json.dumps(ex, ensure_ascii=False) + "\n")
        print(f"\nScritti {len(examples)} esempi in: {output_path}")
        compute_stats(examples)
    else:
        print(f"\nNessun esempio generato (layer generators sono placeholder).")
        print("I generatori verranno implementati nei Task 2-5.")
        print(f"\nVerifica costanti:")
        compute_stats([])

    # File hash for reproducibility
    if examples and output_path.exists():
        h = hashlib.md5(output_path.read_bytes()).hexdigest()
        print(f"\nMD5: {h}")
        print(f"Seed: {args.seed}")
        print(f"Timestamp: {datetime.now().isoformat()}")


if __name__ == "__main__":
    main()
