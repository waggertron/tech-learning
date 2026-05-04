---
title: "Part 7: State management"
description: "Zustand for lightweight global state, Redux Toolkit for larger apps. The heuristic for when you actually need either, and how slices and actions work."
parent: react
tags: [react, javascript, typescript, web, frontend, intermediate]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

Most React apps don't need a global state library. Context handles infrequently-changing shared values (theme, user). TanStack Query handles server data. The gap that libraries like Zustand and Redux Toolkit fill is client-side UI state that is genuinely global and changes frequently: shopping carts, notification queues, multi-step wizard progress, collaborative editing buffers.

## When you actually need global state

Ask these questions before reaching for a library:

1. Is the state server-fetched? Use TanStack Query, not a store.
2. Does only one component need it? Keep it local with `useState`.
3. Do only a few components need it and they share a close ancestor? Lift state up or use Context.
4. Is the state truly shared across distant, unrelated parts of the app? Now a store makes sense.

## Zustand

Zustand is a small (1 KB) state library with a simple API: create a store with a function, use the store in any component with a selector hook.

```bash
npm install zustand
```

### Basic store

```tsx
// stores/counter-store.ts
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  setCount: (n: number) => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  setCount: (n) => set({ count: n }),
}))
```

Use it in any component. No provider needed:

```tsx
import { useCounterStore } from './stores/counter-store'

function Counter() {
  const count = useCounterStore(state => state.count)
  const increment = useCounterStore(state => state.increment)
  const reset = useCounterStore(state => state.reset)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}

// Completely separate component, same store
function CountDisplay() {
  const count = useCounterStore(state => state.count)
  return <h2>Current: {count}</h2>
}
```

### Selective subscriptions

Pass a selector to subscribe only to the part of state you need. The component re-renders only when that slice changes:

```tsx
// Only re-renders when count changes, not when other store fields change
const count = useCounterStore(state => state.count)

// Only subscribes to the action (actions never change, so this component never re-renders)
const increment = useCounterStore(state => state.increment)
```

### A real store: shopping cart

```tsx
// stores/cart-store.ts
import { create } from 'zustand'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  totalPrice: () => number
  totalItems: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => set(state => {
    const existing = state.items.find(i => i.id === item.id)
    if (existing) {
      return {
        items: state.items.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }
    }
    return { items: [...state.items, { ...item, quantity: 1 }] }
  }),

  removeItem: (id) => set(state => ({
    items: state.items.filter(i => i.id !== id),
  })),

  updateQuantity: (id, quantity) => set(state => ({
    items: quantity <= 0
      ? state.items.filter(i => i.id !== id)
      : state.items.map(i => i.id === id ? { ...i, quantity } : i),
  })),

  clearCart: () => set({ items: [] }),

  totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}))
```

```tsx
// CartIcon.tsx
function CartIcon() {
  const totalItems = useCartStore(state => state.totalItems())
  return <span>Cart ({totalItems})</span>
}

// ProductCard.tsx
function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(state => state.addItem)
  return (
    <div>
      <p>{product.name} - ${product.price}</p>
      <button onClick={() => addItem(product)}>Add to cart</button>
    </div>
  )
}
```

### Persisting to localStorage

Zustand has a built-in `persist` middleware:

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // ... same store as above
    }),
    { name: 'cart-storage' }   // localStorage key
  )
)
```

Cart state now survives page refreshes automatically.

## Redux Toolkit

Redux Toolkit (RTK) is the official opinionated Redux setup. It eliminates the boilerplate of classic Redux (action type constants, action creators, hand-written reducers) while keeping the predictable state container and DevTools.

```bash
npm install @reduxjs/toolkit react-redux
```

### Store setup

```tsx
// store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

```tsx
// main.tsx
import { Provider } from 'react-redux'
import { store } from './store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)
```

### Slices

A slice is a piece of state with its reducer and actions defined together:

```tsx
// store/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = { items: [] }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Omit<CartItem, 'quantity'>>) {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        existing.quantity += 1   // Immer handles the mutation safely
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    updateQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        state.items = state.items.filter(i => i.id !== id)
      } else {
        const item = state.items.find(i => i.id === id)
        if (item) item.quantity = quantity
      }
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
```

RTK uses Immer under the hood: you can write "mutating" code inside reducers and Immer converts it to safe immutable updates.

### Typed hooks

Create typed `useAppSelector` and `useAppDispatch` wrappers once, use them everywhere:

```tsx
// store/hooks.ts
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

```tsx
// CartIcon.tsx
import { useAppSelector } from '../store/hooks'

function CartIcon() {
  const totalItems = useAppSelector(state =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  )
  return <span>Cart ({totalItems})</span>
}
```

```tsx
// ProductCard.tsx
import { useAppDispatch } from '../store/hooks'
import { addItem } from '../store/cartSlice'

function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch()
  return (
    <button onClick={() => dispatch(addItem(product))}>
      Add {product.name}
    </button>
  )
}
```

### Async thunks

RTK's `createAsyncThunk` handles async operations (API calls) with automatic pending/fulfilled/rejected action types:

```tsx
// store/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface User { id: number; name: string }
interface UserState { user: User | null; loading: boolean; error: string | null }

export const fetchUser = createAsyncThunk(
  'user/fetchById',
  async (userId: number) => {
    const res = await fetch(`/api/users/${userId}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json() as Promise<User>
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, loading: false, error: null } as UserState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unknown error'
        state.loading = false
      })
  },
})

export default userSlice.reducer
```

## Zustand vs Redux Toolkit

| Factor | Zustand | Redux Toolkit |
| --- | --- | --- |
| Bundle size | ~1 KB | ~12 KB |
| Boilerplate | Very low | Low (vs classic Redux) |
| DevTools | Optional | Built-in, excellent |
| Team familiarity | Growing | Very widespread |
| Time-travel debugging | No | Yes |
| Best for | Small-medium apps | Large teams, complex flows |

For a new project with a small team, start with Zustand. If you need Redux DevTools, time-travel debugging, or are joining a team already on Redux, use RTK.

## Gotchas at this stage

- **Zustand selectors returning new objects.** `state => ({ a: state.a, b: state.b })` creates a new object every render. Use separate selectors or the `shallow` equality function from Zustand.
- **RTK and serialization.** Redux warns if you put non-serializable values (class instances, Dates, functions) in the store. Store date strings, not `Date` objects.
- **Don't put server state in the store.** Fetched data in a Redux or Zustand store means you're building a manual cache. Use TanStack Query for that instead.
- **Immer pitfall: returning AND mutating.** In an RTK reducer, either mutate `state` OR return a new value. Doing both throws an error.

## What's next

Part 8 covers forms: controlled patterns, React Hook Form for complex validation, and Zod for schema-based type-safe validation.

## References

- [Zustand documentation](https://zustand.docs.pmnd.rs/)
- [Redux Toolkit, quick start](https://redux-toolkit.js.org/tutorials/quick-start)
- [Redux Toolkit, TypeScript quick start](https://redux-toolkit.js.org/tutorials/typescript)
- [RTK, createSlice](https://redux-toolkit.js.org/api/createSlice)
