---
title: Other Consensus Mechanisms
description: "DPoS, Proof-of-Authority, Proof-of-History, Proof-of-Space, and BFT variants: how they work, where they are used, and how they compare on the decentralization-throughput-finality triangle."
parent: consensus-mechanisms
tags: [blockchain, consensus, dpos, proof-of-authority, proof-of-history, proof-of-space, bft]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

Beyond proof-of-work and proof-of-stake, a range of consensus mechanisms trade decentralization for performance, or replace capital with other resources. This page covers the most prominent variants.

## Delegated Proof-of-Stake (DPoS)

DPoS was popularized by Dan Larimer (BitShares, Steem, EOS). Token holders vote for a small set of elected block producers rather than directly participating in consensus.

```
EOS structure:
  21 active Block Producers (BPs)
  Elected by token holder votes (1 token = 1 vote)
  BPs take turns producing blocks in a rotating schedule
  Block time: 0.5 seconds
  Throughput: ~4,000 TPS
```

The small, known validator set enables high throughput and fast finality. The cost is decentralization: 21 BPs is a political structure, not a trustless one.

**Observed failure modes in practice:**

- **BP cartels**: EOS block producers coordinated to vote for each other's nodes (vote trading), undermining competitive election.
- **Voter apathy**: most token holders do not vote. Whale accounts dominate elections.
- **Governance capture**: the EOS "freeze" in 2018, where the EOS Core Arbitration Forum ordered transactions reversed, demonstrated that 21 elected parties can collectively make politically charged decisions.

TRON uses a similar 27-validator DPoS model.

## Proof-of-Authority (PoA)

PoA replaces anonymous computational work or anonymous bonded capital with known, approved validators. Only whitelisted addresses can produce blocks.

```
Clique (Ethereum PoA, used in testnets):
  A list of signers is maintained on-chain
  Signers take turns proposing blocks in round-robin
  A block is valid if signed by an authorized signer
  Signers can vote to add or remove other signers
```

**Where it is used:**

- **Ethereum testnets**: Goerli used Clique PoA; Sepolia uses a variation. Easy to reset and manage for developer testing.
- **Enterprise chains**: Hyperledger Besu in consortium deployments, Quorum (JPMorgan's Ethereum fork), Baseline Protocol implementations.
- **Polygon PoS** uses a variant where validators are permissioned via a staking mechanism on Ethereum, but the active set is small enough to be quasi-PoA.

PoA is highly performant (block time can be sub-second, throughput thousands of TPS) but entirely dependent on the validator whitelist. A compromise of the validator keys or regulatory pressure on identified validator operators breaks safety.

## Proof-of-History (PoH)

Proof-of-History is Solana's solution to the "what time is it?" problem in distributed consensus. It is not a consensus mechanism on its own but a cryptographic clock that enables Solana's Tower BFT to operate efficiently.

```
PoH sequence (continuous VDF):
  h0 = SHA256("genesis")
  h1 = SHA256(h0)
  h2 = SHA256(h1)
  ...
  hN = SHA256(h(N-1))

Between hashes, the leader inserts events (transactions):
  hK = SHA256(h(K-1) || tx_data)

This proves that tx_data was created after h(K-1) and before h(K+1).
```

The continuous hash chain is a Verifiable Delay Function: it cannot be computed faster than sequentially, and each output proves that a specific wall-clock duration has elapsed since the previous output (since each SHA-256 takes finite time).

**Why it matters for throughput**: validators can independently verify the ordering of events without network round-trips to agree on time. This removes a bottleneck that typically limits BFT protocols to lower throughput.

Solana targets 400ms slots. The PoH leader streams a continuous sequence; validators verify in parallel.

## Proof-of-Space (PoSpace) and Proof-of-Capacity

Chia Network (launched 2021) uses Proof-of-Space-and-Time. Instead of spending electricity to compute hashes, farmers pre-compute large lookup tables (plots) stored on disk. To win a block, a farmer responds to a challenge by looking up values in their plots.

```
Plotting (offline, one-time per disk):
  Fill disk with cryptographic lookup tables
  ~100 GB per plot on an 8 TB drive = ~80 plots

Farming (online, continuous):
  Network broadcasts a challenge
  Farmer finds best matching value in plots
  Submits proof; winner selected by best match
  Expected win time proportional to total plot space
```

**Proof-of-Time**: to prevent grinding attacks (pre-computing many candidate plots and selecting the best after seeing the challenge), a Verifiable Delay Function runs after each plot selection to ensure plots cannot be computed on-the-fly.

Energy use is dramatically lower than PoW: a farmer can participate with a desktop PC and USB drives. The hardware cost is dominated by storage, not electricity.

**Trade-offs**: Chia's launch caused a hard drive shortage as speculators purchased drives for plotting. The "grinding" attack surface (pre-computing many plots in advance) is an ongoing research concern.

## HotStuff and its derivatives

HotStuff (2018, used in Diem/Libra) is a leader-based BFT protocol that achieves linear message complexity (O(n) messages per consensus round instead of the O(n^2) typical of PBFT).

```
Three-phase commit (simplified):
  Leader broadcasts Prepare message
  Replicas respond with votes
  Leader collects 2/3 quorum, broadcasts Pre-commit
  Replicas respond; leader broadcasts Commit
  Replicas commit the block
```

The key insight: a threshold signature (BLS aggregation) lets the leader collect 2/3 votes and compress them into one message. This reduces network overhead from O(n^2) to O(n) for each consensus round.

HotStuff or variants appear in Diem (Facebook's canceled stablecoin project), Aptos, and Sui.

## Comparison of all mechanisms

| Mechanism | Chain | Finality | Throughput | Permissionless | Energy |
| --- | --- | --- | --- | --- | --- |
| PoW (SHA-256) | Bitcoin | Probabilistic | ~7 TPS | Yes | Very high |
| PoW (RandomX) | Monero | Probabilistic | ~1.7 TPS | Yes | High (CPU) |
| PoS (Casper) | Ethereum | ~12 min | ~15 TPS | Yes (32 ETH) | Low |
| PoS (Tower BFT) | Solana | ~400ms | ~50,000 TPS | Yes (hardware) | Low |
| PoS (Tendermint) | Cosmos | 1 block (~7s) | ~10,000 TPS | Yes (bonded) | Low |
| DPoS | EOS, TRON | 1 block (~0.5s) | ~4,000 TPS | No (elected) | Very low |
| PoA (Clique) | Test nets | 1 block | High | No (whitelist) | Minimal |
| PoSpace | Chia | Probabilistic | ~52 TPS | Yes (storage) | Low |

## Finality types

**Probabilistic**: the more blocks built on top of a block, the harder it is to revert. Never truly final, but practically final after sufficient depth (6 blocks for Bitcoin, ~35 for Ethereum pre-finalization).

**Economic**: a finalized block would cost > $1B to revert due to slashing. Ethereum post-Casper finalization.

**Deterministic**: a committed block is guaranteed to never be reverted given the security assumption holds. BFT-based systems (Tendermint, HotStuff). Requires a fixed known validator set.

## References

- [EOS Technical Whitepaper (2017)](https://github.com/EOSIO/Documentation/blob/master/TechnicalWhitePaper.md), the DPoS design
- [HotStuff: BFT Consensus in the Lens of Blockchain, Yin et al. (2018)](https://arxiv.org/abs/1803.05069), the HotStuff protocol
- [Chia Network Green Paper (2019)](https://www.chia.net/assets/ChiaGreenPaper.pdf), Proof-of-Space-and-Time
- [Proof of History: A Clock for Blockchain, Yakovenko (2017)](https://solana.com/news/proof-of-history), Solana's PoH

## Related topics

- [Proof-of-Work](./proof-of-work/), the energy-intensive original
- [Proof-of-Stake](./proof-of-stake/), the capital-based alternative
- [Bitcoin](../bitcoin/), the original PoW chain
- [Ethereum](../ethereum/), the largest PoS chain
