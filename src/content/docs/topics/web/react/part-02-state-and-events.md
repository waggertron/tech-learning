---
title: "Part 2: State and events"
description: "useState, event handlers, controlled inputs, and lifting state up. How React components respond to user actions and share data with their neighbors."
parent: react
tags: [react, javascript, typescript, web, frontend, beginner]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

Props let components receive data. State lets components remember data that changes over time. This part introduces `useState`, event handling, and the pattern that makes sibling components share data: lifting state up.

## useState

`useState` is a hook that returns a value and a setter. When you call the setter, React re-renders the component with the new value.

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}
```

The `useState(0)` call:
- Takes an initial value (`0`)
- Returns a tuple: the current state value, and a function to update it
- The component re-renders every time `setCount` is called with a new value

TypeScript infers the type from the initial value. If you need to start with `null` and later hold a string:

```tsx
const [user, setUser] = useState<string | null>(null)
```

### State is a snapshot

State values are fixed for a given render. This trips people up when they write:

```tsx
// Bad: count is stale inside the closure
setCount(count + 1)
setCount(count + 1)   // still count + 1, not count + 2
```

When the next state depends on the previous, use the functional updater form:

```tsx
// Good: each call gets the latest value
setCount(prev => prev + 1)
setCount(prev => prev + 1)   // count + 2
```

Use the functional form whenever you call setState inside async code, loops, or event batches.

## Event handlers

React normalizes browser events into `SyntheticEvent` objects. The pattern is always: pass a function to an event prop, don't call it immediately.

```tsx
// Good: passes the function reference
<button onClick={handleClick}>Click me</button>

// Bad: calls the function immediately during render
<button onClick={handleClick()}>Click me</button>
```

Common event props:

```tsx
function EventDemo() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log('clicked')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('submitted')
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // process form
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleClick} type="submit">Go</button>
    </form>
  )
}
```

TypeScript's event types (`React.MouseEvent`, `React.ChangeEvent`, etc.) are in `@types/react` which Vite installs automatically.

## Controlled inputs

In React, form inputs are either controlled (React owns the value) or uncontrolled (the DOM owns the value). Prefer controlled inputs: they make validation, transformation, and submission straightforward.

```tsx
function SearchBox() {
  const [query, setQuery] = useState('')

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <p>You typed: {query}</p>
      <button onClick={() => setQuery('')}>Clear</button>
    </div>
  )
}
```

The `value` prop makes React the source of truth. The `onChange` handler keeps state in sync with what the user types. If you set `value` without `onChange`, the input becomes read-only.

### Multiple fields

For forms with several fields, use an object in state instead of separate `useState` calls:

```tsx
interface FormData {
  name: string
  email: string
  message: string
}

function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting:', form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Message"
      />
      <button type="submit">Send</button>
    </form>
  )
}
```

The `[name]: value` computed property key means one `handleChange` handles every field.

## State with objects and arrays

When state is an object or array, you must replace the whole value, not mutate it in place. React uses reference equality to detect changes.

```tsx
// Bad: mutates the existing object, React sees same reference, no re-render
state.items.push(newItem)
setState(state)

// Good: return a new array
setState(prev => [...prev.items, newItem])
```

A task list with add and toggle:

```tsx
interface Task {
  id: number
  title: string
  done: boolean
}

function TaskApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [input, setInput] = useState('')

  const addTask = () => {
    if (!input.trim()) return
    setTasks(prev => [
      ...prev,
      { id: Date.now(), title: input.trim(), done: false },
    ])
    setInput('')
  }

  const toggleTask = (id: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    )
  }

  const removeTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  return (
    <div>
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="New task"
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span
              style={{ textDecoration: task.done ? 'line-through' : 'none' }}
              onClick={() => toggleTask(task.id)}
            >
              {task.title}
            </span>
            <button onClick={() => removeTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <p>{tasks.filter(t => !t.done).length} remaining</p>
    </div>
  )
}
```

## Lifting state up

When two sibling components need to share data, move the state to their common parent and pass it down as props.

Consider a filter bar and a list that need to stay in sync:

```tsx
// Bad: state in FilterBar, but TaskList can't see it
function FilterBar() {
  const [filter, setFilter] = useState('all')   // stuck here
  ...
}

function TaskList() {
  // can't access filter from FilterBar
}
```

Lift state to the parent:

```tsx
// FilterBar.tsx
interface FilterBarProps {
  filter: string
  onFilterChange: (filter: string) => void
}

function FilterBar({ filter, onFilterChange }: FilterBarProps) {
  return (
    <div>
      {['all', 'active', 'done'].map(f => (
        <button
          key={f}
          onClick={() => onFilterChange(f)}
          style={{ fontWeight: filter === f ? 'bold' : 'normal' }}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
```

```tsx
// TaskList.tsx
interface TaskListProps {
  tasks: Task[]
  filter: string
  onToggle: (id: number) => void
}

function TaskList({ tasks, filter, onToggle }: TaskListProps) {
  const visible = tasks.filter(task => {
    if (filter === 'active') return !task.done
    if (filter === 'done') return task.done
    return true
  })

  return (
    <ul>
      {visible.map(task => (
        <li key={task.id} onClick={() => onToggle(task.id)}>
          {task.title}
        </li>
      ))}
    </ul>
  )
}
```

```tsx
// App.tsx: parent owns the state
function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState('all')

  const toggleTask = (id: number) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }

  return (
    <div>
      <FilterBar filter={filter} onFilterChange={setFilter} />
      <TaskList tasks={tasks} filter={filter} onToggle={toggleTask} />
    </div>
  )
}
```

The parent holds the state; children receive data and callbacks. This is the core React data-flow pattern. Everything flows down; events bubble up through callbacks.

## Gotchas at this stage

- **Stale closure.** A function defined inside a component captures the state value at the time it was created. If you call `setCount(count + 1)` inside a `setTimeout`, the `count` it sees may be old. Use the functional updater `setCount(prev => prev + 1)`.
- **Don't set state during render.** Calling `setState` directly in the function body (not inside a handler or effect) creates an infinite render loop.
- **Objects and arrays need spreading.** `setState({ ...prev, key: newValue })`. Forgetting the spread silently drops other fields.
- **Controlled input with `undefined`.** If `value` is `undefined`, React treats the input as uncontrolled. Initialize state to `''`, not `undefined`.

## What's next

Part 3 covers the broader hooks API: `useEffect` for side effects (fetching, subscriptions, timers), `useRef`, `useCallback`, `useMemo`, and how to write custom hooks that encapsulate reusable logic.

## References

- [React, state: a component's memory](https://react.dev/learn/state-a-components-memory)
- [React, responding to events](https://react.dev/learn/responding-to-events)
- [React, sharing state between components](https://react.dev/learn/sharing-state-between-components)
