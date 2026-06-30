---
name: authoring
description: "Use when adding or deepening a topic, subtopic, post, or coding-problem entry in the tech-learning (Here Be Dragons) repo. Covers frontmatter, cross-linking, voice, depth upgrades for bare-bones entries, multi-implementation examples with no fixed cap, optional Markdown/LaTeX explanation sections, original rewording from source material, and the build-verify-commit loop."
---

# Authoring for the Here Be Dragons tech-learning site

This repo is an Astro + Starlight knowledge base, deployed to GitHub Pages at `https://waggertron.github.io/tech-learning/`. Site display title is **"Here Be Dragons"**. Repo slug stays `tech-learning`.

Full background lives in [`docs/AUTHORING.md`](../../../docs/AUTHORING.md). This skill is the triggered checklist.

## When to Trigger

- User asks to add a topic, subtopic, or post.
- User asks to "write an article about X" in the context of this repo.
- User asks to write a series under a category.
- User asks for a landing page or category index.
- User asks to expand, deepen, or improve a bare-bones entry.
- User asks for more implementations, alternate approaches, variants, or language examples.
- User provides source material and asks to turn it into an entry or add it to an existing entry.
- Any edit in `src/content/docs/`.

## Do (in order)

1. **Figure out the shape**, topic or subtopic or post or coding problem?
   - **Topic** -> `src/content/docs/topics/<category>/<slug>/index.md` (folder hub)
   - **Flat subtopic** -> `src/content/docs/topics/<category>/<topic>/<subtopic>.md`
   - **Folder subtopic** -> `src/content/docs/topics/<category>/<topic>/<subtopic>/index.md` (only when it needs images or children)
   - **Post** -> `src/content/docs/posts/YYYY-MM-DD-<slug>.md`
   - **Coding problem** -> `src/content/docs/topics/cs/coding-problems/<category>/<NNN>-<slug>.mdx` + sibling `.py` file

2. **Write frontmatter with the correct schema:**

   **Topic hub:**
   ```yaml
   ---
   title: Topic Name
   description: "One sentence describing what the reader gets."
   category: <category>
   tags: [tag1, tag2]
   status: draft
   created: YYYY-MM-DD
   updated: YYYY-MM-DD
   ---
   ```

   **Subtopic:**
   ```yaml
   ---
   title: Subtopic Name
   description: "One sentence."
   parent: <parent-topic-slug>
   tags: [tag1, tag2]
   status: draft
   created: YYYY-MM-DD
   updated: YYYY-MM-DD
   ---
   ```

   **Post:**
   ```yaml
   ---
   title: Post title, optional second clause
   description: "One to two sentences."
   date: YYYY-MM-DD
   tags: [tag1, tag2]
   crosspost: [devto, linkedin]
   canonical: https://waggertron.github.io/tech-learning/posts/<slug>/
   ---
   ```

   **Coding problem:**
   ```yaml
   ---
   title: "<NNN>. Problem Title (Difficulty)"
   description: "One sentence stating the key technique or insight."
   parent: <category-slug>   # e.g. stack, graphs, linked-list
   tags: [leetcode, <category>, <difficulty>]   # add neetcode-150 only if it's in NeetCode 150
   status: draft
   created: YYYY-MM-DD
   updated: YYYY-MM-DD
   ---
   ```

   Coding problem pages also need this import block immediately after the frontmatter:
   ```
   import PythonRepl from '../../../../../../components/PythonRepl.astro';
   import practiceCode from './<NNN>-<slug>.py?raw';
   ```

   And a **Try it yourself** section:
   ```
   ## Try it yourself
   <PythonRepl code={practiceCode} id="<slug>" />
   ```

   **Coding problem body structure:**
   - `## Problem` -- statement, constraints, examples
   - `## Approach 1: <Brute>` -- explanation + labeled Python code (L1, L2...) + per-line complexity table + **Complexity** block
   - `## Approach 2: <Optimal>` (if different)
   - `## Approach N: <Name>` for any additional implementation that teaches a distinct tradeoff, invariant, optimization, language pattern, or follow-up variant. There is no hard cap at three approaches.
   - `## How to recognize this pattern` (optional but encouraged when a problem has a non-obvious signal) -- see below
   - `## Key takeaways` -- 2-4 bullets on what to remember
   - `## Related topics` -- 2-5 relative links to sibling problems and data-structure pages

   **NeetCode 150 vs bonus problems:** both live in `coding-problems/<category>/`. Include `neetcode-150` in tags only for problems from the NeetCode 150 list. Bonus problems omit that tag. The category index should list them separately ("Bonus problems" subsection).

   **The "How to recognize this pattern" section:**
   Add this section when a problem has a signal that's non-obvious or when a common wrong approach exists. Template:
   - The signal: what phrase or constraint in the problem points to the right data structure
   - The counterexample: the input that breaks the tempting-but-wrong approach
   - Why the wrong approach fails (one sentence)
   - The mental model: a one-liner for the correct approach
   - A table of other problems with the same shape: `| Problem | "Unresolved" item |`

   Trigger: user asks "how would I have known?" during a quiz, OR the problem has been missed 2+ times in quiz sessions.

   **Multiple implementations:** Prefer at least the canonical implementation plus meaningful alternatives when they exist. For coding problems, the current repo commonly uses Python, TypeScript, and Go tabs for each approach. Those language tabs are language variants of the same approach, not the approach limit. Add more than three approaches when the extra versions are pedagogically useful, for example brute force, sorting, hash-based, two-pointer, DP table, space-optimized DP, recursive, iterative, state-machine, heap-based, or follow-up-constrained variants. Do not add filler approaches that only rename variables or repeat the same idea.

   **Minimal vs optional explanation:** The minimum standard for an implementation is tested code, the core idea, complexity, and enough explanation to know when to use it. Optional deeper explanation is welcome when it teaches the invariant, proof, recurrence, edge cases, or interview reasoning. Use normal Markdown in those sections, including tables, lists, code fences, and KaTeX math such as `$O(n^2)$` or `$$T(i) = \sum_{j=i+1}^{n-1} T(j)$$`. Keep optional sections clearly labeled with headings such as `### Further explanation` so the page can support both quick review and deep study.

3. **Quote every description**, default to double quotes around the description value. This prevents the three YAML bugs that have caused every build failure in this repo:
   - Description starts with a backtick.
   - Description contains `": "` (e.g. `back it up: unit, ...`).
   - Description contains an inner `"quoted phrase"`.

   When the description itself contains double quotes, wrap the whole thing in single quotes instead.

4. **Follow the body structure** most topics use:
   - One-paragraph hook, what is this thing, stated plainly.
   - Why it matters, the problem it solves.
   - The concrete details (code, tables, ASCII diagrams).
   - Tradeoffs / what it doesn't cover.
   - Common gotchas.
   - `## References`, external authoritative links.
   - `## Related topics`, 2-5 internal links using relative paths (`../sibling/`, `../../posts/...`).

5. **Link to neighbors.** Every new topic/post should:
   - End with a `## Related topics` (or `## Related topics and posts`) section.
   - Link to 2-5 neighboring topics.
   - Be listed in the category `index.md` (`topics/<category>/index.md`).
   - Be listed in the root `topics/index.mdx`.

6. **Use working code**, not pseudocode. Fence every code block with a language tag. Avoid `django` as a language tag (unrecognized by astro-expressive-code); use `html` or omit.

7. **Prefer ASCII diagrams** over Mermaid, Mermaid isn't wired up in this build.

8. **Build to verify.** Run `npm run build`. On YAML failure it prints the exact file and line. Fix and rebuild.

9. **Update indexes.** When a new topic lands:
   - Add to `src/content/docs/topics/<category>/index.md`.
   - Add to `src/content/docs/topics/index.mdx`.

10. **Commit in logical batches.** One commit per feature (a series = one commit, a single post = one commit). Commit subject is a short imperative; body is bullets. Co-author tag for AI-assisted commits.

## Expanding bare-bones entries

Many existing entries started as thin coverage so the catalog was complete. When the user asks to improve one, treat it as a depth upgrade, not a rewrite from scratch.

1. **Read the current entry and its neighbors.** Preserve frontmatter, existing links, working REPL imports, and local style unless they are wrong.
2. **Find the missing teaching layer.** Bare entries usually lack one or more of: motivation, concrete examples, step-by-step mechanics, tradeoffs, failure modes, line-by-line complexity, recognition clues, implementation variants, or links to related entries.
3. **Add depth where it changes understanding.** Prefer sections that let the reader explain or implement the concept afterward: "Why this works", "When it fails", "How to recognize it", "Walkthrough", "Tradeoffs", "Implementation variants", "Common mistakes".
4. **Use multiple implementations when useful.** Add as many distinct implementations as the topic warrants. For coding problems, keep each approach named and separated. For concept pages, use implementation subsections or tabs when comparing languages, libraries, or strategies.
5. **Separate required from nice-to-have.** Keep the tested implementation and complexity as the reliable core. Put richer reasoning, derivations, diagrams, or proof sketches in optional Markdown sections.
6. **Keep the page coherent.** If an entry grows past the normal length range, split into subtopics or child pages instead of making one oversized page.
7. **Update surrounding links.** A newly deepened entry often deserves new related-topic links from nearby pages.

## Using Source Material

When the user provides an article, editorial, answer, transcript, or pasted reference, use it as raw input only. Do not copy its prose structure sentence by sentence. Extract the concepts, verify them against the repo context, then write original explanations in this site's voice.

- Preserve facts, algorithms, examples, formulas, and citations where useful.
- Reword all explanatory prose from scratch.
- Add attribution or a reference link when the source is external and available.
- Avoid long quotations unless the user explicitly asks for a quote.
- If the source uses non-ASCII symbols, convert them to the repo style unless math notation needs KaTeX.

## Don't

- **Don't invent new frontmatter fields.** The schema is fixed; new fields silently drop or trip the parser.
- **Don't write unquoted descriptions with punctuation.** `:` `"` `` ` `` all break YAML when unquoted.
- **Don't paste absolute paths in links.** Use `./subtopic/` or `../sibling/`; the `base: '/tech-learning'` handles the rest.
- **Don't rename the repo slug** (`base: '/tech-learning'` in `astro.config.mjs`). It's the GitHub Pages path. Display name is separately "Here Be Dragons."
- **Don't create a new top-level directory** for content. All content lives in `src/content/docs/{topics,posts}/`.
- **Don't leave new content orphaned.** If it isn't in the category index, it's hard to find.
- **Don't skip the build step.** YAML failures compound across files and become annoying to untangle.
- **Don't copy production data or secrets** into content. This is a public repo.

## Voice and length

- Direct, declarative. Written so a reader can pick up the page cold.
- Title format: `"Concept, concrete framing"` works well for both sidebar and hero.
- Description format: one sentence, says what's *inside*, not what it's *about*.
- **Length:**
  - Category landing: 80-150 lines.
  - Short topic or subtopic: 200-350 lines.
  - Full topic with examples: 300-550 lines.
  - Post: 250-450 lines.
- Over 550 lines usually means the topic should split.

## Validation checklist

Before calling a new page done:

- [ ] Frontmatter has `title`, `description` (quoted), and either `date` (post) or `created`/`updated` (topic/subtopic).
- [ ] Description quoted with double quotes (or single quotes if it contains double quotes).
- [ ] Links use relative paths (`./` or `../`).
- [ ] `## References` section with at least 2 external links.
- [ ] `## Related topics` section with at least 2 internal links.
- [ ] Listed in parent category index.
- [ ] Listed in `src/content/docs/topics/index.mdx` (for topics).
- [ ] `npm run build` green.
- [ ] Page count in the build output went up (confirms the page was included).
- [ ] No `**Term**, Description` comma patterns in bullet lists (use colon: `**Term**: Description`).
- [ ] No prose semicolons joining independent clauses (split into two sentences instead).
- [ ] See [prose-cleanup skill](../prose-cleanup/SKILL.md) for the full AI-marker checklist.

## Examples

### Good description (quoted, says what's inside)

```yaml
description: "Token bucket, leaky bucket, fixed and sliding windows, the four algorithms, when to pick each, where in the stack to enforce them, what to send back to clients, and the pitfalls that make a 'working' rate limiter let abuse through."
```

### Bad description (vague, unquoted with colon)

```yaml
description: Overview of rate limiting: algorithms, placement, and error codes.
```

The colon after "limiting" makes YAML parse this as a mapping. And "overview" is weak.

### Good cross-linking

```markdown
## Related topics

- [Throttling and rate limiting](./2026-04-24-throttling-and-rate-limiting/)
- [Stateless auth](./2026-04-24-stateless-auth/)
- [Django Part 5, Authentication](../topics/web/django/part-05-authentication/)
```

Each link is a relative path; each target exists; each is a real neighbor worth reading.

## Common failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| `YAMLException` during build | Unquoted description with `:`, `"`, or backtick | Quote the description |
| "language not recognized" warning | `django` or other unknown tag in fence | Use `html` or drop the tag |
| Page exists but not in sidebar | Missing or broken frontmatter | Read the frontmatter carefully |
| Link 404 in built site | Absolute instead of relative path | Use `./` or `../` |
| Deploy fails on GitHub Actions | Build passed locally but remote check skipped | Look at Actions tab; usually a YAML issue that local build caught last time |
| Mermaid diagram renders as code | Mermaid plugin not enabled | Convert to ASCII art |

## If something is unclear

Read [`docs/AUTHORING.md`](../../../docs/AUTHORING.md) for the longer version. Read a neighboring file for style, e.g. for a new Django-adjacent topic, read `topics/web/django/part-07-advanced-orm.md`; for a new post, read `posts/2026-04-24-rest-api-design.md`.

Update this skill and `docs/AUTHORING.md` every time a new convention or failure mode surfaces. Out-of-date beats missing.
