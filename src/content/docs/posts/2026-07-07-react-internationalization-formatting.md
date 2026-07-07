---
title: "Modern React 39: Internationalization and formatting"
description: "Internationalization and formatting for dates, numbers, currency, and text that cannot stay hard-coded."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-internationalization-formatting/
series:
  slug: modern-react-development
  order: 39
---

This is part 39 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: How do dates, numbers, and text stop being hard-coded English strings?

React gets easier when each concept has a job. Formatting belongs at the edge where data becomes text for a locale.

## Problem

Internationalization and formatting is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
export function InvoiceTotal({
  cents,
  locale,
  currency,
}: {
  cents: number;
  locale: string;
  currency: string;
}) {
  const total = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(cents / 100);

  return <p>Total due: {total}</p>;
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Concatenating strings and assuming English word order, US dates, and one currency.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Render with a different locale and a long currency name. Layout and formatting should still hold.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 38: Auth, roles, and protected UI](../2026-07-07-react-auth-roles-protected-ui/)
- Next: [Part 40: Deployment, observability, and feature flags](../2026-07-07-react-deployment-observability-feature-flags/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [formatjs.github.io](https://formatjs.github.io/docs/react-intl/)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
