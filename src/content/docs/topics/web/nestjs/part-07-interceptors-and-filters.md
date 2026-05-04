---
title: "Part 7: Interceptors and filters"
description: "Build logging and response-transformation interceptors with @UseInterceptors, catch exceptions with @UseFilters and a global HttpExceptionFilter, and understand where middleware, guards, interceptors, pipes, and filters sit in the request pipeline."
parent: nestjs
tags: [nestjs, typescript, nodejs, web, backend, api]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## The full request pipeline order

Before diving into individual pieces, here is the exact order NestJS processes a request:

```
Incoming request
      |
      v
1. Middleware          (express-style, before routing; no access to Nest context)
      |
      v
2. Guards             (canActivate; authentication and authorization)
      |
      v
3. Interceptors (pre) (before the handler; logging start, transform input)
      |
      v
4. Pipes              (validate and transform route params, query, body)
      |
      v
5. Controller handler (your business logic)
      |
      v
6. Interceptors (post)(after the handler returns; transform output)
      |
      v
7. Exception filters  (catch anything that throws)
      |
      v
Outgoing response
```

Exceptions thrown in steps 1-5 propagate to exception filters. Interceptors wrap steps 3-6 so they can catch exceptions too, before filters handle them.

## Interceptors

An interceptor implements `NestInterceptor`. The `intercept()` method receives the `ExecutionContext` (same as guards) and a `CallHandler`. Calling `next.handle()` returns an Observable of the response. You can transform it with RxJS operators.

### Logging interceptor

```typescript
import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - start;
          this.logger.log(`${method} ${url} ${ms}ms`);
        },
        error: (err) => {
          const ms = Date.now() - start;
          this.logger.error(`${method} ${url} ${ms}ms - ${err.message}`);
        },
      }),
    );
  }
}
```

Apply globally in `main.ts`:

```typescript
app.useGlobalInterceptors(new LoggingInterceptor());
```

Or per controller / per route:

```typescript
@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UsersController {}

@Get(':id')
@UseInterceptors(LoggingInterceptor)
findOne() {}
```

### Response transform interceptor

Wrap every response in a standard envelope:

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface ApiResponse<T> {
  data: T;
  timestamp: string;
  path: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => ({
        data,
        timestamp: new Date().toISOString(),
        path: req.url,
      })),
    );
  }
}
```

Response before: `{ "id": 1, "email": "alice@example.com" }`

Response after:

```json
{
  "data": { "id": 1, "email": "alice@example.com" },
  "timestamp": "2026-05-04T12:00:00.000Z",
  "path": "/users/1"
}
```

### Timeout interceptor

Abort requests that take too long:

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      timeout(5000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}
```

### Caching interceptor (manual example)

```typescript
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, unknown>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const key = req.url;

    if (this.cache.has(key)) {
      return of(this.cache.get(key));
    }

    return next.handle().pipe(
      tap((data) => this.cache.set(key, data)),
    );
  }
}
```

For production, use `@nestjs/cache-manager` with Redis rather than an in-memory map.

## Exception filters

An exception filter catches exceptions thrown anywhere in the request pipeline and shapes the error response. NestJS has a built-in global exception filter that handles `HttpException` subclasses, but you often want to customize it.

### Built-in HttpException

Throw `HttpException` or one of its subclasses from anywhere (controllers, services, guards, pipes):

```typescript
import { HttpException, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';

// Convenience subclass
throw new NotFoundException('User not found');

// Manual: equivalent to 404
throw new HttpException('User not found', HttpStatus.NOT_FOUND);

// With a custom response body
throw new HttpException(
  { statusCode: 404, message: 'User not found', code: 'USER_NOT_FOUND' },
  HttpStatus.NOT_FOUND,
);
```

Built-in exception classes: `BadRequestException` (400), `UnauthorizedException` (401), `ForbiddenException` (403), `NotFoundException` (404), `ConflictException` (409), `UnprocessableEntityException` (422), `InternalServerErrorException` (500).

### Custom HttpExceptionFilter

```typescript
import {
  ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const body = typeof exceptionResponse === 'string'
      ? { message: exceptionResponse }
      : exceptionResponse;

    const errorBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      ...body,
    };

    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url}`, exception.stack);
    }

    response.status(status).json(errorBody);
  }
}
```

### Catching all exceptions (catch-all filter)

```typescript
import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()   // no argument = catch everything
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

Extending `BaseExceptionFilter` delegates known exceptions back to the default handler while letting you intercept the rest.

### Applying filters

Per route:

```typescript
@Post()
@UseFilters(HttpExceptionFilter)
create(@Body() dto: CreateUserDto) {}
```

Per controller:

```typescript
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {}
```

Globally (preferred for a consistent API):

```typescript
// main.ts
app.useGlobalFilters(new HttpExceptionFilter());

// Or via dependency injection (supports injecting providers):
// In AppModule providers:
providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }]
```

## Middleware

Middleware in NestJS is express-style. It runs before routing and has no access to the Nest execution context (no guards, interceptors, or pipes).

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.headers['x-request-id'] = req.headers['x-request-id'] ?? crypto.randomUUID();
    res.setHeader('X-Request-Id', req.headers['x-request-id']);
    next();
  }
}
```

Register in a module:

```typescript
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware)
      .forRoutes('*');   // or { path: 'users', method: RequestMethod.GET }
  }
}
```

## Middleware vs Guard vs Interceptor vs Filter

| Layer | When to use |
| --- | --- |
| Middleware | Raw HTTP manipulation before Nest runs (CORS, request ID, rate limiting via express middleware) |
| Guard | Yes/no access decisions (auth, roles) |
| Interceptor | Wrap handler execution: logging, response shape, caching, timeout |
| Pipe | Input transformation and validation |
| Filter | Shape error responses after an exception is thrown |

The most common mistake is putting business logic in a guard (it should be in a service) or error shaping in a controller (it should be in a filter).

## Gotchas at this stage

- **Interceptors receive an Observable**, `next.handle()` returns an Observable, not a Promise. Use RxJS operators. If you need async logic in the pre-handler phase, return `from(asyncFn()).pipe(...)`.
- **Global filters registered in `main.ts` can't inject providers**, because they're outside the module system. Use `APP_FILTER` in a module's `providers` array to get DI.
- **`@Catch()` without arguments catches everything including non-HTTP errors**, TypeORM `QueryFailedError`, unhandled Promise rejections, etc. Log these carefully; they indicate bugs.
- **Order of multiple interceptors**, `@UseInterceptors(A, B)` wraps as A(B(handler)). A's pre runs first; B's post runs first. The outermost interceptor sees the final output.
- **Middleware can't return values**, it must call `next()` or end the response. Forgetting to call `next()` hangs the request.

## What's next

Part 8 covers WebSockets: `@WebSocketGateway`, `@SubscribeMessage`, Socket.io rooms and broadcasting, lifecycle hooks, and real-time event patterns.

## References

- [NestJS, Interceptors](https://docs.nestjs.com/interceptors)
- [NestJS, Exception filters](https://docs.nestjs.com/exception-filters)
- [NestJS, Middleware](https://docs.nestjs.com/middleware)
- [RxJS operators](https://rxjs.dev/guide/operators)
