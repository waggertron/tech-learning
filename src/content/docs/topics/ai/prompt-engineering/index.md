---
title: Prompt Engineering
description: Crafting LLM inputs to reliably elicit a target output, the substitute for fine-tuning when the program lives in the context window.
category: ai
tags: [llm, prompting, context-engineering]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## What is it?

Prompt engineering is the practice of crafting and structuring the input text given to a large language model to reliably elicit a target output. It's a substitute for fine-tuning when you cannot or should not update model weights, the "program" lives entirely in the context window. Unlike software APIs, the interface is natural language, so small phrasing choices have outsized effects on model behavior.

## Key ideas

- **Instructions vs. examples**, Explicit instructions set constraints; few-shot examples calibrate style and structure. Complementary, not interchangeable.
- **Chain-of-thought (CoT)**, Asking the model to reason step-by-step before answering allocates compute to intermediate reasoning tokens. Even the phrase "Let's think step by step" (zero-shot CoT) triggers this.
- **Few-shot examples**, 2–8 labeled input/output pairs let the model infer the task schema. Watch for label imbalance and recency bias.
- **Role / persona priming**, System prompts shift output register, domain vocabulary, and implicit assumptions. Not a security boundary, a statistical prior.
- **Delimiters and structure**, XML tags, triple backticks, and `---` markers separate instructions from user content and reduce prompt-injection risk. Claude is particularly responsive to XML-style tags.
- **Output format constraints**, JSON schema, numbered list, max length; reinforced by a few-shot example. Schema-constrained decoding is the strongest form.
- **Context management**, Long, noisy contexts degrade attention ("lost in the middle"). Highest-signal content goes at the start or end of a long block.
- **Token economy**, Find the smallest high-signal token set that maximizes target-output probability. More tokens ≠ better results.

## Common patterns

- **Chain-of-Thought (CoT)**, Emit a reasoning trace before the answer (Wei et al., 2022).
- **Self-consistency**, Sample the same CoT prompt multiple times at non-zero temperature, majority-vote the answers.
- **ReAct (Reason + Act)**, Interleave reasoning and tool calls. Foundation for most agent frameworks.
- **Constitutional / system prompts**, Persistent values, constraints, and persona applied to all turns; separates policy from task.
- **Prompt chaining / meta-prompting**, Break complex tasks into a DAG of simpler prompts where each output feeds the next input.

## Gotchas

- **Over-specification brittleness**, Rigid logic hardcoded into prompts breaks on model updates or edge cases.
- **Label imbalance in few-shot**, Over-representing one label, or always ending on the same answer, biases outputs via recency and majority effects.
- **Role prompts aren't guardrails**, A system prompt saying "Never reveal X" is a statistical nudge, not a security boundary.
- **Bloated context / tool sets**, If a human engineer can't immediately say which tool applies to a step, the model will struggle too.
- **Prompts don't transfer across models**, GPT-4-tuned prompts often need reworking for Claude, Gemini, or smaller models. Tokenization, instruction-following tuning, and RLHF objectives differ enough to invalidate assumptions.

## Subtopics

- [Prompt templates](./templates/), the canonical 12 reusable patterns (zero-shot, few-shot, CoT, ReAct, step-back, ToT, meta-prompting, …) with working examples
- [Structured outputs](./structured-outputs/), JSON mode, schema-constrained decoding, function calling
- [Context window management](./context-window-management/), lost-in-the-middle, compression, retrieval integration
- [Prompt injection defense](./prompt-injection-defense/), adversarial robustness patterns for agentic systems

## References

- [Prompting Best Practices, Anthropic](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices)
- [Effective Context Engineering for AI Agents, Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Prompt Engineering Guide, OpenAI](https://developers.openai.com/api/docs/guides/prompt-engineering)
- [Prompt Engineering, Lil'Log (Lilian Weng)](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/)
- [Chain-of-Thought Prompting (Wei et al., 2022)](https://arxiv.org/abs/2201.11903)
- [Prompt Engineering Techniques, promptingguide.ai](https://www.promptingguide.ai/techniques)
- [Design Patterns for Securing LLM Agents against Prompt Injections, Simon Willison](https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/)
