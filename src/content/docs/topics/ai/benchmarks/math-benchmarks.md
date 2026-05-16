---
title: Math benchmarks
description: "GSM8K, MATH, AIME, FrontierMath, OlympiadBench. The benchmark family where LLMs went from embarrassingly bad in 2021 to beating most competition math in 2025, and the remaining gap that FrontierMath exposes."
parent: benchmarks
tags: [math, gsm8k, aime, frontiermath, benchmarks]
status: draft
created: 2026-04-24
updated: 2026-05-13
---

## Why math benchmarks matter disproportionately

Math is a useful laboratory for reasoning evaluation:

- **Ground truth is cheap to verify.** The answer is "42" or it isn't, no rubric required.
- **Problems scale in difficulty cleanly.** Grade-school to competition to research, in steps anyone can calibrate against.
- **Memorization is visible.** A model that recites an answer without derivation can be spotted by asking variants.
- **Tool use is separable.** Pure LLM vs "LLM with calculator" vs "LLM with Python interpreter" gives three distinct numbers per model.

This is why the math-benchmark family has carried more signal about reasoning progress than the broader knowledge family over the past four years.

## Why math benchmarks were created

**The verification problem.** Early LLM evaluations relied on human raters or BLEU/ROUGE scores. These don't scale and can't objectively evaluate whether an answer is correct. Math has a property that almost no other domain has: solutions are verifiably correct at low cost. A grade-school arithmetic answer is either 42 or it isn't. This makes math the cleanest laboratory for capability measurement.

**GSM8K (2021): the multi-step failure.** Before GSM8K, models were evaluated on single-step arithmetic (can you multiply these two numbers?). OpenAI researchers observed that GPT-3 failed dramatically on problems requiring even 3-4 sequential reasoning steps, even though it could solve each step individually if shown. GSM8K was created to isolate this multi-step failure. It was also the paper that introduced chain-of-thought prompting as a technique -- the researchers discovered that asking the model to show its work dramatically improved accuracy.

**MATH (2021): the competition gap.** Hendrycks et al. noticed that GSM8K, being grade-school level, was already near-solved by the time they were writing their paper. They needed a harder target. AMC/AIME competition problems were a natural choice: they have known solutions, are organized by difficulty, and represent a level of mathematical sophistication clearly beyond what any 2021 model could do. When MATH was released, best models scored ~6-8%. That number has climbed to ~98%, making MATH the clearest example of the benchmark lifecycle.

**AIME: community adoption of existing content.** AIME wasn't designed as an AI benchmark. It's been running since 1983. AI researchers adopted it because the problems are well-posed, solutions exist, answers are integers (easy to check), and new problems appear every year (reducing contamination over time). The community uses whichever year's problems are newest to minimize contamination.

**FrontierMath (2024): the "98% means nothing" problem.** When o4-mini scored ~98% on MATH in 2025, Epoch AI faced a credibility problem: their math benchmark was saturated. FrontierMath was designed with three explicit anti-saturation properties: (1) problems are original and not derived from public competition sets, (2) solutions are kept private, (3) problems require genuine research-level mathematical sophistication. The 98% MATH vs. ~15% FrontierMath gap is the clearest demonstration of why benchmark design matters.

## GSM8K, Grade School Math 8K

Released by OpenAI in 2021. 8,500 linguistically diverse grade-school-level word problems requiring multi-step arithmetic. 2-8 elementary-school operations per problem.

**What it measures.** Basic multi-step reasoning. "A train leaves at 3pm at 40mph..." style problems.

### Concrete example

> Janet's ducks lay 16 eggs per day. She eats 3 for breakfast every morning and bakes muffins for her friends with 4. She sells the remainder at the farmers' market for $2 per egg. How much does she make every day?

Working: 16 - 3 - 4 = 9 eggs remaining. 9 x $2 = **$18 per day**.

This is representative of the hardest GSM8K problems: no tricks, just careful tracking of quantities across steps.

### Additional examples

**Example 2 (Multi-step tracking):**

> A bakery makes 3 batches of cookies per day. Each batch uses 2.5 cups of flour. The bakery has a 50-cup bag of flour. After 6 days of operation, how many cups of flour are left?

Working: 3 batches/day x 2.5 cups/batch = 7.5 cups/day. 6 days x 7.5 cups/day = 45 cups used. 50 - 45 = **5 cups remaining**.

**Example 3 (Chained variant, demonstrates error propagation):**

> Step 1: Marcus earns $18/hour. He works 35 hours per week. How much does he earn per week?
> Step 2: Marcus saves 30% of his weekly earnings. How much does he save per week?
> Step 3: After 8 weeks, Marcus buys a laptop for $1,200. How much does he have left from his savings?

Working: Step 1: 18 x 35 = $630/week. Step 2: 630 x 0.30 = $189/week savings. Step 3: 189 x 8 = $1,512 saved total. $1,512 - $1,200 = **$312 remaining**.

This three-step variant is the kind used to stress-test arithmetic tracking. A model that gets step 1 wrong carries the error through all subsequent steps. On chained GSM8K variants of this length, frontier models that score 99% on individual problems can drop to 85-90% accuracy, revealing fragile intermediate-value tracking.

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

**Example 2 (Level 3, Algebra):**

> If x + 1/x = 3, what is x³ + 1/x³?

Working: Square both sides of x + 1/x = 3: x² + 2 + 1/x² = 9, so x² + 1/x² = 7. Multiply (x + 1/x)(x² + 1/x²) = x³ + x/x² + x²/x + 1/x³ = x³ + 1/x³ + (x + 1/x). So x³ + 1/x³ = (x + 1/x)(x² + 1/x²) - (x + 1/x) = 3 x 7 - 3 = **18**.

This is a Level 3 problem. The correct approach (using the identity to avoid solving for x directly) is not immediately obvious. A model that tries to solve for x using the quadratic formula will get a messier path.

**Example 3 (Level 4, Counting and Probability):**

> How many 5-digit positive integers have digits that sum to exactly 10, with no leading zeros?

This requires careful counting. Set up variables d₁d₂d₃d₄d₅ where d₁ is in {1,...,9} and d₂,...,d₅ are in {0,...,9}, with d₁+...+d₅ = 10. Substitute e₁ = d₁ - 1 to get e₁ in {0,...,8} and e₁+d₂+...+d₅ = 9. Count solutions using stars-and-bars with upper bound constraints. The exact answer requires inclusion-exclusion on the upper bound constraints. This is a Level 4 problem where the setup (substitution, stars-and-bars with constraints) is the non-obvious step.

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

**AIME Example 2 (2023-style):**

> Find the largest integer n such that n² divides 15! (15 factorial).

Working: By Legendre's formula, find the largest prime power dividing 15!. For each prime p <= 15, compute the exponent in 15!: 2: floor(15/2)+floor(15/4)+floor(15/8) = 7+3+1 = 11. 3: 5+1 = 6. 5: 3. 7: 2. 11: 1. 13: 1. For n² to divide 15!, each prime exponent in n must be at most half the corresponding exponent in 15!: 2⁵ x 3³ x 5¹ x 7¹ = 32 x 27 x 5 x 7 = **30,240**.

**AIME Example 3 (Combinatorics):**

> A committee of 5 is to be chosen from 6 men and 4 women such that the committee has at least 2 women. How many ways can this be done?

Working: Cases: exactly 2 women (C(4,2) x C(6,3) = 6 x 20 = 120), exactly 3 women (C(4,3) x C(6,2) = 4 x 15 = 60), exactly 4 women (C(4,4) x C(6,1) = 1 x 6 = 6). Total: 120+60+6 = **186**.

Note: This is lighter than a typical AIME problem (AIME answers are integers 0-999). Real AIME problems require the same structured enumeration but at harder combinatorics. Models fail here when they miss cases or miscount the complement.

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

### What a FrontierMath problem looks like (illustrative, not an actual problem)

> Let f : Z->Z be multiplicative (f(mn) = f(m)f(n) for gcd(m,n)=1). Suppose f(p) = p+2 for all primes p and f(p²) = p² - 1 for all primes p. Compute f(1800).

Working: 1800 = 2³ x 3² x 5². Since f is multiplicative: f(1800) = f(8) x f(9) x f(25). f(4) = f(2²) = 4-1 = 3. f(8) = f(4x2) = f(4)f(2) = 3x4 = 12. f(9) = f(3²) = 9-1 = 8. f(25) = f(5²) = 25-1 = 24. So f(1800) = 12 x 8 x 24 = **2,304**.

This is at the easier end of FrontierMath. Real problems require significantly more machinery (algebraic geometry, analytic number theory, derived categories) and take professional mathematicians hours to days. The example illustrates the style: precise setup, multiple concepts applied in sequence, numerical final answer.

## OlympiadBench

Chinese Academy of Sciences benchmark, 2024. Olympiad-level problems in math and physics, 8,476 problems total. Multimodal (some problems include figures).

**What it measures.** Serious competition-level problem solving. Harder than MATH, easier than FrontierMath.

**Score range.** Frontier models score in the **60-80% range**, making this a useful middle-tier differentiator. Models that look equivalent on MATH often separate here, and models that separate here look equivalent on FrontierMath.

**Saturation.** Not saturated. Worth tracking as MATH continues to lose signal.

## Putnam / IMO problems as ad-hoc benchmarks

Top reasoning results get reported against specific, hard problem sets:

- **Putnam**: undergraduate math competition.
- **IMO (International Math Olympiad)**: the gold standard high-school competition.
- **USAMO**: USA Mathematical Olympiad.

These show up in model release announcements as headline results ("model solved 5/6 IMO problems"). Treat as evidence, not as benchmark scores: the problem count is small and the selection is often cherry-picked.

## Tool-use math benchmarks

Math with a Python interpreter is a different thing than math without. Many benchmarks now report separate scores:

- **Pure reasoning:** model must derive and compute mentally.
- **Code interpreter:** model can write and run Python.
- **Full agent:** model can use arbitrary tools, web search, scratchpads.

A model may score 60% on MATH without tools, 95% with a code interpreter. Both are useful to know for different deployment contexts. GPT-5 Pro with Python tools reaching ~100% on AIME illustrates how dramatically tool access can close gaps.

## Math benchmark frontier performance: 2021 to 2026

```
                         GSM8K   MATH   AIME-24  FrontierMath
2021 best models:          ~8%    6-8%     N/A       N/A
2022 GPT-3+CoT:           ~48%   ~18%     N/A       N/A
2023 GPT-4:               ~92%   ~60%    ~15%       ~0%
2024 o1:                  ~97%   ~90%    ~55%      ~4-7%
2025 o3/Gemini2.5:        ~99%   ~96%    ~88%     ~10-15%
2026 frontier:            ~99%   ~98%   ~95-100%   ~15-25%
Human (AIME qualifier):    N/A    N/A    ~40%        N/A
Human (PhD mathematician): N/A    N/A     N/A       ~90%
```

Benchmarks go from hard to saturated in roughly 3 years. FrontierMath is the one that hasn't.

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

### Reasoning mode delta

| Benchmark | Non-reasoning score | Reasoning score | Gap |
|---|---|---|---|
| GSM8K | ~95% | ~99% | ~4 pts |
| MATH | ~60-70% | ~95-98% | ~30 pts |
| AIME 2024 | ~15-25% | ~85-95% | ~65 pts |
| FrontierMath | ~0-2% | ~10-20% | ~15 pts |

The gap on AIME is the most dramatic. A model that seemed to have "solved" GSM8K (already near ceiling) gets a small boost from reasoning mode. AIME and FrontierMath, where multi-step extended reasoning is the whole game, see 3-10x improvement.

## How model architectures advanced on math

**Scale alone (GPT-3, 2020): 8% on GSM8K.** GPT-3 with standard few-shot prompting scored ~8% on GSM8K. The failure mode was consistent: the model would correctly identify the relevant quantities but lose track of intermediate values across steps, substituting plausible-sounding numbers instead of computed ones.

**Chain-of-thought prompting (2022): the first big jump.** Wei et al. (2022) showed that appending "Let's think step by step" to a prompt, or providing few-shot examples with explicit intermediate steps, took GPT-3 from ~18% to ~50% on GSM8K with no model changes. This was a prompt-engineering discovery that revealed the model had the arithmetic capability but needed a scaffolded format to express it. The chain-of-thought paper is one of the most cited ML papers of the decade.

**Instruction fine-tuning and RLHF (2022-2023).** InstructGPT and GPT-4 added RLHF. On math, RLHF's contribution was reliability: the models stopped more reliably producing intermediate steps in the right format and were less likely to abandon the chain of thought mid-problem. GPT-4 reached ~92% on GSM8K and ~60-70% on MATH.

**Code interpreter integration (2023-2024).** Giving a model access to a Python interpreter changed the math landscape completely. A model that can write and execute Python doesn't need to track arithmetic mentally. GSM8K with a code interpreter: ~100%. MATH with a code interpreter: ~95%. This revealed that "doing math" and "reasoning about math" are different skills. Benchmarks without tool access measure the latter.

**Reasoning models: RL on outcome verification (2024-2025).** OpenAI o1, DeepSeek R1, and Anthropic's extended thinking trained models with reinforcement learning where the reward signal is correctness of the final answer (verifiable via a math checker), not human preference. The model learns to explore multiple solution approaches, detect dead ends, and backtrack -- the same behaviors that make human mathematicians effective. AIME 2024 went from ~25% (GPT-4) to ~95% (o3). FrontierMath went from ~0% to ~15%. The remaining gap on FrontierMath is now primarily a knowledge gap (models don't have sufficient exposure to research-level mathematics in training) rather than a reasoning gap.

**The process reward model.** A parallel development: instead of rewarding only final-answer correctness, train a "process reward model" (PRM) that evaluates the quality of each intermediate step. Models trained with PRM guidance produce more reliable step-by-step derivations and are less likely to "shortcut" through implausible intermediate steps. Significant improvement on MATH and AIME, smaller improvement on FrontierMath.

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
