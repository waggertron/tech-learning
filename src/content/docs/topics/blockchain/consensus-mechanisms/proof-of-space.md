---
title: Proof-of-Space
description: "Disk storage replaces hash computation as the cost of participation: how Chia's plotting and farming work, how Proof-of-Time prevents grinding attacks, and the energy vs. hardware waste tradeoff."
parent: consensus-mechanisms
tags: [blockchain, consensus, proof-of-space, chia, vdf, proof-of-time]
status: draft
created: 2026-06-05
updated: 2026-06-05
---

Proof-of-Space (PoSpace), also called Proof-of-Capacity, replaces electricity-intensive hash computation with pre-committed disk storage. Participants fill drives with cryptographic lookup tables during an offline "plotting" phase, then use those tables to respond to online challenges during a "farming" phase. The cost of participation is measured in terabytes of storage, not watts of power.

Chia Network (launched 2021) is the primary production deployment. It combines Proof-of-Space with Proof-of-Time to close a security gap.

## Why storage instead of compute

Proof-of-Work requires continuous energy expenditure to maintain hash rate. A miner who stops spending electricity immediately loses block production capacity. The environmental criticism of PoW is largely about this ongoing waste.

Proof-of-Space pre-commits storage once during plotting and then reads it cheaply during farming. A farmer spending 8 TB of disk space consumes roughly the same electricity as leaving a USB drive plugged in. The hardware cost replaces the energy cost as the proof of commitment.

## Plotting: the offline phase

```
Plotting (one-time per disk):
  Generate two pseudorandom tables using a farmer's public key and a plot ID:
    Table 1: 2^32 entries of 64-bit proofs of space values
    Tables 2-7: forward and backward links between table entries

  Final compressed plot: ~100 GiB on an 8 TiB drive (roughly 80 plots per drive)
  Plotting takes hours to days depending on hardware; the plot is then permanent
```

The tables are designed so that:
1. The only way to respond to a challenge quickly is to have pre-computed the table
2. Computing the tables takes significant time and CPU/RAM (prevents on-the-fly faking)
3. The tables can be verified cheaply against the farmer's public key

A farmer cannot pretend to have more space than they have: generating a fake proof would require recomputing the tables in real time, which takes too long relative to the challenge window.

## Farming: the online phase

```
Farming (continuous, low CPU):
  1. The Chia network broadcasts a challenge every ~9 seconds (1 slot)
  2. Each farmer checks all their plot files for a matching proof
     (lookup in the pre-computed tables, milliseconds per plot)
  3. The farmer with the best proof quality wins the block reward
     (quality ~ how close their proof value is to the challenge target)
  4. Winner broadcasts the block and earns 2 XCH block reward
```

Expected block win time is proportional to the farmer's total storage relative to the network's total storage (netspace). A farmer with 1% of the network's storage wins roughly 1% of blocks.

## Why Proof-of-Time is needed

Without a second mechanism, Proof-of-Space is vulnerable to a **grinding attack**:

```
Grinding attack (without Proof-of-Time):
  Attacker knows the challenge for the next block
  Attacker generates many candidate plots optimized for that challenge
  Selects the best one and submits it
  -> the attacker effectively gets multiple rolls of the dice per challenge
```

This breaks the fairness of the lottery: an attacker with 1% of the netspace could generate 100x plots on demand and win ~100% of blocks.

**Proof-of-Time (VDF)**: after each block, a Verifiable Delay Function (VDF) runs for a fixed wall-clock duration (roughly 10 seconds on reference hardware). The VDF output seeds the next challenge. VDFs are inherently sequential: they cannot be parallelized or pre-computed. No matter how many cores an attacker has, they cannot compute the VDF output faster than the reference hardware.

Because the challenge is not known until the VDF completes, plotting in response to a known challenge is impossible. The grinding attack is closed.

## Energy profile

| Operation | Energy use |
| --- | --- |
| Plotting | High: CPU + RAM intensive for hours to days per plot |
| Farming | Very low: sequential reads, no sustained computation |
| Compared to Bitcoin mining | ~500x lower energy per unit of security |

Chia's energy estimate: approximately 0.16 TWh/year (2022), compared to Bitcoin's ~120-150 TWh/year. The comparison is imperfect because Chia's security budget (total value at stake) is lower.

**The catch**: plotting consumes SSD write endurance aggressively. Chia's launch in 2021 triggered a hard drive and SSD shortage as speculators purchased drives in bulk. High-endurance SSDs were used as plotting scratch space and burned through quickly. Consumer drives not rated for sustained writes failed rapidly. Critics argue this is waste of hardware rather than waste of energy, with e-waste implications.

## Chia's production parameters

| Parameter | Value |
| --- | --- |
| Slot time | ~9 seconds |
| Sub-slot target | ~10 minutes (100 slots, VDF-limited) |
| Block reward | 2 XCH (as of 2021 launch) |
| Plot format | k=32 (100 GiB), k=33 (200 GiB), etc. |
| Minimum space | Any amount; rewards proportional to share of netspace |

## Comparison to PoW

| Property | Proof-of-Work | Proof-of-Space |
| --- | --- | --- |
| Ongoing cost | Electricity | Near-zero (farming phase) |
| Upfront cost | ASICs / GPUs | HDDs / SSDs |
| ASIC advantage | Very high (SHA-256 ASICs are 1M× more efficient than CPUs) | Low (plotting is CPU-RAM bound; farming is sequential disk I/O) |
| Environmental impact | High (energy) | Medium (hardware manufacturing and e-waste) |
| Security | 51% requires majority hash power | 51% requires majority storage |

## References

- [Chia Network Green Paper, Cohen and Pietrzak (2019)](https://www.chia.net/assets/ChiaGreenPaper.pdf), the PoSpace+PoTime design
- [Proofs of Space, Dziembowski et al. (2015)](https://eprint.iacr.org/2013/796.pdf), the theoretical foundation
- [Chia blockchain source and specification](https://github.com/Chia-Network/chia-blockchain), the production implementation

## Related topics

- [Proof-of-Work](../proof-of-work/), the energy-intensive alternative; same probabilistic finality
- [Proof-of-Stake](../proof-of-stake/), capital-based participation
- [Other Consensus Mechanisms](../other-consensus/), broader comparison including DPoS, PoA, and PoH
