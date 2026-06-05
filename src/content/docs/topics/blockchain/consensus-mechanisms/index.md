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
- [Delegated Proof-of-Stake](./delegated-proof-of-stake/), token holders elect a small set of block producers who take turns proposing blocks
- [Byzantine Fault Tolerance](./byzantine-fault-tolerance/), explicit multi-round voting for deterministic single-block finality: PBFT, Tendermint, HotStuff
- [Proof-of-Authority](./proof-of-authority/), only whitelisted, identified validators can sign blocks: Clique, Aura, enterprise chains
- [Proof-of-Space](./proof-of-space/), pre-committed disk storage replaces hash computation: Chia's plotting, farming, and Proof-of-Time
- [Other Consensus Mechanisms](./other-consensus/), Proof-of-History and broader comparisons

## The key tradeoffs

| Mechanism | Energy | Decentralization | Finality | Throughput |
| --- | --- | --- | --- | --- |
| **[Proof-of-Work](./proof-of-work/)**: nodes compete to solve a cryptographic hash puzzle; the winner adds the next block and earns the block reward. Difficulty adjusts so blocks arrive at a steady rate regardless of total hash power. | High | High (anyone can mine) | Probabilistic (~1 hr) | Low (~7-15 TPS) |
| **[Proof-of-Stake](./proof-of-stake/)**: validators lock tokens as collateral to earn the right to propose and attest to blocks. Misbehavior (double-signing) is punished by automatically destroying a portion of the stake (slashing). | Low | Medium (stake required) | Fast (~12 min on Ethereum) | Medium (~15 TPS + L2) |
| **[Delegated Proof-of-Stake](./delegated-proof-of-stake/)**: token holders vote to elect a small fixed set of block producers (typically 21-27). Elected producers take turns proposing blocks in a round-robin schedule. | Very low | Low (elected delegates) | Fast | High |
| **[Byzantine Fault Tolerance](./byzantine-fault-tolerance/)**: a known validator set runs a multi-round voting protocol. A block is committed only when 2/3+ of validators explicitly pre-vote and pre-commit to it. One bad round restarts with a new proposer. | Very low | Medium | Instant (1 block) | Medium |
| **[Proof-of-Authority](./proof-of-authority/)**: only pre-approved, identified validators can sign blocks. Validators take turns in a round-robin; a block is valid if signed by an authorized address. Used in enterprise chains and testnets. | Minimal | Very low (known validators) | Instant | High |
| **[Proof-of-Space](./proof-of-space/)**: nodes pre-compute large lookup tables (plots) stored on disk. To win a block, a farmer finds the best matching value in their plots for a network-broadcast challenge. Storage capacity replaces hash power. | Low | Medium | Probabilistic | Low |

## How to read the table

**Energy** reflects the cost of participation. PoW requires continuous computation. PoS requires capital lockup but minimal electricity. BFT and PoA require almost none.

**Decentralization** reflects how easy it is to become a validator. Anyone with hardware can mine PoW. PoS requires capital. DPoS requires winning an election. PoA requires being on a whitelist.

**Finality** reflects when a block can be considered irreversible. Probabilistic finality means earlier blocks are safer but never absolutely final. Deterministic finality means a committed block cannot be reverted.

**Throughput** is the base layer. All mechanisms can be scaled with Layer 2 solutions; the base layer number reflects on-chain capacity.

## Related topics

- [Bitcoin](../cryptocurrency/bitcoin/), the original PoW chain
- [Ethereum](../cryptocurrency/ethereum/), the largest PoS chain
- [Staking](../cryptocurrency/staking/), the economics of PoS participation
- [Distributed Cryptography](../../cryptographic-systems/distributed-cryptography/), the cryptographic building blocks behind PoS signing
