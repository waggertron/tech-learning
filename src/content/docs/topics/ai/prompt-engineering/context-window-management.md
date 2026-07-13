---
title: Context Window Management
description: "How to place high-signal content where attention is strongest, compress older state, order evidence, and use retrieval instead of stuffing the window."
parent: prompt-engineering
tags: [context-engineering, lost-in-the-middle, compaction]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## The window is an attention budget

A long context window is not free space. It is an attention budget. Every extra token competes with instructions, examples, retrieved evidence, tool outputs, and the user's actual task.

Long-context models can carry more material, but they do not use every token equally well. Research on "lost in the middle" shows that models often retrieve information more reliably from the beginning and end of a long context than from the middle. Separate work on context degradation shows that adding more content can hurt even before the hard limit is reached.

The practical rule: put the highest-signal material where the model is most likely to use it, compress or discard stale material, and retrieve evidence on demand instead of stuffing the whole corpus into the prompt.

## Key ideas

- **Position matters**: Put durable instructions and task-critical facts near the front or close to the final request. Do not bury the decisive constraint in the middle of a huge block.
- **Compression preserves state, not transcript**: A good summary keeps decisions, open questions, constraints, file paths, failures, and next actions. It drops verbose tool output and conversational filler.
- **Retrieval beats stuffing**: When the source corpus is large, use [RAG](../../rag/) to retrieve the relevant pieces. Stuffing everything into the prompt is slower, more expensive, and often less accurate.
- **Examples should be local to use**: Few-shot examples work best when they are close to the task they demonstrate. A distant example can be ignored or contradicted by later context.
- **Stable prefixes help caching**: Keep system instructions and tool definitions stable when the provider supports prompt caching. Move per-request details into the user turn or retrieved context.

## A useful context layout

For many production prompts and agent turns, this order works well:

1. Stable system instructions and safety constraints.
2. Tool definitions or schema contracts.
3. Durable project or domain rules.
4. Retrieved evidence, trimmed and labeled by source.
5. Recent task state, decisions, and open questions.
6. The current user request.
7. Output format or acceptance criteria.

The exact order depends on the model and application, but the principle is stable: high-signal material should be easy to find and clearly labeled.

## What to preserve during compaction

Compaction should not summarize everything equally. Preserve the state needed to continue work:

- accepted requirements
- rejected approaches and why they failed
- current plan and remaining steps
- files, IDs, links, commands, and outputs that matter
- user preferences and hard constraints
- test failures and validation evidence
- unresolved questions

Drop raw logs, repeated search results, old drafts, failed intermediate guesses, and tool output that has already been converted into a decision.

## Common failure modes

- **Transcript hoarding**: The system appends every message and tool result until quality degrades.
- **Summary drift**: A compaction summary changes the meaning of a requirement or drops a constraint.
- **Middle burial**: The crucial instruction sits between two long retrieved documents.
- **Stale retrieved evidence**: Old retrieval results remain in context after the user changes scope.
- **Over-retrieval**: The system retrieves ten chunks when two would answer the question.

## Practical checklist

- Label every retrieved block with source and trust level.
- Keep current task instructions close to the final user request.
- Summarize decisions, not every step.
- Prefer fresh retrieval over carrying old evidence across turns.
- Track context size and quality failures as observability signals.

## References

- [Lost in the Middle, Liu et al. 2023 (TACL)](https://arxiv.org/abs/2307.03172)
- [Context Rot, Chroma Research](https://research.trychroma.com/context-rot)
- [Effective Context Engineering for AI Agents, Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Compaction, Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/compaction)

## Related topics

- [Context engineering](../../harness-development/context-engineering/), harness-level context assembly
- [Chunking strategies](../../rag/chunking/), making retrievable units fit the window
- [Reranking](../../rag/reranking/), choosing which evidence deserves context space
- [Prompt templates](../templates/), reusable patterns that depend on placement
