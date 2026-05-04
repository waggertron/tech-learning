---
title: Math benchmarks
description: "GSM8K, MATH, AIME, FrontierMath, OlympiadBench. The benchmark family where LLMs went from embarrassingly bad in 2021 to beating most competition math in 2025, and the remaining gap that FrontierMath exposes."
parent: benchmarks
tags: [math, gsm8k, aime, frontiermath, benchmarks]
status: draft
created: 2026-04-24
updated: 2026-05-04
---

## Why math benchmarks matter disproportionately

Math is a useful laboratory for reasoning evaluation:

- **Ground truth is cheap to verify.** The answer is "42" or it isn't, no rubric required.
- **Problems scale in difficulty cleanly.** Grade-school to competition to research, in steps anyone can calibrate against.
- **Memorization is visible.** A model that recites an answer without derivation can be spotted by asking variants.
- **Tool use is separable.** Pure LLM vs "LLM with calculator" vs "LLM with Python interpreter" gives three distinct numbers per model.

This is why the math-benchmark family has carried more signal about reasoning progress than the broader knowledge family over the past four years.

## GSM8K, Grade School Math 8K

Released by OpenAI in 2021. 8,500 linguistically diverse grade-school-level word problems requiring multi-step arithmetic. 2-8 elementary-school operations per problem.

**What it measures.** Basic multi-step reasoning. "A train leaves at 3pm at 40mph..." style problems.

### Concrete example

> Janet's ducks lay 16 eggs per day. She eats 3 for breakfast every morning and bakes muffins for her friends with 4. She sells the remainder at the farmers' market for $2 per egg. How much does she make every day?

Working: 16 - 3 - 4 = 9 eggs remaining. 9 x $2 = **$18 per day**.

This is representative of the hardest GSM8K problems: no tricks, just careful tracking of quantities across steps.

### Score progression

| Model / era | GSM8K accuracy |
|---|---|
| GPT-3 (2020, few-shot) | ~8% |
| GPT-3 + chain-of-thought (2022) | ~48-50% |
| GPT-3.5-turbo (2022-2023) | 57-74% |
| GPT-4 (2023) | ~92% |
| Current frontier models (2025) | 97-99%+ |

**Saturation.** Fully saturated. Frontier models score 95%+ since 2023. Still quoted as a smoke test, not a differentiator.

### Historical significance

The paper that introduced GSM8K also introduced **Chain-of-Thought prompting**. "Let's think step by step" on GSM8K took GPT-3 from ~18% to ~50%. That finding launched the prompting-as-a-discipline era.

### The chained-variant stress test

One revealing variant: chain multiple GSM8K-style problems so that one problem's answer feeds the next as a given. A model scoring 98% on individual problems can fail substantially on these chained sequences because errors propagate. A wrong intermediate answer poisons every subsequent step. This reveals fragile arithmetic tracking that individual-problem scores conceal.

## MATH

The 2021 Hendrycks benchmark. 12,500 problems from high-school math competitions (AMC 10/12, AIME), across 7 subjects (algebra, counting, geometry, intermediate algebra, number theory, prealgebra, precalculus), at 5 difficulty levels.

**What it measures.** Competition-level high-school math.

### Difficulty levels

| Level | Description | Representative problem type |
|---|---|---|
| 1 | Easy, single-step | Simple arithmetic, basic algebra |
| 2 | Two or three steps | Linear equations, basic factoring |
| 3 | Multi-step, standard competition | Quadratics, basic number theory |
| 4 | Harder competition problems | Combinatorics with cases, polynomial analysis |
| 5 | AMC/AIME-level | Problems requiring insight, not just procedure |

Level 5 is hard for models for the same reason it is hard for human competitors: the correct approach is not obvious from the problem statement, a wrong initial framing costs the entire problem, and the algebra or number theory involved assumes competition-math intuition accumulated over years.

### Concrete example (Level 5, number theory)

> Let P(x) = x^3 + ax + b where a, b are integers. Suppose P(1) is congruent to 0 (mod 5) and P(2) is congruent to 0 (mod 5). Find the remainder when P(3) is divided by 5.

This requires recognizing that P(1) = 1 + a + b and P(2) = 8 + 2a + b are both divisible by 5, subtracting to get a + 7 is divisible by 5, and substituting back to pin b, then computing P(3) mod 5. The algebra is modest, but the correct framing (use the system of congruences, don't try to solve for a and b directly) is the insight that separates level 5 from level 3.

### Score progression

| Model / era | MATH accuracy |
|---|---|
| Best models at launch (2021) | 6-8% |
| GPT-4 (2023) | 52-70% |
| GPT-4 with chain-of-thought (2023) | 69-80% |
| o1 / Claude 3.7 / Gemini 2.5 Pro (early 2025) | 90-94% |
| o4-mini (2025) | ~98.2% |

**Saturation (April 2026).** Largely saturated for frontier models. Top models score 95%+ with reasoning mode. Mid-tier models still differentiate in the 70-90% range.

**What makes it cleaner than GSM8K.** Harder (competition math, not word problems), and the difficulty levels give a cleaner picture of where a model breaks.

## AIME, American Invitational Mathematics Examination

Real AIME problems from 2022-2025 serve as benchmarks. AIME is a real high-school competition: 15 problems, 3 hours, answers are integers 0-999.

**Why it's used.** Public problems exist; solutions exist; exact-match scoring is trivial; problems are hard enough to still differentiate top models.

### Context: who takes AIME?

AIME qualifiers represent approximately the top 5% of AMC 10/12 participants, which is already a self-selected population of math-oriented students. Each problem is designed to take human competitors 10-30 minutes of focused work. Getting 10 or more correct (out of 15) places a student in USAMO contention.

### Concrete example

> Find the number of positive integers n <= 1000 such that floor(sqrt(n)) divides n.

**Answer: 89.**

The approach: let k = floor(sqrt(n)), so k^2 <= n < (k+1)^2. For k | n, count multiples of k in [k^2, (k+1)^2 - 1]. This requires careful case analysis over each value of k from 1 to 31 (since floor(sqrt(1000)) = 31), plus handling the boundary at k=31 where the upper range is truncated at 1000. A clean solution takes 15-20 minutes for a prepared human competitor.

### Score comparison (AIME 2024 vs AIME 2025)

| Solver | AIME 2024 | AIME 2025 |
|---|---|---|
| Median human AIME qualifier | 4-6/15 (27-40%) | 4-6/15 (27-40%) |
| Top human (USAMO-level) | 10+/15 (67%+) | 10+/15 (67%+) |
| GPT-4 (2023, no tools) | ~2-3/15 (13-20%) | ~2-3/15 (13-20%) |
| o3-mini / Gemini 2.5 Pro (early 2025) | ~80-87% | ~83-87% |
| o3 | ~96.7% | ~88.9% |
| GPT-5 | ~94-95% | ~94-95% |
| GPT-5 Pro with Python tools | ~100% | ~100% |

**Saturation (April 2026).** AIME 2024 is largely solved by top reasoning models. AIME 2025 is newer; top models approach ceiling but haven't universally hit it. The community cycles to the latest year's problems as they're released.

**Contamination risk.** AIME problems are heavily discussed online; training data almost certainly includes worked solutions. The signal is mostly about "can the model match a solution," not "can it derive one." Still useful, but interpret with that caveat.

### pass@1 vs majority vote

Labs report both, and the numbers differ dramatically on AIME. A model might score 55% pass@1 (single attempt) but 85% with majority vote across 32 samples. "Solved AIME" in a press release often means majority-vote, not single-attempt. For deployment contexts where you get one shot, pass@1 is the operative number.

## FrontierMath

Released in 2024 by Epoch AI. Approximately 300 original, research-level math problems across number theory, algebraic geometry, combinatorics, analysis, and topology. Solutions are kept private to prevent contamination.

**What it measures.** Research-level mathematical reasoning. Problems are designed to take a specialist mathematician hours to days. The formulation is unambiguous and the answer is numerical, but the path is genuinely research-grade.

### What research-level math problems look like

FrontierMath problems span areas like:

- **Algebraic geometry:** questions requiring knowledge of derived categories, coherent sheaves, or intersection theory, where the setup takes a paragraph of notation and the computation requires applying theorems most PhD programs cover only in a second-year course
- **Analytic number theory:** explicit computations with L-functions, requiring knowledge of functional equations, Euler products, and the interplay between zeros and prime distribution
- **Combinatorics:** problems where no standard formula applies and solving requires inventing a new counting argument or encoding the problem as a bijection that isn't obvious

In each case, a professional mathematician working in the problem's subfield needs hours to days. The problems aren't designed to be impossibly hard; they're designed to require genuine mathematical sophistication that cannot be retrieved from worked examples.

### Score comparison: FrontierMath vs MATH-500

| Benchmark | Frontier model score (2025) |
|---|---|
| MATH-500 (a curated 500-problem subset of MATH) | ~98% |
| FrontierMath | ~4-15% (depending on model and run) |

This gap is the most direct evidence that "98% on MATH" does not mean "solved math." It means solved a specific class of well-posed competition problems with known solution strategies. FrontierMath exposes what lies beyond that class.

**Current state (April 2026).** Frontier models score in the single digits to mid-teens. This is the most under-saturated serious math benchmark available.

**Why it's special.** FrontierMath is designed to remain useful for years. Problems are held privately; new problems are added. If a model scores 50% on FrontierMath, something meaningful has changed in machine mathematical reasoning.

## OlympiadBench

Chinese Academy of Sciences benchmark, 2024. Olympiad-level problems in math and physics, 8,476 problems total. Multimodal (some problems include figures).

**What it measures.** Serious competition-level problem solving. Harder than MATH, easier than FrontierMath.

**Score range.** Frontier models score in the **60-80% range**, making this a useful middle-tier differentiator. Models that look equivalent on MATH often separate here, and models that separate here look equivalent on FrontierMath.

**Saturation.** Not saturated. Worth tracking as MATH continues to lose signal.

## Putnam / IMO problems as ad-hoc benchmarks

Top reasoning results get reported against specific, hard problem sets:

- **Putnam**, undergraduate math competition.
- **IMO (International Math Olympiad)**, the gold standard high-school competition.
- **USAMO**, USA Mathematical Olympiad.

These show up in model release announcements as headline results ("model solved 5/6 IMO problems"). Treat as evidence, not as benchmark scores: the problem count is small and the selection is often cherry-picked.

## Tool-use math benchmarks

Math with a Python interpreter is a different thing than math without. Many benchmarks now report separate scores:

- **Pure reasoning:** model must derive and compute mentally.
- **Code interpreter:** model can write and run Python.
- **Full agent:** model can use arbitrary tools, web search, scratchpads.

A model may score 60% on MATH without tools, 95% with a code interpreter. Both are useful to know for different deployment contexts. GPT-5 Pro with Python tools reaching ~100% on AIME illustrates how dramatically tool access can close gaps.

## How to read a math benchmark score

### Check if reasoning mode is on

A model run in "thinking" mode with 30 seconds of test-time compute will score dramatically higher than the same model at one-shot. Anthropic and OpenAI report both; many third-party leaderboards report only one.

### Check which year's AIME

AIME 2022 is heavily contaminated. AIME 2025 is newer. A score on an older contest is less trustworthy.

### Check the pass@k

Some leaderboards report pass@1 (one attempt), others pass@8 or pass@64. Pass@64 can be 2-3x pass@1 on hard problems. Not a like-for-like comparison. For AIME specifically, the difference between pass@1 and majority vote is large enough to change the headline story.

### Check if the solver is deterministic

For problems with numerical answers, a model generating correct-looking but incorrect arithmetic can sometimes stumble onto the right number. Random agreement on AIME problems is ~0.1% per item, but over hundreds of attempts, lucky guesses add up.

## Reasoning-mode math: the story of 2024-2026

The biggest shift in math benchmarks during 2024-2025 was the introduction of **reasoning-mode** models (OpenAI's o1 series, Anthropic's extended thinking, DeepSeek R1, Gemini's Flash Thinking). These use RL training to produce long chain-of-thought generations before final answers.

Effects on math benchmarks:

- **GSM8K, MATH:** small further improvement (ceiling near 100%).
- **AIME:** from ~15% to ~90%+ on a representative reasoning model on AIME 2024.
- **FrontierMath:** from ~0% to ~4-15% depending on the model.

The reasoning-mode gap on math benchmarks is the single biggest evidence that test-time compute matters. A model half the size with 10x the test-time compute often beats the larger non-reasoning model.

## What math benchmarks don't measure

- **Mathematical intuition and taste.** The ability to guess which approach will work.
- **Creativity.** Problems that require inventing a new technique, not applying a known one.
- **Proof writing.** FrontierMath and similar want numerical answers; real research math often needs readable proofs.
- **Pedagogical ability.** A model that solves math and a model that teaches math are different.

## References

- [GSM8K, Cobbe et al., 2021](https://arxiv.org/abs/2110.14168), and the chain-of-thought paper that emerged from it
- [MATH, Hendrycks et al., 2021](https://arxiv.org/abs/2103.03874)
- [FrontierMath, Epoch AI, 2024](https://epoch.ai/frontiermath), the under-saturated benchmark
- [OlympiadBench, 2024](https://github.com/OpenBMB/OlympiadBench)
- [AoPS, Art of Problem Solving](https://artofproblemsolving.com/), where most of the training-data leakage originates
- [DeepSeek-R1 tech report](https://arxiv.org/abs/2501.12948), the open reasoning-mode reference
- [OpenAI o1 system card](https://openai.com/index/openai-o1-system-card/)

## Related topics

- [Knowledge and reasoning benchmarks](../knowledge-and-reasoning/), adjacent category
- [Coding benchmarks](../coding-benchmarks/), the other "objective ground truth" family
- [Evaluation methodology and metrics](../evaluation-and-methods/), why pass@k details matter
