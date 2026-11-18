---
title: "Grok and Morse code: a reported prompt injection case study"
description: "Separate the reported Grok wallet incident from inferred filter behavior, then trace the authorization and execution controls that an encoded instruction should not bypass."
date: 2026-05-23
tags: [security, ai, prompt-injection, llm, agentic-ai]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-05-23-grok-morse-code-prompt-injection/
---

Reports published in May 2026 describe an attacker using an encoded message to cause Grok to initiate a transfer from a connected Bankr wallet. Giskard reports a transfer of three billion DRB tokens, with estimated value around $150,000-$174,000, followed by a return of roughly 80% of the funds. Those amounts and the return percentage are reported figures, not independently verified accounting in this article.

The transferable lesson is the boundary between interpreting text and authorizing an external action. Translating a message is not consent to execute it.

## What is reported and what remains unknown

Giskard's incident account and NeuralTrust's analysis describe two steps: wallet capability changed after receipt of a membership NFT, then a Morse-code translation request produced a transfer instruction that reached execution. These are secondary accounts. They do not supply a complete internal execution trace showing every prompt, classifier decision, authorization check, or tool invocation.

| Claim | Evidence boundary |
| --- | --- |
| An encoded message was associated with a DRB transfer | Reported by the linked incident accounts |
| A membership NFT enabled a more capable wallet path | Reported explanation of the capability change |
| The precise dollar value and returned fraction | Reported estimates, sensitive to valuation and accounting |
| A particular safety classifier inspected only plaintext | Hypothesis, not established by the available execution evidence |
| Which exact control authorized each step | Not established by a complete public trace reviewed here |

Neither Morse code nor a dollar amount proves how a private safety layer was implemented. In particular, “the classifier could not see the payload” is a plausible explanation of some systems, not a demonstrated fact about this one.

## The reported sequence

```text
membership NFT received
          |
          v
wallet capability reportedly changes
          |
encoded translation request arrives
          |
          v
model produces a transfer instruction
          |
          v
connected integration reportedly executes a transfer
```

The important distinction is between provenance and representation. Text remains attacker-supplied when it is decoded, summarized, translated, retrieved, or repeated by a model. A transformation does not make that text an authorized command.

The reported membership step is a separate concern. Even if an account is eligible for a capability, the application still needs to determine who may initiate an action, which destination is allowed, and whether the requested action has current approval.

## Why encoding matters without proving a filter bypass

An encoded payload can hide its eventual meaning from a surface scan. NeuralTrust presents plaintext-filter explanations as possibilities rather than a verified internal trace. A model that translates the payload may reconstruct the instruction later, after an earlier inspection point.

Decoding and inspecting transformed content can improve detection. It cannot cover every representation or establish action authority. A safe executor still treats a generated tool call as a proposal and checks it against identity, capability, destination, amount, and approval policy.

For example, a translation feature can return decoded text while having no transfer tool at all. A separate payment workflow can require an authenticated actor to approve a canonical destination and amount. The translated text then has no path to grant those capabilities.

## The security categories

OWASP's prompt-injection category describes untrusted input changing behavior across a control/data boundary. Its excessive-agency category describes excessive functionality, permissions, or autonomy that turns unwanted model behavior into an external effect.

The reported sequence is useful for discussing both categories. That classification is an architectural interpretation of the reports, not a claim that a model prompt was the sole root cause. Capability assignment and deterministic integration behavior deserve investigation alongside model behavior.

## Controls at the action boundary

A transfer executor can reject an action even after the model proposes it. Its inputs include verified actor identity and server-owned permissions, not an authority claim copied from generated text.

A canonical action contains the exact asset, amount, destination, and relevant account. Policy validates those fields and binds any required approval to that same action. A changed destination or amount invalidates the approval. Revalidation immediately before execution prevents a stale proposal from gaining authority through an earlier decision.

Limits, idempotency, destination restrictions, and audit receipts then constrain the effect and support investigation. A short model refusal or a decode filter is not a substitute for those checks.

Permission upgrades are actions too. An externally received asset should not silently expand an agent's intended operating permissions merely because another subsystem recognizes membership. The host needs an explicit policy for capability changes and their approving actor.

## Recovery is not prevention

The reports describe a substantial voluntary return after the event. A return does not establish a reversible protocol, guaranteed recovery, or a successful preventative control. It is a reported outcome of this incident.

For an investigation, preserve action proposals, policy decisions, canonical approvals, capability changes, and external transaction receipts. Those artifacts help distinguish “the model said it” from “the executor accepted it” and identify the first control that could have prevented the effect.

## Use the case in a threat model

Ask where authority entered the workflow. Was it the wallet membership rule, the public message, a generated tool call, or a privileged integration? Then test that boundary directly:

- Translation output cannot grant a transfer capability.
- Untrusted text cannot select an authorized destination by assertion alone.
- A new wallet capability does not imply approval for an arbitrary action.
- Changing a proposed transfer invalidates prior approval.
- A rejected action produces no external transfer.

These are testable system properties. They remain useful even if later incident evidence changes the reported narrative.

## References

- [Giskard's Grok wallet incident account](https://www.giskard.ai/knowledge/how-grok-got-prompt-injected-an-x-user-drained-150-000-from-an-ai-wallet) supplies the reported sequence, amount estimates, and returned fraction.
- [NeuralTrust's analysis](https://neuraltrust.ai/blog/grok-morse-code) discusses encoded instructions and excessive agency. Treat its proposed filter mechanism as analysis rather than inspected internal behavior.
- [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) defines the prompt-injection and excessive-agency categories used here.

## Related topics

- [Engineering Guardrails for AI Systems](../series/engineering-ai-guardrails/), place enforceable controls between model proposals and effects.
- [Tool calls, approvals, and least privilege](../2026-09-01-ai-tool-calls-approvals-least-privilege/), bind approval to the exact executable action.
- [Trace guardrail bypasses](../2026-09-01-trace-guardrail-bypasses-boundary-hops/), distinguish causal evidence from plausible mechanisms.
- [Prompt injection defense](../../topics/ai/prompt-engineering/prompt-injection-defense/), preserve the control/data boundary.
