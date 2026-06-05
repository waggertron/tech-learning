---
title: Zero-Knowledge Proofs
description: "Protocols where a prover convinces a verifier that a statement is true without revealing anything beyond the truth of the statement itself."
parent: distributed-cryptography
tags: [cryptography, zkp, snarks, starks, bulletproofs, privacy, zero-knowledge]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

A zero-knowledge proof (ZKP) lets a prover convince a verifier that they know something (a private key, a valid password, a valid transaction) without revealing the thing itself. The verifier learns one bit: the statement is true. Nothing else.

## The three properties

Any ZKP protocol satisfies:

- **Completeness**: if the statement is true and the prover is honest, the verifier accepts.
- **Soundness**: if the statement is false, no cheating prover can convince an honest verifier (except with negligible probability).
- **Zero-knowledge**: the verifier learns nothing beyond the fact that the statement is true. Formally: everything the verifier sees can be simulated without the prover's secret.

## The Ali Baba cave

The classic example: a cave has two paths that meet at a locked door. Peggy knows the magic word that opens it. Victor wants to be convinced without learning the word.

```
       Victor waits here
             |
        [entrance]
             |
        +----+----+
        |         |
     Path A     Path B
        |         |
        +--[door]--+
```

Victor tells Peggy which path to exit from. If she knows the word, she can always comply by going through the door if needed. If she does not know it, she succeeds 50% of the time by luck. Repeat 30 rounds: the probability that a non-knowing Peggy passes all rounds is (1/2)^30, roughly one in a billion.

Victor learns nothing about the magic word. The zero-knowledge property holds.

## Interactive vs non-interactive

The cave protocol requires multiple rounds of back-and-forth. For most applications (blockchain transactions, credential proofs) you need a single message that anyone can verify at any time without interaction.

The Fiat-Shamir transform converts any interactive protocol to non-interactive by replacing the verifier's random challenges with a hash of the prover's commitments. The random oracle model provides the security argument.

All production ZKP systems use non-interactive proofs: a proof is a fixed-size blob, produced once, verified offline by anyone with the statement and public parameters.

## SNARKs

Succinct Non-interactive ARguments of Knowledge compress the proof to a constant-size blob regardless of the computation's complexity. Verification time is also constant (or logarithmic in the input size).

```
Prover:   knows witness w such that C(x, w) = 1
          generates proof pi  (typically 128-288 bytes)

Verifier: checks pi against public statement x
          does NOT need to re-execute C
          runs in O(1) or O(log n) time
```

**Groth16** (2016) is the most deployment-proven SNARK: proof size is 128 bytes, verification takes two pairing operations. The cost is a per-circuit trusted setup (a ceremony that generates proving and verification keys, and produces toxic waste that must be destroyed; anyone who kept the toxic waste can forge proofs for that circuit forever).

**PLONK** (2019) improves this with a universal trusted setup: one ceremony covers any circuit of bounded size, and new circuits reuse the same ceremony output. Proof size is larger (about 1 KB) but the ceremony overhead is shared across the entire ecosystem.

Both Groth16 and PLONK rely on elliptic curve pairings and are broken by sufficiently large quantum computers.

## STARKs

Scalable Transparent ARguments of Knowledge replace elliptic curve pairings with hash functions:

- **No trusted setup**: the prover generates fresh public randomness. No ceremony, no toxic waste.
- **Post-quantum security**: based on hash function collision resistance, not elliptic curve discrete log.
- **Larger proofs**: tens to hundreds of kilobytes versus the 128 bytes of Groth16.
- **Faster proving**: proving time scales better with computation size than pairing-based SNARKs for large circuits.

STARKs dominate in blockchain rollups where proving time can be batched across thousands of transactions and proof size is amortized.

## Bulletproofs

Bulletproofs occupy the middle ground: no trusted setup, proof sizes logarithmic in the circuit size, but verification time is linear. They are most efficient for range proofs: proving a committed value lies in a range (such as [0, 2^64]) without revealing it.

Monero uses Bulletproofs for confidential transaction amounts. The output commitment hides the value; the Bulletproof proves the value is non-negative, preventing inflation by overflow.

## ZK-rollups

The most economically significant application of ZKPs today: a rollup operator processes thousands of transactions off-chain, generates a ZKP that the state transition is valid, and posts the proof to Ethereum. The L1 verifies the proof (constant cost) rather than re-executing the transactions.

```
L2 operator processes 10,000 transactions:
  new_state = apply(transactions, old_state)

Generate proof:
  pi proves "new_state is the correct result of
             applying these transactions to old_state"

Post to L1:
  (old_state_root, new_state_root, pi)

L1 verifier:
  check(pi, old_root, new_root)  -- cheap, O(1)
  update state root              -- one storage write
```

StarkNet uses Cairo and STARK proofs. zkSync Era and Polygon zkEVM use PLONK-derived systems. Each trades off proof size, trusted setup requirements, and EVM compatibility differently.

## Use cases

- **Zcash shielded transactions**: spend notes from the shielded pool by proving knowledge of the spending key and note, without revealing sender, receiver, or amount
- **ZK-rollups**: Ethereum scaling (StarkNet, zkSync, Polygon zkEVM, Scroll)
- **Identity**: Semaphore proves group membership without revealing which member, used in anonymous signaling and voting
- **Threshold protocols**: prove a DKG share was generated correctly without revealing the share itself
- **Password-authenticated key exchange**: prove you know a password without sending the password over the wire

## Comparison

| Scheme | Trusted setup | Proof size | Verification | Post-quantum |
| --- | --- | --- | --- | --- |
| Groth16 | Per circuit | 128 bytes | O(1) | No |
| PLONK | Universal | ~1 KB | O(1) | No |
| STARK | None | 50-200 KB | O(log^2 n) | Yes |
| Bulletproofs | None | O(log n) | O(n) | No |

## Gotchas

- **Trusted setup is a real risk**: the Zcash Powers of Tau ceremony involved 87 participants; security holds if at least one destroyed their toxic waste. Multi-party ceremonies reduce this risk but cannot eliminate it entirely.
- **Circuit complexity**: the function you want to prove must be expressed as an arithmetic circuit or constraint system. Translating real programs requires specialized compilers (Cairo for STARKs, Circom for Groth16 and PLONK).
- **Prover time**: generating a proof is expensive. A 10,000-transaction batch proof on a modern server takes seconds to minutes depending on the circuit and proof system.
- **Fiat-Shamir requires a strong hash**: the transform is only secure in the random oracle model. A weak hash breaks soundness.

## References

- [How to Construct Zero-Knowledge Proof Systems for NP, Goldreich et al. (1991)](https://link.springer.com/article/10.1007/BF02122685), foundational theory
- [On the Size of Pairing-Based Non-interactive Arguments (Groth16), Groth (2016)](https://eprint.iacr.org/2016/260.pdf), the dominant production SNARK
- [PLONK: Permutations over Lagrange-bases for Oecumenical Noninteractive Arguments of Knowledge (2019)](https://eprint.iacr.org/2019/953.pdf), universal setup SNARK
- [Scalable, Transparent, and Post-Quantum Secure Computational Integrity (STARKs), Ben-Sasson et al. (2018)](https://eprint.iacr.org/2018/046.pdf), the STARK paper

## Related topics

- [Secret Sharing](../secret-sharing/), the building block behind distributed input ZKP systems
- [Multi-Party Computation](../multi-party-computation/), ZKPs enforce honest behavior in malicious-security MPC protocols
- [Threshold Signatures](../threshold-signatures/), ZKPs prove share correctness in signing protocols without revealing shares
- [Distributed Key Generation](../distributed-key-generation/), ZKPs validate participant behavior in DKG ceremonies
