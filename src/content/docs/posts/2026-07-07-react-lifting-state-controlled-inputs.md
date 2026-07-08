---
title: "Modern React 6: Lifting state and controlled inputs"
description: "Controlled inputs, lifted state, and the point where parent ownership becomes simpler."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-lifting-state-controlled-inputs/
series:
  slug: modern-react-development
  order: 6
---

This is part 6 of the [Modern React development series](../series/modern-react-development/).

State starts local, then moves when more than one component needs the same fact. Lifting state gives one parent ownership of that fact, and controlled inputs make form fields render from state instead of carrying separate browser-only memory.

## Concept

Lifting state means moving state to the closest common parent of the components that need it. A controlled input is a form control whose value comes from React state and reports edits through an event handler.

## Terms

- **Lifted state**: State owned by a parent so multiple children can read or change it.
- **Controlled input**: An input whose `value` or `checked` prop is set by React state.
- **Uncontrolled input**: An input whose current value is kept by the browser until code reads it.
- **Closest common parent**: The nearest component above all components that need a shared value.

## Mental model

Treat the parent as the notebook and children as pens and readers. The child can report a new value, but the parent keeps the canonical note and passes the current value back down.

## How it is used

Lift state for search fields that filter a sibling list, tabs that choose which panel is visible, forms that enable a submit button, and shared counters. Use controlled inputs when the current value affects rendering while the user types.

## How to use it

1. Find the components that need to read or update the same value.
2. Move the state to their closest common parent.
3. Pass the current value down as a prop.
4. Pass an event callback down so children can request updates.
5. Use `value` plus `onChange` for text inputs and `checked` plus `onChange` for checkboxes.

## Example: Shared search query

```tsx
import { useState } from "react";
import { ProductList } from "./ProductList";

type Product = { id: string; name: string };

export function ProductSearch({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const visible = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <SearchField value={query} onChange={setQuery} />
      <ProductList products={visible} />
    </>
  );
}

function SearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      aria-label="Search products"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-lifting-state-controlled-inputs-1-shared-search-query" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-lifting-state-controlled-inputs-1-shared-search-query.tsx" role="region" aria-label="Output view: Shared search query">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><input aria-label="Search products" value=""/><ul><li>Trail shoes</li><li>Rain shell</li></ul></div>
  </div>
</div>

The parent owns the query because both the input and the list depend on it.

## Example: Controlled checkbox

```tsx
import { useState, type ChangeEvent } from "react";

function InventoryFilter() {
  const [inStockOnly, setInStockOnly] = useState(true);

  return (
    <InStockOnly
      checked={inStockOnly}
      onChange={setInStockOnly}
    />
  );
}

function InStockOnly({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.checked);
  }

  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
      In stock only
    </label>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-lifting-state-controlled-inputs-2-controlled-checkbox" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-lifting-state-controlled-inputs-2-controlled-checkbox.tsx" role="region" aria-label="Output view: Controlled checkbox">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><label><input type="checkbox" checked=""/>In stock only</label></div>
  </div>
</div>

The parent owns the boolean. The child renders the checkbox from `checked` and reports the next boolean through `onChange`. Checkboxes use `checked`, not `value`, because the rendered state is binary.

## Details to watch

- **Typing responsiveness**: The state update for a text input should stay urgent. Do not wrap the input's own value update in a Transition.
- **Default values**: Use `defaultValue` or `defaultChecked` for uncontrolled inputs. Use `value` or `checked` for controlled ones.
- **Ownership**: Do not lift state higher than the components that need it. High state causes extra coupling.
- **Parsing**: Input values are strings. Convert to numbers, dates, or structured values at the boundary that needs that type.

## Series navigation

- Previous: [Part 5: State shape and derived values](../2026-07-07-react-state-shape-derived-values/)
- Next: [Part 7: Reducers for multi-step state](../2026-07-07-react-reducers-multi-step-state/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [Reacting to Input with State](https://react.dev/learn/reacting-to-input-with-state)
- [input](https://react.dev/reference/react-dom/components/input)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
