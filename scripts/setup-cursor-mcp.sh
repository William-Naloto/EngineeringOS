#!/usr/bin/env bash
# EngineeringOS — Cursor MCP setup helper
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js >= 20 is required but not found in PATH."
  echo "Install: https://nodejs.org/ (LTS) or: brew install node"
  exit 1
fi

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [[ "$NODE_MAJOR" -lt 20 ]]; then
  echo "ERROR: Node.js >= 20 required (found $(node --version))"
  exit 1
fi

echo "Installing dependencies..."
npm install

echo "Running tests..."
npm test

echo ""
echo "MCP server entry:"
echo "  ENGINEERINGOS_ROOT=$REPO_ROOT npm run mcp"
echo ""
echo "Cursor MCP config: .cursor/mcp.json (project-level)"
echo "Reload Cursor window after first setup (Cmd+Shift+P → Developer: Reload Window)"
echo ""
echo "Verify tools: engineeringos.status, engineeringos.capabilities, engineeringos.graph"
