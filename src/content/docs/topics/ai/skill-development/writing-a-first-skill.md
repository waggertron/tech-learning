---
title: Writing a First Skill
description: A hands-on walkthrough, create the directory, write SKILL.md, test auto-invocation vs. direct invocation, add a supporting file.
parent: skill-development
tags: [skills, claude-code, tutorial]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

The fastest way to internalize the skills model is to write a small one, confirm Claude auto-invokes it, then iterate. Aim for something narrow and concrete, "format my commit message this way," "run our test suite with these flags", rather than something sweeping.

## Key ideas

- **Directory layout**, `.claude/skills/<skill-name>/SKILL.md` for project skills (committed); `~/.claude/skills/<skill-name>/SKILL.md` for personal.
- **Minimum viable `SKILL.md`**, Frontmatter with `name` + `description` + a short markdown body with numbered steps. That's it.
- **Test auto-invocation**, Open a fresh session, phrase a user message that should match the description. If Claude loads the skill, you see it mention the skill by name. If not, sharpen the description's trigger phrase.
- **Test direct invocation**, Type `/skill-name` to confirm the skill loads and the steps work end-to-end.
- **Add a supporting file**, Move a long reference section (API snippets, long examples) into `SKILL.md`'s sibling file, link from `SKILL.md`. Keeps the main file focused and the support files load only when Claude decides to read them.
- **Iterate on the description first**, Most "my skill doesn't trigger" problems are description problems, not body problems.

## References

- [Extend Claude with skills, Claude Code Docs](https://code.claude.com/docs/en/skills)
- [anthropics/skills (GitHub), reference skills](https://github.com/anthropics/skills)
- [Inside Claude Code Skills, Mikhail Shilkov](https://mikhail.io/2025/10/claude-code-skills/)
