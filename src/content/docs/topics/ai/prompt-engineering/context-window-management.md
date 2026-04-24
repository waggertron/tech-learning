---
title: Context Window Management
description: Placing high-signal content where attention is strongest, compressing or summarizing the rest, and integrating retrieval when the corpus exceeds the window.
parent: prompt-engineering
tags: [context-engineering, lost-in-the-middle, compaction]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

A long context window is not a free resource. Attention follows a U-shaped curve, strong at the start and end, weak in the middle ("lost in the middle"). Adding more context often *hurts* quality past a certain point. Good prompt design treats the window as a scarce attention budget, not a dumping ground.

## Key ideas

- **Lost in the middle**, Liu et al. (2023) showed retrieval accuracy drops sharply for items placed in the middle of a long context. Put the load-bearing content at the front or end of a long block.
- **Context rot**, Chroma's research found degradation at every context-length increment, not just near the cap. Even well under the limit, more tokens = worse attention.
- **Compression and summarization**, Instead of carrying every tool result verbatim, summarize older state and keep only decisions, open questions, and task markers.
- **Retrieval over stuffing**, Past a corpus size, RAG beats long-context stuffing for accuracy *and* cost. See [RAG](../../rag/).
- **Ordering matters**, System prompt first (cache-friendly), then high-signal reference, then the task, with examples closest to the task.

## References

- [Lost in the Middle, Liu et al. 2023 (TACL)](https://arxiv.org/abs/2307.03172)
- [Context Rot, Chroma Research](https://research.trychroma.com/context-rot)
- [Effective Context Engineering for AI Agents, Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Compaction, Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/compaction)
