---
title: Natural Language Processing
description: "Classical NLP, modern Python pipelines, and how deterministic language tooling still fits beside LLMs."
category: ai
tags: [nlp, python, text-processing, language]
status: draft
created: 2026-07-31
updated: 2026-07-31
---

Natural language processing is the engineering layer between raw text and useful structure. It covers old-school corpus analysis, tokenization, tagging, parsing, named entities, text classification, search features, and language-aware preprocessing. LLMs changed the ceiling of what language systems can do, but they did not remove the need to inspect, normalize, route, classify, and measure text.

The practical split is simple: classical NLP gives you visible moving parts. LLMs give you broad semantic behavior. A good system often uses both.

## What this topic covers

- **Classical text processing**: Tokens, stems, lemmas, stop words, n-grams, frequency distributions, concordances, and corpus inspection.
- **Linguistic annotation**: Part-of-speech tags, dependency parses, noun chunks, named entities, and sentence boundaries.
- **Text classification baselines**: Sparse features such as bag-of-words and TF-IDF, then a measurable classifier.
- **Domain rules**: Product names, plan names, error codes, regulatory terms, and business phrases that need deterministic handling.
- **LLM boundaries**: Translation, summarization, response drafting, fuzzy intent handling, and semantic review when rules or sparse features are too brittle.

## Tool map

| Tool | Best use | Weak fit |
| --- | --- | --- |
| NLTK | Learning NLP fundamentals, corpus exploration, WordNet, classic preprocessing, small deterministic experiments | Production pipelines that need speed, packaging, and maintained statistical components |
| spaCy | Production NLP pipelines, token-aware rules, entities, noun chunks, dependency parsing, custom components | Teaching every classical NLP concept from first principles |
| scikit-learn | Fast text-classification baselines with TF-IDF or count features | Generating language or extracting nuanced meaning without labeled data |
| LLMs | Translation, summarization, response drafting, fuzzy semantic judgment, low-label bootstrapping | Cheap deterministic batch preprocessing where exact repeatability matters |

## Subtopics

- [NLTK](./nltk/): the teaching and corpus-analysis toolkit that still matters when you want to see how NLP works.
- [spaCy](./spacy/): the production-oriented Python NLP library for pipelines, entities, token-aware rules, and annotation.

## References

- [NLTK documentation](https://www.nltk.org/)
- [NLTK Book](https://www.nltk.org/book/)
- [spaCy usage documentation](https://spacy.io/usage)
- [scikit-learn, Working With Text Data](https://scikit-learn.org/stable/tutorial/text_analytics/working_with_text_data.html)

## Related topics

- [RAG](../rag/), retrieval systems that still depend on chunking, text normalization, and lexical signal
- [Embeddings](../rag/embeddings/), dense representations for semantic search
- [Hybrid search](../rag/hybrid-search/), sparse and dense retrieval working together
- [Structured outputs](../prompt-engineering/structured-outputs/), the LLM-side boundary for turning language into machine-checkable data
