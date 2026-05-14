---
title: "Distillation theory: soft targets, temperature, and the KL divergence loss"
description: "Hinton's 2015 dark knowledge insight, the temperature parameter T, the three-component DistilBERT loss, and why reverse KL outperforms forward KL for autoregressive LLMs."
parent: model-distillation
tags: [distillation, theory, knowledge-distillation, bert]
status: draft
created: 2026-05-14
updated: 2026-05-14
---

The core insight is from Hinton, Vinyals, and Dean (2015): a trained model's output probabilities carry more information than the ground-truth labels. When a network assigns 0.1 probability to "cat" while classifying a "dog," that 10:1 ratio encodes a learned similarity structure -- cats and dogs look more alike than either does to a car. This is what Hinton called "dark knowledge." Distillation is the method of transferring it.

## The problem with hard labels

Hard labels are one-hot vectors: [1, 0, 0] for class 0. They contain exactly one bit of information per example. The model either learns the right class or it doesn't. Hard labels throw away everything the teacher knows about which wrong answers are "less wrong."

Concrete example: an image classifier trained on CIFAR-10. The hard label for a "dog" image is always [0,0,0,1,0,0,0,0,0,0]. It says nothing about whether the image is more similar to a cat than to a truck. The teacher's soft output might be [0.0, 0.0, 0.12, 0.85, 0.02, 0.0, 0.0, 0.01, 0.0, 0.0] -- that 0.12 on "cat" is dark knowledge. It tells the student that cats and dogs are related in this representation space. Training on hard labels discards it entirely.

## Temperature scaling

```
p_i = exp(z_i / T) / sum_j exp(z_j / T)
```

Where z_i are the raw logits (pre-softmax scores) and T is the temperature.

- At T=1: standard softmax. The distribution is peaked toward the highest logit.
- At T>1: softer distribution. Probability mass spreads to lower-scoring classes.
- At T approaching infinity: nearly uniform distribution.

Concrete example with logits [3.0, 1.0, -1.0]:

| T | Class 0 | Class 1 | Class 2 | What changes |
|---|---------|---------|---------|--------------|
| 1 | 0.867 | 0.117 | 0.016 | Class 1 and 2 nearly invisible |
| 2 | 0.665 | 0.245 | 0.090 | Class 1 meaningful, Class 2 small |
| 4 | 0.507 | 0.307 | 0.186 | All three classes visible |
| 8 | 0.419 | 0.327 | 0.254 | Distribution nearly flat |
| 20 | 0.367 | 0.332 | 0.301 | Almost uniform |

Why T>1 helps: at T=4, the 3:1.6:1 ratio between classes carries information the student can learn from. At T=1, the 54:7:1 ratio means classes 1 and 2 are effectively invisible in the gradient signal.

Both teacher and student use the same T during training. At inference, T=1 (standard softmax).

## The Hinton loss function

```
L = (1 - alpha) * L_CE(y_hard, sigma(z_S))
  + alpha * T^2 * KL(sigma(z_T/T) || sigma(z_S/T))
```

Where:
- **L_CE**: standard cross-entropy against the hard labels
- **sigma**: softmax function
- **z_T, z_S**: teacher and student logits
- **T**: temperature (same for both)
- **alpha**: weight between the two terms (typically 0.7-0.9 in favor of soft targets)

**The T^2 factor**: without it, increasing T reduces the gradient magnitude from the soft-target term by a factor of 1/T^2 (a property of how gradients flow through temperature-scaled softmax). Multiplying by T^2 cancels this out. You can freely tune T without worrying about retuning alpha.

Practical note from the paper: when both terms are used, the soft-target term almost always dominates. The hard-target term functions as a regularizer, keeping the student grounded in ground truth while learning from the teacher's relational structure.

**MNIST result**: a student trained with distillation from an ensemble achieved 67 test errors, versus 146 for a student trained directly. Same student architecture; the dark knowledge transferred from the ensemble provided the extra signal.

A striking experiment: the teacher ensemble was trained with no "3" digit examples at all. The distilled student still achieved only 206 errors on "3" digits. The teacher generalized well from related digits (8, 0), and that generalization transferred to the student through soft targets -- even though neither model saw a "3" during training.

## Feature-based distillation: DistilBERT

DistilBERT (Sanh et al. 2019, HuggingFace) is the canonical feature-based distillation example for transformers.

- **BERT-base**: 110M parameters, 12 layers
- **DistilBERT**: 66M parameters, 6 layers (40% smaller, 60% faster inference)
- **GLUE average**: 97% of BERT-base performance retained

**Initialization trick**: DistilBERT initializes from BERT's weights, taking every other layer (layers 0, 2, 4, 6, 8, 10). This gives the student a warm start with teacher representations rather than random initialization.

Three-component loss:

```
L = alpha * L_distill + beta * L_MLM + gamma * L_cos
```

**L_distill**: KL divergence between teacher and student's masked LM output probabilities at T=2. Same as Hinton -- soft targets on the vocabulary distribution over masked tokens.

**L_MLM**: Standard masked language modeling cross-entropy. Keeps the student grounded in predicting actual tokens correctly, not just matching the teacher's probability distribution.

**L_cos**: `1 - cosine_similarity(h_teacher, h_student)` applied to hidden state vectors after each layer. Pushes the student's internal representations to align directionally with the teacher's, even when dimensions differ. This is the feature-based component.

The cosine loss is what makes DistilBERT feature-based rather than purely response-based. Without it, the student might match the teacher's outputs while having completely different internal representations -- which is fine for the benchmark but worse for downstream fine-tuning and generalization.

Loss flow diagram:

```
Input tokens
    |
[Teacher BERT] --> final logits --> L_distill (KL, T=2)
    |
    +--> hidden states --> L_cos (cosine alignment)

[Student DistilBERT] --> final logits --> L_distill
    |                                 --> L_MLM (hard labels)
    +--> hidden states --> L_cos
```

## Response-based vs feature-based vs relation-based

| Type | What's transferred | Teacher access needed | Example |
|---|---|---|---|
| Response-based | Output probabilities | Outputs only (API OK) | Hinton 2015, Alpaca, Vicuna |
| Feature-based | Hidden states, attention maps | White-box (internals) | DistilBERT, FitNets, PKD |
| Relation-based | Pairwise similarity structure | White-box (internals) | RKD (Park et al. 2019) |

For LLMs from proprietary teachers (GPT-4, Claude, Gemini): response-based is the only option. You get the outputs via API; you don't get the internals. Feature-based distillation is only available when you have model weights.

## MiniLLM: why reverse KL matters for LLMs

Standard distillation uses forward KL: `KL(p_teacher || p_student)`. This is "mode-covering" -- the student must put probability mass everywhere the teacher does, including low-probability regions. For LLMs, this causes hedging: the student tries to cover all the teacher's plausible continuations and produces incoherent averaged outputs.

MiniLLM (Gu et al., ICLR 2024) proposes reverse KL: `KL(p_student || p_teacher)`. This is "mode-seeking" -- the student only needs to match the teacher's highest-probability modes. It produces sharper, more focused outputs. For tasks where the teacher's most likely answer is the right one, reverse KL produces a better student.

Tradeoff: forward KL preserves calibration (the student covers all possibilities the teacher considers). Reverse KL produces more confident outputs that can miss tail distributions. For most deployment contexts (where you want the best single answer) reverse KL wins.

## References

- Hinton, G., Vinyals, O., Dean, J. (2015). "Distilling the Knowledge in a Neural Network." ArXiv 1503.02531.
- Sanh, V. et al. (2019). "DistilBERT, a distilled version of BERT: smaller, faster, cheaper and lighter." ArXiv 1910.01108.
- Romero, A. et al. (2015). "FitNets: Hints for thin deep nets." ArXiv 1412.6550.
- Gou, J. et al. (2021). "Knowledge Distillation: A Survey." IJCV. ArXiv 2006.05525.
- Gu, Y. et al. (2024). "MiniLLM: Knowledge Distillation of Large Language Models." ICLR 2024. ArXiv 2306.08543.
- Park, W. et al. (2019). "Relational Knowledge Distillation." CVPR 2019.

## Related topics

- [LLM methods](./llm-methods/): how these principles apply to LLM-specific training methods
- [Case studies](./case-studies/): DistilBERT and the LLM case studies in practice
- [Benchmarks](../benchmarks/): how distilled models are measured
