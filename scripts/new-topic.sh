#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: npm run new:topic -- <category> <slug>"
  echo "Example: npm run new:topic -- ai rag-basics"
  exit 1
fi

CATEGORY="$1"
SLUG="$2"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/templates/topic"
DEST="$ROOT/src/content/docs/topics/$CATEGORY/$SLUG"

if [[ -e "$DEST" ]]; then
  echo "Error: $DEST already exists"
  exit 1
fi

mkdir -p "$(dirname "$DEST")"
# Copy only index.md — subtopic templates stay in templates/ for later reference
mkdir -p "$DEST"
cp "$SRC/index.md" "$DEST/index.md"

TODAY="$(date +%Y-%m-%d)"
perl -i -pe "s/^category: uncategorized$/category: $CATEGORY/" "$DEST/index.md"
perl -i -pe "s/^(created|updated): 2026-04-23$/\$1: $TODAY/" "$DEST/index.md"

echo "Created: $DEST/index.md"
echo "Next: edit it (title, description, tags), then write"
echo ""
echo "To add a subtopic later:"
echo "  cp templates/topic/subtopic.md $DEST/<subtopic>.md             # flat"
echo "  cp -r templates/topic/subtopic-folder $DEST/<subtopic>          # folder"
