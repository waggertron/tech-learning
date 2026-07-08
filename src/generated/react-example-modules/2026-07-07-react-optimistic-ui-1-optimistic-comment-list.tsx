// @ts-nocheck
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
