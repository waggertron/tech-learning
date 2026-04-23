---
title: Embeddings
description: Dense vector representations that let you do semantic search — model choice, dimensionality, fine-tuning, and matryoshka representations.
parent: rag
tags: [rag, embeddings, retrieval]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

An embedding model maps text into a dense vector in some latent space where semantic similarity corresponds to geometric proximity. The choice of model, dimensionality, and how you use the vectors dominates retrieval quality — you can't out-prompt a bad embedding choice.

## Key ideas

- **Model selection** — Benchmarks like MTEB rank models across tasks. Top open: `bge-m3`, `gte-large`, `nomic-embed`. Top commercial: OpenAI `text-embedding-3-large`, Cohere `embed-v3`, Voyage.
- **Dimensionality** — Higher isn't always better. More dims = more storage, more compute, slower ANN. 512–1024 is a common sweet spot; some tasks need more.
- **Matryoshka representations** — Models trained so that prefixes of the full vector are themselves useful embeddings. Lets you store full vectors and query with a truncated prefix for speed, or scale up/down dynamically.
- **Domain fine-tuning** — Off-the-shelf models are trained on generic web data. Fine-tuning on your domain's text (legal, medical, internal codebase) can meaningfully beat bigger generic models.
- **Asymmetric query/document embedding** — Some models embed queries and documents with different prompts or even different encoder towers. Use the model's recommended encoding instructions.

## References

- [MTEB: Massive Text Embedding Benchmark](https://huggingface.co/spaces/mteb/leaderboard)
- [Matryoshka Representation Learning (arXiv 2205.13147)](https://arxiv.org/abs/2205.13147)
- [OpenAI embeddings guide](https://platform.openai.com/docs/guides/embeddings)
- [BGE-M3 model card](https://huggingface.co/BAAI/bge-m3)
