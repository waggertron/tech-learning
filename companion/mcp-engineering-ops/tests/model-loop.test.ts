import assert from "node:assert/strict";
import test from "node:test";

import {
  type ApprovalPolicy,
  type ModelGateway,
  type ToolClient,
  runModelLoop,
} from "../src/host/model-loop.js";

test("executes an approved tool call and returns the next model message", async () => {
  let modelTurn = 0;
  const model: ModelGateway = {
    async generate(messages, tools) {
      modelTurn += 1;
      assert.equal(tools[0].name, "get_incident");
      if (modelTurn === 1) {
        return {
          type: "tool_calls",
          calls: [
            {
              id: "call-1",
              name: "get_incident",
              arguments: { incidentId: "INC-204" },
            },
          ],
        };
      }
      assert.equal(messages.at(-1)?.role, "tool");
      return { type: "message", text: "Checkout has a high-severity incident." };
    },
  };

  const tools: ToolClient = {
    async listTools() {
      return [{ name: "get_incident", inputSchema: { type: "object" } }];
    },
    async callTool(name, arguments_) {
      assert.equal(name, "get_incident");
      assert.deepEqual(arguments_, { incidentId: "INC-204" });
      return '{"severity":"high","service":"checkout"}';
    },
  };

  const approvals: ApprovalPolicy = { async approve() { return true; } };
  const result = await runModelLoop({
    userMessage: "What is happening with checkout?",
    model,
    tools,
    approvals,
  });

  assert.equal(result, "Checkout has a high-severity incident.");
});

test("returns a denial result to the model without executing the tool", async () => {
  let executed = false;
  let modelTurn = 0;
  const model: ModelGateway = {
    async generate(messages) {
      modelTurn += 1;
      if (modelTurn === 1) {
        return {
          type: "tool_calls",
          calls: [
            {
              id: "call-2",
              name: "add_incident_note",
              arguments: { incidentId: "INC-204", note: "Resolved" },
            },
          ],
        };
      }
      assert.match(messages.at(-1)?.content ?? "", /denied by policy/);
      return { type: "message", text: "The note was not added." };
    },
  };

  const tools: ToolClient = {
    async listTools() { return []; },
    async callTool() { executed = true; return "unexpected"; },
  };
  const approvals: ApprovalPolicy = { async approve() { return false; } };

  const result = await runModelLoop({
    userMessage: "Mark the incident resolved.",
    model,
    tools,
    approvals,
  });

  assert.equal(executed, false);
  assert.equal(result, "The note was not added.");
});
