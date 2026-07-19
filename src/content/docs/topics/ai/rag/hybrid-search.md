---
title: Hybrid Search
description: "Combining sparse BM25 and dense vector retrieval with rank fusion so RAG systems handle both semantic questions and exact identifiers."
parent: rag
tags: [rag, bm25, hybrid-search, retrieval]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## Why hybrid search is the default baseline

Dense retrieval over [embeddings](../embeddings/) is good at semantic match. It can connect "how do I reset MFA" with a page titled "Account recovery after authenticator loss." It is weaker on exact tokens such as error codes, product IDs, function names, ticket numbers, table values, and rare proper nouns.

Sparse retrieval, usually BM25 or a related lexical ranker, has the opposite shape. It is strong when the query shares words with the document. It struggles when the user asks in different language than the document uses.

Hybrid search runs both and fuses the rankings. That makes it a safer production default than dense-only search, especially for technical, support, compliance, and code corpora.

## Key ideas

- **BM25 basics**: BM25 scores documents by term frequency, inverse document frequency, and document length normalization. Rare query terms count more. Repeating a term helps, but with diminishing returns.
- **Dense retrieval**: Vector search finds chunks whose embedding sits near the query embedding. It is useful for paraphrases, synonyms, high-level concepts, and questions that do not quote the document.
- **Rank fusion**: Reciprocal Rank Fusion combines ranked lists by giving each document points based on its position in each list. It avoids directly comparing BM25 scores with vector similarity scores, which often live on different scales.
- **Reranking after fusion**: Hybrid search improves recall. A [reranker](../reranking/) can then score the fused candidates more carefully before the generator sees them.
- **Metadata filters**: Product, version, permission, language, region, and document type filters should usually apply before or during retrieval, not after generation.

## When dense wins

Dense retrieval tends to win when the user describes intent rather than exact wording:

- "How do I authenticate a webhook?"
- "What happens if a payment retry fails?"
- "Where do we explain customer eligibility?"
- "Which doc covers deleting old workspace data?"

These queries often match pages that use different wording from the user. Dense vectors can bridge that gap.

## When sparse wins

Sparse retrieval tends to win when exact symbols carry meaning:

- error codes such as `EADDRINUSE`
- API fields such as `idempotency_key`
- package names, class names, and function names
- legal terms of art
- account IDs, model names, SKU strings, or region codes

Dense embeddings can blur rare tokens into the surrounding sentence. BM25 keeps the literal token important.

## Design pattern

A common production flow:

1. Normalize the query.
2. Run BM25 and vector search against the same filtered corpus.
3. Fuse the top candidates with RRF or a tuned weighted blend.
4. Deduplicate chunks from the same parent section.
5. Rerank the fused set.
6. Send only the best evidence to the generator, with citations and metadata.

The exact fusion method matters less than measuring whether the answer-bearing evidence appears in the candidate set.

## Common failure modes

- **Dense-only search for technical docs**: The system misses exact error messages and identifiers.
- **Sparse-only search for user questions**: The system misses paraphrases and conceptual matches.
- **Score blending without calibration**: Raw BM25 and vector scores are not naturally comparable. Rank fusion is usually safer.
- **No deduplication**: Several overlapping chunks from one page crowd out diverse evidence.
- **Late permission filtering**: Retrieving unauthorized chunks and trusting the generator not to reveal them is an access-control bug.

## References

- [Anthropic Contextual Retrieval, section on BM25 + embeddings](https://www.anthropic.com/engineering/contextual-retrieval)
- [Reciprocal Rank Fusion paper (Cormack et al. 2009)](https://doi.org/10.1145/1571941.1572114)
- [Hybrid Search, Weaviate docs](https://weaviate.io/developers/weaviate/search/hybrid)
- [Introduction to BM25, Elasticsearch blog](https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables)

## Related topics

- [Embeddings](../embeddings/), the dense side of hybrid retrieval
- [Chunking strategies](../chunking/), the evidence units both rankers retrieve
- [Reranking](../reranking/), the second-pass quality lever
- [Prompt injection defense](../../prompt-engineering/prompt-injection-defense/), why retrieved content still needs trust boundaries
