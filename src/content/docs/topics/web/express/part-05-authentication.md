---
title: "Part 5: Authentication"
description: "JWT with jsonwebtoken, middleware-based auth guards, bcrypt for password hashing, refresh tokens, and the session vs stateless tradeoff."
parent: express
tags: [express, nodejs, javascript, web, backend, auth, jwt, security]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## Session vs stateless: pick one early

Two common approaches to auth in Express:

**Session-based:** The server stores session state (in memory or Redis). The client gets a session cookie. Each request the server looks up the session. Works great for traditional web apps. Requires shared session storage for multi-server deployments.

**Stateless (JWT):** The server issues a signed token. The client stores it and sends it with every request. The server verifies the signature without any database lookup. Scales horizontally without shared storage. Harder to invalidate on logout.

This part covers the stateless JWT approach, which is standard for REST APIs. Session-based auth with `express-session` is covered briefly at the end.

## Install dependencies

```bash
npm install jsonwebtoken bcrypt
npm install --save-dev @types/jsonwebtoken @types/bcrypt  # if using TypeScript
```

## Password hashing with bcrypt

Never store plain-text passwords. Bcrypt applies a slow hashing function with a random salt, making brute-force attacks expensive.

```javascript
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12; // work factor; higher = slower = safer

// Hashing (at registration)
async function hashPassword(plaintext) {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

// Verification (at login)
async function verifyPassword(plaintext, hash) {
  return bcrypt.compare(plaintext, hash);
}
```

`bcrypt.hash` generates a new salt internally and embeds it in the resulting string. You store the full hash, not the salt separately.

The work factor 12 takes roughly 250ms on modern hardware. That cost is the defense: even if your database leaks, cracking each password individually takes too long to be worth attacking at scale.

## Issuing JWTs

A JWT has three parts: header, payload, signature. The server signs the payload with a secret; the client cannot tamper with it without breaking the signature.

```javascript
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // load from env, never hardcode
const JWT_EXPIRES_IN = '15m'; // short-lived access token

function issueAccessToken(userId, role) {
  return jwt.sign(
    { sub: userId, role },      // payload (do not include password or sensitive fields)
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET); // throws on invalid or expired
}
```

The `sub` (subject) claim is the standard field for the user identifier. `iat` (issued at) and `exp` (expiry) are added automatically by `jsonwebtoken`.

## Registration and login routes

```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Pretend DB (replace with real DB in Part 6)
const users = [];

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }

    const existing = users.find((u) => u.email === email);
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = { id: users.length + 1, email, name, passwordHash };
    users.push(user);

    const token = jwt.sign({ sub: user.id, role: 'user' }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      { sub: user.id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { sub: user.id, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // In production: store refreshToken in DB and set as httpOnly cookie
    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
```

Notice: returning the same error message ("Invalid credentials") for both "user not found" and "wrong password". This prevents user enumeration: attackers cannot tell which accounts exist.

## Auth middleware

```javascript
// middleware/requireAuth.js
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = requireAuth;
```

## Role-based access control

Build on `requireAuth` with a factory that checks roles:

```javascript
// middleware/requireRole.js
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = requireRole;
```

Use in routes:

```javascript
const requireAuth = require('./middleware/requireAuth');
const requireRole = require('./middleware/requireRole');

app.get('/admin/users', requireAuth, requireRole('admin'), (req, res) => {
  res.json({ users: [] });
});

app.get('/profile', requireAuth, (req, res) => {
  res.json({ userId: req.user.id });
});
```

## Refresh tokens

Access tokens expire in 15 minutes. Refresh tokens let clients get new access tokens without re-entering credentials.

```javascript
// POST /auth/refresh
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (payload.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }

    // In production: also check that this refresh token is in your DB
    // and has not been revoked or rotated.

    const newAccessToken = jwt.sign(
      { sub: payload.sub, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});
```

Refresh token rotation: issue a new refresh token each time a refresh happens, and invalidate the old one. If a stolen refresh token is used, the server can detect that the legitimate client's token no longer works and force re-authentication.

## Session-based auth with express-session

For reference, here is the session alternative:

```bash
npm install express-session connect-redis redis
```

```javascript
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');

const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect();

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// After login:
req.session.userId = user.id;

// On subsequent requests:
if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });

// On logout:
req.session.destroy();
```

Sessions are simpler to revoke (delete from Redis) but require shared storage. JWTs require no shared storage but are hard to invalidate before expiry without maintaining a denylist (which reintroduces shared state).

## Environment variables

Never hardcode secrets. Use a `.env` file locally and environment variables in production:

```bash
# .env
JWT_SECRET=at-least-32-random-characters-here
JWT_REFRESH_SECRET=different-random-string-here
NODE_ENV=development
```

```bash
npm install dotenv
```

```javascript
// At the very top of your entry point
require('dotenv').config();
```

Add `.env` to `.gitignore` immediately.

## Gotchas

- **Weak secrets.** JWT secrets must be long and random. Use `openssl rand -base64 48` to generate one.
- **Storing tokens in localStorage.** Tokens in localStorage are accessible to JavaScript and vulnerable to XSS. Prefer httpOnly cookies for refresh tokens.
- **`jwt.verify` throws on expiry.** Catch `TokenExpiredError` separately if you want to give the client a clear "please refresh" response.
- **Not checking `exp` manually.** `jwt.verify` checks expiry automatically. Do not implement manual expiry checks unless you know what you are doing.
- **Using the same secret for access and refresh tokens.** A compromised access-token secret would then also compromise refresh tokens. Use separate secrets.

## What's next

Part 6 adds PostgreSQL and Prisma. The auth routes from this part get real database storage.

## References

- [jsonwebtoken on npm](https://www.npmjs.com/package/jsonwebtoken)
- [bcrypt on npm](https://www.npmjs.com/package/bcrypt)
- [OWASP authentication cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT.io debugger](https://jwt.io/)

## Related topics

- [Part 4, REST API design](./part-04-rest-api-design/)
- [Part 6, Database integration](./part-06-database/)
- [Part 7, Validation and error handling](./part-07-validation-and-errors/)
