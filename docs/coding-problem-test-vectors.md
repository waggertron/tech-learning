# Coding Problem Test Vectors

S2.3 defines one canonical test-case source for Python, TypeScript, Go, and Swift coding-problem harnesses. A problem's vector document records its input contract once. Language renderers translate the same values into native literals without sorting, clamping, wrapping, coercing, or repairing them.

## Registry layout

Each problem gets one JSON document:

```text
tools/coding-problem-vectors/vectors/
└── <category>/
    └── <number>-<slug>.json
```

The directory and filename match the coding-problem route. Schema version 1 records:

- Problem category and slug.
- Parameter names and codecs.
- Result codec and comparison rule.
- Parameters the solution may mutate.
- Invalid-input policy.
- Python, TypeScript, Go, and Swift entrypoints.
- Named valid, boundary, and invalid cases.

Unknown fields fail validation. A field such as `normalizedArguments` is rejected rather than treated as permission to change the input.

## Case classifications

Every vector document contains all three classifications:

- **Valid**: Ordinary inputs inside the published problem constraints.
- **Boundary**: Smallest, largest, first, last, empty, or degenerate values only when those values remain inside the contract.
- **Invalid**: Deliberate violations of a stated precondition, type-independent constraint, or operation rule.

Boundary does not mean convenient edge case. For LeetCode 704, a one-element array is a boundary case because the constraint permits it. An empty array is invalid because the constraint requires at least one element.

Case IDs are stable kebab-case names. Assertions report those IDs so a failure maps back to the registry rather than to a language-specific case number.

## Invalid-input policy

The problem contract chooses one policy:

- `excluded`: The platform promises valid inputs. Invalid cases remain visible as `EXCLUDED_VECTOR` records and are not passed to the solution.
- `solution-handled`: Validation is part of the required behavior. Invalid cases execute with an expected value or named error behavior.

An excluded case carries its untouched argument array and a one-line reason. Each language renderer emits that same raw JSON argument representation in a comment. The generated harness never invokes the solution for that case.

This distinction prevents a test adapter from sorting an unsorted array, replacing an empty collection, dropping a malformed operation, or choosing a default value before the solution sees the input.

## Codecs and comparisons

Schema version 1 names representations rather than inferring them from JSON:

- Scalars: integer, finite floating-point number, Boolean, and string.
- Collections: integer or string arrays and matrices.
- Structures: linked list, linked-list array, cyclic linked list, intersecting linked lists, level-order tree, graph adjacency list, random-pointer list, and interval list.
- Stateful designs: operation sequences and operation results.

Result comparisons distinguish exact equality from unordered, multiset, approximate, identity, structural, mutated-argument, and operation-result checks. Exact equality supports scalar, array, matrix, and acyclic linked-list results. Approximate floating-point checks use a scale-aware tolerance of `1e-9 * max(1, abs(expected))` in every language. Python and Swift use native collection equality. TypeScript compares deterministic JSON structure. Go renders a typed element-by-element comparison closure. Surrounded Regions observes its mutated board through the original inout API. Clone Graph builds a graph from its adjacency codec, verifies the cloned structure, and rejects shared node identity. Linked-list rendering constructs real nodes, compares output values, observes in-place mutation, preserves cycle positions, constructs shared tails for identity checks, and validates random-pointer clones without accepting shared node identity. Swift tree rendering constructs real trees from level-order values, trims observation-only trailing nulls, resolves node references by value, and verifies LCA results by node identity. A language renderer has to implement the selected codec and comparison before it can generate that problem's harness. It cannot fall back to a lossy generic conversion.

Function problems name the top-level function in Python, TypeScript, and Go, plus the Swift type and method. Stateful design problems name the submitted type in each language and use an operation sequence. The registry validates and renders both execution shapes. Operation sequences start with `init`, pass any declared constructor arguments, keep one subject per case, preserve call order, and compare each non-void result at its original operation index. Scalar and integer-array operation values render without flattening state. Go rendering maps the canonical constructor and method names to `NewType` and exported methods.

## Generated blocks

Every executable block starts with a SHA-256 digest of the canonical vector document:

```text
TEST_VECTORS_BEGIN sha256:<digest>
```

It ends with `TEST_VECTORS_END`. The generated assertions and explicit exclusions between those markers are deterministic.

Swift catalog readiness compares the complete generated Swift block, not only the digest comment. Editing an assertion, omitting a case, changing an invalid input, or using stale vectors leaves the page incomplete until the source is regenerated.

The coverage manifest records the vector path, valid, boundary, and invalid counts, validation errors, and readiness for every problem. Vector population advances with category rollout. LeetCode 704 remains the four-toolchain proof document. Binary Search adds the stateful TimeMap contract. Bit Manipulation adds the first exact array-result contract through Counting Bits. Graphs adds inout mutation observations and graph structure plus identity validation.

## Proof fixtures

LeetCode 704 supplies the first four-language proof:

- Six valid or boundary cases execute in every language.
- Three invalid cases remain explicit and excluded in every language.
- The generated Python, TypeScript, Go, and Swift programs use the same vector digest and case IDs.
- Each generated program compiles or runs with the local supported toolchain.

LeetCode 981 supplies the stateful four-language proof:

- Every executable case constructs a fresh TimeMap.
- Set and get calls remain in registry order.
- Void set results keep their operation indexes without fake return values.
- Missing and prior-timestamp lookups compare exact strings.
- Invalid operation sequences remain visible and excluded.

LeetCode 338 supplies the ordered array-result proof:

- Python and Swift use native array equality.
- TypeScript compares the deterministic serialized structure.
- Go uses the generated typed element-by-element comparison closure.
- Negative and over-limit inputs remain excluded instead of being clamped before allocation.

The committed proof sources live under `tests/fixtures/coding-problem-vectors/generated/`. Their templates contain one `{{TEST_VECTORS}}` marker. The sync command owns the generated block. The focused proof command compiles and runs every generated fixture independently so language-level names do not collide between problems.

## Commands

Format registry documents, regenerate proof fixtures, and refresh owned vector blocks in catalog sources that already contain the markers:

```bash
npm run sync:coding-problem-vectors
```

The sync command owns `tests/fixtures/coding-problem-vectors/generated/`. It rewrites stale outputs and removes only orphaned files inside that generated directory. In catalog sources, it replaces only the text between one complete `TEST_VECTORS_BEGIN` and `TEST_VECTORS_END` marker pair. Compiler proofs use self-cleaning system temporary directories for binaries and module caches.

Check schema validity and generated-file drift:

```bash
npm run check:coding-problem-vectors
npm run test:coding-problem-vectors
```

Compile and run the four-language proof when Python, TypeScript, Go, and Swift are available:

```bash
npm run test:coding-problem-vector-fixtures
```

Refresh the coverage manifest after adding or changing a problem vector:

```bash
npm run sync:swift-catalog-coverage
npm run check:swift-catalog-coverage
```

The default pre-push gate runs the deterministic schema, drift, coverage, and source-contract checks. The four-toolchain proof stays focused because the site build environment does not guarantee Go or Swift installations.

## Current evidence

The LeetCode 704 scalar function proof, LeetCode 981 stateful proof, and LeetCode 338 array-result proof pass with Python 3.14.6, TypeScript 5.9.3, Go 1.26.4, and Apple Swift 6.3.2 in Swift 6 language mode. Swift compilation treats warnings as errors. The registry contains 782 cases across 142 1D Dynamic Programming, Binary Search, Bit Manipulation, Graphs, Greedy, Heap and Priority Queue, Intervals, Linked Lists, Math and Geometry, Sliding Window, Stack, Trees, Tries, and Two Pointers problems. TimeMap proves ordered stateful operations. Counting Bits proves deterministic array-result equality in all four generated programs. 1D Dynamic Programming adds palindrome boundaries, recursive and memoized recurrences, circular robbery, coin impossibility, subset targets, and the negative-product sign flip. The Graphs vectors exercise scalar, array, matrix, inout mutation, and graph structure results in the Swift catalog. Greedy adds scalar and ordered partition-result cases. Heap and Priority Queue adds constructor arguments for KthLargest and integer-array operation results for Twitter feeds. Intervals adds interval matrices, offline query results, room counts, and greedy removal cases. Linked Lists adds node construction, list-array inputs, in-place list observations, cycle positions, shared-tail identity, random-pointer clone identity, and LRU operation sequences. Math and Geometry adds scale-aware floating-point checks, square-matrix mutation, decimal-string arithmetic, spiral traversal, digit carries, zero-marker mutation, and stateful geometric counting. Sliding Window adds repeated-character boundaries, substring location, frequency-covered windows, stock ranges, heap and deque maxima, replacement budgets, signed prefix sums, and permutation windows. Stack adds bracket and path parsing, exact parenthesis generation, expression evaluation, stateful minimum tracking, collision chains, circular next-greater scans, fleet arrival times, and modulo contribution counting. Trees adds level-order construction and observation, node-reference identity, traversal boundaries, structural returns, BST invariants, and serialization round trips. Tries adds prefix-state operations, wildcard searches, shared prefixes, board traversal, and dead-branch pruning. Two Pointers adds deterministic triplet ordering, ASCII palindrome boundaries, sorted pair indexes, array rotation mutation, and compressed character mutation.

This is language and standard-library evidence. It does not exercise the pinned Swift 6.3.3 Linux browser executor or any Apple SDK surface.
