#!/usr/bin/env bash
# Regenerate src/projects.json from Vilos92 GitHub repos via gh CLI.
# Exit 10 when gh is missing or not authenticated (agent: use GitHub MCP fallback).

set -euo pipefail

OWNER=Vilos92
PROJECTS_JSON=src/projects.json
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$REPO_ROOT"

gh_unavailable() {
  echo "$1" >&2
  exit 10
}

if ! command -v gh >/dev/null 2>&1; then
  gh_unavailable 'gh: not installed'
fi

if ! gh auth status >/dev/null 2>&1; then
  gh_unavailable 'gh: not authenticated (run: gh auth login)'
fi

if ! command -v jq >/dev/null 2>&1; then
  echo 'jq: not installed (required to format projects.json)' >&2
  exit 1
fi

projects="$(
  gh repo list "$OWNER" --limit 1000 --json name,isPrivate,isFork --jq '
    [.[] | select(.isFork == false)]
    | map({
        slug: (.name | ascii_downcase),
        name: .name,
        githubUrl: "https://github.com/Vilos92/\(.name)",
        private: .isPrivate
      })
    | sort_by(.slug)
  '
)" || {
  echo 'gh repo list failed' >&2
  exit 1
}

count="$(jq 'length' <<<"$projects")"
tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

jq --indent 2 '.' <<<"$projects" >"$tmp"

if [[ -f $PROJECTS_JSON ]] && cmp -s "$tmp" "$PROJECTS_JSON"; then
  echo "projects.json already in sync ($count projects) via gh"
  exit 0
fi

mv "$tmp" "$PROJECTS_JSON"
trap - EXIT
echo "projects.json updated ($count projects) via gh"
