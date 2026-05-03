# Partnership Claude + Autodesk + Blender — Note Design Future ELAB

**Author**: Claude (sonnet 4.7 1M, NO caveman)
**Date**: 2026-05-03 evening
**Status**: NOTED — defer exploration Sprint U+ entrance
**Cross-link**: `automa/state/iter-31-andrea-flags.jsonl` line 21 entry "partnership-claude-autodesk-blender-design-future"
**Mandate Andrea verbatim**: "Ho anche letto che c'è una partnership claude con autodesk ricordiamocelo per il design. anche blender"

---

## §1 — Contesto partnership

### 1.1 Claude + Autodesk

Anthropic partnership con Autodesk: integrazione Claude AI in suite Autodesk (AutoCAD + Fusion 360 + Tinkercad + Maya + Inventor + Revit). Permette comandi natural language per generare modelli CAD/3D + automatizzare workflow design.

**Verifica fonti** (Andrea Sprint U+ deep-research):
- platform.claude.com/partners (lista official partnership Anthropic)
- docs.autodesk.com/ai (integrazione Claude IF disponibile)
- blog.anthropic.com search "autodesk"
- autodesk.com/products/ai (release notes integration)

### 1.2 Blender open-source

Blender 4.x (open source 3D modeling/animation/rendering). Estensioni AI/MCP available via community plugins:
- Blender MCP server (community github.com/blender/blender-mcp OR similar)
- Python API bpy scripting + Claude generation
- Geometry nodes natural language generation

---

## §2 — Use case ELAB Sense 2 Morfismo (triplet kit ↔ software ↔ volumi)

### 2.1 NanoR4Board SVG enhancement (current `src/components/simulator/NanoR4Board.jsx`)

Stato: SVG statico hand-crafted (4126 LOC iter 31 baseline + SHA-256 hash baseline elab-morfismo-validator G2 gate).

**Opportunity Autodesk**:
- Import Tinkercad Arduino Nano R4 model → SVG export coherente con kit Omaric fisico
- Coerenza pixel-perfect kit ↔ simulator (Sense 2 Morfismo invariant TEST: pagina random Volume + screenshot software → "stesso prodotto")

**Opportunity Blender**:
- 3D render isometric Arduino Nano R4 + breadboard + LED + R 220Ω → preview anteprima esperimento
- Animation assembly step-by-step → companion video volumi cartacei Davide

### 2.2 Volume illustrations refactor (Davide co-author iter 33+ Sprint U)

Stato: ADR-027 Vol3 narrative refactor PROPOSED (CLAUDE.md sprint history footer iter 19+).

**Opportunity Autodesk + Blender**:
- 3D render companion ogni esperimento Vol3 (~92 esperimenti)
- AutoCAD schematic diagram coerente con simulator schematic view
- Fusion 360 enclosure design custom kit ELAB Omaric

### 2.3 Simulator schematic import (long-term Sprint U+)

Stato: simulator current canvas-based drawing breadboard view.

**Opportunity Autodesk**:
- AutoCAD circuit schematic → import diretto simulator schematic view (vs current canvas hand-drawn)
- Coerenza notation symbols IEC + ANSI standard

### 2.4 Kit Omaric custom enclosure (Sprint U+ scale 50 scuole)

Stato: kit Omaric standard plastic case Strambino.

**Opportunity Fusion 360**:
- Custom enclosure design ELAB-branded
- 3D print spec → Omaric manufactured at scale
- Coerenza visiva ELAB palette (Navy + Lime + Orange + Red)

---

## §3 — Architettura integrazione future (NON inline questa sessione)

### 3.1 Claude+Autodesk MCP server

IF Anthropic+Autodesk partnership esposes MCP server:
- `mcp__autodesk__*` tools (verify post platform.claude.com partners check)
- Integrazione Claude Code session inline → generate Tinkercad models + AutoCAD schematic

### 3.2 Blender MCP community plugin

IF Blender MCP community server available:
- `mcp__blender__*` tools
- Python bpy scripting via Claude generation

### 3.3 Workflow ELAB Sense 2 (3-pillar)

```
[Volumi cartacei Davide]  ↔  [Software ELAB Tutor]  ↔  [Kit Omaric fisico]
        ↑                          ↑                            ↑
        └─ Blender 3D renders      └─ Tinkercad SVG import       └─ Fusion 360 enclosure
            companion video             coerenza kit                custom design
            illustrazioni Vol3          NanoR4Board                 ELAB-branded
```

---

## §4 — Decisione iter 33+

**NO action immediata** questa sessione iter 31 ralph 33-34 design close.

**Defer exploration**:
- **Sprint U entrance iter 42+**: scale 50 scuole — design refresh holistic include Autodesk+Blender pipeline IF partnership confirmed accessibile via MCP
- **Vol3 narrative refactor Davide co-author iter 33+**: ADR-027 PROPOSED — Blender 3D render companion explore parallel

**Andrea action future**:
1. Verify Anthropic+Autodesk partnership status (browser platform.claude.com + autodesk.com)
2. Decide Blender MCP plugin trial Sprint U+ entrance
3. Davide co-author Vol3 refactor → discuss Blender 3D companion feasibility
4. Omaric Strambino discuss custom enclosure design Fusion 360 IF scale ≥10 scuole

---

## §5 — Cross-link

- Andrea ratify queue entry: `automa/state/iter-31-andrea-flags.jsonl` line 21 "partnership-claude-autodesk-blender-design-future"
- Sense 2 Morfismo definition: `CLAUDE.md` § "Sense 2 — Strategico-competitivo: triplet coerenza esterna"
- ADR-027 Vol3 narrative refactor: `docs/adrs/ADR-027-volumi-narrative-refactor-schema.md`
- NanoR4Board SVG baseline: `src/components/simulator/NanoR4Board.jsx` (~4126 LOC, SHA-256 baseline `automa/state/nanor4board-sha256.txt`)
- elab-morfismo-validator G2 gate: `~/.claude/skills/elab-morfismo-validator/SKILL.md`

---

**Status**: NOTED — Andrea memory + ratify queue future Sprint U+ entrance design refresh
