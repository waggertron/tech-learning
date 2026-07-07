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

This is part 20 of the [Modern React development series](../series/modern-react-development/).

React performance work starts with clarity: pure components, stable data flow, and measurements from the real interaction. React Compiler changes the memoization conversation by automating many optimizations when the app follows React's rules.

## Concept

React performance tuning is the practice of reducing unnecessary work, expensive renders, large bundles, and slow data paths. React Compiler is a build-time optimizer that can automatically memoize components and values in supported code.

## Terms

- **Memoization**: Reusing a previous calculation or rendered result when inputs have not changed.
- **Profiler**: A tool for measuring render cost and interaction timing.
- **React Compiler**: A build-time optimizer that can handle many memoization cases automatically.
- **Purity**: The property that a component or Hook returns output without changing outside values during render.

## Mental model

Treat performance like a budget review. Measure where time is going, remove unnecessary work, then add memoization where repeated work still costs enough to matter.

## How it is used

Use performance tools on slow interactions, large tables, dashboards, charts, route transitions, and forms that feel delayed. Use the Compiler where the framework and build setup support it, and keep manual memoization for measured cases or library boundaries.

## How to use it

1. Keep render pure and state minimal so React can reason about updates.
2. Measure the slow interaction with Profiler or browser tools.
3. Check bundle size, list rendering, data fetching, and expensive calculations before adding memoization.
4. Use `memo`, `useMemo`, or `useCallback` only when they protect real work or stable component contracts.
5. Adopt React Compiler incrementally when the project tooling supports it.

## Example: Memoized expensive calculation

```tsx
import { useMemo, useState } from "react";

export function FilteredReport({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");

  const visibleRows = useMemo(() => {
    return runExpensiveFilter(rows, query);
  }, [rows, query]);

  return (
    <>
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      <ReportTable rows={visibleRows} />
    </>
  );
}
```

`useMemo` protects a pure calculation. It does not make the first render faster, but it can skip work on later renders.

## Example: Profiler around a slow region

```tsx
import { Profiler } from "react";

export function InstrumentedDashboard() {
  return (
    <Profiler
      id="dashboard"
      onRender={(id, phase, actualDuration) => {
        reportRenderTiming({ id, phase, actualDuration });
      }}
    >
      <Dashboard />
    </Profiler>
  );
}
```

Profiler data gives performance work a target instead of turning every component into a memoization exercise.

## Details to watch

- **Compiler first principles**: Compiler benefits depend on React rules and build support. Pure components are the foundation.
- **Manual memoization**: Memo APIs add their own comparison and dependency costs. Use them where they save meaningful work.
- **Development timing**: Development builds and Strict Mode are useful for debugging, but production builds give better timing data.
- **Data loading**: Slow UI is often a network or waterfall issue, not a component render issue.

## Series navigation

- Previous: [Part 19: Testing components by behavior](../2026-07-07-react-testing-components-by-behavior/)
- Next: [Part 21: Framework choice and project setup](../2026-07-07-react-framework-choice-project-setup/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [React Compiler](https://react.dev/learn/react-compiler)
- [memo](https://react.dev/reference/react/memo)
- [useMemo](https://react.dev/reference/react/useMemo)
- [Profiler](https://react.dev/reference/react/Profiler)
- [Components and Hooks must be pure](https://react.dev/reference/rules/components-and-hooks-must-be-pure)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
