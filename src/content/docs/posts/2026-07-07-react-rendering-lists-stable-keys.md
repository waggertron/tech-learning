---
title: "Modern React 3: Rendering lists and stable keys"
description: "Stable keys, list identity, and the bugs caused by using array positions as identity."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-rendering-lists-stable-keys/
series:
  slug: modern-react-development
  order: 3
---

This is part 3 of the [Modern React development series](../series/modern-react-development/).

Most interfaces repeat something: messages, table rows, search results, tabs, menu items, notifications. React renders those repetitions by mapping data to JSX and using keys to preserve each item's identity across renders.

## Concept

A key is a stable identifier for one item among its siblings. React uses keys when a list changes so it can match old children to new children and preserve the right state, focus, and DOM nodes.

## Terms

- **List rendering**: Turning an array of data into an array of React nodes.
- **Key**: A string or number that identifies one rendered sibling in a list.
- **Sibling identity**: The identity React compares among children that share the same parent.
- **Reorder**: A list change where the same items appear in a different order.

## Mental model

Think of keys as name tags on moving boxes. If boxes move around the room, React can still tell which box is which. If the name tag is only the current position, the label changes every time the order changes.

## How it is used

Keys matter in sortable tables, drag and drop lists, filtered search results, editable rows, accordions, and any repeated component with local state. A good key usually comes from the data source, such as a database ID, slug, or stable domain identifier.

## How to use it

1. Map over data and return one top-level node for each item.
2. Put `key` on the node returned directly from the map call.
3. Use an ID from the data whenever the item can be inserted, removed, filtered, or reordered.
4. Only use an array index when the list is static and will never reorder or keep per-item state.

## Example: Task list with item identity

```tsx
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
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-rendering-lists-stable-keys-1-task-list-with-item-identity" data-render-mode="react-server" role="region" aria-label="Output view: Task list with item identity">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><ul><li><label><input type="checkbox" checked=""/>Draft release notes</label></li><li><label><input type="checkbox"/>Verify analytics</label></li></ul></div>
  </div>
</div>

The key comes from `task.id`, so React can keep the checkbox state attached to the same task when the list changes.

## Example: Grouped list keys

```tsx
import { TaskList } from "./TaskList";

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
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-rendering-lists-stable-keys-2-grouped-list-keys" data-render-mode="react-server" role="region" aria-label="Output view: Grouped list keys">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><div><section><h2>Launch</h2><ul><li><label><input type="checkbox" checked=""/>Draft release notes</label></li><li><label><input type="checkbox"/>Verify analytics</label></li></ul></section><section><h2>Retrospective</h2><ul><li><label><input type="checkbox" checked=""/>Draft release notes</label></li></ul></section></div></div>
  </div>
</div>

Keys are scoped to siblings. Project sections need keys among project sections, and task rows need keys among task rows.

## Details to watch

- **Scope**: Keys only need to be unique among siblings, not globally unique across the whole app.
- **Placement**: The `key` belongs on the element returned by the map, not inside the child component it calls.
- **Index keys**: Indexes describe position, not identity. They fit static lists such as three fixed footer links.
- **State preservation**: Changing a key tells React that this is a different component instance and resets state below it.

## Series navigation

- Previous: [Part 2: Props, children, and component boundaries](../2026-07-07-react-props-children-component-boundaries/)
- Next: [Part 4: Events and local state](../2026-07-07-react-events-and-local-state/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Rendering Lists](https://react.dev/learn/rendering-lists)
- [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
