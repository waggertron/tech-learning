---
title: Proof-of-Authority (PoA)
description: "Only pre-approved, identified validators can sign blocks: how Clique and Aura work, where PoA is used in enterprise chains and Ethereum testnets, and why validator key compromise breaks the whole system."
parent: consensus-mechanisms
tags: [blockchain, consensus, proof-of-authority, poa, testnets, enterprise]
status: draft
created: 2026-06-05
updated: 2026-06-05
---

Proof-of-Authority replaces anonymous computational work or bonded capital with a whitelist of known, identified validators. Only addresses on the whitelist can produce blocks. The result is extremely low energy use and high throughput, at the cost of all security properties tied to permissionlessness.

## How it works

```
Setup:
  A set of authorized signer addresses is defined (on-chain or at genesis)
  Each signer controls a private key

Block production (Clique algorithm):
  Signers take turns proposing blocks in a round-robin schedule
  A block is valid if and only if its coinbase field is an authorized signer
  Each signer may only sign one of every (N/2 + 1) consecutive blocks
    (prevents one signer from dominating the chain)

Governance:
  Active signers vote to add or remove other signers
  A signer is added/removed when a majority of active signers vote for it
```

The "one of every N/2+1 blocks" rule ensures no single signer can produce more than half the blocks, spreading block production even when some signers are offline.

## Clique vs Aura

**Clique** (Ethereum's PoA algorithm, used in Rinkeby and Goerli testnets): a Geth-native PoA implementation. Signers are embedded in the genesis block and managed via in-band voting. Blocks include the signer's address in the `coinbase` field and a signature over the block hash in the `extraData` field.

**Aura** (Authority Round, used in OpenEthereum/Parity and some Substrate chains): signers also take turns, but use a step-based timer. Each step lasts a fixed number of seconds; the signer for step N is `authorized_signers[N mod num_signers]`. Missed steps produce empty blocks.

Both produce blocks in roughly equal rotation, tolerate up to `(N-1)/2` offline validators, and provide instant finality within a single block.

## Where PoA is used

**Ethereum testnets**: Rinkeby (now deprecated) and Goerli used Clique PoA. Testnets benefit from PoA because validator identity is known (Ethereum Foundation and community members), block production is predictable, and the chain can be reset or hard-forked easily. Sepolia uses a restricted validator set closer to PoA.

**Enterprise and consortium chains**: Hyperledger Besu in private deployments, Quorum (JPMorgan's Ethereum fork used in financial consortia), and Baseline Protocol implementations. When all participants are known counterparties, PoA's trust assumptions are acceptable and its throughput is attractive.

**Polygon PoS**: uses a small, stake-gated validator set (~100 validators as of 2025) rather than a full whitelist, but the effective decentralization is closer to PoA than to Ethereum's permissionless PoS.

**Binance Smart Chain (BSC)**: uses a Proof-of-Staked-Authority (PoSA) variant with 21 elected validators. The validator set is small enough to behave operationally like PoA.

## Security model

PoA's security is entirely dependent on the integrity of the validator whitelist. Attacks that are impossible or extremely costly on PoW/PoS become trivial if enough validator keys are compromised:

- **Key compromise**: an attacker who steals the private keys of a majority of validators can rewrite history, double-spend, or halt the chain.
- **Regulatory seizure**: identified validators can be compelled by governments or courts to censor transactions or halt the chain.
- **Collusion**: validators who know each other can coordinate to favor specific transactions or block competitors from using the chain.

There is no cryptoeconomic cost to misbehavior beyond reputational harm. PoA relies on identity and reputation, not economic disincentives.

## Finality

PoA provides instant finality at the block level. Once a block is signed by an authorized validator and accepted by the chain, there is no fork choice ambiguity. The chain is deterministic given the validator set.

This makes PoA attractive for enterprise use cases where 7-day optimistic rollup withdrawal windows or 12-minute Casper finality are unacceptable.

## Energy use

Negligible. Validators sign blocks with a hash and a signature. No hash puzzle, no large stake committee. A validator node runs comfortably on a single-core VM.

## References

- [EIP-225: Clique PoA Consensus Protocol, Gerber (2017)](https://eips.ethereum.org/EIPS/eip-225), the Clique specification
- [Hyperledger Besu PoA Documentation](https://besu.hyperledger.org/private-networks/how-to/configure/consensus/clique), Clique and IBFT2 configuration
- [Quorum (now ConsenSys Quorum)](https://docs.goquorum.consensys.io/concepts/consensus), enterprise PoA/BFT options

## Related topics

- [Delegated Proof-of-Stake](../delegated-proof-of-stake/), elected validators instead of a whitelist
- [Byzantine Fault Tolerance](../byzantine-fault-tolerance/), explicit multi-round voting for finality with a known set
- [Proof-of-Stake](../proof-of-stake/), permissionless alternative with economic security
- [Ethereum](../../cryptocurrency/ethereum/), whose testnets historically used PoA
