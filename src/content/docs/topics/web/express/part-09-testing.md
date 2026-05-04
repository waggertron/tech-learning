---
title: "Part 9, Testing"
description: "Integration tests with Jest and Supertest, mocking dependencies, test database setup, and coverage. Tests that verify HTTP behavior end-to-end without spinning up a real server."
parent: express
tags: [express, nodejs, javascript, web, backend, testing, jest, supertest]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## Why integration tests over unit tests for Express

Unit tests verify individual functions. Integration tests verify that your routes, middleware, validation, and database calls cooperate correctly. For an HTTP API, integration tests catch the most real-world bugs because they exercise the full request/response cycle.

The tool combination: **Jest** as the test runner and **Supertest** to fire HTTP requests against your Express app without binding a port.

```bash
npm install --save-dev jest supertest
```

If you use TypeScript:

```bash
npm install --save-dev @types/jest @types/supertest ts-jest
```

## App structure for testability

The key: export `app` from one file, call `listen` in another. Supertest imports `app` and manages its own test server.

```
src/
  app.js       # exports app, no listen()
  server.js    # imports app, calls app.listen()
  routes/
    users.js
  __tests__/
    users.test.js
```

**`src/app.js`**

```javascript
const express = require('express');
const usersRouter = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/v1/users', usersRouter);
app.use(errorHandler);

module.exports = app;
```

**`src/server.js`**

```javascript
const app = require('./app');

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});
```

## Jest configuration

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "testMatch": ["**/__tests__/**/*.test.js"],
    "setupFilesAfterFramework": ["./jest.setup.js"]
  }
}
```

**`jest.setup.js`** (run after the framework initializes):

```javascript
// Suppress morgan logging noise during tests
process.env.NODE_ENV = 'test';
```

## Your first integration test

```javascript
// src/__tests__/health.test.js
const request = require('supertest');
const app = require('../app');

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok' });
  });
});
```

Run it:

```bash
npm test
```

Supertest wraps your app in a temporary HTTP server, fires the request, and closes the server when done.

## Testing CRUD routes

```javascript
// src/__tests__/users.test.js
const request = require('supertest');
const app = require('../app');
const db = require('../db/prisma');

// Reset state between tests
beforeEach(async () => {
  await db.user.deleteMany();
});

afterAll(async () => {
  await db.$disconnect();
});

describe('POST /api/v1/users', () => {
  it('creates a user and returns 201', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ email: 'alice@example.com', password: 'secret1234', name: 'Alice' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({
      email: 'alice@example.com',
      name: 'Alice',
    });
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  it('returns 422 when email is missing', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ password: 'secret1234' });

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details).toHaveProperty('email');
  });

  it('returns 409 when email is already taken', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({ email: 'alice@example.com', password: 'secret1234' });

    const res = await request(app)
      .post('/api/v1/users')
      .send({ email: 'alice@example.com', password: 'other1234' });

    expect(res.statusCode).toBe(409);
  });
});

describe('GET /api/v1/users/:id', () => {
  it('returns the user when found', async () => {
    const created = await request(app)
      .post('/api/v1/users')
      .send({ email: 'bob@example.com', password: 'secret1234', name: 'Bob' });

    const res = await request(app).get(`/api/v1/users/${created.body.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ id: created.body.id, name: 'Bob' });
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/v1/users/99999');

    expect(res.statusCode).toBe(404);
  });
});
```

## Testing authenticated routes

```javascript
// helpers/auth.js
const jwt = require('jsonwebtoken');

function makeToken(overrides = {}) {
  return jwt.sign(
    { sub: 1, role: 'user', ...overrides },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
}

module.exports = { makeToken };
```

```javascript
// src/__tests__/profile.test.js
const request = require('supertest');
const app = require('../app');
const { makeToken } = require('../helpers/auth');

describe('GET /api/v1/profile', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/v1/profile');
    expect(res.statusCode).toBe(401);
  });

  it('returns 200 with a valid token', async () => {
    const token = makeToken({ sub: 42, role: 'user' });

    const res = await request(app)
      .get('/api/v1/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.userId).toBe(42);
  });
});
```

## Mocking dependencies with Jest

When you want to test route logic without hitting the database, mock the module:

```javascript
// src/__tests__/widgets.test.js
const request = require('supertest');
const app = require('../app');

// Mock the db module before importing anything that uses it
jest.mock('../db/widgets', () => ({
  listWidgets: jest.fn(),
  getWidget: jest.fn(),
  createWidget: jest.fn(),
}));

const widgetDb = require('../db/widgets');

describe('GET /api/v1/widgets', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns widgets from the database', async () => {
    widgetDb.listWidgets.mockResolvedValue([
      { id: 1, name: 'Sprocket', price: 4.99 },
    ]);

    const res = await request(app).get('/api/v1/widgets');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(widgetDb.listWidgets).toHaveBeenCalledTimes(1);
  });

  it('returns 500 when the database throws', async () => {
    widgetDb.listWidgets.mockRejectedValue(new Error('DB down'));

    const res = await request(app).get('/api/v1/widgets');

    expect(res.statusCode).toBe(500);
  });
});
```

## Test database setup

For tests that hit a real database, use a separate test database. Options:

**Option 1: Environment variable**

```bash
# .env.test
DATABASE_URL=postgresql://postgres:secret@localhost:5432/myapp_test
JWT_SECRET=test-secret
```

Run tests with:

```bash
NODE_ENV=test dotenv -e .env.test -- jest
```

Or add to `package.json`:

```json
{
  "scripts": {
    "test": "dotenv -e .env.test -- jest"
  }
}
```

**Option 2: Global setup/teardown with Prisma**

```javascript
// jest.globalSetup.js
const { execSync } = require('child_process');

module.exports = async () => {
  // Apply migrations to test database
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
  });
};
```

```json
{
  "jest": {
    "globalSetup": "./jest.globalSetup.js"
  }
}
```

## Coverage

```bash
npm run test:coverage
```

Jest outputs coverage by file. Aim for high coverage on routes and middleware; do not chase 100% on generated code or trivial configuration files.

Add to `package.json` to fail CI if coverage drops:

```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "lines": 80,
        "functions": 80
      }
    }
  }
}
```

## Testing file uploads

```javascript
const path = require('path');

describe('POST /upload/avatar', () => {
  it('accepts a valid image', async () => {
    const res = await request(app)
      .post('/upload/avatar')
      .attach('avatar', path.join(__dirname, 'fixtures', 'test.jpg'));

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('filename');
  });

  it('rejects non-image files', async () => {
    const res = await request(app)
      .post('/upload/avatar')
      .attach('avatar', path.join(__dirname, 'fixtures', 'test.txt'));

    expect(res.statusCode).toBe(415);
  });
});
```

Put small test fixtures in `src/__tests__/fixtures/`.

## Gotchas

- **Open handles warning.** If Jest warns about open handles after tests, a database connection or server is not closed. Call `db.$disconnect()` or `pool.end()` in `afterAll`.
- **`jest.mock` hoisting.** Jest hoists `jest.mock()` calls to the top of the file. Do not put them inside `describe` blocks.
- **Parallel test files and shared DB state.** Jest runs test files in parallel by default. Tests that write to the same database can interfere. Use `--runInBand` to run serially, or seed unique data per test.
- **Environment variable leakage.** `process.env` is shared across tests in the same worker. Set test-specific env vars in `setupFilesAfterFramework`, not inline.
- **Supertest and `app.listen`.** Supertest binds its own ephemeral port. Never call `app.listen()` in the app module, only in `server.js`.

## What's next

Part 10 covers production: clustering, PM2, rate limiting, compression, health checks, Docker, and graceful shutdown.

## References

- [Jest documentation](https://jestjs.io/docs/getting-started)
- [Supertest on GitHub](https://github.com/ladjs/supertest)
- [Jest mocking guide](https://jestjs.io/docs/mock-functions)

## Related topics

- [Part 7, Validation and error handling](./part-07-validation-and-errors/)
- [Part 8, File uploads](./part-08-file-uploads/)
- [Part 10, Production](./part-10-production/)
