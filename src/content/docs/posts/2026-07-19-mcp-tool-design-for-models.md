---
title: "MCP 5: Tool Design for Models"
description: "Names, descriptions, JSON Schemas, annotations, structured results, recoverable errors, idempotency, approvals, and evals for reliable MCP tools."
date: 2026-07-19
tags: [mcp, ai, tool-use, schema-design, security]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-mcp-tool-design-for-models/
series:
  slug: mcp-server-design
  order: 5
---

This is part 5 of the [MCP Server Design series](../series/mcp-server-design/).

The model sees a tool's contract, not its implementation. A perfect backend behind a vague name and loose schema still produces unreliable calls.

## Design for the actual consumer

A deterministic SDK caller reads documentation once and compiles against types. A model chooses among definitions present in its current context and generates arguments probabilistically.

That changes API design priorities:

- Names need to distinguish nearby operations.
- Descriptions need to state when to call and what authority the operation has.
- Schemas need to rule out invented values.
- Results need to fit the next reasoning step.
- Errors need to describe a recoverable next action.

## Name one domain operation

`get_incident` is better than `get`. `add_incident_note` is better than `update_incident` when notes are the only allowed mutation.

Avoid a single `incident` tool with an `action` enum covering search, read, update, close, page, and notify. Overloaded tools hide different risk and approval policies behind one definition.

The `2025-11-25` specification gives tool names a restricted format and recommends meaningful, stable names. Hosts may add server namespaces when several servers expose collisions.

## Write descriptions as decision support

Compare:

```text
Get incident information.
```

with:

```text
Read one incident by its stable ID. Returns service, severity,
status, and recent notes. This tool does not modify incident state.
```

The second description gives the model selection clues and gives the host useful approval text. It does not contain persuasion, hidden policy, or unrelated instructions.

## Constrain the input schema

The companion tool uses Zod to reject malformed IDs before domain work begins:

```ts
inputSchema: {
  incidentId: z.string().regex(/^INC-[0-9]+$/),
}
```

Use enums for closed choices, numeric bounds for limits, formats for dates and IDs, and maximum lengths for user text. Prefer explicit fields over `payload`, `options`, or free-form `instructions`.

Defaults deserve care. A missing `includeResolved` field can safely default to false. A missing target environment should not silently default to production.

## Keep the server authoritative

Client-side schema validation improves feedback. It is not a security boundary. The server validates again and checks resource-level authorization.

A user allowed to call `get_incident` may still lack access to `INC-204`. Tool availability and object authorization answer different questions.

## Treat annotations as hints

MCP tool annotations include read-only, destructive, idempotent, and open-world hints. They help hosts present and classify calls.

```ts
annotations: {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
}
```

Annotations do not enforce behavior. A malicious server can label a destructive tool as read-only. Hosts treat them as untrusted unless the server is trusted and verified.

## Separate mutation from confirmation

`add_incident_note` changes state. Its description says so, and its input includes an idempotency key:

```ts
inputSchema: {
  incidentId: z.string().regex(/^INC-[0-9]+$/),
  note: z.string().min(1).max(500),
  requestId: z.string().uuid(),
}
```

An idempotency key prevents a timeout retry from appending the same note twice. It does not replace approval. Approval confirms intent. Idempotency controls duplicate execution.

Preview tools can help with expensive or destructive actions, but a preview must be bound to the final inputs. Otherwise the model can preview one change and execute another.

## Return two useful representations

Structured content lets the host and model consume stable fields. Text content provides a portable fallback for clients that display or pass text.

```ts
return {
  content: [{ type: "text", text: `Added a note to ${incident.id}.` }],
  structuredContent: { incident },
};
```

If the tool declares an output schema, its structured result should satisfy it. Keep output schemas smaller than backend response models. Internal audit fields, secrets, and large histories do not belong in every result.

## Make execution errors recoverable

Return `isError: true` for a valid tool call that could not complete:

```ts
return {
  content: [{
    type: "text",
    text: "Incident INC-999 was not found. Search incidents before retrying.",
  }],
  isError: true,
};
```

The message states what failed and a safe recovery. Do not expose stack traces, SQL, tokens, internal hostnames, or other users' records.

Use JSON-RPC errors for malformed protocol requests and unknown methods. A model is less likely to recover from protocol failure because the client contract itself may be broken.

## Treat results as untrusted context

A tool may return text copied from tickets, documents, or the web. That content can contain prompt injection. Mark provenance, cap size, preserve the distinction between data and instructions, and avoid elevating tool text into a higher-priority message.

Sanitizing output does not mean deleting every imperative sentence. It means preventing untrusted content from changing authority or triggering hidden execution.

## Evaluate behavior, not schema validity

Tool tests cover three layers:

1. Contract tests confirm schemas, output shapes, errors, and idempotency.
2. Model evals test whether representative prompts select the right tool and construct valid arguments.
3. Safety evals test ambiguous intent, missing approval, injected result text, and cross-tenant IDs.

Include negative cases. “Tell me about checkout” should not call a mutation. “Close everything” should not become a broad destructive operation because the schema happens to accept an array.

## What this layer owns

The tool contract makes correct model behavior easier and unsafe behavior visible. The host owns approval. The server owns validation and authorization. Evals reveal the gaps between a valid schema and reliable use.

## Series navigation

- Previous: [Part 4: Tools, resources, and prompts](../2026-07-19-mcp-tools-resources-prompts/)
- Next: [Part 6: Build a local TypeScript server](../2026-07-19-build-local-typescript-mcp-server/)
- Series index: [MCP Server Design](../series/mcp-server-design/)

## References

- [MCP tools specification](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
- [Tool annotations as risk vocabulary](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/)
- [MCP security best practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices)

## Related topics

- [Tool design and schema discipline](../../topics/ai/harness-development/tool-design/)
- [Permission and trust models](../../topics/ai/harness-development/permission-models/)
- [Structured outputs](../../topics/ai/prompt-engineering/structured-outputs/)
