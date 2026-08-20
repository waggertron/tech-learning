---
name: published-content-review
description: "Review tech-learning content before publishing so rendered pages read as finished reader-facing work. Use when editing posts, topic pages, series pages, source-attribution sections, research summaries, bullet-heavy explanations, or any content that may contain internal planning notes, future-file TODOs, repeated same-author source bullets, or systematic low-value list structure."
---

# Published content review

Use this skill with `authoring`, `writing-style`, and `prose-cleanup` when a page is moving from notes or plan material into public content.

## Goal

Rendered pages should read like finished explanations. They should not expose agent instructions, future implementation plans, file-path TODOs, inclusion notes, or scaffolding used to design the page.

## Required check

Run the published content validator after content edits:

```bash
npm run validate:published-content
```

This check scans `src/content/docs` for known planning-leak phrases and repeated same-author bullets in source sections.

## Manual review

The automated check is a floor. Also read the rendered page source and fix these patterns:

- **Internal planning residue**: Remove headings and paragraphs that tell the maintainer what to add later. Public content can discuss a roadmap only when the roadmap is reader-facing.
- **Future file paths**: Move implementation paths, future topic paths, and agent TODOs to `docs/plans/current/` for active tracked plans, `docs/plans/history/` for finished plans, `docs/research/` for private source gathering, or `.agents/memory/` for local session memory.
- **Systematic source piles**: Do not write five separate bullets for the same author, blog, or paper family. Combine them into one substantial attribution that explains the shared insight and links the relevant pieces together.
- **Thin bullet runs**: Keep bullets when they improve scanning. Expand or fold them into prose when they are only one-sentence placeholders.
- **Irrelevant concern leakage**: Remove details that belong to a different problem than the page is teaching. Local ops hygiene, credential scaffolding, private deployment habits, contributor workflow, and agent or skill assumptions belong only when the page is explicitly about that concern. Otherwise, explain the reader-facing choice and link to the maintained source.
- **Meta language**: Avoid phrases such as "this page is the plan," "after review, add," "planned reading order," "code anchor," "wrong first move," and "follow-up path" in public pages.

## Source attribution rule

When multiple sources from the same author or publication support one argument, group them.

Good:

```markdown
- **Martin Fowler's DSL writing**: Fowler's DSL Guide, DSL Boundary, Business Readable DSL, and Syntactic Noise are best read together. The combined argument is...
```

Bad:

```markdown
- Fowler's DSL Guide says...
- Fowler's DSL Boundary says...
- Fowler's Business Readable DSL says...
- Fowler's Syntactic Noise says...
```

The bad shape reads systematic, noisy, shallow, and mechanical. It makes attribution look like a checklist instead of a synthesis.

## Finish criteria

- `npm run validate:published-content` passes.
- The page title and description are reader-facing, not plan-facing.
- Source bullets are synthesized by author or source family when they make the same claim.
- Bullets outside core takeaways carry enough explanation to be useful.
- Internal notes live outside rendered content.
- Local or private concerns are scoped to reader value rather than leaked from the authoring workflow.
