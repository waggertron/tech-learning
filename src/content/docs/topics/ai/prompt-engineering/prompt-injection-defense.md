---
title: Prompt Injection Defense
description: Design patterns for agentic systems that consume untrusted content via tools, limiting the blast radius rather than trying to sanitize prompts.
parent: prompt-engineering
tags: [security, prompt-injection, agents]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

Prompt injection is structurally unsolved: tool outputs are model inputs, and a web page, file, or issue body can contain instructions that hijack the agent. There is no known reliable way to "sanitize" prompts. The working defensive posture is to assume injection will succeed and design the blast radius accordingly.

## Key ideas

- **The lethal trifecta**, Simon Willison's framing: access to private data + exposure to untrusted content + ability to communicate externally. Break any one edge and the worst-case exfiltration is blocked.
- **Least privilege per tool**, A read-only web-fetch can't commit to git. A file editor can't hit the network. Partition the tool set so compromised reasoning can't reach dangerous actions.
- **Human-in-the-loop for irreversible actions**, Approval gates on writes, sends, deploys, and destructive reads. Pair with clear UX so approvals aren't rubber-stamped.
- **Content provenance labels**, Tag tool-returned content so the model can see "this came from an untrusted source." Helps but does not prevent injection.
- **Deterministic output channels**, Structure the final response so any exfiltration attempt has no path to an external system (no auto-rendered URLs, no auto-executed shell, etc.).

## References

- [Design Patterns for Securing LLM Agents against Prompt Injections, Simon Willison (2025)](https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/)
- [The Lethal Trifecta for AI Agents, Simon Willison](https://simonw.substack.com/p/the-lethal-trifecta-for-ai-agents)
- [Prompt injection tag, Simon Willison](https://simonwillison.net/tags/prompt-injection/)
- [OWASP LLM Top 10, Prompt Injection](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
