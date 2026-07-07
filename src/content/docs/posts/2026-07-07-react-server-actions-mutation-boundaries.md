---
title: "Modern React 17: Server Actions and mutation boundaries"
description: "Server Actions for trusted mutations that are called from React UI."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-server-actions-mutation-boundaries/
series:
  slug: modern-react-development
  order: 17
---

This is part 17 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: How do you keep trusted mutations on the server while calling them from UI?

React gets easier when each concept has a job. Put authority on the server. Let the client submit intent, not trusted state.

## Problem

Server Actions and mutation boundaries is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
// actions.ts
'use server';

export async function updateQuantity(formData: FormData) {
  const itemId = String(formData.get('itemId'));
  const quantity = Number(formData.get('quantity'));
  await saveCartQuantity({ itemId, quantity });
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Treating a hidden input or disabled button as authorization.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Call the action with bad data in a test. Server validation should reject it without relying on UI state.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 16: Server Components and client boundaries](../2026-07-07-react-server-components-client-boundaries/)
- Next: [Part 18: TypeScript patterns for React](../2026-07-07-react-typescript-component-patterns/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/reference/rsc/server-functions)
- [react.dev](https://react.dev/reference/rsc/use-server)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
