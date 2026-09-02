# Engineering Guardrails for AI Systems, series plan

Status: in progress

Created: 2026-09-01

Series slug: `engineering-ai-guardrails`

Research baseline: `docs/research/2026-09-01-ai-guardrails-series-research.md` (local and ignored)

## Goal

Publish a 14-part instructional series that teaches production engineers how to add guardrails to chatbots, retrieval systems, tool-using applications, MCP clients and servers, and agent workflows. Readers should leave able to design enforcement boundaries, test them, measure security without hiding utility loss, and reconstruct how a bypass reached an external side effect.

The series uses one principle from start to finish:

> Model output is a proposal. Policy, authorization, approval, and execution controls decide whether it becomes an effect.

The work builds on the site's existing prompt-injection, permission-model, benchmark, MCP, and coding-agent material. It does not repeat protocol introductions or treat stronger prompts as security boundaries.

## Success criteria

The finished series is successful when a production engineer can:

- Draw the trust boundaries for a chatbot, MCP integration, or agent workflow.
- Distinguish safety policy, security policy, schema validation, authorization, approval, and sandboxing.
- Explain direct injection, indirect injection, tool poisoning, goal hijacking, excessive agency, and confused-deputy failures.
- Place input, output, tool, execution, and egress controls at the correct workflow points.
- Preserve provenance and capability limits across retrieval, memory, tools, and handoffs.
- Add deterministic tests that prove blocked actions never reach an executor.
- Build adversarial evals that measure attack success beside benign task success.
- Emit audit events that reconstruct a causal path without logging every secret.
- Diagnose the first preventable control failure after a guardrail bypass.
- Apply the same architecture using Claude and OpenAI/Codex APIs and SDKs.

## Audience and prerequisites

Primary audience: production software engineers.

Assumed knowledge:

- HTTP APIs and JSON.
- Authentication and authorization.
- TypeScript or Python.
- Unit, integration, and end-to-end testing.
- Structured logs and distributed traces.
- Basic language-model and tool-calling concepts.

Explain AI-specific terminology when introduced. Link to existing foundation pages for readers who need the model, MCP, or agent background.

## Scope

### Included

- Chatbots and retrieval-augmented applications.
- Custom function tools.
- MCP clients, hosts, and servers.
- Single-agent and multi-agent workflows.
- Direct and indirect prompt injection.
- Tool poisoning and dangerous tool combinations.
- Least privilege, policy, authorization, approvals, and sandboxing.
- Deterministic tests, adversarial evals, metrics, tracing, and incident response.
- Claude Messages API, Claude Agent SDK, and Claude Managed Agents examples.
- OpenAI Agents SDK and Codex SDK examples.
- TypeScript and Python snippets.

### Excluded

- Claude Code end-user configuration.
- Codex CLI, IDE, and cloud configuration tutorials.
- Model training or alignment implementation.
- A vendor leaderboard.
- Claims that one classifier or prompt prevents every injection.
- A large companion application.
- Empty public post stubs before their content is ready.
- Harmful jailbreak recipes or real credentials.

## Editorial position

The series distinguishes five jobs that are often collapsed under the word guardrail:

1. **Influence**: Instructions, examples, delimiters, and model training steer behavior.
2. **Detect**: Validators and classifiers identify suspicious input, output, or actions.
3. **Enforce**: Policy, authorization, capability, sandbox, and egress controls stop effects.
4. **Explain**: Structured decisions and traces show what happened and why.
5. **Recover**: Incident response, rollback, revocation, and regression tests reduce repeat harm.

No installment can describe an influence or detection control as enforcement. No installment can claim that blocking the final text undoes an earlier side effect.

Use “guardrail bypass” for a control that allowed, skipped, failed open, or was improperly overridden. Use “failure propagation” for unsafe state moving across retrieval, model, tool, memory, approval, execution, or handoff boundaries. Define “guardrail hop” as an informal umbrella term, not a standard term.

## Repeated example domain

Use a fictional customer-support assistant throughout the series. The domain is easy to understand and exposes meaningful read, write, and external communication boundaries.

### Trusted task

A support agent asks the assistant to answer a customer ticket. The ticket body is untrusted. The assistant can search public documentation, read an account summary, draft a reply, send an approved reply, and request a small service credit.

### Data classes

- `public`: Product documentation and published policies.
- `customer`: Ticket text and account details available to the authenticated support agent.
- `internal`: Private notes that cannot appear in customer replies.
- `restricted`: Synthetic markers used to test exfiltration controls.

### Tool set

| Tool | Effect | Default posture |
| --- | --- | --- |
| `search_public_docs` | Reads public documentation | Allow with result limits |
| `get_account_summary` | Reads one authorized account | Allow after tenant and account authorization |
| `draft_reply` | Produces a draft without sending | Allow with output screening |
| `send_reply` | Sends to the ticket's verified recipient | Ask or allow only under a narrow workflow policy |
| `issue_service_credit` | Changes account balance | Ask, enforce amount and account limits |

### Safe attack fixture

Use a synthetic ticket that tries to redirect the workflow, request an unrelated internal note, and send a `SYNTHETIC_PRIVATE_MARKER` to an unapproved destination. The marker is not a secret. The destination is a reserved example address or fake tool sink. No example performs a real external write.

### Why this domain works

- A plain chatbot can answer the ticket without tools.
- Retrieval introduces untrusted documents.
- Tools introduce capability and authorization.
- MCP can expose the same tools remotely.
- Agent delegation can separate research, policy, and response drafting.
- Tests can assert exact reads, writes, and destinations.
- Audit examples can reconstruct one understandable incident path.

## Stable instructional contracts

The snippets remain self-contained, but these names and semantics stay stable across posts.

### GuardrailDecision

```typescript
type GuardrailDecision = {
  action: "allow" | "block" | "ask" | "redact" | "quarantine";
  reasonCode: string;
  policyVersion: string;
  explanation?: string;
};
```

Rules:

- `allow` permits only the normalized action evaluated by the policy.
- `block` stops the workflow path and records a stable reason.
- `ask` creates a review request bound to normalized arguments.
- `redact` removes classified fields before release or tool return.
- `quarantine` preserves suspicious content without feeding it into the normal model path.

### GuardrailContext

```typescript
type GuardrailContext = {
  actorId: string;
  tenantId: string;
  originalTask: string;
  requestedAction: string;
  resource: string;
  destination?: string;
  sourceTrust: "trusted" | "mixed" | "untrusted";
  dataClasses: readonly string[];
  capabilities: readonly string[];
  lineage: readonly string[];
};
```

### GuardrailAuditEvent

```typescript
type GuardrailAuditEvent = {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  policyVersion: string;
  guardrailId: string;
  layer: "input" | "context" | "tool" | "execution" | "output";
  decision: GuardrailDecision["action"];
  reasonCode: string;
  evidenceRef?: string;
  outcome: "stopped" | "continued" | "executed" | "released";
};
```

### SecurityEvalCase

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class SecurityEvalCase:
    case_id: str
    trusted_task: str
    untrusted_content: str
    allowed_outcome: str
    prohibited_outcome: str
    mutation_family: str
```

### SecurityEvalResult

```python
@dataclass(frozen=True)
class SecurityEvalResult:
    case_id: str
    allowed_task_succeeded: bool
    prohibited_outcome_occurred: bool
    guardrail_triggered: bool
    false_positive: bool
    latency_ms: int
    trace_id: str
```

These contracts are teaching vocabulary, not a package API. Each post includes only the fields needed for its example.

## Public content shape

### Series landing page

Path: `src/content/docs/posts/series/engineering-ai-guardrails/index.mdx`

Frontmatter:

```yaml
---
title: Engineering Guardrails for AI Systems, post series
description: "A 14-part path from AI threat models and prompt injection through enforceable tool boundaries, MCP and agent controls, security evals, causal tracing, and incident response."
sidebar:
  hidden: true
---
```

The page will contain:

- One short statement of the series argument.
- Reader outcomes.
- The 14-part reading order.
- A version-baseline note for vendor and MCP examples.
- A short explanation of the fictional support workflow.
- Related links to prompt injection, permission models, benchmarks, and MCP.

### Discovery updates

When the landing page and first post publish:

- Add the series to `src/content/docs/posts/index.mdx`.
- Add the series to `src/content/docs/posts/series/index.mdx`.
- Do not add unfinished post links to the public landing page.
- Expand the reading order as each post lands.

### Post frontmatter

Every post uses:

```yaml
---
title: Post title
description: "Concrete description of the controls and evidence inside the post."
date: 2026-09-01
tags: [ai, guardrails, security, agents]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/<dated-slug>/
series:
  slug: engineering-ai-guardrails
  order: 1
---
```

Adjust tags by installment. Keep `ai`, `guardrails`, and `security` stable. Use `mcp`, `prompt-injection`, `testing`, `observability`, `claude`, `openai`, or `codex` when they describe the post.

## Part 1: Guardrails Are Systems, Not Prompts

Working file: `src/content/docs/posts/2026-09-01-ai-guardrails-are-systems-not-prompts.md`

Series order: 1

### Question

What counts as a guardrail, and where can each kind of control enforce a decision?

### Reader outcome

The reader can separate model steering, detection, enforcement, evidence, and recovery. They can identify why a system prompt cannot substitute for tool authorization.

### Content arc

1. Open with a support assistant that follows an injected instruction.
2. Show the difference between unsafe model text and an external side effect.
3. Define the five guardrail jobs.
4. Map controls to ingress, context, inference, tool, execution, and egress.
5. Introduce model output as a proposal.
6. Establish the series vocabulary and limits.

### Code anchor

A short TypeScript request pipeline with three explicit boundaries:

```text
validate input -> run model -> authorize proposal -> execute -> check output
```

Show the unsafe version first, where the model calls a tool dispatcher directly. Replace it with a `proposeAction` plus `evaluatePolicy` path.

### Wrong first move

Writing a longer system prompt and calling it the security layer.

### Required evidence

- A test proving a blocked tool proposal never reaches the executor.
- An ASCII diagram of the layered pipeline.
- A table distinguishing influence, detection, enforcement, explanation, and recovery.

### Sources

- OWASP LLM01 Prompt Injection.
- NIST AI RMF and Generative AI Profile.
- Anthropic trustworthy-agent research.
- OpenAI guardrails and human-review guidance.

### Follow-up path

Part 2 identifies assets, adversaries, entry points, and prohibited outcomes before choosing controls.

## Part 2: Threat-Model an AI Application

Working file: `src/content/docs/posts/2026-09-01-threat-model-ai-application.md`

Series order: 2

### Question

What can the model read, decide, invoke, expose, and change?

### Reader outcome

The reader can produce a trust-boundary map and a prioritized set of prohibited outcomes for an AI workflow.

### Content arc

1. Inventory assets, actors, data classes, tools, destinations, and state.
2. Mark trusted, mixed, and untrusted sources.
3. Enumerate direct, indirect, tool, memory, and handoff entry points.
4. Separate model compromise from system impact.
5. Identify the lethal combination of private data, untrusted content, and external communication.
6. Turn threats into control requirements and test cases.

### Code anchor

A TypeScript `ThreatBoundary` inventory and a small function that rejects a workflow missing ownership or destination facts.

### Wrong first move

Starting with a list of suspicious phrases instead of assets and authority.

### Required evidence

- ASCII data-flow diagram for the support workflow.
- Threat table covering direct injection, indirect injection, tool poisoning, confused deputy, memory poisoning, approval deception, and cost abuse.
- A deterministic mapping from one prohibited outcome to one release test.

### Sources

- OWASP Agentic AI Threats and Mitigations.
- MITRE ATLAS prompt-injection technique.
- NIST AI 600-1 Map and Measure guidance.
- Existing repo prompt-injection and permission-model pages.

### Follow-up path

Part 3 turns the threat model into a layered architecture with explicit failure behavior.

## Part 3: Design a Layered Guardrail Architecture

Working file: `src/content/docs/posts/2026-09-01-layered-ai-guardrail-architecture.md`

Series order: 3

### Question

Which controls belong at identity, input, context, tool, authorization, execution, and output boundaries?

### Reader outcome

The reader can place a control where it has the facts and authority needed to make its decision.

### Content arc

1. Build the layered control stack.
2. Define fail-closed, fail-open, quarantine, and degraded behaviors.
3. Separate syntactic validation from semantic policy and authorization.
4. Define decision and audit contracts.
5. Explain time-of-check to time-of-use drift.
6. Show policy versioning and rollback.

### Code anchor

Composable TypeScript `Guardrail` functions returning `GuardrailDecision`, followed by a policy gate that receives authenticated identity and normalized tool arguments.

### Wrong first move

Sending every decision to another language model.

### Required evidence

- Table of layer, available facts, possible decisions, failure behavior, and evidence.
- Unit tests for allow, block, ask, quarantine, timeout, and unknown-policy cases.
- One example where schema validation passes but authorization blocks.

### Sources

- NIST AI RMF.
- OWASP AI Agent Security Cheat Sheet.
- OpenAI guardrail boundary documentation.
- Anthropic permission-policy documentation.

### Follow-up path

Part 4 applies the architecture to prompt injection and control-data separation.

## Part 4: Prompt Injection and Control-Data Separation

Working file: `src/content/docs/posts/2026-09-01-prompt-injection-control-data-separation.md`

Series order: 4

### Question

How do direct and indirect injections change the model's effective objective, and how can architecture limit the damage?

### Reader outcome

The reader can preserve provenance, keep untrusted content in data channels, and prevent that content from selecting unauthorized control flow.

### Content arc

1. Distinguish jailbreaks, direct injection, and indirect injection.
2. Trace an injection from ticket body to tool proposal.
3. Show why delimiters and classifiers are partial controls.
4. Preserve source, trust, and data classification outside the content string.
5. Introduce capability-scoped execution and CaMeL's control-data direction.
6. Explain residual risk and task-coverage tradeoffs.

### Code anchor

Show unsafe string concatenation followed by a structured tool-result object with source metadata. Add an action policy that ignores instructions found in untrusted content when determining available capabilities.

### Wrong first move

Using a regular-expression list or prompt delimiter as proof that injection is prevented.

### Required evidence

- Tests for plain, paraphrased, encoded, split, and multi-turn synthetic injections.
- Benign hard negatives that discuss prompt injection without attempting one.
- A clear statement that provenance labels help the model but application metadata supports enforcement.

### Sources

- OWASP LLM01 and prompt-injection prevention guidance.
- Anthropic jailbreak and prompt-injection mitigation guidance.
- AgentDojo and InjecAgent.
- CaMeL.

### Follow-up path

Part 5 applies the control stack to a production chatbot before adding tool authority.

## Part 5: Guardrails for Production Chatbots

Working file: `src/content/docs/posts/2026-09-01-production-chatbot-guardrails.md`

Series order: 5

### Question

How should a chatbot validate input, screen content, constrain output, and preserve useful behavior?

### Reader outcome

The reader can design a request path that combines deterministic validation, optional model screening, structured output, abuse controls, and safe fallback behavior.

### Content arc

1. Start with a text-only support chatbot.
2. Add caller identity, limits, and normalized input validation.
3. Add structured model screening with explicit uncertainty behavior.
4. Add structured output and egress checks.
5. Design refusal, appeal, throttling, and repeated-abuse behavior.
6. Measure false refusals and latency.

### Code anchor

Parallel TypeScript and Python request handlers with deterministic checks before an optional classifier, then an output policy before release.

### Wrong first move

Blocking every request that mentions security-sensitive terms.

### Required evidence

- Unit tests for malformed input, policy violations, safe technical discussion, classifier timeout, and output redaction.
- A latency budget showing which checks can run in parallel and which need to block.
- A table separating content moderation from injection detection and application authorization.

### Sources

- Anthropic screening and structured-output guidance.
- OpenAI moderation and safety guidance.
- OWASP prompt-injection prevention guidance.

### Follow-up path

Part 6 adds tools and shows why valid model output is still only a proposal.

## Part 6: Tool Calls, Approvals, and Least Privilege

Working file: `src/content/docs/posts/2026-09-01-ai-tool-calls-approvals-least-privilege.md`

Series order: 6

### Question

How do schemas, capability limits, authorization, approvals, and idempotency constrain model-proposed actions?

### Reader outcome

The reader can build a pre-execution gate that binds identity, resource, action, destination, workflow state, and approval.

### Content arc

1. Separate read, draft, send, credit, and administrative tools.
2. Design strict schemas and semantic invariants.
3. Normalize arguments before policy.
4. Authorize every resource and destination.
5. Render approvals from validated facts.
6. Bind approval to an action digest and expiration.
7. Revalidate at execution and use idempotency keys.

### Code anchor

A TypeScript `executeToolProposal` function that validates, authorizes, asks when necessary, checks the approval binding, then invokes a fake executor.

### Wrong first move

Assuming a schema-valid tool call is authorized.

### Required evidence

- Tests proving no executor call after validation, authorization, or approval failure.
- A cross-tenant account test.
- An approval-deception example where canonical fields expose the real destination.
- A retry test that cannot duplicate the side effect.

### Sources

- OWASP Excessive Agency.
- OWASP Lies in the Loop.
- OpenAI human-review guidance.
- Existing MCP model-loop and permission-model pages.

### Follow-up path

Part 7 applies the same boundary to remote MCP tools and protocol authorization.

## Part 7: Guardrails for MCP Clients and Servers

Working file: `src/content/docs/posts/2026-09-01-mcp-client-server-guardrails.md`

Series order: 7

### Question

How do MCP hosts and servers defend against poisoned tool metadata, hostile results, token misuse, and dangerous tool combinations?

### Reader outcome

The reader can separate MCP protocol trust, authorization, model-facing metadata, and per-tool application policy.

### Content arc

1. Map host, client, server, authorization server, and protected resource.
2. Treat remote tool definitions and annotations as untrusted hints.
3. Pin, review, and diff tool definitions.
4. Validate and label tool results.
5. Bind tokens to resource and audience.
6. Prevent token passthrough and session identity mixing.
7. Evaluate tool combinations and data movement.
8. Add limits, timeouts, audit events, and revocation.

### Code anchor

A TypeScript host wrapper around the existing incident-style MCP model loop, adapted to the support tools. It validates the discovered definition, applies a per-tool approval policy, labels results, and records the server and definition version.

The code stays inside the post. Do not extend `companion/mcp-engineering-ops/` unless authoring reveals a testability gap that snippets cannot cover.

### Wrong first move

Trusting `readOnlyHint` or another annotation as authorization.

### Required evidence

- Tests for changed tool descriptions, oversized results, hostile result text, wrong token audience, and cross-session state.
- A tool-combination table covering private read plus external write.
- Cross-links to the MCP Server Design series instead of re-teaching the lifecycle.

### Sources

- MCP `2026-07-28` specification.
- MCP authorization and security best practices.
- MCP tool-annotation guidance.
- Existing MCP production-security post.

### Follow-up path

Part 8 follows unsafe state across delegation and handoff boundaries.

## Part 8: Agents, Delegation, and Guardrail Propagation

Working file: `src/content/docs/posts/2026-09-01-agent-delegation-guardrail-propagation.md`

Series order: 8

### Question

Which policy, provenance, budgets, and capability limits need to survive an agent handoff?

### Reader outcome

The reader can design a handoff envelope and prevent a delegated agent from inheriting unbounded authority or treating another agent's output as trusted instructions.

### Content arc

1. Compare manager-as-tool, handoff, and independent-worker orchestration.
2. Identify guardrails that run only at workflow endpoints.
3. Define a typed handoff envelope.
4. Reduce authority for delegated work.
5. Apply tool policy at every child invocation.
6. Protect shared memory and summaries.
7. Link parent and child traces, budgets, cancellation, and outcomes.

### Code anchor

A TypeScript `HandoffEnvelope` with original task, trusted constraints, untrusted inputs, allowed tools, data classes, budget, policy version, and parent trace identifiers. A child runner can only derive narrower capabilities.

### Wrong first move

Giving each child agent the parent workflow's full context, tools, and credentials.

### Required evidence

- Property test: child capability is a subset of parent capability.
- Test for handoff laundering, where untrusted ticket text appears in an agent summary.
- Test for child tool denial and linked trace events.
- ASCII diagram of parent, handoff, child, tool, and result paths.

### Sources

- OpenAI Agents SDK workflow-boundary and handoff guidance.
- Anthropic multi-agent and permission guidance.
- OWASP agentic threat guidance.

### Follow-up path

Parts 9 and 10 map the vendor-neutral architecture to Claude and OpenAI/Codex SDKs.

## Part 9: Claude API and Agent SDK Guardrails

Working file: `src/content/docs/posts/2026-09-01-claude-api-agent-sdk-guardrails.md`

Series order: 9

### Question

How do Claude applications structure untrusted content, screen it, gate tools, request confirmation, and preserve session evidence?

### Reader outcome

The reader can apply the earlier architecture using current Claude APIs without assuming that model resilience replaces host policy.

### Content arc

1. Show a Messages API tool loop with third-party content in `tool_result` blocks.
2. Attach source and trust metadata in application state.
3. Add a structured injection screen as a detection layer.
4. Add Agent SDK tool permission logic.
5. Add pre-tool and post-tool hooks where they are enforceable.
6. Map the same controls to Managed Agents permission policies and confirmation events.
7. Explain session evidence, agent versions, and beta limitations.

### Code anchor

Python Messages API and Agent SDK snippets for the support workflow. Include one Managed Agents configuration and event-handling snippet. Keep each code block under the repo's normal size limit.

### Wrong first move

Treating Claude's resistance to an injection as the application's authorization guarantee.

### Required evidence

- Tests around the application permission callback using no live credentials.
- A mock tool result containing a safe synthetic injection.
- A table mapping vendor control to layer, enforcement authority, and limitation.
- A version note for beta Managed Agents surfaces.

### Sources

- Anthropic prompt-injection mitigation guide.
- Claude Agent SDK permissions and hooks.
- Claude Managed Agents setup, reference, migration, and session operations.

### Follow-up path

Part 10 implements the same concepts with OpenAI Agents SDK and Codex SDK.

## Part 10: OpenAI Agents SDK and Codex SDK Guardrails

Working file: `src/content/docs/posts/2026-09-01-openai-agents-codex-sdk-guardrails.md`

Series order: 10

### Question

How do input, output, and tool guardrails interact with approvals, sandbox boundaries, and tracing in OpenAI and Codex SDK workflows?

### Reader outcome

The reader can choose the correct SDK control for the workflow point and wrap a Codex SDK task in host-owned policy.

### Content arc

1. Implement an input guardrail and explain blocking versus parallel execution.
2. Implement tool-input and tool-output guardrails for supported custom tools.
3. Explain endpoint-only input and output coverage in multi-agent workflows.
4. Add human review for the side-effecting support tools.
5. Emit trace metadata and custom policy spans.
6. Wrap a TypeScript Codex SDK task with repository, execution, network, time, and event boundaries.
7. State which hosted, built-in, handoff, or SDK paths need separate enforcement.

### Code anchor

Python OpenAI Agents SDK examples followed by a TypeScript Codex SDK wrapper. The Codex example analyzes a synthetic repository fixture and cannot access a real credential or external destination.

### Wrong first move

Assuming every tool and handoff automatically passes through the same guardrail pipeline.

### Required evidence

- Tests for blocking input guardrail behavior.
- Tests for a custom tool guardrail before executor invocation.
- Trace assertions for guardrail result and tool lineage.
- A Codex SDK host-policy test with fake process and event adapters where supported.
- An exact documentation and SDK version baseline recorded at publication.

### Sources

- Official OpenAI guardrails and human-review documentation.
- Official OpenAI integrations and observability documentation.
- Official OpenAI agent-eval documentation.
- Official Codex SDK documentation.

### Follow-up path

Part 11 removes live-model variance and proves the control plane deterministically.

## Part 11: Deterministic Guardrail Testing

Working file: `src/content/docs/posts/2026-09-01-deterministic-guardrail-testing.md`

Series order: 11

### Question

How can an engineer prove guardrail behavior without treating live model transcripts as tests?

### Reader outcome

The reader can build policy, contract, workflow, failure, and property tests around fake models and tools.

### Content arc

1. Define the test pyramid for guardrails.
2. Unit-test pure policy decisions.
3. Contract-test adapters and audit events.
4. Use fake model trajectories and recording tools.
5. Test timeout, retry, cancellation, and failure policy.
6. Add properties for capability monotonicity and side-effect evidence.
7. Explain what still requires live-model evaluation.

### Code anchor

A credential-free Python fake agent and TypeScript recording executor. Each fixture has an allowed task and a prohibited outcome.

### Wrong first move

Saving a few successful chat transcripts and calling them regression tests.

### Required evidence

- Table-driven unit tests.
- Fake-model tool and handoff trajectories.
- Tests for fail-closed, quarantine, and explicit degraded behavior.
- Property: every executed external effect has a preceding allow or approval event.
- Property: reducing authority cannot turn `block` into `allow`.

### Sources

- Official OpenAI Agents SDK testing guidance.
- Existing repo evaluation-and-methods page.
- Standard software-testing references already used by the site.

### Follow-up path

Part 12 adds adaptive attacks, model variance, and security-utility metrics.

## Part 12: Adversarial Evals and Security-Utility Measurement

Working file: `src/content/docs/posts/2026-09-01-adversarial-ai-security-evals.md`

Series order: 12

### Question

How do teams measure prompt-injection resistance without hiding lost task utility?

### Reader outcome

The reader can build an eval dataset, choose metrics, run repeated model trials, and interpret the security-utility frontier.

### Content arc

1. Define allowed and prohibited outcomes independently.
2. Build benign, attack, and hard-negative fixtures.
3. Add mutation families and multi-turn cases.
4. Run baseline, control, and adaptive-attack conditions.
5. Measure attack success, benign success, utility under attack, false refusals, latency, and cost.
6. Account for stochastic variance and model updates.
7. Turn metrics into risk-specific release gates.

### Code anchor

A Python eval runner over `SecurityEvalCase` values that uses deterministic outcome checks and optional model graders. Produce a compact result table rather than a vendor leaderboard.

### Wrong first move

Reporting only the fraction of attacks blocked.

### Required evidence

- The four-outcome matrix from AgentDojo-style evaluation.
- Repeated trials for stochastic cases.
- Hard negatives that mention attacks safely.
- A comparison of baseline utility and utility under attack.
- A section on benchmark overfitting and adaptive attackers.

### Sources

- AgentDojo.
- InjecAgent.
- CaMeL.
- NIST AI 600-1 Measure guidance.
- Official OpenAI agent-eval documentation.

### Follow-up path

Part 13 makes every failed case diagnosable through causal traces.

## Part 13: Trace Guardrail Bypasses and Boundary Hops

Working file: `src/content/docs/posts/2026-09-01-trace-guardrail-bypasses-boundary-hops.md`

Series order: 13

### Question

Where did unsafe state enter, which controls evaluated it, and how did it reach a side effect?

### Reader outcome

The reader can design privacy-aware audit events and reconstruct the first preventable control failure.

### Content arc

1. Start from the prohibited external outcome.
2. Define trace, run, turn, tool-call, handoff, approval, and policy identifiers.
3. Walk causal parent links backward.
4. Build a control ledger of expected versus observed checks.
5. Separate malicious input, first preventable failure, and contributing conditions.
6. Minimize content capture and protect audit data.
7. Build a synthetic incident timeline and causal graph.

### Code anchor

TypeScript audit-event types plus a reconstruction function that returns the effect span, first untrusted source, missing or failed controls, override path, and first preventable failure.

### Wrong first move

Logging raw prompts without decision, policy, tool, approval, or outcome lineage.

### Required evidence

- A complete synthetic trace for the support incident.
- A missing-authorization example.
- A classifier-timeout example.
- An approval-deception example.
- Redaction rules for secrets, personal data, and untrusted content.
- Tests for orphan spans, duplicate tool calls, and mismatched approval digests.

### Sources

- Official OpenAI observability guidance.
- Anthropic session-event documentation.
- NIST monitoring and incident guidance.
- OWASP logging and agent-security guidance.

### Follow-up path

Part 14 turns the trace into containment, remediation, regression evidence, and recurring review.

## Part 14: Incident Response and Continuous Improvement

Working file: `src/content/docs/posts/2026-09-01-ai-guardrail-incident-response.md`

Series order: 14

### Question

How should a team contain, reproduce, explain, fix, and regression-test a guardrail bypass?

### Reader outcome

The reader can run a guardrail incident from detection through safe restoration and convert the failure into a durable test.

### Content arc

1. Detect and preserve identifiers.
2. Contain tools, capabilities, destinations, sessions, and tokens.
3. Reproduce with fake tools before live systems.
4. Pin model, prompt, policy, tool definition, and SDK versions.
5. Write the causal explanation and control ledger.
6. Fix the enforcement boundary before patching wording.
7. Add deterministic and live-model regression cases.
8. Restore gradually and watch security plus utility.
9. Feed the pattern into threat models and release gates.

### Code anchor

A Markdown incident record backed by a small Python regression fixture. The fixture proves the original prohibited outcome cannot recur while the allowed support task still succeeds.

### Wrong first move

Adding the exact malicious phrase to a blocklist and closing the incident.

### Required evidence

- A causal timeline.
- First preventable failure and contributing-condition sections.
- Containment and revocation checklist.
- Minimized synthetic reproducer.
- Before-and-after security and utility results.
- A recurring review cadence for models, tools, policies, and datasets.

### Sources

- NIST AI RMF Manage guidance.
- OWASP agentic security and incident guidance.
- Vendor tracing and session documentation.

### Follow-up path

End with a compact production checklist and links back to every implementation and testing installment.

## Source baseline

Primary sources for the series:

### Standards and taxonomies

- [OWASP LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [OWASP Agentic AI Threats and Mitigations](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/)
- [OWASP AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html)
- [OWASP LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [NIST AI 600-1 Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [MITRE ATLAS](https://atlas.mitre.org/)

### Protocol and vendors

- [MCP specification `2025-11-25`](https://modelcontextprotocol.io/specification/2025-11-25)
- [Anthropic prompt-injection mitigation](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks)
- [Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/agent-setup)
- [OpenAI guardrails and human review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)
- [OpenAI integrations and observability](https://developers.openai.com/api/docs/guides/agents/integrations-observability)
- [OpenAI agent workflow evaluation](https://developers.openai.com/api/docs/guides/agent-evals)
- [Codex SDK](https://developers.openai.com/codex/sdk/)

### Research and benchmarks

- [AgentDojo](https://arxiv.org/abs/2406.13352)
- [InjecAgent](https://aclanthology.org/2024.findings-acl.624/)
- [CaMeL](https://arxiv.org/abs/2503.18813)

Use primary sources for technical claims. Secondary writing can supply examples or competing interpretations, but it cannot establish current SDK behavior.

## Cross-link map

### Existing topic pages

- `src/content/docs/topics/ai/prompt-engineering/prompt-injection-defense.md`
- `src/content/docs/topics/ai/coding-tool-blindspots/prompt-injection.md`
- `src/content/docs/topics/ai/harness-development/permission-models.md`
- `src/content/docs/topics/ai/harness-development/tool-design.md`
- `src/content/docs/topics/ai/benchmarks/evaluation-and-methods.md`
- `src/content/docs/topics/ai/benchmarks/agent-benchmarks.md`

### Existing posts and series

- `src/content/docs/posts/2026-05-23-grok-morse-code-prompt-injection.md`
- `src/content/docs/posts/2026-07-19-mcp-tool-design-for-models.md`
- `src/content/docs/posts/2026-07-19-build-mcp-client-model-loop.md`
- `src/content/docs/posts/2026-07-19-remote-mcp-production-security.md`
- `src/content/docs/posts/2026-07-23-agentic-systems-need-ontologies.md`
- `src/content/docs/posts/2026-07-24-claude-code-clean-room-agent-internals.md`
- `src/content/docs/posts/series/mcp-server-design/index.mdx`

Every post should link to two to five relevant neighbors. Do not include the whole list mechanically in every article.

## Execution checklist

This checklist is the execution ledger for the series. Check an item only after the named artifact or validation evidence exists. A wave is complete only when every child item is checked, its commit is pushed, and the remote state is confirmed.

### Series prerequisites

- [x] Complete the private research baseline. Evidence: `docs/research/2026-09-01-ai-guardrails-series-research.md`, 1,062 lines, local and ignored by design.
- [x] Complete and push the decision-ready series plan. Evidence: commit `5b06f9f` on `origin/main`.
- [x] Install a user-wide plan execution skill. Evidence: `/Users/weylinwagnon/.agents/skills/track-plan-execution/SKILL.md` passes `quick_validate.py`.
- [x] Commit and push this execution checklist before authoring Wave 1. Evidence: commit `f5c37c6` pushed to `origin/main`.

### Wave 1: Foundations

#### Part 1: Guardrails Are Systems, Not Prompts

- [x] Create `src/content/docs/posts/2026-09-01-ai-guardrails-are-systems-not-prompts.md` with quoted frontmatter, stable tags, canonical URL, series slug, and order 1. Evidence: frontmatter in the created file includes the quoted description, canonical route, series slug, and order 1.
- [x] Open with the support assistant following an injected instruction. Evidence: the opening ticket combines a billing request with an embedded instruction to disclose an internal note.
- [x] Separate unsafe model text from an external side effect. Evidence: `The first boundary is text versus effect` distinguishes drafting, account reads, sends, and release controls.
- [x] Define influence, detection, enforcement, explanation, and recovery. Evidence: `Five jobs hide behind one word` defines all five jobs and their authority.
- [x] Map controls to ingress, context, inference, tool, execution, and egress boundaries. Evidence: `Put controls where the facts exist` contains the six-stage ASCII pipeline and boundary explanation.
- [x] Establish that model output is a proposal subject to host policy. Evidence: the opening rule and `runSupportTurn` route every proposal through `evaluatePolicy` before execution.
- [x] Define guardrail bypass, failure propagation, and the informal term guardrail hop without overstating them. Evidence: `Use precise failure names` defines all three and labels guardrail hop as informal.
- [x] Show the unsafe direct-dispatch pipeline and the safe `proposeAction` plus `evaluatePolicy` pipeline. Evidence: `runUnsafeTurn` dispatches directly, while `runSupportTurn` separates proposal, policy, and execution.
- [x] Include a test proving a blocked proposal never reaches the executor. Evidence: `blockedProposalNeverExecutes` asserts `executor.calls.length === 0` and is invoked at top level.
- [x] Include an ASCII diagram of the layered pipeline. Evidence: `Put controls where the facts exist` contains an ASCII-only boundary diagram.
- [x] Include a table that distinguishes the five guardrail jobs. Evidence: the five-row job table records purpose, examples, and effect-stopping authority.
- [x] Ground claims in the listed OWASP, NIST, Anthropic, and OpenAI primary sources. Evidence: the References section links OWASP LLM01, NIST AI RMF and AI 600-1, Anthropic research, and OpenAI guardrail documentation.

#### Part 2: Threat-Model an AI Application

- [x] Create `src/content/docs/posts/2026-09-01-threat-model-ai-application.md` with quoted frontmatter, stable tags, canonical URL, series slug, and order 2. Evidence: frontmatter in the created file includes the quoted description, canonical route, series slug, and order 2.
- [x] Inventory the support workflow's assets, actors, data classes, tools, destinations, and state. Evidence: `Ask what the system can change`, the workflow map, and `ThreatBoundary` cover each inventory category.
- [x] Mark trusted, mixed, and untrusted sources. Evidence: the data-flow map labels the trusted control plane, mixed-trust context, and untrusted ticket source.
- [x] Cover direct, indirect, tool, memory, and handoff entry points. Evidence: `Mark every entry point` enumerates user, retrieved, tool, memory, handoff, approval, and coding-agent channels.
- [x] Separate model compromise from system impact. Evidence: `Separate compromise from impact` traces behavior change through capability and policy failures to a prohibited effect.
- [x] Explain the risk created by private data, untrusted content, and external communication in one workflow. Evidence: `The dangerous combination` names all three conditions and shows how to break each edge.
- [x] Turn prohibited outcomes into control requirements and release tests. Evidence: the threat table maps threats to prohibited outcomes, control requirements, and evidence.
- [x] Implement the `ThreatBoundary` inventory and reject boundaries missing ownership or destination facts. Evidence: `validateThreatBoundary` returns `MISSING_OWNER` and `MISSING_DESTINATION_INVENTORY`, with executable assertions.
- [x] Include an ASCII data-flow diagram for the support workflow. Evidence: `Map the support workflow` contains an ASCII trust-boundary and capability flow.
- [x] Include a threat table for direct injection, indirect injection, tool poisoning, confused deputy, memory poisoning, approval deception, and cost abuse. Evidence: the seven-row threat table covers every named case.
- [x] Map at least one prohibited outcome to one deterministic release test. Evidence: `releaseIfAllowed` blocks restricted data to an unapproved destination and proves the fake sink records zero releases.
- [x] Ground claims in the listed OWASP, MITRE ATLAS, NIST, and existing repo sources. Evidence: References link OWASP agent and injection guidance, MITRE ATLAS, and NIST AI 600-1, with four internal related-topic links.

#### Part 3: Design a Layered Guardrail Architecture

- [x] Create `src/content/docs/posts/2026-09-01-layered-ai-guardrail-architecture.md` with quoted frontmatter, stable tags, canonical URL, series slug, and order 3. Evidence: frontmatter in the created file includes the quoted description, canonical route, series slug, and order 3.
- [x] Build the identity, input, context, tool, authorization, execution, and output control stack. Evidence: `One pipeline, several enforcement points` maps the complete control path.
- [x] Define fail-closed, fail-open, quarantine, and degraded behavior. Evidence: `Define failure behavior before production` defines all four modes and where they fit.
- [x] Separate syntactic validation, semantic policy, and authorization. Evidence: `Separate validation, policy, and authorization` asks and answers the three independent questions.
- [x] Define stable decision and audit contracts. Evidence: `GuardrailDecision` and `GuardrailAuditEvent` provide stable actions, reason codes, policy versions, layers, and outcomes.
- [x] Explain time-of-check to time-of-use drift. Evidence: `Recheck at execution time` covers changed state, expired approval, revoked permission, normalized argument binding, and reauthorization.
- [x] Explain policy versioning and rollback. Evidence: `Version policy and rollback independently` records decision versions and separates policy rollback from model and prompt changes.
- [x] Implement composable TypeScript guardrails and a policy gate over authenticated identity and normalized arguments. Evidence: the guardrail stack evaluates a `GuardrailContext` containing actor, tenant, authorized accounts, source trust, policy version, and normalized proposal.
- [x] Include a table of layer, available facts, possible decisions, failure behavior, and evidence. Evidence: `Match each layer to its facts` contains the required five-column table.
- [x] Test allow, block, ask, quarantine, timeout, and unknown-policy behavior. Evidence: `guardrailDecisionTests` covers all six paths and is invoked at top level.
- [x] Show a schema-valid request that authorization still blocks. Evidence: the opening credit and cross-tenant draft are well shaped but fail tenant and account authorization.
- [x] Ground claims in the listed NIST, OWASP, OpenAI, and Anthropic primary sources. Evidence: References link NIST AI RMF, OWASP agent guidance, OpenAI guardrail documentation, and Anthropic research.

#### Part 4: Prompt Injection and Control-Data Separation

- [x] Create `src/content/docs/posts/2026-09-01-prompt-injection-control-data-separation.md` with quoted frontmatter, stable tags, canonical URL, series slug, and order 4. Evidence: frontmatter in the created file includes the quoted description, canonical route, series slug, and order 4.
- [x] Distinguish jailbreaks, direct injection, and indirect injection. Evidence: `Three related attacks have different entry points` defines and locates all three.
- [x] Trace an injection from untrusted ticket text to a tool proposal. Evidence: `Trace influence all the way to an effect` follows the ticket through context, proposal, destination selection, and disclosure.
- [x] Explain why delimiters and classifiers are partial controls. Evidence: `Delimiters and classifiers are partial controls` covers paraphrase, encoding, split, multi-turn, false-block, and missed-attack limits.
- [x] Preserve source, trust, and data classification outside content strings. Evidence: `ContentEnvelope` stores `sourceId`, `sourceType`, `trust`, and `dataClasses` in application-owned metadata.
- [x] Introduce capability-scoped execution and CaMeL's control-data direction. Evidence: `Capabilities come from the host, not the ticket` explains the CaMeL direction and implements host-selected capabilities.
- [x] Explain residual risk and task-coverage tradeoffs. Evidence: `Control-data separation has a cost` covers declassification, approval, task coverage, policy bugs, and permitted-action risk.
- [x] Replace unsafe string concatenation with structured tool results carrying provenance metadata. Evidence: `buildUnsafePrompt` is followed by `TicketToolResult` and `ContentEnvelope`.
- [x] Enforce an action policy that does not derive capabilities from instructions inside untrusted content. Evidence: `evaluateAction` reads only host policy, known-source records, normalized action, and verified destination.
- [x] Test plain, paraphrased, encoded, split, and multi-turn synthetic injections. Evidence: `injectionCases` covers all five variants, blocks each proposal, and proves zero fake-executor calls.
- [x] Test benign hard negatives that discuss prompt injection without attempting one. Evidence: `benignDiscussion` mentions prompt injection, allows a draft, and records one fake draft effect.
- [x] State clearly that provenance labels can guide a model while application metadata supports enforcement. Evidence: the statement appears directly after the structured ticket result.
- [x] Ground claims in the listed OWASP, Anthropic, AgentDojo, InjecAgent, and CaMeL sources. Evidence: References link all five source families directly.

#### Wave 1 landing page and discovery

- [x] Create `src/content/docs/posts/series/engineering-ai-guardrails/index.mdx` with the planned title, quoted description, and hidden sidebar entry. Evidence: the created landing page matches the planned frontmatter and sets `sidebar.hidden: true`.
- [x] State the series argument and reader outcomes on the landing page. Evidence: the opening states the layered-systems argument and `What you will be able to do` lists six outcomes.
- [x] Explain the fictional support workflow and the version-baseline policy. Evidence: `The running workflow` and `Version baseline` define both.
- [x] List only the four published Wave 1 posts in reading order. Evidence: `Published reading order` contains Parts 1 through 4 and no future post links.
- [x] Add related links to prompt injection, permission models, benchmarks, and MCP. Evidence: the four-item Related topics section covers each required neighbor.
- [x] Add the series to `src/content/docs/posts/index.mdx`. Evidence: the first Post series entry links `./series/engineering-ai-guardrails/`.
- [x] Add the series to `src/content/docs/posts/series/index.mdx`. Evidence: the Long-form series list links `./engineering-ai-guardrails/`.

#### Wave 1 shared quality review

- [x] Keep terminology, `GuardrailDecision` semantics, data classes, support-domain facts, and tool names consistent across all four posts. Evidence: manual cross-post review confirmed common allow, block, ask, quarantine semantics; public, internal, and restricted classes; and the same support ticket, account, reply, recipient, tenant, and credit vocabulary.
- [x] Confirm no post claims that prompt injection is solved or describes influence or detection as enforcement. Evidence: Parts 1 and 4 explicitly reject a solved-injection claim, and Part 1's five-job table separates influence and detection from enforcement.
- [x] Confirm every post opens with a concrete failure or engineering decision and defines its boundary. Evidence: the openings cover an injected ticket, a classifier with missing tenancy, a schema-valid cross-tenant credit, and untrusted text selecting a send.
- [x] Confirm every post contains one central working code anchor and at least one test that affects execution. Evidence: final extracted suites execute in all four posts and assert zero effects for blocked proposals or releases; Part 4 also asserts one allowed fake draft effect.
- [x] Confirm every post explains tradeoffs, residual risk, and common failure modes. Evidence: all four posts contain explicit tradeoff or residual-risk discussion and a `Common failure modes` section.
- [x] Confirm every post cites primary references and links to two to five relevant internal neighbors. Evidence: each References section uses primary standards, vendor documentation, or papers, and each Related topics section contains four internal links.
- [x] Confirm previous and next links point only to published series parts. Evidence: Parts 1 through 3 link adjacent published parts, Part 4 links only Part 3, and every post links the published landing page.
- [x] Confirm public pages contain no plan headings, future-file TODOs, attack payload galleries, raw private content, universal thresholds, or mechanical source piles. Evidence: manual published-content review and `npm run validate:published-content` found no internal scaffolding or prohibited residue.
- [x] Confirm every unsafe example uses fake executors and cannot perform a real external write. Evidence: executed examples use only in-memory recording executors and `example.invalid` destinations; no network or service client appears in the Wave 1 code.

#### Wave 1 code and site validation

- [x] Extract or mirror the Wave 1 TypeScript examples into a temporary validation directory. Evidence: `.tmp-guardrails-wave1` held one extracted TypeScript module per post, containing 3, 3, 3, and 4 fenced blocks.
- [x] Type-check the central Wave 1 TypeScript examples with the repo toolchain. Evidence: `npx tsc --noEmit --strict --target ES2022 --module NodeNext --moduleResolution NodeNext --types node .tmp-guardrails-wave1/*.ts` exited 0.
- [x] Run the included deterministic tests for the Wave 1 examples. Evidence: all four extracted modules ran with the local `tsx` binary and exited 0 after top-level test invocation.
- [x] Delete temporary validation artifacts and confirm no local-only files remain. Evidence: the five temporary files were removed, `rmdir` succeeded, and `test ! -e .tmp-guardrails-wave1` printed `temporary-validation-clean`.
- [x] Run the forbidden credential-pattern and em-dash scans over touched files. Evidence: `bash scripts/check-secrets.sh` passed and the U+2014 scan returned no matches across all touched Wave 1 files.
- [x] Run `npm run validate:style`. Evidence: final Wave 1 run exited 0 with `Style validation passed.`
- [x] Run `npm run validate:code-examples`. Evidence: final Wave 1 run exited 0 with fence tags and source syntax checked.
- [x] Run `npm run validate:published-content`. Evidence: final Wave 1 run exited 0 with `Published content review passed.`
- [x] Run `npm run build` after every Wave 1 file-change batch. Evidence: builds passed after each post, the landing and discovery batch, test refinements, tradeoff additions, and checklist evidence batches; the final build generated 786 pages with zero Astro diagnostics.
- [x] Run `npm run validate:links` against the final Wave 1 build. Evidence: final Wave 1 run checked 786 HTML pages and passed.
- [x] Inspect the rendered posts index and series landing route. Evidence: local Astro preview returned HTTP 200 HTML for the posts index, series index, landing page, and all four posts; rendered markers confirmed the series link, outcomes, reading order, and post titles.
- [x] Run `npm run validate:pre-push`. Evidence: the full gate passed secret, style, published-content, generated-output, React, Swift, MCP companion, coding-problem, code-example, build, 786-page, link, custom-page, and browser validation tiers.
- [x] Commit the Wave 1 implementation and checklist evidence. Evidence: commit `83c3f27` (`Publish AI guardrails foundations`).
- [x] Push the Wave 1 commit and confirm `origin/main`. Evidence: push advanced `origin/main` from `f5c37c6` to `83c3f27`, and local HEAD matches the remote-tracking ref.
- [x] Mark Wave 1 complete only after every Wave 1 item has evidence and is checked. Evidence: all 80 Wave 1 checklist items are checked with evidence after commit and push confirmation.

### Wave 2: Application surfaces

#### Part 5: Guardrails for Production Chatbots

- [x] Create `src/content/docs/posts/2026-09-01-production-chatbot-guardrails.md` with quoted frontmatter, stable tags, canonical URL, series slug, and order 5. Evidence: the built post has quoted description frontmatter, five stable tags, the production URL, series slug `engineering-ai-guardrails`, and order 5.
- [x] Start with the text-only support chatbot and add caller identity, limits, and normalized input validation. Evidence: the opening boundary and normalization sections require verified actor and tenant facts, quotas, length limits, Unicode normalization, and authorized account lookup.
- [x] Add structured model screening with explicit uncertainty behavior. Evidence: the post defines a small screen schema and maps uncertain, timeout, block, and allow results to named behaviors.
- [x] Add structured output and egress checks. Evidence: `Draft` constrains the response, while `release` checks citations, forbids actions, redacts synthetic secret markers, and caps output before release.
- [x] Cover refusal, appeal, throttling, and repeated-abuse behavior. Evidence: the refusal and abuse section covers safe alternatives, appeals, authenticated history, warnings, throttling, temporary suspension, and human review.
- [x] Measure false refusals and latency. Evidence: the utility section defines false-refusal, appeal, degraded-mode, latency percentile, redaction, and repeated-abuse measures.
- [x] Implement parallel TypeScript and Python handlers with deterministic checks before optional screening and output policy before release. Evidence: both handlers implement the same ordered boundary and ran locally with fake adapters at exit code 0.
- [x] Test malformed input, policy violations, safe technical discussion, classifier timeout, and output redaction. Evidence: executable TypeScript assertions cover all five cases; the Python timeout and redaction assertion also passed.
- [x] Include a latency budget for parallel and blocking checks. Evidence: the latency table assigns p95 budgets, parallel eligibility, and release-blocking status to each stage.
- [x] Distinguish content moderation, injection detection, and application authorization in a table. Evidence: the three-row control table states each question, evidence, and non-substitutable boundary.
- [x] Ground claims in the listed Anthropic, OpenAI, and OWASP primary sources. Evidence: references link current official Anthropic injection guidance, OpenAI moderation and safety guidance, and OWASP LLM01 and LLM02 pages; each URL was re-opened on 2026-09-01.

#### Part 6: Tool Calls, Approvals, and Least Privilege

- [x] Create `src/content/docs/posts/2026-09-01-ai-tool-calls-approvals-least-privilege.md` with quoted frontmatter, stable tags, canonical URL, series slug, and order 6. Evidence: the built post contains the required quoted description, tags, canonical URL, series slug, and order 6.
- [x] Separate read, draft, send, credit, and administrative capabilities. Evidence: the opening capability table separates all five by example, effect, and default decision.
- [x] Define strict schemas and semantic invariants. Evidence: the validation section defines closed shapes, formats, destination, tenant, amount, workflow, and capability invariants; the executable union and validators enforce the central subset.
- [x] Normalize tool arguments before policy evaluation. Evidence: `normalize` canonicalizes account identifiers, Unicode body text, whitespace, and email case before authorization or approval.
- [x] Authorize every resource and destination. Evidence: `authorize` checks the account allowlist and the exact verified destination, then runs again at the execution boundary.
- [x] Render approvals from validated facts and bind them to an action digest and expiration. Evidence: the approval-deception example shows canonical fields, while `digest` and `verifyApproval` bind actor, tenant, workflow, policy, action, arguments, decision, and expiration.
- [x] Revalidate at execution and use idempotency keys. Evidence: the executor path repeats authorization immediately before deriving a workflow-scoped idempotency key; the prose lists mutable facts to reload after approval pauses.
- [x] Implement `executeToolProposal` over validation, authorization, approval, and a fake executor. Evidence: the central TypeScript example implements the full gate over a recording executor and ran locally at exit code 0.
- [x] Prove no executor call follows validation, authorization, or approval failure. Evidence: executable assertions check `calls.length === 0` after invalid identifiers, unauthorized accounts, unauthorized destinations, and approval-binding mismatch.
- [x] Test cross-tenant account access. Evidence: the `ACCOUNT_EXAMPLE_99` fixture is absent from the caller's tenant-scoped allowlist and fails with `ACCOUNT_NOT_AUTHORIZED` before execution.
- [x] Show approval deception exposed by canonical fields. Evidence: the post contrasts a friendly model summary with the actual outside destination, and the destination test blocks the mismatch.
- [x] Prove retries cannot duplicate a side effect. Evidence: two identical approved calls return the same effect ID while the fake executor records exactly one effect.
- [x] Ground claims in the listed OWASP, OpenAI, and existing MCP sources. Evidence: references include current OWASP Excessive Agency, official OpenAI human review, tool, and guardrail guides, plus the existing MCP tool-design post.

#### Part 7: Guardrails for MCP Clients and Servers

- [x] Recheck the current stable MCP specification and record the selected version before authoring. Evidence: official specification and release pages confirm `2026-07-28` is stable; the plan and post baseline were updated from the superseded `2025-11-25` assumption.
- [x] Create `src/content/docs/posts/2026-09-01-mcp-client-server-guardrails.md` with quoted frontmatter, stable tags, canonical URL, series slug, and order 7. Evidence: the built post contains the required quoted description, tags, canonical URL, series slug, and order 7.
- [x] Map host, client, server, authorization server, and protected resource boundaries. Evidence: the opening ASCII flow and role definitions map all five parties, credentials, policy ownership, and downstream-token separation.
- [x] Treat remote tool definitions and annotations as untrusted hints. Evidence: the definition section applies this rule to the entire model-facing definition and explicitly denies authorization authority to `readOnlyHint`, `destructiveHint`, `idempotentHint`, and `openWorldHint`.
- [x] Cover pinning, review, and diffing of tool definitions. Evidence: the five-step definition workflow canonicalizes, digests, reviews, diffs, and quarantines definitions by canonical server identity.
- [x] Validate and label tool results. Evidence: the host wrapper enforces byte and structural limits, labels source, trust, and data class, and quarantines suspicious model-facing text while preserving audit evidence.
- [x] Bind tokens to resource and audience, prevent token passthrough, and prevent session identity mixing. Evidence: the post follows MCP resource and audience requirements, requires separate downstream credentials, and tests host-owned application state against authenticated actor and tenant; it also explains that MCP `2026-07-28` retired protocol sessions.
- [x] Evaluate dangerous tool combinations and data movement. Evidence: the combination table covers public and private reads, internal drafts, external sends, credits, broad file reads, and open-world writes.
- [x] Add limits, timeouts, audit events, and revocation. Evidence: the operations section covers per-identity quotas, bytes, concurrency, calls, redirects, retries, wall time, cancellation limits, revocation targets, and linked audit fields.
- [x] Implement a TypeScript MCP host wrapper that checks definitions, applies per-tool policy, labels results, and records server and definition versions. Evidence: `callMcpTool` pins a definition digest, checks identity and token facts, applies resource and approval policy, validates results, and records server URI plus definition digest; it ran locally at exit code 0.
- [x] Test changed descriptions, oversized results, hostile text, wrong token audience, and cross-session state. Evidence: executable assertions cover all five cases and assert transport-call counts or quarantine evidence at the appropriate boundary.
- [x] Include a tool-combination table for private read plus external write. Evidence: the table assigns `ask` to private-ticket read plus external send and `deny or isolate` to broad-file read plus arbitrary HTTP write.
- [x] Cross-link the MCP Server Design series instead of repeating the protocol lifecycle. Evidence: the version baseline and related topics link the series, production-security post, and tool-design post while this page stays focused on trust and enforcement boundaries.
- [x] Keep code in the post unless a documented snippet-testability gap requires a separate feature decision. Evidence: the complete wrapper and deterministic tests remain in the post; no companion or generator changes were needed.

#### Part 8: Agents, Delegation, and Guardrail Propagation

- [x] Create `src/content/docs/posts/2026-09-01-agent-delegation-guardrail-propagation.md` with quoted frontmatter, stable tags, canonical URL, series slug, and order 8. Evidence: the built post contains the required quoted description, tags, canonical URL, series slug, and order 8.
- [x] Compare manager-as-tool, handoff, and independent-worker orchestration. Evidence: the opening table compares control ownership, state movement, appropriate use, and security pressure across all three patterns.
- [x] Identify endpoint-only guardrails and the gaps they leave inside a workflow. Evidence: the endpoint-only section identifies internal handoffs, summaries, memory writes, and child tool calls, then assigns controls to each boundary.
- [x] Define a typed handoff envelope. Evidence: `HandoffEnvelope` separates task, host constraints, untrusted inputs, tools, data classes, budgets, policy, lineage, and cancellation.
- [x] Reduce authority for delegated work and apply tool policy at every child invocation. Evidence: `deriveChildEnvelope` rejects capability, data-class, and budget escalation; `runChildTool` rechecks cancellation, capability, budget, and the exact resource.
- [x] Protect shared memory and summaries from handoff laundering. Evidence: summaries are appended as `agent-summary` values under `untrustedInputs`, while the memory section specifies provenance, write proposals, reader authorization, expiry, and rebuilding.
- [x] Link parent and child traces, budgets, cancellation, and outcomes. Evidence: the envelope and trace events carry parent trace and span IDs, task, bounded budgets, and cancellation identity; the operations section covers outcome and effect reconciliation.
- [x] Implement `HandoffEnvelope` and allow child runners to derive only narrower capabilities. Evidence: the central TypeScript example implements the envelope and monotonic derivation and ran locally at exit code 0.
- [x] Property-test that child capability is a subset of parent capability. Evidence: an executable exhaustive property test covers all 256 parent and child set combinations across four capabilities and accepts only subsets.
- [x] Test handoff laundering, child tool denial, and linked trace events. Evidence: executable assertions keep the laundering string out of trusted constraints, deny the credit tool with zero executor calls, and verify the linked parent trace and span.
- [x] Include an ASCII diagram of parent, handoff, child, tool, and result paths. Evidence: the diagram shows parent, policy gate, child, child tool policy, fake tool, trace event, validated result, and final parent policy.
- [x] Ground claims in the listed OpenAI, Anthropic, and OWASP primary sources. Evidence: references link official OpenAI orchestration, handoff, and workflow-boundary guidance, Anthropic multi-agent engineering and Managed Agents docs, and OWASP Agentic Top 10 2026.

#### Wave 2 landing page and shared quality review

- [x] Add Parts 5 through 8 to the landing page in order, using only working links. Evidence: the published reading order now lists Parts 1 through 8 and links each new title to its built route.
- [x] Keep terminology, support-domain facts, tool names, decision semantics, and policy boundaries consistent across Wave 2. Evidence: all four posts use the same fictional support tenant, account, verified destination, ticket, draft, send, and credit boundary with host-owned allow, ask, block, quarantine, and degraded decisions.
- [x] Confirm every side-effecting example has a pre-execution policy check and a fake executor. Evidence: Parts 6 through 8 place authorization, approval, capability, resource, and cancellation checks before recording executors or fake transports; Part 5 has no side-effecting tool.
- [x] Confirm MCP examples match the selected stable specification. Evidence: Part 7 records and follows MCP `2026-07-28`, including stateless requests, retired protocol sessions, current authorization, untrusted annotations, result validation, and tool-operation guidance.
- [x] Confirm handoffs preserve lineage and reduce capability. Evidence: Part 8 carries parent trace and span identifiers, rejects wider tool, data, and budget requests, and exhaustively tests the capability subset invariant.
- [x] Confirm no Wave 2 post repeats the MCP protocol introduction. Evidence: Part 7 gives only the boundary and current-version delta needed for security decisions, then links the existing MCP Server Design series for lifecycle and protocol teaching; the other Wave 2 posts do not introduce MCP.
- [x] Apply every shared per-post content quality gate from Wave 1 to Parts 5 through 8. Evidence: manual cross-post review confirmed concrete failure openings, defined boundaries, working central examples, effect assertions, tradeoffs, residual risk, common failures, primary references, two to five internal neighbors, published-only navigation, fake effects, and no solved-injection or enforcement-confusion claims; automated style and published-content gates passed.

#### Wave 2 code and site validation

- [x] Extract or mirror central Wave 2 TypeScript and Python examples into a temporary validation directory. Evidence: `/private/tmp/guardrails-wave2` held one extracted TypeScript module per post, the Part 5 Python handler, and a module-type manifest.
- [x] Type-check TypeScript and parse or run Python examples with fake adapters. Evidence: strict `tsc` with NodeNext and Node types passed all four modules after correcting one union-narrowing defect; the extracted Python handler ran with its fake callbacks at exit code 0.
- [x] Run included deterministic Wave 2 tests. Evidence: all four TypeScript modules ran with the local `tsx` binary at exit code 0, covering chatbot decisions, executor effects, MCP trust failures, and delegation properties; the Python assertion also passed.
- [x] Delete temporary validation artifacts and confirm no local-only files remain. Evidence: each extracted file and manifest was unlinked, the temporary directory was removed, `test ! -e` printed `temporary-validation-clean`, and git status lists only intended Wave 2 files.
- [x] Run the forbidden credential-pattern and em-dash scans over touched files. Evidence: `bash scripts/check-secrets.sh` passed and the U+2014 scan passed across all seven touched files.
- [x] Run `npm run validate:style`. Evidence: final Wave 2 run exited 0 with `Style validation passed.`
- [x] Run `npm run validate:code-examples`. Evidence: final Wave 2 run exited 0 with fence tags and source syntax checked.
- [x] Run `npm run validate:published-content`. Evidence: final Wave 2 run exited 0 with `Published content review passed.`
- [x] Run `npm run build` after every Wave 2 file-change batch. Evidence: builds passed after each new post, navigation update, checklist batch, landing-page batch, and strict-TypeScript correction; the latest build generated 790 pages with zero Astro diagnostics.
- [x] Run `npm run validate:links` against the final Wave 2 build. Evidence: the final link validator checked 790 HTML pages and passed.
- [x] Inspect every new route and the updated series landing page. Evidence: local Astro preview returned HTTP 200 and expected rendered title markers for the posts index, series landing, and Parts 5 through 8; the preview process was stopped afterward.
- [x] Run `npm run validate:pre-push`. Evidence: the full gate passed secret, style, published-content, generated-output, React, Swift, MCP companion, coding-problem, code-example, build, 790-page, link, custom-page, and browser validation tiers.
- [x] Commit the Wave 2 implementation and checklist evidence. Evidence: commit `85c2590` (`Publish AI guardrails application surfaces`) contains Parts 5 through 8, navigation updates, and the verified checklist evidence.
- [x] Push the Wave 2 commit and confirm `origin/main`. Evidence: `git push origin main` advanced the remote from `ebf4107` to `85c2590`; local `HEAD` and `origin/main` both resolved to `85c25901ac7dcf6804f958481cd975286b9cec5e` afterward.
- [x] Mark Wave 2 complete only after every Wave 2 item has evidence and is checked. Evidence: every Wave 2 content, shared-quality, code-validation, site-validation, commit, and push line above is checked with specific evidence; Wave 2 is complete.

### Wave 3: Vendor implementations

#### Part 9: Claude API and Agent SDK Guardrails

- [x] Recheck all named Anthropic documentation on the authoring day. Evidence: rechecked the official Messages API, tool-use loop, Agent SDK permission, Agent SDK hook, Python SDK, Managed Agents permission, event, setup, session, operation, and migration documentation on September 1, 2026; the post links the primary references it relies on.
- [x] Record exact SDK versions, API status, and Managed Agents beta status. Evidence: the version table records `anthropic==1.3.0`, `@anthropic-ai/sdk@0.123.0`, `claude-agent-sdk==0.2.151`, `@anthropic-ai/claude-agent-sdk@0.3.258`, and the `managed-agents-2026-04-01` beta header, with Alpha, pre-1.0, and beta labels where applicable.
- [x] Create `src/content/docs/posts/2026-09-01-claude-api-agent-sdk-guardrails.md` with quoted frontmatter, stable tags, canonical URL, series slug, and order 9. Evidence: the created page contains a quoted description, stable tags, its canonical route, `engineering-ai-guardrails`, and series order 9.
- [x] Show a Messages API tool loop with third-party content in `tool_result` blocks. Evidence: `run_support_turn` consumes client `tool_use` blocks, executes the fake ticket reader after authorization, and returns labelled third-party content in matching user-side `tool_result` blocks.
- [x] Preserve source and trust metadata in application state. Evidence: the host-owned `Evidence` record stores source ID, tenant, trust class, classification, original content, tool-use ID, and policy version outside the model message.
- [x] Add structured injection screening as detection rather than authorization. Evidence: `screen_untrusted_text` returns a structured decision and detector, while the surrounding explanation states that its label cannot change ticket capability, destination, or external-effect approval.
- [x] Add Agent SDK tool permission logic and enforceable pre-tool and post-tool hooks. Evidence: `decide_agent_tool`, `can_use_tool`, `PreToolUse`, and the ticket-scoped `PostToolUse` hook demonstrate policy, pre-execution denial or review, and schema-aware result labelling.
- [x] Map controls to Managed Agents permission policies and confirmation events. Evidence: the Managed Agents section configures explicit `always_ask`, disables write, edit, and shell tools, restricts web fetch, and creates canonical `user.tool_confirmation` events.
- [x] Explain session evidence, agent versions, and beta limitations. Evidence: `Pin sessions to evidence, not just an agent name` lists version, environment, session, event, permission, approval, custom-tool, SDK, and beta evidence, then explains session-local configuration drift.
- [x] Implement credential-free Python snippets for Messages API, Agent SDK, and Managed Agents. Evidence: all five Python fences use fakes, pure policy, configuration dictionaries, and callbacks without API keys or live service calls; they parsed and the combined examples ran against the pinned SDKs.
- [x] Test application permission callbacks without live credentials. Evidence: `test_agent_policy` checks scoped reads, path escape, tenant ticket access, destination denial, and shell denial; `test_callbacks` asserts a pre-hook denial and post-hook injection label without launching Claude.
- [x] Include a mock tool result with a safe synthetic injection. Evidence: `FakeTickets` returns a fictional sentence asking the assistant to ignore support policy and change destination, using only `example.invalid` data and an in-memory fake.
- [x] Map each vendor control to layer, enforcement authority, and limitation. Evidence: `Map each control to its real authority` covers ten prompt, detector, loop, permission, hook, Managed Agents, and custom-tool controls across all three required columns.
- [x] State exclusions and uncovered Claude tool paths explicitly. Evidence: `Know what this post does not cover` enumerates Messages server tools, callback shadowing, post-execution limits, settings hooks, subagents, client custom tools, beta drift, and detector limits.

#### Part 10: OpenAI Agents SDK and Codex SDK Guardrails

- [x] Recheck all named official OpenAI and Codex documentation on the authoring day. Evidence: rechecked the official Agents SDK guardrail, human-review, result, and tracing references plus the official Codex TypeScript README, options, thread, and event sources on September 1, 2026.
- [x] Record exact SDK versions, API status, and beta status. Evidence: the version table records `openai-agents==0.22.0`, the Responses API default path, `@openai/codex-sdk@0.152.1`, matching `@openai/codex@0.152.1`, and the excluded `0.153.0-alpha.4` and hosted multi-agent beta surfaces.
- [x] Create `src/content/docs/posts/2026-09-01-openai-agents-codex-sdk-guardrails.md` with quoted frontmatter, stable tags, canonical URL, series slug, and order 10. Evidence: the created page contains a quoted description, stable tags, its canonical route, `engineering-ai-guardrails`, and series order 10.
- [x] Implement an input guardrail and explain blocking versus parallel execution. Evidence: `support_input_boundary` uses `run_in_parallel=False`, and the adjacent explanation contrasts its start guarantee with the default parallel mode's latency and possible early model or tool work.
- [x] Implement supported custom-tool input and output guardrails. Evidence: the `function_tool` example attaches `send_reply_policy` and `send_reply_result_policy`, validates canonical arguments before execution, and validates the synthetic effect receipt afterward.
- [x] Explain endpoint-only input and output coverage in multi-agent workflows. Evidence: the coverage map and custom-tool section state that agent input guards only the first workflow agent and output guards only the final producing agent, not each handoff or internal proposal.
- [x] Add human review for side-effecting support tools. Evidence: `send_reply` sets `needs_approval=True`, the prose distinguishes pre-approval from post-approval checks, and the HITL section covers interruptions, serialized run state, reviewer evidence, resume, and freshness revalidation.
- [x] Emit trace metadata and custom policy spans. Evidence: the trace example emits a synthetic group ID, policy version, tool name, decision, and argument digest inside a named custom policy span, while the host harness records linked trace and span IDs.
- [x] Wrap a synthetic Codex SDK task with repository, execution, network, time, and event boundaries. Evidence: the real wiring pins working directory, workspace-write, untrusted approval, no network, disabled web search, no extra directories, a 30-second abort, minimized events, a reduced environment, and disabled history persistence.
- [x] State which hosted, built-in, handoff, and SDK paths require separate enforcement. Evidence: the approval-path list and `State uncovered paths explicitly` separate handoffs, hosted tools, built-in execution tools, direct agent-as-tool calls, later agents, hosted shell and multi-agent paths, streamed events, CLI environment, cancellation, plugins, and MCP.
- [x] Keep Python OpenAI Agents SDK and TypeScript Codex SDK examples credential-free. Evidence: the Python examples construct guardrails and run fake executors with no model request, while the real Codex snippet is not executed and the runnable TypeScript suite uses fake process, thread, deadline, and event adapters.
- [x] Test blocking input behavior and pre-executor custom-tool policy. Evidence: the input guardrail is explicitly blocking; the runnable host-policy suite sends an unauthorized destination, expects `PermissionError`, and proves `executor.calls` remains empty before exercising the allowed path.
- [x] Assert trace guardrail results and tool lineage. Evidence: `test_host_policy` checks the block decision, the immediately preceding allowed tool-input event, and the executor event's parent span link; the post explains the SDK's four guardrail-result lists.
- [x] Test Codex host policy with fake process and event adapters where supported. Evidence: the standalone TypeScript suite asserts exact thread settings, successful in-repository events, deadline expiration, and outside-repository file-change detection; strict type checking and `tsx` execution both exited 0.
- [x] State exclusions and uncovered OpenAI or Codex tool paths explicitly. Evidence: separate lists enumerate the Agents SDK and Codex coverage gaps and require a path-specific boundary or exclusion for each.

#### Wave 3 landing page and shared quality review

- [x] Add Parts 9 and 10 to the landing page in order, using only working links. Evidence: the published reading order now lists linked Parts 9 and 10 after Part 8; the final link validator resolved both and local preview returned HTTP 200 for both destinations.
- [x] Keep Claude and OpenAI or Codex examples structurally comparable without forcing identical APIs. Evidence: both posts use version baselines, authority maps, pure host policy, vendor wiring, fake effects, explicit coverage gaps, tradeoffs, failure modes, navigation, primary references, and internal links, while retaining each SDK's actual callbacks, hooks, decorators, interruptions, and thread options.
- [x] Keep vendor-specific results separate from vendor-neutral architecture claims. Evidence: both openings and coverage tables identify vendor controls as bounded adapters, link back to the earlier neutral architecture, and assign application-owned policy or executors independent authority.
- [x] Label beta surfaces visibly and avoid using them as the basis for vendor-neutral claims. Evidence: Claude Managed Agents and hosted OpenAI multi-agent behavior are visibly marked beta, excluded where appropriate, and discussed only as vendor-specific coverage.
- [x] Confirm credential-free tests cover host-owned policy in both posts. Evidence: the Claude policy and callback suites and the OpenAI executor and Codex adapter suites ran with no credentials, including denial, zero-effect, trace-lineage, timeout, and path-observation assertions.
- [x] Apply every shared per-post content quality gate from Wave 1 to Parts 9 and 10. Evidence: manual review confirmed concrete failure openings, explicit boundaries, central working examples, execution-affecting tests, tradeoffs, residual risk, common failures, primary references, four internal neighbors, published-only navigation, fake effects, and no solved-injection or enforcement-confusion claims; automated style and published-content review passed.

#### Wave 3 code and site validation

- [x] Extract or mirror central Wave 3 TypeScript and Python examples into a temporary validation directory. Evidence: all ten Python and two TypeScript fences were mechanically extracted to `/private/tmp/guardrails-wave3.o8oBQK`, with combined runners assembled from the exact published fences.
- [x] Type-check TypeScript and parse or run Python examples with fake adapters. Evidence: every Python fence passed `py_compile`; both TypeScript fences passed strict NodeNext checking against `@openai/codex-sdk@0.152.1`; the combined Python and standalone TypeScript suites exited 0.
- [x] Run included credential-free Wave 3 tests. Evidence: Claude Messages, pure Agent policy, callbacks, Managed configuration, OpenAI host policy, Agents SDK wiring, trace construction, and Codex fake-adapter tests all ran without credentials; exact vendor imports used the versions documented in the posts.
- [x] Delete temporary validation artifacts and confirm no local-only files remain. Evidence: `/private/tmp/guardrails-wave3.o8oBQK` and three rendered-route HTML files were removed; `git status --short` contains only the intended four Wave 3 source files.
- [x] Run the forbidden credential-pattern and em-dash scans over touched files. Evidence: the full repository secret scan passed, and the U+2014 scan returned no matches across all four touched content files.
- [x] Run `npm run validate:style`. Evidence: final Wave 3 run exited 0 with `Style validation passed.`
- [x] Run `npm run validate:code-examples`. Evidence: final Wave 3 run exited 0 with fence tags and source syntax checked.
- [x] Run `npm run validate:published-content`. Evidence: final Wave 3 run exited 0 with `Published content review passed.`
- [x] Run `npm run build` after every Wave 3 file-change batch. Evidence: builds passed after Part 9, Part 10, navigation and landing updates, the Codex event-minimization correction, the Claude hook-scope correction, and checklist evidence; the full pre-push build generated 792 pages and 791 indexed pages with zero Astro diagnostics.
- [x] Run `npm run validate:links` against the final Wave 3 build. Evidence: the link validator checked 792 HTML pages and passed.
- [x] Inspect both vendor routes and the updated series landing page. Evidence: local Astro preview returned HTTP 200 for both vendor posts and the series landing; rendered title markers for both posts appeared on their routes and in the landing reading order, then the server and temporary HTML files were removed.
- [x] Run `npm run validate:pre-push`. Evidence: the full gate passed secret, style, published-content, generated-output, React, Swift, MCP companion, coding-problem, code-example, build, 792-page, link, custom-page, and browser validation tiers.
- [ ] Commit the Wave 3 implementation and checklist evidence. Evidence: pending.
- [ ] Push the Wave 3 commit and confirm `origin/main`. Evidence: pending.
- [ ] Mark Wave 3 complete only after every Wave 3 item has evidence and is checked. Evidence: pending.

### Wave 4: Evidence and operations

#### Part 11: Deterministic Guardrail Testing

- [ ] Create `src/content/docs/posts/2026-09-01-deterministic-guardrail-testing.md` with quoted frontmatter, stable tags, canonical URL, series slug, and order 11. Evidence: pending.
- [ ] Define a guardrail test pyramid. Evidence: pending.
- [ ] Cover pure policy unit tests, adapter contracts, and audit-event contracts. Evidence: pending.
- [ ] Use fake model trajectories and recording tools. Evidence: pending.
- [ ] Test timeout, retry, cancellation, and failure policy. Evidence: pending.
- [ ] Add properties for capability monotonicity and side-effect evidence. Evidence: pending.
- [ ] Explain which behavior still requires live-model evaluation. Evidence: pending.
- [ ] Implement a credential-free Python fake agent and TypeScript recording executor. Evidence: pending.
- [ ] Include table-driven unit tests and fake-model tool or handoff trajectories. Evidence: pending.
- [ ] Test fail-closed, quarantine, and explicit degraded behavior. Evidence: pending.
- [ ] Prove every executed external effect has a preceding allow or approval event. Evidence: pending.
- [ ] Prove reducing authority cannot turn `block` into `allow`. Evidence: pending.

#### Part 12: Adversarial Evals and Security-Utility Measurement

- [ ] Create `src/content/docs/posts/2026-09-01-adversarial-ai-security-evals.md` with quoted frontmatter, stable tags, canonical URL, series slug, and order 12. Evidence: pending.
- [ ] Define allowed and prohibited outcomes independently. Evidence: pending.
- [ ] Build benign, attack, hard-negative, mutation-family, and multi-turn fixtures. Evidence: pending.
- [ ] Compare baseline, control, and adaptive-attack conditions. Evidence: pending.
- [ ] Measure attack success, benign success, utility under attack, false refusals, latency, and cost. Evidence: pending.
- [ ] Account for stochastic variance and model updates. Evidence: pending.
- [ ] Turn metrics into risk-specific release gates. Evidence: pending.
- [ ] Implement a Python eval runner over `SecurityEvalCase` with deterministic outcome checks and optional graders. Evidence: pending.
- [ ] Include the four-outcome AgentDojo-style matrix. Evidence: pending.
- [ ] Run repeated trials for stochastic cases and safe hard negatives. Evidence: pending.
- [ ] Compare baseline utility with utility under attack. Evidence: pending.
- [ ] Explain benchmark overfitting and adaptive attackers. Evidence: pending.

#### Part 13: Trace Guardrail Bypasses and Boundary Hops

- [ ] Create `src/content/docs/posts/2026-09-01-trace-guardrail-bypasses-boundary-hops.md` with quoted frontmatter, stable tags, canonical URL, series slug, and order 13. Evidence: pending.
- [ ] Start causal analysis from the prohibited external outcome. Evidence: pending.
- [ ] Define trace, run, turn, tool-call, handoff, approval, and policy identifiers. Evidence: pending.
- [ ] Walk causal parent links backward and build expected-versus-observed control ledgers. Evidence: pending.
- [ ] Separate malicious input, first preventable failure, and contributing conditions. Evidence: pending.
- [ ] Minimize captured content and protect audit data. Evidence: pending.
- [ ] Build a synthetic incident timeline and causal graph. Evidence: pending.
- [ ] Implement TypeScript audit types and a reconstruction function that returns the effect, untrusted source, failed or missing controls, override path, and first preventable failure. Evidence: pending.
- [ ] Include complete synthetic traces for missing authorization, classifier timeout, and approval deception. Evidence: pending.
- [ ] Define redaction rules for credentials, personal data, and untrusted content. Evidence: pending.
- [ ] Test orphan spans, duplicate tool calls, and mismatched approval digests. Evidence: pending.

#### Part 14: Incident Response and Continuous Improvement

- [ ] Create `src/content/docs/posts/2026-09-01-ai-guardrail-incident-response.md` with quoted frontmatter, stable tags, canonical URL, series slug, and order 14. Evidence: pending.
- [ ] Cover detection and identifier preservation. Evidence: pending.
- [ ] Cover containment of tools, capabilities, destinations, sessions, and tokens. Evidence: pending.
- [ ] Reproduce the incident with fake tools before live systems. Evidence: pending.
- [ ] Pin model, prompt, policy, tool-definition, and SDK versions. Evidence: pending.
- [ ] Write the causal explanation and control ledger. Evidence: pending.
- [ ] Fix the enforcement boundary before changing prompt wording. Evidence: pending.
- [ ] Add deterministic and live-model regression cases. Evidence: pending.
- [ ] Restore gradually while measuring security and utility. Evidence: pending.
- [ ] Feed the failure pattern back into threat models and release gates. Evidence: pending.
- [ ] Implement a minimized Python regression fixture backed by a reader-facing incident record. Evidence: pending.
- [ ] Prove the prohibited outcome cannot recur while the allowed support task still succeeds. Evidence: pending.
- [ ] Include the causal timeline, first preventable failure, contributing conditions, containment checklist, before-and-after results, and recurring review cadence. Evidence: pending.
- [ ] End with a production checklist and links to every implementation and testing installment. Evidence: pending.

#### Wave 4 landing page and shared quality review

- [ ] Add Parts 11 through 14 to the landing page and confirm the complete 14-part reading order. Evidence: pending.
- [ ] Include attack success and benign utility in eval reporting. Evidence: pending.
- [ ] Confirm trace reconstruction identifies the first preventable failure. Evidence: pending.
- [ ] Confirm audit examples minimize sensitive content. Evidence: pending.
- [ ] Confirm the incident regression proves safety and retained task utility. Evidence: pending.
- [ ] Apply every shared per-post content quality gate from Wave 1 to Parts 11 through 14. Evidence: pending.

#### Wave 4 code and site validation

- [ ] Extract or mirror central Wave 4 TypeScript and Python examples into a temporary validation directory. Evidence: pending.
- [ ] Type-check TypeScript and parse or run Python examples with fake adapters. Evidence: pending.
- [ ] Run deterministic, workflow, property, adversarial, hard-negative, and regression tests. Evidence: pending.
- [ ] Delete temporary validation artifacts and confirm no local-only files remain. Evidence: pending.
- [ ] Run the forbidden credential-pattern and em-dash scans over touched files. Evidence: pending.
- [ ] Run `npm run validate:style`. Evidence: pending.
- [ ] Run `npm run validate:code-examples`. Evidence: pending.
- [ ] Run `npm run validate:published-content`. Evidence: pending.
- [ ] Run `npm run build` after every Wave 4 file-change batch. Evidence: pending.
- [ ] Run `npm run validate:links` against the final Wave 4 build. Evidence: pending.
- [ ] Inspect every new route and the complete series landing page. Evidence: pending.
- [ ] Run `npm run validate:pre-push`. Evidence: pending.
- [ ] Commit the Wave 4 implementation and checklist evidence. Evidence: pending.
- [ ] Push the Wave 4 commit and confirm `origin/main`. Evidence: pending.
- [ ] Mark Wave 4 complete only after every Wave 4 item has evidence and is checked. Evidence: pending.

### Final series closeout

- [ ] Confirm all 14 posts exist with the `engineering-ai-guardrails` slug and unique orders 1 through 14. Evidence: pending.
- [ ] Confirm both post indexes link to the series and the landing page lists the complete reading order. Evidence: pending.
- [ ] Confirm every central TypeScript and Python example has recorded validation evidence. Evidence: pending.
- [ ] Confirm vendor posts match current official documentation and record versions and beta status. Evidence: pending.
- [ ] Confirm prompt-injection coverage includes direct, indirect, tool, memory, handoff, and approval paths. Evidence: pending.
- [ ] Confirm testing covers deterministic policy, workflow, adversarial, hard-negative, property, and live-model cases. Evidence: pending.
- [ ] Confirm metrics cover security, utility, latency, cost, and evidence completeness. Evidence: pending.
- [ ] Confirm the trace post reconstructs the first preventable failure and the incident post converts it into a passing regression. Evidence: pending.
- [ ] Run final published-content, style, credential, em-dash, code-example, build, link, route, browser, and pre-push validation. Evidence: pending.
- [ ] Review changed external references and beta notes. Evidence: pending.
- [ ] Update `docs/feature_tracker.md` only if implementation added a validator, generator, component, content model, or reusable repo workflow. Evidence: pending.
- [ ] Move this plan from `docs/plans/current/` to `docs/plans/history/`. Evidence: pending.
- [ ] Commit and push final closeout, then confirm a clean worktree synchronized with `origin/main`. Evidence: pending.
- [ ] Mark the whole series complete only after every wave and final closeout item is checked. Evidence: pending.

## Authoring waves

Publish in four waves. Each wave ends with a full build and published-content review.

### Wave 1: Foundations

- Part 1: Guardrails Are Systems, Not Prompts.
- Part 2: Threat-Model an AI Application.
- Part 3: Design a Layered Guardrail Architecture.
- Part 4: Prompt Injection and Control-Data Separation.
- Create the series landing page and discovery entries with only these published links.

Acceptance gate:

- Stable terminology across all four posts.
- Support-domain facts and tool names match.
- No claim that prompt injection is solved.
- TypeScript examples parse and their included tests pass.

### Wave 2: Application surfaces

- Part 5: Guardrails for Production Chatbots.
- Part 6: Tool Calls, Approvals, and Least Privilege.
- Part 7: Guardrails for MCP Clients and Servers.
- Part 8: Agents, Delegation, and Guardrail Propagation.

Acceptance gate:

- Every side-effecting example has a pre-execution policy check.
- MCP examples match the selected stable specification.
- Handoff examples preserve lineage and reduce capability.
- No repeated protocol introduction from the MCP series.

### Wave 3: Vendor implementations

- Part 9: Claude API and Agent SDK Guardrails.
- Part 10: OpenAI Agents SDK and Codex SDK Guardrails.

Acceptance gate:

- Recheck official documentation on the authoring day.
- Record SDK versions and beta status.
- Keep vendor examples structurally comparable without forcing identical APIs.
- Credential-free tests cover host policy.
- State exclusions and uncovered tool paths explicitly.

### Wave 4: Evidence and operations

- Part 11: Deterministic Guardrail Testing.
- Part 12: Adversarial Evals and Security-Utility Measurement.
- Part 13: Trace Guardrail Bypasses and Boundary Hops.
- Part 14: Incident Response and Continuous Improvement.

Acceptance gate:

- Eval metrics include attack success and benign utility.
- Trace reconstruction identifies first preventable failure.
- Audit examples minimize sensitive content.
- The incident regression proves safety and retained task utility.
- Landing page lists the complete reading order.

## Code validation strategy

There is no new companion workspace. Keep snippets working through these rules:

- Use self-contained functions and fixtures.
- Keep vendor calls behind small adapters so policy tests need no credentials.
- Use fake executors for every external side effect.
- Put deterministic expected outcomes next to each major snippet.
- Use the repo's fenced-code validation for syntax and language tags.
- When an example cannot compile alone because it is an excerpt, provide its containing interface and imports in the same post.
- Do not show an unsafe example that can run against a real service without modification.
- Use placeholders for all keys and tokens.

For each authoring wave:

1. Extract or mirror the central TypeScript and Python examples into a temporary directory.
2. Type-check TypeScript with the repo toolchain.
3. Parse and run Python examples with fake adapters.
4. Run `npm run validate:code-examples`.
5. Delete temporary untracked validation files after recording the result.

If snippet volume makes this process error-prone, stop and propose a small tracked example-contract fixture before adding a new public generator or reusable component. That would be a separate feature decision and would require feature-tracker updates.

## Content quality gates

Every post needs:

- A concrete opening failure or engineering decision.
- A clear definition of the boundary under discussion.
- One central working code anchor.
- At least one test that proves the control affects execution.
- Tradeoffs and residual risk.
- Common failure modes.
- Primary references.
- Two to five related internal links.
- A link to the previous and next published series part where applicable.

Do not publish:

- Internal planning fields such as Question, Code anchor, Wrong first move, or Follow-up path.
- Future-file TODOs.
- A mechanical source pile.
- Large copied passages from vendor documentation.
- Attack payload galleries.
- Claims based on one unreported model run.
- Universal numeric security thresholds.
- Raw trace examples containing private content.

## Validation commands

After each file-change batch:

```bash
npm run build
```

Before each wave is complete:

```bash
npm run validate:style
npm run validate:links
npm run validate:code-examples
npm run validate:published-content
npm run build
```

Before pushing:

```bash
npm run validate:pre-push
```

Also scan touched files for the forbidden credential patterns documented in `AGENTS.md` and for the em-dash codepoint.

## Version and compatibility policy

- MCP examples start from stable specification `2025-11-25` unless a newer stable version exists when Part 7 is authored.
- Vendor posts record the documentation access date and exact SDK versions.
- Beta features carry a visible beta label and do not anchor vendor-neutral claims.
- If a vendor removes or renames a feature, update the post's code and explanation together.
- Pin model versions for reported evals where the provider supports pinning.
- Keep model-specific results separate from architecture claims.

## Rollout and maintenance

- Publish one wave at a time.
- Update the landing page only with working links.
- Cross-post after the canonical site page is live.
- Re-run security eval examples when changing a vendor SDK, model baseline, policy contract, or tool path.
- Review external source links and beta notes every six months.
- Move this plan to `docs/plans/history/` after Part 14 and the final landing page review are complete.
- No `docs/feature_tracker.md` update is required for research and planning alone. Update it only if implementation adds a new validator, generator, component, content model, or reusable workflow.

## Definition of done

The series is complete when:

- All 14 posts are published with correct `series.slug` and unique order values.
- The series landing page contains the complete reading order.
- Both post indexes link to the series.
- Every central TypeScript and Python example has validation evidence.
- Vendor examples match current official documentation and record versions.
- Prompt-injection coverage includes direct, indirect, tool, memory, handoff, and approval paths.
- Testing covers deterministic policy, workflow, adversarial, hard-negative, and live-model cases.
- Metrics cover security, utility, latency, cost, and evidence completeness.
- The trace installment reconstructs a causal path to the first preventable failure.
- The incident installment converts the failure into a passing regression case.
- Published-content, link, code-example, build, and pre-push validations pass.
- This plan moves from `docs/plans/current/` to `docs/plans/history/`.
