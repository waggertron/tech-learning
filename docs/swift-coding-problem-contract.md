# Swift Coding Problem Contract

S2.2 defines one source and test contract for every Swift coding-problem starter and documented approach. The contract keeps files runnable in the browser executor, compilable as standalone Swift, and close to the signature a learner submits to LeetCode.

## Runtime boundary

Each Swift file is a complete standalone program. It uses Swift 6 language mode and the standard library. It does not import Foundation, Apple frameworks, packages, sibling source files, or helper modules.

This boundary matches the `swift-standard-v1` browser harness. Passing evidence proves Swift standard-library behavior on the recorded compiler. It does not prove iOS, SwiftUI, UIKit, Simulator, signing, entitlement, or device behavior.

## Filenames

- Starter: `<number>-<slug>.swift`
- Approach: `<number>-<slug>-approachN.swift`

`N` is the numeric approach heading from the MDX page. A page heading named `## Approach 2: Recursive search` maps to `<number>-<slug>-approach2.swift`.

Swift approach suffixes do not use letters or names. Distinct variants need distinct numbered headings so the page, source file, coverage manifest, and runner stay aligned.

## Standalone file layout

Every source file uses this order:

1. `// LEETCODE_TYPE: <TypeName>` metadata.
2. The exact canonical test-support block.
3. Any exact canonical data-structure or heap blocks required by the problem.
4. The LeetCode solution type and method signatures.
5. `func runTests()` with deterministic expectations.
6. One top-level `runTests()` call.

Algorithm problems normally use `// LEETCODE_TYPE: Solution` and `final class Solution`. Design problems name the submitted type, such as `MinStack`, `Trie`, or `TimeMap`. Method names, argument labels, parameter types, return types, and optional behavior match the Swift signature shown for the problem.

The metadata names a real class or struct in the same file. It does not replace the declaration or serve as an alternate signature.

## Starter behavior

The starter preserves the submission signature and compiles before the learner edits it. Its unfinished method contains both exact markers:

```swift
// TODO: Implement
fatalError("TODO: Implement")
```

`fatalError` has type `Never`, so it satisfies any return position without inventing a plausible answer. Running the unchanged starter fails on the first exercised call. It never prints a false success result.

## Completed approach behavior

An approach file contains a full implementation for the matching page section. It has no starter TODO placeholder. The same deterministic test cases used by the starter exercise that implementation.

Each approach file compiles and runs on its own. The site may show only the implementation block in an explanation tab, but the raw source behind a runnable Swift panel retains the complete test program.

## Assertions and output

Every file copies the exact block from `tools/swift-catalog/helpers/TestSupport.swift`. The block provides:

- `expectEqual`, for values with `Equatable` conformance.
- `expectTrue`, for identity checks, structural checks, and custom predicates.
- `reportSuccess`, which prints `All Swift tests passed`.

`runTests()` contains at least one canonical expectation and calls `reportSuccess()` only after every expectation passes. Failed expectations terminate with the source location, an optional case description, the expected value, and the actual value where equality applies.

Valid, boundary, and deliberately invalid fixtures remain separate. Test code does not clamp, sort, wrap, normalize, or repair an input unless the problem contract says the solution owns that transformation. [Coding Problem Test Vectors](coding-problem-test-vectors.md) defines the shared cross-language registry and invalid-input policy.

## Canonical helpers

The canonical blocks live under `tools/swift-catalog/helpers/`. A standalone file copies only the blocks its problem needs.

| Manifest helper | Canonical file | Contract |
| --- | --- | --- |
| `list-node` | `ListNode.swift` | `ListNode` plus deterministic acyclic, cyclic, list-array, and shared-tail builders and observations |
| `tree-node` | `TreeNode.swift` | `TreeNode` plus deterministic level-order construction, observation, value lookup, and identity comparison |
| `graph-node` | `GraphNode.swift` | LeetCode-style `Node` with `val` and optional neighbors |
| `random-list-node` | `RandomListNode.swift` | LeetCode-style `Node` plus deterministic builders and a structure and identity clone validator |
| `trie-node` | `TrieNode.swift` | Character-keyed children and an end-of-word flag |
| `heap` | `BinaryHeap.swift` | Comparator-driven binary heap with peek, insert, and root removal |
| `interval` | `Interval.swift` | Small `Equatable` interval value with `start` and `end` |

Graph and random-list problems use different `Node` shapes. A single problem never copies both blocks. Problems whose LeetCode signature represents intervals as `[[Int]]` keep that signature and do not substitute `Interval` for it.

Canonical blocks are exact contract fixtures, not packages imported by submitted code. Exact copies prevent helper behavior from drifting between pages while preserving the runner's one-file isolation boundary.

## Coverage enforcement

The coverage scanner records contract errors for every Swift starter and approach. A source is Swift-ready only when it has:

- The expected filename and page wiring.
- The canonical test-support and required helper blocks.
- A declared LeetCode type.
- `runTests()`, deterministic expectations, and the success marker.
- The correct starter or completed-approach state.
- The exact generated Swift block from the problem's canonical cross-language vectors.

Missing source files remain expected while the migration is open. A source that exists but violates the contract is reported as incomplete rather than counted as ready.

## Commands

Run the static contract tests:

```bash
npm run test:swift-catalog-contract
```

Compile the canonical helpers, contract specimens, and every migrated catalog source with the selected local Swift compiler. Catalog starters compile without running their deliberate TODO failure. Every completed approach runs with a 10-second timeout and a 1 MiB output cap:

```bash
npm run test:swift-catalog-compile
```

Refresh and verify the catalog manifest after Swift files or page wiring change:

```bash
npm run sync:swift-catalog-coverage
npm run test:swift-catalog-coverage
npm run check:swift-catalog-coverage
```

Use `npm run validate:swift-catalog-coverage` only when checking migration completeness. It remains red until every planned page and approach has Swift parity.

## Current evidence

The contract fixtures, canonical helpers, and all 695 migrated 1D Dynamic Programming, 2D Dynamic Programming, Advanced Graphs, Arrays and Hashing, Backtracking, Binary Search, Bit Manipulation, Graphs, Greedy, Heap and Priority Queue, Intervals, Linked Lists, Math and Geometry, Sliding Window, Stack, Trees, Tries, and Two Pointers catalog sources compile with Apple Swift 6.3.2 in Swift 6 language mode with warnings treated as errors. All 506 completed approaches run and print the exact success marker. Compiler invocations have a 60-second ceiling. Completed programs have a 10-second runtime ceiling and a 1 MiB output cap.

The pinned browser executor remains the exact Swift 6.3.3 Linux evidence boundary. Re-run its Docker-backed suite when executor behavior, compiler pinning, isolation, or source transfer changes. This contract change does not alter that executor boundary.
