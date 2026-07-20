---
title: Networking, authentication, real-time events, and resilience
description: "Build a typed URLSession boundary with safe authentication refresh, explicit pagination, bounded retries, cancellation, and resilient event streams."
date: 2026-07-19
tags: [ios, swift, production, networking, authentication, urlsession, resilience, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-networking-authentication-realtime-resilience/
series:
  slug: zero-to-ios-hero
  order: 79
---

A production network layer translates typed application requests into HTTP, owns transport policy, and returns domain-safe results. Views should not construct URLs, decode API shapes, refresh credentials, or decide retries.

## Describe an endpoint

```swift
struct Endpoint<Response: Decodable & Sendable>: Sendable {
    var path: String
    var method: HTTPMethod
    var query: [URLQueryItem] = []
    var body: Data?
}

protocol HTTPTransport: Sendable {
    func send(_ request: URLRequest) async throws -> (Data, HTTPURLResponse)
}

struct APIClient: Sendable {
    var baseURL: URL
    var transport: any HTTPTransport
    var credentials: any CredentialProvider
    var decoder: JSONDecoder

    func send<Response>(_ endpoint: Endpoint<Response>) async throws -> Response {
        let request = try await makeRequest(endpoint)
        let (data, response) = try await transport.send(request)
        try validate(response)
        return try decoder.decode(Response.self, from: data)
    }
}
```

Endpoint definitions own path, method, query, and body shape. DTOs decode the wire contract, then an adapter maps them to domain values so API changes do not leak into views.

## Refresh once

Store long-lived credentials using the platform's protected credential facilities, never source files, preferences, fixtures, or logs. When several requests receive an authentication failure, one refresh operation should run while the others await its result. Retry each original request at most once after successful refresh, then surface reauthentication.

## Retry by policy

Retry only operations known to be safe and failures known to be transient. Use bounded exponential backoff with jitter, honor server guidance, and stop on cancellation. Mutation requests need an idempotency contract before automatic replay. Decoding errors, authorization failures, and most client errors should fail without a blind retry.

## Model pagination and real-time streams

Pagination returns items plus an opaque continuation value. Deduplicate by stable identity and cancel work for abandoned queries. WebSocket or server-event streams need connection state, heartbeat or liveness policy, bounded reconnect, resume position when supported, duplicate handling, and a fallback to ordinary synchronization.

Log request IDs, timing, status categories, and retry decisions. Redact authorization values, cookies, personal content, and response bodies by default.

## Validation boundary

The URLSession architecture is source reviewed. No live service, credential refresh, socket, Apple runtime, or account integration was exercised for this lesson.

## Series navigation

- Previous: [Part 78: CI, flake control, test data, release qualification, and evidence](../2026-07-19-ios-ci-flake-control-test-data-release-evidence/)
- Next: Part 80, persistence, Core Data, files, caches, migrations, and secure storage
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [URLSession](https://developer.apple.com/documentation/foundation/urlsession) documents Foundation network sessions and tasks.
- [URL Loading System](https://developer.apple.com/documentation/foundation/url-loading-system) covers requests, responses, caching, authentication, and protocol loading.
- [WebSocket](https://developer.apple.com/documentation/network/websocket) documents Network framework WebSocket connections.

## Related topics

- [Data architecture, source of truth, caching, offline sync, and conflict](../2026-07-19-ios-data-architecture-source-truth-cache-offline-sync-conflict/)
- [Repositories, gateways, clients, and ports and adapters](../2026-07-19-ios-repositories-gateways-clients-ports-adapters/)
