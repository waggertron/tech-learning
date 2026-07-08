---
name: react-example-output-views
description: "Use when adding, updating, testing, or expanding working output views for Modern React series examples in the tech-learning repo, including live React behavior, runner modes, generator changes, panel markup, accessibility, and build validation."
---

# React Example Output Views

Use this skill with `react-instructional-posts`, `authoring`, and `writing-style` when work touches example output panels in the Modern React series.

## Scope

The Modern React posts live in:

```text
src/content/docs/posts/2026-07-07-react-*.md
```

Each TSX or TypeScript fence in those posts should be followed immediately by a generated output panel. The panel should be a working example surface, not a shallow display of markup. Component examples should render from the actual snippet with React server rendering for the no-JavaScript fallback, then mount in the browser so buttons, inputs, forms, tabs, and state changes work.

```html
<div class="react-example-output not-content" data-react-example-output="stable-id" data-render-mode="react-server" data-interaction-mode="live-component" role="region" aria-label="Output view: Example title">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered">...</div>
  </div>
</div>
```

Panels are progressively enhanced:

- `data-interaction-mode="live-component"`: Browser JavaScript mounts the real React component from the example registry. User interaction should work.
- `data-interaction-mode="runner"`: A non-visual example exposes a real run control or deterministic execution result. Use this for tests, browser entrypoints, config files, route registration objects, reducers, server functions, and examples whose real output belongs to a runner or framework runtime.
- `data-interaction-mode="static"`: Use only as an explicit exception when a real runtime cannot be made safe. Document why in the generator or docs.

Do not leave inert panels that only describe what would happen.

## Workflow

1. Add or edit the React example code first. Keep imports visible near the top of every TSX or TypeScript fence.
2. Run `npm run sync:react-outputs` to regenerate panels and the browser registry.
3. Inspect changed panels. If a component cannot render because a local helper is missing, add a real companion module under `src/content/docs/posts/_react-example-modules/` instead of faking the output.
4. Confirm each changed component example has a live browser behavior or a clear runner mode.
5. Run `npm run check:react-outputs` to confirm the generator is idempotent.
6. Run `npm run test:react-outputs` to confirm coverage, imports, unique IDs, accessibility markup, and interaction modes.
7. Run the browser smoke test when runtime behavior changes. Verify the output is not merely visible: click buttons, type into inputs, open disclosures, and confirm local state changes in the page.
8. Run `npm run build` before finalizing content changes.

## TDD Rule

For new output-view behavior, add or update `tests/react-example-output-views.test.mjs` first and run it to see the expected failure. Then change the generator, regenerate panels, and rerun the targeted test.

Use tests for structural guarantees and representative interactions. Use human review for visual quality.

## Runtime Lessons

Server-rendered output can look correct while the example is still inert. Treat a visible button as only the fallback state until a browser click confirms the handler is attached.

Keep the runtime script Astro-processed:

```astro
<script>
  import '../scripts/react-example-runtime';
</script>
```

Do not add `is:inline` or an inline `type="module"` attribute to that script. Inline scripts are not processed by Astro, so package imports and generated module imports can fail in the browser.

The runtime should activate both before and after `DOMContentLoaded`:

- If the document is still loading, listen for `DOMContentLoaded`.
- If the document is already parsed, call the activation function immediately.

Mount live documentation islands with `createRoot`, not `hydrateRoot`. These examples often render valid fallback HTML that is not byte-identical to the client tree, such as text node splitting, Suspense fallbacks, or framework examples. Hydration mismatch errors can clear or replace output and make debugging harder.

Keep Vite esbuild automatic JSX enabled in `astro.config.mjs`:

```js
esbuild: {
  jsx: 'automatic',
  jsxImportSource: 'react',
}
```

This gives generated TSX and local helper modules the React JSX runtime. Do not add the React Vite plugin unless its dev preamble is handled, because this Astro docs shell does not inject the standalone React Fast Refresh preamble.

When live examples do not respond to clicks, check these in order:

1. The page source includes the bundled runtime script.
2. The registry `modulePath` resolves against the `import.meta.glob` keys.
3. The generated module exports the selected component.
4. The component is mounted into `.react-example-output__rendered`.
5. A local browser smoke test proves the handler changes visible UI.

## Generator Guidance

Prefer deterministic generation over manual panel edits. Expand the renderer and live registry when new example shapes appear:

- TSX component examples should execute through `react-dom/server`.
- TSX component examples should have a browser-mountable registry entry whenever the code can safely run in the page.
- Local snippet imports should resolve to `_react-example-modules/`.
- Storybook stories can render the story component with the exported story args.
- Test examples should use runner mode unless a full test runner is added.
- Server, async Server Component, route, and tool configuration examples should use runner mode unless their framework runtime is added.

Do not replace failed renders with prose that pretends to be UI output. Either make the example render with working behavior, add a runner, or mark it as a documented static exception.

## Reference

Read `docs/react-example-output-views.md` before making larger changes to the convention or before designing live previews.
