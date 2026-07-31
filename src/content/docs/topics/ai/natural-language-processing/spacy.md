---
title: spaCy
description: "spaCy as a production-oriented Python NLP library for tokenization, linguistic annotation, entities, rules, custom components, and batch text pipelines."
parent: natural-language-processing
tags: [nlp, spacy, python, text-processing]
status: draft
created: 2026-07-31
updated: 2026-07-31
---

spaCy is a Python library for building NLP pipelines. It turns raw text into a `Doc` object with tokens, sentence boundaries, part-of-speech tags, lemmas, dependency parses, noun chunks, and named entities, depending on which trained pipeline and components you load.

The practical reason to learn spaCy is that it gives structure to text without turning every decision into an LLM call. It is fast, pipeline-shaped, rule-friendly, and designed for applications that need repeatable language annotations.

## What spaCy is good at

- **Production text pipelines**: A document moves through tokenizer, tagger, parser, lemmatizer, entity recognizer, and custom components.
- **Token-aware rules**: Match on token text, lowercase form, shape, part-of-speech tag, dependency label, lemma, or entity attributes.
- **Named entities**: Extract people, organizations, products, locations, money, dates, and custom domain entities.
- **Noun chunks and dependencies**: Pull compact phrases such as "annual plan" or inspect syntactic relationships.
- **Batch processing**: `nlp.pipe()` processes many texts efficiently and keeps the pipeline API consistent.
- **Custom components**: Add domain logic into the pipeline so extraction, classification hints, and metadata travel with the `Doc`.

## The core object model

```
text -> nlp(text) -> Doc
                   |
                   +-> Token objects
                   +-> Span objects
                   +-> doc.sents
                   +-> doc.ents
                   +-> doc.noun_chunks
```

The `Doc` is the central unit. Tokens know their text and annotations. Spans represent ranges of tokens. Entities are spans with labels. Pipeline components add annotations to the same document instead of passing loose dictionaries through unrelated functions.

## Example: entity extraction with domain rules

```python
import spacy


nlp = spacy.load("en_core_web_sm")

ruler = nlp.add_pipe("entity_ruler", before="ner")
ruler.add_patterns(
    [
        {"label": "PLAN", "pattern": "annual plan"},
        {"label": "PLAN", "pattern": "trial"},
        {"label": "ERROR_CODE", "pattern": [{"LOWER": "error"}, {"LIKE_NUM": True}]},
        {"label": "BILLING_ACTION", "pattern": "charged twice"},
    ]
)

doc = nlp("I was charged twice for the annual plan after error 502.")

for ent in doc.ents:
    print(ent.text, ent.label_)
```

The useful part is not just that spaCy can find entities. The useful part is that rules and statistical predictions can share one document representation. A product name found by an `EntityRuler` can sit beside a date found by the named entity recognizer and noun chunks found by the parser.

## Where spaCy sits beside LLMs

spaCy is a good first pass when you need structured facts:

- Extract `PLAN`, `PRODUCT`, `ERROR_CODE`, `DATE`, `ORG`, and `MONEY`.
- Normalize predictable phrases before retrieval or classification.
- Add deterministic labels that a downstream classifier or LLM can use.
- Pre-filter simple cases so expensive model calls only handle ambiguous tickets.

LLMs are better when the task depends on broad semantic inference:

- "Is this customer angry enough to need escalation?"
- "Does this cancellation request imply a refund?"
- "Write a careful response that follows policy."
- "Summarize this long ticket thread with the next action."

The boundary is not rule-based versus intelligent. The boundary is inspectable structure versus generative judgment.

## spaCy versus NLTK

| Question | Prefer NLTK | Prefer spaCy |
| --- | --- | --- |
| Am I learning how NLP works? | Yes | Useful, but less teaching-focused |
| Do I need WordNet or classic corpora? | Yes | No |
| Do I need a packaged entity pipeline? | No | Yes |
| Do I need token-aware business rules? | Sometimes | Yes |
| Do I need high-throughput document processing? | Usually no | Yes |
| Do I need a production extension point? | Usually no | Yes |

NLTK is a better microscope. spaCy is a better assembly line.

## Common mistakes

- **Expecting perfect entities from a generic model**: A trained pipeline reflects its training data. Product names, plan names, internal codes, and ticket-specific concepts usually need rules or training examples.
- **Writing regex over raw strings first**: spaCy patterns can inspect tokens and annotations. Use that when word boundaries, casing, punctuation, or entity context matter.
- **Forgetting tokenization alignment**: Rule patterns match spaCy tokens. Inspect `[token.text for token in doc]` before assuming a pattern is wrong.
- **Running the full pipeline when you only need tokens**: Disable expensive components for jobs that only need tokenization or rules.

## References

- [spaCy usage documentation](https://spacy.io/usage)
- [spaCy linguistic features](https://spacy.io/usage/linguistic-features)
- [spaCy processing pipelines](https://spacy.io/usage/processing-pipelines)
- [spaCy rule-based matching](https://spacy.io/usage/rule-based-matching)
- [EntityRuler API](https://spacy.io/api/entityruler)

## Related topics

- [Natural Language Processing](../), the broader tool map for classical NLP, spaCy, sparse ML, and LLMs
- [NLTK](../nltk/), the learning and corpus-analysis toolkit that often helps before a spaCy pipeline is designed
- [Structured outputs](../../prompt-engineering/structured-outputs/), the LLM boundary for machine-checkable language output
- [NLTK and spaCy together for support-ticket triage](../../../../posts/2026-07-31-nltk-spacy-support-ticket-triage/), a case study that combines corpus inspection and production extraction
