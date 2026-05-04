---
title: "Part 10, Production"
description: "Testing with Vitest and React Testing Library, TypeScript patterns specific to React, deployment to Vercel and Netlify, and a first look at server-side rendering with Next.js."
parent: react
tags: [react, javascript, typescript, web, frontend, advanced]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

Getting a React app to production involves more than writing features. This part covers testing (the discipline that keeps refactors safe), TypeScript patterns that matter specifically in React, deployment options, and Next.js for server-side rendering.

## Testing with Vitest and React Testing Library

Vitest is a Vite-native test runner that shares your Vite config. React Testing Library (RTL) renders components and lets you query them the way a user would.

```bash
npm install --save-dev vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Configure Vitest in `vite.config.ts`:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

```ts
// src/test/setup.ts
import '@testing-library/jest-dom'
```

Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

### Testing a component

```tsx
// src/components/Counter.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Counter from './Counter'

describe('Counter', () => {
  it('starts at zero', () => {
    render(<Counter />)
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })

  it('increments on button click', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    await user.click(screen.getByRole('button', { name: 'Increment' }))

    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })

  it('decrements on button click', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    await user.click(screen.getByRole('button', { name: 'Increment' }))
    await user.click(screen.getByRole('button', { name: 'Decrement' }))

    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })
})
```

`screen.getByRole` queries by ARIA role (button, heading, textbox, etc.). This tests what users see, not implementation details. If you rename a state variable, the tests still pass. If you change text that users read, the tests catch it.

### Testing async components

```tsx
// src/components/UserList.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import UserList from './UserList'

// Mock the fetch call
vi.mock('../api/users', () => ({
  fetchUsers: vi.fn().mockResolvedValue([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]),
}))

describe('UserList', () => {
  it('shows loading state initially', () => {
    render(<UserList />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders users after load', async () => {
    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })
  })
})
```

### Testing with React Query

Wrap components that use `useQuery` with a test `QueryClientProvider`:

```tsx
// src/test/test-utils.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },    // don't retry in tests
    },
  })
}

function TestProviders({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: TestProviders, ...options })
}
```

```tsx
import { renderWithProviders } from '../test/test-utils'

it('renders post list', async () => {
  renderWithProviders(<PostList />)
  await waitFor(() => expect(screen.getByText('My first post')).toBeInTheDocument())
})
```

### Testing forms

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from './LoginForm'

describe('LoginForm', () => {
  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('calls onSubmit with form data', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<LoginForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })
})
```

## TypeScript patterns in React

### Generic components

```tsx
interface SelectProps<T> {
  options: T[]
  value: T | null
  onChange: (value: T) => void
  getLabel: (option: T) => string
  getValue: (option: T) => string | number
}

function Select<T>({ options, value, onChange, getLabel, getValue }: SelectProps<T>) {
  return (
    <select
      value={value ? String(getValue(value)) : ''}
      onChange={e => {
        const selected = options.find(o => String(getValue(o)) === e.target.value)
        if (selected) onChange(selected)
      }}
    >
      {options.map(option => (
        <option key={String(getValue(option))} value={String(getValue(option))}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  )
}

// Usage
<Select
  options={users}
  value={selectedUser}
  onChange={setSelectedUser}
  getLabel={u => u.name}
  getValue={u => u.id}
/>
```

### ComponentPropsWithRef and extending HTML elements

```tsx
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...rest }, ref) => {
    return (
      <div>
        <label>{label}</label>
        <input
          ref={ref}
          className={[className, error ? 'input--error' : ''].filter(Boolean).join(' ')}
          aria-invalid={!!error}
          {...rest}
        />
        {error && <p role="alert">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
```

Spreading `InputHTMLAttributes` means the component accepts all native input props (`type`, `disabled`, `autoComplete`, etc.) without explicitly listing them.

### Discriminated union props

```tsx
type ButtonProps =
  | { variant: 'primary'; onClick: () => void; href?: never }
  | { variant: 'link'; href: string; onClick?: never }

function Button({ variant, ...rest }: ButtonProps) {
  if (variant === 'link') {
    return <a href={(rest as { href: string }).href}>...</a>
  }
  return <button onClick={(rest as { onClick: () => void }).onClick}>...</button>
}

// TypeScript enforces: href required for 'link', onClick required for 'primary'
<Button variant="link" href="/about" />
<Button variant="primary" onClick={handleClick} />
```

### Event handler types

```tsx
// Prefer these over React.SyntheticEvent for precision
type ClickHandler = React.MouseEventHandler<HTMLButtonElement>
type ChangeHandler = React.ChangeEventHandler<HTMLInputElement>
type SubmitHandler = React.FormEventHandler<HTMLFormElement>

function Form() {
  const handleSubmit: SubmitHandler = (e) => {
    e.preventDefault()
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

## Deployment

### Vite build output

```bash
npm run build
```

Outputs to `dist/`. It's a static site: `index.html` plus hashed JS/CSS chunks. Any static host works.

### Vercel

Vercel is the easiest deployment path for Vite apps:

```bash
npm install --global vercel
vercel
```

Follow the prompts. Vercel detects Vite automatically and configures build and output settings. Every push to the main branch deploys automatically. Pull requests get preview URLs.

For SPAs, configure redirects so the server returns `index.html` for all paths:

Create `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Netlify

Netlify works the same way. Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Connect your GitHub repo in the Netlify dashboard. Done.

### Environment variables

Use `.env.local` for local secrets (never commit it):

```bash
# .env.local
VITE_API_URL=http://localhost:3000
VITE_STRIPE_KEY=pk_test_...
```

Vite exposes only variables prefixed with `VITE_` to the client bundle (for security):

```tsx
const apiUrl = import.meta.env.VITE_API_URL
```

Set production values in the Vercel/Netlify dashboard under Environment Variables.

## Server-side rendering with Next.js

Vite + React is a client-side rendered (CSR) app: the server sends a nearly empty HTML shell, the browser downloads JS, and React builds the page. CSR has drawbacks for SEO and first-paint performance.

Next.js wraps React with a file-based router and builds output for both server and client. Pages are pre-rendered on the server (HTML arrives with content already in it).

### Create a Next.js project

```bash
npx create-next-app@latest my-next-app --typescript --app
cd my-next-app
npm run dev
```

The `--app` flag uses the App Router (the modern approach since Next.js 13).

### App Router basics

```
app/
├── layout.tsx       # root layout (replaces _app.tsx)
├── page.tsx         # home route (/)
├── about/
│   └── page.tsx     # /about
└── users/
    ├── page.tsx     # /users
    └── [id]/
        └── page.tsx # /users/[id]
```

Server components by default: fetch data directly without useEffect or TanStack Query:

```tsx
// app/users/[id]/page.tsx (Server Component)
interface User { id: number; name: string }

async function UserPage({ params }: { params: { id: string } }) {
  const user: User = await fetch(`https://api.example.com/users/${params.id}`, {
    next: { revalidate: 60 },   // cache for 60 seconds
  }).then(r => r.json())

  return (
    <div>
      <h1>{user.name}</h1>
    </div>
  )
}

export default UserPage
```

The `fetch` runs on the server. The browser receives complete HTML. No waterfall, no loading spinner.

### Client components

Mark components with `'use client'` when they need `useState`, `useEffect`, or browser APIs:

```tsx
'use client'

import { useState } from 'react'

export function ToggleButton() {
  const [open, setOpen] = useState(false)
  return <button onClick={() => setOpen(!open)}>{open ? 'Close' : 'Open'}</button>
}
```

The hybrid: server components for data, client components for interactivity. Import client components into server components; the server renders the shell and the client hydrates the interactive parts.

### When to use Next.js vs Vite + React

| Use Vite + React when | Use Next.js when |
| --- | --- |
| App is behind a login (SEO doesn't matter) | Public-facing pages need good SEO |
| Team is small and wants simplicity | First-paint performance is critical |
| You control your deployment entirely | You want built-in image optimization, ISR, edge functions |
| No server-rendering requirements | You want a full-stack React framework |

## Gotchas at production time

- **Missing `VITE_` prefix.** `import.meta.env.MY_SECRET` is `undefined`. Vite strips non-prefixed vars from the bundle intentionally.
- **SPA redirect config.** Without the redirect rule, visiting `/dashboard` directly returns a 404 from the CDN. The `vercel.json` or `netlify.toml` rewrite is not optional.
- **`window` undefined in Next.js.** Server components and SSR run in Node, which has no `window`. Access `window` only inside `useEffect` or inside a `'use client'` component.
- **Test environment vs browser environment.** `jsdom` in Vitest doesn't support `ResizeObserver`, `IntersectionObserver`, or some CSS APIs. Mock them in `setup.ts` when components use them.

## Related topics

- [Testing](../../testing/tdd/), TDD principles applied to React component tests
- [Django, a 10-part series](../django/), the backend that the frontend talks to

## References

- [Vitest documentation](https://vitest.dev/guide/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js, App Router docs](https://nextjs.org/docs/app)
- [Vercel, deploying Vite](https://vercel.com/docs/frameworks/vite)
- [Netlify, Vite deployment](https://docs.netlify.com/frameworks/vite/)
