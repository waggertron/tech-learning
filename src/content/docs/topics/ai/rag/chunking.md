---
title: Chunking Strategies
description: How you split documents into retrievable units — fixed-size vs. semantic vs. document-structure-aware, and parent-child hierarchies.
parent: rag
tags: [rag, chunking, retrieval]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

Chunking decides what units your retriever can return. Too small and chunks lack context; too large and similarity search becomes imprecise and the model drowns in noise. There is no universal best chunk size — it's a function of your corpus, embedder, and generator's context budget.

## Key ideas

- **Fixed-size + overlap** — Simplest baseline: split by token count with 10–20% overlap to preserve cross-boundary context. Cheap, works surprisingly well.
- **Semantic / structure-aware chunking** — Split at paragraph, section, or heading boundaries. Respects document structure and avoids mid-sentence cuts. Libraries: LlamaIndex `SentenceSplitter`, Unstructured.io.
- **Parent-child hierarchies** — Embed small chunks for precise retrieval, but return the larger parent (section or page) for generation. Best of both worlds: precision on retrieval, context on generation.
- **Contextual chunking (Anthropic)** — Prepend a short LLM-generated summary of the whole document to each chunk before embedding. Massive recall improvements; cheap with prompt caching.
- **Code and structured data** — Code should chunk at function/class boundaries. Tables, CSVs, and JSON need chunk schemes that preserve row/field integrity rather than token slicing.

## References

- [Contextual Retrieval — Anthropic](https://www.anthropic.com/news/contextual-retrieval)
- [LlamaIndex: Node Parsers & Text Splitters](https://docs.llamaindex.ai/en/stable/module_guides/loading/node_parsers/)
- [Chunking Strategies for LLM Applications — Pinecone](https://www.pinecone.io/learn/chunking-strategies/)
- [Unstructured.io documentation](https://docs.unstructured.io/)
