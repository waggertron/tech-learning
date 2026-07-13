---
title: Chunking Strategies
description: "How to split documents into retrievable units, fixed-size chunks, semantic boundaries, structure-aware chunks, parent-child retrieval, and table or code-aware strategies."
parent: rag
tags: [rag, chunking, retrieval]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## What chunking decides

Chunking decides what unit of evidence a retriever can return. A chunk is not just storage plumbing. It is the shape of the facts your model will see.

Too small, and the retrieved text lacks the context needed to answer. Too large, and similarity search becomes blurry because one vector has to represent several unrelated ideas. The model then receives pages of mixed evidence and has to rediscover the answer inside the noise.

There is no universal best chunk size. The right split depends on the corpus, the embedding model, the query shape, and the amount of evidence the generator can use well.

## Key ideas

- **Fixed-size chunks with overlap**: Split by token count and include overlap between neighbors. This is a good baseline because it is simple, cheap, and reproducible. It fails when section boundaries, tables, or code structure carry meaning.
- **Semantic or structure-aware chunks**: Split at headings, paragraphs, list items, function boundaries, or document sections. This preserves meaning better than raw token windows, but it needs parsers that understand the input format.
- **Parent-child retrieval**: Embed small child chunks for precise matching, then return the larger parent section for generation. This is often the best compromise when tiny chunks retrieve accurately but do not explain enough.
- **Contextual chunking**: Add a short document-level or section-level summary to each chunk before embedding. The goal is to give isolated chunks enough surrounding context to match queries that refer to the broader document.
- **Table-aware chunking**: Tables need headers, units, row labels, and sometimes preceding explanatory text. A row without the header is usually meaningless.
- **Code-aware chunking**: Code should split around functions, classes, modules, tests, and docstrings. A token splitter that cuts through a function body creates bad retrieval units.

## A practical starting point

For prose docs, start with section-aware chunks. Preserve the heading path, include enough previous heading context to identify the topic, and keep chunks small enough that several can fit in the final prompt.

For API docs, treat each route, parameter table, type definition, and example as its own retrieval unit when possible. Keep related examples attached to the operation they explain.

For code, embed files only as a fallback. Better units are functions, classes, exported types, test cases, and README sections. Store path, symbol name, language, and repository revision as metadata.

For policies and contracts, preserve clause numbers, definitions, exceptions, and effective dates. A chunk that says "This does not apply" without the clause it refers to is dangerous.

## How to evaluate chunking

Chunking quality shows up as retrieval behavior, not as prettier documents. Build a small query set and inspect:

- whether the answer-bearing chunk appears in the first-pass top `k`
- whether returned chunks contain enough surrounding context to answer
- how many near-duplicate chunks crowd out better evidence
- whether tables, code, and lists survive with their labels
- whether metadata filters still identify the source, version, and access boundary

Do not tune chunk size only by generated answer quality. A model can sometimes answer correctly despite bad retrieval, which hides the problem until the corpus changes.

## Common failure modes

- **Blind token splitting**: The splitter cuts through a table, code block, definition, or numbered rule.
- **Too much overlap**: Overlap improves boundary cases, but large overlap fills the index with near duplicates and wastes context.
- **No source metadata**: The answer is retrieved, but the system cannot cite, filter, deduplicate, or enforce access rules.
- **Chunking before cleanup**: Boilerplate nav, footers, repeated disclaimers, and cookie banners get embedded as if they were content.
- **One strategy for every file type**: Markdown, PDFs, code, tickets, CSVs, and contracts need different split rules.

## Practical checklist

- Start with section-aware chunks for prose.
- Keep heading paths and source metadata with every chunk.
- Use parent-child retrieval when small chunks need larger context.
- Treat tables and code as structured documents, not plain text.
- Measure retrieval recall and inspect failures before tuning the generator.

## References

- [Contextual Retrieval, Anthropic](https://www.anthropic.com/news/contextual-retrieval)
- [LlamaIndex: Node Parsers & Text Splitters](https://docs.llamaindex.ai/en/stable/module_guides/loading/node_parsers/)
- [Chunking Strategies for LLM Applications, Pinecone](https://www.pinecone.io/learn/chunking-strategies/)
- [Unstructured.io documentation](https://docs.unstructured.io/)

## Related topics

- [Embeddings](../embeddings/), how chunks become vectors
- [Hybrid search](../hybrid-search/), why exact terms still matter after chunking
- [Reranking](../reranking/), how to sort noisy first-pass results
- [Context window management](../../prompt-engineering/context-window-management/), fitting retrieved evidence into the model window
