---
title: "Modern React 26: Vite and client-only apps"
description: "Vite for React apps that do not need framework routing, server rendering, or server mutations."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-vite-client-only-apps/
series:
  slug: modern-react-development
  order: 26
---

This is part 26 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: When is a simple client-rendered app the right answer?

React gets easier when each concept has a job. A small client app is a good shape when the server is already somewhere else.

## Problem

Vite and client-only apps is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```ts
// vite.config.ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Adding a full-stack framework just to render a settings panel or dashboard shell.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Inspect the first route. If it only mounts one client app and talks to existing APIs, Vite may be enough.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 25: Expo and React Native](../2026-07-07-react-expo-react-native/)
- Next: [Part 27: Storybook and component workbenches](../2026-07-07-react-storybook-component-workbenches/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [vite.dev](https://vite.dev/guide/)
- [react.dev](https://react.dev/learn/build-a-react-app-from-scratch)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
