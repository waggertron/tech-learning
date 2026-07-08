---
title: "Modern React 4: Events and local state"
description: "Event handlers, local state, and the render cycle behind interactive React components."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-events-and-local-state/
series:
  slug: modern-react-development
  order: 4
---

This is part 4 of the [Modern React development series](../series/modern-react-development/).

React components become interactive when event handlers record user intent and state remembers the values that affect rendering. The pair is small, but it explains buttons, menus, tabs, toggles, inline editors, and form controls.

## Concept

An event handler is a function React calls after an event such as a click, change, submit, key press, or pointer movement. Local state is component memory managed with a Hook such as `useState`, and React renders again when that state changes.

## Terms

- **Event handler**: A function passed to a JSX event prop such as `onClick` or `onChange`.
- **Local state**: State owned by one component instance.
- **State setter**: The function returned by `useState` that schedules the next state value.
- **Render**: React calling a component to calculate what the UI should look like for the current inputs.

## Mental model

Treat each render as a snapshot. The JSX sees the state values from that render. Event handlers can request the next snapshot by calling a state setter.

## How it is used

Use local state for details that belong to one component: whether a menu is open, which tab is selected, the current text in an input, or whether help text is visible. Use events to update that state in response to user intent.

## How to use it

1. Declare state at the top level of the component with `useState`.
2. Pass a function to event props. Do not call the handler while rendering.
3. Use functional state updates when the next value depends on the previous value.
4. Move state upward only when another component needs to read or change it.

## Example: Counter with functional updates

```tsx
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((current) => current + 1)}>
      Count: {count}
    </button>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-events-and-local-state-1-counter-with-functional-updates" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-events-and-local-state-1-counter-with-functional-updates.tsx" role="region" aria-label="Output view: Counter with functional updates">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><button>Count: 0</button></div>
  </div>
</div>

The updater receives the current queued value, which makes it the right shape when several updates can happen close together.

## Example: Disclosure state

```tsx
import { useState } from "react";

export function HelpDisclosure() {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Shipping details
      </button>
      {open && <p>Orders ship within two business days.</p>}
    </section>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-events-and-local-state-2-disclosure-state" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-events-and-local-state-2-disclosure-state.tsx" role="region" aria-label="Output view: Disclosure state">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><section><button type="button" aria-expanded="false">Shipping details</button></section></div>
  </div>
</div>

The state belongs in the disclosure because no other component needs to own this open or closed memory.

## Details to watch

- **Passing handlers**: `onClick={handleClick}` passes a function. `onClick={handleClick()}` calls it during render.
- **Snapshots**: Reading state after calling a setter still reads the value from the current render.
- **Functional updates**: Use `setValue((current) => next)` when the next value depends on the current one.
- **State owner**: State should live where the memory is used. Shared memory moves to the closest common parent.

## Series navigation

- Previous: [Part 3: Rendering lists and stable keys](../2026-07-07-react-rendering-lists-stable-keys/)
- Next: [Part 5: State shape and derived values](../2026-07-07-react-state-shape-derived-values/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Responding to Events](https://react.dev/learn/responding-to-events)
- [State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
