---
title: "Modern React 23: React Router v7"
description: "React Router v7 as routing plus loaders, actions, nested layouts, and framework-style data flow."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-router-v7-framework/
series:
  slug: modern-react-development
  order: 23
---

This is part 23 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: When do route loaders, actions, and nested layouts belong in the router instead of ad hoc components?

React gets easier when each concept has a job. Move route-specific loading and mutation logic to the route boundary.

## Problem

React Router v7 is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { Form, Link, Outlet, useLoaderData } from 'react-router';

export async function loader() {
  return { projects: await getProjects() };
}

export function ProjectsRoute() {
  const { projects } = useLoaderData<typeof loader>();
  return (
    <>
      <Form role="search">
        <input name="q" aria-label="Search projects" />
      </Form>
      {projects.map((project) => (
        <Link key={project.id} to={project.id}>{project.name}</Link>
      ))}
      <Outlet />
    </>
  );
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Fetching in every route component while the router already knows which route is loading.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Navigate between sibling routes and watch which loaders run. The route tree should explain the data flow.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 22: Next.js App Router](../2026-07-07-react-nextjs-app-router/)
- Next: [Part 24: TanStack Router and TanStack Start](../2026-07-07-react-tanstack-router-start/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [reactrouter.com](https://reactrouter.com/start/framework/installation)
- [reactrouter.com](https://reactrouter.com/start/framework/routing)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
