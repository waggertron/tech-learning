---
title: "Modern React 24: TanStack Router and TanStack Start"
description: "TanStack Router and TanStack Start for type-safe routes, search params, and full-stack React apps."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-tanstack-router-start/
series:
  slug: modern-react-development
  order: 24
---

This is part 24 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: What do type-safe routes and search params buy in a large app?

React gets easier when each concept has a job. Type-safe routes make URL params and search params part of the application contract.

## Problem

TanStack Router and TanStack Start is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/projects/$projectId')({
  loader: ({ params }) => getProject(params.projectId),
  component: ProjectRoute,
});

function ProjectRoute() {
  const project = Route.useLoaderData();
  return <h1>{project.name}</h1>;
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Parsing route params manually in every component.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Rename a route param and let TypeScript show every caller that depends on it.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 23: React Router v7](../2026-07-07-react-router-v7-framework/)
- Next: [Part 25: Expo and React Native](../2026-07-07-react-expo-react-native/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [tanstack.com](https://tanstack.com/router/latest)
- [tanstack.com](https://tanstack.com/start/latest)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
