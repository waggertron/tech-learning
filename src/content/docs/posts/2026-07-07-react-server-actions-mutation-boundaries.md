---
title: "Modern React 17: Server Actions and mutation boundaries"
description: "Server Actions for trusted mutations that are called from React UI."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-server-actions-mutation-boundaries/
series:
  slug: modern-react-development
  order: 17
---

This is part 17 of the [Modern React development series](../series/modern-react-development/).

Server Functions let client code request trusted work on the server when the framework supports them. When a Server Function is used from a form or Action, it becomes the mutation boundary between UI intent and server-side authority.

## Concept

A Server Function is an async function executed on the server and referenced by client code through framework support. React docs now use `Server Function` as the broader term, with `Server Action` describing a Server Function used as an Action.

## Terms

- **Server Function**: An async function that client components can call through framework integration while it executes on the server.
- **Server Action**: A Server Function used as an Action, often from a form submission.
- **Mutation boundary**: The server-side point where input is validated, authorization is checked, and data is changed.
- **Serializable**: Able to cross the client-server boundary as supported structured data.

## Mental model

Think of a Server Action as a service counter. The client brings a request ticket. The server checks identity, validates the ticket, changes the record, and returns a receipt.

## How it is used

Use Server Actions for form submissions, settings updates, create and delete flows, cart changes, and other writes that must run near private data, permissions, or server-side cache revalidation.

## How to use it

1. Place the server function where the framework recognizes the `"use server"` directive.
2. Validate input at the server boundary before trusting it.
3. Check authorization on the server even when the UI hides controls.
4. Perform the write and trigger any framework cache revalidation required by the route.
5. Return a small serializable result for UI state.

## Example: Server function for a profile update

```tsx
"use server";

export async function updateDisplayName(formData: FormData) {
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (displayName.length < 2) {
    return { ok: false, message: "Display name needs at least two characters." };
  }

  const user = await requireCurrentUser();
  await db.user.update({
    id: user.id,
    displayName,
  });

  return { ok: true, message: "Profile updated." };
}
```

The server function owns validation, identity, and the data write.

## Example: Form using a server action

```tsx
export function DisplayNameForm() {
  return (
    <form action={updateDisplayName}>
      <label>
        Display name
        <input name="displayName" />
      </label>
      <button>Save</button>
    </form>
  );
}
```

The form is small because the trusted mutation logic lives on the server side of the boundary.

## Details to watch

- **Terminology**: React docs distinguish Server Functions from Server Actions. The action use is one way to call a Server Function.
- **Authority**: Client checks shape the interface. Server checks protect the data.
- **Serialization**: Arguments and return values need to fit the framework's supported serialization rules.
- **Version care**: Framework support for Server Functions depends on the framework and React integration version.

## Series navigation

- Previous: [Part 16: Server Components and client boundaries](../2026-07-07-react-server-components-client-boundaries/)
- Next: [Part 18: TypeScript patterns for React](../2026-07-07-react-typescript-component-patterns/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Server Functions](https://react.dev/reference/rsc/server-functions)
- [use server](https://react.dev/reference/rsc/use-server)
- [form](https://react.dev/reference/react-dom/components/form)
- [useActionState](https://react.dev/reference/react/useActionState)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
