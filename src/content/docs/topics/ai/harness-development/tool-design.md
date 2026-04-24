---
title: Tool Design and Schema Discipline
description: How tool argument schemas, descriptions, and error contracts shape model behavior, and why schema drift is a leading cause of production agent failures.
parent: harness-development
tags: [tool-use, mcp, agents]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

The model sees tools through their name, description, and argument schema. Everything else, how the tool is implemented, what it actually does, is invisible until a result comes back. That makes tool design a UX problem for the model, not just an API design problem.

## Key ideas

- **Descriptions are prompts**, The model decides which tool to call based on the description. Vague descriptions produce erratic tool choice. Concrete examples of *when to use* beat abstract capability statements.
- **Argument schemas as guardrails**, Required vs. optional, enum values, min/max constraints all narrow the model's mistake surface. Prefer enums over free-text where possible.
- **Error contracts matter**, A tool that returns `{"error": "bad input"}` tells the model nothing. A tool that returns `{"error": "file_not_found", "path": "...", "hint": "check extension"}` lets the model recover on its own turn.
- **Idempotency and determinism**, Tools that produce different results on identical input confuse planning. Where possible, surface determinism or explicitly label non-determinism.
- **Schema drift**, Production agents silently break when a tool's arg names, defaults, or return shape changes. Version tool schemas and run evals against them.

## References

- [Tool use, Anthropic Claude Docs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [Function calling, OpenAI Docs](https://platform.openai.com/docs/guides/function-calling)
- [MCP (Model Context Protocol), Anthropic](https://modelcontextprotocol.io/)
- [Agentic Engineering Patterns, Simon Willison](https://simonwillison.net/guides/agentic-engineering-patterns/)
