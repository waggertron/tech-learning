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

This is part 37 of the [Modern React development series](../series/modern-react-development/).

Validation belongs at the boundary where untrusted input enters the application. React forms can guide users while they type, but server and API boundaries still need to parse and validate before data becomes trusted.

## Concept

Validation is the process of checking input against rules before using it. In React applications, validation can happen in form controls, client submit handlers, Actions, route actions, API handlers, and server functions.

## Terms

- **Form boundary**: The point where browser fields are collected into input values.
- **API**: Application programming interface, the boundary where code sends or receives structured data.
- **Parse**: Convert raw input into a typed value or a validation error.
- **Field error**: A validation message tied to one input.

## Mental model

Think of validation as customs at every border. Helpful client checks speed up the trip, but the server still checks passports before granting entry.

## How it is used

Use client validation for immediate guidance, form Action validation for submission state, and server or API validation for authority. Use the same schema or parsing rules where the stack makes that practical.

## How to use it

1. Define the shape of accepted input.
2. Parse raw strings from `FormData`, route params, and JSON bodies before using them.
3. Return field errors and form-level errors in a serializable shape.
4. Render errors next to the controls they describe.
5. Keep authorization checks next to trusted server mutations, not only in the client UI.

## Example: Parse form input

```tsx
import { z } from "zod";

type ProfileInput =
  | { ok: true; displayName: string }
  | { ok: false; error: string };

const profileSchema = z.object({
  displayName: z.string().trim().min(2),
});

function parseProfile(formData: FormData): ProfileInput {
  const parsed = profileSchema.safeParse({
    displayName: formData.get("displayName"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Display name needs at least two characters." };
  }

  return { ok: true, displayName: parsed.data.displayName };
}
```

The parser turns raw form data into either a trusted value or a clear error.

## Example: Action returns validation state

```tsx
import { parseProfile } from "./parseProfile";
import { updateProfile } from "./profileApi";

type FormState = {
  fieldErrors: Record<string, string>;
  message: string;
};

async function saveProfile(
  previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parseProfile(formData);

  if (!parsed.ok) {
    return {
      fieldErrors: { displayName: parsed.error },
      message: "Check the highlighted fields.",
    };
  }

  await updateProfile(parsed.displayName);
  return { fieldErrors: {}, message: "Saved." };
}
```

The Action returns a UI-friendly result while keeping parsing at the submit boundary.

## Details to watch

- **String input**: FormData values start as strings or files. Parse numbers, booleans, dates, and enums explicitly.
- **Client guidance**: Client validation improves feedback but cannot be the only protection for server data.
- **Error shape**: Use stable error keys so fields can render messages predictably.
- **Schema reuse**: Shared validation libraries help when the same rules need to run in client and server environments.

## Series navigation

- Previous: [Part 36: Accessibility as component API design](../2026-07-07-react-accessibility-component-api-design/)
- Next: [Part 38: Auth, roles, and protected UI](../2026-07-07-react-auth-roles-protected-ui/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [form](https://react.dev/reference/react-dom/components/form)
- [useActionState](https://react.dev/reference/react/useActionState)
- [Server Functions](https://react.dev/reference/rsc/server-functions)
- [input](https://react.dev/reference/react-dom/components/input)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
