---
title: Hybrid Search
description: Combining sparse (BM25) and dense (vector) retrieval via Reciprocal Rank Fusion — the practical default for production RAG.
parent: rag
tags: [rag, bm25, hybrid-search, retrieval]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

Dense retrieval (cosine over embeddings) is great at semantic match but weak on exact tokens — product codes, error messages, entity names. Sparse retrieval (BM25) is the opposite. Hybrid search runs both, fuses the rankings, and gets the strengths of each. It's the practical default for most production RAG systems.

## Key ideas

- **BM25 basics** — Classic lexical ranker scoring documents by term frequency (with diminishing returns) and inverse document frequency. Still the baseline to beat on keyword-heavy retrieval.
- **Reciprocal Rank Fusion (RRF)** — Merge two ranked lists by summing `1/(k + rank_i)` for each document across lists (typically k=60). Hyperparameter-free, robust, and fast.
- **When dense wins** — Paraphrased queries, synonyms, cross-lingual, concept-level match ("how do I authenticate" vs. a doc titled "login flow").
- **When sparse wins** — Exact identifiers, error messages, rare entities, code symbols. Dense embeddings smear these into near-neighbors of unrelated text.
- **Tooling** — Elasticsearch, OpenSearch, Weaviate, Vespa all offer first-class hybrid. pgvector + `tsvector` in Postgres is a viable low-dep option.

## References

- [Anthropic Contextual Retrieval — section on BM25 + embeddings](https://www.anthropic.com/news/contextual-retrieval)
- [Reciprocal Rank Fusion paper (Cormack et al. 2009)](https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf)
- [Hybrid Search — Weaviate docs](https://weaviate.io/developers/weaviate/search/hybrid)
- [Introduction to BM25 — Elasticsearch blog](https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables)
