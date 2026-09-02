---
title: Threat-Model an AI Application
description: "A trust-boundary method for AI applications, with a support-assistant data-flow map, prioritized prohibited outcomes, and TypeScript checks for missing ownership and destination facts."
date: 2026-09-01
tags: [ai, guardrails, security, threat-modeling]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-09-01-threat-model-ai-application/
series:
  slug: engineering-ai-guardrails
  order: 2
---

This is part 2 of the [Engineering Guardrails for AI Systems series](../series/engineering-ai-guardrails/).

A team adds an injection classifier to its support assistant. The classifier performs well on a test set, but the application still lets any authenticated support agent request any account summary. The model does not need to be attacked for a cross-tenant disclosure to occur.

The team started with suspicious phrases. A threat model starts with authority, data, and effects.

## Ask what the system can change

For each workflow, inventory six things before choosing controls:

1. **Actors**: Who asks, approves, configures, or operates the workflow?
2. **Assets**: Which data, credentials, money, records, messages, and audit evidence matter?
3. **Sources**: Which inputs are trusted, mixed, or untrusted?
4. **Capabilities**: What can the model read, draft, send, modify, execute, or delegate?
5. **Destinations**: Where can data and effects leave the system?
6. **State**: Which tenant, account, ticket, policy, approval, and session state constrain the task?

A prompt-injection threat model without these facts can tell you that hostile text exists. It cannot tell you what that text can reach.

## Map the support workflow

The repeated example uses a fictional support assistant. Ticket text is untrusted. The authenticated support agent is allowed to work only on assigned accounts. Internal notes cannot appear in customer replies. A service credit changes account balance and needs approval.

```text
                           TRUSTED CONTROL PLANE
Support agent --> identity --> workflow policy --> approval record
      |                            |                    |
      |                            v                    |
      |                    capability selection        |
      |                            |                    |
      +----------------------------+--------------------+
                                   |
                                   v
                         MIXED-TRUST MODEL CONTEXT
                  +----------------+----------------+
                  |                                 |
          untrusted ticket                    public documents
                  |                                 |
                  +--------------> model <----------+
                                      |
                                      v
                              proposed action
                                      |
                                      v
                 schema -> policy -> authorization -> approval
                                      |
                                      v
                               fake executor
                    +-----------------+------------------+
                    |                 |                  |
             account read       customer reply     service credit
             tenant scoped      verified address    bounded amount
```

The model context is mixed trust because application instructions, user intent, ticket text, retrieved documents, and tool results meet there. Mixed trust is not the same as no trust. It means no string inside the context can grant authority by itself.

## Mark every entry point

Direct user messages are only one path. AI applications also ingest instructions through:

- Retrieved documents, support tickets, email, websites, and files.
- Tool names, descriptions, annotations, errors, and results.
- Memory, summaries, checkpoints, and prior turns.
- Agent handoffs and delegated task descriptions.
- Model-written approval summaries.
- Source comments, build logs, and test output read by coding agents.

MITRE ATLAS tracks prompt injection as an adversary technique. OWASP separates direct injection from indirect injection through external content. The architectural consequence is the same: entry-point coverage needs to include every channel that reaches model context or control flow.

## Separate compromise from impact

An attack can change model behavior without producing a security incident. An incident needs an impact path.

```text
untrusted content
       |
       v
model follows attacker-selected objective       model compromise
       |
       v
private read + external write both available    dangerous capability set
       |
       v
policy or authorization missing                 first preventable failure
       |
       v
restricted marker reaches unapproved sink       prohibited outcome
```

This distinction prevents a weak release gate such as “the model never followed the injected sentence.” A stronger gate asks whether the prohibited read, write, disclosure, or charge occurred, even when the model behaved badly.

## The dangerous combination

Three conditions deserve immediate scrutiny:

- The workflow can read private data.
- It processes untrusted content.
- It can communicate or write outside the trusted boundary.

Break one edge and the worst-case impact shrinks. A ticket summarizer can process untrusted text without access to internal notes. An account reader can return data only to an application-owned draft buffer. A sender can accept only a prevalidated reply and the ticket's verified recipient.

This is capability design, not a promise that the model will recognize every attack.

## Build a boundary inventory in code

Threat-model records are useful when release checks can consume them. This small contract rejects workflows that omit ownership or outbound destination facts.

```typescript
type TrustLevel = "trusted" | "mixed" | "untrusted";

type ThreatBoundary = {
  workflow: string;
  owner?: string;
  authenticatedActor: boolean;
  tenantScoped: boolean;
  sources: ReadonlyArray<{
    name: string;
    trust: TrustLevel;
  }>;
  capabilities: readonly string[];
  dataClasses: readonly string[];
  externalDestinations?: readonly string[];
};

type BoundaryFinding = {
  code:
    | "MISSING_OWNER"
    | "MISSING_IDENTITY"
    | "MISSING_TENANT_SCOPE"
    | "MISSING_DESTINATION_INVENTORY";
  detail: string;
};

function validateThreatBoundary(
  boundary: ThreatBoundary,
): readonly BoundaryFinding[] {
  const findings: BoundaryFinding[] = [];

  if (!boundary.owner) {
    findings.push({
      code: "MISSING_OWNER",
      detail: "The workflow needs an accountable owner.",
    });
  }

  if (!boundary.authenticatedActor) {
    findings.push({
      code: "MISSING_IDENTITY",
      detail: "The workflow cannot authorize actions without actor identity.",
    });
  }

  if (!boundary.tenantScoped) {
    findings.push({
      code: "MISSING_TENANT_SCOPE",
      detail: "Account reads need an independently verified tenant boundary.",
    });
  }

  const canCommunicate = boundary.capabilities.some((capability) =>
    ["send_reply", "http_request", "post_message"].includes(capability),
  );

  if (canCommunicate && boundary.externalDestinations === undefined) {
    findings.push({
      code: "MISSING_DESTINATION_INVENTORY",
      detail: "Outbound capability needs an explicit destination inventory.",
    });
  }

  return findings;
}
```

The check does not prove the workflow is secure. It prevents a design review from proceeding without basic ownership, identity, tenancy, and destination facts.

```typescript
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const findings = validateThreatBoundary({
  workflow: "answer-support-ticket",
  authenticatedActor: true,
  tenantScoped: true,
  sources: [{ name: "ticket-body", trust: "untrusted" }],
  capabilities: ["get_account_summary", "send_reply"],
  dataClasses: ["customer", "internal"],
});

assert(
  findings.some((finding) => finding.code === "MISSING_OWNER"),
  "missing owner should fail review",
);
assert(
  findings.some(
    (finding) => finding.code === "MISSING_DESTINATION_INVENTORY",
  ),
  "outbound workflow needs destination facts",
);
```

## Threat table

| Threat | Entry point | Prohibited outcome | Control requirement | Evidence |
| --- | --- | --- | --- | --- |
| Direct injection | User message | Disallowed response or tool proposal | Input and output policy plus tool authorization | Safe refusal and zero executor calls |
| Indirect injection | Ticket or retrieved document | Internal note disclosed externally | Provenance, capability limits, egress policy | Synthetic marker never reaches sink |
| Tool poisoning | Tool description or result | Model selects a misleading or hostile tool path | Pin definitions, label results, apply per-tool policy | Changed definition is quarantined |
| Confused deputy | Actor, tenant, or token mismatch | Cross-tenant account access | Audience, subject, tenant, and object authorization | Cross-tenant fixture returns block |
| Memory poisoning | Stored summary or checkpoint | Attacker objective persists into later turns | Trust labels, write policy, expiry, revalidation | Poisoned summary cannot grant capability |
| Approval deception | Model-written review text | Reviewer authorizes a different destination | Render canonical facts and bind action digest | Mismatched digest cannot execute |
| Cost abuse | Repeated requests or nested work | Budget or availability exhausted | Rate, concurrency, depth, token, and time limits | Budget fixture terminates predictably |

Threats can share controls, but each prohibited outcome needs a named owner and release test.

## Convert one outcome into a release gate

Write the outcome without mentioning a particular detector:

> Restricted data must not reach an unapproved destination, even when untrusted ticket text changes the model's proposed action.

Then test the effect boundary:

```typescript
type ReleaseObservation = {
  releasedDataClasses: readonly string[];
  destination: string;
  approvedDestinations: readonly string[];
};

function restrictedDataReachedUnapprovedDestination(
  observation: ReleaseObservation,
): boolean {
  return (
    observation.releasedDataClasses.includes("restricted") &&
    !observation.approvedDestinations.includes(observation.destination)
  );
}

const observation: ReleaseObservation = {
  releasedDataClasses: ["restricted"],
  destination: "unapproved@example.invalid",
  approvedDestinations: ["customer@example.invalid"],
};

type RecordingReleaseSink = {
  releases: ReleaseObservation[];
  release(observation: ReleaseObservation): void;
};

function releaseIfAllowed(
  observation: ReleaseObservation,
  sink: RecordingReleaseSink,
): boolean {
  if (restrictedDataReachedUnapprovedDestination(observation)) return false;
  sink.release(observation);
  return true;
}

const sink: RecordingReleaseSink = {
  releases: [],
  release(allowedObservation) {
    this.releases.push(allowedObservation);
  },
};

if (releaseIfAllowed(observation, sink)) {
  throw new Error("prohibited release should be blocked");
}

if (sink.releases.length !== 0) {
  throw new Error("blocked release reached the sink");
}
```

The release test uses a fake sink and asserts the effect count. It remains useful when the prompt, model, classifier, or attack wording changes.

## Prioritize by effect and exposure

Not every threat deserves the same control cost. Prioritize outcomes using:

- Impact if the effect succeeds.
- Exposure of the entry point.
- Authority available to the workflow.
- Detectability and reversibility of the effect.
- Existing independent controls in downstream systems.
- Frequency and cost of benign false blocks.

Avoid universal numeric thresholds. A false refusal on a public documentation search and a false allow on a service credit do not carry the same consequence.

## Tradeoffs and residual risk

A detailed boundary inventory takes time to maintain as tools, destinations, and data access change. Broader controls can also block legitimate support work, while narrow controls leave more paths for reviewers to reason about. Tie the review depth to the authority and reversibility of the workflow.

The threat model can still be incomplete. A new connector, stale tenant mapping, misclassified data source, or approved but unsafe destination can create a path the table does not show. Revisit the map when any capability, source, identity path, or destination changes.

## Common failure modes

- **Phrase-first threat modeling**: The review lists attack strings but omits assets and authority.
- **Model compromise equals incident**: A changed answer is treated as equivalent to an external effect.
- **Tool list without combinations**: Private reads and external writes look harmless when reviewed separately.
- **Identity in prompt text**: Tenant or account claims supplied to the model are treated as verified identity.
- **No destination inventory**: The team cannot state where generated data can leave the system.

## Series navigation

- Previous: [Part 1: AI Guardrails Are Systems, Not Prompts](../2026-09-01-ai-guardrails-are-systems-not-prompts/)
- Next: [Part 3: Design a Layered AI Guardrail Architecture](../2026-09-01-layered-ai-guardrail-architecture/)
- Series index: [Engineering Guardrails for AI Systems](../series/engineering-ai-guardrails/)

## References

- [OWASP Agentic AI Threats and Mitigations](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/)
- [OWASP LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [MITRE ATLAS](https://atlas.mitre.org/)
- [NIST AI 600-1 Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)

## Related topics

- [Prompt injection defense](../../topics/ai/prompt-engineering/prompt-injection-defense/)
- [Permission and trust models](../../topics/ai/harness-development/permission-models/)
- [Agent benchmarks](../../topics/ai/benchmarks/agent-benchmarks/)
- [Remote MCP production security](../2026-07-19-remote-mcp-production-security/)
