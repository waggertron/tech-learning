# MCP Server Design, Educational Series Plan

**Date:** 2026-07-19
**Status:** Completed and published
**Completed:** 2026-08-20
**Proposed series slug:** `mcp-server-design`
**Working title:** MCP Server Design, from Web APIs to Model Interaction

## Completion record

The nine reader-facing posts, series landing page, and MCP Engineering Operations companion are published. The companion's deterministic domain and model-loop tests run in the repository's pre-push validation, and the series is listed in both post indexes. This plan is retained as a historical design and source record.

## Goal

Teach Model Context Protocol server design from familiar software concepts. The reader starts with HTTP and REST APIs, learns where MCP sits in the stack, sees what MCP adds for AI applications, and then builds and consumes a server whose tools, resources, prompts, permissions, and results work well inside a model interaction loop.

The series should answer six questions without assuming prior agent-infrastructure experience:

1. What is MCP in plain language?
2. How is MCP different from HTTP, a REST API, JSON-RPC, OpenAPI, and model function calling?
3. What value does MCP add when an AI application needs data or actions from an external system?
4. How does a designer turn an existing application or API into a safe MCP capability surface?
5. What happens between the user's request, the model, the host, the MCP client, the MCP server, and the underlying service?
6. How does a developer inspect, configure, consume, and connect an MCP server to a real model interaction?

## Educational promise

Every new term is introduced in this order:

1. Plain-language definition.
2. Closest familiar web-development concept.
3. Important difference from that concept.
4. Small wire-level or code example.
5. Design consequence.
6. Failure mode when the distinction is ignored.

The reader should never need to memorize a protocol diagram before understanding why the pieces exist.

By the end, the reader can complete the whole path instead of stopping at server construction:

1. Inspect an unfamiliar MCP server without a model.
2. Use the server from an existing MCP host.
3. Build a local MCP server.
4. Build a client that discovers and invokes the server's capabilities.
5. Connect discovered tools to a model's function-calling interface.
6. Carry tool results back into the model interaction safely.
7. Deploy and operate the same server through Streamable HTTP.

## Primary thesis

MCP, HTTP, and REST are not three interchangeable choices.

- **HTTP** defines a general message and resource interaction protocol for networked systems. It gives software methods, headers, status codes, request bodies, responses, caching semantics, and intermediaries.
- **REST** is an architectural style for distributed hypermedia systems. Most APIs called REST APIs use HTTP resources, methods, representations, and stateless requests, though many are better described as HTTP JSON APIs.
- **OpenAPI** describes HTTP APIs. It records paths, operations, parameters, bodies, responses, schemas, and security requirements so humans and software can understand an API contract.
- **JSON-RPC 2.0** defines a transport-independent remote procedure call message shape. Requests name methods, responses correlate through IDs, and notifications omit IDs because no response is expected.
- **MCP** defines a stateful, JSON-RPC-based protocol for exchanging model-relevant context and actions between an AI host and external capability servers. It adds lifecycle negotiation, discovery, model-facing primitives, bidirectional client features, notifications, and shared behavior for AI application integrations.
- **Streamable HTTP** is one MCP transport. MCP messages can also travel through standard input and output for local process integrations.
- **Function calling** is the model-facing act of producing a structured request to use a tool. MCP can supply the tool definitions and carry calls and results, but the host still decides which definitions reach the model, whether a call is approved, how it is executed, and what result returns to the model.

The memorable sentence for the opening post:

> HTTP moves messages. REST shapes resource-oriented APIs. MCP gives AI hosts a shared language for discovering and using context and actions.

## The layer model

The first post should establish the stack before comparing features.

```text
User
  |
  v
AI host application
  |  chooses context, calls the model, applies permissions
  v
MCP client
  |  speaks MCP data-layer messages
  v
MCP server
  |  adapts model-facing capabilities to domain operations
  v
Existing REST API, database, filesystem, queue, or service
```

For a remote server, the transport view is:

```text
MCP tools/list JSON-RPC request
            |
            v
HTTP POST /mcp
            |
            v
TLS -> TCP or QUIC -> IP
```

For a local server, the same data-layer message can use another transport:

```text
MCP tools/list JSON-RPC request
            |
            v
stdin/stdout pipes
            |
            v
locally spawned MCP server process
```

This is why “MCP versus HTTP” is a category mismatch. MCP can run over HTTP. The useful comparison is between the jobs each layer performs.

## Comparison matrix

| Question | HTTP | REST-style API | OpenAPI | JSON-RPC 2.0 | MCP |
| --- | --- | --- | --- | --- | --- |
| What kind of thing is it? | Network application protocol and semantic interface | Architectural style commonly expressed through HTTP | Machine-readable API description | RPC message protocol | Stateful AI context and capability protocol |
| Primary abstraction | Resources, representations, requests, responses | Resource state and representations | Paths, operations, parameters, schemas | Named methods with parameters | Tools, resources, prompts, client capabilities, lifecycle |
| Does it define transport? | Yes, along with semantics above its underlying connection | Usually uses HTTP | Describes HTTP APIs | No | Yes, stdio and Streamable HTTP are standard transports |
| Does it define discovery? | Not a complete application capability catalog | Often through links or separate docs | Yes, when the description is available | No standard method catalog | Yes, list operations and change notifications |
| Does it define model-facing meaning? | No | No | No | No | Yes |
| Is it stateful? | HTTP semantics are stateless | Statelessness is a REST constraint | Description only | Described as stateless | Yes, lifecycle and negotiated session capabilities matter |
| Can the server request work from the client? | HTTP alone is client-request oriented, though streaming and other patterns exist | Not part of REST's normal API contract | Can describe callbacks and webhooks | Either peer can use RPC if the transport supports it | Yes, negotiated sampling, elicitation, and roots are client features |
| What is the error vocabulary? | HTTP status codes and bodies | Domain errors mapped to HTTP | Describes expected status codes and schemas | Standard RPC error object plus method-defined errors | JSON-RPC protocol errors plus primitive-specific result errors |
| Who is the intended consumer? | Any HTTP software | General API clients | Humans, generators, gateways, test tools | RPC peers | AI hosts, MCP clients, and MCP servers |
| Does it replace an existing API? | Not applicable | Often is the service interface | Describes the interface | Can be the interface | Usually adapts or composes existing systems for AI use |

## One operation shown four ways

Use the same “find an incident” operation throughout the opening post.

### Plain HTTP JSON endpoint

```http
GET /incidents/INC-204 HTTP/1.1
Host: ops.example.com
Accept: application/json
Authorization: Bearer <token>
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "INC-204",
  "service": "checkout",
  "severity": "high",
  "status": "investigating"
}
```

HTTP explains the method, target, headers, response status, and representation. It does not tell an AI host whether this operation should become model context, a callable action, a reusable prompt, or something hidden from the model.

### OpenAPI description

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

OpenAPI makes the HTTP operation discoverable and machine-readable. It still does not define the AI host lifecycle, user approval boundary, model-facing result content, prompt catalog, resource subscriptions, sampling, or elicitation.

### Generic JSON-RPC call

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "getIncident",
  "params": {
    "incidentId": "INC-204"
  }
}
```

JSON-RPC defines method invocation and response correlation. It does not define what an incident capability means to a model client or how peers discover supported AI integration features.

### MCP tool call over Streamable HTTP

The HTTP envelope can carry an MCP JSON-RPC request:

```http
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
    "arguments": {
      "incidentId": "INC-204"
    }
  }
}
```

The tool was discoverable earlier through `tools/list`. Its definition included a name, description, input schema, and optional output schema and annotations. The host could expose that definition to the model, ask the user for approval, execute the call through its MCP client, and pass the result back into the model interaction.

The underlying MCP server may call the same REST endpoint from the first example. MCP is the AI-facing adapter contract. The REST API remains the service-facing contract.

## What MCP adds beyond an ordinary HTTP API

### A standard initialization sequence

MCP begins with `initialize`, which negotiates the protocol version, exchanges implementation information, and declares supported capabilities. The client then sends `notifications/initialized` before normal operation.

An HTTP API can create its own handshake, but HTTP itself does not define this MCP-specific negotiation.

### A standard capability vocabulary

Servers can expose:

- **Tools**: Callable operations, including reads, calculations, and mutations.
- **Resources**: Addressable context such as files, records, documentation, or generated data.
- **Prompts**: Reusable interaction templates with declared arguments.

Clients can expose:

- **Sampling**: A server can request a model generation through the client, subject to declared support and host policy.
- **Elicitation**: A server can request structured user input or a secure URL flow.
- **Roots**: A client can expose the filesystem boundaries relevant to the current workspace.

The specification also defines notifications, logging, completion, pagination, progress, cancellation, and experimental tasks.

### Runtime discovery

An MCP client can ask for `tools/list`, `resources/list`, `resources/templates/list`, and `prompts/list`. Servers can advertise list-change support and notify clients when a catalog changes.

OpenAPI can also provide machine-readable discovery, but the unit of discovery differs. OpenAPI describes HTTP operations. MCP describes a curated AI capability surface with primitives that carry model-interaction meaning.

### Bidirectional interaction

An ordinary API request starts with the API client. MCP permits negotiated server-to-client requests during an originating interaction. Sampling asks the host's model for generation. Elicitation asks the host to collect user input. Roots ask the client for bounded workspace locations.

This does not make the MCP server the owner of the user experience. The host remains the policy and presentation boundary.

### Model-usable results

Tool results can include text, images, audio, resource links, embedded resources, and structured content. Tool execution errors can return `isError: true` with actionable information that a model can use to correct a call.

The distinction between protocol errors and tool execution errors matters. An unknown tool is a protocol problem. A valid `schedule_maintenance` call with a time outside the allowed window is a domain execution problem that the model may be able to fix.

## What MCP does not add

The guide should state these boundaries early.

- MCP does not choose which model to use.
- MCP does not define the host's complete agent loop.
- MCP does not guarantee that a model will select the correct tool.
- MCP does not make an unsafe backend safe.
- MCP does not replace authorization or domain-level access checks.
- MCP does not remove the need for REST, queues, databases, or service APIs behind the server.
- MCP tool annotations are hints, not proof of safety.
- MCP does not guarantee that every host supports every negotiated or experimental feature.
- MCP does not mean every existing API endpoint should become a tool.

## REST API and MCP relationship patterns

### Pattern 1: MCP adapter over an existing API

```text
AI host -> MCP server -> existing REST API -> domain services
```

This is the default teaching pattern. The server curates a smaller model-facing surface, translates MCP arguments into API calls, enforces identity and policy, and converts large backend responses into bounded results.

Use it when the REST API already owns business logic and other applications also need it.

### Pattern 2: MCP server calls application services directly

```text
AI host -> MCP server -> application ports -> domain services
```

This fits a monolith or co-located service where adding an internal HTTP hop would add no useful boundary. The MCP adapter stays thin and uses the same application operations as HTTP controllers.

### Pattern 3: Shared domain behind REST and MCP adapters

```text
                 +-> REST controller -> web and mobile clients
Domain services -|
                 +-> MCP adapter ----> AI hosts
```

This is the preferred architecture when both interfaces live in one codebase. REST concerns do not leak into MCP handlers, and MCP concerns do not leak into domain logic.

### Pattern 4: Generated MCP facade from OpenAPI

```text
OpenAPI document -> generated MCP tools -> REST API
```

This can accelerate discovery but often exposes too much. A public API optimized for deterministic software clients may have hundreds of operations, broad payloads, pagination mechanics, and low-level mutations. Passing every generated tool schema to a model increases context cost and tool-selection ambiguity.

Generated tools need curation, safer defaults, clearer descriptions, result shaping, and approval policy before they become a good model interface.

## When HTTP or REST is enough

An MCP server is unnecessary when:

- A deterministic application client already knows which endpoint to call.
- The integration has one fixed request and response flow.
- No MCP host needs runtime discovery.
- The model never selects or composes operations.
- A normal HTTP SDK provides a smaller and more reliable integration.
- The system would only wrap one endpoint without adding a meaningful AI-facing contract.

The guide should not sell MCP as a universal replacement. It earns its cost when multiple AI hosts need a shared, discoverable, policy-aware capability interface.

## When MCP adds real value

MCP becomes useful when:

- Several AI hosts need the same integration.
- The capability catalog changes independently of the host.
- Tools, resources, and prompts need one discovery mechanism.
- A host needs consistent lifecycle and capability negotiation.
- Local and remote deployment should preserve the same data-layer contract.
- Server operations need model-usable errors and typed arguments.
- A workflow benefits from sampling, elicitation, roots, progress, or cancellation.
- The organization wants one governed adapter between models and sensitive internal APIs.

## Shared example for the series

The series builds an **engineering operations MCP server**. It is rich enough to show reads, mutations, context, user interaction, and production security without needing a fictional platform with dozens of entities.

Underlying system capabilities:

- Read incident records from an existing HTTP API.
- Search service ownership and current health.
- Read versioned runbooks.
- Add an incident note after user approval.
- Draft a handoff summary through client sampling.
- Ask the user for a non-sensitive missing field through elicitation.
- Scope repository reads to roots supplied by the client.
- Represent a long-running diagnostic bundle as an experimental task.

Proposed MCP surface:

| Primitive | Name or URI | Purpose | Risk class |
| --- | --- | --- | --- |
| Tool | `get_incident` | Read one incident by stable ID | Read-only |
| Tool | `search_incidents` | Find bounded incident summaries | Read-only |
| Tool | `add_incident_note` | Append a note with an idempotency key | Mutating |
| Tool | `collect_diagnostics` | Start bounded diagnostic collection | Expensive, task-capable |
| Resource | `runbook://services/{service}` | Read the current service runbook | Read-only context |
| Resource | `service://catalog/{service}` | Read ownership and dependency metadata | Read-only context |
| Prompt | `investigate_incident` | Assemble a consistent investigation starting point | User-invoked template |
| Client feature | sampling | Draft a handoff from selected evidence | Model access through host |
| Client feature | elicitation | Ask for a missing non-sensitive incident field | User interaction |
| Client feature | roots | Bound repository evidence reads | Filesystem scope |

## Series reading path

The series should stay compact enough to finish while giving each concern enough room. Nine posts provide a clear progression.

### Part 1: What Is MCP? HTTP, REST APIs, and MCP Compared

**Reader question:** I already understand web APIs. What exactly is MCP, and why is it not just another API wrapper?

**Outcome:** The reader can place HTTP, REST, OpenAPI, JSON-RPC, function calling, and MCP at the correct layers and explain how they work together.

**Sections:**

1. Start with one familiar HTTP request.
2. Separate protocol, architectural style, description format, RPC envelope, and AI integration protocol.
3. Introduce the host, client, server, model, and underlying service.
4. Compare one incident lookup as HTTP, OpenAPI, JSON-RPC, and MCP.
5. Show local stdio and remote Streamable HTTP transports.
6. Explain what MCP adds and what it does not add.
7. Give a decision checklist for HTTP alone, generated tools, or a curated MCP server.
8. End with a reader exercise: classify five integration concerns by layer.

**Code anchor:** A raw `tools/list` and `tools/call` exchange inside HTTP envelopes.

**Wrong first move:** Describe MCP as “USB for AI” and stop there. The analogy suggests interoperability but hides lifecycle, trust, model context cost, and server-to-client features.

### Part 2: The MCP Architecture and the Model Interaction Loop

**Reader question:** Who calls whom after the user asks the model to investigate an incident?

**Outcome:** The reader can trace discovery, model tool selection, approval, execution, result insertion, and the next model turn.

**Sections:**

1. Host versus model versus MCP client.
2. One client connection per server.
3. Tool discovery and selective exposure to the model.
4. The model emits a structured tool call.
5. The host checks policy and approval.
6. The MCP client invokes the server.
7. The host shapes the result for the next model call.
8. Token cost, latency, and why every backend field should not enter context.

**Code anchor:** An instrumented interaction trace generated by the tested companion host harness.

**Wrong first move:** Say that the model directly calls the MCP server. In normal architectures the host owns execution and permissions.

### Part 3: Lifecycle, Capabilities, and the JSON-RPC Wire Protocol

**Reader question:** What happens before a tool can be listed or called?

**Outcome:** The reader understands initialization, version negotiation, capabilities, requests, responses, notifications, cancellation, progress, pagination, and shutdown.

**Sections:**

1. JSON-RPC request, response, error, and notification shapes.
2. `initialize` request and response.
3. `notifications/initialized` readiness boundary.
4. Client and server capability maps.
5. Why unsupported features cannot be assumed.
6. Protocol errors versus domain execution errors.
7. Timeouts, cancellation, progress, and opaque cursors.
8. Stdio and HTTP shutdown behavior.

**Code anchor:** A complete handshake followed by `tools/list` and `tools/call`.

**Wrong first move:** Treat MCP as stateless because JSON-RPC itself is described as stateless.

### Part 4: Tools, Resources, and Prompts as Different Contracts

**Reader question:** Should this capability be a tool, a resource, or a prompt?

**Outcome:** The reader can choose a primitive based on control, side effects, context lifetime, and user intent.

**Sections:**

1. Tools as model-controlled execution candidates.
2. Resources as addressable context.
3. Resource templates and URI design.
4. Prompts as user-selected interaction templates.
5. Embedded resources and resource links.
6. Discovery and list-change notifications.
7. A decision tree using the incident server.
8. Anti-patterns such as wrapping every REST route as a tool.

**Code anchor:** Register one tool, one resource template, and one prompt for the same domain.

**Wrong first move:** Model every read as a tool because tools are the most visible MCP primitive.

### Part 5: Designing Tools a Model Can Use Safely

**Reader question:** What makes a valid tool schema become a good model interface?

**Outcome:** The reader can design names, descriptions, schemas, result shapes, errors, idempotency, and approval metadata around actual model behavior.

**Sections:**

1. Tool definitions as model input.
2. Specific names and bounded responsibility.
3. Required fields, enums, formats, limits, and defaults.
4. Read-only, destructive, idempotent, and open-world hints.
5. Why annotations remain untrusted hints.
6. Structured content and output schemas.
7. Recoverable `isError` results.
8. Result shaping for context cost and injection resistance.
9. Idempotency and confirmation for mutations.
10. Tool-selection and argument-generation evals.

**Code anchor:** `get_incident` and `add_incident_note` with Zod schemas, bounded output, typed failures, and an idempotency key.

**Wrong first move:** Copy backend request and response types into the tool unchanged.

### Part 6: Build a Local TypeScript MCP Server

**Reader question:** How do the design concepts become a working server?

**Outcome:** The reader builds and tests the first complete stdio server with the production-recommended v1 TypeScript SDK.

**Sections:**

1. Version baseline and package setup.
2. Domain service kept separate from the MCP adapter.
3. Server construction and metadata.
4. Tool, resource, and prompt registration.
5. Stdio transport connection.
6. Logging to stderr so stdout stays protocol-clean.
7. Input validation and result mapping.
8. Testing with MCP Inspector and a host.
9. Graceful shutdown.

**Code anchor:** A runnable engineering-operations server using `@modelcontextprotocol/sdk@1.29.0` and Zod.

**Wrong first move:** Put API calls, domain rules, authorization, formatting, and protocol wiring into one handler file.

### Part 7: Build an MCP Client and Connect It to a Model

**Reader question:** How do I consume an MCP server and place it inside a real model tool-use loop?

**Outcome:** The reader builds a TypeScript MCP client, consumes every server primitive, translates discovered tools into a model provider's function format, executes approved calls, and returns results to the model until the interaction finishes.

**Sections:**

1. Connect to the local server through stdio.
2. Initialize the session and inspect negotiated capabilities.
3. List tools, resources, resource templates, and prompts.
4. Call a tool directly without involving a model.
5. Read a resource and retrieve a prompt with arguments.
6. Filter the tool catalog before it enters model context.
7. Translate MCP tool definitions into the model provider's tool format.
8. Send the user request and selected definitions to the model.
9. Parse the model's structured tool call without treating it as authorization.
10. Apply approval, permission, timeout, and argument-validation policy.
11. Invoke the MCP tool through the client.
12. Convert MCP content and structured results into the provider's tool-result message.
13. Continue the loop until the model returns a normal response.
14. Handle parallel calls, retries, malformed arguments, tool errors, and cancellation.
15. Route names safely when more than one server exposes similar tools.
16. Close the client, transport, and child process cleanly.

**Code anchor:** A runnable TypeScript host loop that connects the incident server to a model adapter through an injected `ModelGateway` port. Tests use a deterministic fake model, while a documented adapter shows where a real provider call belongs.

**Wrong first move:** Treat a model-generated tool call as permission to execute. A tool call expresses model intent. Host policy and user approval decide whether execution is allowed.

**Follow-up path:** Once the reader owns the basic client and model loop, bidirectional server requests such as sampling and elicitation have a concrete host in which to run.

### Part 8: Sampling, Elicitation, Roots, and Long-Running Work

**Reader question:** How can an MCP server ask the host for model work, user input, or workspace boundaries?

**Outcome:** The reader understands bidirectional features and their trust constraints.

**Sections:**

1. Capability checks before server-to-client requests.
2. Sampling through the client's model access.
3. Host review and model-selection control.
4. Sampling with tools and nested loops.
5. Form elicitation for non-sensitive data.
6. URL elicitation for credential and payment flows.
7. Identity binding for URL completion.
8. Roots as scope hints, not automatic authorization.
9. Experimental tasks for deferred results.
10. Progress, cancellation, polling, TTL, and cleanup.

**Code anchor:** A diagnostic tool that requests a summary through sampling and elicits a missing severity before continuing.

**Wrong first move:** Ask for credentials through form elicitation or trust a root URI as proof of access.

### Part 9: Remote MCP in Production

**Reader question:** What changes when the server moves from a local process to a shared network service?

**Outcome:** The reader can design Streamable HTTP deployment, authorization, isolation, observability, compatibility, and evolution.

**Sections:**

1. Streamable HTTP POST and optional SSE response streams.
2. Stateful versus stateless server choices.
3. Sessions, resumability, event storage, and multi-node routing.
4. OAuth protected-resource behavior for remote servers.
5. Audience validation and separate downstream tokens.
6. Scope challenges and incremental authorization.
7. DNS rebinding, Origin validation, SSRF, and redirect safety.
8. Per-user and per-client isolation.
9. Rate limits, timeouts, output limits, and concurrency budgets.
10. Logs, metrics, traces, and audit records.
11. Contract tests, host compatibility tests, and model evals.
12. Version negotiation and the current v1-to-v2 SDK boundary.

**Code anchor:** Move the incident server to Streamable HTTP with explicit session policy and an authorization boundary.

**Wrong first move:** Forward the MCP client's bearer token to the downstream incident API.

## Progressive hands-on labs

The labs prove three different skills. Combining them into one “connect it to a host” exercise would hide which layer failed.

### Lab 1: Inspect without a model

Run the local server with MCP Inspector. Complete initialization, view negotiated capabilities, list tools, inspect their schemas, call a read-only tool, trigger a recoverable tool error, read a resource, and retrieve a prompt.

**Pass condition:** The reader can explain every request and result without attributing behavior to a language model.

### Lab 2: Use from an existing host

Add the local stdio server to one documented MCP host configuration. Verify discovery, choose a prompt, attach a resource, approve a read-only tool, decline a mutation, and inspect host logs when the server writes diagnostics to stderr.

**Pass condition:** The reader can distinguish host behavior from protocol requirements and can remove the server configuration cleanly.

### Lab 3: Integrate with a model

Run the companion TypeScript host. Discover a bounded tool set, map it through the `ModelGateway`, receive a structured tool call, apply approval policy, execute it through the MCP client, insert the result into the next model request, and stop when the model produces a final answer.

The default lab uses a deterministic fake model so tests need no credentials. An optional real-provider adapter uses `YOUR_API_KEY_HERE` as documentation and reads the actual secret from the environment at runtime.

**Pass condition:** The reader can trace and test every boundary from user message to final model answer, including one rejected call and one recoverable tool error.

## Detailed opening-post teaching sequence

Part 1 carries the largest conceptual burden. Its order should be fixed before prose is drafted.

### Opening

Begin with a reader who has an incident REST API and wants an AI coding assistant to use it. The naive plan is to give the model an endpoint and a token. The problem is not HTTP connectivity. The problem is defining what the AI may discover, what it may call, how the host presents approval, how results return to the model, and how the same integration works across hosts.

### Define API before protocols

An API is a contract between software components. HTTP, REST, OpenAPI, JSON-RPC, and MCP can each participate in that contract, but they describe different pieces.

### Define HTTP

Use RFC 9110's core model: a client sends a request toward a target resource, and a server returns one or more responses. Methods, status codes, headers, and representation metadata carry shared semantics.

Stress that HTTP is stateless at the protocol-semantics level. Applications can still build sessions with cookies, tokens, or server-side state.

### Define REST

REST is an architectural style, not a synonym for JSON over HTTP. Its constraints include client-server separation, stateless interaction, cacheability, a uniform interface, layered systems, and optional code on demand.

Avoid turning the post into a REST purity debate. The useful point is that REST organizes a system around resource representations and standard interface semantics.

### Define OpenAPI

OpenAPI describes an HTTP API's paths and operations. It supports documentation, client generation, validation, testing, and gateways. It can help generate tools, but it does not decide which operations belong in a model's action space.

### Define RPC and JSON-RPC

RPC makes remote work look like named method invocation. JSON-RPC 2.0 supplies the message envelope that MCP builds on. Its transport independence explains why MCP can preserve one data-layer shape across stdio and HTTP.

### Define MCP

MCP standardizes context exchange between an AI host and capability servers. It is stateful because peers negotiate a protocol version and capabilities, then operate within that negotiated session.

### Explain the model boundary

The model usually sees selected tool definitions and selected context. It does not own the MCP connection. The host runs the model loop, maintains MCP clients, applies policy, handles approval, and decides what enters the context window.

### Compare one operation

Walk from HTTP endpoint to OpenAPI operation to JSON-RPC message to MCP tool. At each step, state what was added and what remains outside the layer.

### Close with a decision model

Use three questions:

1. Is the consumer deterministic application code or an AI host?
2. Does runtime capability discovery and model interaction semantics add value?
3. Can the capability be curated more safely than exposing the backend API directly?

If the answers point to deterministic application code, keep the REST API. If they point to reusable AI-host integration, add an MCP adapter without replacing the domain API.

## Terminology bank

These definitions should remain consistent across the series.

- **AI host**: The user-facing application that coordinates models, permissions, context, and MCP client connections.
- **MCP client**: The protocol component maintained by a host for one MCP server connection.
- **MCP server**: A local or remote program that exposes MCP capabilities.
- **Model**: The language model asked to generate text or structured tool calls. It is not the MCP client.
- **Tool**: A named, schema-described operation that an AI application can invoke.
- **Resource**: Addressable data or content exposed through a URI.
- **Prompt**: A reusable message template exposed by a server and commonly selected by a user.
- **Capability**: A feature declared during initialization that a peer supports for the session.
- **Primitive**: A standard MCP concept such as a tool, resource, or prompt.
- **Transport**: The mechanism that carries protocol messages, such as stdio or Streamable HTTP.
- **JSON-RPC request**: A method invocation with an ID that expects a correlated response.
- **JSON-RPC notification**: A method message without an ID that does not receive a response.
- **Function calling**: A model API feature that lets a model emit a structured request to invoke a provided function or tool definition.
- **Sampling**: An MCP client capability that lets a server request model generation through the host.
- **Elicitation**: An MCP client capability that lets a server request structured user interaction.
- **Root**: A client-provided workspace boundary expressed as a URI.
- **Streamable HTTP**: The MCP remote transport based on HTTP POST with JSON or SSE response behavior and optional server-to-client SSE streams.
- **SSE**: Server-Sent Events, an HTTP event-stream format used for server-to-client streaming.
- **Adapter**: Code that translates one interface into another while keeping domain behavior outside protocol glue.

## Misconceptions to test directly

Each misconception should appear as a question or scenario instead of a dismissive myth list.

1. “MCP replaces REST.” It usually sits in front of REST or beside a REST adapter.
2. “MCP is just HTTP for AI.” Remote MCP can use HTTP, but MCP adds a separate data-layer protocol and AI-specific semantics.
3. “The model calls the server.” The host normally mediates tool exposure, approval, execution, and result delivery.
4. “A tool is an API endpoint.” A tool is a curated model-facing operation and may compose several endpoints or no network call at all.
5. “OpenAPI and MCP solve the same problem.” OpenAPI describes HTTP operations. MCP defines a runtime protocol and AI capability primitives.
6. “All API endpoints should become tools.” Large catalogs increase schema cost, ambiguity, and risk.
7. “Resources are read-only tools.” Resources have addressable context semantics and a different discovery and retrieval model.
8. “Prompts are server system prompts.” MCP prompts are reusable templates. The host decides how they enter an interaction.
9. “Tool annotations enforce safety.” They are behavioral hints and must be treated as untrusted unless the server is trusted.
10. “Stdio means no security concerns.” Local processes still inherit environment access, filesystem permissions, and user authority.
11. “OAuth authorizes the downstream API.” The MCP server token is for the MCP server. Downstream access needs a separate credential boundary.
12. “MCP makes an integration agentic.” The host's model loop determines planning, retries, approvals, and continuation.

## Research findings that constrain the series

### Protocol baseline

The current stable specification used by this plan is `2025-11-25`. It added URL-mode elicitation, tool use during sampling, icon metadata, stronger authorization discovery and scope behavior, and experimental tasks.

The full protocol schema is the source of truth. Explanatory docs can lag or show an older example version, so wire examples should be checked against the versioned schema before publication.

### SDK baseline

As of 2026-07-19, npm reports `@modelcontextprotocol/sdk` version `1.29.0` as the latest stable v1 package. The official TypeScript SDK repository states that v1.x remains recommended for production while the split-package v2 SDK is still pre-alpha and targets a later 2026 stable release.

Public code should use v1 APIs until the stable v2 release and migration guidance are available. The series landing page should display this baseline so examples do not silently mix generations.

### Transport behavior

MCP standardizes stdio and Streamable HTTP transports. Streamable HTTP sends each client-to-server JSON-RPC message in a new HTTP POST. Clients advertise support for both `application/json` and `text/event-stream`. A server can return a JSON response or begin an SSE stream for a request.

The older HTTP plus SSE transport is retained only for compatibility. New remote examples should use Streamable HTTP.

### Lifecycle behavior

Initialization must happen first. Peers negotiate version and capabilities, exchange implementation details, and only use successfully negotiated features. Implementations need request timeouts, cancellation behavior, and a maximum duration even when progress notifications arrive.

### Model interaction behavior

MCP focuses on context exchange. It does not dictate the host's full use of the model or supplied context. Hosts decide which capabilities reach a model, how permission prompts work, and how tool results affect the next model request.

Official client guidance warns that sending every tool from every connected server directly to a model consumes context and worsens selection at scale. The series should teach catalog filtering and retrieval as host responsibilities, not only server schema design.

### Security behavior

Remote authorization follows OAuth protected-resource patterns. The MCP server acts as a resource server. It must validate that incoming tokens were issued for it. Passing the client's token through to a downstream API is forbidden because it breaks audience boundaries and creates confused-deputy risk.

The security guide also calls out SSRF during authorization discovery, per-client consent for proxy servers, secure redirect handling, token storage, least-privilege scopes, DNS rebinding protection, and Origin validation.

Form elicitation must not collect passwords, API keys, access tokens, payment credentials, or other secrets. URL elicitation exists for sensitive or externally hosted flows and must bind completion to the same user who started the interaction.

### Experimental features

Tasks were introduced in specification version `2025-11-25` and remain experimental. They model durable work through explicit states, polling, deferred result retrieval, cancellation, TTL, and optional status notifications.

The series can teach tasks as an advanced option, but production guidance should not treat the API as settled.

## Source map

### MCP primary sources

- [MCP architecture overview](https://modelcontextprotocol.io/docs/learn/architecture): Host, client, server, data layer, transport layer, primitives, and model-context scope.
- [MCP specification lifecycle](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle): Initialization, version negotiation, capability negotiation, operation, shutdown, timeouts, and lifecycle errors.
- [MCP transports](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports): Stdio, Streamable HTTP, SSE behavior, session headers, Origin validation, protocol-version headers, and backwards compatibility.
- [MCP tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools): Tool discovery, calls, schemas, structured output, annotations, error types, and security requirements.
- [MCP resources](https://modelcontextprotocol.io/specification/2025-11-25/server/resources): Resource discovery, reads, templates, subscriptions, content types, and annotations.
- [MCP prompts](https://modelcontextprotocol.io/specification/2025-11-25/server/prompts): Prompt discovery, prompt retrieval, arguments, messages, and embedded resources.
- [MCP sampling](https://modelcontextprotocol.io/specification/2025-11-25/client/sampling): Server-requested model work, human review guidance, and tool-enabled sampling.
- [MCP elicitation](https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation): Form and URL interaction modes, user consent, identity binding, and sensitive-data restrictions.
- [MCP tasks](https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/tasks): Experimental durable execution, states, polling, results, cancellation, TTL, and authorization-context binding.
- [MCP authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization): OAuth resource-server role, protected-resource discovery, resource indicators, audience validation, scopes, PKCE, and token handling.
- [MCP security best practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices): Confused deputy, token passthrough, SSRF, consent, redirect, and local-server risks.
- [Official TypeScript SDK v1 branch](https://github.com/modelcontextprotocol/typescript-sdk/tree/v1.x): Production SDK APIs, examples, client and server guides, capabilities, and transport implementations.
- [MCP specification changelog](https://modelcontextprotocol.io/specification/2025-11-25/changelog): Differences introduced by the `2025-11-25` revision.

### Web and API primary sources

- [RFC 9110, HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html): HTTP resources, representations, requests, responses, methods, status codes, fields, and stateless semantics.
- [Fielding dissertation, REST](https://roy.gbiv.com/pubs/dissertation/fielding_dissertation.pdf): The REST architectural style and its constraints.
- [OpenAPI Specification 3.2.0](https://spec.openapis.org/oas/v3.2.0.html): Machine-readable HTTP API descriptions, operations, parameters, schemas, responses, and security definitions.
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification): Requests, responses, notifications, errors, IDs, parameters, and transport independence.
- [WHATWG Server-Sent Events](https://html.spec.whatwg.org/dev/server-sent-events.html): The `text/event-stream` format and reconnection model used by SSE.

## Code and evidence plan

The implementation should live as a small companion package so the posts do not rely on uncompiled snippets.

Proposed package shape:

```text
companion/mcp-engineering-ops/
├── package.json
├── tsconfig.json
├── src/
│   ├── domain/
│   │   ├── incident.ts
│   │   └── ports.ts
│   ├── adapters/
│   │   ├── in-memory-incident-repository.ts
│   │   └── http-incident-api.ts
│   ├── mcp/
│   │   ├── create-server.ts
│   │   ├── tools.ts
│   │   ├── resources.ts
│   │   └── prompts.ts
│   ├── client/
│   │   ├── connect.ts
│   │   └── catalog.ts
│   ├── host/
│   │   ├── approvals.ts
│   │   ├── model-gateway.ts
│   │   ├── model-loop.ts
│   │   └── result-mapping.ts
│   ├── stdio.ts
│   └── http.ts
└── tests/
    ├── domain.test.ts
    ├── tool-contracts.test.ts
    ├── lifecycle.test.ts
    ├── client-consumption.test.ts
    ├── host-model-loop.test.ts
    ├── multi-server-routing.test.ts
    ├── authorization.test.ts
    └── model-evals.test.ts
```

Validation layers:

1. Unit tests for domain behavior without MCP or HTTP.
2. Contract tests for tool inputs, outputs, and error shapes.
3. Protocol tests for initialization, discovery, calls, cancellation, and shutdown.
4. Transport tests for stdio framing and Streamable HTTP behavior.
5. Client tests for catalog discovery, direct calls, resources, prompts, and capability checks.
6. Deterministic host-loop tests for tool selection, approval, result mapping, continuation, and termination.
7. Authorization tests for audience, scope, tenant, and downstream-token separation.
8. Model evals for tool selection, argument construction, correction after errors, and refusal on insufficient evidence.
9. Host compatibility checks with MCP Inspector and selected real hosts.

## Editorial guardrails

- Introduce terms before acronyms.
- Keep HTTP, REST, OpenAPI, JSON-RPC, MCP, and function calling in separate conceptual boxes.
- Use the same incident example across layers so the comparison changes one variable at a time.
- Include raw wire messages before SDK abstractions.
- Label normative specification requirements separately from design advice.
- Do not imply that every MCP host supports every optional capability.
- Pin spec and SDK versions in each implementation post.
- Keep security next to the feature that creates the risk, then revisit the complete threat model in Part 9.
- Prefer one strong diagram per interaction over decorative diagrams.
- Do not describe MCP as magic integration glue or as a replacement for well-designed domain APIs.
- End every post with “what this layer owns” and “what this layer does not own.”

## Definition of done for the outline phase

- [x] The audience and prerequisite knowledge are explicit.
- [x] MCP is compared with HTTP, REST, OpenAPI, JSON-RPC, and function calling.
- [x] The comparison explains layers instead of presenting false alternatives.
- [x] The full model interaction path includes user, host, model, MCP client, MCP server, and backend.
- [x] The shared example covers tools, resources, prompts, sampling, elicitation, roots, mutations, and long-running work.
- [x] Primary MCP, HTTP, REST, OpenAPI, JSON-RPC, and SSE sources are mapped to planned material.
- [x] Current specification and TypeScript SDK baselines are recorded.
- [x] Security and production constraints are part of the curriculum, not a final disclaimer.
- [x] Server consumption and model-loop integration have a dedicated implementation post.
- [x] Inspection, existing-host use, and direct model integration are separate hands-on labs.
- [x] Review the series title and nine-part scope with the repository owner.
- [x] Create the companion package and prove the model tool loop with deterministic tests.
- [x] Draft and cross-link all nine posts from this plan.
- [x] Run source, prose, link, and build validation before publication.
