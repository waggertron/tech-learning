---
title: "Part 9, Performance"
description: "React.memo, useMemo, and useCallback done right. React.lazy and Suspense for code splitting, the React Profiler for finding what is actually slow."
parent: react
tags: [react, javascript, typescript, web, frontend, advanced]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

React is fast by default for most apps. Performance optimization should be evidence-driven: profile first, then fix what the data shows, not what you suspect. This part covers the tools React gives you, how to use them correctly, and the common mistakes that add complexity without helping.

## How React renders

React re-renders a component when its state or props change. It also re-renders all children by default. Understanding this is the key to knowing when memoization helps.

```
Parent re-renders
  → Child A re-renders (even if its props didn't change)
    → Child A's children re-render
  → Child B re-renders
```

For most apps this is fine: React's virtual DOM diffing is fast. Memoization only pays off when:
- Re-rendering is measurably slow (profiler says so)
- A child component is expensive to render
- Props are stable (don't change unnecessarily)

## React.memo

`React.memo` is a higher-order component that bails out of re-rendering if props haven't changed (by reference equality).

```tsx
import { memo } from 'react'

interface ExpensiveChartProps {
  data: number[]
  title: string
}

const ExpensiveChart = memo(function ExpensiveChart({ data, title }: ExpensiveChartProps) {
  // Imagine this does heavy SVG computation
  return (
    <div>
      <h3>{title}</h3>
      <svg>
        {data.map((value, i) => (
          <rect key={i} x={i * 10} y={100 - value} width={8} height={value} />
        ))}
      </svg>
    </div>
  )
})
```

```tsx
function Dashboard() {
  const [tick, setTick] = useState(0)
  const chartData = [10, 40, 30, 60, 20]   // same reference? No, new array each render

  return (
    <div>
      <button onClick={() => setTick(t => t + 1)}>Tick: {tick}</button>
      <ExpensiveChart data={chartData} title="My chart" />
    </div>
  )
}
```

This won't work: `chartData` is a new array on every render, so `memo` sees changed props and re-renders anyway. The fix is `useMemo`:

```tsx
function Dashboard() {
  const [tick, setTick] = useState(0)
  const chartData = useMemo(() => [10, 40, 30, 60, 20], [])   // stable reference

  return (
    <div>
      <button onClick={() => setTick(t => t + 1)}>Tick: {tick}</button>
      <ExpensiveChart data={chartData} title="My chart" />
    </div>
  )
}
```

Now `memo` works: `chartData` reference is stable, `ExpensiveChart` skips re-rendering when `tick` changes.

### memo with a custom comparison

```tsx
const Chart = memo(ExpensiveChart, (prevProps, nextProps) => {
  // Return true to skip re-render (props are "equal")
  return (
    prevProps.title === nextProps.title &&
    prevProps.data.length === nextProps.data.length &&
    prevProps.data.every((v, i) => v === nextProps.data[i])
  )
})
```

Use a custom comparator when the default reference equality is too coarse or too fine.

## useMemo

Memoize expensive computations. The computation re-runs only when dependencies change.

```tsx
function ProductList({ products, searchQuery, sortField }: Props) {
  const processedProducts = useMemo(() => {
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return filtered.sort((a, b) =>
      sortField === 'price'
        ? a.price - b.price
        : a.name.localeCompare(b.name)
    )
  }, [products, searchQuery, sortField])

  return (
    <ul>
      {processedProducts.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  )
}
```

Without `useMemo`, filtering and sorting run on every render (including re-renders from unrelated state changes in a parent). With a large `products` array this becomes noticeable.

**When to skip `useMemo`:**
- The computation is fast (arithmetic, simple string ops)
- Dependencies change on every render anyway
- You're memoizing a primitive value (already cheap to compare)

## useCallback

Memoize a function so its reference stays stable across renders. Useful when passing callbacks to memoized children.

```tsx
function TaskList({ tasks, onFilter }: Props) {
  const [input, setInput] = useState('')

  // Without useCallback: new function reference each render
  // With useCallback: same reference as long as `tasks` doesn't change
  const handleSearch = useCallback(
    (query: string) => {
      const results = tasks.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase())
      )
      onFilter(results)
    },
    [tasks, onFilter]
  )

  return (
    <div>
      <SearchInput onSearch={handleSearch} />   {/* SearchInput is memo'd */}
    </div>
  )
}
```

The trio works together: `React.memo` on the child, `useCallback` for the callback prop, `useMemo` for data props. Without all three, memoization often does nothing.

## React.lazy and Suspense

Load components only when they're needed. This reduces the initial bundle size and speeds up first paint.

```tsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'

// The bundle for each page is loaded only when the route is first visited
const Home = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  )
}
```

Vite automatically splits code at dynamic `import()` boundaries. Each `lazy` import becomes a separate chunk in the build output.

### Suspense boundaries

Put `Suspense` close to the lazy component for better UX. A single top-level `Suspense` replaces the whole page with a spinner. Multiple boundaries let the shell stay visible while parts load.

```tsx
function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />   {/* loads synchronously, always visible */}
      <main>
        <Suspense fallback={<ChartSkeleton />}>
          <ExpensiveChart />
        </Suspense>
        <Suspense fallback={<TableSkeleton />}>
          <DataTable />
        </Suspense>
      </main>
    </div>
  )
}
```

## React Profiler

The React DevTools Profiler shows exactly which components rendered, why, and how long they took. Install the React Developer Tools browser extension.

1. Open DevTools, go to the Profiler tab.
2. Click Record.
3. Interact with the app (click, type, navigate).
4. Stop recording.
5. Inspect the flame chart.

What to look for:
- Components that render frequently when they shouldn't
- Components with long render times (wide bars in the flame chart)
- Components that say "Rendered because: props changed" when the prop that changed isn't one you expected

### Profiler API (programmatic)

```tsx
import { Profiler } from 'react'

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  if (actualDuration > 16) {
    console.warn(`${id} took ${actualDuration.toFixed(1)}ms on ${phase}`)
  }
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <MainContent />
    </Profiler>
  )
}
```

`actualDuration` is the time spent rendering the component and its subtree. `baseDuration` is the estimate without memoization. Large gaps between them mean memoization is working.

## Bundle analysis

See what's in your bundle:

```bash
npm install --save-dev rollup-plugin-visualizer
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }),   // opens a treemap after build
  ],
})
```

```bash
npm run build
```

The treemap shows bundle size per module. Common wins:
- Replace moment.js with date-fns (tree-shakeable)
- Lazy-load heavy chart libraries (recharts, d3)
- Move large JSON datasets out of the bundle into fetch calls

## Common performance patterns

**Virtualize long lists.** Rendering 1000 DOM nodes is always slow regardless of memoization. Use `@tanstack/react-virtual` or `react-window` to render only what's visible.

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function LongList({ items }: { items: string[] }) {
  const parentRef = React.useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
  })

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              height: virtualItem.size,
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Debounce expensive inputs.** Filter/search on a debounced value (see Part 3's `useDebounce`) rather than on every keystroke.

**Avoid state in render.** Computing derived values from state during render is fine if the computation is cheap. Expensive derivations belong in `useMemo`.

## Gotchas at this stage

- **Premature optimization.** React DevTools first, optimization second. Memoization adds code complexity; only add it when you have measured evidence of a problem.
- **`useCallback` every handler.** Wrapping every event handler in `useCallback` is cargo-culting. It only helps when the receiving child is memoized and the parent re-renders frequently.
- **Unstable context value.** A context that provides a new object on every render defeats all memoization in consumers. Memoize the context value (see Part 4).
- **`React.lazy` default export only.** `lazy(() => import('./Component'))` requires the module to use `export default`. Named exports need a wrapper: `lazy(() => import('./Component').then(m => ({ default: m.NamedComponent })))`.

## What's next

Part 10 covers production: testing with Vitest and React Testing Library, TypeScript patterns specific to React, deployment to Vercel/Netlify, and a first look at server-side rendering with Next.js.

## References

- [React, performance overview](https://react.dev/reference/react/memo)
- [React, lazy loading](https://react.dev/reference/react/lazy)
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [TanStack Virtual](https://tanstack.com/virtual/latest)
- [Web.dev, code splitting](https://web.dev/articles/code-splitting-suspense)
