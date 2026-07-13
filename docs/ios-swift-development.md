# iOS and Swift Development Authoring

The Zero to iOS Hero program uses one reusable skill and a versioned reference set to keep Apple platform content current, testable, and explicit about evidence.

## Source of Truth

- Execution plan: `docs/plans/2026-07-13-zero-to-ios-hero-series-plan.md`
- Skill workflow: `.agents/skills/ios-swift-development/SKILL.md`
- Focused references: `.agents/skills/ios-swift-development/references/`
- Stable matrix: `.agents/skills/ios-swift-development/references/supported-matrix.md`
- Validation commands: `.agents/skills/ios-swift-development/references/validation.md`

The plan owns scope and completion gates. The skill owns the repeatable authoring and review process. The references own details that change by framework, toolchain, or platform.

## Stable Baseline

The first frozen baseline is Xcode 26.6 with Swift 6.3.3 in Swift 6 language mode. The core iOS and iPadOS path deploys to version 17.0 because the curriculum relies on Observation and SwiftData.

Xcode 27, Swift 6.4, and the version 27 operating systems are beta-only. Preview material cannot replace or break the stable course path.

Apple requires iOS and iPadOS submissions to use the version 26 SDK or later as of 2026-04-28. The submission SDK requirement does not raise the course deployment floor.

## Authoring Workflow

1. Read the series plan, target content, adjacent entries, and the main skill.
2. Load only the focused references needed by the task.
3. Refresh current claims from Apple Developer Documentation, Swift.org, Swift Evolution, release notes, or App Store documentation.
4. Record compiler, language mode, SDK, deployment target, destination, permissions, entitlements, account needs, and device needs.
5. Build the smallest executable code anchor and test its behavior at the lowest useful distance.
6. Add simulator, physical-device, service-account, accessibility, and performance evidence only where the lesson needs it.
7. Run content validation and `npm run build` after the batch.

## Evidence Vocabulary

- **Compiled**: The named target compiled with the recorded compiler and settings.
- **Package tested**: Swift package tests passed.
- **Simulator tested**: The named flow passed on a recorded simulator runtime.
- **Device tested**: The named flow passed on recorded physical hardware.
- **Account tested**: A service integration passed with its sandbox or development service.
- **Not verified**: A required tool, runtime, device, entitlement, account, or network was unavailable.

A preview is visual development feedback. It is not simulator, device, accessibility, or performance evidence by itself.

## Local Machine Boundary

On 2026-07-13, the local machine had macOS 26.5.1 and Swift 6.3.2 from Command Line Tools. It did not have full Xcode selected or simulator runtimes installed.

The current environment can compile standalone Swift and compatible Swift packages. It cannot validate iOS app schemes, simulator behavior, signing, archives, entitlements, or physical-device behavior until full Xcode 26.6 is installed and selected.

## Updating the Matrix

Refresh the matrix when:

- Apple ships a stable Xcode release.
- Swift ships a stable patch used by Xcode.
- App Store Connect changes submission requirements.
- A course example needs an API newer than the deployment floor.
- The first app post or a release-focused batch begins.

Update primary-source review dates, validate representative language and app examples, then record the change in `docs/feature_tracker.md`. Keep beta notes separate until the toolchain becomes stable.

## Gate 0 Challenge Record

The initial skill challenge ran four realistic tasks in isolated agent sessions on 2026-07-13:

| Challenge | Outcome | Skill change |
| --- | --- | --- |
| Beginner Swift outline about optionals and absence | Produced a staged lesson, runnable standard-library anchor, misconceptions, primary sources, and local compiler evidence that clearly stopped short of iOS claims. | Added an explicit `-swift-version 6` validation rule and temporary cache guidance for managed environments. |
| SwiftUI review | Found duplicated derived state, view-lifetime misuse, unstable index identity, missing blank normalization, and a reachable empty state. | Added guidance for user-authored text as data. Existing state, identity, lifecycle, and accessibility rules covered the remaining findings. |
| UIKit review | Found one-time frame layout, missing cell reuse, exposed mutable state, and unclear model-update coordination. | Added direct Auto Layout, registration, and dequeue rules. Existing main-actor, identity, and accessibility rules covered the remaining findings. |
| Field Notes test plan | Covered local photo persistence, optional and denied location, offline creation, relaunch, later sync, idempotency, cancellation, orphan cleanup, UI behavior, accessibility, and physical-device limits. | Added explicit valid versus invalid fixture rules, transactional cleanup, reconstruction, retry, acknowledgement, and local artifact cleanup guidance. |

The challenge found no beta leakage, credential risk, device-evidence overclaim, or framework bias. The revisions make the validation and failure-state contracts more precise.
