export type ToolDefinition = {
  name: string;
  description?: string;
  inputSchema: Record<string, unknown>;
};

export type ToolCall = {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
};

export type ConversationMessage =
  | { role: "user" | "assistant"; content: string }
  | { role: "tool"; toolCallId: string; content: string };

export type ModelTurn =
  | { type: "message"; text: string }
  | { type: "tool_calls"; calls: ToolCall[] };

export interface ModelGateway {
  generate(messages: ConversationMessage[], tools: ToolDefinition[]): Promise<ModelTurn>;
}

export interface ToolClient {
  listTools(): Promise<ToolDefinition[]>;
  callTool(name: string, arguments_: Record<string, unknown>): Promise<string>;
}

export interface ApprovalPolicy {
  approve(call: ToolCall): Promise<boolean>;
}

export async function runModelLoop(options: {
  userMessage: string;
  model: ModelGateway;
  tools: ToolClient;
  approvals: ApprovalPolicy;
  maxTurns?: number;
}): Promise<string> {
  const definitions = await options.tools.listTools();
  const messages: ConversationMessage[] = [{ role: "user", content: options.userMessage }];
  const maxTurns = options.maxTurns ?? 8;

  for (let turn = 0; turn < maxTurns; turn += 1) {
    const response = await options.model.generate(messages, definitions);
    if (response.type === "message") {
      return response.text;
    }

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
