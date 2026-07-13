---
title: Embeddings
description: "Dense vector representations for semantic search, model choice, dimensionality, fine-tuning, asymmetric encoding, and matryoshka representations."
parent: rag
tags: [rag, embeddings, retrieval]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## What embeddings do in retrieval

An embedding model maps text into a dense vector. Similar meanings should land near each other in that vector space, so a retriever can find relevant text by comparing vectors instead of matching exact words.

That sounds simple, but embeddings decide what your RAG system can notice. If the embedding model does not separate legal definitions, API names, product SKUs, or support-ticket symptoms in a way that matches your domain, the generator never sees the right evidence. You cannot out-prompt a bad retrieval set.

A useful mental model: embeddings are the first compression step. The original document may contain names, order, formatting, negation, code structure, and tables. The vector compresses that into numbers. Retrieval quality depends on which signals survive that compression.

## Key ideas

- **Model selection**: Benchmarks like MTEB are a starting point, not a substitute for your own eval. A model that ranks well on generic retrieval can still miss domain-specific abbreviations, code symbols, clinical language, legal clauses, or internal product names.
- **Dimensionality**: Higher dimensionality stores more signal, but it also costs more memory, index size, network bandwidth, and approximate-nearest-neighbor work. A 3,072-dimensional vector is not automatically better than a 768-dimensional vector if the smaller one retrieves the right evidence faster.
- **Distance function**: Cosine similarity, dot product, and Euclidean distance are not interchangeable unless the model and index are configured for that metric. Use the distance function recommended by the embedding model or normalize vectors deliberately.
- **Asymmetric encoding**: Some models expect different instructions or modes for queries and documents. A search query such as "refund policy for annual plan" is not written like a documentation paragraph. Models trained for asymmetric retrieval often encode those two sides differently.
- **Matryoshka representations**: Matryoshka models are trained so prefixes of the vector remain useful. That lets a system store full vectors, then query a shorter prefix for cheaper retrieval, or compare quality and cost at multiple vector lengths.
- **Domain adaptation**: Fine-tuning or contrastive training helps when the vocabulary and relevance judgments are specialized. It is usually worth considering only after baseline retrieval, chunking, and reranking have been measured.

## Design decisions that matter

Start with a retrieval eval set before changing models. Collect realistic questions, the documents or chunks that should answer them, and a few hard negatives that look similar but are wrong. Measure recall at `k`, not just whether a generated answer sounds good.

Then choose the embedding setup around the corpus:

- **Support docs and policy pages** usually need semantic match plus exact term handling. Pair embeddings with [hybrid search](../hybrid-search/).
- **Codebases** need symbol-aware chunking, path metadata, and exact matches for identifiers. Embeddings alone often smear similar function names together.
- **Legal or medical text** needs careful negative examples. The difference between "covered", "not covered", and "covered only if" can vanish if chunking and embedding are sloppy.
- **Multilingual corpora** need a model trained for multilingual alignment. Translating everything first can work, but it introduces another failure point.

Index configuration is part of the choice. HNSW parameters, vector normalization, metadata filters, deletion behavior, and re-indexing strategy can change results as much as the model.

## Common failure modes

- **Embedding the wrong unit**: Whole pages are too broad, tiny fragments lack context, and table rows can lose their headers. Fix chunking before blaming the model.
- **Ignoring metadata filters**: A good vector hit from the wrong product, version, tenant, jurisdiction, or language is still wrong.
- **Benchmark shopping**: Picking a model because it tops a public leaderboard can hide worse behavior on your actual query distribution.
- **Over-fine-tuning too early**: Fine-tuning without a clean eval set can bake in stale labels and make future regressions harder to see.
- **Skipping reranking**: Dense retrieval is a recall step. A [reranker](../reranking/) often gives the largest quality jump after a reasonable first-pass index exists.

## Practical checklist

- Build a small query-to-evidence eval set before comparing models.
- Test exact identifiers, abbreviations, negation, and domain jargon.
- Use the model's recommended query and document encoding instructions.
- Store enough metadata to filter by product, version, source, date, and access policy.
- Track recall before generation so bad answers can be traced to retrieval or synthesis.

## References

- [MTEB: Massive Text Embedding Benchmark](https://huggingface.co/spaces/mteb/leaderboard)
- [Matryoshka Representation Learning (arXiv 2205.13147)](https://arxiv.org/abs/2205.13147)
- [OpenAI embeddings guide](https://platform.openai.com/docs/guides/embeddings)
- [BGE-M3 model card](https://huggingface.co/BAAI/bge-m3)

## Related topics

- [Chunking strategies](../chunking/), the retrieval unit that gets embedded
- [Hybrid search](../hybrid-search/), combining vector search with BM25
- [Reranking](../reranking/), second-pass scoring over retrieved candidates
- [Context window management](../../prompt-engineering/context-window-management/), deciding what evidence reaches the model
