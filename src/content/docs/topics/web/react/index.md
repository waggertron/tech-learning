---
title: React, a 10-part series
description: "A progression from Vite project setup and JSX through performance optimization, testing, and production deployment. Ten focused parts, each with runnable code and the patterns that matter in real apps."
category: web
tags: [react, javascript, typescript, web, frontend]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## Who this series is for

- **New to React** → start at Part 1 and work through in order.
- **Have shipped a React app but feel shaky on hooks** → Parts 2, 3, and 4 cover useState, useEffect, and the Context/Reducer pair that trips most intermediate developers.
- **Preparing for a frontend interview** → Parts 6, 7, 9, and 10 cover data fetching, state management, performance, and testing, the topics that come up most in senior screens.

Each part is standalone enough to read on its own, but later parts assume you understand the primitives introduced earlier.

## The parts

1. [Part 1: JSX and components](./part-01-jsx-and-components/) *(beginner)*
2. [Part 2: State and events](./part-02-state-and-events/) *(beginner)*
3. [Part 3: Hooks](./part-03-hooks/) *(beginner → intermediate)*
4. [Part 4: Context and reducers](./part-04-context-and-reducers/) *(intermediate)*
5. [Part 5: Routing](./part-05-routing/) *(intermediate)*
6. [Part 6: Data fetching](./part-06-data-fetching/) *(intermediate)*
7. [Part 7: State management](./part-07-state-management/) *(intermediate → advanced)*
8. [Part 8: Forms](./part-08-forms/) *(intermediate)*
9. [Part 9: Performance](./part-09-performance/) *(advanced)*
10. [Part 10: Production](./part-10-production/) *(expert)*

## Versions this series targets

- React 19
- Vite 6
- React Router 7
- TypeScript 5
- TanStack Query 5 (React Query)
- Zustand 4, Redux Toolkit 2
- React Hook Form 7, Zod 3
- Vitest 2, React Testing Library 16

React 19 introduced several changes from the React 16/17 era articles still dominating search results: the new compiler, `use()` hook, improved Suspense, and server components. Where something changed significantly from older patterns, I'll flag it inline.

## How I'd actually learn React today

What works well for most engineers ramping up:

1. Build a small component-based UI through Parts 1 and 2, get comfortable thinking in components and state.
2. Add useEffect for side effects (Part 3) and lift shared state into Context (Part 4).
3. Wire up a router (Part 5) and connect to a real API (Part 6).
4. Reach for Zustand or RTK (Part 7) only once prop drilling becomes painful.
5. Read Parts 9 and 10 before you ship to production, not after.

## References that apply to every part

- [React documentation](https://react.dev/), the official docs were fully rewritten for hooks-first React and are the best resource bar none
- [Vite documentation](https://vitejs.dev/guide/), covers the build tool used throughout this series
- [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/), keep open alongside Parts 1 and 10
- [TanStack Query docs](https://tanstack.com/query/latest), the canonical reference for Part 6
- [React Router docs](https://reactrouter.com/), covers the v7 API used in Part 5

## Related topics

- [Django, a 10-part series](../django/), if you need a backend API to pair with this frontend
- [Testing](../../testing/tdd/), the TDD mindset applies to React component tests just as well
