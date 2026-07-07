---
title: "Modern React 22: Next.js App Router"
description: "Next.js App Router as a React framework for routing, server rendering, data loading, and deployment."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-nextjs-app-router/
series:
  slug: modern-react-development
  order: 22
---

This is part 22 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: What does Next.js add on top of React, and when is that trade worth it?

React gets easier when each concept has a job. Next.js adds conventions around routes, layouts, Server Components, caching, and deployment.

## Problem

Next.js App Router is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
// app/projects/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <main>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
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

Treating App Router as Pages Router with different folder names.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Check whether code runs on the server or client before reaching for browser APIs.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 21: Framework choice and project setup](../2026-07-07-react-framework-choice-project-setup/)
- Next: [Part 23: React Router v7](../2026-07-07-react-router-v7-framework/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [nextjs.org](https://nextjs.org/docs/app)
- [nextjs.org](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
