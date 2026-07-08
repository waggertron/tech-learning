---
title: "Modern React 9: Refs and DOM escape hatches"
description: "Refs for DOM access, focus, measurements, and mutable handles that should not drive rendering."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-refs-dom-escape-hatches/
series:
  slug: modern-react-development
  order: 9
---

This is part 9 of the [Modern React development series](../series/modern-react-development/).

Refs hold mutable values that React does not use for rendering. They are the right tool for focus, measurement, imperative browser APIs, timers, and values that need to survive renders without causing a new render.

## Concept

`useRef` returns a stable object with a mutable `current` property. Updating `current` does not re-render the component. When attached to JSX with `ref`, React fills `current` with the corresponding DOM node after commit.

## Terms

- **Ref**: A stable object whose `current` property can hold a mutable value.
- **DOM**: Document Object Model, the browser's object representation of the rendered page.
- **Escape hatch**: A React API for cases where declarative rendering is not the whole job.
- **Commit**: The phase where React applies rendered changes to the host environment, such as the browser DOM.

## Mental model

Think of a ref as a side pocket. It can hold a DOM handle or mutable note, but React does not look in that pocket to decide what the UI should show.

## How it is used

Use refs to focus inputs, scroll nodes into view, measure element sizes, store timer IDs, remember previous values for Effects, and integrate with imperative browser or third-party APIs.

## How to use it

1. Create a ref with `useRef(initialValue)`.
2. Attach it to a DOM element with the `ref` prop when you need a DOM handle.
3. Read or write `ref.current` inside event handlers or Effects.
4. Use state instead when changing the value should update the screen.

## Example: Focus an input

```tsx
import { useRef } from "react";

export function FocusNameButton() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input ref={inputRef} aria-label="Name" />
      <button type="button" onClick={() => inputRef.current?.focus()}>
        Focus name
      </button>
    </>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-refs-dom-escape-hatches-1-focus-an-input" role="region" aria-label="Output view: Focus an input">
  <div class="react-example-output__header">Output view</div>
  <div class="react-example-output__body">
    <p><strong>Focus an input.</strong> <code>FocusNameButton</code> renders <code>&lt;input&gt;</code> and <code>&lt;button&gt;</code> markup.</p>
  </div>
</div>

The click handler uses a DOM method. The current focus target is not render state, so a ref is the right container.

## Example: Store a timer ID

```tsx
import { useRef } from "react";

export function SaveStatus() {
  const timeoutRef = useRef<number | null>(null);

  function scheduleSavedMessage() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
    }, 1200);
  }

  return <button onClick={scheduleSavedMessage}>Save draft</button>;
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-refs-dom-escape-hatches-2-store-a-timer-id" role="region" aria-label="Output view: Store a timer ID">
  <div class="react-example-output__header">Output view</div>
  <div class="react-example-output__body">
    <p><strong>Store a timer ID.</strong> <code>SaveStatus</code> renders <code>&lt;button&gt;</code> markup. Visible text can include <code>Save draft</code>.</p>
  </div>
</div>

The timer ID must survive renders, but showing the timer ID is not part of the UI.

## Details to watch

- **Render reads**: Do not use refs as hidden render state. If the UI depends on a value, use state.
- **Timing**: DOM refs are set after React commits the element.
- **Nullability**: DOM refs can be `null` before mount and after unmount.
- **Imperative APIs**: Keep imperative calls contained in handlers, Effects, or small adapter components.

## Series navigation

- Previous: [Part 8: Context without global soup](../2026-07-07-react-context-without-global-soup/)
- Next: [Part 10: Effects, synchronization, and cleanup](../2026-07-07-react-effects-synchronization-cleanup/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs)
- [Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs)
- [useRef](https://react.dev/reference/react/useRef)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
