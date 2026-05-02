#!/usr/bin/env bash
# Iter 41 Phase E Task E2 — pdftotext per-page extraction
# Plan §Phase E ADR-034 Path B (poppler-utils CLI).
# Output: per-page text files preserving printed page numbers.

set -eo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PDF_DIR="$REPO_ROOT/../../CONTENUTI/volumi-pdf"
OUT_DIR="$REPO_ROOT/scripts/bench/output/rag-pages"

mkdir -p "$OUT_DIR"

# Volume → PDF + printed_offset (parallel arrays; macOS bash 3.2 compat).
# Offset values from manual inspection covers/ToC; iter 42+ refine with calibration.
VOL_NAMES=(vol1 vol2 vol3)
VOL_PDFS=("VOL1_ITA_ COMPLETO V.0.1 GP.pdf" "VOL2_ITA_COMPLETO GP V 0.1.pdf" "Manuale VOLUME 3 V0.8.1.pdf")
VOL_OFFSETS=(8 6 4)

for IDX in 0 1 2; do
  VOL="${VOL_NAMES[$IDX]}"
  PDF_NAME="${VOL_PDFS[$IDX]}"
  PRINTED_OFFSET="${VOL_OFFSETS[$IDX]}"
  PDF_PATH="$PDF_DIR/$PDF_NAME"
  if [ ! -f "$PDF_PATH" ]; then
    echo "[$VOL] SKIP — PDF not found: $PDF_PATH"
    continue
  fi

  # Total page count
  TOTAL=$(pdfinfo "$PDF_PATH" 2>/dev/null | awk '/^Pages:/ {print $2}')
  echo "[$VOL] $TOTAL PDF pages, printed_offset=$PRINTED_OFFSET"

  # Per-page text extraction with -layout preservation
  for ((PDF_PAGE=1; PDF_PAGE<=TOTAL; PDF_PAGE++)); do
    PRINTED_PAGE=$((PDF_PAGE - PRINTED_OFFSET))
    if [ $PRINTED_PAGE -lt 1 ]; then
      # Pre-content (cover/ToC) — still extract, mark printed_page=null
      OUT_FILE="$OUT_DIR/${VOL}_pdf${PDF_PAGE}_pre.txt"
    else
      OUT_FILE="$OUT_DIR/${VOL}_pdf${PDF_PAGE}_p${PRINTED_PAGE}.txt"
    fi
    pdftotext -layout -f "$PDF_PAGE" -l "$PDF_PAGE" "$PDF_PATH" "$OUT_FILE" 2>/dev/null || true
  done
  echo "[$VOL] DONE — extracted $TOTAL pages to $OUT_DIR/${VOL}_*.txt"
done

echo
echo "=== Page extraction summary ==="
for VOL in vol1 vol2 vol3; do
  COUNT=$(ls "$OUT_DIR"/${VOL}_*.txt 2>/dev/null | wc -l | tr -d ' ')
  PRINTED_COUNT=$(ls "$OUT_DIR"/${VOL}_*_p*.txt 2>/dev/null | wc -l | tr -d ' ')
  echo "  $VOL: $COUNT total ($PRINTED_COUNT with printed_page metadata)"
done
