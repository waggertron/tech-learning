---
title: "Modern React 31: Data fetching with a cache"
description: "Data fetching with a client cache instead of one-off effects per component."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-data-fetching-with-cache/
series:
  slug: modern-react-development
  order: 31
---

This is part 31 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: Why is "fetch in an effect" rarely the final production shape?

React gets easier when each concept has a job. A cache gives shared loading, error, retry, dedupe, and invalidation behavior.

## Problem

Data fetching with a cache is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { useQuery } from '@tanstack/react-query';

type Project = { id: string; name: string };

async function fetchProjects(): Promise<Project[]> {
  const response = await fetch('/api/projects');
  if (!response.ok) throw new Error('Could not load projects');
  return response.json();
}

export function ProjectList() {
  const { data = [], isPending, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  if (isPending) return <p>Loading...</p>;
  if (error) return <p role="alert">Projects unavailable</p>;
  return <ul>{data.map((project) => <li key={project.id}>{project.name}</li>)}</ul>;
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Fetching in `useEffect` for every server read and rebuilding a cache one flag at a time.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Open two components that need the same data. They should share one request and one cached answer.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 30: Routing and nested layouts](../2026-07-07-react-routing-nested-layouts/)
- Next: [Part 32: Mutations and cache invalidation](../2026-07-07-react-mutations-cache-invalidation/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [tanstack.com](https://tanstack.com/query/latest/docs/framework/react/overview)
- [react.dev](https://react.dev/learn/you-might-not-need-an-effect)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
