---
title: "Distillation prompts: generating training data from a teacher model"
description: "The actual prompts used in Alpaca, Orca, Orca 2, and Phi to extract training data from teacher models, with principles for writing effective distillation prompts and quality criteria."
parent: model-distillation
tags: [distillation, prompts, synthetic-data, alpaca, orca]
status: draft
created: 2026-05-14
updated: 2026-05-14
---

Distillation from a proprietary teacher means you need training data the teacher generated. Getting good training data is as important as the fine-tuning itself. A student fine-tuned on mediocre teacher outputs learns mediocre behavior. The prompts used to generate that data, and the quality filters applied afterward, determine the ceiling of what the student can learn.

## What a distillation prompt does

A distillation prompt has two components:

1. **A task description**: what kind of output you want the teacher to generate
2. **A quality or style specification**: what properties the output should have (detailed, step-by-step, educational, etc.)

For basic response-based distillation, you might just run user queries through the teacher and collect responses. For explanation tuning (Orca-style), you add a system prompt that instructs the teacher to reason explicitly. For data generation (Alpaca-style), you prompt the teacher to generate new instructions, not just answer existing ones.

## The Alpaca Self-Instruct prompt

Alpaca used the Self-Instruct method: prompt the teacher to generate new instruction-response pairs, given a few seed examples. The key prompt (paraphrased from the Alpaca repository):

```
You are asked to come up with a set of 20 diverse task instructions.
These task instructions will be given to a GPT model and we will
evaluate the GPT model for completing the instructions.

Requirements:
1. Try not to repeat the verb for each instruction, to maximize diversity.
2. The language used should be diverse. For example, combine questions
   with imperative instructions.
3. The type of instructions should be diverse. The list should include
   diverse types of tasks such as open-ended generation, classification,
   editing, and information extraction.
4. A GPT language model should be able to complete the instruction.
   For example, do not ask the assistant to create any visual or audio
   output. For another example, do not ask the assistant to wake you
   up at 5pm or set a reminder because it cannot perform any action.
5. The instructions should be in English.
6. The instructions should be 1 to 2 sentences long. Either an
   imperative sentence or a question is permitted.
7. You should generate an appropriate input to the instruction.
   The input field should contain a specific example provided for
   the instruction. The input should be less than 100 words.
   Not all instructions require input. If the instruction does not
   require additional context or information, leave the input field
   empty.
8. The output should be an appropriate response to the instruction
   and the input. Make sure the output is less than 100 words.

List of 20 tasks:
###
Task 1:
Instruction: <seed instruction 1>
Input: <seed input 1>
Output: <seed output 1>
...
###
Task 21:
```

The model continues from "Task 21:" and generates novel instructions. With 175 seed tasks as starting material and 20 new tasks per call, Alpaca generated 52,002 instruction-response pairs in ~500 API calls.

Why this works: the teacher generalizes from the seed examples to produce novel, diverse instructions. The diversity requirements (don't repeat verbs, include different task types) counteract the model's tendency to cluster around a few instruction templates.

## The Orca explanation-tuning system prompt

Orca's contribution was adding a system prompt to make the teacher explain its reasoning. The full system prompt used in Orca:

```
You are an AI assistant. Provide a detailed answer so the user doesn't
need to search outside to understand the answer. Explain your reasoning
step by step. Think about why each step follows from the previous step.
```

This prompt is prepended to every user instruction before querying GPT-4. The result: instead of a one-sentence answer, the teacher produces a multi-paragraph response with explicit reasoning steps. The student trains on these, and through exposure learns to reason similarly.

The same instruction ("What is the boiling point of water?") produces very different training data with and without this system prompt.

Without the system prompt:

```
The boiling point of water is 100°C (212°F) at sea level.
```

With the Orca system prompt:

```
Water boils when its vapor pressure equals the surrounding atmospheric
pressure. At sea level, standard atmospheric pressure is 101.325 kPa.
Under these conditions, water reaches this vapor pressure at 100°C
(212°F). At higher altitudes, atmospheric pressure is lower, so water
boils at a lower temperature. For example, at 5,000 feet elevation,
water boils at approximately 95°C (203°F). The relationship between
boiling point and pressure follows the Clausius-Clapeyron equation.
```

The second response is substantially more useful training data. The student learns the physics, not just the fact.

## Orca 2 strategy-specific prompts

Orca 2 uses different system prompts for different reasoning strategies, generating separate training data for each.

**Step-by-step strategy prompt:**

```
You are a helpful assistant. When answering questions, think through
the problem step by step before providing your final answer. Show your
work and explain each reasoning step clearly.
```

**Direct answer strategy prompt:**

```
You are a helpful assistant. When the answer can be stated directly
without extended reasoning, provide a concise and accurate response.
Do not add unnecessary explanation for simple factual questions.
```

**Recall-then-generate strategy prompt:**

```
You are a helpful assistant. First recall all relevant knowledge you
have about the topic. Then, using that recalled knowledge, construct
your answer. Separate the recall phase from the generation phase in
your response.
```

At training time, the student sees these prompts as part of the context. At inference, no system prompt is provided. The student learns to detect which type of problem it's facing from the question itself and selects the appropriate strategy internally.

## Phi's "textbook quality" generation prompt

Phi-1 (Microsoft, 2023) used a different approach: instead of generating instruction-response pairs, they generated educational content. The prompt category:

```
Write a self-contained, educational Python programming exercise.
The exercise should:
- Teach one specific concept clearly
- Include a clear problem statement
- Be appropriate for a beginner to intermediate programmer
- Include a worked solution with explanation of why each step works
- Use standard Python library functions where appropriate
- Be solvable in under 30 lines of code
Topic: [specific programming concept, e.g., "list comprehensions",
        "recursive functions", "dictionary operations"]
```

This generates "textbook-style" content rather than short QA pairs. The resulting training data reads like chapters from a programming textbook: concept introduction, example, worked solution, explanation. A model trained on this learns not just to produce code but to teach through code.

Phi-2 and Phi-3 extended the same approach beyond code to general reasoning and language tasks, generating synthetic textbook content across dozens of domains.

## Principles for effective distillation prompts

**1. Specify the format you want the student to learn.** If you want the student to produce structured step-by-step reasoning, tell the teacher to produce that format. The teacher will comply. The student will internalize the format.

**2. Push for diversity explicitly.** Teacher models, when asked repeatedly, cluster toward common response patterns. Alpaca's "don't repeat the verb" rule and "include different task types" requirement counteract this. Without explicit diversity requirements, you end up with 52K similar examples and a student that learned one narrow behavior.

**3. Set the difficulty distribution deliberately.** Easy questions produce easy training data. If you want a student that can handle hard problems, generate hard training data. Orca's progressive setup (ChatGPT on easy examples, GPT-4 on hard ones) allocates the expensive teacher to the hard end of the distribution where it adds the most signal.

**4. Match the teacher to the difficulty.** Calling GPT-4 to generate "what's 2+2?" training data is expensive and produces training data a weaker model could have generated equally well. Reserve frontier models for reasoning-intensive generation.

**5. Filter for quality, not just volume.** 52K high-quality examples (Alpaca) outperformed much larger raw-scraped datasets. Phi's result (1.3B model beating 15B models on coding) demonstrated that data quality can compensate for scale.

**6. Include failure cases deliberately.** A student trained only on correct teacher outputs never sees how to recover from wrong intermediate steps. Generating examples where the teacher catches and corrects an error teaches error correction. Orca 2's multi-strategy approach is partly motivated by this: the student learns to try a different strategy when one isn't working.

## Quality filters applied post-generation

Even with good prompts, generated data needs filtering:

- **Length filtering**: remove very short responses (likely the model refused or gave a placeholder) and unusually long ones (likely runaway generation)
- **Instruction-response relevance**: verify the response actually addresses the instruction using an automated check or a lightweight classifier
- **Deduplication**: with 52K examples, many will be near-duplicates if diversity controls weren't strict enough
- **Toxicity filtering**: teacher outputs can include harmful content even when prompted to be helpful, especially in edge cases
- **Calibration check**: for factual questions, spot-check a random sample of responses for accuracy before committing to the full dataset

Alpaca filtered from an initial batch of ~82K raw examples down to 52K after removing failures, duplicates, and low-quality responses.

## References

- Taori, R. et al. (2023). "Alpaca: A Strong, Replicable Instruction-Following Model." Stanford CRFM.
- Wang, Y. et al. (2022). "Self-Instruct: Aligning Language Models with Self-Generated Instructions." ArXiv 2212.10560.
- Mukherjee, S. et al. (2023). "Orca: Progressive Learning from Complex Explanation Traces of GPT-4." ArXiv 2306.02707.
- Mitra, A. et al. (2023). "Orca 2: Teaching Small Language Models How to Reason." ArXiv 2311.11045.
- Gunasekar, S. et al. (2023). "Textbooks Are All You Need." ArXiv 2306.11644.
- Wei, J. et al. (2022). "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models." NeurIPS 2022.

## Related topics

- `./llm-methods/` -- how this training data is used in SFT and DPO
- `./case-studies/` -- how these prompts performed across major projects
- `../prompt-engineering/` -- prompting principles that apply to data generation too
