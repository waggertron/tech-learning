---
title: What I learned from Google's Vehicle Routing Problem docs
description: "Vehicle routing is the traveling-salesman problem with more vehicles and more constraints. A walkthrough of why the search space explodes, what OR-Tools does, and why Clarke-Wright savings is still worth knowing."
date: 2026-04-24
tags: [vrp, optimization, or-tools, til]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-vehicle-routing-problem-intro/
series:
  slug: home-health-routing-system
  order: 5
---

## Context

Spent an afternoon reading through [Google OR-Tools' routing docs](https://developers.google.com/optimization/routing/vrp) and some surrounding papers. OR-Tools means **Operations Research Tools**, Google's open-source optimization library. Writing up the shape of the problem and a few things that surprised me. Full structured notes are in my [Vehicle Routing topic](../../topics/cs/vehicle-routing/). This post is the narrative version.

## The one-line summary

The **Vehicle Routing Problem** (VRP) is **TSP with multiple vehicles and constraints**. You have a depot, a fleet, customers to visit, and a cost matrix. Find the set of routes that minimizes total distance (or the longest single route), subject to constraints like capacity, time windows, and pickup/delivery pairs.

The **Traveling Salesman Problem** (TSP) is the single-route version of the same idea:

> Given a list of cities and the travel cost between every pair, find the cheapest tour that visits every city exactly once and returns to the starting city.

So if TSP is "one salesperson, visit every city once and come home," VRP is "five trucks leave the warehouse, each does its own loop, every customer served exactly once."

For a tiny TSP, brute force is easy to describe. Pick a starting city, try every possible ordering of the remaining cities, add the return trip, and keep the cheapest tour.

```
Depot: A
Stops: B, C, D

Candidate tours:
A -> B -> C -> D -> A
A -> B -> D -> C -> A
A -> C -> B -> D -> A
A -> C -> D -> B -> A
A -> D -> B -> C -> A
A -> D -> C -> B -> A
```

That blows up fast. With one fixed start, the brute-force search checks `(n - 1)!` tours. Ten stops means 362,880 possible tours. Twenty stops means 121,645,100,408,832,000 possible tours. Real delivery, home-health, and field-service problems do not have twenty clean stops with no constraints. They have dozens or thousands.

That is why TSP is the benchmark warning sign for routing: the problem is easy to state, but the exact search space grows factorially. TSP is **NP-hard**, meaning no known algorithm solves every instance quickly as the input grows. VRP is NP-hard too. VRP inherits the hard sequencing problem from TSP, then adds a second decision: which vehicle owns each stop.

```
TSP:
one route, one ordered list

DEPOT -> C4 -> C1 -> C7 -> C2 -> DEPOT

VRP:
many routes, many ordered lists

Truck 1: DEPOT -> C4 -> C1 -> DEPOT
Truck 2: DEPOT -> C7 -> C2 -> DEPOT
Truck 3: DEPOT -> C5 -> C6 -> C3 -> DEPOT
```

That extra partitioning choice is where VRP stops being "just find the best order." The solver has to decide whether C7 belongs with Truck 1 because it is geographically close, with Truck 2 because Truck 2 has capacity left, or with Truck 3 because its time window only fits there.

## Acronym map

The routing literature is dense with initialisms. These are the ones this post uses:

- **OR**: Operations research, the field that studies mathematical optimization, scheduling, queues, routing, and decision problems.
- **OR-Tools**: Operations Research Tools, Google's open-source library for optimization problems.
- **TSP**: Traveling Salesman Problem, one route that visits every stop once and returns to the start.
- **VRP**: Vehicle Routing Problem, multiple routes that together serve the stop set.
- **CVRP**: Capacitated Vehicle Routing Problem, VRP where each vehicle has a maximum load and each stop consumes capacity.
- **VRPTW**: Vehicle Routing Problem with Time Windows, VRP where each stop must be served inside an allowed arrival interval.
- **API**: Application Programming Interface, the functions and classes you call to build the model.
- **LNS**: Large Neighborhood Search, a metaheuristic that repeatedly destroys and repairs part of a solution to escape local traps.
- **MILP**: Mixed-Integer Linear Programming, an exact optimization model with linear constraints and some variables forced to be integers.
- **CVRPLIB**: Capacitated Vehicle Routing Problem Library, a benchmark collection used to compare CVRP solvers.

## What actually surprised me

### 1. The "dimension" abstraction is really good design

OR-Tools could have bolted on capacity, time windows, breaks, and fuel as separate modules. Instead everything that *accumulates along a route* is a **dimension**:

- Capacity dimension → CVRP (demand adds up, vehicle has a max)
- Time dimension → VRPTW (travel plus service time accumulates, each node has a time-window variable)
- Fuel dimension → refueling variant
- Driver hours dimension → break regulations

One abstraction unifies what textbook treatments split into 5–6 unrelated formulations. Reading CVRP and VRPTW source side-by-side, the structure is *almost identical*, swap the callback, rename the dimension.

### 2. Clarke-Wright savings (1964) is still in the toolbox

One of the first things I noticed: OR-Tools' `SAVINGS` first-solution strategy is the Clarke-Wright savings algorithm, published in 1964. It's almost human-readable:

1. Start with one route per customer: `DEPOT → i → DEPOT`.
2. For every pair `(i, j)`, compute savings = `c(DEPOT, i) + c(DEPOT, j) − c(i, j)`. That's how much cost you save by not bouncing back to the depot between them.
3. Sort pairs by savings descending.
4. Merge greedily, respecting capacity.

It doesn't give the best answer. It gives a good starting point that the local-search phase then improves. But 60 years later, it's still the default initial solution for a huge swath of problems. This is a pattern, some heuristics are **shaped like the problem** and don't go obsolete.

### 3. The phase-1 / phase-2 split is worth understanding before touching the API

Every metaheuristic VRP solver does the same two phases:

- **Phase 1, build a feasible solution** (`PATH_CHEAPEST_ARC`, `SAVINGS`, `PARALLEL_CHEAPEST_INSERTION`, …).
- **Phase 2, improve via local search + metaheuristic** (2-opt, Or-opt, Lin-Kernighan, Guided Local Search, Tabu, Simulated Annealing).

When solutions fail, the failure usually traces to one of these. "No feasible solution found" on a tight VRPTW = phase 1 couldn't even get started. Try `PARALLEL_CHEAPEST_INSERTION`. "Solutions are correct but bad" = phase 2 needs more time budget.

### 4. Time windows are qualitatively harder than capacity

Capacity is a per-route invariant: sum the demands on a route, check against `Q`, the vehicle's capacity limit. Time windows are ordering constraints that interact with sequencing. Two customers whose windows don't overlap force a specific order. Moves that are fine under capacity (2-opt, swap, relocate) routinely break feasibility under time windows.

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

- [VRP hub](../../topics/cs/vehicle-routing/), concept, modeling primitives, when VRP is (and isn't) the right frame
- [CVRP](../../topics/cs/vehicle-routing/capacitated/), capacity constraint, full OR-Tools code sketch
- [VRPTW](../../topics/cs/vehicle-routing/time-windows/), time windows, Solomon benchmarks, why it's harder than it looks
- [Pickup and Delivery](../../topics/cs/vehicle-routing/pickup-and-delivery/), pairing constraints, ride-sharing applications
- [Solution approaches](../../topics/cs/vehicle-routing/solution-approaches/), all the metaheuristic machinery, OR-Tools API, when to upgrade

## References I used

- [OR-Tools Routing](https://developers.google.com/optimization/routing/vrp), the starting point
- [Wikipedia VRP](https://en.wikipedia.org/wiki/Vehicle_routing_problem), variant taxonomy
- Dantzig & Ramser 1959, [Truck Dispatching Problem](https://pubsonline.informs.org/doi/10.1287/mnsc.6.1.80), the founding paper
- Clarke & Wright 1964, savings algorithm
- Solomon 1987, VRPTW benchmark
- [CVRPLIB](https://vrp.atd-lab.inf.puc-rio.br/), CVRP benchmark instances
