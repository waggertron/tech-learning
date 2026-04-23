#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: npm run new:post -- <slug>"
  echo "Example: npm run new:post -- what-i-learned-about-rag"
  exit 1
fi

SLUG="$1"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/templates/post.md"
TODAY="$(date +%Y-%m-%d)"
DEST="$ROOT/src/content/docs/posts/${TODAY}-${SLUG}.md"

if [[ -e "$DEST" ]]; then
  echo "Error: $DEST already exists"
  exit 1
fi

cp "$SRC" "$DEST"
perl -i -pe "s/^date: 2026-04-23$/date: $TODAY/" "$DEST"
perl -i -pe "s|YYYY-MM-DD-slug|${TODAY}-${SLUG}|" "$DEST"

echo "Created: $DEST"
echo "Next: edit it (title, description, tags), then write"
