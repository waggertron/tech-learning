---
title: Reranking
description: A second-pass cross-encoder that scores query-chunk pairs directly, expensive, but the single highest-leverage quality lever in most RAG pipelines.
parent: rag
tags: [rag, reranking, cross-encoder]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

First-pass retrieval (dense or hybrid) returns a noisy top-k. A reranker re-scores those candidates with a cross-encoder that sees the query and each chunk together, enabling far richer matching than cosine over independently-encoded vectors. Most teams who think they have a generation problem actually have a retrieval problem a reranker would fix.

## Key ideas

- **Bi-encoder vs. cross-encoder**, Bi-encoders (the embedding model) encode query and doc independently, then compare vectors. Cross-encoders jointly encode (query, doc) and output a relevance score. Cross-encoders are more accurate; bi-encoders are faster.
- **The latency-quality trade-off**, Cross-encoders are expensive per pair, so you only run them on a first-pass top-k (say, 50–100) and keep the top N (say, 3–10) for the LLM.
- **Common options**, Cohere Rerank, BGE reranker (`bge-reranker-v2-m3`), Jina reranker, FlashRank (local, small). Monoseq-like academic rerankers are also viable.
- **LLM-as-reranker**, Use a small LLM to score candidates. Higher latency and cost than dedicated rerankers; useful when you need reasoning in the scoring.
- **Where it helps most**, Long, verbose corpora; ambiguous queries; cases where top-k cosine has many near-duplicates.

## References

- [Cohere Rerank](https://cohere.com/rerank)
- [BGE Reranker (BAAI)](https://huggingface.co/BAAI/bge-reranker-v2-m3)
- [FlashRank](https://github.com/PrithivirajDamodaran/FlashRank)
- [Pretrained Transformers for Text Ranking: BERT and Beyond](https://arxiv.org/abs/2010.06467)
