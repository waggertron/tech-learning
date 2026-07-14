---
title: "LLMs, agentic AI, and AI agents: what each term actually means"
description: "Three related but distinct concepts: the base model, the architectural pattern that gives it agency, and the specific implementations built on top. What each is, how they relate, and where the lines blur."
category: ai
tags: [ai, llm, agents, agentic-ai, architecture]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

"LLM," "agentic AI," and "AI agent" are used interchangeably in most tech writing. They shouldn't be. Each describes a different layer of abstraction: the base model, an architectural pattern, and a specific implementation. Conflating them produces muddled conversations about what AI systems can and can't do, and makes it hard to reason clearly about where problems originate.

## The base layer: LLMs

A large language model is a neural network trained to predict the next token in a sequence. That's it. Given a prompt (a sequence of tokens), it produces a probability distribution over possible next tokens, samples from that distribution, appends the result, and repeats until a stop condition is met.

What an LLM is, at its core:

- A function: `tokens_in -> tokens_out`
- Stateless across calls: no memory of prior conversations unless the prior context is included in the prompt
- No goals, no intentions, no awareness of time
- No ability to take actions in the world on its own

What it is trained on: a massive corpus of text (and in multimodal models, images, audio, code). The training objective shapes what the model "knows" and what patterns it reproduces. The base model learns to complete text; instruction-tuned models (GPT-4o, Claude, Gemini) learn to respond helpfully to prompts via RLHF fine-tuning.

An LLM running in isolation is a single-turn input/output machine. You send tokens; it returns tokens. There is no loop, no memory, no tool access, no goal-directed behavior. The "intelligence" is entirely in the pattern matching and next-token prediction.

## The architectural pattern: agentic AI

"Agentic AI" is not a specific product or model. It is an architectural pattern: wrapping an LLM in a loop that allows it to observe, reason, act, and repeat.

The minimal structure of an agentic system:

```
       +-----------------------------+
       |         Orchestrator        |
       |  +-----------------------+  |
  +--> |  |     LLM (reasoning)   |  | --> action
  |    |  +-----------------------+  |
  |    |           |                 |
  |    |      tool calls             |
  |    |           |                 |
  |    |  +-----------------------+  |
  |    |  |   Tool execution      |  |
  |    |  +-----------------------+  |
  |    |           |                 |
  +--- |    observation / result     |
       +-----------------------------+
```

The key additions over a bare LLM call:

- **A loop.** The model's output can trigger another round of reasoning. The system runs until a goal is met or a limit is hit, not just until the first response.
- **Tool access.** The model can invoke external capabilities: web search, code execution, file reads, API calls, database queries. The results come back as new context.
- **Working memory.** The conversation history, tool results, and intermediate reasoning accumulate in the context window across turns. The model "remembers" what it has done within a session.
- **Task decomposition.** The model can break a large goal into subtasks, execute them in sequence or parallel, and synthesize the results.

"Agentic AI" describes this mode of operation. An LLM becomes agentic when it is embedded in this kind of loop. The same underlying model (say, GPT-4o or Claude Sonnet) is still doing token prediction, but the surrounding system gives its outputs consequences in the world.

The term "agentic" implies autonomy and extended duration. A single-turn chatbot exchange is not agentic. A coding assistant that reads your repo, runs tests, edits files, and reruns tests until they pass is agentic.

## The implementation: AI agents

An AI agent is a specific, bounded implementation of the agentic pattern with a defined purpose, set of tools, and operating context. If agentic AI is the pattern, an AI agent is a thing you build using that pattern.

What an agent is:

- An LLM (reasoning core)
- A set of tools the model can call (file I/O, APIs, web access, subagent spawning)
- A system prompt that defines its role, constraints, and goals
- Optionally: long-term memory (vector store, database) beyond the context window
- Optionally: the ability to spawn or communicate with other agents

An agent has identity and scope. "The PR reviewer agent" knows it reviews pull requests. "The data extraction agent" knows it reads PDFs and produces structured output. "Claude Code" knows it writes and edits code in your terminal.

Multiple agents can be composed into a multi-agent system. One agent orchestrates others: "fetch research agent," "writer agent," and "editor agent" working together on a long-form article. Each is a bounded LLM-in-a-loop with its own tools and purpose; the orchestrator coordinates them.

## Side by side

| | LLM | Agentic AI | AI Agent |
|---|---|---|---|
| What it is | A trained neural network | An architectural pattern | A specific implementation |
| Stateful? | No | Yes, within a session | Yes, often with persistent memory |
| Takes actions? | No | Yes, via tools | Yes, via tools |
| Has a goal? | No | Goal is externally provided | Goal is baked into the design |
| Runs in a loop? | No | Yes | Yes |
| Example | GPT-4o base model | Claude Code in autonomous mode | A deployment agent that monitors CI and opens fix PRs |

## Concrete examples

**Just an LLM:**
You open a chat interface, type "explain quicksort," and read the response. No loop, no tools, no file access. The model predicted tokens; you read them.

**Agentic pattern applied to the same model:**
You ask Claude Code to "fix the failing tests in this repo." It reads the test output, identifies the failure, reads the relevant files, edits them, reruns the tests, observes the result, and continues until tests pass. The underlying model is the same; the loop and tool access are what make it agentic.

**A specific AI agent:**
A deployed system that runs on a schedule, polls a GitHub repository for new issues labeled "bug," uses the LLM to triage them, posts a comment with an initial diagnosis, and assigns the issue to the right team member. This has a specific purpose, specific tools (GitHub API), specific memory (which issues it has already seen), and runs without a human in the loop. It is an AI agent.

## Where the lines blur

**"The agent" vs. "the model"** are confused when a model is described as having goals or intentions. The model predicts tokens; the agent (the surrounding system) has goals. If a coding agent takes a wrong action, the question of whether the LLM "misbehaved" or the agent "was misconfigured" matters for debugging and for safety analysis.

**"Agentic mode" vs. "AI agent"** are confused because many products use both terms. Claude Code in a single interactive exchange is not an agent in the fullest sense. Claude Code running /autopilot on a multi-file refactor is operating agentically. The same tool at different levels of autonomy.

**"Autonomous" vs. "agentic"** are often used interchangeably. Agentic just means the loop-plus-tools architecture. Autonomous means the loop runs without human approval at each step. All fully autonomous AI systems are agentic, but agentic systems can still require human-in-the-loop approval for each action.

## Why the distinction matters

**Debugging.** A failure in an agentic system could come from the LLM (bad reasoning, hallucination, miscalibrated confidence), the tool implementation (a tool that returns wrong data), the orchestration logic (a loop that doesn't stop when it should), or the agent design (a system prompt that underspecified the goal). You need to know which layer you're looking at.

**Safety and oversight.** An LLM predicting tokens is low-risk; the output is text. An AI agent with write access to a production database is a different matter. The risk profile scales with the level of agency, not the capability of the underlying model.

**Capability attribution.** When someone says "Claude can browse the web," they mean Claude-in-an-agentic-system-with-a-web-search-tool can. The base LLM cannot. This distinction matters when evaluating claims about what a model can do versus what a product built on it can do.

## References

- [Lilian Weng, "LLM Powered Autonomous Agents" (Lil'Log, 2023)](https://lilianweng.github.io/posts/2023-06-23-agent/), the clearest early taxonomy of agent components: planning, memory, and tools
- [Anthropic, "Building effective agents"](https://www.anthropic.com/engineering/building-effective-agents), Anthropic's definition of agents vs. workflows vs. augmented LLM calls
- [Andrew Ng on agentic AI (DeepLearning.AI, 2024)](https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/), the loop and tool-use framing from the short-course series
- [Chase, "What is an agent?" (LangChain Blog)](https://blog.langchain.com/what-is-an-agent/), practical framing from the tooling side
- [Shinn et al., "Reflexion: Language Agents with Verbal Reinforcement Learning" (arXiv 2303.11366)](https://arxiv.org/abs/2303.11366), how agents improve through self-reflection loops

## Related topics

- [AI Harness Development](../harness-development/), building the scaffolding that turns an LLM into an agentic system
- [AI Skill Development](../skill-development/), packaged capabilities that agentic systems invoke on demand
- [Tool Design](../harness-development/tool-design/), designing the tools that agents call
- [AI text tells](../ai-text-markers/), surface patterns that emerge from how LLMs are trained
