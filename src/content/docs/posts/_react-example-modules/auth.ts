export async function requireCurrentUser() {
  return { id: "user-1", role: "admin" };
}

export function canDeleteProject() {
  return true;
}
