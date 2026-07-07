---
title: "Modern React 36: Accessibility as component API design"
description: "Accessibility as component API design, not a cleanup pass after markup exists."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-accessibility-component-api-design/
series:
  slug: modern-react-development
  order: 36
---

This is part 36 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: How do you make inaccessible states impossible or obvious?

React gets easier when each concept has a job. Component props should force or strongly encourage accessible usage.

## Problem

Accessibility as component API design is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
type IconButtonProps = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export function IconButton({ label, icon, onClick }: IconButtonProps) {
  return (
    <button aria-label={label} onClick={onClick}>
      {icon}
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

Shipping an icon-only button without a required accessible label.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Query by role and accessible name in tests. If the query is hard, the UI is probably hard too.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 35: Styling, design tokens, and variants](../2026-07-07-react-styling-design-tokens-variants/)
- Next: [Part 37: Validation at form and API boundaries](../2026-07-07-react-validation-form-api-boundaries/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/reference/react-dom/components/common#applying-aria-attributes)
- [testing-library.com](https://testing-library.com/docs/queries/byrole/)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
