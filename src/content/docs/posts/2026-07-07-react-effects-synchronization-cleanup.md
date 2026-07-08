---
title: "Modern React 10: Effects, synchronization, and cleanup"
description: "Effects as synchronization with external systems, plus the cleanup discipline that prevents leaks."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-effects-synchronization-cleanup/
series:
  slug: modern-react-development
  order: 10
---

This is part 10 of the [Modern React development series](../series/modern-react-development/).

Effects connect React to systems outside the render tree. They are not a general place for all after-render logic. Their job is synchronization: start something external with the current props and state, then stop or update it when those values change.

## Concept

`useEffect` runs after React commits UI to the screen. An Effect can subscribe to a browser API, connect to a service, start a timer, or coordinate with a non-React widget. Its cleanup function stops the previous synchronization.

## Terms

- **Effect**: A Hook callback used to synchronize with an external system after render commit.
- **Cleanup**: A function returned from an Effect to stop the previous synchronization.
- **Dependency array**: The list of reactive values that tell React when the Effect needs to resynchronize.
- **Reactive value**: A prop, state value, or variable declared inside the component that can differ between renders.

## Mental model

Think of each Effect as a plug. The Effect body plugs the component into an external system. The cleanup unplugs it before React plugs in the next version.

## How it is used

Use Effects for subscriptions, browser events, timers, media APIs, analytics page visibility events, and external widgets. Use render calculations for derived values and event handlers for user-triggered work.

## How to use it

1. Name the external system the Effect synchronizes with.
2. Read every reactive value the synchronization needs.
3. Include those reactive values in the dependency array.
4. Return cleanup when the external system needs to unsubscribe, disconnect, cancel, or clear.
5. Split unrelated synchronization processes into separate Effects.

## Example: Browser online status

```tsx
import { useEffect, useState } from "react";

export function OnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);

    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return <p>{online ? "Online" : "Offline"}</p>;
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-effects-synchronization-cleanup-1-browser-online-status" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-effects-synchronization-cleanup-1-browser-online-status.tsx" role="region" aria-label="Output view: Browser online status">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><p>Online</p></div>
  </div>
</div>

The component subscribes to browser events after commit and removes the listeners on cleanup.

## Example: Chat room subscription

```tsx
import { useEffect } from "react";
import { createChatConnection } from "./chat";

export function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    const connection = createChatConnection(roomId);
    connection.connect();

    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Room {roomId}</h1>;
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-effects-synchronization-cleanup-2-chat-room-subscription" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-effects-synchronization-cleanup-2-chat-room-subscription.tsx" role="region" aria-label="Output view: Chat room subscription">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><h1>Room general</h1></div>
  </div>
</div>

When `roomId` changes, React cleans up the old connection and starts a new one for the next room.

## Details to watch

- **External system**: If there is no external system, the code often belongs in render or an event handler.
- **Dependencies**: The dependency list describes values used by the synchronization, not values you would prefer to ignore.
- **Cleanup**: Subscriptions, intervals, sockets, observers, and in-flight manual work usually need cleanup.
- **Strict Mode**: Development Strict Mode may run setup and cleanup more than once to surface unsafe Effects.

## Series navigation

- Previous: [Part 9: Refs and DOM escape hatches](../2026-07-07-react-refs-dom-escape-hatches/)
- Next: [Part 11: Custom hooks as reuse boundaries](../2026-07-07-react-custom-hooks-reuse-boundaries/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [useEffect](https://react.dev/reference/react/useEffect)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
