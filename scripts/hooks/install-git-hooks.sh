#!/usr/bin/env bash
#
# install-git-hooks.sh — Install tracked .githooks/ as the git hooks dir.
#
# Usage:   bash scripts/hooks/install-git-hooks.sh [--uninstall|--status]
# Install: sets `git config core.hooksPath .githooks` for this repo.
# No npm dep (CLAUDE rule 13).
#
# Rationale (A-502 Sprint 4 retro): `.git/hooks/` is not tracked. To share the
# post-commit claude-mem automation with all collaborators without Husky, we
# track `.githooks/` in the repo and redirect git to use it per-clone.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

MODE="${1:-install}"

usage() {
  cat <<EOF
Usage: $0 [install|--uninstall|--status]
  install       Set core.hooksPath = .githooks and mark all hooks executable (default)
  --uninstall   Unset core.hooksPath (revert to default .git/hooks)
  --status      Show current hook configuration
EOF
}

case "$MODE" in
  install|"")
    if [ ! -d "$ROOT_DIR/.githooks" ]; then
      echo "ERROR: .githooks/ directory not found in repo" >&2
      exit 1
    fi
    # Make all hook files executable
    find "$ROOT_DIR/.githooks" -type f -exec chmod +x {} +
    git config core.hooksPath .githooks
    echo "[install-git-hooks] core.hooksPath = .githooks"
    echo "[install-git-hooks] hooks installed:"
    find "$ROOT_DIR/.githooks" -type f -not -name '*.md' -printf '  %f\n' 2>/dev/null || \
      find "$ROOT_DIR/.githooks" -type f -not -name '*.md' -exec basename {} \; | sed 's/^/  /'
    ;;
  --uninstall)
    git config --unset core.hooksPath 2>/dev/null || true
    echo "[install-git-hooks] core.hooksPath unset (revert to .git/hooks)"
    ;;
  --status)
    CURRENT="$(git config --get core.hooksPath 2>/dev/null || echo '(unset — default .git/hooks)')"
    echo "[install-git-hooks] core.hooksPath = $CURRENT"
    if [ "$CURRENT" = ".githooks" ]; then
      echo "[install-git-hooks] tracked hooks:"
      find "$ROOT_DIR/.githooks" -type f -not -name '*.md' -exec basename {} \; | sed 's/^/  /'
    fi
    ;;
  --help|-h)
    usage
    ;;
  *)
    usage >&2
    exit 1
    ;;
esac
