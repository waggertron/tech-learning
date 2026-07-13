---
title: Tool Design and Schema Discipline
description: "How tool names, descriptions, argument schemas, return contracts, idempotency, and error shapes determine whether agents call tools safely."
parent: harness-development
tags: [tool-use, mcp, agents]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## Tools are the model's action interface

The model sees a tool through its name, description, argument schema, and recent results. It does not see the implementation. It does not know which fields are expensive, destructive, slow, deprecated, or security-sensitive unless the tool contract says so.

That makes tool design a user-experience problem for the model. The "user" is not a human clicking a UI. It is a probabilistic planner choosing a function and filling arguments from context.

Good tool contracts make the right call easy, the wrong call hard, and recovery possible when input is bad.

## Key ideas

- **Descriptions are prompts**: A vague description produces erratic tool choice. A good description says when to use the tool, when not to use it, what it returns, and what authority it has.
- **Schemas are guardrails**: Required fields, enum values, numeric bounds, string formats, and nested objects reduce the model's mistake surface.
- **Error contracts are part of the API**: `bad input` is not recoverable. `file_not_found`, `permission_denied`, `invalid_enum`, and `rate_limited` let the agent pick a next step.
- **Idempotency matters**: Repeating a read is harmless. Repeating a purchase, deploy, or email may not be. Label mutation tools clearly and require idempotency keys where appropriate.
- **Versioning prevents silent drift**: Changing argument names, defaults, or return shapes can break agent behavior without a compile error. Version tool schemas and test them with evals.

## Naming and descriptions

Tool names should be specific:

- `read_file` is clearer than `get`
- `create_github_issue` is clearer than `post`
- `query_customer_orders` is clearer than `search`
- `send_email` should sound irreversible

Descriptions should include operational boundaries:

- what the tool can access
- what the tool cannot access
- whether it mutates state
- whether it contacts external systems
- what errors mean
- one or two examples of appropriate use

The model should not have to infer whether a tool is safe from a generic capability statement.

## Schema design

Prefer constrained shapes:

- enums for known modes
- booleans only when the two meanings are obvious
- explicit date formats
- arrays with item schemas
- `dry_run` or `preview` modes for mutations
- idempotency keys for actions that can be retried

Avoid broad catch-all fields such as `instructions`, `payload`, or `options` unless the tool genuinely needs free-form input. Those fields push the hard part back into the model.

## Return contracts

A useful tool result tells the model what happened and what to do next:

```json
{
  "ok": false,
  "error": "file_not_found",
  "path": "src/app.ts",
  "hint": "Run a file search before retrying."
}
```

That is better than an exception string because it is structured, specific, and actionable.

For successful results, include stable IDs, changed resources, counts, timestamps when relevant, and a compact summary. Do not return massive raw blobs unless the tool is explicitly a raw-read tool.

## Common failure modes

- **Overloaded tools**: One tool does search, read, write, delete, and notify depending on a mode flag.
- **Free-text arguments where enums would work**: The model invents values that the implementation cannot handle.
- **Ambiguous errors**: The model retries the same bad call because it cannot tell what failed.
- **Hidden side effects**: A "lookup" tool writes analytics, sends messages, or changes state.
- **No eval coverage**: Tool schemas drift and no test catches that the model now calls them incorrectly.

## Practical checklist

- Make names specific and action-oriented.
- State whether the tool reads, writes, sends, or deletes.
- Use enums and typed fields where possible.
- Return structured errors with recovery hints.
- Version schemas and run tool-call evals before deployment.

## References

- [Tool use, Anthropic Claude Docs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [Function calling, OpenAI Docs](https://platform.openai.com/docs/guides/function-calling)
- [MCP (Model Context Protocol), Anthropic](https://modelcontextprotocol.io/)
- [Agentic Engineering Patterns, Simon Willison](https://simonwillison.net/guides/agentic-engineering-patterns/)

## Related topics

- [Structured outputs](../../prompt-engineering/structured-outputs/), schema discipline for model responses
- [Permission and trust models](../permission-models/), deciding which tool calls can execute
- [Context engineering](../context-engineering/), shaping tool results before they enter context
- [API design](../../../system-design/api-design/), the broader API contract discipline
