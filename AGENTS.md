# AGENTS.md

Instructions for AI coding agents working in this repo. See also `docs/AUTHORING.md` for the full content authoring reference.

Codex-native reusable skills live in `.agents/skills/`. Local learning and quiz memory lives in `.agents/memory/`, which is ignored because it can contain personal study history. Prefer those files over old Claude workspace files.

## Critical rules

1. **Never use realistic-looking credential strings in example code.** Patterns like `sk_live_`, `ghp_`, `AKIA`, `xoxb-`, `eyJ` (JWT with realistic payload) trigger GitHub Push Protection and block pushes -- even when fake. Use placeholders: `YOUR_API_KEY_HERE`, `sk_live_<your_key>`, `<token>`, `REDACTED`.

2. **Quote all frontmatter descriptions** with double quotes. Unquoted descriptions containing `:`, `"`, or a leading backtick break the YAML parser and fail the build.

3. **Run `npm run build` after every batch of file changes.** YAML errors compound across files.

4. **Update both index files when adding a topic:** `topics/<category>/index.md` and `topics/index.mdx`.

5. **No em dashes (U+2014).** Use commas, colons, semicolons, or parens instead.

6. **Relative links only, resolved from rendered routes.** Never absolute paths. A leaf page renders as a directory, so calculate Markdown links from the built URL, not the source file path. The `base: '/tech-learning'` config handles the prefix.

7. **ASCII diagrams only.** Mermaid is not wired up in this build.

8. **Rendered content must be reader-facing.** Do not publish internal planning scaffolding, future-file TODOs, implementation checklists, agent instructions, or hidden "add this later" notes in `src/content/docs`. Move that material to `docs/`, `.agents/memory/`, or a private planning note.

9. **Synthesize repeated source attribution.** If several bullets cite the same author, publication, or source family for one argument, combine them into one stronger explanation. Mechanical source piles read noisy and low-value.

10. **Track feature additions.** When a change adds a user-visible capability, content model, generator, reusable skill, validation rule, or authoring workflow, update `docs/feature_tracker.md` and any focused docs needed to maintain it.

11. **Run pre-push validation before pushing.** Use `npm run validate:pre-push` or the documented narrower tier from `docs/pre-push-validation.md`. Pages should render intended content, internal links should resolve, code examples should pass their contracts, and custom page behavior should be spot-tested when affected.

## Repo structure

```
src/content/docs/
├── topics/
│   ├── ai/
│   ├── cs/
│   │   └── coding-problems/   (NeetCode 150 + bonus LeetCode problems)
│   ├── ops/
│   ├── system-design/
│   ├── testing/
│   └── web/
└── posts/
```

## Build and deploy

- Local build: `npm run build` (runs in roughly 40s, 616 pages as of July 2026)
- Deployed to GitHub Pages on push to `main`
- Site URL: `https://waggertron.github.io/tech-learning/`

## Converted Skills

- `.agents/skills/authoring/SKILL.md`: adding topics, subtopics, posts, and coding problem pages.
- `.agents/skills/writing-style/SKILL.md`: repo prose style and the em-dash ban.
- `.agents/skills/prose-cleanup/SKILL.md`: cleanup passes for AI-writing markers.
- `.agents/skills/quiz/SKILL.md`: LeetCode/coding-problem quiz loop using `.agents/memory/quiz-log.md`.
- `.agents/skills/deep-learn/SKILL.md`: spaced retrieval and durable learning using `.agents/memory/deep-learn-log.md`.
- `.agents/skills/learning/SKILL.md`: capture reusable pattern-recognition insights on topic pages.
- `.agents/skills/problem-audit/SKILL.md`: audit internal coding-problem references.
- `.agents/skills/markdown-table-pipes/SKILL.md`: avoid broken Markdown tables when math cells contain pipe characters.
- `.agents/skills/post-series/SKILL.md`: create and maintain post series pages, series frontmatter, reading order, and long-form series plans.
- `.agents/skills/react-instructional-posts/SKILL.md`: write and review Modern React instructional posts.
- `.agents/skills/react-example-output-views/SKILL.md`: maintain generated output views after Modern React examples.
- `.agents/skills/feature-tracking/SKILL.md`: keep feature history, docs records, AGENTS rules, and local memory current when capabilities are added.
- `.agents/skills/pre-push-validation/SKILL.md`: run the outcome-based pre-push gate for rendered pages, links, examples, custom behavior, and push readiness.
- `.agents/skills/published-content-review/SKILL.md`: remove internal planning residue, consolidate repeated source attribution, and run the published-content review gate before shipping content.
- `.agents/skills/linkedin-post-creation/SKILL.md`: turn published pages and drafts into source-grounded LinkedIn posts, sharing steps, and clipboard-ready copy.

## Feature tracking

Use `docs/feature_tracker.md` as the durable feature history. For future feature work, update the tracker in the same batch as the implementation, add focused docs for workflows or generators, and add a local note in `.agents/memory/feature_tracker.md` when there is in-progress context that should help future sessions. `.agents/memory/` is ignored, so important historical records belong in docs.
