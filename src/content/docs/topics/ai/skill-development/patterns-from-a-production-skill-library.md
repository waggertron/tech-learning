---
title: Patterns from a production skill library
description: Forty-plus Claude Code skills from a real monorepo, grouped into archetypes, workflow, quality gate, infra-awareness, language-awareness, and utility. What made each one earn its place, and the patterns worth stealing.
parent: skill-development
tags: [skills, claude-code, patterns, case-study]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## Why patterns, not a copy-paste list

Every real team's skills are stack-specific. The *patterns*, what shape a skill takes, when it fires, what it does to the model's behavior, generalize. What follows is a set of archetypes derived from a working library of ~40 skills across a monorepo and a handful of personal utility skills. Every skill in the library earned its place by preventing a recurring failure or codifying a non-obvious workflow. The names below are lightly sanitized; the patterns are what matter.

## What a Claude Code skill actually is

A skill is a markdown file with frontmatter that tells the model *when* to invoke itself and *what* to do when invoked. It lives under `.claude/skills/<name>/SKILL.md` (repo-level) or `~/.claude/skills/<name>/SKILL.md` (personal). The frontmatter is everything:

```yaml
---
name: pre-commit-quality-gates
description: Use when preparing to commit code, to verify lint, format, and tests pass
---
```

The model reads every skill's `description` on every turn. If the description matches the task at hand, the skill body is loaded into context. The description is the router; if it doesn't trigger, the skill body never runs.

**Golden rule:** write descriptions that start with *"Use when…"* and list the specific conditions. Vague descriptions never trigger. Over-eager descriptions trigger constantly and waste tokens.

## The archetypes

Five categories cover almost every skill in the library:

1. **Workflow**, the choreography of getting work done (branching, PRs, plans, insights).
2. **Quality gate**, what to run before committing, merging, or shipping.
3. **Infra-awareness**, rules for a specific piece of infrastructure (Helm, Terraform, Argo, Redis…).
4. **Language-awareness**, project-specific conventions for Python, TypeScript, and framework usage.
5. **Utility**, single-purpose tools (convert, diagram, format).

Each archetype has its own DNA.

## Archetype 1, Workflow skills

These encode "how we work" so the model doesn't have to re-learn it every session.

| Skill (sanitized name) | What it enforces |
| --- | --- |
| `feature-branch-workflow` | Create a branch, switch context, prep a PR |
| `plan-lifecycle` | Create / update / complete implementation plans with a consistent shape |
| `multi-stage-prs` | Sequence stacked PRs cleanly |
| `pr-feedback-propagation` | When you change code from PR feedback, also update the PR description, plan doc, diagrams, design docs |
| `adversarial-pr-review` | Before merge, attack the change from every historical failure angle |
| `architecture-decision-records` | When making a significant decision, write an ADR |
| `capture-insights` | After a PR, capture non-obvious engineering lessons to a team doc |
| `future-work-tracking` | When you defer something, file it somewhere it won't get lost |
| `bug-and-security-tracking` | Use the org's bug/security IDs consistently |

### Pattern: *the checklist-on-activation*

Workflow skills work best as **imperative checklists**. The model is good at following numbered steps when the steps are specific. An `adversarial-pr-review` skill that says "consider all possible failure modes" fires and produces nothing useful. One that says "go through each of these five historical failure categories, change-of-environment, change-of-format, security, change-of-interface, LLM-response-regression, and give one concrete risk per category" produces a real review.

### Pattern: *the atomic-update rule*

`pr-feedback-propagation` exists because the most common post-review bug is: "fixed the code, forgot the plan doc still says the old design." The skill's job is to make "change X" mean "change all artifacts that describe X." This generalizes: anytime a piece of information lives in multiple places, a skill that fires on "I'm changing X" is worth the investment.

## Archetype 2, Quality-gate skills

| Skill | Purpose |
| --- | --- |
| `fast-checks` | Run all fast checks (lint, typecheck, unit, component) across the repo. No Docker. Pre-commit confidence. |
| `pre-commit-quality-gates` | Verify lint, format, and tests pass before committing |
| `explicit-version-upgrades` | When bumping any dependency version, exact pins, PR justification, verification after |
| `dependency-management` | Install / update / remove deps consistently in a polyglot monorepo |
| `e2e-testing-workflow` | Run E2E, set up auth fixtures, debug failures |

### Pattern: *two tiers of checks*

The fast/slow split (`fast-checks` vs `e2e-testing-workflow`) shows up everywhere. Fast checks are what you run before every commit and every time the model claims to be done. Slow checks are what CI runs; the model runs them on demand. Two skills for the two tiers keeps the model from either over-testing (running E2E on every change) or under-testing (skipping unit checks before calling a feature complete).

### Pattern: *justify the version*

`explicit-version-upgrades` enforces that every dependency bump comes with a written reason. This seems bureaucratic until the third time a silent `patch` bump breaks production. The skill shape: "when you detect a change to `package.json` or `pyproject.toml`, require an explanation string in the PR body before proceeding."

## Archetype 3, Infra-awareness skills

This was the biggest category in the library. Every piece of infrastructure with non-obvious rules got its own skill:

- `argocd-awareness`, sync-wave ordering, FQDN addressing, pre-merge validation
- `docker-aware`, multi-stage build conventions, container cleanup
- `github-actions-workflows`, self-hosted runner conventions, composite actions, change detection
- `gitops-awareness`, environment promotion flow, no manual cluster drift
- `helm-awareness`, values layering, sync-wave ordering, multi-environment
- `karpenter-awareness`, NodePool / EC2NodeClass, Spot strategies
- `keda-awareness`, ScaledObjects, HPA conflict prevention, scale-to-zero
- `kubernetes-awareness`, namespace isolation, RBAC, cost management
- `mongodb-awareness`, dual-topology (managed vs in-cluster), connection patterns
- `redis-awareness`, worker queues, sync-policy ignoreDifferences pitfalls
- `rds-awareness`, migration safety, connection patterns, cost-optimized config
- `self-hosted-runner`, caching and disk pruning on a 50GB runner
- `terraform-awareness`, module patterns, state management, two-repo architecture
- `nx-monorepo-awareness`, the five wiring layers when moving a project
- `github-actions-workflows`, workflow conventions for this repo's CI

### Pattern: *one skill per "land mine"*

Infra-awareness skills exist because a specific operation, "rename an Nx project," "add a KEDA scaler," "modify ignoreDifferences in a sync policy", has *one correct path and many wrong ones*. The skill is the correct path, written down, activated by keywords in the task.

Descriptions follow a template:

> *Use when modifying [artifact type], enforces [specific rules] and prevents [specific failure mode].*

The "prevents" clause is load-bearing. It's what keeps the description from being vague. "Enforces best practices" triggers nothing; "prevents cascading sync failures by enforcing dependency ordering, FQDN addressing, and pre-merge validation" triggers when you edit an ArgoCD Application.

### Pattern: *awareness over prescription*

Infra skills lean toward **explaining the system** rather than **dictating every action**. `helm-awareness` doesn't say "use this template." It explains values layering, sync-wave ordering, and the four-chart / ten-environment topology, and trusts the model to apply that context. This generalizes: skills that teach *why* outlive skills that dictate *what*, because the "what" changes every quarter.

## Archetype 4, Language-awareness skills

| Skill | Scope |
| --- | --- |
| `python-awareness` | FastAPI, Pydantic, uv, Ruff, Pyrefly, type safety conventions |
| `typescript-awareness` | Next.js, React, Biome, npm workspaces, type safety |
| `typing-best-practices` | Cross-language, when to narrow, when to widen, how to avoid `any` / `Any` |
| `lit-web-components` | Event propagation, `this` binding, composition patterns |

### Pattern: *tool-choice is part of the skill*

The Python skill encodes `uv` over `pip`, `Ruff` over `black` + `flake8`, `Pyrefly` as the type checker. These aren't "Python skills", they're "Python-as-we-write-it-here" skills. A model that reads `python-awareness` stops suggesting `virtualenv` and `pipenv`; one that doesn't keeps fighting the project's toolchain.

### Pattern: *one cross-cutting skill for fundamentals*

`typing-best-practices` covers both Python and TypeScript because the underlying instincts, narrow types at boundaries, avoid escape hatches, prefer discriminated unions, are language-agnostic. Splitting it into two language-specific skills would duplicate the teaching; keeping it cross-cutting means the principles fire regardless of which file the model is editing.

## Archetype 5, Utility skills

The smallest category, but high-leverage:

| Skill | What it does |
| --- | --- |
| `ascii-ui-diagrams` | Draw before/after UI diagrams in ASCII for PRs, plan docs, design docs |
| `md-to-pdf` | Convert markdown to PDF with consistent formatting |
| `scenario-data-management` | Seed or refresh test data when the app shows empty states |

### Pattern: *the pre-implementation artifact*

`ascii-ui-diagrams` is the best-of-class utility in the library. It activates before UI work, produces a diagram, and anchors the implementation to a visible target. The diagram lives in the PR description and the plan doc, so reviewers see the intended outcome before reading code. The skill doesn't do the UI work; it does the thing that makes the UI work easier to review.

### Pattern: *the one-shot converter*

`md-to-pdf` is a pure function-as-skill: input is a markdown file, output is a PDF. No workflow, no checklist, just "invoke me with this input and I do the transformation." Utility skills of this shape are small, safe, and composable.

## What a skill body looks like

Beyond the frontmatter, the body is free-form markdown. The library converges on a consistent shape:

```markdown
# <Skill Title>

## When to Trigger
- <Bullet list of concrete trigger conditions>
- <Specific file paths, task keywords, user intents>

## Do
- <Numbered list of the correct path>

## Don't
- <Specific anti-patterns with one-line reasons>

## Validation
- <How to check the output is correct>
- <Commands to run, files to grep>

## Examples
- <Before/after, prompt/response, or command/result>
```

The "When to Trigger" section is redundant with the frontmatter `description`, and that's intentional: the description is for routing, the body section is for the model to confirm activation was right before acting.

## What makes a skill earn its place

Every skill in the library can answer three questions:

1. **What failure did it prevent the last time it wasn't there?** If you can't name one, the skill is aspirational, and aspirational skills rot.
2. **What does it activate on?** Specific files, specific task phrases, specific commands. If the trigger is "when writing code," it's too broad.
3. **What's the contract at the end?** The skill either produces a specific artifact (a PR review, an ADR, a diagram) or leaves the repo in a specific verified state (tests green, ADR updated, plan closed). "Give better advice" isn't a contract.

Skills that can't answer all three get deleted. This is a maintenance discipline, not a one-time audit, a library of 40 skills has about 3-5 rot and need pruning per quarter in a moving codebase.

## The skill-file lifecycle

- **Day 0**, a recurring failure or workflow friction gets called out.
- **Day 1**, a skill is drafted from the last PR where the problem happened. Description cites the failure mode.
- **Week 2**, the skill fires in anger. You see whether it actually changes model behavior. About a third of skills don't, and get reworked.
- **Month 3**, the underlying rule changes (new framework version, new convention). The skill either gets updated or starts to drift. Skills that drift more than two updates behind get deleted.

Treat skills as code. Review them in PRs. Grep for stale references. Delete the ones that stop firing.

## Anti-patterns seen in the wild

- **The kitchen-sink skill.** One skill covering "everything about frontend development." Fires on everything, adds noise to every turn, gets ignored.
- **The aspirational skill.** Describes how you *wish* the project worked. The model follows it; the codebase doesn't; reviewers push back. Skills describe current reality, not future intent.
- **The zero-trigger skill.** The description doesn't match how people actually talk about the task. `typescript-strict-mode-enforcement` never fires because no one phrases their ask that way; `typescript-awareness` fires because it matches "TypeScript," "tsconfig," and "type error."
- **The dictator skill.** Every rule is prescriptive with no rationale. The first edge case the model hits gets fumbled because the rule said *what* but not *why*.
- **The undocumented drift.** A skill was great on day one, the toolchain changed, nobody updated it. The skill is now actively misleading. Deletion beats staleness.

## A starting set worth stealing

If you're building a repo's first skill library, start with these five archetypes as concrete skills and grow from there:

1. **`fast-checks`**, one skill that runs every fast quality gate in the repo. Name it, document what it covers, wire it into pre-commit.
2. **`pre-commit-quality-gates`**, the "are we ready to commit?" checklist. Different from `fast-checks`, this one is the narrative flow, not the commands.
3. **`feature-branch-workflow`**, how to start a task and prep a PR. Low controversy, high leverage.
4. **`adversarial-pr-review`**, attack your own PR before anyone else does. Cheaper to find problems here than in review.
5. **One infra-awareness skill** for the single piece of infra in your stack with the most footguns (Helm, Argo, Terraform, Kubernetes, whatever). Start with one; add more as the pain teaches you which.

That's five skills. They fit in a single session's context, they cover 80% of where an AI coding agent's defaults go wrong, and they leave plenty of room to grow a library that looks like the one above.

## The bigger observation

Skills aren't configuration. They're a **specific shape of documentation**, one the model reads, routes on, and executes. Teams that already write good internal READMEs have most of the raw material; the transformation is structural: break the knowledge into triggered units, write descriptions that match how tasks actually arrive, and prune ruthlessly. The result is a project-specific agent that makes fewer of the usual mistakes.

A library of forty skills is not the goal. A library where every entry earns its place every month is.

## Related topics

- [AI Skill Development, overview](./), the parent topic
- [Writing a first skill](./writing-a-first-skill/), the minimal viable skill
- [Frontmatter and discovery](./frontmatter-and-discovery/), how descriptions become routing signals
- [Skill vs tool vs agent](./skill-vs-tool-vs-agent/), which knowledge goes into which unit
- [AI Coding Tool Blindspots](../coding-tool-blindspots/), the failure modes skills are written against
