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

Each TSX or TypeScript fence in those posts should be followed immediately by a generated output panel. Component examples should be rendered from the actual snippet with React server rendering:

```html
<div class="react-example-output not-content" data-react-example-output="stable-id" data-render-mode="react-server" role="region" aria-label="Output view: Example title">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered">...</div>
  </div>
</div>
```

The panels are build-time rendered output, not live React sandboxes. Use `data-render-mode="result"` only for tests, browser entrypoints, config files, route registration objects, reducers, server functions, and examples whose real output belongs to a runner or framework runtime.

## Workflow

1. Add or edit the React example code first. Keep imports visible near the top of every TSX or TypeScript fence.
2. Run `npm run sync:react-outputs` to regenerate panels.
3. Inspect changed panels. If a component cannot render because a local helper is missing, add a real companion module under `src/content/docs/posts/_react-example-modules/` instead of faking the output.
4. Run `npm run check:react-outputs` to confirm the generator is idempotent.
5. Run `npm run test:react-outputs` to confirm coverage, imports, unique IDs, and accessibility markup.
6. Run `npm run build` before finalizing content changes.

## TDD Rule

For new output-view behavior, add or update `tests/react-example-output-views.test.mjs` first and run it to see the expected failure. Then change the generator, regenerate panels, and rerun the targeted test.

Use tests for structural guarantees. Use human review for visual quality.

## Generator Guidance

Prefer deterministic generation over manual panel edits. Expand the renderer when new example shapes appear:

- TSX component examples should execute through `react-dom/server`.
- Local snippet imports should resolve to `_react-example-modules/`.
- Storybook stories can render the story component with the exported story args.
- Test examples should stay in result mode unless a runner is added.
- Server, route, and tool configuration examples should stay in result mode unless their framework runtime is added.

Do not replace failed renders with prose that pretends to be UI output. Either make the example render or mark it as result mode.

## Reference

Read `docs/react-example-output-views.md` before making larger changes to the convention or before designing live previews.
