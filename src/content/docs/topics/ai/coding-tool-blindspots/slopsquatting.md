---
title: Slopsquatting and Supply-Chain Risk
description: When LLMs hallucinate plausible-sounding package names and attackers register them — turning a hallucination into a real supply-chain attack.
parent: coding-tool-blindspots
tags: [security, supply-chain, hallucination]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

LLMs routinely invent package names that sound real. 21.7% of packages recommended by open-source models are non-existent; 5.2% for commercial models (Lasso Security, 2025). Attackers have now started **squatting** those hallucinated names — registering the packages on npm, PyPI, and similar registries with malicious payloads. A developer trusting the model copies the install command, and the attack succeeds. This is "slopsquatting," a sibling of typosquatting.

## Key ideas

- **Hallucination rate varies by model and domain** — Worse on lower-resource languages and niche ecosystems; better on JS/Python popular packages. No model is immune.
- **Stability across prompts matters** — A hallucinated name that the model re-emits consistently across users/prompts is more valuable to attackers than a one-off. Research finds many hallucinations *are* stable.
- **CI-time verification is the practical mitigation** — Resolve every import in AI-suggested code against the real registry. Flag unknown packages before they reach install.
- **Don't trust `pip install`/`npm install` from an agent transcript** — Even if the code is correct elsewhere, the install line may reference a hallucinated package.
- **Pin and review** — Lockfiles, provenance attestations (npm provenance, Sigstore), and version pinning all help contain damage from a successful install.

## References

- [Lasso Security — AI Package Hallucinations](https://www.lasso.security/blog/ai-package-hallucinations)
- [Library Hallucinations in LLMs (arXiv 2509.22202)](https://arxiv.org/pdf/2509.22202)
- [Slopsquatting explained — The Register](https://www.theregister.com/2025/04/12/ai_code_suggestions_sabotage_supply_chain/)
- [npm provenance](https://docs.npmjs.com/generating-provenance-statements)
