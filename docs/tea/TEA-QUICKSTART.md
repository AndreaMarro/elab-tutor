# Tea Quickstart — Come contribuire a ELAB Tutor

Benvenuta Tea! Questa guida ti spiega come contribuire al progetto in modo sicuro.

## Setup iniziale (una volta sola)

```bash
git clone https://github.com/AndreaMarro/elab-builder.git
cd elab-builder
npm install
npm run build
npx vitest run
```

## Workflow per ogni contributo

### 1. Crea un branch

```bash
git checkout main
git pull origin main
git checkout -b style/nome-modifica
```

### 2. Aree dove puoi lavorare (auto-merge abilitato)

| Path | Cosa contiene |
|------|--------------|
| docs/ | Documentazione, guide, report |
| tests/ | Test (sempre benvenuti!) |
| src/styles/ | CSS globali |
| src/components/common/ | Componenti condivisi UI |
| src/components/dashboard/ | Dashboard docente |
| src/components/**/*.module.css | CSS Modules |
| src/data/lesson-paths/ | Percorsi lezione JSON |

### 3. Verifica prima di committare

```bash
npx vitest run
npm run build
```

### 4. Committa e pusha

```bash
git add file1.css file2.md
git commit -m "style(lavagna): migliora padding card"
git push -u origin style/nome-modifica
```

### 5. Apri Pull Request

Su GitHub, apri una PR verso main. Aggiungi la label tea-autoflow per auto-merge.

## Aree OFF-LIMITS (richiedono review Andrea)

- src/components/simulator/engine/ — Solver, AVR Bridge
- src/components/simulator/canvas/SimulatorCanvas.jsx
- src/components/simulator/NewElabSimulator.jsx
- src/services/api.js, src/services/simulator-api.js
- vite.config.js, package.json
- .github/workflows/

## Convenzioni

- Commit: tipo(area): descrizione
- Branch: style/, docs/, fix/ + nome
- CSS: preferisci CSS Modules
- Font: minimo 13px testi, 10px label
- Touch target: minimo 44x44px
- Palette: Navy #1E4D8C / Lime #4A7A25 / Orange #E8941C / Red #E54B3D
- Icone: usa ElabIcons.jsx, mai emoji nei componenti
