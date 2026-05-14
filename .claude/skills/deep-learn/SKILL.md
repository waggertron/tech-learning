# Deep Learn

A teaching skill grounded in learning science research. Implements spaced retrieval, interleaving, curiosity hooks, calibrated difficulty, and misconception confrontation to produce deep, durable understanding — not surface familiarity.

## When to Trigger

- "teach me X" / "I want to learn X" / "explain X deeply"
- "deep learn" / "deep dive on X"
- "review" / "what should I review?" / "spaced review"
- "quiz me" with no further context (uses interleaved review mode)
- Starting a session after an absence: "let's study"
- Any request for structured, retained learning (not a quick lookup)

**Do NOT trigger** for: quick reference questions, debugging help, one-off lookups, or when the user just wants a brief answer.

## Philosophy (from `docs/learning-science.md`)

The most effective learning interventions are the ones least likely to be chosen voluntarily. Learners prefer re-reading; testing is better. Learners prefer blocked practice; interleaving is better. Learners prefer easy questions; 85%-difficulty is optimal. Learners prefer immediate explanations; questions-before-answers produces better encoding.

This skill overrides comfort in service of retention. Always.

---

## Session Types

### 1. New Topic (`deep-learn <topic>`)
Learn a concept for the first time or relearn from scratch.

### 2. Spaced Review (`deep-learn review`)
Work through concepts whose next-review date is today or past. Retrieval only — no re-teaching until after the attempt.

### 3. Interleaved Quiz (`deep-learn quiz`)
Mixed questions across multiple concepts. Forces category discrimination. Calibrates confidence.

### 4. Audit (`deep-learn audit`)
Scan the log for mastery gaps, overdue items, and concepts with < 3 consecutive correct retrievals.

---

## Session Protocol

### PHASE 0: Check the Log (always first)

Before doing anything else, read `.claude/deep-learn-log.md`.

- Are there items with `next_review` today or earlier? → Start with those before introducing new content.
- Count overdue items. If > 5 overdue, run a review session rather than new material.
- Identify the learner's current level on the requested topic (novice/intermediate/advanced) from the log.

If the log doesn't exist yet, create it. Format is in the Tracking section below.

---

### PHASE 1: Diagnose (2-3 min)

**Pattern 4 (Question Before Answer) + Pattern 7 (Calibrate the Confidence)**

Before explaining anything, probe with 2-3 questions the learner cannot look up:

- One factual: "What is X?"
- One relational: "Why does X cause Y?"
- One application: "When would you use X instead of Z?"

For each, ask them to rate confidence (1-5) *before* revealing whether they were correct.

Do not grade these in real time — just collect the responses. They determine what level of scaffolding to use.

**Level assignment:**
- Blank on all three → Novice
- Partial correct → Early Intermediate
- Mostly correct → Intermediate
- All correct with good reasoning → Advanced

---

### PHASE 2: Open the Gap (1 min)

**Pattern 9 (Curiosity Hook)**

Never start with "Here's how X works." Start with a question, paradox, or problem that the concept solves.

Examples of gap-openers:
- "Before I explain this: why do you think [counterintuitive thing] happens?"
- "Here's a problem: [scenario]. What would you do? Take 30 seconds."
- "What would break if [concept] didn't exist?"

Let it sit for 10-30 seconds. The discomfort of not knowing is the encoding trigger.

---

### PHASE 3: Teach (5-10 min)

**Pattern 5 (Scaffold Then Fade) + Pattern 13 (Anchor to Story) + Pattern 10 (Vary the Surface)**

Calibrate depth to the diagnosed level:

**Novice:** Full worked example. Every step shown, annotated with *why*. No jargon without immediate definition. Analogy to something the learner already knows.

**Early Intermediate:** Worked example with the last step omitted. Learner completes it.

**Intermediate:** Setup only. Learner derives the solution with minimal hints.

**Advanced:** Problem statement only. No setup. Learner solves, then compares reasoning.

Structure of the explanation:
1. **Anchor:** A concrete scenario where this concept is the key. A practitioner's actual problem — not a toy example.
2. **The concept:** Name it, define it, explain the mechanism.
3. **Two varied examples:** Same underlying principle, different surface form. Explicitly say: "Same principle, different surface."
4. **The misconception:** The most common wrong intuition about this concept. State it, then refute it. Don't skip this.

After each major point, add a self-explanation prompt: "Why does this work this way? What would happen if it didn't?"

---

### PHASE 4: Retrieve (3-5 min)

**Pattern 1 (Retrieval First) + Pattern 12 (Optimal Challenge Window)**

Three retrieval questions in sequence. No hints, no re-reading. Blank paper.

Format: one recall, one relational, one application.

Track confidence on each (1-5 before answer revealed).

**Mastery criterion: 3 consecutive correct.** If the third attempt fails, restart the count.

Difficulty calibration:
- 3 correct in a row → increase difficulty for next question
- 2 consecutive errors → drop difficulty one level
- Target: 85% success rate across questions in the session

---

### PHASE 5: Explain It Back (3-5 min)

**Pattern 11 (Explain It Back)**

"Now explain this to me as if you're teaching someone who has never encountered it. Use your own words, not mine."

Do not allow jargon without definition. Ask "what does that mean?" for every technical term they use.

When the explanation breaks down:
1. Note exactly where it broke.
2. Do not re-explain immediately — ask "what would you need to know to continue the explanation?"
3. Only then fill the specific gap.
4. Have them continue the explanation from the gap point.

The breakdown location is the primary learning target for the next session.

---

### PHASE 6: Misconception Check (2 min, if relevant)

**Pattern 15 (Misconception Confrontation) + Pattern 8 (Correct the Confident Error)**

If a high-confidence error occurred (confidence 4-5, answer wrong):

1. Ask for their reasoning: "Walk me through why you thought that."
2. Find the specific wrong premise in their reasoning.
3. Create dissatisfaction: show a case their model cannot explain.
4. Provide the correct model, explicitly connecting it to the failed prediction.
5. Re-test the same concept before ending the session.

Do not just give the right answer. The misconception will survive a fact-correction but not a reasoning-confrontation.

---

### PHASE 7: Transfer Test (2 min)

**Pattern 10 (Vary the Surface)**

One question applying the concept in a context the learner has not seen in this session.

"Same principle — different scenario. You haven't seen this specific case before. Take 60 seconds."

If they succeed: mastery is confirmed for this session.
If they fail: mark for focused review. The concept is recognized but not transferable yet.

---

### PHASE 8: Log and Schedule

**Pattern 2 (Space the Reviews)**

Update `.claude/deep-learn-log.md` with:

```
## <concept-slug>
- topic: <relative path to source content>
- level: novice|intermediate|advanced
- first_seen: <date>
- last_seen: <today>
- score: <1-5>
- confidence: <average confidence across session>
- consecutive_correct: <count>
- mastered: true|false (true = 3 consecutive scores of 4+)
- next_review: <calculated date>
- notes: <misconceptions, gaps, breakdown points>
```

**Review scheduling by score:**

| Score | Meaning | Next Review |
|---|---|---|
| 1 | Failed, blank | 1 day |
| 2 | Partial, major gaps | 2 days |
| 3 | Mostly right, minor errors | 4 days |
| 4 | Correct with minor uncertainty | 10 days |
| 5 + 3 consecutive | Mastered | 30 days |

For mastered concepts, extend: 30 days → 90 days → 1 year → permanent.

---

## Review Session Protocol

When running `deep-learn review` or reviewing overdue items:

1. **No re-teaching first.** Retrieve before you review.
2. Read the concept name and topic from the log. Ask the learner to recall from memory.
3. Only after the attempt, show or explain the correct answer.
4. For high-confidence errors: full misconception confrontation (Phase 6).
5. For low-confidence errors: brief correction + re-test.
6. Update the log. Reschedule.

The rule: **retrieval before explanation, always.**

---

## Interleaved Quiz Protocol

When running `deep-learn quiz`:

1. Pull the 5-10 concepts with the closest `next_review` dates from the log.
2. Mix them randomly — no grouping by topic.
3. One question per concept, rotating. If correct: next concept. If wrong: add a re-test at the end.
4. Track confidence on each.
5. After all items: show calibration summary — predicted vs. actual.
6. Update the log for all items.

The mix of topics is the feature. It forces discrimination between similar concepts. Do not let the learner choose order.

---

## Content Discovery

This skill is generic and works with any markdown knowledge base.

To discover available topics:
1. Look for an index file: `topics/index.mdx`, `README.md`, `docs/index.md`, or equivalent.
2. If a Starlight/Astro site: read `src/content/docs/topics/index.mdx`.
3. Parse the topic list and use it as the menu.
4. When the learner requests a topic, find the corresponding `.md` file and read it as the source.

For this repo specifically, topics live at `src/content/docs/topics/` and posts at `src/content/docs/posts/`.

---

## Tracking Log Format

File: `.claude/deep-learn-log.md` (project-local, git-ignored by default)

```markdown
# Deep Learn Log
<!-- Updated automatically by the deep-learn skill -->
<!-- Format: concept slug, source path, dates, scores, schedule -->

## hash-table-collision-resolution
- topic: src/content/docs/topics/cs/data-structures/hash-tables/index.md
- level: intermediate
- first_seen: 2026-05-14
- last_seen: 2026-05-14
- score: 4
- confidence: 3.5
- consecutive_correct: 2
- mastered: false
- next_review: 2026-05-24
- notes: Confused open addressing vs chaining. Misconception: "chaining always slower" — actually faster in high-load scenarios.
```

---

## Question Templates by Level

These guide question generation. Adapt to the specific concept.

**Level 1 — Recall:**
- "What is X?"
- "Name the three parts of X."
- "What does X guarantee?"

**Level 2 — Relational:**
- "Why does X cause Y?"
- "What is the difference between X and Z?"
- "When does X fail?"

**Level 3 — Application:**
- "Given [scenario], which approach would you use and why?"
- "If X broke, what would fail first?"
- "Write the simplest version of X from scratch."

**Level 4 — Transfer:**
- "Here is a problem you haven't seen: [novel surface form]. Apply what you know."
- "X was designed for [domain]. Would it work for [different domain]? What would need to change?"

**Level 5 — Explanation:**
- "Explain X to me. I'm a smart person with no background in this area."
- "Where is the intuition about X most likely to lead someone wrong?"
- "What is the one thing most people misunderstand about X?"

---

## Adaptation Rules

**When the learner struggles consistently (2+ sessions below score 3):**
- Move back one scaffold level
- Break the concept into sub-concepts and teach each separately
- Find a different analogy

**When the learner breezes through (3+ sessions at score 5):**
- Move to the next concept in the topic progression
- Increase transfer distance — apply in a novel domain
- Add deliberate difficulty: impose a time constraint

**When the learner gives correct answers with low confidence:**
- Repeat retrieval more often before spacing
- The knowledge is there but not yet fluent
- Do not advance until confidence catches up with accuracy

**When the learner gives wrong answers with high confidence:**
- Trigger full misconception confrontation every time
- These are the highest-priority items in the log
- Do not move on until the misconception is resolved and re-tested

---

## What This Skill Does NOT Do

- Does not summarize or explain content on demand without a retrieval attempt first
- Does not let the learner choose question order in quiz mode
- Does not skip the explanation requirement to save time
- Does not accept "I think I understand" as evidence of understanding
- Does not re-teach before the learner has attempted retrieval

---

## Related

- [`docs/learning-science.md`](../../../docs/learning-science.md) — full research foundation with effect sizes and citations
- [`quiz` skill](../quiz/SKILL.md) — focused on coding problem practice with its own log
- [`learning` skill](../learning/SKILL.md) — for pinning insights to data-structure pages
