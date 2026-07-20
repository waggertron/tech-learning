---
title: "MCP 7: Build a Client and Model Tool Loop"
description: "How to consume an MCP server, discover every primitive, map tools into model function calling, enforce approval, return results, and stop the loop safely."
date: 2026-07-19
tags: [mcp, ai, agents, typescript, tool-use]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-build-mcp-client-model-loop/
series:
  slug: mcp-server-design
  order: 7
---

This is part 7 of the [MCP Server Design series](../series/mcp-server-design/).

A server is useful only when something consumes it. This part builds the other half: a client that discovers MCP capabilities and a host loop that connects those tools to model function calling without giving model output automatic authority.

## Three levels of consumption

1. **Inspector**: Exercise protocol operations manually without a model.
2. **Existing host**: Configure the stdio server in an IDE or desktop host and use its approval interface.
3. **Custom host**: Build the MCP client, tool filtering, model adapter, approval policy, and continuation loop.

Each level answers a different question. Inspector proves the server contract. An existing host proves compatibility. A custom host teaches orchestration.

## Connect an MCP client

```ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({
  name: "engineering-ops-reader",
  version: "1.0.0",
});

const transport = new StdioClientTransport({
  command: process.execPath,
  args: ["dist/src/stdio.js"],
});

await client.connect(transport);
```

`connect` launches the process and completes initialization through the SDK. The client now knows which capabilities the server negotiated.

## Inspect the whole catalog

```ts
const [tools, resources, templates, prompts] = await Promise.all([
  client.listTools(),
  client.listResources(),
  client.listResourceTemplates(),
  client.listPrompts(),
]);
```

Direct consumption does not require a model:

```ts
const incident = await client.callTool({
  name: "get_incident",
  arguments: { incidentId: "INC-204" },
});

const runbook = await client.readResource({
  uri: "runbook://services/checkout",
});

const prompt = await client.getPrompt({
  name: "investigate_incident",
  arguments: { incidentId: "INC-204" },
});
```

This is the best debugging boundary. If a direct call fails, changing the model prompt will not fix the protocol or server.

## Filter before model exposure

The model does not need every discovered tool. Filter by user access, server trust, current task, mutation policy, and context budget.

Tool discovery is a protocol feature. Tool selection for one model request is a host feature.

## Add a provider-neutral model port

The companion package keeps model-provider details behind an interface:

```ts
export interface ModelGateway {
  generate(
    messages: ConversationMessage[],
    tools: ToolDefinition[],
  ): Promise<ModelTurn>;
}
```

A provider adapter translates MCP-compatible JSON Schemas into that provider's tool-definition shape and translates provider tool calls back into the host's `ToolCall` type.

This boundary prevents provider message types from leaking into server code. It also makes the loop testable with a deterministic fake model.

## Model intent is not permission

```ts
export interface ApprovalPolicy {
  approve(call: ToolCall): Promise<boolean>;
}
```

An approval policy can auto-approve trusted read-only calls, ask the user about mutations, and deny tools outside the current workspace. It can also show exact arguments before execution.

The server still performs authorization. Host approval and server access control defend different boundaries.

## Run the loop

```ts
export async function runModelLoop(options: {
  userMessage: string;
  model: ModelGateway;
  tools: ToolClient;
  approvals: ApprovalPolicy;
  maxTurns?: number;
}): Promise<string> {
  const definitions = await options.tools.listTools();
  const messages = [{ role: "user", content: options.userMessage }];
  const maxTurns = options.maxTurns ?? 8;

  for (let turn = 0; turn < maxTurns; turn += 1) {
    const response = await options.model.generate(messages, definitions);
    if (response.type === "message") return response.text;

    for (const call of response.calls) {
      const approved = await options.approvals.approve(call);
      const content = approved
        ? await options.tools.callTool(call.name, call.arguments)
        : `Tool call ${call.name} was denied by policy.`;

      messages.push({ role: "tool", toolCallId: call.id, content });
    }
  }

  throw new Error(`Model loop exceeded ${maxTurns} turns.`);
}
```

Production code adds per-call timeouts, cancellation, result-size limits, schema validation, tracing, and cost budgets. The loop limit is still valuable when every other control works.

## Translate results deliberately

MCP tool results can carry text, images, audio, embedded resources, resource links, and structured content. Model providers use their own tool-result message shapes.

The adapter should preserve the tool-call ID, select supported content, cap large values, mark errors, and retain provenance. Do not stringify an unlimited result and drop it blindly into the next request.

A denied call also becomes an explicit tool result. The model can explain that the action did not occur instead of hallucinating success.

## Handle parallel calls carefully

Some models return several tool calls in one turn. Reads may run concurrently when their services can tolerate it. Mutations may need serial approval and ordering.

Every result must map to the correct call ID. Partial failure should not erase successful results. If one call is cancelled, the host should state that outcome rather than omitting it.

## Multi-server routing

Two servers may both expose `search`. The host needs an internal identity that includes the server connection, even if the model-facing name is namespaced or rewritten.

Never route solely by a display label. Bind each supplied definition to its source server and verify that binding before execution.

## Test without credentials

The companion test uses a fake model. The first turn requests `get_incident`. The fake tool client returns data. The second turn verifies that a tool message arrived and returns a final answer.

Another test denies `add_incident_note`, proves the client never executes it, and lets the model report the denial.

Real provider testing comes after deterministic orchestration tests. Use `YOUR_API_KEY_HERE` only as documentation and load the real credential from the environment.

## What this layer owns

The MCP client owns protocol consumption. The host owns filtering, model translation, approval, routing, limits, and continuation. The model proposes calls. The server remains authoritative for validation and resource access.

## Series navigation

- Previous: [Part 6: Build a local TypeScript server](../2026-07-19-build-local-typescript-mcp-server/)
- Next: [Part 8: Sampling, elicitation, roots, and tasks](../2026-07-19-mcp-sampling-elicitation-roots-tasks/)
- Series index: [MCP Server Design](../series/mcp-server-design/)

## References

- [Official TypeScript SDK client guide](https://github.com/modelcontextprotocol/typescript-sdk/blob/v1.x/docs/client.md)
- [MCP client best practices](https://modelcontextprotocol.io/docs/develop/clients/client-best-practices)
- [MCP architecture overview](https://modelcontextprotocol.io/docs/learn/architecture)

## Related topics

- [Harness development](../../topics/ai/harness-development/)
- [Permission and trust models](../../topics/ai/harness-development/permission-models/)
- [Context engineering](../../topics/ai/harness-development/context-engineering/)
