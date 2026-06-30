---
name: markdown-table-pipes
description: "Use when writing complexity tables, math notation, or any Markdown table cell that contains absolute value bars, cardinality notation, or set-size notation like |n|, |S|, |result|. Prevents silent table-breaking from unescaped pipe characters."
---

# Markdown Table Pipes

## Overview

Pipe characters (`|`) inside Markdown table cells are interpreted as column separators, silently splitting or corrupting the table. Any notation that uses `|variable|` (absolute value, cardinality, set size) must escape the pipes when placed inside a table cell.

## The Problem

```markdown
| Line | Cost | Times | Contribution |
| L2   | O(k * |result|) | n | O(k^n * n) |   ← breaks table, extra "columns" created
```

## The Fix

Escape every inner pipe with `\|`:

```markdown
| Line | Cost | Times | Contribution |
| L2   | O(k * \|result\|) | n | O(k^n * n) |   ← renders correctly
```

## Where This Comes Up

| Notation | Context | Fix |
| --- | --- | --- |
| `\|n\|` | Absolute value of exponent | Escape both pipes |
| `\|x\|` | Absolute value of integer | Escape both pipes |
| `\|t\|` / `\|s\|` | String/set length | Escape both pipes |
| `\|result\|` | List cardinality | Escape both pipes |

**Prose text outside tables is fine** -- `|x|` in a bullet or paragraph does not need escaping.

## Detection

```bash
grep -rn "| *O([^)]*|[a-zA-Z]" src/ --include="*.md" | grep -v "\\\\"
```

This finds unescaped `|variable|` patterns inside table rows.

## Common Mistake

Writing the fix in prose then copying to a table and forgetting to add escapes. Always escape when pasting complexity notation into a table cell.
