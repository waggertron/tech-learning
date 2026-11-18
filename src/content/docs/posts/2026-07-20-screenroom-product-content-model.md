---
title: "ScreenRoom: a product design brief"
description: "A television catalog and playback design with separate focus, access, player, and progress lifetimes."
date: 2026-07-20
tags: [ios, swift, case-study, screen]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-20-screenroom-product-content-model/
---

A viewer selects a title, starts playback, leaves, and returns to the correct position. The catalog may refresh while playback continues. The first useful result is a stable playback session and a recoverable return to the selected catalog item.

This is a design brief and project assignment. It does not describe a completed application.

## One useful vertical slice

Use a local catalog and one known media fixture. Implement selection, loading, playing, paused, failed, and ended states, plus a stored resume position. Defer subscriptions, downloaded media, account linking, and recommendation services until that lifecycle works.

## Model the durable state

```text
CatalogItem(id, mediaReference)
Profile(id) -> PlaybackProgress(profileID, itemID, position)
PlaybackSession(id, itemID, status)

selected -> loading -> playing -> paused -> playing -> ended
                |          |
                +-> failed <-+-> interrupted
```

The player belongs to a stable session coordinator. A catalog cell only emits selection. Progress is keyed by profile and title, not by the index of a shelf row. Access is a separate decision that can change while a title remains in the catalog.

## Compare the main alternatives

Begin with system playback controls unless the product requires custom behavior they cannot supply. A custom overlay adds focus, subtitles, accessibility, interruption, and command-routing obligations. Store progress on meaningful events and a bounded interval; writing on every frame adds unnecessary work without improving recovery proportionally.

## Walk through a failure

When a stream stalls, keep the selected title and last confirmed position. Distinguish buffering from an unrecoverable failure and provide a retry path. When a shelf refresh removes the focused item, choose a nearby valid focus destination. When an account or profile changes, reconcile access and progress rather than reuse the previous profile's state.

## Acceptance scenarios

1. Refresh the catalog while playing and verify that the session is not recreated.
2. Pause, relaunch, and resume the same profile/title within the documented position policy.
3. Simulate stall, failure, retry, and interruption without losing selected identity.
4. Navigate with a remote and subtitles enabled, then verify an accessible return to the catalog.

A deterministic model test can prove transition and identity rules. The platform adapter then needs its own interface, permission, interruption, and integration checks. Keep evidence tied to the actual target and destination rather than treating a design review as an executed feature.

## Implementation boundary

No ScreenRoom app target, service integration, account transaction, or hardware journey is supplied by this brief. Use the [Field Notes capstone](../2026-07-19-swiftui-field-notes-capstone/) for the implemented notebook path. Build this assignment only when its distinct user task justifies the extra platform and validation cost.

## References

- [AVKit](https://developer.apple.com/documentation/avkit) documents the central framework boundary for this assignment.
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) provides platform interaction and accessibility guidance.

## Related topics

- [Apple platform selection](../2026-07-19-one-product-across-apple-platforms/)
- [Apple capability selection](../2026-07-19-widgetkit-live-activities/)

[Series reading guide](../series/zero-to-ios-hero/)
