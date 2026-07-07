---
title: "Modern React 36: Accessibility as component API design"
description: "Accessibility as component API design, not a cleanup pass after markup exists."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-accessibility-component-api-design/
series:
  slug: modern-react-development
  order: 36
---

This is part 36 of the [Modern React development series](../series/modern-react-development/).

Accessible React is mostly accessible HTML with good component contracts. A component API should make the accessible path the natural path by asking for labels, relationships, state, and semantics up front.

## Concept

Accessibility is the practice of making UI usable by people with different input methods, assistive technologies, vision, hearing, motion, and cognitive needs. In React components, accessibility often shows up as semantic elements, labels, keyboard behavior, focus management, and ARIA when native HTML is not enough.

## Terms

- **ARIA**: Accessible Rich Internet Applications, attributes that add accessibility semantics when native HTML cannot express them.
- **Accessible name**: The name assistive technologies use for a control, often from text, `aria-label`, or a label element.
- **Focus management**: Controlling where keyboard focus moves after an interaction.
- **Semantic HTML**: Using elements such as `button`, `nav`, `label`, and `section` for their built-in meaning.

## Mental model

Think of accessibility as part of the component's public API. If a caller can render an unlabeled button or disconnected field, the component API allowed an incomplete state.

## How it is used

Use this model for buttons, icon buttons, forms, dialogs, menus, tabs, alerts, navigation, table components, and any component that wraps native controls.

## How to use it

1. Start with the native element that matches the interaction.
2. Require labels or label IDs in the component API when visible text is not enough.
3. Expose state through native attributes or ARIA attributes.
4. Preserve keyboard behavior and focus order.
5. Test with role and label queries so accessibility is exercised during component tests.

## Example: Icon button requires a label

```tsx
type IconButtonProps = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export function IconButton({ label, icon, onClick }: IconButtonProps) {
  return (
    <button type="button" aria-label={label} onClick={onClick}>
      {icon}
    </button>
  );
}
```

An icon alone usually has no accessible name. Requiring `label` makes the contract complete.

## Example: Field component wires label and error

```tsx
import { useId } from "react";

type TextFieldProps = {
  label: string;
  error?: string;
};

export function TextField({ label, error }: TextFieldProps) {
  const inputId = useId();
  const errorId = useId();

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && <p id={errorId}>{error}</p>}
    </div>
  );
}
```

The field component owns the ID wiring so callers cannot forget the label relationship.

## Details to watch

- **Native first**: A real `button` carries keyboard and role behavior that a clickable `div` does not.
- **ARIA role**: ARIA augments semantics. It does not add missing interaction behavior by itself.
- **Generated IDs**: `useId` helps connect labels and descriptions without hard-coded duplicate IDs.
- **Testing**: Queries by role and label catch many component API accessibility gaps.

## Series navigation

- Previous: [Part 35: Styling, design tokens, and variants](../2026-07-07-react-styling-design-tokens-variants/)
- Next: [Part 37: Validation at form and API boundaries](../2026-07-07-react-validation-form-api-boundaries/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [useId](https://react.dev/reference/react/useId)
- [Common DOM components](https://react.dev/reference/react-dom/components/common)
- [React Testing Library introduction](https://testing-library.com/docs/react-testing-library/intro/)
- [MDN ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
