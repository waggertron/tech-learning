---
title: Benchmark Contamination
description: Why SWE-bench / HumanEval / LiveCodeBench numbers don't match production reliability, and what fresh, uncontaminated evaluations show.
parent: coding-tool-blindspots
tags: [evaluation, benchmarks, reliability]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

Published benchmark numbers are how we compare models, but many benchmarks are leaked into training data. A model that saw the HumanEval problems during training posts inflated scores that don't transfer to real-world work. The gap between benchmark performance and production reliability is large, documented, and widening.

## Key ideas

- **Contamination is the default, not the exception**, HumanEval, MBPP, and parts of SWE-bench appear in public crawl data and GitHub. Training runs that use common datasets inadvertently include them.
- **Inflation is measurable**, Contamination can boost HumanEval scores 10–20 points over a model's true ability. LiveCodeBench and other moving-target benchmarks exist specifically to address this.
- **SWE-bench vs. SWE-bench Pro**, On the harder, fresher SWE-bench Pro, top models score around 23% vs. 70%+ on the original SWE-bench Verified. That gap is a reliability tell.
- **Long-horizon tasks still fall off a cliff**, Even uncontaminated benchmarks mostly test short, well-scoped problems. Multi-hour agentic sessions degrade sharply due to context rot, drift, and sycophancy.
- **Build your own evals**, Production reliability is a function of *your* codebase and *your* workflow. Ship a small, private eval set drawn from real tickets and run it per model upgrade.

## References

- [SWE-bench Pro, Scale AI](https://labs.scale.com/leaderboard/swe_bench_pro_public)
- [LiveCodeBench](https://livecodebench.github.io/)
- [Evaluation and Benchmarking of LLM Agents: A Survey (arXiv 2507.21504)](https://arxiv.org/html/2507.21504v1)
- [Contamination in Benchmark Datasets, BenchLM](https://benchlm.ai/coding)
