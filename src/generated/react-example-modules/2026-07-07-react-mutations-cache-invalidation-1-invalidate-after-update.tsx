// @ts-nocheck
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renameProject } from "../../content/docs/posts/_react-example-modules/projects";

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
