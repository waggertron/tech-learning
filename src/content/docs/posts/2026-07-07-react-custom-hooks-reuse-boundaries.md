---
title: "Modern React 11: Custom hooks as reuse boundaries"
description: "Custom hooks as reusable stateful behavior with a small public contract."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-custom-hooks-reuse-boundaries/
series:
  slug: modern-react-development
  order: 11
---

This is part 11 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: How do you reuse stateful behavior without making one huge component?

React gets easier when each concept has a job. Extract a hook when behavior repeats, not just because code is long.

## Problem

Custom hooks as reuse boundaries is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { useEffect, useState } from 'react';

export function useLocalStorage(key: string, fallback: string) {
  const [value, setValue] = useState(() => localStorage.getItem(key) ?? fallback);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Making a custom hook return a bag of unrelated values. That recreates a component object under another name.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Use the hook in two different components. If the second use needs irrelevant options, split the hook.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 10: Effects, synchronization, and cleanup](../2026-07-07-react-effects-synchronization-cleanup/)
- Next: [Part 12: Data loading with Suspense boundaries](../2026-07-07-react-suspense-data-loading-boundaries/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [react.dev](https://react.dev/reference/rules/rules-of-hooks)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
