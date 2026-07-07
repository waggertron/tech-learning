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

This is part 15 of the [Modern React development series](../series/modern-react-development/).

Optimistic UI shows the result the user expects before the server confirms it. React gives this pattern a home with `useOptimistic`, so immediate feedback can stay connected to the Action that will confirm or reject the change.

## Concept

`useOptimistic` returns an optimistic state value and a function for adding temporary optimistic updates. When the related Action finishes and the real value changes, React returns to the confirmed value.

## Terms

- **Optimistic state**: A temporary state that assumes a pending operation will succeed.
- **Confirmed state**: The source value from props, state, or server data after the operation settles.
- **Reducer**: The function that combines current optimistic state with an optimistic action.
- **Rollback**: The visible return from optimistic state to confirmed state when an operation does not complete as expected.

## Mental model

Think of optimistic UI as a sticky note on top of the real record. The user sees the note immediately. When the real record arrives, the note is removed or replaced by confirmed data.

## How it is used

Use optimistic UI for likes, quick comments, checklist toggles, small edits, and add-to-cart actions where the expected result is simple and the recovery path is clear.

## How to use it

1. Start with a confirmed value from props or state.
2. Create optimistic state with `useOptimistic`.
3. Call the optimistic setter from an Action or Transition before awaiting the server result.
4. Render the optimistic state in the same place the confirmed state normally appears.
5. Show enough pending or error feedback that the user understands what happened if the server rejects the change.

## Example: Optimistic comment list

```tsx
import { useOptimistic } from "react";

type Comment = { id: string; body: string; pending?: boolean };

export function CommentForm({
  comments,
  createComment,
}: {
  comments: Comment[];
  createComment: (body: string) => Promise<void>;
}) {
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (current, body: string) => [
      ...current,
      { id: "pending", body, pending: true },
    ],
  );

  async function action(formData: FormData) {
    const body = String(formData.get("body") ?? "");
    addOptimisticComment(body);
    await createComment(body);
  }

  return (
    <form action={action}>
      <ul>
        {optimisticComments.map((comment) => (
          <li key={comment.id}>{comment.body}</li>
        ))}
      </ul>
      <input name="body" />
      <button>Post</button>
    </form>
  );
}
```

The pending comment appears immediately, while the Action still owns the server write.

## Example: Optimistic like count

```tsx
import { useOptimistic } from "react";

export function LikeButton({
  liked,
  count,
  saveLike,
}: {
  liked: boolean;
  count: number;
  saveLike: (liked: boolean) => Promise<void>;
}) {
  const [optimistic, setOptimistic] = useOptimistic({ liked, count });

  async function toggleAction() {
    const nextLiked = !optimistic.liked;
    setOptimistic({
      liked: nextLiked,
      count: optimistic.count + (nextLiked ? 1 : -1),
    });
    await saveLike(nextLiked);
  }

  return <button onClick={toggleAction}>{optimistic.count} likes</button>;
}
```

The UI responds instantly, and the confirmed props can replace the optimistic value after the save finishes.

## Details to watch

- **Scope**: Optimistic UI works best for small, reversible changes with a clear confirmed source.
- **Pending visibility**: Marking temporary items as pending helps explain why a row looks different.
- **Ordering**: Multiple optimistic updates can overlap. Use reducers when updates need ordered merging.
- **Error recovery**: The confirmed value is the reset point. Add error messaging when a failed operation needs user attention.

## Series navigation

- Previous: [Part 14: Forms with Actions](../2026-07-07-react-forms-with-actions/)
- Next: [Part 16: Server Components and client boundaries](../2026-07-07-react-server-components-client-boundaries/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [useOptimistic](https://react.dev/reference/react/useOptimistic)
- [useActionState](https://react.dev/reference/react/useActionState)
- [useTransition](https://react.dev/reference/react/useTransition)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
