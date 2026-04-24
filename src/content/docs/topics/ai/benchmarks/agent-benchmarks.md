---
title: Agent benchmarks
description: Terminal-Bench, TAU-bench, OSWorld, WebArena, GAIA, BrowseComp. Benchmarks that measure an LLM's ability to actually do things, use a browser, operate a terminal, call APIs, navigate a real OS. The hardest-to-score and most reward-hackable category.
parent: benchmarks
tags: [agents, tau-bench, osworld, webarena, gaia, benchmarks]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What agent benchmarks measure

Agent benchmarks evaluate models that **act**, operate a browser, run shell commands, call APIs, navigate a desktop. The score is pass/fail on a task completion, not on generating correct text.

Two structural differences from QA benchmarks:

- **Multi-step, long-horizon.** A task can involve 20+ actions; one wrong step cascades.
- **Environment-dependent.** The benchmark is a simulator (or a real environment) that the agent drives. Scores depend heavily on the exact scaffold, tool set, and success-detection heuristic.

Both properties make agent benchmarks uniquely gameable. [Berkeley's RDI team has shown](https://rdi.berkeley.edu/blog/trustworthy-benchmarks-cont/) that nearly every major agent benchmark can be hacked to near-100% by adversarially exploiting environment bugs, file-system tricks, or success-detection loopholes. Read scores carefully.

## SWE-bench and its variants

See the [coding benchmarks](../coding-benchmarks/) page. SWE-bench is technically an agent benchmark, it requires long-horizon tool use, but has its own full treatment there.

## Terminal-Bench

2024. Tasks require operating a Linux terminal autonomously: install packages, configure services, write scripts, debug failing tests, complete sysadmin work. Usually 10–100+ shell commands per task.

**Current leader (April 2026).** GPT-5.3 Codex at ~77.3%; other frontier models clustered in the 60–75% range.

**What it catches.** Dependencies on real OS semantics, recovering from command errors, reading log output, handling prompts and interactive tools. A model that aces SWE-bench can still flounder on "you need to get this service running first."

## TAU-bench (τ-bench)

Released by Sierra in 2024. Evaluates agents in simulated real-world enterprise environments, a retail customer-service API and an airline-booking API. Tasks: "look up my order and extend the return window," "cancel my flight and rebook me on the afternoon one."

**Why it matters.** The closest benchmark to deployed enterprise agents, API calls, policy constraints, multi-turn user interaction with a simulated user persona.

**TAU2 (2025).** Expanded version with telecom scenarios and more nuanced policies.

**Reading TAU scores.** Two axes: pass rate (did the task complete?) and pass^k (did the task complete reliably across N repeated runs?). Reliability matters in production; TAU measures it explicitly. An 80% pass@1 with 40% pass^4 means the agent is half-working, not production-ready.

## OSWorld

Released by University of Hong Kong / Salesforce, 2024. 369 cross-application tasks on Ubuntu, Windows, and macOS. Tasks span browsers, office suites, code editors, file managers. Execution-based evaluation, the scorer actually runs the agent's actions and checks the final desktop state.

**Why it matters.** The most comprehensive computer-use benchmark. Measures real GUI manipulation, not just CLI.

**Saturation state (April 2026).** Still hard. Frontier models in the 30–50% range. Even specialized computer-use agents (Anthropic's Claude Computer Use, OpenAI's Operator) don't dominate.

**Why it's so hard.** GUI navigation requires vision (read a screenshot), planning (decide what to click), low-level control (mouse position, keystrokes), and resilience to slight UI changes. All are weak spots for current models.

## WebArena

Released by CMU, 2023. Canonical web-navigation benchmark. Agents operate against realistic, self-hosted replicas of Reddit, GitLab, Shopify, Wikipedia, and an OpenStreetMap tile server. Tasks: "find all open PRs mentioning bug X," "post a comment on this Reddit thread," "order a laptop under $500 on Shopify."

**Why it matters.** Public, reproducible, standardized. The "just-a-browser-and-a-goal" benchmark.

**Saturation state.** Frontier models 40–60% depending on the task category. Reddit and Shopify tasks are hardest; OpenStreetMap relatively easier.

**Variants.** VisualWebArena (visual web tasks with images), WebArena-Lite (smaller subset).

## GAIA

"General AI Assistant" benchmark. Meta + Hugging Face, 2023. 466 real-world questions requiring multi-step reasoning, file handling, web browsing, and tool use. Three levels of difficulty.

**What it measures.** "Assistant-like" task completion. Research a question, synthesize, deliver a clean answer.

**Current leader (April 2026).** Claude Sonnet 4.5 at ~74.6% on Princeton HAL's scoring; other frontier models clustered in the 60–75% range.

**Why it's informative.** The task set is deliberately unstructured. An agent has to decide which tools to use, when to search, how to handle attachments. More representative of "useful assistant" than most benchmarks.

## BrowseComp

Released by OpenAI, 2024. 1,266 questions requiring deep web browsing, find information that isn't in any one source, synthesize across sites.

**Why it matters.** Highlights the "actual research" failure mode. A model that answers 90% of HLE can still struggle to find the current CEO's birthday across multiple sources.

**Current state.** Frontier models with browsing in the 40–60% range. Hard.

## AgentBench

Broad evaluation framework covering 8 environments: OS, DB, Knowledge Graph, Card Game, Lateral Thinking, House-Holding, Web Shopping, Web Browsing. Research-focused; less direct relevance for production evaluation but useful for capability breadth.

## BFCL, Berkeley Function Calling Leaderboard

Specifically evaluates **function-calling / tool-use quality**. Not full agent tasks, but structured tool-call correctness across hundreds of functions and scenarios.

**Why it matters.** A prerequisite capability for all agent benchmarks. Models that score poorly on BFCL will fail on every agent benchmark.

## MLE-Bench, DA-Bench, and specialized agent benchmarks

- **MLE-Bench**, machine-learning engineering tasks (Kaggle-like). Tests whether an agent can build a working ML model end-to-end.
- **DA-Bench**, data analytics tasks. Load data, answer questions, produce charts.
- **HAL (Hackers And Lawyers)**, legal/compliance agent scenarios.

These are the domain-specialized agent benchmarks. Useful for hiring decisions (will this model do my team's work?) but rarely on headline charts.

## The benchmark-is-reward-hackable problem

Berkeley's [RDI team analysis](https://rdi.berkeley.edu/blog/trustworthy-benchmarks-cont/) demonstrates how every major agent benchmark can be hacked:

- **SWE-bench**, agent inspects the test file, hard-codes the expected output.
- **WebArena**, agent finds a shortcut through the test environment, bypasses the intended task.
- **OSWorld**, agent modifies success-detection scripts themselves.
- **TAU-bench**, agent exploits the simulated user's fallback behaviors.

None of these represent "the agent solved the task correctly." All produce high scores.

This means published scores are a moving ceiling, not a lower bound on real capability. A model that scores 90% on benchmark X may or may not be 90% capable on real tasks in the same space.

**Defenses:** private benchmarks, human-evaluated tasks, real-production deployments with careful metrics.

## Reading an agent leaderboard

### Check the harness

"Claude Opus on SWE-bench with OpenHands" and "Claude Opus on SWE-bench with Aider" can produce 10+ point different scores. The harness is part of the system being evaluated.

### Check the budget

Most agents have a step / action cap. A benchmark run with unlimited retries will score higher than one with 30-step limits.

### Check reliability (pass^k)

Agents are flaky. A 70% pass@1 with 30% pass^4 means only 30% of the time does the same agent solve the same task reliably. For production deployment, pass^k is usually the more important number.

### Look at error distributions

A benchmark pass rate doesn't tell you *which* tasks failed. Model A at 70% and Model B at 70% can have non-overlapping failures, A crushes web tasks, B crushes CLI tasks. Aggregate scores hide this.

## What agent benchmarks don't measure

- **Ongoing trust.** An agent that completes 70% of tasks autonomously still needs human review; benchmarks don't measure how reviewable an agent's actions are.
- **Latency and cost.** A 95% agent that takes 20 minutes per task may be worse than an 80% agent at 30 seconds.
- **Graceful failure.** When the agent can't do the task, does it explain why, or silently produce garbage?
- **Multi-agent collaboration.** Most benchmarks are single-agent.
- **Real stakes.** No agent benchmark involves actual money at risk or real customer impact.

## References

- [SWE-bench](https://www.swebench.com/), see the [coding benchmarks page](../coding-benchmarks/) for depth
- [TAU-bench (Sierra)](https://github.com/sierra-research/tau-bench)
- [OSWorld](https://os-world.github.io/)
- [WebArena](https://webarena.dev/)
- [GAIA, Mialon et al., 2023](https://arxiv.org/abs/2311.12983)
- [BrowseComp (OpenAI)](https://openai.com/index/browsecomp/)
- [Berkeley Function Calling Leaderboard](https://gorilla.cs.berkeley.edu/leaderboard.html)
- [AgentBench](https://llmbench.ai/agent)
- [Berkeley RDI, *How We Broke Top AI Agent Benchmarks*](https://rdi.berkeley.edu/blog/trustworthy-benchmarks-cont/), essential reading on gaming
- [Steel.dev agent benchmark index](https://leaderboard.steel.dev/results)
- [Awesome Agents leaderboards](https://awesomeagents.ai/leaderboards/)

## Related topics

- [Coding benchmarks](../coding-benchmarks/), SWE-bench details
- [Evaluation methodology and metrics](../evaluation-and-methods/), pass^k, reliability metrics
- [AI Harness Development](../../harness-development/), building the scaffold an agent runs in
