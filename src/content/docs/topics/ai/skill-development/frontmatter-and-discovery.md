---
title: Frontmatter and Discovery
description: "How skill frontmatter controls discovery, trigger descriptions, invocation toggles, path scoping, tool access, and common misfire cases."
parent: skill-development
tags: [skills, claude-code, frontmatter]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## Discovery happens before the skill body loads

A skill's frontmatter is not decoration. It is the discovery surface. The agent usually sees the skill name and description before it sees the body. If the description does not match the user's task, the useful instructions inside `SKILL.md` may never load.

That means frontmatter does two jobs. It tells the platform how the skill may be used, and it tells the model when the skill is relevant. The body can be excellent and still fail if discovery is vague.

## Key ideas

- **`name`**: The stable identifier. Keep it short, lowercase, and specific enough to distinguish from neighboring skills.
- **`description`**: The primary trigger. Write it from the agent's perspective: "Use when the user asks..." or "Use when editing..."
- **`when_to_use`**: Optional extra trigger text in platforms that support it. Treat it as discovery text, not as hidden instructions.
- **Invocation toggles**: Some platforms let a skill be model-invoked, user-invoked, both, or neither. Use restrictive settings for dangerous workflows.
- **Path scoping**: File or directory globs can keep a language-specific skill from activating in the wrong repo.
- **Tool and model controls**: Skills may declare allowed tools, preferred models, or effort levels. These are policy controls and should match the task's risk.

## Writing a trigger description

A good description names the user's task and the boundary:

```yaml
description: "Use when the user asks to validate this repo before committing or pushing."
```

A weak description names a vague capability:

```yaml
description: "Helps with quality."
```

The first one can trigger because it matches real user language. The second one competes with every other quality-related behavior and gives the model no clear boundary.

## Direct invocation vs. model invocation

Direct invocation is user-controlled. It is useful when the user knows exactly which procedure they want.

Model invocation is automatic. It is useful for low-risk helper workflows such as prose cleanup, markdown table escaping, or content review. It is risky for workflows that send messages, deploy systems, rotate credentials, modify production data, or perform destructive operations.

If a skill performs side effects, the frontmatter should make that obvious and the body should include approval gates.

## Path scoping

Path scoping helps when a skill is correct only inside a specific project or file type. Examples:

- a React component skill scoped to `src/**/*.tsx`
- a Go service skill scoped to `services/api/**/*.go`
- a repo authoring skill scoped to `src/content/docs/**`
- a Terraform workflow scoped to `infra/**/*.tf`

Without scoping, the skill can trigger in places where its assumptions are wrong.

## Common failure modes

- **Trigger is written for humans, not the model**: "A wonderful helper for releases" says less than "Use when preparing release notes from merged PRs."
- **Several skills overlap**: Two descriptions match the same task and the model chooses the wrong one.
- **Dangerous skill auto-invokes**: A deploy or commit skill activates without explicit user intent.
- **Body carries trigger rules**: The model never reads them because the frontmatter did not trigger.
- **Description is too long**: The concrete trigger is buried after background text.

## Practical checklist

- Put the trigger phrase first.
- Say when to use the skill and, when needed, when not to use it.
- Keep destructive workflows user-invoked or approval-gated.
- Scope by path when assumptions are repo-specific.
- Test with the exact user phrasing you expect.

## References

- [Extend Claude with skills, Claude Code Docs](https://code.claude.com/docs/en/skills)
- [Skill Authoring Best Practices, Claude API Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Agent Skills overview, Claude API Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)

## Related topics

- [Writing a first skill](../writing-a-first-skill/), applying the frontmatter rules to a small example
- [Skill vs. tool vs. agent](../skill-vs-tool-vs-agent/), deciding whether a skill is the right abstraction
- [Permission and trust models](../../harness-development/permission-models/), why side-effecting skills need gates
