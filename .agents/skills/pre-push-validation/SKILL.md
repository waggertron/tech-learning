---
name: pre-push-validation
description: "Validate the tech-learning site before committing or pushing. Use when the user asks to push, ship, verify locally, run pre-push checks, validate site behavior, check pages, links, code examples, custom components, generated React outputs, docs workflows, or any change that could affect rendered content."
---

# Pre-push validation

## Overview

Use this skill before pushing changes. The standard is outcome-based: pages render intended content, links connect, code examples are trustworthy, and custom page behavior works.

## Workflow

1. Inspect the work:

   ```bash
   git status -sb
   git diff --stat
   ```

2. Run the full pre-push command unless there is a clear reason to narrow scope:

   ```bash
   npm run validate:pre-push
   ```

3. If Codex cannot bind the preview port during custom page checks, rerun with local preview permission. Treat `listen EPERM` as a sandbox constraint before changing application code. If deterministic checks already passed, it is acceptable to run `npm run validate:pre-push -- --skip-custom`, then rerun `npm run validate:custom-pages` with the needed permission.

4. If validation fails, fix the cause, rerun the failed tier, then rerun `npm run validate:pre-push`.

5. Before pushing, confirm:

   ```bash
   git status -sb
   pgrep -fl "astro preview|npm run preview|astro dev|vite"
   ```

   The worktree should be clean and no local preview server should remain unless the user asked to keep it running.

## Validation tiers

- **Style and safety**: `npm run validate:style` plus `scripts/check-secrets.sh`.
- **Rendered pages**: `npm run build`, then `npm run validate:pages`. Keep failure matching structural, because lesson text can mention error phrases without the page being broken.
- **Links**: `npm run validate:links` for built internal links, asset references, and hash targets. Fix Markdown links from the rendered URL, not the source file path. The checker ignores code blocks and React output regions because example literals are not site navigation. Use `npm run validate:external-links` when online and external references changed.
- **Code examples**: `npm run validate:code-examples`, `npm run check:react-outputs`, and `npm run test:react-outputs`.
- **Custom behavior**: `npm run validate:custom-pages` for browser smoke tests covering the DSL calculator, React output interaction, and representative REPL markup. Activate tabbed panels before checking hidden controls.

## Change-based additions

- **Content-only edits**: Full pre-push validation is still preferred because frontmatter, links, and generated routes break cheaply.
- **Post series or indexes**: Inspect the rendered index route and the series detail route.
- **React posts or generated examples**: Run the React output sync check and tests before the full build.
- **Components or page scripts**: Run custom page validation.
- **Docs, skills, scripts, or workflow changes**: Update `docs/feature_tracker.md` and focused docs. Add `.agents/memory/feature_tracker.md` notes when future sessions need local context.
- **External links added or changed**: Run `npm run validate:external-links` when network access is available.

## Push rule

Do not push after a failed validation tier. Do not push with local-only artifacts staged. Do not leave a preview process running after browser smoke tests.
