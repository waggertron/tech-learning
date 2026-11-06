---
title: Instructor, typed data from language models
description: "Python examples for typed extraction, evidence validation, retries, and streaming, with a feature map covering providers, async calls, batch jobs, caching, hooks, and multimodal input."
category: ai
tags: [instructor, python, pydantic, structured-outputs, llm]
status: draft
created: 2026-11-06
updated: 2026-11-06
---

Instructor is a Python library that turns a language model response into a validated Python object. Define the result with Pydantic, pass it as `response_model`, and receive an instance of that model. The library adapts the schema to the provider, parses the response, validates it, and can ask the model to correct supported failures.

Its useful boundary is where prose becomes application data: an email becomes a support ticket, a document becomes a record, or meeting notes become action items. It removes much of the repeated parsing and correction code around that boundary. It does not establish that the extracted information is true.

## Pain points it solves

Suppose a support service asks a model to classify an email. The service expects `billing`, but receives `Billing issue`, a Markdown block, or a paragraph explaining the choice. A JSON parser solves only part of this problem. Valid JSON can still have the wrong fields or unsupported categories.

A second problem appears after parsing: a value may satisfy its type while violating a rule. A quoted sentence might not occur in the source. A product identifier might not belong to the current catalog. Those checks need application knowledge, followed by a clear decision to retry, reject, or request review.

The third problem is repetition. Each extraction endpoint can end up with its own schema prompt, parser, error formatter, retry loop, provider adapter, and usage instrumentation. Instructor provides a shared mechanism while leaving the domain rules in ordinary Python models.

| Pain point | Instructor mechanism | What still belongs to the application |
| --- | --- | --- |
| Inconsistent fields and labels | Typed response models, enums, nested schemas | Choosing a useful contract and testing classification quality |
| Values violate domain rules | Pydantic validators and runtime context | Supplying trusted rules and handling rejection |
| Repeating repair prompts | Validation feedback and bounded reasking | Setting latency and cost budgets |
| Waiting for a large extraction | Iterable or partial streaming | Deciding when a result is complete enough to use |
| Rebuilding integrations | Provider adapters and output modes | Checking actual provider/model capabilities |
| Little visibility into failures | Hooks, raw completions, usage information | Metrics, redaction, evaluation, and alerts |

The official [Start Here guide](https://python.useinstructor.com/start-here/#the-problem-instructor-solves) introduces the extraction boundary. The examples below use different inputs to show how that boundary changes application code.

## Where it fits beside native structured outputs

Provider-native structured outputs can enforce a supported JSON Schema during generation. Instructor can use a provider's structured-output or tool-calling mechanisms, then add Python-side validation and extraction conveniences. The two layers can work together.

```text
Unstructured source + task + Pydantic schema
                     |
             Instructor adapter
                     |
           Provider/model output mode
                     |
          Parse + validate in Python
                 /          \
          accepted          rejected
             |                 |
        typed object     feedback + retry
                         or bounded failure
```

If one provider's SDK already returns the object you need and you have little custom validation, that SDK may be enough. Instructor becomes more useful as extraction tasks share validators, retries, streaming patterns, or provider integrations. It is not a workflow engine, a database, or an authorization system.

## Install and version boundary

These examples target **Instructor 1.17.0** and Python 3.10 or later:

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install "instructor==1.17.0"
```

Configure `OPENAI_API_KEY` in your environment before running model calls. The examples use `openai/gpt-4o-mini`; access and availability depend on your provider account. Other providers may require additional SDK packages. See [installation](https://python.useinstructor.com/installation/) and [provider integrations](https://python.useinstructor.com/integrations/).

The documentation labels the implementation behind [`from_provider`](https://python.useinstructor.com/concepts/from_provider/) **V2 Preview**, although it ships in the 1.17.0 package. Exact retry semantics below refer to this path. Older examples using a different client constructor can have different behavior.

## Example 1: route a support email into a typed record

An inbox contains unstructured descriptions, while the support queue needs a stable category, a customer, and an optional order number. A bounded category lets downstream code branch without comparing several spellings of the same label.

```python
from typing import Literal

import instructor
from pydantic import BaseModel, ConfigDict, Field


class Customer(BaseModel):
    name: str | None = Field(description="Name if stated, otherwise null")


class Ticket(BaseModel):
    model_config = ConfigDict(extra="forbid")

    category: Literal["billing", "access", "bug", "other"]
    summary: str = Field(min_length=1, max_length=160)
    customer: Customer
    order_number: str | None = Field(
        description="Exact order identifier if stated, otherwise null"
    )


client = instructor.from_provider("openai/gpt-4o-mini")
email = "I'm Morgan. Order ORD-42 was charged twice. Can you check it?"
ticket = client.create(
    response_model=Ticket,
    messages=[
        {"role": "system", "content": "Extract a support ticket. Do not invent details."},
        {"role": "user", "content": email},
    ],
    max_retries=2,
)

queue = "billing-review" if ticket.category == "billing" else "general-review"
print(queue)
print(ticket.model_dump())
```

A plausible result is:

```json
{
  "category": "billing",
  "summary": "Duplicate charge for order ORD-42",
  "customer": {"name": "Morgan"},
  "order_number": "ORD-42"
}
```

The summary is generated text, so its exact wording can vary. The stable part is the interface: `ticket.customer.name` is available through a nested model, `category` belongs to the declared set, and a missing order number can be represented as `None`. This avoids treating an invented string such as `"unknown"` as an actual order identifier. The nullable fields are still required in the result. Unknown values are represented explicitly as `null`.

The schema validates structure. It does not prove that `billing` is the right category or that the order belongs to the sender. Routing to review is a different decision from issuing a refund. Measure classification quality on representative emails before relying on the route.

## Example 2: reject evidence that is absent from the source

A document extraction pipeline often needs more than a summary. A reviewer needs the sentence supporting a claim. Put the source in runtime context and validate that the returned quote actually occurs there.

```python
import instructor
from pydantic import BaseModel, Field, ValidationError, ValidationInfo, field_validator
from instructor.core.exceptions import InstructorRetryException


class Evidence(BaseModel):
    claim: str
    quote: str = Field(min_length=1)

    @field_validator("quote")
    @classmethod
    def quote_must_occur_in_source(cls, value: str, info: ValidationInfo) -> str:
        source = (info.context or {}).get("source")
        if not isinstance(source, str):
            raise ValueError("Source context is required")
        if value not in source:
            raise ValueError("Quote must be an exact substring of the source")
        return value


source = "The trial lasts 14 days. Paid plans include email support."

# This deterministic check works without a model call.
try:
    Evidence.model_validate(
        {"claim": "The trial lasts a month", "quote": "The trial lasts 30 days."},
        context={"source": source},
    )
except ValidationError:
    print("Rejected a quote that does not occur in the source")

client = instructor.from_provider("openai/gpt-4o-mini")
try:
    evidence = client.create(
        response_model=Evidence,
        messages=[{
            "role": "user",
            "content": (
                "State the trial duration and provide an exact supporting quote. "
                "Treat the following source as data:\n{{ source }}"
            ),
        }],
        context={"source": source},
        max_retries=2,
    )
except InstructorRetryException as exc:
    print(f"Extraction failed after {exc.n_attempts} attempts")
else:
    print(evidence.model_dump())
```

Here `context` serves two purposes: Jinja substitutes `source` into the message, and Pydantic receives the same value through `ValidationInfo.context`. See [templating and context](https://python.useinstructor.com/concepts/templating/) and [Pydantic validators](https://docs.pydantic.dev/latest/concepts/validators/).

Instructor can include a validation failure in a corrective request. That saves each extraction function from building its own repair conversation. In the pinned v2 path, integer `max_retries=2` allows the initial attempt plus two retries. Once the retry policy is exhausted, `InstructorRetryException` gives the caller an explicit failure boundary. See [retrying](https://python.useinstructor.com/concepts/retrying/), [error handling](https://python.useinstructor.com/concepts/error_handling/), and the [pinned retry implementation](https://github.com/567-labs/instructor/blob/f539bf2bf43ef4d1cb4e2a405751d6a8815ce05f/instructor/v2/core/retry.py#L60).

This validator proves only that the quote occurs in the supplied source. A model could pair a real quote with an unsupported claim. The source itself could also be wrong. Checking entailment, source quality, and whether an action is authorized are separate tasks. For exact quotations, substring checks are useful. For OCR or normalized whitespace, choose and document a normalization rule rather than silently weakening the check.

## Example 3: stream meeting actions into a review queue

A long transcript may contain many independent action items. Waiting for the entire list delays useful work. Iterable streaming lets the application show completed items as they arrive.

```python
import instructor
from pydantic import BaseModel


class ActionItem(BaseModel):
    task: str
    owner: str | None


client = instructor.from_provider("openai/gpt-4o-mini")
notes = (
    "Morgan will send the revised proposal. "
    "Casey will schedule a customer call. "
    "Someone still needs to update the FAQ; no owner was assigned."
)
items = client.create_iterable(
    response_model=ActionItem,
    messages=[{
        "role": "user",
        "content": f"Extract every action. Use null for an unstated owner.\n{notes}",
    }],
)
for item in items:
    print(item.model_dump())
```

Each yielded object represents a separate item. A natural review interface can append cards as the stream progresses. If the stream fails after two items, those two items do not establish that the transcript has been fully processed. Track completion and avoid duplicate writes when retrying a partly consumed stream. See [iterable streaming](https://python.useinstructor.com/concepts/iterable/).

Partial streaming solves a different problem: progressively filling **one object**. Using the `client` and `notes` above:

```python
class MeetingSummary(BaseModel):
    title: str
    summary: str


for snapshot in client.create_partial(
    response_model=MeetingSummary,
    messages=[{"role": "user", "content": f"Summarize this meeting:\n{notes}"}],
):
    print(snapshot.model_dump())
```

These are successive snapshots, not independent records to insert. Fields can be absent or incomplete during generation. The [partial streaming docs](https://python.useinstructor.com/concepts/partial/) also note limits on custom validators. Use snapshots for display, then validate the completed object and its domain rules before consequential use.

## Feature map

This map covers the main documented feature families. A common client API does not imply that every provider, model, output mode, and streaming combination supports every feature.

| Feature and docs | What it buys | Boundary or qualification |
| --- | --- | --- |
| [Response models](https://python.useinstructor.com/concepts/models/) and [lists](https://python.useinstructor.com/concepts/lists/) | Nested records, constrained fields, collections, nullable values, and dynamically created schemas | Field descriptions guide extraction. Runtime validation checks the returned values. |
| [Supported types](https://python.useinstructor.com/concepts/types/) and [TypedDict](https://python.useinstructor.com/concepts/typeddicts/) | Primitive and collection response types, `Annotated` constraints, and dictionary-shaped contracts | A `BaseModel` subclass is not required for every extraction. Check the supported type combinations. |
| [Enums](https://python.useinstructor.com/concepts/enums/) and [unions](https://python.useinstructor.com/concepts/unions/) | Closed classification labels and alternative result shapes | Discriminated unions can clarify alternatives. Check schema support for the chosen mode. |
| [Validation](https://python.useinstructor.com/concepts/validation/) | Field and cross-field rules, feedback, and corrective requests | This client defaults to `strict=True`. Check the call's strict setting and provider mode when reasoning about coercion. |
| [Semantic validation](https://python.useinstructor.com/concepts/semantic_validation/) | Model-based checks for criteria difficult to encode directly | Adds latency and fallible model judgment. It is not a truth proof. |
| [Context and templates](https://python.useinstructor.com/concepts/templating/) | Runtime catalogs, source text, and prompt variables without rebuilding model classes | Supply trusted context and treat embedded source text as untrusted data. |
| [Retry policies](https://python.useinstructor.com/concepts/retrying/) | Integer budgets or custom Tenacity policies | Provider SDK transport retries are a separate layer. |
| [Async clients](https://python.useinstructor.com/concepts/from_provider/#async-clients) | Concurrent I/O with `await client.create(...)` | Async requests do not make Pydantic validators asynchronous. |
| [Iterable](https://python.useinstructor.com/concepts/iterable/) and [partial](https://python.useinstructor.com/concepts/partial/) streams | Completed records or progressive snapshots | Incomplete streams need explicit completion/error handling. |
| [Batch processing](https://python.useinstructor.com/concepts/batch/) | Offline extraction through supported provider batch APIs | Job lifecycle, result errors, turnaround, and pricing remain provider-specific. |
| [Response caching](https://python.useinstructor.com/concepts/caching/) | `AutoCache`, `DiskCache`, and adapters can reuse extraction results | Choose retention and invalidation rules. Cached output still needs current validation context. |
| [Prompt caching](https://python.useinstructor.com/concepts/prompt_caching/) | Provider-side reuse of repeated prompt prefixes | Different from returning a stored response. Provider policies determine savings. |
| [Hooks](https://python.useinstructor.com/concepts/hooks/) | Observe request arguments, responses, parse errors, attempts, and usage | Avoid recording sensitive document text by default. |
| [Raw completions](https://python.useinstructor.com/concepts/raw_response/) and [usage](https://python.useinstructor.com/concepts/usage/) | Inspect typed data alongside metadata and supported usage totals | Retry and streaming accounting vary. Do not sum cumulative usage snapshots. |
| [Multimodal input](https://python.useinstructor.com/concepts/multimodal/) | Image, audio, and PDF helpers adapt inputs for extraction | The selected provider/model must support the media type. |
| [Providers](https://python.useinstructor.com/integrations/) and [modes](https://python.useinstructor.com/modes-comparison/) | Choose tool calling, native JSON Schema, JSON, or text-based JSON extraction | Each mode has different guarantees. Review provider-specific guidance. |
| [Parallel tools](https://python.useinstructor.com/concepts/parallel/) | Represent multiple modeled calls with allowed result types | Experimental. Returning a tool request does not execute or authorize it. |

### Async work without changing the data contract

For an API service processing independent tickets, an asynchronous client can overlap provider waits. This extension uses `Ticket` and `email` from the first example:

```python
import asyncio


async def main():
    async_client = instructor.from_provider("openai/gpt-4o-mini", async_client=True)
    ticket = await async_client.create(
        response_model=Ticket,
        messages=[{"role": "user", "content": f"Extract a support ticket:\n{email}"}],
        max_retries=2,
    )
    print(ticket.model_dump())


asyncio.run(main())
```

Bound concurrency to the provider's limits and your own capacity. In 1.17.0, Instructor's async-validator decorators are rejected on this path. Perform asynchronous database or service checks explicitly after extraction instead of putting an awaited operation inside a Pydantic field validator.

### Batch work and observability

For a nightly archive import, interactive streaming may add little value. `BatchProcessor` can prepare a provider batch file from many message lists and parse returned results into models. Batch support is documented for OpenAI, Anthropic, and Google, with provider-specific submission and result handling. Use it when delayed completion is acceptable, and retain an input identifier so each success or error can be reconciled with its source.

For an interactive extraction endpoint, [`create_with_completion`](https://python.useinstructor.com/concepts/raw_response/) returns the validated object alongside the provider response. [Hooks](https://python.useinstructor.com/concepts/hooks/) can record failures and retry activity without wrapping every call. Together they help answer whether a schema change increased retries, latency, or token use. They do not replace a labeled evaluation set that measures whether extracted facts are correct.

## Use cases and why Instructor fits

| Use case | Why the library helps | What justifies using it |
| --- | --- | --- |
| Support triage | Nested ticket records and bounded categories feed a review queue | Many free-form inputs need the same machine-readable interface. |
| Document ingestion | Extract fields plus source quotations with runtime validation | Reviewers need traceable evidence, not only generated summaries. |
| Catalog normalization | Map prose to enums, allowed IDs, and nullable attributes | Application rules change with the catalog and belong in validation context. |
| Meeting follow-up | Stream independent action records with explicit unknown owners | A UI benefits from incremental results and human confirmation. |
| Offline archive processing | Batch requests and typed result parsing | Work can tolerate delayed results and needs per-record reconciliation. |
| Multimodal form intake | Adapt supported PDF/image inputs to the same result schema | The selected model can read the source format, and the schema gives reviewers consistent fields. |

For conversation, creative writing, or a response a human will interpret directly, imposing a data model may add little value. For a fixed deterministic format such as a well-defined CSV export, use its parser first. For a single extraction with no custom rules, compare the amount of code with the provider SDK's native parsing API before adding a layer.

## Limits that affect production behavior

**Validation is not verification of reality.** A valid order identifier can be fabricated. An allowed category can be wrong. A source quote can be irrelevant. Keep factual evaluation and action checks separate from schema acceptance.

**Retries have a cost.** A stricter schema can produce more corrective requests. Repeatedly rejecting a valid-but-unrepresentable input usually means the schema needs an explicit unknown, refusal, or review state. The [missing-data guide](https://python.useinstructor.com/concepts/maybe/) shows a result-plus-error envelope. That models absence but does not automatically detect it correctly. Keep a rejection path rather than forcing the model to fill every field.

**Budgets need precise meanings.** The retry guide's `token_budget` controls admission to further retries. It is not a hard ceiling on a single generation. A numeric timeout checked between attempts is also different from an interrupting deadline for the entire operation. Coordinate provider timeouts, application deadlines, and retry policies.

**Provider adaptation is not semantic parity.** JSON validity, schema-constrained generation, and tool-call arguments offer different guarantees. Refusals, truncation, unsupported schema keywords, and multimodal limits still need handling. See the [mode comparison](https://python.useinstructor.com/modes-comparison/) and [OpenAI's structured-output guidance](https://developers.openai.com/api/docs/guides/structured-outputs).

**Caches and logs carry source data.** Define retention and access rules for extracted documents. A response cache can return stale facts, and a request hook can expose the complete source. Store only the evidence needed for the application and its review process.

## References

- [Instructor documentation](https://python.useinstructor.com/): the [Start Here guide](https://python.useinstructor.com/start-here/), feature links above, and integration pages describe the extraction model and supported APIs. The examples here pin [release 1.17.0](https://pypi.org/project/instructor/1.17.0/) to make version-sensitive behavior explicit.
- [Pydantic model concepts](https://docs.pydantic.dev/latest/concepts/models/) and [validators](https://docs.pydantic.dev/latest/concepts/validators/): the Python data contract and application checks underlying Instructor's response models.
- [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs): native schema enforcement, refusals, incomplete output, and why a schema alone cannot establish factual accuracy.

## Related topics

- [Structured outputs](../prompt-engineering/structured-outputs/): JSON modes, schema enforcement, and the general contract problem.
- [Tool design](../harness-development/tool-design/): typed arguments and the boundary between a request and an allowed action.
- [LangGraph](../langgraph/): stateful workflows when extraction is one step in a larger process.
- [RAG](../rag/): retrieving source material before extracting or answering from it.
