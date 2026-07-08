---
title: "Modern React 38: Auth, roles, and protected UI"
description: "Auth-aware React UI that hides unusable controls without pretending that hiding is authorization."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-auth-roles-protected-ui/
series:
  slug: modern-react-development
  order: 38
---

This is part 38 of the [Modern React development series](../series/modern-react-development/).

Auth-aware UI helps users understand what they can do, but it is not the same as authorization. React can hide, disable, or label controls based on a session snapshot. The server still decides whether the action is allowed.

## Concept

Authentication identifies the user. Authorization decides what that user can do. Roles and permissions are inputs to UI rendering, but trusted checks belong at server, route, or API boundaries.

## Terms

- **Auth**: Authentication, the process of identifying who the user is.
- **Authorization**: The decision about whether an identified user can perform an action.
- **Role**: A named group of permissions such as admin, editor, or viewer.
- **Protected UI**: Interface that changes based on the user's auth or permission state.
- **API**: Application programming interface, the boundary where code sends or receives structured data or actions.

## Mental model

Think of protected UI as signage, not the lock. Good signage prevents confusion. The lock still lives on the server-side door.

## How it is used

Use auth-aware React UI for navigation, disabled controls, empty states, admin sections, account menus, upgrade prompts, and warnings before privileged actions. Check permissions again in server functions, route actions, API handlers, and data loaders.

## How to use it

1. Load a minimal session or permission snapshot for rendering.
2. Pass permissions to components through props, context, or route data.
3. Render unavailable actions as hidden, disabled, or explanatory based on user experience needs.
4. Check authorization at every trusted mutation and data read boundary.
5. Keep permission names domain-specific and test important combinations.

## Example: Permission-aware button

```tsx
import type { MouseEventHandler } from "react";

type DeleteProjectButtonProps = {
  canDelete: boolean;
  onDelete: MouseEventHandler<HTMLButtonElement>;
};

export function DeleteProjectButton({
  canDelete,
  onDelete,
}: DeleteProjectButtonProps) {
  if (!canDelete) {
    return <p>You need project admin access to delete this project.</p>;
  }

  return (
    <button type="button" onClick={onDelete}>
      Delete project
    </button>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-auth-roles-protected-ui-1-permission-aware-button" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-auth-roles-protected-ui-1-permission-aware-button.tsx" role="region" aria-label="Output view: Permission-aware button">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><button type="button">Delete project</button></div>
  </div>
</div>

The UI explains the missing permission. The server still needs to enforce the same rule.

## Example: Server check at mutation boundary

```tsx
import { canDeleteProject, requireCurrentUser } from "./auth";
import { db } from "./db";

async function deleteProject(projectId: string) {
  const user = await requireCurrentUser();
  const allowed = await canDeleteProject(user.id, projectId);

  if (!allowed) {
    throw new Error("Not allowed");
  }

  await db.project.delete({ id: projectId });
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-auth-roles-protected-ui-2-server-check-at-mutation-boundary" data-render-mode="result" data-interaction-mode="runner" data-runner-entry="2026-07-07-react-auth-roles-protected-ui-2-server-check-at-mutation-boundary" role="region" aria-label="Output view: Server check at mutation boundary">
  <div class="react-example-output__header">Runtime result</div>
  <div class="react-example-output__body">
    <div class="react-example-output__runner" data-react-example-runner="2026-07-07-react-auth-roles-protected-ui-2-server-check-at-mutation-boundary">
  <button type="button" class="react-example-output__run-button">Run example</button>
  <div class="react-example-output__runner-output" aria-live="polite">
    <p><strong>Server check at mutation boundary.</strong> The code exports a value or function used by the surrounding example.</p>
  </div>
</div>
  </div>
</div>

The trusted write checks authorization where the data changes.

## Details to watch

- **UI feedback**: Hide actions when they are irrelevant. Disable or explain actions when the user needs to understand why they cannot proceed.
- **Server authority**: Never treat hidden UI as authorization.
- **Session freshness**: Client session snapshots can be stale. Server checks use the current source of truth.
- **Roles vs permissions**: Roles are convenient labels. Permissions describe exact capabilities.

## Series navigation

- Previous: [Part 37: Validation at form and API boundaries](../2026-07-07-react-validation-form-api-boundaries/)
- Next: [Part 39: Internationalization and formatting](../2026-07-07-react-internationalization-formatting/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Server Functions](https://react.dev/reference/rsc/server-functions)
- [Server Components](https://react.dev/reference/rsc/server-components)
- [Next.js Authentication guide](https://nextjs.org/docs/app/guides/authentication)

## Related topics

- [Web topics](../../topics/web/)
- [System design topics](../../topics/system-design/)
- [Modern browser security](../2026-04-24-modern-browser-security/)
