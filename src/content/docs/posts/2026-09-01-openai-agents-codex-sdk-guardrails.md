---
title: OpenAI Agents SDK and Codex SDK Guardrails
description: "Place blocking workflow checks, custom-tool guardrails, approvals, trace evidence, and a hardened host boundary around OpenAI Agents SDK and Codex SDK execution."
date: 2026-09-01
tags: [ai, guardrails, openai, codex, security]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-09-01-openai-agents-codex-sdk-guardrails/
series:
  slug: engineering-ai-guardrails
  order: 10
---

This is part 10 of the [Engineering Guardrails for AI Systems series](../series/engineering-ai-guardrails/).

A support workflow receives a suspicious ticket. Its input guardrail runs in parallel for low latency. Before that guardrail returns, the agent starts and calls a tool that sends a reply.

The guardrail eventually trips, but the external effect already happened. Nothing is wrong with the tripwire. It was attached to the wrong timing guarantee for a side-effecting workflow.

OpenAI's Agents SDK provides workflow and custom-tool guardrails, approvals, and tracing. The Codex SDK exposes repository-scoped agent execution through a typed wrapper around the Codex CLI. Use each control where its documented execution boundary matches the risk, then add host-owned enforcement for every path it does not cover.

## Version and status baseline

These details were rechecked against official OpenAI documentation, repositories, and package metadata on September 1, 2026.

| Surface | Version used here | Status and boundary |
| --- | --- | --- |
| OpenAI Agents SDK for Python | `openai-agents==0.22.0` | Current PyPI release; package and APIs remain in a pre-1.0 line |
| Agents SDK model path | Responses API by default for OpenAI models | Workflow orchestration is in the SDK; provider and hosted-tool behavior still follows each API surface |
| Codex SDK for TypeScript | `@openai/codex-sdk@0.152.1` | Current npm `latest`; `0.153.0-alpha.4` is a separate alpha tag and is not used here |
| Codex CLI runtime | `@openai/codex@0.152.1` | Matching runtime wrapped by the TypeScript SDK through a child process and JSONL events |
| Hosted multi-agent model | Not used | Explicit beta surface with separate approval limitations; it does not anchor the architecture here |

The examples keep live model and process calls behind adapters. Their policy tests require no credentials. Recheck versions, exposed thread options, and beta notes before copying them into production.

## Start with the coverage map

| Control | When it runs | What it can enforce | What it does not cover |
| --- | --- | --- | --- |
| Blocking agent input guardrail | Before the first agent starts | Reject initial workflow input before model or tool work | Later handoff inputs and child-only context |
| Parallel agent input guardrail | Alongside the first agent | Low-latency detection and classification | A guarantee that no tool has started before the result |
| Agent output guardrail | On the final producing agent | Reject final candidate output | Internal tool effects already completed |
| Function-tool input guardrail | Before each supported custom function tool | Validate or reject that call before its executor | Hosted tools, built-in execution tools, handoff calls, and direct `Agent.as_tool()` guardrails |
| Function-tool output guardrail | After the supported custom function returns | Replace or reject model-visible tool output | Undoing the tool's effect |
| Human approval | Before configured tool execution | Bind a reviewer decision to a pending call | Authorization, validation, and execution-time freshness unless the application adds them |
| Agents SDK trace and guardrail results | During and after a run | Correlate runs, tools, handoffs, policy outcomes, and custom evidence | Authorization by itself; trace content also needs minimization |
| Codex sandbox and approval policy | During Codex execution | Restrict filesystem access and prompt or deny selected actions | Application-specific tenant, data, and destination authorization |
| Codex streamed events | As work progresses | Observe messages, commands, file changes, usage, failures, and completion | A universal pre-command callback in the TypeScript SDK |

The SDK names are useful shorthand. The timing and coverage columns are the security contract.

## Choose blocking input checks for side-effecting workflows

The Agents SDK input guardrail defaults to `run_in_parallel=True`. Parallel execution saves latency, but the model can consume tokens and call tools before the tripwire cancels the run. Use `run_in_parallel=False` when a failed check must prove the agent never starts.

This SDK wiring performs a blocking deterministic check:

```python
from typing import Any

from agents import (
    Agent,
    GuardrailFunctionOutput,
    RunContextWrapper,
    TResponseInputItem,
    input_guardrail,
)


def inspect_initial_input(value: str | list[TResponseInputItem]) -> dict[str, Any]:
    text = value if isinstance(value, str) else str(value)
    normalized = " ".join(text.casefold().split())
    blocked = len(text) > 8_000 or "override the verified destination" in normalized
    return {
        "decision": "block" if blocked else "allow",
        "policy_version": "support-input-v3",
        "reason": "invalid or suspicious workflow input" if blocked else "accepted",
    }


@input_guardrail(name="support_input_boundary", run_in_parallel=False)
def support_input_boundary(
    context: RunContextWrapper[Any],
    agent: Agent[Any],
    input: str | list[TResponseInputItem],
) -> GuardrailFunctionOutput:
    result = inspect_initial_input(input)
    return GuardrailFunctionOutput(
        output_info=result,
        tripwire_triggered=result["decision"] == "block",
    )
```

A second semantic screen may still run in parallel if its output only enriches evidence or changes a later release decision. Write down which checks are blocking and why. Do not let a latency optimization silently change an execution guarantee.

## Put policy on every supported custom function tool

Agent-level input and output guardrails run at workflow endpoints. In a handoff chain, the input guardrails belong to the first agent and output guardrails to the final producing agent. They do not recursively wrap every internal proposal.

Tool guardrails fill part of that gap for custom tools made with `function_tool`. Parse the canonical arguments from `data.context.tool_arguments`, check authorization immediately before the executor, and inspect returned data before it re-enters the model loop.

The application policy remains a pure function:

```python
from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class SupportAuthority:
    actor_id: str
    tenant_id: str
    verified_destination: str
    may_send: bool
    policy_version: str


def decide_send_reply(
    raw_arguments: str, authority: SupportAuthority
) -> tuple[str, dict[str, str]]:
    try:
        args = json.loads(raw_arguments)
    except json.JSONDecodeError:
        return "block", {"reason": "invalid JSON"}
    if not isinstance(args, dict) or set(args) != {"destination", "body"}:
        return "block", {"reason": "invalid shape"}
    if not authority.may_send:
        return "block", {"reason": "send capability missing"}
    if args["destination"] != authority.verified_destination:
        return "block", {"reason": "destination not verified"}
    if not isinstance(args["body"], str) or not 1 <= len(args["body"]) <= 2_000:
        return "block", {"reason": "invalid body"}
    return "allow", {
        "reason": "authorized",
        "policy_version": authority.policy_version,
    }


AUTHORITY = SupportAuthority(
    actor_id="ACTOR_EXAMPLE_7",
    tenant_id="TENANT_EXAMPLE_A",
    verified_destination="customer@example.invalid",
    may_send=True,
    policy_version="support-tools-v5",
)
```

Now attach input and output guardrails to the function tool. `needs_approval=True` pauses the run before execution. The input guardrail still rechecks policy immediately before the function runs after approval. Set `pre_approval_tool_input_guardrails=True` in `RunConfig` if you also want the same check before presenting an approval interruption.

```python
from agents import (
    ToolGuardrailFunctionOutput,
    ToolInputGuardrailData,
    ToolOutputGuardrailData,
    function_tool,
    tool_input_guardrail,
    tool_output_guardrail,
)


@tool_input_guardrail(name="send_reply_policy")
def send_reply_policy(data: ToolInputGuardrailData) -> ToolGuardrailFunctionOutput:
    decision, evidence = decide_send_reply(
        data.context.tool_arguments or "{}", AUTHORITY
    )
    if decision == "block":
        return ToolGuardrailFunctionOutput.raise_exception(output_info=evidence)
    return ToolGuardrailFunctionOutput.allow(output_info=evidence)


@tool_output_guardrail(name="send_reply_result_policy")
def send_reply_result_policy(data: ToolOutputGuardrailData) -> ToolGuardrailFunctionOutput:
    output = str(data.output or "")
    if not output.startswith("EFFECT_EXAMPLE_"):
        return ToolGuardrailFunctionOutput.reject_content(
            "The executor returned an invalid effect receipt.",
            output_info={"reason": "invalid receipt"},
        )
    return ToolGuardrailFunctionOutput.allow(
        output_info={"receipt_class": "synthetic-effect-id"}
    )


@function_tool(
    needs_approval=True,
    tool_input_guardrails=[send_reply_policy],
    tool_output_guardrails=[send_reply_result_policy],
)
async def send_reply(destination: str, body: str) -> str:
    """Send a reviewed support reply to the verified destination."""
    return await scoped_support_executor.send_reply(destination, body)
```

The executor must repeat the tenant, destination, approval-digest, expiration, and idempotency checks. The SDK's approval is a workflow pause, not a substitute for domain authorization.

## Prove policy stops the executor without a model

This credential-free harness mirrors the tool boundary, records trace evidence, and makes the side effect observable.

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class PolicyEvent:
    trace_id: str
    parent_span_id: str
    span_id: str
    event: str
    tool_name: str
    decision: str
    policy_version: str


class RecordingExecutor:
    def __init__(self) -> None:
        self.calls: list[dict[str, str]] = []

    async def send_reply(self, destination: str, body: str) -> str:
        self.calls.append({"destination": destination, "body": body})
        return "EFFECT_EXAMPLE_REPLY_1"


async def execute_guarded_reply(
    raw_arguments: str,
    authority: SupportAuthority,
    executor: RecordingExecutor,
    trace: list[PolicyEvent],
) -> str:
    decision, evidence = decide_send_reply(raw_arguments, authority)
    trace.append(
        PolicyEvent(
            trace_id="TRACE_EXAMPLE_OPENAI",
            parent_span_id="SPAN_EXAMPLE_AGENT",
            span_id="SPAN_EXAMPLE_TOOL_POLICY",
            event="tool_input_guardrail",
            tool_name="send_reply",
            decision=decision,
            policy_version=authority.policy_version,
        )
    )
    if decision != "allow":
        raise PermissionError(evidence["reason"])
    args = json.loads(raw_arguments)
    receipt = await executor.send_reply(args["destination"], args["body"])
    trace.append(
        PolicyEvent(
            trace_id="TRACE_EXAMPLE_OPENAI",
            parent_span_id="SPAN_EXAMPLE_TOOL_POLICY",
            span_id="SPAN_EXAMPLE_EXECUTOR",
            event="executor_completed",
            tool_name="send_reply",
            decision="effect_recorded",
            policy_version=authority.policy_version,
        )
    )
    return receipt


async def test_host_policy() -> None:
    executor = RecordingExecutor()
    trace: list[PolicyEvent] = []
    denied = json.dumps(
        {"destination": "other@example.invalid", "body": "Status update"}
    )
    try:
        await execute_guarded_reply(denied, AUTHORITY, executor, trace)
        raise AssertionError("expected denial")
    except PermissionError:
        pass
    assert executor.calls == []
    assert trace[-1].decision == "block"

    allowed = json.dumps(
        {"destination": "customer@example.invalid", "body": "Status update"}
    )
    receipt = await execute_guarded_reply(allowed, AUTHORITY, executor, trace)
    assert receipt == "EFFECT_EXAMPLE_REPLY_1"
    assert len(executor.calls) == 1
    assert trace[-2].event == "tool_input_guardrail"
    assert trace[-1].parent_span_id == trace[-2].span_id


import asyncio

asyncio.run(test_host_policy())
```

This is the test that matters: the denied call produces no executor effect, while the allowed call has a preceding allow event and linked lineage.

## Preserve approvals as durable, versioned decisions

When a configured tool needs approval, `RunResult.interruptions` contains the pending calls. Convert the result to `RunState`, approve or reject each interruption, and resume the original top-level agent. The same outer interruption path covers tools reached after handoffs or inside nested agents.

Store the SDK version, agent and tool-definition versions, canonical arguments, policy result, approval digest, reviewer, decision time, expiration, and call ID beside serialized state. Revalidate mutable facts after the pause. Avoid putting credentials or unnecessary personal data in application context because serialized run state can include that context.

Approval support differs by path:

- Plain function tools and `Agent.as_tool()` use the run interruption flow.
- Local shell and patch tools expose approval configuration.
- Local MCP servers use their `require_approval` controls.
- Hosted MCP uses its own `tool_config` and optional approval callback.
- Hosted shell environments do not expose the same `needs_approval` path.
- The hosted multi-agent beta does not support SDK approval interruptions for its local function tools.

Never infer approval coverage from the word "tool." Check the exact class and execution path.

## Record guardrail results and custom policy spans

Agents SDK results expose separate lists for input, output, tool-input, and tool-output guardrails. Log their names, decisions, sanitized evidence, and call lineage. The tracing API also records agent, generation, function, handoff, and guardrail spans and lets you add custom spans.

```python
from agents import custom_span, trace


with trace(
    "support_reply_workflow",
    group_id="CASE_EXAMPLE_42",
    metadata={
        "tenant_class": "synthetic",
        "policy_version": AUTHORITY.policy_version,
    },
):
    with custom_span(
        "policy.send_reply",
        data={
            "tool_name": "send_reply",
            "decision": "allow",
            "policy_version": AUTHORITY.policy_version,
            "argument_digest": "DIGEST_EXAMPLE_REPLY_1",
        },
    ):
        pass
```

Do not put raw ticket bodies, credentials, or complete tool outputs into trace metadata. Store stable identifiers, digests, classifications, versions, and minimized failure evidence. The incident trace needs causal joins, not a second copy of private content.

## Wrap Codex as a constrained process

The TypeScript Codex SDK wraps the Codex CLI, starts or resumes a thread, and streams JSONL-backed events. Its current thread options include working directory, sandbox mode, approval policy, network access, web-search mode, additional directories, model, and reasoning effort.

Pin those values in trusted host code:

```typescript
import { Codex, type ThreadEvent } from "@openai/codex-sdk";

const minimizedEvents: Record<string, unknown>[] = [];

function recordMinimizedCodexEvent(event: ThreadEvent): void {
  if (
    event.type === "item.started" ||
    event.type === "item.updated" ||
    event.type === "item.completed"
  ) {
    minimizedEvents.push({
      eventType: event.type,
      itemId: event.item.id,
      itemType: event.item.type,
    });
    return;
  }
  if (event.type === "thread.started") {
    minimizedEvents.push({ eventType: event.type, threadId: event.thread_id });
    return;
  }
  minimizedEvents.push({ eventType: event.type });
}

const codex = new Codex({
  env: {
    PATH: "/usr/bin:/bin",
  },
  config: {
    history: { persistence: "none" },
  },
});

const thread = codex.startThread({
  workingDirectory: "/workspace/support-app",
  sandboxMode: "workspace-write",
  approvalPolicy: "untrusted",
  networkAccessEnabled: false,
  webSearchMode: "disabled",
  additionalDirectories: [],
});

const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 30_000);
try {
  const { events } = await thread.runStreamed(
    "Inspect the failing tests and propose a patch. Do not publish or deploy.",
    { signal: controller.signal },
  );
  for await (const event of events) {
    recordMinimizedCodexEvent(event);
  }
} finally {
  clearTimeout(timer);
}
```

The environment map is a deliberate allowlist, not `process.env`. Network and web search are off. The sandbox allows writes only in the workspace. The approval policy remains enabled. An abort signal bounds the turn, but the host should also supervise the process tree and reconcile any child processes or external effects after cancellation.

Events are evidence after the SDK observes them. A file-change event can trigger quarantine or abort, but it does not replace filesystem sandboxing that prevented the write in the first place.

## Test the Codex host boundary with fake adapters

The production adapter can construct `Codex` and call `startThread`. The policy test needs only the contract.

```typescript
import assert from "node:assert/strict";

type ThreadOptions = {
  workingDirectory: string;
  sandboxMode: "read-only" | "workspace-write" | "danger-full-access";
  approvalPolicy: "never" | "on-request" | "on-failure" | "untrusted";
  networkAccessEnabled: boolean;
  webSearchMode: "disabled" | "cached" | "live";
  additionalDirectories: readonly string[];
};

type CodexEvent =
  | { type: "thread.started"; thread_id: string }
  | {
      type: "item.completed";
      item:
        | { type: "command_execution"; command: string; status: string }
        | { type: "file_change"; changes: { path: string; kind: string }[] }
        | { type: "agent_message"; text: string };
    }
  | { type: "turn.completed"; usage: { input_tokens: number; output_tokens: number } }
  | { type: "turn.failed"; error: { message: string } };

interface ThreadAdapter {
  runStreamed(
    input: string,
    options: { signal: AbortSignal },
  ): Promise<{ events: AsyncIterable<CodexEvent> }>;
}

interface CodexProcessAdapter {
  startThread(options: ThreadOptions): ThreadAdapter;
}

interface DeadlineAdapter {
  arm(milliseconds: number, expire: () => void): () => void;
}

type CodexPolicy = {
  repository: string;
  timeoutMs: number;
  maxEvents: number;
  maxEventBytes: number;
};

function insideRepository(repository: string, path: string): boolean {
  return path === repository || path.startsWith(repository + "/");
}

async function runGuardedCodexTask(
  processAdapter: CodexProcessAdapter,
  deadline: DeadlineAdapter,
  policy: CodexPolicy,
  task: string,
): Promise<{ threadId: string; events: CodexEvent[] }> {
  if (!task.trim() || task.length > 4_000) throw new Error("INVALID_TASK");
  const options: ThreadOptions = {
    workingDirectory: policy.repository,
    sandboxMode: "workspace-write",
    approvalPolicy: "untrusted",
    networkAccessEnabled: false,
    webSearchMode: "disabled",
    additionalDirectories: [],
  };
  const thread = processAdapter.startThread(options);
  const controller = new AbortController();
  const disarm = deadline.arm(policy.timeoutMs, () => controller.abort("TIMEOUT"));
  const recorded: CodexEvent[] = [];
  let threadId = "";

  try {
    if (controller.signal.aborted) throw new Error("CODEX_TIMEOUT");
    const streamed = await thread.runStreamed(task, { signal: controller.signal });
    for await (const event of streamed.events) {
      if (controller.signal.aborted) throw new Error("CODEX_TIMEOUT");
      if (recorded.length >= policy.maxEvents) throw new Error("EVENT_LIMIT");
      if (JSON.stringify(event).length > policy.maxEventBytes) {
        throw new Error("EVENT_TOO_LARGE");
      }
      if (event.type === "thread.started") threadId = event.thread_id;
      if (event.type === "item.completed" && event.item.type === "file_change") {
        for (const change of event.item.changes) {
          if (!insideRepository(policy.repository, change.path)) {
            controller.abort("PATH_ESCAPE_OBSERVED");
            throw new Error("PATH_ESCAPE_OBSERVED");
          }
        }
      }
      recorded.push(event);
    }
  } finally {
    disarm();
  }

  if (!threadId) throw new Error("MISSING_THREAD_ID");
  return { threadId, events: recorded };
}

class FakeThread implements ThreadAdapter {
  constructor(private readonly supplied: readonly CodexEvent[]) {}

  async runStreamed(_input: string, options: { signal: AbortSignal }) {
    const supplied = this.supplied;
    async function* events(): AsyncGenerator<CodexEvent> {
      for (const event of supplied) {
        if (options.signal.aborted) throw new Error("ABORTED");
        yield event;
      }
    }
    return { events: events() };
  }
}

class FakeCodexProcess implements CodexProcessAdapter {
  starts: ThreadOptions[] = [];

  constructor(private readonly events: readonly CodexEvent[]) {}

  startThread(options: ThreadOptions): ThreadAdapter {
    this.starts.push(options);
    return new FakeThread(this.events);
  }
}

class PassiveDeadline implements DeadlineAdapter {
  arm(_milliseconds: number, _expire: () => void): () => void {
    return () => undefined;
  }
}

class ExpiredDeadline implements DeadlineAdapter {
  arm(_milliseconds: number, expire: () => void): () => void {
    expire();
    return () => undefined;
  }
}

const policy: CodexPolicy = {
  repository: "/workspace/support-app",
  timeoutMs: 30_000,
  maxEvents: 20,
  maxEventBytes: 2_000,
};

const processAdapter = new FakeCodexProcess([
  { type: "thread.started", thread_id: "THREAD_EXAMPLE_CODEX" },
  {
    type: "item.completed",
    item: {
      type: "file_change",
      changes: [{ path: "/workspace/support-app/src/app.ts", kind: "update" }],
    },
  },
  {
    type: "turn.completed",
    usage: { input_tokens: 120, output_tokens: 40 },
  },
]);
const result = await runGuardedCodexTask(
  processAdapter,
  new PassiveDeadline(),
  policy,
  "Inspect tests and propose a patch.",
);
assert.equal(result.threadId, "THREAD_EXAMPLE_CODEX");
assert.deepEqual(processAdapter.starts[0], {
  workingDirectory: "/workspace/support-app",
  sandboxMode: "workspace-write",
  approvalPolicy: "untrusted",
  networkAccessEnabled: false,
  webSearchMode: "disabled",
  additionalDirectories: [],
});

await assert.rejects(
  runGuardedCodexTask(
    new FakeCodexProcess([]),
    new ExpiredDeadline(),
    policy,
    "Inspect tests.",
  ),
  /CODEX_TIMEOUT/,
);

await assert.rejects(
  runGuardedCodexTask(
    new FakeCodexProcess([
      { type: "thread.started", thread_id: "THREAD_EXAMPLE_ESCAPE" },
      {
        type: "item.completed",
        item: {
          type: "file_change",
          changes: [{ path: "/outside/report.txt", kind: "create" }],
        },
      },
    ]),
    new PassiveDeadline(),
    policy,
    "Inspect tests.",
  ),
  /PATH_ESCAPE_OBSERVED/,
);
```

The test proves the host supplies the intended repository, sandbox, approval, network, search, and directory settings. It also proves timeout and event-policy failures stop the wrapper. It does not claim the observed path check prevented the write. The sandbox is the preventive boundary; the event check is detection and containment evidence.

## State uncovered paths explicitly

Agents SDK custom-tool guardrails do not automatically wrap:

- Handoff calls through the SDK handoff pipeline.
- Hosted web search, file search, MCP, code interpreter, or image tools.
- Built-in computer, shell, patch, and local-shell execution tools.
- Direct `Agent.as_tool()` calls through tool-guardrail options.
- The second and later agents with the first agent's input guardrail.
- Intermediate agents with the final agent's output guardrail.

Those paths have their own filters, approval controls, hooks, or host wrappers. If a path lacks an enforceable boundary for the planned effect, do not enable it.

The Codex TypeScript SDK also needs external constraints:

- Streamed command and file events are observational, not a universal pre-execution policy callback.
- The CLI process inherits the environment unless the host replaces it.
- Thread sessions persist by default unless the host changes history and storage configuration.
- Workspace write does not provide tenant or business-resource authorization.
- Network access and web search are separate settings, and external tools may have additional routes.
- Cancellation needs process-tree supervision and effect reconciliation.
- SDK thread options do not expose every interactive CLI, app-server, plugin, or MCP control path.

Treat the SDK wrapper as one adapter inside a sandboxed worker with explicit filesystem mounts, process limits, network policy, timeouts, event bounds, and post-run workspace review.

## Tradeoffs and residual risk

Blocking input guardrails increase latency but provide a stronger start guarantee. Per-tool checks and approval pauses add code and reviewer work. Rich tracing improves diagnosis but creates a sensitive data store. Codex process isolation costs startup time and infrastructure. Disabling network can prevent legitimate package or documentation access.

Residual risk includes provider and SDK defects, guardrail logic mistakes, unguarded hosted paths, stale approval state, deceptive but valid arguments, inherited local configuration, unsafe tools inside the allowed sandbox, subprocesses that outlive cancellation, and external effects that cannot be rolled back. Measure these risks with deterministic contracts and live-model evals rather than assuming SDK configuration is sufficient.

## Common failure modes

- **Parallel tripwire assumption**: Expecting a default input guardrail to finish before any tool starts.
- **Endpoint recursion**: Assuming initial and final checks protect every handoff and nested agent.
- **Tool-family confusion**: Attaching function-tool guardrails and assuming hosted or built-in tools use them.
- **Approval equals authorization**: Showing a reviewer model-authored prose without canonical facts and an action digest.
- **Trace as policy**: Recording an unsafe effect without placing an enforcing check before it.
- **Event as sandbox**: Treating a Codex file-change event as the control that prevented the change.
- **Ambient environment**: Passing the parent process environment and unexpected credentials into Codex.
- **Cancellation optimism**: Assuming an aborted turn terminated descendants and reversed remote effects.

## Series navigation

- Previous: [Part 9: Claude API and Agent SDK Guardrails](../2026-09-01-claude-api-agent-sdk-guardrails/)
- Next: [Part 11: Deterministic Guardrail Testing](../2026-09-01-deterministic-guardrail-testing/)
- Series index: [Engineering Guardrails for AI Systems](../series/engineering-ai-guardrails/)

## References

- [Guardrails and workflow boundaries, OpenAI Agents SDK](https://openai.github.io/openai-agents-python/guardrails/)
- [Human-in-the-loop approvals, OpenAI Agents SDK](https://openai.github.io/openai-agents-python/human_in_the_loop/)
- [Agents SDK result and guardrail evidence](https://openai.github.io/openai-agents-python/results/)
- [Create traces and custom spans, OpenAI Agents SDK](https://openai.github.io/openai-agents-python/ref/tracing/create/)
- [OpenAI Agents SDK 0.22.0 on PyPI](https://pypi.org/project/openai-agents/0.22.0/)
- [Codex TypeScript SDK README](https://github.com/openai/codex/blob/main/sdk/typescript/README.md)
- [Codex SDK thread options](https://github.com/openai/codex/blob/main/sdk/typescript/src/threadOptions.ts)
- [Codex SDK streaming implementation](https://github.com/openai/codex/blob/main/sdk/typescript/src/thread.ts)

## Related topics

- [Tool calls, approvals, and least privilege](../2026-09-01-ai-tool-calls-approvals-least-privilege/)
- [Agents, delegation, and guardrail propagation](../2026-09-01-agent-delegation-guardrail-propagation/)
- [Claude API and Agent SDK guardrails](../2026-09-01-claude-api-agent-sdk-guardrails/)
- [Context engineering](../../topics/ai/harness-development/context-engineering/)
