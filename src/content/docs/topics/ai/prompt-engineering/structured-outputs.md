---
title: Structured Outputs
description: JSON mode, schema-constrained decoding, and tool-use / function-calling as ways to eliminate free-form-text fragility.
parent: prompt-engineering
tags: [llm, json, function-calling, tool-use]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

Free-form text output is the most fragile part of an LLM pipeline. Structured outputs replace "ask nicely for JSON, hope for the best" with tokenizer-level constraints that make off-schema output impossible. The spectrum runs from soft (instruction + few-shot) to hard (grammar-constrained decoding, native JSON mode, native tool-use).

## Key ideas

- **Instruction + example (soft)**, Works most of the time; fails on rare inputs or long outputs. Useful as a baseline.
- **JSON mode**, Providers (OpenAI, Anthropic) offer a "return JSON" flag that biases the sampler. Stronger than instructions, weaker than schema enforcement.
- **Schema-constrained decoding**, A JSON Schema (or similar) restricts which tokens can be sampled at each position. Off-schema outputs become literally impossible. Anthropic tool-use and OpenAI's "structured outputs" feature both work this way.
- **Tool use / function calling**, Models emit structured tool calls natively, which is just structured output with a slot for a tool name. Often the right abstraction even when you're not actually calling a tool.
- **Libraries**, Instructor (Python, OpenAI), Outlines (HuggingFace, any model), BAML, Anthropic's native tool-use APIs.

## References

- [Structured Outputs, OpenAI](https://platform.openai.com/docs/guides/structured-outputs)
- [Tool use, Anthropic Claude Docs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [Instructor (Python)](https://python.useinstructor.com/)
- [Outlines (HuggingFace)](https://github.com/dottxt-ai/outlines)
