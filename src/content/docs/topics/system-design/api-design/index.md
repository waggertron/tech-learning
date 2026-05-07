---
title: API Design
description: "REST principles, GraphQL, gRPC, versioning strategies, idempotency, pagination, and the trade-offs that determine which API style fits which client and use case."
parent: system-design
tags: [system-design, api-design, rest, graphql, grpc]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

An API is the contract between a server and its clients. Good API design makes integrations predictable, versioning manageable, and errors informative. Bad API design creates breaking changes, ambiguous semantics, and clients that cannot distinguish a network error from a business logic error.

## REST

REST (Representational State Transfer) is an architectural style, not a protocol. The key constraints:

**Stateless**: each request carries all the information needed to process it. No server-side session. Authentication goes in the Authorization header on every request.

**Resource-oriented**: URLs identify resources (nouns), not actions. HTTP methods express the action (verb).

**Uniform interface**: consistent URL patterns and HTTP method semantics across the API.

```
GET    /users          -> list users
POST   /users          -> create a user
GET    /users/42       -> get user 42
PUT    /users/42       -> replace user 42 (full update)
PATCH  /users/42       -> update user 42 (partial update)
DELETE /users/42       -> delete user 42

GET    /users/42/orders       -> list orders for user 42
GET    /users/42/orders/7     -> get order 7 for user 42
```

### HTTP method idempotency

| Method | Idempotent | Safe (no side effects) |
| --- | --- | --- |
| GET | Yes | Yes |
| HEAD | Yes | Yes |
| PUT | Yes | No |
| DELETE | Yes | No |
| POST | No | No |
| PATCH | No (usually) | No |

**Idempotent** means calling the operation N times produces the same result as calling it once. DELETE /users/42 twice deletes the user once; the second call returns 404, which is fine.

POST is not idempotent by default. Submitting a payment form twice creates two charges. To make POST operations safe to retry, use an **idempotency key**: the client generates a unique ID for the request, includes it in a header (e.g. `Idempotency-Key: abc-123`), and the server stores the response keyed by that ID. On retry, the server returns the stored response instead of re-executing.

### Status codes

| Range | Meaning | Examples |
| --- | --- | --- |
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirect | 301 Moved Permanently, 304 Not Modified |
| 4xx | Client error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests |
| 5xx | Server error | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable |

Never return 200 with an error in the body. That breaks every HTTP-aware tool.

### Versioning

APIs evolve. Clients cannot always upgrade in lockstep.

**URL path versioning**: `/v1/users`, `/v2/users`. Most common. Explicit, cacheable, easy to route.

**Header versioning**: `Accept: application/vnd.myapp.v2+json`. Cleaner URLs, but requires every client to set the header. Less discoverable.

**Query param versioning**: `/users?version=2`. Pragmatic but mixes versioning with query params intended for filtering.

Best practice: use URL path versioning, maintain at least one previous version, and publish a deprecation timeline before removing a version.

## Pagination

Never return unbounded collections. A `GET /orders` that returns all 50M orders will time out.

### Offset/limit

```
GET /orders?limit=20&offset=40
```

Simple, supports jumping to arbitrary pages, easy to implement.

**Problem**: if records are inserted or deleted between page requests, items shift. Page 2 may skip a record or repeat one. Also slow on large offsets: the database must scan and discard the first 40 records.

### Cursor-based pagination

```
GET /orders?limit=20&after=cursor_opaque_value
```

The response includes a `next_cursor` pointing to the last seen item. The next request uses that cursor.

- Stable: new records do not disrupt the sequence.
- Fast: queries on an indexed column (e.g. `WHERE created_at > last_seen_timestamp`).
- No random access (cannot jump to page 5 directly).

Used by Twitter, Facebook, Stripe, GitHub APIs.

```python
from flask import Flask, request, jsonify
from base64 import b64encode, b64decode

app = Flask(__name__)

# Fake data
ORDERS = [{"id": i, "created_at": i * 1000} for i in range(1, 1001)]

@app.route("/orders")
def list_orders():
    limit = int(request.args.get("limit", 20))
    after = request.args.get("after")

    if after:
        last_id = int(b64decode(after).decode())
        items = [o for o in ORDERS if o["id"] > last_id]
    else:
        items = ORDERS

    page = items[:limit]
    next_cursor = None
    if len(items) > limit:
        next_cursor = b64encode(str(page[-1]["id"]).encode()).decode()

    return jsonify({"data": page, "next_cursor": next_cursor})
```

## GraphQL

GraphQL is a query language for APIs. Instead of many REST endpoints each returning a fixed shape, GraphQL exposes a single endpoint. The client specifies exactly which fields it needs in the query.

```graphql
query {
  user(id: "42") {
    name
    email
    orders(first: 5) {
      id
      total
      status
    }
  }
}
```

**GraphQL strengths:**
- No over-fetching (get exactly what you need, nothing more)
- No under-fetching (get related data in one request instead of N REST calls)
- Self-documenting schema (introspection)
- Strong typing

**GraphQL weaknesses:**
- N+1 query problem: fetching a list of 100 users, each with orders, naively fires 101 database queries. Mitigated by DataLoader (batch + cache).
- Caching is harder (single POST endpoint; HTTP caching relies on URL + method).
- More complex server implementation.

Best for: mobile apps (where bandwidth and round trips are expensive), complex relational data, BFF (Backend for Frontend) patterns.

## gRPC

gRPC uses HTTP/2 and Protocol Buffers (protobuf) for serialization. You define service interfaces in a `.proto` file and generate client/server code in any supported language.

```proto
syntax = "proto3";

service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc ListUsers (ListUsersRequest) returns (stream User);
}

message GetUserRequest { int64 user_id = 1; }
message User {
  int64 id = 1;
  string name = 2;
  string email = 3;
}
```

**gRPC strengths:**
- Binary serialization: 5-10x smaller payloads than JSON.
- HTTP/2 multiplexing: many concurrent streams on one connection.
- Streaming: client, server, or bidirectional streaming.
- Strong contracts: generated code, no manual parsing.

**gRPC weaknesses:**
- Not human-readable (binary, not JSON). Debugging requires tooling.
- Browser support is limited (gRPC-Web proxy needed).
- Protobuf schema evolution requires care (field numbers must not be reused).

Best for: internal service-to-service communication where performance matters. Not ideal for public APIs consumed by browsers directly.

### REST vs GraphQL vs gRPC

| | REST | GraphQL | gRPC |
| --- | --- | --- | --- |
| Protocol | HTTP/1.1+ | HTTP/1.1+ | HTTP/2 |
| Format | JSON | JSON | Protobuf (binary) |
| Caching | Easy (HTTP) | Hard | Hard |
| Streaming | Limited | Subscriptions | Native |
| Browser support | Full | Full | Limited (gRPC-Web) |
| Best for | Public APIs | Client-driven data fetching | Internal microservices |

## References

- [REST Dissertation, Roy Fielding](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
- [GraphQL specification](https://spec.graphql.org/)
- [gRPC documentation](https://grpc.io/docs/)
- [Stripe API design guide](https://stripe.com/docs/api)

## Related topics

- [Rate Limiting](../rate-limiting/), enforcement at the API gateway layer
- [Load Balancing](../load-balancing/), the layer in front of API servers
- [Message Queues](../message-queues/), async APIs that return 202 Accepted and complete work via a queue
- [Scalability](../scalability/), stateless API design as the prerequisite for horizontal scaling
