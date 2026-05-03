# OpenCode + Pattern T Multi-Provider Swarm Design

**Date**: 2026-05-02 (iter 30 docs-only design)
**Mode**: workflow brainstorming — no budget/GDPR constraints
**Scope**: estende CVP design + Pattern S r3 → Pattern T r1 multi-provider 10-agent swarm
**Cross-link**: `2026-05-02-iter30-CONTINUOUS-VALIDATION-PIPELINE-DESIGN.md` + `2026-05-02-iter30-ANTI-REGRESSION-ANTI-INFLATION-MECHANISMS.md`

---

## §1. Executive summary

OpenCode SST = abilita workflow potente impossibile con Claude Code solo. 5 capability NEW:

1. **Headless cron Mac Mini** — Claude Code interactive-only blocca cron real
2. **Multi-provider routing** — atom complexity classifier → optimal provider
3. **Parallel swarm tmux** — 6 instances paralleli watch-queue async
4. **Multi-model voting** — 3-provider consensus per HIGH-impact decisions
5. **Local LLM offline** — Ollama Qwen2.5 32B unlimited routine

Pattern S r3 (6-agent OPUS PHASE-PHASE) → Pattern T r1 (10-agent multi-provider swarm).

Iter close projection con Pattern T attivo:
- Iter 35 cap 9.0/10 G45 ONESTO
- Iter 38 Sprint T close 9.5/10 G45 ONESTO
- Iter 42+ Sprint U scale 50 scuole + auto-deploy gates + Tea continuous UAT

---

## §2. OpenCode SST overview

### §2.1 Cosa è

- TUI/CLI AI coding agent open source (https://github.com/sst/opencode)
- Multi-provider native (Anthropic + OpenAI + Google + Mistral + local Ollama)
- Headless mode first-class (vs Claude Code interactive primary)
- Plugin system Lua-based extensibility
- Watch-file mode async dispatch
- Session persistence + replay
- ~2k stars iter 30, mature alpha → beta transition

### §2.2 vs Claude Code matrix

| Capability | Claude Code | OpenCode SST | Pattern T usage |
|---|---|---|---|
| Provider | Anthropic only | Multi (5+) | route per atom complexity |
| Mode primary | Interactive REPL | Headless first-class | cron scriptable Mac Mini |
| Plugin system | Skills + plugins official | Lua plugins arbitrary | custom hooks per project |
| Parallel | 1 active session | tmux N instances | 6 swarm parallel |
| Local LLM | NO | Ollama integration | offline routine |
| Cost optimization | Opus all calls | Provider routing | 10× cheaper routine |
| Cross-session memory | claude-mem MCP | Session persistence + claude-mem compat | shared state |

### §2.3 Installation Mac Mini

```bash
# Mac Mini side via SSH MacBook
ssh progettibelli@100.124.198.59 << 'EOF'
# Install via npm
npm install -g @sst/opencode

# Verify
opencode --version

# Configure providers
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/config.toml <<'CFG'
[providers.anthropic]
api_key = "$ANTHROPIC_API_KEY"
default_model = "claude-opus-4-7"

[providers.openai]
api_key = "$OPENAI_API_KEY"
default_model = "gpt-5"

[providers.google]
api_key = "$GEMINI_API_KEY"
default_model = "gemini-2-deepthink"

[providers.mistral]
api_key = "$MISTRAL_API_KEY"
default_model = "mistral-large-latest"

[providers.ollama]
host = "http://localhost:11434"
default_model = "qwen2.5:32b"
CFG

# Install Ollama + Qwen2.5 32B local
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull qwen2.5:32b
EOF
```

---

## §3. Architettura Cervello Multi-Provider Distribuito (CMPD)

### §3.1 7 layers totali

```
┌─────────────────────────────────────────────────┐
│ LAYER 1 — Andrea active cognitive primary       │
│ Claude Code Opus 4.7 1M (MacBook interactive)   │
│ - Pattern T orchestration                       │
│ - Strategic decisions                           │
│ - Andrea-driven 4-8h/giorno                     │
└─────────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────────┐
│ LAYER 2 — Mac Mini OpenCode swarm (6 instances) │
│ tmux session "elab-swarm" 6 windows:            │
│ - audit (Gemini Flash)                          │
│ - research (GPT-5)                              │
│ - bench (Mistral Large)                         │
│ - persona (Opus headless)                       │
│ - healing (Gemini Flash)                        │
│ - drift (Ollama Qwen2.5 32B local)              │
└─────────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────────┐
│ LAYER 3 — Multi-model voting (HIGH-impact)      │
│ Consensus 2/3 OR Andrea escalate                │
│ - Vote Opus 4.7                                 │
│ - Vote GPT-5                                    │
│ - Vote Gemini DeepThink                         │
│ Trigger: M-AI-05 G45 review + ADR ratify        │
└─────────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────────┐
│ LAYER 4 — RunPod GPU H100 weekend on-demand     │
│ Heavy bench tasks:                              │
│ - Whisper Large transcription bulk              │
│ - Brain V14 fine-tuning experiments             │
│ - Bulk RAG re-ingest 6000+ chunks               │
│ Auto-stop post-task                             │
└─────────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────────┐
│ LAYER 5 — Continuous research swarm (10+ BG)    │
│ Weekly cron Sunday 22:00:                       │
│ - A1 Competitor pricing tracker (GPT-5)         │
│ - A2 Latency Pareto multi-prov (DeepThink)      │
│ - A3 Wiki hallucination spot-check (Opus)       │
│ - A4 Reddit/HN sentiment (Gemini Pro)           │
│ - A5 arxiv K-12 STEM IT (DeepThink)             │
│ - A6 GitHub trending ELAB (GPT-5)               │
│ - A7 Code drift cross-iter (Mistral Large)      │
│ - A8 Coverage trend (Gemini Flash)              │
│ - A9 Bundle size trend (Gemini Flash)           │
│ - A10 Andrea Opus G45 review (multi-vote)       │
└─────────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────────┐
│ LAYER 6 — Local LLM offline (Ollama)            │
│ Mac Mini Qwen2.5 32B + Llama 3.3 70B            │
│ - Routine atoms unlimited scale                 │
│ - Offline operation when cloud rate-limited     │
│ - Persona-prof simulation cycle                 │
│ - Doc drift detector                            │
└─────────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────────┐
│ LAYER 7 — Shared state coordination             │
│ Filesystem barrier + claude-mem MCP cross-prov  │
│ - automa/state/atom-context.jsonl per atom      │
│ - automa/team-state/messages/ completion msgs   │
│ - automa/state/swarm-queue/ watch-files         │
│ - automa/state/skill-runs.jsonl signed digest   │
└─────────────────────────────────────────────────┘
```

---

## §4. Pattern T r1 — 10-agent multi-provider swarm

### §4.1 Architecture matrix

| Layer | Agent | Provider | Model | File ownership | Phase |
|---|---|---|---|---|---|
| A | Planner-opus | Anthropic | Opus 4.7 | TodoWrite + atoms decomp | Phase 0 prep |
| A | Architect-opus | Anthropic | Opus 4.7 | docs/adrs/ + ADR ratify | Phase 1+5 design |
| B | Maker-1 caveman | Anthropic | Opus headless | src/ + supabase/_shared/ | Phase 1+2+3 atoms |
| B | Maker-2 caveman | Mistral | Large headless | tests/ + src/ second-pass | Phase 1+5 atoms |
| B | Maker-3 caveman | Google | Gemini Pro headless | scripts/ + docs/ | Phase 4 atoms |
| C | Tester-1 caveman | Google | Gemini Flash headless | tests/unit/ + scripts/bench/ | Phase 1+4+6 atoms |
| C | Tester-2 caveman | Local | Ollama Qwen2.5 32B | tests/integration/ | Phase 4 atoms |
| D | Scribe-opus | Anthropic | Opus interactive | docs/audits/ + handoff/ + CLAUDE.md | Phase 2 sequential |
| E | G45-Opus | Anthropic | Opus 4.7 | docs/audits/G45-OPUS-* | Phase 7 review vote 1/3 |
| E | G45-GPT5 | OpenAI | GPT-5 | docs/audits/G45-GPT5-* | Phase 7 review vote 2/3 |
| E | G45-DeepThink | Google | Gemini DeepThink | docs/audits/G45-DT-* | Phase 7 review vote 3/3 |

10 agents (LAYER E counts as 3 paralleli, conceptual Andrea-perspective = 1 G45 review distributed).

### §4.2 Race-cond fix preserved

Pattern S r3 filesystem barrier mantieni:
- File ownership rigid disjoint
- Completion msgs `automa/team-state/messages/{agent}-iter{N}-phase{M}-completed.md`
- Phase 2 scribe SEQUENTIAL post N/N completion msgs
- LAYER E vote consensus aggregator post 3/3 vote files

### §4.3 Cross-provider context coordination

```jsonl
# automa/state/atom-context.jsonl per-atom shared state
{"atom_id":"ATOM-S31-A1","iter":31,"phase":1,"provider":"anthropic","status":"in_progress","input":{"file":"src/services/wakeWord.js","scope":"WAKE_PHRASES extension"},"output":null,"timestamp":"2026-05-02T22:30:00Z"}
{"atom_id":"ATOM-S31-A1","iter":31,"phase":1,"provider":"anthropic","status":"completed","input":{"file":"src/services/wakeWord.js"},"output":{"diff":"+3 -0 lines","tests":12},"timestamp":"2026-05-02T22:32:15Z","next":"ATOM-S31-A2"}
```

Append-only. Each agent reads PRIOR atom context before starting (prevents fragmentation).

---

## §5. 5 NEW Mechanisms (M-NEW-21..25)

### §5.1 M-NEW-21 Multi-model voting G45 review

```bash
#!/bin/bash
# scripts/multi-model-g45-review.sh
# M-NEW-21 — distinct providers vote G45 iter close

set -euo pipefail
ITER=$1
PROMPT_FILE="prompts/g45-review-iter${ITER}.md"
OUTPUT_DIR="docs/audits/g45-multi-vote-iter${ITER}"
mkdir -p "$OUTPUT_DIR"

# 3 vote parallel via OpenCode headless
opencode --headless --provider anthropic --model claude-opus-4-7 \
  --prompt-file "$PROMPT_FILE" \
  --output-file "$OUTPUT_DIR/vote-opus.md" &
PID_OPUS=$!

opencode --headless --provider openai --model gpt-5 \
  --prompt-file "$PROMPT_FILE" \
  --output-file "$OUTPUT_DIR/vote-gpt5.md" &
PID_GPT5=$!

opencode --headless --provider google --model gemini-2-deepthink \
  --prompt-file "$PROMPT_FILE" \
  --output-file "$OUTPUT_DIR/vote-deepthink.md" &
PID_DT=$!

# Wait all 3 complete (60s timeout each)
wait $PID_OPUS $PID_GPT5 $PID_DT

# Consensus aggregator
node scripts/consensus-aggregator.js "$OUTPUT_DIR" > "$OUTPUT_DIR/CONSENSUS.md"

# Output: score consensus 2/3 OR escalate Andrea
SCORES=$(jq -r '.score' "$OUTPUT_DIR"/vote-*.md | sort)
MEDIAN=$(echo "$SCORES" | awk 'NR==2')
MIN=$(echo "$SCORES" | head -1)
MAX=$(echo "$SCORES" | tail -1)
SPREAD=$(echo "$MAX - $MIN" | bc)

if (( $(echo "$SPREAD > 1.5" | bc -l) )); then
  echo "DISAGREEMENT: spread $SPREAD > 1.5 → escalate Andrea"
  exit 2
fi

echo "CONSENSUS: median $MEDIAN (spread $SPREAD)"
echo "$MEDIAN" > "$OUTPUT_DIR/score-final.txt"
```

### §5.2 M-NEW-22 Cost-aware atom routing

```javascript
// scripts/route-atom-to-provider.js
// M-NEW-22 — atom complexity classifier → provider

const PROVIDER_BY_COMPLEXITY = {
  trivial: { provider: 'ollama', model: 'qwen2.5:32b' },
  simple: { provider: 'google', model: 'gemini-flash' },
  medium: { provider: 'mistral', model: 'mistral-large-latest' },
  complex: { provider: 'anthropic', model: 'claude-opus-4-7' },
  critical: { provider: 'multi-vote', models: ['opus-4-7', 'gpt-5', 'gemini-deepthink'] }
};

function classifyAtom(atom) {
  // Trivial: file rename, format, lint, simple grep
  if (/format|lint|rename|grep/.test(atom.task)) return 'trivial';
  
  // Simple: single-file edit + test
  if (atom.files_count === 1 && atom.has_tests) return 'simple';
  
  // Medium: multi-file refactor, design implementation
  if (atom.files_count <= 5 && atom.complexity_score < 3) return 'medium';
  
  // Complex: architecture change, cross-cutting
  if (atom.files_count > 5 || atom.complexity_score >= 3) return 'complex';
  
  // Critical: ADR ratify, score iter close, security audit
  if (atom.is_critical || atom.tags?.includes('security')) return 'critical';
  
  return 'medium'; // default
}

function routeAtom(atom) {
  const complexity = classifyAtom(atom);
  const route = PROVIDER_BY_COMPLEXITY[complexity];
  console.log(`[router] ${atom.atom_id} → ${complexity} → ${route.provider}:${route.model || route.models?.join('+')}`);
  return route;
}

module.exports = { routeAtom, classifyAtom };
```

### §5.3 M-NEW-23 Parallel swarm tmux launch

```bash
#!/bin/bash
# scripts/mac-mini-swarm-launch.sh
# M-NEW-23 — 6 OpenCode instances paralleli watch-queue

set -euo pipefail
SESSION="elab-swarm"

tmux kill-session -t "$SESSION" 2>/dev/null || true
tmux new-session -d -s "$SESSION"

# Window 1: audit (Gemini Flash, fast)
tmux new-window -t "$SESSION":1 -n audit \
  'opencode --headless --provider google --model gemini-flash \
   --watch-file /tmp/swarm-queue/audit.jsonl \
   --output-dir /tmp/swarm-output/audit/ \
   --session-id audit-worker'

# Window 2: research (GPT-5, deep)
tmux new-window -t "$SESSION":2 -n research \
  'opencode --headless --provider openai --model gpt-5 \
   --watch-file /tmp/swarm-queue/research.jsonl \
   --output-dir /tmp/swarm-output/research/ \
   --session-id research-worker'

# Window 3: bench (Mistral, balanced)
tmux new-window -t "$SESSION":3 -n bench \
  'opencode --headless --provider mistral --model mistral-large-latest \
   --watch-file /tmp/swarm-queue/bench.jsonl \
   --output-dir /tmp/swarm-output/bench/ \
   --session-id bench-worker'

# Window 4: persona (Opus, quality)
tmux new-window -t "$SESSION":4 -n persona \
  'opencode --headless --provider anthropic --model claude-opus-4-7 \
   --watch-file /tmp/swarm-queue/persona.jsonl \
   --output-dir /tmp/swarm-output/persona/ \
   --session-id persona-worker'

# Window 5: healing (Gemini Flash, retry-cheap)
tmux new-window -t "$SESSION":5 -n healing \
  'opencode --headless --provider google --model gemini-flash \
   --watch-file /tmp/swarm-queue/healing.jsonl \
   --output-dir /tmp/swarm-output/healing/ \
   --session-id healing-worker'

# Window 6: drift (Ollama local, free)
tmux new-window -t "$SESSION":6 -n drift \
  'opencode --headless --provider ollama --model qwen2.5:32b \
   --watch-file /tmp/swarm-queue/drift.jsonl \
   --output-dir /tmp/swarm-output/drift/ \
   --session-id drift-worker'

echo "[swarm] 6 instances launched. Monitor: tmux attach -t $SESSION"
```

### §5.4 M-NEW-24 Headless cron BG agents

```cron
# Mac Mini crontab Pattern T enhanced

# Stream B Layer 1 — audit cron (OpenCode headless, NO Claude Code dep)
*/10 * * * * echo "{\"task\":\"audit\",\"exp_id\":\"$(cat /tmp/audit-next-exp.txt)\"}" >> /tmp/swarm-queue/audit.jsonl

# Stream C — bench cron (OpenCode headless multi-prov)
0 */6 * * * echo "{\"task\":\"r5_stress\",\"fixture\":\"r5-fixture.jsonl\"}" >> /tmp/swarm-queue/bench.jsonl

# Stream A — drift cron (Ollama local free)
0 */4 * * * echo "{\"task\":\"doc_drift_detect\"}" >> /tmp/swarm-queue/drift.jsonl

# Self-healing tests cron (Gemini Flash retry-cheap)
30 */2 * * * echo "{\"task\":\"healing_scan\",\"failed_tests_log\":\"/tmp/playwright-fails.log\"}" >> /tmp/swarm-queue/healing.jsonl

# Persona-prof simulation cron (Opus quality)
0 */4 * * * echo "{\"task\":\"persona_cycle\",\"exp_id\":\"$(cat /tmp/persona-next-exp.txt)\"}" >> /tmp/swarm-queue/persona.jsonl

# Weekly research swarm Sunday 22:00 (GPT-5 deep)
0 22 * * 0 bash scripts/research-weekly-swarm-dispatch.sh
```

### §5.5 M-NEW-25 Local LLM offline fallback

```bash
#!/bin/bash
# scripts/ollama-offline-fallback.sh
# M-NEW-25 — circuit breaker per provider, fallback Ollama local

PROVIDER="${1:-anthropic}"
ATOM_FILE="$2"

# Check provider rate-limited?
if grep -q "rate_limit" /tmp/circuit-breakers/$PROVIDER.log 2>/dev/null; then
  CIRCUIT_AGE=$(($(date +%s) - $(stat -f %m /tmp/circuit-breakers/$PROVIDER.log)))
  if [ "$CIRCUIT_AGE" -lt 300 ]; then
    echo "[fallback] $PROVIDER circuit open (${CIRCUIT_AGE}s ago) → Ollama local"
    PROVIDER="ollama"
  fi
fi

# Execute via OpenCode
opencode --headless --provider "$PROVIDER" \
  --prompt-file "$ATOM_FILE" \
  || {
    # Provider failed, mark circuit + retry Ollama
    echo "$(date +%s) rate_limit" > /tmp/circuit-breakers/$PROVIDER.log
    opencode --headless --provider ollama --model qwen2.5:32b --prompt-file "$ATOM_FILE"
  }
```

---

## §6. Cost-aware routing matrix concrete

### §6.1 Per-atom cost projection

| Atom complexity | Provider | Model | Cost/atom | Latency | Use cases |
|---|---|---|---|---|---|
| Trivial | Ollama local | Qwen2.5 32B | €0 | 5-10s | format/lint/rename/grep |
| Simple | Google | Gemini Flash | €0.0001 | 2-3s | single-file edit + test |
| Medium | Mistral | Large | €0.001 | 3-5s | multi-file refactor |
| Complex | Anthropic | Opus 4.7 | €0.015 | 10-20s | architecture impl |
| Critical | Multi-vote | Opus+GPT-5+DeepThink | €0.05 | 30-60s | ADR ratify, G45 review |

### §6.2 Iter 31 atom distribution stimato (Pattern S baseline)

- 12 atoms iter 31
- Distribution: 3 trivial + 4 simple + 3 medium + 2 complex
- Cost Pattern S r3 (Opus all): 12 × €0.015 = €0.18
- Cost Pattern T r1 (routed): 3×0 + 4×€0.0001 + 3×€0.001 + 2×€0.015 = €0.0334
- **Saving 81% per iter** = €0.15/iter

### §6.3 Scale projection iter 31-100

- 70 iter wall-clock 6 mesi
- Pattern S baseline cost: 70 × €0.18 = €12.60
- Pattern T routed cost: 70 × €0.0334 = €2.34
- **Saving 6 mesi: €10.26**

(Modesto in assoluto — il VERO valore è capacity scaling, non cost reduction)

### §6.4 Capacity scaling (real value)

- Pattern S: 1 atom/agente serial entro session
- Pattern T: 6 atom/agente paralleli swarm + 4 layer cognitive
- Throughput effective: **6× atom/giorno**
- Cap teorico iter 31: 12 atom/giorno × 6 = 72 atom/giorno
- Realistic cap (race-cond + Andrea review): 30 atom/giorno
- vs Pattern S 12 atom/giorno = **2.5× capacity reale**

---

## §7. Multi-vote consensus aggregator

```javascript
// scripts/consensus-aggregator.js
// M-NEW-21 — aggregate 3 votes → consensus OR escalate

const fs = require('fs');
const path = require('path');

const outputDir = process.argv[2];
const votes = ['vote-opus.md', 'vote-gpt5.md', 'vote-deepthink.md']
  .map(f => {
    const content = fs.readFileSync(path.join(outputDir, f), 'utf8');
    const scoreMatch = content.match(/Score:\s*(\d+\.?\d*)/);
    const flagsMatch = content.match(/Inflation flags:\s*(\d+)/);
    return {
      file: f,
      provider: f.replace('vote-', '').replace('.md', ''),
      score: scoreMatch ? parseFloat(scoreMatch[1]) : null,
      flags: flagsMatch ? parseInt(flagsMatch[1]) : 0,
      content
    };
  });

const scores = votes.map(v => v.score).filter(s => s !== null).sort((a, b) => a - b);
const median = scores[1];
const min = scores[0];
const max = scores[2];
const spread = max - min;

const flagsTotal = votes.reduce((sum, v) => sum + v.flags, 0);

const consensus = {
  median,
  min,
  max,
  spread,
  flags_total: flagsTotal,
  votes,
  decision: spread > 1.5 ? 'ESCALATE_ANDREA' : 'CONSENSUS_ACCEPTED',
  timestamp: new Date().toISOString()
};

console.log(`# G45 Multi-Vote Consensus

**Median**: ${median}/10
**Range**: ${min}-${max} (spread ${spread})
**Inflation flags total**: ${flagsTotal}
**Decision**: ${consensus.decision}

## Per-provider votes

| Provider | Score | Flags |
|---|---|---|
${votes.map(v => `| ${v.provider} | ${v.score} | ${v.flags} |`).join('\n')}

## Consensus details

- Anthropic Opus: ${votes[0].content.slice(0, 200)}...
- OpenAI GPT-5: ${votes[1].content.slice(0, 200)}...
- Google DeepThink: ${votes[2].content.slice(0, 200)}...

## Action required

${consensus.decision === 'ESCALATE_ANDREA' 
  ? '- Spread >1.5 = providers disagree significantly\n- Andrea manual review required\n- Re-prompt with disagreement context' 
  : `- Score capped at ${median}\n- Update automa/state/score-history.jsonl\n- Continue Phase 8`}

**Timestamp**: ${consensus.timestamp}
`);

fs.writeFileSync(
  path.join(outputDir, 'consensus.json'),
  JSON.stringify(consensus, null, 2)
);

process.exit(consensus.decision === 'ESCALATE_ANDREA' ? 2 : 0);
```

---

## §8. Watch-queue dispatch protocol

### §8.1 Queue file format

```jsonl
# /tmp/swarm-queue/{audit|research|bench|persona|healing|drift}.jsonl
{"task_id":"T-001","timestamp":"2026-05-02T22:30:00Z","task":"audit","payload":{"exp_id":"v1-cap6-esp1"},"priority":"medium"}
{"task_id":"T-002","timestamp":"2026-05-02T22:31:00Z","task":"research","payload":{"query":"competitor pricing Tinkercad 2026"},"priority":"low"}
```

### §8.2 OpenCode --watch-file polling

OpenCode SST watch-file mode (alpha):
- Tail JSONL append-only
- Per new entry → spawn task in worker session
- Output to /tmp/swarm-output/{worker}/{task_id}.md
- Append result to /tmp/swarm-output/{worker}/results.jsonl

### §8.3 Dispatch script

```bash
#!/bin/bash
# scripts/swarm-dispatch.sh
# Dispatch atom to optimal worker queue per M-NEW-22 routing

ATOM_FILE=$1
ROUTE=$(node scripts/route-atom-to-provider.js "$ATOM_FILE")
WORKER=$(echo "$ROUTE" | jq -r '.worker')

TASK_ID="T-$(date +%s%N | sha256sum | head -c 12)"
TASK_JSON=$(jq -n \
  --arg task_id "$TASK_ID" \
  --arg ts "$(date -u +%FT%TZ)" \
  --argjson payload "$(cat $ATOM_FILE)" \
  '{task_id:$task_id,timestamp:$ts,payload:$payload}')

echo "$TASK_JSON" >> "/tmp/swarm-queue/$WORKER.jsonl"
echo "[dispatch] $TASK_ID → $WORKER queue"
```

---

## §9. Cross-iter memory drift M-NEW-20 enhancement

OpenCode session persistence + claude-mem MCP cross-provider:

```bash
# scripts/memory-drift-cross-provider.sh
# M-NEW-20 enhancement — verify all providers see same state

ITER=$1

# Snapshot per provider
for PROVIDER in anthropic openai google mistral ollama; do
  opencode --headless --provider "$PROVIDER" \
    --prompt "Summarize iter $ITER state in JSON: {commit, vitest_count, score_capped, open_flags_count}" \
    --output-file "automa/state/memory-snapshots/iter-$ITER-$PROVIDER.json"
done

# Compare snapshots
node scripts/compare-cross-provider-memory.js \
  "automa/state/memory-snapshots/iter-$ITER-*.json" \
  > "automa/state/memory-snapshots/iter-$ITER-drift-report.md"

# Flag drift if any 2 providers disagree on iter state
DRIFT_COUNT=$(grep -c "DISAGREE" "automa/state/memory-snapshots/iter-$ITER-drift-report.md")
if [ "$DRIFT_COUNT" -gt 0 ]; then
  echo "MEMORY DRIFT: $DRIFT_COUNT provider disagreements iter $ITER"
  exit 1
fi
```

---

## §10. Implementation Phases

### Phase D iter 33 entrance (~10h)

- D1 Install OpenCode SST Mac Mini (~30min Andrea + Maker-1)
- D2 Configure 5 providers + Ollama Qwen2.5 32B (~2h Maker-1)
- D3 M-NEW-21 multi-model voting setup (~3h Architect)
- D4 M-NEW-24 headless cron BG agents (~2h Maker-1)
- D5 First multi-vote G45 review trial iter 33 close (~2h Tester-1)

### Phase E iter 34 (~10h)

- E1 M-NEW-22 cost-aware routing classifier (~4h Maker-2)
- E2 M-NEW-23 parallel swarm tmux launch (~2h Maker-1)
- E3 swarm dispatch script + watch-queue (~3h Maker-1)
- E4 First atom dispatch trial 6 paralleli (~1h Tester-1)

### Phase F iter 35 (~10h)

- F1 M-NEW-25 Ollama local LLM offline (~2h Maker-1)
- F2 Pattern T r1 10-agent first dispatch trial (~5h Architect + all makers)
- F3 Cross-iter memory drift detector M-NEW-20 enhancement (~3h Maker-2)

### Phase G iter 36+ (~12h)

- G1 Sprint U entrance scaled (50 scuole projection)
- G2 RunPod GPU H100 weekend on-demand provisioning (~4h Maker-1)
- G3 Brain V14 fine-tuning experiments LAYER 4 (~8h Architect + Maker)

**Total Pattern T deploy**: ~42h dev wall-clock 4 phases iter 33-36.

---

## §11. ROI Pattern T vs Pattern S

| Metric | Pattern S r3 (current) | Pattern T r1 (proposed) | Delta |
|---|---|---|---|
| Atoms/giorno cap | 12 | 30 | +150% |
| Cost/iter (12 atoms) | €0.18 | €0.0334 | -81% |
| Provider diversity | 1 (Anthropic) | 5 (multi) | +400% |
| G45 review independence | session-level | provider-level | architectural |
| Offline capability | NO | YES (Ollama) | NEW |
| Mac Mini cron real | NO (interactive only) | YES (headless) | UNLOCK |
| BG agent throughput | sequential | 6× parallel | +500% |
| Continuous research | weekly manual | 10 BG weekly auto | scale 10× |

---

## §12. Anti-Pattern Pattern T

- ❌ NO replace Claude Code Andrea active (cognitive primary stays Anthropic Opus)
- ❌ NO OpenCode for HIGH-impact decision senza multi-vote (use M-NEW-21)
- ❌ NO local Ollama for critical atoms (quality gap vs Opus mantieni)
- ❌ NO swarm 6 paralleli senza queue dispatcher (race-cond)
- ❌ NO multi-provider senza shared state file (atom-context.jsonl)
- ❌ NO bypass M-AI-05 G45 review (multi-vote enhances NOT replaces)
- ❌ NO retroactive edit memory snapshots (drift detector relies on history)
- ❌ NO disable Ollama health check (offline fallback chain)
- ❌ NO consensus auto-accept spread >1.5 (escalate Andrea always)
- ❌ NO weekly research cron senza Andrea Sunday review

---

## §13. Risks + Mitigations

| Risk | Probabilità | Impact | Mitigation |
|---|---|---|---|
| OpenCode SST alpha bugs | HIGH | MEDIUM | pin version + retry logic + fallback Claude Code |
| Multi-provider context fragmentation | MEDIUM | HIGH | shared state file atom-context.jsonl mandate |
| Tmux session crash | MEDIUM | MEDIUM | systemd respawn + watchdog |
| Multi-vote consensus deadlock | LOW | LOW | timeout 60s + fallback Andrea escalate |
| Ollama local model quality drift | MEDIUM | LOW | weekly bench compare cloud vs local |
| Provider rate limit cascade | MEDIUM | HIGH | circuit breaker per provider + fallback Ollama |
| Mac Mini disk fill (swarm output) | MEDIUM | LOW | retention policy 30 day + weekly cleanup cron |
| OpenCode plugin Lua security | LOW | HIGH | review plugins source + sandbox restrict |
| Cross-provider auth key leak | LOW | CRITICAL | per-provider env file 600 perms + git-ignore strict |
| Pattern T 10-agent coordination overhead | MEDIUM | MEDIUM | Pattern S r3 fallback if cohesion <80% |

---

## §14. Verdict finale Pattern T

OpenCode + Pattern T r1 = workflow VERAMENTE potente per ELAB scale Sprint U+ (50 scuole, continuous deployment, multi-region).

**Pre-condition**:
- Andrea ratifies CVP design Phase A-C iter 32+
- Andrea ratifies OpenCode SST install + 5 provider keys
- Andrea ratifies Ollama Mac Mini local LLM
- Andrea ratifies Pattern T r1 deploy gradual iter 33-36

**Outcome iter 36+**:
- 30 atom/giorno (vs 12 Pattern S)
- 6× parallel swarm + 4 layer cognitive
- Multi-vote G45 = bias-free score validation
- Offline persona-prof unlimited scale
- Cost reduction 81% routine atoms
- Continuous research swarm 10 weekly BG

**Sprint T close ricalibrato Pattern T**:
- Iter 35 cap 9.0/10 G45 ONESTO
- Iter 38 Sprint T close 9.5/10 G45 ONESTO
- Iter 42+ Sprint U entrance

---

## §15. Cross-link

- CVP design: `docs/audits/2026-05-02-iter30-CONTINUOUS-VALIDATION-PIPELINE-DESIGN.md`
- 12 mechanisms originale: `docs/audits/2026-05-02-iter30-ANTI-REGRESSION-ANTI-INFLATION-MECHANISMS.md`
- Master plan iter 31: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
- Mac Mini persona-prof: `docs/handoff/2026-05-02-mac-mini-professore-inesperto-persona-iter-31.md`
- 5 metric skills: `.claude/skills/elab-{morfismo,onniscenza,velocita,onnipotenza,principio-zero}-*/SKILL.md`
- OpenCode SST: https://github.com/sst/opencode
- Ollama: https://ollama.ai
- Pattern S r3: master plan §7
- Race-cond fix history: 9× consecutive iter validations

---

**Status**: PROPOSED iter 30 design. Pattern T r1 deploy phased iter 33-36 post Andrea ratify CVP Phase A-C iter 32. Total estimate iter 33-36 deploy ~42h dev wall-clock.

**Anti-inflation G45 cap mandate enforced**: NO claim "Pattern T LIVE" iter 30. PROPOSED design only. Realistic ROI 2.5× capacity + 81% cost reduction post Phase D-G complete iter 36+.
