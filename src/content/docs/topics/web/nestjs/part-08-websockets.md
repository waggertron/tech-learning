---
title: "Part 8, WebSockets"
description: "Add real-time communication to a NestJS app with @WebSocketGateway and Socket.io: handle messages with @SubscribeMessage, manage rooms, broadcast events, and use gateway lifecycle hooks."
parent: nestjs
tags: [nestjs, typescript, nodejs, web, backend, api]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## Install

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
npm install -D @types/socket.io
```

NestJS supports both Socket.io and the native WebSocket adapter. This part uses Socket.io because it handles reconnection, rooms, and namespaces out of the box.

## Your first gateway

A gateway is a class decorated with `@WebSocketGateway()`. It handles WebSocket connections alongside your existing HTTP server on the same port by default.

```typescript
import {
  WebSocketGateway, WebSocketServer,
  SubscribeMessage, MessageBody, ConnectedSocket,
  OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },   // configure properly in production
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket): string {
    return 'pong';   // returned value is emitted back as 'ping' acknowledgment
  }
}
```

## Register the gateway in a module

Gateways are providers. Register them in a module's `providers` array:

```typescript
import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway],
})
export class EventsModule {}
```

## @SubscribeMessage: handling events

```typescript
@SubscribeMessage('message')
handleMessage(
  @MessageBody() data: { text: string },
  @ConnectedSocket() client: Socket,
): void {
  this.logger.log(`Message from ${client.id}: ${data.text}`);
  // emit to all clients except the sender
  client.broadcast.emit('message', { from: client.id, text: data.text });
}
```

Returning a value from a `@SubscribeMessage` handler sends an acknowledgment back to the client:

```typescript
@SubscribeMessage('createRoom')
handleCreateRoom(
  @MessageBody() data: { name: string },
  @ConnectedSocket() client: Socket,
): { roomId: string } {
  const roomId = crypto.randomUUID();
  client.join(roomId);
  return { roomId };   // client callback receives this
}
```

Client-side (with Socket.io client):

```javascript
socket.emit('createRoom', { name: 'dev-chat' }, (response) => {
  console.log('Room created:', response.roomId);
});
```

## Rooms

Socket.io rooms let you broadcast to subsets of connected clients. A client can be in multiple rooms simultaneously.

```typescript
@SubscribeMessage('joinRoom')
handleJoinRoom(
  @MessageBody() data: { roomId: string },
  @ConnectedSocket() client: Socket,
): void {
  client.join(data.roomId);
  // notify others in the room
  client.to(data.roomId).emit('userJoined', { userId: client.id });
}

@SubscribeMessage('leaveRoom')
handleLeaveRoom(
  @MessageBody() data: { roomId: string },
  @ConnectedSocket() client: Socket,
): void {
  client.leave(data.roomId);
  client.to(data.roomId).emit('userLeft', { userId: client.id });
}

@SubscribeMessage('roomMessage')
handleRoomMessage(
  @MessageBody() data: { roomId: string; text: string },
  @ConnectedSocket() client: Socket,
): void {
  this.server.to(data.roomId).emit('roomMessage', {
    from: client.id,
    text: data.text,
    roomId: data.roomId,
  });
}
```

## Broadcasting from outside a gateway (service-to-gateway)

Inject the gateway into a service to emit events triggered by HTTP requests or background jobs:

```typescript
// notifications.service.ts
import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly eventsGateway: EventsGateway) {}

  notifyUser(userId: string, payload: unknown) {
    // if users join a room named by their userId on connect, this targets them
    this.eventsGateway.server.to(userId).emit('notification', payload);
  }

  broadcast(event: string, payload: unknown) {
    this.eventsGateway.server.emit(event, payload);
  }
}
```

Register `EventsGateway` in exports so `NotificationsService` can inject it:

```typescript
@Module({
  providers: [EventsGateway, NotificationsService],
  exports: [EventsGateway, NotificationsService],
})
export class EventsModule {}
```

## Namespaces

Namespaces separate WebSocket traffic into logical channels on a single connection:

```typescript
@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway { ... }

@WebSocketGateway({ namespace: '/notifications' })
export class NotificationsGateway { ... }
```

Client-side:

```javascript
const chatSocket = io('http://localhost:3000/chat');
const notifSocket = io('http://localhost:3000/notifications');
```

## Gateway lifecycle hooks

| Interface | Method | When called |
| --- | --- | --- |
| `OnGatewayInit` | `afterInit(server)` | After the WebSocket server is created |
| `OnGatewayConnection` | `handleConnection(client, ...args)` | When a client connects |
| `OnGatewayDisconnect` | `handleDisconnect(client)` | When a client disconnects |

All three are optional. Implement only what you need.

## Authentication in WebSocket gateways

Use a guard or validate in `handleConnection`:

```typescript
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: { origin: '*' } })
export class AuthenticatedGateway implements OnGatewayConnection {
  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ??
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) throw new Error('No token');

      const payload = this.jwtService.verify(token);
      client.data.user = payload;   // store on socket for later use
    } catch {
      client.emit('error', { message: 'Unauthorized' });
      client.disconnect(true);
    }
  }

  @SubscribeMessage('secureEvent')
  handleSecureEvent(@ConnectedSocket() client: Socket) {
    const user = client.data.user;
    return { message: `Hello ${user.email}` };
  }
}
```

Client sends the token in the handshake:

```javascript
const socket = io('http://localhost:3000', {
  auth: { token: 'eyJhb...' },
});
```

## Using guards with gateways

Guards work the same way in gateways as in HTTP controllers, but the execution context is WebSocket-specific:

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    const user = client.data.user;
    if (!user) throw new WsException('Unauthorized');
    return true;
  }
}
```

Apply:

```typescript
@SubscribeMessage('adminEvent')
@UseGuards(WsJwtGuard)
handleAdminEvent(@ConnectedSocket() client: Socket) {}
```

Throw `WsException` (from `@nestjs/websockets`) rather than `HttpException` in gateway context. The HTTP exception filter doesn't apply to WebSocket messages.

## A chat room example (end to end)

```typescript
@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private rooms = new Map<string, Set<string>>();   // roomId -> Set<clientId>

  handleConnection(client: Socket) {
    client.emit('connected', { id: client.id });
  }

  handleDisconnect(client: Socket) {
    // remove from all rooms
    for (const [roomId, members] of this.rooms) {
      if (members.delete(client.id)) {
        this.server.to(roomId).emit('memberLeft', { userId: client.id, roomId });
      }
    }
  }

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);
    if (!this.rooms.has(data.roomId)) {
      this.rooms.set(data.roomId, new Set());
    }
    this.rooms.get(data.roomId)!.add(client.id);

    const members = [...(this.rooms.get(data.roomId) ?? [])];
    client.to(data.roomId).emit('memberJoined', { userId: client.id });
    return { roomId: data.roomId, members };
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { roomId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const payload = {
      from: client.id,
      text: data.text,
      roomId: data.roomId,
      timestamp: new Date().toISOString(),
    };
    this.server.to(data.roomId).emit('message', payload);
  }
}
```

## Gotchas at this stage

- **Same port, different protocols**, by default the WebSocket gateway shares port 3000 with HTTP. If you need a separate port: `@WebSocketGateway(3001)`.
- **CORS must match your HTTP CORS config**, missing WebSocket CORS config is a common source of "connection refused" in the browser while curl works fine.
- **`client.broadcast.emit` excludes the sender; `server.emit` includes everyone**, easy to swap and cause duplicate messages on the sender side.
- **`WsException` vs `HttpException`**, HTTP exception filters don't apply in WS context. Throw `WsException` or the client receives a raw unformatted error.
- **Memory leaks from rooms**, if you track room membership in a Map on the gateway, always clean up in `handleDisconnect`. Otherwise disconnected clients remain in room member lists forever.
- **Scaling requires a Redis adapter**, the default in-memory pub/sub doesn't work across multiple Node processes. `@socket.io/redis-adapter` lets multiple instances share events.

## What's next

Part 9 covers microservices: the `@nestjs/microservices` package, TCP and Redis/RabbitMQ transports, `@MessagePattern`, `@EventPattern`, `ClientProxy`, and hybrid HTTP + microservice apps.

## References

- [NestJS, Gateways](https://docs.nestjs.com/websockets/gateways)
- [NestJS, Exception filters (WebSockets)](https://docs.nestjs.com/websockets/exception-filters)
- [Socket.io documentation](https://socket.io/docs/v4/)
- [NestJS, WebSockets guards](https://docs.nestjs.com/websockets/guards)
