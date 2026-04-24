---
title: What I learned from Google's Vehicle Routing Problem docs
description: VRP is TSP with more vehicles and more constraints. A walkthrough of why it's NP-hard, what OR-Tools actually does, and why Clarke-Wright savings is still worth knowing.
date: 2026-04-24
tags: [vrp, optimization, or-tools, til]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-vehicle-routing-problem-intro/
---

## Context

Spent an afternoon reading through [Google OR-Tools' routing docs](https://developers.google.com/optimization/routing/vrp) and some surrounding papers. Writing up the shape of the problem and a few things that surprised me. Full structured notes are in my [Vehicle Routing topic](../topics/cs/vehicle-routing/); this post is the narrative version.

## The one-line summary

VRP is **TSP with multiple vehicles and constraints**. You have a depot, a fleet, customers to visit, and a cost matrix. Find the set of routes that minimizes total distance (or the longest single route), subject to constraints like capacity, time windows, and pickup/delivery pairs.

If TSP is "one salesperson, visit every city once and come home," VRP is "five trucks leave the warehouse, each does its own loop, every customer served exactly once." TSP is NP-hard, so VRP is too.

## What actually surprised me

### 1. The "dimension" abstraction is really good design

OR-Tools could have bolted on capacity, time windows, breaks, and fuel as separate modules. Instead everything that *accumulates along a route* is a **dimension**:

- Capacity dimension → CVRP (demand adds up, vehicle has a max)
- Time dimension → VRPTW (travel + service accumulates, each node has a time window on its cumul var)
- Fuel dimension → refueling variant
- Driver hours dimension → break regulations

One abstraction unifies what textbook treatments split into 5–6 unrelated formulations. Reading CVRP and VRPTW source side-by-side, the structure is *almost identical*, swap the callback, rename the dimension.

### 2. Clarke-Wright savings (1964) is still in the toolbox

One of the first things I noticed: OR-Tools' `SAVINGS` first-solution strategy is the Clarke-Wright savings algorithm, published in 1964. It's almost human-readable:

1. Start with one route per customer: `DEPOT → i → DEPOT`.
2. For every pair `(i, j)`, compute savings = `c(DEPOT, i) + c(DEPOT, j) − c(i, j)`. That's how much cost you save by not bouncing back to the depot between them.
3. Sort pairs by savings descending.
4. Merge greedily, respecting capacity.

It doesn't give the best answer; it gives a good starting point that the local-search phase then improves. But 60 years later, it's still the default initial solution for a huge swath of problems. This is a pattern, some heuristics are **shaped like the problem** and don't go obsolete.

### 3. The phase-1 / phase-2 split is worth understanding before touching the API

Every metaheuristic VRP solver does the same two phases:

- **Phase 1, build a feasible solution** (`PATH_CHEAPEST_ARC`, `SAVINGS`, `PARALLEL_CHEAPEST_INSERTION`, …).
- **Phase 2, improve via local search + metaheuristic** (2-opt, Or-opt, Lin-Kernighan; Guided Local Search, Tabu, Simulated Annealing).

When solutions fail, the failure usually traces to one of these. "No feasible solution found" on a tight VRPTW = phase 1 couldn't even get started; try `PARALLEL_CHEAPEST_INSERTION`. "Solutions are correct but bad" = phase 2 needs more time budget.

### 4. Time windows are qualitatively harder than capacity

Capacity is a per-route invariant: sum the demands on a route, check against `Q`. Time windows are ordering constraints that interact with sequencing. Two customers whose windows don't overlap force a specific order. Moves that are fine under capacity (2-opt, swap, relocate) routinely break feasibility under time windows.

Practical consequence: on tight VRPTW, you often can't use `PATH_CHEAPEST_ARC` as the first-solution strategy, it greedily extends routes and paints itself into corners that violate later windows. `PARALLEL_CHEAPEST_INSERTION` considers all routes simultaneously and is much more likely to find something feasible.

### 5. There's a standard benchmark from 1987 that people still use

Solomon's 1987 VRPTW benchmark, 56 instances, 100 customers each, categorized as R (random), C (clustered), RC (mixed), is the industry-standard test suite. Modern papers still report results on it. Similarly, CVRPLIB's X-class (2014) is the current CVRP standard. These benchmarks are how you answer "is my VRP solver any good."

## If I were going to ship a production VRP solver…

Rough decision tree from what I've read:

- ~100 customers, few constraints, need fast feasibility → OR-Tools with `PARALLEL_CHEAPEST_INSERTION` + `GUIDED_LOCAL_SEARCH` + 30–60 s time limit
- ~1000 customers, tight time windows → OR-Tools with longer time limit, or commercial LNS (Hexaly, Jsprit at scale)
- Must have provable optimality → VRPSolver (research tool) or Gurobi with explicit MILP formulation
- Streaming / online updates → insertion heuristic on arrival + periodic batch re-optimize

For learning: OR-Tools is the right first tool. It's free, Python-accessible, the docs are solid, and it runs the canonical metaheuristics well enough to beat a lot of production systems.

## What's in the topic notes

If you want to go deeper:

- [VRP hub](../topics/cs/vehicle-routing/), concept, modeling primitives, when VRP is (and isn't) the right frame
- [CVRP](../topics/cs/vehicle-routing/capacitated/), capacity constraint, full OR-Tools code sketch
- [VRPTW](../topics/cs/vehicle-routing/time-windows/), time windows, Solomon benchmarks, why it's harder than it looks
- [Pickup and Delivery](../topics/cs/vehicle-routing/pickup-and-delivery/), pairing constraints, ride-sharing applications
- [Solution approaches](../topics/cs/vehicle-routing/solution-approaches/), all the metaheuristic machinery, OR-Tools API, when to upgrade

## References I used

- [OR-Tools Routing](https://developers.google.com/optimization/routing/vrp), the starting point
- [Wikipedia VRP](https://en.wikipedia.org/wiki/Vehicle_routing_problem), variant taxonomy
- Dantzig & Ramser 1959, [Truck Dispatching Problem](https://pubsonline.informs.org/doi/10.1287/mnsc.6.1.80), the founding paper
- Clarke & Wright 1964, savings algorithm
- Solomon 1987, VRPTW benchmark
- [CVRPLIB](https://vrp.atd-lab.inf.puc-rio.br/), CVRP benchmark instances
