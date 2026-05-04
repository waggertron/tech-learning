---
title: "Part 9, Microservices"
description: "Break a NestJS app into services with @nestjs/microservices: TCP and Redis/RabbitMQ transports, @MessagePattern for request-reply, @EventPattern for fire-and-forget, ClientProxy for sending messages, and hybrid HTTP plus microservice apps."
parent: nestjs
tags: [nestjs, typescript, nodejs, web, backend, api]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## Install

```bash
npm install @nestjs/microservices

# For Redis transport
npm install ioredis

# For RabbitMQ transport
npm install amqplib amqp-connection-manager
npm install -D @types/amqplib
```

## What NestJS microservices are

`@nestjs/microservices` is a transport-agnostic messaging layer. Instead of HTTP, services communicate over:

- **TCP** (built-in, good for internal networks)
- **Redis** (pub/sub; good for event broadcasting)
- **RabbitMQ** (durable queues; good for reliable job processing)
- **Kafka, NATS, gRPC** (also supported, not covered here)

The same `@MessagePattern` and `@EventPattern` decorators work across transports. You swap the transport configuration without changing business logic.

## A standalone microservice

A microservice starts without HTTP. It listens on a transport and processes messages:

```typescript
// main.ts (microservice entry point)
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3001,
      },
    },
  );

  await app.listen();
  console.log('Microservice listening on TCP :3001');
}

bootstrap();
```

## @MessagePattern: request-reply

`@MessagePattern` marks a controller method as the handler for a specific message type. The caller sends a message and waits for a response (like an HTTP request, but over the transport).

```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'get_user' })
  async getUser(@Payload() data: { id: number }) {
    return this.usersService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Payload() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @MessagePattern({ cmd: 'list_users' })
  async listUsers(@Payload() data: { page: number; limit: number }) {
    return this.usersService.findAll(data);
  }
}
```

## @EventPattern: fire-and-forget

`@EventPattern` handles one-way events. The caller emits and doesn't wait for a response. Use this for notifications, cache invalidation, and audit logging.

```typescript
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class EventsController {
  @EventPattern('user_created')
  async handleUserCreated(@Payload() data: { userId: number; email: string }) {
    await this.emailService.sendWelcome(data.email);
    await this.analyticsService.track('user_created', data);
  }

  @EventPattern('order_placed')
  async handleOrderPlaced(@Payload() data: { orderId: string }) {
    await this.inventoryService.reserveItems(data.orderId);
  }
}
```

## ClientProxy: sending messages from an HTTP service

The HTTP-facing service sends messages to microservices using `ClientProxy`. Register the client in a module:

```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'users-service', port: 3001 },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
```

Inject and use in a service:

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    // send: request-reply (returns Observable, convert to Promise)
    const user = await firstValueFrom(
      this.usersClient.send<User>({ cmd: 'get_user' }, { id: dto.userId }),
    );

    if (!user) throw new NotFoundException('User not found');

    // emit: fire-and-forget
    this.usersClient.emit('order_placed', { orderId: dto.id, userId: user.id });

    return this.ordersRepo.create(dto);
  }
}
```

`send()` returns an Observable. Use `firstValueFrom` (from `rxjs`) to convert it to a Promise. `emit()` is truly fire-and-forget and returns void.

## Redis transport

Redis pub/sub is good for broadcasting events to multiple subscribers:

```typescript
// Microservice bootstrap
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.REDIS,
  options: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: +(process.env.REDIS_PORT ?? 6379),
  },
});

// Client registration
ClientsModule.register([
  {
    name: 'EVENTS_SERVICE',
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: +(process.env.REDIS_PORT ?? 6379),
    },
  },
])
```

## RabbitMQ transport

RabbitMQ provides durable queues with acknowledgment. Messages survive process restarts.

```typescript
// Microservice bootstrap
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
    queue: 'orders_queue',
    queueOptions: {
      durable: true,        // queue survives RabbitMQ restart
    },
    noAck: false,           // manual acknowledgment
    prefetchCount: 1,       // process one message at a time per consumer
  },
});

// Client registration
ClientsModule.register([
  {
    name: 'ORDERS_SERVICE',
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
      queue: 'orders_queue',
      queueOptions: { durable: true },
    },
  },
])
```

## Hybrid app: HTTP + microservice on one process

A hybrid app listens for both HTTP and microservice messages. Useful during migration or when one service needs to be both a REST API and a message consumer:

```typescript
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add a microservice listener to the HTTP app
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { port: 3001 },
  });

  await app.startAllMicroservices();
  await app.listen(3000);

  console.log('HTTP on :3000, TCP microservice on :3001');
}

bootstrap();
```

## Error handling with microservices

Errors thrown in a `@MessagePattern` handler propagate back to the caller as an error response. The caller's `send()` Observable emits an error:

```typescript
// In the microservice handler:
@MessagePattern({ cmd: 'get_user' })
async getUser(@Payload() data: { id: number }) {
  const user = await this.usersService.findOne(data.id);
  if (!user) throw new RpcException('User not found');
  return user;
}

// In the calling service:
try {
  const user = await firstValueFrom(
    this.usersClient.send<User>({ cmd: 'get_user' }, { id: 99 }),
  );
} catch (err) {
  // err.message === 'User not found'
  throw new NotFoundException(err.message);
}
```

`RpcException` (from `@nestjs/microservices`) serializes the error properly over the transport. Throwing a plain `Error` or `HttpException` works but produces a less structured response.

## Dynamic client configuration

For configuration-driven client setup:

```typescript
ClientsModule.registerAsync([
  {
    name: 'USERS_SERVICE',
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService): ClientProviderOptions => ({
      transport: Transport.TCP,
      options: {
        host: config.get('USERS_SERVICE_HOST'),
        port: config.get<number>('USERS_SERVICE_PORT'),
      },
    }),
  },
])
```

## Handling context in message handlers

Use `@Ctx()` to access the raw transport context (channel, original message) when you need to manually acknowledge messages:

```typescript
import { Payload, Ctx, RmqContext, MessagePattern } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';

@MessagePattern('process_job')
async processJob(
  @Payload() data: JobDto,
  @Ctx() context: RmqContext,
) {
  const channel: Channel = context.getChannelRef();
  const originalMsg: Message = context.getMessage();

  try {
    await this.jobService.process(data);
    channel.ack(originalMsg);   // acknowledge on success
  } catch (err) {
    channel.nack(originalMsg, false, false);   // dead-letter on failure
  }
}
```

## Service-to-service communication patterns

```
REST client
    |  HTTP
    v
API Gateway (NestJS HTTP app)
    |  TCP/Redis/RabbitMQ
    +---------> Users Service (microservice)
    |
    +---------> Orders Service (microservice)
    |              |  RabbitMQ event
    |              v
    +---------> Inventory Service (microservice)
```

The API Gateway handles public-facing HTTP and translates to internal message patterns. Internal services communicate via events for loose coupling.

## Gotchas at this stage

- **`firstValueFrom` vs `lastValueFrom`**, `send()` emits exactly one value and completes. Both work, but `firstValueFrom` is semantically clearer.
- **`ClientProxy` must be connected before use**, call `await client.connect()` if you're sending messages at startup (e.g., in a service's `onModuleInit`).
- **TCP transport is not production-hardened**, TCP has no built-in retries, dead-letter queues, or persistence. Use RabbitMQ or Kafka for production workloads that can't lose messages.
- **Pattern matching is by value equality**, `{ cmd: 'get_user' }` on the sender must exactly match `@MessagePattern({ cmd: 'get_user' })` on the receiver. A typo causes the message to silently go unhandled.
- **Scaling with Redis**, multiple instances of a Redis-transport microservice each receive every message (pub/sub). For work queues where each message should be processed once, use RabbitMQ or Kafka instead.

## What's next

Part 10 covers testing and production: unit testing with Jest and `createTestingModule`, e2e tests with Supertest, mocking providers, generating Swagger/OpenAPI docs, Docker containerization, and health checks.

## References

- [NestJS, Microservices overview](https://docs.nestjs.com/microservices/basics)
- [NestJS, Redis transport](https://docs.nestjs.com/microservices/redis)
- [NestJS, RabbitMQ transport](https://docs.nestjs.com/microservices/rabbitmq)
- [NestJS, Exception filters (microservices)](https://docs.nestjs.com/microservices/exception-filters)
