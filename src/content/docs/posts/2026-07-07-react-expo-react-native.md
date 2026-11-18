---
title: "React Native: rendering primitives and shared state"
description: "Compare native rendering primitives with browser elements and identify which React state logic can be shared."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-expo-react-native/
---

This optional branch accompanies the [Modern React development series](../series/modern-react-development/). It compares rendering and shared state rather than walking through an Expo project or device integration.

React Native applies the React component model to native apps. Expo provides the project tooling, SDK modules, development workflow, and deployment services that make that native React path practical.

## Concept

React Native renders native platform views instead of browser DOM elements. Expo is a React framework and toolchain for building Android, iOS, and web apps from one JavaScript or TypeScript project.

## Terms

- **React Native**: The React renderer for native mobile interfaces.
- **Expo**: A framework and platform around React Native for development, native APIs, builds, updates, and deployment.
- **SDK**: Software development kit, a packaged set of APIs and tools for a platform.
- **Native view**: A platform UI element such as a text label, image, scroll view, or touch target.
- **DOM**: Document Object Model, the browser's object representation of a web page.

## Mental model

Think of React Native as React speaking a different host language. Components still describe UI, props still pass data, and state still drives rendering, but the output is native views instead of DOM nodes.

## How it is used

Use this comparison when deciding whether component and Hook logic transfers to a native interface. React Native primitives are the demonstrated subject. Expo supplies a separate project and native-capability workflow that these two examples do not exercise.

## Reading the comparison

Keep state and domain calculations independent of the renderer when they have the same contract. Replace browser elements with native primitives deliberately: a `Text` is not a styled `div`, and device gestures, layout, permissions, and accessibility need native validation.

The browser output below uses a web adapter for illustration. It does not prove an iOS or Android target, device API, Expo build, notification, or app-store release. Use the official Expo tutorial for a separate runnable project workflow.

## Example: Native screen component

```tsx
import { Pressable, Text, View } from "react-native";

export function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <View>
      <Text>Daily checklist</Text>
      <Pressable onPress={onStart}>
        <Text>Start</Text>
      </Pressable>
    </View>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-expo-react-native-1-native-screen-component" data-render-mode="react-server" data-interaction-mode="runner" data-runner-entry="2026-07-07-react-expo-react-native-1-native-screen-component" role="region" aria-label="Output view: Native screen component">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><div class="css-view-g5y9jx"><div dir="auto" class="css-text-146c3p1">Daily checklist</div><div tabindex="0" class="css-view-g5y9jx r-cursor-1loqt21 r-touchAction-1otgn73"><div dir="auto" class="css-text-146c3p1">Start</div></div></div></div>
  </div>
</div>

`View`, `Text`, and `Pressable` are native primitives. The React data flow still looks familiar.

## Example: Shared Hook, platform UI

```tsx
import { useState } from "react";
import { Pressable, Text } from "react-native";

function useToggle(initialValue = false) {
  const [on, setOn] = useState(initialValue);
  return { on, toggle: () => setOn((value) => !value) };
}

export function FavoriteButton() {
  const favorite = useToggle();

  return (
    <Pressable onPress={favorite.toggle}>
      <Text>{favorite.on ? "Saved" : "Save"}</Text>
    </Pressable>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-expo-react-native-2-shared-hook-platform-ui" data-render-mode="react-server" data-interaction-mode="runner" data-runner-entry="2026-07-07-react-expo-react-native-2-shared-hook-platform-ui" role="region" aria-label="Output view: Shared Hook, platform UI">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><div tabindex="0" class="css-view-g5y9jx r-cursor-1loqt21 r-touchAction-1otgn73"><div dir="auto" class="css-text-146c3p1">Save</div></div></div>
  </div>
</div>

The Hook is regular React logic. The rendered controls are React Native primitives.

## Details to watch

- **No DOM**: Browser APIs such as `document.querySelector` do not exist in native views.
- **Styling**: React Native styling uses JavaScript objects and platform layout rules rather than browser CSS.
- **Permissions**: Device APIs often need permission flows and platform-specific behavior.
- **Web support**: Expo can target web, but mobile-first UI still needs browser review when shipped to web.

## Return to the core path

- [Framework choice and project setup](../2026-07-07-react-framework-choice-project-setup/)
- [Modern React development](../series/modern-react-development/)

## References

- [Expo documentation](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [Creating a React App](https://react.dev/learn/creating-a-react-app)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
