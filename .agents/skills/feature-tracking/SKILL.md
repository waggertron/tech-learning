---
name: feature-tracking
description: "Use when adding, updating, reviewing, or documenting repo features in tech-learning, especially user-visible capabilities, content models, generators, reusable skills, validation rules, docs records, AGENTS rules, and feature history entries."
---

# Feature Tracking

Use this skill with `authoring` and `writing-style` when a task adds or changes repo capabilities.

## When To Use

Use this skill for changes that add or materially change:

- User-visible site behavior.
- Content models, frontmatter fields, indexes, or post series.
- Generators, scripts, tests, or validation rules.
- Reusable Codex skills or agent workflows.
- Major content catalogs, learning systems, or code examples.
- Documentation records that future maintainers need.

Small typo fixes, prose-only edits, and one-off content polish usually do not need a feature-tracker entry unless they establish a new convention.

## Required Records

1. **Feature tracker**: Update `docs/feature_tracker.md` with a dated entry and evidence paths.
2. **Focused docs**: Add or update a docs page when the feature has a workflow, convention, generator, test contract, or maintenance process.
3. **AGENTS.md**: Add or change a rule only when every future agent should follow it.
4. **Local memory**: Update `.agents/memory/feature_tracker.md` for local in-progress reminders. Do not rely on memory as the only durable record because `.agents/memory/` is ignored.
5. **Skill**: Add or update a skill when future Codex sessions should reuse the workflow.

## Workflow

1. Read `docs/feature_tracker.md` before adding a feature entry.
2. Inspect recent commits when writing historical or retrospective entries:

```bash
git log --date=short --pretty=format:%h%x09%ad%x09%s -n 40
```

3. Add the tracker entry under the right feature area. Prefer grouping related commits into one shipped capability.
4. Include evidence paths that a future maintainer can inspect.
5. Add targeted tests or checks for repeatable contracts.
6. Run the relevant targeted test, then `npm run build`.
7. Before final response, confirm that feature docs, skills, AGENTS rules, and memory are aligned.

## Entry Shape

```markdown
- **YYYY-MM-DD: Feature name**: One or two sentences explaining the shipped capability and why it matters. Evidence: `path/to/file`, `path/to/other-file`.
```

Keep entries concise. The tracker is a map of capabilities, not a changelog for every commit.
