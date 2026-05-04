---
title: Long-context benchmarks
description: "Needle in a Haystack (NIAH), RULER, HELMET, LongBench, U-NIAH. The benchmark family that exposed the gap between 'the model's context window says 2 million tokens' and 'the model actually uses that context.'"
parent: benchmarks
tags: [long-context, niah, ruler, helmet, longbench, benchmarks]
status: draft
created: 2026-04-24
updated: 2026-05-04
---

## What these benchmarks test

A model's advertised context length (say, 1 million tokens) is one thing. Whether the model can actually **find**, **remember**, and **use** information buried deep in that context is a different question, and the gap is often enormous.

Long-context benchmarks test the latter. They're the reason "2M context window" claims need an asterisk.

The field has gone through three distinct generations: NIAH (2023, now saturated), RULER (2024, synthetic but multi-hop), and HELMET (2024/2025, 59 models, real downstream tasks). Each generation was created because the previous one got gamed.

---

## The NIAH saturation problem

Vanilla Needle in a Haystack was the right tool for 2023. By 2024 it was mostly obsolete for frontier models. By mid-2025, every serious model scores near 100% on basic NIAH.

The problem is that NIAH tests a single capability: retrieve one specific fact from a long document. Real tasks are almost never that clean. You need to find multiple related facts, combine them, resolve contradictions between them, or count occurrences across a full document. NIAH doesn't test any of that.

**The pattern repeats.** NIAH got gamed, so RULER was created (13 synthetic tasks, multi-hop chains). RULER scores are still improving, so HELMET was created (7 real task categories, 59 models, downstream performance metrics). Each benchmark measures something real, gets saturated, gets replaced with something harder and more realistic.

This churn is useful to track. When a vendor says "our model scores 98% on long-context benchmarks," ask which benchmark. A 98% NIAH score in 2026 means almost nothing.

---

## NIAH, Needle in a Haystack

Greg Kamradt's 2023 test. Take a long document ("haystack"), insert a small, specific fact ("needle"), ask the model a question whose answer requires that fact.

Example:

- Haystack: a 500K-token chunk of Paul Graham essays.
- Needle: "The best thing to do in San Francisco is eat a sandwich and sit in Dolores Park on a sunny day."
- Question: "What is the best thing to do in San Francisco?"

Measured by whether the model produces the needle. Repeated across context lengths and needle positions, a heatmap is the standard visualization.

**Why it went viral.** It's conceptually simple, easy to implement, and produces a compelling visual: models with "1M token context" sometimes have glaring blind spots at specific positions.

**Saturation (2024-2025).** Fully saturated for frontier models. Every 100K+ context model scores near 100% on vanilla NIAH. The benchmark no longer differentiates.

---

## RULER

NVIDIA, 2024. The response to NIAH's saturation. RULER ("What's the Real Context size?") extends NIAH with 13 synthetic tasks across four categories, tested at context lengths of 4K, 8K, 16K, 32K, 64K, and 128K tokens.

### Task category 1: Needle in a Haystack (retrieval)

Three sub-variants:

- **Simple NIAH.** Find one fact buried in noise. This is the original NIAH. Frontier models pass it at all context lengths.
- **Multi-key NIAH.** Find N related facts, all buried in different parts of the context. Each key may be needed to answer the question. Accuracy drops sharply as N increases.
- **Multi-value NIAH.** A single key maps to multiple values; retrieve all of them. Tests whether the model stops after the first match.

### Task category 2: Variable tracking

Chains of assignments buried in token noise. The model must trace a chain to produce a final value.

**Concrete example.** In 128K tokens of unrelated text, the following three sentences appear scattered roughly 40K tokens apart from each other:

> "Let value_7 be 42. Let value_12 be value_7 plus 8. Let result be value_12 times 3. What is result?"

Answer: value_7 = 42, value_12 = 42 + 8 = 50, result = 50 * 3 = **150**.

This requires finding all three sentences, recognizing the dependency chain, and performing the arithmetic in order. Models that ace simple NIAH regularly fail this at 32K+ context. The model sees the question, looks up "result," finds "value_12 times 3," but then fails to propagate the lookup of value_12 back to value_7 correctly when those definitions are tens of thousands of tokens apart.

### Task category 3: Common word extraction (aggregation)

Find the most frequently occurring word across a 128K-document. This is not retrieval of a planted fact; it requires scanning the entire context and counting. Aggregation tasks expose a failure mode that retrieval tasks cannot: the model finding a locally frequent word in a nearby chunk rather than the globally most frequent word across the full document.

### Task category 4: Question answering

Non-synthetic QA using SQuAD and HotpotQA questions, with the relevant passages buried inside a long noise document. HotpotQA questions require multi-hop reasoning across two separate passages. This bridges synthetic and real-world evaluation.

### Key finding

Models scoring near 100% on vanilla NIAH often score **far below 70%** on multi-hop and aggregation tasks at the same context length. The gap between "can find a needle" and "can reason across multiple needles" is the main result of the RULER paper.

### Score table (128K context, RULER overall)

| Model | Advertised context | RULER score (128K) |
|---|---|---|
| Gemini 1.5 Pro | 1M tokens | ~95-96% |
| Jamba-1.5-Large | 256K tokens | ~95-96% |
| GPT-4.1 | 1M tokens | highest mean (0.588 normalized) |
| Most open-source 32K+ models | 32K-128K | significant degradation, some below 37% on harder tasks |

**Effective context length** (where RULER score drops below 85%) is often 1/4 to 1/8 of the advertised context for open-source models. A model advertised at 128K may have an effective RULER context of 16-32K.

---

## HELMET

Princeton, 2024/2025. "How to Evaluate Long-context Language Models Effectively and Thoroughly." The most comprehensive long-context benchmark to date: 59 models evaluated across 7 task categories, covering both synthetic and real downstream tasks.

The central motivation: RULER exposed that NIAH was too easy, but RULER is still entirely synthetic. HELMET asks whether synthetic scores predict real task performance. The answer, from the 59-model study, is largely no.

### The 7 HELMET categories

**1. RAG-style recall.** Retrieval-augmented QA using NQ (Natural Questions), TriviaQA, and HotpotQA. Relevant passages are buried in a long document collection. Closest to real RAG deployment.

**2. Long-document QA.** Questions over single long documents (books, papers, reports). Requires integrating information from many positions in a single source.

**3. Passage re-ranking.** Given a long list of candidate passages and a query, rank them by relevance. At long context, this is hard: the model must evaluate dozens of passages simultaneously and output a ranked list without losing its place.

**4. Citation generation.** Given a 128K-token collection of research papers or articles, generate a paragraph on a topic (for example, "the role of attention mechanisms in transformers") with inline citations pointing to specific passages. This requires simultaneously finding relevant content across many documents, attributing claims to the right source, and synthesizing across sources into coherent prose. Frontier models "struggle significantly" at this task at long context.

**Concrete example of why citation generation is hard.** Suppose the task is to write a 200-word paragraph on "the role of attention mechanisms in transformers" with citations, given 128K tokens of NLP papers. The model must: (a) locate passages across 20-30 papers that are relevant to attention mechanisms, (b) decide which claims need citation versus which are general knowledge, (c) attribute each claim to the correct paper without hallucinating a citation or swapping attribution between papers, and (d) synthesize the cited material into coherent prose. Each of (a), (b), (c), (d) is independently hard at long context. Combined, frontier models fail substantially even at 32K.

**5. Summarization.** Condense a long document into a faithful summary. Tests whether the model loses important information from the middle and whether it hallucinates details not present in the source.

**6. In-context learning (ICL).** Learn a new task (a classification rule, a format, a style) from many examples in the context window, then apply it to a new input. Tests the model's ability to pick up patterns across a long demonstration sequence.

**7. Long-context understanding.** Tasks that require global comprehension of a long document: timeline reconstruction, character tracking across a novel, thematic analysis of a long report.

### Key findings from the 59-model study

- **Synthetic NIAH scores are poor predictors of downstream performance.** High RULER scores do not reliably indicate high HELMET scores on real tasks. The correlation between NIAH-family performance and task-specific performance is weak.
- **Different HELMET categories have low correlation with each other.** A model that excels at summarization does not necessarily excel at citation generation or passage re-ranking. There is no single "long-context ability" dimension; the skill is task-specific.
- **Open-source models significantly lag closed models as context grows.** The gap widens with context length. At 8K, the difference is modest. At 128K, the gap is large on real tasks.
- **Frontier models struggle on citation generation and passage re-ranking** at long contexts. Even GPT-4-class models show meaningful degradation on these categories as context approaches 128K.
- **GPT-4.1 achieved the highest mean RULER score (0.588)** among models studied in the HELMET evaluation set.

---

## LongBench and LongBench v2

Tsinghua, 2023/2024. Multi-domain long-context benchmark covering single- and multi-document QA, summarization, few-shot learning, synthetic tasks, and code completion.

**What it adds over NIAH/RULER.** Real-world document distributions: research papers, code repositories, long dialogues, legal documents. Not just synthetic haystacks.

**LongBench v2.** Extends to code repositories, structured data, long dialogues, and tasks requiring "deep reasoning and awareness" over context.

**Current state.** Top models score 50-70% depending on task mix. Clean signal; hard to saturate.

---

## U-NIAH

Unified NIAH framework (2025). Extends beyond traditional NIAH with:

- **Multi-needle.** Multiple facts inserted; model must retrieve all.
- **Long-needle.** The needle itself is long, requiring the model to track a multi-sentence fact.
- **Needle-in-needle.** Nested context where relevant facts contain their own references.
- **Distractor needles.** Plausible-but-wrong facts inserted alongside the real one.

Integrates with RAG evaluation; the same framework scores retrieval-augmented setups.

---

## Sequential-NIAH

2025. Evaluates extraction of sequential information: a list of facts in order, not a single needle. Exposes a common failure mode: models find the first and last needles but miss middle ones.

---

## Infinite Bench / InfiniteBench

Academic benchmark for extreme long-context (100K to 1M+ token inputs). Tasks include novel summarization, long-document QA, and code understanding across a full repo.

**Current state.** Frontier models in the 40-60% range on the hardest subtasks. Still differentiates.

---

## What long-context benchmarks reveal

### 1. Advertised context length is a ceiling, not a floor

A "1M-token context" model may have an effective context of 128K for retrieval tasks and much less for reasoning tasks. Always test your own retrieval pattern against the specific model.

### 2. Middle-of-context degradation

The "lost in the middle" effect: models find information at the start and end of context much better than in the middle. LongBench and RULER both show this consistently.

### 3. Distractor sensitivity

Adding plausible-but-wrong needles drops accuracy by 20+ points even in frontier models. Relevant for RAG: a retrieval that pulls in 10 chunks with 1 right answer is harder than a single-needle scenario.

### 4. Attention drops off with noise

Extremely relevant for agents with long tool-use histories. The more prior steps in the context, the less reliably the model uses them.

### 5. Reasoning-mode helps but isn't magic

Reasoning models do better on RULER than non-reasoning variants at the same context, but the "effective context" gap remains, just shifted upward.

---

## What long-context benchmarks don't measure

The following are real production problems that no current benchmark captures reliably.

**True multi-document synthesis at 500K-1M tokens.** Current benchmarks top out at 128K for most tasks. The 500K-1M range, which is where large codebase analysis or full legal discovery sets live, is essentially uncharted territory for standardized evaluation.

**Maintaining accurate factual recall across a weeks-long conversation.** A model that handles a 128K context well at session start may degrade as a conversation accumulates tool calls, agent scratchpad output, and revised drafts. Benchmarks are single-shot; production agents are not.

**Detecting contradictions between documents in a long context.** If document A says "the deployment date was March 15" and document B says "the deployment date was March 22," can the model surface the conflict rather than silently picking one? No benchmark tests this systematically.

**Reasoning about temporal relationships across a long document.** Tracking which events happened before which other events across a 100K-token historical document requires more than retrieval. Models that can find a date cannot necessarily reconstruct a timeline correctly.

**Latency and cost.** Long contexts cost real dollars per call.

**Streaming.** Models optimized for long context may handle streamed input worse.

**Prompt caching efficiency.** Not all models benefit equally from prompt caching on long contexts.

**KV-cache memory pressure.** At deploy time, long context means GPU memory pressure. Benchmarks don't model this.

---

## How to evaluate for your use case

Generic long-context benchmarks are a coarse signal. For a specific deployment:

- **Identify your real retrieval pattern.** A RAG system pulling 10 chunks of 500 tokens each is very different from a system summarizing a 500K document.
- **Build a small custom NIAH.** Put your real documents in, insert facts that matter for your use case, measure.
- **Measure distractor tolerance.** Include chunks that look relevant but aren't.
- **Test both retrieval and reasoning.** "Find X" and "reason over X" are different failure modes.
- **Check the benchmark vintage.** A 98% NIAH score in 2026 is table stakes, not a differentiator. Ask for HELMET scores on the categories that match your task.

---

## References

- [NIAH, Greg Kamradt's repo](https://github.com/gkamradt/LLMTest_NeedleInAHaystack)
- [RULER, NVIDIA, 2024](https://github.com/NVIDIA/RULER), and the COLM 2024 paper
- [HELMET, Princeton, 2024](https://arxiv.org/abs/2410.02694), and the 59-model evaluation
- [LongBench v2, 2024](https://longbench2.github.io/)
- [U-NIAH, 2025](https://dl.acm.org/doi/10.1145/3786609) (ACM TOIS)
- [Sequential-NIAH (arxiv 2504.04713)](https://arxiv.org/abs/2504.04713)
- [InfiniteBench, 2024](https://github.com/OpenBMB/InfiniteBench)
- [Nelson F. Liu et al., "Lost in the Middle"](https://arxiv.org/abs/2307.03172), the paper that named the middle-of-context failure mode

## Related topics

- [RAG](../../rag/), the applied problem long-context benchmarks inform
- [Evaluation methodology and metrics](../evaluation-and-methods/), measurement for long-context systems
- [Knowledge and reasoning benchmarks](../knowledge-and-reasoning/), static QA that doesn't require long context
