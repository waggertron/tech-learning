# Swift Coding Problem Coverage

The Swift catalog manifest turns the coding-problem migration into a checked inventory. It records every problem page, documented approach, starter file, source harness, language tab, REPL, and known shared helper need.

The generated manifest lives at `docs/data/swift-coding-problem-coverage.json`. Do not edit it by hand.

## Commands

Regenerate the manifest after adding, removing, or changing a coding-problem page, approach, source file, language tab, REPL, or harness:

```bash
npm run sync:swift-catalog-coverage
```

Check that the committed manifest matches the catalog:

```bash
npm run check:swift-catalog-coverage
```

Run the parser and fixture contract tests:

```bash
npm run test:swift-catalog-coverage
```

Require complete Swift parity:

```bash
npm run validate:swift-catalog-coverage
```

The final command is intentionally red during the migration. It exits nonzero for every page that lacks a runnable Swift starter and every documented approach that lacks Swift source, a harness, and rendered Swift code or REPL evidence. The default pre-push workflow runs the deterministic tests and manifest sync check, but it does not require complete parity until the migration closes.

## What the Manifest Records

Each problem entry includes:

- Category, slug, title, and page path.
- Known shared helper needs: list node, tree node, graph node, random-list node, trie node, heap, or interval.
- Practice tabs and REPLs by language.
- Starter source paths, harness evidence, and raw-import wiring by language.
- Every numbered or unnumbered `## Approach` section.
- Approach tabs, code fences, REPLs, source paths, and harness evidence by language.
- Page-level and approach-level Swift readiness.
- Shared vector path, valid, boundary, and invalid case counts, schema errors, and readiness.

The source scanner recognizes `.py`, `.ts`, `.go`, and `.swift` files. It treats an unnumbered `## Approach: Name` heading as approach 1. `## Approach comparison` is a comparison section, not an implementation.

## Swift Readiness

A problem page is Swift-ready only when all of these are true:

- The base `<slug>.swift` starter exists.
- The starter contains recognized test-harness evidence.
- The page imports the starter with `?raw` and passes it to the practice component.
- The Try it yourself block includes a Swift tab and `SwiftRepl`.

A documented approach is Swift-ready only when all of these are true:

- `<slug>-approachN.swift` exists for the approach number.
- The source contains recognized test-harness evidence.
- The approach section includes a Swift tab.
- The section contains a Swift code fence or Swift REPL.

S2.2 owns the final solution and harness contract. If that gate changes the filename or harness convention, update the scanner, its synthetic fixtures, this document, and the generated manifest in the same batch.

S2.2 is now defined in [Swift Coding Problem Contract](swift-coding-problem-contract.md). A Swift file is ready only when it follows that filename, source, signature, canonical-helper, test, and output contract. The manifest stores contract errors beside each existing Swift starter and approach so a malformed file cannot count as coverage.

S2.3 is defined in [Coding Problem Test Vectors](coding-problem-test-vectors.md). Swift readiness also requires a valid problem vector file and the exact generated Swift case block. Vector files are populated with each category rollout. The manifest can therefore distinguish missing Swift source from missing or stale shared cases.

## Baseline, 2026-07-13

The first generated inventory found:

- 189 problem pages across 18 categories.
- 506 documented approaches after normalizing two lettered Merge k Sorted Lists headings into numeric approaches 3 and 4.
- 470 Python source files.
- 469 TypeScript source files.
- 469 Go source files.
- 0 Swift source files.
- 0 Swift-ready pages and 0 Swift-ready approaches.
- 55 pages with a known shared helper need.
- 695 missing Swift coverage items: one page item per problem and one approach item per documented approach.

This supersedes the plan's earlier hand-counted 188-page baseline. Summary Ranges increased Arrays and Hashing to 18 pages before the generated inventory landed. The first scanner count was 504 approaches because it ignored the lettered `3a` and `3b` headings on Merge k Sorted Lists. S2.C12 renamed those existing algorithms to approaches 3 and 4, so the checked catalog now reports 506.

## Category progress, 2026-07-16

Binary Search, Bit Manipulation, Graphs, Greedy, Heap and Priority Queue, Intervals, Linked Lists, and Math and Geometry are complete:

- 79 Swift-ready pages.
- 215 Swift-ready documented approaches.
- 294 standalone Swift source files, including 79 compile-only starters.
- 79 reviewed shared-vector documents with 419 total valid, boundary, and excluded invalid cases.
- 215 completed approaches compiled and executed with Apple Swift 6.3.2 in Swift 6 language mode.
- Binary Search contributes 8 pages, 23 approaches, and 64 cases.
- Bit Manipulation contributes 7 pages, 21 approaches, and 57 cases.
- Graphs contributes 19 pages, 39 approaches, and 76 cases.
- Greedy contributes 10 pages, 31 approaches, and 40 cases.
- Heap and Priority Queue contributes 7 pages, 20 approaches, and 32 cases.
- Intervals contributes 6 pages, 18 approaches, and 30 cases.
- Linked Lists contributes 14 pages, 40 approaches, and 70 cases.
- Math and Geometry contributes 8 pages, 23 approaches, and 50 cases.

The other 110 pages remain explicitly incomplete. The manifest continues to report them without weakening the page, approach, source, harness, REPL, or vector requirements.
