export async function getProject(projectId: string) {
  return {
    id: projectId,
    name: "Launch plan",
    description: "Coordinate release tasks before the public launch.",
  };
}

export async function fetchProject(projectId: string) {
  return {
    id: projectId,
    name: "Launch plan",
  };
}

export async function renameProject(projectId: string, name: string) {
  return {
    id: projectId,
    name,
  };
}
