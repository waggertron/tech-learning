# Swift Reference

Reviewed on 2026-07-13. Use with `supported-matrix.md` so examples follow the recorded stable compiler and Swift language mode.

## Language Teaching Order

1. Values, variables, concrete types, inference, and explicit conversion.
2. Control flow, functions, optionals, collections, and Unicode strings.
3. Structures, enumerations, classes, protocols, generics, and error handling.
4. Ownership, copy-on-write behavior, closures, and memory management.
5. Structured concurrency, actors, `Sendable`, cancellation, and isolation.
6. Macros, packages, modules, access control, and interoperability.

## Implementation Rules

- Prefer `let` until mutation expresses part of the algorithm or domain rule.
- Model finite domains with enumerations and invalid combinations with dedicated types.
- Keep force unwraps and force casts out of examples unless the lesson demonstrates why they fail.
- Treat `String` as a collection of extended grapheme clusters. Use `String.Index` for positions and explain when UTF-8 views are the actual algorithmic contract.
- Explain copy behavior when arrays, dictionaries, sets, strings, or large value types cross an API boundary.
- Use protocols and generics when they preserve a useful contract. Do not replace precise types with `Any` to avoid design work.
- Make thrown errors, optional absence, invalid input, and cancellation distinct when callers need different recovery behavior.
- Preserve the target environment's public signature. Adapt the implementation around LeetCode, package, framework, or app contracts rather than rewriting the contract silently.

## Concurrency Rules

- Build with Swift 6 language mode and complete concurrency checking.
- Prefer structured child tasks. Use detached tasks only when the work must not inherit actor, task-local, or priority context.
- Put UI-observed mutation on `MainActor`. Do not place unrelated storage, parsing, or networking work on the main actor for convenience.
- Make shared mutable state actor-isolated or otherwise synchronized. Do not silence warnings with unchecked conformance without a documented invariant and targeted tests.
- Propagate cancellation through async boundaries and test cancellation separately from failure.
- Avoid teaching `DispatchQueue.main.async` as the default solution to Swift concurrency isolation.

## Package Shape

- Put reusable domain and application behavior in a Swift package when it does not require an application lifecycle or Apple-only framework.
- Keep executable examples small and deterministic.
- Add test targets beside library targets. Do not import `Testing` into a shipping target.
- State the Swift tools version in `Package.swift` and keep it aligned with the supported matrix.

## Primary Sources

- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [Swift 6.3 release](https://www.swift.org/blog/swift-6.3-released/)
- [Swift Evolution](https://www.swift.org/swift-evolution/)
- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
- [Swift concurrency migration guide](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/)
