#!/usr/bin/env bash
# Install EngineeringOS Cursor bundles into a consumer project (LOCAL ONLY).
# EngineeringOS files must NEVER be committed to consumer repositories.
#
# Usage:
#   ./scripts/install-project-cursor.sh /path/to/consumer/project
#   ./scripts/install-project-cursor.sh ../data-platform-bees-unity-catalog-service
#
# Installs to isolated subfolders:
#   <project>/.cursor/rules/engineeringos/
#   <project>/.cursor/skills/engineeringos/

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EOS_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "Usage: $0 /path/to/consumer/project" >&2
  exit 1
fi

TARGET="$(cd "$TARGET" && pwd)"

CAPABILITIES=(
  "capability.engineering.review-pr"
  "capability.fabric.monitoring"
  "capability.platform.observability"
)

RULES_DIR="$TARGET/.cursor/rules/engineeringos"
SKILLS_DIR="$TARGET/.cursor/skills/engineeringos"

echo "EngineeringOS → Cursor local install"
echo "  Source:  $EOS_ROOT"
echo "  Target:  $TARGET"
echo "  Rules:   $RULES_DIR"
echo "  Skills:  $SKILLS_DIR"
echo ""
echo "⚠️  Do NOT commit rules/engineeringos/ or skills/engineeringos/ to consumer VCS."
echo ""

mkdir -p "$RULES_DIR" "$SKILLS_DIR"

cd "$EOS_ROOT"

for CAP in "${CAPABILITIES[@]}"; do
  echo "Compiling $CAP ..."
  CURSOR_CAPABILITY="$CAP" npm run export:cursor --silent 2>/dev/null || CURSOR_CAPABILITY="$CAP" npm run export:cursor

  SLUG="${CAP//./-}"
  COMPILE_DIR="$EOS_ROOT/dist/cursor-compile/$SLUG/cursor"

  if [[ ! -d "$COMPILE_DIR" ]]; then
    echo "ERROR: compile output not found: $COMPILE_DIR" >&2
    exit 1
  fi

  if [[ -d "$COMPILE_DIR/rules" ]]; then
    cp -R "$COMPILE_DIR/rules/." "$RULES_DIR/"
    echo "  → rules copied"
  fi

  if [[ -d "$COMPILE_DIR/skills" ]]; then
    for SKILL_PATH in "$COMPILE_DIR/skills"/*; do
      [[ -d "$SKILL_PATH" ]] || continue
      SKILL_NAME="$(basename "$SKILL_PATH")"
      cp -R "$SKILL_PATH" "$SKILLS_DIR/$SKILL_NAME"
      echo "  → skill $SKILL_NAME copied"
    done
  fi
done

RULE_COUNT="$(find "$RULES_DIR" -name '*.mdc' 2>/dev/null | wc -l | tr -d ' ')"
SKILL_COUNT="$(find "$SKILLS_DIR" -name 'SKILL.md' 2>/dev/null | wc -l | tr -d ' ')"

echo ""
echo "Done."
echo "  Rules installed:  $RULE_COUNT (.mdc files)"
echo "  Skills installed: $SKILL_COUNT"
echo ""
echo "Open consumer project in Cursor with engineeringos MCP active."
echo "Re-run this script after updating EngineeringOS capabilities."
