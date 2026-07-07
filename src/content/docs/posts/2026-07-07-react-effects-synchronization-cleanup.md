---
title: "Modern React 10: Effects, synchronization, and cleanup"
description: "Effects as synchronization with external systems, plus the cleanup discipline that prevents leaks."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-effects-synchronization-cleanup/
series:
  slug: modern-react-development
  order: 10
---

This is part 10 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: What is an effect for, and what code does not belong in one?

React gets easier when each concept has a job. An effect connects rendered React state to something outside React.

## Problem

Effects, synchronization, and cleanup is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { useEffect, useState } from 'react';

export function OnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return <p>{online ? 'Online' : 'Offline'}</p>;
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Using an effect to calculate data that could be derived during render.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Run in Strict Mode and watch for double setup. If duplicate subscriptions break the page, cleanup is incomplete.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 9: Refs and DOM escape hatches](../2026-07-07-react-refs-dom-escape-hatches/)
- Next: [Part 11: Custom hooks as reuse boundaries](../2026-07-07-react-custom-hooks-reuse-boundaries/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/learn/synchronizing-with-effects)
- [react.dev](https://react.dev/learn/you-might-not-need-an-effect)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
