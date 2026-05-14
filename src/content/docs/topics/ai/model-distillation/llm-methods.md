---
title: "LLM distillation methods: SFT, explanation tuning, DPO, and pretraining-time distillation"
description: "How distillation works for large language models -- black-box SFT from teacher outputs, Orca-style explanation tuning, Zephyr-style DPO alignment distillation, and Gemma 2's pretraining-time approach."
parent: model-distillation
tags: [distillation, llm, sft, dpo, fine-tuning]
status: draft
created: 2026-05-14
updated: 2026-05-14
---

Distilling a large language model into a smaller one has a different shape than classic knowledge distillation. You rarely have access to the teacher's logits. GPT-4, Claude, and Gemini are API-only. You work with outputs: text completions, probability distributions over the next token (when available), or simply the teacher's answers. This constraint defines the LLM distillation landscape.

## Black-box vs white-box access

**Black-box**: You can query the teacher model via API. You get text outputs. You may also get token log-probabilities (OpenAI's API offers this for some models). You cannot access internal layers or the full logit distribution.

**White-box**: You have the teacher's weights. You can extract hidden states, attention maps, and the full vocabulary distribution over every token. Available for open-weight models (LLaMA, Mistral, Qwen, Gemma).

Most LLM distillation in practice is black-box. The most capable teachers (GPT-4, Claude Opus) are closed. Almost everything in the Alpaca/Vicuna/Orca lineage is black-box.

## Method 1: SFT from teacher outputs (response-based)

The simplest approach: generate a large dataset of (instruction, response) pairs using the teacher, then fine-tune the student on that dataset using standard supervised fine-tuning (SFT).

Process:

1. Write or collect a set of seed instructions (diverse tasks you want the student to handle)
2. Query the teacher with those instructions and collect responses
3. Fine-tune the student model on (instruction, response) pairs
4. The student learns to produce outputs that look like the teacher's

What's transferred: the teacher's output style, its knowledge retrieval patterns, its formatting habits, and its broad instruction-following behavior. What's NOT transferred: the teacher's internal reasoning process, its uncertainty calibration, or any capability the teacher has but doesn't express in short outputs.

The Alpaca pattern is the archetype: 52K instruction-response pairs from text-davinci-003, fine-tuned onto LLaMA-7B for under $100. The student can follow instructions in ways the base LLaMA-7B cannot, because it has seen thousands of examples of what a capable model does when given an instruction.

## Method 2: Explanation tuning (Orca)

The key insight from Orca (Mukherjee et al. 2023): SFT from outputs teaches the student what to say, not how to reason. When GPT-4 solves a hard problem, it produces a reasoning chain before its final answer. That reasoning chain is also teachable.

Explanation tuning works by prompting the teacher with a system message that instructs it to explain its reasoning step by step. The full response (reasoning + answer) becomes the training target.

Example teacher system prompt:

```
You are an AI assistant. Provide a detailed answer so the user doesn't need to search elsewhere. Explain your reasoning step by step. Think about why each step follows from the previous.
```

The student trains on (instruction + system prompt) -> (reasoning trace + answer). At inference, no system prompt is needed: the student has learned to reason because it was trained on reasoning outputs.

The "teacher assistant" setup: instead of jumping from a small student directly to GPT-4's reasoning style, Orca first distills from ChatGPT (GPT-3.5) on the full FLAN-v2 task collection (~5M examples) for broad coverage, then from GPT-4 on a harder subset with reasoning traces. The intermediate distillation step bridges the capability gap.

## Method 3: Strategy-selective reasoning (Orca 2)

Orca 2 (Mitra et al., November 2023) went further: not only teaching reasoning, but teaching the student when to reason and which reasoning strategy to use.

Small models default to one strategy regardless of the problem. They produce long chains of thought for simple factual questions, which wastes compute and introduces errors. Orca 2 identifies five strategies and teaches selection:

| Strategy | When to use |
|---|---|
| Step-by-step reasoning | Multi-step deductive problems |
| Direct answering | Simple factual recall |
| Recall-then-generate | Need to retrieve knowledge first |
| Extraction | Answer is a span of the given context |
| Recall-reason-generate | Requires both retrieval and reasoning |

The training mechanism: GPT-4 is given a strategy-specific system prompt during training data generation ("Use step-by-step reasoning for this problem"). The student trains on the resulting response. At test time, no system prompt is given. The student has learned to detect which type of problem it's facing and select the appropriate strategy automatically.

This is "system prompt erasure": the teacher's guidance is internal to the training signal. The student internalizes the selection skill.

## Method 4: DPO alignment distillation (Zephyr)

Zephyr (Tunstall et al., October 2023, HuggingFace) showed that alignment -- the RLHF-trained helpfulness and harmlessness -- can also be distilled from a teacher.

Standard RLHF requires human preference labels: annotators compare model outputs and say which is better. This is expensive. Zephyr's approach:

1. **dSFT (distillation SFT)**: fine-tune on GPT-4 outputs (same as the Alpaca pattern)
2. **dDPO (distillation DPO)**: use GPT-4 to generate preference pairs. For each prompt, GPT-4 produces a "chosen" response (full effort, explicit reasoning) and a "rejected" response (minimal, lower quality). Apply Direct Preference Optimization using these pairs instead of human labels.

DPO turns preference pairs into a classification loss: train the student to prefer the "chosen" response over the "rejected" one, relative to the base model. No reward model needed.

Result: Zephyr-7B (based on Mistral-7B) achieved 7.34 on MT-Bench, competitive with 70B models, with no human preference labels at any stage. Pure distillation of both capability and alignment.

## Method 5: Pretraining-time distillation (Gemma 2)

All the above methods apply distillation at fine-tuning time: take a pretrained student base, fine-tune it on teacher outputs. Gemma 2 (Google DeepMind, August 2024) applied distillation during pretraining itself.

The 2B and 9B Gemma 2 models were trained with a distillation loss against the 27B Gemma 2 at every step of pretraining. The student doesn't just fine-tune on the teacher's outputs after the fact. It learns to match the teacher's token predictions throughout its entire training run.

This is more expensive (you need the teacher running at every training step) but more thorough. The student doesn't just learn to imitate finished outputs. It learns to predict the same next tokens the teacher would predict across all of training. Gemma 2-9B outperforms LLaMA-3-8B and Mistral-7B, and the improvement is substantially attributed to the distillation signal.

## The ceiling effect

A student trained purely on teacher outputs cannot systematically exceed the teacher. The student is learning a compressed representation of the teacher's knowledge. For any capability the teacher doesn't express in its outputs, the student has no signal.

In practice: students often match the teacher on narrow tasks the distillation focused on, and lag substantially on tasks underrepresented in the training data. DeepSeek-R1-Distill-Qwen-7B (fine-tuned on R1's reasoning traces) scores 92.8% on MATH-500, above GPT-4o (76.6%), because R1's reasoning traces are dense with exactly the reasoning steps needed for competition math. On other tasks, the 7B model's raw capacity limits it below the teacher.

One implication: you can distill a capability that exceeds where it "should" be by weight class, by concentrating the training distribution. But you cannot distill capability the teacher doesn't have.

## Speculative decoding: distillation at inference time

Speculative decoding is a related technique that uses a smaller draft model to accelerate inference from a larger target model, not to replace it.

Process:

1. The small draft model generates k tokens quickly
2. The large target model evaluates all k tokens in parallel
3. Tokens the target accepts are kept. At the first rejection, the target model's distribution is sampled for that position, and the draft model restarts.

If the draft model is well-aligned with the target (a distilled version works well), the acceptance rate is high and you get near-target-quality output at near-draft-model speed. This is one motivation for training distilled small models even when deploying the full large model: the small model becomes the accelerator.

## References

- Mukherjee, S. et al. (2023). "Orca: Progressive Learning from Complex Explanation Traces of GPT-4." ArXiv 2306.02707.
- Mitra, A. et al. (2023). "Orca 2: Teaching Small Language Models How to Reason." ArXiv 2311.11045.
- Tunstall, L. et al. (2023). "Zephyr: Direct Distillation of LM Alignment." ArXiv 2310.16944.
- Gemma Team (2024). "Gemma 2: Improving Open Language Models at a Practical Size." ArXiv 2408.00118.
- Rafailov, R. et al. (2023). "Direct Preference Optimization." NeurIPS 2023. ArXiv 2305.18290.
- Leviathan, Y. et al. (2023). "Fast Inference from Transformers via Speculative Decoding." ICML 2023.

## Related topics

- `./theory/` -- the KL divergence loss and temperature scaling behind these methods
- `./distillation-prompts/` -- the actual prompts used for Alpaca, Orca, and Orca 2
- `./case-studies/` -- how these methods performed in practice
