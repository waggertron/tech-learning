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

This is part 3 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: Why do keys need to come from identity, not array position?

React gets easier when each concept has a job. A key tells React which item is which between renders. Use domain identity whenever possible.

## Problem

Rendering lists and stable keys is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
type Task = { id: string; title: string; done: boolean };

export function TaskList({ tasks }: { tasks: Task[] }) {
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

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Using the array index because it removes the warning. It hides state bugs when items are inserted, removed, or sorted.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Add a reorder case to the test data. If checked boxes, focus, or local state move to the wrong row, the key is wrong.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 2: Props, children, and component boundaries](../2026-07-07-react-props-children-component-boundaries/)
- Next: [Part 4: Events and local state](../2026-07-07-react-events-and-local-state/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/learn/rendering-lists)
- [react.dev](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
