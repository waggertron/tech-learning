---
title: Technology Laws
description: "Named laws and principles every software engineer will encounter: org structure, performance math, estimation, API design, system complexity, code quality, network effects, and security."
category: cs
tags: [software-engineering, principles, architecture, management]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

These are the laws that show up by name in postmortems, design reviews, architecture debates, and retrospectives. Not rules of thumb, not opinions. Named, cited, and battle-tested observations about how software systems and the organizations that build them actually behave.

Each page covers two to five laws that belong together -- same domain, complementary insights, worth reading back to back.

## Pages

- [Team dynamics](./team-dynamics/), Conway's Law (org structure shapes architecture) and Brooks's Law (adding people to a late project makes it later)
- [Performance math](./performance-math/), Amdahl's Law (ceiling on parallel speedup) and Little's Law (L = λW: concurrency, throughput, and latency)
- [UI quantitative laws](./ui-quantitative/), Fitts's Law (target acquisition time) and Hick's Law (decision time vs. number of choices)
- [API design](./api-design/), Hyrum's Law (all observable behavior becomes a contract), Postel's Law (liberal input, conservative output), and POLA (the Principle of Least Astonishment)
- [Metrics and estimation](./metrics-and-estimation/), Goodhart's Law (targets corrupt measures), the Pareto Principle (80/20), Hofstadter's Law (estimates are always wrong even accounting for this), the Ninety-Ninety Rule, and Parkinson's Law
- [Systems thinking](./systems-thinking/), Gall's Law (complexity must evolve from simplicity), the Law of Leaky Abstractions, Chesterton's Fence (understand before removing), and Tesler's Law (complexity is conserved, not eliminated)
- [Code quality](./code-quality/), Kernighan's Law (write debuggable code, not clever code) and the Law of Demeter (only talk to your immediate neighbors)
- [Network effects](./network-effects/), Metcalfe's Law (value scales as n²) and Reed's Law (group-forming networks scale as 2^n)
- [Hardware and software](./hardware-software/), Moore's Law (transistors doubled every two years) and Wirth's Law (software bloat consumed every hardware gain)
- [Security](./security/), Schneier's Law (you cannot fully evaluate the security of your own system)

## How the laws connect

Several of these laws interact directly and are worth reading together:

**Conway's Law + Brooks's Law**: org structure determines architecture, and restructuring under pressure (by adding people) backfires. Together they define the constraints on team-driven technical change.

**Amdahl's Law + Little's Law**: Amdahl caps how much hardware can help. Little's Law quantifies how much concurrency you need at a given throughput and latency. Together they scope capacity planning.

**Goodhart's Law + the Ninety-Ninety Rule**: metrics rot when they become targets, and estimates rot because the last 10% is always the hardest. Together they explain why engineering planning is structurally difficult.

**Gall's Law + Leaky Abstractions**: systems must evolve from working simple systems, and every abstraction in those systems eventually leaks. Together they explain why incremental development with deep knowledge of the stack outperforms clean-slate design.

**Hyrum's Law + POLA**: users depend on whatever they observe (Hyrum), and what they observe should match what they expect (POLA). Together they define what "stable API" means in practice.

## Related topics

- [Named Algorithms](../named-algorithms/), eponymous algorithms worth knowing by sight: same format, different domain
- [System Design](../../system-design/), where several of these laws (Conway, Amdahl, Little, Metcalfe) get applied to concrete architecture problems
- [Microservices vs Monolith](../../system-design/microservices/), Conway's Law applied to service decomposition decisions
