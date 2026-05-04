---
title: "Part 3: Request and response"
description: "Every req and res property you will actually use: body, params, query, headers, cookies, IP. Response chaining, status codes, content negotiation, and streaming."
parent: express
tags: [express, nodejs, javascript, web, backend, http]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## The request object

`req` is a Node.js `IncomingMessage` extended by Express. The properties you reach for constantly:

### req.params

Named route segments. Always strings.

```javascript
app.get('/users/:userId/posts/:postId', (req, res) => {
  console.log(req.params);
  // { userId: '42', postId: '7' }
});
```

### req.query

Parsed query string. Always strings (or arrays for repeated keys).

```javascript
// GET /search?q=node&page=2&tags=js&tags=ts
app.get('/search', (req, res) => {
  console.log(req.query);
  // { q: 'node', page: '2', tags: ['js', 'ts'] }
});
```

Always validate and parse before using in logic:

```javascript
const page = Math.max(1, parseInt(req.query.page, 10) || 1);
const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);
```

### req.body

The parsed request body. Requires body-parsing middleware (`express.json()` or `express.urlencoded()`).

```javascript
app.use(express.json());

app.post('/users', (req, res) => {
  const { name, email, role = 'user' } = req.body;
  // ...
});
```

`req.body` is `undefined` if the matching middleware is not registered or if the client sent an unsupported `Content-Type`.

### req.headers

All HTTP headers, lowercased:

```javascript
app.get('/info', (req, res) => {
  const contentType = req.headers['content-type'];
  const auth = req.headers['authorization'];
  const userAgent = req.headers['user-agent'];
  res.json({ contentType, auth, userAgent });
});
```

Shorthand for common headers:

```javascript
req.get('Authorization');         // same as req.headers['authorization']
req.get('Content-Type');          // same as req.headers['content-type']
```

### req.method

The HTTP method as an uppercase string: `'GET'`, `'POST'`, `'PUT'`, `'DELETE'`, etc.

### req.url and req.path

```javascript
// For a request to /api/users?page=2
req.url    // '/api/users?page=2' (includes query string)
req.path   // '/api/users'        (no query string)
```

`req.url` is relative to where the middleware was mounted. If mounted at `/api`, a request to `/api/users` gives `req.url === '/users'`.

### req.ip

The remote IP address. If behind a proxy (nginx, load balancer), set `app.set('trust proxy', 1)` first and Express will use `X-Forwarded-For`:

```javascript
app.set('trust proxy', 1);

app.get('/ip', (req, res) => {
  res.json({ ip: req.ip });
});
```

### req.protocol and req.secure

```javascript
req.protocol  // 'http' or 'https'
req.secure    // shorthand for req.protocol === 'https'
```

### req.cookies

Requires the `cookie-parser` middleware:

```bash
npm install cookie-parser
```

```javascript
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/me', (req, res) => {
  const sessionId = req.cookies.sessionId;
  res.json({ sessionId });
});
```

Signed cookies (tamper-proof):

```javascript
app.use(cookieParser('my-secret-key'));

// Set
res.cookie('userId', '42', { signed: true, httpOnly: true });

// Read
const userId = req.signedCookies.userId;
```

## The response object

`res` is a Node.js `ServerResponse` extended by Express.

### Sending responses

```javascript
// Plain text
res.send('Hello, world');

// JSON (sets Content-Type: application/json)
res.json({ id: 1, name: 'Alice' });

// Set status code then send
res.status(201).json({ id: 2, name: 'Bob' });
res.status(204).send();      // No Content, no body
res.status(404).json({ error: 'Not found' });

// Redirect
res.redirect('/new-path');           // 302 by default
res.redirect(301, '/permanent-path');

// Send a file
res.sendFile('/absolute/path/to/file.pdf');

// Download prompt
res.download('/path/to/report.pdf', 'report.pdf');
```

### Response chaining

Most `res` methods return `res`, so you can chain:

```javascript
res
  .status(200)
  .set('X-Custom-Header', 'value')
  .json({ ok: true });
```

`res.json()` is a terminal method; it sends the response and ends the cycle. You cannot call another send method after it.

### Setting headers

```javascript
res.set('X-Request-Id', '123');
res.set('Cache-Control', 'no-store');

// Shorthand for one header
res.setHeader('Content-Type', 'text/plain');

// Set multiple at once
res.set({
  'X-Powered-By': 'My API',
  'Cache-Control': 'max-age=3600',
});
```

### Setting cookies

```javascript
res.cookie('sessionId', 'abc123', {
  httpOnly: true,   // not accessible via JS
  secure: true,     // HTTPS only
  sameSite: 'lax',  // CSRF protection
  maxAge: 1000 * 60 * 60 * 24, // 1 day in ms
});

res.clearCookie('sessionId');
```

## HTTP status codes you will actually use

| Code | Meaning | When to use |
| --- | --- | --- |
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST that creates a resource |
| 204 | No Content | Successful DELETE, no body |
| 400 | Bad Request | Malformed input, validation failure |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate (email already taken, etc.) |
| 422 | Unprocessable Entity | Semantically invalid input |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unhandled exception |
| 503 | Service Unavailable | Dependency down, maintenance |

## Content negotiation

Clients signal what format they accept via the `Accept` header. Use `req.accepts()` to branch:

```javascript
app.get('/data', (req, res) => {
  const data = { id: 1, name: 'Widget' };

  if (req.accepts('json')) {
    return res.json(data);
  }

  if (req.accepts('text')) {
    return res.send(`id: ${data.id}, name: ${data.name}`);
  }

  res.status(406).send('Not Acceptable');
});
```

`req.accepts()` returns the best match or `false`. Pass an array to check multiple types at once:

```javascript
const type = req.accepts(['json', 'html', 'text']);
```

## Streaming responses

For large files or real-time data, stream directly to the response rather than buffering in memory:

```javascript
const fs = require('fs');
const path = require('path');

app.get('/large-file', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'large.csv');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="large.csv"');

  const stream = fs.createReadStream(filePath);
  stream.on('error', (err) => {
    res.status(500).json({ error: 'File read error' });
  });
  stream.pipe(res);
});
```

`pipe(res)` writes chunks to the response as they come off disk, without loading the whole file into memory.

## Practical: request logger middleware

A middleware that captures request and response details:

```javascript
function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, url, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${method} ${url} ${res.statusCode} ${duration}ms [${ip}]`);
  });

  next();
}

app.use(requestLogger);
```

`res.on('finish')` fires after Express sends the response, giving you the final status code.

## Gotchas

- **`req.body` is `undefined`.** You forgot `express.json()` or the client sent the wrong `Content-Type`. Check both.
- **`req.params` vs `req.query`.** Params are in the path (`/users/:id`); query strings come after `?`. Mix-ups cause `undefined` reads.
- **Headers already sent.** Calling `res.json()` twice on the same request. Always `return` after terminal response methods.
- **`req.ip` shows `::1` or `127.0.0.1`.** You are behind a proxy and haven't set `app.set('trust proxy', 1)`.
- **Unicode in query strings.** Query strings are percent-encoded. Express decodes them automatically via `decodeURIComponent`. You do not need to decode manually.

## What's next

Part 4 covers REST API design: splitting routes into Router files, versioning, CORS, and basic security headers.

## References

- [Express 4.x API, req](https://expressjs.com/en/4x/api.html#req)
- [Express 4.x API, res](https://expressjs.com/en/4x/api.html#res)
- [MDN HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

## Related topics

- [Part 2, Middleware](./part-02-middleware/)
- [Part 4, REST API design](./part-04-rest-api-design/)
- [Part 7, Validation and error handling](./part-07-validation-and-errors/)
