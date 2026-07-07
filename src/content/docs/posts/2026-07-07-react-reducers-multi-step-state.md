---
title: "Modern React 7: Reducers for multi-step state"
description: "Reducers for state transitions that need names, invariants, and testable branches."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-reducers-multi-step-state/
series:
  slug: modern-react-development
  order: 7
---

This is part 7 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: When does `useState` stop being the clearest model?

React gets easier when each concept has a job. Use a reducer when the transitions are more important than the individual setter calls.

## Problem

Reducers for multi-step state is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { useReducer } from 'react';

type State = { count: number };
type Action = { type: 'increment' } | { type: 'reset' };

function reducer(state: State, action: Action): State {
  if (action.type === 'increment') return { count: state.count + 1 };
  return { count: 0 };
}

export function ReducerCounter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Add</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
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

Scattering related `setState` calls through event handlers until the state machine only exists in your head.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Test the reducer as a plain function. It should be possible to cover the transition table without rendering React.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 6: Lifting state and controlled inputs](../2026-07-07-react-lifting-state-controlled-inputs/)
- Next: [Part 8: Context without global soup](../2026-07-07-react-context-without-global-soup/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/learn/extracting-state-logic-into-a-reducer)
- [react.dev](https://react.dev/reference/react/useReducer)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
