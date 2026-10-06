#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if command -v fnm >/dev/null 2>&1; then
  eval "$(fnm env --shell bash)"
  fnm use 24.19.0
fi
if [ "$#" -eq 0 ]; then set -- studio; fi
pnpm "$@"
