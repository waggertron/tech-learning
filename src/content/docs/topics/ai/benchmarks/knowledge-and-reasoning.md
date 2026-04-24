---
title: Knowledge and reasoning benchmarks
description: MMLU, MMLU-Pro, GPQA Diamond, Humanity's Last Exam, ARC-AGI / ARC-AGI-2, HellaSwag, TruthfulQA. The benchmark family that tries to answer "how smart is this model?" and how each one is gamed, saturated, or actually informative.
parent: benchmarks
tags: [mmlu, gpqa, hle, arc-agi, benchmarks]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## The category in one paragraph

Knowledge-and-reasoning benchmarks present a model with questions — often multiple choice, sometimes free-form — and score how many it gets right. They dominate the headline charts because a single number ("model scored 85% on MMLU") is easy to quote. The shape-of-the-chart sells the story; the shape-of-the-chart also hides most of the interesting nuance.

## MMLU — Massive Multitask Language Understanding

The 2020 benchmark that defined the category. 57 subjects (elementary math through professional law), 15,908 multiple-choice questions, 4 options each.

**What it measures.** Broad knowledge at exam-like level, with a slight tilt toward factual recall.

**Saturation.** Saturated. GPT-4 hit 86% in 2023; every frontier model since passes it. Still quoted for historical comparisons and as a cheap smoke test.

**Gotchas.** Some questions are ambiguous or have contested answers. Models sometimes score higher than humans by being comfortable with ambiguity (guessing well) — not a virtue you want to measure.

## MMLU-Pro

The 2024 replacement. Same domains, **10 answer options instead of 4**, harder filtering toward graduate-level reasoning, 12,032 questions.

**What it measures.** Harder knowledge and reasoning. A 50% score on MMLU-Pro is roughly equivalent to 80% on original MMLU.

**Saturation (April 2026).** Approaching. Gemini 3 Pro at ~90.1%, Claude Opus 4.5 with reasoning at ~89.5%, DeepSeek-V3.2 at ~85% per aggregated leaderboards.

**Why it's still useful.** In the 60–85% range, MMLU-Pro still cleanly separates mid-tier models. At the top it's losing discriminatory power; expect a "MMLU-Pro 2" or a successor within 18 months.

## GPQA Diamond

"Graduate-level Google-Proof Q&A" — 448 multiple-choice questions across physics, chemistry, and biology, all at PhD level. "Diamond" is the hardest 198-question subset; most headline scores quote Diamond.

**What it measures.** Deep, subject-specific reasoning. Designed to be unanswerable by non-experts even *with* web access.

**Human baseline.** PhDs in the exam subject: **65%**. Skilled non-experts with web access: **34%**.

**Saturation (April 2026).** Approaching the ceiling. GPT-5.4 at ~92%, Gemini 3.1 Pro Preview at ~94.1%, GPT-5.3 Codex at ~91.5%. When models consistently beat expert humans, the benchmark stops telling you what you want to know.

**Why it matters historically.** GPQA Diamond was the first benchmark where "reasoning mode" dramatically changed scores — models without test-time compute scored ~40%, models *with* reasoning jumped to 80%+. It became the standard reasoning-mode benchmark in 2024.

## Humanity's Last Exam (HLE)

Released late 2024 / early 2025. 2,500+ expert-submitted questions across dozens of specialized domains. The hardest exam-style benchmark currently public.

**What it measures.** Cross-domain expert-level reasoning, far past GPQA's scope.

**Current state (April 2026).** Frontier models score ~**35%** — nowhere near saturation. Human domain experts average **~90%** on problems in their own subjects.

**Why it matters.** HLE is the benchmark designed to stay unsaturated. It will likely be the primary "has the frontier moved?" signal for the next few years. Watch for:

- First frontier model to hit 50%.
- First model to hit 75%.
- "HLE-Pro" when the current benchmark gets too close.

## ARC-AGI and ARC-AGI-2

François Chollet's 2019 benchmark, now in its second version. Visual grid puzzles: a model sees 3–5 input/output grid pairs, must produce the correct output for a sixth input grid.

**What it measures.** Fluid intelligence — novel pattern recognition and abstraction from tiny example sets. Deliberately designed to be impossible to solve by memorization or pattern-matching on training data.

**Human baseline.** Average humans solve ~60% of ARC-AGI-2 without training. Any 10-year-old solves most of them.

**Current state (April 2026).** Pure language models score near 0% on ARC-AGI-2 without heavy test-time compute. With search and reasoning compute, frontier systems have reached **85% (GPT-5.5)**, **83.3% (GPT-5.4 Pro)**, **77.1% (Gemini 3.1 Pro)**. The original ARC-AGI has been solved; ARC-AGI-2 is the live challenge.

**The ARC Prize.** A $1M+ prize fund encouraging solutions that score high with *limited compute*. The 2025 prize year revealed that scaling brute-force search gets you answers, but efficient generalization is still missing.

**Why it matters.** ARC-AGI-2 is the clearest signal that current LLMs have a real gap versus general intelligence. A benchmark where the solution is trivial for a bright child and hard for a frontier model is unusually informative.

## Older benchmarks still in circulation

### HellaSwag

Commonsense reasoning. Given a scenario, pick the most plausible continuation from 4 options. Saturated (~95% top) by 2022. Still appears in release notes for historical comparison; not a useful differentiator now.

### TruthfulQA

Measures whether models parrot common misconceptions. 817 questions designed to elicit "confident and wrong" answers. Interesting diagnostic — high scores mean the model resists plausible-but-wrong continuations. RLHF dramatically improved TruthfulQA scores in 2023; differentiation is weaker now.

### ARC (original, not ARC-AGI)

The AI2 "Grade school science challenge." 7,787 questions. Mostly saturated. Not related to ARC-AGI except by name.

### Big-Bench Hard (BBH)

A 23-task subset of BIG-Bench where frontier models struggled. Useful 2022–2024; mostly saturated by 2025.

### PIQA, WinoGrande, OpenBookQA

Various reasoning-tinged QA. Historical context; saturated.

## What to watch for when reading a leaderboard

### Reasoning vs non-reasoning scores

A model in "reasoning mode" (with explicit chain-of-thought or test-time search) scores dramatically higher than the same model "thinking fast." GPQA Diamond, ARC-AGI-2, and FrontierMath all show 20–40 point gaps.

Always check: is this the thinking or non-thinking score? A 92% GPQA Diamond at "extended thinking" isn't comparable to an 82% at one-shot.

### Pass@1 vs best-of-N

A "80% on SWE-bench" from one attempt is different from "80% passed if we let the model try 10 times and picked the best." Best-of-N scores are much easier to game.

### Prompt format sensitivity

MMLU-Pro scores can swing 5–10 points based on prompt format, few-shot examples, or "let's think step by step" framing. Treat a reported score as a range, not a precise number.

### Leaderboard framing

Artificial Analysis, Hugging Face Leaderboard, LiveBench, Epoch AI, Scale SEAL, and LMArena all use different methodologies. Numbers aren't comparable cross-site. Read the methodology notes before taking a chart at face value.

## Honest ranking strategies

If you need to pick a model based on a single reasoning signal in 2026:

- **HLE** is the cleanest "is this frontier?" check.
- **GPQA Diamond** is saturating but still useful for mid-tier comparisons.
- **ARC-AGI-2** is the best "does it generalize?" signal.
- **MMLU-Pro** is useful as a fast smoke test, treating it as saturated.
- **LMArena** (human preference) is orthogonal — measures a different thing (perceived helpfulness) and often disagrees with benchmarks.

Use 2–3 of these together. Any single number is noise.

## References

- [MMLU — Hendrycks et al., 2020](https://arxiv.org/abs/2009.03300)
- [MMLU-Pro — 2024 release](https://huggingface.co/datasets/TIGER-Lab/MMLU-Pro) — the successor
- [GPQA — Rein et al., 2023](https://arxiv.org/abs/2311.12022) — and the Diamond subset definition
- [Humanity's Last Exam — 2025](https://lastexam.ai/) — the new frontier benchmark
- [ARC Prize](https://arcprize.org/) — ARC-AGI-2 leaderboard and the annual competition
- [ARC-AGI-2 technical report (arxiv 2505.11831)](https://arxiv.org/abs/2505.11831)
- [HellaSwag — Zellers et al., 2019](https://arxiv.org/abs/1905.07830) — the saturation-in-three-years benchmark
- [TruthfulQA — Lin et al., 2022](https://arxiv.org/abs/2109.07958)
- [Artificial Analysis — MMLU-Pro leaderboard](https://artificialanalysis.ai/evaluations/mmlu-pro)
- [Artificial Analysis — GPQA Diamond leaderboard](https://artificialanalysis.ai/evaluations/gpqa-diamond)

## Related topics

- [Math benchmarks](../math-benchmarks/) — a specialized reasoning family
- [Evaluation methodology and metrics](../evaluation-and-methods/) — how these scores are produced
- [Agent benchmarks](../agent-benchmarks/) — where static QA ends and dynamic capability begins
