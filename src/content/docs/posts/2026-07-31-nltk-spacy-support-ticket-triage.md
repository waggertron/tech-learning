---
title: "NLTK and spaCy together: support-ticket triage without calling an LLM for everything"
description: "A support-ticket case study that uses NLTK for corpus inspection, spaCy for structured extraction, scikit-learn for a measurable baseline, and an LLM only for ambiguous judgment or response drafting."
date: 2026-07-31
tags: [nlp, nltk, spacy, python, machine-learning]
crosspost: [linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-31-nltk-spacy-support-ticket-triage/
---

LLMs changed NLP, but they did not make every text problem a generation problem.

Support-ticket triage is a good example. A team does not need a model to write poetry about a billing issue. It needs to route the ticket, extract the product and plan, catch high-risk cases, measure accuracy, and decide when a human or LLM should handle the ambiguous part.

The useful architecture is layered:

```
Tickets
  |
  v
NLTK corpus audit
  |
  v
spaCy extraction pipeline
  |
  v
TF-IDF classifier baseline
  |
  v
LLM only for ambiguous review or response drafting
```

NLTK and spaCy are not competitors in this workflow. NLTK helps you understand the corpus. spaCy turns that understanding into a repeatable pipeline.

## The case study

Imagine a SaaS company with 5,000 labeled support tickets across these categories:

- `billing`
- `account_access`
- `bug_report`
- `cancellation`
- `sales_question`
- `security`

The team wants a first triage system with three requirements:

- Route obvious tickets automatically.
- Extract entities such as plan names, product areas, error codes, money, and dates.
- Send uncertain or sensitive tickets to a human or LLM review step.

Calling an LLM for every ticket hides the baseline, costs more, and makes it harder to know whether the system actually understands the ticket distribution.

## Step 1: use NLTK to inspect the corpus

Start with the cheap questions.

```python
from collections import Counter, defaultdict

import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize


STOP_WORDS = set(stopwords.words("english"))


def clean_tokens(text: str) -> list[str]:
    return [
        token
        for token in word_tokenize(text.lower())
        if token.isalpha() and token not in STOP_WORDS
    ]


def top_terms_by_label(rows: list[dict[str, str]], limit: int = 12) -> dict[str, list[tuple[str, int]]]:
    counts_by_label: dict[str, Counter[str]] = defaultdict(Counter)

    for row in rows:
        counts_by_label[row["label"]].update(clean_tokens(row["text"]))

    return {
        label: counts.most_common(limit)
        for label, counts in counts_by_label.items()
    }
```

This is not the classifier. It is the map. You are looking for visible label signals:

| Label | Likely terms |
| --- | --- |
| `billing` | charged, invoice, refund, receipt, card, tax |
| `account_access` | password, login, reset, locked, 2fa |
| `bug_report` | error, crash, failed, upload, blank, dashboard |
| `cancellation` | cancel, renewal, trial, downgrade, subscription |
| `security` | suspicious, unauthorized, breach, phishing, compromised |

The first payoff is vocabulary. If `2fa`, `MFA`, `two factor`, and `authenticator` all appear under account access, the pipeline needs to normalize them before classification and extraction.

The second payoff is humility. If `refund` appears in both `billing` and `cancellation`, a keyword rule alone will over-route tickets. That is where a classifier or LLM review step earns its keep.

## Step 2: use WordNet carefully

NLTK's WordNet interface can suggest related language, but it does not know your business policy.

```python
from nltk.corpus import wordnet as wn


def wordnet_terms(seed: str) -> set[str]:
    terms: set[str] = set()
    for synset in wn.synsets(seed):
        for lemma in synset.lemmas():
            terms.add(lemma.name().replace("_", " "))
    return terms


print(sorted(wordnet_terms("cancel"))[:20])
```

Treat those terms as review candidates, not automatic production rules. In a subscription system, `cancel`, `pause`, `downgrade`, and `expire` may point to nearby user intent, but they can trigger different side effects.

## Step 3: turn domain knowledge into a spaCy pipeline

Once the corpus audit has surfaced useful language, encode the stable parts in spaCy.

```python
import spacy
from spacy.tokens import Doc


nlp = spacy.load("en_core_web_sm")

ruler = nlp.add_pipe("entity_ruler", before="ner")
ruler.add_patterns(
    [
        {"label": "PLAN", "pattern": "annual plan"},
        {"label": "PLAN", "pattern": "monthly plan"},
        {"label": "PLAN", "pattern": "trial"},
        {"label": "PRODUCT_AREA", "pattern": "dashboard"},
        {"label": "PRODUCT_AREA", "pattern": "file upload"},
        {"label": "AUTH_FACTOR", "pattern": "2FA"},
        {"label": "AUTH_FACTOR", "pattern": "MFA"},
        {"label": "ERROR_CODE", "pattern": [{"LOWER": "error"}, {"LIKE_NUM": True}]},
    ]
)


def extract_ticket_features(text: str) -> dict[str, object]:
    doc: Doc = nlp(text)
    return {
        "entities": [(ent.text, ent.label_) for ent in doc.ents],
        "noun_chunks": [chunk.text for chunk in doc.noun_chunks],
        "lemmas": [token.lemma_.lower() for token in doc if token.is_alpha],
        "has_money": any(ent.label_ == "MONEY" for ent in doc.ents),
        "has_error_code": any(ent.label_ == "ERROR_CODE" for ent in doc.ents),
    }
```

This gives the classifier and reviewers structured evidence:

```python
ticket = "I was charged twice for the annual plan after error 502."
print(extract_ticket_features(ticket))
```

Expected shape:

```python
{
    "entities": [
        ("annual plan", "PLAN"),
        ("error 502", "ERROR_CODE"),
    ],
    "noun_chunks": ["I", "the annual plan", "error"],
    "lemmas": ["i", "be", "charge", "twice", "for", "the", "annual", "plan", "after", "error"],
    "has_money": False,
    "has_error_code": True,
}
```

The exact output depends on the installed spaCy model, but the architectural point holds: stable domain facts become deterministic annotations.

## Step 4: build the boring baseline

Use scikit-learn before reaching for an LLM. A sparse text classifier gives you a measurable floor.

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


def train_ticket_classifier(texts: list[str], labels: list[str]) -> Pipeline:
    train_x, test_x, train_y, test_y = train_test_split(
        texts,
        labels,
        test_size=0.2,
        random_state=42,
        stratify=labels,
    )

    classifier = Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    ngram_range=(1, 2),
                    min_df=2,
                    sublinear_tf=True,
                ),
            ),
            (
                "model",
                LogisticRegression(max_iter=1000),
            ),
        ]
    )

    classifier.fit(train_x, train_y)
    predictions = classifier.predict(test_x)
    print(classification_report(test_y, predictions))
    return classifier
```

This baseline is cheap, fast, and honest. It tells you which labels are easy, which labels overlap, and which examples need richer handling.

Do not skip the confusion matrix. If `billing` and `cancellation` are confused, that is a product-language problem. If `security` has low recall, that is a risk problem. If `bug_report` errors dominate everything, the labels may be too broad.

## Step 5: combine classifier confidence with spaCy evidence

The routing layer should not blindly trust one signal.

```python
SENSITIVE_LABELS = {"security"}


def route_ticket(text: str, classifier: Pipeline) -> dict[str, object]:
    features = extract_ticket_features(text)
    probabilities = classifier.predict_proba([text])[0]
    labels = classifier.classes_

    best_index = int(probabilities.argmax())
    predicted_label = labels[best_index]
    confidence = float(probabilities[best_index])

    needs_review = (
        confidence < 0.75
        or predicted_label in SENSITIVE_LABELS
        or features["has_error_code"]
    )

    return {
        "label": predicted_label,
        "confidence": round(confidence, 3),
        "entities": features["entities"],
        "needs_review": needs_review,
    }
```

This is where the system becomes useful:

- Obvious billing ticket with high confidence: route to billing automation.
- Security ticket with high confidence: route to human review anyway.
- Bug report with an error code: attach extracted evidence before routing.
- Low-confidence cancellation or refund ticket: send to LLM review or human support.

The LLM is not removed. It is moved to the work that actually needs semantic judgment.

## Where the LLM belongs

Use the LLM after the deterministic layers have done their job:

- Label tickets where the classifier is uncertain.
- Explain why a ticket may belong to two queues.
- Draft a support response from extracted facts and approved policy text.
- Summarize long ticket threads for a human reviewer.
- Suggest new entity rules after reviewing repeated failure cases.

Keep the LLM behind structured inputs and outputs. Pass the extracted entities, classifier prediction, confidence, and retrieved policy snippets. Ask for a constrained decision, not a free-form guess.

## Why this beats an LLM-only design

An LLM-only design can work for demos. It is weaker as the first production baseline.

| Concern | Layered NLP design | LLM-only design |
| --- | --- | --- |
| Cost | Cheap for the common path | Pays model cost for every ticket |
| Repeatability | Deterministic preprocessing and classifier scores | Depends on prompt, model, sampling, and policy drift |
| Debugging | Inspect terms, entities, features, labels, and confidence | Harder to localize the failure |
| Measurement | Standard train-test evaluation | Requires a separate eval harness |
| Safety | Sensitive routes can be hard-coded | Every boundary needs prompt and schema discipline |

The strong version is not anti-LLM. It is anti-mystery. Classical NLP gives you the visible baseline. spaCy gives you structured extraction. scikit-learn gives you measurable routing. The LLM handles the cases where meaning is still unresolved.

## Implementation checklist

1. Export 5,000 historical tickets with labels and remove private customer data.
2. Use NLTK to inspect top terms, n-grams, and label overlap.
3. Define entity labels for plan names, product areas, error codes, billing actions, and authentication terms.
4. Encode stable domain entities with spaCy's `EntityRuler`.
5. Train a TF-IDF classifier and read precision, recall, and confusion matrices.
6. Route high-confidence, low-risk tickets automatically.
7. Send low-confidence or sensitive tickets to human or LLM review.
8. Feed reviewed failures back into the rules, labels, and classifier dataset.

## References

- [NLTK documentation](https://www.nltk.org/)
- [NLTK Book](https://www.nltk.org/book/)
- [spaCy processing pipelines](https://spacy.io/usage/processing-pipelines)
- [spaCy rule-based matching](https://spacy.io/usage/rule-based-matching)
- [scikit-learn, Working With Text Data](https://scikit-learn.org/stable/tutorial/text_analytics/working_with_text_data.html)
- [scikit-learn TfidfVectorizer](https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html)

## Related topics

- [Natural Language Processing](../../topics/ai/natural-language-processing/), the tool map for NLTK, spaCy, sparse ML, and LLMs
- [NLTK](../../topics/ai/natural-language-processing/nltk/), the corpus-inspection layer used before pipeline design
- [spaCy](../../topics/ai/natural-language-processing/spacy/), the structured extraction layer used before routing
- [Structured outputs](../../topics/ai/prompt-engineering/structured-outputs/), the LLM boundary for review and response drafting
