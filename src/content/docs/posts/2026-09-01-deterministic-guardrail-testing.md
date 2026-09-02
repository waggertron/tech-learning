---
title: Deterministic Guardrail Testing
description: "Prove AI guardrail policy, workflow, failure, audit, and side-effect invariants with fake models and recording executors before adding live-model variance."
date: 2026-09-01
tags: [ai, guardrails, testing, agents, security]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-09-01-deterministic-guardrail-testing/
series:
  slug: engineering-ai-guardrails
  order: 11
---

This is part 11 of the [Engineering Guardrails for AI Systems series](../series/engineering-ai-guardrails/).

A team saves three successful chatbot transcripts and calls them guardrail regression tests. The next model release phrases a tool call differently, the snapshots fail, and nobody can tell whether security weakened or wording merely changed.

The deeper problem is that a transcript is not the contract. The contract is what authority was available, which policy decision preceded a tool, whether a prohibited effect occurred, how failures degraded, and what evidence survived. Test those facts without a live model first.

## Build a guardrail test pyramid

Guardrail testing works best as several layers with different owners and failure signals.

| Layer | Replace | Exercise | Primary assertion |
| --- | --- | --- | --- |
| Pure policy tests | Nothing outside the policy function | Validation, authorization, destination, data class, and capability rules | Exact decision and reason code |
| Adapter contracts | Network or SDK transport | Canonicalization, field mapping, result parsing, and audit emission | Stable application contract |
| Workflow tests | Model with a scripted fake | Tool loops, handoffs, approval pauses, retries, and cancellation | Expected trajectory and zero prohibited effects |
| Failure-policy tests | Dependency with an injected failure | Timeout, unavailable service, malformed result, and partial completion | Fail closed, quarantine, or explicit degraded behavior |
| Property tests | Many generated authority and action combinations | Monotonicity, effect lineage, tenant isolation, and budget bounds | Invariant holds for every generated case |
| Provider integration tests | Controlled provider boundary | Serialization, authentication, streaming, and hosted-tool behavior | Wire contract and environment behavior |
| Live-model evals | Nothing | Tool choice, instruction following, adaptive attacks, and task utility | Statistical security and utility metrics |

Fast deterministic layers should carry the release-blocking invariants. Provider and model tests then measure behavior that your code does not fully control.

Current OpenAI Agents SDK testing utilities follow this split. `ScriptedModel` runs in memory and records normalized model interactions, while real adapter tests remain responsible for provider serialization and transport. Whether you use that utility or a small application-owned fake, finish the script and assert every expected step was consumed. An early stop can be as meaningful as an unexpected extra call.

## Test decisions as data

Start with table-driven cases over a pure policy. The table should cover more than attack strings. Include tenant mismatches, missing capabilities, changed destinations, invalid shapes, expired approvals, detector failures, and benign hard negatives.

The following credential-free Python program contains a fake model, a recording tool, a handoff path, failure policy, and property checks. It makes no SDK or network request.

```python
from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from enum import Enum
from itertools import combinations
from typing import Literal


Decision = Literal["allow", "block", "ask", "quarantine", "degrade"]


@dataclass(frozen=True)
class Authority:
    tenant_id: str
    capabilities: frozenset[str]
    verified_destination: str


@dataclass(frozen=True)
class Action:
    name: str
    tenant_id: str
    destination: str | None = None


@dataclass(frozen=True)
class PolicyResult:
    decision: Decision
    reason: str
    policy_version: str = "support-policy-v6"


@dataclass(frozen=True)
class AuditEvent:
    sequence: int
    event: str
    action_id: str
    decision: str
    parent_id: str | None


def evaluate(action: Action, authority: Authority) -> PolicyResult:
    if action.tenant_id != authority.tenant_id:
        return PolicyResult("block", "TENANT_MISMATCH")
    if action.name == "read_ticket":
        if "ticket:read" not in authority.capabilities:
            return PolicyResult("block", "CAPABILITY_MISSING")
        return PolicyResult("allow", "TENANT_SCOPED_READ")
    if action.name == "send_reply":
        if "reply:send" not in authority.capabilities:
            return PolicyResult("block", "CAPABILITY_MISSING")
        if action.destination != authority.verified_destination:
            return PolicyResult("block", "DESTINATION_NOT_VERIFIED")
        return PolicyResult("ask", "HUMAN_REVIEW_REQUIRED")
    return PolicyResult("block", "UNKNOWN_ACTION")


class DependencyFailure(Enum):
    AUTHORIZATION_TIMEOUT = "authorization_timeout"
    DETECTOR_TIMEOUT = "detector_timeout"
    OPTIONAL_SUMMARIZER_TIMEOUT = "optional_summarizer_timeout"


def failure_policy(failure: DependencyFailure) -> PolicyResult:
    if failure is DependencyFailure.AUTHORIZATION_TIMEOUT:
        return PolicyResult("block", "AUTHORITY_UNAVAILABLE")
    if failure is DependencyFailure.DETECTOR_TIMEOUT:
        return PolicyResult("quarantine", "DETECTION_UNAVAILABLE")
    return PolicyResult("degrade", "RETURN_FACTS_WITHOUT_SUMMARY")


class AttemptOutcome(Enum):
    SUCCESS = "success"
    TIMEOUT_BEFORE_DISPATCH = "timeout_before_dispatch"
    TIMEOUT_AFTER_DISPATCH = "timeout_after_dispatch"
    CANCELLED = "cancelled"


@dataclass
class AttemptLedger:
    attempts: int = 0
    effects: list[str] = field(default_factory=list)
    descendants_cancelled: bool = False


def recover_attempts(
    outcomes: list[AttemptOutcome],
    *,
    side_effecting: bool,
    max_attempts: int = 2,
) -> tuple[str, AttemptLedger]:
    ledger = AttemptLedger()
    for outcome in outcomes[:max_attempts]:
        ledger.attempts += 1
        if outcome is AttemptOutcome.CANCELLED:
            ledger.descendants_cancelled = True
            return "cancelled", ledger
        if outcome is AttemptOutcome.TIMEOUT_BEFORE_DISPATCH:
            continue
        if outcome is AttemptOutcome.TIMEOUT_AFTER_DISPATCH:
            if side_effecting:
                ledger.effects.append("EFFECT_OUTCOME_UNKNOWN")
                return "quarantined", ledger
            continue
        if side_effecting:
            ledger.effects.append("EFFECT_CONFIRMED")
        return "completed", ledger
    return "retry_exhausted", ledger


@dataclass(frozen=True)
class ModelStep:
    kind: Literal["tool", "handoff", "final"]
    name: str
    action: Action | None = None
    requested_capabilities: frozenset[str] = frozenset()


class FakeModel:
    def __init__(self, steps: list[ModelStep]) -> None:
        self.steps = list(steps)
        self.calls = 0

    def next(self) -> ModelStep:
        if not self.steps:
            raise AssertionError("UNEXPECTED_MODEL_CALL")
        self.calls += 1
        return self.steps.pop(0)

    def assert_complete(self) -> None:
        assert self.steps == [], "UNCONSUMED_MODEL_STEPS"


@dataclass
class RecordingTools:
    calls: list[Action] = field(default_factory=list)
    events: list[AuditEvent] = field(default_factory=list)

    async def execute(self, action_id: str, action: Action, permit: AuditEvent) -> None:
        assert permit.action_id == action_id
        assert permit.event in {"policy_allow", "approval_allow"}
        self.events.append(
            AuditEvent(
                sequence=len(self.events),
                event="effect",
                action_id=action_id,
                decision="recorded",
                parent_id=str(permit.sequence),
            )
        )
        self.calls.append(action)


async def run_scripted_workflow(
    model: FakeModel,
    authority: Authority,
    tools: RecordingTools,
    approved_action_ids: frozenset[str] = frozenset(),
) -> frozenset[str]:
    active_capabilities = authority.capabilities
    action_number = 0

    while True:
        step = model.next()
        if step.kind == "final":
            model.assert_complete()
            return active_capabilities
        if step.kind == "handoff":
            active_capabilities = (
                active_capabilities & step.requested_capabilities
            )
            continue

        assert step.action is not None
        action_number += 1
        action_id = f"ACTION_EXAMPLE_{action_number}"
        scoped = Authority(
            tenant_id=authority.tenant_id,
            capabilities=active_capabilities,
            verified_destination=authority.verified_destination,
        )
        result = evaluate(step.action, scoped)
        event_name = "policy_allow" if result.decision == "allow" else "policy_decision"
        policy_event = AuditEvent(
            sequence=len(tools.events),
            event=event_name,
            action_id=action_id,
            decision=result.decision,
            parent_id=None,
        )
        tools.events.append(policy_event)

        permit = policy_event
        if result.decision == "ask":
            if action_id not in approved_action_ids:
                continue
            permit = AuditEvent(
                sequence=len(tools.events),
                event="approval_allow",
                action_id=action_id,
                decision="allow",
                parent_id=str(policy_event.sequence),
            )
            tools.events.append(permit)
        elif result.decision != "allow":
            continue

        await tools.execute(action_id, step.action, permit)


def powerset(values: set[str]) -> list[frozenset[str]]:
    ordered = sorted(values)
    return [
        frozenset(items)
        for size in range(len(ordered) + 1)
        for items in combinations(ordered, size)
    ]


def assert_effects_have_permits(events: list[AuditEvent]) -> None:
    for index, event in enumerate(events):
        if event.event != "effect":
            continue
        preceding = events[:index]
        assert any(
            candidate.action_id == event.action_id
            and candidate.event in {"policy_allow", "approval_allow"}
            and candidate.decision in {"allow", "ask"}
            for candidate in preceding
        )


def test_policy_table() -> None:
    authority = Authority(
        tenant_id="TENANT_EXAMPLE_A",
        capabilities=frozenset({"ticket:read", "reply:send"}),
        verified_destination="customer@example.invalid",
    )
    cases = [
        (Action("read_ticket", "TENANT_EXAMPLE_A"), "allow", "TENANT_SCOPED_READ"),
        (Action("read_ticket", "TENANT_EXAMPLE_B"), "block", "TENANT_MISMATCH"),
        (
            Action("send_reply", "TENANT_EXAMPLE_A", "other@example.invalid"),
            "block",
            "DESTINATION_NOT_VERIFIED",
        ),
        (
            Action("send_reply", "TENANT_EXAMPLE_A", "customer@example.invalid"),
            "ask",
            "HUMAN_REVIEW_REQUIRED",
        ),
    ]
    for action, decision, reason in cases:
        result = evaluate(action, authority)
        assert (result.decision, result.reason) == (decision, reason)


def test_failure_policy() -> None:
    expected = {
        DependencyFailure.AUTHORIZATION_TIMEOUT: "block",
        DependencyFailure.DETECTOR_TIMEOUT: "quarantine",
        DependencyFailure.OPTIONAL_SUMMARIZER_TIMEOUT: "degrade",
    }
    for failure, decision in expected.items():
        assert failure_policy(failure).decision == decision


def test_retry_timeout_and_cancellation() -> None:
    read_state, read_ledger = recover_attempts(
        [AttemptOutcome.TIMEOUT_BEFORE_DISPATCH, AttemptOutcome.SUCCESS],
        side_effecting=False,
    )
    assert (read_state, read_ledger.attempts, read_ledger.effects) == (
        "completed",
        2,
        [],
    )

    effect_state, effect_ledger = recover_attempts(
        [AttemptOutcome.TIMEOUT_AFTER_DISPATCH, AttemptOutcome.SUCCESS],
        side_effecting=True,
    )
    assert effect_state == "quarantined"
    assert effect_ledger.attempts == 1
    assert effect_ledger.effects == ["EFFECT_OUTCOME_UNKNOWN"]

    cancel_state, cancel_ledger = recover_attempts(
        [AttemptOutcome.CANCELLED, AttemptOutcome.SUCCESS],
        side_effecting=True,
    )
    assert cancel_state == "cancelled"
    assert cancel_ledger.descendants_cancelled is True
    assert cancel_ledger.effects == []


def test_authority_monotonicity() -> None:
    universe = {"ticket:read", "reply:send", "account:write"}
    actions = [
        Action("read_ticket", "TENANT_EXAMPLE_A"),
        Action("send_reply", "TENANT_EXAMPLE_A", "customer@example.invalid"),
    ]
    for granted in powerset(universe):
        for reduced in powerset(set(granted)):
            for action in actions:
                larger = evaluate(
                    action,
                    Authority("TENANT_EXAMPLE_A", granted, "customer@example.invalid"),
                )
                smaller = evaluate(
                    action,
                    Authority("TENANT_EXAMPLE_A", reduced, "customer@example.invalid"),
                )
                assert not (
                    larger.decision == "block" and smaller.decision == "allow"
                )


async def test_workflow_trajectories() -> None:
    authority = Authority(
        "TENANT_EXAMPLE_A",
        frozenset({"ticket:read", "reply:send"}),
        "customer@example.invalid",
    )

    allowed_tools = RecordingTools()
    allowed_model = FakeModel(
        [
            ModelStep(
                "tool",
                "read_support_ticket",
                Action("read_ticket", "TENANT_EXAMPLE_A"),
            ),
            ModelStep("final", "summarize"),
        ]
    )
    await run_scripted_workflow(allowed_model, authority, allowed_tools)
    assert [call.name for call in allowed_tools.calls] == ["read_ticket"]
    assert_effects_have_permits(allowed_tools.events)

    attacked_tools = RecordingTools()
    attacked_model = FakeModel(
        [
            ModelStep(
                "tool",
                "send_reply",
                Action("send_reply", "TENANT_EXAMPLE_A", "other@example.invalid"),
            ),
            ModelStep("final", "refuse_unsafe_destination"),
        ]
    )
    await run_scripted_workflow(attacked_model, authority, attacked_tools)
    assert attacked_tools.calls == []

    handed_off_tools = RecordingTools()
    handed_off_model = FakeModel(
        [
            ModelStep(
                "handoff",
                "evidence_reader",
                requested_capabilities=frozenset({"ticket:read", "account:write"}),
            ),
            ModelStep(
                "tool",
                "send_reply",
                Action("send_reply", "TENANT_EXAMPLE_A", "customer@example.invalid"),
            ),
            ModelStep("final", "return_to_parent"),
        ]
    )
    child_capabilities = await run_scripted_workflow(
        handed_off_model, authority, handed_off_tools
    )
    assert child_capabilities == frozenset({"ticket:read"})
    assert handed_off_tools.calls == []


test_policy_table()
test_failure_policy()
test_retry_timeout_and_cancellation()
test_authority_monotonicity()
asyncio.run(test_workflow_trajectories())
```

This suite does not ask whether a model recognizes an attack. It proves that a cross-tenant read blocks, an unverified destination produces no call, delegated authority can only shrink, and every recorded effect has causal permission evidence.

## Make retries and cancellation part of the contract

Retries are security-relevant because an effect may have completed even when its response timed out. Model retries and read-only fetch retries can be safe when they are bounded. Retrying a send or credit action needs an idempotency key plus reconciliation against the external system.

Write separate cases for:

- Timeout before any executor call, which should produce zero effects.
- Timeout after dispatch with an unknown outcome, which should quarantine the action until reconciliation.
- Cancellation while a child or subprocess is running, which should stop new work and verify descendant termination.
- Retry advice for a read-only model or adapter call, which should respect an attempt and time budget.
- Duplicate delivery of the same tool call, which should return the existing effect receipt rather than execute twice.

Do not collapse these cases into a generic exception test. Their recovery policies differ.

## Test the audit-to-effect boundary independently

A workflow test can accidentally use the same faulty helper for both implementation and assertion. Add a smaller executor contract that rejects a missing or mismatched permit.

```typescript
import assert from "node:assert/strict";

type CanonicalAction = {
  id: string;
  digest: string;
  destination: string;
};

type Permit = {
  actionId: string;
  actionDigest: string;
  kind: "policy_allow" | "approval_allow";
  policyVersion: string;
};

type EvidenceEvent =
  | { sequence: number; type: "permit"; permit: Permit }
  | {
      sequence: number;
      type: "effect";
      actionId: string;
      actionDigest: string;
      receiptId: string;
    };

class RecordingExecutor {
  readonly calls: CanonicalAction[] = [];
  readonly events: EvidenceEvent[] = [];

  recordPermit(permit: Permit): void {
    this.events.push({
      sequence: this.events.length,
      type: "permit",
      permit: structuredClone(permit),
    });
  }

  execute(action: CanonicalAction, permit: Permit): string {
    assert.equal(permit.actionId, action.id, "PERMIT_ACTION_MISMATCH");
    assert.equal(permit.actionDigest, action.digest, "PERMIT_DIGEST_MISMATCH");
    const preceding = this.events.find(
      (event) =>
        event.type === "permit" &&
        event.permit.actionId === action.id &&
        event.permit.actionDigest === action.digest,
    );
    assert.ok(preceding, "MISSING_PRECEDING_PERMIT");

    this.calls.push(structuredClone(action));
    const receiptId = `EFFECT_EXAMPLE_${this.calls.length}`;
    this.events.push({
      sequence: this.events.length,
      type: "effect",
      actionId: action.id,
      actionDigest: action.digest,
      receiptId,
    });
    return receiptId;
  }
}

function assertEveryEffectHasPriorPermit(events: readonly EvidenceEvent[]): void {
  for (const effect of events) {
    if (effect.type !== "effect") continue;
    assert.ok(
      events.some(
        (candidate) =>
          candidate.sequence < effect.sequence &&
          candidate.type === "permit" &&
          candidate.permit.actionId === effect.actionId &&
          candidate.permit.actionDigest === effect.actionDigest,
      ),
      `effect ${effect.receiptId} has no preceding permit`,
    );
  }
}

const executor = new RecordingExecutor();
const action: CanonicalAction = {
  id: "ACTION_EXAMPLE_REPLY_1",
  digest: "DIGEST_EXAMPLE_REPLY_1",
  destination: "customer@example.invalid",
};
const permit: Permit = {
  actionId: action.id,
  actionDigest: action.digest,
  kind: "approval_allow",
  policyVersion: "support-policy-v6",
};

assert.throws(() => executor.execute(action, permit), /MISSING_PRECEDING_PERMIT/);
assert.equal(executor.calls.length, 0);
executor.recordPermit(permit);
assert.equal(executor.execute(action, permit), "EFFECT_EXAMPLE_1");
assertEveryEffectHasPriorPermit(executor.events);

assert.throws(
  () =>
    executor.execute(action, {
      ...permit,
      actionDigest: "DIGEST_EXAMPLE_DIFFERENT",
    }),
  /PERMIT_DIGEST_MISMATCH/,
);
assert.equal(executor.calls.length, 1);
```

The executor does not trust an `allow` string supplied beside the call. It requires a previously recorded permit bound to the canonical action and digest. Production code should also bind actor, tenant, expiration, idempotency key, and mutable authorization facts.

## Test audit-event contracts like APIs

Audit events are inputs to incident response, security analytics, and release evidence. Contract-test required identifiers, version fields, decisions, parent links, and redaction before events reach storage.

Useful negative cases include:

- Missing trace, run, action, policy, or tool-definition identifiers.
- An effect whose parent is a model proposal rather than an allow or approval.
- Duplicate call IDs with different canonical arguments.
- Approval digest mismatch after an edit.
- Raw credentials, complete private messages, or unrestricted tool output in evidence fields.
- An unknown policy result being repaired to `allow` by an adapter.

Reject invalid evidence at ingestion or quarantine the run. Silently dropping the field makes a later bypass impossible to explain.

## Know what deterministic tests cannot prove

Fakes are strongest when they replace a boundary your application understands. They cannot establish:

- Whether a live model will choose the right tool, refuse an adaptive attack, or preserve utility across paraphrases.
- Whether a hosted tool applies the documented filter, approval, network, or retention behavior.
- Whether an OS sandbox, container, or remote worker actually enforces filesystem and process isolation.
- Whether provider serialization, streaming, authentication, rate limits, and retries match the normalized SDK boundary.
- Whether reviewers understand a deceptive approval request under realistic workload and time pressure.

Keep provider adapter contracts and sandbox integration checks below the fake. Put model behavior and reviewer deception into repeated adversarial evals above it. Part 12 builds that layer.

## Tradeoffs and residual risk

Scripted trajectories are fast and diagnostic, but they can mirror the implementation too closely. Property tests explore combinations, but poor generators omit dangerous states. Recording executors prove call ordering, not the behavior of a real external service. Failure injection can reproduce known timing points while missing a race in production.

Residual risk includes shared bugs in test and production policy, incomplete capability models, adapters that bypass the tested executor, provider-owned behavior outside the fake, unstable distributed cancellation, and effects that complete without a receipt. Counter these with independent assertions, controlled integration environments, telemetry reconciliation, and live-model evals.

## Common failure modes

- **Transcript snapshots**: Treating prose changes as failures while missing unchanged external effects.
- **Direct function tests only**: Calling a tool function without exercising the workflow guardrail and approval path.
- **Success-path scripts**: Omitting denial, timeout, cancellation, duplicate, and malformed-result cases.
- **Self-authored evidence**: Letting the model or tool claim that policy allowed the action.
- **Fresh retry**: Repeating a side effect without an idempotency key or reconciliation.
- **Non-monotone delegation**: Allowing a smaller capability set to unlock a path that the parent could not use.
- **Unfinished fake**: Forgetting to assert that every scripted model step was consumed.
- **Fake certainty**: Using deterministic tests to claim a live model resists prompt injection.

## Series navigation

- Previous: [Part 10: OpenAI Agents and Codex SDK Guardrails](../2026-09-01-openai-agents-codex-sdk-guardrails/)
- Next: [Part 12: Adversarial Evals and Security-Utility Measurement](../2026-09-01-adversarial-ai-security-evals/)
- Series index: [Engineering Guardrails for AI Systems](../series/engineering-ai-guardrails/)

## References

- [Testing, OpenAI Agents SDK](https://openai.github.io/openai-agents-python/testing/)
- [Testing, OpenAI Agents SDK for TypeScript](https://openai.github.io/openai-agents-js/guides/testing/)
- [AI Agent Security Cheat Sheet, OWASP](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html)
- [Artificial Intelligence Risk Management Framework, NIST](https://www.nist.gov/itl/ai-risk-management-framework)

## Related topics

- [Evaluation and methods](../../topics/ai/benchmarks/evaluation-and-methods/)
- [Agent benchmarks](../../topics/ai/benchmarks/agent-benchmarks/)
- [Tool calls, approvals, and least privilege](../2026-09-01-ai-tool-calls-approvals-least-privilege/)
- [Agents, delegation, and guardrail propagation](../2026-09-01-agent-delegation-guardrail-propagation/)
