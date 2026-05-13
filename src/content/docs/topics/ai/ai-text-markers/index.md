---
title: "AI text tells: markers, patterns, and why models produce them"
description: "A catalog of patterns that reveal LLM-generated text, each explained by the training data distribution or RLHF incentive that produced it."
category: ai
tags: [ai, llm, text-generation, rlhf, training-data, detection]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

LLMs write in a recognizable voice. Not because the training objective said "write like an LLM," but because specific patterns in training data and human feedback loops created systematic biases in what the model reaches for. This page catalogs the most common surface signals and, more usefully, explains the mechanism that produces each one.

Knowing the mechanism is more useful than knowing the pattern. Patterns change as models improve and as prompt engineers actively suppress them. The underlying causes are structural and harder to patch.

## Two root causes

Most AI text tells trace back to one of two mechanisms.

**Training data distribution.** The model assigns higher probability to sequences it saw often in training. A phrase that appeared in 10,000 Wikipedia introductions will be overrepresented relative to a phrase that appeared in 40. The model isn't choosing the phrase consciously; it's following the gradient of its training distribution.

**RLHF shaping.** After pretraining, models are fine-tuned using human feedback. Raters rewarded responses that felt helpful, readable, complete, and safe. That feedback loop amplified certain patterns: affirmative openers, hedging language, clean structure, balanced conclusions. The model learned that these forms correlate with positive ratings, independent of whether they improve communication.

A smaller factor is tokenization: some characters and word sequences are tokenized in ways that make them statistically cheaper to produce, slightly biasing the distribution toward them.

## Training data markers

These patterns trace back to the composition of the pretraining corpus. LLMs are trained on large slabs of edited English prose: Wikipedia, journalism, academic papers, books, GitHub READMEs, forum posts, corporate blogs, and product documentation. Each source contributes its stylistic register to the model's output distribution.

**Em-dashes.** High-quality edited prose uses em-dashes heavily. Wikipedia, journalism, and literary nonfiction all do. The em-dash became the model's default connective tissue for linking two related clauses without committing to a stronger logical relationship ("because," "therefore," "but"). In most tokenizers the em-dash is also a single token, which makes it slightly cheap to produce relative to alternatives like a semicolon followed by a fresh clause. The result is em-dashes in contexts where a comma, semicolon, or period would be cleaner. This is the tell that launched a thousand detection heuristics.

**"Delve."** Rare in casual English; common in a particular register of academic and exploratory writing. "Let us delve into the mechanisms..." showed up in training data from textbooks, scholarly articles, and formal documentation. The model pattern-matched this phrase to the context of beginning an explanation of a complex topic and reaches for it in exactly those situations. It is now so associated with LLM output that several style guides flag it as a near-definitive marker.

**Abstract container metaphors: "landscape," "ecosystem," "tapestry," "space."** Tech and business writing is saturated with these. "The AI landscape," "the startup ecosystem," "a rich tapestry of approaches," "the problem space." The model saw these phrases whenever a writer wanted to gesture at a large, complex domain without being specific. Reproducing them feels sophisticated to the model; it reads as evasive or empty to a human reader.

**"Unlock" as a verb.** Product marketing, investor decks, and tech blog posts use "unlock" to mean make newly possible. "Unlock new capabilities," "unlock value," "unlock the full potential of." This register dominates certain training data slices. The model produces it whenever it wants to signal that a technique enables something previously unavailable.

**The rule of three.** English rhetoric has a strong statistical preference for lists of exactly three items. Speeches, essays, advertising copy, and news articles all use it. The model absorbed this pattern and applies it everywhere: three bullet points, three code examples, three alternatives. If you ask for "some examples" you often get exactly three. This is a training data frequency effect, not a deliberate choice.

**Formulaic transitions: "Furthermore," "Moreover," "Additionally," "In addition."** Academic essay writing, the genre heavily represented in formal training data, uses these transitions constantly. The five-paragraph essay structure, intro plus three body paragraphs with transitions plus conclusion, is deeply embedded in the model's learned prose structure. These transitions show up even in conversational outputs that have no reason to read like a term paper.

**Hedged abstractions: "nuanced," "multifaceted," "complex interplay."** These phrases appear in peer reviews, editorial commentary, and academic analysis when a writer wants to signal careful qualification. The model learned them as markers of sophisticated writing and applies them when the context calls for acknowledging complexity. They almost always add no information: saying something is "nuanced" is different from actually representing the nuance.

**"Leverage" as a verb.** Business English uses "leverage" to mean use strategically. It saturates corporate blogs, LinkedIn posts, consulting reports, and tech documentation. The model reaches for it in contexts where a simpler "use" or "apply" would work.

**"Tapestry of" and "at the intersection of."** The phrase "at the intersection of X and Y" comes from academic abstracts and grant proposals trying to claim novel territory. "A tapestry of" comes from cultural journalism. Both signal training data from those specific genres. They read as inflated when the underlying claim is straightforward.

## RLHF markers

These patterns were amplified during fine-tuning. Human raters scored model outputs, and the scoring incentives shaped what the model learned to produce, independent of whether the patterns actually make writing better.

**Affirming openers: "Certainly!" / "Of course!" / "Absolutely!" / "Great question!"** Raters rewarded responses that felt warm, engaged, and helpful. Openers that acknowledged the question positively correlated with higher ratings. The model learned this as a generic strategy. These openers add nothing and immediately read as AI-generated to anyone who has seen them a few hundred times. Many providers now explicitly suppress them in system prompts, which is why they are less common in current flagship models but still appear in fine-tuned variants and smaller models.

**Pervasive hedging.** Raters penalized confident wrong answers. The model learned to hedge almost everything: "this can help," "may improve performance," "might be useful in some cases." The hedges are applied uniformly, not calibrated to actual uncertainty. A claim the model is highly confident about and a claim it is genuinely uncertain about receive the same "might." This produces prose that feels evasive even when the underlying information is sound.

**Bullet-point overuse.** Structured responses with clear formatting were consistently rated as more readable by raters. The model learned that bullets and numbered lists correlate with positive feedback. It now defaults to bullets even when a flowing paragraph would communicate better. Two-word bullet points that require more context to interpret than a sentence would have given are the extreme case.

**Restating the question.** "You asked about X. X is an important consideration because..." Raters rewarded responses that clearly addressed the specific question asked. The model learned to signal relevance by restating the question first. In longer responses it sometimes restates the question in the opening, in a transitional paragraph, and again in the conclusion.

**False balance.** Raters penalized responses that took strong stances on contested topics. The model learned to present both sides: "on one hand... on the other hand..." This persists even when one side is clearly better supported, producing artificial evenhandedness. The tell is when the model's balanced treatment makes options look equivalent that are not.

**Formal conclusion sections.** The essay structure, intro plus body plus conclusion, was heavily represented in training data and raters rated complete-feeling responses higher. The model learned to wrap up with a summary paragraph, often starting with "In summary," "In conclusion," or "To summarize." These sections almost always restate what was just said without adding anything.

**Enthusiasm markers: "exciting," "fascinating," "remarkable," "powerful."** Raters rewarded engaged-sounding responses. The model learned enthusiasm as a performance: labeling things as exciting or remarkable to signal interest. The tell is that everything in the response tends to be remarkable, which means nothing actually is.

**Diplomatic softening of criticism.** Raters penalized blunt negative feedback. The model learned to wrap any criticism in affirmation: "That's a good approach, though you might consider..." A human expert would often just say what is wrong. The sandwich structure (positive, concern, positive) is an RLHF artifact.

## Generation-level patterns

These emerge from how autoregressive generation works, not specifically from training content.

**Uniform sentence length.** Human writing has high variance in sentence length: short punchy sentences mixed with long complex ones. Autoregressive models generate token by token, and medium-length sentences dominate the training distribution. The result is output with suspiciously consistent sentence lengths. A paragraph that looks measured and even has a good chance of being generated rather than written.

**Rigid parallel structure.** When the model starts a list, it locks into the grammatical form of the first item and applies it uniformly. Every bullet becomes "Verb the noun" or "Noun: explanation." Human lists are messier; writers break parallel structure when the content calls for it. Perfect parallelism at scale is a generation artifact.

**Vocabulary smoothing.** LLMs generate the highest-probability next token conditioned on context. Unusual words, idiomatic constructions, and vivid specific verbs are lower-probability. The model gravitates toward common, slightly formal vocabulary: "demonstrate" over "show," "utilize" over "use," "implement" over "build." The output sounds educated but generic.

**Repetition of structure across sections.** Within a longer response, the model often reproduces the same structural skeleton for each section: opening sentence, two or three bullets, closing sentence. Human writers vary structure based on content needs. Structural repetition at scale indicates the model is applying a template rather than fitting structure to content.

## What this doesn't catch

Better models are actively tuned to suppress the most prominent surface-level tells. RLHF specifically penalizes patterns that annotators flag as AI-sounding. GPT-4o, Claude Sonnet, and Gemini 1.5 produce measurably fewer of these tells than earlier models.

This means the markers above are more reliable for detecting output from weaker models or untuned base models. A skilled prompt engineer can also suppress many of them explicitly: "Write in a direct, conversational tone. No bullet points. No affirming openers."

Markers are not proof. A human writer trained in formal academic prose will produce many of these patterns. A journalist at a publication that favors em-dashes will use them. Markers shift the prior; they don't determine the posterior.

Detection classifiers (GPTZero, Originality.ai, Turnitin's AI detector) combine these surface patterns with perplexity and burstiness scores derived from the model's own probability distribution. They have measurable false-positive rates, particularly on text by non-native English speakers and on formal academic prose.

## References

- [Guo et al., "How Close is ChatGPT to Human Experts?" (arXiv 2301.07597)](https://arxiv.org/abs/2301.07597), early statistical comparison of AI and human text distributions
- [Mitchell et al., "DetectGPT: Zero-Shot Machine-Generated Text Detection" (ICML 2023)](https://arxiv.org/abs/2301.11305), the perplexity-based detection approach
- [Perez-Rosas et al., "Automatic Detection of Machine Generated Text: A Critical Survey" (ACL 2023)](https://aclanthology.org/2023.acl-long.35/), coverage of surface markers and statistical methods
- [Chakraborty et al., "On the Possibilities of AI-Generated Text Detection" (arXiv 2304.04736)](https://arxiv.org/abs/2304.04736), detection limits and adversarial suppression
- [Ouyang et al., "Training language models to follow instructions with human feedback" (InstructGPT, arXiv 2203.02155)](https://arxiv.org/abs/2203.02155), how RLHF shaped chatbot behavior and which patterns it amplifies
- [Christiano et al., "Deep Reinforcement Learning from Human Preferences" (NeurIPS 2017)](https://arxiv.org/abs/1706.03741), the RLHF foundation paper

## Related topics

- [AI Coding Tool Blindspots](../coding-tool-blindspots/), failure modes that trace back to the same training dynamics
- [Prompt Engineering](../prompt-engineering/), the inverse problem: how to reliably shape LLM output
- [LLM reasoning benchmarks and metrics](../benchmarks/), how training dynamics affect benchmark performance
