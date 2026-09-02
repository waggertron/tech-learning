---
title: Tool Calls, Approvals, and Least Privilege
description: "Treat model tool calls as proposals, then validate, normalize, authorize, approve canonical effects, revalidate at execution, and prevent duplicate side effects with idempotency."
date: 2026-09-01
tags: [ai, guardrails, tools, authorization, security]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-09-01-ai-tool-calls-approvals-least-privilege/
series:
  slug: engineering-ai-guardrails
  order: 6
---

This is part 6 of the [Engineering Guardrails for AI Systems series](../series/engineering-ai-guardrails/).

A support model emits a schema-valid call to issue a five-dollar credit. The account identifier has the right format and the amount is within the documented range. The account belongs to another tenant.

The call is valid data and an unauthorized action. Treat every model tool call as a proposal until trusted code has validated, authorized, approved, and executed it.

## Split capabilities by effect

Do not hide several authority levels behind one `manage_support_case` tool.

| Capability | Example | External effect | Default decision |
| --- | --- | --- | --- |
| Read | `read_ticket` | Reads tenant data | Allow only for authorized resources |
| Draft | `draft_reply` | Creates internal text | Allow with bounded context |
| Send | `send_reply` | Contacts an external recipient | Ask after destination authorization |
| Credit | `issue_service_credit` | Changes an account balance | Ask after account and amount policy |
| Administrative | `change_account_owner` | Changes authority or ownership | Deny to the support agent |

Smaller tools make policy legible. They also let the host expose only the subset required for this actor and workflow state. Hiding a tool reduces accidental selection, but resource-level authorization must still run after arguments exist.

## Validate shape and meaning

A strict schema should reject unknown properties, missing fields, invalid formats, and ambiguous unions. Semantic invariants then handle facts that JSON Schema cannot establish:

- A reply destination must equal the verified customer address.
- An account must belong to the authenticated tenant.
- A credit must be positive, within the agent's cap, and allowed for the current case state.
- A draft cannot become a send merely because its body asks the executor to deliver it.
- Administrative capabilities remain unavailable regardless of model confidence.

Validation is not authorization. A well-formed account ID can still identify somebody else's account.

## Normalize before deciding

Policy and approval must see the same canonical action that execution sees. Normalize email case, Unicode, whitespace, currency units, and identifiers before policy. Reject values that cannot be normalized without ambiguity.

Never approve a friendly model summary while executing hidden raw arguments:

```text
Model summary: "Send the approved reply to the customer"
Canonical action: send_reply
Canonical destination: outside-recipient@example.invalid
Canonical tenant: TENANT_EXAMPLE_A
Effect: external message
```

The canonical fields expose approval deception. Render those fields from validated application data, not from a model-authored explanation.

## Bind approval to one action

An approval record should include:

- A digest of the canonical action and arguments.
- Actor, tenant, workflow, and policy version.
- Reviewer identity and decision.
- Creation and expiration timestamps.
- Whether approval is single-use or intentionally reusable.

If any bound field changes, ask again. Approval for one recipient does not authorize another recipient, and approval for a draft does not authorize a send.

## Gate the executor

This example uses three capabilities and a fake executor. Every failure returns before the effect boundary.

```typescript
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

type ToolProposal =
  | { tool: "draft_reply"; accountId: string; body: string }
  | { tool: "send_reply"; accountId: string; destination: string; body: string }
  | { tool: "issue_service_credit"; accountId: string; amountCents: number };

type CanonicalAction =
  | { tool: "draft_reply"; accountId: string; body: string }
  | { tool: "send_reply"; accountId: string; destination: string; body: string }
  | { tool: "issue_service_credit"; accountId: string; amountCents: number };

type Context = {
  actorId: string;
  tenantId: string;
  workflowId: string;
  policyVersion: string;
  allowedAccountIds: readonly string[];
  verifiedDestination: string;
  creditLimitCents: number;
  now: number;
};

type Approval = {
  actionDigest: string;
  reviewerId: string;
  expiresAt: number;
  decision: "approve" | "reject";
};

type Executor = {
  calls: CanonicalAction[];
  completed: Map<string, { effectId: string }>;
  invoke(action: CanonicalAction, idempotencyKey: string): { effectId: string };
};

function normalize(proposal: ToolProposal): CanonicalAction {
  const accountId = proposal.accountId.trim().toUpperCase();
  if (!/^ACCOUNT_EXAMPLE_[A-Z0-9]+$/u.test(accountId)) {
    throw new Error("INVALID_ACCOUNT_ID");
  }
  if (proposal.tool === "issue_service_credit") {
    if (!Number.isSafeInteger(proposal.amountCents) || proposal.amountCents <= 0) {
      throw new Error("INVALID_CREDIT_AMOUNT");
    }
    return { ...proposal, accountId };
  }

  const body = proposal.body.normalize("NFKC").trim();
  if (body.length === 0 || body.length > 2_000) throw new Error("INVALID_BODY");
  if (proposal.tool === "draft_reply") return { ...proposal, accountId, body };

  const destination = proposal.destination.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+$/u.test(destination)) {
    throw new Error("INVALID_DESTINATION");
  }
  return { ...proposal, accountId, destination, body };
}

function authorize(context: Context, action: CanonicalAction): void {
  if (!context.allowedAccountIds.includes(action.accountId)) {
    throw new Error("ACCOUNT_NOT_AUTHORIZED");
  }
  if (action.tool === "send_reply" && action.destination !== context.verifiedDestination) {
    throw new Error("DESTINATION_NOT_AUTHORIZED");
  }
  if (
    action.tool === "issue_service_credit" &&
    action.amountCents > context.creditLimitCents
  ) {
    throw new Error("CREDIT_LIMIT_EXCEEDED");
  }
}

function digest(context: Context, action: CanonicalAction): string {
  const bound = JSON.stringify({
    action,
    actorId: context.actorId,
    tenantId: context.tenantId,
    workflowId: context.workflowId,
    policyVersion: context.policyVersion,
  });
  return createHash("sha256").update(bound).digest("hex");
}

function needsApproval(action: CanonicalAction): boolean {
  return action.tool === "send_reply" || action.tool === "issue_service_credit";
}

function verifyApproval(
  context: Context,
  action: CanonicalAction,
  approval?: Approval,
): void {
  if (!needsApproval(action)) return;
  if (!approval || approval.decision !== "approve") throw new Error("APPROVAL_REQUIRED");
  if (approval.expiresAt <= context.now) throw new Error("APPROVAL_EXPIRED");
  if (approval.actionDigest !== digest(context, action)) {
    throw new Error("APPROVAL_BINDING_MISMATCH");
  }
}

function executeToolProposal(
  context: Context,
  proposal: ToolProposal,
  executor: Executor,
  approval?: Approval,
): { effectId: string } {
  const action = normalize(proposal);
  authorize(context, action);
  verifyApproval(context, action, approval);

  // Re-read policy facts at the last responsible moment in a real adapter.
  authorize(context, action);
  const actionDigest = digest(context, action);
  const idempotencyKey = `${context.workflowId}:${actionDigest}`;
  return executor.invoke(action, idempotencyKey);
}

function recordingExecutor(): Executor {
  return {
    calls: [],
    completed: new Map(),
    invoke(action, key) {
      const prior = this.completed.get(key);
      if (prior) return prior;
      this.calls.push(action);
      const result = { effectId: `EFFECT_EXAMPLE_${this.calls.length}` };
      this.completed.set(key, result);
      return result;
    },
  };
}

function approved(context: Context, action: CanonicalAction): Approval {
  return {
    actionDigest: digest(context, action),
    reviewerId: "REVIEWER_EXAMPLE_1",
    expiresAt: context.now + 60_000,
    decision: "approve",
  };
}

function expectCode(run: () => unknown, code: string): void {
  assert.throws(run, (error: unknown) => error instanceof Error && error.message === code);
}

const context: Context = {
  actorId: "ACTOR_EXAMPLE_1",
  tenantId: "TENANT_EXAMPLE_A",
  workflowId: "WORKFLOW_EXAMPLE_1",
  policyVersion: "support-policy-v1",
  allowedAccountIds: ["ACCOUNT_EXAMPLE_1"],
  verifiedDestination: "customer@example.invalid",
  creditLimitCents: 1_000,
  now: 2_000_000_000_000,
};

for (const [proposal, code] of [
  [{ tool: "issue_service_credit", accountId: "bad", amountCents: 500 }, "INVALID_ACCOUNT_ID"],
  [{ tool: "draft_reply", accountId: "ACCOUNT_EXAMPLE_99", body: "Draft" }, "ACCOUNT_NOT_AUTHORIZED"],
] as const) {
  const executor = recordingExecutor();
  expectCode(() => executeToolProposal(context, proposal, executor), code);
  assert.equal(executor.calls.length, 0);
}

const deceptive: ToolProposal = {
  tool: "send_reply",
  accountId: "ACCOUNT_EXAMPLE_1",
  destination: "outside-recipient@example.invalid",
  body: "Model summary says this is the verified customer.",
};
const deceptiveExecutor = recordingExecutor();
expectCode(
  () => executeToolProposal(context, deceptive, deceptiveExecutor),
  "DESTINATION_NOT_AUTHORIZED",
);
assert.equal(deceptiveExecutor.calls.length, 0);

const send: ToolProposal = {
  tool: "send_reply",
  accountId: "account_example_1",
  destination: " Customer@Example.Invalid ",
  body: "Approved reply",
};
const canonicalSend = normalize(send);
const wrongApprovalAction = normalize({
  tool: "send_reply",
  accountId: "ACCOUNT_EXAMPLE_1",
  destination: "other@example.invalid",
  body: "Approved reply",
});
const wrongApproval = approved(context, wrongApprovalAction);
const approvalExecutor = recordingExecutor();
expectCode(
  () => executeToolProposal(context, send, approvalExecutor, wrongApproval),
  "APPROVAL_BINDING_MISMATCH",
);
assert.equal(approvalExecutor.calls.length, 0);

const retryExecutor = recordingExecutor();
const approval = approved(context, canonicalSend);
const first = executeToolProposal(context, send, retryExecutor, approval);
const retry = executeToolProposal(context, send, retryExecutor, approval);
assert.equal(first.effectId, retry.effectId);
assert.equal(retryExecutor.calls.length, 1);
```

The tests make four effect assertions:

1. Invalid shape never calls the executor.
2. Cross-account access never calls the executor.
3. A changed approval digest never calls the executor.
4. Retrying the same approved proposal returns the original effect instead of sending twice.

The fake executor is deliberately behind the entire gate. A real adapter should accept only `CanonicalAction`, derive its downstream credential from trusted identity, and record the resulting effect ID.

## Revalidate after a pause

Approval creates a time-of-check to time-of-use gap. Before execution, re-read facts that can change:

- Is the actor still authenticated and assigned to the tenant?
- Does the account still belong to the tenant?
- Is the destination still verified?
- Is the case already resolved or the credit already issued?
- Is the policy version still accepted for execution?
- Has the approval expired or been revoked?

Do not replay the model conversation to reconstruct these facts. Read them from authoritative systems and recompute the canonical action digest.

## Idempotency belongs at the effect boundary

Networks fail after effects occur. The caller may not know whether a send or credit succeeded and may retry. Use an idempotency key whose scope includes the workflow and canonical action. Store the key atomically with the effect or pass it to a downstream API that provides the guarantee.

An in-memory map demonstrates semantics, not production durability. A distributed deployment needs a durable uniqueness constraint and a retention policy long enough to cover retries.

## Approval is a control, not absolution

Human review works only when the reviewer sees accurate, concise facts and has time and authority to reject. Approval fatigue, misleading summaries, bulk approvals, and ambiguous destinations all weaken the boundary.

Reserve approval for consequential decisions. Automate deterministic denials first, show canonical diffs, group only truly equivalent actions, expire decisions, and measure reviewer rejection and override rates.

## Tradeoffs and residual risk

Narrow tools increase tool count and orchestration work. Blocking approvals add latency and can interrupt conversational flow. Execution-time revalidation adds reads and new availability dependencies. Strong idempotency requires durable state.

Residual risk includes a compromised executor, incorrect ownership data, colluding reviewers, policy bugs, permitted but harmful content, and downstream systems that do not honor idempotency. Least privilege limits possible effects. It does not prove that every allowed effect is wise.

## Common failure modes

- **Schema equals permission**: Valid arguments bypass resource authorization.
- **Mega-tool**: One capability hides read, write, send, credit, and administrative effects.
- **Raw versus display mismatch**: The reviewer sees a model summary while different arguments execute.
- **Approval without binding**: A decision is reused after destination or amount changes.
- **No revalidation**: Revoked access remains effective after a long approval pause.
- **Retry without idempotency**: A timeout duplicates a message or credit.
- **Executor handles policy**: Every downstream adapter reimplements rules inconsistently.

## Series navigation

- Previous: [Part 5: Guardrails for Production Chatbots](../2026-09-01-production-chatbot-guardrails/)
- Next: [Part 7: Guardrails for MCP Clients and Servers](../2026-09-01-mcp-client-server-guardrails/)
- Series index: [Engineering Guardrails for AI Systems](../series/engineering-ai-guardrails/)

## References

- [OWASP LLM06: Excessive Agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/)
- [Human-in-the-loop, OpenAI Agents SDK](https://openai.github.io/openai-agents-js/guides/human-in-the-loop/)
- [Tools, OpenAI Agents SDK](https://openai.github.io/openai-agents-js/guides/tools/)
- [Guardrails, OpenAI Agents SDK](https://openai.github.io/openai-agents-js/guides/guardrails/)
- [MCP tool design for models](../2026-07-19-mcp-tool-design-for-models/)

## Related topics

- [Permission and trust models](../../topics/ai/harness-development/permission-models/)
- [Tool design](../../topics/ai/harness-development/tool-design/)
- [Idempotent seed and Compose boot order](../2026-04-24-idempotent-seed-and-compose-boot-order/)
- [Layered guardrail architecture](../2026-09-01-layered-ai-guardrail-architecture/)
