---
title: Coding benchmarks
description: "HumanEval, MBPP, LiveCodeBench, APPS, CodeContests, SWE-bench and SWE-bench Verified / Pro. How the coding benchmark family went from write this function to fix this real GitHub issue in a multi-file repo, and the contamination problems that shape every score."
parent: benchmarks
tags: [coding, swe-bench, humaneval, livecodebench, benchmarks]
status: draft
created: 2026-04-24
updated: 2026-05-04
---

## A decade-long arc

Coding benchmarks went through three generations:

1. **2018-2022, "Write this function."** HumanEval, MBPP. Short docstring to function body. Unit tests verify.
2. **2022-2024, "Solve this competitive-programming problem."** APPS, CodeContests, LiveCodeBench. Competition tier.
3. **2024+, "Fix this real issue in this real repo."** SWE-bench, SWE-bench Verified, SWE-bench Pro, Terminal-Bench. Multi-file, tool-using, long-horizon.

Each generation started unsaturated and ended near 90%. Each transition required a new benchmark because the old one stopped differentiating.

## HumanEval

Released with OpenAI's Codex paper, 2021. 164 handwritten Python programming problems with docstring + signature + unit tests. Solve by generating the function body.

**What it measures.** Single-function programming. Basic algorithms, string manipulation, math.

### Canonical example problem

The very first problem in the dataset:

```python
from typing import List

def has_close_elements(numbers: List[float], threshold: float) -> bool:
    """ Check if in given list of numbers, are any two numbers closer to each
    other than given threshold.
    >>> has_close_elements([1.0, 2.0, 3.0], 0.5)
    False
    >>> has_close_elements([1.0, 2.8, 3.0, 4.0, 5.0, 2.0], 0.3)
    True
    """
```

The model must fill in the body. The original Codex (2021) solved roughly 28% of the 164 problems with a single attempt. That was the state of the art at the time.

### Score progression

| Model / Era | pass@1 (HumanEval) |
|---|---|
| Original Codex, 2021 | ~28% |
| GPT-3.5-turbo, 2022-2023 | 48-65% |
| GPT-4, 2023 | 67-87% |
| GPT-4o, 2024 | ~90.2% |
| Claude 3.5 Sonnet, 2024 | ~93.7% |
| o3-mini / frontier models, early 2025 | 95%+ |

**Saturation.** Fully saturated. GPT-4 hit 90% in 2023; every frontier model passes it now. Still appears as a smoke test. Contaminated: solutions are all over the web.

**HumanEval+ caveat.** The EvalPlus team expanded each of the 164 problems to roughly 80x more test cases. Models that score 90%+ on the original often drop 5-10 points on HumanEval+ because edge cases their generated code misses are now covered. The original 164 tests are too weak to discriminate quality.

**Variants.** HumanEval+ (expanded tests), MultiPL-HumanEval (18 languages). Slightly less contaminated but the pattern is the same.

## MBPP, Mostly Basic Python Problems

974 crowd-sourced Python tasks. Similar shape to HumanEval: docstring in, function body out, tests verify.

**Saturation.** Fully saturated (90%+ on frontier models). Same role as HumanEval: smoke test, historical comparison.

## APPS and CodeContests

**APPS**, 10,000 coding problems scraped from Codeforces, LeetCode, and open judge-sites. Three tiers: introductory, interview, competition.

**CodeContests**, 13,610 competitive-programming problems, used to train DeepMind's AlphaCode.

**What they measure.** Competitive programming. Harder than HumanEval; easier than LiveCodeBench.

**Saturation.** APPS introductory is saturated; competition-tier still differentiates. CodeContests is effectively deprecated in favor of LiveCodeBench.

**Contamination.** Very heavy. Every problem has multiple discussed solutions online. Training data almost certainly includes worked solutions for most problems.

## LiveCodeBench

Released 2024 by UC Berkeley / MIT / Cornell. Continuously updated: scrapes fresh problems from LeetCode, AtCoder, and Codeforces **after known training data cutoffs** and reports scores restricted to problems newer than the model's cutoff.

**Why it matters.** Contamination-resistant by construction. If a model's training cutoff is 2024-03 and LiveCodeBench reports scores on problems released 2024-04 onward, you know the solutions can't be memorized.

### Concrete example problem (paraphrased)

A representative medium-hard problem from the platform:

> Given an array of integers, find the maximum length subsequence such that no two adjacent elements differ by more than K. Return the length.

This is not a famous LeetCode problem with a well-known solution: it was posted after most models' training cutoffs, so performance reflects actual reasoning ability rather than recall.

### The four evaluation scenarios

LiveCodeBench tests more than just code generation:

1. **Code generation.** Given a problem statement, write a solution from scratch.
2. **Self-repair.** The model's first attempt failed; given the error output, fix it.
3. **Test output prediction.** Given a function and an input, predict what the function returns (comprehension, not generation).
4. **Code execution simulation.** Given a program trace, determine the final state.

Most leaderboards report only scenario 1. Scenarios 2-4 expose different failure modes and are worth checking separately.

### Score progression

| Model / Era | LiveCodeBench pass@1 (post-cutoff problems) |
|---|---|
| GPT-4-turbo, 2024 launch | ~35-40% |
| Claude 3 Opus, 2024 | ~35-40% |
| GPT-4o / Claude 3.5 Sonnet, mid-2024 | ~50-60% |
| DeepSeek V3 / Gemini 2.5 Pro, early 2025 | ~65-75% |
| Gemini 3 Pro / GPT-5, 2025-2026 | ~85-92% |

**Saturation (April 2026).** Top reasoning models are in the 60-75% range on post-cutoff problems. Still differentiates cleanly.

**Difficulty spread caveat.** The platform bundles LeetCode mediums alongside Codeforces Div 1 problems in the same score. A model optimized for the easier end can post a deceptively high aggregate number. When comparing models, look at per-difficulty breakdowns if available.

## SWE-bench

Released 2023 by Princeton / UChicago. 2,294 real GitHub issues with paired pull requests from 12 popular Python repos (Django, scikit-learn, flask, requests, etc.). The task: given the issue and the repo at the issue's time, produce a patch that makes the original PR's tests pass.

**What it measures.** End-to-end software engineering. Understanding a codebase, identifying the change, writing a multi-file patch.

**The twist.** Success isn't "my code compiles"; it's "my patch makes the project's test suite pass." Objective and uncheatable by style.

**Saturation.** The full SWE-bench is noisy; many instances have flawed tests or ambiguous specifications. Scores were unstable 2023-2024; OpenAI's analysis showed widespread training-data leakage.

## SWE-bench Verified

2024. OpenAI + Princeton collaborated to manually filter SWE-bench down to 500 reliable instances. Each problem was verified by human engineers to have unambiguous specifications and well-scoped tests.

**Why it matters.** The industry-standard coding-agent benchmark in 2025-2026. Every frontier lab reports against it.

### Concrete task example

A representative instance from the benchmark:

> **Repository:** `requests` (Kenneth Reitz / PyPA)
> **Issue:** "Session cookies not preserved on redirect."
> **Setup:** The model receives the full repository source at the time of the issue, the GitHub issue text, and shell access to run the test suite.
> **Goal:** Produce a unified diff that (a) fixes the described behavior, (b) passes the regression tests added by the original PR, and (c) does not break any previously passing tests.

This requires reading multiple files (session handling, redirect logic, cookie jar), understanding how they interact, forming a hypothesis about the root cause, and writing a surgical fix. No single-function stub fills this gap.

### Score progression

| Model + harness configuration | SWE-bench Verified resolve rate |
|---|---|
| GPT-4, 2024, no scaffold | ~2-4% |
| Claude 3.5 Sonnet, 2024, no scaffold | ~13% |
| Claude 3.5 Sonnet + scaffolding, Jan 2025 | ~49% |
| o1 + scaffolding | ~64.6% |
| Claude 3.7 Sonnet + scaffolding | ~62-70% |
| Gemini 3 Pro + Live-SWE-agent, Nov 2025 | ~77% |
| Claude Opus 4.6, 2025-2026 | ~80.8% |

**The scaffold lesson.** The jump from 13% to 49% for Claude 3.5 Sonnet is almost entirely scaffolding, not a model update. Scaffold design (how the agent searches the codebase, how it runs tests, how it decides when to stop) matters as much as raw model capability. Most state-of-the-art numbers use complex multi-agent harnesses, not bare API calls.

**Saturation (April 2026).** Top configurations are in the 80-90% range. Saturation is approaching.

**Contamination concerns.** OpenAI confirmed that every frontier model tested shows training-data leakage on SWE-bench Verified. 59.4% of the hardest unsolved tasks had flawed tests, meaning even high scores carry noise. The benchmark is nearing end-of-life as a trustworthy signal.

## SWE-bench Pro

Released 2025 by Scale AI. Private, contamination-controlled benchmark with a similar shape to SWE-bench Verified but drawing from proprietary repos not in public training data.

**Why it matters.** The anti-contamination successor. Scores are lower (harder + cleaner) and more trustworthy.

**Trade-off.** Private benchmarks mean less community reproducibility. You have to trust Scale's methodology.

## Terminal-Bench

2024. Autonomous terminal-using tasks: install dependencies, configure environments, debug Linux issues, complete multi-step sysadmin work.

**What it measures.** Tool-using agent capability in a real shell environment. Not just "write code" but "operate a computer."

### Concrete task example

> Install a Python package that has a build error in its `setup.py`. Identify the cause from the error log, apply a patch to fix it, and verify the installation succeeds. You have access only to shell commands (no GUI, no pre-loaded IDE context).

The model must read compiler output, trace it back to a specific line in `setup.py`, decide on a fix (perhaps a missing system dependency or a version pin), apply it, and confirm the package imports correctly. No code generation scaffold is provided.

**Score (April 2026).** GPT-5.3 Codex reached ~77.3% on Terminal-Bench. Claude top models are in a similar range. Still differentiates.

**Why it's distinct from SWE-bench.** SWE-bench measures code change. Terminal-Bench measures systems-level ability: running tests, reading logs, installing missing deps, navigating the filesystem. Different failure modes surface. A model can score high on SWE-bench while struggling with environment setup tasks.

## CRUXEval and DevOps-focused benchmarks

**CRUXEval**, tests Python code understanding (given function + input, predict output) and generation. Useful diagnostic; less contaminated than HumanEval for comprehension.

**RepoBench, CodeBLEU variants**, code completion and repository-level metrics. Used for IDE-integration evaluation more than pure capability evaluation.

## Score comparison at a glance

This table uses representative ranges: "random baseline" is trivial guessing, "GPT-4 class 2023" is the frontier at the time each benchmark was prominent, and "frontier 2025-2026" is the current top reported score.

| Benchmark | Random baseline | GPT-4 class, 2023 | Frontier, 2025-2026 |
|---|---|---|---|
| HumanEval | ~0% | ~67-87% | ~95%+ (saturated) |
| MBPP | ~0% | ~80-85% | ~90%+ (saturated) |
| LiveCodeBench (post-cutoff) | ~0% | ~35-40% | ~85-92% |
| SWE-bench Verified (best scaffold) | ~0% | ~2-4% | ~80-87% |
| SWE-bench Pro | ~0% | not available | ~40-55% (estimated) |
| Terminal-Bench | ~0% | not reported | ~77% |

Key observations from the table:

- HumanEval and MBPP are fully saturated: they no longer separate top models.
- LiveCodeBench is still informative because post-cutoff problems block memorization.
- SWE-bench Verified scores look high but contamination noise inflates them; SWE-bench Pro scores are lower and cleaner.
- Terminal-Bench covers a distinct skill (systems operation) that the others miss entirely.

## Reading a coding leaderboard in 2026

### SWE-bench number in isolation is suspect

Almost every frontier model reports ~85-90% on SWE-bench Verified, and almost every frontier model has training contamination. Without supplementary benchmarks, this number is uninformative.

Better read: look at **SWE-bench Pro** (private data), **LiveCodeBench** (post-cutoff), and **Terminal-Bench** (tool use) together. A model that aces SWE-bench Verified but lags on the other three is overfit to the public benchmark.

### Pass@1 vs best-of-N

Most coding benchmarks report `pass@1`, one attempt per problem. Some report `pass@5` or `pass@10` (success if any of N attempts passes). Best-of-N scores can be 1.5-2x pass@1 on hard problems. Don't compare across.

### Reasoning mode dominance

Claude Sonnet with "extended thinking" vs Claude Sonnet without is an 8-15 point gap on SWE-bench Verified. Reasoning is the modern coding-benchmark cheat code. The comparison that matters: like-for-like reasoning mode.

### Language coverage

Most coding benchmarks are Python-heavy. A model that scores 90% on Python SWE-bench may be significantly worse on JavaScript, Go, or Rust. MultiPL-E is one cross-language signal; not enough labs report on it.

### Tool affordance

Modern agent benchmarks let the model run tests, write files, open shells. Results vary a lot based on the exact harness. Comparing two models' SWE-bench scores when they used different harnesses is comparing apples to hammers.

## What coding benchmarks don't measure

- **Reading comprehension on a real stakeholder's unclear bug report.** Benchmarks use clean issue descriptions.
- **Architecture decisions.** "Should this be a new service?" is not in any benchmark.
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

- [HumanEval, Chen et al., 2021 (Codex paper)](https://arxiv.org/abs/2107.03374)
- [MBPP, Austin et al., 2021](https://arxiv.org/abs/2108.07732)
- [APPS, Hendrycks et al., 2021](https://arxiv.org/abs/2105.09938)
- [LiveCodeBench, 2024](https://livecodebench.github.io/), and the contamination-resistance paper
- [SWE-bench, Jimenez et al., 2023](https://arxiv.org/abs/2310.06770), and [the SWE-bench website](https://www.swebench.com/)
- [SWE-bench Verified announcement (OpenAI, 2024)](https://openai.com/index/introducing-swe-bench-verified/)
- [SWE-bench Pro (Scale AI)](https://labs.scale.com/leaderboard/swe_bench_pro_public)
- [Terminal-Bench](https://www.tbench.ai/)
- [BenchLM.ai coding leaderboard](https://benchlm.ai/coding), up-to-date aggregated view
- [Morph, AI Coding Benchmarks Explained](https://www.morphllm.com/ai-coding-benchmarks-2026)

## Related topics

- [Agent benchmarks](../agent-benchmarks/), the broader category that includes SWE-bench
- [Evaluation methodology and metrics](../evaluation-and-methods/), pass@k semantics
- [AI Coding Tool Blindspots](../../coding-tool-blindspots/), what benchmarks still miss
