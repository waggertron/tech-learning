---
title: "MCP 6: Build a Local TypeScript Server"
description: "A compiling stdio MCP server with separated domain logic, tools, a resource template, a prompt, structured errors, deterministic tests, and clean shutdown."
date: 2026-07-19
tags: [mcp, typescript, ai, backend]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-build-local-typescript-mcp-server/
series:
  slug: mcp-server-design
  order: 6
---

This is part 6 of the [MCP Server Design series](../series/mcp-server-design/).

The companion project turns the protocol and design rules into a working local server. Its baseline is `@modelcontextprotocol/sdk@1.29.0`, the production-recommended v1 TypeScript SDK as of July 19, 2026. The official v2 line is still pre-release, so do not mix its split-package imports into this project.

## Project boundary

```text
companion/mcp-engineering-ops/
├── src/domain/incidents.ts
├── src/mcp/create-server.ts
├── src/stdio.ts
├── src/client/catalog.ts
├── src/host/model-loop.ts
└── tests/
```

The domain service knows incidents and idempotency. It does not import MCP. The MCP adapter knows schemas and content blocks. It does not own domain rules.

## Install and verify

```bash
cd companion/mcp-engineering-ops
npm install
npm test
npm run build
```

The tests need no network service or model credentials.

## Build the domain first

```ts
export class IncidentService {
  readonly #incidents = new Map<string, Incident>();
  readonly #requestIds = new Set<string>();

  getIncident(incidentId: string): Incident {
    const incident = this.#incidents.get(incidentId);
    if (!incident) {
      throw new IncidentNotFoundError(`Incident ${incidentId} was not found.`);
    }
    return structuredClone(incident);
  }

  addNote(incidentId: string, note: string, requestId: string): Incident {
    if (this.#requestIds.has(requestId)) {
      throw new DuplicateRequestError(`Request ${requestId} was already applied.`);
    }

    const incident = this.getIncident(incidentId);
    incident.notes.push(note);
    this.#incidents.set(incidentId, incident);
    this.#requestIds.add(requestId);
    return structuredClone(incident);
  }
}
```

The example uses memory so the reader can run it anywhere. A production adapter can call an existing REST API or repository through the same application boundary.

## Create the MCP server

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
  name: "engineering-ops",
  version: "1.0.0",
});
```

The implementation name and version appear during initialization. They are useful for compatibility and debugging, not a replacement for protocol-version negotiation.

## Register a read tool

```ts
server.registerTool(
  "get_incident",
  {
    title: "Get incident",
    description: "Read one incident by its stable ID. This tool does not modify incident state.",
    inputSchema: {
      incidentId: z.string().regex(/^INC-[0-9]+$/),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ incidentId }) => {
    try {
      const incident = incidents.getIncident(incidentId);
      return {
        content: [{ type: "text", text: JSON.stringify(incident) }],
        structuredContent: { incident },
      };
    } catch (error) {
      if (error instanceof IncidentNotFoundError) {
        return {
          content: [{ type: "text", text: error.message }],
          isError: true,
        };
      }
      throw error;
    }
  },
);
```

The handler translates domain outcomes into MCP results. Unexpected failures remain server errors and belong in sanitized logs.

## Register a resource template

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
      text: await readRunbook(String(service)),
    }],
  }),
);
```

Production code validates the service name, enforces identity, and caps resource size before returning content.

## Register a prompt

```ts
server.registerPrompt(
  "investigate_incident",
  {
    description: "Create a bounded incident investigation request.",
    argsSchema: {
      incidentId: z.string().regex(/^INC-[0-9]+$/),
    },
  },
  ({ incidentId }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Investigate ${incidentId}. Read evidence before proposing mutation.`,
      },
    }],
  }),
);
```

The host decides how this prompt enters the interaction.

## Connect stdio

```ts
const server = createEngineeringOpsServer(createExampleIncidentService());
const transport = new StdioServerTransport();

process.on("SIGINT", async () => {
  await server.close();
  process.exit(0);
});

await server.connect(transport);
```

Standard output belongs to protocol messages. Send diagnostics to standard error. A stray `console.log` on stdout can corrupt framing for a local client.

## Inspect before adding a model

Use MCP Inspector or an existing host to initialize the process, list tools, call `get_incident`, read `runbook://services/checkout`, and retrieve `investigate_incident`.

Test the failure path with `INC-999`. The server should return an execution error, stay running, and accept the next call.

## What this layer owns

The server adapter owns MCP registration and result mapping. The domain service owns incident behavior. Stdio owns local message transport. The host, introduced next, owns model orchestration and approval.

## Series navigation

- Previous: [Part 5: Tool design for models](../2026-07-19-mcp-tool-design-for-models/)
- Next: [Part 7: Build a client and model loop](../2026-07-19-build-mcp-client-model-loop/)
- Series index: [MCP Server Design](../series/mcp-server-design/)

## References

- [Official TypeScript SDK v1 branch](https://github.com/modelcontextprotocol/typescript-sdk/tree/v1.x)
- [Build an MCP server](https://modelcontextprotocol.io/docs/develop/build-server)
- [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)

## Related topics

- [Web topics](../../topics/web/)
- [Tool design and schema discipline](../../topics/ai/harness-development/tool-design/)
- [API design](../../topics/system-design/api-design/)
