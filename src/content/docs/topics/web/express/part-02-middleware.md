---
title: "Part 2: Middleware"
description: "The middleware concept, app.use(), execution order, express.json(), morgan for logging, writing custom middleware, and the next() function."
parent: express
tags: [express, nodejs, javascript, web, backend, middleware]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## What middleware is

Middleware is a function with the signature `(req, res, next)`. Express runs middleware functions in the order they are registered, passing control from one to the next via `next()`. Every route handler is itself middleware.

The chain looks like this:

```
HTTP request
    |
    v
middleware 1  (logging)
    |
    v
middleware 2  (JSON body parsing)
    |
    v
middleware 3  (auth check)
    |
    v
route handler  (res.json(...))
    |
    v
HTTP response
```

If a middleware does not call `next()`, the chain stops there. If it does not send a response either, the client hangs.

## app.use()

`app.use()` registers middleware. Without a path, it runs on every request:

```javascript
const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // pass to the next middleware or route
});

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(3000);
```

With a path prefix, it only runs when the path matches:

```javascript
app.use('/admin', (req, res, next) => {
  console.log('Admin request');
  next();
});
```

## Order matters

This is the single most important fact about Express middleware. Register in this order:

1. Request parsing (body, cookies)
2. Logging
3. Security headers
4. Auth
5. Routes
6. 404 handler
7. Error handler

```javascript
const express = require('express');
const app = express();

// 1. Parse JSON bodies
app.use(express.json());

// 2. Log every request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// 3. Routes
app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }]);
});

// 4. 404 catch-all (must be after routes)
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(3000);
```

If you put the 404 handler before the routes, every request returns 404.

## Built-in middleware

Express ships with three built-in middleware functions:

### express.json()

Parses incoming requests with `Content-Type: application/json` and populates `req.body`:

```javascript
app.use(express.json());

app.post('/echo', (req, res) => {
  res.json(req.body); // whatever JSON the client sent
});
```

Without this, `req.body` is `undefined`.

Options worth knowing:

```javascript
app.use(express.json({ limit: '1mb' })); // reject bodies larger than 1 MB
```

### express.urlencoded()

Parses HTML form submissions (`Content-Type: application/x-www-form-urlencoded`):

```javascript
app.use(express.urlencoded({ extended: true }));
```

`extended: true` uses the `qs` library for richer parsing (nested objects). `extended: false` uses the built-in `querystring` module.

### express.static()

Serves static files from a directory:

```javascript
app.use(express.static('public'));
// Files in ./public/ are served at /
// ./public/logo.png is available at /logo.png
```

## morgan: HTTP request logging

Morgan is the standard logging middleware for Express. Install it:

```bash
npm install morgan
```

```javascript
const morgan = require('morgan');

// 'dev' format: colored output, method, url, status, response time
app.use(morgan('dev'));

// 'combined' format: Apache combined log format, good for production
app.use(morgan('combined'));
```

Morgan output example (dev):

```
GET /users 200 4.123 ms - 42
POST /users 201 6.891 ms - 58
GET /users/999 404 1.234 ms - 26
```

Custom format with a token:

```javascript
morgan.token('user-id', (req) => req.user?.id || 'anonymous');

app.use(morgan(':method :url :status :response-time ms - user=:user-id'));
```

## Writing custom middleware

Any function with `(req, res, next)` signature is middleware. Pattern for a reusable piece:

```javascript
// middleware/requestId.js
const { randomUUID } = require('crypto');

function requestId(req, res, next) {
  req.id = randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
}

module.exports = requestId;
```

```javascript
// index.js
const requestId = require('./middleware/requestId');

app.use(requestId);

app.get('/', (req, res) => {
  res.json({ requestId: req.id }); // set by middleware
});
```

This pattern: attach something to `req`, set a response header, call `next()`.

## next() and the three ways to call it

```javascript
// 1. Pass to the next middleware or matching route
next();

// 2. Pass to the error handler (skips remaining middleware and routes)
next(new Error('Something broke'));

// 3. Pass to the next route (same path, different handler) - rare
next('route');
```

Calling `next(err)` skips all remaining non-error middleware and jumps to the error handler. Error handlers have 4 arguments: `(err, req, res, next)`. Part 7 covers them in depth.

## Middleware scope: app-level vs router-level

App-level middleware runs for all routes on `app`:

```javascript
app.use(express.json());
```

Router-level middleware runs only for routes on a specific router:

```javascript
const router = express.Router();

router.use((req, res, next) => {
  console.log('Router-scoped middleware');
  next();
});

router.get('/items', (req, res) => res.json([]));

app.use('/api', router);
```

Router-level middleware is the key to scoping auth to only protected routes.

## Practical example: auth middleware

A realistic auth check that short-circuits the chain when no token is present:

```javascript
// middleware/requireAuth.js
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }
  // Token is present; verification covered in Part 5
  req.token = authHeader.slice(7);
  next();
}

module.exports = requireAuth;
```

Apply it selectively:

```javascript
const requireAuth = require('./middleware/requireAuth');

app.get('/public', (req, res) => res.json({ ok: true }));

// requireAuth only guards this route
app.get('/private', requireAuth, (req, res) => {
  res.json({ secret: 'data', token: req.token });
});
```

Or guard an entire router:

```javascript
const apiRouter = express.Router();
apiRouter.use(requireAuth); // all routes under /api require auth

apiRouter.get('/profile', (req, res) => res.json({ user: 'me' }));

app.use('/api', apiRouter);
```

## Gotchas

- **Forgetting `next()`.** If your middleware doesn't call `next()` and doesn't send a response, the request hangs until the client times out.
- **`express.json()` position.** It must come before any route that reads `req.body`. Putting it after routes means body is always `undefined` for those routes.
- **`return next()`.** Always `return next()` when you want to stop executing the current function after passing control. Without `return`, code after `next()` runs, which can double-call `next()`.
- **Error middleware signature.** Express identifies error middleware by its 4-argument signature `(err, req, res, next)`. Using only 3 arguments means it's treated as normal middleware and errors pass through it.
- **Morgan in tests.** Morgan writes to stdout. Disable it in test environments: `if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));`

## What's next

Part 3 digs into `req` and `res` in detail: every property you'll actually use, content negotiation, and response chaining patterns.

## References

- [Express, Using middleware](https://expressjs.com/en/guide/using-middleware.html)
- [Morgan on npm](https://www.npmjs.com/package/morgan)
- [Express 4.x API, req](https://expressjs.com/en/4x/api.html#req)

## Related topics

- [Part 1, Setup and routing](./part-01-setup-and-routing/)
- [Part 3, Request and response](./part-03-request-response/)
- [Part 7, Validation and error handling](./part-07-validation-and-errors/)
