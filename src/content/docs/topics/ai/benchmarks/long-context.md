---
title: Long-context benchmarks
description: Needle in a Haystack (NIAH), RULER, LongBench, U-NIAH. The benchmark family that exposed the gap between "the model's context window says 2 million tokens" and "the model actually uses that context."
parent: benchmarks
tags: [long-context, niah, ruler, longbench, benchmarks]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What these benchmarks test

A model's advertised context length (say, 1 million tokens) is one thing. Whether the model can actually **find**, **remember**, and **use** information buried deep in that context is a different question, and the gap is often enormous.

Long-context benchmarks test the latter. They're the reason "2M context window" claims need an asterisk.

## NIAH, Needle in a Haystack

The foundational long-context benchmark, Greg Kamradt's 2023 test. Take a long document ("haystack"), insert a small, specific fact ("needle"), ask the model a question whose answer requires that fact.

Example:

- Haystack: a 500K-token chunk of Paul Graham essays.
- Needle: "The best thing to do in San Francisco is eat a sandwich and sit in Dolores Park on a sunny day."
- Question: "What is the best thing to do in San Francisco?"

Measured by whether the model produces the needle. Repeated across context lengths and needle positions, a heatmap is the standard visualization.

**Why it went viral.** It's conceptually simple, easy to implement, and produces a compelling visual: models with "1M token context" sometimes have glaring blind spots at specific positions.

**Saturation (April 2026).** Fully saturated for frontier models. Every 100K+ context model scores ~100% on NIAH. The benchmark is no longer useful for differentiation.

## RULER

NVIDIA, 2024. The response to NIAH's saturation. RULER ("What's the Real Context size?") extends NIAH with 13 synthetic tasks across four categories:

- **Retrieval**, single / multi-key / multi-value needles, multi-hop retrieval.
- **Multi-hop tracing**, entity chains, variable tracking across positions.
- **Aggregation**, "how many times does word X appear?"
- **Question answering**, non-synthetic QA with long documents.

**Why it matters.** "Can you find a needle" is trivial; "can you reason across multiple needles" is not. RULER exposes that:

- Most models that pass NIAH at 128K context fail RULER around 32–64K.
- **Effective context length** (where RULER score drops below 85%) is often 1/4 to 1/8 of the advertised context.

**Results.** Advertised 128K models often have effective RULER context of 16–32K. Advertised 1M models: maybe 128–256K.

## LongBench and LongBench v2

Tsinghua, 2023 / 2024. Multi-domain long-context benchmark covering single- and multi-document QA, summarization, few-shot learning, synthetic tasks, code completion.

**What it adds over NIAH/RULER.** Real-world document distributions. Research papers, code repositories, long dialogues, legal documents. Not just synthetic haystacks.

**LongBench v2.** Extends to code repositories, structured data, long dialogues, and tasks requiring "deep reasoning and awareness" over context.

**Current state.** Top models score 50–70% depending on task mix. Clean signal; hard to saturate.

## U-NIAH

Unified NIAH framework (2025). Extends beyond traditional NIAH with:

- **Multi-needle**, multiple facts inserted; model must retrieve all.
- **Long-needle**, the needle itself is long, requiring the model to track a multi-sentence fact.
- **Needle-in-needle**, nested context where relevant facts contain their own references.
- **Distractor needles**, plausible-but-wrong facts inserted alongside the real one.

Integrates with RAG evaluation, the same framework scores retrieval-augmented setups.

## Sequential-NIAH

2025. Evaluates extraction of *sequential* information, a list of facts in order, not a single needle. Exposes a common failure mode: models find the first and last needles but miss middle ones.

## Infinite Bench / ∞Bench

Academic benchmark for extreme long-context (100K to 1M+ token inputs). Tasks include novel summarization, long-document QA, code understanding across a full repo.

**Current state.** Frontier models in the 40–60% range on the hardest subtasks. Still differentiates.

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

Reasoning models do better on RULER than non-reasoning variants at the same context, but the "effective context" gap remains, just shifted upward a bit.

## How to evaluate for your use case

Generic long-context benchmarks are a coarse signal. For a specific deployment:

- **Identify your real retrieval pattern.** A RAG system pulling 10 chunks of 500 tokens each is very different from a system summarizing a 500K document.
- **Build a small custom NIAH.** Put your real documents in, insert facts, measure.
- **Measure distractor tolerance.** Include chunks that look relevant but aren't.
- **Test both retrieval and reasoning.** "Find X" and "reason over X" are different failure modes.

## What long-context benchmarks don't measure

- **Latency / cost.** Long contexts cost real dollars per call.
- **Streaming.** Models optimized for long context may handle streamed input worse.
- **Prompt caching efficiency.** Not all models benefit equally from prompt caching on long contexts.
- **KV-cache memory pressure.** At deploy time, long context = GPU memory blown up. Benchmarks don't model this.

## References

- [NIAH, Greg Kamradt's repo](https://github.com/gkamradt/LLMTest_NeedleInAHaystack)
- [RULER, NVIDIA, 2024](https://github.com/NVIDIA/RULER), and the COLM 2024 paper
- [LongBench v2, 2024](https://longbench2.github.io/)
- [U-NIAH, 2025](https://dl.acm.org/doi/10.1145/3786609) (ACM TOIS)
- [Sequential-NIAH (arxiv 2504.04713)](https://arxiv.org/abs/2504.04713)
- [∞Bench, 2024](https://github.com/OpenBMB/InfiniteBench)
- [Nelson F. Liu et al., *Lost in the Middle*](https://arxiv.org/abs/2307.03172), the paper that named the middle-of-context failure mode

## Related topics

- [RAG](../../rag/), the applied problem long-context benchmarks inform
- [Evaluation methodology and metrics](../evaluation-and-methods/), measurement for long-context systems
- [Knowledge and reasoning benchmarks](../knowledge-and-reasoning/), static QA that doesn't require long context
