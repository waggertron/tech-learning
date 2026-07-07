---
title: "Modern React 37: Validation at form and API boundaries"
description: "Validation at form and API boundaries before user input becomes trusted application state."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-validation-form-api-boundaries/
series:
  slug: modern-react-development
  order: 37
---

This is part 37 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: Where do you validate user input before it becomes application state?

React gets easier when each concept has a job. Parse input at the boundary and pass typed data inward.

## Problem

Validation at form and API boundaries is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
type ProfileInput = { name: string };

function parseProfile(formData: FormData): ProfileInput | { error: string } {
  const name = String(formData.get('name') ?? '').trim();
  if (name.length < 2) return { error: 'Name must be at least 2 characters' };
  return { name };
}

export async function saveProfile(formData: FormData) {
  const parsed = parseProfile(formData);
  if ('error' in parsed) return parsed;
  await fetch('/api/profile', { method: 'POST', body: JSON.stringify(parsed) });
  return { error: '' };
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Letting raw `FormData` or unchecked JSON leak through the application.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Test invalid values at the UI and API boundary. The server path matters most.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 36: Accessibility as component API design](../2026-07-07-react-accessibility-component-api-design/)
- Next: [Part 38: Auth, roles, and protected UI](../2026-07-07-react-auth-roles-protected-ui/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/reference/react-dom/components/form)
- [react.dev](https://react.dev/reference/react/useActionState)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
