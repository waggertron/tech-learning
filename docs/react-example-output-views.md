# React Example Output Views

The Modern React series shows an output view after each TSX or TypeScript example. Component examples are transpiled and rendered with React server rendering so readers see actual output from the snippet, then browser JavaScript mounts the same generated module so event handlers and local state work. Non-component examples show a runner panel for the browser entrypoint, configuration, test, or framework runtime they target.

These panels are generated at authoring time and progressively enhanced in the browser. The server-rendered HTML is the no-JavaScript fallback. The browser runtime is responsible for loading the generated registry, resolving the generated module, and mounting the real React component into the output container with `createRoot`.

## Files

- `scripts/sync-react-example-outputs.mjs`: Transpiles examples, resolves local example modules, renders component examples with React server rendering, and updates output panels.
- `src/generated/react-example-registry.tsx`: Generated registry of output IDs, module paths, fixture props, render modes, and interaction modes.
- `src/generated/react-example-modules/`: Generated browser modules compiled from live component examples.
- `src/scripts/react-example-runtime.tsx`: Browser runtime that mounts live component examples and wires runner examples.
- `tests/react-example-output-views.test.mjs`: Verifies coverage, import visibility, stable IDs, and accessible panel markup.
- `src/styles/custom.css`: Styles the output panels.
- `src/content/docs/posts/2026-07-07-react-*.md`: Receives generated output panels after each TSX or TypeScript fence.
- `src/content/docs/posts/_react-example-modules/`: Companion modules used when snippets import local helpers such as `./ProductCard`.
- `astro.config.mjs`: Enables Vite esbuild automatic JSX for generated TSX modules.

## Panel Contract

Every React example code fence uses this shape:

````markdown
```tsx
import { useState } from "react";

export function Example() {
  return <button>Save</button>;
}
```

<div class="react-example-output not-content" data-react-example-output="stable-id" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/stable-id.tsx" role="region" aria-label="Output view: Example title">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><button>Save</button></div>
  </div>
</div>
````

The `data-react-example-output` value is stable and unique. Use it as the registry key for browser behavior.

`data-interaction-mode` defines how the panel behaves:

- `live-component`: Browser JavaScript loads the generated module and mounts the real React component. Clicks, inputs, toggles, tabs, and local state should work.
- `runner`: Browser JavaScript wires a deterministic run control or result for examples that do not have a standalone visual component.
- `static`: Reserved for explicit exceptions. Do not use it as a silent fallback.

## Reading Live Output

The visible panel is the result of the example code, not a prose explanation of the code. A data-fetching example can legitimately move from fallback HTML to a resolved client state after the browser runtime mounts. For example, a TanStack Query example may start from `Loading project...` and settle on `Launch plan` once the local fixture fetch resolves.

Evaluate each panel by the example's runtime contract:

- A pure display component should show the fixture props.
- A `children` example should preserve every visible child node, not only the first child or the parent container.
- A stateful component should respond to clicks, input, toggles, or tabs.
- A cached data component should show loading, error, or resolved data according to the fixture and client cache state.
- A framework-only example should stay in runner mode unless the page supplies the framework runtime it needs.
- A runner panel should show source-derived text or a real deterministic result. It should not show generated explanation copy as the result.

## Authoring Workflow

1. Add or edit the React example code. Keep imports visible near the top of each TSX or TypeScript fence.
2. Run `npm run sync:react-outputs`.
3. Inspect any generated output that changed. If a component cannot render because it imports a missing local helper, add the helper under `_react-example-modules/` rather than hand-writing a one-off panel.
4. Run `npm run check:react-outputs`.
5. Run `npm run test:react-outputs`.
6. Run a local browser smoke test on changed live examples. At minimum, click a stateful example on `npm run dev`.
7. Run `npm run build`.

## TDD Workflow

For new behavior, add or update the content test before changing the generator. The expected red state should identify the missing or malformed output panel. After implementation, `npm run test:react-outputs` must pass before the full build.

Use the test to enforce structure, render mode, interaction mode, runtime loading, registry wiring, fixture fidelity, visible UI text parity, and the ban on generated runner explanation copy. Browser behavior still needs a smoke test because static markup can look correct while the handler is not attached.

## Generator Rules

The generator reads every Modern React post matching `2026-07-07-react-*.md`, finds TSX and TypeScript fences, and inserts one output panel immediately after each fence.

For component examples, the generator:

- Transpiles TSX with TypeScript.
- Resolves package imports from `node_modules`.
- Resolves local snippet imports from `_react-example-modules/`.
- Evaluates the module in a deterministic sandbox.
- Renders the selected exported component with `react-dom/server`.
- Wraps the resulting HTML in `data-render-mode="react-server"`.
- Emits a generated browser module when the example can safely run in the page.
- Emits a registry entry with fixture props and `data-interaction-mode="live-component"`.

Some examples are useful as rendered teaching examples but noisy or incorrect as browser bundles. Keep examples that import framework packages with module-level React directives, such as TanStack Query, React Router, and React Native, out of `live-component` mode unless the docs shell owns the matching runtime. They can still render fallback HTML from the server-side generator.

Generated browser modules strip top-level `"use client"` and `"use server"` directives. The article code fence keeps the directive for teaching, but the generated docs island does not pass framework-only directives into Vite's browser bundle.

For non-component examples, the generator emits `data-render-mode="result"` with a runner panel. Use result mode for tests, browser `createRoot` entrypoints, config files, route registration objects, server functions, and other examples whose real output belongs to a runner or framework runtime. Runner content comes from the code fence or from a deterministic runner. Do not fill it with prose invented by the generator.

Prefer expanding the renderer, fixtures, or `_react-example-modules/` when a new component shape appears. Avoid manual edits to generated panels.

## Runtime Failure Patterns

- **Bundling failure**: Do not load `src/scripts/react-example-runtime.tsx` with `is:inline` or an inline `type="module"` script. Astro will not process package imports there, and the browser will try to resolve the source path directly.
- **JSX runtime failure**: Generated `.tsx` modules and local helper modules need Vite esbuild automatic JSX in `astro.config.mjs`. Without it, the browser can throw `React is not defined` after clearing the fallback output.
- **Fast Refresh preamble failure**: Do not add the React Vite plugin here unless the preamble is handled. In dev, the plugin can throw `@vitejs/plugin-react can't detect preamble` in this Astro docs shell.
- **Timing failure**: The runtime must activate immediately when `document.readyState` is no longer `loading`, because bundled scripts can run after `DOMContentLoaded`.
- **Registry mismatch**: The registry module path and `import.meta.glob` keys must resolve to the same generated module. If they do not, the page shows server-rendered HTML but event handlers stay inert.
- **Hydration mismatch noise**: Output panels are documentation islands. Use `createRoot` to mount them as client previews instead of `hydrateRoot`, because many examples render equivalent but not byte-identical server and client trees.
- **Server component mismatch**: Async Server Components, route modules, and framework-only examples should stay out of `live-component` mode unless there is a true browser runtime for them.
- **Module directive warnings**: Do not silence Vite warnings globally for `"use client"`. Keep the directive in the article, strip it from generated browser modules, and keep directive-bearing framework packages out of live modules.
- **False success**: Seeing the correct output HTML is not enough. Click a stateful example, such as the counter in the Events and local state post, before shipping runtime changes.
- **Partial children render**: If a component receives multiple children, compare the output against every visible child in the code fence. A missing button beside a rendered paragraph means the fixture or serializer dropped part of the React tree.
- **Visible text drift**: Generated tests should compare unconditional visible JSX text with the rendered output region. Include accessible attribute text such as `aria-label`, `title`, and `placeholder`; exclude conditional loading, error, and interaction-only text.
- **Invented runner copy**: Runner output is not a place for helper prose such as "The code exports..." or "This example requires...". Convert the example to a live component when it can produce UI. Otherwise show source-derived content or a real runner result.
- **Locator ambiguity**: Browser tests should scope assertions to the output region. Code blocks often contain the same visible text as the rendered output.
- **Dev server cache state**: Running the full build while `npm run dev` is active can leave the dev server with stale content or dependency optimization state. If routes suddenly return missing content or `504 Outdated Optimize Dep`, restart the dev server before debugging app code.

## Future Expansion

- Keep the server-rendered HTML as the no-JavaScript fallback.
- Add browser smoke coverage for representative live examples when runtime behavior changes.
- Include at least one async data example and one stateful click example in runtime smoke checks.
- Start new runtime features with isolated examples that have local fixtures and no framework runtime requirement.
- Keep server, test, and configuration examples in runner mode unless there is a clear interactive value.
