---
title: "Part 10: Testing and production"
description: "Unit-test NestJS with Jest and createTestingModule, write e2e tests with Supertest, mock providers cleanly, generate Swagger/OpenAPI docs with @nestjs/swagger, containerize with Docker, and add health checks via @nestjs/terminus."
parent: nestjs
tags: [nestjs, typescript, nodejs, web, backend, api]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## Testing overview

NestJS ships with Jest configured out of the box. The project scaffold includes:

- `jest` config in `package.json` for unit tests
- `jest-e2e.json` for end-to-end tests
- `*.spec.ts` files alongside source (unit tests)
- `test/*.e2e-spec.ts` files (e2e tests)

Run them:

```bash
npm run test          # unit tests (watch mode by default in dev)
npm run test:cov      # unit tests with coverage report
npm run test:e2e      # end-to-end tests
```

## Unit testing with createTestingModule

`Test.createTestingModule()` builds a minimal Nest application with only the providers you specify. This lets you test a service in isolation without starting the full app.

### Testing a service

```typescript
// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const mockRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  it('findAll returns all users', async () => {
    const users = [{ id: 1, email: 'alice@example.com' }] as User[];
    repo.find.mockResolvedValue(users);

    const result = await service.findAll();

    expect(repo.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(users);
  });

  it('findOne throws NotFoundException when user does not exist', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('create saves and returns the new user', async () => {
    const dto = { email: 'bob@example.com', password: 'secret123' };
    const created = { id: 2, ...dto } as User;
    repo.create.mockReturnValue(created);
    repo.save.mockResolvedValue(created);

    const result = await service.create(dto as any);

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(created);
  });
});
```

### Testing a controller

Controllers are thin, so their tests mainly verify that the right service method is called:

```typescript
// users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const mockService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  it('findAll delegates to UsersService.findAll', async () => {
    service.findAll.mockResolvedValue([]);
    await controller.findAll('1', '10');
    expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });
});
```

### Mocking external services

When your service depends on external HTTP calls, email, or third-party SDKs, mock them with `useValue`:

```typescript
const module = await Test.createTestingModule({
  providers: [
    NotificationsService,
    {
      provide: EmailService,
      useValue: {
        send: jest.fn().mockResolvedValue(undefined),
      },
    },
    {
      provide: ConfigService,
      useValue: {
        get: jest.fn().mockReturnValue('mock-value'),
      },
    },
  ],
}).compile();
```

## End-to-end tests with Supertest

E2e tests start the full NestJS application and send real HTTP requests:

```typescript
// test/users.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        find: jest.fn().mockResolvedValue([]),
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
        save: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /users returns 200 with an array', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([]);
  });

  it('POST /users with invalid body returns 400', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'not-an-email' })
      .expect(400);
  });

  it('POST /users with valid body returns 201', async () => {
    const newUser = { id: 1, email: 'alice@example.com' };
    // update mock for this test
    const repo = app.get(getRepositoryToken(User));
    (repo.create as jest.Mock).mockReturnValue(newUser);
    (repo.save as jest.Mock).mockResolvedValue(newUser);

    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'alice@example.com', password: 'strongpass1' })
      .expect(201)
      .expect({ id: 1, email: 'alice@example.com' });
  });
});
```

For e2e tests against a real database, use a separate test database and run migrations before the test suite. Clean up with `afterEach` truncations or by wrapping tests in transactions that roll back.

## Swagger / OpenAPI with @nestjs/swagger

NestJS generates interactive API documentation from your decorators automatically.

### Install

```bash
npm install @nestjs/swagger
```

### Setup in main.ts

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('NestJS example API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
```

Visit `http://localhost:3000/api/docs` for the interactive UI.

### Decorating controllers and DTOs

```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'The user', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
```

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongpassword1', minLength: 8 })
  @IsString()
  @Length(8, 72)
  password: string;

  @ApiPropertyOptional({ example: 'Alice' })
  @IsOptional()
  @IsString()
  displayName?: string;
}
```

`@ApiProperty()` overrides type inference for properties that can't be inferred from TypeScript metadata alone. Add it to all DTO properties for complete docs.

## Dockerfile

```dockerfile
# Build stage
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]
```

Build and run:

```bash
docker build -t my-api .
docker run -p 3000:3000 --env-file .env my-api
```

## Docker Compose for local development

```yaml
# docker-compose.yml
version: '3.9'

services:
  api:
    build: .
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: development
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASS: postgres
      DB_NAME: mydb
      JWT_SECRET: dev-secret-change-in-prod
    depends_on:
      - postgres
    volumes:
      - ./src:/app/src   # hot reload in dev

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: mydb
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Health checks with @nestjs/terminus

Health checks expose an endpoint that your load balancer or orchestrator polls to know if the app is ready.

### Install

```bash
npm install @nestjs/terminus
```

### Health module

```typescript
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
})
export class HealthModule {}
```

### Health controller

```typescript
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck, HealthCheckService, TypeOrmHealthIndicator,
  DiskHealthIndicator, MemoryHealthIndicator, HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),   // 300 MB
    ]);
  }
}
```

A successful response looks like:

```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "storage": { "status": "up" },
    "memory_heap": { "status": "up" }
  },
  "error": {},
  "details": { ... }
}
```

Any indicator returning "down" flips the top-level status to "error" and the HTTP response code to 503.

## Environment configuration with @nestjs/config

```bash
npm install @nestjs/config
```

```typescript
// app.module.ts
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,    // no need to import ConfigModule in every feature module
      envFilePath: '.env',
      expandVariables: true,
    }),
  ],
})
export class AppModule {}
```

Access config values:

```typescript
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SomeService {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
  }
}
```

Validate required environment variables at startup with Joi:

```bash
npm install joi
```

```typescript
import * as Joi from 'joi';

ConfigModule.forRoot({
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432),
    JWT_SECRET: Joi.string().min(32).required(),
  }),
})
```

If a required variable is missing or invalid, the app fails to start with a clear error message, not a cryptic runtime crash.

## Graceful shutdown

NestJS supports shutdown hooks that let you drain connections before the process exits:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();   // listens for SIGTERM, SIGINT
  await app.listen(3000);
}
```

In a service, implement `OnApplicationShutdown`:

```typescript
import { Injectable, OnApplicationShutdown } from '@nestjs/common';

@Injectable()
export class QueueService implements OnApplicationShutdown {
  async onApplicationShutdown(signal: string) {
    console.log(`Received ${signal}. Draining queue...`);
    await this.drainQueue();
  }
}
```

Kubernetes sends SIGTERM before killing the pod. A graceful shutdown lets in-flight requests complete before the process exits.

## Production checklist

- `synchronize: false` in TypeORM config; run migrations explicitly
- `ValidationPipe` with `whitelist: true` applied globally
- `ConfigModule` with schema validation; fail fast on missing env vars
- `app.enableShutdownHooks()` for Kubernetes pod termination
- `/health` endpoint with database and memory checks
- Global exception filter for consistent error shape
- Logging interceptor for request tracing
- `JWT_SECRET` at least 32 random characters, from a secret manager not `.env` in production
- Rate limiting: `npm install @nestjs/throttler`
- CORS configured explicitly: `app.enableCors({ origin: ['https://app.example.com'] })`
- Helmet for HTTP security headers: `npm install helmet`, then `app.use(helmet())`
- Build with `npm run build`, run with `node dist/main` (not `ts-node`)

## Gotchas at this stage

- **`overrideProvider` in e2e tests must come before `.compile()`**, calling it after has no effect.
- **`app.close()` in `afterAll` is required**, otherwise Jest hangs waiting for open handles (the HTTP server, database pool, etc.).
- **Swagger `@ApiProperty()` on class-transformer `@Exclude()` properties still shows them in docs**, explicitly use `@ApiHideProperty()` to remove them from the schema.
- **TypeScript decorators and `emitDecoratorMetadata` are required at runtime**, the production Docker image must not strip them. Verify `tsconfig.build.json` has them enabled.
- **`npm ci --only=production` skips devDependencies**, if you use `ts-node` or `ts-jest` at runtime (you shouldn't), they won't be present in the Docker image. Always compile to `dist/` before building the image.

## Related topics

- [NestJS Part 1, Architecture and setup](./part-01-architecture-and-setup/)
- [NestJS Part 5, Auth and guards](./part-05-auth-and-guards/)
- [NestJS Part 9, Microservices](./part-09-microservices/)
- [Django, a 10-part series](../django/)

## References

- [NestJS, Testing](https://docs.nestjs.com/fundamentals/testing)
- [NestJS, OpenAPI (Swagger)](https://docs.nestjs.com/openapi/introduction)
- [NestJS, Health checks (Terminus)](https://docs.nestjs.com/recipes/terminus)
- [NestJS, Configuration](https://docs.nestjs.com/techniques/configuration)
- [NestJS, Security, Helmet](https://docs.nestjs.com/security/helmet)
