#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [ "$(uname -s)" != "Darwin" ]; then
  echo "This helper is for macOS. On Windows use the commands in README.md."
  exit 1
fi
if ! command -v brew >/dev/null 2>&1; then
  echo "Install Homebrew from https://brew.sh, then run this helper again."
  exit 1
fi
if ! command -v gh >/dev/null 2>&1; then brew install gh; fi
if ! command -v fnm >/dev/null 2>&1; then brew install fnm; fi
eval "$(fnm env --shell bash)"
fnm install 24.19.0
fnm use 24.19.0
if ! command -v pnpm >/dev/null 2>&1 || [ "$(pnpm --version)" != "11.19.0" ]; then
  npm install --global pnpm@11.19.0
fi
if ! gh auth status --hostname github.com >/dev/null 2>&1; then
  gh auth login --hostname github.com --git-protocol https --web
fi
pnpm install --frozen-lockfile
pnpm setup:project
if [ "${1:-}" = "--studio" ]; then
  pnpm studio
else
  echo "Setup complete. Start Studio with: bash scripts/run-mac.sh studio"
fi
