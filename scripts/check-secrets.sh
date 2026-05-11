#!/usr/bin/env bash
# Scans src/content/docs/ for realistic-looking credential strings before build.
# Fails fast so secrets never make it into the compressed site output.

set -euo pipefail

CONTENT_DIR="src/content/docs"
FOUND=0

check() {
  local label="$1"
  local pattern="$2"
  local matches
  matches=$(grep -rn --include="*.md" --include="*.mdx" -E "$pattern" "$CONTENT_DIR" 2>/dev/null || true)
  if [ -n "$matches" ]; then
    echo "ERROR: Possible $label found in content:"
    echo "$matches"
    FOUND=1
  fi
}

check "Stripe live key"        'sk_live_[a-zA-Z0-9]{20,}'
check "Stripe test key"        'sk_test_[a-zA-Z0-9]{20,}'
check "GitHub PAT (classic)"   'ghp_[a-zA-Z0-9]{36,}'
check "GitHub PAT (fine-grained)" 'github_pat_[a-zA-Z0-9_]{40,}'
check "AWS access key"         'AKIA[A-Z0-9]{16}'
check "Slack bot token"        'xoxb-[0-9]+-[a-zA-Z0-9-]+'
check "Slack user token"       'xoxp-[0-9]+-[a-zA-Z0-9-]+'
check "Google API key"         'AIza[a-zA-Z0-9_-]{35}'
check "Twilio account SID"     'AC[a-f0-9]{32}'
check "SendGrid API key"       'SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}'

if [ "$FOUND" -eq 1 ]; then
  echo ""
  echo "Build aborted. Replace realistic credential strings with placeholders:"
  echo "  YOUR_API_KEY_HERE  |  sk_live_<your_key>  |  REDACTED"
  exit 1
fi

echo "Secret scan passed."
