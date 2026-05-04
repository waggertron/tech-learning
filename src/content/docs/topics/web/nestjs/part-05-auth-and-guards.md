---
title: "Part 5: Auth and guards"
description: "Add JWT authentication with @nestjs/passport and @nestjs/jwt, protect routes with AuthGuard, write custom guards, and implement role-based access control using @SetMetadata and a custom decorator."
parent: nestjs
tags: [nestjs, typescript, nodejs, web, backend, api]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## Install

```bash
npm install @nestjs/passport @nestjs/jwt passport passport-jwt
npm install -D @types/passport-jwt
```

## The auth module

Create a dedicated `AuthModule` that owns the JWT strategy, the auth service, and the login controller:

```bash
nest generate module auth
nest generate service auth
nest generate controller auth
```

## Auth service: validate users and sign tokens

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(user: { id: number; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
```

## JWT strategy

A Passport strategy is a provider that extends a base class. The JWT strategy extracts the token from the `Authorization: Bearer <token>` header, verifies it, and returns the payload as `req.user`.

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // Return value is attached to req.user
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
```

## Auth module wiring

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

## Auth controller: login endpoint

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

export class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }
}
```

## Protecting routes with AuthGuard

`AuthGuard('jwt')` runs the JWT strategy against the incoming request. If the token is missing or invalid, it returns 401.

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(AuthGuard('jwt'))
  getProfile() {
    return { message: 'protected' };
  }
}
```

## Accessing the current user with @Request

After a guard passes, `req.user` holds the value returned by `validate()` in the strategy:

```typescript
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req: { user: { id: number; email: string; role: string } }) {
    return req.user;
  }
}
```

## A cleaner @CurrentUser decorator

Typing `@Request() req` and then accessing `req.user` everywhere is repetitive. A custom parameter decorator fixes it:

```typescript
// decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

Usage:

```typescript
@Get('me')
@UseGuards(AuthGuard('jwt'))
getMe(@CurrentUser() user: { id: number; email: string; role: string }) {
  return user;
}
```

## Apply a guard globally

To protect all routes by default and opt out per-route, apply the guard globally in `main.ts` and use a custom decorator to mark public routes:

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
  await app.listen(3000);
}

bootstrap();
```

## Custom guard: JwtAuthGuard with public route support

```typescript
// auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}

// auth/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

Mark public routes:

```typescript
@Post('login')
@Public()   // skips JwtAuthGuard
login(@Body() dto: LoginDto) {
  return this.authService.login(dto);
}
```

## Role-based access control

### Set roles with @SetMetadata

```typescript
// decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

### Roles guard

```typescript
// auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;   // no roles required, any authenticated user passes

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

### Using both guards together

```typescript
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('users')
  @Roles(Role.Admin)
  listUsers() {
    return this.usersService.findAll();
  }
}
```

Guards run in the order listed in `@UseGuards`. `JwtAuthGuard` must run first so `req.user` is populated when `RolesGuard` reads it.

## Hash passwords on create

Never store plain-text passwords:

```bash
npm install bcrypt
npm install -D @types/bcrypt
```

```typescript
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  async create(dto: CreateUserDto): Promise<User> {
    const hashed = await bcrypt.hash(dto.password, 12);
    const user = this.usersRepo.create({ ...dto, password: hashed });
    return this.usersRepo.save(user);
  }
}
```

## Gotchas at this stage

- **`JWT_SECRET` must be the same across services**, a token signed with one secret can't be verified with another. Use an environment variable and a config service, never hardcode it.
- **Guards run before interceptors and pipes**, a request rejected by a guard never reaches validation or business logic. This is the correct order.
- **`AuthGuard` vs custom guard**, extending `AuthGuard('jwt')` gives you Passport's 401 behavior automatically. A plain `CanActivate` implementation requires you to throw `UnauthorizedException` manually.
- **`getAllAndOverride` vs `getAllAndMerge`**, `getAllAndOverride` returns the first defined value (handler beats class). `getAllAndMerge` merges arrays from both. Use `getAllAndMerge` for roles so a controller-level `@Roles(Role.Admin)` and a method-level `@Roles(Role.SuperAdmin)` combine properly.
- **Token expiry and refresh**, this series covers access tokens only. For production, add a refresh token flow: longer-lived token stored in an httpOnly cookie, separate `/auth/refresh` endpoint.

## What's next

Part 6 covers validation and pipes: `class-validator` DTOs, global `ValidationPipe`, custom pipes, and common built-in pipes like `ParseIntPipe` and `ParseUUIDPipe`.

## References

- [NestJS, Authentication](https://docs.nestjs.com/security/authentication)
- [NestJS, Authorization](https://docs.nestjs.com/security/authorization)
- [NestJS, Guards](https://docs.nestjs.com/guards)
- [passport-jwt](https://github.com/mikenicholson/passport-jwt)
