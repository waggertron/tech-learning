---
title: "Part 6: Database integration"
description: "PostgreSQL with node-postgres (pg), parameterized queries, connection pooling, Prisma ORM basics, and transactions."
parent: express
tags: [express, nodejs, javascript, web, backend, postgresql, prisma, database]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## Two approaches: raw pg and Prisma ORM

This part covers both. Use raw `pg` when you want full SQL control and minimal abstraction. Use Prisma when you want type-safe queries, auto-generated client, and migrations managed in code.

Start with raw `pg` to understand what the ORM is hiding. Then switch to Prisma for larger projects.

## PostgreSQL setup

You need a running Postgres instance. Options:

```bash
# Docker (quickest)
docker run --name pg-dev -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=myapp -p 5432:5432 -d postgres:15

# Homebrew on macOS
brew install postgresql@15
brew services start postgresql@15
createdb myapp
```

## node-postgres (pg)

Install:

```bash
npm install pg
npm install --save-dev @types/pg
```

### Connection pool

Use a pool, not individual connections. A pool keeps a set of connections open and recycles them across requests:

```javascript
// db/pool.js
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME     || 'myapp',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'secret',
  max:      20,    // max open connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected pg pool error', err);
});

module.exports = pool;
```

Or use a `DATABASE_URL` connection string (what Heroku and Railway provide):

```javascript
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
```

### Parameterized queries

Always use parameterized queries (`$1`, `$2`, ...). Never interpolate user input into SQL strings.

```javascript
const pool = require('../db/pool');

// Safe: user input goes through pg's parameterization
async function getUserById(id) {
  const result = await pool.query('SELECT id, email, name FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

// Unsafe: never do this
// const result = await pool.query(`SELECT * FROM users WHERE id = ${id}`);
```

`result.rows` is an array of plain objects. `result.rows[0]` is the first row or `undefined`.

### CRUD with raw pg

```javascript
// db/users.js
const pool = require('./pool');

async function createUser({ email, name, passwordHash }) {
  const result = await pool.query(
    'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
    [email, name, passwordHash]
  );
  return result.rows[0];
}

async function getUserByEmail(email) {
  const result = await pool.query(
    'SELECT id, email, name, password_hash FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

async function listUsers({ limit = 20, offset = 0 } = {}) {
  const result = await pool.query(
    'SELECT id, email, name, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return result.rows;
}

async function updateUser(id, { name }) {
  const result = await pool.query(
    'UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, name',
    [name, id]
  );
  return result.rows[0] || null;
}

async function deleteUser(id) {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
  return result.rowCount > 0;
}

module.exports = { createUser, getUserByEmail, listUsers, updateUser, deleteUser };
```

### Transactions

When multiple queries must succeed or fail together, use a transaction:

```javascript
async function transferCredits(fromUserId, toUserId, amount) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2',
      [amount, fromUserId]
    );

    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2',
      [amount, toUserId]
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err; // re-throw so the route handler can respond with 500
  } finally {
    client.release(); // always release back to the pool
  }
}
```

The pattern: `connect()` to get a dedicated client, `BEGIN`, do work, `COMMIT` on success, `ROLLBACK` on error, `release()` in `finally`.

## Prisma ORM

Prisma generates a type-safe client from your schema. It handles migrations, relationships, and complex queries without raw SQL.

### Install Prisma

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

`prisma init` creates `prisma/schema.prisma` and a `.env` with `DATABASE_URL`.

### Schema

**`prisma/schema.prisma`**

```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  name         String?
  passwordHash String    @map("password_hash")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  posts        Post[]

  @@map("users")
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  body      String
  published Boolean  @default(false)
  authorId  Int      @map("author_id")
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now()) @map("created_at")

  @@map("posts")
}
```

### Migrations

```bash
npx prisma migrate dev --name init
```

This creates a SQL migration file in `prisma/migrations/`, applies it, and regenerates the Prisma client.

### Prisma client

```javascript
// db/prisma.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

module.exports = prisma;
```

Instantiate once, reuse everywhere. Creating multiple `PrismaClient` instances exhausts the connection pool.

### CRUD with Prisma

```javascript
const prisma = require('../db/prisma');

// Create
const user = await prisma.user.create({
  data: {
    email: 'alice@example.com',
    name: 'Alice',
    passwordHash: hashedPassword,
  },
  select: { id: true, email: true, name: true, createdAt: true }, // omit passwordHash
});

// Find one
const user = await prisma.user.findUnique({
  where: { email: 'alice@example.com' },
});

// Find many with pagination
const users = await prisma.user.findMany({
  skip: offset,
  take: limit,
  orderBy: { createdAt: 'desc' },
  select: { id: true, email: true, name: true, createdAt: true },
});

// Update
const updated = await prisma.user.update({
  where: { id: userId },
  data: { name: 'Alice Smith' },
});

// Delete
await prisma.user.delete({ where: { id: userId } });

// With related data
const userWithPosts = await prisma.user.findUnique({
  where: { id: userId },
  include: { posts: { where: { published: true }, orderBy: { createdAt: 'desc' } } },
});
```

### Prisma transactions

```javascript
const [debit, credit] = await prisma.$transaction([
  prisma.account.update({
    where: { userId: fromUserId },
    data: { balance: { decrement: amount } },
  }),
  prisma.account.update({
    where: { userId: toUserId },
    data: { balance: { increment: amount } },
  }),
]);
```

For interactive transactions (when you need to read then write):

```javascript
await prisma.$transaction(async (tx) => {
  const account = await tx.account.findUnique({ where: { userId: fromUserId } });
  if (account.balance < amount) throw new Error('Insufficient funds');

  await tx.account.update({
    where: { userId: fromUserId },
    data: { balance: { decrement: amount } },
  });

  await tx.account.update({
    where: { userId: toUserId },
    data: { balance: { increment: amount } },
  });
});
```

## Wiring into Express routes

```javascript
// routes/users.js
const express = require('express');
const prisma = require('../db/prisma');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        select: { id: true, email: true, name: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    res.json({ data: users, meta: { page, limit, total } });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id, 10) },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

## Gotchas

- **Connection pool exhaustion.** If every query opens a new `pg.Client` without releasing it, you run out of connections. Always use `Pool` and call `client.release()` in `finally`.
- **SQL injection.** Parameterized queries ($1, $2) are the defense. String interpolation into SQL is always wrong.
- **Prisma client singleton.** Instantiate `PrismaClient` once. In Next.js or hot-reloading environments, use a module-level singleton pattern to avoid creating a new client on every hot reload.
- **Prisma `select` to exclude passwords.** Without `select`, Prisma returns all fields including `passwordHash`. Always exclude sensitive fields at the query level.
- **`BigInt` in Prisma.** By default, Prisma serializes `BigInt` as a string in JSON. If your IDs or counts are `BigInt`, you need a custom JSON serializer or use `Int` where possible.

## What's next

Part 7 covers input validation with Zod and centralized error handling, so database errors and validation failures return consistent JSON error shapes.

## References

- [node-postgres documentation](https://node-postgres.com/)
- [Prisma documentation](https://www.prisma.io/docs)
- [Prisma schema reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

## Related topics

- [Part 5, Authentication](./part-05-authentication/)
- [Part 7, Validation and error handling](./part-07-validation-and-errors/)
- [Part 10, Production](./part-10-production/)
