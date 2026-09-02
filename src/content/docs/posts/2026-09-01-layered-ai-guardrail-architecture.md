---
title: Design a Layered AI Guardrail Architecture
description: "Identity, input, context, tool, authorization, execution, and output controls, with composable TypeScript guardrails and tests for allow, block, ask, quarantine, timeout, and unknown policy behavior."
date: 2026-09-01
tags: [ai, guardrails, security, architecture]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-09-01-layered-ai-guardrail-architecture/
series:
  slug: engineering-ai-guardrails
  order: 3
---

This is part 3 of the [Engineering Guardrails for AI Systems series](../series/engineering-ai-guardrails/).

The support assistant proposes a service credit with a valid amount and account-shaped identifier. The JSON Schema accepts it. The account belongs to another tenant.

Schema validation did its job. Authorization still needs to block the action.

A layered architecture gives each control the facts and authority needed for its own decision. It also defines what happens when that control is unavailable.

## One pipeline, several enforcement points

```text
authenticated caller
        |
        v
identity and abuse limits
        |
        v
deterministic input validation
        |
        v
context assembly with provenance
        |
        v
model proposes response or action
        |
        v
schema and semantic validation
        |
        v
policy -> authorization -> approval
        |
        v
scoped execution with revalidation
        |
        v
result validation and output policy
        |
        v
release, effect record, and audit event
```

The sequence is not a claim that every check must run serially. Independent low-risk checks can run in parallel. A check that must stop work before it starts needs blocking semantics.

## Match each layer to its facts

| Layer | Facts available | Decisions | Failure behavior | Evidence |
| --- | --- | --- | --- | --- |
| Identity | Actor, tenant, role, session | Allow caller, reject, throttle | Fail closed for protected workflows | Subject and authentication method |
| Input | Size, encoding, schema, file type | Accept, reject, quarantine | Reject malformed input | Validator version and reason code |
| Context | Source, trust, sensitivity, relevance | Include, label, redact, quarantine | Omit unsafe optional context | Source IDs and data classes |
| Model | Instructions and selected context | Draft response or propose action | Return no proposal or safe fallback | Model and prompt versions |
| Tool validation | Tool name, normalized arguments, invariants | Accept shape, reject | Reject invalid or unknown fields | Normalization and schema version |
| Policy | Original task, source trust, data flow, workflow state | Allow, block, ask, redact, quarantine | Fail closed or enter named degraded mode | Policy version and reason code |
| Authorization | Verified subject, tenant, resource, destination | Permit or deny | Fail closed | Resource and authorization decision |
| Approval | Canonical action, effect, reviewer, expiration | Approve, reject, modify | Do not execute | Action digest and reviewer record |
| Execution | Current resource state, idempotency, sandbox | Execute or stop | Abort when required isolation is unavailable | Executor result and effect ID |
| Output | Data classes, destination, release format | Release, redact, withhold | Withhold or safe fallback | Release decision and redaction record |

No layer owns every fact. Input validation cannot know whether an account belongs to a tenant. Authorization does not decide whether generated prose violates a content policy. Output screening cannot undo a sent message.

## Define failure behavior before production

Four modes recur across guardrail systems:

- **Fail closed**: Stop when the control cannot produce a valid decision. Use this for authorization, required isolation, restricted data movement, and irreversible effects.
- **Fail open**: Continue without the control. Reserve this for advisory checks where availability matters more than the check and another control still contains the impact.
- **Quarantine**: Preserve suspicious input outside the normal model path for later review.
- **Degraded mode**: Continue with reduced capabilities, such as public-document search and draft generation without account reads or external sends.

“Log the error and continue” is an accidental fail-open policy. Name the behavior, test it, and attach it to a risk decision.

## Separate validation, policy, and authorization

Consider this proposal:

```json
{
  "tool": "issue_service_credit",
  "accountId": "ACCOUNT_EXAMPLE_99",
  "amountCents": 500
}
```

Three questions follow:

1. **Syntactic validation**: Are the fields present and well typed? Is the amount within the schema's numeric bounds?
2. **Semantic policy**: Does this workflow permit a credit? Does the amount require approval? Did the request originate in untrusted content?
3. **Authorization**: Can this authenticated actor issue a credit on this exact tenant and account?

Passing the first question says nothing about the next two.

## Use a small decision contract

```typescript
type GuardrailDecision = {
  action: "allow" | "block" | "ask" | "redact" | "quarantine";
  reasonCode: string;
  policyVersion: string;
  explanation?: string;
};

type GuardrailAuditEvent = {
  traceId: string;
  guardrailId: string;
  layer: "input" | "context" | "tool" | "execution" | "output";
  decision: GuardrailDecision["action"];
  reasonCode: string;
  policyVersion: string;
  outcome: "stopped" | "continued" | "executed" | "released";
};
```

The reason code is stable enough for tests, metrics, and incident queries. The explanation is optional reader-facing detail. Free-form model reasoning does not replace either field.

## Compose guardrails around normalized facts

The policy gate receives authenticated identity and a normalized proposal. It does not parse identity claims from ticket text.

```typescript
type Proposal = {
  tool: "draft_reply" | "send_reply" | "issue_service_credit";
  tenantId: string;
  accountId: string;
  destination?: string;
  amountCents?: number;
};

type GuardrailContext = {
  traceId: string;
  actorId: string;
  tenantId: string;
  authorizedAccountIds: readonly string[];
  verifiedRecipient: string;
  sourceTrust: "trusted" | "mixed" | "untrusted";
  dataClasses: readonly string[];
  policyVersion: string;
  proposal: Proposal;
};

type Guardrail = {
  id: string;
  layer: GuardrailAuditEvent["layer"];
  evaluate(context: GuardrailContext): Promise<GuardrailDecision>;
};

type Evaluation = {
  decision: GuardrailDecision;
  events: readonly GuardrailAuditEvent[];
};

const KNOWN_POLICIES = new Set(["support-policy-v1"]);

const policyVersionGuardrail: Guardrail = {
  id: "known-policy-version",
  layer: "tool",
  async evaluate(context) {
    if (!KNOWN_POLICIES.has(context.policyVersion)) {
      return {
        action: "block",
        reasonCode: "UNKNOWN_POLICY_VERSION",
        policyVersion: context.policyVersion,
      };
    }
    return {
      action: "allow",
      reasonCode: "KNOWN_POLICY_VERSION",
      policyVersion: context.policyVersion,
    };
  },
};

const provenanceGuardrail: Guardrail = {
  id: "restricted-untrusted-context",
  layer: "context",
  async evaluate(context) {
    if (
      context.sourceTrust === "untrusted" &&
      context.dataClasses.includes("restricted")
    ) {
      return {
        action: "quarantine",
        reasonCode: "RESTRICTED_DATA_FROM_UNTRUSTED_SOURCE",
        policyVersion: context.policyVersion,
      };
    }
    return {
      action: "allow",
      reasonCode: "CONTEXT_ACCEPTED",
      policyVersion: context.policyVersion,
    };
  },
};

const authorizationGuardrail: Guardrail = {
  id: "support-action-authorization",
  layer: "tool",
  async evaluate(context) {
    const { proposal } = context;
    if (
      proposal.tenantId !== context.tenantId ||
      !context.authorizedAccountIds.includes(proposal.accountId)
    ) {
      return {
        action: "block",
        reasonCode: "RESOURCE_NOT_AUTHORIZED",
        policyVersion: context.policyVersion,
      };
    }
    if (
      proposal.tool === "send_reply" &&
      proposal.destination !== context.verifiedRecipient
    ) {
      return {
        action: "block",
        reasonCode: "DESTINATION_NOT_VERIFIED",
        policyVersion: context.policyVersion,
      };
    }
    if (proposal.tool === "issue_service_credit") {
      return {
        action: "ask",
        reasonCode: "CREDIT_REQUIRES_APPROVAL",
        policyVersion: context.policyVersion,
      };
    }
    return {
      action: "allow",
      reasonCode: "ACTION_AUTHORIZED",
      policyVersion: context.policyVersion,
    };
  },
};

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("GUARDRAIL_TIMEOUT")),
      timeoutMs,
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function evaluateGuardrails(
  context: GuardrailContext,
  guardrails: readonly Guardrail[],
  timeoutMs: number,
): Promise<Evaluation> {
  const events: GuardrailAuditEvent[] = [];

  for (const guardrail of guardrails) {
    let decision: GuardrailDecision;
    try {
      decision = await withTimeout(guardrail.evaluate(context), timeoutMs);
    } catch {
      decision = {
        action: "block",
        reasonCode: "GUARDRAIL_TIMEOUT_FAIL_CLOSED",
        policyVersion: context.policyVersion,
      };
    }

    events.push({
      traceId: context.traceId,
      guardrailId: guardrail.id,
      layer: guardrail.layer,
      decision: decision.action,
      reasonCode: decision.reasonCode,
      policyVersion: decision.policyVersion,
      outcome: decision.action === "allow" ? "continued" : "stopped",
    });

    if (decision.action !== "allow") {
      return { decision, events };
    }
  }

  return {
    decision: {
      action: "allow",
      reasonCode: "ALL_GUARDRAILS_ALLOWED",
      policyVersion: context.policyVersion,
    },
    events,
  };
}
```

The evaluator stops at the first non-allow decision. Another application may aggregate redaction decisions or run independent detectors in parallel. The important contract is explicit precedence and failure behavior.

## Test every decision path

```typescript
function assertEqual<T>(actual: T, expected: T, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, received ${actual}`);
  }
}

function contextFor(overrides: Partial<GuardrailContext> = {}): GuardrailContext {
  return {
    traceId: "TRACE_EXAMPLE",
    actorId: "ACTOR_EXAMPLE",
    tenantId: "TENANT_EXAMPLE",
    authorizedAccountIds: ["ACCOUNT_EXAMPLE_42"],
    verifiedRecipient: "customer@example.invalid",
    sourceTrust: "mixed",
    dataClasses: ["customer"],
    policyVersion: "support-policy-v1",
    proposal: {
      tool: "draft_reply",
      tenantId: "TENANT_EXAMPLE",
      accountId: "ACCOUNT_EXAMPLE_42",
    },
    ...overrides,
  };
}

async function guardrailDecisionTests(): Promise<void> {
  const stack = [
    policyVersionGuardrail,
    provenanceGuardrail,
    authorizationGuardrail,
  ];

  const allowed = await evaluateGuardrails(contextFor(), stack, 50);
  assertEqual(allowed.decision.action, "allow", "allowed draft");

  const blocked = await evaluateGuardrails(
    contextFor({
      proposal: {
        tool: "draft_reply",
        tenantId: "OTHER_TENANT",
        accountId: "ACCOUNT_EXAMPLE_42",
      },
    }),
    stack,
    50,
  );
  assertEqual(blocked.decision.action, "block", "cross-tenant draft");
  const executed: Proposal[] = [];
  if (blocked.decision.action === "allow") {
    executed.push(contextFor().proposal);
  }
  assertEqual(executed.length, 0, "blocked proposal execution count");

  const asks = await evaluateGuardrails(
    contextFor({
      proposal: {
        tool: "issue_service_credit",
        tenantId: "TENANT_EXAMPLE",
        accountId: "ACCOUNT_EXAMPLE_42",
        amountCents: 500,
      },
    }),
    stack,
    50,
  );
  assertEqual(asks.decision.action, "ask", "credit approval");

  const quarantined = await evaluateGuardrails(
    contextFor({
      sourceTrust: "untrusted",
      dataClasses: ["restricted"],
    }),
    stack,
    50,
  );
  assertEqual(quarantined.decision.action, "quarantine", "provenance");

  const unknownPolicy = await evaluateGuardrails(
    contextFor({ policyVersion: "unknown-policy" }),
    stack,
    50,
  );
  assertEqual(unknownPolicy.decision.action, "block", "unknown policy");

  const neverResolves: Guardrail = {
    id: "unavailable-detector",
    layer: "input",
    evaluate: () => new Promise<GuardrailDecision>(() => undefined),
  };
  const timedOut = await evaluateGuardrails(
    contextFor(),
    [neverResolves],
    1,
  );
  assertEqual(timedOut.decision.action, "block", "timeout policy");
  assertEqual(
    timedOut.decision.reasonCode,
    "GUARDRAIL_TIMEOUT_FAIL_CLOSED",
    "timeout reason",
  );
}

await guardrailDecisionTests();
```

The cross-tenant proposal remains schema-valid. Authorization blocks it because the verified tenant does not match. The timeout test proves this workflow fails closed instead of silently continuing.

## Recheck at execution time

Policy evaluates a snapshot. The executor may see a changed account state, expired approval, revoked permission, or different canonical destination. Bind approval to normalized arguments, then recheck authorization and preconditions immediately before the effect.

Use idempotency keys for mutations. A retry after a lost response must not issue a second credit or send a duplicate reply.

## Version policy and rollback independently

Record the policy version on every decision and effect. Deploy model, prompt, policy, and tool-definition changes independently when possible. If false blocks spike, the team can roll back the policy without guessing which prompt or model produced each decision.

Unknown policy versions fail closed in the example because the executor cannot interpret their guarantees. A low-risk public search could instead enter a named degraded mode.

## Tradeoffs and residual risk

Each blocking layer adds latency, operational dependencies, and a policy surface that can reject legitimate work. Parallelize independent checks, cache only facts with safe lifetimes, and reserve human approval for decisions where the reviewer receives enough context to change the outcome.

Layering does not eliminate risk. Trusted metadata can be wrong, a policy can encode the wrong rule, an authorized action can still be harmful, and state can change after a check. Independent authorization, bounded capabilities, execution-time revalidation, and effect records limit those failures without claiming that any one layer is complete.

## Common failure modes

- **One model judges everything**: Identity, ownership, and destination facts are converted back into probabilistic text.
- **No failure policy**: Timeouts become accidental allows.
- **Schema as authorization**: A well-formed cross-tenant action reaches the executor.
- **Approval without binding**: The displayed action and executed action can drift.
- **No policy version**: Incidents cannot reconstruct which rules applied.
- **Check without revalidation**: Resource state changes between approval and execution.

## Series navigation

- Previous: [Part 2: Threat-Model an AI Application](../2026-09-01-threat-model-ai-application/)
- Next: [Part 4: Prompt Injection and Control-Data Separation](../2026-09-01-prompt-injection-control-data-separation/)
- Series index: [Engineering Guardrails for AI Systems](../series/engineering-ai-guardrails/)

## References

- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [OWASP AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html)
- [Guardrails and human review, OpenAI](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)
- [Trustworthy agents in practice, Anthropic](https://www.anthropic.com/research/trustworthy-agents)

## Related topics

- [Permission and trust models](../../topics/ai/harness-development/permission-models/)
- [Tool design and schema discipline](../../topics/ai/harness-development/tool-design/)
- [Prompt injection defense](../../topics/ai/prompt-engineering/prompt-injection-defense/)
- [Build an MCP client and model tool loop](../2026-07-19-build-mcp-client-model-loop/)
