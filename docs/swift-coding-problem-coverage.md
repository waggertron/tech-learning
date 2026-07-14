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

## Baseline, 2026-07-13

The first generated inventory found:

- 189 problem pages across 18 categories.
- 504 documented approaches.
- 470 Python source files.
- 469 TypeScript source files.
- 469 Go source files.
- 0 Swift source files.
- 0 Swift-ready pages and 0 Swift-ready approaches.
- 55 pages with a known shared helper need.
- 693 missing Swift coverage items: one page item per problem and one approach item per documented approach.

This supersedes the plan's earlier hand-counted 188-page baseline. Summary Ranges increased Arrays and Hashing to 18 pages before the generated inventory landed.
