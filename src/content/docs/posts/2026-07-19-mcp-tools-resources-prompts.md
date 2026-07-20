---
title: "MCP 4: Tools, Resources, and Prompts"
description: "How MCP tools, resources, resource templates, and prompts divide execution, context, and reusable interaction design."
date: 2026-07-19
tags: [mcp, ai, tools, context-engineering]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-mcp-tools-resources-prompts/
series:
  slug: mcp-server-design
  order: 4
---

This is part 4 of the [MCP Server Design series](../series/mcp-server-design/).

MCP offers three server primitives because execution, context, and reusable interaction are different contracts. Turning every capability into a tool works for a demo and produces a muddy production interface.

## The control model

- **Tools** are commonly model-controlled. The model proposes an operation based on its name, description, and schema.
- **Resources** are commonly application-controlled. The host decides which addressable content to read or attach.
- **Prompts** are commonly user-controlled. A user selects a reusable template and supplies its arguments.

These labels describe typical interaction. They do not grant authority. The host still decides how each primitive appears and what policy applies.

## Tools: executable operations

A tool is a named operation with an input schema and optional output schema and behavior annotations.

Good incident tools include `get_incident`, `search_incidents`, and `add_incident_note`. Each one has a bounded job and a result the model can use.

Tools fit when the server must calculate, query, mutate, contact another service, or choose data dynamically from structured arguments.

Do not model a 200-page runbook as `get_runbook_text` only because tools are easy to call. A resource gives the content an address, MIME type, size, annotations, and a retrieval contract that hosts can present outside a tool loop.

## Resources: addressable context

A resource has a URI, name, optional title and description, MIME type, size, and annotations. Content may be text or binary.

```text
runbook://services/checkout
service://catalog/checkout
incident://INC-204/timeline
```

URI design should produce stable identity. A URI is not proof of authorization. The server checks access when the resource is read.

Resources support discovery through `resources/list` and retrieval through `resources/read`. Servers can expose subscriptions and list-change notifications when negotiated.

### Resource templates

A resource template describes a family of URIs:

```text
runbook://services/{service}
```

Templates keep a server from listing every possible service while still teaching the client how to address one. Completion can help users fill template arguments when the server and client support it.

### Resource links and embedded resources

A tool result can link to a resource instead of copying a large document into the result. It can also embed resource content when the content is small and directly needed.

Links preserve identity and let the host decide whether to load more context. Embedding removes a round trip but spends context immediately.

## Prompts: reusable interaction templates

An MCP prompt is a named template with optional arguments. Retrieving a prompt returns messages that a host can place into an interaction.

```json
{
  "name": "investigate_incident",
  "arguments": { "incidentId": "INC-204" }
}
```

The returned message can tell the assistant to read the incident and its runbook before proposing a mutation. It can include embedded resources or other supported content blocks.

A prompt is not automatically a system instruction. The host controls how the message is presented and which role or priority it receives. Server content remains untrusted input.

## A decision table

| Need | Primitive | Reason |
| --- | --- | --- |
| Search incidents from criteria | Tool | Dynamic computation from structured arguments |
| Read one known runbook | Resource | Stable, addressable context |
| Describe all service runbooks | Resource template | A URI family is larger than a static list |
| Start a standard investigation | Prompt | Reusable user-selected interaction shape |
| Append an incident note | Tool | Explicit mutation with approval and idempotency |
| Return a diagnostic archive | Resource link from a tool | Execution produces content too large to inline |

## A practical registration example

The companion server registers a runbook template separately from incident tools:

```ts
server.registerResource(
  "service-runbook",
  new ResourceTemplate("runbook://services/{service}", { list: undefined }),
  {
    title: "Service runbook",
    description: "Operational checks for one service.",
    mimeType: "text/markdown",
  },
  async (uri, { service }) => ({
    contents: [{
      uri: uri.href,
      mimeType: "text/markdown",
      text: await runbooks.read(String(service)),
    }],
  }),
);
```

The resource handler still validates `service` and checks authorization. A template is discovery metadata, not a free pass to arbitrary paths.

## Freshness and context cost

Resources need explicit freshness behavior. Hosts may display `lastModified` annotations or use subscriptions, but an application should not assume every client caches or invalidates content the same way.

HTTP caching does not automatically become MCP resource caching. A remote server may use HTTP caches behind its implementation, while the MCP resource still has its own identity and update semantics.

Large resources also need a context strategy. Provide summaries, sections, or resource links rather than assuming the host can place an entire repository or knowledge base into one model request.

## Common boundary mistakes

- A resource that performs a hidden mutation violates reader expectations.
- A prompt that claims system-level authority crosses the host boundary.
- A tool that returns an unbounded database dump ignores context cost.
- A resource URI built from an unchecked filesystem path creates traversal risk.
- A catalog that changes without a negotiated notification can leave hosts stale.

## What this layer owns

Tools define executable operations. Resources define addressable context. Prompts define reusable interaction messages. The host owns presentation and context placement. The server owns access checks and accurate metadata.

## Series navigation

- Previous: [Part 3: Lifecycle, capabilities, and JSON-RPC](../2026-07-19-mcp-lifecycle-capabilities-json-rpc/)
- Next: [Part 5: Tool design for models](../2026-07-19-mcp-tool-design-for-models/)
- Series index: [MCP Server Design](../series/mcp-server-design/)

## References

- [MCP tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
- [MCP resources](https://modelcontextprotocol.io/specification/2025-11-25/server/resources)
- [MCP prompts](https://modelcontextprotocol.io/specification/2025-11-25/server/prompts)

## Related topics

- [Context engineering](../../topics/ai/harness-development/context-engineering/)
- [Tool design and schema discipline](../../topics/ai/harness-development/tool-design/)
- [Structured outputs](../../topics/ai/prompt-engineering/structured-outputs/)
