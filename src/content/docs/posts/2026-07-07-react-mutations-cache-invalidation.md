---
title: "Modern React 32: Mutations and cache invalidation"
description: "Mutation flows and cache invalidation after writes change server-backed data."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-mutations-cache-invalidation/
series:
  slug: modern-react-development
  order: 32
---

This is part 32 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: After a write succeeds, which cached reads are now stale?

React gets easier when each concept has a job. A successful write tells you which reads may now be stale.

## Problem

Mutations and cache invalidation is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function RenameProjectForm({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const rename = useMutation({
    mutationFn: (name: string) =>
      fetch(`/api/projects/${id}`, { method: 'PATCH', body: JSON.stringify({ name }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      rename.mutate(String(data.get('name')));
    }}>
      <input name="name" />
      <button disabled={rename.isPending}>Rename</button>
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

Updating the visible component and forgetting other screens that read the same entity.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

After a mutation, navigate to another list that shows the same data. It should not show stale values.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 31: Data fetching with a cache](../2026-07-07-react-data-fetching-with-cache/)
- Next: [Part 33: Error boundaries and recovery](../2026-07-07-react-error-boundaries-recovery/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [tanstack.com](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [tanstack.com](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
