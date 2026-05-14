# Prose cleanup for the Here Be Dragons site

Use this skill when doing a cleanup pass on existing content, or when reviewing new content before it ships. It enforces the site's anti-AI-slop prose standards.

## When to trigger

- User says "deslop," "clean up the prose," "make this sound less AI-generated," or "prose cleanup"
- A new topic was just authored and needs a tone review before commit
- Resuming the site-wide cleanup (see Phase plan below)

## Canonical reference

`src/content/docs/topics/ai/ai-text-markers/index.md` — this page documents every pattern to fix, with explanations. Use it as the source of truth.

## What to fix

### Punctuation
- `**Term**, Description` bullet pattern → `**Term**: Description` (comma after bold term becomes colon)
- Semicolons in prose joining independent clauses → split into two sentences with a period
  - Test: can you replace the `;` with a period and have two complete sentences? If yes, do it.

### Vocabulary
- "demonstrate" → "show" (where simpler word fits)
- "utilize" → "use"
- "implement" → "build" (where more concrete)
- "furthermore," "moreover," "additionally" as openers → cut or rewrite
- Enthusiasm filler ("exciting," "powerful," "remarkable") → cut unless genuinely warranted
- "on one hand... on the other" false balance → rewrite as a direct claim

### Structure
- Rigid parallel bullet lists that were clearly generated just to look structured → convert to prose paragraph
- Rule: if 3+ bullets are each a single sentence that would flow naturally together, fold to prose
- Rule: keep lists when they aid scanning (steps, options, comparisons, reference tables)
- Uniform sentence length → vary: short punchy sentences mixed with longer complex ones

## What NOT to touch

1. **`src/content/docs/personal/`** — skip entirely
2. **Fenced code blocks** (``` ... ```) — never edit content inside
3. **Inline code** (backtick spans) — never edit
4. **`src/content/docs/topics/ai/ai-text-markers/index.md`** — intentional examples, preserve as-is
5. **Frontmatter YAML** — governed by separate rules (see authoring skill)
6. **Table cells containing code** — skip semicolons/commas in those cells

## Already clean — do not hunt for

Em-dashes, "Furthermore/Moreover/Additionally," "In conclusion/To summarize," "utilize," "It's worth noting." These were suppressed in the writing-style skill and are not present in the existing content.

## Phase plan (site-wide cleanup order)

Work through sections in this order, one phase at a time. Build-verify after each phase.

| Phase | Directory | Priority |
|---|---|---|
| 1 | `topics/ai/` | Highest — most visible |
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

Build must stay green. Page count should stay stable (no pages removed or added). Spot-check 2–3 pages: prose should feel direct and human, not AI-systematic.

## Related

- [`writing-style/SKILL.md`](../writing-style/SKILL.md) — em-dash ban, voice, forbidden words
- [`authoring/SKILL.md`](../authoring/SKILL.md) — frontmatter rules, structure conventions
- [`src/content/docs/topics/ai/ai-text-markers/index.md`](../../src/content/docs/topics/ai/ai-text-markers/index.md) — canonical marker reference
