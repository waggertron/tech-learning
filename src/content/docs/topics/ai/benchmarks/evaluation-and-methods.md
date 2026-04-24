---
title: Evaluation methodology and metrics
description: LMArena, LLM-as-judge, pass@k, pass^k, exact match, BLEU, ROUGE, contamination detection, golden sets. The scaffolding around every benchmark, what the numbers actually mean and how to tell good evaluation from performance theater.
parent: benchmarks
tags: [evaluation, metrics, lmarena, llm-as-judge, benchmarks]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## Two worlds of evaluation

Every LLM evaluation sits somewhere on a spectrum:

- **Objective**, the answer is "42" or the code compiles or the test passes. Easy to score, hard to bias.
- **Subjective**, "is this response helpful?" "Is this summary accurate?" Fuzzy, valuable, hard to scale.

Math and code benchmarks live on the objective end. Instruction-following, creative writing, and conversational helpfulness live on the subjective end. Different metrics, different pitfalls.

## The metrics, objective side

### Accuracy / exact match

Did the model produce the right answer? Used for multi-choice, numerical, and exact-string benchmarks (MMLU, MATH, GSM8K).

Pitfalls:

- Answer format matters. "42" vs "42.0" vs "the answer is 42", some graders count those as different.
- Whitespace, punctuation, trailing text all affect exact-match graders.
- Robust benchmarks use regex / answer extractors; brittle ones just compare strings.

### Pass@k

For code generation: generate `k` candidate solutions, count the problem as passed if any candidate passes the tests.

- **pass@1**, generate once, does it pass? The standard for production-relevant scoring.
- **pass@k** (k > 1), generate `k` times, any pass counts. Favors models with high diversity / randomness.

Some papers report `pass@k` computed from unbiased samples (Codex paper's formulation). Others just generate `k` and report any-match. Both are called "pass@k"; they're different numbers.

### Pass^k

Distinct from `pass@k`. `pass^k` is the probability that a model passes the same task on **every** attempt across `k` runs, a reliability measure. Introduced for agent benchmarks where flakiness matters.

If a model has `pass@1 = 70%` and `pass^4 = 30%`, it solves most tasks sometimes but few tasks consistently. Production systems care about `pass^k`.

### F1, precision, recall

For classification / extraction tasks (NER, QA with multiple valid answers):

- **Precision**, of what the model produced, how much was right?
- **Recall**, of what was supposed to be produced, how much did the model find?
- **F1**, harmonic mean.

Heavy in IR and information-extraction benchmarks; rare in headline LLM evaluation.

### BLEU and ROUGE

Translation and summarization metrics based on n-gram overlap:

- **BLEU**, weighted precision of 1–4-grams of the candidate against reference translations.
- **ROUGE**, recall-oriented variant (ROUGE-1, ROUGE-2, ROUGE-L).

Well-understood in MT / summarization. **Largely obsolete for evaluating LLMs.** Modern paraphrasing models get low BLEU even when the output is better than the reference. Still used for historical comparison.

### Perplexity

The exponential of cross-entropy loss. A language-modeling metric, lower perplexity = better next-token prediction.

Useful for training dynamics; not for comparing deployed LLMs. A model tuned for perplexity won't necessarily be better on downstream tasks.

## The metrics, subjective side

### Human preference (pairwise)

Show human raters two outputs from two models. They pick the better one. Aggregate into win rates or Elo ratings.

- **LMArena (formerly Chatbot Arena)**, the most-watched human-preference leaderboard. Real users submit prompts, rate pairwise responses anonymously.
- **Arena-Hard**, harder prompts curated from LMArena, evaluated by LLM-as-judge instead of humans.
- **MT-Bench**, 80 multi-turn questions, scored by GPT-4-as-judge.

Pairwise comparisons are robust to scale differences ("is this a 7 or an 8?"). They're noisier per sample but aggregate well.

### LLM-as-judge

Use a strong model (GPT-4-class) to grade outputs. The [Zheng et al. 2023 paper](https://arxiv.org/abs/2306.05685) showed GPT-4 agreement with human preference on MT-Bench and Chatbot Arena is ~80%, roughly the same as human-human agreement.

Three patterns:

- **Single-output scoring, no reference**, "rate this on 1–10." Noisy.
- **Single-output scoring, with reference**, "compare to this reference, score 1–10." Less noisy.
- **Pairwise comparison**, "which is better, A or B?" Most robust.

Well-known biases of LLM judges:

- **Position bias**, first response favored. Mitigation: average A-then-B with B-then-A.
- **Verbosity bias**, longer responses favored even when not better.
- **Self-preference**, a model tends to prefer its own outputs. Use a third-party judge.
- **Consistency**, same judge, same prompt can produce different ratings. Average multiple runs.

### Elo ratings (LMArena)

LMArena maintains Elo ratings from millions of crowd-sourced pairwise votes:

- Each model has a rating; wins update ratings proportionally.
- Bradley-Terry model is applied over the vote history.
- Rating differences translate to win probability.

Elo is useful because it aggregates preference data over a huge sample of prompts, not cherry-picked categories. Downsides: vulnerable to self-selection bias (the set of prompts users submit isn't representative of production traffic), and can be gamed by high-velocity voters if anti-abuse isn't strong.

### Human golden-set eval

For a production team: a fixed set of 50–500 internal prompts, human-graded, re-run against every new model candidate. The single most reliable evaluation method in deployed contexts. Expensive; highly trustworthy.

## Contamination detection

A benchmark is "contaminated" if solutions or close paraphrases appear in the model's training data. Detection methods:

### N-gram overlap

Search for exact n-gram matches between benchmark items and training data. Crude but catches blatant cases.

### Membership inference

Statistical tests for whether a specific example was in training. Works by comparing the model's confidence on exact vs paraphrased items.

### Separate held-out subsets

Release 80% of a benchmark publicly, keep 20% private. Compare public-subset scores to private-subset scores. A 10+ point gap suggests contamination on the public part.

### Date-filtered evaluation

LiveCodeBench's approach: only score on problems released **after** the model's known training cutoff.

### Canary strings

Deliberate unique strings inserted into benchmark questions. If a model regurgitates them, it memorized rather than solved.

## Contamination in practice

The April 2026 landscape:

- **HumanEval, MBPP, GSM8K, MATH, ARC, MMLU**, heavily contaminated. Scores reflect memorization as much as capability.
- **MMLU-Pro, SWE-bench Verified**, partially contaminated. OpenAI confirmed every frontier model leaks on SWE-bench Verified.
- **LiveCodeBench, HLE, FrontierMath, Scale SEAL, SWE-bench Pro**, designed to resist contamination. The most trustworthy scores.
- **Private enterprise eval suites**, trustworthy by construction; not reproducible.

Rule of thumb: the newer the benchmark, the more trustworthy the score.

## The "benchmark war" pattern

Every generation of LLMs follows a cycle:

1. A new benchmark is introduced, models score 10–30%.
2. Models improve; frontier scores reach 60–80%.
3. Contamination creeps in; scores rise rapidly.
4. The benchmark is saturated or discredited.
5. A new, harder benchmark is introduced.

MMLU (2020) → GPT-4 (2023) → MMLU-Pro (2024) → frontier models (2025) → HLE (2025) → the next thing (2026+).

Seen this way, benchmark scores are more useful as *year-over-year deltas on the same benchmark* than as point-in-time measures.

## Evaluating your production system

For deploying a specific model:

1. **Build a golden set**, 50–500 examples representative of your traffic, hand-labeled for correctness.
2. **Automate where you can**, exact match, regex matching, unit tests for code outputs.
3. **LLM-as-judge for the rest**, with multiple seeds, pair-wise, and a judge you trust.
4. **Log preferences**, thumbs up / down in production. Aggregate.
5. **A/B test live**, small-percentage rollouts comparing models on real traffic.

Your internal eval will correlate imperfectly with public benchmarks. That's expected, your traffic isn't the benchmark. Trust your internal data over the public scores.

## Common evaluation mistakes

- **One benchmark = one capability.** A high GPQA score isn't the same as "smart." Look at a basket.
- **Comparing scores across methodologies.** Scale AI's SEAL and Hugging Face's leaderboard aren't comparable.
- **Single-run scoring.** LLM outputs are stochastic. Average over 3–5 runs.
- **Ignoring confidence intervals.** A 74% vs 76% gap on 500 examples is within noise.
- **Over-indexing on headline benchmarks.** Benchmarks the labs report are the ones labs optimize for. Look at ones they don't.
- **LLM-as-judge with self-preference.** GPT-4 judging GPT-4 favorably is an artifact, not a signal. Use a third-party judge or human.
- **Skipping held-out eval on your own tasks.** Every team has specific needs; public benchmarks won't tell you how the model handles your weird domain.
- **Evaluating once, deploying forever.** Model capabilities shift with provider updates. Re-evaluate on every version bump.

## References

- [Zheng et al., 2023, *Judging LLM-as-a-Judge*](https://arxiv.org/abs/2306.05685)
- [Chatbot Arena paper, 2024](https://arxiv.org/abs/2403.04132)
- [LMArena leaderboard](https://lmarena.ai/)
- [HELM, Stanford CRFM](https://crfm.stanford.edu/helm/), holistic evaluation framework
- [Codex paper, pass@k definition](https://arxiv.org/abs/2107.03374)
- [Shi et al., *Detecting Pretraining Data from Large Language Models*](https://arxiv.org/abs/2310.16789), contamination detection
- [LiveCodeBench methodology](https://livecodebench.github.io/)
- [Evidently AI, LLM-as-Judge guide](https://www.evidentlyai.com/llm-guide/llm-as-a-judge), practical walkthrough
- [Vals AI](https://www.vals.ai/), contamination-controlled leaderboards

## Related topics

- [Knowledge and reasoning benchmarks](../knowledge-and-reasoning/), the benchmarks whose scores this post explains how to read
- [Agent benchmarks](../agent-benchmarks/), where pass^k and reliability metrics matter most
- [AI Harness Development](../../harness-development/), how evaluation hooks into deployed systems
