---
title: Knowledge and reasoning benchmarks
description: "MMLU, MMLU-Pro, GPQA Diamond, Humanity's Last Exam, ARC-AGI / ARC-AGI-2, HellaSwag, TruthfulQA. The benchmark family that tries to answer 'how smart is this model?' and how each one is gamed, saturated, or actually informative."
parent: benchmarks
tags: [mmlu, gpqa, hle, arc-agi, benchmarks]
status: draft
created: 2026-04-24
updated: 2026-05-13
---

## The category in one paragraph

Knowledge-and-reasoning benchmarks present a model with questions, often multiple choice, sometimes free-form, and score how many it gets right. They dominate the headline charts because a single number ("model scored 85% on MMLU") is easy to quote. The shape-of-the-chart sells the story; the shape-of-the-chart also hides most of the interesting nuance.

## Why this benchmark family exists

Before MMLU (2020), the dominant NLP benchmarks were GLUE (2018) and SuperGLUE (2019). GLUE tested basic language understanding: sentiment, entailment, pronoun resolution. State-of-the-art models saturated GLUE within 18 months. SuperGLUE raised the bar; it saturated in roughly the same time.

Neither benchmark said anything useful about whether a model understood biology, law, or economics. They measured linguistic surface competence, not knowledge. The question "can a model that scores 90% on GLUE answer a medical licensing exam question?" was unanswered. MMLU was created to answer it.

The benchmark family has evolved along one axis: pushing further into territory where memorization stops working and genuine reasoning becomes necessary. MMLU tested recall. MMLU-Pro added elimination difficulty. GPQA Diamond required integrated cross-domain reasoning. HLE pushed to problems likely outside any training corpus. ARC-AGI-2 targeted novel visual reasoning that, by construction, cannot be memorized.

## MMLU, Massive Multitask Language Understanding

The 2020 benchmark that defined the category. 57 subjects (elementary math through professional law), 15,908 multiple-choice questions, 4 options each.

**What it measures.** Broad knowledge at exam-like level, with a slight tilt toward factual recall.

**Example question (Electrical Engineering):**

> A transistor in the active region has a collector current of 2 mA and a base current of 20 µA. What is the common-emitter current gain?
>
> (A) 10 &nbsp; (B) 100 &nbsp; (C) 0.01 &nbsp; (D) 50

The correct answer is (B) 100: beta = Ic / Ib = 2 mA / 20 µA = 100. This is a straightforward plug-and-play calculation, not deep reasoning. Most MMLU questions are at this level.

**Example question (Professional Law):**

> A landlord rents an apartment to a tenant under a one-year lease. Three months into the lease, the landlord sells the building to a buyer. The buyer refuses to honor the lease and asks the tenant to vacate. Which of the following best describes the legal situation?
>
> (A) The tenant must vacate because the lease terminated when the property was sold &nbsp; (B) The tenant may remain because the lease runs with the land &nbsp; (C) The tenant may remain only if the original landlord compensates the buyer &nbsp; (D) The tenant must vacate unless the lease was recorded

Answer: (B). Leases are encumbrances that run with the land. A bona fide purchaser takes title subject to existing leases unless the lease was never properly disclosed. This is standard property law, tested at bar-exam level.

**Example question (Clinical Knowledge):**

> A 45-year-old woman presents with fatigue, cold intolerance, weight gain, and constipation. Her TSH is elevated and free T4 is low. Which of the following is the most appropriate initial treatment?
>
> (A) Methimazole &nbsp; (B) Propylthiouracil &nbsp; (C) Levothyroxine &nbsp; (D) Radioactive iodine

Answer: (C). Elevated TSH + low free T4 is primary hypothyroidism. Levothyroxine (synthetic T4) is first-line treatment. Methimazole and PTU treat hyperthyroidism (the opposite condition). This question tests clinical reasoning at the level of a second-year medical student.

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

**Contamination and gaming.** Training data almost certainly contains MMLU questions, either directly from the paper's appendix or from the thousands of blog posts that reproduce specific questions. A model can memorize the right letter for a given question without understanding the subject at all. Reported scores have been inflated by this contamination; the ~90% frontier numbers are plausible but should be read with some skepticism. Models can also score higher than human experts because they are better at eliminating obviously wrong choices under ambiguous wording, a test-taking skill, not a knowledge signal.

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

**Score progression (2020-2026):**

```
MMLU score progression (2020 -- 2026)
100% |                                               ***
 90% |                                          *****
 80% |                                *****-----
 70% |                          ******
 60% |                    ******
 50% |              ------
 40% |         ***
 30% | [random]
 20% |
     +---+---+---+---+---+---+---+---+---+---+---+---
     2020       2021      2022       2023      2024  2026

--- GPT-3/3.5 era     *** GPT-4 class     === Frontier 2026
Human expert average: 89.8% (shown as dashed line at top)
```

**MMLU-Pro example question (Biology, 10-choice):**

> In CRISPR-Cas9 gene editing, the PAM sequence is recognized by which component, and what is its functional role?
>
> (A) The sgRNA -- it anchors to the target site &nbsp; (B) The Cas9 protein -- it is required for Cas9 to bind and cleave DNA &nbsp; (C) The HDR template -- it prevents off-target integration &nbsp; (D) The tracrRNA -- it stabilizes the sgRNA scaffold &nbsp; (E) The RuvC domain -- it cleaves the non-complementary strand &nbsp; (F) The HNH domain -- it generates a nick in the coding strand &nbsp; (G) The anti-CRISPR protein -- it inhibits Cas9 binding &nbsp; (H) The crRNA spacer sequence -- it scans for target DNA &nbsp; (I) The Cas9 NLS -- it imports the complex into the nucleus &nbsp; (J) The REC lobe -- it positions the DNA for cleavage

Answer: (B). The PAM sequence (NGG in SpCas9) is recognized by the PAM-interacting domain of Cas9 protein. PAM recognition is a prerequisite for Cas9 binding; without it, the complex will not engage target DNA even if the sgRNA spacer matches. This requires knowing the mechanism, not just vocabulary.

## GPQA Diamond

"Graduate-level Google-Proof Q&A", 448 multiple-choice questions across physics, chemistry, and biology, all at PhD level. "Diamond" is the hardest 198-question subset; most headline scores quote Diamond.

**What it measures.** Deep, subject-specific reasoning. Designed to be unanswerable by non-experts even *with* web access.

**Example question (Chemistry, paraphrased):**

> A liquid organic compound undergoes a reaction at 80°C and 20 bar for 24 hours. In the proton NMR spectrum, signals with the highest chemical shift are replaced by a new signal shifted 3-4 ppm downfield. What group of elements, used in the corresponding large-scale industrial processes, would most likely have been added in small catalytic amounts?
>
> (A) Group 6 &nbsp; (B) Group 8 &nbsp; (C) Group 10 &nbsp; (D) Group 14

The conditions (high pressure, elevated temperature, NMR shift indicating new C-H or C-C bonds) point to a hydrogenation or related transition-metal-catalyzed process. Correctly narrowing to the right group requires integrating organometallic chemistry, NMR interpretation, and industrial process knowledge simultaneously. This is not a question you can Google your way through quickly.

**Example question (Physics, paraphrased):**

> A particle of mass m is confined to a 1D infinite square well of width L. If the width is suddenly reduced to L/2 while the particle is in the ground state, what is the probability of finding the particle in the ground state of the new well?
>
> (A) 8/3pi &nbsp; (B) 64/(9pi^2) &nbsp; (C) 8/(3pi^2) &nbsp; (D) 32/(9pi)

The correct answer requires computing the overlap integral between the ground state of the original well (psi_1, normalized over [0, L]) and the ground state of the new well (phi_1, normalized over [0, L/2]), then squaring. This requires quantum mechanics at upper-undergraduate level.

**Example question (Biology, paraphrased):**

> A researcher observes that a synthetic gene circuit in E. coli shows bistability: it can exist stably in either a high-expression or low-expression state. Which combination of network motifs is most likely responsible?
>
> (A) A negative feedback loop combined with a constitutive promoter &nbsp; (B) A positive feedback loop combined with a hill coefficient above 1 &nbsp; (C) Two parallel negative feedback loops with different time constants &nbsp; (D) A coherent type-1 feed-forward loop with an AND logic gate

Answer: (B). Bistability in gene circuits requires positive feedback (to sustain a state) combined with ultrasensitivity (hill coefficient > 1 creates a sharp switch). This is synthetic biology at the graduate-research level.

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

> (3, Mathematics) Let f : R -> R be a continuous function satisfying f(f(x)) = x for all x in R. Prove or disprove: f must be monotonically decreasing.

This requires knowing that a continuous involution on R must be monotone, and that the only monotone involutions are strictly decreasing (identity would be f(f(x)) = x with f(x) = x, which is both cases). The question requires a real-analysis proof at graduate level.

> (4, History of Science) The Michelson-Morley experiment used a specific type of interferometer. The interference fringe shift expected if the luminiferous ether existed was computed to be approximately how many fringes (using the apparatus's arm length of 11 meters and the Earth's orbital velocity)?

Answer: approximately 0.4 fringes. This requires knowing the formula delta = 2Lv^2/lambda*c^2, plugging in L=11m, v=3x10^4 m/s (Earth's orbital speed), lambda ~= 600nm, c = 3x10^8 m/s. The actual observed shift was < 0.01 fringes. Most models cannot do this calculation correctly.

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

Francois Chollet's 2019 benchmark, now in its second version. Visual grid puzzles: a model sees 3-5 input/output grid pairs, must produce the correct output for a sixth input grid.

**What it measures.** Fluid intelligence, novel pattern recognition and abstraction from tiny example sets. Deliberately designed to be impossible to solve by memorization or pattern-matching on training data.

**Example task (ARC-AGI-2):**

> A puzzle shows input grids containing a large rectangle with a small dot placed somewhere inside it. The output grids show the dot relocated to the corner of the rectangle that is nearest to the center of the overall grid. The model must infer this spatial-relational rule from 3 demonstration pairs, then apply it to a fourth input grid it has never seen.

No lookup table can solve this. No training corpus contains the rule stated explicitly. The solver must observe the input/output pattern across three examples, construct a general rule ("find closest corner to grid center"), and apply it. A bright 10-year-old can do this. Frontier AI systems often cannot.

**How a task is presented:**

```
How an ARC-AGI-2 task is presented
===================================

Training pair 1:          Training pair 2:          Training pair 3:
Input:   Output:          Input:   Output:          Input:   Output:
[1][2]   [3][3]          [4][1]   [1][1]          [2][3]   [3][3]
[2][2]   [3][3]          [1][1]   [1][1]          [3][3]   [3][3]
[1][3]   [3][3]          [4][4]   [1][1]          [2][2]   [3][3]

Test input:               Expected output (hidden):
[3][1]                    [?][?]
[2][3]                    [?][?]
[1][2]                    [?][?]

The model must infer the transformation rule from the three training pairs
and apply it to the test input. No instructions. No hints. Just examples.
```

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

**Older ARC.** The original ARC-AGI has been solved. ARC-AGI-2 is the live challenge.

**Current state (April 2026).** With search and reasoning compute, frontier systems have reached 85% (GPT-5.5), 83.3% (GPT-5.4 Pro), 77.1% (Gemini 3.1 Pro). Pure language models score near 0% without heavy test-time compute.

**The ARC Prize.** A $1M+ prize fund encouraging solutions that score high with *limited compute*. The 2025 prize year revealed that scaling brute-force search gets you answers, but efficient generalization is still missing.

**Why it matters.** ARC-AGI-2 is the clearest signal that current LLMs have a real gap versus general intelligence. A benchmark where the solution is trivial for a bright child and hard for a frontier model is unusually informative.

## Historical model trajectory

How key models scored across multiple benchmarks. Each column is a different difficulty ceiling; watching scores rise across all four tells the clearest story about where the frontier sits.

| Model (year) | MMLU | GPQA Diamond | HLE | ARC-AGI-2 |
| --- | --- | --- | --- | --- |
| GPT-3 (2020) | 43.9% | -- | -- | -- |
| GPT-3.5 (2022) | ~70% | -- | -- | -- |
| GPT-4 (2023) | 86.4% | 39% | ~3% | ~5% |
| Claude 3 Opus (2024) | 86.8% | 50.4% | ~4.8% | ~5% |
| o1 (2024) | ~92% | 78% | ~9% | -- |
| Claude 3.7 / Gemini 2.5 Pro (2025) | ~90% | 84% | ~21% | ~37% |
| GPT-5 (2025) | ~92% | ~90% | ~25% | ~85% |
| Frontier cluster (Apr 2026) | ~91% | ~92% | ~35% | ~85% |
| Human expert average | 89.8% | 65% | ~90% | ~100% |

Note: all frontier-model numbers are representative ranges from aggregated leaderboards; exact scores depend on prompt format, reasoning mode, and evaluation date.

## How to correctly interpret a knowledge-benchmark score

**A score is not a percentage of the domain.** An 86% MMLU score does not mean the model knows 86% of all knowledge across MMLU's 57 domains. It means the model answers 86% of MMLU's specific questions correctly. MMLU's questions were written by graduate students, filtered for clarity, and formatted as 4-choice multiple choice. Real expert knowledge looks different.

**Check the reasoning mode.** GPQA Diamond at "one-shot, no thinking" is a fundamentally different capability than GPQA Diamond with extended reasoning. A model scoring 92% with reasoning vs. 60% without is telling you two things: the model has the knowledge (60% base), and the reasoning process extracts more of it (an additional 32%).

**Confidence calibration matters.** A model that scores 80% but is highly uncertain when wrong is more useful than one that scores 85% but is confidently wrong 15% of the time. Benchmarks rarely report calibration (ECE, Brier score). For safety-critical applications, request calibration data, not just accuracy.

**Small benchmark = wide confidence interval.** GPQA Diamond is 198 questions. Each question is worth 0.5 percentage points. A "difference" of 83% vs 85% between two models is a 4-question swing. That is noise, not signal. Use benchmarks with at least 1,000 examples to compare models at small margins.

## How model architectures advanced to score better

**Scale (2020-2022): the GPT-3 era.** GPT-3 scored 43.9% on MMLU. The primary driver of improvement in this era was scale: more parameters trained on more text. The Chinchilla paper (2022) showed that compute was being misallocated (too many parameters, too little data) and that better scaling laws produced more efficient models. Scaling alone took MMLU scores from ~44% to ~70%.

**RLHF (2022-2023): the InstructGPT and GPT-4 jump.** Reinforcement Learning from Human Feedback (RLHF) was the architectural shift that took GPT-3.5-class models to GPT-4-class. The mechanism: (1) collect human demonstrations of good answers, (2) train a reward model on human preferences, (3) fine-tune the base LLM using PPO to maximize the reward model. RLHF did not add knowledge. It improved the model's ability to correctly retrieve and express what it already knew. GPQA Diamond jumped from ~40% (GPT-4 baseline) to ~50% (GPT-4o) largely due to RLHF-improved reasoning expression.

**Chain-of-thought and reasoning models (2023-2025): the o1/R1 jump.** OpenAI's o1, Anthropic's extended thinking, and DeepSeek R1 introduced reasoning-mode inference. The key insight: instead of training models to produce a final answer, train them to produce intermediate reasoning steps (a "chain of thought") and reward correct final answers. GPQA Diamond jumped from ~50% (GPT-4o) to ~84% (o1). The mechanism is not simply "longer output." The model learns to explore multiple solution paths, backtrack from wrong approaches, and verify intermediate steps before committing.

**Test-time compute scaling.** The o1/o3 models showed that allocating more compute at inference time (thinking for longer) reliably improves scores on hard reasoning benchmarks. ARC-AGI-2 went from ~5% to ~85% with heavy test-time compute. This is distinct from training-time scaling: the model is not fundamentally smarter, it is being given more time to think. The implication: "benchmark score" is now a function of both model weights and inference budget, not just model weights.

**What the remaining gap tells us.** HLE is at ~35% frontier, ~90% human expert. The gap is not closed by reasoning mode or test-time compute at the rates seen on GPQA or ARC-AGI. HLE questions require specialized knowledge that simply isn't in training data at sufficient density for the model to reason from. This is evidence that the remaining gap is primarily a knowledge and retrieval problem, not a reasoning problem.

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
