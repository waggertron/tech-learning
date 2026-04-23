---
title: Frontmatter and Discovery
description: How Claude finds and loads skills — every frontmatter field, the 1,536-character description cap, when_to_use, paths scoping, and invocation toggles.
parent: skill-development
tags: [skills, claude-code, frontmatter]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

A skill's frontmatter is its entire discovery surface. At session start Claude loads only the `name` and `description` of every skill. The full `SKILL.md` body is loaded on demand, triggered by a description match. Getting frontmatter right is the single highest-leverage authoring skill.

## Key ideas

- **`name`** — Stable identifier; becomes the invocation name in logs and `/` menus.
- **`description`** — The whole discovery mechanism. Write from Claude's POV: "Use when the user asks X / is doing Y." Lead with the concrete trigger phrase. Combined `description` + `when_to_use` capped at 1,536 characters.
- **`when_to_use`** — Optional extended trigger phrasing. Lives in the same character budget as description.
- **`disable-model-invocation`** — `true` removes the description from Claude's context entirely. Only the user can invoke (via `/`). Use for side-effecting actions — deploy, commit, anything destructive.
- **`user-invocable`** — `false` hides the skill from the `/` menu; only Claude can trigger it. Use for helper skills that aren't meaningful for humans.
- **`paths`** — Glob scoping: only load this skill if the current file or cwd matches. Useful for language- or repo-specific skills.
- **`allowed-tools`** / **`model`** / **`effort`** — Fine-grained control over what the skill can do when active.

## References

- [Extend Claude with skills — Claude Code Docs](https://code.claude.com/docs/en/skills)
- [Skill Authoring Best Practices — Claude API Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Agent Skills overview — Claude API Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
