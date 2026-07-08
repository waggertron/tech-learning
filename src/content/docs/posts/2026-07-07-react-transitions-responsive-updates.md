---
title: "Modern React 13: Transitions for responsive updates"
description: "Transitions for keeping urgent input responsive while expensive UI work catches up."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-transitions-responsive-updates/
series:
  slug: modern-react-development
  order: 13
---

This is part 13 of the [Modern React development series](../series/modern-react-development/).

Some updates are urgent because the user is directly manipulating a control. Other updates can happen in the background because they redraw a large part of the screen. Transitions let React treat those categories differently.

## Concept

`useTransition` marks state updates as non-urgent. React can keep urgent interactions responsive, show pending feedback, and interrupt background rendering work when newer urgent input arrives.

## Terms

- **Transition**: A non-urgent update that React can render in the background.
- **Urgent update**: An update that should reflect direct input immediately, such as typing into a controlled field.
- **Pending state**: A boolean that tells the component whether a Transition is still in progress.
- **Action**: React's name for the function passed to `startTransition`.

## Mental model

Think of urgent updates as the steering wheel and Transition updates as the map redraw. The steering wheel responds immediately. The map can catch up without freezing the driver.

## How it is used

Use Transitions for tab switches with heavy content, route navigation, filtering large visualizations after input is stored, and Actions that should expose pending state without blocking the rest of the UI.

## How to use it

1. Keep controlled input state outside the Transition.
2. Wrap the expensive or non-urgent state update in `startTransition`.
3. Use `isPending` for subtle feedback while background rendering finishes.
4. Combine Transitions with Suspense boundaries to avoid jarring fallback replacement.
5. For async Actions, wrap state updates after `await` in another `startTransition` when React requires it.

## Example: Filter after urgent typing

```tsx
import { useState, useTransition } from "react";
import { ResultGrid } from "./ResultGrid";

export function SearchableGrid({ items }: { items: string[] }) {
  const [query, setQuery] = useState("");
  const [visibleQuery, setVisibleQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(nextQuery: string) {
    setQuery(nextQuery);
    startTransition(() => {
      setVisibleQuery(nextQuery);
    });
  }

  const visible = items.filter((item) => item.includes(visibleQuery));

  return (
    <>
      <input value={query} onChange={(event) => handleChange(event.target.value)} />
      {isPending && <p>Updating results...</p>}
      <ResultGrid items={visible} />
    </>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-transitions-responsive-updates-1-filter-after-urgent-typing" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-transitions-responsive-updates-1-filter-after-urgent-typing.tsx" role="region" aria-label="Output view: Filter after urgent typing">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><input value=""/><ul><li>Trail shoes</li><li>Rain shell</li><li>Camp mug</li></ul></div>
  </div>
</div>

The input remains urgent. The heavier result update is allowed to lag behind briefly.

## Example: Tab switch

```tsx
import { useState, useTransition } from "react";
import { TabButtons, TabPanel } from "./ProjectTabs";

type Tab = "overview" | "activity" | "settings";

export function ProjectTabs() {
  const [tab, setTab] = useState<Tab>("overview");
  const [isPending, startTransition] = useTransition();

  function selectTab(nextTab: Tab) {
    startTransition(() => setTab(nextTab));
  }

  return (
    <>
      <TabButtons selected={tab} onSelect={selectTab} />
      {isPending && <span>Loading tab...</span>}
      <TabPanel tab={tab} />
    </>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-transitions-responsive-updates-2-tab-switch" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-transitions-responsive-updates-2-tab-switch.tsx" role="region" aria-label="Output view: Tab switch">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><nav aria-label="Project tabs"><button aria-pressed="true">overview</button><button aria-pressed="false">activity</button><button aria-pressed="false">settings</button></nav><section>Current tab: overview</section></div>
  </div>
</div>

A tab change can be non-urgent when the panel is expensive or can suspend.

## Details to watch

- **Controlled inputs**: Do not transition the update that controls the text the user is typing.
- **Immediate call**: `startTransition` calls the passed function immediately and marks synchronous updates inside it.
- **Async gap**: State updates after `await` may need a nested `startTransition` with current React behavior.
- **Ordering**: Transitions can be interrupted. Design UI so newer intent wins clearly.

## Series navigation

- Previous: [Part 12: Data loading with Suspense boundaries](../2026-07-07-react-suspense-data-loading-boundaries/)
- Next: [Part 14: Forms with Actions](../2026-07-07-react-forms-with-actions/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [useTransition](https://react.dev/reference/react/useTransition)
- [startTransition](https://react.dev/reference/react/startTransition)
- [useDeferredValue](https://react.dev/reference/react/useDeferredValue)
- [Suspense](https://react.dev/reference/react/Suspense)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
