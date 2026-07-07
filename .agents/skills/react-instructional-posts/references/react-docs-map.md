# React Docs Map For Instructional Posts

Reviewed on 2026-07-07. The official React site displayed React v19.2 during the review. Refresh these links when the user asks for latest React guidance or when a post depends on a fast-moving API.

## Primary Sources

- [Quick Start](https://react.dev/learn): Daily React concepts, including components, JSX, lists, events, state, Hooks, and shared state.
- [Thinking in React](https://react.dev/learn/thinking-in-react): Component hierarchy, static UI first, minimal state, state placement, and inverse data flow.
- [React Reference Overview](https://react.dev/reference/react): Current stable hooks, components, APIs, React DOM APIs, Compiler docs, lint docs, Rules of React, and React Server Components docs.
- [Creating a React App](https://react.dev/learn/creating-a-react-app): Current framework guidance, including Next.js App Router, React Router v7, Expo, TanStack Start, and scratch app tradeoffs.
- [Build a React App from Scratch](https://react.dev/learn/build-a-react-app-from-scratch): Build tools, routing, data fetching, code splitting, and framework-like responsibilities.
- [Using TypeScript](https://react.dev/learn/typescript): `.tsx`, prop typing, event typing, hooks typing, and `children` typing.
- [React Compiler](https://react.dev/learn/react-compiler): Compiler goals, installation, incremental adoption, troubleshooting, configuration, directives, and library compilation.

## Concept Anchors

- **Component**: A JavaScript function that returns UI. Use [Your First Component](https://react.dev/learn/your-first-component), [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx), and [Your UI as a Tree](https://react.dev/learn/understanding-your-ui-as-a-tree).
- **JSX**: Markup inside JavaScript. Use [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx) and [JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces).
- **Props**: Parent to child input. Use [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component).
- **Conditional UI**: Use normal JavaScript branches. Use [Conditional Rendering](https://react.dev/learn/conditional-rendering).
- **Lists and keys**: Turn arrays into JSX with stable sibling identity. Use [Rendering Lists](https://react.dev/learn/rendering-lists).
- **Purity**: Components and Hooks return output without changing things outside render. Use [Keeping Components Pure](https://react.dev/learn/keeping-components-pure) and [Components and Hooks must be pure](https://react.dev/reference/rules/components-and-hooks-must-be-pure).
- **Events**: Event handlers run because a user or browser event happened. Use [Responding to Events](https://react.dev/learn/responding-to-events).
- **State**: Component memory for changing data that affects rendering. Use [State: A Component's Memory](https://react.dev/learn/state-a-components-memory), [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot), and [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates).
- **State shape**: Store the minimal changing facts, then calculate derived values during render. Use [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure), [Thinking in React](https://react.dev/learn/thinking-in-react), and [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).
- **Lifting state**: Move shared state to the closest common owner. Use [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components).
- **Resetting state**: State is tied to a component's position and identity. Use [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state).
- **Reducers**: Group related state transitions into a pure function. Use [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer) and [`useReducer`](https://react.dev/reference/react/useReducer).
- **Context**: Pass values deeply without threading props through every layer. Use [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context), [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context), and [`useContext`](https://react.dev/reference/react/useContext).
- **Refs**: Hold mutable values or DOM nodes without making them part of rendered output. Use [Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs), [Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs), and [`useRef`](https://react.dev/reference/react/useRef).
- **Effects**: Synchronize with systems outside React. Use [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects), [Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects), [Separating Events from Effects](https://react.dev/learn/separating-events-from-effects), [Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies), and [`useEffect`](https://react.dev/reference/react/useEffect).
- **Custom Hooks**: Package reusable stateful logic behind a `use` function. Use [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks) and [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks).
- **Suspense**: Boundary that shows a fallback while children load. Use [`<Suspense>`](https://react.dev/reference/react/Suspense), [`lazy`](https://react.dev/reference/react/lazy), and [`use`](https://react.dev/reference/react/use).
- **Transitions**: Mark non-urgent updates so the UI can stay responsive. Use [`useTransition`](https://react.dev/reference/react/useTransition), [`startTransition`](https://react.dev/reference/react/startTransition), and [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue).
- **Actions**: Work kicked off from a form action or Transition. Use [`useActionState`](https://react.dev/reference/react/useActionState), [`useOptimistic`](https://react.dev/reference/react/useOptimistic), [`<form>`](https://react.dev/reference/react-dom/components/form), and [`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus).
- **Server Components**: Components rendered in a separate server environment before the client bundle. Use [Server Components](https://react.dev/reference/rsc/server-components), [Server Functions](https://react.dev/reference/rsc/server-functions), [`'use client'`](https://react.dev/reference/rsc/use-client), and [`'use server'`](https://react.dev/reference/rsc/use-server).
- **Entry point**: `createRoot` creates a client root. `hydrateRoot` attaches to server-rendered HTML. Use [`createRoot`](https://react.dev/reference/react-dom/client/createRoot) and [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot).
- **Testing**: Use [`act`](https://react.dev/reference/react/act) as the React reference point. React Testing Library wraps helpers in `act`, so framework posts can link to Testing Library for user-level tests.
- **Compiler and memoization**: Teach purity, then use [`memo`](https://react.dev/reference/react/memo), [`useMemo`](https://react.dev/reference/react/useMemo), [`useCallback`](https://react.dev/reference/react/useCallback), [`<Profiler>`](https://react.dev/reference/react/Profiler), and [React Compiler](https://react.dev/learn/react-compiler).
- **Lint rules**: Use [eslint-plugin-react-hooks lints](https://react.dev/reference/eslint-plugin-react-hooks/lints), especially `rules-of-hooks`, `exhaustive-deps`, `purity`, `immutability`, `refs`, `set-state-in-effect`, `set-state-in-render`, and `use-memo`.

## Series Mapping

| Series concept | Primary docs | Teaching focus |
|---|---|---|
| Components and JSX | Quick Start, Your First Component, JSX docs | Components are named UI functions. JSX is a JavaScript expression for UI structure. |
| Props, children, boundaries | Passing Props, TypeScript children | Data flows down. `children` composes slots and shells. |
| Lists and stable keys | Rendering Lists | Keys give sibling identity across inserts, deletes, and reorders. |
| Events and local state | Responding to Events, State Memory | Events describe intent. State stores memory that changes rendered output. |
| State shape and derived values | Thinking in React, Choosing State Structure, You Might Not Need an Effect | Store minimal changing facts. Calculate the rest during render. |
| Lifting state and controlled inputs | Sharing State, Reacting to Input with State | Shared state belongs at the closest common owner. Controlled inputs mirror state. |
| Reducers | Extracting State Logic, useReducer | Related transitions become named actions in one pure reducer. |
| Context | Passing Data Deeply, useContext | Context broadcasts a value from a provider to descendants. |
| Refs | Referencing Values, DOM Refs, useRef | Refs hold mutable values and DOM handles outside render state. |
| Effects | Synchronizing with Effects, Lifecycle of Reactive Effects | Effects start and stop synchronization with external systems. |
| Custom Hooks | Reusing Logic, Rules of Hooks | Reusable stateful logic gets its own Hook. |
| Suspense | Suspense, lazy, use | Boundaries coordinate loading and reveal order. |
| Transitions | useTransition, startTransition, useDeferredValue | Non-urgent rendering work can happen in the background. |
| Forms with Actions | useActionState, form, useFormStatus | Actions connect form submission, pending state, result state, and progressive enhancement. |
| Optimistic UI | useOptimistic, useActionState | Show an expected result while the Action is pending. |
| Server Components | RSC Server Components, use client | Server Components render before the client bundle and compose with Client Components for interactivity. |
| Server Functions | Server Functions, use server, form actions | Server Functions let clients request server work through framework support. |
| TypeScript patterns | Using TypeScript | Type props, events, refs, reducers, and children in `.tsx` files. |
| Testing components | act reference | Tests wait for React updates before assertions. User-facing helpers usually wrap `act`. |
| Performance and Compiler | React Compiler, memo APIs, Profiler | Write pure components, measure, then add memoization or compiler support. |
| Framework choice | Creating a React App | Production apps usually start with a framework. Scratch apps need routing, data, rendering, and bundling choices. |
| Vite client apps | Build from Scratch | Vite is a scratch app build tool, not a full application framework. |
| Next.js App Router | Creating a React App, RSC docs | Next.js App Router is the most complete implementation of the full-stack React architecture described in React docs. |
| React Router v7 | Creating a React App, Build from Scratch | React Router can pair with Vite as a full-stack React framework and routing layer. |
| TanStack Router and Start | Creating a React App, Build from Scratch | TanStack Router is listed as a router option. TanStack Start is listed as a newer full-stack framework. |
| Expo | Creating a React App | Expo is the React framework path for native and universal apps. |
| Data fetching cache | Build from Scratch | React docs point readers toward framework loaders, server fetching, and cache libraries for backend data. |
| Mutations and invalidation | useActionState, useOptimistic, framework docs | Separate read cache from write flows. Use framework or cache-library docs for invalidation mechanics. |
| Error boundaries | createRoot options, useTransition error boundary usage, lint docs | Error boundaries catch rendering errors and pair with root-level production reporting. |
| Lazy loading | lazy, Suspense | Lazy components suspend until their code loads. Keep `lazy` declarations outside components. |
| Styling and tokens | Quick Start styling notes | React passes classes and style objects. Token systems live in CSS or a styling library. |
| Accessibility APIs | Common DOM components | React renders standard HTML controls. Accessibility comes from semantic elements, labels, focus, and ARIA where needed. |
| Validation boundaries | form, useActionState, Server Functions | Validate at the boundary that receives form data or server input. |
| Auth and roles | Server Components, Server Functions, framework docs | Server checks protect data. Client checks shape visible UI. |
| Internationalization | React rendering model, framework docs | Format values near display and keep locale data out of duplicated state. |
| Deployment and observability | createRoot error options, framework docs | Root error callbacks, profiler measurements, and framework build output are the React-facing hooks. |

## Research Notes To Carry Into Posts

- React docs emphasize an instructional path: describe the UI, add interactivity, manage state, then use escape hatches.
- The best recurring mental model is data flow through a tree: props go down, events and actions report intent, state lives at the owner that needs to remember changes.
- Effects are not lifecycle callbacks for all logic. They synchronize external systems and have their own start or stop lifecycle.
- React 19 docs use `Action` as a broader concept than form submission. `useActionState`, `useOptimistic`, `useTransition`, and form Actions overlap, but each solves a different teaching problem.
- React Server Components are stable at the component model level in React 19, but framework and bundler implementation details still require version care.
- React docs distinguish Server Components from Server Functions. `"use server"` marks Server Functions, not Server Components.
- React's framework guidance favors production frameworks because routing, data fetching, rendering strategy, code splitting, and performance become application-level responsibilities.
- Compiler coverage depends on setup and code shape. Teach purity and React rules before teaching compiler benefits.
