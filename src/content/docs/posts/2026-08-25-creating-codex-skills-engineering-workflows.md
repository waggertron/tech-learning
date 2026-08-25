---
title: "Creating Codex Skills, Reusable Engineering Workflows"
description: "How to choose a skill-worthy workflow, structure SKILL.md and supporting resources, validate the result, and avoid turning one-off or judgment-heavy work into brittle automation."
date: 2026-08-25
tags: [codex, ai-agents, developer-workflows, automation, software-engineering]
canonical: https://waggertron.github.io/tech-learning/posts/2026-08-25-creating-codex-skills-engineering-workflows/
---

A good Codex skill preserves a successful way of working. It does not try to replace engineering judgment with a long prompt.

Consider a team that regularly fixes CI failures. The useful knowledge is not "be good at CI." It is concrete: where to find job logs, which failure classes are safe to repair automatically, which command reproduces the failure, what evidence a fix needs, and when to stop for a human decision. That is a repeatable workflow with repository-specific context. It is a strong skill target.

"Build the best possible feature" is not. The request has no stable procedure, no fixed evidence source, and no reliable finish condition. A skill would mostly repeat general advice the model already knows.

OpenAI describes skills as reusable instructions, resources, and scripts for work you repeat. The practical test is tighter: create a skill when it gives an agent non-obvious context or a repeatable procedure that changes the result. [OpenAI's Codex skills use case](https://learn.chatgpt.com/use-cases/reusable-codex-skills) frames the same idea around preserving working chats, review rules, test commands, release checklists, design conventions, and repository scripts.

## Start with a proven workflow

Do not begin with a folder. Begin with evidence that a workflow works.

Useful starting material includes a merged pull request, a runbook, a successful incident response, an accepted review comment, a release checklist, or a sequence of commands that repeatedly produces trustworthy results. Those artifacts answer questions that a blank skill cannot:

- What triggers the workflow?
- What inputs and tools does it need?
- Which steps are fixed, and which need judgment?
- What output counts as useful?
- What evidence proves completion?
- Which conditions require escalation rather than continued automation?

For example, a team may have resolved several failures in the same CI system. The working examples show that the agent needs to read the failed job, classify the error, reproduce it locally when possible, make the smallest repair, rerun the focused check, and report any blocked external dependency. That sequence is much more valuable than a generic instruction to fix CI.

## Decide whether a skill is the right tool

A skill is not the only way to encode a workflow. Use the smallest mechanism that owns the problem.

| Need | Better fit | Why |
| --- | --- | --- |
| One stable rule for every task in one repository | `AGENTS.md` | The rule is always relevant and belongs in baseline context. |
| A repeatable workflow that only applies to some requests | Skill | Triggered instructions avoid filling every task with unrelated detail. |
| A deterministic operation such as fetching logs or generating a report | Script or CLI, possibly called by a skill | Code is easier to test, version, and reuse than prose instructions. |
| Access to an external service or data source | MCP server, plugin, or CLI | The integration needs a capability boundary, authentication, and a typed contract. |
| A user-specific, temporary preference | The current prompt or project memory | The rule has no durable team-wide value. |
| A high-impact decision with no stable policy | Human review | Repetition does not make an unresolved judgment safe to automate. |

The distinction matters. A skill can tell an agent when to run a release command and how to interpret its result. It cannot make an irreversible production release safe when the required approval policy has not been defined.

## A quick selection test

Score a candidate from zero to two on each question:

| Question | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Repetition | Happens once | Recurs occasionally | Recurs often across tasks or people |
| Hidden context | General knowledge is enough | Some local facts matter | Local rules, commands, or examples decide success |
| Procedure | Every case is novel | A loose pattern exists | The workflow has recognizable stages |
| Verification | Taste only | Partial evidence exists | A command, diff, test, or review proves the result |
| Safety boundary | Any result is reversible | Some cases need caution | Clear stop or approval conditions exist |

A score near ten is a strong candidate. A low score does not mean the work is unimportant. It means that a skill will probably add ceremony without making future runs better.

## Use a small, discoverable structure

At minimum, a skill is a directory containing `SKILL.md`:

```text
fix-ci-checks/
├── SKILL.md
├── scripts/
│   └── fetch-job-log.sh
└── references/
    └── failure-catalog.md
```

The name should be short, lowercase, and hyphenated. The frontmatter needs a clear name and description. The description is not a marketing tagline. It is the routing rule that tells Codex when the skill applies.

```md
---
name: fix-ci-checks
description: "Diagnose and repair failing CI checks in the Acme web repository. Use when a pull request has a failed Buildkite job, a local reproduction command is available, or the user asks to investigate CI failures."
---

# Fix CI checks

1. Inspect the failed job and identify the failing command.
2. Read `references/failure-catalog.md` when the failure matches a known class.
3. Reproduce the focused failure locally when the environment supports it.
4. Make the smallest change that addresses the failure.
5. Run the focused check, then the required repository validation tier.
6. Stop and report the blocker when the failure requires credentials, a protected environment, or a product decision.
```

The official Skills guide explains that the model first sees a skill's name, description, and path. It reads `SKILL.md` only after selecting the skill. Write the description for accurate triggering, then keep the body focused on the steps that change execution. [OpenAI's Skills documentation](https://developers.openai.com/api/docs/guides/tools-skills) also documents the bundle validation rules and the optional resources a skill can contain.

## Put information in the right place

Treat `SKILL.md` as the workflow's control plane, not a dumping ground.

### Keep instructions in `SKILL.md`

Put short, high-value guidance here:

- Trigger conditions and exclusions.
- The ordered workflow.
- Safety boundaries and approval points.
- Which validation command to run.
- Routes to optional references or scripts.

This material is procedural. It tells the agent how to behave.

### Put detail in `references/`

Use references for material that is valuable only in some cases:

- A long incident taxonomy.
- An internal API schema.
- Framework-specific variations.
- A large repository map.
- A detailed release policy.

Say exactly when to read each reference. For example, "Read `references/database-migrations.md` before editing a migration" is usable. "References may help" is not.

This progressive disclosure keeps a skill small enough to select and load without crowding out the task itself.

### Put deterministic work in `scripts/`

If the workflow repeatedly rebuilds the same command pipeline, write a script or call an existing CLI. A skill can provide the decision logic around it.

```text
Skill: determine whether the contract change requires compatibility tests.
Script: generate the API client from the checked-in schema.
Test: prove the generated client matches the schema.
```

This separation is important. Prose is flexible and inspectable. Code is deterministic and testable. Do not hide a complicated shell program inside a Markdown instruction block if the repository can own it as a script.

### Put copied output material in `assets/`

Use assets for templates, starter files, icons, or fixtures that the workflow needs to copy into its result. Do not add a directory merely because the skill format allows one.

## Match specificity to risk

The right amount of instruction depends on how costly a mistake is.

| Workflow shape | Instruction style | Example |
| --- | --- | --- |
| Several acceptable answers | Principles and decision questions | Review a proposed module boundary. |
| One preferred pattern with configurable details | A template, pseudocode, and named parameters | Create a service adapter from a known API contract. |
| Fragile or safety-sensitive sequence | Exact commands, preconditions, and stop conditions | Rotate a credential through an approved runbook. |

Low freedom is not better by default. A narrow script-like skill for exploratory architecture work produces shallow choices. A vague, high-freedom skill for a database migration can skip the only step that protects data. The useful question is: how much variation can the workflow tolerate before the result becomes unsafe or untrustworthy?

## Strong software-engineering targets

The following targets have repetition, local context, and verifiable outputs. They are good candidates once you have at least one successful example.

- **CI diagnosis and repair**: Preserve log access, failure classification, local reproduction commands, narrow tests, and escalation rules.
- **Pull-request review**: Capture repository conventions, risk areas, expected comment tone, and the checks required before recommending approval.
- **Release notes**: Combine merged pull requests, product language, changelog rules, and a reviewable output template.
- **Dependency updates**: Encode supported version ranges, lockfile commands, migration notes, compatibility tests, and the line between safe updates and security review.
- **Database migrations**: Include the migration policy, backup or rollback boundary, data-contract checks, and production approval point.
- **API contract changes**: Reuse schema conventions, generated-client commands, compatibility checks, and consumer impact review.
- **Browser regression checks**: Record the routes, fixtures, accessibility checks, screenshots, and failure artifacts that make a UI review repeatable.
- **Incident triage**: Gather the approved logs and dashboards, classify impact, create the right update, and stop before privileged remediation.
- **Repository-specific content work**: Preserve frontmatter rules, source standards, link conventions, build commands, and publishing review criteria.

OpenAI's current Codex examples point to the same category of work: test commands, release checklists, review rules, repository scripts, CI repair, pull-request comments, and release-note generation. Those are useful precisely because an organization has facts the model cannot infer from general programming knowledge. [Save workflows as skills](https://learn.chatgpt.com/use-cases/reusable-codex-skills).

## Poor targets, and what to use instead

Some requests sound repeatable but still make poor skills.

| Poor target | Why it fails | Better move |
| --- | --- | --- |
| "Write better code" | No shared definition of better, no finite procedure, and no evidence target. | Use normal review and define the concrete quality concern. |
| "Build any feature" | Product intent, constraints, and acceptance criteria vary too much. | Start with a feature brief and add a skill only after a stable implementation pattern emerges. |
| "Know the whole codebase" | The knowledge is large, changing, and rarely relevant all at once. | Add focused architecture references or a repository-map workflow. |
| "Always use the latest library guidance" | Facts decay and a static skill becomes misleading. | Browse current primary documentation during the task. |
| "Deploy to production" | The safety policy and approval authority matter more than the command sequence. | Use a guarded release runbook with explicit human approval. |
| "Choose the right architecture" | The tradeoff depends on product, team, costs, and risk. | Use a decision-record template and keep the final choice human-owned. |
| "Fix every security issue" | Findings need triage, threat context, and a verified remediation plan. | Use a security scan workflow plus human review of material changes. |

The common failure is building a skill around an aspiration rather than an operating procedure. If a future agent cannot tell when it has succeeded, it cannot safely automate the work.

## Build the skill in an honest loop

Use this sequence:

1. Collect one or more successful examples and the commands, docs, and output they used.
2. Write the smallest `SKILL.md` that captures the trigger, steps, boundaries, and validation.
3. Add a reference, script, or asset only when it removes repeated work or preserves non-obvious context.
4. Run the skill on a fresh, realistic task.
5. Compare the result with the accepted example.
6. Add the missing rule only when it generalizes.

The final step prevents skills from becoming transcripts of a single lucky session. A good correction names a stable condition: "when a migration changes a public enum, run the compatibility suite." A weak correction records accidental context: "use the command that worked last Tuesday."

## Validate behavior, not just formatting

Start with structural validation. A valid skill needs one `SKILL.md` file with correct frontmatter. If you package skills for the OpenAI API, the current documentation also sets bundle limits and versioning rules. [OpenAI's Skills guide](https://developers.openai.com/api/docs/guides/tools-skills) documents those platform-specific constraints.

Then validate the behavior that motivated the skill:

| Check | Question |
| --- | --- |
| Trigger test | Does the skill activate for the intended request and stay out of unrelated work? |
| Happy path | Can it reproduce the successful workflow using real artifacts? |
| Boundary test | Does it stop for credentials, destructive action, ambiguity, or missing approval? |
| Failure test | Does it produce useful evidence when a command, test, or dependency fails? |
| Regression test | Does a later task still follow the important rules without unnecessary baggage? |

Use raw artifacts in these tests: a real failing log, a representative pull request, a checked-in fixture, or an accepted release note. Do not give the evaluator the intended answer. If a skill only works when the test prompt repeats its hidden assumptions, the skill has not captured the workflow.

## Keep skills alive

A skill is maintained operational knowledge. Update it when a command changes, a validation gate catches a new failure class, a policy boundary moves, or a new example reveals a missing general rule. Remove instructions that no longer affect decisions.

Review external integrations with extra care. A skill that reads untrusted web pages, issue text, logs, or tool output can carry prompt-injection instructions into an agent's context. Treat external text as data, keep credentials and secrets out of skill files, and put approval boundaries around meaningful side effects. The OpenAI documentation specifically calls out prompt-injection and data-exfiltration risks when skills run with network access. [Skills safety guidance](https://developers.openai.com/api/docs/guides/tools-skills).

The goal is not a giant library of prompts. It is a small set of tested, discoverable operating procedures that make repeated engineering work safer and faster.

## References

- [OpenAI, Save workflows as skills](https://learn.chatgpt.com/use-cases/reusable-codex-skills): Skill targets, source material, lifecycle, and example engineering workflows.
- [OpenAI, Skills guide](https://developers.openai.com/api/docs/guides/tools-skills): Skill discovery metadata, `SKILL.md` loading, bundle structure, validation, versioning, and safety considerations.
- [Agent Skills specification](https://agentskills.io/specification): The interoperable `SKILL.md` format and frontmatter requirements.

## Related topics

- [Claude Code, leaks, and the clean-room way to study agents](../2026-07-24-claude-code-clean-room-agent-internals/)
- [MCP 5: Tool Design for Models](../2026-07-19-mcp-tool-design-for-models/)
- [MCP 7: Build a Client and Model Tool Loop](../2026-07-19-build-mcp-client-model-loop/)
- [AI Harness Development](../../topics/ai/harness-development/)
- [Permission and Trust Models](../../topics/ai/harness-development/permission-models/)
