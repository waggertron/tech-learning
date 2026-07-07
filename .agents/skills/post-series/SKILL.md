---
name: post-series
description: "Use when creating, updating, organizing, or planning post series in the tech-learning repo. Covers series frontmatter, series landing pages under posts/series, reading-order design, code-anchor planning for future posts, updating posts/index.mdx, and build validation."
---

# Post series

Use this skill with `authoring` and `writing-style`. This skill covers series structure only. The normal repo rules still apply: quoted descriptions, relative links, no realistic credential strings, no em dashes, and `npm run build` after content edits.

## Content model

Posts stay flat:

```text
src/content/docs/posts/YYYY-MM-DD-slug.md
```

Series pages live here:

```text
src/content/docs/posts/series/<series-slug>/index.mdx
```

The visible hub is:

```text
src/content/docs/posts/series/index.mdx
```

Each post that belongs to a series gets this frontmatter:

```yaml
series:
  slug: <series-slug>
  order: 1
```

`series.slug` is required for grouped posts. `series.order` is optional but should be present for any deliberate reading path.

## Workflow

1. **Find candidates**: Scan existing posts by tags, titles, and cross-links. Use `rg -n "series:|See also|Related topics|../2026" src/content/docs/posts`.
2. **Choose the series shape**: Prefer one clear sequence over many overlapping collections. A post should usually belong to one primary series.
3. **Update post frontmatter**: Add `series.slug` and `series.order`. Keep existing URLs and filenames unchanged.
4. **Create the landing page**: Add `src/content/docs/posts/series/<slug>/index.mdx`.
5. **Update discovery**: Add the series to both `src/content/docs/posts/index.mdx` and `src/content/docs/posts/series/index.mdx`.
6. **Validate**: Run the token scan, em-dash scan, and `npm run build`.

## Landing Page Pattern

Use this frontmatter for a series detail page:

```yaml
---
title: Series title, post series
description: "One sentence describing the sequence and what the reader gets."
sidebar:
  hidden: true
---
```

Use this body shape:

```markdown
One short paragraph explaining the through-line.

## Reading order

1. [Post title](../../YYYY-MM-DD-slug/), why this part comes first.
2. [Next post](../../YYYY-MM-DD-next/), what it adds.

## Related topics

- [Topic](../../../topics/category/topic/)
```

Keep the series index visible. Keep detail pages hidden from the sidebar unless the user explicitly wants nested series pages in navigation.

## Planning New Series

For an unwritten long-form series, create a plan page rather than empty post stubs.

Each planned part should include:

- **Question**: The problem the post answers.
- **Code anchor**: A small working-looking snippet that fixes the center of gravity.
- **Wrong first move**: The mistake the post should warn against, if known.
- **Follow-up path**: What the next part depends on.

Do not create 10+ empty posts unless the user explicitly asks for individual drafts. A single plan page keeps the site useful and avoids placeholder clutter.

## Existing Series

Current series slugs:

- `home-health-routing-system`
- `auth-and-browser-security`
- `software-design-principles`
- `cs-reference-sheets`
- `modern-react-development`

## Validation Checklist

Run these before final response:

```bash
rg -n "eyJ|ghp_|AKIA|xoxb-" src docs .agents AGENTS.md README.md
rg -n $'\u2014' src docs .agents AGENTS.md README.md
npm run build
```

The credential scan may match `AGENTS.md` because it documents forbidden patterns. Content files should not match.
