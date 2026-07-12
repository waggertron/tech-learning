# Feature Tracker

Last audited: 2026-07-08

This document tracks major features added to the tech-learning repo over time. It is a historical record, a current capability map, and a checklist for future feature work.

## Audit Method

This tracker was built from:

- The complete git history from `747355b` through `edce85c`.
- Current source files under `src/`, `docs/`, `scripts/`, `.agents/skills/`, `templates/`, and `.github/`.
- Current repo counts gathered from the filesystem on 2026-07-08.

The tracker groups related commits into shipped features. It does not list every typo fix, revert, or one-off cleanup unless it changed the repo's capabilities.

## Current Inventory

As of this audit, the repo contains:

- **614 Markdown or MDX content pages** under `src/content/docs/`.
- **68 posts** under `src/content/docs/posts/`.
- **6 post series pages** under `src/content/docs/posts/series/`.
- **188 coding problem pages** under `src/content/docs/topics/cs/coding-problems/`.
- **541 topic pages** under `src/content/docs/topics/`.
- **1,474 sibling code files** for examples, stubs, and coding problem approaches.
- **12 local Codex skills** under `.agents/skills/` after adding feature tracking and React output views.

## Feature Register

### Site Foundation

- **2026-04-23: Astro and Starlight site scaffold**: Added the static site, topic and post structure, templates, GitHub Pages deployment, and the original scaffold design record. Evidence: `astro.config.mjs`, `src/content/docs/`, `templates/`, `.github/workflows/deploy.yml`, `docs/plans/2026-04-23-tech-learning-scaffold-design.md`.
- **2026-04-23: GitHub Pages deployment pipeline**: Bumped the workflow to modern GitHub Actions and Node 22 so pushes to `main` deploy the site. Evidence: `.github/workflows/deploy.yml`.
- **2026-04-24: Here Be Dragons site identity**: Rebranded the site, added footer behavior, and made the sidebar visible across the site. Evidence: `src/components/Footer.astro`, `src/content/docs/index.mdx`, `src/styles/custom.css`.
- **2026-05-10: Agent operating rules**: Added `AGENTS.md` with repo-specific safety, authoring, and build rules for AI coding agents. Evidence: `AGENTS.md`.

### Content Catalog

- **2026-04-23: Core computer science catalog**: Added data structures and all 18 NeetCode 150 coding-problem categories, then wired problem lists back into data-structure pages. Evidence: `src/content/docs/topics/cs/data-structures/`, `src/content/docs/topics/cs/coding-problems/`.
- **2026-04-24: AI, web, ops, testing, and architecture expansion**: Added prompt templates, vehicle routing, Django, functional core imperative shell, skill-development material, home-health posts, GitOps, ArgoCD, MLOps, Gitflow, Kubernetes, Helm, Terraform, testing, compliance, and security posts. Evidence: `src/content/docs/topics/ai/`, `src/content/docs/topics/web/`, `src/content/docs/topics/ops/`, `src/content/docs/topics/testing/`, `src/content/docs/posts/`.
- **2026-04-24: Large language model benchmark series**: Added an 8-part large language model reasoning benchmark and metrics series. Evidence: `src/content/docs/topics/ai/benchmarks/`.
- **2026-05-04: Web framework series**: Added Express, NestJS, and React topic series, and expanded AI benchmark examples. Evidence: `src/content/docs/topics/web/express/`, `src/content/docs/topics/web/nestjs/`, `src/content/docs/topics/web/react/`.
- **2026-05-06 to 2026-05-21: System design category and case studies**: Added core system design topics, advanced patterns, interview prep, and progressive case studies with TypeScript and Go examples. Evidence: `src/content/docs/topics/system-design/`.
- **2026-05-13: Networking series**: Added a CCNA (Cisco Certified Network Associate) aligned networking series, then completed the remaining parts. Evidence: `src/content/docs/topics/networking/`.
- **2026-05-13 to 2026-05-15: Technology laws, design patterns, Python, and visual examples**: Added named technology laws, Gang of Four design pattern pages, Python topics, real visual examples on multimodal benchmarks, and Radix Tree coverage. Evidence: `src/content/docs/topics/cs/design-patterns/`, `src/content/docs/topics/python/`, `src/content/docs/topics/ai/`, `src/content/docs/topics/cs/data-structures/`.
- **2026-05-14: Learning science research document**: Added a deep research document on learning science and durable retrieval practice. Evidence: `docs/learning-science.md`.
- **2026-06-04 to 2026-06-05: Blockchain and cryptographic systems expansion**: Added cryptocurrency pages, consensus mechanisms, and distributed cryptography topics. Evidence: `src/content/docs/topics/blockchain/`, `src/content/docs/topics/cryptographic-systems/`.
- **2026-06-30 to 2026-07-01: Coding concept pages**: Added and deepened the CS coding-concepts catalog so problem pages can link to transferable patterns. Evidence: `src/content/docs/topics/cs/coding-concepts/`.

### Coding Problem Learning Features

- **2026-04-27: Complexity tables and runnable tests across coding problems**: Annotated every original coding problem with complexity tables and runnable tests, then added difficulty indexes. Evidence: `src/content/docs/topics/cs/coding-problems/`.
- **2026-04-30: Cross-page link repair**: Fixed 228 broken cross-page links and added approach code blocks to all original coding problem pages. Evidence: commit `804c4c7`, commit `144c746`.
- **2026-05-01 to 2026-05-04: Browser Python REPL**: Added a CodeMirror-powered Python REPL, code completion, runtime timing, large-input tests, and a five-second execution timeout. REPL means read evaluate print loop. Evidence: `src/components/PythonRepl.astro`, `scripts/test_build.py`, coding problem pages.
- **2026-05-04 to 2026-05-06: Named algorithms and graph theory**: Added named algorithm entries, multiple-use sections, graph theory deep dives, and canonical LeetCode links. Evidence: `src/content/docs/topics/cs/named-algorithms/`, `src/content/docs/topics/cs/graph-theory/`.
- **2026-05-07: Coding problem catalog rename and bonus expansion**: Renamed `leetcode-150` to `coding-problems`, added 32 bonus pages, and linkified problem references across the repo. Evidence: `src/content/docs/topics/cs/coding-problems/`.
- **2026-05-13: TypeScript support for coding problems**: Added TypeScript stubs, approach files, tabs, runnable TypeScript code blocks, and a TypeScript REPL. Evidence: `src/components/TypeScriptRepl.astro`, `.ts` files under `coding-problems/`.
- **2026-05-13: Go support for coding problems**: Added a Go REPL, fixed Go Playground integration, improved import detection, and added Go tabs to all coding problem pages. Evidence: `src/components/GoRepl.astro`, `.go` files under `coding-problems/`.
- **2026-05-15 to 2026-05-17: REPL hardening**: Wired missing approach tabs, fixed output hangs and stack overflows, and added missing imports. Evidence: `src/components/*Repl.astro`, `src/content/docs/topics/cs/coding-problems/`.
- **2026-06-05 to 2026-07-03: New coding problem entries and deeper explanations**: Added Increasing Triplet Subsequence, String Compression, Rotate Array, stock variants, Isomorphic Strings, and improved pointer and greedy reasoning. Evidence: matching files under `src/content/docs/topics/cs/coding-problems/`.

### Authoring, Quality, and Safety

- **2026-07-12: Reproducible prose cleanup and local QA workflow**: Captured reusable cleanup scans, planned-series page guidance, interactive post helper guidance, and Codex sandbox preview notes in the central docs and skills. Evidence: `docs/AUTHORING.md`, `.agents/skills/prose-cleanup/SKILL.md`, `.agents/skills/post-series/SKILL.md`, `.agents/memory/feature_tracker.md`.
- **2026-04-24: Authoring docs and skill conversion**: Added `docs/AUTHORING.md`, local authoring skills, and durable content rules. Evidence: `docs/AUTHORING.md`, `.agents/skills/authoring/SKILL.md`.
- **2026-04-27: Quiz and learning skills**: Added quiz and learning workflows with local ignored memory for personalized study. Evidence: `.agents/skills/quiz/SKILL.md`, `.agents/skills/learning/SKILL.md`, `.agents/memory/`.
- **2026-05-10: Secret scanning before build**: Added a prebuild scanner that blocks realistic-looking credential patterns before site output is built. Evidence: `scripts/check-secrets.sh`, `package.json`.
- **2026-05-13: Repo-wide prose cleanup phases**: Cleaned AI, CS, system design, web, testing, networking, ops, coding problems, and posts. Evidence: commit range `502fb0e` through `5220592`.
- **2026-05-15: KaTeX math support and math conversion**: Added KaTeX rendering and converted Big-O notation across hundreds of files. Evidence: `astro.config.mjs`, `src/styles/custom.css`, `scripts/convert_math.py`.
- **2026-06-30: Codex skills expansion**: Added reusable Codex skills and improved Jump Game learning material. Evidence: `.agents/skills/`.
- **2026-07-08: Feature tracking workflow**: Added this tracker, a feature-tracking skill, AGENTS rules, authoring references, and local memory guidance. Evidence: `docs/feature_tracker.md`, `.agents/skills/feature-tracking/SKILL.md`, `AGENTS.md`, `.agents/memory/feature_tracker.md`.

### Post Series

- **2026-07-12: Domain-Specific Languages series plan and value calculator**: Added a research-backed DSL series plan with tooling landscape, tradeoff criteria, implementation value scoring, and an interactive calculator that recommends normal code, existing DSL/tool adoption, an internal DSL prototype, or a custom DSL candidate from user inputs. Evidence: `src/content/docs/posts/series/domain-specific-languages/index.mdx`, `src/components/DslValueCalculator.astro`, `src/content/docs/posts/index.mdx`, `src/content/docs/posts/series/index.mdx`.
- **2026-07-07: Post series content model**: Added series frontmatter support, series landing pages, and post index discovery for grouped post sequences. Evidence: `src/content.config.ts`, `src/content/docs/posts/series/`, `src/content/docs/posts/index.mdx`.
- **2026-07-07: Modern React development series**: Added a 40-part Modern React post series covering React fundamentals, state, effects, forms, routing, frameworks, tooling, testing, deployment, and related ecosystem choices. Evidence: `src/content/docs/posts/2026-07-07-react-*.md`, `src/content/docs/posts/series/modern-react-development/index.mdx`.
- **2026-07-07 to 2026-07-08: React instructional rewrite**: Reworked the Modern React series into instructional concept guides with terms, mental models, multiple examples, pitfalls, references, and visible imports. Evidence: `.agents/skills/react-instructional-posts/SKILL.md`, React post files.
- **2026-07-08: React example output views**: Added generated output panels after every Modern React TSX or TypeScript example. Component examples are transpiled, rendered with React server rendering for the fallback, and mounted by a browser runtime for live interaction. The workflow now includes generated registry and module files, runner panels, runtime loading tests, visible UI parity checks, source-derived runner output, local browser smoke guidance, and docs for known failure modes such as partial children renders, invented runner copy, inert server-rendered buttons, async data output, and stale dev-server cache state. Evidence: `scripts/sync-react-example-outputs.mjs`, `src/scripts/react-example-runtime.tsx`, `src/generated/react-example-registry.tsx`, `src/generated/react-example-modules/`, `tests/react-example-output-views.test.mjs`, `docs/react-example-output-views.md`, `.agents/skills/react-example-output-views/SKILL.md`, `src/styles/custom.css`, React post files.

## Tracking Protocol For Future Features

Use this protocol whenever a change adds a user-visible capability, authoring workflow, generator, test surface, content model, site behavior, major content section, reusable skill, or new validation rule.

1. **Record the feature**: Add a dated entry to this file with the feature name, what changed, and evidence paths.
2. **Update docs**: Add or update a focused docs page when the feature has a workflow, convention, generator, or maintenance burden.
3. **Update skills**: Add or update a skill when the workflow should be reused by future Codex sessions.
4. **Update AGENTS.md**: Add a critical rule only when every future agent should follow it.
5. **Update local memory**: Add a note to `.agents/memory/feature_tracker.md` for in-progress reminders or local-only context. Remember that `.agents/memory/` is ignored.
6. **Test the feature**: Add a targeted test or script check when the feature has a repeatable contract.
7. **Build the site**: Run `npm run build` after content or site changes.

## Entry Template

Use this shape for new entries:

```markdown
- **YYYY-MM-DD: Feature name**: One or two sentences explaining the shipped capability and why it matters. Evidence: `path/to/file`, `path/to/other-file`.
```

If the feature is still in progress, mark the date and evidence, then replace any uncertainty before committing.
