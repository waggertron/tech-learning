---
title: Prompt Templates
description: Canonical reusable prompt patterns, zero-shot, few-shot, chain-of-thought, role priming, ReAct, structured output, step-back, tree-of-thoughts, with concrete examples.
parent: prompt-engineering
tags: [llm, prompting, templates, cot, few-shot, react]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## Overview

Prompt engineering isn't a fresh invention per task, practitioners re-use a small catalog of named patterns. This page is a reference for those patterns with a runnable example under each. Pick the one that matches your problem shape rather than inventing from scratch.

Rough decision flow:

- Need the model to **classify or transform** with no context? → Zero-shot
- Task is **ambiguous** or has an unusual format? → Few-shot
- Arithmetic, logic, or **multi-step reasoning**? → Chain-of-Thought (+ Self-Consistency if accuracy matters)
- Agent needs to **call tools**? → ReAct
- Output must fit a **specific schema**? → Structured Output
- Task **depends on general principles** that should be retrieved first? → Step-Back Prompting
- Task **branches** with multiple valid paths? → Tree of Thoughts
- Task decomposes into **independent sub-answers**? → Skeleton of Thought
- Requirements are **vague or large in scope**? → Meta-Prompting

## 1. Zero-Shot / Instruction-Style

Ask the model directly. No examples. Works for any task the model has implicit training coverage for (classification, summarization, extraction).

```
Classify the sentiment of this review as Positive, Negative, or Neutral.

Review: "The battery dies after two hours. Completely unusable."
Sentiment:
```

## 2. Few-Shot / In-Context Learning

Provide 2–5 labeled examples so the model infers the task pattern. Order and diversity matter, balance labels and avoid ending on one repeated class.

```
Tweet: "I love sunny days!" → Positive
Tweet: "My flight was cancelled again." → Negative
Tweet: "The package arrived." → Neutral

Tweet: "This product exceeded my expectations!" →
```

Source: Brown et al. 2020, [GPT-3 paper](https://arxiv.org/abs/2005.14165).

## 3. Chain-of-Thought (CoT)

Force intermediate reasoning before the answer. The zero-shot trick, just append **"Let's think step by step."**, often matches few-shot CoT on frontier models.

```
Q: The cafeteria had 23 apples. They used 20 to make lunch, then bought 6 more.
   How many apples do they have now?
A: Let's think step by step.
```

Few-shot variant:

```
Q: Roger has 5 tennis balls. He buys 2 more cans of 3 balls each. How many now?
A: Roger starts with 5. He buys 2 × 3 = 6 more. 5 + 6 = 11. The answer is 11.

Q: If a train leaves at 2:00 PM and travels 60 mph for 3 hours, where is it at 5:00 PM?
A:
```

Source: Wei et al. 2022, [Chain-of-Thought Prompting Elicits Reasoning](https://arxiv.org/abs/2201.11903).

## 4. Self-Consistency

Sample the same CoT prompt many times at `temperature > 0`; take the majority answer. Not a prompt change, a decoding strategy.

```
# Pseudocode
answers = []
for _ in range(10):
    answers.append(model(cot_prompt, temperature=0.7))
final = majority_vote(extract_answer(a) for a in answers)
```

Works best on tasks with a small answer space (math, multiple choice). Cost scales with sample count.

Source: Wang et al. 2022, [Self-Consistency Improves Chain of Thought Reasoning](https://arxiv.org/abs/2203.11171).

## 5. Role / Persona Priming

Open with a role in the system prompt. Shifts vocabulary, tone, and assumed expertise. Not a security boundary, the model can be argued out of role by determined users.

```
System: You are a senior security engineer specializing in cloud infrastructure.
You give terse, opinionated answers and always flag risk tradeoffs.

User: Should I store API keys in environment variables or AWS Secrets Manager?
```

## 6. ReAct (Reason + Act)

Interleave **Thought**, **Action**, and **Observation** turns so the model can call tools mid-reasoning. Foundational for every modern agent framework.

```
Question: What is the capital of the country where the Eiffel Tower is located?

Thought: I need to find where the Eiffel Tower is located.
Action: Search[Eiffel Tower location]
Observation: The Eiffel Tower is in Paris, France.
Thought: France's capital is Paris.
Action: Finish[Paris]
```

Source: Yao et al. 2022, [ReAct: Synergizing Reasoning and Acting](https://arxiv.org/abs/2210.03629).

## 7. Constitutional / System Prompt with Rules

List explicit rules the model must follow before answering. Separates policy from task and makes behavior auditable.

```
System:
You are a customer service assistant. Follow these rules:
1. Never discuss competitor products.
2. If you do not know an answer, say so, do not guess.
3. Keep responses under 150 words.
4. Escalate billing disputes to a human agent.

User: My invoice shows a charge I didn't authorize.
```

Source: Anthropic, [Constitutional AI paper](https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback).

## 8. Structured Output / Schema-Driven

Instruct the model to emit output matching a schema. Put **reasoning fields before the answer field** so the model thinks before it commits.

```
Extract the following from the job posting and return valid JSON only.

Schema:
{
  "reasoning": string,           // 1-2 sentence rationale (think here first)
  "title": string,
  "company": string,
  "required_skills": [string],
  "salary_range": string | null
}

Job posting: "Senior ML Engineer at Acme Corp. Python, PyTorch required. $160k–$200k."
```

In production, prefer API-level **JSON mode** or **tool-use / function calling** where available, they constrain decoding at the token level rather than relying on the model to stay within a format.

## 9. Step-Back Prompting

First ask a higher-abstraction question to retrieve relevant principles; then apply them to the specific problem. 7–27% gains on STEM and multi-hop reasoning (Zheng et al. 2023).

```
Step 1, Step-back question:
"What are the general physics principles governing projectile motion?"

Step 2, Apply principles to the specific question:
"Given those principles, if a ball is launched at 45° with initial velocity 20 m/s,
what is its maximum height?"
```

Source: Zheng et al. 2023 (Google DeepMind), [Step-Back Prompting](https://arxiv.org/abs/2310.06117).

## 10. Tree of Thoughts (ToT)

Generate multiple candidate reasoning branches, evaluate them, and pursue the best path via BFS or DFS. Useful for planning and puzzles where the first idea isn't always best.

```
Problem: Write a short story with a surprise ending.

[Branch A] Start with a detective…
  - Evaluate: promising, original setup
[Branch B] Start on a space station…
  - Evaluate: clichéd, discard
[Branch C] Start with a child finding a letter…
  - Evaluate: strong emotional hook, pursue

→ Expand Branch C with two sub-branches for the twist…
```

Expensive (N completions per node). Source: Yao et al. 2023, [Tree of Thoughts](https://arxiv.org/abs/2305.10601).

## 11. Skeleton of Thought (SoT)

Generate a skeleton outline first, then fill each point **in parallel**. Trades reasoning depth for latency when sub-points are independent.

```
Step 1: "List the main headings for a guide on home network security.
Output as a numbered skeleton only."

→ 1. Router configuration  2. Password hygiene  3. Firewall setup  4. Guest networks

Step 2 (run in parallel, one request per heading):
"Expand heading #1 into 2–3 sentences of practical advice."
```

Source: Ning et al. 2023 (ICLR 2024), [Skeleton-of-Thought repo](https://github.com/imagination-research/sot).

## 12. Meta-Prompting / Prompt-as-Template

Ask the model to **write the prompt** for your task first, then run that prompt. Useful when requirements are vague or when you want auto-synthesized few-shot examples.

```
Step 1:
"Write a high-quality prompt template for extracting action items
from meeting transcripts. Include a role, instructions, and two examples."

Step 2:
Paste the generated template and run it on real transcripts.
```

Vendor tooling: [Anthropic Prompt Generator](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-generator) automates Step 1 for Claude.

## Picking the right template, at a glance

| Task shape | Template |
| --- | --- |
| Classification / simple transform | Zero-shot |
| Unusual format or ambiguous task | Few-shot |
| Multi-step reasoning | CoT (+ Self-Consistency) |
| Changes tone / domain | Role priming |
| Needs tools | ReAct |
| Follows strict rules | Constitutional |
| Specific output schema | Structured output |
| Depends on general principles | Step-back |
| Multiple valid paths | Tree of Thoughts |
| Independent sub-answers | Skeleton of Thought |
| Vague or recursive | Meta-prompting |

## Version notes (2026-04-24)

- On frontier models (GPT-4o, Claude 3.5+/4.x, Gemini 1.5+), zero-shot CoT ("think step by step") often matches few-shot CoT, you may not need the examples.
- Structured output is increasingly delivered at the **API level** via JSON mode or tool-use, which is more robust than prompt-only schema enforcement.
- ReAct's classical prompt format is rarely used verbatim anymore; agent frameworks (LangChain, LlamaIndex, Claude Agent SDK) wrap the pattern behind a tool registry and a loop.
- Tree-of-Thoughts is computationally expensive; use it only when the task has no clean linear solution. Skeleton-of-Thought is far more practical for content generation.

## References

- [Prompt Engineering Guide, DAIR.AI (promptingguide.ai)](https://www.promptingguide.ai/), community-maintained, runnable examples for every technique
- [Prompt Engineering, Lil'Log (Lilian Weng)](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/), comprehensive survey
- [Anthropic Prompt Library](https://docs.anthropic.com/en/resources/prompt-library/library), production-quality templates organized by use case
- [Anthropic Prompt Generator](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-generator), meta-prompting tool
- [OpenAI Prompt Examples](https://platform.openai.com/docs/examples), official curated library
- [LangChain Hub](https://smith.langchain.com/hub), community prompt registry, filterable by task
- [LearnPrompting.org](https://learnprompting.org), structured course covering zero-shot through agents
- Wei et al. 2022, [Chain-of-Thought](https://arxiv.org/abs/2201.11903)
- Yao et al. 2022, [ReAct](https://arxiv.org/abs/2210.03629)
- Yao et al. 2023, [Tree of Thoughts](https://arxiv.org/abs/2305.10601)
- Zheng et al. 2023, [Step-Back Prompting](https://arxiv.org/abs/2310.06117)
