---
title: "Modern React 19: Testing components by behavior"
description: "Component tests that assert user-visible behavior instead of implementation details."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-testing-components-by-behavior/
series:
  slug: modern-react-development
  order: 19
---

This is part 19 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: What should a React test assert, and what should it ignore?

React gets easier when each concept has a job. Query the page like a user or assistive technology would.

## Problem

Testing components by behavior is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('increments the counter', async () => {
  render(<Counter />);
  await userEvent.click(screen.getByRole('button', { name: /count: 0/i }));
  expect(screen.getByRole('button', { name: /count: 1/i })).toBeInTheDocument();
});
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Testing class names, component state, or hook internals when the behavior is what matters.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Remove a CSS class or refactor state. A behavior test should still pass when the user experience is unchanged.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 18: TypeScript patterns for React](../2026-07-07-react-typescript-component-patterns/)
- Next: [Part 20: Performance and React Compiler](../2026-07-07-react-performance-and-compiler/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [testing-library.com](https://testing-library.com/docs/react-testing-library/intro/)
- [testing-library.com](https://testing-library.com/docs/queries/about/)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
