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

This is part 32 of the [Modern React development series](../series/modern-react-development/).

A mutation changes server-backed data. After the write, every cached read that depends on that data needs a plan: update it directly, invalidate it for refetch, or navigate to a route that reloads it.

## Concept

Cache invalidation marks cached data as no longer trustworthy after a mutation. A mutation flow owns the submitted input, pending state, error state, optimistic feedback, server write, and cache update or invalidation.

## Terms

- **Mutation**: A write operation that changes server data.
- **Invalidation**: Marking a cached read as stale so it can be fetched again.
- **Optimistic update**: Temporarily updating UI before the server confirms the mutation.
- **Rollback**: Restoring previous UI when an optimistic mutation fails.

## Mental model

Think of reads as copies pinned to a wall. A mutation edits the source document. Invalidation is the note that tells every stale copy to refresh before people rely on it again.

## How it is used

Use mutation flows for create, update, delete, reorder, approve, archive, and assign actions. Tie each mutation to the exact query keys, route loaders, or server caches affected by the write.

## How to use it

1. Identify which server resource the mutation changes.
2. Identify every cached read that includes that resource.
3. Choose direct cache update for small local changes or invalidation for refetching truth.
4. Render pending and error states near the action.
5. Use optimistic UI only when recovery is clear.

## Example: Invalidate after update

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function RenameProjectButton({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (name: string) => renameProject(projectId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return (
    <button onClick={() => mutation.mutate("New project name")}>
      {mutation.isPending ? "Renaming..." : "Rename"}
    </button>
  );
}
```

The mutation invalidates both the detail read and the list read because both can contain the changed name.

## Example: Small direct cache update

```tsx
function markProjectArchived(projectId: string) {
  queryClient.setQueryData<Project>(["project", projectId], (project) => {
    if (!project) return project;
    return { ...project, archived: true };
  });
}
```

A direct update is useful when the next cached value is known and small.

## Details to watch

- **Read mapping**: Invalidation requires knowing which reads depend on the changed resource.
- **Server truth**: A direct cache update should match server behavior. Refetch when the server may add computed fields.
- **Error path**: Pending and error states belong near the action the user took.
- **Framework caches**: Next.js, React Router, and TanStack tools each have their own cache or revalidation APIs.

## Series navigation

- Previous: [Part 31: Data fetching with a cache](../2026-07-07-react-data-fetching-with-cache/)
- Next: [Part 33: Error boundaries and recovery](../2026-07-07-react-error-boundaries-recovery/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [useActionState](https://react.dev/reference/react/useActionState)
- [useOptimistic](https://react.dev/reference/react/useOptimistic)
- [TanStack Query mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [Next.js revalidating](https://nextjs.org/docs/app/getting-started/caching-and-revalidating)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
