---
title: "Modern React 30: Routing and nested layouts"
description: "Routing and nested layouts as the structure that makes URL state match UI state."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-routing-nested-layouts/
series:
  slug: modern-react-development
  order: 30
---

This is part 30 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: How does URL structure become UI structure?

React gets easier when each concept has a job. The route tree should explain which layout owns which screen region.

## Problem

Routing and nested layouts is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { Link, Outlet } from 'react-router';

export function AccountLayout() {
  return (
    <main>
      <nav aria-label="Account">
        <Link to="profile">Profile</Link>
        <Link to="billing">Billing</Link>
      </nav>
      <Outlet />
    </main>
  );
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Using conditional rendering inside one page for states that are really different URLs.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Refresh on a nested URL. If the same UI cannot be reconstructed, route state is missing.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 29: ESLint, TypeScript, formatting, and CI gates](../2026-07-07-react-eslint-typescript-formatting-ci/)
- Next: [Part 31: Data fetching with a cache](../2026-07-07-react-data-fetching-with-cache/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [reactrouter.com](https://reactrouter.com/start/framework/routing)
- [react.dev](https://react.dev/learn/preserving-and-resetting-state)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
