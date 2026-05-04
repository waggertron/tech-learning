---
title: Knowledge and reasoning benchmarks
description: "MMLU, MMLU-Pro, GPQA Diamond, Humanity's Last Exam, ARC-AGI / ARC-AGI-2, HellaSwag, TruthfulQA. The benchmark family that tries to answer 'how smart is this model?' and how each one is gamed, saturated, or actually informative."
parent: benchmarks
tags: [mmlu, gpqa, hle, arc-agi, benchmarks]
status: draft
created: 2026-04-24
updated: 2026-05-04
---

## The category in one paragraph

Knowledge-and-reasoning benchmarks present a model with questions, often multiple choice, sometimes free-form, and score how many it gets right. They dominate the headline charts because a single number ("model scored 85% on MMLU") is easy to quote. The shape-of-the-chart sells the story; the shape-of-the-chart also hides most of the interesting nuance.

## MMLU, Massive Multitask Language Understanding

The 2020 benchmark that defined the category. 57 subjects (elementary math through professional law), 15,908 multiple-choice questions, 4 options each.

**What it measures.** Broad knowledge at exam-like level, with a slight tilt toward factual recall.

**Example question (Electrical Engineering):**

> A transistor in the active region has a collector current of 2 mA and a base current of 20 µA. What is the common-emitter current gain?
>
> (A) 10 &nbsp; (B) 100 &nbsp; (C) 0.01 &nbsp; (D) 50

The correct answer is (B) 100: beta = Ic / Ib = 2 mA / 20 µA = 100. This is a straightforward plug-and-play calculation, not deep reasoning. Most MMLU questions are at this level.

**Score history:**

| Model / baseline | MMLU score |
| --- | --- |
| Random (4-choice) | 25% |
| GPT-3 (2020) | 43.9% |
| GPT-3.5 | ~70% |
| GPT-4 (2023) | 86.4% |
| Human expert average | 89.8% |
| Current frontier (2026) | ~90-92% |

**Saturation.** Saturated. GPT-4 hit 86% in 2023; every frontier model since passes it. Still quoted for historical comparisons and as a cheap smoke test.

**Contamination and gaming.** Training data almost certainly contains MMLU questions, either directly from the paper's appendix or from the thousands of blog posts that reproduce specific questions. A model can memorize the right letter for a given question without understanding the subject at all. Reported scores have been inflated by this contamination; the ~90% frontier numbers are plausible but should be read with some skepticism. Additionally, models sometimes score higher than human experts not because they are smarter but because they are better at eliminating obviously wrong choices under ambiguous wording, a test-taking skill, not a knowledge signal.

## MMLU-Pro

The 2024 replacement. Same domains, **10 answer options instead of 4**, harder filtering toward graduate-level reasoning, 12,032 questions.

**Why 10 choices matter.** Random guessing on 4-choice MMLU scores 25%. Random guessing on 10-choice MMLU-Pro scores 10%. That 15-point floor drop means any score in the 50-70% range is much more informative: models genuinely understand material rather than lucky-guessing their way up. A model that scored 85% on original MMLU may score only 60-70% on MMLU-Pro, which exposes exactly the gap you want to see.

**What it measures.** Harder knowledge and reasoning. A 50% score on MMLU-Pro is roughly equivalent to 80% on original MMLU.

**Score comparison:**

| Model | MMLU-Pro score |
| --- | --- |
| GPT-4 with CoT | 72.6% |
| Claude 3 Sonnet | 55.1% |
| Claude 3 Opus | 68.5% |
| Claude Opus 4 / Gemini 2.5 Pro | ~82-85% |
| Current frontier (2026) | ~89-91% |

The 16-33 point drop from original MMLU to MMLU-Pro scores confirms that the original benchmark was measuring "comfortable with exam wording" as much as actual knowledge. MMLU-Pro is the credible replacement until it too saturates.

**Saturation (April 2026).** Approaching. Gemini 3 Pro at ~90.1%, Claude Opus 4.5 with reasoning at ~89.5%, DeepSeek-V3.2 at ~85% per aggregated leaderboards.

**Why it's still useful.** In the 60-85% range, MMLU-Pro still cleanly separates mid-tier models. At the top it's losing discriminatory power; expect a "MMLU-Pro 2" or a successor within 18 months.

## GPQA Diamond

"Graduate-level Google-Proof Q&A", 448 multiple-choice questions across physics, chemistry, and biology, all at PhD level. "Diamond" is the hardest 198-question subset; most headline scores quote Diamond.

**What it measures.** Deep, subject-specific reasoning. Designed to be unanswerable by non-experts even *with* web access.

**Example question (Chemistry, paraphrased):**

> A liquid organic compound undergoes a reaction at 80°C and 20 bar for 24 hours. In the proton NMR spectrum, signals with the highest chemical shift are replaced by a new signal shifted 3-4 ppm downfield. What group of elements, used in the corresponding large-scale industrial processes, would most likely have been added in small catalytic amounts?
>
> (A) Group 6 &nbsp; (B) Group 8 &nbsp; (C) Group 10 &nbsp; (D) Group 14

The conditions (high pressure, elevated temperature, NMR shift indicating new C-H or C-C bonds) point to a hydrogenation or related transition-metal-catalyzed process. Correctly narrowing to the right group requires integrating organometallic chemistry, NMR interpretation, and industrial process knowledge simultaneously. This is not a question you can Google your way through quickly.

**Score history:**

| Model / baseline | GPQA Diamond score |
| --- | --- |
| Random (4-choice) | 25% |
| Skilled non-experts with web access | 34% |
| GPT-4 (original paper, 2023) | 39% |
| GPT-4o | 50-53% |
| PhD domain experts | 65% |
| o1 / Claude 3.7 / Gemini 2.5 Pro | 77-86% |
| o3 | 83% |
| Current frontier (2026) | 87-94% |

**Statistical noise caveat.** The Diamond subset contains only 198 questions. Each question is worth roughly 0.5 percentage points. A model "improving" from 81% to 83% could easily be noise from two questions answered differently under slight prompt variation. Treat single-decimal-place GPQA differences as essentially tied.

**Human baseline.** PhDs in the exam subject: **65%**. Skilled non-experts with web access: **34%**.

**Saturation (April 2026).** Approaching the ceiling. GPT-5.4 at ~92%, Gemini 3.1 Pro Preview at ~94.1%, GPT-5.3 Codex at ~91.5%. When models consistently beat expert humans, the benchmark stops telling you what you want to know.

**Why it matters historically.** GPQA Diamond was the first benchmark where "reasoning mode" dramatically changed scores. Models without test-time compute scored ~40%; models *with* reasoning jumped to 80%+. It became the standard reasoning-mode benchmark in 2024 and is still the most commonly cited hard-science signal.

## Humanity's Last Exam (HLE)

Released late 2024 / early 2025. 2,500+ expert-submitted questions across dozens of specialized domains. The hardest exam-style benchmark currently public.

**What it measures.** Cross-domain expert-level reasoning, far past GPQA's scope. 76% of questions are free-answer (not multiple-choice), and 24% are multiple-choice. Questions span 100+ subjects from obscure subfields of biology and mathematics to linguistics and history of science.

**Example questions:**

> (1, Biology) Hummingbirds within Apodiformes uniquely have a bilaterally paired oval bone, a sesamoid embedded in the caudolateral portion of the expanded, cruciate aponeurosis of insertion of m. depressor caudae. How many paired tendons are supported by this sesamoid bone?

This requires knowing the detailed anatomy of a specific muscle insertion in hummingbirds, a fact that exists in primary ornithology literature but is almost certainly not in any training corpus in a form a language model can retrieve cleanly.

> (2, Linguistics) [Some questions require translating a passage written in Palmyrene script and answering a question about its content.]

Questions like this demand knowledge of extinct scripts, historical context, and enough linguistic skill to work through a translation, stacking three rare competencies at once.

**Score history:**

| Model | HLE score |
| --- | --- |
| GPT-4o | 2.7-3.3% |
| Claude 3.5 Sonnet | 4.1-4.3% |
| o1 | 8.0-9.1% |
| DeepSeek-R1 | 9.4% |
| Gemini 2.5 Pro | ~21.6% |
| GPT-5 | ~25% |
| Gemini 3 Pro | ~37-38% |
| Human domain experts | ~90% |

**Current state (April 2026).** Frontier models score ~35%, nowhere near saturation. Human domain experts average ~90% on problems in their own subjects. The gap between current AI and human expert performance is roughly 50-55 points, the largest remaining gap of any prominent benchmark.

**Why it matters.** HLE is the benchmark designed to stay unsaturated. It will likely be the primary "has the frontier moved?" signal for the next few years. Watch for:

- First frontier model to hit 50%.
- First model to hit 75%.
- "HLE-Pro" when the current benchmark gets too close.

## ARC-AGI and ARC-AGI-2

François Chollet's 2019 benchmark, now in its second version. Visual grid puzzles: a model sees 3-5 input/output grid pairs, must produce the correct output for a sixth input grid.

**What it measures.** Fluid intelligence, novel pattern recognition and abstraction from tiny example sets. Deliberately designed to be impossible to solve by memorization or pattern-matching on training data.

**Example task (ARC-AGI-2):**

> A puzzle shows input grids containing a large rectangle with a small dot placed somewhere inside it. The output grids show the dot relocated to the corner of the rectangle that is nearest to the center of the overall grid. The model must infer this spatial-relational rule from 3 demonstration pairs, then apply it to a fourth input grid it has never seen.

No lookup table can solve this. No training corpus contains the rule stated explicitly. The solver must observe the input/output pattern across three examples, construct a general rule ("find closest corner to grid center"), and apply it. A bright 10-year-old can do this. Frontier AI systems often cannot.

**Human baseline.** In a San Diego 2025 study of human performance on ARC-AGI-2, participants solved tasks with nearly 100% accuracy and averaged about 2.7 minutes per task. No special training was required.

**Score history:**

| Model / approach | ARC-AGI-2 score | Cost per task |
| --- | --- | --- |
| Human public (San Diego 2025) | ~100% | ~2.7 min |
| GPT-4o | ~5% | low |
| Gemini 3 Pro | 31% | moderate |
| Claude Opus 4.5 with Thinking | 37.6% | $2.20 |
| Poetiq (Gemini 3 Pro + refinement) | 54% | $31.00 |

**The cost-vs-capability gap.** The human average of ~2.7 minutes per task translates to perhaps a few cents of human time. The leading AI system (Poetiq) charges $31 per task to reach 54% accuracy. Humans achieve full accuracy at 1/1000th the cost per task. This gap is the clearest current evidence that LLMs are not doing what humans do when solving novel visual reasoning problems.

**Older ARC.** The original ARC-AGI has been solved; ARC-AGI-2 is the live challenge.

**Current state (April 2026).** With search and reasoning compute, frontier systems have reached 85% (GPT-5.5), 83.3% (GPT-5.4 Pro), 77.1% (Gemini 3.1 Pro). Pure language models score near 0% without heavy test-time compute.

**The ARC Prize.** A $1M+ prize fund encouraging solutions that score high with *limited compute*. The 2025 prize year revealed that scaling brute-force search gets you answers, but efficient generalization is still missing.

**Why it matters.** ARC-AGI-2 is the clearest signal that current LLMs have a real gap versus general intelligence. A benchmark where the solution is trivial for a bright child and hard for a frontier model is unusually informative.

## Older benchmarks still in circulation

### HellaSwag

Commonsense reasoning. Given a scenario, pick the most plausible continuation from 4 options. Saturated (~95% top) by 2022. Still appears in release notes for historical comparison; not a useful differentiator now.

### TruthfulQA

Measures whether models parrot common misconceptions. 817 questions designed to elicit "confident and wrong" answers. Interesting diagnostic; high scores mean the model resists plausible-but-wrong continuations. RLHF dramatically improved TruthfulQA scores in 2023; differentiation is weaker now.

### ARC (original, not ARC-AGI)

The AI2 "Grade school science challenge." 7,787 questions. Mostly saturated. Not related to ARC-AGI except by name.

### Big-Bench Hard (BBH)

A 23-task subset of BIG-Bench where frontier models struggled. Useful 2022-2024; mostly saturated by 2025.

### PIQA, WinoGrande, OpenBookQA

Various reasoning-tinged QA. Historical context; saturated.

## What to watch for when reading a leaderboard

### Reasoning vs non-reasoning scores

A model in "reasoning mode" (with explicit chain-of-thought or test-time search) scores dramatically higher than the same model "thinking fast." GPQA Diamond, ARC-AGI-2, and FrontierMath all show 20-40 point gaps.

Always check: is this the thinking or non-thinking score? A 92% GPQA Diamond at "extended thinking" isn't comparable to an 82% at one-shot.

### Pass@1 vs best-of-N

A "80% on SWE-bench" from one attempt is different from "80% passed if we let the model try 10 times and picked the best." Best-of-N scores are much easier to game.

### Prompt format sensitivity

MMLU-Pro scores can swing 5-10 points based on prompt format, few-shot examples, or "let's think step by step" framing. Treat a reported score as a range, not a precise number.

### Leaderboard framing

Artificial Analysis, Hugging Face Leaderboard, LiveBench, Epoch AI, Scale SEAL, and LMArena all use different methodologies. Numbers aren't comparable cross-site. Read the methodology notes before taking a chart at face value.

## Honest ranking strategies

If you need to pick a model based on a single reasoning signal in 2026:

- **HLE** is the cleanest "is this frontier?" check.
- **GPQA Diamond** is saturating but still useful for mid-tier comparisons.
- **ARC-AGI-2** is the best "does it generalize?" signal.
- **MMLU-Pro** is useful as a fast smoke test, treating it as saturated.
- **LMArena** (human preference) is orthogonal, measures a different thing (perceived helpfulness) and often disagrees with benchmarks.

Use 2-3 of these together. Any single number is noise.

## References

- [MMLU, Hendrycks et al., 2020](https://arxiv.org/abs/2009.03300)
- [MMLU-Pro, 2024 release](https://huggingface.co/datasets/TIGER-Lab/MMLU-Pro), the successor
- [GPQA, Rein et al., 2023](https://arxiv.org/abs/2311.12022), and the Diamond subset definition
- [Humanity's Last Exam, 2025](https://lastexam.ai/), the new frontier benchmark
- [ARC Prize](https://arcprize.org/), ARC-AGI-2 leaderboard and the annual competition
- [ARC-AGI-2 technical report (arxiv 2505.11831)](https://arxiv.org/abs/2505.11831)
- [HellaSwag, Zellers et al., 2019](https://arxiv.org/abs/1905.07830), the saturation-in-three-years benchmark
- [TruthfulQA, Lin et al., 2022](https://arxiv.org/abs/2109.07958)
- [Artificial Analysis, MMLU-Pro leaderboard](https://artificialanalysis.ai/evaluations/mmlu-pro)
- [Artificial Analysis, GPQA Diamond leaderboard](https://artificialanalysis.ai/evaluations/gpqa-diamond)

## Related topics

- [Math benchmarks](../math-benchmarks/), a specialized reasoning family
- [Evaluation methodology and metrics](../evaluation-and-methods/), how these scores are produced
- [Agent benchmarks](../agent-benchmarks/), where static QA ends and dynamic capability begins
