---
title: OR-Tools VRP with skill constraints and time windows
description: The home-health routing problem isn't textbook TSP. Clinicians have credentials. Patients have windows. Some visits need an RN, others need an LVN. Here's what OR-Tools actually needs to model that.
date: 2026-04-24
tags: [or-tools, vrp, optimization, cs-challenges]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-or-tools-vrp-with-skill-constraints/
---

## What makes real-world VRP hard

Textbook VRP: one depot, one vehicle type, uniform service times, minimize total distance. Real-world home-health routing:

- Each clinician has credentials (RN, LVN, MA, phlebotomist). Some visits require a specific credential or higher.
- Each patient has a time window: "between 9:00 and 11:00."
- Each clinician has a shift window: 8:00 to 16:00, with a 30-minute lunch.
- Clinicians start at their own home address, not a depot.
- Maximum visits per clinician per day (fatigue, drive fatigue, realism).

Any solver worth using has to express all of these as constraints. OR-Tools does, but you have to build the model carefully.

## The skeleton

```python
from ortools.constraint_solver import pywrapcp, routing_enums_pb2

def solve(clinicians, visits, distance_matrix, time_matrix):
    # Index 0..N-1 are visits. Indices N..N+K-1 are each clinician's
    # start/end node (their home).
    num_nodes = len(visits) + 2 * len(clinicians)
    manager = pywrapcp.RoutingIndexManager(
        num_nodes, len(clinicians),
        starts=[len(visits) + 2*i for i, _ in enumerate(clinicians)],
        ends=[len(visits) + 2*i + 1 for i, _ in enumerate(clinicians)],
    )
    routing = pywrapcp.RoutingModel(manager)
    ...
```

A VRP solver is fundamentally a graph model. Every visit is a node. Every clinician has their own start node and end node, both at that clinician's home address. The solver's job is to pick which visits go on which clinician's path, and in what order.

## Distance callback → travel time

```python
def distance_cb(from_index, to_index):
    from_node = manager.IndexToNode(from_index)
    to_node = manager.IndexToNode(to_index)
    return int(time_matrix[from_node][to_node])  # integer seconds

transit_cb = routing.RegisterTransitCallback(distance_cb)
routing.SetArcCostEvaluatorOfAllVehicles(transit_cb)
```

Two practical notes:

- **Callbacks use node indices, not IDs.** Keep the mapping between your domain model IDs and the solver's 0-based indices in one place.
- **Integer seconds, not floats.** OR-Tools internally uses integer arithmetic for determinism. Multiply by 100 if you need sub-second precision.

## Time windows (the "TW" in VRPTW)

```python
time_dim = "Time"
routing.AddDimension(
    transit_cb,
    slack_max=600,      # up to 10 min idle at a node
    capacity=12*3600,   # 12-hour horizon per clinician
    fix_start_cumul_to_zero=False,
    name=time_dim,
)
dim = routing.GetDimensionOrDie(time_dim)

for visit_idx, visit in enumerate(visits):
    idx = manager.NodeToIndex(visit_idx)
    dim.CumulVar(idx).SetRange(visit.window_start_sec, visit.window_end_sec)

# Shift windows per clinician
for clin_i, clin in enumerate(clinicians):
    start = routing.Start(clin_i)
    end = routing.End(clin_i)
    dim.CumulVar(start).SetRange(clin.shift_start_sec, clin.shift_start_sec)
    dim.CumulVar(end).SetRange(clin.shift_end_sec, 3600, clin.shift_end_sec)
```

The time dimension tracks a cumulative variable at every node, "what's the clock say when we arrive here?" Constraining that variable to a visit's window is how the solver learns the rule. Slack lets a clinician wait if they arrive early.

## Skill matching, the tricky one

OR-Tools doesn't have a built-in "this visit needs credential ≥ LVN." You express it as a **vehicle-disjunction constraint**:

```python
for visit_idx, visit in enumerate(visits):
    allowed_clinicians = [
        i for i, c in enumerate(clinicians)
        if c.has_skill(visit.required_skill)
    ]
    idx = manager.NodeToIndex(visit_idx)
    routing.SetAllowedVehiclesForIndex(allowed_clinicians, idx)
```

Each visit is pinned to a subset of vehicles (clinicians). The solver can't put an RN-only visit on an MA's route. Very clean, and it uses the solver's native propagation rather than penalty terms, which matters for solve speed.

## Let visits be dropped (with a cost)

On a tight day the solver might not be able to fit every visit. Let it drop some, but make each drop expensive:

```python
for visit_idx, visit in enumerate(visits):
    idx = manager.NodeToIndex(visit_idx)
    routing.AddDisjunction([idx], penalty=10_000)
```

A `penalty` in the disjunction is the cost of *not* visiting that node. If the arc cost of detouring to a visit is less than 10,000 seconds, the solver will make the detour. Otherwise it drops. This is how you get "best feasible" instead of "no solution."

## Solver parameters

```python
search = pywrapcp.DefaultRoutingSearchParameters()
search.first_solution_strategy = (
    routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
)
search.local_search_metaheuristic = (
    routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
)
search.time_limit.seconds = 10
solution = routing.SolveWithParameters(search)
```

- **`PATH_CHEAPEST_ARC`** for the initial solution, greedy but fast. Gets you to "feasible" quickly.
- **`GUIDED_LOCAL_SEARCH`** for improvement, the best general-purpose metaheuristic for VRP. Happy to run until your time budget runs out.
- **`time_limit`**, hard wall. 10 seconds for this size (25 clinicians × 80 visits). Production VRP solvers often run 30–60 seconds.

## What OR-Tools doesn't solve for you

- **Distance matrix quality.** Garbage in, garbage out. This project uses haversine × 40 mph, cheap, wrong in specific ways (bridges, highways, traffic), but fine for a portfolio demo. For production, you'd call an actual routing service (Mapbox, Google, OSRM).
- **Warm starts.** Re-solving a nearly-identical problem from scratch is wasteful. OR-Tools supports reading an initial solution from a prior one but you have to plumb it yourself.
- **Infeasibility diagnosis.** If the solver returns no solution, it doesn't tell you *why*. Was the time window too tight? Not enough clinicians with the right skill? You find out by relaxing one constraint at a time.
- **Determinism across versions.** Upgrade OR-Tools and the exact solution changes. For tests, assert on *properties* (total cost bounded, no skill violations) not on exact route ordering.

## How it fits

This VRP runs inside a Celery task (`vrp.optimize_day`) triggered by a button in the ops console. The task fetches visits and clinicians, builds the matrices, solves, and writes `RoutePlan` rows back. The HTTP response is 202 Accepted; the result arrives over a WebSocket.

Full code in [`home-health-provider-skeleton`](https://github.com/waggertron/home-health-provider-skeleton) under `apps/api/scheduling/vrp.py`.

## See also

- [Vehicle Routing Problem topic](../topics/cs/vehicle-routing/), full background on CVRP, VRPTW, PDP
- [Haversine Distance](../topics/cs/haversine-distance/), the matrix this VRP consumes
- [Django Part 9, Async and background tasks](../topics/web/django/part-09-async-and-background-tasks/), Celery and Channels
