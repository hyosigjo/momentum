#!/bin/bash
set -euo pipefail

# Only run in remote environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# This is a static HTML/JS project with no build dependencies.
# No installation required.
echo "Momentum project ready (static HTML/JS, no dependencies to install)"
