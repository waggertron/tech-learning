---
title: "Part 3, REST controllers"
description: "Everything the @Controller decorator gives you: route params, query strings, request bodies, HTTP status codes, response headers, and how NestJS serializes responses automatically."
parent: nestjs
tags: [nestjs, typescript, nodejs, web, backend, api]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## Controller basics

A controller maps HTTP routes to handler methods. The path prefix on `@Controller` combines with method-level decorators to produce the full route.

```typescript
@Controller('articles')   // prefix: /articles
export class ArticlesController {
  @Get()             // GET /articles
  findAll() { ... }

  @Get(':id')        // GET /articles/:id
  findOne() { ... }

  @Post()            // POST /articles
  create() { ... }
}
```

## HTTP method decorators

NestJS provides a decorator for every standard HTTP method:

```typescript
import {
  Controller, Get, Post, Put, Patch, Delete, Options, Head,
} from '@nestjs/common';

@Controller('resources')
export class ResourcesController {
  @Get()        // retrieve collection
  findAll() {}

  @Get(':id')   // retrieve one
  findOne() {}

  @Post()       // create
  create() {}

  @Put(':id')   // full replace
  replace() {}

  @Patch(':id') // partial update
  update() {}

  @Delete(':id') // delete
  remove() {}
}
```

## Route parameters with @Param

`:id` in the route pattern becomes a named segment. `@Param('id')` extracts it as a string.

```typescript
@Get(':id')
findOne(@Param('id') id: string) {
  return this.articlesService.findOne(+id);   // coerce to number with +
}
```

Multiple params:

```typescript
@Get(':categoryId/articles/:articleId')
findArticle(
  @Param('categoryId') categoryId: string,
  @Param('articleId') articleId: string,
) {
  return this.service.find(+categoryId, +articleId);
}
```

Get the entire params object:

```typescript
@Get(':id')
findOne(@Param() params: { id: string }) {
  return params.id;
}
```

## Query strings with @Query

`@Query()` extracts URL query parameters (`?page=2&limit=10`):

```typescript
@Get()
findAll(
  @Query('page') page: string = '1',
  @Query('limit') limit: string = '10',
) {
  return this.service.findAll({ page: +page, limit: +limit });
}
```

Get all query params as an object:

```typescript
@Get()
findAll(@Query() query: { page?: string; limit?: string; search?: string }) {
  return this.service.findAll(query);
}
```

## Request body with @Body

`@Body()` parses the incoming JSON request body. Pair it with a DTO class for type safety (covered in Part 6 with validation):

```typescript
export class CreateArticleDto {
  title: string;
  content: string;
  published: boolean;
}

@Post()
create(@Body() dto: CreateArticleDto) {
  return this.service.create(dto);
}
```

Extract a single field from the body:

```typescript
@Post()
create(@Body('title') title: string) {
  // only the title field
}
```

## Request headers with @Headers

```typescript
import { Headers } from '@nestjs/common';

@Get()
findAll(@Headers('authorization') auth: string) {
  // auth is the Authorization header value
}

@Get()
findAll(@Headers() headers: Record<string, string>) {
  // all headers
}
```

## The raw request and response objects

When you need access to the underlying Express (or Fastify) objects:

```typescript
import { Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Get()
findAll(@Req() req: Request, @Res() res: Response) {
  res.status(200).json({ data: [] });
}
```

Warning: injecting `@Res()` bypasses NestJS's response serialization pipeline. Use it only when you need to stream a file or set raw cookies. For everything else, return values from the handler and let Nest serialize them.

## HTTP status codes with @HttpCode

By default, POST returns 201 and everything else returns 200. Override with `@HttpCode`:

```typescript
import { HttpCode } from '@nestjs/common';

@Post()
@HttpCode(202)   // 202 Accepted
startJob(@Body() dto: StartJobDto) {
  return this.service.startJob(dto);
}

@Delete(':id')
@HttpCode(204)   // 204 No Content
remove(@Param('id') id: string) {
  this.service.remove(+id);
  // return nothing; 204 has no response body
}
```

## Response headers with @Header

```typescript
import { Header } from '@nestjs/common';

@Get('export')
@Header('Content-Type', 'text/csv')
@Header('Content-Disposition', 'attachment; filename="export.csv"')
exportCsv() {
  return this.service.generateCsv();
}
```

## Redirects with @Redirect

```typescript
import { Redirect } from '@nestjs/common';

@Get('legacy/:id')
@Redirect('https://newsite.example.com/articles', 301)
redirectLegacy() {}

// Dynamic redirect: return an object with url and optional statusCode
@Get('short/:code')
@Redirect()
resolveShortUrl(@Param('code') code: string) {
  const url = this.shortenerService.resolve(code);
  return { url, statusCode: 302 };
}
```

## Route wildcards

```typescript
@Get('ab*cd')   // matches abcd, ab_cd, ab123cd, etc.
wildcard() {}
```

## Response serialization

When a controller method returns a plain object or array, NestJS calls `JSON.stringify` on it. When it returns a Promise, Nest awaits it first.

To exclude properties from serialization (like passwords), use class-transformer's `@Exclude()` decorator and `ClassSerializerInterceptor`:

```typescript
import { Exclude } from 'class-transformer';

export class UserEntity {
  id: number;
  email: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
```

Enable the interceptor globally in `main.ts`:

```typescript
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
```

Then return instances of the entity class from your controller:

```typescript
@Get(':id')
async findOne(@Param('id') id: string) {
  const user = await this.usersService.findOne(+id);
  return new UserEntity(user);   // password is excluded from the response
}
```

## A complete CRUD controller example

```typescript
import {
  Controller, Get, Post, Put, Patch, Delete,
  Param, Query, Body, HttpCode,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.articlesService.findAll({ page: +page, limit: +limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.articlesService.create(dto);
  }

  @Put(':id')
  replace(@Param('id') id: string, @Body() dto: CreateArticleDto) {
    return this.articlesService.replace(+id, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.articlesService.update(+id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}
```

## Route ordering

NestJS registers routes in the order they appear in the class. A wildcard route or a parameterized route (`:id`) placed before a literal route will swallow the literal.

```typescript
// Bad: ':id' matches 'featured', so featured() is never reached
@Get(':id')
findOne() {}

@Get('featured')
featured() {}

// Good: literal before param
@Get('featured')
featured() {}

@Get(':id')
findOne() {}
```

## Gotchas at this stage

- **`@Res()` disables automatic serialization**, if you inject the response object, you own the response. Returning a value from the method has no effect.
- **Query params are always strings**, NestJS does not coerce `?page=2` to a number. Use `+page` or a ParseIntPipe (Part 6) to convert.
- **Route param coercion**, `:id` is a string. `+id` converts it; `NaN` comes back if the segment isn't numeric. Validate inputs (Part 6).
- **Prefix trailing slashes**, `@Controller('users/')` and `@Get('/')` produce double slashes in some edge cases. Keep prefixes without trailing slashes.
- **No body on GET/DELETE by HTTP spec**, some clients ignore a body on GET. NestJS doesn't stop you from reading `@Body()` on a GET, but you'll run into client interop issues.

## What's next

Part 4 integrates TypeORM: entities, repositories, relations, migrations, and transactions against a real database.

## References

- [NestJS, Controllers](https://docs.nestjs.com/controllers)
- [NestJS, Serialization](https://docs.nestjs.com/techniques/serialization)
- [class-transformer documentation](https://github.com/typestack/class-transformer)
