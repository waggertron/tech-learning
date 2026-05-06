---
title: Context Development Lifecycle
description: "Patrick Debois's framework for treating organizational context as a managed software artifact: generate it, evaluate it, distribute it, observe it in production, and refine through feedback."
category: ai
tags: [context-engineering, ai-agents, cdlc, devops]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## What it is

The Context Development Lifecycle (CDLC) is a framework for managing the knowledge AI coding agents need to work effectively in a specific codebase or organization. Patrick Debois (who coined "DevOps" in 2009, now at Tessl) proposed it as the organizational complement to technical context engineering: the harness decides what goes in the window at runtime; the CDLC decides what exists to put there in the first place.

The core claim: as AI coding agents improve, the bottleneck in software development shifts from generating code to explaining what the code should do and why. Agents start each session with zero institutional knowledge. A developer's job increasingly involves encoding that knowledge into structured, tested, versioned context.

## Why it matters

Prompt engineering is one-off input crafting. Context engineering (in the CDLC sense) is the systematic discipline of building the knowledge base agents draw from: coding conventions, architectural decisions, business rules, edge cases, team vocabulary.

Without a lifecycle for context:

- **Context rots.** Outdated guidance teaches agents incorrect patterns with no visible failure signal.
- **Context conflicts.** Contradictory instructions produce unpredictable agent behavior across the team.
- **Context stays locked.** Implicit knowledge in senior engineers' heads never reaches the agents.

The analogy to DevOps is deliberate. DevOps recognized that development and operations are one lifecycle, not two separate concerns. The CDLC makes the same argument for context and code: you cannot engineer one without the other.

## The four stages

```
  Generate ──> Evaluate ──> Distribute ──> Observe
     ^                                        |
     └────────────── refine ─────────────────┘
```

---

### Stage 1: Generate

Authoring context means making implicit organizational knowledge explicit. Three layers:

- **Technical**: coding standards, library choices, architectural patterns, naming conventions
- **Project**: scope decisions, timelines, what is in and out of bounds
- **Business**: system purpose, customer expectations, compliance requirements

AI can draft initial context, but a human has to verify accuracy. Context should not duplicate knowledge models already have from pretraining. The work is encoding what is organization-specific and not otherwise inferrable.

#### Context file formats by tool

Every major coding agent reads context from one or more files. The formats differ but the principle is the same: persistent markdown the agent loads before acting.

| Tool | File | When loaded |
|---|---|---|
| Claude Code | `CLAUDE.md` | Every conversation |
| Claude Code | `.claude/skills/*.md` | On demand by agent or human |
| Cursor | `.cursorrules` | Every session |
| Codex CLI | `AGENTS.md` | Every session |
| GitHub Copilot | `.github/copilot-instructions.md` | Every session |
| Tessl | `skill.md` package | Via `tessl install` |

`CLAUDE.md` and `AGENTS.md` are the closest to a cross-tool standard: both Cursor and Claude Code read `AGENTS.md` as of early 2026, making it a reasonable shared root.

#### What a context file looks like

A minimal `CLAUDE.md` for a Django project:

```markdown
# Project conventions

## Python style
- snake_case for all identifiers
- Type hints on all public functions
- No bare `except:` clauses; catch specific exceptions

## Architecture
- All database queries go through the repository layer, never inline in views
- Raise domain exceptions (UserNotFoundError, PaymentDeclinedError), not generic Exception
- Never import from `settings` directly in business logic; use injected config objects

## Testing
- pytest only; no unittest.TestCase subclasses
- Fixtures in conftest.py; never setUp/tearDown
- Database tests use the `db` fixture; mark as @pytest.mark.django_db

## What NOT to do
- Do not add print() debug statements; use logging.getLogger(__name__)
- Do not commit secrets; use environment variables
```

Effective range for `CLAUDE.md` is 200-400 lines. Beyond that, critical instructions compete for attention and the agent starts ignoring the middle.

#### Skill files vs. always-loaded context

Not everything belongs in `CLAUDE.md`. Skills (Claude Code's lazy-loaded context units) let the agent pull detailed guidance only when the task requires it. A skill for "database migrations" only loads when the agent is about to touch schema files.

```markdown
---
name: database-migrations
description: Guidelines for writing and running Django database migrations safely
trigger: "migration, schema change, alter table, RunPython"
---

Never squash migrations on a branch that has been deployed to staging or prod.
Always test migrations with both --run-syncdb and a real rollback before merging.
...
```

This keeps the base context lean and avoids the scale paradox (more context surface area = more contradiction surface area).

---

### Stage 2: Evaluate

Evals for context work like TDD for code: define what correct agent behavior looks like for a given scenario, then verify the context produces that behavior. When an eval fails, it reveals a gap in the context spec, not a model failure.

#### Tessl's three eval methodologies

**Skill Review (linting)**: static quality checks on the skill file itself, before any agent runs. Checks for:
- Frontmatter validity and required fields
- Clear, actionable instructions
- Appropriate scope and trigger conditions

This catches structural problems cheaply, the same way a linter catches syntax errors before tests run.

**Task Evals**: run the agent twice on a scenario, once with the context installed and once without, then compare outputs. The eval does not inspect the context file directly; it only measures the behavioral change. Example scenario for a naming-convention skill:

```
Task: Add a new user registration endpoint.
Expected: Function named register_user, not registerUser or RegisterUser.
Baseline (no context): agent uses camelCase 3/5 runs.
With context: agent uses snake_case 5/5 runs.
Result: skill improves correctness from 40% to 100% on this scenario.
```

**Repo Evals (beta)**: test context against real commits from the actual repository in isolated containers. The agent attempts the change; scoring checks correctness, minimal diff footprint, and adherence to patterns already present in the repo. This is the most realistic signal and the most expensive to run.

#### Non-determinism and error budgets

LLM outputs vary even at temperature 0. Binary pass/fail gates produce noisy CI results. Use error budgets instead: an acceptable failure rate per eval type (e.g., task evals must pass 4/5 runs, repo evals must pass 3/5). SkillsBench recommends five trials minimum per scenario before drawing conclusions.

Defining quality thresholds is a business decision: what level of convention adherence is "good enough" before merging a context change?

---

### Stage 3: Distribute

Context packaged as versioned, published artifacts scales across teams the way npm and pip scaled code reuse.

#### Tessl: the reference implementation

Tessl is a package manager and registry for agent skills. Install a community skill:

```bash
tessl install @tessl/django-rest-framework
tessl install @tessl/react-query
```

Publish an internal skill:

```bash
tessl publish @your-org/internal-api-conventions
```

The Tessl registry indexes over 3,000 evaluated skills covering 10,000+ open-source packages. Open-source maintainers can publish official guidance so agents use their APIs correctly; Tessl reports up to 3.3x improvement in correct API usage for packages with evaluated skills.

Skills installed via Tessl work across Claude Code, Cursor, and Gemini without ecosystem lock-in.

#### What distribution solves

Without it:
- Engineers copy-paste `CLAUDE.md` snippets into each repo manually
- A fix in one repo never reaches the others
- No visibility into which version of guidance each project is running

With versioned packages:
- `tessl update` pulls the latest reviewed guidance
- Dependents get a changelog when breaking changes land
- Supply chain auditing: you can inspect what an installed skill actually instructs before it runs

---

### Stage 4: Observe

Real-world agent usage surfaces what synthetic evals miss. Evals test scenarios you imagined; observation surfaces scenarios you did not.

#### Signals to watch

| Signal | What it means |
|---|---|
| Agent asks clarifying question | Knowledge gap: the context does not answer this |
| Agent makes unexpected choices | Ambiguity: multiple readings are plausible |
| Correct but convention-violating code | Unstated assumption: you forgot to write it down |
| Agent refuses or loops | Conflicting instructions pulling in different directions |

#### Wiring observability

[Langfuse](https://langfuse.com) and similar tools trace agent sessions and surface which turns produced failures, unexpected tool calls, or human corrections. The workflow:

1. Turn on tracing in your agent harness
2. Tag each session with the context version installed
3. Filter for sessions that ended with a human edit or a correction
4. Examine those sessions for the missing or ambiguous context

Vercel's team operationalized this directly: actual agent failures get turned into self-contained eval scenarios. Production failures become the eval test suite.

---

## The context flywheel

Each complete CDLC cycle produces compound returns. When senior engineers encode expertise as tested, versioned context, the organization gains four returns at once:

1. **Agent quality**: agents handle the domain consistently rather than guessing at conventions
2. **Deeper expertise**: encoding tacit knowledge forces engineers to articulate it, which clarifies their own thinking
3. **Team learning**: junior developers absorb expected patterns through shared context
4. **Organizational alignment**: repeated cycles converge terminology and standards

Models and tools are commoditizing. Structured organizational context is not. Two years of continuously refined context creates a compounding advantage that a new team cannot replicate by choosing a better model.

## Key failure modes

**Context rot**: stale guidance does not fail loudly. It silently degrades agent output. Unlike a broken test, outdated instructions produce plausible but wrong results with no alert. Version your context files and run scheduled evals, not only on-change evals.

**The whack-a-mole problem**: adding one instruction changes broader agent behavior. LLMs are not rule engines; every new constraint shifts the full output distribution. No eval suite captures all interaction effects. Always rerun the full suite after any context modification, not just related scenarios.

**Scale paradox**: infinite context windows do not solve consistency and governance problems. They amplify them by increasing contradiction density. More context surface area means more places for conflicts to hide. Skill files with narrow triggers beat one giant `CLAUDE.md`.

**Stale evals**: evals decay independently from context. A model update can break passing evals without touching context. Run evals on a schedule (e.g., weekly) in addition to on content changes.

**Undefined quality**: you cannot write meaningful evals without first defining what "correct" behavior looks like. That definition spans product, engineering standards, and org values. It is a human decision that cannot be delegated to the model.

## CI/CD for context

The same pipeline patterns from software delivery apply to context, with modifications:

```
context change ──> skill review (lint) ──> task evals (5x each) ──> merge gate
                                                |
                                          error budget check
                                      (must pass N/5 per scenario)
                                                |
                                         repo evals (CI)
                                                |
                                         deploy + observe
                                                |
                                    production failures ──> new eval scenarios
```

Key differences from code CI:

- Use error budgets, not binary pass/fail (non-determinism makes hard gates produce false negatives)
- Run full eval suites after *any* context change, even unrelated: the whack-a-mole problem is real
- Schedule independent eval runs to catch drift from external model updates

## Comparison: CDLC vs. prompt engineering

| Concern | Prompt engineering | CDLC context engineering |
|---|---|---|
| Scope | Single prompt or turn | Organizational knowledge base |
| Lifecycle | Author once, revise ad hoc | Generate, evaluate, distribute, observe |
| Testing | Manual spot-checks | Evals with error budgets |
| Versioning | Ad hoc | Versioned packages |
| Failure mode | Bad single output | Silent degradation across all outputs |
| Ownership | Individual author | Designated context owner |
| Tooling | None standard | Tessl, Langfuse, CI pipelines |

## References

- [Context Is the New Code, Patrick Debois (YouTube)](https://www.youtube.com/watch?v=bSG9wUYaHWU)
- [The Context Development Lifecycle, Tessl blog](https://tessl.io/blog/context-development-lifecycle-better-context-for-ai-coding-agents/)
- [Three Context Eval Methodologies at Tessl](https://tessl.io/blog/three-context-eval-methodologies/)
- [CI/CD for Context in Agentic Coding, Tessl blog](https://tessl.io/blog/cicd-for-context-in-agentic-coding-same-pipeline-different-rules/)
- [The Context Flywheel, Tessl blog](https://tessl.io/blog/the-context-flywheel-why-the-best-ai-coding-teams-will-win-on-context/)
- [Context Engineering for Coding Agents, Birgitta Böckeler (Martin Fowler)](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html)
- [Tessl Docs](https://docs.tessl.io/)
- [Tessl Registry](https://tessl.io/registry)

## Related topics

- [Context engineering (harness-level)](../harness-development/context-engineering/), what the harness assembles at runtime: window budget, caching, compaction
- [AI Harness Development](../harness-development/), the scaffolding layer the CDLC feeds into at runtime
- [Prompt Engineering](../prompt-engineering/), the narrower craft of designing individual model inputs
- [AI Skill Development](../skill-development/), packaged capabilities that are themselves a form of distributable context
