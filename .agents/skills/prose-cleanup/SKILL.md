---
name: prose-cleanup
description: "Use when cleaning up existing tech-learning content or reviewing new prose before it ships. Enforces anti-AI prose standards, bold-term colon bullets, semicolon cleanup, and the repo writing style."
---

# Prose cleanup for the Here Be Dragons site

Use this skill when doing a cleanup pass on existing content, or when reviewing new content before it ships. It enforces the site's anti-AI-slop prose standards.

## When to trigger

- User says "deslop," "clean up the prose," "make this sound less AI-generated," or "prose cleanup"
- A new topic was just authored and needs a tone review before commit
- Resuming the site-wide cleanup (see Phase plan below)

## Canonical reference

`src/content/docs/topics/ai/ai-text-markers/index.md` -- this page documents every pattern to fix, with explanations. Use it as the source of truth.

That page intentionally contains bad examples. Preserve those examples unless the task is to improve the marker catalog itself.

## Scan-driven cleanup

The 2026-07-12 cleanup pass proved that "already clean" assumptions age badly. Run scans, interpret the result, then edit. Do not rely on memory that a pattern was already removed.

Use these low-cost checks before and after a broad cleanup pass:

```bash
rg -n $'\u2014' src docs .agents AGENTS.md README.md
rg -n "^\s*(?:[-*]|[0-9]+\.) \*\*[^*]+\*\*," src/content/docs docs README.md
rg -n "In conclusio[n]|To summariz[e]|Ultimatel[y]|At the end of the da[y]|\butiliz[e]\b|\b[Ll]everag[e]\b|\bdelv[e]\b|dive int[o]|\brobus[t]\b|\bcomprehensiv[e]\b|seamlessl[y]|effortlessl[y]|\bstreamlin[e]\b|unlock the powe[r]|harness the powe[r]|It's worth notin[g]|On the other han[d]" src/content/docs docs README.md
```

Interpretation rules:

- U+2014 should be zero across author-controlled text.
- Bold-label comma bullets should be zero.
- The vocabulary scan is a review queue. Read the sentence before changing it.
- Preserve code fences, inline code, table cells that contain code, and the intentional examples in `ai-text-markers`.
- Technical terms can be valid even when they resemble a marker. Do not rewrite domain terms mechanically.

## What to fix

### Punctuation
- `**Term**, Description` bullet pattern -> `**Term**: Description` (comma after bold term becomes colon)
- Semicolons in prose joining independent clauses -> split into two sentences with a period
  - Test: can you replace the `;` with a period and have two complete sentences? If yes, do it.

### Vocabulary
- "demonstrate" -> "show" (where simpler word fits)
- "utilize" -> "use"
- "implement" -> "build" (where more concrete)
- "furthermore," "moreover," "additionally" as openers -> cut or rewrite
- Enthusiasm filler ("exciting," "powerful," "remarkable") -> cut unless genuinely warranted
- "on one hand... on the other" false balance -> rewrite as a direct claim

### Structure
- Rigid parallel bullet lists that were clearly generated just to look structured -> convert to prose paragraph
- Rule: if 3+ bullets are each a single sentence that would flow naturally together, fold to prose
- Rule: keep lists when they aid scanning (steps, options, comparisons, reference tables)
- Uniform sentence length -> vary: short punchy sentences mixed with longer complex ones

## What NOT to touch

1. **`src/content/docs/personal/`** -- skip entirely
2. **Fenced code blocks** (``` ... ```) -- never edit content inside
3. **Inline code** (backtick spans) -- never edit
4. **`src/content/docs/topics/ai/ai-text-markers/index.md`** -- intentional examples, preserve as-is
5. **Frontmatter YAML** -- governed by separate rules (see authoring skill)
6. **Table cells containing code** -- skip semicolons/commas in those cells

## Phase plan (site-wide cleanup order)

Work through sections in this order, one phase at a time. Build-verify after each phase.

| Phase | Directory | Priority |
|---|---|---|
| 1 | `topics/ai/` | Highest -- most visible |
| 2 | `topics/cs/data-structures/` + CS hub pages | Foundational |
| 3 | `topics/system-design/` | High semicolon density |
| 4 | `topics/web/` | Series format |
| 5 | `topics/testing/` | Short pages |
| 6 | `topics/ops/` | Medium |
| 7 | `topics/networking/` | Preserve technical precision |
| 8 | `topics/cs/coding-problems/` | Tone pass only, keep skeleton |
| 9 | `posts/` | Blog posts |

## Verification after each phase

```bash
npm run build
```

Build must stay green. Page count should stay stable (no pages removed or added). Spot-check 2-3 pages: prose should feel direct and human, not AI-systematic.

If the cleanup touches interactive post components, React output panels, generated examples, or client-side behavior, run the relevant targeted test too. For React output panels, run:

```bash
npm run test:react-outputs
```

## Related

- [`writing-style/SKILL.md`](../writing-style/SKILL.md) -- em-dash ban, voice, forbidden words
- [`authoring/SKILL.md`](../authoring/SKILL.md) -- frontmatter rules, structure conventions
- [`src/content/docs/topics/ai/ai-text-markers/index.md`](../../src/content/docs/topics/ai/ai-text-markers/index.md) -- canonical marker reference
