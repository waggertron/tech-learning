---
title: "MCP 1: HTTP, REST APIs, and MCP Compared"
description: "Where HTTP, REST, OpenAPI, JSON-RPC, function calling, and MCP sit in the stack, what each one owns, and when an MCP adapter earns its cost."
date: 2026-07-19
tags: [mcp, ai, api-design, http, rest]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-what-is-mcp-http-rest-apis-compared/
series:
  slug: mcp-server-design
  order: 1
---

This is part 1 of the [MCP Server Design series](../series/mcp-server-design/).

An incident service already has an HTTP API. A web dashboard calls `GET /incidents/INC-204`, receives JSON, and renders the result. Then someone asks, “Can our coding assistant investigate incidents too?”

HTTP connectivity is not the hard part. The harder questions are which operations the assistant may discover, which data belongs in model context, which mutations require approval, how failures help the model recover, and how the integration works across more than one AI application.

MCP addresses those questions. It does not replace HTTP or the incident API.

## The short answer

- **HTTP**: A protocol for requests, responses, methods, headers, status codes, representations, caching, and intermediaries.
- **REST**: An architectural style organized around resources, representations, a uniform interface, stateless interactions, cacheability, and layered systems.
- **OpenAPI**: A machine-readable description of HTTP paths, operations, parameters, bodies, responses, schemas, and security requirements.
- **JSON-RPC 2.0**: A transport-independent envelope for named method calls, results, errors, and notifications.
- **Function calling**: A model API feature that lets a model emit a structured request to use a supplied tool definition.
- **MCP**: A stateful protocol that lets AI hosts discover and use tools, resources, prompts, and client-side features through a shared contract.

The sentence worth remembering:

> HTTP moves messages. REST shapes resource-oriented APIs. MCP gives AI hosts a shared language for discovering and using context and actions.

## The category mistake in “MCP versus HTTP”

MCP and HTTP can exist in the same request. Remote MCP uses Streamable HTTP as a standard transport. Local MCP commonly sends the same JSON-RPC messages through standard input and output.

```text
MCP data layer
  initialize, tools/list, tools/call, resources/read
                         |
                         v
Transport layer
  stdio for local processes OR Streamable HTTP for remote services
```

HTTP answers how a network request is represented and delivered. MCP adds the meaning of `tools/list`, the lifecycle that makes it legal, the schema returned for each tool, and the result shape an AI host can process.

## One incident lookup through four lenses

### HTTP endpoint

```text
GET /incidents/INC-204 HTTP/1.1
Host: ops.example.com
Accept: application/json
Authorization: Bearer <token>
```

```text
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "INC-204",
  "service": "checkout",
  "severity": "high",
  "status": "investigating"
}
```

The request has resource and transport semantics. It does not say whether a model should see this operation or what approval policy applies.

### OpenAPI operation

```yaml
paths:
  /incidents/{incidentId}:
    get:
      operationId: getIncident
      summary: Read one incident
      parameters:
        - in: path
          name: incidentId
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Incident found
```

OpenAPI makes the HTTP contract available to documentation, generators, gateways, and tests. A generator could turn this operation into a model tool. That still leaves curation, approval, context limits, and result shaping to the AI application.

### JSON-RPC method

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "getIncident",
  "params": { "incidentId": "INC-204" }
}
```

JSON-RPC supplies a method name, structured parameters, and an ID that correlates the response. It does not define an AI capability catalog.

### MCP tool call carried by HTTP

```text
POST /mcp HTTP/1.1
Host: mcp.ops.example.com
Content-Type: application/json
Accept: application/json, text/event-stream
MCP-Protocol-Version: 2025-11-25
Authorization: Bearer <token>

{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "tools/call",
  "params": {
    "name": "get_incident",
    "arguments": { "incidentId": "INC-204" }
  }
}
```

The host discovered `get_incident` through `tools/list`. It could give the tool definition to a model, inspect the structured call the model returned, apply policy, invoke the server, and add the result to the next model request.

The MCP server may call the original REST endpoint. MCP is the AI-facing adapter. The REST API stays the service-facing contract.

## What MCP adds

MCP defines an initialization handshake, version negotiation, and capability negotiation. It gives servers a shared vocabulary for tools, resources, and prompts. It gives clients optional capabilities for sampling, elicitation, and roots. It also defines notifications, cancellation, progress, pagination, and structured logging.

Runtime discovery is central. A client can list tools, resources, templates, and prompts instead of compiling every integration into the host. Catalog change notifications let a server say that its available surface has changed.

MCP also separates model-usable execution failures from protocol failures. A malformed `tools/call` request is a protocol problem. A valid request whose incident ID does not exist is a tool execution problem that can return actionable text to the model.

## What MCP does not add

MCP does not choose a model, define the complete agent loop, grant authority, or guarantee correct tool selection. It does not turn a dangerous backend into a safe one. It does not require the host to place every resource or tool into model context.

The host still owns model access, context selection, approval UX, permission policy, and the decision to continue after a tool result.

## Three architecture patterns

### Adapter over an existing REST API

```text
AI host -> MCP server -> REST API -> domain services
```

This is the common case. The MCP server exposes fewer, clearer operations than the backend and converts large responses into bounded model-facing results.

### Two adapters over shared application services

```text
                   +-> HTTP controller -> web clients
Application core -|
                   +-> MCP adapter ----> AI hosts
```

This avoids an unnecessary HTTP hop inside one codebase. Both adapters call the same application operations without moving protocol concerns into the domain.

### Generated tools from OpenAPI

```text
OpenAPI document -> generated MCP facade -> REST API
```

Generation is a starting point, not a finished model interface. A 300-operation API becomes 300 schemas competing for context and model attention. Curation, descriptions, safe defaults, and result shaping still matter.

## When HTTP is enough

Keep the ordinary API when deterministic code already knows what to call, the workflow is fixed, runtime discovery adds nothing, or the MCP wrapper would expose one endpoint without improving its contract.

MCP earns its cost when several AI hosts need the same integration, the capability catalog changes independently, model-facing errors matter, or tools, resources, prompts, and user interaction need one governed boundary.

## Check your understanding

Classify each concern by its primary owner:

1. `404 Not Found` for a missing HTTP resource.
2. The JSON Schema for `get_incident` arguments.
3. Whether the user approves `add_incident_note`.
4. How the model chooses between two supplied tools.
5. Whether the server supports `resources/subscribe`.

The answers are HTTP, MCP server contract, host policy, model and host behavior, and negotiated MCP capability.

## What this layer owns

MCP owns a standard AI integration protocol. HTTP owns network request and response semantics. REST guides resource-oriented architecture. OpenAPI describes HTTP contracts. Function calling structures model output.

None of them owns the whole product.

## Series navigation

- Previous: none. Start here.
- Next: [Part 2: Architecture and the model interaction loop](../2026-07-19-mcp-architecture-model-interaction-loop/)
- Series index: [MCP Server Design](../series/mcp-server-design/)

## References

- [MCP architecture overview](https://modelcontextprotocol.io/docs/learn/architecture)
- [MCP specification, transports](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)
- [RFC 9110, HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [Fielding dissertation, REST](https://roy.gbiv.com/pubs/dissertation/fielding_dissertation.pdf)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)
- [OpenAPI Specification 3.2.0](https://spec.openapis.org/oas/v3.2.0.html)

## Related topics

- [API design](../../topics/system-design/api-design/)
- [Tool design and schema discipline](../../topics/ai/harness-development/tool-design/)
- [Context engineering](../../topics/ai/harness-development/context-engineering/)
