---
title: Cryptocurrency
description: "Bitcoin, Ethereum, Monero, stablecoins, staking, and wrapped assets: the major networks, the assets they carry, and how they relate to each other."
parent: blockchain
tags: [blockchain, cryptocurrency, bitcoin, ethereum, monero, stablecoins]
status: draft
created: 2026-06-05
updated: 2026-06-05
---

Cryptocurrencies are digital assets whose ownership and transfer are enforced by a blockchain's consensus rules, not by any issuer or custodian. Each network makes different tradeoffs between throughput, privacy, programmability, and decentralization.

## Topics

- [Bitcoin](./bitcoin/), the original proof-of-work blockchain: UTXO model, SHA-256 mining, the 21M cap, Lightning Network, and Taproot
- [Ethereum](./ethereum/), the programmable blockchain: EVM, smart contracts, proof-of-stake after the Merge, ERC token standards, and the rollup ecosystem
- [Monero](./monero/), privacy by default: ring signatures, stealth addresses, RingCT with Bulletproofs, and RandomX ASIC-resistant mining
- [Tether and Stablecoins](./tether/), fiat-pegged tokens: USDT, USDC, DAI, how reserves work, and the three models for how they break
- [Wrapped Currencies](./wrapped-currencies/), tokenized cross-chain representations: WBTC, wETH, bridge protocols, and why bridges attract the largest exploits
- [Staking](./staking/), locking tokens to participate in proof-of-stake: Ethereum validator duties, slashing, liquid staking (stETH, rETH), and restaking

## How the topics connect

Bitcoin and Ethereum represent the two dominant architectures: UTXO model versus account model, proof-of-work versus proof-of-stake. Monero extends Bitcoin's UTXO model with cryptographic privacy. Stablecoins like Tether and DAI run on Ethereum as ERC-20 tokens. Wrapped currencies let assets from one chain (WBTC from Bitcoin) be used on another (Ethereum DeFi). Staking is the economic mechanism that underlies Ethereum's proof-of-stake security.

## Related topics

- [Consensus Mechanisms](../consensus-mechanisms/), how each network achieves agreement: PoW, PoS, and the alternatives
- [Distributed Cryptography](../../cryptographic-systems/distributed-cryptography/), the cryptographic primitives that secure these networks: threshold signatures, ZKPs, and distributed key generation
- [Zero-Knowledge Proofs](../../cryptographic-systems/distributed-cryptography/zero-knowledge-proofs/), used in ZK-rollups and Monero's Bulletproofs
- [CAP Theorem](../../system-design/cap-theorem/), the consistency and availability tradeoff all blockchains navigate
