---
title: "Part 6, Validation and pipes"
description: "Validate and transform request data with class-validator and class-transformer, apply ValidationPipe globally, write custom pipes, and use built-in pipes like ParseIntPipe and ParseUUIDPipe."
parent: nestjs
tags: [nestjs, typescript, nodejs, web, backend, api]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## What pipes do

A pipe sits between the router and the controller method. It receives the raw incoming value (route param, query string, or body) and either:

1. **Transforms** it (string `"42"` to number `42`)
2. **Validates** it (throws a `BadRequestException` if the value doesn't match constraints)

Pipes are the right place for this work. Not the controller, not the service.

## Install class-validator and class-transformer

```bash
npm install class-validator class-transformer
```

## Enable ValidationPipe globally

Apply the pipe once at the application level in `main.ts` so every route is covered:

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // strip properties not in the DTO
      forbidNonWhitelisted: true,  // throw 400 if extra properties sent
      transform: true,        // auto-transform payloads to DTO class instances
      transformOptions: {
        enableImplicitConversion: true,  // coerce query param strings to numbers/booleans
      },
    }),
  );

  await app.listen(3000);
}

bootstrap();
```

`whitelist: true` silently removes unknown properties. `forbidNonWhitelisted: true` rejects the request with 400 instead. Pick one; production APIs usually use `whitelist: true` for forward compatibility.

## DTOs with class-validator decorators

A DTO (Data Transfer Object) is a plain class decorated with validation constraints. With `transform: true`, NestJS instantiates the class before passing it to the controller.

```typescript
import {
  IsString, IsEmail, IsInt, Min, Max, IsOptional,
  IsBoolean, Length, IsEnum, IsArray, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 72)
  password: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  displayName?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.User;
}
```

The controller stays clean:

```typescript
@Post()
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

If validation fails, `ValidationPipe` throws a `BadRequestException` with a structured array of constraint violations before the controller method is called.

## Nested object validation

Use `@ValidateNested()` and `@Type()` to validate nested objects:

```typescript
import { Type } from 'class-transformer';
import { ValidateNested, IsString } from 'class-validator';

export class AddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  zip: string;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
```

Without `@Type()`, class-transformer doesn't know how to instantiate the nested class and validation skips it silently.

## Array item validation

```typescript
import { IsArray, IsInt, ArrayMinSize } from 'class-validator';

export class DeleteManyDto {
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  ids: number[];
}
```

## Partial DTOs for PATCH endpoints

`PartialType` from `@nestjs/mapped-types` creates a new DTO where all properties are optional, inheriting the validation decorators:

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

Now the PATCH endpoint validates any subset of fields without duplicating decorators.

## Built-in transformation pipes

NestJS ships with several commonly needed pipes:

### ParseIntPipe

Converts a string route param or query string to an integer. Throws 400 if conversion fails.

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  // id is already a number here
  return this.usersService.findOne(id);
}
```

Customize the error response:

```typescript
@Get(':id')
findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {}
```

### ParseUUIDPipe

Validates that the param is a valid UUID:

```typescript
@Get(':id')
findOne(@Param('id', ParseUUIDPipe) id: string) {
  return this.service.findOne(id);
}
```

Optionally specify UUID version:

```typescript
@Param('id', new ParseUUIDPipe({ version: '4' })) id: string
```

### ParseBoolPipe

Converts `"true"` / `"false"` strings to booleans:

```typescript
@Get()
findAll(@Query('published', ParseBoolPipe) published: boolean) {}
```

### ParseFloatPipe, ParseArrayPipe, ParseEnumPipe

```typescript
@Query('price', ParseFloatPipe) price: number

@Query('ids', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[]

@Param('role', new ParseEnumPipe(UserRole)) role: UserRole
```

### DefaultValuePipe

Provides a fallback when the value is `undefined`:

```typescript
@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number
```

## Custom pipes

A custom pipe implements `PipeTransform`:

```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class PositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const n = parseInt(value, 10);
    if (isNaN(n) || n <= 0) {
      throw new BadRequestException(`${metadata.data} must be a positive integer`);
    }
    return n;
  }
}
```

Use it on a specific parameter:

```typescript
@Get(':id')
findOne(@Param('id', PositiveIntPipe) id: number) {}
```

Or apply globally:

```typescript
app.useGlobalPipes(new PositiveIntPipe());
```

## Transformation-only pipe

Pipes can transform without validation:

```typescript
@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: unknown): unknown {
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'object' && value !== null) {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]),
      );
    }
    return value;
  }
}
```

## DTO design patterns

### Command pattern (separate create and update)

```typescript
export class CreatePostDto {
  @IsString() @Length(1, 200)
  title: string;

  @IsString()
  content: string;

  @IsOptional() @IsArray() @IsString({ each: true })
  tags?: string[];
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}
```

### Pick and Omit

`@nestjs/mapped-types` provides `PickType` and `OmitType`:

```typescript
import { OmitType, PickType } from '@nestjs/mapped-types';

// Everything from CreateUserDto except password
export class UserResponseDto extends OmitType(CreateUserDto, ['password'] as const) {}

// Only the email field
export class ForgotPasswordDto extends PickType(CreateUserDto, ['email'] as const) {}
```

## Common class-validator decorators reference

| Decorator | What it checks |
| --- | --- |
| `@IsString()` | typeof value === 'string' |
| `@IsInt()` | integer number |
| `@IsNumber()` | any number |
| `@IsBoolean()` | boolean |
| `@IsEmail()` | valid email format |
| `@IsUrl()` | valid URL |
| `@IsUUID()` | valid UUID |
| `@IsDateString()` | ISO 8601 date string |
| `@IsEnum(Enum)` | value in enum values |
| `@IsArray()` | array |
| `@IsOptional()` | allow undefined (skips other validators if missing) |
| `@IsNotEmpty()` | not empty string / null / undefined |
| `@Length(min, max)` | string length in range |
| `@Min(n)` / `@Max(n)` | number in range |
| `@Matches(/regex/)` | matches regular expression |

## Gotchas at this stage

- **`transform: true` is required for `@Type()` to work**, without it, class-transformer doesn't run and nested object validation silently fails.
- **Query strings are always strings**, even with `enableImplicitConversion: true`, complex types need explicit `@Type()`. The implicit conversion only handles primitives (string to number, string to boolean).
- **`whitelist` strips unknown properties before validation**, if you're debugging and your DTO properties are always empty, check that `whitelist` isn't stripping a misconfigured property name.
- **`@IsOptional()` does not mean nullable**, it means the property can be absent (`undefined`). To also allow `null`, add `@IsNull()` or use `{ nullable: true }` in `@Column()`.
- **Validation error messages are arrays**, the default 400 response has a `message` array where each element describes one constraint violation. Log the raw error during development; it's detailed.

## What's next

Part 7 covers interceptors and exception filters: logging, response transformation, global error handling, and how middleware, guards, interceptors, pipes, and filters relate in the request lifecycle.

## References

- [NestJS, Pipes](https://docs.nestjs.com/pipes)
- [NestJS, Validation](https://docs.nestjs.com/techniques/validation)
- [class-validator](https://github.com/typestack/class-validator)
- [class-transformer](https://github.com/typestack/class-transformer)
- [NestJS, Mapped types](https://docs.nestjs.com/openapi/mapped-types)
