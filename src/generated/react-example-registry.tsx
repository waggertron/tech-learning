export const reactExampleRegistry = [
  {
    "id": "2026-07-07-react-accessibility-component-api-design-2-field-component-wires-label-and-error",
    "title": "Field component wires label and error",
    "fileName": "2026-07-07-react-accessibility-component-api-design.md",
    "modulePath": "./react-example-modules/2026-07-07-react-accessibility-component-api-design-2-field-component-wires-label-and-error.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "TextField",
    "needsQueryClientProvider": false,
    "summary": "Field component wires label and error. This example mounts a live React component in the browser.",
    "props": {
      "label": "Email",
      "error": "Enter a valid email address."
    }
  },
  {
    "id": "2026-07-07-react-accessibility-component-api-design-1-icon-button-requires-a-label",
    "title": "Icon button requires a label",
    "fileName": "2026-07-07-react-accessibility-component-api-design.md",
    "modulePath": "./react-example-modules/2026-07-07-react-accessibility-component-api-design-1-icon-button-requires-a-label.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "IconButton",
    "needsQueryClientProvider": false,
    "summary": "Icon button requires a label. This example mounts a live React component in the browser.",
    "props": {
      "label": "Open menu",
      "icon": {
        "$type": "element",
        "tag": "span",
        "key": null,
        "props": {
          "aria-hidden": true,
          "children": "Menu"
        }
      },
      "onClick": {
        "$type": "fn",
        "name": "noop"
      }
    }
  },
  {
    "id": "2026-07-07-react-auth-roles-protected-ui-2-server-check-at-mutation-boundary",
    "title": "Server check at mutation boundary",
    "fileName": "2026-07-07-react-auth-roles-protected-ui.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": false,
    "summary": "async function deleteProject(projectId: string) {\n  const user = await requireCurrentUser();\n  const allowed = await canDeleteProject(user.id, projectId);\n  if (!allowed) {\n    throw new Error(\"Not allowed\");\n  }\n  await db.project.delete({ id: projectId });\n}",
    "props": null
  },
  {
    "id": "2026-07-07-react-auth-roles-protected-ui-1-permission-aware-button",
    "title": "Permission-aware button",
    "fileName": "2026-07-07-react-auth-roles-protected-ui.md",
    "modulePath": "./react-example-modules/2026-07-07-react-auth-roles-protected-ui-1-permission-aware-button.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "DeleteProjectButton",
    "needsQueryClientProvider": false,
    "summary": "Permission-aware button. This example mounts a live React component in the browser.",
    "props": {
      "canDelete": true,
      "onDelete": {
        "$type": "fn",
        "name": "noop"
      }
    }
  },
  {
    "id": "2026-07-07-react-code-splitting-lazy-loading-2-lazy-route-table",
    "title": "Lazy route table",
    "fileName": "2026-07-07-react-code-splitting-lazy-loading.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": "AdminUsersPage",
    "needsQueryClientProvider": false,
    "summary": "const AdminUsersPage = lazy(() => import(\"./routes/AdminUsersPage\"));\nconst PublicHomePage = lazy(() => import(\"./routes/PublicHomePage\"));\nexport const routes = [\n  { path: \"/\", element: <PublicHomePage /> },\n  { path: \"/admin/users\", element: <AdminUsersPage /> },\n];",
    "props": null
  },
  {
    "id": "2026-07-07-react-code-splitting-lazy-loading-1-lazy-chart",
    "title": "Lazy chart",
    "fileName": "2026-07-07-react-code-splitting-lazy-loading.md",
    "modulePath": "./react-example-modules/2026-07-07-react-code-splitting-lazy-loading-1-lazy-chart.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "AnalyticsPanel",
    "needsQueryClientProvider": false,
    "summary": "Lazy chart. This example mounts a live React component in the browser.",
    "props": {}
  },
  {
    "id": "2026-07-07-react-components-and-jsx-2-compose-components",
    "title": "Compose components",
    "fileName": "2026-07-07-react-components-and-jsx.md",
    "modulePath": "./react-example-modules/2026-07-07-react-components-and-jsx-2-compose-components.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "ProductGrid",
    "needsQueryClientProvider": false,
    "summary": "Compose components. This example mounts a live React component in the browser.",
    "props": {
      "products": [
        {
          "id": "shoe",
          "name": "Trail shoes",
          "priceCents": 12900,
          "inStock": true
        },
        {
          "id": "shell",
          "name": "Rain shell",
          "priceCents": 9900,
          "inStock": false
        }
      ]
    }
  },
  {
    "id": "2026-07-07-react-components-and-jsx-1-render-data-with-jsx",
    "title": "Render data with JSX",
    "fileName": "2026-07-07-react-components-and-jsx.md",
    "modulePath": "./react-example-modules/2026-07-07-react-components-and-jsx-1-render-data-with-jsx.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "ProductCard",
    "needsQueryClientProvider": false,
    "summary": "Render data with JSX. This example mounts a live React component in the browser.",
    "props": {
      "name": "Trail shoes",
      "priceCents": 12900,
      "inStock": true
    }
  },
  {
    "id": "2026-07-07-react-context-without-global-soup-2-feature-level-provider",
    "title": "Feature-level provider",
    "fileName": "2026-07-07-react-context-without-global-soup.md",
    "modulePath": "./react-example-modules/2026-07-07-react-context-without-global-soup-2-feature-level-provider.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "ProjectPage",
    "needsQueryClientProvider": false,
    "summary": "Feature-level provider. This example mounts a live React component in the browser.",
    "props": {
      "projectId": "project-1"
    }
  },
  {
    "id": "2026-07-07-react-context-without-global-soup-1-theme-provider-with-a-reader-hook",
    "title": "Theme provider with a reader hook",
    "fileName": "2026-07-07-react-context-without-global-soup.md",
    "modulePath": "./react-example-modules/2026-07-07-react-context-without-global-soup-1-theme-provider-with-a-reader-hook.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "ThemeProvider",
    "needsQueryClientProvider": false,
    "summary": "Theme provider with a reader hook. This example mounts a live React component in the browser.",
    "props": {
      "theme": "dark",
      "children": {
        "$type": "element",
        "tag": "p",
        "key": null,
        "props": {
          "children": "Theme-aware content"
        }
      }
    }
  },
  {
    "id": "2026-07-07-react-custom-hooks-reuse-boundaries-2-window-size-subscription",
    "title": "Window size subscription",
    "fileName": "2026-07-07-react-custom-hooks-reuse-boundaries.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": false,
    "summary": "export function useWindowWidth() {\n  const [width, setWidth] = useState(() => window.innerWidth);\n  useEffect(() => {\n    const update = () => setWidth(window.innerWidth);\n    window.addEventListener(\"resize\", update);\n    return () => window.removeEventListener(\"resize\", update);\n  }, []);\n  return width;\n}",
    "props": null
  },
  {
    "id": "2026-07-07-react-custom-hooks-reuse-boundaries-1-local-storage-state",
    "title": "Local storage state",
    "fileName": "2026-07-07-react-custom-hooks-reuse-boundaries.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": false,
    "summary": "export function useStoredString(key: string, initialValue: string) {\n  const [value, setValue] = useState(() => {\n    return window.localStorage.getItem(key) ?? initialValue;\n  });\n  useEffect(() => {\n    window.localStorage.setItem(key, value);\n  }, [key, value]);\n  return [value, setValue] as const;\n}",
    "props": null
  },
  {
    "id": "2026-07-07-react-data-fetching-with-cache-2-query-client-provider",
    "title": "Query client provider",
    "fileName": "2026-07-07-react-data-fetching-with-cache.md",
    "modulePath": null,
    "mode": "react-server",
    "interactionMode": "runner",
    "componentName": "AppProviders",
    "needsQueryClientProvider": true,
    "summary": "Query client provider. This example is server-rendered in the docs preview.",
    "props": null
  },
  {
    "id": "2026-07-07-react-data-fetching-with-cache-1-tanstack-query-read",
    "title": "TanStack Query read",
    "fileName": "2026-07-07-react-data-fetching-with-cache.md",
    "modulePath": null,
    "mode": "react-server",
    "interactionMode": "runner",
    "componentName": "ProjectName",
    "needsQueryClientProvider": true,
    "summary": "TanStack Query read. This example is server-rendered in the docs preview.",
    "props": null
  },
  {
    "id": "2026-07-07-react-deployment-observability-feature-flags-2-feature-flag-as-a-prop",
    "title": "Feature flag as a prop",
    "fileName": "2026-07-07-react-deployment-observability-feature-flags.md",
    "modulePath": "./react-example-modules/2026-07-07-react-deployment-observability-feature-flags-2-feature-flag-as-a-prop.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "CheckoutPage",
    "needsQueryClientProvider": false,
    "summary": "Feature flag as a prop. This example mounts a live React component in the browser.",
    "props": {
      "flags": {
        "newPaymentSheet": true
      }
    }
  },
  {
    "id": "2026-07-07-react-deployment-observability-feature-flags-1-root-error-reporting",
    "title": "Root error reporting",
    "fileName": "2026-07-07-react-deployment-observability-feature-flags.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": false,
    "summary": "const root = createRoot(document.getElementById(\"root\")!, {\n  onCaughtError(error, errorInfo) {\n    reportError({\n      name: \"react-caught-error\",\n      message: error.message,\n      componentStack: errorInfo.componentStack,\n    });\n  },\n});\nroot.render(<App />);",
    "props": null
  },
  {
    "id": "2026-07-07-react-effects-synchronization-cleanup-2-chat-room-subscription",
    "title": "Chat room subscription",
    "fileName": "2026-07-07-react-effects-synchronization-cleanup.md",
    "modulePath": "./react-example-modules/2026-07-07-react-effects-synchronization-cleanup-2-chat-room-subscription.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "ChatRoom",
    "needsQueryClientProvider": false,
    "summary": "Chat room subscription. This example mounts a live React component in the browser.",
    "props": {
      "roomId": "general"
    }
  },
  {
    "id": "2026-07-07-react-effects-synchronization-cleanup-1-browser-online-status",
    "title": "Browser online status",
    "fileName": "2026-07-07-react-effects-synchronization-cleanup.md",
    "modulePath": "./react-example-modules/2026-07-07-react-effects-synchronization-cleanup-1-browser-online-status.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "OnlineStatus",
    "needsQueryClientProvider": false,
    "summary": "Browser online status. This example mounts a live React component in the browser.",
    "props": {}
  },
  {
    "id": "2026-07-07-react-error-boundaries-recovery-2-root-production-reporting",
    "title": "Root production reporting",
    "fileName": "2026-07-07-react-error-boundaries-recovery.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": false,
    "summary": "createRoot(document.getElementById(\"root\")!, {\n  onCaughtError(error, errorInfo) {\n    reportError({\n      error,\n      componentStack: errorInfo.componentStack,\n    });\n  },\n}).render(<App />);",
    "props": null
  },
  {
    "id": "2026-07-07-react-error-boundaries-recovery-1-boundary-usage",
    "title": "Boundary usage",
    "fileName": "2026-07-07-react-error-boundaries-recovery.md",
    "modulePath": "./react-example-modules/2026-07-07-react-error-boundaries-recovery-1-boundary-usage.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "DashboardPage",
    "needsQueryClientProvider": false,
    "summary": "Boundary usage. This example mounts a live React component in the browser.",
    "props": {}
  },
  {
    "id": "2026-07-07-react-eslint-typescript-formatting-ci-1-effect-lint-value",
    "title": "Effect lint value",
    "fileName": "2026-07-07-react-eslint-typescript-formatting-ci.md",
    "modulePath": "./react-example-modules/2026-07-07-react-eslint-typescript-formatting-ci-1-effect-lint-value.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "RoomTitle",
    "needsQueryClientProvider": false,
    "summary": "Effect lint value. This example mounts a live React component in the browser.",
    "props": {
      "roomId": "general"
    }
  },
  {
    "id": "2026-07-07-react-events-and-local-state-2-disclosure-state",
    "title": "Disclosure state",
    "fileName": "2026-07-07-react-events-and-local-state.md",
    "modulePath": "./react-example-modules/2026-07-07-react-events-and-local-state-2-disclosure-state.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "HelpDisclosure",
    "needsQueryClientProvider": false,
    "summary": "Disclosure state. This example mounts a live React component in the browser.",
    "props": {}
  },
  {
    "id": "2026-07-07-react-events-and-local-state-1-counter-with-functional-updates",
    "title": "Counter with functional updates",
    "fileName": "2026-07-07-react-events-and-local-state.md",
    "modulePath": "./react-example-modules/2026-07-07-react-events-and-local-state-1-counter-with-functional-updates.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "Counter",
    "needsQueryClientProvider": false,
    "summary": "Counter with functional updates. This example mounts a live React component in the browser.",
    "props": {}
  },
  {
    "id": "2026-07-07-react-expo-react-native-2-shared-hook-platform-ui",
    "title": "Shared Hook, platform UI",
    "fileName": "2026-07-07-react-expo-react-native.md",
    "modulePath": null,
    "mode": "react-server",
    "interactionMode": "runner",
    "componentName": "FavoriteButton",
    "needsQueryClientProvider": false,
    "summary": "Shared Hook, platform UI. This example is server-rendered in the docs preview.",
    "props": null
  },
  {
    "id": "2026-07-07-react-expo-react-native-1-native-screen-component",
    "title": "Native screen component",
    "fileName": "2026-07-07-react-expo-react-native.md",
    "modulePath": null,
    "mode": "react-server",
    "interactionMode": "runner",
    "componentName": "HomeScreen",
    "needsQueryClientProvider": false,
    "summary": "Native screen component. This example is server-rendered in the docs preview.",
    "props": null
  },
  {
    "id": "2026-07-07-react-forms-with-actions-2-nested-submit-button-with-useformstatus",
    "title": "Nested submit button with useFormStatus",
    "fileName": "2026-07-07-react-forms-with-actions.md",
    "modulePath": "./react-example-modules/2026-07-07-react-forms-with-actions-2-nested-submit-button-with-useformstatus.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "SettingsForm",
    "needsQueryClientProvider": false,
    "summary": "Nested submit button with useFormStatus. This example mounts a live React component in the browser.",
    "props": {
      "action": {
        "$type": "fn",
        "name": "noop"
      }
    }
  },
  {
    "id": "2026-07-07-react-forms-with-actions-1-profile-form-state",
    "title": "Profile form state",
    "fileName": "2026-07-07-react-forms-with-actions.md",
    "modulePath": "./react-example-modules/2026-07-07-react-forms-with-actions-1-profile-form-state.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "ProfileForm",
    "needsQueryClientProvider": false,
    "summary": "Profile form state. This example mounts a live React component in the browser.",
    "props": {}
  },
  {
    "id": "2026-07-07-react-framework-choice-project-setup-2-client-entry-point",
    "title": "Client entry point",
    "fileName": "2026-07-07-react-framework-choice-project-setup.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": false,
    "summary": "const rootElement = document.getElementById(\"root\");\nif (!rootElement) {\n  throw new Error(\"Missing root element\");\n}\ncreateRoot(rootElement).render(<App />);",
    "props": null
  },
  {
    "id": "2026-07-07-react-framework-choice-project-setup-1-framework-decision-shape",
    "title": "Framework decision shape",
    "fileName": "2026-07-07-react-framework-choice-project-setup.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": false,
    "summary": "export function chooseReactStart(need: ProjectNeed) {\n  if (need.routes && (need.serverRendering || need.serverMutations)) {\n    return \"Start with a React framework\";\n  }\n  if (need.staticPages || need.routes) {\n    return \"Compare a framework with a Vite app plus router\";\n  }\n  return \"A client-only Vite app is a reasonable starting point\";\n}",
    "props": null
  },
  {
    "id": "2026-07-07-react-internationalization-formatting-2-date-formatter",
    "title": "Date formatter",
    "fileName": "2026-07-07-react-internationalization-formatting.md",
    "modulePath": "./react-example-modules/2026-07-07-react-internationalization-formatting-2-date-formatter.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "AppointmentTime",
    "needsQueryClientProvider": false,
    "summary": "Date formatter. This example mounts a live React component in the browser.",
    "props": {
      "startsAt": "2026-07-08T17:00:00.000Z",
      "locale": "en-US"
    }
  },
  {
    "id": "2026-07-07-react-internationalization-formatting-1-currency-formatter",
    "title": "Currency formatter",
    "fileName": "2026-07-07-react-internationalization-formatting.md",
    "modulePath": "./react-example-modules/2026-07-07-react-internationalization-formatting-1-currency-formatter.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "Price",
    "needsQueryClientProvider": false,
    "summary": "Currency formatter. This example mounts a live React component in the browser.",
    "props": {
      "cents": 12900,
      "currency": "USD",
      "locale": "en-US"
    }
  },
  {
    "id": "2026-07-07-react-lifting-state-controlled-inputs-2-controlled-checkbox",
    "title": "Controlled checkbox",
    "fileName": "2026-07-07-react-lifting-state-controlled-inputs.md",
    "modulePath": "./react-example-modules/2026-07-07-react-lifting-state-controlled-inputs-2-controlled-checkbox.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "InventoryFilter",
    "needsQueryClientProvider": false,
    "summary": "Controlled checkbox. This example mounts a live React component in the browser.",
    "props": {}
  },
  {
    "id": "2026-07-07-react-lifting-state-controlled-inputs-1-shared-search-query",
    "title": "Shared search query",
    "fileName": "2026-07-07-react-lifting-state-controlled-inputs.md",
    "modulePath": "./react-example-modules/2026-07-07-react-lifting-state-controlled-inputs-1-shared-search-query.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "ProductSearch",
    "needsQueryClientProvider": false,
    "summary": "Shared search query. This example mounts a live React component in the browser.",
    "props": {
      "products": [
        {
          "id": "shoe",
          "name": "Trail shoes",
          "priceCents": 12900,
          "inStock": true
        },
        {
          "id": "shell",
          "name": "Rain shell",
          "priceCents": 9900,
          "inStock": false
        }
      ]
    }
  },
  {
    "id": "2026-07-07-react-mutations-cache-invalidation-2-small-direct-cache-update",
    "title": "Small direct cache update",
    "fileName": "2026-07-07-react-mutations-cache-invalidation.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": true,
    "summary": "function markProjectArchived(queryClient: QueryClient, projectId: string) {\n  queryClient.setQueryData<Project>([\"project\", projectId], (project) => {\n    if (!project) return project;\n    return { ...project, archived: true };\n  });\n}",
    "props": null
  },
  {
    "id": "2026-07-07-react-mutations-cache-invalidation-1-invalidate-after-update",
    "title": "Invalidate after update",
    "fileName": "2026-07-07-react-mutations-cache-invalidation.md",
    "modulePath": null,
    "mode": "react-server",
    "interactionMode": "runner",
    "componentName": "RenameProjectButton",
    "needsQueryClientProvider": true,
    "summary": "Invalidate after update. This example is server-rendered in the docs preview.",
    "props": null
  },
  {
    "id": "2026-07-07-react-nextjs-app-router-2-nested-layout",
    "title": "Nested layout",
    "fileName": "2026-07-07-react-nextjs-app-router.md",
    "modulePath": "./react-example-modules/2026-07-07-react-nextjs-app-router-2-nested-layout.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "AccountLayout",
    "needsQueryClientProvider": false,
    "summary": "Nested layout. This example mounts a live React component in the browser.",
    "props": {
      "children": {
        "$type": "element",
        "tag": "p",
        "key": null,
        "props": {
          "children": "Billing settings"
        }
      }
    }
  },
  {
    "id": "2026-07-07-react-nextjs-app-router-1-route-page-with-server-data",
    "title": "Route page with server data",
    "fileName": "2026-07-07-react-nextjs-app-router.md",
    "modulePath": null,
    "mode": "react-server",
    "interactionMode": "runner",
    "componentName": "ProductPage",
    "needsQueryClientProvider": false,
    "summary": "Route page with server data. This example is server-rendered in the docs preview.",
    "props": null
  },
  {
    "id": "2026-07-07-react-optimistic-ui-2-optimistic-like-count",
    "title": "Optimistic like count",
    "fileName": "2026-07-07-react-optimistic-ui.md",
    "modulePath": "./react-example-modules/2026-07-07-react-optimistic-ui-2-optimistic-like-count.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "LikeButton",
    "needsQueryClientProvider": false,
    "summary": "Optimistic like count. This example mounts a live React component in the browser.",
    "props": {
      "liked": false,
      "count": 41,
      "saveLike": {
        "$type": "fn",
        "name": "asyncNoop"
      }
    }
  },
  {
    "id": "2026-07-07-react-optimistic-ui-1-optimistic-comment-list",
    "title": "Optimistic comment list",
    "fileName": "2026-07-07-react-optimistic-ui.md",
    "modulePath": "./react-example-modules/2026-07-07-react-optimistic-ui-1-optimistic-comment-list.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "CommentForm",
    "needsQueryClientProvider": false,
    "summary": "Optimistic comment list. This example mounts a live React component in the browser.",
    "props": {
      "comments": [
        {
          "id": "comment-1",
          "body": "Looks ready."
        },
        {
          "id": "comment-2",
          "body": "Ship it."
        }
      ],
      "createComment": {
        "$type": "fn",
        "name": "asyncNoop"
      }
    }
  },
  {
    "id": "2026-07-07-react-performance-and-compiler-2-profiler-around-a-slow-region",
    "title": "Profiler around a slow region",
    "fileName": "2026-07-07-react-performance-and-compiler.md",
    "modulePath": "./react-example-modules/2026-07-07-react-performance-and-compiler-2-profiler-around-a-slow-region.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "InstrumentedDashboard",
    "needsQueryClientProvider": false,
    "summary": "Profiler around a slow region. This example mounts a live React component in the browser.",
    "props": {}
  },
  {
    "id": "2026-07-07-react-performance-and-compiler-1-memoized-expensive-calculation",
    "title": "Memoized expensive calculation",
    "fileName": "2026-07-07-react-performance-and-compiler.md",
    "modulePath": "./react-example-modules/2026-07-07-react-performance-and-compiler-1-memoized-expensive-calculation.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "FilteredReport",
    "needsQueryClientProvider": false,
    "summary": "Memoized expensive calculation. This example mounts a live React component in the browser.",
    "props": {
      "rows": [
        {
          "id": "row-1",
          "name": "Revenue"
        },
        {
          "id": "row-2",
          "name": "Retention"
        }
      ]
    }
  },
  {
    "id": "2026-07-07-react-props-children-component-boundaries-2-reusable-row-with-explicit-props",
    "title": "Reusable row with explicit props",
    "fileName": "2026-07-07-react-props-children-component-boundaries.md",
    "modulePath": "./react-example-modules/2026-07-07-react-props-children-component-boundaries-2-reusable-row-with-explicit-props.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "SettingsRow",
    "needsQueryClientProvider": false,
    "summary": "Reusable row with explicit props. This example mounts a live React component in the browser.",
    "props": {
      "label": "Email updates",
      "description": "Receive release notes and billing notices.",
      "action": {
        "$type": "element",
        "tag": "button",
        "key": null,
        "props": {
          "children": "Edit"
        }
      }
    }
  },
  {
    "id": "2026-07-07-react-props-children-component-boundaries-1-panel-with-children",
    "title": "Panel with children",
    "fileName": "2026-07-07-react-props-children-component-boundaries.md",
    "modulePath": "./react-example-modules/2026-07-07-react-props-children-component-boundaries-1-panel-with-children.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "Panel",
    "needsQueryClientProvider": false,
    "summary": "Panel with children. This example mounts a live React component in the browser.",
    "props": {
      "title": "Billing",
      "children": [
        {
          "$type": "element",
          "tag": "p",
          "key": "copy",
          "props": {
            "children": "Your card is current."
          }
        },
        {
          "$type": "element",
          "tag": "button",
          "key": "action",
          "props": {
            "type": "button",
            "children": "Update payment method"
          }
        }
      ]
    }
  },
  {
    "id": "2026-07-07-react-reducers-multi-step-state-2-wizard-reducer",
    "title": "Wizard reducer",
    "fileName": "2026-07-07-react-reducers-multi-step-state.md",
    "modulePath": "./react-example-modules/2026-07-07-react-reducers-multi-step-state-2-wizard-reducer.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "WizardDemo",
    "needsQueryClientProvider": false,
    "summary": "Wizard reducer. This example mounts a live React component in the browser.",
    "props": {}
  },
  {
    "id": "2026-07-07-react-reducers-multi-step-state-1-counter-reducer",
    "title": "Counter reducer",
    "fileName": "2026-07-07-react-reducers-multi-step-state.md",
    "modulePath": "./react-example-modules/2026-07-07-react-reducers-multi-step-state-1-counter-reducer.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "ReducerCounter",
    "needsQueryClientProvider": false,
    "summary": "Counter reducer. This example mounts a live React component in the browser.",
    "props": {}
  },
  {
    "id": "2026-07-07-react-refs-dom-escape-hatches-2-store-a-timer-id",
    "title": "Store a timer ID",
    "fileName": "2026-07-07-react-refs-dom-escape-hatches.md",
    "modulePath": "./react-example-modules/2026-07-07-react-refs-dom-escape-hatches-2-store-a-timer-id.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "SaveStatus",
    "needsQueryClientProvider": false,
    "summary": "Store a timer ID. This example mounts a live React component in the browser.",
    "props": {}
  },
  {
    "id": "2026-07-07-react-refs-dom-escape-hatches-1-focus-an-input",
    "title": "Focus an input",
    "fileName": "2026-07-07-react-refs-dom-escape-hatches.md",
    "modulePath": "./react-example-modules/2026-07-07-react-refs-dom-escape-hatches-1-focus-an-input.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "FocusNameButton",
    "needsQueryClientProvider": false,
    "summary": "Focus an input. This example mounts a live React component in the browser.",
    "props": {}
  },
  {
    "id": "2026-07-07-react-rendering-lists-stable-keys-2-grouped-list-keys",
    "title": "Grouped list keys",
    "fileName": "2026-07-07-react-rendering-lists-stable-keys.md",
    "modulePath": "./react-example-modules/2026-07-07-react-rendering-lists-stable-keys-2-grouped-list-keys.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "ProjectTaskList",
    "needsQueryClientProvider": false,
    "summary": "Grouped list keys. This example mounts a live React component in the browser.",
    "props": {
      "projects": [
        {
          "id": "project-1",
          "name": "Launch",
          "tasks": [
            {
              "id": "task-1",
              "title": "Draft release notes",
              "done": true
            },
            {
              "id": "task-2",
              "title": "Verify analytics",
              "done": false
            }
          ]
        },
        {
          "id": "project-2",
          "name": "Retrospective",
          "tasks": [
            {
              "id": "task-1",
              "title": "Draft release notes",
              "done": true
            }
          ]
        }
      ]
    }
  },
  {
    "id": "2026-07-07-react-rendering-lists-stable-keys-1-task-list-with-item-identity",
    "title": "Task list with item identity",
    "fileName": "2026-07-07-react-rendering-lists-stable-keys.md",
    "modulePath": "./react-example-modules/2026-07-07-react-rendering-lists-stable-keys-1-task-list-with-item-identity.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "TaskList",
    "needsQueryClientProvider": false,
    "summary": "Task list with item identity. This example mounts a live React component in the browser.",
    "props": {
      "tasks": [
        {
          "id": "task-1",
          "title": "Draft release notes",
          "done": true
        },
        {
          "id": "task-2",
          "title": "Verify analytics",
          "done": false
        }
      ]
    }
  },
  {
    "id": "2026-07-07-react-router-v7-framework-2-nested-layout-with-an-outlet",
    "title": "Nested layout with an outlet",
    "fileName": "2026-07-07-react-router-v7-framework.md",
    "modulePath": null,
    "mode": "react-server",
    "interactionMode": "runner",
    "componentName": "AccountLayout",
    "needsQueryClientProvider": false,
    "summary": "Nested layout with an outlet. This example is server-rendered in the docs preview.",
    "props": null
  },
  {
    "id": "2026-07-07-react-router-v7-framework-1-route-with-loader-data",
    "title": "Route with loader data",
    "fileName": "2026-07-07-react-router-v7-framework.md",
    "modulePath": "./react-example-modules/2026-07-07-react-router-v7-framework-1-route-with-loader-data.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "ProjectRoute",
    "needsQueryClientProvider": false,
    "summary": "Route with loader data. This example mounts a live React component in the browser.",
    "props": {
      "loaderData": {
        "id": "project-1",
        "name": "Launch plan",
        "description": "Coordinate release tasks before the public launch."
      }
    }
  },
  {
    "id": "2026-07-07-react-routing-nested-layouts-2-route-config-sketch",
    "title": "Route config sketch",
    "fileName": "2026-07-07-react-routing-nested-layouts.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": false,
    "summary": "const routes = [\n  {\n    path: \"/account\",\n    element: <AccountLayout />,\n    children: [\n      { path: \"profile\", element: <ProfilePage /> },\n      { path: \"security\", element: <SecurityPage /> },\n    ],\n  },\n];",
    "props": null
  },
  {
    "id": "2026-07-07-react-routing-nested-layouts-1-generic-account-layout",
    "title": "Generic account layout",
    "fileName": "2026-07-07-react-routing-nested-layouts.md",
    "modulePath": "./react-example-modules/2026-07-07-react-routing-nested-layouts-1-generic-account-layout.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "AccountLayout",
    "needsQueryClientProvider": false,
    "summary": "Generic account layout. This example mounts a live React component in the browser.",
    "props": {
      "children": {
        "$type": "element",
        "tag": "p",
        "key": null,
        "props": {
          "children": "Profile settings"
        }
      }
    }
  },
  {
    "id": "2026-07-07-react-server-actions-mutation-boundaries-2-form-using-a-server-action",
    "title": "Form using a server action",
    "fileName": "2026-07-07-react-server-actions-mutation-boundaries.md",
    "modulePath": "./react-example-modules/2026-07-07-react-server-actions-mutation-boundaries-2-form-using-a-server-action.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "DisplayNameForm",
    "needsQueryClientProvider": false,
    "summary": "Form using a server action. This example mounts a live React component in the browser.",
    "props": {}
  },
  {
    "id": "2026-07-07-react-server-actions-mutation-boundaries-1-server-function-for-a-profile-update",
    "title": "Server function for a profile update",
    "fileName": "2026-07-07-react-server-actions-mutation-boundaries.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": false,
    "summary": "\"use server\";\nexport async function updateDisplayName(formData: FormData) {\n  const displayName = String(formData.get(\"displayName\") ?? \"\").trim();\n  if (displayName.length < 2) {\n    return { ok: false, message: \"Display name needs at least two characters.\" };\n  }\n  const user = await requireCurrentUser();\n  await db.user.update({\n    id: user.id,\n    displayName,\n  });\n  return { ok: true, message: \"Profile updated.\" };\n}",
    "props": null
  },
  {
    "id": "2026-07-07-react-server-components-client-boundaries-2-client-boundary-for-interactivity",
    "title": "Client boundary for interactivity",
    "fileName": "2026-07-07-react-server-components-client-boundaries.md",
    "modulePath": "./react-example-modules/2026-07-07-react-server-components-client-boundaries-2-client-boundary-for-interactivity.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "DateRangeSelector",
    "needsQueryClientProvider": false,
    "summary": "Client boundary for interactivity. This example mounts a live React component in the browser.",
    "props": {
      "initialRange": "30d"
    }
  },
  {
    "id": "2026-07-07-react-server-components-client-boundaries-1-server-page-with-a-client-filter",
    "title": "Server page with a client filter",
    "fileName": "2026-07-07-react-server-components-client-boundaries.md",
    "modulePath": null,
    "mode": "react-server",
    "interactionMode": "runner",
    "componentName": "ReportsPage",
    "needsQueryClientProvider": false,
    "summary": "Server page with a client filter. This example is server-rendered in the docs preview.",
    "props": null
  },
  {
    "id": "2026-07-07-react-state-shape-derived-values-2-store-ids-instead-of-objects",
    "title": "Store IDs instead of objects",
    "fileName": "2026-07-07-react-state-shape-derived-values.md",
    "modulePath": "./react-example-modules/2026-07-07-react-state-shape-derived-values-2-store-ids-instead-of-objects.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "AssigneeSummary",
    "needsQueryClientProvider": false,
    "summary": "Store IDs instead of objects. This example mounts a live React component in the browser.",
    "props": {
      "users": [
        {
          "id": "u1",
          "name": "Ada Lovelace"
        },
        {
          "id": "u2",
          "name": "Grace Hopper"
        }
      ],
      "selectedUserId": "u2"
    }
  },
  {
    "id": "2026-07-07-react-state-shape-derived-values-1-filter-without-duplicated-state",
    "title": "Filter without duplicated state",
    "fileName": "2026-07-07-react-state-shape-derived-values.md",
    "modulePath": "./react-example-modules/2026-07-07-react-state-shape-derived-values-1-filter-without-duplicated-state.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "TaskBoard",
    "needsQueryClientProvider": false,
    "summary": "Filter without duplicated state. This example mounts a live React component in the browser.",
    "props": {
      "tasks": [
        {
          "id": "task-1",
          "title": "Draft release notes",
          "done": true
        },
        {
          "id": "task-2",
          "title": "Verify analytics",
          "done": false
        }
      ]
    }
  },
  {
    "id": "2026-07-07-react-storybook-component-workbenches-2-interaction-story",
    "title": "Interaction story",
    "fileName": "2026-07-07-react-storybook-component-workbenches.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": "OpensMenu",
    "needsQueryClientProvider": false,
    "summary": "export const OpensMenu: Story = {\n  args: {\n    label: \"Account\",\n  },\n  play: async ({ canvasElement }) => {\n    const canvas = within(canvasElement);\n    await userEvent.click(canvas.getByRole(\"button\", { name: /account/i }));\n    await expect(canvas.getByRole(\"menu\")).toBeVisible();\n  },\n};",
    "props": null
  },
  {
    "id": "2026-07-07-react-storybook-component-workbenches-1-component-stories",
    "title": "Component stories",
    "fileName": "2026-07-07-react-storybook-component-workbenches.md",
    "modulePath": "./react-example-modules/2026-07-07-react-storybook-component-workbenches-1-component-stories.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "InStock",
    "needsQueryClientProvider": false,
    "summary": "Component stories. This example mounts a live React component in the browser.",
    "props": {}
  },
  {
    "id": "2026-07-07-react-styling-design-tokens-variants-1-button-variants",
    "title": "Button variants",
    "fileName": "2026-07-07-react-styling-design-tokens-variants.md",
    "modulePath": "./react-example-modules/2026-07-07-react-styling-design-tokens-variants-1-button-variants.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "Button",
    "needsQueryClientProvider": false,
    "summary": "Button variants. This example mounts a live React component in the browser.",
    "props": {
      "variant": "danger",
      "children": "Delete project",
      "onClick": {
        "$type": "fn",
        "name": "noop"
      }
    }
  },
  {
    "id": "2026-07-07-react-suspense-data-loading-boundaries-2-nested-reveal",
    "title": "Nested reveal",
    "fileName": "2026-07-07-react-suspense-data-loading-boundaries.md",
    "modulePath": "./react-example-modules/2026-07-07-react-suspense-data-loading-boundaries-2-nested-reveal.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "Dashboard",
    "needsQueryClientProvider": false,
    "summary": "Nested reveal. This example mounts a live React component in the browser.",
    "props": {}
  },
  {
    "id": "2026-07-07-react-suspense-data-loading-boundaries-1-boundary-around-a-data-section",
    "title": "Boundary around a data section",
    "fileName": "2026-07-07-react-suspense-data-loading-boundaries.md",
    "modulePath": "./react-example-modules/2026-07-07-react-suspense-data-loading-boundaries-1-boundary-around-a-data-section.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "ArtistPage",
    "needsQueryClientProvider": false,
    "summary": "Boundary around a data section. This example mounts a live React component in the browser.",
    "props": {
      "artistId": "maya"
    }
  },
  {
    "id": "2026-07-07-react-tanstack-router-start-2-route-loader-idea",
    "title": "Route loader idea",
    "fileName": "2026-07-07-react-tanstack-router-start.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": "Route",
    "needsQueryClientProvider": false,
    "summary": "export const Route = createFileRoute(\"/projects/$projectId\")({\n  loader: async ({ params }) => {\n    return getProject(params.projectId);\n  },\n  component: ProjectRoute,\n});\nfunction ProjectRoute() {\n  const project = Route.useLoaderData();\n  return <h1>{project.name}</h1>;\n}",
    "props": null
  },
  {
    "id": "2026-07-07-react-tanstack-router-start-1-typed-route-search",
    "title": "Typed route search",
    "fileName": "2026-07-07-react-tanstack-router-start.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": "Route",
    "needsQueryClientProvider": false,
    "summary": "type Search = {\n  query?: string;\n  page?: number;\n};\nexport const Route = createFileRoute(\"/products/\")({\n  validateSearch: (search: Record<string, unknown>): Search => ({\n    query: typeof search.query === \"string\" ? search.query : \"\",\n    page: Number(search.page ?? 1),\n  }),\n  component: ProductsRoute,\n});\nfunction ProductsRoute() {\n  const search = Route.useSearch();\n  return <ProductResults query={search.query ?? \"\"} page={search.page ?? 1} />;",
    "props": null
  },
  {
    "id": "2026-07-07-react-testing-components-by-behavior-2-form-validation-message",
    "title": "Form validation message",
    "fileName": "2026-07-07-react-testing-components-by-behavior.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": false,
    "summary": "test(\"shows a validation message for a short display name\", async () => {\n  const user = userEvent.setup();\n  render(<ProfileForm />);\n  await user.type(screen.getByLabelText(/display name/i), \"A\");\n  await user.click(screen.getByRole(\"button\", { name: /save/i }));\n  expect(\n    await screen.findByText(/at least two characters/i),\n  ).toBeVisible();\n});",
    "props": null
  },
  {
    "id": "2026-07-07-react-testing-components-by-behavior-1-counter-behavior",
    "title": "Counter behavior",
    "fileName": "2026-07-07-react-testing-components-by-behavior.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": false,
    "summary": "test(\"increments when clicked\", async () => {\n  const user = userEvent.setup();\n  render(<Counter />);\n  await user.click(screen.getByRole(\"button\", { name: /count: 0/i }));\n  expect(screen.getByRole(\"button\", { name: /count: 1/i })).toBeVisible();\n});",
    "props": null
  },
  {
    "id": "2026-07-07-react-transitions-responsive-updates-2-tab-switch",
    "title": "Tab switch",
    "fileName": "2026-07-07-react-transitions-responsive-updates.md",
    "modulePath": "./react-example-modules/2026-07-07-react-transitions-responsive-updates-2-tab-switch.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "ProjectTabs",
    "needsQueryClientProvider": false,
    "summary": "Tab switch. This example mounts a live React component in the browser.",
    "props": {}
  },
  {
    "id": "2026-07-07-react-transitions-responsive-updates-1-filter-after-urgent-typing",
    "title": "Filter after urgent typing",
    "fileName": "2026-07-07-react-transitions-responsive-updates.md",
    "modulePath": "./react-example-modules/2026-07-07-react-transitions-responsive-updates-1-filter-after-urgent-typing.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "SearchableGrid",
    "needsQueryClientProvider": false,
    "summary": "Filter after urgent typing. This example mounts a live React component in the browser.",
    "props": {
      "items": [
        "Trail shoes",
        "Rain shell",
        "Camp mug"
      ]
    }
  },
  {
    "id": "2026-07-07-react-typescript-component-patterns-2-generic-list-renderer",
    "title": "Generic list renderer",
    "fileName": "2026-07-07-react-typescript-component-patterns.md",
    "modulePath": "./react-example-modules/2026-07-07-react-typescript-component-patterns-2-generic-list-renderer.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "List",
    "needsQueryClientProvider": false,
    "summary": "Generic list renderer. This example mounts a live React component in the browser.",
    "props": {
      "items": [
        {
          "id": "shoe",
          "name": "Trail shoes",
          "priceCents": 12900,
          "inStock": true
        },
        {
          "id": "shell",
          "name": "Rain shell",
          "priceCents": 9900,
          "inStock": false
        }
      ],
      "getKey": {
        "$type": "fn",
        "name": "getKey"
      },
      "renderItem": {
        "$type": "fn",
        "name": "renderItem"
      }
    }
  },
  {
    "id": "2026-07-07-react-typescript-component-patterns-1-discriminated-button-props",
    "title": "Discriminated button props",
    "fileName": "2026-07-07-react-typescript-component-patterns.md",
    "modulePath": "./react-example-modules/2026-07-07-react-typescript-component-patterns-1-discriminated-button-props.tsx",
    "mode": "react-server",
    "interactionMode": "live-component",
    "componentName": "ActionButton",
    "needsQueryClientProvider": false,
    "summary": "Discriminated button props. This example mounts a live React component in the browser.",
    "props": {
      "kind": "link",
      "href": "/account/billing",
      "children": "Manage billing"
    }
  },
  {
    "id": "2026-07-07-react-validation-form-api-boundaries-2-action-returns-validation-state",
    "title": "Action returns validation state",
    "fileName": "2026-07-07-react-validation-form-api-boundaries.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": false,
    "summary": "type FormState = {\n  fieldErrors: Record<string, string>;\n  message: string;\n};\nasync function saveProfile(\n  previous: FormState,\n  formData: FormData,\n): Promise<FormState> {\n  const parsed = parseProfile(formData);\n  if (!parsed.ok) {\n    return {\n      fieldErrors: { displayName: parsed.error },\n      message: \"Check the highlighted fields.\",\n    };",
    "props": null
  },
  {
    "id": "2026-07-07-react-validation-form-api-boundaries-1-parse-form-input",
    "title": "Parse form input",
    "fileName": "2026-07-07-react-validation-form-api-boundaries.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": false,
    "summary": "type ProfileInput =\n  | { ok: true; displayName: string }\n  | { ok: false; error: string };\nconst profileSchema = z.object({\n  displayName: z.string().trim().min(2),\n});\nfunction parseProfile(formData: FormData): ProfileInput {\n  const parsed = profileSchema.safeParse({\n    displayName: formData.get(\"displayName\"),\n  });\n  if (!parsed.success) {\n    return { ok: false, error: \"Display name needs at least two characters.\" };\n  }\n  return { ok: true, displayName: parsed.data.displayName };",
    "props": null
  },
  {
    "id": "2026-07-07-react-vite-client-only-apps-2-minimal-vite-config",
    "title": "Minimal Vite config",
    "fileName": "2026-07-07-react-vite-client-only-apps.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": false,
    "summary": "export default defineConfig({\n  plugins: [react()],\n  server: {\n    port: 5173,\n  },\n});",
    "props": null
  },
  {
    "id": "2026-07-07-react-vite-client-only-apps-1-vite-react-entry",
    "title": "Vite React entry",
    "fileName": "2026-07-07-react-vite-client-only-apps.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": false,
    "summary": "const root = document.getElementById(\"root\");\nif (!root) {\n  throw new Error(\"Missing root element\");\n}\ncreateRoot(root).render(<App />);",
    "props": null
  },
  {
    "id": "2026-07-07-react-vitest-testing-library-playwright-2-playwright-route-flow",
    "title": "Playwright route flow",
    "fileName": "2026-07-07-react-vitest-testing-library-playwright.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": false,
    "summary": "test(\"search filters products\", async ({ page }) => {\n  await page.goto(\"/products\");\n  await page.getByLabel(\"Search products\").fill(\"boots\");\n  await expect(page.getByRole(\"heading\", { name: /boots/i })).toBeVisible();\n  await expect(page.getByText(\"Trail sandals\")).toBeHidden();\n});",
    "props": null
  },
  {
    "id": "2026-07-07-react-vitest-testing-library-playwright-1-vitest-reducer-test",
    "title": "Vitest reducer test",
    "fileName": "2026-07-07-react-vitest-testing-library-playwright.md",
    "modulePath": null,
    "mode": "result",
    "interactionMode": "runner",
    "componentName": null,
    "needsQueryClientProvider": false,
    "summary": "test(\"moves to confirm after profile is saved\", () => {\n  const state = {\n    step: \"profile\",\n    email: \"reader@example.test\",\n    displayName: \"\",\n  };\n  expect(\n    wizardReducer(state, { type: \"profileSaved\", displayName: \"Weylin\" }),\n  ).toEqual({\n    step: \"confirm\",\n    email: \"reader@example.test\",\n    displayName: \"Weylin\",\n  });\n});",
    "props": null
  }
] as const;
