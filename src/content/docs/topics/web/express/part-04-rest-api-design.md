---
title: "Part 4, REST API design"
description: "Resource-based routes, splitting into router files, Express Router, API versioning with /api/v1/, CORS setup, and helmet for security headers."
parent: express
tags: [express, nodejs, javascript, web, backend, rest, api]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## REST in one paragraph

REST (Representational State Transfer) structures APIs around resources (nouns) rather than actions (verbs). A resource is anything the client cares about: users, orders, products. The HTTP method carries the action:

| Method | Action | Example |
| --- | --- | --- |
| GET | Read | `GET /users/42` |
| POST | Create | `POST /users` |
| PUT | Replace | `PUT /users/42` |
| PATCH | Partial update | `PATCH /users/42` |
| DELETE | Remove | `DELETE /users/42` |

The URL identifies the resource. The method says what to do with it.

## Resource-based route naming

Good:

```
GET    /users           list users
POST   /users           create a user
GET    /users/:id       get one user
PUT    /users/:id       replace a user
PATCH  /users/:id       update fields on a user
DELETE /users/:id       delete a user
```

Nested resources (when one resource belongs to another):

```
GET  /users/:userId/orders        list orders for a user
POST /users/:userId/orders        create an order for a user
GET  /users/:userId/orders/:id    get one order for a user
```

Avoid nesting more than two levels deep. It becomes unreadable and the IDs at each level often imply redundant lookups.

Bad patterns to avoid:

```
POST /createUser        (verb in the URL)
GET  /getUserById?id=1  (action in URL, resource in query)
GET  /user              (singular; use plural for collections)
```

## Express Router

`express.Router()` creates a mini-app with its own middleware and routes. Use it to split a large `index.js` into focused files.

Directory structure:

```
src/
  routes/
    users.js
    orders.js
  index.js
```

**`src/routes/users.js`**

```javascript
const express = require('express');

const router = express.Router();

// All routes here are relative to wherever the router is mounted
router.get('/', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }]);
});

router.get('/:id', (req, res) => {
  res.json({ id: parseInt(req.params.id, 10), name: 'Alice' });
});

router.post('/', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ id: 2, name, email });
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  res.json({ id, ...req.body });
});

router.delete('/:id', (req, res) => {
  res.status(204).send();
});

module.exports = router;
```

**`src/routes/orders.js`**

```javascript
const express = require('express');

const router = express.Router({ mergeParams: true });
// mergeParams: true is required to access :userId from the parent router

router.get('/', (req, res) => {
  const { userId } = req.params;
  res.json({ userId, orders: [] });
});

router.post('/', (req, res) => {
  const { userId } = req.params;
  res.status(201).json({ userId, orderId: 101, ...req.body });
});

module.exports = router;
```

**`src/index.js`**

```javascript
const express = require('express');
const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');

const app = express();
app.use(express.json());

// Mount routers
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/users/:userId/orders', ordersRouter);

app.listen(3000, () => console.log('API running on 3000'));
```

Requests now route like this:

```
GET /api/v1/users          -> usersRouter GET /
GET /api/v1/users/42       -> usersRouter GET /:id
GET /api/v1/users/42/orders -> ordersRouter GET /
```

## API versioning

Prefix all routes with `/api/v1/`. When you introduce breaking changes, add `/api/v2/` and run both in parallel until clients migrate.

```javascript
const v1Router = require('./routes/v1');
const v2Router = require('./routes/v2');

app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);
```

Version in the URL path is the most common approach for REST APIs. Alternatives (version in header, in query string) exist but are less discoverable.

## CORS

Browsers block cross-origin requests by default. Install the `cors` package:

```bash
npm install cors
```

Permissive setup (fine for public APIs):

```javascript
const cors = require('cors');
app.use(cors());
```

Restrictive setup (better for most production APIs):

```javascript
const cors = require('cors');

const corsOptions = {
  origin: ['https://app.example.com', 'https://www.example.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,       // allow cookies across origins
  maxAge: 86400,           // preflight result cached for 24h
};

app.use(cors(corsOptions));
```

Per-route CORS (if some routes need different rules):

```javascript
app.get('/public', cors(), (req, res) => {
  res.json({ public: true });
});

app.post('/private', cors(corsOptions), (req, res) => {
  res.json({ private: true });
});
```

Handle preflight requests explicitly (needed when using `credentials: true`):

```javascript
app.options('*', cors(corsOptions));
```

## helmet: security headers

`helmet` sets HTTP response headers that defend against common web vulnerabilities:

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

What `helmet()` sets by default:

| Header | What it does |
| --- | --- |
| `Content-Security-Policy` | Restricts sources for scripts, styles, images |
| `X-Content-Type-Options: nosniff` | Prevents MIME-type sniffing |
| `X-Frame-Options: SAMEORIGIN` | Blocks clickjacking via iframes |
| `Strict-Transport-Security` | Forces HTTPS (HSTS) |
| `X-XSS-Protection: 0` | Disables browser XSS auditor (it's counterproductive) |
| `Referrer-Policy` | Controls Referer header leakage |

Customize individual headers:

```javascript
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'cdn.example.com'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);
```

For pure JSON APIs you often want a looser CSP or none at all:

```javascript
app.use(helmet({ contentSecurityPolicy: false }));
```

## Putting it together

A realistic API entry point:

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));

// Parsing
app.use(express.json({ limit: '512kb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/users/:userId/orders', ordersRouter);

// Health check (no auth, no versioning)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

module.exports = app; // export for testing
```

**`server.js`** (kept separate so tests can import `app` without binding a port):

```javascript
const app = require('./app');

const PORT = parseInt(process.env.PORT, 10) || 3000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
```

## Pagination conventions

Consistent pagination makes client code predictable:

```javascript
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);
  const offset = (page - 1) * limit;

  // ... fetch from DB with LIMIT and OFFSET

  res.json({
    data: items,
    meta: {
      page,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
    },
  });
});
```

Cursor-based pagination is better for large datasets (avoids the page-drift problem), but offset is simpler to start with.

## Gotchas

- **`mergeParams: true` for nested routers.** Without it, `:userId` is not available in the child router.
- **CORS and credentials.** Setting `credentials: true` requires an explicit origin, not `'*'`. Using both throws an error in browsers.
- **Options preflight.** Browsers send an `OPTIONS` request before `POST`/`PUT` with custom headers. Register `app.options('*', cors(...))` or CORS will block the preflight.
- **helmet and existing headers.** If a proxy already sets security headers, helmet may overwrite them. Audit what your infrastructure sets before applying helmet in production.
- **Exporting `app` vs `server`.** Export `app` from `app.js` and call `listen` in a separate `server.js`. Tests import `app` and pass it to Supertest without opening a port.

## What's next

Part 5 adds authentication: JWT tokens, password hashing with bcrypt, protected routes, and the session vs stateless tradeoff.

## References

- [express.Router() docs](https://expressjs.com/en/4x/api.html#router)
- [cors package](https://www.npmjs.com/package/cors)
- [helmet package](https://helmetjs.github.io/)
- [REST API design guidelines (Microsoft)](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)

## Related topics

- [Part 3, Request and response](./part-03-request-response/)
- [Part 5, Authentication](./part-05-authentication/)
- [Part 7, Validation and error handling](./part-07-validation-and-errors/)
