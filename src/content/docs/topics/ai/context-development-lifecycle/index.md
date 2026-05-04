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

### Generate

Authoring context means making implicit organizational knowledge explicit. Three layers:

- **Technical**: coding standards, library choices, architectural patterns, naming conventions
- **Project**: scope decisions, timelines, what is in and out of bounds
- **Business**: system purpose, customer expectations, compliance requirements

AI can draft initial context, but a human has to verify accuracy. The work is encoding what is organization-specific and not otherwise inferrable from the model's pretraining.

### Evaluate

Evals for context work like TDD for code: define what correct agent behavior looks like for a given scenario, then verify the context produces that behavior.

Three eval levels:

- **Review evals**: deterministic pass/fail against specific criteria
- **Task evals**: does the agent behave correctly in isolation with this context?
- **Project evals**: does behavior hold in the full codebase environment?

Because LLM outputs are non-deterministic, evals use error budgets rather than hard pass/fail gates. SkillsBench recommends five trials minimum per scenario before drawing conclusions. When an eval fails, it typically reveals a gap in the context spec, not a model failure.

Defining quality for evals is itself a business decision spanning product, engineering standards, and organizational values. You cannot delegate judgment you have not defined.

### Distribute

Context packaged as versioned, published artifacts scales across teams the way npm and pip scaled code reuse:

- Cross-team knowledge sharing without manual copying
- Supply chain security for shared guidance
- Automatic updates for dependent projects
- Visibility when context decays or conflicts arise

Without distribution infrastructure, context improvements stay local and silently diverge from the shared baseline.

### Observe

Real-world agent usage surfaces what synthetic evals miss. Key signals:

- **Clarifying questions**: the agent lacks something it needs
- **Unexpected choices**: the context is ambiguous
- **Technically correct but unintended code**: unstated assumptions are being violated

Observations feed back into evals (expanding coverage) and into generation (filling the gaps). This closes the loop and makes context progressively more accurate over time.

## The context flywheel

Each complete CDLC cycle produces compound returns. When senior engineers encode expertise as tested, versioned context, the organization gains four returns at once:

1. **Agent quality**: agents handle the domain consistently rather than guessing at conventions
2. **Deeper expertise**: encoding tacit knowledge forces engineers to articulate it, which clarifies their own thinking
3. **Team learning**: junior developers absorb expected patterns through shared context
4. **Organizational alignment**: repeated cycles converge terminology and standards

Models and tools are commoditizing. Structured organizational context is not. Two years of continuously refined context creates a compounding advantage that a new team cannot replicate by choosing a better model.

## Key failure modes

**Context rot**: stale guidance does not fail loudly. It silently degrades agent output. Unlike a broken test, outdated instructions produce plausible but wrong results with no alert.

**The whack-a-mole problem**: adding one instruction changes broader agent behavior. LLMs are not rule engines; every new constraint shifts the full output distribution. No eval suite captures all interaction effects.

**Scale paradox**: infinite context windows do not solve consistency and governance problems. They amplify them by increasing contradiction density. More context surface area means more places for conflicts to hide.

**Stale evals**: evals decay independently from context. External agent updates can break passing evals without touching context. Run evals on a schedule, not only on context changes.

## CI/CD for context

The same pipeline patterns from software delivery apply to context, with modifications:

- Gate merges on eval suites the same way you gate on tests
- Use error budgets (acceptable failure rates per eval type) rather than binary pass/fail
- Run fast subsets locally; full suites on CI servers before merging
- Track side effects: rerun the full suite after any context modification, not just related evals
- Wire agents to observability tooling (Langfuse, etc.) to surface real-world failure patterns

The key difference from code CI: non-determinism means the same eval can pass and fail on identical context. Measure distributions across multiple runs, not individual results.

## Comparison: CDLC vs. prompt engineering

| Concern | Prompt engineering | CDLC context engineering |
|---|---|---|
| Scope | Single prompt or turn | Organizational knowledge base |
| Lifecycle | Author once, revise ad hoc | Generate, evaluate, distribute, observe |
| Testing | Manual spot-checks | Evals with error budgets |
| Versioning | Ad hoc | Versioned packages |
| Failure mode | Bad single output | Silent degradation across all outputs |
| Ownership | Individual author | Designated context owner |

## References

- [Context Is the New Code, Patrick Debois (YouTube)](https://www.youtube.com/watch?v=bSG9wUYaHWU)
- [The Context Development Lifecycle, Tessl blog](https://tessl.io/blog/context-development-lifecycle-better-context-for-ai-coding-agents/)
- [CI/CD for Context in Agentic Coding, Tessl blog](https://tessl.io/blog/cicd-for-context-in-agentic-coding-same-pipeline-different-rules/)
- [The Context Flywheel, Tessl blog](https://tessl.io/blog/the-context-flywheel-why-the-best-ai-coding-teams-will-win-on-context/)

## Related topics

- [Context engineering (harness-level)](../harness-development/context-engineering/), what the harness assembles at runtime: window budget, caching, compaction
- [AI Harness Development](../harness-development/), the scaffolding layer the CDLC feeds into at runtime
- [Prompt Engineering](../prompt-engineering/), the narrower craft of designing individual model inputs
- [AI Skill Development](../skill-development/), packaged capabilities that are themselves a form of distributable context
