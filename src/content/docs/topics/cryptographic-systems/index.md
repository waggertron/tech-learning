---
title: Cryptographic Systems
description: "Key distribution, threshold schemes, multi-party computation, zero-knowledge proofs, and the protocols that replace a single trusted keyholder with a quorum."
category: cryptographic-systems
tags: [cryptography, security, distributed-systems]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

Cryptographic systems covers the engineering side of applied cryptography: not the math for its own sake, but the protocols and constructions you reach for when a single keyholder is a single point of failure.

The common thread is distributed trust. Instead of one server holding a private key, one party knowing a secret, or one verifier seeing all inputs, these protocols spread the sensitive bits across multiple parties and reconstruct results only when the required threshold cooperates.

## Topics

- [Distributed Cryptography](./distributed-cryptography/), the protocols that split keys and secrets across multiple parties so no single party holds the whole thing: secret sharing, MPC, threshold signatures, ZKPs, and distributed key generation

## How the topics connect

Distributed key generation produces keys that no single party ever sees whole. Secret sharing stores those keys in a way that requires a quorum to recover. Threshold signatures let the quorum sign without ever assembling the full key. Multi-party computation generalizes this to arbitrary functions. Zero-knowledge proofs let participants prove claims about those secrets without revealing them.

## Related topics

- [Distributed Locking](../system-design/distributed-locking/), consensus and coordination in distributed systems without cryptographic guarantees
- [Networking Part 19: Network Security Fundamentals](../networking/part-19-network-security-fundamentals/), VPNs, 802.1X, and perimeter security
- [CAP Theorem](../system-design/cap-theorem/), the consistency and availability tradeoff underlying all distributed protocols
- [Tokens, Keys, Secrets, and Environment Variables](../ops/secrets-keys-tokens/), the operational side of credential management
