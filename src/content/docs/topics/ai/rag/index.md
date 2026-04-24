---
title: RAG (Retrieval-Augmented Generation)
description: Grounding LLM responses in external knowledge by retrieving relevant documents at query time and injecting them into the prompt alongside the user's question.
category: ai
tags: [llm, rag, retrieval, embeddings]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## What is it?

RAG is a pattern for grounding LLM responses in external knowledge: at query time, relevant documents are retrieved from a corpus and injected into the model's prompt alongside the user's question. This gives the generator access to up-to-date, verifiable facts without retraining. Formalized by Lewis et al. (2020), it's now the dominant approach for knowledge-intensive production systems. The core separation: "what the model knows how to do" vs. "what it needs to know right now."

## Key ideas

- **Embeddings**, Dense vector representations of text (e.g., `text-embedding-3-large`, `bge-m3`) that map semantic meaning to a continuous space for similarity lookup.
- **Chunking**, Splitting source documents into retrievable units. Chunk size, overlap, and boundaries have outsized impact on recall quality.
- **Vector stores**, Indices (Pinecone, pgvector, Weaviate, Chroma, Qdrant) that store embeddings and answer approximate nearest-neighbor queries efficiently.
- **Similarity search**, Cosine or dot-product distance; fast but insensitive to exact token overlap.
- **Hybrid search (BM25 + vector)**, Combines sparse keyword signal (BM25) with dense semantic signal via Reciprocal Rank Fusion (RRF). Catches exact matches that cosine misses.
- **Reranking**, Second-pass cross-encoder (Cohere Rerank, BGE reranker) scores query-chunk pairs directly. Expensive but dramatically improves precision.
- **Query transformation**, Rewrite, expand, or decompose queries before retrieval (multi-query, step-back, HyDE).
- **Retrieval evaluation**, Hit Rate, MRR, NDCG, context precision/recall measured independently from generation quality. Essential for iterating on the retrieval step.

## Common architectures

- **Naive RAG**, Embed query → ANN search → stuff top-k chunks into prompt. Fast baseline; breaks on ambiguous or multi-hop questions.
- **Hybrid retrieval**, BM25 + vector search merged via RRF. Practical default. Anthropic's contextual retrieval reports up to 67% failure reduction with this plus contextual chunk pre-processing.
- **Multi-query / RAG fusion**, LLM generates N query variants; each retrieves independently; results fused and deduplicated.
- **HyDE (Hypothetical Document Embeddings)**, LLM writes a fake "ideal answer"; its embedding is used for retrieval. Significant zero-shot gains (Gao et al., 2022).
- **Agentic RAG**, Retrieval is a tool the LLM calls iteratively; the agent plans sub-questions, routes to specialized corpora, decides when it has enough evidence.
- **Contextual retrieval (Anthropic)**, Each chunk is pre-processed at index time with a short context summary prepended before embedding and BM25 indexing. Reduces top-20 retrieval failure from 5.7% to 3.7%.

## Gotchas

- **Fixed-size naive chunking**, Splitting by token count with no regard for sentence/paragraph boundaries destroys local context; mid-sentence chunks confuse both retriever and generator.
- **Stale embeddings**, Re-indexing gets skipped after source updates; the retriever silently returns outdated passages.
- **Skipping reranking**, Top-k cosine is noisy. Many teams ship without a reranker and blame the LLM for what are actually retrieval failures.
- **Evaluating only end-to-end**, Without separate retrieval metrics (Hit Rate, MRR), you can't localize whether drops are retrieval or generation.
- **Over-reliance on cosine alone**, Pure dense retrieval misses exact entity matches (product codes, error messages, names). Hybrid is almost always worth the added complexity.

## Subtopics

- [Embeddings](./embeddings/), model selection, dimensionality, fine-tuning, matryoshka representations
- [Chunking strategies](./chunking/), fixed-size vs. semantic vs. structure-aware, parent-child hierarchies
- [Hybrid search](./hybrid-search/), BM25 mechanics, RRF, sparse-dense tradeoffs
- [Reranking](./reranking/), cross-encoders vs. bi-encoders, latency cost, tooling options

## References

- [Lewis et al. 2020, "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"](https://arxiv.org/abs/2005.11401)
- [Guu et al. 2020, "REALM: Retrieval-Augmented Language Model Pre-Training"](https://arxiv.org/abs/2002.08909)
- [Gao et al. 2022, "Precise Zero-Shot Dense Retrieval without Relevance Labels" (HyDE)](https://arxiv.org/abs/2212.10496)
- [Contextual Retrieval, Anthropic](https://www.anthropic.com/news/contextual-retrieval)
- [OpenAI Cookbook, Question Answering with RAG](https://cookbook.openai.com/examples/question_answering_using_embeddings)
- [LlamaIndex, RAG documentation](https://docs.llamaindex.ai/en/stable/getting_started/concepts/)
- [Pinecone, What is RAG?](https://www.pinecone.io/learn/retrieval-augmented-generation/)
- [Agentic RAG Survey (arXiv 2501.09136)](https://arxiv.org/html/2501.09136v4)
