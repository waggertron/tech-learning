---
title: "Modern React 14: Forms with Actions"
description: "React form Actions, pending state, and server-friendly mutation flows."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-forms-with-actions/
series:
  slug: modern-react-development
  order: 14
---

This is part 14 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: How do React 19 form Actions simplify pending and error state?

React gets easier when each concept has a job. Actions let the form carry the mutation boundary instead of wiring every submit by hand.

## Problem

Forms with Actions is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { useActionState } from 'react';

async function saveProfile(_state: string | null, formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  if (!name) return 'Name is required';
  await fetch('/api/profile', { method: 'POST', body: JSON.stringify({ name }) });
  return null;
}

export function ProfileForm() {
  const [error, action, pending] = useActionState(saveProfile, null);

  return (
    <form action={action}>
      <input name="name" />
      <button disabled={pending}>Save</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Duplicating pending, error, and success state in several event handlers.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Test empty input and double submit. The action should reject invalid data and keep pending state honest.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 13: Transitions for responsive updates](../2026-07-07-react-transitions-responsive-updates/)
- Next: [Part 15: Optimistic UI](../2026-07-07-react-optimistic-ui/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [react.dev](https://react.dev/reference/react/useActionState)
- [react.dev](https://react.dev/reference/react-dom/components/form)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
