---
title: "Modern React 28: Vitest, Testing Library, and Playwright"
description: "Choosing between Vitest, Testing Library, and Playwright for different React failure modes."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-vitest-testing-library-playwright/
series:
  slug: modern-react-development
  order: 28
---

This is part 28 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: Which test catches this failure: unit, component, or browser flow?

React gets easier when each concept has a job. Use the smallest test that can catch the failure with confidence.

## Problem

Vitest, Testing Library, and Playwright is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { test, expect } from '@playwright/test';

test('user can create a project', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('link', { name: /new project/i }).click();
  await page.getByLabel(/name/i).fill('Apollo');
  await page.getByRole('button', { name: /create/i }).click();
  await expect(page.getByRole('heading', { name: 'Apollo' })).toBeVisible();
});
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Putting every behavior in browser tests. They are valuable, but slow and harder to isolate.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Classify the bug: pure function, component behavior, integration boundary, or full browser flow.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 27: Storybook and component workbenches](../2026-07-07-react-storybook-component-workbenches/)
- Next: [Part 29: ESLint, TypeScript, formatting, and CI gates](../2026-07-07-react-eslint-typescript-formatting-ci/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [vitest.dev](https://vitest.dev/guide/)
- [playwright.dev](https://playwright.dev/docs/intro)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
