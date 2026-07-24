---
title: "Claude Code, leaks, and the clean-room way to study agents"
description: "Why public writing about coding-agent internals should not quote or depend on leaked source, and how to study the architecture anyway through loops, context, tools, permissions, hooks, subagents, MCP, and containment."
date: 2026-07-24
tags: [ai, agents, claude-code, coding-agents, architecture]
crosspost: [linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-24-claude-code-clean-room-agent-internals/
series:
  slug: coding-agent-internals
  order: 1
---

People are talking about leaked Claude Code source. That does not make leaked source a good source for public writing.

For an educational post series, leaked proprietary code creates three problems at once. It is legally messy. It is ethically weak. It is also a bad teaching artifact, because readers cannot safely inspect the same evidence, run the same examples, or reuse the same implementation details.

The better move is clean-room analysis. Treat the leak as the reason to ask a question, not as the evidence for the answer.

This series will study coding-agent internals through public documentation, observable product behavior, open protocols, and small examples we can own. No leaked code excerpts. No links to mirrors. No private prompts or private identifiers. No claims that only make sense if a reader has the leaked files open.

That boundary is not a dodge. It is the only way the series stays broadly useful.

## The architecture we can study safely

Claude Code is a terminal coding agent. The public docs describe a CLI, project and user settings, permissions, hooks, subagents, MCP servers, sandbox environments, managed enterprise settings, and installation paths. Anthropic's public engineering writing also describes agents as systems where models dynamically direct tool use, and containment as a separate layer from model supervision.

That is enough to study the real architecture category.

A terminal coding agent is not just a model. It is a harness:

```
User goal
   |
   v
Context assembler
   |
   v
Model turn
   |
   v
Tool-call request
   |
   v
Permission and policy gate
   |
   v
Tool executor
   |
   v
Observation shaping
   |
   v
Next model turn or stop
```

The model proposes. The harness disposes.

The engineering quality lives in the boundaries: what context reaches the model, what tools the model can request, which actions need approval, what the shell can touch, how outputs are summarized, and how the system recovers when a step fails.

## What the leak cannot teach cleanly

Leaked source tempts readers into the wrong layer of analysis. They start asking "what exact function did this product call?" instead of "what interface does this class of system need?"

Exact implementation details age quickly. Architecture lessons last longer:

- **A model needs an action loop**: without a loop, it is a chat response. With a loop, it can read files, run tests, edit, observe, and continue.
- **A loop needs a state model**: the harness has to track the current goal, plan, evidence, pending decisions, permissions, and failed attempts.
- **Tools need contracts**: a shell, file reader, diff applier, search tool, browser, or MCP server has to expose typed behavior the model can choose reliably.
- **Permissions need enforcement**: telling the model "be careful" is not the same as blocking a destructive action before execution.
- **Context needs curation**: appending every file and every command output eventually makes the model worse, not better.
- **Containment needs to live below the model**: sandboxing, scoped paths, egress limits, and credential isolation reduce damage when reasoning fails.

None of those points require leaked code.

## The clean-room source stack

The series will use this evidence stack, in order:

1. Official product docs for features and configuration behavior.
2. Public engineering posts for architecture claims.
3. Public protocols such as MCP for extension boundaries.
4. Observable CLI behavior a reader can reproduce on their own machine.
5. Toy implementations written from scratch to explain a pattern.
6. Existing open-source agents when comparison helps and licensing permits it.

That order matters. Public writing should be reproducible. If a reader cannot inspect the source, run the command, or verify the claim, the post needs softer language or a different source.

## The first boundary: prompt policy is not permission policy

The most important coding-agent distinction is this:

```
Prompt policy:
  Text the model is asked to follow.

Permission policy:
  Code the harness enforces before a tool runs.
```

A prompt can say:

```text
Do not run destructive commands.
Ask before changing files.
Never read secret files.
```

That is useful guidance, but it is still guidance. The model can forget, misread, get prompt-injected by a file, or propose a bad tool call during a long session.

The harness needs a separate policy gate:

```text
Tool call requested:
  name: run_shell
  args:
    command: "rm -rf build"

Policy result:
  decision: ask
  reason: destructive shell command
```

The model can request the action. The harness decides whether it can happen.

## A tiny permission gate

This Python example is deliberately small. It is not Claude Code. It is the shape of the boundary every coding agent needs somewhere.

```python
from dataclasses import dataclass
from enum import Enum
from fnmatch import fnmatch


class Decision(str, Enum):
    ALLOW = "allow"
    ASK = "ask"
    DENY = "deny"


@dataclass(frozen=True)
class ToolCall:
    name: str
    target: str
    mutates: bool
    external: bool = False


@dataclass(frozen=True)
class Rule:
    decision: Decision
    tool_pattern: str
    target_pattern: str
    reason: str

    def matches(self, call: ToolCall) -> bool:
        return fnmatch(call.name, self.tool_pattern) and fnmatch(
            call.target,
            self.target_pattern,
        )


RULES = [
    Rule(
        decision=Decision.DENY,
        tool_pattern="read_file",
        target_pattern="*.env",
        reason="secret-like files are outside the agent boundary",
    ),
    Rule(
        decision=Decision.DENY,
        tool_pattern="run_shell",
        target_pattern="rm *",
        reason="destructive shell commands are blocked",
    ),
    Rule(
        decision=Decision.ALLOW,
        tool_pattern="read_file",
        target_pattern="src/*",
        reason="source reads are allowed",
    ),
    Rule(
        decision=Decision.ALLOW,
        tool_pattern="run_shell",
        target_pattern="npm test",
        reason="known local test command",
    ),
]


def classify(call: ToolCall) -> tuple[Decision, str]:
    for rule in RULES:
        if rule.matches(call):
            return rule.decision, rule.reason

    if call.external:
        return Decision.ASK, "external side effects need approval"

    if call.mutates:
        return Decision.ASK, "unknown mutations need approval"

    return Decision.ASK, "unknown tool calls default to ask"


def explain(call: ToolCall) -> str:
    decision, reason = classify(call)
    return f"{decision.value}: {call.name} {call.target} ({reason})"


calls = [
    ToolCall(name="read_file", target="src/app.ts", mutates=False),
    ToolCall(name="read_file", target=".env", mutates=False),
    ToolCall(name="run_shell", target="npm test", mutates=False),
    ToolCall(name="run_shell", target="rm -rf dist", mutates=True),
    ToolCall(name="send_message", target="team-chat", mutates=True, external=True),
]

for call in calls:
    print(explain(call))
```

The useful part is not the exact rule syntax. The useful part is the separation:

- The model requests a tool call.
- The policy layer classifies it.
- Deny rules win over convenience.
- Unknown actions do not silently run.
- External or mutating actions move to approval unless explicitly allowed.

This is where a lot of agent safety actually lives. A bigger prompt cannot replace this boundary.

## The second boundary: context is not memory

Coding agents work because they can see more than the latest user message. They can read files, inspect command output, load repo instructions, remember previous steps, and summarize long sessions.

That does not mean every piece of text deserves the same trust.

```
High trust:
  system policy
  managed settings
  repository instructions reviewed by the team

Medium trust:
  user request
  local source files
  test output
  generated summaries

Low trust:
  public web pages
  dependency READMEs
  issue comments
  pasted logs from unknown systems
```

The harness has to label context by source and authority. A project README can contain useful setup instructions. It can also contain prompt injection. A test log can prove a command failed. It cannot prove the next command is safe.

This is one reason clean-room examples matter. We can build a small context assembler and inspect its behavior without inheriting anybody else's private implementation.

## The third boundary: tools are product design

A coding agent's tools are its hands. If the hands are vague, the agent behaves vaguely.

A weak tool surface looks like this:

```json
{
  "name": "do_stuff",
  "description": "Run commands and change files.",
  "input": {
    "instructions": "string"
  }
}
```

That pushes the hard decisions back into the model. A better surface separates capabilities:

```json
[
  {
    "name": "read_file",
    "description": "Read a UTF-8 text file inside the workspace.",
    "input": {
      "path": "string"
    }
  },
  {
    "name": "apply_patch",
    "description": "Apply a unified patch to files inside the workspace.",
    "input": {
      "patch": "string"
    }
  },
  {
    "name": "run_tests",
    "description": "Run one approved test command and return a compact result.",
    "input": {
      "command": "npm test | npm run build | pytest"
    }
  }
]
```

The second shape is easier to approve, log, test, and constrain. It also gives the model fewer ways to smuggle unrelated work into one overloaded call.

## What this series will cover

The first post establishes the clean-room boundary. The rest of the series should read like an architecture tour:

- **The harness loop**: model turn, tool call, execution, observation, stop condition.
- **Context assembly**: repo instructions, file excerpts, summaries, task state, and compaction.
- **Tool design**: names, schemas, return contracts, error types, idempotency, and evals.
- **Permissions**: deny, ask, allow, approval fatigue, least privilege, audit logs, and sandboxing.
- **Hooks**: pre-tool, post-tool, pre-compact, post-compact, stop hooks, and policy injection.
- **Subagents**: task isolation, parallel search, delegated review, and parent-child context boundaries.
- **MCP**: moving tool surfaces into explicit protocol servers instead of hardcoding every integration.
- **Evaluation**: scoring a coding agent by behavioral outcomes, not by how polished its transcript sounds.

The through-line is simple: a coding agent is not one clever prompt. It is a product boundary around an LLM.

## What to remember

The leak may be the spark, but it should not be the fuel.

The useful public question is not "what does one proprietary codebase contain?" It is "what architecture does a terminal coding agent need to be useful, inspectable, and bounded?"

That question is answerable without touching leaked code. It is also the one readers can use.

## References

- [Claude Code advanced setup](https://code.claude.com/docs/en/getting-started), official installation, update, authentication, and platform behavior.
- [Claude Code CLI reference](https://code.claude.com/docs/en/cli-usage), official command and flag surface.
- [Claude Code settings](https://code.claude.com/docs/en/settings), official scopes, settings files, permissions, hooks, subagents, MCP, and managed configuration.
- [Claude Code hooks](https://code.claude.com/docs/en/hooks), official extension points around tool use, compaction, and session lifecycle.
- [Claude Code subagents](https://code.claude.com/docs/en/sub-agents), official model for specialized agents with separate context and tool access.
- [Claude Code MCP](https://code.claude.com/docs/en/mcp), official integration path for external tools through Model Context Protocol.
- [Anthropic, "Building effective agents"](https://www.anthropic.com/engineering/building-effective-agents), the workflows versus agents distinction and the simplest-solution-first framing.
- [Anthropic, "How we contain Claude across products"](https://www.anthropic.com/engineering/how-we-contain-claude), the containment framing for agent blast radius.

## Related topics

- [Coding Agent Internals series](../series/coding-agent-internals/)
- [AI Harness Development](../../topics/ai/harness-development/)
- [Context Engineering](../../topics/ai/harness-development/context-engineering/)
- [Tool Design and Schema Discipline](../../topics/ai/harness-development/tool-design/)
- [Permission and Trust Models](../../topics/ai/harness-development/permission-models/)
- [LLMs, agentic AI, and AI agents](../../topics/ai/llm-vs-agentic-ai/)
