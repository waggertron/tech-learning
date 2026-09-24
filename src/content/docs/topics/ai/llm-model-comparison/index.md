---
title: "LLM model comparison: releases, openness, and local memory"
description: "Compare 379 major language-model releases and sizes by creator, release date, parameter count, license, local memory estimate, and official model link."
category: ai
tags: [llm, models, open-source, hugging-face, inference, quantization]
status: draft
created: 2026-09-24
updated: 2026-09-24
---

A model's name tells you surprisingly little about what you can run. Llama 4 Scout activates 17 billion parameters per token but stores roughly 109 billion. GPT-6 Astra is available through hosted products, but its weights and parameter count are not public. Both facts matter more for local deployment than a leaderboard position.

This catalog compares **379 releases and size variants**, from early generative transformers through releases checked on **September 24, 2026**. Each row links to the creator's model card, repository, paper, or release documentation. Hugging Face links point to the publishing organization's repository, rather than a community repackaging.

## Coverage and reading conventions

The table covers major general-purpose, reasoning, multimodal, and coding families. It includes individual released sizes for the main downloadable families and significant historical releases. Base and instruction versions that share a size and release are usually represented by one row. Distinct reasoning and coding releases receive separate rows when they change the comparison.

It is a dated catalog of major releases, not a claim to enumerate every model ever uploaded. Community fine-tunes, merges, duplicate quantizations, embedding-only models, image generators, speech-only models, and every API snapshot are outside its scope. Research and restricted-access releases are labeled. Inclusion of an older model does not mean its hosted endpoint is still available.

**Dates describe the named release**, with preview, paper, API, and weight-release dates distinguished where they differ. A month-only date deliberately carries less precision than a day-level date. Repository creation, paper publication, first preview, and general availability can fall on different dates.

**B means billion parameters.** Counts are approximate published model sizes, not an exact count of every tensor in a download. Where documented, a second number gives the parameters active per token in a mixture-of-experts model. Trillion-scale counts remain in billions for comparison: 1,000B is 1T. Undisclosed counts stay undisclosed rather than repeating estimates from rumors.

The table is grouped by creator, then release date. Search this page for a family such as `Kimi`, `Sol`, `Llama`, or `Qwen3.8`. On narrow screens, scroll the table horizontally to reach the description column.

## Private, open weights, and open source

**Private / proprietary** means the full model weights are not publicly available for local deployment. A public chatbot or API does not make its underlying model open source. “Private” here describes access to the model, not a promise about how a provider handles your prompts.

**Open weights** means you can obtain the trained parameters under the listed terms. Apache 2.0 and MIT are permissive open-source licenses, but a permissively licensed weight file does not by itself establish that the whole AI system meets an open-source definition. The table names the license rather than collapsing everything downloadable into a single “open source” label.

**Open source** is used for the Olmo releases that publish the training pipeline and data along with the model. The [Open Source AI Definition](https://opensource.org/ai/open-source-ai-definition) considers the code and data information needed to modify the system, as well as its parameters. Other rows are not an assessment of compliance with that definition.

Custom licenses matter. Llama community terms, Gemma terms, modified MIT licenses, research licenses, and non-commercial licenses have different conditions. A license on inference code can also differ from the license on the weights. The linked model's license file is the source for those conditions. A family name does not establish the terms for every release.

Hugging Face is both a model-hosting platform and a contributor to model research. It created the SmolLM family and participated in collaborations such as BigScience and BigCode. Hosting Qwen or Llama does not make Hugging Face the creator of those models.

## How the local memory estimates work

The memory column reads **4-bit weight floor / planning budget**, in decimal **GB**. For example, `4 / 7-10` means an idealized 4 GB of packed weights and an illustrative 7-10 GB model-process budget. These are calculated estimates, not measured hardware requirements or guarantees that a particular quantization is available.

For a model with `P` billion stored parameters:

| Weight precision | Idealized weight storage in GB |
| --- | --- |
| 32-bit | `4 × P` |
| 16-bit, FP16 or BF16 | `2 × P` |
| 8-bit | `P` |
| 4-bit | `0.5 × P` |

The table's working budget is `ceil(0.6 × P + 2)` to `ceil(0.75 × P + 4)` GB. This is a uniform planning heuristic for **one inference stream, a short text context of roughly 2K-4K tokens, mostly 4-bit resident weights, and an efficient supported runtime**. It allows more than packed-weight size for quantization metadata, higher-precision tensors, cache, and working buffers. It is not a vendor benchmark. Some models need more than this range even under those assumptions.

Quantization usually reduces storage by representing weights with fewer bits. It does not necessarily quantize every tensor. Supported hardware, kernels, and model architectures differ by engine. Hugging Face documents these distinctions in its [quantization guide](https://huggingface.co/docs/transformers/quantization/bitsandbytes).

**Context memory is separate from weights.** A transformer often stores a key/value cache for the tokens it has processed. A longer prompt, more generated tokens, or more simultaneous requests can substantially increase memory. Sliding-window attention, latent attention, state-space layers, cache quantization, and offloading change the calculation. The [cache documentation](https://huggingface.co/docs/transformers/kv_cache) explains why parameter count alone cannot predict it.

For ordinary full-attention transformer layers, a useful cache estimate in bytes is `2 × layers × tokens × KV heads × head dimension × bytes per element × batch size`. The factor of two accounts for keys and values. This formula does not directly describe every hybrid or latent-attention model in the table.

**GPU VRAM and system RAM are different pools.** A model kept entirely on a GPU needs its resident weights and working allocations in VRAM. CPU inference uses system RAM. Unified-memory machines share a pool with the operating system and other applications. CPU/GPU offloading can distribute allocations, but simply adding the two capacities does not prove a configuration will work or run quickly. Reserve additional host memory for the operating system, loading, and other software.

**MoE reduces active computation, not automatically resident weight storage.** The default estimates include all experts. Expert offloading can lower GPU residency, at the cost of memory transfers and a different system-RAM requirement. A 1T model with 32B active parameters is not a 32B download.

Multimodal encoders, per-layer embedding tables, speculative decoding models, and conditional-memory modules can add storage beyond a headline count. Explicit `+` entries identify known exclusions or architecture-specific conditions. The same caution applies to rounded size labels elsewhere. Long-context or multimodal operation needs a model-specific measurement. Training and fine-tuning memory are outside these inference estimates.

For scale, a nominal 8B model gives `4 / 7-10` GB, a 70B model gives `35 / 44-57` GB, and a 1T model gives `500 / 602-754` GB. These examples explain the arithmetic, not shopping recommendations. Before choosing hardware, check the exact checkpoint size, supported quantization, engine, intended context length, and measured peak allocation.

## Large model comparison table

Every model name is a link. **Local GB** uses the weight-floor / planning-budget convention above. For proprietary models, local execution is unavailable regardless of how much memory a machine has. “Not established” means the public evidence checked here does not support a local deployment claim.

| Model and source | Creator | Release date | Parameters, total / active | Access and license | Local GB, Q4 floor / budget | Description |
| --- | --- | --- | --- | --- | --- | --- |
| [Yi 34B](https://huggingface.co/01-ai/Yi-34B) | 01.AI | 2023-11 | 34B | Open weights: Apache 2.0 | 17 / 23-30 | Early bilingual English/Chinese dense model. |
| [Yi 6B](https://huggingface.co/01-ai/Yi-6B) | 01.AI | 2023-11 | 6B | Open weights: Apache 2.0 | 3 / 6-9 | Early bilingual English/Chinese dense model. |
| [Yi-1.5 34B](https://huggingface.co/01-ai/Yi-1.5-34B-Chat) | 01.AI | 2024-05 | 34B | Open weights: Apache 2.0 | 17 / 23-30 | Updated Yi model with expanded coding and instruction training. |
| [Yi-1.5 6B](https://huggingface.co/01-ai/Yi-1.5-6B-Chat) | 01.AI | 2024-05 | 6B | Open weights: Apache 2.0 | 3 / 6-9 | Updated Yi model with expanded coding and instruction training. |
| [Yi-1.5 9B](https://huggingface.co/01-ai/Yi-1.5-9B-Chat) | 01.AI | 2024-05 | 9B | Open weights: Apache 2.0 | 4.5 / 8-11 | Updated Yi model with expanded coding and instruction training. |
| [OLMo 7B](https://huggingface.co/allenai/OLMo-7B) | Ai2 | 2024-02 | 7B | Open source: Apache 2.0 | 3.5 / 7-10 | Open research family publishing weights, training data, code, and intermediate artifacts. |
| [OLMo 2 13B](https://huggingface.co/allenai/OLMo-2-1124-13B) | Ai2 | 2024-11 | 13B | Open source: Apache 2.0 | 6.5 / 10-14 | Open research family publishing weights, training data, code, and intermediate artifacts. |
| [OLMo 2 7B](https://huggingface.co/allenai/OLMo-2-1124-7B) | Ai2 | 2024-11 | 7B | Open source: Apache 2.0 | 3.5 / 7-10 | Open research family publishing weights, training data, code, and intermediate artifacts. |
| [OLMo 2 32B](https://huggingface.co/allenai/OLMo-2-0325-32B) | Ai2 | 2025-03 | 32B | Open source: Apache 2.0 | 16 / 22-28 | Open research family publishing weights, training data, code, and intermediate artifacts. |
| [Olmo 3 7B](https://huggingface.co/allenai/Olmo-3-7B-Instruct) | Ai2 | 2025-11-20 | 7B | Open source: Apache 2.0 | 3.5 / 7-10 | Open research family publishing weights, training data, code, and intermediate artifacts. |
| [Olmo 3 Think 32B](https://huggingface.co/allenai/Olmo-3-32B-Think) | Ai2 | 2025-11-20 | 32B | Open source: Apache 2.0 | 16 / 22-28 | Open research family publishing weights, training data, code, and intermediate artifacts. |
| [Olmo 3.1 Think 32B](https://huggingface.co/allenai/Olmo-3.1-32B-Think) | Ai2 | 2025-12 | 32B | Open source: Apache 2.0 | 16 / 22-28 | Open research family publishing weights, training data, code, and intermediate artifacts. |
| [Jamba v0.1](https://huggingface.co/ai21labs/Jamba-v0.1) | AI21 Labs | 2024-03 | 52B / 12B active | Open weights: Apache 2.0 | 26 / 34-43 | Hybrid Mamba/Transformer MoE for long-context text. |
| [Jamba 1.5 Large](https://huggingface.co/ai21labs/AI21-Jamba-1.5-Large) | AI21 Labs | 2024-08-22 | 398B / 94B active | Open weights: Jamba license | 199 / 241-303 | Hybrid Mamba/Transformer MoE for long-context text. |
| [Jamba 1.5 Mini](https://huggingface.co/ai21labs/AI21-Jamba-1.5-Mini) | AI21 Labs | 2024-08-22 | 52B / 12B active | Open weights: Jamba license | 26 / 34-43 | Hybrid Mamba/Transformer MoE for long-context text. |
| [Qwen 7B](https://huggingface.co/Qwen/Qwen-7B) | Alibaba | 2023-08 | 7B | Open weights: Tongyi Qianwen | 3.5 / 7-10 | Original bilingual Qwen family, with sizes released in stages. |
| [Qwen 14B](https://huggingface.co/Qwen/Qwen-14B) | Alibaba | 2023-09 | 14B | Open weights: Tongyi Qianwen | 7 / 11-15 | Original bilingual Qwen family, with sizes released in stages. |
| [Qwen 1.8B](https://huggingface.co/Qwen/Qwen-1_8B) | Alibaba | 2023-11 | 1.8B | Open weights: Tongyi Qianwen | 0.9 / 4-6 | Original bilingual Qwen family, with sizes released in stages. |
| [Qwen 72B](https://huggingface.co/Qwen/Qwen-72B) | Alibaba | 2023-11 | 72B | Open weights: Tongyi Qianwen | 36 / 46-58 | Original bilingual Qwen family, with sizes released in stages. |
| [Qwen1.5 0.5B](https://huggingface.co/Qwen/Qwen1.5-0.5B) | Alibaba | 2024-02 | 0.5B | Open weights: Tongyi Qianwen research | 0.25 / 3-5 | Expanded dense Qwen family, with sizes released in stages. |
| [Qwen1.5 1.8B](https://huggingface.co/Qwen/Qwen1.5-1.8B) | Alibaba | 2024-02 | 1.8B | Open weights: Tongyi Qianwen research | 0.9 / 4-6 | Expanded dense Qwen family, with sizes released in stages. |
| [Qwen1.5 14B](https://huggingface.co/Qwen/Qwen1.5-14B) | Alibaba | 2024-02 | 14B | Open weights: Tongyi Qianwen | 7 / 11-15 | Expanded dense Qwen family, with sizes released in stages. |
| [Qwen1.5 4B](https://huggingface.co/Qwen/Qwen1.5-4B) | Alibaba | 2024-02 | 4B | Open weights: Tongyi Qianwen research | 2 / 5-7 | Expanded dense Qwen family, with sizes released in stages. |
| [Qwen1.5 72B](https://huggingface.co/Qwen/Qwen1.5-72B) | Alibaba | 2024-02 | 72B | Open weights: Tongyi Qianwen | 36 / 46-58 | Expanded dense Qwen family, with sizes released in stages. |
| [Qwen1.5 7B](https://huggingface.co/Qwen/Qwen1.5-7B) | Alibaba | 2024-02 | 7B | Open weights: Tongyi Qianwen | 3.5 / 7-10 | Expanded dense Qwen family, with sizes released in stages. |
| [Qwen1.5 110B](https://huggingface.co/Qwen/Qwen1.5-110B) | Alibaba | 2024-04 | 110B | Open weights: Tongyi Qianwen | 55 / 68-87 | Expanded dense Qwen family, with sizes released in stages. |
| [Qwen1.5 32B](https://huggingface.co/Qwen/Qwen1.5-32B) | Alibaba | 2024-04 | 32B | Open weights: Tongyi Qianwen research | 16 / 22-28 | Expanded dense Qwen family, with sizes released in stages. |
| [Qwen2 0.5B](https://huggingface.co/Qwen/Qwen2-0.5B) | Alibaba | 2024-06-07 | 0.5B | Open weights: Apache 2.0 | 0.25 / 3-5 | Second-generation multilingual Qwen dense model. |
| [Qwen2 1.5B](https://huggingface.co/Qwen/Qwen2-1.5B) | Alibaba | 2024-06-07 | 1.5B | Open weights: Apache 2.0 | 0.75 / 3-6 | Second-generation multilingual Qwen dense model. |
| [Qwen2 57B-A14B](https://huggingface.co/Qwen/Qwen2-57B-A14B) | Alibaba | 2024-06-07 | 57B / 14B active | Open weights: Apache 2.0 | 28.5 / 37-47 | Sparse MoE member of the Qwen2 family. |
| [Qwen2 72B](https://huggingface.co/Qwen/Qwen2-72B) | Alibaba | 2024-06-07 | 72B | Open weights: Qwen license | 36 / 46-58 | Largest dense Qwen2 model. |
| [Qwen2 7B](https://huggingface.co/Qwen/Qwen2-7B) | Alibaba | 2024-06-07 | 7B | Open weights: Apache 2.0 | 3.5 / 7-10 | Second-generation multilingual Qwen dense model. |
| [Qwen2.5-Coder 1.5B](https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct) | Alibaba | 2024-09 | 1.5B | Open weights: Apache 2.0 | 0.75 / 3-6 | Code-specialized Qwen2.5 family, released in stages. |
| [Qwen2.5-Coder 7B](https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct) | Alibaba | 2024-09 | 7B | Open weights: Apache 2.0 | 3.5 / 7-10 | Code-specialized Qwen2.5 family, released in stages. |
| [Qwen2.5 0.5B](https://huggingface.co/Qwen/Qwen2.5-0.5B) | Alibaba | 2024-09-19 | 0.5B | Open weights: Apache 2.0 | 0.25 / 3-5 | Qwen2.5 dense model for multilingual text, coding, and structured outputs. |
| [Qwen2.5 1.5B](https://huggingface.co/Qwen/Qwen2.5-1.5B) | Alibaba | 2024-09-19 | 1.5B | Open weights: Apache 2.0 | 0.75 / 3-6 | Qwen2.5 dense model for multilingual text, coding, and structured outputs. |
| [Qwen2.5 14B](https://huggingface.co/Qwen/Qwen2.5-14B) | Alibaba | 2024-09-19 | 14B | Open weights: Apache 2.0 | 7 / 11-15 | Qwen2.5 dense model for multilingual text, coding, and structured outputs. |
| [Qwen2.5 32B](https://huggingface.co/Qwen/Qwen2.5-32B) | Alibaba | 2024-09-19 | 32B | Open weights: Apache 2.0 | 16 / 22-28 | Qwen2.5 dense model for multilingual text, coding, and structured outputs. |
| [Qwen2.5 3B](https://huggingface.co/Qwen/Qwen2.5-3B) | Alibaba | 2024-09-19 | 3B | Open weights: Qwen research | 1.5 / 4-7 | Qwen2.5 dense model for multilingual text, coding, and structured outputs. |
| [Qwen2.5 72B](https://huggingface.co/Qwen/Qwen2.5-72B) | Alibaba | 2024-09-19 | 72B | Open weights: Qwen license | 36 / 46-58 | Qwen2.5 dense model for multilingual text, coding, and structured outputs. |
| [Qwen2.5 7B](https://huggingface.co/Qwen/Qwen2.5-7B) | Alibaba | 2024-09-19 | 7B | Open weights: Apache 2.0 | 3.5 / 7-10 | Qwen2.5 dense model for multilingual text, coding, and structured outputs. |
| [Qwen2.5-Coder 0.5B](https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct) | Alibaba | 2024-11 | 0.5B | Open weights: Apache 2.0 | 0.25 / 3-5 | Code-specialized Qwen2.5 family, released in stages. |
| [Qwen2.5-Coder 14B](https://huggingface.co/Qwen/Qwen2.5-Coder-14B-Instruct) | Alibaba | 2024-11 | 14B | Open weights: Apache 2.0 | 7 / 11-15 | Code-specialized Qwen2.5 family, released in stages. |
| [Qwen2.5-Coder 32B](https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct) | Alibaba | 2024-11 | 32B | Open weights: Apache 2.0 | 16 / 22-28 | Code-specialized Qwen2.5 family, released in stages. |
| [Qwen2.5-Coder 3B](https://huggingface.co/Qwen/Qwen2.5-Coder-3B-Instruct) | Alibaba | 2024-11 | 3B | Open weights: Qwen research | 1.5 / 4-7 | Code-specialized Qwen2.5 family, released in stages. |
| [Qwen2.5-VL 3B](https://huggingface.co/Qwen/Qwen2.5-VL-3B-Instruct) | Alibaba | 2025-01 | 3B | Open weights: Apache 2.0 | 1.5 / 4-7 | Visual understanding model for images, documents, and video. |
| [Qwen2.5-VL 72B](https://huggingface.co/Qwen/Qwen2.5-VL-72B-Instruct) | Alibaba | 2025-01 | 72B | Open weights: Qwen license | 36 / 46-58 | Visual understanding model for images, documents, and video. |
| [Qwen2.5-VL 7B](https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct) | Alibaba | 2025-01 | 7B | Open weights: Apache 2.0 | 3.5 / 7-10 | Visual understanding model for images, documents, and video. |
| [Qwen2.5-VL 32B](https://huggingface.co/Qwen/Qwen2.5-VL-32B-Instruct) | Alibaba | 2025-03 | 32B | Open weights: Apache 2.0 | 16 / 22-28 | Visual understanding model for images, documents, and video. |
| [Qwen3 0.6B](https://huggingface.co/Qwen/Qwen3-0.6B) | Alibaba | 2025-04-29 | 0.6B | Open weights: Apache 2.0 | 0.3 / 3-5 | Dense Qwen3 model supporting thinking and non-thinking modes. |
| [Qwen3 1.7B](https://huggingface.co/Qwen/Qwen3-1.7B) | Alibaba | 2025-04-29 | 1.7B | Open weights: Apache 2.0 | 0.85 / 4-6 | Dense Qwen3 model supporting thinking and non-thinking modes. |
| [Qwen3 14B](https://huggingface.co/Qwen/Qwen3-14B) | Alibaba | 2025-04-29 | 14B | Open weights: Apache 2.0 | 7 / 11-15 | Dense Qwen3 model supporting thinking and non-thinking modes. |
| [Qwen3 235B-A22B](https://huggingface.co/Qwen/Qwen3-235B-A22B) | Alibaba | 2025-04-29 | 235B / 22B active | Open weights: Apache 2.0 | 117.5 / 143-181 | Sparse Qwen3 MoE supporting thinking and non-thinking modes. |
| [Qwen3 30B-A3B](https://huggingface.co/Qwen/Qwen3-30B-A3B) | Alibaba | 2025-04-29 | 30B / 3B active | Open weights: Apache 2.0 | 15 / 20-27 | Sparse Qwen3 MoE supporting thinking and non-thinking modes. |
| [Qwen3 32B](https://huggingface.co/Qwen/Qwen3-32B) | Alibaba | 2025-04-29 | 32B | Open weights: Apache 2.0 | 16 / 22-28 | Dense Qwen3 model supporting thinking and non-thinking modes. |
| [Qwen3 4B](https://huggingface.co/Qwen/Qwen3-4B) | Alibaba | 2025-04-29 | 4B | Open weights: Apache 2.0 | 2 / 5-7 | Dense Qwen3 model supporting thinking and non-thinking modes. |
| [Qwen3 8B](https://huggingface.co/Qwen/Qwen3-8B) | Alibaba | 2025-04-29 | 8B | Open weights: Apache 2.0 | 4 / 7-10 | Dense Qwen3 model supporting thinking and non-thinking modes. |
| [Qwen3-Coder 30B-A3B](https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct) | Alibaba | 2025-07 | 30B / 3B active | Open weights: Apache 2.0 | 15 / 20-27 | Smaller coding MoE for more accessible local deployment. |
| [Qwen3-Coder 480B-A35B](https://huggingface.co/Qwen/Qwen3-Coder-480B-A35B-Instruct) | Alibaba | 2025-07 | 480B / 35B active | Open weights: Apache 2.0 | 240 / 290-364 | Large coding MoE aimed at software agents. |
| [Qwen3-VL 235B-A22B](https://huggingface.co/Qwen/Qwen3-VL-235B-A22B-Instruct) | Alibaba | 2025-09 | 235B / 22B active | Open weights: Apache 2.0 | 117.5 / 143-181 | MoE Qwen3 vision-language model. |
| [Qwen3-Next 80B-A3B](https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct) | Alibaba | 2025-09-11 | 80B / 3B active | Open weights: Apache 2.0 | 40 / 50-64 | Hybrid-attention, highly sparse MoE. |
| [Qwen3-VL 2B](https://huggingface.co/Qwen/Qwen3-VL-2B-Instruct) | Alibaba | 2025-10 | 2B | Open weights: Apache 2.0 | 1 / 4-6 | Dense Qwen3 vision-language model, including document and video understanding. |
| [Qwen3-VL 30B-A3B](https://huggingface.co/Qwen/Qwen3-VL-30B-A3B-Instruct) | Alibaba | 2025-10 | 30B / 3B active | Open weights: Apache 2.0 | 15 / 20-27 | MoE Qwen3 vision-language model. |
| [Qwen3-VL 32B](https://huggingface.co/Qwen/Qwen3-VL-32B-Instruct) | Alibaba | 2025-10 | 32B | Open weights: Apache 2.0 | 16 / 22-28 | Dense Qwen3 vision-language model, including document and video understanding. |
| [Qwen3-VL 4B](https://huggingface.co/Qwen/Qwen3-VL-4B-Instruct) | Alibaba | 2025-10 | 4B | Open weights: Apache 2.0 | 2 / 5-7 | Dense Qwen3 vision-language model, including document and video understanding. |
| [Qwen3-VL 8B](https://huggingface.co/Qwen/Qwen3-VL-8B-Instruct) | Alibaba | 2025-10 | 8B | Open weights: Apache 2.0 | 4 / 7-10 | Dense Qwen3 vision-language model, including document and video understanding. |
| [Qwen3-Coder-Next](https://huggingface.co/Qwen/Qwen3-Coder-Next) | Alibaba | 2026-02 | 80B / 3B active | Open weights: Apache 2.0 | 40 / 50-64 | Coding model based on the Qwen3-Next architecture. |
| [Qwen3.5-397B-A17B](https://huggingface.co/Qwen/Qwen3.5-397B-A17B) | Alibaba | 2026-02-16 | 397B / 17B active | Open weights: Apache 2.0 | 198.5 / 241-302 | Unified vision-language Qwen3.5 model with hybrid attention. |
| [Qwen3.5-122B-A10B](https://huggingface.co/Qwen/Qwen3.5-122B-A10B) | Alibaba | 2026-02-24 | 122B / 10B active | Open weights: Apache 2.0 | 61 / 76-96 | Unified vision-language Qwen3.5 model with hybrid attention. |
| [Qwen3.5-27B](https://huggingface.co/Qwen/Qwen3.5-27B) | Alibaba | 2026-02-24 | 27B | Open weights: Apache 2.0 | 13.5 / 19-25 | Unified vision-language Qwen3.5 model with hybrid attention. |
| [Qwen3.5-35B-A3B](https://huggingface.co/Qwen/Qwen3.5-35B-A3B) | Alibaba | 2026-02-24 | 35B / 3B active | Open weights: Apache 2.0 | 17.5 / 23-31 | Unified vision-language Qwen3.5 model with hybrid attention. |
| [Qwen3.5-0.8B](https://huggingface.co/Qwen/Qwen3.5-0.8B) | Alibaba | 2026-03-02 | 0.8B | Open weights: Apache 2.0 | 0.4 / 3-5 | Unified vision-language Qwen3.5 model with hybrid attention. |
| [Qwen3.5-2B](https://huggingface.co/Qwen/Qwen3.5-2B) | Alibaba | 2026-03-02 | 2B | Open weights: Apache 2.0 | 1 / 4-6 | Unified vision-language Qwen3.5 model with hybrid attention. |
| [Qwen3.5-4B](https://huggingface.co/Qwen/Qwen3.5-4B) | Alibaba | 2026-03-02 | 4B | Open weights: Apache 2.0 | 2 / 5-7 | Unified vision-language Qwen3.5 model with hybrid attention. |
| [Qwen3.5-9B](https://huggingface.co/Qwen/Qwen3.5-9B) | Alibaba | 2026-03-02 | 9B | Open weights: Apache 2.0 | 4.5 / 8-11 | Unified vision-language Qwen3.5 model with hybrid attention. |
| [Qwen3.6-35B-A3B](https://huggingface.co/Qwen/Qwen3.6-35B-A3B) | Alibaba | 2026-04-16 | 35B / 3B active | Open weights: Apache 2.0 | 17.5 / 23-31 | Updated Qwen model emphasizing coding and multimodal reasoning. |
| [Qwen3.6-27B](https://huggingface.co/Qwen/Qwen3.6-27B) | Alibaba | 2026-04-22 | 27B | Open weights: Apache 2.0 | 13.5 / 19-25 | Updated Qwen model emphasizing coding and multimodal reasoning. |
| [Qwen3.8 2.4T-A95B](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B) | Alibaba | 2026-08-12 | 2400B / 95B active | Open weights: Qwen3.8-Max license | 1200 / 1442-1804 | Downloadable Qwen-Max-class MoE. |
| [Qwen3.8 27B](https://huggingface.co/Qwen/Qwen3.8-27B) | Alibaba | 2026-08-14 | 27B | Open weights: Apache 2.0 | 13.5 / 19-25 | Dense multimodal Qwen3.8 model for smaller deployments. |
| [Nova Lite](https://docs.aws.amazon.com/nova/latest/userguide/what-is-nova.html) | Amazon | 2024-12-03 | Undisclosed | Private / proprietary | Not available locally | Low-cost multimodal hosted model. |
| [Nova Micro](https://docs.aws.amazon.com/nova/latest/userguide/what-is-nova.html) | Amazon | 2024-12-03 | Undisclosed | Private / proprietary | Not available locally | Text-only lightweight hosted model. |
| [Nova Pro](https://docs.aws.amazon.com/nova/latest/userguide/what-is-nova.html) | Amazon | 2024-12-03 | Undisclosed | Private / proprietary | Not available locally | Larger multimodal hosted model. |
| [Nova Premier](https://docs.aws.amazon.com/nova/latest/userguide/what-is-nova.html) | Amazon | 2025-04 | Undisclosed | Private / proprietary | Not available locally | Largest first-generation Nova model. |
| [Nova 2 Lite](https://docs.aws.amazon.com/nova/latest/userguide/what-is-nova.html) | Amazon | 2025-12-02 | Undisclosed | Private / proprietary | Not available locally | Reasoning model for efficient agent and multimodal tasks. |
| [Claude 1](https://www.anthropic.com/news/introducing-claude) | Anthropic | 2023-03-14 | Undisclosed | Private / proprietary | Not available locally | Original Claude assistant model. |
| [Claude 2](https://www.anthropic.com/news/claude-2) | Anthropic | 2023-07-11 | Undisclosed | Private / proprietary | Not available locally | Long-context successor to Claude 1. |
| [Claude Instant 1.2](https://www.anthropic.com/news/releasing-claude-instant-1-2) | Anthropic | 2023-08-09 | Undisclosed | Private / proprietary | Not available locally | Early lightweight Claude model. |
| [Claude 2.1](https://www.anthropic.com/news/claude-2-1) | Anthropic | 2023-11-21 | Undisclosed | Private / proprietary | Not available locally | Expanded context and early tool-use support. |
| [Claude 3 Opus](https://www.anthropic.com/news/claude-3-family) | Anthropic | 2024-03-04 | Undisclosed | Private / proprietary | Not available locally | Largest original Claude 3 tier, with vision. |
| [Claude 3 Sonnet](https://www.anthropic.com/news/claude-3-family) | Anthropic | 2024-03-04 | Undisclosed | Private / proprietary | Not available locally | Middle Claude 3 tier, with vision. |
| [Claude 3 Haiku](https://www.anthropic.com/news/claude-3-haiku) | Anthropic | 2024-03-13 | Undisclosed | Private / proprietary | Not available locally | Smallest Claude 3 tier for fast responses. |
| [Claude 3.5 Sonnet](https://www.anthropic.com/news/claude-3-5-sonnet) | Anthropic | 2024-06-20 | Undisclosed | Private / proprietary | Not available locally | Improved coding and visual understanding. |
| [Claude 3.5 Sonnet v2](https://www.anthropic.com/news/3-5-models-and-computer-use) | Anthropic | 2024-10-22 | Undisclosed | Private / proprietary | Not available locally | Updated Sonnet accompanying the computer-use beta. |
| [Claude 3.5 Haiku](https://www.anthropic.com/news/3-5-models-and-computer-use) | Anthropic | 2024-11 | Undisclosed | Private / proprietary | Not available locally | Smaller Claude 3.5 model announced in October. |
| [Claude 3.7 Sonnet](https://www.anthropic.com/news/claude-3-7-sonnet) | Anthropic | 2025-02-24 | Undisclosed | Private / proprietary | Not available locally | Introduced optional extended thinking. |
| [Claude Opus 4](https://www.anthropic.com/news/claude-4) | Anthropic | 2025-05-22 | Undisclosed | Private / proprietary | Not available locally | Claude 4 flagship for sustained coding and reasoning. |
| [Claude Sonnet 4](https://www.anthropic.com/news/claude-4) | Anthropic | 2025-05-22 | Undisclosed | Private / proprietary | Not available locally | Balanced Claude 4 model for everyday work and coding. |
| [Claude Opus 4.1](https://www.anthropic.com/news/claude-opus-4-1) | Anthropic | 2025-08-05 | Undisclosed | Private / proprietary | Not available locally | Opus update focused on agentic tasks and coding. |
| [Claude Sonnet 4.5](https://www.anthropic.com/news/claude-sonnet-4-5) | Anthropic | 2025-09-29 | Undisclosed | Private / proprietary | Not available locally | Sonnet update focused on coding agents. |
| [Claude Haiku 4.5](https://www.anthropic.com/news/claude-haiku-4-5) | Anthropic | 2025-10-15 | Undisclosed | Private / proprietary | Not available locally | Small, fast model in the Claude 4.5 generation. |
| [Claude Opus 4.5](https://www.anthropic.com/news/claude-opus-4-5) | Anthropic | 2025-11-24 | Undisclosed | Private / proprietary | Not available locally | Opus update for coding, agents, and computer use. |
| [Claude Opus 4.6](https://www.anthropic.com/news/claude-opus-4-6) | Anthropic | 2026-02-05 | Undisclosed | Private / proprietary | Not available locally | Opus reasoning and long-context update. |
| [Claude Sonnet 4.6](https://www.anthropic.com/news/claude-sonnet-4-6) | Anthropic | 2026-02-17 | Undisclosed | Private / proprietary | Not available locally | Sonnet update for coding and professional work. |
| [Claude Mythos Preview](https://www.anthropic.com/glasswing) | Anthropic | 2026-04 (restricted) | Undisclosed | Private / proprietary | Not available locally | Restricted research preview for selected defensive security partners. |
| [Claude Opus 4.7](https://www.anthropic.com/news/claude-opus-4-7) | Anthropic | 2026-04-16 | Undisclosed | Private / proprietary | Not available locally | Improved software engineering, verification, and image understanding. |
| [Claude Opus 4.8](https://www.anthropic.com/news/claude-opus-4-8) | Anthropic | 2026-05-28 | Undisclosed | Private / proprietary | Not available locally | Updated Opus with more efficient tool use and collaboration. |
| [Claude Fable 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) | Anthropic | 2026-06-09 | Undisclosed | Private / proprietary | Not available locally | General-use Claude 5 model. Access was suspended and restored during rollout. |
| [Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) | Anthropic | 2026-06-09 (restricted) | Undisclosed | Private / proprietary | Not available locally | Restricted-access Claude 5 model with advanced cyber capabilities. |
| [Claude Sonnet 5](https://www.anthropic.com/news/claude-sonnet-5) | Anthropic | 2026-06-30 | Undisclosed | Private / proprietary | Not available locally | Sonnet model emphasizing planning and autonomous tool use. |
| [Claude Opus 5](https://www.anthropic.com/news/claude-opus-5) | Anthropic | 2026-07-24 | Undisclosed | Private / proprietary | Not available locally | Claude 5 model aimed at everyday coding and professional work. |
| [ERNIE 4.5 0.3B](https://huggingface.co/baidu/ERNIE-4.5-0.3B-PT) | Baidu | 2025-06-30 (weights) | 0.3B | Open weights: Apache 2.0 | 0.15 / 3-5 | Baidu downloadable model. VL variants accept visual inputs. |
| [ERNIE 4.5 21B-A3B](https://huggingface.co/baidu/ERNIE-4.5-21B-A3B-PT) | Baidu | 2025-06-30 (weights) | 21B / 3B active | Open weights: Apache 2.0 | 10.5 / 15-20 | Baidu downloadable model. VL variants accept visual inputs. |
| [ERNIE 4.5 300B-A47B](https://huggingface.co/baidu/ERNIE-4.5-300B-A47B-PT) | Baidu | 2025-06-30 (weights) | 300B / 47B active | Open weights: Apache 2.0 | 150 / 182-229 | Baidu downloadable model. VL variants accept visual inputs. |
| [ERNIE 4.5 VL-28B-A3B](https://huggingface.co/baidu/ERNIE-4.5-VL-28B-A3B-PT) | Baidu | 2025-06-30 (weights) | 28B / 3B active | Open weights: Apache 2.0 | 14 / 19-25 | Baidu downloadable model. VL variants accept visual inputs. |
| [ERNIE 4.5 VL-424B-A47B](https://huggingface.co/baidu/ERNIE-4.5-VL-424B-A47B-PT) | Baidu | 2025-06-30 (weights) | 424B / 47B active | Open weights: Apache 2.0 | 212 / 257-322 | Baidu downloadable model. VL variants accept visual inputs. |
| [StarCoder](https://huggingface.co/bigcode/starcoder) | BigCode (Hugging Face and partners) | 2023-05 | 15.5B | Open weights: BigCode OpenRAIL-M | 7.75 / 12-16 | Code-completion model trained by BigCode. |
| [StarCoder2 15B](https://huggingface.co/bigcode/starcoder2-15b) | BigCode (Hugging Face and partners) | 2024-02 | 15B | Open weights: BigCode OpenRAIL-M | 7.5 / 11-16 | Code model trained on The Stack v2. |
| [StarCoder2 3B](https://huggingface.co/bigcode/starcoder2-3b) | BigCode (Hugging Face and partners) | 2024-02 | 3B | Open weights: BigCode OpenRAIL-M | 1.5 / 4-7 | Smaller StarCoder2 code-completion model. |
| [StarCoder2 7B](https://huggingface.co/bigcode/starcoder2-7b) | BigCode (Hugging Face and partners) | 2024-02 | 7B | Open weights: BigCode OpenRAIL-M | 3.5 / 7-10 | Smaller StarCoder2 code-completion model. |
| [BLOOM](https://huggingface.co/bigscience/bloom) | BigScience | 2022-07-12 | 176B | Open weights: BigScience RAIL | 88 / 108-136 | Multilingual research model from the BigScience collaboration. |
| [Command R](https://huggingface.co/CohereForAI/c4ai-command-r-v01) | Cohere / Cohere For AI | 2024-03 | 35B | Open weights: CC-BY-NC 4.0 | 17.5 / 23-31 | Enterprise model emphasizing retrieval, grounded answers, and tool use. |
| [Command R+](https://huggingface.co/CohereForAI/c4ai-command-r-plus) | Cohere / Cohere For AI | 2024-04 | 104B | Open weights: CC-BY-NC 4.0 | 52 / 65-82 | Enterprise model emphasizing retrieval, grounded answers, and tool use. |
| [Aya Expanse 32B](https://huggingface.co/CohereForAI/aya-expanse-32b) | Cohere / Cohere For AI | 2024-10 | 32B | Open weights: CC-BY-NC 4.0 | 16 / 22-28 | Multilingual instruction model. |
| [Aya Expanse 8B](https://huggingface.co/CohereForAI/aya-expanse-8b) | Cohere / Cohere For AI | 2024-10 | 8B | Open weights: CC-BY-NC 4.0 | 4 / 7-10 | Multilingual instruction model. |
| [Command A](https://huggingface.co/CohereForAI/c4ai-command-a-03-2025) | Cohere / Cohere For AI | 2025-03-13 | 111B | Open weights: CC-BY-NC 4.0 | 55.5 / 69-88 | Enterprise model emphasizing retrieval, grounded answers, and tool use. |
| [DBRX](https://huggingface.co/databricks/dbrx-instruct) | Databricks | 2024-03-27 | 132B / 36B active | Open weights: Databricks Open Model | 66 / 82-103 | Fine-grained MoE for general text and coding. |
| [DeepSeek Coder 1.3B](https://huggingface.co/deepseek-ai/deepseek-coder-1.3b-base) | DeepSeek | 2023-11 | 1.3B | Open weights: DeepSeek model license | 0.65 / 3-5 | Early code model trained for completion and repository context. |
| [DeepSeek Coder 33B](https://huggingface.co/deepseek-ai/deepseek-coder-33b-base) | DeepSeek | 2023-11 | 33B | Open weights: DeepSeek model license | 16.5 / 22-29 | Early code model trained for completion and repository context. |
| [DeepSeek Coder 6.7B](https://huggingface.co/deepseek-ai/deepseek-coder-6.7b-base) | DeepSeek | 2023-11 | 6.7B | Open weights: DeepSeek model license | 3.35 / 7-10 | Early code model trained for completion and repository context. |
| [DeepSeek LLM 67B](https://huggingface.co/deepseek-ai/deepseek-llm-67b-base) | DeepSeek | 2023-11 | 67B | Open weights: DeepSeek model license | 33.5 / 43-55 | Early general-purpose dense DeepSeek model. |
| [DeepSeek LLM 7B](https://huggingface.co/deepseek-ai/deepseek-llm-7b-base) | DeepSeek | 2023-11 | 7B | Open weights: DeepSeek model license | 3.5 / 7-10 | Early general-purpose dense DeepSeek model. |
| [DeepSeek-V2](https://huggingface.co/deepseek-ai/DeepSeek-V2) | DeepSeek | 2024-05 | 236B / 21B active | Open weights: DeepSeek model license | 118 / 144-181 | MoE model introducing Multi-head Latent Attention. |
| [DeepSeek-V2-Lite](https://huggingface.co/deepseek-ai/DeepSeek-V2-Lite) | DeepSeek | 2024-05 | 16B / 2.4B active | Open weights: DeepSeek model license | 8 / 12-16 | Small V2 MoE for experimentation and local inference. |
| [DeepSeek-Coder-V2](https://huggingface.co/deepseek-ai/DeepSeek-Coder-V2-Instruct) | DeepSeek | 2024-06 | 236B / 21B active | Open weights: DeepSeek model license | 118 / 144-181 | Code-specialized V2 with expanded language coverage. |
| [DeepSeek-Coder-V2-Lite](https://huggingface.co/deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct) | DeepSeek | 2024-06 | 16B / 2.4B active | Open weights: DeepSeek model license | 8 / 12-16 | Smaller code-specialized V2 MoE. |
| [DeepSeek-V2.5](https://huggingface.co/deepseek-ai/DeepSeek-V2.5) | DeepSeek | 2024-09 | 236B / 21B active | Open weights: DeepSeek model license | 118 / 144-181 | Combined general chat and coding capabilities. |
| [DeepSeek-V3](https://huggingface.co/deepseek-ai/DeepSeek-V3) | DeepSeek | 2024-12-26 | 671B / 37B active | Open weights: DeepSeek model license | 335.5 / 405-508 | Large MoE with FP8 training and multi-token prediction. |
| [DeepSeek-R1](https://huggingface.co/deepseek-ai/DeepSeek-R1) | DeepSeek | 2025-01-20 | 671B / 37B active | Open weights: MIT | 335.5 / 405-508 | Reasoning model trained with reinforcement learning and cold-start data. |
| [DeepSeek-R1-Distill-Llama-70B](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Llama-70B) | DeepSeek | 2025-01-20 | 70B | Open weights: MIT + base terms | 35 / 44-57 | Smaller dense student trained on R1 outputs. Original Qwen or Llama terms also matter. |
| [DeepSeek-R1-Distill-Llama-8B](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Llama-8B) | DeepSeek | 2025-01-20 | 8B | Open weights: MIT + base terms | 4 / 7-10 | Smaller dense student trained on R1 outputs. Original Qwen or Llama terms also matter. |
| [DeepSeek-R1-Distill-Qwen-1.5B](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B) | DeepSeek | 2025-01-20 | 1.5B | Open weights: MIT + base terms | 0.75 / 3-6 | Smaller dense student trained on R1 outputs. Original Qwen or Llama terms also matter. |
| [DeepSeek-R1-Distill-Qwen-14B](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-14B) | DeepSeek | 2025-01-20 | 14B | Open weights: MIT + base terms | 7 / 11-15 | Smaller dense student trained on R1 outputs. Original Qwen or Llama terms also matter. |
| [DeepSeek-R1-Distill-Qwen-32B](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B) | DeepSeek | 2025-01-20 | 32B | Open weights: MIT + base terms | 16 / 22-28 | Smaller dense student trained on R1 outputs. Original Qwen or Llama terms also matter. |
| [DeepSeek-R1-Distill-Qwen-7B](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B) | DeepSeek | 2025-01-20 | 7B | Open weights: MIT + base terms | 3.5 / 7-10 | Smaller dense student trained on R1 outputs. Original Qwen or Llama terms also matter. |
| [DeepSeek-R1-Zero](https://huggingface.co/deepseek-ai/DeepSeek-R1-Zero) | DeepSeek | 2025-01-20 | 671B / 37B active | Open weights: MIT | 335.5 / 405-508 | Research reasoning model trained with reinforcement learning without an initial supervised stage. |
| [DeepSeek-V3-0324](https://huggingface.co/deepseek-ai/DeepSeek-V3-0324) | DeepSeek | 2025-03-24 | 671B / 37B active | Open weights: MIT | 335.5 / 405-508 | V3 update with improved reasoning and instruction following. |
| [DeepSeek-R1-0528](https://huggingface.co/deepseek-ai/DeepSeek-R1-0528) | DeepSeek | 2025-05-28 | 671B / 37B active | Open weights: MIT | 335.5 / 405-508 | Updated R1 reasoning checkpoint. |
| [DeepSeek-V3.1](https://huggingface.co/deepseek-ai/DeepSeek-V3.1) | DeepSeek | 2025-08 | 671B / 37B active | Open weights: MIT | 335.5 / 405-508 | Hybrid thinking and non-thinking successor to V3. |
| [DeepSeek-V3.2](https://huggingface.co/deepseek-ai/DeepSeek-V3.2) | DeepSeek | 2025-12 | 671B / 37B active | Open weights: MIT | 335.5 / 405-508 | Sparse-attention model combining reasoning and tool use. |
| [DeepSeek-V4 Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash) | DeepSeek | 2026-04-24 (preview) | 284B / 13B active | Open weights: MIT | 142 / 173-217 | Smaller V4 MoE supporting a million-token context. |
| [DeepSeek-V4 Pro](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro) | DeepSeek | 2026-04-24 (preview) | 1600B / 49B active | Open weights: MIT | 800 / 962-1204 | Largest V4 model. General availability followed in August. |
| [DeepSeek-V4.1 Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash) | DeepSeek | 2026-09-10 | 748B / 8 prefill / 16 decodeB active | Open weights: MIT | 374+ / 451-565+ (conditional) | 552B backbone plus 196B Engram memory. Estimate covers both, excludes uncounted auxiliary modules. |
| [GPT-Neo 1.3B](https://huggingface.co/EleutherAI/gpt-neo-1.3B) | EleutherAI | 2021-03 | 1.3B | Open weights: MIT | 0.65 / 3-5 | Early community-trained autoregressive transformer. |
| [GPT-Neo 2.7B](https://huggingface.co/EleutherAI/gpt-neo-2.7B) | EleutherAI | 2021-03 | 2.7B | Open weights: MIT | 1.35 / 4-7 | Early community-trained autoregressive transformer. |
| [GPT-J](https://huggingface.co/EleutherAI/gpt-j-6b) | EleutherAI | 2021-06 | 6B | Open weights: Apache 2.0 | 3 / 6-9 | Early openly released GPT-style dense text model. |
| [GPT-NeoX](https://huggingface.co/EleutherAI/gpt-neox-20b) | EleutherAI | 2022-02 | 20B | Open weights: Apache 2.0 | 10 / 14-19 | Large open research model trained with the GPT-NeoX framework. |
| [Pythia 12B](https://huggingface.co/EleutherAI/pythia-12b) | EleutherAI | 2023-02 | 12B | Open weights: Apache 2.0 | 6 / 10-13 | Largest Pythia research model, with intermediate training checkpoints. |
| [T5 11B](https://huggingface.co/google-t5/t5-11b) | Google | 2019-10 (paper) | 11B | Open weights: Apache 2.0 | 5.5 / 9-13 | Encoder-decoder research model casting NLP tasks as text-to-text generation. |
| [LaMDA](https://arxiv.org/abs/2201.08239) | Google | 2022-01 (paper) | 137B | Private / proprietary | Not available locally | Dialogue-focused research model. Largest published configuration. |
| [PaLM](https://arxiv.org/abs/2204.02311) | Google | 2022-04 (paper) | 540B | Private / proprietary | Not available locally | Large dense model trained with the Pathways system. Largest published configuration. |
| [FLAN-T5 XXL](https://huggingface.co/google/flan-t5-xxl) | Google | 2022-10 | 11B | Open weights: Apache 2.0 | 5.5 / 9-13 | Instruction-tuned T5 model. Encoder-decoder caching differs from decoder-only models. |
| [PaLM 2](https://arxiv.org/abs/2305.10403) | Google | 2023-05 | Undisclosed | Private / proprietary | Not available locally | Multilingual successor to PaLM used in early Bard deployments. |
| [Gemini 1.0 Pro](https://arxiv.org/abs/2312.11805) | Google DeepMind | 2023-12-06 | Undisclosed | Private / proprietary | Not available locally | First Gemini Pro release for general multimodal tasks. |
| [Gemini 1.0 Ultra](https://arxiv.org/abs/2312.11805) | Google DeepMind | 2024-02 | Undisclosed | Private / proprietary | Not available locally | Largest first-generation Gemini tier. |
| [Gemini 1.5 Pro](https://arxiv.org/abs/2403.05530) | Google DeepMind | 2024-02-15 (preview) | Undisclosed | Private / proprietary | Not available locally | Long-context MoE generation. |
| [Gemma 2B](https://huggingface.co/google/gemma-2b) | Google DeepMind | 2024-02-21 | 2B | Open weights: Gemma terms | 1 / 4-6 | First downloadable Gemma text models. |
| [Gemma 7B](https://huggingface.co/google/gemma-7b) | Google DeepMind | 2024-02-21 | 7B | Open weights: Gemma terms | 3.5 / 7-10 | First downloadable Gemma text models. |
| [Gemini 1.5 Flash](https://arxiv.org/abs/2403.05530) | Google DeepMind | 2024-05 (preview) | Undisclosed | Private / proprietary | Not available locally | Faster, lower-cost sibling to 1.5 Pro. |
| [Gemma 2 27B](https://huggingface.co/google/gemma-2-27b) | Google DeepMind | 2024-06-27 | 27B | Open weights: Gemma terms | 13.5 / 19-25 | Second-generation Gemma dense text model. |
| [Gemma 2 9B](https://huggingface.co/google/gemma-2-9b) | Google DeepMind | 2024-06-27 | 9B | Open weights: Gemma terms | 4.5 / 8-11 | Second-generation Gemma dense text model. |
| [Gemma 2 2B](https://huggingface.co/google/gemma-2-2b) | Google DeepMind | 2024-07-31 | 2B | Open weights: Gemma terms | 1 / 4-6 | Second-generation Gemma dense text model. |
| [Gemini 2.0 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-2.0-flash) | Google DeepMind | 2024-12 (experimental) | Undisclosed | Private / proprietary | Not available locally | Second-generation Flash model with expanded tool and multimodal capabilities. |
| [Gemini 2.0 Flash-Lite](https://ai.google.dev/gemini-api/docs/models/gemini-2.0-flash-lite) | Google DeepMind | 2025-02 (preview) | Undisclosed | Private / proprietary | Not available locally | Lower-cost Gemini 2.0 tier. |
| [Gemma 3 12B](https://huggingface.co/google/gemma-3-12b-it) | Google DeepMind | 2025-03-12 | 12B | Open weights: Gemma terms | 6 / 10-13 | Gemma 3 multimodal model with image inputs. |
| [Gemma 3 1B](https://huggingface.co/google/gemma-3-1b-it) | Google DeepMind | 2025-03-12 | 1B | Open weights: Gemma terms | 0.5 / 3-5 | Gemma 3 text model. |
| [Gemma 3 27B](https://huggingface.co/google/gemma-3-27b-it) | Google DeepMind | 2025-03-12 | 27B | Open weights: Gemma terms | 13.5 / 19-25 | Gemma 3 multimodal model with image inputs. |
| [Gemma 3 4B](https://huggingface.co/google/gemma-3-4b-it) | Google DeepMind | 2025-03-12 | 4B | Open weights: Gemma terms | 2 / 5-7 | Gemma 3 multimodal model with image inputs. |
| [Gemini 2.5 Pro](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-pro) | Google DeepMind | 2025-03-25 (experimental) | Undisclosed | Private / proprietary | Not available locally | Thinking model for reasoning and coding. |
| [Gemini 2.5 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash) | Google DeepMind | 2025-04 (preview) | Undisclosed | Private / proprietary | Not available locally | Reasoning model balancing latency and capability. |
| [Gemini 2.5 Flash-Lite](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-lite) | Google DeepMind | 2025-06 (preview) | Undisclosed | Private / proprietary | Not available locally | Smallest hosted Gemini 2.5 tier. |
| [Gemma 3n E2B](https://huggingface.co/google/gemma-3n-E2B-it) | Google DeepMind | 2025-06-26 (full release) | 5B | Open weights: Gemma terms | 2.5 / 5-8 | Multimodal edge model. Effective size differs from total storage. Selective loading changes RAM use. |
| [Gemma 3n E4B](https://huggingface.co/google/gemma-3n-E4B-it) | Google DeepMind | 2025-06-26 (full release) | 8B | Open weights: Gemma terms | 4 / 7-10 | Multimodal edge model. Effective size differs from total storage. Selective loading changes RAM use. |
| [Gemma 3 270M](https://huggingface.co/google/gemma-3-270m-it) | Google DeepMind | 2025-08 | 0.27B | Open weights: Gemma terms | 0.135 / 3-5 | Tiny text model for specialized on-device tasks. |
| [Gemini 3 Pro](https://ai.google.dev/gemini-api/docs/models/gemini-3-pro-preview) | Google DeepMind | 2025-11 (preview) | Undisclosed | Private / proprietary | Not available locally | Gemini 3 flagship reasoning and multimodal model. |
| [Gemini 3 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3-flash-preview) | Google DeepMind | 2025-12 | Undisclosed | Private / proprietary | Not available locally | Faster model in the Gemini 3 generation. |
| [Gemini 3.1 Pro](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview) | Google DeepMind | 2026-02-19 (preview) | Undisclosed | Private / proprietary | Not available locally | Updated Pro model for difficult reasoning tasks. |
| [Gemini 3.1 Flash-Lite](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite) | Google DeepMind | 2026-03 | Undisclosed | Private / proprietary | Not available locally | Low-latency Gemini 3.1 tier. |
| [Gemma 4 26B-A4B](https://huggingface.co/google/gemma-4-26B-A4B-it) | Google DeepMind | 2026-03-31 | 25.2B / 3.8B active | Open weights: Apache 2.0 | 12.6+ / 18-24+ (encoder) | Sparse multimodal Gemma 4. Add approximately 0.55B vision parameters. |
| [Gemma 4 31B](https://huggingface.co/google/gemma-4-31B-it) | Google DeepMind | 2026-03-31 | 30.7B | Open weights: Apache 2.0 | 15.35+ / 21-28+ (encoder) | Dense multimodal Gemma 4. Add approximately 0.55B vision parameters. |
| [Gemma 4 E2B](https://huggingface.co/google/gemma-4-e2b-it) | Google DeepMind | 2026-03-31 | 5.1B | Open weights: Apache 2.0 | 2.55+ / 6-8+ (encoders) | Effective-size label excludes large per-layer embeddings. Count includes embeddings, add encoder memory. |
| [Gemma 4 E4B](https://huggingface.co/google/gemma-4-e4b-it) | Google DeepMind | 2026-03-31 | 8B | Open weights: Apache 2.0 | 4+ / 7-10+ (encoders) | Effective-size label excludes large per-layer embeddings. Count includes embeddings, add encoder memory. |
| [Gemini 3.5 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash) | Google DeepMind | 2026-05-19 | Undisclosed | Private / proprietary | Not available locally | Flash update for reasoning and agent workflows. |
| [Gemma 4 12B Unified](https://huggingface.co/google/gemma-4-12b-it) | Google DeepMind | 2026-06-03 | 11.95B | Open weights: Apache 2.0 | 5.975 / 10-13 | Encoder-free model accepting text, image, and audio inputs. |
| [Gemini 3.5 Flash-Lite](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite) | Google DeepMind | 2026-07-21 | Undisclosed | Private / proprietary | Not available locally | Efficient model for high-volume multimodal work. |
| [Gemini 3.6 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.6-flash) | Google DeepMind | 2026-07-21 | Undisclosed | Private / proprietary | Not available locally | Successor to 3.5 Flash. |
| [Gemini 3.7 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.7-flash) | Google DeepMind | 2026-08-13 | Undisclosed | Private / proprietary | Not available locally | Intermediate Flash update for coding and reasoning. |
| [Gemini 3.8 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash) | Google DeepMind | 2026-09-02 | Undisclosed | Private / proprietary | Not available locally | Flash update focused on agentic reasoning and coding. |
| [SmolLM2 0.135B](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct) | Hugging Face | 2024-11 | 0.135B | Open weights: Apache 2.0 | 0.0675 / 3-5 | Small text models with published training resources. |
| [SmolLM2 0.36B](https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct) | Hugging Face | 2024-11 | 0.36B | Open weights: Apache 2.0 | 0.18 / 3-5 | Small text models with published training resources. |
| [SmolLM2 1.7B](https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct) | Hugging Face | 2024-11 | 1.7B | Open weights: Apache 2.0 | 0.85 / 4-6 | Small text models with published training resources. |
| [SmolLM3 3B](https://huggingface.co/HuggingFaceTB/SmolLM3-3B) | Hugging Face | 2025-07-08 | 3B | Open weights: Apache 2.0 | 1.5 / 4-7 | Hugging Face text model with reasoning, long context, and multilingual support. |
| [Granite 3.0 2B](https://huggingface.co/ibm-granite/granite-3.0-2b-instruct) | IBM | 2024-10 | 2B | Open weights: Apache 2.0 | 1 / 4-6 | Enterprise text model with instruction following and tool support. |
| [Granite 3.0 8B](https://huggingface.co/ibm-granite/granite-3.0-8b-instruct) | IBM | 2024-10 | 8B | Open weights: Apache 2.0 | 4 / 7-10 | Enterprise text model with instruction following and tool support. |
| [Granite 4.0 H Small](https://huggingface.co/ibm-granite/granite-4.0-h-small) | IBM | 2025-10-02 | 32B / 9B active | Open weights: Apache 2.0 | 16 / 22-28 | Hybrid Mamba/Transformer MoE for enterprise tasks. |
| [LongCat-Flash-Chat](https://huggingface.co/meituan-longcat/LongCat-Flash-Chat) | Meituan | 2025-09-01 | 560B / 18.6-31.3B active | Open weights: MIT | 280 / 338-424 | Dynamic MoE varying active compute by token. |
| [LongCat-Flash-Thinking-2601](https://huggingface.co/meituan-longcat/LongCat-Flash-Thinking-2601) | Meituan | 2026-01 | 560B / 18.6-31.3B active | Open weights: MIT | 280 / 338-424 | Reasoning-tuned LongCat for tool-using tasks. |
| [OPT 175B](https://github.com/facebookresearch/metaseq) | Meta | 2022-05 | 175B | Restricted research weights: OPT | 87.5 / 107-136 (if access granted) | Meta research model released with training logs and access restrictions. |
| [LLaMA 1 13B](https://github.com/meta-llama/llama) | Meta | 2023-02 | 13B | Open weights: research-only | 6.5 / 10-14 | Original LLaMA release with restricted research access. |
| [LLaMA 1 33B](https://github.com/meta-llama/llama) | Meta | 2023-02 | 33B | Open weights: research-only | 16.5 / 22-29 | Original LLaMA release with restricted research access. |
| [LLaMA 1 65B](https://github.com/meta-llama/llama) | Meta | 2023-02 | 65B | Open weights: research-only | 32.5 / 41-53 | Original LLaMA release with restricted research access. |
| [LLaMA 1 7B](https://github.com/meta-llama/llama) | Meta | 2023-02 | 7B | Open weights: research-only | 3.5 / 7-10 | Original LLaMA release with restricted research access. |
| [Llama 2 13B](https://huggingface.co/meta-llama/Llama-2-13b-hf) | Meta | 2023-07-18 | 13B | Open weights: Llama community | 6.5 / 10-14 | Second-generation text model. Chat variants were released alongside base models. |
| [Llama 2 70B](https://huggingface.co/meta-llama/Llama-2-70b-hf) | Meta | 2023-07-18 | 70B | Open weights: Llama community | 35 / 44-57 | Second-generation text model. Chat variants were released alongside base models. |
| [Llama 2 7B](https://huggingface.co/meta-llama/Llama-2-7b-hf) | Meta | 2023-07-18 | 7B | Open weights: Llama community | 3.5 / 7-10 | Second-generation text model. Chat variants were released alongside base models. |
| [Code Llama 13B](https://huggingface.co/codellama/CodeLlama-13b-hf) | Meta | 2023-08 | 13B | Open weights: Llama community | 6.5 / 10-14 | Code-focused Llama 2 derivative, with separate Python and instruction variants. |
| [Code Llama 34B](https://huggingface.co/codellama/CodeLlama-34b-hf) | Meta | 2023-08 | 34B | Open weights: Llama community | 17 / 23-30 | Code-focused Llama 2 derivative, with separate Python and instruction variants. |
| [Code Llama 7B](https://huggingface.co/codellama/CodeLlama-7b-hf) | Meta | 2023-08 | 7B | Open weights: Llama community | 3.5 / 7-10 | Code-focused Llama 2 derivative, with separate Python and instruction variants. |
| [Code Llama 70B](https://huggingface.co/codellama/CodeLlama-70b-hf) | Meta | 2024-01 | 70B | Open weights: Llama community | 35 / 44-57 | Larger Code Llama release for code generation. |
| [Llama 3 70B](https://huggingface.co/meta-llama/Meta-Llama-3-70B) | Meta | 2024-04-18 | 70B | Open weights: Llama community | 35 / 44-57 | Third-generation text model with a larger vocabulary and training corpus. |
| [Llama 3 8B](https://huggingface.co/meta-llama/Meta-Llama-3-8B) | Meta | 2024-04-18 | 8B | Open weights: Llama community | 4 / 7-10 | Third-generation text model with a larger vocabulary and training corpus. |
| [Llama 3.1 405B](https://huggingface.co/meta-llama/Meta-Llama-3.1-405B) | Meta | 2024-07-23 | 405B | Open weights: Llama community | 202.5 / 245-308 | Llama generation supporting longer contexts and multilingual use. |
| [Llama 3.1 70B](https://huggingface.co/meta-llama/Meta-Llama-3.1-70B) | Meta | 2024-07-23 | 70B | Open weights: Llama community | 35 / 44-57 | Llama generation supporting longer contexts and multilingual use. |
| [Llama 3.1 8B](https://huggingface.co/meta-llama/Meta-Llama-3.1-8B) | Meta | 2024-07-23 | 8B | Open weights: Llama community | 4 / 7-10 | Llama generation supporting longer contexts and multilingual use. |
| [Llama 3.2 1B](https://huggingface.co/meta-llama/Llama-3.2-1B) | Meta | 2024-09-25 | 1B | Open weights: Llama community | 0.5 / 3-5 | Compact text model intended for local and edge use. |
| [Llama 3.2 3B](https://huggingface.co/meta-llama/Llama-3.2-3B) | Meta | 2024-09-25 | 3B | Open weights: Llama community | 1.5 / 4-7 | Compact text model intended for local and edge use. |
| [Llama 3.2 Vision 11B](https://huggingface.co/meta-llama/Llama-3.2-11B-Vision) | Meta | 2024-09-25 | 11B | Open weights: Llama community | 5.5 / 9-13 | Vision-capable Llama combining image understanding with text generation. |
| [Llama 3.2 Vision 90B](https://huggingface.co/meta-llama/Llama-3.2-90B-Vision) | Meta | 2024-09-25 | 90B | Open weights: Llama community | 45 / 56-72 | Vision-capable Llama combining image understanding with text generation. |
| [Llama 3.3 70B](https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct) | Meta | 2024-12 | 70B | Open weights: Llama community | 35 / 44-57 | Instruction-tuned 70B refresh emphasizing multilingual quality. |
| [Llama 4 Maverick](https://huggingface.co/meta-llama/Llama-4-Maverick-17B-128E-Instruct) | Meta | 2025-04-05 | 400B / 17B active | Open weights: Llama 4 community | 200 / 242-304 | Native multimodal MoE. Memory follows the total count, not its 17B active count. |
| [Llama 4 Scout](https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E-Instruct) | Meta | 2025-04-05 | 109B / 17B active | Open weights: Llama 4 community | 54.5 / 68-86 | Native multimodal MoE. Memory follows the total count, not its 17B active count. |
| [Muse Spark](https://ai.meta.com/blog/introducing-muse-spark-msl/) | Meta Superintelligence Labs | 2026-04-08 | Undisclosed | Private / proprietary | Not available locally | Hosted multimodal reasoning model in the Muse family. |
| [Muse Spark 1.1](https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/) | Meta Superintelligence Labs | 2026-07-09 | Undisclosed | Private / proprietary | Not available locally | Hosted multimodal reasoning model in the Muse family. |
| [Muse Glimmer 30B](https://huggingface.co/meta-models/Muse-Glimmer-30B) | Meta Superintelligence Labs | 2026-08-10 | 30B | Open weights: Apache 2.0 | 15 / 20-27 | Multimodal model distilled for local agents. Optional speculative decoder needs additional memory. |
| [Muse Spark 1.3](https://research.meta.ai/blog/introducing-muse-spark-1-3) | Meta Superintelligence Labs | 2026-09-02 | Undisclosed | Private / proprietary | Not available locally | Hosted multimodal reasoning model in the Muse family. |
| [Phi-1](https://huggingface.co/microsoft/phi-1) | Microsoft | 2023-06 | 1.3B | Open weights: MIT | 0.65 / 3-5 | Small code model trained with curated and synthetic data. |
| [Phi-1.5](https://huggingface.co/microsoft/phi-1_5) | Microsoft | 2023-09 | 1.3B | Open weights: MIT | 0.65 / 3-5 | Small text model exploring data quality over scale. |
| [Phi-2](https://huggingface.co/microsoft/phi-2) | Microsoft | 2023-12 | 2.7B | Open weights: MIT | 1.35 / 4-7 | Compact model trained on curated educational-style data. |
| [Phi-3 mini](https://huggingface.co/microsoft/Phi-3-mini-4k-instruct) | Microsoft | 2024-04 | 3.8B | Open weights: MIT | 1.9 / 5-7 | Small instruction model for constrained deployments. |
| [Phi-3 medium](https://huggingface.co/microsoft/Phi-3-medium-4k-instruct) | Microsoft | 2024-05 | 14B | Open weights: MIT | 7 / 11-15 | Largest original dense Phi-3 model. |
| [Phi-3 small](https://huggingface.co/microsoft/Phi-3-small-8k-instruct) | Microsoft | 2024-05 | 7B | Open weights: MIT | 3.5 / 7-10 | Middle Phi-3 dense model. |
| [Phi-3.5 MoE](https://huggingface.co/microsoft/Phi-3.5-MoE-instruct) | Microsoft | 2024-08 | 41.9B / 6.6B active | Open weights: MIT | 20.95 / 28-36 | Sparse Phi model with 6.6B active parameters. |
| [Phi-3.5 mini](https://huggingface.co/microsoft/Phi-3.5-mini-instruct) | Microsoft | 2024-08 | 3.8B | Open weights: MIT | 1.9 / 5-7 | Updated compact Phi instruction model. |
| [Phi-4](https://huggingface.co/microsoft/phi-4) | Microsoft | 2024-12-12 | 14B | Open weights: MIT | 7 / 11-15 | Small dense model emphasizing reasoning and synthetic training data. |
| [Phi-4 mini](https://huggingface.co/microsoft/Phi-4-mini-instruct) | Microsoft | 2025-02 | 3.8B | Open weights: MIT | 1.9 / 5-7 | Smaller Phi-4 instruction model. |
| [Phi-4 multimodal](https://huggingface.co/microsoft/Phi-4-multimodal-instruct) | Microsoft | 2025-02 | 5.6B | Open weights: MIT | 2.8 / 6-9 | Compact model accepting text, image, and audio. |
| [Phi-4 reasoning](https://huggingface.co/microsoft/Phi-4-reasoning) | Microsoft | 2025-04 | 14B | Open weights: MIT | 7 / 11-15 | Reasoning-tuned Phi-4 model. |
| [MiniMax-Text-01](https://huggingface.co/MiniMaxAI/MiniMax-Text-01) | MiniMax | 2025-01 | 456B / 45.9B active | Open weights: MiniMax model license | 228 / 276-346 | Hybrid linear-attention MoE for long contexts. |
| [MiniMax-M1](https://huggingface.co/MiniMaxAI/MiniMax-M1-80k) | MiniMax | 2025-06 | 456B / 45.9B active | Open weights: Apache 2.0 | 228 / 276-346 | Long-context reasoning model based on MiniMax-Text-01. |
| [MiniMax-M2](https://huggingface.co/MiniMaxAI/MiniMax-M2) | MiniMax | 2025-10 | 230B / 10B active | Open weights: modified MIT | 115 / 140-177 | Sparse model focused on coding and agents. |
| [MiniMax-M2.1](https://huggingface.co/MiniMaxAI/MiniMax-M2.1) | MiniMax | 2025-12 | 230B / 10B active | Open weights: modified MIT | 115 / 140-177 | M2 update targeting multilingual software development. |
| [MiniMax-M2.5](https://huggingface.co/MiniMaxAI/MiniMax-M2.5) | MiniMax | 2026-02 | 230B / 10B active | Open weights: modified MIT | 115 / 140-177 | M2 generation optimized for coding and office tasks. |
| [MiniMax-M2.7](https://huggingface.co/MiniMaxAI/MiniMax-M2.7) | MiniMax | 2026-03 (API), 2026-04 (weights) | 230B / 10B active | Open weights: non-commercial | 115 / 140-177 | M2 update for software engineering. Commercial use requires separate authorization. |
| [MiniMax-M3](https://huggingface.co/MiniMaxAI/MiniMax-M3) | MiniMax | 2026-06-01 | 428B / 23B active | Open weights: MiniMax community | 214 / 259-325 | Native multimodal model using MiniMax Sparse Attention. |
| [Mistral 7B](https://huggingface.co/mistralai/Mistral-7B-v0.1) | Mistral AI | 2023-09-27 | 7.3B | Open weights: Apache 2.0 | 3.65 / 7-10 | Compact dense model using grouped-query and sliding-window attention. |
| [Mixtral 8x7B](https://huggingface.co/mistralai/Mixtral-8x7B-v0.1) | Mistral AI | 2023-12 | 46.7B / 12.9B active | Open weights: Apache 2.0 | 23.35 / 31-40 | Sparse MoE. Eight experts do not mean eight complete 7B models. |
| [Mistral Large (original)](https://mistral.ai/news/mistral-large) | Mistral AI | 2024-02 | Undisclosed | Private / proprietary | Not available locally | Original hosted flagship. Do not reuse Large 2 parameter counts. |
| [Mixtral 8x22B](https://huggingface.co/mistralai/Mixtral-8x22B-v0.1) | Mistral AI | 2024-04 | 141B / 39B active | Open weights: Apache 2.0 | 70.5 / 87-110 | Larger sparse Mixtral model. |
| [Codestral 22B](https://huggingface.co/mistralai/Codestral-22B-v0.1) | Mistral AI | 2024-05 | 22B | Open weights: Mistral non-production | 11 / 16-21 | Code model with fill-in-the-middle support and restricted production use. |
| [Mistral NeMo](https://huggingface.co/mistralai/Mistral-Nemo-Instruct-2407) | Mistral AI | 2024-07 | 12B | Open weights: Apache 2.0 | 6 / 10-13 | Dense model co-developed with NVIDIA. |
| [Mistral Large 2](https://huggingface.co/mistralai/Mistral-Large-Instruct-2407) | Mistral AI | 2024-07-24 | 123B | Open weights: Mistral research | 61.5 / 76-97 | Large dense model. Commercial self-hosting uses separate terms. |
| [Pixtral 12B](https://huggingface.co/mistralai/Pixtral-12B-2409) | Mistral AI | 2024-09 | 12B | Open weights: Apache 2.0 | 6 / 10-13 | Multimodal model combining a language backbone with a vision encoder. |
| [Pixtral Large](https://huggingface.co/mistralai/Pixtral-Large-Instruct-2411) | Mistral AI | 2024-11 | 124B | Open weights: Mistral research | 62 / 77-97 | Large multimodal model with a 123B language backbone. |
| [Mistral Small 3](https://huggingface.co/mistralai/Mistral-Small-24B-Instruct-2501) | Mistral AI | 2025-01-30 | 24B | Open weights: Apache 2.0 | 12 / 17-22 | Dense instruction model designed for efficient deployment. |
| [Mistral Small 3.1](https://huggingface.co/mistralai/Mistral-Small-3.1-24B-Instruct-2503) | Mistral AI | 2025-03 | 24B | Open weights: Apache 2.0 | 12 / 17-22 | Small model adding vision and a longer context. |
| [Devstral Small](https://huggingface.co/mistralai/Devstral-Small-2505) | Mistral AI | 2025-05 | 24B | Open weights: Apache 2.0 | 12 / 17-22 | Software engineering model co-developed with All Hands AI. |
| [Mistral Medium 3](https://mistral.ai/news/mistral-medium-3) | Mistral AI | 2025-05 | Undisclosed | Private / proprietary | Not available locally | Hosted model for professional tasks. |
| [Magistral Small](https://huggingface.co/mistralai/Magistral-Small-2506) | Mistral AI | 2025-06 | 24B | Open weights: Apache 2.0 | 12 / 17-22 | Downloadable reasoning model. |
| [Devstral 2](https://huggingface.co/mistralai/Devstral-2-123B-Instruct-2512) | Mistral AI | 2025-12 | 123B | Open weights: modified MIT | 61.5 / 76-97 | Large software engineering model. |
| [Devstral Small 2](https://huggingface.co/mistralai/Devstral-Small-2-24B-Instruct-2512) | Mistral AI | 2025-12 | 24B | Open weights: Apache 2.0 | 12 / 17-22 | Smaller software engineering model with vision. |
| [Ministral 3 14B](https://huggingface.co/mistralai/Ministral-3-14B-Instruct-2512) | Mistral AI | 2025-12-02 | 14B | Open weights: Apache 2.0 | 7 / 11-15 | Small dense multimodal member of the Mistral 3 family. |
| [Ministral 3 3B](https://huggingface.co/mistralai/Ministral-3-3B-Instruct-2512) | Mistral AI | 2025-12-02 | 3B | Open weights: Apache 2.0 | 1.5 / 4-7 | Small dense multimodal member of the Mistral 3 family. |
| [Ministral 3 8B](https://huggingface.co/mistralai/Ministral-3-8B-Instruct-2512) | Mistral AI | 2025-12-02 | 8B | Open weights: Apache 2.0 | 4 / 7-10 | Small dense multimodal member of the Mistral 3 family. |
| [Mistral Large 3](https://huggingface.co/mistralai/Mistral-Large-3-675B-Instruct-2512) | Mistral AI | 2025-12-02 | 675B / 41B active | Open weights: Apache 2.0 | 337.5 / 407-511 | Large multimodal MoE, replacing the dense Large 2 architecture. |
| [Mistral Small 4](https://huggingface.co/mistralai/Mistral-Small-4-119B-2603) | Mistral AI | 2026-03-16 | 119B / 6B active | Open weights: Apache 2.0 | 59.5 / 74-94 | MoE unifying reasoning, coding, and multimodal inputs. |
| [Mistral Medium 3.5](https://huggingface.co/mistralai/Mistral-Medium-3.5-128B) | Mistral AI | 2026-04-29 | 128B | Open weights: modified MIT | 64 / 79-100 | Dense multimodal model with adjustable reasoning. License has large-company exceptions. |
| [Kimi K1.5](https://github.com/MoonshotAI/Kimi-k1.5) | Moonshot AI | 2025-01-20 (report) | Undisclosed | Private / proprietary | Not available locally | Multimodal reasoning research model. Full weights were not released. |
| [Kimi-VL](https://huggingface.co/moonshotai/Kimi-VL-A3B-Instruct) | Moonshot AI | 2025-04-10 | 16B / 2.8B active | Open weights: MIT | 8 / 12-16 | Small multimodal MoE with vision understanding. |
| [Kimi-Dev 72B](https://huggingface.co/moonshotai/Kimi-Dev-72B) | Moonshot AI | 2025-06-17 | 72B | Open weights: MIT | 36 / 46-58 | Software engineering model trained for repository-level issue resolution. |
| [Kimi K2](https://huggingface.co/moonshotai/Kimi-K2-Instruct) | Moonshot AI | 2025-07-11 | 1000B / 32B active | Open weights: modified MIT | 500 / 602-754 | Trillion-parameter text MoE emphasizing coding and tool use. |
| [Kimi K2 0905](https://huggingface.co/moonshotai/Kimi-K2-Instruct-0905) | Moonshot AI | 2025-09-05 | 1000B / 32B active | Open weights: modified MIT | 500 / 602-754 | K2 instruction update with longer context. |
| [Kimi K2 Thinking](https://huggingface.co/moonshotai/Kimi-K2-Thinking) | Moonshot AI | 2025-11-06 | 1000B / 32B active | Open weights: modified MIT | 500 / 602-754 | Reasoning variant for extended tool-using tasks. |
| [Kimi K2.5](https://huggingface.co/moonshotai/Kimi-K2.5) | Moonshot AI | 2026-01-27 | 1000B / 32B active | Open weights: modified MIT | 500 / 602-754 | Native multimodal K2 generation for visual coding and agent work. |
| [Kimi K2.6](https://huggingface.co/moonshotai/Kimi-K2.6) | Moonshot AI | 2026-04-20 | 1000B / 32B active | Open weights: modified MIT | 500 / 602-754 | K2 update for longer coding tasks and visual understanding. |
| [Kimi K2.7 Code](https://huggingface.co/moonshotai/Kimi-K2.7-Code) | Moonshot AI | 2026-06-12 | 1000B / 32B active | Open weights: modified MIT | 500 / 602-754 | Coding-focused K2 release with vision and extended agent training. |
| [Kimi K3](https://huggingface.co/moonshotai/Kimi-K3) | Moonshot AI | 2026-07-16 (API), 07-27 (weights) | 2800B / 104B active | Open weights: Kimi K3 license | 1400 / 1682-2104 | Large multimodal MoE with Kimi Delta Attention and Attention Residuals. |
| [Nemotron 3 Nano](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16) | NVIDIA | 2025-12 | 30B / 3B active | Open weights: NVIDIA Nemotron license | 15 / 20-27 | Hybrid Mamba, attention, and MoE model for reasoning and agents. |
| [Nemotron 3 Super](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-BF16) | NVIDIA | 2026-03-11 | 120B / 12B active | Open weights: NVIDIA Nemotron license | 60 / 74-94 | Hybrid Mamba, attention, and MoE model for reasoning and agents. |
| [Nemotron 3.5 Lightning](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16) | NVIDIA | 2026-08-11 | 30B / 3B active | Open weights: OpenMDW 1.1 | 15 / 20-27 | Hybrid Mamba, attention, and MoE model for reasoning and agents. |
| [GPT (original)](https://github.com/openai/finetune-transformer-lm) | OpenAI | 2018-06 | 0.117B | Open weights: MIT | 0.0585 / 3-5 | Early generative pretraining model, followed by task-specific fine-tuning. |
| [GPT-2 0.124B](https://github.com/openai/gpt-2) | OpenAI | 2019-02 | 0.124B | Open weights: MIT | 0.062 / 3-5 | Staged release of a general text-completion model. Largest weights released in November. |
| [GPT-2 0.355B](https://github.com/openai/gpt-2) | OpenAI | 2019-05 | 0.355B | Open weights: MIT | 0.1775 / 3-5 | Staged release of a general text-completion model. Largest weights released in November. |
| [GPT-2 0.774B](https://github.com/openai/gpt-2) | OpenAI | 2019-08 | 0.774B | Open weights: MIT | 0.387 / 3-5 | Staged release of a general text-completion model. Largest weights released in November. |
| [GPT-2 1.5B](https://github.com/openai/gpt-2) | OpenAI | 2019-11 | 1.5B | Open weights: MIT | 0.75 / 3-6 | Staged release of a general text-completion model. Largest weights released in November. |
| [GPT-3](https://arxiv.org/abs/2005.14165) | OpenAI | 2020-05 (paper) | 175B | Private / proprietary | Not available locally | Few-shot prompting milestone. Count refers to the largest model in the paper. |
| [GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3.5-turbo) | OpenAI | 2023-03-01 | Undisclosed | Private / proprietary | Not available locally | Chat-oriented API model from the early ChatGPT era. |
| [GPT-4](https://developers.openai.com/api/docs/models/gpt-4) | OpenAI | 2023-03-14 | Undisclosed | Private / proprietary | Not available locally | Stronger instruction following and reasoning than the GPT-3.5 generation. |
| [GPT-4 Turbo](https://developers.openai.com/api/docs/models/gpt-4-turbo) | OpenAI | 2023-11-06 (preview) | Undisclosed | Private / proprietary | Not available locally | Longer-context GPT-4 variant. Vision GA followed in April 2024. |
| [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) | OpenAI | 2024-05-13 | Undisclosed | Private / proprietary | Not available locally | Omni generation combining text and image understanding with broader multimodal capabilities. |
| [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini) | OpenAI | 2024-07-18 | Undisclosed | Private / proprietary | Not available locally | Smaller hosted model for inexpensive text and vision tasks. |
| [o1-mini](https://developers.openai.com/api/docs/models/o1-mini) | OpenAI | 2024-09-12 | Undisclosed | Private / proprietary | Not available locally | Smaller reasoning model focused on math and coding. |
| [o1-preview](https://developers.openai.com/api/docs/models/o1-preview) | OpenAI | 2024-09-12 | Undisclosed | Private / proprietary | Not available locally | Early reasoning model that spends additional inference time solving problems. |
| [o1](https://developers.openai.com/api/docs/models/o1) | OpenAI | 2024-12 | Undisclosed | Private / proprietary | Not available locally | Production successor to o1-preview. |
| [o3-mini](https://developers.openai.com/api/docs/models/o3-mini) | OpenAI | 2025-01-31 | Undisclosed | Private / proprietary | Not available locally | Compact reasoning model with configurable reasoning effort. |
| [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4.5-preview) | OpenAI | 2025-02-27 (preview) | Undisclosed | Private / proprietary | Not available locally | Research preview focused on conversational knowledge and writing. |
| [GPT-4.1](https://developers.openai.com/api/docs/models/gpt-4.1) | OpenAI | 2025-04-14 | Undisclosed | Private / proprietary | Not available locally | General model emphasizing coding, instruction following, and long contexts. |
| [GPT-4.1 mini](https://developers.openai.com/api/docs/models/gpt-4.1-mini) | OpenAI | 2025-04-14 | Undisclosed | Private / proprietary | Not available locally | Smaller GPT-4.1 tier for lower-cost applications. |
| [GPT-4.1 nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) | OpenAI | 2025-04-14 | Undisclosed | Private / proprietary | Not available locally | Smallest GPT-4.1 tier for lightweight tasks. |
| [o3](https://developers.openai.com/api/docs/models/o3) | OpenAI | 2025-04-16 | Undisclosed | Private / proprietary | Not available locally | Reasoning model supporting tools and visual problem solving. |
| [o4-mini](https://developers.openai.com/api/docs/models/o4-mini) | OpenAI | 2025-04-16 | Undisclosed | Private / proprietary | Not available locally | Efficient reasoning model for math, coding, and visual tasks. |
| [o3-pro](https://developers.openai.com/api/docs/models/o3-pro) | OpenAI | 2025-06-10 | Undisclosed | Private / proprietary | Not available locally | Higher-compute o3 offering for difficult problems. |
| [gpt-oss-120b](https://huggingface.co/openai/gpt-oss-120b) | OpenAI | 2025-08-05 | 117B / 5.1B active | Open weights: Apache 2.0 | 58.5 / 73-92 | Downloadable reasoning MoE with native MXFP4 expert weights. |
| [gpt-oss-20b](https://huggingface.co/openai/gpt-oss-20b) | OpenAI | 2025-08-05 | 21B / 3.6B active | Open weights: Apache 2.0 | 10.5 / 15-20 | Downloadable reasoning MoE with native MXFP4 expert weights. |
| [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) | OpenAI | 2025-08-07 | Undisclosed | Private / proprietary | Not available locally | Reasoning generation for coding and general tool use. |
| [GPT-5 mini](https://developers.openai.com/api/docs/models/gpt-5-mini) | OpenAI | 2025-08-07 | Undisclosed | Private / proprietary | Not available locally | Smaller GPT-5 model for clearly specified tasks. |
| [GPT-5 nano](https://developers.openai.com/api/docs/models/gpt-5-nano) | OpenAI | 2025-08-07 | Undisclosed | Private / proprietary | Not available locally | Lowest-cost original GPT-5 tier for classification and summarization. |
| [GPT-5-Codex](https://developers.openai.com/api/docs/models/gpt-5-codex) | OpenAI | 2025-09 | Undisclosed | Private / proprietary | Not available locally | GPT-5 variant trained for software engineering agents. |
| [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro) | OpenAI | 2025-10-06 (API) | Undisclosed | Private / proprietary | Not available locally | Higher-compute GPT-5 offering. |
| [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1) | OpenAI | 2025-11 | Undisclosed | Private / proprietary | Not available locally | Updated general reasoning model with adaptive task effort. |
| [GPT-5.1-Codex](https://developers.openai.com/api/docs/models/gpt-5.1-codex) | OpenAI | 2025-11 | Undisclosed | Private / proprietary | Not available locally | Coding-focused GPT-5.1 variant. |
| [GPT-5.1-Codex Max](https://developers.openai.com/api/docs/models/gpt-5.1-codex-max) | OpenAI | 2025-11 | Undisclosed | Private / proprietary | Not available locally | Coding variant designed for longer software engineering work. |
| [GPT-5.1-Codex mini](https://developers.openai.com/api/docs/models/gpt-5.1-codex-mini) | OpenAI | 2025-11 | Undisclosed | Private / proprietary | Not available locally | Smaller coding-focused GPT-5.1 variant. |
| [GPT-5.2](https://developers.openai.com/api/docs/models/gpt-5.2) | OpenAI | 2025-12 | Undisclosed | Private / proprietary | Not available locally | Successor targeting professional knowledge work and coding. |
| [GPT-5.2 Pro](https://developers.openai.com/api/docs/models/gpt-5.2-pro) | OpenAI | 2025-12 | Undisclosed | Private / proprietary | Not available locally | Higher-compute GPT-5.2 offering. |
| [GPT-5.2-Codex](https://developers.openai.com/api/docs/models/gpt-5.2-codex) | OpenAI | 2025-12 | Undisclosed | Private / proprietary | Not available locally | GPT-5.2 variant for agentic software engineering. |
| [GPT-5.3-Codex](https://developers.openai.com/api/docs/models/gpt-5.3-codex) | OpenAI | 2026-02 | Undisclosed | Private / proprietary | Not available locally | Coding and computer-use model for extended agent work. |
| [GPT-5.3 Instant](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) | OpenAI | 2026-03 | Undisclosed | Private / proprietary | Not available locally | Conversational model exposed through a chat-oriented alias. |
| [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4) | OpenAI | 2026-03-05 | Undisclosed | Private / proprietary | Not available locally | General professional model combining reasoning, coding, and computer use. |
| [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) | OpenAI | 2026-03-05 | Undisclosed | Private / proprietary | Not available locally | Higher-compute GPT-5.4 offering. |
| [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) | OpenAI | 2026-03-17 | Undisclosed | Private / proprietary | Not available locally | Smaller GPT-5.4 tier for higher-volume work. |
| [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) | OpenAI | 2026-03-17 | Undisclosed | Private / proprietary | Not available locally | Lightweight GPT-5.4 tier for simple tasks. |
| [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) | OpenAI | 2026-04-24 (API) | Undisclosed | Private / proprietary | Not available locally | Professional reasoning model with text and image inputs. |
| [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) | OpenAI | 2026-04-24 (API) | Undisclosed | Private / proprietary | Not available locally | Higher-compute GPT-5.5 offering. |
| [GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna) | OpenAI | 2026-07-09 (GA) | Undisclosed | Private / proprietary | Not available locally | Smallest GPT-5.6 tier for fast, high-volume work. |
| [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) | OpenAI | 2026-07-09 (GA) | Undisclosed | Private / proprietary | Not available locally | Flagship GPT-5.6 tier for complex professional tasks. |
| [GPT-5.6 Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra) | OpenAI | 2026-07-09 (GA) | Undisclosed | Private / proprietary | Not available locally | Middle GPT-5.6 tier balancing capability and cost. |
| [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra) | OpenAI | 2026-09-03 | Undisclosed | Private / proprietary | Not available locally | Higher-capability GPT-6 tier for complex reasoning, research, coding, and computer use. |
| [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna) | OpenAI | 2026-09-22 | Undisclosed | Private / proprietary | Not available locally | Lower-cost GPT-6 reasoning model accepting text and image inputs. |
| [GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol) | OpenAI | 2026-09-22 | Undisclosed | Private / proprietary | Not available locally | GPT-6 reasoning model accepting text and image inputs. |
| [InternLM2 20B](https://huggingface.co/internlm/internlm2-chat-20b) | Shanghai AI Laboratory | 2024-01 | 20B | Open weights: InternLM license | 10 / 14-19 | Bilingual long-context model. |
| [InternLM2 7B](https://huggingface.co/internlm/internlm2-chat-7b) | Shanghai AI Laboratory | 2024-01 | 7B | Open weights: InternLM license | 3.5 / 7-10 | Bilingual long-context model. |
| [Step 3.5 Flash](https://huggingface.co/stepfun-ai/Step-3.5-Flash) | StepFun | 2026-02 | 196.81B / 11B active | Open weights: Apache 2.0 | 98.405 / 121-152 | Sparse MoE emphasizing reasoning, coding, and agent tasks. |
| [Hunyuan-Large](https://huggingface.co/tencent/Tencent-Hunyuan-Large) | Tencent | 2024-11 | 389B / 52B active | Open weights: Tencent Hunyuan | 194.5 / 236-296 | Large bilingual MoE. |
| [Hunyuan-A13B](https://huggingface.co/tencent/Hunyuan-A13B-Instruct) | Tencent | 2025-06-27 (weights) | 80B / 13B active | Open weights: Tencent Hunyuan | 40 / 50-64 | Smaller hybrid-thinking MoE. |
| [Falcon 40B](https://huggingface.co/tiiuae/falcon-40b) | TII | 2023-05 | 40B | Open weights: Apache 2.0 | 20 / 26-34 | Larger first-generation Falcon text model. |
| [Falcon 7B](https://huggingface.co/tiiuae/falcon-7b) | TII | 2023-05 | 7B | Open weights: Apache 2.0 | 3.5 / 7-10 | TII text model trained on RefinedWeb. |
| [Falcon 180B](https://huggingface.co/tiiuae/falcon-180B) | TII | 2023-09-06 | 180B | Open weights: Falcon 180B TII license | 90 / 110-139 | Large dense Falcon with custom use and hosting terms. |
| [Falcon 3 10B](https://huggingface.co/tiiuae/Falcon3-10B-Instruct) | TII | 2024-12 | 10B | Open weights: Falcon-LLM license | 5 / 8-12 | Compact Falcon generation for efficient text inference. |
| [Falcon 3 1B](https://huggingface.co/tiiuae/Falcon3-1B-Instruct) | TII | 2024-12 | 1B | Open weights: Falcon-LLM license | 0.5 / 3-5 | Compact Falcon generation for efficient text inference. |
| [Falcon 3 3B](https://huggingface.co/tiiuae/Falcon3-3B-Instruct) | TII | 2024-12 | 3B | Open weights: Falcon-LLM license | 1.5 / 4-7 | Compact Falcon generation for efficient text inference. |
| [Falcon 3 7B](https://huggingface.co/tiiuae/Falcon3-7B-Instruct) | TII | 2024-12 | 7B | Open weights: Falcon-LLM license | 3.5 / 7-10 | Compact Falcon generation for efficient text inference. |
| [Falcon-H1 0.5B](https://huggingface.co/tiiuae/Falcon-H1-0.5B-Instruct) | TII | 2025-05-21 | 0.5B | Open weights: Falcon-LLM license | 0.25 / 3-5 | Hybrid state-space and attention model. |
| [Falcon-H1 1.5B](https://huggingface.co/tiiuae/Falcon-H1-1.5B-Instruct) | TII | 2025-05-21 | 1.5B | Open weights: Falcon-LLM license | 0.75 / 3-6 | Hybrid state-space and attention model. |
| [Falcon-H1 34B](https://huggingface.co/tiiuae/Falcon-H1-34B-Instruct) | TII | 2025-05-21 | 34B | Open weights: Falcon-LLM license | 17 / 23-30 | Hybrid state-space and attention model. |
| [Falcon-H1 3B](https://huggingface.co/tiiuae/Falcon-H1-3B-Instruct) | TII | 2025-05-21 | 3B | Open weights: Falcon-LLM license | 1.5 / 4-7 | Hybrid state-space and attention model. |
| [Falcon-H1 7B](https://huggingface.co/tiiuae/Falcon-H1-7B-Instruct) | TII | 2025-05-21 | 7B | Open weights: Falcon-LLM license | 3.5 / 7-10 | Hybrid state-space and attention model. |
| [Grok-1 (weights)](https://huggingface.co/xai-org/grok-1) | xAI | 2024-03-17 | 314B | Open weights: Apache 2.0 | 157 / 191-240 | Base MoE weights, distinct from the hosted Grok assistant. |
| [Grok-1.5](https://x.ai/news/grok-1.5) | xAI / SpaceXAI | 2024-03 | Undisclosed | Private / proprietary | Not available locally | Hosted successor with longer context and improved reasoning. |
| [Grok-2](https://huggingface.co/xai-org/grok-2) | xAI / SpaceXAI | 2024-08 (hosted), 2025-08 (weights) | Undisclosed | Open weights: Grok 2 community | Q4 unknown. Published recipe: 8 GPUs, each >40 GB | Grok-2 weights released after hosted launch. Publisher provides an FP8 deployment recipe. |
| [Grok-3](https://x.ai/news/grok-3) | xAI / SpaceXAI | 2025-02 | Undisclosed | Private / proprietary | Not available locally | Grok generation introducing stronger reasoning modes. |
| [Grok-3 mini](https://x.ai/news/grok-3) | xAI / SpaceXAI | 2025-02 | Undisclosed | Private / proprietary | Not available locally | Smaller hosted reasoning model. |
| [Grok-4](https://x.ai/news/grok-4) | xAI / SpaceXAI | 2025-07-09 | Undisclosed | Private / proprietary | Not available locally | Reasoning model integrated with live search and tools. |
| [Grok-4 Fast](https://x.ai/news/grok-4-fast) | xAI / SpaceXAI | 2025-09 | Undisclosed | Private / proprietary | Not available locally | Efficient hosted model with reasoning and non-reasoning modes. |
| [Grok-4.1](https://x.ai/news/grok-4-1) | xAI / SpaceXAI | 2025-11 | Undisclosed | Private / proprietary | Not available locally | Grok update focused on conversation and reliability. |
| [Grok-4.20](https://docs.x.ai/developers/models/grok-4.20) | xAI / SpaceXAI | 2026-03-10 (API) | Undisclosed | Private / proprietary | Not available locally | Hosted Grok release alongside a multi-agent offering. |
| [Grok-4.5](https://docs.x.ai/developers/models/grok-4.5) | xAI / SpaceXAI | 2026-07-08 (API) | Undisclosed | Private / proprietary | Not available locally | Hosted model emphasizing coding, agents, and knowledge work. |
| [Grok-4.6](https://docs.x.ai/developers/models/grok-4.6) | xAI / SpaceXAI | 2026-08-12 (API) | Undisclosed | Private / proprietary | Not available locally | Hosted coding and reasoning model with text and image inputs. |
| [ChatGLM-6B](https://huggingface.co/THUDM/chatglm-6b) | Z.ai / Zhipu AI | 2023-03 | 6B | Open weights: ChatGLM model license | 3 / 6-9 | Early bilingual chat model. |
| [ChatGLM2-6B](https://huggingface.co/THUDM/chatglm2-6b) | Z.ai / Zhipu AI | 2023-06 | 6B | Open weights: ChatGLM model license | 3 / 6-9 | Updated bilingual model with longer context. |
| [ChatGLM3-6B](https://huggingface.co/THUDM/chatglm3-6b) | Z.ai / Zhipu AI | 2023-10 | 6B | Open weights: ChatGLM model license | 3 / 6-9 | ChatGLM generation adding tool-use capabilities. |
| [GLM-4-9B](https://huggingface.co/THUDM/glm-4-9b-chat) | Z.ai / Zhipu AI | 2024-06 | 9B | Open weights: GLM-4 license | 4.5 / 8-11 | Compact multilingual instruction model. |
| [GLM-4.5](https://huggingface.co/zai-org/GLM-4.5) | Z.ai / Zhipu AI | 2025-07 | 355B / 32B active | Open weights: MIT | 177.5 / 215-271 | Large MoE for reasoning, coding, and agents. |
| [GLM-4.5-Air](https://huggingface.co/zai-org/GLM-4.5-Air) | Z.ai / Zhipu AI | 2025-07 | 106B / 12B active | Open weights: MIT | 53 / 66-84 | Smaller GLM-4.5 MoE. |
| [GLM-4.6](https://huggingface.co/zai-org/GLM-4.6) | Z.ai / Zhipu AI | 2025-09 | 355B / 32B active | Open weights: MIT | 177.5 / 215-271 | GLM update for longer coding and tool-use tasks. |
| [GLM-4.7](https://huggingface.co/zai-org/GLM-4.7) | Z.ai / Zhipu AI | 2025-12 | 355B / 32B active | Open weights: MIT | 177.5 / 215-271 | GLM update emphasizing coding and agent behavior. |
| [GLM-5](https://huggingface.co/zai-org/GLM-5) | Z.ai / Zhipu AI | 2026-02 | 744B / 40B active | Open weights: MIT | 372 / 449-562 | Larger sparse-attention MoE for systems engineering. |
| [GLM-5.1](https://huggingface.co/zai-org/GLM-5.1) | Z.ai / Zhipu AI | 2026-04 | 744B / 40B active | Open weights: MIT | 372 / 449-562 | Post-training update for extended engineering tasks. |
| [GLM-5.2](https://huggingface.co/zai-org/GLM-5.2) | Z.ai / Zhipu AI | 2026-06 | 744B / 40B active | Open weights: MIT | 372 / 449-562 | GLM generation with a million-token context and revised attention indexing. |
| [GLM-5.3](https://huggingface.co/zai-org/GLM-5.3) | Z.ai / Zhipu AI | 2026-08 | 744B / 40B active | Open weights: GLM-5.3 license | 372 / 449-562 | Post-training successor using the GLM-5.2 base. License differs from 5.2. |
| [GLM-5.3-Flash](https://huggingface.co/zai-org/GLM-5.3-Flash) | Z.ai / Zhipu AI | 2026-08 | 320B / 18B active | Open weights: MIT | 160 / 194-244 | Native multimodal GLM with sparse and linear attention. |

## What the comparison tells you

Astra, Sol, and Luna are model tiers within OpenAI's named generations. They are not separate labs. GPT-5.6 Sol and GPT-6 Sol are different releases, while changing the reasoning effort of one model does not establish a new parameter count. Google's Project Astra is also a different use of the word Astra, so a bare name is not enough to identify a model.

Llama and Gemma illustrate why licenses belong on individual rows. Their generations do not all use the same terms. The same is true of GLM and MiniMax updates. The existence of older open weights does not imply that a provider's newest hosted model is downloadable.

A local deployment decision starts with the exact checkpoint and your memory budget. A quality comparison starts with the task, evaluation method, and inference settings. More total parameters can increase storage without producing a proportional improvement on your task. More active parameters can increase computation without revealing the training data or post-training quality.

Descriptions identify what each release was designed to do. They do not rank all models on a common benchmark. For a meaningful quality comparison, hold the prompts, tool access, reasoning budget, and evaluation criteria constant. See [evaluation methodology](../benchmarks/evaluation-and-methods/) for the differences between a model score and the performance of a complete agent system.

## References

The model links in the table are the primary references for individual entries. Release histories help distinguish a model launch from a later update to its card: [OpenAI's API changelog](https://developers.openai.com/api/docs/changelog), [DeepSeek's release log](https://api-docs.deepseek.com/updates/), [Kimi's research archive](https://www.kimi.com/en/blog/), [Meta's Llama release table](https://github.com/meta-llama/llama-models), [Qwen's release history](https://github.com/QwenLM/Qwen3.5), and [Gemma's release notes](https://ai.google.dev/gemma/docs/releases).

For deployment, the linked model cards and their license files take precedence over a family label. The [Hugging Face quantization documentation](https://huggingface.co/docs/transformers/quantization/bitsandbytes) and [cache guide](https://huggingface.co/docs/transformers/kv_cache) support the memory discussion. The numeric planning range is this page's stated heuristic, not a requirement published by those sources.

## Related topics

- [LLM reasoning benchmarks and metrics](../benchmarks/): how model capabilities are evaluated.
- [Model distillation](../model-distillation/): how smaller models learn from larger ones.
- [Natural language processing](../natural-language-processing/): the wider field surrounding language models.
- [Context window management](../prompt-engineering/context-window-management/): fitting useful information into a model's context.
