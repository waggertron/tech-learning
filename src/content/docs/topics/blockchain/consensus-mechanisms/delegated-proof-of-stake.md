---
title: Delegated Proof-of-Stake (DPoS)
description: "Token holders vote to elect a small set of block producers who take turns proposing blocks: how DPoS achieves high throughput, and why producer cartels and voter apathy are its recurring failure modes."
parent: consensus-mechanisms
tags: [blockchain, consensus, dpos, eos, tron, validators]
status: draft
created: 2026-06-05
updated: 2026-06-05
---

Delegated Proof-of-Stake separates token holders from block producers. Rather than every staker directly participating in consensus, token holders vote to elect a small fixed set of block producers. The elected producers take turns proposing blocks, achieving high throughput at the cost of decentralization.

## How it works

```
Voting:
  Token holder votes are weighted by token balance (1 token = 1 vote)
  Top N candidates by total votes become active block producers

Block production:
  Active producers take turns in a round-robin schedule
  Each producer has a fixed time window to propose a block
  If a producer misses their slot, the round advances to the next one

Finality:
  A block is confirmed once 2/3+ of active producers have built on it
  Confirmation time: typically 1-3 blocks (~0.5-1.5 seconds in EOS)
```

**EOS parameters**: 21 active block producers, 0.5-second block time, ~4,000 TPS capacity.

**TRON parameters**: 27 "Super Representatives," 3-second block time.

## Why it is fast

The small, known validator set lets producers communicate and confirm blocks quickly. There is no expensive hash computation (like PoW) and no large committee vote (like full PoS or BFT). The bottleneck is network latency between the 21-27 producers, not cryptographic work.

## Voting mechanics

In EOS, each token holder casts up to 30 votes (one per candidate), distributing across their preferred producers. Vote weight equals the voter's token balance. Producers outside the top 21 by total weight sit in a standby pool and earn smaller rewards.

Votes decay over time if not refreshed (the voter must recast periodically). This discourages vote-and-forget behavior.

## Observed failure modes

**Producer cartels**: EOS block producers discovered that voting for each other's nodes (vote-trading, or "mutual voting") was individually rational. If Producer A votes for Producer B and Producer B votes for Producer A, both increase their probability of staying in the top 21. This undermines competitive election and creates oligarchic stability.

**Voter apathy**: most token holders never vote. The combination of low participation and whale-dominated balances means a small number of large holders effectively control who produces blocks.

**Governance capture**: in 2018 the EOS Core Arbitration Forum ordered specific accounts frozen following a phishing incident. This demonstrated that 21 elected parties can collectively make politically charged decisions affecting user funds, a capability that does not exist in permissionless PoW or PoS chains.

**Stake concentration enables plutocracy**: unlike PoS where any token holder can directly participate in consensus, DPoS layers a political election on top of stake weighting. The combination amplifies wealth effects.

## TRON and other DPoS chains

TRON uses a nearly identical model with 27 Super Representatives. Voter participation has historically been higher than EOS because TRON distributes voting rewards more aggressively to voters who participate.

Lisk, Ark, and BitShares are earlier DPoS chains. BitShares was DPoS's original deployment by Dan Larimer, who later applied the model to Steem and then EOS.

## Comparison to full PoS

| Property | DPoS | Full PoS (Ethereum) |
| --- | --- | --- |
| Validator set | Fixed, elected (21-27) | Open, permissionless (900k+) |
| Throughput | ~4,000 TPS | ~15 TPS base layer |
| Finality | ~1-2 seconds | ~12 minutes |
| Decentralization | Low | Medium |
| Governance | On-chain voting by producers | Off-chain social consensus |

## References

- [EOS Technical Whitepaper (2017)](https://github.com/EOSIO/Documentation/blob/master/TechnicalWhitePaper.md), the original DPoS design for EOS
- [BitShares Delegated Proof-of-Stake Consensus, Larimer (2014)](https://how.bitshares.works/en/master/technology/dpos.html), the first DPoS specification

## Related topics

- [Proof-of-Stake](../proof-of-stake/), the more decentralized PoS alternative
- [Byzantine Fault Tolerance](../byzantine-fault-tolerance/), BFT with a known validator set; similar throughput without the election layer
- [Proof-of-Authority](../proof-of-authority/), a further simplification where validators are whitelisted rather than elected
- [Ethereum](../../cryptocurrency/ethereum/), the largest full PoS chain
