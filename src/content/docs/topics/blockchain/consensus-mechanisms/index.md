---
title: Consensus Mechanisms
description: "How distributed nodes agree on the canonical blockchain: proof-of-work, proof-of-stake, and the alternatives including DPoS, PoA, PoH, and proof-of-space."
category: blockchain
tags: [blockchain, consensus, proof-of-work, proof-of-stake]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

Every blockchain faces the same problem: thousands of independent nodes must agree on which transactions happened and in what order, without trusting each other or a coordinator. Consensus mechanisms solve this.

The solution in every case: make disagreement expensive. In proof-of-work, forking requires reproducing the accumulated hash work. In proof-of-stake, misbehavior is punished by destroying the validator's bonded capital. The details determine the tradeoffs: energy use, decentralization, finality speed, and throughput.

## Subtopics

- [Proof-of-Work](./proof-of-work/), computational puzzles as the cost of participation: SHA-256, Ethash, RandomX, mining pools, and 51% attacks
- [Proof-of-Stake](./proof-of-stake/), bonded capital as the cost of participation: Ethereum Casper, validator duties, slashing, and alternative PoS designs
- [Other Consensus Mechanisms](./other-consensus/), DPoS, Proof-of-Authority, Proof-of-History, Proof-of-Space, and BFT variants

## The key tradeoffs

| Mechanism | Energy | Decentralization | Finality | Throughput |
| --- | --- | --- | --- | --- |
| Proof-of-Work | High | High (anyone can mine) | Probabilistic (~1 hr) | Low (~7-15 TPS) |
| Proof-of-Stake | Low | Medium (stake required) | Fast (~12 min on Ethereum) | Medium (~15 TPS + L2) |
| DPoS | Very low | Low (elected delegates) | Fast | High |
| BFT (Tendermint) | Very low | Medium | Instant (1 block) | Medium |
| Proof-of-Authority | Minimal | Very low (known validators) | Instant | High |
| Proof-of-Space | Low | Medium | Probabilistic | Low |

## How to read the table

**Energy** reflects the cost of participation. PoW requires continuous computation. PoS requires capital lockup but minimal electricity. BFT and PoA require almost none.

**Decentralization** reflects how easy it is to become a validator. Anyone with hardware can mine PoW. PoS requires capital. DPoS requires winning an election. PoA requires being on a whitelist.

**Finality** reflects when a block can be considered irreversible. Probabilistic finality means earlier blocks are safer but never absolutely final. Deterministic finality means a committed block cannot be reverted.

**Throughput** is the base layer. All mechanisms can be scaled with Layer 2 solutions; the base layer number reflects on-chain capacity.

## Related topics

- [Bitcoin](../bitcoin/), the original PoW chain
- [Ethereum](../ethereum/), the largest PoS chain
- [Staking](../staking/), the economics of PoS participation
- [Distributed Cryptography](../../cryptographic-systems/distributed-cryptography/), the cryptographic building blocks behind PoS signing
