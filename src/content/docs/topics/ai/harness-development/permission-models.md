---
title: Permission and Trust Models
description: "Deny, ask, allow architectures, human approval gates, scoped credentials, sandboxing, and trust boundaries for agentic tool execution."
parent: harness-development
tags: [security, permissions, agents, sandboxing]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## Permissions turn agent autonomy into a controlled surface

An agent harness needs a policy layer between model intent and real action. The model can request a tool call. The harness decides whether that request is allowed, denied, or needs user approval.

The policy has to balance momentum with safety. A read-only file listing should not wake the user every time. A deploy, payment, deletion, external message, credential read, or destructive shell command should not run silently.

The point is not to make the model trustworthy. The point is to make each action bounded even when the model is wrong, confused, or influenced by untrusted content.

## Key ideas

- **Fail-safe defaults**: Unknown actions should default to `ask` or `deny`, not `allow`. Adding a new tool should not silently grant new authority.
- **Deny wins**: Hard prohibitions should override user convenience. Examples include deleting outside the workspace, force-pushing a protected branch, or sending secrets externally.
- **Ask for irreversible actions**: Writes, sends, deploys, purchases, deletes, credential access, and production mutations need explicit approval.
- **Group approvals**: A prompt for every trivial action creates approval fatigue. Better UX groups related file edits, shows diffs, and asks once at the right boundary.
- **Sandboxing complements policy**: Filesystem roots, container boundaries, locked-down shells, network restrictions, and scoped tokens reduce the blast radius if policy fails.

## Trust levels

Not every input deserves the same authority:

- **Harness instructions**: trusted, versioned, and controlled by the system owner
- **User request**: trusted for intent, but not necessarily safe to execute blindly
- **Project files**: trusted within the project, but still capable of containing prompt injection
- **Tool output**: depends on source and should be labeled
- **Public web content**: untrusted
- **Generated summaries**: useful, but not authoritative

Permissions should reflect those trust levels. A web page should not be able to cause a write. A generated summary should not be treated as proof that a test passed.

## Designing approval prompts

Good approvals show the user what will happen:

- the exact tool or external service
- files, branches, URLs, accounts, or records affected
- whether the action is reversible
- the reason the model requested it
- a concise diff or preview when available

Bad approvals ask vague questions such as "Allow command?" without enough context. That trains users to click through and removes the safety value.

## Common failure modes

- **Silent privilege expansion**: A new tool is added and inherits broad allow rules.
- **Policy by prompt**: The model is told not to do dangerous things, but the harness still permits the dangerous tool call.
- **Over-broad credentials**: The agent receives a full user token when it only needs read access to one resource.
- **No audit trail**: After an incident, nobody can reconstruct what the agent requested and what was approved.
- **Permission mismatch across tools**: A shell tool bypasses restrictions enforced by a safer file-edit tool.

## Practical checklist

- Define deny, ask, and allow categories before exposing tools.
- Default unknown actions to ask or deny.
- Scope credentials by task, resource, and lifetime.
- Record approvals and tool arguments for audit.
- Treat sandboxing as a required second layer, not an optional extra.

## References

- [Claude Code settings: permissions](https://docs.claude.com/en/docs/claude-code/settings)
- [Effective Harnesses for Long-Running Agents, Anthropic](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Designing Agentic Loops, Simon Willison](https://simonwillison.net/2025/Sep/30/designing-agentic-loops/)
- [OWASP LLM Top 10, Excessive Agency](https://owasp.org/www-project-top-10-for-large-language-model-applications/)

## Related topics

- [Prompt injection defense](../../prompt-engineering/prompt-injection-defense/), why permissions matter under untrusted content
- [Tool design and schema discipline](../tool-design/), making tool calls narrow and recoverable
- [Context engineering](../context-engineering/), labeling trust and state before the model acts
- [AI coding tool blindspots](../../coding-tool-blindspots/), common failure modes in coding agents
