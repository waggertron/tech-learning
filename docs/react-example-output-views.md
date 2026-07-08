# React Example Output Views

The Modern React series shows an output view after each TSX or TypeScript example. The view gives readers a quick sense of the rendered shape, runtime result, test result, or tool configuration produced by the code.

These panels are static explanatory previews. They do not execute React in the browser. That choice keeps the posts simple Markdown, keeps the build deterministic, and leaves room for a future live preview layer to target the same output IDs.

## Files

- `scripts/sync-react-example-outputs.mjs`: Generates and updates output panels.
- `tests/react-example-output-views.test.mjs`: Verifies coverage, import visibility, stable IDs, and accessible panel markup.
- `src/styles/custom.css`: Styles the output panels.
- `src/content/docs/posts/2026-07-07-react-*.md`: Receives generated output panels after each TSX or TypeScript fence.

## Panel Contract

Every React example code fence uses this shape:

````markdown
```tsx
import { useState } from "react";

export function Example() {
  return <button>Save</button>;
}
```

<div class="react-example-output not-content" data-react-example-output="stable-id" role="region" aria-label="Output view: Example title">
  <div class="react-example-output__header">Output view</div>
  <div class="react-example-output__body">
    <p><strong>Example title.</strong> Short generated output summary.</p>
  </div>
</div>
````

The `data-react-example-output` value is stable and unique. Use it as the anchor if a future client-side enhancement wants to mount richer previews.

## Authoring Workflow

1. Add or edit the React example code. Keep imports visible near the top of each TSX or TypeScript fence.
2. Run `npm run sync:react-outputs`.
3. Inspect any generated summary that changed. If the summary is too generic, improve the generator heuristic rather than hand-writing a one-off panel.
4. Run `npm run check:react-outputs`.
5. Run `npm run test:react-outputs`.
6. Run `npm run build`.

## TDD Workflow

For new behavior, add or update the content test before changing the generator. The expected red state should identify the missing or malformed output panel. After implementation, `npm run test:react-outputs` must pass before the full build.

Use the test to enforce structure, not taste. Copy quality still needs a human review pass because generated summaries can be technically present but too vague.

## Generator Rules

The generator reads every Modern React post matching `2026-07-07-react-*.md`, finds TSX and TypeScript fences, and inserts one output panel immediately after each fence.

The summary logic looks for:

- JSX tags and visible text.
- Composed components.
- Storybook metadata and story args.
- Tests with expectations.
- Reducers with action branches.
- Tool configuration functions.
- Server functions and route loaders.

Prefer expanding `summarizeOutput()` when a new example shape appears. Avoid manual edits to generated panels unless the generator cannot reasonably support the pattern yet.

## Future Expansion

A live output view can build on the current markup instead of replacing it:

- Keep the static text as the no-JavaScript fallback.
- Use `data-react-example-output` to map a code fence to a preview mount point.
- Start with isolated examples that have local fixtures and no framework runtime requirement.
- Keep server, test, and configuration examples as static result summaries unless there is a clear interactive value.
