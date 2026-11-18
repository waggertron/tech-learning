---
title: "Modern React 30: Error boundaries and working recovery"
description: "Break a panel during render, preserve its sibling, inspect a caught error, and restore the failed region with an explicit reset."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-error-boundaries-recovery/
series:
  slug: modern-react-development
  order: 30
---

This is part 30 of the [Modern React development series](../series/modern-react-development/).

An error boundary lets a dashboard replace one failed region while other regions remain useful. Recovery also needs a way to remove the cause of the failure. Resetting a boundary while its child still throws only returns to the fallback.

## Concept

An error boundary catches descendant render failures and renders fallback UI. The boundary's state records that a descendant failed. That state belongs to the boundary, independently of the state that caused the child to throw.

A normal click-handler exception is outside this render boundary. The example below makes the click update `broken`, then makes the next **render** throw. That distinction is what allows the boundary to catch the failure.

## Mental model

Recovery has two steps: clear the failing input, then let the region render again. Both steps are explicit here. The Activity sibling stays outside the Revenue boundary and remains mounted.

## Example: Break and retry one panel

```tsx
import { useState } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { PanelError } from "./PanelError";

function Revenue({ broken }: { broken: boolean }) {
  if (broken) throw new Error("Simulated render failure");
  return <p>Revenue loaded</p>;
}

export function RecoveryDemo() {
  const [broken, setBroken] = useState(false);
  const [lastError, setLastError] = useState("No caught errors");
  return (
    <section>
      <button type="button" onClick={() => setBroken(true)}>Break revenue panel</button>
      <ErrorBoundary
        onReset={() => setBroken(false)}
        onError={(error) => setLastError(`Caught: ${error.message}`)}
        fallback={(reset) => <PanelError onRetry={reset} />}
      >
        <Revenue broken={broken} />
      </ErrorBoundary>
      <p>Activity remains available</p>
      <p role="status">{lastError}</p>
    </section>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-error-boundaries-recovery-1-break-and-retry-one-panel" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-error-boundaries-recovery-1-break-and-retry-one-panel.tsx" role="region" aria-label="Output view: Break and retry one panel">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><section><button type="button">Break revenue panel</button><p>Revenue loaded</p><p>Activity remains available</p><p role="status">No caught errors</p></section></div>
  </div>
</div>

Click **Break revenue panel**. Revenue becomes an alert with **Retry revenue panel**, while Activity remains visible. The status records the caught error's message. Retry clears `broken` and resets the boundary's failed state in the same interaction.

`PanelError` is a real fallback component, not an inert status paragraph. Its `onRetry` prop is called by a native button. In a service-backed panel, retry would invalidate or reload the failed resource before rerendering.

## Example: A boundary with an explicit reset

```tsx
import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback: ReactNode | ((reset: () => void) => ReactNode);
  onReset?: () => void;
  onError?: (error: Error, info: ErrorInfo) => void;
};

export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  private reset = () => {
    this.props.onReset?.();
    this.setState({ failed: false });
  };

  render() {
    if (this.state.failed) {
      return typeof this.props.fallback === "function"
        ? this.props.fallback(this.reset)
        : this.props.fallback;
    }
    return this.props.children;
  }
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-error-boundaries-recovery-2-a-boundary-with-an-explicit-reset" data-render-mode="result" data-interaction-mode="runner" data-runner-entry="2026-07-07-react-error-boundaries-recovery-2-a-boundary-with-an-explicit-reset" role="region" aria-label="Output view: A boundary with an explicit reset">
  <div class="react-example-output__header">Runtime result</div>
  <div class="react-example-output__body">
    <div class="react-example-output__runner" data-react-example-runner="2026-07-07-react-error-boundaries-recovery-2-a-boundary-with-an-explicit-reset">
  <button type="button" class="react-example-output__run-button">Run example</button>
  <div class="react-example-output__runner-output" aria-live="polite">
    <pre class="react-example-output__runner-pre">type Props = {
  children: ReactNode;
  fallback: ReactNode | ((reset: () =&gt; void) =&gt; ReactNode);
  onReset?: () =&gt; void;
  onError?: (error: Error, info: ErrorInfo) =&gt; void;
};
export class ErrorBoundary extends Component&lt;Props, { failed: boolean }&gt; {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }</pre>
  </div>
</div>
  </div>
</div>

`getDerivedStateFromError` selects fallback UI. `componentDidCatch` reports the failure after React catches it. The fallback can receive a reset callback, while `onReset` lets the owner clear the input or cache that caused the failure.

The class is small because an application-specific boundary does not need a general retry framework. Existing route frameworks may already supply a reset API. Use that API when the router owns the failed region.

A changed `key` is another valid reset: React discards the old boundary and child state and mounts a fresh subtree. That also discards any unsaved local state below the key. Choose this deliberately rather than changing keys on every render.

## Reporting and recovery have different jobs

The visible report in this example stays local and carries no user data. A production reporting adapter can receive the error and component stack from `componentDidCatch`. React 19 root options such as `onCaughtError` can centralize reporting across boundaries. Use one reporting owner to avoid duplicate events.

Reporting an error does not reset its boundary. A fallback needs an action that restores useful behavior or an alternate route. Browser errors, event-handler failures, rejected asynchronous operations, and server failures need the matching error path rather than assuming this boundary catches everything.

## Verify the behavior

From the repository root:

```bash
node --test --test-name-pattern='recovery and rollout' tests/react-example-output-views.test.mjs
```

The test opens the isolated Vite workbench in Chromium, triggers a Revenue render failure, checks that Activity survives, retries, and checks that the alert disappears. It also exercises the rollout controls from the final lesson. The workbench uses the same helper modules as the article outputs.

## Details to watch

- **Recovery cause**: Clear or replace the failed data as well as the error state.
- **Boundary size**: Wrap a region the person can understand and recover independently.
- **Diagnostics**: Development React intentionally reports caught errors to the console. A reported test failure is expected only when the assertions do not observe recovery.
- **Server rendering**: A browser boundary is not a universal server-side exception handler.

## Series navigation

- Previous: [Part 29: Mutations and cache invalidation](../2026-07-07-react-mutations-cache-invalidation/)
- Next: [Part 31: Code splitting and lazy loading](../2026-07-07-react-code-splitting-lazy-loading/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Catching rendering errors with an error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) explains the class callbacks and their boundary.
- [Resetting state with a key](https://react.dev/learn/preserving-and-resetting-state#resetting-state-with-a-key) explains remount-based recovery.
- [createRoot](https://react.dev/reference/react-dom/client/createRoot) documents root error reporting options.

## Related topics

- [Deployment, observability, and feature flags](../2026-07-07-react-deployment-observability-feature-flags/)
- [Testing components by behavior](../2026-07-07-react-testing-components-by-behavior/)
