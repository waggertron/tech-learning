# Post series value improvement plan

Date: 2026-11-17
Status: in progress; local implementation and site gates passed, Apple SDK validation unavailable
Owner: Codex with Weylin

## Goal and scope

Replace thin installments with useful guides, finish a runnable Field Notes path, strengthen weak React demonstrations, and correct series packaging and overclaims. Preserve useful explanations and incoming URLs while reducing repetition. Work includes every suggestion from the November 17 editorial review, including the smaller MCP, Expo, DSL, and series-placement findings.

This file is the execution checklist. It takes precedence over the curriculum expansion and publication portions of [the original iOS plan](./2026-07-13-zero-to-ios-hero-series-plan.md) for the affected posts. It does not restart or absorb that plan's Swift runner deployment or coding-problem work.

All paths below resolve from `/Users/weylinwagnon/coding/fam/tech-learning`. `P` means `src/content/docs/posts/`; `S` means `src/content/docs/post-series/`; `F` means `companion/field-notes/`. Original part numbers identify the audited posts even after reading order changes. The manifest at the end fixes the affected iOS filenames and intended destinations.

## Completion rules

- Select the first unchecked task whose dependencies are complete. Keep one implementation task active unless independent work warrants delegation.
- Check a task only when its acceptance criteria have evidence. Replace its pending evidence with changed paths, inspection results, and exact command results in the same batch.
- A written outline, passing site build, or a validation disclaimer does not prove an example works.
- Run `npm run build` after every file-change batch, including documentation batches. Every implementation wave also needs the shared content gate below.
- Keep failed or unavailable checks unchecked with the precise blocker. Continue independent work. Do not equate Swift package tests with Apple SDK, Simulator, signing, account, or device evidence.
- Preserve published routes by retaining the chosen destination post and providing static compatibility routes for retired URLs. Verify the actual static output before relying on redirects. Do not leave thin compatibility entries in dated post archives or series discovery.
- Do not commit, push, deploy, purchase tools, or enable external services as part of this plan unless separately requested.
- Specialist platform implementations and a public Swift execution service remain deferred. The reference guides and project briefs do not promise completed integrations.

## Evidence behind the plan

- iOS capability pages are advice-only summaries: `P2026-07-19-ios-persistence-core-data-files-caches-migrations-secure-storage.md:12`.
- Case studies supply decisions without implementations: `P2026-07-20-screenroom-playback-media-lifecycle.md:14`.
- The capstone promises a broader loop than the companion supplies: `P2026-07-19-swiftui-field-notes-capstone.md:40` and `FREADME.md:5`.
- The layout lesson omits its main algorithm: `P2026-07-19-swiftui-layout-safe-areas-stacks-grids-custom-layout.md:108`.
- React measurement currently discards timings: `P_react-example-modules/performance.ts:16`; recovery lacks reset: `P_react-example-modules/ErrorBoundary.tsx:12`.
- Tenant safety wording exceeds its demonstrated boundary: `P2026-04-24-multi-tenant-django-fails-closed.md:3` and its gotchas section.

These observations support editorial work. Version-sensitive API and security claims require fresh primary-source review during their implementation tasks.

## Shared validation and bidirectional reference gate

Apply this gate to each wave. Record its results under that wave's validation checkbox.

1. Before editing, inventory references to every affected filename, route, heading anchor, old title, series slug, and part number using `rg -n -F` across `src`, `docs`, `scripts`, `tests`, `companion`, `.agents/skills`, and `AGENTS.md`. Include imports, raw-source references, generated registry inputs, and navigation data. Inspect ignored local memory read-only when useful; important decisions belong in tracked docs.
2. Maintain a migration table at `docs/post-series-route-migrations.md` with old source, old public route, old fragment, new source, new public route/fragment, inbound-reference locations, outbound-reference changes, compatibility behavior, and evidence. Use one row per old route and additional rows where old anchors split across destinations.
3. Update inbound references: topic pages, related-topic lists, other posts, series hubs, post browsing surfaces, source comments where meaningful, maintained docs, tests, and scripts. Update link labels and prose such as “Part 84” or “complete app case study,” not only URLs.
4. Audit outbound references from each retained or merged page. Resolve links from the rendered route with `/tech-learning` supplied by the build. Preserve useful source attribution and companion links. Remove stale links, duplicates, wrong next steps, obsolete anchors, and references to removed implementation artifacts.
5. Reconcile both ends of previous/next navigation. Rebuild a contiguous unique `series.order`, remove retired series entries, and ensure every listed installment exists and points back to the right series. Put optional branches outside the required linear path.
6. Preserve old routes using static redirects or non-post compatibility pages. Preserve referenced fragments at the destination where feasible. For split destinations, provide a meaningful compatibility landing page with anchor-specific links. Internal links go directly to final destinations, not compatibility hops. Historical documents retain original claims as history with a supersession note rather than silently rewriting historical evidence.
7. Search again for each retired slug/title/part reference. Classify every remaining match as compatibility mapping, historical record, or legitimate quoted content. Leave no unexplained live references. Inspect generated search/archive output for retired thin entries.
8. Run `npm run validate:published-content`, `npm run validate:style`, `npm run build`, `npm run validate:pages`, `npm run validate:links`, and `npm run validate:post-discovery`. All must exit zero, or record unrelated baseline failures distinctly and keep the affected gate open.
9. Spot-check built old URLs, new URLs, relevant fragments, reading-order links, previous/next links, and links back to the hub. Use browser checks for interactions. Run `npm run validate:external-links` when external references change; triage unreachable sources explicitly.

## Wave 0: Establish the migration baseline

- [x] **0.1**: Create `docs/post-series-route-migrations.md` from the manifest below and the non-iOS merge decisions. Capture current inbound links and referenced fragments before any source removal.
  - Evidence: `docs/data/post-series-route-migrations.json` captures 66 original source dispositions, 436 inbound locations, original headings, and outgoing links from the pre-change HEAD snapshot; no explicit incoming fragments found.
- [x] **0.2**: Record baseline results for the shared validation gate. Inventory installed Swift, Xcode, XcodeGen, available Simulator destinations, and the existing Field Notes package checks; record unavailable surfaces without changing system configuration.
  - Evidence: Baseline style/published/pages/links/discovery passed; 1,204 pages, 233 posts, seven Swift package tests. Swift 6.3.3 CLT; Xcode/simctl/XcodeGen unavailable. See `docs/post-series-route-migrations.md`.
- [x] **0.3**: Prove one old-post to consolidated-page compatibility route using the existing Astro static build. Confirm the base prefix, destination fragment, archive exclusion, search behavior, and no redirect loop. Use `astro.config.mjs` redirects if generated output satisfies these requirements; otherwise use a compatibility page outside `posts/` with the old slug.
  - Evidence: Astro static pilot build passed. `node scripts/validate-post-series-migrations.mjs`: two routes passed. Chromium followed old Instruments URL plus hash to the exact destination section and confirmed catalog exclusion. Pagefind reported both redirect pages unindexed.
- [x] **0.V**: Review baseline evidence and compatibility-route proof. No consolidation starts before 0.1 and 0.3 are complete.
  - Evidence: Baseline and compatibility proof reviewed. No runtime dependency or deployment changed; the same direct static mechanism now covers the active migration map.

## Wave 1: Consolidate the thin iOS capability and case-study tail

Depends on Wave 0. Preserve original part identifiers in the migration table, then renumber only the published reading order. Do not inflate the guides by repeating the same general advice under each framework.

- [x] **1.1**: Consolidate original parts 80, 81, 83, 85, and 86 into a production-readiness guide at the existing part 80 route. Include storage choices, privacy/permission decisions, logging, build/signing boundaries, and release checks with focused sources. Move practical persistence teaching to part 40. Title and description must describe a reference guide, not API instruction.
  - Evidence: Production reference now covers storage choices, privacy/permission paths, private diagnostics, artifact inspection, and upgrade/recovery at original route 80.
- [x] **1.2**: Consolidate parts 87-96 into an Apple-platform selection guide at the existing part 87 route. For each platform, explain the distinct user task/input/lifecycle, an adoption pressure, and what evidence would be needed. Remove claims that a platform app has been built.
  - Evidence: Platform selection guide at original route 87 compares six platforms by task/input/lifecycle and separates shared rules from presentation.
- [x] **1.3**: Consolidate parts 97-110 into a capability-selection guide at the existing part 97 route. Group system actions, sync/location/media, nearby hardware/health, commerce, games, and specialized extensions by user problem. Compare when to use or avoid a capability, prerequisites, failure states, and focused documentation. Retain specialist API implementations as deferred work.
  - Evidence: Capability guide at original route 97 groups system actions, sync/place/media, hardware/health, commerce/intelligence/graphics, and specialized extensions with failure boundaries.
- [x] **1.4**: Consolidate parts 111-116 into one Atlas Desk design brief at the original part 111 route. Preserve the unique user problem, one bounded vertical slice, an explicit domain/state sketch, alternatives, failure scenarios, and testable project acceptance criteria. Remove repeated openings, repeated boundary bullets, and claims of completed implementation. Label it a design brief.
  - Evidence: Atlas Desk brief at original 111 retains source revisions, passage identity, rebuildable search, export snapshots, and failure/acceptance scenarios.
- [x] **1.5**: Consolidate parts 117-122 into one PulseTrail design brief at the original part 117 route. Preserve the unique user problem, one bounded vertical slice, an explicit domain/state sketch, alternatives, failure scenarios, and testable project acceptance criteria. Remove repeated openings, repeated boundary bullets, and claims of completed implementation. Label it a design brief.
  - Evidence: PulseTrail brief at original 117 retains session ownership, sample sequence/provenance, interruption replay, energy policy, and physical outdoor/paired-device acceptance.
- [x] **1.6**: Consolidate parts 123-128 into one ScreenRoom design brief at the original part 123 route. Preserve the unique user problem, one bounded vertical slice, an explicit domain/state sketch, alternatives, failure scenarios, and testable project acceptance criteria. Remove repeated openings, repeated boundary bullets, and claims of completed implementation. Label it a design brief.
  - Evidence: ScreenRoom brief at original 123 separates catalog/profile/access/player/progress with a concrete state sketch, interruption walkthrough, and remote/focus acceptance.
- [x] **1.7**: Consolidate parts 129-134 into one NeighborLink design brief at the original part 129 route. Preserve the unique user problem, one bounded vertical slice, an explicit domain/state sketch, alternatives, failure scenarios, and testable project acceptance criteria. Remove repeated openings, repeated boundary bullets, and claims of completed implementation. Label it a design brief.
  - Evidence: NeighborLink brief at original 129 includes outbox identities, authorization, report/block behavior, moderation decision audit, and appeals.
- [x] **1.8**: Consolidate parts 135-140 into one SpacePlanner design brief at the original part 135 route. Preserve the unique user problem, one bounded vertical slice, an explicit domain/state sketch, alternatives, failure scenarios, and testable project acceptance criteria. Remove repeated openings, repeated boundary bullets, and claims of completed implementation. Label it a design brief.
  - Evidence: SpacePlanner brief at original 135 includes value-owned placement, preview/commit/undo, tracking loss, numeric alternatives, and comfort/hardware acceptance.
- [x] **1.9**: Rewrite `Szero-to-ios-hero/index.mdx` and `Sindex.mdx` to distinguish the executable core curriculum from reference guides and optional design briefs. Remove the “complete app case studies” claim. Update the original iOS plan and `docs/zero-to-ios-hero-validation-matrix.md` to reference the new scope without erasing historical evidence.
  - Evidence: iOS hub now lists 77 core lessons, four reference guides, and five optional briefs. Both post discovery sources and the validation matrix reflect the actual scope; original assignments are labeled historical.
- [x] **1.10**: Apply the bidirectional reference gate to every consolidated route, including compatibility routes and original part labels. Update `docs/feature_tracker.md` with the delivered restructuring and its limits.
  - Evidence: 57 direct static migrations enabled across iOS/React/composition. Live references rewritten; 436 original inbound locations retained in the inventory. Feature tracker updated. Integrated link and migration gates passed.
- [x] **1.11**: Rewrite original part 82 at its existing route as the bounded background-work design guide specified in the manifest. Show one state transition sequence for scheduling, expiry, cancellation, and retry. Explain push and extension boundaries as references, without claiming an executed device integration.
  - Evidence: Original 82 now walks a checkpointed attachment job through scheduling, expiration, acknowledgement loss, cancellation, retry, and duplicate notifications without claiming device delivery.
- [x] **1.V**: Complete the shared validation gate. Review each consolidated guide/brief for retained unique content, accurate scope, no repeated template filler, and no retired thin entries in current discovery.
  - Evidence: Independent content review found two omissions; moderation/appeals and energy/device evidence were restored. Full pre-push gate passed: style, published content, pages, internal links, migrations, post discovery, custom browser behavior. External audit triaged 11 inherited failures, none introduced by this work.

## Wave 2: Remove duplicated iOS lessons and align the architecture path

Depends on Wave 1. Keep conceptual framework differences where they teach something observable.

- [x] **2.1**: Merge part 70 into part 71 at `P2026-07-19-ios-testing-strategy-seams-confidence.md`. Keep one risk-to-test matrix, retain the refactoring and decision-record examples, and demonstrate one requirement change with a corresponding test change.
  - Evidence: Original 70 merged into 71 with one risk matrix, runnable search-contract example, incremental repository seam, and decision-record tradeoffs. Retired route reaches #build-a-risk-matrix.
- [x] **2.2**: Merge part 84 into part 77 at `P2026-07-19-ios-performance-memory-energy-launch-device-matrices.md`. Keep one repeatable workload and measurement procedure with named inputs, metric, run conditions, and before/after interpretation. Do not invent hardware results.
  - Evidence: Original 84 merged into 77 with a 2,000-note fixture, five-run procedure, named measurement conditions, trace hypothesis, and no fabricated timings. Old bookmarks verified in Chromium.
- [x] **2.3**: Merge part 75 into part 73 at `P2026-07-19-ios-xctest-xcuitest-test-plans-coexistence.md`. Keep one deterministic create-note journey, distinguish unit tests from XCUITest, and link to the actual two app drivers delivered in Wave 3.
  - Evidence: Original 75 merged into 73. One deterministic paired create/edit/relaunch scenario references the real SwiftUI/UIKit drivers and separates accessibility audits from tap sequences. Actual Apple execution remains in 3.9.
- [x] **2.4**: Connect parts 61-64 into one executable architecture walkthrough across their existing routes: presentation saving state, reducer/effects boundary, validated domain values, and startup injection. Move reusable definitions into `FPackages/FieldNotesCore/Sources/FieldNotesCore/`; align names with real code and avoid redeclaring incompatible `NoteLibrary` contracts.
  - Evidence: Original 61-64 now use companion NoteDraft, SaveNote, SaveState, Tag/Coordinate, and AppComposition rather than incompatible hypothetical interfaces. Shared package execution passed.
- [x] **2.5**: Add regression cases in `FPackages/FieldNotesCore/Tests/FieldNotesCoreTests/FieldNotesCoreTests.swift` for title/tag/coordinate boundaries, fixed IDs/time, save success/failure, and the chosen reducer transitions. Show actual outcomes in the matching lessons.
  - Evidence: FieldNotesCore suite expanded from seven to 23 tests: validated values, fixed time/ID, save failure, reducer/input lock, shared repository contracts, malformed/reopen/write failure, routing, geometry, and cancellation/stale results.
- [x] **2.6**: Apply the bidirectional reference gate to merges and architecture examples. Align `docs/field-notes-acceptance-specification.md` with the bounded app slice and preserve explicitly deferred features.
  - Evidence: Core navigation rebuilt and checked in both directions. Acceptance specification now distinguishes implemented source/package evidence from deferred features and unavailable Apple checks.
- [x] **2.V**: Run the shared validation gate, `swift build --package-path companion/field-notes/Packages/FieldNotesCore`, and `(cd companion/field-notes && ./scripts/test-package.sh)`. Record package evidence separately from unavailable Apple target checks.
  - Evidence: Final package wrapper passed 23 tests. Package build and shared composition typecheck passed. Full site pre-push passed. Wrapper command corrected to run from companion/field-notes.

## Wave 3: Finish the Field Notes app path and repair SwiftUI demonstrations

Depends on Wave 2. Target one local loop: list, create, validate, save durably, relaunch, edit, search/favorite, and recover from a failed save without losing the draft. Attachments, cloud sync, widgets, and other specialist features remain deferred and disappear from capstone completion claims. Confirm supported targets from the installed matrix before implementing APIs.

- [x] **3.1**: Implement a local file-backed repository under `FPackages/FieldNotesCore/Sources/FieldNotesCore/` using the existing repository contract. Document atomic replacement and failure behavior. Preserve note IDs across reopen and surface corrupt/read/write failures without silently deleting user data. Apply `repository-adapter-contract` and `hexagonal-architecture` skills.
  - Evidence: FileNoteRepository under core/adapters uses atomic file replacement, validates decoded records and version, preserves corrupt/unsupported/failed-write stores, and documents single-actor/process coordination limits.
- [x] **3.2**: Run the same repository behavioral cases against in-memory and file-backed implementations: create/update/delete, stable identity, ordering/search, reopen, malformed data, and failed writes. Use deterministic temporary directories and valid fixtures. Keep platform file-protection claims outside package evidence.
  - Evidence: Memory/file shared contracts plus reopen, corrupt, unsupported, failed-write, duplicate-ID, and validated decode cases passed in the 23-test package suite.
- [ ] **3.3**: Extend `FApps/SwiftUI/FieldNotesSwiftUIApp.swift` with the bounded list/detail/editor path, visible validation, saving/failure/retry states, search/favorite, and a composition root selecting live versus deterministic test repositories. Preserve the draft on failure and prevent duplicate submission.
  - Evidence: Source implements the bounded SwiftUI app, draft recovery, disabled editing during pending save, retained-content failure banner, search/favorite, and durable composition. Syntax parsed; full Apple SDK typecheck and executed UI evidence unavailable.
- [ ] **3.4**: Extend `FApps/UIKit/NoteListViewController.swift` and focused sibling controllers with the same app behavior through UIKit events and containers. Share product contracts with SwiftUI rather than duplicating domain rules.
  - Evidence: Source implements UIKit parity and locks editable controls through pending save, restoring them on failure. Syntax parsed; Apple SDK compilation and executed controller/UI evidence unavailable.
- [ ] **3.5**: Replace omitted `rows` logic in `P2026-07-19-swiftui-layout-safe-areas-stacks-grids-custom-layout.md` with a complete companion implementation and explicit empty/narrow/long-label/large-text/RTL behavior. Add focused measurement tests where pure geometry permits and app preview cases for visual behavior.
  - Evidence: Complete pure tag geometry and edge tests passed; SwiftUI Layout bridge and preview fixtures supplied. Apple rendering, Dynamic Type, and RTL behavior remain unverified.
- [ ] **3.6**: Repair parts 32-43 against the actual companion APIs. Supply missing definitions or direct source links, complete async save/error handling, provide deterministic loading/cancellation cases, and make part 40 show a concrete SwiftData schema migration with old-store fixtures and isolated stores. Present file-backed and SwiftData persistence as explicit alternatives.
  - Evidence: Parts 32-43 now reference real APIs and include complete companion loading/layout and SwiftData V1-to-V2 migration source. Pure package cases pass; SwiftData old-store and isolated-container tests cannot execute without Apple SDK/Xcode.
- [ ] **3.7**: Replace illustrative UI tests with actual SwiftUI and UIKit create/edit/failure/relaunch drivers in `FTests/SwiftUIUITests/FieldNotesSwiftUIUITests.swift` and `FTests/UIKitUITests/FieldNotesUIKitUITests.swift`. Add model/controller tests in the existing app test directories. Verify each driver targets real controls and launch arguments.
  - Evidence: Real create/edit/relaunch, failed-save/retry, delayed-save input lock, refresh model, and paired driver sources supplied. They match current controls/arguments, but XCUITest/app-model execution is unavailable.
- [x] **3.8**: Rewrite capstones 44 and 58 as reproducible assembly walkthroughs with setup/run commands, matching source files, observed output, a failed-save recovery example, and a truthful completion table. Align `FREADME.md`, `docs/field-notes-acceptance-specification.md`, and `docs/zero-to-ios-hero-validation-matrix.md`.
  - Evidence: Both capstones are reproducible companion assembly guides with concrete paths, package commands/results, app commands, source behavior, and explicit unverified Apple checks. They no longer claim a completed hardware-tested release.
- [ ] **3.9**: Run Apple target validation when available: from `F`, run `make generate`, inspect `xcodebuild -project FieldNotes.xcodeproj -scheme FieldNotesSwiftUI -showdestinations`, then `make build-swiftui`, `make test-swiftui`, `make build-uikit`, and `make test-uikit` with `DESTINATION` set to one exact installed destination. Record the resolved value and results. Perform large-text/VoiceOver/keyboard and relaunch checks on supported destinations. Leave this task unchecked if required Xcode or destinations are unavailable.
  - Evidence: Blocked: no full Xcode application, XcodeGen, simctl runtime/devices, or selected Apple app SDK tools. Swift 6.3.3 Command Line Tools only. Do not count package tests, shared composition typecheck, or syntax parsing as this evidence.
- [x] **3.10**: Apply the bidirectional reference gate to code links, capstones, curriculum navigation, and deferred-feature claims. Record delivered capabilities and validation limits in `docs/feature_tracker.md`.
  - Evidence: Companion links and current routes aligned; 77 iOS reciprocal navigation entries verified in review. Tracker and focused validation/acceptance docs distinguish package evidence from Apple-target gaps.
- [ ] **3.V**: Run the shared validation gate and package build/tests. Close the wave only when 3.9 has real target evidence; record any unavailable hardware checks separately without claiming them.
  - Evidence: Package and shared site gates pass. Remains open because 3.3-3.7 and 3.9 require Apple-target evidence. No Simulator/accessibility/device results claimed.

## Wave 4: Make the weak React demonstrations observable

May proceed while Apple-only work is blocked. Existing live example generation is part of the implementation, not evidence that the lesson itself demonstrates its claim.

- [x] **4.1**: Rewrite `P2026-07-07-react-performance-and-compiler.md` and `P_react-example-modules/performance.ts` around one reproducibly slow interaction. Display captured Profiler values, compare baseline versus changed behavior, and explain variance without fixed speed promises. Add current primary-source-backed Compiler setup and a concrete before/after example; keep the Compiler claim unchecked until the example builds.
  - Evidence: PerformanceLab uses 12,000 deterministic rows and visible Profiler output for development, without simulated production timings. Isolated Compiler 1.0.0 cache generation and Compiler-enabled Vite production build passed.
- [x] **4.2**: Rewrite `P2026-07-07-react-error-boundaries-recovery.md`, `P_react-example-modules/ErrorBoundary.tsx`, and `P_react-example-modules/PanelError.tsx` to demonstrate a deliberate panel failure, unaffected sibling content, visible fallback, and working reset/retry. Add behavior cases to `tests/react-example-output-views.test.mjs` for failure isolation and successful recovery.
  - Evidence: Live failure/recovery example preserves sibling content and resets the boundary. Actual Chromium regression passed in the 18-test React suite.
- [x] **4.3**: Replace `P2026-07-07-react-deployment-observability-feature-flags.md` with a local build/serve/release walkthrough: exact build output, runtime configuration boundary, visible error reporting, deterministic flag-on/off behavior, and rollback to a previous local artifact. Link to #33 for error-boundary mechanics. Deployment credentials and live production rollout remain out of scope.
  - Evidence: Local immutable release snapshots, content digests, runtime configuration, observable flags/errors, and candidate-to-previous rollback verified by companion/react-workbench/verify-release.mjs.
- [x] **4.4**: Merge #21, #26, and #29 into `P2026-07-07-react-framework-choice-project-setup.md`. Use a decision table and a runnable Vite/TypeScript setup, concrete lint configuration, a deliberately broken effect with diagnostic and fix, formatting commands, and a CI workflow. Preserve the two retired routes. Use existing dependencies; do not add tooling dependencies without authorization.
  - Evidence: Original 21 now contains runnable Vite/TS setup, explicit config, formatting, Hooks lint diagnostic/fix, and an inert CI specimen. Compiler/lint/production build checks passed using approved isolated tooling. Original 26/29 routes preserved.
- [x] **4.5**: Move `P2026-07-07-react-expo-react-native.md` to an optional native branch linked from the React hub. Narrow its promise to the demonstrated rendering/state fundamentals, distinguish React Native from Expo, and remove an implied Expo walkthrough. A device/permission feature implementation remains deferred.
  - Evidence: Native-renderer comparison is standalone optional reading, with scope narrowed to the actual demo and links back to the React guide.
- [x] **4.6**: Regenerate output views with `npm run sync:react-outputs`; remove orphaned generated entries only through the maintained generation path. Align `src/generated/react-example-registry.tsx`, generated example modules, article imports, and tests. Apply the bidirectional reference gate to merged routes and branch navigation. Record changes in `docs/feature_tracker.md`.
  - Evidence: Generator synchronized 73 live examples across 38 retained posts; check mode reported zero changes. React main order is contiguous 1-37. Incoming links and compatibility anchors migrated; feature tracker updated.
- [x] **4.V**: Run `npm run check:react-outputs`, `npm run test:react-outputs`, `npm run validate:code-examples`, the shared validation gate, and `npm run validate:custom-pages`. Manually exercise performance output, boundary failure/recovery, and flag switching in the browser.
  - Evidence: 18 React tests passed, including actual browser performance/recovery/rollout. Workbench strict typecheck, formatting, tooling check and release proof passed. Full pre-push/custom-page gates passed.

## Wave 5: Strengthen remaining articles and fix series packaging

May proceed independently after Wave 0. Refresh external API/security evidence through the relevant specialist when it materially affects the rewrite.

- [x] **5.1**: Rewrite `P2026-04-24-multi-tenant-django-fails-closed.md` to state its ORM/context boundary and explicit bypasses. Add a minimal runnable specimen under `companion/django-tenancy/` with pinned environment instructions and tests for missing context, cross-tenant reads/writes, relations, bulk operations, background-job context, exception cleanup, and documented raw-SQL/admin bypass behavior. Run `python3 -m unittest discover -s companion/django-tenancy/tests`; narrow guarantees to passing cases. Dependency installation or new packages require the existing authorization boundary to be resolved before proceeding.
  - Evidence: Approved isolated Python environment ran nine Django 5.2.8/SQLite contracts; pip check passed. Specimen and article state manager/base-manager/join/raw/bulk boundaries. Site dependencies unchanged.
- [x] **5.2**: Merge `P2026-04-24-solid-principles.md` and `P2026-04-24-composition-over-inheritance.md` into a worked design lesson at the existing SOLID route. Evolve one TypeScript notification/reporting example through two requirement changes, show a substitutability failure and focused tests, compare composition with needless interfaces, and remove the unsupported dated LSP generalization. Preserve the composition route.
  - Evidence: SOLID/composition merged at SOLID route with two worked requirement changes, behavioral substitution failure, and five passing Node tests plus strict TypeScript check. Old composition route preserved.
- [x] **5.3**: Recast `Ssoftware-design-principles/index.mdx` as a collection rather than a required sequence. Keep `P2026-05-15-typescript-async-mutex-pattern.md` as a focused article and explain its relationship to the worked design lesson without implying a prerequisite.
  - Evidence: Software design hub is a collection; mutex remains a focused article with order 2 and direct relationship links.
- [x] **5.4**: Move `P2026-05-23-grok-morse-code-prompt-injection.md` out of the Auth reading order into related AI security case studies. Link it from the AI Guardrails hub without inventing a new numbered installment. Verify incident sources and distinguish reported facts from inferred safety-layer mechanisms; update links and explanatory text in both hubs and the post.
  - Evidence: Grok article is standalone, qualifies secondary reporting and inferred mechanisms, and is linked from Auth related reading and AI Guardrails optional case studies. Existing 14-part Guardrails order preserved.
- [x] **5.5**: Present `P2026-07-24-claude-code-clean-room-agent-internals.md` as standalone until more installments exist. Remove the planned arc from public discovery, preserve useful reader-facing hub links or provide a compatibility destination, and move unpublished expansion notes to tracked planning docs.
  - Evidence: Coding Agent article is standalone; preserved guide contains the real published article. Public planned arc removed; deferred expansion topics recorded in this execution log.
- [x] **5.6**: Label `Sdomain-specific-languages/index.mdx` as a substantial guide in `Sindex.mdx` and post browsing surfaces while preserving its URL, calculator, examples, and source synthesis. Do not delete its content because it has no series-tagged installments.
  - Evidence: DSL labels in hub and post browsing surfaces identify the substantive guide. Existing URL, calculator, examples, and source synthesis preserved; calculator browser check passed.
- [x] **5.7**: Narrow `P2026-07-19-remote-mcp-production-security.md` and the corresponding `Smcp-server-design/index.mdx` description to a remote-production design checklist. State that the demonstrated companion is local and identify what an actual remote/auth implementation would need. Preserve the useful checklist; defer a new OAuth/HTTP service rather than imply it has been built.
  - Evidence: MCP9 and hub explicitly describe a remote-production design checklist. No OAuth/HTTP service execution claim; local companion scope remains clear.
- [x] **5.8**: Apply the bidirectional reference gate across all eight non-iOS/non-React series, including backlinks into Auth, AI Guardrails, design principles, DSL, and Coding Agent Internals. Preserve CS reference sheets and substantive MCP/AI/Home-health articles. Record delivered restructuring in `docs/feature_tracker.md`.
  - Evidence: All series/discovery entry points reconciled, including reciprocal hub links. Retired-route references absent from live content per migration gate. Feature tracker updated.
- [x] **5.V**: Run the shared validation gate plus each new specimen's documented commands, `npm run test:mcp-companion`, and `npm run build:mcp-companion` if MCP source changes. Use `npm run validate:custom-pages` to check the preserved DSL calculator when discovery changes affect it.
  - Evidence: Django nine tests, SOLID five tests, strict TS, style and published content passed. Integrated pre-push also passed MCP tests/build, full site links/pages, DSL calculator, and discovery browser checks.

## Closeout

- [x] **6.1**: Reconcile every recommendation against the completed checklist, all route-migration rows, and actual delivered files. Reopen tasks invalidated by later changes. Confirm every required inbound and outbound reference has an inspected destination, including fragments and both directions of series navigation.
  - Evidence: All audit recommendations map to checklist tasks and route rows. Seven Apple-dependent tasks below remain open; archival is therefore open. Reviewer verified both 77/37 reciprocal navigation chains. Live retired-route scan and built anchors passed.
- [x] **6.2**: Review retained lessons against the editorial standard: a clear reader question, explanation of the mechanism, concrete demonstrated result where instruction is promised, a meaningful alternative or failure path, and precise evidence limits. Do not use word count or a fixed template as a proxy for value.
  - Evidence: Independent content and code reviews completed. Restored two product-specific omissions and fixed pending-save draft-loss plus visible retained-content refresh recovery. Deferred specialist capabilities remain explicitly bounded.
- [x] **6.3**: Run `npm run validate:pre-push` as the final integrated check, even though this plan does not authorize pushing. Record exact failures or environment limits and do not mark the gate complete until resolved. Record unavailable external/device checks separately.
  - Evidence: npm run validate:pre-push passed, including all deterministic suites, build, 1,127 HTML pages, links, 57 route migrations, and four browser validation stages. Final Swift package regression run passed 23 tests. External audit recorded 11 pre-existing unrelated failures in docs/post-series-route-migrations.md.
- [ ] **6.4**: Update `docs/feature_tracker.md`, focused authoring/validation docs affected by delivered changes, and supersession links in the original iOS plan. Archive this plan under `docs/plans/history/` only after every required task is complete and evidence exists; preserve genuinely deferred work explicitly.
  - Evidence: Feature tracker, migration validation docs, matrix, acceptance spec, and original-plan supersession are aligned. Archival remains blocked by the open Apple verification tasks; plan intentionally stays in docs/plans/current/.

## Risks and recovery

- Broken bookmarks or fragments: retain compatibility routes, audit both link directions, and inspect built output. Do not remove a source before its migration row and destination exist.
- Lost unique teaching material: compare source sections with the consolidated destination before deletion. Use git diff for review and restore only the affected task's edits if a batch needs rollback. Never reset unrelated work.
- Unavailable Apple tools: finish package and editorial work, record the exact missing surface, and keep Apple validation open. Do not fabricate simulator or hardware evidence.
- Oversized rewrites: deliver one bounded vertical slice first. Broader platforms, health, commerce, spatial apps, and public runner deployment stay deferred.
- New dependencies: reuse installed tooling first. If a dependency is necessary for Django or Compiler evidence, report the exact package and reason before adding it. The independent documentation work can continue.

## iOS source disposition manifest

The destination identifiers below refer to original part routes, not the final contiguous reading-order number. Every listed source gets its own migration row and inbound/outbound audit. Parts 1-30 remain in place. Parts 31-79 remain unless explicitly merged below.

| Original part | Source under P | Disposition |
| --- | --- | --- |
| 70 | `2026-07-19-ios-architecture-tests-refactoring-decisions-tradeoffs.md` | Merge into original 71 |
| 75 | `2026-07-19-ios-swiftui-uikit-navigation-accessibility-ui-tests.md` | Merge into original 73 |
| 80 | `2026-07-19-ios-persistence-core-data-files-caches-migrations-secure-storage.md` | Production reference guide at original 80 |
| 81 | `2026-07-19-ios-security-privacy-permissions-platform-policy.md` | Production reference guide at original 80 |
| 82 | `2026-07-19-ios-background-work-notifications-deep-links-app-extensions.md` | Retain route; rewrite as narrow background-work design guide, with concrete lifecycle/state example and no claim of demonstrated push delivery |
| 83 | `2026-07-19-ios-logging-analytics-crashes-privacy-feature-flags.md` | Production reference guide at original 80 |
| 84 | `2026-07-19-ios-instruments-responsiveness-energy-launch-networking.md` | Merge into original 77 |
| 85 | `2026-07-19-ios-build-settings-signing-entitlements-ci-dependencies-release-configuration.md` | Production reference guide at original 80 |
| 86 | `2026-07-19-ios-testflight-app-store-review-launch-observability-evolution.md` | Production reference guide at original 80 |
| 87 | `2026-07-19-one-product-across-apple-platforms.md` | Platform selection guide at original 87 |
| 88 | `2026-07-19-ipados-multitasking-pointer-keyboard-pencil-documents.md` | Platform selection guide at original 87 |
| 89 | `2026-07-19-macos-swiftui-scenes-commands-windows-settings-tables-documents.md` | Platform selection guide at original 87 |
| 90 | `2026-07-19-appkit-mac-catalyst-framework-choice.md` | Platform selection guide at original 87 |
| 91 | `2026-07-19-watchos-app-structure-watch-connectivity.md` | Platform selection guide at original 87 |
| 92 | `2026-07-19-watchos-workouts-complications-smart-stack-constraints.md` | Platform selection guide at original 87 |
| 93 | `2026-07-19-tvos-focus-remote-input-shelves-navigation.md` | Platform selection guide at original 87 |
| 94 | `2026-07-19-avkit-avfoundation-playback-streaming-media-sessions.md` | Platform selection guide at original 87 |
| 95 | `2026-07-19-visionos-windows-volumes-ornaments-spatial-input.md` | Platform selection guide at original 87 |
| 96 | `2026-07-19-realitykit-arkit-immersive-spaces-comfort-assets.md` | Platform selection guide at original 87 |
| 97 | `2026-07-19-widgetkit-live-activities.md` | Capability selection guide at original 97 |
| 98 | `2026-07-19-app-intents-shortcuts-spotlight-system-actions.md` | Capability selection guide at original 97 |
| 99 | `2026-07-19-cloudkit-icloud-containers-sharing-sync.md` | Capability selection guide at original 97 |
| 100 | `2026-07-19-mapkit-core-location-geocoding-weatherkit.md` | Capability selection guide at original 97 |
| 101 | `2026-07-19-camera-photokit-image-pipelines-vision.md` | Capability selection guide at original 97 |
| 102 | `2026-07-19-audio-speech-recording-interruptions.md` | Capability selection guide at original 97 |
| 103 | `2026-07-19-video-capture-editing-playback-streaming-architecture.md` | Capability selection guide at original 97 |
| 104 | `2026-07-19-core-bluetooth-nearby-interaction-accessories-connectivity.md` | Capability selection guide at original 97 |
| 105 | `2026-07-19-healthkit-workoutkit-health-data-design.md` | Capability selection guide at original 97 |
| 106 | `2026-07-19-core-ml-vision-natural-language-on-device-intelligence.md` | Capability selection guide at original 97 |
| 107 | `2026-07-19-storekit-subscriptions-offers-entitlement-state.md` | Capability selection guide at original 97 |
| 108 | `2026-07-19-apple-pay-passes-wallet-transaction-ux.md` | Capability selection guide at original 97 |
| 109 | `2026-07-19-games-gamekit-spritekit-scenekit-metal-choices.md` | Capability selection guide at original 97 |
| 110 | `2026-07-20-home-matter-carplay-files-collaboration-specialized-extensions.md` | Capability selection guide at original 97 |
| 111 | `2026-07-20-atlas-desk-discovery-release-boundary.md` | Design brief at original 111 |
| 112 | `2026-07-20-atlas-desk-domain-architecture.md` | Design brief at original 111 |
| 113 | `2026-07-20-atlas-desk-swiftui-phone-tablet-app.md` | Design brief at original 111 |
| 114 | `2026-07-20-atlas-desk-storage-search-files-sync.md` | Design brief at original 111 |
| 115 | `2026-07-20-atlas-desk-macos-product-design.md` | Design brief at original 111 |
| 116 | `2026-07-20-atlas-desk-quality-release-review.md` | Design brief at original 111 |
| 117 | `2026-07-20-pulsetrail-product-safety-privacy.md` | Design brief at original 117 |
| 118 | `2026-07-20-pulsetrail-cross-device-architecture.md` | Design brief at original 117 |
| 119 | `2026-07-20-pulsetrail-healthkit-workoutkit-maps-location.md` | Design brief at original 117 |
| 120 | `2026-07-20-pulsetrail-watch-ui-complications-widgets-live-activities.md` | Design brief at original 117 |
| 121 | `2026-07-20-pulsetrail-offline-battery-sync-failure-recovery.md` | Design brief at original 117 |
| 122 | `2026-07-20-pulsetrail-testing-release-review.md` | Design brief at original 117 |
| 123 | `2026-07-20-screenroom-product-content-model.md` | Design brief at original 123 |
| 124 | `2026-07-20-screenroom-tvos-architecture-focus.md` | Design brief at original 123 |
| 125 | `2026-07-20-screenroom-playback-media-lifecycle.md` | Design brief at original 123 |
| 126 | `2026-07-20-screenroom-backend-auth-subscriptions-downloads.md` | Design brief at original 123 |
| 127 | `2026-07-20-screenroom-performance-accessibility-resilience.md` | Design brief at original 123 |
| 128 | `2026-07-20-screenroom-testing-release-review.md` | Design brief at original 123 |
| 129 | `2026-07-20-neighborlink-product-trust-moderation.md` | Design brief at original 129 |
| 130 | `2026-07-20-neighborlink-architecture-identity-api-contracts.md` | Design brief at original 129 |
| 131 | `2026-07-20-neighborlink-uikit-feed-search-forms-camera-maps.md` | Design brief at original 129 |
| 132 | `2026-07-20-neighborlink-chat-offline-writes-push-deep-links.md` | Design brief at original 129 |
| 133 | `2026-07-20-neighborlink-payments-privacy-security-moderation-operations.md` | Design brief at original 129 |
| 134 | `2026-07-20-neighborlink-quality-release-review.md` | Design brief at original 129 |
| 135 | `2026-07-20-spaceplanner-product-comfort-spatial-design.md` | Design brief at original 135 |
| 136 | `2026-07-20-spaceplanner-architecture-asset-pipeline.md` | Design brief at original 135 |
| 137 | `2026-07-20-spaceplanner-windows-volumes-immersion-input.md` | Design brief at original 135 |
| 138 | `2026-07-20-spaceplanner-realitykit-arkit-interaction-rendering.md` | Design brief at original 135 |
| 139 | `2026-07-20-spaceplanner-persistence-collaboration-performance-accessibility.md` | Design brief at original 135 |
| 140 | `2026-07-20-spaceplanner-testing-release-review.md` | Design brief at original 135 |

## Execution log

- 2026-11-17: Created the implementation checklist from the editorial audit. Incorporated explicit inbound/outbound reference migration, fragment preservation, reciprocal series navigation, and built-link verification. Implementation tasks remain unchecked.

- Ruling: Perform the part 84 into 77 merge as the Wave 0 compatibility pilot, ahead of the remaining Wave 2 content edits. This proves the migration mechanism against a real retired route. Record compiler/browser sandbox retries separately from product defects. The package wrapper requires its companion working directory, corrected above.

- Ruling: The owner approved isolated temporary Django, React Compiler, and ESLint tooling in this session. Site dependency versions and lockfile remain unchanged. Coding Agent expansion topics (harness loop, context assembly, tool contracts, permission containment, hooks, subagents, MCP, evals) remain deferred rather than public placeholders.

- 2026-11-17: Integrated full pre-push validation passed. The work reduced the dated catalog from 233 to 176 posts, preserving 57 retired routes as direct static compatibility pages. Independent content review restored moderation/appeals and outdoor energy requirements; code review prompted input locking during saves and visible stale-content refresh recovery. Final Field Notes package run passed 23 tests.
- Ruling: Keep seven Apple-dependent implementation/validation tasks and final archival open. Code is supplied and syntax checked, but no full Xcode installation exists to establish Apple SDK compilation, UI/migration execution, Simulator, accessibility, or hardware behavior. Do not manufacture that evidence or silently lower acceptance criteria.
- Ruling: The global external audit found 11 inherited failures in unrelated pages. Their original HEAD locations and observed statuses are recorded in the migration document. Live internal routes/anchors are clean; no external failure was introduced by the rewritten pages.
