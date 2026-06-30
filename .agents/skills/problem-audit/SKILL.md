---
name: problem-audit
description: "Audit all LeetCode problem references across the site, add links where pages exist, and collect a list of missing pages"
---

# Problem Audit Skill

Finds every mention of a LeetCode problem across the site, turns plain-text mentions into links where the page exists, and produces a prioritized list of problems that are referenced but have no page.

## When to Trigger

- User says "audit problem references", "check for broken problem links", or "what problems are we missing?"
- After a batch of new data-structure or algorithm pages is added (new pages often mention problems by name without links)
- Periodically to keep cross-links healthy as the catalog grows

## Process

### Step 1: Inventory existing problem pages

```bash
find src/content/docs/topics/cs/coding-problems \
  -name "*.mdx" ! -name "index.*" \
  | sort
```

Extract the problem number from each filename (e.g. `042-trapping-rain-water.mdx` -> 42). Build a lookup: `{number: filepath}`.

### Step 2: Find all problem mentions in non-problem files

Search these directories for problem references:

```bash
grep -r "LeetCode [0-9]\|[0-9]\+\. [A-Z]" \
  src/content/docs/topics/cs/data-structures/ \
  src/content/docs/topics/cs/named-algorithms/ \
  src/content/docs/topics/cs/graph-theory/ \
  src/content/docs/topics/cs/flight-itinerary/ \
  src/content/docs/posts/ \
  --include="*.md" --include="*.mdx" -l
```

For each file, read it fully and note:
- Every problem name or number mentioned
- Whether the mention is already a markdown link `[...](...)` or plain text

Also check cross-links inside problem files themselves (`## Related topics` and `## Related data structures` sections).

### Step 3: Classify each mention

- **Already linked** -- skip, no action needed
- **Needs link, page exists** -- add a markdown link using the correct relative path
- **No page yet** -- collect for the missing list

### Step 4: Fix links

For each plain-text mention where the page exists:

**Relative path rules:**
- From `data-structures/file.md` -> `../coding-problems/<category>/<slug>/`
- From `named-algorithms/file.md` -> same
- From `graph-theory/index.md` -> same
- From `posts/file.md` -> `../topics/cs/coding-problems/<category>/<slug>/`
- From a problem page in `coding-problems/stack/` -> sibling is `./slug/`, other category is `../category/slug/`

Edit files directly and verify the target exists before linking. Verify the target file exists before linking.

### Step 5: Report missing pages

Group missing problems by category:

```
| # | Problem | Category | Mentioned in |
|---|---------|----------|--------------|
| 560 | Subarray Sum Equals K | Prefix Sum | hash-tables.md, arrays.md |
```

Sort by how many files mention each problem (more mentions = higher priority to write).

### Step 6: Build to verify

```bash
npm run build
```

Fix any YAML or link errors before reporting done.

## Output format

Report three sections:

1. **Fixed** -- list of files edited and how many links were added
2. **Already linked** -- brief count, no need to enumerate
3. **Missing pages** -- the priority table from Step 5

## Notes

- Do not link to problems on external URLs (leetcode.com) -- internal links only. If no internal page exists, leave plain text and add to the missing list.
- When a file mentions a problem by name only (not number), cross-reference the name against the problem page titles to find the number.
- The `neetcode-150` tag on a problem page indicates it is in the NeetCode 150. Bonus problems lack this tag but are linked the same way.
- After a large audit session, consider running `git diff --stat` to review scope before committing.
