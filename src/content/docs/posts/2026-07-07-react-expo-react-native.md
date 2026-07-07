---
title: "Modern React 25: Expo and React Native"
description: "Expo and React Native for applying React patterns to native screens instead of the browser DOM."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-expo-react-native/
series:
  slug: modern-react-development
  order: 25
---

This is part 25 of the [Modern React development series](../series/modern-react-development/). The point of this entry is narrow: What changes when React targets native screens instead of the browser DOM?

React gets easier when each concept has a job. React stays, but the platform primitives change.

## Problem

Expo and React Native is the first place many React codebases pick up accidental complexity. The code still renders, but ownership gets blurry: state moves to the wrong component, side effects run in the wrong phase, or framework conventions get bypassed because a smaller example looked faster.

The goal is not to memorize a pattern. The goal is to recognize the pressure behind it. When that pressure appears in a real app, the React API should feel like a name for the thing you were already trying to do.

## Working example

```tsx
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View>
      <Text>Projects</Text>
      <Link href="/projects/new" asChild>
        <Pressable>
          <Text>Create project</Text>
        </Pressable>
      </Link>
    </View>
  );
}
```

## What to practice

- **Name the owner:** Identify which component, route, cache, or server boundary owns the data.
- **Keep render honest:** Render should describe UI for the current inputs. Work that talks to the outside world belongs in events, actions, loaders, effects, or server code.
- **Prefer small contracts:** Components and hooks are easier to reuse when their inputs are narrow and explicit.
- **Test the behavior:** The useful test is the one that fails when the user-visible behavior breaks.

## Wrong first move

Expecting DOM elements, CSS, and browser APIs to exist in native screens.

The fix is to step back and ask what kind of fact you are handling: render data, user intent, server truth, browser state, route state, or operational feedback. React has different tools because those facts have different lifetimes.

## Testing or debugging note

Separate shared state and business logic from platform-specific components.

Small React examples can pass while the real app fails because the real app has reorder, retry, loading, failure, permissions, long text, slow devices, or navigation. Add one of those pressures before calling the pattern done.

## Series navigation

- Previous: [Part 24: TanStack Router and TanStack Start](../2026-07-07-react-tanstack-router-start/)
- Next: [Part 26: Vite and client-only apps](../2026-07-07-react-vite-client-only-apps/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [docs.expo.dev](https://docs.expo.dev/)
- [reactnative.dev](https://reactnative.dev/docs/getting-started)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/)
