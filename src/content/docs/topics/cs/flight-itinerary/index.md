---
title: "Flight Itinerary with Transfers"
description: "Given a list of flights with departure and arrival times, build a valid trip from source airport to destination airport. Time-respecting paths in a temporal graph: DFS, BFS for fewest layovers, Dijkstra for earliest arrival, plus the time-expanded graph framework that subsumes all three."
category: cs
tags: [graphs, temporal-graphs, dfs, bfs, dijkstra, interview]
status: draft
created: 2026-04-27
updated: 2026-04-27
---

## Problem

You are given:

- `flights`: a list of flights, each `(src, dst, depart, arrive)` where `depart < arrive`. Times can be integers (minutes since epoch) or any totally-ordered type.
- `start`: the source airport.
- `destination`: the destination airport.
- (optional) `earliest_depart`: the earliest time you can leave from `start` (default `-infinity`).
- (optional) `min_connection`: minimum connection time at a transfer airport (default `0`).

Return a valid flight schedule (a list of flights in order) that goes from `start` to `destination`, where each connecting flight departs at `>= previous.arrive + min_connection`. Return `None` (or `[]`) if no such schedule exists.

This is a real Google-style interview problem, sometimes asked as "flight schedule," "flight itinerary," or "find a route through these flights." The straightforward graph traversal you reach for first is wrong because flights have time windows: a flight from B → C at 10:00 is useless if you arrive in B at 11:00.

**Example**

```
flights = [
  ("SFO", "ORD",  600, 1000),    # 10:00 → 16:40 in elapsed minutes
  ("SFO", "DEN",  500,  900),
  ("ORD", "JFK", 1100, 1400),
  ("DEN", "JFK", 1000, 1500),
  ("ORD", "JFK",  900, 1200),    # too early; we couldn't reach ORD by 9:00
]
start = "SFO"
destination = "JFK"
```

Two valid itineraries:

- `SFO → ORD (600→1000)` then `ORD → JFK (1100→1400)`, arrives at 1400
- `SFO → DEN (500→900)` then `DEN → JFK (1000→1500)`, arrives at 1500

The third candidate `ORD → JFK (900→1200)` is invalid because we cannot board it: we arrive in ORD at 1000, and 1000 > 900.

## Why this isn't just BFS or DFS on a static graph

If you ignore times and treat the input as a directed graph with edges `(src, dst)`, BFS finds a path in O(V + E) and you're done. That answer is wrong: edges aren't always available.

Three properties make this problem distinct from the textbook "find a path" problems:

- **Edges are timed.** A flight from A→B is a single specific event, not a relationship that's always usable. The same airport pair can have many edges, each with different departure/arrival.
- **State is `(airport, time)`, not just `airport`.** Reaching ORD at 09:30 is a different state than reaching ORD at 16:00, because different outgoing flights are available from each.
- **You can revisit airports.** A round trip through SFO → DEN → SFO → JFK can be valid if the times line up. Standard DFS visited-set semantics break this.

The right way to think about it: the problem lives on a **time-expanded graph** (sometimes called a "temporal graph" or "time-respecting reachability graph"), not a normal directed graph. We will build up to that view; first, the direct algorithms.

## Setup: the data structures

Throughout, `flights` is an indexable list of `Flight` records. We pre-index them by source airport so we can quickly enumerate "all flights leaving airport X":

```python
from collections import defaultdict
from dataclasses import dataclass

@dataclass(frozen=True)
class Flight:
    src: str
    dst: str
    depart: int
    arrive: int

def index_by_source(flights):
    by_src = defaultdict(list)
    for f in flights:
        by_src[f.src].append(f)
    # Sort each bucket by departure time so we can early-exit.
    for src in by_src:
        by_src[src].sort(key=lambda f: f.depart)
    return by_src
```

Sorting each bucket by departure time costs O(F log F) total, where F = `len(flights)`. It pays for itself in every approach below by allowing early-exits when a flight's departure is too early.

## Approach 1: Recursive DFS, find any valid itinerary

The most natural first cut: from the current airport with the current arrival time, try every outgoing flight that departs late enough and recurse. Track the path; backtrack on dead ends.

```python
def find_itinerary_dfs(flights, start, destination, earliest_depart=0, min_conn=0):
    by_src = index_by_source(flights)               # L1: O(F log F) preprocess
    visited_flights = set()                         # L2: O(1) init

    def dfs(airport, time_here, path):
        if airport == destination:                  # L3: O(1) goal test
            return path
        for f in by_src[airport]:                   # L4: O(deg(airport)) loop
            if f in visited_flights:                # L5: O(1)
                continue
            if f.depart < time_here + min_conn:     # L6: O(1) timing check
                continue                            #     (sorted, so we could break instead)
            visited_flights.add(f)                  # L7: O(1)
            result = dfs(f.dst, f.arrive, path + [f])  # L8: O(1) call + subtree
            if result is not None:
                return result
            visited_flights.remove(f)               # L9: O(1) backtrack
        return None                                 # L10: dead end

    return dfs(start, earliest_depart, [])
```

**Where the time goes, line by line**

*Variables: A = number of distinct airports, F = len(flights), deg(x) = number of flights leaving airport x.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (preprocess) | O(F log F) | 1 | O(F log F) |
| L4 (per-airport loop) | O(deg) per call | up to F nodes in DFS tree | O(F) total edge traversals (with visited) |
| L6 (timing filter) | O(1) | per flight visited | O(F) |
| **L8 (recursion)** | **subtree** | **worst case all F flights** | **O(F)** ← dominates if no pruning |

With the `visited_flights` set, each flight is tried at most once along any one path. Without good pruning the worst-case enumeration of orderings is exponential, but in practice the timing filter cuts the search space dramatically.

**Complexity**

- **Time:** O(F log F) preprocessing + O(F + R) where R is the number of nodes the recursion actually visits. With timing filters R is typically small; in adversarial inputs (every flight chains into every other) it can approach 2^F.
- **Space:** O(F) for the visited set + O(D) recursion depth where D is the longest valid itinerary length.

**When to use:** when "any" valid itinerary is the answer and the input is small or chain-like. Easiest to write; rarely the right call in production.

## Approach 2: BFS, fewest layovers (canonical for "shortest in hops")

If you want the itinerary with the fewest connecting flights, BFS over the same graph but ordered by hop count.

```python
from collections import deque

def find_itinerary_fewest_hops(flights, start, destination, earliest_depart=0, min_conn=0):
    by_src = index_by_source(flights)               # L1: O(F log F)
    # Each frontier entry is (airport, time_here, path).
    queue = deque([(start, earliest_depart, [])])   # L2: O(1) init
    # Best time we have seen at each airport at each hop count.
    seen = {(start, 0): earliest_depart}            # L3: O(1)

    while queue:                                    # L4: O(F) outer loop bound
        airport, time_here, path = queue.popleft()  # L5: O(1)
        if airport == destination:                  # L6: O(1) goal test
            return path
        hops = len(path)
        for f in by_src[airport]:                   # L7: O(deg) per node
            if f.depart < time_here + min_conn:     # L8: O(1) timing
                continue
            key = (f.dst, hops + 1)                 # L9: O(1)
            if key in seen and seen[key] <= f.arrive:  # L10: dominance check
                continue
            seen[key] = f.arrive                    # L11: O(1)
            queue.append((f.dst, f.arrive, path + [f]))  # L12: O(D) (path copy)
    return None
```

**Where the time goes, line by line**

*Variables: A = number of distinct airports, F = len(flights), D = length of the eventual itinerary.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (preprocess) | O(F log F) | 1 | O(F log F) |
| L4 (BFS loop) | O(1) | up to F * A states | O(F · A) |
| **L7 (neighbor scan)** | **O(deg)** | **per state** | **O(F · A)** ← dominates |
| L12 (path append) | O(D) | per enqueue | O(F · A · D) worst case |

The dominance check at L10 keeps the seen-set bounded: at each hop count we only keep the best (earliest-arrival) state per airport. In practice this collapses the explored states to O(A · max_hops).

**Complexity**

- **Time:** O(F log F + F · A) for the search itself; O(F · A · D) if you account for path-list copies. To eliminate the D factor, store predecessors instead of full paths and reconstruct at the end.
- **Space:** O(F · A) for the seen-set + O(F · A · D) for queued path copies, or O(A · max_hops) if you reconstruct from predecessors.

**When to use:** "I have a deadline and want the fewest connections" or "I want the shortest schedule by number of legs."

## Approach 3: Modified Dijkstra, earliest arrival (canonical for "fastest itinerary")

Treat each (airport, arrival_time) as a state. The "cost" is the arrival time. A min-heap pops the earliest reachable state. Standard Dijkstra applies because waiting is free (an extra hour at the airport never makes you arrive sooner).

```python
import heapq

def find_itinerary_earliest_arrival(flights, start, destination, earliest_depart=0, min_conn=0):
    by_src = index_by_source(flights)               # L1: O(F log F)
    # Heap items: (current_time, airport, path).
    heap = [(earliest_depart, start, [])]           # L2: O(1)
    best = {start: earliest_depart}                 # L3: O(1)

    while heap:                                     # L4: O(F log F) outer loop
        time_here, airport, path = heapq.heappop(heap)  # L5: O(log F)
        if airport == destination:                  # L6: O(1) goal test
            return path
        if time_here > best.get(airport, float('inf')):  # L7: stale entry
            continue
        for f in by_src[airport]:                   # L8: O(deg) per pop
            if f.depart < time_here + min_conn:     # L9: O(1) timing
                continue
            if f.arrive < best.get(f.dst, float('inf')):  # L10: relaxation
                best[f.dst] = f.arrive              # L11: O(1)
                heapq.heappush(heap, (f.arrive, f.dst, path + [f]))  # L12: O(log F)
    return None
```

**Where the time goes, line by line**

*Variables: A = number of distinct airports, F = len(flights), D = itinerary length.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (preprocess) | O(F log F) | 1 | O(F log F) |
| L5 (heap pop) | O(log F) | up to F | O(F log F) |
| L8 (neighbor scan) | O(deg) | per pop | O(F) total across all pops |
| **L12 (heap push)** | **O(log F)** | **up to F** | **O(F log F)** ← dominates |

Standard Dijkstra analysis. Each edge is relaxed at most once because the dominance check at L10 short-circuits.

**Complexity**

- **Time:** O((F + A) log F). The `+ A` is the destination check; in dense flight networks F dominates.
- **Space:** O(F + A) for the heap + best-arrival table. O(F · D) if you also store paths inline; reconstruct from predecessors to avoid that.

**When to use:** "What's the earliest I can possibly arrive at JFK?" This is the answer most real travel sites optimize.

## Approach 4: The time-expanded graph (the framework that explains the others)

All three approaches above are searching a **time-expanded graph** (TEG). Making the TEG explicit is the cleanest way to reason about the problem and to handle complications (waiting times, layovers, fares).

Construction:

- For each flight `f = (src, dst, depart, arrive)`, create two nodes: `(src, depart)` and `(dst, arrive)`. Add an edge between them representing the flight.
- For each airport, sort its events by time. Add **waiting edges** between consecutive events at the same airport: from `(airport, t1)` to `(airport, t2)` for `t1 < t2`. Cost is the wait time, but it doesn't affect feasibility.
- Add a virtual source node `S` with an edge to `(start, earliest_depart)` and a virtual sink `T` reached from any `(destination, t)` event.

Now the original problem reduces to **standard reachability or shortest-path on the TEG**:

- "Any itinerary?" → reachability (BFS/DFS).
- "Earliest arrival?" → shortest path with arrival-time as cost (Dijkstra; in fact since waiting edges have nonnegative cost it's plain Dijkstra).
- "Fewest hops?" → BFS counting flight-edges only.
- "Cheapest?" → add fare as edge cost; Dijkstra.
- "Latest possible departure given a deadline?" → reverse the graph and run Dijkstra backward from the destination.

```python
def build_time_expanded_graph(flights, start, destination, earliest_depart=0):
    # Nodes are (airport, time). Edges are (cost, target_node).
    nodes = set()
    edges = defaultdict(list)
    by_airport_time = defaultdict(list)

    for f in flights:
        u = (f.src, f.depart)
        v = (f.dst, f.arrive)
        nodes.add(u); nodes.add(v)
        edges[u].append((f.arrive - f.depart, v, f))
        by_airport_time[f.src].append(f.depart)
        by_airport_time[f.dst].append(f.arrive)

    # Waiting edges: chain consecutive events at the same airport.
    for airport, times in by_airport_time.items():
        times = sorted(set(times))
        for t1, t2 in zip(times, times[1:]):
            edges[(airport, t1)].append((t2 - t1, (airport, t2), None))

    # Virtual source: connect to the first feasible event at `start`.
    src_node = ("__SRC__", earliest_depart)
    nodes.add(src_node)
    for t in sorted(set(by_airport_time[start])):
        if t >= earliest_depart:
            edges[src_node].append((t - earliest_depart, (start, t), None))

    return nodes, edges, src_node
```

**Why bother:** with the TEG built explicitly, every variant becomes a one-liner over a graph library. The downside is that the TEG has up to 2F nodes (one per flight endpoint) plus the waiting edges, so the constant factor is higher. The implicit search in Approach 3 above is asymptotically equivalent and avoids materializing the graph.

**Complexity (build):** O(F log F) sort across all airport-time bucket lists. O(F) nodes, O(F) flight-edges, O(F) waiting-edges → O(F) total graph size.

## Approach 5: Find ALL valid itineraries (DFS with collection)

Sometimes the interviewer asks for *every* valid itinerary, not just one. This is a backtracking variant of Approach 1 that yields paths instead of returning early.

```python
def find_all_itineraries(flights, start, destination, earliest_depart=0, min_conn=0):
    by_src = index_by_source(flights)
    results = []

    def dfs(airport, time_here, path, used):
        if airport == destination:
            results.append(list(path))
            return  # do NOT return early; let other branches also reach dest
        for f in by_src[airport]:
            if f in used:
                continue
            if f.depart < time_here + min_conn:
                continue
            used.add(f)
            path.append(f)
            dfs(f.dst, f.arrive, path, used)
            path.pop()
            used.remove(f)

    dfs(start, earliest_depart, [], set())
    return results
```

**Complexity:** worst case O(F!) when every flight chains into every other; in practice the timing constraint prunes aggressively. For travel-planner UIs you would cap the depth (e.g., max 3 layovers) and rank by some criterion.

## Variants, common interview follow-ups

| Variant | Algorithm | Key change |
| --- | --- | --- |
| Earliest arrival | Approach 3 (Dijkstra) | Cost = arrival time |
| Latest possible departure given a deadline | Reverse-time Dijkstra | Reverse edges, search from destination |
| Fewest layovers | Approach 2 (BFS) | Cost = hop count |
| Cheapest itinerary | Approach 3 with cost = fare | Treat fare as the edge weight |
| Best by Pareto front (price, time, hops) | Multi-objective search | Prune by dominance, return non-dominated set |
| Bounded layovers (≤ K) | Approach 2 + early termination | Stop when hop count > K |
| With minimum connection time | All approaches | Replace `f.depart >= time_here` with `f.depart >= time_here + min_conn` |
| With maximum trip duration | All approaches | Prune when current arrival exceeds threshold |
| Round-trip (return by deadline) | Two Dijkstras: one forward, one reverse | Combine: forward to destination, reverse from destination back to start within remaining time |

## Concepts in this problem

- **Temporal graphs / time-respecting paths.** A path in a temporal graph must traverse edges in non-decreasing time. Standard graph algorithms don't apply directly; you either use the time-expanded reduction or modify the algorithm to carry time as part of the state.
- **State expansion.** When the textbook state space (`airport`) is insufficient, expand it (`(airport, time)` or `(airport, hops)`). This is the same trick used in K-stops shortest path (LeetCode 787) and in dynamic programming with multiple dimensions.
- **Dominance pruning.** Two states `(airport, t1)` and `(airport, t2)` with `t1 < t2` and identical airport: `t2` is strictly dominated; you never need to expand it. Critical to keeping BFS/Dijkstra polynomial.
- **Why standard Dijkstra works here.** The cost (arrival time) is non-decreasing along any path because flights have positive duration and waiting has non-negative cost. No negative edges, so Dijkstra is correct without modification.
- **Why DFS visited-set is subtle.** You can revisit airports; the right "visited" key is the flight (each flight used at most once per itinerary), not the airport.
- **The TEG generalization.** Once you see the time-expanded graph, every "schedule with timing constraints" problem (course scheduling with prerequisites and start dates, train routing, surgery scheduling) is the same problem under a different name.

## Test cases

```python
# Save as test_flight_itinerary.py and run with python3.
from collections import defaultdict
from dataclasses import dataclass

@dataclass(frozen=True)
class Flight:
    src: str
    dst: str
    depart: int
    arrive: int

def index_by_source(flights):
    by_src = defaultdict(list)
    for f in flights:
        by_src[f.src].append(f)
    for src in by_src:
        by_src[src].sort(key=lambda f: f.depart)
    return by_src

def find_itinerary_dfs(flights, start, destination, earliest_depart=0, min_conn=0):
    by_src = index_by_source(flights)
    used = set()
    def dfs(airport, time_here, path):
        if airport == destination:
            return path
        for f in by_src[airport]:
            if f in used or f.depart < time_here + min_conn:
                continue
            used.add(f)
            r = dfs(f.dst, f.arrive, path + [f])
            if r is not None:
                return r
            used.remove(f)
        return None
    return dfs(start, earliest_depart, [])

import heapq
def find_itinerary_earliest_arrival(flights, start, destination, earliest_depart=0, min_conn=0):
    by_src = index_by_source(flights)
    heap = [(earliest_depart, start, [])]
    best = {start: earliest_depart}
    while heap:
        t, airport, path = heapq.heappop(heap)
        if airport == destination:
            return path
        if t > best.get(airport, float('inf')):
            continue
        for f in by_src[airport]:
            if f.depart < t + min_conn:
                continue
            if f.arrive < best.get(f.dst, float('inf')):
                best[f.dst] = f.arrive
                heapq.heappush(heap, (f.arrive, f.dst, path + [f]))
    return None

def _run_tests():
    flights = [
        Flight("SFO", "ORD",  600, 1000),
        Flight("SFO", "DEN",  500,  900),
        Flight("ORD", "JFK", 1100, 1400),
        Flight("DEN", "JFK", 1000, 1500),
        Flight("ORD", "JFK",  900, 1200),  # too early; SFO->ORD lands at 1000
    ]

    # DFS: returns *some* valid itinerary; verify it's valid.
    itin = find_itinerary_dfs(flights, "SFO", "JFK")
    assert itin is not None
    assert itin[0].src == "SFO" and itin[-1].dst == "JFK"
    for a, b in zip(itin, itin[1:]):
        assert a.dst == b.src
        assert b.depart >= a.arrive

    # Earliest arrival: must be the SFO->ORD->JFK route arriving at 1400.
    fastest = find_itinerary_earliest_arrival(flights, "SFO", "JFK")
    assert fastest is not None
    assert fastest[-1].arrive == 1400, fastest

    # Unreachable destination
    assert find_itinerary_dfs(flights, "SFO", "MIA") is None
    assert find_itinerary_earliest_arrival(flights, "SFO", "MIA") is None

    # Direct flight when present
    direct = [Flight("SFO", "JFK", 100, 500)]
    assert find_itinerary_earliest_arrival(direct, "SFO", "JFK")[0].arrive == 500

    # Min connection time blocks a tight transfer
    tight = [
        Flight("SFO", "ORD", 100, 200),
        Flight("ORD", "JFK", 210, 400),  # only 10 min layover
    ]
    assert find_itinerary_earliest_arrival(tight, "SFO", "JFK", min_conn=15) is None
    assert find_itinerary_earliest_arrival(tight, "SFO", "JFK", min_conn=10) is not None

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Pitfalls and gotchas

- **Returning early on visit.** If you mark airports visited (instead of flights), you'll fail to find itineraries that revisit an airport, which is sometimes optimal (rare in flights, common in train problems with backtracking-friendly schedules).
- **Floating-point times.** Use integer minutes since epoch, never floats. Equality checks `f.depart == time_here` should be exact.
- **Time zones.** All times must be normalized to a single zone (UTC). Real flight data ships local times; you must convert.
- **Same-flight chaining.** Some inputs encode a multi-leg flight as a single record with multiple stops; treat each leg as a separate flight or it'll mess up the timing checks.
- **Day boundaries.** "Arrives next day" is encoded as `arrive < depart`. Detect and add 24h if your representation rolls over at midnight.
- **Heap ordering ties.** When two entries pop with equal arrival time, the path you keep depends on insertion order. If determinism matters, break ties on a stable secondary key (e.g., flight count).

## References

- [Time-respecting paths in temporal networks](https://en.wikipedia.org/wiki/Temporal_network), academic framing of the same problem
- [Time-dependent shortest path problem](https://en.wikipedia.org/wiki/Shortest_path_problem#Time-dependent_shortest_paths), generalization where edge weights themselves vary in time
- [LeetCode 787, Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/), the bounded-K variant of this problem with cost optimization

## Related topics

- [Dijkstra's algorithm](../leetcode-150/advanced-graphs/743-network-delay-time/) (Network Delay Time), the textbook implementation we adapt here
- [Cheapest Flights Within K Stops](../leetcode-150/advanced-graphs/787-cheapest-flights-within-k-stops/), the most direct LeetCode analog (different objective, similar state expansion)
- [Reconstruct Itinerary](../leetcode-150/advanced-graphs/332-reconstruct-itinerary/), Eulerian path on a flight graph (different problem, easy to confuse)
- [Heaps / Priority Queues](../data-structures/heaps/), the data structure underneath Dijkstra
- [Graphs](../data-structures/graphs/), adjacency lists, BFS, DFS, the basics we extend with timing
