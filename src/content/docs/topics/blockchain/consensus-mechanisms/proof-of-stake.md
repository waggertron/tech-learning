---
title: Proof-of-Stake
description: "Bonded capital as the cost of participation: how Ethereum Casper FFG and LMD-GHOST work, slashing, validator selection, Cardano Ouroboros, Tendermint BFT, and the nothing-at-stake problem."
parent: consensus-mechanisms
tags: [blockchain, consensus, proof-of-stake, ethereum, casper, validators]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

Proof-of-stake replaces computational work with bonded capital. To participate in consensus, a validator locks tokens as collateral. If the validator signs conflicting messages (double voting, surround voting), the protocol automatically destroys some of that collateral (slashing). The cost of attack is the economic value of the stake at risk.

## The nothing-at-stake problem

Early PoS designs had a critical flaw: a validator could vote for multiple conflicting forks simultaneously at no cost, since there was no equivalent of burning electricity for each vote. Rational validators would always vote on every fork to maximize their chance of being on the winning side.

```
Without slashing:
  Fork A exists
  Fork B exists
  Validator votes on both: gains if either wins, loses nothing
  -> no economic incentive to pick one canonical chain
```

The solution: slashing. Voting on two conflicting blocks at the same height costs you stake. Now validators must pick one chain to support.

## Ethereum's hybrid: LMD-GHOST + Casper FFG

Ethereum uses two algorithms together:

**LMD-GHOST (Latest Message Driven Greediest Heaviest Observed Sub-Tree)**: the fork choice rule. At each fork, choose the branch with the most recent attestations from the most validators, weighted by stake. "Latest Message Driven" means only the most recent attestation per validator counts.

**Casper FFG (Friendly Finality Gadget)**: a finality overlay. Every epoch (32 slots, ~6.4 minutes), validators vote on a checkpoint. When 2/3 of all validators attest to a checkpoint, it becomes justified. When the next checkpoint is also justified, the first becomes finalized.

```
Epochs and slots:
  Epoch = 32 slots
  Slot  = 12 seconds
  Epoch duration = 6.4 minutes

  Slot N:   one block opportunity; one validator selected to propose
            ~512-validator committee selected to attest

  After 2 epochs: if both checkpoints justified, first is finalized
  Finalization time: ~12.8 minutes in the happy path
```

## Validator selection: RANDAO

Block proposers are selected pseudo-randomly from the active validator set via RANDAO. Each validator contributes a random value to a cumulative XOR at each block, producing an unpredictable but verifiable random output. This output seeds the proposer and committee selection for the next epoch.

An attacker who controls many validators could bias RANDAO by looking ahead at which value gives them a favorable outcome. A 1% stake attacker can bias RANDAO by roughly 1%. VDFs (Verifiable Delay Functions) are planned to further harden RANDAO against lookahead attacks.

## Slashing conditions

Two behaviors trigger slashing:

**Equivocation (double voting)**: signing two different blocks at the same slot, or two attestations with the same source and target.

**Surround voting**: signing an attestation whose source-to-target range surrounds (or is surrounded by) a previous attestation.

```
Surround voting (invalid):
  Attestation 1: source=epoch 5, target=epoch 9
  Attestation 2: source=epoch 6, target=epoch 8  <- surrounded by attestation 1

A validator who submits both is slashed.
This prevents validators from rewriting history by attestations
that wrap around earlier, already-finalized checkpoints.
```

Penalties on slashing:
- Immediate: 1/32 of effective balance
- Correlation: at the midpoint of the ~36-day exit period, scaled by the fraction of validators slashed in the same window. If 1/3 of all validators are slashed together: up to 100% loss.
- The validator is then force-exited.

## Inactivity leak

If the chain fails to finalize for four or more epochs (meaning fewer than 2/3 of validators are voting), an inactivity leak begins. Validators who are offline start losing stake at an accelerating rate. This continues until the offline validators have lost enough stake that the remaining validators represent 2/3 of the reduced total and can finalize again.

The inactivity leak is the mechanism that lets the chain recover from an extended partition where a significant fraction of validators go offline simultaneously.

## Cardano: Ouroboros

Ouroboros (2017) was the first PoS protocol with a formal security proof comparable to Bitcoin's. It organizes time into epochs and slots, with slot leaders elected based on stake. The security argument: as long as a majority of stake is held by honest participants, the chain grows safely.

Cardano uses a UTXO-based ledger (like Bitcoin) rather than the account model (like Ethereum), making smart contract execution more complex but parallelizable.

## Solana: Tower BFT + PoH

Solana combines two innovations:

**Proof-of-History (PoH)**: a Verifiable Delay Function (VDF) that produces a continuously running cryptographic clock. Each hash output proves that a specific amount of time has passed since the last hash. This gives validators a shared sense of time without network synchronization.

**Tower BFT**: a PBFT-derived consensus algorithm optimized for Solana's PoH clock. Validators vote on the head of the chain; each vote exponentially increases the lockout time for switching to a different fork. This creates an economic incentive for consistency without slashing.

Solana targets 400ms slots and ~50,000 TPS. The throughput comes at the cost of higher hardware requirements for validators, reducing decentralization.

## Cosmos/Tendermint: BFT finality

Tendermint (now CometBFT) provides Byzantine Fault Tolerant consensus with single-block finality:

```
Round:
  Propose:  one validator proposes a block
  Prevote:  all validators broadcast prevote for the block or nil
  Precommit: if 2/3+ prevotes: each validator broadcasts precommit
  Commit:   if 2/3+ precommits: block is final

If no agreement in this round: increment round number, try again
```

Finality is deterministic and happens in one block (~1-7 seconds). Trade-off: if 1/3+ of validators go offline, the chain halts until they return (no liveness under partition). Bitcoin and Ethereum prioritize liveness (continue producing blocks) over deterministic safety.

## Delegated Proof-of-Stake

DPoS separates token holders from validators. Token holders vote for a small set of block producers (21 in EOS, 27 in TRON). The elected producers take turns proposing blocks. High throughput, but the small, elected validator set is more oligarchic than permissionless PoS.

EOS was the most prominent DPoS chain. Producer cartels, voter apathy, and governance failures became recurring issues.

## The plutocracy critique

In all PoS variants, larger stakes earn more rewards and have more influence over chain governance. Critics argue this entrenches wealth and gives well-capitalized actors outsized control. Proponents argue the same is true of PoW (large miners dominate) and that the capital at risk aligns validators with the network's long-term health.

## Comparison

| System | Finality | Slashing | Permissionless |
| --- | --- | --- | --- |
| Ethereum Casper | ~12 min | Yes | Yes (32 ETH) |
| Cardano Ouroboros | Probabilistic | No (peer pressure) | Yes |
| Solana Tower BFT | ~400ms | Yes | Yes (hardware cost) |
| Tendermint | 1 block (~1-7s) | Yes | Yes (bonded stake) |
| DPoS (EOS) | 1 block | Yes | No (elected) |

## References

- [Casper the Friendly Finality Gadget, Buterin and Griffith (2017)](https://arxiv.org/abs/1710.09437), Casper FFG
- [Ouroboros: A Provably Secure Proof-of-Stake Blockchain Protocol (2017)](https://eprint.iacr.org/2016/889.pdf), Cardano's formal PoS
- [Tendermint: Byzantine Fault Tolerance in the Age of Blockchains, Buchman (2016)](https://atrium.lib.uoguelph.ca/items/5459099b-c5f6-43dd-b9a5-3cd5e2aa3d9e), Tendermint design
- [Ethereum Proof-of-Stake Consensus Specifications](https://github.com/ethereum/consensus-specs), the full Beacon Chain spec

## Related topics

- [Ethereum](../../cryptocurrency/ethereum/), the largest PoS chain
- [Staking](../../cryptocurrency/staking/), the economics and mechanics of participating as an Ethereum validator
- [Proof-of-Work](../proof-of-work/), the energy-intensive alternative
- [Other Consensus Mechanisms](../other-consensus/), DPoS, PoA, PoH, and PoSpace
