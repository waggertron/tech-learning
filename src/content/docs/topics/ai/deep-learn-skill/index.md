---
title: "Deep Learn: a research-grounded teaching skill for Claude Code"
description: "A Claude Code skill that implements 15 learning science patterns: spaced retrieval, curiosity hooks, scaffold-fade, and misconception confrontation."
category: ai
tags: [ai, learning-science, claude-code, spaced-repetition, retrieval-practice]
status: draft
created: 2026-05-14
updated: 2026-05-14
---

Most AI-assisted learning is passive: the model explains, the human reads, nothing sticks. Deep Learn is a Claude Code skill that inverts this. It is grounded in cognitive science research on what actually produces durable retention, and it applies those findings mechanically to every teaching session.

The short version: retrieval practice beats rereading by 2x at one week (Roediger & Karpicke 2006). Spacing beats cramming by d=0.46-0.80 (Cepeda et al. 2006, 254 studies). Pre-questions before explanations improve encoding by d=0.43 even at 0% accuracy (Kornell et al. 2009). The skill enforces all of this, automatically, every session.

## What it does

Deep Learn runs structured learning sessions with a fixed protocol derived from 15 research-backed learning patterns:

1. **Check the log first.** Before any new content, review what is overdue for spaced retrieval.
2. **Diagnose prior knowledge.** Three probe questions before any explanation. Determines the scaffolding level.
3. **Curiosity hook.** An information gap before every explanation. Never explain without first making the learner feel the question.
4. **Teach at the right level.** Full worked examples for novices, problem-only for advanced. Scaffold fades as expertise grows.
5. **Immediate retrieval.** Three questions after every concept. Blank page. No hints.
6. **Mastery criterion.** Three consecutive correct retrievals before moving on.
7. **Explain it back.** The learner must explain the concept in plain language before advancing. The breakdown point is the learning target.
8. **Confidence tracking.** Every answer gets a confidence rating (1-5). Calibration improves over sessions.
9. **Misconception confrontation.** High-confidence wrong answers get special treatment: expose the reasoning, show a case the wrong model can't explain, then correct.
10. **Transfer test.** Apply the concept to a context not seen in the session.
11. **Log and schedule.** Score recorded, next review date calculated.

Spaced review scheduling:

| Score | Meaning | Next review |
|---|---|---|
| 1 | Failed, blank | 1 day |
| 2 | Partial, major gaps | 2 days |
| 3 | Mostly right | 4 days |
| 4 | Correct, minor uncertainty | 10 days |
| 5 × 3 consecutive | Mastered | 30 days |

After mastery: 30 days → 90 days → 1 year.

## How to use it

The skill is generic. It works with any markdown knowledge base by reading the repo's topic index. It is not hard-coded to this repo.

**Install:** Copy `.claude/skills/deep-learn/SKILL.md` from this repo into your own project's `.claude/skills/deep-learn/SKILL.md`. Add `.claude/skills/deep-learn/SKILL.md` to your gitignore exceptions if you want to commit it.

**Invoke:**

```
deep-learn hash-tables          # new topic session
deep-learn review               # work through overdue items
deep-learn quiz                 # interleaved quiz across mixed concepts
deep-learn audit                # scan log for gaps
```

The skill reads and writes `.claude/deep-learn-log.md` (project-local, not committed by default) to track every concept with its score, confidence, consecutive-correct count, and next review date.

## Why the protocol is this strict

The research explains why the protocol does not let the learner choose their own path:

**The fluency illusion.** 84% of students list rereading as their primary study strategy; only 11% mention self-testing (Karpicke et al. 2009). Rereading produces processing fluency: the material flows easily and gets mistaken for mastery. Correlation between confidence and recall after rereading: r ≈ 0.20. After self-testing: r ≈ 0.65 (Koriat et al. 2004).

**The preference inversion.** In Kornell & Bjork (2008), 85% of participants rated blocked practice as more effective despite interleaved practice producing 78% vs. 50% correct on the final test. Learner preference is anti-correlated with learning effectiveness at several key decision points. The protocol overrides preference in service of retention.

**The forward effect.** Being asked a question you cannot answer, with a guaranteed wrong answer, still improves subsequent learning from the explanation that follows (d=0.43). The question creates an epistemic gap. The explanation fills it. Without the gap, the explanation encodes shallowly.

**Bjork's SS/RS theory.** Storage strength (how well something is consolidated) and retrieval strength (how accessible it is right now) are separate. The lower the current retrieval strength, the greater the storage strength gain from a successful retrieval event. Spacing works because it lets retrieval strength drop before demanding retrieval again. That difficulty is the consolidation signal. The protocol trusts that signal.

## The skill file

The full skill with all 15 patterns, question templates by level, adaptation rules, and log format is at `.claude/skills/deep-learn/SKILL.md` in this repo. You can also find a standalone copy at `skills/deep-learn.md` in the root of the repo.

The research foundation is at `docs/learning-science.md`: 629 lines covering the cognitive science of memory, evidence-based techniques with effect sizes, motivation and curiosity, quizzing science, and instructional design.

## References

- [docs/learning-science.md](https://github.com/waggertron/tech-learning/blob/main/docs/learning-science.md), the full research synthesis
- Roediger & Karpicke (2006), *Psychological Science*, testing effect (80% vs 40%)
- Cepeda et al. (2006), *Psychological Bulletin*, spacing meta-analysis (254 studies)
- Kornell & Bjork (2008), *Psychological Science*, interleaving (78% vs 50%)
- Bjork & Bjork (1992), New Theory of Disuse, storage vs. retrieval strength
- Rawson & Dunlosky (2011), *JEP:General*, mastery criterion (3 consecutive correct → 80% retention)

## Related topics

- [AI text tells](../ai-text-markers/), what AI-generated text looks like and why
- [AI Harness Development](../harness-development/), building the scaffolding around an LLM
- [LLMs vs. agentic AI vs. AI agents](../llm-vs-agentic-ai/), the three distinct concepts
