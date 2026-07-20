---
title: StoreKit, subscriptions, offers, and entitlement state
description: "Derive durable access from verified transaction history, renewal state, restoration, grace periods, revocation, and StoreKit test evidence."
date: 2026-07-19
tags: [ios, swift, storekit, subscriptions, in-app-purchase]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-storekit-subscriptions-offers-entitlement-state/
series:
  slug: zero-to-ios-hero
  order: 107
---

A purchase button does not grant durable access. Entitlement state comes from verified transactions and must survive relaunch, restoration, renewal changes, refunds, revocation, expiration, and offline periods.

## Design the capability

- An entitlement actor observes transaction updates, verifies results, derives current access, and finishes handled transactions.
- Represent loading, entitled, expired, revoked, billing retry, grace period, pending, and unavailable states where applicable.
- Use a StoreKit configuration for deterministic local products and transaction scenarios before sandbox account tests.
- Keep product identifiers and display metadata typed. Server validation and notifications belong behind a narrow account boundary when required.

## Validation boundary

No StoreKit configuration, sandbox account, App Store Connect product, purchase sheet, server notification, refund, or device transaction was exercised.

## Series navigation

- Previous: [Part 106: Core ML, Vision, Natural Language, and on-device intelligence](../2026-07-19-core-ml-vision-natural-language-on-device-intelligence/)
- Next: [Part 108: Apple Pay, passes, Wallet, and transaction UX](../2026-07-19-apple-pay-passes-wallet-transaction-ux/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [StoreKit](https://developer.apple.com/documentation/storekit)
- [In-App Purchase](https://developer.apple.com/in-app-purchase/)
- [StoreKit testing](https://developer.apple.com/documentation/xcode/setting-up-storekit-testing-in-xcode)

## Related topics

- [State machines](../2026-07-19-ios-unidirectional-data-flow-reducers-state-machines/)
- [TestFlight and App Store operations](../2026-07-19-ios-testflight-app-store-review-launch-observability-evolution/)
