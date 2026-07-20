# Zero to iOS Hero, Series Plan

**Date:** 2026-07-13
**Status:** In execution, Gate 3 established
**Series slug:** `zero-to-ios-hero`

## Execution checklist

This checklist is the source of truth for execution. Check an item only after its definition of done is satisfied and its evidence is committed. Every planned post also has a status checkbox in its curriculum table.

Planning and implementation are tracked separately. The skill remains the first implementation deliverable.

- [x] **P0.1, research the curriculum against primary sources**: Review the current Swift, SwiftUI, UIKit, persistence, testing, design, distribution, and Apple-platform framework maps.
- [x] **P0.2, run the initial adversarial curriculum review**: Identify testing, versioning, scope, validation, entitlement, architecture, and repetition risks and amend the plan.
- [x] **P0.3, add durable execution tracking**: Add gates, definitions of done, batch criteria, and a checkbox for every planned post.

### Gate 0: Build the authoring system before writing posts

- [x] **F0.1, create the `ios-swift-development` skill**: Initialize `.agents/skills/ios-swift-development/` with the skill-creator workflow. Make it trigger for planning, writing, reviewing, compiling, testing, and updating Swift and Apple-platform content.
- [x] **F0.2, add focused skill references**: Add concise references for Swift, SwiftUI, UIKit, testing, architecture, platform capabilities, availability, and Apple-source research. Keep the main `SKILL.md` procedural and under 500 lines.
- [x] **F0.3, define validation commands**: Record how to compile Swift packages, build Xcode schemes, run Swift Testing and XCTest suites, run simulator destinations, and distinguish simulator evidence from device evidence.
- [x] **F0.4, encode content safeguards**: Require stable-toolchain baselines, explicit deployment targets, concurrency checking, availability notes, permission and entitlement notes, accessibility checks, primary sources, and working code rather than pseudocode.
- [x] **F0.5, validate the skill package**: Run `quick_validate.py`, regenerate `agents/openai.yaml`, and remove all template placeholders.
- [x] **F0.6, challenge the skill with realistic tasks**: Use it to draft one Swift-language outline, review one SwiftUI example, review one UIKit example, and design one test plan. Revise any instruction that produces stale, unsafe, untestable, or framework-biased output.
- [x] **F0.7, record the reusable capability**: Add the skill to `AGENTS.md`, update `docs/feature_tracker.md`, and add focused authoring documentation needed by later sessions.
- [x] **F0.8, freeze the first supported matrix**: Record the stable Xcode and Swift versions, Swift language mode, deployment targets, simulator destinations, physical-device requirements, and beta-only exclusions.

No curriculum post moves to in progress until F0.1 through F0.8 are complete.

### Gate 1: Add runnable Swift support in the browser

- [x] **R1.1, inventory the existing runner contract**: Record editor, reset, output, timing, starter-code, tab-measurement, approach-block, timeout, accessibility, and failure behavior from the Python, TypeScript, and Go runners in the [runner contract baseline](../swift-browser-runner.md).
- [x] **R1.2, write the runner ADR**: Evaluate syntax-only support, precompiled Swift WebAssembly, a compiler in the browser, a sandboxed first-party compile service, and a third-party runner. Include GitHub Pages, bundle size, latency, offline behavior, privacy, abuse, maintenance, and toolchain-version tradeoffs in the [Swift browser execution ADR](../adr/2026-07-13-swift-browser-execution.md).
- [x] **R1.3, prove the risky path before choosing it**: Build the smallest spike that compiles or executes editable Swift with captured standard output, compiler diagnostics, a timeout, and cancellation. Reject any option that only runs code fixed at site-build time while presenting itself as an editable REPL. Evidence is recorded in the [Swift runner executor spike](../spikes/2026-07-13-swift-runner.md).
- [x] **R1.4, preserve a local path**: If execution crosses HTTP, provide a local runner or contract-shaped mock that requires no cloud credentials and supports compile success, compile failure, runtime failure, timeout, and cancellation. The maintained path is recorded in [Swift Runner Local Development](../swift-runner-local-development.md).
- [x] **R1.5, implement `SwiftRepl.astro`**: Add Swift editing, syntax support, reset, status, standard output and error, diagnostics, timing, starter-code detection, approach-block execution, and graceful runner-unavailable behavior. The component and configuration path are documented in [Swift Runner Local Development](../swift-runner-local-development.md).
- [x] **R1.6, isolate untrusted code**: Enforce CPU, wall-clock, memory, output, process, filesystem, and network limits at the execution boundary. Keep credentials and host resources outside the sandbox. The enforced controls and remaining public-service limits are recorded in [Swift Runner Isolation](../swift-runner-isolation.md).
- [x] **R1.7, test the browser surface**: Cover multiple REPLs on one page, hidden tab measurement, keyboard use, screen-reader labels, mobile layout, timeout, cancellation, cache behavior, service failure, and one representative coding-problem harness. The isolated test route and validation command are documented in [Swift Runner Local Development](../swift-runner-local-development.md).
- [x] **R1.8, document and track the capability**: Add the ADR, focused runner documentation, validation commands, authoring rules, `AGENTS.md` guidance if universal, and the shipped entry in `docs/feature_tracker.md`.

### Gate 1B: Run Swift from the live site

The GitHub Pages deployment remains static. Live execution uses the same project-owned job contract as local development, but the API and isolated executor run on separate infrastructure. Completing the local browser path does not complete this gate.

- [x] **R2.1, complete the loopback service**: The versioned HTTP job API now wraps the pinned Swift 6.3.3 Docker executor, binds only to loopback, supports real cancellation, clears terminal source, expires job records, bounds local work, and starts with Astro through `npm run dev:swift`. Deterministic service tests and a separate real Docker and Playwright validator prove the local path. Evidence is recorded in [Swift Runner Local Development](../swift-runner-local-development.md) and the [local service ADR](../adr/2026-07-15-swift-runner-local-service.md).
- [x] **R2.2, choose the production deployment boundary**: Use a trusted public coordinator and one disposable Fly Machine per accepted job. The worker has a private one-shot handoff, default-deny egress, no provider credential, no persistent volume, and no public service. The accepted staging design records the Docker control-plane replacement, ownership, launch envelope, $25 monthly ceiling, recovery, placement, alternatives, and required security evidence in the [production deployment ADR](../adr/2026-07-15-swift-runner-production-deployment.md). Deployment still requires owner approval and does not make the runner publicly available.
- [x] **R2.3, harden the public API**: The shared coordinator now enforces exact request fields and limits, the known harness and toolchain, opaque client-owned job IDs, exact allowed origins with an optional required-origin mode, idempotent request IDs, conflicting-duplicate rejection, per-client submission, outstanding-job and polling windows, global concurrency and queue bounds, and rejection before executor allocation. The browser polls every 250 milliseconds. The [public API policy](../swift-runner-public-api.md) records defaults, identity requirements, retention, validation, and remaining staging obligations.
- [ ] **R2.4, preserve executor isolation in production**: Keep job networking and IPC disabled, filesystems ephemeral, privileges dropped, host files and credentials absent, resources capped, and cleanup mandatory for every terminal path. Do not expose the Docker daemon or executor control plane to the public network.
- [ ] **R2.5, define privacy and retention behavior**: Keep the source-transfer notice in the REPL, avoid logging source or full output, redact operational events, document terminal-result retention, and verify that source, binaries, containers, and workspaces disappear after expiration.
- [ ] **R2.6, deploy a staging runner**: Serve the runner over HTTPS, pin the executor image digest, restrict CORS to the staging and local site origins, expose health and capability checks, and prove success, compiler failure, runtime failure, timeout, cancellation, output limiting, and service-unavailable behavior.
- [ ] **R2.7, add operational controls**: Add structured metrics without source content, queue and latency alerts, error and saturation alerts, spending limits, rate-limit visibility, dependency and image patching, rollback instructions, and an emergency kill switch that leaves the editor usable.
- [ ] **R2.8, connect GitHub Pages**: Configure `PUBLIC_SWIFT_RUNNER_URL` in the production site build, allow only the published site origin, keep credentials out of browser assets, and preserve the honest unavailable state when the service is disabled or unreachable.
- [ ] **R2.9, prove the live path end to end**: From the published GitHub Pages origin, run an edited Swift solution and a completed approach, verify the exact Swift 6.3.3 Linux evidence, exercise cancellation and failure states, inspect browser console and network errors, and repeat the focused accessibility and mobile checks.
- [ ] **R2.10, document and release the service**: Record deployment, configuration, incident response, retention, local reproduction, validation commands, ownership, and known Linux-only limits. Update the feature tracker only after the live execution path passes its gate.

Do not mark the live runner available or describe GitHub Pages as executing Swift until R2.1 through R2.10 pass. A public endpoint that lacks quotas, cleanup, observability, or an emergency shutdown remains a staging service.

### Workstream 2: Add Swift to every coding problem

The generated baseline on 2026-07-13 found 189 coding-problem pages, 504 numeric documented approaches, 0 pages with Swift, 470 Python source files, 469 TypeScript source files, and 469 Go source files across starter and approach implementations. S2.C12 normalized two lettered Merge k Sorted Lists headings into approaches 3 and 4, correcting the tracked approach total to 506 without adding algorithms. The durable inventory lives in [Swift Coding Problem Coverage](../swift-coding-problem-coverage.md).

S2.1 through S2.3, the browser runner, and one representative category form the pilot gate. After that gate passes, the remaining categories can advance in checked batches alongside curriculum authoring. The complete catalog remains a required program deliverable, but it does not block post 1.

- [x] **S2.1, generate a coverage manifest**: Inventory every problem page, starter file, documented approach, helper type, test harness, and language tab. Fail validation when a page or approach lacks Swift.
- [x] **S2.2, define the Swift solution contract**: Standardize `.swift` filenames, starter TODOs, assertion output, `runTests`, LeetCode-compatible signatures, and shared `ListNode`, `TreeNode`, graph-node, heap, and interval helpers. The maintained contract, canonical helpers, validation rules, and compile specimens live in [Swift Coding Problem Contract](../swift-coding-problem-contract.md).
- [x] **S2.3, create shared cross-language test vectors**: Reuse the same valid, boundary, and deliberate invalid cases in Python, TypeScript, Go, and Swift without silently normalizing contract violations. The schema, invalid-input policy, deterministic renderers, drift checks, and four-language proof live in [Coding Problem Test Vectors](../coding-problem-test-vectors.md).
- [x] **S2.4, add Swift starter code to all 189 pages**: Every Try it yourself section gets a Swift tab backed by an editable `.swift` file and embedded tests.
- [x] **S2.5, add Swift for every documented approach**: Match each approach section with compiling Swift code. Do not stop at one canonical solution when the page teaches brute-force, recursive, iterative, optimized, or follow-up variants.
- [x] **S2.6, teach Swift-specific tradeoffs**: Explain value and reference semantics, `String.Index`, `Character`, Unicode, integer width and overflow, recursion depth, copy-on-write collections, optional handling, missing standard-library heap types, and mutation costs where they change an approach.
- [x] **S2.7, compile the entire catalog**: Run every standalone Swift source and its tests under the supported stable Swift toolchain. Add time and output limits and report file-specific diagnostics.
- [x] **S2.8, verify the rendered integration**: Build the site, spot-test representative array, tree, graph, heap, dynamic-programming, string, and linked-list pages, and run browser tests against the selected Swift runner.
- [x] **S2.9, update authoring and feature records**: Teach future coding-problem work to require Swift parity, update templates and validators, record the capability in `docs/feature_tracker.md`, and update the iOS and Swift skill.

Category rollout checklist:

- [x] **S2.C01**: 1D dynamic programming, 12 pages. All 12 starters and 39 documented approaches are wired to Swift REPL tabs, share 71 reviewed vectors, compile under Swift 6 mode, and cover recursion, memoization, bottom-up tables, rolling state, palindrome expansion, subset targets, and negative-product sign changes.
- [x] **S2.C02**: 2D dynamic programming, 12 pages. All 12 starters and 35 documented approaches are wired to Swift REPL tabs, share 84 reviewed vectors, compile under Swift 6 mode, and cover grid recurrence, string alignment, interval DP, matrix paths, stock state machines, and subset counting.
- [x] **S2.C03**: Advanced graphs, 8 pages. All 8 starters and 19 documented approaches are wired to Swift REPL tabs, share 56 reviewed vectors, compile under Swift 6 mode, and cover bridge discovery, minimum spanning trees, path probability, Eulerian traversal, shortest paths, constrained hops, and union-find activation.
- [x] **S2.C04**: Arrays and hashing, 18 pages. All 18 starters and 43 documented approaches are wired to Swift REPL tabs, share 111 reviewed vectors, compile under Swift 6 mode, and cover hash lookup, frequency counting, deterministic grouping, prefix sums, stateful range queries, standard-library string codecs, and heap-backed frequency selection.
- [x] **S2.C05**: Backtracking, 9 pages. All 9 starters and 27 documented approaches are wired to Swift REPL tabs, share 54 reviewed vectors, compile under Swift 6 mode, and cover cartesian products, combination search, permutations, N-Queens constraints, subset deduplication, grid mutation, and palindrome partitioning.
- [x] **S2.C06**: Binary search, 8 pages. All 8 starters and 23 documented approaches are wired to Swift REPL tabs, share 64 reviewed vectors, compile under Swift 6 mode, and satisfy the coverage contract.
- [x] **S2.C07**: Bit manipulation, 7 pages. All 7 starters and 21 documented approaches are wired to Swift REPL tabs, share 57 reviewed vectors, compile under Swift 6 mode, and extend exact cross-language vector equality to array results.
- [x] **S2.C08**: Graphs, 19 pages. All 19 starters and 39 documented approaches are wired to Swift REPL tabs, share 76 reviewed vectors, compile under Swift 6 mode, and add inout mutation plus graph structure and identity observations to the vector renderer.
- [x] **S2.C09**: Greedy, 10 pages. All 10 starters and 31 documented approaches are wired to Swift REPL tabs, share 40 reviewed vectors, compile under Swift 6 mode, and preserve the canonical heap helper for Hand of Straights.
- [x] **S2.C10**: Heap and priority queue, 7 pages. All 7 starters and 20 documented approaches are wired to Swift REPL tabs, share 32 reviewed vectors, compile under Swift 6 mode, and extend stateful fixtures to constructor arguments plus collection-valued operation results.
- [x] **S2.C11**: Intervals, 6 pages. All 6 starters and 18 documented approaches are wired to Swift REPL tabs, share 30 reviewed vectors, compile under Swift 6 mode, and cover sorting, greedy selection, sweep lines, binary search, heaps, and segment-tree range updates.
- [x] **S2.C12**: Linked lists, 14 pages. All 14 starters and 40 documented approaches are wired to Swift REPL tabs, share 70 reviewed vectors, compile under Swift 6 mode, and cover acyclic lists, list arrays, cycles, shared-tail identity, random-pointer deep copies, heaps, in-place mutation, and stateful LRU behavior.
- [x] **S2.C13**: Math and geometry, 8 pages. All 8 starters and 23 documented approaches are wired to Swift REPL tabs, share 50 reviewed vectors, compile under Swift 6 mode, and add scale-aware approximate floating-point assertions to the cross-language vector renderer.
- [x] **S2.C14**: Sliding window, 8 pages. All 8 starters and 22 documented approaches are wired to Swift REPL tabs, share 52 reviewed vectors, compile under Swift 6 mode, use `Character` arrays where integer offsets would violate Swift string indexing, and preserve the canonical heap helper for Sliding Window Maximum.
- [x] **S2.C15**: Stack, 16 pages. All 16 starters and 33 documented approaches are wired to Swift REPL tabs, share 96 reviewed vectors, compile under Swift 6 mode, and cover stateful MinStack operations, expression parsing, monotonic stacks, collisions, fleets, and modulo contribution counting.
- [x] **S2.C16**: Trees, 17 pages. All 17 starters and 45 documented approaches are wired to Swift REPL tabs, share 87 reviewed vectors, compile under Swift 6 mode, and extend the shared harness with level-order construction, structural observation, node lookup, and identity checks.
- [x] **S2.C17**: Tries, 3 pages. All 3 starters and 9 documented approaches are wired to Swift REPL tabs, share 14 reviewed vectors, compile under Swift 6 mode, and preserve the exact canonical trie node helper across stateful prefix, wildcard, and board-search implementations.
- [x] **S2.C18**: Two pointers, 7 pages. All 7 starters and 19 documented approaches are wired to Swift REPL tabs, share 43 reviewed vectors, compile under Swift 6 mode, and cover deterministic triplet output plus inout rotation and character compression.

### Gate 3: Establish the series workspace

- [x] **F3.1, create the Field Notes acceptance specification**: The [Field Notes acceptance specification](../field-notes-acceptance-specification.md) defines shared behavior, accessibility, error-state, persistence, framework-specific, and evidence criteria for the SwiftUI and UIKit implementations.
- [x] **F3.2, create companion-code workspaces**: `companion/field-notes/` establishes the Swift package, command-line checkpoint, SwiftUI target, UIKit target, shared Swift Testing support, deterministic fixtures, local in-memory adapter, app unit tests, UI tests, and generated-project boundary. The [workspace ADR](../adr/2026-07-16-field-notes-companion-workspace.md) records the decision and current Not verified Xcode boundary.
- [x] **F3.3, create the validation matrix**: The [Zero to iOS Hero validation matrix](../zero-to-ios-hero-validation-matrix.md) maps all 140 posts to compile, automated-test, simulator, device, accessibility, performance, and manual-review evidence.
- [x] **F3.4, create the series landing page when the first arc is publishable**: The landing page now introduces the curriculum, links the complete orientation arc, explains the evidence labels, and distinguishes browser Swift from Apple SDK validation.

### Batch gates

- [ ] **B1, Swift foundations complete**: Posts 1-23 are published with compiling examples and language tests. The browser runner and one Swift coding-problem category prove the end-to-end authoring path.
- [ ] **B2, design and SwiftUI complete**: Posts 24-44 and the SwiftUI Field Notes acceptance suite are complete.
- [ ] **B3, UIKit complete**: Posts 45-58 pass the same product acceptance criteria through UIKit.
- [ ] **B4, architecture and testing complete**: Posts 59-78 prove boundaries and testing strategy with executable evidence. All 189 coding problems and every documented approach have compiled Swift parity.
- [ ] **B5, production and shipping complete**: Posts 79-86 produce a beta-ready build and release record.
- [ ] **B6, ecosystem atlas complete**: Posts 87-110 record simulator, device, entitlement, and account limits per capability.
- [ ] **B7, case studies complete**: Posts 111-140 finish five tested release reviews.

### Definition of done for a post checkbox

Compilation follows the claim made by the post. A prose-only post does not need a synthetic executable just to satisfy the series workflow. A post with runnable Swift compiles its code anchor with the narrowest appropriate tool, such as `swiftc`, Swift Package Manager, or an Xcode target. Full Xcode is required only when completion depends on an Apple SDK, app target, Simulator runtime, signing workflow, archive, or physical-device run. Missing Xcode evidence blocks only the affected post or claim, not unrelated posts or the series as a whole.

The post tables track authoring and validation separately. A plain post title is planned. A linked title means the reader-facing post has been created and indexed. The `Done` checkbox means every assigned validation requirement has passed. Authoring continues in reading order when a checkbox remains open because Xcode, Simulator, hardware, an account, or an entitlement is unavailable.

A post checkbox can change from `[ ]` to `[x]` only when:

- The post is reader-facing, indexed, cross-linked, and assigned its series order.
- Every code anchor compiles under the recorded stable toolchain.
- Automated tests cover the behavior introduced by the post at the lowest useful testing distance.
- Relevant failure, cancellation, empty, offline, permission-denied, and migration states are exercised.
- Accessibility and localization consequences are documented and tested where applicable.
- Simulator-only, device-only, account-gated, and entitlement-gated claims are labeled.
- Primary sources are current as of the post date.
- Style, published-content, links, code examples, and the full site build pass.
- The companion-code checkpoint and validation evidence are committed.

## Goal

Take a reader from no Swift or Apple-platform experience to designing, building, testing, and shipping production-quality apps across the Apple ecosystem.

The program teaches four subjects in full rather than treating three as supporting material for the fourth:

1. Swift as a programming language.
2. SwiftUI as a declarative UI system.
3. UIKit as an event-driven UI system.
4. App architecture and product design as disciplines independent of either UI framework.

The core path ends with a shipped iOS app. An ecosystem atlas then covers iPadOS, watchOS, tvOS, macOS, and visionOS, along with the Apple frameworks that turn a generic app into a platform-aware product. Five case studies close the program by applying the material to products with different interaction, data, device, business, and operational pressures.

## Scope promise

The series gives a reader the reusable knowledge needed to bring an app idea to fruition:

- Turn an idea into user problems, flows, states, and a release boundary.
- Express domain rules safely in Swift.
- Practice Swift directly in browser-based exercises and throughout the full coding-problem catalog.
- Build complete interfaces in SwiftUI and UIKit.
- Choose architecture based on product pressure instead of fashion.
- Connect local storage, remote APIs, authentication, real-time events, and offline behavior.
- Integrate Apple device capabilities without coupling the whole app to one framework.
- Test behavior, accessibility, performance, migrations, and release wiring.
- Sign, beta test, submit, observe, and evolve an App Store product.
- Share domain and application code across Apple platforms while preserving each platform's interaction model.

No finite series can document every vendor SDK, proprietary backend, regulated-industry rule, or specialized Apple API. The capability atlas teaches repeatable integration patterns and gives readers a researched route into those narrower domains.

## Audience and starting point

The first Swift arc assumes no Swift knowledge and explains programming concepts as they appear. A reader who already programs can move faster through the first arc, but should still complete its exercises because later posts depend on Swift value semantics, protocols, error handling, and concurrency.

The practical prerequisites are:

- A supported Mac capable of running the current stable Xcode.
- An Apple ID. Paid program membership is not needed until device capabilities, TestFlight, or distribution require it.
- Comfort creating files and using a terminal. Git is taught in context.
- No prior Objective-C, SwiftUI, UIKit, or mobile-development experience.

## Curriculum shape

| Layer | Posts | Reader outcome |
| --- | ---: | --- |
| Core iOS path | 1-86 | Build the same useful product in SwiftUI and UIKit, extract durable architecture, test it at several distances, harden it, and prepare a release. |
| Apple ecosystem atlas | 87-110 | Adapt the core skills to other Apple devices and select capabilities for maps, media, health, ML, commerce, cloud, and hardware. |
| Five case studies | 111-140 | See the full process repeated across productivity, fitness, media, community commerce, and spatial-computing products. |

The 140 posts form one umbrella program, but readers do not need to read every ecosystem or case-study post in sequence. Posts 1-86 are the required path. Posts 87-110 are selected by capability. Posts 111-140 are complete product arcs that can be read independently after the core.

## Version policy

- Use the current stable Xcode and Swift language mode when each post is drafted.
- Keep the core path off beta-only APIs. Put beta material in clearly labeled update notes.
- Use the oldest deployment target that supports the course's modern Observation and persistence examples. Revisit that target before drafting the first app post.
- Mark API availability in prose and code. Show fallbacks when an availability check changes product behavior.
- Teach current Swift concurrency checking early enough that readers do not build a large pre-concurrency codebase first.
- Treat SwiftUI as the default for new cross-platform UI and UIKit as a current, first-class framework needed for existing apps, specialized controls, and imperative interaction.
- Teach programmatic UIKit first. Cover storyboards and nibs so readers can work in established codebases.
- Keep visual styling in a replaceable layer. Platform appearance changes such as Liquid Glass belong in design-system and availability sections, not inside domain code.

The Swift reference retrieved during planning identifies itself as Swift 6.4 beta. That is evidence for keeping the curriculum's baseline on the stable toolchain while maintaining versioned callouts for incoming language changes.

## Teaching contract for every post

Every post includes:

1. A concrete problem and the vocabulary needed to discuss it.
2. A mental model before API details.
3. A small working code anchor that gives the post a center of gravity.
4. At least one wrong first move and the failure it creates.
5. A guided implementation, tests, and an independent exercise.
6. Accessibility, performance, privacy, and platform notes where they affect the feature.
7. A checkpoint that states what the reader can now build or explain.
8. Links to primary Apple or Swift sources and the next dependency in the path.

Code evolves through tagged checkpoints. Readers can start at the current post without reconstructing every prior commit, while the main branch shows the completed product.

## Project spine

The core project is **Field Notes**, a personal field journal for text, tags, photos, location, search, favorites, and optional sync. It begins as a command-line Swift package, becomes a SwiftUI app, is rebuilt in UIKit, and ends as a hybrid app with a shared domain and application core.

The product is intentionally richer than a to-do list:

- Local-first behavior makes persistence and migrations unavoidable.
- Search, filtering, forms, media, and maps exercise common interface patterns.
- Optional accounts and sync introduce networking, identity, conflicts, and offline recovery.
- Photos and location force honest permission, privacy, and failure-state design.
- Widgets, shortcuts, and platform companions expose extension and ecosystem boundaries.

### Phone layout

```text
┌─────────────────────────────┐
│ Field Notes             [+] │
├─────────────────────────────┤
│ [Search notes...]           │
├─────────────────────────────┤
│ Redwood trail           >   │
│ 2 photos, yesterday         │
├─────────────────────────────┤
│ Tide pools              >   │
│ coast, favorite             │
├─────────────────────────────┤
│ Notes     Map     Settings  │
└─────────────────────────────┘
```

### Adaptive iPad and Mac layout

```text
┌──────────────────┬──────────────────────────┐
│ Field Notes  [+] │ Redwood trail            │
├──────────────────┼──────────────────────────┤
│ [Search...]      │ ┌──────────────────────┐ │
│                  │ │ photo                │ │
│ Redwood trail  > │ └──────────────────────┘ │
│ Tide pools     > │ Tags: forest, morning    │
│ City garden    > │                          │
│ ~~~~~~~~~~~~~~~~ │ [Edit] [Map] [Share]     │
└──────────────────┴──────────────────────────┘
```

### Target architecture

The first version stays simple. Boundaries appear only when a real test, substitution, or product pressure calls for them.

```text
┌───────────────────────────────────────────────────┐
│ Driving adapters                                  │
│ SwiftUI, UIKit, widgets, intents, tests           │
└───────────────────────────────────────────────────┘
                         | user intent
                         v
┌───────────────────────────────────────────────────┐
│ Application                                       │
│ use cases, navigation intent, transaction rules   │
└───────────────────────────────────────────────────┘
                         | domain operations
                         v
┌───────────────────────────────────────────────────┐
│ Domain                                            │
│ entities, value objects, invariants, policies     │
└───────────────────────────────────────────────────┘
                         | purpose-named ports
                         v
┌───────────────────────────────────────────────────┐
│ Driven adapters                                   │
│ SwiftData, files, URLSession, CloudKit, clock     │
└───────────────────────────────────────────────────┘
```

The dependency direction points inward. SwiftUI, UIKit, storage, and networking depend on application contracts. The domain does not import those frameworks. Small CRUD features can remain simpler when a port would only rename one trivial call.

## Core path, posts 1-86

### Arc 1: Orientation and development workflow

| Done | # | Post | Question | Code anchor | Wrong first move | Follow-up path |
| :---: | ---: | --- | --- | --- | --- | --- |
| [ ] | 1 | [The Apple development map](../../src/content/docs/posts/2026-07-16-apple-development-map.mdx) | What are Swift, Xcode, SDKs, frameworks, targets, schemes, simulators, and platform runtimes? | A minimal `print("Hello, Apple platforms")` executable. | Treating Xcode, Swift, SwiftUI, and iOS as interchangeable names. | Install the toolchain and run code in post 2. |
| [ ] | 2 | [Xcode, simulators, devices, and Git](../../src/content/docs/posts/2026-07-16-xcode-simulators-devices-git.md) | How does code move from a source file to a running process and a recorded change? | Create a project, run two simulator destinations, and make the first Git commit. | Clicking through Xcode without learning targets, build errors, derived data, or source control. | Use a playground and package for fast language practice. |
| [ ] | 3 | [How to learn by building and debugging](../../src/content/docs/posts/2026-07-16-learning-by-building-debugging.mdx) | How do compiler errors, breakpoints, logs, documentation, and small experiments shorten feedback loops? | A deliberate failing assertion inspected in LLDB. | Copying a finished app before forming a prediction about the code. | Begin the Swift language track. |

### Arc 2: Swift from first principles to production language features

| Done | # | Post | Question | Code anchor | Wrong first move | Follow-up path |
| :---: | ---: | --- | --- | --- | --- | --- |
| [ ] | 4 | [Values, variables, types, and inference](../../src/content/docs/posts/2026-07-16-swift-values-variables-types-inference.mdx) | How does Swift represent facts and prevent incompatible operations? | Model a note title, date, rating, and favorite flag with `let`, `var`, and explicit types. | Making every value mutable or reaching for `Any`. | Combine values with operators and expressions. |
| [ ] | 5 | [Operators, expressions, conversion, and overflow](../../src/content/docs/posts/2026-07-16-swift-operators-conversion-overflow.mdx) | How does Swift evaluate calculations without silently mixing numeric types? | Calculate a bounded relevance score with explicit conversion. | Assuming numeric types coerce automatically or overflow is harmless. | Use results to choose control-flow branches. |
| [ ] | 6 | [Conditions, switches, loops, ranges, and patterns](../../src/content/docs/posts/2026-07-16-swift-control-flow-patterns.mdx) | How does Swift express decisions and repeated work? | Classify and filter notes with `switch`, `where`, ranges, and `for`. | Replacing a finite domain with nested string comparisons. | Move repeated behavior into functions. |
| [ ] | 7 | [Functions and API shape](../../src/content/docs/posts/2026-07-16-swift-functions-api-shape.mdx) | How do parameters, labels, return values, defaults, tuples, and `inout` form readable APIs? | Implement `rank(notes:matching:limit:)`. | Hiding unrelated work in a vague `process()` function. | Represent missing results safely with optionals. |
| [ ] | 8 | [Optionals and absence](../../src/content/docs/posts/2026-07-16-swift-optionals-absence.mdx) | How does Swift make missing data explicit? | Parse an optional coordinate with binding, chaining, `guard`, and nil coalescing. | Force-unwrapping values supplied by users or networks. | Store many values in collections. |
| [ ] | 9 | [Arrays, dictionaries, sets, sequences, and collection cost](../../src/content/docs/posts/2026-07-16-swift-collections-sequences-cost.mdx) | Which collection expresses order, lookup, uniqueness, and lazy traversal? | Build a tag index and compare eager and lazy filtering. | Choosing an array for every problem and hiding quadratic lookup. | Handle human text correctly. |
| [ ] | 10 | [Strings, characters, Unicode, and formatting](../../src/content/docs/posts/2026-07-16-swift-strings-unicode-formatting.md) | Why is a Swift string not an array of bytes or integer indexes? | Normalize search text and format dates and measurements for display. | Slicing user text by byte offset or concatenating localized sentences. | Put related data into value types. |
| [ ] | 11 | [Structures and value semantics](../../src/content/docs/posts/2026-07-16-swift-structures-value-semantics.mdx) | How do structs, copying, mutation, and copy-on-write shape safe models? | Define a `FieldNote` struct and prove that an edited copy does not mutate the original. | Assuming assignment always shares an object. | Model closed alternatives with enums. |
| [ ] | 12 | [Enumerations, associated values, and pattern matching](../../src/content/docs/posts/2026-07-16-swift-enumerations-associated-values-pattern-matching.mdx) | How do enums make invalid state harder to represent? | Model loading as `idle`, `loading`, `loaded`, and `failed`. | Coordinating several booleans that permit contradictory states. | Compare value models with class identity. |
| [ ] | 13 | [Classes, identity, inheritance, and type casting](../../src/content/docs/posts/2026-07-16-swift-classes-identity-inheritance-type-casting.mdx) | When does shared identity matter, and when is inheritance the wrong tool? | Track a shared editing session with reference identity. | Using classes by default or building deep inheritance trees. | Encapsulate behavior with properties and methods. |
| [ ] | 14 | [Properties, methods, subscripts, initialization, and deinitialization](../../src/content/docs/posts/2026-07-16-swift-properties-methods-subscripts-initialization-deinitialization.mdx) | How does a type protect invariants throughout its lifetime? | Create a validated `Tag` value with computed properties and failable initialization. | Constructing temporarily invalid objects and hoping callers repair them. | Pass behavior as values with closures. |
| [ ] | 15 | [Closures, function types, capture, and higher-order operations](../../src/content/docs/posts/2026-07-16-swift-closures-function-types-capture-higher-order-operations.mdx) | How does Swift pass behavior without losing readability or lifetime control? | Sort and group notes with named closure transformations. | Nesting long trailing closures until control flow disappears. | Generalize behavior through protocols. |
| [ ] | 16 | [Protocols, extensions, and protocol-oriented design](../../src/content/docs/posts/2026-07-16-swift-protocols-extensions-protocol-oriented-design.mdx) | How do capabilities and default behavior support substitution? | Define a small `Clock` protocol and production and fixed implementations. | Creating one protocol for every class with no alternate behavior. | Report failures across boundaries. |
| [ ] | 17 | [Errors, `Result`, throwing APIs, and recovery](../../src/content/docs/posts/2026-07-17-swift-errors-result-throwing-recovery.mdx) | Which failures should throw, return a value, or become domain state? | Decode an import and map transport errors to `ImportError`. | Catching every error and returning an empty result. | Generalize safe algorithms with generics. |
| [ ] | 18 | [Generics, associated types, existentials, and opaque types](../../src/content/docs/posts/2026-07-17-swift-generics-associated-types-existentials-opaque-types.mdx) | How does Swift preserve type information while supporting reusable code? | Build a generic paged result and a protocol-backed note source. | Replacing precise types with `Any` or using `any` without understanding erasure. | Understand ownership before asynchronous work. |
| [ ] | 19 | [ARC, ownership, capture lists, and memory safety](../../src/content/docs/posts/2026-07-18-swift-arc-ownership-capture-lists-memory-safety.mdx) | Why do strong cycles and escaped closures keep objects alive? | Reproduce and fix an editor and callback retain cycle. | Adding `weak` everywhere without defining ownership. | Move long-running work into structured concurrency. |
| [ ] | 20 | [Async and await, tasks, groups, cancellation, and continuations](../../src/content/docs/posts/2026-07-18-swift-async-await-tasks-groups-cancellation-continuations.mdx) | How does structured concurrency model work that can suspend? | Fetch note metadata and photos concurrently with cancellation. | Wrapping every callback in an unstructured `Task`. | Protect shared mutable state with isolation. |
| [ ] | 21 | [Actors, global actors, `Sendable`, and data isolation](../../src/content/docs/posts/2026-07-18-swift-actors-global-actors-sendable-data-isolation.mdx) | How does Swift prevent data races across concurrency domains? | Put sync bookkeeping in an actor and UI mutation on `MainActor`. | Silencing concurrency warnings with unchecked annotations. | Learn the compile-time tools that generate code. |
| [ ] | 22 | [Property wrappers, result builders, and macros](../../src/content/docs/posts/2026-07-19-swift-property-wrappers-result-builders-macros.mdx) | What code do these language features synthesize, and when do they clarify intent? | Build a tiny validation result builder and inspect expansion. | Treating generated syntax as magic or writing macros for ordinary functions. | Package code behind deliberate module boundaries. |
| [ ] | 23 | [Modules, packages, access control, interoperability, and API design](../../src/content/docs/posts/2026-07-19-swift-modules-packages-access-control-interoperability-api-design.md) | How does Swift code become a maintainable library and cooperate with Objective-C and C APIs? | Extract `FieldNotesCore` into a Swift package with a public API and tests. | Making every symbol public or leaking Objective-C types through the domain. | Apply the language to product and interaction design. |

### Arc 3: Product and interface design

| Done | # | Post | Question | Code anchor | Wrong first move | Follow-up path |
| :---: | ---: | --- | --- | --- | --- | --- |
| [ ] | 24 | [From app idea to user problem](../../src/content/docs/posts/2026-07-19-ios-app-idea-user-problem.md) | Whose problem does the app solve, in what context, and what is the smallest valuable release? | Write a one-page Field Notes product brief and measurable release outcome. | Starting with a feature inventory or preferred framework. | Turn the problem into flows and states. |
| [ ] | 25 | [User journeys, tasks, states, and edge cases](../../src/content/docs/posts/2026-07-19-ios-user-journeys-tasks-states-edge-cases.md) | What can happen before, during, and after the happy path? | Model capture, edit, delete, permission denial, empty, offline, and recovery flows. | Designing only populated screens with a perfect network. | Organize the information and navigation. |
| [ ] | 26 | [Information architecture and navigation](../../src/content/docs/posts/2026-07-19-ios-information-architecture-navigation.md) | Which objects, destinations, and relationships deserve space in the interface? | Draw the note list, map, detail, editor, and settings route graph. | Mirroring database tables or placing every feature in a tab. | Turn routes into interaction contracts. |
| [ ] | 27 | [Interaction design and feedback](../../src/content/docs/posts/2026-07-19-ios-interaction-design-feedback.md) | How do controls, focus, gestures, confirmations, undo, and progress communicate cause and effect? | Specify save, destructive delete, autosave, and undo state transitions. | Hiding important actions behind undiscoverable gestures. | Give those interactions a consistent visual language. |
| [ ] | 28 | [Visual systems, HIG, typography, color, symbols, and materials](../../src/content/docs/posts/2026-07-19-ios-visual-systems-hig-typography-color-symbols-materials.mdx) | How does a design system remain native, legible, and adaptable? | Define semantic tokens for type, spacing, color, shape, and emphasis. | Hard-coding visual values per screen or using color as the only signal. | Adapt the system to different windows and devices. |
| [ ] | 29 | [Adaptive design for iPhone, iPad, and windows](../../src/content/docs/posts/2026-07-19-ios-adaptive-design-iphone-ipad-windows.mdx) | How does the same task work across size, orientation, input, multitasking, and multiple scenes? | Transform a phone navigation stack into a split-view specification. | Branching on device model instead of available space and traits. | Test whether every person can use the result. |
| [ ] | 30 | [Accessibility, localization, and inclusive product design](../../src/content/docs/posts/2026-07-19-ios-accessibility-localization-inclusive-product-design.md) | How do VoiceOver, Dynamic Type, contrast, motion, input methods, and locale affect the product model? | Audit the editor at extra-large text, right-to-left layout, and VoiceOver order. | Bolting accessibility labels and translated strings on after layout freezes. | Implement the design first in SwiftUI. |

### Arc 4: SwiftUI in depth

| Done | # | Post | Question | Code anchor | Wrong first move | Follow-up path |
| :---: | ---: | --- | --- | --- | --- | --- |
| [ ] | 31 | [SwiftUI's value-view mental model](../../src/content/docs/posts/2026-07-19-swiftui-value-view-mental-model.md) | What is recomputed, what persists, and how do identity and dependencies drive updates? | Trace `body` evaluation for a counter without assuming view instances are screens. | Treating a SwiftUI view like a mutable UIKit view object. | Compose useful views and modifiers. |
| [ ] | 32 | [Composition, modifiers, styles, and custom components](../../src/content/docs/posts/2026-07-19-swiftui-composition-modifiers-styles-components.md) | How do small views become a stable design system without wrapper noise? | Build `NoteRow`, `TagChip`, and a custom button style. | Creating a component for every stack or a modifier with hidden business logic. | Arrange components through the layout system. |
| [ ] | 33 | [Layout, safe areas, stacks, grids, frames, and custom layout](../../src/content/docs/posts/2026-07-19-swiftui-layout-safe-areas-stacks-grids-custom-layout.md) | How does SwiftUI propose, choose, and place sizes? | Build the list and adaptive tag layout with the `Layout` protocol. | Fixing every frame to one simulator screenshot. | Add controls, forms, and focus. |
| [ ] | 34 | [Controls, forms, validation, focus, and keyboard behavior](../../src/content/docs/posts/2026-07-19-swiftui-controls-forms-validation-focus-keyboard.md) | How does input stay accessible and synchronized with draft data? | Build a note editor with focused fields, validation, submit actions, and unsaved changes. | Writing directly into the persisted model on every keystroke. | Define ownership with state and bindings. |
| [ ] | 35 | [State, bindings, source of truth, and view identity](../../src/content/docs/posts/2026-07-19-swiftui-state-bindings-source-truth-identity.md) | Where should transient UI facts live, and who is allowed to mutate them? | Own an editor draft with `State` and pass narrow `Binding` values. | Duplicating the same fact in several wrappers. | Share observable models and dependencies. |
| [ ] | 36 | [Observation, environment, and dependency flow](../../src/content/docs/posts/2026-07-19-swiftui-observation-environment-dependency-flow.md) | How do `Observable`, bindable models, environment values, and injected services differ? | Inject a note library and observe only the properties a view reads. | Turning the environment into a global service locator. | Render changing collections efficiently. |
| [ ] | 37 | [Lists, grids, scrolling, search, selection, and refresh](../../src/content/docs/posts/2026-07-19-swiftui-lists-grids-scrolling-search-selection-refresh.md) | How do stable identity and data transforms drive large collections? | Add searchable, filterable notes with selection and pull-to-refresh. | Using array offsets as IDs or filtering expensively inside every row. | Navigate from collection to detail. |
| [ ] | 38 | [Navigation, presentation, alerts, and deep links](../../src/content/docs/posts/2026-07-19-swiftui-navigation-presentation-alerts-deep-links.md) | How does navigation become data that can restore and route external URLs? | Model a `NavigationPath`, sheet item, alert state, and note deep link. | Scattering Boolean presentation flags across child views. | Load remote data without breaking lifecycle. |
| [ ] | 39 | [Async work, loading states, networking, and images](../../src/content/docs/posts/2026-07-19-swiftui-async-loading-networking-images.md) | How do view tasks start, cancel, retry, and expose useful progress? | Load remote weather context with `task`, cancellation, retry, and cached images. | Starting network work in `body` or discarding the previous result during refresh. | Persist the user's durable data. |
| [ ] | 40 | [SwiftData, queries, relationships, migration, and test stores](../../src/content/docs/posts/2026-07-19-swiftui-swiftdata-queries-relationships-migration-test-stores.md) | How does declarative persistence interact with model lifetime and UI queries? | Store notes, tags, and attachments in an in-memory test container and disk container. | Letting persistence models become the only domain model without checking coupling. | Add motion and direct manipulation. |
| [ ] | 41 | [Animation, transitions, gestures, drag and drop, and drawing](../../src/content/docs/posts/2026-07-19-swiftui-animation-transitions-gestures-drag-drop-drawing.md) | How do state changes produce understandable motion and tactile interaction? | Animate favorite state, drag tags, and draw a map annotation badge. | Animating every change or competing gestures without precedence. | Make the app work in more window environments. |
| [ ] | 42 | [Scenes, windows, adaptive navigation, commands, and platform integration](../../src/content/docs/posts/2026-07-19-swiftui-scenes-windows-navigation-commands-platform.md) | How does one SwiftUI app support multiple windows, iPad input, and system commands? | Add a second note window, keyboard commands, and adaptive navigation split view. | Assuming every Apple device is a larger or smaller iPhone. | Verify behavior with previews and tests. |
| [ ] | 43 | [Previews, Swift Testing, UI tests, accessibility, and performance](../../src/content/docs/posts/2026-07-19-swiftui-previews-testing-ui-accessibility-performance.md) | How do fast fixtures, behavior tests, UI tests, and measurement catch different failures? | Preview every content state, unit-test formatting, and UI-test note creation. | Using snapshot or end-to-end tests for every rule. | Assemble the SwiftUI capstone. |
| [ ] | 44 | [SwiftUI Field Notes capstone](../../src/content/docs/posts/2026-07-19-swiftui-field-notes-capstone.md) | Can the reader ship a coherent local-first SwiftUI app from the previous parts? | Complete capture, edit, search, map, attachments, settings, tests, and accessibility audit. | Adding sync and every ecosystem feature before the local product is solid. | Rebuild the same product in UIKit to compare systems. |

### Arc 5: UIKit in depth

| Done | # | Post | Question | Code anchor | Wrong first move | Follow-up path |
| :---: | ---: | --- | --- | --- | --- | --- |
| [ ] | 45 | [UIKit's event-driven mental model and app lifecycle](../../src/content/docs/posts/2026-07-19-uikit-event-driven-mental-model-app-lifecycle.md) | How do the application, scenes, windows, run loop, responders, views, and controllers cooperate? | Launch a scene with a programmatic root view controller and lifecycle logging. | Treating a view controller as the whole app or doing UI work off the main thread. | Construct the view hierarchy. |
| [ ] | 46 | [Views, controls, configuration, target-action, and delegation](../../src/content/docs/posts/2026-07-19-uikit-views-controls-configuration-target-action-delegation.md) | How do UIKit objects receive events and expose reusable behavior? | Build a configured note row and save button with target-action. | Subclassing every standard control or putting domain decisions in action methods. | Make the hierarchy adaptive with constraints. |
| [ ] | 47 | [Auto Layout, stack views, guides, priorities, and debugging](../../src/content/docs/posts/2026-07-19-uikit-auto-layout-stacks-guides-priorities-debugging.md) | How does the constraint solver express relationships rather than coordinates? | Lay out the editor with safe-area guides, anchors, and Dynamic Type. | Pinning fixed coordinates or resolving conflicts by lowering random priorities. | Put view ownership into controllers. |
| [ ] | 48 | [View-controller lifecycle, containment, and composition](../../src/content/docs/posts/2026-07-19-uikit-view-controller-lifecycle-containment-composition.md) | Which responsibilities belong in controller lifecycle methods and child controllers? | Compose list, empty-state, and loading child controllers. | Fetching repeatedly in `viewDidLayoutSubviews` or creating massive controllers. | Navigate among controllers. |
| [ ] | 49 | [Navigation, tabs, split views, and coordinators](../../src/content/docs/posts/2026-07-19-uikit-navigation-tabs-split-views-coordinators.md) | How do container controllers and route intent structure an app? | Build phone navigation and iPad split selection from one route model. | Letting arbitrary controllers push one another by global lookup. | Present focused tasks and system UI. |
| [ ] | 50 | [Sheets, popovers, alerts, activities, and system pickers](../../src/content/docs/posts/2026-07-19-uikit-sheets-popovers-alerts-activities-system-pickers.md) | When should content be pushed, presented, embedded, or delegated to a system controller? | Present the editor, photo picker, share sheet, and adaptive popover. | Reimplementing system pickers or presenting from a controller not in the hierarchy. | Understand the event path beneath controls. |
| [ ] | 51 | [Responder chain, gestures, menus, drag and drop, and input](../../src/content/docs/posts/2026-07-19-uikit-responder-chain-gestures-menus-drag-drop-input.md) | How do touch, pointer, keyboard, menu, and drag events find a handler? | Add swipe actions, context menus, keyboard shortcuts, and tag drag and drop. | Attaching competing recognizers without defining simultaneous behavior. | Build reliable text entry. |
| [ ] | 52 | [Text, forms, keyboards, focus, and validation](../../src/content/docs/posts/2026-07-19-uikit-text-forms-keyboards-focus-validation.md) | How do text fields, text views, formatters, input traits, and keyboard avoidance work together? | Build a reusable form section and draft validator. | Moving the whole root view manually whenever the keyboard appears. | Display large data sets. |
| [ ] | 53 | [Table views, reuse, prefetching, and diffable data](../../src/content/docs/posts/2026-07-19-uikit-table-views-reuse-prefetching-diffable-data.md) | How does UIKit efficiently render changing linear collections? | Apply a diffable snapshot for grouped, searchable notes. | Mutating the backing array and table rows in separate unsynchronized steps. | Move to richer collection layouts. |
| [ ] | 54 | [Collection views, compositional layout, cells, and modern configuration](../../src/content/docs/posts/2026-07-19-uikit-collection-views-compositional-layout-cells-configuration.md) | How does one collection support lists, grids, sections, and adaptive content? | Build a photo and note dashboard with compositional sections. | Subclassing cells only to set labels or calculating every frame by hand. | Add custom visual behavior. |
| [ ] | 55 | [Scrolling, drawing, layers, animation, transitions, and haptics](../../src/content/docs/posts/2026-07-19-uikit-scrolling-drawing-layers-animation-haptics.md) | Which work belongs to UIKit, Core Animation, or custom drawing? | Add an interactive favorite transition and performant attachment strip. | Animating constraint and layer state inconsistently or redrawing the entire screen. | Connect UI to observable and asynchronous data. |
| [ ] | 56 | [Observation, concurrency, networking, and persistence in UIKit](../../src/content/docs/posts/2026-07-19-uikit-observation-concurrency-networking-persistence.md) | How do modern observable models update UIKit without tangled callbacks? | Bind an observable library to a controller and load data with cancellable tasks. | Capturing controllers strongly in long-lived tasks or diffing on the main thread. | Adapt and make the interface accessible. |
| [ ] | 57 | [Traits, appearance, accessibility, localization, and state restoration](../../src/content/docs/posts/2026-07-19-uikit-traits-appearance-accessibility-localization-restoration.md) | How does UIKit respond to environment changes and preserve user context? | Restore the selected note across scenes and audit custom controls with VoiceOver. | Branching on screen width once at launch or treating labels as full accessibility support. | Assemble the UIKit capstone. |
| [ ] | 58 | [UIKit Field Notes capstone](../../src/content/docs/posts/2026-07-19-uikit-field-notes-capstone.md) | Can the reader produce feature parity while respecting UIKit's strengths? | Complete list, detail, editor, media, map, restoration, tests, and accessibility. | Translating SwiftUI types line by line instead of translating product behavior. | Compare and extract the architecture shared by both apps. |

### Arc 6: iOS app architecture and design

| Done | # | Post | Question | Code anchor | Wrong first move | Follow-up path |
| :---: | ---: | --- | --- | --- | --- | --- |
| [ ] | 59 | [Architecture starts with pressure](../../src/content/docs/posts/2026-07-19-ios-architecture-starts-with-pressure.md) | Which change, test, team, lifetime, or integration pressure justifies a boundary? | Score Field Notes features by volatility, criticality, and external dependencies. | Picking a fashionable acronym before identifying the problem. | Examine the architecture already built into UIKit. |
| [ ] | 60 | [MVC and controller boundaries](../../src/content/docs/posts/2026-07-19-ios-mvc-controller-boundaries.md) | What did Cocoa MVC intend, and why do controllers become massive? | Move formatting and validation out of a view controller without inventing a new layer. | Renaming a massive controller as a view model. | Separate presentation state when it earns a home. |
| [ ] | 61 | [MVVM and presentation models](../../src/content/docs/posts/2026-07-19-ios-mvvm-presentation-models.md) | When does a view model clarify derived state, commands, and test seams? | Implement one framework-neutral editor presentation model for both UIs. | Giving every view a view model or importing UI types into it. | Model complex interaction as explicit state transitions. |
| [ ] | 62 | [Unidirectional data flow, reducers, and state machines](../../src/content/docs/posts/2026-07-19-ios-unidirectional-data-flow-reducers-state-machines.md) | Which features benefit from one state, named events, and controlled effects? | Model sync and editing with a reducer and exhaustively tested transitions. | Putting the entire app into one global state object. | Protect business meaning in a domain model. |
| [ ] | 63 | [Domain models, value objects, invariants, and use cases](../../src/content/docs/posts/2026-07-19-ios-domain-models-value-objects-invariants-use-cases.md) | What behavior remains true regardless of screen, database, or API? | Create `CreateNote`, `EditNote`, and validated coordinate and tag values. | Building an anemic domain that only mirrors JSON or database rows. | Supply external collaborators explicitly. |
| [ ] | 64 | [Dependency injection and the composition root](../../src/content/docs/posts/2026-07-19-ios-dependency-injection-composition-root.md) | How are clocks, IDs, stores, APIs, and analytics selected without globals? | Wire live and test dependencies once at app startup. | Hiding dependencies in singletons or a mutable service locator. | Separate navigation mechanics from feature decisions. |
| [ ] | 65 | [Coordinators, routers, deep links, and restoration](../../src/content/docs/posts/2026-07-19-ios-coordinators-routers-deep-links-restoration.md) | Who translates route intent into SwiftUI and UIKit navigation? | Parse one deep link into a route and drive both UI adapters. | Letting the domain import navigation frameworks. | Isolate persistence and network technologies. |
| [ ] | 66 | [Repositories, gateways, clients, and ports and adapters](../../src/content/docs/posts/2026-07-19-ios-repositories-gateways-clients-ports-adapters.md) | When does an outbound port improve substitution, tests, or clarity? | Define a purpose-named `NoteLibrary` port with SwiftData and in-memory adapters. | Creating a protocol for every concrete type or naming ports after vendors. | Establish module and dependency boundaries. |
| [ ] | 67 | [Modularization with Swift Package Manager](../../src/content/docs/posts/2026-07-19-ios-modularization-swift-package-manager.md) | Where should features, shared models, design systems, and integrations live? | Extract domain, application, and selected adapters into packages with inward dependencies. | Creating dozens of tiny modules before build time or ownership demands them. | Design the data path across those modules. |
| [ ] | 68 | [Data architecture, source of truth, caching, offline sync, and conflict](../../src/content/docs/posts/2026-07-19-ios-data-architecture-source-truth-cache-offline-sync-conflict.md) | Who owns durable truth when device and server can both change? | Implement an outbox, sync cursor, idempotent operation, and visible conflict policy. | Calling the network the source of truth while hiding offline edits. | Make concurrency rules part of the architecture. |
| [ ] | 69 | [Concurrency architecture, isolation, cancellation, and lifecycle](../../src/content/docs/posts/2026-07-19-ios-concurrency-architecture-isolation-cancellation-lifecycle.md) | Which actor owns mutable state, and how does work end when a scene or request ends? | Draw and enforce an isolation map for UI, sync, storage, and decoding. | Treating actors as queues or spawning detached tasks to avoid warnings. | Test boundaries and evolve them safely. |
| [ ] | 70 | [Architecture tests, refactoring seams, decisions, and tradeoffs](../../src/content/docs/posts/2026-07-19-ios-architecture-tests-refactoring-decisions-tradeoffs.md) | How does an architecture prove its value and change without a rewrite? | Add domain tests, use-case tests with fakes, adapter contracts, and an architecture decision record. | Measuring architecture by folder symmetry or mocking every type. | Harden the complete app for production. |

### Arc 7: Testing as a development discipline

| Done | # | Post | Question | Code anchor | Wrong first move | Follow-up path |
| :---: | ---: | --- | --- | --- | --- | --- |
| [ ] | 71 | [Testing strategy, seams, and confidence](../../src/content/docs/posts/2026-07-19-ios-testing-strategy-seams-confidence.md) | Which risks deserve unit, integration, UI, contract, performance, manual, simulator, or device evidence? | Create a risk-based Field Notes test matrix and place each rule at the lowest useful distance. | Treating the testing pyramid as a quota or chasing coverage percentage. | Learn Swift Testing's native model. |
| [ ] | 72 | [Swift Testing fundamentals and parameterized tests](../../src/content/docs/posts/2026-07-19-swift-testing-fundamentals-parameterized-tests.md) | How do suites, traits, expectations, confirmations, tags, and arguments express Swift behavior? | Parameterize tag validation and async sync-policy tests with `Testing`. | Porting XCTest class ceremony line for line or hiding several behaviors in one test. | Keep XCTest where Apple tooling still requires it. |
| [ ] | 73 | [XCTest, XCUITest, test plans, and framework coexistence](../../src/content/docs/posts/2026-07-19-ios-xctest-xcuitest-test-plans-coexistence.md) | Which jobs still belong to XCTest and XCUITest, and how do both frameworks share a project? | Build a test plan plus one launch, navigation, and screenshot-producing UI journey. | Rewriting useful XCTest suites only to standardize syntax. | Remove time, randomness, and scheduling from flaky tests. |
| [ ] | 74 | [Deterministic dependencies and concurrency tests](../../src/content/docs/posts/2026-07-19-ios-deterministic-dependencies-concurrency-tests.md) | How do clocks, UUIDs, randomness, actors, cancellation, and async sequences become controllable? | Test timeout, cancellation, actor isolation, and event order with injected dependencies. | Sleeping in tests or assuming task scheduling order. | Test both UI frameworks by observable behavior. |
| [ ] | 75 | [SwiftUI, UIKit, navigation, accessibility, and UI behavior tests](../../src/content/docs/posts/2026-07-19-ios-swiftui-uikit-navigation-accessibility-ui-tests.md) | Which interface facts belong in unit tests, previews, accessibility audits, snapshots, or XCUITest? | Run the same create-note acceptance scenario against SwiftUI and UIKit adapters. | Asserting private view hierarchy details or using snapshots as the only accessibility evidence. | Exercise storage and network boundaries. |
| [ ] | 76 | [Persistence, migration, networking, and contract tests](../../src/content/docs/posts/2026-07-19-ios-persistence-migration-network-contract-tests.md) | How do in-memory stores, temporary files, URL stubs, local mocks, schema fixtures, and adapter contracts expose boundary failures? | Test a SwiftData and Core Data migration, corrupt file recovery, retry policy, and DTO contract. | Depending on production cloud services or testing only a fresh schema. | Measure constraints that functional tests miss. |
| [ ] | 77 | [Performance, memory, energy, launch, and device matrices](../../src/content/docs/posts/2026-07-19-ios-performance-memory-energy-launch-device-matrices.md) | How do XCTest metrics, Instruments, signposts, leak checks, and physical devices produce useful budgets? | Set launch, scroll, memory, and sync budgets and record simulator and device evidence separately. | Turning one simulator run into a universal performance claim. | Make the suite reliable in automation. |
| [ ] | 78 | [CI, flake control, test data, release qualification, and evidence](../../src/content/docs/posts/2026-07-19-ios-ci-flake-control-test-data-release-evidence.md) | How are deterministic fixtures, retries, quarantine, OS matrices, artifacts, and release gates governed? | Build a CI test plan that publishes results, screenshots, crash logs, and performance baselines. | Blindly rerunning failures until green or letting fixtures violate domain contracts. | Apply the testing system to production engineering. |

### Arc 8: Production engineering and shipping

| Done | # | Post | Question | Code anchor | Wrong first move | Follow-up path |
| :---: | ---: | --- | --- | --- | --- | --- |
| [ ] | 79 | [Networking, authentication, real-time events, and resilience](../../src/content/docs/posts/2026-07-19-ios-networking-authentication-realtime-resilience.md) | How do requests, decoding, pagination, credentials, retries, timeouts, and sockets fit together? | Build a typed URLSession client with token refresh and bounded retry. | Retrying every error, logging secrets, or tying API DTOs to views. | Decide what belongs on disk and under protection. |
| [ ] | 80 | Persistence, Core Data, files, caches, migrations, and secure storage | Which data belongs in SwiftData, Core Data, files, cache, preferences, or Keychain? | Store credentials in Keychain and migrate versioned SwiftData and Core Data schemas. | Putting secrets in preferences or treating cache eviction as data loss. | Audit privacy and attack surfaces. |
| [ ] | 81 | Security, privacy, permissions, and platform policy | How do sandboxing, entitlements, transport security, privacy manifests, consent, and minimization shape design? | Build a just-in-time location permission flow with a no-permission path. | Asking for every permission at launch or claiming security through hidden UI. | Continue useful work outside the foreground. |
| [ ] | 82 | Background work, notifications, deep links, and app extensions | What can run when the app is suspended, and how does the system re-enter it? | Schedule bounded refresh, route a notification, and share content through an extension. | Expecting arbitrary background execution or duplicating route logic per entry point. | Observe production behavior without leaking user data. |
| [ ] | 83 | Logging, analytics, crashes, privacy, and feature flags | Which events help diagnose and improve the product without becoming surveillance or hidden control flow? | Define typed analytics, redacted logs, crash-symbol handling, and a kill switch. | Logging payloads and secrets or scattering string event names through views. | Tune measured production constraints. |
| [ ] | 84 | Instruments, responsiveness, energy, launch, and networking | How do measurements identify hangs, leaks, overdraw, slow launch, and battery cost? | Use the budgets from post 77 to fix one measured scrolling and allocation regression. | Optimizing from intuition or accepting simulator-only performance evidence. | Make builds reproducible and distributable. |
| [ ] | 85 | Build settings, signing, entitlements, CI, dependencies, and release configuration | How does one codebase produce safe development, staging, and production artifacts? | Define configurations, secret injection boundaries, an archive, and a CI release lane. | Committing secrets or using compile flags as a substitute for runtime design. | Put the release in front of beta users and review. |
| [ ] | 86 | TestFlight, App Store review, launch, observability, and evolution | What evidence and operations turn an archive into a maintained product? | Prepare metadata, privacy answers, review notes, phased release, crash symbols, and rollback plan. | Treating approval as the finish line or shipping without support and telemetry decisions. | Choose ecosystem capabilities and study complete products. |

## Apple ecosystem and capability atlas, posts 87-110

These posts branch from the core path. Each one begins with a capability decision: what user problem justifies the framework, which devices support it, what permissions or entitlements it needs, what its simulator limits are, and where its adapter belongs.

| Done | # | Post | Question | Code anchor | Wrong first move | Follow-up path |
| :---: | ---: | --- | --- | --- | --- | --- |
| [ ] | 87 | One product across Apple platforms | What belongs in shared Swift packages, shared SwiftUI, and platform-specific adapters? | Define a platform capability matrix and shared dependency graph. | Forcing identical screens and navigation onto every device. | Adapt the core product to iPad. |
| [ ] | 88 | iPadOS, multitasking, pointer, keyboard, Pencil, and documents | How does an iPad app become desktop-class rather than stretched? | Add multiwindow editing, commands, drag and drop, and Pencil annotation. | Using idiom checks to serve a large phone layout. | Carry shared code into a Mac app. |
| [ ] | 89 | macOS with SwiftUI | Which scenes, commands, menus, windows, settings, tables, and documents make a real Mac app? | Build document windows, menu commands, preferences, and toolbar customization. | Porting touch-first navigation and hiding all commands inside the window. | Use AppKit when SwiftUI is not the right adapter. |
| [ ] | 90 | AppKit, Mac Catalyst, and framework choice | When should a product use native AppKit, Catalyst, SwiftUI, or a mixture? | Wrap an AppKit text view and compare a Catalyst target. | Choosing only by promised code reuse. | Design for the smallest glanceable screen. |
| [ ] | 91 | watchOS app structure and Watch connectivity | What work belongs on the watch, phone, complication, and shared core? | Build a glanceable note capture app with phone synchronization. | Treating the watch as a remote iPhone screen. | Add health, workout, and complication behavior. |
| [ ] | 92 | Workouts, complications, Smart Stack, and watch constraints | How do sessions, timelines, background delivery, battery, and wrist interaction shape design? | Start a workout session and publish a timeline entry. | Polling continuously or requiring long-form input on the wrist. | Move from glanceable interaction to ten-foot interaction. |
| [ ] | 93 | tvOS focus, remote input, shelves, and navigation | How does focus replace direct touch and alter layout and state? | Build a focusable catalog with predictable restoration. | Porting an iPhone tab bar or relying on hover-like ornament alone. | Add professional media playback. |
| [ ] | 94 | AVKit, AVFoundation, playback, streaming, and media sessions | How do playback state, remote commands, interruptions, subtitles, and picture in picture fit together? | Build a player with resumable position and system transport controls. | Writing a custom player before system playback proves insufficient. | Enter spatial interfaces and immersion. |
| [ ] | 95 | visionOS windows, volumes, ornaments, and spatial input | Which content belongs in a window, volume, or immersive space? | Place a shared Field Notes model into a visionOS window and bounded volume. | Filling the user's space or transplanting a flat phone screen. | Render and interact with spatial content. |
| [ ] | 96 | RealityKit, ARKit, immersive spaces, comfort, and assets | How do entities, components, systems, tracking, gestures, and comfort rules form a spatial app? | Anchor an annotated model and manipulate it with indirect input. | Assuming tracking is perfect or moving the user without comfort controls. | Surface small pieces of app state throughout the system. |
| [ ] | 97 | WidgetKit and Live Activities | Which state deserves a timeline, glance, or live lock-screen surface? | Build a recent-note widget and bounded live capture activity. | Treating an extension like an always-running mini app. | Make app actions available to the system. |
| [ ] | 98 | App Intents, Shortcuts, Spotlight, and system actions | How does a capability become discoverable outside the app? | Expose create-note and search-note intents with entities and parameters. | Putting UI-only logic inside an intent or returning ambiguous entities. | Synchronize user data through Apple cloud services. |
| [ ] | 99 | CloudKit, iCloud containers, sharing, and sync | When does Apple's cloud stack fit, and how are accounts, zones, conflicts, and sharing modeled? | Store and share a note record with deterministic conflict handling. | Assuming iCloud availability or silent last-write-wins behavior. | Add location-aware experiences. |
| [ ] | 100 | MapKit, Core Location, geocoding, and WeatherKit | How do maps, accuracy, background location, routes, and weather respect context and privacy? | Add a permission-aware observation map and weather snapshot. | Requesting precise always-on location for a convenience feature. | Capture images and interpret them. |
| [ ] | 101 | Camera, PhotoKit, image pipelines, and Vision | How do capture, limited-library access, metadata, editing, and analysis fit together? | Capture or select a photo, preserve orientation, and recognize text locally. | Loading full-resolution assets into every thumbnail or bypassing system pickers. | Build audio and speech experiences. |
| [ ] | 102 | Audio, speech, recording, and interruptions | How do audio sessions, routes, permissions, transcription, and background modes interact? | Record a voice note, handle interruption, and transcribe with visible consent. | Assuming one audio-session category works for every route. | Build richer video experiences. |
| [ ] | 103 | Video capture, editing, playback, and streaming architecture | Which pipeline owns capture, encoding, assets, playback, and network adaptation? | Capture a short clip, export it, and display progress and cancellation. | Blocking UI during export or storing unbounded original media. | Communicate with nearby hardware. |
| [ ] | 104 | Core Bluetooth, nearby interaction, accessories, and connectivity | How do discovery, connection state, permissions, protocol design, and recovery work? | Model a Bluetooth sensor connection as an explicit state machine. | Scanning forever or treating packet boundaries as message boundaries. | Handle sensitive health and fitness data. |
| [ ] | 105 | HealthKit, WorkoutKit, and health-data design | How do authorization, provenance, units, queries, workouts, and privacy change the domain model? | Read an authorized metric and record a workout sample with source metadata. | Treating permission denial as an error or exporting health data casually. | Add on-device intelligence. |
| [ ] | 106 | Core ML, Vision, Natural Language, and on-device intelligence | When does on-device inference improve privacy, latency, and offline behavior? | Run a versioned model behind a protocol and expose confidence and fallback. | Shipping a model without measuring accuracy, size, energy, or failure bias. | Monetize without corrupting the product model. |
| [ ] | 107 | StoreKit, subscriptions, offers, and entitlement state | How do products, transactions, restoration, server validation, and grace periods become durable access rules? | Build a StoreKit test configuration and an entitlement actor. | Unlocking from a button callback or trusting a cached Boolean forever. | Add payments for physical goods where appropriate. |
| [ ] | 108 | Apple Pay, passes, Wallet, and transaction UX | When do Apple Pay, passes, and Wallet belong in an app? | Build a payment request with validated merchant and shipping state. | Using in-app purchase for physical goods or storing payment credentials. | Explore graphics-heavy and game experiences. |
| [ ] | 109 | Games, GameKit, SpriteKit, SceneKit, and Metal choices | Which rendering and game-service stack matches 2D, 3D, multiplayer, and custom GPU work? | Build a small SpriteKit interaction with Game Center score submission. | Starting with Metal for a product that needs a scene framework. | Connect apps to the home, car, and external world. |
| [ ] | 110 | Home, Matter, CarPlay, files, collaboration, and specialized extensions | How does a team evaluate specialized entitlements and platform programs without polluting the core? | Add one capability adapter and a document-based sharing flow behind feature availability. | Assuming every entitlement is self-service or every integration belongs in one target. | Apply the atlas in five complete case studies. |

## Case-study series, posts 111-140

Each case study starts from a blank product brief. It records architecture decisions, builds a vertical slice before breadth, tests failure states, measures one production constraint, and finishes with a release review. The five apps use different primary UI and platform strategies so the conclusions are earned rather than repeated.

### Case study 1: Atlas Desk, local-first productivity across iPhone, iPad, and Mac

| Done | # | Post | Question | Code anchor | Wrong first move | Follow-up path |
| :---: | ---: | --- | --- | --- | --- | --- |
| [ ] | 111 | Atlas Desk discovery and release boundary | How should a research organizer serve quick capture, deep editing, and retrieval? | Define jobs, journeys, document model, and version-one success signal. | Copying a desktop knowledge tool's entire feature set. | Choose domain and platform boundaries. |
| [ ] | 112 | Atlas Desk domain and architecture | How do documents, backlinks, tags, attachments, and search remain framework-neutral? | Build value types, use cases, and a local repository contract. | Making SwiftData relationships the product specification. | Implement the first vertical slice. |
| [ ] | 113 | Atlas Desk SwiftUI phone and tablet app | How does capture become split-view research work on iPad? | Build capture, editor, search, selection, keyboard commands, and drag and drop. | Designing separate unrelated phone and tablet apps. | Persist, index, and synchronize. |
| [ ] | 114 | Atlas Desk storage, search, files, and sync | How do local truth, full-text indexing, attachments, migrations, and CloudKit sharing coexist? | Implement an outbox, attachment store, index adapter, and conflict copy. | Syncing view state or uploading files before durable local writes. | Make the Mac version feel native. |
| [ ] | 115 | Atlas Desk macOS product design | Which windows, menus, commands, inspectors, and document behaviors belong on Mac? | Add multiple windows, menu commands, toolbar, settings, and file import. | Shipping the iPad layout inside a Mac window. | Prove and release the system. |
| [ ] | 116 | Atlas Desk quality and release review | Does the app survive migration, conflicts, large libraries, accessibility, and interrupted sync? | Run migration, performance, UI, and sync-contract test suites. | Testing only a fresh empty account. | Move to a sensor and Watch-centered product. |

### Case study 2: PulseTrail, outdoor fitness on iPhone and Apple Watch

| Done | # | Post | Question | Code anchor | Wrong first move | Follow-up path |
| :---: | ---: | --- | --- | --- | --- | --- |
| [ ] | 117 | PulseTrail product, safety, and privacy | What does a hiker need before, during, and after an activity with weak connectivity? | Define offline route, workout, emergency, and privacy requirements. | Treating live connectivity or perfect GPS as a safety guarantee. | Split responsibility between phone and watch. |
| [ ] | 118 | PulseTrail cross-device architecture | Which device owns workout state, routes, samples, and synchronization? | Define workout and route ports plus a watch-phone message protocol. | Making both devices writable authorities for every field. | Implement workout and location capture. |
| [ ] | 119 | PulseTrail HealthKit, WorkoutKit, maps, and location | How are authorization, units, routes, background sessions, and provenance modeled? | Record a workout and route with explicit authorization and recovery states. | Hiding denied access or converting units without metadata. | Design glanceable live interaction. |
| [ ] | 120 | PulseTrail watch UI, complications, widgets, and Live Activities | Which facts deserve wrist, lock-screen, and phone surfaces? | Build live metrics, pause and resume, a complication, and phone activity. | Showing dense charts during motion or requiring precise taps. | Make the app reliable under field constraints. |
| [ ] | 121 | PulseTrail offline, battery, sync, and failure recovery | How does the app preserve data through disconnection, process loss, and low power? | Add checkpointed sessions, batched transfer, and a merge policy. | Sampling and transmitting at maximum frequency by default. | Validate safety and distribution. |
| [ ] | 122 | PulseTrail testing and release review | How are routes, sensor gaps, permission changes, energy, and health privacy tested? | Replay recorded sample fixtures and profile an outdoor session. | Depending only on simulator locations and happy-path workouts. | Move to a ten-foot media experience. |

### Case study 3: ScreenRoom, streaming media on Apple TV and iPhone

| Done | # | Post | Question | Code anchor | Wrong first move | Follow-up path |
| :---: | ---: | --- | --- | --- | --- | --- |
| [ ] | 123 | ScreenRoom product and content model | How do browsing, search, profiles, playback, and continue-watching fit a television context? | Define catalog, entitlement, playback, and progress models. | Starting with a custom player skin before content navigation works. | Design focus and media architecture. |
| [ ] | 124 | ScreenRoom tvOS architecture and focus | How do route state, focus restoration, shelves, remote input, and profiles cooperate? | Build a focusable catalog and deterministic selection restoration. | Treating focus as a visual hover effect. | Integrate the playback system. |
| [ ] | 125 | ScreenRoom playback and media lifecycle | How do AVPlayer, remote commands, subtitles, interruptions, and progress persistence fit together? | Create a playback coordinator with resumable position and event logging. | Placing player ownership in a disposable cell or view. | Connect accounts, catalog, and purchases. |
| [ ] | 126 | ScreenRoom backend, auth, subscriptions, and downloads | How do device sign-in, paginated catalog, StoreKit entitlements, and offline media interact? | Implement device authorization, entitlement refresh, and download state. | Equating successful purchase UI with permanent entitlement. | Measure television-specific quality. |
| [ ] | 127 | ScreenRoom performance, accessibility, and resilience | Can the app scroll, focus, stream, subtitle, and recover under poor network conditions? | Profile image shelves and simulate bitrate and network failures. | Loading poster originals or hiding buffering without explanation. | Prepare a multi-platform release. |
| [ ] | 128 | ScreenRoom testing and release review | Which contracts and devices prove playback, purchases, focus, and account behavior? | Test playback state, StoreKit configuration, UI focus paths, and analytics schema. | Using one end-to-end stream as the whole test strategy. | Move to a UIKit-heavy collaborative marketplace. |

### Case study 4: NeighborLink, community marketplace and collaboration

| Done | # | Post | Question | Code anchor | Wrong first move | Follow-up path |
| :---: | ---: | --- | --- | --- | --- | --- |
| [ ] | 129 | NeighborLink product, trust, and moderation | How do listings, chat, identity, location, reporting, and trust affect one another? | Define role, listing, conversation, report, and moderation state machines. | Treating abuse and support as post-launch concerns. | Design backend and client boundaries. |
| [ ] | 130 | NeighborLink architecture, identity, and API contracts | How do auth, authorization, pagination, uploads, and real-time events stay testable? | Build typed clients, token refresh, DTO mapping, and a message stream port. | Letting screens call endpoints directly or trusting client-side roles. | Build the primary UIKit experience. |
| [ ] | 131 | NeighborLink UIKit feed, search, forms, camera, and maps | How does an imperative UI handle a media-rich, rapidly changing product? | Build compositional feed sections, listing draft, photo flow, and map results. | Mutating collection views and models independently. | Make collaboration work offline and in real time. |
| [ ] | 132 | NeighborLink chat, offline writes, push, and deep links | How do ordered messages, retries, deduplication, notifications, and routes cooperate? | Implement client IDs, an outbox, socket reconnect, and notification routing. | Assuming network arrival order or sending duplicate writes after timeout. | Add commerce and safety controls. |
| [ ] | 133 | NeighborLink payments, privacy, security, and moderation operations | Which commerce flow applies, and how are reports, blocks, retention, and audit events handled? | Add Apple Pay for physical goods and a moderator action log. | Using StoreKit for person-to-person goods or exposing private location unnecessarily. | Attack and release-test the product. |
| [ ] | 134 | NeighborLink quality and release review | Does the app withstand hostile inputs, account transitions, media load, and degraded services? | Run authorization, moderation, API-contract, load, accessibility, and UI tests. | Testing with trusted users and a perfect backend only. | Move from flat screens to spatial computing. |

### Case study 5: SpacePlanner, collaborative spatial design on Apple Vision Pro

| Done | # | Post | Question | Code anchor | Wrong first move | Follow-up path |
| :---: | ---: | --- | --- | --- | --- | --- |
| [ ] | 135 | SpacePlanner product, comfort, and spatial design | Which planning tasks benefit from windows, volumes, or immersion? | Storyboard placement, inspection, collaboration, exit, and recovery flows. | Making an immersive mode because the platform supports one. | Define spatial domain and asset boundaries. |
| [ ] | 136 | SpacePlanner architecture and asset pipeline | How do projects, scenes, assets, anchors, transforms, and collaboration remain testable? | Define spatial value types, asset loading, and persistence ports. | Passing RealityKit entities throughout domain and sync code. | Build the spatial interface. |
| [ ] | 137 | SpacePlanner windows, volumes, immersion, and input | How do ornaments, gaze, pinch, direct manipulation, and transitions cooperate? | Build a project window, model volume, and user-controlled immersive space. | Moving content unexpectedly or requiring unsupported precision. | Add realistic spatial behavior. |
| [ ] | 138 | SpacePlanner RealityKit, ARKit, interaction, and rendering | How do components, systems, tracking, collisions, lighting, and custom gestures scale? | Create selectable furniture entities with snapping and undo. | Performing heavy asset or physics work on the UI path. | Persist and collaborate without losing spatial intent. |
| [ ] | 139 | SpacePlanner persistence, collaboration, performance, and accessibility | How do transform conflicts, large assets, shared sessions, captions, and alternatives work? | Merge intent-level edits and load level-of-detail assets progressively. | Applying last-write-wins to entire scenes or requiring spatial input only. | Validate comfort and distribute the product. |
| [ ] | 140 | SpacePlanner testing and release review | How are spatial interactions, tracking loss, performance, comfort, and accessibility verified? | Add domain tests, device interaction checks, frame profiling, and a comfort review. | Treating simulator success as device evidence. | Close the program with a reusable app-launch playbook. |

## Adversarial curriculum review

The initial review challenged the plan as if implementation time, platform restrictions, and misleading validation claims were trying to break it.

| Finding | Risk | Change made | Remaining control |
| --- | --- | --- | --- |
| Testing appeared late and fit into one overloaded post. | Readers could build untestable code for months before learning useful seams. | Added posts 71-78 as a dedicated testing arc and made tests part of every post's definition of done. | The validation matrix in F3.3 maps evidence before drafting begins. |
| The plan had no durable status mechanism. | “In progress” could mean drafted prose, compiling code, or a published and verified post. | Added gate checklists, batch gates, and one checkbox per post. | A checkbox changes only when all definition-of-done evidence exists. |
| Apple APIs and design guidance change each year. | Examples could be current when planned and stale when published. | Made stable versions, availability, deployment targets, and primary-source dates explicit. | The iOS and Swift skill owns the supported matrix and source-refresh workflow. |
| Some capabilities require hardware, accounts, agreements, or restricted entitlements. | Simulator success could be presented as proof that a production integration works. | Added simulator, device, entitlement, and account labels to completion criteria. | Ecosystem posts cannot close without capability-specific evidence or a stated validation limit. |
| Rebuilding Field Notes in both UI frameworks could become repetitive. | The UIKit arc could read like a syntax translation of SwiftUI. | Added one shared product acceptance specification and framework-specific mental models. | Both adapters pass common behavior tests while retaining framework-specific tests. |
| Architecture arrived after two full UIs. | Readers could confuse delayed formalization with architecture not mattering until later. | Seeded source-of-truth, dependency, domain, and testing decisions throughout earlier arcs. | Posts 59-70 explain when to retain, extract, or reject each boundary. |
| The program is large enough to stall. | A 140-post promise could become a catalog of half-finished drafts. | Added publishable batch gates and prohibited empty post stubs. | Finish and validate one batch before opening the next broad batch. |
| A new authoring skill could become an Apple encyclopedia. | Loading it would consume context and still become stale. | Planned a concise procedural skill with focused references and current-source checks. | Keep `SKILL.md` under 500 lines and move framework detail into shallow references. |
| “Any dreamed-of app” can become an impossible completeness claim. | Specialized vendor, backend, regulatory, and entitlement requirements vary without limit. | Kept a clear scope promise, capability atlas, and five distinct product proofs. | Each post names its boundary and links to the next primary source or specialist domain. |
| Migrating all 189 problems before post 1 would create a long critical path. | The series could stall behind catalog work even after the runner and teaching pattern were proven. | Split the catalog into a pilot gate and 18 category batches that can advance alongside curriculum authoring. | S2.1-S2.3 and one category prove the pipeline. The full catalog remains tracked to completion. |
| Test fixtures can violate production contracts. | Passing tests could depend on impossible dates, IDs, enum cases, auth states, or health values. | Added fixture-contract rules and deliberate invalid-fixture paths. | Valid fixture generators get their own boundary tests and fixed seeds. |
| SwiftData-only teaching would not prepare readers for established apps. | Readers could not reason about Core Data stores, migrations, or legacy UIKit systems. | Added Core Data coexistence and migration coverage in posts 76 and 80. | The skill requires legacy-context notes when a modern API does not replace installed code. |
| Client architecture can ignore backend constraints. | Auth, authorization, idempotency, pagination, sync, and real-time behavior could be reduced to UI examples. | Strengthened posts 68, 76, and 79 plus the NeighborLink case study. | Local mocks and contracts remain runnable without turning this into a backend implementation series. |
| A static GitHub Pages site cannot assume it can compile arbitrary edited Swift. | A precompiled WebAssembly demo could be mislabeled as a REPL, or a remote compiler could introduce abuse and privacy risk. | Added an ADR, proof-of-concept gate, sandbox requirements, local execution path, honest unavailable state, and a separate live deployment gate. | R1 proves the local contract and executor. R2 requires public-service hardening, deployment, operations, and published-origin evidence before live execution is claimed. |
| Adding Swift once per problem would leave the teaching catalog incomplete. | Approach sections and runnable exercises could disagree across languages. | Set the target at all 189 starters plus every documented approach, using shared test vectors and a coverage manifest. | The catalog validator fails on missing Swift parity. |

Run this review again after the skill is forward-tested, after each batch, and whenever a stable Xcode release changes the supported matrix.

## Testing coverage and evidence model

Testing begins with the first Swift function. The dedicated testing arc organizes the tools and tradeoffs after readers have real SwiftUI, UIKit, persistence, concurrency, and architecture code to test.

The [Zero to iOS Hero validation matrix](../zero-to-ios-hero-validation-matrix.md) assigns this evidence to every planned post and adds capability-specific requirements.

| Surface | Primary evidence | Required failure coverage |
| --- | --- | --- |
| Swift values and algorithms | Swift Testing unit and parameterized tests | Boundaries, Unicode, optionals, invalid input, error mapping, and overflow where relevant. |
| Domain rules and use cases | Pure tests with no UI, database, network, clock, or random dependency | Invalid state transitions, authorization decisions, idempotency, and cancellation. |
| Concurrency | Controlled clocks, injected dependencies, confirmations, actor-isolation checks, and cancellation tests | Timeout, cancellation, out-of-order completion, duplicate events, and task lifetime. |
| SwiftUI | Preview fixtures, presentation-model tests, accessibility inspection, and focused XCUITest journeys | Empty, loading, failure, large text, restoration, deep links, and interrupted tasks. |
| UIKit | Controller and presentation-model tests, layout and trait checks, restoration tests, and XCUITest journeys | Lifecycle repetition, reuse, trait changes, keyboard, focus, restoration, and deallocation. |
| Persistence | In-memory stores, temporary files, production-shaped schemas, and migration fixtures | Corruption, uniqueness, relationship rules, deletion, rollback, and old-store migration. |
| Networking and real-time data | Typed stubs, `URLProtocol`, local mock servers, adapter contracts, and recorded protocol fixtures | Timeouts, retries, token expiry, pagination boundaries, malformed payloads, disconnects, and duplicates. |
| Authentication and privacy | State-machine tests, authorization contract tests, and redaction assertions | Signed-out transitions, revoked access, role changes, denied permissions, and secret leakage. |
| Accessibility and localization | Automated assertions plus VoiceOver, Dynamic Type, contrast, motion, keyboard, and right-to-left manual passes | Missing names, broken order, clipped text, color-only meaning, focus traps, and untranslated composition. |
| Performance and resources | XCTest metrics, signposts, Instruments, baselines, and physical-device runs | Launch, hangs, leaks, scrolling, memory pressure, network volume, thermal state, and energy. |
| Platform capabilities | Simulator tests where faithful, deterministic adapters elsewhere, and named device checks | Permission changes, unavailable hardware, background interruption, entitlement failure, and account state. |
| Purchases and cloud services | StoreKit configurations, sandbox accounts, local adapters, CloudKit development environments, and contract tests | Pending, revoked, restored, offline, conflict, quota, and unavailable-account states. |
| Release wiring | Xcode test plans, CI matrices, archive validation, TestFlight smoke tests, and evidence artifacts | Configuration drift, missing entitlements, migration from the prior release, and rollback readiness. |

Test data follows the production contract:

- Valid factories produce only valid values and have boundary tests of their own.
- Invalid dates, identifiers, enum cases, files, auth states, permissions, and API payloads use named negative fixtures.
- Randomized fixtures use fixed seeds and explicit range assertions.
- Helpers do not clamp, wrap, normalize, or repair invalid data unless production code owns that repair.
- Health, commerce, location, tenant, and privacy fixtures preserve provenance and authorization state.
- Larger fixture counts are tested so a generator cannot cross a boundary only after the first few rows.

## Coverage map

| Dream-app pressure | Primary coverage | Proof case study |
| --- | --- | --- |
| Rich language and business rules | Posts 4-23 and 59-70 | All five |
| SwiftUI product | Posts 31-44 | Atlas Desk, PulseTrail, SpacePlanner |
| UIKit product or existing codebase | Posts 45-58 | NeighborLink |
| Offline and synchronized data | Posts 68, 76, 79-80, and 99 | Atlas Desk, PulseTrail, NeighborLink |
| Authentication and collaboration | Posts 64-69 and 79 | ScreenRoom, NeighborLink, SpacePlanner |
| Testing and release confidence | Posts 71-78 and every case-study release review | All five |
| Accessibility and localization | Posts 30, 43, 57, 75, 77, and 81 | Every release review |
| Performance, energy, and memory | Posts 69, 77, and 84 | PulseTrail, ScreenRoom, SpacePlanner |
| Apple device capabilities | Posts 87-110 | PulseTrail, ScreenRoom, SpacePlanner |
| Commerce and subscriptions | Posts 107-108 | ScreenRoom, NeighborLink |
| App Store delivery and operation | Posts 81-86 | Every release review |
| Browser Swift practice | Gates R1.1-R1.8, R2.1-R2.10, and posts 4-23 | Field Notes core and all coding problems |
| Swift algorithm practice | Gates S2.1-S2.9 and category tasks S2.C01-S2.C18 | All 189 coding-problem pages |

## Exercises and assessment

Every arc ends with three levels of work:

- **Reproduce**: Build the demonstrated feature and make the tests pass.
- **Change**: Add a requirement that invalidates one assumption in the example.
- **Transfer**: Apply the pattern to the reader's own app idea and explain the architecture choice.

The program has seven portfolio checkpoints:

1. A tested Swift package containing the Field Notes core.
2. A product brief, flow map, state inventory, and adaptive wireframes.
3. A complete SwiftUI implementation.
4. A feature-equivalent UIKit implementation.
5. A hybrid app with tested inward dependency direction.
6. A TestFlight-ready production build.
7. One original Apple-platform app proposal reviewed against the five case studies.

## Companion code strategy

- Keep the Field Notes core path in `companion/field-notes/`. The Swift package is the shared source boundary, and `project.yml` declares disposable generated Xcode targets for the SwiftUI and UIKit adapters.
- Keep one workspace for the Field Notes core path and one workspace per case study.
- Keep a versioned Swift runner contract and a catalog manifest that maps every coding-problem approach to its `.swift` file and tests. Local and live runner adapters use the same browser contract.
- Tag the repository at every post checkpoint.
- Keep production and in-memory adapters beside shared contract tests.
- Provide deterministic fixtures for dates, IDs, network responses, media metadata, locations, health samples, and StoreKit configuration.
- Use local and mock services by default. Cloud-backed chapters add external services only after the local contract works.
- Record required entitlements, physical-device requirements, account requirements, and simulator limitations in each relevant README.
- Never include realistic credential strings. All secrets use obvious placeholders and local configuration ignored by Git.

## Publication strategy

Do not create 140 empty post files. Publish in complete arcs and add each post to the series landing page only when its code and exercises work.

Recommended release order:

1. Gate 0, the iOS and Swift authoring skill.
2. Gate 1, the local browser Swift runner, then Gate 1B, the live runner service. Gate 3 can advance while the live deployment is hardened, but public exercises cannot claim live execution before Gate 1B passes.
3. S2.1-S2.3 and one pilot coding-problem category.
4. Posts 1-23, Swift and development foundations, while checked Swift categories continue.
5. Posts 24-44, product design and SwiftUI Field Notes.
6. Posts 45-58, UIKit Field Notes.
7. Posts 59-78, architecture and testing. Complete any remaining Swift catalog categories by this batch gate.
8. Posts 79-86, production and distribution.
9. Posts 87-110 in small capability clusters.
10. Each six-post case study as one researched and tested batch.

Before drafting an arc, freeze its code checkpoint and source set. Before publishing it, run the repo's published-content review, code-example checks, link checks, and build.

## Research basis

The outline follows the current primary documentation retrieved on 2026-07-13:

- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/), including the language guide and reference areas for control flow, types, closures, protocols, generics, concurrency, macros, memory safety, and interoperability.
- [Swift framework overview](https://developer.apple.com/documentation/swift), including Swift 6 adoption, standard-library types, Observation, data modeling, and C, C++, and Objective-C interoperability.
- [Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/) and [Swift Package Manager](https://www.swift.org/documentation/package-manager/) for public API and module design.
- [SwiftUI framework overview](https://developer.apple.com/documentation/swiftui), whose current topic map covers app structure, navigation, model data, persistence, views, layout, events, accessibility, UIKit integration, and previews.
- [SwiftUI model data](https://developer.apple.com/documentation/swiftui/model-data) and [SwiftData](https://developer.apple.com/documentation/swiftdata) for Observation, query-driven UI, model contexts, relationships, concurrency, history, and sync.
- [UIKit framework overview](https://developer.apple.com/documentation/uikit), [view controllers](https://developer.apple.com/documentation/uikit/view-controllers), [view layout](https://developer.apple.com/documentation/uikit/view-layout), and [app and environment](https://developer.apple.com/documentation/uikit/app-and-environment) for scenes, lifecycle, containment, Auto Layout, traits, Observation, restoration, and main-thread UI rules.
- [Swift Testing](https://developer.apple.com/documentation/testing) and [XCTest](https://developer.apple.com/documentation/xctest) for parameterized unit tests, concurrency-aware tests, performance tests, and UI automation.
- [Swift and WebAssembly](https://book.swiftwasm.org/) and [JavaScriptKit](https://github.com/swiftwasm/JavaScriptKit) for compiling Swift to WebAssembly and interoperating with browser JavaScript. The former `carton` workflow is deprecated in favor of JavaScriptKit's SwiftPM plugin, so the runner ADR cannot assume older tutorials remain current.
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) for cross-platform interaction and visual-design guidance.
- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) for safety, performance, business, design, and legal release constraints.
- The official framework indexes for [WatchKit](https://developer.apple.com/documentation/watchkit), [TVUIKit](https://developer.apple.com/documentation/tvuikit), [AppKit](https://developer.apple.com/documentation/appkit), [RealityKit](https://developer.apple.com/documentation/realitykit), [ARKit](https://developer.apple.com/documentation/arkit), [HealthKit](https://developer.apple.com/documentation/healthkit), [MapKit](https://developer.apple.com/documentation/mapkit), [AVKit](https://developer.apple.com/documentation/avkit), [StoreKit](https://developer.apple.com/documentation/storekit), [CloudKit](https://developer.apple.com/documentation/cloudkit), [Core Bluetooth](https://developer.apple.com/documentation/corebluetooth), [Core ML](https://developer.apple.com/documentation/coreml), [Vision](https://developer.apple.com/documentation/vision), [PhotoKit](https://developer.apple.com/documentation/photokit), [User Notifications](https://developer.apple.com/documentation/usernotifications), [WidgetKit](https://developer.apple.com/documentation/widgetkit), [App Intents](https://developer.apple.com/documentation/appintents), and [ActivityKit](https://developer.apple.com/documentation/activitykit).

## Decisions to revisit before drafting

These are deliberate checkpoints, not blockers for the curriculum shape:

- Choose the minimum iOS deployment target against the stable toolchain available when post 31 is drafted.
- Confirm whether the public title stays **Zero to iOS Hero** or becomes **Zero to Apple Platform Hero** while retaining the original phrase as the core-path subtitle.
- Choose whether case-study code lives in this repository or linked companion repositories. The deciding factors are build weight, binary assets, and whether Xcode projects remain useful in a primarily Markdown site.
- Decide whether the backend used by NeighborLink is a documented local mock plus contract, or a separately taught deployable service. The iOS client must remain runnable without paid cloud credentials either way.
- Review specialized entitlement availability before promising runnable CarPlay, HealthKit, Wallet, or restricted capability examples.

## Definition of hero

A reader has completed the program when they can take an unfamiliar app idea and:

1. Reduce it to a testable first release.
2. Model its rules and failure states in Swift.
3. Choose SwiftUI, UIKit, or a hybrid based on evidence.
4. Draw dependency and data-flow boundaries that match real pressures.
5. Integrate storage, network, identity, background work, and relevant device capabilities.
6. Build accessible and adaptive interfaces for the intended Apple devices.
7. Test the domain, application, adapters, UI, performance, and release configuration at appropriate distances.
8. Explain the privacy, security, business, and App Review implications.
9. Ship a beta, interpret production evidence, and evolve the app without a ground-up rewrite.
