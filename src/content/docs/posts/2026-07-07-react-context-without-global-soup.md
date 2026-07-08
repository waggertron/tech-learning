---
title: "Modern React 8: Context without global soup"
description: "Context as dependency injection for React trees, not a dumping ground for every shared value."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-context-without-global-soup/
series:
  slug: modern-react-development
  order: 8
---

This is part 8 of the [Modern React development series](../series/modern-react-development/).

Context lets a component provide a value to descendants without passing the same prop through every layer. It is most useful for tree-wide dependencies with clear ownership, such as theme, locale, auth session snapshots, and feature flag readers.

## Concept

React context is a provider and consumer mechanism. A provider places a value into a subtree. Descendant components read the nearest matching provider value with `useContext` or React's `use` API.

## Terms

- **Context object**: The value returned by `createContext`.
- **Provider**: The component position that supplies a context value to descendants.
- **Consumer**: A component that reads a context value.
- **Dependency injection**: Supplying a dependency from outside a component instead of importing a singleton directly.

## Mental model

Think of context as air inside one room of the component tree. Descendants in that room can breathe it, but rooms outside it do not see the value.

## How it is used

Use context when many descendants need the same stable dependency or state owner. Common examples are theme mode, locale, current account, analytics adapter, and a reducer-backed store for one feature area.

## How to use it

1. Create a context for one kind of value.
2. Place a provider as low as the shared value allows.
3. Expose a small custom hook that reads the context and reports missing providers clearly.
4. Memoize object values when provider churn causes unnecessary child renders.
5. Keep rapidly changing field state local unless the whole subtree truly depends on it.

## Example: Theme provider with a reader hook

```tsx
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({
  theme,
  children,
}: {
  theme: Theme;
  children: ReactNode;
}) {
  return <ThemeContext value={theme}>{children}</ThemeContext>;
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (theme === null) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return theme;
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-context-without-global-soup-1-theme-provider-with-a-reader-hook" data-render-mode="react-server" role="region" aria-label="Output view: Theme provider with a reader hook">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><p>Theme-aware content</p></div>
  </div>
</div>

The custom hook turns the nullable context into a clear contract for the rest of the app.

## Example: Feature-level provider

```tsx
import { createContext } from "react";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectTaskList } from "./ProjectTaskList";

type ProjectContextValue = {
  projectId: string;
  canEdit: boolean;
};

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectPage({ projectId }: { projectId: string }) {
  const value = { projectId, canEdit: true };

  return (
    <ProjectContext value={value}>
      <ProjectHeader />
      <ProjectTaskList />
    </ProjectContext>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-context-without-global-soup-2-feature-level-provider" data-render-mode="react-server" role="region" aria-label="Output view: Feature-level provider">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><header><h2>Launch checklist</h2><p>Editors can update tasks.</p></header><ul><li>Confirm launch copy</li><li>Review analytics events</li></ul></div>
  </div>
</div>

This provider is scoped to a project page, so it does not become a whole-app storage bucket.

## Details to watch

- **Scope**: Put providers near the feature that owns the value. Whole-app providers are for whole-app dependencies.
- **Update frequency**: Every consumer can re-render when the provider value changes.
- **Default value**: A real default is fine for theme-like values. Use `null` plus a custom hook for required providers.
- **Server boundaries**: Frameworks with Server Components and Client Components may limit where stateful providers can live.

## Series navigation

- Previous: [Part 7: Reducers for multi-step state](../2026-07-07-react-reducers-multi-step-state/)
- Next: [Part 9: Refs and DOM escape hatches](../2026-07-07-react-refs-dom-escape-hatches/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [useContext](https://react.dev/reference/react/useContext)
- [createContext](https://react.dev/reference/react/createContext)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
