---
title: "Modern React 26: Vite and client-only apps"
description: "Vite for React apps that do not need framework routing, server rendering, or server mutations."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-vite-client-only-apps/
series:
  slug: modern-react-development
  order: 26
---

This is part 26 of the [Modern React development series](../series/modern-react-development/).

Vite is a fast build tool and development server for modern web projects. In React work, it is a good fit when the app is intentionally client-only or when a framework is not owning routes, rendering, and server data.

## Concept

A Vite React app has an HTML entry, a module-based development server, a production build command, and React mounted into a DOM root with `createRoot`. The app owns its routing, data fetching, and deployment choices.

## Terms

- **Vite**: A build tool and dev server for modern web projects.
- **HMR**: Hot Module Replacement, the development feature that updates modules without a full page reload.
- **ES modules**: The browser and JavaScript module system based on `import` and `export`.
- **Client-only app**: An app whose UI is rendered in the browser after JavaScript loads.

## Mental model

Think of Vite as the workshop, not the whole building. It gives React fast tools to develop and bundle code, but the app still chooses its own floor plan.

## How it is used

Use Vite for dashboards, internal tools, prototypes, static apps, embedded widgets, design system sandboxes, and client apps that get data from APIs without needing server rendering or Server Components.

## How to use it

1. Create a React TypeScript project from the Vite template.
2. Mount the app with `createRoot` in the client entry file.
3. Add routing, data fetching, testing, linting, and styling tools intentionally.
4. Use environment variables and production build settings from Vite docs.
5. Move to a framework when routing, SSR, SSG, or server mutations become product requirements.

## Example: Vite React entry

```tsx
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing root element");
}

createRoot(root).render(<App />);
```

A client-only Vite app directly owns the DOM root and React entry point.

## Example: Minimal Vite config

```tsx
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
```

The React plugin handles JSX and React development behavior. Other app concerns are added separately.

## Details to watch

- **Rendering**: A plain Vite React app is client-rendered unless you build a server rendering setup yourself.
- **Entry HTML**: Vite treats `index.html` as part of the module graph.
- **Tool ownership**: Routing, data cache, auth, testing, and deployment are app decisions in a Vite setup.
- **Browser support**: Vite targets modern development browsers and has production target configuration.

## Series navigation

- Previous: [Part 25: Expo and React Native](../2026-07-07-react-expo-react-native/)
- Next: [Part 27: Storybook and component workbenches](../2026-07-07-react-storybook-component-workbenches/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Vite guide](https://vite.dev/guide/)
- [Build a React App from Scratch](https://react.dev/learn/build-a-react-app-from-scratch)
- [createRoot](https://react.dev/reference/react-dom/client/createRoot)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
