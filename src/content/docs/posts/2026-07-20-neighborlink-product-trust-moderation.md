---
title: "NeighborLink: a product design brief"
description: "A local listings and messaging design whose trust rules survive offline work and retries."
date: 2026-07-20
tags: [ios, swift, case-study, neighbor]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-20-neighborlink-product-trust-moderation/
---

A neighbor lists an item, another person asks a question, and both can report or block unsafe contact. Trust behavior belongs in the first release because listing, identity, chat, and moderation affect one another.

This is a design brief and project assignment. It does not describe a completed application.

## One useful vertical slice

Build one listing draft, authenticated creation against a local service contract, a conversation attached to that listing, and report/block actions. Keep payment, discovery ranking, public location precision, and broad media support outside the first slice.

## Model the durable state

```text
Account(id, status)
    +-> Listing(id, authorID, visibility)
            +-> Conversation(id, participants)
                    +-> Message(clientID, serverSequence, status)

message: draft -> queued -> acknowledged
                    |          |
                    +-> retry  +-> visible
```

The service authorizes every listing and conversation operation using the current account. A client route, hidden button, or cached participant list cannot establish authority. A block affects message and notification behavior as well as the visible profile.

## Moderate an explicit report

```text
submitted -> triaged -> decided -> notified
                          |
                          +-> appealed -> reviewed -> upheld or revised
```

A moderation decision records the report ID, subject, outcome, reason, acting role, and timestamp. Keep the original decision in an append-only audit history when a later appeal revises it. Expose only the explanation appropriate to the affected person, not private reporter details or internal review material. Blocking protects the immediate interaction; moderation resolves the broader listing/account policy.

## Compare the main alternatives

A server-backed write simplifies shared authority but must fail visibly when offline. An outbox improves continuity when the product can tolerate queued work. It requires stable client IDs, replay policy, and reconciliation. Start with text messages before uploads so the retry contract is clear.

## Walk through a failure

A message may be accepted just before connectivity disappears. Replay the same client ID and reconcile its server sequence instead of creating a second message. If the sender loses access before replay, retain a visible failure without leaking the protected conversation. Recheck a push/deep-link destination against current account and block state.

## Acceptance scenarios

1. Send the same client ID twice and display one acknowledged message.
2. Switch accounts with a queued write and prevent it from being sent as the new account.
3. Report and block a participant, then verify notifications and conversation access follow policy.
4. Restore an expired or deleted listing route into a recoverable state.
5. Submit a report, record a reasoned decision, appeal it, and revise the outcome while preserving the original actor/reason history and reporter privacy.

A deterministic model test can prove transition and identity rules. The platform adapter then needs its own interface, permission, interruption, and integration checks. Keep evidence tied to the actual target and destination rather than treating a design review as an executed feature.

## Implementation boundary

No NeighborLink app target, service integration, account transaction, or hardware journey is supplied by this brief. Use the [Field Notes capstone](../2026-07-19-swiftui-field-notes-capstone/) for the implemented notebook path. Build this assignment only when its distinct user task justifies the extra platform and validation cost.

## References

- [User Notifications](https://developer.apple.com/documentation/usernotifications) documents the central framework boundary for this assignment.
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) provides platform interaction and accessibility guidance.

## Related topics

- [Apple platform selection](../2026-07-19-one-product-across-apple-platforms/)
- [Apple capability selection](../2026-07-19-widgetkit-live-activities/)

[Series reading guide](../series/zero-to-ios-hero/)
