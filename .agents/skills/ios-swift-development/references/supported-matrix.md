# Supported Apple Development Matrix

Frozen on 2026-07-13. Refresh this file whenever a stable Xcode release changes, before the first app post, and before a release-focused batch.

## Stable Baseline

| Surface | Supported baseline | Reason |
| --- | --- | --- |
| Xcode | 26.6, build 17F113 | Current stable release on 2026-07-13 |
| Swift compiler | 6.3.3 | Included in Xcode 26.6 and current stable Swift patch |
| Swift language mode | Swift 6 | Makes current concurrency checking part of the course baseline |
| iOS SDK | 26.5 | Included with Xcode 26.6 |
| iOS deployment target | iOS 17.0 | Oldest release supporting Observation and SwiftData course examples |
| iPadOS deployment target | iPadOS 17.0 | Matches the shared core path and modern data examples |
| App Store submission SDK | iOS and iPadOS 26 or later | Apple requirement effective 2026-04-28 |
| Host macOS | macOS Tahoe 26.2 or later | Required by Xcode 26.6 |

Treat watchOS, tvOS, macOS, and visionOS deployment targets as capability-specific decisions in the ecosystem atlas. Do not copy the iOS floor without checking the framework and product goal.

## Simulator Destinations

- **Primary iPhone**: A current iPhone device type on the iOS 26.5 simulator runtime.
- **Compatibility iPhone**: A compact iPhone device type on the earliest installed iOS 17.x runtime.
- **Adaptive iPad**: A current iPad device type on iPadOS 26.5 for split view, pointer, keyboard, and size-class checks.
- **Additional platforms**: Add a named destination only when the lesson uses that platform.

Resolve exact installed names with `xcrun simctl list devices available` and `xcodebuild -showdestinations`. Record the resolved names in validation evidence rather than assuming one device catalog.

## Physical Device Requirements

Use a physical iPhone or iPad for evidence involving:

- Camera capture, real photo libraries, sensors, haptics, and biometric enrollment.
- Push notification token registration and remote delivery.
- Background execution opportunities, thermal behavior, energy, and realistic performance.
- Universal links, associated domains, Bluetooth, nearby interaction, and hardware accessories.
- Capabilities whose documentation or behavior differs from Simulator.

Service chapters may also require an Apple Developer Program membership, signing team, registered App ID, App Store Connect configuration, sandbox account, server component, or entitlement approval. Label each requirement before the exercise.

## Beta Track

Xcode 27 beta, Swift 6.4, and iOS, iPadOS, macOS, watchOS, tvOS, and visionOS 27 are excluded from baseline examples. Discuss them only in clearly marked previews that compile separately from the stable course path.

Do not raise the stable deployment target or rewrite stable examples to adopt a beta-only API.

## Current Local Evidence

The development machine checked on 2026-07-13 has macOS 26.5.1 and Apple Swift 6.3.2 through `/Library/Developer/CommandLineTools`. Full Xcode and simulator runtimes are not installed or selected.

This machine can validate standalone Swift and Swift packages that remain compatible with Swift 6.3.2. It cannot yet provide Xcode 26.6, Swift 6.3.3, iOS SDK, scheme, simulator, signing, archive, or device evidence. Install and select full Xcode 26.6 before app-target validation.

## Primary Sources

- [Xcode support matrix](https://developer.apple.com/support/xcode/)
- [Xcode 26.6 release](https://developer.apple.com/news/releases/?id=06252026a)
- [Xcode 26.6 release notes](https://developer.apple.com/documentation/xcode-release-notes/xcode-26_6-release-notes)
- [Swift 6.3.3 announcement](https://forums.swift.org/t/announcing-swift-6-3-3/87888)
- [App Store submission requirements](https://developer.apple.com/app-store/submitting/)
