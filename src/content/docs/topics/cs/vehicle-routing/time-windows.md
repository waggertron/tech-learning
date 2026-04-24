---
title: VRP with Time Windows (VRPTW)
description: VRP where each customer must be served within a specified time interval — a hard constraint on when a vehicle can arrive.
parent: vehicle-routing
tags: [vrp, vrptw, time-windows, or-tools]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What's added

Every customer `i` has a time window `[e_i, l_i]`:

- A vehicle may **arrive before `e_i`** but must wait until `e_i` to start service (soft floor).
- A vehicle may **not arrive after `l_i`** — that's infeasible (hard ceiling, standard variant).
- Service takes a known duration `s_i`; after service, the vehicle leaves.

Soft-TW variants exist (penalties for late arrival) but the standard VRPTW uses hard windows.

## The picture

```
Customer time windows (hours past start of day):
    C1  [ 8, 10]       C4  [13, 15]
    C2  [ 9, 11]       C5  [14, 17]
    C3  [11, 13]

A valid route:
    DEPOT --travel 1h--> C1 (arrive 8, wait 0, service 0.5h) --1h-->
           C2 (arrive 9.5, wait 0, service 0.5h) --1.5h-->
           C3 (arrive 11.5, wait 0, service 0.5h) --1.5h-->
           C4 (arrive 13.5, wait 0, service 0.5h) --0.5h-->
           C5 (arrive 14.5, wait 0, service 0.5h) --1h--> DEPOT

Infeasible route (swap C4 and C5):
    ... C3 finished at 12 → travel 1h → arrive C5 at 13 → but C5's window is [14,17]
        → vehicle waits 1h → service 0.5 → leave at 14.5 → travel 1h → arrive C4 at 15.5
        → C4 window was [13,15] → CLOSED → infeasible.
```

Time windows dramatically tighten feasibility: the same set of customers and distances that's trivially solvable as plain VRP can become infeasible once windows are added.

## Solomon's benchmark classes

Solomon (1987) defined 56 benchmark instances, 100 customers each, still the canonical VRPTW test suite:

- **R** — customers placed randomly
- **C** — customers placed in clusters
- **RC** — mix of random and clustered

Each family has tight-window (1) and wide-window (2) subvariants. An algorithm's score on Solomon is commonly reported as `(number of vehicles, total distance)` lexicographically.

## OR-Tools sketch

VRPTW uses the same **dimension** abstraction as CVRP, just with time as the tracked quantity:

```python
# Transit callback for time = travel + service
def time_callback(from_index, to_index):
    from_node = manager.IndexToNode(from_index)
    to_node   = manager.IndexToNode(to_index)
    return travel_time[from_node][to_node] + service_time[from_node]

time_idx = routing.RegisterTransitCallback(time_callback)

# Time dimension — slack is the allowed wait
routing.AddDimension(
    time_idx,
    slack_max=60,               # max 60 minutes of wait per leg
    capacity=1440,              # total time horizon (minutes)
    fix_start_cumul_to_zero=False,
    name="Time",
)
time_dim = routing.GetDimensionOrDie("Time")

# Per-customer time window constraints
for location_idx, (earliest, latest) in enumerate(time_windows):
    if location_idx == depot_idx:
        continue
    index = manager.NodeToIndex(location_idx)
    time_dim.CumulVar(index).SetRange(earliest, latest)

# Depot's own window (vehicle must leave after depot opens / return by closing)
for vehicle_idx in range(num_vehicles):
    index = routing.Start(vehicle_idx)
    time_dim.CumulVar(index).SetRange(depot_open, depot_close)
```

`CumulVar(index)` is the **cumulative time at that stop** — i.e., the arrival time after waiting. Setting its range to `[earliest, latest]` is exactly the time-window constraint.

## Why VRPTW is harder than CVRP

- **Capacity** is a **per-route invariant**: you can check it by summing demands.
- **Time windows** are **per-node ordering constraints**: they interact with sequencing. Two customers whose windows don't overlap force a specific direction. This makes neighborhood moves (2-opt, Or-opt) more likely to break feasibility.

The practical consequence: OR-Tools' default first-solution strategy (`PATH_CHEAPEST_ARC`) often fails to find any feasible solution on tight VRPTW. Try `PARALLEL_CHEAPEST_INSERTION` or `LOCAL_CHEAPEST_INSERTION`, and always set a generous `time_limit` for the metaheuristic phase.

## Gotchas

- **Units matter.** All time values must use the same scale (seconds, minutes, hours). Mixing units is the classic bug.
- **Service time.** Decide if it's charged against the arriving vehicle, and include it in the transit callback.
- **Waiting is allowed.** Arriving before `e_i` is fine; the vehicle simply waits. Model this via `slack_max` on the time dimension.
- **Depot hours.** Don't forget — the depot itself typically has open/close times. Apply a range to `routing.Start(vehicle_idx)` and `routing.End(vehicle_idx)`.
- **Makespan objective.** If you care about the length of the *longest* route (driver shift limits), set `time_dim.SetGlobalSpanCostCoefficient(100)` (or similar).

## References

- [VRP with Time Windows — OR-Tools](https://developers.google.com/optimization/routing/vrptw)
- [Solomon VRPTW benchmarks — SINTEF](https://www.sintef.no/projectweb/top/vrptw/solomon-benchmark/)
- [OR-Tools Dimensions concept](https://developers.google.com/optimization/routing/dimensions)
- Solomon, M. M. (1987). "Algorithms for the vehicle routing and scheduling problems with time window constraints." *Operations Research* 35(2):254–265.
