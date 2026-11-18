---
title: "iOS production readiness: storage, privacy, and release"
description: "A decision guide for durable storage, permission failures, private diagnostics, signing, and recoverable releases."
date: 2026-07-19
tags: [ios, swift, persistence, swiftdata, core-data, keychain]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-persistence-core-data-files-caches-migrations-secure-storage/
---

A note appearing in a list does not prove it will survive relaunch. A successful archive does not prove it has the intended entitlements. Production readiness means attaching a specific claim to an observable check.

This is a reference guide for reviewing an iOS release. The [SwiftData lesson](../2026-07-19-swiftui-swiftdata-queries-relationships-migration-test-stores/) handles persistence implementation; the [Field Notes capstone](../2026-07-19-swiftui-field-notes-capstone/) connects the app loop.

## Storage: decide what loss means

| Data | Candidate | Failure policy |
| --- | --- | --- |
| searchable note records | file-backed repository, SwiftData, or Core Data | preserve the last valid store and show recovery |
| large attachments | separately owned files | clean up only after the record transaction is settled |
| derived thumbnails | bounded cache | evict and regenerate without changing the note |
| small display preferences | user defaults | choose a documented fallback |
| secrets | Keychain | handle unavailable or denied access explicitly |

The choice follows the access pattern. A small notebook can use an atomic file snapshot. Indexed queries, relationships, and growing datasets may justify a model store. A cache cannot become the only durable copy merely because it is convenient to read.

For a schema change, keep a real old-format fixture. Open it through the migration path, then compare stable IDs, titles, relationships, and record counts. A successful empty-store launch proves none of those preservation properties. Failure should preserve the original store rather than silently replace it with an empty one.

## Permissions: preserve the core task

Field Notes can save text without location or photos. Request optional access when the person chooses the corresponding action. Denial leaves a useful path: save without the attachment or location, explain the missing context, and let the person retry deliberately.

Review purpose strings, entitlements, data collection, retention, export, and deletion against the actual shipped feature. A dependency may introduce data practices or required-reason API use even when the app does not call the API directly. Follow Apple's [privacy manifest documentation](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files) rather than copying a generic manifest.

## Diagnostics: retain the event, exclude the note

A useful save-failure event contains an operation name, error category, app version, and correlation ID. It does not need the title, body, location, attachment bytes, or a credential. Test the serialized event with deliberately distinctive private fixture text and assert that the private fields are absent.

Separate crash reporting from analytics. Crash symbols answer where execution failed; product events answer how a flow behaves. Define collection and retention for each. A feature flag needs a safe default, an owner, and a removal condition. Changing the UI flag never substitutes for authorization at the data boundary.

## Build and signing: inspect the artifact

Keep development, test, and release configuration differences explicit. Inspect the built bundle's identifier, minimum OS, entitlements, embedded resources, and configuration. Check that test launch modes and sample stores cannot accidentally become the normal release path.

Code signing associates an artifact with a distribution identity. It does not prove that navigation, accessibility, migration, or save recovery works. Run those checks against the intended build configuration, then inspect the archive using the [distribution workflow](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases).

## Release: rehearse an upgrade and a recovery

Use a previous release's store, install the candidate, perform an edit, relaunch, and retrieve it. Review TestFlight feedback against named journeys. Record build, destination, fixture, expected behavior, observed result, and unresolved failure.

Rolling back a binary does not automatically roll back its database. If a newer schema is unreadable by the older app, a release rollback needs a compatibility strategy. Preserve backups and define the supported version boundary before rollout.

## Review one claim at a time

For “notes survive an update,” require an old-store upgrade test. For “location denial is harmless,” run the denied journey. For “launch meets the budget,” require a supported-device measurement using the [performance procedure](../2026-07-19-ios-performance-memory-energy-launch-device-matrices/). Keep account, signing, Simulator, and hardware checks distinct.

This guide describes decisions and checks. It does not report an App Store submission, signed archive, Keychain operation, or device performance run.

## References

- [Preserving your app's model data across launches](https://developer.apple.com/documentation/swiftdata/preserving-your-apps-model-data-across-launches) explains the persistence boundary.
- [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources) explains permission requests.
- [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files) and [distribution](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases) support the release review.

## Related topics

- [Background work and interruption](../2026-07-19-ios-background-work-notifications-deep-links-app-extensions/)
- [Field Notes capstone](../2026-07-19-swiftui-field-notes-capstone/)

[Series reading guide](../series/zero-to-ios-hero/)
