// @ts-nocheck
import type { ReactElement } from "react";

type User = { id: string; name: string };

export function AssigneeSummary({
  users,
  selectedUserId,
}: {
  users: User[];
  selectedUserId: string | null;
}): ReactElement {
  const selectedUser = users.find((user) => user.id === selectedUserId) ?? null;

  return <p>{selectedUser ? selectedUser.name : "No assignee"}</p>;
}
