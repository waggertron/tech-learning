---
title: Trace Guardrail Bypasses and Boundary Hops
description: "Reconstruct an AI guardrail bypass from a prohibited external effect, identify the first preventable control failure, and preserve useful evidence without collecting sensitive transcripts."
date: 2026-09-01
tags: [ai, guardrails, observability, incident-response, security]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-09-01-trace-guardrail-bypasses-boundary-hops/
series:
  slug: engineering-ai-guardrails
  order: 13
---

This is part 13 of the [Engineering Guardrails for AI Systems series](../series/engineering-ai-guardrails/).

An alert says an agent sent account data to an unverified destination. The trace contains 900 spans, several model calls, a handoff, an approval click, and three retries. Reading it from the first prompt forward produces a story, but not necessarily a cause.

Start with the prohibited external effect. Walk verified parent links backward. At each boundary, compare the control that should have run with the evidence that actually exists. The goal is not to find the most suspicious sentence. It is to identify the earliest control that could have prevented the effect and did not.

## Give every boundary a durable identity

Text search is not causal reconstruction. Carry stable identifiers through application, model, policy, approval, tool, and external-service boundaries.

| Identifier | Scope | Why it matters |
| --- | --- | --- |
| `trace_id` | One distributed causal tree | Joins services and asynchronous work |
| `run_id` | One agent or workflow execution | Separates retries and resumed sessions |
| `turn_id` | One user or agent turn | Locates conversation state without storing all content |
| `tool_call_id` | One canonical tool invocation | Detects duplicate or reordered calls |
| `handoff_id` | One delegated authority transfer | Proves which capabilities crossed agents |
| `approval_id` | One reviewer decision | Joins the decision to its display and actor |
| `action_id` | One proposed external action | Binds policy, approval, execution, and receipt |
| `action_digest` | Canonical immutable action | Detects edits after policy or approval |
| `policy_id` and version | One evaluated rule set | Reproduces the decision logic |
| `receipt_id` | One observed external effect | Grounds the incident in system state |

Generate identifiers in trusted code. A model may repeat an identifier in its output, but it must not mint authoritative approval, policy, or effect evidence.

## Walk from effect to source

Use a reverse causal walk:

```text
external effect receipt
  <- tool execution
     <- approval or policy permit
        <- canonical action proposal
           <- handoff and active authority
              <- model step
                 <- retrieved, tool, memory, or user input
```

For each edge, verify that the referenced parent exists in the same trace and that the child is allowed to name that parent type. A tool effect parented directly to a model message is not merely incomplete telemetry. It is evidence that the enforcement boundary may have been bypassed.

Build an expected-versus-observed control ledger while walking:

| Boundary | Expected | Observed | Status |
| --- | --- | --- | --- |
| Tenant authorization | Allow for the exact actor, tenant, and action | No event | Missing |
| Injection classifier | Result or explicit failure policy | Timeout, workflow continued | Failed open |
| Human approval | Allow bound to action digest and destination | Allow bound to an earlier digest | Mismatch |
| Tool executor | Valid permit before dispatch | Call accepted model proposal | Bypassed |
| External service | Receipt tied to idempotency key | Receipt present | Confirmed effect |

The ledger separates a logging gap from a control failure. Missing evidence should fail the evidence contract, but you still need executor and external records to decide whether the control ran elsewhere.

## Separate trigger, cause, and contributors

Use three labels precisely:

- **Malicious input**: The untrusted content that attempted to influence the system. It is the trigger, not automatically the root cause.
- **First preventable failure**: The earliest required control on the causal path that was missing, failed open, was bypassed, or evaluated different facts than the executor used.
- **Contributing conditions**: Later or surrounding facts that increased likelihood or impact, such as a broad tool scope, deceptive approval UI, missing timeout policy, duplicate dispatch, or incomplete evidence.

"The model followed a prompt injection" stops one layer too early. If a model proposal could directly reach a high-impact tool, the failed enforcement boundary is the actionable cause.

## Reconstruct a synthetic incident

This credential-free TypeScript program models audit events, validates graph integrity, and reconstructs three complete incident paths: missing authorization, a classifier timeout that fails open, and approval deception caused by a changed action digest.

```typescript
import assert from "node:assert/strict";

type EventKind =
  | "untrusted_input"
  | "model_proposal"
  | "control"
  | "approval"
  | "tool_call"
  | "effect";

type ControlName = "authorization" | "injection_classifier" | "approval";
type ControlStatus = "pass" | "fail" | "timeout" | "override";

type AuditEvent = {
  eventId: string;
  traceId: string;
  runId: string;
  turnId: string;
  parentId: string | null;
  sequence: number;
  kind: EventKind;
  actionId?: string;
  actionDigest?: string;
  toolCallId?: string;
  handoffId?: string;
  approvalId?: string;
  policyId?: string;
  receiptId?: string;
  sourceId?: string;
  contentDigest?: string;
  control?: ControlName;
  status?: ControlStatus;
  reason?: string;
};

type ControlExpectation = {
  control: ControlName;
  requireDigest: boolean;
};

type ControlLedgerRow = {
  control: ControlName;
  expected: string;
  observed: string;
  result: "passed" | "failed" | "missing";
};

type Finding = {
  effect: AuditEvent;
  untrustedSource: AuditEvent | null;
  causalPath: string[];
  ledger: ControlLedgerRow[];
  failedOrMissingControls: ControlName[];
  overridePath: string[];
  firstPreventableFailure: ControlName | null;
};

function causalPath(events: readonly AuditEvent[], effectId: string): AuditEvent[] {
  const byId = new Map(events.map((event) => [event.eventId, event]));
  const reversed: AuditEvent[] = [];
  const seen = new Set<string>();
  let current = byId.get(effectId);
  assert.ok(current, `UNKNOWN_EFFECT:${effectId}`);
  assert.equal(current.kind, "effect", `NOT_AN_EFFECT:${effectId}`);

  while (current) {
    assert.ok(!seen.has(current.eventId), `CAUSAL_CYCLE:${current.eventId}`);
    seen.add(current.eventId);
    reversed.push(current);
    if (current.parentId === null) break;
    const parent = byId.get(current.parentId);
    assert.ok(parent, `ORPHAN_PARENT:${current.parentId}`);
    assert.equal(parent.traceId, current.traceId, "CROSS_TRACE_PARENT");
    current = parent;
  }
  return reversed.reverse();
}

function validateTrace(events: readonly AuditEvent[]): void {
  const ids = new Set(events.map((event) => event.eventId));
  assert.equal(ids.size, events.length, "DUPLICATE_EVENT_ID");

  const toolCallIds = events
    .filter((event) => event.kind === "tool_call")
    .map((event) => event.toolCallId)
    .filter((value): value is string => value !== undefined);
  assert.equal(new Set(toolCallIds).size, toolCallIds.length, "DUPLICATE_TOOL_CALL");

  for (const event of events) {
    if (event.parentId !== null) {
      assert.ok(ids.has(event.parentId), `ORPHAN_PARENT:${event.parentId}`);
    }
  }
}

function buildLedger(
  path: readonly AuditEvent[],
  effect: AuditEvent,
  expectations: readonly ControlExpectation[],
): ControlLedgerRow[] {
  return expectations.map((expectation) => {
    const observed = path.find(
      (event) =>
        event.control === expectation.control ||
        (expectation.control === "approval" && event.kind === "approval"),
    );
    if (!observed) {
      return {
        control: expectation.control,
        expected: expectation.requireDigest ? "pass with matching digest" : "pass",
        observed: "no event",
        result: "missing",
      };
    }

    const digestMatches =
      !expectation.requireDigest || observed.actionDigest === effect.actionDigest;
    const passed = observed.status === "pass" && digestMatches;
    return {
      control: expectation.control,
      expected: expectation.requireDigest ? "pass with matching digest" : "pass",
      observed: digestMatches
        ? observed.status ?? "unknown"
        : `digest mismatch: ${observed.actionDigest ?? "missing"}`,
      result: passed ? "passed" : "failed",
    };
  });
}

function reconstruct(
  events: readonly AuditEvent[],
  effectId: string,
  expectations: readonly ControlExpectation[],
): Finding {
  validateTrace(events);
  const path = causalPath(events, effectId);
  const effect = path.at(-1);
  assert.ok(effect);
  const ledger = buildLedger(path, effect, expectations);
  const failed = ledger
    .filter((row) => row.result !== "passed")
    .map((row) => row.control);
  return {
    effect,
    untrustedSource:
      path.find((event) => event.kind === "untrusted_input") ?? null,
    causalPath: path.map((event) => event.eventId),
    ledger,
    failedOrMissingControls: failed,
    overridePath: path
      .filter((event) => event.status === "override" || event.reason === "FAIL_OPEN")
      .map((event) => event.eventId),
    firstPreventableFailure: failed[0] ?? null,
  };
}

const expectations: ControlExpectation[] = [
  { control: "authorization", requireDigest: true },
  { control: "injection_classifier", requireDigest: false },
  { control: "approval", requireDigest: true },
];

const base = {
  traceId: "TRACE_EXAMPLE_1",
  runId: "RUN_EXAMPLE_1",
  turnId: "TURN_EXAMPLE_1",
};

function event(
  sequence: number,
  eventId: string,
  parentId: string | null,
  kind: EventKind,
  fields: Partial<AuditEvent> = {},
): AuditEvent {
  return { ...base, sequence, eventId, parentId, kind, ...fields };
}

function missingAuthorizationTrace(): AuditEvent[] {
  return [
    event(0, "INPUT_1", null, "untrusted_input", {
      sourceId: "TOOL_RESULT_EXAMPLE_1",
      contentDigest: "DIGEST_CONTENT_EXAMPLE_1",
    }),
    event(1, "PROPOSAL_1", "INPUT_1", "model_proposal", {
      actionId: "ACTION_EXAMPLE_1",
      actionDigest: "DIGEST_ACTION_EXAMPLE_1",
    }),
    event(2, "CLASSIFIER_1", "PROPOSAL_1", "control", {
      control: "injection_classifier",
      status: "pass",
      policyId: "CLASSIFIER_POLICY_V3",
    }),
    event(3, "APPROVAL_1", "CLASSIFIER_1", "approval", {
      control: "approval",
      status: "pass",
      approvalId: "APPROVAL_EXAMPLE_1",
      actionDigest: "DIGEST_ACTION_EXAMPLE_1",
    }),
    event(4, "CALL_1", "APPROVAL_1", "tool_call", {
      toolCallId: "TOOL_CALL_EXAMPLE_1",
      actionId: "ACTION_EXAMPLE_1",
      actionDigest: "DIGEST_ACTION_EXAMPLE_1",
    }),
    event(5, "EFFECT_1", "CALL_1", "effect", {
      actionId: "ACTION_EXAMPLE_1",
      actionDigest: "DIGEST_ACTION_EXAMPLE_1",
      receiptId: "RECEIPT_EXAMPLE_1",
    }),
  ];
}

function classifierTimeoutTrace(): AuditEvent[] {
  const events = missingAuthorizationTrace();
  events.splice(
    2,
    0,
    event(2, "AUTH_2", "PROPOSAL_1", "control", {
      control: "authorization",
      status: "pass",
      policyId: "AUTH_POLICY_V7",
      actionDigest: "DIGEST_ACTION_EXAMPLE_1",
    }),
  );
  const classifier = events.find((item) => item.eventId === "CLASSIFIER_1");
  assert.ok(classifier);
  classifier.parentId = "AUTH_2";
  classifier.status = "timeout";
  classifier.reason = "FAIL_OPEN";
  return events;
}

function approvalDeceptionTrace(): AuditEvent[] {
  const events = classifierTimeoutTrace();
  const classifier = events.find((item) => item.eventId === "CLASSIFIER_1");
  const approval = events.find((item) => item.eventId === "APPROVAL_1");
  assert.ok(classifier && approval);
  classifier.status = "pass";
  classifier.reason = undefined;
  approval.actionDigest = "DIGEST_ACTION_EXAMPLE_OLDER";
  return events;
}

const missingAuth = reconstruct(
  missingAuthorizationTrace(),
  "EFFECT_1",
  expectations,
);
assert.equal(missingAuth.firstPreventableFailure, "authorization");
assert.equal(missingAuth.untrustedSource?.sourceId, "TOOL_RESULT_EXAMPLE_1");

const timeout = reconstruct(classifierTimeoutTrace(), "EFFECT_1", expectations);
assert.equal(timeout.firstPreventableFailure, "injection_classifier");
assert.deepEqual(timeout.overridePath, ["CLASSIFIER_1"]);

const deception = reconstruct(approvalDeceptionTrace(), "EFFECT_1", expectations);
assert.equal(deception.firstPreventableFailure, "approval");
assert.match(deception.ledger[2]?.observed ?? "", /digest mismatch/);

const orphan = missingAuthorizationTrace();
orphan[1] = { ...orphan[1], parentId: "MISSING_PARENT" } as AuditEvent;
assert.throws(() => validateTrace(orphan), /ORPHAN_PARENT/);

const duplicate = missingAuthorizationTrace();
duplicate.push(
  event(6, "CALL_DUPLICATE", "APPROVAL_1", "tool_call", {
    toolCallId: "TOOL_CALL_EXAMPLE_1",
  }),
);
assert.throws(() => validateTrace(duplicate), /DUPLICATE_TOOL_CALL/);
```

The three incident records share the same prohibited effect but produce different first preventable failures. That distinction directs the fix: add mandatory authorization, make the classifier failure policy explicit, or bind approval to the exact action digest.

## Read the timeline without losing causality

For the approval-deception trace, a reader-facing incident timeline might be:

```text
10:04:11  Untrusted tool result enters TURN_EXAMPLE_1
10:04:12  Model proposes ACTION_EXAMPLE_1
10:04:12  Authorization passes for DIGEST_ACTION_EXAMPLE_1
10:04:13  Injection control passes
10:04:20  Reviewer approves DIGEST_ACTION_EXAMPLE_OLDER
10:04:21  Executor dispatches DIGEST_ACTION_EXAMPLE_1
10:04:22  External receipt confirms prohibited send

Cause graph:
untrusted input -> proposal -> controls -> stale approval -> tool call -> effect
                                      ^
                                      first preventable failure
```

Wall-clock order helps operations, but parent links establish causality. Concurrent spans can finish out of order. Retries can reuse an action while creating new calls. Keep sequence within a trusted emitter and use identifiers rather than timestamps alone.

## Minimize and protect audit content

An audit store is a high-value target. It should hold enough facts to reproduce decisions without becoming a second transcript, credential vault, or personal-data lake.

Apply field-level rules before storage:

| Data | Audit representation | Rule |
| --- | --- | --- |
| Credential or token | Classification and stable non-reversible fingerprint | Never store the secret value |
| Personal data | Tenant-scoped subject reference or redacted category | Store raw value only under a documented incident exception |
| Untrusted prompt or tool content | Source ID, digest, size, trust label, detector result | Keep bounded encrypted samples separately when required |
| Tool arguments | Canonical action digest plus approved safe fields | Allowlist fields, never log arbitrary argument objects |
| Tool output | Receipt, status, byte count, classification | Avoid complete payloads |
| Approval display | Template version, shown-field digests, reviewer identity | Preserve what was shown without copying sensitive content |

Restrict audit access separately from application access. Encrypt in transit and at rest, authenticate writers, make tampering detectable, set retention by risk and legal need, and alert on bulk reads or disabled emitters. Log redaction failures as control failures without logging the rejected value.

## Test the evidence itself

Trace validation belongs in normal CI and production monitoring. Exercise:

- Orphan spans and cross-trace parent references.
- Duplicate event, action, tool-call, approval, and receipt identifiers.
- Approval and execution digests that differ.
- An effect with no prior permit or no external receipt.
- Handoff events whose child capabilities exceed the parent.
- Sequence gaps, late events, retries, and resumed runs.
- Unknown control statuses and detector timeouts without a failure-policy event.
- Redaction failures and forbidden fields in stored attributes.

Reconcile application effect events with external provider receipts. If the counts diverge, treat evidence completeness as degraded and investigate before claiming an attack-success rate.

## Tradeoffs and residual risk

More identifiers and checks improve reconstruction but add schema governance and storage cost. Aggressive minimization protects users but can remove details needed to reproduce an ambiguous model path. Centralized tracing simplifies queries but increases blast radius. Tamper-evident storage strengthens evidence but does not make dishonest emitters truthful.

Residual risk includes missing instrumentation on a bypass path, forged parent references from an untrusted component, clock and delivery disorder, sampling that omits the incident, provider-owned spans you cannot inspect, and an external effect without a reliable receipt.

## Common failure modes

- **Prompt-first analysis**: Blaming suspicious text before proving which external effect occurred.
- **Flat logs**: Recording events without causal parents or stable action identities.
- **Model-authored authority**: Trusting a model statement that approval or policy passed.
- **Timestamp causality**: Assuming the immediately preceding log line caused the effect.
- **Digest drift**: Approving one action and executing a modified one.
- **Transcript hoarding**: Collecting complete conversations and tool payloads by default.
- **Success-only sampling**: Dropping blocked attempts, timeouts, or evidence failures.
- **Last-failure bias**: Fixing the final tool call while ignoring an earlier missing authorization boundary.

## Series navigation

- Previous: [Part 12: Adversarial Evals and Security-Utility Measurement](../2026-09-01-adversarial-ai-security-evals/)
- Next: [Part 14: AI Guardrail Incident Response and Continuous Improvement](../2026-09-01-ai-guardrail-incident-response/)
- Series index: [Engineering Guardrails for AI Systems](../series/engineering-ai-guardrails/)

## References

- [Logging Cheat Sheet, OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [AI Agent Security Cheat Sheet, OWASP](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html)
- [Creating traces and spans, OpenAI Agents SDK](https://openai.github.io/openai-agents-python/ref/tracing/create/)
- [Events and streaming, Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/events-and-streaming)

## Related topics

- [Evaluation and methods](../../topics/ai/benchmarks/evaluation-and-methods/)
- [Agent benchmarks](../../topics/ai/benchmarks/agent-benchmarks/)
- [Agents, delegation, and guardrail propagation](../2026-09-01-agent-delegation-guardrail-propagation/)
- [Tool calls, approvals, and least privilege](../2026-09-01-ai-tool-calls-approvals-least-privilege/)
