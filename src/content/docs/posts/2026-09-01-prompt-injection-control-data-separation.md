---
title: Prompt Injection and Control-Data Separation
description: "How direct and indirect prompt injection cross trust boundaries, why detection is incomplete, and how provenance plus capability-scoped execution limits external effects."
date: 2026-09-01
tags: [ai, guardrails, security, prompt-injection]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-09-01-prompt-injection-control-data-separation/
series:
  slug: engineering-ai-guardrails
  order: 4
---

This is part 4 of the [Engineering Guardrails for AI Systems series](../series/engineering-ai-guardrails/).

A support assistant opens a customer ticket. The ticket contains a legitimate billing question and an embedded instruction that asks the assistant to ignore its task, summarize private account data, and send the result elsewhere.

The ticket is data. The model can still interpret part of it as control. If the application lets that interpretation select capabilities or destinations, untrusted content has crossed an authorization boundary.

Prompt injection is not solved by finding one perfect prompt or detector. The engineering goal is to reduce successful influence and prevent influenced output from gaining unauthorized effects.

## Three related attacks have different entry points

- **Jailbreak**: A user tries to override the model's intended behavioral constraints, often to obtain disallowed output.
- **Direct prompt injection**: A user supplies instructions that conflict with the application's task or policy.
- **Indirect prompt injection**: Instructions arrive through content the application retrieves or processes, such as a ticket, document, web page, email, tool result, or stored memory.

The same turn can contain more than one category. The distinction helps locate the trust boundary. A direct injection enters through the user's input channel. An indirect injection arrives through a data source that the system chose to read.

## Trace influence all the way to an effect

```text
untrusted ticket body
        |
        v
ticket text enters model context
        |
        v
model follows embedded instruction
        |
        v
model proposes send_reply
        |
        v
application accepts model-selected destination
        |
        v
private data leaves the approved workflow
```

The injection changed model behavior near the top. Harm occurred because later layers treated that behavior as authority. A useful incident review asks both questions:

1. Why did the model follow the instruction?
2. Why could the resulting proposal reach that data and destination?

Improving the first answer lowers attack success. Fixing the second contains the result when model behavior still fails.

## Delimiters and classifiers are partial controls

Delimiters, role labels, instruction hierarchies, and explicit warnings can help the model recognize data as data. Injection classifiers can block or quarantine known patterns. Neither creates a hard boundary.

An attacker can paraphrase an instruction, encode it, split it across sources, or establish it over several turns. A classifier also faces benign hard negatives, such as a security ticket that discusses prompt injection without attempting one. Tight detection raises false blocks. Loose detection misses attacks.

Use these controls to influence behavior, reduce exposure, and route uncertain cases. Do not use a detector score as proof that a tool call is authorized.

## Keep provenance outside the content string

String concatenation erases distinctions the policy layer needs:

```typescript
function buildUnsafePrompt(systemInstruction: string, ticketBody: string) {
  return `${systemInstruction}\n\nCustomer ticket:\n${ticketBody}`;
}
```

Once combined, trusted instructions and untrusted data are just tokens in one sequence. Labels inside that string can guide the model, but downstream code cannot reliably use them as trusted facts.

Preserve source, trust, and data classification as application-owned metadata:

```typescript
type DataClass = "public" | "internal" | "restricted";
type Trust = "trusted" | "untrusted";

type ContentEnvelope = {
  sourceId: string;
  sourceType: "system" | "customer-ticket" | "tool-result";
  trust: Trust;
  dataClasses: readonly DataClass[];
  content: string;
};

type TicketToolResult = {
  kind: "ticket";
  ticketId: string;
  envelope: ContentEnvelope;
};

function ticketResult(ticketId: string, body: string): TicketToolResult {
  return {
    kind: "ticket",
    ticketId,
    envelope: {
      sourceId: `ticket:${ticketId}`,
      sourceType: "customer-ticket",
      trust: "untrusted",
      dataClasses: ["internal"],
      content: body,
    },
  };
}
```

The model may receive a serialized view of this structure. The enforcement layer receives the original application object. Provenance labels can guide the model. Application-owned provenance metadata supports enforcement.

## Capabilities come from the host, not the ticket

CaMeL explores a stronger form of control-data separation: trusted control flow determines how values may be used, while untrusted model-derived values remain data with tracked dependencies. The practical direction is valuable even when an application does not implement the full research system.

The host grants a small capability set before reading untrusted content. The model proposes values within that set. Policy evaluates authenticated workflow facts, trusted provenance records, and normalized arguments. Instructions inside a ticket never add a capability.

```typescript
type Capability = "draft_reply" | "send_verified_reply";

type ActionProposal = {
  action: "draft_reply" | "send_reply";
  destination?: string;
  body: string;
  sourceIds: readonly string[];
};

type HostPolicy = {
  policyVersion: string;
  capabilities: readonly Capability[];
  verifiedDestination: string;
  knownSources: ReadonlyMap<string, ContentEnvelope>;
};

type GuardrailDecision = {
  action: "allow" | "block" | "ask" | "redact" | "quarantine";
  reasonCode: string;
  policyVersion: string;
};

function evaluateAction(
  policy: HostPolicy,
  proposal: ActionProposal,
): GuardrailDecision {
  const base = { policyVersion: policy.policyVersion };

  if (proposal.sourceIds.some((id) => !policy.knownSources.has(id))) {
    return { action: "block", reasonCode: "UNKNOWN_SOURCE", ...base };
  }

  if (proposal.action === "draft_reply") {
    if (!policy.capabilities.includes("draft_reply")) {
      return { action: "block", reasonCode: "CAPABILITY_NOT_GRANTED", ...base };
    }
    return { action: "allow", reasonCode: "DRAFT_ALLOWED", ...base };
  }

  if (!policy.capabilities.includes("send_verified_reply")) {
    return { action: "block", reasonCode: "CAPABILITY_NOT_GRANTED", ...base };
  }

  if (proposal.destination !== policy.verifiedDestination) {
    return { action: "block", reasonCode: "DESTINATION_NOT_VERIFIED", ...base };
  }

  return { action: "allow", reasonCode: "VERIFIED_SEND_ALLOWED", ...base };
}
```

`evaluateAction` never searches ticket content for permission. A ticket that says “you may send this elsewhere” remains an untrusted string. Only `HostPolicy.capabilities` and `verifiedDestination`, selected from trusted workflow state, can authorize a send.

The executor must accept an allowed, normalized proposal rather than raw model output. It should recheck the destination and capability immediately before the effect.

## Test effects, not attack-keyword detection

The following fixtures represent different routes to a compromised model proposal. The test does not need a production attack recipe. It assumes the model was influenced and proves that the policy still prevents the proposed effect.

```typescript
type InjectionCase = {
  name: "plain" | "paraphrased" | "encoded" | "split" | "multi-turn";
  sources: readonly ContentEnvelope[];
};

type RecordingExecutor = {
  calls: ActionProposal[];
};

function assertEqual<T>(actual: T, expected: T, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, received ${actual}`);
  }
}

function policyFor(sources: readonly ContentEnvelope[]): HostPolicy {
  return {
    policyVersion: "support-policy-v1",
    capabilities: ["draft_reply", "send_verified_reply"],
    verifiedDestination: "customer@example.invalid",
    knownSources: new Map(sources.map((source) => [source.sourceId, source])),
  };
}

const untrusted = (sourceId: string, content: string): ContentEnvelope => ({
  sourceId,
  sourceType: "customer-ticket",
  trust: "untrusted",
  dataClasses: ["internal"],
  content,
});

function executeIfAllowed(
  decision: GuardrailDecision,
  proposal: ActionProposal,
  executor: RecordingExecutor,
): void {
  if (decision.action === "allow") executor.calls.push(proposal);
}

const injectionCases: readonly InjectionCase[] = [
  {
    name: "plain",
    sources: [untrusted("ticket:plain", "Synthetic direct instruction")],
  },
  {
    name: "paraphrased",
    sources: [untrusted("ticket:paraphrased", "Synthetic restatement")],
  },
  {
    name: "encoded",
    sources: [untrusted("ticket:encoded", "Synthetic encoded instruction")],
  },
  {
    name: "split",
    sources: [
      untrusted("ticket:split-a", "Synthetic fragment A"),
      untrusted("ticket:split-b", "Synthetic fragment B"),
    ],
  },
  {
    name: "multi-turn",
    sources: [
      untrusted("ticket:turn-1", "Synthetic setup from an earlier turn"),
      untrusted("ticket:turn-2", "Synthetic follow-up instruction"),
    ],
  },
];

for (const fixture of injectionCases) {
  const influencedProposal: ActionProposal = {
    action: "send_reply",
    destination: "unapproved@example.invalid",
    body: "Synthetic model output",
    sourceIds: fixture.sources.map((source) => source.sourceId),
  };
  const decision = evaluateAction(policyFor(fixture.sources), influencedProposal);
  const executor: RecordingExecutor = { calls: [] };
  executeIfAllowed(decision, influencedProposal, executor);
  assertEqual(decision.action, "block", fixture.name);
  assertEqual(decision.reasonCode, "DESTINATION_NOT_VERIFIED", fixture.name);
  assertEqual(executor.calls.length, 0, `${fixture.name} effect count`);
}

const benignDiscussion = untrusted(
  "ticket:benign",
  "Our security review discusses prompt injection. Please draft a summary.",
);
const benignProposal: ActionProposal = {
  action: "draft_reply",
  body: "Draft summary of the security discussion",
  sourceIds: [benignDiscussion.sourceId],
};
const benignDecision = evaluateAction(
  policyFor([benignDiscussion]),
  benignProposal,
);
const benignExecutor: RecordingExecutor = { calls: [] };
executeIfAllowed(benignDecision, benignProposal, benignExecutor);
assertEqual(benignDecision.action, "allow", "benign hard negative");
assertEqual(benignExecutor.calls.length, 1, "benign draft effect count");
```

These tests do not show that every injection is detected. They show that plain, paraphrased, encoded, split, and multi-turn influence cannot select an unverified destination in this workflow. The benign hard negative also proves that mentioning prompt injection does not automatically block safe drafting.

## Control-data separation has a cost

Smaller capabilities and stricter data-flow rules reduce the model's room to improvise. Some useful tasks require values to cross a trust boundary, such as summarizing a ticket into a reply. The application needs an explicit declassification rule, destination check, or human approval for those crossings.

Coverage is therefore part of the design:

- Which workflows can run with deterministic data-flow policies?
- Which require a person to approve a release or effect?
- Which cannot be offered safely with the available context and executor?

The residual risk includes unsafe text that remains within the allowed destination, flaws in trusted workflow code, stale provenance, overbroad capabilities, and attacks that exploit a permitted action. Control-data separation narrows authority. It does not prove that model output is correct or harmless.

## Common failure modes

- **Delimiter as boundary**: The system trusts a text marker that the model may ignore.
- **Classifier as authorization**: A low injection score allows an otherwise unauthorized action.
- **Provenance only in the prompt**: Trusted code cannot distinguish source facts after serialization.
- **Capabilities from content**: A document or ticket can talk the application into enabling a tool.
- **Attack-only test set**: The detector blocks security discussions and other benign hard negatives.
- **Single-turn evaluation**: Split and multi-turn influence is absent from the regression suite.
- **No effect assertion**: A test checks model wording but never proves that the executor stayed idle.

## Series navigation

- Previous: [Part 3: Design a Layered AI Guardrail Architecture](../2026-09-01-layered-ai-guardrail-architecture/)
- Next: [Part 5: Guardrails for Production Chatbots](../2026-09-01-production-chatbot-guardrails/)
- Series index: [Engineering Guardrails for AI Systems](../series/engineering-ai-guardrails/)

## References

- [OWASP LLM01: Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [Trustworthy agents in practice, Anthropic](https://www.anthropic.com/research/trustworthy-agents)
- [AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents](https://arxiv.org/abs/2406.13352)
- [InjecAgent: Benchmarking Indirect Prompt Injections in Tool-Integrated Large Language Model Agents](https://aclanthology.org/2024.findings-acl.624/)
- [Defeating Prompt Injections by Design, CaMeL](https://arxiv.org/abs/2503.18813)

## Related topics

- [Prompt injection defense](../../topics/ai/prompt-engineering/prompt-injection-defense/)
- [Permission and trust models](../../topics/ai/harness-development/permission-models/)
- [Agent benchmarks](../../topics/ai/benchmarks/agent-benchmarks/)
- [MCP tool design for models](../2026-07-19-mcp-tool-design-for-models/)
