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

This is part 4 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: What does state remember between renders, and what should stay as a local variable?

React gets easier when each concept has a job. State stores facts that must survive a render. Local variables store facts for this render only.

## Problem

Events and local state is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((current) => current + 1)}>
      Count: {count}
    </button>
  );
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Mutating a local variable and expecting the screen to change. React only re-renders when state, props, or context change.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Use React DevTools to watch state updates. If state changes but UI does not, check derived rendering. If state does not change, check the event path.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 3: Rendering lists and stable keys](../2026-07-07-react-rendering-lists-stable-keys/)
- Next: [Part 5: State shape and derived values](../2026-07-07-react-state-shape-derived-values/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/learn/responding-to-events)
- [react.dev](https://react.dev/learn/state-a-components-memory)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
