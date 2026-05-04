---
title: "Part 5: Routing"
description: "React Router v7: defining routes, nested layouts, data loaders, navigation, and protected routes. The modern file-based and config-based approaches side by side."
parent: react
tags: [react, javascript, typescript, web, frontend, intermediate]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

Single-page apps need a router to map URLs to components without a full page reload. React Router v7 is the standard choice. This part covers the config-based API (the most explicit and debuggable approach), nested routes for shared layouts, loaders for pre-fetching data, and how to lock routes behind auth.

## Install

```bash
npm install react-router
```

React Router v7 ships as a single `react-router` package (the v6 `react-router-dom` split is gone).

## Basic setup

Define a router in `main.tsx` and render it:

```tsx
// main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

import Root from './routes/Root'
import Home from './routes/Home'
import About from './routes/About'
import NotFound from './routes/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,       // layout component
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
    ],
    errorElement: <NotFound />,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
```

## Root layout with Outlet

The root route renders a persistent layout. `<Outlet />` is where child routes render.

```tsx
// routes/Root.tsx
import { Outlet, NavLink } from 'react-router'

function Root() {
  return (
    <div>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Root
```

`NavLink` automatically adds an `active` class when its `to` matches the current URL. The `end` prop on the root link prevents it from matching every route that starts with `/`.

## Route parameters

Define dynamic segments with `:paramName`:

```tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: 'users', element: <UserList /> },
      { path: 'users/:userId', element: <UserDetail /> },
    ],
  },
])
```

Read the parameter with `useParams`:

```tsx
// routes/UserDetail.tsx
import { useParams } from 'react-router'

function UserDetail() {
  const { userId } = useParams<{ userId: string }>()

  return <p>Showing user {userId}</p>
}
```

## Loaders: data before render

React Router v7 supports loaders: async functions that fetch data before the route component renders. No loading spinners needed for initial data.

```tsx
// routes/UserDetail.tsx
import { useLoaderData, type LoaderFunctionArgs } from 'react-router'

interface User {
  id: number
  name: string
  email: string
}

export async function loader({ params }: LoaderFunctionArgs): Promise<User> {
  const res = await fetch(`/api/users/${params.userId}`)
  if (!res.ok) throw new Response('User not found', { status: 404 })
  return res.json()
}

function UserDetail() {
  const user = useLoaderData() as User

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}

export default UserDetail
```

Wire the loader into the route config:

```tsx
import UserDetail, { loader as userLoader } from './routes/UserDetail'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: 'users/:userId', element: <UserDetail />, loader: userLoader },
    ],
  },
])
```

Loader errors are caught by the nearest `errorElement`. The 404 `throw new Response(...)` renders the error element automatically.

## Navigation

### Link and NavLink

```tsx
import { Link, NavLink } from 'react-router'

function Nav() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/users/42">User 42</Link>
      <NavLink
        to="/about"
        style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
      >
        About
      </NavLink>
    </nav>
  )
}
```

### Programmatic navigation

```tsx
import { useNavigate } from 'react-router'

function LoginForm() {
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(credentials)
    navigate('/dashboard')         // go to dashboard after login
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

`navigate(-1)` goes back, `navigate(1)` goes forward. `navigate('/path', { replace: true })` replaces instead of pushing (useful for redirects).

### useLocation and useSearchParams

```tsx
import { useLocation, useSearchParams } from 'react-router'

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  return (
    <input
      value={query}
      onChange={e => setSearchParams({ q: e.target.value })}
      placeholder="Search..."
    />
  )
}

// URL updates to /search?q=react as the user types
```

## Nested routes and shared layouts

Nest routes to share a layout among a group of related pages:

```tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'dashboard',
        element: <DashboardLayout />,   // second-level layout
        children: [
          { index: true, element: <DashboardHome /> },
          { path: 'settings', element: <Settings /> },
          { path: 'profile', element: <Profile /> },
        ],
      },
    ],
  },
])
```

```tsx
// routes/DashboardLayout.tsx
import { Outlet, NavLink } from 'react-router'

function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside>
        <NavLink to="/dashboard">Overview</NavLink>
        <NavLink to="/dashboard/settings">Settings</NavLink>
        <NavLink to="/dashboard/profile">Profile</NavLink>
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  )
}
```

The root `Root` renders the top nav. `DashboardLayout` renders the sidebar. The actual page (e.g., `Settings`) renders in the inner `Outlet`. Each layer is only concerned with its own layout.

## Protected routes

Redirect unauthenticated users by checking auth state in a wrapper component:

```tsx
// components/RequireAuth.tsx
import { Navigate, useLocation, Outlet } from 'react-router'
import { useAuth } from '../auth-context'

function RequireAuth() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // save the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default RequireAuth
```

Wrap protected routes:

```tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      {
        element: <RequireAuth />,   // no path, just wraps children
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'profile', element: <Profile /> },
        ],
      },
    ],
  },
])
```

After login, redirect back to the original destination:

```tsx
// routes/Login.tsx
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from '../auth-context'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard'

  const handleLogin = async () => {
    await login()
    navigate(from, { replace: true })
  }

  return <button onClick={handleLogin}>Log in</button>
}
```

## Gotchas at this stage

- **`index: true` vs `path: ''`.** An index route renders when the parent path matches exactly. `path: ''` would render on any sub-path too. Use `index: true` for the default child.
- **Loader `throw` vs `return`.** Throwing from a loader (especially `throw new Response(...)`) hands control to the `errorElement`. Returning data (even `null`) renders the component normally.
- **`<Link>` vs `<a>`.** Always use `<Link>` from react-router for internal navigation. Native `<a href>` causes full page reloads and loses all client-side state.
- **Hash router vs browser router.** `createBrowserRouter` uses the History API and requires server config to redirect all paths to `index.html`. `createHashRouter` uses `/#/path` and works with static file hosts without config. Use browser router for apps with a proper server.

## What's next

Part 6 covers data fetching: the fetch + useEffect pattern, TanStack Query (React Query) for caching and background updates, and how to handle loading and error states without boilerplate.

## References

- [React Router, tutorial](https://reactrouter.com/tutorials/address-book)
- [React Router, route loaders](https://reactrouter.com/start/library/data-loading)
- [React Router, createBrowserRouter](https://reactrouter.com/api/createBrowserRouter)
