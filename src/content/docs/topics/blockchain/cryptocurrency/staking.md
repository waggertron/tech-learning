---
title: Staking
description: "Locking tokens to participate in proof-of-stake consensus: Ethereum validator duties, slashing conditions, liquid staking with stETH and rETH, yield sources, and the risks of restaking."
parent: cryptocurrency
tags: [blockchain, staking, ethereum, proof-of-stake, liquid-staking, validators]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

Proof-of-stake replaces mining hardware with bonded capital. Validators lock tokens as collateral to gain the right to propose and attest to blocks. Misbehave, and the protocol automatically destroys some of that collateral. The economic cost of attack scales with the total value staked, making attacks on large PoS networks extraordinarily expensive.

This page focuses on Ethereum staking as the most mature example, with notes on other chains where they differ.

## Ethereum validator lifecycle

Becoming an Ethereum validator requires 32 ETH deposited to the deposit contract. The lifecycle:

```
Deposit 32 ETH
      |
      v
Pending (activation queue, can take hours to days)
      |
      v
Active (assigned to a committee each epoch)
      |
      v
Exiting (after exit request, exit queue applies)
      |
      v
Exited (ETH withdrawable after withdrawal queue)
```

The activation and exit queues throttle how quickly the validator set can grow or shrink. This prevents sudden mass exits during market panics.

## Validator duties

Every epoch (6.4 minutes = 32 slots of 12 seconds each), each active validator is assigned to a committee and given one duty:

**Attestation** (every epoch): vote on the current head of the chain, the last justified checkpoint, and the last finalized checkpoint. Validators earn rewards for correct, timely attestations. Missed attestations earn a small penalty.

**Block proposal** (occasionally): one validator per slot is selected by RANDAO to propose the next block. The proposer earns the block reward plus priority fees plus MEV.

**Sync committee** (rarely): a 512-validator committee signs off on light client sync messages. Rotates every ~27 hours. High rewards when selected.

## Finality

Ethereum uses Casper FFG for finality on top of LMD-GHOST fork choice:

- **Justification**: a checkpoint is justified when 2/3 of validators attest to it in the same epoch.
- **Finalization**: a justified checkpoint is finalized when the next checkpoint is also justified. Finalization takes roughly two epochs (~12.8 minutes).
- **Irreversibility**: reverting a finalized block requires burning the stake of 1/3+ of all validators. At the current staked ETH level, this costs tens of billions of dollars.

## Slashing

Slashing is the protocol's enforcement mechanism. Two behaviors trigger slashing:

**Double voting (equivocation)**: signing two different blocks at the same slot, or signing two different attestations for the same target.

**Surround voting**: signing an attestation that surrounds or is surrounded by a prior attestation (used to detect long-range attack attempts).

Slashing penalties:
1. Immediate penalty: 1/32 of effective balance (~1 ETH at 32 ETH stake)
2. Correlation penalty: applied at the midpoint of the exit period, scales with the fraction of validators slashed in the same window. If 1/3 of all validators are slashed simultaneously (indicative of a coordinated attack), the correlation penalty reaches 100% of stake.
3. Forced exit from the validator set

Honest validators running standard software cannot be slashed. Slashing requires actively signing conflicting messages, which no production client does.

## Solo staking vs delegation

**Solo staking**: run your own validator node with 32 ETH. Full control, no fees, no counterparty risk. Requires maintaining uptime. Downtime leads to small inactivity leaks (not slashing).

**Staking pools**: services like Coinbase, Binance, and Kraken let users stake any amount. They pool funds, run validators, and take a cut. Counterparty risk: the exchange holds your stake.

**Liquid staking**: stake any amount and receive a liquid token representing your staked ETH. The most important variant.

## Liquid staking

Liquid staking protocols take user ETH, stake it across validator nodes, and return a receipt token:

**Lido (stETH)**: the largest protocol. Deposits accrue daily and stETH rebases to track the accumulating staking yield. Lido uses a curated set of professional node operators. Controls ~30% of all staked ETH as of 2025, raising centralization concerns.

**Rocket Pool (rETH)**: permissionless node operators with a 16 ETH minimum (plus 16 ETH from the pool). More decentralized. rETH is non-rebasing: it appreciates in value against ETH as yield accrues.

```
User deposits 1 ETH to Lido
  -> receives 1 stETH (pegged to 1 ETH at deposit time)
  -> stETH rebases upward daily as staking rewards accrue
  -> after 1 year at 4% APY: user holds 1.04 stETH
  -> redeem or sell stETH at market price
```

stETH trades on secondary markets. During stress events (Three Arrows Capital collapse, June 2022), stETH briefly depegged to 0.94 ETH because sellers outnumbered buyers and withdrawals were not yet enabled.

## Staking yield sources

| Source | Description | Approx APY |
| --- | --- | --- |
| Consensus rewards | Issued by the protocol for attestations | ~2-3% |
| Priority fees | Tips users add to get included quickly | ~0.5-1% |
| MEV | Block builder bids via MEV-Boost | ~0.5-1% |
| **Total** | | ~3-5% (varies with network activity) |

Yield is not fixed. In periods of high transaction volume (bull markets, NFT mints), MEV and priority fees spike. In quiet periods, yield approaches the base consensus reward.

## Restaking

EigenLayer (launched 2024) lets validators restake their ETH (or stETH) to secure additional protocols (AVSs: Actively Validated Services). Restakers earn additional yield in exchange for taking on slashing risk from those additional protocols.

The risk: a validator could be slashed by EigenLayer's contracts even if they are perfectly honest on Ethereum's base consensus. The slashing conditions are defined by each AVS and may be more difficult to satisfy safely.

## Gotchas

- **Exit queue timing**: you cannot unstake instantly. During high-exit periods (after a major exploit or price crash), the exit queue can take weeks. Liquid staking tokens (stETH) let you sell without waiting, but at market price which may diverge from ETH.
- **Lido's dominance**: Lido controls ~30% of staked ETH. If Lido's node operators were compromised or colluded, they could mount a significant attack. The Ethereum community has set a 33% soft cap as the threshold above which concern intensifies.
- **DVT reduces single-node risk**: Distributed Validator Technology (Obol, SSV Network) splits a validator across multiple machines so no single node failure causes downtime or slashing. Increasingly used by liquid staking protocols.
- **Tax treatment varies**: staking rewards are taxable income in many jurisdictions at the time of receipt. Consult a tax advisor.

## References

- [Ethereum Proof-of-Stake Consensus Specifications](https://github.com/ethereum/consensus-specs), the Beacon Chain specification
- [Casper the Friendly Finality Gadget, Buterin and Griffith (2017)](https://arxiv.org/abs/1710.09437), the finality mechanism
- [Rocket Pool Protocol Whitepaper](https://docs.rocketpool.net/overview/explainers/contracts-integrations), decentralized liquid staking
- [EigenLayer Whitepaper](https://docs.eigenlayer.xyz/overview/eigenlayer-overview), restaking and AVSs

## Related topics

- [Ethereum](../ethereum/), the primary staking platform
- [Consensus Mechanisms: Proof-of-Stake](../../consensus-mechanisms/proof-of-stake/), the full PoS mechanism
- [Wrapped Currencies](../wrapped-currencies/), stETH and rETH trade as ERC-20 tokens on secondary markets
- [Distributed Key Generation](../../../cryptographic-systems/distributed-cryptography/distributed-key-generation/), used in DVT to distribute validator keys
