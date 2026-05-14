---
title: Model distillation
description: "How to train capable smaller models from larger ones: the theory, LLM-specific methods, distillation prompts, real case studies, and what it all means for who controls AI capability."
category: ai
tags: [distillation, training, llm, efficiency]
status: draft
created: 2026-05-14
updated: 2026-05-14
---

Model distillation is a family of techniques for training a smaller "student" model to reproduce the behavior of a larger "teacher" model. The student doesn't need to see all the raw training data the teacher trained on. It learns from the teacher's outputs, or the teacher's internal representations, or both. The result is a model that is smaller, cheaper to run, and often surprisingly close to the teacher's capability on the tasks that matter.

## Why distillation matters

**Cost**: training a frontier model costs tens of millions of dollars. Fine-tuning a 7B model on teacher outputs costs hundreds. The gap is five orders of magnitude.

**Accessibility**: distillation is what made high-quality open models possible. Alpaca, Vicuna, Orca, Phi, and the DeepSeek-R1-Distill family all depend on distillation from larger models.

**Deployment**: a distilled 7B model can run on a laptop or a single GPU. A frontier 70B+ model cannot. Distillation is what makes capable AI deployable at the edge.

## Quick taxonomy

**Response-based distillation**: The student learns to match the teacher's output probabilities. The only teacher access required is its outputs (API is sufficient). Examples: Alpaca, Vicuna, DeepSeek-R1-Distill.

**Feature-based distillation**: The student learns to match the teacher's intermediate hidden states or attention maps. Requires white-box access to teacher internals. Example: DistilBERT's cosine embedding loss on hidden states.

**Relation-based distillation**: The student learns the pairwise similarity structure between samples in the teacher's representation space. Requires white-box access. Used in research settings, less common for LLMs.

## The ceiling effect

One important constraint: a student trained only on teacher outputs cannot systematically exceed the teacher. It can exceed the teacher on narrow tasks (because distillation focuses training) but not across the board. The student is learning a compressed representation of the teacher's knowledge. What isn't in the teacher isn't in the student.

## This series

- [Theory and math](./theory/): Hinton 2015, soft targets, temperature scaling, the KL divergence loss, and DistilBERT as the canonical worked example
- [LLM methods](./llm-methods/): how distillation works for large language models -- black-box vs white-box, SFT from outputs, explanation tuning, DPO, and pretraining-time distillation
- [Distillation prompts](./distillation-prompts/): the actual prompts used to generate training data from a teacher model, with examples from Alpaca, Orca, Orca 2, and Phi
- [Case studies](./case-studies/): Alpaca, Vicuna, Orca, Phi, Zephyr, and DeepSeek-R1-Distill -- what each project did, what it cost, and what it proved
- [Implications](./implications/): what distillation means for model originality, first-mover advantage, IP, and who controls AI capability

## Related topics

- [Benchmarks](../benchmarks/): how distilled models are evaluated
- [Harness development](../harness-development/): building the systems that deploy distilled models
- [Coding tool blindspots](../coding-tool-blindspots/): what even well-distilled models still get wrong
