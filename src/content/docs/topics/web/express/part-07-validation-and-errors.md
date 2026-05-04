---
title: "Part 7, Validation and error handling"
description: "Input validation with Zod, centralized error handler middleware, HTTP error classes, and async error propagation with express-async-errors."
parent: express
tags: [express, nodejs, javascript, web, backend, validation, errors, zod]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## Why centralized error handling matters

Without a centralized error handler, every route has its own try/catch with its own response format. Clients see inconsistent shapes: some errors come back as `{ error: "..." }`, others as `{ message: "..." }`, others as HTML stack traces. A centralized handler fixes this.

The goal: every error, from any part of the app, produces a consistent JSON response.

## The error handler middleware

Express identifies error middleware by its 4-argument signature: `(err, req, res, next)`. Register it after all routes.

```javascript
// middleware/errorHandler.js

function errorHandler(err, req, res, next) {
  // Log the full error server-side
  console.error(err);

  // If we already started sending a response, delegate to Express defaults
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.expose ? err.message : 'Internal server error';

  res.status(statusCode).json({
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}

module.exports = errorHandler;
```

Register it last in `app.js`:

```javascript
const errorHandler = require('./middleware/errorHandler');

// ... all routes ...

app.use(errorHandler); // must be last
```

Trigger it from any route by calling `next(err)`:

```javascript
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: { message: 'User not found' } });
    res.json(user);
  } catch (err) {
    next(err); // goes straight to errorHandler
  }
});
```

## HTTP error classes

Create typed error classes so route handlers can throw semantic errors without building response objects:

```javascript
// errors/HttpError.js

class HttpError extends Error {
  constructor(statusCode, message, code) {
    super(message);
    this.statusCode = statusCode;
    this.expose = true; // safe to send message to client
    this.code = code || `HTTP_${statusCode}`;
    this.name = 'HttpError';
  }
}

class NotFoundError extends HttpError {
  constructor(resource = 'Resource') {
    super(404, `${resource} not found`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

class BadRequestError extends HttpError {
  constructor(message = 'Bad request') {
    super(400, message, 'BAD_REQUEST');
    this.name = 'BadRequestError';
  }
}

class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden') {
    super(403, message, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

class ConflictError extends HttpError {
  constructor(message = 'Conflict') {
    super(409, message, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

module.exports = {
  HttpError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
};
```

Use them in routes:

```javascript
const { NotFoundError, ConflictError } = require('./errors/HttpError');

app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) throw new NotFoundError('User');
    res.json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/users', async (req, res, next) => {
  try {
    const existing = await getUserByEmail(req.body.email);
    if (existing) throw new ConflictError('Email already in use');
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});
```

## Input validation with Zod

Zod validates data against a schema and returns either the parsed, type-safe value or a structured error. Install it:

```bash
npm install zod
```

### Defining schemas

```javascript
const { z } = require('zod');

const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1).max(100).optional(),
  role: z.enum(['user', 'admin']).default('user'),
});

const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided' }
);

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
```

`z.coerce.number()` converts strings to numbers, which is useful for query params since they always arrive as strings.

### Validation middleware factory

```javascript
// middleware/validate.js
const { z } = require('zod');

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(422).json({
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: result.error.flatten().fieldErrors,
        },
      });
    }

    // Replace req[source] with the parsed (and type-coerced) data
    req[source] = result.data;
    next();
  };
}

module.exports = validate;
```

Use it as route-level middleware:

```javascript
const validate = require('./middleware/validate');
const { createUserSchema, paginationSchema } = require('./schemas/user');

router.get('/', validate(paginationSchema, 'query'), async (req, res, next) => {
  try {
    const { page, limit } = req.query; // already parsed numbers from Zod
    const users = await listUsers({ offset: (page - 1) * limit, limit });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.post('/', validate(createUserSchema), async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body; // validated and type-safe
    const user = await createUser({ email, password, name, role });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});
```

Validation errors look like this to the client:

```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "email": ["Invalid email format"],
      "password": ["Password must be at least 8 characters"]
    }
  }
}
```

## Async error propagation with express-async-errors

In Express 4, unhandled promise rejections inside route handlers do not reach the error handler. You must wrap every async route in try/catch and call `next(err)`.

`express-async-errors` patches Express so rejected promises are forwarded to the error handler automatically:

```bash
npm install express-async-errors
```

Require it once at the top of your entry point, before any routes:

```javascript
require('express-async-errors'); // must come before express routes
const express = require('express');
```

Now you can write async routes without try/catch:

```javascript
// Before: verbose
router.get('/:id', async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) throw new NotFoundError('User');
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// After: with express-async-errors
router.get('/:id', async (req, res) => {
  const user = await getUserById(req.params.id);
  if (!user) throw new NotFoundError('User');
  res.json(user);
});
```

Express 5 has this behavior built in. If you're on Express 5, skip `express-async-errors`.

## Handling Prisma errors

Prisma throws typed errors you can catch in the error handler:

```javascript
const { Prisma } = require('@prisma/client');

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  // Prisma: unique constraint violation
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    return res.status(409).json({
      error: { message: 'A record with that value already exists', code: 'CONFLICT' },
    });
  }

  // Prisma: record not found
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    return res.status(404).json({
      error: { message: 'Record not found', code: 'NOT_FOUND' },
    });
  }

  // HttpError (our typed errors)
  if (err.expose) {
    return res.status(err.statusCode).json({
      error: { message: err.message, code: err.code },
    });
  }

  // Default
  console.error(err);
  res.status(500).json({
    error: { message: 'Internal server error', code: 'INTERNAL_ERROR' },
  });
}
```

## 404 catch-all

Register a 404 handler between routes and the error handler:

```javascript
// After all routes, before errorHandler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: `Cannot ${req.method} ${req.path}`,
      code: 'NOT_FOUND',
    },
  });
});

app.use(errorHandler);
```

## Gotchas

- **Error handler must have 4 args.** If you write `(err, req, res)` (only 3), Express treats it as normal middleware and errors slip through.
- **Register error handler last.** Any route registered after the error handler will not have errors caught by it.
- **`err.expose` pattern.** Never expose internal error messages to clients in production. The `expose` flag is a clean way to mark which messages are safe.
- **Zod `safeParse` vs `parse`.** `safeParse` returns a result object and never throws. `parse` throws a `ZodError`. Use `safeParse` in middleware so you control the response; use `parse` in service code where throwing is fine.
- **`express-async-errors` load order.** It must be required before any Express route definitions, or it won't patch the handlers registered before it.

## What's next

Part 8 covers file uploads with Multer: handling multipart form data, validating file types, and serving files back.

## References

- [Zod documentation](https://zod.dev/)
- [express-async-errors on npm](https://www.npmjs.com/package/express-async-errors)
- [Express error handling guide](https://expressjs.com/en/guide/error-handling.html)
- [Prisma error reference](https://www.prisma.io/docs/reference/api-reference/error-reference)

## Related topics

- [Part 4, REST API design](./part-04-rest-api-design/)
- [Part 6, Database integration](./part-06-database/)
- [Part 9, Testing](./part-09-testing/)
