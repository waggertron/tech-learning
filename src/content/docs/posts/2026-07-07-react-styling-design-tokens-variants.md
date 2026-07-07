---
title: "Modern React 35: Styling, design tokens, and variants"
description: "Styling React components with tokens, variants, and predictable class contracts."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-styling-design-tokens-variants/
series:
  slug: modern-react-development
  order: 35
---

This is part 35 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: How do you keep component styling predictable without hard-coding every case?

React gets easier when each concept has a job. Treat visual variants as part of the component API.

## Problem

Styling, design tokens, and variants is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
const buttonClass = {
  primary: 'btn btn-primary',
  danger: 'btn btn-danger',
  ghost: 'btn btn-ghost',
} as const;

type ButtonTone = keyof typeof buttonClass;

export function ActionButton({
  tone = 'primary',
  children,
}: {
  tone?: ButtonTone;
  children: React.ReactNode;
}) {
  return <button className={buttonClass[tone]}>{children}</button>;
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Accepting arbitrary class names for every internal element and calling it flexible.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Render every variant in a workbench. Missing states show up faster than they do in product flows.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 34: Code splitting and lazy loading](../2026-07-07-react-code-splitting-lazy-loading/)
- Next: [Part 36: Accessibility as component API design](../2026-07-07-react-accessibility-component-api-design/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/learn#building-components)
- [storybook.js.org](https://storybook.js.org/docs/writing-stories)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
