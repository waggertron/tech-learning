---
title: "Modern React 1: Components and JSX"
description: "React components, JSX, and the render output contract that keeps UI code readable."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-components-and-jsx/
series:
  slug: modern-react-development
  order: 1
---

This is part 1 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: What is a React component, and what does JSX really compile into?

React gets easier when each concept has a job. Treat a component as a pure description of UI for one set of inputs.

## Problem

Components and JSX is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
type ProductCardProps = {
  name: string;
  priceCents: number;
};

export function ProductCard({ name, priceCents }: ProductCardProps) {
  return (
    <article className="product-card">
      <h2>{name}</h2>
      <p>${(priceCents / 100).toFixed(2)}</p>
    </article>
  );
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Starting with DOM mutation habits. React wants render output, then event handlers and effects for the parts that happen later.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Log the props at the top of the component and inspect the rendered DOM. If the props are right and the markup is wrong, the render logic is the bug.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: none. Start here.
- Next: [Part 2: Props, children, and component boundaries](../2026-07-07-react-props-children-component-boundaries/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/learn/your-first-component)
- [react.dev](https://react.dev/learn/writing-markup-with-jsx)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
