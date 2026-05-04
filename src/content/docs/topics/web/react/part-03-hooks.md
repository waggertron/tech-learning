---
title: "Part 3: Hooks"
description: "useEffect with cleanup, useRef, useCallback, useMemo, and custom hooks. The full hooks toolkit and the rules that keep them predictable."
parent: react
tags: [react, javascript, typescript, web, frontend, intermediate]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

Hooks let you use React features inside functional components. `useState` was the first one. This part covers the rest of the core set and shows how to package reusable logic into custom hooks.

## The rules of hooks

Two rules enforced by the ESLint plugin `eslint-plugin-react-hooks` (included in Vite's React template):

1. **Call hooks at the top level.** Not inside conditionals, loops, or nested functions.
2. **Call hooks from React functions only.** Not from regular JavaScript functions.

If you break these rules, hooks lose their identity between renders and produce subtle, hard-to-debug bugs.

## useEffect

`useEffect` runs code after the component renders. Use it for side effects: data fetching, subscriptions, timers, DOM mutations, anything that reaches outside React's render cycle.

```tsx
import { useState, useEffect } from 'react'

function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)

    // cleanup: runs before the next effect and on unmount
    return () => clearInterval(id)
  }, [])   // empty array = run once on mount

  return <p>{time.toLocaleTimeString()}</p>
}
```

The second argument, the dependency array, controls when the effect runs:

| Dependency array | When the effect runs |
| --- | --- |
| Omitted | After every render |
| `[]` (empty) | Once on mount, cleanup on unmount |
| `[a, b]` | On mount, and whenever `a` or `b` changes |

### Cleanup

The function returned from `useEffect` runs before the next effect execution and when the component unmounts. Always clean up subscriptions, timers, and event listeners to prevent memory leaks.

```tsx
useEffect(() => {
  const controller = new AbortController()

  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => {
      if (err.name !== 'AbortError') setError(err.message)
    })

  return () => controller.abort()
}, [])
```

The `AbortController` pattern cancels in-flight requests when the component unmounts. Without it, a fetch that resolves after unmount calls `setState` on a gone component, which silently fails in React 18+ but was a warning in earlier versions.

### Effect dependencies

List every reactive value the effect uses in the dependency array. The ESLint rule `react-hooks/exhaustive-deps` catches omissions automatically.

```tsx
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser)
  }, [userId])   // re-fetch when userId changes

  if (!user) return <p>Loading...</p>
  return <p>{user.name}</p>
}
```

## useRef

`useRef` returns a mutable object `{ current: value }` that persists across renders without triggering re-renders when you change it. Two main uses: DOM access, and storing a mutable value without re-rendering.

### DOM access

```tsx
import { useRef } from 'react'

function AutoFocusInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return <input ref={inputRef} placeholder="Auto-focused" />
}
```

The `ref` prop on a native element sets `inputRef.current` to the DOM node after mount.

### Storing mutable values

```tsx
function StopWatch() {
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = () => {
    if (intervalRef.current) return   // already running
    intervalRef.current = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)
  }

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  return (
    <div>
      <p>{elapsed}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  )
}
```

Storing the interval ID in a ref instead of state avoids re-rendering every time the ID changes.

## useCallback

`useCallback` memoizes a function so that the same function reference is returned across renders (unless its dependencies change). Use it to prevent child components from re-rendering when a stable callback is passed as a prop.

```tsx
import { useState, useCallback } from 'react'

function Parent() {
  const [count, setCount] = useState(0)
  const [other, setOther] = useState(0)

  // Without useCallback: new function reference on every Parent render,
  // ExpensiveChild re-renders even when only `other` changed.
  const handleReset = useCallback(() => {
    setCount(0)
  }, [])   // no dependencies, never recreated

  return (
    <div>
      <button onClick={() => setOther(o => o + 1)}>Other: {other}</button>
      <ExpensiveChild count={count} onReset={handleReset} />
    </div>
  )
}
```

`useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`. It's syntactic sugar for the function case.

**When to use it:** when passing callbacks to memoized children (`React.memo`). It has no benefit if the child isn't memoized, the function recreation is cheap.

## useMemo

`useMemo` memoizes a computed value. The computation runs once and is cached until a dependency changes.

```tsx
import { useState, useMemo } from 'react'

interface Item {
  id: number
  name: string
  category: string
}

function ItemList({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState('')

  // Without useMemo: filters on every render, including unrelated state changes.
  const filtered = useMemo(
    () => items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    ),
    [items, filter]
  )

  return (
    <div>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter items"
      />
      <ul>
        {filtered.map(item => (
          <li key={item.id}>{item.name} ({item.category})</li>
        ))}
      </ul>
    </div>
  )
}
```

**When to use it:** expensive computations (sorting/filtering large lists, complex transforms). Don't use it for simple expressions, memoization has overhead too.

## Custom hooks

A custom hook is a function whose name starts with `use` that calls other hooks. Extract reusable stateful logic into custom hooks.

### useFetch

```tsx
import { useState, useEffect } from 'react'

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<T>
      })
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [url])

  return { data, loading, error }
}

export default useFetch
```

Usage:

```tsx
interface User {
  id: number
  name: string
  email: string
}

function UserCard({ id }: { id: number }) {
  const { data: user, loading, error } = useFetch<User>(`/api/users/${id}`)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  if (!user) return null

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}
```

### useLocalStorage

```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setStoredValue = (newValue: T) => {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }

  return [value, setStoredValue] as const
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  )
}
```

### useDebounce

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}

// Usage: wait 300ms after the user stops typing before searching
function SearchBox() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  const { data } = useFetch<string[]>(
    debouncedQuery ? `/api/search?q=${debouncedQuery}` : ''
  )

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {data?.map(result => <p key={result}>{result}</p>)}
    </div>
  )
}
```

## Gotchas at this stage

- **Infinite effect loops.** If you create an object or array inside a component and list it as a dependency, a new reference is created on every render, which triggers the effect, which causes a render, which triggers the effect. Move the value outside the component or wrap it with `useMemo`.
- **Missing cleanup.** Subscriptions and timers without cleanup accumulate across renders. If you see multiple handler calls or growing memory usage, look for missing return functions in effects.
- **`useCallback` without `React.memo`.** `useCallback` only helps when the child component bails out of re-renders. Without `React.memo` on the child, the memoized function has no effect.
- **`useRef` vs `useState` for derived display values.** If you need to show a value in the UI, use state. If you only need to read it in event handlers or effects, a ref is fine and avoids re-renders.

## What's next

Part 4 covers the Context API and `useReducer`: how to share state across a component tree without prop drilling, and when that pattern causes more problems than it solves.

## References

- [React, synchronizing with effects](https://react.dev/learn/synchronizing-with-effects)
- [React, you might not need an effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React, reusing logic with custom hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [React, useCallback reference](https://react.dev/reference/react/useCallback)
- [React, useMemo reference](https://react.dev/reference/react/useMemo)
