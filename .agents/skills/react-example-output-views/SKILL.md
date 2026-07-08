---
name: react-example-output-views
description: "Use when adding, updating, testing, or expanding output views for Modern React series examples in the tech-learning repo, including generator changes, panel markup, accessibility, and build validation."
---

# React Example Output Views

Use this skill with `react-instructional-posts`, `authoring`, and `writing-style` when work touches example output panels in the Modern React series.

## Scope

The Modern React posts live in:

```text
src/content/docs/posts/2026-07-07-react-*.md
```

Each TSX or TypeScript fence in those posts should be followed immediately by a generated output panel:

```html
<div class="react-example-output not-content" data-react-example-output="stable-id" role="region" aria-label="Output view: Example title">
  <div class="react-example-output__header">Output view</div>
  <div class="react-example-output__body">
    <p><strong>Example title.</strong> Short generated output summary.</p>
  </div>
</div>
```

The panels are static previews, not live React sandboxes. They summarize rendered shape, visible text, composed components, runtime result, test result, route data, server mutation state, or tool configuration output.

## Workflow

1. Add or edit the React example code first. Keep imports visible near the top of every TSX or TypeScript fence.
2. Run `npm run sync:react-outputs` to regenerate panels.
3. Inspect changed panels. If a summary is vague, improve `summarizeOutput()` in `scripts/sync-react-example-outputs.mjs` instead of hand-editing only one generated block.
4. Run `npm run check:react-outputs` to confirm the generator is idempotent.
5. Run `npm run test:react-outputs` to confirm coverage, imports, unique IDs, and accessibility markup.
6. Run `npm run build` before finalizing content changes.

## TDD Rule

For new output-view behavior, add or update `tests/react-example-output-views.test.mjs` first and run it to see the expected failure. Then change the generator, regenerate panels, and rerun the targeted test.

Use tests for structural guarantees. Use human review for summary quality.

## Generator Guidance

Prefer deterministic generation over manual panel edits. Expand the generator when new example shapes appear:

- JSX examples should mention rendered tags, composed components, and visible text when available.
- Reducer examples should describe the next-state transition result.
- Storybook examples should describe the component state created by the story args.
- Test examples should describe the passing assertion behavior.
- Server, route, and tool configuration examples should describe the runtime or configuration result.

Keep generated text concise, unique to the code shape, and free of placeholder language.

## Reference

Read `docs/react-example-output-views.md` before making larger changes to the convention or before designing live previews.
