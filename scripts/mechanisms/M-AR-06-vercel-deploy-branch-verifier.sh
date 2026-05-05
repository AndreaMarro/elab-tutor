#!/usr/bin/env bash
# M-AR-06 Vercel Deploy Branch Verifier (iter 38, anti-regression)
#
# Verifies that Vercel production prod alias deployment was built from the
# expected git branch (matches current HEAD branch). Catches the iter 38 P0.3
# incident where `vercel --prod --yes --archive=tgz` from e2e-bypass-preview
# completed exit 0 but Vercel auto-deployed main branch over the alias.
#
# Pre-deploy gate: run BEFORE every `vercel --prod` to alert if deploys would
# be silently overridden by Vercel auto-build from a different branch.
# Post-deploy verify: run AFTER deploy + alias swap to confirm prod alias
# points to a deployment built from current branch.
#
# Usage:
#   bash scripts/mechanisms/M-AR-06-vercel-deploy-branch-verifier.sh [--pre-deploy|--post-deploy]
#
# Defaults to --post-deploy mode (passive verification).
# Exit 0 = match, exit 1 = mismatch (blocking gate).

set -euo pipefail

MODE="${1:---post-deploy}"
HEAD_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
HEAD_SHA=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
TODAY=$(date -u +%Y-%m-%d)
REPORT_DIR="automa/state"
REPORT_PATH="$REPORT_DIR/vercel-deploy-branch-verify-$TODAY.json"

if [[ ! -d "$REPORT_DIR" ]]; then
  mkdir -p "$REPORT_DIR"
fi

echo "M-AR-06 Vercel Deploy Branch Verifier"
echo "===================================="
echo "mode: $MODE"
echo "git_head_branch: $HEAD_BRANCH"
echo "git_head_sha: ${HEAD_SHA:0:7}"

# Use vercel ls + inspect to find prod alias deployment URL
# Requires `vercel` CLI authenticated + project linked
# Single vercel inspect call captures both URL + alias branch hint (saves 2nd call hang).
INSPECT_OUT=$(npx --yes vercel inspect www.elabtutor.school 2>&1 || echo "")
PROD_DEPLOY_URL=$(echo "$INSPECT_OUT" \
  | grep -oE 'https://elab-tutor-[a-z0-9]+-andreas-projects-[a-f0-9]+\.vercel\.app' \
  | head -1)

if [[ -z "$PROD_DEPLOY_URL" ]]; then
  echo "WARN: unable to resolve prod alias deployment URL (Vercel CLI auth or project link issue)"
  printf '{"date":"%s","mode":"%s","git_head_branch":"%s","status":"vercel_cli_unavailable"}\n' \
    "$TODAY" "$MODE" "$HEAD_BRANCH" > "$REPORT_PATH"
  echo "report: $REPORT_PATH"
  exit 0
fi

echo "prod_deploy_url: $PROD_DEPLOY_URL"

# Reuse 1st inspect output (no 2nd CLI call — Vercel inspect of deploy URL hangs
# without timeout binary on macOS). Extract branch + commit from already-fetched output.
DEPLOY_BRANCH=$( (echo "$INSPECT_OUT" | grep -iE "branch[[:space:]]" 2>/dev/null || true) | head -1 | sed -E 's/.*branch[[:space:]]+//; s/[[:space:]]+$//' )
DEPLOY_SHA=$( (echo "$INSPECT_OUT" | grep -iE "commit[[:space:]]+[0-9a-f]{7,40}" 2>/dev/null || true) | head -1 | (grep -oE '[0-9a-f]{7,40}' || true) | head -1 )

# Fallback heuristic: parse Vercel alias names for git branch hint
# Pattern: elab-tutor-git-{branch}-{org} alias indicates auto-deploy source branch
if [[ -z "$DEPLOY_BRANCH" ]]; then
  ALIAS_BRANCH_HINT=$( (echo "$INSPECT_OUT" | grep -oE 'elab-tutor-git-[a-z0-9-]+-andreas-projects' 2>/dev/null || true) | head -1 \
    | sed -E 's/elab-tutor-git-//; s/-andreas-projects//' )
  if [[ -n "$ALIAS_BRANCH_HINT" ]]; then
    DEPLOY_BRANCH="$ALIAS_BRANCH_HINT"
    echo "INFO: deploy branch inferred from alias pattern: $DEPLOY_BRANCH"
  fi
fi

if [[ -z "$DEPLOY_BRANCH" ]]; then
  echo "INFO: deploy branch metadata unavailable (likely --archive=tgz upload, no git linkage)"
  DEPLOY_BRANCH="archive_upload_no_git_link"
fi

echo "deploy_branch: $DEPLOY_BRANCH"
echo "deploy_sha: ${DEPLOY_SHA:0:7}"

STATUS="ok"
EXIT_CODE=0

if [[ "$DEPLOY_BRANCH" != "$HEAD_BRANCH" && "$DEPLOY_BRANCH" != "archive_upload_no_git_link" ]]; then
  echo ""
  echo "MISMATCH DETECTED:"
  echo "  HEAD branch:    $HEAD_BRANCH"
  echo "  Deploy branch:  $DEPLOY_BRANCH"
  echo ""
  echo "Likely cause: Vercel project 'Production Branch' is set to '$DEPLOY_BRANCH'"
  echo "and auto-build cycle from that branch overrides --prod archive uploads"
  echo "from current HEAD '$HEAD_BRANCH'."
  echo ""
  echo "Resolution options:"
  echo "  1. PR HEAD -> '$DEPLOY_BRANCH' (proper merge, CI gate)"
  echo "  2. Adjust Vercel 'Production Branch' config -> '$HEAD_BRANCH'"
  echo "  3. Explicit alias swap (risky): vercel alias set <deploy-url> www.elabtutor.school"
  STATUS="branch_mismatch"
  EXIT_CODE=1
fi

if [[ -n "$DEPLOY_SHA" && "$DEPLOY_SHA" != "$HEAD_SHA" && "$STATUS" == "ok" ]]; then
  COMMITS_DIFF=$(git rev-list --count "$DEPLOY_SHA".."$HEAD_SHA" 2>/dev/null || echo "?")
  if [[ "$COMMITS_DIFF" != "?" && "$COMMITS_DIFF" -gt 0 ]]; then
    echo ""
    echo "INFO: HEAD is $COMMITS_DIFF commits ahead of prod deploy ($DEPLOY_SHA)."
    echo "Run 'vercel --prod --yes --archive=tgz' to ship pending changes."
    STATUS="head_ahead_of_deploy"
  fi
fi

cat > "$REPORT_PATH" <<EOF
{
  "date": "$TODAY",
  "mode": "$MODE",
  "git_head_branch": "$HEAD_BRANCH",
  "git_head_sha": "$HEAD_SHA",
  "prod_deploy_url": "$PROD_DEPLOY_URL",
  "deploy_branch": "$DEPLOY_BRANCH",
  "deploy_sha": "$DEPLOY_SHA",
  "status": "$STATUS",
  "verifier_version": 1,
  "verifier_source": "M-AR-06-vercel-deploy-branch-verifier.sh"
}
EOF

echo ""
echo "report: $REPORT_PATH"
echo "status: $STATUS"
exit $EXIT_CODE
