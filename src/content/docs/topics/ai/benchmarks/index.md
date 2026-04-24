---
title: LLM reasoning benchmarks and metrics
description: A map of the benchmarks people point at when they say "this model is better", what each one measures, how it's been gamed, what's saturated, what's still hard. Eight parts covering knowledge, math, code, agents, long context, multimodal, and evaluation methodology.
category: ai
tags: [benchmarks, evaluation, llm, reasoning, metrics]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## Why benchmarks

Every generation of LLMs arrives with charts. New model X scores N on benchmark Y; therefore, new model X is the best. The trouble is benchmarks measure specific, narrow things. A model can top MMLU-Pro and still be a poor coding agent; a model can ace SWE-bench Verified and still fail at a reasoning task a smart undergrad solves in seconds.

This series is a map of the benchmark landscape in 2026. What each one measures, how close it is to saturation, how it's been gamed, and what a given score does and doesn't tell you.

## The series

1. **[Overview](./)**, this page.
2. **[Knowledge and reasoning](./knowledge-and-reasoning/)**, MMLU, MMLU-Pro, GPQA Diamond, Humanity's Last Exam, ARC-AGI / ARC-AGI-2, HellaSwag, TruthfulQA.
3. **[Math benchmarks](./math-benchmarks/)**, GSM8K, MATH, AIME, FrontierMath, OlympiadBench.
4. **[Coding benchmarks](./coding-benchmarks/)**, HumanEval, MBPP, LiveCodeBench, APPS, CodeContests, SWE-bench and SWE-bench Verified / Pro.
5. **[Agent benchmarks](./agent-benchmarks/)**, Terminal-Bench, TAU-bench, OSWorld, WebArena, GAIA, BrowseComp.
6. **[Long-context benchmarks](./long-context/)**, NIAH, RULER, LongBench, U-NIAH.
7. **[Multimodal benchmarks](./multimodal/)**, MMMU, MathVista, ChartQA, DocVQA.
8. **[Evaluation methodology and metrics](./evaluation-and-methods/)**, LMArena, LLM-as-judge, pass@k, contamination detection, golden sets, preference elicitation.

## How benchmarks go wrong

Four failure modes to have in your head before reading any leaderboard:

### 1. Saturation

When state-of-the-art models consistently score above ~90%, the benchmark stops differentiating. MMLU was saturated by 2023 (85%+ on GPT-4), which is why [MMLU-Pro](./knowledge-and-reasoning/) was created. MMLU-Pro is itself approaching saturation in 2026, Gemini 3 Pro at ~90.1%, Claude Opus 4.5 at ~89.5%.

### 2. Contamination

Benchmarks are released publicly. Their solutions end up in training data. Next-generation models "score higher" partly because they've seen the answers. OpenAI has confirmed training-data leakage on SWE-bench Verified across every frontier model. This is why benchmarks like [LiveCodeBench](./coding-benchmarks/), which draws fresh problems after known training cutoffs, have become the more trusted coding signal.

### 3. Reward hacking

Agents optimize for what's measured. The [RDI Berkeley blog "How We Broke Top AI Agent Benchmarks"](https://rdi.berkeley.edu/blog/trustworthy-benchmarks-cont/) shows how nearly every major agent benchmark can be scored near 100% by an agent that exploits environment bugs, file-system tricks, or success-detection heuristics instead of actually completing the task.

### 4. Contamination-by-proxy

A benchmark might not be in training data verbatim, but *structurally similar* content is. A model trained on every competitive-programming problem from 2015–2023 can "solve" LeetCode-style benchmarks by recognizing the template, not by reasoning.

## What to read a benchmark score as

- **An upper bound on specific capability.** A high MMLU-Pro score doesn't mean the model is smart; it means it can answer multiple-choice questions in the MMLU-Pro format.
- **Evidence of a training regime.** Specific benchmarks respond to specific training investments (RLHF, long-context training, tool-use fine-tuning). High score = investment in that capability.
- **A contamination-sensitive proxy.** Newer benchmarks are usually more trustworthy. Old benchmarks near saturation are essentially training-data memorization tests.
- **Not a user-facing metric.** [LMArena preference scores](./evaluation-and-methods/) track how users feel about models, which can diverge wildly from benchmark performance.

## The frontier benchmarks worth watching in 2026

A shortlist if you're tracking frontier progress:

| Benchmark | What it measures | Saturation state (Apr 2026) |
| --- | --- | --- |
| **Humanity's Last Exam (HLE)** | Expert-level knowledge across PhD-grade subjects | ~35% (far from saturated) |
| **ARC-AGI-2** | Fluid, visual-pattern reasoning | ~85% top; human avg 60% |
| **FrontierMath** | Research-level math problems | Single-digit to mid-teens |
| **SWE-bench Pro / Verified** | Real-world software engineering | ~80–90% top |
| **Terminal-Bench** | Autonomous terminal/sysadmin | ~77% top |
| **LiveCodeBench** | Contamination-resistant coding | Rolling; frontier ~60–70% |
| **GPQA Diamond** | Graduate-level reasoning across STEM | ~92% top (approaching saturation) |
| **MMLU-Pro** | Multi-domain knowledge, harder than MMLU | ~90% top (approaching saturation) |
| **OSWorld / WebArena** | Computer / browser use by agents | Low 30–50% (hard) |

You'll see different numbers on different leaderboards, the details depend on prompt format, tool use, reasoning budget, and whether the model is run in "thinking" mode. Treat all specific numbers as approximate; the ordering matters more than the percentage.

## A note on this series

The benchmark landscape moves fast. What's frontier in April 2026 will be historical by year-end. This series focuses on the *structure* of each benchmark, what it measures, how it's administered, what it's vulnerable to, so you can read future leaderboards intelligently, not memorize current scores.

## References

- [Chatbot Arena, the de facto human-preference leaderboard](https://lmarena.ai/)
- [Artificial Analysis, aggregated benchmark leaderboards](https://artificialanalysis.ai/)
- [HELM (Stanford CRFM), holistic evaluation framework](https://crfm.stanford.edu/helm/)
- [OpenCompass](https://opencompass.org.cn/), comprehensive LLM benchmarking
- [Epoch AI benchmarks](https://epoch.ai/benchmarks), frontier-model tracking
- [lmsys, Chatbot Arena paper](https://arxiv.org/abs/2403.04132)
- [Scale AI, SEAL leaderboards](https://scale.com/leaderboard), private, contamination-resistant
- [RDI Berkeley, how we broke the benchmarks](https://rdi.berkeley.edu/blog/trustworthy-benchmarks-cont/)

## Related topics

- [AI Harness Development](../harness-development/), how benchmarks get wired into agents
- [RAG](../rag/), a separate capability with its own benchmark family
- [AI Coding Tool Blindspots](../coding-tool-blindspots/), what even top-scoring models still miss
