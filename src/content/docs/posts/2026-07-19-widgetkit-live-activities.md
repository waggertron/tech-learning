---
title: "Choosing Apple capabilities by the user problem"
description: "Choose system actions, cloud sync, media, nearby hardware, health, commerce, and graphics from concrete product needs."
date: 2026-07-19
tags: [ios, watchos, widgetkit, activitykit, widgets]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-widgetkit-live-activities/
---

A framework name is not a feature requirement. “Add CloudKit” leaves unanswered which edits are authoritative, how conflicts recover, and what happens when the account changes. Start with the user-visible result and compare the smallest capability that can deliver it.

## Glanceable information and system actions

Use a widget for a useful projection that remains understandable between updates. Consider a Live Activity when the person follows a bounded ongoing event. Neither is a second always-running application process. Choose the stale-data wording and tap destination before designing the visual treatment.

App Intents can expose a stable application action outside the main interface. “Favorite this note” needs an identifiable note, the same validation as the in-app command, and a clear response if that note was deleted. Search and shortcut surfaces should not acquire a separate copy of the product rules.

## Sync and place context

| Need | Candidate | Avoid adopting it for | Failure to design first |
| --- | --- | --- | --- |
| personal Apple-account data across devices | CloudKit-backed sync | a generic cross-platform public backend | account change, conflict, offline edits |
| show records on a map | MapKit | obtaining location authorization | missing or stale coordinates |
| obtain current device location | Core Location | forcing a user to enable access before saving text | denial, reduced precision, unavailable fix |
| weather context | WeatherKit | making notebook save depend on a remote answer | stale observation, quota/service failure |

Local persistence and cloud synchronization solve different problems. A durable local edit can remain pending for transfer. Preserve identity and an explicit conflict policy rather than replacing local data whenever a network response arrives. Apple's [CKSyncEngine discussion](https://developer.apple.com/videos/play/wwdc2023/10188/) explains the distinction between application-specific changes and system-managed synchronization scheduling.

## Photos, camera, audio, and video

Choose system selection when a person only needs to attach existing media. Choose direct capture when control over recording is central to the task. Media creates a second lifetime: draft attachments may exist before a durable record owns them, and cancelled work needs cleanup.

Bound decoding and thumbnail work. A library of original images cannot safely become an unbounded collection of decoded images in memory. Audio and video also need explicit interruption, route, progress, and resume behavior. Test fixtures can establish transformation rules; real capture and hardware performance need separate evidence.

## Nearby devices and health

Bluetooth and nearby interaction serve different distance, discovery, and accessory problems. Before selecting either, define peer identity, message framing, reconnect policy, unsupported-device behavior, and cancellation. A connection icon alone does not establish that a command reached the accessory.

Health data requires meaningful units, provenance, and minimal access. A workout session needs a clear owner and interruption policy. The [PulseTrail brief](../2026-07-20-pulsetrail-product-safety-privacy/) focuses on recovering a bounded recording session without treating a consumer app as emergency equipment.

## Intelligence, purchases, and graphics

On-device inference needs fixed evaluation inputs, model version, accuracy/fallback criteria, memory and latency budgets. Naming Core ML, Vision, or Natural Language does not establish that an output is trustworthy. Compare a simple deterministic rule first when it can solve the problem.

For a subscription, distinguish the purchase interaction from durable access. Model pending, failed, verified, expired, and revoked states. Reconcile access from verified transaction information, including changes that occur outside the current purchase screen. Apple's [current entitlements](https://developer.apple.com/documentation/storekit/transaction/currententitlements) and [transaction updates](https://developer.apple.com/documentation/storekit/transaction/updates) document those separate inputs. Apple Pay, passes, and digital-content purchases have different contracts; verify the applicable distribution rules for the intended product and region before choosing a payment path.

For games, choose from actual mechanics: a 2D scene, a 3D scene, multiplayer/account services, and custom rendering are different requirements. Do not select a low-level renderer before measuring a limitation in the simpler presentation.

## Specialized extensions

Home/Matter, CarPlay, file providers, document collaboration, and other extensions introduce their own targets, entitlements, lifecycle, and eligibility. A specialization is justified when it improves a task the main app cannot serve well. Name the required access and unavailable-state behavior before investing in the adapter.

## Evaluate one candidate

For any proposed integration, write six answers: user result, smallest input/output contract, durable owner, denied/unavailable path, local deterministic test, and account/hardware check. If the feature is still described only as a framework name, the product boundary is not ready.

This is a selection reference. It does not claim executed integrations for the listed capabilities.

## References

- [WidgetKit](https://developer.apple.com/documentation/widgetkit) and [App Intents](https://developer.apple.com/documentation/appintents) cover external presentation and actions.
- [CKSyncEngine](https://developer.apple.com/videos/play/wwdc2023/10188/) covers synchronization scheduling and application responsibilities.
- [Transaction entitlements](https://developer.apple.com/documentation/storekit/transaction/currententitlements) and [updates](https://developer.apple.com/documentation/storekit/transaction/updates) cover purchase-state inputs.

## Related topics

- [Apple platform selection](../2026-07-19-one-product-across-apple-platforms/)
- [Production readiness](../2026-07-19-ios-persistence-core-data-files-caches-migrations-secure-storage/)

[Series reading guide](../series/zero-to-ios-hero/)
