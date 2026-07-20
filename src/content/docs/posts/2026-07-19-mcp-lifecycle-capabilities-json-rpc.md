---
title: "MCP 3: Lifecycle, Capabilities, and JSON-RPC"
description: "The MCP connection lifecycle at wire level, including initialization, capability negotiation, requests, notifications, errors, progress, cancellation, pagination, and shutdown."
date: 2026-07-19
tags: [mcp, json-rpc, protocols, distributed-systems]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-mcp-lifecycle-capabilities-json-rpc/
series:
  slug: mcp-server-design
  order: 3
---

This is part 3 of the [MCP Server Design series](../series/mcp-server-design/).

JSON-RPC 2.0 describes itself as stateless. MCP is not. MCP builds a negotiated lifecycle on top of JSON-RPC messages, so an otherwise valid `tools/list` request is out of sequence before initialization completes.

## Four JSON-RPC message shapes

### Request

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

The `id` says a response is expected and correlates that response with this request.

### Successful response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": { "tools": [] }
}
```

### Error response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Invalid params"
  }
}
```

### Notification

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

A notification has no `id`, receives no response, and cannot report failure to its sender through a correlated result.

## Phase 1: initialization

The client must begin with `initialize`:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "roots": { "listChanged": true },
      "sampling": {},
      "elicitation": { "form": {}, "url": {} }
    },
    "clientInfo": {
      "name": "ops-host",
      "version": "1.0.0"
    }
  }
}
```

The server replies with the version it will use, its identity, optional instructions, and server capabilities:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "tools": { "listChanged": true },
      "resources": { "subscribe": true },
      "prompts": {}
    },
    "serverInfo": {
      "name": "engineering-ops",
      "version": "1.0.0"
    }
  }
}
```

The client checks that it supports the returned version. It then sends `notifications/initialized`. Normal operation begins only after that boundary.

## Capabilities are a session contract

Client capabilities include roots, sampling, elicitation, and experimental task support. Server capabilities include tools, resources, prompts, logging, completions, and tasks.

Sub-capabilities matter. `tools.listChanged` says the server can notify the client that its tool catalog changed. `resources.subscribe` says it supports subscriptions. A server that sees `sampling: {}` cannot assume the client also supports tool-enabled sampling.

Capability negotiation prevents hopeful calls against features the other peer never promised.

## Phase 2: operation

During operation, peers exchange only messages allowed by the negotiated version and capabilities. A normal discovery flow may be:

```text
client -> tools/list -> server
client <- tool definitions <- server
client -> tools/call -> server
client <- tool result <- server
```

MCP supports cursor-based pagination for list operations. A client treats `nextCursor` as opaque, sends it back unchanged, and stops when the field is absent. Cursors should not be parsed or persisted across sessions.

## Protocol errors versus execution errors

An unknown tool or malformed `tools/call` request produces a JSON-RPC error. A known tool that cannot complete its domain operation returns a tool result with `isError: true`.

```json
{
  "content": [
    {
      "type": "text",
      "text": "Incident INC-999 was not found. Search incidents before retrying."
    }
  ],
  "isError": true
}
```

Execution errors belong in model context because the model may correct its arguments. Protocol errors usually indicate a broken client or incompatible contract.

## Progress, cancellation, and timeouts

A request can carry a progress token. The receiver may send progress notifications linked to that token. Progress shows activity, not permission to run forever.

Both sides need configurable request timeouts and a maximum duration. When a sender stops waiting, it should issue a cancellation notification. Cancellation is cooperative. The receiver still has to propagate an abort signal to its database, HTTP client, worker, or subprocess.

Idempotency remains an application concern. A timeout does not prove that a mutation failed. Retrying `add_incident_note` safely requires a stable request ID and server-side duplicate handling.

## Phase 3: shutdown

MCP defines no universal shutdown request. The transport closes the connection.

For stdio, the client closes the server process input, waits, then escalates from graceful termination if needed. A server can close output and exit. For Streamable HTTP, shutdown follows the associated HTTP connections and session policy.

Server cleanup includes active requests, subscriptions, task records, event streams, and backend clients. Exiting the process is not a graceful drain.

## Inspect the lifecycle yourself

MCP Inspector makes the deterministic protocol visible without placing a model in the loop. Connect the engineering-operations server, inspect initialization, list tools, call `get_incident`, send an unknown incident ID, and compare the successful result with `isError: true`.

If that flow is unclear, adding a model only makes debugging harder.

## What this layer owns

JSON-RPC owns message correlation and error envelopes. MCP owns ordering, version and capability negotiation, standard method semantics, and lifecycle rules. The transport owns framing and connection closure. Application code owns retry safety and cleanup of real work.

## Series navigation

- Previous: [Part 2: Architecture and the model interaction loop](../2026-07-19-mcp-architecture-model-interaction-loop/)
- Next: [Part 4: Tools, resources, and prompts](../2026-07-19-mcp-tools-resources-prompts/)
- Series index: [MCP Server Design](../series/mcp-server-design/)

## References

- [MCP lifecycle specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle)
- [MCP schema reference](https://modelcontextprotocol.io/specification/2025-11-25/schema)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)
- [MCP pagination](https://modelcontextprotocol.io/specification/2025-11-25/server/utilities/pagination)

## Related topics

- [API design](../../topics/system-design/api-design/)
- [Distributed systems](../../topics/system-design/)
- [Tool design and schema discipline](../../topics/ai/harness-development/tool-design/)
