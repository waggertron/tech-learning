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

This is part 14 of the [Modern React development series](../series/modern-react-development/).

React 19 treats forms as first-class mutation surfaces. A form can call an Action, expose pending state, return result state, and support progressive enhancement when the framework integrates server features.

## Concept

An Action is a function invoked by a form or a Transition. `useActionState` connects an Action to returned state and pending state. `useFormStatus` lets a nested submit component read the pending state of its parent form.

## Terms

- **Action**: A function React treats as an ordered unit of work from a form or Transition.
- **FormData**: The browser object that carries submitted form field values.
- **Pending state**: Whether a form or Action submission is still running.
- **Progressive enhancement**: A path where a form can still submit before the client JavaScript is fully ready, when the framework supports it.

## Mental model

Think of the form as a conveyor belt. The browser gathers fields into `FormData`, the Action processes them, and React brings back a result plus pending status for the UI.

## How it is used

Use form Actions for profile edits, settings forms, contact forms, checkout steps, and server-backed mutations where the submit event is the natural boundary for collecting input and returning validation or success state.

## How to use it

1. Write an Action that accepts previous state and `FormData` when using `useActionState`.
2. Return a serializable state object with success, field errors, or a message.
3. Pass the returned form action to the form's `action` prop.
4. Render pending feedback with the third value from `useActionState` or `useFormStatus` in a child component.
5. Keep field names stable because `FormData` reads by name.

## Example: Profile form state

```tsx
import { useActionState } from "react";
import { updateProfile } from "./profileApi";

type ProfileState = {
  message: string;
};

async function saveProfile(
  previousState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (displayName.length < 2) {
    return { message: "Display name needs at least two characters." };
  }

  await updateProfile({ displayName });
  return { message: "Profile saved." };
}

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState(saveProfile, {
    message: "",
  });

  return (
    <form action={formAction}>
      <label>
        Display name
        <input name="displayName" />
      </label>
      <button disabled={isPending}>Save</button>
      <p>{state.message}</p>
    </form>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-forms-with-actions-1-profile-form-state" data-render-mode="react-server" role="region" aria-label="Output view: Profile form state">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><form action="javascript:throw new Error(&#x27;React form unexpectedly submitted.&#x27;)"><label>Display name<input name="displayName"/></label><button>Save</button><p></p></form><script>addEventListener("submit",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute("formAction");null!=f&&(e=f,b=null)}"javascript:throw new Error('React form unexpectedly submitted.')"===e&&(a.preventDefault(),b?(a=document.createElement("input"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});</script></div>
  </div>
</div>

The Action receives form data, returns display state, and lets the button reflect pending status.

## Example: Nested submit button with useFormStatus

```tsx
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? "Saving..." : "Save"}</button>;
}

export function SettingsForm({ action }: { action: (data: FormData) => void }) {
  return (
    <form action={action}>
      <input name="timezone" />
      <SubmitButton />
    </form>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-forms-with-actions-2-nested-submit-button-with-useformstatus" data-render-mode="react-server" role="region" aria-label="Output view: Nested submit button with useFormStatus">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><form action="javascript:throw new Error(&#x27;React form unexpectedly submitted.&#x27;)"><input name="timezone"/><button>Save</button></form><script>addEventListener("submit",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute("formAction");null!=f&&(e=f,b=null)}"javascript:throw new Error('React form unexpectedly submitted.')"===e&&(a.preventDefault(),b?(a=document.createElement("input"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});</script></div>
  </div>
</div>

`useFormStatus` reads the parent form, so the submit button can stay reusable without receiving pending props.

## Details to watch

- **Form names**: Every submitted field needs a `name` for `FormData` to include it.
- **Hook placement**: `useFormStatus` reads a parent form, not a form returned by the same component.
- **Serializability**: Server-backed Actions need serializable input and output values.
- **Side effects**: `useActionState` reducer actions may be async and perform side effects, unlike `useReducer` reducers.

## Series navigation

- Previous: [Part 13: Transitions for responsive updates](../2026-07-07-react-transitions-responsive-updates/)
- Next: [Part 15: Optimistic UI](../2026-07-07-react-optimistic-ui/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [useActionState](https://react.dev/reference/react/useActionState)
- [form](https://react.dev/reference/react-dom/components/form)
- [useFormStatus](https://react.dev/reference/react-dom/hooks/useFormStatus)
- [Server Functions](https://react.dev/reference/rsc/server-functions)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
