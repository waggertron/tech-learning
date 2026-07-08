---
title: "Modern React 21: Framework choice and project setup"
description: "Choosing between a React framework and a smaller client-only setup."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-framework-choice-project-setup/
series:
  slug: modern-react-development
  order: 21
---

This is part 21 of the [Modern React development series](../series/modern-react-development/).

A React app needs more than components once it becomes a product. Routing, data loading, code splitting, rendering strategy, forms, mutations, deployment, and error handling all need an owner. A framework bundles answers to many of those choices.

## Concept

A React framework is an application layer around React that supplies project structure and production features. A client-only setup uses React with a build tool and adds application pieces separately.

## Terms

- **Framework**: A project structure and runtime model that handles common app concerns around React.
- **CSR**: Client-side rendering, where the browser runs JavaScript to produce the UI.
- **SSR**: Server-side rendering, where the server produces HTML for a route request.
- **SSG**: Static site generation, where HTML is produced at build time.
- **SPA**: Single-page app, a browser app that handles navigation client side after initial load.

## Mental model

Think of framework choice as deciding who owns the roads. React gives you vehicles. A framework supplies routes, loading lanes, signs, and deployment rules.

## How it is used

Choose a framework when the app needs routes, server rendering, data loading conventions, Server Components, form Actions, static generation, or production deployment defaults. Choose a smaller Vite-style setup for embedded widgets, internal tools, demos, and client-only apps with simple needs.

## How to use it

1. List the app's route, data, authentication, rendering, and deployment needs.
2. Prefer a framework when several of those needs are product requirements.
3. Use a client-only build tool when the app truly does not need framework-level features.
4. Pick tooling that supports TypeScript, linting, tests, and production builds from the start.
5. Document the rendering strategy so future features do not fight the setup.

## Example: Framework decision shape

```tsx
import type { ProjectNeed } from "./projectNeeds";

export function chooseReactStart(need: ProjectNeed) {
  if (need.routes && (need.serverRendering || need.serverMutations)) {
    return "Start with a React framework";
  }

  if (need.staticPages || need.routes) {
    return "Compare a framework with a Vite app plus router";
  }

  return "A client-only Vite app is a reasonable starting point";
}
```

The decision is about ownership of application concerns, not taste in folder names.

## Example: Client entry point

```tsx
import { createRoot } from "react-dom/client";
import { App } from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Missing root element");
}

createRoot(rootElement).render(<App />);
```

A scratch client app owns its entry point directly. A framework often generates or hides this layer.

## Details to watch

- **Framework value**: React docs recommend starting new apps and sites with a framework for production features.
- **Scratch cost**: A scratch app still needs choices for routing, data fetching, code splitting, styling, and deployment.
- **Rendering strategy**: CSR, SSR, and SSG affect performance, hosting, data access, and hydration.
- **Migration pressure**: Starting small is fine, but adding framework-like features later means the app now owns that framework work.

## Series navigation

- Previous: [Part 20: Performance and React Compiler](../2026-07-07-react-performance-and-compiler/)
- Next: [Part 22: Next.js App Router](../2026-07-07-react-nextjs-app-router/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Creating a React App](https://react.dev/learn/creating-a-react-app)
- [Build a React App from Scratch](https://react.dev/learn/build-a-react-app-from-scratch)
- [createRoot](https://react.dev/reference/react-dom/client/createRoot)
- [hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
