import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createExampleIncidentService } from "./domain/incidents.js";
import { createEngineeringOpsServer } from "./mcp/create-server.js";

const server = createEngineeringOpsServer(createExampleIncidentService());
const transport = new StdioServerTransport();

process.on("SIGINT", async () => {
  await server.close();
  process.exit(0);
});

await server.connect(transport);
