// @ts-nocheck
import type { MouseEventHandler } from "react";

type DeleteProjectButtonProps = {
  canDelete: boolean;
  onDelete: MouseEventHandler<HTMLButtonElement>;
};

export function DeleteProjectButton({
  canDelete,
  onDelete,
}: DeleteProjectButtonProps) {
  if (!canDelete) {
    return <p>You need project admin access to delete this project.</p>;
  }

  return (
    <button type="button" onClick={onDelete}>
      Delete project
    </button>
  );
}
