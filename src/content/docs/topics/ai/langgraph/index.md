---
title: LangGraph, stateful agent workflows
description: "LangGraph's graph model, common uses, and a Python MCP server that exposes a LangGraph workflow as a callable tool."
category: ai
tags: [langgraph, agents, mcp, python]
status: draft
created: 2026-10-08
updated: 2026-10-08
---

LangGraph is a Python and JavaScript library for building stateful applications around language models. You describe work as a graph: nodes run functions or agents, edges choose what runs next, and shared state carries data between steps. It is part of the LangChain ecosystem, but can be used without LangChain.

## What LangGraph is used for

A simple model call usually follows one path from input to output. LangGraph is useful when the path has decisions, repeated work, or state that needs to survive between steps. Common uses include:

- **Tool-using agents**: Call a model, run a requested tool, and return the result to the model.
- **Branching workflows**: Route requests to different nodes based on their contents or earlier results.
- **Human review**: Pause at a checkpoint for approval or edits, then resume.
- **Long-running tasks**: Persist graph state with a checkpointer so work can continue after a process restarts.
- **Multi-agent systems**: Give specialized agents separate nodes and coordinate their handoffs.

LangGraph is the workflow runtime. It does not supply a language model, tools, or an MCP server by itself. Those pieces connect through libraries and services chosen by the application.

## Graph model

A graph has a state schema, nodes, edges, and a starting point. A node receives the current state and returns updates. A normal edge always selects the next node. A conditional edge chooses the next node based on state.

```text
input -> classify -> [answer | lookup] -> format -> output
```

For an agent loop, the conditional edge often checks whether the model asked for a tool. If it did, control moves to a tool node and then back to the model. Otherwise, the graph ends.

Each invocation supplies an initial state. Nodes update it as the graph runs, and the compiled graph returns the final state. To retain state between invocations, compile with a checkpointer and provide a stable `thread_id` in the run configuration. A graph definition alone does not persist conversations or survive a restart.

## Build an MCP server around a LangGraph workflow

MCP, the Model Context Protocol, is a standard interface for clients to discover and call tools exposed by servers. In this example, the MCP server exposes a small LangGraph workflow as a tool named `summarize_text`. The graph itself runs a deterministic summarizer so the example works without model credentials. Replace that node with a model call when the workflow needs generated summaries.

### Install

Use Python 3.10 or later and install LangGraph with the MCP Python SDK:

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install langgraph "mcp[cli]"
```

You can [view the notebook on GitHub](https://github.com/waggertron/tech-learning/blob/main/src/content/docs/topics/ai/langgraph/langgraph-mcp-server.ipynb) or [open it in Google Colab](https://colab.research.google.com/github/waggertron/tech-learning/blob/main/src/content/docs/topics/ai/langgraph/langgraph-mcp-server.ipynb) to run the graph interactively. The notebook contains the workflow, a direct invocation, the MCP tool wrapper, and run instructions.

### Define the graph and MCP tool

Save as `server.py`:

```python
from typing import TypedDict

from langgraph.graph import END, START, StateGraph
from mcp.server.fastmcp import FastMCP


class SummaryState(TypedDict):
    text: str
    summary: str


def summarize(state: SummaryState) -> dict[str, str]:
    """Keep the first sentence as a deliberately simple summary."""
    first_sentence = state["text"].strip().split(".", maxsplit=1)[0]
    return {"summary": first_sentence.strip()}


builder = StateGraph(SummaryState)
builder.add_node("summarize", summarize)
builder.add_edge(START, "summarize")
builder.add_edge("summarize", END)
graph = builder.compile()

mcp = FastMCP("langgraph-summary")


@mcp.tool()
def summarize_text(text: str) -> str:
    """Summarize text by returning its first sentence."""
    result = graph.invoke({"text": text, "summary": ""})
    return result["summary"]


if __name__ == "__main__":
    mcp.run()
```

The graph has one node and two edges. The MCP tool calls `graph.invoke`, then returns the resulting state field. This boundary is useful when a workflow should be available to different MCP clients without embedding graph logic in each client.

### Run and connect

Run the server over standard input and output with:

```bash
python server.py
```

For local development, the MCP Python SDK also provides an Inspector command:

```bash
mcp dev server.py
```

The Inspector can connect to the server and call `summarize_text` with text such as `LangGraph organizes work as stateful graphs. Nodes update shared state.` The tool returns `LangGraph organizes work as stateful graphs`. The notebook runs the graph interactively in Colab and shows the MCP wrapper. Start the server process from a terminal so the notebook kernel stays available.

The example uses the SDK's default stdio transport. A client launches the server process and exchanges MCP messages over its standard input and output. For remote clients, choose an HTTP transport and configure authentication and network access for that deployment.

## Add a language model

The graph node can call a model instead of using the first sentence. For example, install the provider integration you use, instantiate its chat model, then have the node return a generated value:

```python
def summarize(state: SummaryState) -> dict[str, str]:
    response = model.invoke(
        [
            ("system", "Summarize the text in one sentence."),
            ("human", state["text"]),
        ]
    )
    return {"summary": response.content}
```

Here, `model` is the provider's chat model instance, created with the provider integration you install. The graph structure stays the same. In a deployed server, validate input length, handle provider errors, and avoid logging private tool arguments by default.

## When LangGraph fits

Use LangGraph when workflow state and control flow matter: conditional routing, retries, approval pauses, resumable work, or a loop that coordinates tools. A direct function call or a small chain is easier to maintain when every request follows one fixed path. Graph structure adds concepts and persistence choices, so it pays off when the workflow needs those behaviors.

MCP and LangGraph solve different problems. MCP standardizes the interface between a client and a tool server. LangGraph organizes the server's internal work. An MCP server can expose a LangGraph workflow, as above, and a LangGraph application can also call tools hosted by other MCP servers.

## References

- [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [LangGraph quickstart](https://docs.langchain.com/oss/python/langgraph/quickstart)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [MCP documentation](https://modelcontextprotocol.io/docs/getting-started/intro)

## Related topics

- [AI Harness Development](../harness-development/): tool loops, state, permissions, and orchestration
- [Tool design and schema discipline](../harness-development/tool-design/): designing clear tool inputs and outputs
- [LLMs vs. agentic AI vs. AI agents](../llm-vs-agentic-ai/): how an agent relates to the model and its execution loop
- [AI Skill Development](../skill-development/): packaged capabilities an agent can invoke
