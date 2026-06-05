---
title: Distributed Cryptography
description: "Protocols that split a secret or key across multiple parties so no single party holds the whole: secret sharing, MPC, threshold signatures, ZKPs, and distributed key generation."
parent: cryptographic-systems
tags: [cryptography, distributed-systems, secret-sharing, mpc, zero-knowledge]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

A private key sitting on one server is worth exactly as much as that server's security posture. If the server is compromised, the key is compromised. If it burns down, the key is gone. Distributed cryptography solves this by splitting the sensitive material across multiple independent parties, requiring a threshold quorum to reconstruct or use it.

The key insight: polynomial interpolation (and its relatives) lets you split a secret into n shares where any t reconstruct the secret exactly and any t-1 shares reveal nothing whatsoever about it. Every protocol in this section builds on that foundation.

## Subtopics

- [Secret Sharing](./secret-sharing/), Shamir's scheme and verifiable variants: split a secret into n shares, require any t to reconstruct
- [Multi-Party Computation](./multi-party-computation/), compute a function over distributed private inputs where no party learns anything beyond the output
- [Threshold Signatures](./threshold-signatures/), sign or decrypt with a t-of-n key where no party ever holds the full private key
- [Zero-Knowledge Proofs](./zero-knowledge-proofs/), prove a statement is true without revealing why it is true
- [Distributed Key Generation](./distributed-key-generation/), generate a shared keypair across n parties with no trusted dealer

## How they connect

```
  DKG generates a key      Secret sharing stores it
         |                          |
         v                          v
  Threshold sigs use it     MPC generalizes both
         |
         v
  ZKPs prove things about the result
```

Distributed key generation produces a public/private keypair where the private key is immediately split across participants and no single party ever sees the whole. Secret sharing stores existing keys the same way. Threshold signatures let participants sign cooperatively using those shares. Multi-party computation generalizes to arbitrary functions (threshold signing is a special case). Zero-knowledge proofs let participants verify claims about the inputs or outputs without seeing the underlying values.

## Where distributed cryptography shows up

- **Crypto custody**: hardware wallets, exchange cold storage, MPC wallets (Fireblocks, Coinbase MPC)
- **Blockchain validators**: Ethereum distributed validator technology (DVT), BLS key aggregation
- **Regulatory compliance**: key escrow schemes that require regulator co-signature
- **Privacy-preserving analytics**: federated learning with cryptographic aggregation

## Related topics

- [Cryptographic Systems](../), this category's landing page
- [Distributed Locking](../../system-design/distributed-locking/), coordination in distributed systems without cryptographic guarantees
- [Networking Part 19: Network Security Fundamentals](../../networking/part-19-network-security-fundamentals/), VPNs and authentication protocols
- [Tokens, Keys, Secrets, and Environment Variables](../../ops/secrets-keys-tokens/), the operational side of key management
