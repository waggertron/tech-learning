---
title: "Modern React 9: Refs and DOM escape hatches"
description: "Refs for DOM access, focus, measurements, and mutable handles that should not drive rendering."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-refs-dom-escape-hatches/
series:
  slug: modern-react-development
  order: 9
---

This is part 9 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: How do you reach the DOM without making render state lie?

React gets easier when each concept has a job. A ref is for reaching outside React or keeping mutable data that does not affect the UI.

## Problem

Refs and DOM escape hatches is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { useRef } from 'react';

export function FocusNameButton() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input ref={inputRef} aria-label="Name" />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
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

Using refs as secret state. If the screen depends on the value, it belongs in state.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Ask whether changing the value should re-render. If yes, use state. If no, a ref may fit.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 8: Context without global soup](../2026-07-07-react-context-without-global-soup/)
- Next: [Part 10: Effects, synchronization, and cleanup](../2026-07-07-react-effects-synchronization-cleanup/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/learn/referencing-values-with-refs)
- [react.dev](https://react.dev/learn/manipulating-the-dom-with-refs)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
