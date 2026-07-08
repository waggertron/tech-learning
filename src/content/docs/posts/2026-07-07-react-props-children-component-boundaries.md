---
title: "Modern React 2: Props, children, and component boundaries"
description: "Props, children, and the boundary between reusable components and application-specific decisions."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-props-children-component-boundaries/
series:
  slug: modern-react-development
  order: 2
---

This is part 2 of the [Modern React development series](../series/modern-react-development/).

Props are how a parent gives a component the data and callbacks it needs. `children` is the prop that lets a component wrap other UI, which makes layout shells, panels, modals, and page sections feel natural in React.

## Concept

A component boundary is the line between what a component decides for itself and what it receives from the outside. Props make that line explicit. A reusable component should own its markup contract and styling variants, while the caller owns business decisions and the content passed into it.

## Terms

- **Prop**: A named input passed from a parent component to a child component.
- **Children**: The nested React nodes placed between an opening and closing component tag.
- **Component boundary**: The public contract a component exposes through props, children, events, and rendered semantics.
- **One-way data flow**: The React model where data moves from parent to child through props.

## Mental model

Think of props as labeled sockets on a component. The component decides what sockets exist and how they affect the UI. The caller plugs in data, actions, and children without reaching inside the component.

## How it is used

Props carry labels, IDs, item data, event callbacks, selected values, and display options. `children` carries nested UI when the child component provides the frame but should not know the exact content ahead of time.

## How to use it

1. Start with the smallest props that describe what the component needs to render.
2. Use `children` when the caller should supply arbitrary nested UI.
3. Keep app-specific fetching, routing, permission, and mutation logic outside reusable presentational components.
4. Name callback props by the event or intent they report, such as `onDismiss` or `onSelectPlan`.

## Example: Panel with children

```tsx
import type { ReactNode } from "react";

type PanelProps = {
  title: string;
  children: ReactNode;
};

export function Panel({ title, children }: PanelProps) {
  return (
    <section className="panel" aria-labelledby="panel-title">
      <h2 id="panel-title">{title}</h2>
      <div className="panel-body">{children}</div>
    </section>
  );
}

export function BillingPanel() {
  return (
    <Panel title="Billing">
      <p>Your card is current.</p>
      <button type="button">Update payment method</button>
    </Panel>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-props-children-component-boundaries-1-panel-with-children" role="region" aria-label="Output view: Panel with children">
  <div class="react-example-output__header">Output view</div>
  <div class="react-example-output__body">
    <p><strong>Panel with children.</strong> <code>Panel</code> renders <code>&lt;section&gt;</code>, <code>&lt;h2&gt;</code>, <code>&lt;div&gt;</code>, <code>&lt;p&gt;</code>, and <code>&lt;button&gt;</code> markup. Visible text can include <code>Your card is current.</code> and <code>Update payment method</code>.</p>
  </div>
</div>

The panel owns the section structure. The billing screen owns the actual text and action inside that structure.

## Example: Reusable row with explicit props

```tsx
import type { ReactNode } from "react";

type SettingsRowProps = {
  label: string;
  description: string;
  action: ReactNode;
};

export function SettingsRow({ label, description, action }: SettingsRowProps) {
  return (
    <div className="settings-row">
      <div>
        <h3>{label}</h3>
        <p>{description}</p>
      </div>
      <div>{action}</div>
    </div>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-props-children-component-boundaries-2-reusable-row-with-explicit-props" role="region" aria-label="Output view: Reusable row with explicit props">
  <div class="react-example-output__header">Output view</div>
  <div class="react-example-output__body">
    <p><strong>Reusable row with explicit props.</strong> <code>SettingsRow</code> renders <code>&lt;div&gt;</code>, <code>&lt;h3&gt;</code>, and <code>&lt;p&gt;</code> markup.</p>
  </div>
</div>

The row API names the stable parts of the design. The caller can pass a button, switch, link, or status badge as the action.

## Details to watch

- **Prop size**: A long prop list can be fine when the contract is clear. A vague `config` object often hides the real API.
- **Children type**: `React.ReactNode` accepts strings, numbers, JSX, fragments, arrays, null, and false. Use a narrower type only when a component truly requires one element.
- **Callbacks**: Callback props report that something happened. The parent decides what the app does next.
- **Boundary drift**: A reusable component becomes harder to reuse when it imports route state, auth state, or data fetching directly.

## Series navigation

- Previous: [Part 1: Components and JSX](../2026-07-07-react-components-and-jsx/)
- Next: [Part 3: Rendering lists and stable keys](../2026-07-07-react-rendering-lists-stable-keys/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [Using TypeScript with React](https://react.dev/learn/typescript)
- [React Children legacy API](https://react.dev/reference/react/Children)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
