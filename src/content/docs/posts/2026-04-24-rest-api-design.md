---
title: REST API design, resources, verbs, and the decisions that actually matter
description: Roy Fielding's 2000 thesis, adjusted for how people actually ship APIs in 2026. Resource modeling, the right verbs, status codes, pagination, versioning, error shapes, and the small number of choices that make or break an API's usability.
date: 2026-04-24
tags: [rest, api-design, http, architecture]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-rest-api-design/
---

## What REST is, and isn't

**REST** (Representational State Transfer) is a style Roy Fielding defined in his 2000 PhD thesis describing HTTP's core constraints. A true REST API is stateless, cacheable, layered, uniform in interface, and exposes hypermedia (HATEOAS) for driving the client state machine.

Approximately **0% of production APIs** pass all those tests. What people ship is usually "REST-ish", HTTP + JSON + verbs-on-resources. That's fine. The value of the REST style is the *direction*, resources, uniform interface, statelessness, not perfect adherence to Fielding's thesis.

This post is about REST as practiced, with the bits of theory that still pay off.

## The mental model

```
Resources are nouns.   Verbs act on nouns.   Status codes describe the result.

GET    /visits           list visits
POST   /visits           create a visit
GET    /visits/42        retrieve visit 42
PATCH  /visits/42        partially update visit 42
PUT    /visits/42        replace visit 42 entirely
DELETE /visits/42        delete visit 42
```

Each row has a predictable effect. Clients can read URLs and guess what happens; engineers can read the route table and understand the system.

## Resource modeling

The hardest design decision is usually: *what are the resources?*

Three tests for a good resource:

1. **It has a stable identity.** A URL that means the same thing tomorrow.
2. **It has a clear lifecycle.** Creation, updates, deletion.
3. **Its verbs (CRUD) map reasonably to user operations.**

A `User` is a resource. A `SearchResult` usually isn't. An `Order` is; `SubmitOrder` isn't, it's an action on an `Order`.

### Nested resources

Nesting models ownership: `/patients/7/visits` reads as "visits belonging to patient 7." Good for one level. Beyond that, flatten:

```
/patients/7/visits/42/notes/3/reactions   ← too deep, fragile
/notes/3/reactions                         ← flat, with note_id in the note
```

Two-level nesting is the sweet spot. Deeper, and clients struggle to build the URL.

### Actions that aren't CRUD

Some operations don't fit CRUD: "approve," "cancel," "send." Two patterns:

```
POST /orders/42/approve        ← action as a sub-resource
POST /orders/42 { op: approve } ← action in the body
```

The first is cleaner for REST tooling (OpenAPI understands it; middleware and caches can reason about it). The second is closer to JSON-RPC. Pick one and apply it consistently.

Avoid mixing: having some actions as verbs (`/cancel`) and some as body fields makes the API surface feel arbitrary.

## The verbs, semantic details

| Verb | Semantics | Idempotent | Safe | Body |
| --- | --- | --- | --- | --- |
| GET | Read | Yes | Yes | No |
| HEAD | Read headers only | Yes | Yes | No |
| OPTIONS | Discover capabilities | Yes | Yes | Usually no |
| POST | Create / action | No | No | Yes |
| PUT | Replace | Yes | No | Yes |
| PATCH | Partial update | No* | No | Yes |
| DELETE | Remove | Yes | No | Usually no |

- **Safe** = no observable state change. GET and HEAD.
- **Idempotent** = repeating the request yields the same result as one request. GET, PUT, DELETE. POST is not idempotent; PATCH is sometimes idempotent, sometimes not.

Two practical consequences:

1. **Clients and CDNs can retry idempotent requests safely.** That's a reason to structure mutations as PUT when you can.
2. **Don't change state in GET.** This is the single most broken thing, pre-fetching crawlers, HEAD probes, and caches will replay GETs arbitrarily.

## Status codes

The minimum set you must know:

- **200 OK**, success with a body.
- **201 Created**, POST success with a new resource; include `Location` header.
- **204 No Content**, success with no body (DELETE, sometimes PATCH).
- **301 / 302 / 307 / 308**, redirects (308 permanent, 307 temporary, strict method preservation; 301/302 have legacy method-change behavior).
- **400 Bad Request**, malformed request (bad JSON, missing required field).
- **401 Unauthorized**, no or bad credentials. (Really means "unauthenticated.")
- **403 Forbidden**, authenticated but not allowed.
- **404 Not Found**, resource doesn't exist (or you shouldn't reveal it).
- **405 Method Not Allowed**, wrong verb on a valid URL.
- **409 Conflict**, state conflict (illegal state transition, version mismatch, duplicate).
- **410 Gone**, existed, now permanently removed.
- **415 Unsupported Media Type**, wrong content-type.
- **422 Unprocessable Entity**, syntactically valid but semantically wrong (DRF's default for validation errors).
- **429 Too Many Requests**, rate limit. Include `Retry-After`.
- **500 Internal Server Error**, generic blow-up. You should rarely see this in logs without a corresponding alert.
- **503 Service Unavailable**, temporary outage; include `Retry-After` if you can predict it.

Pick codes deliberately. Returning 200 with `{"error": "..."}` breaks every HTTP tool (caching, monitoring, tracing, retries).

## Pagination

Three patterns, each with trade-offs:

### Offset / limit

```
GET /visits?offset=100&limit=50
```

Easiest to implement. Bad for large datasets (OFFSET scales poorly) and wrong if rows are inserted between pages.

### Page / size

```
GET /visits?page=3&size=50
```

Same problems as offset under the hood. Wraps them in a slightly friendlier URL.

### Cursor-based

```
GET /visits?cursor=eyJsYXN0X2lkIjoxMjM0fQ==&limit=50
→ { items: [...], next_cursor: "eyJsYXN0X2lkIjoxMjg0fQ==" }
```

The server returns an opaque cursor encoding where to continue. Stable across inserts, fast on databases. Clients can't jump to page N, which is usually fine.

**For any list that might exceed a few hundred items, default to cursor-based pagination.** It's the pattern GitHub, Stripe, and Twitter all converged on.

## Filtering, sorting, field selection

```
GET /visits?status=assigned&clinician_id=17&sort=-window_start&fields=id,status,patient
```

Keep the query string conventional:

- Filter by exact match with the field name.
- Sort with a `sort=` param; prefix with `-` for descending.
- Field selection with `fields=` (list of fields to include). Useful for bandwidth-sensitive clients.

Avoid inventing DSLs in query strings (`?q=status:assigned AND clinician_id:17`). They're fun to design, painful to use.

## Versioning

Four options, in descending order of popularity:

### 1. URL path, `/v1/visits`

Simplest, most visible, easiest to route. Every major public API does this.

### 2. Accept header, `Accept: application/vnd.acme.v1+json`

Keeps URLs clean; harder to debug with curl. Purist-favored.

### 3. Custom header, `X-API-Version: 2026-01-01`

Like option 2 but explicit.

### 4. No versioning, backwards-compatible evolution

Stripe's approach, pin a version at signup (`Stripe-Version: 2026-01-01`), add fields freely (clients ignore unknown), never remove or rename.

Pick option 1 for most B2B/internal APIs. Pick option 4 if your API evolves fast and you have the discipline to never break clients.

## Error shapes

Pick one; apply everywhere:

```json
{
  "error": {
    "type": "validation_error",
    "message": "email is required",
    "field": "email",
    "code": "missing_required_field"
  }
}
```

Minimums:

- A machine-readable `type` or `code`.
- A human-readable `message` for debugging.
- When the error is field-specific, name the field.
- A stable request ID so you can find logs.

[RFC 7807, Problem Details for HTTP APIs](https://datatracker.ietf.org/doc/html/rfc7807) is the canonical format if you want a standard:

```json
{
  "type": "https://acme.com/probs/validation",
  "title": "Validation failed",
  "status": 422,
  "detail": "email is required",
  "instance": "/api/v1/users"
}
```

## Authentication and authorization, what REST says

REST doesn't dictate how to authenticate, but idiomatic choices:

- **Bearer tokens in `Authorization` header.** `Authorization: Bearer <token>`.
- **API keys** for server-to-server. Rotatable, scoped, logged.
- **Session cookies** for first-party web UIs. `HttpOnly`, `Secure`, `SameSite=Lax/Strict`.
- **OAuth 2 / OIDC** for federated auth.

Avoid auth via query parameters. Query strings end up in access logs and browser history.

See the companion [sessions, JWTs, and cookies post](./2026-04-24-sessions-jwts-cookies/) for the security tradeoffs.

## Rate limiting

API responses should include rate-limit headers so clients can self-throttle:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 74
X-RateLimit-Reset: 1714065600
Retry-After: 30
```

Actual rate limiting is its own topic, see the [throttling and rate-limiting post](./2026-04-24-throttling-and-rate-limiting/).

## Idempotency keys

For POST operations that create resources, clients should be able to retry safely. The pattern:

```
POST /charges
Idempotency-Key: f47ac10b-58cc-4372-a567-0e02b2c3d479
{ ... }
```

Server stores a hash of the key + request body. Re-sends with the same key return the original response, not a duplicate.

Stripe popularized this; most new APIs with "actions that must not be duplicated" (payments, bookings, bulk imports) include it.

## HATEOAS, the part no one uses

Fielding's purist REST requires hypermedia controls, responses contain links to next actions:

```json
{
  "id": 42,
  "status": "scheduled",
  "_links": {
    "self":   { "href": "/visits/42" },
    "cancel": { "href": "/visits/42/cancel", "method": "POST" },
    "assign": { "href": "/visits/42/assign", "method": "POST" }
  }
}
```

In principle, the client could walk only links from a single entry URL, never hard-coding paths. In practice, ~no client does this. HATEOAS comes and goes in fashion; most 2026 APIs ignore it, and their clients work fine.

## OpenAPI, the spec that won

Write your API spec in OpenAPI (Swagger). Generate clients, validate requests, render documentation.

```yaml
openapi: 3.1.0
info:
  title: Home Health API
  version: '1.0.0'
paths:
  /visits/{id}/assign:
    post:
      summary: Assign a clinician to a visit
      parameters:
        - in: path
          name: id
          schema: { type: integer }
          required: true
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                clinician_id: { type: integer }
      responses:
        '200':
          description: Assigned
        '409':
          description: Illegal state transition
```

Spec-first is the modern default: write the OpenAPI doc, generate types on both sides, implement to match. Tools:

- **[drf-spectacular](https://drf-spectacular.readthedocs.io/)**, Django REST Framework's generator.
- **[FastAPI](https://fastapi.tiangolo.com/)**, spec is generated from code.
- **[Stoplight](https://stoplight.io/)** / **[Redocly](https://redocly.com/)**, spec-first design tools.
- **[openapi-typescript](https://openapi-ts.dev/)**, generate TS types from a spec.

## Common mistakes

- **GET that mutates.** Crawlers will hit it. Always.
- **201 without `Location` header.** Clients have to guess the URL of the new resource.
- **Inconsistent error shapes.** Two endpoints return errors differently; clients need two parsers.
- **Mixing verbs and nouns.** `/getUsers` is not REST. `/users` with `GET` is.
- **Overloading 500.** Validation failure returns 500 with a leaked stack trace. Use 4xx for client errors, 5xx only for your server's problems.
- **Nested resources 4 levels deep.** Flatten.
- **No pagination.** "It's fine at launch" becomes a 30-second query in a year.
- **Breaking changes without a version.** Even a renamed field can break a client. Bump the version.
- **Timestamps without timezone.** Always use ISO 8601 with `Z` or offset.
- **Inconsistent casing.** `snake_case` or `camelCase`, pick one in JSON and stick to it.
- **Chatty clients.** Listing requires 50 calls. Support batch or field selection.

## The small set of decisions that matter

If you spend thought on these four, the rest of the API design falls into place:

1. **Error shape.** Pick one, apply everywhere. Machine-readable code + human message + field.
2. **Pagination.** Default to cursor-based; document the cursor opacity; include a sane max limit.
3. **Versioning.** Decide before the first public call. Migration is painful; greenfield is free.
4. **Auth model.** Bearer token, API key, session cookie? Mix of these for which user types?

Four decisions. Every other design question (casing, verbs, status codes) has a conventional answer that works; these four don't.

## References

- [Roy Fielding, *Architectural Styles and the Design of Network-based Software Architectures*](https://ics.uci.edu/~fielding/pubs/dissertation/top.htm), the thesis
- [Microsoft, REST API design guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md), the most concrete public style guide
- [Google, API Design Guide](https://cloud.google.com/apis/design), emphasizes resource design
- [Stripe API reference](https://stripe.com/docs/api), the de facto best-in-class public API
- [GitHub REST API](https://docs.github.com/en/rest), second canonical reference
- [JSON:API spec](https://jsonapi.org/), for teams that want stronger conventions
- [RFC 7807, Problem Details](https://datatracker.ietf.org/doc/html/rfc7807), standard error shape
- [RFC 9110, HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110), authoritative modern HTTP reference

## Related topics and posts

- [Throttling and rate limiting](./2026-04-24-throttling-and-rate-limiting/)
- [Stateless auth](./2026-04-24-stateless-auth/)
- [Sessions, JWTs, and cookies, security and tradeoffs](./2026-04-24-sessions-jwts-cookies/)
- [Django Part 6, DRF basics](../topics/web/django/part-06-drf-basics/)
