// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { fetchProject } from "../../content/docs/posts/_react-example-modules/projects";

type Project = { id: string; name: string };

export function ProjectName({ projectId }: { projectId: string }) {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
  });

  if (query.isPending) return <p>Loading project...</p>;
  if (query.isError) return <p>Project could not load.</p>;

  return <h1>{query.data.name}</h1>;
}
