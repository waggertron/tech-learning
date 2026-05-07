---
title: Microservices vs Monolith
description: "When to split a monolith into microservices, how to draw service boundaries using domain-driven design and Conway's Law, the costs of distribution, and why a modular monolith is often the right intermediate step."
parent: system-design
tags: [system-design, microservices, architecture]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

Microservices are frequently proposed as the solution to monolith problems. The reality is more nuanced: microservices solve specific organizational and scaling problems while introducing substantial distributed systems complexity. The decision to split -- and when, and along what lines -- is one of the most consequential architectural choices a team makes.

## What a monolith is

A monolith is a single deployable unit containing all the application's functionality. This is not inherently bad. Monoliths have genuine advantages: simpler development, easier debugging (one log stream, one call stack), cheap cross-cutting concerns (shared transactions, shared in-process calls), and no network overhead between components.

Most successful software starts as a monolith. The problems arise when:
- **Deployments become risky**: a change to any component requires redeploying the entire application
- **Teams step on each other**: multiple teams modifying the same codebase create merge conflicts and coordination overhead
- **Components have incompatible scaling needs**: the image processing component needs GPU instances; the user API needs memory-optimized instances
- **Tech stack lock-in**: one component needs Python (ML); another was written in Java; a monolith cannot mix

## What microservices are

Microservices split an application into independently deployable services, each owning a subset of the domain and its own data store. Services communicate over the network (HTTP, gRPC, or message queues).

```
Monolith:
  [ One process: Users + Orders + Inventory + Payments + Notifications ]
      |
  [ One database ]

Microservices:
  [ User Service ]    [ Order Service ]    [ Inventory Service ]
        |                   |                       |
  [ Users DB ]         [ Orders DB ]         [ Inventory DB ]
                            |
                   [ Payment Service ]    [ Notification Service ]
                            |
                      [ Payments DB ]
```

Each service owns its data. No shared database. Cross-service data access goes through the service's API, not through direct DB queries.

## Conway's Law

"Organizations which design systems are constrained to produce designs which are copies of the communication structures of those organizations." -- Melvin Conway, 1967

If three teams share one codebase, they produce a monolith. If three teams own separate services, the services reflect their team boundaries. This is not just an observation -- it is a design principle.

**Inverse Conway Maneuver**: if you want a particular service architecture, reorganize your teams to match that architecture first. The code will follow. Splitting a service without splitting the team that owns it rarely works -- two teams sharing a service is two teams sharing a monolith.

## Service boundaries: Domain-Driven Design

The hardest part of microservices is drawing the right service boundaries. DDD's concept of **bounded contexts** provides a principled approach.

A bounded context is a part of the domain where a particular domain model applies. The model inside one context may use the same words differently than another context:

- In the **Order context**, a "product" is a line item with a price and quantity
- In the **Inventory context**, a "product" is a physical item with a stock count and warehouse location
- In the **Catalog context**, a "product" is a page with descriptions, images, and SEO metadata

Each context has its own model, its own DB, and ideally its own service. The boundary between contexts is where services communicate.

**Signs that a boundary is in the wrong place**:
- Service A and Service B are almost always deployed together
- A business operation requires a synchronous chain of 5 service calls to complete
- Two services share a database table (implicit coupling)
- Every new feature requires changes to both services

## The costs of distribution

Microservices trade local complexity for distributed complexity. Every RPC between services introduces:

**Latency**: a local function call takes nanoseconds; a network call takes 500 microseconds to 50 milliseconds. A request that chains 10 service calls serially can take 500ms just in network overhead.

**Failure modes**: a local call cannot fail from a network timeout; an RPC can. Every service call introduces a new failure mode that must be handled (timeouts, retries, circuit breakers).

**Data consistency**: a single database transaction is ACID; distributed transactions across services are not. Maintaining consistency across services requires eventual consistency, Saga patterns, or complex coordination.

**Operational complexity**: 10 services means 10 deployment pipelines, 10 monitoring dashboards, 10 sets of logs to correlate. Distributed tracing becomes mandatory.

**Testing complexity**: testing a monolith is straightforward. Testing a service that calls 5 other services requires mocking or running those services locally.

## Monolith vs microservices: when to use each

| Signal | Recommendation |
| --- | --- |
| Team < 10 engineers | Monolith; microservices overhead exceeds benefit |
| Team > 50 engineers across multiple teams | Microservices; Conway's Law makes monolith painful |
| Single scaling bottleneck | Scale that one component vertically or extract it as one service |
| Different scaling needs per component | Microservices; deploy each to appropriate hardware |
| Strong consistency required across operations | Monolith; distributed transactions are hard |
| Independent deployment cadence per feature | Microservices; each team ships on its own schedule |
| Early-stage product with uncertain domain model | Monolith; premature splitting locks in wrong boundaries |

## The modular monolith: the right intermediate step

A modular monolith is a monolith where internal module boundaries are enforced strictly -- no circular dependencies, no cross-module direct DB access, well-defined interfaces between modules.

```python
# Monolith module structure (Python package)
src/
  users/
    service.py      # UserService
    models.py       # User DB model
    api.py          # HTTP endpoints
  orders/
    service.py      # OrderService (calls users.service, NOT users.models directly)
    models.py
    api.py
  payments/
    service.py
```

A modular monolith deploys as one unit but the modules are already organized as if they were services. When you do need to extract a service, the boundary is already defined and tested.

This is what Netflix, Shopify, and Stack Overflow did: maintain a disciplined monolith first, then extract services where scaling or team ownership demands it.

## Extracting a service from a monolith

When you decide to extract a service, the Strangler Fig pattern is the safest approach:

1. Build the new service in parallel with the monolith
2. Route a small percentage of traffic to the new service (canary deployment)
3. Run both in parallel, compare outputs for correctness
4. Gradually shift traffic to the new service (10% -> 50% -> 100%)
5. Remove the old code from the monolith

This avoids the "big bang" rewrite (which almost always fails). The monolith continues to serve traffic throughout. Rollback is easy (just shift traffic back).

```
Before:
  Traffic -> [ Monolith (Users + Orders + Inventory) ]

During extraction:
  Traffic -> [ Router ]
                 |         |
           [ Monolith ]  [ New Inventory Service ]
            (90%)           (10%)

After:
  Traffic -> [ Monolith (Users + Orders) ]  +  [ Inventory Service ]
```

## Key takeaways

**Start with a monolith, extract when you feel the pain.** The organizational and technical costs of microservices are real. A monolith that you can iterate on quickly is more valuable than a premature microservices architecture that slows down every feature. Shopify, Stack Overflow, and Basecamp operate at scale with a monolith.

**Service boundaries come from the domain, not from technical lines.** Splitting by "frontend" and "backend" is not a microservices architecture. Splitting by bounded context (User context, Order context, Payment context) is. DDD's bounded context model is the right tool.

**Conway's Law is more reliable than any technical framework.** If you want independent services, build independent teams first. The code will follow the org chart whether you intend it or not.

**Every service extraction is a distributed systems problem.** Network calls fail, latency adds up, and transactions span trust boundaries. Make sure the problem you are solving with extraction is bigger than the distributed systems complexity you are introducing.

**The modular monolith is not a compromise -- it is often the right answer.** It gives you clean boundaries for testing and future extraction without the operational overhead. Do not skip straight to microservices because they sound sophisticated.

## References

- [Microservices, Martin Fowler](https://martinfowler.com/articles/microservices.html)
- [MonolithFirst, Martin Fowler](https://martinfowler.com/bliki/MonolithFirst.html)
- [Domain-Driven Design, Eric Evans](https://www.domainlanguage.com/ddd/)
- [Building Microservices, Sam Newman](https://samnewman.io/books/building_microservices/)

## Related topics

- [Saga Pattern](../saga-pattern/), distributed transactions across microservices
- [Circuit Breaker](../circuit-breaker/), handling failures in service-to-service calls
- [API Design](../api-design/), service interface design (REST vs gRPC for internal services)
- [Message Queues](../message-queues/), async communication between microservices
