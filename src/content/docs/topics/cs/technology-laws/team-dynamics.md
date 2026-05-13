---
title: "Team dynamics: Conway's Law and Brooks's Law"
description: "How org structure shapes system architecture, and why adding engineers to a late project makes it later."
parent: technology-laws
tags: [software-engineering, team-dynamics, architecture, management]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

Two laws from the 1960s and 70s that still explain most of what goes wrong in software teams. One describes what you build. The other describes what happens when you try to fix it under pressure.

## Conway's Law

Origin: Melvin Conway, 1968, "How Do Committees Invent?" The law was popularized by Fred Brooks in *The Mythical Man-Month*.

> "Organizations which design systems are constrained to produce designs which are copies of the communication structures of those organizations."

The communication structure of a team becomes the interface structure of its software. Not intentionally. Not by policy. Just by the mechanics of how people coordinate.

**The four-team compiler**: Conway's original illustration. If you put four teams on a compiler, you get a four-pass compiler. Not because four passes is the right design. Because the four teams have four interfaces between them, and those interfaces become the compiler's interfaces. The org chart compiles into the architecture.

**Amazon's two-pizza rule**: Jeff Bezos mandated that no team should be larger than two pizzas can feed (roughly 6-8 people). The intent was organizational: small teams move fast. The side effect was architectural. Small teams own small services. Amazon's microservices architecture wasn't designed top-down. It evolved from the team boundaries. Conway's Law ran in reverse: small bounded teams produced small bounded services.

**The monolith that reflects a silo**: A company has a backend team, a frontend team, and a data team. They build a monolith. Three years later they want to split it into services. The split lines they attempt to draw map almost exactly to the three original team boundaries. The monolith's layers are the org chart rendered in code.

### The Inverse Conway Maneuver

If Conway's Law says architecture follows org structure, the Inverse Conway Maneuver says: restructure the org to get the architecture you want. Want loosely coupled services with clear domain boundaries? Form teams around those domains first. The architecture will follow.

This is why platform engineering teams and stream-aligned teams (Team Topologies vocabulary) are designed deliberately. The team boundaries are the service boundaries.

### Where you'll encounter it

Any microservices migration. Any discussion about team structure in a growing engineering org. Any debate about "who owns the auth service." The question "why does this code look like our org chart?" is Conway's Law in action.

### Common misapplication

Using Conway's Law as a fatalistic excuse: "we can't change the architecture because we'd have to change the org." The Inverse Conway Maneuver exists precisely to flip the causality. You have agency.

---

## Brooks's Law

Origin: Fred Brooks, *The Mythical Man-Month*, 1975.

> "Adding manpower to a late software project makes it later."

This is counterintuitive enough that it needs unpacking. The intuition says: more people equals more work done equals faster delivery. The reality is the opposite, for two compounding reasons.

### Reason 1: Communication overhead

A team of n people has n*(n-1)/2 communication channels. A 5-person team has 10 channels. Add 2 people and you have 21 channels. That's more than double the coordination overhead for a 40% headcount increase.

| Team size | Communication channels |
| --- | --- |
| 3 | 3 |
| 5 | 10 |
| 8 | 28 |
| 10 | 45 |

The channels grow quadratically. Meetings get longer, decisions take more sign-offs, context must be spread across more people.

### Reason 2: Ramp-up cost

Every new engineer on a late project requires onboarding time from the existing engineers. The people who are already behind schedule must stop doing the work to explain the codebase, the decisions already made, the current state of the fire. They lose velocity precisely when they can least afford to.

### In-depth example

A team of 5 engineers is 3 weeks behind on a 6-week project. The project manager adds 3 engineers to help. The 5 original engineers spend the next week onboarding the 3 new ones. Now the team is 4 weeks behind. The new engineers, having had one week of context, are not yet productive enough to recoup that loss. The project ships 5 weeks late instead of 3.

### The exception

Brooks himself noted the law has limits. For tasks that can be cleanly partitioned with no interdependencies, additional people help. The problem is that software tasks near the end of a project are almost never cleanly partitionable. You're fixing integration bugs, doing final testing, handling edge cases that require full system context.

### Where you'll encounter it

Every conversation about "just adding engineers" to a struggling project. Sprint planning when a deadline is approaching. The postmortem where someone asks "why didn't we just hire more people?"

### Common misapplication

Citing Brooks's Law to argue against ever growing a team. It applies specifically to late projects. Adding people early, with clean task partitioning and enough time to ramp, can work fine.

---

## How the two laws interact

Conway's Law explains the shape of what you build. Brooks's Law explains the cost of building it under pressure. Together they suggest: the team structure you choose early determines both the architecture you get and the recovery options you have when things go wrong.

Adding people late is expensive (Brooks). And if you add them in ways that cut across existing team boundaries, you create new coordination paths that Conway's Law will eventually render in code.

---

## References

- Conway, M. (1968). "How Do Committees Invent?" *Datamation*.
- Brooks, F. (1975). *The Mythical Man-Month*. Addison-Wesley.
- Skelton, M. & Pais, M. (2019). *Team Topologies*. IT Revolution Press.
- Nagappan, N. et al. (2008). "The Influence of Organizational Structure on Software Quality." ICSE 2008.

## Related topics

- [Microservices vs Monolith](../../../system-design/microservices/), Conway's Law applied to service boundaries
- [Metrics and Estimation](./metrics-and-estimation/), Goodhart's Law and estimation failures
- [Systems Thinking](./systems-thinking/), Gall's Law and system complexity
