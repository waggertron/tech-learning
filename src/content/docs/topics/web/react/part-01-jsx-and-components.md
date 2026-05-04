---
title: "Part 1: JSX and components"
description: "Scaffold a Vite + React project, understand JSX syntax, write functional components, pass props, and render lists. The mental model that everything else builds on."
parent: react
tags: [react, javascript, typescript, web, frontend, beginner]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

React is a library for building UIs out of components: self-contained pieces of markup, logic, and styles that compose into larger interfaces. This part gets a project running and covers the three primitives you use every day: JSX, components, and props.

## Scaffold with Vite

Vite is the standard build tool for React in 2025. It starts in under a second and has a sensible default config.

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
```

Open `http://localhost:5173`. You should see the Vite + React splash page.

The `--template react-ts` flag gives you TypeScript from the start. If you genuinely want plain JavaScript, use `--template react`, but TypeScript is worth the minor extra syntax: it catches prop shape mismatches before the browser does.

### What got generated

```
my-app/
├── index.html            # single HTML file, Vite injects the bundle here
├── vite.config.ts        # Vite config, almost never needs touching
├── tsconfig.json         # TypeScript config
├── src/
│   ├── main.tsx          # entry point, mounts App into #root
│   ├── App.tsx           # root component
│   └── App.css           # global styles
└── public/               # static assets served as-is
```

`src/main.tsx` is the entry point:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

`StrictMode` runs each component twice in development to surface side-effect bugs. Leave it on.

## JSX

JSX looks like HTML inside JavaScript, but it compiles to plain function calls. Write JSX in `.tsx` (TypeScript) or `.jsx` (JavaScript) files.

```tsx
// This JSX:
const element = <h1 className="title">Hello, world</h1>

// Compiles to:
const element = React.createElement('h1', { className: 'title' }, 'Hello, world')
```

You never call `React.createElement` directly, but knowing it exists explains a few JSX rules.

### JSX rules

**One root element.** JSX expressions must have a single root. Use a Fragment when you don't want an extra DOM node.

```tsx
// Bad: two siblings with no wrapper
return (
  <h1>Title</h1>
  <p>Paragraph</p>
)

// Good: Fragment wrapper (no DOM output)
return (
  <>
    <h1>Title</h1>
    <p>Paragraph</p>
  </>
)
```

**`className`, not `class`.** `class` is a reserved keyword in JavaScript.

```tsx
<div className="container">...</div>
```

**Self-close empty tags.**

```tsx
<img src="logo.png" alt="logo" />
<input type="text" />
<br />
```

**Expressions in curly braces.** Any JavaScript expression goes inside `{}`.

```tsx
const name = 'Weylin'
const count = 42

return (
  <div>
    <p>Hello, {name}</p>
    <p>Count: {count * 2}</p>
    <p>Today: {new Date().toLocaleDateString()}</p>
  </div>
)
```

**Conditionals.** JSX has no `if` block, use ternary or `&&`.

```tsx
const isLoggedIn = true

return (
  <div>
    {isLoggedIn ? <p>Welcome back</p> : <p>Please log in</p>}
    {isLoggedIn && <button>Log out</button>}
  </div>
)
```

Gotcha: `0 && <Component />` renders `0`, not nothing. Use `count > 0 && <Component />` when the value might be falsy-but-not-false.

## Functional components

A React component is a function that returns JSX. That's it.

```tsx
function Greeting() {
  return <h1>Hello, world</h1>
}
```

Component names must start with a capital letter. Lowercase names (`greeting`) are treated as native HTML tags and won't work as components.

### Using a component

```tsx
// App.tsx
import Greeting from './Greeting'

function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
    </div>
  )
}
```

Each `<Greeting />` renders independently.

## Props

Props are the inputs to a component, passed as attributes in JSX and received as an object in the function.

```tsx
// Greeting.tsx
interface GreetingProps {
  name: string
  role?: string   // optional prop
}

function Greeting({ name, role = 'visitor' }: GreetingProps) {
  return (
    <p>
      Hello, {name}! You are a {role}.
    </p>
  )
}

export default Greeting
```

```tsx
// App.tsx
<Greeting name="Weylin" role="admin" />
<Greeting name="Jane" />   // role defaults to 'visitor'
```

TypeScript's `interface` on props catches mismatches at compile time: passing the wrong type or a missing required prop is a build error, not a runtime surprise.

### Passing different prop types

```tsx
interface CardProps {
  title: string
  count: number
  isActive: boolean
  onClick: () => void
  children: React.ReactNode   // anything renderable
}

function Card({ title, count, isActive, onClick, children }: CardProps) {
  return (
    <div
      className={isActive ? 'card card--active' : 'card'}
      onClick={onClick}
    >
      <h2>{title}</h2>
      <span>{count}</span>
      {children}
    </div>
  )
}
```

```tsx
<Card
  title="Tasks"
  count={5}
  isActive={true}
  onClick={() => console.log('clicked')}
>
  <p>Slot content goes here</p>
</Card>
```

`children` is how you nest content inside a component, the same way `<div>` wraps content.

## Rendering lists

Map over an array and return JSX for each item. Every item needs a `key` prop that is unique among siblings.

```tsx
interface Task {
  id: number
  title: string
  done: boolean
}

const tasks: Task[] = [
  { id: 1, title: 'Learn JSX', done: true },
  { id: 2, title: 'Build a component', done: false },
  { id: 3, title: 'Pass some props', done: false },
]

function TaskList() {
  return (
    <ul>
      {tasks.map((task) => (
        <li
          key={task.id}
          style={{ textDecoration: task.done ? 'line-through' : 'none' }}
        >
          {task.title}
        </li>
      ))}
    </ul>
  )
}
```

`key` helps React reconcile which items changed, added, or removed when the list updates. Use stable IDs (database IDs, slugs), not array indexes. Indexes cause subtle bugs when items reorder.

## Composing components

Break UIs into small components and compose them. A `TaskList` can use a `TaskItem` component per row:

```tsx
// TaskItem.tsx
interface TaskItemProps {
  title: string
  done: boolean
}

function TaskItem({ title, done }: TaskItemProps) {
  return (
    <li style={{ textDecoration: done ? 'line-through' : 'none' }}>
      {title}
    </li>
  )
}

export default TaskItem
```

```tsx
// TaskList.tsx
import TaskItem from './TaskItem'

function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task.id} title={task.title} done={task.done} />
      ))}
    </ul>
  )
}
```

This is the React way: prefer many small components over few large ones. Small components are easier to test, easier to reuse, and easier to reason about.

## Gotchas at this stage

- **Forgot to export.** `export default ComponentName` at the bottom of the file (or `export function ComponentName`). A missing export gives you an empty module error.
- **JSX must be in scope.** With Vite's React preset, the JSX transform is automatic. You don't need `import React from 'react'` at the top of every file anymore.
- **`key` on the wrong element.** The `key` prop goes on the outermost element returned from `.map()`, not on a child inside it.
- **Props are read-only.** Never mutate a prop directly. If you need to change it, lift state up (Part 2) or use a callback prop.
- **`undefined` renders nothing, `null` renders nothing, `false` renders nothing.** But `0` renders `"0"`. This surprises people when they write `array.length && <Component />`.

## What's next

Part 2 covers `useState` and event handlers: how to make components respond to user input and store changing values.

## References

- [React, describing the UI](https://react.dev/learn/describing-the-ui)
- [React, your first component](https://react.dev/learn/your-first-component)
- [Vite, getting started](https://vitejs.dev/guide/)
- [React, passing props to a component](https://react.dev/learn/passing-props-to-a-component)
