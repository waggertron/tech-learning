---
title: Blockchain and Cryptocurrencies
description: "Bitcoin, Ethereum, privacy coins, stablecoins, staking, wrapped assets, and the consensus algorithms that keep distributed ledgers consistent without a central authority."
category: blockchain
tags: [blockchain, cryptocurrency, bitcoin, ethereum, consensus]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

A blockchain is an append-only ledger replicated across thousands of nodes, where consensus rules determine which transactions are valid and in what order they appear. No single operator controls the ledger. Participants agree on its state by following a protocol that makes cheating economically irrational or cryptographically infeasible.

This category covers the major networks, the assets they carry, and the mechanisms that keep them running.

## Topics

- [Bitcoin](./bitcoin/), the original proof-of-work blockchain: UTXO model, SHA-256 mining, the halving, Lightning Network, and Taproot
- [Ethereum](./ethereum/), the programmable blockchain: EVM, smart contracts, proof-of-stake, ERC standards, and the rollup ecosystem
- [Monero](./monero/), the privacy-first coin: ring signatures, stealth addresses, RingCT, and ASIC-resistant mining
- [Tether and Stablecoins](./tether/), fiat-pegged tokens: USDT, USDC, DAI, how reserves work, and where they break
- [Wrapped Currencies](./wrapped-currencies/), tokenized cross-chain representations: WBTC, wETH, bridges, and bridge exploits
- [Staking](./staking/), locking tokens to participate in proof-of-stake: validators, slashing, liquid staking, and yield
- [Consensus Mechanisms](./consensus-mechanisms/), how blockchains agree: proof-of-work, proof-of-stake, and the alternatives

## How the topics connect

Bitcoin and Ethereum represent the two dominant architectures: UTXO model versus account model, proof-of-work versus proof-of-stake. Monero extends Bitcoin's UTXO model with cryptographic privacy. Stablecoins like Tether run on top of Ethereum and other chains as ERC-20 tokens. Wrapped currencies let assets from one chain be used on another. Staking is the economic mechanism underlying proof-of-stake consensus. The consensus mechanisms section ties together how each network achieves agreement.

## Related topics

- [Distributed Cryptography](../cryptographic-systems/distributed-cryptography/), the cryptographic primitives (threshold signatures, ZKPs, DKG) that secure blockchain networks
- [Zero-Knowledge Proofs](../cryptographic-systems/distributed-cryptography/zero-knowledge-proofs/), used in ZK-rollups and privacy coins
- [CAP Theorem](../system-design/cap-theorem/), the consistency and availability tradeoff blockchains navigate
- [Distributed Locking](../system-design/distributed-locking/), consensus in non-blockchain distributed systems
