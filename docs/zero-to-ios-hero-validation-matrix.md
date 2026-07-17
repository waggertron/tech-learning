# Zero to iOS Hero Validation Matrix

**Date:** 2026-07-16
**Status:** Gate 3 baseline
**Applies to:** Posts 1 through 140

## Purpose

This matrix defines the minimum evidence required before a post checkbox can close. It does not claim that evidence already exists. Each post inherits one profile and any additions in its assignment row.

Evidence records name the command, commit, compiler, language mode, SDK, destination, result, and unavailable boundary. A result is never promoted from simulator to device, from preview to accessibility, or from Linux Swift to an Apple SDK.

## Publication and Compilation Boundary

Compilation is tied to executable claims, not to the existence of a post. A prose-only lesson can record compile, test, simulator, and device evidence as not applicable when it introduces no executable behavior. A lesson with runnable Swift uses the narrowest artifact that proves its claim: standalone `swiftc`, Swift Package Manager, or a named Xcode target.

Full Xcode is required only for claims involving an Apple SDK, application target, Simulator runtime, signing, archive, or physical-device deployment. Command Line Tools can validate standalone Swift and compatible packages. The browser runner can validate the pinned Swift 6.3.3 Linux standard-library boundary. Neither surface proves Apple framework behavior.

An unavailable Xcode, simulator, device, account, or entitlement blocks only the post or claim assigned to that evidence. It does not block prose-only lessons, standard-library lessons, package lessons, or the series as a whole.

Authoring status is independent from evidence status. A post may be created, reviewed, indexed, and published while one or more assigned evidence values remain Not verified. Its evidence record names the gap, its completion checkbox stays open, and authoring proceeds to the next post. This separation prevents missing hardware or platform services from turning the curriculum into a set of empty placeholders.

## Evidence Values

- **Required:** The post cannot close without the artifact.
- **Contextual:** Required when the post makes a claim on that surface. Otherwise record why it is not applicable.
- **Not applicable:** The post has no executable or platform behavior on that surface. Record the rationale once in its evidence note.
- **Not verified:** The evidence is required but a tool, runtime, account, entitlement, network, or device is unavailable. The post remains open.

## Profiles

| ID | Lesson type | Compile | Automated tests | Simulator | Device | Accessibility | Performance | Manual review |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OW | Orientation and workflow | Required for every code anchor; use package, standalone Swift, or named Xcode target as appropriate. | Required for executable behavior introduced by the post. | Contextual for Xcode, debugger, and app workflow claims. | Contextual for device workflow claims. | Contextual for any UI shown. | Contextual for feedback-loop or tool claims. | Required for terminology, toolchain boundary, diagnostics, and checkpoint reproducibility. |
| SL | Swift language | Required with Swift 6 mode and warnings treated as errors. | Required with valid, boundary, and deliberate failure cases. | Not applicable unless the language behavior is tied to an Apple runtime. | Not applicable unless the claim depends on hardware. | Contextual for user-facing text, locale, or API design. | Contextual for collection, ownership, concurrency, or algorithm cost claims. | Required for diagnostics, API shape, source references, and browser Linux boundary. |
| PD | Product design | Contextual for prototypes or executable state models. | Required for executable state or validation models. | Contextual for adaptive, localization, or interaction prototypes. | Contextual for hardware-shaped interaction. | Required for interaction and interface decisions. | Contextual for design decisions that affect responsiveness or resources. | Required for product pressure, flows, states, HIG sources, and wireframe consistency. |
| SU | SwiftUI implementation | Required for `FieldNotesSwiftUI` and affected package products. | Required package, presentation, and focused UI tests. | Required on named compact and regular-width destinations. | Contextual, and required for hardware or lifecycle claims named by the post. | Required for affected journeys, including manual assistive-technology review. | Contextual, and required when the post discusses collection scale, animation, networking, persistence, launch, or resources. | Required for state ownership, identity, navigation, failure states, and source refresh. |
| UK | UIKit implementation | Required for `FieldNotesUIKit` and affected package products. | Required package, controller, lifecycle, and focused UI tests. | Required on named compact and regular-width destinations. | Contextual, and required for hardware or lifecycle claims named by the post. | Required for affected journeys, including manual assistive-technology review. | Contextual, and required for reuse, layout, scrolling, animation, networking, persistence, launch, or memory claims. | Required for lifecycle, containment, responder, reuse, restoration, deallocation, and source refresh. |
| AR | Architecture | Required for affected package products and both app schemes when integration changes. | Required for domain, use-case, port, adapter, dependency, and architecture contracts. | Contextual for navigation, restoration, composition-root, and adapter integration. | Contextual for lifecycle or hardware-backed adapters. | Contextual for UI boundary changes. | Contextual for modularity, caching, sync, concurrency, or resource claims. | Required for pressure, alternatives, dependency direction, ADRs, and rejected complexity. |
| TQ | Testing and quality | Required for every artifact under test. | Required at every test distance selected by the post, with a deliberate failure proof. | Contextual, and required for UI or Apple-runtime testing claims. | Contextual, and required for device-matrix, energy, thermal, sensor, or real-service claims. | Contextual, and required for UI quality claims. | Contextual, and required for metrics, Instruments, memory, energy, launch, or baseline claims. | Required for risk coverage, flake control, fixture validity, retained artifacts, and evidence labels. |
| PR | Production and release | Required for package, app, extension, archive, or release configuration affected. | Required for contracts, upgrades, migrations, UI smoke, release, and rollback paths. | Required for supported non-hardware flows. | Required for hardware, signing, background, permission, performance, and release claims. | Required for affected release journeys. | Required when the post addresses production resources, responsiveness, energy, launch, or network use. | Required for privacy, security, operations, signing, entitlements, accounts, App Review, and recovery. |
| CA | Capability atlas | Required for every named platform and capability target. | Required with deterministic adapter and capability-specific failures. | Required where the simulator faithfully supports the capability. | Required when hardware, system account, entitlement, sensor, media route, or background behavior matters. | Required for the capability's primary journeys. | Contextual, and required for device-resource or real-time claims. | Required for availability, permission, entitlement, account, privacy, product fit, and simulator limits. |
| CS | Case study | Required for every target touched by the case-study checkpoint. | Required for domain, application, adapters, UI, failures, upgrades, and release paths introduced. | Required for all supported simulator journeys. | Required for every hardware, system-service, performance, energy, and release claim. | Required for primary and recovery journeys. | Required when scale, media, sensors, networking, rendering, launch, energy, or memory affects the product. | Required for product boundary, architecture, privacy, security, operations, distribution, and transfer exercise. |

## Post Assignments

| # | Post | Profile | Required additions |
| ---: | --- | :---: | --- |
| 1 | The Apple development map | OW | Compile and run the CLI anchor; label browser execution as Linux-only. |
| 2 | Xcode, simulators, devices, and Git | OW | Build two named simulator destinations; run one signed build on a named physical device; record the Git commit. |
| 3 | How to learn by building and debugging | OW | Capture the failing assertion, breakpoint, and LLDB diagnosis; verify the corrected test. |
| 4 | Values, variables, types, and inference | SL | No additions beyond the assigned profile. |
| 5 | Operators, expressions, conversion, and overflow | SL | No additions beyond the assigned profile. |
| 6 | Conditions, switches, loops, ranges, and patterns | SL | No additions beyond the assigned profile. |
| 7 | Functions and API shape | SL | No additions beyond the assigned profile. |
| 8 | Optionals and absence | SL | No additions beyond the assigned profile. |
| 9 | Arrays, dictionaries, sets, sequences, and collection cost | SL | No additions beyond the assigned profile. |
| 10 | Strings, characters, Unicode, and formatting | SL | Add Unicode grapheme, locale, formatting, and right-to-left cases. |
| 11 | Structures and value semantics | SL | No additions beyond the assigned profile. |
| 12 | Enumerations, associated values, and pattern matching | SL | No additions beyond the assigned profile. |
| 13 | Classes, identity, inheritance, and type casting | SL | No additions beyond the assigned profile. |
| 14 | Properties, methods, subscripts, initialization, and deinitialization | SL | No additions beyond the assigned profile. |
| 15 | Closures, function types, capture, and higher-order operations | SL | No additions beyond the assigned profile. |
| 16 | Protocols, extensions, and protocol-oriented design | SL | No additions beyond the assigned profile. |
| 17 | Errors, `Result`, throwing APIs, and recovery | SL | No additions beyond the assigned profile. |
| 18 | Generics, associated types, existentials, and opaque types | SL | No additions beyond the assigned profile. |
| 19 | ARC, ownership, capture lists, and memory safety | SL | Prove deallocation and retain-cycle repair; inspect the memory graph manually. |
| 20 | Async and await, tasks, groups, cancellation, and continuations | SL | Cover timeout, cancellation, out-of-order completion, and child-task lifetime. |
| 21 | Actors, global actors, `Sendable`, and data isolation | SL | Compile with Swift 6 strict concurrency; preserve actor-isolation diagnostics. |
| 22 | Property wrappers, result builders, and macros | SL | Preserve macro expansion or generated-code inspection evidence. |
| 23 | Modules, packages, access control, interoperability, and API design | SL | Record package graph, public API review, and Objective-C or C boundary compile evidence. |
| 24 | From app idea to user problem | PD | No additions beyond the assigned profile. |
| 25 | User journeys, tasks, states, and edge cases | PD | No additions beyond the assigned profile. |
| 26 | Information architecture and navigation | PD | No additions beyond the assigned profile. |
| 27 | Interaction design and feedback | PD | No additions beyond the assigned profile. |
| 28 | Visual systems, HIG, typography, color, symbols, and materials | PD | No additions beyond the assigned profile. |
| 29 | Adaptive design for iPhone, iPad, and windows | PD | Use compact iPhone, regular-width iPad, rotation, split view, pointer, and keyboard evidence. |
| 30 | Accessibility, localization, and inclusive product design | PD | Run VoiceOver, largest Dynamic Type, contrast, Reduce Motion, keyboard, Voice Control, and right-to-left review. |
| 31 | SwiftUI's value-view mental model | SU | No additions beyond the assigned profile. |
| 32 | Composition, modifiers, styles, and custom components | SU | No additions beyond the assigned profile. |
| 33 | Layout, safe areas, stacks, grids, frames, and custom layout | SU | Record layout evidence across compact, regular, rotation, safe-area, and largest-text conditions. |
| 34 | Controls, forms, validation, focus, and keyboard behavior | SU | No additions beyond the assigned profile. |
| 35 | State, bindings, source of truth, and view identity | SU | No additions beyond the assigned profile. |
| 36 | Observation, environment, and dependency flow | SU | No additions beyond the assigned profile. |
| 37 | Lists, grids, scrolling, search, selection, and refresh | SU | Measure large-list scrolling and search latency; test stable identity and refresh failure. |
| 38 | Navigation, presentation, alerts, and deep links | SU | No additions beyond the assigned profile. |
| 39 | Async work, loading states, networking, and images | SU | Cover cancellation, retry, cache, offline, slow response, and malformed response. |
| 40 | SwiftData, queries, relationships, migration, and test stores | SU | Pass in-memory and disk round trips plus old-store migration and corruption recovery. |
| 41 | Animation, transitions, gestures, drag and drop, and drawing | SU | Run gesture precedence, Reduce Motion, drag and drop, and device haptic checks where used. |
| 42 | Scenes, windows, adaptive navigation, commands, and platform integration | SU | Run iPad multiwindow, restoration, keyboard command, pointer, and split-view journeys. |
| 43 | Previews, Swift Testing, UI tests, accessibility, and performance | SU | Preserve preview, unit, UI, accessibility, and focused performance artifacts separately. |
| 44 | SwiftUI Field Notes capstone | SU | Pass FN-B01 through FN-B14 and FN-A01 through FN-A08 for the SwiftUI adapter. |
| 45 | UIKit's event-driven mental model and app lifecycle | UK | Record scene and view lifecycle order through launch, background, foreground, and restoration. |
| 46 | Views, controls, configuration, target-action, and delegation | UK | No additions beyond the assigned profile. |
| 47 | Auto Layout, stack views, guides, priorities, and debugging | UK | Capture unsatisfiable-constraint diagnostics and trait, rotation, and largest-text layouts. |
| 48 | View-controller lifecycle, containment, and composition | UK | No additions beyond the assigned profile. |
| 49 | Navigation, tabs, split views, and coordinators | UK | Cover deep links, selected tab, split collapse and expand, and restoration. |
| 50 | Sheets, popovers, alerts, activities, and system pickers | UK | No additions beyond the assigned profile. |
| 51 | Responder chain, gestures, menus, drag and drop, and input | UK | Verify responder, focus, keyboard, gesture, menu, and drag-and-drop paths; use a device for haptics. |
| 52 | Text, forms, keyboards, focus, and validation | UK | No additions beyond the assigned profile. |
| 53 | Table views, reuse, prefetching, and diffable data | UK | Measure reuse and prefetch behavior with a large deterministic collection. |
| 54 | Collection views, compositional layout, cells, and modern configuration | UK | Test diffable identity, compositional layouts, self-sizing, and state restoration. |
| 55 | Scrolling, drawing, layers, animation, transitions, and haptics | UK | Use Instruments and a physical device for scrolling, layers, animation, haptics, and memory where claimed. |
| 56 | Observation, concurrency, networking, and persistence in UIKit | UK | No additions beyond the assigned profile. |
| 57 | Traits, appearance, accessibility, localization, and state restoration | UK | Run trait, appearance, VoiceOver, largest Dynamic Type, localization, and restoration matrices. |
| 58 | UIKit Field Notes capstone | UK | Pass FN-B01 through FN-B14 and FN-A01 through FN-A08 for the UIKit adapter. |
| 59 | Architecture starts with pressure | AR | No additions beyond the assigned profile. |
| 60 | MVC and controller boundaries | AR | No additions beyond the assigned profile. |
| 61 | MVVM and presentation models | AR | No additions beyond the assigned profile. |
| 62 | Unidirectional data flow, reducers, and state machines | AR | No additions beyond the assigned profile. |
| 63 | Domain models, value objects, invariants, and use cases | AR | No additions beyond the assigned profile. |
| 64 | Dependency injection and the composition root | AR | No additions beyond the assigned profile. |
| 65 | Coordinators, routers, deep links, and restoration | AR | No additions beyond the assigned profile. |
| 66 | Repositories, gateways, clients, and ports and adapters | AR | No additions beyond the assigned profile. |
| 67 | Modularization with Swift Package Manager | AR | Verify the package dependency graph and both app schemes from a clean checkout. |
| 68 | Data architecture, source of truth, caching, offline sync, and conflict | AR | Cover offline writes, duplicate delivery, conflict, retry, cache invalidation, and reconstruction. |
| 69 | Concurrency architecture, isolation, cancellation, and lifecycle | AR | Cover actor isolation, cancellation, task lifetime, app lifecycle, and out-of-order completion. |
| 70 | Architecture tests, refactoring seams, decisions, and tradeoffs | AR | Preserve the ADR, dependency-direction review, architecture tests, and before and after evidence. |
| 71 | Testing strategy, seams, and confidence | TQ | Record the risk-to-test map and one deliberately failing proof at each selected test distance. |
| 72 | Swift Testing fundamentals and parameterized tests | TQ | Run Swift Testing parameterized, async, error, tag, and trait examples. |
| 73 | XCTest, XCUITest, test plans, and framework coexistence | TQ | Run XCTest and XCUITest through a shared scheme or test plan and preserve the result bundle. |
| 74 | Deterministic dependencies and concurrency tests | TQ | Use fixed clocks, IDs, seeds, schedulers, continuations, cancellation, and timeout failures. |
| 75 | SwiftUI, UIKit, navigation, accessibility, and UI behavior tests | TQ | Run the shared SwiftUI and UIKit behavior, navigation, accessibility, and lifecycle journeys. |
| 76 | Persistence, migration, networking, and contract tests | TQ | Pass repository, migration, URLProtocol or local-server, malformed-payload, timeout, and retry contracts. |
| 77 | Performance, memory, energy, launch, and device matrices | TQ | Record device, OS, thermal state, baseline, signposts, metrics, leaks, energy, launch, and scrolling results. |
| 78 | CI, flake control, test data, release qualification, and evidence | TQ | Prove the CI matrix, flake policy, valid and invalid fixture boundaries, archive gate, and retained artifacts. |
| 79 | Networking, authentication, real-time events, and resilience | PR | Use a local mock first; add sandbox account and device evidence only for the named auth or real-time service. |
| 80 | Persistence, Core Data, files, caches, migrations, and secure storage | PR | Pass old-store migrations, rollback, file protection, keychain, corruption, and low-storage checks. |
| 81 | Security, privacy, permissions, and platform policy | PR | Run permission denial and change, privacy manifest, redaction, data export or deletion, and device review. |
| 82 | Background work, notifications, deep links, and app extensions | PR | Use a device for push and background claims; cover duplicate routes, expiry, interruption, and disabled capability. |
| 83 | Logging, analytics, crashes, privacy, and feature flags | PR | Prove redaction and schema contracts; inspect release logging, crash symbols, consent, and feature-flag recovery. |
| 84 | Instruments, responsiveness, energy, launch, and networking | PR | Record Instruments and physical-device baselines for launch, hangs, memory, energy, and networking. |
| 85 | Build settings, signing, entitlements, CI, dependencies, and release configuration | PR | Build, test, archive, and inspect signing, entitlements, dependencies, configurations, and exported artifacts. |
| 86 | TestFlight, App Store review, launch, observability, and evolution | PR | Use App Store Connect and TestFlight accounts; run upgrade, rollback, smoke, observability, and review-readiness checks. |
| 87 | One product across Apple platforms | CA | Build each named platform target and manually review shared versus platform-specific product behavior. |
| 88 | iPadOS, multitasking, pointer, keyboard, Pencil, and documents | CA | Use named iPad simulator and device checks for multitasking, pointer, keyboard, Pencil, and documents. |
| 89 | macOS with SwiftUI | CA | Build and run a named macOS destination; review windows, commands, menus, keyboard, and accessibility. |
| 90 | AppKit, Mac Catalyst, and framework choice | CA | Build AppKit and Catalyst variants; record framework-choice pressures and platform behavior differences. |
| 91 | watchOS app structure and Watch connectivity | CA | Use watch simulator plus a paired physical watch and iPhone for connectivity claims. |
| 92 | Workouts, complications, Smart Stack, and watch constraints | CA | Use a physical watch for workout, complication, Smart Stack, background, battery, and sensor evidence. |
| 93 | tvOS focus, remote input, shelves, and navigation | CA | Use tvOS simulator and Apple TV remote or device evidence for focus, restoration, and input claims. |
| 94 | AVKit, AVFoundation, playback, streaming, and media sessions | CA | Use device media sessions; cover interruption, route change, remote commands, subtitles, stalls, and recovery. |
| 95 | visionOS windows, volumes, ornaments, and spatial input | CA | Use visionOS simulator for layout and a physical Vision Pro for comfort, input, and tracking claims. |
| 96 | RealityKit, ARKit, immersive spaces, comfort, and assets | CA | Use a physical Vision Pro for tracking, comfort, rendering, asset, collision, and performance claims. |
| 97 | WidgetKit and Live Activities | CA | Run widget timelines in simulator and Live Activities, push, lock-screen, and energy behavior on a device where required. |
| 98 | App Intents, Shortcuts, Spotlight, and system actions | CA | Run App Intents, Shortcuts, Spotlight, Siri, parameter, denial, and deep-link journeys on supported destinations. |
| 99 | CloudKit, iCloud containers, sharing, and sync | CA | Use a CloudKit development container and account; cover conflict, quota, offline, sharing, and unavailable-account states. |
| 100 | MapKit, Core Location, geocoding, and WeatherKit | CA | Use deterministic location adapters plus a device for permission, accuracy, background, and route behavior. |
| 101 | Camera, PhotoKit, image pipelines, and Vision | CA | Use deterministic media fixtures plus a device for camera, real library, limited access, memory, and privacy behavior. |
| 102 | Audio, speech, recording, and interruptions | CA | Use a physical device for microphone, route, interruption, permission, background, and latency claims. |
| 103 | Video capture, editing, playback, and streaming architecture | CA | Use device capture and playback; measure dropped frames, memory, storage, interruption, export, and degraded network. |
| 104 | Core Bluetooth, nearby interaction, accessories, and connectivity | CA | Use named accessories or peer hardware; cover permissions, disconnects, unsupported hardware, background, and radio limits. |
| 105 | HealthKit, WorkoutKit, and health-data design | CA | Use HealthKit development data, a physical iPhone and watch, required entitlements, provenance, denial, and deletion checks. |
| 106 | Core ML, Vision, Natural Language, and on-device intelligence | CA | Use fixed model fixtures and device performance, memory, privacy, fallback, and unsupported-hardware evidence. |
| 107 | StoreKit, subscriptions, offers, and entitlement state | CA | Use StoreKit configuration first, then sandbox account evidence for purchase, pending, restore, revoke, refund, and offline state. |
| 108 | Apple Pay, passes, Wallet, and transaction UX | CA | Use sandbox merchant or pass configuration, required entitlements, and a physical device; separate physical-goods and digital-goods rules. |
| 109 | Games, GameKit, SpriteKit, SceneKit, and Metal choices | CA | Use named device performance evidence for the selected game framework; cover input, pause, memory, frame pacing, and accessibility. |
| 110 | Home, Matter, CarPlay, files, collaboration, and specialized extensions | CA | Name every entitlement, account, vehicle, home, file, or collaboration requirement; unavailable restricted capabilities remain Not verified. |
| 111 | Atlas Desk discovery and release boundary | CS | No additions beyond the assigned profile. |
| 112 | Atlas Desk domain and architecture | CS | No additions beyond the assigned profile. |
| 113 | Atlas Desk SwiftUI phone and tablet app | CS | No additions beyond the assigned profile. |
| 114 | Atlas Desk storage, search, files, and sync | CS | No additions beyond the assigned profile. |
| 115 | Atlas Desk macOS product design | CS | No additions beyond the assigned profile. |
| 116 | Atlas Desk quality and release review | CS | Build iPhone, iPad, and macOS targets; pass release, migration, accessibility, performance, and signed distribution review. |
| 117 | PulseTrail product, safety, and privacy | CS | Record safety, privacy, consent, emergency, and data-minimization review before health capability work. |
| 118 | PulseTrail cross-device architecture | CS | No additions beyond the assigned profile. |
| 119 | PulseTrail HealthKit, WorkoutKit, maps, and location | CS | Use a physical iPhone and watch for HealthKit, WorkoutKit, maps, location, entitlement, sensor, and provenance evidence. |
| 120 | PulseTrail watch UI, complications, widgets, and Live Activities | CS | Use watch, widget, complication, and Live Activity device evidence with accessibility and energy review. |
| 121 | PulseTrail offline, battery, sync, and failure recovery | CS | Measure battery and recovery on devices; cover offline recording, duplicate sync, conflict, and interrupted transfer. |
| 122 | PulseTrail testing and release review | CS | Pass cross-device, safety, privacy, accessibility, performance, energy, upgrade, and release qualification. |
| 123 | ScreenRoom product and content model | CS | No additions beyond the assigned profile. |
| 124 | ScreenRoom tvOS architecture and focus | CS | Use tvOS simulator and Apple TV device evidence for focus restoration, remote input, shelves, and profiles. |
| 125 | ScreenRoom playback and media lifecycle | CS | Use device playback evidence for media sessions, subtitles, interruptions, progress, stalls, and remote commands. |
| 126 | ScreenRoom backend, auth, subscriptions, and downloads | CS | Use local service contracts, StoreKit configuration, sandbox account, auth expiry, pagination, entitlement, and download failure evidence. |
| 127 | ScreenRoom performance, accessibility, and resilience | CS | Profile device scrolling and playback under degraded network; run subtitle, focus, VoiceOver, and resilience checks. |
| 128 | ScreenRoom testing and release review | CS | Pass focus, playback, purchase, account, download, accessibility, performance, and release qualification. |
| 129 | NeighborLink product, trust, and moderation | CS | No additions beyond the assigned profile. |
| 130 | NeighborLink architecture, identity, and API contracts | CS | No additions beyond the assigned profile. |
| 131 | NeighborLink UIKit feed, search, forms, camera, and maps | CS | Use device camera and location evidence; test UIKit reuse, search, forms, permissions, media memory, and maps. |
| 132 | NeighborLink chat, offline writes, push, and deep links | CS | Use local real-time mocks plus device push and deep-link evidence; cover order, duplicates, retry, reconnect, and offline outbox. |
| 133 | NeighborLink payments, privacy, security, and moderation operations | CS | Use sandbox Apple Pay for physical goods; verify authorization, privacy, moderation, retention, and audit contracts. |
| 134 | NeighborLink quality and release review | CS | Run hostile-input, role-change, moderation, load, degraded-service, accessibility, security, and release review. |
| 135 | SpacePlanner product, comfort, and spatial design | CS | Complete physical Vision Pro comfort and accessibility planning before immersive implementation. |
| 136 | SpacePlanner architecture and asset pipeline | CS | No additions beyond the assigned profile. |
| 137 | SpacePlanner windows, volumes, immersion, and input | CS | Use visionOS simulator plus physical Vision Pro input, transition, comfort, exit, and recovery evidence. |
| 138 | SpacePlanner RealityKit, ARKit, interaction, and rendering | CS | Use physical Vision Pro tracking and performance evidence for RealityKit, ARKit, collisions, gestures, lighting, and rendering. |
| 139 | SpacePlanner persistence, collaboration, performance, and accessibility | CS | Measure large assets and collaboration on device; cover conflict, tracking loss, captions, alternative input, and recovery. |
| 140 | SpacePlanner testing and release review | CS | Pass domain, simulator, physical-device interaction, tracking-loss, frame performance, comfort, accessibility, archive, and release review. |

## Evidence Record

Use one record per post checkpoint:

```text
Post:
Commit:
Toolchain and language mode:
SDK and deployment target:
Compile commands and results:
Automated test commands and results:
Simulator destinations and journeys:
Physical devices and journeys:
Accessibility evidence:
Performance evidence:
Manual review:
Accounts, permissions, entitlements, and services:
Not verified boundaries:
Artifact paths:
```

## Maintenance

Update the assignment before a post changes scope. Update a profile only when the same evidence rule should change for every post using it. A new capability-specific requirement belongs in the post row, not in a broad profile that would create false work elsewhere.
