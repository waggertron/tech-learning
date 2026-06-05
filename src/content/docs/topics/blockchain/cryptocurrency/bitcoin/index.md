---
title: Bitcoin
description: "The original proof-of-work blockchain: UTXO model, SHA-256 mining, the 21M supply cap, Lightning Network payment channels, and Taproot Schnorr signatures."
category: blockchain
tags: [blockchain, bitcoin, proof-of-work, utxo, lightning-network]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

Bitcoin is the first decentralized digital currency. Launched in 2009 by the pseudonymous Satoshi Nakamoto, it solves the double-spend problem without a trusted intermediary by using a proof-of-work chain where rewriting history requires outpacing the entire network's hash power.

## The UTXO model

Bitcoin does not store balances. It stores Unspent Transaction Outputs (UTXOs): discrete chunks of bitcoin that have been sent to an address and not yet spent.

```
Transaction:
  Inputs:  [UTXO from tx A, output 0]   (0.5 BTC)
           [UTXO from tx B, output 1]   (0.3 BTC)
  Outputs: [address 1bc...]             (0.75 BTC)  <- recipient
           [address 1def...]            (0.04 BTC)  <- change back to sender
           (0.01 BTC goes to miner as fee)
```

Inputs reference previous outputs by their transaction ID and output index. Outputs specify a locking script (scriptPubKey) and an amount. Spending an output means providing a valid unlocking script (scriptSig or witness data) that satisfies the locking condition.

Your "balance" is the sum of all UTXOs your keys can unlock. There is no account with a running total.

## Mining and SHA-256 PoW

Bitcoin uses double-SHA-256 as its proof-of-work function. Miners repeatedly hash a block header (varying the nonce field) until the output falls below a target:

```
SHA256(SHA256(block_header)) < target
```

The target determines difficulty. A lower target means fewer valid hashes, so more work is required on average to find one. Bitcoin adjusts difficulty every 2016 blocks (roughly two weeks) to keep the average block time near 10 minutes.

A block header is 80 bytes:
- Version (4 bytes)
- Previous block hash (32 bytes)
- Merkle root of all transactions (32 bytes)
- Timestamp (4 bytes)
- Bits (encoded target, 4 bytes)
- Nonce (4 bytes, ~4 billion values)

When the 4-byte nonce space is exhausted, miners also vary the timestamp and the coinbase transaction (which changes the merkle root).

## The 21 million cap and halving

Bitcoin's supply is hard-coded to never exceed 21 million BTC. The mechanism is the block reward:

- Block 0 through 209,999: 50 BTC per block
- Block 210,000 through 419,999: 25 BTC per block
- Block 420,000 through 629,999: 12.5 BTC per block
- Block 630,000 through 839,999: 6.25 BTC per block
- Block 840,000 onward (April 2024): 3.125 BTC per block

The reward halves every 210,000 blocks. The total supply converges to 21M BTC as a geometric series (50 + 25 + 12.5 + ...) = 100 * sum(1/2^n) * 210,000 blocks * ... This continues until around the year 2140, when the reward rounds to zero satoshis.

After that, miners are paid only by transaction fees.

## Transaction scripts

Bitcoin transactions are validated by a simple stack-based scripting language. The most common output types:

**P2PKH (Pay to Public Key Hash)**: the standard output type for most Bitcoin addresses (starting with 1).
```
Locking script:   OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
Unlocking script: <signature> <pubKey>
```

**P2SH (Pay to Script Hash)**: redeem script is hashed; addresses start with 3.
```
Locking script:   OP_HASH160 <scriptHash> OP_EQUAL
Unlocking script: <serialized redeemScript> <data satisfying redeemScript>
```
Multisig wallets (2-of-3, 3-of-5) are commonly implemented as P2SH.

**P2WPKH (SegWit, native)**: witness data moved outside the transaction body; addresses start with bc1q.

**P2TR (Taproot)**: key-path or script-path spend; addresses start with bc1p.

## SegWit

Segregated Witness (BIP141, activated 2017) moved signature data (witness) outside the transaction body. This fixed transaction malleability (a third party could mutate a tx ID by changing the signature without invalidating it). It also effectively increased block capacity by discounting witness bytes.

SegWit is the prerequisite for the Lightning Network.

## Lightning Network

Bitcoin's base layer handles ~7 transactions per second. The Lightning Network scales this by moving most transactions off-chain:

```
Alice <------ payment channel ------> Bob
  |                                    |
  +-------- payment channel ---------- Carol
```

A payment channel is funded by a 2-of-2 multisig on-chain transaction. Alice and Bob can then exchange signed commitment transactions off-chain, each representing the current channel balance. Only opening and closing the channel hits the blockchain.

Payments route across channels using Hashed Time-Lock Contracts (HTLCs):

```
Alice pays Carol through Bob:
1. Carol generates secret R, sends hash H(R) to Alice
2. Alice creates HTLC to Bob: "pay Bob 0.01 BTC if he reveals R within 24h"
3. Bob creates HTLC to Carol: "pay Carol 0.01 BTC if she reveals R within 12h"
4. Carol reveals R to Bob, collects 0.01 BTC
5. Bob uses R to collect from Alice
```

The shorter timeout on Bob-Carol ensures Bob can collect from Alice if Carol cheats. The secret R is the payment preimage; its hash H(R) is the payment hash.

Lightning enables near-instant, sub-cent payments. Limitations: requires locking liquidity in channels, routing can fail for large payments, and nodes must stay online to receive.

## Taproot

Taproot (BIP340/341/342, activated November 2021) introduces:

**Schnorr signatures (BIP340)**: replace ECDSA. Schnorr signatures are linear, enabling key aggregation (MuSig2). A 3-of-3 multisig looks identical on-chain to a single-key spend.

**Tapscript (BIP342)**: updated script language with Schnorr validation.

**MAST (Merkelized Abstract Syntax Trees, BIP341)**: a complex spending condition (time lock OR multisig OR emergency key) is committed as a Merkle tree. The key-path spend (all parties agree) reveals nothing about the scripts. Only a script-path spend reveals the branch exercised.

The combined effect: multisig wallets, DLCs, and Lightning channel opens all look like simple single-key spends when parties cooperate. Privacy improves substantially.

## Key metrics

| Metric | Value |
| --- | --- |
| Block time | ~10 minutes |
| Block size | Up to 4 MB weight (1 MB base + witness discount) |
| On-chain throughput | ~7 TPS |
| Lightning throughput | Millions of TPS (theoretical) |
| Supply cap | 21,000,000 BTC |
| Smallest unit | 1 satoshi = 0.00000001 BTC |
| Consensus | SHA-256 proof-of-work |

## Gotchas

- **Dust outputs**: outputs below the minimum relay fee threshold (~546 satoshis for P2PKH) are non-standard and may not be relayed. UTXO consolidation is necessary for wallets with many small outputs.
- **Replace-by-fee (RBF)**: unconfirmed transactions can be replaced with a higher-fee version. Merchants accepting zero-confirmation payments for irreversible goods are exposed.
- **Mining centralization**: Bitcoin mining is ASIC-dominated and concentrated in large farms. The top 4 mining pools consistently control over 50% of hash rate.
- **Long reorg risk**: 6 confirmations (~1 hour) is the standard for irreversibility, but large-value transactions often wait for more.
- **Script limits**: Bitcoin Script is intentionally limited. Turing-complete smart contracts are not possible on the base layer.

## References

- [Bitcoin: A Peer-to-Peer Electronic Cash System, Nakamoto (2008)](https://bitcoin.org/bitcoin.pdf), the original whitepaper
- [BIP340: Schnorr Signatures for secp256k1](https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki), Taproot's signature scheme
- [BIP341: Taproot: SegWit version 1 spending rules](https://github.com/bitcoin/bips/blob/master/bip-0341.mediawiki), MAST and Taproot
- [BOLT Specifications (Lightning Network)](https://github.com/lightning/bolts), the Lightning Network protocol specs

## Related topics

- [Consensus Mechanisms](../consensus-mechanisms/), proof-of-work in detail
- [Ethereum](../ethereum/), the account-model alternative
- [Monero](../monero/), privacy extensions to the UTXO model
- [Threshold Signatures](../../cryptographic-systems/distributed-cryptography/threshold-signatures/), the cryptography behind multisig and MuSig2
