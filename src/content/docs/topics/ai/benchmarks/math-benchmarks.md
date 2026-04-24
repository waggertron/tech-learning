---
title: Math benchmarks
description: GSM8K, MATH, AIME, FrontierMath, OlympiadBench. The benchmark family where LLMs went from "embarrassingly bad" in 2021 to beating most competition math in 2025 — and the remaining gap that FrontierMath exposes.
parent: benchmarks
tags: [math, gsm8k, aime, frontiermath, benchmarks]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## Why math benchmarks matter disproportionately

Math is a useful laboratory for reasoning evaluation:

- **Ground truth is cheap to verify.** The answer is "42" or it isn't — no rubric required.
- **Problems scale in difficulty cleanly.** Grade-school → competition → research, in steps anyone can calibrate against.
- **Memorization is visible.** A model that recites an answer without derivation can be spotted by asking variants.
- **Tool use is separable.** Pure LLM vs "LLM with calculator" vs "LLM with Python interpreter" gives three distinct numbers per model.

This is why the math-benchmark family has carried more signal about reasoning progress than the broader knowledge family over the past four years.

## GSM8K — Grade School Math 8K

Released by OpenAI in 2021. 8,500 linguistically diverse grade-school-level word problems requiring multi-step arithmetic. 2–8 elementary-school operations per problem.

**What it measures.** Basic multi-step reasoning. "A train leaves at 3pm at 40mph..." style problems.

**Saturation.** Fully saturated. Frontier models score 95%+ since 2023. Still quoted as a smoke test; not a differentiator.

**Historical significance.** The paper that introduced GSM8K also introduced **Chain-of-Thought prompting**. "Let's think step by step" on GSM8K took GPT-3 from ~18% to ~50%. That finding launched the prompting-as-a-discipline era.

## MATH

The 2021 Hendrycks benchmark. 12,500 problems from high-school math competitions (AMC 10/12, AIME), across 7 subjects (algebra, counting, geometry, intermediate algebra, number theory, prealgebra, precalculus), 5 difficulty levels.

**What it measures.** Competition-level high-school math.

**Saturation (April 2026).** Largely saturated for frontier models. Top models score 95%+ with reasoning mode. Mid-tier models still differentiate in the 70–90% range.

**What makes it cleaner than GSM8K.** Harder (competition math, not word problems), and the difficulty levels give a cleaner picture of where a model breaks.

## AIME — American Invitational Mathematics Examination

Real AIME problems from 2022–2024 serve as benchmarks. AIME is a real high-school competition — 15 problems, 3 hours, answers are integers 0–999.

**Why it's used.** Public problems exist; solutions exist; exact-match scoring is trivial; problems are hard enough to still differentiate top models.

**Saturation (April 2026).** AIME 2024 is largely solved by top reasoning models (100% on many subsets with reasoning compute). AIME 2025 is newer and partially unsolved. The community cycles to the latest year's problems as they're released.

**Contamination risk.** AIME problems are heavily discussed online — training data almost certainly includes worked solutions. The signal is mostly about "can the model match a solution," not "can it derive one." Still useful, but interpret with that caveat.

## FrontierMath

Released in 2024 by Epoch AI. ~300 original, research-level math problems across number theory, algebraic geometry, combinatorics, analysis, and topology. Solutions are kept private to prevent contamination.

**What it measures.** Research-level mathematical reasoning. Problems are designed to take a specialist mathematician hours to days to solve. The formulation is unambiguous and the answer is numerical, but the path is genuinely research-grade.

**Human baseline.** Professional mathematicians in the problem's subfield: substantial but unclear "success rate" — hours per problem.

**Current state (April 2026).** Frontier models score in the **single digits to mid-teens**. This is the most under-saturated serious math benchmark we have.

**Why it's special.** FrontierMath is designed to remain useful for years. Problems are held privately; new problems are added. If a model scores 50% on FrontierMath, something meaningful has changed.

## OlympiadBench

Chinese Academy of Sciences benchmark, 2024. Olympiad-level problems in math and physics, 8,476 problems total. Multimodal (some problems include figures).

**What it measures.** Serious competition-level problem solving. Harder than MATH, easier than FrontierMath.

**Saturation.** Not saturated; frontier models in the 60–80% range. Useful middle-tier benchmark.

## Putnam / IMO problems as ad-hoc benchmarks

Top reasoning results get reported against specific, hard problem sets:

- **Putnam** — undergraduate math competition.
- **IMO (International Math Olympiad)** — the gold standard high-school competition.
- **USAMO** — USA Mathematical Olympiad.

These show up in model release announcements as headline results ("model solved 5/6 IMO problems"). Treat as evidence, not as benchmark scores — the problem count is small and the selection is often cherry-picked.

## Tool-use math benchmarks

Math with a Python interpreter is a different thing than math without. Many benchmarks now report separate scores:

- **Pure reasoning** — model must derive and compute mentally.
- **Code interpreter** — model can write and run Python.
- **Full agent** — model can use arbitrary tools, web search, scratchpads.

A model may score 60% on MATH without tools, 95% with a code interpreter. Both are useful to know for different deployment contexts.

## How to read a math benchmark score

### Check if reasoning mode is on

A model run in "thinking" mode with 30 seconds of test-time compute will score dramatically higher than the same model at one-shot. Anthropic and OpenAI report both; many third-party leaderboards report only one.

### Check which year's AIME

AIME 2022 is heavily contaminated. AIME 2025 is newer. A score on an older contest is less trustworthy.

### Check the `pass@k`

Some leaderboards report `pass@1` (one attempt), others `pass@8` or `pass@64`. Pass@64 can be 2–3× pass@1 on hard problems. Not a like-for-like comparison.

### Check if the solver is deterministic

For problems with numerical answers, a model generating correct-looking but incorrect arithmetic can sometimes stumble onto the right number. Random agreement on AIME problems is ~0.1% per item, but over hundreds of attempts, lucky guesses add up.

## Reasoning-mode math — the story of 2024–2026

The biggest shift in math benchmarks during 2024–2025 was the introduction of **reasoning-mode** models (OpenAI's o1 series, Anthropic's extended thinking, DeepSeek R1, Gemini's Flash Thinking). These use RL training to produce long chain-of-thought generations before final answers.

Effects on math benchmarks:

- **GSM8K, MATH**: small further improvement (ceiling near 100%).
- **AIME**: from ~15% to ~90% on a representative reasoning model on AIME 2024.
- **FrontierMath**: from ~0% to ~4–15% depending on the model.

The reasoning-mode gap on math benchmarks is the single biggest evidence that test-time compute matters. A model half the size with 10× the test-time compute often beats the larger non-reasoning model.

## What math benchmarks don't measure

- **Mathematical intuition and taste.** The ability to guess which approach will work.
- **Creativity.** Problems that require inventing a new technique, not applying a known one.
- **Proof writing.** FrontierMath and similar want numerical answers; real research math often needs readable proofs.
- **Pedagogical ability.** A model that solves math and a model that teaches math are different.

## References

- [GSM8K — Cobbe et al., 2021](https://arxiv.org/abs/2110.14168) — and the chain-of-thought paper that emerged from it
- [MATH — Hendrycks et al., 2021](https://arxiv.org/abs/2103.03874)
- [FrontierMath — Epoch AI, 2024](https://epoch.ai/frontiermath) — the under-saturated benchmark
- [OlympiadBench — 2024](https://github.com/OpenBMB/OlympiadBench)
- [AoPS — Art of Problem Solving](https://artofproblemsolving.com/) — where most of the training-data leakage originates
- [DeepSeek-R1 tech report](https://arxiv.org/abs/2501.12948) — the open reasoning-mode reference
- [OpenAI o1 system card](https://openai.com/index/openai-o1-system-card/)

## Related topics

- [Knowledge and reasoning benchmarks](../knowledge-and-reasoning/) — adjacent category
- [Coding benchmarks](../coding-benchmarks/) — the other "objective ground truth" family
- [Evaluation methodology and metrics](../evaluation-and-methods/) — why pass@k details matter
