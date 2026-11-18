---
title: "PulseTrail: a product design brief"
description: "An offline outdoor session recorder with explicit ownership, consent, and recovery boundaries."
date: 2026-07-20
tags: [ios, swift, case-study, pulse]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-20-pulsetrail-product-safety-privacy/
---

A walker wants a recoverable record of an outdoor session even when the phone and watch are disconnected. The product is a recording aid. It is not emergency equipment, a navigation guarantee, or a clinical measurement system.

This is a design brief and project assignment. It does not describe a completed application.

## One useful vertical slice

Record a start, pause, resume, and finish sequence with a stable session ID. Store a small sequence of timestamped samples locally and display an honest gap when capture is unavailable. Prove recovery before adding maps, achievements, cloud sharing, or continuous cross-device control.

## Model the durable state

```text
idle -> recording -> paused -> recording -> finished
             |                       |
             +-> interrupted --------+

Session(id, ownerDevice, status, lastSequence)
    +-> Sample(sessionID, sequence, time, value, unit, provenance)
```

One device owns the session's transitions. The other may send commands, but delayed commands carry identity and sequence information. Keep raw samples distinguishable from derived distance or pace. Missing data is a gap, not a measured zero.

## Compare the main alternatives

Phone-owned recording simplifies the authority model but may not satisfy a watch-only activity. Watch-owned recording supports independence at the cost of transfer and battery testing. Choose one first. Batch transfer can reduce coordination frequency; it does not remove the need to reconcile duplicates and missing ranges.

## Budget energy across the session

Sample collection, UI redraw, local persistence, and radio transfer do not need the same frequency. Compare frequent display updates with a slower glanceable presentation, and compare individual sample transfers with bounded batches. Preserve the checkpoint and required recording fidelity first; reducing energy by silently dropping required samples changes the product contract.

Measure a fixed-duration outdoor session with named phone/watch hardware, battery state, OS, sampling policy, transfer cadence, and interruption sequence. A replay test proves recovery rules but cannot establish real radio or battery cost.

## Walk through a failure

Replay an interrupted session with samples 1-20 saved and 21-25 unacknowledged. Restart from the durable sequence, reconcile transferred ranges, and keep the same session ID. Denied health or location access leaves the product in a clearly limited mode. Do not claim complete route coverage when the sensors could not produce it.

## Acceptance scenarios

1. Replay start/pause/resume/finish and reject impossible transitions.
2. Transfer the same sample range twice and retain one logical sequence.
3. Restart after interruption and display the recorded interval plus any gap.
4. Verify consent revocation and deletion policy before collecting additional samples.
5. On a physical phone/watch pair, run the same outdoor recording with connected and delayed-transfer conditions; record battery change, gaps, checkpoint recovery, and sampling/transfer settings.

A deterministic model test can prove transition and identity rules. The platform adapter then needs its own interface, permission, interruption, and integration checks. Keep evidence tied to the actual target and destination rather than treating a design review as an executed feature.

## Implementation boundary

No PulseTrail app target, service integration, account transaction, or hardware journey is supplied by this brief. Use the [Field Notes capstone](../2026-07-19-swiftui-field-notes-capstone/) for the implemented notebook path. Build this assignment only when its distinct user task justifies the extra platform and validation cost.

## References

- [HealthKit](https://developer.apple.com/documentation/healthkit) documents the central framework boundary for this assignment.
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) provides platform interaction and accessibility guidance.

## Related topics

- [Apple platform selection](../2026-07-19-one-product-across-apple-platforms/)
- [Apple capability selection](../2026-07-19-widgetkit-live-activities/)

[Series reading guide](../series/zero-to-ios-hero/)
