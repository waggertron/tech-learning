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

This is part 29 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: Which errors should never reach review?

React gets easier when each concept has a job. CI should catch mechanical failures before humans spend attention on the diff.

## Problem

ESLint, TypeScript, formatting, and CI gates is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```json
{
  "scripts": {
    "check": "tsc --noEmit && eslint . && prettier --check .",
    "test": "vitest run",
    "e2e": "playwright test"
  }
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Relying on reviewers to notice unused imports, untyped props, and formatting churn.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Run the same check command locally and in CI. Different commands create different truth.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 28: Vitest, Testing Library, and Playwright](../2026-07-07-react-vitest-testing-library-playwright/)
- Next: [Part 30: Routing and nested layouts](../2026-07-07-react-routing-nested-layouts/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [typescript-eslint.io](https://typescript-eslint.io/getting-started/)
- [eslint.org](https://eslint.org/docs/latest/use/getting-started)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
