---
title: Writing a First Skill
description: "A hands-on walkthrough for creating a narrow skill, writing SKILL.md, testing invocation, adding supporting files, and avoiding common trigger mistakes."
parent: skill-development
tags: [skills, claude-code, tutorial]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## Start with one repeatable job

The fastest way to understand skills is to write one small skill and watch whether the agent invokes it at the right time.

Start with one repeatable job. Good first skills sound like "format commits for this repo", "run the validation checks for this project", "write release notes from merged PRs", or "review content for our house style." Bad first skills sound like "help with development." That is too broad to trigger predictably and too vague to guide behavior.

This repo stores project skills in `.agents/skills/`. Claude Code examples often use `.claude/skills/`, and personal installations may use a home-directory skills folder. The shape is the same: a skill directory with a `SKILL.md` entrypoint and optional supporting files.

## Key ideas

- **Narrow trigger**: A skill should activate for a recognizable task, not for an entire profession.
- **Minimum viable `SKILL.md`**: Frontmatter with `name` and `description`, followed by concrete steps. That is enough for a useful first skill.
- **Description first**: The description is the discovery surface. If the agent does not load the skill, sharpen the description before rewriting the body.
- **Procedure over essay**: A skill should tell the agent what to do, in order. Use checklists, commands, file paths, and finish criteria.
- **Supporting files**: Move long examples, references, templates, or command matrices into sibling files and link them from `SKILL.md`.
- **Fresh-session test**: Test in a new session so you know the skill triggers from metadata, not from conversational memory.

## Minimal shape

```text
.agents/skills/example-review/
└── SKILL.md
```

The body should be small enough to read quickly:

```markdown
---
name: example-review
description: "Use when reviewing examples for this repo before publish."
---

# Example review

1. Read the changed example.
2. Verify the code runs.
3. Check links and citations.
4. Report issues by severity.
```

That skill is not sophisticated, but it has the right shape: a trigger, a procedure, and a finish condition.

## Testing invocation

Test both paths:

- **Natural invocation**: Ask for a task that should match the description. The agent should mention or use the skill.
- **Direct invocation**: If the environment supports direct skill calls, invoke it by name and confirm the steps work.

If natural invocation fails, revise the description. Put the user phrase near the beginning. "Use when the user asks to review examples before publishing" is better than "Provides quality support for examples."

## Add one supporting file

Supporting files keep `SKILL.md` focused. Add one when the skill needs reference material that is too bulky for the main file:

```text
.agents/skills/example-review/
├── SKILL.md
└── references/checklist.md
```

Then link it from the relevant step:

```markdown
Read `references/checklist.md` only when the review touches runnable examples.
```

This keeps the skill lightweight until the extra reference is actually needed.

## Common mistakes

- **Too broad**: "Use for software engineering" will collide with everything.
- **Too hidden**: Important steps live only in a linked reference and are never loaded.
- **Too much narrative**: The agent gets background but no actionable process.
- **No finish criteria**: The skill says what to start, not how to know the task is complete.
- **No validation step**: The skill changes behavior but never says how to verify the result.

## Practical checklist

- Pick one repeatable task.
- Write the trigger in the description from the agent's perspective.
- Keep the body procedural.
- Add supporting files only for material the skill may not always need.
- Test in a fresh session with realistic user phrasing.

## References

- [Extend Claude with skills, Claude Code Docs](https://code.claude.com/docs/en/skills)
- [anthropics/skills (GitHub), reference skills](https://github.com/anthropics/skills)
- [Inside Claude Code Skills, Mikhail Shilkov](https://mikhail.io/2025/10/claude-code-skills/)

## Related topics

- [Frontmatter and discovery](../frontmatter-and-discovery/), why the description controls invocation
- [Skill vs. tool vs. agent](../skill-vs-tool-vs-agent/), choosing the right extension mechanism
- [AI harness development](../../harness-development/), the runtime that loads and executes skills
