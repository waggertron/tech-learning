---
title: "Part 1: Architecture and setup"
description: "Install the Nest CLI, scaffold a project, understand the modules/controllers/providers triangle, and trace a request through the NestJS lifecycle from incoming HTTP to outgoing response."
parent: nestjs
tags: [nestjs, typescript, nodejs, web, backend, api]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## Install the Nest CLI

```bash
npm install -g @nestjs/cli
nest --version   # 11.x
```

Node 22 LTS is required. Check with `node --version`.

## Scaffold a project

```bash
nest new my-api
cd my-api
npm run start:dev   # http://localhost:3000
```

The CLI asks for a package manager (npm/yarn/pnpm). Pick one and stick with it per project.

## What just got generated

```
src/
├── app.controller.ts        # root controller, handles GET /
├── app.controller.spec.ts   # unit test for the controller
├── app.module.ts            # root module, ties everything together
├── app.service.ts           # root service, business logic
└── main.ts                  # bootstrap entry point
test/
├── app.e2e-spec.ts          # end-to-end test
└── jest-e2e.json
nest-cli.json                # CLI config: sourceRoot, compilerOptions
tsconfig.json                # TypeScript config
tsconfig.build.json          # TypeScript config for prod builds
```

`main.ts` is the entry point:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
```

## The three core building blocks

NestJS organizes code around three primitives:

| Primitive | Decorator | What it does |
| --- | --- | --- |
| **Module** | `@Module()` | Declares a feature boundary; imports/exports providers |
| **Controller** | `@Controller()` | Handles incoming requests and returns responses |
| **Provider** | `@Injectable()` | Contains business logic; injected into controllers or other providers |

Every Nest application has at least one module (the root module). Everything else plugs into the module graph.

## Modules

A module is a class decorated with `@Module()`. It declares which controllers handle routes, which providers it owns, which providers it exports for other modules, and which other modules it imports.

```typescript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],   // other modules that import UsersModule can inject UsersService
})
export class UsersModule {}
```

Register `UsersModule` in the root module:

```typescript
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
})
export class AppModule {}
```

## Controllers

A controller handles HTTP routes. The `@Controller('users')` decorator sets the path prefix. Method decorators (`@Get`, `@Post`, etc.) define individual routes.

```typescript
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}
```

Controllers are thin. Business logic lives in services.

## Providers (services)

A provider is any class decorated with `@Injectable()`. Services are the most common kind.

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find(u => u.id === id);
  }
}
```

The dependency injection container instantiates services and injects them wherever they're requested via constructor parameters. You never call `new UsersService()` yourself.

## Generate code with the CLI

The CLI generates boilerplate so you don't have to:

```bash
nest generate module users       # src/users/users.module.ts
nest generate controller users   # src/users/users.controller.ts
nest generate service users      # src/users/users.service.ts

# Or all three at once:
nest generate resource users     # prompts for REST/GraphQL/WebSocket, generates CRUD scaffold
```

Generated files are automatically imported into the nearest module.

## The request lifecycle

A request passes through several layers before your controller method runs, and several more before the response leaves:

```
Incoming HTTP request
        |
        v
   Middleware            (express-style, runs before routing)
        |
        v
   Guards               (authentication, authorization; return true/false)
        |
        v
   Interceptors (pre)   (logging, transform input)
        |
        v
   Pipes                (validation and transformation of route params/body)
        |
        v
   Controller method
        |
        v
   Interceptors (post)  (transform output, map exceptions)
        |
        v
   Exception filters    (catch thrown exceptions, shape error responses)
        |
        v
   HTTP response
```

Each layer has a dedicated API covered in later parts. For now, knowing the order matters: guards run before pipes, pipes run before the controller method, exception filters catch what nothing else handled.

## Project structure conventions

NestJS doesn't enforce a directory structure beyond `src/`, but the community convention is feature-based folders:

```
src/
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── strategies/
│       └── jwt.strategy.ts
├── app.module.ts
└── main.ts
```

One module per feature, one folder per module.

## Gotchas at this stage

- **`@Module()` metadata is required**, even for a module with no controllers or providers. An empty `@Module({})` is valid and common for re-export-only modules.
- **Circular imports are a smell**, if Module A imports Module B and Module B imports Module A, you likely need to extract the shared dependency into a third module. `forwardRef` is an escape hatch (Part 2 covers it).
- **`providers` vs `exports`**, adding a service to `providers` makes it available inside that module. Adding it to `exports` makes it available to any module that imports this one. Forgetting `exports` is the most common beginner mistake.
- **`start:dev` uses `ts-node`**, `start:prod` uses the compiled JavaScript in `dist/`. Always build before deploying: `npm run build`.
- **Decorator order on class members matters**, TypeScript applies decorators bottom-up when multiple are stacked. This matters most for method decorators in Part 7.

## What's next

Part 2 covers dependency injection in depth: provider scopes, custom injection tokens, module imports and exports, and the `forwardRef` escape hatch.

## References

- [NestJS, First steps](https://docs.nestjs.com/first-steps)
- [NestJS, Modules](https://docs.nestjs.com/modules)
- [NestJS, Controllers](https://docs.nestjs.com/controllers)
- [NestJS, Providers](https://docs.nestjs.com/providers)
