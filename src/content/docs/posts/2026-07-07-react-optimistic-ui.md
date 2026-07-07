---
title: "Modern React 15: Optimistic UI"
description: "Optimistic UI that shows intent early while preserving a path back to truth."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-optimistic-ui/
series:
  slug: modern-react-development
  order: 15
---

This is part 15 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: How do you show the intended result before the server confirms it?

React gets easier when each concept has a job. Optimism is a temporary projection. The server response still owns the final state.

## Problem

Optimistic UI is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { useOptimistic } from 'react';

type Comment = { id: string; body: string };

export function CommentList({ comments }: { comments: Comment[] }) {
  const [optimisticComments, addOptimistic] = useOptimistic(
    comments,
    (current, body: string) => [...current, { id: 'pending', body }]
  );

  async function submit(formData: FormData) {
    const body = String(formData.get('body') ?? '');
    addOptimistic(body);
    await fetch('/api/comments', { method: 'POST', body });
  }

  return (
    <form action={submit}>
      <ul>{optimisticComments.map((comment) => <li key={comment.id}>{comment.body}</li>)}</ul>
      <input name="body" />
      <button>Add</button>
    </form>
  );
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Appending to local state and forgetting failure or reconciliation paths.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Force the request to fail. The optimistic state should not become permanent truth.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 14: Forms with Actions](../2026-07-07-react-forms-with-actions/)
- Next: [Part 16: Server Components and client boundaries](../2026-07-07-react-server-components-client-boundaries/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/reference/react/useOptimistic)
- [react.dev](https://react.dev/blog/2024/12/05/react-19)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
