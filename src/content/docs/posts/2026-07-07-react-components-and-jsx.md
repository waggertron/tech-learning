---
title: "Modern React 1: Components and JSX"
description: "React components, JSX, and the render output contract that keeps UI code readable."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-components-and-jsx/
series:
  slug: modern-react-development
  order: 1
---

This is part 1 of the [Modern React development series](../series/modern-react-development/).

React starts with a small promise: describe the user interface as components, then let React keep the browser output in sync with that description. JSX is the notation most React projects use for that description, so the markup, data reads, and component calls live in one JavaScript expression.

## Concept

A React component is a JavaScript function that returns a React node, usually written with JSX. JSX looks like HTML, but it is JavaScript syntax that can call components, pass props, read variables in curly braces, and produce a tree of elements for React to render.

## Terms

- **Component**: A capitalized JavaScript function that returns UI.
- **JSX**: A JavaScript syntax extension for writing React element trees.
- **React node**: Anything React can render, including JSX elements, strings, numbers, fragments, null, and arrays of nodes.
- **Fragment**: An empty wrapper written as `<>...</>` when a component needs to return adjacent nodes without adding a DOM element.

## Mental model

Treat a component like a pure recipe card. Given the same props, it writes the same UI recipe. React reads that recipe, compares it with the previous one, and updates the page where the recipe changed.

## How it is used

Components are used for everything from a single button to a whole route. JSX lets a component keep the visible structure next to the JavaScript values that fill it in, such as a product name, an image URL, or a conditional badge.

## How to use it

1. Name components with capital letters so React can distinguish them from built-in HTML tags.
2. Return one React node from each component. Use a fragment when there is no semantic wrapper.
3. Read JavaScript values inside JSX with curly braces.
4. Keep render work focused on describing UI. Put user intent in event handlers and outside systems in Effects or framework data APIs.

## Example: Render data with JSX

```tsx
type ProductCardProps = {
  name: string;
  priceCents: number;
  inStock: boolean;
};

export function ProductCard({ name, priceCents, inStock }: ProductCardProps) {
  const price = (priceCents / 100).toFixed(2);

  return (
    <article className="product-card">
      <h2>{name}</h2>
      <p>$ {price}</p>
      {inStock ? <span>In stock</span> : <span>Back soon</span>}
    </article>
  );
}
```

The component reads plain values, calculates display text, and returns JSX. The conditional badge is still normal JavaScript expressed inside the returned tree.

## Example: Compose components

```tsx
type Product = {
  id: string;
  name: string;
  priceCents: number;
  inStock: boolean;
};

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section aria-labelledby="featured-products">
      <h2 id="featured-products">Featured products</h2>
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
```

The parent owns the list shape and calls `ProductCard` for each item. Composition keeps the card focused on one product and the grid focused on layout.

## Details to watch

- **Capitalization**: Lowercase JSX names are treated as built-in tags like `div` and `button`. Capitalized names are treated as React components.
- **Single return value**: A component returns one React node. A fragment gives adjacent nodes one wrapper without changing the DOM.
- **Curly braces**: Use braces for JavaScript expressions, not statements. Calculate larger values before the `return`.
- **Purity**: Render should describe output for current inputs. Code that changes the world belongs elsewhere.

## Series navigation

- Previous: none. Start here.
- Next: [Part 2: Props, children, and component boundaries](../2026-07-07-react-props-children-component-boundaries/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [React Quick Start](https://react.dev/learn)
- [Your First Component](https://react.dev/learn/your-first-component)
- [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)
- [JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
