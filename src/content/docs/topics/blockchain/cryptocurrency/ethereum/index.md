---
title: Ethereum
description: "The programmable blockchain: EVM execution, smart contracts, the account model, proof-of-stake after the Merge, ERC token standards, rollup scaling, and MEV."
parent: cryptocurrency
tags: [blockchain, ethereum, evm, smart-contracts, proof-of-stake, rollups]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

Ethereum extends the blockchain idea from "ledger of payments" to "ledger of state transitions." Any computation can be encoded as a smart contract, deployed to the network, and executed by every node. The result is a global, decentralized runtime that no single party can halt or censor.

## The account model

Ethereum stores state as a mapping from 20-byte addresses to accounts. Every account has a balance and a nonce. Two types exist:

**Externally Owned Accounts (EOAs)**: controlled by a private key. Can send transactions, call contracts, and hold ETH. Have no code.

**Contract accounts**: controlled by code. Have a balance, nonce, code (immutable after deployment), and storage (mutable key-value map). Execute when called.

```
State:
  0x1234...  ->  { balance: 5 ETH, nonce: 42 }           (EOA)
  0xabcd...  ->  { balance: 0.1 ETH, nonce: 0,           (contract)
                   code: <EVM bytecode>,
                   storage: { 0x0: 1000, 0x1: 0x5678... } }
```

Unlike Bitcoin's UTXO model, balances are stored directly. A transfer is a state transition: subtract from sender, add to recipient.

## The Ethereum Virtual Machine

The EVM is a stack-based virtual machine with 256-bit words. Every full node executes every transaction. The result is deterministic world state.

Key properties:
- **Stack**: 1024 elements maximum, each 256 bits (32 bytes)
- **Memory**: byte-addressable, expands as needed, costs gas quadratically to prevent abuse
- **Storage**: 32-byte keys to 32-byte values, persisted on-chain, very expensive to write
- **Calldata**: read-only input data passed with a transaction, cheaper than memory

Gas metering prevents infinite loops. Every opcode has a gas cost. A transaction sets a gas limit; if execution consumes more gas than the limit, it reverts with all state changes undone, but the gas is still consumed.

## Gas and EIP-1559

Pre-EIP-1559 (pre-August 2021): senders bid a gas price, miners collected it all.

Post-EIP-1559: each block has a base fee that is burned (removed from supply). Senders can add a priority fee (tip) to incentivize inclusion.

```
Total fee per gas = base fee + priority fee (tip)
Base fee adjusts each block: +12.5% if last block was full, -12.5% if empty
```

When network demand is high, the base fee rises until demand falls. The burning mechanism makes ETH deflationary under high load: more ETH is burned than issued.

## Smart contracts

A smart contract is EVM bytecode stored at a contract address. It is deployed by sending a transaction with no `to` field and the bytecode in the `data` field. The contract address is deterministic (hash of deployer address and nonce).

Solidity example (simplified ERC-20):

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleToken {
    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;

    constructor(uint256 _supply) {
        totalSupply = _supply;
        balanceOf[msg.sender] = _supply;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}
```

The ABI (Application Binary Interface) describes the contract's functions and their argument types. Clients encode calls using the ABI; the EVM decodes them.

## The Merge

On September 15, 2022, Ethereum switched from proof-of-work to proof-of-stake. This is called "the Merge" because the existing execution layer (the chain running since 2015) merged with the Beacon Chain (the PoS chain running since December 2020).

Effects:
- Energy use dropped ~99.95% (no more mining)
- Block time changed from ~13 seconds (variable, PoW) to exactly 12 seconds per slot
- Issuance dropped ~90% (no more mining rewards)

## Validators and consensus

Ethereum PoS uses a committee-based BFT system:

```
Timeline:
  Epoch (6.4 min) = 32 slots
  Slot (12 sec)   = one block opportunity

  In each slot:
    One validator is selected to propose a block (RANDAO)
    A committee of ~512 validators attests to the head of the chain
```

Validators must stake 32 ETH to participate. They earn rewards for attesting and proposing, and are penalized for going offline or misbehaving.

**Slashing** removes at least 1/32 of a validator's stake and ejects them from the active set. The penalty scales with how many validators are slashed simultaneously: if 1/3 of the network is slashed together (indicating a coordinated attack), validators lose their entire stake.

**Finality**: Casper FFG (Friendly Finality Gadget) requires 2/3 of all validators to attest to a checkpoint to finalize it. A finalized block cannot be reverted without burning at least 1/3 of all staked ETH.

## ERC token standards

| Standard | Purpose | Example |
| --- | --- | --- |
| ERC-20 | Fungible tokens | USDC, LINK, UNI |
| ERC-721 | Non-fungible tokens (NFTs) | CryptoPunks, BAYC |
| ERC-1155 | Multi-token (fungible + NFT in one contract) | Game items |
| ERC-4626 | Tokenized vault standard | Yearn, Aave aTokens |

ERC-20's `transfer`, `approve`, and `transferFrom` functions form the backbone of DeFi: they let contracts spend tokens on behalf of users without taking custody.

## Layer 2: rollups

Ethereum's base layer handles ~15 TPS. Rollups execute transactions off-chain and post a compressed summary plus a validity proof (or fraud proof) to L1.

**Optimistic rollups** (Arbitrum, Optimism): assume transactions are valid; allow a 7-day challenge window for fraud proofs. Fast to execute, cheap, but withdrawals to L1 take 7 days without a bridge.

**ZK-rollups** (zkSync Era, StarkNet, Polygon zkEVM): post a cryptographic proof of correctness. Instant finality on L1. Proving is computationally expensive but amortized across thousands of transactions.

```
Rollup throughput: 1,000-4,000 TPS
Cost reduction vs L1: 10-100x cheaper per transaction
```

## MEV: Maximal Extractable Value

Validators (and previously miners) can reorder, include, or exclude transactions within a block. This creates extractable value:

- **Frontrunning**: see a pending DEX swap, insert a buy before it and a sell after (sandwich attack)
- **Backrunning**: arbitrage immediately after a large price-moving transaction
- **Liquidations**: compete to be first to liquidate an undercollateralized DeFi position

MEV-Boost separates block building from block proposing. Specialized block builders (Flashbots, etc.) assemble high-MEV blocks and bid for the right to have validators propose them. Most Ethereum blocks go through MEV-Boost.

## Gotchas

- **Reentrancy**: a contract calling an external contract before updating state allows the callee to re-enter and drain funds. The DAO hack (2016, $60M) is the canonical example. Use checks-effects-interactions pattern.
- **Integer overflow**: Solidity before 0.8.0 silently wrapped on overflow. Use SafeMath or upgrade to 0.8.x where overflow reverts by default.
- **Oracle manipulation**: contracts relying on on-chain price oracles (like DEX spot prices) can be manipulated with flash loans in the same block.
- **Irreversibility**: smart contract bugs cannot be patched without a proxy pattern or migration. The Parity multisig freeze (2017, $150M permanently locked) is the canonical example.

## References

- [Ethereum Yellowpaper, Wood (2014)](https://ethereum.github.io/yellowpaper/paper.pdf), the formal EVM specification
- [EIP-1559: Fee Market Change, Buterin et al. (2019)](https://eips.ethereum.org/EIPS/eip-1559), base fee and burning
- [Ethereum Proof-of-Stake Consensus Specifications](https://github.com/ethereum/consensus-specs), the Beacon Chain spec
- [Flash Boys 2.0: Frontrunning in Decentralized Exchanges, Daian et al. (2019)](https://arxiv.org/abs/1904.05234), the foundational MEV paper

## Related topics

- [Bitcoin](../bitcoin/), the UTXO-model alternative
- [Staking](../staking/), the economics of Ethereum validator participation
- [Consensus Mechanisms](../../consensus-mechanisms/), proof-of-stake in detail
- [Zero-Knowledge Proofs](../../../cryptographic-systems/distributed-cryptography/zero-knowledge-proofs/), the cryptography behind ZK-rollups
