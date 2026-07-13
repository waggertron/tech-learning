---
title: Context Engineering
description: "The harness-driven discipline of choosing what goes into the model window, in what order, with what labels, and at what compression level."
parent: harness-development
tags: [context-engineering, harness, agents]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## Context is assembled, not written once

Prompt engineering writes static instructions. Context engineering decides what the harness puts in the model window on each turn.

That distinction matters for agents. A long-running agent does not answer from one prompt. It answers from a changing bundle of system instructions, tool definitions, user messages, file excerpts, search results, memory, summaries, plans, validation output, and permission state. The harness decides what gets included, where it goes, how it is labeled, and when it is compacted.

In a long session, that context strategy often matters more than any single sentence in the system prompt.

## Key ideas

- **Budget, do not fill**: The goal is the smallest context that preserves capability, not the largest context that fits.
- **Stable prefix**: System instructions, tool definitions, and persistent skills should stay stable when possible. This helps caching and keeps the top of the context predictable.
- **Tool-result shaping**: Truncate, structure, and label tool outputs before they enter the window. A raw HTML dump, giant log, or full JSON response is usually worse than a compact extract with source metadata.
- **Compaction strategy**: Decide when to compact, what to preserve, and what to discard. Preserve decisions, constraints, open questions, file names, and validation evidence. Drop stale raw output.
- **Context isolation**: Push scoped work into sub-agents or child tasks when their intermediate state would pollute the main thread.

## What the harness needs to track

A useful context assembler keeps separate buckets instead of one growing transcript:

- **Stable instructions**: house rules, security policies, style guides, and tool contracts
- **Current task state**: objective, plan, blockers, accepted assumptions, and latest user changes
- **Working evidence**: file excerpts, command output, retrieved docs, and citations that still matter
- **Memory**: durable facts or project preferences that should survive the session
- **Scratch work**: intermediate reasoning, failed attempts, and exploratory output that can be discarded
- **Permissions**: which tools or external actions are allowed, denied, or awaiting approval

Those buckets let the harness compact intelligently. Without them, compaction becomes a lossy summary of everything.

## Tool result shaping

The model should not receive tool output exactly as a tool produced it by default. Shape it:

- strip boilerplate and repeated noise
- keep line numbers or IDs needed for follow-up actions
- summarize long logs around the failing span
- preserve enough raw text for citations or edits
- mark untrusted content clearly
- record what was omitted

The harness should also distinguish "empty result", "not found", "permission denied", "timed out", and "tool failed." To a model, those cases imply different next steps.

## Common failure modes

- **Append-only context**: The harness keeps adding messages until the window is full and the model loses the task.
- **Unlabeled evidence**: The model cannot tell official docs from user text, public web pages, generated summaries, or untrusted tool output.
- **Over-compaction**: The summary drops the exact command, file path, or requirement needed to continue.
- **Stale state**: Old plans remain in context after the user changes direction.
- **Global memory abuse**: Temporary task details get stored as durable memory and leak into unrelated sessions.

## Practical checklist

- Keep stable instructions stable.
- Label context blocks by source, trust level, and freshness.
- Preserve decisions and constraints during compaction.
- Trim raw tool output before it reaches the model.
- Isolate large exploratory subtasks when possible.

## References

- [Effective Harnesses for Long-Running Agents, Anthropic](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Effective Context Engineering for AI Agents, Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Context Engineering for Coding Agents, Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html)
- [Compaction, Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/compaction)

## Related topics

- [Context window management](../../prompt-engineering/context-window-management/), prompt-level ordering and compression
- [Tool design and schema discipline](../tool-design/), shaping the interfaces that feed context
- [Permission and trust models](../permission-models/), controlling what context-driven actions can do
- [RAG chunking strategies](../../rag/chunking/), shaping retrieved evidence before it enters context
