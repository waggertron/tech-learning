---
title: Distributed Key Generation
description: "Protocols that generate a shared public/private keypair across n parties where no single party ever holds the full private key and a threshold quorum is required to use it."
parent: distributed-cryptography
tags: [cryptography, dkg, distributed-key-generation, threshold]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

Key generation is the trusted dealer problem: someone has to create the private key before splitting it. If that party is compromised during the ceremony, the key is compromised from birth, before it was ever used. Distributed key generation (DKG) eliminates the trusted dealer entirely. All parties cooperate to generate a shared keypair where the private key is never assembled on any single machine, at any point.

## The trusted dealer problem

Classic threshold setup:

1. Dealer generates private key x.
2. Dealer runs Shamir's secret sharing on x and distributes shares.
3. Parties can now threshold-sign without assembling x.

The attack surface is step 1. The dealer knows x before distributing shares. If an attacker controls the dealer (or is the dealer), they have the full key regardless of what the sharing step does afterward.

DKG removes step 1 by distributing the generation itself.

## Pedersen DKG

The most cited DKG protocol (Pedersen, 1991). Each party acts as a dealer for a random contribution to the final key:

```
Round 1 (commit):
  Each party i:
    Generates random secret s_i
    Splits s_i via Feldman VSS: sends share s_ij to each party j
    Broadcasts Feldman commitments C_i = (g^a_i0, g^a_i1, ...) for the polynomial

Round 2 (reveal and verify):
  Each party j:
    Receives shares s_ij from all parties i
    Verifies each share against the published commitments
    If verification fails: broadcast complaint against party i

Disqualification:
  Parties receiving valid complaints are excluded from the final key

Final key assembly:
  Private share for party j: x_j = sum(s_ij for qualifying parties i)
  Public key: X = product(C_i0 for qualifying parties i) = g^(sum(s_i)) = g^x
```

No party ever knows x = sum(s_i). Party j knows only x_j, a share of x. The public key X can be computed from the published commitments without knowing x. Any t shares reconstruct x via Lagrange interpolation.

## GJKR protocol

Gennaro, Jarecki, Krawczyk, and Rabin (1999) identified a bias attack on Pedersen DKG: a malicious party can observe others' commitments in round 1, then selectively abort in round 2 to push the final key toward a value it prefers (or knows more about).

GJKR fixes this by adding a second secret sharing of the randomness used in the commitments. This prevents a party from exploiting the order of reveals. GJKR is the standard reference for secure DKG under malicious adversaries. The protocol adds one round but provides a strong guarantee: even if t-1 parties are Byzantine, the final key is computationally indistinguishable from uniformly random from the honest parties' perspective.

## FROST DKG

FROST (2020) packages DKG with threshold Schnorr signing into one coherent protocol. The DKG portion uses a simplified two-round approach:

```
Round 1:
  Each participant i broadcasts:
    Feldman VSS commitments for their random contribution
    A Schnorr proof of knowledge of their secret (prevents rogue-key attacks)

Round 2:
  Each participant i sends private share to all other participants
  Each participant verifies received shares against commitments
  Final share: x_i = sum of all received shares

Public key: X = product of all C_j0 (first commitments from each participant)
```

FROST DKG produces a t-of-n keypair ready for immediate use with the FROST threshold Schnorr signing protocol.

## Communication complexity

DKG requires O(n^2) messages in the general case: each of n parties sends to all others.

| n | Messages | Notes |
| --- | --- | --- |
| 3 | ~6 | Minimal threshold setting |
| 10 | ~100 | Comfortable for institutional MPC |
| 100 | ~10,000 | Practical with a broadcast channel |
| 1,000+ | ~1,000,000 | Requires aggregation; not typical |

Production deployments almost always use small n (3-10) with high thresholds (2-of-3, 3-of-5) for this reason. Ethereum DVT clusters, for example, typically run 4-10 nodes.

## DKG in production

**Ethereum validator DVT**: SSV Network and Obol Network use DKG to generate validator signing keys across a cluster. The cluster must cooperate to produce attestations, so a single compromised node cannot trigger slashing. Key generation happens once at cluster formation and can be repeated if nodes are rotated.

**TSS wallets**: when a new wallet is created on Fireblocks or a similar MPC custody platform, the wallet's private key is generated via DKG split across the user's device and the provider's infrastructure. Neither party alone can sign a transaction.

**Root CA ceremonies**: PKI root CA key generation under a DKG-equivalent ceremony means no single operator can reconstruct the root signing key outside a quorum ceremony. NIST FIPS 140 requirements for HSM-backed root keys push toward this model.

**Randomness beacons**: drand and similar services use DKG to generate a distributed randomness beacon where no single node can predict or bias the output. The random output is the combined signature of a threshold of nodes over the round number.

## Gotchas

- **Abort strategies**: a malicious participant can abort at any round to force honest parties to restart. Protocols with identifiable abort reveal who aborted, allowing exclusion. Protocols without identification just restart from scratch.
- **Broadcast channel assumption**: most DKG protocols assume a reliable broadcast channel where all parties see the same messages in the same order. In practice this requires either a consensus mechanism or a PKI for message authentication and ordering.
- **Share refresh**: shares should be refreshed periodically to bound the exposure window from a long-term compromise. Proactive DKG protocols support refreshing shares without changing the public key or requiring a new DKG ceremony.
- **Quorum changes**: adding or removing a participant from a threshold scheme requires a re-sharing protocol. This is not trivially composable with the original DKG and must be designed explicitly.

## References

- [Non-Interactive and Information-Theoretically Secure VSS, Pedersen (1991)](https://link.springer.com/chapter/10.1007/3-540-46766-1_9), the Pedersen VSS underlying most DKG protocols
- [Secure Distributed Key Generation for Discrete-Log Based Cryptosystems, Gennaro et al. (1999)](https://link.springer.com/chapter/10.1007/3-540-48910-X_21), GJKR
- [FROST: Flexible Round-Optimized Schnorr Threshold Signatures, Komlo and Goldberg (2020)](https://eprint.iacr.org/2020/852.pdf), FROST DKG and threshold signing
- [Practical Asynchronous Distributed Key Generation, Das et al. (2021)](https://eprint.iacr.org/2021/1591.pdf), DKG for networks that cannot guarantee message delivery order

## Related topics

- [Secret Sharing](../secret-sharing/), the foundational primitive DKG protocols are built on
- [Threshold Signatures](../threshold-signatures/), the primary consumer of DKG-generated keys
- [Multi-Party Computation](../multi-party-computation/), the broader framework DKG fits into
- [Zero-Knowledge Proofs](../zero-knowledge-proofs/), used in DKG to prove correct participant behavior without revealing secrets
