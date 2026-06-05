---
title: Multi-Party Computation
description: "Protocols for computing a function over private inputs held by multiple parties where no party learns anything beyond their own input and the function output."
parent: distributed-cryptography
tags: [cryptography, mpc, secure-computation, privacy]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

Two hospitals want to compute statistics across their patient populations without either revealing individual records. Two companies want to know if their customer lists overlap without exposing their full databases to each other. These are multi-party computation (MPC) problems: compute f(x1, x2, ..., xn) where each party i holds xi privately, and no party learns anything about others' inputs beyond what the output itself implies.

## Yao's millionaires problem

Andrew Yao posed the foundational example in 1982: two millionaires want to know who is richer without revealing their exact wealth. Formally, compute `a > b` where party A holds a and party B holds b, and neither learns the other's number.

This is trivial with a trusted third party. The breakthrough is doing it without one.

## Security models

MPC protocols are analyzed under one of two adversary models:

- **Semi-honest (honest-but-curious)**: parties follow the protocol faithfully but try to extract information from what they see. Most efficient protocols assume this.
- **Malicious (Byzantine)**: parties can deviate arbitrarily, send wrong messages, or abort strategically. Secure against this is achievable but costs roughly 10-100x more in computation and communication.

Real deployments often use semi-honest protocols with audit logs, accepting that the threat is an external attacker reading memory rather than a colluding insider actively cheating.

## The additive secret sharing approach

The simplest MPC protocol uses additive sharing over integers mod p:

```
To share x among 3 parties:
  r1, r2 = random values mod p
  share1 = r1
  share2 = r2
  share3 = (x - r1 - r2) mod p

Each party holds one share.
Sum of all three shares = x mod p.
```

Addition is free: each party adds their local shares, and the sum of the output shares equals the sum of the inputs mod p.

Multiplication is expensive. It requires an additional round of communication using Beaver triples:

```
Beaver triple precomputation (offline, input-independent):
  Trusted dealer (or DKG) generates (a, b, c) where c = a*b mod p
  Split into shares: each party gets ([a]_i, [b]_i, [c]_i)

Online multiplication of [x] * [y]:
  Parties open [x - a] and [y - b] to all  (these reveal nothing about x or y)
  Each party computes locally:
    [z]_i = [c]_i + (x-a)*[b]_i + (y-b)*[a]_i + (x-a)*(y-b)
  Sum of [z]_i across all parties = x*y
```

The offline phase (generating Beaver triples) is independent of the actual inputs and can be precomputed in bulk.

## Garbled circuits

An alternative approach: represent f as a boolean circuit and evaluate it obliviously using Yao's garbled circuits (1986).

The circuit constructor encrypts each wire's two possible values under wire labels the evaluator cannot distinguish. Oblivious transfer lets the evaluator receive the wire labels for their input without the constructor learning which input they chose.

Garbled circuits are efficient for comparison-heavy functions. Integer arithmetic is expensive because each ADD or MULTIPLY requires many boolean gates.

In practice, most production MPC frameworks use hybrid approaches: garbled circuits for comparisons, secret-sharing-based protocols for arithmetic.

## Protocols and frameworks

| Protocol | Security model | Best for |
| --- | --- | --- |
| GMW (Goldreich-Micali-Wigderson) | Semi-honest | Boolean circuits, many parties |
| BGW (Ben-Or-Goldwasser-Wigderson) | Malicious | Up to n/3 corrupt parties |
| SPDZ (Damgaard et al.) | Malicious | Arithmetic circuits |
| ABY3 (Mohassel-Rindal) | Semi-honest | 3-party ML workloads |
| MOTION | Semi-honest | High-performance arithmetic and boolean |

## What MPC enables in practice

**Private set intersection (PSI)**: two parties compute the intersection of their datasets without either learning what is in the other's set but not the intersection. Used by Apple for CSAM detection, Google for ad attribution without sharing user identifiers.

**Secure aggregation**: participants compute a model update locally; MPC aggregates the updates without the server ever seeing individual gradients. Used in federated learning.

**Threshold ECDSA**: signing a Bitcoin transaction requires the private key. With MPC, a 2-of-3 quorum of key-share holders can produce a valid signature without any party ever holding the full key. This is the basis of MPC wallets (Fireblocks, ZenGo, Coinbase MPC).

**Sealed-bid auctions**: compute the winning bid and winner without revealing losing bids to anyone, including the auctioneer.

## Communication complexity

MPC does not come free. A function with C multiplication gates requires O(C) rounds of communication (or O(1) rounds with preprocessing). Round trips over a WAN add 50-150ms each.

In practice:
- Local area network: millions of multiplications per second
- Wide area network: hundreds of thousands per second at best
- Mobile: MPC is often impractical without heavy preprocessing offloaded to nearby servers

## Gotchas

- **Output leaks inputs**: if f(x, y) = x + y and y = 0, the output reveals x. MPC is only private up to what the output implies. Differential privacy handles this separately.
- **Abort security**: a malicious party can abort after learning the output, forcing others to restart. Handling this fairly requires additional protocol complexity (identifiable abort).
- **Preprocessing cost**: Beaver triple generation dominates the offline phase. At scale it is significant and must happen before inputs are known.
- **Not a substitute for input validation**: MPC does not prevent a party from claiming their input was different. Proving input correctness requires additional zero-knowledge proofs.

## References

- [Protocols for Secure Computations, Yao (1982)](https://dl.acm.org/doi/10.1109/SFCS.1982.38), the original garbled circuits paper
- [SPDZ: Multiparty Computation from Somewhat Homomorphic Encryption, Damgaard et al. (2012)](https://eprint.iacr.org/2011/535.pdf), the SPDZ protocol
- [MP-SPDZ: A Versatile Framework for Multi-Party Computation (2020)](https://eprint.iacr.org/2020/521.pdf), comprehensive open-source framework
- [Secure Multiparty Computation and Secret Sharing, Cramer et al. (2015)](https://www.cambridge.org/core/books/secure-multiparty-computation-and-secret-sharing/), the standard textbook

## Related topics

- [Secret Sharing](../secret-sharing/), the building block that underlies most MPC protocols
- [Threshold Signatures](../threshold-signatures/), MPC applied specifically to digital signing
- [Zero-Knowledge Proofs](../zero-knowledge-proofs/), used to prove input correctness in malicious-security MPC
- [Distributed Key Generation](../distributed-key-generation/), generating keys for use in threshold protocols without a trusted dealer
