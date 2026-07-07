---
title: "Modern React 18: TypeScript patterns for React"
description: "TypeScript component APIs that make invalid prop combinations harder to express."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-typescript-component-patterns/
series:
  slug: modern-react-development
  order: 18
---

This is part 18 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: How do you make component APIs narrow enough to be useful?

React gets easier when each concept has a job. Types should describe the component contract, not just silence the compiler.

## Problem

TypeScript patterns for React is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
type ButtonProps =
  | { kind: 'link'; href: string; children: React.ReactNode }
  | { kind: 'button'; onClick: () => void; children: React.ReactNode };

export function Button(props: ButtonProps) {
  if (props.kind === 'link') {
    return <a href={props.href}>{props.children}</a>;
  }
  return <button onClick={props.onClick}>{props.children}</button>;
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Making every prop optional and handling impossible combinations at runtime.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Write the invalid examples first. The compiler should reject them before a test can run.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 17: Server Actions and mutation boundaries](../2026-07-07-react-server-actions-mutation-boundaries/)
- Next: [Part 19: Testing components by behavior](../2026-07-07-react-testing-components-by-behavior/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/learn/typescript)
- [typescriptlang.org](https://www.typescriptlang.org/docs/)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
