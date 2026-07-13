---
title: Structured Outputs
description: "JSON mode, schema-constrained decoding, tool use, function calling, validation, retries, and failure modes for structured LLM outputs."
parent: prompt-engineering
tags: [llm, json, function-calling, tool-use]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## Why free-form output breaks systems

Free-form text is useful for conversation and explanation. It is fragile as an interface between systems. A downstream service wants fields, types, enum values, nullability, and predictable error handling. A paragraph with "sure, here is the JSON" wrapped around a malformed object is not an API contract.

Structured outputs turn model responses into machine-readable data. The goal is not prettier JSON. The goal is to reduce parser failures, remove ambiguous fields, make validation explicit, and keep the model from inventing shapes the application cannot handle.

There is a spectrum. At the weak end, a prompt asks for a format and hopes the model follows it. At the strong end, the model is constrained by a schema or tool-call interface so invalid token sequences cannot be emitted.

## Key ideas

- **Instruction plus examples**: The prompt shows the target shape. This is easy and portable, but it fails under long outputs, adversarial inputs, rare edge cases, or model upgrades.
- **JSON mode**: The provider biases or constrains output toward valid JSON. This is stronger than a prompt, but JSON validity alone does not guarantee the right schema.
- **Schema-constrained decoding**: A schema restricts valid output tokens during decoding. This can prevent off-schema fields, wrong types, missing required fields, and malformed nesting.
- **Tool use or function calling**: The model emits a typed tool call with a name and arguments. This is structured output with an action label. It is often the cleanest abstraction even when the "tool" is a local handler.
- **Post-generation validation**: Even with schema support, validate the output in application code. The schema controls shape, not truth.

## When to use it

Use structured outputs when the response crosses a system boundary:

- extraction into database fields
- classification into fixed categories
- routing to a workflow
- generating API arguments
- summarizing into a report object
- returning UI state for a client component
- producing test cases, fixtures, or config fragments

If a human will read and interpret the answer, free text may be fine. If code will parse and execute the answer, use structure.

## Schema design rules

Keep schemas boring. Small schemas outperform clever ones because the model has fewer opportunities to misunderstand the contract.

- Prefer enums over free-text labels when the set is known.
- Use nullable fields instead of magic strings such as `"unknown"` or `"not_applicable"`.
- Separate facts from reasoning. A short `rationale` field is useful for review, but code should rely on the typed fields.
- Keep dates, money, units, and identifiers explicit.
- Add confidence only if the application knows what to do with it.
- Version schemas that persist or feed other services.

The schema should encode business meaning, not only JSON shape. For example, `priority: "high" | "medium" | "low"` is better than `priority: string`, but it still needs documentation that tells reviewers what makes a ticket high priority.

## Failure modes

- **Valid shape, false content**: The output parses but the extracted fact is wrong. Validation cannot fix hallucinated content.
- **Over-wide schemas**: A large schema with many optional fields invites sparse, inconsistent objects.
- **Hidden coercion**: Parsers that silently coerce `"5"` into `5` or unknown enum values into defaults can hide model errors.
- **Retry loops without limits**: "Try again with valid JSON" can mask deeper prompt or schema problems. Keep retry budgets small and log failures.
- **Tool calls as authority**: A well-formed tool call is only a request. The harness still decides whether the action is allowed.

## Practical checklist

- Use provider-native structured output or tool calling when available.
- Validate every response against the application schema.
- Keep schemas small, typed, and versioned.
- Log raw output, parsed output, validation errors, and retry count.
- Treat successful parsing as an interface guarantee, not as a truth guarantee.

## References

- [Structured Outputs, OpenAI](https://platform.openai.com/docs/guides/structured-outputs)
- [Tool use, Anthropic Claude Docs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [Instructor (Python)](https://python.useinstructor.com/)
- [Outlines (HuggingFace)](https://github.com/dottxt-ai/outlines)

## Related topics

- [Prompt templates](../templates/), where schema-driven prompting fits
- [Tool design and schema discipline](../../harness-development/tool-design/), structured arguments for agent tools
- [Context window management](../context-window-management/), placing schema and examples where the model can use them
- [API design](../../../system-design/api-design/), the same contract discipline outside LLM systems
