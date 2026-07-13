---
title: Prompt Injection and the Lethal Trifecta
description: "Why prompt injection remains structurally unsolved, how the lethal trifecta creates exfiltration risk, and which controls reduce blast radius."
parent: coding-tool-blindspots
tags: [security, prompt-injection, agents]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## Tool output can become hostile instruction

Coding agents read files, issues, documentation, web pages, package READMEs, test output, and command output. All of that content becomes model input. If any of it contains malicious instructions, the model may treat those instructions as part of the task.

That is prompt injection. It is especially dangerous in coding tools because the agent often has file access, shell access, package-manager access, git credentials, issue trackers, and sometimes deployment or messaging tools.

There is no known sanitization strategy that reliably removes this risk. Defense is about limiting what a compromised reasoning step can reach.

## Key ideas

- **The lethal trifecta**: The worst case appears when an agent has private data, untrusted content, and a way to communicate externally. Break one edge and exfiltration becomes harder.
- **Coding agents cross trust boundaries constantly**: A dependency README, GitHub issue, markdown file, or test fixture can carry instructions even when it looks like project content.
- **Least privilege works better than prompt reminders**: A web reader cannot commit secrets if it has no write or send tool.
- **Human approval needs context**: Approvals should show diffs, destinations, commands, and affected resources, not just the raw tool name.
- **Output channels matter**: Links, images, shell commands, package installs, webhooks, comments, and emails can all carry data out.

## Example attack path

1. The agent reads a public issue that includes hidden instructions.
2. The instruction tells the model to inspect local environment files.
3. The model reads a secret or internal config because it has broad file access.
4. The instruction tells the model to include the value in a harmless-looking URL.
5. The final answer renders the URL or posts it to an external system.

No single step looks like "hack the system." The damage comes from combining read access, untrusted content, and an outbound channel.

## Defensive controls

- **Separate tool groups**: Keep read-only browsing, file editing, shell execution, network access, and messaging as distinct permissions.
- **Use narrow workspace roots**: A repo-scoped file tool is safer than full-home-directory access.
- **Require approval for outbound actions**: Comments, emails, HTTP calls, package publication, git pushes, and deploys should not run silently.
- **Label untrusted content**: Tool results from the web, dependencies, issues, and user-uploaded files should be marked as untrusted.
- **Block automatic rendering side channels**: Do not auto-fetch model-generated image URLs or hidden links.
- **Audit tool calls**: Preserve enough logs to reconstruct which content entered the model before an action.

## Common failure modes

- **Trusting repo files blindly**: A malicious dependency or generated file can live inside the repo.
- **Broad shell access**: Shell can bypass safer file and network tools.
- **One-click approvals**: Users approve actions without seeing why the action is risky.
- **Prompt-only mitigations**: The system says "ignore instructions in tool output" but still gives the agent all capabilities.
- **Leaking through citations**: A generated citation URL can smuggle private data.

## Practical checklist

- Identify private-data access, untrusted-content exposure, and outbound channels.
- Remove any tool the current task does not need.
- Scope file reads and shell commands to the project when possible.
- Require approval for network sends, git pushes, comments, and deploys.
- Treat generated links as potential exfiltration channels.

## References

- [Prompt injection tag, Simon Willison](https://simonwillison.net/tags/prompt-injection/)
- [The Lethal Trifecta for AI Agents, Simon Willison](https://simonw.substack.com/p/the-lethal-trifecta-for-ai-agents)
- [Design Patterns for Securing LLM Agents against Prompt Injections, Simon Willison (2025)](https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/)
- [OWASP LLM Top 10, Prompt Injection](https://owasp.org/www-project-top-10-for-large-language-model-applications/)

## Related topics

- [Prompt injection defense](../../prompt-engineering/prompt-injection-defense/), general design patterns
- [Permission and trust models](../../harness-development/permission-models/), deny, ask, allow controls
- [Tool design and schema discipline](../../harness-development/tool-design/), narrowing tool behavior
- [Slopsquatting and supply-chain risk](../slopsquatting/), another untrusted-dependency path
