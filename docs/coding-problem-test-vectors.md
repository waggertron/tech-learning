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
- Structures: linked list, level-order tree, graph adjacency list, random-pointer list, and interval list.
- Stateful designs: operation sequences and operation results.

Result comparisons distinguish exact equality from unordered, multiset, approximate, identity, structural, mutated-argument, and operation-result checks. A language renderer has to implement the selected codec and comparison before it can generate that problem's harness. It cannot fall back to a lossy generic conversion.

Function problems name the top-level function in Python, TypeScript, and Go, plus the Swift type and method. Stateful design problems name the submitted type in each language and use an operation sequence. The registry validates both execution shapes. The first executable proof covers the function shape. Operation-sequence rendering lands with the first stateful category that needs it.

## Generated blocks

Every executable block starts with a SHA-256 digest of the canonical vector document:

```text
TEST_VECTORS_BEGIN sha256:<digest>
```

It ends with `TEST_VECTORS_END`. The generated assertions and explicit exclusions between those markers are deterministic.

Swift catalog readiness compares the complete generated Swift block, not only the digest comment. Editing an assertion, omitting a case, changing an invalid input, or using stale vectors leaves the page incomplete until the source is regenerated.

The coverage manifest records the vector path, valid, boundary, and invalid counts, validation errors, and readiness for every problem. Vector population advances with category rollout. The S2.3 proof document is LeetCode 704. It does not claim that all 189 problem vector files already exist.

## Proof fixture

LeetCode 704 supplies the first four-language proof:

- Six valid or boundary cases execute in every language.
- Three invalid cases remain explicit and excluded in every language.
- The generated Python, TypeScript, Go, and Swift programs use the same vector digest and case IDs.
- Each generated program compiles or runs with the local supported toolchain.

The committed proof sources live under `tests/fixtures/coding-problem-vectors/generated/`. Their templates contain one `{{TEST_VECTORS}}` marker. The sync command owns the generated block.

## Commands

Format registry documents and regenerate proof fixtures:

```bash
npm run sync:coding-problem-vectors
```

The sync command owns `tests/fixtures/coding-problem-vectors/generated/`. It rewrites stale outputs and removes only orphaned files inside that generated directory. Compiler proofs use self-cleaning system temporary directories for binaries and module caches.

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

The LeetCode 704 proof passes with Python 3.14.6, TypeScript 5.9.3, Go 1.26.4, and Apple Swift 6.3.2 in Swift 6 language mode. Swift compilation treats warnings as errors.

This is language and standard-library evidence. It does not exercise the pinned Swift 6.3.3 Linux browser executor or any Apple SDK surface.
