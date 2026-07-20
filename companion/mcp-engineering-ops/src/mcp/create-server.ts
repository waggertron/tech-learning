import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import {
  DuplicateRequestError,
  IncidentNotFoundError,
  IncidentService,
} from "../domain/incidents.js";

function executionError(message: string) {
  return {
    content: [{ type: "text" as const, text: message }],
    isError: true,
  };
}

export function createEngineeringOpsServer(incidents: IncidentService): McpServer {
  const server = new McpServer({
    name: "engineering-ops",
    version: "1.0.0",
  });

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
          return executionError(error.message);
        }
        throw error;
      }
    },
  );

  server.registerTool(
    "search_incidents",
    {
      title: "Search incidents",
      description: "Return at most 20 incident summaries, optionally filtered by exact service name.",
      inputSchema: {
        service: z.string().min(1).optional(),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ service }) => {
      const matches = incidents.searchIncidents(service).map(({ notes, ...summary }) => summary);
      return {
        content: [{ type: "text", text: JSON.stringify(matches) }],
        structuredContent: { incidents: matches },
      };
    },
  );

  server.registerTool(
    "add_incident_note",
    {
      title: "Add incident note",
      description: "Append one note to an incident. This changes incident state and requires approval.",
      inputSchema: {
        incidentId: z.string().regex(/^INC-[0-9]+$/),
        note: z.string().min(1).max(500),
        requestId: z.string().uuid(),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ incidentId, note, requestId }) => {
      try {
        const incident = incidents.addNote(incidentId, note, requestId);
        return {
          content: [{ type: "text", text: `Added a note to ${incident.id}.` }],
          structuredContent: { incident },
        };
      } catch (error) {
        if (error instanceof IncidentNotFoundError || error instanceof DuplicateRequestError) {
          return executionError(error.message);
        }
        throw error;
      }
    },
  );

  server.registerResource(
    "service-runbook",
    new ResourceTemplate("runbook://services/{service}", { list: undefined }),
    {
      title: "Service runbook",
      description: "Operational checks for one service.",
      mimeType: "text/markdown",
    },
    async (uri, { service }) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: `# ${service} runbook\n\n1. Check current incidents.\n2. Verify recent deploys.\n3. Record evidence before mutation.`,
        },
      ],
    }),
  );

  server.registerPrompt(
    "investigate_incident",
    {
      title: "Investigate incident",
      description: "Create a bounded incident investigation request.",
      argsSchema: {
        incidentId: z.string().regex(/^INC-[0-9]+$/),
      },
    },
    ({ incidentId }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Investigate ${incidentId}. Read the incident and relevant runbook before proposing any mutation.`,
          },
        },
      ],
    }),
  );

  return server;
}
