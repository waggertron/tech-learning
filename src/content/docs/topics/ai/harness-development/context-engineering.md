---
title: Context Engineering
description: The dynamic, harness-driven discipline of choosing what goes into the window, in what order, and at what compression level.
parent: harness-development
tags: [context-engineering, harness, agents]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

Context engineering is distinct from prompt engineering: prompt engineering is static text you author; context engineering is what the harness assembles at each turn from running state, tool results, files, memory, and summaries. In a long-running agent, the harness's context strategy matters more than any single prompt.

## Key ideas

- **Budget, don't fill** — Treat the window as a scarce attention budget. The goal is the smallest context that preserves capability, not the largest context that fits.
- **Stable prefix → cache-friendly** — System prompt, tool definitions, persistent skills go first and don't change. This maximizes prompt-cache hit rate and keeps per-turn cost down.
- **Compaction strategy** — When to summarize, what to preserve (decisions, open questions, task state), what to drop (verbose intermediate tool outputs). Claude Code triggers compaction at ~92–95% capacity.
- **Tool result shaping** — Truncate, structure, and label tool outputs *before* they enter context. A raw 50KB HTML dump is almost always worse than the 2KB of it that matters.
- **Isolation via sub-agents** — Push scoped work into child agents with their own context window so intermediate state doesn't pollute the parent.

## References

- [Effective Harnesses for Long-Running Agents — Anthropic](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Effective Context Engineering for AI Agents — Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Context Engineering for Coding Agents — Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html)
- [Compaction — Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/compaction)
