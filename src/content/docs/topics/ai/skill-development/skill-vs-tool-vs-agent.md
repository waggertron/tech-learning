---
title: Skill vs. Tool vs. Agent vs. Prompt
description: "A conceptual map of prompts, tools, skills, and agents, what each one controls, and how to choose the right extension mechanism."
parent: skill-development
tags: [skills, tools, agents, mental-models]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## Four extension mechanisms, four jobs

Prompts, tools, skills, and agents all extend what an AI system can do. They are not interchangeable.

The common mistake is using one mechanism for another mechanism's job. A tool is not a tutorial. A skill is not an API endpoint. A prompt is not a permission boundary. An agent is not just a longer prompt.

Choosing the right abstraction makes behavior easier to trigger, test, secure, and maintain.

## Key ideas

- **Prompt**: Always-on behavior. Use it for stable values, house style, project conventions, and safety rules that apply across the session.
- **Tool**: An executable capability. Use it when the model needs to do one atomic thing: read a file, query a database, search docs, create an issue, or run a command.
- **Skill**: A packaged procedure. Use it when the model needs repeatable instructions, scripts, templates, or reference material for a multi-step task.
- **Agent**: A delegated worker with its own context and tool access. Use it when work needs isolation, parallelism, a different role, or a scoped objective.

| | Side effects? | Always loaded? | Multi-step? | Isolated context? |
|---|---|---|---|---|
| Prompt | No | Yes | No | No |
| Tool | Yes | Schema only | No | N/A |
| Skill | Maybe | Description only | Yes | No |
| Agent | Yes (via tools) | No | Yes | Yes |

## Decision rules

Use a **prompt** when the instruction is short, stable, and universal:

- "Do not use em dashes in this repo."
- "Prefer relative links in Markdown."
- "Ask before destructive git operations."

Use a **tool** when the model needs an action surface:

- read a resource
- run a query
- create a ticket
- call an API
- validate a file

Use a **skill** when the task is a procedure:

- pre-push validation
- published content review
- changelog generation
- release checklist
- incident writeup

Use an **agent** when the work benefits from separation:

- adversarial review after implementation
- parallel research across independent sources
- security review with a narrower tool set
- large refactor planning without polluting the main context

## Example: publishing a technical post

The four mechanisms can cooperate:

- The **prompt** carries house style: no em dashes, direct prose, relative links.
- A **tool** reads files, checks links, or runs the build.
- A **skill** provides the authoring checklist and validation workflow.
- A reviewer **agent** can inspect the draft for weak explanations or security mistakes.

No single layer should do all of that work. Prompts keep principles active. Tools act. Skills provide process. Agents isolate delegated work.

## Common mistakes

- **Putting a long procedure in the system prompt**: It bloats every session even when unused.
- **Making a tool too smart**: The tool starts deciding policy instead of executing a clear function.
- **Using a skill for an atomic action**: A direct tool call would be simpler and easier to test.
- **Using an agent for tiny tasks**: Delegation overhead is not free.
- **Treating prompts as security controls**: Permissions belong in the harness, not only in text.

## Cross-platform equivalents

- **Cursor Rules** ≈ prompt (`.cursorrules`)
- **OpenAI function calling / GPT Actions** ≈ tool
- **Agent Skills (open standard)** ≈ skill, now in Codex / Cursor / Copilot
- **LangGraph nodes** and **OpenAI Assistants** ≈ agent

## References

- [Agent Skills: The Open Standard, inference.sh](https://inference.sh/blog/skills/agent-skills-overview)
- [Extend Claude with skills, Claude Code Docs](https://code.claude.com/docs/en/skills)
- [MCP (Model Context Protocol)](https://modelcontextprotocol.io/)
- [Claude Code sub-agents](https://docs.claude.com/en/docs/claude-code/sub-agents)

## Related topics

- [Frontmatter and discovery](../frontmatter-and-discovery/), how skills are found
- [Writing a first skill](../writing-a-first-skill/), a small practical starting point
- [Tool design and schema discipline](../../harness-development/tool-design/), building the action interface
- [Permission and trust models](../../harness-development/permission-models/), controlling tool and agent authority
