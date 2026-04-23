---
title: Permission and Trust Models
description: Deny/ask/allow architectures, human-in-the-loop approval gates, and sandboxing strategies for agentic tool execution.
parent: harness-development
tags: [security, permissions, agents, sandboxing]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

An agent harness needs a policy layer that decides, per tool call, whether to execute silently, prompt the user, or refuse. The right model balances autonomy (don't wake the user for every `ls`) with safety (don't `rm -rf` unprompted). Claude Code's deny/ask/allow trie is a practical reference.

## Key ideas

- **Fail-safe defaults** — Unmatched tool calls should default to `ask`, not `allow`. New tools added to a harness must not gain silent execution privilege automatically.
- **Deny always wins** — In a deny/ask/allow ACL, a matching deny rule short-circuits everything. This lets you express hard prohibitions (`rm -rf /`, `git push --force main`) that no prompt can override.
- **Grouping over per-call prompts** — Per-tool-call yes/no fatigue trains users to click through. Prefer batch previews ("here are the 8 files I'm about to edit") or diff-level review.
- **Sandboxing complements permissions** — An editor tool restricted to a repo root, a shell tool with a locked-down PATH, or a VM/container boundary reduces blast radius if the policy layer is bypassed.
- **Scoped auth** — For tools that hit external services, issue scoped, short-lived credentials rather than the user's full creds. A compromised agent should lose as little as possible.

## References

- [Claude Code settings: permissions](https://docs.claude.com/en/docs/claude-code/settings)
- [Effective Harnesses for Long-Running Agents — Anthropic](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Designing Agentic Loops — Simon Willison](https://simonwillison.net/2025/Sep/30/designing-agentic-loops/)
- [OWASP LLM Top 10 — Excessive Agency](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
