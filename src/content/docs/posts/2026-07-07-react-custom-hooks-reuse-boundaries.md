---
title: "Modern React 11: Custom hooks as reuse boundaries"
description: "Custom hooks as reusable stateful behavior with a small public contract."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-custom-hooks-reuse-boundaries/
series:
  slug: modern-react-development
  order: 11
---

This is part 11 of the [Modern React development series](../series/modern-react-development/).

Custom Hooks package reusable stateful behavior behind a function name that starts with `use`. They let components share logic without sharing markup, which keeps behavior reusable across different visual designs.

## Concept

A custom Hook is a JavaScript function that calls React Hooks and follows the Rules of Hooks. It can use state, refs, context, Effects, reducers, and other custom Hooks, then return the values and functions a component needs.

## Terms

- **Custom Hook**: A function named with a `use` prefix that can call React Hooks.
- **Rules of Hooks**: The constraints that Hooks are called at the top level of components or other Hooks.
- **Stateful logic**: Behavior that uses React state, Effects, refs, context, reducers, or other Hooks.
- **Return contract**: The values and functions a custom Hook exposes to its callers.

## Mental model

Think of a custom Hook as a behavior adapter. The Hook owns how the behavior works. The component owns how the returned data is displayed.

## How it is used

Use custom Hooks for reusable browser subscriptions, form field models, local storage state, feature flags, measurements, media queries, async status wrappers, and feature-specific state machines.

## How to use it

1. Extract logic only after two components need the same behavior or one component has become hard to read.
2. Name the Hook after the behavior it provides.
3. Keep JSX out of the Hook. Return data and callbacks instead.
4. Keep the returned shape small and stable.
5. Document the assumptions, such as browser-only APIs or provider requirements.

## Example: Local storage state

```tsx
import { useEffect, useState } from "react";

export function useStoredString(key: string, initialValue: string) {
  const [value, setValue] = useState(() => {
    return window.localStorage.getItem(key) ?? initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-custom-hooks-reuse-boundaries-1-local-storage-state" data-render-mode="result" data-interaction-mode="runner" data-runner-entry="2026-07-07-react-custom-hooks-reuse-boundaries-1-local-storage-state" role="region" aria-label="Output view: Local storage state">
  <div class="react-example-output__header">Runtime result</div>
  <div class="react-example-output__body">
    <div class="react-example-output__runner" data-react-example-runner="2026-07-07-react-custom-hooks-reuse-boundaries-1-local-storage-state">
  <button type="button" class="react-example-output__run-button">Run example</button>
  <div class="react-example-output__runner-output" aria-live="polite">
    <p><strong>Local storage state.</strong> The code exports a value or function used by the surrounding example.</p>
  </div>
</div>
  </div>
</div>

The Hook owns storage synchronization. A component can use it like state without repeating the Effect.

## Example: Window size subscription

```tsx
import { useEffect, useState } from "react";

export function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-custom-hooks-reuse-boundaries-2-window-size-subscription" data-render-mode="result" data-interaction-mode="runner" data-runner-entry="2026-07-07-react-custom-hooks-reuse-boundaries-2-window-size-subscription" role="region" aria-label="Output view: Window size subscription">
  <div class="react-example-output__header">Runtime result</div>
  <div class="react-example-output__body">
    <div class="react-example-output__runner" data-react-example-runner="2026-07-07-react-custom-hooks-reuse-boundaries-2-window-size-subscription">
  <button type="button" class="react-example-output__run-button">Run example</button>
  <div class="react-example-output__runner-output" aria-live="polite">
    <p><strong>Window size subscription.</strong> The code exports a value or function used by the surrounding example.</p>
  </div>
</div>
  </div>
</div>

The component using this Hook can focus on display, while the Hook owns the event subscription and cleanup.

## Details to watch

- **Naming**: The `use` prefix is part of how React tooling recognizes Hook rules.
- **No conditional calls**: A custom Hook follows the same call order rules as built-in Hooks.
- **Browser APIs**: Hooks that touch `window`, `document`, or storage need a framework-aware plan for server rendering.
- **Return shape**: Return an object for many named values and a tuple for state-like pairs.

## Series navigation

- Previous: [Part 10: Effects, synchronization, and cleanup](../2026-07-07-react-effects-synchronization-cleanup/)
- Next: [Part 12: Data loading with Suspense boundaries](../2026-07-07-react-suspense-data-loading-boundaries/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [useDebugValue](https://react.dev/reference/react/useDebugValue)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
