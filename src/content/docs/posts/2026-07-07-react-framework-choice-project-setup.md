---
title: "Modern React 21: Choose a framework and prove the setup"
description: "Choose rendering ownership, run a Vite and TypeScript app, inspect a failing Effect dependency, and connect checks to CI."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-framework-choice-project-setup/
series:
  slug: modern-react-development
  order: 21
---

This is part 21 of the [Modern React development series](../series/modern-react-development/).

A React project needs owners for routes, data loading, rendering, browser assets, and release checks. Choose those owners before comparing starter templates. Then prove the chosen setup with a build and one deliberately failing check.

## Concept

React describes interface state. A framework adds application conventions such as route loading, server rendering, mutations, and error boundaries. Vite supplies a development server and production asset build. A client-only Vite application chooses the remaining application layers itself.

Server-side rendering (SSR) produces HTML for a request. Static site generation (SSG) produces HTML during a build. Client-side rendering (CSR) builds the interface in the browser. These decisions affect deployment and data access, so they belong in setup rather than becoming accidental consequences of a template.

## Mental model

A starter is a dependency decision plus an executable contract. A successful dev server proves that source can reach the browser. It does not prove type safety, a correct Effect dependency list, or a production build.

## Choose ownership from the requirement

| Requirement | Starting point | Responsibility to check |
| --- | --- | --- |
| public pages with server data and route-level loading | React framework | rendering, data/cache, deployment adapter |
| client dashboard calling an existing API | framework or Vite plus chosen router/cache | routing, authorization boundary, static-host fallback |
| embedded widget with one screen | client-only Vite app | host integration, CSS isolation, bundle loading |
| native mobile interface | optional React Native branch | renderer, device APIs, permissions, native build |

React's documentation recommends frameworks for new applications. A deliberately bounded widget or learning workbench can justify the smaller client-only choice. Do not turn framework selection into a Boolean helper that pretends to decide product requirements.

## Run the existing client-only workbench

This repository includes `companion/react-workbench/`, a small Vite app that imports the same performance, recovery, and release components as the lesson outputs. It reuses the repository's installed React, Vite, and TypeScript dependencies.

From a clean checkout:

```bash
npm ci
node node_modules/vite/bin/vite.js --config companion/react-workbench/vite.config.ts --host 127.0.0.1
```

Open the URL printed by Vite. Click the counter, break and retry a panel, and switch checkout variants. Stop the server with Ctrl-C.

## Example: An explicit Vite boundary

```typescript
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  cacheDir: ".vite",
  esbuild: { jsx: "automatic", jsxImportSource: "react" },
  build: { outDir: "dist", emptyOutDir: true },
});
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-framework-choice-project-setup-1-an-explicit-vite-boundary" data-render-mode="result" data-interaction-mode="runner" data-runner-entry="2026-07-07-react-framework-choice-project-setup-1-an-explicit-vite-boundary" role="region" aria-label="Output view: An explicit Vite boundary">
  <div class="react-example-output__header">Config result</div>
  <div class="react-example-output__body">
    <div class="react-example-output__runner" data-react-example-runner="2026-07-07-react-framework-choice-project-setup-1-an-explicit-vite-boundary">
  <button type="button" class="react-example-output__run-button">Run example</button>
  <div class="react-example-output__runner-output" aria-live="polite">
    <pre class="react-example-output__runner-pre">export default defineConfig({
  root: fileURLToPath(new URL(&quot;.&quot;, import.meta.url)),
  cacheDir: &quot;.vite&quot;,
  esbuild: { jsx: &quot;automatic&quot;, jsxImportSource: &quot;react&quot; },
  build: { outDir: &quot;dist&quot;, emptyOutDir: true },
});</pre>
  </div>
</div>
  </div>
</div>

`root` points at the directory containing this config, not the caller's working directory. The HTML entry belongs to that root. Automatic JSX handles the JSX runtime imports during transformation. This minimal workbench does not configure Fast Refresh or React Compiler.

The React Vite plugin can add the React development integration when an application needs it. Its exact configuration depends on the installed plugin version. The [performance lesson](../2026-07-07-react-performance-and-compiler/) separates Compiler setup from ordinary JSX transformation.

## Example: Own the browser entry

```tsx
import { createRoot } from "react-dom/client";
import { App } from "./App";

const element = document.getElementById("root");
if (!element) throw new Error("Missing root element");

createRoot(element).render(<App />);
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-framework-choice-project-setup-2-own-the-browser-entry" data-render-mode="result" data-interaction-mode="runner" data-runner-entry="2026-07-07-react-framework-choice-project-setup-2-own-the-browser-entry" role="region" aria-label="Output view: Own the browser entry">
  <div class="react-example-output__header">Browser result</div>
  <div class="react-example-output__body">
    <div class="react-example-output__runner" data-react-example-runner="2026-07-07-react-framework-choice-project-setup-2-own-the-browser-entry">
  <button type="button" class="react-example-output__run-button">Run example</button>
  <div class="react-example-output__runner-output" aria-live="polite">
    <pre class="react-example-output__runner-pre">const element = document.getElementById(&quot;root&quot;);
if (!element) throw new Error(&quot;Missing root element&quot;);
createRoot(element).render(&lt;App /&gt;);</pre>
  </div>
</div>
  </div>
</div>

The `index.html` file supplies `<div id="root"></div>` and a module script pointing at the entry. The complete workbench entry also loads public runtime configuration before mounting. A framework usually owns this entry layer for its routes.

## Type-check before building

Vite transforms TypeScript, but a successful Vite build is not a full TypeScript check. Run both:

```bash
node node_modules/typescript/bin/tsc --noEmit --jsx react-jsx --module esnext --moduleResolution bundler --target es2022 --esModuleInterop --strict --types react,react-dom,node companion/react-workbench/src/main.tsx
node node_modules/vite/bin/vite.js build --config companion/react-workbench/vite.config.ts
```

The first command checks the entry and its imports without emitting files. The second writes the production HTML, hashed assets, and copied runtime configuration under `companion/react-workbench/dist/`.

To see the type gate fail, temporarily change `initialEnabled={config.newCheckout}` in the workbench entry to `initialEnabled="yes"`. The type checker reports that `string` is not assignable to `boolean`. Restore the Boolean expression and rerun the check. This catches a contract mismatch before browser behavior makes it ambiguous.

The formatter installed in this checkout can check the companion without rewriting it:

```bash
node node_modules/prettier/bin/prettier.cjs --check 'companion/react-workbench/src/**/*.tsx' companion/react-workbench/vite.config.ts
```

## An Effect diagnostic that changes behavior

Consider this dependency list:

```javascript
import { useEffect } from "react";

export function RoomTitle({ roomId }) {
  useEffect(() => {
    document.title = `Room ${roomId}`;
  }, []);
  return null;
}
```

The first render can appear correct. After `roomId` changes, the title stays stale because the Effect does not rerun. The Hooks `exhaustive-deps` rule reports the missing `roomId` dependency. Adding `[roomId]` makes the Effect resynchronize when that input changes:

```javascript
import { useEffect } from "react";

export function RoomTitle({ roomId }) {
  useEffect(() => {
    document.title = `Room ${roomId}`;
  }, [roomId]);
  return null;
}
```

Do not silence the diagnostic with an empty array. The array states which reactive inputs control synchronization, not a preference to run code only once. If synchronization should have a different lifetime, change the code's ownership and inputs first.

## Lint configuration

An application that installs ESLint and `eslint-plugin-react-hooks` can use this flat configuration in `eslint.config.mjs`:

```javascript
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    files: ["**/*.{js,jsx}"],
    plugins: { "react-hooks": reactHooks },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
];
```

Run `eslint RoomTitle.jsx` against the broken source, observe the diagnostic, then fix the dependency array and run it again. TypeScript linting also needs a TypeScript-aware parser/configuration; the JavaScript configuration above does not claim to parse TypeScript.

## Run the Compiler and lint checks

The executable check uses separate tooling versions while leaving the app's dependency set unchanged. From the repository root:

```bash
REACT_TOOLING_DIR="$(mktemp -d)"
npm install --prefix "$REACT_TOOLING_DIR" --no-audit --no-fund --save-exact babel-plugin-react-compiler@1.0.0 eslint@10.15.0 eslint-plugin-react-hooks@7.1.1
node companion/react-workbench/check-tooling.mjs "$REACT_TOOLING_DIR"
```

The script loads those packages from the supplied directory. It lints `tooling/RoomTitleBroken.jsx` and requires an `exhaustive-deps` diagnostic. It then lints `tooling/RoomTitleFixed.jsx` and requires zero errors or warnings. The observed diagnostic is:

```text
React Hook useEffect has a missing dependency: 'roomId'. Either include it or remove the dependency array.
```

It also transforms a small Compiler probe, inspects its emitted memoization, and builds the whole Vite workbench with the Compiler enabled. The checks write full lint results, transformed code, and tool versions under `companion/react-workbench/.tooling/` for inspection.

This sequence passed with Compiler 1.0.0, ESLint 10.15.0, and Hooks plugin 7.1.1. These are recorded specimen versions, not a claim that a different installed major uses the same configuration. The [performance lesson](../2026-07-07-react-performance-and-compiler/#optional-compiler-setup) explains the older React Vite plugin integration used by the workbench.

## Connect the same commands to continuous integration

A project workflow can run the existing workbench gates with no additional application dependencies:

```yaml
name: React workbench
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: node node_modules/typescript/bin/tsc --noEmit --jsx react-jsx --module esnext --moduleResolution bundler --target es2022 --esModuleInterop --strict --types react,react-dom,node companion/react-workbench/src/main.tsx
      - run: node node_modules/vite/bin/vite.js build --config companion/react-workbench/vite.config.ts
      - run: node node_modules/prettier/bin/prettier.cjs --check 'companion/react-workbench/src/**/*.tsx' companion/react-workbench/vite.config.ts
```

Each command exits nonzero on its own failure. Add the versioned `check-tooling.mjs` invocation as a CI step when this Compiler and lint experiment is part of the project gate. Supply its tooling directory the same way as locally. A full application can instead declare these tools in its own development dependencies and run the same rules through ordinary package scripts.

Browser behavior requires installing the matching Playwright browser and running the interaction checks, separately from a static build.

## Details to watch

- **Client configuration**: Bundled environment variables and fetched public configuration are visible to users. Put server-only decisions behind a server boundary.
- **Routing**: A plain static server does not automatically return the app entry for every nested route.
- **Gate ownership**: Name exactly what ran. A type checker, formatter, lint rule, and browser test prove different things.
- **Native branch**: Continue to the [React Native rendering comparison](../2026-07-07-react-expo-react-native/) only when the native renderer is relevant.

## Series navigation

- Previous: [Part 20: Measure render work and understand Compiler](../2026-07-07-react-performance-and-compiler/)
- Next: [Part 22: Next.js App Router](../2026-07-07-react-nextjs-app-router/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Creating a React app](https://react.dev/learn/creating-a-react-app) explains framework ownership.
- [Building from scratch](https://react.dev/learn/build-a-react-app-from-scratch) names the additional choices a client app owns.
- [Vite guide](https://vite.dev/guide/) explains the HTML entry and build process.
- [Hooks lint rules](https://react.dev/reference/eslint-plugin-react-hooks) explain React's lint diagnostics.
- [exhaustive-deps](https://react.dev/reference/eslint-plugin-react-hooks/lints/exhaustive-deps) connects dependency lists to synchronization.

## Related topics

- [Effects, synchronization, and cleanup](../2026-07-07-react-effects-synchronization-cleanup/)
- [Testing components by behavior](../2026-07-07-react-testing-components-by-behavior/)
