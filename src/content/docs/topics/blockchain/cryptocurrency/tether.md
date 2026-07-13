---
title: Tether and Stablecoins
description: "Fiat-pegged tokens: how USDT, USDC, and DAI maintain their pegs, what backs them, the reserve controversy, and how the three stablecoin models each break differently."
parent: cryptocurrency
tags: [blockchain, stablecoins, tether, usdt, usdc, dai, defi]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

Cryptocurrencies like Bitcoin and Ethereum are volatile. A stablecoin is a token pegged to a reference asset (almost always 1 USD) so it can be used for payments, savings, and DeFi without exposure to crypto price swings. Three distinct models achieve the peg through different mechanisms, and each fails differently.

## The three models

**Fiat-backed**: the issuer holds USD (or USD-equivalent) reserves and mints tokens 1:1. The peg holds as long as the issuer is solvent and the reserves actually exist. Examples: USDT, USDC.

**Crypto-collateralized (overcollateralized)**: smart contracts hold collateral worth more than the issued stablecoin. The overcollateralization absorbs price drops. Examples: DAI, LUSD.

**Algorithmic**: a protocol adjusts supply to maintain the peg using market incentives, sometimes with a paired governance token as the shock absorber. No hard backing. Examples: UST/LUNA (collapsed), FRAX (hybrid).

## Tether (USDT)

Tether, launched in 2014, is the largest stablecoin by market cap and volume. It runs on Ethereum, Tron, Solana, and a dozen other chains, with each chain's supply independently managed.

**How minting works**: Tether Ltd. authorizes partners (large institutions and exchanges) to deposit USD and receive freshly minted USDT. Retail users cannot mint directly. Redemption (burning USDT for USD) requires a Tether account and a minimum transaction size.

**The reserve controversy**: for years, Tether represented USDT as 100% backed by USD in a bank account. The New York Attorney General and CFTC both found this was false. Tether settled with the CFTC in 2021 for $41 million without admitting wrongdoing. Tether's reserves have historically included commercial paper, secured loans, and other assets, not just cash and T-bills. As of 2024, Tether reports shifting reserves toward US Treasury bills, but independent audits (not just attestations) remain unavailable.

**Why it still dominates**: USDT is deeply embedded in crypto infrastructure. Most trading pairs on centralized and decentralized exchanges are denominated in USDT. The network effects and liquidity make it the default.

## USDC

USD Coin, issued by Circle and Coinbase (formerly via the Centre consortium), launched in 2018 and is the second-largest stablecoin.

USDC holds reserves in cash and short-duration US Treasury bills, segregated in regulated financial institutions. Circle publishes monthly reserve attestations by Grant Thornton (an accounting firm). USDC does not represent the reserves as audited by a Big Four firm, but attestations are more transparent than Tether's disclosures.

USDC is the preferred stablecoin for regulated entities and many DeFi protocols because of its disclosure practices.

**March 2023 de-peg**: USDC briefly fell to $0.87 when Circle disclosed $3.3B of USDC reserves were held at Silicon Valley Bank, which had just failed. The peg recovered within 48 hours after the FDIC backstop guarantee. This demonstrated that even a transparent, well-managed fiat stablecoin carries counterparty risk at its custodial bank.

## DAI

DAI is issued by MakerDAO's smart contracts on Ethereum. No company holds the reserves. Users lock collateral (ETH, WBTC, USDC, and other approved assets) in Collateralized Debt Positions (CDPs, now called Vaults) and mint DAI up to a collateralization ratio.

```
User locks 1.5 ETH (worth $3,000) in a Vault
User mints up to $2,000 DAI (150% collateral ratio required)
If ETH price drops: position is liquidated automatically by keepers
```

The liquidation mechanism keeps DAI overcollateralized. If collateral value falls below the liquidation threshold, automated bots (keepers) buy the collateral at a discount and repay the debt.

The stability fee (interest rate) is set by MKR governance and adjusts to maintain the peg by making borrowing more or less attractive.

**Limitation**: DAI's supply is capped by how much collateral people want to lock up. It cannot scale to USDT/USDC sizes without taking on significant USDC backing (which MakerDAO now does, introducing centralization).

## UST/LUNA collapse (May 2022)

TerraUSD (UST) was an algorithmic stablecoin paired with LUNA, Terra's governance token. The mechanism:

- Burn $1 of LUNA to mint 1 UST
- Burn 1 UST to mint $1 of LUNA

This arbitrage mechanism was supposed to maintain the peg. When UST demand fell and redemptions started, new LUNA was minted to absorb the outflow. But LUNA's price fell because of the new supply, requiring even more LUNA to be minted, further depressing the price.

The result: a death spiral. $40B in value was destroyed in days. Luna went from $80 to near zero. UST, which had $18B in circulation, collapsed to cents.

The lesson: algorithmic stablecoins backed by their own volatile governance token have no exogenous value floor. They are stable in equilibrium but catastrophically unstable when confidence breaks.

## Comparison

| Stablecoin | Type | Backing | Transparency | Largest risk |
| --- | --- | --- | --- | --- |
| USDT | Fiat-backed | Mixed (T-bills, cash) | Attestation only | Tether Ltd. insolvency |
| USDC | Fiat-backed | Cash + T-bills | Monthly attestations | Custodial bank failure |
| DAI | Crypto-collateralized | ETH, WBTC, USDC | On-chain | Collateral price crash |
| FRAX | Hybrid | Partial collateral + AMO | On-chain + reports | Algorithmic component |
| UST | Algorithmic | LUNA (own token) | N/A | Collapsed May 2022 |

## De-peg risks

Every stablecoin has a failure mode:

- **Fiat-backed**: custodial bank failure, issuer insolvency, regulatory seizure of reserves
- **Crypto-collateralized**: collateral flash crash too fast for liquidations, liquidity crisis
- **Algorithmic**: loss of confidence triggering the death spiral; no floor exists below market psychology

## References

- [Tether CFTC Settlement Order (2021)](https://www.cftc.gov/PressRoom/PressReleases/8450-21), the regulatory action
- [The Collapse of Terra, Do Kwon, and the Limits of Algorithmic Stablecoins, Chainalysis (2022)](https://www.chainalysis.com/blog/terra-collapse/), post-mortem
- [MakerDAO CDP Technical Documentation](https://docs.makerdao.com/), the DAI system specification
- [Circle Reserve Reports](https://www.circle.com/en/usdc#transparency), monthly USDC attestations

## Related topics

- [Ethereum](../ethereum/), the primary chain where stablecoins circulate
- [Wrapped Currencies](../wrapped-currencies/), tokenized cross-chain asset movement
- [Staking](../staking/), DeFi yield via protocol participation
- [Bitcoin](../bitcoin/), the non-pegged base-layer alternative
