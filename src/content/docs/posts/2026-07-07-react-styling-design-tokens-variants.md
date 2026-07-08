---
title: "Modern React 35: Styling, design tokens, and variants"
description: "Styling React components with tokens, variants, and predictable class contracts."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-styling-design-tokens-variants/
series:
  slug: modern-react-development
  order: 35
---

This is part 35 of the [Modern React development series](../series/modern-react-development/).

React does not require one styling system. It does require clear component contracts. Design tokens and variants help component styling stay predictable while letting callers choose supported visual states.

## Concept

A design token is a named value for a design decision, such as color, spacing, radius, or font size. A variant is a supported component mode, such as primary, secondary, danger, small, or full width.

## Terms

- **Design token**: A named design value used consistently across components.
- **Variant**: A named visual or behavioral mode supported by a component.
- **Class contract**: The class names a component applies to connect markup to CSS.
- **Inline style**: A JavaScript object passed to the `style` prop for dynamic CSS values.

## Mental model

Think of tokens as the pantry and variants as menu items. Components should cook from named ingredients and offer supported dishes, not ask every caller to season from scratch.

## How it is used

Use tokens for colors, spacing, typography, elevation, borders, and motion. Use variants for buttons, badges, alerts, cards, form fields, and reusable components where callers need controlled styling choices.

## How to use it

1. Define tokens in CSS variables, a theme object, or the project's styling system.
2. Give components semantic variant props instead of raw style props for common modes.
3. Map variants to classes or token values inside the component.
4. Use inline styles for truly dynamic values, such as a measured width or user-selected color.
5. Keep semantic HTML and accessibility behavior independent of visual variants.

## Example: Button variants

```tsx
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  onClick?: () => void;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: "button button-primary",
  secondary: "button button-secondary",
  danger: "button button-danger",
};

export function Button({
  variant = "primary",
  children,
  onClick,
}: ButtonProps) {
  return (
    <button className={variantClass[variant]} onClick={onClick}>
      {children}
    </button>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-styling-design-tokens-variants-1-button-variants" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-styling-design-tokens-variants-1-button-variants.tsx" role="region" aria-label="Output view: Button variants">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><button class="button button-danger">Delete project</button></div>
  </div>
</div>

The caller chooses a supported mode. The component owns the class mapping.

## Example: CSS tokens

```css
:root {
  --color-action: #1463ff;
  --color-danger: #b42318;
  --space-2: 0.5rem;
  --radius-2: 0.375rem;
}

.button {
  border-radius: var(--radius-2);
  padding: var(--space-2);
}

.button-primary {
  background: var(--color-action);
  color: white;
}
```

Tokens keep repeated design values named in one place, which makes component classes easier to maintain.

## Details to watch

- **Variant limits**: A variant prop should describe supported design choices, not expose every CSS property.
- **Class composition**: Class helpers are useful when multiple boolean and enum variants combine.
- **Inline styles**: React's `style` prop uses camelCased CSS property names and JavaScript values.
- **Design drift**: Unbounded styling props can make a design system impossible to keep consistent.

## Series navigation

- Previous: [Part 34: Code splitting and lazy loading](../2026-07-07-react-code-splitting-lazy-loading/)
- Next: [Part 36: Accessibility as component API design](../2026-07-07-react-accessibility-component-api-design/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [React Quick Start, adding styles](https://react.dev/learn)
- [Common DOM components](https://react.dev/reference/react-dom/components/common)
- [Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
