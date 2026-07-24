---
title: "Agentic systems need ontologies, not just better prompts"
description: "A practical explanation of ontologies for AI agents: what they are, why prompt-only guardrails fail, and how typed entities, relationships, and constraints can stop bad tool calls before they become side effects."
date: 2026-07-23
tags: [ai, agents, ontologies, knowledge-graphs, guardrails]
crosspost: [linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-23-agentic-systems-need-ontologies/
---

Frank Coyle's AI Engineer talk makes a useful architectural point: an agent that can loop and call tools needs a map of the world, not just a longer system prompt.

The short version is this: probabilistic reasoning is good at proposing moves. Formal domain structure is good at rejecting moves that do not make sense. Reliable agentic systems need both.

An ontology is the part that names the domain: the entity types, relationships, properties, and constraints that the system agrees are real. For a support agent, that might mean `Customer`, `Order`, `Refund`, `Ticket`, `owns`, `placed`, `refunds`, `assignedTo`, and rules such as "one refund belongs to exactly one order" or "a closed ticket cannot be assigned to a deleted user."

That sounds academic until the model can act. Once an LLM can issue refunds, query records, assign tasks, send emails, or coordinate subagents, vague natural-language guidance is not enough. The system needs a layer that can say: this tool call has the right JSON shape, but it violates the domain.

## The plain definition

An ontology is a shared, machine-readable model of a domain.

It usually answers four questions:

- **What exists**: entity types such as `Customer`, `Order`, `Invoice`, `Shipment`, `Doctor`, `Patient`, `Claim`, or `Repository`.
- **How those things relate**: relationships such as `placed`, `paidBy`, `assignedTo`, `dependsOn`, `diagnosedWith`, or `owns`.
- **What properties are allowed**: fields such as `status`, `amountCents`, `createdAt`, `role`, and `riskLevel`.
- **What constraints matter**: cardinality, domain, range, state transitions, ownership, disjoint types, required provenance, and allowed side effects.

A schema says what a single object looks like. An ontology says how objects fit together in the world the system is operating in.

That distinction matters for agents because many dangerous actions are structurally valid. A refund request can have a string `orderId`, an integer `amountCents`, and a string `reason`, yet still be wrong because the order belongs to a different customer, was already refunded, or is in a state that cannot be refunded.

## The problem the talk points at

Agentic systems fail differently from chatbots.

A chatbot can hallucinate an answer. An agent can hallucinate a tool call, run it, observe the result, and keep going. The loop gives the model more power, but it also gives failures more room to compound.

The common anti-pattern is trying to repair every failure with more prose:

```
System prompt:
  Be careful.
  Do not refund the wrong order.
  Make sure the customer owns the order.
  Check whether the order was already refunded.
  Ask for help if unsure.
```

That helps, but it is not an architectural boundary. It relies on the same probabilistic component that generated the risky action to also remember every constraint before acting.

An ontology moves part of that burden out of the prompt and into a checkable model:

```
User request
   |
   v
LLM proposes next action
   |
   v
Schema check: is the tool call well shaped?
   |
   v
Ontology check: does the action make sense in this domain?
   |
   v
Execute side effect only after both checks pass
```

The schema boundary catches malformed arguments. The ontology boundary catches domain violations.

## Five levels

### Level 1: a shared vocabulary

At the novice level, an ontology is just a controlled vocabulary.

Instead of each prompt inventing its own words for the same idea, the system agrees on a few terms:

- `Customer` is not the same thing as `User`.
- `Order` is not the same thing as `Shipment`.
- `Refund` is not the same thing as `Coupon`.
- `EscalatedTicket` is a kind of `Ticket`.

This alone reduces ambiguity. A coordinator, subagent, tool, eval, dashboard, and human reviewer can all talk about the same thing.

### Level 2: relationships

The next level is adding relationships.

An agent should not only know that `Customer` and `Order` are valid words. It should know that customers place orders, orders contain line items, refunds apply to orders, and support tickets may reference orders.

That turns a bag of fields into a graph:

```
Customer --PLACED--> Order --HAS_ITEM--> LineItem
    |                     |
    |                     v
    |                Shipment
    |
    v
SupportTicket --REFERENCES--> Order

Refund --REFUNDS--> Order
```

Now the system can ask relationship questions before acting:

- Does this customer own this order?
- Does this refund point to exactly one order?
- Is the ticket about the same account the agent is modifying?
- Did the retrieved document mention the same entity as the tool call?

Vector search is weak at this. It can find similar text. It does not naturally enforce ownership, cardinality, or state transitions.

### Level 3: constraints around tool calls

This is the practical engineering layer.

Keep structured outputs and tool schemas. They still matter. But treat them as the first gate, not the last one.

For an agentic workflow, the stronger pattern is:

1. The model proposes a tool call.
2. A schema validator checks the argument shape.
3. An ontology validator checks entity types, relationships, state, ownership, and cardinality.
4. The tool runs only after validation passes.
5. The output is validated before the system commits it to memory, a graph, or an external service.

This is where ontologies stop being a research term and become production plumbing.

### Level 4: durable context

Prompts are temporary. Ontologies are durable.

An agent's context window may contain the last few steps, retrieved chunks, and tool results. The ontology gives the system a stable domain map outside that window. It can be reused by the next request, the next subagent, the next eval run, and the next product surface.

This is why knowledge graphs keep showing up in agent architecture discussions. A graph is a natural home for entity relationships and provenance:

- What did the agent believe?
- Which source supported that belief?
- Which tool produced the fact?
- Which entity did the fact attach to?
- Which downstream action depended on it?

That history is difficult to preserve in a prompt. It belongs in structured state.

### Level 5: reasoners, shapes, and governance

At the expert level, the ontology is not just documentation. It becomes an executable contract.

RDF gives a graph data model. RDFS adds class, subclass, domain, and range vocabulary. OWL adds richer logical meaning. SHACL adds validation shapes that can check whether an RDF graph conforms to constraints.

You do not need the full stack on day one. Many teams can start with a typed domain model and explicit validators. But the direction matters:

- Start with a vocabulary people can review.
- Add relationships that tools must respect.
- Add constraints that block bad actions.
- Store facts and provenance in a durable graph.
- Assign ownership for the ontology so it stays true as the business changes.

The last point is the hard one. An ontology with no owner becomes stale. A stale ontology is worse than no ontology because the system starts treating old assumptions as enforceable truth.

## A tiny ontology guard in Python

This example is intentionally small. It does not call an LLM. It shows where an ontology guard would sit after a model proposes a tool call and before the system executes a side effect.

```python
from dataclasses import dataclass
from enum import Enum
from typing import Any


class OrderStatus(str, Enum):
    PAID = "paid"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    REFUNDED = "refunded"


@dataclass(frozen=True)
class Customer:
    id: str


@dataclass(frozen=True)
class Order:
    id: str
    customer_id: str
    total_cents: int
    status: OrderStatus


@dataclass(frozen=True)
class Refund:
    id: str
    order_id: str
    amount_cents: int
    reason: str


class OntologyError(ValueError):
    pass


CUSTOMERS = {
    "cus_001": Customer(id="cus_001"),
    "cus_002": Customer(id="cus_002"),
}

ORDERS = {
    "ord_100": Order(
        id="ord_100",
        customer_id="cus_001",
        total_cents=4500,
        status=OrderStatus.DELIVERED,
    ),
    "ord_200": Order(
        id="ord_200",
        customer_id="cus_002",
        total_cents=8800,
        status=OrderStatus.REFUNDED,
    ),
}

REFUNDS_BY_ORDER = {
    "ord_200": Refund(
        id="ref_existing",
        order_id="ord_200",
        amount_cents=8800,
        reason="Already processed",
    )
}

TOOL_SCHEMAS = {
    "issue_refund": {
        "customer_id": str,
        "order_id": str,
        "amount_cents": int,
        "reason": str,
    }
}

ALLOWED_RELATIONSHIPS = {
    ("Customer", "PLACED", "Order"),
    ("Refund", "REFUNDS", "Order"),
}


def check_tool_shape(tool_name: str, args: dict[str, Any]) -> None:
    required = TOOL_SCHEMAS.get(tool_name)
    if required is None:
        raise OntologyError(f"Unknown tool: {tool_name}")

    for field, expected_type in required.items():
        if field not in args:
            raise OntologyError(f"Missing required field: {field}")
        if not isinstance(args[field], expected_type):
            raise OntologyError(f"{field} must be {expected_type.__name__}")


def relationship_allowed(left: str, relationship: str, right: str) -> bool:
    return (left, relationship, right) in ALLOWED_RELATIONSHIPS


def check_refund_ontology(args: dict[str, Any]) -> None:
    customer = CUSTOMERS.get(args["customer_id"])
    order = ORDERS.get(args["order_id"])

    if customer is None:
        raise OntologyError("Customer does not exist")
    if order is None:
        raise OntologyError("Order does not exist")
    if not relationship_allowed("Customer", "PLACED", "Order"):
        raise OntologyError("Customers are not allowed to place orders")
    if order.customer_id != customer.id:
        raise OntologyError("Customer does not own this order")
    if order.status == OrderStatus.REFUNDED:
        raise OntologyError("Order is already refunded")
    if order.id in REFUNDS_BY_ORDER:
        raise OntologyError("Refund cardinality violation")
    if args["amount_cents"] <= 0:
        raise OntologyError("Refund amount must be positive")
    if args["amount_cents"] > order.total_cents:
        raise OntologyError("Refund cannot exceed order total")
    if not relationship_allowed("Refund", "REFUNDS", "Order"):
        raise OntologyError("Refunds are not allowed to point at orders")


def validate_agent_tool_call(tool_name: str, args: dict[str, Any]) -> None:
    check_tool_shape(tool_name, args)

    if tool_name == "issue_refund":
        check_refund_ontology(args)


valid_call = {
    "customer_id": "cus_001",
    "order_id": "ord_100",
    "amount_cents": 2000,
    "reason": "Missing item",
}

wrong_owner_call = {
    "customer_id": "cus_001",
    "order_id": "ord_200",
    "amount_cents": 8800,
    "reason": "Requested by user",
}

validate_agent_tool_call("issue_refund", valid_call)

try:
    validate_agent_tool_call("issue_refund", wrong_owner_call)
except OntologyError as exc:
    print(f"Blocked: {exc}")
```

The wrong-owner call has the right JSON shape. A normal schema validator would accept it. The ontology guard blocks it because the customer, order, refund, ownership, state, and cardinality rules do not line up.

That is the central pattern: do not ask the model to remember every rule at the moment of action. Put the rules in code or a graph-backed validator.

## Where this fits in an agent stack

For a real system, put ontology checks at the boundaries where bad state can enter or leave.

- **Before retrieval**: constrain entity names, tenant boundaries, and document collections so the agent searches the right graph.
- **Before tool execution**: validate tool calls against domain relationships, not just JSON shape.
- **After tool output**: reject facts that do not match allowed entity types, ranges, provenance rules, or state transitions.
- **Before memory writes**: attach facts to stable entity IDs and record the source that supports them.
- **Before delegation**: make coordinators and subagents share the same vocabulary for tasks, entities, and handoff states.

The rule of thumb is simple: if a model output will be parsed by code, validate the shape. If it will change the world, validate the domain.

## When an ontology is worth it

Do not build an ontology because the word sounds serious. Build one when the domain has relationships the model cannot safely infer on the fly.

Good signals:

- The agent can take side effects.
- The domain has ownership rules, permissions, state machines, or compliance boundaries.
- Multiple agents or tools need the same vocabulary.
- Retrieval depends on entity relationships, not just similar text.
- Wrong actions are expensive, private, regulated, or hard to reverse.

Weak signals:

- The system only drafts text for human review.
- The domain has no stable concepts yet.
- The team cannot name who owns the model after launch.
- A smaller typed schema and a few explicit validators would solve the immediate risk.

The first version can be small. A dictionary of entity types and a handful of validators is better than a giant graph nobody trusts.

## What to remember

Prompting is instruction. Ontology is structure.

A prompt can ask an agent to be careful. An ontology can say which entities exist, which relationships are allowed, and which actions violate the domain before a side effect happens.

The point is not to replace LLM reasoning with symbolic logic. The point is to put each part where it is strongest:

- Let the model interpret messy requests, propose plans, and explain tradeoffs.
- Let schemas check object shape.
- Let ontologies check domain meaning.
- Let humans own the rules that would hurt if they were wrong.

That is the useful lesson from Coyle's talk. Agentic systems do not need bigger prompts as much as they need better maps.

## References

- [Frank Coyle, "Why Agentic Systems Need Ontologies," AI Engineer on YouTube](https://www.youtube.com/watch?v=Sir59K8ZDPU), the talk that motivated this post.
- [AI Engineer World's Fair 2026 session abstract](https://www.ai.engineer/worldsfair/2026/llms-full.md), the conference description of the ontology layer, agent failure modes, and hybrid neurosymbolic framing.
- [Analog's AI Engineer 2026 field guide](https://analoghq.ai/aie-2026), a concise independent synthesis of the talk's practical pattern: validate before side effects, reuse existing vocabularies, and treat ontologies as discipline rather than magic.
- [W3C Semantic Web stack](https://www.w3.org/standards/semanticweb/): [RDF 1.1 Concepts](https://www.w3.org/TR/rdf11-concepts/), [RDF Schema 1.1](https://www.w3.org/TR/rdf-schema/), [OWL 2 overview](https://www.w3.org/TR/owl-overview/), and [SHACL](https://www.w3.org/TR/shacl/) are the standards family behind graph data, class relationships, ontology semantics, and validation shapes.
- [Pydantic model validation](https://docs.pydantic.dev/latest/api/base_model/), a practical way to validate tool input shape before deeper domain checks.
- [Graph database implementations](https://neo4j.com/docs/getting-started/graph-database/): Neo4j's nodes and relationships model and [Amazon Neptune's RDF and SPARQL support](https://docs.aws.amazon.com/neptune/latest/userguide/access-graph-sparql.html) are examples of storage layers teams use when the relationship graph needs to persist.

## Related topics

- [LLMs, agentic AI, and AI agents](../../topics/ai/llm-vs-agentic-ai/)
- [AI Harness Development](../../topics/ai/harness-development/)
- [Tool Design](../../topics/ai/harness-development/tool-design/)
- [Structured Outputs](../../topics/ai/prompt-engineering/structured-outputs/)
- [RAG](../../topics/ai/rag/)
