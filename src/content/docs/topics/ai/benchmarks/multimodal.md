---
title: Multimodal benchmarks
description: MMMU, MathVista, ChartQA, DocVQA, and the image/video/audio benchmark family. How multimodal models are evaluated, what's saturated, and the chart-and-diagram blind spots benchmarks keep revealing.
parent: benchmarks
tags: [multimodal, mmmu, mathvista, chartqa, docvqa, benchmarks]
status: draft
created: 2026-04-24
updated: 2026-05-13
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

## Why multimodal benchmarks exist

**The vision-language gap (2021-2022).** Early vision-language models (CLIP, DALL-E, Flamingo) could do image captioning and visual question answering at a surface level. "What is in this image?" was solvable. "Look at this circuit diagram and compute the output voltage" was not. VQAv2 (the dominant benchmark of the era) was saturating on surface-level tasks while deeper visual reasoning remained unmeasured.

**MMMU (2023): college-level vision.** The MMMU authors took the MMLU recipe (exam-level questions across many domains) and added images. A chemistry question that requires reading a molecular diagram is harder than the same question stated in text, because the model must parse a visual representation before reasoning. MMMU was created to test whether vision-language models could pass college exams that require both visual and domain-specific knowledge simultaneously.

**MathVista (2023): the diagram reasoning gap.** MathVista was motivated by a specific observed failure: GPT-4V could solve algebra problems stated in text but failed the same problems stated as geometry diagrams. Reading a diagram correctly (identifying angles, labels, relationships) requires different processing than reading prose. MathVista isolated this gap.

**ChartQA (2022): business document understanding.** Charts and graphs are ubiquitous in real business documents. A model deployed on financial analysis needs to read a bar chart, not just the data table underneath it. ChartQA was created specifically for this use case: extraction and reasoning over chart-based visual data.

**DocVQA (2020): the OCR + layout problem.** Scanned documents (invoices, contracts, forms) are a practical deployment target for AI. OCR alone (extract text from image) is not sufficient; layout understanding (which field label corresponds to which value?) is also necessary. DocVQA was created to evaluate this combination.

## MMMU, Massive Multi-discipline Multimodal Understanding

2023. 11,500 college-exam-level questions across 30 disciplines, each with one or more images. Subjects span art, business, health, humanities, sciences, tech.

**What it measures.** Image + text reasoning at college level.

**Saturation.** Top models in the 70–80% range (April 2026). MMMU itself is largely saturated for leading models.

**MMMU-Pro.** 2024 successor. More robust filtering, vision-only variants (no text cues), harder overall. Frontier models in the 60–70% range. Still differentiates.

### MMMU example questions

**Example 1 (Art History):**

> The image shows a painting with a distinct style characterized by broken brushstrokes, visible paint texture, and emphasis on light effects over precise line drawing. Based on the visual evidence in the image, this work is most consistent with which art movement?
> (A) Neoclassicism &nbsp; (B) Impressionism &nbsp; (C) Abstract Expressionism &nbsp; (D) Photorealism

For a human with art education: immediately recognizable as Impressionism from the described visual properties. For a model: requires both reading the description AND connecting the visual properties to the correct movement, not just recognizing the word "Impressionism" in the text.

**Example 2 (Medicine/Radiology):**

> The image shows an X-ray of a patient's chest. There is increased opacity in the right lower lobe with blurring of the right hemidiaphragm border. The trachea appears midline. Based on these findings, what is the most likely diagnosis?
> (A) Pneumothorax &nbsp; (B) Right lower lobe pneumonia &nbsp; (C) Pleural effusion &nbsp; (D) Right-sided atelectasis

The key visual finding (blurring of the hemidiaphragm, indicating consolidation but preserved trachea position) points to right lower lobe pneumonia rather than pleural effusion (which would shift the trachea) or pneumothorax (which shows hyperlucency). This requires integrating visual findings with clinical radiology knowledge.

**Example 3 (Engineering/Circuits):**

> The image shows a circuit diagram with a 12V source, a 4-ohm resistor R1, and a 2-ohm resistor R2 connected in parallel. What is the total current drawn from the source?
> (A) 1.5A &nbsp; (B) 3A &nbsp; (C) 4.5A &nbsp; (D) 6A

Working from the diagram: parallel resistance = (4x2)/(4+2) = 8/6 = 4/3 ohms. Total current = 12V / (4/3) = 9A. That is not one of the options. This is exactly where models fail on MMMU: reading the circuit diagram correctly (are R1 and R2 in parallel or series? is the source 12V or is that a label for something else?) is the prerequisite. Models that misread the diagram get a wrong starting value and pick a plausible-looking wrong answer.

## MathVista

2023. Mathematical reasoning requiring visual understanding: geometry problems, function plots, chart-based math, tables.

**What it measures.** The intersection of visual-spatial reasoning and arithmetic. Exposes a common blind spot: models can solve an algebra problem, but struggle when the same problem is presented as a geometry diagram.

**Current state.** Top reasoning models 65–80% range. Older non-reasoning models significantly lower.

### MathVista example questions

**Example 1 (Geometry from diagram):**

> [Image: a right triangle with legs labeled 6 and 8, and a circle inscribed within it touching all three sides.]
> What is the radius of the inscribed circle?

Working: for a right triangle with legs a, b and hypotenuse c, the inradius r = (a + b - c)/2. Here a=6, b=8, c=10 (Pythagorean triple). r = (6+8-10)/2 = **2**.

The model must (1) identify the right triangle from the image, (2) read the labels correctly, (3) recognize the inscribed circle formula or derive it from area/perimeter: area = 24, perimeter = 24, r = 2 x area / perimeter = 48/24 = 2. Models that can do this algebra but misread the leg labels from the diagram fail.

**Example 2 (Chart-based math):**

> [Image: a bar chart showing annual revenue for years 2019-2023. The bars reach approximately $12M, $15M, $11M, $18M, and $22M respectively.]
> What was the average annual growth rate from 2019 to 2023?

Working: from $12M to $22M over 4 years. CAGR = (22/12)^(1/4) - 1 = (1.833)^0.25 - 1 = approximately 16.4%.

The failure mode: models often compute simple average growth ((22-12)/12 / 4 = 20.8%) instead of compound annual growth rate. Or they misread the bars (is the 2023 bar exactly $22M, or $21.5M?). The visual ambiguity in reading bar heights is a systematic MathVista weakness.

## ChartQA

Chart-and-graph question answering. Bar charts, line charts, pie charts, "what was the revenue in Q2?" kind of questions.

**Why it matters.** Charts are ubiquitous in business and science, and they're a known failure mode. A model may read a table of numbers fine but fail to extract numbers from a chart of the same data.

**Saturation.** Approaching but not fully saturated. Top models 85–90%.

### ChartQA example questions

**Example 1 (direct retrieval):**

> [Image: pie chart showing market share. Slices are labeled: Company A 35%, Company B 28%, Company C 22%, Company D 15%.]
> What percentage of market share does Company B hold?

Answer: 28%. This is the easy end of ChartQA, direct label reading. Frontier models score ~99% on this type. ChartQA's difficulty comes from the harder variants.

**Example 2 (comparison requiring visual estimation):**

> [Image: line chart showing two companies' quarterly revenue from Q1 2020 to Q4 2022. Lines cross twice.]
> During how many quarters did Company A exceed Company B?

The model must count quarters, track which line is which across the crossings, and handle the crossings correctly. If the chart has 12 data points and the lines cross twice, the answer requires determining which company is higher in each of the 12 segments, which in turn requires reading whether each crossing is going up or down. Error rate increases with number of crossings.

**Example 3 (calculation):**

> [Image: stacked bar chart showing annual energy consumption by source: coal, oil, natural gas, renewables. Total bar heights are readable; individual stack heights require estimation.]
> By what percentage did renewable energy's share of total energy increase from 2015 to 2022?

This requires reading two stacked bar heights (renewable slice in 2015, renewable slice in 2022), dividing each by the total bar height to get share percentages, then computing the percentage-point change. Each step introduces visual estimation error. This is where even frontier models average 75-80% accuracy rather than ~100%.

## DocVQA and related document-understanding benchmarks

- **DocVQA**, question answering over scanned documents.
- **InfographicVQA**, harder; complex designed infographics with text + images + icons.
- **TextVQA**, short text within natural images.

These exercise OCR + layout + reasoning together. Models good at pure OCR (good text extraction) but bad at layout reasoning fail; so do the reverse.

## DocVQA concrete examples

**Example 1 (scanned form):**

> [Image: a scanned insurance form with handwritten and printed fields.]
> What is the policy effective date listed on this form?

The model must OCR the date field, which may be handwritten, partially obscured, or in an unusual format. DocVQA's OCR component is mostly solved by frontier models (90%+ accuracy). The harder cases are when the field label is ambiguous ("Effective Date" vs "Issue Date" vs "Start Date" appearing on the same form).

**Example 2 (layout + reasoning):**

> [Image: a multi-column financial statement PDF with tables and footnotes.]
> According to footnote 3, what accounting standard was used for the revenue recognition policy?

The model must: (1) locate footnote 3 visually (it may be at the bottom of the page in small font), (2) read the text correctly, (3) identify the specific accounting standard mentioned. This combines OCR, layout understanding, and semantic understanding of accounting terminology.

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

## Performance summary table

| Benchmark | Frontier score (Apr 2026) | Saturation state | Key failure mode |
|---|---|---|---|
| MMMU | ~80% | Near saturated | Subject-specific knowledge integration |
| MMMU-Pro | ~65% | Active differentiator | Vision-only variants expose text-leakage |
| MathVista | ~75% | Active differentiator | Visual estimation + formula recall |
| ChartQA | ~90% | Near saturated | Multi-step chart calculations |
| DocVQA | ~93% | Near saturated | Ambiguous field labels |
| MMVet | ~70% | Active differentiator | Multi-capability integration |
| Video-MME (long) | ~55% | Hard | Temporal reasoning across long clips |
| OSWorld (agent, visual) | ~38-44% | Very hard | GUI navigation + visual control |

## How vision-language models advanced

**Dual-encoder models (2021): CLIP.** CLIP trained an image encoder and a text encoder jointly so that matching image-text pairs had similar [embeddings](../rag/embeddings/). This enabled zero-shot image classification and visual search. But CLIP could not reason: it could tell you "this image is similar to the text 'a red car'" but could not answer "what color is the car in this image?" CLIP was a retrieval model, not a reasoning model.

**Cross-attention vision-language models (2022): Flamingo.** Flamingo (DeepMind, 2022) used cross-attention layers to inject visual features into a pretrained language model. A frozen language model saw the image features as additional context. This enabled few-shot visual QA: show the model three examples of (image, question, answer) and it generalizes to new images. MMMU-class questions were too hard for Flamingo but the architecture was the right direction.

**Instruction-tuned vision models (2023): LLaVA, GPT-4V.** LLaVA (Liu et al., 2023) connected a CLIP image encoder to a Llama language model via a simple projection layer, then instruction-tuned the combination on visual instruction data. This was cheap to produce and competitive with much larger proprietary models. GPT-4V (OpenAI, 2023) was a proprietary version of the same concept at scale, with RLHF applied on top. Both showed large gains on MMMU and MathVista compared to prior models.

**Native multimodal pretraining (2024): Gemini.** Gemini 1.0 was the first large model trained natively on interleaved text, image, audio, and video data from the beginning of pretraining, rather than adapting a text model to vision post-hoc. Native multimodal training produced better visual reasoning because the model's representations were built jointly rather than bridged by a projection layer. MMMU scores crossed 60% with Gemini-class models.

**High-resolution and fine-grained vision (2024-2025).** Diagrams, charts, and technical documents require fine-grained visual parsing: reading small numbers in a chart, distinguishing similar symbols in a circuit diagram, reading handwritten text. Models trained on higher-resolution image crops and fine-tuned on document-specific data improved ChartQA and DocVQA substantially. Resolution is a practical bottleneck: most vision models downsample images to 224x224 pixels, which loses legibility for small text.

**Reasoning mode applied to vision (2025).** The same RL-trained reasoning that improved [math benchmarks](math-benchmarks/) improved visual reasoning on MathVista and MMMU-Pro. The model can now reason: "the graph appears to cross zero at x~2.5; let me verify by extrapolating from the nearby labeled points." This added ~10-20 points on hard multimodal benchmarks. ChartQA and DocVQA (which are closer to retrieval than reasoning) benefited less.

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
