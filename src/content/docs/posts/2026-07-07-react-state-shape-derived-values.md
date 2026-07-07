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

This is part 5 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: How do you avoid storing the same fact twice?

React gets easier when each concept has a job. Keep the source fact in state. Recompute cheap derived values during render.

## Problem

State shape and derived values is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { useState } from 'react';

const filters = ['all', 'open', 'done'] as const;
type Filter = (typeof filters)[number];

export function TaskSummary({ tasks }: { tasks: { done: boolean }[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const openCount = tasks.filter((task) => !task.done).length;

  return (
    <>
      <p>{openCount} open tasks</p>
      <select value={filter} onChange={(event) => setFilter(event.target.value as Filter)}>
        {filters.map((value) => <option key={value}>{value}</option>)}
      </select>
    </>
  );
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Storing both `tasks` and `openCount`. The two values drift unless every update path remembers both.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Temporarily compute the derived value inline and compare it to stored state. A mismatch proves duplicated state.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 4: Events and local state](../2026-07-07-react-events-and-local-state/)
- Next: [Part 6: Lifting state and controlled inputs](../2026-07-07-react-lifting-state-controlled-inputs/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/learn/choosing-the-state-structure)
- [react.dev](https://react.dev/learn/you-might-not-need-an-effect)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
