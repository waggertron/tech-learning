---
title: Apple Pay, passes, Wallet, and transaction UX
description: "Choose Apple Pay and Wallet for eligible physical transactions and durable passes while validating merchant, shipping, privacy, and failure state."
date: 2026-07-19
tags: [ios, swift, apple-pay, wallet, passkit, payments]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-apple-pay-passes-wallet-transaction-ux/
series:
  slug: zero-to-ios-hero
  order: 108
---

Apple Pay handles eligible payment authorization without giving the app raw payment credentials. Wallet passes represent tickets, memberships, keys, or status that remains useful after the purchase moment.

## Design the capability

- Build a payment request from validated merchant capability, country, currency, line items, shipping needs, and supported networks.
- Treat authorization as one step. The server still owns order validation, fulfillment, idempotency, refund, and reconciliation.
- Use StoreKit for digital goods and services consumed in the app according to current policy. Use Apple Pay for eligible real-world transactions.
- Passes need stable identity, signed updates, relevance policy, privacy review, and a useful expired or revoked state.

## Validation boundary

No merchant registration, payment processing certificate, entitlement, gateway, sandbox card, pass signing, Wallet installation, or physical-device transaction occurred.

## Series navigation

- Previous: [Part 107: StoreKit, subscriptions, offers, and entitlement state](../2026-07-19-storekit-subscriptions-offers-entitlement-state/)
- Next: [Part 109: Games, GameKit, SpriteKit, SceneKit, and Metal choices](../2026-07-19-games-gamekit-spritekit-scenekit-metal-choices/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Apple Pay](https://developer.apple.com/apple-pay/)
- [PassKit](https://developer.apple.com/documentation/passkit)
- [Wallet](https://developer.apple.com/wallet/)

## Related topics

- [StoreKit and entitlements](../2026-07-19-storekit-subscriptions-offers-entitlement-state/)
- [Security and privacy](../2026-07-19-ios-security-privacy-permissions-platform-policy/)
