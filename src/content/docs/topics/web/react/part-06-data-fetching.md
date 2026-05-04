---
title: "Part 6, Data fetching"
description: "The fetch + useEffect baseline, then TanStack Query for caching, background updates, and mutations. Loading and error states that don't require boilerplate."
parent: react
tags: [react, javascript, typescript, web, frontend, intermediate]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

Most React apps live or die by how they handle server data. This part covers the manual fetch pattern first (so you understand what libraries automate), then TanStack Query, which handles caching, deduplication, background refetching, and optimistic updates without you writing any of that yourself.

## The manual pattern

`fetch` inside `useEffect` is the baseline. Every serious app eventually outgrows it, but knowing it is prerequisite knowledge.

```tsx
import { useState, useEffect } from 'react'

interface Post {
  id: number
  title: string
  body: string
}

function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/posts', { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<Post[]>
      })
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

What this doesn't handle without extra work:
- Caching (re-fetches every mount)
- Background refetching when the tab regains focus
- Request deduplication (multiple components asking for the same data)
- Pagination and infinite scroll
- Optimistic updates

TanStack Query handles all of these.

## TanStack Query

Install:

```bash
npm install @tanstack/react-query
```

Wrap your app with `QueryClientProvider`:

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,      // data stays fresh for 1 minute
      retry: 1,                   // retry once on failure
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
```

### useQuery

```tsx
import { useQuery } from '@tanstack/react-query'

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch('/api/posts')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function PostList() {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {(error as Error).message}</p>

  return (
    <ul>
      {posts?.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

The `queryKey` uniquely identifies this query. TanStack Query uses it as a cache key. If two components call `useQuery({ queryKey: ['posts'] })`, only one request goes to the server.

### Query keys with parameters

```tsx
async function fetchPost(id: number): Promise<Post> {
  const res = await fetch(`/api/posts/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function PostDetail({ postId }: { postId: number }) {
  const { data: post, isLoading } = useQuery({
    queryKey: ['posts', postId],   // cached separately per postId
    queryFn: () => fetchPost(postId),
  })

  if (isLoading) return <p>Loading...</p>
  if (!post) return null

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  )
}
```

Changing `postId` triggers a new fetch automatically. The previous data stays in cache and is returned as `data` while the new fetch runs (controlled by `placeholderData` and `keepPreviousData` options).

### Loading and error states

TanStack Query provides granular status flags:

```tsx
const {
  data,
  isLoading,      // true only on the very first load with no cached data
  isFetching,     // true any time a request is in-flight (including background refetches)
  isError,
  error,
  isSuccess,
  status,         // 'pending' | 'error' | 'success'
  fetchStatus,    // 'fetching' | 'paused' | 'idle'
} = useQuery({ queryKey: ['posts'], queryFn: fetchPosts })
```

Show a subtle loading indicator when refetching in the background, but don't replace the content:

```tsx
function PostList() {
  const { data: posts, isLoading, isFetching, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {(error as Error).message}</p>

  return (
    <div>
      {isFetching && <span>Refreshing...</span>}
      <ul>
        {posts?.map(post => <li key={post.id}>{post.title}</li>)}
      </ul>
    </div>
  )
}
```

## Mutations

`useMutation` handles writes: POST, PUT, PATCH, DELETE.

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

async function createPost(newPost: Omit<Post, 'id'>): Promise<Post> {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function NewPostForm() {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: (newPost) => {
      // Option 1: invalidate the cache so the list re-fetches
      queryClient.invalidateQueries({ queryKey: ['posts'] })

      // Option 2: update the cache directly (faster, no extra request)
      queryClient.setQueryData<Post[]>(['posts'], old =>
        old ? [...old, newPost] : [newPost]
      )
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ title, body })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Body" />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Create Post'}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
      {mutation.isSuccess && <p>Post created!</p>}
    </form>
  )
}
```

### Optimistic updates

Update the UI immediately before the server confirms, then roll back on error:

```tsx
const mutation = useMutation({
  mutationFn: (id: number) => fetch(`/api/posts/${id}`, { method: 'DELETE' }),
  onMutate: async (id) => {
    // cancel any in-flight fetches for this query
    await queryClient.cancelQueries({ queryKey: ['posts'] })

    // snapshot the previous value for rollback
    const previous = queryClient.getQueryData<Post[]>(['posts'])

    // optimistically update the cache
    queryClient.setQueryData<Post[]>(['posts'], old =>
      old?.filter(post => post.id !== id) ?? []
    )

    return { previous }
  },
  onError: (_err, _id, context) => {
    // roll back on error
    if (context?.previous) {
      queryClient.setQueryData(['posts'], context.previous)
    }
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  },
})
```

## Pagination

```tsx
function PaginatedList() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['posts', 'page', page],
    queryFn: () => fetch(`/api/posts?page=${page}&limit=10`).then(r => r.json()),
    placeholderData: keepPreviousData,   // show old data while fetching new page
  })

  return (
    <div>
      {isLoading ? <p>Loading...</p> : (
        <ul>
          {data?.items?.map((post: Post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
      <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
        Previous
      </button>
      <span>Page {page}</span>
      <button onClick={() => setPage(p => p + 1)} disabled={!data?.hasNext}>
        Next
      </button>
      {isFetching && <span>Loading next page...</span>}
    </div>
  )
}
```

## DevTools

Install the TanStack Query devtools for a visual cache inspector:

```bash
npm install @tanstack/react-query-devtools
```

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Inside QueryClientProvider:
<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

The devtools panel shows every query, its status, data, and when it was last fetched. Invaluable for debugging cache behavior.

## Gotchas at this stage

- **`queryKey` must be serializable.** Arrays of strings, numbers, and plain objects. No class instances or functions.
- **`staleTime` vs `gcTime`.** `staleTime` controls how long data is considered fresh (no background refetch). `gcTime` (formerly `cacheTime`) controls how long unused data stays in the cache. You usually want `staleTime` between 30 seconds and 5 minutes, `gcTime` longer.
- **The `queryFn` must throw on error.** TanStack Query treats a rejected promise as an error. If your function swallows errors and returns `null`, the query stays in `success` state with no data.
- **Don't mutate cache data directly.** Use `setQueryData` with an updater function that returns a new object. Mutating the cached object in place causes React not to re-render.

## What's next

Part 7 covers global state management: Zustand for simple cases, Redux Toolkit for larger apps, and the heuristic for when you actually need either.

## References

- [TanStack Query, overview](https://tanstack.com/query/latest/docs/framework/react/overview)
- [TanStack Query, useQuery reference](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)
- [TanStack Query, useMutation reference](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)
- [TanStack Query, optimistic updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
