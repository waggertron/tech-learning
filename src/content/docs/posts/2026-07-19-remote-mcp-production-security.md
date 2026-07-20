---
title: "MCP 9: Remote Production, Security, and Operations"
description: "Streamable HTTP, sessions, OAuth, token boundaries, tenant isolation, SSRF, DNS rebinding, limits, observability, testing, and protocol evolution for remote MCP."
date: 2026-07-19
tags: [mcp, security, oauth, observability, distributed-systems]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-remote-mcp-production-security/
series:
  slug: mcp-server-design
  order: 9
---

This is part 9 of the [MCP Server Design series](../series/mcp-server-design/).

A local stdio server inherits one user's process boundary. A remote server accepts network traffic from many clients and users. Transport, identity, tenant isolation, session storage, rate limits, and operational recovery become part of the design.

## Streamable HTTP

Every client-to-server MCP message is a new HTTP POST to the MCP endpoint. The client advertises both `application/json` and `text/event-stream` in `Accept`. For a JSON-RPC request, the server can return one JSON response or start an SSE stream.

An optional HTTP GET can establish a server-to-client SSE stream. A server that does not support it returns `405 Method Not Allowed`.

After initialization, clients include `MCP-Protocol-Version` on later HTTP requests. Stateful servers may issue a session ID that clients return on subsequent requests.

## Choose state deliberately

### Stateless

Each request can reach any node. Deployment and scaling stay simple. The tradeoff is reduced support for server-initiated notifications, resumability, and in-memory session features.

### Stateful with shared persistence

Sessions and resumable events live in a shared store. Any node can serve a request, but storage and ordering become operational dependencies.

### Stateful with routed ownership

A session belongs to one node, and a router sends later traffic there. Node loss needs recovery or clear session failure behavior.

Do not let an SDK default choose the architecture accidentally. Record session identity, retention, event replay, node failure, and shutdown policy.

## OAuth roles

For remote authorization, the MCP server acts as an OAuth resource server. The MCP client acts as an OAuth client. An authorization server authenticates the user and issues an access token for the MCP server.

The MCP server publishes protected-resource metadata that identifies its authorization server. The client uses authorization-server or OpenID Connect discovery, Authorization Code with PKCE for user flows, and the `resource` parameter to bind the requested token to the MCP server.

Every HTTP request carries its bearer token. A session ID does not replace authorization.

## Never pass the token through

The access token presented to the MCP server is intended for that server. Validate issuer, audience, expiry, signature, and required scope.

If the MCP server calls an incident API, it uses a separate downstream credential issued for that API. Forwarding the incoming token breaks audience isolation, weakens audit trails, and creates confused-deputy risk.

```text
MCP client -- token audience: MCP server --> MCP server
MCP server -- separate downstream token --> incident API
```

## Authorization happens on every operation

Tool discovery is not object authorization. A user may see `get_incident` and still lack access to a particular tenant or incident.

Bind session, task, subscription, and cached result state to verified authorization context. Never accept tenant IDs from model arguments as proof of tenant membership.

Use `401` when authentication is missing or invalid. Use `403` and an appropriate scope challenge when a valid token lacks required permission. Limit step-up retries so a bad scope configuration cannot loop forever.

## Defend the HTTP edge

### DNS rebinding and Origin

Local HTTP servers validate the `Host` header so a malicious website cannot use DNS rebinding to reach a loopback service. Streamable HTTP servers validate `Origin` and reject invalid origins with `403`.

Binding to `0.0.0.0` without an allowlist changes the threat surface. The official Express and Hono helpers include host validation support. Custom frameworks need equivalent controls.

### SSRF

OAuth discovery and client metadata can cause a client or authorization server to fetch supplied URLs. Restrict schemes, resolve and validate destinations, block private and metadata networks where appropriate, re-check redirect targets, cap response size, and set timeouts.

### Prompt injection and tool poisoning

Server descriptions, prompt text, resources, and tool results are untrusted content. A trusted network connection does not make every returned instruction authoritative.

Hosts show provenance, bind definitions to a server identity, detect catalog changes, and prevent result text from silently overriding higher-priority policy.

## Put budgets around work

Apply limits per user, client, tenant, and server:

- Request body and result size.
- Tool calls and concurrent work.
- Sampling tokens and nested depth.
- Elicitation frequency.
- Task count, TTL, and polling rate.
- Backend timeouts and retries.
- Session count and event retention.

Cancellation propagates through MCP, HTTP clients, queues, and subprocesses. A cancelled client request that leaves backend work running is still consuming capacity.

## Make retries safe

Reads can usually retry after transport failure. Mutations need idempotency keys and durable duplicate detection. A lost response does not mean the mutation did not happen.

Store idempotency records in the same durability boundary as the mutation. An in-memory set works for the companion server and fails across production restarts or multiple nodes.

## Observe without leaking content

Correlate host turn, MCP request ID, session, tool name, backend request, and task ID. Record duration, result class, cancellation, retry count, and size.

Avoid logging prompts, resource bodies, tool arguments, model outputs, tokens, or full errors by default. Audit mutations with verified actor, target, approval decision, outcome, and idempotency key.

Useful metrics include tool latency, execution-error rate, protocol-error rate, denied-call rate, timeout rate, active sessions, task saturation, result sizes, and per-server model-loop turns.

## Test at four boundaries

1. **Domain tests**: Business behavior without MCP or HTTP.
2. **Protocol contracts**: Initialization, discovery, schemas, results, errors, cancellation, and shutdown.
3. **Host compatibility**: Inspector and representative hosts across supported capabilities.
4. **Model evals**: Selection, arguments, recovery, refusal, injected content, and ambiguous intent.

Security tests add cross-tenant IDs, wrong audiences, missing scopes, stale sessions, task enumeration, redirect abuse, oversized content, and duplicate mutations.

## Version and SDK policy

Pin the MCP specification and SDK generation used by examples. Negotiate protocol versions at runtime and maintain a compatibility matrix for supported hosts.

As of July 19, 2026, the stable TypeScript package is `@modelcontextprotocol/sdk@1.29.0`. The official v2 branch uses new split packages and remains pre-release. Upgrade only after stable migration guidance and contract tests cover both ends.

Experimental tasks need a separate compatibility flag. Do not make a critical production workflow depend on every host supporting an experimental capability.

## Production checklist

- The server has a named owner and incident path.
- Tools have bounded inputs, outputs, time, and authority.
- Every resource read and tool call checks object access.
- Incoming and downstream tokens have separate audiences.
- Origin, host, redirect, and outbound fetch policies are explicit.
- Mutations use approval and durable idempotency.
- Sessions and tasks are bound to authorization context.
- Logs exclude secrets and content by default.
- Shutdown drains or cancels active work.
- Contract, compatibility, security, and model evals run before release.

## What this layer owns

Streamable HTTP owns remote carriage. OAuth establishes delegated access to the MCP resource server. The MCP server owns enforcement, isolation, limits, and truthful results. The host owns model policy and user consent. Operations keeps those boundaries working after launch.

## Series navigation

- Previous: [Part 8: Sampling, elicitation, roots, and tasks](../2026-07-19-mcp-sampling-elicitation-roots-tasks/)
- Next: none. Continue with the companion project and adapt it to a real domain.
- Series index: [MCP Server Design](../series/mcp-server-design/)

## References

- [MCP Streamable HTTP transport](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)
- [MCP authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
- [MCP security best practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices)
- [Official TypeScript SDK server guide](https://github.com/modelcontextprotocol/typescript-sdk/blob/v1.x/docs/server.md)

## Related topics

- [Stateless authentication](../2026-04-24-stateless-auth/)
- [Throttling and rate limiting](../2026-04-24-throttling-and-rate-limiting/)
- [Permission and trust models](../../topics/ai/harness-development/permission-models/)
