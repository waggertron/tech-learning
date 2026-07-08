// @ts-nocheck
import type { ReactElement } from "react";

type Task = {
  id: string;
  title: string;
  done: boolean;
};

export function TaskList({ tasks }: { tasks: Task[] }): ReactElement {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <label>
            <input type="checkbox" defaultChecked={task.done} />
            {task.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
