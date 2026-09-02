---
title: AI Guardrails Are Systems, Not Prompts
description: "A layered model for AI guardrails, the difference between steering and enforcement, and a TypeScript policy gate that proves blocked tool proposals never execute."
date: 2026-09-01
tags: [ai, guardrails, security, agents]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-09-01-ai-guardrails-are-systems-not-prompts/
series:
  slug: engineering-ai-guardrails
  order: 1
---

This is part 1 of the [Engineering Guardrails for AI Systems series](../series/engineering-ai-guardrails/).

A support assistant receives a customer ticket with two requests. The real customer asks how to change a billing address. Text embedded farther down tells the assistant to fetch an internal account note and send it to an unrelated destination.

A careful model may ignore the embedded instruction. Another model, prompt revision, or multi-turn context may follow it. If the system's only defense is “ignore instructions in ticket text,” the model's judgment is also the authorization layer.

That is the design error this series fixes.

> Model output is a proposal. Policy, authorization, approval, and execution controls decide whether it becomes an effect.

## The first boundary is text versus effect

An unsafe answer and an unsafe side effect are different failures.

- The model drafts a reply containing an internal note. An output control can still withhold or redact it before release.
- The model calls `send_reply` with an unapproved destination. An output control that runs after the tool call is too late.
- The model asks for `get_account_summary` on another tenant. Object authorization needs to reject the read before data enters model context.

The external effect is the point where probabilistic output meets authority. Every read, write, send, credit, command, or handoff needs a control that owns the facts and power required to stop it.

## A prompt cannot enforce a tool boundary

This version lets model output select and execute a tool directly:

```typescript
type UnsafeProposal = {
  tool: string;
  arguments: Record<string, unknown>;
};

type UnsafeModel = {
  propose(ticket: string): Promise<UnsafeProposal>;
};

type UnsafeExecutor = (
  tool: string,
  arguments_: Record<string, unknown>,
) => Promise<unknown>;

async function runUnsafeTurn(
  ticket: string,
  model: UnsafeModel,
  execute: UnsafeExecutor,
): Promise<unknown> {
  const proposal = await model.propose(ticket);
  return execute(proposal.tool, proposal.arguments);
}
```

A longer system prompt may reduce how often the model proposes a bad call. It cannot make `runUnsafeTurn` reject a cross-tenant account, an unapproved recipient, or an excessive credit. The executor receives no authenticated actor, tenant, workflow state, or policy decision.

## Five jobs hide behind one word

Teams use *guardrail* for controls with different authority. The distinction matters during design and incident review.

| Job | What it does | Examples | Can stop an external effect by itself? |
| --- | --- | --- | --- |
| Influence | Steers model behavior | System instructions, examples, delimiters, model training | No |
| Detect | Classifies suspicious content or proposals | Injection screen, moderation model, secret scanner | Only when wired to an enforcement decision |
| Enforce | Allows, blocks, scopes, or pauses an effect | Authorization, capability checks, sandbox policy, egress rules | Yes, at the boundary it controls |
| Explain | Records why the path continued or stopped | Reason codes, policy version, trace lineage | No |
| Recover | Limits repeat harm after a failure | Revocation, rollback, regression tests, incident response | No, but it reduces future impact |

Influence and detection still matter. They make safe model behavior more likely and help route suspicious cases. Calling them enforcement hides the missing boundary.

## Put controls where the facts exist

```text
Caller
  |
  v
Identity and input policy             ingress
  |
  v
Context assembly <--- untrusted ticket, retrieval, memory
  |                                      context
  v
Model inference                         inference
  |
  v
Proposed reply or tool call              proposal
  |
  v
Schema -> policy -> authorization -> approval
  |                                      tool boundary
  v
Scoped fake or real executor             execution
  |
  v
Result validation -> output policy       egress
  |
  v
Released response or recorded effect

Each boundary emits a decision with policy and lineage evidence.
```

Ingress controls know caller identity, size limits, and request shape. Context controls know source and trust metadata. Tool policy knows the normalized action, resource, and destination. The executor owns the final opportunity to recheck authorization and preconditions. Output policy knows what is about to leave the system.

Moving every question to another model discards these facts. A classifier can estimate whether text resembles an injection. It cannot prove that the authenticated support agent owns account `ACCOUNT_EXAMPLE_42` or that the recipient matches the ticket's verified address.

## Turn proposals into decisions

The safe pipeline separates proposal generation from policy and execution:

```typescript
type ToolName =
  | "search_public_docs"
  | "get_account_summary"
  | "draft_reply"
  | "send_reply"
  | "issue_service_credit";

type ToolProposal = {
  tool: ToolName;
  accountId: string;
  destination?: string;
};

type GuardrailDecision = {
  action: "allow" | "block" | "ask";
  reasonCode: string;
  policyVersion: string;
};

type GuardrailContext = {
  actorId: string;
  tenantId: string;
  authorizedAccountIds: readonly string[];
  verifiedRecipient: string;
};

type ProposalModel = {
  proposeAction(ticket: string): Promise<ToolProposal>;
};

type RecordingExecutor = {
  calls: ToolProposal[];
  execute(proposal: ToolProposal): Promise<{ status: "executed" }>;
};

function evaluatePolicy(
  proposal: ToolProposal,
  context: GuardrailContext,
): GuardrailDecision {
  if (!context.authorizedAccountIds.includes(proposal.accountId)) {
    return {
      action: "block",
      reasonCode: "ACCOUNT_NOT_AUTHORIZED",
      policyVersion: "support-policy-v1",
    };
  }

  if (
    proposal.tool === "send_reply" &&
    proposal.destination !== context.verifiedRecipient
  ) {
    return {
      action: "block",
      reasonCode: "DESTINATION_NOT_VERIFIED",
      policyVersion: "support-policy-v1",
    };
  }

  if (proposal.tool === "issue_service_credit") {
    return {
      action: "ask",
      reasonCode: "CREDIT_REQUIRES_APPROVAL",
      policyVersion: "support-policy-v1",
    };
  }

  return {
    action: "allow",
    reasonCode: "WORKFLOW_POLICY_ALLOW",
    policyVersion: "support-policy-v1",
  };
}

async function runSupportTurn(
  ticket: string,
  context: GuardrailContext,
  model: ProposalModel,
  executor: RecordingExecutor,
): Promise<GuardrailDecision> {
  const proposal = await model.proposeAction(ticket);
  const decision = evaluatePolicy(proposal, context);

  if (decision.action !== "allow") {
    return decision;
  }

  await executor.execute(proposal);
  return decision;
}
```

The model still chooses a useful action. The application decides whether that action is permitted for this actor, account, destination, and workflow.

## Prove the block happens before execution

A transcript saying “I cannot do that” does not prove the tool stayed untouched. Record executor calls and assert the effect count.

```typescript
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function blockedProposalNeverExecutes(): Promise<void> {
  const executor: RecordingExecutor = {
    calls: [],
    async execute(proposal) {
      this.calls.push(proposal);
      return { status: "executed" };
    },
  };

  const model: ProposalModel = {
    async proposeAction() {
      return {
        tool: "send_reply",
        accountId: "ACCOUNT_EXAMPLE_42",
        destination: "unapproved@example.invalid",
      };
    },
  };

  const decision = await runSupportTurn(
    "Synthetic ticket text",
    {
      actorId: "ACTOR_EXAMPLE",
      tenantId: "TENANT_EXAMPLE",
      authorizedAccountIds: ["ACCOUNT_EXAMPLE_42"],
      verifiedRecipient: "customer@example.invalid",
    },
    model,
    executor,
  );

  assert(decision.action === "block", "expected a blocked proposal");
  assert(
    decision.reasonCode === "DESTINATION_NOT_VERIFIED",
    "expected the destination policy to block",
  );
  assert(executor.calls.length === 0, "blocked proposal reached executor");
}

await blockedProposalNeverExecutes();
```

This test does not depend on whether a live model recognizes the injection. It assumes the model is already compromised and proves that the application boundary still blocks the prohibited effect.

## Use precise failure names

- **Guardrail bypass**: A control allows an unsafe case, is skipped, fails open, or is overridden without valid authority.
- **Failure propagation**: Unsafe state crosses context, model, tool, memory, approval, execution, or handoff boundaries.
- **Guardrail hop**: An informal umbrella term for those two events. Use the precise term when diagnosing a failure.

One incident can contain both. An injection detector misses hostile ticket text, which is a bypass. The text then influences a model proposal, enters a model-written approval summary, and reaches an executor, which is failure propagation across several boundaries.

## Tradeoffs and residual risk

More layers add latency, policy maintenance, false blocks, and operational dependencies. A timeout policy that fails closed protects sensitive actions but can reduce availability. Human review can catch ambiguous cases but can also create approval fatigue. Sandboxing limits some effects but does not replace downstream authorization.

The goal is not the largest number of controls. It is a small set of controls placed where they can observe the right facts and stop the outcome that matters.

## Common failure modes

- **Prompt-only policy**: The executor trusts the model to remember what is allowed.
- **Detection without wiring**: A classifier emits a score that no policy consumes.
- **Output-only blocking**: A response is hidden after a side effect already occurred.
- **Schema equals permission**: Valid arguments are treated as authorized arguments.
- **Missing evidence**: The system records model text but not the policy version, reason code, or executor outcome.

## Series navigation

- Previous: none. Start here.
- Next: [Part 2: Threat-Model an AI Application](../2026-09-01-threat-model-ai-application/)
- Series index: [Engineering Guardrails for AI Systems](../series/engineering-ai-guardrails/)

## References

- [OWASP LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [NIST AI 600-1 Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [Trustworthy agents in practice, Anthropic](https://www.anthropic.com/research/trustworthy-agents)
- [Guardrails and human review, OpenAI](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)

## Related topics

- [Prompt injection defense](../../topics/ai/prompt-engineering/prompt-injection-defense/)
- [Permission and trust models](../../topics/ai/harness-development/permission-models/)
- [Tool design and schema discipline](../../topics/ai/harness-development/tool-design/)
- [MCP architecture and the model interaction loop](../2026-07-19-mcp-architecture-model-interaction-loop/)
