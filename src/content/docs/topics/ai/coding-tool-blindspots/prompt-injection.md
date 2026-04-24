---
title: Prompt Injection and the Lethal Trifecta
description: Why prompt injection remains structurally unsolved, Simon Willison's "lethal trifecta" framing, and what defensive patterns actually work.
parent: coding-tool-blindspots
tags: [security, prompt-injection, agents]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

Tool outputs are model inputs. When an agent reads a file, web page, issue body, or API response, malicious instructions in that content can hijack subsequent model behavior. There is no known sanitization approach that reliably prevents this, the model cannot distinguish harness-authored from attacker-authored text in a tool result. Defense is about limiting what a hijacked agent can *do*, not trying to keep it from being hijacked.

## Key ideas

- **The lethal trifecta** (Simon Willison), Prompt injection becomes catastrophic when an agent has *all three*: access to private data, exposure to untrusted content, and the ability to exfiltrate externally. Remove any one edge and the worst-case is neutralized.
- **Real exploits have been demonstrated** against Claude Code, Cursor, Copilot, Codex. These aren't theoretical.
- **Least privilege per tool**, A web-fetch tool shouldn't also be able to commit or send email. Partitioning the tool set is the most effective structural defense.
- **Human-in-the-loop for irreversible actions**, Approval gates on writes, deploys, sends, destructive reads. Pair with UX that resists rubber-stamping.
- **Content provenance labels**, Tagging tool output as "untrusted source" helps at the margin but doesn't prevent injection.
- **Deterministic output channels**, Avoid auto-rendered URLs, auto-executed shell, image-tag fetches, or any side-channel that can exfiltrate data the model has seen.

## References

- [Prompt injection tag, Simon Willison](https://simonwillison.net/tags/prompt-injection/)
- [The Lethal Trifecta for AI Agents, Simon Willison](https://simonw.substack.com/p/the-lethal-trifecta-for-ai-agents)
- [Design Patterns for Securing LLM Agents against Prompt Injections, Simon Willison (2025)](https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/)
- [OWASP LLM Top 10, Prompt Injection](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
