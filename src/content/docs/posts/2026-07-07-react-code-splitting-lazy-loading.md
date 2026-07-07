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

This is part 34 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: Which screens deserve to stay out of the first JavaScript bundle?

React gets easier when each concept has a job. Split code at route, tool, or rarely used feature boundaries.

## Problem

Code splitting and lazy loading is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./AdminDashboard'));

export function AdminRoute() {
  return (
    <Suspense fallback={<p>Loading admin tools...</p>}>
      <AdminDashboard />
    </Suspense>
  );
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Lazy-loading tiny components while the actual heavy dependency still ships on first load.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Inspect the bundle before and after. The large module should move out of the initial chunk.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 33: Error boundaries and recovery](../2026-07-07-react-error-boundaries-recovery/)
- Next: [Part 35: Styling, design tokens, and variants](../2026-07-07-react-styling-design-tokens-variants/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/reference/react/lazy)
- [react.dev](https://react.dev/reference/react/Suspense)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
