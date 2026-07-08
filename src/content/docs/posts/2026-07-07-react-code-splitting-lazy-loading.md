---
title: "Modern React 34: Code splitting and lazy loading"
description: "Code splitting with lazy imports and Suspense boundaries for less initial JavaScript."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-code-splitting-lazy-loading/
series:
  slug: modern-react-development
  order: 34
---

This is part 34 of the [Modern React development series](../series/modern-react-development/).

A React app does not need to send every component to the browser before the first screen can work. Code splitting lets the app load some code later, and `lazy` connects that delayed code to Suspense.

## Concept

`lazy` declares a component whose code is loaded the first time React tries to render it. While the loading Promise is pending, the component suspends and the nearest Suspense boundary shows its fallback.

## Terms

- **Code splitting**: Breaking a JavaScript bundle into chunks that can load separately.
- **Lazy loading**: Loading code or assets only when they are needed.
- **Dynamic import**: The `import()` syntax that returns a Promise for a module.
- **Chunk**: A piece of bundled JavaScript emitted by the build tool.

## Mental model

Think of lazy code as a room behind a closed door. The first time the user goes there, React asks the bundler for the room's code and Suspense covers the wait.

## How it is used

Use lazy loading for routes, admin panels, charts, editors, modals with heavy dependencies, rarely used settings, and any component that pulls a large library not needed on initial view.

## How to use it

1. Declare `lazy` components outside rendering functions.
2. Return a dynamic import that resolves to a default component export.
3. Wrap the lazy component in a Suspense boundary.
4. Use route-level code splitting when navigation is the natural boundary.
5. Preload or prefetch expensive chunks when the user is likely to need them soon.

## Example: Lazy chart

```tsx
import { lazy, Suspense } from "react";

const RevenueChart = lazy(() => import("./RevenueChart"));

export function AnalyticsPanel() {
  return (
    <Suspense fallback={<p>Loading chart...</p>}>
      <RevenueChart />
    </Suspense>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-code-splitting-lazy-loading-1-lazy-chart" data-render-mode="react-server" role="region" aria-label="Output view: Lazy chart">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><p>Loading chart...</p></div>
  </div>
</div>

The chart code is requested when the panel renders, and Suspense owns the loading UI.

## Example: Lazy route table

```tsx
import { lazy } from "react";

const AdminUsersPage = lazy(() => import("./routes/AdminUsersPage"));
const PublicHomePage = lazy(() => import("./routes/PublicHomePage"));

export const routes = [
  { path: "/", element: <PublicHomePage /> },
  { path: "/admin/users", element: <AdminUsersPage /> },
];
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-code-splitting-lazy-loading-2-lazy-route-table" data-render-mode="result" role="region" aria-label="Output view: Lazy route table">
  <div class="react-example-output__header">Runtime result</div>
  <div class="react-example-output__body">
    <p><strong>Lazy route table.</strong> This example requires its framework runtime to render on the page: No exported React component found..</p>
  </div>
</div>

Route boundaries are natural split points because users only need the code for the route they visit.

## Details to watch

- **Declaration location**: Declare lazy components outside other components so React does not reset them every render.
- **Default export**: `lazy` expects the dynamic import to resolve to a module with a `default` component.
- **Fallback quality**: Use a fallback that fits the region's layout to avoid jarring jumps.
- **Over-splitting**: Too many tiny chunks can add network overhead. Split at meaningful boundaries.

## Series navigation

- Previous: [Part 33: Error boundaries and recovery](../2026-07-07-react-error-boundaries-recovery/)
- Next: [Part 35: Styling, design tokens, and variants](../2026-07-07-react-styling-design-tokens-variants/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [lazy](https://react.dev/reference/react/lazy)
- [Suspense](https://react.dev/reference/react/Suspense)
- [Build a React App from Scratch, code splitting](https://react.dev/learn/build-a-react-app-from-scratch)
- [Next.js Lazy Loading](https://nextjs.org/docs/app/guides/lazy-loading)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
