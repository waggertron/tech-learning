---
title: Monero
description: "The privacy-first cryptocurrency: ring signatures obscure the sender, stealth addresses hide the receiver, RingCT with Bulletproofs hides the amount, and RandomX resists ASIC mining."
parent: cryptocurrency
tags: [blockchain, monero, privacy, ring-signatures, zero-knowledge, proof-of-work]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

Bitcoin transactions are pseudonymous: addresses are not tied to identities, but the entire transaction graph is publicly visible. Once an address is linked to a person (via an exchange KYC, a public donation address, or chain analysis), the full history of that address is exposed.

Monero makes privacy the default. Every transaction hides the sender, receiver, and amount using three interlocking cryptographic mechanisms. The blockchain records activity but reveals nothing about who sent what to whom or how much.

## Ring signatures: hiding the sender

When Alice sends XMR, her transaction input references one real UTXO (her coin) mixed with a ring of decoy UTXOs drawn from the blockchain. The ring signature proves that one of the ring members authorized the transaction without revealing which one.

```
Alice's real input + 15 decoy inputs = ring of 16
Ring signature proves: "one of these 16 keys signed"
                       but not which one

To an observer: all 16 inputs look equally likely
```

The current ring size in Monero is 16 (as of late 2023). This provides a 1-in-16 anonymity set per input. Chain analysis can statistically narrow candidates over time but cannot identify the real input with certainty.

A key image (a deterministic hash of the spending key and the UTXO being spent) is included with each transaction. It prevents double-spending: each UTXO has a unique key image, and any attempt to spend it again produces the same key image, which nodes reject.

## Stealth addresses: hiding the receiver

Monero uses stealth addresses so no two transactions sent to Alice produce the same on-chain address, even if they're sent to the same published address.

```
Alice publishes:  (A, B)  where A = view public key, B = spend public key

Sender Bob:
  Generates random r
  Computes one-time address: P = H(r*A)*G + B
  Includes R = r*G in transaction

Alice scans all outputs with her view key a:
  For each output with R:
    P' = H(a*R)*G + B
    If P' == P: this output is mine
    She can spend it with private key: x = H(a*R) + b
```

Every output on the Monero blockchain is at a unique address. Alice's wallet must scan all new transactions to find outputs addressed to her. This is why Monero wallet sync is slower than Bitcoin wallet sync.

A **view key** (the private half of A) lets Alice (or an auditor she authorizes) identify incoming transactions without the ability to spend them.

## RingCT: hiding the amount

Ring Confidential Transactions (RingCT, introduced 2017) hide transaction amounts using Pedersen commitments over the EC group:

```
Commitment: C = r*G + v*H

where r = random blinding factor
      v = actual amount
      G, H = generator points

Properties:
  - C reveals nothing about v (hiding)
  - Can verify sum of inputs = sum of outputs + fee
    without knowing any individual amount (binding)
```

The verifier checks that `sum(input commitments) = sum(output commitments) + fee_commitment`. This confirms no XMR was created from thin air, without knowing any value.

**Bulletproofs** (integrated 2018) prove that each committed output value lies in [0, 2^64) without revealing the value. This prevents negative amounts (which would break the sum check) and reduced average transaction size by ~80% compared to the previous range proof scheme.

## RandomX: ASIC-resistant proof-of-work

Monero uses RandomX as its mining algorithm. RandomX is designed to resist ASIC optimization:

- Each hash requires executing a randomly generated program in a virtual machine
- The program is different for each block and cannot be precomputed
- It uses floating-point and integer operations, branch instructions, and memory accesses
- Optimized to run efficiently on general-purpose CPUs, not custom silicon

RandomX requires ~2 GB of memory for fast mode (full dataset). ASICs would need comparable memory, shrinking their cost advantage over CPUs. This keeps mining accessible to individual CPU miners.

Contrast with Bitcoin's SHA-256: a simple, fixed function that ASIC manufacturers have optimized for years. Bitcoin mining now requires dedicated hardware that is thousands of times more efficient than CPUs.

## Fungibility

A bitcoin's history is visible. Coins associated with theft or illicit activity can be blacklisted by exchanges (coin taint). This breaks fungibility: two bitcoins with different histories are not interchangeable at equal value.

Monero coins are fungible by design. Because no observer can trace a coin's history, no coin can be tainted. Every XMR is as acceptable as any other.

## View keys and selective disclosure

Monero's default is full privacy, but the view key mechanism allows selective disclosure:

- **Incoming view key**: share with an auditor to prove incoming transactions (useful for tax compliance)
- **Full view key** (incoming + outgoing): discloses both sides of the transaction history
- **Transaction proof**: prove a specific payment was made to a specific address without revealing anything else

Exchanges and regulated entities operating with Monero often use view keys to satisfy compliance requirements.

## Regulatory environment

Several major exchanges (Coinbase, Kraken in some jurisdictions, Bittrex) have delisted Monero due to pressure from regulators who view privacy coins as incompatible with AML/KYC obligations. Monero remains widely traded on decentralized exchanges and exchanges that operate outside FATF-compliant jurisdictions.

## Gotchas

- **Wallet sync is slow**: the stealth address scan requires checking every transaction since the wallet's birthday. A wallet that has been offline for a year may take hours to sync.
- **Transaction size**: Monero transactions are larger than Bitcoin transactions (~2 KB for a typical transaction vs ~250 bytes for P2WPKH). This limits throughput.
- **Ring size is not perfect anonymity**: a ring size of 16 provides a probabilistic anonymity set, not unconditional privacy. Statistical analysis of decoy selection over time reduces the effective anonymity set for some transactions.
- **No smart contracts**: Monero's script is intentionally limited. DeFi, tokens, and programmable logic are not possible on the base layer.

## References

- [CryptoNote Whitepaper, van Saberhagen (2013)](https://bytecoin.org/old/whitepaper.pdf), the cryptographic foundation for ring signatures and stealth addresses
- [Ring Confidential Transactions, Noether (2015)](https://eprint.iacr.org/2015/1098.pdf), RingCT
- [Bulletproofs: Short Proofs for Confidential Transactions, Bunz et al. (2018)](https://eprint.iacr.org/2017/1066.pdf), range proofs for RingCT
- [RandomX: Proof of Work Algorithm, Tevador (2019)](https://github.com/tevador/RandomX/blob/master/doc/specs.md), the RandomX specification

## Related topics

- [Bitcoin](./bitcoin/), the UTXO chain Monero's model extends
- [Zero-Knowledge Proofs](../../cryptographic-systems/distributed-cryptography/zero-knowledge-proofs/), the cryptographic framework for Bulletproofs
- [Consensus Mechanisms: Proof-of-Work](../consensus-mechanisms/proof-of-work/), mining algorithms including RandomX
- [Secret Sharing](../../cryptographic-systems/distributed-cryptography/secret-sharing/), threshold custody for XMR wallets
