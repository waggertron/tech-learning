---
title: Threshold Signatures
description: "Signing schemes where t of n key-holders cooperate to produce a valid signature without any party reconstructing the full private key."
parent: distributed-cryptography
tags: [cryptography, threshold-signatures, ecdsa, bls, schnorr, frost]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

Ordinary signing requires the full private key present on one machine at signing time. Threshold signatures remove that requirement: t of n key-share holders run a protocol and produce a valid standard signature without the full key ever existing on any single machine.

The output is a normal signature. An existing Bitcoin transaction, Ethereum validator attestation, or TLS certificate verifies with the standard algorithm unchanged. The threshold property is entirely in the key generation and signing protocol. Verifiers need no changes.

## The naive approach and why it fails

The obvious approach: reconstruct the private key when you need to sign, use it, then discard it. This works but defeats the purpose. The brief moment of reconstruction is the attack window. A compromised coordinator gets the full key.

The goal is to sign without reconstruction.

## Threshold Schnorr

Schnorr signing: to sign message m with private key x, pick nonce k, compute R = kG, and set s = k - H(R, m) * x. The signature is (R, s). Verification checks sG == R - H(R, m) * X where X = xG is the public key.

For threshold signing, the linearity of Schnorr makes this clean:

```
Setup:
  Each party i holds share x_i of the private key x (via DKG)
  Public key X = x*G = sum(x_i * G)  (computable without knowing x)

Signing (FROST, 2 rounds):
  Round 1:
    Each signer i generates nonce commitments (D_i, E_i) and broadcasts them

  Round 2:
    Each signer i computes partial signature:
      s_i = d_i + e_i*rho_i - lambda_i * x_i * c
    where c = H(R, X, m) and rho_i, lambda_i are deterministic from commitments

  Aggregation:
    s = sum(s_i)
    Signature = (R, s)
```

No party ever assembles x or the full nonce k. The partial signatures add to a valid Schnorr signature.

## Threshold ECDSA

ECDSA signing: s = k^(-1) * (H(m) + r * x) mod n.

The inversion of k and the product r * x make naive threshold signing difficult. You cannot distribute these operations the way Schnorr allows: the inverse and the product create a non-linear relationship that requires the full values to compute directly.

The solution (GG18, GG20) uses Paillier homomorphic encryption as an offline preprocessing step:

- Party A encrypts their share of k under Paillier.
- Party B can compute Paillier operations that produce an encryption of s without decrypting anything.
- The final result is decrypted jointly.

GG20 is the dominant production protocol. It is correct and secure but has significant complexity compared to threshold Schnorr: tens of kilobytes of messages per signing operation versus a few hundred bytes. The offline phase (key generation) takes seconds to minutes. The online phase (signing) takes under a second.

## BLS threshold signatures

BLS (Boneh-Lynn-Shacham) signatures have native threshold properties because signatures are points on an elliptic curve and combine linearly:

```
Private share for party i:  x_i  (from DKG)
Partial signature:           sig_i = x_i * H(m)  (scalar multiplication)
Threshold signature:         sig = sum(lambda_i * sig_i)  (Lagrange interpolation on sigs)

Verification:  e(sig, G) == e(H(m), X)
               where e is the bilinear pairing and X = x*G is the public key
```

BLS threshold signing requires no interaction beyond collecting partial signatures. There is no nonce to coordinate across parties. This makes it much simpler than threshold ECDSA or threshold Schnorr.

Ethereum uses BLS12-381 for validator keys. Ethereum DVT (distributed validator technology) splits validator signing keys using BLS threshold signatures: a cluster of nodes must cooperate to attest, so no single compromised node can be slashed.

## Comparison

| Scheme | Interaction rounds | Signature size | Notes |
| --- | --- | --- | --- |
| Threshold Schnorr (FROST) | 2 rounds | ~64 bytes | Clean, Bitcoin Taproot compatible |
| Threshold ECDSA (GG20) | 3+ rounds, heavy offline | ~72 bytes | Needed for legacy ECDSA chains |
| BLS threshold | Combine partial sigs offline | ~48 bytes | No nonce coordination needed |

## Use cases

- **Crypto exchange cold storage**: 3-of-5 threshold signing over institutional Bitcoin holdings. GG20 is common here because Bitcoin pre-Taproot uses ECDSA.
- **MPC wallets**: Fireblocks, ZenGo, and Coinbase MPC use threshold ECDSA for user key custody so the provider never holds user funds unilaterally.
- **Ethereum DVT**: SSV Network, Obol Network, and Diva use threshold BLS to distribute validator duties across a resilient cluster.
- **HSM clusters**: threshold signing across geographically distributed hardware security modules for PKI root CA operations.

## Gotchas

- **Nonce reuse in Schnorr**: if two signing sessions share a nonce, the private key is immediately recoverable. FROST prevents this by binding nonces cryptographically to the signing commitment.
- **Abort handling**: a scheme with t-of-n signers can be aborted by any n-t+1 participants. Identifying and excluding malicious aborters requires identifiable abort protocols, which add complexity.
- **Online vs offline phases**: GG20 has a heavy offline phase. Online signing is fast. Plan around this if keys are generated on-demand.
- **Standard compatibility**: threshold Schnorr over secp256k1 produces BIP340 Taproot-compatible signatures. Threshold BLS produces standard BLS signatures. Both are drop-in compatible with existing verifiers.

## References

- [FROST: Flexible Round-Optimized Schnorr Threshold Signatures, Komlo and Goldberg (2020)](https://eprint.iacr.org/2020/852.pdf), the standard threshold Schnorr protocol
- [Fast Multiparty Threshold ECDSA with Fast Trustless Setup, Gennaro and Goldfeder (2018)](https://eprint.iacr.org/2019/114.pdf), GG18
- [One Round Threshold ECDSA with Identifiable Abort, Gennaro and Goldfeder (2020)](https://eprint.iacr.org/2020/540.pdf), GG20
- [Short Signatures from the Weil Pairing, Boneh et al. (2001)](https://link.springer.com/chapter/10.1007/3-540-45682-1_30), the BLS signature scheme

## Related topics

- [Secret Sharing](../secret-sharing/), the foundation for distributing key shares
- [Distributed Key Generation](../distributed-key-generation/), generating the key shares used in threshold signing
- [Multi-Party Computation](../multi-party-computation/), the general framework threshold signing fits into
- [Zero-Knowledge Proofs](../zero-knowledge-proofs/), used in threshold protocols to prove share correctness without revealing it
