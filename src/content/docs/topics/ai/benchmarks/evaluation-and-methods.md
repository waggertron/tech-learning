---
title: Evaluation methodology and metrics
description: LMArena, LLM-as-judge, pass@k, pass^k, exact match, BLEU, ROUGE, contamination detection, golden sets. The scaffolding around every benchmark, what the numbers actually mean and how to tell good evaluation from performance theater.
parent: benchmarks
tags: [evaluation, metrics, lmarena, llm-as-judge, benchmarks]
status: draft
created: 2026-04-24
updated: 2026-05-13
---

## Two worlds of evaluation

Every LLM evaluation sits somewhere on a spectrum:

- **Objective**, the answer is "42" or the code compiles or the test passes. Easy to score, hard to bias.
- **Subjective**, "is this response helpful?" "Is this summary accurate?" Fuzzy, valuable, hard to scale.

Math and code benchmarks live on the objective end. Instruction-following, creative writing, and conversational helpfulness live on the subjective end. Different metrics, different pitfalls.

## Why evaluation methodology matters

In 2023, several major LLM releases claimed state-of-the-art results on the same benchmarks within weeks of each other. Some claims were valid. Some were artifacts of prompt format choice, reasoning mode, or cherry-picked subsets. Methodology is what separates a reproducible claim from a press release.

The four biggest sources of claimed-vs-actual score discrepancy:

1. **Prompt format sensitivity.** MMLU-Pro scores can swing 5-10 points based on whether you use few-shot examples, whether you prompt "choose the best answer" vs. "think step by step," and whether you include the answer choices in the prompt or separately. Two papers reporting different MMLU-Pro scores for the same model are often measuring the same model with different prompts.

2. **Reasoning mode undisclosed.** A model with reasoning mode enabled can score 20-40 points higher on hard benchmarks than the same model without it. Papers released in 2024 often did not clearly distinguish. Check the model card: was "extended thinking" on?

3. **Pass@k vs. pass@1 conflation.** "The model solved 90% of AIME 2024" can mean pass@1 (one shot, 90% success rate) or majority vote over 64 samples (much easier). A press release will say "solved"; the appendix will say "majority@64."

4. **Contamination undisclosed.** A model trained after a benchmark was published that doesn't report contamination analysis is providing a score that is partially a memorization test. Recent practice: LiveCodeBench-style date filtering is the gold standard; n-gram overlap analysis is a minimum bar.

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

### Worked example: why pass@k matters on AIME

A reasoning model attempts AIME 2024 Problem 1 ten times (k=10). Results:

| Attempt | Correct? | Answer given |
|---|---|---|
| 1 | No | 45 |
| 2 | Yes | 56 |
| 3 | No | 48 |
| 4 | Yes | 56 |
| 5 | No | 62 |
| 6 | Yes | 56 |
| 7 | No | 51 |
| 8 | No | 45 |
| 9 | Yes | 56 |
| 10 | No | 38 |

pass@1: 40% (4 of 10 attempts are correct, so any single random attempt has a 40% chance of being right).
pass@10: 100% (at least one correct among 10 attempts).
Majority vote: 56 (correct, wins with 4 votes).

A lab that reports "solved AIME 2024" using majority vote over 10 samples is reporting a fundamentally different capability than one that reports pass@1. The correct answer (56) only appears 4 out of 10 times. In a deployment where you get one attempt, the model fails 60% of the time on this problem. The distinction matters enormously for real-world use.

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

- **Position bias**: first response favored. Mitigation: average A-then-B with B-then-A.
- **Verbosity bias**: longer responses favored even when not better.
- **Self-preference**: a model tends to prefer its own outputs. Use a third-party judge.
- **Consistency**: same judge, same prompt can produce different ratings. Average multiple runs.

**Position bias, demonstrated:**

A judge is given two responses to the question "Explain gradient descent." Response A is 200 words and uses a clear analogy. Response B is 150 words and is technically accurate but dry. When presented as (A first, B second): A wins 70% of the time. When presented as (B first, A second): B wins 52% of the time. The same content gets different verdicts based on order. The fix: run both orderings and average, discarding cases where the judge contradicts itself.

**Verbosity bias, demonstrated:**

Two responses to the same coding question. Response A: 50 lines with the correct solution and a clear explanation. Response B: 120 lines with the same solution, three alternative approaches, and notes on edge cases. LLM judges without explicit length-penalization instructions prefer Response B 65% of the time even when human engineers prefer Response A for being more concise and useful.

The fix: explicit instruction in the judge prompt ("prefer concise, accurate responses over verbose ones") and length normalization.

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

### Contamination case study: MMLU and the 2023 GPT-4 release

When GPT-4 was released in March 2023, it scored 86.4% on MMLU. Three findings from subsequent analysis:

1. An n-gram search found exact matches between MMLU questions and text in Common Crawl (a primary training-data source) for approximately 9% of the test set.

2. For the contaminated 9%, GPT-4's accuracy was ~93%. For the clean 91%, accuracy was ~85.5%. The contaminated subset inflated the headline score by roughly 0.7 percentage points.

3. When the same analysis was applied to other frontier models from the same era, all showed similar contamination effects. No frontier model's MMLU score can be taken as purely a generalization signal.

The takeaway: a 1-2 point difference on MMLU between two models from the same era is almost certainly within contamination noise. A 5+ point difference is probably real. At the frontier in 2026, where models cluster in the 89-92% range, MMLU is essentially uninformative.

## The "benchmark war" pattern

Every generation of LLMs follows a cycle:

1. A new benchmark is introduced, models score 10–30%.
2. Models improve; frontier scores reach 60–80%.
3. Contamination creeps in; scores rise rapidly.
4. The benchmark is saturated or discredited.
5. A new, harder benchmark is introduced.

MMLU (2020) → GPT-4 (2023) → MMLU-Pro (2024) → frontier models (2025) → HLE (2025) → the next thing (2026+).

Seen this way, benchmark scores are more useful as *year-over-year deltas on the same benchmark* than as point-in-time measures.

```
The benchmark lifecycle: a repeating pattern
=============================================

Score
100% |      [saturation zone]........
 90% |                         ......***
 80% |                    *****
 70% |               *****
 60% |          -----
 50% |     *****
 40% | ----
 30% |                                         [new benchmark introduced]
 20% |
 10% |                                              ***
     +----+----+----+----+----+----+----+----+----+----
     Y0   Y1   Y2   Y3  Y4   Y5  Y6   Y7   Y8   Y9

*** = model performance     .... = contamination noise     ---- = guessing

Examples:
- MMLU (2020) saturated by GPT-4 (2023): 3 years
- GSM8K (2021) saturated by 2023: 2 years
- HumanEval (2021) saturated by 2024: 3 years
- FrontierMath (2024): still unsaturated in 2026
```

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

## How the metrics have evolved with model capabilities

**2018-2020: exact match dominated.** GLUE and SuperGLUE used accuracy on classification tasks. A model that picked the right class got full credit. This worked because outputs were constrained to a small set of labels.

**2021-2022: pass@k entered for code.** The Codex paper introduced pass@k specifically because code generation requires multiple attempts. A model that produces the right algorithm 30% of the time is useful even if it fails 70% of the time, since you can run 5 candidates and take the best. pass@k formalized this. It also introduced the ambiguity (pass@1 vs. pass@k) that plagues coding leaderboards to this day.

**2023: LLM-as-judge emerged.** GPT-4 quality made LLM judges viable. The MT-Bench paper showed GPT-4 agreement with human raters was ~80%, the same as human-to-human agreement. This unlocked evaluation of open-ended outputs (explanations, summaries, multi-turn conversations) that couldn't be scored with exact match. The tradeoff: LLM judges introduce model-specific biases (verbosity preference, self-preference) that contaminate rankings.

**2024: reliability metrics mattered.** As agents became deployable, pass^k (success on every attempt across k runs) became the right metric for production. A 70% pass@1 agent that scores 30% on pass^4 is a demo, not a product. TAU-bench made pass^k a first-class metric.

**2025-2026: compute-conditioned scores.** Reasoning models made "score" a function of thinking budget, not just model weights. The field is developing new reporting norms: score at thinking budget B1, score at B2, score at "unlimited." A model scored at budget B1 is not comparable to the same model at B10. Evaluation methodology is still catching up to this reality.

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
