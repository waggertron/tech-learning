---
title: Byzantine Fault Tolerance (BFT)
description: "Explicit multi-round voting for deterministic finality: how PBFT, Tendermint/CometBFT, and HotStuff work, why they halt rather than fork under partition, and where BFT consensus appears in production chains."
parent: consensus-mechanisms
tags: [blockchain, consensus, bft, tendermint, hotstuff, cosmos, finality]
status: draft
created: 2026-06-05
updated: 2026-06-05
---

Byzantine Fault Tolerant consensus algorithms let a distributed system reach agreement even when some nodes are actively malicious (sending conflicting messages to different peers). The name comes from the "Byzantine Generals Problem" (Lamport, Shostak, Pease, 1982): how do generals coordinating an attack by messenger agree to act, when some messengers or generals may be traitors?

The classical result: a system with `f` Byzantine (malicious or faulty) nodes can reach consensus if and only if the total number of nodes `n >= 3f + 1`. In practice, this means tolerating up to 1/3 of nodes being faulty.

## PBFT (the original)

Practical Byzantine Fault Tolerance (Castro and Liskov, 1999) was the first BFT algorithm efficient enough for real distributed systems. It runs in three phases:

```
Pre-prepare: leader broadcasts the request to all replicas
Prepare:     each replica broadcasts a "prepared" message to all others
             (requires 2f+1 prepare messages to proceed)
Commit:      each replica broadcasts "commit" to all others
             (requires 2f+1 commit messages to finalize)
```

PBFT achieves deterministic safety: a committed operation will never be undone. The downside: O(n^2) message complexity. Every replica sends a message to every other replica in each phase. With 100 nodes, each phase requires ~10,000 messages. With 1,000 nodes, ~1,000,000. PBFT is impractical above ~100 validators.

## Tendermint / CometBFT

Tendermint (now CometBFT, used in Cosmos chains) is a PBFT variant optimized for blockchain with a simpler three-phase protocol and a lock-step voting structure:

```
Round:
  Propose:    a designated proposer broadcasts a block
  Prevote:    each validator broadcasts prevote(block) or prevote(nil)
              if 2/3+ prevotes for a block: validators lock on it
  Precommit:  each validator broadcasts precommit(block) or precommit(nil)
              if 2/3+ precommits: block is COMMITTED (finalized)

If no 2/3+ agreement: increment round number, elect new proposer, retry
```

**Safety guarantee**: a committed block is final. No fork can contain a different committed block at the same height, because committing requires 2/3+ explicit precommits.

**Liveness trade-off**: if more than 1/3 of validators go offline, the chain halts. It does not produce empty blocks or degrade gracefully. This is the opposite of Bitcoin, which continues producing blocks as long as any miner is alive.

**Block time**: Cosmos Hub produces blocks every ~7 seconds. Osmosis and other Cosmos chains are similar. The bottleneck is two rounds of n-to-n message broadcasts, where n is the validator count.

## HotStuff

HotStuff (Yin, Abraham, Malkhi, Fan, Reiter, 2018) improves PBFT's O(n^2) message complexity to O(n) per round by using threshold signatures (BLS aggregation):

```
Instead of: every validator sending a message to every other validator
HotStuff:   every validator sends a vote to the LEADER
            the leader aggregates votes into a single threshold signature
            the leader broadcasts the aggregated certificate to all validators
```

The leader-aggregation pattern reduces each round from n^2 messages to n + n = 2n messages. This makes BFT consensus viable at 1,000+ validators.

HotStuff or variants appear in:
- **Diem/Libra** (Facebook's canceled stablecoin project): DiemBFT, a HotStuff variant
- **Aptos**: AptosBFT, a DiemBFT descendant
- **Sui**: Narwhal+Bullshark, a DAG-based BFT variant for parallel transaction execution

## LibraBFT / DiemBFT improvements

HotStuff requires four rounds to commit a block. DiemBFT reduced this to two rounds by pipelining: while validators are voting on round N's pre-commit, they are also pre-voting on round N+1. The commit latency is still two explicit round trips but the throughput is higher.

## Safety vs liveness under partition

BFT systems prioritize safety over liveness:

- **Safety**: two honest nodes will never commit different blocks at the same height. Guaranteed always.
- **Liveness**: the system will eventually commit new blocks. Guaranteed only when fewer than 1/3 of validators are offline.

Under a 50/50 network partition, a BFT chain halts. Bitcoin under the same partition forks: both sides continue producing blocks, and the longer chain wins when the partition heals. Which behavior is preferable depends on the application:
- Financial settlement: prefer halting (no divergent state)
- Censorship-resistant payments: prefer continued liveness (Bitcoin's choice)

## Validator set size

| Algorithm | Max practical validators | Message complexity |
| --- | --- | --- |
| PBFT | ~100 | O(n^2) |
| Tendermint | ~150-300 | O(n^2) with BLS aggregation tricks |
| HotStuff | 1,000+ | O(n) |
| Ethereum Casper | 900,000+ | O(n) with committee sampling |

Ethereum handles its massive validator set by splitting validators into committees (~512 validators per slot) and aggregating BLS signatures. Each slot only requires one committee to vote, not all 900,000 validators.

## References

- [Practical Byzantine Fault Tolerance, Castro and Liskov (1999)](https://pmg.csail.mit.edu/papers/osdi99.pdf), the foundational PBFT paper
- [Tendermint: Byzantine Fault Tolerance in the Age of Blockchains, Buchman (2016)](https://atrium.lib.uoguelph.ca/items/5459099b-c5f6-43dd-b9a5-3cd5e2aa3d9e), Tendermint design
- [HotStuff: BFT Consensus in the Lens of Blockchain, Yin et al. (2018)](https://arxiv.org/abs/1803.05069), linear message complexity BFT

## Related topics

- [Proof-of-Stake](./proof-of-stake/), Ethereum uses a BFT finality gadget (Casper FFG) on top of its PoS fork choice
- [Delegated Proof-of-Stake](./delegated-proof-of-stake/), a simpler elected-validator approach with weaker safety guarantees
- [Proof-of-Authority](./proof-of-authority/), BFT with a whitelisted (non-staked) validator set
- [Distributed Key Generation](../../cryptographic-systems/distributed-cryptography/distributed-key-generation/), BLS threshold signatures used in HotStuff-style aggregation
