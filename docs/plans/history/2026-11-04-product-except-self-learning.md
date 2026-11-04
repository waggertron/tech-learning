# Product of Array Except Self: teaching depth plan

## Requirements summary

Capture the reasoning developed during practice in the existing problem entry. Help readers define what each array entry contains, avoid off-by-one mistakes, and derive the constant-extra-space follow-up. Implemented on 2026-11-04. The walkthrough, indexing guidance, memory derivation, recognition connections, and nearby factual corrections are in the existing entry.

Primary target: `src/content/docs/topics/cs/coding-problems/arrays-and-hashing/238-product-of-array-except-self.mdx`.

The page already contains the two-array solution (lines 136-245), the optimized solution (lines 247-360), tests (lines 372-425), and concept links (lines 431-434). Preserve those working approaches and language runners. Add the missing explanation around them rather than another approach with the same behavior.

## Acceptance criteria

- Readers can explain `front[k] = product(nums[:k])` and `back[k] = product(nums[k + 1:])`. Explain these slices as notation, not allocations required by the algorithm.
- A fully labeled walkthrough uses `[2, 3, 4, 5]`, with index, input, prefix, suffix, and result aligned. Expected arrays are `[1, 2, 6, 24]`, `[60, 20, 5, 1]`, and `[60, 40, 30, 24]`.
- Explain why combining values at the same index excludes exactly the current element. Explain why shifting again skips required neighbors.
- Explain the multiplicative identity `1`, including empty left/right sides and the absence of endpoint branches in the combine loop.
- Explain that a running product is stored or consumed before incorporating the current element. Distinguish this loop from the existing recurrence that reads a neighboring array entry.
- Derive the follow-up by storing prefixes in the output and streaming suffix products through one scalar. A backward trace shows the scalar before each update.
- Distinguish auxiliary space from output storage: two auxiliary arrays use O(n); output plus a fixed number of scalars uses O(1) extra space and O(n) total storage.
- Cover one zero, two zeros, negative values, and the minimum input length without new algorithm branches.
- Add a short recognition section and precise links to existing related concepts and a related problem.
- Keep all existing runners and static Swift examples intact. New explanations and examples agree with executable sources.

## Implementation steps

1. Expand Approach 2 before its code with an optional walkthrough.
   - Define prefix/suffix in plain language and map `front`/`back` to the page's `prefix`/`suffix` names once.
   - Use the labeled arrays and an index-by-index table. Start with index 1: exclude 3, combine 2 and 20.
   - Explain exclusive versus inclusive accumulation: exclusive omits the current element; inclusive includes it. The meaning of the stored value determines the combine indices.
   - Show the learner's running-product construction as a short explanatory loop, not a fourth solution or extra runner. Contrast its loop bounds with the existing recurrence at lines 150-154: starting at 1 is valid there because it explicitly reads `nums[i - 1]`.

2. Add a compact common-mistakes subsection after the walkthrough.
   - Wrong combine: `front[k - 1] * back[k + 1]`; demonstrate the missing neighbors at index 1.
   - Wrong endpoint: `back[n - 1]` describes the empty right side at the last index, not the right side at index 0.
   - Wrong assignment: `res = ...` replaces the list; `res[k] = ...` fills one slot.
   - Addition combines sums; this problem needs multiplication of the two products.
   - Tie each mistake to the array meaning rather than reproducing the full unsuccessful submission.

3. Expand Approach 3 before its code with the memory derivation.
   - First remove the separate prefix array by putting those values in the required output.
   - Then remove the suffix array because its entries are consumed once in backward order and can be generated as needed.
   - Trace indices 3, 2, 1, 0 with suffix values 1, 5, 20, 60 before each output update.
   - State the invariant: before processing index i, the scalar contains exactly the product strictly to its right; output[i] still contains exactly the product strictly to its left.
   - Explain why output is updated before the scalar, and why overwriting output[i] is safe for later backward steps.

4. Add recognition and connections near the summary.
   - Primary name: prefix/suffix accumulation, here using exclusive products.
   - Recognition rule: when each answer needs everything except one position, ask whether left and right summaries can be computed independently and combined.
   - Connect to Array Scans (`src/content/docs/topics/cs/coding-concepts/array-scans.md`, Tactic section): define state before the current element, then consume and update it in the correct order.
   - Connect to Prefix Sums (`src/content/docs/topics/cs/coding-concepts/prefix-sums.md`, Tactic section): both reuse accumulated summaries; prefix-sum range subtraction is a different operation from joining two product summaries.
   - Describe the optimization as keeping only the state still needed. The existing State Compression page focuses on DP, so do not classify this problem as DP or add a misleading direct link just for terminology.
   - Link to Trapping Rain Water (`src/content/docs/topics/cs/coding-problems/two-pointers/042-trapping-rain-water.mdx`) as a related left/right-summary problem. State that it combines maxima to find a limiting height, not products.
   - Keep the generalization accurate: order-preserving prefix/suffix combination works with associative operations and an identity. Avoid implying every such problem admits constant extra space or inverse operations.

5. Correct nearby factual details and update evidence.
   - The Approach 3 complexity table at line 323 says n-1 executions for a loop that runs n times. Correct it.
   - Replace the unsupported explanation at line 370 about why division is forbidden. State the explicit constraint, explain that naive total-product division fails with zeros, and avoid calling total-product-then-divide a single-pass algorithm.
   - Add the walkthrough input and a two-zero case to relevant Python smoke checks if they are absent. Existing Approach 2/3 Python files already contain one-zero, negative, and two-element checks.
   - Update the page's `updated` date. This is a content depth update, with no new capability, generator, or authoring rule, so no feature-tracker entry is required unless implementation expands scope.

## Risks and mitigations

- Multiple loop styles can confuse beginners. Define the shared invariant first and explicitly explain why the recurrence can start at 1 while a running accumulator initialized to 1 must process index 0.
- More explanation can bury the code. Use short walkthrough subsections and one consistent input. Avoid repeating the complete implementation.
- The input `[1, 2, 3, 4]` can hide a skipped first multiplication. Use `[2, 3, 4, 5]` throughout the teaching layer.
- Keep recognition material local to the problem in this change. A new general concept page and broad neighboring-page edits are deferred.

## Verification

- Recompute every trace against the two existing Python approach implementations.
- Run both Python approach files and focused checks for `[2, 3, 4, 5]` and `[2, 0, 4, 0]`.
- Run `npm run build` after the implementation batch.
- Run published-content and internal-link validation for the changed page using supported scope options, or the full validators if no scoped mode exists.
- If runner markup or approach sources change, run `npm run test:coding-problem-tab-contracts` and `npm run validate:code-examples`.
- Inspect the diff for consistent naming, accurate space claims, ASCII diagrams, and reader-facing prose. Implementation evidence: both existing Python approach files and focused walkthrough/edge-case checks passed; published-content validation and all four tab-contract tests passed. Full build passed with 0 Astro errors, warnings, or hints. All five new teaching sections were confirmed in the generated HTML. Internal-link validation passed across 806 HTML pages.
