---
title: "Modern React 20: Performance and React Compiler"
description: "React performance work, profiler-first decisions, and how React Compiler changes memoization habits."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-performance-and-compiler/
series:
  slug: modern-react-development
  order: 20
---

This is part 20 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: What should you measure before adding memoization or splitting a tree?

React gets easier when each concept has a job. Follow React rules first, measure second, and memoize only where the measurement points.

## Problem

Performance and React Compiler is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { memo } from 'react';

type RowProps = { label: string; selected: boolean };

const Row = memo(function Row({ label, selected }: RowProps) {
  return <li aria-selected={selected}>{label}</li>;
});

export function ResultList({ results, selectedId }: {
  results: { id: string; label: string }[];
  selectedId: string;
}) {
  return (
    <ul>
      {results.map((result) => (
        <Row
          key={result.id}
          label={result.label}
          selected={result.id === selectedId}
        />
      ))}
    </ul>
  );
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Adding `memo`, `useMemo`, and `useCallback` everywhere as a style rule.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Use the React Profiler to find a slow commit before changing code.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 19: Testing components by behavior](../2026-07-07-react-testing-components-by-behavior/)
- Next: [Part 21: Framework choice and project setup](../2026-07-07-react-framework-choice-project-setup/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/learn/react-compiler)
- [react.dev](https://react.dev/reference/react/memo)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
