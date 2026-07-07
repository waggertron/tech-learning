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

This is part 33 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: What happens when render fails, and how does the user recover?

React gets easier when each concept has a job. A boundary limits the blast radius of a render failure.

## Problem

Error boundaries and recovery is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function Fallback({ resetErrorBoundary }: { resetErrorBoundary: () => void }) {
  return (
    <section role="alert">
      <p>Something broke in this panel.</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </section>
  );
}

export function SafePanel({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>;
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Catching every error at the application root and replacing the whole app with one message.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Throw from a child component in development and confirm only the intended panel falls back.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 32: Mutations and cache invalidation](../2026-07-07-react-mutations-cache-invalidation/)
- Next: [Part 34: Code splitting and lazy loading](../2026-07-07-react-code-splitting-lazy-loading/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [github.com](https://github.com/bvaughn/react-error-boundary)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
