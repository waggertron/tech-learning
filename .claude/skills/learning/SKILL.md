---
name: learning
description: Use when a teaching moment from quizzing or live discussion produces pattern-recognition insight worth pinning to a data-structure or topic page. Adds five standardized sections to the page so the next person learning the same material gets the recognition framework, not just the raw API. Triggered by phrases like "add this to the X page", "save this learning", "pin this insight", or naturally after a quiz where the user gained recognition skill.
---

# Learning capture protocol

When the user gains a recognition insight during a quiz, code review, or interactive teaching, capture it in the relevant data-structure or topic page using a fixed five-section template. The point is to turn one-time "aha" moments into a durable pattern-recognition framework that future readers (and future-you) can lean on.

## When to trigger

- User says "add this to the [structure] page" / "save this learning" / "pin this".
- After a quiz where the user reached a new recognition (e.g., they couldn't see "this is a stack problem" but now can).
- When discussing why a particular data structure or pattern fits a class of problems.
- When debunking a wrong instinct (e.g., "two-pointer doesn't work here because…") that has reusable framing.

## The five sections

Use these section headings, in this order, on every data-structure / pattern page that gets updated:

### `## What clues you in`

The single mental gut-check that fires the recognition reflex. One paragraph. The shape: "while doing X, do I sometimes need to do Y? If yes → reach for [structure]." Concrete and testable, not abstract.

### `## Signal and what it sounds like`

A small markdown table mapping abstract signal patterns to how they show up in problem statements. Two columns: `Signal` and `What it sounds like`. Aim for 4-7 rows, each row a real pattern not a synonym.

### `## Linguistic clues`

A numbered list of specific phrases / keywords from problem statements that fire the reflex. For each, name the phrase in bold/quotes and one short sentence on why it points at this structure. Aim for 4-8 items.

### `## Counter clues`

The disambiguation section. List the closest-neighbor structures and what makes the *neighbor* fit (stack vs. queue, stack vs. two-pointer, hash map vs. set, BFS vs. DFS, etc.). End with one decision rule that breaks ties when two structures both seem plausible.

### `## Related problems`

Curated kin (5-10 entries) where the recognition skill above is actually exercised. NOT a comprehensive index — that lives in the existing "LeetCode problems" section. This is a teaching list: each entry is one twist on the basic pattern, ordered from canonical to subtle.

## Where to insert

For data-structure pages (`src/content/docs/topics/cs/data-structures/*.md`):

- Insert the five sections **between `## Common uses in DSA` and `## Python example`**.
- Keep the existing comprehensive `## LeetCode problems` section at the end intact; the new `## Related problems` is the *curated teaching list*, not the full index.

For topic pages (`src/content/docs/topics/cs/<topic>/*.md`):

- Insert near the top, after the introductory prose and before deep-dive sections.

## Reuse the user's exact section names

The user requested these exact headings: `What clues you in`, `Signal and what it sounds like`, `Linguistic clues`, `Counter clues`, `Related problems`. Do not rename, abbreviate, or merge them. The consistency across pages is the value: someone scanning Stacks, Trees, Graphs etc. should see the same five-section recognition layer in the same place.

## Style requirements (this repo)

- NO em dashes. Substitute commas, periods, colons, semicolons, parens. Single ASCII hyphens are fine for structure.
- Voice: direct, declarative, written so a reader can pick up the page cold. The sections should be useful to someone who has never seen the structure before, not just the user who triggered the capture.
- Keep prose tight. Bias toward concrete examples over theoretical framing.
- Cross-link to specific problem pages with relative paths (`../../leetcode-150/stack/020-valid-parentheses/` style).
- Code in fenced blocks with language tag.

## Verify and commit

After editing:

1. Run `npm run build` to verify the YAML and links still parse.
2. If the user asks to push, follow the standard commit protocol from `CLAUDE.md` (short imperative subject, bulleted body, co-author tag).

If the page already has some of these sections (partial capture from a previous learning event), update them in place rather than duplicating. Do NOT remove existing sections that don't match the template; the template adds, it doesn't replace.

## When NOT to trigger

- For one-off code fixes or content corrections that don't produce reusable recognition skill.
- When the insight is too narrow ("this specific edge case in problem X") to apply to a general structure or pattern.
- When the relevant page doesn't exist yet — first the page needs to exist (use the `authoring` skill), then the learning capture extends it.
