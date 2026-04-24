---
title: AI Harness Development
description: The engineering discipline of building the scaffolding around an LLM, tool-use loops, context management, permissions, hooks, sub-agents, that turns a stateless text predictor into something that finishes real tasks.
category: ai
tags: [agents, claude-code, agent-sdk, context-engineering]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## What is it?

A language model is a stateless text predictor; the **harness** is the software layer that turns it into something that can take actions, persist across turns, and finish real tasks. The harness assembles the system prompt, exposes tool definitions, dispatches tool calls, feeds results back into the next model turn, manages the context window, enforces permissions, and decides when the loop stops.

The Claude Agent SDK frames it crisply: "the model reasons about what to do; the harness executes actions." A competent harness with a mediocre model routinely beats a capable model wrapped in a poorly designed one.

## Key ideas

- **The tool-use loop**, Every agent reduces to: send prompt + tool defs → model returns a tool-call request → harness executes → result appended → repeat until no tool call or a stop condition fires. Simon Willison's minimal definition: "an agent is a model using tools in a loop to achieve a goal."
- **Context window management**, The harness decides what enters the window each turn: prior messages, tool results, file contents, memory summaries. Naive append-everything causes bloat and degraded attention on early instructions.
- **Compaction / summarization**, When the window approaches saturation (Claude Code triggers at ~92–95% capacity), the harness summarizes, preserving decisions, open bugs, task state, discarding verbose intermediate output. Typical compression: 60–80%.
- **System prompts and skills**, The system prompt is the harness's primary policy surface. It's also the most cache-friendly prefix, stable content maximizes prompt cache hit rate.
- **Prompt caching**, The harness pins stable prefixes (system prompt, tool definitions) as cache breakpoints so the model doesn't recompute them every turn. Cuts latency and cost significantly on long sessions.
- **Permission modes**, A deny/ask/allow trie gates every tool call before dispatch. Deny wins; ask surfaces a human prompt; allow passes silently. Unmatched calls default to ask, not allow.
- **Sub-agents and parallel execution**, The orchestrator spawns ephemeral child agents with isolated context windows for scoped subtasks. Prevents subagent work from polluting the parent's context and enables parallelism.
- **Hooks**, Intercept points (PreToolUse, PostToolUse, PreCompact, PostCompact, Stop) let operators inject custom logic, logging, approval gates, goal re-injection, or modifying tool results before the model sees them.
- **Evaluation harnesses**, A separate class of harness exists purely for measuring agent capability: containerized environments, sandboxed tool execution, objective scoring against ground-truth outcomes (SWE-bench, Terminal-Bench).

## Reference architectures

- **Claude Code / Claude Agent SDK**, Production reference: tool-use loop, compaction, hooks, permission ACLs, MCP tool registry, sub-agent spawning, available as a programmable Python/TypeScript runtime.
- **Aider**, Open-source terminal coding agent; diff-based edit protocol, explicit git integration, carefully engineered repo-map context strategy.
- **Cursor**, IDE-embedded harness; cloud agents on isolated VMs, worktree-based branch isolation, parallel Agent Tabs.
- **LangGraph**, Graph-based orchestration where nodes are agents/functions and edges are typed transitions. Good fit for stateful, branching multi-agent workflows.
- **OpenAI Assistants API**, Managed harness-as-a-service: thread persistence, file retrieval, code interpreter, tool dispatch handled server-side. Trades control for simplicity.
- **EleutherAI LM Evaluation Harness**, Canonical evaluation harness: standardized few-shot task runners, containerized environments, reproducible benchmarks.

## Gotchas

- **Context bloat**, Appending every tool result verbatim fills the window faster than useful signal accumulates. Attention degrades on early instructions ("context rot").
- **Prompt injection via tool results**, Tool outputs are model inputs. Web-fetch or file-read results containing adversarial instructions can hijack subsequent reasoning.
- **Infinite loops**, Same tool call + same args repeatedly, retry logic multiplying across layers, no progress check between iterations. Fix: per-call deduplication, step-budget caps, state-change guards.
- **Silent tool failures**, A tool returning empty or swallowing an exception looks to the model like a successful no-op. Distinguish `null` from error; always surface error type and message.
- **Cache invalidation via dynamic system prompts**, Timestamps, usernames, per-request state in the system prompt bust the cache every call. Move per-request content into the user turn or a dedicated tool result.

## Subtopics

- [Context engineering](./context-engineering/), what goes in the window, in what order, at what compression
- [Tool design and schema discipline](./tool-design/), argument schemas, error contracts, and why drift breaks agents
- [Permission and trust models](./permission-models/), deny/ask/allow, human-in-the-loop, sandboxing

## References

- [Effective Harnesses for Long-Running Agents, Anthropic](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Claude Agent SDK: How the Agent Loop Works](https://code.claude.com/docs/en/agent-sdk/agent-loop)
- [Compaction, Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/compaction)
- [Agentic Engineering Patterns, Simon Willison](https://simonwillison.net/guides/agentic-engineering-patterns/)
- [Designing Agentic Loops, Simon Willison](https://simonwillison.net/2025/Sep/30/designing-agentic-loops/)
- [Context Engineering for Coding Agents, Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html)
- [Evaluation and Benchmarking of LLM Agents: A Survey (arXiv 2507.21504)](https://arxiv.org/html/2507.21504v1)
