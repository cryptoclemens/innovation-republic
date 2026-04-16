#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install Python dependencies
pip install -r "$CLAUDE_PROJECT_DIR/requirements.txt" -r "$CLAUDE_PROJECT_DIR/api/requirements.txt"

# Install frontend Node.js dependencies
cd "$CLAUDE_PROJECT_DIR/frontend"
npm install
