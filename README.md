# elab-builder — Il Simulatore ELAB Tutor / The ELAB Tutor Simulator

> &copy; Andrea Marro — 09/03/2026 — ELAB Tutor — Tutti i diritti riservati / All rights reserved

[Home](../../README.md) > [PRODOTTO](../README.md) > **elab-builder**

---

## 🇮🇹 Italiano

### Panoramica

Il cuore del progetto ELAB Tutor: un simulatore di circuiti educativo costruito con React 19 e Vite 6. I ragazzi (8-14 anni) trascinano LED, resistori e fili su una breadboard virtuale, scrivono codice Arduino, e parlano con Galileo — un tutor AI che risponde in italiano, analizza screenshot, e guida passo dopo passo.

### Demo Live

**[www.elabtutor.school](https://www.elabtutor.school)** (Vercel)

### Feature Principali

- **69 esperimenti interattivi** su 3 volumi (Vol1: base, Vol2: intermedio, Vol3: Arduino AVR)
- **22 componenti SVG** custom: LED, resistore, breadboard, Arduino Nano, buzzer, potenziometro, fotoresistore, servo, RGB LED...
- **Motore CircuitSolver**: analisi KVL/KCL in tempo reale
- **Emulatore AVR**: ATmega328p in-browser per esecuzione codice Arduino
- **Scratch/Blockly**: programmazione visuale → Arduino C++ → AVR (Vol3)
- **Editor Arduino**: CodeMirror 6 con syntax highlighting
- **Galileo AI**: tutor conversazionale multi-LLM (DeepSeek, Groq, Gemini vision)
- **138 quiz** integrati + **53 sfide/giochi**
- **Passo Passo**: montaggio guidato step-by-step con posizioni identiche al libro
- **4 lingue**: IT, EN, DE, ES

### Stack

| Layer | Tecnologia |
|-------|-----------|
| Frontend | React 19, Vite 6, CSS Modules |
| Editor | CodeMirror 6, Google Blockly (Scratch) |
| Simulazione | CircuitSolver (KVL/KCL), AVR Bridge (ATmega328p) |
| AI Backend | Nanobot (FastAPI + Docker) su Render |
| LLM | DeepSeek R1 + Groq (text racing), Gemini 2.5 Flash (vision) |
| Fine-tuning | Qwen3-4B + Unsloth LoRA (500 ChatML, loss 1.48→0.013) |
| Auth | bcrypt + HMAC-SHA256, RBAC, timing-safe tokens |
| Deploy | Vercel |
| Testing | Vitest, Playwright |

### Struttura

```
elab-builder/
├── src/                  ← 181 file sorgente React
│   ├── components/       ← Componenti UI (simulator, editor, chat, SVG)
│   ├── pages/            ← Pagine (login, dashboard, simulator)
│   ├── hooks/            ← Custom hooks React
│   ├── utils/            ← Utility (CircuitSolver, api, helpers)
│   └── styles/           ← CSS Modules + Design System
├── public/               ← 66 asset statici
├── nanobot/              ← Backend AI (FastAPI + Docker → Render)
├── docs/                 ← 116 documenti tecnici
│   ├── agents/           ← 17 report audit multi-agente
│   ├── plans/            ← 28 design document
│   ├── roadmap/          ← Piano 15 sessioni (S94-S108)
│   └── archive/          ← Documenti archiviati
├── datasets/             ← Dati training Galileo Brain
├── notebooks/            ← Jupyter fine-tuning
├── scripts/              ← 135 script validazione/test
├── tests/                ← Test suite Vitest
├── models/               ← File modelli AI (GGUF)
└── sessioni/             ← File di lavoro per sessione
```

### Comandi

```bash
npm run dev          # Dev server locale (porta 5173)
npm run build        # Build produzione
npm run preview      # Preview build locale
npm test             # Esegui test Vitest
npx vercel --prod    # Deploy produzione
```

### Dove Andare Dopo

- **Documentazione tecnica** → [`docs/README.md`](docs/README.md)
- **Piano di sviluppo** → [`docs/roadmap/README.md`](docs/roadmap/README.md)
- **Report audit agenti** → [`docs/agents/README.md`](docs/agents/README.md)
- **Design document** → [`docs/plans/README.md`](docs/plans/README.md)

---

## 🇬🇧 English

### Overview

The heart of ELAB Tutor: an educational circuit simulator built with React 19 and Vite 6. Kids (ages 8-14) drag LEDs, resistors, and wires onto a virtual breadboard, write Arduino code, and chat with Galileo — an AI tutor that responds in Italian, analyzes screenshots, and guides step by step.

### Live Demo

**[www.elabtutor.school](https://www.elabtutor.school)** (Vercel)

### Key Features

- **69 interactive experiments** across 3 volumes
- **22 custom SVG components**
- **CircuitSolver engine**: real-time KVL/KCL analysis
- **AVR emulator**: in-browser ATmega328p for Arduino code execution
- **Scratch/Blockly**: visual programming → Arduino C++ → AVR (Vol3)
- **Galileo AI**: conversational multi-LLM tutor (DeepSeek, Groq, Gemini vision)
- **138 quizzes** + **53 challenges/games**
- **Step-by-Step mode**: guided assembly matching book layouts exactly
- **4 languages**: IT, EN, DE, ES

### Commands

```bash
npm run dev          # Local dev server (port 5173)
npm run build        # Production build
npm test             # Run Vitest tests
npx vercel --prod    # Deploy to production
```

---

*Andrea Marro — 09/03/2026*
