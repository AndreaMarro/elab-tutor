# Strategie Anti-Degradazione Codice AI — Ricerca Verificata
> Data: 2026-04-06 | Basato su SlopCodeBench (arXiv:2603.24755) + ricerca pratica

## Scoperta Critica

**Il prompt engineering NON ferma la degradazione.**
- `anti_slop` prompt: riduce verbosita iniziale del 33% MA la degradazione riprende alla stessa velocita
- `plan_first` prompt: sposta il punto di partenza, NON la pendenza
- Entrambi costano 30-48% in piu di token senza miglioramento statisticamente significativo
- **Solo gate meccaniche funzionano** (ESLint, jscpd, commit size, CI enforcement)

## Metriche SlopCodeBench

- **Structural Erosion**: mass(f) = CC(f) * sqrt(SLOC(f)) per funzioni con CC > 10
- **Verbosity**: AST-grep pattern detection + code duplication, normalizzata 0-1
- Erosione sale nell'80% delle traiettorie
- Verbosita sale nell'89.8% delle traiettorie
- Codice AI e 2.2x piu verboso del codice umano

## 8 Soluzioni Implementabili (ordine priorita)

### P0 — Blocca subito
1. **eslint.config.js** con complexity max 15, cognitive-complexity max 20, max-depth 4
   - Richiede: `npm install -D eslint-plugin-sonarjs` (unica eccezione)
2. **measure-erosion.js** script (replica metrica SlopCodeBench) → traccia trend nel tempo

### P1 — Questa settimana
3. **jscpd** con threshold 5%, min 10 righe → blocca duplicazione
4. **Erosion check nel CI** → workflow step automatico
5. **Claude review prompt aggiornato** → focus su erosion indicators

### P2 — Prossima settimana
6. **ai-harness-scorecard** GitHub Action → 31 check su 5 categorie (SlopCodeBench-based)
7. **Commit size guard** (max 500 righe, 20 file) → hook o CI
8. **DeepSeek come secondo reviewer** → cross-model validation

### P3 — Quando serve
9. **SonarCloud free tier** → trend tracking su main (PR decoration richiede piano $32/mese)
10. **bundlewatch** → PR comments con size delta

## Tool Specifici Trovati

| Tool | Cosa fa | Costo |
|------|---------|-------|
| eslint-plugin-sonarjs | Cognitive complexity, duplicate strings, identical functions | Gratuito |
| jscpd | Copy-paste detection, Rabin-Karp algorithm, 150+ linguaggi | Gratuito |
| ai-harness-scorecard | 31 check anti-slop, GitHub Action, score 0-100 | Gratuito |
| CodeScene MCP | CodeHealth real-time in Claude Code, 30+ linguaggi | Free/Paid |
| bundlewatch | PR comments con delta bundle size | Gratuito |

## Insight Chiave per l'Autopilot ELAB

Il worker autonomo DEVE avere queste gate PRIMA di partire:
1. ESLint complexity → blocca funzioni spaghetti
2. jscpd → blocca copy-paste
3. Commit size limit → blocca mega-commit
4. Erosion trending → monitora la salute nel tempo

Senza queste gate, dopo ~200 iterazioni il codice degradera (SlopCodeBench provato).
Con queste gate, la degradazione viene BLOCCATA a livello meccanico.
