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

This is part 21 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: When should you start with a full-stack framework, and when is Vite enough?

React gets easier when each concept has a job. Pick the project shape from routing, data, rendering, and deployment needs.

## Problem

Framework choice and project setup is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
// main.tsx, a minimal client-only app entry
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Starting with a full-stack framework or a bare Vite app because that is what the last project used.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

List the app requirements: routing, auth, server rendering, mutations, caching, mobile, and deployment target.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 20: Performance and React Compiler](../2026-07-07-react-performance-and-compiler/)
- Next: [Part 22: Next.js App Router](../2026-07-07-react-nextjs-app-router/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/learn/creating-a-react-app)
- [react.dev](https://react.dev/learn/build-a-react-app-from-scratch)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
