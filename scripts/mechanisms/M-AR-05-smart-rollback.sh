#!/usr/bin/env bash
# M-AR-05 Smart Rollback (iter 31 RALPH DEEP)
# Auto-tag baseline pre-Phase. Append automa/state/baseline-tags.jsonl.
# Rollback: git reset --soft <tag> (NOT --hard, preserve working tree).
#
# Usage:
#   scripts/mechanisms/M-AR-05-smart-rollback.sh tag <phase_n>     # create tag
#   scripts/mechanisms/M-AR-05-smart-rollback.sh rollback <tag>    # soft reset to tag
#   scripts/mechanisms/M-AR-05-smart-rollback.sh list              # list tags
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

REGISTRY="automa/state/baseline-tags.jsonl"
mkdir -p "$(dirname "$REGISTRY")"

CMD="${1:-help}"

case "$CMD" in
  tag)
    PHASE="${2:-unknown}"
    HHMM=$(date +"%H%M")
    TAG="baseline-iter31-phase${PHASE}-${HHMM}"
    COMMIT=$(git rev-parse HEAD)
    TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    if git rev-parse "$TAG" >/dev/null 2>&1; then
      echo "[M-AR-05] tag $TAG already exists, skip"
    else
      git tag "$TAG" "$COMMIT"
      echo "[M-AR-05] created tag $TAG @ $COMMIT"
      echo "{\"ts\":\"$TS\",\"tag\":\"$TAG\",\"commit\":\"$COMMIT\",\"phase\":\"$PHASE\",\"event\":\"created\"}" >> "$REGISTRY"
    fi
    ;;
  rollback)
    TAG="${2:?missing tag arg}"
    if ! git rev-parse "$TAG" >/dev/null 2>&1; then
      echo "[M-AR-05] FATAL: tag $TAG not found" >&2
      exit 1
    fi
    TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    PRE_COMMIT=$(git rev-parse HEAD)
    echo "[M-AR-05] SOFT rollback HEAD ($PRE_COMMIT) -> $TAG (working tree preserved)"
    git reset --soft "$TAG"
    echo "{\"ts\":\"$TS\",\"tag\":\"$TAG\",\"pre_commit\":\"$PRE_COMMIT\",\"post_commit\":\"$(git rev-parse HEAD)\",\"event\":\"rollback_soft\"}" >> "$REGISTRY"
    echo "[M-AR-05] working tree NOT touched; staged changes from rollback range now in index"
    ;;
  list)
    git tag -l 'baseline-iter31-phase*' | sort
    ;;
  *)
    echo "Usage: $0 {tag <phase_n>|rollback <tag>|list}" >&2
    exit 2
    ;;
esac
