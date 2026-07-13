---
title: Wrapped Currencies
description: "Tokenized cross-chain representations of assets: how WBTC, wETH, and bridge protocols lock assets on one chain and mint equivalents on another, and why bridges attract the largest exploits in crypto."
parent: cryptocurrency
tags: [blockchain, wrapped-tokens, bridges, wbtc, weth, defi]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

Bitcoin cannot run Ethereum smart contracts. Ethereum's ETH does not conform to the ERC-20 standard that DeFi protocols expect. Wrapped currencies solve both problems by representing an asset from one context as a token in another, maintaining a 1:1 redeemable peg with the underlying.

## Why wrapping exists

Most DeFi protocols on Ethereum expect ERC-20 tokens. ETH itself predates ERC-20 and does not implement the interface. A Uniswap pool cannot hold raw ETH alongside USDC in the same way it holds two ERC-20 tokens. Wrapping ETH into WETH (Wrapped Ether) converts it to an ERC-20 token backed 1:1 by ETH.

Bitcoin is even more isolated. The Bitcoin blockchain has no way to express "this UTXO can now be used on Ethereum." Wrapping BTC requires a bridge.

## wETH

wETH is the simplest wrapped currency: a smart contract where depositing ETH mints an equal amount of WETH, and burning WETH releases ETH.

```solidity
// Simplified WETH contract
contract WETH {
    mapping(address => uint) public balanceOf;

    function deposit() public payable {
        balanceOf[msg.sender] += msg.value;
    }

    function withdraw(uint amount) public {
        require(balanceOf[msg.sender] >= amount);
        balanceOf[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}
```

The contract holds ETH in reserve. WETH is always redeemable for ETH at 1:1 with no counterparty risk beyond the smart contract itself. The WETH contract at `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` on Ethereum mainnet has held billions of dollars without incident since 2017.

## WBTC

Wrapped Bitcoin (WBTC) brings BTC onto Ethereum as an ERC-20 token. Unlike WETH, WBTC requires a custodian because Bitcoin and Ethereum are separate blockchains with no native bridge.

```
Minting WBTC:
  User sends BTC to BitGo's Bitcoin custody address
  BitGo verifies receipt and signals the WBTC contract
  WBTC contract mints 1 WBTC per 1 BTC received

Redeeming:
  User burns WBTC on Ethereum
  BitGo releases the equivalent BTC to the user's Bitcoin address
```

BitGo is the primary custodian. The WBTC DAO (a multisig of exchanges and DeFi projects) governs the protocol and can add or remove custodians.

**The centralization risk**: BitGo holds the underlying BTC. A compromise of BitGo's custody infrastructure, a regulatory seizure, or an insider theft would break the peg. WBTC holders are exposed to BitGo's operational risk in a way that wETH holders are not exposed to any company.

In August 2023, BitGo announced plans to transfer WBTC custody to BiT Global (a Justin Sun-affiliated entity). The DeFi community responded by removing WBTC from lending protocol collateral lists, citing concerns about centralization.

## Bridge mechanics

Cross-chain bridges generalize the WBTC pattern to arbitrary assets and chains.

**Lock-and-mint**: lock the asset on the origin chain in a bridge contract, mint a wrapped version on the destination chain.

**Burn-and-release**: burn the wrapped version on the destination chain, release the locked asset on the origin chain.

```
Chain A           Bridge            Chain B
  |                 |                  |
  | -- lock BTC --> |                  |
  |                 | --- mint WBTC -> |
  |                 |                  |
  |                 | <- burn WBTC --- |
  | <- release BTC- |                  |
```

The bridge's security reduces to: who controls the lock contract on Chain A and the mint contract on Chain B? In custodial bridges (WBTC), a company does. In validator bridges (Wormhole, early Ronin), a multisig of validators does. In native bridges (IBC), the underlying consensus of both chains does.

## Bridge exploits

Bridges are among the most attacked targets in crypto because they pool large reserves of locked assets.

| Exploit | Year | Amount | Cause |
| --- | --- | --- | --- |
| Ronin Network | 2022 | $625M | 5-of-9 validator keys compromised (North Korea) |
| Wormhole | 2022 | $320M | Signature verification bypass in Solana contract |
| Nomad | 2022 | $190M | Initialization bug allowed anyone to drain funds |
| Harmony Horizon | 2022 | $100M | 2-of-5 multisig keys compromised |

The Ronin and Harmony hacks both exploited low-threshold multisigs: once an attacker controlled enough private keys, they could approve arbitrary withdrawals. Wormhole and Nomad were smart contract bugs.

The total lost to bridge exploits in 2022 alone exceeded $2 billion.

## Decentralized bridge approaches

**IBC (Inter-Blockchain Communication)**: Cosmos's native cross-chain protocol. Each chain runs a light client of the other and verifies block headers. There is no separate bridge operator. Security is equivalent to the weakest chain's consensus.

**LayerZero**: uses an oracle (Chainlink or others) to relay block headers and a separate relayer to relay transaction proofs. Security depends on the oracle and relayer not colluding.

**Chainlink CCIP**: Chainlink's cross-chain protocol backed by the decentralized oracle network. Risk of operator collusion replaced by decentralized committee risk.

None of these are as trust-minimized as same-chain contracts, but they reduce the attack surface compared to a 5-of-9 multisig.

## Canonical vs third-party bridges

Ethereum L2s have canonical bridges maintained by the L2 team, with optimistic withdrawal windows (7 days for Arbitrum and Optimism) before funds can leave to L1. These delays exist to allow fraud proofs. Third-party bridges offer faster withdrawals but introduce additional trust assumptions.

## Gotchas

- **Peg breaks**: wrapped tokens can trade below the underlying if confidence in the custodian or bridge collapses. This happened to WBTC during the BiT Global transition fears and to bridged assets on exploited chains.
- **Multiple bridge versions of the same asset**: Ethereum may have both Wormhole-USDC and Stargate-USDC. Liquidity is fragmented and they are not fungible on-chain.
- **Smart contract risk on both ends**: a bug in either the origin contract or the destination contract can break the peg. Users are exposed to two attack surfaces instead of one.
- **Regulatory risk**: custodial bridges like WBTC can blacklist addresses, freeze redemptions, or be ordered to do so by regulators.

## References

- [WBTC Whitepaper](https://wbtc.network/assets/wrapped-bitcoin-whitepaper.pdf), the original WBTC design
- [IBC Protocol Specification](https://github.com/cosmos/ibc), Cosmos IBC spec
- [Ronin Network Post-Mortem (Axie Infinity)](https://roninblockchain.substack.com/p/community-alert-ronin-validators), the largest bridge hack post-mortem
- [Jump Crypto Wormhole Post-Mortem](https://wormhole.com/news/wormhole-uninitialized-proxy-bugfix-review), Wormhole exploit analysis

## Related topics

- [Ethereum](../ethereum/), the primary destination chain for most wrapped assets
- [Bitcoin](../bitcoin/), the origin chain for WBTC
- [Tether and Stablecoins](../tether/), stablecoins run on the same bridge infrastructure
- [Consensus Mechanisms](../../consensus-mechanisms/), bridge security often depends on the consensus of both connected chains
