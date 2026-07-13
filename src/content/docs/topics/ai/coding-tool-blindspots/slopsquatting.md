---
title: Slopsquatting and Supply-Chain Risk
description: "How hallucinated package names become supply-chain risk, why attackers register plausible names, and how CI can block unknown dependencies."
parent: coding-tool-blindspots
tags: [security, supply-chain, hallucination]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## Hallucinated dependencies become real attack paths

LLMs routinely invent package names that sound real. A model may recommend `fastapi-auth-tools`, `react-table-exporter`, or `django-secure-jwt` with the same confidence it uses for real packages.

Slopsquatting turns that hallucination into a supply-chain attack. An attacker registers plausible hallucinated names on npm, PyPI, or another package registry. A developer copies the model's install command. The malicious package is now part of the project.

This is a sibling of typosquatting, but the source of traffic is different. Typosquatting waits for humans to mistype a known package. Slopsquatting waits for models to recommend a package that never existed.

## Key ideas

- **Hallucination rate varies by model and ecosystem**: Popular JavaScript and Python packages are easier for models to remember. Niche ecosystems, new libraries, and internal package names are riskier.
- **Stable hallucinations are valuable**: A one-off invented name is less useful to attackers. A name that many prompts reproduce can become a target.
- **Install commands are high-risk output**: `pip install`, `npm install`, `go get`, and `cargo add` lines should be treated as untrusted until verified.
- **Registry existence is not enough**: A package can exist and still be malicious, abandoned, newly registered, or unrelated to the intended library.
- **Lockfiles and provenance help**: Version pinning, lockfile review, provenance attestations, and dependency scanning reduce the damage if a bad package is suggested.

## What to verify

CI should reject unknown or suspicious dependencies before installation:

- package exists in the expected registry
- package name matches official documentation
- maintainer, repository, and project homepage look legitimate
- release age and download patterns are plausible
- lockfile changes are reviewed
- package scripts are checked for install-time execution
- dependency license and transitive dependency risk are acceptable

For generated code, verify imports as well as install commands. A model can add an import for a package that no one explicitly asked to install.

## Safer workflow

Use this workflow when an AI coding tool suggests a new dependency:

1. Ask whether the dependency is necessary or whether the standard library already solves the problem.
2. Check the package against official docs or the registry.
3. Prefer established packages already used in the repo.
4. Pin the version through the normal package manager.
5. Review lockfile changes.
6. Run dependency and secret scanners before merge.

The right default is skepticism. A dependency suggested by a model should enter the codebase through the same review path as a dependency suggested by a human.

## Common failure modes

- **Copying generated install commands directly**: The install works because the attacker registered the name.
- **Trusting plausible names**: The name sounds like the ecosystem's naming style, which is exactly why the attack works.
- **Ignoring transitive dependencies**: The top-level package looks harmless but pulls risky dependencies.
- **Skipping lockfile review**: The malicious change is hidden in hundreds of generated lockfile lines.
- **Allowing install scripts by default**: Registry packages can execute code during install in some ecosystems.

## Practical checklist

- Resolve every new dependency against the real registry and official docs.
- Prefer dependencies already approved in the repo.
- Review lockfile diffs.
- Run dependency scanning in CI.
- Treat AI-generated install commands as untrusted input.

## References

- [Lasso Security, AI Package Hallucinations](https://www.lasso.security/blog/ai-package-hallucinations)
- [Library Hallucinations in LLMs (arXiv 2509.22202)](https://arxiv.org/pdf/2509.22202)
- [Slopsquatting explained, The Register](https://www.theregister.com/2025/04/12/ai_code_suggestions_sabotage_supply_chain/)
- [npm provenance](https://docs.npmjs.com/generating-provenance-statements)

## Related topics

- [AI coding tool blindspots](../), the broader failure map
- [Prompt injection and the lethal trifecta](../prompt-injection/), another supply-chain-adjacent agent risk
- [Secrets, keys, and tokens](../../../ops/secrets-keys-tokens/), avoiding credential leaks during dependency changes
- [Testing](../../../testing/), where dependency changes should be validated before release
