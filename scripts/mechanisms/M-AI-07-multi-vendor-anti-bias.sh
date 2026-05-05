#!/usr/bin/env bash
# M-AI-07 Multi-Vendor Anti-Bias Orchestrator (iter 39 Step 1, anti-inflation)
#
# Round 1-6 CEGIS workflow:
#   Round 1: Codex CLI implement briefing
#   Round 2: Gemini Flash deep critique
#   Round 3a: Mistral medium IT K-12 parallel anti-bias
#   Round 3b: Kimi K2.6 256K parallel anti-bias (NEW finding detection)
#   Round 5: Codex CLI iter 2 finalize integrate findings
#   Round 6: Claude session synthesizer LAST WORD (called by orchestrator script — manual for now)
#
# Each vendor call PREPENDS ELAB context preamble (Principio Zero + Morfismo Sense 2).
#
# Outputs aggregated JSON automa/state/m-ai-07-{atom}-{date}.json + per-round /tmp files.
# Wall-clock + cost tracking per round.
#
# Usage:
#   bash scripts/mechanisms/M-AI-07-multi-vendor-anti-bias.sh <atom-name> <briefing-file>

set -euo pipefail

ATOM_NAME="${1:-}"
BRIEFING_FILE="${2:-}"

if [[ -z "$ATOM_NAME" || -z "$BRIEFING_FILE" ]]; then
  echo "Usage: $0 <atom-name> <briefing-file>" >&2
  echo "  atom-name: short identifier (e.g., 'P0-1-pr60-resolve')" >&2
  echo "  briefing-file: markdown file with atom briefing (problem + constraints + acceptance)" >&2
  exit 1
fi

if [[ ! -f "$BRIEFING_FILE" ]]; then
  echo "Error: briefing file not found: $BRIEFING_FILE" >&2
  exit 2
fi

# Verify env vendors loaded (Mistral + Kimi via source ~/.elab-credentials/sprint-s-tokens.env)
if [[ -z "${MISTRAL_API_KEY:-}" ]]; then
  echo "WARN: MISTRAL_API_KEY not loaded — source ~/.elab-credentials/sprint-s-tokens.env" >&2
fi
if [[ -z "${KIMI_API_KEY:-}" ]]; then
  echo "WARN: KIMI_API_KEY not loaded — source ~/.elab-credentials.env" >&2
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
PREAMBLE="$REPO_ROOT/scripts/three-agent/elab-context-preamble.md"
TODAY="$(date -u +%Y-%m-%dT%H-%M-%S)"
OUT_DIR="$REPO_ROOT/automa/state/m-ai-07"
mkdir -p "$OUT_DIR"
OUT_JSON="$OUT_DIR/${ATOM_NAME}-${TODAY}.json"

if [[ ! -f "$PREAMBLE" ]]; then
  echo "Error: ELAB context preamble missing: $PREAMBLE" >&2
  exit 3
fi

PREAMBLE_TEXT="$(cat "$PREAMBLE")"
BRIEFING_TEXT="$(cat "$BRIEFING_FILE")"

echo "M-AI-07 Multi-Vendor Anti-Bias Orchestrator"
echo "==========================================="
echo "atom: $ATOM_NAME"
echo "briefing: $BRIEFING_FILE"
echo "out_json: $OUT_JSON"
echo ""

# Build full prompt with preamble injection
build_prompt() {
  local round_label="$1"
  local extra="$2"
  cat <<EOF
$PREAMBLE_TEXT

---

# Round $round_label — atom: $ATOM_NAME

$BRIEFING_TEXT

$extra
EOF
}

# Round 1 — Codex implement
echo "=== Round 1: Codex implement ==="
ROUND1_FILE="/tmp/m-ai-07-${ATOM_NAME}-r1.txt"
ROUND1_START=$(date +%s)
build_prompt "1 IMPLEMENT" "Output codice implementation per atom. Format pulito + commenti italiani docente." \
  | (codex exec --skip-git-repo-check 2>&1 || true) > "$ROUND1_FILE"
ROUND1_END=$(date +%s)
ROUND1_DURATION=$((ROUND1_END - ROUND1_START))
echo "Round 1 done in ${ROUND1_DURATION}s → $ROUND1_FILE"

# Round 2 — Gemini Flash deep critique
echo "=== Round 2: Gemini Flash deep critique ==="
ROUND2_FILE="/tmp/m-ai-07-${ATOM_NAME}-r2.txt"
ROUND2_START=$(date +%s)
ROUND1_OUT=$(cat "$ROUND1_FILE")
build_prompt "2 DEEP CRITIQUE" "Codex Round 1 output:
$ROUND1_OUT

Output JSON: {decision: accept|revise|reject, findings: [{severity:HIGH|MEDIUM|LOW, file:line, issue, fix}], critical_concern: 80_words}" \
  | (GEMINI_CLI_TRUST_WORKSPACE=true gemini -m gemini-2.5-flash --skip-trust 2>&1 || true) > "$ROUND2_FILE"
ROUND2_END=$(date +%s)
ROUND2_DURATION=$((ROUND2_END - ROUND2_START))
echo "Round 2 done in ${ROUND2_DURATION}s → $ROUND2_FILE"

# Round 3a — Mistral medium IT K-12 anti-bias parallel
echo "=== Round 3a: Mistral medium IT K-12 ==="
ROUND3A_FILE="/tmp/m-ai-07-${ATOM_NAME}-r3a.json"
ROUND3A_START=$(date +%s)
MISTRAL_INPUT="/tmp/m-ai-07-${ATOM_NAME}-mistral-input.md"
build_prompt "3a IT K-12 ANTI-BIAS" "Codex output:
$ROUND1_OUT" > "$MISTRAL_INPUT"
bash "$REPO_ROOT/scripts/three-agent/mistral-review.sh" "$MISTRAL_INPUT" mistral-medium-latest > "$ROUND3A_FILE" 2>&1 || echo "{\"error\":\"mistral_failed\"}" > "$ROUND3A_FILE"
ROUND3A_END=$(date +%s)
ROUND3A_DURATION=$((ROUND3A_END - ROUND3A_START))
echo "Round 3a done in ${ROUND3A_DURATION}s → $ROUND3A_FILE"

# Round 3b — Kimi K2.6 256K anti-bias parallel
echo "=== Round 3b: Kimi K2.6 256K anti-bias ==="
ROUND3B_FILE="/tmp/m-ai-07-${ATOM_NAME}-r3b.json"
ROUND3B_START=$(date +%s)
KIMI_PROMPT=$(build_prompt "3b 256K ANTI-BIAS" "Codex output:
$ROUND1_OUT

Gemini findings:
$(cat "$ROUND2_FILE")

Mistral findings:
$(cat "$ROUND3A_FILE")

Anti-bias check:
1. Did Codex/Gemini/Mistral miss any critical Principio Zero violation?
2. Did they miss Morfismo Sense 2 coerenza issue (kit Omaric / volumi cartacei)?
3. NEW finding non identificato dai 3?
4. Reject consensus if violates CLAUDE.md principi.

Output JSON SOLO: {decision: accept|revise|reject_with_alternative, agreed_with_consensus: bool, new_finding: 80_words, rejected_concerns: [3_bullets], anti_bias_check: 60_words}")
curl -s -X POST "${KIMI_BASE_URL:-https://api.moonshot.ai/anthropic}/v1/messages" \
  -H "x-api-key: ${KIMI_API_KEY:-missing}" \
  -H "content-type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -d "$(jq -nR --arg msg "$KIMI_PROMPT" '{model:"kimi-k2.6",max_tokens:1000,messages:[{role:"user",content:$msg}]}')" 2>&1 \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('content',[{}])[0].get('text','{\"error\":\"kimi_no_content\"}'))" 2>&1 \
  > "$ROUND3B_FILE" || echo "{\"error\":\"kimi_failed\"}" > "$ROUND3B_FILE"
ROUND3B_END=$(date +%s)
ROUND3B_DURATION=$((ROUND3B_END - ROUND3B_START))
echo "Round 3b done in ${ROUND3B_DURATION}s → $ROUND3B_FILE"

# Round 5 — Codex iter 2 finalize integrate findings
echo "=== Round 5: Codex iter 2 finalize ==="
ROUND5_FILE="/tmp/m-ai-07-${ATOM_NAME}-r5.txt"
ROUND5_START=$(date +%s)
build_prompt "5 FINALIZE" "Original Codex Round 1:
$ROUND1_OUT

Findings to integrate:
- Gemini Round 2: $(cat "$ROUND2_FILE" | head -100)
- Mistral Round 3a: $(cat "$ROUND3A_FILE")
- Kimi K2.6 Round 3b anti-bias: $(cat "$ROUND3B_FILE")

Constraints:
- Address ALL HIGH findings
- Address MEDIUM if no fix conflict
- LOW defer iter+1
- If Kimi rejected_consensus → integrate selectively rispetto Principio Zero / Morfismo Sense 2

Output: Final code COMPLETE (no diffs, integrato findings)." \
  | (codex exec --skip-git-repo-check 2>&1 || true) > "$ROUND5_FILE"
ROUND5_END=$(date +%s)
ROUND5_DURATION=$((ROUND5_END - ROUND5_START))
echo "Round 5 done in ${ROUND5_DURATION}s → $ROUND5_FILE"

# Round 6 — Claude session synthesizer (manual / orchestrator delegated)
# Note: Round 6 is performed by the calling Claude session reading aggregate JSON,
# applying Edit tool selectively (NO compiacenza), then commit + push + audit.

# Aggregate JSON output
TOTAL_DURATION=$((ROUND1_DURATION + ROUND2_DURATION + ROUND3A_DURATION + ROUND3B_DURATION + ROUND5_DURATION))

cat > "$OUT_JSON" <<EOF
{
  "atom": "$ATOM_NAME",
  "date": "$TODAY",
  "git_head": "$(cd "$REPO_ROOT" && git rev-parse HEAD)",
  "git_branch": "$(cd "$REPO_ROOT" && git rev-parse --abbrev-ref HEAD)",
  "rounds": {
    "r1_codex_impl": {
      "duration_s": $ROUND1_DURATION,
      "output_file": "$ROUND1_FILE",
      "lines": $(wc -l < "$ROUND1_FILE")
    },
    "r2_gemini_critique": {
      "duration_s": $ROUND2_DURATION,
      "output_file": "$ROUND2_FILE"
    },
    "r3a_mistral_it_k12": {
      "duration_s": $ROUND3A_DURATION,
      "output_file": "$ROUND3A_FILE"
    },
    "r3b_kimi_256k_antibias": {
      "duration_s": $ROUND3B_DURATION,
      "output_file": "$ROUND3B_FILE"
    },
    "r5_codex_iter2_finalize": {
      "duration_s": $ROUND5_DURATION,
      "output_file": "$ROUND5_FILE",
      "lines": $(wc -l < "$ROUND5_FILE")
    },
    "r6_claude_last_word": "pending — orchestrator Claude session reads aggregate + applies Edit selectively + commits"
  },
  "metrics": {
    "total_wall_clock_s": $TOTAL_DURATION,
    "wall_clock_target_s": 180,
    "cost_estimate_usd": "0.005-0.015",
    "vendors_called": 4
  },
  "next_action": "Claude session reads $OUT_JSON + Round 5 output, applies Edit tool, commits with audit reference",
  "orchestrator_version": 1,
  "orchestrator_source": "M-AI-07-multi-vendor-anti-bias.sh"
}
EOF

echo ""
echo "=== M-AI-07 Cycle Complete ==="
echo "atom: $ATOM_NAME"
echo "total wall-clock: ${TOTAL_DURATION}s (target ≤180s)"
echo "round 1 Codex impl:    ${ROUND1_DURATION}s"
echo "round 2 Gemini critic: ${ROUND2_DURATION}s"
echo "round 3a Mistral IT:   ${ROUND3A_DURATION}s"
echo "round 3b Kimi 256K:    ${ROUND3B_DURATION}s"
echo "round 5 Codex iter 2:  ${ROUND5_DURATION}s"
echo ""
echo "aggregate JSON: $OUT_JSON"
echo ""
echo "Round 6 NEXT (Claude session manual): read aggregate + apply Edit + commit + push"

# Exit 0 if total wall-clock under target
if [[ $TOTAL_DURATION -le 300 ]]; then
  exit 0
else
  echo "WARN: wall-clock ${TOTAL_DURATION}s exceeds soft target 300s — review per-round" >&2
  exit 0
fi
