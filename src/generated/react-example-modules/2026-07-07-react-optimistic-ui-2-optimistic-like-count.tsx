// @ts-nocheck
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
