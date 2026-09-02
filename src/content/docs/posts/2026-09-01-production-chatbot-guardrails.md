---
title: Guardrails for Production Chatbots
description: "Build a text chatbot request path with identity, deterministic validation, structured screening, output policy, safe fallback behavior, abuse controls, latency budgets, and executable TypeScript and Python tests."
date: 2026-09-01
tags: [ai, guardrails, chatbots, security, testing]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-09-01-production-chatbot-guardrails/
series:
  slug: engineering-ai-guardrails
  order: 5
---

This is part 5 of the [Engineering Guardrails for AI Systems series](../series/engineering-ai-guardrails/).

A customer asks a support chatbot to explain why a payment failed. The message also contains the words "prompt injection" because the customer suspects a browser extension changed the page. A keyword filter refuses the request.

The filter stopped a harmless support question and learned nothing about who was calling, which account they could access, or whether the eventual answer would expose private data. A production request path needs separate controls for separate risks.

## Begin with a text-only boundary

Keep the first design small: authenticated text arrives, the application assembles approved context, a model drafts a structured response, and the application decides whether to release it.

```text
caller -> identity and quota -> normalized input
                              -> moderation screen --+
                              -> injection screen  --+-> model draft
                                                         |
                                       structured output + egress policy
                                                         |
                                              release or safe fallback
```

Do not let message text establish identity or account ownership. The host supplies a verified actor, tenant, account allowlist, request ID, and policy version. The text remains untrusted even when the caller is authenticated.

## Give each control one job

| Control | Question | Typical evidence | Not a substitute for |
| --- | --- | --- | --- |
| Content moderation | Does this input or output fall into a harmful-content category? | Category, score, model version | Injection detection or authorization |
| Injection detection | Does content appear to manipulate instructions or control flow? | Verdict, confidence, source | Resource and action authorization |
| Application authorization | May this actor access this tenant, account, or operation? | Subject, resource, action, policy | Content safety or model correctness |

A safe technical discussion can mention attacks without attempting one. An injection classifier can miss an attack. An authorized user can still request harmful content. Keep the decisions and their failure modes distinct.

## Normalize before policy

Deterministic checks should reject malformed work before any model call:

- Require authenticated caller and tenant context.
- Decode and normalize text once, then enforce byte and character limits.
- Reject control characters that the product does not support.
- Validate locale and conversation identifiers against allowlists or strict formats.
- Apply per-actor, per-tenant, and per-network abuse limits.
- Load only records that server-side authorization permits.

Normalization must not silently change the meaning of a message. Preserve the original input digest for evidence, but pass only the bounded normalized form to later stages.

## Use structured screening as detection

An optional model screen should return a small schema such as:

```json
{
  "moderation": "allow",
  "injection": "uncertain",
  "reasonCode": "AMBIGUOUS_SECURITY_DISCUSSION"
}
```

Define what `uncertain`, timeout, malformed output, and provider failure mean before deployment. For this support bot:

- A timeout enters degraded mode. The bot may answer public product questions but cannot retrieve account context.
- A high-confidence content violation is refused with an appeal path.
- A suspected injection removes untrusted retrieved context and disables actions. It does not claim the user is malicious.
- A safe verdict does not grant access to an account or tool.

Screening can run in parallel with independent account lookup when the lookup itself is authorized and its result is not released early. If a failed screen must prevent model spend or all downstream work, run it as a blocking gate.

## Constrain and inspect the draft

Ask the model for a response object, not an unstructured effect:

```typescript
type Draft = {
  answer: string;
  citedFactIds: string[];
  requestedAction: "none";
};
```

Schema validity is the start of output policy. Before release, verify cited facts came from the authorized context, redact forbidden data classes, cap length, and withhold output when required checks are unavailable. Streaming requires incremental policy or buffered release. A final check cannot retract tokens that the client already displayed.

## A TypeScript request path

The following handler puts deterministic checks before optional screening and puts egress policy before release. Its adapters are fake so the tests can assert effects without a live model or account system.

```typescript
import assert from "node:assert/strict";

type Caller = {
  actorId: string;
  tenantId: string;
  allowedAccountIds: readonly string[];
};

type Request = { accountId: string; message: string };
type Screen = "allow" | "block" | "uncertain" | "timeout";
type Draft = { answer: string; citedFactIds: string[]; requestedAction: "none" };
type Reply = { status: "released" | "refused" | "degraded"; text: string };

type Adapters = {
  screen(text: string): Promise<Screen>;
  generate(input: { message: string; facts: readonly string[] }): Promise<Draft>;
};

function normalize(message: string): string {
  const value = message.normalize("NFKC").trim();
  if (value.length === 0 || value.length > 2_000 || /[\u0000-\u0008]/u.test(value)) {
    throw new Error("INVALID_INPUT");
  }
  return value;
}

function authorizedFacts(caller: Caller, accountId: string): readonly string[] {
  if (!caller.allowedAccountIds.includes(accountId)) {
    throw new Error("ACCOUNT_NOT_AUTHORIZED");
  }
  return [`fact:${accountId}:payment-status=declined`, "fact:support-phone=public"];
}

function release(draft: Draft, allowedFacts: readonly string[]): Reply {
  if (draft.requestedAction !== "none") throw new Error("ACTION_NOT_ALLOWED");
  if (draft.citedFactIds.some((id) => !allowedFacts.includes(id))) {
    throw new Error("UNAUTHORIZED_FACT");
  }
  const redacted = draft.answer.replace(/customer-secret-[a-z0-9]+/giu, "[REDACTED]");
  return { status: "released", text: redacted.slice(0, 1_000) };
}

async function handleChat(
  caller: Caller,
  request: Request,
  adapters: Adapters,
): Promise<Reply> {
  if (!caller.actorId || !caller.tenantId) throw new Error("UNAUTHENTICATED");
  const message = normalize(request.message);
  const facts = authorizedFacts(caller, request.accountId);
  const screen = await adapters.screen(message);

  if (screen === "block") {
    return { status: "refused", text: "I cannot help with that request. You can appeal this decision." };
  }
  if (screen === "timeout" || screen === "uncertain") {
    const publicFacts = facts.filter((fact) => fact.includes("support-phone=public"));
    const draft = await adapters.generate({ message, facts: publicFacts });
    return { ...release(draft, publicFacts), status: "degraded" };
  }

  return release(await adapters.generate({ message, facts }), facts);
}

const caller: Caller = {
  actorId: "ACTOR_EXAMPLE_1",
  tenantId: "TENANT_EXAMPLE_A",
  allowedAccountIds: ["ACCOUNT_EXAMPLE_1"],
};

async function expectError(run: () => Promise<unknown>, code: string) {
  await assert.rejects(run, (error: Error) => error.message === code);
}

await expectError(
  () => handleChat(caller, { accountId: "ACCOUNT_EXAMPLE_1", message: "" }, {
    screen: async () => "allow",
    generate: async () => ({ answer: "unused", citedFactIds: [], requestedAction: "none" }),
  }),
  "INVALID_INPUT",
);

let modelCalls = 0;
const refused = await handleChat(caller, {
  accountId: "ACCOUNT_EXAMPLE_1",
  message: "Synthetic policy-violating request",
}, {
  screen: async () => "block",
  generate: async () => {
    modelCalls += 1;
    return { answer: "unused", citedFactIds: [], requestedAction: "none" };
  },
});
assert.equal(refused.status, "refused");
assert.equal(modelCalls, 0);

const benign = await handleChat(caller, {
  accountId: "ACCOUNT_EXAMPLE_1",
  message: "Could a prompt injection change this payment page?",
}, {
  screen: async () => "allow",
  generate: async () => ({
    answer: "The payment was declined. Reference customer-secret-demo only internally.",
    citedFactIds: ["fact:ACCOUNT_EXAMPLE_1:payment-status=declined"],
    requestedAction: "none",
  }),
});
assert.equal(benign.status, "released");
assert.match(benign.text, /\[REDACTED\]/u);

const degraded = await handleChat(caller, {
  accountId: "ACCOUNT_EXAMPLE_1",
  message: "Where can I call support?",
}, {
  screen: async () => "timeout",
  generate: async ({ facts }) => ({
    answer: "Use the public support number.",
    citedFactIds: [facts[0]],
    requestedAction: "none",
  }),
});
assert.equal(degraded.status, "degraded");
```

The malformed request fails before screening. The policy violation never reaches the model. The benign hard negative passes despite mentioning prompt injection. The output check redacts a synthetic secret marker. The timeout test proves degraded mode sees only public facts.

## The same boundary in Python

Parallel implementations should preserve decisions and reason codes even when language idioms differ.

```python
from dataclasses import dataclass
import re


@dataclass(frozen=True)
class Caller:
    actor_id: str
    tenant_id: str
    allowed_accounts: frozenset[str]


def normalize(message: str) -> str:
    value = " ".join(message.split())
    if not value or len(value) > 2_000:
        raise ValueError("INVALID_INPUT")
    return value


def output_policy(answer: str) -> str:
    return re.sub(r"customer-secret-[a-z0-9]+", "[REDACTED]", answer, flags=re.I)[:1_000]


def handle_chat(caller, account_id, message, screen, generate):
    if not caller.actor_id or not caller.tenant_id:
        raise PermissionError("UNAUTHENTICATED")
    text = normalize(message)
    if account_id not in caller.allowed_accounts:
        raise PermissionError("ACCOUNT_NOT_AUTHORIZED")

    verdict = screen(text)
    if verdict == "block":
        return {"status": "refused", "text": "Request blocked. Appeal is available."}

    facts = [f"fact:{account_id}:payment-status=declined", "fact:support-phone=public"]
    if verdict in {"timeout", "uncertain"}:
        facts = [fact for fact in facts if fact.endswith("=public")]
        status = "degraded"
    else:
        status = "released"

    draft = generate(text, facts)
    if any(fact not in facts for fact in draft["cited_fact_ids"]):
        raise PermissionError("UNAUTHORIZED_FACT")
    return {"status": status, "text": output_policy(draft["answer"])}


caller = Caller("ACTOR_EXAMPLE_1", "TENANT_EXAMPLE_A", frozenset({"ACCOUNT_EXAMPLE_1"}))
reply = handle_chat(
    caller,
    "ACCOUNT_EXAMPLE_1",
    "Where can I call support?",
    lambda _text: "timeout",
    lambda _text, facts: {
        "answer": "Use support. Do not release customer-secret-demo.",
        "cited_fact_ids": [facts[0]],
    },
)
assert reply == {"status": "degraded", "text": "Use support. Do not release [REDACTED]."}
```

## Budget the latency

Measure percentiles by decision path, not only one average.

| Stage | Example p95 budget | Parallel? | Must block release? |
| --- | ---: | --- | --- |
| Identity, quota, normalization | 20 ms | Identity and quota may overlap | Yes |
| Authorized context lookup | 120 ms | Yes, after identity | Yes for account answers |
| Moderation and injection screens | 180 ms | Yes with each other | Per declared failure policy |
| Main model draft | 1,500 ms | Starts after required blocking gates | Yes |
| Schema and egress policy | 40 ms | Some redaction checks can overlap | Yes |
| Total request | 1,860 ms | Track by release, refusal, and degraded path | Yes |

Parallel work saves time only when cancellation and side-effect rules are clear. If a blocking screen fails after model generation starts, the application may have spent tokens, but it still must prevent release. Do not start account lookup before identity and tenant authorization merely to improve the chart.

Measure utility beside safety:

- False refusal rate on benign security, medical, legal, and emotionally charged support discussions.
- Appeal overturn rate by reason code and policy version.
- Timeout and degraded-mode rate.
- p50, p95, and p99 latency for released, refused, and degraded requests.
- Redaction frequency and unauthorized-fact blocks.
- Repeated-abuse rate per privacy-preserving actor identifier.

## Design refusal and abuse behavior

A refusal should state what cannot be done, offer a safe adjacent path when one exists, and provide an appeal route for consequential errors. Do not reveal detector thresholds or echo an attack payload.

Repeated violations can move through warning, slower rate limits, temporary suspension, and human review. Base escalation on authenticated history and stable reason codes. One uncertain classifier response should not brand a user as malicious.

## Tradeoffs and residual risk

Every blocking screen adds latency, failure modes, and false refusals. Degraded mode preserves availability but answers fewer account-specific questions. Buffering output improves egress enforcement but delays the first visible token. Parallel screening reduces latency but may spend model tokens before a late block.

Residual risk remains in classifier misses, unsafe but policy-compliant answers, stale authorization data, faulty redaction, compromised adapters, and sensitive details inferred from allowed facts. A chatbot without tools has less authority than an agent, but released text can still disclose data or mislead a user.

## Common failure modes

- **Keyword policy**: Benign technical discussion is refused while paraphrased abuse passes.
- **Anonymous quota**: Attackers rotate sessions because limits are not tied to a stable privacy-preserving identity.
- **Screen equals authorization**: An `allow` verdict unlocks account context without a resource check.
- **Unspecified timeout**: Provider failure silently becomes fail open.
- **Schema-only output check**: Valid JSON still contains unauthorized facts.
- **Post-stream inspection**: The client already displayed content before the block.
- **No appeal telemetry**: False refusals remain invisible.

## Series navigation

- Previous: [Part 4: Prompt Injection and Control-Data Separation](../2026-09-01-prompt-injection-control-data-separation/)
- Next: [Part 6: Tool Calls, Approvals, and Least Privilege](../2026-09-01-ai-tool-calls-approvals-least-privilege/)
- Series index: [Engineering Guardrails for AI Systems](../series/engineering-ai-guardrails/)

## References

- [Mitigate jailbreaks and prompt injections, Anthropic](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks)
- [Moderations API reference, OpenAI](https://developers.openai.com/api/reference/resources/moderations/methods/create)
- [Safety best practices, OpenAI](https://developers.openai.com/api/docs/guides/safety-best-practices)
- [OWASP LLM01: Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [OWASP LLM02: Sensitive Information Disclosure](https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/)

## Related topics

- [Prompt injection defense](../../topics/ai/prompt-engineering/prompt-injection-defense/)
- [Permission and trust models](../../topics/ai/harness-development/permission-models/)
- [Unit testing](../../topics/testing/unit-tests/)
- [Layered guardrail architecture](../2026-09-01-layered-ai-guardrail-architecture/)
