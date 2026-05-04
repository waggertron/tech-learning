---
title: "Part 10: Production"
description: "Clustering and PM2 for multi-core utilization, rate limiting, security headers, compression, health checks, Docker, and graceful shutdown."
parent: express
tags: [express, nodejs, javascript, web, backend, production, docker, deployment]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## Node is single-threaded by default

A single Node.js process uses one CPU core. A server with 8 cores runs at 12.5% capacity unless you run multiple processes. Two options: the built-in `cluster` module and PM2.

## Clustering with the cluster module

```javascript
// server.js
const cluster = require('cluster');
const os = require('os');
const app = require('./app');

const NUM_WORKERS = os.cpus().length;
const PORT = parseInt(process.env.PORT, 10) || 3000;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} starting ${NUM_WORKERS} workers`);

  for (let i = 0; i < NUM_WORKERS; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.warn(`Worker ${worker.process.pid} died (${signal || code}). Restarting.`);
    cluster.fork();
  });
} else {
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} listening on ${PORT}`);
  });
}
```

The primary process forks one worker per CPU. If a worker crashes, the primary forks a replacement. All workers share the same port; the OS distributes incoming connections.

## PM2

PM2 manages Node processes in production: clustering, auto-restart, log aggregation, and zero-downtime reload.

```bash
npm install -g pm2
```

**`ecosystem.config.js`**

```javascript
module.exports = {
  apps: [
    {
      name: 'my-api',
      script: './src/server.js',
      instances: 'max',        // one per CPU core
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      // Restart if memory exceeds 512 MB
      max_memory_restart: '512M',
      // Restart on crash, up to 10 times per minute
      restart_delay: 1000,
      max_restarts: 10,
      // Log rotation
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      merge_logs: true,
    },
  ],
};
```

```bash
pm2 start ecosystem.config.js --env production
pm2 save        # persist config across reboots
pm2 startup     # generate startup script
pm2 reload my-api  # zero-downtime reload (rolling restart)
pm2 logs        # tail logs
pm2 monit       # process monitor
```

## Rate limiting

Protect your API from brute force, credential stuffing, and runaway clients:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window per IP
  standardHeaders: true,     // include RateLimit-* headers in responses
  legacyHeaders: false,
  message: {
    error: {
      message: 'Too many requests, please try again later',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
});

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true, // only count failed attempts
  message: {
    error: { message: 'Too many login attempts', code: 'AUTH_RATE_LIMIT' },
  },
});

app.use('/api/', apiLimiter);
app.use('/auth/login', authLimiter);
app.use('/auth/register', authLimiter);
```

Behind a proxy (nginx, ELB), trust the forwarded IP:

```javascript
app.set('trust proxy', 1); // trust first proxy
```

For distributed rate limiting (across multiple app servers), use a Redis store:

```bash
npm install rate-limit-redis ioredis
```

```javascript
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});
```

## Compression

Compressing responses reduces bandwidth and speeds up clients:

```bash
npm install compression
```

```javascript
const compression = require('compression');

// Compress all responses over 1KB
app.use(compression({ threshold: 1024 }));
```

`compression` uses gzip by default and respects `Accept-Encoding`. It checks `Content-Type` and skips responses that are already compressed (images, video).

## Health checks

Load balancers need a health endpoint to know whether to route traffic to an instance:

```javascript
const os = require('os');

app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    pid: process.pid,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(os.totalmem() / 1024 / 1024),
    },
  };

  try {
    // Check database connectivity
    await db.$queryRaw`SELECT 1`;
    health.database = 'ok';
  } catch {
    health.database = 'error';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Liveness probe: is the process alive?
app.get('/health/live', (req, res) => res.status(200).send('ok'));

// Readiness probe: is the process ready to serve traffic?
app.get('/health/ready', async (req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    res.status(200).send('ok');
  } catch {
    res.status(503).send('not ready');
  }
});
```

Kubernetes uses liveness probes to restart stuck pods and readiness probes to stop routing traffic to pods that are not yet ready (or are draining).

## Graceful shutdown

When a process receives `SIGTERM` (from PM2, Kubernetes, or a deploy), it should:

1. Stop accepting new connections.
2. Finish serving in-flight requests.
3. Close database connections.
4. Exit.

```javascript
const app = require('./app');
const db = require('./db/prisma');

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server ${process.pid} listening`);
});

async function shutdown(signal) {
  console.log(`${signal} received, starting graceful shutdown`);

  // Stop accepting new connections
  server.close(async () => {
    console.log('HTTP server closed');

    try {
      await db.$disconnect();
      console.log('Database disconnected');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown', err);
      process.exit(1);
    }
  });

  // Force exit if shutdown takes too long
  setTimeout(() => {
    console.error('Graceful shutdown timed out, forcing exit');
    process.exit(1);
  }, 30_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Catch unhandled rejections (should never happen if you use express-async-errors)
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection', reason);
  process.exit(1);
});
```

## Docker

**`Dockerfile`**

```dockerfile
FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY src/ ./src/

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["node", "src/server.js"]
```

**`.dockerignore`**

```
node_modules
.env
.env.*
dist
coverage
.git
logs
uploads
```

Build and run:

```bash
docker build -t my-api:latest .
docker run -p 3000:3000 --env-file .env my-api:latest
```

**`docker-compose.yml`** for local development with Postgres:

```yaml
version: '3.9'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pg_data:
```

```bash
docker compose up --build
```

## Environment-specific configuration

Never hardcode configuration. Load from environment variables:

```javascript
// config/index.js
module.exports = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  allowedOrigin: process.env.ALLOWED_ORIGIN || '*',
};
```

Validate required variables at startup so the app fails fast rather than at request time:

```javascript
const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}
```

## Security checklist for production

- `app.use(helmet())` is registered.
- `trust proxy` is set correctly for your infrastructure.
- Rate limiting is on all auth endpoints.
- No stack traces in production error responses (`process.env.NODE_ENV === 'production'`).
- JWT secrets are at least 32 random bytes and loaded from environment variables.
- Database credentials are not committed to version control.
- Uploads directory is not directly served without scanning.
- `npm audit` passes with no high or critical vulnerabilities.
- HTTPS is enforced (by the load balancer or reverse proxy, not typically by Express directly).
- Cookies are `httpOnly`, `secure`, and `sameSite`.

## Gotchas

- **Cluster and in-memory state.** Each worker has its own memory. Rate limit state, session state, or any in-memory cache stored in one worker is not visible to others. Use Redis for shared state.
- **PM2 and `ecosystem.config.js`.** PM2 cluster mode uses the Node `cluster` module internally. Do not also use the `cluster` module in your application when running under PM2 cluster mode.
- **Health check latency.** Health checks run on the same event loop as request processing. A health check that does heavy DB work can slow down real traffic. Keep probes lightweight.
- **Docker non-root user.** If your app writes to disk (uploads, logs), ensure the directory is owned by the non-root user. Add a `RUN chown` step after copying files.
- **Graceful shutdown timeout.** The 30-second timeout should match the `terminationGracePeriodSeconds` in your Kubernetes `Deployment` spec. If the pod is force-killed before the server finishes draining, in-flight requests fail.

## What you have now

After completing this series you have a production-grade Express API with:

- Structured routing split across Router files
- Body parsing, logging, and security headers as middleware
- JWT authentication with bcrypt password storage
- PostgreSQL via Prisma with type-safe queries
- Zod validation and centralized error handling
- File upload support with type checking
- Integration tests with Jest and Supertest
- Multi-core utilization, rate limiting, and graceful shutdown in production

## References

- [Node.js cluster module](https://nodejs.org/api/cluster.html)
- [PM2 documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
- [compression package](https://www.npmjs.com/package/compression)
- [Docker Node.js best practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

## Related topics

- [Part 5, Authentication](./part-05-authentication/)
- [Part 6, Database integration](./part-06-database/)
- [Part 9, Testing](./part-09-testing/)
