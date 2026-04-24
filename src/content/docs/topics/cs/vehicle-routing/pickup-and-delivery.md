---
title: Pickup and Delivery (PDP)
description: VRP where nodes come in matched pickup-delivery pairs; pickup must precede delivery and both stops use the same vehicle.
parent: vehicle-routing
tags: [vrp, pdp, pickup-delivery, or-tools]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What's added

Customers come in **paired** nodes: for each pair `(p, d)`, `p` is a pickup location, `d` is a delivery. Two new constraints on top of the base VRP:

1. **Precedence.** Along any vehicle's route, `p` must be visited before its matching `d`.
2. **Same vehicle.** `p` and `d` must be served by the same vehicle, no transfers between trucks.

Pair count can be larger than vehicle count; multiple pairs can share a vehicle.

## The picture

```
Pairs (p → d) with demand 1 each:
    (P1 → D1)  (P2 → D2)  (P3 → D3)  (P4 → D4)

A valid route:
    DEPOT → P1 → P2 → D1 → D2 → P3 → D3 → P4 → D4 → DEPOT
                     └─ Vehicle holds {1,2} here ─┘
                                    └─ holds {3} ─┘ └─ holds {4} ─┘

Invariant: at every moment, the vehicle holds only items whose
pickups have been visited and whose deliveries have not.

Infeasible (delivery before pickup):
    DEPOT → D1 → P1 → ... → DEPOT    ← impossible
```

In many real-world cases (ride-sharing, freight forwarding) there's also an implicit capacity limit: a vehicle holds at most `Q` items at a time. CVRP-style capacity + PDP precedence is the most common real-world combination.

## OR-Tools sketch

OR-Tools exposes the two PDP constraints via dedicated API calls:

```python
# For each (pickup_index, delivery_index) pair:
for pickup_node, delivery_node in pickup_delivery_pairs:
    pickup_index   = manager.NodeToIndex(pickup_node)
    delivery_index = manager.NodeToIndex(delivery_node)

    # 1. Pair the two stops
    routing.AddPickupAndDelivery(pickup_index, delivery_index)

    # 2. Same vehicle constraint
    routing.solver().Add(
        routing.VehicleVar(pickup_index) == routing.VehicleVar(delivery_index)
    )

    # 3. Precedence, pickup cumul ≤ delivery cumul on the time (or distance) dimension
    distance_dim = routing.GetDimensionOrDie("Distance")
    routing.solver().Add(
        distance_dim.CumulVar(pickup_index) <= distance_dim.CumulVar(delivery_index)
    )
```

The `CumulVar` comparison is how precedence is expressed: the cumulative dimension value (distance traveled so far, or elapsed time) at the pickup must be ≤ that at the delivery, which forces pickup-first ordering.

## Capacity + PDP

Layering CVRP capacity on top of PDP is common. The pickup node has demand `+q`; the delivery node has demand `-q`. The **capacity dimension's cumul** at any point along the route equals the current load, positive on pickups, negative on deliveries, never exceeding `Q` at any intermediate step.

```python
def demand_callback(from_index):
    from_node = manager.IndexToNode(from_index)
    return demands[from_node]       # + on pickups, - on deliveries

demand_idx = routing.RegisterUnaryTransitCallback(demand_callback)
routing.AddDimensionWithVehicleCapacity(
    demand_idx,
    slack_max=0,
    vehicle_capacities=[Q] * num_vehicles,
    fix_start_cumul_to_zero=True,
    name="Capacity",
)
```

OR-Tools automatically enforces the capacity constraint at **every node** along every route, so the negative demand at a delivery actually frees up capacity, and subsequent pickups can use that freed capacity.

## Gotchas

- **Pair indices are node indices, not arcs.** Pass the numeric node indices from your manager, not location names.
- **Zero-demand pickups/deliveries are OK.** If a task is "move one person" with implicit demand of 1, make the demand explicit and let the capacity dimension handle it.
- **Precedence is per-dimension.** Use the time dimension for temporal precedence, distance for spatial. Mixing signals produces subtle bugs.
- **Dropped-pair semantics.** If dropping a pickup is allowed, you must also drop its matching delivery, OR-Tools handles this automatically when you use `AddDisjunction` with a penalty on both nodes (see the "dropped visits" pattern on the main variants page).
- **Multi-leg transfers** (cross-docking, hub-and-spoke with transshipment) are **not standard PDP**. The one-vehicle constraint is essential; multi-leg problems need specialized formulations (PDP with transshipment, PDPT).

## Applications

- **Ride-sharing**, passenger pickups and dropoffs, same vehicle constraint is physically enforced.
- **Same-day delivery / parcel relay**, where items can't transfer between couriers.
- **Freight forwarding**, load cross-dock, but the intra-route leg must be one truck.
- **Home care scheduling**, patient pickup from home, drop at clinic, then back home.

## References

- [Pickup and Delivery, OR-Tools](https://developers.google.com/optimization/routing/pickup_delivery)
- [Dial-a-Ride problem (related)](https://en.wikipedia.org/wiki/Dial-a-ride_problem)
- Savelsbergh & Sol (1995). "The General Pickup and Delivery Problem." *Transportation Science* 29(1):17–29.
