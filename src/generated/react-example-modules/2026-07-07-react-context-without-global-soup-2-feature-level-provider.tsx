// @ts-nocheck
import { createContext } from "react";
import { ProjectHeader } from "../../content/docs/posts/_react-example-modules/ProjectHeader";
import { ProjectTaskList } from "../../content/docs/posts/_react-example-modules/ProjectTaskList";

type ProjectContextValue = {
  projectId: string;
  canEdit: boolean;
};

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectPage({ projectId }: { projectId: string }) {
  const value = { projectId, canEdit: true };

  return (
    <ProjectContext value={value}>
      <ProjectHeader />
      <ProjectTaskList />
    </ProjectContext>
  );
}
