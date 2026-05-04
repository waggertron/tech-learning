---
title: "Part 2: Dependency injection"
description: "How NestJS's IoC container works: providers, @Injectable(), @Inject(), module imports and exports, forwardRef for circular dependencies, and the three provider scopes (DEFAULT, REQUEST, TRANSIENT)."
parent: nestjs
tags: [nestjs, typescript, nodejs, web, backend, api]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## What dependency injection actually does

Dependency injection (DI) is a pattern where objects declare what they need and a container provides it, rather than objects creating their own dependencies with `new`. NestJS's container (the IoC container) reads constructor parameter types at startup, builds a dependency graph, and wires everything together.

Without DI:

```typescript
class OrdersService {
  private usersService = new UsersService();  // tightly coupled, hard to test
}
```

With DI:

```typescript
@Injectable()
class OrdersService {
  constructor(private readonly usersService: UsersService) {}  // container provides it
}
```

## @Injectable()

`@Injectable()` marks a class as a provider that the container can instantiate and inject. Any class you want to inject must have this decorator.

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  send(to: string, subject: string, body: string) {
    // send email logic
  }
}
```

The decorator triggers TypeScript's `emitDecoratorMetadata`, which allows the container to read the constructor parameter types via `Reflect.metadata`. This is why `tsconfig.json` has `"emitDecoratorMetadata": true`.

## Registering providers in a module

A provider is only available inside its module unless explicitly exported. The `providers` array in `@Module()` registers providers with the container for that module's scope.

```typescript
@Module({
  providers: [EmailService, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
```

## Exporting and importing providers between modules

```typescript
// users/users.module.ts
@Module({
  providers: [UsersService],
  exports: [UsersService],   // makes UsersService available to importing modules
})
export class UsersModule {}

// orders/orders.module.ts
@Module({
  imports: [UsersModule],    // now OrdersService can inject UsersService
  providers: [OrdersService],
})
export class OrdersModule {}

// orders/orders.service.ts
@Injectable()
export class OrdersService {
  constructor(private readonly usersService: UsersService) {}
}
```

The import/export system is the boundary control mechanism. If you forget to export a provider, you get a "Nest can't resolve dependencies" error at startup.

## Custom providers

The shorthand `providers: [UsersService]` is equivalent to:

```typescript
providers: [
  {
    provide: UsersService,
    useClass: UsersService,
  },
]
```

There are four provider variants:

### useClass

Instantiates a class. The default.

```typescript
providers: [
  {
    provide: UsersService,
    useClass: process.env.NODE_ENV === 'test' ? MockUsersService : UsersService,
  },
]
```

### useValue

Injects a static value. Useful for configuration objects and mocks in tests.

```typescript
const config = { apiKey: process.env.API_KEY, timeout: 5000 };

providers: [
  {
    provide: 'APP_CONFIG',
    useValue: config,
  },
]
```

### useFactory

Calls a factory function. The function can be async and can itself receive injected dependencies.

```typescript
providers: [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (configService: ConfigService) => {
      const conn = await createConnection(configService.get('DATABASE_URL'));
      return conn;
    },
    inject: [ConfigService],   // dependencies to pass to the factory
  },
]
```

### useExisting

Creates an alias for an existing provider.

```typescript
providers: [
  LoggerService,
  {
    provide: 'LOGGER',
    useExisting: LoggerService,
  },
]
```

## @Inject() for non-class tokens

When the injection token is a string or symbol (not a class), use `@Inject()` to tell the container what to look up:

```typescript
@Injectable()
export class AppService {
  constructor(
    @Inject('APP_CONFIG') private readonly config: AppConfig,
  ) {}
}
```

For class tokens, TypeScript's type metadata handles resolution automatically and `@Inject()` is optional.

## Injection tokens as constants

String tokens scattered across files are error-prone. Use a constants file:

```typescript
// constants.ts
export const APP_CONFIG = 'APP_CONFIG';
export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';
```

Then reference the constant everywhere instead of the raw string. Symbol tokens are even safer (no collision possible):

```typescript
export const APP_CONFIG = Symbol('APP_CONFIG');
```

## Provider scopes

Every provider has a lifetime (scope). The default is singleton, but two others exist.

### DEFAULT (singleton)

One instance shared across the entire application lifetime. Created when the module is initialized, destroyed when the app shuts down.

```typescript
@Injectable()   // DEFAULT scope, same as @Injectable({ scope: Scope.DEFAULT })
export class CacheService {}
```

Use DEFAULT for stateless services, database connections, and anything expensive to create.

### REQUEST

A new instance is created for every incoming HTTP request, then destroyed after the response. Useful for per-request context (tenant ID, user from auth token).

```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private tenantId: string;

  setTenantId(id: string) { this.tenantId = id; }
  getTenantId() { return this.tenantId; }
}
```

Warning: REQUEST scope propagates up the dependency tree. If a singleton injects a REQUEST-scoped provider, the singleton becomes REQUEST-scoped too. This can silently hurt performance if it reaches high-level providers.

### TRANSIENT

A new instance is created every time the provider is injected. Two classes injecting the same TRANSIENT provider each get their own instance.

```typescript
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private context: string;

  setContext(ctx: string) { this.context = ctx; }
  log(msg: string) { console.log(`[${this.context}] ${msg}`); }
}
```

## forwardRef: circular dependencies

NestJS requires that a provider's dependencies exist when it's registered. Circular dependencies (A depends on B, B depends on A) break this. The escape hatch is `forwardRef`:

```typescript
// a.service.ts
@Injectable()
export class AService {
  constructor(
    @Inject(forwardRef(() => BService))
    private readonly bService: BService,
  ) {}
}

// b.service.ts
@Injectable()
export class BService {
  constructor(
    @Inject(forwardRef(() => AService))
    private readonly aService: AService,
  ) {}
}
```

For circular module dependencies, use `forwardRef` in the module imports too:

```typescript
@Module({
  imports: [forwardRef(() => BModule)],
})
export class AModule {}
```

Circular dependencies are a design smell. If you reach for `forwardRef` often, look for a shared third service to extract the common logic into.

## Global modules

A module decorated with `@Global()` registers its providers globally. Any module can inject them without importing the module explicitly.

```typescript
@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
```

Use sparingly. Global modules reduce explicit dependency declaration and make the codebase harder to reason about. Configuration and database modules are common legitimate uses.

## Dynamic modules

Sometimes you need a module that accepts configuration at import time. Dynamic modules return a `DynamicModule` object:

```typescript
@Module({})
export class HttpClientModule {
  static forRoot(options: HttpClientOptions): DynamicModule {
    return {
      module: HttpClientModule,
      providers: [
        {
          provide: 'HTTP_OPTIONS',
          useValue: options,
        },
        HttpClientService,
      ],
      exports: [HttpClientService],
    };
  }
}

// In AppModule:
@Module({
  imports: [HttpClientModule.forRoot({ timeout: 5000, baseUrl: 'https://api.example.com' })],
})
export class AppModule {}
```

`forRoot` (singleton config) and `forFeature` (per-feature config) are the conventional names. TypeORM, Passport, and ConfigModule all use this pattern.

## Inspecting the dependency graph

```bash
nest info   # prints module graph summary
```

When "Nest can't resolve dependencies" errors appear at startup, the message tells you exactly which token it couldn't find and in which module it was expected. Read that error carefully before guessing.

## Gotchas at this stage

- **`exports` is not optional when other modules need your provider**, modules are isolated by default; nothing leaks out unless you explicitly export it.
- **REQUEST scope propagates**, adding `Scope.REQUEST` to a low-level service silently makes every service above it in the injection chain REQUEST-scoped. Profile before using.
- **`forwardRef` both ways**, a circular dep requires `forwardRef` on both sides or the container may still fail.
- **`emitDecoratorMetadata` must be true**, if TypeScript metadata emission is off, the container can't read parameter types and everything fails with cryptic errors.
- **Async factories can fail silently**, if a `useFactory` async function rejects, the app fails to start. Add error handling inside the factory or the rejection will be swallowed in some setups.

## What's next

Part 3 covers REST controllers in depth: route parameters, query strings, request bodies, response codes, headers, and response serialization.

## References

- [NestJS, Providers](https://docs.nestjs.com/providers)
- [NestJS, Modules](https://docs.nestjs.com/modules)
- [NestJS, Injection scopes](https://docs.nestjs.com/fundamentals/injection-scopes)
- [NestJS, Custom providers](https://docs.nestjs.com/fundamentals/custom-providers)
- [NestJS, Circular dependency](https://docs.nestjs.com/fundamentals/circular-dependency)
