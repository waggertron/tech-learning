---
title: "MCP 2: Architecture and the Model Interaction Loop"
description: "How the user, AI host, model, MCP client, MCP server, and backend cooperate from discovery through tool execution and the final answer."
date: 2026-07-19
tags: [mcp, ai, agents, architecture]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-mcp-architecture-model-interaction-loop/
series:
  slug: mcp-server-design
  order: 2
---

This is part 2 of the [MCP Server Design series](../series/mcp-server-design/).

“The model called the MCP server” is convenient shorthand and a misleading mental model. The host application owns the connection, supplies selected tool definitions to the model, receives structured model output, applies policy, executes approved calls, and decides what returns to model context.

## The participants

- **User**: States an intent and grants or denies authority through the host interface.
- **Host**: The AI application. It coordinates models, context, permissions, MCP clients, and user experience.
- **Model**: Generates text or structured tool calls from the messages and tool definitions the host supplies.
- **MCP client**: A protocol component created by the host for one server connection.
- **MCP server**: Exposes capabilities through MCP and adapts them to underlying systems.
- **Backend**: The REST API, database, filesystem, queue, or application service that owns domain behavior.

One host can manage several MCP clients. Each client maintains a dedicated connection to one server.

```text
                    +-> MCP client A -> incident server
User -> AI host ----+-> MCP client B -> repository server
          |
          +-> model API
```

## The complete tool loop

Suppose the user asks, “What is happening with checkout?”

### 1. Establish connections

The host creates an MCP client, connects it to the incident server, and completes initialization. The client records the server's negotiated capabilities.

### 2. Discover capabilities

The client sends `tools/list`. The server returns definitions such as `get_incident` and `search_incidents` with descriptions and JSON Schemas.

The host does not need to expose every discovered tool to every model request. It can filter by user permission, workspace, server trust, task relevance, and context budget.

### 3. Ask the model

The host sends the user message, conversation history, and selected tool definitions to the model. Tool definitions consume context like any other input.

### 4. Receive model intent

The model may return a structured call:

```json
{
  "name": "search_incidents",
  "arguments": { "service": "checkout" }
}
```

This is a proposal, not authorization. Models produce plausible structure. They do not authenticate users or enforce business policy.

### 5. Apply host policy

The host checks that the tool came from the expected server, the arguments satisfy the schema, the user can perform the operation, and the call fits approval policy. A read may run automatically. A mutation may need confirmation.

### 6. Execute through MCP

The MCP client sends `tools/call`. The server validates input again, checks its own authorization boundary, calls the backend, and returns a tool result.

Both host and server validate because they defend different boundaries. The host protects user intent and UX. The server protects the resource.

### 7. Shape the result

The host converts MCP content blocks and structured content into the model provider's tool-result message. It may truncate a large payload, remove fields outside the task, attach provenance, or place a resource link in the UI instead of copying all content into context.

### 8. Continue the model interaction

The host sends the tool result in the next model request. The model can answer, request another tool, or recover from an actionable error. The host enforces a turn limit so a broken loop cannot run forever.

```text
User request
    |
    v
Host -> Model: messages + selected tool schemas
            |
            v
       structured tool call
            |
            v
Host policy -> MCP client -> MCP server -> backend
                                  |
                                  v
Host <- tool result <-------------+
    |
    v
Model: result + conversation -> final answer or next call
```

## Control belongs to different parties

Tools are commonly model-controlled in the sense that a model may propose calls. Resources are commonly application-controlled because the host decides when to read or attach them. Prompts are commonly user-controlled because users select a template or command.

These are interaction defaults, not security controls. A host can present any primitive differently. The protocol describes messages, while the host owns the experience.

## Context is a budget and a trust boundary

Passing every tool schema from every server to the model creates three costs. It consumes tokens, increases selection ambiguity, and expands the surface for misleading descriptions. Large tool results create the same problem after execution.

A mature host retrieves or filters tools, caps result size, tracks provenance, and treats server content as untrusted input. An MCP result can contain instructions just as a web page or document can. It should not silently outrank system policy.

## Latency compounds

One tool step often includes a model request, MCP call, backend request, and another model request. A chain of five tools can produce ten model and service round trips.

Tool design affects performance. One cohesive `prepare_incident_brief` tool may be better than forcing the model to call five low-level endpoints whose intermediate results carry no reasoning value.

That does not justify one giant tool. The useful boundary is a stable domain operation with clear input, policy, result, and failure semantics.

## Failure ownership

- A model chooses the wrong tool: improve selection context, names, descriptions, filtering, or model evals.
- The host executes without approval: fix host policy.
- The server accepts an unauthorized incident ID: fix server authorization.
- The backend times out: return a bounded execution error and preserve cancellation.
- The result overwhelms context: fix result shaping and resource design.
- The model loops: enforce host turn, time, and cost budgets.

Calling every failure an “MCP bug” hides the responsible boundary.

## What this layer owns

The host owns orchestration. The model proposes language and structured calls. The MCP client owns one protocol connection. The MCP server owns its capability contract and resource enforcement. The backend owns domain truth.

## Series navigation

- Previous: [Part 1: HTTP, REST APIs, and MCP compared](../2026-07-19-what-is-mcp-http-rest-apis-compared/)
- Next: [Part 3: Lifecycle, capabilities, and JSON-RPC](../2026-07-19-mcp-lifecycle-capabilities-json-rpc/)
- Series index: [MCP Server Design](../series/mcp-server-design/)

## References

- [MCP architecture overview](https://modelcontextprotocol.io/docs/learn/architecture)
- [Understanding MCP clients](https://modelcontextprotocol.io/docs/learn/client-concepts)
- [MCP client best practices](https://modelcontextprotocol.io/docs/develop/clients/client-best-practices)

## Related topics

- [Harness development](../../topics/ai/harness-development/)
- [Context engineering](../../topics/ai/harness-development/context-engineering/)
- [Permission and trust models](../../topics/ai/harness-development/permission-models/)
