---
title: Solution approaches
description: Exact vs. metaheuristic methods for VRP, Clarke-Wright savings, 2-opt, Or-opt, Guided Local Search, and the OR-Tools RoutingModel API.
parent: vehicle-routing
tags: [vrp, optimization, heuristics, local-search, or-tools]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## The two families

VRP is NP-hard, so solvers fall into two camps:

- **Exact methods**, mixed-integer linear programming, branch-and-bound, branch-and-cut. Provably optimal; limited to small instances (~30 nodes) in practice for general VRP.
- **Metaheuristics**, build a feasible solution fast, then iteratively improve it. No optimality guarantee; scales to thousands of nodes.

OR-Tools is a metaheuristic solver: it produces **good, fast** answers, not **provably optimal** ones. For the latter, modern tools like VRPSolver and Hexaly are specialized packages.

## Phase 1, first solution strategies

Metaheuristics start from a feasible solution. OR-Tools offers several:

- **`PATH_CHEAPEST_ARC`**, greedy: extend each route with the cheapest unvisited arc. Fast, often myopic.
- **`SAVINGS`**, Clarke-Wright: start with one route per customer; greedily merge pairs of routes when combining them saves cost. Usually better than `PATH_CHEAPEST_ARC` on CVRP.
- **`PARALLEL_CHEAPEST_INSERTION`**, build routes in parallel; each iteration, insert the unvisited customer whose cheapest insertion position across all routes yields the least cost increase.
- **`LOCAL_CHEAPEST_INSERTION`**, like parallel, but commits one customer per step rather than searching all routes.
- **`CHRISTOFIDES`**, based on the TSP approximation algorithm; heavy on MST + matching but historically good.

For VRPTW and tight capacity, `PARALLEL_CHEAPEST_INSERTION` often finds feasible solutions where `PATH_CHEAPEST_ARC` fails.

### Clarke-Wright savings, worth understanding

The savings algorithm is the algorithmic heart of the `SAVINGS` strategy and one of the classic heuristics still in practical use.

1. Start with `n` trivial routes `DEPOT → i → DEPOT` (one per customer).
2. For every pair `(i, j)`, compute the **savings** from merging the two routes that currently contain them:
   ```
   s(i, j) = c(DEPOT, i) + c(DEPOT, j) − c(i, j)
   ```
   This is how much cost is saved by routing `i → j` directly rather than both returning to the depot.
3. Sort pairs by `s(i, j)` descending.
4. Walk the sorted list; merge the two routes containing `i` and `j` if both are still endpoints of their routes and the merge is feasible under capacity.

It's human-readable, runs in O(n² log n), and typically gets within 10–15% of optimum on CVRP.

## Phase 2, local search

Given a feasible solution, local search repeatedly proposes **small structural changes (moves)** and accepts improvements:

- **2-opt**, reverse a contiguous segment of a single route, eliminating crossing edges. Operates inside one route.
- **Or-opt**, relocate a chain of 1–3 consecutive nodes to a different position (same or different route).
- **Relocate**, move a single node to a new position.
- **Exchange**, swap two nodes' positions.
- **Cross-exchange**, swap segments between two routes.
- **Lin-Kernighan style (k-opt)**, generalized segment exchange; the basis of the strongest TSP/VRP heuristics.

Vanilla local search gets stuck in local optima (no single-move improvement available, but the solution isn't globally optimal). Metaheuristics escape these basins.

## Phase 3, metaheuristics

OR-Tools layers these on top of local search:

- **`GUIDED_LOCAL_SEARCH`** (GLS), penalizes frequently-used edges each iteration, pushing the search away from familiar territory. Generally the strongest default for VRP-shape problems.
- **`SIMULATED_ANNEALING`**, accepts worsening moves with probability decreasing over time (the "temperature schedule").
- **`TABU_SEARCH`**, keeps a short memory of recently visited solutions and forbids revisiting them.

Metaheuristics don't terminate naturally. Always set:

```python
params.time_limit.FromSeconds(60)
```

The time budget is the single biggest knob on solution quality. On Solomon instances, GLS typically needs a minute or two; large X-class CVRPLIB instances can benefit from hours.

## OR-Tools RoutingModel, API sketch

The canonical setup has five pieces:

```python
from ortools.constraint_solver import pywrapcp, routing_enums_pb2

# 1. Manager: node index ↔ solver index
manager = pywrapcp.RoutingIndexManager(
    num_locations,
    num_vehicles,
    depot,                    # or per-vehicle start/end lists for MDVRP
)

# 2. Model
routing = pywrapcp.RoutingModel(manager)

# 3. Cost evaluator
def distance(i, j):
    return distance_matrix[manager.IndexToNode(i)][manager.IndexToNode(j)]

transit_idx = routing.RegisterTransitCallback(distance)
routing.SetArcCostEvaluatorOfAllVehicles(transit_idx)

# 4. Dimensions (capacity, time, etc.), register via RegisterUnaryTransitCallback
#    then AddDimensionWithVehicleCapacity or AddDimension.
#    See CVRP and VRPTW subtopics for specifics.

# 5. Search parameters
params = pywrapcp.DefaultRoutingSearchParameters()
params.first_solution_strategy = (
    routing_enums_pb2.FirstSolutionStrategy.PARALLEL_CHEAPEST_INSERTION
)
params.local_search_metaheuristic = (
    routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
)
params.time_limit.FromSeconds(30)

solution = routing.SolveWithParameters(params)
```

Reading the solution: iterate `routing.Start(vehicle_idx)` forward via `solution.Value(routing.NextVar(index))` until you hit the end.

## Briefly: other variants

- **Resource constraints at the depot**, limited loading docks, forcing staggered departures. Model with a **constant dimension** on departure slots.
- **Driver breaks**, model via time-dimension break intervals: `time_dim.SetBreakIntervalsOfVehicle(...)`.
- **Dropped visits / penalties**, `routing.AddDisjunction([index], penalty)` marks a node as optional; skipping costs the given penalty.

## When to upgrade past OR-Tools

- You need **provable optimality** on large instances → VRPSolver, Hexaly, Gurobi with a VRP formulation.
- You have **highly custom constraints** OR-Tools doesn't expose (inter-route coupling, pattern constraints) → roll your own with a constraint programming solver (CP-SAT) or commercial LNS framework.
- You need **real-time rerouting** on streaming updates → consider Insertion-based online algorithms + periodic batch optimization.

For ~90% of VRP work, OR-Tools' metaheuristic path is the right default.

## References

- [Routing Options, OR-Tools](https://developers.google.com/optimization/routing/routing_options), search parameter details
- [Common Routing Tasks, OR-Tools](https://developers.google.com/optimization/routing/routing_tasks), breaks, penalties, disjunctions
- Clarke, G. & Wright, J. W. (1964). "Scheduling of vehicles from a central depot to a number of delivery points." *Operations Research* 12(4):568–581., the savings algorithm.
- Lin, S. & Kernighan, B. W. (1973). "An effective heuristic algorithm for the traveling-salesman problem." *Operations Research* 21(2):498–516.
- Voudouris & Tsang (1999). "Guided local search and its application to the traveling salesman problem." *European Journal of Operational Research*., the paper behind GLS.
