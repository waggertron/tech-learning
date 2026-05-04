---
title: "Part 1, Setup and routing"
description: "npm init, installing Express, the app object, and every HTTP method handler. Route params, query strings, and sending responses with res.json, res.send, and res.status."
parent: express
tags: [express, nodejs, javascript, web, backend, beginner]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## Prerequisites

Node 22 LTS installed. Verify:

```bash
node --version   # v22.x.x
npm --version    # 10.x.x
```

## Initialize a project

```bash
mkdir my-api && cd my-api
npm init -y
npm install express
```

The `-y` flag accepts all defaults. Your `package.json` now has Express listed as a dependency.

## Your first server

Create `index.js`:

```javascript
const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, Express.');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

Run it:

```bash
node index.js
```

Hit `http://localhost:3000/` and you get back plain text.

## The `app` object

`express()` returns an application object. The key methods:

| Method | Purpose |
| --- | --- |
| `app.get(path, handler)` | Register a GET route |
| `app.post(path, handler)` | Register a POST route |
| `app.put(path, handler)` | Register a PUT route |
| `app.delete(path, handler)` | Register a DELETE route |
| `app.use(path?, middleware)` | Mount middleware (covered in Part 2) |
| `app.listen(port, callback)` | Start the HTTP server |

## Route params

Colon prefix makes a segment a named parameter:

```javascript
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ userId: id });
});
```

Multiple params in one path:

```javascript
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});
```

Test it:

```bash
curl http://localhost:3000/users/42
# {"userId":"42"}

curl http://localhost:3000/users/42/posts/7
# {"userId":"42","postId":"7"}
```

Note: params come in as strings. Parse them if you need numbers: `parseInt(req.params.id, 10)`.

## Query strings

Query strings live in `req.query`, already parsed into an object:

```javascript
app.get('/search', (req, res) => {
  const { q, page = '1', limit = '10' } = req.query;
  res.json({ query: q, page: parseInt(page, 10), limit: parseInt(limit, 10) });
});
```

```bash
curl "http://localhost:3000/search?q=express&page=2&limit=5"
# {"query":"express","page":2,"limit":5}
```

## Sending responses

Three common methods on `res`:

```javascript
// Plain text or HTML
res.send('Hello');

// JSON (sets Content-Type automatically)
res.json({ message: 'Hello' });

// Set status then send
res.status(201).json({ id: 1, name: 'Widget' });
res.status(404).json({ error: 'Not found' });
res.status(204).send(); // No content
```

Chaining works because `res.status()` returns `res`. Always call one terminal method (`send`, `json`, `end`) per request path; calling two causes a "headers already sent" error.

## All HTTP methods together

A realistic set of CRUD routes for a `widgets` resource:

```javascript
const express = require('express');

const app = express();
app.use(express.json()); // parse JSON bodies (covered fully in Part 2)

// In-memory store for this example
let widgets = [
  { id: 1, name: 'Sprocket', price: 4.99 },
  { id: 2, name: 'Cog', price: 2.49 },
];
let nextId = 3;

// GET all
app.get('/widgets', (req, res) => {
  res.json(widgets);
});

// GET one
app.get('/widgets/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const widget = widgets.find((w) => w.id === id);
  if (!widget) return res.status(404).json({ error: 'Widget not found' });
  res.json(widget);
});

// POST create
app.post('/widgets', (req, res) => {
  const { name, price } = req.body;
  const widget = { id: nextId++, name, price };
  widgets.push(widget);
  res.status(201).json(widget);
});

// PUT replace
app.put('/widgets/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = widgets.findIndex((w) => w.id === id);
  if (index === -1) return res.status(404).json({ error: 'Widget not found' });
  widgets[index] = { id, ...req.body };
  res.json(widgets[index]);
});

// DELETE
app.delete('/widgets/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const before = widgets.length;
  widgets = widgets.filter((w) => w.id !== id);
  if (widgets.length === before) return res.status(404).json({ error: 'Widget not found' });
  res.status(204).send();
});

app.listen(3000, () => console.log('Listening on 3000'));
```

## Route order matters

Express matches routes top-to-bottom. A wildcard before a specific path swallows it:

```javascript
// Bad: this catches /users/profile before the specific route below it
app.get('/users/:id', handler);
app.get('/users/profile', profileHandler); // never reached

// Good: specific routes first
app.get('/users/profile', profileHandler);
app.get('/users/:id', handler);
```

## Optional and wildcard segments

Express 4 supports optional params and wildcards:

```javascript
// Optional segment with ?
app.get('/docs/:version?', (req, res) => {
  const version = req.params.version || 'latest';
  res.json({ version });
});

// Wildcard (Express 4: *, Express 5: use {*path})
app.get('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
```

## dev workflow: nodemon

Restarting `node index.js` on every change gets old fast. Install nodemon:

```bash
npm install --save-dev nodemon
```

Add a script to `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js"
  }
}
```

```bash
npm run dev
```

The server now restarts automatically on file saves.

## Gotchas at this stage

- **Params are strings.** Always parse with `parseInt` or `parseFloat` before arithmetic or database lookups.
- **`res.json` vs `res.send`.** `res.json` coerces the argument through `JSON.stringify` and sets `Content-Type: application/json`. `res.send` with an object does the same thing, but the explicit `res.json` is clearer.
- **Double response.** Calling `res.json()` twice in one handler throws "Cannot set headers after they are sent." Use `return res.json(...)` to exit early.
- **Missing `express.json()`.** `req.body` is `undefined` without the body-parsing middleware. Part 2 covers this.
- **Port conflicts.** If 3000 is in use, change the `PORT` constant or kill the occupying process: `lsof -ti:3000 | xargs kill`.

## What's next

Part 2 covers middleware: the mechanism that runs code before your route handlers, how order affects behavior, and the built-in middleware you'll use in every project.

## References

- [Express routing guide](https://expressjs.com/en/guide/routing.html)
- [Express 4.x API, app](https://expressjs.com/en/4x/api.html#app)
- [Express 4.x API, res](https://expressjs.com/en/4x/api.html#res)

## Related topics

- [Part 2, Middleware](./part-02-middleware/)
- [Part 3, Request and response](./part-03-request-response/)
- [Part 4, REST API design](./part-04-rest-api-design/)
