---
title: Coding benchmarks
description: HumanEval, MBPP, LiveCodeBench, APPS, CodeContests, SWE-bench and SWE-bench Verified / Pro. How the coding benchmark family went from "write this function" to "fix this real GitHub issue in a multi-file repo" — and the contamination problems that shape every score.
parent: benchmarks
tags: [coding, swe-bench, humaneval, livecodebench, benchmarks]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## A decade-long arc

Coding benchmarks went through three generations:

1. **2018–2022 — "Write this function."** HumanEval, MBPP. Short docstring → function body. Unit tests verify.
2. **2022–2024 — "Solve this competitive-programming problem."** APPS, CodeContests, LiveCodeBench. Competition tier.
3. **2024+ — "Fix this real issue in this real repo."** SWE-bench, SWE-bench Verified, SWE-bench Pro, Terminal-Bench. Multi-file, tool-using, long-horizon.

Each generation started unsaturated and ended near 90%. Each transition required a new benchmark because the old one stopped differentiating.

## HumanEval

Released with OpenAI's Codex paper, 2021. 164 handwritten Python programming problems with docstring + signature + unit tests. Solve by generating the function body.

**What it measures.** Single-function programming. Basic algorithms, string manipulation, math.

**Saturation.** Fully saturated. GPT-4 hit 90% in 2023; every frontier model passes it now. Still appears as a smoke test. Contaminated — solutions are all over the web.

**Variants.** HumanEval+ (expanded tests), MultiPL-HumanEval (18 languages). Slightly less contaminated but the pattern is the same.

## MBPP — Mostly Basic Python Problems

974 crowd-sourced Python tasks. Similar shape to HumanEval: docstring in, function body out, tests verify.

**Saturation.** Fully saturated (90%+ on frontier models). Same role as HumanEval — smoke test, historical comparison.

## APPS and CodeContests

**APPS** — 10,000 coding problems scraped from Codeforces, LeetCode, open Judge-sites. Three tiers: introductory, interview, competition.

**CodeContests** — 13,610 competitive-programming problems, used to train DeepMind's AlphaCode.

**What they measure.** Competitive programming. Harder than HumanEval; easier than LiveCodeBench.

**Saturation.** APPS introductory is saturated; competition-tier still differentiates. CodeContests is effectively deprecated in favor of LiveCodeBench.

**Contamination.** Very heavy. Every problem has multiple discussed solutions online. Training data almost certainly includes worked solutions for most problems.

## LiveCodeBench

Released 2024 by UC Berkeley / MIT / Cornell. Continuously updated: scrapes fresh problems from LeetCode, AtCoder, and CodeForces **after known training data cutoffs** and reports scores restricted to problems newer than the model's cutoff.

**Why it matters.** Contamination-resistant by construction. If a model's training cutoff is 2024-03 and LiveCodeBench reports scores on problems released 2024-04 onward, you know the solutions can't be memorized.

**What it measures.** Competitive-programming problem solving. Generation tasks (write code from a problem statement).

**Saturation (April 2026).** Top reasoning models in the 60–75% range on post-cutoff problems. Still differentiates cleanly.

**Limitations.** Problems are competition-style — tricky algorithmic puzzles. Doesn't test "build a real feature in a real codebase," which is the actual programming job.

## SWE-bench

Released 2023 by Princeton / UChicago. 2,294 real GitHub issues with paired pull requests from 12 popular Python repos (Django, scikit-learn, flask, requests, etc.). The task: given the issue and the repo at the issue's time, produce a patch that makes the original PR's tests pass.

**What it measures.** End-to-end software engineering. Understanding a codebase, identifying the change, writing a multi-file patch.

**The twist.** Success isn't "my code compiles" — it's "my patch makes the project's test suite pass." Objective and uncheatable by style.

**Saturation.** The full SWE-bench is noisy — many instances have flawed tests or ambiguous specifications. Scores were unstable 2023–2024; OpenAI's analysis (discussed below) showed widespread training-data leakage.

## SWE-bench Verified

2024. OpenAI + Princeton collaborated to manually filter SWE-bench down to 500 reliable instances. Each problem was verified by human engineers to have unambiguous specifications and well-scoped tests.

**Why it matters.** The industry-standard coding-agent benchmark in 2025–2026. Every frontier lab reports against it.

**Saturation (April 2026).** Claude Opus 4.7 ~87.6%, other frontier models 80–90%. Saturation is approaching.

**Contamination concerns.** OpenAI has confirmed that **every frontier model tested** shows training-data leakage on SWE-bench Verified. 59.4% of the *hardest unsolved tasks* had flawed tests — meaning even high scores are partly noise. The benchmark is nearing end-of-life as a trustworthy signal.

## SWE-bench Pro

Released 2025 by Scale AI. Private, contamination-controlled benchmark with a similar shape to SWE-bench Verified but drawing from proprietary repos not in public training data.

**Why it matters.** The anti-contamination successor. Scores are lower (harder + cleaner) and more trustworthy.

**Trade-off.** Private benchmarks mean less community reproducibility. You have to trust Scale's methodology.

## Terminal-Bench

2024. Autonomous terminal-using tasks — install dependencies, configure environments, debug Linux issues, complete multi-step sysadmin work.

**What it measures.** Tool-using agent capability in a real shell environment. Not just "write code" but "operate a computer."

**Saturation (April 2026).** GPT-5.3 Codex at ~77.3%, Claude top models similar. Still differentiates.

**Why it's distinct from SWE-bench.** SWE-bench measures code change. Terminal-Bench measures systems-level ability — running tests, reading logs, installing missing deps. Different failure modes surface.

## CRUXEval and DevOps-focused benchmarks

**CRUXEval** — tests Python code understanding (given function + input, predict output) and generation. Useful diagnostic; less-contaminated than HumanEval for comprehension.

**RepoBench, CodeBLEU variants** — code completion and repository-level metrics. Used for IDE-integration evaluation more than pure capability evaluation.

## Reading a coding leaderboard in 2026

### SWE-bench number in isolation is suspect

Almost every frontier model reports ~85–90% on SWE-bench Verified, and almost every frontier model has training contamination. Without supplementary benchmarks, this number is uninformative.

Better read: look at **SWE-bench Pro** (private data), **LiveCodeBench** (post-cutoff), and **Terminal-Bench** (tool use) together. A model that aces SWE-bench Verified but lags on the other three is overfit to the public benchmark.

### Pass@1 vs best-of-N

Most coding benchmarks report `pass@1` — one attempt per problem. Some report `pass@5` or `pass@10` (success if any of N attempts passes). Best-of-N scores can be 1.5–2× pass@1 on hard problems. Don't compare across.

### Reasoning mode dominance

Claude Sonnet with "extended thinking" vs Claude Sonnet without is an 8–15 point gap on SWE-bench Verified. Reasoning is the modern coding-benchmark cheat code. The comparison that matters: like-for-like reasoning.

### Language coverage

Most coding benchmarks are Python-heavy. A model that scores 90% on Python SWE-bench may be significantly worse on JavaScript, Go, or Rust. MultiPL-E is one cross-language signal; not enough labs report on it.

### Tool affordance

Modern agent benchmarks let the model run tests, write files, open shells. Results vary a lot based on the exact harness. Comparing two models' SWE-bench scores when they used different harnesses is comparing apples to hammers.

## What coding benchmarks don't measure

- **Reading comprehension on a real stakeholder's unclear bug report.** Benchmarks use clean issue descriptions.
- **Architecture decisions.** "Should this be a new service?" — not in any benchmark.
- **Code review and feedback incorporation.** Benchmarks test a single-shot solve.
- **Long-term correctness.** A patch that passes the existing tests can still be wrong in ways caught weeks later.
- **Refactoring without changing behavior.** Benchmarks measure new-feature or bug-fix skill, not maintenance.
- **Working with real team conventions and hidden constraints.** Every codebase has invisible rules; benchmarks don't encode them.

## What to watch in 2026

- **Contamination-controlled benchmarks proliferate.** SWE-bench Pro, LiveCodeBench, private Scale / Vals benchmarks.
- **Agent harness standardization.** Evaluations are converging on common scaffolds (OpenHands, Claude Code as a harness).
- **Cross-language coverage.** New benchmarks in Rust, Go, TypeScript, and Java-heavy stacks.
- **Long-horizon agents.** Benchmarks extending to hours-long tasks, multi-commit changes.

## References

- [HumanEval — Chen et al., 2021 (Codex paper)](https://arxiv.org/abs/2107.03374)
- [MBPP — Austin et al., 2021](https://arxiv.org/abs/2108.07732)
- [APPS — Hendrycks et al., 2021](https://arxiv.org/abs/2105.09938)
- [LiveCodeBench — 2024](https://livecodebench.github.io/) — and the contamination-resistance paper
- [SWE-bench — Jimenez et al., 2023](https://arxiv.org/abs/2310.06770) — and [the SWE-bench website](https://www.swebench.com/)
- [SWE-bench Verified announcement (OpenAI, 2024)](https://openai.com/index/introducing-swe-bench-verified/)
- [SWE-bench Pro (Scale AI)](https://labs.scale.com/leaderboard/swe_bench_pro_public)
- [Terminal-Bench](https://www.tbench.ai/)
- [BenchLM.ai coding leaderboard](https://benchlm.ai/coding) — up-to-date aggregated view
- [Morph — AI Coding Benchmarks Explained](https://www.morphllm.com/ai-coding-benchmarks-2026)

## Related topics

- [Agent benchmarks](../agent-benchmarks/) — the broader category that includes SWE-bench
- [Evaluation methodology and metrics](../evaluation-and-methods/) — pass@k semantics
- [AI Coding Tool Blindspots](../../coding-tool-blindspots/) — what benchmarks still miss
