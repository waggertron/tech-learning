---
title: "Modern React 5: State shape and derived values"
description: "State shape, derived values, and the habit of storing each fact in exactly one place."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-state-shape-derived-values/
series:
  slug: modern-react-development
  order: 5
---

This is part 5 of the [Modern React development series](../series/modern-react-development/).

State shape is the difference between a component that naturally stays consistent and a component that spends every render reconciling copies of the same fact. React works best when state stores the smallest set of changing facts and render calculates the rest.

## Concept

A derived value is a value that can be calculated from props, state, or constants during render. It usually does not belong in state because React can recalculate it every time the component renders.

## Terms

- **State shape**: The set of state variables and objects a component uses to remember changing data.
- **Derived value**: A value calculated from existing props or state.
- **Source of truth**: The one place a fact is stored before other values are calculated from it.
- **Normalization**: Storing related data by ID or stable keys so updates can target one fact.

## Mental model

Think of state as the ingredients, not the plated meal. Store the ingredients that can change. Build the plate during render from those ingredients.

## How it is used

Use this model for filtered lists, totals, selection state, form summaries, active tabs, and permission displays. If a value can be computed from current inputs, calculate it during render and let React rerun that calculation when inputs change.

## How to use it

1. List every value the UI displays or uses for decisions.
2. Mark values that change over time and cannot be calculated from existing inputs.
3. Store only those changing facts in state.
4. Calculate counts, filtered arrays, labels, booleans, and display summaries during render.
5. Memoize expensive calculations only after measuring or when the cost is clear.

## Example: Filter without duplicated state

```tsx
import { useState } from "react";
import { FilterTabs } from "./FilterTabs";
import { TaskList } from "./TaskSummaryList";

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
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-state-shape-derived-values-1-filter-without-duplicated-state" data-render-mode="react-server" role="region" aria-label="Output view: Filter without duplicated state">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><div role="tablist"><button aria-pressed="true">All</button><button aria-pressed="false">Open</button><button aria-pressed="false">Done</button></div><p>2 visible tasks</p><ul><li>Draft release notes</li><li>Verify analytics</li></ul></div>
  </div>
</div>

`visibleTasks` and the count are derived. The only local state is the selected filter.

## Example: Store IDs instead of objects

```tsx
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
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-state-shape-derived-values-2-store-ids-instead-of-objects" data-render-mode="react-server" role="region" aria-label="Output view: Store IDs instead of objects">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><p>Grace Hopper</p></div>
  </div>
</div>

An ID is stable across refreshes of the `users` array. The selected object is derived from the current list.

## Details to watch

- **Duplicated facts**: Two state values that represent the same fact can drift apart.
- **Object identity**: When data refreshes from a server, object references may change. IDs usually remain stable.
- **Expensive derivation**: Use `useMemo` for expensive pure calculations after the cost matters.
- **Effects**: Do not use an Effect just to copy props or state into another state variable for display.

## Series navigation

- Previous: [Part 4: Events and local state](../2026-07-07-react-events-and-local-state/)
- Next: [Part 6: Lifting state and controlled inputs](../2026-07-07-react-lifting-state-controlled-inputs/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [useMemo](https://react.dev/reference/react/useMemo)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
