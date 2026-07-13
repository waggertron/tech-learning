---
name: writing-style
description: "Use when writing ANY prose, markdown, code comments, commit messages, or frontmatter descriptions for this repo (or any repo the author owns). Enforces the em-dash ban, sparing hyphen use, and the Here-Be-Dragons voice."
---

# Writing style for the Here Be Dragons tech-learning site

This skill enforces the author's prose rules. They apply to every piece of text this repo ships: page bodies, frontmatter, titles, descriptions, commit messages, ASCII diagrams, code comments.

This file is deliberately written without any em dash character, so the rule can be verified by simply grepping for the codepoint.

## The hard rule: em dashes are banned

**Never use the em-dash character (Unicode U+2014).** Not in prose, not in titles, not in descriptions, not in commit messages. Not surrounded by spaces, not unspaced. Banned outright.

### Why

Em dashes are a notorious AI-writing tell. The author wants prose that doesn't read like a generative model wrote it. Removing them is a blunt but effective signal.

### What to use instead

Pick the punctuation that fits the meaning:

| Use this | When the intent is |
| --- | --- |
| Comma | Mild parenthetical aside or appositive |
| Period | Both halves are complete thoughts |
| Colon | The second half elaborates the first |
| Semicolon | Two related independent clauses |
| Parentheses | The aside is truly skippable |

Examples of rewrites (the "before" column shows what the em dash *would* have been doing, described in words):

| Intent | After |
| --- | --- |
| Mild aside | `Haversine gives distance, nothing more.` |
| Split sentences | `Run it. Does smoke come out? If yes, dig deeper.` |
| Elaboration | `The fix is simple: add an index.` |
| Joined clauses | `Tests pass; prod is broken.` |
| Parenthetical | `OR-Tools (Google's routing solver) handles it.` |

## Single hyphens are allowed, sparingly

Single hyphens (`-`) are fine when they're structurally right:

- **Compound modifiers**: `multi-tenant`, `long-running`, `well-known`, `row-level`.
- **Code identifiers**: `kebab-case-names`, `--flag-arguments`, command flags like `-v`.
- **Numeric ranges in tight contexts**: `O(log n)`, `3-5 lines`.
- **ASCII diagrams**: box-drawing characters and inline arrows.
- **List markers**: `- item` at line start.

**Avoid** hyphens in running prose as parenthetical separators. They look like em dashes in disguise. Use a comma, period, colon, semicolon, or parentheses instead.

## Voice

- **Direct and declarative.** Short sentences. Say what's true, not what you're about to say.
- **Concrete first.** Lead with the specific thing, not the general category.
- **Don't narrate.** Skip meta phrases like `"Let's explore..."`, `"In this section we'll..."`, `"It's important to note..."`.
- **Say `"the thing"`, not `"interesting / important / essential thing"`.** Let the reader decide what's important.
- **No exhortations.** Avoid `"must"`, `"should always"`, `"make sure to"` when a factual statement works.
- **Don't over-hedge.** `"might"`, `"could potentially"`, `"somewhat"`. Trim them.

## Bullet list punctuation

**Bold-term bullets use a colon, not a comma.**

The pattern `**Term**, Description` is an AI-generation artifact. Every bullet that introduces a term with a bold label should use a colon:

- Wrong: `- **Hash table**, A key-value store with O(1) average lookup`
- Right: `- **Hash table**: A key-value store with O(1) average lookup`

This was one of the most pervasive patterns in the original site content and was cleaned out in a full-site pass in May 2026. Do not reintroduce it.

**Prose semicolons as connective tissue are also an AI tell.**

Semicolons joining two independent clauses ("X is Y; the Z does W") almost always read better as two sentences. Split them. Keep semicolons for legitimate uses: lists where items have internal commas, and places where the tight coupling between two clauses genuinely matters.

## Source attribution synthesis

Research sections should synthesize sources. They should not look like a generated checklist of every source opened.

When several bullets cite the same author, publication, or source family for one argument, combine them into one stronger attribution. Explain the shared insight, then link the relevant pieces together.

Bad shape:

- `Fowler's DSL Guide says...`
- `Fowler's DSL Boundary says...`
- `Fowler's Business Readable DSL says...`

Better shape:

- `Martin Fowler's DSL writing is best read as one argument: keep the language bounded, choose internal or external form deliberately, and aim for business-readable review before promising business-writable authoring.`

The bad shape reads systematic, noisy, shallow, and low-value. Use separate bullets only when the sources make clearly different claims.

## Forbidden words and phrases

These read as AI filler. Avoid them in this repo:

- `"In conclusion"`, `"To summarize"`, `"Ultimately"`, `"At the end of the day"`.
- `"Leverage"` (when `"use"` works), `"utilize"` (use `"use"`).
- `"Delve"` (use `"look at"` or `"examine"`), `"dive into"` (use `"look at"`).
- `"Robust"`, `"comprehensive"`, `"seamlessly"`, `"effortlessly"`, `"streamline"`. Adjective inflation.
- `"Navigate the complexities of"`, `"unlock the power of"`, `"harness"`.
- `"In today's fast-paced world"` and variants.
- `"It's worth noting that"`. Just say the thing.
- `"On the other hand"`. `"But"` works.

## Frontmatter description style

- One sentence, says what's *inside*, not what it's *about*.
- Always quote with double quotes. Single quotes if the value contains double quotes.
- No em dashes; no leading backticks; no unquoted inner `: ` or `"..."`.

**Good:**
```yaml
description: "Token bucket, leaky bucket, fixed and sliding windows. The four algorithms, when to pick each, where in the stack to enforce them, and the pitfalls that make a 'working' rate limiter let abuse through."
```

## Title style

Use a colon or a comma to separate a concept from its subtitle. Never a long dash. Under ~70 characters so it doesn't wrap on mobile.

## When writing diffs or corrections to this rule

If you discover an em dash you wrote, fix it immediately. If you see one in existing content, replace it using the table above. Don't leave it for later.

## Verification

Before committing any content you wrote or touched, check for the em-dash codepoint without embedding it directly:

```bash
grep -rFn "$(python3 -c 'print(chr(0x2014))')" src/ docs/ .agents/ AGENTS.md README.md
```

The count should be **zero** in any author-controlled text. This skill file is deliberately em-dash-free, so the grep should stay clean even when this file is in scope.

## Related

- [`.agents/skills/authoring/SKILL.md`](../authoring/SKILL.md). The how-to-add-content skill. This one is about how to *write*.
- [`docs/AUTHORING.md`](../../../docs/AUTHORING.md). The comprehensive reference.
- [`AGENTS.md`](../../../AGENTS.md). The always-loaded rules.
