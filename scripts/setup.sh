#!/usr/bin/env bash
# EngineeringOS — full local setup (MCP + Obsidian)
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "=== EngineeringOS Setup ==="
echo ""

# 1. Dependencies + tests
echo "[1/3] Installing dependencies and running tests..."
npm install --silent
npm test

# 2. Cursor MCP config
echo ""
echo "[2/3] Configuring Cursor MCP..."
MCP_EXAMPLE="$REPO_ROOT/.cursor/mcp.json.example"
MCP_TARGET="$REPO_ROOT/.cursor/mcp.json"

mkdir -p "$REPO_ROOT/.cursor"

if [[ ! -f "$MCP_TARGET" ]]; then
  cat > "$MCP_TARGET" <<EOF
{
  "mcpServers": {
    "engineeringos": {
      "command": "node",
      "args": [
        "--experimental-strip-types",
        "runtime/api/mcp-main.ts"
      ],
      "cwd": "$REPO_ROOT",
      "env": {
        "ENGINEERINGOS_ROOT": "$REPO_ROOT"
      }
    }
  }
}
EOF
  echo "  Created .cursor/mcp.json"
else
  echo "  .cursor/mcp.json already exists (skipped)"
fi

echo "  Reload Cursor: Cmd+Shift+P → Developer: Reload Window"

# 3. Obsidian vault export
echo ""
echo "[3/3] Exporting Obsidian vault..."
"$REPO_ROOT/scripts/setup-obsidian.sh"

echo ""
echo "=== Setup complete ==="
echo ""
echo "MCP tools:  engineeringos.status, engineeringos.capabilities, engineeringos.export"
echo "Obsidian:   $REPO_ROOT/dist/obsidian-vault"
echo "Docs:       QUICKSTART.md"
