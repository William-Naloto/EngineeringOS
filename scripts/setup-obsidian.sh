#!/usr/bin/env bash
# EngineeringOS — Obsidian vault export and setup
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js >= 20 is required but not found in PATH."
  exit 1
fi

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [[ "$NODE_MAJOR" -lt 20 ]]; then
  echo "ERROR: Node.js >= 20 required (found $(node --version))"
  exit 1
fi

# Load optional .env
if [[ -f "$REPO_ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$REPO_ROOT/.env"
  set +a
fi

export ENGINEERINGOS_ROOT="${ENGINEERINGOS_ROOT:-$REPO_ROOT}"
export OBSIDIAN_OUTPUT_DIR="${OBSIDIAN_OUTPUT_DIR:-$REPO_ROOT/dist/obsidian-vault}"
export OBSIDIAN_SCOPE="${OBSIDIAN_SCOPE:-all}"
export OBSIDIAN_MIN_STATUS="${OBSIDIAN_MIN_STATUS:-}"

echo "Installing dependencies..."
npm install --silent

echo "Running tests..."
npm test

echo ""
echo "Exporting Obsidian vault..."
echo "  Output:  $OBSIDIAN_OUTPUT_DIR"
echo "  Scope:   $OBSIDIAN_SCOPE"
echo "  minStatus: $OBSIDIAN_MIN_STATUS"
echo ""

ENGINEERINGOS_ROOT="$ENGINEERINGOS_ROOT" \
  OBSIDIAN_OUTPUT_DIR="$OBSIDIAN_OUTPUT_DIR" \
  OBSIDIAN_SCOPE="$OBSIDIAN_SCOPE" \
  npm run export:obsidian

echo ""
echo "Obsidian vault ready at:"
echo "  $OBSIDIAN_OUTPUT_DIR"
echo ""
echo "Open in Obsidian:"
echo "  1. File → Open folder as vault"
echo "  2. Select: $OBSIDIAN_OUTPUT_DIR"
echo ""
echo "Recommended community plugins:"
echo "  - Dataview (dashboards in _index/)"
echo "  - Templater (authoring from _templates/)"
echo "  - Obsidian Git (sync vault with repo)"
echo "  - Mermaid (graph-overview diagram)"
echo ""
echo "Re-export after knowledge changes:"
echo "  npm run export:obsidian"
echo "  # or: ./scripts/setup-obsidian.sh"
