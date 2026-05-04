---
title: "Part 4, Context and reducers"
description: "The Context API, useContext, and useReducer. How to share state across a tree without prop drilling, and when not to reach for context at all."
parent: react
tags: [react, javascript, typescript, web, frontend, intermediate]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

Prop drilling becomes painful when data needs to pass through several intermediate components that don't use it themselves. Context solves that. `useReducer` is the companion for complex state transitions that outgrow `useState`. This part covers both and the cases where you should skip them entirely.

## The Context API

Context has three parts:

1. **Create** a context with a default value.
2. **Provide** it somewhere in the tree.
3. **Consume** it in any descendant component.

### Basic example: theme

```tsx
// theme-context.tsx
import { createContext, useContext, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
```

Wrap the application (or a subtree) in the provider:

```tsx
// main.tsx
import { ThemeProvider } from './theme-context'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
)
```

Consume anywhere in the tree, no prop threading needed:

```tsx
// Header.tsx
import { useTheme } from './theme-context'

function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header style={{ background: theme === 'dark' ? '#111' : '#fff' }}>
      <h1>My App</h1>
      <button onClick={toggleTheme}>Toggle theme</button>
    </header>
  )
}
```

```tsx
// DeepChild.tsx (no props needed from Header or App)
import { useTheme } from './theme-context'

function DeepChild() {
  const { theme } = useTheme()
  return <div className={`card card--${theme}`}>Content</div>
}
```

### The null pattern

Initializing with `null` and throwing in the custom hook is better than initializing with a fake default. It catches missing providers at development time rather than silently using wrong defaults.

## useReducer

`useReducer` is an alternative to `useState` for state that has multiple sub-values or transitions that follow explicit rules. It takes a reducer function (same shape as a Redux reducer) and an initial state.

```tsx
type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'set'; payload: number }

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'increment': return state + 1
    case 'decrement': return state - 1
    case 'reset':     return 0
    case 'set':       return action.payload
    default:          return state
  }
}

function Counter() {
  const [count, dispatch] = useReducer(reducer, 0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'set', payload: 10 })}>Set 10</button>
    </div>
  )
}
```

TypeScript's discriminated unions (`type: 'increment' | ...`) give you exhaustive action type checking and autocomplete on `payload`.

### A more realistic reducer: task list

```tsx
interface Task {
  id: number
  title: string
  done: boolean
}

interface TaskState {
  tasks: Task[]
  filter: 'all' | 'active' | 'done'
}

type TaskAction =
  | { type: 'add'; title: string }
  | { type: 'toggle'; id: number }
  | { type: 'remove'; id: number }
  | { type: 'setFilter'; filter: TaskState['filter'] }

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        tasks: [...state.tasks, { id: Date.now(), title: action.title, done: false }],
      }
    case 'toggle':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.id ? { ...t, done: !t.done } : t
        ),
      }
    case 'remove':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.id) }
    case 'setFilter':
      return { ...state, filter: action.filter }
    default:
      return state
  }
}

const initialState: TaskState = { tasks: [], filter: 'all' }

function TaskApp() {
  const [state, dispatch] = useReducer(taskReducer, initialState)
  const [input, setInput] = useState('')

  const visibleTasks = state.tasks.filter(t => {
    if (state.filter === 'active') return !t.done
    if (state.filter === 'done') return t.done
    return true
  })

  return (
    <div>
      <div>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button onClick={() => {
          if (input.trim()) {
            dispatch({ type: 'add', title: input.trim() })
            setInput('')
          }
        }}>Add</button>
      </div>
      <div>
        {(['all', 'active', 'done'] as const).map(f => (
          <button key={f} onClick={() => dispatch({ type: 'setFilter', filter: f })}>
            {f}
          </button>
        ))}
      </div>
      <ul>
        {visibleTasks.map(task => (
          <li key={task.id}>
            <span onClick={() => dispatch({ type: 'toggle', id: task.id })}>
              {task.done ? '(done) ' : ''}{task.title}
            </span>
            <button onClick={() => dispatch({ type: 'remove', id: task.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

Reducers are pure functions. No fetches, no side effects, no mutation. That purity makes them trivial to unit test.

## Combining context and useReducer

Pair them to distribute both state and dispatch across a tree:

```tsx
// tasks-context.tsx
import { createContext, useContext, useReducer } from 'react'

const TaskStateContext = createContext<TaskState | null>(null)
const TaskDispatchContext = createContext<React.Dispatch<TaskAction> | null>(null)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  return (
    <TaskStateContext.Provider value={state}>
      <TaskDispatchContext.Provider value={dispatch}>
        {children}
      </TaskDispatchContext.Provider>
    </TaskStateContext.Provider>
  )
}

export function useTaskState() {
  const ctx = useContext(TaskStateContext)
  if (!ctx) throw new Error('useTaskState must be inside TaskProvider')
  return ctx
}

export function useTaskDispatch() {
  const ctx = useContext(TaskDispatchContext)
  if (!ctx) throw new Error('useTaskDispatch must be inside TaskProvider')
  return ctx
}
```

Splitting state and dispatch into separate contexts means a component that only dispatches (like a button) doesn't re-render when state changes.

## When NOT to use context

Context is not a substitute for proper state management. Avoid it when:

**The state changes frequently.** Every consumer of a context re-renders when the context value changes. Storing a high-frequency value (mouse position, animation frame data) in context will tank performance. Use a state management library (Part 7) or keep it local.

**You have a small component tree.** Two or three levels of prop passing is fine. Context adds indirection and makes components harder to reason about in isolation.

**The data is server-fetched.** Fetched data belongs in a data-fetching layer (TanStack Query, Part 6), not a context. Context for server data leads to manual cache invalidation and race conditions.

**Good uses for context:**
- Current authenticated user
- Theme preference
- Locale / internationalization
- Feature flags
- Any truly global, infrequently-changing UI state

## Gotchas at this stage

- **Context provider location.** Put the provider as low in the tree as possible while still covering all consumers. A provider at the root causes all consumers to re-render whenever the value changes, even if unrelated parts of the app are the ones that changed.
- **New object on every render.** `<Context.Provider value={{ count, setCount }}>` creates a new object reference every render. Memoize the value: `const value = useMemo(() => ({ count, setCount }), [count])`.
- **Reducer state must be serializable.** Don't put class instances, functions, or DOM nodes in reducer state. Plain objects and arrays only.
- **Missing `default` in switch.** Always return `state` from the default case. A missing default causes `undefined` state on unknown actions.

## What's next

Part 5 introduces React Router v7: defining routes, nested layouts, loaders for data, and protecting routes behind authentication checks.

## References

- [React, passing data deeply with context](https://react.dev/learn/passing-data-deeply-with-context)
- [React, extracting state logic into a reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)
- [React, scaling up with reducer and context](https://react.dev/learn/scaling-up-with-reducer-and-context)
