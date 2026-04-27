---
name: quiz
description: Use when the user asks to be quizzed, tested, drilled, or "ask me a leetcode problem" — runs interactive practice over the leetcode-150 catalog, tracks performance per segment per question in `.claude/quiz-log.md`, and chooses what to ask next based on the user's history (gaps first, recents back-burner).
---

# Quiz protocol

The user is practicing LeetCode problems and wants honest performance tracking. This skill runs the practice loop and persists the results.

## When to trigger

- User says "quiz me" / "test me" / "drill me" / "ask me a question" in the context of this repo.
- User wants to be tested on a specific category, difficulty, or problem.
- User asks to resume practice or review their gaps.

## Setup steps the FIRST time per session

1. Read `.claude/quiz-log.md` to see the user's history. Note recent ratings, weak spots, and what was asked recently (avoid repeating in the same session unless the user asks).
2. Confirm difficulty + category preferences if the user hasn't said.
3. Confirm interaction mode: typically just "approach + complexity" (no code), but the user may ask for code or full implementation.

## The quiz loop

For each problem:

1. **Present the problem statement** — copy the prompt and examples from the relevant file under `src/content/docs/topics/cs/leetcode-150/`. Do NOT reveal approaches, complexity, or any hint from the page until the user has answered or asked. Strip the answer-giving sections from the page when reading it to yourself; only present the `## Problem` section.

2. **Ask for the segment(s)** — typically: "What's your approach? What's the time and space complexity?" Adjust based on user's chosen mode.

3. **Wait for the user's answer.** Do not interrupt with hints unless asked.

4. **Rate honestly per segment.** For each segment quizzed (approach, complexity, etc.), assign one of:
   - `wrong` — confidently incorrect
   - `didnt know` — blank, gave up, asked for hint
   - `somewhat knew` — partially right, missed details, needed nudging
   - `totally knew` — fluent, correct, first try

   Be honest. The user's value from this skill comes from accurate self-assessment, not encouragement.

5. **Reveal the answer** — show the canonical approach(es) and complexity from the problem's page. Cite the file path so the user can read more.

6. **Append to `.claude/quiz-log.md`** — one row per (problem, segment) pair. Format:

   ```
   | 2026-04-27 | 14:32 | 121. Best Time to Buy and Sell Stock (Easy) | approach | somewhat knew | got brute O(n²) but missed the "track min so far" insight |
   | 2026-04-27 | 14:32 | 121. Best Time to Buy and Sell Stock (Easy) | complexity | totally knew | called O(n) time, O(1) space without prompting |
   ```

   Use the current date/time from system context. If you don't know the current time, ask the user or use `date` via Bash.

7. **Pick the next problem** based on the user's history:
   - Prefer problems with prior `wrong` or `didnt know` ratings (spaced repetition).
   - Avoid problems asked in the last 3-5 sessions unless reviewing a gap.
   - Honor the user's stated category/difficulty preferences.
   - Mix in new problems from related categories to broaden coverage.

## Reading the problem file without spoiling yourself

Problem files contain the answer (multiple Approach sections, complexity tables, test cases). When pulling the prompt:

- Read ONLY the lines from the start of the file through the end of `## Problem` (or up to the first `## Approach`, whichever comes first).
- Do NOT read or echo any `## Approach`, `**Where the time goes**` table, `**Complexity**` block, or `## Test cases` until after the user has answered.

The Bash tool with `awk` is convenient: `awk '/^## Approach/{exit} {print}' <file>` prints everything before the first approach heading.

## Picking problems

The leetcode-150 catalog lives at `src/content/docs/topics/cs/leetcode-150/`. There are 18 categories (arrays-and-hashing, two-pointers, sliding-window, stack, binary-search, linked-list, trees, tries, heap-priority-queue, backtracking, intervals, graphs, advanced-graphs, 1d-dynamic-programming, 2d-dynamic-programming, greedy, math-and-geometry, bit-manipulation) and three by-difficulty index pages at `by-difficulty/{easy,medium,hard}/index.md`.

Difficulty is encoded in the filename's frontmatter title (now ends with `(Easy)`, `(Medium)`, or `(Hard)`) and the `tags:` array.

## Ratings reporting

When the user asks "how am I doing?" or "what are my weak spots?":

- Aggregate the log by problem and by segment.
- Highlight problems with multiple `wrong` / `didnt know` ratings.
- Highlight categories where the average is below `somewhat knew`.
- Note streaks of `totally knew` for momentum.

## Honesty discipline

The point of this skill is reliable self-assessment. Do NOT inflate ratings to be encouraging. If the user said "uh, maybe a hash map?" without explaining why or what the complexity would be, that is `somewhat knew` at best for `approach` and `didnt know` for `complexity`. If the user gave a wrong complexity confidently, that is `wrong`, not `somewhat knew`.

When in doubt, rate down. The log's value is in surfacing real gaps.

## Fast-fire mode (pattern recognition drill)

Triggered when the user asks for "fast-fire," "rapid fire," "quick drill," "one-liner round," or "pattern recognition drill."

**Format:** describe a problem in **5 to 10 words** (no examples, no preamble). The user replies with the data structure or algorithm they'd reach for. Then immediately give the next one. Run 5 to 10 prompts in a single batch, evaluate at the end.

**Example prompts (good fast-fire shapes):**
- "Most recent unmatched opening bracket." → stack
- "Top K largest in a stream." → min-heap of size K
- "Shortest path in unweighted graph." → BFS
- "Window of size K with running max." → monotonic deque
- "Detect cycle in linked list, O(1) space." → Floyd's tortoise and hare
- "Find anagram groups in a list of strings." → hash map keyed on sorted string
- "Fewest coins to make N." → DP, unbounded knapsack
- "Substring with at most K distinct chars." → sliding window with hash counter
- "Earliest arrival across timed flight edges." → Dijkstra on time
- "Decode `3[a2[c]]`." → stack of (count, partial)

**Acceptable answers:** the canonical structure or algorithm name. "Stack," "BFS," "Dijkstra," "monotonic deque," "two-pointer," "hash set," "trie," "union-find," etc. If the user gives a longer reasoning, that's fine; the speed comes from the prompt being short, not the answer.

**Rating** in fast-fire mode is per-prompt:
- `totally knew` — instant correct answer
- `somewhat knew` — correct but slow, or close (e.g., "BFS" when "Dijkstra" was the cleaner fit)
- `wrong` — wrong structure named
- `didnt know` — passed / blank

Log each prompt as a `pattern recognition` segment in `.claude/quiz-log.md`, with the abbreviated prompt as the "Problem" cell:

```
| 2026-04-27 | 14:42 | "Most recent unmatched opening bracket" | pattern recognition | totally knew | named stack instantly |
```

After a fast-fire batch, summarize: how many right / wrong, which structures the user is fluent on vs. shaky on. Suggest a follow-up: a normal quiz on the shaky-structure category, or another fast-fire round narrowed to that category.

**Variants:**

- **Reverse fast-fire** — user names a structure, you give a one-liner problem that fits. Tests whether the user can generate problems, not just recognize them.
- **Counter-fast-fire** — for each prompt, also ask "what other structure might tempt you here, and why is it wrong?" Slower but tests counter-clue knowledge from the `learning` skill template.
