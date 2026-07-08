// @ts-nocheck
import { TaskList } from "../../content/docs/posts/_react-example-modules/TaskList";

type Project = {
  id: string;
  name: string;
  tasks: Task[];
};

export function ProjectTaskList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map((project) => (
        <section key={project.id}>
          <h2>{project.name}</h2>
          <TaskList tasks={project.tasks} />
        </section>
      ))}
    </div>
  );
}
