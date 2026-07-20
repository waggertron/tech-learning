import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export async function connectToLocalServer(serverEntry: string) {
  const client = new Client({ name: "engineering-ops-reader", version: "1.0.0" });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverEntry],
  });

  await client.connect(transport);
  return client;
}

export async function inspectCatalog(client: Client) {
  const [tools, resources, templates, prompts] = await Promise.all([
    client.listTools(),
    client.listResources(),
    client.listResourceTemplates(),
    client.listPrompts(),
  ]);

  return {
    tools: tools.tools,
    resources: resources.resources,
    resourceTemplates: templates.resourceTemplates,
    prompts: prompts.prompts,
  };
}
