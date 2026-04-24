---
title: Vehicle Routing Problem (VRP)
description: The Vehicle Routing Problem and its common variants (CVRP, VRPTW, Pickup-and-Delivery), concepts, solution approaches, and how Google's OR-Tools frames them.
category: cs
tags: [vrp, optimization, or-tools, routing, combinatorial-optimization]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What is VRP?

The **Vehicle Routing Problem** asks: given a fleet of vehicles based at one or more depots and a set of customer locations to visit, what set of routes minimizes total cost while meeting every constraint? Every vehicle starts and ends at a depot; every customer is visited exactly once (or in some variants, can be skipped for a penalty).

VRP generalizes the **Traveling Salesman Problem** (TSP), TSP is the single-vehicle case. Because TSP is already NP-hard, VRP is too: real-world instances with hundreds of stops aren't solvable by brute force in reasonable time. Dantzig and Ramser introduced the problem in 1959 as the "Truck Dispatching Problem," modeling fuel delivery from a central terminal out to service stations.

### The picture

A canonical VRP solution looks like a hub-and-spoke diagram: one depot in the middle, several closed loops radiating outward, one loop per vehicle:

```
                  [C4]          [C7]
                    \           /
                     \         /
       [C1]---[C2]---[DEPOT]---[C5]---[C6]
                     /   \
                    /     \
                  [C3]    [C8]---[C9]

    Vehicle A: DEPOT → C1 → C2 → DEPOT
    Vehicle B: DEPOT → C3 → DEPOT
    Vehicle C: DEPOT → C4 → C7 → DEPOT
    Vehicle D: DEPOT → C5 → C6 → DEPOT
    Vehicle E: DEPOT → C8 → C9 → DEPOT
```

In the official OR-Tools illustrations, each vehicle's route is drawn in a distinct color to make the partitioning visible. The solver's job is to decide both the **partitioning** (which vehicle visits which customers) and the **sequencing** (in what order).

## Modeling primitives

Every VRP is built from the same building blocks:

| Primitive | Role |
| --- | --- |
| **Depot** | Start and end of every route. One depot (standard VRP) or many (MDVRP). |
| **Customer nodes** | Locations to visit; may carry demand, a time window, or service duration |
| **Vehicles / routes** | Finite fleet; each vehicle produces one closed route from depot back to depot |
| **Cost matrix** | Travel cost between every pair of locations (distance, time, or a weighted mix) |
| **Objective** | Total distance minimized, or the longest single route minimized (makespan), or a weighted sum |
| **Constraints** | Capacity, time windows, precedence, max route duration, vehicle availability |

In OR-Tools, the key abstraction on top of these is a **dimension**, a quantity that accumulates along a route (load carried, elapsed time, fuel used). Constraints are expressed against dimensions rather than against raw costs, which is what lets the same API handle CVRP (dimension = load) and VRPTW (dimension = time) uniformly.

## Variants

1. [Capacitated VRP (CVRP)](./capacitated/), vehicles have a max load; customers have demand
2. [VRP with Time Windows (VRPTW)](./time-windows/), each customer must be visited within an allowed interval
3. [Pickup and Delivery (PDP)](./pickup-and-delivery/), nodes in matched pairs; pickup before delivery, same vehicle
4. [Solution approaches](./solution-approaches/), exact vs. metaheuristics; Clarke-Wright savings, GLS, 2-opt, OR-Tools API sketch

Less common variants covered briefly in the solution-approaches page:

- **VRP with resource constraints**, limited loading docks at the depot, or mandatory driver breaks on long-haul routes
- **VRP with dropped visits / penalties**, each node carries a penalty for being skipped; solver chooses which to serve

## When is VRP the right frame?

Signals that you're in VRP territory:

- Multiple agents (trucks, drivers, couriers, technicians) serving a set of locations
- Each agent has constraints that differ by location (capacity, arrival time windows, pairings)
- You want an answer that's good in reasonable time, not provably optimal

Non-VRP problems that look VRP-shaped:

- **Single vehicle**, that's TSP; use a TSP solver (or VRP with one vehicle).
- **Schedules without geography**, that's usually job-shop scheduling.
- **Continuous placement**, facility location, not routing.

## References

- [Vehicle Routing Problem, Google OR-Tools](https://developers.google.com/optimization/routing/vrp), the starting point; concise and runnable examples
- [Vehicle routing problem, Wikipedia](https://en.wikipedia.org/wiki/Vehicle_routing_problem), variant taxonomy and historical context
- [Dantzig & Ramser 1959, The Truck Dispatching Problem](https://pubsonline.informs.org/doi/10.1287/mnsc.6.1.80), the founding paper
- [CVRPLIB, benchmark instances](https://vrp.atd-lab.inf.puc-rio.br/), 10,000 CVRP instances for comparing algorithms
- [Solomon VRPTW benchmarks, SINTEF](https://www.sintef.no/projectweb/top/vrptw/solomon-benchmark/), canonical VRPTW test suite
- [Vehicle Routing Problem: State-of-the-Art Review (Applied Sciences, 2021)](https://mdpi.com/2076-3417/11/21/10295/html), modern survey
