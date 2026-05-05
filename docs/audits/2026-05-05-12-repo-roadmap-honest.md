# 12-Repo Roadmap ELAB — Synthesis Onesta Iter 40

**Data**: 2026-05-05 PM
**Pattern**: 5 parallel agents OPUS (general-purpose) WebFetch + ELAB integration map
**Verdict globale**: 8/12 repo già coperti 80%+, 4 repo offrono ROI net-new concreto

---

## §1 Verdict matrix one-liner

| # | Repo | Verdict | ROI net-new |
|---|------|---------|-------------|
| 1 | affaan-m/everything-claude-code | SELECTIVE-EXTRACT | LOW (4 specific files) |
| 2 | shanraisshan/claude-code-best-practice | SKIP install, READ once | MEDIUM (split MEMORY.md 5000→200) |
| 3 | obra/superpowers | NEW-FEATURE-EXTRACT | **HIGH** (verification-before-completion) |
| 4 | thedotmack/claude-mem | VERSION-CHECK + EXTRACT | **HIGH** (pathfinder + learn-codebase) |
| 5 | forrestchang/andrej-karpathy-skills | ALREADY-COVERED text | ZERO |
| 6 | hesreallyhim/awesome-claude-code | RESEARCH | LOW (3 telemetry tools) |
| 7 | yamadashy/repomix | **ADOPT-NOW** | **HIGH** (cross-provider audit) |
| 8 | gsd-build/get-shit-done | DEFER A/B test | LOW (overlap 86 skills) |
| 9 | dair-ai/Prompt-Engineering-Guide | TECHNIQUE-EXTRACT | **HIGH** (R7 +8-12pt Step-Back) |
| 10 | anthropics/skills | NEW-FEATURE-EXTRACT | MEDIUM (consolidate-memory + mcp-builder + pptx) |
| 11 | VoltAgent/awesome-claude-code-subagents | INSTALL 3 agents | MEDIUM (embedded + iot + prompt-engineer) |
| 12 | VoltAgent/awesome-design-md | EXTRACT 3 styles | MEDIUM (Notion + Mintlify + Airtable → .impeccable.md) |

---

## §2 P0 ROI immediato (eseguibili autonomi questa settimana)

### P0.1 repomix ADOPT-NOW (commande pronte)

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"

# Backend snapshot Codex/Gemini cross-provider review
npx repomix@latest --include "src/services/**,supabase/functions/**" \
  --style markdown --compress -o /tmp/elab-backend-snapshot.md

# Frontend lavagna+galileo audit
npx repomix@latest --include "src/components/lavagna/**,src/components/galileo/**" \
  --style xml --token-count-tree 5000 -o /tmp/elab-frontend-audit.xml

# Marketing PDF Giovanni Fagherazzi snapshot
npx repomix@latest --include "automa/context/UNLIM-VISION-COMPLETE.md,automa/context/GALILEO-CAPABILITIES.md" \
  --style markdown -o /tmp/elab-marketing-fagherazzi.md
```

Token saving 600K → 180K (70%). Single MCP call replaces 50+ Read roundtrips. ROI: ~$3/audit Anthropic Max + Codex/Gemini context window fit.

### P0.2 Step-Back Prompting BASE_PROMPT v3.4 (R7 +8-12pt highest leverage)

Edit `supabase/functions/_shared/system-prompt.ts` aggiungere block `<step_back>` PRIMA del block `<intent_dispatch>`:

```markdown
<step_back>
PRIMA di emettere INTENT JSON, identifica:
- categoria_astratta: una di [accendi-componente, modifica-codice, mostra-help, naviga-volume, fai-quiz, salva-sessione]
- componente_target: nome canonico in [led, resistore, breadboard, pin, pulsante, ...] o null
Solo DOPO emetti l'INTENT canonical conforme schema iter 38 ADR-030.
</step_back>
```

Expected R7 3.6% → 12-15% (Step-Back consistently lifts retrieval-grounded 10-36% per published benchmarks).

### P0.3 superpowers:verification-before-completion (anti-self-inflation)

Plugin GIA installed. Activate as Stop hook gate:

```bash
# In .claude/settings.json hooks block:
{
  "hooks": {
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {"type": "command", "command": "echo '[verify] use superpowers:verification-before-completion before claiming done'"}
        ]
      }
    ]
  }
}
```

Andrea G45 mandate enforce: pattern self-score 8.6→5.8 (G43, G45, iter 39 inflation history).

### P0.4 claude-mem:pathfinder + learn-codebase (context persistence)

Plugin GIA installed v12.6.0. Run primer per session:

```
/claude-mem:pathfinder
/claude-mem:learn-codebase
```

Direct fix per `feedback_context_persistence.md` "biggest productivity blocker". Currently dormant (50+ obs ma pathfinder mai invocato).

### P0.5 Split MEMORY.md 5000→200 (claude-code-best-practice)

MEMORY.md attualmente ~5000 LOC = ~25x best-practice limit (200 LOC). Pattern split per `.claude/rules/*.md` paths-glob lazy-load:

```
.claude/rules/elab-architecture.md     # solo se touch src/
.claude/rules/elab-supabase.md         # solo se touch supabase/
.claude/rules/elab-credentials.md      # solo se Bash session
.claude/rules/elab-volumi.md           # solo se touch src/data/
```

ROI: cut context rot 40% (Andrea identifies #1 productivity blocker). NO repo install needed — just file split.

---

## §3 P1 settimana prossima (Sprint U Cycle 3)

### P1.1 Self-Consistency 3-vote INTENT dispatch (R7 +5-7pt)

Wrap Mistral function-calling in 3x sampler temp 0.7, majority-vote canonical action. Reject if <2/3. Cost: 3x tokens dispatch (~€0.30/day budget OK).

### P1.2 ReAct Thought→Action→Observation RAG (R5 +3-5, R0 +2-3)

Replace single-shot RAG injection con explicit ReAct loop max-2-iter exposed as Mistral tools. Stack con P0.2 + P1.1 → projection R7 18-22%, R5 95%+, R0 94%+.

### P1.3 anthropics-skills:consolidate-memory periodic pass

Plugin GIA installed. Run weekly su MEMORY.md hygiene + drift consolidation. Auto-merge duplicate memories.

### P1.4 anthropics-skills:mcp-builder ELAB MCP

Build official ELAB MCP exposing simulator-api + galileo MCP. Currently ad-hoc. Standardize cross-provider tool-use surface.

### P1.5 VoltAgent 3 sub-agents install (gap-fill)

```bash
claude plugin marketplace add VoltAgent/awesome-claude-code-subagents
# Enable 3 specific:
# - voltagent-domains: embedded-systems + iot-engineer + game-developer
# - voltagent-data-ai: prompt-engineer
# - voltagent-biz: technical-writer
```

ELAB gap-fill specifico: Arduino Nano R4 register-level (embedded) + ESP32 Wi-Fi/BLE Vol3 (iot) + Sense 2 Morfismo missions (game) + UNLIM prompt tuning (prompt-engineer) + Volumi narrative refactor Italian (technical-writer).

---

## §4 P2 strategico (mese)

### P2.1 .impeccable.md design-md sezioni anchor 3 picks

```
.impeccable.md sezioni:
  Tipografia & Tono Editoriale → Notion DESIGN.md (paper-textbook serif minimalism)
  Layout Lezione & Lavagna → Mintlify DESIGN.md (lime-green didactic reading)
  Componenti Strutturati & Pannelli → Airtable DESIGN.md (color-tokens meaningful)
```

ELAB brand "Affidabile / Didattico / Accogliente" = Andrea iter 8 confirmed. NO Lego-Education / Khan-Academy DESIGN.md exists upstream — submit request getdesign.md/request "educational/classroom 8-14".

### P2.2 SELECTIVE-EXTRACT 4 files everything-claude-code (NO full install)

```
~/.claude/rules/ecc/agentshield.md           # security scanner Supabase keys/Vercel tokens
~/.claude/skills/ecc/cost-aware-llm-pipeline # adapted Gemini 70/25/5 routing
~/.claude/commands/ecc/harness-audit.md      # monthly G45 audit
~/.claude/skills/ecc/instinct-import         # session-summaries → auto-loaded rules
```

NOT full install — README warns plugin+full installer collide regression risk.

---

## §5 SKIP definitivi

- **andrej-karpathy-skills**: testual già in CLAUDE.md (4 principles Think/Simple/Surgical/Goal-driven). Plugin install zero-net-value.
- **get-shit-done**: 86+ skills overhead +12K token/turn. Overlap 90% con superpowers + agent-teams + claude-mem + ralph-loop + automa-loop. Unless A/B test on Mac Mini multi-day shows STATE.md+HANDOFF.json beats claude-mem corpus → defer.
- **awesome-claude-code main install**: README mid-reorg placeholder TODO. Use as research catalog only, no install.

---

## §6 Onesto gap audit

### Honest caveats

1. **VoltAgent README freshness verified**: 131+ agents 2025-2026 active. awesome-design-md 70 styles + live request mechanism. Picks NOT perfect — closest match to ELAB "kid-friendly + LIM + Italian-pedagogy" gap (no native Khan-Academy/Lego-Education DESIGN.md exists upstream).
2. **everything-claude-code v2.0 RC churn**: maintenance burden chasing release candidates. SELECTIVE 4 files only mitigates.
3. **claude-mem README v6.5 vs installed v12.x**: 6 majors ahead README outdated. Trust local skill manifest, NOT GitHub README.
4. **awesome-claude-code TODO**: top README placeholder mid-reorganization. 5 picks drawn from 2025-2026 ecosystem cross-checked vs ELAB plugin list (NOT all guaranteed in current README listing).
5. **Step-Back Prompting expected R7 lift +8-12pt**: published benchmark range, NOT measured ELAB. Validate iter 41 R7 re-bench post-edit.
6. **MEMORY.md split risk**: rules-glob path matching adds load complexity vs current single file. Backup first.

### NO compiacenza

- 8/12 repo già coperti 80%+ (NOT all "must-have" as some posts inflate)
- ROI HIGH net-new = 4 items only: repomix + superpowers:verification + claude-mem:pathfinder + Step-Back BASE_PROMPT
- Repo bookmark hype ≠ ELAB integration ROI: most listed repos overlap existing 600+ skill plugin installation

---

## §7 Andrea ratify queue iter 41 entrance — repo roadmap items

10. **P0.1 repomix install + 3 commands run** (autonomous, 5 min)
11. **P0.2 Step-Back BASE_PROMPT v3.4 edit** + deploy Edge Function v82 + R7 re-bench (autonomous, 30 min)
12. **P0.3 superpowers:verification Stop hook** wire-up `.claude/settings.json` (5 min)
13. **P0.4 claude-mem:pathfinder + learn-codebase primer** in next sessione long (10 min)
14. **P0.5 MEMORY.md split 5000→200 main + lazy rules** (autonomous, 1-2h)
15. **P1.1-P1.2 Self-Consistency + ReAct** post Step-Back baseline (post P0.2)
16. **P1.5 VoltAgent 3 agents install** marketplace add command
17. **P2.2 4 ECC files cherry-pick** ~/.claude/rules+skills+commands (15 min)

---

## §8 Cross-link

- Audit iter 40 honest: `docs/audits/2026-05-05-iter-40-FINDINGS-honest.md`
- This roadmap: `docs/audits/2026-05-05-12-repo-roadmap-honest.md`
- 5 parallel agent outputs: agent IDs `a82d8c5c..., a24128ff..., a69dfc68..., af7d7d8a..., a0c70b4d...` (sendable via SendMessage)

End 12-repo roadmap synthesis. Andrea: ratify P0.1-P0.5 first (highest ROI, autonomous executable).
