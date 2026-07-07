---
title: "Modern React 2: Props, children, and component boundaries"
description: "Props, children, and the boundary between reusable components and application-specific decisions."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-props-children-component-boundaries/
series:
  slug: modern-react-development
  order: 2
---

This is part 2 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: Which data belongs in a reusable component, and which data should stay outside?

React gets easier when each concept has a job. Put stable display rules inside the component. Keep fetching, routing, and product decisions outside it.

## Problem

Props, children, and component boundaries is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
type PanelProps = {
  title: string;
  children: React.ReactNode;
};

export function Panel({ title, children }: PanelProps) {
  return (
    <section aria-labelledby="panel-title">
      <h2 id="panel-title">{title}</h2>
      {children}
    </section>
  );
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Passing a giant object because it is convenient. That couples the component to every field the caller happens to have.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Render the component with the smallest possible props in a story or test. Missing props reveal unclear ownership.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 1: Components and JSX](../2026-07-07-react-components-and-jsx/)
- Next: [Part 3: Rendering lists and stable keys](../2026-07-07-react-rendering-lists-stable-keys/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/learn/passing-props-to-a-component)
- [react.dev](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
