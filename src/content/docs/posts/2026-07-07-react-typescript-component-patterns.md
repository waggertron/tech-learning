---
title: "Modern React 18: TypeScript patterns for React"
description: "TypeScript component APIs that make invalid prop combinations harder to express."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-typescript-component-patterns/
series:
  slug: modern-react-development
  order: 18
---

This is part 18 of the [Modern React development series](../series/modern-react-development/).

TypeScript makes React component contracts visible before the component runs. Good types describe the props a component accepts, the events it emits, and the combinations that make sense.

## Concept

React with TypeScript uses `.tsx` files for JSX and TypeScript types for props, state, refs, events, reducer actions, and children. The goal is not to type every implementation detail. The goal is to make invalid component use harder to write.

## Terms

- **TSX**: A TypeScript file extension for files that contain JSX.
- **Prop type**: The TypeScript shape of a component's public inputs.
- **Discriminated union**: A union of object types distinguished by a shared literal field.
- **Generic component**: A component whose props can be typed over a caller-provided data shape.

## Mental model

Think of component types as a doorframe. The frame does not describe every room inside, but it does control what can pass through the doorway.

## How it is used

Use TypeScript for design system components, forms, route params, API data boundaries, reducer actions, event handlers, refs, and props where certain combinations are required or forbidden.

## How to use it

1. Put JSX in `.tsx` files.
2. Define named prop types for reusable components.
3. Use unions when a component has modes with different required props.
4. Type event handlers at the boundary where you read event fields.
5. Use `React.ReactNode` for broad children and narrower types only when needed.

## Example: Discriminated button props

```tsx
type ButtonProps =
  | {
      kind: "button";
      onClick: () => void;
      children: React.ReactNode;
    }
  | {
      kind: "link";
      href: string;
      children: React.ReactNode;
    };

export function ActionButton(props: ButtonProps) {
  if (props.kind === "link") {
    return <a href={props.href}>{props.children}</a>;
  }

  return <button onClick={props.onClick}>{props.children}</button>;
}
```

The `kind` field controls which props are available. A caller cannot pass `href` to the button mode by accident.

## Example: Generic list renderer

```tsx
type ListProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
};

export function List<T>({ items, getKey, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

The caller gets item-specific type checking while the list component stays reusable.

## Details to watch

- **Children**: `React.ReactNode` is broad and fits most wrapper components.
- **Events**: Let editor inference help, then name event types when handlers move out of JSX.
- **Data boundaries**: Types do not validate runtime data by themselves. Parse external input at API and form boundaries.
- **Over-general types**: A generic component is useful when it preserves caller information. It is noise when no caller-specific type flows through.

## Series navigation

- Previous: [Part 17: Server Actions and mutation boundaries](../2026-07-07-react-server-actions-mutation-boundaries/)
- Next: [Part 19: Testing components by behavior](../2026-07-07-react-testing-components-by-behavior/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Using TypeScript](https://react.dev/learn/typescript)
- [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [TypeScript JSX documentation](https://www.typescriptlang.org/docs/handbook/jsx.html)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
