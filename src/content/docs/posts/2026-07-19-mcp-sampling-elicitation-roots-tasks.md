---
title: "MCP 8: Sampling, Elicitation, Roots, and Tasks"
description: "Bidirectional MCP features for model generation, user input, workspace boundaries, and durable work, including capability checks and trust constraints."
date: 2026-07-19
tags: [mcp, ai, agents, workflows]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-mcp-sampling-elicitation-roots-tasks/
series:
  slug: mcp-server-design
  order: 8
---

This is part 8 of the [MCP Server Design series](../series/mcp-server-design/).

Tools, resources, and prompts flow primarily from server to client. MCP also defines client capabilities that let a server request model work, user interaction, or workspace boundaries during an originating operation.

These features are negotiated. A server checks capability support before sending a request and keeps a fallback when the host does not support it.

## Sampling: ask the host for model generation

Sampling lets a server request a model completion through the client. The server does not need its own model credential, and the host retains control over model access, selection, review, and policy.

An incident tool can collect bounded evidence and request a handoff draft:

```ts
const response = await context.mcpReq.requestSampling({
  messages: [{
    role: "user",
    content: {
      type: "text",
      text: `Draft a handoff from this evidence:\n${evidence}`,
    },
  }],
  maxTokens: 500,
});
```

The client must have declared sampling. The host may show the request to the user, let the user edit it, choose a different model, deny it, or review the result before returning it.

Sampling is useful when model work belongs inside a domain operation. It is not a shortcut for moving the entire host agent loop into the server.

### Sampling with tools

The `2025-11-25` specification allows sampling requests to include tools when the client declares `sampling.tools`. This creates a nested tool loop inside a server-originated model request.

Set strict limits. A sampled model with tools can multiply cost, latency, and authority paths. The server and host need an agreement about which tools are available and how their results are reviewed.

## Elicitation: ask the user

Form elicitation collects non-sensitive structured input, such as a missing incident severity or a choice among safe options.

The result can be accepted, declined, or cancelled. Code handles all three instead of assuming a value arrived.

Form elicitation must not ask for passwords, API keys, access tokens, payment credentials, or other secrets. Use URL elicitation for sensitive flows hosted on a secure web origin.

### URL elicitation

URL mode asks the client to present a URL for an external interaction such as OAuth or payment. The URL must not contain user secrets or personal data.

The server binds the completion to the same verified user who began the flow. A callback that trusts a user ID from query text creates account-mixing and confused-deputy risk.

Clients display the target domain, provide clear consent, allow cancellation, and warn about suspicious addresses.

## Roots: discover workspace boundaries

Roots let a client expose relevant filesystem URIs:

```json
{
  "uri": "file:///workspace/checkout-service",
  "name": "checkout-service"
}
```

A repository-aware server can use roots to limit search to the active project rather than scanning the user's machine.

A root is a scope hint, not authorization proof. The server still relies on process permissions, host policy, path validation, and symlink handling. It should reject paths that escape the root after canonicalization.

Clients can declare `roots.listChanged`, which allows them to notify servers that the set changed. Servers should not cache old roots indefinitely.

## Tasks: durable work

Tasks were introduced in specification version `2025-11-25` and remain experimental. They wrap requests that need deferred execution and result retrieval.

A diagnostic collection can move through these states:

```text
working -> input_required -> working -> completed
    |                              |
    +-> failed                     +-> cancelled
```

Terminal states do not transition again. A receiver returns a task ID, status, timestamps, optional TTL, and suggested polling interval. The requestor polls `tasks/get` and retrieves the underlying result through `tasks/result`.

Status notifications are optional. A client cannot rely on receiving them and still needs polling or another documented retrieval strategy.

## Task operation is a storage problem

A production task store binds every task to the authorization context that created it. Listing, reading, cancelling, or retrieving another user's task must fail without revealing whether that ID exists.

The server caps concurrent tasks, TTL, polling rate, output size, and retained results. Cancellation should stop underlying work when possible, but the task remains cancelled even if a worker finishes late.

Tasks do not replace a job system. They provide an MCP lifecycle around durable operations that may already run in a queue.

## Request association and recursion

Server-to-client requests occur in association with an originating client request. A server should not open an unrelated stream later and demand sampling or elicitation without that context.

Guard against recursion. A tool that samples a model whose tools call the same tool can form a cycle. Track depth, originating request, cost, and cancellation across nested work.

## Fallbacks matter

- No sampling: return collected evidence for the host to summarize.
- No elicitation: return `isError: true` with the missing field and safe retry guidance.
- No roots: require an explicit configured directory or disable filesystem features.
- No tasks: run synchronously within a bounded timeout or expose a normal job-status resource.

Capability negotiation makes these decisions visible before failure.

## What this layer owns

Sampling requests model work through the host. Elicitation requests user interaction through the host. Roots describe workspace scope. Tasks describe durable request state. The host retains policy and UX. The server retains identity binding and resource enforcement.

## Series navigation

- Previous: [Part 7: Build a client and model loop](../2026-07-19-build-mcp-client-model-loop/)
- Next: [Part 9: Remote MCP in production](../2026-07-19-remote-mcp-production-security/)
- Series index: [MCP Server Design](../series/mcp-server-design/)

## References

- [MCP sampling](https://modelcontextprotocol.io/specification/2025-11-25/client/sampling)
- [MCP elicitation](https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation)
- [MCP roots](https://modelcontextprotocol.io/specification/2025-11-25/client/roots)
- [MCP tasks](https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/tasks)

## Related topics

- [Permission and trust models](../../topics/ai/harness-development/permission-models/)
- [Context engineering](../../topics/ai/harness-development/context-engineering/)
- [Message queues](../../topics/system-design/message-queues/)
