---
title: "Modern React 8: Context without global soup"
description: "Context as dependency injection for React trees, not a dumping ground for every shared value."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-context-without-global-soup/
series:
  slug: modern-react-development
  order: 8
---

This is part 8 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: When does context help, and when is it just hidden coupling?

React gets easier when each concept has a job. Use context for values that many descendants read and few places change.

## Problem

Context without global soup is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { createContext, use } from 'react';

const ThemeContext = createContext<'light' | 'dark'>('light');

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext value="dark">{children}</ThemeContext>;
}

export function ThemeBadge() {
  const theme = use(ThemeContext);
  return <span data-theme={theme}>{theme}</span>;
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Putting fast-changing form state in a top-level context. That turns one keystroke into a wide render problem.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Move a value out of context and pass it through props in one branch. If the code gets clearer, context was hiding coupling.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 7: Reducers for multi-step state](../2026-07-07-react-reducers-multi-step-state/)
- Next: [Part 9: Refs and DOM escape hatches](../2026-07-07-react-refs-dom-escape-hatches/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/learn/passing-data-deeply-with-context)
- [react.dev](https://react.dev/reference/react/createContext)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
