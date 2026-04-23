---
title: AI Skill Development
description: Writing packaged, invocable capabilities (SKILL.md + scripts + assets) that extend an agent on demand — Claude Code / Agent SDK and the cross-platform Agent Skills standard.
category: ai
tags: [skills, claude-code, agent-sdk, context-engineering]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## What is it?

A skill is a packaged, invocable capability — a directory containing a `SKILL.md` file (YAML frontmatter + markdown body) and optional supporting scripts, templates, and reference files — that gives an AI agent a repeatable, named procedure it can mount on demand.

Skills exist to solve the **context economy** problem: always-on instructions bloat the context window, but skills load their full body only when triggered, so unused knowledge is essentially free. They also solve discoverability and reusability — a skill is shareable, versioned, and auto-invocable by description matching, so the same playbook works across projects, teams, and even different agent platforms.

## Key ideas

- **Skill anatomy** — Directory with `SKILL.md` as entrypoint. YAML frontmatter (`name`, `description`, `disable-model-invocation`, `allowed-tools`, `model`, `paths`, `hooks`) plus a markdown body of instructions.
- **Discovery via description matching** — At session start, Claude pre-loads only `name` and `description` of every installed skill. When a user message matches a description, the full body loads. The description is the *only* auto-invocation mechanism. Combined `description` + `when_to_use` capped at 1,536 chars.
- **Lazy loading** — Full content enters the context window only after invocation. Skills can bundle large references, API specs, or example collections at zero baseline cost.
- **Composition and subagent execution** — `context: fork` runs a skill in an isolated subagent context. Skills and subagents are complementary: skills can delegate to agent types; subagents can have skills preloaded.
- **Skill vs. tool vs. agent vs. prompt** — Prompts (CLAUDE.md) = always-on behavior. Tools = atomic executable functions with side effects. Skills = reusable procedure packages, loaded on demand. Agents = autonomous multi-step executors orchestrating the others.
- **Lifecycle** — Rendered `SKILL.md` enters the conversation as a single message and persists for the session; Claude Code does not re-read on later turns. Under auto-compaction, the first 5,000 tokens of each invoked skill are re-attached (25,000-token shared budget).
- **Versioning and sharing** — Optional `version` frontmatter. Scopes: project (`.claude/skills/`, committed), personal (`~/.claude/skills/`), plugin (`plugin:skill`), enterprise (managed settings). The Agent Skills format is an open standard (`agentskills.io`) adopted by OpenAI Codex, Cursor, GitHub Copilot.
- **Invocation control** — `disable-model-invocation: true` removes the description from Claude's context (user-only). `user-invocable: false` hides from the `/` menu (model-only).

## Authoring best practices

- **Front-load the trigger in the description** — Write from Claude's perspective: "Use when the user asks X…". Claude tends to under-trigger; lead with the specific trigger phrase.
- **Single responsibility** — One thing per skill. Keep `SKILL.md` under 500 lines (Anthropic's own guidance). Side-effecting actions (deploy, commit) should have `disable-model-invocation: true`.
- **Checklists over narrative** for procedural skills; prose for reference/knowledge skills.
- **Include a "when NOT to use" section** — Reduces mis-triggers and ambiguity with built-in behavior.
- **Keep `SKILL.md` focused; move bulk to supporting files** — `reference.md`, `examples/` link from the main file.

## Gotchas

- **Vague descriptions that never trigger** — "Helps with development tasks" matches nothing.
- **Duplicating built-in behavior** — Wrapping Claude's default behavior in a skill wastes a context slot and can interfere with natural model behavior.
- **Monolithic skills that should be split** — A skill covering "all deployment operations" loads irrelevant content and is hard to trigger precisely.
- **Embedding secrets or user-specific state** — Committed/distributed skills are visible to all users. Use shell injection (`` !`command` ``) to pull secrets at runtime.
- **Treating skill content as persistent across turns** — Loaded once; not re-read. After compaction, older skills may be dropped entirely — re-invoke high-priority skills in heavily compacted sessions.

## Subtopics

- [Frontmatter and discovery](./frontmatter-and-discovery/) — every field, description cap, `when_to_use`, `paths` glob scoping
- [Writing a first skill](./writing-a-first-skill/) — create, test auto-invocation, add supporting files
- [Skill vs. tool vs. agent](./skill-vs-tool-vs-agent/) — conceptual map across the Claude stack and cross-platform equivalents

## References

- [Extend Claude with skills — Claude Code Docs](https://code.claude.com/docs/en/skills)
- [Agent Skills overview — Claude API Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [Agent Skills in the SDK — Claude API Docs](https://platform.claude.com/docs/en/agent-sdk/skills)
- [Skill Authoring Best Practices — Claude API Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [anthropics/skills (GitHub) — reference skills](https://github.com/anthropics/skills)
- [Agent Skills — OpenAI Codex](https://developers.openai.com/codex/skills)
- [Agent Skills: The Open Standard — inference.sh](https://inference.sh/blog/skills/agent-skills-overview)
- [Inside Claude Code Skills — Mikhail Shilkov](https://mikhail.io/2025/10/claude-code-skills/)
