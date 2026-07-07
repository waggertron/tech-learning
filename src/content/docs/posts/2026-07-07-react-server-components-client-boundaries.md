---
title: "Modern React 16: Server Components and client boundaries"
description: "Server Components, client boundaries, and the split between data work and browser interactivity."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-server-components-client-boundaries/
series:
  slug: modern-react-development
  order: 16
---

This is part 16 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: Which components need the browser, and which can stay on the server?

React gets easier when each concept has a job. Keep data-heavy, non-interactive rendering on the server. Move only interactive leaves to the client.

## Problem

Server Components and client boundaries is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
// ProductPage.tsx, Server Component in a framework that supports RSC
import { AddToCartButton } from './AddToCartButton';

export async function ProductPage({ id }: { id: string }) {
  const product = await getProduct(id);
  return (
    <>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <AddToCartButton productId={product.id} />
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

Adding a client directive at the top of a page because one button needs a click handler.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Find the first browser-only API. That line usually marks the client boundary.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 15: Optimistic UI](../2026-07-07-react-optimistic-ui/)
- Next: [Part 17: Server Actions and mutation boundaries](../2026-07-07-react-server-actions-mutation-boundaries/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/reference/rsc/server-components)
- [react.dev](https://react.dev/reference/rsc/use-client)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
