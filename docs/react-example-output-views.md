# React Example Output Views

The Modern React series shows an output view after each TSX or TypeScript example. Component examples are transpiled and rendered with React server rendering so readers see actual output from the snippet. Non-component examples show a result panel for the runner, browser entrypoint, configuration, or framework runtime they target.

These panels are generated at authoring time. They do not hydrate in the browser. That choice keeps the posts simple Markdown, keeps the build deterministic, and leaves room for a future live preview layer to target the same output IDs.

## Files

- `scripts/sync-react-example-outputs.mjs`: Transpiles examples, resolves local example modules, renders component examples with React server rendering, and updates output panels.
- `tests/react-example-output-views.test.mjs`: Verifies coverage, import visibility, stable IDs, and accessible panel markup.
- `src/styles/custom.css`: Styles the output panels.
- `src/content/docs/posts/2026-07-07-react-*.md`: Receives generated output panels after each TSX or TypeScript fence.
- `src/content/docs/posts/_react-example-modules/`: Companion modules used when snippets import local helpers such as `./ProductCard`.

## Panel Contract

Every React example code fence uses this shape:

````markdown
```tsx
import { useState } from "react";

export function Example() {
  return <button>Save</button>;
}
```

<div class="react-example-output not-content" data-react-example-output="stable-id" data-render-mode="react-server" role="region" aria-label="Output view: Example title">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><button>Save</button></div>
  </div>
</div>
````

The `data-react-example-output` value is stable and unique. Use it as the anchor if a future client-side enhancement wants to mount richer previews.

## Authoring Workflow

1. Add or edit the React example code. Keep imports visible near the top of each TSX or TypeScript fence.
2. Run `npm run sync:react-outputs`.
3. Inspect any generated output that changed. If a component cannot render because it imports a missing local helper, add the helper under `_react-example-modules/` rather than hand-writing a one-off panel.
4. Run `npm run check:react-outputs`.
5. Run `npm run test:react-outputs`.
6. Run `npm run build`.

## TDD Workflow

For new behavior, add or update the content test before changing the generator. The expected red state should identify the missing or malformed output panel. After implementation, `npm run test:react-outputs` must pass before the full build.

Use the test to enforce structure and render mode. Visual quality still needs a human review pass because real HTML can be technically correct but poorly framed.

## Generator Rules

The generator reads every Modern React post matching `2026-07-07-react-*.md`, finds TSX and TypeScript fences, and inserts one output panel immediately after each fence.

For component examples, the generator:

- Transpiles TSX with TypeScript.
- Resolves package imports from `node_modules`.
- Resolves local snippet imports from `_react-example-modules/`.
- Evaluates the module in a deterministic sandbox.
- Renders the selected exported component with `react-dom/server`.
- Wraps the resulting HTML in `data-render-mode="react-server"`.

For non-component examples, the generator emits `data-render-mode="result"` with a short result panel. Use result mode for tests, browser `createRoot` entrypoints, config files, route registration objects, reducers, server functions, and other examples whose real output belongs to a runner or framework runtime.

Prefer expanding the renderer, fixtures, or `_react-example-modules/` when a new component shape appears. Avoid manual edits to generated panels.

## Future Expansion

A live output view can build on the current markup instead of replacing it:

- Keep the server-rendered HTML as the no-JavaScript fallback.
- Use `data-react-example-output` to map a code fence to a preview mount point.
- Start with isolated examples that have local fixtures and no framework runtime requirement.
- Keep server, test, and configuration examples as static result summaries unless there is a clear interactive value.
