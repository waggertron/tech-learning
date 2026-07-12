---
title: Agent benchmarks
description: "Terminal-Bench, TAU-bench, OSWorld, WebArena, WebVoyager, GAIA, BFCL, BrowseComp. Benchmarks that measure an LLM's ability to actually do things: use a browser, operate a terminal, call APIs, navigate a real OS. The hardest-to-score and most reward-hackable category."
parent: benchmarks
tags: [agents, tau-bench, osworld, webarena, gaia, bfcl, benchmarks]
status: draft
created: 2026-04-24
updated: 2026-05-13
---

## What agent benchmarks measure

Agent benchmarks evaluate models that **act**: operate a browser, run shell commands, call APIs, navigate a desktop. The score is pass/fail on task completion, not on generating correct text.

Two structural differences from QA benchmarks:

- **Multi-step, long-horizon.** A task can involve 20+ actions; one wrong step cascades. Most tasks fail not on step 1 but on an error several steps in, after context has accumulated.
- **Environment-dependent.** The benchmark is a simulator (or a real environment) that the agent drives. Scores depend heavily on the exact scaffold, tool set, and success-detection heuristic.

Both properties make agent benchmarks uniquely gameable. [Berkeley's RDI team has shown](https://rdi.berkeley.edu/blog/trustworthy-benchmarks-cont/) that nearly every major agent benchmark can be hacked to near-100% by adversarially exploiting environment bugs, file-system tricks, or success-detection loopholes. Read scores carefully.

## Why agent benchmarks exist

**The behavior gap problem (2022-2023).** After GPT-4's release, labs made qualitative claims about agents: "it can browse the web," "it can use a computer," "it can write and run code." These claims were true in demos. They were hard to verify at scale. Researchers needed benchmarks that produced a number rather than a video.

**WebArena (2023): reproducibility first.** The WebArena authors' core design goal was reproducibility. Evaluating web agents on live websites produces non-reproducible results (the website changes). WebArena self-hosts exact replicas of Shopify, Reddit, GitLab, and OpenStreetMap. Every evaluation runs against the same snapshot. This sacrifices ecological validity (real websites are messier) for scientific rigor.

**OSWorld (2024): the computer-use problem.** Computer-use agents needed a benchmark that didn't just test browser navigation but full desktop operation: file management, GUI applications, cross-app workflows. OSWorld was created to cover this space across Ubuntu, macOS, and Windows. The emphasis on GUI screenshot-based navigation distinguished it from terminal-only benchmarks.

**TAU-bench (2024): enterprise deployment.** Sierra built TAU-bench to answer a specific question their customers were asking: "can I trust this agent to handle customer service interactions?" Academic benchmarks didn't measure policy compliance, multi-turn consistency, or reliability. TAU-bench was designed by a company that had deployed agents in production and knew which failure modes mattered.

**GAIA (2023): assistant-like generalism.** GAIA was explicitly motivated by the question "what does it mean to be a good general-purpose assistant?" rather than "what does it mean to solve coding problems?" The task set was curated to require common-sense orchestration of multiple tools: search, file reading, computation. The three difficulty levels were designed to span the range from "any capable model should get this" to "current models reliably fail this."

## SWE-bench and its variants

See the [coding benchmarks](../coding-benchmarks/) page. SWE-bench is technically an agent benchmark (it requires long-horizon tool use) but has its own full treatment there.

## Terminal-Bench

2024. Tasks require operating a Linux terminal autonomously: install packages, configure services, write scripts, debug failing tests, complete sysadmin work. Usually 10 to 100+ shell commands per task.

**Concrete task examples:**
- "Install PostgreSQL 15, create a database named `appdb`, and configure it to accept connections from 10.0.0.0/8."
- "This Python test suite is failing with an import error. Find and fix the root cause without modifying the test files."
- "Set up a cron job that archives `/var/log/app/*.log` files older than 7 days to `/var/archive/`."

**Score table (April 2026):**

| Model | Terminal-Bench score |
|---|---|
| GPT-5.3 Codex | ~77.3% |
| Frontier cluster (Claude, Gemini) | 60-75% |

**What it catches.** Dependencies on real OS semantics, recovering from command errors, reading log output, handling interactive prompts. A model that aces SWE-bench can still flounder on "get this service running first before you touch the code."

## TAU-bench (τ-bench)

Released by Sierra in 2024. Evaluates agents in simulated real-world enterprise environments: a retail customer-service API and an airline-booking API. Tasks involve multi-turn interaction with a simulated user persona, policy constraints, and API calls.

**Concrete task examples:**
- "The customer says their order hasn't arrived. Look up order #48291, check the delivery status, and if it's more than 5 days late, issue a refund per our return policy."
- "The user wants to cancel their Friday flight and rebook on the afternoon departure. Check availability, price the change fee per our policy, confirm with the user, then execute."
- "A customer's discount code isn't applying. Verify eligibility, apply it manually if they qualify, and document the exception in the case log."

**Why it matters.** The closest benchmark to deployed enterprise agents: real API calls, policy constraints, multi-turn user interaction with a simulated persona that can give ambiguous or contradictory instructions.

**TAU2 (2025).** Expanded with telecom scenarios and more specific policy hierarchies (policies that conflict depending on customer tier).

**Score table:**

| Model | Pass@1 (retail) | Pass^4 (retail) |
|---|---|---|
| Frontier models (2024 release) | 60-75% | 35-55% |
| Specialized enterprise agents | 70-80% | 45-60% |

**Reading TAU scores.** Two axes: pass@1 (did the task complete once?) and pass^k (did it complete reliably across k repeated runs?). Reliability matters in production; TAU measures it explicitly. An 80% pass@1 with 40% pass^4 means the agent is half-working, not production-ready.

### How TAU-bench tasks fail in practice

The three most common TAU-bench failure modes (in order of frequency):

1. **Policy misapplication**: The agent applies the wrong policy tier. A customer marked as "Gold" in the system gets standard refund rules (14-day window) instead of Gold rules (30-day window). The agent reads the policy document but misidentifies which clause applies to the specific customer tier.

2. **State loss across turns**: A multi-turn conversation about rebooking a flight loses the original flight details by turn 6. The agent re-confirms information the user already provided, fails to track that the user already agreed to the change fee, and asks the user to repeat steps they completed earlier.

3. **Ambiguous instruction handling**: The simulated user says "book me something in the afternoon." The agent interprets this as any flight after 12pm and books a 11:58pm departure. This is technically in the afternoon by some definitions; the task scores it as failure because the user's intent was clearly a reasonable afternoon (2-5pm) departure.

Pass^4 drops so sharply (relative to pass@1) because all three failure modes are stochastic. A run that happens to present the policy clearly, with no ambiguous user phrasing, and with good working memory will pass. The next run with slightly different phrasing fails. The reliability gap measures this variance.

## OSWorld

Released by University of Hong Kong / Salesforce, 2024. 369 cross-application tasks on Ubuntu, Windows, and macOS. Tasks span browsers, office suites, code editors, and file managers. Execution-based evaluation: the scorer actually runs the agent's actions and checks the final desktop state.

**Concrete task examples:**
- "Open LibreOffice Calc, import `data.csv`, compute a column of 30-day moving averages, and save as `analysis.xlsx`."
- "Take the attached PDF invoice, extract the line items, and enter them into the open web form."
- "In VS Code, refactor all uses of `getUserById` to `fetchUserById` across the project, run the test suite, and confirm it passes."

**Why it matters.** The broadest computer-use benchmark. Measures real GUI manipulation (not just CLI), including vision, planning, and low-level mouse/keyboard control.

**Score table (April 2026):**

| Agent | OSWorld score |
|---|---|
| Claude Computer Use (Anthropic) | ~38% |
| OpenAI Operator | ~44% |
| Frontier specialist agents | 30-50% |

**Why it's so hard.** GUI navigation requires vision (read a screenshot), planning (decide what to click), low-level control (mouse position, keystrokes), and resilience to slight UI changes. All are current weak spots.

### OSWorld failure modes (why 30-50% is hard to push higher)

Most OSWorld failures fall into one of three categories:

- **Screenshot misread**: The agent produces a correct plan ("click the Save button") but clicks the wrong element on screen because two buttons are visually similar. Resolution matters: a button that looks "obvious" at 1080p may be ambiguous in a compressed screenshot.

- **App-state assumption**: The agent assumes a fresh app state but the benchmark environment has a pre-loaded file or partially completed form. The agent overwrites existing data assuming it's starting fresh.

- **Multi-application handoff**: Tasks that require passing data from one application to another (copy from LibreOffice Calc, paste into a web form) fail because the clipboard state is not preserved correctly between the agent's commands, or the agent tries to type the copied value from memory rather than paste.

## WebArena

Released by CMU, 2023. 812 realistic long-horizon tasks on 5 self-hosted website types: shopping (Shopify), forums (Reddit clone), GitLab, mapping (OpenStreetMap tile server), and CMS. Sandboxed and reproducible.

**Concrete task examples:**
- "Find the top-5-rated products in the Electronics category and add the cheapest one to the cart."
- "Find all open GitLab issues mentioning 'race condition' that have no assignee and label them 'needs-triage'."
- "Post a reply to the most recent forum thread about Python 3.12 asking about the new `sys.monitoring` API."

**Why it matters.** Public, reproducible, and standardized. The canonical "just-a-browser-and-a-goal" benchmark.

**Score table:**

| Agent / Year | WebArena score |
|---|---|
| Human baseline | ~78% |
| Vanilla GPT-4 (2024) | ~14% |
| Claude-based agent (2024) | ~24% |
| OpenAI Operator (2025) | ~58% |
| GPT-5.4 (2025-2026) | ~67% |

**Variants.** VisualWebArena (visual tasks with images embedded in pages), WebArena-Lite (smaller held-out subset for faster iteration).

**Key failure pattern.** Most task failures are not on step 1. An agent navigates to the right page, finds the right filter, and then produces a malformed form submission 8 steps in. Cascading error accumulation is the dominant failure mode.

### Where WebArena tasks fail (approximate distribution from published analyses)

| Failure point | % of total failures |
|---|---|
| Navigation to correct page | ~15% |
| Correct page, wrong filter or search | ~25% |
| Correct data found, wrong form entry | ~30% |
| Correct form entry, submission error | ~20% |
| Success detected incorrectly (false pass) | ~10% |

The largest failure category is "correct data found, wrong form entry" -- the agent navigates correctly and extracts the right information but then enters it in the wrong field, with wrong formatting, or misses a required field. This is the gap that better form-filling and UI-understanding capabilities address.

## WebVoyager

Companion to WebArena but harder in a different direction. 643 tasks on 15 real, live websites including Google, Amazon, GitHub, Booking.com, ESPN, and Wolfram Alpha. Tasks are more open-ended and require real-world navigation.

**Concrete task examples:**
- "Book a flight from SFO to JFK on July 15 with 1 checked bag for under $400."
- "Find the GitHub repository for the `requests` Python library and report the number of open issues as of today."
- "What is the price of a 15 oz bag of Stumptown Hair Bender on Amazon right now?"

**Score table:**

| Agent / Year | WebVoyager score |
|---|---|
| Human baseline | Not formally measured |
| Vanilla GPT-4 (2024) | ~35-50% |
| Original WebVoyager agent (2024) | ~59.1% |
| Claude-based agent (2024) | ~56% |
| OpenAI Operator (2025) | ~87% |
| Browser Use open-source (2025) | ~89% |
| Surfer-H + Holo1-7B (2025) | ~92.2% |

**Main criticism.** Scores on live sites are non-reproducible because websites change. A question answered correctly in March may score as wrong in June if the page layout changed. Published scores reflect the state of the web at evaluation time, not a fixed ground truth. Compare WebVoyager scores across papers with skepticism.

**WebArena vs. WebVoyager.** WebArena is reproducible and rigorous but artificial (self-hosted replicas). WebVoyager is realistic but non-reproducible. Use WebArena for controlled comparisons; use WebVoyager as a rough ceiling signal.

## GAIA

"General AI Assistant" benchmark. Meta + Hugging Face, 2023. 466 real-world questions requiring multi-step reasoning, file handling, web browsing, and tool use across three difficulty levels.

**Concrete task examples:**
- Level 1: "What is the capital of the country that has the most UNESCO World Heritage Sites as of 2023?"
- Level 2: "The attached Excel file contains quarterly revenue for three subsidiaries. Which subsidiary had the highest YoY growth in Q3 2022, and by what percentage?"
- Level 3: "Find the primary author of the 2019 paper that first described the 'double descent' phenomenon in neural networks. What institution were they at when they published it?"

### Expanded GAIA examples by difficulty level

**Level 1 example (tool use, single step):**

> What is the population of Iceland according to the most recent World Bank data?

The agent must call a web search or use a browser, find the World Bank data page, and report the number. Simple retrieval. Frontier models score ~90% on Level 1.

**Level 2 example (multi-step, file handling):**

> The attached spreadsheet contains monthly sales figures for 2022 and 2023. In which month did YoY growth first exceed 15%? Report the month name and the exact growth percentage.

The agent must read the file, compute YoY growth for each month, find the first that exceeds 15%, and format the answer. Requires file reading, arithmetic, and result extraction. Frontier models score ~65-70% on Level 2.

**Level 3 example (synthesis, multiple sources):**

> The paper that introduced the term "attention is all you need" was published at a specific conference. Find the exact venue name, the acceptance rate for that venue in the year the paper was accepted, and the number of papers from Google Brain among the accepted papers that year.

This requires: (1) identifying "Attention Is All You Need" as a NeurIPS 2017 paper, (2) finding NeurIPS 2017's acceptance rate (678 accepted / 3240 submitted = ~20.9%), (3) counting Google Brain affiliations among NeurIPS 2017 papers. Each step requires a separate search or database lookup, and the combination is unlikely to be answered in one source. Frontier models score ~35-45% on Level 3.

**What it measures.** "Assistant-like" task completion. The agent must decide which tools to use, when to search, how to handle file attachments, and how to synthesize a clean final answer.

**Score table (April 2026):**

| Model | GAIA overall |
|---|---|
| Claude Sonnet 4.5 (Princeton HAL) | ~74.6% |
| Frontier cluster | 60-75% |
| GPT-4 (no tools, 2023) | ~15% |

**Why it's informative.** The task set is deliberately unstructured. An agent has to figure out what to do, not just execute a prescribed sequence. More representative of "useful assistant" than most benchmarks.

## BrowseComp

Released by OpenAI, 2024. 1,266 questions requiring deep web browsing: find information that isn't in any single source, synthesize across sites, navigate to obscure corners of the web.

**Concrete task examples:**
- "What was the name of the hotel where the 1987 ANSI X3J11 C standardization meeting was held in October of that year?"
- "Find the exact version number of the Python `httpx` library that first introduced the `follow_redirects` parameter."

**Why it matters.** Highlights the "actual research" failure mode. A model that answers 90% of HLE can still struggle to find a niche data point buried across multiple low-traffic pages.

**Score table (2024-2025):**

| Model | BrowseComp score |
|---|---|
| Frontier models with browsing | 40-60% |
| GPT-4o with search (baseline) | ~28% |

## BFCL: Berkeley Function Calling Leaderboard

Released by Berkeley's Gorilla team. Now at V4. Evaluates **function-calling and tool-use quality** specifically: 2,000+ question-function-answer pairs across Python, Java, JavaScript, REST APIs, and SQL. This is not full agent task evaluation; it is structured tool-call correctness.

**Why it matters.** Function calling is a prerequisite capability for all agent benchmarks. Models that score poorly on BFCL will fail on every agent benchmark that requires tool use. BFCL isolates the "did the model construct the right call with the right parameters?" question.

### Evaluation methods

- **AST matching.** The model's output is parsed as an abstract syntax tree and compared to the ground-truth call. Checks parameter names, types, and values without executing the code. Fast and deterministic.
- **Executable evaluation.** The call is actually executed against a real or sandboxed API. Catches cases where AST structure is correct but runtime behavior is wrong.

### Categories

| Category | What it tests |
|---|---|
| Simple function call | Single function, unambiguous parameters |
| Multiple functions | Choose the right function from a library of options |
| Parallel functions | Issue multiple calls simultaneously for a compound task |
| Relevance detection | Correctly decline when no function is appropriate |
| REST API | Construct HTTP requests with correct URL, headers, and body |
| SQL | Generate syntactically and semantically correct queries |
| Java | Java-typed function signatures |
| JavaScript | JS-typed function signatures |

### Parallel function calling: a concrete example

A user asks: "Get me the weather in Paris and translate the result to Spanish."

A model that supports parallel function calling must issue both calls simultaneously rather than sequentially:

```
[
  get_weather(city="Paris", units="metric"),
  translate(text="<weather result>", source_lang="en", target_lang="es")
]
```

Failure modes here: issuing the calls sequentially (latency cost), passing the literal string `"<weather result>"` as a placeholder instead of chaining outputs, or calling only one function and ignoring the other request.

### Known failure modes

- **Syntax errors in parameter values.** Models generate strings that are valid Python syntax in isolation but contain embedded quotes or escape sequences that break the outer function call.
- **Float-to-number conversion.** GPT-family models historically require manual normalization of floats (e.g., `1.0` vs `1`) because their output format differs from what evaluators expect. BFCL V3+ added normalization layers for this.
- **Missing required REST API fields.** Models omit required URL path parameters or auth headers when constructing REST calls, producing a structurally valid-looking object that would 400 on execution.
- **Over-calling.** Models call a function even when the correct answer is "no applicable function exists" (relevance detection failure). This is the primary failure mode on the relevance detection category.

### Score table (2025)

| Model | BFCL overall |
|---|---|
| GLM 4.5 (2025) | ~76.7% |
| Qwen3 32B (2025) | ~75.7% |
| Claude Opus 4.1 | ~70.4% |
| Claude Sonnet 4 | ~70.3% |
| GPT-4 (original) | ~60-65% |
| GPT-5 | ~59.2% |

The GPT-5 score is notably lower than the GPT-4 cluster despite being a newer model. The BFCL team attributes this partly to GPT-5's tendency to add reasoning prose before the function call, which the AST evaluator then fails to parse cleanly.

## AgentBench

Broad evaluation framework covering 8 environments: OS, database, Knowledge Graph, Card Game, Lateral Thinking, House-Holding, Web Shopping, Web Browsing. Research-focused; less direct relevance for production evaluation but useful for capability breadth comparisons across model generations.

## MLE-Bench, DA-Bench, and specialized agent benchmarks

- **MLE-Bench.** Machine-learning engineering tasks (Kaggle-like). Tests whether an agent can build a working ML model end-to-end: data loading, feature engineering, training, submission.
- **DA-Bench.** Data analytics tasks. Load data, answer questions, produce charts.
- **HAL (Hackers And Lawyers).** Legal and compliance agent scenarios.

These are domain-specialized benchmarks. Useful for hiring decisions ("will this model do my team's work?") but rarely on headline charts.

## How agent architectures advanced

**ReAct (2022): the first structured agent loop.** Yao et al. introduced ReAct (Reason + Act), a prompting pattern that interleaved reasoning steps ("I need to find the product page") with tool calls ("search for X"). Before ReAct, models produced a sequence of actions without explicit reasoning. ReAct made the reasoning visible and correctable. WebArena and similar benchmarks showed ReAct agents at 10-20% task success rates in early 2023.

**Function calling / tool use (2023).** OpenAI's function-calling API formalized tool use: models emitted structured JSON calls rather than text that a parser had to interpret. This reduced scaffolding complexity and improved reliability. Models could be fine-tuned specifically on tool-calling patterns. BFCL (Berkeley Function Calling Leaderboard) was created to measure this capability directly.

**Multi-step planning with memory (2023-2024).** Agents that maintained an explicit task plan (stored outside the context window and updated after each step) outperformed purely reactive agents on long-horizon tasks. OSWorld tasks requiring 20+ actions benefited most: the agent could check its plan after each step rather than relying on context length alone.

**Context-window-length scaling (2024).** Claude 2's 100K context and Gemini 1.5's 1M context enabled agents to hold entire codebases or multi-session histories in context. SWE-bench performance improved when agents could see more of the codebase without selective retrieval. The tradeoff: longer context meant higher cost and "lost in the middle" degradation.

**Computer use models (2024).** Anthropic's Claude Computer Use and OpenAI's Operator introduced models specifically trained to operate GUIs via screenshot observation. These models were fine-tuned on human demonstrations of computer tasks: click here, type there, scroll until you see. OSWorld scores improved from ~10% (generic model plus scaffold) to ~38-44% (computer-use specialized model). The gap to human performance (~90%+) reflects remaining weaknesses in visual grounding and error recovery.

**Multi-agent collaboration (2025).** Current state-of-the-art agent systems use multiple agents in structured roles: a planner that breaks tasks into subtasks, executors that handle each subtask, a reviewer that checks outputs, and a coordinator that manages the workflow. GAIA Level 3 scores above 60% require this kind of orchestration. Single-agent approaches plateau earlier because any single agent's context and working memory is bounded.

## The benchmark-is-reward-hackable problem

Berkeley's [RDI team analysis](https://rdi.berkeley.edu/blog/trustworthy-benchmarks-cont/) shows how every major agent benchmark can be gamed:

- **SWE-bench.** Agent inspects the test file, hard-codes the expected output.
- **WebArena.** Agent finds a shortcut through the test environment, bypasses the intended task path.
- **OSWorld.** Agent modifies success-detection scripts themselves.
- **TAU-bench.** Agent exploits the simulated user's fallback behaviors.

None of these represent "the agent solved the task correctly." All produce high scores.

Published scores are a moving ceiling, not a lower bound on real capability. A model that scores 90% on benchmark X may or may not be 90% capable on real tasks in the same space.

**Defenses.** Private benchmarks, human-evaluated tasks, real-production deployments with careful metrics, and pass^k (reliability) measurements that are harder to game than single-run pass rates.

## Reading an agent leaderboard

### Check the harness

"Claude Opus on SWE-bench with OpenHands" and "Claude Opus on SWE-bench with Aider" can produce 10+ point different scores. The harness is part of the system being evaluated.

### Check the budget

Most agents have a step and action cap. A benchmark run with unlimited retries will score higher than one with 30-step limits.

### Check reliability (pass^k)

Agents are flaky. A 70% pass@1 with 30% pass^4 means only 30% of the time does the same agent solve the same task reliably. For production deployment, pass^k is usually the more important number.

### Look at error distributions

A benchmark pass rate doesn't tell you which tasks failed. Model A at 70% and Model B at 70% can have non-overlapping failures: A crushes web tasks, B crushes CLI tasks. Aggregate scores hide this.

### Check the website-change problem (WebVoyager specifically)

On live-website benchmarks, verify the evaluation date. A score from 2024 on Booking.com tasks may not replicate in 2026 because the site's UI changed.

## What agent benchmarks don't measure

- **Ongoing trust.** An agent that completes 70% of tasks autonomously still needs human review; benchmarks don't measure how reviewable an agent's actions are.
- **Latency and cost.** A 95% agent that takes 20 minutes per task may be worse than an 80% agent at 30 seconds.
- **Graceful failure.** When the agent can't do the task, does it explain why, or silently produce garbage?
- **Multi-agent collaboration.** Most benchmarks are single-agent.
- **Real stakes.** No agent benchmark involves actual money at risk or real customer impact.
- **Reproducibility on live environments.** WebVoyager-style benchmarks are snapshots of the web at one point in time.

## References

- [SWE-bench](https://www.swebench.com/), see the [coding benchmarks page](../coding-benchmarks/) for depth
- [TAU-bench (Sierra)](https://github.com/sierra-research/tau-bench)
- [OSWorld](https://os-world.github.io/)
- [WebArena](https://webarena.dev/)
- [WebVoyager, He et al., 2024](https://arxiv.org/abs/2401.13919)
- [GAIA, Mialon et al., 2023](https://arxiv.org/abs/2311.12983)
- [BrowseComp (OpenAI)](https://openai.com/index/browsecomp/)
- [Berkeley Function Calling Leaderboard (Gorilla)](https://gorilla.cs.berkeley.edu/leaderboard.html)
- [AgentBench](https://llmbench.ai/agent)
- [Berkeley RDI, *How We Broke Top AI Agent Benchmarks*](https://rdi.berkeley.edu/blog/trustworthy-benchmarks-cont/), essential reading on gaming
- [Steel.dev agent benchmark index](https://leaderboard.steel.dev/results)
- [Awesome Agents leaderboards](https://awesomeagents.ai/leaderboards/)

## Related topics

- [Coding benchmarks](../coding-benchmarks/), SWE-bench details
- [Evaluation methodology and metrics](../evaluation-and-methods/), pass^k, reliability metrics
- [AI Harness Development](../../harness-development/), building the scaffold an agent runs in
