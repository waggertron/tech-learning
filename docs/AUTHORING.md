# Authoring guide, Here Be Dragons

How to add content to this repo without re-learning the hard-won conventions. Written after a long session that produced ~260 pages; every rule below is one I paid to discover.

See also the companion [skill](./..//.claude/skills/authoring/SKILL.md), which is the trigger-driven version of this document.

---

## What this repo is

A shareable, postable knowledge base. One markdown source renders three ways:

1. **On GitHub**, each file reads cleanly as a README.
2. **As a site**, Astro + Starlight, deployed to GitHub Pages at `https://waggertron.github.io/tech-learning/`.
3. **Portable to social**, same markdown pastes into dev.to, Medium, LinkedIn with minimal edits.

Display title: **"Here Be Dragons"** (in `astro.config.mjs` and `src/content/docs/index.mdx`). Repo slug stays `tech-learning`, it's the URL path.

---

## The two content shapes

### Topics, evergreen reference

`src/content/docs/topics/<category>/<slug>/`

- **Topic** = a folder with `index.md` as the hub.
- **Flat subtopic** = `<subtopic>.md` inside the topic folder. Use when it's a single page with no assets.
- **Folder subtopic** = `<subtopic>/index.md` inside the topic folder. Use when it has images, child pages, or code-sample files.

Current categories: `ai/`, `cs/`, `web/`, `testing/`, `ops/`. Adding a new category is fine, just add `topics/<new>/index.md` as a landing page.

### Posts, dated write-ups

`src/content/docs/posts/YYYY-MM-DD-<slug>.md`

Single file. No folders. Self-registering, appear in the sidebar automatically.

---

## Frontmatter, every field that matters

### Topic index.md

```yaml
---
title: The Topic Name
description: One sentence, concrete, explains what the reader gets.
category: ai            # optional but used for filtering
tags: [tag1, tag2]      # freeform
status: draft           # or published
created: 2026-04-24
updated: 2026-04-24
---
```

### Subtopic .md

```yaml
---
title: Subtopic Name
description: One sentence.
parent: <parent-topic-slug>
tags: [tag1, tag2]
status: draft
created: 2026-04-24
updated: 2026-04-24
---
```

### Post

```yaml
---
title: Post title, second clause if useful
description: One to two sentences describing what's inside.
date: 2026-04-24
tags: [tag1, tag2]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/<slug>/
---
```

`canonical` is required for cross-posting so the original URL gets credit.

### YAML gotchas this session hit (repeatedly)

These are the only frontmatter bugs that have broken the build so far:

1. **Unquoted description starting with a backtick.** `description: \`Form\` vs ...` parses as something exotic in YAML. Fix: wrap the whole value in double quotes, or avoid backtick as the first character.

2. **Unquoted description containing `: ` (colon space).** `description: ... the test types that back it up: unit, component, ...`, YAML sees `back it up` as a key. Fix: wrap in double quotes.

3. **Unquoted description containing `"word"`.** `description: "Favor composition" is a ...`, YAML parses the first `"..."` as the full scalar and errors on the rest. Fix: wrap everything in single quotes, or drop the inner quotes.

**Rule of thumb:** if the description has any punctuation you'd hesitate about (`:`, `"`, backticks, `@`, `!`), put the whole description in double quotes. If the description contains double quotes, wrap in single quotes.

---

## Voice and style

The collected notes of one engineer. First-person plural occasionally, but mostly direct and declarative. Not breezy, not dry. Written so a reader can pick up the page cold.

### Title format

`Topic name, concrete framing` is a common shape. The em-dash-subtitle works in both the sidebar and the hero area. Keep under ~70 characters so it doesn't wrap on mobile.

### Description format

One sentence. Says what's *inside*, not what it's *about*. Concrete. Examples from the repo:

- Good: "Token bucket, leaky bucket, fixed and sliding windows, the four algorithms, when to pick each, where in the stack to enforce them, what to send back to clients, and the pitfalls that make a 'working' rate limiter let abuse through."
- Bad: "An overview of rate limiting."

### Body structure

Most topics follow this rough arc:

1. **Hook paragraph**, one short paragraph that states what the thing is in plain language.
2. **Why it matters**, two to five paragraphs, the problem the thing solves.
3. **The core of it**, concrete details, code, diagrams.
4. **Tradeoffs / what it doesn't cover**, every topic should have this.
5. **Common gotchas**, a bulleted list.
6. **References**, external authoritative links.
7. **Related topics**, internal links, cross-linking pattern.

The best pages on this site carry the reader from "I've heard of this" to "I could explain this to a teammate" in about 15 minutes of reading.

### Length

- **Landing page / category overview**: 80–150 lines.
- **Short topic or subtopic**: 200–350 lines.
- **Full topic with examples and code**: 300–550 lines.
- **Post**: 250–450 lines.

Lines 550+ usually mean the topic should split.

### Code samples

- Language tag on every fenced block.
- Working code, not pseudocode, whenever possible.
- `django` as a language is a warning (astro-expressive-code doesn't have it); use `html` or omit the tag for Django templates.
- Keep each block under ~30 lines; break up longer ones with prose in between.

### Diagrams

- ASCII is fine and often best, renders in every output channel.
- Mermaid works in Starlight when the plugin is enabled (it isn't here yet). Stick to ASCII.
- See `topics/cs/data-structures/` for solid ASCII examples.

### Cross-linking pattern

Every topic ends with a **Related topics** section that links 2–5 neighboring topics using relative paths:

```markdown
## Related topics

- [Topic A](../topic-a/)
- [Post B](../../posts/2026-04-24-slug/)
```

Posts end with a **Related topics and posts** section with the same shape. Links go up (`../`) to the category and across to siblings.

---

## Cross-linking at scale

The site currently has dense cross-links. Patterns worth preserving:

- **Series**, each part of a series links back to the hub and forward to the next part.
- **Bi-directional topic links**, e.g. every LeetCode 150 problem links to its data-structure topic; every data-structure topic lists every problem that exercises it.
- **Topic → Post → Topic**, posts cite the reference topics they're grounded in; those topics don't usually link back to the post (posts age out).
- **Category index**, every category `index.md` lists all its topics.
- **Root `topics/index.mdx`**, lists every topic and named subtopic.

When you add a topic, update at least:

1. The category index (`topics/<category>/index.md`).
2. The root `topics/index.mdx`.
3. Any related topic's "Related topics" section.

---

## Build, verify, ship

### Local

```bash
npm run build
```

Produces `dist/`, ~265–300 pages, 5–10 seconds. A YAML frontmatter error is the most common failure; it prints the offending file and line.

### CI

`.github/workflows/` handles GitHub Pages deploy on push to `main`. Failed builds block the deploy; the site stays at the last green commit.

### Commit style

Observed in the git log:

- Short imperative subject: *"Add 8-part LLM reasoning benchmarks and metrics series"*
- Body explains *what changed and why*, in bullets.
- Co-authored-by tag for AI-assisted commits.

No Conventional Commits prefix required; the git log is readable without one.

---

## When to use `scripts/new-topic.sh` or `new-post.sh`

The `npm run new:topic -- <category> <slug>` and `npm run new:post -- <slug>` scripts copy a template and stamp today's date. Good for empty starts.

In practice, most of this session bypassed the scripts, we pasted content directly into `Write` tool calls with the right frontmatter. Either works.

---

## What's in the repo now

Snapshot as of commit `e34c730` (April 2026). Full index lives in `src/content/docs/topics/index.mdx`; high level:

### AI

- prompt-engineering (context-window-management, prompt-injection-defense, structured-outputs, templates)
- harness-development (context-engineering, permission-models, tool-design)
- rag (chunking, embeddings, hybrid-search, reranking)
- skill-development (frontmatter-and-discovery, patterns-from-a-production-skill-library, skill-vs-tool-vs-agent, writing-a-first-skill)
- coding-tool-blindspots (benchmark-contamination, prompt-injection, slopsquatting)
- design-md
- benchmarks (8-part series)

### CS

- data-structures (10 structures: arrays, strings, hash-tables, linked-lists, stacks, queues, heaps, binary-trees, graphs, tries)
- leetcode-150 (all 150 problems across 18 categories, 3 solutions each)
- haversine-distance
- vehicle-routing (capacitated, time-windows, pickup-and-delivery, solution-approaches)
- functional-core-imperative-shell

### Web

- django (10-part series)

### Testing

- tdd, unit-tests, component-tests, integration-tests, smoke-tests, fuzz-tests, e2e-tests

### Ops

- kubernetes, helm, terraform
- gitops, argocd, gitflow, mlops

### Posts (~20)

Architecture, compliance, security, patterns-from-real-code. See `src/content/docs/posts/`.

---

## Lessons from this session

Condensed observations that should survive.

### About the content

- **The "Here Be Dragons" framing gives permission to be honest.** Not every topic is cleanly understood; marking a section with "here be dragons" is a feature.
- **Cross-linking is the site's moat.** The more every topic points to neighbors, the more useful the overall read is. Build links aggressively.
- **Case-study material hits harder than textbook material.** The posts derived from `home-health-provider-skeleton` are the best content on the site because they're grounded. Do more of that pattern.
- **Saturation is real for benchmarks and for topics.** A topic you've written 300 times online (e.g. "what is a hash table") is lower value than a topic you've hit specific issues with (e.g. "why Postgres `tstzrange` surprised me").

### About the production

- **One commit per logical batch.** A commit that adds an 8-part series is readable. A commit that adds "three random things" is not.
- **Build after every 2–3 new files.** The YAML gotchas above are findable but annoying if they stack up across 10 files.
- **Update the indexes as you go.** Orphan pages that aren't linked from anywhere are hard to find later.
- **Research before writing on fast-moving topics.** Benchmarks, AI tools, and security are moving fast. Use WebSearch.

### About the workflow

- **Plan in advance for series.** An 8-part series takes an hour+ of focused writing; scope up front.
- **Reuse templates.** The topic/posts in `templates/` are a real time-saver; use them for new content.
- **Commit checkpoints for long sessions.** A session that writes 30 files should commit 3–5 times, not once at the end.
- **The README has scaffolding scripts** (`npm run new:topic`, `npm run new:post`). Use them when starting from scratch.

### About the frontmatter

- **Always quote descriptions.** The time saved by unquoted descriptions is dwarfed by the time spent debugging YAML parse failures. (The current repo has a mix, new content should default to quoted.)
- **`date` for posts, `created`/`updated` for topics.** Both schemas are used; don't mix.
- **`canonical` matters for cross-posts.** Set it even if you don't cross-post yet.

---

## Where to look when something breaks

| Symptom | First place to look |
| --- | --- |
| Build fails on YAML | The named file's frontmatter, usually description quoting |
| "language not recognized" warning | Unknown language tag in a code fence; switch to `text` or a known language |
| Deploy fails on GitHub Actions | Pages settings; `base` in `astro.config.mjs`; build succeeded locally first |
| Page exists but isn't in sidebar | Missing frontmatter, wrong directory, or forgot to save |
| Link in content is 404 | Relative path, astro wants `./subtopic/` or `../sibling/`, not absolute |
| Mermaid diagram rendered as text | Mermaid plugin isn't enabled; use ASCII art |

---

## When to update this document

- Every time a new frontmatter gotcha surfaces.
- Every time the category list changes.
- Every time a build-failure mode reveals a pattern.
- Every time the style or structure evolves.

Treat it as the project's institutional memory. Out-of-date beats missing, but up-to-date is the goal.
