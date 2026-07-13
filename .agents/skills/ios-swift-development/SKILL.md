---
name: ios-swift-development
description: "Use when planning, researching, writing, reviewing, compiling, testing, or updating Swift and Apple platform content in tech-learning, including Swift language examples, Swift packages, SwiftUI, UIKit, app architecture, persistence, networking, accessibility, concurrency, testing, Xcode projects, simulator or device validation, and App Store distribution guidance."
---

# iOS and Swift Development

Build Apple platform learning material from current primary sources and executable evidence. Keep language rules, framework guidance, deployment targets, toolchain versions, and validation claims explicit.

Use this skill with `writing-style` for every repo change. Add `authoring` and `published-content-review` for reader-facing content, `post-series` for series structure, and `feature-tracking` when the work adds a reusable capability or workflow.

## Reference Routing

Read only the references needed for the task:

- **Swift language or packages**: Read `references/swift.md`.
- **SwiftUI implementation or review**: Read `references/swiftui.md`.
- **UIKit implementation or review**: Read `references/uikit.md`.
- **Test design or test review**: Read `references/testing.md`.
- **Domain boundaries or app structure**: Read `references/architecture.md`.
- **Permissions, entitlements, sensors, services, or ecosystem frameworks**: Read `references/platform-capabilities.md`.
- **Deployment targets and API guards**: Read `references/availability.md`.
- **Current Apple claims and citations**: Read `references/apple-source-research.md`.
- **Compile, build, simulator, or device evidence**: Read `references/validation.md` and `references/supported-matrix.md`.

## Core Workflow

1. Read the target file, neighboring content, relevant plan, and existing examples before designing the change.
2. Identify the exact platform, deployment target, Swift language mode, Xcode version, SDK, simulator destination, and device requirements that affect the task.
3. Refresh temporally unstable claims from primary sources. Prefer Apple Developer Documentation, Swift.org, Swift Evolution proposals, Xcode release notes, and App Store Connect documentation.
4. Separate stable guidance from beta behavior. Keep the implementation on the supported stable matrix unless the user explicitly requests beta coverage.
5. Choose the smallest runnable form that proves the lesson: a standalone Swift file, Swift package, framework target, application target, simulator test, or physical-device check.
6. Write production-shaped code with visible failure behavior. Do not replace compilable examples with pseudocode when the lesson claims to teach an API or implementation.
7. Test at the lowest useful distance, then add broader tests only where integration behavior requires them.
8. Record what was compiled, tested, simulated, or checked on a device. Label unverified claims and unavailable validation surfaces directly.
9. Run the repo content gates and `npm run build` after each batch of file changes.

## Planning and Research

- Start series work from `docs/plans/2026-07-13-zero-to-ios-hero-series-plan.md` until a newer approved source of truth replaces it.
- Map every planned lesson to a code anchor, common misconception, validation method, primary source, and dependency on earlier material.
- Treat framework recommendations, supported operating systems, distribution rules, privacy manifests, required reason APIs, entitlements, and review requirements as time-sensitive.
- Cite the page that supports the claim. Do not cite a search result or a broad documentation landing page when a focused source exists.
- Distinguish language behavior from framework behavior. Swift, SwiftUI, UIKit, Xcode, SDKs, and operating systems are separate layers.

## Swift Implementation

- Prefer precise types, explicit domain models, and compiler-enforced invariants over `Any`, force casts, and force unwraps.
- Explain value semantics, reference semantics, copy-on-write collections, optionals, error handling, ownership, and mutation costs where they affect the result.
- Treat `String` as a Unicode collection indexed by `String.Index`, not as an integer-indexed byte array.
- Make concurrency isolation visible. State actor boundaries, `Sendable` expectations, cancellation behavior, and the reason work belongs on or off `MainActor`.
- Preserve the contract used by the target environment. LeetCode signatures, package APIs, application boundaries, and test fixtures have different constraints.
- Keep examples deterministic. Inject clocks, identifiers, storage, network clients, and external services when nondeterminism would make tests flaky or require credentials.

## SwiftUI and UIKit

- Use SwiftUI as the default teaching path for new cross-platform interface work. Treat UIKit as a current first-class framework for existing applications, specialized controls, imperative interaction, and interoperability.
- Teach each framework in its own mental model. Do not translate SwiftUI value views line by line into UIKit objects, or UIKit lifecycle assumptions into SwiftUI views.
- Keep domain and application rules outside view types and view controllers when those rules need independent tests or reuse.
- Cover loading, empty, error, offline, permission-denied, cancellation, and restoration states when the feature can reach them.
- Check Dynamic Type, VoiceOver order and labels, contrast, reduced motion, keyboard access, localization, right-to-left layout, and adaptive size classes where relevant.
- Label APIs and modifiers that need availability checks or deployment-target changes.

## Architecture and Platform Boundaries

- Let domain and application code define contracts for persistence, networking, clocks, identifiers, notifications, sensors, and cloud services when isolation creates test or reuse value.
- Keep framework adapters at the edge. SwiftUI, UIKit, SwiftData, Core Data, URLSession, CloudKit, and system frameworks depend inward on application contracts.
- Avoid ceremonial abstraction. A port that only renames one trivial call without improving testing, substitution, or ownership can remain direct.
- Provide a local or in-memory implementation before requiring cloud credentials, paid accounts, entitlements, or production services.
- State whether a capability works in a Swift package, app target, preview, simulator, or physical device. These environments are not interchangeable evidence.

## Testing and Evidence

- Use Swift Testing for new unit-level examples unless an API, existing target, or platform constraint requires XCTest.
- Keep XCTest for UI tests, performance tests, Objective-C interoperability, and existing suites where migration would add noise without learning value.
- Test public behavior and domain rules before implementation details.
- Include valid, boundary, invalid, cancellation, and error cases when the contract permits them.
- Use deterministic fixtures that obey the same domain constraints as production inputs.
- Do not claim device behavior from a simulator run. Camera, sensors, background execution, performance, thermal behavior, push delivery, universal links, and some entitlement flows need separate evidence.
- Capture the exact command, destination, toolchain version, and result for repeatable validation.

## Content Safeguards

- Quote every frontmatter description with double quotes.
- Use relative links calculated from rendered routes.
- Keep internal planning notes and future work outside `src/content/docs`.
- Use ASCII diagrams only.
- Never place realistic-looking credentials, tokens, signing identities, team IDs, bundle IDs, or provisioning data in examples.
- Explain permissions and entitlements before code depends on them. Include the denial path and the least access needed.
- Link to current primary sources and record the review date for version-sensitive reference maps.

## Validation Sequence

Run the narrowest relevant checks first, then broaden the evidence:

1. Compile or type-check the smallest code unit.
2. Run its focused Swift Testing or XCTest suite.
3. Build the affected scheme for the recorded destination.
4. Run simulator or device checks required by the behavior.
5. Run repo prose, link, example, and rendered-content checks.
6. Run `npm run build` after the batch.

Do not rewrite repository code to work around a sandbox-only failure. Identify the environmental boundary, retry with the appropriate permission when allowed, and report any remaining validation gap.
