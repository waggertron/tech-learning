# ADR: Field Notes Companion Workspace

**Date:** 2026-07-16
**Status:** Accepted for the series workspace; iOS target validation awaits full Xcode
**Decision owner:** Zero to iOS Hero program

## Problem

The Zero to iOS Hero series needs one companion workspace that can evolve from command-line Swift into two feature-equivalent iOS apps. The shared core must compile and test without an iOS runtime. The SwiftUI and UIKit adapters must remain separate enough to teach each framework's mental model while exercising the same product contract.

The repository currently has Apple Swift 6.3.2 through Command Line Tools. It does not have full Xcode, iOS SDKs, simulator runtimes, XcodeGen, or Tuist installed. The workspace design therefore needs to separate evidence we can collect now from evidence that requires the supported Xcode 26.6 environment.

## Decision Drivers

- Keep domain and application code independent of SwiftUI, UIKit, persistence frameworks, and network clients.
- Compile and test the shared package with Swift Package Manager on the current machine.
- Declare SwiftUI, UIKit, unit-test, and UI-test targets from one reviewable source.
- Keep generated project files out of Git to avoid opaque merge conflicts.
- Use deterministic fixtures and local in-memory adapters before cloud or account-backed services.
- Keep the iOS 17.0 deployment floor and Swift 6 language mode visible.
- Preserve honest package, simulator, device, accessibility, performance, signing, and entitlement evidence.
- Let later posts add checkpoints without reconstructing a project by hand.

## Options

### Option A: Check in a hand-maintained Xcode project

Xcode can create and maintain the app targets directly. This has no extra generator dependency and is familiar to readers.

The project file is large, identifier-heavy, and difficult to review without Xcode. Adding two apps and four test bundles by hand would also make early work depend on a full Xcode installation that is not present on the current machine.

**Disposition:** Rejected as the source of truth. A generated project remains available locally for readers who want the normal Xcode interface.

### Option B: Swift Package Manager only

Swift Package Manager is the right boundary for the shared core, deterministic fixtures, and command-line checkpoints. It supports repeatable `swift build` and `swift test` evidence without an iOS runtime.

It does not replace Xcode application targets, schemes, simulator destinations, signing, asset catalogs, UI-test bundles, or archives. A package-only workspace would leave the SwiftUI and UIKit paths implicit.

**Disposition:** Selected for the shared core, rejected as the complete workspace.

### Option C: XcodeGen project specification plus a local Swift package

XcodeGen generates an Xcode project from a YAML specification, supports local Swift package products, application targets, test bundles, and shared schemes. Version 2.45.4 is the frozen generator baseline for this workspace. The generated project is disposable; the specification, source directories, and package manifest remain reviewable.

This adds one development tool and requires full Xcode before the app schemes can be compiled or tested. Generator output may change after upgrades, so the baseline must move deliberately and regenerate cleanly.

**Disposition:** Selected.

### Option D: Tuist-managed workspace

Tuist provides a broader project-description and automation system. That power is useful for large modular apps, but it adds concepts and maintenance that the first Field Notes checkpoints do not need.

**Disposition:** Rejected for the initial workspace. Revisit only when the project develops a pressure that the smaller specification cannot handle.

## Decision

Create `companion/field-notes/` with these boundaries:

```text
┌─────────────────────────────────────────────────────────┐
│ FieldNotesSwiftUI        FieldNotesUIKit                │
│ SwiftUI driving adapter  UIKit driving adapter          │
└───────────────────────┬─────────────────────────────────┘
                        │ user intent and presentation data
                        v
┌─────────────────────────────────────────────────────────┐
│ Packages/FieldNotesCore                                 │
│ domain values, use cases, purpose-named ports           │
└───────────────────────┬─────────────────────────────────┘
                        │ repository operations
                        v
┌─────────────────────────────────────────────────────────┐
│ In-memory adapter now, persistence and network later    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ FieldNotesTestSupport                                   │
│ fixed IDs, dates, notes, failures, and local fixtures   │
└─────────────────────────────────────────────────────────┘
```

`Packages/FieldNotesCore` owns the package manifest, shared library, command-line executable, deterministic test-support product, and package tests. Neither the domain nor application code imports SwiftUI or UIKit.

`project.yml` declares the SwiftUI app, UIKit app, app unit tests, UI tests, and shared schemes. Both apps depend on the same local `FieldNotesCore` product. Tests may additionally depend on `FieldNotesTestSupport`. Production app targets do not.

The generated `FieldNotes.xcodeproj` is ignored. XcodeGen 2.45.4 is the accepted baseline, and generator upgrades require a clean regeneration plus both app schemes passing their focused build and test commands.

## Evidence Boundary

The current machine can provide:

- **Compiled:** `FieldNotesCore` and `FieldNotesCLI` with Apple Swift 6.3.2.
- **Package tested:** shared domain, application, in-memory adapter, and deterministic fixture tests through Swift Testing. The workspace wrapper supplies toolchain-owned framework and macro-plugin paths omitted by the selected Command Line Tools installation.
- **Not verified:** XcodeGen generation, Xcode app target compilation, simulator behavior, UI tests, signing, archives, accessibility inspection, performance, and device behavior.

After full Xcode 26.6 and XcodeGen 2.45.4 are available, the gate requires:

1. Generate `FieldNotes.xcodeproj` from a clean checkout.
2. Build both schemes for a named iOS 26.5 simulator destination with signing disabled.
3. Run both unit and UI-test bundles and preserve result bundles.
4. Run the shared behavior and accessibility journeys against each app.
5. Record any physical-device requirement separately. Simulator success never closes a device requirement.

## Consequences

Positive consequences:

- Language posts can compile and test before app development begins.
- SwiftUI and UIKit remain driving adapters over one product contract.
- Deterministic fixtures and local mocks are available without credentials or external services.
- The project definition is small enough to review in a post checkpoint.
- Generated Xcode identifiers and ordering do not create source-control noise.

Costs and limits:

- Contributors need XcodeGen in addition to Xcode for app work.
- The generated project is not validated on the current machine.
- XcodeGen is a third-party development dependency and needs deliberate upgrades.
- Some readers may first meet a generated project before learning manual target creation in post 2, so that post must explain both the Xcode concept and this repository's reproducible source of truth.

## References

- [XcodeGen project and installation](https://github.com/yonaskolb/XcodeGen)
- [XcodeGen project specification](https://github.com/yonaskolb/XcodeGen/blob/2.45.4/Docs/ProjectSpec.md)
- [Swift Package Manager](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/)
- [Adding package dependencies to an Xcode app](https://developer.apple.com/documentation/xcode/adding-package-dependencies-to-your-app)

## Revisit Triggers

Revisit this decision when XcodeGen cannot express a required target or build setting, generated projects drift across the supported toolchain, the companion code moves to its own repository, case-study work needs many independently versioned modules, or Xcode gains a smaller reviewable project format that removes the generator's value.
