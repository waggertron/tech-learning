---
title: Capacitated VRP (CVRP)
description: VRP where each vehicle has a max load and each customer has demand — the most common real-world VRP variant.
parent: vehicle-routing
tags: [vrp, cvrp, capacity, or-tools]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What's added over plain VRP

Two new things:

1. **Each customer `i` has a demand `q_i`** (boxes, weight, volume — one scalar per node).
2. **Each vehicle has a capacity `Q`.** The total demand on any single route cannot exceed `Q`.

Everything else — objective, sequencing, depot — is unchanged from plain VRP. Most real-world delivery problems are at minimum CVRP; skipping capacity is rare outside textbook TSP.

## The picture

A CVRP solution partitions customers such that no route exceeds the vehicle capacity. In the canonical OR-Tools example (16 customers, 4 vehicles, Q = 15 per vehicle), routes end up roughly balanced in total demand — not necessarily balanced in *number* of stops.

```
Capacity Q = 15 per vehicle.

Route A  (load 14):  DEPOT → C2(4) → C5(2) → C9(8) → DEPOT
Route B  (load 13):  DEPOT → C1(3) → C7(6) → C11(4) → DEPOT
Route C  (load 15):  DEPOT → C3(5) → C8(4) → C13(6) → DEPOT
Route D  (load 12):  DEPOT → C4(7) → C6(5) → DEPOT

    Unassigned: (none — every customer is visited)
    Objective:  minimize total distance across all 4 routes
```

## Formulation

Given:

- `n` customers plus 1 depot (index 0), total `n+1` nodes
- Demand `q_i ≥ 0` for `i = 1..n`, `q_0 = 0`
- Cost `c_{ij}` between every pair
- `K` vehicles, capacity `Q`

Decision variable `x_{ij}^k = 1` iff vehicle `k` traverses edge `(i, j)`.

**Minimize** `Σ_k Σ_{i,j} c_{ij} · x_{ij}^k`

Subject to:

- Every customer visited once — inflow and outflow each equal 1 per customer across all vehicles
- Flow conservation at every node — inflow equals outflow per vehicle
- **Capacity** — `Σ_i (Σ_j x_{ij}^k) · q_i ≤ Q` for every vehicle `k`
- Subtour elimination (polynomially many constraints via MTZ or flow formulation)

## OR-Tools sketch

In OR-Tools, you model the capacity constraint as a **dimension**:

```python
from ortools.constraint_solver import pywrapcp, routing_enums_pb2

# 1. Manager translates between node indices and solver variable indices
manager = pywrapcp.RoutingIndexManager(num_locations, num_vehicles, depot=0)

# 2. Routing model — the solver object
routing = pywrapcp.RoutingModel(manager)

# 3. Transit callback — cost of traveling from one node to another
def distance_callback(from_index, to_index):
    from_node = manager.IndexToNode(from_index)
    to_node = manager.IndexToNode(to_index)
    return distance_matrix[from_node][to_node]

transit_idx = routing.RegisterTransitCallback(distance_callback)
routing.SetArcCostEvaluatorOfAllVehicles(transit_idx)

# 4. Demand callback + capacity dimension — this is the CVRP-specific part
def demand_callback(from_index):
    from_node = manager.IndexToNode(from_index)
    return demands[from_node]

demand_idx = routing.RegisterUnaryTransitCallback(demand_callback)
routing.AddDimensionWithVehicleCapacity(
    demand_idx,
    slack_max=0,                       # no overflow allowed
    vehicle_capacities=vehicle_caps,   # list: one capacity per vehicle
    fix_start_cumul_to_zero=True,
    name="Capacity",
)

# 5. Search parameters
params = pywrapcp.DefaultRoutingSearchParameters()
params.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
params.local_search_metaheuristic = routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
params.time_limit.FromSeconds(30)

# 6. Solve
solution = routing.SolveWithParameters(params)
```

The pattern — **register a callback, add a dimension, constrain the dimension** — extends directly to VRPTW (dimension = time) and other variants.

## Common gotchas

- **Integer demands required.** OR-Tools expects integer returns from `demand_callback`. Scale decimal demands (multiply by 10, 100) if needed.
- **`slack_max = 0` on capacity.** Non-zero slack would let some capacity spill over — almost never what you want.
- **Heterogeneous fleet.** Pass a list of per-vehicle capacities to `AddDimensionWithVehicleCapacity`; don't try a single value.
- **Infeasibility on tight fleets.** If total demand exceeds `K × Q`, the problem has no feasible solution. Either add vehicles, allow dropped visits (with penalties), or raise capacity.
- **Multiple depot variant (MDVRP).** Construct the `RoutingIndexManager` with per-vehicle start/end lists instead of a single `depot` arg.

## References

- [Capacity Constraints — OR-Tools](https://developers.google.com/optimization/routing/cvrp)
- [RoutingModel reference — OR-Tools](https://developers.google.com/optimization/reference/constraint_solver/routing)
- [CVRPLIB benchmark sets](https://vrp.atd-lab.inf.puc-rio.br/) — X-class is the current standard
