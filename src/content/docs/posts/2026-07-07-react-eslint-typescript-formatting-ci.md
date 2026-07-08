---
title: "Modern React 29: ESLint, TypeScript, formatting, and CI gates"
description: "Tooling gates that keep type, lint, format, and test failures out of review."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-eslint-typescript-formatting-ci/
series:
  slug: modern-react-development
  order: 29
---

This is part 29 of the [Modern React development series](../series/modern-react-development/).

React projects stay easier to change when machines enforce the repeatable rules. TypeScript checks contracts, ESLint checks code patterns, formatters remove style debates, and continuous integration runs those checks before code lands.

## Concept

A tooling gate is an automated check that must pass before code is accepted. In React, the most important gates catch invalid types, broken Hook rules, unsafe Effects, formatting drift, and failing tests.

## Terms

- **ESLint**: A JavaScript and TypeScript linting tool that reports code pattern issues.
- **CI**: Continuous integration, an automated environment that runs checks for a change.
- **Formatter**: A tool that rewrites code layout to a consistent style.
- **Type check**: A TypeScript check that verifies types without producing runtime output.

## Mental model

Think of tooling as guardrails on the road to review. Reviewers can focus on design and behavior because syntax, types, Hook rules, and formatting already had a machine pass.

## How it is used

Use these gates in every React app that more than one person edits. They matter for Hooks, dependency arrays, component APIs, route types, generated code, design system consistency, and deploy confidence.

## How to use it

1. Run TypeScript with a command that fails on type errors.
2. Enable React and Hook lint rules, including `rules-of-hooks` and `exhaustive-deps`.
3. Run a formatter in check mode before review.
4. Run unit, component, and selected browser tests in CI.
5. Keep scripts named clearly, such as `typecheck`, `lint`, `format:check`, and `test`.

## Example: Package scripts

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "ci": "npm run typecheck && npm run lint && npm run format:check && npm run test"
  }
}
```

The command names describe what each gate verifies and make CI configuration easy to read.

## Example: Effect lint value

```tsx
import { useEffect } from "react";

export function RoomTitle({ roomId }: { roomId: string }) {
  useEffect(() => {
    document.title = "Room " + roomId;
  }, [roomId]);

  return <h1>Room {roomId}</h1>;
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-eslint-typescript-formatting-ci-1-effect-lint-value" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-eslint-typescript-formatting-ci-1-effect-lint-value.tsx" role="region" aria-label="Output view: Effect lint value">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><h1>Room general</h1></div>
  </div>
</div>

The dependency list names the reactive value used by the Effect, which keeps the browser title synchronized with the current room.

## Details to watch

- **Hook rules**: React's lint rules encode constraints that are easy to miss in review.
- **No silent skips**: CI commands should fail the build when checks fail.
- **Generated files**: Exclude generated output deliberately so gates check author-owned code.
- **Local speed**: Fast local scripts make developers run checks before pushing.

## Series navigation

- Previous: [Part 28: Vitest, Testing Library, and Playwright](../2026-07-07-react-vitest-testing-library-playwright/)
- Next: [Part 30: Routing and nested layouts](../2026-07-07-react-routing-nested-layouts/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [eslint-plugin-react-hooks lints](https://react.dev/reference/eslint-plugin-react-hooks/lints)
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [Using TypeScript](https://react.dev/learn/typescript)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
