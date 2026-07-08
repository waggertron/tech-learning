---
title: "Modern React 33: Error boundaries and recovery"
description: "Error boundaries, fallback UI, and recovery paths for render-time failures."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-error-boundaries-recovery/
series:
  slug: modern-react-development
  order: 33
---

This is part 33 of the [Modern React development series](../series/modern-react-development/).

A React render can fail because a component throws. Error boundaries catch those render-time failures below a chosen point in the tree and replace that region with fallback UI instead of losing the whole app.

## Concept

An error boundary is a component boundary that catches errors thrown while rendering, in lifecycle methods, or in constructors of class components below it. React's current docs also connect root error callbacks and router or framework error files to production reporting.

## Terms

- **Error boundary**: A boundary that catches render-time errors from descendants and renders fallback UI.
- **Fallback UI**: The replacement UI shown when the boundary catches an error.
- **Recovery**: The path that lets the user retry, navigate away, or reset the failed region.
- **Root error callback**: A `createRoot` option for reporting caught, uncaught, or recoverable errors in production.

## Mental model

Think of an error boundary as a circuit breaker for a section of UI. When a child throws, the boundary trips and keeps the rest of the page powered.

## How it is used

Use error boundaries around route regions, dashboards, widgets that rely on external data, embeddable components, and product areas where a local fallback is better than a blank app.

## How to use it

1. Place boundaries around user-meaningful UI regions.
2. Render fallback UI that explains the failed region and offers a next action.
3. Add a reset path, such as a retry key, route navigation, or explicit reset button.
4. Report caught errors with component stack information.
5. Pair error boundaries with Suspense when the region also has loading behavior.

## Example: Boundary usage

```tsx
import { ActivityPanel } from "./ActivityPanel";
import { ErrorBoundary } from "./ErrorBoundary";
import { PanelError } from "./PanelError";
import { RevenuePanel } from "./RevenuePanel";

export function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>
      <ErrorBoundary fallback={<PanelError />}>
        <RevenuePanel />
      </ErrorBoundary>
      <ErrorBoundary fallback={<PanelError />}>
        <ActivityPanel />
      </ErrorBoundary>
    </main>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-error-boundaries-recovery-1-boundary-usage" role="region" aria-label="Output view: Boundary usage">
  <div class="react-example-output__header">Output view</div>
  <div class="react-example-output__body">
    <p><strong>Boundary usage.</strong> <code>DashboardPage</code> renders <code>&lt;main&gt;</code> and <code>&lt;h1&gt;</code> markup. It composes <code>ErrorBoundary</code>, <code>PanelError</code>, <code>RevenuePanel</code>, and <code>ActivityPanel</code>. Visible text can include <code>Dashboard</code>.</p>
  </div>
</div>

Separate boundaries let one panel fail without replacing the whole dashboard.

## Example: Root production reporting

```tsx
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!, {
  onCaughtError(error, errorInfo) {
    reportError({
      error,
      componentStack: errorInfo.componentStack,
    });
  },
}).render(<App />);
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-error-boundaries-recovery-2-root-production-reporting" role="region" aria-label="Output view: Root production reporting">
  <div class="react-example-output__header">Output view</div>
  <div class="react-example-output__body">
    <p><strong>Root production reporting.</strong> The example renders <code>App</code> components. It composes <code>App</code>.</p>
  </div>
</div>

Root callbacks are a production reporting hook. They do not replace user-facing recovery UI.

## Details to watch

- **Error type**: Error boundaries catch render-time errors, not every async error in event handlers or server code.
- **Boundary size**: A boundary should map to a region the user can understand.
- **Reset**: Fallback UI without a recovery path can trap the user in an error state.
- **Framework routes**: Frameworks often provide route-level error files or boundary APIs. Use the local convention.

## Series navigation

- Previous: [Part 32: Mutations and cache invalidation](../2026-07-07-react-mutations-cache-invalidation/)
- Next: [Part 34: Code splitting and lazy loading](../2026-07-07-react-code-splitting-lazy-loading/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [createRoot error logging](https://react.dev/reference/react-dom/client/createRoot)
- [useTransition error boundary usage](https://react.dev/reference/react/useTransition)
- [Next.js Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
