#!/usr/bin/env bash
# cegis-r4-repomix-cross.sh — CEGIS-PLUS Round 4 cross-vendor consistency check
#
# Pattern: dopo R3a Mistral + R3b Kimi parallel critique, feed repomix snapshot
# (compressed XML 60KB) + concatenated findings to Mistral medium for cross-vendor
# alignment check. Catches "vendor missed file X" pattern (e.g. R1 modifies
# useGalileoChat.js but R2 unaware of intentsDispatcher.js coupling iter 31 sync drift).
#
# Time: ~40s / Cost: ~$0.002 / ROI: 8% (catches missed-file class iter 31 sync drift)
#
# Reference:
#   docs/audits/2026-05-05-iter-41-OPTIMAL-WORKFLOW-synthesis.md §4 R4
#
# Usage:
#   bash scripts/mechanisms/cegis-r4-repomix-cross.sh <atom-name>
#
# Output:
#   /tmp/m-ai-07-${ATOM}-r4-cross.json
#   {"alignment_score":0-10, "missed_files":[...], "context_alignment":"...", "override_recommendations":[...]}
#
# Exit codes:
#   0 — pass (alignment ≥6)
#   1 — usage error
#   2 — soft-fail (alignment <6, surface to R6 as RED flag)

set -euo pipefail

ATOM="${1:-}"

if [[ -z "$ATOM" ]]; then
  echo "usage: $0 <atom-name>" >&2
  exit 1
fi

OUT_DIR="automa/state/m-ai-07"
mkdir -p "$OUT_DIR"

# Verify R3 barrier present
if [[ ! -f "automa/team-state/messages/r3-completed.md" ]]; then
  echo "Error: R3 barrier not found — Mistral+Kimi must complete first" >&2
  exit 1
fi

# Step 1: repomix snapshot (compressed XML 60KB)
echo "[R4] repomix snapshot src/ + supabase/ compressed..."
SNAPSHOT="/tmp/m-ai-07-${ATOM}-r4-snapshot.xml"
npx repomix --include "src/services/**,src/components/lavagna/**,supabase/functions/**" \
  --style xml --compress --token-count-tree 5000 \
  --output "$SNAPSHOT" 2>/dev/null || {
    echo "⚠️  repomix not installed — install: npm install -g repomix" >&2
    echo "Skipping R4 cross-vendor check (graceful degrade)" >&2
    echo "{\"alignment_score\":-1,\"skipped\":true,\"reason\":\"repomix not installed\"}" \
      > "$OUT_DIR/${ATOM}-r4-cross.json"
    touch "automa/team-state/messages/r4-completed.md"
    exit 0
  }

# Truncate to 60KB
head -c 60000 "$SNAPSHOT" > "${SNAPSHOT}.trunc"
mv "${SNAPSHOT}.trunc" "$SNAPSHOT"

# Step 2: concatenate R2+R3a+R3b findings
FINDINGS_R2="/tmp/m-ai-07-${ATOM}-r2.json"
FINDINGS_R3A="/tmp/m-ai-07-${ATOM}-r3a.json"
FINDINGS_R3B="/tmp/m-ai-07-${ATOM}-r3b.json"

CONCATENATED="/tmp/m-ai-07-${ATOM}-r4-input.txt"
{
  echo "## SNAPSHOT (repomix compressed XML, 60KB max)"
  cat "$SNAPSHOT"
  echo ""
  echo "## R2 GEMINI CRITIQUE"
  cat "$FINDINGS_R2" 2>/dev/null || echo "(missing)"
  echo ""
  echo "## R3a MISTRAL IT K-12"
  cat "$FINDINGS_R3A" 2>/dev/null || echo "(missing)"
  echo ""
  echo "## R3b KIMI 256K"
  cat "$FINDINGS_R3B" 2>/dev/null || echo "(missing)"
} > "$CONCATENATED"

# Step 3: Mistral medium cross-vendor review
PROMPT="Sei un reviewer cross-vendor ELAB Tutor. Hai ricevuto:
1. Snapshot codice (repomix compressed XML)
2. R2 Gemini critique
3. R3a Mistral IT K-12 critique
4. R3b Kimi 256K critique

Compito: identifica file/symbol mancanti che NESSUNO dei tre critici ha menzionato MA che sono toccati indirettamente dal change.

Output JSON STRICT:
{
  \"alignment_score\": 0-10 (10 = perfetta consistenza, 0 = vendor in disaccordo),
  \"missed_files\": [\"path/to/file.ext:line\", ...],
  \"context_alignment\": \"breve descrizione\",
  \"override_recommendations\": [\"raccomandazione 1\", ...]
}"

if [[ -z "${MISTRAL_API_KEY:-}" ]]; then
  echo "⚠️  MISTRAL_API_KEY not set — skip R4" >&2
  echo "{\"alignment_score\":-1,\"skipped\":true,\"reason\":\"MISTRAL_API_KEY missing\"}" \
    > "$OUT_DIR/${ATOM}-r4-cross.json"
  touch "automa/team-state/messages/r4-completed.md"
  exit 0
fi

CONTENT=$(cat "$CONCATENATED")
RESPONSE=$(curl -s -X POST "https://api.mistral.ai/v1/chat/completions" \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n \
    --arg model "mistral-medium-latest" \
    --arg sys "$PROMPT" \
    --arg usr "$CONTENT" \
    '{model: $model, messages: [{role:"system",content:$sys},{role:"user",content:$usr}], max_tokens: 800, temperature: 0.3, response_format: {type: "json_object"}}')" \
  2>&1)

# Extract content
CONTENT_OUT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content // empty' 2>/dev/null || echo "")

if [[ -z "$CONTENT_OUT" ]]; then
  echo "⚠️  R4 Mistral call failed — graceful degrade" >&2
  echo "{\"alignment_score\":-1,\"skipped\":true,\"reason\":\"mistral API failed\",\"raw\":$(echo "$RESPONSE" | jq -c '.' 2>/dev/null || echo '{}')}" \
    > "$OUT_DIR/${ATOM}-r4-cross.json"
  touch "automa/team-state/messages/r4-completed.md"
  exit 0
fi

# Save output
echo "$CONTENT_OUT" > "$OUT_DIR/${ATOM}-r4-cross.json"
touch "automa/team-state/messages/r4-completed.md"

# Decision gate
ALIGNMENT=$(echo "$CONTENT_OUT" | jq -r '.alignment_score // -1')

if [[ "$ALIGNMENT" -ge 6 ]] 2>/dev/null; then
  echo "[R4 PASS] alignment=$ALIGNMENT"
  exit 0
elif [[ "$ALIGNMENT" -lt 0 ]] 2>/dev/null; then
  echo "[R4 SKIPPED]"
  exit 0
else
  echo "⚠️  [R4 SOFT-FAIL] alignment=$ALIGNMENT <6 — surface to R6 as RED flag"
  exit 2
fi
