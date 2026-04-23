---
title: Skill vs. Tool vs. Agent vs. Prompt
description: A conceptual map of the four primary extension mechanisms across the Claude stack, with cross-platform equivalents.
parent: skill-development
tags: [skills, tools, agents, mental-models]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

New users of agent frameworks often conflate these four concepts. They're distinct and complementary — choosing the wrong one is the source of most "why doesn't my extension work right?" friction.

## Key ideas

- **Prompt (CLAUDE.md / system prompt)** — Always-on behavior. Small, stable, every session. Use for persistent values, house style, repo-wide conventions.
- **Tool (MCP / function-calling)** — An atomic, executable function with side effects. The model picks when to call; the harness runs the code. Use for "do a thing" — read a file, query a DB, hit an API.
- **Skill** — A packaged, named *procedure* (instructions + optional scripts/assets). Loaded on demand via description match. Use for "how to do a multi-step thing reliably" — review a PR, write a changelog, run a deploy.
- **Agent (sub-agent / specialized persona)** — An autonomous executor with its own context, system prompt, and tool access. The orchestrator delegates scoped work. Use for work that needs isolation or a different model/persona (a "critic," a "planner," a "security reviewer").

| | Side effects? | Always loaded? | Multi-step? | Isolated context? |
|---|---|---|---|---|
| Prompt | No | Yes | No | No |
| Tool | Yes | Schema only | No | N/A |
| Skill | Maybe | Description only | Yes | No |
| Agent | Yes (via tools) | No | Yes | Yes |

## Cross-platform equivalents

- **Cursor Rules** ≈ prompt (`.cursorrules`)
- **OpenAI function calling / GPT Actions** ≈ tool
- **Agent Skills (open standard)** ≈ skill, now in Codex / Cursor / Copilot
- **LangGraph nodes**, **OpenAI Assistants** ≈ agent

## References

- [Agent Skills: The Open Standard — inference.sh](https://inference.sh/blog/skills/agent-skills-overview)
- [Extend Claude with skills — Claude Code Docs](https://code.claude.com/docs/en/skills)
- [MCP (Model Context Protocol)](https://modelcontextprotocol.io/)
- [Claude Code sub-agents](https://docs.claude.com/en/docs/claude-code/sub-agents)
