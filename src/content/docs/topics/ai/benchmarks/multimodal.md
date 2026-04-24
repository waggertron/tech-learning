---
title: Multimodal benchmarks
description: MMMU, MathVista, ChartQA, DocVQA, and the image/video/audio benchmark family. How multimodal models are evaluated, what's saturated, and the chart-and-diagram blind spots benchmarks keep revealing.
parent: benchmarks
tags: [multimodal, mmmu, mathvista, chartqa, docvqa, benchmarks]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## The multimodal benchmark family

Vision-language models have their own benchmark ecosystem. The major ones in 2026:

| Benchmark | What it tests |
| --- | --- |
| **MMMU** | Multi-discipline college-level vision-language reasoning |
| **MMMU-Pro** | The harder successor |
| **MathVista** | Math problems with diagrams, charts, geometry |
| **ChartQA** | Chart and graph comprehension |
| **DocVQA** | Document understanding (forms, scans, PDFs) |
| **OCRBench** | Low-level OCR capability |
| **VQAv2** | Classic visual question answering (older, mostly saturated) |
| **MMVet** | Integration of core vision capabilities |
| **AI2D** | Diagram understanding (grade-school science) |
| **MathVerse** | Mathematical reasoning with visual input |

## MMMU, Massive Multi-discipline Multimodal Understanding

2023. 11,500 college-exam-level questions across 30 disciplines, each with one or more images. Subjects span art, business, health, humanities, sciences, tech.

**What it measures.** Image + text reasoning at college level.

**Saturation.** Top models in the 70–80% range (April 2026). MMMU itself is largely saturated for leading models.

**MMMU-Pro.** 2024 successor. More robust filtering, vision-only variants (no text cues), harder overall. Frontier models in the 60–70% range. Still differentiates.

## MathVista

2023. Mathematical reasoning requiring visual understanding: geometry problems, function plots, chart-based math, tables.

**What it measures.** The intersection of visual-spatial reasoning and arithmetic. Exposes a common blind spot: models can solve an algebra problem, but struggle when the same problem is presented as a geometry diagram.

**Current state.** Top reasoning models 65–80% range. Older non-reasoning models significantly lower.

## ChartQA

Chart-and-graph question answering. Bar charts, line charts, pie charts, "what was the revenue in Q2?" kind of questions.

**Why it matters.** Charts are ubiquitous in business and science, and they're a known failure mode. A model may read a table of numbers fine but fail to extract numbers from a chart of the same data.

**Saturation.** Approaching but not fully saturated. Top models 85–90%.

## DocVQA and related document-understanding benchmarks

- **DocVQA**, question answering over scanned documents.
- **InfographicVQA**, harder; complex designed infographics with text + images + icons.
- **TextVQA**, short text within natural images.

These exercise OCR + layout + reasoning together. Models good at pure OCR (good text extraction) but bad at layout reasoning fail; so do the reverse.

## OCRBench

Specifically tests OCR capability in isolation, transcription of text from images, including weird fonts, rotated text, mathematical notation, multi-language.

**Why it matters.** A prerequisite for DocVQA. Weak OCR guarantees weak DocVQA.

## MMVet, MMBench

Broader vision-language evaluation frameworks aggregating multiple capabilities (recognition, OCR, knowledge, math, spatial reasoning). Used for comprehensive model cards rather than single-number comparisons.

## Video benchmarks

- **Video-MME**, comprehensive video understanding (short to long clips).
- **MVBench**, 20 video tasks spanning action, scene, object, and attribute understanding.
- **LongVideoBench**, long-form video question answering (hour-plus videos).

Video benchmarks lag image benchmarks, the models are weaker, the benchmarks are less mature, and compute costs are prohibitive.

## Audio benchmarks

- **AudioBench**, audio question answering.
- **MMAU**, multimodal audio understanding.

Still early in development. Most "multimodal" claims in 2026 are primarily vision-language; audio is catch-up.

## Embodied / spatial benchmarks

- **SpatialBench, MindCube**, 3D and embodied spatial reasoning.
- **RoboBench**, robot-task completion from visual input.

Emerging category. Frontier models struggle; benchmark-gaming is less of a concern because they're hard to saturate.

## What multimodal benchmarks don't measure

- **Diagram generation.** Most benchmarks test understanding; creating clean diagrams is an orthogonal skill.
- **Interactive manipulation.** Benchmarks mostly use static images; real use involves screenshots that change.
- **Video generation quality.** Video-MME tests understanding, not generation.
- **Cross-modal reasoning at scale.** Combining image + audio + text in one task is barely benchmarked.
- **Grounded interaction.** "Point to the button", barely tested.

## Reading multimodal scores

### Pure vision vs VQA

A model may ace VQAv2 (classic visual QA) and fail MMMU. The former is closer to "object recognition"; the latter is "reason about what you see." Different capabilities.

### Text-in-image leakage

Some "vision" tasks become text tasks if the model does OCR and then reasons from the extracted text. MMMU-Pro includes vision-only variants specifically to catch this.

### Context-length interactions

Some multimodal benchmarks now include long-form documents with many pages. Scores here couple vision ability with long-context ability.

### Reasoning-mode multiplier

Same as every other benchmark: reasoning-mode variants score ~15–25 points higher on hard multimodal reasoning.

## The current state of the art (April 2026)

Frontier multimodal models (GPT-5.x vision, Gemini 3.x, Claude 4.x vision):

- **MMMU ~80%**, closing on saturation.
- **MMMU-Pro ~65%**, still differentiates.
- **MathVista ~75%** with reasoning.
- **ChartQA ~90%**, nearly saturated.
- **DocVQA ~93%**, nearly saturated.

The frontier is shifting toward:

- **Longer videos** (an hour+ of footage).
- **Agentic multimodal**, a model using a browser with screenshots in the loop.
- **High-resolution technical diagrams** (engineering drawings, scientific figures).
- **3D / spatial.**

## References

- [MMMU, Yue et al., 2023](https://arxiv.org/abs/2311.16502)
- [MMMU-Pro](https://mmmu-benchmark.github.io/), the successor
- [MathVista, Lu et al., 2023](https://mathvista.github.io/)
- [ChartQA](https://github.com/vis-nlp/ChartQA)
- [DocVQA](https://www.docvqa.org/)
- [OCRBench](https://github.com/Yuliang-Liu/MultimodalOCR)
- [MMBench](https://mmbench.opencompass.org.cn/)
- [Video-MME](https://video-mme.github.io/)
- [LongVideoBench](https://longvideobench.github.io/)
- [OpenCompass multimodal leaderboards](https://opencompass.org.cn/leaderboard-multimodal)

## Related topics

- [Knowledge and reasoning benchmarks](../knowledge-and-reasoning/), text-only counterpart
- [Agent benchmarks](../agent-benchmarks/), where multimodal matters for computer-use
- [RAG](../../rag/), increasingly multimodal (retrieve across images + text)
