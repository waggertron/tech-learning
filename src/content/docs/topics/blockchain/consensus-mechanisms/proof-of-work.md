---
title: Proof-of-Work
description: "How computational puzzles secure blockchains: SHA-256 double-hash, difficulty adjustment, ASIC mining, mining pools, 51% attacks, and energy use."
parent: consensus-mechanisms
tags: [blockchain, consensus, proof-of-work, mining, sha256, bitcoin]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

Proof-of-work makes adding a block to the chain expensive by requiring a miner to find a nonce such that the block header's hash falls below a difficulty target. The work is hard to do and trivial to verify. Rewriting history requires redoing all the work from the point of the change forward, while outpacing the rest of the network adding new work on top.

## The core mechanic

```
Find nonce N such that:
  SHA256(SHA256(block_header + N)) < target

target = 2^256 / difficulty

The lower the target, the harder it is to find a valid hash.
Expected attempts to find a valid nonce = 2^256 / target = difficulty
```

A valid hash proves that a specific amount of computation was expended. Every full node can verify the hash in microseconds. The asymmetry (expensive to produce, cheap to verify) is what makes PoW work.

## Difficulty adjustment

If miners collectively find blocks faster than the target interval, the target lowers (difficulty increases). If blocks slow down, the target rises.

**Bitcoin**: adjusts every 2016 blocks (roughly every two weeks). Target: one block every 10 minutes.

```python
new_target = old_target * (actual_time_for_2016_blocks / expected_time)
# Clamped to at most 4x increase or decrease per adjustment
```

**Ethereum pre-Merge**: adjusted every block using an exponential moving average to target 13-second blocks. Also included a "difficulty bomb" that would eventually make mining impractical, forcing the Merge.

**Monero**: adjusts every block based on the median of the last 720 blocks. More responsive to hash rate changes.

## SHA-256: Bitcoin's algorithm

Bitcoin uses double-SHA-256 (SHA256 applied twice) over an 80-byte block header. SHA-256 is:

- **Deterministic**: same input always gives same output
- **Fast to compute**: a modern CPU can compute ~30 million SHA-256 hashes per second
- **ASIC-friendly**: the fixed computation can be implemented very efficiently in custom silicon

Bitcoin ASICs achieve ~100 terahashes per second (100 trillion hashes/sec). A modern CPU achieves roughly 30 megahashes/sec. The ASIC advantage is roughly 1 million-to-1 in energy efficiency.

The result: Bitcoin mining is almost entirely done by specialized ASICs in large industrial farms. A consumer CPU or GPU contributes negligible hash rate.

## Ethash: Ethereum's pre-Merge algorithm

Ethereum used Ethash, a memory-hard algorithm designed to limit the ASIC advantage:

1. Generate a large dataset (the DAG, ~4-6 GB, grows over time)
2. Each hash requires many lookups across this dataset
3. GPU memory bandwidth becomes the bottleneck, not raw compute

The DAG requirement kept GPU mining viable for years. Ethash ASICs were eventually built but their advantage was smaller than for SHA-256.

After the Merge in September 2022, Ethereum abandoned PoW entirely.

## RandomX: Monero's algorithm

RandomX is designed to make ASIC optimization impractical:

1. Each block epoch, a new "key block" defines a random program
2. Each hash requires executing that random program in a virtual machine
3. The program uses a mix of integer/float arithmetic, branches, and memory accesses

The random program changes the target computation with each epoch, making fixed-function hardware ineffective. The ~2 GB full-dataset requirement also limits memory-constrained ASICs.

RandomX is tuned to run optimally on modern CPUs with large L3 caches, keeping mining accessible to consumer hardware.

## Mining pools

As difficulty increased, the probability of a solo miner finding a valid block shrank to near zero. A miner contributing 0.001% of Bitcoin's hash rate would expect to find a block once every 275 years.

Mining pools aggregate many miners' hash power, share the block reward proportionally, and smooth out income. In exchange, miners accept a small pool fee (1-3%) and trust the pool operator to fairly distribute rewards.

As of 2025, the four largest Bitcoin mining pools (Foundry USA, AntPool, F2Pool, ViaBTC) collectively control over 60% of hash rate. This concentration is a frequent source of centralization concern.

## The 51% attack

An attacker who controls >50% of a network's hash rate can:

1. **Double-spend**: mine a private chain, broadcast a transaction on the public chain, wait for confirmations, then broadcast the private chain (which excludes the original transaction) and make it the longest chain
2. **Selfish mining**: withhold blocks to force honest miners to waste work and then release them to collect disproportionate rewards
3. **Transaction censorship**: exclude transactions from specific addresses

The attack is only economically rational if the gain exceeds the cost of acquiring and operating >50% of the hash rate. For Bitcoin, the daily cost to acquire majority hash rate is estimated in the hundreds of millions of dollars. For smaller PoW chains, the cost is far lower.

**Ethereum Classic** (a split from Ethereum after the DAO hack) was 51%-attacked three times in 2020. Attackers double-spent millions of dollars in ETC across multiple exchanges.

**The cost to attack Bitcoin**: roughly $10-15B to purchase sufficient hardware (as of 2025), plus ongoing electricity costs. No attacker has come close.

## Selfish mining

A strategy where a miner with >33% of hash rate can earn a disproportionate share of rewards by withholding discovered blocks and releasing them strategically to invalidate honest miners' work. It does not require 51% majority and does not require double-spending. It simply wastes the honest miners' effort.

Selfish mining has been observed on some smaller chains but is not clearly observable on Bitcoin, where mining pool behavior is more transparent.

## Energy use

Bitcoin mining consumes roughly 120-150 TWh/year (2024 estimates), comparable to countries like Argentina or Norway. About 50-60% of mining uses renewable energy (hydropower, natural gas flare capture, curtailed wind).

Critics argue this energy expenditure is wasteful. Proponents argue it is the price of a trust-minimized, uncensorable settlement layer for a permissionless global financial system, and that it creates demand for otherwise-curtailed renewable energy.

## Merge mining

A PoW blockchain can adopt Bitcoin's SHA-256 and allow Bitcoin miners to simultaneously mine both chains for no additional energy cost. The miner includes a commitment to the auxiliary chain (Namecoin, Dogecoin) in the Bitcoin coinbase transaction and submits the same proof-of-work to both.

Namecoin (the first Bitcoin merge-mined chain) and Dogecoin both use merge mining today.

## References

- [Bitcoin: A Peer-to-Peer Electronic Cash System, Nakamoto (2008)](https://bitcoin.org/bitcoin.pdf), the original PoW design
- [Majority is Not Enough: Bitcoin Mining is Vulnerable, Eyal and Sirer (2013)](https://arxiv.org/abs/1311.0243), the selfish mining paper
- [RandomX Specification, Tevador (2019)](https://github.com/tevador/RandomX/blob/master/doc/specs.md), Monero's ASIC-resistant algorithm
- [Bitcoin Energy Consumption Index, Digiconomist](https://digiconomist.net/bitcoin-energy-consumption), ongoing estimates

## Related topics

- [Bitcoin](../../cryptocurrency/bitcoin/), the largest PoW chain
- [Monero](../../cryptocurrency/monero/), PoW with ASIC resistance via RandomX
- [Proof-of-Stake](../proof-of-stake/), the energy-efficient alternative
- [Other Consensus Mechanisms](../other-consensus/), PoA, DPoS, PoH, and PoSpace
