// @ts-nocheck
import { useState } from "react";
import { FilterTabs } from "../../content/docs/posts/_react-example-modules/FilterTabs";
import { TaskList } from "../../content/docs/posts/_react-example-modules/TaskSummaryList";

type Task = { id: string; title: string; done: boolean };
type Filter = "all" | "open" | "done";

export function TaskBoard({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const visibleTasks = tasks.filter((task) => {
    if (filter === "open") return !task.done;
    if (filter === "done") return task.done;
    return true;
  });

  return (
    <>
      <FilterTabs value={filter} onChange={setFilter} />
      <p>{visibleTasks.length} visible tasks</p>
      <TaskList tasks={visibleTasks} />
    </>
  );
}
