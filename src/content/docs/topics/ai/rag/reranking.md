---
title: Reranking
description: "A second-pass cross-encoder that scores query-chunk pairs directly, expensive, but often the highest-value quality lever in RAG pipelines."
parent: rag
tags: [rag, reranking, cross-encoder]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## Why first-pass retrieval needs a second opinion

First-pass retrieval returns candidates. It does not guarantee the best evidence is at the top. Dense search, sparse search, and [hybrid search](../hybrid-search/) are optimized to find plausible matches quickly across a large corpus. They usually over-retrieve, then hand back a noisy top `k`.

A reranker scores each query-chunk pair more carefully. Instead of comparing independently encoded vectors, a cross-encoder reads the query and candidate together and emits a relevance score. That direct comparison is slower, but it can catch details a vector search misses.

Most teams that think they have a generation problem actually have a ranking problem. The model answers poorly because the strongest evidence was retrieved at rank 18 and never reached the prompt.

## Key ideas

- **Bi-encoder retrieval**: Embedding models encode query and document separately, then compare vectors. This is fast enough for large indexes.
- **Cross-encoder reranking**: A reranker reads the query and candidate together. This makes it more accurate for relevance, but too expensive to run over the whole corpus.
- **Candidate budget**: A common pattern is retrieve 50 to 100 candidates, rerank them, then keep 3 to 10 chunks for generation. The exact numbers depend on corpus size, latency budget, and context budget.
- **Reranker types**: Dedicated rerankers are built for relevance scoring. LLM-as-reranker approaches can work when the judgment needs reasoning, but they cost more and are harder to make deterministic.
- **Pairwise vs. pointwise scoring**: Pointwise rerankers score each candidate independently. Pairwise or listwise approaches compare candidates against one another, which can improve ordering but usually costs more.

## Where reranking helps most

Reranking is highest value when first-pass retrieval has good recall but poor ordering. That shows up as:

- the right chunk appears in the top 50, but not the top 5
- several near-duplicate chunks crowd the top results
- the query is ambiguous and needs context to disambiguate
- chunks are long enough that vector similarity is diluted
- the corpus mixes reference docs, tickets, changelogs, code, and policy text

Reranking does not fix missing evidence. If the correct chunk never appears in the candidate set, improve [chunking](../chunking/), [embeddings](../embeddings/), sparse search, filters, or indexing first.

## How to evaluate it

Use retrieval metrics before answer metrics. For each query, label the chunks that actually support the answer. Then compare:

- recall at first-pass `k`
- mean reciprocal rank before and after reranking
- how often the answer-bearing chunk appears in the final prompt
- latency added per query
- cost per query at the chosen candidate count

Then run generation evals. A reranker can improve evidence selection but still hurt the final answer if it over-prioritizes short exact matches over complete explanations.

## Common failure modes

- **Reranking too few candidates**: If the first-pass top 10 is already noisy, reranking only those 10 cannot recover the missed evidence.
- **Sending too many final chunks**: Reranking is supposed to sharpen the prompt. Dumping the top 30 into the model recreates the noise problem.
- **Ignoring diversity**: The best final context often needs one definition, one procedure, and one exception, not five chunks from the same section.
- **No latency budget**: A strong reranker that doubles p95 latency may be unacceptable for interactive search.
- **Using answer quality as the only signal**: Generation can hide retrieval regressions. Keep retrieval-level metrics.

## References

- [Cohere Rerank](https://cohere.com/rerank)
- [BGE Reranker (BAAI)](https://huggingface.co/BAAI/bge-reranker-v2-m3)
- [FlashRank](https://github.com/PrithivirajDamodaran/FlashRank)
- [Pretrained Transformers for Text Ranking: BERT and Beyond](https://arxiv.org/abs/2010.06467)

## Related topics

- [Hybrid search](../hybrid-search/), first-pass candidate retrieval
- [Embeddings](../embeddings/), the vector representation rerankers often refine
- [Chunking strategies](../chunking/), why candidate shape affects reranker quality
- [Context window management](../../prompt-engineering/context-window-management/), choosing how much reranked evidence to include
